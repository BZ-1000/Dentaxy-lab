import React from 'react';
import { FormDataState } from '../types/historiaClinica';
import ExamenIntrabucalForm from './examen-intrabucal/ExamenIntrabucalForm';
import { generarRedaccionIntrabucal } from './examen-intrabucal/redaccionLogic';

interface ExamenIntrabucalProps {
  formData: FormDataState;
  handleExamenIntrabucalChange: (part: string, value: any) => void;
  onRedaccionGenerada?: (text: string) => void;
}

const ExamenIntrabucal: React.FC<ExamenIntrabucalProps> = ({
  formData,
  handleExamenIntrabucalChange,
  onRedaccionGenerada,
}) => {

  const handleGlobalGeneration = () => {
    if (onRedaccionGenerada) {
      const { fullText } = generarRedaccionIntrabucal(formData);
      onRedaccionGenerada(fullText);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="w-full bg-transparent">
        <button
          className="hidden data-trigger-generation"
          onClick={handleGlobalGeneration}
          type="button"
          aria-hidden="true"
        >
          Generador Oculto
        </button>

        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex justify-center flex-1">
            <div className="flex items-center gap-1 sm:gap-2">
            </div>
          </div>
        </div>
        <div className="flex justify-start px-6 py-2">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <span className="text-gray-400">XIII.</span> EXAMEN INTRABUCAL
          </h2>
        </div>
        <div className="p-6">
          <ExamenIntrabucalForm
            formData={formData}
            handleExamenIntrabucalChange={handleExamenIntrabucalChange}
          />
        </div>
      </div>
    </div>
  );
};

export default ExamenIntrabucal;
