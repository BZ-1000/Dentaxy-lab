
import React, { useState } from 'react';
import { Minus, Maximize2, X } from "lucide-react";
import { FormDataState } from '@/types/historiaClinica';

interface RelacionDientesProps {
  formData: FormDataState;
  handleRelacionDientesChange: (part: string, value: string | boolean) => void;
}

const RelacionDientes: React.FC<RelacionDientesProps> = ({
  formData,
  handleRelacionDientesChange
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
        <div className="flex items-center justify-between p-4">
          <div className="flex justify-center w-full">
            

          <div className="flex items-center gap-1 sm:gap-2">
            
            
            
          </div>
          </div>{/* cierra: flex justify-center */}
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

export default RelacionDientes;
