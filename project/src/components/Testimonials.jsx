
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Testimonials = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const testimonials = [
    {
      name: 'Sarah Chen',
      title: 'Senior Frontend Developer',
      company: 'TechFlow Inc.',
      image: 'Professional woman with short black hair in business attire',
      rating: 5,
      text: 'Hirly completely changed how I approach job hunting. The swipe interface is intuitive, and knowing every profile is blockchain-verified gives me confidence. Found my dream job in just 2 weeks!'
    },
    {
      name: 'Marcus Rodriguez',
      title: 'Hiring Manager',
      company: 'StartupHub',
      image: 'Hispanic man with beard wearing casual business shirt',
      rating: 5,
      text: 'As a hiring manager, the quality of candidates on Hirly is exceptional. No more fake profiles or unqualified applicants. The AI matching is spot-on, saving us hours of screening time.'
    },
    {
      name: 'Emily Watson',
      title: 'UX Designer',
      company: 'DesignCo',
      image: 'Young woman with blonde hair and creative style',
      rating: 5,
      text: 'The user experience is phenomenal! Swiping through opportunities feels natural and fun. The blockchain verification badge gives me trust that companies are legitimate.'
    },
    {
      name: 'David Kim',
      title: 'CTO',
      company: 'InnovateLabs',
      image: 'Asian man with glasses in professional setting',
      rating: 5,
      text: 'Hirly has revolutionized our recruitment process. The smart contracts for managing agreements are brilliant. We\'ve reduced our time-to-hire by 60% while improving candidate quality.'
    },
    {
      name: 'Lisa Thompson',
      title: 'Product Manager',
      company: 'GrowthTech',
      image: 'Professional woman with curly hair smiling confidently',
      rating: 5,
      text: 'I love how transparent everything is on Hirly. The blockchain verification means I can trust the job postings are real, and the AI matching actually understands my preferences.'
    }
  ];

  const nextTestimonial = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  return (
    <section className="py-24 relative overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute top-1/3 left-1/4 w-80 h-80 bg-pink-500/10 rounded-full blur-3xl floating-animation" />
        <div className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl floating-animation" style={{ animationDelay: '4s' }} />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            What Our <span className="gradient-text">Community</span> Says
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Join thousands of professionals who have transformed their careers with Hirly
          </p>
        </motion.div>

        <div className="relative max-w-4xl mx-auto">
          {/* Main Testimonial Card */}
          <div className="relative h-96 mb-8">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0, x: 100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -100 }}
                transition={{ duration: 0.5 }}
                className="absolute inset-0"
              >
                <div className="testimonial-card glass-effect rounded-3xl p-8 h-full flex flex-col justify-between">
                  <div>
                    {/* Rating */}
                    <div className="flex items-center mb-6">
                      {[...Array(testimonials[currentIndex].rating)].map((_, i) => (
                        <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                      ))}
                    </div>

                    {/* Testimonial Text */}
                    <blockquote className="text-lg md:text-xl text-gray-300 leading-relaxed mb-8">
                      "{testimonials[currentIndex].text}"
                    </blockquote>
                  </div>

                  {/* Author Info */}
                  <div className="flex items-center">
                    <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mr-4">
                      <img  
                        className="w-16 h-16 rounded-full object-cover" 
                        alt={`${testimonials[currentIndex].name} profile photo`}
                       src="https://images.unsplash.com/photo-1644424235476-295f24d503d9" />
                    </div>
                    <div>
                      <h4 className="text-white font-semibold text-lg">
                        {testimonials[currentIndex].name}
                      </h4>
                      <p className="text-purple-300 font-medium">
                        {testimonials[currentIndex].title}
                      </p>
                      <p className="text-gray-400 text-sm">
                        {testimonials[currentIndex].company}
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-center space-x-4">
            <Button
              onClick={prevTestimonial}
              variant="outline"
              size="icon"
              className="border-purple-500/50 text-purple-300 hover:bg-purple-500/20 rounded-full"
            >
              <ChevronLeft className="w-5 h-5" />
            </Button>

            {/* Dots Indicator */}
            <div className="flex space-x-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    index === currentIndex
                      ? 'bg-purple-500 scale-125'
                      : 'bg-gray-600 hover:bg-gray-500'
                  }`}
                />
              ))}
            </div>

            <Button
              onClick={nextTestimonial}
              variant="outline"
              size="icon"
              className="border-purple-500/50 text-purple-300 hover:bg-purple-500/20 rounded-full"
            >
              <ChevronRight className="w-5 h-5" />
            </Button>
          </div>

          {/* Side Testimonials Preview */}
          <div className="hidden lg:block">
            {/* Previous Testimonial */}
            <motion.div
              initial={{ opacity: 0.3, scale: 0.8 }}
              animate={{ opacity: 0.3, scale: 0.8 }}
              className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-1/2 w-64"
            >
              <div className="glass-effect rounded-2xl p-4">
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full mr-3" />
                  <div>
                    <p className="text-white text-sm font-medium">
                      {testimonials[(currentIndex - 1 + testimonials.length) % testimonials.length].name}
                    </p>
                    <p className="text-gray-400 text-xs">
                      {testimonials[(currentIndex - 1 + testimonials.length) % testimonials.length].title}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Next Testimonial */}
            <motion.div
              initial={{ opacity: 0.3, scale: 0.8 }}
              animate={{ opacity: 0.3, scale: 0.8 }}
              className="absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-1/2 w-64"
            >
              <div className="glass-effect rounded-2xl p-4">
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full mr-3" />
                  <div>
                    <p className="text-white text-sm font-medium">
                      {testimonials[(currentIndex + 1) % testimonials.length].name}
                    </p>
                    <p className="text-gray-400 text-xs">
                      {testimonials[(currentIndex + 1) % testimonials.length].title}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
