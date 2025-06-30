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

                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.8 + index * 0.15 }}
                    className={`absolute top-1/2 left-1/2 cursor-pointer z-20 ${
                      hoveredFeature === index ? 'orbit-paused' : 'orbit-feature'
                    }`}
                    onMouseEnter={() => setHoveredFeature(index)}
                    onMouseLeave={() => setHoveredFeature(null)}
                    onClick={() => setHoveredFeature(hoveredFeature === index ? null : index)}
                  >
                    <motion.div 
                      className={`relative transition-all duration-500 ${
                        hoveredFeature === index ? 'scale-125 z-50' : 'scale-100'
                      }`}
                      whileHover={{ scale: 1.1 }}
                    >
                      {/* Feature Card */}
                      <div className={`w-24 h-24 bg-gradient-to-br ${feature.color} rounded-2xl flex items-center justify-center shadow-2xl border-2 border-white/30 backdrop-blur-xl transition-all duration-500 ${
                        hoveredFeature === index ? 'shadow-[0_0_40px_rgba(139,92,246,0.6)]' : 'shadow-xl'
                      }`}
                      style={{
                        boxShadow: hoveredFeature === index ? 
                          `0 0 40px ${feature.color.includes('green') ? 'rgba(34, 197, 94, 0.7)' : 
                            feature.color.includes('blue') ? 'rgba(59, 130, 246, 0.7)' :
                            feature.color.includes('purple') ? 'rgba(168, 85, 247, 0.7)' :
                            'rgba(251, 146, 60, 0.7)'}, 0 20px 40px rgba(0,0,0,0.3)`
                          : '0 10px 25px rgba(0,0,0,0.2)'
                      }}>
                        <IconComponent className="w-8 h-8 text-white drop-shadow-lg" />
                      </div>

                      {/* Floating label */}
                      <motion.div 
                        className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 text-center pointer-events-none"
                        animate={{ 
                          y: hoveredFeature === index ? -5 : 0,
                          scale: hoveredFeature === index ? 1.1 : 1 
                        }}
                      >
                        <span className="text-xs text-white font-semibold bg-black/50 px-3 py-1 rounded-full backdrop-blur-sm border border-white/20">
                          {feature.title.split(' ')[0]}
                        </span>
                      </motion.div>

                      {/* Detailed hover card */}
                      {hoveredFeature === index && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.8, y: 20 }}
                          animate={{ opacity: 1, scale: 1, y: 0 }}
                          exit={{ opacity: 0, scale: 0.8, y: 20 }}
                          className="absolute top-32 left-1/2 transform -translate-x-1/2 w-80 glass-effect rounded-2xl p-6 z-50 pointer-events-none border border-white/20"
                          style={{
                            background: `linear-gradient(135deg, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.6) 100%)`,
                            backdropFilter: 'blur(20px)',
                            boxShadow: '0 25px 50px rgba(0,0,0,0.5), 0 0 30px rgba(139,92,246,0.3)'
                          }}
                        >
                          <div className="flex items-center mb-3">
                            <div className={`w-10 h-10 bg-gradient-to-br ${feature.color} rounded-lg flex items-center justify-center mr-3`}>
                              <IconComponent className="w-5 h-5 text-white" />
                            </div>
                            <h3 className="text-white font-bold text-lg">{feature.title}</h3>
                          </div>
                          <p className="text-gray-300 text-sm leading-relaxed">{feature.description}</p>
                          
                          {/* Decorative elements */}
                          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-purple-500 to-transparent"></div>
                        </motion.div>
                      )}

                      {/* Particle effect on hover */}
                      {hoveredFeature === index && (
                        <div className="absolute inset-0 pointer-events-none">
                          {[...Array(6)].map((_, i) => (
                            <motion.div
                              key={i}
                              className="absolute w-1 h-1 bg-white rounded-full"
                              initial={{ 
                                x: 12, 
                                y: 12, 
                                opacity: 0 
                              }}
                              animate={{ 
                                x: Math.cos(i * 60 * Math.PI / 180) * 30 + 12, 
                                y: Math.sin(i * 60 * Math.PI / 180) * 30 + 12, 
                                opacity: [0, 1, 0] 
                              }}
                              transition={{ 
                                duration: 1.5, 
                                repeat: Infinity, 
                                delay: i * 0.1 
                              }}
                            />
                          ))}
                        </div>
                      )}
                    </motion.div>
                  </motion.div>
                );
              })}

              {/* Connection Lines */}
              <svg className="absolute inset-0 w-full h-full" viewBox="0 0 400 400">
                {features.map((_, index) => {
                  const angle1 = (index * 90) * (Math.PI / 180);
                  const angle2 = ((index + 1) * 90) * (Math.PI / 180);
                  const radius = 160;
                  const centerX = 200;
                  const centerY = 200;
                  
                  const x1 = centerX + Math.cos(angle1) * radius;
                  const y1 = centerY + Math.sin(angle1) * radius;
                  const x2 = centerX + Math.cos(angle2) * radius;
                  const y2 = centerY + Math.sin(angle2) * radius;

                  return (
                    <motion.line
                      key={index}
                      initial={{ pathLength: 0, opacity: 0 }}
                      whileInView={{ pathLength: 1, opacity: 0.2 }}
                      viewport={{ once: true }}
                      transition={{ delay: 1 + index * 0.1, duration: 0.5 }}
                      x1={x1}
                      y1={y1}
                      x2={x2}
                      y2={y2}
                      stroke="url(#gradient)"
                      strokeWidth="2"
                      strokeDasharray="5,5"
                    />
                  );
                })}
                
                {/* Lines from center to features */}
                {features.map((_, index) => {
                  const angle = (index * 90) * (Math.PI / 180);
                  const radius = 160;
                  const centerX = 200;
                  const centerY = 200;
                  
                  const x = centerX + Math.cos(angle) * radius;
                  const y = centerY + Math.sin(angle) * radius;

                  return (
                    <motion.line
                      key={`center-${index}`}
                      initial={{ pathLength: 0, opacity: 0 }}
                      whileInView={{ pathLength: 1, opacity: 0.15 }}
                      viewport={{ once: true }}
                      transition={{ delay: 1.2 + index * 0.05, duration: 0.3 }}
                      x1={centerX}
                      y1={centerY}
                      x2={x}
                      y2={y}
                      stroke="url(#gradient)"
                      strokeWidth="1"
                    />
                  );
                })}

                <defs>
                  <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#8B5CF6" />
                    <stop offset="100%" stopColor="#06B6D4" />
                  </linearGradient>
                </defs>
              </svg>
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