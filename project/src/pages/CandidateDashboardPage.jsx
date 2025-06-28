import React, { useState } from 'react';
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

  // Mock data for the dashboard
  const stats = {
    totalApplications: 24,
    interviewsScheduled: 8,
    responseRate: 73,
    profileViews: 156
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
            className="bg-white/5 backdrop-blur-lg rounded-xl p-6 border border-white/10"
          >
            <div className="flex items-center justify-between mb-2">
              <Target className="w-8 h-8 text-purple-400" />
              <span className="text-2xl font-bold text-white">{stats.totalApplications}</span>
            </div>
            <h3 className="text-white/70 text-sm font-medium">Total Applications</h3>
            <p className="text-green-400 text-xs mt-1">+3 this week</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white/5 backdrop-blur-lg rounded-xl p-6 border border-white/10"
          >
            <div className="flex items-center justify-between mb-2">
              <Calendar className="w-8 h-8 text-blue-400" />
              <span className="text-2xl font-bold text-white">{stats.interviewsScheduled}</span>
            </div>
            <h3 className="text-white/70 text-sm font-medium">Interviews Scheduled</h3>
            <p className="text-blue-400 text-xs mt-1">2 this week</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white/5 backdrop-blur-lg rounded-xl p-6 border border-white/10"
          >
            <div className="flex items-center justify-between mb-2">
              <TrendingUp className="w-8 h-8 text-green-400" />
              <span className="text-2xl font-bold text-white">{stats.responseRate}%</span>
            </div>
            <h3 className="text-white/70 text-sm font-medium">Response Rate</h3>
            <p className="text-green-400 text-xs mt-1">+5% from last month</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white/5 backdrop-blur-lg rounded-xl p-6 border border-white/10"
          >
            <div className="flex items-center justify-between mb-2">
              <Eye className="w-8 h-8 text-cyan-400" />
              <span className="text-2xl font-bold text-white">{stats.profileViews}</span>
            </div>
            <h3 className="text-white/70 text-sm font-medium">Profile Views</h3>
            <p className="text-cyan-400 text-xs mt-1">+12 this week</p>
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
                        <span className="text-xs text-white/70">{getProgressValue(job.stage)}%</span>
                      </div>
                      <Progress value={getProgressValue(job.stage)} className="h-2" />
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
                    className="bg-gradient-to-r from-purple-500/20 to-cyan-500/20 rounded-lg p-4 border border-purple-500/30"
                  >
                    <p className="text-white/90 text-sm leading-relaxed">{prompt}</p>
                  </motion.div>
                ))}
              </div>
              <Button
                onClick={() => navigate('/hub?openAICoach=true')}
                className="w-full mt-4 bg-gradient-to-r from-purple-500 to-cyan-500 hover:from-purple-600 hover:to-cyan-600 text-white"
              >
                Open AI Coach
              </Button>
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
                <Button
                  variant="ghost"
                  className="w-full justify-start text-white/70 hover:text-white hover:bg-white/10"
                >
                  <User className="w-4 h-4 mr-2" />
                  Update Profile
                </Button>
                <Button
                  variant="ghost"
                  className="w-full justify-start text-white/70 hover:text-white hover:bg-white/10"
                >
                  <Target className="w-4 h-4 mr-2" />
                  Browse Jobs
                </Button>
                <Button
                  variant="ghost"
                  className="w-full justify-start text-white/70 hover:text-white hover:bg-white/10"
                >
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Check Messages
                </Button>
                <Button
                  variant="ghost"
                  className="w-full justify-start text-white/70 hover:text-white hover:bg-white/10"
                >
                  <Award className="w-4 h-4 mr-2" />
                  View Certificates
                </Button>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CandidateDashboardPage;
