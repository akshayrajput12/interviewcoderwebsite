'use client';

import { useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { supabaseClient } from '@/utils/supabase-client';

function AuthCallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        const code = searchParams.get('code');
        const error = searchParams.get('error');
        
        if (error) {
          console.error('OAuth error:', error);
          router.push('/login?error=Authentication%20failed');
          return;
        }

        if (code) {
          const { error: exchangeError } = await supabaseClient.auth.exchangeCodeForSession(code);

          if (exchangeError) {
            console.error('Error exchanging code:', exchangeError);
            router.push('/login?error=Authentication%20failed');
            return;
          }
        }

        // Wait for auth state to update
        const { data: { session } } = await supabaseClient.auth.getSession();
        
        if (session?.user) {
          // Create profile if needed
          await fetch('/api/auth/profile', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              userId: session.user.id,
              email: session.user.email,
            }),
          });
          
          router.push('/');
        } else {
          router.push('/login?error=Authentication%20failed');
        }
      } catch (error) {
        console.error('Callback error:', error);
        router.push('/login?error=Authentication%20failed');
      }
    };

    handleAuthCallback();
  }, [router, searchParams]);

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-400"></div>
      <p className="text-white mt-4">Completing authentication...</p>
    </div>
  );
}

export default function AuthCallbackPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-black flex flex-col items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-400"></div>
        <p className="text-white mt-4">Loading...</p>
      </div>
    }>
      <AuthCallbackContent />
    </Suspense>
  );
}
