'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import ProfileDropdown from '@/components/ProfileDropdown';

const navItems = [
  { name: 'Home', href: '/home' },
  { name: 'Features', href: '/features' },
  { name: 'Pricing', href: '/pricing' },
  { name: 'Does it work?', href: '/does-it-work' },
];

export default function Header() {
  const { user, loading } = useAuth();

  return (
    <motion.header
      className="fixed top-0 left-0 right-0 z-50 bg-[#0D0D0D]/95 backdrop-blur-sm border-b border-gray-900"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <Link href="/home" className="flex items-center space-x-2">
              <motion.div
                className="w-8 h-8 sm:w-10 sm:h-10 bg-[#F8E71C] rounded-full flex items-center justify-center"
                whileHover={{ scale: 1.1, rotate: 5 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <span className="text-black text-sm sm:text-lg font-bold">IC</span>
              </motion.div>
              <span className="text-lg sm:text-xl font-bold text-[#F8E71C] text-glow">
                Interview Coder
              </span>
            </Link>
          </motion.div>

          {/* Navigation */}
          <motion.nav
            className="hidden md:flex items-center space-x-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {navItems.map((item, index) => (
              <motion.div
                key={item.name}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.1 + index * 0.1 }}
              >
                <Link
                  href={item.href}
                  className="text-[#E0E0E0] hover:text-[#F8E71C] transition-colors duration-300 font-medium"
                >
                  {item.name}
                </Link>
              </motion.div>
            ))}
          </motion.nav>

          {/* Auth Section */}
          <motion.div
            className="flex items-center space-x-4"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            {!loading && (
              <>
                {user ? (
                  <ProfileDropdown />
                ) : (
                  <div className="flex items-center space-x-3">
                    <Link
                      href="/login"
                      className="text-[#E0E0E0] hover:text-[#F8E71C] transition-colors duration-300 font-medium"
                    >
                      Login
                    </Link>
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Link
                        href="/signup"
                        className="bg-[#F8E71C] text-black px-4 py-2 rounded-lg hover:bg-[#FFD700] transition-colors duration-300 font-medium border-glow"
                      >
                        Get Started
                      </Link>
                    </motion.div>
                  </div>
                )}
              </>
            )}
          </motion.div>
        </div>
      </div>
    </motion.header>
  );
}
