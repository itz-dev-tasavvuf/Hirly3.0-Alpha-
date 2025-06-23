import React from 'react';
import HeroSection from '@/components/HeroSection';
import HowItWorks from '@/components/HowItWorks';
import BlockchainSection from '@/components/BlockchainSection';
import Testimonials from '@/components/Testimonials';
import DemoPreview from '@/components/DemoPreview';
import CallToAction from '@/components/CallToAction';
import ComingSoonStores from '@/components/ComingSoonStores';

const LandingPage = () => {
  return (
    <>
      <HeroSection />
      <HowItWorks />
      <BlockchainSection />
      <Testimonials />
      <DemoPreview />
      <ComingSoonStores />
      <CallToAction />
    </>
  );
};

export default LandingPage;