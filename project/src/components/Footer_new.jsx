import React from 'react';
import { motion } from 'framer-motion';
import { Github, Twitter, Linkedin, Mail } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import algorandLogo from '@/assets/algorand-logo.svg';

const Footer = () => {
  const handleLinkClick = (linkName) => {
    toast({
      title: "👻 Not available yet, but will be soon!"
    });
  };

  const footerLinks = {
    Product: ['About', 'Features', 'Pricing', 'Demo'],
    Company: ['Blog', 'Careers', 'Press', 'Contact'],
    Resources: ['Documentation', 'Help Center', 'Community', 'API'],
    Legal: ['Privacy Policy', 'Terms of Service', 'Cookie Policy', 'GDPR']
  };

  const socialIcons = [
    { icon: Twitter, name: 'Twitter' },
    { icon: Linkedin, name: 'LinkedIn' },
    { icon: Github, name: 'GitHub' },
    { icon: Mail, name: 'Email' }
  ];

  return (
    <footer className="relative py-16 border-t border-white/10">
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/3 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/3 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
          {/* Brand Section */}
          <div className="col-span-2 md:col-span-1">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mb-8"
            >
              <h3 className="text-2xl font-bold gradient-text mb-4">Hirly</h3>
              <p className="text-gray-300 text-sm leading-relaxed mb-6">
                The future of recruiting. AI-powered matching with blockchain verification for the modern workforce.
              </p>
              
              <div className="flex items-center gap-4 mb-6">
                <span className="text-sm text-gray-400">Powered by</span>
                <img src={algorandLogo} alt="Algorand" className="h-6" />
              </div>
              
              <div className="flex space-x-4">
                {socialIcons.map((social, index) => (
                  <motion.button
                    key={social.name}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleLinkClick(social.name)}
                    className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
                  >
                    <social.icon className="w-5 h-5 text-gray-400 hover:text-white transition-colors" />
                  </motion.button>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Links Sections */}
          {Object.entries(footerLinks).map(([category, links], index) => (
            <motion.div
              key={category}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="col-span-1"
            >
              <h4 className="text-white font-semibold mb-4">{category}</h4>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link}>
                    <button
                      onClick={() => handleLinkClick(link)}
                      className="text-gray-300 hover:text-white transition-colors text-sm"
                    >
                      {link}
                    </button>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        {/* Bottom Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-12 pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center"
        >
          <p className="text-gray-400 text-sm mb-4 md:mb-0">
            © 2025 Hirly. All rights reserved.
          </p>
          
          <div className="flex items-center gap-6 text-sm">
            <button
              onClick={() => handleLinkClick('Privacy Policy')}
              className="text-gray-400 hover:text-white transition-colors"
            >
              Privacy Policy
            </button>
            <button
              onClick={() => handleLinkClick('Terms of Service')}
              className="text-gray-400 hover:text-white transition-colors"
            >
              Terms of Service
            </button>
            <span className="text-gray-500">Made with ❤️ for the future of work</span>
          </div>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;
