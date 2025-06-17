import React, { useState, useEffect, useRef } from 'react';
import { 
  User, Building2, MapPin, DollarSign, 
  Briefcase, Star, CheckCircle, Clock 
} from "lucide-react";

const HirlyOnboarding = () => {
  // Main state variables
  const [messages, setMessages] = useState([]);
  const [step, setStep] = useState(0);
  const [showTyping, setShowTyping] = useState(false);
  const [userProfile, setUserProfile] = useState({});
  const [isComplete, setIsComplete] = useState(false);
  const [currentOptions, setCurrentOptions] = useState([]);
  const [steps, setSteps] = useState(() => getStepConfig(undefined)); // Only declaration of steps, do not redeclare below
  
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
        text: "First things first - are you looking to find your next opportunity or hire amazing talent?",
        options: ["🎯 I'm looking for jobs (Candidate)", "🏢 I'm hiring talent (Employer)"],
        key: 'userType'
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
      setCurrentOptions([]);
      setShowTyping(false);
      return;
    }
    const current = steps[step];
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

  // When userType is selected, reset flow to avoid duplicate greetings and ensure options are shown
  useEffect(() => {
    if (!userProfile.userType) return;
    // Build new steps array for chosen userType
    const newSteps = getStepConfig(userProfile.userType);
    setSteps(newSteps);
    // Rebuild messages to include greeting, userType question, and user answer
    setMessages([
      { type: 'bot', text: newSteps[0].text },
      { type: 'bot', text: newSteps[1].text },
      { type: 'user', text: userProfile.userType === 'Candidate' ? " I'm looking for jobs (Candidate)" : " I'm hiring talent (Employer)" }
    ]);
    setStep(2); // Start at first candidate/employer-specific question
    setCurrentOptions([]);
    setIsComplete(false);
    setShowTyping(false);
  }, [userProfile.userType]);


  // Option selection handler
  const handleOptionSelect = (selectedOption) => {
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
    
    setTimeout(() => {
      setCurrentOptions([]);
      setStep(s => s + 1);
    }, 300 + Math.random() * 200);
  };

  // Auto-scroll to bottom
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, showTyping]);

  // Save profile function (ready for API integration)
  const handleSaveProfile = async () => {
    try {
      console.log('Profile to save:', userProfile);
      // Future API call:
      // const response = await fetch('/api/onboarding/profile', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(userProfile)
      // });
    } catch (error) {
      console.error('Error saving profile:', error);
    }
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

  const ProfileSummary = () => {
    if (Object.keys(userProfile).length === 0) return null;

    const getIcon = (key) => {
      const icons = {
        userType: userProfile.userType === 'Candidate' ? User : Building2,
        roles: Briefcase,
        hiringRoles: Briefcase,
        experience: Star,
        workLocation: MapPin,
        salaryRange: DollarSign,
        companySize: Building2,
        urgency: Clock,
        budget: DollarSign
      };
      return icons[key] || CheckCircle;
    };

    return (
      <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-4 rounded-xl mb-4">
        <h3 className="font-semibold text-gray-800 mb-3 flex items-center">
          <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
          Your Profile
        </h3>
        <div className="space-y-2">
          {Object.entries(userProfile).map(([key, value]) => {
            const IconComponent = getIcon(key);
            return (
              <div key={key} className="flex items-center space-x-2 text-sm">
                <IconComponent className="w-4 h-4 text-purple-600" />
                <span className="text-gray-700">{value}</span>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-lg mx-auto min-h-[80vh] max-h-[90vh] h-[90vh] rounded-3xl shadow-2xl flex flex-col overflow-hidden glassmorphic-onboarding">

      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white p-6 text-center">
        <h1 className="text-2xl font-bold">Welcome to Hirly! 🚀</h1>
        <p className="text-purple-100 mt-1">Let's get you set up for success</p>
      </div>

      {/* Progress Bar */}
      <div className="p-6 pb-0">
        <ProgressBar />
      </div>

      {/* Chat Messages */}
      <div className="p-6 flex-1 overflow-y-auto scrollbar-none">
        {messages.map((message, index) => (
          message.type === 'bot' ? (
            <HirlyBotMessage key={index} text={message.text} />
          ) : (
            <UserMessage key={index} text={message.text} />
          )
        ))}
        
        {showTyping && <HirlyBotMessage isTyping={true} />}
        
        {/* Current Options */}
        {currentOptions.length > 0 && (
          <div className="mt-4">
            {currentOptions.map((option, index) => (
              <ChatOption
                key={index}
                option={option}
                onClick={handleOptionSelect}
                disabled={showTyping}
              />
            ))}
          </div>
        )}
        
        <div ref={chatEndRef} />
      </div>

      {/* Profile Summary - only show at end */}
      {isComplete && (
        <div className="px-6 pb-2">
          <ProfileSummary />
        </div>
      )}

      {/* Completion Actions */}
      {isComplete && (
        <div className="p-6 pt-0">
          <div className="flex space-x-3">
            <button
              onClick={handleSaveProfile}
              className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 px-6 rounded-xl font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-200"
            >
              Save Profile & Continue
            </button>
          </div>
        </div>
      )}

      {/* Custom Styles */}
      <style jsx>{`
        /* Glassmorphic window styles */
        .glassmorphic-onboarding {
          background: rgba(255,255,255,0.20);
          border: 1.5px solid rgba(180,100,255,0.18);
          box-shadow: 0 8px 32px 0 rgba(31,38,135,0.18);
          backdrop-filter: blur(18px) saturate(1.2);
          -webkit-backdrop-filter: blur(18px) saturate(1.2);
        }
        /* Hide scrollbar for Chrome, Safari and Opera */
        .scrollbar-none::-webkit-scrollbar {
          display: none;
        }
        /* Hide scrollbar for IE, Edge and Firefox */
        .scrollbar-none {
          -ms-overflow-style: none;  /* IE and Edge */
          scrollbar-width: none;  /* Firefox */
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes slideInRight {
          from { opacity: 0; transform: translateX(20px); }
          to { opacity: 1; transform: translateX(0); }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
        
        .animate-slideInRight {
          animation: slideInRight 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default HirlyOnboarding;