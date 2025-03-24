
import React from 'react';
import { Loader2 } from 'lucide-react';

interface LoadingOverlayProps {
  message?: string;
}

const LoadingOverlay: React.FC<LoadingOverlayProps> = ({ 
  message = "Procesando información..." 
}) => {
  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex flex-col items-center justify-center">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-8 shadow-xl max-w-md w-full mx-4 text-center">
        <Loader2 className="h-12 w-12 animate-spin text-blue-500 mx-auto mb-4" />
        <h3 className="text-xl font-semibold mb-2">Procesando</h3>
        <p className="text-gray-600 dark:text-gray-300">{message}</p>
        
        <div className="w-full bg-gray-200 dark:bg-gray-700 h-2 rounded-full mt-6 overflow-hidden">
          <div className="bg-blue-500 h-full rounded-full animate-pulse" style={{width: '100%'}}></div>
        </div>
        
        <div className="flex flex-wrap justify-center gap-3 mt-6">
          {Array.from({length: 5}).map((_, i) => (
            <div 
              key={i} 
              className="w-3 h-3 rounded-full bg-blue-500 animate-bounce" 
              style={{ 
                animationDelay: `${i * 0.15}s`,
                opacity: 0.7 + (i * 0.06)
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default LoadingOverlay;
