import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform, useSpring } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { toast } from '@/components/ui/use-toast';
import { X, Heart, RotateCcw, RefreshCw, ArrowLeft, Briefcase, MapPin, DollarSign, Clock, Users, Award, BookOpen, Building, CheckCircle, Info } from 'lucide-react';
import { cn } from '@/lib/utils';

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
              <Avatar className="w-16 h-16 rounded-lg border-2 border-purple-500/50">
                <AvatarImage src={item.logo || `https://avatar.vercel.sh/${item.company}.png?text=${item.company[0]}`} alt={item.company} />
                <AvatarFallback>{item.company.substring(0, 2)}</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <CardTitle className="text-xl font-bold text-white">{item.title}</CardTitle>
                <CardDescription className="text-purple-300">{item.company}</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className={cn("p-4 space-y-3 text-sm flex-1", expanded ? "overflow-y-auto invisible-scrollbar" : "")}>
            <div className="flex items-center text-gray-300"><MapPin size={16} className="mr-2 text-purple-400" /> {item.location}</div>
            <div className="flex items-center text-gray-300"><Briefcase size={16} className="mr-2 text-purple-400" /> {item.type}</div>
            {item.salary && <div className="flex items-center text-gray-300"><DollarSign size={16} className="mr-2 text-purple-400" /> {item.salary}</div>}
            <div className="flex items-center text-gray-300"><Clock size={16} className="mr-2 text-purple-400" /> Posted {item.posted}</div>
            
            {expanded && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }} 
                animate={{ opacity: 1, height: 'auto' }} 
                exit={{ opacity: 0, height: 0 }}
                className="space-y-3 pt-3 border-t border-white/10"
              >
                <div>
                  <h4 className="font-semibold text-purple-300 mb-1">Requirements:</h4>
                  <div className="flex flex-wrap gap-2">
                    {item.requirements.map(req => <span key={req} className="bg-white/10 text-xs px-2 py-1 rounded-full">{req}</span>)}
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold text-purple-300 mb-1">Description:</h4>
                  <p className="text-gray-300 text-xs leading-relaxed">{item.description}</p>
                </div>
                {item.benefits && item.benefits.length > 0 && (
                  <div>
                    <h4 className="font-semibold text-purple-300 mb-1">Benefits:</h4>
                    <ul className="list-disc list-inside text-xs text-gray-300 space-y-1">
                      {item.benefits.map(benefit => <li key={benefit}>{benefit}</li>)}
                    </ul>
                  </div>
                )}
                <div className="pb-4"> {/* Extra padding for better scrolling */}
                </div>
              </motion.div>
            )}
          </CardContent>
        </div>
      );
    } else { // Candidate Card
      return (
        <div className="h-full flex flex-col">
          <CardHeader className="p-4 pt-8 items-center text-center flex-shrink-0">
            <Avatar className="w-24 h-24 rounded-full border-4 border-purple-500/50 mb-2">
              <AvatarImage src={item.avatarSrc || `https://avatar.vercel.sh/${item.name}.png`} alt={item.name} />
              <AvatarFallback>{item.name.substring(0, 2)}</AvatarFallback>
            </Avatar>
            <CardTitle className="text-xl font-bold text-white">{item.name}</CardTitle>
            <CardDescription className="text-purple-300">{item.title}</CardDescription>
          </CardHeader>
          <CardContent className={cn("p-4 space-y-3 text-sm flex-1", expanded ? "overflow-y-auto invisible-scrollbar" : "")}>
            <div className="flex items-center text-gray-300"><Users size={16} className="mr-2 text-purple-400" /> Skills: {item.skills.slice(0,3).join(', ')}{item.skills.length > 3 ? '...' : ''}</div>
            <div className="flex items-center text-gray-300"><Award size={16} className="mr-2 text-purple-400" /> {item.experience} experience</div>
            <div className="flex items-center text-gray-300"><MapPin size={16} className="mr-2 text-purple-400" /> {item.location}</div>
            {item.salary && <div className="flex items-center text-gray-300"><DollarSign size={16} className="mr-2 text-purple-400" /> Expected: {item.salary}</div>}
            
            {expanded && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }} 
                animate={{ opacity: 1, height: 'auto' }} 
                exit={{ opacity: 0, height: 0 }}
                className="space-y-3 pt-3 border-t border-white/10"
              >
                <div>
                  <h4 className="font-semibold text-purple-300 mb-1">Summary:</h4>
                  <p className="text-gray-300 text-xs leading-relaxed">{item.description}</p>
                </div>
                {item.resume?.experience && (
                  <div>
                    <h4 className="font-semibold text-purple-300 mb-1">Recent Experience:</h4>
                    {item.resume.experience.slice(0,1).map((exp, i) => (
                      <div key={i} className="text-xs text-gray-300">
                        <p className="font-medium">{exp.title} @ {exp.company}</p>
                        <p className="opacity-70">{exp.duration}</p>
                      </div>
                    ))}
                  </div>
                )}
                 {item.resume?.education && (
                  <div>
                    <h4 className="font-semibold text-purple-300 mb-1">Education:</h4>
                     <div className="text-xs text-gray-300">
                        <p className="font-medium">{item.resume.education.degree} - {item.resume.education.school}</p>
                        <p className="opacity-70">{item.resume.education.duration}</p>
                      </div>
                  </div>
                )}
                <div className="pb-4"> {/* Extra padding for better scrolling */}
                </div>
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
        matchColor.bg, 
        matchColor.border
      )}
      style={{ 
        x: dragX, 
        rotate: rotateVal, 
        opacity, 
        scale,
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
      <div className={cn("absolute top-2 right-2 bg-white/90 px-2 py-1 rounded-full text-xs font-bold z-10", matchColor.text)}>
        {matchPercentage}%
      </div>
      {cardContent()}
      {expanded && (
        <div className="absolute top-2 left-2 z-20">
          <div className="bg-black/50 rounded-full px-3 py-1">
            <p className="text-white text-xs">Tap outside to collapse</p>
          </div>
        </div>
      )}
    </motion.div>
  );
};

const DraggableCardContainer = ({ items, userType, onSwipeEnd, onReset, onCollapse, onMatch }) => {
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
    } else {
      onCollapse();
    }
  };

  useEffect(() => {
    if (stack.length === 0 && (interested.length + rejected.length === items.length)) {
      if(onSwipeEnd) onSwipeEnd({ interested, rejected });
    }
  }, [stack, interested, rejected, items.length, onSwipeEnd]);
  
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
  const itemsToSwipe = useMemo(() => 
    (contentType === 'jobs' ? jobListings : candidateProfiles).map(item => ({
      ...item,
      matchPercentage: generateMatchPercentage() 
    })), 
  [contentType, jobListings, candidateProfiles]);


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
      <div className="w-full h-full">
        <DraggableCardContainer
          items={itemsToSwipe}
          userType={userType}
          onSwipeEnd={handleSwipeEnd}
          onCollapse={onCollapse}
          onMatch={onMatch}
        />
      </div>
    </motion.div>
  );
};

export default SwipeApp;