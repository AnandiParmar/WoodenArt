'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { UserPayload } from '@/lib/auth';
import { useDispatch } from 'react-redux';
import { setUser as setUserAction, clearUser as clearUserAction } from '@/redux/features/user/userSlice';

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
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const [hasChecked, setHasChecked] = useState(false);

  const isAdmin = user?.role === 'ADMIN';

  // Don't auto-check on mount - only check when explicitly called (login, refresh, etc.)
  useEffect(() => {
    setLoading(false);
    setHasChecked(true);
  }, []);

  const checkAuth = async (retryAfterRefresh = false) => {
    // Prevent multiple simultaneous calls
    if (loading && !retryAfterRefresh) return;
    
    setLoading(true);
    try {
      const response = await fetch('/api/auth/me');
      if (response.ok) {
        const data = await response.json();
        if (data.user) {
          setUser(data.user);
          // Mirror into Redux
          dispatch(setUserAction({
            id: Number(data.user.id) || null,
            email: data.user.email || null,
            firstName: data.user.firstName || null,
            lastName: data.user.lastName || null,
            role: (data.user.role as 'USER' | 'ADMIN') ?? null,
          }));
          setHasChecked(true);
          setLoading(false);
          return;
        }
      }

      // Only try refresh if this is the first attempt (not after refresh)
      if (!retryAfterRefresh) {
        const refreshToken = localStorage.getItem('refreshToken');
        if (refreshToken) {
          try {
            const refreshResp = await fetch('/api/graphql', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                query: `mutation Refresh($refreshToken: String!) { refreshToken(refreshToken: $refreshToken) { token } }`,
                variables: { refreshToken },
              }),
            });
            const refreshData = await refreshResp.json();
            if (refreshData.data?.refreshToken?.token) {
              const token: string = refreshData.data.refreshToken.token;
              document.cookie = `auth-token=${token}; path=/; max-age=${60 * 60}; secure=${process.env.NODE_ENV === 'production'}; samesite=lax`;
              localStorage.setItem('token', token);
              // Re-try me only once with flag
              await checkAuth(true);
              return;
            } else {
              // Refresh failed, clear invalid tokens
              localStorage.removeItem('refreshToken');
              localStorage.removeItem('token');
              document.cookie = 'auth-token=; path=/; max-age=0';
            }
          } catch (refreshError) {
            // Refresh failed, clear invalid tokens
            localStorage.removeItem('refreshToken');
            localStorage.removeItem('token');
            document.cookie = 'auth-token=; path=/; max-age=0';
          }
        }
      }

      // No user found, clear state
      setUser(null);
      dispatch(clearUserAction());
    } catch (error) {
      console.error('Auth check failed:', error);
      setUser(null);
      dispatch(clearUserAction());
    } finally {
      setLoading(false);
      setHasChecked(true);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const response = await fetch('/api/auth/login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email, password }) });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Invalid credentials');

      // Set user data directly from login response (no need to call /api/auth/me)
      setUser(data.user);
      dispatch(setUserAction({
        id: Number(data.user.id) || null,
        email: data.user.email || null,
        firstName: data.user.firstName || 'User',
        lastName: data.user.lastName || null,
        role: (data.user.role as 'USER' | 'ADMIN') ?? null,
      }));
      localStorage.setItem('token', data.token);
      localStorage.setItem('refreshToken', data.refreshToken);
      document.cookie = `auth-token=${data.token}; path=/; max-age=${60 * 60}; secure=${process.env.NODE_ENV === 'production'}; samesite=lax`;
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
      // Clear cookie + storage
      document.cookie = 'auth-token=; path=/; max-age=0';
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
      setUser(null);
      dispatch(clearUserAction());
    }
  };

  const refresh = async () => {
    await checkAuth();
  };

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

