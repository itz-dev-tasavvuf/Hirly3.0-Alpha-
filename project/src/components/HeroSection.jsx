
import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ArrowRight, Sparkles } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';

const HeroSection = () => {
  const handleTryDemo = () => {
    toast({
      title: "🚧 This feature isn't implemented yet—but don't worry! You can request it in your next prompt! 🚀"
    });
  };

  const handleHowItWorks = () => {
    document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' });
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
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="flex items-center justify-center lg:justify-start mb-6"
            >
              <Sparkles className="w-6 h-6 text-purple-400 mr-2" />
              <span className="text-purple-300 font-medium">Powered by Algorand</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-5xl md:text-7xl font-black mb-6"
            >
              <span className="gradient-text">Hiring,</span>
              <br />
              <span className="text-white">redefined.</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-xl text-gray-300 mb-8 max-w-lg mx-auto lg:mx-0"
            >
              Swipe-based job hunting. Verified through Algorand's blockchain.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
            >
              <Button
                onClick={handleTryDemo}
                size="lg"
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold px-8 py-4 rounded-xl glow-effect"
              >
                Try the Demo
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
              <Button
                onClick={handleHowItWorks}
                variant="outline"
                size="lg"
                className="border-purple-500/50 text-purple-300 hover:bg-purple-500/20 px-8 py-4 rounded-xl"
              >
                How It Works
              </Button>
            </motion.div>
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
};

export default HeroSection;
