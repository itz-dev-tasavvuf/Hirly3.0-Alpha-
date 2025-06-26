import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform, useSpring } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { toast } from '@/components/ui/use-toast';
import { X, Heart, RotateCcw, RefreshCw, ArrowLeft, Briefcase, MapPin, DollarSign, Clock, Users, Award, BookOpen, Building, CheckCircle, Info } from 'lucide-react';
import { cn } from '@/lib/utils';

// Confetti Effect Component
const ConfettiEffect = ({ show, onComplete }) => {
  const [particles, setParticles] = useState([]);

  useEffect(() => {
    if (!show) return;

    // Create particles that spread across the entire screen
    const screenWidth = window.innerWidth;
    const screenHeight = window.innerHeight;
    
    const newParticles = Array.from({ length: 80 }, (_, i) => {
      // Create particles from different starting positions across the top
      const startX = (i / 80) * screenWidth + Math.random() * (screenWidth / 80);
      const startY = -Math.random() * 100 - 20; // Start above screen
      
      return {
        id: i,
        x: startX,
        y: startY,
        vx: (Math.random() - 0.5) * 12, // Horizontal velocity
        vy: Math.random() * 8 + 4, // Downward velocity
        gravity: 0.3 + Math.random() * 0.2, // Gravity effect
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 10,
        color: [
          '#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', 
          '#ffeaa7', '#dda0dd', '#ff9ff3', '#54a0ff',
          '#5f27cd', '#00d2d3', '#ff9f43', '#10ac84'
        ][Math.floor(Math.random() * 12)],
        size: Math.random() * 10 + 6,
        shape: Math.random() > 0.5 ? 'circle' : 'square',
      };
    });

    setParticles(newParticles);

    const timeout = setTimeout(() => {
      setParticles([]);
      if (onComplete) onComplete();
    }, 4000);

    return () => clearTimeout(timeout);
  }, [show, onComplete]);

  if (!show || particles.length === 0) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute"
          style={{
            backgroundColor: particle.color,
            width: particle.size,
            height: particle.size,
            borderRadius: particle.shape === 'circle' ? '50%' : '2px',
          }}
          initial={{
            x: particle.x,
            y: particle.y,
            rotate: particle.rotation,
            opacity: 1,
          }}
          animate={{
            x: particle.x + particle.vx * 50,
            y: window.innerHeight + 100,
            rotate: particle.rotation + particle.rotationSpeed * 20,
            opacity: [1, 1, 0.8, 0.4, 0],
          }}
          transition={{
            duration: 4,
            ease: "easeOut",
            times: [0, 0.3, 0.6, 0.8, 1],
          }}
        />
      ))}
      
      {/* Additional burst from center */}
      {particles.length > 0 && (
        <>
          {Array.from({ length: 30 }, (_, i) => {
            const angle = (i / 30) * Math.PI * 2;
            const velocity = 200 + Math.random() * 100;
            return (
              <motion.div
                key={`burst-${i}`}
                className="absolute w-3 h-3 rounded-full"
                style={{
                  backgroundColor: [
                    '#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', 
                    '#ffeaa7', '#dda0dd', '#ff9ff3', '#54a0ff'
                  ][Math.floor(Math.random() * 8)],
                }}
                initial={{
                  x: window.innerWidth / 2,
                  y: window.innerHeight / 2,
                  scale: 0,
                  opacity: 1,
                }}
                animate={{
                  x: window.innerWidth / 2 + Math.cos(angle) * velocity,
                  y: window.innerHeight / 2 + Math.sin(angle) * velocity,
                  scale: [0, 1, 1, 0],
                  opacity: [1, 1, 0.5, 0],
                }}
                transition={{
                  duration: 2,
                  ease: "easeOut",
                  times: [0, 0.2, 0.8, 1],
                }}
              />
            );
          })}
        </>
      )}
    </div>
  );
};

const generateMatchPercentage = () => Math.floor(Math.random() * 51) + 50; // 50-100%

const getMatchColor = (percentage) => {
  if (percentage >= 90) return { bg: 'bg-green-500/10', border: 'border-green-500', text: 'text-green-500' };
  if (percentage >= 75) return { bg: 'bg-yellow-500/10', border: 'border-yellow-500', text: 'text-yellow-500' };
  return { bg: 'bg-red-500/10', border: 'border-red-500', text: 'text-red-500' };
};

