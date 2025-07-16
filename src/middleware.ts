import { createServerClient } from '@supabase/ssr';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import type { Session } from '@supabase/supabase-js';

export async function middleware(req: NextRequest) {
  const res = NextResponse.next({
    request: {
      headers: req.headers,
    },
  });

  // Create a Supabase client configured to use cookies
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get: (name) => {
          const cookie = req.cookies.get(name)?.value;
          if (process.env.NODE_ENV === 'development') {
            console.log(`Getting cookie ${name}:`, cookie ? 'exists' : 'missing');
          }
          return cookie;
        },
        set: (name, value, options) => {
          // Don't set httpOnly for Supabase auth cookies - they need to be accessible to client-side JS
          res.cookies.set({
            name,
            value,
            ...options,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            path: '/'
          });
          if (process.env.NODE_ENV === 'development') {
            console.log(`Setting cookie ${name}:`, value ? 'with value' : 'empty');
          }
        },
        remove: (name, options) => {
          res.cookies.set({
            name,
            value: '',
            ...options,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            path: '/',
            maxAge: 0
          });
          if (process.env.NODE_ENV === 'development') {
            console.log(`Removing cookie ${name}`);
          }
        },
      },
    }
  );

  // Get the current session and refresh if needed
  let { data: { session }, error } = await supabase.auth.getSession();

  // If no session from Supabase, try to read from our custom cookie
  if (!session) {
    const customCookieName = 'stiwqolzjvrvxrytbbbv'; // Your Supabase project ID
    const customCookie = req.cookies.get(customCookieName)?.value;

    if (customCookie) {
      try {
        const sessionData = JSON.parse(decodeURIComponent(customCookie));
        // Check if token is still valid
        const now = Math.floor(Date.now() / 1000);
        if (sessionData.expires_at && sessionData.expires_at > now) {
          // Create a mock session object for middleware validation
          session = {
            access_token: sessionData.access_token,
            refresh_token: sessionData.refresh_token,
            expires_at: sessionData.expires_at,
            user: sessionData.user,
          } as Session;
          console.log('Using session from custom cookie');
        }
      } catch (e) {
        console.log('Error parsing custom cookie:', e);
      }
    }
  }

  // If there's an error getting the session, try to refresh
  if (error && !session) {
    const { data: refreshData } = await supabase.auth.refreshSession();
    session = refreshData.session;
  }

  // Log for debugging (only in development)
  if (process.env.NODE_ENV === 'development') {
    const cookieNames = req.cookies.getAll().map(c => c.name);
    const supabaseCookies = cookieNames.filter(name => name.includes('supabase'));
    console.log('Middleware - Path:', req.nextUrl.pathname, 'Session:', !!session, 'User:', session?.user?.email);
    console.log('Available cookies:', cookieNames.length, 'Supabase cookies:', supabaseCookies);
  }

  // Check auth condition based on route
  const path = req.nextUrl.pathname;

  // Routes that require authentication
  const protectedRoutes = ['/dashboard', '/settings', '/practice'];

  // Routes that should redirect to dashboard if already logged in
  const authRoutes = ['/login', '/signup'];

  // If accessing a protected route without being logged in
  if (protectedRoutes.some(route => path.startsWith(route)) && !session) {
    console.log('Redirecting to login - no session for protected route:', path);
    const redirectUrl = new URL('/login', req.url);
    redirectUrl.searchParams.set('redirectedFrom', path);
    return NextResponse.redirect(redirectUrl);
  }

  // If accessing login/signup while already logged in, redirect to home
  if (authRoutes.some(route => path === route) && session) {
    return NextResponse.redirect(new URL('/', req.url));
  }

  return res;
}

// Specify which routes this middleware should run for
export const config = {
  matcher: [
    '/dashboard/:path*',
    '/settings/:path*',
    '/practice/:path*',
    '/login',
    '/signup',
  ],
};
