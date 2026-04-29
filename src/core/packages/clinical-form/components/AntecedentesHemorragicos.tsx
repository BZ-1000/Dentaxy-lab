
import React, { useState } from 'react';
import { Minus, Maximize2, X } from "lucide-react";
import { FormDataState } from '../types/historiaClinica';
import { Textarea } from "@/components/ui/textarea";
import { VoiceInput } from "@/components/ui/voice-input";

interface AntecedentesHemorragicosProps {
  formData: FormDataState;
  handleAntecedenteHemorragicoChange: (field: string, value: any) => void;
}

const AntecedentesHemorragicos: React.FC<AntecedentesHemorragicosProps> = ({
  formData,
  handleAntecedenteHemorragicoChange
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
    setTimeout(() => {
      let content = "ANTECEDENTES HEMORRÁGICOS:\n\n";

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
        content += "\nRefiere episodios de sangrado prolongado. ";
      }
      if (formData.antecedentesHemorragicos.hematomas === 'si') {
        content += "Presenta tendencia a desarrollar hematomas. ";
      }
      if (formData.antecedentesHemorragicos.hemorragiasEspontaneas === 'si') {
        content += "Ha experimentado hemorragias espontáneas. ";
      }
      if (formData.antecedentesHemorragicos.detallesAdicionales) {
        content += `\n\nDetalles adicionales: ${formData.antecedentesHemorragicos.detallesAdicionales}`;
      }
      setRedaccionContent(content);
      setIsGeneratingRedaccion(false);
      setActiveTab('redaccion');
    }, 1000);
  };

  return <div className={`max-w-4xl mx-auto transition-all duration-300 ${isMaximized ? "fixed inset-4 z-50" : ""}`} data-section-redaction="true" data-section-name="antecedentesHemorragicos" data-formulario-section="antecedentes-hemorragicos">
    <div className="w-full bg-transparent">
      <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex justify-center w-full">
          

        <div className="flex items-center gap-1 sm:gap-2">
          
          
          
        </div>
      </div>{/* cierra flex justify-center */}
        </div>

      <div className="flex justify-start px-6 py-2">
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <span className="text-gray-400">VII.</span> ANTECEDENTES HEMORRÁGICOS
        </h2>
      </div>

      {!isMinimized && <>
        {activeTab === 'formulario' ? <div className="p-6">
          <div className="space-y-6">
            <div>
              <h3 className="text-md font-medium mb-2">¿Le han transfundido sangre o algún derivado de la misma?</h3>
              <div className="flex gap-2 sm:gap-4">
                <button className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-md text-xs sm:text-sm transition-colors ${formData.antecedentesHemorragicos.transfusionPrevia ? 'bg-zinc-800 text-white shadow-sm' : 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600'}`} onClick={() => handleBooleanChange('transfusionPrevia', true)}>
                  Sí
                </button>
                <button className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-md text-xs sm:text-sm transition-colors ${formData.antecedentesHemorragicos.transfusionPrevia === false ? 'bg-zinc-800 text-white shadow-sm' : 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600'}`} onClick={() => handleBooleanChange('transfusionPrevia', false)}>
                  No
                </button>
              </div>
            </div>

            {formData.antecedentesHemorragicos.transfusionPrevia && (
              <>
                <div className="relative">
                  <label className="block text-sm font-medium mb-1">Motivo de la transfusión:</label>
                  <div className="flex items-center gap-2 sm:gap-4">
                    <Textarea value={formData.antecedentesHemorragicos.motivoTransfusion || ''} onChange={e => handleTextChange('motivoTransfusion', e.target.value)} placeholder="Especifique el motivo" className="min-h-[80px] flex-1" />
                    <div className="h-8 sm:h-10">
                      <VoiceInput onTranscriptionComplete={handleVoiceInput('motivoTransfusion')} />
                    </div>
                  </div>
                </div>

                <div className="relative">
                  <label className="block text-sm font-medium mb-1">Fecha de la transfusión:</label>
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

            <div className="flex justify-center mt-6"></div>
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
