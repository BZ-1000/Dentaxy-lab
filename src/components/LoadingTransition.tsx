
import React from 'react';

const LoadingTransition = () => {
  return (
    <div className="fixed inset-0 bg-black animate-fade-in flex items-center justify-center z-50">
      <div className="flex flex-col items-center space-y-4 animate-fade-in">
        <img 
          src="/lovable-uploads/5636450b-9d56-40a0-b095-dd830e161077.png" 
          alt="Dental Logo" 
          className="w-16 h-16 opacity-0 animate-fade-in"
          style={{ animationDelay: '300ms', animationFillMode: 'forwards' }}
          loading="eager"
        />
      </div>
    </div>
  );
};

export default LoadingTransition;
