'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';

// Footer sections based on the image
const legalLinks = [
  { name: 'Refund Policy', href: '#' },
  { name: 'Terms of Service', href: '#' },
  { name: 'Cancellation Policy', href: '#' }
];

const pagesLinks = [
  { name: 'Contact Support', href: '#' },
  { name: 'Create account', href: '#' },
  { name: 'Login to account', href: '#' }
];

// Social media icons
const socialIcons = [
  { name: 'Twitter', icon: 'X', href: '#' },
  { name: 'Instagram', icon: 'IG', href: '#' },
  { name: 'TikTok', icon: 'TT', href: '#' }
];

export default function Footer() {
  return (
    <motion.footer 
      className="py-8 sm:py-10 md:py-12 bg-black border-t border-gray-900 relative overflow-hidden"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      viewport={{ once: true }}
    >
      <div className="container mx-auto px-4 max-w-6xl relative z-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-12 gap-8">
          {/* Logo and description - 6 columns on md screens */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="sm:col-span-2 md:col-span-6"
          >
            <div className="flex items-center space-x-2 mb-4">
              <motion.div 
                className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 bg-yellow-400 rounded-full flex items-center justify-center"
              >
                <span className="text-black font-bold text-xs md:text-sm">IC</span>
              </motion.div>
              <span className="text-base sm:text-lg font-bold text-white">Interview Coder</span>
            </div>
            <p className="text-gray-400 text-xs sm:text-sm mb-4 sm:mb-6 leading-relaxed max-w-md">
              Interview Coder is a desktop app designed to help job seekers ace technical interviews by providing real-time assistance with coding questions.
            </p>
            
            {/* Social media icons */}
            <div className="flex space-x-3 mt-4">
              {socialIcons.map((social) => (
                <motion.a
                  key={social.name}
                  href={social.href}
                  className="w-5 h-5 sm:w-6 sm:h-6 rounded-full border border-gray-700 flex items-center justify-center text-gray-400 text-xs"
                  whileHover={{ 
                    backgroundColor: '#333',
                    color: '#fff',
                  }}
                  aria-label={social.name}
                >
                  {social.icon}
                </motion.a>
              ))}
            </div>

            {/* System status */}
            <div className="mt-4 sm:mt-6">
              <motion.span 
                className="text-gray-400 text-xs flex items-center gap-1.5"
              >
                <span className="w-1.5 h-1.5 bg-green-500 rounded-full inline-block"></span>
                All systems online
              </motion.span>
            </div>

            {/* Copyright */}
            <p className="text-gray-600 text-xs mt-3 sm:mt-4">© 2023 Interview Coder. All rights reserved.</p>
          </motion.div>
          
          {/* Legal section - 3 columns on md screens */}
          <motion.div
            className="sm:col-span-1 md:col-span-3"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true }}
          >
            <h4 className="font-medium mb-3 sm:mb-4 text-white text-sm sm:text-base">Legal</h4>
            <ul className="space-y-1 sm:space-y-2 text-gray-400">
              {legalLinks.map((link) => (
                <li key={link.name}>
                  <motion.a 
                    className="hover:text-gray-300 transition-colors text-xs sm:text-sm" 
                    href={link.href}
                  >
                    {link.name}
                  </motion.a>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Pages section - 3 columns on md screens */}
          <motion.div
            className="sm:col-span-1 md:col-span-3"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <h4 className="font-medium mb-3 sm:mb-4 text-white text-sm sm:text-base">Pages</h4>
            <ul className="space-y-1 sm:space-y-2 text-gray-400">
              {pagesLinks.map((link) => (
                <li key={link.name}>
                  <motion.a 
                    className="hover:text-gray-300 transition-colors text-xs sm:text-sm" 
                    href={link.href}
                  >
                    {link.name}
                  </motion.a>
                </li>
              ))}
            </ul>
          </motion.div>
        </div>
      </div>
      
      {/* Large watermark text in background - responsive */}
      <div className="absolute bottom-0 left-0 right-0 overflow-hidden opacity-5 pointer-events-none">
        <div className="hidden md:block text-[100px] lg:text-[200px] font-bold text-gray-500 tracking-wider whitespace-nowrap">
          Interview Coder
        </div>
      </div>
    </motion.footer>
  );
}