import React, { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Minus, Maximize2, X } from "lucide-react";
import { FormDataState } from '@/types/historiaClinica';
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

  const gineco = formData.antecedentesGinecoObstetricos || {};

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
    const numValue = value === '' ? '' : parseInt(value) || 0;
    handleAntecedenteGinecoObstetricoChange(field, numValue);
  };

  const handleVoiceInput = (field: string) => (text: string) => {
    const currentValue = gineco[field] || "";
    handleAntecedenteGinecoObstetricoChange(field, currentValue ? `${currentValue} ${text}` : text);
  };

  return (
    <div className={`max-w-4xl mx-auto transition-all duration-300 ${isMaximized ? "fixed inset-4 z-50" : ""}`} data-section-name="antecedentesGinecoObstetricos">
      <Card className={`bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-lg rounded-xl border-0 ${isMaximized ? "h-[calc(100vh-2rem)] overflow-y-auto" : ""}`}>
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <span className="text-gray-400">VIII.</span> ANTECEDENTES GINECO-OBSTÉTRICOS
            <span className="text-xs text-gray-400 ml-2">(solo para pacientes mujeres)</span>
          </h2>
          <div className="flex items-center gap-2">
            <button onClick={handleMinimize} className="p-1 rounded-full bg-green-100 text-green-600 hover:bg-green-200 transition-colors">
              <Minus className="w-4 h-4" />
            </button>
            <button onClick={handleMaximize} className="p-1 rounded-full bg-yellow-100 text-yellow-600 hover:bg-yellow-200 transition-colors">
              <Maximize2 className="w-4 h-4" />
            </button>
            <button onClick={handleClose} className="p-1 rounded-full bg-red-100 text-red-600 hover:bg-red-200 transition-colors">
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {!isMinimized && (
          <div className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-1">Número de embarazos:</label>
                <Input
                  type="number"
                  value={gineco.embarazos ?? ''}
                  onChange={e => handleNumberChange('embarazos', e.target.value)}
                  placeholder="0"
                  min="0"
                  className="w-full"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Número de partos:</label>
                <Input
                  type="number"
                  value={gineco.partos ?? ''}
                  onChange={e => handleNumberChange('partos', e.target.value)}
                  placeholder="0"
                  min="0"
                  className="w-full"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Número de cesáreas:</label>
                <Input
                  type="number"
                  value={gineco.cesareas ?? ''}
                  onChange={e => handleNumberChange('cesareas', e.target.value)}
                  placeholder="0"
                  min="0"
                  className="w-full"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Número de abortos:</label>
                <Input
                  type="number"
                  value={gineco.abortos ?? ''}
                  onChange={e => handleNumberChange('abortos', e.target.value)}
                  placeholder="0"
                  min="0"
                  className="w-full"
                />
              </div>
            </div>

            <div className="relative">
              <label className="block text-sm font-medium mb-1">Complicaciones:</label>
              <div className="flex items-center">
                <Textarea
                  value={gineco.complicaciones || ''}
                  onChange={e => handleTextChange('complicaciones', e.target.value)}
                  placeholder="Describa cualquier complicación durante embarazos o partos"
                  className="min-h-[80px] flex-1"
                />
                <div className="ml-2">
                  <button className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center hover:bg-blue-600 transition-colors">
                    <VoiceInput onTranscriptionComplete={handleVoiceInput('complicaciones')} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
};

export default AntecedentesGinecoObstetricos;
