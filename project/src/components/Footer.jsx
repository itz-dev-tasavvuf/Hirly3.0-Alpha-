import   const handleLinkClick = (linkName) => {
    toast({
      title: "👻 Not available yet, but will be soon!"
    });
  }; from 'react';
import { motion } from 'framer-motion';
import { Github, Twitter, Linkedin, Mail } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import algorandLogo from '@/assets/algorand-logo.svg';

const Footer = () => {
  const handleLinkClick = (linkName) => {
    toast({
      title: "� Not available yet, but will be soon!"
    });
  };

  const footerLinks = {
    Product: ['About', 'Features', 'Pricing', 'Demo'],
    Company: ['Blog', 'Careers', 'Press', 'Contact'],
    Resources: ['Documentation', 'Help Center', 'Community', 'API'],
    Legal: ['Privacy Policy', 'Terms of Service', 'Cookie Policy', 'GDPR']
  };

  const socialLinks = [
    { icon: Twitter, name: 'Twitter' },
    { icon: Linkedin, name: 'LinkedIn' },
    { icon: Github, name: 'GitHub' },
    { icon: Mail, name: 'Email' }
  ];

  return (
    <footer className="relative py-16 border-t border-white/10">
      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-5 gap-8 mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-2"
          >
            <div className="flex items-center mb-6">
              <span className="text-3xl font-bold gradient-text">Hirly</span>
            </div>
            <p className="text-gray-300 mb-6 max-w-md">
              The future of job hunting is here. Swipe-based matching powered by blockchain verification 
              for a secure, efficient, and enjoyable hiring experience.
            </p>
            
            <div className="flex items-center mb-6">
              <img alt="Algorand logo" className="w-6 h-6 mr-2" src={algorandLogo} />
              <span className="text-green-400 font-medium">Powered by Algorand</span>
            </div>

            <div className="flex space-x-4">
              {socialLinks.map((social, index) => (
                <motion.button
                  key={index}
                  onClick={() => handleLinkClick(social.name)}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-10 h-10 bg-white/10 hover:bg-purple-500/20 rounded-lg flex items-center justify-center transition-colors"
                >
                  <social.icon className="w-5 h-5 text-gray-400 hover:text-purple-400" />
                </motion.button>
              ))}
            </div>
          </motion.div>

          {Object.entries(footerLinks).map(([category, links], categoryIndex) => (
            <motion.div
              key={category}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: categoryIndex * 0.1 }}
            >
              <h3 className="text-white font-semibold mb-4">{category}</h3>
              <ul className="space-y-3">
                {links.map((link, linkIndex) => (
                  <li key={linkIndex}>
                    {link === 'Help Center' ? (
                      <a
                        href="/help-center"
                        className="text-gray-400 hover:text-purple-400 transition-colors text-left"
                      >
                        Help Center
                      </a>
                    ) : link === 'Documentation' ? (
                      <a
                        href="/documentation"
                        className="text-gray-400 hover:text-purple-400 transition-colors text-left"
                      >
                        Documentation
                      </a>
                    ) : link === 'Community' ? (
                      <a
                        href="/community"
                        className="text-gray-400 hover:text-purple-400 transition-colors text-left"
                      >
                        Community
                      </a>
                    ) : link === 'API' ? (
                      <a
                        href="/developer"
                        className="text-gray-400 hover:text-purple-400 transition-colors text-left"
                      >
                        API
                      </a>
                    ) : link === 'Careers' ? (
                      <a
                        href="/careers"
                        className="text-gray-400 hover:text-purple-400 transition-colors text-left"
                      >
                        Careers
                      </a>
                    ) : (
                      <button
                        onClick={() => handleLinkClick(link)}
                        className="text-gray-400 hover:text-purple-400 transition-colors text-left"
                      >
                        {link}
                      </button>
                    )}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center"
        >
          <p className="text-gray-400 text-sm mb-4 md:mb-0">
            © 2025 Hirly. All rights reserved. Built with ❤️ for the future of work.
          </p>
          
          <div className="flex items-center space-x-6 text-sm">
            <button
              onClick={() => handleLinkClick('Submit Feedback')}
              className="text-purple-400 hover:text-purple-300 transition-colors"
            >
              Submit Feedback
            </button>
            <button
              onClick={() => handleLinkClick('Status')}
              className="text-gray-400 hover:text-white transition-colors flex items-center"
            >
              <div className="w-2 h-2 bg-green-400 rounded-full mr-2" />
              All systems operational
            </button>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-8 pt-6 border-t border-white/5 text-center"
        >
          <p className="text-gray-500 text-xs">
            Hirly uses blockchain technology to verify identities and job postings. 
            Your data is encrypted and stored securely on the Algorand network.
          </p>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;