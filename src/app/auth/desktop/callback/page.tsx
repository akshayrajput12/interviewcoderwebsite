'use client';

import { useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { supabaseClient } from '@/utils/supabase-client';

function DesktopOAuthCallbackContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const handleOAuthCallback = async () => {
      try {
        const code = searchParams.get('code');
        const error = searchParams.get('error');
        const state = searchParams.get('state');
        
        if (error) {
          console.error('OAuth error:', error);
          router.push('/auth/desktop?error=Authentication%20failed');
          return;
        }

        if (code) {
          const { error: exchangeError } = await supabaseClient.auth.exchangeCodeForSession(code);

          if (exchangeError) {
            console.error('Error exchanging code:', exchangeError);
            router.push('/auth/desktop?error=Authentication%20failed');
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
          
          // If this is a desktop auth flow, complete it
          if (state) {
            await fetch('/api/auth/desktop/complete', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ state, session })
            });
            
            // Redirect to desktop app
            window.location.href = `interviewcoder://auth?success=true&state=${state}`;
            // Fallback redirect
            setTimeout(() => router.push('/'), 1000);
          } else {
            // Regular OAuth flow
            router.push('/');
          }
        } else {
          router.push('/auth/desktop?error=Authentication%20failed');
        }
      } catch (error) {
        console.error('OAuth callback error:', error);
        router.push('/auth/desktop?error=Authentication%20failed');
      }
    };

    handleOAuthCallback();
  }, [router, searchParams]);

  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-white">Processing authentication...</p>
      </div>
    </div>
  );
}

export default function DesktopOAuthCallbackPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white">Processing authentication...</p>
        </div>
      </div>
    }>
      <DesktopOAuthCallbackContent />
    </Suspense>
  );
}
