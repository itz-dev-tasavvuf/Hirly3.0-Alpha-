import React from 'react';
import { motion } from 'framer-motion';

const MultiSelectToggle = ({ options, selected, onChange, title }) => {
  const handleToggle = (option) => {
    const newSelected = selected.includes(option)
      ? selected.filter((item) => item !== option)
      : [...selected, option];
    onChange(newSelected);
  };

  return (
    <div className="space-y-4">
      <h3 className="text-xl font-semibold text-white">{title}</h3>
      <div className="flex flex-wrap gap-3">
        {options.map((option) => (
          <motion.button
            key={option}
            onClick={() => handleToggle(option)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 border ${
              selected.includes(option)
                ? 'bg-purple-600 border-purple-500 text-white'
                : 'bg-slate-800/50 border-slate-700 text-gray-300 hover:bg-slate-700/70'
            }`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {option}
          </motion.button>
        ))}
      </div>
    </div>
  );
};

export default MultiSelectToggle;