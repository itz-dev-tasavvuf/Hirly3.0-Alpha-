import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import DatePicker from 'react-datepicker';
import { forwardRef } from 'react';
import { Sparkles } from "lucide-react"; // Add at top with other imports

// Custom input for DatePicker to always use the custom calendar modal
const CustomInput = forwardRef(({ value, onClick, placeholder }, ref) => (
  <input
    ref={ref}
    onClick={onClick}
    value={value || ''}
    readOnly
    placeholder={placeholder}
    className="bg-white/10 border-white/20 text-white placeholder-white placeholder-opacity-100 placeholder-white/90 text-sm h-9 w-full rounded-md px-3 py-2"
  />
));

import 'react-datepicker/dist/react-datepicker.css';
import '../../glass-calendar.css';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { toast } from '@/components/ui/use-toast';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter
} from '@/components/ui/dialog';
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { ChevronDown, LogOut, User, Settings, MessageSquare, Briefcase, UserCheck as UserSearchIcon, BarChart3, PlusSquare, Building, Bot, MapPin, Award, Users, Bell, Shield, Palette, Globe, DollarSign, Clock, Upload, X, UserCheck, Mail as Envelope, FileText, Target, AlertCircle, TrendingUp, RotateCcw } from 'lucide-react';
import algorandMark from '@/assets/algorand_logo_mark_white.png';
import MessagesModal from '@/components/hub/MessagesModal';
import SwipeApp from '@/components/hub/SwipeApp'; 
import QuickMessageModal, { QuickMessagePanel } from '@/components/hub/QuickMessageModal';
import AutoDismissModal from '@/components/ui/AutoDismissModal';

import { mockJobListings, mockCandidateProfiles } from '@/components/hub/swipeAppData';
import Orb from '@/components/Orb';
import algorandFullLogoWhite from '@/assets/algorand_full_logo_white.png';
import MetricDetailChart from '@/components/hub/MetricDetailChart';
import AI_Prompt from '../../components/AI_Prompt';
import VerifyCard from '@/components/hub/VerifyCard';
import { supabase } from '../../supabaseClient'; // adjust path if needed
import HubBackground from '@/components/hub/HubBackground';
import BrandedLoader from '../../components/BrandedLoader';
import { NotificationProvider, useNotifications } from '../../contexts/NotificationContext';
import NotificationBadge from '../../components/NotificationBadge';


// Dashboard metrics config
const dashboardMetrics = [
  { label: "Applicants", value: 128, icon: <Users className="w-5 h-5 text-cyan-400" /> },
  { label: "Matches", value: 37, icon: <UserCheck className="w-5 h-5 text-green-400" /> },
  { label: "Interviews", value: 14, icon: <MessageSquare className="w-5 h-5 text-yellow-400" /> },
  { label: "Offers", value: 5, icon: <Award className="w-5 h-5 text-purple-400" /> },
  { label: "Hires", value: 3, icon: <Briefcase className="w-5 h-5 text-pink-400" /> },
  { label: "Avg. Time to Fill", value: "21d", icon: <Clock className="w-5 h-5 text-orange-400" /> },
];

// Fun mock company profile for the demo
const mockCompanyProfile = {
  name: 'Hirly, Inc',
  industry: 'AI Recruiting & Talent Innovation',
  employees: '42',
  founded: '2023',
  activeJobs: 7,
  candidatesHired: 15,
  responseRate: '99.9%',
  avgTimeToHire: '3d',
  tagline: 'We match top talent with next-gen teams 🚀',
  description: 'Hirly, Inc is on a mission to revolutionize hiring with AI and human touch. We connect innovators with opportunities that matter. Proudly building the future of work.'
};

// AnimatedMetric component for dashboard
const AnimatedMetric = ({ label, value, icon, delay }) => {
  const [displayValue, setDisplayValue] = React.useState(typeof value === 'number' ? 0 : value);
  const [isAnimating, setIsAnimating] = React.useState(false);
  
  React.useEffect(() => {
    if (typeof value === 'number') {
      setIsAnimating(true);
      let start = 0;
      const duration = 1200;
      const step = Math.ceil(value / (duration / 16));
      let raf;
      const animate = () => {
        start += step;
        if (start >= value) {
          setDisplayValue(value);
          setIsAnimating(false);
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
    <motion.div 
      initial={{ opacity: 0, y: 20, scale: 0.9 }} 
      animate={{ opacity: 1, y: 0, scale: 1 }} 
      transition={{ delay, duration: 0.6, type: "spring", stiffness: 120, damping: 15 }} 
      className="bg-white/10 rounded-lg p-4 flex flex-col items-center shadow-lg relative overflow-hidden hover:bg-white/15 transition-colors cursor-pointer"
    >
      {/* Animated background shimmer */}
      <motion.div
        initial={{ x: '-100%' }}
        animate={{ x: '200%' }}
        transition={{ delay: delay + 0.5, duration: 1.5, ease: "easeInOut" }}
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
        style={{ transform: 'skewX(-20deg)' }}
      />
      
      <motion.div 
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ delay: delay + 0.2, duration: 0.8, type: "spring", stiffness: 200 }}
        className="mb-2 relative z-10"
      >
        {icon}
      </motion.div>
      
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: delay + 0.4, duration: 0.6 }}
        className="text-2xl font-bold text-white relative z-10"
      >
        <motion.span
          animate={isAnimating ? { scale: [1, 1.1, 1] } : {}}
          transition={{ duration: 0.3 }}
        >
          {typeof value === 'number' ? displayValue : value}
        </motion.span>
      </motion.div>
      
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: delay + 0.6, duration: 0.4 }}
        className="text-xs text-white/70 mt-1 relative z-10"
      >
        {label}
      </motion.div>
      
      {/* Subtle pulse effect for numbers */}
      {typeof value === 'number' && (
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: [0, 1.5, 0], opacity: [0, 0.3, 0] }}
          transition={{ delay: delay + 0.8, duration: 1, repeat: isAnimating ? Infinity : 0, repeatDelay: 2 }}
          className="absolute inset-0 rounded-lg bg-gradient-to-r from-cyan-400/20 to-blue-400/20"
        />
      )}
    </motion.div>
  );
};

// Counter animation hook for candidate dashboard
const useCounter = (target, delay = 0) => {
  const [count, setCount] = React.useState(0);
  
  React.useEffect(() => {
    let startTime;
    let animationId;
    
    const animate = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / 1000, 1); // 1 second duration
      
      if (typeof target === 'string' && target.includes('%')) {
        const numericTarget = parseInt(target);
        setCount(Math.floor(progress * numericTarget));
      } else if (typeof target === 'number') {
        setCount(Math.floor(progress * target));
      } else {
        setCount(target);
        return;
      }
      
      if (progress < 1) {
        animationId = requestAnimationFrame(animate);
      }
    };
    
    const timeout = setTimeout(() => {
      animationId = requestAnimationFrame(animate);
    }, delay);
    
    return () => {
      clearTimeout(timeout);
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
    };
  }, [target, delay]);
  
  return count;
};

