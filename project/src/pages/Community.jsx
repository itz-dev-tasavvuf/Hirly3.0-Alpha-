import React from 'react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { motion } from 'framer-motion';
import { Users, MessageCircle, Calendar, Github, LifeBuoy } from 'lucide-react';

const communityTiles = [
  {
    icon: <MessageCircle className="w-7 h-7 text-purple-300 mb-2" />, 
    title: 'Join the Conversation',
    description: 'Visit our Discord and Forum to chat, ask questions, and share tips.',
    link: '#',
    linkLabel: 'Go to Discord',
  },
  {
    icon: <Calendar className="w-7 h-7 text-purple-300 mb-2" />, 
    title: 'Events & Meetups',
    description: 'Stay tuned for upcoming virtual events, webinars, and community meetups.',
    link: '#',
    linkLabel: 'See Events',
  },
  {
    icon: <Github className="w-7 h-7 text-purple-300 mb-2" />, 
    title: 'Contribute',
    description: 'Suggest features, report bugs, or contribute to our open-source projects on GitHub.',
    link: '#',
    linkLabel: 'Contribute on GitHub',
  },
  {
    icon: <LifeBuoy className="w-7 h-7 text-purple-300 mb-2" />, 
    title: 'Support',
    description: 'Need help? Visit our Help Center or Documentation for assistance.',
    link: '/help-center',
    linkLabel: 'Get Support',
  },
];

export default function Community() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900 flex flex-col">
      <Navigation />
      <div className="flex-1 flex flex-col items-center justify-start pt-24 px-4">
        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
          className="w-full max-w-2xl shadow-2xl p-8 border border-white/20"
          style={{
            background: 'rgba(255,255,255,0.13)',
            boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
            backdropFilter: 'blur(18px)',
            WebkitBackdropFilter: 'blur(18px)',
            borderRadius: '2rem',
            border: '1.5px solid rgba(255,255,255,0.18)'
          }}
        >
          <h1 className="text-3xl md:text-4xl font-bold gradient-text mb-6 text-center drop-shadow-[0_0_16px_rgba(168,85,247,0.7)] animate-glow">
            Community
          </h1>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-8">
            {communityTiles.map((tile, idx) => (
              <motion.div
                key={tile.title}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + idx * 0.1 }}
                className="flex flex-col items-center bg-white/10 border border-white/15 rounded-2xl p-6 shadow-lg hover:scale-105 hover:bg-purple-700/20 transition-transform cursor-pointer min-h-[200px]"
              >
                {tile.icon}
                <h2 className="text-lg font-semibold text-purple-100 mb-1 text-center">{tile.title}</h2>
                <p className="text-gray-200 text-sm text-center mb-4">{tile.description}</p>
                <a href={tile.link} className="text-purple-300 hover:text-white font-medium underline text-sm transition-colors">
                  {tile.linkLabel}
                </a>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
      <Footer />
    </div>
  );
}
