
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Minus, Maximize2, X, Sparkles } from "lucide-react";
import { FormDataState } from '@/types/historiaClinica';
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { VoiceInput } from "@/components/ui/voice-input";

interface AntecedentesGinecoObstetricosProps {
  formData: FormDataState;
  handleAntecedenteGinecoObstetricoChange: (field: string, value: any) => void;
  onRedaccionGenerada?: (text: string) => void;
  onToggleViewMode?: () => void;
}

const AntecedentesGinecoObstetricos: React.FC<AntecedentesGinecoObstetricosProps> = ({
  formData,
  handleAntecedenteGinecoObstetricoChange,
  onRedaccionGenerada,
  onToggleViewMode
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
    // Remove timeout
    let content = "";
    if (formData.antecedentesGinecoObstetricos) {
      const {
        embarazos,
        partos,
        cesareas,
        abortos,
        complicaciones
      } = formData.antecedentesGinecoObstetricos;
      content += `Gestas: ${embarazos || 0}<br/>`;
      content += `Partos: ${partos || 0}<br/>`;
      content += `Cesáreas: ${cesareas || 0}<br/>`;
      content += `Abortos: ${abortos || 0}<br/><br/>`;
      if (complicaciones) {
        content += `Complicaciones: ${complicaciones}<br/>`;
      } else {
        content += "No se reportan complicaciones.<br/>";
      }

      // Fórmula obstétrica
      content += `<br/>Fórmula obstétrica: G${embarazos || 0} P${partos || 0} C${cesareas || 0} A${abortos || 0}`;
    } else {
      content += "No se registraron datos gineco-obstétricos.";
    }
    setRedaccionContent(content);
    if (onRedaccionGenerada) {
      onRedaccionGenerada(content);
    }
    setIsGeneratingRedaccion(false);
    setActiveTab('redaccion');

    if (onToggleViewMode) {
      onToggleViewMode();
    }
  };

  return (
    <div
      className={`max-w-4xl mx-auto transition-all duration-300 ${isMaximized ? "fixed inset-4 z-50" : ""}`}
      data-section-redaction="true"
      data-section-name="antecedentesGinecoObstetricos"
    >
      <div
        className={`w-full bg-transparent ${isMaximized ? "h-[calc(100vh-2rem)] overflow-y-auto" : ""}`}
      >



        {!isMinimized && (
          <>
            {activeTab === "formulario" ? (
              <div className="p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="embarazos" className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Número de embarazos:</label>
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
                    <label htmlFor="partos" className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Número de partos:</label>
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
                    <label htmlFor="cesareas" className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Número de cesáreas:</label>
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
                    <label htmlFor="abortos" className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Número de abortos:</label>
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
                  <label htmlFor="complicaciones" className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Complicaciones:</label>
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

                <div className="flex justify-end items-center gap-3 pt-6 mt-6 border-t border-gray-100 dark:border-gray-700/50">
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
