import React from 'react';
import { Link } from 'react-router-dom';
import JobHistoryCard from './JobHistoryCard';
import StatusCard from './StatusCard';
import CoachingPromptsCard from './CoachingPromptsCard';
import Card from '../ui/Card';
import Button from '../ui/Button';

const DashboardCard = () => {
  return (
    <Card className="p-6 bg-gray-800 rounded-lg shadow-lg">
      <h2 className="text-xl font-bold text-white mb-4">Candidate Dashboard</h2>
      <JobHistoryCard />
      <StatusCard />
      <CoachingPromptsCard />
      <Link to="/comprehensive-dashboard">
        <Button className="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded">
          View Comprehensive Dashboard
        </Button>
      </Link>
    </Card>
  );
};

export default DashboardCard;