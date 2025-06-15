import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { toast } from '@/components/ui/use-toast';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter
} from '@/components/ui/dialog';
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { ChevronDown, LogOut, User, Settings, MessageSquare, Briefcase, UserCheck as UserSearchIcon, BarChart3, PlusSquare, Building, Bot, MapPin, Award, Users, Bell, Shield, Palette, Globe, DollarSign, Clock, Upload, X, UserCheck } from 'lucide-react';
import algorandMark from '@/assets/algorand_logo_mark_white.png';
import MessagesModal from '@/components/hub/MessagesModal';
import SwipeApp from '@/components/hub/SwipeApp'; 
import QuickMessageModal from '@/components/hub/QuickMessageModal';

import { mockJobListings, mockCandidateProfiles } from '@/components/hub/swipeAppData';
import Orb from '@/components/Orb';
import algorandFullLogoWhite from '@/assets/algorand_full_logo_white.png';
import MetricDetailChart from '@/components/hub/MetricDetailChart';
import AI_Prompt from '@/components/AI_Prompt';
import VerifyCard from '@/components/hub/VerifyCard';


// Dashboard metrics config
const dashboardMetrics = [
  { label: "Applicants", value: 128, icon: <Users className="w-5 h-5 text-cyan-400" /> },
  { label: "Matches", value: 37, icon: <UserCheck className="w-5 h-5 text-green-400" /> },
  { label: "Interviews", value: 14, icon: <MessageSquare className="w-5 h-5 text-yellow-400" /> },
  { label: "Offers", value: 5, icon: <Award className="w-5 h-5 text-purple-400" /> },
  { label: "Hires", value: 3, icon: <Briefcase className="w-5 h-5 text-pink-400" /> },
  { label: "Avg. Time to Fill", value: "21d", icon: <Clock className="w-5 h-5 text-orange-400" /> },
];

// AnimatedMetric component for dashboard
const AnimatedMetric = ({ label, value, icon, delay }) => {
  const [displayValue, setDisplayValue] = React.useState(typeof value === 'number' ? 0 : value);
  React.useEffect(() => {
    if (typeof value === 'number') {
      let start = 0;
      const duration = 800;
      const step = Math.ceil(value / (duration / 16));
      let raf;
      const animate = () => {
        start += step;
        if (start >= value) {
          setDisplayValue(value);
        } else {
          setDisplayValue(start);
          raf = requestAnimationFrame(animate);
        }
      };
      const timeout = setTimeout(() => animate(), delay * 600);
      return () => {
        clearTimeout(timeout);
        cancelAnimationFrame(raf);
      };
    }
  }, [value, delay]);
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay, duration: 0.6 }} className="bg-white/10 rounded-lg p-4 flex flex-col items-center shadow-lg">
      <div className="mb-1">{icon}</div>
      <div className="text-2xl font-bold text-white">
        {typeof value === 'number' ? displayValue : value}
      </div>
      <div className="text-xs text-white/70 mt-1">{label}</div>
    </motion.div>
  );
};

const candidateMenuItems = [
  { id: 'jobs', title: 'Jobs', icon: Briefcase, description: "Browse job opportunities", gradient: "from-green-500 to-teal-500", action: 'openSwipeJobs' },
  { id: 'matches', title: 'Matches', icon: UserCheck, description: "Your matches with jobs", gradient: "from-green-400 to-blue-400" },
  { id: 'messages', title: 'Messages', icon: MessageSquare, description: "Chat with recruiters", gradient: "from-indigo-500 to-purple-500", action: 'openMessagesModal' },
  { id: 'profile', title: 'Profile', icon: User, description: "View and edit your profile", gradient: "from-purple-600 to-pink-600" },
  { id: 'verify_algorand', title: 'Verify with Algorand', icon: (props) => (<img src={algorandMark} alt="Algorand" className={props && props.className ? props.className : "w-8 h-8"} />), description: "Blockchain-based identity verification", gradient: "from-cyan-500 to-green-500", action: 'verifyAlgorand' },
  { id: 'settings', title: 'Settings', icon: Settings, description: "Adjust your preferences", gradient: "from-orange-500 to-red-500" },
  { id: 'coach', title: 'AI Coach', icon: Bot, description: "AI-powered career coaching", gradient: "from-blue-500 to-cyan-500", action: 'openAICoach' },
];

const employerMenuItems = [
  { id: 'candidates', title: 'Candidates', icon: UserSearchIcon, description: "Browse candidate profiles", gradient: "from-green-500 to-teal-500", action: 'openSwipeCandidates' },
  { id: 'matches', title: 'Matches', icon: UserCheck, description: "Your matches with candidates", gradient: "from-green-400 to-blue-400" },
  { id: 'messages', title: 'Messages', icon: MessageSquare, description: "Chat with candidates", gradient: "from-indigo-500 to-purple-500", action: 'openMessagesModal' },
  { id: 'dashboard', title: 'Dashboard', icon: BarChart3, description: "View hiring metrics", gradient: "from-blue-500 to-cyan-500" },
  { id: 'upload_jobs', title: 'Upload Jobs', icon: PlusSquare, description: "Add new job postings", gradient: "from-yellow-500 to-orange-500" },
  { id: 'company', title: 'Company', icon: Building, description: "Edit company profile", gradient: "from-purple-600 to-pink-600" },
  { id: 'verify_algorand', title: 'Verify with Algorand', icon: (props) => (<img src={algorandMark} alt="Algorand" className={props && props.className ? props.className : "w-8 h-8"} />), description: "Blockchain-based identity verification", gradient: "from-cyan-500 to-green-500", action: 'verifyAlgorand' },
  { id: 'settings', title: 'Settings', icon: Settings, description: "Adjust preferences", gradient: "from-orange-500 to-red-500" },
  { id: 'coach', title: 'AI Coach', icon: Bot, description: "AI-powered hiring coaching", gradient: "from-cyan-500 to-blue-600", action: 'openAICoach' },
];

