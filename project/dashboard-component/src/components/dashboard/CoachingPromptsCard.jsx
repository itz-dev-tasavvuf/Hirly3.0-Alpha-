import React from 'react';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import mockData from '../../data/mockData';

const CoachingPromptsCard = () => {
  return (
    <Card className="p-4">
      <h2 className="text-lg font-semibold mb-2">Coaching Prompts</h2>
      <ul className="list-disc list-inside mb-4">
        {mockData.coachingPrompts.map((prompt, index) => (
          <li key={index} className="text-gray-700">{prompt}</li>
        ))}
      </ul>
      <Button 
        onClick={() => window.location.href = '/comprehensive-dashboard'} 
        className="w-full"
      >
        View Comprehensive Dashboard
      </Button>
    </Card>
  );
};

export default CoachingPromptsCard;