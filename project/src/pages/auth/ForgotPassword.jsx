import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { usePasswordReset } from '@/hooks/usePasswordReset';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Mail } from 'lucide-react';
import { motion } from 'framer-motion';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const navigate = useNavigate();
  const { requestPasswordReset, loading, error, success } = usePasswordReset();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) return;
    await requestPasswordReset(email);
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4">
      <div className="absolute top-4 left-4">
        <Link to="/login">
          <Button variant="ghost" className="text-white hover:bg-white/10">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Sign In
          </Button>
        </Link>
      </div>
      
      <motion.div
        initial={{ opacity: 0, y: -50, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <Card className="glass-effect border-purple-500/20 shadow-2xl shadow-purple-500/10">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4">
              <Link to="/" className="text-4xl font-bold gradient-text">Hirly</Link>
            </div>
            <CardTitle className="text-3xl font-bold text-white">Reset Password</CardTitle>
            <CardDescription className="text-gray-300">Enter your email to receive a password reset link</CardDescription>
          </CardHeader>

          <CardContent>
            {error && (
              <div className="mb-4 p-3 bg-red-900/30 border border-red-500/50 text-red-200 rounded-lg text-sm">
                {error}
              </div>
            )}

            {success ? (
              <div className="text-center p-6">
                <div className="text-green-400 text-5xl mb-4">✓</div>
                <h3 className="text-xl font-medium text-white mb-2">Check your email</h3>
                <p className="text-gray-400 mb-6">
                  We've sent a password reset link to <span className="text-white font-medium">{email}</span>
                </p>
                <Button 
                  onClick={() => navigate('/login')} 
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold py-3 text-lg glow-effect"
                >
                  Back to Login
                </Button>
              </div>
          ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-gray-300">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      className="bg-slate-800/50 border-slate-700 text-white pl-10"
                      required
                    />
                  </div>
                </div>

                <Button 
                  type="submit" 
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold py-3 text-lg glow-effect"
                  disabled={loading}
                >
                  {loading ? 'Sending...' : 'Send Reset Link'}
                </Button>

                <div className="text-center text-sm text-gray-400 mt-4">
                  Remember your password?{' '}
                  <Link to="/login" className="text-purple-400 hover:text-purple-300 hover:underline font-medium">
                    Sign in
                  </Link>
                </div>
              </form>
              )}
            </CardContent>
          </Card>
        </motion.div>
    </div>
  );
}
