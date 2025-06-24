import React from 'react';
import hirlyLogo from '@/assets/hirly-logo.png'; // Make sure this path matches your logo asset

export default function BrandedLoader() {
  return (
    <div className="flex flex-col items-center justify-center h-64 w-full">
      <img
        src={hirlyLogo}
        alt="Hirly Logo"
        className="h-16 w-16 mb-4 animate-bounce"
        style={{ filter: 'drop-shadow(0 0 8px #22d3ee)' }}
      />
      <span className="text-cyan-300 font-semibold text-lg">Loading Hirly...</span>
    </div>
  );
}
