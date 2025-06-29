import React, { useState, useEffect, useRef } from 'react';
import { 
  User, Building2, MapPin, DollarSign, 
  Briefcase, Star, CheckCircle, Clock 
} from "lucide-react";
import ProfileSummary from "./onboarding/ProfileSummary";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import "../hide-scrollbar.css";
import { saveProfileToSupabase } from "../utils/saveProfileToSupabase";
import { supabase } from "../supabaseClient";

const HirlyOnboarding = () => {
  // Check if user came from Google sign-in
  const [isGoogleAuth, setIsGoogleAuth] = useState(false);
  const [googleUserData, setGoogleUserData] = useState(null);
  
  // ...existing state
  const [signupLoading, setSignupLoading] = useState(false);
  const [signupError, setSignupError] = useState(null);



  // Modal state for profile summary
  const [showProfileModal, setShowProfileModal] = useState(false);
  // Password visibility toggle
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  // Main state variables
  const [messages, setMessages] = useState([]);
  const [step, setStep] = useState(0);
  const [showTyping, setShowTyping] = useState(false);
  const [userProfile, setUserProfile] = useState({});
  const [isComplete, setIsComplete] = useState(false);
  const [currentOptions, setCurrentOptions] = useState([]);
  const [steps, setSteps] = useState(() => getStepConfig(undefined, false)); // Only declaration of steps, do not redeclare below
  const [textInputValue, setTextInputValue] = useState("");
  
  const chatEndRef = useRef(null);

  // Check for Google authentication on component mount
  useEffect(() => {
    const checkGoogleAuth = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const isFromGoogle = urlParams.get('google') === 'true';
      
      if (isFromGoogle) {
        // Get the current user from Supabase
        const { data: { user }, error } = await supabase.auth.getUser();
        if (user && !error) {
          setIsGoogleAuth(true);
          setGoogleUserData(user);
          
          // Pre-populate user profile with Google data
          setUserProfile(prev => ({
            ...prev,
            email: user.email,
            name: user.user_metadata?.full_name || user.email.split('@')[0]
          }));
          
          // Set up steps for Google users (skip auth)
          const newSteps = getStepConfig(undefined, true);
          setSteps(newSteps);
          
          // Skip to user type selection step  
          const userTypeStepIndex = newSteps.findIndex(step => step.id === 'userType');
          if (userTypeStepIndex >= 0) {
            setStep(userTypeStepIndex);
            setMessages([
              {
                type: 'bot',
                text: `Welcome ${user.user_metadata?.full_name || 'there'}! 🎉 I'm Heidi, your AI guide at Hirly. Since you're already signed in with Google, let's jump right into setting up your profile!`,
                delay: 1200
              }
            ]);
          }
        }
      }
    };
    
    checkGoogleAuth();
  }, []);

  // Handle completion - navigate to hub
  useEffect(() => {
    if (isComplete) {
      setTimeout(() => {
        navigate('/hub');
      }, 2000); // Give user time to see completion message
    }
  }, [isComplete, navigate]);

  // Helper to get step config based on userType
  function getStepConfig(userType, skipAuth = false) {
    // Base steps without auth for Google users
    const baseStepsWithoutAuth = [
      {
        id: 'welcome',
        type: 'bot',
        text: "Hey there! I'm Heidi, your friendly AI guide at Hirly! 🎉 I'm here to help you set up your profile so you can start connecting with the perfect matches. Ready to dive in?",
        delay: 1200
      },
      {
        id: 'userType',
        type: 'option',
        text: "Are you looking to find your next opportunity or hire amazing talent?",
        options: ["🎯 I'm looking for jobs (Candidate)", "🏢 I'm hiring talent (Employer)"],
        key: 'userType'
      },
      {
        id: 'askName',
        type: 'text',
        text: "Great, tell us your name?",
        key: 'name',
      },
    ];
    
    // Base steps with auth for regular users
    const baseStepsWithAuth = [
      {
        id: 'welcome',
        type: 'bot',
        text: "Hey there! I'm Heidi, your friendly AI guide at Hirly! 🎉 I'm here to help you set up your profile so you can start connecting with the perfect matches. Ready to dive in?",
        delay: 1200
      },
      {
        id: 'askEmail',
        type: 'text',
        text: "Let's start by setting up your account. What's your email address?",
        key: 'email',
        inputType: 'email',
        required: true,
      },
      {
        id: 'askPassword',
        type: 'text',
        text: "Great! Please choose a password.",
        key: 'password',
        inputType: 'password',
        required: true,
      },
      {
        id: 'userType',
        type: 'option',
        text: "Are you looking to find your next opportunity or hire amazing talent?",
        options: ["🎯 I'm looking for jobs (Candidate)", "🏢 I'm hiring talent (Employer)"],
        key: 'userType'
      },
      {
        id: 'askName',
        type: 'text',
        text: "Great, tell us your name?",
        key: 'name',
      },
    ];
    
    const baseSteps = skipAuth ? baseStepsWithoutAuth : baseStepsWithAuth;
    
    // Add profile picture step to base steps
    baseSteps.push({
      id: 'profilePic',
      type: 'file',
      text: "Want to add a profile picture? (Optional)",
      key: 'profilePic',
      accept: 'image/*',
      skip: true,
      candidateOnly: true
    });

    const candidateSteps = [
      {
        id: 'candidateRoles',
        type: 'option',
        text: "Awesome! What type of roles are you most excited about? Feel free to pick what resonates with you! ✨",
        options: [
          "⚡ Engineering & Tech",
          "🎨 Design & Creative", 
          "📈 Marketing & Growth",
          "💼 Business & Strategy",
          "📊 Data & Analytics",
          "🌟 Other/Multiple"
        ],
        key: 'roles'
      },
      {
        id: 'experience',
        type: 'option',
        text: "Perfect! Now let's talk about your experience level. Where are you in your career journey?",
        options: [
          "🌱 Just getting started (0-2 years)",
          "🚀 Building momentum (2-5 years)",
          "⭐ Seasoned professional (5+ years)",
          "👑 Leading the way (10+ years)"
        ],
        key: 'experience'
      },
      {
        id: 'workLocation',
        type: 'option',
        text: "Great choice! How do you prefer to work? The world is your office these days! 🌍",
        options: [
          "🏠 Remote only",
          "🏢 Office only", 
          "🔄 Hybrid (best of both)",
          "🤷 Open to anything"
        ],
        key: 'workLocation'
      },
      {
        id: 'salaryRange',
        type: 'option',
        text: "Almost there! What salary range are you targeting? This helps us match you with the right opportunities! 💰",
        options: [
          "💵 $40k-60k",
          "💳 $60k-80k",
          "💎 $80k-120k",
          "🚀 $120k+",
          "🤔 Not sure yet"
        ],
        key: 'salaryRange'
      },
      // New: Resume upload (candidate only)
      {
        id: 'resumeUpload',
        type: 'file',
        text: "Upload your resume to help us match you better! (Optional)",
        key: 'resume',
        accept: '.pdf,.doc,.docx',
        skip: true,
        candidateOnly: true
      }
    ];

    const employerSteps = [
      {
        id: 'companySize',
        type: 'option',
        text: "Excellent! Tell me about your company size. This helps us understand your hiring needs! 🏢",
        options: [
          "🚀 Startup (1-10 people)",
          "📈 Growing company (11-50)",
          "🏗️ Established company (50-200)",
          "🏙️ Enterprise (200+ people)"
        ],
        key: 'companySize'
      },
      {
        id: 'hiringRoles',
        type: 'option',
        text: "Perfect! What types of roles are you looking to fill? Choose what matches your current needs! 🎯",
        options: [
          "⚡ Engineering & Tech",
          "🎨 Design & Creative",
          "📈 Marketing & Growth", 
          "💼 Business & Strategy",
          "📊 Data & Analytics",
          "🌟 Multiple roles"
        ],
        key: 'hiringRoles'
      },
      {
        id: 'urgency',
        type: 'option',
        text: "Got it! How quickly do you need to fill these positions? ⏰",
        options: [
          "🔥 ASAP (within 2 weeks)",
          "⚡ Soon (within a month)",
          "📅 Standard timeline (1-3 months)",
          "🔍 Just exploring options"
        ],
        key: 'urgency'
      },
      {
        id: 'budget',
        type: 'option',
        text: "Almost done! What's your budget range for these hires? This helps us find candidates in your range! 💼",
        options: [
          "💵 $40k-60k",
          "💳 $60k-80k", 
          "💎 $80k-120k",
          "🚀 $120k+",
          "📊 Varies by role"
        ],
        key: 'budget'
      }
    ];

    const completionSteps = [
      {
        id: 'final',
        type: 'bot',
        text: userProfile.userType === 'Candidate' 
          ? "You're all set! 🎉 Your profile is ready and you can start swiping to find your dream job. Welcome to the future of job matching!"
          : "You're all set! 🎉 Your company profile is ready and you can start discovering amazing talent. Welcome to the future of recruiting!",
        delay: 800
      }
    ];

    if (userProfile.userType === 'Candidate') {
      return [...baseSteps, ...candidateSteps, ...completionSteps];
    } else if (userProfile.userType === 'Employer') {
      return [...baseSteps, ...employerSteps, ...completionSteps];
    } else {
      return baseSteps;
    }
  };



  // Calculate realistic typing delays
  const getTypingDelay = (text, messageType = 'normal') => {
    // More realistic, slightly longer thinking time
    const baseThinkingTime = 1200; // was 600
    const typingSpeed = 40; // was 25
    const complexityBonus = text.includes('?') ? 400 : 0; // was 200
    
    const delays = {
      welcome: 1800,
      thinking: 1200,
      quick: 600,
      normal: baseThinkingTime + (text.length * typingSpeed) + complexityBonus
    };
    
    return delays[messageType] || delays.normal;
  };

  // Main chat flow effect
  useEffect(() => {
    if (step >= steps.length) {
      setIsComplete(true);
      setShowProfileModal(true); // Show modal when complete
      setCurrentOptions([]);
      setShowTyping(false);
      return;
    }
    const current = steps[step];
    if (current.type === 'text') {
      setShowTyping(false);
      return; // Wait for user to submit text input
    }
    if (current.type === 'bot') {
      setShowTyping(true);
      setCurrentOptions([]);
      const timer = setTimeout(() => {
        setMessages(prev => {
          // Only add if not already present at this step
          if (prev.length > 0 && prev[prev.length - 1].type === 'bot' && prev[prev.length - 1].text === current.text) {
            setShowTyping(false);
            return prev;
          }
          setShowTyping(false);
          return [...prev, { type: 'bot', text: current.text }];
        });
        setStep(s => s + 1); // Only increment for bot steps
      }, current.delay || getTypingDelay(current.text));
      return () => clearTimeout(timer);
    } else if (current.type === 'option') {
      // Only add the option message if not already present
      setMessages(prev => {
        if (prev.length > 0 && prev[prev.length - 1].text === current.text) {
          return prev;
        }
        return [...prev, { type: 'bot', text: current.text }];
      });
      setCurrentOptions(current.options);
      setShowTyping(false);
      // Do NOT increment step for option steps! Wait for user to select.
    }
  }, [step, steps]);

  // Only clear options when entering a text step (prevents flicker)
  useEffect(() => {
    if (steps[step] && steps[step].type === 'text') {
      setCurrentOptions([]);
    }
  }, [step, steps]);

  // When userType is selected, advance to askName (name input) step
  useEffect(() => {
    if (!userProfile.userType) return;
    // Build new steps array for chosen userType
    const newSteps = getStepConfig(userProfile.userType, isGoogleAuth);
    setSteps(newSteps);
    // Only update step and options, do NOT reset messages (preserve chat history)
    // Find the index of 'askName' step to jump to after userType selection
    const nameStepIdx = newSteps.findIndex(s => s.key === 'name');
    setStep(nameStepIdx !== -1 ? nameStepIdx : 0);
    setCurrentOptions([]);
    setIsComplete(false);
    setShowTyping(false);
    setTextInputValue("");
  }, [userProfile.userType]);

  // When userType is selected, reset flow to avoid duplicate greetings and ensure options are shown
  // Option selection handler
  const handleOptionClick = (selectedOption) => {
    setMessages(prev => [...prev, { type: 'user', text: selectedOption }]);
    
    const current = steps[step];
    if (current.key) {
      setUserProfile(prev => {
        const newProfile = { ...prev };
        if (current.key === 'userType') {
          newProfile.userType = selectedOption.includes('Candidate') ? 'Candidate' : 'Employer';
        } else {
          newProfile[current.key] = selectedOption;
        }
        return newProfile;
      });
    }
    
    // Only increment step if NOT userType step
    if (!(current.key === 'userType')) {
      setTimeout(() => setStep(s => s + 1), 300 + Math.random() * 200);
    }
  };

  // Helper to check if email exists via backend
  const checkEmailExists = async (email) => {
    try {
      const res = await fetch('http://localhost:5001/api/check-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      return data.exists;
    } catch (err) {
      return false; // Fail open (treat as not existing)
    }
  };

  // Handle text input submit for all text input steps
  const handleTextInputSubmit = async (e) => {
    e.preventDefault();
    const current = steps[step];
    if (current.type === 'text' && current.key && textInputValue.trim()) {
      if (current.key === 'email') {
        const exists = await checkEmailExists(textInputValue.trim());
        if (exists) {
          pushBotMessage('Oops! That email is already registered. Want to <a href="/login" class="text-purple-600 underline">sign in here</a> instead?', true);
          setTextInputValue('');
          return;
        }
      }
      setMessages(prev => ([...prev, { type: 'user', text: textInputValue.trim() }]));
      setUserProfile(prev => ({ ...prev, [current.key]: textInputValue.trim() }));
      setTextInputValue("");
      setTimeout(() => setStep(s => s + 1), 200); // Small delay for realism
    }
  };


  // Auto-scroll to bottom
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, showTyping]);

  // Helper to push a bot message
  const pushBotMessage = (text, isHtml = false) => {
    setMessages(prev => [...prev, { type: 'bot', text, isHtml }]);
  };

  // Save profile to Supabase (with Supabase Auth signup)
  const handleSaveProfile = async () => {
    // Skip account creation for Google users (they're already authenticated)
    if (isGoogleAuth) {
      // 2. Save profile to Supabase for Google users
      const profileData = {
        ...userProfile,
        profilePicUrl: userProfile.profilePic && typeof userProfile.profilePic === 'string' ? userProfile.profilePic : null,
        resumeUrl: userProfile.resume && typeof userProfile.resume === 'string' ? userProfile.resume : null,
      };
      const { error } = await saveProfileToSupabase(profileData);
      if (error) {
        setSignupError('Error saving profile: ' + error.message);
      } else {
        setIsComplete(true);
      }
      return;
    }

    // 1. Sign up user with Supabase Auth using collected email and password
    console.log("Signing up with profile:", userProfile);
    if (!userProfile.email || !userProfile.password) {
      alert('Email and password are required.');
      return;
    }
    // Sign up user
    const { data, error: signupError } = await supabase.auth.signUp({
      email: userProfile.email,
      password: userProfile.password,
      options: {
        data: { userType: userProfile.userType && userProfile.userType.toLowerCase() }
      }
    });
    if (signupError) {
      // Handle duplicate email gracefully
      if (signupError.message && signupError.message.toLowerCase().includes('already registered')) {
        setShowProfileModal(false);
        pushBotMessage('Oops! That email is already registered. Want to <a href="/login" class="text-purple-600 underline">sign in here</a> instead?', true);
        // Optionally, reset step to email step:
        // setStep(steps.findIndex(s => s.key === 'email'));
        return;
      }
      setSignupError('Error creating account: ' + signupError.message);
      return;
    }

    // 2. Save profile to Supabase (convert File objects to null or placeholder for now)
    const profileData = {
      ...userProfile,
      profilePicUrl: userProfile.profilePic && typeof userProfile.profilePic === 'string' ? userProfile.profilePic : null,
      resumeUrl: userProfile.resume && typeof userProfile.resume === 'string' ? userProfile.resume : null,
    };
    const { error } = await saveProfileToSupabase(profileData);
    if (error) {
      setSignupError('Error saving profile: ' + error.message);
    } else {
      setIsComplete(true);
    }
  };

  // Components
  const HirlyBotMessage = ({ text, isTyping, isHtml }) => (
    <div className="flex mb-4 animate-slideInLeft">
      <div className="bg-gradient-to-r from-purple-700 to-pink-600 text-white p-4 rounded-2xl rounded-tl-sm max-w-xs">
        {isTyping ? (
          <span className="animate-pulse">Heidi is typing...</span>
        ) : isHtml ? (
          <span dangerouslySetInnerHTML={{ __html: text }} />
        ) : (
          <span>{text}</span>
        )}
      </div>
    </div>
  );

  const UserMessage = ({ text, stepIndex }) => {
    // Find the step key for this message
    let key = null;
    if (typeof stepIndex === 'number' && steps[stepIndex] && steps[stepIndex].key) {
      key = steps[stepIndex].key;
    }
    const isPassword = key === 'password';
    return (
      <div className="flex justify-end mb-4 animate-slideInRight">
        <div className="bg-gray-800 text-white p-4 rounded-2xl rounded-tr-sm max-w-xs">
          <p>{isPassword ? '••••••••' : text}</p>
        </div>
      </div>
    );
  };

  const ChatOption = ({ option, onClick, disabled }) => (
    <button
      onClick={() => onClick(option)}
      disabled={disabled}
      className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white p-3 rounded-xl mb-2 hover:scale-105 transform transition-all duration-200 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed text-left"
    >
      {option}
    </button>
  );

  const ProgressBar = () => {
    const progress = (step / steps.length) * 100;
    return (
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-600">Progress</span>
          <span className="text-sm text-gray-500">Step {step} of {steps.length}</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="max-w-lg mx-auto min-h-[80vh] max-h-[90vh] h-[90vh] rounded-3xl shadow-2xl flex flex-col overflow-hidden glassmorphic-onboarding"
    >
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white p-6 text-center">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-pink-400 via-fuchsia-400 to-purple-400 text-transparent bg-clip-text drop-shadow">Hirly</h1>
        <p className="text-purple-100 mt-1">Let's get you set up for success</p>
      </div>


      {/* Chat Messages (scrollable) */}
      <div className="flex-1 overflow-y-auto hide-scrollbar p-6">
        {messages.map((message, index) => (
          message.type === 'bot' ? (
            <HirlyBotMessage key={index} text={message.text} isHtml={message.isHtml} />
          ) : (
            <UserMessage key={index} text={message.text} stepIndex={index} />
          )
        ))}
        {showTyping && <HirlyBotMessage isTyping={true} />}
        <div ref={chatEndRef} />
      </div>

      {/* Answer Section (fixed, independently scrollable if needed, invisible scrollbar) */}
      <div className="bg-gradient-to-b from-purple-900/60 to-purple-800/20 backdrop-blur-lg p-6 border-t border-white/10 hide-scrollbar" style={{ minHeight: '90px', maxHeight: '220px', overflowY: 'auto' }}>
        {steps[step] && steps[step].type === 'text' && !isComplete && (
          <div>
            <div className="mb-2 text-white font-medium">
              {steps[step].text}
            </div>
            <form className="flex gap-2" onSubmit={handleTextInputSubmit} autoComplete="off">
              <div className="relative w-full">
                <input
                  type={steps[step].inputType === "password" && !showPassword ? "password" : "text"}
                  className="w-full rounded-lg border border-gray-300 p-3 focus:outline-none focus:ring-2 focus:ring-pink-500 bg-gray-50 text-gray-900 placeholder-gray-400"
                  placeholder={steps[step].inputType === "password" ? "Create a password..." : "Type your answer..."}
                  value={textInputValue}
                  onChange={e => setTextInputValue(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && handleTextInputSubmit(e)}
                  autoFocus
                />
                {steps[step].inputType === "password" && (
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700"
                    onClick={() => setShowPassword(p => !p)}
                    tabIndex={-1}
                  >
                    {showPassword ? (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.542-7a9.973 9.973 0 012.042-3.368M6.36 6.36A9.956 9.956 0 0112 5c4.478 0 8.268 2.943 9.542 7a9.973 9.973 0 01-4.043 5.197M15 12a3 3 0 11-6 0 3 3 0 016 0zm6 6L6 6" /></svg>
                    )}
                  </button>
                )}
              </div>
              <button
                type="submit"
                className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-2 rounded-lg font-semibold shadow-md hover:from-purple-400 hover:to-pink-400 disabled:opacity-60"
                disabled={showTyping || !textInputValue.trim()}
              >Continue</button>
            </form>
          </div>
        )}
        {steps[step] && steps[step].type === 'file' && !isComplete && (
          <div>
            <div className="mb-2 text-white font-medium">
              {steps[step].text}
            </div>
            <form className="flex flex-col gap-3 items-start" onSubmit={e => e.preventDefault()}>
              <input
                type="file"
                accept={steps[step].accept}
                className="block w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100"
                onChange={e => {
                  const file = e.target.files[0];
                  if (file) {
                    setUserProfile(prev => ({ ...prev, [steps[step].key]: file }));
                  }
                  setTimeout(() => setStep(s => s + 1), 300);
                }}
                disabled={showTyping}
              />
              <button
                type="button"
                className="mt-1 text-sm text-purple-400 underline hover:text-pink-400"
                onClick={() => setStep(s => s + 1)}
                disabled={showTyping}
              >Skip</button>
            </form>
          </div>
        )}
        {currentOptions.length > 0 && (
          <div className="flex flex-wrap gap-3">
            {currentOptions.map((option, index) => (
              <ChatOption
                key={index}
                option={option}
                onClick={handleOptionClick}
                disabled={showTyping}
              />
            ))}
          </div>
        )}
      </div>

      {/* Profile Summary Modal - show at end */}
      {showProfileModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm absolute">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-8 relative">
            <button
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-700 text-2xl font-bold"
              onClick={() => setShowProfileModal(false)}
              aria-label="Close"
            >×</button>
            <ProfileSummary profile={userProfile} />
            <button
              className={`mt-6 w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-3 rounded-xl font-bold text-lg shadow-lg hover:scale-105 transform transition-all ${signupLoading ? 'opacity-60 cursor-not-allowed' : ''}`}
              onClick={async () => {
                setSignupError(null);
                setSignupLoading(true);
                try {
                  await handleSaveProfile();
                  sessionStorage.setItem('userType', userProfile.userType);
                  setShowProfileModal(false);
                  if (userProfile.userType) {
                    sessionStorage.setItem('userType', userProfile.userType.toLowerCase());
                  }
                  navigate('/hub');
                } catch (err) {
                  setSignupError(err?.message || 'Signup failed.');
                } finally {
                  setSignupLoading(false);
                }
              }}
              disabled={signupLoading}
            >
              {signupLoading ? 'Signing up...' : 'Get Started!'}
            </button>
            {signupError && (
              <div className="mt-2 text-red-500 text-center text-sm font-semibold">{signupError}</div>
            )}
          </div>
        </div>
      )}
    </motion.div>
  );
}
export default HirlyOnboarding;