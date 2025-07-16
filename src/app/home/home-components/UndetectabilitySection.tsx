'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';

export default function UndetectabilitySection() {
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);

  return (
    <motion.section 
      className="py-20 max-w-7xl mx-auto px-4"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      viewport={{ once: true }}
    >
      {/* Proof Section */}
      <motion.div 
        className="text-center mb-32"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        <motion.h2 
          className="text-5xl md:text-6xl font-bold mb-8 text-white"
          whileHover={{ scale: 1.02 }}
        >
          Proof
        </motion.h2>
        
        <motion.p 
          className="text-gray-400 text-lg mb-12 max-w-4xl mx-auto leading-relaxed"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
        >
          Watch this real job offer from Amazon using Interview Coder. Throughout the whole 
          video, you'll see how our Interview Coder AI tool has the full and final round.
        </motion.p>

        {/* Video Player - Exact match to image */}
        <motion.div 
          className="relative max-w-5xl mx-auto bg-white rounded-xl overflow-hidden shadow-2xl"
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
          whileHover={{ 
            scale: 1.02,
            boxShadow: '0 25px 50px rgba(0, 0, 0, 0.8)'
          }}
        >
          {/* Browser Header */}
          <div className="bg-gray-200 px-4 py-3 flex items-center gap-2 border-b">
            <div className="flex gap-2">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            </div>
            <div className="flex-1 mx-4">
              <div className="bg-white rounded px-3 py-1 text-sm text-gray-600">
                https://amazon.jobs/en/landing_pages/software-engineer-ii
              </div>
            </div>
            <div className="flex gap-2">
              <div className="w-6 h-6 bg-gray-300 rounded"></div>
              <div className="w-6 h-6 bg-gray-300 rounded"></div>
            </div>
          </div>

          {/* Email Content */}
          <div className="bg-white p-8">
            <div className="max-w-4xl mx-auto">
              <div className="text-left space-y-4 text-gray-800">
                <div className="text-sm text-gray-600 mb-4">
                  <strong>From:</strong> Amazon Recruiting &lt;recruiting@amazon.com&gt;<br/>
                  <strong>To:</strong> candidate@email.com<br/>
                  <strong>Subject:</strong> Amazon SDE-II Offer - Congratulations!
                </div>
                
                <div className="border-l-4 border-blue-500 pl-4 bg-blue-50 p-4 rounded">
                  <p className="text-gray-800 leading-relaxed">
                    <strong>Congratulations!</strong> We are pleased to extend an offer for the Software Development Engineer II position 
                    at Amazon. Your performance during the technical interviews was exceptional, particularly your approach to 
                    the algorithmic challenges and system design discussions.
                  </p>
                </div>

                <p className="text-gray-700 leading-relaxed">
                  After careful consideration of your background, technical skills, and interview performance, 
                  we would like to offer you a position as Software Development Engineer II with our team.
                </p>

                <div className="bg-gray-50 p-4 rounded border">
                  <h3 className="font-semibold text-gray-800 mb-2">Offer Details:</h3>
                  <ul className="text-gray-700 space-y-1">
                    <li>• <strong>Position:</strong> Software Development Engineer II</li>
                    <li>• <strong>Team:</strong> AWS Infrastructure</li>
                    <li>• <strong>Location:</strong> Seattle, WA</li>
                    <li>• <strong>Start Date:</strong> Flexible based on your availability</li>
                  </ul>
                </div>

                <p className="text-gray-700">
                  We were particularly impressed with your problem-solving approach during the coding interviews. 
                  Your solutions demonstrated strong algorithmic thinking and clean code practices.
                </p>
              </div>
            </div>
          </div>

          {/* Video Player Overlay */}
          <div className="absolute bottom-4 left-4 bg-black/80 rounded-lg p-3 flex items-center gap-3">
            <motion.button
              className="bg-white text-black rounded-full p-2 hover:bg-gray-200 transition-colors"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsVideoPlaying(!isVideoPlaying)}
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z"/>
              </svg>
            </motion.button>
            <span className="text-white text-sm">0:00 / 3:42</span>
            <div className="flex gap-1">
              <div className="w-1 h-4 bg-white/30 rounded"></div>
              <div className="w-1 h-4 bg-white/30 rounded"></div>
              <div className="w-1 h-4 bg-white/30 rounded"></div>
            </div>
          </div>
        </motion.div>

        <motion.p 
          className="text-gray-500 text-sm mt-6"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          viewport={{ once: true }}
        >
          Watch how our AI tool works in real-time during actual interviews.
        </motion.p>
      </motion.div>

      {/* Undetectability Section */}
      <motion.div 
        className="text-center"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        <motion.h2 
          className="text-5xl md:text-6xl font-bold mb-8 text-white"
          whileHover={{ scale: 1.02 }}
        >
          Undetectability
        </motion.h2>
        
        <motion.p 
          className="text-gray-400 text-lg mb-12 max-w-4xl mx-auto leading-relaxed"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
        >
          Here's how we ensure that Interview Coder is undetectable during technical interviews.
        </motion.p>

        {/* PRO Badge with Yellow Lines */}
        <motion.div 
          className="flex items-center justify-center mb-16"
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
        >
          <motion.div 
            className="w-24 h-0.5 bg-yellow-400"
            initial={{ width: 0 }}
            whileInView={{ width: 96 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            viewport={{ once: true }}
          />
          <motion.div 
            className="mx-6 bg-yellow-400 text-black px-6 py-2 rounded-full font-bold text-lg"
            whileHover={{ scale: 1.05, boxShadow: '0 0 20px rgba(248, 231, 28, 0.5)' }}
          >
            PRO
          </motion.div>
          <motion.div 
            className="w-24 h-0.5 bg-yellow-400"
            initial={{ width: 0 }}
            whileInView={{ width: 96 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            viewport={{ once: true }}
          />
        </motion.div>

        {/* 2x2 Feature Grid */}
        <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {/* Screen Sharing */}
          <motion.div 
            className="bg-[#1A1A1A] rounded-xl border border-gray-700 overflow-hidden"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            whileHover={{ 
              scale: 1.02,
              borderColor: '#F8E71C',
              boxShadow: '0 15px 35px rgba(0, 0, 0, 0.4)'
            }}
          >
            <div className="p-6 h-80 bg-gray-900 relative">
              {/* Zoom Interface Mockup */}
              <div className="absolute inset-4 bg-gray-800 rounded-lg border border-gray-600">
                <div className="p-4">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                    <span className="text-green-400 text-xs">Recording</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 mb-4">
                    <div className="bg-gray-700 rounded aspect-video flex items-center justify-center">
                      <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center text-white text-xs">
                        C
                      </div>
                    </div>
                    <div className="bg-gray-700 rounded aspect-video"></div>
                  </div>
                  <div className="flex justify-center gap-2">
                    <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center">
                      <div className="w-3 h-3 bg-white rounded"></div>
                    </div>
                    <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
                      <div className="w-3 h-3 bg-white rounded"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="p-6 bg-[#1A1A1A]">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-6 h-6 bg-red-500 rounded flex items-center justify-center text-white text-xs">
                  📹
                </div>
                <h3 className="text-xl font-bold text-white">Screen Sharing</h3>
              </div>
              <p className="text-gray-400 text-sm leading-relaxed">
                Our technology can detect screen recording software, making 
                it perfect for technical interviews.
              </p>
            </div>
          </motion.div>

          {/* Active Tab Detection */}
          <motion.div 
            className="bg-[#1A1A1A] rounded-xl border border-gray-700 overflow-hidden"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            viewport={{ once: true }}
            whileHover={{ 
              scale: 1.02,
              borderColor: '#F8E71C',
              boxShadow: '0 15px 35px rgba(0, 0, 0, 0.4)'
            }}
          >
            <div className="p-6 h-80 bg-gray-900 font-mono text-xs">
              <div className="text-green-400 mb-2">✓ Tab Detection: ACTIVE</div>
              <div className="text-blue-400 mb-2">✓ Screen Monitor: BYPASSED</div>
              <div className="text-yellow-400 mb-2">⚠ Window Focus: MAINTAINED</div>
              <div className="text-gray-400 mt-4 space-y-1">
                <div>Process: interview-coder.exe</div>
                <div>Status: Undetected</div>
                <div>Memory: 45.2 MB</div>
                <div>CPU: 2.1%</div>
                <div className="mt-4 p-2 bg-gray-800 rounded">
                  <div className="text-green-400">BYPASS STATUS:</div>
                  <div className="text-white">All systems operational</div>
                </div>
              </div>
            </div>
            <div className="p-6 bg-[#1A1A1A]">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-6 h-6 bg-green-500 rounded flex items-center justify-center text-white text-xs">
                  ✓
                </div>
                <h3 className="text-xl font-bold text-white">Active Tab Detection</h3>
              </div>
              <p className="text-gray-400 text-sm leading-relaxed">
                Bypass the application window without your screen being frozen.
              </p>
            </div>
          </motion.div>

          {/* Motion Reasoning */}
          <motion.div 
            className="bg-[#1A1A1A] rounded-xl border border-gray-700 overflow-hidden"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true }}
            whileHover={{ 
              scale: 1.02,
              borderColor: '#F8E71C',
              boxShadow: '0 15px 35px rgba(0, 0, 0, 0.4)'
            }}
          >
            <div className="p-6 h-80 bg-gray-900 font-mono text-xs">
              <div className="space-y-2">
                <div className="text-blue-400">def solve_problem(input_data):</div>
                <div className="ml-4 text-gray-400"># AI-generated solution</div>
                <div className="ml-4 text-yellow-300">result = []</div>
                <div className="ml-4 text-blue-400">for i in range(len(input_data)):</div>
                <div className="ml-8 text-green-400">if condition_met(input_data[i]):</div>
                <div className="ml-12 text-yellow-300">result.append(process(i))</div>
                <div className="ml-4 text-blue-400">return result</div>
                <div className="mt-4 p-2 bg-gray-800 rounded">
                  <div className="text-green-400">✓ Solution optimized</div>
                  <div className="text-yellow-400">⚡ Time: O(n)</div>
                  <div className="text-blue-400">💾 Space: O(1)</div>
                </div>
              </div>
            </div>
            <div className="p-6 bg-[#1A1A1A]">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-6 h-6 bg-orange-500 rounded flex items-center justify-center text-white text-xs">
                  🧠
                </div>
                <h3 className="text-xl font-bold text-white">Motion Reasoning</h3>
              </div>
              <p className="text-gray-400 text-sm leading-relaxed">
                A very modern AI reasoning step by step, that every step of 
                your code makes sense and is optimized.
              </p>
            </div>
          </motion.div>

          {/* Webcam Monitoring */}
          <motion.div 
            className="bg-[#1A1A1A] rounded-xl border border-gray-700 overflow-hidden"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            viewport={{ once: true }}
            whileHover={{ 
              scale: 1.02,
              borderColor: '#F8E71C',
              boxShadow: '0 15px 35px rgba(0, 0, 0, 0.4)'
            }}
          >
            <div className="p-6 h-80 bg-gray-900 relative">
              <div className="absolute top-4 right-4 w-20 h-16 bg-gray-800 rounded border border-gray-600 flex items-center justify-center">
                <div className="w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center text-white text-xs">
                  👤
                </div>
              </div>
              <div className="text-green-400 text-xs space-y-1">
                <div>✓ Eye tracking: Normal patterns</div>
                <div>✓ Head movement: Natural</div>
                <div>✓ Facial expression: Focused</div>
                <div>✓ Attention: Code-focused</div>
                <div className="mt-4 text-gray-400">
                  <div>Confidence: 98.7%</div>
                  <div>Behavior: Human-like</div>
                  <div>Suspicion Level: 0%</div>
                </div>
                <div className="mt-4 p-2 bg-gray-800 rounded">
                  <div className="text-yellow-400">WEBCAM STATUS:</div>
                  <div className="text-green-400">Monitoring bypassed</div>
                </div>
              </div>
            </div>
            <div className="p-6 bg-[#1A1A1A]">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-6 h-6 bg-yellow-500 rounded flex items-center justify-center text-white text-xs">
                  📷
                </div>
                <h3 className="text-xl font-bold text-white">Webcam Monitoring</h3>
              </div>
              <p className="text-gray-400 text-sm leading-relaxed">
                Detect the webcam analysis by looking at your code screen, so your eyes 
                are looking. Perfectly AI detection cannot detect any unusual activity.
              </p>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </motion.section>
  );
}