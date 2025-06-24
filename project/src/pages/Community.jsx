import React from 'react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { motion } from 'framer-motion';

export default function Community() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900 flex flex-col">
      <Navigation />
      <div className="flex-1 flex flex-col items-center justify-start pt-24 px-4">
        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
          className="w-full max-w-2xl shadow-2xl p-8 border border-white/20"
          style={{
            background: 'rgba(255,255,255,0.13)',
            boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
            backdropFilter: 'blur(18px)',
            WebkitBackdropFilter: 'blur(18px)',
            borderRadius: '2rem',
            border: '1.5px solid rgba(255,255,255,0.18)'
          }}
        >
          <h1 className="text-3xl md:text-4xl font-bold gradient-text mb-6 text-center drop-shadow-[0_0_16px_rgba(168,85,247,0.7)] animate-glow">
            Community
          </h1>
          <div className="prose prose-invert max-w-none text-gray-200 text-center">
            <p className="mb-6">Welcome to the Hirly Community! Connect, share, and grow with other job seekers, employers, and tech enthusiasts.</p>
            <ul className="mb-8 space-y-4">
              <li><span className="font-semibold text-purple-200">Join the Conversation:</span> Visit our <a href="#" className="text-purple-300 underline hover:text-white">Discord</a> and <a href="#" className="text-purple-300 underline hover:text-white">Forum</a> to chat, ask questions, and share tips.</li>
              <li><span className="font-semibold text-purple-200">Events & Meetups:</span> Stay tuned for upcoming virtual events, webinars, and community meetups.</li>
              <li><span className="font-semibold text-purple-200">Contribute:</span> Suggest features, report bugs, or contribute to our open-source projects on <a href="#" className="text-purple-300 underline hover:text-white">GitHub</a>.</li>
              <li><span className="font-semibold text-purple-200">Support:</span> Need help? Visit our <a href="/help-center" className="text-purple-300 underline hover:text-white">Help Center</a> or <a href="/documentation" className="text-purple-300 underline hover:text-white">Documentation</a>.</li>
            </ul>
            <div className="mt-8">
              <button className="px-6 py-2 rounded-lg bg-gradient-to-r from-pink-500 to-purple-500 text-white font-semibold shadow-lg hover:scale-105 transition-transform">
                Join Our Discord
              </button>
            </div>
          </div>
        </motion.div>
      </div>
      <Footer />
    </div>
  );
}
