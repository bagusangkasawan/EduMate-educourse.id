import React from 'react';

const Spinner = ({ size = 'md', color = 'blue-500' }) => {
  const sizes = {
    sm: 'h-5 w-5 border-2',
    md: 'h-12 w-12 border-4',
    lg: 'h-16 w-16 border-4',
  };

  return (
    <div className="flex justify-center items-center">
      <div
        className={`animate-spin rounded-full border-${color} border-t-transparent ${sizes[size]}`}
      ></div>
    </div>
  );
};

export default Spinner;
