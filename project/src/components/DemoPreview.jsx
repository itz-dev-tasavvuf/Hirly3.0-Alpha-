
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Play, Pause, Volume2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';

const DemoPreview = () => {
  const [isPlaying, setIsPlaying] = useState(false);

  const handlePlayDemo = () => {
    setIsPlaying(!isPlaying);
    toast({
      title: "🚧 This feature isn't implemented yet—but don't worry! You can request it in your next prompt! 🚀"
    });
  };

  const handleWatchFullDemo = () => {
    toast({
      title: "🚧 This feature isn't implemented yet—but don't worry! You can request it in your next prompt! 🚀"
    });
  };

  return (
    <section className="py-24 relative overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] bg-gradient-to-r from-purple-500/5 to-pink-500/5 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            See <span className="gradient-text">Hirly</span> in Action
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Watch how Hirly changes the way you find your next opportunity
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="relative max-w-5xl mx-auto"
        >
          {/* Video Container */}
          <div className="relative glass-effect rounded-3xl overflow-hidden glow-effect">
            <div className="aspect-video bg-gradient-to-br from-purple-900/50 to-pink-900/50 flex items-center justify-center relative">
              {/* Mock Video Content */}
              <div className="absolute inset-0 bg-gradient-to-br from-slate-900 to-purple-900 opacity-90" />
              
              {/* Demo Interface Mockup */}
              <div className="relative z-10 w-full h-full flex items-center justify-center">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 p-8 w-full max-w-4xl">
                  {/* Mobile App Preview */}
                  <div className="flex justify-center">
                    <div className="w-48 h-80 bg-black rounded-3xl p-2 shadow-2xl">
                      <div className="w-full h-full bg-gradient-to-br from-purple-600 to-pink-600 rounded-2xl flex flex-col p-4">
                        <div className="flex justify-center mb-4">
                          <div className="w-12 h-1 bg-white/30 rounded-full" />
                        </div>
                        <div className="flex-1 flex flex-col items-center justify-center">
                          <div className="w-32 h-40 bg-white/10 rounded-2xl mb-4 flex items-center justify-center">
                            <span className="text-white text-xs">Profile Card</span>
                          </div>
                          <div className="flex space-x-4">
                            <div className="w-12 h-12 bg-red-500/30 rounded-full flex items-center justify-center">
                              <span className="text-red-400">✕</span>
                            </div>
                            <div className="w-12 h-12 bg-green-500/30 rounded-full flex items-center justify-center">
                              <span className="text-green-400">♥</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Features List */}
                  <div className="space-y-4">
                    <h3 className="text-white font-bold text-lg mb-4">Key Features</h3>
                    {[
                      'Swipe-based matching',
                      'Blockchain verification',
                      'AI-powered recommendations',
                      'Smart contract agreements',
                      'Real-time messaging'
                    ].map((feature, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: index * 0.1 }}
                        className="flex items-center text-gray-300"
                      >
                        <div className="w-2 h-2 bg-purple-400 rounded-full mr-3" />
                        <span>{feature}</span>
                      </motion.div>
                    ))}
                  </div>

                  {/* Stats */}
                  <div className="space-y-4">
                    <h3 className="text-white font-bold text-lg mb-4">Platform Stats</h3>
                    {[
                      { label: 'Active Users', value: '50K+' },
                      { label: 'Successful Matches', value: '12K+' },
                      { label: 'Verified Companies', value: '2.5K+' },
                      { label: 'Average Match Time', value: '3 days' }
                    ].map((stat, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: index * 0.1 }}
                        className="glass-effect rounded-lg p-3"
                      >
                        <div className="text-purple-300 font-semibold">{stat.value}</div>
                        <div className="text-gray-400 text-sm">{stat.label}</div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Play Button Overlay */}
              <motion.button
                onClick={handlePlayDemo}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="absolute inset-0 flex items-center justify-center z-20 bg-black/20 hover:bg-black/30 transition-colors"
              >
                <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/30">
                  {isPlaying ? (
                    <Pause className="w-8 h-8 text-white" />
                  ) : (
                    <Play className="w-8 h-8 text-white ml-1" />
                  )}
                </div>
              </motion.button>
            </div>

            {/* Video Controls */}
            <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Button
                  onClick={handlePlayDemo}
                  variant="ghost"
                  size="icon"
                  className="text-white hover:bg-white/20"
                >
                  {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-white hover:bg-white/20"
                >
                  <Volume2 className="w-5 h-5" />
                </Button>
                <span className="text-white text-sm">2:34 / 4:12</span>
              </div>
              
              <Button
                onClick={handleWatchFullDemo}
                variant="outline"
                className="border-white/30 text-white hover:bg-white/20"
              >
                Watch Full Demo
              </Button>
            </div>

            {/* Progress Bar */}
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/20">
              <motion.div
                initial={{ width: '0%' }}
                animate={{ width: isPlaying ? '60%' : '0%' }}
                transition={{ duration: 2 }}
                className="h-full bg-gradient-to-r from-purple-500 to-pink-500"
              />
            </div>
          </div>

          {/* Demo Features */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="grid md:grid-cols-3 gap-6 mt-12"
          >
            {[
              {
                title: 'Interactive Demo',
                description: 'Try the full Hirly experience with real-time swiping and matching'
              },
              {
                title: 'No Signup Required',
                description: 'Jump right in and explore all features without creating an account'
              },
              {
                title: 'Real Data Preview',
                description: 'See how verified profiles and job posts look in the actual app'
              }
            ].map((feature, index) => (
              <div key={index} className="glass-effect rounded-2xl p-6 text-center">
                <h3 className="text-white font-semibold mb-3">{feature.title}</h3>
                <p className="text-gray-300 text-sm">{feature.description}</p>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default DemoPreview;
