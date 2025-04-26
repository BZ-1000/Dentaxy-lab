
import React from 'react';

const LoadingTransition = () => {
  return (
    <div className="fixed inset-0 bg-black flex items-center justify-center z-50">
      <div className="flex flex-col items-center space-y-4">
        <img 
          src="/lovable-uploads/5636450b-9d56-40a0-b095-dd830e161077.png" 
          alt="Dental Logo" 
          className="w-16 h-16"
          loading="eager"
        />
      </div>
    </div>
  );
};

export default LoadingTransition;
