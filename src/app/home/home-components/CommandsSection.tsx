'use client';

import { motion } from 'framer-motion';

// Command data structure matching the image
const commands = [
  { 
    action: 'Hide/Show Window', 
    description: 'Hide or show GhostCoder',
    keys: ['Control', 'B'] 
  },
  { 
    action: 'Take Screenshot', 
    description: 'Capture screenshots of the interview question',
    keys: ['Control', 'H'] 
  },
  { 
    action: 'Move Window', 
    description: 'Move the window around your screen without touching the mouse',
    keys: ['Control', '↑', '↓', '←', '→'] 
  },
  { 
    action: 'Generate Solution', 
    description: 'Generate an initial solution with explanations',
    keys: ['Control', 'Enter'] 
  },
  { 
    action: 'Reset Context', 
    description: 'Reset everything to start fresh with a new problem',
    keys: ['Control', 'R'] 
  },
  { 
    action: 'Quit Application', 
    description: 'Quit the application',
    keys: ['Alt', 'F4'] 
  },
];

// Key component for consistent styling
const KeyButton = ({ children }: { children: React.ReactNode }) => (
  <motion.span 
    className="bg-[#222222] text-white px-4 py-2 rounded-md border border-gray-700 inline-flex items-center justify-center min-w-[80px]"
    whileHover={{ 
      scale: 1.05,
      boxShadow: '0 0 10px rgba(255, 255, 255, 0.1)'
    }}
  >
    {children}
  </motion.span>
);

export default function CommandsSection() {
  return (
    <motion.section 
      className="py-16 sm:py-20 md:py-24 bg-black text-white w-full"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      viewport={{ once: true }}
    >
      <motion.h2 
        className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 sm:mb-6 text-center px-4"
        initial={{ opacity: 0, y: -20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
      >
        Commands we love
      </motion.h2>
      
      <motion.p 
        className="text-gray-400 text-base sm:text-lg md:text-xl mb-10 sm:mb-16 text-center max-w-3xl mx-auto px-4"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        viewport={{ once: true }}
      >
        These commands are designed to be natural and easy to remember.
      </motion.p>
      
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 sm:space-y-12">
        {commands.map((command, index) => (
          <motion.div 
            key={command.action}
            className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 sm:gap-6"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
            viewport={{ once: true }}
          >
            <div className="text-left w-full md:w-1/2">
              <h3 className="text-xl sm:text-2xl font-bold mb-1 sm:mb-2">{command.action}</h3>
              <p className="text-gray-400 text-sm sm:text-base">{command.description}</p>
            </div>
            
            <div className="flex items-center gap-2 flex-wrap justify-start md:justify-end w-full md:w-1/2 mt-3 md:mt-0">
              {command.keys.map((key, keyIndex) => (
                <div key={keyIndex} className="flex items-center">
                  {keyIndex > 0 && <span className="mx-1 sm:mx-2 text-gray-500">+</span>}
                  <KeyButton>{key}</KeyButton>
                </div>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </motion.section>
  );
}