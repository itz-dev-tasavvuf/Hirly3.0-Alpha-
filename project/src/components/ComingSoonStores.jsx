import React from 'react';
import appStoreLogos from '@/assets/App Store Logos.png';

export default function ComingSoonStores() {
  return (
    <div className="flex flex-col items-center mt-2">
      <span className="mb-1 text-xs text-gray-500 font-medium tracking-wide">Coming Soon</span>
      <div className="relative">
        <img
          src={appStoreLogos}
          alt="App Store and Google Play Badges"
          className="h-24 w-auto rounded-lg opacity-60 grayscale"
          style={{ filter: 'grayscale(100%)', opacity: 0.6 }}
        />
      </div>
    </div>
  );
}
