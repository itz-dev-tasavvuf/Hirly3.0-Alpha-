import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '../supabaseClient';
import algorandLogo from '@/assets/algorand-logo.svg';
import '../hide-scrollbar.css';

export default function WaitlistPage() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [agreed, setAgreed] = useState(false);
  const [role, setRole] = useState('jobseeker');
  const [frontCard, setFrontCard] = useState(2); // Start with candidate card (jobseeker default)
  const [isAnimating, setIsAnimating] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  const waitlistCount = 1200;

  // Update front card when role changes
  useEffect(() => {
    const targetCard = role === 'employer' ? 1 : 2; // 1 = employer, 2 = candidate
    if (frontCard !== targetCard) {
      setIsAnimating(true);
      setTimeout(() => {
        setFrontCard(targetCard);
        setIsAnimating(false);
      }, 300);
    }
  }, [role, frontCard]);

  // Confetti effect
  const createConfetti = () => {
    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 3000); // Hide confetti after 3 seconds
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    try {
      // Insert into Supabase waitlist table
      const { error } = await supabase
        .from('waitlist')
        .insert([
          { 
            email: email.toLowerCase().trim(), 
            role: role 
          }
        ]);

      if (error) {
        // Handle specific error cases
        if (error.code === '23505') { // Unique constraint violation (duplicate email)
          setError('This email is already on our waitlist! Check your inbox for updates.');
        } else {
          setError('There was a problem signing you up. Please try again.');
          console.error('Supabase error:', error);
        }
        return;
      }

      // Success - show the modal with confetti
      setSubmitted(true);
      createConfetti();
      
    } catch (err) {
      setError('There was a problem signing you up. Please try again.');
      console.error('Unexpected error:', err);
    }
  };

  // Confetti component
  const Confetti = () => {
    const confettiPieces = Array.from({ length: 50 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      animationDelay: Math.random() * 3,
      animationDuration: 3 + Math.random() * 2,
      color: ['#a855f7', '#ec4899', '#10b981', '#3b82f6', '#f59e0b', '#ef4444'][Math.floor(Math.random() * 6)]
    }));

    return (
      <div className="fixed inset-0 pointer-events-none z-40 overflow-hidden">
        {confettiPieces.map((piece) => (
          <motion.div
            key={piece.id}
            className="absolute w-2 h-2 rounded-full"
            style={{
              backgroundColor: piece.color,
              left: `${piece.left}%`,
              top: '-10px'
            }}
            initial={{ y: -10, opacity: 1, rotate: 0 }}
            animate={{ 
              y: window.innerHeight + 10, 
              opacity: 0,
              rotate: 360,
              x: Math.random() * 200 - 100 // Random horizontal drift
            }}
            transition={{
              duration: piece.animationDuration,
              delay: piece.animationDelay,
              ease: "easeOut"
            }}
          />
        ))}
      </div>
    );
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden p-0">
      {/* Confetti Effect */}
      {showConfetti && <Confetti />}
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
                <div className="flex gap-3 items-center mt-1 mb-1" style={{maxWidth: 340}}>
                  <button
                    type="button"
                    onClick={() => setRole('jobseeker')}
                    className={`px-4 py-2 rounded-xl font-medium text-sm transition-all duration-300 border-2 ${
                      role === 'jobseeker' 
                        ? 'bg-gradient-to-r from-purple-600 to-purple-500 border-purple-400 text-white shadow-lg shadow-purple-500/50 glow-effect' 
                        : 'bg-white/10 border-white/20 text-purple-200 hover:bg-white/20 hover:border-white/30'
                    }`}
                  >
                    👤 Job Seeker
                  </button>
                  <button
                    type="button"
                    onClick={() => setRole('employer')}
                    className={`px-4 py-2 rounded-xl font-medium text-sm transition-all duration-300 border-2 ${
                      role === 'employer' 
                        ? 'bg-gradient-to-r from-pink-600 to-pink-500 border-pink-400 text-white shadow-lg shadow-pink-500/50 glow-effect' 
                        : 'bg-white/10 border-white/20 text-purple-200 hover:bg-white/20 hover:border-white/30'
                    }`}
                  >
                    💼 Employer
                  </button>
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
              <>
                {/* Modal Overlay */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                  className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                  onClick={() => setSubmitted(false)}
                >
                  {/* Modal Content */}
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.1 }}
                    className="relative bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-8 max-w-md w-full max-h-[90vh] overflow-y-auto hide-scrollbar"
                    style={{
                      background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%)',
                      boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255, 255, 255, 0.1)'
                    }}
                    onClick={(e) => e.stopPropagation()}
                  >
                    {/* Close Button */}
                    <button
                      onClick={() => setSubmitted(false)}
                      className="absolute top-4 right-4 w-8 h-8 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-all duration-200 group"
                    >
                      <svg className="w-4 h-4 text-gray-300 group-hover:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>

                    <div className="text-center space-y-6">
                      {/* Success Icon */}
                      <div className="flex justify-center">
                        <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center animate-pulse">
                          <span className="text-2xl">🎉</span>
                        </div>
                      </div>

                      {/* Main Success Message */}
                      <div>
                        <h2 className="text-2xl font-bold text-white mb-2">You're In!</h2>
                        <p className="text-green-300 font-semibold">
                          {role === 'employer' ? (
                            <>Welcome to the waitlist as an <span className="font-bold text-pink-300">Employer</span>!</>
                          ) : (
                            <>Welcome to the waitlist as a <span className="font-bold text-purple-300">Job Seeker</span>!</>
                          )}
                        </p>
                      </div>

                      {/* Your Perks */}
                      <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10">
                        <h3 className="text-lg font-semibold text-white mb-3">Your Early Access Perks:</h3>
                        <ul className="text-sm text-gray-300 space-y-2 text-left">
                          {role === 'employer' ? (
                            <>
                              <li>🎯 <strong className="text-pink-300">$99/month</strong> early bird pricing (limited time)</li>
                              <li>🚀 First access to our talent pool</li>
                              <li>🤖 AI-powered candidate matching</li>
                              <li>📱 Mobile-first hiring dashboard</li>
                            </>
                          ) : (
                            <>
                              <li>🆓 <strong className="text-green-300">Forever Free</strong> - no hidden fees</li>
                              <li>🎯 AI-powered job matching</li>
                              <li>📱 Swipe-to-apply mobile experience</li>
                              <li>🔐 Blockchain verified profiles</li>
                            </>
                          )}
                        </ul>
                      </div>

                      {/* What Happens Next */}
                      <div className="text-sm text-gray-300">
                        <h3 className="font-semibold text-white mb-2">What happens next?</h3>
                        <div className="space-y-1">
                          <p>📧 We'll email you updates as we get closer to launch</p>
                          <p>🚀 You'll be among the first to get access when we go live</p>
                          <p>💬 Join our community for exclusive updates and feedback</p>
                        </div>
                      </div>

                      {/* Social Sharing */}
                      <div className="pt-4 border-t border-white/10">
                        <p className="text-sm text-purple-200 mb-3">Help us grow! Share with friends:</p>
                        <div className="flex justify-center gap-3">
                          <button 
                            onClick={() => window.open(`https://twitter.com/intent/tweet?text=Just joined the @Hirly waitlist! The future of hiring is swipe-based job hunting with AI matching 🚀 Join me: ${window.location.href}`, '_blank')}
                            className="px-4 py-2 bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 rounded-lg text-sm transition-all border border-blue-500/20"
                          >
                            Share on Twitter
                          </button>
                          <button 
                            onClick={() => navigator.clipboard.writeText(window.location.href)}
                            className="px-4 py-2 bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 rounded-lg text-sm transition-all border border-purple-500/20"
                          >
                            Copy Link
                          </button>
                        </div>
                      </div>

                      {/* Position in Queue */}
                      <div className="text-xs text-gray-400">
                        You're #{waitlistCount + 1} in line! 🎯
                      </div>

                      {/* Close Button at Bottom */}
                      <button
                        onClick={() => setSubmitted(false)}
                        className="w-full mt-4 py-2 px-4 bg-gradient-to-r from-purple-600/20 to-pink-600/20 hover:from-purple-600/30 hover:to-pink-600/30 text-white rounded-lg transition-all duration-200 border border-white/10"
                      >
                        Continue Exploring
                      </button>
                    </div>
                  </motion.div>
                </motion.div>

                {/* Show form again when modal is closed */}
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
                  <div className="flex gap-3 items-center mt-1 mb-1" style={{maxWidth: 340}}>
                    <button
                      type="button"
                      onClick={() => setRole('jobseeker')}
                      className={`px-4 py-2 rounded-xl font-medium text-sm transition-all duration-300 border-2 ${
                        role === 'jobseeker' 
                          ? 'bg-gradient-to-r from-purple-600 to-purple-500 border-purple-400 text-white shadow-lg shadow-purple-500/50 glow-effect' 
                          : 'bg-white/10 border-white/20 text-purple-200 hover:bg-white/20 hover:border-white/30'
                      }`}
                    >
                      👤 Job Seeker
                    </button>
                    <button
                      type="button"
                      onClick={() => setRole('employer')}
                      className={`px-4 py-2 rounded-xl font-medium text-sm transition-all duration-300 border-2 ${
                        role === 'employer' 
                          ? 'bg-gradient-to-r from-pink-600 to-pink-500 border-pink-400 text-white shadow-lg shadow-pink-500/50 glow-effect' 
                          : 'bg-white/10 border-white/20 text-purple-200 hover:bg-white/20 hover:border-white/30'
                      }`}
                    >
                      💼 Employer
                    </button>
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
              </>
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
              {[1, 2].map((index) => {
                const isInFront = frontCard === index;
                const shouldMoveForward = isAnimating && !isInFront;
                
                return (
                  <motion.div
                    key={index}
                    initial={{ 
                      opacity: 0, 
                      scale: 0.8, 
                      rotate: -10,
                      x: 0,
                      y: 0
                    }}
                    animate={{ 
                      opacity: 1,
                      scale: shouldMoveForward ? 1 : (isInFront ? 1 : 0.95),
                      rotate: shouldMoveForward ? 0 : (isInFront ? 0 : -8),
                      x: shouldMoveForward ? 0 : (isInFront ? 0 : -30),
                      y: shouldMoveForward ? 0 : (isInFront ? 0 : 30)
                    }}
                    transition={{ 
                      duration: 0.4,
                      ease: "easeInOut"
                    }}
                    className="absolute inset-0 swipe-card glass-effect rounded-2xl p-6"
                    style={{
                      background: index === 1 
                        ? 'linear-gradient(135deg, rgba(168, 85, 247, 0.2) 0%, rgba(236, 72, 153, 0.2) 100%)'
                        : 'linear-gradient(135deg, rgba(34, 197, 94, 0.2) 0%, rgba(59, 130, 246, 0.2) 100%)',
                      zIndex: shouldMoveForward ? 30 : (isInFront ? 30 : 20)
                    }}
                  >
                    <div className="h-full flex flex-col">
                      <div className="flex items-center mb-4">
                        <div className={`w-12 h-12 ${index === 1 ? 'bg-gradient-to-r from-purple-500 to-pink-500' : 'bg-gradient-to-r from-green-500 to-blue-500'} rounded-full flex items-center justify-center`}>
                          <span className="text-white font-bold">
                            {index === 1 ? '💼' : '👤'}
                          </span>
                        </div>
                        <div className="ml-3">
                          <p className="text-white font-semibold">
                            {index === 1 ? 'Employer Perks' : 'Candidate Perks'}
                          </p>
                          <p className="text-gray-400 text-sm">
                            {index === 1 ? 'Limited Time Offer' : 'Always Free'}
                          </p>
                        </div>
                      </div>
                      <div className="flex-1">
                        <p className="text-gray-300 text-sm mb-4">
                          {index === 1 
                            ? 'First 100 employers get Hirly at an exclusive early-bird rate. Advanced matching, verified talent pool, and premium features.'
                            : 'Job seekers enjoy Hirly completely free forever. Swipe through opportunities, get matched with top employers, and land your dream job.'
                          }
                        </p>
                        <div className="flex flex-wrap gap-2 mb-4">
                          {(index === 1 
                            ? ['$99/mo', 'First 100 Only', 'Premium Features']
                            : ['Free Forever', 'No Hidden Fees', 'Full Access']
                          ).map((tag) => (
                            <span
                              key={tag}
                              className={`px-2 py-1 ${index === 1 ? 'bg-pink-500/20 text-pink-300' : 'bg-green-500/20 text-green-300'} text-xs rounded-full`}
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div className="text-center mt-auto">
                        <div className={`text-2xl font-bold ${index === 1 ? 'text-pink-300' : 'text-green-300'}`}>
                          {index === 1 ? '$99/month' : 'FREE'}
                        </div>
                        <div className="text-gray-400 text-xs mt-1">
                          {index === 1 ? 'Early Bird Special' : 'For All Candidates'}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
