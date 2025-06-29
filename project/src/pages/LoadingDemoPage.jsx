import React, { useState } from 'react';
import BrandedLoader from '../components/BrandedLoader';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

export default function LoadingDemoPage() {
  const [showFullScreen, setShowFullScreen] = useState(false);
  const [showInline, setShowInline] = useState(false);

  if (showFullScreen) {
    return <BrandedLoader fullScreen={true} message="Loading your amazing experience..." />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-8">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold text-white mb-4">
            <span className="gradient-text">Hirly</span> Loading Components Demo
          </h1>
          <p className="text-gray-300 text-lg">
            Beautiful animated loading experiences with your brand
          </p>
        </motion.div>

        <div className="space-y-8">
          {/* Full Screen Demo */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="glass-effect rounded-2xl p-8"
          >
            <h2 className="text-2xl font-bold text-white mb-4">Full Screen Loading</h2>
            <p className="text-gray-300 mb-6">
              Immersive full-screen loading experience with animated Hirly logo, shimmer effects, and gradient backgrounds.
            </p>
            <Button
              onClick={() => {
                setShowFullScreen(true);
                // Auto hide after 5 seconds for demo
                setTimeout(() => setShowFullScreen(false), 5000);
              }}
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
            >
              Show Full Screen Loader (5s demo)
            </Button>
          </motion.div>

          {/* Inline Demo */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="glass-effect rounded-2xl p-8"
          >
            <h2 className="text-2xl font-bold text-white mb-4">Inline Loading</h2>
            <p className="text-gray-300 mb-6">
              Compact inline loading component perfect for cards, modals, and sections.
            </p>
            <div className="flex gap-4 items-center">
              <Button
                onClick={() => setShowInline(!showInline)}
                variant="outline"
                className="border-white/30 text-white hover:bg-white/10"
              >
                {showInline ? 'Hide' : 'Show'} Inline Loader
              </Button>
            </div>
            
            {showInline && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-6 bg-black/20 rounded-xl overflow-hidden"
              >
                <BrandedLoader message="Loading component data..." />
              </motion.div>
            )}
          </motion.div>

          {/* Features */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="grid md:grid-cols-2 gap-6"
          >
            {[
              {
                title: 'Shimmer Animation',
                description: 'SVG-based shimmer effect that sweeps across your logo text',
                icon: '✨'
              },
              {
                title: 'Orbital Elements',
                description: 'Subtle rotating particles that add life to the loading state',
                icon: '🌀'
              },
              {
                title: 'Progressive Loading',
                description: 'Animated progress bar with flowing highlight effects',
                icon: '📊'
              },
              {
                title: 'Brand Consistency',
                description: 'Matches your Hirly brand colors and typography perfectly',
                icon: '🎨'
              }
            ].map((feature, index) => (
              <div key={index} className="glass-effect rounded-xl p-6">
                <div className="text-3xl mb-3">{feature.icon}</div>
                <h3 className="text-lg font-semibold text-white mb-2">{feature.title}</h3>
                <p className="text-gray-300 text-sm">{feature.description}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
