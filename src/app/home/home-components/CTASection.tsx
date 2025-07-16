'use client';

import { motion } from 'framer-motion';

export default function CTASection() {
  // Define keyboard layout exactly as in the image
  const row1 = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'];
  const row2 = ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P', '[', ']'];
  const row3 = ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L', ':', '"'];
  const row4 = ['Z', 'X', 'C', 'V', 'B', 'N', 'M', ',', '.', '/'];

  // Special symbols for row 1 (above numbers)
  const row1Symbols = ['@', '#', '$', '%', '^', '&', '*', '(', ')'];

  return (
    <motion.section
      className="py-24 text-center  relative overflow-hidden w-full"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      viewport={{ once: true }}
    >
      {/* Keyboard visualization - exactly matching the image with increased width */}
      <motion.div
        className="relative mx-auto w-full max-w-[1400px] h-[400px] mb-24"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        viewport={{ once: true }}
      >
        {/* Function keys row - not visible in the image but keeping for completeness */}
        <div className="absolute top-0 left-0 right-0 flex justify-center gap-1">
          {['ESC', 'F1', 'F2', 'F3', 'F4', 'F5', 'F6', 'F7', 'F8', 'F9', 'F10', 'F11', 'F12'].map((key, i) => (
            <motion.div
              key={key}
              className="w-16 h-16 rounded-md flex items-center justify-center text-white text-xs font-medium border border-gray-800 bg-[#111111] shadow-md"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.3, delay: i * 0.01 }}
            >
              {key}
            </motion.div>
          ))}
        </div>

        {/* Number row with symbols above */}
        <div className="absolute top-18 left-0 right-0 flex justify-center gap-1">
          {row1.map((key, i) => (
            <motion.div
              key={key}
              className="w-16 h-16 rounded-md flex flex-col items-center justify-center text-white border border-gray-800 bg-[#111111] shadow-md"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.3, delay: 0.1 + i * 0.01 }}
            >
              <span className="text-xs text-gray-400">{i < row1Symbols.length ? row1Symbols[i] : ''}</span>
              <span>{key}</span>
            </motion.div>
          ))}
        </div>

        {/* QWERTY row */}
        <div className="absolute top-36 left-0 right-0 flex justify-center gap-1">
          {row2.map((key, i) => (
            <motion.div
              key={key}
              className="w-16 h-16 rounded-md flex items-center justify-center text-white border border-gray-800 bg-[#111111] shadow-md"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.3, delay: 0.2 + i * 0.01 }}
            >
              {key}
            </motion.div>
          ))}
        </div>

        {/* ASDF row */}
        <div className="absolute top-54 left-0 right-0 flex justify-center gap-1">
          {row3.map((key, i) => (
            <motion.div
              key={key}
              className="w-16 h-16 rounded-md flex items-center justify-center text-white border border-gray-800 bg-[#111111] shadow-md"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.3, delay: 0.3 + i * 0.01 }}
            >
              {key}
            </motion.div>
          ))}
        </div>

        {/* ZXCV row */}
        <div className="absolute top-72 left-0 right-0 flex justify-center gap-1">
          {row4.map((key, i) => (
            <motion.div
              key={key}
              className={`w-16 h-16 rounded-md flex items-center justify-center border ${
                key === 'B' 
                  ? 'bg-yellow-500 text-black border-yellow-400 shadow-[0_0_25px_rgba(255,230,0,0.7)]' 
                  : 'bg-[#111111] text-white border-gray-800 shadow-md'
              }`}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.3, delay: 0.4 + i * 0.01 }}
            >
              {key}
            </motion.div>
          ))}
        </div>

        {/* Bottom row with spacebar */}
        <div className="absolute top-90 left-0 right-0 flex justify-center gap-1">
          <motion.div
            className="w-16 h-16 rounded-md flex items-center justify-center border bg-yellow-500 text-yellow-800 border-yellow-400 shadow-[0_0_25px_rgba(255,230,0,0.7)]"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.5 }}
          >
            Ctrl
          </motion.div>
          <motion.div
            className="w-16 h-16 rounded-md flex items-center justify-center text-white border border-gray-800 bg-[#111111] shadow-md"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.51 }}
          >
            ⊞
          </motion.div>
          <motion.div
            className="w-16 h-16 rounded-md flex items-center justify-center text-white border border-gray-800 bg-[#111111] shadow-md"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.52 }}
          >
            Alt
          </motion.div>
          <motion.div
            className="w-[400px] h-16 rounded-md flex items-center justify-center text-white border border-gray-800 bg-[#111111] shadow-md"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.53 }}
          >
            {/* Spacebar */}
          </motion.div>
          <motion.div
            className="w-16 h-16 rounded-md flex items-center justify-center text-white border border-gray-800 bg-[#111111] shadow-md"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.54 }}
          >
            Alt
          </motion.div>
          <motion.div
            className="w-16 h-16 rounded-md flex items-center justify-center text-white border border-gray-800 bg-[#111111] shadow-md"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.55 }}
          >
            =
          </motion.div>
        </div>

        {/* Glow effects around highlighted keys - more subtle and matching the image */}
        <div className="absolute top-72 left-1/2 transform -translate-x-[20px] w-40 h-40 bg-yellow-400 rounded-full opacity-5 blur-2xl"></div>
        <div className="absolute top-90 left-1/2 transform -translate-x-[250px] w-40 h-40 bg-yellow-400 rounded-full opacity-5 blur-2xl"></div>
      </motion.div>

      <div className="max-w-6xl mx-auto px-4">
        <motion.h2
          className="text-5xl font-bold mb-6 text-white tracking-tight"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
        >
          Take the short way.
        </motion.h2>

        <motion.p
          className="text-gray-400 mb-10 text-lg max-w-xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
        >
          Download and use Interview Coder today.
        </motion.p>

        <motion.div
          className="flex flex-col sm:flex-row justify-center gap-4 max-w-xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          viewport={{ once: true }}
        >
          <motion.button
            className="bg-yellow-400 text-black font-medium px-8 py-4 rounded-md flex items-center justify-center gap-2 w-full sm:w-auto"
            whileHover={{ scale: 1.05, boxShadow: '0 0 25px rgba(255, 230, 0, 0.5)' }}
            whileTap={{ scale: 0.95 }}
          >
            <span className="text-lg">⌘</span> Download for Mac
          </motion.button>

          <motion.button
            className="bg-transparent border border-yellow-400 text-yellow-400 font-medium px-8 py-4 rounded-md flex items-center justify-center gap-2 w-full sm:w-auto"
            whileHover={{ scale: 1.05, boxShadow: '0 0 25px rgba(255, 230, 0, 0.3)' }}
            whileTap={{ scale: 0.95 }}
          >
            <span className="text-lg">⊞</span> Download for Windows
          </motion.button>
        </motion.div>
      </div>

      {/* Yellow accent shapes at bottom - made more prominent */}
      <div className="absolute bottom-0 left-0 right-0 h-32 overflow-hidden">
        <motion.div
          className="absolute bottom-0 left-1/4 w-20 h-40 bg-yellow-400 rotate-45 opacity-30"
          initial={{ y: 100 }}
          whileInView={{ y: 20 }}
          transition={{ duration: 1, delay: 0.2 }}
        />
        <motion.div
          className="absolute bottom-0 left-1/3 w-20 h-40 bg-yellow-400 rotate-45 opacity-20"
          initial={{ y: 100 }}
          whileInView={{ y: 30 }}
          transition={{ duration: 1, delay: 0.3 }}
        />
        <motion.div
          className="absolute bottom-0 left-1/2 w-20 h-40 bg-yellow-400 rotate-45 opacity-40"
          initial={{ y: 100 }}
          whileInView={{ y: 10 }}
          transition={{ duration: 1, delay: 0.4 }}
        />
        <motion.div
          className="absolute bottom-0 left-2/3 w-20 h-40 bg-yellow-400 rotate-45 opacity-30"
          initial={{ y: 100 }}
          whileInView={{ y: 25 }}
          transition={{ duration: 1, delay: 0.5 }}
        />
        <motion.div
          className="absolute bottom-0 left-3/4 w-20 h-40 bg-yellow-400 rotate-45 opacity-20"
          initial={{ y: 100 }}
          whileInView={{ y: 15 }}
          transition={{ duration: 1, delay: 0.6 }}
        />
      </div>
    </motion.section>
  );
}