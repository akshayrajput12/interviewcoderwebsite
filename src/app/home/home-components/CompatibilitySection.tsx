'use client';

import { motion, useMotionValue, useTransform } from 'framer-motion';
import { useState, useEffect } from 'react';

const platforms = [
  { 
    name: 'Zoom', 
    status: 'Verified Compatible', 
    statusColor: 'bg-gradient-to-r from-yellow-500 to-orange-500',
    icon: '📹',
    description: 'Video conferencing - 99.8% success rate',
    compatibility: '98%',
    lastTested: '2024-01-15',
    features: ['Screen sharing bypass', 'Audio detection avoidance', 'Recording protection']
  },
  { 
    name: 'HackerRank', 
    status: 'Fully Undetectable', 
    statusColor: 'bg-gradient-to-r from-green-500 to-emerald-500',
    icon: '💻',
    description: 'Coding assessment - Perfect stealth mode',
    compatibility: '100%',
    lastTested: '2024-01-14',
    features: ['Code injection', 'Keystroke masking', 'Time analysis bypass']
  },
  { 
    name: 'CodeSignal', 
    status: 'Fully Undetectable', 
    statusColor: 'bg-gradient-to-r from-green-500 to-emerald-500',
    icon: '🔧',
    description: 'Technical screening - Advanced AI integration',
    compatibility: '100%',
    lastTested: '2024-01-13',
    features: ['Pattern recognition', 'Solution optimization', 'Behavioral mimicking']
  },
  { 
    name: 'CoderPad', 
    status: 'Fully Undetectable', 
    statusColor: 'bg-gradient-to-r from-green-500 to-emerald-500',
    icon: '📝',
    description: 'Collaborative coding - Real-time assistance',
    compatibility: '100%',
    lastTested: '2024-01-12',
    features: ['Live code generation', 'Syntax completion', 'Error prevention']
  },
  { 
    name: 'Amazon Chime', 
    status: 'Verified Compatible', 
    statusColor: 'bg-gradient-to-r from-yellow-500 to-orange-500',
    icon: '💬',
    description: 'Enterprise video calls - Secure integration',
    compatibility: '97%',
    lastTested: '2024-01-11',
    features: ['Enterprise bypass', 'Security circumvention', 'Admin detection avoidance']
  },
  { 
    name: 'Microsoft Teams', 
    status: 'Fully Undetectable', 
    statusColor: 'bg-gradient-to-r from-green-500 to-emerald-500',
    icon: '🏢',
    description: 'Corporate collaboration - Enterprise-grade stealth',
    compatibility: '100%',
    lastTested: '2024-01-10',
    features: ['Corporate firewall bypass', 'Admin monitoring evasion', 'Audit trail masking']
  },
  { 
    name: 'Google Meet', 
    status: 'Fully Undetectable', 
    statusColor: 'bg-gradient-to-r from-green-500 to-emerald-500',
    icon: '🎥',
    description: 'Google video conferencing - AI-powered stealth',
    compatibility: '100%',
    lastTested: '2024-01-09',
    features: ['Google AI bypass', 'Machine learning evasion', 'Behavioral analysis protection']
  }
];

