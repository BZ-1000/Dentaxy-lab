import React, { useState } from 'react';
import { Minus, Maximize2 } from "lucide-react";
import { FormDataState } from '../types/historiaClinica';
import ExamenIntrabucalForm from './examen-intrabucal/ExamenIntrabucalForm';
import RedaccionIntrabucalIA from './examen-intrabucal/RedaccionIntrabucalIA';

interface ExamenIntrabucalProps {
  formData: FormDataState;
  handleExamenIntrabucalChange: (part: string, value: any) => void;
  onRedaccionGenerada?: (text: string) => void;
}

const ExamenIntrabucal: React.FC<ExamenIntrabucalProps> = ({
  formData,
  handleExamenIntrabucalChange,
  onRedaccionGenerada
}) => {
  const [isMinimized, setIsMinimized] = useState(false);
  const [isMaximized, setIsMaximized] = useState(false);
  const [showForm, setShowForm] = useState(true);
  const [redaccionTrigger, setRedaccionTrigger] = useState(0);

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
      <div className="w-full bg-transparent">
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex justify-center flex-1">
            
          <div className="flex items-center gap-1 sm:gap-2">
            
            
          </div>
        </div>{/* cierra flex justify-center */}
        </div>
        <div className="flex justify-start px-6 py-2">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <span className="text-gray-400">XIII.</span> EXAMEN INTRABUCAL
          </h2>
        </div>
        {!isMinimized && (
          <div className="p-6">
            {showForm ? (
              <ExamenIntrabucalForm
                formData={formData}
                handleExamenIntrabucalChange={handleExamenIntrabucalChange}
                onGenerate={() => { setShowForm(false); setRedaccionTrigger(t => t + 1); }}
              />
            ) : (
              <RedaccionIntrabucalIA
                formData={formData}
                onSwitchToForm={() => setShowForm(true)}
                triggerRegenerate={redaccionTrigger}
                onRedaccionGenerada={onRedaccionGenerada}
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ExamenIntrabucal;
