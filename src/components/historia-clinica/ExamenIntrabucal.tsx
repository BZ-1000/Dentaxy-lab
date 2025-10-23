import React, { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Minus, Maximize2 } from "lucide-react";
import { FormDataState } from '@/types/historiaClinica';

interface ExamenIntrabucalProps {
  formData: FormDataState;
  handleExamenIntrabucalChange: (part: string, value: string | boolean) => void;
}

const ExamenIntrabucal: React.FC<ExamenIntrabucalProps> = ({
  formData,
  handleExamenIntrabucalChange
}) => {
  const [isMinimized, setIsMinimized] = useState(false);
  const [isMaximized, setIsMaximized] = useState(false);
  const [showForm, setShowForm] = useState(true);

  const handleMinimize = () => {
    setIsMinimized(!isMinimized);
    setIsMaximized(false);
  };

  const handleMaximize = () => {
    setIsMaximized(!isMaximized);
    setIsMinimized(false);
  };

  return (
    <div className={`max-w-4xl mx-auto transition-all duration-300 ${isMaximized ? "fixed inset-4 z-50" : ""}`}>
      <Card className={`bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-lg rounded-xl border-0 ${isMaximized ? "h-[calc(100vh-2rem)] overflow-y-auto" : ""}`}>
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex justify-center flex-1">
            <div className="flex bg-gray-200 dark:bg-gray-700 rounded-full p-0.5 sm:p-1">
              <button 
                onClick={() => setShowForm(true)}
                className={`px-3 sm:px-5 py-1 sm:py-1.5 rounded-full transition-all duration-300 text-xs sm:text-sm ${
                  showForm 
                    ? "bg-blue-500 text-white shadow-md" 
                    : "text-gray-700 dark:text-gray-300"
                }`}
              >
                Formulario
              </button>
              <button 
                onClick={() => setShowForm(false)}
                className={`px-3 sm:px-5 py-1 sm:py-1.5 rounded-full transition-all duration-300 text-xs sm:text-sm ${
                  !showForm 
                    ? "bg-blue-500 text-white shadow-md" 
                    : "text-gray-700 dark:text-gray-300"
                }`}
              >
                Redacción IA
              </button>
            </div>
          </div>
          <div className="flex items-center gap-1 sm:gap-2">
            <button onClick={handleMinimize} className="p-0.5 sm:p-1 rounded-full bg-green-100 text-green-600 hover:bg-green-200 transition-colors">
              <Minus className="w-3 h-3 sm:w-4 sm:h-4" />
            </button>
            <button onClick={handleMaximize} className="p-0.5 sm:p-1 rounded-full bg-yellow-100 text-yellow-600 hover:bg-yellow-200 transition-colors">
              <Maximize2 className="w-3 h-3 sm:w-4 sm:h-4" />
            </button>
          </div>
        </div>
        <div className="flex justify-start px-6 py-2">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <span className="text-gray-400">XIII.</span> EXAMEN INTRABUCAL
          </h2>
        </div>
        {!isMinimized && (
          <div className="p-6">
            {showForm ? (
              <div className="text-center text-gray-500">
                {/* Contenido del formulario - Por diseñar */}
              </div>
            ) : (
              <div className="text-center text-gray-500">
                {/* Contenido de redacción IA - Por diseñar */}
              </div>
            )}
          </div>
        )}
      </Card>
    </div>
  );
};

export default ExamenIntrabucal;
