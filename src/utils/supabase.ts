import { createClient } from '@supabase/supabase-js';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

// Client-side Supabase client with proper session persistence
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    storage: typeof window !== 'undefined' ? window.localStorage : undefined,
  },
});

// Server-side Supabase client with cookie support
export const createServerSupabaseClient = async () => {
  const cookieStore = await cookies();

  const client = createServerClient(
    supabaseUrl,
    supabaseAnonKey,
    {
      cookies: {
        get(name: string) {
          let value = cookieStore.get(name)?.value;

          // If no standard Supabase cookie, try our custom cookie
          if (!value && name.includes('auth-token')) {
            const customCookieName = 'stiwqolzjvrvxrytbbbv'; // Your Supabase project ID
            const customCookie = cookieStore.get(customCookieName)?.value;

            if (customCookie) {
              try {
                const sessionData = JSON.parse(decodeURIComponent(customCookie));
                // Return the session data in the format Supabase expects
                value = JSON.stringify(sessionData);
              } catch (e) {
                console.log('Error parsing custom cookie in server client:', e);
              }
            }
          }

          return value;
        },
        set(name: string, value: string, options: any) {
          cookieStore.set({ name, value, ...options });
        },
        remove(name: string, options: any) {
          cookieStore.set({ name, value: '', ...options });
        },
      },
    }
  );

  return client;
};

// For server-side operations that require elevated privileges
export const createServiceClient = () => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
  return createClient(supabaseUrl, supabaseServiceKey);
};