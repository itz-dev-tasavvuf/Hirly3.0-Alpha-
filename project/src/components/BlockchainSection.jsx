import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Lock, CheckCircle, Zap } from 'lucide-react';

const BlockchainSection = () => {
  const features = [
    {
      icon: Shield,
      title: 'Identity Verification',
      description: 'Every user profile is cryptographically verified on the Algorand blockchain'
    },
    {
      icon: Lock,
      title: 'Secure Job Posts',
      description: 'All job listings are authenticated to eliminate fake postings and scams'
    },
    {
      icon: CheckCircle,
      title: 'Immutable Records',
      description: 'Employment history and credentials stored permanently and transparently'
    },
    {
      icon: Zap,
      title: 'Instant Verification',
      description: 'Real-time verification process takes seconds, not days'
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
            <div className="flex items-center mb-6">
              <img  alt="Algorand logo" className="w-8 h-8 mr-3" src="https://images.unsplash.com/photo-1639327380086-f13b8fef4211" />
              <span className="text-green-400 font-semibold text-lg">Powered by Algorand</span>
            </div>

            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Blockchain-Verified
              <br />
              <span className="gradient-text">Trust & Security</span>
            </h2>

            <p className="text-xl text-gray-300 mb-8 leading-relaxed">
              We use blockchain to verify identities and job posts. No more fake listings or bots. 
              Just real people, verified securely through Algorand's carbon-negative blockchain.
            </p>

            <div className="grid sm:grid-cols-2 gap-6">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-start"
                >
                  <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-blue-500 rounded-lg flex items-center justify-center mr-4 flex-shrink-0">
                    <feature.icon className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-white font-semibold mb-2">{feature.title}</h3>
                    <p className="text-gray-400 text-sm">{feature.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="relative w-full max-w-md mx-auto">
              <motion.div
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.5, type: "spring" }}
                className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20"
              >
                <div className="w-24 h-24 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center pulse-glow">
                  <Shield className="w-12 h-12 text-white" />
                </div>
              </motion.div>

              {[...Array(8)].map((_, index) => {
                const angle = (index * 45) * (Math.PI / 180);
                const radius = 120;
                const x = Math.cos(angle) * radius;
                const y = Math.sin(angle) * radius;

                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.7 + index * 0.1 }}
                    className="absolute top-1/2 left-1/2 blockchain-node"
                    style={{
                      transform: `translate(${x - 16}px, ${y - 16}px)`,
                      animationDelay: `${index * 0.3}s`
                    }}
                  >
                    <div className="w-8 h-8 bg-purple-500/30 rounded-full border-2 border-purple-400 flex items-center justify-center">
                      <div className="w-3 h-3 bg-purple-400 rounded-full" />
                    </div>
                  </motion.div>
                );
              })}

              <svg className="absolute inset-0 w-full h-full" viewBox="0 0 300 300">
                {[...Array(8)].map((_, index) => {
                  const angle1 = (index * 45) * (Math.PI / 180);
                  const angle2 = ((index + 1) * 45) * (Math.PI / 180);
                  const radius = 120;
                  const centerX = 150;
                  const centerY = 150;
                  
                  const x1 = centerX + Math.cos(angle1) * radius;
                  const y1 = centerY + Math.sin(angle1) * radius;
                  const x2 = centerX + Math.cos(angle2) * radius;
                  const y2 = centerY + Math.sin(angle2) * radius;

                  return (
                    <motion.line
                      key={index}
                      initial={{ pathLength: 0, opacity: 0 }}
                      whileInView={{ pathLength: 1, opacity: 0.3 }}
                      viewport={{ once: true }}
                      transition={{ delay: 1 + index * 0.1, duration: 0.5 }}
                      x1={x1}
                      y1={y1}
                      x2={x2}
                      y2={y2}
                      stroke="url(#gradient)"
                      strokeWidth="2"
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