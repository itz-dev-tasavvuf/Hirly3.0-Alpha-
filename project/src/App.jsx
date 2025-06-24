import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from '@/components/ui/toaster';
import Layout from '@/components/Layout';
import LandingPage from '@/pages/LandingPage';
import PricingPage from '@/pages/PricingPage';
import AboutPage from '@/pages/AboutPage';
import SignInPage from '@/pages/auth/SignInPage';
import SignUpPage from '@/pages/auth/SignUpPage';
import ForgotPassword from '@/pages/auth/ForgotPassword';
import UpdatePassword from '@/pages/auth/UpdatePassword';
import OnboardingPage from '@/pages/onboarding';
import HubPage from '@/pages/hub/HubPage';
import HelpCenter from '@/pages/HelpCenter';
import Documentation from '@/pages/Documentation';
import { AuthProvider, useAuth } from './components/AuthProvider';

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return null; // or a loading spinner
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  return children;
}

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<LandingPage />} />
          <Route path="pricing" element={<PricingPage />} />
          <Route path="about" element={<AboutPage />} />
        </Route>
        <Route path="/login" element={<SignInPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/update-password" element={<UpdatePassword />} />
        <Route path="/onboarding/*" element={<OnboardingPage />} />
        <Route 
          path="/hub" 
          element={
            <ProtectedRoute>
              <HubPage />
            </ProtectedRoute>
          } 
        />
        <Route path="/help-center" element={<HelpCenter />} />
        <Route path="/documentation" element={<Documentation />} />
      </Routes>
      <Toaster />
    </AuthProvider>
  );
}

export default App;

