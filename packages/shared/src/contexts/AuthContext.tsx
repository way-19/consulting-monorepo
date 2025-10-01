import React, { createContext, useContext, useEffect, useState } from 'react';
import type { UserProfile } from '../types/database';

const AUTH_API_URL = '/api/auth';
const TOKEN_KEY = 'auth_token';

interface AuthContextType {
  user: UserProfile | null;
  profile: UserProfile | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signUp: (email: string, password: string, metadata?: any) => Promise<{ error: any }>;
  signOut: () => Promise<{ error: any }>;
  resetPassword: (email: string) => Promise<{ error: any }>;
  refreshProfile: () => Promise<void>;
  enableMfa: (verificationCode?: string) => Promise<{ data?: any; error?: any }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for existing token on mount
    checkAuth();

    // Auto-refresh token every 6 days (token expires in 7 days)
    const refreshInterval = setInterval(async () => {
      const token = localStorage.getItem(TOKEN_KEY);
      if (token) {
        try {
          const response = await fetch(`${AUTH_API_URL}/refresh`, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });

          if (response.ok) {
            const data = await response.json();
            localStorage.setItem(TOKEN_KEY, data.token);
            console.log('Token refreshed successfully');
          } else {
            console.error('Token refresh failed, logging out');
            signOut();
          }
        } catch (error) {
          console.error('Token refresh error:', error);
          signOut();
        }
      }
    }, 6 * 24 * 60 * 60 * 1000); // 6 days in milliseconds

    return () => clearInterval(refreshInterval);
  }, []);

  const checkAuth = async () => {
    const token = localStorage.getItem(TOKEN_KEY);
    
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`${AUTH_API_URL}/me`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
      } else {
        // Invalid token, clear it
        localStorage.removeItem(TOKEN_KEY);
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      localStorage.removeItem(TOKEN_KEY);
    } finally {
      setLoading(false);
    }
  };

  const refreshProfile = async () => {
    await checkAuth();
  };

  const signIn = async (email: string, password: string) => {
    try {
      const response = await fetch(`${AUTH_API_URL}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();

      if (!response.ok) {
        return { error: data.error || 'Login failed' };
      }

      // Save token and user
      localStorage.setItem(TOKEN_KEY, data.token);
      setUser(data.user);

      return { error: null };
    } catch (error: any) {
      return { error: error.message || 'Network error' };
    }
  };

  const signUp = async (email: string, password: string, metadata?: any) => {
    try {
      const response = await fetch(`${AUTH_API_URL}/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email,
          password,
          first_name: metadata?.first_name || '',
          last_name: metadata?.last_name || '',
          role: metadata?.role || 'client'
        })
      });

      const data = await response.json();

      if (!response.ok) {
        return { error: data.error || 'Registration failed' };
      }

      // Save token and user
      localStorage.setItem(TOKEN_KEY, data.token);
      setUser(data.user);

      return { error: null };
    } catch (error: any) {
      return { error: error.message || 'Network error' };
    }
  };

  const signOut = async () => {
    try {
      const token = localStorage.getItem(TOKEN_KEY);
      
      if (token) {
        await fetch(`${AUTH_API_URL}/logout`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
      }

      localStorage.removeItem(TOKEN_KEY);
      setUser(null);

      return { error: null };
    } catch (error: any) {
      return { error: error.message || 'Logout failed' };
    }
  };

  const resetPassword = async (email: string) => {
    // TODO: Implement password reset functionality
    console.warn('Password reset not implemented yet for:', email);
    return { error: 'Not implemented' };
  };

  const enableMfa = async (_verificationCode?: string) => {
    // TODO: Implement MFA functionality
    console.warn('MFA not implemented yet');
    return { error: 'Not implemented' };
  };

  return (
    <AuthContext.Provider 
      value={{
        user,
        profile: user,
        loading,
        signIn,
        signUp,
        signOut,
        resetPassword,
        refreshProfile,
        enableMfa,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Backward compatibility aliases
export { useAuth as useAuthContext };

// Authenticated fetch helper
export const createAuthenticatedFetch = () => {
  return async (url: string, options: RequestInit = {}) => {
    const token = localStorage.getItem(TOKEN_KEY);
    
    if (!token) {
      throw new Error('No authentication token found');
    }

    // Don't override Content-Type if already set (for file uploads, etc.)
    const headers: Record<string, string> = {
      ...options.headers as Record<string, string>,
      'Authorization': `Bearer ${token}`,
    };

    // Only add Content-Type if not set and body is present
    if (!options.headers || !('Content-Type' in options.headers)) {
      if (options.body && typeof options.body === 'string') {
        headers['Content-Type'] = 'application/json';
      }
    }

    const response = await fetch(url, {
      ...options,
      headers,
    });

    if (response.status === 401 || response.status === 403) {
      // Token expired or invalid, clear and redirect to login
      localStorage.removeItem(TOKEN_KEY);
      window.location.href = '/login';
      throw new Error('Session expired');
    }

    return response;
  };
};
