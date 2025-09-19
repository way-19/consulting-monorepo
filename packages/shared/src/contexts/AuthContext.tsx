import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';
import type { UserProfile } from '../types/database';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  profile: UserProfile | null;
  role: string | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signUp: (email: string, password: string, metadata?: any) => Promise<{ error: any }>;
  signOut: () => Promise<{ error: any }>;
  resetPassword: (email: string) => Promise<{ error: any }>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [role, setRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log('Initial session:', session?.user?.email);
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        // Create minimal profile immediately to prevent loading loops
        const minimalProfile: UserProfile = {
          id: session.user.id,
          email: session.user.email || '',
          full_name: session.user.user_metadata?.full_name || '',
          role: 'client',
          is_active: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };
        
        setProfile(minimalProfile);
        setRole('client');
        setLoading(false);
        
        // Try to fetch real profile in background
        fetchProfile(session.user.id);
      } else {
        setLoading(false);
      }
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state change:', event, session?.user?.email);
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          // Create minimal profile immediately
          const minimalProfile: UserProfile = {
            id: session.user.id,
            email: session.user.email || '',
            full_name: session.user.user_metadata?.full_name || '',
            role: 'client',
            is_active: true,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          };
          
          setProfile(minimalProfile);
          setRole('client');
          setLoading(false);
          
          // Try to fetch real profile in background
          fetchProfile(session.user.id);
        } else {
          setProfile(null);
          setRole(null);
          setLoading(false);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const fetchProfile = async (userId: string) => {
    try {
      console.log('Fetching profile for user:', userId);
      
      // Try to fetch from database first
      const { data: dbProfile, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (dbProfile && !error) {
        setProfile(dbProfile);
        setRole(dbProfile.role);
        return;
      }

      // Fallback to session data if database fetch fails
      console.log('Using session data for profile, DB error:', error);
      const sessionUser = user;
      if (sessionUser) {
        // Determine role based on email for demo accounts
        let userRole = sessionUser.user_metadata?.role || 'client';
        
        // Check email patterns for demo accounts
        if (sessionUser.email?.includes('giorgi.meskhi@consulting19.com')) {
          userRole = 'consultant';
        } else if (sessionUser.email?.includes('admin@consulting19.com')) {
          userRole = 'admin';
        } else if (sessionUser.email?.includes('client@consulting19.com')) {
          userRole = 'client';
        }
        
        const sessionProfile: UserProfile = {
          id: sessionUser.id,
          email: sessionUser.email || '',
          full_name: sessionUser.user_metadata?.full_name || '',
          display_name: sessionUser.user_metadata?.display_name,
          role: userRole,
          country_id: sessionUser.user_metadata?.country_id,
          phone: sessionUser.user_metadata?.phone,
          company: sessionUser.user_metadata?.company,
          avatar_url: sessionUser.user_metadata?.avatar_url,
          preferred_language: sessionUser.user_metadata?.preferred_language || 'en',
          timezone: sessionUser.user_metadata?.timezone || 'UTC',
          is_active: true,
          metadata: sessionUser.user_metadata || {},
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };
      
        setProfile(sessionProfile);
        setRole(userRole);
      }
    } catch (err) {
      console.warn('Profile fetch failed:', err);
      // Keep the minimal profile we already set
    }
  };

  const refreshProfile = async () => {
    if (user) {
      await fetchProfile(user);
    }
  };

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return { error };
  };

  const signUp = async (email: string, password: string, metadata?: any) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: metadata,
      },
    });

    // Create user profile after successful signup
    if (!error && data.user) {
      const { error: profileError } = await supabase
        .from('user_profiles')
        .insert({
          id: data.user.id,
          email: data.user.email!,
          full_name: metadata?.full_name || '',
          role: metadata?.role || 'client',
          country_id: metadata?.country_id,
          phone: metadata?.phone,
          company: metadata?.company,
        });

      if (profileError) {
        console.error('Error creating profile:', profileError);
      }
    }

    return { error };
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    return { error };
  };

  const resetPassword = async (email: string) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email);
    return { error };
  };

  return (
    <AuthContext.Provider 
      value={{
        user,
        session,
        profile,
        role,
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