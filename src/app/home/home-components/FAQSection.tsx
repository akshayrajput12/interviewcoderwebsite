'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';

const faqs = [
  {
    question: 'Is GhostCoder safe?',
    answer: 'Yes, GhostCoder is completely safe to use. We employ advanced security measures and encryption to protect your data and ensure your privacy during interviews.'
  },
  {
    question: 'Is GhostCoder detectable?',
    answer: 'No, GhostCoder is designed to be completely undetectable. We use sophisticated techniques to bypass screen capture detection and mimic natural human typing patterns.'
  },
  {
    question: 'What are credits and how do they work?',
    answer: 'Credits are used for interview assistance sessions. Each credit allows you to use GhostCoder for one technical interview. Credits refresh at the beginning of each billing cycle.'
  },
  {
    question: 'Can I purchase additional credits?',
    answer: 'Yes, additional credits can be purchased at any time. Contact our support team for custom credit packages tailored to your interview preparation needs.'
  },
  {
    question: 'Is there a refund policy?',
    answer: "We offer a 7-day money-back guarantee if you're not satisfied with our service. Annual subscriptions can be refunded on a prorated basis within 30 days of purchase."
  },
  {
    question: 'Does GhostCoder offer support?',
    answer: 'Yes, we provide comprehensive support through our Help Center, email support, and live chat for Pro users. Our team is available to help you with any questions or issues.'
  },
  {
    question: 'What are my subscription options?',
    answer: 'We offer three plans: Free (for testing), Pro Monthly (₹1499/month with 100 credits), and Pro Annual (₹999/month with 150 credits). Each plan includes different features and benefits.'
  }
];

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <motion.section 
      className="py-16 max-w-3xl mx-auto"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      viewport={{ once: true }}
    >
      <h2 className="text-3xl font-bold text-center mb-8">Common Questions</h2>
      
      <div className="space-y-2">
        {faqs.map((faq, index) => (
          <motion.div 
            key={index}
            className="border-b border-gray-700 py-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
            viewport={{ once: true }}
          >
            <button 
              className="w-full flex justify-between items-center text-left text-lg hover:text-yellow-400 transition-colors"
              onClick={() => toggleFAQ(index)}
            >
              <span>{faq.question}</span>
              <motion.span
                animate={{ rotate: openIndex === index ? 180 : 0 }}
                transition={{ duration: 0.3 }}
                className="text-2xl"
              >
                ▼
              </motion.span>
            </button>
            
            <motion.div
              initial={false}
              animate={{
                height: openIndex === index ? 'auto' : 0,
                opacity: openIndex === index ? 1 : 0
              }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <p className="text-gray-400 mt-4 pb-2">{faq.answer}</p>
            </motion.div>
          </motion.div>
        ))}
      </div>
      
      <p className="text-center text-gray-400 mt-8">
        Have more questions? Visit our{' '}
        <a className="text-yellow-400 hover:underline" href="#">Help Center</a>{' '}
        for detailed articles and support.
      </p>
    </motion.section>
  );
}