import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from '@/components/ui/use-toast';
import { ArrowLeft, KeyRound, Mail } from 'lucide-react';
import { GoogleIcon } from '@/components/icons';
import { supabase } from '../../supabaseClient'; // Adjust path if needed

const SignInPage = () => {
  const navigate = useNavigate();
  const [userType, setUserType] = React.useState('candidate');
  const [loading, setLoading] = React.useState(false);

  const handleSignIn = async (e) => {
    e.preventDefault();
    setLoading(true);
    const email = e.target.email.value;
    const password = e.target.password.value;

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setLoading(false);

    if (error) {
      toast({
        title: 'Sign-in failed',
        description: error.message,
        status: 'error',
      });
      return;
    }

    sessionStorage.setItem('userType', userType);
    toast({
      title: 'Signed in!',
      description: `Welcome back, ${userType === 'candidate' ? 'Candidate' : 'Employer'}. Redirecting...`
    });
    navigate('/hub');
  };

  // Google sign-in handler (redirect only, no One Tap)
  const handleGoogleSignIn = async () => {
    try {
      setLoading(true);
      console.log('Starting Google sign-in...');
      
      // Always use Netlify domain for production, even if testing
      const redirectUrl = 'https://hirly.netlify.app/hub';
      
      console.log('Redirect URL:', redirectUrl);
      
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: 'https://hirly.netlify.app/hub',
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
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4 sm:p-6 lg:p-8">
      <div className="absolute top-4 left-4">
        <Link to="/">
          <Button variant="ghost" className="text-white hover:bg-white/10 text-sm">
            <ArrowLeft className="mr-1 sm:mr-2 h-4 w-4" /> 
            <span className="hidden sm:inline">Back to Home</span>
            <span className="sm:hidden">Back</span>
          </Button>
        </Link>
      </div>
      <motion.div
        initial={{ opacity: 0, y: -50, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md sm:max-w-lg md:max-w-xl lg:max-w-2xl"
      >
        <Card className="w-full glass-effect border-purple-500/20 shadow-2xl shadow-purple-500/10 py-2">
          <CardHeader className="text-center px-4 sm:px-6">
            <div className="mx-auto mb-2">
              <Link to="/" className="text-3xl sm:text-4xl font-bold gradient-text">Hirly</Link>
            </div>
            <CardTitle className="text-2xl sm:text-3xl font-bold text-white">Welcome Back</CardTitle>
            <CardDescription className="text-gray-300 text-sm sm:text-base">Sign in to continue your journey.</CardDescription>
          </CardHeader>
          <CardContent className="px-4 sm:px-6">{/* ... existing code ... */}
            {/* User type toggle */}
            <div className="flex justify-center gap-2 sm:gap-4 mb-4">
              <button
                type="button"
                className={`px-3 sm:px-4 py-2 rounded-lg font-semibold text-xs sm:text-sm transition-colors duration-150 flex-1 max-w-[120px] ${userType === 'candidate' ? 'bg-purple-600 text-white shadow' : 'bg-slate-800/50 text-gray-300 border border-slate-700'}`}
                onClick={() => setUserType('candidate')}
              >
                Candidate
              </button>
              <button
                type="button"
                className={`px-3 sm:px-4 py-2 rounded-lg font-semibold text-xs sm:text-sm transition-colors duration-150 flex-1 max-w-[120px] ${userType === 'employer' ? 'bg-purple-600 text-white shadow' : 'bg-slate-800/50 text-gray-300 border border-slate-700'}`}
                onClick={() => setUserType('employer')}
              >
                Employer
              </button>
            </div>
            <form onSubmit={handleSignIn} className="space-y-3 sm:space-y-4">
              <div className="space-y-1 sm:space-y-2">
                <Label htmlFor="email" className="text-gray-300 text-sm">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
                  <Input id="email" name="email" type="email" placeholder="you@example.com" required className="bg-slate-800/50 border-slate-700 text-white pl-9 sm:pl-10 text-sm sm:text-base h-10 sm:h-11" disabled={loading} />
                </div>
              </div>
              <div className="space-y-1 sm:space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password" className="text-gray-300 text-sm">Password</Label>
                  <Link to="/forgot-password" className="text-xs sm:text-sm text-purple-400 hover:text-purple-300 hover:underline">
                    Forgot password?
                  </Link>
                </div>
                <div className="relative">
                  <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
                  <Input id="password" name="password" type="password" required className="bg-slate-800/50 border-slate-700 text-white pl-9 sm:pl-10 text-sm sm:text-base h-10 sm:h-11" disabled={loading} />
                </div>
              </div>
              <Button type="submit" className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold py-2.5 sm:py-3 text-base sm:text-lg glow-effect mt-4 sm:mt-6" disabled={loading}>
                {loading ? 'Signing In...' : 'Sign In'}
              </Button>
            </form>
            <div className="flex items-center my-3 sm:my-4">
              <span className="flex-grow border-t border-slate-700"></span>
              <span className="mx-2 sm:mx-4 text-gray-400 text-xs sm:text-sm whitespace-nowrap">Or continue with</span>
              <span className="flex-grow border-t border-slate-700"></span>
            </div>
            <div className="w-full">
              <Button 
                variant="outline" 
                className="w-full bg-slate-800/50 border-slate-700 hover:bg-slate-800 text-white flex items-center justify-center gap-2 sm:gap-3 py-3 sm:py-4 text-base sm:text-lg font-medium transition-all duration-200 hover:scale-[1.02]" 
                onClick={handleGoogleSignIn} 
                disabled={loading}
              >
                <GoogleIcon className="w-5 h-5 sm:w-6 sm:h-6" />
                Continue with Google
              </Button>
            </div>
          </CardContent>
          <CardFooter className="flex justify-center px-4 sm:px-6">
            <p className="mt-2 sm:mt-4 text-center text-gray-400 text-xs sm:text-sm">
              Don&apos;t have an account?{' '}
              <Link to="/onboarding" className="text-pink-400 hover:underline font-semibold">
                Sign Up
              </Link>
            </p>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  );
};

export default SignInPage;