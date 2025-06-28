import React from 'react';
import { Link } from 'react-router-dom';
import DashboardCard from '../components/dashboard/DashboardCard';
import mockData from '../data/mockData';

const ComprehensiveDashboard = () => {
  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold mb-6">Comprehensive Dashboard</h1>
      <DashboardCard 
        jobHistory={mockData.jobHistory}
        status={mockData.status}
        coachingPrompts={mockData.coachingPrompts}
      />
      <div className="mt-6">
        <Link to="/hub">
          <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
            Back to Hub
          </button>
        </Link>
      </div>
    </div>
  );
};

export default ComprehensiveDashboard;