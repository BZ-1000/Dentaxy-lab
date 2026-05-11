import React from 'react';
import { FormDataState } from '@/types/historiaClinica';
import ExamenIntrabucalForm from './examen-intrabucal/ExamenIntrabucalForm';
import { generarRedaccionIntrabucal } from './examen-intrabucal/redaccionLogic';

interface ExamenIntrabucalProps {
  formData: FormDataState;
  handleExamenIntrabucalChange: (part: string, value: any) => void;
  onRedaccionGenerada?: (text: string) => void;
  onToggleViewMode?: () => void;
}

const ExamenIntrabucal: React.FC<ExamenIntrabucalProps> = ({
  formData,
  handleExamenIntrabucalChange,
  onRedaccionGenerada,
}) => {

  /**
   * handleGlobalGeneration
   * Llamado por el botón oculto (data-trigger-generation) que el
   * AppleStyleDock encuentra y hace click al presionar "Siguiente".
   * Genera la redacción sincrónicamente y la envía al Documento Automático.
   */
  const handleGlobalGeneration = () => {
    if (onRedaccionGenerada) {
      const { fullText } = generarRedaccionIntrabucal(formData);
      onRedaccionGenerada(fullText);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="w-full bg-transparent">
        {/* Botón oculto: el AppleStyleDock lo busca por DOM query y lo dispara al presionar Siguiente */}
        <button
          className="hidden data-trigger-generation"
          onClick={handleGlobalGeneration}
          type="button"
          aria-hidden="true"
        >
          Generador Oculto
        </button>

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
