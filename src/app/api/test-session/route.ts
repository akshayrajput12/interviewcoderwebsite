import { NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/utils/supabase';
import { cookies } from 'next/headers';

export async function GET(request: Request) {
  try {
    // Get all cookies for debugging
    const cookieStore = await cookies();
    const allCookies = cookieStore.getAll();
    const supabaseCookies = allCookies.filter(cookie => 
      cookie.name.includes('supabase') || cookie.name.includes('auth')
    );

    // Initialize Supabase client with cookies
    const supabase = await createServerSupabaseClient();

    // Get the current user session
    const { data: { session }, error } = await supabase.auth.getSession();

    return NextResponse.json({
      success: true,
      session: session ? {
        user_id: session.user?.id,
        email: session.user?.email,
        expires_at: session.expires_at,
        token_type: session.token_type,
      } : null,
      error,
      cookies: {
        total: allCookies.length,
        supabase_cookies: supabaseCookies.map(c => ({
          name: c.name,
          value_length: c.value?.length || 0,
        })),
      },
    });
  } catch (error) {
    console.error('Test session error:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    }, { status: 500 });
  }
}