// CounterText component for animated numbers
const CounterText = ({ target, delay = 0 }) => {
  const count = useCounter(target, delay);
  
  if (typeof target === 'string' && target.includes('%')) {
    return <>{count}%</>;
  }
  
  return <>{count}</>;
};

const candidateMenuItems = [
  { id: 'jobs', title: 'Jobs', icon: Briefcase, description: "Browse job opportunities", gradient: "from-green-500 to-teal-500", action: 'openSwipeJobs' },
  { id: 'matches', title: 'Matches', icon: UserCheck, description: "Your matches with jobs", gradient: "from-green-400 to-blue-400" },
  { id: 'messages', title: 'Messages', icon: MessageSquare, description: "Chat with recruiters", gradient: "from-indigo-500 to-purple-500", action: 'openMessagesModal' },
  { id: 'dashboard', title: 'Dashboard', icon: BarChart3, description: "View your job history and career insights", gradient: "from-blue-500 to-cyan-500", action: 'openCandidateDashboard' },
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
  return (
    <NotificationProvider>
      <HubPageContent />
    </NotificationProvider>
  );
};

const HubPageContent = () => {
  const { notifications, clearNotifications, addMatchNotifications } = useNotifications();
  
  // ...existing state declarations...
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();
  // Algorand posting state
  const [isPostingToAlgorand, setIsPostingToAlgorand] = useState(false);
  const [algorandTxResult, setAlgorandTxResult] = useState(null);

  // Quick message sent modal state
  const [autoDismissModalOpen, setAutoDismissModalOpen] = useState(false);
  const [autoDismissModalContent, setAutoDismissModalContent] = useState({ title: '', message: '' });

  // Send quick message, close all dialogs, and show modal
  const handleSendQuickMessage = (msg) => {
    const recipient = quickMessageRecipient || selectedMatch;
    setAutoDismissModalContent({
      title: 'Message Sent!',
      message: `Your quick message has been sent to ${recipient?.name || recipient?.company || 'Match'}.`
    });
    setAutoDismissModalOpen(true);
    setDialogMode('details');
    setSelectedMatch(null); // Close dialog
    setQuickMessageRecipient(null);
  };

  // Handle auto-dismiss modal close
  const handleAutoDismissModalClose = () => {
    setAutoDismissModalOpen(false);
    setDialogMode('details');
    setSelectedMatch(null);
    setQuickMessageRecipient(null);
  };

  // Debug: log userType and userEmail
  console.log('HubPage userType:', sessionStorage.getItem('userType'));
  console.log('HubPage userEmail:', sessionStorage.getItem('userEmail'));

  // Fake match state
  const [matches, setMatches] = useState([]);
  const [swipeCount, setSwipeCount] = useState(0);
  const [userType, setUserType] = useState(null);
  const [userEmail, setUserEmail] = useState('');
  const [menuItems, setMenuItems]  = useState([]);
  const [cards, setCards] = useState([]);
  const [flippedCardId, setFlippedCardId] = useState(null);
  // State to track if the Expiration Date modal is open
  const [isExpirationModalOpen, setIsExpirationModalOpen] = useState(false);
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
  const [dialogMode, setDialogMode] = useState('details');
  
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
    benefits: '',
    expiration: '' // New expiration field
  });
  const [expirationDate, setExpirationDate] = useState(null);

  // AI Coach Prompt state
  const [aiCoachPrompt, setAiCoachPrompt] = useState("");
  // AI Coach response state (REMOVED - now using chat history)
  const [aiCoachLoading, setAiCoachLoading] = useState(false);
  const [aiCoachError, setAiCoachError] = useState("");
  // NEW: Chat history state
  const [chatHistory, setChatHistory] = useState([]);
  const chatEndRef = React.useRef(null);
  // Resume upload modal state
  const [resumeUploadOpen, setResumeUploadOpen] = useState(false);
  const [resumeFileError, setResumeFileError] = useState("");
  // File upload toast state for AI Coach
  const [fileUploadToast, setFileUploadToast] = useState(false);

  // Handler for Resume Review quick action
  const handleResumeReviewClick = () => {
    setResumeFileError("");
    setResumeUploadOpen(true);
  };

  // Handler for processing resume file upload
  const handleResumeFile = async (file) => {
    setResumeFileError("");
    setAiCoachError("");
    setAiCoachResponse("");
    setAiCoachLoading(false);
    if (!file) return;
    setAiCoachLoading(true);
    let text = "";
    try {
      if (file.type === "text/plain") {
        text = await file.text();
      } else if (file.type === "application/pdf") {
        // Dynamically import pdfjs-dist only when needed
        const pdfjsLib = await import('pdfjs-dist/build/pdf');
        const pdfjsWorker = await import('pdfjs-dist/build/pdf.worker.entry');
        pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker;
        const arrayBuffer = await file.arrayBuffer();
        const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
        let pageText = [];
        for (let i = 1; i <= pdf.numPages; i++) {
          const page = await pdf.getPage(i);
          const content = await page.getTextContent();
          pageText.push(content.items.map(item => item.str).join(' '));
        }
        text = pageText.join('\n');
      } else if (
        file.type === "application/msword" ||
        file.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
        file.name.match(/\.(doc|docx)$/i)
      ) {
        setResumeFileError("Word document support coming soon. Please upload PDF or TXT for now.");
        setAiCoachLoading(false);
        return;
      } else {
        setResumeFileError("Unsupported file type. Please upload a .txt, .pdf, or .doc/.docx file.");
        setAiCoachLoading(false);
        return;
      }
      if (!text.trim()) {
        setResumeFileError("Could not extract text from file. Try a different file.");
        setAiCoachLoading(false);
        return;
      }
      setResumeUploadOpen(false);
      setAiCoachPrompt(`Please review this resume and provide feedback for improvement.\n\n${text}`);
      setTimeout(() => {
        handleAICoachPrompt(`Please review this resume and provide feedback for improvement.\n\n${text}`);
      }, 300);
    } catch (err) {
      setResumeFileError("Failed to read file. Try a different file.");
      setAiCoachLoading(false);
    }
  };

  // Handler to call Supabase Edge Function
  const SUPABASE_AI_COACH_URL = "https://occrvhahkgvvyzvpnsjz.functions.supabase.co/ai-coach";

