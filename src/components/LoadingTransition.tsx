
import React from 'react';
import { Loader2 } from 'lucide-react';

const LoadingTransition = () => {
  return (
    <div className="fixed inset-0 bg-white dark:bg-gray-900 flex items-center justify-center z-50">
      <div className="flex flex-col items-center space-y-4">
        <img 
          src="/lovable-uploads/5636450b-9d56-40a0-b095-dd830e161077.png" 
          alt="Dental Logo" 
          className="w-16 h-16 animate-bounce"
          loading="eager"
        />
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
      </div>
    </div>
  );
};

export default LoadingTransition;
