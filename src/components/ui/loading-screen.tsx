
import React, { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';

const LoadingScreen = () => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
    }, 1500); // Adjust timing as needed

    return () => clearTimeout(timer);
  }, []);

  if (!isVisible) return null;

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-background transition-opacity duration-1000 ${
        isVisible ? 'opacity-100' : 'opacity-0'
      }`}
    >
      <div className="flex flex-col items-center space-y-4">
        <div className="w-16 h-16">
          <img
            src="/lovable-uploads/5636450b-9d56-40a0-b095-dd830e161077.png"
            alt="Logo"
            className="w-full h-full object-contain animate-pulse"
          />
        </div>
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-lg font-semibold text-primary animate-pulse">
          Cargando...
        </p>
      </div>
    </div>
  );
};

export default LoadingScreen;
