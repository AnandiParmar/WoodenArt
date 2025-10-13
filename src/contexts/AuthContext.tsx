'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { UserPayload } from '@/lib/auth';

interface AuthContextType {
  user: UserPayload | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, firstName: string, lastName: string) => Promise<void>;
  logout: () => Promise<void>;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserPayload | null>(null);
  const [loading, setLoading] = useState(true);

  const isAdmin = user?.role === 'ADMIN';

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      // Try to use access token from localStorage/cookie via GraphQL me
      const response = await fetch('/api/graphql', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: `
            query Me {
              me {
                id
                email
                firstName
                lastName
                role
              }
            }
          `,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.data?.me) {
          setUser(data.data.me);
          return;
        }
      }

      // If me failed, try refresh flow
      const refreshToken = localStorage.getItem('refreshToken');
      if (refreshToken) {
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
          // Re-try me
          await checkAuth();
          return;
        }
      }
    } catch (error) {
      console.error('Auth check failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const response = await fetch('/api/graphql', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: `
            mutation Login($input: LoginInput!) {
              login(input: $input) {
                user {
                  id
                  email
                  firstName
                  lastName
                  role
                }
                token
                refreshToken
              }
            }
          `,
          variables: {
            input: { email, password }
          }
        }),
      });

      const data = await response.json();

      if (data.errors) {
        // Check if it's a specific user error (like invalid credentials)
        const errorMessage = data.errors[0].message || '';
        if (errorMessage.includes('Invalid credentials') || 
            errorMessage.includes('User with this email already exists') ||
            errorMessage.includes('User not found') ||
            errorMessage.includes('Unauthorized')) {
          throw new Error(errorMessage);
        }
        // For any other errors (like database connection issues), show generic message
        throw new Error('Internal Server Error');
      }

      if (data.data?.login) {
        setUser(data.data.login.user);
        // Persist tokens
        const token: string = data.data.login.token;
        const refreshToken: string = data.data.login.refreshToken;
        localStorage.setItem('token', token);
        localStorage.setItem('refreshToken', refreshToken);
        // Cookie for middleware (1h)
        document.cookie = `auth-token=${token}; path=/; max-age=${60 * 60}; secure=${process.env.NODE_ENV === 'production'}; samesite=lax`;
      }
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
      const response = await fetch('/api/graphql', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: `
            mutation Register($input: RegisterInput!) {
              register(input: $input) {
                user {
                  id
                  email
                  firstName
                  lastName
                  role
                }
                token
                refreshToken
              }
            }
          `,
          variables: {
            input: { email, password, firstName, lastName }
          }
        }),
      });

      const data = await response.json();

      if (data.errors) {
        // Check if it's a specific user error (like email already exists)
        const errorMessage = data.errors[0].message || '';
        if (errorMessage.includes('User with this email already exists') ||
            errorMessage.includes('Invalid credentials') ||
            errorMessage.includes('User not found') ||
            errorMessage.includes('Unauthorized')) {
          throw new Error(errorMessage);
        }
        // For any other errors (like database connection issues), show generic message
        throw new Error('Internal Server Error');
      }

      if (data.data?.register) {
        setUser(data.data.register.user);
        // Persist tokens
        const token: string = data.data.register.token;
        const refreshToken: string = data.data.register.refreshToken;
        localStorage.setItem('token', token);
        localStorage.setItem('refreshToken', refreshToken);
        document.cookie = `auth-token=${token}; path=/; max-age=${60 * 60}; secure=${process.env.NODE_ENV === 'production'}; samesite=lax`;
      }
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
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, isAdmin }}>
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

