
import React from 'react';

const LoadingScreen = () => {
  return (
    <div className="fixed inset-0 bg-black flex items-center justify-center z-50">
      <div className="animate-pulse">
        <img
          src="/lovable-uploads/af40aeca-5b6d-4955-ac17-6ec78e2c26ac.png"
          alt="Loading"
          className="w-24 h-24"
          loading="eager"
          fetchPriority="high"
        />
      </div>
    </div>
  );
};

export default LoadingScreen;
