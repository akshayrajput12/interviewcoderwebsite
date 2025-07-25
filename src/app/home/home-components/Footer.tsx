'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { downloadWindows, downloadMac } from '@/constants/downloads';

// Footer sections based on the image
const legalLinks = [
  { name: 'Refund Policy', href: '#' },
  { name: 'Terms of Service', href: '#' },
  { name: 'Cancellation Policy', href: '#' }
];

const pagesLinks = [
  { name: 'Contact Support', href: 'tel:+919653814628' },
  { name: 'Create account', href: '/signup' },
  { name: 'Login to account', href: '/login' }
];

const supportInfo = [
  { 
    type: 'Phone', 
    value: '+91 9653814628', 
    href: 'tel:+919653814628',
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
      </svg>
    )
  },
  { 
    type: 'Email', 
    value: 'akshayrajput2616@gmail.com', 
    href: 'mailto:akshayrajput2616@gmail.com',
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    )
  }
];

// Social media icons
const socialIcons = [
  { name: 'Twitter', icon: 'X', href: '#' },
  { name: 'Instagram', icon: 'IG', href: '#' },
  { name: 'TikTok', icon: 'TT', href: '#' }
];

export default function Footer() {
  // Download functions using centralized constants
  const handleDownloadMac = downloadMac;
  const handleDownloadWindows = downloadWindows;

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
              <span className="text-base sm:text-lg font-bold text-white">GhostCoder</span>
            </div>
            <p className="text-gray-400 text-xs sm:text-sm mb-4 sm:mb-6 leading-relaxed max-w-md">
              GhostCoder is a desktop app designed to help job seekers ace technical interviews by providing real-time assistance with coding questions.
            </p>
            
            {/* Download CTAs */}
            <div className="flex flex-col sm:flex-row gap-3 mt-4 mb-4">
              <motion.button
                onClick={handleDownloadMac}
                className="group relative bg-gradient-to-r from-[#F8E71C] to-[#FFD700] text-black font-semibold px-4 py-2 rounded-lg overflow-hidden cursor-pointer text-xs sm:text-sm"
                whileHover={{
                  scale: 1.05,
                  boxShadow: '0 5px 15px rgba(248, 231, 28, 0.4)'
                }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 400 }}
              >
                <span className="relative z-10 flex items-center gap-2">
                  <span className="text-sm">🚀</span>
                  Download for macOS
                </span>
              </motion.button>

              <motion.button
                onClick={handleDownloadWindows}
                className="group relative bg-transparent border border-[#F8E71C] text-[#F8E71C] font-semibold px-4 py-2 rounded-lg overflow-hidden cursor-pointer text-xs sm:text-sm"
                whileHover={{
                  scale: 1.05,
                  backgroundColor: '#F8E71C',
                  color: '#000000',
                  boxShadow: '0 5px 15px rgba(248, 231, 28, 0.4)'
                }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 400 }}
              >
                <span className="relative z-10 flex items-center gap-2">
                  <span className="text-sm">💻</span>
                  Download for Windows
                </span>
              </motion.button>
            </div>

            {/* Social media icons */}
            <div className="flex space-x-3 mt-4">
              {socialIcons.map((social) => (
                <motion.a
                  key={social.name}
                  href={social.href}
                  className="w-5 h-5 sm:w-6 sm:h-6 rounded-full border border-gray-700 flex items-center justify-center text-gray-400 text-xs cursor-pointer"
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
            <p className="text-gray-600 text-xs mt-3 sm:mt-4">© 2023 GhostCoder. All rights reserved.</p>
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
                    className="hover:text-gray-300 transition-colors text-xs sm:text-sm cursor-pointer" 
                    href={link.href}
                  >
                    {link.name}
                  </motion.a>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Pages section - 2 columns on md screens */}
          <motion.div
            className="sm:col-span-1 md:col-span-2"
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
                    className="hover:text-gray-300 transition-colors text-xs sm:text-sm cursor-pointer" 
                    href={link.href}
                  >
                    {link.name}
                  </motion.a>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Customer Support section - 1 column on md screens */}
          <motion.div
            className="sm:col-span-1 md:col-span-1"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            viewport={{ once: true }}
          >
            <h4 className="font-medium mb-3 sm:mb-4 text-white text-sm sm:text-base">Support</h4>
            <ul className="space-y-2 text-gray-400">
              {supportInfo.map((support) => (
                <li key={support.type}>
                  <motion.a 
                    className="hover:text-gray-300 transition-colors text-xs sm:text-sm cursor-pointer flex items-center gap-2" 
                    href={support.href}
                  >
                    <span className="text-yellow-400">
                      {support.icon}
                    </span>
                    <div>
                      <div className="text-gray-500 text-xs">{support.type}</div>
                      <div>{support.value}</div>
                    </div>
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
          GhostCoder
        </div>
      </div>
    </motion.footer>
  );
}