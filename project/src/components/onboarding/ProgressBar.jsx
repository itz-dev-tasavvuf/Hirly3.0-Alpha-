import React from 'react';
import { Progress } from '@/components/ui/progress';

const ProgressBar = ({ currentStep, totalSteps }) => {
  const progress = ((currentStep + 1) / totalSteps) * 100;
  return (
    <div className="w-full px-8 sm:px-0">
      <p className="text-center text-sm text-gray-300 mb-2">
        Step {currentStep + 1} of {totalSteps}
      </p>
      <Progress value={progress} className="w-full h-2 bg-slate-700 [&>*]:bg-gradient-to-r [&>*]:from-purple-500 [&>*]:to-pink-500" />
    </div>
  );
};

export default ProgressBar;