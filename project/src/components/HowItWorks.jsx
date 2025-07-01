import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Heart, Shield, Zap, Check, Crown, Building2 } from 'lucide-react';

const HowItWorks = () => {
  const [isCreatingCheckout, setIsCreatingCheckout] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubscribe = async (priceId) => {
    if (!priceId) {
      // Free plan - redirect to signup
      window.location.href = '/signup';
      return;
    }

    setIsLoading(true);
    
    try {
      const response = await fetch('/.netlify/functions/stripe-checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          priceId,
          successUrl: `${window.location.origin}/payment-success`,
          cancelUrl: `${window.location.origin}/pricing`
        })
      });

      const { sessionUrl } = await response.json();
      
      if (sessionUrl) {
        window.location.href = sessionUrl;
      } else {
        throw new Error('Failed to create checkout session');
      }
    } catch (error) {
      console.error('Payment error:', error);
      alert('Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const steps = [
    {
      icon: User,
      title: 'Create a profile',
      description: 'Build your professional profile with skills, experience, and preferences. Get verified instantly.',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      icon: Heart,
      title: 'Swipe to apply or match',
      description: 'Browse through verified job posts and candidates. Swipe right to show interest, left to pass.',
      color: 'from-purple-500 to-pink-500'
    },
    {
      icon: Shield,
      title: 'Verify your ID or job post',
      description: 'All profiles and job posts are verified through Algorand blockchain for maximum security.',
      color: 'from-green-500 to-emerald-500'
    },
    {
      icon: Zap,
      title: 'Connect and hire securely',
      description: 'AI matches compatible profiles. Smart contracts manage agreements and expiration dates.',
      color: 'from-orange-500 to-red-500'
    }
  ];

  const pricingPlans = [
    {
      name: 'Candidate',
      price: 'Free',
      description: 'Perfect for job seekers',
      features: [
        'Create detailed profile',
        'Swipe through job posts',
        'AI-powered matching',
        'Blockchain verification',
        'Direct messaging with employers',
        'Application tracking'
      ],
      buttonText: 'Get Started Free',
      popular: false,
      priceId: null
    },
    {
      name: 'Employer Basic',
      price: '$99',
      period: '/month',
      description: 'For small businesses',
      features: [
        'Post up to 5 active jobs',
        'Browse candidate profiles',
        'AI-powered recommendations',
        'Blockchain verification',
        'Direct messaging',
        'Basic analytics',
        'Priority support'
      ],
      buttonText: 'Start Free Trial',
      popular: true,
      priceId: 'price_1OxxxxxxxxxxxxxxxxxxxE' // Replace with actual Stripe price ID
    },
    {
      name: 'Employer Pro',
      price: '$199',
      period: '/month',
      description: 'For growing companies',
      features: [
        'Unlimited job posts',
        'Advanced candidate search',
        'AI-powered bulk matching',
        'Priority blockchain verification',
        'Team collaboration tools',
        'Advanced analytics',
        'Dedicated account manager',
        'Custom branding'
      ],
      buttonText: 'Start Free Trial',
      popular: false,
      priceId: 'price_1OxxxxxxxxxxxxxxxxxxxF' // Replace with actual Stripe price ID
    }
  ];

  return (
    <section id="how-it-works" className="py-24 relative overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/3 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/3 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            How <span className="gradient-text">Hirly</span> Works
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Four simple steps to revolutionize your hiring process with blockchain-verified security
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2 }}
              whileHover={{ y: -10 }}
              className="relative group"
            >
              <div className="glass-effect rounded-2xl p-8 h-full hover:glow-effect transition-all duration-300">
                <div className={`w-16 h-16 bg-gradient-to-r ${step.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  <step.icon className="w-8 h-8 text-white" />
                </div>
                
                <div className="flex items-center mb-4">
                  <span className="text-2xl font-bold text-purple-400 mr-3">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <h3 className="text-xl font-bold text-white">
                    {step.title}
                  </h3>
                </div>
                
                <p className="text-gray-300 leading-relaxed">
                  {step.description}
                </p>

                {/* Connecting Line */}
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-1/2 -right-4 w-8 h-0.5 bg-gradient-to-r from-purple-500 to-transparent" />
                )}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Pricing Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-24"
        >
          <div className="text-center mb-16">
            <h3 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Choose Your <span className="gradient-text">Plan</span>
            </h3>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Start hiring smarter with blockchain-verified candidates
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {pricingPlans.map((plan, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className={`relative ${plan.popular ? 'scale-105' : ''}`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-1 rounded-full text-sm font-semibold flex items-center">
                      <Crown className="w-4 h-4 mr-1" />
                      Most Popular
                    </div>
                  </div>
                )}
                
                <div className={`glass-effect rounded-2xl p-8 h-full transition-all duration-300 ${
                  plan.popular ? 'glow-effect border-purple-500/50' : 'hover:glow-effect'
                }`}>
                  <div className="text-center mb-8">
                    <h4 className="text-2xl font-bold text-white mb-2">{plan.name}</h4>
                    <p className="text-gray-300 mb-4">{plan.description}</p>
                    <div className="flex items-baseline justify-center mb-6">
                      <span className="text-4xl font-bold text-white">{plan.price}</span>
                      <span className="text-gray-300 ml-1">{plan.period}</span>
                    </div>
                  </div>

                  <ul className="space-y-4 mb-8">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center text-gray-300">
                        <Check className="w-5 h-5 text-green-400 mr-3 flex-shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <button
                    onClick={() => handleSubscribe(plan.priceId)}
                    disabled={isCreatingCheckout || isLoading}
                    className={`w-full py-3 px-6 rounded-lg font-semibold transition-all duration-300 ${
                      plan.popular
                        ? 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white'
                        : 'glass-effect text-white hover:glow-effect'
                    } ${isCreatingCheckout || isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    {isCreatingCheckout || isLoading ? 'Processing...' : plan.buttonText}
                  </button>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-12">
            <div className="glass-effect rounded-2xl p-6 max-w-4xl mx-auto">
              <div className="flex flex-wrap justify-center items-center gap-8 text-sm text-gray-300">
                <div className="flex items-center">
                  <Shield className="w-5 h-5 text-green-400 mr-2" />
                  <span>Blockchain Verified</span>
                </div>
                <div className="flex items-center">
                  <Zap className="w-5 h-5 text-blue-400 mr-2" />
                  <span>AI-Powered Matching</span>
                </div>
                <div className="flex items-center">
                  <Building2 className="w-5 h-5 text-purple-400 mr-2" />
                  <span>Enterprise Ready</span>
                </div>
                <div className="flex items-center">
                  <Heart className="w-5 h-5 text-pink-400 mr-2" />
                  <span>24/7 Support</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mt-16"
        >
          <div className="glass-effect rounded-2xl p-8 max-w-2xl mx-auto">
            <h3 className="text-2xl font-bold text-white mb-4">
              Ready to experience the future of hiring?
            </h3>
            <p className="text-gray-300 mb-6">
              Join thousands of professionals already using Hirly to find their perfect match
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <div className="flex items-center text-green-400">
                <Shield className="w-5 h-5 mr-2" />
                <span>Blockchain Verified</span>
              </div>
              <div className="flex items-center text-blue-400">
                <Zap className="w-5 h-5 mr-2" />
                <span>AI Powered</span>
              </div>
              <div className="flex items-center text-purple-400">
                <Heart className="w-5 h-5 mr-2" />
                <span>Perfect Matches</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default HowItWorks;
