import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, Heart, Users, Sparkles } from 'lucide-react';

const Section = ({ children, className = '' }) => (
  <motion.section
    initial={{ opacity: 0, y: 50 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, amount: 0.3 }}
    transition={{ duration: 0.8 }}
    className={`py-12 md:py-16 ${className}`}
  >
    {children}
  </motion.section>
);

const AboutPage = () => {
  return (
    <div className="relative min-h-screen pt-24 pb-16 sm:pt-32 sm:pb-24 overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl floating-animation" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl floating-animation" style={{ animationDelay: '2s' }} />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <span className="text-purple-400 font-semibold mb-2 block">✳️ About Hirly</span>
          <h1 className="text-5xl md:text-7xl font-black mb-4">
            <span className="gradient-text">Hiring,</span>{' '}
            <span className="text-white">redefined.</span>
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Hirly is a swipe-first job hunting platform that blends modern UX with blockchain-level trust. Built for a generation that values speed, transparency, and authenticity, Hirly is the easiest way for candidates and employers to connect — fast, fairly, and securely.
          </p>
        </motion.div>

        <Section>
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="glass-effect p-8 rounded-2xl glow-effect">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Why We Created Hirly</h2>
              <p className="text-gray-300 leading-relaxed">
                The traditional job search process is broken — bloated platforms, fake listings, ghosting, and endless applications with no feedback. We created Hirly because we believe finding a job (or hiring someone) shouldn’t feel like a chore — it should feel like a match.
              </p>
              <p className="text-gray-300 leading-relaxed mt-4">
                By combining intuitive swipe mechanics with blockchain-powered verification, we’re eliminating fake listings, making trust effortless, and turning job seeking into something people actually enjoy.
              </p>
            </div>
            <div>
              <img  class="rounded-2xl shadow-2xl" alt="Diverse team collaborating in a modern office" src="https://images.unsplash.com/photo-1552581234-26160f608093" />
            </div>
          </div>
        </Section>

        <Section>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-12 text-center">What We Believe</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: Sparkles, title: 'Trust is everything.', text: 'That’s why we use blockchain verification — so every candidate and job post is real.' },
              { icon: Heart, title: 'Less friction = more opportunity.', text: 'You swipe. You match. You connect.' },
              { icon: Users, title: 'People come first.', text: 'Whether you’re hiring or hunting, our job is to empower you.' },
            ].map((belief, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
                className="glass-effect p-8 rounded-2xl text-center hover:bg-white/10 transition-colors"
              >
                <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <belief.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">{belief.title}</h3>
                <p className="text-gray-300">{belief.text}</p>
              </motion.div>
            ))}
          </div>
        </Section>

        <Section>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-12 text-center">How We're Changing the Game</h2>
          <div className="space-y-6 max-w-2xl mx-auto">
            {[
              { title: 'Swipe to Apply', text: 'No more resumes into the void. A card-based interface makes matching fast and focused.' },
              { title: 'Verified by Blockchain', text: 'Every profile and job listing is secured and time-limited using Algorand smart contracts.' },
              { title: 'Designed for You', text: 'Modern UI, no fluff, mobile-first, with AI matchmaking on the roadmap.' },
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
                className="flex items-start p-6 glass-effect rounded-lg"
              >
                <CheckCircle className="w-10 h-10 text-green-400 mr-4 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="text-xl font-bold text-white mb-2">{item.title}</h3>
                  <p className="text-gray-300">{item.text}</p>
                  {item.title === 'Verified by Blockchain' && (
                    <div className="flex items-center mt-3">
                      <img  alt="Algorand logo" className="w-5 h-5 mr-2" src="https://images.unsplash.com/photo-1639327380086-f13b8fef4211" />
                      <span className="text-green-400 font-medium text-sm">Powered by Algorand</span>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </Section>

        <Section>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-12 text-center">📣 Real Stories</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <blockquote className="glass-effect p-8 rounded-2xl border-l-4 border-purple-500">
              <p className="text-lg text-gray-200 italic mb-4">“I got hired through Hirly in three swipes. I’d never go back to traditional sites again.”</p>
              <cite className="text-white font-semibold not-italic">– Jamie T., Developer</cite>
            </blockquote>
            <blockquote className="glass-effect p-8 rounded-2xl border-l-4 border-pink-500">
              <p className="text-lg text-gray-200 italic mb-4">“Knowing the job posts are real saved us weeks of vetting. Brilliant.”</p>
              <cite className="text-white font-semibold not-italic">– Martin A., Hiring Manager</cite>
            </blockquote>
          </div>
        </Section>

        <Section className="text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Join Us in Redefining What Hiring Can Be</h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
            We’re just getting started. Be part of a new era of hiring — one that values time, trust, and people above all else.
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold px-10 py-4 rounded-xl text-lg glow-effect"
            onClick={() => {
              const cta = document.querySelector('#call-to-action');
              if (cta) cta.scrollIntoView({ behavior: 'smooth' });
            }}
          >
            Get Started
          </motion.button>
        </Section>
      </div>
    </div>
  );
};

export default AboutPage;