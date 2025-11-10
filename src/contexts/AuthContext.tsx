'use client';

import React, { createContext, useContext, useEffect, useState, useCallback, useRef } from 'react';
import { UserPayload } from '@/lib/auth';
import { useDispatch, useSelector } from 'react-redux';
import { setUser as setUserAction, clearUser as clearUserAction } from '@/redux/features/user/userSlice';
import type { RootState } from '@/redux/store';
import Cookies from 'js-cookie';

interface AuthContextType {
  user: UserPayload | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, firstName: string, lastName: string) => Promise<void>;
  logout: () => Promise<void>;
  refresh: () => Promise<void>;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserPayload | null>(null);
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();
  const [hasChecked, setHasChecked] = useState(false);
  const persistedUser = useSelector((s: RootState) => s.user);

  const isAdmin = user?.role === 'ADMIN';

  // On mount, hydrate from persisted Redux and cookies
  useEffect(() => {
    try {
      const isAuthenticated = Cookies.get('isAuthenticated') === 'true' || localStorage.getItem('isAuthenticated') === 'true';
      const role = Cookies.get('role') || localStorage.getItem('role');
      
      if (persistedUser && persistedUser.role && isAuthenticated) {
        setUser({
          id: String(persistedUser.id || ''),
          email: persistedUser.email || '',
          role: (persistedUser.role as 'USER' | 'ADMIN') || 'USER',
          firstName: persistedUser.firstName || '',
          lastName: persistedUser.lastName || '',
        });
        setHasChecked(true);
        setLoading(false);
        return;
      }
    } catch {}
    setLoading(false);
    setHasChecked(true);
  }, [persistedUser]);

  const login = async (email: string, password: string) => {
    try {
      const response = await fetch('/api/auth/login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email, password }) });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Invalid credentials');

      // Store user data in Redux Persist
      setUser(data.user);
      dispatch(setUserAction({
        id: data.user.id || null,
        email: data.user.email || null,
        firstName: data.user.firstName || 'User',
        lastName: data.user.lastName || null,
        role: (data.user.role as 'USER' | 'ADMIN') ?? null,
      }));

      // Store tokens in localStorage
      localStorage.setItem('token', data.token);
      localStorage.setItem('refreshToken', data.refreshToken);

      // Store isAuthenticated and role in js-cookie
      Cookies.set('isAuthenticated', 'true', { expires: 7, path: '/' });
      Cookies.set('role', data.user.role, { expires: 7, path: '/' });
      Cookies.set('userId', String(data.user.id), { expires: 7, path: '/' });
      Cookies.set('auth-token', data.token, { expires: 7, path: '/' });
      Cookies.set('refresh-token', data.refreshToken, { expires: 7, path: '/' });
      Cookies.set('authorization', `Bearer ${data.token}`, { expires: 7, path: '/' });
      // Also store in localStorage for backup
      localStorage.setItem('isAuthenticated', 'true');
      localStorage.setItem('role', data.user.role);

      setHasChecked(true);
    } catch (error) {
      // If it's already a user-friendly error, re-throw it
      if (error instanceof Error && (
        error.message.includes('Invalid credentials') ||
        error.message.includes('User with this email already exists') ||
        error.message.includes('User not found') ||
        error.message.includes('Unauthorized')
      )) {
        throw error;
      }
      // For any other errors, throw generic message
      throw new Error('Internal Server Error');
    }
  };

  const register = async (email: string, password: string, firstName: string, lastName: string) => {
    try {
      const response = await fetch('/api/auth/register', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email, password, firstName, lastName }) });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Registration failed');
      // Do not auto-login. Email verification is required.
    } catch (error) {
      // If it's already a user-friendly error, re-throw it
      if (error instanceof Error && (
        error.message.includes('User with this email already exists') ||
        error.message.includes('Invalid credentials') ||
        error.message.includes('User not found') ||
        error.message.includes('Unauthorized')
      )) {
        throw error;
      }
      // For any other errors, throw generic message
      throw new Error('Internal Server Error');
    }
  };

  const clearAuthStorage = useCallback(() => {
    try {
      Cookies.remove('isAuthenticated', { path: '/' });
      Cookies.remove('role', { path: '/' });
      Cookies.remove('userId', { path: '/' });
      Cookies.remove('auth-token', { path: '/' });
      Cookies.remove('refresh-token', { path: '/' });
      Cookies.remove('authorization', { path: '/' });
    } catch (error) {
      if (process.env.NODE_ENV !== 'production') {
        console.warn('Failed to clear auth cookies:', error);
      }
    }

    try {
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('isAuthenticated');
      localStorage.removeItem('role');
      localStorage.removeItem('Authentication');
    } catch (error) {
      if (process.env.NODE_ENV !== 'production') {
        console.warn('Failed to clear auth storage:', error);
      }
    }

    setUser(null);
    dispatch(clearUserAction());
  }, [dispatch]);

  const logout = async () => {
    try {
      await fetch('/api/graphql', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: `
            mutation Logout {
              logout
            }
          `,
        }),
      });
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      clearAuthStorage();
    }
  };

  const refresh = async () => {
    // Refresh is no longer needed since we're not using /api/auth/me
    // This function is kept for API compatibility
  };

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const clearAllLocalStorage = () => {
      try {
        // Clear all localStorage data
        localStorage.clear();
      } catch (error) {
        if (process.env.NODE_ENV !== 'production') {
          console.warn('Failed to clear localStorage:', error);
        }
      }

      // Also clear auth storage (cookies)
      clearAuthStorage();
    };

    // Set a flag in sessionStorage when page is about to unload
    // sessionStorage persists across page refreshes but is cleared on tab close
    const handleBeforeUnload = () => {
      try {
        sessionStorage.setItem('isRefreshing', 'true');
      } catch (error) {
        // Ignore errors
      }
    };

    const handlePageHide = (event: PageTransitionEvent) => {
      // If event.persisted is true, it's navigation (back/forward), not a close
      if (event.persisted) {
        return;
      }

      // Check if this is a refresh by looking at sessionStorage
      // If isRefreshing flag exists, it means the page is being refreshed
      // sessionStorage persists across refreshes but is cleared on tab close
      try {
        const isRefreshing = sessionStorage.getItem('isRefreshing');
        if (isRefreshing === 'true') {
          // It's a refresh, don't clear localStorage
          // The flag will be removed on next page load
          return;
        }
      } catch (error) {
        // If we can't access sessionStorage, it might be because tab is closing
        // In this case, we'll clear localStorage to be safe
      }

      // Tab is being closed (not a refresh), clear localStorage
      clearAllLocalStorage();
    };

    // Check on page load if this was a refresh
    // If isRefreshing exists, it means the page was refreshed, so keep localStorage
    try {
      const isRefreshing = sessionStorage.getItem('isRefreshing');
      if (isRefreshing === 'true') {
        // It was a refresh, remove the flag for next time
        sessionStorage.removeItem('isRefreshing');
      }
    } catch (error) {
      // Ignore errors
    }

    // beforeunload fires before pagehide, so we set the flag here
    window.addEventListener('beforeunload', handleBeforeUnload);
    // pagehide is the most reliable event for detecting tab close
    window.addEventListener('pagehide', handlePageHide);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      window.removeEventListener('pagehide', handlePageHide);
    };
  }, [clearAuthStorage]);

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, refresh, isAdmin }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

