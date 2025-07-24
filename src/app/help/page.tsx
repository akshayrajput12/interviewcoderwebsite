'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Header from '@/app/home/home-components/Header';
import Footer from '@/app/home/home-components/Footer';

const faqData = [
  {
    category: 'Getting Started',
    questions: [
      {
        question: 'How do I start using GhostCoder?',
        answer: 'Simply sign up for a free account and you\'ll get 50 free credits to start practicing. You can then choose from various interview types and difficulty levels.'
      },
      {
        question: 'What are credits and how do they work?',
        answer: 'Credits are used to access interview sessions. Each interview session consumes a certain number of credits based on the complexity and duration. Free users get 50 credits, while paid plans offer more credits monthly.'
      },
      {
        question: 'How do I upgrade my plan?',
        answer: 'Go to Settings > Billing to view available plans and upgrade. You can choose between monthly and yearly billing cycles, with yearly plans offering significant savings.'
      }
    ]
  },
  {
    category: 'Payment & Billing',
    questions: [
      {
        question: 'What payment methods do you accept?',
        answer: 'We accept all major credit cards, debit cards, UPI, and net banking through our secure Razorpay integration.'
      },
      {
        question: 'Can I cancel my subscription anytime?',
        answer: 'Yes, you can cancel your subscription at any time from the Settings > Billing page. Your subscription will remain active until the end of your billing period.'
      },
      {
        question: 'Do you offer refunds?',
        answer: 'We offer a 7-day money-back guarantee for all paid plans. If you\'re not satisfied, contact our support team for a full refund.'
      }
    ]
  },
  {
    category: 'Technical Support',
    questions: [
      {
        question: 'The platform is not working properly, what should I do?',
        answer: 'First, try refreshing the page or clearing your browser cache. If the issue persists, please contact our support team with details about the problem.'
      },
      {
        question: 'How do I reset my password?',
        answer: 'Click on "Forgot Password" on the login page and enter your email address. You\'ll receive a password reset link in your email.'
      },
      {
        question: 'Can I use GhostCoder on mobile devices?',
        answer: 'Yes, GhostCoder is fully responsive and works on all devices including smartphones and tablets.'
      }
    ]
  },
  {
    category: 'Features',
    questions: [
      {
        question: 'What types of interviews can I practice?',
        answer: 'We offer algorithm coding interviews, system design interviews, and behavioral interviews. Each type is designed to simulate real interview conditions.'
      },
      {
        question: 'Is the platform undetectable during real interviews?',
        answer: 'Yes, our platform is designed to be completely undetectable during screen sharing sessions, making it perfect for real interview practice.'
      },
      {
        question: 'Do you provide feedback on my performance?',
        answer: 'Yes, after each interview session, you\'ll receive detailed feedback on your performance, including areas for improvement and suggestions.'
      }
    ]
  }
];

export default function HelpPage() {
  const [activeCategory, setActiveCategory] = useState('Getting Started');
  const [openQuestion, setOpenQuestion] = useState<number | null>(null);

  const toggleQuestion = (index: number) => {
    setOpenQuestion(openQuestion === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <Header />
      
      <div className="pt-20 pb-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-12">
            <motion.h1 
              className="text-4xl font-bold mb-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              Help & Support
            </motion.h1>
            <motion.p 
              className="text-gray-400 text-lg max-w-2xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              Find answers to common questions and get the help you need
            </motion.p>
          </div>

          <div className="flex gap-8">
            {/* Sidebar */}
            <div className="w-64 flex-shrink-0">
              <div className="bg-[#1a1a1a] rounded-lg p-1 sticky top-24">
                {faqData.map((category) => (
                  <button
                    key={category.category}
                    onClick={() => setActiveCategory(category.category)}
                    className={`w-full text-left px-4 py-3 rounded-lg font-medium transition-colors ${
                      activeCategory === category.category
                        ? 'bg-[#333] text-white'
                        : 'text-gray-400 hover:text-white hover:bg-[#2a2a2a]'
                    }`}
                  >
                    {category.category}
                  </button>
                ))}
              </div>
            </div>

            {/* Main Content */}
            <div className="flex-1">
              {faqData.map((category) => (
                activeCategory === category.category && (
                  <motion.div
                    key={category.category}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <h2 className="text-2xl font-bold mb-6">{category.category}</h2>
                    
                    <div className="space-y-4">
                      {category.questions.map((faq, index) => (
                        <motion.div
                          key={index}
                          className="bg-[#1a1a1a] rounded-lg overflow-hidden"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3, delay: index * 0.1 }}
                        >
                          <button
                            onClick={() => toggleQuestion(index)}
                            className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-[#2a2a2a] transition-colors"
                          >
                            <span className="font-medium text-white">{faq.question}</span>
                            <svg
                              className={`w-5 h-5 text-gray-400 transition-transform ${
                                openQuestion === index ? 'rotate-180' : ''
                              }`}
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                          </button>
                          
                          {openQuestion === index && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.3 }}
                              className="px-6 pb-4"
                            >
                              <p className="text-gray-300 leading-relaxed">{faq.answer}</p>
                            </motion.div>
                          )}
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                )
              ))}
            </div>
          </div>

          {/* Contact Support */}
          <motion.div 
            className="mt-16 text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <div className="bg-[#1a1a1a] rounded-lg p-8 max-w-2xl mx-auto">
              <h3 className="text-xl font-semibold mb-4">Still need help?</h3>
              <p className="text-gray-400 mb-6">
                Can't find what you're looking for? Our support team is here to help.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a
                  href="mailto:support@ghostcoder.com"
                  className="bg-yellow-400 text-black px-6 py-3 rounded-lg hover:bg-yellow-500 transition-colors font-medium"
                >
                  Email Support
                </a>
                <button className="bg-transparent border border-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition-colors font-medium">
                  Live Chat
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
