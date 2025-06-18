import React, { useState, useEffect, useRef } from 'react';
import { 
  User, Building2, MapPin, DollarSign, 
  Briefcase, Star, CheckCircle, Clock 
} from "lucide-react";
import ProfileSummary from "./onboarding/ProfileSummary";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const HirlyOnboarding = () => {
  // Modal state for profile summary
  const [showProfileModal, setShowProfileModal] = useState(false);
  const navigate = useNavigate();
  // Main state variables
  const [messages, setMessages] = useState([]);
  const [step, setStep] = useState(0);
  const [showTyping, setShowTyping] = useState(false);
  const [userProfile, setUserProfile] = useState({});
  const [isComplete, setIsComplete] = useState(false);
  const [currentOptions, setCurrentOptions] = useState([]);
  const [steps, setSteps] = useState(() => getStepConfig(undefined)); // Only declaration of steps, do not redeclare below
  const [textInputValue, setTextInputValue] = useState("");
  
  const chatEndRef = useRef(null);

  // Helper to get step config based on userType
  function getStepConfig(userType) {
    const baseSteps = [
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
      }
    ];

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
    const newSteps = getStepConfig(userProfile.userType);
    setSteps(newSteps);
    // Only update step and options, do NOT reset messages (preserve chat history)
    setStep(2); // Step 2 is askName (name input)
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

  // Handle text input submit for name step
  const handleTextInputSubmit = (e) => {
    e.preventDefault();
    const current = steps[step];
    if (current.type === 'text' && current.key === 'name' && textInputValue.trim()) {
      setMessages(prev => ([...prev, { type: 'user', text: textInputValue.trim() }]));
      setUserProfile(prev => ({ ...prev, name: textInputValue.trim() }));
      setTextInputValue("");
      setTimeout(() => setStep(s => s + 1), 200); // Small delay for realism
    }
  };

  // Auto-scroll to bottom
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, showTyping]);

  // Save profile function (ready for API integration)
  const handleSaveProfile = () => {
    // Simulate save
    setTimeout(() => {
      setIsComplete(true);
    }, 800);
  };

  // Components
  const HirlyBotMessage = ({ text, isTyping = false }) => (
    <div className="flex items-start space-x-3 mb-4 animate-fadeIn">
      <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center flex-shrink-0">
        <span className="text-white text-sm font-bold">H</span>
      </div>
      <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-4 rounded-2xl rounded-tl-sm max-w-xs">
        {isTyping ? (
          <div className="flex space-x-1">
            <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"></div>
            <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
            <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
          </div>
        ) : (
          <p className="text-gray-700">{text}</p>
        )}
      </div>
    </div>
  );

  const UserMessage = ({ text }) => (
    <div className="flex justify-end mb-4 animate-slideInRight">
      <div className="bg-gray-800 text-white p-4 rounded-2xl rounded-tr-sm max-w-xs">
        <p>{text}</p>
      </div>
    </div>
  );

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
      <div className="flex-1 overflow-y-auto scrollbar-none p-6">
        {messages.map((message, index) => (
          message.type === 'bot' ? (
            <HirlyBotMessage key={index} text={message.text} />
          ) : (
            <UserMessage key={index} text={message.text} />
          )
        ))}
        {showTyping && <HirlyBotMessage isTyping={true} />}
        <div ref={chatEndRef} />
      </div>

      {/* Answer Section (fixed, independently scrollable if needed, invisible scrollbar) */}
      <div className="bg-gradient-to-b from-purple-900/60 to-purple-800/20 backdrop-blur-lg p-6 border-t border-white/10 scrollbar-none" style={{ minHeight: '90px', maxHeight: '220px', overflowY: 'auto' }}>
        {steps[step] && steps[step].type === 'text' && !isComplete && (
          <div>
            <div className="mb-2 text-white font-medium">
              {steps[step].text}
            </div>
            <form className="flex gap-2" onSubmit={handleTextInputSubmit} autoComplete="off">
              <input
                type="text"
                className="flex-1 rounded-lg border border-purple-200 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-400 bg-white/80 text-gray-900 placeholder-gray-400"
                placeholder="Enter your name..."
                value={textInputValue}
                onChange={e => setTextInputValue(e.target.value)}
                disabled={showTyping}
                required
                maxLength={32}
              />
              <button
                type="submit"
                className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-2 rounded-lg font-semibold shadow-md hover:from-purple-400 hover:to-pink-400 disabled:opacity-60"
                disabled={showTyping || !textInputValue.trim()}
              >Continue</button>
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
              className="mt-6 w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-3 rounded-xl font-bold text-lg shadow-lg hover:scale-105 transform transition-all"
              onClick={() => {
                sessionStorage.setItem('userType', userProfile.userType);
                setShowProfileModal(false);
                if (userProfile.userType) {
                  sessionStorage.setItem('userType', userProfile.userType.toLowerCase());
                }
                navigate('/hub');
              }}
            >
              Get Started!
            </button>
          </div>
        </div>
      )}
    </motion.div>
  );
}
export default HirlyOnboarding;