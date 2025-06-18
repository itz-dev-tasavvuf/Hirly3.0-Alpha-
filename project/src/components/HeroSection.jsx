import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import algorandFullLogoWhite from '@/assets/algorand_full_logo_white.png';
import { ArrowRight } from 'lucide-react';
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
  className="flex justify-center lg:justify-start"
>
  <Button
    onClick={() => window.location.href = '/signup'}
    size="lg"
    className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold px-10 py-5 rounded-2xl glow-effect text-xl shadow-lg"
  >
    Get Started
    <ArrowRight className="ml-3 w-6 h-6" />
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
              {/* Swipable Card Stack Demo */}
              {(() => {
                const cardData = [
                  {
                    initials: 'JS',
                    name: 'Jane Smith',
                    role: 'Senior Developer',
                    desc: 'Full-stack developer with 5+ years experience in React, Node.js, and cloud technologies.',
                    tags: ['React', 'Node.js', 'AWS'],
                  },
                  {
                    initials: 'TM',
                    name: 'TechCorp',
                    role: 'Hiring Manager',
                    desc: 'Looking for talented developers to join our growing team. Remote-friendly culture.',
                    tags: ['Remote', 'Full-time', '$120k'],
                  },
                  {
                    initials: 'AL',
                    name: 'Alex Lee',
                    role: 'UI Designer',
                    desc: 'Creative designer passionate about user experience and modern interfaces.',
                    tags: ['Figma', 'UI/UX', 'Prototyping'],
                  },
                ];
                // Add state at the top of HeroSection:
                // const [cardIndex, setCardIndex] = React.useState(0);
                // We'll add this if not present.
                if (typeof window !== 'undefined' && !window.__heroCardIndexPatched) {
                  window.__heroCardIndexPatched = true;
                  if (!window.__heroCardIndex) window.__heroCardIndex = 0;
                }
                const [cardIndex, setCardIndex] = React.useState(window.__heroCardIndex || 0);
                React.useEffect(() => { window.__heroCardIndex = cardIndex; }, [cardIndex]);
                // Handle swipe (direction: 'left' or 'right')
                const [swipeDir, setSwipeDir] = React.useState(null);
                const [animating, setAnimating] = React.useState(false);
                const handleSwipe = (dir) => {
                  if (animating) return;
                  setSwipeDir(dir);
                  setAnimating(true);
                  setTimeout(() => {
                    setSwipeDir(null);
                    setAnimating(false);
                    setCardIndex((prev) => (prev + 1) % cardData.length);
                  }, 350);
                };
                // Keyboard navigation (optional demo)
                React.useEffect(() => {
                  const onKey = (e) => {
                    if (e.key === 'ArrowLeft') handleSwipe('left');
                    if (e.key === 'ArrowRight') handleSwipe('right');
                  };
                  window.addEventListener('keydown', onKey);
                  return () => window.removeEventListener('keydown', onKey);
                }, [animating]);
                // Only show top 3 cards for stacking effect
                const stack = [0, 1, 2].map(i => cardData[(cardIndex + i) % cardData.length]);
                // AnimatePresence for correct exit/enter
                return (
                  <AnimatePresence initial={false} mode="popLayout">
                    {stack.map((card, i) => (
                      <motion.div
                        key={card.initials + '-' + ((cardIndex + i) % cardData.length)}
                        layout
                        initial={{ opacity: 0, scale: 0.8, rotate: -10, x: i === 0 ? 0 : i === 1 ? -20 : -40, y: i === 0 ? 0 : i === 1 ? 20 : 40 }}
                        animate={{
                          opacity: 1,
                          scale: 1,
                          rotate: i === 0 ? 0 : i === 1 ? -5 : -10,
                          x: i === 0 ? 0 : i === 1 ? -20 : -40,
                          y: i === 0 ? 0 : i === 1 ? 20 : 40,
                        }}
                        exit={i === 0 && swipeDir ? {
                          opacity: 0,
                          x: swipeDir === 'left' ? -400 : 400,
                          transition: { duration: 0.35 }
                        } : {}}
                        transition={{ duration: 0.6, delay: 0.5 + (i + 1) * 0.2 }}
                        className={`absolute inset-0 swipe-card glass-effect rounded-2xl p-6 ${i === 0 ? 'z-30' : i === 1 ? 'z-20' : 'z-10'}`}
                        style={{
                          background: i === 0
                            ? 'linear-gradient(135deg, rgba(168, 85, 247, 0.2) 0%, rgba(236, 72, 153, 0.2) 100%)'
                            : 'rgba(255, 255, 255, 0.05)'
                        }}
                      >
                        <div className="h-full flex flex-col">
                          <div className="flex items-center mb-4">
                            <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                              <span className="text-white font-bold">{card.initials}</span>
                            </div>
                            <div className="ml-3">
                              <p className="text-white font-semibold">{card.name}</p>
                              <p className="text-gray-400 text-sm">{card.role}</p>
                            </div>
                          </div>
                          <div className="flex-1">
                            <p className="text-gray-300 text-sm mb-4">{card.desc}</p>
                            <div className="flex flex-wrap gap-2 mb-4">
                              {card.tags.map((tag) => (
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
                            <button
                              className="w-12 h-12 bg-red-500/20 rounded-full flex items-center justify-center focus:outline-none"
                              aria-label="Pass"
                              tabIndex={i === 0 ? 0 : -1}
                              onClick={() => handleSwipe('left')}
                              disabled={animating || i !== 0}
                            >
                              <span className="text-red-400">✕</span>
                            </button>
                            <button
                              className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center focus:outline-none"
                              aria-label="Like"
                              tabIndex={i === 0 ? 0 : -1}
                              onClick={() => handleSwipe('right')}
                              disabled={animating || i !== 0}
                            >
                              <span className="text-green-400">♥</span>
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                );
              })()}

            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
