'use client';

import { motion } from 'framer-motion';
import PricingCards from '@/components/pricing/PricingCards';

export default function PricingSection() {
  return (
    <motion.section
      id="pricing"
      className="py-16 sm:py-20 md:py-24 bg-black w-full"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      viewport={{ once: true }}
    >
      <div className="text-center mb-10 sm:mb-16 px-4">
        <motion.h2
          className="text-3xl sm:text-4xl md:text-5xl font-bold mb-3 sm:mb-4 text-white"
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          Pricing
        </motion.h2>
        <motion.p
          className="text-gray-400 text-base sm:text-lg"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
        >
          Simple and transparent pricing for everyone.
        </motion.p>
      </div>

      {/* Dynamic pricing cards from database */}
      <PricingCards />
    </motion.section>
  );
}