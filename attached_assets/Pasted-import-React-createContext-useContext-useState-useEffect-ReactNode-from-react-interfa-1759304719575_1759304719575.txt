import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface User {
  id: string;
  email: string;
  role: 'client' | 'consultant' | 'admin';
  first_name: string;
  last_name: string;
  phone?: string;
  avatar_url?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

interface Profile {
  id: string;
  user_id: string;
  company_name?: string;
  business_type?: string;
  country?: string;
  timezone?: string;
  language?: string;
  notification_preferences?: {
    email: boolean;
    sms: boolean;
    push: boolean;
  };
  billing_address?: {
    street: string;
    city: string;
    state: string;
    postal_code: string;
    country: string;
  };
  created_at: string;
  updated_at: string;
}

interface AuthContextType {
  user: User | null;
  profile: Profile | null;
  token: string | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signUp: (userData: SignUpData) => Promise<{ success: boolean; error?: string }>;
  signOut: () => void;
  updateProfile: (profileData: Partial<Profile>) => Promise<{ success: boolean; error?: string }>;
  refreshToken: () => Promise<boolean>;
  resetPassword: (email: string) => Promise<{ success: boolean; error?: string }>;
  changePassword: (currentPassword: string, newPassword: string) => Promise<{ success: boolean; error?: string }>;
}

interface SignUpData {
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  role: 'client' | 'consultant';
  phone?: string;
  company_name?: string;
  country?: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? 'https://your-backend-domain.com/api' 
  : 'http://localhost:3001/api';

export const CustomAuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    initializeAuth();
  }, []);

  const initializeAuth = async () => {
    try {
      const storedToken = localStorage.getItem('auth_token');
      const storedUser = localStorage.getItem('auth_user');
      const storedProfile = localStorage.getItem('auth_profile');

      if (storedToken && storedUser) {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
        
        if (storedProfile) {
          setProfile(JSON.parse(storedProfile));
        }

        // Verify token validity
        const isValid = await verifyToken(storedToken);
        if (!isValid) {
          clearAuthData();
        }
      }
    } catch (error) {
      console.error('Error initializing auth:', error);
      clearAuthData();
    } finally {
      setLoading(false);
    }
  };

  const verifyToken = async (token: string): Promise<boolean> => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/verify`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        if (data.user) {
          setUser(data.user);
          localStorage.setItem('auth_user', JSON.stringify(data.user));
        }
        if (data.profile) {
          setProfile(data.profile);
          localStorage.setItem('auth_profile', JSON.stringify(data.profile));
        }
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Error verifying token:', error);
      return false;
    }
  };

  const signIn = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      setLoading(true);
      
      const response = await fetch(`${API_BASE_URL}/auth/signin`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();

      if (response.ok) {
        const { token, user, profile } = data;
        
        setToken(token);
        setUser(user);
        setProfile(profile);
        
        localStorage.setItem('auth_token', token);
        localStorage.setItem('auth_user', JSON.stringify(user));
        if (profile) {
          localStorage.setItem('auth_profile', JSON.stringify(profile));
        }

        return { success: true };
      } else {
        return { success: false, error: data.message || 'Sign in failed' };
      }
    } catch (error) {
      console.error('Sign in error:', error);
      return { success: false, error: 'Network error occurred' };
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (userData: SignUpData): Promise<{ success: boolean; error?: string }> => {
    try {
      setLoading(true);
      
      const response = await fetch(`${API_BASE_URL}/auth/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(userData)
      });

      const data = await response.json();

      if (response.ok) {
        const { token, user, profile } = data;
        
        setToken(token);
        setUser(user);
        setProfile(profile);
        
        localStorage.setItem('auth_token', token);
        localStorage.setItem('auth_user', JSON.stringify(user));
        if (profile) {
          localStorage.setItem('auth_profile', JSON.stringify(profile));
        }

        return { success: true };
      } else {
        return { success: false, error: data.message || 'Sign up failed' };
      }
    } catch (error) {
      console.error('Sign up error:', error);
      return { success: false, error: 'Network error occurred' };
    } finally {
      setLoading(false);
    }
  };

  const signOut = () => {
    clearAuthData();
    
    // Optional: Call backend to invalidate token
    if (token) {
      fetch(`${API_BASE_URL}/auth/signout`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      }).catch(error => console.error('Error signing out on backend:', error));
    }
  };

  const clearAuthData = () => {
    setUser(null);
    setProfile(null);
    setToken(null);
    localStorage.removeItem('auth_token');
    localStorage.removeItem('auth_user');
    localStorage.removeItem('auth_profile');
  };

  const updateProfile = async (profileData: Partial<Profile>): Promise<{ success: boolean; error?: string }> => {
    if (!token) {
      return { success: false, error: 'Not authenticated' };
    }

    try {
      const response = await fetch(`${API_BASE_URL}/auth/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(profileData)
      });

      const data = await response.json();

      if (response.ok) {
        const updatedProfile = { ...profile, ...data.profile };
        setProfile(updatedProfile);
        localStorage.setItem('auth_profile', JSON.stringify(updatedProfile));
        return { success: true };
      } else {
        return { success: false, error: data.message || 'Profile update failed' };
      }
    } catch (error) {
      console.error('Profile update error:', error);
      return { success: false, error: 'Network error occurred' };
    }
  };

  const refreshToken = async (): Promise<boolean> => {
    if (!token) return false;

    try {
      const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        const newToken = data.token;
        
        setToken(newToken);
        localStorage.setItem('auth_token', newToken);
        return true;
      } else {
        clearAuthData();
        return false;
      }
    } catch (error) {
      console.error('Token refresh error:', error);
      clearAuthData();
      return false;
    }
  };

  const resetPassword = async (email: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/reset-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email })
      });

      const data = await response.json();

      if (response.ok) {
        return { success: true };
      } else {
        return { success: false, error: data.message || 'Password reset failed' };
      }
    } catch (error) {
      console.error('Password reset error:', error);
      return { success: false, error: 'Network error occurred' };
    }
  };

  const changePassword = async (currentPassword: string, newPassword: string): Promise<{ success: boolean; error?: string }> => {
    if (!token) {
      return { success: false, error: 'Not authenticated' };
    }

    try {
      const response = await fetch(`${API_BASE_URL}/auth/change-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ currentPassword, newPassword })
      });

      const data = await response.json();

      if (response.ok) {
        return { success: true };
      } else {
        return { success: false, error: data.message || 'Password change failed' };
      }
    } catch (error) {
      console.error('Password change error:', error);
      return { success: false, error: 'Network error occurred' };
    }
  };

  // Auto-refresh token before expiry
  useEffect(() => {
    if (!token) return;

    const refreshInterval = setInterval(async () => {
      await refreshToken();
    }, 15 * 60 * 1000); // Refresh every 15 minutes

    return () => clearInterval(refreshInterval);
  }, [token]);

  const value: AuthContextType = {
    user,
    profile,
    token,
    loading,
    signIn,
    signUp,
    signOut,
    updateProfile,
    refreshToken,
    resetPassword,
    changePassword
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within a CustomAuthProvider');
  }
  return context;
};

// HTTP interceptor for automatic token attachment
export const createAuthenticatedFetch = (token: string) => {
  return async (url: string, options: RequestInit = {}) => {
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
      ...options.headers
    };

    return fetch(url, {
      ...options,
      headers
    });
  };
};

// Supabase client wrapper for custom auth
export const createSupabaseClient = (token: string) => {
  // This would be used to create a Supabase client with custom auth
  // You'll need to implement RLS policies that check for custom JWT
  return {
    from: (table: string) => ({
      select: (columns?: string) => ({
        eq: (column: string, value: any) => ({
          // Custom implementation that adds Authorization header
        })
      })
    })
  };
};

export default CustomAuthProvider;