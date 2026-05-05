import React, { useState } from 'react';
import { Minus, Maximize2 } from "lucide-react";
import { FormDataState } from '@/types/historiaClinica';
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
