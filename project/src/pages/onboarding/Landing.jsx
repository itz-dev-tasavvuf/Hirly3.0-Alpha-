import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { PhoneCall } from "lucide-react";
import { GoogleIcon } from '@/components/icons';
import { supabase } from '../../supabaseClient';
import { toast } from '@/components/ui/use-toast';

const OnboardingLanding = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  // Google sign-in handler for onboarding
  const handleGoogleSignIn = async () => {
    try {
      setLoading(true);
      console.log('Starting Google sign-in from onboarding...');
      
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: 'https://hirly.netlify.app/onboarding/ai?google=true',
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          }
        }
      });

      if (error) {
        console.error('Google sign-in error:', error);
        toast({
          title: 'Sign-in failed',
          description: error.message,
          variant: 'destructive',
        });
      } else {
        console.log('Google sign-in initiated:', data);
      }
    } catch (err) {
      console.error('Unexpected error during Google sign-in:', err);
      toast({
        title: 'Sign-in failed', 
        description: 'An unexpected error occurred. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 via-purple-700 to-pink-700">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-white/10 backdrop-blur-lg rounded-3xl shadow-2xl p-12 max-w-md w-full flex flex-col items-center"
      >
        <h1 className="text-4xl font-extrabold text-center mb-6 bg-gradient-to-r from-pink-400 via-fuchsia-400 to-purple-400 text-transparent bg-clip-text drop-shadow">Hirly</h1>
        <h2 className="text-2xl font-bold text-white mb-2 text-center">Welcome to Hirly!</h2>
        <p className="mb-8 text-white/80 text-center">Get started with your personalized job hunting experience</p>
        
        {/* Google Sign In Button */}
        <button
          className="bg-white/10 border border-white/20 text-white font-medium py-3 px-6 rounded-xl text-base shadow-lg hover:bg-white/20 transition-all w-full mb-4 flex items-center justify-center gap-3"
          onClick={handleGoogleSignIn}
          disabled={loading}
        >
          <GoogleIcon className="w-5 h-5" />
          {loading ? 'Signing in...' : 'Continue with Google'}
        </button>
        
        {/* Divider */}
        <div className="flex items-center my-4 w-full">
          <span className="flex-grow border-t border-white/20"></span>
          <span className="mx-4 text-white/60 text-sm">Or</span>
          <span className="flex-grow border-t border-white/20"></span>
        </div>
        
        {/* AI Onboarding Button */}
        <button
          className="bg-gradient-to-r from-purple-600 to-pink-500 text-white font-bold py-4 px-8 rounded-2xl text-lg shadow-lg hover:from-purple-500 hover:to-pink-400 transition-all w-full"
          onClick={() => navigate('/onboarding/ai')}
          disabled={loading}
        >
          Meet Heidi (AI Setup)
        </button>
      </motion.div>
    </div>
  );
};

export default OnboardingLanding;
