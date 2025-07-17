'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabaseClient, ensureFreshSession, syncSessionToCookies } from '../utils/supabase-client';

type AuthContextType = {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: unknown }>;
  signUp: (email: string, password: string) => Promise<{ error: unknown, user: User | null }>;
  signInWithGoogle: (desktopAuth?: boolean) => Promise<{ error: unknown }>;
  signInWithGithub: (desktopAuth?: boolean) => Promise<{ error: unknown }>;
  signOut: () => Promise<void>;
  // Desktop app authentication methods
  initiateDesktopAuth: () => Promise<{ success: boolean; authUrl?: string; state?: string; error?: string }>;
  checkDesktopAuthStatus: (state: string) => Promise<{ success: boolean; authenticated: boolean; session?: unknown; error?: string }>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    const getSession = async () => {
      const session = await ensureFreshSession();
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    };

    getSession();

    // Listen for auth changes
    const { data: { subscription } } = supabaseClient.auth.onAuthStateChange(
      async (event: string, session: Session | null) => {
        console.log('Auth state change:', event, session?.user?.email);

        // Sync session to cookies for server-side access
        if (session) {
          syncSessionToCookies(session);
        }

        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    const { error } = await supabaseClient.auth.signInWithPassword({ email, password });
    return { error };
  };

  const signUp = async (email: string, password: string) => {
    const { data, error } = await supabaseClient.auth.signUp({
      email,
      password,
      options: {
        // When a user signs up, we'll create their profile automatically
        data: {
          email,
        }
      }
    });

    return { error, user: data?.user || null };
  };

  const signInWithGoogle = async (desktopAuth = false) => {
    const redirectTo = desktopAuth
      ? `${window.location.origin}/login/auth/desktop/callback`
      : `${window.location.origin}/auth/callback`;

    const { error } = await supabaseClient.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo,
        queryParams: {
          access_type: 'offline',
          prompt: 'consent',
        }
      }
    });
    return { error };
  };

  const signInWithGithub = async (desktopAuth = false) => {
    const redirectTo = desktopAuth
      ? `${window.location.origin}/login/auth/desktop/callback`
      : `${window.location.origin}/auth/callback`;

    const { error } = await supabaseClient.auth.signInWithOAuth({
      provider: 'github',
      options: {
        redirectTo
      }
    });
    return { error };
  };

  // Desktop app authentication methods
  const initiateDesktopAuth = async () => {
    try {
      const response = await fetch('/api/auth/desktop', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'initiate' })
      });

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Desktop auth initiation error:', error);
      return {
        success: false,
        error: 'Failed to initiate desktop authentication'
      };
    }
  };

  const checkDesktopAuthStatus = async (state: string) => {
    try {
      const response = await fetch('/api/auth/desktop', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'check', state })
      });

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Desktop auth status check error:', error);
      return {
        success: false,
        authenticated: false,
        error: 'Failed to check authentication status'
      };
    }
  };

  const signOut = async () => {
    await supabaseClient.auth.signOut();
  };

  const value = {
    user,
    session,
    loading,
    signIn,
    signUp,
    signInWithGoogle,
    signInWithGithub,
    signOut,
    initiateDesktopAuth,
    checkDesktopAuthStatus,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
