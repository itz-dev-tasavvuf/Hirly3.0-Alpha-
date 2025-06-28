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
  Users,
  Calendar,
  Building,
  User,
  BarChart3,
  Bot,
  Briefcase,
  UserPlus,
  CheckCircle,
  XCircle,
  AlertCircle,
  Star,
  FileText,
  ThumbsUp,
  Filter,
  Search
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';

const EmployerDashboardPage = () => {
  const navigate = useNavigate();
  const [selectedPeriod, setSelectedPeriod] = useState('month');
  const [selectedDepartment, setSelectedDepartment] = useState('all');

  // Mock data for employer dashboard
  const stats = {
    activeJobs: 12,
    totalApplications: 384,
    candidatesHired: 18,
    avgTimeToHire: 21,
    interviewsScheduled: 45,
    responseRate: 92
  };

  const departments = ['all', 'Engineering', 'Marketing', 'Sales', 'Design', 'Product'];

  const activeJobs = [
    {
      id: 1,
      title: 'Senior Frontend Developer',
      department: 'Engineering',
      location: 'San Francisco, CA',
      salary: '$120,000 - $150,000',
      posted: '2024-01-10',
      applications: 28,
      interviews: 6,
      offers: 2,
      status: 'Active',
      urgency: 'high',
      views: 156
    },
    {
      id: 2,
      title: 'Product Marketing Manager',
      department: 'Marketing',
      location: 'Remote',
      salary: '$90,000 - $120,000',
      posted: '2024-01-08',
      applications: 45,
      interviews: 8,
      offers: 1,
      status: 'Active',
      urgency: 'medium',
      views: 203
    },
    {
      id: 3,
      title: 'UX Designer',
      department: 'Design',
      location: 'New York, NY',
      salary: '$85,000 - $115,000',
      posted: '2024-01-12',
      applications: 31,
      interviews: 4,
      offers: 0,
      status: 'Active',
      urgency: 'low',
      views: 89
    },
    {
      id: 4,
      title: 'Data Scientist',
      department: 'Engineering',
      location: 'Austin, TX',
      salary: '$110,000 - $140,000',
      posted: '2024-01-15',
      applications: 19,
      interviews: 3,
      offers: 1,
      status: 'Active',
      urgency: 'high',
      views: 124
    }
  ];

  const recentActivity = [
    { type: 'application', message: 'New application from Sarah Chen for Senior Frontend Developer', time: '2 hours ago', icon: <FileText className="w-4 h-4 text-blue-400" /> },
    { type: 'interview', message: 'Interview completed with John Smith - Product Marketing Manager', time: '4 hours ago', icon: <MessageSquare className="w-4 h-4 text-green-400" /> },
    { type: 'offer', message: 'Offer accepted by Emily Rodriguez - UX Designer', time: '1 day ago', icon: <CheckCircle className="w-4 h-4 text-emerald-400" /> },
    { type: 'hire', message: 'Michael Chen successfully onboarded - Data Scientist', time: '2 days ago', icon: <UserPlus className="w-4 h-4 text-purple-400" /> },
    { type: 'application', message: 'New application from David Kumar for Senior Frontend Developer', time: '3 days ago', icon: <FileText className="w-4 h-4 text-blue-400" /> },
    { type: 'reject', message: 'Application declined for Product Marketing Manager position', time: '3 days ago', icon: <XCircle className="w-4 h-4 text-red-400" /> }
  ];

  const topCandidates = [
    {
      id: 1,
      name: 'Sarah Chen',
      title: 'Senior Frontend Developer',
      match: 96,
      experience: '6 years',
      skills: ['React', 'TypeScript', 'Node.js'],
      status: 'Interview Scheduled',
      avatar: '👩‍💻'
    },
    {
      id: 2,
      name: 'Marcus Williams',
      title: 'Product Marketing Manager',
      match: 94,
      experience: '5 years',
      skills: ['Marketing Strategy', 'Analytics', 'Growth'],
      status: 'Under Review',
      avatar: '👨‍💼'
    },
    {
      id: 3,
      name: 'Jessica Park',
      title: 'UX Designer',
      match: 92,
      experience: '4 years',
      skills: ['Figma', 'User Research', 'Prototyping'],
      status: 'Application Received',
      avatar: '👩‍🎨'
    }
  ];

  const hiringFunnel = [
    { stage: 'Applications', count: 384, percentage: 100, color: 'bg-blue-500' },
    { stage: 'Screening', count: 156, percentage: 41, color: 'bg-purple-500' },
    { stage: 'Interviews', count: 78, percentage: 20, color: 'bg-yellow-500' },
    { stage: 'Offers', count: 24, percentage: 6, color: 'bg-green-500' },
    { stage: 'Hired', count: 18, percentage: 5, color: 'bg-emerald-500' }
  ];

  const getUrgencyColor = (urgency) => {
    switch (urgency) {
      case 'high': return 'border-l-red-500 bg-red-500/10';
      case 'medium': return 'border-l-yellow-500 bg-yellow-500/10';
      case 'low': return 'border-l-green-500 bg-green-500/10';
      default: return 'border-l-gray-500 bg-gray-500/10';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Interview Scheduled': return 'text-blue-400 bg-blue-500/20';
      case 'Under Review': return 'text-yellow-400 bg-yellow-500/20';
      case 'Application Received': return 'text-purple-400 bg-purple-500/20';
      case 'Offer Extended': return 'text-green-400 bg-green-500/20';
      default: return 'text-gray-400 bg-gray-500/20';
    }
  };

  const filteredJobs = selectedDepartment === 'all' 
    ? activeJobs 
    : activeJobs.filter(job => job.department === selectedDepartment);

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
              <h2 className="text-xl font-bold text-white">Employer Dashboard</h2>
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white/5 backdrop-blur-lg rounded-xl p-4 border border-white/10"
          >
            <div className="flex items-center justify-between mb-2">
              <Briefcase className="w-6 h-6 text-blue-400" />
              <span className="text-xl font-bold text-white">{stats.activeJobs}</span>
            </div>
            <h3 className="text-white/70 text-sm font-medium">Active Jobs</h3>
            <p className="text-green-400 text-xs mt-1">+2 this week</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white/5 backdrop-blur-lg rounded-xl p-4 border border-white/10"
          >
            <div className="flex items-center justify-between mb-2">
              <FileText className="w-6 h-6 text-purple-400" />
              <span className="text-xl font-bold text-white">{stats.totalApplications}</span>
            </div>
            <h3 className="text-white/70 text-sm font-medium">Applications</h3>
            <p className="text-green-400 text-xs mt-1">+28 this week</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white/5 backdrop-blur-lg rounded-xl p-4 border border-white/10"
          >
            <div className="flex items-center justify-between mb-2">
              <Calendar className="w-6 h-6 text-yellow-400" />
              <span className="text-xl font-bold text-white">{stats.interviewsScheduled}</span>
            </div>
            <h3 className="text-white/70 text-sm font-medium">Interviews</h3>
            <p className="text-yellow-400 text-xs mt-1">12 this week</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white/5 backdrop-blur-lg rounded-xl p-4 border border-white/10"
          >
            <div className="flex items-center justify-between mb-2">
              <UserPlus className="w-6 h-6 text-green-400" />
              <span className="text-xl font-bold text-white">{stats.candidatesHired}</span>
            </div>
            <h3 className="text-white/70 text-sm font-medium">Hired</h3>
            <p className="text-green-400 text-xs mt-1">+3 this month</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-white/5 backdrop-blur-lg rounded-xl p-4 border border-white/10"
          >
            <div className="flex items-center justify-between mb-2">
              <Clock className="w-6 h-6 text-cyan-400" />
              <span className="text-xl font-bold text-white">{stats.avgTimeToHire}</span>
            </div>
            <h3 className="text-white/70 text-sm font-medium">Avg. Days to Hire</h3>
            <p className="text-green-400 text-xs mt-1">-3 days improved</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-white/5 backdrop-blur-lg rounded-xl p-4 border border-white/10"
          >
            <div className="flex items-center justify-between mb-2">
              <TrendingUp className="w-6 h-6 text-emerald-400" />
              <span className="text-xl font-bold text-white">{stats.responseRate}%</span>
            </div>
            <h3 className="text-white/70 text-sm font-medium">Response Rate</h3>
            <p className="text-emerald-400 text-xs mt-1">+4% from last month</p>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Active Jobs & Hiring Funnel */}
          <div className="lg:col-span-2 space-y-8">
            {/* Active Jobs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="bg-white/5 backdrop-blur-lg rounded-xl p-6 border border-white/10"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-white flex items-center">
                  <Briefcase className="w-5 h-5 mr-2" />
                  Active Job Postings
                </h2>
                <div className="flex items-center space-x-2">
                  <select
                    value={selectedDepartment}
                    onChange={(e) => setSelectedDepartment(e.target.value)}
                    className="bg-white/10 border border-white/20 rounded-lg px-3 py-1 text-white text-sm"
                  >
                    {departments.map(dept => (
                      <option key={dept} value={dept} className="bg-slate-800">
                        {dept === 'all' ? 'All Departments' : dept}
                      </option>
                    ))}
                  </select>
                  <Button size="sm" variant="ghost" className="text-white/70 hover:text-white">
                    <Search className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              <div className="space-y-4">
                {filteredJobs.map((job, index) => (
                  <motion.div
                    key={job.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.8 + index * 0.1 }}
                    className={`border-l-4 ${getUrgencyColor(job.urgency)} rounded-lg p-4 border border-white/10 hover:bg-white/10 transition-colors`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <h3 className="font-semibold text-white">{job.title}</h3>
                          <span className="px-2 py-1 rounded-full text-xs font-medium bg-white/10 text-white/70">
                            {job.department}
                          </span>
                          {job.urgency === 'high' && (
                            <span className="px-2 py-1 rounded-full text-xs font-medium bg-red-500/20 text-red-400">
                              Urgent
                            </span>
                          )}
                        </div>
                        <div className="flex items-center space-x-4 text-xs text-white/50 mb-3">
                          <span className="flex items-center">
                            <MapPin className="w-3 h-3 mr-1" />
                            {job.location}
                          </span>
                          <span className="flex items-center">
                            <DollarSign className="w-3 h-3 mr-1" />
                            {job.salary}
                          </span>
                          <span className="flex items-center">
                            <Calendar className="w-3 h-3 mr-1" />
                            Posted {new Date(job.posted).toLocaleDateString()}
                          </span>
                          <span className="flex items-center">
                            <Eye className="w-3 h-3 mr-1" />
                            {job.views} views
                          </span>
                        </div>
                        <div className="grid grid-cols-4 gap-3 text-center">
                          <div className="bg-white/5 rounded-lg p-2">
                            <p className="text-lg font-bold text-blue-400">{job.applications}</p>
                            <p className="text-xs text-white/70">Applications</p>
                          </div>
                          <div className="bg-white/5 rounded-lg p-2">
                            <p className="text-lg font-bold text-yellow-400">{job.interviews}</p>
                            <p className="text-xs text-white/70">Interviews</p>
                          </div>
                          <div className="bg-white/5 rounded-lg p-2">
                            <p className="text-lg font-bold text-green-400">{job.offers}</p>
                            <p className="text-xs text-white/70">Offers</p>
                          </div>
                          <div className="bg-white/5 rounded-lg p-2">
                            <p className="text-lg font-bold text-purple-400">{Math.round((job.interviews/job.applications)*100)}%</p>
                            <p className="text-xs text-white/70">Interview Rate</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Hiring Funnel */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.0 }}
              className="bg-white/5 backdrop-blur-lg rounded-xl p-6 border border-white/10"
            >
              <h2 className="text-xl font-bold text-white flex items-center mb-6">
                <Target className="w-5 h-5 mr-2" />
                Hiring Funnel
              </h2>
              <div className="space-y-4">
                {hiringFunnel.map((stage, index) => (
                  <motion.div
                    key={stage.stage}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 1.1 + index * 0.1 }}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center space-x-4 flex-1">
                      <div className="w-20 text-sm text-white/70">{stage.stage}</div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-white font-medium">{stage.count}</span>
                          <span className="text-white/50 text-sm">{stage.percentage}%</span>
                        </div>
                        <div className="w-full bg-white/10 rounded-full h-2">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${stage.percentage}%` }}
                            transition={{ delay: 1.2 + index * 0.1, duration: 1 }}
                            className={`h-2 rounded-full ${stage.color}`}
                          />
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Right Sidebar */}
          <div className="space-y-6">
            {/* Top Candidates */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9 }}
              className="bg-white/5 backdrop-blur-lg rounded-xl p-6 border border-white/10"
            >
              <h2 className="text-lg font-bold text-white flex items-center mb-4">
                <Star className="w-5 h-5 mr-2" />
                Top Candidates
              </h2>
              <div className="space-y-4">
                {topCandidates.map((candidate, index) => (
                  <motion.div
                    key={candidate.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 1.0 + index * 0.1 }}
                    className="bg-white/5 rounded-lg p-4 border border-white/10 hover:bg-white/10 transition-colors cursor-pointer"
                  >
                    <div className="flex items-start space-x-3">
                      <div className="text-2xl">{candidate.avatar}</div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <h3 className="font-medium text-white text-sm">{candidate.name}</h3>
                          <div className="flex items-center space-x-1">
                            <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                            <span className="text-xs text-yellow-400">{candidate.match}%</span>
                          </div>
                        </div>
                        <p className="text-xs text-white/70 mb-2">{candidate.title}</p>
                        <div className="flex flex-wrap gap-1 mb-2">
                          {candidate.skills.slice(0, 2).map(skill => (
                            <span key={skill} className="text-xs px-1 py-0.5 bg-white/10 rounded text-white/80">
                              {skill}
                            </span>
                          ))}
                          {candidate.skills.length > 2 && (
                            <span className="text-xs text-white/50">+{candidate.skills.length - 2}</span>
                          )}
                        </div>
                        <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(candidate.status)}`}>
                          {candidate.status}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Recent Activity */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.1 }}
              className="bg-white/5 backdrop-blur-lg rounded-xl p-6 border border-white/10"
            >
              <h2 className="text-lg font-bold text-white flex items-center mb-4">
                <Clock className="w-5 h-5 mr-2" />
                Recent Activity
              </h2>
              <div className="space-y-3">
                {recentActivity.map((activity, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 1.2 + index * 0.05 }}
                    className="flex items-start space-x-3 p-3 bg-white/5 rounded-lg border border-white/10"
                  >
                    <div className="flex-shrink-0 mt-0.5">
                      {activity.icon}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-white/90 leading-tight">{activity.message}</p>
                      <p className="text-xs text-white/50 mt-1">{activity.time}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Quick Actions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.3 }}
              className="bg-white/5 backdrop-blur-lg rounded-xl p-6 border border-white/10"
            >
              <h2 className="text-lg font-bold text-white mb-4">Quick Actions</h2>
              <div className="space-y-3">
                <Button
                  variant="ghost"
                  className="w-full justify-start text-white/70 hover:text-white hover:bg-white/10"
                >
                  <Briefcase className="w-4 h-4 mr-2" />
                  Post New Job
                </Button>
                <Button
                  variant="ghost"
                  className="w-full justify-start text-white/70 hover:text-white hover:bg-white/10"
                >
                  <Users className="w-4 h-4 mr-2" />
                  Review Applications
                </Button>
                <Button
                  variant="ghost"
                  className="w-full justify-start text-white/70 hover:text-white hover:bg-white/10"
                >
                  <Calendar className="w-4 h-4 mr-2" />
                  Schedule Interviews
                </Button>
                <Button
                  variant="ghost"
                  className="w-full justify-start text-white/70 hover:text-white hover:bg-white/10"
                >
                  <BarChart3 className="w-4 h-4 mr-2" />
                  View Analytics
                </Button>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployerDashboardPage;
