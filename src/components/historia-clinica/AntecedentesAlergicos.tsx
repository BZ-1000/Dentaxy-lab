
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

      if (formData.antecedentesAlergicos.alergiasConocidas) {
        content += `El paciente presenta alergias conocidas a: ${formData.antecedentesAlergicos.alergiasConocidas}. `;
      } else {
        content += "El paciente no reporta alergias conocidas. ";
      }

      if (formData.antecedentesAlergicos.reaccionesAdversas) {
        content += `\nReacciones adversas reportadas: ${formData.antecedentesAlergicos.reaccionesAdversas}. `;
      } else {
        content += "\nNo se han reportado reacciones adversas. ";
      }

      setRedaccionContent(content);
      setIsGeneratingRedaccion(false);
      setActiveTab('redaccion');
    }, 1000);
  };

  return (
    <div className={`max-w-4xl mx-auto transition-all duration-300 ${isMaximized ? "fixed inset-4 z-50" : ""}`} data-section-redaction="true" data-section-name="antecedentesAlergicos">
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
            <span className="text-gray-400">V.</span> ANTECEDENTES ALÉRGICOS
          </h2>
        </div>

        {!isMinimized && <>
          {activeTab === 'formulario' ? <div className="p-6 space-y-6">
            <div className="relative">
              <label className="block text-sm font-medium mb-1">Alergias conocidas:</label>
              <div className="flex items-center">
                <Textarea value={formData.antecedentesAlergicos.alergiasConocidas || ''} onChange={e => handleTextChange('alergiasConocidas', e.target.value)} placeholder="Indique alergias conocidas" className="min-h-[80px] flex-1" />
                <div className="ml-2">
                  <button className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center hover:bg-blue-600 transition-colors" type="button">
                    <VoiceInput onTranscriptionComplete={handleVoiceInput('alergiasConocidas')} />
                  </button>
                </div>
              </div>
            </div>

            <div className="relative">
              <label className="block text-sm font-medium mb-1">Reacciones adversas:</label>
              <div className="flex items-center">
                <Textarea value={formData.antecedentesAlergicos.reaccionesAdversas || ''} onChange={e => handleTextChange('reaccionesAdversas', e.target.value)} placeholder="Describa reacciones adversas" className="min-h-[80px] flex-1" />
                <div className="ml-2">
                  <button className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center hover:bg-blue-600 transition-colors" type="button">
                    <VoiceInput onTranscriptionComplete={handleVoiceInput('reaccionesAdversas')} />
                  </button>
                </div>
              </div>
            </div>
          </div> : <div className="p-6">
            <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4 min-h-[200px] whitespace-pre-wrap" style={{ whiteSpace: 'pre-wrap' }} data-redaction-content>
              {redaccionContent || "No se ha generado redacción aún. Utilice el botón 'Generar Redacción IA' en la pestaña de Formulario."}
            </div>
          </div>}
        </>}
      </Card>
    </div>
  );
};

export default AntecedentesAlergicos;
