import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Minus, Maximize2, X, Sparkles } from "lucide-react";
import { FormDataState } from '@/types/historiaClinica';
import { Textarea } from "@/components/ui/textarea";

interface AntecedentesQuirurgicosProps {
  formData: FormDataState;
  handleAntecedenteQuirurgicoChange: (field: string, value: any) => void;
  onRedaccionGenerada?: (text: string) => void;
  onToggleViewMode?: () => void;
}

const AntecedentesQuirurgicos: React.FC<AntecedentesQuirurgicosProps> = ({
  formData,
  handleAntecedenteQuirurgicoChange,
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
    handleAntecedenteQuirurgicoChange(field, value);
  };
  const handleBooleanChange = (field: string, value: boolean) => {
    handleAntecedenteQuirurgicoChange(field, value);
  };
  const generateRedaccion = () => {
    setIsGeneratingRedaccion(true);
    const formatTitle = (title: string) => `<span class="block text-xs font-semibold uppercase tracking-widest text-zinc-600 dark:text-zinc-400 mt-4 mb-1">${title}</span>`;
    
    let content = "";

    if (formData.antecedentesQuirurgicos.tratamientoReciente) {
      content += "El paciente ha estado sometido a tratamiento médico en los últimos dos meses. ";
      if (formData.antecedentesQuirurgicos.motivoTratamiento) {
        content += `Motivo: ${formData.antecedentesQuirurgicos.motivoTratamiento}. `;
      }
    } else {
      content += "El paciente no ha estado sometido a tratamiento médico en los últimos dos meses. ";
    }

    if (formData.antecedentesQuirurgicos.hospitalizacionReciente) {
      content += "<br/>Ha sido hospitalizado en los últimos dos meses. ";
      if (formData.antecedentesQuirurgicos.motivoHospitalizacion) {
        content += `Motivo: ${formData.antecedentesQuirurgicos.motivoHospitalizacion}. `;
      }
    } else {
      content += "<br/>No ha sido hospitalizado en los últimos dos meses. ";
    }

    if (formData.antecedentesQuirurgicos.tomaMedicamentos) {
      content += "<br/>Actualmente está tomando medicamentos. ";
      if (formData.antecedentesQuirurgicos.cualesMedicamentos) {
        content += `Medicamentos: ${formData.antecedentesQuirurgicos.cualesMedicamentos}. `;
      }
      if (formData.antecedentesQuirurgicos.motivoMedicamentos) {
        content += `Motivo: ${formData.antecedentesQuirurgicos.motivoMedicamentos}. `;
      }
    } else {
      content += "<br/>No está tomando medicamentos actualmente. ";
    }

    if (formData.antecedentesQuirurgicos.sinQuirurgicos === false && formData.antecedentesQuirurgicos.cirugiasRealizadas?.length > 0) {
      content += `<br/>${formatTitle('ANTECEDENTES QUIRÚRGICOS')}`;
      formData.antecedentesQuirurgicos.cirugiasRealizadas.forEach((cirugia, index) => {
        content += `<br/>${index + 1}. Tipo: ${cirugia.tipo || 'No especificado'}, Fecha: ${cirugia.fecha || 'No especificada'}, Motivo: ${cirugia.motivo || 'No especificado'}`;
      });
    } else {
      content += "\n\nNo refiere antecedentes quirúrgicos.";
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

  return <div className={`max-w-4xl mx-auto transition-all duration-300 ${isMaximized ? "fixed inset-4 z-50" : ""}`} data-section-redaction="true" data-section-name="antecedentesQuirurgicos" data-formulario-section="antecedentes-quirurgicos">
    <div className="w-full bg-transparent">

      {!isMinimized && <>
        {activeTab === 'formulario' ? <div className="p-6">
          <div className="space-y-6">
            <div>
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">¿Ha estado sometido(a) a algún tratamiento médico en los últimos dos meses?</h3>
              <div className="flex gap-2 sm:gap-4">
                <button className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${formData.antecedentesQuirurgicos.tratamientoReciente ? 'bg-zinc-800 text-white shadow-sm' : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-700 hover:border-gray-400'}`} onClick={() => handleBooleanChange('tratamientoReciente', true)}>
                  Sí
                </button>
                <button className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${formData.antecedentesQuirurgicos.tratamientoReciente === false ? 'bg-zinc-800 text-white shadow-sm' : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-700 hover:border-gray-400'}`} onClick={() => handleBooleanChange('tratamientoReciente', false)}>
                  No
                </button>
              </div>
            </div>

            {formData.antecedentesQuirurgicos.tratamientoReciente && (
              <div className="relative">
                <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Motivo del tratamiento:</label>
                <div className="flex items-center gap-2 sm:gap-4">
                  <Textarea value={formData.antecedentesQuirurgicos.motivoTratamiento || ''} onChange={e => handleTextChange('motivoTratamiento', e.target.value)} placeholder="Especifique el motivo" className="min-h-[80px] flex-1" />
                </div>
              </div>
            )}

            <div>
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">¿Ha sido hospitalizado(a) en los últimos dos meses?</h3>
              <div className="flex gap-2 sm:gap-4">
                <button className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${formData.antecedentesQuirurgicos.hospitalizacionReciente ? 'bg-zinc-800 text-white shadow-sm' : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-700 hover:border-gray-400'}`} onClick={() => handleBooleanChange('hospitalizacionReciente', true)}>
                  Sí
                </button>
                <button className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${formData.antecedentesQuirurgicos.hospitalizacionReciente === false ? 'bg-zinc-800 text-white shadow-sm' : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-700 hover:border-gray-400'}`} onClick={() => handleBooleanChange('hospitalizacionReciente', false)}>
                  No
                </button>
              </div>
            </div>

            {formData.antecedentesQuirurgicos.hospitalizacionReciente && (
              <div className="relative">
                <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Motivo de la hospitalización:</label>
                <div className="flex items-center gap-2 sm:gap-4">
                  <Textarea value={formData.antecedentesQuirurgicos.motivoHospitalizacion || ''} onChange={e => handleTextChange('motivoHospitalizacion', e.target.value)} placeholder="Especifique el motivo" className="min-h-[80px] flex-1" />
                </div>
              </div>
            )}

            <div>
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">¿Está tomando actualmente algún medicamento?</h3>
              <div className="flex gap-2 sm:gap-4">
                <button className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${formData.antecedentesQuirurgicos.tomaMedicamentos ? 'bg-zinc-800 text-white shadow-sm' : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-700 hover:border-gray-400'}`} onClick={() => handleBooleanChange('tomaMedicamentos', true)}>
                  Sí
                </button>
                <button className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${formData.antecedentesQuirurgicos.tomaMedicamentos === false ? 'bg-zinc-800 text-white shadow-sm' : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-700 hover:border-gray-400'}`} onClick={() => handleBooleanChange('tomaMedicamentos', false)}>
                  No
                </button>
              </div>
            </div>

            {formData.antecedentesQuirurgicos.tomaMedicamentos && (
              <>
                <div className="relative">
                  <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">¿Cuál o cuáles?:</label>
                  <div className="flex items-center gap-2 sm:gap-4">
                    <Textarea value={formData.antecedentesQuirurgicos.cualesMedicamentos || ''} onChange={e => handleTextChange('cualesMedicamentos', e.target.value)} placeholder="Liste los medicamentos" className="min-h-[80px] flex-1" />
                  </div>
                </div>

                <div className="relative">
                  <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Motivo por el cual toma estos medicamentos:</label>
                  <div className="flex items-center gap-2 sm:gap-4">
                    <Textarea value={formData.antecedentesQuirurgicos.motivoMedicamentos || ''} onChange={e => handleTextChange('motivoMedicamentos', e.target.value)} placeholder="Explique por qué toma estos medicamentos" className="min-h-[80px] flex-1" />
                  </div>
                </div>
              </>
            )}

            <div className="flex justify-center mt-6">
              <button className="hidden" onClick={generateRedaccion}>Generar redacción</button>
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
export default AntecedentesQuirurgicos;
