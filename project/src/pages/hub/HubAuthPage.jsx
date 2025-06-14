
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from '@/components/ui/use-toast';
import { Briefcase, UserCheck as UserSearch, LogIn, UserPlus } from 'lucide-react';

const HubAuthPage = () => {
  const navigate = useNavigate();
  const [authMode, setAuthMode] = useState('login'); // 'login' or 'signup'
  const [userType, setUserType] = useState('candidate'); // 'candidate' or 'employer'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    sessionStorage.setItem('userType', userType);
    sessionStorage.setItem('userEmail', email); 
    toast({
      title: authMode === 'login' ? 'Login Successful' : 'Signup Successful',
      description: `Welcome, ${userType}! Redirecting to the Hub...`,
    });
    navigate('/hub');
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-[#18122B] via-[#251E40] to-[#1A1A2E] p-4">
      <motion.div
        initial={{ opacity: 0, y: -50, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <Card className="glass-effect border-purple-500/30 shadow-2xl shadow-purple-500/10 text-white">
          <CardHeader className="text-center">
            <motion.h1 
              className="text-5xl font-black mb-2 text-center gradient-text"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, type: "spring" }}
            >
              Hirly
            </motion.h1>
            <CardTitle className="text-2xl font-bold">
              {authMode === 'login' ? 'Welcome Back to the Hub' : 'Join the Hirly Hub'}
            </CardTitle>
            <CardDescription className="text-gray-400">
              {authMode === 'login' ? 'Sign in to access your personalized experience.' : 'Create an account to get started.'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input 
                  id="email" 
                  type="email" 
                  placeholder="you@example.com" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required 
                  className="bg-white/10 border-white/20 text-white placeholder-gray-400 focus:ring-purple-500" 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input 
                  id="password" 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required 
                  className="bg-white/10 border-white/20 text-white focus:ring-purple-500" 
                />
              </div>
              
              <div className="space-y-3">
                <Label>I am a...</Label>
                <RadioGroup 
                  defaultValue="candidate" 
                  onValueChange={setUserType} 
                  className="flex gap-4"
                  value={userType}
                >
                  <div className="flex items-center space-x-2 p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors cursor-pointer flex-1 justify-center border border-transparent has-[:checked]:border-purple-500 has-[:checked]:bg-purple-500/10">
                    <RadioGroupItem value="candidate" id="candidate" className="border-white/30 data-[state=checked]:border-purple-500 data-[state=checked]:text-purple-500"/>
                    <Label htmlFor="candidate" className="flex items-center gap-2 cursor-pointer text-gray-300 has-[:checked]:text-white">
                      <UserSearch className="w-5 h-5 text-purple-400" /> Candidate
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2 p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors cursor-pointer flex-1 justify-center border border-transparent has-[:checked]:border-pink-500 has-[:checked]:bg-pink-500/10">
                    <RadioGroupItem value="employer" id="employer" className="border-white/30 data-[state=checked]:border-pink-500 data-[state=checked]:text-pink-500"/>
                    <Label htmlFor="employer" className="flex items-center gap-2 cursor-pointer text-gray-300 has-[:checked]:text-white">
                       <Briefcase className="w-5 h-5 text-pink-400" /> Employer
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              <Button type="submit" className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold py-3 text-lg">
                {authMode === 'login' ? <><LogIn className="mr-2 h-5 w-5" /> Sign In</> : <><UserPlus className="mr-2 h-5 w-5" /> Sign Up</>}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex flex-col items-center space-y-2">
            <Button variant="link" onClick={() => setAuthMode(authMode === 'login' ? 'signup' : 'login')} className="text-purple-400 hover:text-purple-300">
              {authMode === 'login' ? "Don't have an account? Sign Up" : "Already have an account? Sign In"}
            </Button>
             {authMode === 'login' && (
              <Button variant="link" onClick={() => toast({ title: "Feature coming soon!", description: "Password recovery isn't implemented yet."})} className="text-xs text-gray-500 hover:text-gray-400">
                Forgot password?
              </Button>
            )}
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  );
};

export default HubAuthPage;
