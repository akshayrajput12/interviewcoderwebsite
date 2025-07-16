'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function NotFound() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <div className="mb-8">
          <h1 className="text-9xl font-bold text-indigo-600 mb-4">404</h1>
          <h2 className="text-2xl font-semibold text-gray-800 mb-2">Page Not Found</h2>
          <p className="text-gray-600 mb-8">
            The page you&apos;re looking for doesn&apos;t exist or has been moved.
          </p>
        </div>
        
        <div className="space-y-4">
          <Link
            href="/home"
            className="inline-block bg-indigo-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-indigo-700 transition-colors"
          >
            Go Home
          </Link>
          
          <div className="flex justify-center space-x-4 text-sm">
            <Link
              href="/dashboard"
              className="text-indigo-600 hover:text-indigo-800 transition-colors"
            >
              Dashboard
            </Link>
            <Link
              href="/pricing"
              className="text-indigo-600 hover:text-indigo-800 transition-colors"
            >
              Pricing
            </Link>
            <Link
              href="/help"
              className="text-indigo-600 hover:text-indigo-800 transition-colors"
            >
              Help
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
