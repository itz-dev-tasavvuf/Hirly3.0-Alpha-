

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '../supabaseClient';
import algorandLogo from '@/assets/algorand-logo.svg';

export default function WaitlistPage() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [agreed, setAgreed] = useState(false);
  const [role, setRole] = useState('jobseeker');

  const waitlistCount = 1200;

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
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden p-0">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl floating-animation" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-pink-500/20 rounded-full blur-3xl floating-animation" style={{ animationDelay: '2s' }} />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col justify-center items-center min-h-screen">
        {/* Branding Bar */}
        <div className="flex items-center justify-center mb-8 mt-8">
          <span className="text-4xl font-bold gradient-text mr-3">Hirly</span>
          <span className="text-gray-300 text-lg font-medium mr-3">|</span>
          <span className="text-purple-200 text-lg font-semibold">Waitlist</span>
        </div>
        {/* Social Proof Bar */}
        <div className="flex flex-col items-center justify-center mb-6">
          <div className="text-purple-200 text-base font-semibold mb-2">Join {waitlistCount.toLocaleString()}+ others on the waitlist!</div>
        </div>
        <div className="grid lg:grid-cols-2 gap-8 items-center w-full flex-1 min-h-[500px]">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center lg:text-left flex flex-col justify-center h-full"
            style={{ maxWidth: 480 }}
          >
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-3xl md:text-4xl font-black mb-3 drop-shadow-[0_0_16px_rgba(168,85,247,0.7)] animate-glow"
            >
              <span className="gradient-text">Get Early Access</span>
              <br />
              <span className="text-white">to the Future of Hiring</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-sm text-gray-300 mb-3 max-w-lg mx-auto lg:mx-0"
            >
              Join our exclusive waitlist and be the first to experience swipe-based job hunting, AI-powered matching, and blockchain-verified profiles. Whether you’re a candidate or an employer, <span className="text-purple-300 font-bold">Hirly</span> is reimagining how talent meets opportunity.
            </motion.p>

            <ul className="text-left text-purple-200 mb-4 space-y-1 max-w-md mx-auto lg:mx-0 text-sm">
              <li>✓ Blockchain Verified Profiles</li>
              <li>✓ AI-Powered Matching</li>
              <li>✓ Mobile First Experience</li>
              <li>✓ Secure & Private Networking</li>
              <li>✓ Effortless Swipe-to-Apply</li>
              <li>✓ No Spam, No Noise—Just Real Opportunities</li>
            </ul>

            {!submitted ? (
              <form onSubmit={handleSubmit} className="flex flex-col items-center gap-3 lg:items-start">
                <input
                  type="email"
                  required
                  placeholder="Your email address"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full px-4 py-2 rounded-xl bg-white/20 text-white placeholder-gray-300 border border-white/20 focus:outline-none focus:ring-2 focus:ring-purple-400 transition-all text-base"
                  style={{maxWidth: 340}}
                />
                {/* Role selection */}
                <div className="flex gap-4 items-center mt-1 mb-1 text-sm text-purple-200" style={{maxWidth: 340}}>
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="radio"
                      name="role"
                      value="jobseeker"
                      checked={role === 'jobseeker'}
                      onChange={() => setRole('jobseeker')}
                      className="accent-purple-500 mr-1"
                    />
                    Job Seeker
                  </label>
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="radio"
                      name="role"
                      value="employer"
                      checked={role === 'employer'}
                      onChange={() => setRole('employer')}
                      className="accent-pink-500 mr-1"
                    />
                    Employer
                  </label>
                </div>
                <label className="flex items-center text-sm text-purple-200 mt-1 select-none" style={{maxWidth: 340}}>
                  <input
                    type="checkbox"
                    checked={agreed}
                    onChange={e => setAgreed(e.target.checked)}
                    className="mr-2 accent-purple-500"
                    required
                  />
                  I agree to the <a href="/terms" target="_blank" rel="noopener noreferrer" className="underline hover:text-purple-400 ml-1">Terms &amp; Conditions</a>
                </label>
                <button
                  type="submit"
                  className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold py-2 px-8 rounded-2xl glow-effect text-lg shadow-lg mt-1"
                  disabled={!agreed}
                  style={{opacity: agreed ? 1 : 0.6, cursor: agreed ? 'pointer' : 'not-allowed'}}
                >
                  Join Waitlist
                </button>
                {error && <div className="text-red-300 mt-2 text-sm">{error}</div>}
              </form>
            ) : (
              <div className="text-green-300 font-semibold mt-4 text-base">
                {role === 'employer' ? (
                  <>Thank you! You’re on the waitlist as an <span className="font-bold text-pink-300">Employer</span>. We’ll notify you when we go live.</>
                ) : (
                  <>Thank you! You’re on the waitlist as a <span className="font-bold text-purple-300">Job Seeker</span>. We’ll notify you when we go live.</>
                )}
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