const handleAICoachPrompt = async (prompt) => {
  console.log('handleAICoachPrompt called with:', prompt);
  
  // Add user message to chat history
  const userMessage = {
    id: Date.now(),
    type: 'user',
    content: prompt,
    timestamp: new Date()
  };
  setChatHistory(prev => [...prev, userMessage]);
  
  setAiCoachLoading(true);
  setAiCoachError("");
  
  try {
    const response = await fetch(SUPABASE_AI_COACH_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ prompt }),
    });
    const data = await response.json();
    console.log('AI Coach response:', data);
    if (response.ok) {
      const aiResponse = data.message || data.result || data.response || "";
      
      // Add AI response to chat history
      const aiMessage = {
        id: Date.now() + 1,
        type: 'ai',
        content: aiResponse,
        timestamp: new Date()
      };
      setChatHistory(prev => [...prev, aiMessage]);
      
      if (!aiResponse) {
        setAiCoachError("No Response from AI");
        // Add error message to chat history
        const errorMsg = {
          id: Date.now() + 2,
          type: 'error',
          content: "No Response from AI",
          timestamp: new Date()
        };
        setChatHistory(prev => [...prev, errorMsg]);
      }
    } else {
      const errorMessage = data.error || data.message || 'AI Coach error';
      setAiCoachError(errorMessage);
      
      // Add error message to chat history
      const errorMsg = {
        id: Date.now() + 1,
        type: 'error',
        content: errorMessage,
        timestamp: new Date()
      };
      setChatHistory(prev => [...prev, errorMsg]);
    }
  } catch (err) {
    const errorMessage = err.message || "Error contacting Coach. Please try again later.";
    setAiCoachError(errorMessage);
    
    // Add error message to chat history
    const errorMsg = {
      id: Date.now() + 1,
      type: 'error',
      content: errorMessage,
      timestamp: new Date()
    };
    setChatHistory(prev => [...prev, errorMsg]);
  } finally {
    setAiCoachLoading(false);
    setAiCoachPrompt(""); // Clear input after sending
  }
};

  useEffect(() => {
    async function fetchUserType() {
      setLoading(true);
      console.log('🔍 Starting auth check...');
      
      // Add timeout to prevent infinite loading
      const timeoutId = setTimeout(() => {
        console.log('⚠️ Auth check timeout, redirecting to login');
        setLoading(false);
        navigate('/login');
      }, 10000); // 10 second timeout

      try {
        const { data: { user }, error } = await supabase.auth.getUser();
        clearTimeout(timeoutId);
        
        if (!user) {
          console.log('❌ No user found, redirecting to login');
          navigate('/login');
          return;
        }

        console.log('✅ User found:', user.email);
        const userEmail = user.email || '';
        let type = user.user_metadata?.userType;
        
        // Try to get userType from query param if not in metadata
        if (!type) {
          const params = new URLSearchParams(location.search);
          const paramType = params.get('userType');
          if (paramType === 'candidate' || paramType === 'employer') {
            type = paramType;
            console.log('📝 Setting user type from URL param:', type);
            // Persist to Supabase user_metadata
            await supabase.auth.updateUser({ data: { userType: type } });
          }
        }

        console.log('👤 User type:', type);
        
        // Check if user has completed profile setup
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();
        
        if (profileError || !profile || !profile.user_type) {
          console.log('📝 Profile incomplete, redirecting to onboarding');
          navigate('/onboarding/ai?google=true');
          return;
        }
        
        console.log('✅ Profile complete:', profile);
        
        // Update state
        setUserType(type);
        setUserEmail(userEmail);
        setMenuItems(type === 'employer' ? employerMenuItems : candidateMenuItems);
        
      } catch (error) {
        clearTimeout(timeoutId);
        console.error('❌ Auth check failed:', error);
        navigate('/login');
      } finally {
        console.log('✅ Auth check complete, setting loading to false');
        setLoading(false);
      }
    }
    fetchUserType();
  }, [navigate, location.search]);
  
  // Check for URL parameters to open specific modals
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get('openAICoach') === 'true') {
      setAiCoachOpen(true);
      // Clean up the URL parameter without triggering a reload
      window.history.replaceState(null, '', '/hub');
    }
  }, [location.search]);
  
  // Detect mobile for performance optimizations
  const isMobile = useMemo(() => {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || window.innerWidth < 768;
  }, []);
  
  // Only use expensive motion values on desktop
  const x = useMotionValue(0);
  const xSpring = isMobile ? { get: () => 0 } : useSpring(x, { stiffness: 300, damping: 50 });
  const rotate = isMobile ? { get: () => 0 } : useTransform(xSpring, [-150, 0, 150], [-25, 0, 25]);

  // Helper function to bring a card to the top of the stack
  const bringCardToTop = (cardId) => {
    setCards(prev => {
      const cardToMove = prev.find(card => card.id === cardId);
      const otherCards = prev.filter(card => card.id !== cardId);
      return [...otherCards, cardToMove]; // Move to end (top of visual stack)
    });
  };

  const handleCardClick = (item, fromNavMenu = false) => {
  // Prevent flipping if expiration modal is open
  if (isExpirationModalOpen) return;
    
    // Clear notifications for this item
    clearNotifications(item.id);
    
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
    } else if (item.id === 'matches') {
      // Special handling for matches card
      const matchCount = notifications.matches || 0;
      setModalContent({ 
        title: item.title, 
        description: matchCount > 0 
          ? `You have ${matchCount} new match${matchCount !== 1 ? 'es' : ''} waiting! These are profiles that liked you back.`
          : item.description
      });
      setGenericModalOpen(true);
    } else if (item.action === 'openAICoach') {
      setAiCoachOpen(true);
    } else if (item.action === 'openCandidateDashboard') {
      navigate('/candidate-dashboard');
    } else {
      setModalContent({ title: item.title, description: item.description });
      setGenericModalOpen(true);
    }
    
    // Special toast message for matches
    if (item.id === 'matches') {
      const matchCount = notifications.matches || 0;
      toast({
        title: `${matchCount > 0 ? '🎉 ' : ''}${item.title} Opened`,
        description: matchCount > 0 
          ? `Viewing your ${matchCount} new match${matchCount !== 1 ? 'es' : ''}!`
          : "Check out your profile matches!",
        className: matchCount > 0 ? "bg-green-600 border-green-500" : undefined
      });
    } else {
      toast({
        title: `${item.title} Clicked`,
        description: item.action ? `Opening ${item.title}...` : "🚧 This feature isn't implemented yet—but don't worry! You can request it in your next prompt! 🚀"
      });
    }
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
    
    // Simulate match generation when swiping
    // 30% chance of getting 1-2 new matches when swiping left (showing interest)
    if (direction === 'left' && Math.random() < 0.3) {
      const newMatches = Math.floor(Math.random() * 2) + 1; // 1-2 matches
      setTimeout(() => {
        addMatchNotifications(newMatches);
        toast({
          title: `🎉 New Match${newMatches > 1 ? 'es' : ''}!`,
          description: `You have ${newMatches} new match${newMatches > 1 ? 'es' : ''} waiting for you!`,
          className: "bg-green-600 border-green-500"
        });
      }, 1500); // Delay to make it feel more realistic
    }
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

  // Keyboard navigation for main menu cards
  useEffect(() => {
    // Only enable if no modal, swipe app, or AI coach is open
    if (
      swipeAppOpen ||
      aiCoachOpen ||
      genericModalOpen ||
      messagesModalOpen ||
      quickMessageModalOpen ||
      autoDismissModalOpen ||
      isExpirationModalOpen
    ) {
      return;
    }
    const handleKeyDown = (e) => {
      if (!cards.length) return;
      // Prevent flip if a text input, textarea, or select is focused
      const active = document.activeElement;
      if (active && (active.tagName === 'INPUT' || active.tagName === 'TEXTAREA' || active.tagName === 'SELECT' || active.isContentEditable)) {
        return;
      }
      const isFlipped = flippedCardId === cards[cards.length - 1]?.id;
      if (e.key === 'ArrowLeft') {
        if (!isFlipped) {
          handleCardSwipe('left');
        }
      } else if (e.key === 'ArrowRight') {
        if (!isFlipped) {
          handleCardSwipe('right');
        }
      } else if (e.key === 'Enter' || e.key === ' ') {
        // Flip/unflip the top card
        if (!isFlipped) {
          handleCardClick(cards[cards.length - 1], false);
        } else {
          setFlippedCardId(null);
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [cards, flippedCardId, swipeAppOpen, aiCoachOpen, genericModalOpen, messagesModalOpen, quickMessageModalOpen, autoDismissModalOpen, isExpirationModalOpen]);

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
    name: "Hirly, Inc",
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
    // Prevent flipping if expiration modal is open
    if (!isExpirationModalOpen) setFlippedCardId(null);
  };

  // Algorand integration: Post and Verify
  const handlePostAndVerify = async () => {
    setIsPostingToAlgorand(true);
    setAlgorandTxResult(null);
    try {
      // Collect job form data and expiration
      const jobData = {
        title: jobForm.title,
        description: jobForm.description,
        company: mockCompanyProfile.name || '',
        expiration: expirationDate ? Math.floor(expirationDate.getTime() / 1000) : Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 30 // default: 30 days
      };
      const response = await fetch('https://occrvhahkgvvyzvpnsjz.functions.supabase.co/algorand-deploy-job', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(jobData)
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Algorand deployment failed');
      setAlgorandTxResult(data);
      toast({
        title: 'Job Posted On-Chain! ✅',
        description: (
          <span>
            App ID: <b>{data.appId}</b><br />
            Tx ID: <b>{data.txId}</b><br />
            <a href={`https://testnet.explorer.perawallet.app/application/${data.appId}`} target="_blank" rel="noopener noreferrer" className="underline text-cyan-300">View on Pera Explorer</a>
          </span>
        ),
        duration: 12000
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
      setExpirationDate(null);
      if (!isExpirationModalOpen) setFlippedCardId(null);
    } catch (err) {
      toast({
        title: 'Algorand Posting Failed',
        description: err.message || 'Could not post job to Algorand.',
        variant: 'destructive',
      });
    } finally {
      setIsPostingToAlgorand(false);
    }
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
          onClick={e => { e.stopPropagation(); // Prevent flipping if expiration modal is open
if (!isExpirationModalOpen) setFlippedCardId(null); }}
        >Back</button>
      </div>

      {/* Match Details Dialog */}
      <Dialog open={!!selectedMatch} onOpenChange={open => {
        if (!open && selectedMatch !== null) setSelectedMatch(null);
        setDialogMode('details');
        if (open) {
          console.log('Dialog opened:', { selectedMatch, dialogMode });
        }
      }}>
        {/* Confirmation Modal */}
        <AutoDismissModal
          open={autoDismissModalOpen}
          onClose={handleAutoDismissModalClose}
          title={autoDismissModalContent.title}
          message={autoDismissModalContent.message}
          duration={2500}
          icon={<Envelope className="w-6 h-6 text-white" />}
        />
        <DialogContent className="glass-effect border-white/20 text-white sm:max-w-[425px]">
          {dialogMode === 'details' && (
            <>
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
                  onClick={e => {
                    e.stopPropagation();
                    setQuickMessageRecipient(selectedMatch);
                    setDialogMode('quickMessage');
                  }}
                  className="bg-green-600 hover:bg-green-700 mr-2"
                >
                  Message
                </Button>
                <Button onClick={() => setSelectedMatch(null)} className="bg-purple-600 hover:bg-purple-700">Close</Button>
              </DialogFooter>
            </>
          )}
          {dialogMode === 'quickMessage' && (
            <QuickMessagePanel
              userType={userType}
              recipient={quickMessageRecipient || selectedMatch}
              onSend={handleSendQuickMessage}
              onClose={() => setDialogMode('details')}
            />
          )}

        </DialogContent>
      </Dialog>
    </div>
  );
  // ...rest of HubPage logic...

  // MAIN RETURN (ensure only one return in the component)
  // (Keyboard navigation: visually indicate focus on card stack for accessibility)
  if (loading) {
    return <BrandedLoader fullScreen={true} message="Loading your personalized hub..." />;
  }

  return (
    <>
      {/* ...existing JSX... */}

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
          <div className="overflow-y-auto invisible-scrollbar h-[370px]">
            <div className="flex flex-col items-center text-center">
              <div className="w-20 h-20 bg-white/20 rounded-lg flex items-center justify-center mb-4 border-2 border-white/20">
                <Building className="w-10 h-10 text-white" />
              </div>
              <h2 className="text-2xl font-bold mb-1 text-white">{mockCompanyProfile.name}</h2>
              <p className="text-sm opacity-70 mb-4 text-white/80">{mockCompanyProfile.industry}</p>
              <div className="space-y-3 w-full">
                <div className="flex items-center justify-center">
                  <MapPin className="w-4 h-4 mr-2 opacity-60 text-white" />
                  <span className="text-sm text-white">{mockCompanyProfile.founded}</span>
                </div>
                <div className="flex items-center justify-center">
                  <Users className="w-4 h-4 mr-2 opacity-60 text-white" />
                  <span className="text-sm text-white">{mockCompanyProfile.employees}</span>
                </div>
                <div className="flex items-center justify-center">
                  <Briefcase className="w-4 h-4 mr-2 opacity-60 text-white" />
                  <span className="text-sm text-white">Active Jobs: {mockCompanyProfile.activeJobs}</span>
                </div>
                <div className="flex items-center justify-center">
                  <Award className="w-4 h-4 mr-2 opacity-60 text-white" />
                  <span className="text-sm text-white">Candidates Hired: {mockCompanyProfile.candidatesHired}</span>
                </div>
                <div className="flex items-center justify-center">
                  <BarChart3 className="w-4 h-4 mr-2 opacity-60 text-white" />
                  <span className="text-sm text-white">Response Rate: {mockCompanyProfile.responseRate}</span>
                </div>
                <div className="flex items-center justify-center">
                  <Clock className="w-4 h-4 mr-2 opacity-60 text-white" />
                  <span className="text-sm text-white">Avg. Time to Hire: {mockCompanyProfile.avgTimeToHire}</span>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-2 text-center mt-4">
              <div className="bg-white/10 rounded-lg p-2">
                <p className="text-lg font-bold text-white">{mockCompanyProfile.activeJobs}</p>
                <p className="text-xs opacity-60 text-white/70">Active Jobs</p>
              </div>
              <div className="bg-white/10 rounded-lg p-2">
                <p className="text-lg font-bold text-white">{mockCompanyProfile.candidatesHired}</p>
                <p className="text-xs opacity-60 text-white/70">Hired</p>
              </div>
              <div className="bg-white/10 rounded-lg p-2">
                <p className="text-lg font-bold text-white">{mockCompanyProfile.avgTimeToHire}</p>
                <p className="text-xs opacity-60 text-white/70">Avg. Time</p>
              </div>
            </div>
          </div>
        </div>
      );
    }

    if (item.id === 'dashboard') {
      // Dashboard overlay - different content for candidate vs employer
      if (userType === 'candidate') {
        // Candidate Dashboard Card Back
        return (
          <div className="w-full h-full p-6 flex flex-col justify-between text-white">
            <div className="overflow-y-auto invisible-scrollbar h-[370px]">
              <h2 className="text-2xl font-bold mb-2 text-center text-white">Career Dashboard</h2>
              <p className="text-center text-sm mb-6 text-white/80">Your job search progress</p>
              
              {/* Quick Stats */}
              <div className="grid grid-cols-2 gap-3 mb-6">
                <motion.div 
                  initial={{ opacity: 0, scale: 0.8, y: 20 }} 
                  animate={{ opacity: 1, scale: 1, y: 0 }} 
                  transition={{ delay: 0.1, duration: 0.6 }}
                  className="bg-white/10 rounded-lg p-3 text-center"
                >
                  <motion.p 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="text-2xl font-bold text-white"
                  >
                    <CounterText target={24} delay={400} />
                  </motion.p>
                  <p className="text-xs text-white/70">Applications</p>
                </motion.div>
                <motion.div 
                  initial={{ opacity: 0, scale: 0.8, y: 20 }} 
                  animate={{ opacity: 1, scale: 1, y: 0 }} 
                  transition={{ delay: 0.2, duration: 0.6 }}
                  className="bg-white/10 rounded-lg p-3 text-center"
                >
                  <motion.p 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="text-2xl font-bold text-white"
                  >
                    <CounterText target={8} delay={500} />
                  </motion.p>
                  <p className="text-xs text-white/70">Interviews</p>
                </motion.div>
                <motion.div 
                  initial={{ opacity: 0, scale: 0.8, y: 20 }} 
                  animate={{ opacity: 1, scale: 1, y: 0 }} 
                  transition={{ delay: 0.3, duration: 0.6 }}
                  className="bg-white/10 rounded-lg p-3 text-center relative overflow-hidden"
                >
                  <motion.p 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="text-2xl font-bold text-white"
                  >
                    <CounterText target="73%" delay={600} />
                  </motion.p>
                  <p className="text-xs text-white/70">Response Rate</p>
                  {/* Progress bar background */}
                  <motion.div 
                    initial={{ width: 0 }} 
                    animate={{ width: '73%' }} 
                    transition={{ delay: 0.8, duration: 1.2, ease: "easeOut" }}
                    className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-green-400 to-cyan-400 rounded-full"
                  />
                </motion.div>
                <motion.div 
                  initial={{ opacity: 0, scale: 0.8, y: 20 }} 
                  animate={{ opacity: 1, scale: 1, y: 0 }} 
                  transition={{ delay: 0.4, duration: 0.6 }}
                  className="bg-white/10 rounded-lg p-3 text-center"
                >
                  <motion.p 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6 }}
                    className="text-2xl font-bold text-white"
                  >
                    <CounterText target={156} delay={700} />
                  </motion.p>
                  <p className="text-xs text-white/70">Profile Views</p>
                </motion.div>
              </div>

              {/* Recent Applications */}
              <div className="mb-6">
                <p className="text-xs mb-3 text-white/70">Recent Applications</p>
                <div className="space-y-2">
                  {[
                    { company: 'TechFlow', position: 'Senior Frontend Developer', status: 'Scheduled', color: 'text-white bg-blue-600/80' },
                    { company: 'DataVision', position: 'Full Stack Engineer', status: 'Under Review', color: 'text-black bg-yellow-400/90' },
                    { company: 'CloudBase', position: 'React Developer', status: 'Application Sent', color: 'text-white bg-purple-600/80' }
                  ].map((app, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.5 + i * 0.1 }}
                      className="bg-white/5 rounded-lg p-3 border border-white/10"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-medium text-white text-sm">{app.position}</p>
                          <p className="text-xs text-white/70">{app.company}</p>
                        </div>
                        <span className={`text-xs px-2 py-1 rounded-full font-medium ${app.color}`}>
                          {app.status}
                        </span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* AI Coaching Insights */}
              <div>
                <p className="text-xs mb-3 text-white/70">AI Coach Insights</p>
                <div className="bg-gradient-to-r from-purple-500/20 to-cyan-500/20 rounded-lg p-3 border border-purple-500/30">
                  <p className="text-white/90 text-sm">Your interview performance has improved by 40% this month. Keep practicing!</p>
                </div>
              </div>

              {/* Full Dashboard Button */}
              <div className="mt-6 pt-4 border-t border-white/10">
                <Button
                  onClick={() => navigate('/candidate-dashboard')}
                  className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white"
                >
                  <BarChart3 className="w-4 h-4 mr-2" />
                  View Full Dashboard
                </Button>
              </div>
            </div>
          </div>
        );
      } else {
        // Employer Dashboard (existing code)
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
                <motion.p 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6, duration: 0.5 }}
                  className="text-xs mb-2 text-white/70"
                >
                  Team Diversity
                </motion.p>
                <div className="flex items-center gap-2">
                  <div className="relative flex-1">
                    <div className="h-3 rounded-full bg-white/10 overflow-hidden">
                      <motion.div 
                        initial={{ width: 0, x: '-100%' }} 
                        animate={{ width: '55%', x: 0 }} 
                        transition={{ delay: 0.7, duration: 1.2, ease: "easeOut" }} 
                        className="h-3 rounded-full bg-gradient-to-r from-pink-400 to-purple-400 shadow-lg relative"
                      >
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: [0, 1, 0] }}
                          transition={{ delay: 1.5, duration: 1, repeat: 2 }}
                          className="absolute inset-0 bg-white/20 rounded-full"
                        />
                      </motion.div>
                    </div>
                  </div>
                  <motion.span 
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 1.2, duration: 0.4 }}
                    className="text-xs text-white/80 font-medium"
                  >
                    55% Women
                  </motion.span>
                </div>
                <div className="flex items-center gap-2 mt-2">
                  <div className="relative flex-1">
                    <div className="h-3 rounded-full bg-white/10 overflow-hidden">
                      <motion.div 
                        initial={{ width: 0, x: '-100%' }} 
                        animate={{ width: '40%', x: 0 }} 
                        transition={{ delay: 0.8, duration: 1.2, ease: "easeOut" }} 
                        className="h-3 rounded-full bg-gradient-to-r from-blue-400 to-green-400 shadow-lg relative"
                      >
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: [0, 1, 0] }}
                          transition={{ delay: 1.6, duration: 1, repeat: 2 }}
                          className="absolute inset-0 bg-white/20 rounded-full"
                        />
                      </motion.div>
                    </div>
                  </div>
                  <motion.span 
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 1.3, duration: 0.4 }}
                    className="text-xs text-white/80 font-medium"
                  >
                    40% Minorities
                  </motion.span>
                </div>
              </div>
              {/* Recent activity */}
              <div className="mb-6">
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

              {/* Full Dashboard Button */}
              <div className="mt-6 pt-4 border-t border-white/10">
                <Button
                  onClick={() => navigate('/employer-dashboard')}
                  className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white"
                >
                  <BarChart3 className="w-4 h-4 mr-2" />
                  View Full Dashboard
                </Button>
              </div>
            </div>
          </div>
        );
      }
    }

    if (item.id === 'upload_jobs') {
      return (
        <div className="w-full h-full p-6 overflow-hidden">
          <h2 className="text-2xl font-bold mb-4 text-center text-white">Post a Job</h2>
          <form onSubmit={e => { e.preventDefault(); handlePostAndVerify(); }} className="overflow-y-auto invisible-scrollbar h-[300px] space-y-4">
            {/* Expiration Date Picker */}
            <div className="space-y-2">
              <Label className="text-white text-sm">Expiration Date</Label>
              <DatePicker
                selected={expirationDate}
                onChange={date => setExpirationDate(date)}
                minDate={new Date()}
                customInput={<CustomInput />}
                dateFormat="yyyy-MM-dd"
                placeholderText="Select expiration date"
                className="bg-white/10 border-white/20 text-white placeholder-white placeholder-opacity-100 placeholder-white/90 text-sm h-9"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-white text-sm">Job Title</Label>
              <Input
                value={jobForm.title}
                onChange={(e) => handleJobFormChange('title', e.target.value)}
                placeholder="e.g. Senior Frontend Developer"
                className="bg-white/10 border-white/20 text-white placeholder-white placeholder-opacity-100 placeholder-white/90 text-sm h-9"
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
                  className="bg-white/10 border-white/20 text-white placeholder-white placeholder-opacity-100 placeholder-white/90 text-sm h-9"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label className="text-white text-sm">Job Type</Label>
                <select
                  value={jobForm.jobType}
                  onChange={(e) => handleJobFormChange('jobType', e.target.value)}
                  className="w-full bg-white/10 border border-white/20 rounded-md px-3 py-2 text-white placeholder-white placeholder-opacity-100 placeholder-white/90 text-sm h-9"
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
                  className="bg-white/10 border-white/20 text-white placeholder-white placeholder-opacity-100 placeholder-white/90 text-sm h-9"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-white text-sm">Max Salary ($)</Label>
                <Input
                  type="number"
                  value={jobForm.salaryMax}
                  onChange={(e) => handleJobFormChange('salaryMax', e.target.value)}
                  placeholder="120000"
                  className="bg-white/10 border-white/20 text-white placeholder-white placeholder-opacity-100 placeholder-white/90 text-sm h-9"
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
                className="w-full bg-white/10 border border-white/20 rounded-md px-3 py-2 text-white placeholder-white placeholder-opacity-100 placeholder-white/90 text-sm resize-none"
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
                className="w-full bg-white/10 border border-white/20 rounded-md px-3 py-2 text-white placeholder-white placeholder-opacity-100 placeholder-white/90 text-sm resize-none"
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
                className="w-full bg-white/10 border border-white/20 rounded-md px-3 py-2 text-white placeholder-white placeholder-opacity-100 placeholder-white/90 text-sm resize-none"
              />
            </div>

            <div className="pt-4 pb-6">
              <Button
  type="submit"
  className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white font-semibold py-2 px-4 rounded-lg text-sm flex items-center justify-center relative"
  disabled={isPostingToAlgorand}
>
  {isPostingToAlgorand ? (
    <>
      <span className="absolute left-4 flex items-center">
        <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
        </svg>
      </span>
      <span className="ml-6">Posting to Algorand...</span>
    </>
  ) : (
    <>
      <Upload className="w-4 h-4 mr-2" />
      Post Job
    </>
  )}
</Button>
{isPostingToAlgorand && (
  <div className="w-full mt-2">
    <Progress value={70} />
  </div>
)}

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
    // Prevent flipping back if expiration modal is open
    if (!flippedCardId || isExpirationModalOpen) return;
    // Only flip back if click is outside the card stack
    if (cardStackRef.current && !cardStackRef.current.contains(e.target)) {
      // Prevent flipping if expiration modal is open
      if (!isExpirationModalOpen) setFlippedCardId(null);
    }
  };

  // Set cards when userType changes
  useEffect(() => {
    if (userType === 'candidate') {
      setCards(candidateMenuItems.slice().reverse());
    } else if (userType === 'employer') {
      setCards(employerMenuItems.slice().reverse());
    } else {
      setCards([]);
    }
  }, [userType]);

  if (!userType) return <BrandedLoader fullScreen={true} message="Setting up your workspace..." />;


  return (
    <HubBackground userType={userType}>
      <div className="min-h-screen w-full flex flex-col items-center justify-center p-4 overflow-hidden relative" onClick={selectedMetric ? undefined : handleBackgroundClick}>
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

      <div ref={cardStackRef} className="relative w-[320px] h-[450px] flex items-center justify-center overflow-visible" style={{ perspective: '1000px' }}>
        <AnimatePresence initial={false}>
          {memoizedCards.map((item, index) => {
            const isTopCard = index === memoizedCards.length - 1;
            const isFlipped = flippedCardId === item.id;
            
            return (
              <motion.div
                key={item.id}
                className="absolute w-[320px] h-[400px] rounded-2xl shadow-2xl cursor-grab overflow-visible glass-effect border border-white/20 text-white"
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
                }}
              >
                {/* 3D Card Container */}
                <motion.div
                  className="relative w-full h-full"
                  style={{ transformStyle: 'preserve-3d' }}
                  animate={{ rotateY: isFlipped ? 180 : 0 }}
                  transition={{ duration: 0.6, type: "spring", stiffness: 200, damping: 25 }}
                >
                  {/* Front Face */}
                  <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${item.gradient} p-6 flex flex-col justify-between backface-hidden overflow-visible`}>
                    {/* Notification Badge */}
                    <NotificationBadge 
                      count={notifications[item.id] || 0}
                      className="z-40"
                    />
                    
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
                    style={{ transform: 'rotateY(180deg)' }}
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
            onClick={() => {
              setAiCoachOpen(false);
              // Optionally clear chat history when closing
              // setChatHistory([]);
            }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 50 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 50 }}
              transition={{ duration: 0.4, type: "spring", stiffness: 150, damping: 20 }}
              className="relative z-10 w-full max-w-6xl mx-auto p-6 max-h-[90vh] overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modern Glass Container */}
              <div className="bg-white/5 backdrop-blur-2xl rounded-3xl border border-white/10 shadow-2xl overflow-hidden">
                {/* Enhanced Header with Gradient */}
                <div className="relative px-8 py-6 bg-gradient-to-r from-blue-600/20 via-cyan-500/20 to-purple-600/20 border-b border-white/10">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <motion.div 
                        className="w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center shadow-lg"
                        animate={{ 
                          boxShadow: ['0 0 20px rgba(59, 130, 246, 0.5)', '0 0 30px rgba(6, 182, 212, 0.5)', '0 0 20px rgba(59, 130, 246, 0.5)']
                        }}
                        transition={{ repeat: Infinity, duration: 3 }}
                      >
                        <Bot className="w-8 h-8 text-white" />
                      </motion.div>
                      <div>
                        <h2 className="text-2xl font-bold bg-gradient-to-r from-white to-cyan-200 bg-clip-text text-transparent">
                          AI Career Coach
                        </h2>
                        <p className="text-gray-300 text-sm">Your personal AI assistant for career growth</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {/* Chat history counter */}
                      {chatHistory.length > 0 && (
                        <div className="flex items-center space-x-1 px-3 py-1 bg-white/10 rounded-full">
                          <MessageSquare className="w-4 h-4 text-cyan-400" />
                          <span className="text-sm text-white">{chatHistory.filter(msg => msg.type !== 'system').length}</span>
                        </div>
                      )}
                      {/* Clear chat button */}
                      {chatHistory.length > 0 && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setChatHistory([])}
                          className="text-white/70 hover:text-white hover:bg-white/10 rounded-full"
                          title="Clear chat history"
                        >
                          <RotateCcw className="w-4 h-4" />
                        </Button>
                      )}
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => setAiCoachOpen(false)}
                        className="text-white/70 hover:text-white hover:bg-white/10 rounded-full flex-shrink-0 w-10 h-10"
                      >
                        <X size={24} />
                      </Button>
                    </div>
                </div>

                {/* Main Content Area - Full Width Chat */}
                <div className="flex flex-col h-[70vh]">
                  {chatHistory.length === 0 ? (
                    <div className="flex-1 flex items-center justify-center relative overflow-hidden">
                      {/* Floating Background Suggestions */}
                      <div className="absolute inset-0 pointer-events-none">
                        {[
                          { text: "Resume Review", x: "15%", y: "20%", delay: 0, size: "text-sm", opacity: "opacity-30", cycleDuration: 8, pauseDuration: 6 },
                          { text: "Interview Tips", x: "80%", y: "15%", delay: 2, size: "text-xs", opacity: "opacity-20", cycleDuration: 10, pauseDuration: 4 },
                          { text: "Career Planning", x: "10%", y: "70%", delay: 5, size: "text-lg", opacity: "opacity-25", cycleDuration: 7, pauseDuration: 8 },
                          { text: "Salary Negotiation", x: "75%", y: "75%", delay: 3, size: "text-sm", opacity: "opacity-30", cycleDuration: 9, pauseDuration: 5 },
                          { text: "Skill Assessment", x: "85%", y: "45%", delay: 7, size: "text-xs", opacity: "opacity-15", cycleDuration: 6, pauseDuration: 7 },
                          { text: "Job Search Strategy", x: "5%", y: "45%", delay: 1, size: "text-sm", opacity: "opacity-25", cycleDuration: 11, pauseDuration: 3 },
                          { text: "Portfolio Review", x: "70%", y: "30%", delay: 4, size: "text-xs", opacity: "opacity-20", cycleDuration: 8, pauseDuration: 9 },
                          { text: "LinkedIn Optimization", x: "25%", y: "80%", delay: 6, size: "text-sm", opacity: "opacity-30", cycleDuration: 7, pauseDuration: 6 },
                          { text: "Mock Interview", x: "90%", y: "60%", delay: 8, size: "text-xs", opacity: "opacity-15", cycleDuration: 9, pauseDuration: 4 },
                          { text: "Cover Letter Help", x: "20%", y: "35%", delay: 2.5, size: "text-sm", opacity: "opacity-25", cycleDuration: 10, pauseDuration: 5 }
                        ].map((suggestion, index) => (
                          <motion.div
                            key={suggestion.text}
                            initial={{ opacity: 0, scale: 0.5, y: 50 }}
                            animate={{ 
                              opacity: [0, 1, 1, 1, 0],
                              scale: [0.5, 1, 1, 1, 0.8],
                              y: [50, 0, 0, 0, -30],
                              x: [0, 10, -5, 8, 0],
                              rotate: [0, 2, -1, 1, 0]
                            }}
                            transition={{ 
                              delay: suggestion.delay,
                              duration: suggestion.cycleDuration,
                              repeat: Infinity,
                              repeatDelay: suggestion.pauseDuration,
                              times: [0, 0.2, 0.6, 0.8, 1],
                              ease: "easeInOut",
                              x: { duration: suggestion.cycleDuration * 0.8, repeat: Infinity, ease: "easeInOut" },
                              rotate: { duration: suggestion.cycleDuration * 0.6, repeat: Infinity, ease: "easeInOut" }
                            }}
                            className={`absolute ${suggestion.opacity} text-white/60 font-medium ${suggestion.size} select-none`}
                            style={{
                              left: suggestion.x,
                              top: suggestion.y,
                              filter: 'blur(0.5px)',
                              willChange: 'transform, opacity'
                            }}
                          >
                            <div className="bg-white/5 backdrop-blur-sm rounded-full px-3 py-1 border border-white/10 shadow-lg">
                              {suggestion.text}
                            </div>
                          </motion.div>
                        ))}
                        
                        {/* Floating particles for extra ambience - Reduced for performance */}
                        {Array.from({ length: 6 }).map((_, i) => (
                          <motion.div
                            key={`particle-${i}`}
                            initial={{ opacity: 0 }}
                            animate={{ 
                              opacity: [0, 0.6, 0],
                              scale: [0.5, 1, 0.5],
                              x: [0, Math.random() * 200 - 100],
                              y: [0, Math.random() * 200 - 100],
                            }}
                            transition={{
                              duration: 8 + Math.random() * 4,
                              repeat: Infinity,
                              delay: i * 1.2,
                              ease: "easeInOut"
                            }}
                            className="absolute w-1 h-1 bg-cyan-400/30 rounded-full"
                            style={{
                              left: `${Math.random() * 100}%`,
                              top: `${Math.random() * 100}%`,
                              willChange: 'transform, opacity'
                            }}
                          />
                        ))}
                      </div>

                      {/* Perfectly Centered Input Area */}
                      <div className="w-full max-w-4xl px-8 relative z-10">
                        <AI_Prompt
                          prefill={aiCoachPrompt}
                          setPrefill={setAiCoachPrompt}
                          onSubmit={async (prompt, fileText) => {
                            // If fileText is present, append it to the prompt
                            const fullPrompt = fileText
                              ? `${prompt}\n\nResume:\n${fileText}`
                              : prompt;
                            await handleAICoachPrompt(fullPrompt);
                          }}
                          loading={aiCoachLoading}
                        />
                      </div>
                    </div>
                  ) : (
                    <>
                      {/* Chat Messages Area */}
                      <div className="flex-1 p-8 overflow-y-auto invisible-scrollbar">
                        <div className="space-y-6 max-w-4xl mx-auto">
                          {/* Chat History */}
                          {chatHistory.map((message) => (
                            <motion.div
                              key={message.id}
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ duration: 0.3 }}
                              className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                            >
                              {message.type === 'system' ? (
                                <div className="flex justify-center w-full mb-4">
                                  <div className="px-4 py-2 bg-blue-500/20 rounded-full border border-blue-500/30">
                                    <span className="text-blue-300 text-sm font-medium">{message.content}</span>
                                  </div>
                                </div>
                              ) : (
                                <div className={`flex items-start space-x-4 max-w-[85%] ${message.type === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                                  <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                                    message.type === 'user' 
                                      ? 'bg-gradient-to-r from-purple-500 to-pink-500' 
                                      : message.type === 'error'
                                      ? 'bg-gradient-to-r from-red-500 to-red-600'
                                      : 'bg-gradient-to-r from-blue-500 to-cyan-500'
                                  }`}>
                                    {message.type === 'user' ? (
                                      <User className="w-5 h-5 text-white" />
                                    ) : message.type === 'error' ? (
                                      <AlertCircle className="w-5 h-5 text-white" />
                                    ) : (
                                      <Bot className="w-5 h-5 text-white" />
                                    )}
                                  </div>
                                  <div className={`rounded-2xl p-5 border ${
                                    message.type === 'user'
                                      ? 'bg-gradient-to-r from-purple-500/20 to-pink-500/20 border-purple-500/30 text-white'
                                      : message.type === 'error'
                                      ? 'bg-red-500/10 border-red-500/20 text-red-300'
                                      : 'bg-white/5 border-white/10 text-white'
                                  }`}>
                                    <div className="whitespace-pre-line leading-relaxed">{message.content}</div>
                                    <div className="text-xs opacity-50 mt-3">
                                      {message.timestamp.toLocaleTimeString()}
                                    </div>
                                  </div>
                                </div>
                              )}
                            </motion.div>
                          ))}
                          
                          {/* Loading indicator */}
                          {aiCoachLoading && (
                            <motion.div
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              className="flex items-start space-x-4"
                            >
                              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center flex-shrink-0">
                                <Bot className="w-5 h-5 text-white" />
                              </div>
                              <div className="bg-white/5 rounded-2xl p-5 border border-white/10">
                                <div className="flex items-center space-x-3">
                                  <div className="flex space-x-1">
                                    <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce"></div>
                                    <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                                    <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                                  </div>
                                  <span className="text-cyan-300">Thinking...</span>
                                </div>
                              </div>
                            </motion.div>
                          )}
                          
                          {/* Auto-scroll anchor */}
                          <div ref={chatEndRef} />
                        </div>
                      </div>

                      {/* Bottom Input Area for Chat Mode */}
                      <div className="p-8 border-t border-white/10 bg-white/5">
                        <div className="max-w-4xl mx-auto">
                          <AI_Prompt
                            prefill={aiCoachPrompt}
                            setPrefill={setAiCoachPrompt}
                            onSubmit={async (prompt, fileText) => {
                              // If fileText is present, append it to the prompt
                              const fullPrompt = fileText
                                ? `${prompt}\n\nResume:\n${fileText}`
                                : prompt;
                              await handleAICoachPrompt(fullPrompt);
                            }}
                            loading={aiCoachLoading}
                          />
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
    </HubBackground>
  );
};

export default HubPage;

// Add this component at the bottom of the file (outside HubPage)
const promptSuggestionsList = [
  "'Can you review my resume?'",
  "'Give me a mock interview for a frontend developer.'",
  "'What career paths fit my skills?'"
];

function PromptSuggestions() {
  const [index, setIndex] = React.useState(0);
  const [fade, setFade] = React.useState(true);
  React.useEffect(() => {
    const timeout = setTimeout(() => setFade(false), 3200);
    const interval = setInterval(() => {
      setFade(false);
      setTimeout(() => {
        setIndex(i => (i + 1) % promptSuggestionsList.length);
        setFade(true);
      }, 400);
    }, 4000);
    return () => {
      clearTimeout(timeout);
      clearInterval(interval);
    };
  }, []);
  return (
    <div className="w-full flex justify-center sticky bottom-0 z-30 pointer-events-none select-none" aria-live="polite">
      <div
        className={
          `flex items-center gap-2 px-5 py-3 rounded-2xl shadow-lg bg-gradient-to-r from-cyan-700/80 to-blue-800/80 border-2 border-cyan-400/40 relative animate-glow` +
          (fade ? ' opacity-100 translate-y-0' : ' opacity-0 -translate-y-2')
        }
        style={{
          minHeight: 40,
          transition: 'opacity 0.4s, transform 0.4s',
          boxShadow: '0 0 16px 2px #22d3ee55, 0 2px 24px 0 #0ea5e955',
          pointerEvents: 'auto',
        }}
        key={index}
      >
        <span className="flex items-center justify-center w-7 h-7 rounded-full bg-cyan-500/80 mr-2 shadow-md animate-pulse">
          <Sparkles className="w-4 h-4 text-white" />
        </span>
        <span className="text-base font-medium text-cyan-100 drop-shadow-sm tracking-wide">
          {promptSuggestionsList[index]}
        </span>
      </div>
      <style>{`
        @keyframes glow {
          0% { box-shadow: 0 0 16px 2px #22d3ee55, 0 2px 24px 0 #0ea5e955; }
          50% { box-shadow: 0 0 32px 8px #22d3eeaa, 0 2px 32px 0 #0ea5e9aa; }
          100% { box-shadow: 0 0 16px 2px #22d3ee55, 0 2px 24px 0 #0ea5e955; }
        }
        .animate-glow { animation: glow 2.5s ease-in-out infinite; }
      `}</style>
    </div>
  );
}