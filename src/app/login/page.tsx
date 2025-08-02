'use client';

import { useState, Suspense } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Header from '../home/home-components/Header';
import Footer from '../home/home-components/Footer';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';

function LoginContent() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [socialLoading, setSocialLoading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { signIn, signInWithGoogle, signInWithGithub } = useAuth();
  const router = useRouter();



  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const { error } = await signIn(email, password);

      if (error) {
        setError(error instanceof Error ? error.message : 'Authentication failed');
        setIsLoading(false);
        return;
      }

      // Redirect to home page
      router.push('/');
      setIsLoading(false);
    } catch (err) {
      console.error('Login error:', err);
      setError('An unexpected error occurred. Please try again.');
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError(null);
    setSocialLoading('google');
    try {
      const { error } = await signInWithGoogle();
      if (error) {
        setError(error instanceof Error ? error.message : 'Google sign-in failed');
        setSocialLoading(null);
      }
      // Don't redirect here - let the callback handle it
    } catch (err) {
      setError('Failed to sign in with Google');
      console.error(err);
      setSocialLoading(null);
    }
  };

  const handleGithubSignIn = async () => {
    setError(null);
    setSocialLoading('github');
    try {
      const { error } = await signInWithGithub();
      if (error) {
        setError(error instanceof Error ? error.message : 'GitHub sign-in failed');
        setSocialLoading(null);
      }
      // Don't redirect here - let the callback handle it
    } catch (err) {
      setError('Failed to sign in with GitHub');
      console.error(err);
      setSocialLoading(null);
    }
  };

  return (
    <div className="min-h-screen bg-black flex flex-col">
      <Header />
      
      <div className="flex-grow flex items-center justify-center px-4 pt-20 pb-10">
        <motion.div 
          className="w-full max-w-md"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Logo */}
          <div className="flex justify-center mb-8">
            <motion.div 
              className="w-12 h-12 bg-yellow-400 rounded-full flex items-center justify-center"
              whileHover={{ scale: 1.05, rotate: 5 }}
            >
              <span className="text-black text-lg font-bold">IC</span>
            </motion.div>
          </div>
          
          {/* Title */}
          <motion.h1
            className="text-2xl font-bold text-white text-center mb-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            Sign in to your account
          </motion.h1>

          {/* Error Display */}
          {error && (
            <motion.div
              className="mb-6 p-3 bg-red-900/50 border border-red-500 text-red-200 rounded-md text-sm"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              {error}
            </motion.div>
          )}
          
          {/* Form */}
          <motion.form 
            onSubmit={handleSubmit}
            className="space-y-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            {/* Social Sign In Buttons */}
            <div className="grid grid-cols-2 gap-3">
              {/* Google Sign In Button */}
              <button
                type="button"
                onClick={handleGoogleSignIn}
                disabled={socialLoading === 'google' || isLoading}
                className={`bg-[#1A1A1A] text-white py-3 px-4 rounded-md flex items-center justify-center gap-2 hover:bg-[#252525] transition-colors ${
                  socialLoading === 'google' ? 'opacity-70 cursor-not-allowed' : ''
                }`}
              >
                {socialLoading === 'google' ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <svg width="18" height="18" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512">
                    <path fill="currentColor" d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"/>
                  </svg>
                )}
                {socialLoading === 'google' ? 'Signing in...' : 'Google'}
              </button>

              {/* GitHub Sign In Button */}
              <button
                type="button"
                onClick={handleGithubSignIn}
                disabled={socialLoading === 'github' || isLoading}
                className={`bg-[#1A1A1A] text-white py-3 px-4 rounded-md flex items-center justify-center gap-2 hover:bg-[#252525] transition-colors ${
                  socialLoading === 'github' ? 'opacity-70 cursor-not-allowed' : ''
                }`}
              >
                {socialLoading === 'github' ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <svg width="18" height="18" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 496 512">
                    <path fill="currentColor" d="M165.9 397.4c0 2-2.3 3.6-5.2 3.6-3.3.3-5.6-1.3-5.6-3.6 0-2 2.3-3.6 5.2-3.6 3-.3 5.6 1.3 5.6 3.6zm-31.1-4.5c-.7 2 1.3 4.3 4.3 4.9 2.6 1 5.6 0 6.2-2s-1.3-4.3-4.3-5.2c-2.6-.7-5.5.3-6.2 2.3zm44.2-1.7c-2.9.7-4.9 2.6-4.6 4.9.3 2 2.9 3.3 5.9 2.6 2.9-.7 4.9-2.6 4.6-4.6-.3-1.9-3-3.2-5.9-2.9zM244.8 8C106.1 8 0 113.3 0 252c0 110.9 69.8 205.8 169.5 239.2 12.8 2.3 17.3-5.6 17.3-12.1 0-6.2-.3-40.4-.3-61.4 0 0-70 15-84.7-29.8 0 0-11.4-29.1-27.8-36.6 0 0-22.9-15.7 1.6-15.4 0 0 24.9 2 38.6 25.8 21.9 38.6 58.6 27.5 72.9 20.9 2.3-16 8.8-27.1 16-33.7-55.9-6.2-112.3-14.3-112.3-110.5 0-27.5 7.6-41.3 23.6-58.9-2.6-6.5-11.1-33.3 2.6-67.9 20.9-6.5 69 27 69 27 20-5.6 41.5-8.5 62.8-8.5s42.8 2.9 62.8 8.5c0 0 48.1-33.6 69-27 13.7 34.7 5.2 61.4 2.6 67.9 16 17.7 25.8 31.5 25.8 58.9 0 96.5-58.9 104.2-114.8 110.5 9.2 7.9 17 22.9 17 46.4 0 33.7-.3 75.4-.3 83.6 0 6.5 4.6 14.4 17.3 12.1C428.2 457.8 496 362.9 496 252 496 113.3 383.5 8 244.8 8zM97.2 352.9c-1.3 1-1 3.3.7 5.2 1.6 1.6 3.9 2.3 5.2 1 1.3-1 1-3.3-.7-5.2-1.6-1.6-3.9-2.3-5.2-1zm-10.8-8.1c-.7 1.3.3 2.9 2.3 3.9 1.6 1 3.6.7 4.3-.7.7-1.3-.3-2.9-2.3-3.9-2-.6-3.6-.3-4.3.7zm32.4 35.6c-1.6 1.3-1 4.3 1.3 6.2 2.3 2.3 5.2 2.6 6.5 1 1.3-1.3.7-4.3-1.3-6.2-2.2-2.3-5.2-2.6-6.5-1zm-11.4-14.7c-1.6 1-1.6 3.6 0 5.9 1.6 2.3 4.3 3.3 5.6 2.3 1.6-1.3 1.6-3.9 0-6.2-1.4-2.3-4-3.3-5.6-2z"/>
                  </svg>
                )}
                {socialLoading === 'github' ? 'Signing in...' : 'GitHub'}
              </button>
            </div>
            
            {/* Divider */}
            <div className="flex items-center justify-center">
              <div className="border-t border-gray-700 flex-grow"></div>
              <div className="mx-4 text-xs text-gray-500 uppercase">or continue with email</div>
              <div className="border-t border-gray-700 flex-grow"></div>
            </div>
            
            {/* Email Input */}
            <div>
              <input
                type="email"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-[#1A1A1A] border border-gray-800 text-white py-3 px-4 rounded-md focus:outline-none focus:ring-1 focus:ring-yellow-400"
                required
              />
            </div>
            
            {/* Password Input */}
            <div>
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-[#1A1A1A] border border-gray-800 text-white py-3 px-4 rounded-md focus:outline-none focus:ring-1 focus:ring-yellow-400"
                required
              />
            </div>
            
            {/* Forgot Password Link */}
            <div className="text-right">
              <Link href="/forgot-password" className="text-sm text-gray-400 hover:text-white transition-colors">
                Forgot password?
              </Link>
            </div>
            
            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full bg-yellow-400 text-black py-3 px-4 rounded-md font-medium transition-colors ${
                isLoading ? 'opacity-70 cursor-not-allowed' : 'hover:bg-yellow-500'
              }`}
            >
              {isLoading ? 'Signing in...' : 'Sign in'}
            </button>
          </motion.form>
          
          {/* Sign Up Link */}
          <motion.div 
            className="mt-6 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            <Link 
              href="/signup" 
              className="text-gray-400 hover:text-white transition-colors text-sm"
            >
              Don't have an account? Create one →
            </Link>
          </motion.div>
        </motion.div>
      </div>
      
      <Footer />
    </div>
  );
}

export default function LoginPage() {
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
      <LoginContent />
    </Suspense>
  );
}
