'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { supabaseClient } from '@/utils/supabase-client';
import Header from '../../../home/home-components/Header';
import Footer from '../../../home/home-components/Footer';
import { motion } from 'framer-motion';

function DesktopAuthContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { user, session } = useAuth();
  const [status, setStatus] = useState<'loading' | 'authenticating' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('Initializing authentication...');
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    const handleDesktopAuth = async () => {
      try {
        const state = searchParams.get('state');

        if (!state) {
          // Generate a new state and redirect to proper flow
          setStatus('loading');
          setMessage('Initializing desktop authentication...');

          try {
            const response = await fetch('/api/auth/desktop', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ action: 'initiate' })
            });

            const data = await response.json();

            if (data.success) {
              // Redirect to the proper auth URL with state
              window.location.href = data.authUrl;
              return;
            } else {
              setStatus('error');
              setMessage('Failed to initialize authentication. Please try again.');
              return;
            }
          } catch (error) {
            console.error('Failed to initialize auth:', error);
            setStatus('error');
            setMessage('Failed to initialize authentication. Please try again.');
            return;
          }
        }

        // Verify the state parameter exists in our backend
        const verifyResponse = await fetch('/api/auth/desktop', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: 'check', state })
        });

        const verifyData = await verifyResponse.json();
        
        if (!verifyData.success) {
          setStatus('error');
          setMessage('Invalid or expired authentication request.');
          return;
        }

        // If user is already authenticated, complete the flow
        if (user && session) {
          await completeDesktopAuth(state, session);
          return;
        }

        // If not authenticated, show login prompt
        setStatus('authenticating');
        setMessage('Please log in to continue with desktop app authentication.');
        
        // Wait for authentication to complete
        const checkAuthInterval = setInterval(async () => {
          const { data: { session: currentSession } } = await supabaseClient.auth.getSession();
          
          if (currentSession) {
            clearInterval(checkAuthInterval);
            await completeDesktopAuth(state, currentSession);
          }
        }, 1000);

        // Clean up interval after 5 minutes
        setTimeout(() => {
          clearInterval(checkAuthInterval);
          if (status === 'authenticating') {
            setStatus('error');
            setMessage('Authentication timeout. Please try again.');
          }
        }, 5 * 60 * 1000);

      } catch (error) {
        console.error('Desktop auth error:', error);
        setStatus('error');
        setMessage('An unexpected error occurred during authentication.');
      }
    };

    const completeDesktopAuth = async (state: string, session: unknown) => {
      try {
        // Store the session for the desktop app to retrieve
        const response = await fetch('/api/auth/desktop/complete', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ state, session })
        });

        const data = await response.json();

        if (data.success) {
          setStatus('success');
          setMessage('Authentication successful! You can now return to your desktop app.');
          
          // Start countdown and redirect
          const countdownInterval = setInterval(() => {
            setCountdown(prev => {
              if (prev <= 1) {
                clearInterval(countdownInterval);
                // Redirect to desktop app using custom URL scheme
                window.location.href = `interviewcoder://auth?success=true&state=${state}`;
                // Fallback redirect after a short delay
                setTimeout(() => router.push('/'), 1000);
                return 0;
              }
              return prev - 1;
            });
          }, 1000);
        } else {
          setStatus('error');
          setMessage('Failed to complete authentication. Please try again.');
        }
      } catch (error) {
        console.error('Complete auth error:', error);
        setStatus('error');
        setMessage('Failed to complete authentication. Please try again.');
      }
    };

    handleDesktopAuth();
  }, [searchParams, user, session, router, status]);

  const handleLogin = () => {
    const state = searchParams.get('state');
    router.push(`/login?desktop_auth=true&state=${state}`);
  };

  const handleSignup = () => {
    const state = searchParams.get('state');
    router.push(`/signup?desktop_auth=true&state=${state}`);
  };

  const handleManualAuth = async () => {
    setStatus('loading');
    setMessage('Starting authentication...');

    try {
      const response = await fetch('/api/auth/desktop', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'initiate' })
      });

      const data = await response.json();

      if (data.success) {
        window.location.href = data.authUrl;
      } else {
        setStatus('error');
        setMessage('Failed to start authentication. Please try again.');
      }
    } catch (error) {
      console.error('Manual auth failed:', error);
      setStatus('error');
      setMessage('Failed to start authentication. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      <Header />
      
      <div className="flex-grow flex items-center justify-center px-4">
        <motion.div 
          className="max-w-md w-full bg-[#1A1A1A] rounded-lg p-8 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Status Icon */}
          <div className="mb-6">
            {status === 'loading' && (
              <div className="w-16 h-16 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin mx-auto"></div>
            )}
            {status === 'authenticating' && (
              <div className="w-16 h-16 bg-yellow-400 rounded-full flex items-center justify-center mx-auto">
                <svg className="w-8 h-8 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
            )}
            {status === 'success' && (
              <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            )}
            {status === 'error' && (
              <div className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center mx-auto">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
            )}
          </div>

          {/* Title */}
          <h1 className="text-2xl font-bold mb-4">
            Desktop App Authentication
          </h1>

          {/* Message */}
          <p className="text-gray-300 mb-6">
            {message}
          </p>

          {/* Action Buttons */}
          {status === 'authenticating' && !user && (
            <div className="space-y-3">
              <button
                onClick={handleLogin}
                className="w-full bg-yellow-400 text-black py-3 px-4 rounded-md font-medium hover:bg-yellow-500 transition-colors"
              >
                Log In
              </button>
              <button
                onClick={handleSignup}
                className="w-full bg-[#2A2A2A] text-white py-3 px-4 rounded-md font-medium hover:bg-[#3A3A3A] transition-colors"
              >
                Sign Up
              </button>
            </div>
          )}

          {/* Success Countdown */}
          {status === 'success' && (
            <div className="text-sm text-gray-400">
              Redirecting to desktop app in {countdown} seconds...
            </div>
          )}

          {/* Error Actions */}
          {status === 'error' && (
            <div className="space-y-3">
              <button
                onClick={handleManualAuth}
                className="w-full bg-yellow-400 text-black py-3 px-4 rounded-md font-medium hover:bg-yellow-500 transition-colors"
              >
                Try Authentication Again
              </button>
              <button
                onClick={() => router.push('/')}
                className="w-full bg-[#2A2A2A] text-white py-2 px-4 rounded-md hover:bg-[#3A3A3A] transition-colors"
              >
                Return to Home
              </button>
            </div>
          )}
        </motion.div>
      </div>
      
      <Footer />
    </div>
  );
}

export default function DesktopAuthPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-black text-white flex flex-col">
        <Header />
        <div className="flex-grow flex items-center justify-center">
          <div className="w-16 h-16 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin"></div>
        </div>
        <Footer />
      </div>
    }>
      <DesktopAuthContent />
    </Suspense>
  );
}
