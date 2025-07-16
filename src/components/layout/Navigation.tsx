'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';

const navItems = [
  { name: 'Home', href: '/home' },
  { name: 'Features', href: '/features' },
  { name: 'Pricing', href: '/pricing' },
  { name: 'Blog', href: '/blog' },
];

export default function Navigation() {
  return (
    <motion.nav 
      className="hidden md:flex items-center space-x-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6, delay: 0.2 }}
    >
      {navItems.map((item, index) => (
        <motion.div
          key={item.name}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: index * 0.1 }}
        >
          <Link 
            className="hover:text-yellow-400 transition-colors" 
            href={item.href}
          >
            {item.name}
          </Link>
        </motion.div>
      ))}
    </motion.nav>
  );
}