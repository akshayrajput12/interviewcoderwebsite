'use client';

import { motion } from 'framer-motion';

export default function Features() {
  return (
    <div className="min-h-screen bg-[#0D0D0D] text-[#E0E0E0] font-roboto">
      <div className="container mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center"
        >
          <h1 className="text-4xl md:text-6xl font-bold mb-4">
            Features <span className="text-yellow-400 text-glow">Coming Soon</span>
          </h1>
          <p className="text-lg text-gray-400 mb-8">
            This page is under construction. Check back soon for detailed feature information.
          </p>
          <a 
            href="/home" 
            className="bg-[#F8E71C] text-black font-medium px-6 py-3 rounded-lg hover:bg-[#FFD700] transition-colors"
          >
            Back to Home
          </a>
        </motion.div>
      </div>
    </div>
  );
}