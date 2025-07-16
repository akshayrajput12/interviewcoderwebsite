'use client';

import { supabaseClient } from './supabase-client';

export const debugSession = async () => {
  try {
    console.log('=== SESSION DEBUG INFO ===');
    
    // Check localStorage for session data
    if (typeof window !== 'undefined') {
      const keys = Object.keys(localStorage).filter(key => 
        key.includes('supabase') || key.includes('auth')
      );
      console.log('LocalStorage auth keys:', keys);
      
      keys.forEach(key => {
        try {
          const value = localStorage.getItem(key);
          console.log(`${key}:`, value ? JSON.parse(value) : null);
        } catch (e) {
          console.log(`${key}:`, localStorage.getItem(key));
        }
      });
    }
    
    // Check current session
    const { data: { session }, error } = await supabaseClient.auth.getSession();
    console.log('Current session:', session);
    console.log('Session error:', error);
    
    if (session) {
      console.log('Session details:', {
        user_id: session.user?.id,
        email: session.user?.email,
        expires_at: session.expires_at,
        expires_in: session.expires_in,
        token_type: session.token_type,
        access_token_length: session.access_token?.length,
        refresh_token_length: session.refresh_token?.length,
      });
      
      // Check if session is expired
      if (session.expires_at) {
        const expiresAt = new Date(session.expires_at * 1000);
        const now = new Date();
        const isExpired = now > expiresAt;
        const timeUntilExpiry = expiresAt.getTime() - now.getTime();
        
        console.log('Session expiry info:', {
          expires_at: expiresAt.toISOString(),
          current_time: now.toISOString(),
          is_expired: isExpired,
          time_until_expiry_ms: timeUntilExpiry,
          time_until_expiry_minutes: Math.round(timeUntilExpiry / (1000 * 60)),
        });
      }
    }
    
    // Check user
    const { data: { user }, error: userError } = await supabaseClient.auth.getUser();
    console.log('Current user:', user);
    console.log('User error:', userError);
    
    console.log('=== END SESSION DEBUG ===');
    
    return { session, user, error, userError };
  } catch (error) {
    console.error('Error in debugSession:', error);
    return { session: null, user: null, error, userError: null };
  }
};

// Helper to clear all auth data
export const clearAuthData = () => {
  if (typeof window !== 'undefined') {
    const keys = Object.keys(localStorage).filter(key => 
      key.includes('supabase') || key.includes('auth')
    );
    
    keys.forEach(key => {
      localStorage.removeItem(key);
      console.log(`Removed ${key} from localStorage`);
    });
    
    // Clear cookies (client-side only)
    document.cookie.split(";").forEach((c) => {
      const eqPos = c.indexOf("=");
      const name = eqPos > -1 ? c.substr(0, eqPos) : c;
      if (name.trim().includes('supabase') || name.trim().includes('auth')) {
        document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
        console.log(`Cleared cookie: ${name.trim()}`);
      }
    });
  }
};

// Add to window for easy debugging
if (typeof window !== 'undefined') {
  (window as any).debugSession = debugSession;
  (window as any).clearAuthData = clearAuthData;
}
