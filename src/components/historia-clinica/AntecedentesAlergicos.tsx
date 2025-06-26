
import React, { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Minus, Maximize2, X } from "lucide-react";
import { FormDataState } from '@/types/historiaClinica';
import { Textarea } from "@/components/ui/textarea";
import { VoiceInput } from "@/components/ui/voice-input";

interface AntecedentesAlergicosProps {
  formData: FormDataState;
  handleAntecedenteAlergicoChange: (field: string, value: any) => void;
}

const AntecedentesAlergicos: React.FC<AntecedentesAlergicosProps> = ({
  formData,
  handleAntecedenteAlergicoChange
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
    handleAntecedenteAlergicoChange(field, value);
  };
  const handleBooleanChange = (field: string, value: boolean) => {
    handleAntecedenteAlergicoChange(field, value);
  };
  const handleVoiceInput = (field: string) => (text: string) => {
    const currentValue = formData.antecedentesAlergicos[field] || "";
    handleAntecedenteAlergicoChange(field, currentValue ? `${currentValue} ${text}` : text);
  };
  const generateRedaccion = () => {
    setIsGeneratingRedaccion(true);
    setTimeout(() => {
      let content = "ANTECEDENTES ALÉRGICOS:\n\n";

      if (formData.antecedentesAlergicos.sinAlergias) {
        content += "El paciente niega antecedentes de alergias medicamentosas, alimentarias o de contacto. ";
      } else {
        if (formData.antecedentesAlergicos.medicamentosas) {
          content += `Refiere alergias medicamentosas: ${formData.antecedentesAlergicos.medicamentosas}. `;
        }
        if (formData.antecedentesAlergicos.alimentarias) {
          content += `Refiere alergias alimentarias: ${formData.antecedentesAlergicos.alimentarias}. `;
        }
        if (formData.antecedentesAlergicos.contacto) {
          content += `Refiere alergias de contacto: ${formData.antecedentesAlergicos.contacto}. `;
        }
        if (formData.antecedentesAlergicos.otras) {
          content += `Otras alergias: ${formData.antecedentesAlergicos.otras}. `;
        }
      }

      if (formData.antecedentesAlergicos.detallesAdicionales) {
        content += `\n\nDetalles adicionales: ${formData.antecedentesAlergicos.detallesAdicionales}`;
      }
      setRedaccionContent(content);
      setIsGeneratingRedaccion(false);
      setActiveTab('redaccion');
    }, 1000);
  };

  return <div className={`max-w-4xl mx-auto transition-all duration-300 ${isMaximized ? "fixed inset-4 z-50" : ""}`} data-section-redaction="true" data-section-name="antecedentesAlergicos">
    <Card className={`bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-lg rounded-xl border-0 ${isMaximized ? "h-[calc(100vh-2rem)] overflow-y-auto" : ""}`}>
      <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex justify-center w-full">
          <div className="flex bg-gray-200 dark:bg-gray-700 rounded-full p-0.5 sm:p-1">
            <button className={`px-3 sm:px-5 py-1 sm:py-1.5 rounded-full transition-all duration-300 text-xs sm:text-sm ${activeTab === 'formulario' ? 'bg-blue-500 text-white shadow-md' : 'text-gray-700 dark:text-gray-300'}`} onClick={() => setActiveTab('formulario')}>
              Formulario
            </button>
            <button className={`px-3 sm:px-5 py-1 sm:py-1.5 rounded-full transition-all duration-300 text-xs sm:text-sm ${activeTab === 'redaccion' ? 'bg-blue-500 text-white shadow-md' : 'text-gray-700 dark:text-gray-300'}`} onClick={() => setActiveTab('redaccion')}>
              Redacción IA
            </button>
          </div>
        </div>

        <div className="flex items-center gap-1 sm:gap-2">
          <button onClick={handleMinimize} className="p-0.5 sm:p-1 rounded-full bg-green-100 text-green-600 hover:bg-green-200 transition-colors" type="button">
            <Minus className="w-3 h-3 sm:w-4 sm:h-4" />
          </button>
          <button onClick={handleMaximize} className="p-0.5 sm:p-1 rounded-full bg-yellow-100 text-yellow-600 hover:bg-yellow-200 transition-colors" type="button">
            <Maximize2 className="w-3 h-3 sm:w-4 sm:h-4" />
          </button>
          <button onClick={handleClose} className="p-0.5 sm:p-1 rounded-full bg-red-100 text-red-600 hover:bg-red-200 transition-colors" type="button">
            <X className="w-3 h-3 sm:w-4 sm:h-4" />
          </button>
        </div>
      </div>

      <div className="flex justify-start px-6 py-2">
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <span className="text-gray-400">V.</span> ANTECEDENTES ALÉRGICOS
        </h2>
      </div>

      {!isMinimized && <>
        {activeTab === 'formulario' ? <div className="p-6">
          <div className="space-y-6">
            <div>
              <h3 className="text-md font-medium mb-2">¿Tiene alergias conocidas?</h3>
              <div className="flex gap-2 sm:gap-4">
                <button className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-md text-xs sm:text-sm transition-colors ${formData.antecedentesAlergicos.sinAlergias === false ? 'bg-[#2ecc71] text-white' : 'bg-gray-100 dark:bg-gray-700'}`} onClick={() => handleBooleanChange('sinAlergias', false)}>
                  Sí
                </button>
                <button className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-md text-xs sm:text-sm transition-colors ${formData.antecedentesAlergicos.sinAlergias === true ? 'bg-[#2ecc71] text-white' : 'bg-gray-100 dark:bg-gray-700'}`} onClick={() => handleBooleanChange('sinAlergias', true)}>
                  No
                </button>
              </div>
            </div>

            {formData.antecedentesAlergicos.sinAlergias === false && (
              <>
                <div className="relative">
                  <label className="block text-sm font-medium mb-1">Alergias medicamentosas:</label>
                  <div className="flex items-center gap-2 sm:gap-4">
                    <Textarea value={formData.antecedentesAlergicos.medicamentosas || ''} onChange={e => handleTextChange('medicamentosas', e.target.value)} placeholder="Especifique medicamentos que causan alergia" className="min-h-[80px] flex-1" />
                    <div className="h-8 sm:h-10">
                      <VoiceInput onTranscriptionComplete={handleVoiceInput('medicamentosas')} />
                    </div>
                  </div>
                </div>

                <div className="relative">
                  <label className="block text-sm font-medium mb-1">Alergias alimentarias:</label>
                  <div className="flex items-center gap-2 sm:gap-4">
                    <Textarea value={formData.antecedentesAlergicos.alimentarias || ''} onChange={e => handleTextChange('alimentarias', e.target.value)} placeholder="Especifique alimentos que causan alergia" className="min-h-[80px] flex-1" />
                    <div className="h-8 sm:h-10">
                      <VoiceInput onTranscriptionComplete={handleVoiceInput('alimentarias')} />
                    </div>
                  </div>
                </div>

                <div className="relative">
                  <label className="block text-sm font-medium mb-1">Alergias de contacto:</label>
                  <div className="flex items-center gap-2 sm:gap-4">
                    <Textarea value={formData.antecedentesAlergicos.contacto || ''} onChange={e => handleTextChange('contacto', e.target.value)} placeholder="Especifique sustancias que causan alergia por contacto" className="min-h-[80px] flex-1" />
                    <div className="h-8 sm:h-10">
                      <VoiceInput onTranscriptionComplete={handleVoiceInput('contacto')} />
                    </div>
                  </div>
                </div>

                <div className="relative">
                  <label className="block text-sm font-medium mb-1">Otras alergias:</label>
                  <div className="flex items-center gap-2 sm:gap-4">
                    <Textarea value={formData.antecedentesAlergicos.otras || ''} onChange={e => handleTextChange('otras', e.target.value)} placeholder="Otras alergias no mencionadas anteriormente" className="min-h-[80px] flex-1" />
                    <div className="h-8 sm:h-10">
                      <VoiceInput onTranscriptionComplete={handleVoiceInput('otras')} />
                    </div>
                  </div>
                </div>
              </>
            )}

            <div className="relative">
              <label className="block text-sm font-medium mb-1">Detalles adicionales sobre alergias:</label>
              <div className="flex items-center gap-2 sm:gap-4">
                <Textarea value={formData.antecedentesAlergicos.detallesAdicionales || ''} onChange={e => handleTextChange('detallesAdicionales', e.target.value)} placeholder="Proporcione cualquier otra información relevante" className="min-h-[80px] flex-1" />
                <div className="h-8 sm:h-10">
                  <VoiceInput onTranscriptionComplete={handleVoiceInput('detallesAdicionales')} />
                </div>
              </div>
            </div>

            <div className="flex justify-center mt-6"></div>
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

export default AntecedentesAlergicos;
