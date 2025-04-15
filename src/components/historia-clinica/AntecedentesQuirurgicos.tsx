
import React, { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Minus, Maximize2, X, Mic } from "lucide-react";
import { FormDataState } from '@/types/historiaClinica';
import { Textarea } from "@/components/ui/textarea";
import { VoiceInput } from "@/components/ui/voice-input";
interface AntecedentesQuirurgicosProps {
  formData: FormDataState;
  handleAntecedenteQuirurgicoChange: (field: string, value: any) => void;
}
const AntecedentesQuirurgicos: React.FC<AntecedentesQuirurgicosProps> = ({
  formData,
  handleAntecedenteQuirurgicoChange
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
  const handleVoiceInput = (field: string) => (text: string) => {
    const currentValue = formData.antecedentesQuirurgicos[field] || "";
    handleAntecedenteQuirurgicoChange(field, currentValue ? `${currentValue} ${text}` : text);
  };
  const generateRedaccion = () => {
    setIsGeneratingRedaccion(true);
    setTimeout(() => {
      let content = "ANTECEDENTES MÉDICOS Y QUIRÚRGICOS:\n\n";

      // Tratamiento médico reciente
      if (formData.antecedentesQuirurgicos.tratamientoReciente) {
        content += "El paciente ha estado sometido a tratamiento médico en los últimos dos meses. ";
        if (formData.antecedentesQuirurgicos.motivoTratamiento) {
          content += `Motivo: ${formData.antecedentesQuirurgicos.motivoTratamiento}. `;
        }
      } else {
        content += "El paciente no ha estado sometido a tratamiento médico en los últimos dos meses. ";
      }

      // Hospitalización reciente
      if (formData.antecedentesQuirurgicos.hospitalizacionReciente) {
        content += "\nHa sido hospitalizado en los últimos dos meses. ";
        if (formData.antecedentesQuirurgicos.motivoHospitalizacion) {
          content += `Motivo: ${formData.antecedentesQuirurgicos.motivoHospitalizacion}. `;
        }
      } else {
        content += "\nNo ha sido hospitalizado en los últimos dos meses. ";
      }

      // Medicamentos actuales
      if (formData.antecedentesQuirurgicos.tomaMedicamentos) {
        content += "\nActualmente está tomando medicamentos. ";
        if (formData.antecedentesQuirurgicos.cualesMedicamentos) {
          content += `Medicamentos: ${formData.antecedentesQuirurgicos.cualesMedicamentos}. `;
        }
        if (formData.antecedentesQuirurgicos.motivoMedicamentos) {
          content += `Motivo: ${formData.antecedentesQuirurgicos.motivoMedicamentos}. `;
        }
      } else {
        content += "\nNo está tomando medicamentos actualmente. ";
      }

      // Cirugías previas
      if (formData.antecedentesQuirurgicos.sinQuirurgicos === false && formData.antecedentesQuirurgicos.cirugiasRealizadas?.length > 0) {
        content += "\n\nANTECEDENTES QUIRÚRGICOS:\n";
        formData.antecedentesQuirurgicos.cirugiasRealizadas.forEach((cirugia, index) => {
          content += `\n${index + 1}. Tipo: ${cirugia.tipo || 'No especificado'}, Fecha: ${cirugia.fecha || 'No especificada'}, Motivo: ${cirugia.motivo || 'No especificado'}`;
        });
      } else {
        content += "\n\nNo refiere antecedentes quirúrgicos.";
      }
      setRedaccionContent(content);
      setIsGeneratingRedaccion(false);
      setActiveTab('redaccion');
    }, 1000);
  };
  return <div className={`max-w-4xl mx-auto transition-all duration-300 ${isMaximized ? "fixed inset-4 z-50" : ""}`} data-section-redaction="true" data-section-name="antecedentesQuirurgicos">
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
            <span className="text-gray-400">VI.</span> ANTECEDENTES MÉDICOS Y QUIRÚRGICOS
          </h2>
        </div>

        {!isMinimized && <>
            {activeTab === 'formulario' ? <div className="p-6">
                <div className="space-y-6">
                  <div>
                    <h3 className="text-md font-medium mb-2">¿Ha estado sometido(a) a algún tratamiento médico en los últimos dos meses?</h3>
                    <div className="flex gap-4">
                      <button className={`px-4 py-2 rounded-md text-sm transition-colors ${formData.antecedentesQuirurgicos.tratamientoReciente ? 'bg-[#2ecc71] text-white' : 'bg-gray-100 dark:bg-gray-700'}`} onClick={() => handleBooleanChange('tratamientoReciente', true)}>
                        Sí
                      </button>
                      <button className={`px-4 py-2 rounded-md text-sm transition-colors ${formData.antecedentesQuirurgicos.tratamientoReciente === false ? 'bg-[#2ecc71] text-white' : 'bg-gray-100 dark:bg-gray-700'}`} onClick={() => handleBooleanChange('tratamientoReciente', false)}>
                        No
                      </button>
                    </div>
                  </div>

                  {formData.antecedentesQuirurgicos.tratamientoReciente && (
                    <div className="relative">
                      <label className="block text-sm font-medium mb-1">Motivo del tratamiento:</label>
                      <div className="flex items-center">
                        <Textarea value={formData.antecedentesQuirurgicos.motivoTratamiento || ''} onChange={e => handleTextChange('motivoTratamiento', e.target.value)} placeholder="Especifique el motivo" className="min-h-[80px] flex-1" />
                        <div className="ml-2">
                          <button className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center hover:bg-blue-600 transition-colors" onClick={() => {}}>
                            <VoiceInput onTranscriptionComplete={handleVoiceInput('motivoTratamiento')} />
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  <div>
                    <h3 className="text-md font-medium mb-2">¿Ha sido hospitalizado(a) en los últimos dos meses?</h3>
                    <div className="flex gap-4">
                      <button className={`px-4 py-2 rounded-md text-sm transition-colors ${formData.antecedentesQuirurgicos.hospitalizacionReciente ? 'bg-[#2ecc71] text-white' : 'bg-gray-100 dark:bg-gray-700'}`} onClick={() => handleBooleanChange('hospitalizacionReciente', true)}>
                        Sí
                      </button>
                      <button className={`px-4 py-2 rounded-md text-sm transition-colors ${formData.antecedentesQuirurgicos.hospitalizacionReciente === false ? 'bg-[#2ecc71] text-white' : 'bg-gray-100 dark:bg-gray-700'}`} onClick={() => handleBooleanChange('hospitalizacionReciente', false)}>
                        No
                      </button>
                    </div>
                  </div>

                  {formData.antecedentesQuirurgicos.hospitalizacionReciente && (
                    <div className="relative">
                      <label className="block text-sm font-medium mb-1">Motivo de la hospitalización:</label>
                      <div className="flex items-center">
                        <Textarea value={formData.antecedentesQuirurgicos.motivoHospitalizacion || ''} onChange={e => handleTextChange('motivoHospitalizacion', e.target.value)} placeholder="Especifique el motivo" className="min-h-[80px] flex-1" />
                        <div className="ml-2">
                          <button className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center hover:bg-blue-600 transition-colors" onClick={() => {}}>
                            <VoiceInput onTranscriptionComplete={handleVoiceInput('motivoHospitalizacion')} />
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  <div>
                    <h3 className="text-md font-medium mb-2">¿Está tomando actualmente algún medicamento?</h3>
                    <div className="flex gap-4">
                      <button className={`px-4 py-2 rounded-md text-sm transition-colors ${formData.antecedentesQuirurgicos.tomaMedicamentos ? 'bg-[#2ecc71] text-white' : 'bg-gray-100 dark:bg-gray-700'}`} onClick={() => handleBooleanChange('tomaMedicamentos', true)}>
                        Sí
                      </button>
                      <button className={`px-4 py-2 rounded-md text-sm transition-colors ${formData.antecedentesQuirurgicos.tomaMedicamentos === false ? 'bg-[#2ecc71] text-white' : 'bg-gray-100 dark:bg-gray-700'}`} onClick={() => handleBooleanChange('tomaMedicamentos', false)}>
                        No
                      </button>
                    </div>
                  </div>

                  {formData.antecedentesQuirurgicos.tomaMedicamentos && (
                    <>
                      <div className="relative">
                        <label className="block text-sm font-medium mb-1">¿Cuál o cuáles?:</label>
                        <div className="flex items-center">
                          <Textarea value={formData.antecedentesQuirurgicos.cualesMedicamentos || ''} onChange={e => handleTextChange('cualesMedicamentos', e.target.value)} placeholder="Liste los medicamentos" className="min-h-[80px] flex-1" />
                          <div className="ml-2">
                            <button className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center hover:bg-blue-600 transition-colors" onClick={() => {}}>
                              <VoiceInput onTranscriptionComplete={handleVoiceInput('cualesMedicamentos')} />
                            </button>
                          </div>
                        </div>
                      </div>

                      <div className="relative">
                        <label className="block text-sm font-medium mb-1">Motivo por el cual toma estos medicamentos:</label>
                        <div className="flex items-center">
                          <Textarea value={formData.antecedentesQuirurgicos.motivoMedicamentos || ''} onChange={e => handleTextChange('motivoMedicamentos', e.target.value)} placeholder="Explique por qué toma estos medicamentos" className="min-h-[80px] flex-1" />
                          <div className="ml-2">
                            <button className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center hover:bg-blue-600 transition-colors" onClick={() => {}}>
                              <VoiceInput onTranscriptionComplete={handleVoiceInput('motivoMedicamentos')} />
                            </button>
                          </div>
                        </div>
                      </div>
                    </>
                  )}

                  <div className="flex justify-center mt-6">
                    
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
export default AntecedentesQuirurgicos;
