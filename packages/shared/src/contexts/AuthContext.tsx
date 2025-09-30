import React, { createContext, useContext, useEffect, useState } from 'react';
import type { UserProfile } from '../types/database';

const AUTH_API_URL = 'http://localhost:3001/api/auth';
const TOKEN_KEY = 'auth_token';

interface AuthContextType {
  user: UserProfile | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signUp: (email: string, password: string, metadata?: any) => Promise<{ error: any }>;
  signOut: () => Promise<{ error: any }>;
  resetPassword: (email: string) => Promise<{ error: any }>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for existing token on mount
    checkAuth();
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
    console.warn('Password reset not implemented yet');
    return { error: 'Not implemented' };
  };

  return (
    <AuthContext.Provider 
      value={{
        user,
        loading,
        signIn,
        signUp,
        signOut,
        resetPassword,
        refreshProfile,
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
