import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function BrandedLoader({ fullScreen = false, message = "Loading your experience..." }) {
  const containerClass = fullScreen 
    ? "fixed inset-0 z-50 flex flex-col items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900"
    : "flex flex-col items-center justify-center h-64 w-full";

  return (
    <div className={containerClass}>
      {/* Animated Background Elements */}
      {fullScreen && (
        <>
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse" />
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-pink-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
          </div>
        </>
      )}

      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative z-10 flex flex-col items-center"
      >
        {/* Hirly Logo with SVG Animation */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="relative mb-8"
        >
          {/* Main Logo */}
          <motion.div
            animate={{ 
              filter: [
                'drop-shadow(0 0 20px rgba(168, 85, 247, 0.5))',
                'drop-shadow(0 0 30px rgba(236, 72, 153, 0.7))',
                'drop-shadow(0 0 20px rgba(168, 85, 247, 0.5))'
              ]
            }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="relative"
          >
            <svg 
              width="240" 
              height="60" 
              viewBox="0 0 400 100" 
              className="text-white"
            >
              <defs>
                {/* Shimmer gradient */}
                <linearGradient id="shimmer" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="transparent" stopOpacity="1" />
                  <stop offset="20%" stopColor="rgba(255,255,255,0.8)" stopOpacity="1" />
                  <stop offset="40%" stopColor="rgba(255,255,255,0.3)" stopOpacity="1" />
                  <stop offset="60%" stopColor="rgba(255,255,255,0.8)" stopOpacity="1" />
                  <stop offset="100%" stopColor="transparent" stopOpacity="1" />
                </linearGradient>
                
                {/* Text gradient */}
                <linearGradient id="textGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#8B5CF6" stopOpacity="1" />
                  <stop offset="25%" stopColor="#A855F7" stopOpacity="1" />
                  <stop offset="50%" stopColor="#EC4899" stopOpacity="1" />
                  <stop offset="75%" stopColor="#F97316" stopOpacity="1" />
                  <stop offset="100%" stopColor="#EF4444" stopOpacity="1" />
                </linearGradient>
                
                {/* Mask for text */}
                <mask id="textMask">
                  <rect width="100%" height="100%" fill="black"/>
                  <text x="200" y="60" fontFamily="Arial, sans-serif" fontSize="60" fontWeight="bold" textAnchor="middle" fill="white">
                    Hirly
                  </text>
                </mask>
              </defs>
              
              {/* Main text */}
              <text x="200" y="60" fontFamily="Arial, sans-serif" fontSize="60" fontWeight="bold" textAnchor="middle" fill="url(#textGradient)">
                Hirly
              </text>
              
              {/* Shimmer overlay */}
              <rect width="100%" height="100%" fill="url(#shimmer)" mask="url(#textMask)">
                <animateTransform
                  attributeName="transform"
                  type="translate"
                  values="-400 0; 400 0; -400 0"
                  dur="3s"
                  repeatCount="indefinite"
                />
              </rect>
              
              {/* Accent dot */}
              <circle cx="350" cy="25" r="4" fill="#FFD700" opacity="0.9">
                <animate 
                  attributeName="opacity" 
                  values="0.3;1;0.3" 
                  dur="1.5s" 
                  repeatCount="indefinite"
                />
              </circle>
            </svg>
          </motion.div>

          {/* Orbital Elements */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
            className="absolute inset-0 pointer-events-none"
          >
            <div className="absolute top-2 left-8 w-2 h-2 bg-cyan-400 rounded-full opacity-60" />
            <div className="absolute bottom-2 right-8 w-1.5 h-1.5 bg-pink-400 rounded-full opacity-70" />
          </motion.div>
        </motion.div>

        {/* Loading Text with Animation */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="text-center space-y-3"
        >
          <motion.p
            animate={{ opacity: [0.7, 1, 0.7] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="text-white/90 font-medium text-lg"
          >
            {message}
          </motion.p>

          {/* Loading Dots */}
          <div className="flex items-center justify-center space-x-2">
            {[0, 1, 2].map((index) => (
              <motion.div
                key={index}
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.5, 1, 0.5]
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  delay: index * 0.2,
                  ease: "easeInOut"
                }}
                className="w-2 h-2 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full"
              />
            ))}
          </div>
        </motion.div>

        {/* Progress Bar */}
        <motion.div
          initial={{ opacity: 0, width: 0 }}
          animate={{ opacity: 1, width: "200px" }}
          transition={{ delay: 1, duration: 1 }}
          className="mt-6 h-1 bg-white/10 rounded-full overflow-hidden"
        >
          <motion.div
            animate={{ x: ["-200px", "200px"] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="h-full w-16 bg-gradient-to-r from-transparent via-white/60 to-transparent"
          />
        </motion.div>
      </motion.div>
    </div>
  );
}
