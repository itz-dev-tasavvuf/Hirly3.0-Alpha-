import React from 'react';
import { motion } from 'framer-motion';
import { User, Heart, Shield, Zap } from 'lucide-react';

const HowItWorks = () => {
  const steps = [
    {
      icon: User,
      title: 'Create a profile',
      description: 'Build your professional profile with skills, experience, and preferences. Get verified instantly.',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      icon: Heart,
      title: 'Swipe to apply or match',
      description: 'Browse through verified job posts and candidates. Swipe right to show interest, left to pass.',
      color: 'from-purple-500 to-pink-500'
    },
    {
      icon: Shield,
      title: 'Verify your ID or job post',
      description: 'All profiles and job posts are verified through Algorand blockchain for maximum security.',
      color: 'from-green-500 to-emerald-500'
    },
    {
      icon: Zap,
      title: 'Connect and hire securely',
      description: 'AI matches compatible profiles. Smart contracts manage agreements and expiration dates.',
      color: 'from-orange-500 to-red-500'
    }
  ];

  return (
    <section id="how-it-works" className="py-24 relative overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/3 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/3 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            How <span className="gradient-text">Hirly</span> Works
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Four simple steps to revolutionize your hiring process with blockchain-verified security
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2 }}
              whileHover={{ y: -10 }}
              className="relative group"
            >
              <div className="glass-effect rounded-2xl p-8 h-full hover:glow-effect transition-all duration-300">
                <div className={`w-16 h-16 bg-gradient-to-r ${step.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  <step.icon className="w-8 h-8 text-white" />
                </div>
                
                <div className="flex items-center mb-4">
                  <span className="text-2xl font-bold text-purple-400 mr-3">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <h3 className="text-xl font-bold text-white">
                    {step.title}
                  </h3>
                </div>
                
                <p className="text-gray-300 leading-relaxed">
                  {step.description}
                </p>

                {/* Connecting Line */}
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-1/2 -right-4 w-8 h-0.5 bg-gradient-to-r from-purple-500 to-transparent" />
                )}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mt-16"
        >
          <div className="glass-effect rounded-2xl p-8 max-w-2xl mx-auto">
            <h3 className="text-2xl font-bold text-white mb-4">
              Ready to experience the future of hiring?
            </h3>
            <p className="text-gray-300 mb-6">
              Join thousands of professionals already using Hirly to find their perfect match
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <div className="flex items-center text-green-400">
                <Shield className="w-5 h-5 mr-2" />
                <span>Blockchain Verified</span>
              </div>
              <div className="flex items-center text-blue-400">
                <Zap className="w-5 h-5 mr-2" />
                <span>AI Powered</span>
              </div>
              <div className="flex items-center text-purple-400">
                <Heart className="w-5 h-5 mr-2" />
                <span>Perfect Matches</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default HowItWorks;
