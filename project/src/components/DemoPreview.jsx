
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform } from 'framer-motion';
import { Play, Pause, Volume2, X, Heart, MessageCircle, Shield, ArrowLeft, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';

const DemoPreview = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [showDemoModal, setShowDemoModal] = useState(false);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [swipeDirection, setSwipeDirection] = useState(null);
  
  // Motion values for drag gestures
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-30, 30]);
  const opacity = useTransform(x, [-200, -100, 0, 100, 200], [0, 1, 1, 1, 0]);

  // Keyboard event handler
  useEffect(() => {
    const handleKeyPress = (event) => {
      if (!showDemoModal || currentCardIndex >= demoCards.length - 1) return;
      
      if (event.key === 'ArrowLeft' || event.key === 'a' || event.key === 'A') {
        handleSwipe('left');
      } else if (event.key === 'ArrowRight' || event.key === 'd' || event.key === 'D') {
        handleSwipe('right');
      } else if (event.key === 'Escape') {
        closeDemoModal();
      }
    };

    if (showDemoModal) {
      window.addEventListener('keydown', handleKeyPress);
      return () => window.removeEventListener('keydown', handleKeyPress);
    }
  }, [showDemoModal, currentCardIndex]);

  const demoCards = [
    {
      type: 'instruction',
      title: 'Welcome to Hirly Demo!',
      content: 'Swipe right (→) to like, swipe left (←) to pass. Use arrow keys or drag the card!',
      bgColor: 'from-purple-600 to-blue-600'
    },
    {
      type: 'job',
      company: 'TechFlow Inc.',
      position: 'Senior Frontend Developer',
      location: 'San Francisco, CA',
      salary: '$120K - $150K',
      verified: true,
      description: 'Join our innovative team building next-gen web applications with React, TypeScript, and modern tools.',
      bgColor: 'from-green-500 to-teal-600',
      image: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=200&fit=crop'
    },
    {
      type: 'candidate',
      name: 'Alex Rodriguez',
      title: 'Full Stack Developer',
      experience: '5 years',
      location: 'New York, NY',
      verified: true,
      skills: ['React', 'Node.js', 'Python', 'AWS'],
      bgColor: 'from-blue-500 to-purple-600',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face'
    },
    {
      type: 'job',
      company: 'StartupHub',
      position: 'Product Manager',
      location: 'Remote',
      salary: '$100K - $130K',
      verified: true,
      description: 'Lead product strategy for our growing fintech platform. Work with cross-functional teams.',
      bgColor: 'from-pink-500 to-rose-600',
      image: 'https://images.unsplash.com/photo-1553484771-371a605b060b?w=400&h=200&fit=crop'
    },
    {
      type: 'instruction',
      title: 'Great Job!',
      content: 'You\'ve experienced the Hirly swipe interface. Ready to see more or have questions?',
      bgColor: 'from-indigo-600 to-purple-600'
    }
  ];

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

  const handleInteractiveDemo = () => {
    setShowDemoModal(true);
    setCurrentCardIndex(0);
    setSwipeDirection(null);
  };

  const handleSwipe = (direction) => {
    setSwipeDirection(direction);
    // Reset motion values
    x.set(direction === 'left' ? -300 : 300);
    
    setTimeout(() => {
      if (currentCardIndex < demoCards.length - 1) {
        setCurrentCardIndex(prev => prev + 1);
        setSwipeDirection(null);
        x.set(0); // Reset position
      }
    }, 300);
  };

  const handleDragEnd = (event, info) => {
    const threshold = 100;
    if (Math.abs(info.offset.x) > threshold) {
      handleSwipe(info.offset.x > 0 ? 'right' : 'left');
    } else {
      x.set(0); // Snap back to center
    }
  };

  const handleContactSales = () => {
    setShowDemoModal(false);
    toast({
      title: "Thanks for your interest! A sales representative will contact you soon. 📧"
    });
  };

  const handleGoBack = () => {
    setCurrentCardIndex(0);
    setSwipeDirection(null);
  };

  const closeDemoModal = () => {
    setShowDemoModal(false);
    setCurrentCardIndex(0);
    setSwipeDirection(null);
    x.set(0);
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
                description: 'Try the full Hirly experience with real-time swiping and matching',
                onClick: handleInteractiveDemo
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
              <div 
                key={index} 
                className={`glass-effect rounded-2xl p-6 text-center transition-all duration-300 ${
                  feature.onClick ? 'cursor-pointer hover:bg-white/10 hover:scale-105' : ''
                }`}
                onClick={feature.onClick}
              >
                <h3 className="text-white font-semibold mb-3">{feature.title}</h3>
                <p className="text-gray-300 text-sm">{feature.description}</p>
                {feature.onClick && (
                  <Button className="mt-4 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600">
                    Try Demo
                  </Button>
                )}
              </div>
            ))}
          </motion.div>
        </motion.div>

        {/* Interactive Demo Modal */}
        <AnimatePresence>
          {showDemoModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="relative w-full max-w-sm mx-auto"
              >
                {/* Close Button */}
                <button
                  onClick={closeDemoModal}
                  className="absolute -top-12 right-0 text-white/70 hover:text-white z-10"
                >
                  <X className="w-6 h-6" />
                </button>

                {/* Instructions */}
                <div className="absolute -top-12 left-0 text-white/70 text-sm">
                  Use ← → arrow keys or drag to swipe
                </div>

                {/* Card Stack */}
                <div className="relative h-[500px] perspective-1000">
                  {currentCardIndex < demoCards.length && (
                    <motion.div
                      key={currentCardIndex}
                      drag="x"
                      dragConstraints={{ left: 0, right: 0 }}
                      dragElastic={0.2}
                      onDragEnd={handleDragEnd}
                      style={{ 
                        x,
                        rotate,
                        opacity
                      }}
                      initial={{ scale: 1, rotateY: 0, x: 0 }}
                      animate={{
                        x: swipeDirection === 'left' ? -300 : swipeDirection === 'right' ? 300 : 0,
                        rotate: swipeDirection === 'left' ? -30 : swipeDirection === 'right' ? 30 : 0,
                        opacity: swipeDirection ? 0 : 1
                      }}
                      transition={{ duration: 0.3 }}
                      className="absolute inset-0 w-full h-full cursor-grab active:cursor-grabbing"
                    >
                      <div className={`w-full h-full bg-gradient-to-br ${demoCards[currentCardIndex].bgColor} rounded-2xl shadow-2xl overflow-hidden`}>
                        {demoCards[currentCardIndex].type === 'instruction' ? (
                          <div className="p-6 flex flex-col items-center justify-center h-full text-center">
                            <h2 className="text-xl font-bold text-white mb-4">
                              {demoCards[currentCardIndex].title}
                            </h2>
                            <p className="text-white/90 text-base leading-relaxed">
                              {demoCards[currentCardIndex].content}
                            </p>
                            {currentCardIndex === demoCards.length - 1 && (
                              <div className="mt-6 space-y-3 w-full">
                                <Button
                                  onClick={handleContactSales}
                                  className="w-full bg-white/20 hover:bg-white/30 text-white border border-white/30 text-sm"
                                >
                                  <Mail className="w-4 h-4 mr-2" />
                                  Contact Sales
                                </Button>
                                <Button
                                  onClick={handleGoBack}
                                  variant="outline"
                                  className="w-full border-white/30 text-white hover:bg-white/20 text-sm"
                                >
                                  <ArrowLeft className="w-4 h-4 mr-2" />
                                  Try Again
                                </Button>
                              </div>
                            )}
                          </div>
                        ) : demoCards[currentCardIndex].type === 'job' ? (
                          <div className="p-5 h-full flex flex-col">
                            {demoCards[currentCardIndex].image && (
                              <div className="h-24 mb-3 rounded-xl overflow-hidden">
                                <img 
                                  src={demoCards[currentCardIndex].image}
                                  alt="Company"
                                  className="w-full h-full object-cover"
                                />
                              </div>
                            )}
                            <div className="flex items-center mb-2">
                              <h3 className="text-lg font-bold text-white mr-2">
                                {demoCards[currentCardIndex].company}
                              </h3>
                              {demoCards[currentCardIndex].verified && (
                                <Shield className="w-4 h-4 text-green-400" />
                              )}
                            </div>
                            <h4 className="text-base font-semibold text-white/90 mb-2">
                              {demoCards[currentCardIndex].position}
                            </h4>
                            <p className="text-white/70 text-sm mb-1">{demoCards[currentCardIndex].location}</p>
                            <p className="text-green-300 font-semibold text-sm mb-3">{demoCards[currentCardIndex].salary}</p>
                            <p className="text-white/80 text-sm flex-1">{demoCards[currentCardIndex].description}</p>
                          </div>
                        ) : (
                          <div className="p-5 h-full flex flex-col">
                            <div className="flex items-center mb-4">
                              <div className="w-16 h-16 rounded-full overflow-hidden mr-3">
                                <img 
                                  src={demoCards[currentCardIndex].image}
                                  alt={demoCards[currentCardIndex].name}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                              <div>
                                <div className="flex items-center">
                                  <h3 className="text-lg font-bold text-white mr-2">
                                    {demoCards[currentCardIndex].name}
                                  </h3>
                                  {demoCards[currentCardIndex].verified && (
                                    <Shield className="w-4 h-4 text-green-400" />
                                  )}
                                </div>
                                <p className="text-white/90 text-sm">{demoCards[currentCardIndex].title}</p>
                                <p className="text-white/70 text-xs">{demoCards[currentCardIndex].experience} experience</p>
                              </div>
                            </div>
                            <p className="text-white/70 mb-3 text-sm">{demoCards[currentCardIndex].location}</p>
                            <div className="flex flex-wrap gap-2 mb-4">
                              {demoCards[currentCardIndex].skills?.map((skill, i) => (
                                <span key={i} className="px-2 py-1 bg-white/20 rounded-full text-white text-xs">
                                  {skill}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}
                </div>

                {/* Swipe Actions */}
                {currentCardIndex < demoCards.length - 1 && (
                  <div className="flex justify-center space-x-6 mt-4">
                    <Button
                      onClick={() => handleSwipe('left')}
                      variant="outline"
                      size="sm"
                      className="border-red-500/50 text-red-400 hover:bg-red-500/20 rounded-full w-12 h-12"
                    >
                      <X className="w-5 h-5" />
                    </Button>
                    <Button
                      onClick={() => handleSwipe('right')}
                      variant="outline"
                      size="sm"
                      className="border-green-500/50 text-green-400 hover:bg-green-500/20 rounded-full w-12 h-12"
                    >
                      <Heart className="w-5 h-5" />
                    </Button>
                  </div>
                )}

                {/* Progress Indicator */}
                <div className="flex justify-center space-x-1 mt-4">
                  {demoCards.map((_, index) => (
                    <div
                      key={index}
                      className={`w-1.5 h-1.5 rounded-full transition-colors ${
                        index <= currentCardIndex ? 'bg-white' : 'bg-white/30'
                      }`}
                    />
                  ))}
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};

export default DemoPreview;
