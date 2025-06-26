import React from 'react';
import { motion } from 'framer-motion';
import ParticleBackground from './ParticleBackground';

const HubBackground = ({ children, userType = 'candidate' }) => {
  // Theme based on user type
  const getTheme = () => {
    switch (userType) {
      case 'recruiter': return 'blue';
      case 'company': return 'green';
      default: return 'purple';
    }
  };

  return (
    <div className="relative min-h-screen w-full overflow-hidden">
      {/* Base gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900" />
      
      {/* Particle system */}
      <ParticleBackground 
        intensity="medium" 
        theme={getTheme()} 
      />
      
      {/* Content overlay */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
};

export default HubBackground;
