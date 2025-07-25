'use client';

import { motion, useMotionValue, useTransform } from 'framer-motion';
import { useState, useEffect } from 'react';
import yourscreen from '../../../asets/your screen.jpeg'
import interviewscreen from '../../../asets/intervier screen.jpeg'
import { downloadWindows, downloadMac } from '@/constants/downloads';

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

  // Download functions using centralized constants
  const handleDownloadMac = downloadMac;
  const handleDownloadWindows = downloadWindows;

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
          className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 text-white relative"
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
          className="text-base md:text-lg text-gray-400 mb-4 leading-relaxed"
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

      {/* Download Buttons - Matching Footer Section Exactly */}
      <motion.div
        className="flex flex-col sm:flex-row justify-center gap-3 mb-16"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.8 }}
      >
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
              <span className="text-gray-300 text-sm ml-2 font-medium">GhostCoder - VS Code</span>
            </div>

            <div className="relative h-72 overflow-hidden">
              <motion.div
                className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-yellow-400 to-green-400 z-10"
                animate={{ scaleX: [0, 1, 0] }}
                transition={{ duration: 2, repeat: Infinity, delay: 1 }}
              />

              <motion.img
                src={yourscreen.src}
                alt="Your screen showing GhostCoder AI assistance"
                className="w-full h-full object-cover"
                initial={{ scale: 1.1, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.8, delay: 1.2 }}
                whileHover={{ scale: 1.05 }}
              />

              {/* Overlay for better text visibility if needed */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
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

            <div className="relative h-72 overflow-hidden">
              <motion.img
                src={interviewscreen.src}
                alt="Interviewer's view showing natural coding behavior"
                className="w-full h-full object-cover"
                initial={{ scale: 1.1, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.8, delay: 1.4 }}
                whileHover={{ scale: 1.05 }}
              />

              {/* Overlay for better contrast */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent pointer-events-none" />

              {/* Status indicator overlay */}
              <motion.div
                className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-xs bg-black/50 backdrop-blur-sm rounded-lg px-3 py-2"
                whileHover={{ opacity: 1 }}
                initial={{ opacity: 0.8 }}
              >
                <span className="text-green-400 flex items-center gap-1">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  Connected
                </span>
                <span className="text-gray-300">Undetected by all monitoring tools</span>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      </motion.div>
    </motion.section>
  );
}