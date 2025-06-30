
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
  const [isCardExpanded, setIsCardExpanded] = useState(false);
  
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

  // Prevent background scrolling when modal is open
  useEffect(() => {
    if (showDemoModal) {
      // Save current scroll position
      const scrollY = window.scrollY;
      
      // Prevent body scroll
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = '100%';
      
      return () => {
        // Restore body scroll
        document.body.style.position = '';
        document.body.style.top = '';
        document.body.style.width = '';
        
        // Restore scroll position
        window.scrollTo(0, scrollY);
      };
    }
  }, [showDemoModal]);

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
      image: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=200&fit=crop',
      expandedContent: {
        benefits: ['Health, Dental & Vision Insurance', '401k with Company Match', 'Unlimited PTO', 'Remote Work Options', '$2000 Annual Learning Budget'],
        requirements: ['5+ years React experience', 'TypeScript proficiency', 'Experience with modern build tools', 'Strong CSS/SASS skills'],
        companyInfo: 'TechFlow Inc. is a leading technology company specializing in innovative web solutions for Fortune 500 companies.',
        teamSize: '15-person engineering team',
        workStyle: 'Hybrid - 3 days in office, 2 days remote'
      }
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
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face',
      expandedContent: {
        summary: 'Experienced full-stack developer with a passion for creating scalable web applications and leading development teams.',
        workHistory: [
          { company: 'TechCorp', role: 'Senior Developer', duration: '2022-Present' },
          { company: 'StartupXYZ', role: 'Full Stack Developer', duration: '2020-2022' },
          { company: 'WebAgency', role: 'Frontend Developer', duration: '2019-2020' }
        ],
        education: 'BS Computer Science - NYU (2019)',
        achievements: ['Led team of 5 developers', 'Reduced load times by 40%', 'Built 3 successful SaaS products'],
        availability: 'Available immediately',
        salaryRange: '$140K - $160K'
      }
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
      image: 'https://images.unsplash.com/photo-1553484771-371a605b060b?w=400&h=200&fit=crop',
      expandedContent: {
        benefits: ['Equity Package', 'Health Insurance', 'Flexible Hours', '100% Remote', 'Professional Development Fund'],
        requirements: ['3+ years product management', 'Fintech experience preferred', 'Data-driven mindset', 'Strong communication skills'],
        companyInfo: 'Fast-growing fintech startup helping small businesses manage their finances more effectively.',
        teamSize: '8-person product team',
        workStyle: '100% Remote with quarterly team meetups'
      }
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
    if (isCardExpanded) return; // Prevent swiping when card is expanded
    
    setSwipeDirection(direction);
    // Reset motion values
    x.set(direction === 'left' ? -300 : 300);
    
    setTimeout(() => {
      if (currentCardIndex < demoCards.length - 1) {
        setCurrentCardIndex(prev => prev + 1);
        setSwipeDirection(null);
        setIsCardExpanded(false); // Reset expansion for new card
        x.set(0); // Reset position
      }
    }, 300);
  };

  const handleDragEnd = (event, info) => {
    if (isCardExpanded) return; // Prevent dragging when card is expanded
    
    const threshold = 100;
    if (Math.abs(info.offset.x) > threshold) {
      handleSwipe(info.offset.x > 0 ? 'right' : 'left');
    } else {
      x.set(0); // Snap back to center
    }
  };

  const handleCardClick = (e) => {
    e.stopPropagation();
    if (demoCards[currentCardIndex].type !== 'instruction') {
      setIsCardExpanded(!isCardExpanded);
    }
  };

  const handleBackgroundClick = () => {
    setIsCardExpanded(false);
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
    setIsCardExpanded(false); // Reset expansion
  };

  const closeDemoModal = () => {
    setShowDemoModal(false);
    setCurrentCardIndex(0);
    setSwipeDirection(null);
    setIsCardExpanded(false); // Reset expansion
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
            className="flex justify-center mt-12"
          >
            <div 
              className="glass-effect rounded-2xl p-6 text-center transition-all duration-300 cursor-pointer hover:bg-white/10 hover:scale-105 max-w-sm"
              onClick={handleInteractiveDemo}
            >
              <h3 className="text-white font-semibold mb-3">Interactive Demo</h3>
              <p className="text-gray-300 text-sm mb-4">Try the full Hirly experience with real-time swiping and matching</p>
              <Button className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600">
                Try Demo
              </Button>
            </div>
          </motion.div>
        </motion.div>                {/* Interactive Demo Modal */}
        <AnimatePresence>
          {showDemoModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
              onClick={handleBackgroundClick}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className={`relative w-full mx-auto transition-all duration-300 ${
                  isCardExpanded ? 'max-w-lg' : 'max-w-sm'
                }`}
                onClick={(e) => e.stopPropagation()}
              >
                {/* Close Button - Fixed positioning and visibility */}
                <button
                  onClick={closeDemoModal}
                  className="absolute -top-16 right-2 bg-black/50 hover:bg-black/70 text-white rounded-full p-2 z-50 transition-colors border border-white/20"
                >
                  <X className="w-6 h-6" />
                </button>

                {/* Instructions */}
                <div className="absolute -top-16 left-0 text-white/90 text-sm bg-black/30 px-3 py-1 rounded-lg">
                  Use ← → arrow keys or drag to swipe
                </div>

                {/* Card Stack */}
                <div className={`relative perspective-1000 transition-all duration-300 ${
                  isCardExpanded ? 'h-[600px]' : 'h-[500px]'
                }`}>
                  {currentCardIndex < demoCards.length && (
                    <motion.div
                      key={currentCardIndex}
                      drag={isCardExpanded ? false : "x"}
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
                        opacity: swipeDirection ? 0 : 1,
                        scale: isCardExpanded ? 1.02 : 1
                      }}
                      transition={{ duration: 0.3 }}
                      className={`absolute inset-0 w-full h-full ${
                        isCardExpanded || demoCards[currentCardIndex].type === 'instruction' 
                          ? 'cursor-default' 
                          : 'cursor-grab active:cursor-grabbing'
                      }`}
                      onClick={handleCardClick}
                    >
                      <div className={`w-full h-full bg-gradient-to-br ${demoCards[currentCardIndex].bgColor} rounded-2xl shadow-2xl overflow-hidden`}>
                        {demoCards[currentCardIndex].type === 'instruction' ? (
                          <div className="p-6 flex flex-col items-center justify-center h-full text-center">
                            {/* Hirly Logo - only show on first instruction card */}
                            {currentCardIndex === 0 && (
                              <div className="mb-6">
                                <div className="text-6xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-red-400 bg-clip-text text-transparent">
                                  Hirly
                                </div>
                              </div>
                            )}
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
                                <Button
                                  onClick={closeDemoModal}
                                  variant="outline"
                                  className="w-full border-red-400/50 text-red-400 hover:bg-red-500/20 text-sm"
                                >
                                  <X className="w-4 h-4 mr-2" />
                                  Close Demo
                                </Button>
                              </div>
                            )}
                          </div>
                        ) : demoCards[currentCardIndex].type === 'job' ? (
                          <div className="p-6 h-full flex flex-col">
                            <div className="flex-shrink-0">
                              {demoCards[currentCardIndex].image && (
                                <div className="h-32 mb-4 rounded-xl overflow-hidden">
                                  <img 
                                    src={demoCards[currentCardIndex].image}
                                    alt="Company"
                                    className="w-full h-full object-cover"
                                  />
                                </div>
                              )}
                              <div className="flex items-center mb-3">
                                <h3 className="text-xl font-bold text-white mr-2">
                                  {demoCards[currentCardIndex].company}
                                </h3>
                                {demoCards[currentCardIndex].verified && (
                                  <Shield className="w-5 h-5 text-green-400" />
                                )}
                              </div>
                              <h4 className="text-lg font-semibold text-white/90 mb-3">
                                {demoCards[currentCardIndex].position}
                              </h4>
                              <p className="text-white/70 text-base mb-2">{demoCards[currentCardIndex].location}</p>
                              <p className="text-green-300 font-semibold text-base mb-4">{demoCards[currentCardIndex].salary}</p>
                              <p className="text-white/80 text-base leading-relaxed">
                                {demoCards[currentCardIndex].description}
                              </p>
                            </div>
                            
                            {/* Scrollable expanded content */}
                            <div className={`flex-1 ${isCardExpanded ? 'overflow-y-auto scrollbar-hide' : 'overflow-hidden'}`}>
                              {/* Tap to expand indicator */}
                              {!isCardExpanded && (
                                <div className="mt-4 flex items-center justify-center text-white/50 text-xs">
                                  <span>Tap to see more details</span>
                                </div>
                              )}
                              
                              {/* Expanded Content */}
                              <AnimatePresence>
                                {isCardExpanded && (
                                  <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    exit={{ opacity: 0, height: 0 }}
                                    className="mt-4 pt-4 border-t border-white/20"
                                  >
                                    <h5 className="text-white font-semibold mb-2">Benefits & Perks</h5>
                                    <div className="space-y-2 mb-4">
                                      <div className="flex items-center text-white/80 text-sm">
                                        <div className="w-2 h-2 bg-green-400 rounded-full mr-2"></div>
                                        Health, Dental & Vision Insurance
                                      </div>
                                      <div className="flex items-center text-white/80 text-sm">
                                        <div className="w-2 h-2 bg-green-400 rounded-full mr-2"></div>
                                        4 weeks PTO + Holidays
                                      </div>
                                      <div className="flex items-center text-white/80 text-sm">
                                        <div className="w-2 h-2 bg-green-400 rounded-full mr-2"></div>
                                        Remote Work Flexibility
                                      </div>
                                      <div className="flex items-center text-white/80 text-sm">
                                        <div className="w-2 h-2 bg-green-400 rounded-full mr-2"></div>
                                        $3,000 Learning Budget
                                      </div>
                                    </div>
                                    <h5 className="text-white font-semibold mb-2">Required Skills</h5>
                                    <div className="flex flex-wrap gap-2">
                                      {['React', 'TypeScript', 'Node.js', 'AWS', 'Docker'].map((skill, i) => (
                                        <span key={i} className="px-2 py-1 bg-blue-500/20 rounded text-blue-200 text-xs">
                                          {skill}
                                        </span>
                                      ))}
                                    </div>
                                  </motion.div>
                                )}
                              </AnimatePresence>
                            </div>
                          </div>
                        ) : (
                          <div className="p-6 h-full flex flex-col">
                            <div className="flex-shrink-0">
                              <div className="flex items-center mb-6">
                                <div className="w-20 h-20 rounded-full overflow-hidden mr-4">
                                  <img 
                                    src={demoCards[currentCardIndex].image}
                                    alt={demoCards[currentCardIndex].name}
                                    className="w-full h-full object-cover"
                                  />
                                </div>
                                <div>
                                  <div className="flex items-center mb-1">
                                    <h3 className="text-xl font-bold text-white mr-2">
                                      {demoCards[currentCardIndex].name}
                                    </h3>
                                    {demoCards[currentCardIndex].verified && (
                                      <Shield className="w-5 h-5 text-green-400" />
                                    )}
                                  </div>
                                  <p className="text-white/90 text-base">{demoCards[currentCardIndex].title}</p>
                                  <p className="text-white/70 text-sm">{demoCards[currentCardIndex].experience} experience</p>
                                </div>
                              </div>
                              <p className="text-white/70 mb-4 text-base">{demoCards[currentCardIndex].location}</p>
                              <div className="flex flex-wrap gap-2 mb-6">
                                {demoCards[currentCardIndex].skills?.map((skill, i) => (
                                  <span key={i} className="px-3 py-2 bg-white/20 rounded-full text-white text-sm">
                                    {skill}
                                  </span>
                                ))}
                              </div>
                            </div>

                            {/* Scrollable expanded content */}
                            <div className={`flex-1 ${isCardExpanded ? 'overflow-y-auto scrollbar-hide' : 'overflow-hidden'}`}>
                              {/* Tap to expand indicator */}
                              {!isCardExpanded && (
                                <div className="flex items-center justify-center text-white/50 text-xs">
                                  <span>Tap to see resume details</span>
                                </div>
                              )}

                              {/* Expanded Content */}
                              <AnimatePresence>
                                {isCardExpanded && (
                                  <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    exit={{ opacity: 0, height: 0 }}
                                    className="pt-4 border-t border-white/20"
                                  >
                                    <h5 className="text-white font-semibold mb-3">Resume Summary</h5>
                                    <p className="text-white/80 text-sm mb-4 leading-relaxed">
                                      Experienced frontend developer with a passion for creating intuitive user interfaces. 
                                      Led multiple successful product launches and mentored junior developers. 
                                      Strong background in React ecosystem and modern web technologies.
                                    </p>
                                    
                                    <h5 className="text-white font-semibold mb-2">Recent Experience</h5>
                                    <div className="space-y-3 mb-4">
                                      <div className="text-sm">
                                        <div className="text-white/90 font-medium">Senior Frontend Developer</div>
                                        <div className="text-white/70">TechCorp Inc. • 2022-2024</div>
                                        <div className="text-white/60 text-xs mt-1">Led frontend architecture for 3 major products</div>
                                      </div>
                                      <div className="text-sm">
                                        <div className="text-white/90 font-medium">Frontend Developer</div>
                                        <div className="text-white/70">StartupXYZ • 2020-2022</div>
                                        <div className="text-white/60 text-xs mt-1">Built responsive web applications from scratch</div>
                                      </div>
                                    </div>
                                    
                                    <h5 className="text-white font-semibold mb-2">Education</h5>
                                    <div className="text-sm text-white/80">
                                      <div>B.S. Computer Science</div>
                                      <div className="text-white/60">University of Technology • 2020</div>
                                    </div>
                                  </motion.div>
                                )}
                              </AnimatePresence>
                            </div>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}
                </div>

                {/* Swipe Actions - Removed for cleaner interface */}

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
