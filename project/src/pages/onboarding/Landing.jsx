import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { PhoneCall } from "lucide-react";

const OnboardingLanding = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 via-purple-700 to-pink-700">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-white/10 backdrop-blur-lg rounded-3xl shadow-2xl p-12 max-w-md w-full flex flex-col items-center"
      >
        <h1 className="text-4xl font-extrabold text-center mb-6 bg-gradient-to-r from-pink-400 via-fuchsia-400 to-purple-400 text-transparent bg-clip-text drop-shadow">Hirly</h1>
        <h2 className="text-2xl font-bold text-white mb-2 text-center">Meet Heidi</h2>
        <p className="mb-8 text-white/80 text-center">Our AI Onboarding Specialist, will guide you through a personalized setup.</p>
        <button
          className="bg-gradient-to-r from-purple-600 to-pink-500 text-white font-bold py-4 px-8 rounded-2xl text-lg shadow-lg hover:from-purple-500 hover:to-pink-400 transition-all w-full"
          onClick={() => navigate('/onboarding/ai')}
        >
          Get Started
        </button>
      </motion.div>
    </div>
  );
};

export default OnboardingLanding;
