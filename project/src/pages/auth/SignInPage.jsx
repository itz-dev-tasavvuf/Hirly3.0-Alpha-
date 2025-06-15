import React from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from '@/components/ui/use-toast';
import { ArrowLeft, KeyRound, Mail } from 'lucide-react';
import { GoogleIcon, AppleIcon } from '@/components/icons';

const SignInPage = () => {
  const navigate = useNavigate();
  const handleSocialLogin = (provider) => {
    toast({
      title: `Sign in with ${provider}`,
      description: "🚧 This feature isn't implemented yet—but don't worry! You can request it in your next prompt! 🚀",
    });
  };

  const handleSignIn = (e) => {
    e.preventDefault();
    // Simulate sign-in success
    // In a real app, replace this with actual authentication logic
    sessionStorage.setItem('userType', 'candidate'); // or 'employer' if you want to support both
    toast({
      title: 'Signed in!',
      description: 'Welcome back. Redirecting...'
    });
    navigate('/hub');
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4">
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
        <Card className="w-full max-w-md glass-effect border-purple-500/20 shadow-2xl shadow-purple-500/10">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4">
              <Link to="/" className="text-4xl font-bold gradient-text">Hirly</Link>
            </div>
            <CardTitle className="text-3xl font-bold text-white">Welcome Back</CardTitle>
            <CardDescription className="text-gray-300">Sign in to continue your journey.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSignIn} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-gray-300">Email or Username</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <Input id="email" type="email" placeholder="you@example.com" required className="bg-slate-800/50 border-slate-700 text-white pl-10" />
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password" className="text-gray-300">Password</Label>
                  <Link to="#" onClick={() => handleSocialLogin('Forgot Password')} className="text-sm text-purple-400 hover:text-purple-300">
                    Forgot password?
                  </Link>
                </div>
                <div className="relative">
                  <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <Input id="password" type="password" required className="bg-slate-800/50 border-slate-700 text-white pl-10" />
                </div>
              </div>
              <Button type="submit" className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold py-3 text-lg glow-effect">
                Sign In
              </Button>
            </form>
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-slate-700" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="bg-card px-2 text-gray-400">Or continue with</span>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Button variant="outline" className="bg-slate-800/50 border-slate-700 hover:bg-slate-800 text-white flex items-center justify-center gap-2" onClick={() => handleSocialLogin('Google')}>
                <GoogleIcon />
                Google
              </Button>
              <Button variant="outline" className="bg-slate-800/50 border-slate-700 hover:bg-slate-800 text-white flex items-center justify-center gap-2" onClick={() => handleSocialLogin('Apple')}>
                <AppleIcon />
                Apple
              </Button>
            </div>
          </CardContent>
          <CardFooter className="flex justify-center">
            <p className="text-sm text-gray-400">
              Don't have an account?{' '}
              <Link to="/signup" className="font-semibold text-purple-400 hover:text-purple-300">
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