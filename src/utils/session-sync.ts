'use client';

// Utility to manually sync localStorage session to cookies
export const manualSyncSession = () => {
  if (typeof window === 'undefined') return;
  
  try {
    // Get session from localStorage
    const authKey = Object.keys(localStorage).find(key => 
      key.includes('supabase') && key.includes('auth-token')
    );
    
    if (!authKey) {
      console.log('No auth token found in localStorage');
      return;
    }
    
    const sessionData = localStorage.getItem(authKey);
    if (!sessionData) {
      console.log('No session data found');
      return;
    }
    
    const parsed = JSON.parse(sessionData);
    
    // Check if session is still valid
    const now = Math.floor(Date.now() / 1000);
    if (parsed.expires_at && parsed.expires_at <= now) {
      console.log('Session expired, not syncing');
      return;
    }
    
    // Set cookie for server-side access
    const cookieName = 'stiwqolzjvrvxrytbbbv'; // Your Supabase project ID
    const cookieValue = JSON.stringify({
      access_token: parsed.access_token,
      refresh_token: parsed.refresh_token,
      expires_at: parsed.expires_at,
      user: parsed.user
    });
    
    // Set cookie with proper attributes
    const expires = new Date(parsed.expires_at * 1000);
    document.cookie = `${cookieName}=${encodeURIComponent(cookieValue)}; expires=${expires.toUTCString()}; path=/; SameSite=Lax`;
    
    console.log('Manually synced session to cookie');
    return true;
  } catch (error) {
    console.error('Error manually syncing session:', error);
    return false;
  }
};

// Add to window for easy access
if (typeof window !== 'undefined') {
  (window as any).manualSyncSession = manualSyncSession;
}
