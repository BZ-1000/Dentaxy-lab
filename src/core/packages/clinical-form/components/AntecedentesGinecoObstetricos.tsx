
import React, { useState } from 'react';
import { Minus, Maximize2, X } from "lucide-react";
import { FormDataState } from '../types/historiaClinica';
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { VoiceInput } from "@/components/ui/voice-input";

interface AntecedentesGinecoObstetricosProps {
  formData: FormDataState;
  handleAntecedenteGinecoObstetricoChange: (field: string, value: any) => void;
}

const AntecedentesGinecoObstetricos: React.FC<AntecedentesGinecoObstetricosProps> = ({
  formData,
  handleAntecedenteGinecoObstetricoChange
}) => {
  const [isMinimized, setIsMinimized] = useState(false);
  const [isMaximized, setIsMaximized] = useState(false);
  const [activeTab, setActiveTab] = useState('formulario');
  const [redaccionContent, setRedaccionContent] = useState('');
  const [isGeneratingRedaccion, setIsGeneratingRedaccion] = useState(false);

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
  const handleTextChange = (field: string, value: string) => {
    handleAntecedenteGinecoObstetricoChange(field, value);
  };
  const handleNumberChange = (field: string, value: string) => {
    // Permitir string vacío para limpiar el input
    if (value === '') {
      handleAntecedenteGinecoObstetricoChange(field, '');
    } else {
      // Solo permitir números enteros positivos, converir o 0 si NaN
      const numValue = parseInt(value, 10);
      handleAntecedenteGinecoObstetricoChange(field, isNaN(numValue) ? 0 : numValue);
    }
  };
  const handleVoiceInput = (field: string) => (text: string) => {
    const currentValue = formData.antecedentesGinecoObstetricos?.[field] || "";
    handleAntecedenteGinecoObstetricoChange(field, currentValue ? `${currentValue} ${text}` : text);
  };
  const generateRedaccion = () => {
    setIsGeneratingRedaccion(true);
    setTimeout(() => {
      let content = "ANTECEDENTES GINECO-OBSTÉTRICOS:\n\n";
      if (formData.antecedentesGinecoObstetricos) {
        const {
          embarazos,
          partos,
          cesareas,
          abortos,
          complicaciones
        } = formData.antecedentesGinecoObstetricos;
        content += `Gestas: ${embarazos || 0}\n`;
        content += `Partos: ${partos || 0}\n`;
        content += `Cesáreas: ${cesareas || 0}\n`;
        content += `Abortos: ${abortos || 0}\n\n`;
        if (complicaciones) {
          content += `Complicaciones: ${complicaciones}\n`;
        } else {
          content += "No se reportan complicaciones.\n";
        }

        // Fórmula obstétrica
        content += `\nFórmula obstétrica: G${embarazos || 0} P${partos || 0} C${cesareas || 0} A${abortos || 0}`;
      } else {
        content += "No se registraron datos gineco-obstétricos.";
      }
      setRedaccionContent(content);
      setIsGeneratingRedaccion(false);
      setActiveTab('redaccion');
    }, 1000);
  };

  return (
    <div
      className={`max-w-4xl mx-auto transition-all duration-300 ${isMaximized ? "fixed inset-4 z-50" : ""}`}
      data-section-redaction="true"
      data-section-name="antecedentesGinecoObstetricos"
    >
      <div
        className={`w-full bg-transparent ${
          isMaximized ? "h-[calc(100vh-2rem)] overflow-y-auto" : ""
        }`}
      >
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex justify-center w-full">
            

          <div className="flex items-center gap-1 sm:gap-2">
            
            
            
          </div>
        </div>{/* cierra flex justify-center */}
        </div>

        <div className="flex justify-start px-6 py-2">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <span className="text-gray-400">VIII.</span> ANTECEDENTES GINECO-OBSTÉTRICOS
            <span className="text-xs text-gray-400 ml-2">(solo para pacientes mujeres)</span>
          </h2>
        </div>

        {!isMinimized && (
          <>
            {activeTab === "formulario" ? (
              <div className="p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="embarazos" className="block text-sm font-medium mb-1">Número de embarazos:</label>
                    <Input
                      id="embarazos"
                      type="number"
                      value={formData.antecedentesGinecoObstetricos?.embarazos?.toString() || ""}
                      onChange={(e) => handleNumberChange("embarazos", e.target.value)}
                      placeholder="0"
                      min="0"
                      className="w-full"
                    />
                  </div>

                  <div>
                    <label htmlFor="partos" className="block text-sm font-medium mb-1">Número de partos:</label>
                    <Input
                      id="partos"
                      type="number"
                      value={formData.antecedentesGinecoObstetricos?.partos?.toString() || ""}
                      onChange={(e) => handleNumberChange("partos", e.target.value)}
                      placeholder="0"
                      min="0"
                      className="w-full"
                    />
                  </div>

                  <div>
                    <label htmlFor="cesareas" className="block text-sm font-medium mb-1">Número de cesáreas:</label>
                    <Input
                      id="cesareas"
                      type="number"
                      value={formData.antecedentesGinecoObstetricos?.cesareas?.toString() || ""}
                      onChange={(e) => handleNumberChange("cesareas", e.target.value)}
                      placeholder="0"
                      min="0"
                      className="w-full"
                    />
                  </div>

                  <div>
                    <label htmlFor="abortos" className="block text-sm font-medium mb-1">Número de abortos:</label>
                    <Input
                      id="abortos"
                      type="number"
                      value={formData.antecedentesGinecoObstetricos?.abortos?.toString() || ""}
                      onChange={(e) => handleNumberChange("abortos", e.target.value)}
                      placeholder="0"
                      min="0"
                      className="w-full"
                    />
                  </div>
                </div>

                <div className="relative">
                  <label htmlFor="complicaciones" className="block text-sm font-medium mb-1">Complicaciones:</label>
                  <div className="flex items-center gap-2 sm:gap-4">
                    <Textarea
                      id="complicaciones"
                      value={formData.antecedentesGinecoObstetricos?.complicaciones || ""}
                      onChange={(e) => handleTextChange("complicaciones", e.target.value)}
                      placeholder="Describa cualquier complicación durante embarazos o partos"
                      className="min-h-[80px] flex-1 resize-y"
                    />
                    <div className="h-8 sm:h-10">
                      <VoiceInput onTranscriptionComplete={handleVoiceInput("complicaciones")} />
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-6">
                <div
                  className="bg-transparent dark:bg-gray-900 rounded-lg p-4 min-h-[200px] whitespace-pre-wrap"
                  style={{
                    whiteSpace: "pre-wrap",
                  }}
                  data-redaction-content
                >
                  {redaccionContent ||
                    "No se ha generado redacción aún. Utilice el botón 'Generar Redacción IA' en la pestaña de Formulario."}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default AntecedentesGinecoObstetricos;
