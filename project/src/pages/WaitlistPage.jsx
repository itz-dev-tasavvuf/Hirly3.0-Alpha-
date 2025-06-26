
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '../supabaseClient';

export default function WaitlistPage() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const { error } = await supabase.from('waitlist').insert([{ email }]);
    if (error) {
      setError('There was a problem signing up. Maybe you already joined?');
    } else {
      setSubmitted(true);
    }
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl floating-animation" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-pink-500/20 rounded-full blur-3xl floating-animation" style={{ animationDelay: '2s' }} />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center lg:text-left"
          >
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-5xl md:text-6xl font-black mb-6"
            >
              <span className="gradient-text">Get Early Access</span>
              <br />
              <span className="text-white">to the Future of Hiring</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-xl text-gray-300 mb-8 max-w-lg mx-auto lg:mx-0"
            >
              Join our exclusive waitlist and be the first to experience swipe-based job hunting, AI-powered matching, and blockchain-verified profiles. Whether you’re a candidate or an employer, Hirly is reimagining how talent meets opportunity.
            </motion.p>

            <ul className="text-left text-purple-200 mb-8 space-y-2 max-w-md mx-auto lg:mx-0">
              <li>✓ Blockchain Verified Profiles</li>
              <li>✓ AI-Powered Matching</li>
              <li>✓ Mobile First Experience</li>
              <li>✓ Secure & Private Networking</li>
              <li>✓ Effortless Swipe-to-Apply</li>
              <li>✓ No Spam, No Noise—Just Real Opportunities</li>
            </ul>

            {!submitted ? (
              <form onSubmit={handleSubmit} className="flex flex-col items-center gap-4 lg:items-start">
                <input
                  type="email"
                  required
                  placeholder="Your email address"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full px-4 py-2 rounded bg-white/20 text-white placeholder-gray-300 border border-white/20 focus:outline-none focus:ring-2 focus:ring-purple-400 transition-all"
                />
                <button
                  type="submit"
                  className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold py-2 px-8 rounded-2xl glow-effect text-lg shadow-lg"
                >
                  Join Waitlist
                </button>
                {error && <div className="text-red-300 mt-2">{error}</div>}
              </form>
            ) : (
              <div className="text-green-300 font-semibold mt-4">
                Thank you! You’re on the waitlist. We’ll notify you when we go live.
              </div>
            )}
          </motion.div>

          {/* Right Content - Animated Card Stack */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="relative flex justify-center lg:justify-end"
          >
            <div className="relative w-80 h-96">
              {/* Card Stack */}
              {[1, 2, 3].map((index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.8, rotate: -10 }}
                  animate={{ 
                    opacity: 1, 
                    scale: 1, 
                    rotate: index === 1 ? 0 : index === 2 ? -5 : -10,
                    x: index === 1 ? 0 : index === 2 ? -20 : -40,
                    y: index === 1 ? 0 : index === 2 ? 20 : 40
                  }}
                  transition={{ delay: 0.5 + index * 0.2, duration: 0.6 }}
                  className={`absolute inset-0 swipe-card glass-effect rounded-2xl p-6 ${
                    index === 1 ? 'z-30' : index === 2 ? 'z-20' : 'z-10'
                  }`}
                  style={{
                    background: index === 1 
                      ? 'linear-gradient(135deg, rgba(168, 85, 247, 0.2) 0%, rgba(236, 72, 153, 0.2) 100%)'
                      : 'rgba(255, 255, 255, 0.05)'
                  }}
                >
                  <div className="h-full flex flex-col">
                    <div className="flex items-center mb-4">
                      <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                        <span className="text-white font-bold">
                          {index === 1 ? 'JS' : index === 2 ? 'TM' : 'AL'}
                        </span>
                      </div>
                      <div className="ml-3">
                        <p className="text-white font-semibold">
                          {index === 1 ? 'Jane Smith' : index === 2 ? 'TechCorp' : 'Alex Lee'}
                        </p>
                        <p className="text-gray-400 text-sm">
                          {index === 1 ? 'Senior Developer' : index === 2 ? 'Hiring Manager' : 'UI Designer'}
                        </p>
                      </div>
                    </div>
                    <div className="flex-1">
                      <p className="text-gray-300 text-sm mb-4">
                        {index === 1 
                          ? 'Full-stack developer with 5+ years experience in React, Node.js, and cloud technologies.'
                          : index === 2
                          ? 'Looking for talented developers to join our growing team. Remote-friendly culture.'
                          : 'Creative designer passionate about user experience and modern interfaces.'
                        }
                      </p>
                      <div className="flex flex-wrap gap-2 mb-4">
                        {(index === 1 
                          ? ['React', 'Node.js', 'AWS']
                          : index === 2
                          ? ['Remote', 'Full-time', '$120k']
                          : ['Figma', 'UI/UX', 'Prototyping']
                        ).map((tag) => (
                          <span
                            key={tag}
                            className="px-2 py-1 bg-purple-500/20 text-purple-300 text-xs rounded-full"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="flex justify-center space-x-4 mt-auto">
                      <div className="w-12 h-12 bg-red-500/20 rounded-full flex items-center justify-center">
                        <span className="text-red-400">✕</span>
                      </div>
                      <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center">
                        <span className="text-green-400">♥</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
