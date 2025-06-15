import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { toast } from '@/components/ui/use-toast';
import { X, Send, Search, Paperclip, Smile, ArrowLeft, Briefcase, Eye, Calendar, Edit3, ChevronLeft, ChevronRight, Clock, Video } from 'lucide-react';
import { cn } from '@/lib/utils';

const mockCandidateConversations = [
  {
    id: 'recruiter1',
    name: 'Sarah Chen',
    role: 'Tech Recruiter @ Innovatech',
    avatarUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8cG9ydHJhaXR8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=50&q=60',
    lastMessage: 'Sounds great, let\'s schedule an interview for next week.',
    timestamp: '10:30 AM',
    unread: 2,
    messages: [
      { id: 'm1', sender: 'other', text: 'Hi Alex, thanks for applying to the Senior Frontend Developer role!', time: '9:00 AM' },
      { id: 'm2', sender: 'me', text: 'Hi Sarah, thanks for reaching out! I am very interested.', time: '9:05 AM' },
      { id: 'm3', sender: 'other', text: 'Excellent! Your profile looks very promising. Are you available for a quick chat this week?', time: '9:07 AM' },
      { id: 'm4', sender: 'other', text: 'Sounds great, let\'s schedule an interview for next week.', time: '10:30 AM' },
    ],
    jobTitle: "Senior Frontend Developer",
    company: "Innovatech"
  },
  {
    id: 'recruiter2',
    name: 'David Miller',
    role: 'HR Manager @ SolutionCorp',
    avatarUrl: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8cG9ydHJhaXR8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=50&q=60',
    lastMessage: 'Can you send over your portfolio?',
    timestamp: 'Yesterday',
    unread: 0,
    messages: [
        { id: 'm1', sender: 'other', text: 'Hello, we saw your profile and were impressed by your skills.', time: 'Yesterday 2:00 PM'},
        { id: 'm2', sender: 'me', text: 'Thank you! I appreciate that.', time: 'Yesterday 2:05 PM'},
        { id: 'm3', sender: 'other', text: 'Can you send over your portfolio?', time: 'Yesterday 2:10 PM'},
    ],
    jobTitle: "UX Designer",
    company: "SolutionCorp"
  },
];

const mockEmployerConversations = [
  {
    id: 'candidate1',
    name: 'Alex Johnson',
    role: 'Frontend Developer | React, Next.js',
    avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8cG9ydHJhaXR8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=100&q=60',
    lastMessage: 'Yes, I\'m available for an interview next Tuesday.',
    timestamp: '11:45 AM',
    unread: 1,
    messages: [
        { id: 'm1', sender: 'me', text: 'Hi Alex, we liked your profile for the Frontend role.', time: '11:00 AM'},
        { id: 'm2', sender: 'other', text: 'Hi there! Thanks, I\'m very interested.', time: '11:02 AM'},
        { id: 'm3', sender: 'me', text: 'Great. Would you be free for a chat next week?', time: '11:05 AM'},
        { id: 'm4', sender: 'other', text: 'Yes, I\'m available for an interview next Tuesday.', time: '11:45 AM'},
    ],
    jobTitle: "Senior Frontend Developer",
  },
  {
    id: 'candidate2',
    name: 'Maria Garcia',
    role: 'UX Designer | Figma, Adobe XD',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8cG9ydHJhaXR8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=100&q=60',
    lastMessage: 'Thanks for the opportunity!',
    timestamp: 'Yesterday',
    unread: 0,
    messages: [
        { id: 'm1', sender: 'me', text: 'Maria, your portfolio is impressive. We\'d like to move forward.', time: 'Yesterday 3:00 PM'},
        { id: 'm2', sender: 'other', text: 'That\'s wonderful news! What are the next steps?', time: 'Yesterday 3:05 PM'},
        { id: 'm3', sender: 'me', text: 'We will send an offer letter by EOD.', time: 'Yesterday 3:07 PM'},
        { id: 'm4', sender: 'other', text: 'Thanks for the opportunity!', time: 'Yesterday 3:10 PM'},
    ],
    jobTitle: "UX Designer",
  },
];

