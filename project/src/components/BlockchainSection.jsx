import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Shield, Lock, CheckCircle, Zap } from 'lucide-react';
import algorandFullLogoWhite from '@/assets/algorand_full_logo_white.png';

const BlockchainSection = () => {
  const [activeStep, setActiveStep] = useState(0);

  const verificationSteps = [
    {
      icon: Shield,
      title: 'Job Authentication',
      description: 'Job posts are validated and secured',
      color: 'text-green-400',
      bgColor: 'bg-green-500/20',
      glowColor: 'shadow-green-500/30'
    },
    {
      icon: CheckCircle,
      title: 'Trust Established',
      description: 'Secure connection between verified parties',
      color: 'text-purple-400',
      bgColor: 'bg-purple-500/20',
      glowColor: 'shadow-purple-500/30'
    },
    {
      icon: Lock,
      title: 'Profile Verification',
      description: 'User profiles are cryptographically secured',
      color: 'text-blue-400',
      bgColor: 'bg-blue-500/20',
      glowColor: 'shadow-blue-500/30'
    }
  ];

  return (
    <section className="py-24 relative overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-green-500/10 rounded-full blur-3xl floating-animation" />
        <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl floating-animation" style={{ animationDelay: '3s' }} />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Blockchain-Verified
              <br />
              <span className="gradient-text">Trust & Security</span>
            </h2>

            <div className="flex items-center mb-6">
              <span className="text-green-400 font-semibold text-lg mr-2">Powered by</span>
              <img src={algorandFullLogoWhite} alt="Algorand" className="h-8 w-auto" />
            </div>

            <p className="text-xl text-gray-300 mb-8 leading-relaxed">
              We use blockchain to verify identities and job posts. No more fake listings or bots. 
              Just real people, verified securely through Algorand's carbon-negative blockchain.
            </p>

            <div className="space-y-4">
              <div className="flex items-center text-green-400">
                <CheckCircle className="w-5 h-5 mr-3" />
                <span className="text-lg">Instant verification in seconds</span>
              </div>
              <div className="flex items-center text-blue-400">
                <Lock className="w-5 h-5 mr-3" />
                <span className="text-lg">Zero tolerance for fake profiles</span>
              </div>
              <div className="flex items-center text-purple-400">
                <Shield className="w-5 h-5 mr-3" />
                <span className="text-lg">Immutable employment records</span>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="relative w-full max-w-lg mx-auto h-[400px] flex items-center justify-center">
              {/* Central Shield Hub */}
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
                className="relative z-20"
              >
                <div className="w-24 h-24 bg-gradient-to-br from-green-400 via-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-2xl border-2 border-white/20 backdrop-blur-xl pulse-glow">
                  <Shield className="w-12 h-12 text-white drop-shadow-lg" />
                </div>
              </motion.div>

              {/* Verification Steps - Triangular Formation */}
              {verificationSteps.map((step, index) => {
                const IconComponent = step.icon;
                // Create perfect triangular positioning - 120 degrees apart
                const angles = [0, 120, 240]; // Perfect triangle formation
                const angle = angles[index];

                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.6 + index * 0.2 }}
                    className="absolute cursor-pointer orbit-feature"
                    style={{
                      top: '50%',
                      left: '50%',
                      transform: `translate(-50%, -50%) rotate(${angle}deg) translateX(140px) rotate(-${angle}deg)`,
                      '--orbit-delay': `${index * 2.5}s`
                    }}
                  >
                    <motion.div
                      className="relative transition-all duration-300"
                      whileHover={{ scale: 1.05 }}
                    >
                      {/* Step Circle - No hover interactions */}
                      <div className={`w-16 h-16 ${step.bgColor} rounded-full flex items-center justify-center border-2 border-white/20 backdrop-blur-xl shadow-lg`}>
                        <IconComponent className={`w-8 h-8 ${step.color}`} />
                      </div>
                    </motion.div>
                  </motion.div>
                );
              })}

              {/* Connecting Lines */}
              <svg className="absolute inset-0 w-full h-full" viewBox="0 0 400 300">
                <defs>
                  <linearGradient id="verificationGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#3b82f6" />
                    <stop offset="50%" stopColor="#10b981" />
                    <stop offset="100%" stopColor="#8b5cf6" />
                  </linearGradient>
                </defs>
              </svg>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default BlockchainSection;