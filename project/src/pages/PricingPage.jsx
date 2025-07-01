import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import { CheckCircle, ArrowRight, User, Building, Gift, Star } from 'lucide-react';
import ScrollToTopButton from '@/components/ScrollToTopButton';
import ContactSalesModal from '@/components/ContactSalesModal';
import { supabase } from '@/supabaseClient';

const PricingPage = () => {
  const [contactModalOpen, setContactModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    
    // Check if payment was canceled
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('canceled') === 'true') {
      toast({
        title: 'Payment Canceled',
        description: '💙 No worries! Your payment was canceled and no charges were made. Try again when you\'re ready!',
        variant: 'default'
      });
      
      // Clean up the URL
      window.history.replaceState({}, '', window.location.pathname);
    }
  }, []);

  const handleGetStarted = async (plan) => {
    if (plan === 'Job Seekers') {
      window.location.href = '/onboarding';
      return;
    }
    if (plan === 'Enterprise') {
      setContactModalOpen(true);
      return;
    }

    // Handle Stripe checkout for Employers plan
    if (plan === 'Employers') {
      setIsLoading(true);
      
      try {
        const priceId = 'price_1Rg1PxL4YJLoYOlSyqt4AAZT'; // Your actual Stripe Price ID
        
        // Call the Supabase Edge Function directly
        const { data, error } = await supabase.functions.invoke('stripe-checkout', {
          body: {
            action: 'create-checkout-session',
            priceId
          }
        });

        if (error) {
          throw error;
        }
        
        if (data?.url) {
          window.location.href = data.url;
        } else {
          throw new Error('Failed to create checkout session');
        }
      } catch (error) {
        console.error('Payment error:', error);
        toast({
          title: 'Payment Error',
          description: `Something went wrong: ${error.message}. Please try again.`,
          variant: 'destructive'
        });
      } finally {
        setIsLoading(false);
      }
      return;
    }

  toast({
    title: `Get Started with ${plan}`,
    description: "� Not available yet, but will be soon!",
  });
  };

  const plans = [
    {
      title: 'Job Seekers',
      icon: User,
      price: 'Free',
      period: 'forever',
      description: 'Find your next career move without any cost. Ever.',
      features: [
        'Unlimited Swipes',
        'Verified Profile',
        'Direct Messaging with Employers',
        'AI-Powered Job Matches',
        'Community Access',
      ],
      cta: 'Start Swiping',
      isFeatured: false,
      bgColor: 'from-blue-900/30 to-slate-900/30',
      borderColor: 'border-blue-500/30',
      buttonVariant: 'outline',
    },
    {
      title: 'Employers',
      icon: Gift,
      price: '$149',
      period: '/ month',
      originalPrice: '$149',
      founderPrice: '$99',
      description: 'Find top talent, fast. Special offer for our first 100 founders.',
      features: [
        'Everything in Job Seeker',
        'Unlimited Job Posts',
        'AI Candidate Matching',
        'Company Branding',
        'Smart Contract Agreements',
        'Analytics Dashboard',
      ],
      cta: 'Get Started Now',
      isFeatured: true,
      bgColor: 'from-purple-900/50 to-pink-900/50',
      borderColor: 'border-purple-500/50',
      buttonVariant: 'default',
    },
    {
      title: 'Enterprise',
      icon: Building,
      price: 'Custom',
      period: '',
      description: 'Tailored solutions for large organizations and complex needs.',
      features: [
        'Everything in Employer',
        'Dedicated Account Manager',
        'Custom Integrations (ATS & HRIS)',
        'Advanced Security & Compliance',
        'Volume-based Pricing',
        'Priority Support',
      ],
      cta: 'Contact Sales',
      isFeatured: false,
      bgColor: 'from-green-900/30 to-slate-900/30',
      borderColor: 'border-green-500/30',
      buttonVariant: 'outline',
    },
  ];

  return (
    <div className="relative min-h-screen pt-24 pb-16 sm:pt-32 sm:pb-24 overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl floating-animation" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-pink-500/20 rounded-full blur-3xl floating-animation" style={{ animationDelay: '2s' }} />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h1 className="text-5xl md:text-7xl font-black mb-6">
            <span className="text-white">Pricing for</span>{' '}
            <span className="gradient-text">every team</span>
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Choose the plan that fits your needs. Transparent pricing, no hidden fees.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8 items-stretch">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.title}
              initial={{ opacity: 0, y: 50, scale: 0.9 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.6 }}
              className={`relative glass-effect rounded-3xl p-8 border ${plan.borderColor} h-full flex flex-col ${plan.isFeatured ? 'glow-effect lg:scale-105' : 'lg:hover:scale-105 transition-transform'}`}
            >
              {plan.isFeatured && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-1.5 rounded-full text-sm font-semibold flex items-center shadow-lg">
                  <Star className="w-4 h-4 mr-2" />
                  Founder's Offer
                </div>
              )}

              <div className="flex-grow">
                <div className="flex items-center mb-6">
                  <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${plan.bgColor} flex items-center justify-center mr-4`}>
                    <plan.icon className="w-6 h-6 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold text-white">{plan.title}</h2>
                </div>

                <p className="text-gray-300 mb-6 min-h-[50px]">{plan.description}</p>

                <div className="mb-8">
                  {plan.title === 'Employers' ? (
                     <div className="flex flex-col items-start">
                        <div className="flex items-baseline">
                          <span className="text-5xl font-extrabold text-white">{plan.founderPrice}</span>
                          <span className="text-lg text-gray-400 ml-1">{plan.period}</span>
                        </div>
                        <span className="text-lg text-red-400 line-through">{plan.originalPrice}{plan.period}</span>
                        <p className="text-purple-300 text-sm mt-2">for first 100 founders for life</p>
                    </div>
                  ) : (
                    <div className="flex items-baseline">
                      <span className="text-5xl font-extrabold text-white">{plan.price}</span>
                      <span className="text-lg text-gray-400 ml-1">{plan.period}</span>
                    </div>
                  )}
                </div>

                <ul className="space-y-4">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start">
                      <CheckCircle className="w-5 h-5 text-green-400 mr-3 mt-1 flex-shrink-0" />
                      <span className="text-gray-300">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-10">
                <Button
                  onClick={() => handleGetStarted(plan.title)}
                  disabled={isLoading}
                  size="lg"
                  className={`w-full font-semibold px-8 py-4 rounded-xl text-lg ${
                    plan.title === 'Job Seekers' || plan.cta === 'Contact Sales'
                      ? 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white glow-effect transform hover:scale-105 transition-all'
                      : plan.isFeatured
                        ? 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white glow-effect transform hover:scale-105 transition-all'
                        : 'border-purple-500/50 text-purple-300 hover:bg-purple-500/20'
                  } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  {isLoading && plan.title === 'Employers' ? 'Processing...' : plan.cta}
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </div>
            </motion.div>
          ))}
        </div>

        <ContactSalesModal open={contactModalOpen} onClose={() => setContactModalOpen(false)} />

        <ScrollToTopButton />
      </div>
    </div>
  );
};

export default PricingPage;