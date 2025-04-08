
import React, { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Minus, Maximize2, X, ChevronDown, ChevronUp } from "lucide-react";
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
    const numValue = value === '' ? '' : parseInt(value) || 0;
    handleAntecedenteGinecoObstetricoChange(field, numValue);
  };

  const incrementValue = (field: string) => {
    const currentValue = formData.antecedentesGinecoObstetricos?.[field] || 0;
    handleAntecedenteGinecoObstetricoChange(field, parseInt(currentValue as string) + 1);
  };

  const decrementValue = (field: string) => {
    const currentValue = formData.antecedentesGinecoObstetricos?.[field] || 0;
    if (parseInt(currentValue as string) > 0) {
      handleAntecedenteGinecoObstetricoChange(field, parseInt(currentValue as string) - 1);
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

  return <div className={`max-w-4xl mx-auto transition-all duration-300 ${isMaximized ? "fixed inset-4 z-50" : ""}`} data-section-redaction="true" data-section-name="antecedentesGinecoObstetricos">
      <Card className={`bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-lg rounded-xl border-0 ${isMaximized ? "h-[calc(100vh-2rem)] overflow-y-auto" : ""}`}>
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex justify-center w-full">
            <div className="flex bg-gray-200 dark:bg-gray-700 rounded-full p-1">
              <button className={`px-5 py-1.5 rounded-full transition-all duration-300 text-sm ${activeTab === 'formulario' ? 'bg-blue-500 text-white shadow-md' : 'text-gray-700 dark:text-gray-300'}`} onClick={() => setActiveTab('formulario')}>
                Formulario
              </button>
              <button className={`px-5 py-1.5 rounded-full transition-all duration-300 text-sm ${activeTab === 'redaccion' ? 'bg-blue-500 text-white shadow-md' : 'text-gray-700 dark:text-gray-300'}`} onClick={() => setActiveTab('redaccion')}>
                Redacción IA
              </button>
            </div>
          </div>

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

        <div className="flex justify-start px-6 py-2">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <span className="text-gray-400">VIII.</span> ANTECEDENTES GINECO-OBSTÉTRICOS
            <span className="text-xs text-gray-400 ml-2">(solo para pacientes mujeres)</span>
          </h2>
        </div>

        {!isMinimized && <>
            {activeTab === 'formulario' ? <div className="p-6">
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium mb-2">Número de embarazos:</label>
                      <div className="flex items-center w-full max-w-[200px] rounded-md border overflow-hidden bg-white shadow-sm">
                        <button 
                          type="button"
                          onClick={() => decrementValue('embarazos')}
                          className="px-3 py-2 bg-gray-50 hover:bg-gray-100 transition-colors border-r text-gray-500 focus:outline-none"
                        >
                          <ChevronDown className="h-4 w-4" />
                        </button>
                        <input
                          type="text"
                          value={formData.antecedentesGinecoObstetricos?.embarazos || '0'}
                          onChange={(e) => handleNumberChange('embarazos', e.target.value)}
                          className="flex-1 py-2 px-3 text-center focus:outline-none focus:ring-0 border-none"
                          inputMode="numeric"
                          pattern="\d*"
                        />
                        <button 
                          type="button"
                          onClick={() => incrementValue('embarazos')}
                          className="px-3 py-2 bg-gray-50 hover:bg-gray-100 transition-colors border-l text-gray-500 focus:outline-none"
                        >
                          <ChevronUp className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-2">Número de partos:</label>
                      <div className="flex items-center w-full max-w-[200px] rounded-md border overflow-hidden bg-white shadow-sm">
                        <button 
                          type="button"
                          onClick={() => decrementValue('partos')}
                          className="px-3 py-2 bg-gray-50 hover:bg-gray-100 transition-colors border-r text-gray-500 focus:outline-none"
                        >
                          <ChevronDown className="h-4 w-4" />
                        </button>
                        <input
                          type="text"
                          value={formData.antecedentesGinecoObstetricos?.partos || '0'}
                          onChange={(e) => handleNumberChange('partos', e.target.value)}
                          className="flex-1 py-2 px-3 text-center focus:outline-none focus:ring-0 border-none"
                          inputMode="numeric"
                          pattern="\d*"
                        />
                        <button 
                          type="button"
                          onClick={() => incrementValue('partos')}
                          className="px-3 py-2 bg-gray-50 hover:bg-gray-100 transition-colors border-l text-gray-500 focus:outline-none"
                        >
                          <ChevronUp className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-2">Número de cesáreas:</label>
                      <div className="flex items-center w-full max-w-[200px] rounded-md border overflow-hidden bg-white shadow-sm">
                        <button 
                          type="button"
                          onClick={() => decrementValue('cesareas')}
                          className="px-3 py-2 bg-gray-50 hover:bg-gray-100 transition-colors border-r text-gray-500 focus:outline-none"
                        >
                          <ChevronDown className="h-4 w-4" />
                        </button>
                        <input
                          type="text"
                          value={formData.antecedentesGinecoObstetricos?.cesareas || '0'}
                          onChange={(e) => handleNumberChange('cesareas', e.target.value)}
                          className="flex-1 py-2 px-3 text-center focus:outline-none focus:ring-0 border-none"
                          inputMode="numeric"
                          pattern="\d*"
                        />
                        <button 
                          type="button"
                          onClick={() => incrementValue('cesareas')}
                          className="px-3 py-2 bg-gray-50 hover:bg-gray-100 transition-colors border-l text-gray-500 focus:outline-none"
                        >
                          <ChevronUp className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-2">Número de abortos:</label>
                      <div className="flex items-center w-full max-w-[200px] rounded-md border overflow-hidden bg-white shadow-sm">
                        <button 
                          type="button"
                          onClick={() => decrementValue('abortos')}
                          className="px-3 py-2 bg-gray-50 hover:bg-gray-100 transition-colors border-r text-gray-500 focus:outline-none"
                        >
                          <ChevronDown className="h-4 w-4" />
                        </button>
                        <input
                          type="text"
                          value={formData.antecedentesGinecoObstetricos?.abortos || '0'}
                          onChange={(e) => handleNumberChange('abortos', e.target.value)}
                          className="flex-1 py-2 px-3 text-center focus:outline-none focus:ring-0 border-none"
                          inputMode="numeric"
                          pattern="\d*"
                        />
                        <button 
                          type="button"
                          onClick={() => incrementValue('abortos')}
                          className="px-3 py-2 bg-gray-50 hover:bg-gray-100 transition-colors border-l text-gray-500 focus:outline-none"
                        >
                          <ChevronUp className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="relative">
                    <label className="block text-sm font-medium mb-1">Complicaciones:</label>
                    <div className="flex items-center">
                      <Textarea value={formData.antecedentesGinecoObstetricos?.complicaciones || ''} onChange={e => handleTextChange('complicaciones', e.target.value)} placeholder="Describa cualquier complicación durante embarazos o partos" className="min-h-[80px] flex-1" />
                      <div className="ml-2">
                        <VoiceInput onTranscriptionComplete={handleVoiceInput('complicaciones')} />
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-center mt-6">
                    <button
                      onClick={generateRedaccion}
                      disabled={isGeneratingRedaccion}
                      className="px-4 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 flex items-center gap-2"
                    >
                      {isGeneratingRedaccion ? (
                        <>Generando...</>
                      ) : (
                        <>Generar Redacción IA</>
                      )}
                    </button>
                  </div>
                </div>
              </div> : <div className="p-6">
                <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4 min-h-[200px] whitespace-pre-wrap" style={{
            whiteSpace: 'pre-wrap'
          }} data-redaction-content>
                  {redaccionContent || "No se ha generado redacción aún. Utilice el botón 'Generar Redacción IA' en la pestaña de Formulario."}
                </div>
              </div>}
          </>}
      </Card>
    </div>;
};

export default AntecedentesGinecoObstetricos;
