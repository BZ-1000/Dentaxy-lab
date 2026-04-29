
import React, { useState } from 'react';
import { Minus, Maximize2, X } from "lucide-react";
import { FormDataState } from '@/types/historiaClinica';

interface GlandulasSalivalesProps {
  formData: FormDataState;
  handleGlandulasSalivalesChange: (part: string, value: string | boolean) => void;
}

const GlandulasSalivales: React.FC<GlandulasSalivalesProps> = ({
  formData,
  handleGlandulasSalivalesChange
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


        {!isMinimized && (
          <div className="p-6 flex items-center justify-center">
            <h1 className="text-4xl font-bold text-gray-400 dark:text-gray-500">Próximamente</h1>
          </div>
        )}
      </div>
    </div>
  );
};

export default GlandulasSalivales;
