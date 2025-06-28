import React from 'react';
import DashboardCard from './DashboardCard';
import { mockJobHistory, mockStatus, mockCoachingPrompts } from '../../data/mockData';

const CandidateDashboard = () => {
  return (
    <div className="p-6 bg-gray-800 min-h-screen">
      <h1 className="text-3xl font-bold text-white mb-6">Candidate Dashboard</h1>
      <DashboardCard 
        jobHistory={mockJobHistory} 
        status={mockStatus} 
        coachingPrompts={mockCoachingPrompts} 
      />
    </div>
  );
};

export default CandidateDashboard;