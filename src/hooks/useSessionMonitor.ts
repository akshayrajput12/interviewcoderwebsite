'use client';

import { useEffect, useState } from 'react';
import { Session } from '@supabase/supabase-js';
import { supabaseClient, ensureFreshSession } from '@/utils/supabase-client';

interface SessionStatus {
  session: Session | null;
  isLoading: boolean;
  isExpired: boolean;
  timeUntilExpiry: number | null;
  lastRefresh: Date | null;
  error: string | null;
}

export const useSessionMonitor = () => {
  const [status, setStatus] = useState<SessionStatus>({
    session: null,
    isLoading: true,
    isExpired: false,
    timeUntilExpiry: null,
    lastRefresh: null,
    error: null,
  });

  const checkSession = async () => {
    try {
      const session = await ensureFreshSession();
      
      let isExpired = false;
      let timeUntilExpiry: number | null = null;
      
      if (session?.expires_at) {
        const expiresAt = new Date(session.expires_at * 1000);
        const now = new Date();
        isExpired = now > expiresAt;
        timeUntilExpiry = expiresAt.getTime() - now.getTime();
      }
      
      setStatus(prev => ({
        ...prev,
        session,
        isLoading: false,
        isExpired,
        timeUntilExpiry,
        lastRefresh: new Date(),
        error: null,
      }));
      
      return session;
    } catch (error) {
      console.error('Session check error:', error);
      setStatus(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      }));
      return null;
    }
  };

  const refreshSession = async () => {
    try {
      const { data: { session }, error } = await supabaseClient.auth.refreshSession();
      
      if (error) {
        throw error;
      }
      
      setStatus(prev => ({
        ...prev,
        session,
        lastRefresh: new Date(),
        error: null,
      }));
      
      return session;
    } catch (error) {
      console.error('Session refresh error:', error);
      setStatus(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Refresh failed',
      }));
      return null;
    }
  };

  useEffect(() => {
    // Initial session check
    checkSession();

    // Set up auth state listener
    const { data: { subscription } } = supabaseClient.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session?.user?.email);
        
        let isExpired = false;
        let timeUntilExpiry: number | null = null;
        
        if (session?.expires_at) {
          const expiresAt = new Date(session.expires_at * 1000);
          const now = new Date();
          isExpired = now > expiresAt;
          timeUntilExpiry = expiresAt.getTime() - now.getTime();
        }
        
        setStatus(prev => ({
          ...prev,
          session,
          isLoading: false,
          isExpired,
          timeUntilExpiry,
          lastRefresh: new Date(),
          error: null,
        }));
      }
    );

    // Set up periodic session check (every 5 minutes)
    const interval = setInterval(() => {
      checkSession();
    }, 5 * 60 * 1000);

    return () => {
      subscription.unsubscribe();
      clearInterval(interval);
    };
  }, []);

  return {
    ...status,
    checkSession,
    refreshSession,
  };
};
