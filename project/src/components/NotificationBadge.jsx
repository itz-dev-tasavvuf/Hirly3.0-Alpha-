import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const NotificationBadge = ({ count, className = '' }) => {
  if (!count || count === 0) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0, opacity: 0 }}
        whileHover={{ scale: 1.1 }}
        className={`
          absolute -top-1 -right-1 
          bg-red-500 text-white 
          rounded-full flex items-center justify-center
          text-xs font-bold
          shadow-lg border-2 border-white
          min-w-[24px] h-6 px-2
          z-40
          ${className}
        `}
      >
        <motion.span
          key={count}
          initial={{ scale: 1.5 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 500, damping: 20 }}
        >
          {count > 99 ? '99+' : count}
        </motion.span>
      </motion.div>
    </AnimatePresence>
  );
};

export default NotificationBadge;
