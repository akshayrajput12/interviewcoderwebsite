'use client';

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

// Client-side Supabase client with enhanced session persistence
export const supabaseClient = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    storage: typeof window !== 'undefined' ? {
      getItem: (key: string) => {
        try {
          return window.localStorage.getItem(key);
        } catch (error) {
          console.error('Error getting item from localStorage:', error);
          return null;
        }
      },
      setItem: (key: string, value: string) => {
        try {
          window.localStorage.setItem(key, value);
          // Also set as cookie for server-side access
          setCookieFromLocalStorage(key, value);
        } catch (error) {
          console.error('Error setting item in localStorage:', error);
        }
      },
      removeItem: (key: string) => {
        try {
          window.localStorage.removeItem(key);
          // Also remove cookie
          removeCookieFromLocalStorage(key);
        } catch (error) {
          console.error('Error removing item from localStorage:', error);
        }
      },
    } : undefined,
    flowType: 'pkce',
  },
  global: {
    headers: {
      'X-Client-Info': 'interview-coder-web',
    },
  },
});

// Helper function to set cookies from localStorage data
const setCookieFromLocalStorage = (key: string, value: string) => {
  if (typeof window === 'undefined') return;

  try {
    // Parse the session data
    const sessionData = JSON.parse(value);

    // Set the main session cookie that server can read
    const cookieName = key.replace('sb-', '').replace('-auth-token', '');
    const cookieValue = JSON.stringify({
      access_token: sessionData.access_token,
      refresh_token: sessionData.refresh_token,
      expires_at: sessionData.expires_at,
      user: sessionData.user
    });

    // Set cookie with proper attributes
    const expires = new Date(sessionData.expires_at * 1000);
    document.cookie = `${cookieName}=${encodeURIComponent(cookieValue)}; expires=${expires.toUTCString()}; path=/; SameSite=Lax`;

    console.log('Set session cookie:', cookieName);
  } catch (error) {
    console.error('Error setting session cookie:', error);
  }
};

// Helper function to remove cookies
const removeCookieFromLocalStorage = (key: string) => {
  if (typeof window === 'undefined') return;

  try {
    const cookieName = key.replace('sb-', '').replace('-auth-token', '');
    document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; SameSite=Lax`;
    console.log('Removed session cookie:', cookieName);
  } catch (error) {
    console.error('Error removing session cookie:', error);
  }
};

// Helper function to ensure session is fresh
export const ensureFreshSession = async () => {
  try {
    const { data: { session }, error } = await supabaseClient.auth.getSession();

    if (error) {
      console.error('Error getting session:', error);
      return null;
    }

    // Sync session to cookies for server-side access
    if (session) {
      syncSessionToCookies(session);
    }

    // If session exists but is close to expiring, refresh it
    if (session && session.expires_at) {
      const expiresAt = new Date(session.expires_at * 1000);
      const now = new Date();
      const timeUntilExpiry = expiresAt.getTime() - now.getTime();

      // Refresh if less than 5 minutes until expiry
      if (timeUntilExpiry < 5 * 60 * 1000) {
        const { data: { session: refreshedSession }, error: refreshError } =
          await supabaseClient.auth.refreshSession();

        if (refreshError) {
          console.error('Error refreshing session:', refreshError);
          return session;
        }

        if (refreshedSession) {
          syncSessionToCookies(refreshedSession);
        }

        return refreshedSession;
      }
    }

    return session;
  } catch (error) {
    console.error('Error ensuring fresh session:', error);
    return null;
  }
};

// Helper function to sync session to cookies
export const syncSessionToCookies = (session: any) => {
  if (typeof window === 'undefined' || !session) return;

  try {
    const cookieName = 'stiwqolzjvrvxrytbbbv'; // Your Supabase project ID
    const cookieValue = JSON.stringify({
      access_token: session.access_token,
      refresh_token: session.refresh_token,
      expires_at: session.expires_at,
      user: session.user
    });

    // Set cookie with proper attributes
    const expires = new Date(session.expires_at * 1000);
    document.cookie = `${cookieName}=${encodeURIComponent(cookieValue)}; expires=${expires.toUTCString()}; path=/; SameSite=Lax`;

    console.log('Synced session to cookie for server-side access');
  } catch (error) {
    console.error('Error syncing session to cookies:', error);
  }
};
