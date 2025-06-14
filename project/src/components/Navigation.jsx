
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Menu, X, Briefcase } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';

const Navigation = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        isScrolled ? 'glass-effect' : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="flex items-center"
          >
            <Link to="/" className="text-2xl font-bold gradient-text" onClick={closeMobileMenu}>Hirly</Link>
          </motion.div>

          <div className="hidden md:flex items-center space-x-8">
            <Link to="/about" className="text-gray-300 hover:text-white transition-colors">
              About
            </Link>
            <Link to="/pricing" className="text-gray-300 hover:text-white transition-colors">
              Pricing
            </Link>
             <Link to="/hub-auth">
              <Button 
                variant="outline" 
                className="border-purple-500/50 text-purple-300 hover:bg-purple-500/20 flex items-center"
              >
                <Briefcase className="mr-2 h-4 w-4" /> Hub
              </Button>
            </Link>
            <Link to="/login">
              <Button 
                variant="outline" 
                className="border-pink-500/50 text-pink-300 hover:bg-pink-500/20"
              >
                Sign In
              </Button>
            </Link>
          </div>

          <div className="md:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-white"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </Button>
          </div>
        </div>

        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="md:hidden glass-effect rounded-lg mt-2 p-4"
          >
            <div className="flex flex-col space-y-4">
              <Link to="/about" onClick={closeMobileMenu} className="text-gray-300 hover:text-white transition-colors text-left py-2">
                About
              </Link>
              <Link to="/pricing" onClick={closeMobileMenu} className="text-gray-300 hover:text-white transition-colors text-left py-2">
                Pricing
              </Link>
              <Link to="/hub-auth" onClick={closeMobileMenu} className="w-full">
                <Button 
                  variant="outline" 
                  className="border-purple-500/50 text-purple-300 hover:bg-purple-500/20 w-full flex items-center justify-center"
                >
                  <Briefcase className="mr-2 h-4 w-4" /> Hub
                </Button>
              </Link>
              <Link to="/login" onClick={closeMobileMenu} className="w-full">
                <Button 
                  variant="outline" 
                  className="border-pink-500/50 text-pink-300 hover:bg-pink-500/20 w-full"
                >
                  Sign In
                </Button>
              </Link>
            </div>
          </motion.div>
        )}
      </div>
    </motion.nav>
  );
};

export default Navigation;