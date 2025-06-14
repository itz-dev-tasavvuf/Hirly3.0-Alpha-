import React from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Briefcase, UserCheck as UserSearch } from 'lucide-react';

const SignUpPage = () => {
  const navigate = useNavigate();

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
        <Card className="w-full max-w-lg glass-effect border-purple-500/20 shadow-2xl shadow-purple-500/10 text-center">
          <CardHeader>
            <div className="mx-auto mb-4">
               <Link to="/" className="text-4xl font-bold gradient-text">Hirly</Link>
            </div>
            <CardTitle className="text-3xl font-bold text-white">Join the Revolution</CardTitle>
            <CardDescription className="text-gray-300">First, tell us who you are.</CardDescription>
          </CardHeader>
          <CardContent className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <motion.div whileHover={{ scale: 1.05 }} className="w-full">
                <Button
                  onClick={() => navigate('/onboarding/candidate')}
                  className="w-full h-48 flex flex-col justify-center items-center p-6 bg-slate-800/50 border-slate-700 hover:bg-purple-500/20 text-white rounded-xl border transition-all"
                >
                  <UserSearch className="w-16 h-16 mb-4 text-purple-400" />
                  <span className="text-xl font-semibold">I'm looking for a job</span>
                </Button>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }} className="w-full">
                <Button
                  onClick={() => navigate('/onboarding/employer')}
                  className="w-full h-48 flex flex-col justify-center items-center p-6 bg-slate-800/50 border-slate-700 hover:bg-pink-500/20 text-white rounded-xl border transition-all"
                >
                  <Briefcase className="w-16 h-16 mb-4 text-pink-400" />
                  <span className="text-xl font-semibold">I'm hiring</span>
                </Button>
              </motion.div>
            </div>
             <p className="text-sm text-gray-400 mt-8">
              Already have an account?{' '}
              <Link to="/login" className="font-semibold text-purple-400 hover:text-purple-300">
                Sign In
              </Link>
            </p>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default SignUpPage;