'use client';

import { motion, useMotionValue, useTransform } from 'framer-motion';
import { useState, useEffect } from 'react';

export default function HeroSection() {
  const [isHovered, setIsHovered] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  
  const rotateX = useTransform(mouseY, [-300, 300], [10, -10]);
  const rotateY = useTransform(mouseX, [-300, 300], [-10, 10]);

  // Set isMounted to true after component mounts to avoid hydration mismatch
  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <motion.section 
      className="text-center mt-10 py-12 relative overflow-hidden"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.2 }}
    >
      {/* Animated Background Particles - Only render on client side */}
      {isMounted && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-yellow-400 rounded-full opacity-20"
              initial={{ 
                x: Math.random() * 1200, 
                y: Math.random() * 800 
              }}
              animate={{ 
                y: [null, -100, null],
                opacity: [0.2, 0.8, 0.2]
              }}
              transition={{ 
                duration: 3 + Math.random() * 2,
                repeat: Infinity,
                delay: Math.random() * 2
              }}
            />
          ))}
        </div>
      )}

      {/* SEO Optimized Notification Banner */}
      <motion.div 
        className="mb-8 sm:mb-12 px-4"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
      >
        <motion.div 
          className="inline-flex flex-wrap justify-center sm:flex-nowrap items-center bg-gradient-to-r from-[#1A1A1A] to-[#2A2A2A] border border-gray-700 rounded-full px-4 sm:px-6 py-2 sm:py-3 text-xs sm:text-sm cursor-pointer relative overflow-hidden"
          whileHover={{ 
            scale: 1.05,
            borderColor: '#F8E71C',
            boxShadow: '0 0 20px rgba(248, 231, 28, 0.4)'
          }}
          onHoverStart={() => setIsHovered(true)}
          onHoverEnd={() => setIsHovered(false)}
        >
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-yellow-400/10 to-transparent"
            initial={{ x: '-100%' }}
            animate={{ x: isHovered ? '100%' : '-100%' }}
            transition={{ duration: 0.6 }}
          />
          <span className="text-gray-300 relative z-10">✅ Proven effective in 2024 interviews</span>
          <motion.span 
            className="text-yellow-400 ml-2 relative z-10"
            whileHover={{ x: 8, scale: 1.1 }}
            transition={{ type: "spring", stiffness: 400 }}
          >
            See live results →
          </motion.span>
        </motion.div>
      </motion.div>

      {/* SEO Optimized Main Heading */}
      <motion.div
        style={{ rotateX, rotateY, transformPerspective: 1000 }}
        onMouseMove={(e) => {
          const rect = e.currentTarget.getBoundingClientRect();
          const centerX = rect.left + rect.width / 2;
          const centerY = rect.top + rect.height / 2;
          mouseX.set(e.clientX - centerX);
          mouseY.set(e.clientY - centerY);
        }}
        onMouseLeave={() => {
          mouseX.set(0);
          mouseY.set(0);
        }}
      >
        <motion.h1 
          className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 text-white relative"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          whileHover={{ 
            scale: 1.02,
            textShadow: "0 0 20px rgba(248, 231, 28, 0.5)"
          }}
        >
          AI-Powered Coding Interview Assistant
        </motion.h1>
      </motion.div>
      
      {/* SEO Optimized Subtitle */}
      <motion.div 
        className="mb-8 max-w-3xl mx-auto"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.6 }}
      >
        <motion.p 
          className="text-lg md:text-xl text-gray-400 mb-4 leading-relaxed"
          whileHover={{ color: '#E5E5E5' }}
        >
          Master technical interviews with our advanced AI that provides real-time LeetCode solutions, 
          algorithm explanations, and coding assistance for FAANG companies.
        </motion.p>
        <motion.div 
          className="flex flex-wrap justify-center gap-2 text-sm text-gray-500"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          <span className="bg-gray-800 px-3 py-1 rounded-full">Google Interviews</span>
          <span className="bg-gray-800 px-3 py-1 rounded-full">Meta Coding</span>
          <span className="bg-gray-800 px-3 py-1 rounded-full">Amazon SDE</span>
          <span className="bg-gray-800 px-3 py-1 rounded-full">Microsoft</span>
          <span className="bg-gray-800 px-3 py-1 rounded-full">Apple</span>
        </motion.div>
      </motion.div>
      
      {/* Enhanced Download Buttons */}
      <motion.div 
        className="flex flex-col sm:flex-row justify-center gap-4 mb-16"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.8 }}
      >
        <motion.button 
          className="group relative bg-gradient-to-r from-[#F8E71C] to-[#FFD700] text-black font-semibold px-8 py-4 rounded-xl overflow-hidden"
          whileHover={{ 
            scale: 1.05,
            boxShadow: '0 10px 30px rgba(248, 231, 28, 0.4)'
          }}
          whileTap={{ scale: 0.95 }}
          transition={{ type: "spring", stiffness: 400 }}
        >
          <motion.div
            className="absolute inset-0 bg-white/20"
            initial={{ x: '-100%', skewX: 45 }}
            whileHover={{ x: '100%' }}
            transition={{ duration: 0.6 }}
          />
          <span className="relative z-10 flex items-center gap-3">
            <motion.span 
              className="text-2xl"
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.5 }}
            >
              🚀
            </motion.span>
            Join Now - macOS
          </span>
        </motion.button>
        
        <motion.button 
          className="group relative bg-transparent border-2 border-[#F8E71C] text-[#F8E71C] font-semibold px-8 py-4 rounded-xl overflow-hidden"
          whileHover={{ 
            scale: 1.05,
            backgroundColor: '#F8E71C',
            color: '#000000',
            boxShadow: '0 10px 30px rgba(248, 231, 28, 0.4)'
          }}
          whileTap={{ scale: 0.95 }}
          transition={{ type: "spring", stiffness: 400 }}
        >
          <motion.div
            className="absolute inset-0 bg-[#F8E71C]"
            initial={{ scale: 0, borderRadius: '100%' }}
            whileHover={{ scale: 1, borderRadius: '0%' }}
            transition={{ duration: 0.4 }}
          />
          <span className="relative z-10 flex items-center gap-3">
            <motion.span 
              className="text-2xl"
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.5 }}
            >
              💻
            </motion.span>
            Join Now - Windows
          </span>
        </motion.button>
      </motion.div>

      {/* Enhanced Screenshots Section */}
      <motion.div 
        className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 1.0 }}
      >
        {/* Left Screenshot - Enhanced */}
        <motion.div 
          className="relative group"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 1.2 }}
          whileHover={{ 
            scale: 1.03, 
            y: -10,
            rotateY: 5,
            transformPerspective: 1000
          }}
        >
          <div className="text-left mb-4">
            <motion.span 
              className="text-yellow-400 font-semibold text-lg"
              whileHover={{ scale: 1.1 }}
            >
              Your Screen
            </motion.span>
            <span className="text-gray-400 ml-2">- AI-powered coding assistance</span>
          </div>
          
          <motion.div 
            className="bg-gradient-to-br from-[#1A1A1A] to-[#2A2A2A] rounded-xl border border-gray-700 overflow-hidden relative"
            whileHover={{ 
              borderColor: '#F8E71C',
              boxShadow: '0 20px 40px rgba(0, 0, 0, 0.6), 0 0 20px rgba(248, 231, 28, 0.3)'
            }}
          >
            {/* Glowing effect */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-yellow-400/5 to-transparent"
              animate={{ opacity: [0, 0.3, 0] }}
              transition={{ duration: 3, repeat: Infinity }}
            />
            
            <div className="bg-gray-800 px-4 py-3 flex items-center gap-2 relative z-10">
              <div className="flex gap-1">
                {['bg-red-500', 'bg-yellow-500', 'bg-green-500'].map((color, i) => (
                  <motion.div 
                    key={i}
                    className={`w-3 h-3 ${color} rounded-full cursor-pointer`}
                    whileHover={{ scale: 1.3, boxShadow: `0 0 10px ${color.includes('red') ? '#ef4444' : color.includes('yellow') ? '#eab308' : '#22c55e'}` }}
                    whileTap={{ scale: 0.9 }}
                  />
                ))}
              </div>
              <span className="text-gray-300 text-sm ml-2 font-medium">Interview Coder - VS Code</span>
            </div>
            
            <div className="p-6 h-72 bg-[#1e1e1e] font-mono text-sm relative overflow-hidden">
              <motion.div
                className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-yellow-400 to-green-400"
                animate={{ scaleX: [0, 1, 0] }}
                transition={{ duration: 2, repeat: Infinity, delay: 1 }}
              />
              
              <div className="text-green-400 mb-3 font-semibold">// AI Solution Generated ✨</div>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.5, staggerChildren: 0.1 }}
              >
                <div className="text-blue-400">function <span className="text-yellow-300">twoSum</span><span className="text-gray-300">(nums, target) {'{'}</span></div>
                <div className="ml-4 text-gray-400">// Optimized O(n) solution</div>
                <div className="ml-4 text-blue-400">const <span className="text-yellow-300">hashMap</span> = <span className="text-blue-400">new</span> <span className="text-yellow-300">Map</span>();</div>
                <div className="ml-4 text-blue-400">for <span className="text-gray-300">(</span><span className="text-blue-400">let</span> <span className="text-yellow-300">i</span> = 0; i &lt; nums.length; i++) {'{'}</div>
                <div className="ml-8 text-blue-400">const <span className="text-yellow-300">complement</span> = target - nums[i];</div>
                <div className="ml-8 text-blue-400">if <span className="text-gray-300">(hashMap.has(complement)) {'{'}</span></div>
                <div className="ml-12 text-blue-400">return <span className="text-gray-300">[hashMap.get(complement), i];</span></div>
                <div className="ml-8 text-gray-300">{'}'}</div>
                <div className="ml-8">hashMap.set(nums[i], i);</div>
                <div className="ml-4 text-gray-300">{'}'}</div>
                <div className="text-gray-300">{'}'}</div>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>

        {/* Right Screenshot - Enhanced */}
        <motion.div 
          className="relative group"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 1.4 }}
          whileHover={{ 
            scale: 1.03, 
            y: -10,
            rotateY: -5,
            transformPerspective: 1000
          }}
        >
          <div className="text-left mb-4">
            <motion.span 
              className="text-yellow-400 font-semibold text-lg"
              whileHover={{ scale: 1.1 }}
            >
              Interviewer's View
            </motion.span>
            <span className="text-gray-400 ml-2">- Natural, undetectable coding</span>
          </div>
          
          <motion.div 
            className="bg-gradient-to-br from-[#1A1A1A] to-[#2A2A2A] rounded-xl border border-gray-700 overflow-hidden relative"
            whileHover={{ 
              borderColor: '#F8E71C',
              boxShadow: '0 20px 40px rgba(0, 0, 0, 0.6), 0 0 20px rgba(248, 231, 28, 0.3)'
            }}
          >
            <div className="bg-gray-800 px-4 py-3 flex items-center gap-2">
              <div className="flex gap-1">
                {['bg-red-500', 'bg-yellow-500', 'bg-green-500'].map((color, i) => (
                  <motion.div 
                    key={i}
                    className={`w-3 h-3 ${color} rounded-full cursor-pointer`}
                    whileHover={{ scale: 1.3 }}
                  />
                ))}
              </div>
              <span className="text-gray-300 text-sm ml-2 font-medium">Zoom Meeting - Screen Share</span>
            </div>
            
            <div className="p-6 h-72 bg-gray-900 relative">
              <div className="bg-[#1e1e1e] rounded-lg p-4 mb-4 font-mono text-sm border border-gray-700">
                <div className="text-gray-400 mb-2">// Clean, human-like implementation</div>
                <div className="text-blue-400">function <span className="text-yellow-300">twoSum</span><span className="text-gray-300">(nums, target) {'{'}</span></div>
                <div className="ml-4 text-gray-300">// Interviewer sees natural coding</div>
                <div className="ml-4 text-gray-300">// Perfect typing rhythm</div>
                <div className="ml-4 text-gray-300">// No AI detection possible</div>
                <div className="text-gray-300">{'}'}</div>
              </div>
              
              <motion.div 
                className="flex items-center justify-between text-xs"
                whileHover={{ opacity: 1 }}
                initial={{ opacity: 0.7 }}
              >
                <span className="text-green-400">🟢 Connected</span>
                <span className="text-gray-500">Undetected by all monitoring tools</span>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      </motion.div>
    </motion.section>
  );
}