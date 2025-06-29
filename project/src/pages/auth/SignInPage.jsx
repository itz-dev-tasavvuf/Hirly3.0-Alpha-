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
  const handleSocialLogin = (provider) => {
    toast({
      title: `Sign in with ${provider}`,
      description: "🚧 This feature isn't implemented yet—but don't worry! You can request it in your next prompt! 🚀",
    });
  };

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
      
      // Use hardcoded Netlify domain for production, fallback to dynamic for local dev
      const isProduction = window.location.hostname !== 'localhost';
      const redirectUrl = isProduction 
        ? 'https://hirly.netlify.app/hub' 
        : `${window.location.origin}/hub`;
      
      console.log('Redirect URL:', redirectUrl);
      
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: redirectUrl
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
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-2">
      <div className="absolute top-4 left-4">
        <Link to="/">
          <Button variant="ghost" className="text-white hover:bg-white/10">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Home
          </Button>
        </Link>
      </div>
      <motion.div
        initial={{ opacity: 0, y: -50, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="w-[600px] max-w-2xl glass-effect border-purple-500/20 shadow-2xl shadow-purple-500/10 py-2">
          <CardHeader className="text-center">
            <div className="mx-auto mb-2">
              <Link to="/" className="text-4xl font-bold gradient-text">Hirly</Link>
            </div>
            <CardTitle className="text-3xl font-bold text-white">Welcome Back</CardTitle>
            <CardDescription className="text-gray-300">Sign in to continue your journey.</CardDescription>
          </CardHeader>
          <CardContent>
            {/* User type toggle */}
            <div className="flex justify-center gap-4 mb-4">
              <button
                type="button"
                className={`px-4 py-2 rounded-lg font-semibold text-sm transition-colors duration-150 ${userType === 'candidate' ? 'bg-purple-600 text-white shadow' : 'bg-slate-800/50 text-gray-300 border border-slate-700'}`}
                onClick={() => setUserType('candidate')}
              >
                Candidate
              </button>
              <button
                type="button"
                className={`px-4 py-2 rounded-lg font-semibold text-sm transition-colors duration-150 ${userType === 'employer' ? 'bg-purple-600 text-white shadow' : 'bg-slate-800/50 text-gray-300 border border-slate-700'}`}
                onClick={() => setUserType('employer')}
              >
                Employer
              </button>
            </div>
            <form onSubmit={handleSignIn} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-gray-300">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <Input id="email" name="email" type="email" placeholder="you@example.com" required className="bg-slate-800/50 border-slate-700 text-white pl-10" disabled={loading} />
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password" className="text-gray-300">Password</Label>
                  <Link to="/forgot-password" className="text-sm text-purple-400 hover:text-purple-300 hover:underline">
                    Forgot password?
                  </Link>
                </div>
                <div className="relative">
                  <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <Input id="password" name="password" type="password" required className="bg-slate-800/50 border-slate-700 text-white pl-10" disabled={loading} />
                </div>
              </div>
              <Button type="submit" className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold py-3 text-lg glow-effect" disabled={loading}>
                {loading ? 'Signing In...' : 'Sign In'}
              </Button>
            </form>
            <div className="flex items-center my-4">
  <span className="flex-grow border-t border-slate-700"></span>
  <span className="mx-4 text-gray-400 text-sm">Or continue with</span>
  <span className="flex-grow border-t border-slate-700"></span>
</div>
            <div className="grid grid-cols-2 gap-4">
              <Button variant="outline" className="bg-slate-800/50 border-slate-700 hover:bg-slate-800 text-white flex items-center justify-center gap-2" onClick={handleGoogleSignIn}>
                <GoogleIcon />
                Google
              </Button>
              <Button variant="outline" className="bg-slate-800/50 border-slate-700 hover:bg-slate-800 text-white flex items-center justify-center gap-2" onClick={() => handleSocialLogin('Apple')}>
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor" className="inline-block align-middle"><path d="M16.68 13.91c.01-2.12 1.74-3.13 1.81-3.17-1-1.47-2.54-1.67-3.09-1.7-1.32-.13-2.58.77-3.25.77-.67 0-1.7-.75-2.8-.73-1.44.02-2.77.84-3.51 2.13-1.5 2.6-.39 6.45 1.08 8.56.71 1.04 1.56 2.2 2.68 2.16 1.08-.04 1.49-.7 2.8-.7 1.31 0 1.67.7 2.81.68 1.16-.02 1.88-1.05 2.58-2.09.82-1.2 1.16-2.36 1.17-2.42-.03-.01-2.24-.86-2.25-3.41zm-2.23-6.29c.6-.72 1-1.71.89-2.7-.86.04-1.9.57-2.52 1.29-.55.63-1.04 1.64-.86 2.6.91.07 1.85-.46 2.49-1.19z"/></svg>
  Apple
</Button>
            </div>
          </CardContent>
          <CardFooter className="flex justify-center">
            <p className="mt-4 text-center text-gray-400 text-sm">
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