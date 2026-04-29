
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Minus, Maximize2, X, Sparkles } from "lucide-react";
import { FormDataState } from '@/types/historiaClinica';
import { Textarea } from "@/components/ui/textarea";
import { VoiceInput } from "@/components/ui/voice-input";

interface AntecedentesHemorragicosProps {
  formData: FormDataState;
  handleAntecedenteHemorragicoChange: (field: string, value: any) => void;
  onRedaccionGenerada?: (text: string) => void;
  onToggleViewMode?: () => void;
}

const AntecedentesHemorragicos: React.FC<AntecedentesHemorragicosProps> = ({
  formData,
  handleAntecedenteHemorragicoChange,
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
    handleAntecedenteHemorragicoChange(field, value);
  };
  const handleBooleanChange = (field: string, value: boolean) => {
    handleAntecedenteHemorragicoChange(field, value);
  };
  const handleVoiceInput = (field: string) => (text: string) => {
    const currentValue = formData.antecedentesHemorragicos[field] || "";
    handleAntecedenteHemorragicoChange(field, currentValue ? `${currentValue} ${text}` : text);
  };
  const generateRedaccion = () => {
    setIsGeneratingRedaccion(true);
    // Remove timeout
    let content = "";

    if (formData.antecedentesHemorragicos.transfusiones === 'si' || formData.antecedentesHemorragicos.transfusionPrevia) {
      content += "El paciente ha recibido transfusiones sanguíneas o derivados. ";
      if (formData.antecedentesHemorragicos.motivoTransfusion) {
        content += `Motivo de la transfusión: ${formData.antecedentesHemorragicos.motivoTransfusion}. `;
      }
      if (formData.antecedentesHemorragicos.fechaTransfusion) {
        content += `Fecha de la transfusión: ${formData.antecedentesHemorragicos.fechaTransfusion}. `;
      }
    } else {
      content += "El paciente niega antecedentes de transfusiones sanguíneas. ";
    }

    if (formData.antecedentesHemorragicos.sangradoProlongado === 'si') {
      content += "<br/>Refiere episodios de sangrado prolongado. ";
    }
    if (formData.antecedentesHemorragicos.hematomas === 'si') {
      content += "Presenta tendencia a desarrollar hematomas. ";
    }
    if (formData.antecedentesHemorragicos.hemorragiasEspontaneas === 'si') {
      content += "Ha experimentado hemorragias espontáneas. ";
    }
    if (formData.antecedentesHemorragicos.detallesAdicionales) {
      content += `<br/><br/>Detalles adicionales: ${formData.antecedentesHemorragicos.detallesAdicionales}`;
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

  return <div className={`max-w-4xl mx-auto transition-all duration-300 ${isMaximized ? "fixed inset-4 z-50" : ""}`} data-section-redaction="true" data-section-name="antecedentesHemorragicos" data-formulario-section="antecedentes-hemorragicos">
    <div className="w-full bg-transparent">

      {!isMinimized && <>
        {activeTab === 'formulario' ? <div className="p-6">
          <div className="space-y-6">
            <div>
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">¿Le han transfundido sangre o algún derivado de la misma?</h3>
              <div className="flex gap-2 sm:gap-4">
                <button className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${formData.antecedentesHemorragicos.transfusionPrevia ? 'bg-zinc-800 text-white shadow-sm' : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-700 hover:border-gray-400'}`} onClick={() => handleBooleanChange('transfusionPrevia', true)}>
                  Sí
                </button>
                <button className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${formData.antecedentesHemorragicos.transfusionPrevia === false ? 'bg-zinc-800 text-white shadow-sm' : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-700 hover:border-gray-400'}`} onClick={() => handleBooleanChange('transfusionPrevia', false)}>
                  No
                </button>
              </div>
            </div>

            {formData.antecedentesHemorragicos.transfusionPrevia && (
              <>
                <div className="relative">
                  <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Motivo de la transfusión:</label>
                  <div className="flex items-center gap-2 sm:gap-4">
                    <Textarea value={formData.antecedentesHemorragicos.motivoTransfusion || ''} onChange={e => handleTextChange('motivoTransfusion', e.target.value)} placeholder="Especifique el motivo" className="min-h-[80px] flex-1" />
                    <div className="h-8 sm:h-10">
                      <VoiceInput onTranscriptionComplete={handleVoiceInput('motivoTransfusion')} />
                    </div>
                  </div>
                </div>

                <div className="relative">
                  <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Fecha de la transfusión:</label>
                  <div className="flex items-center gap-2 sm:gap-4">
                    <Textarea value={formData.antecedentesHemorragicos.fechaTransfusion || ''} onChange={e => handleTextChange('fechaTransfusion', e.target.value)} placeholder="DD/MM/AAAA o especifique aproximadamente" className="min-h-[60px] flex-1" />
                    <div className="h-8 sm:h-10">
                      <VoiceInput onTranscriptionComplete={handleVoiceInput('fechaTransfusion')} />
                    </div>
                  </div>
                </div>
              </>
            )}

            <div className="relative">
              <label className="block text-sm font-medium mb-1">Detalles adicionales sobre antecedentes hemorrágicos:</label>
              <div className="flex items-center gap-2 sm:gap-4">
                <Textarea value={formData.antecedentesHemorragicos.detallesAdicionales || ''} onChange={e => handleTextChange('detallesAdicionales', e.target.value)} placeholder="Proporcione cualquier otra información relevante" className="min-h-[80px] flex-1" />
                <div className="h-8 sm:h-10">
                  <VoiceInput onTranscriptionComplete={handleVoiceInput('detallesAdicionales')} />
                </div>
              </div>
            </div>

            <div className="flex justify-end items-center gap-3 pt-6 mt-6 border-t border-gray-100 dark:border-gray-700/50">
            </div>
          </div>
        </div> : <div className="p-6">
          <div className="bg-transparent dark:bg-gray-900 rounded-lg p-4 min-h-[200px] whitespace-pre-wrap" style={{
            whiteSpace: 'pre-wrap'
          }} data-redaction-content>
            {redaccionContent || "No se ha generado redacción aún. Utilice el botón 'Generar Redacción IA' en la pestaña de Formulario."}
          </div>
        </div>}
      </>}
    </div>
  </div>;
};

export default AntecedentesHemorragicos;
