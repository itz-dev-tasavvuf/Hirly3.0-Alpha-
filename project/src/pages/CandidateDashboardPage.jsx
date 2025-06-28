import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  TrendingUp, 
  Clock, 
  Target, 
  Award, 
  MapPin, 
  DollarSign, 
  Eye, 
  MessageSquare, 
  Heart,
  Calendar,
  Building,
  User,
  BarChart3,
  Bot
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';

const CandidateDashboardPage = () => {
  const navigate = useNavigate();
  const [selectedPeriod, setSelectedPeriod] = useState('month');
  const [animatedStats, setAnimatedStats] = useState({
    totalApplications: 0,
    interviewsScheduled: 0,
    responseRate: 0,
    profileViews: 0
  });

  // Mock data for the dashboard
  const stats = {
    totalApplications: 24,
    interviewsScheduled: 8,
    responseRate: 73,
    profileViews: 156
  };

  // Counter animation effect
  useEffect(() => {
    const duration = 2000; // 2 seconds
    const interval = 50; // Update every 50ms
    const steps = duration / interval;
    
    let step = 0;
    const timer = setInterval(() => {
      step++;
      const progress = Math.min(step / steps, 1);
      
      // Easing function for smooth animation
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      
      setAnimatedStats({
        totalApplications: Math.round(stats.totalApplications * easeOutQuart),
        interviewsScheduled: Math.round(stats.interviewsScheduled * easeOutQuart),
        responseRate: Math.round(stats.responseRate * easeOutQuart),
        profileViews: Math.round(stats.profileViews * easeOutQuart)
      });
      
      if (progress >= 1) {
        clearInterval(timer);
      }
    }, interval);
    
    return () => clearInterval(timer);
  }, []);

  // Animated Progress Bar Component
  const AnimatedProgress = ({ value, delay = 0, className = "" }) => {
    const [animatedValue, setAnimatedValue] = useState(0);

    useEffect(() => {
      const timer = setTimeout(() => {
        setAnimatedValue(value);
      }, delay);
      return () => clearTimeout(timer);
    }, [value, delay]);

    return (
      <div className={`h-2 bg-white/20 rounded-full overflow-hidden ${className}`}>
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${animatedValue}%` }}
          transition={{ duration: 1.5, ease: "easeOut", delay: delay / 1000 }}
          className="h-full bg-gradient-to-r from-purple-500 to-cyan-500 rounded-full relative"
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 1, 0] }}
            transition={{ 
              duration: 2, 
              repeat: Infinity, 
              delay: (delay / 1000) + 1.5 
            }}
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
          />
        </motion.div>
      </div>
    );
  };

  const jobApplications = [
    {
      id: 1,
      company: 'TechFlow',
      position: 'Senior Frontend Developer',
      location: 'San Francisco, CA',
      salary: '$120,000 - $150,000',
      status: 'Interview Scheduled',
      appliedDate: '2024-01-15',
      stage: 'technical_interview',
      logo: '🚀'
    },
    {
      id: 2,
      company: 'DataVision',
      position: 'Full Stack Engineer',
      location: 'Remote',
      salary: '$100,000 - $130,000',
      status: 'Under Review',
      appliedDate: '2024-01-12',
      stage: 'screening',
      logo: '📊'
    },
    {
      id: 3,
      company: 'CloudBase',
      position: 'React Developer',
      location: 'New York, NY',
      salary: '$95,000 - $125,000',
      status: 'Application Sent',
      appliedDate: '2024-01-10',
      stage: 'applied',
      logo: '☁️'
    },
    {
      id: 4,
      company: 'StartupX',
      position: 'Frontend Engineer',
      location: 'Austin, TX',
      salary: '$85,000 - $110,000',
      status: 'Rejected',
      appliedDate: '2024-01-08',
      stage: 'rejected',
      logo: '⚡'
    },
    {
      id: 5,
      company: 'InnovateLab',
      position: 'UI/UX Developer',
      location: 'Seattle, WA',
      salary: '$90,000 - $120,000',
      status: 'Offer Received',
      appliedDate: '2024-01-05',
      stage: 'offer',
      logo: '🔬'
    }
  ];

  const coachingPrompts = [
    "Your interview performance has improved by 40% this month. Keep practicing your technical explanations!",
    "Consider applying to more remote positions - they match your salary expectations better.",
    "Your profile views have increased 25% after updating your skills section. Great work!",
    "Schedule some mock interviews to prepare for your upcoming technical rounds."
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'Interview Scheduled': return 'text-blue-400 bg-blue-500/20';
      case 'Under Review': return 'text-yellow-400 bg-yellow-500/20';
      case 'Application Sent': return 'text-purple-400 bg-purple-500/20';
      case 'Rejected': return 'text-red-400 bg-red-500/20';
      case 'Offer Received': return 'text-green-400 bg-green-500/20';
      default: return 'text-gray-400 bg-gray-500/20';
    }
  };

  const getProgressValue = (stage) => {
    switch (stage) {
      case 'applied': return 25;
      case 'screening': return 50;
      case 'technical_interview': return 75;
      case 'offer': return 100;
      case 'rejected': return 0;
      default: return 0;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <div className="bg-white/5 backdrop-blur-lg border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/hub')}
                className="text-white/70 hover:text-white hover:bg-white/10"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Hub
              </Button>
              <div className="h-6 w-px bg-white/20" />
              {/* Hirly Branding */}
              <div className="flex items-center space-x-3">
                <h1 className="text-3xl font-black gradient-text">Hirly</h1>
              </div>
              <div className="h-6 w-px bg-white/20" />
              <h2 className="text-xl font-bold text-white">Candidate Dashboard</h2>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/hub?openAICoach=true')}
                className="text-white/70 hover:text-white hover:bg-white/10"
              >
                <Bot className="w-4 h-4 mr-2" />
                AI Coach
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white/5 backdrop-blur-lg rounded-xl p-6 border border-white/10 relative overflow-hidden"
          >
            {/* Shimmer effect */}
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: '100%' }}
              transition={{ duration: 1.5, delay: 0.5, ease: 'easeInOut' }}
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
            />
            <div className="flex items-center justify-between mb-2">
              <Target className="w-8 h-8 text-purple-400" />
              <motion.span 
                className="text-2xl font-bold text-white"
                initial={{ scale: 1.2, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.8, duration: 0.5 }}
              >
                {animatedStats.totalApplications}
              </motion.span>
            </div>
            <h3 className="text-white/70 text-sm font-medium">Total Applications</h3>
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2 }}
              className="text-green-400 text-xs mt-1"
            >
              +3 this week
            </motion.p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white/5 backdrop-blur-lg rounded-xl p-6 border border-white/10 relative overflow-hidden"
          >
            {/* Shimmer effect */}
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: '100%' }}
              transition={{ duration: 1.5, delay: 0.7, ease: 'easeInOut' }}
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
            />
            <div className="flex items-center justify-between mb-2">
              <Calendar className="w-8 h-8 text-blue-400" />
              <motion.span 
                className="text-2xl font-bold text-white"
                initial={{ scale: 1.2, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 1.0, duration: 0.5 }}
              >
                {animatedStats.interviewsScheduled}
              </motion.span>
            </div>
            <h3 className="text-white/70 text-sm font-medium">Interviews Scheduled</h3>
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.4 }}
              className="text-blue-400 text-xs mt-1"
            >
              2 this week
            </motion.p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white/5 backdrop-blur-lg rounded-xl p-6 border border-white/10 relative overflow-hidden"
          >
            {/* Shimmer effect */}
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: '100%' }}
              transition={{ duration: 1.5, delay: 0.9, ease: 'easeInOut' }}
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
            />
            <div className="flex items-center justify-between mb-2">
              <TrendingUp className="w-8 h-8 text-green-400" />
              <motion.span 
                className="text-2xl font-bold text-white"
                initial={{ scale: 1.2, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 1.2, duration: 0.5 }}
              >
                {animatedStats.responseRate}%
              </motion.span>
            </div>
            <h3 className="text-white/70 text-sm font-medium">Response Rate</h3>
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.6 }}
              className="text-green-400 text-xs mt-1"
            >
              +5% from last month
            </motion.p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white/5 backdrop-blur-lg rounded-xl p-6 border border-white/10 relative overflow-hidden"
          >
            {/* Shimmer effect */}
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: '100%' }}
              transition={{ duration: 1.5, delay: 1.1, ease: 'easeInOut' }}
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
            />
            <div className="flex items-center justify-between mb-2">
              <Eye className="w-8 h-8 text-cyan-400" />
              <motion.span 
                className="text-2xl font-bold text-white"
                initial={{ scale: 1.2, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 1.4, duration: 0.5 }}
              >
                {animatedStats.profileViews}
              </motion.span>
            </div>
            <h3 className="text-white/70 text-sm font-medium">Profile Views</h3>
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.8 }}
              className="text-cyan-400 text-xs mt-1"
            >
              +12 this week
            </motion.p>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Job Applications */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-white/5 backdrop-blur-lg rounded-xl p-6 border border-white/10"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-white flex items-center">
                  <BarChart3 className="w-5 h-5 mr-2" />
                  Recent Applications
                </h2>
                <div className="flex space-x-2">
                  {['week', 'month', 'quarter'].map((period) => (
                    <button
                      key={period}
                      onClick={() => setSelectedPeriod(period)}
                      className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
                        selectedPeriod === period
                          ? 'bg-purple-500 text-white'
                          : 'text-white/70 hover:text-white hover:bg-white/10'
                      }`}
                    >
                      {period.charAt(0).toUpperCase() + period.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                {jobApplications.map((job, index) => (
                  <motion.div
                    key={job.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.6 + index * 0.1 }}
                    className="bg-white/5 rounded-lg p-4 border border-white/10 hover:bg-white/10 transition-colors"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-4">
                        <div className="text-2xl">{job.logo}</div>
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-1">
                            <h3 className="font-semibold text-white">{job.position}</h3>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(job.status)}`}>
                              {job.status}
                            </span>
                          </div>
                          <p className="text-white/70 text-sm flex items-center mb-2">
                            <Building className="w-4 h-4 mr-1" />
                            {job.company}
                          </p>
                          <div className="flex items-center space-x-4 text-xs text-white/50">
                            <span className="flex items-center">
                              <MapPin className="w-3 h-3 mr-1" />
                              {job.location}
                            </span>
                            <span className="flex items-center">
                              <DollarSign className="w-3 h-3 mr-1" />
                              {job.salary}
                            </span>
                            <span className="flex items-center">
                              <Clock className="w-3 h-3 mr-1" />
                              Applied {new Date(job.appliedDate).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="mt-3">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs text-white/50">Application Progress</span>
                        <motion.span 
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 1.0 + index * 0.1 }}
                          className="text-xs text-white/70"
                        >
                          {getProgressValue(job.stage)}%
                        </motion.span>
                      </div>
                      <AnimatedProgress 
                        value={getProgressValue(job.stage)} 
                        delay={1000 + index * 100}
                      />
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* AI Coaching Insights */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="bg-white/5 backdrop-blur-lg rounded-xl p-6 border border-white/10 mb-6"
            >
              <h2 className="text-xl font-bold text-white flex items-center mb-4">
                <Bot className="w-5 h-5 mr-2" />
                AI Coaching Insights
              </h2>
              <div className="space-y-4">
                {coachingPrompts.map((prompt, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.8 + index * 0.1 }}
                    className="bg-gradient-to-r from-purple-500/20 to-cyan-500/20 rounded-lg p-4 border border-purple-500/30 relative overflow-hidden"
                  >
                    {/* Subtle pulse animation */}
                    <motion.div
                      initial={{ opacity: 0.3 }}
                      animate={{ opacity: [0.3, 0.6, 0.3] }}
                      transition={{ 
                        duration: 3, 
                        repeat: Infinity, 
                        delay: index * 0.5 
                      }}
                      className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-cyan-500/10 rounded-lg"
                    />
                    <motion.p 
                      initial={{ y: 10, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 1.0 + index * 0.1 }}
                      className="text-white/90 text-sm leading-relaxed relative z-10"
                    >
                      {prompt}
                    </motion.p>
                  </motion.div>
                ))}
              </div>
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 1.4 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button
                  onClick={() => navigate('/hub?openAICoach=true')}
                  className="w-full mt-4 bg-gradient-to-r from-purple-500 to-cyan-500 hover:from-purple-600 hover:to-cyan-600 text-white relative overflow-hidden"
                >
                  <motion.div
                    initial={{ x: '-100%' }}
                    whileHover={{ x: '100%' }}
                    transition={{ duration: 0.6 }}
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                  />
                  <span className="relative z-10">Open AI Coach</span>
                </Button>
              </motion.div>
            </motion.div>

            {/* Quick Actions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.0 }}
              className="bg-white/5 backdrop-blur-lg rounded-xl p-6 border border-white/10"
            >
              <h2 className="text-lg font-bold text-white mb-4">Quick Actions</h2>
              <div className="space-y-3">
                {[
                  { icon: User, text: "Update Profile" },
                  { icon: Target, text: "Browse Jobs" },
                  { icon: MessageSquare, text: "Check Messages" },
                  { icon: Award, text: "View Certificates" }
                ].map((action, index) => (
                  <motion.div
                    key={action.text}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 1.1 + index * 0.1 }}
                    whileHover={{ x: 5 }}
                  >
                    <Button
                      variant="ghost"
                      className="w-full justify-start text-white/70 hover:text-white hover:bg-white/10 transition-all duration-200"
                    >
                      <action.icon className="w-4 h-4 mr-2" />
                      {action.text}
                    </Button>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CandidateDashboardPage;
