import React, { useEffect } from 'react';
import HeroSection from '@/components/HeroSection';
import HowItWorks from '@/components/HowItWorks';
import BlockchainSection from '@/components/BlockchainSection';
import Testimonials from '@/components/Testimonials';
import DemoPreview from '@/components/DemoPreview';
import CallToAction from '@/components/CallToAction';
import ComingSoonStores from '@/components/ComingSoonStores';
import ScrollToTopButton from '@/components/ScrollToTopButton';

const LandingPage = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <HeroSection />
      <HowItWorks />
      <BlockchainSection />
      <Testimonials />
      <DemoPreview />
      <ComingSoonStores />
      <CallToAction />
      <ScrollToTopButton />
    </>
  );
};

export default LandingPage;