export default function CompatibilitySection() {
  const [expandedCard, setExpandedCard] = useState<number | null>(null);
  const [isMounted, setIsMounted] = useState(false);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Set isMounted to true after component mounts to avoid hydration mismatch
  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <motion.section 
      className="py-20 max-w-5xl mx-auto px-4 relative overflow-hidden"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      viewport={{ once: true }}
    >
      {/* Floating Background Elements - Only render on client side */}
      {isMounted && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(15)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-green-400/20 rounded-full"
              initial={{ 
                x: Math.random() * 1000, 
                y: Math.random() * 800,
                scale: Math.random() * 0.5 + 0.5
              }}
              animate={{ 
                y: [null, -50, null],
                opacity: [0.2, 0.6, 0.2],
                scale: [null, 1.2, null]
              }}
              transition={{ 
                duration: 4 + Math.random() * 3,
                repeat: Infinity,
                delay: Math.random() * 3
              }}
            />
          ))}
        </div>
      )}

      {/* SEO Optimized Main Heading */}
      <motion.div
        className="text-center mb-12"
        onMouseMove={(e) => {
          const rect = e.currentTarget.getBoundingClientRect();
          mouseX.set(e.clientX - rect.left - rect.width / 2);
          mouseY.set(e.clientY - rect.top - rect.height / 2);
        }}
      >
        <motion.h2 
          className="text-4xl md:text-6xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-white via-gray-200 to-gray-400 relative"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          style={{
            rotateX: useTransform(mouseY, [-100, 100], [2, -2]),
            rotateY: useTransform(mouseX, [-100, 100], [-2, 2])
          }}
        >
          Platform Compatibility Status 2024
          <motion.div
            className="absolute -inset-2 bg-gradient-to-r from-green-400/10 via-yellow-400/10 to-green-400/10 rounded-xl blur-xl"
            animate={{ opacity: [0.3, 0.7, 0.3] }}
            transition={{ duration: 3, repeat: Infinity }}
          />
        </motion.h2>
        
        <motion.p 
          className="text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          viewport={{ once: true }}
        >
          Real-time compatibility testing across all major technical interview platforms. 
          Our AI remains undetected with 99.7% success rate across 50,000+ interviews.
        </motion.p>
      </motion.div>



      {/* SEO Warning Message */}
      <motion.div 
        className="bg-gradient-to-r from-yellow-900/30 to-orange-900/30 border border-yellow-600/40 rounded-xl p-6 mb-12 relative overflow-hidden"
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, delay: 0.6 }}
        viewport={{ once: true }}
        whileHover={{ scale: 1.02 }}
      >
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-yellow-400/5 to-transparent"
          animate={{ x: ['-100%', '100%'] }}
          transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
        />
        <div className="flex items-start gap-4 relative z-10">
          <motion.span 
            className="text-yellow-400 text-2xl"
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            ⚠️
          </motion.span>
          <div className="text-yellow-100">
            <h3 className="font-semibold mb-2">Important: Zoom Version Compatibility</h3>
            <p className="text-sm leading-relaxed">
              For optimal performance with Zoom interviews, ensure you're using version 6.0.7+ with Advanced Encryption disabled, 
              or versions 6.0.6 and below. Our advanced bypass technology works seamlessly with all configurations.
            </p>
            <motion.button
              className="mt-3 text-yellow-400 underline text-sm hover:text-yellow-300"
              whileHover={{ x: 5 }}
            >
              View detailed setup guide →
            </motion.button>
          </div>
        </div>
      </motion.div>

      {/* Enhanced Platform Cards */}
      <div className="space-y-6">
        {platforms.map((platform, index) => (
          <motion.div
            key={platform.name}
            className="group bg-gradient-to-br from-[#1A1A1A] to-[#2A2A2A] border border-gray-700 rounded-xl overflow-hidden relative"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
            viewport={{ once: true }}
            whileHover={{ 
              scale: 1.02,
              borderColor: '#F8E71C',
              boxShadow: '0 15px 35px rgba(0, 0, 0, 0.4), 0 0 20px rgba(248, 231, 28, 0.2)'
            }}
            onClick={() => setExpandedCard(expandedCard === index ? null : index)}
          >
            {/* Animated Background Gradient */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-green-400/5 via-transparent to-yellow-400/5"
              animate={{ 
                background: [
                  'linear-gradient(90deg, rgba(34, 197, 94, 0.05) 0%, transparent 50%, rgba(248, 231, 28, 0.05) 100%)',
                  'linear-gradient(90deg, rgba(248, 231, 28, 0.05) 0%, transparent 50%, rgba(34, 197, 94, 0.05) 100%)'
                ]
              }}
              transition={{ duration: 4, repeat: Infinity, repeatType: "reverse" }}
            />
            
            <div className="p-6 relative z-10">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <motion.div 
                    className="text-3xl"
                    whileHover={{ 
                      scale: 1.3, 
                      rotate: [0, -10, 10, 0],
                      filter: 'drop-shadow(0 0 10px rgba(248, 231, 28, 0.5))'
                    }}
                    transition={{ duration: 0.5 }}
                  >
                    {platform.icon}
                  </motion.div>
                  <div>
                    <h3 className="text-white font-bold text-xl mb-1">{platform.name}</h3>
                    <p className="text-gray-400 text-sm">{platform.description}</p>
                    <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                      <span>Compatibility: {platform.compatibility}</span>
                      <span>Last tested: {platform.lastTested}</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  <motion.div 
                    className={`px-4 py-2 rounded-full text-xs font-semibold text-white ${platform.statusColor} relative overflow-hidden`}
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.2 }}
                  >
                    <motion.div
                      className="absolute inset-0 bg-white/20"
                      initial={{ x: '-100%' }}
                      whileHover={{ x: '100%' }}
                      transition={{ duration: 0.6 }}
                    />
                    <span className="relative z-10">{platform.status}</span>
                  </motion.div>
                  
                  <motion.button
                    className="text-gray-400 hover:text-yellow-400 transition-colors p-2"
                    whileHover={{ scale: 1.2, rotate: 180 }}
                    whileTap={{ scale: 0.9 }}
                    animate={{ rotate: expandedCard === index ? 180 : 0 }}
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </motion.button>
                </div>
              </div>

              {/* Expandable Features Section */}
              <motion.div
                initial={false}
                animate={{
                  height: expandedCard === index ? 'auto' : 0,
                  opacity: expandedCard === index ? 1 : 0
                }}
                transition={{ duration: 0.4, ease: "easeInOut" }}
                className="overflow-hidden"
              >
                <div className="pt-6 border-t border-gray-700 mt-4">
                  <h4 className="text-yellow-400 font-semibold mb-3">Advanced Features:</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {platform.features.map((feature, featureIndex) => (
                      <motion.div
                        key={feature}
                        className="bg-gray-800/50 rounded-lg p-3 text-sm text-gray-300"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: featureIndex * 0.1 }}
                        whileHover={{ 
                          backgroundColor: 'rgba(248, 231, 28, 0.1)',
                          scale: 1.02
                        }}
                      >
                        <span className="text-green-400 mr-2">✓</span>
                        {feature}
                      </motion.div>
                    ))}
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Enhanced Footer with SEO Content */}
      <motion.div 
        className="mt-16 text-center"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.8 }}
        viewport={{ once: true }}
      >
        <div className="bg-gradient-to-r from-[#1A1A1A] to-[#2A2A2A] rounded-xl p-8 border border-gray-700">
          <h3 className="text-2xl font-bold text-white mb-4">Why Choose GhostCoder?</h3>
          <div className="grid md:grid-cols-3 gap-6 text-sm text-gray-400">
            <div>
              <div className="text-green-400 text-lg mb-2">🛡️</div>
              <h4 className="font-semibold text-white mb-2">Undetectable Technology</h4>
              <p>Advanced AI algorithms that mimic human coding patterns and bypass all detection systems.</p>
            </div>
            <div>
              <div className="text-yellow-400 text-lg mb-2">⚡</div>
              <h4 className="font-semibold text-white mb-2">Real-time Solutions</h4>
              <p>Instant LeetCode problem solving with optimized algorithms and detailed explanations.</p>
            </div>
            <div>
              <div className="text-blue-400 text-lg mb-2">🎯</div>
              <h4 className="font-semibold text-white mb-2">FAANG Success</h4>
              <p>Proven track record with 50,000+ successful interviews at top tech companies.</p>
            </div>
          </div>
          
          <motion.button
            className="mt-6 bg-gradient-to-r from-[#F8E71C] to-[#FFD700] text-black font-semibold px-8 py-3 rounded-xl"
            whileHover={{ 
              scale: 1.05,
              boxShadow: '0 10px 25px rgba(248, 231, 28, 0.4)'
            }}
            whileTap={{ scale: 0.95 }}
          >
            Join Now
          </motion.button>
        </div>
      </motion.div>
    </motion.section>
  );
}