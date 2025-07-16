import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Enable static export for better Vercel compatibility
  output: 'standalone',

  // Ensure trailing slashes are handled consistently
  trailingSlash: false,

  // Configure redirects for better routing
  async redirects() {
    return [
      // Redirect root to home page
      {
        source: '/',
        destination: '/home',
        permanent: false,
      },
    ];
  },

  // Configure rewrites for SPA-like behavior
  async rewrites() {
    return [
      // Handle dynamic routes properly
      {
        source: '/dashboard/:path*',
        destination: '/dashboard/:path*',
      },
      {
        source: '/settings/:path*',
        destination: '/settings/:path*',
      },
    ];
  },

  // Optimize for production
  experimental: {
    optimizePackageImports: ['@supabase/supabase-js'],
  },

  // Configure headers for better caching
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
