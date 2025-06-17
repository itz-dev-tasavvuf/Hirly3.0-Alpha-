
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from '@/components/ui/toaster';
import Layout from '@/components/Layout';
import LandingPage from '@/pages/LandingPage';
import PricingPage from '@/pages/PricingPage';
import AboutPage from '@/pages/AboutPage';
import SignInPage from '@/pages/auth/SignInPage';
import SignUpPage from '@/pages/auth/SignUpPage';
import OnboardingPage from '@/pages/onboarding';
import HubPage from '@/pages/hub/HubPage';


function App() {
  const ProtectedRoute = ({ children }) => {
    const userType = sessionStorage.getItem('userType');
    if (!userType) {
      return <Navigate to="/login" replace />;
    }
    return children;
  };

  return (
    <>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<LandingPage />} />
          <Route path="pricing" element={<PricingPage />} />
          <Route path="about" element={<AboutPage />} />
        </Route>
        <Route path="/login" element={<SignInPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/onboarding/*" element={<OnboardingPage />} />

        <Route 
          path="/hub" 
          element={
            <ProtectedRoute>
              <HubPage />
            </ProtectedRoute>
          } 
        />
      </Routes>
      <Toaster />
    </>
  );
}

export default App;
