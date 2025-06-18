import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { usePasswordReset } from '@/hooks/usePasswordReset';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, KeyRound } from 'lucide-react';
import { motion } from 'framer-motion';

export default function UpdatePassword() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { updatePassword, loading, error, success } = usePasswordReset();

  // Check if we have a valid token in the URL
  const token = searchParams.get('token');
  const type = searchParams.get('type');

  useEffect(() => {
    // If no token or wrong type, redirect to login
    if ((!token || type !== 'recovery') && !success) {
      navigate('/login');
    }
  }, [token, type, navigate, success]);

  const validatePassword = () => {
    if (password.length < 8) {
      setPasswordError('Password must be at least 8 characters');
      return false;
    }
    if (password !== confirmPassword) {
      setPasswordError('Passwords do not match');
      return false;
    }
    setPasswordError('');
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validatePassword()) return;
    
    const { error } = await updatePassword(password);
    if (!error) {
      // Auto-login after successful password update
      setTimeout(() => navigate('/hub'), 2000);
    }
  };

  if (!token && !success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
          <p className="text-gray-300">Verifying your request...</p>
        </div>
      </div>
    );
  }

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
            <CardTitle className="text-3xl font-bold text-white">
              {success ? 'Password Updated!' : 'Create New Password'}
            </CardTitle>
            <CardDescription className="text-gray-300">
              {success 
                ? 'Your password has been updated successfully.' 
                : 'Enter a new password for your account.'}
            </CardDescription>
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
                <h3 className="text-xl font-medium text-white mb-2">Password Updated!</h3>
                <p className="text-gray-400 mb-6">You'll be redirected to your dashboard shortly...</p>
                <Button 
                  onClick={() => navigate('/hub')} 
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold py-3 text-lg glow-effect"
                >
                  Go to Dashboard
                </Button>
              </div>
          ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-gray-300">New Password</Label>
                  <div className="relative">
                    <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <Input
                      id="password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="bg-slate-800/50 border-slate-700 text-white pl-10"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword" className="text-gray-300">Confirm New Password</Label>
                  <div className="relative">
                    <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <Input
                      id="confirmPassword"
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      onBlur={validatePassword}
                      placeholder="••••••••"
                      className="bg-slate-800/50 border-slate-700 text-white pl-10"
                      required
                    />
                  </div>
                  {passwordError && (
                    <p className="text-red-400 text-xs mt-1">{passwordError}</p>
                  )}
                </div>

                <div className="text-xs text-gray-500">
                  Password must be at least 8 characters long
                </div>

                <Button 
                  type="submit" 
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold py-3 text-lg glow-effect"
                  disabled={loading}
                >
                  {loading ? 'Updating...' : 'Update Password'}
                </Button>
              </form>
              )}
            </CardContent>
          </Card>
        </motion.div>
    </div>
  );
}
