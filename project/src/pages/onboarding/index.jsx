import React from "react";
import OnboardingLanding from "./Landing";
import { useLocation } from "react-router-dom";
import HirlyOnboarding from "@/components/HirlyOnboarding";

const OnboardingPage = () => {
  const location = useLocation();

  // If path is /onboarding/ai, show the chat onboarding, else show landing
  if (location.pathname === "/onboarding/ai") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 via-purple-700 to-pink-700">
        <div className="w-full max-w-lg">
          <HirlyOnboarding />
        </div>
      </div>
    );
  }
  return <OnboardingLanding />;
};

export default OnboardingPage;
