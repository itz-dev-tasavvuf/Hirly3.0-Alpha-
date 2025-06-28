import { useState, useEffect } from 'react';
import mockData from '../data/mockData';

const useDashboard = () => {
  const [jobHistory, setJobHistory] = useState([]);
  const [status, setStatus] = useState('');
  const [coachingPrompts, setCoachingPrompts] = useState([]);

  useEffect(() => {
    // Simulate fetching job history from mock data
    setJobHistory(mockData.jobHistory);

    // Simulate fetching status from mock data
    setStatus(mockData.status);

    // Simulate fetching coaching prompts from mock data
    setCoachingPrompts(mockData.coachingPrompts);
  }, []);

  return {
    jobHistory,
    status,
    coachingPrompts,
  };
};

export default useDashboard;