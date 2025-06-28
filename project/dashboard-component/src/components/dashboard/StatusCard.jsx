import React from 'react';
import { Link } from 'react-router-dom';
import Card from '../ui/Card';
import Button from '../ui/Button';
import mockData from '../../data/mockData';

const StatusCard = () => {
  const { jobStatus, applicationStatus } = mockData;

  return (
    <Card className="p-4">
      <h2 className="text-lg font-bold">Application Status</h2>
      <p className="mt-2">Job Status: {jobStatus}</p>
      <p className="mt-1">Application Status: {applicationStatus}</p>
      <Link to="/comprehensive-dashboard">
        <Button className="mt-4">View Comprehensive Dashboard</Button>
      </Link>
    </Card>
  );
};

export default StatusCard;