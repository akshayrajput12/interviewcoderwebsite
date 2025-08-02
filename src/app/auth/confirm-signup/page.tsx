'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import Header from '../../home/home-components/Header';
import Footer from '../../home/home-components/Footer';

export default function ConfirmSignupPage() {
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
          {/* Success Icon */}
          <div className="flex justify-center mb-8">
            <motion.div 
              className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 10, delay: 0.2 }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            </motion.div>
          </div>
          
          {/* Title */}
          <motion.h1 
            className="text-2xl font-bold text-white text-center mb-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            Check your email
          </motion.h1>
          
          {/* Description */}
          <motion.p
            className="text-gray-400 text-center mb-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            We&apos;ve sent a confirmation link to your email address. Please click the link to verify your account.
          </motion.p>
          
          {/* Buttons */}
          <motion.div
            className="space-y-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
          >
            <Link href="/login">
              <button className="w-full bg-yellow-400 text-black py-3 px-4 rounded-md font-medium transition-colors hover:bg-yellow-500">
                Go to login
              </button>
            </Link>
            
            <Link href="/">
              <button className="w-full bg-transparent border border-gray-700 text-white py-3 px-4 rounded-md font-medium transition-colors hover:bg-gray-900">
                Return to home
              </button>
            </Link>
          </motion.div>
        </motion.div>
      </div>
      
      <Footer />
    </div>
  );
}