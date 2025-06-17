import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import HirlyOnboarding from "@/components/HirlyOnboarding";

const OnboardingPage = () => {
  const navigate = useNavigate();
  const { userType } = useParams();

  // Handler for completion (after onboarding, go to /hub)
  const handleComplete = () => {
    navigate("/hub");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-100 to-pink-100">
      <div className="w-full max-w-lg">
        <HirlyOnboarding onComplete={handleComplete} userTypeFromRoute={userType} />
      </div>
    </div>
  );
};

export default OnboardingPage;
