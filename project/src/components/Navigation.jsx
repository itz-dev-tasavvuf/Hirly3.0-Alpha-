
import React, { useState, useEffect } from 'react';
import { useAuth } from './AuthProvider';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Menu, X, Briefcase } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';

const Navigation = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const menuRefs = [React.useRef(), React.useRef(), React.useRef()]; // About, Pricing, Sign In
  const [focusedIdx, setFocusedIdx] = useState(-1);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Keyboard navigation for main menu
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (isMobileMenuOpen) return; // Don't interfere with mobile
      if (![37,38,39,40,32].includes(e.keyCode)) return; // Only arrow keys, space
      if (document.activeElement.tagName === 'INPUT' || document.activeElement.tagName === 'TEXTAREA') return;
      e.preventDefault();
      if (focusedIdx === -1 && (e.key === 'ArrowRight' || e.key === 'ArrowDown')) {
        setFocusedIdx(0);
        menuRefs[0].current && menuRefs[0].current.focus();
        return;
      }
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        const next = (focusedIdx + 1) % menuRefs.length;
        setFocusedIdx(next);
        menuRefs[next].current && menuRefs[next].current.focus();
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        const prev = (focusedIdx - 1 + menuRefs.length) % menuRefs.length;
        setFocusedIdx(prev);
        menuRefs[prev].current && menuRefs[prev].current.focus();
      } else if (e.key === ' ' || e.key === 'Spacebar') {
        if (focusedIdx !== -1 && menuRefs[focusedIdx].current) {
          menuRefs[focusedIdx].current.click();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [focusedIdx, isMobileMenuOpen]);

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
            <Link to="/about" ref={menuRefs[0]} tabIndex={0} className="text-gray-300 hover:text-white transition-colors">
              About
            </Link>
            <Link to="/pricing" ref={menuRefs[1]} tabIndex={0} className="text-gray-300 hover:text-white transition-colors">
              Pricing
            </Link>
            <AuthNavButton ref={menuRefs[2]} />
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

// Simple sign in button
const AuthNavButton = React.forwardRef((props, ref) => (
  <Button
    onClick={() => window.location.href = '/login'}
    variant="outline"
    className="border-pink-500/50 text-pink-300 hover:bg-pink-500/20"
    ref={ref}
  >
    Sign in/Continue
  </Button>
));

export default Navigation;