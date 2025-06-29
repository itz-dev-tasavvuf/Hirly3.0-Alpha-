import React, { useEffect } from 'react';
import HeroSection from '@/components/HeroSection';
import HowItWorks from '@/components/HowItWorks';
import BlockchainSection from '@/components/BlockchainSection';
import Testimonials from '@/components/Testimonials';
import DemoPreview from '@/components/DemoPreview';
import CallToAction from '@/components/CallToAction';
import ScrollToTopButton from '@/components/ScrollToTopButton';

const LandingPage = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      {/* Custom Bolt.new Badge Configuration */}
      <style>{`
        .bolt-badge {
          transition: all 0.3s ease;
        }
        @keyframes badgeIntro {
          0% { transform: translateX(-100px); opacity: 0; }
          100% { transform: translateX(0); opacity: 1; }
        }
        .bolt-badge-intro {
          animation: badgeIntro 0.6s ease-out 1s both;
        }
        .bolt-badge-intro.animated {
          animation: none;
        }
      `}</style>
      
      <HeroSection />
      <HowItWorks />
      <BlockchainSection />
      <Testimonials />
      <DemoPreview />
      <CallToAction />
      <ScrollToTopButton />
      
      {/* Bolt.new Badge */}
      <div className="fixed bottom-4 left-4 z-50">
        <a href="https://bolt.new/?rid=os72mi" target="_blank" rel="noopener noreferrer" 
           className="block transition-all duration-300 hover:shadow-2xl">
          <img src="https://storage.bolt.army/white_circle_360x360.png" 
               alt="Built with Bolt.new badge" 
               className="w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 rounded-full shadow-lg bolt-badge-intro"
               onAnimationEnd={(e) => e.target.classList.add('animated')} />
        </a>
      </div>
    </>
  );
};

export default LandingPage;