'use client';

import { motion } from 'framer-motion';

export default function HowToUseSection() {
  return (
    <motion.section 
      className="py-20 max-w-7xl mx-auto px-4"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      viewport={{ once: true }}
    >
      {/* Section Header */}
      <motion.div 
        className="text-center mb-20"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        <motion.h2 
          className="text-5xl md:text-6xl font-bold mb-8 text-white"
          whileHover={{ scale: 1.02 }}
        >
          How to Use
        </motion.h2>
      </motion.div>

      {/* Step 1: Start taking screenshots */}
      <motion.div 
        className="grid lg:grid-cols-2 gap-16 items-center mb-32"
        initial={{ opacity: 0, x: -50 }}
        whileInView={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        viewport={{ once: true }}
      >
        <div className="relative">
          {/* Yellow geometric border */}
          <div className="absolute -top-8 -left-8 w-32 h-32 border-l-2 border-t-2 border-yellow-400 opacity-60"></div>
          <div className="absolute -bottom-8 -right-8 w-32 h-32 border-r-2 border-b-2 border-yellow-400 opacity-60"></div>
          
          {/* Screenshot mockup */}
          <motion.div 
            className="bg-white rounded-xl overflow-hidden shadow-2xl border-4 border-gray-300"
            whileHover={{ 
              scale: 1.02,
              boxShadow: '0 25px 50px rgba(0, 0, 0, 0.3)'
            }}
          >
            {/* Browser header */}
            <div className="bg-gray-200 px-4 py-3 flex items-center gap-2">
              <div className="flex gap-2">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              </div>
              <div className="flex-1 mx-4">
                <div className="bg-white rounded px-3 py-1 text-sm text-gray-600">
                  leetcode.com/problems/two-sum
                </div>
              </div>
            </div>
            
            {/* Content area */}
            <div className="bg-white p-6 h-80">
              <div className="flex gap-6 h-full">
                {/* Left side - problem description */}
                <div className="flex-1 bg-gray-50 rounded p-4 text-sm">
                  <h3 className="font-bold text-gray-800 mb-3">1. Two Sum</h3>
                  <p className="text-gray-600 mb-4">
                    Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.
                  </p>
                  <div className="bg-gray-100 p-3 rounded font-mono text-xs">
                    <div>Input: nums = [2,7,11,15], target = 9</div>
                    <div>Output: [0,1]</div>
                  </div>
                </div>
                
                {/* Right side - code editor */}
                <div className="flex-1 bg-gray-900 rounded p-4 font-mono text-sm">
                  <div className="text-green-400 mb-2">// Your solution here</div>
                  <div className="text-blue-400">function twoSum(nums, target) {'{'}</div>
                  <div className="ml-4 text-gray-400">// TODO: implement</div>
                  <div className="text-blue-400">{'}'}</div>
                </div>
              </div>
              
              {/* Webcam overlay */}
              <div className="absolute bottom-4 right-4 w-20 h-16 bg-gray-800 rounded border-2 border-green-400 flex items-center justify-center">
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs">
                  👤
                </div>
              </div>
            </div>
          </motion.div>
        </div>
        
        <div className="text-left">
          <motion.div 
            className="inline-block bg-blue-500 text-white px-4 py-2 rounded-full text-sm font-semibold mb-4"
            whileHover={{ scale: 1.05 }}
          >
            Capture the Problem
          </motion.div>
          <motion.h3 
            className="text-4xl font-bold text-white mb-6"
            whileHover={{ color: '#F8E71C' }}
          >
            Start taking screenshots
          </motion.h3>
          <motion.p 
            className="text-gray-400 text-lg leading-relaxed mb-6"
            whileHover={{ color: '#E5E5E5' }}
          >
            Use ⌘ + H to capture the problem. Up to 2 screenshots will be saved 
            and shown on the application.
          </motion.p>
          <div className="text-sm text-gray-500">
            <div className="mb-2">💡 <strong>Tip:</strong> Capture the entire problem statement</div>
            <div>📸 <strong>Shortcut:</strong> ⌘ + H (Mac) or Ctrl + H (Windows)</div>
          </div>
        </div>
      </motion.div>

      {/* Step 2: Get your solutions */}
      <motion.div 
        className="grid lg:grid-cols-2 gap-16 items-center mb-32"
        initial={{ opacity: 0, x: 50 }}
        whileInView={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, delay: 0.4 }}
        viewport={{ once: true }}
      >
        <div className="text-left lg:order-2">
          <motion.div 
            className="inline-block bg-green-500 text-white px-4 py-2 rounded-full text-sm font-semibold mb-4"
            whileHover={{ scale: 1.05 }}
          >
            Solve
          </motion.div>
          <motion.h3 
            className="text-4xl font-bold text-white mb-6"
            whileHover={{ color: '#F8E71C' }}
          >
            Get your solutions
          </motion.h3>
          <motion.p 
            className="text-gray-400 text-lg leading-relaxed mb-6"
            whileHover={{ color: '#E5E5E5' }}
          >
            Once you've captured your screenshots, press ⌘ + ◊ to generate solutions. 
            We'll analyze the problem and provide a solution with detailed explanations.
          </motion.p>
          
          {/* Solution details */}
          <div className="bg-[#1A1A1A] rounded-lg p-6 border border-gray-700">
            <h4 className="text-green-400 font-semibold mb-3">Thoughts (Read these aloud)</h4>
            <ul className="text-gray-300 text-sm space-y-2 mb-4">
              <li>• We need to find two numbers that sum to the target value.</li>
              <li>• We can use a hash map to store numbers we've seen.</li>
              <li>• For each number, check if its complement exists in the map.</li>
            </ul>
            
            <h4 className="text-yellow-400 font-semibold mb-3">Solution</h4>
            <div className="bg-gray-900 rounded p-4 font-mono text-sm">
              <div className="text-purple-400">def <span className="text-yellow-300">twoSum</span>(nums: List[int], target: int) -&gt; List[int]:</div>
              <div className="ml-4 text-yellow-300">seen = {'{}'}</div>
              <div className="ml-4 text-blue-400">for <span className="text-white">i, num</span> in <span className="text-green-400">enumerate</span>(nums):</div>
              <div className="ml-8 text-yellow-300">complement = target - num</div>
              <div className="ml-8 text-blue-400">if <span className="text-white">complement</span> in <span className="text-white">seen</span>:</div>
              <div className="ml-12 text-blue-400">return <span className="text-white">[seen[complement], i]</span></div>
              <div className="ml-8 text-yellow-300">seen[num] = i</div>
              <div className="ml-4 text-blue-400">return <span className="text-white">[]</span> <span className="text-gray-400"># No solution found</span></div>
            </div>
            
            <div className="mt-4 text-xs text-gray-400">
              <div>• <strong>Time Complexity:</strong> O(n)</div>
              <div>• <strong>Space Complexity:</strong> O(n)</div>
            </div>
          </div>
        </div>
        
        <div className="lg:order-1">
          <motion.div 
            className="bg-[#1A1A1A] rounded-xl border border-gray-700 overflow-hidden"
            whileHover={{ 
              scale: 1.02,
              borderColor: '#F8E71C',
              boxShadow: '0 15px 35px rgba(0, 0, 0, 0.4)'
            }}
          >
            {/* Header */}
            <div className="bg-gray-800 px-4 py-3 flex items-center gap-2">
              <div className="flex gap-1">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              </div>
              <span className="text-gray-300 text-sm ml-2">GhostCoder - Solution Generated</span>
            </div>
            
            {/* Content */}
            <div className="p-6 h-96 bg-gray-900">
              <div className="flex items-center gap-2 mb-4">
                <motion.div 
                  className="w-3 h-3 bg-green-400 rounded-full"
                  animate={{ opacity: [1, 0.3, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                />
                <span className="text-green-400 text-sm">Solution Ready</span>
              </div>
              
              <div className="space-y-4">
                <div className="bg-gray-800 rounded p-4">
                  <div className="text-yellow-400 text-sm font-semibold mb-2">✨ AI Analysis Complete</div>
                  <div className="text-gray-300 text-sm">
                    Problem: Two Sum - Array manipulation with target finding
                  </div>
                </div>
                
                <div className="bg-gray-800 rounded p-4">
                  <div className="text-blue-400 text-sm font-semibold mb-2">🎯 Optimal Solution</div>
                  <div className="text-gray-300 text-sm">
                    Hash map approach with O(n) time complexity
                  </div>
                </div>
                
                <div className="bg-gray-800 rounded p-4">
                  <div className="text-green-400 text-sm font-semibold mb-2">📝 Explanation Ready</div>
                  <div className="text-gray-300 text-sm">
                    Step-by-step walkthrough with complexity analysis
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Step 3: Debug your solutions */}
      <motion.div 
        className="grid lg:grid-cols-2 gap-16 items-center"
        initial={{ opacity: 0, x: -50 }}
        whileInView={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, delay: 0.6 }}
        viewport={{ once: true }}
      >
        <div className="text-left">
          <motion.div 
            className="inline-block bg-purple-500 text-white px-4 py-2 rounded-full text-sm font-semibold mb-4"
            whileHover={{ scale: 1.05 }}
          >
            Debug
          </motion.div>
          <motion.h3 
            className="text-4xl font-bold text-white mb-6"
            whileHover={{ color: '#F8E71C' }}
          >
            Debug your solutions
          </motion.h3>
          <motion.p 
            className="text-gray-400 text-lg leading-relaxed mb-6"
            whileHover={{ color: '#E5E5E5' }}
          >
            If the solutions are incorrect or you need an optimization, take extra 
            screenshots of your code with ⌘ + H. Press ⌘ + ◊ again and we'll 
            debug and optimize your code, with before and after comparisons.
          </motion.p>
          
          {/* Debug details */}
          <div className="bg-[#1A1A1A] rounded-lg p-6 border border-gray-700">
            <h4 className="text-purple-400 font-semibold mb-3">What I Changed (Read these aloud)</h4>
            <ul className="text-gray-300 text-sm space-y-2 mb-4">
              <li>• The current solution uses nested loops, resulting in O(n²) time complexity.</li>
              <li>• We can optimize this by using a hash map to store previously seen numbers.</li>
              <li>• This reduces time complexity to O(n) with O(n) space trade-off.</li>
            </ul>
            
            <h4 className="text-yellow-400 font-semibold mb-3">Complexity</h4>
            <div className="text-gray-300 text-sm">
              <div>• <strong>Time Complexity:</strong> O(n)</div>
            </div>
          </div>
        </div>
        
        <div>
          <motion.div 
            className="bg-[#1A1A1A] rounded-xl border border-gray-700 overflow-hidden"
            whileHover={{ 
              scale: 1.02,
              borderColor: '#F8E71C',
              boxShadow: '0 15px 35px rgba(0, 0, 0, 0.4)'
            }}
          >
            {/* Header */}
            <div className="bg-gray-800 px-4 py-3 flex items-center gap-2">
              <div className="flex gap-1">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              </div>
              <span className="text-gray-300 text-sm ml-2">Code Optimization</span>
            </div>
            
            {/* Content */}
            <div className="p-6 h-96 bg-gray-900 font-mono text-sm">
              <div className="space-y-4">
                <div>
                  <div className="text-purple-400 mb-2">def twoSum(nums: List[int], target: int) -&gt; List[int]:</div>
                  <div className="ml-4 text-yellow-300">seen = {'{}'}</div>
                  <div className="ml-4 text-blue-400">for i, num in enumerate(nums):</div>
                  <div className="ml-8 text-yellow-300">complement = target - num</div>
                  <div className="ml-8 text-blue-400">if complement in seen:</div>
                  <div className="ml-12 text-blue-400">return [seen[complement], i]</div>
                  <div className="ml-8 text-yellow-300">seen[num] = i</div>
                  <div className="ml-4 text-blue-400">return [] <span className="text-gray-400"># No solution found</span></div>
                </div>
                
                <div className="border-t border-gray-700 pt-4">
                  <div className="text-green-400 text-xs mb-2">✓ Optimized Solution</div>
                  <div className="text-yellow-400 text-xs">⚡ Time: O(n) → Improved from O(n²)</div>
                  <div className="text-blue-400 text-xs">💾 Space: O(n) → Acceptable trade-off</div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </motion.section>
  );
}