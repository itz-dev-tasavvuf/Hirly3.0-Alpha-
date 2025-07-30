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
      
      // ...existing code...
    </>
  );
};

export default LandingPage;