const DraggableCardBody = ({ item, userType, expanded, setExpanded, onSwipe, dragX, onCollapse }) => {
  const cardType = userType === 'candidate' ? 'job' : 'candidate';

  const cardRef = React.useRef(null);

  React.useEffect(() => {
    if (!expanded) return;
    const handleClickOutside = (e) => {
      if (cardRef.current && !cardRef.current.contains(e.target)) {
        if (onCollapse) onCollapse();
        setExpanded(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [expanded, onCollapse, setExpanded]);

  const opacity = useTransform(dragX, [-150, 0, 150], [0.5, 1, 0.5]);
  const scale = useTransform(dragX, [-200, 0, 200], [0.8, 1, 0.8]);
  const rotateVal = useTransform(dragX, [-200, 0, 200], [-25, 0, 25], { clamp: false });

  const matchPercentage = item.matchPercentage || generateMatchPercentage(); // Use existing or generate
  const matchColor = getMatchColor(matchPercentage);

  const cardContent = () => {
    if (cardType === 'job') {
      return (
        <div className="h-full flex flex-col">
          <CardHeader className="p-4 pt-8 flex-shrink-0">
            <div className="flex items-start space-x-4">
              <div className="relative">
                <Avatar className="w-16 h-16 rounded-xl border-2 border-purple-400/50 shadow-lg">
                  <AvatarImage src={item.logo || `https://avatar.vercel.sh/${item.company}.png?text=${item.company[0]}`} alt={item.company} />
                  <AvatarFallback className="bg-gradient-to-br from-purple-500 to-pink-500 text-white font-bold">
                    {item.company.substring(0, 2)}
                  </AvatarFallback>
                </Avatar>
                {/* Verified badge */}
                <div className="absolute -top-1 -right-1 bg-green-500 rounded-full p-1">
                  <CheckCircle size={12} className="text-white" />
                </div>
              </div>
              <div className="flex-1">
                <CardTitle className="text-xl font-bold text-white mb-1">{item.title}</CardTitle>
                <CardDescription className="text-purple-300 font-medium flex items-center gap-1">
                  <Building size={14} />
                  {item.company}
                </CardDescription>
                {/* Job type badge */}
                <div className="mt-2 flex gap-2">
                  <span className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-400/30 text-purple-300 text-xs px-2 py-1 rounded-full">
                    {item.type}
                  </span>
                  {item.remote && (
                    <span className="bg-gradient-to-r from-green-500/20 to-blue-500/20 border border-green-400/30 text-green-300 text-xs px-2 py-1 rounded-full">
                      Remote
                    </span>
                  )}
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent className={cn("p-4 space-y-3 text-sm flex-1", expanded ? "overflow-y-auto invisible-scrollbar" : "")}>
            <div className="grid grid-cols-1 gap-2">
              <div className="flex items-center text-gray-300 bg-white/5 rounded-lg p-2">
                <MapPin size={16} className="mr-2 text-purple-400 flex-shrink-0" /> 
                <span className="truncate">{item.location}</span>
              </div>
              {item.salary && (
                <div className="flex items-center text-gray-300 bg-white/5 rounded-lg p-2">
                  <DollarSign size={16} className="mr-2 text-green-400 flex-shrink-0" /> 
                  <span className="font-medium text-green-300">{item.salary}</span>
                </div>
              )}
              <div className="flex items-center text-gray-300 bg-white/5 rounded-lg p-2">
                <Clock size={16} className="mr-2 text-blue-400 flex-shrink-0" /> 
                <span>Posted {item.posted}</span>
              </div>
            </div>
            
            {expanded && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }} 
                animate={{ opacity: 1, height: 'auto' }} 
                exit={{ opacity: 0, height: 0 }}
                className="space-y-4 pt-4 border-t border-white/10"
              >
                <div>
                  <h4 className="font-semibold text-purple-300 mb-2 flex items-center gap-2">
                    <BookOpen size={16} />
                    Requirements
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {item.requirements.map(req => (
                      <span key={req} className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-400/30 text-blue-300 text-xs px-2 py-1 rounded-full">
                        {req}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold text-purple-300 mb-2 flex items-center gap-2">
                    <Info size={16} />
                    Description
                  </h4>
                  <p className="text-gray-300 text-sm leading-relaxed bg-white/5 rounded-lg p-3">{item.description}</p>
                </div>
                {item.benefits && item.benefits.length > 0 && (
                  <div>
                    <h4 className="font-semibold text-purple-300 mb-2 flex items-center gap-2">
                      <Award size={16} />
                      Benefits
                    </h4>
                    <ul className="space-y-2">
                      {item.benefits.map(benefit => (
                        <li key={benefit} className="text-sm text-gray-300 flex items-start gap-2">
                          <CheckCircle size={14} className="text-green-400 mt-0.5 flex-shrink-0" />
                          {benefit}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                <div className="pb-4"></div>
              </motion.div>
            )}
          </CardContent>
        </div>
      );
    } else { // Candidate Card
      return (
        <div className="h-full flex flex-col">
          <CardHeader className="p-4 pt-8 items-center text-center flex-shrink-0">
            <div className="relative mb-3">
              <Avatar className="w-24 h-24 rounded-full border-4 border-purple-400/50 shadow-lg">
                <AvatarImage src={item.avatarSrc || `https://avatar.vercel.sh/${item.name}.png`} alt={item.name} />
                <AvatarFallback className="bg-gradient-to-br from-purple-500 to-pink-500 text-white font-bold text-lg">
                  {item.name.substring(0, 2)}
                </AvatarFallback>
              </Avatar>
              {/* Online status indicator */}
              <div className="absolute bottom-2 right-2 bg-green-500 border-2 border-white rounded-full w-6 h-6 flex items-center justify-center">
                <div className="w-2 h-2 bg-white rounded-full"></div>
              </div>
            </div>
            <CardTitle className="text-xl font-bold text-white mb-1">{item.name}</CardTitle>
            <CardDescription className="text-purple-300 font-medium">{item.title}</CardDescription>
            {/* Skills preview badges */}
            <div className="flex flex-wrap gap-1 mt-2 justify-center">
              {item.skills.slice(0, 2).map(skill => (
                <span key={skill} className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-400/30 text-blue-300 text-xs px-2 py-1 rounded-full">
                  {skill}
                </span>
              ))}
              {item.skills.length > 2 && (
                <span className="bg-gradient-to-r from-gray-500/20 to-gray-600/20 border border-gray-400/30 text-gray-300 text-xs px-2 py-1 rounded-full">
                  +{item.skills.length - 2}
                </span>
              )}
            </div>
          </CardHeader>
          <CardContent className={cn("p-4 space-y-3 text-sm flex-1", expanded ? "overflow-y-auto invisible-scrollbar" : "")}>
            <div className="grid grid-cols-1 gap-2">
              <div className="flex items-center text-gray-300 bg-white/5 rounded-lg p-2">
                <Award size={16} className="mr-2 text-yellow-400 flex-shrink-0" /> 
                <span>{item.experience} experience</span>
              </div>
              <div className="flex items-center text-gray-300 bg-white/5 rounded-lg p-2">
                <MapPin size={16} className="mr-2 text-purple-400 flex-shrink-0" /> 
                <span className="truncate">{item.location}</span>
              </div>
              {item.salary && (
                <div className="flex items-center text-gray-300 bg-white/5 rounded-lg p-2">
                  <DollarSign size={16} className="mr-2 text-green-400 flex-shrink-0" /> 
                  <span className="font-medium text-green-300">Expected: {item.salary}</span>
                </div>
              )}
            </div>
            
            {expanded && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }} 
                animate={{ opacity: 1, height: 'auto' }} 
                exit={{ opacity: 0, height: 0 }}
                className="space-y-4 pt-4 border-t border-white/10"
              >
                <div>
                  <h4 className="font-semibold text-purple-300 mb-2 flex items-center gap-2">
                    <Users size={16} />
                    All Skills
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {item.skills.map(skill => (
                      <span key={skill} className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-400/30 text-blue-300 text-xs px-2 py-1 rounded-full">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold text-purple-300 mb-2 flex items-center gap-2">
                    <Info size={16} />
                    Summary
                  </h4>
                  <p className="text-gray-300 text-sm leading-relaxed bg-white/5 rounded-lg p-3">{item.description}</p>
                </div>
                {item.resume?.experience && (
                  <div>
                    <h4 className="font-semibold text-purple-300 mb-2 flex items-center gap-2">
                      <Briefcase size={16} />
                      Recent Experience
                    </h4>
                    {item.resume.experience.slice(0, 2).map((exp, i) => (
                      <div key={i} className="text-sm text-gray-300 bg-white/5 rounded-lg p-3 mb-2">
                        <p className="font-medium text-white">{exp.title}</p>
                        <p className="text-purple-300 flex items-center gap-1">
                          <Building size={12} />
                          {exp.company}
                        </p>
                        <p className="text-gray-400 text-xs">{exp.duration}</p>
                      </div>
                    ))}
                  </div>
                )}
                {item.resume?.education && (
                  <div>
                    <h4 className="font-semibold text-purple-300 mb-2 flex items-center gap-2">
                      <BookOpen size={16} />
                      Education
                    </h4>
                    <div className="text-sm text-gray-300 bg-white/5 rounded-lg p-3">
                      <p className="font-medium text-white">{item.resume.education.degree}</p>
                      <p className="text-purple-300">{item.resume.education.school}</p>
                      <p className="text-gray-400 text-xs">{item.resume.education.duration}</p>
                    </div>
                  </div>
                )}
                <div className="pb-4"></div>
              </motion.div>
            )}
          </CardContent>
        </div>
      );
    }
  };

  return (
    <motion.div
      ref={cardRef}
      className={cn(
        "w-[340px] h-[480px] rounded-2xl shadow-2xl cursor-grab overflow-hidden relative",
        "backdrop-blur-md border-2 text-white",
        "bg-gradient-to-br from-purple-900/40 via-blue-900/40 to-pink-900/40",
        "shadow-[0_20px_50px_rgba(0,0,0,0.4)]",
        "hover:shadow-[0_25px_60px_rgba(0,0,0,0.5)]",
        "transition-shadow duration-300",
        matchColor.border
      )}
      style={{ 
        x: dragX, 
        rotate: rotateVal, 
        opacity, 
        scale,
        boxShadow: "0 20px 50px rgba(0,0,0,0.4), 0 0 0 1px rgba(255,255,255,0.1) inset"
      }}
      drag={!expanded ? "x" : false}
      dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
      onDragEnd={(_event, info) => {
        if (Math.abs(info.offset.x) > 100) {
          onSwipe(info.offset.x > 0 ? 'right' : 'left');
        } else {
          dragX.set(0); 
        }
      }}
      onClick={() => !expanded && setExpanded(true)}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
    >
      {/* Match percentage badge with improved styling */}
      <div className={cn(
        "absolute top-3 right-3 px-3 py-1.5 rounded-full text-xs font-bold z-10",
        "backdrop-blur-sm border shadow-lg",
        "bg-gradient-to-r from-white/20 to-white/10",
        matchColor.text,
        matchColor.border
      )}>
        <span className="flex items-center gap-1">
          <CheckCircle size={12} />
          {matchPercentage}%
        </span>
      </div>
      
      {/* Glassmorphic overlay for better content readability */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />
      
      <div className="relative z-10 h-full">
        {cardContent()}
      </div>
      
      {expanded && (
        <div className="absolute top-3 left-3 z-20">
          <div className="bg-black/60 backdrop-blur-sm rounded-full px-3 py-1.5 border border-white/20">
            <p className="text-white text-xs flex items-center gap-1">
              <Info size={12} />
              Tap outside to collapse
            </p>
          </div>
        </div>
      )}
    </motion.div>
  );
};

const DraggableCardContainer = ({ items, userType, onSwipeEnd, onReset, onCollapse, onMatch }) => {
  // Keyboard navigation state
  const [keyboardActive, setKeyboardActive] = useState(true);

  const [stack, setStack] = useState(
    items.slice(0, 5).map(item => ({...item, matchPercentage: generateMatchPercentage() }))
  );
  const [expanded, setExpanded] = useState(false);
  const [interested, setInterested] = useState([]);
  const [rejected, setRejected] = useState([]);
  const [lastDismissed, setLastDismissed] = useState(null);

  const topCardDragX = useMotionValue(0);
  const topCardSpringX = useSpring(topCardDragX, { stiffness: 300, damping: 50 });

  const leftIconScale = useTransform(topCardDragX, [-150, 0], [1.8, 1]);
  const rightIconScale = useTransform(topCardDragX, [0, 150], [1, 1.8]);
  const leftIconOpacity = useTransform(topCardDragX, [-50, 0], [1, 0]);
  const rightIconOpacity = useTransform(topCardDragX, [0, 50], [0, 1]);

  const handleSwipe = (direction) => {
    if (expanded || stack.length === 0) return;
    const dismissedItem = stack[stack.length - 1];
    setLastDismissed({ item: dismissedItem, direction });

    if (direction === 'right') {
      toast({ title: "Interested!", description: `You liked ${dismissedItem.name || dismissedItem.title}`, variant: "default" });
      if (Math.random() < 0.33) {
        setInterested(prev => [...prev, dismissedItem]);
        if (onMatch) onMatch(dismissedItem);
      }
    } else {
      setRejected(prev => [...prev, dismissedItem]);
      toast({ title: "Passed", description: `You passed on ${dismissedItem.name || dismissedItem.title}`, variant: "destructive" });
    }
    
    setStack(prev => {
      const newStack = prev.slice(0, -1);
      const nextItemIndex = items.findIndex(item => !newStack.find(s => s.id === item.id) && !interested.find(i => i.id === item.id) && !rejected.find(r => r.id === item.id) && item.id !== dismissedItem.id);
      if (newStack.length < 5 && nextItemIndex !== -1 && (items.length - (interested.length + rejected.length + 1)) > newStack.length) {
          const newItem = items[items.length - 1 - (interested.length + rejected.length)]; 
          if (newItem && !newStack.find(s => s.id === newItem.id)) { 
            return [{...newItem, matchPercentage: generateMatchPercentage()}, ...newStack];
          }
      }
      return newStack;
    });
    topCardDragX.set(0); 
  };

  const handleResetStack = () => {
    setStack(items.slice(0, 5).map(item => ({...item, matchPercentage: generateMatchPercentage() })));
    setInterested([]);
    setRejected([]);
    setLastDismissed(null);
    setExpanded(false);
    topCardDragX.set(0);
    toast({ title: "Stack Reset!", description: "All cards are back." });
    if(onReset) onReset();
  };

  const handleCardAreaClick = (e) => {
    // If clicked inside the card area, prevent collapsing
    e.stopPropagation();
  };

  const handleBackdropClick = () => {
    if (expanded) {
      setExpanded(false);
    }
    // Removed automatic collapse - only close via back button
  };

  useEffect(() => {
    if (stack.length === 0 && (interested.length + rejected.length === items.length)) {
      if(onSwipeEnd) onSwipeEnd({ interested, rejected });
    }
  }, [stack, interested, rejected, items.length, onSwipeEnd]);

  // Keyboard navigation for swiping
  useEffect(() => {
    if (!keyboardActive || expanded || stack.length === 0) return;
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowLeft') {
        handleSwipe('left');
        toast({ title: 'Passed (Keyboard)', description: 'You passed using the left arrow key.', variant: 'destructive' });
      } else if (e.key === 'ArrowRight') {
        handleSwipe('right');
        toast({ title: 'Interested (Keyboard)', description: 'You liked using the right arrow key.', variant: 'default' });
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [keyboardActive, expanded, stack.length]);
  
  const staticMotionValue = useMotionValue(0);

  return (
    <div className="w-full h-full flex flex-col items-center justify-center relative pt-16" onClick={handleBackdropClick}>
      {/* Back button */}
      <div className="absolute top-4 left-4 z-30">
        <Button variant="ghost" size="icon" onClick={(e) => { e.stopPropagation(); onCollapse(); }} className="text-white bg-black/30 hover:bg-black/50 rounded-full w-11 h-11">
          <ArrowLeft size={24} />
        </Button>
      </div>
      
      {/* Cards container - centered with fixed dimensions and moved down */}
      <div className="relative w-[340px] h-[480px] flex items-center justify-center" onClick={handleCardAreaClick}>
        <AnimatePresence>
          {stack.map((item, index) => {
            const isTopCard = index === stack.length - 1;
            return (
              <motion.div
                key={item.id || item.title} 
                style={{
                  position: 'absolute',
                  zIndex: index,
                }}
                initial={{ opacity: 0, scale: 0.9, y: index * -8, rotate: (Math.random() - 0.5) * 10 - (index * 2) }}
                animate={{ 
                  opacity: 1, 
                  scale: 1 - (stack.length - 1 - index) * 0.03, 
                  y: index * -8,
                  rotate: (isTopCard && !expanded) ? 0 : ((Math.random() - 0.5) * 10 - (index * 2))
                }}
                exit={{ 
                  x: topCardDragX.get() > 0 ? 300 : -300, 
                  opacity: 0, 
                  scale: 0.8, 
                  transition: { duration: 0.3 } 
                }}
                transition={{ type: "spring", stiffness: 200, damping: 25 }}
              >
                <DraggableCardBody 
                  item={item} 
                  userType={userType} 
                  expanded={isTopCard && expanded} 
                  setExpanded={isTopCard ? setExpanded : () => {}}
                  onSwipe={handleSwipe} 
                  dragX={isTopCard ? topCardSpringX : staticMotionValue} 
                />
              </motion.div>
            );
          })}
        </AnimatePresence>

        {/* Swipe direction indicators */}
        {stack.length > 0 && !expanded && (
          <>
            <motion.div style={{ scale: leftIconScale, opacity: leftIconOpacity }} className="absolute left-[-60px] top-1/2 -translate-y-1/2 p-3 bg-red-500/80 rounded-full shadow-lg">
              <X size={32} className="text-white" />
            </motion.div>
            <motion.div style={{ scale: rightIconScale, opacity: rightIconOpacity }} className="absolute right-[-60px] top-1/2 -translate-y-1/2 p-3 bg-green-500/80 rounded-full shadow-lg">
              <Heart size={32} className="text-white" />
            </motion.div>
          </>
        )}
      </div>

      {/* Stack completion state */}
      {stack.length === 0 && (
        <div className="absolute inset-0 flex flex-col items-center justify-center z-20">
          <div className="text-center p-8 glass-effect rounded-xl" onClick={handleCardAreaClick}>
            <CheckCircle size={64} className="mx-auto text-green-400 mb-4" />
            <h3 className="text-2xl font-bold text-white mb-2">All Swiped!</h3>
            <p className="text-gray-300 mb-1">Interested: {interested.length}</p>
            <p className="text-gray-300 mb-4">Rejected: {rejected.length}</p>
            <Button onClick={(e) => { e.stopPropagation(); handleResetStack(); }} className="bg-gradient-to-r from-purple-600 to-pink-600 text-white">
              <RefreshCw size={18} className="mr-2" /> Reset Stack
            </Button>
          </div>
        </div>
      )}

      {/* Reset button */}
      <div className="absolute bottom-4 right-4 z-30">
        <Button variant="ghost" size="icon" onClick={(e) => { e.stopPropagation(); handleResetStack(); }} className="text-white bg-black/30 hover:bg-black/50 rounded-full w-11 h-11">
          <RefreshCw size={20} />
        </Button>
      </div>

      {/* Status info */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-30 text-center">
        <p className="text-xs text-gray-400">Interested: {interested.length} | Rejected: {rejected.length} | Remaining: {items.length - (interested.length + rejected.length)}</p>
        <p className="text-xs text-gray-500 mt-1">Tap card to expand. Drag left/right to decide.</p>
      </div>
    </div>
  );
};


const SwipeApp = ({ onCollapse, userType, contentType, candidateProfiles = [], jobListings = [], onMatch }) => {
  const [showConfetti, setShowConfetti] = useState(false);
  
  const itemsToSwipe = useMemo(() => 
    (contentType === 'jobs' ? jobListings : candidateProfiles).map(item => ({
      ...item,
      matchPercentage: generateMatchPercentage() 
    })), 
  [contentType, jobListings, candidateProfiles]);

  const handleMatch = (item) => {
    setShowConfetti(true);
    toast({
      title: "🎉 It's a Match!",
      description: `You matched with ${item.name || item.title}!`,
      variant: "default",
    });
    if (onMatch) onMatch(item);
  };

  const handleSwipeEnd = (stats) => {
    toast({
      title: "Swiping Complete!",
      description: `You showed interest in ${stats.interested.length} and passed on ${stats.rejected.length}.`,
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.3, type: "spring", stiffness:120, damping:18 }}
      className="fixed inset-0 z-40 bg-black/70 backdrop-blur-lg"
    >
      <ConfettiEffect 
        show={showConfetti} 
        onComplete={() => setShowConfetti(false)} 
      />
      <div className="w-full h-full">
        <DraggableCardContainer
          items={itemsToSwipe}
          userType={userType}
          onSwipeEnd={handleSwipeEnd}
          onCollapse={onCollapse}
          onMatch={handleMatch}
        />
      </div>
    </motion.div>
  );
};

export default SwipeApp;