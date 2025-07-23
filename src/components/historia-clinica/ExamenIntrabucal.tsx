import React, { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Minus, Maximize2, X } from "lucide-react";
import { FormDataState } from '@/types/historiaClinica';
import ExamenIntrabucalForm from './ExamenIntrabucalForm';
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
  const [activeArea, setActiveArea] = useState<string | null>(null);
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
  return <div className={`max-w-4xl mx-auto transition-all duration-300 ${isMaximized ? "fixed inset-4 z-50" : ""}`}>
      <Card className={`bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-lg rounded-xl border-0 ${isMaximized ? "h-[calc(100vh-2rem)] overflow-y-auto" : ""}`}>
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex justify-center w-full">
            <div className="flex bg-gray-200 dark:bg-gray-700 rounded-full p-0.5 sm:p-1">
              <button className="px-3 sm:px-5 py-1 sm:py-1.5 rounded-full transition-all duration-300 text-xs sm:text-sm bg-blue-500 text-white shadow-md">
                Formulario
              </button>
              <button className="px-3 sm:px-5 py-1 sm:py-1.5 rounded-full transition-all duration-300 text-xs sm:text-sm text-gray-700 dark:text-gray-300">
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
            <button onClick={handleClose} className="p-0.5 sm:p-1 rounded-full bg-red-100 text-red-600 hover:bg-red-200 transition-colors">
              <X className="w-3 h-3 sm:w-4 sm:h-4" />
            </button>
          </div>
        </div>

        <div className="flex justify-start px-6 py-2">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <span className="text-gray-400">XIII.</span> EXAMEN INTRABUCAL
          </h2>
        </div>

        {!isMinimized && <div className="p-6">
            <div className="relative max-w-md mx-auto">
              <img 
                src="/lovable-uploads/85981ffd-d2f5-4c51-94ab-9a32dcfd49ec.png"
                alt="Cavidad oral"
                className="w-full h-auto"
              />
              
              {/* Botones clickeables sobre la imagen */}
              <button
                onClick={() => setActiveArea('encias')}
                className="absolute top-[15%] left-[50%] transform -translate-x-1/2 bg-blue-500 text-white px-1 py-0.5 rounded text-xs hover:bg-blue-600 transition-colors"
              >
                Encías
              </button>
              
              <button
                onClick={() => setActiveArea('paladar')}
                className="absolute top-[35%] left-[40%] transform -translate-x-1/2 bg-blue-500 text-white px-1 py-0.5 rounded text-xs hover:bg-blue-600 transition-colors"
              >
                Paladar
              </button>
              
              <button
                onClick={() => setActiveArea('orofaringe')}
                className="absolute top-[40%] left-[50%] transform -translate-x-1/2 bg-blue-500 text-white px-1 py-0.5 rounded text-xs hover:bg-blue-600 transition-colors"
              >
                Orofaringe
              </button>
              
              <button
                onClick={() => setActiveArea('mejillas')}
                className="absolute top-[40%] right-[15%] bg-blue-500 text-white px-1 py-0.5 rounded text-xs hover:bg-blue-600 transition-colors"
              >
                Mejillas
              </button>
              
              <button
                onClick={() => setActiveArea('retromolar')}
                className="absolute top-[50%] left-[10%] bg-blue-500 text-white px-1 py-0.5 rounded text-xs hover:bg-blue-600 transition-colors"
              >
                Retromolar
              </button>
              
              <button
                onClick={() => setActiveArea('lengua')}
                className="absolute bottom-[35%] left-[50%] transform -translate-x-1/2 bg-blue-500 text-white px-1 py-0.5 rounded text-xs hover:bg-blue-600 transition-colors"
              >
                Lengua
              </button>
              
              <button
                onClick={() => setActiveArea('pisoBoca')}
                className="absolute bottom-[25%] left-[50%] transform -translate-x-1/2 bg-blue-500 text-white px-1 py-0.5 rounded text-xs hover:bg-blue-600 transition-colors"
              >
                Piso de boca
              </button>
            </div>

            {/* Formularios popup */}
            {activeArea && (
              <ExamenIntrabucalForm 
                area={activeArea}
                onClose={() => setActiveArea(null)}
                formData={formData}
                handleExamenIntrabucalChange={handleExamenIntrabucalChange}
              />
            )}
          </div>}
      </Card>
    </div>;
};
export default ExamenIntrabucal;