const HubPage = () => {
  // Debug: log userType and userEmail
  console.log('HubPage userType:', sessionStorage.getItem('userType'));
  console.log('HubPage userEmail:', sessionStorage.getItem('userEmail'));

  // Fake match state
  const [matches, setMatches] = useState([]);
  const [swipeCount, setSwipeCount] = useState(0);
  const navigate = useNavigate();
  const [userType, setUserType] = useState(null);
  const [userEmail, setUserEmail] = useState('');
  const [menuItems, setMenuItems]  = useState([]);
  const [cards, setCards] = useState([]);
  const [flippedCardId, setFlippedCardId] = useState(null);
  // Quick Message modal state
  const [quickMessageModalOpen, setQuickMessageModalOpen] = useState(false);
  const [quickMessageRecipient, setQuickMessageRecipient] = useState(null);
  const [isNavMenuOpen, setIsNavMenuOpen] = useState(false); // New state for navigation menu
  const [genericModalOpen, setGenericModalOpen] = useState(false);
  const [messagesModalOpen, setMessagesModalOpen] = useState(false);
  const [prefilledMessageRecipient, setPrefilledMessageRecipient] = useState(null); // NEW: for prefill
  const [swipeAppOpen, setSwipeAppOpen] = useState(false);
  const [swipeAppContentType, setSwipeAppContentType] = useState(null); 
  const [modalContent, setModalContent] = useState({ title: '', description: '' });
  const [selectedMetric, setSelectedMetric] = useState(null);
  const [aiCoachOpen, setAiCoachOpen] = useState(false);
  // For match details popup
  const [selectedMatch, setSelectedMatch] = useState(null);
  
  // Job form state
  const [jobForm, setJobForm] = useState({
    title: '',
    location: '',
    jobType: 'Full-time',
    workSetup: 'Hybrid',
    salaryMin: '',
    salaryMax: '',
    description: '',
    requirements: '',
    benefits: ''
  });
  
  useEffect(() => {
    const storedUserType = sessionStorage.getItem('userType');
    const storedUserEmail = sessionStorage.getItem('userEmail');
    if (!storedUserType) {
      navigate('/login');
    } else {
      setUserType(storedUserType);
      setUserEmail(storedUserEmail || 'User');
      const items = storedUserType === 'candidate' ? candidateMenuItems : employerMenuItems;
      setMenuItems(items);
      setCards([...items].reverse()); 
    }
  }, [navigate]);
  
  const x = useMotionValue(0);
  const xSpring = useSpring(x, { stiffness: 300, damping: 50 });
  const rotate = useTransform(xSpring, [-150, 0, 150], [-25, 0, 25]);

  // Helper function to bring a card to the top of the stack
  const bringCardToTop = (cardId) => {
    setCards(prev => {
      const cardToMove = prev.find(card => card.id === cardId);
      const otherCards = prev.filter(card => card.id !== cardId);
      return [...otherCards, cardToMove]; // Move to end (top of visual stack)
    });
  };

  const handleCardClick = (item, fromNavMenu = false) => {
    // Close navigation menu when any item is clicked from nav menu
    if (fromNavMenu) {
      setIsNavMenuOpen(false);
    }

    // Handle flippable cards (profile, settings, company, upload_jobs, verify_algorand, dashboard)
    if (item.id === 'profile' || item.id === 'settings' || item.id === 'company' || item.id === 'upload_jobs' || item.id === 'verify_algorand' || item.id === 'dashboard' || item.id === 'matches') {
      if (fromNavMenu) {
        // When coming from nav menu, bring card to top and flip it
        bringCardToTop(item.id);
        setFlippedCardId(item.id);
      } else {
        // When clicking the actual card, toggle flip state
        setFlippedCardId(flippedCardId === item.id ? null : item.id);
      }
      return;
    }

    // Close navigation menu for other actions
    setIsNavMenuOpen(false);

    // Handle other cards with existing logic
    if (item.action === 'openMessagesModal') {
      setMessagesModalOpen(true);
    } else if (item.action === 'openSwipeJobs') {
      setSwipeAppContentType('jobs');
      setSwipeAppOpen(true);
    } else if (item.action === 'openSwipeCandidates') {
      setSwipeAppContentType('candidates');
      setSwipeAppOpen(true);
    } else if (item.action === 'openAICoach') {
      setAiCoachOpen(true);
    } else {
      setModalContent({ title: item.title, description: item.description });
      setGenericModalOpen(true);
    }
    toast({
      title: `${item.title} Clicked`,
      description: item.action ? `Opening ${item.title}...` : "🚧 This feature isn't implemented yet—but don't worry! You can request it in your next prompt! 🚀"
    });
  };

  // Swiping left advances, swiping right rewinds
  const handleCardSwipe = (direction) => {
    setSwipeCount((prev) => prev + 1);
    setCards(prev => {
      if (direction === 'left') {
        return [...prev.slice(1), prev[0]];
      } else if (direction === 'right') {
        return [prev[prev.length - 1], ...prev.slice(0, prev.length - 1)];
      }
      return prev;
    });
    x.set(0);
  };

  const handleLogout = () => {
    sessionStorage.removeItem('userType');
    sessionStorage.removeItem('userEmail');
    navigate('/');
    toast({ title: 'Logged Out', description: 'You have been successfully logged out.' });
  };

  const memoizedCards = useMemo(() => {
    return cards.map(item => ({
      ...item,
      randomRotation: (Math.random() - 0.5) * 16
    }));
  }, [cards]);

  // Mock data for profile/company back content
  const mockCandidateProfile = {
    name: "Alex Johnson",
    title: "Senior Frontend Developer",
    location: "San Francisco, CA",
    experience: "5+ years",
    skills: ["React", "TypeScript", "Node.js", "GraphQL"],
    completedProjects: 23,
    matchRate: "94%",
    responseTime: "2 hours"
  };

  const mockCompanyProfile = {
    name: "InnovateTech Solutions",
    industry: "Technology",
    founded: "2018",
    employees: "50-100",
    activeJobs: 12,
    candidatesHired: 45,
    responseRate: "98%",
    avgTimeToHire: "14 days"
  };

  const handleJobFormChange = (field, value) => {
    setJobForm(prev => ({ ...prev, [field]: value }));
  };

  const handleJobFormSubmit = (e) => {
    e.preventDefault();
    toast({
      title: "Job Posted Successfully! 🎉",
      description: `${jobForm.title} has been added to your active job listings.`,
    });
    // Reset form
    setJobForm({
      title: '',
      location: '',
      jobType: 'Full-time',
      workSetup: 'Hybrid',
      salaryMin: '',
      salaryMax: '',
      description: '',
      requirements: '',
      benefits: ''
    });
    setFlippedCardId(null);
  };

  
const renderCardBack = (item) => {
    if (item.id === 'matches') {
  // Only render the Matches card BACK face here (the stack handles the 3D flip)
  return (
    <div className="relative w-full h-full p-6 flex flex-col justify-between text-white bg-gradient-to-br from-green-500/60 to-blue-700/60 rounded-2xl shadow-xl">
      <div className="overflow-y-auto invisible-scrollbar h-[370px]">
        <h2 className="text-2xl font-bold mb-4 text-center text-white">Your Matches</h2>
        {matches.length > 0 ? (
  <ul className="divide-y divide-white/10 rounded-lg border border-white/10 overflow-hidden bg-white/5">
    {matches.map((match, idx) => (
      <li
        key={idx}
        className="px-4 py-3 flex flex-col sm:flex-row sm:items-center hover:bg-white/10 transition cursor-pointer group"
      >
        <div
          className="flex-1"
          onClick={e => {
            e.stopPropagation();
            setSelectedMatch(match);
          }}
        >
          {userType === 'candidate' ? (
            <>
              <span className="font-bold text-lg">{match.title} @ {match.company}</span>
              <span className="block text-xs text-white/70">{match.location} • {match.jobType || match.type}</span>
            </>
          ) : (
            <>
              <span className="font-bold text-lg">{match.name}</span>
              <span className="block text-xs text-white/70">{match.title} • {match.location}</span>
            </>
          )}
        </div>

      </li>
    ))}
  </ul>
) : (
  <div className="flex items-center justify-center h-40 text-lg text-white/60 font-semibold text-center px-4">
    No matches... Yet! Get to swiping to see your matches here!
  </div>
)}
      </div>
      <div className="mt-4 flex justify-center">
        <button
          className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white border border-white/20"
          onClick={e => { e.stopPropagation(); setFlippedCardId(null); }}
        >Back</button>
      </div>

      {/* Match Details Dialog */}
      <Dialog open={!!selectedMatch} onOpenChange={open => { if (!open) setSelectedMatch(null); }}>
        <DialogContent className="glass-effect border-white/20 text-white sm:max-w-[425px]">
          <DialogHeader>
  <div className="flex items-center gap-4 mb-2">
    <Avatar className="w-14 h-14">
      <AvatarImage
        src={userType === 'candidate'
          ? (selectedMatch?.logo || `https://avatar.vercel.sh/${selectedMatch?.company || 'job'}.png`)
          : (selectedMatch?.avatar || `https://avatar.vercel.sh/${selectedMatch?.name || 'candidate'}.png`)
        }
        alt={userType === 'candidate' ? selectedMatch?.company : selectedMatch?.name}
      />
      <AvatarFallback>
        {userType === 'candidate'
          ? (selectedMatch?.company?.[0] || 'J')
          : (selectedMatch?.name?.split(' ').map(n => n[0]).join('') || 'C')}
      </AvatarFallback>
    </Avatar>
    <div>
      <DialogTitle className="text-2xl gradient-text">
        {userType === 'candidate'
          ? `${selectedMatch?.title} @ ${selectedMatch?.company}`
          : selectedMatch?.name}
      </DialogTitle>
      <DialogDescription className="text-gray-300">
        {userType === 'candidate'
          ? `${selectedMatch?.location} • ${selectedMatch?.jobType || selectedMatch?.type}`
          : `${selectedMatch?.title} • ${selectedMatch?.location}`}
      </DialogDescription>
    </div>
  </div>
</DialogHeader>
<div className="py-4">
  {userType === 'candidate' ? (
    <>
      <div className="mb-2"><span className="font-semibold">Job Description:</span> {selectedMatch?.description || 'No description.'}</div>
      <div className="mb-2"><span className="font-semibold">Requirements:</span> {selectedMatch?.requirements || 'N/A'}</div>
      <div className="mb-2"><span className="font-semibold">Salary:</span> {selectedMatch?.salaryMin && selectedMatch?.salaryMax ? `$${selectedMatch.salaryMin} - $${selectedMatch.salaryMax}` : 'N/A'}</div>
    </>
  ) : (
    <>
      <div className="mb-2"><span className="font-semibold">Skills:</span> {selectedMatch?.skills || 'N/A'}</div>
      <div className="mb-2"><span className="font-semibold">Experience:</span> {selectedMatch?.experience || 'N/A'}</div>
      <div className="mb-2"><span className="font-semibold">Bio:</span> {selectedMatch?.bio || 'N/A'}</div>
    </>
  )}
</div>
<DialogFooter>
  <Button
    onClick={() => {
      setQuickMessageRecipient(selectedMatch);
      setQuickMessageModalOpen(true);
      setSelectedMatch(null);
      setFlippedCardId(null);
    }}
    className="bg-green-600 hover:bg-green-700 mr-2"
  >
    Message
  </Button>
  <Button onClick={() => setSelectedMatch(null)} className="bg-purple-600 hover:bg-purple-700">Close</Button>
</DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
  // Quick Message Modal integration
  const handleSendQuickMessage = (msg) => {
    toast({ title: "Message Sent!", description: `\u2709\ufe0f ${msg}` });
    setQuickMessageModalOpen(false);
    setQuickMessageRecipient(null);
  };

  // ...rest of HubPage logic...

  // MAIN RETURN (ensure only one return in the component)
  if (!userType) return <div className="min-h-screen bg-gradient-to-br from-[#18122B] via-[#251E40] to-[#1A1A2E] flex items-center justify-center text-white">Loading...</div>;

  return (
    <>
      {/* ...existing JSX... */}
      <QuickMessageModal
        isOpen={quickMessageModalOpen}
        onClose={() => { setQuickMessageModalOpen(false); setQuickMessageRecipient(null); }}
        userType={userType}
        onSend={handleSendQuickMessage}
      />
      {/* ...existing JSX... */}
    </>
  );
}

  if (item.id === 'profile') {
      return (
        <div className="w-full h-full p-6 flex flex-col justify-between text-white">
          <div className="flex flex-col items-center text-center">
            <Avatar className="w-20 h-20 mb-4 border-2 border-white/20">
              <AvatarImage src={`https://avatar.vercel.sh/${mockCandidateProfile.name}.png`} alt={mockCandidateProfile.name} />
              <AvatarFallback className="bg-white/20 text-white">{mockCandidateProfile.name.substring(0, 2)}</AvatarFallback>
            </Avatar>
            <h2 className="text-2xl font-bold mb-1 text-white">{mockCandidateProfile.name}</h2>
            <p className="text-sm opacity-70 mb-4 text-white/80">{mockCandidateProfile.title}</p>
            
            <div className="space-y-3 w-full">
              <div className="flex items-center justify-center">
                <MapPin className="w-4 h-4 mr-2 opacity-60 text-white" />
                <span className="text-sm text-white">{mockCandidateProfile.location}</span>
              </div>
              <div className="flex items-center justify-center">
                <Award className="w-4 h-4 mr-2 opacity-60 text-white" />
                <span className="text-sm text-white">{mockCandidateProfile.experience}</span>
              </div>
              <div className="flex flex-wrap gap-1 mt-3 justify-center">
                {mockCandidateProfile.skills.map(skill => (
                  <span key={skill} className="text-xs px-2 py-1 bg-white/20 rounded-full text-white">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-3 gap-2 text-center mt-4">
            <div className="bg-white/10 rounded-lg p-2">
              <p className="text-lg font-bold text-white">{mockCandidateProfile.completedProjects}</p>
              <p className="text-xs opacity-60 text-white/70">Projects</p>
            </div>
            <div className="bg-white/10 rounded-lg p-2">
              <p className="text-lg font-bold text-white">{mockCandidateProfile.matchRate}</p>
              <p className="text-xs opacity-60 text-white/70">Match Rate</p>
            </div>
            <div className="bg-white/10 rounded-lg p-2">
              <p className="text-lg font-bold text-white">{mockCandidateProfile.responseTime}</p>
              <p className="text-xs opacity-60 text-white/70">Response</p>
            </div>
          </div>
        </div>
      );
    }

    if (item.id === 'company') {
      return (
        <div className="w-full h-full p-6 flex flex-col justify-between text-white">
          <div className="flex flex-col items-center text-center">
            <div className="w-20 h-20 bg-white/20 rounded-lg flex items-center justify-center mb-4 border-2 border-white/20">
              <Building className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-2xl font-bold mb-1 text-white">{mockCompanyProfile.name}</h2>
            <p className="text-sm opacity-70 mb-4 text-white/80">{mockCompanyProfile.industry}</p>
            
            <div className="space-y-3 w-full">
              <div className="flex items-center justify-center">
                <Users className="w-4 h-4 mr-2 opacity-60 text-white" />
                <span className="text-sm text-white">{mockCompanyProfile.employees} employees</span>
              </div>
              <div className="flex items-center justify-center">
                <Award className="w-4 h-4 mr-2 opacity-60 text-white" />
                <span className="text-sm text-white">Founded {mockCompanyProfile.founded}</span>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-3 text-center mt-4">
            <div className="bg-white/10 rounded-lg p-2">
              <p className="text-lg font-bold text-white">{mockCompanyProfile.activeJobs}</p>
              <p className="text-xs opacity-60 text-white/70">Active Jobs</p>
            </div>
            <div className="bg-white/10 rounded-lg p-2">
              <p className="text-lg font-bold text-white">{mockCompanyProfile.candidatesHired}</p>
              <p className="text-xs opacity-60 text-white/70">Hired</p>
            </div>
            <div className="bg-white/10 rounded-lg p-2">
              <p className="text-lg font-bold text-white">{mockCompanyProfile.responseRate}</p>
              <p className="text-xs opacity-60 text-white/70">Response Rate</p>
            </div>
            <div className="bg-white/10 rounded-lg p-2">
              <p className="text-lg font-bold text-white">{mockCompanyProfile.avgTimeToHire}</p>
              <p className="text-xs opacity-60 text-white/70">Time to Hire</p>
            </div>
          </div>
        </div>
      );
    }

    if (item.id === 'dashboard') {
      // Animated dashboard overlay
      return (
        <div className="w-full h-full p-6 flex flex-col justify-between text-white">
          <div className="overflow-y-auto invisible-scrollbar h-[370px]">
            <h2 className="text-2xl font-bold mb-2 text-center text-white">Dashboard</h2>
            <p className="text-center text-sm mb-6 text-white/80">Your hiring metrics at a glance</p>
            <div className="grid grid-cols-2 gap-4 mb-6">
              {/* Animated stats - now clickable */}
              {dashboardMetrics.map((metric, i) => (
                <button
                  key={metric.label}
                  className="focus:outline-none"
                  onClick={() => setSelectedMetric(metric)}
                >
                  <AnimatedMetric {...metric} delay={0.1 + i * 0.1} />
                </button>
              ))}
            </div>
            {/* Diversity bar */}
            <div className="mb-6">
              <p className="text-xs mb-2 text-white/70">Team Diversity</p>
              <div className="flex items-center gap-2">
                <motion.div initial={{ width: 0 }} animate={{ width: '55%' }} transition={{ delay: 0.7, duration: 1 }} className="h-3 rounded-full bg-gradient-to-r from-pink-400 to-purple-400 shadow-lg" style={{ width: '55%' }} />
                <span className="text-xs text-white/80">55% Women</span>
              </div>
              <div className="flex items-center gap-2 mt-2">
                <motion.div initial={{ width: 0 }} animate={{ width: '40%' }} transition={{ delay: 0.8, duration: 1 }} className="h-3 rounded-full bg-gradient-to-r from-blue-400 to-green-400 shadow-lg" style={{ width: '40%' }} />
                <span className="text-xs text-white/80">40% Minorities</span>
              </div>
            </div>
            {/* Recent activity */}
            <div>
              <p className="text-xs mb-2 text-white/70">Recent Activity</p>
              <motion.ul initial="hidden" animate="visible" variants={{ visible: { transition: { staggerChildren: 0.15 } } }} className="space-y-2">
                {[
                  { label: 'New applicant: Jane Doe', icon: <User className="w-4 h-4 text-cyan-400" /> },
                  { label: 'Interview scheduled with John Smith', icon: <MessageSquare className="w-4 h-4 text-yellow-400" /> },
                  { label: 'Offer sent to Emily Lee', icon: <Award className="w-4 h-4 text-purple-400" /> },
                  { label: 'New hire: Michael Chen', icon: <Briefcase className="w-4 h-4 text-pink-400" /> },
                ].map((item, i) => (
                  <motion.li key={i} initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 1 + i * 0.2 }} className="flex items-center gap-2 text-sm bg-white/10 rounded-lg px-3 py-2">
                    {item.icon}
                    <span>{item.label}</span>
                  </motion.li>
                ))}
              </motion.ul>
            </div>
          </div>
        </div>
      );
    }

    if (item.id === 'upload_jobs') {
      return (
        <div className="w-full h-full p-6 overflow-hidden">
          <h2 className="text-2xl font-bold mb-4 text-center text-white">Post a Job</h2>
          <form onSubmit={handleJobFormSubmit} className="overflow-y-auto invisible-scrollbar h-[300px] space-y-4">
            <div className="space-y-2">
              <Label className="text-white text-sm">Job Title</Label>
              <Input
                value={jobForm.title}
                onChange={(e) => handleJobFormChange('title', e.target.value)}
                placeholder="e.g. Senior Frontend Developer"
                className="bg-white/10 border-white/20 text-white placeholder-white/50 text-sm h-9"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label className="text-white text-sm">Location</Label>
                <Input
                  value={jobForm.location}
                  onChange={(e) => handleJobFormChange('location', e.target.value)}
                  placeholder="San Francisco, CA"
                  className="bg-white/10 border-white/20 text-white placeholder-white/50 text-sm h-9"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label className="text-white text-sm">Job Type</Label>
                <select
                  value={jobForm.jobType}
                  onChange={(e) => handleJobFormChange('jobType', e.target.value)}
                  className="w-full bg-white/10 border border-white/20 rounded-md px-3 py-2 text-white text-sm h-9"
                >
                  <option value="Full-time" className="bg-slate-800">Full-time</option>
                  <option value="Part-time" className="bg-slate-800">Part-time</option>
                  <option value="Contract" className="bg-slate-800">Contract</option>
                  <option value="Internship" className="bg-slate-800">Internship</option>
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-white text-sm">Work Setup</Label>
              <RadioGroup value={jobForm.workSetup} onValueChange={(value) => handleJobFormChange('workSetup', value)} className="flex gap-4">
                {['Remote', 'Hybrid', 'On-site'].map(setup => (
                  <div key={setup} className="flex items-center space-x-1">
                    <RadioGroupItem value={setup} id={setup} className="w-3 h-3" />
                    <Label htmlFor={setup} className="text-white text-xs">{setup}</Label>
                  </div>
                ))}
              </RadioGroup>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label className="text-white text-sm">Min Salary ($)</Label>
                <Input
                  type="number"
                  value={jobForm.salaryMin}
                  onChange={(e) => handleJobFormChange('salaryMin', e.target.value)}
                  placeholder="80000"
                  className="bg-white/10 border-white/20 text-white placeholder-white/50 text-sm h-9"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-white text-sm">Max Salary ($)</Label>
                <Input
                  type="number"
                  value={jobForm.salaryMax}
                  onChange={(e) => handleJobFormChange('salaryMax', e.target.value)}
                  placeholder="120000"
                  className="bg-white/10 border-white/20 text-white placeholder-white/50 text-sm h-9"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-white text-sm">Job Description</Label>
              <textarea
                value={jobForm.description}
                onChange={(e) => handleJobFormChange('description', e.target.value)}
                placeholder="Describe the role, responsibilities, and what you're looking for..."
                rows={3}
                className="w-full bg-white/10 border border-white/20 rounded-md px-3 py-2 text-white placeholder-white/50 text-sm resize-none"
                required
              />
            </div>

            <div className="space-y-2">
              <Label className="text-white text-sm">Requirements & Skills</Label>
              <textarea
                value={jobForm.requirements}
                onChange={(e) => handleJobFormChange('requirements', e.target.value)}
                placeholder="React, TypeScript, 3+ years experience..."
                rows={2}
                className="w-full bg-white/10 border border-white/20 rounded-md px-3 py-2 text-white placeholder-white/50 text-sm resize-none"
                required
              />
            </div>

            <div className="space-y-2">
              <Label className="text-white text-sm">Benefits (Optional)</Label>
              <textarea
                value={jobForm.benefits}
                onChange={(e) => handleJobFormChange('benefits', e.target.value)}
                placeholder="Health insurance, 401k, flexible hours..."
                rows={2}
                className="w-full bg-white/10 border border-white/20 rounded-md px-3 py-2 text-white placeholder-white/50 text-sm resize-none"
              />
            </div>

            <div className="pt-4 pb-6">
              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white font-semibold py-2 px-4 rounded-lg text-sm"
              >
                <Upload className="w-4 h-4 mr-2" />
                Post Job
              </Button>
            </div>
          </form>
        </div>
      );
    }

    if (item.id === 'verify_algorand') {
      // Unified on-chain verification card using VerifyCard component
      return <VerifyCard />;
    }

    if (item.id === 'settings') {
      const settingsOptions = [
        { icon: User, title: "Account Settings", description: "Manage your account details" },
        { icon: Bell, title: "Notifications", description: "Control your notification preferences" },
        { icon: Shield, title: "Privacy & Security", description: "Manage privacy settings" },
        { icon: Palette, title: "Appearance", description: "Customize the app theme" },
        { icon: Globe, title: "Language & Region", description: "Set your language preferences" },
        { icon: Bot, title: "AI Preferences", description: "Configure AI matching settings" },
        { icon: MessageSquare, title: "Communication", description: "Message and contact preferences" },
        { icon: Briefcase, title: "Job Preferences", description: "Set your job search criteria" },
      ];

      return (
        <div className="w-full h-full p-6 overflow-hidden">
          <h2 className="text-2xl font-bold mb-4 text-center text-white">Settings</h2>
          <div className="overflow-y-auto invisible-scrollbar h-[280px] space-y-3">
            {settingsOptions.map((option, index) => (
              <div key={index} className="flex items-center p-3 bg-white/10 rounded-lg hover:bg-white/20 transition-colors cursor-pointer">
                <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center mr-3 flex-shrink-0">
                  <option.icon className="w-4 h-4 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm text-white truncate">{option.title}</p>
                  <p className="text-xs opacity-60 text-white/70 truncate">{option.description}</p>
                </div>
              </div>
            ))}
            <div className="pb-4"></div> {/* Extra padding for scrolling */}
          </div>
        </div>
      );
    }

    return null;
  };

  // Card ref to detect outside clicks
  const cardStackRef = React.useRef(null);
  // Handle clicking outside flipped card to collapse
  const handleBackgroundClick = (e) => {
    if (!flippedCardId) return;
    // Only flip back if click is outside the card stack
    if (cardStackRef.current && !cardStackRef.current.contains(e.target)) {
      setFlippedCardId(null);
    }
  };

  if (!userType) return <div className="min-h-screen bg-gradient-to-br from-[#18122B] via-[#251E40] to-[#1A1A2E] flex items-center justify-center text-white">Loading...</div>;


  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-gradient-to-br from-[#18122B] via-[#251E40] to-[#1A1A2E] p-4 overflow-hidden relative" onClick={selectedMetric ? undefined : handleBackgroundClick}>
      {/* Metric Detail Overlay */}
      {selectedMetric && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/60">
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 30 }}
            transition={{ duration: 0.3 }}
            className="glass-effect rounded-2xl shadow-2xl w-full max-w-md p-8 relative text-white"
          >
            <button onClick={() => setSelectedMetric(null)} className="absolute top-4 right-4 text-white/80 hover:text-white text-xl">
              <X className="w-6 h-6" />
            </button>
            <div className="flex flex-col items-center mb-6">
              <div className="mb-2">{selectedMetric.icon}</div>
              <div className="text-4xl font-bold mb-1">{selectedMetric.value}</div>
              <div className="text-lg font-semibold mb-2 gradient-text">{selectedMetric.label}</div>
            </div>
            {/* Chart for metric */}
            <MetricDetailChart label={selectedMetric.label} />
            <div className="text-center text-white/90 text-base">
              {/* Dummy detailed info for each metric */}
              {selectedMetric.label === 'Applicants' && <span>128 applicants have applied to your open positions this month. View trends, sources, and applicant quality here.</span>}
              {selectedMetric.label === 'Matches' && <span>37 candidate matches found based on your job requirements and preferences. Click for more details on match scoring.</span>}
              {selectedMetric.label === 'Interviews' && <span>14 interviews scheduled. Track interview progress, feedback, and outcomes here.</span>}
              {selectedMetric.label === 'Offers' && <span>5 offers made. See offer acceptance rates and negotiation insights.</span>}
              {selectedMetric.label === 'Hires' && <span>3 new hires. Review onboarding progress and retention analytics.</span>}
              {selectedMetric.label === 'Avg. Time to Fill' && <span>Average time to fill a position is 21 days. See breakdown by department or role.</span>}
            </div>
          </motion.div>
        </div>
      )}

      <AnimatePresence>
// ... (rest of the code remains the same)
        <motion.header 
          className="absolute top-0 left-0 right-0 p-6 flex justify-center items-center z-20"
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ type: "spring", stiffness: 100, damping: 20 }}
        >
          <Popover open={isNavMenuOpen} onOpenChange={setIsNavMenuOpen}>
            <PopoverTrigger asChild>
              <Button variant="ghost" className="text-white hover:bg-white/10 p-3 rounded-xl">
                <h1 className="text-5xl font-black mr-3 gradient-text">Hirly</h1>
                <ChevronDown className="w-8 h-8 text-white/70" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 glass-effect border-white/20 text-white p-4">
              <div className="grid gap-4">
                <div className="mb-4">
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="glass-effect border-white/20 text-white hover:bg-white/20 px-4 py-2 w-full flex items-center justify-between">
                        <span className="flex items-center">
                          {userType === 'candidate' ? <UserSearchIcon className="mr-2 h-5 w-5"/> : <Briefcase className="mr-2 h-5 w-5"/>}
                          {userEmail} ({userType})
                        </span>
                        <ChevronDown className="ml-2 h-5 w-5" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent align="start" className="w-56 glass-effect border-white/20 text-white p-2">
                      <Button variant="ghost" onClick={handleLogout} className="w-full justify-start hover:bg-red-500/30 text-red-400 hover:text-red-300">
                        <LogOut className="mr-2 h-4 w-4" /> Logout
                      </Button>
                    </PopoverContent>
                  </Popover>
                </div>
                <div className="grid gap-2">
                  {menuItems.map(item => (
                    <Button
                      key={item.id}
                      variant="ghost"
                      onClick={() => handleCardClick(item, true)} // Pass fromNavMenu = true
                      className="w-full justify-start hover:bg-white/10 text-white"
                    >
                      {item.id === 'verify_algorand' ? (
  <span className="flex items-center gap-1">
    <item.icon className="mr-1 h-4 w-4" />
    
    <span>Verify with Algorand</span>
  </span>
) : (
  <>
    <item.icon className="mr-2 h-4 w-4" /> {item.title}
  </>
)}
                    </Button>
                  ))}
                </div>
              </div>
            </PopoverContent>
          </Popover>
        </motion.header>
      </AnimatePresence>

      <div ref={cardStackRef} className="relative w-[320px] h-[450px] flex items-center justify-center" style={{ perspective: '1000px' }}>
        <AnimatePresence initial={false}>
          {memoizedCards.map((item, index) => {
            const isTopCard = index === memoizedCards.length - 1;
            const isFlipped = flippedCardId === item.id;
            
            return (
              <motion.div
                key={item.id}
                className="absolute w-[320px] h-[400px] rounded-2xl shadow-2xl cursor-grab overflow-hidden glass-effect border border-white/20 text-white"
                style={{
                  x: isTopCard ? xSpring : 0,
                  rotate: isTopCard && !isFlipped ? rotate : `${item.randomRotation}deg`,
                  zIndex: index,
                  boxShadow: isTopCard ? '0 25px 50px -12px rgba(0, 0, 0, 0.5)' : `0 ${index*2}px ${index*5}px -${index}px rgba(0,0,0,0.3)`,
                }}
                drag={isTopCard && !isFlipped ? "x" : false}
                dragConstraints={{ left: 0, right: 0, top:0, bottom:0 }}
                onDragEnd={(_event, info) => {
                  if (isTopCard && !isFlipped && Math.abs(info.offset.x) > 100) {
                    if (info.offset.x < 0) {
                      handleCardSwipe('left'); // advance
                    } else {
                      handleCardSwipe('right'); // rewind
                    }
                  } else if (isTopCard) {
                    x.set(0); 
                  }
                }}
                onClick={(e) => {
                  // Only allow flipping (handleCardClick) if clicking the front face and not already flipped
                  if (!isFlipped && isTopCard) {
                    e.stopPropagation();
                    handleCardClick(item, false);
                  }
                  // Do not trigger flip if already flipped (back face)
                }}
                animate={{ 
                  scale: 1 - (memoizedCards.length - 1 - index) * 0.05, 
                  y: (memoizedCards.length - 1 - index) * -10,
                  rotate: isTopCard && !isFlipped ? rotate.get() : `${item.randomRotation}deg`,
                }}
                transition={{ 
                  type: "spring", 
                  stiffness: 300, 
                  damping: 30,
                }}
                whileHover={isTopCard ? { scale: 1.03, y: (memoizedCards.length - 1 - index) * -10 -5 } : {}}
              >
                {/* 3D Card Container */}
                <motion.div 
                  className="relative w-full h-full"
                  style={{ 
                    transformStyle: 'preserve-3d',
                  }}
                  animate={{
                    rotateY: isFlipped ? 180 : 0
                  }}
                  transition={{ 
                    duration: 0.6,
                    type: "spring",
                    stiffness: 200,
                    damping: 25
                  }}
                >
                  
                  {/* Front Face */}
                  <div 
                    className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${item.gradient} p-6 flex flex-col justify-between backface-hidden`}
                  >
                    <div className="flex flex-col items-center text-center">
                      <item.icon className="w-24 h-24 mb-6 opacity-90" />
                      {item.id === 'verify_algorand' ? (
  <span className="text-4xl font-bold mb-2">Verify with Algorand</span>
) : (
  <h2 className="text-4xl font-bold mb-2">{item.title}</h2>
)}
                      <p className="text-sm opacity-70 leading-relaxed">{item.description}</p>
                    </div>
                    {isTopCard && !isFlipped && (
                      <div className="self-center">
                        <motion.div 
                          className="w-3 h-3 bg-white/50 rounded-full"
                          animate={{ scale: [1, 1.2, 1] }}
                          transition={{ repeat: Infinity, duration: 1.5 }}
                        />
                      </div>
                    )}
                  </div>

                  {/* Back Face */}
                  <div 
                    className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${item.gradient} overflow-hidden backface-hidden`}
                    style={{ 
                      transform: 'rotateY(180deg)',
                    }}
                  >
                    {renderCardBack(item)}
                  </div>
                </motion.div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
      
      <Dialog open={genericModalOpen} onOpenChange={setGenericModalOpen}>
        <DialogContent className="glass-effect border-white/20 text-white sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="text-2xl gradient-text">{modalContent.title}</DialogTitle>
            <DialogDescription className="text-gray-300">{modalContent.description}</DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <p className="text-center text-lg">🚧</p>
            <p className="text-center text-gray-400 mt-2">
              This is a placeholder for the {modalContent.title} feature. 
              You can request its implementation in your next prompt! 🚀
            </p>
          </div>
          <DialogFooter>
            <Button onClick={() => setGenericModalOpen(false)} className="bg-purple-600 hover:bg-purple-700">Got it!</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <MessagesModal 
        isOpen={messagesModalOpen} 
        onClose={() => {
          setMessagesModalOpen(false);
          setPrefilledMessageRecipient(null); // Clear prefill on close
        }}
        userType={userType} 
        prefilledRecipient={prefilledMessageRecipient}
      />

      <AnimatePresence>
        {swipeAppOpen && (
          <SwipeApp
            onCollapse={() => setSwipeAppOpen(false)}
            userType={userType}
            contentType={swipeAppContentType}
            candidateProfiles={mockCandidateProfiles}
            jobListings={mockJobListings}
            onMatch={item => {
              setMatches(prev => [...prev, item]);
              toast({
                title: "It's a match! 🎉",
                description: userType === 'candidate'
                  ? `You matched with ${item.company || item.title || ''}!`
                  : `You matched with ${item.name || item.title || ''}!`,
              });
            }}
          />
        )}
      </AnimatePresence>

      {/* AI Coach Overlay */}
      <AnimatePresence>
        {aiCoachOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-lg"
            onClick={() => setAiCoachOpen(false)}
          >
            {/* Background Orb */}
            <div className="absolute inset-0 z-0">
              <Orb 
                hue={180}
                hoverIntensity={0.3}
                rotateOnHover={true}
                forceHoverState={true}
              />
            </div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 50 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 50 }}
              transition={{ duration: 0.4, type: "spring", stiffness: 150, damping: 20 }}
              className="relative z-10 w-full max-w-5xl mx-auto p-4 max-h-[90vh] overflow-y-auto invisible-scrollbar"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center">
                    <Bot className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-white">AI Career Coach</h2>
                    <p className="text-gray-300">Your personal AI assistant for career growth</p>
                  </div>
                </div>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => setAiCoachOpen(false)}
                  className="text-white hover:bg-white/20 rounded-full flex-shrink-0"
                >
                  <X size={24} />
                </Button>
              </div>

              {/* Main Content */}
              <div className="flex flex-col items-center space-y-8">
                <AI_Prompt />
                
                {/* Quick Actions */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full max-w-4xl">
                  {[
                    { title: "Resume Review", description: "Get AI feedback on your resume", icon: "📄" },
                    { title: "Interview Prep", description: "Practice with AI mock interviews", icon: "🎯" },
                    { title: "Career Path", description: "Explore career advancement options", icon: "🚀" }
                  ].map((action, index) => (
                    <motion.div
                      key={index}
                      whileHover={{ scale: 1.05 }}
                      className="p-6 bg-white/10 rounded-xl backdrop-blur-sm border border-white/20 cursor-pointer hover:bg-white/20 transition-colors"
                    >
                      <div className="text-3xl mb-3">{action.icon}</div>
                      <h3 className="font-semibold text-white mb-2 text-lg">{action.title}</h3>
                      <p className="text-sm text-gray-300">{action.description}</p>
                    </motion.div>
                  ))}
                </div>

                {/* Additional padding for better scrolling */}
                <div className="pb-8"></div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default HubPage;