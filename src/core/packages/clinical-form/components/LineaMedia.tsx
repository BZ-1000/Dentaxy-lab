
import React, { useState } from 'react';
import { Minus, Maximize2, X } from "lucide-react";
import { FormDataState } from '../types/historiaClinica';

interface LineaMediaProps {
  formData: FormDataState;
  handleLineaMediaChange: (part: string, value: string | boolean) => void;
}

const LineaMedia: React.FC<LineaMediaProps> = ({
  formData,
  handleLineaMediaChange
}) => {
  const [isMinimized, setIsMinimized] = useState(false);
  const [isMaximized, setIsMaximized] = useState(false);

  const handleMinimize = () => {
    setIsMinimized(!isMinimized);
    setIsMaximized(false);
  };

  const handleMaximize = () => {
    setIsMaximized(!isMaximized);
    setIsMinimized(false);
  };

  const handleClose = () => {
    setIsMinimized(false);
    setIsMaximized(false);
  };

  return (
    <div className={`max-w-4xl mx-auto transition-all duration-300 ${isMaximized ? "fixed inset-4 z-50" : ""}`}>
      <div className="w-full bg-transparent">
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex justify-center w-full">
            

          <div className="flex items-center gap-1 sm:gap-2">
            
            
            
          </div>
        </div>{/* cierra flex justify-center */}
        </div>

        <div className="flex justify-start px-6 py-2">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <span className="text-gray-400">XVII.</span> LÍNEA MEDIA
          </h2>
        </div>

        {!isMinimized && (
          <div className="p-6 flex items-center justify-center">
            <h1 className="text-4xl font-bold text-gray-400 dark:text-gray-500">Próximamente</h1>
          </div>
        )}
      </div>
    </div>
  );
};

export default LineaMedia;
