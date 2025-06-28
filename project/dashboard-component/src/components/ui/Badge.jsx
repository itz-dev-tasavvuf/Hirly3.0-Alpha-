import React from 'react';

const Badge = ({ label, color = 'bg-gray-500' }) => {
  return (
    <span className={`inline-flex items-center px-2 py-1 text-xs font-bold text-white ${color} rounded`}>
      {label}
    </span>
  );
};

export default Badge;