// Calendar Component
const ZoomCalendarModal = ({ isOpen, onClose, contact }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);

  // Mock events for the calendar
  const mockEvents = {
    [new Date(2025, 0, 15).toDateString()]: [
      { time: '10:00 AM', title: 'Team Meeting', type: 'meeting' },
      { time: '2:00 PM', title: 'Client Call', type: 'call' }
    ],
    [new Date(2025, 0, 18).toDateString()]: [
      { time: '11:00 AM', title: 'Project Review', type: 'meeting' },
      { time: '4:00 PM', title: 'Interview with John', type: 'interview' }
    ],
    [new Date(2025, 0, 22).toDateString()]: [
      { time: '9:00 AM', title: 'Design Review', type: 'meeting' }
    ]
  };

  // Available time slots
  const timeSlots = [
    '9:00 AM', '10:00 AM', '11:00 AM', '1:00 PM', 
    '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM'
  ];

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    
    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }
    
    return days;
  };

  const isToday = (date) => {
    const today = new Date();
    return date && date.toDateString() === today.toDateString();
  };

  const isPastDate = (date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date && date < today;
  };

  const hasEvents = (date) => {
    return date && mockEvents[date.toDateString()];
  };

  const getMonthName = (date) => {
    return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  };

  const navigateMonth = (direction) => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      newDate.setMonth(prev.getMonth() + direction);
      return newDate;
    });
    setSelectedDate(null);
    setSelectedTime(null);
  };

  const handleDateSelect = (date) => {
    if (!isPastDate(date)) {
      setSelectedDate(date);
      setSelectedTime(null);
    }
  };

  const handleScheduleZoom = () => {
    if (selectedDate && selectedTime) {
      toast({
        title: "Zoom Meeting Scheduled! 🎉",
        description: `Meeting with ${contact?.name} scheduled for ${selectedDate.toLocaleDateString()} at ${selectedTime}`,
      });
      onClose();
    } else {
      toast({
        title: "Please select date and time",
        description: "Both date and time must be selected to schedule the meeting.",
        variant: "destructive"
      });
    }
  };

  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const days = getDaysInMonth(currentDate);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[60] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="bg-[#1A1A2E] text-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden border border-white/10"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="p-6 border-b border-white/10 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center">
                  {/* Zoom Logo SVG */}
                  <svg viewBox="0 0 24 24" className="w-5 h-5 text-white fill-current">
                    <path d="M3.5 7A3.5 3.5 0 0 1 7 3.5h10A3.5 3.5 0 0 1 20.5 7v10a3.5 3.5 0 0 1-3.5 3.5H7A3.5 3.5 0 0 1 3.5 17V7zM7 5A2 2 0 0 0 5 7v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2H7zm1.5 3A1.5 1.5 0 0 1 10 6.5h4A1.5 1.5 0 0 1 15.5 8v2A1.5 1.5 0 0 1 14 11.5h-2v2A1.5 1.5 0 0 1 10.5 15h-2A1.5 1.5 0 0 1 7 13.5v-5A1.5 1.5 0 0 1 8.5 7zm0 1.5v5h2v-2A1.5 1.5 0 0 1 12 10h2V8h-4a1.5 1.5 0 0 0-1.5 1.5z"/>
                  </svg>
                </div>
                <div>
                  <h2 className="text-xl font-bold">Schedule Zoom Meeting</h2>
                  <p className="text-sm text-gray-400">with {contact?.name}</p>
                </div>
              </div>
              <Button variant="ghost" size="icon" onClick={onClose} className="text-white hover:bg-white/20">
                <X size={20} />
              </Button>
            </div>

            <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
              <div className="grid md:grid-cols-2 gap-6">
                {/* Calendar */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold">{getMonthName(currentDate)}</h3>
                    <div className="flex space-x-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => navigateMonth(-1)}
                        className="text-white hover:bg-white/20 w-8 h-8"
                      >
                        <ChevronLeft size={16} />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => navigateMonth(1)}
                        className="text-white hover:bg-white/20 w-8 h-8"
                      >
                        <ChevronRight size={16} />
                      </Button>
                    </div>
                  </div>

                  {/* Days of week */}
                  <div className="grid grid-cols-7 gap-1 mb-2">
                    {daysOfWeek.map(day => (
                      <div key={day} className="text-center text-xs font-medium text-gray-400 p-2">
                        {day}
                      </div>
                    ))}
                  </div>

                  {/* Calendar Grid */}
                  <div className="grid grid-cols-7 gap-1">
                    {days.map((day, index) => {
                      if (!day) {
                        return <div key={index} className="h-10" />;
                      }

                      const isSelected = selectedDate && day.toDateString() === selectedDate.toDateString();
                      const isTodayDate = isToday(day);
                      const isPast = isPastDate(day);
                      const hasEventsToday = hasEvents(day);

                      return (
                        <button
                          key={day.toDateString()}
                          onClick={() => handleDateSelect(day)}
                          disabled={isPast}
                          className={cn(
                            "h-10 w-10 text-sm rounded-lg flex items-center justify-center relative transition-colors",
                            "hover:bg-white/10",
                            isSelected && "bg-blue-600 text-white",
                            isTodayDate && !isSelected && "bg-white/20 text-white font-bold",
                            isPast && "text-gray-600 cursor-not-allowed opacity-50",
                            !isPast && !isSelected && !isTodayDate && "text-gray-300"
                          )}
                        >
                          {day.getDate()}
                          {hasEventsToday && !isSelected && (
                            <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-yellow-400 rounded-full" />
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Time Selection & Events */}
                <div>
                  {selectedDate ? (
                    <div>
                      <h3 className="text-lg font-semibold mb-4">
                        {selectedDate.toLocaleDateString('en-US', { 
                          weekday: 'long', 
                          month: 'long', 
                          day: 'numeric' 
                        })}
                      </h3>

                      {/* Existing Events */}
                      {hasEvents(selectedDate) && (
                        <div className="mb-4">
                          <h4 className="text-sm font-medium text-gray-400 mb-2">Existing Events</h4>
                          <div className="space-y-2">
                            {mockEvents[selectedDate.toDateString()].map((event, index) => (
                              <div key={index} className="flex items-center p-2 bg-white/5 rounded-lg">
                                <Clock size={14} className="text-gray-400 mr-2" />
                                <div>
                                  <p className="text-sm font-medium">{event.title}</p>
                                  <p className="text-xs text-gray-400">{event.time}</p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Time Slots */}
                      <div>
                        <h4 className="text-sm font-medium text-gray-400 mb-2">Available Times</h4>
                        <div className="grid grid-cols-2 gap-2">
                          {timeSlots.map(time => {
                            const isOccupied = hasEvents(selectedDate) && 
                              mockEvents[selectedDate.toDateString()].some(event => event.time === time);
                            
                            return (
                              <button
                                key={time}
                                onClick={() => setSelectedTime(time)}
                                disabled={isOccupied}
                                className={cn(
                                  "p-2 rounded-lg text-sm transition-colors",
                                  selectedTime === time && "bg-blue-600 text-white",
                                  selectedTime !== time && !isOccupied && "bg-white/10 hover:bg-white/20 text-gray-300",
                                  isOccupied && "bg-red-500/20 text-red-400 cursor-not-allowed opacity-50"
                                )}
                              >
                                {time}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center h-full text-gray-400">
                      <div className="text-center">
                        <Calendar size={48} className="mx-auto mb-2 opacity-50" />
                        <p>Select a date to view available times</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Schedule Button */}
              {selectedDate && selectedTime && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-6 p-4 bg-blue-600/20 rounded-lg border border-blue-500/30"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                        <Video size={20} className="text-white" />
                      </div>
                      <div>
                        <p className="font-semibold">Zoom Meeting</p>
                        <p className="text-sm text-gray-400">
                          {selectedDate.toLocaleDateString()} at {selectedTime}
                        </p>
                      </div>
                    </div>
                    <Button 
                      onClick={handleScheduleZoom}
                      className="bg-blue-600 hover:bg-blue-700 text-white font-semibold"
                    >
                      Schedule with Zoom
                    </Button>
                  </div>
                </motion.div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const MessagesModal = ({ isOpen, onClose, userType, prefilledRecipient }) => {
  const [conversations, setConversations] = useState(userType === 'candidate' ? mockCandidateConversations : mockEmployerConversations);
  const [activeConversationId, setActiveConversationId] = useState(conversations[0]?.id);
  const [searchTerm, setSearchTerm] = useState('');
  const [messageInput, setMessageInput] = useState('');
  const [currentMessages, setCurrentMessages] = useState([]);
  const [showConversationList, setShowConversationList] = useState(true); // For mobile view
  const [calendarModalOpen, setCalendarModalOpen] = useState(false); // New state for calendar modal
  const [isComposingNewMessage, setIsComposingNewMessage] = useState(false);
  const [newMessageRecipient, setNewMessageRecipient] = useState(null);

  // State for the "To" input value
  const [toInputValue, setToInputValue] = useState('');

  // Prefill recipient when prop changes
  useEffect(() => {
    if (prefilledRecipient && isOpen) {
      // If coming from a job card, synthesize an HR rep name and company for the To field
      let repName = prefilledRecipient.hrRepName || '';
      let company = prefilledRecipient.company || '';
      // If no HR rep name, create a fake one
      if (!repName) {
        // Use a simple pattern for fake HR names
        repName = 'Jamie Rivera';
      }
      const displayName = company ? `${repName} (${company})` : repName;
      setIsComposingNewMessage(true);
      setNewMessageRecipient({
        id: null,
        name: repName,
        role: 'HR Manager',
        avatarUrl: '',
        company,
        jobTitle: ''
      });
      setToInputValue(displayName);
      setMessageInput('');
      setCurrentMessages([]);
    } else if (!prefilledRecipient && isOpen) {
      setToInputValue('');
    }
  }, [prefilledRecipient, isOpen]);

  // Keep toInputValue in sync if newMessageRecipient changes by manual selection
  useEffect(() => {
    if (newMessageRecipient && !prefilledRecipient) {
      setToInputValue(newMessageRecipient.name + (newMessageRecipient.company ? ` (${newMessageRecipient.company})` : ''));
    }
  }, [newMessageRecipient, prefilledRecipient]);

  const messagesEndRef = useRef(null);

  const activeConversation = conversations.find(c => c.id === activeConversationId);
  
  useEffect(() => {
    if (activeConversation) {
      setCurrentMessages(activeConversation.messages);
    }
  }, [activeConversationId, activeConversation]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [currentMessages]);

  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      if(conversations.length > 0 && !activeConversationId) {
        setActiveConversationId(conversations[0].id);
      }
    }
    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onClose, conversations, activeConversationId]);

  const filteredConversations = conversations.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // For new message, get all possible recipients not already in conversations
  const allPossibleRecipients = userType === 'candidate' ? mockEmployerConversations : mockCandidateConversations;
  const recipientsNotInConversation = allPossibleRecipients.filter(r => !conversations.find(c => c.id === r.id));

  const handleSendMessage = () => {
    if (messageInput.trim() === '') return;
    const newMessage = {
      id: `m${currentMessages.length + 1}`,
      sender: 'me',
      text: messageInput,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    setCurrentMessages(prev => [...prev, newMessage]);
    if (isComposingNewMessage && newMessageRecipient) {
      // Create new conversation
      const newConvo = {
        id: newMessageRecipient.id,
        name: newMessageRecipient.name,
        role: newMessageRecipient.role,
        avatarUrl: newMessageRecipient.avatarUrl,
        lastMessage: messageInput,
        timestamp: newMessage.time,
        unread: 0,
        messages: [newMessage],
        jobTitle: newMessageRecipient.jobTitle,
        company: newMessageRecipient.company,
      };
      setConversations(prev => [newConvo, ...prev]);
      setActiveConversationId(newConvo.id);
      setIsComposingNewMessage(false);
      setShowConversationList(false);
      setNewMessageRecipient(null);
    } else {
      // Existing conversation
      const updatedConversations = conversations.map(convo => {
        if (convo.id === activeConversationId) {
          return { ...convo, messages: [...convo.messages, newMessage], lastMessage: messageInput, timestamp: newMessage.time };
        }
        return convo;
      });
      setConversations(updatedConversations);
    }
    setMessageInput('');
    toast({ title: "Message Sent!", description: "🚧 Backend for messages not implemented." });
  };

  const handleConversationSelect = (id) => {
    setActiveConversationId(id);
    if (window.innerWidth < 768) { // md breakpoint
      setShowConversationList(false);
    }
  }

  const handleScheduleClick = () => {
    setCalendarModalOpen(true);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-0 md:p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.4, type: "spring", stiffness: 150, damping: 20 }}
            className="bg-[#1A1A2E] text-white w-full h-full md:max-w-4xl md:h-[90vh] md:rounded-2xl shadow-2xl flex flex-col overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-4 border-b border-white/10 md:hidden">
              { !showConversationList && activeConversation && (
                <Button variant="ghost" size="icon" onClick={() => setShowConversationList(true)} className="text-white hover:bg-white/20">
                  <ArrowLeft size={20} />
                </Button>
              )}
              <h2 className="text-xl font-bold gradient-text">Messages</h2>
              <Button variant="ghost" size="icon" onClick={onClose} className="text-white hover:bg-white/20 w-9 h-9">
                <X size={20} />
              </Button>
            </div>

            <div className="flex flex-1 overflow-hidden">
              {/* Conversation List (Left Panel) */}
              <motion.div 
                className={cn(
                  "w-full md:w-1/3 border-r border-white/10 flex-col bg-[#251E40]/30 md:flex",
                  showConversationList ? "flex" : "hidden"
                )}
                initial={{ x: "-100%" }}
                animate={{ x: "0%" }}
                exit={{ x: "-100%" }}
                transition={{ type: "tween", duration: 0.3 }}
              >
                <div className="p-4 border-b border-white/10 hidden md:flex items-center justify-between">
                   <h2 className="text-xl font-bold gradient-text">Messages</h2>
                   <Button variant="ghost" size="icon" onClick={() => {
  setIsComposingNewMessage(true);
  setNewMessageRecipient(null);
  setMessageInput('');
  setCurrentMessages([]);
}} className="text-white hover:bg-white/20 w-9 h-9">
                      <Edit3 size={18} />
                   </Button>
                </div>
                <div className="p-4">
                  <div className="relative">
                    <Input
                      type="search"
                      placeholder="Search conversations..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="bg-white/5 border-white/10 pl-10 placeholder-gray-400 focus:ring-purple-500"
                    />
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  </div>
                </div>
                <div className="flex-1 overflow-y-auto">
                  {filteredConversations.length === 0 ? (
                    <div className="p-4 text-center text-gray-400">No conversations found.</div>
                  ) : (
                    filteredConversations.map(convo => (
                    <div
                      key={convo.id}
                      className={`flex items-center p-4 cursor-pointer hover:bg-white/5 transition-colors border-b border-white/5 ${activeConversationId === convo.id ? 'bg-purple-500/10' : ''}`}
                      onClick={() => handleConversationSelect(convo.id)}
                    >
                      <Avatar className="h-10 w-10 mr-3">
                        <AvatarImage src={convo.avatarUrl} alt={convo.name} />
                        <AvatarFallback>{convo.name.substring(0,1)}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 overflow-hidden">
                        <div className="flex justify-between items-center">
                          <h3 className="font-semibold truncate text-sm">{convo.name}</h3>
                          <span className="text-xs text-gray-400 whitespace-nowrap">{convo.timestamp}</span>
                        </div>
                        <p className="text-xs text-gray-400 truncate">{convo.role}</p>
                        <div className="flex justify-between items-center">
                           <p className="text-xs text-gray-300 truncate mt-1">{convo.lastMessage}</p>
                           {convo.unread > 0 && (
                            <span className="bg-purple-500 text-xs font-bold text-white rounded-full px-1.5 py-0.5 ml-2">
                              {convo.unread}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  )))}
                </div>
              </motion.div>

              {/* Chat Interface (Right Panel) */}
              <div className={cn(
                "flex-1 flex-col bg-[#1A1A2E] md:flex",
                !showConversationList ? "flex" : "hidden md:flex"
              )}>
                {isComposingNewMessage ? (
  <div className="flex flex-col h-full">
    <div className="p-4 border-b border-white/10 flex items-center justify-between bg-[#1A1A2E]">
      <div className="flex items-center">
        <Avatar className="h-10 w-10 mr-3">
          {newMessageRecipient ? (
            <AvatarImage src={newMessageRecipient.avatarUrl} alt={newMessageRecipient.name} />
          ) : (
            <AvatarFallback>?</AvatarFallback>
          )}
        </Avatar>
        <div>
          <h3 className="font-semibold">
            {newMessageRecipient ? newMessageRecipient.name : 'New Message'}
          </h3>
          <p className="text-xs text-gray-400">
            {newMessageRecipient ? newMessageRecipient.role : 'Start a new conversation'}
          </p>
        </div>
      </div>
      <Button variant="ghost" size="icon" onClick={() => setIsComposingNewMessage(false)} className="text-white hover:bg-white/20 w-9 h-9">
        <X size={20} />
      </Button>
    </div>
    <div className="flex-1 flex flex-col justify-center px-6 pb-0 pt-8 bg-[#1A1A2E]">
      <div className="mb-4">
        <label className="block mb-2 text-sm font-medium text-gray-300">To:</label>
        <div className="relative">
          <input
            type="text"
            className="w-full p-3 pr-8 rounded-lg bg-slate-700 border border-white/10 text-white focus:ring-purple-500 appearance-none"
            placeholder="Type a name..."
            value={newMessageRecipient ? newMessageRecipient.name + (newMessageRecipient.company ? ` (${newMessageRecipient.company})` : '') : toInputValue}
            onChange={e => {
              const input = e.target.value;
              setToInputValue(input);
              // Try to match a recipient by name (case-insensitive, ignoring company in parens)
              const match = recipientsNotInConversation.find(r => {
                const label = r.name + (r.company ? ` (${r.company})` : '');
                return label.toLowerCase() === input.toLowerCase();
              });
              if (match) {
                setNewMessageRecipient(match);
              } else {
                setNewMessageRecipient(input.trim() ? { id: null, name: input.trim(), role: '', avatarUrl: '', company: '', jobTitle: '' } : null);
              }
            }}
            list="recipient-suggestions"
            autoComplete="off"
          />
          <datalist id="recipient-suggestions">
            {recipientsNotInConversation.map(r => (
              <option key={r.id} value={r.name + (r.company ? ` (${r.company})` : '')}>{r.role}</option>
            ))}
          </datalist>
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
            <svg width="18" height="18" fill="none" viewBox="0 0 24 24"><path d="M7 10l5 5 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </span>
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <Input
          type="text"
          placeholder="Type your message..."
          value={messageInput}
          onChange={e => setMessageInput(e.target.value)}
          onKeyPress={e => e.key === 'Enter' && newMessageRecipient && handleSendMessage()}
          className="bg-slate-700 border-slate-600 placeholder-gray-400 focus:ring-purple-500 text-white rounded-lg px-4 py-3"
          disabled={!newMessageRecipient}
        />
        <Button
          onClick={handleSendMessage}
          className="bg-purple-600 hover:bg-purple-700 text-white font-semibold w-full rounded-lg py-3"
          disabled={!newMessageRecipient || !messageInput.trim()}
        >
          <Send size={18} className="mr-2" />Send
        </Button>
      </div>
    </div>
  </div>
) : (
  activeConversation ? (
    <>
      <div className="p-4 border-b border-white/10 flex items-center justify-between">
        <div className="flex items-center">
          <Avatar className="h-10 w-10 mr-3">
            <AvatarImage src={activeConversation.avatarUrl} alt={activeConversation.name} />
            <AvatarFallback>{activeConversation.name.substring(0,1)}</AvatarFallback>
          </Avatar>
          <div>
            <h3 className="font-semibold">{activeConversation.name}</h3>
            <p className="text-xs text-gray-400">{activeConversation.role}</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="sm" className="text-purple-400 hover:bg-white/10 hover:text-purple-300" onClick={() => toast({title: "View Profile Clicked"})}>
            <Eye size={16} className="mr-1 md:mr-2"/> <span className="hidden md:inline">View Profile</span>
          </Button>
          { userType === 'candidate' && (
            <>
              <Button variant="ghost" size="sm" className="text-green-400 hover:bg-white/10 hover:text-green-300" onClick={() => toast({title: "View Job Clicked"})}>
                <Briefcase size={16} className="mr-1 md:mr-2"/> <span className="hidden md:inline">View Job</span>
              </Button>
              <Button variant="ghost" size="sm" className="text-blue-400 hover:bg-white/10 hover:text-blue-300" onClick={handleScheduleClick}>
                <Calendar size={16} className="mr-1 md:mr-2"/> <span className="hidden md:inline">Schedule</span>
              </Button>
            </>
          )}
          { userType === 'employer' && (
            <Button variant="ghost" size="sm" className="text-yellow-400 hover:bg-white/10 hover:text-yellow-300" onClick={() => toast({title: "Send Job Details Clicked"})}>
              <Briefcase size={16} className="mr-1 md:mr-2"/> <span className="hidden md:inline">Job Details</span>
            </Button>
          )}
          <Button variant="ghost" size="icon" onClick={onClose} className="text-white hover:bg-white/20 w-9 h-9 hidden md:inline-flex">
            <X size={20} />
          </Button>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {currentMessages.map(msg => (
          <div key={msg.id} className={`flex ${msg.sender === 'me' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[70%] p-3 rounded-xl shadow ${msg.sender === 'me' ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white' : 'bg-slate-700 text-gray-200'}`}>
              <p className="text-sm">{msg.text}</p>
              <p className={`text-xs mt-1 ${msg.sender === 'me' ? 'text-purple-200' : 'text-gray-400'} text-right`}>{msg.time}</p>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <div className="p-4 border-t border-white/10">
        {/* Typing indicator could go here */}
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white" onClick={() => toast({title: "Attach file clicked"})}>
            <Paperclip size={20} />
          </Button>
          <Input
            type="text"
            placeholder="Type a message..."
            value={messageInput}
            onChange={(e) => setMessageInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            className="flex-1 bg-slate-700 border-slate-600 placeholder-gray-400 focus:ring-purple-500"
          />
          <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white" onClick={() => toast({title: "Emoji clicked"})}>
            <Smile size={20} />
          </Button>
          <Button onClick={handleSendMessage} className="bg-purple-600 hover:bg-purple-700 text-white font-semibold">
            <Send size={18} className="mr-0 md:mr-2" /> <span className="hidden md:inline">Send</span>
          </Button>
        </div>
      </div>
    </>
  ) : (
    <div className="flex-1 flex items-center justify-center text-gray-400">
      <p>Select a conversation to start chatting.</p>
    </div>
  )
)}
              </div>
            </div>
          </motion.div>

          {/* Zoom Calendar Modal */}
          <ZoomCalendarModal 
            isOpen={calendarModalOpen} 
            onClose={() => setCalendarModalOpen(false)} 
            contact={activeConversation}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default MessagesModal;