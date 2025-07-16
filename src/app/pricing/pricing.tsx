'use client';

import { motion } from 'framer-motion';
import PricingCards from '@/components/pricing/PricingCards';
import Link from 'next/link';

export default function Pricing() {
  return (
    <div className="min-h-screen bg-[#0D0D0D] text-[#E0E0E0] font-roboto">
      <div className="container mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-6xl font-bold mb-4">
            Choose Your <span className="text-yellow-400 text-glow">Plan</span>
          </h1>
          <p className="text-lg text-gray-400 mb-8">
            Select the plan that best fits your interview preparation needs
          </p>
        </motion.div>
        
        {/* Dynamic pricing cards */}
        <PricingCards />
        
        <div className="mt-12 text-center">
          <Link 
            href="/home"
            className="inline-block bg-transparent border border-yellow-400 text-yellow-400 font-medium px-6 py-3 rounded-lg hover:bg-yellow-400 hover:text-black transition-colors"
          >
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}