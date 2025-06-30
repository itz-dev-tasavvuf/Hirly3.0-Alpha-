import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Shield, Lock, CheckCircle, Zap } from 'lucide-react';
import algorandFullLogoWhite from '@/assets/algorand_full_logo_white.png';

const BlockchainSection = () => {
  const [hoveredFeature, setHoveredFeature] = useState(null);

  const features = [
    {
      icon: Shield,
      title: 'Identity Verification',
      description: 'Every user profile is cryptographically verified on the Algorand blockchain',
      color: 'from-green-500 to-emerald-500'
    },
    {
      icon: Lock,
      title: 'Secure Job Posts',
      description: 'All job listings are authenticated to eliminate fake postings and scams',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      icon: CheckCircle,
      title: 'Immutable Records',
      description: 'Employment history and credentials stored permanently and transparently',
      color: 'from-purple-500 to-violet-500'
    },
    {
      icon: Zap,
      title: 'Instant Verification',
      description: 'Real-time verification process takes seconds, not days',
      color: 'from-orange-500 to-yellow-500'
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
            <div className="relative w-full max-w-2xl mx-auto h-[500px]">
              {/* Orbit Ring */}
              <div className="orbit-ring"></div>
              
              {/* Inner glow ring */}
              <div className="absolute top-1/2 left-1/2 w-80 h-80 border border-purple-500/30 rounded-full transform -translate-x-1/2 -translate-y-1/2 shadow-[0_0_50px_rgba(139,92,246,0.3)]"></div>
              
              {/* Central Shield Hub */}
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                whileInView={{ scale: 1, rotate: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.5, type: "spring", stiffness: 200 }}
                className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-30"
              >
                <div className="relative">
                  {/* Main shield */}
                  <div className="w-32 h-32 bg-gradient-to-br from-green-400 via-blue-500 to-purple-600 rounded-3xl flex items-center justify-center shadow-2xl border-2 border-white/20 backdrop-blur-xl pulse-glow">
                    <Shield className="w-16 h-16 text-white drop-shadow-lg" />
                  </div>
                  
                  {/* Rotating border */}
                  <div className="absolute inset-0 rounded-3xl border-2 border-transparent bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 animate-spin" style={{ animationDuration: '4s' }}>
                    <div className="w-full h-full bg-slate-900 rounded-3xl m-0.5"></div>
                  </div>
                  
                  {/* Center content (shield) */}
                  <div className="absolute inset-0 w-32 h-32 bg-gradient-to-br from-green-400 via-blue-500 to-purple-600 rounded-3xl flex items-center justify-center">
                    <Shield className="w-16 h-16 text-white drop-shadow-lg" />
                  </div>
                </div>
              </motion.div>

              {/* Orbiting Feature Cards */}
              {features.map((feature, index) => {
                const IconComponent = feature.icon;
                const angle = (index * 90) * (Math.PI / 180); // Start positions: 0°, 90°, 180°, 270°

                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.8 + index * 0.15 }}
                    className={`absolute cursor-pointer z-20 ${
                      hoveredFeature === index ? '' : 'orbit-feature'
                    }`}
                    style={{
                      top: '50%',
                      left: '50%',
                      transform: `translate(-50%, -50%) rotate(${angle * (180/Math.PI)}deg) translateX(160px) rotate(-${angle * (180/Math.PI)}deg)`,
                    }}
                    onMouseEnter={() => setHoveredFeature(index)}
                    onMouseLeave={() => setHoveredFeature(null)}
                    onClick={() => setHoveredFeature(hoveredFeature === index ? null : index)}
                  >
                    <motion.div 
                      className={`relative transition-all duration-500 ${
                        hoveredFeature === index ? 'scale-110 z-50' : 'scale-100'
                      }`}
                      whileHover={{ scale: 1.05 }}
                    >
                      {/* Feature Card - More like the screenshot */}
                      <div className={`min-w-[140px] h-12 bg-gradient-to-r ${feature.color} rounded-lg flex items-center px-3 shadow-2xl border border-white/30 backdrop-blur-xl transition-all duration-500 ${
                        hoveredFeature === index ? 'shadow-[0_0_30px_rgba(139,92,246,0.6)]' : 'shadow-xl'
                      }`}
                      style={{
                        background: hoveredFeature === index ? 
                          `linear-gradient(135deg, ${feature.color.includes('green') ? '#059669, #10b981' : 
                            feature.color.includes('blue') ? '#2563eb, #3b82f6' :
                            feature.color.includes('purple') ? '#7c3aed, #8b5cf6' :
                            '#ea580c, #f97316'})` :
                          `linear-gradient(135deg, rgba(30, 41, 59, 0.9), rgba(51, 65, 85, 0.8))`,
                        boxShadow: hoveredFeature === index ? 
                          `0 0 30px ${feature.color.includes('green') ? 'rgba(34, 197, 94, 0.5)' : 
                            feature.color.includes('blue') ? 'rgba(59, 130, 246, 0.5)' :
                            feature.color.includes('purple') ? 'rgba(168, 85, 247, 0.5)' :
                            'rgba(251, 146, 60, 0.5)'}, 0 10px 25px rgba(0,0,0,0.3)`
                          : '0 5px 15px rgba(0,0,0,0.2)'
                      }}>
                        <IconComponent className="w-5 h-5 text-white mr-2 flex-shrink-0" />
                        <span className="text-white text-sm font-medium truncate">
                          {feature.title}
                        </span>
                      </div>

                      {/* Detailed hover card */}
                      {hoveredFeature === index && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.8, y: 20 }}
                          animate={{ opacity: 1, scale: 1, y: 0 }}
                          exit={{ opacity: 0, scale: 0.8, y: 20 }}
                          className="absolute top-16 left-1/2 transform -translate-x-1/2 w-72 glass-effect rounded-2xl p-5 z-50 pointer-events-none border border-white/20"
                          style={{
                            background: `linear-gradient(135deg, rgba(0,0,0,0.9) 0%, rgba(30,41,59,0.8) 100%)`,
                            backdropFilter: 'blur(20px)',
                            boxShadow: '0 25px 50px rgba(0,0,0,0.5), 0 0 30px rgba(139,92,246,0.3)'
                          }}
                        >
                          <div className="flex items-center mb-3">
                            <div className={`w-8 h-8 bg-gradient-to-br ${feature.color} rounded-lg flex items-center justify-center mr-3`}>
                              <IconComponent className="w-4 h-4 text-white" />
                            </div>
                            <h3 className="text-white font-bold text-base">{feature.title}</h3>
                          </div>
                          <p className="text-gray-300 text-sm leading-relaxed">{feature.description}</p>
                          
                          {/* Decorative elements */}
                          <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-purple-500 to-transparent"></div>
                        </motion.div>
                      )}

                      {/* Connection line to center */}
                      <div className="absolute top-1/2 left-1/2 w-px h-32 bg-gradient-to-b from-purple-400/30 to-transparent transform -translate-x-1/2 -translate-y-full origin-bottom opacity-60">
                      </div>
                    </motion.div>
                  </motion.div>
                );
              })}
            </div>

            {/* Static verification badges */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 1.5 }}
              className="absolute -top-4 -right-4 glass-effect rounded-lg p-3"
            >
              <div className="flex items-center text-green-400">
                <CheckCircle className="w-4 h-4 mr-2" />
                <span className="text-sm font-medium">Verified</span>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 1.7 }}
              className="absolute -bottom-4 -left-4 glass-effect rounded-lg p-3"
            >
              <div className="flex items-center text-blue-400">
                <Lock className="w-4 h-4 mr-2" />
                <span className="text-sm font-medium">Secure</span>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default BlockchainSection;