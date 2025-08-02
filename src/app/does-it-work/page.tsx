'use client';

import { motion } from 'framer-motion';
import Header from '../home/home-components/Header';
import Footer from '../home/home-components/Footer';
import Image from 'next/image';
import Link from 'next/link';

export default function DoesItWorkPage() {
    return (
        <div className="min-h-screen bg-black flex flex-col">
            <Header />

            <main className="flex-grow pt-24 pb-16">
                <div className="container mx-auto px-4 max-w-4xl">
                    {/* Hero Section */}
                    <motion.div
                        className="mb-16 text-center"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
                            How GhostCoder is Still Undetectable
                        </h1>
                        <p className="text-gray-400 text-sm md:text-base">
                            Last updated: August 2023 • <span className="text-yellow-400">Still working in all major interviews</span>
                        </p>
                    </motion.div>

                    {/* Section 1: How it works */}
                    <motion.section
                        className="mb-16"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                    >
                        <h2 className="text-xl md:text-2xl font-bold text-white mb-6">How it works: stealth</h2>
                        <div className="bg-[#111111] rounded-lg p-4 md:p-6 mb-8 border border-gray-800">
                            <pre className="text-gray-300 text-xs md:text-sm font-mono overflow-x-auto whitespace-pre-wrap">
                                <code>
                                    {`// GhostCoder runs in a separate process
// It doesn't modify your browser in any way
// It's completely invisible to monitoring tools

const ghostCoder = {
  detectionRisk: 0,
  browserFingerprint: "unchanged",
  monitoringBypass: true
};`}
                                </code>
                            </pre>
                        </div>

                        <div className="flex justify-center mb-8">
                            <div className="relative w-full max-w-md aspect-square">
                                <Image
                                    src="/diagram1.png"
                                    alt="Diagram showing how GhostCoder works separately from the browser"
                                    width={400}
                                    height={400}
                                    className="mx-auto"
                                />
                            </div>
                        </div>

                        <p className="text-gray-300 mb-4">
                            Unlike browser extensions or plugins that can be detected, GhostCoder runs as a separate application on your computer. It doesn&apos;t modify your browser or inject any code that could be detected.
                        </p>
                        <p className="text-gray-300">
                            This means that even the most sophisticated monitoring tools can&apos;t detect that you&apos;re using GhostCoder during your technical interviews.
                        </p>
                    </motion.section>

                    {/* Section 2: Why other solutions fail */}
                    <motion.section
                        className="mb-16"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.3 }}
                    >
                        <h2 className="text-xl md:text-2xl font-bold text-white mb-6">Why other solutions fail</h2>
                        <div className="bg-[#111111] rounded-lg p-4 md:p-6 mb-8 border border-gray-800">
                            <p className="text-gray-300 mb-4">
                                Most interview assistance tools make a critical mistake: they run <span className="text-yellow-400">inside your browser</span>.
                            </p>
                            <pre className="text-gray-300 text-xs md:text-sm font-mono overflow-x-auto whitespace-pre-wrap mb-4">
                                <code>
                                    {`// Browser extensions can be detected
const browserExtension = {
  detectable: true,
  reason: "Modifies DOM or injects scripts"
};

// Even "stealth" extensions leave traces
const stealthExtension = {
  detectable: true,
  reason: "Browser fingerprinting changes"
};`}
                                </code>
                            </pre>
                            <p className="text-gray-300">
                                Interview platforms can detect these tools through browser fingerprinting, extension detection, and behavior monitoring.
                            </p>
                        </div>

                        <div className="flex justify-center mb-8">
                            <div className="relative w-full max-w-md aspect-square">
                                <Image
                                    src="/diagram2.png"
                                    alt="Diagram showing why browser-based solutions can be detected"
                                    width={400}
                                    height={400}
                                    className="mx-auto"
                                />
                            </div>
                        </div>

                        <p className="text-gray-300 mb-4">
                            Modern interview platforms use sophisticated detection methods to identify when candidates are using unauthorized tools. Browser extensions, even those claiming to be "undetectable," modify your browser in ways that can be detected.
                        </p>
                        <p className="text-gray-300">
                            GhostCoder avoids these pitfalls by operating completely outside of your browser environment.
                        </p>
                    </motion.section>

                    {/* Section 3: Our approach */}
                    <motion.section
                        className="mb-16"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.4 }}
                    >
                        <h2 className="text-xl md:text-2xl font-bold text-white mb-6">How we stay ahead of detection</h2>
                        <p className="text-gray-300 mb-6">
                            We continuously monitor interview platforms and their detection methods to ensure GhostCoder remains undetectable. Our team includes security experts who specialize in anti-detection technologies.
                        </p>

                        <div className="bg-[#111111] rounded-lg p-4 md:p-6 mb-8 border border-gray-800">
                            <h3 className="text-lg font-semibold text-white mb-3">Our security guarantees:</h3>
                            <ul className="list-disc list-inside space-y-2 text-gray-300">
                                <li>No browser modifications or extensions</li>
                                <li>No detectable network traffic during interviews</li>
                                <li>No screen recording or suspicious processes</li>
                                <li>Regular updates to stay ahead of new detection methods</li>
                                <li>Tested against all major interview platforms</li>
                            </ul>
                        </div>

                        <p className="text-gray-300">
                            We've successfully helped thousands of candidates ace their technical interviews without detection. Our approach has been proven effective against all major interview platforms, including LeetCode, HackerRank, CodeSignal, and company-specific assessment tools.
                        </p>
                    </motion.section>

                    {/* Section 4: Testimonials */}
                    <motion.section
                        className="mb-16"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.5 }}
                    >
                        <h2 className="text-xl md:text-2xl font-bold text-white mb-6">What our users say</h2>

                        <div className="grid md:grid-cols-2 gap-4 mb-8">
                            <div className="bg-[#111111] rounded-lg p-4 border border-gray-800">
                                <p className="text-gray-300 italic mb-3">
                                    "Used GhostCoder for my Google interview. Got the job offer and no one suspected a thing. This tool is a game-changer!"
                                </p>
                                <p className="text-yellow-400 text-sm">— Software Engineer, hired at Google</p>
                            </div>

                            <div className="bg-[#111111] rounded-lg p-4 border border-gray-800">
                                <p className="text-gray-300 italic mb-3">
                                    "I was nervous about using assistance during my Amazon interview, but GhostCoder worked flawlessly. No detection issues at all."
                                </p>
                                <p className="text-yellow-400 text-sm">— Senior Developer, hired at Amazon</p>
                            </div>
                        </div>

                        <div className="flex justify-center mb-8">
                            <div className="relative w-full max-w-md aspect-square">
                                <Image
                                    src="/diagram3.png"
                                    alt="Comparison of GhostCoder vs other solutions"
                                    width={400}
                                    height={400}
                                    className="mx-auto"
                                />
                            </div>
                        </div>
                    </motion.section>

                    {/* CTA Section */}
                    <motion.section
                        className="text-center"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.6 }}
                    >
                        <h2 className="text-xl md:text-2xl font-bold text-white mb-6">Try it risk-free</h2>
                        <p className="text-gray-300 mb-8">
                            Join thousands of successful candidates who have secured their dream jobs with the help of GhostCoder.
                        </p>

                        <div className="flex flex-col sm:flex-row justify-center gap-4">
                            <Link href="/signup">
                                <motion.button
                                    className="bg-yellow-400 text-black font-medium px-8 py-3 rounded-md w-full sm:w-auto"
                                    whileHover={{ scale: 1.05, boxShadow: '0 0 20px rgba(255, 230, 0, 0.3)' }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    Get started now
                                </motion.button>
                            </Link>

                            <Link href="/#pricing">
                                <motion.button
                                    className="bg-transparent border border-yellow-400 text-yellow-400 font-medium px-8 py-3 rounded-md w-full sm:w-auto"
                                    whileHover={{ scale: 1.05, boxShadow: '0 0 20px rgba(255, 230, 0, 0.1)' }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    View pricing
                                </motion.button>
                            </Link>
                        </div>
                    </motion.section>
                </div>
            </main>

            <Footer />
        </div>
    );
}