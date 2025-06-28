import React from 'react';

const Button = ({ onClick, children, className, type = 'button' }) => {
  return (
    <button
      type={type}
      onClick={onClick}
      className={`px-4 py-2 rounded-md text-white bg-blue-600 hover:bg-blue-700 transition duration-200 ${className}`}
    >
      {children}
    </button>
  );
};

export default Button;