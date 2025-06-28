import React from 'react';
import { Link } from 'react-router-dom';
import Card from '../ui/Card';
import Button from '../ui/Button';
import mockData from '../../data/mockData';

const JobHistoryCard = () => {
  const jobHistory = mockData.jobHistory; // Assuming mockData has a jobHistory array

  return (
    <Card className="p-4">
      <h2 className="text-xl font-bold mb-4">Job History</h2>
      <ul className="space-y-2">
        {jobHistory.map((job, index) => (
          <li key={index} className="border-b pb-2">
            <h3 className="font-semibold">{job.title}</h3>
            <p className="text-gray-600">{job.company}</p>
            <p className="text-sm text-gray-500">{job.date}</p>
          </li>
        ))}
      </ul>
      <Link to="/comprehensive-dashboard">
        <Button className="mt-4">View Comprehensive Dashboard</Button>
      </Link>
    </Card>
  );
};

export default JobHistoryCard;