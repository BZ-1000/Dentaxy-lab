
import React, { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Minus, Maximize2, X } from "lucide-react";
import { FormDataState } from '@/types/historiaClinica';
import { Textarea } from "@/components/ui/textarea";
import { VoiceInput } from "@/components/ui/voice-input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface AntecedentesQuirurgicosProps {
  formData: FormDataState;
  handleAntecedenteQuirurgicoChange?: (field: string, value: any) => void;
  clearAntecedentesMedicosQuirurgicos?: () => void;
}

const AntecedentesQuirurgicos: React.FC<AntecedentesQuirurgicosProps> = ({
  formData,
  handleAntecedenteQuirurgicoChange,
  clearAntecedentesMedicosQuirurgicos
}) => {
  const { toast } = useToast();
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
    if (handleAntecedenteQuirurgicoChange) {
      handleAntecedenteQuirurgicoChange(field, value);
    }
  };

  const handleVoiceInput = (field: string) => (text: string) => {
    if (handleAntecedenteQuirurgicoChange) {
      const currentValue = formData.antecedentesQuirurgicos[field] || "";
      handleAntecedenteQuirurgicoChange(field, currentValue ? `${currentValue} ${text}` : text);
    }
  };

  const handleBooleanChange = (field: string, value: boolean) => {
    if (handleAntecedenteQuirurgicoChange) {
      handleAntecedenteQuirurgicoChange(field, value);
    }
  };

  const handleNoAntecedentes = () => {
    if (clearAntecedentesMedicosQuirurgicos) {
      clearAntecedentesMedicosQuirurgicos();
      generateRedaccion();
    } else {
      toast({
        title: "Error",
        description: "No se pudo actualizar el formulario",
        variant: "destructive",
      });
    }
  };

  const generateRedaccion = () => {
    setIsGeneratingRedaccion(true);
    setTimeout(() => {
      let content = "ANTECEDENTES MÉDICOS Y QUIRÚRGICOS:\n\n";

      // Tratamiento médico
      if (formData.antecedentesQuirurgicos.tratamientoMedico) {
        content += "El paciente ha estado sometido a tratamiento médico en los últimos dos meses. ";
        if (formData.antecedentesQuirurgicos.motivoTratamiento) {
          content += `Motivo del tratamiento: ${formData.antecedentesQuirurgicos.motivoTratamiento}. `;
        }
      } else {
        content += "El paciente no ha estado sometido a tratamiento médico en los últimos dos meses. ";
      }

      // Hospitalización
      content += "\n\n";
      if (formData.antecedentesQuirurgicos.hospitalizado) {
        content += "El paciente ha sido hospitalizado en los últimos dos meses. ";
        if (formData.antecedentesQuirurgicos.motivoHospitalizacion) {
          content += `Motivo de la hospitalización: ${formData.antecedentesQuirurgicos.motivoHospitalizacion}. `;
        }
      } else {
        content += "El paciente no ha sido hospitalizado en los últimos dos meses. ";
      }

      // Medicamentos
      content += "\n\n";
      if (formData.antecedentesQuirurgicos.tomaMedicamento) {
        content += "El paciente toma medicamentos actualmente. ";
        if (formData.antecedentesQuirurgicos.medicamentos) {
          content += `Medicamentos: ${formData.antecedentesQuirurgicos.medicamentos}. `;
        }
        if (formData.antecedentesQuirurgicos.motivoMedicamentos) {
          content += `Motivo: ${formData.antecedentesQuirurgicos.motivoMedicamentos}. `;
        }
      } else {
        content += "El paciente no toma medicamentos actualmente. ";
      }

      // Detalles adicionales
      if (formData.antecedentesQuirurgicos.detallesAdicionales) {
        content += `\n\nDetalles adicionales: ${formData.antecedentesQuirurgicos.detallesAdicionales}`;
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
      data-section-name="antecedentesQuirurgicos"
    >
      <Card className={`bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-lg rounded-xl border-0 ${isMaximized ? "h-[calc(100vh-2rem)] overflow-y-auto" : ""}`}>
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex justify-center w-full">
            <div className="flex bg-gray-200 dark:bg-gray-700 rounded-full p-1">
              <button 
                className={`px-5 py-1.5 rounded-full transition-all duration-300 text-sm ${activeTab === 'formulario' ? 'bg-blue-500 text-white shadow-md' : 'text-gray-700 dark:text-gray-300'}`} 
                onClick={() => setActiveTab('formulario')}
              >
                Formulario
              </button>
              <button 
                className={`px-5 py-1.5 rounded-full transition-all duration-300 text-sm ${activeTab === 'redaccion' ? 'bg-blue-500 text-white shadow-md' : 'text-gray-700 dark:text-gray-300'}`} 
                onClick={() => setActiveTab('redaccion')}
              >
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

        {!isMinimized && (
          <>
            {activeTab === 'formulario' ? (
              <div className="p-6">
                <div className="space-y-6">
                  <div>
                    <h3 className="text-md font-medium mb-2">¿Ha estado sometido(a) a algún tratamiento médico en los últimos dos meses?</h3>
                    <div className="flex gap-4">
                      <button 
                        className={`px-4 py-2 rounded-md text-sm transition-colors ${formData.antecedentesQuirurgicos.tratamientoMedico ? 'bg-[#2ecc71] text-white' : 'bg-gray-100 dark:bg-gray-700'}`} 
                        onClick={() => handleBooleanChange('tratamientoMedico', true)}
                      >
                        Sí
                      </button>
                      <button 
                        className={`px-4 py-2 rounded-md text-sm transition-colors ${formData.antecedentesQuirurgicos.tratamientoMedico === false ? 'bg-[#2ecc71] text-white' : 'bg-gray-100 dark:bg-gray-700'}`} 
                        onClick={() => handleBooleanChange('tratamientoMedico', false)}
                      >
                        No
                      </button>
                    </div>
                  </div>

                  <div className="relative">
                    <label className="block text-sm font-medium mb-1">Motivo del tratamiento:</label>
                    <div className="flex items-center">
                      <Textarea 
                        value={formData.antecedentesQuirurgicos.motivoTratamiento || ''} 
                        onChange={e => handleTextChange('motivoTratamiento', e.target.value)} 
                        placeholder="Describa el motivo del tratamiento" 
                        className="min-h-[80px] flex-1" 
                      />
                      <div className="ml-2">
                        <VoiceInput onTranscriptionComplete={handleVoiceInput('motivoTratamiento')} />
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-md font-medium mb-2">¿Ha sido hospitalizado(a) en los últimos dos meses?</h3>
                    <div className="flex gap-4">
                      <button 
                        className={`px-4 py-2 rounded-md text-sm transition-colors ${formData.antecedentesQuirurgicos.hospitalizado ? 'bg-[#2ecc71] text-white' : 'bg-gray-100 dark:bg-gray-700'}`} 
                        onClick={() => handleBooleanChange('hospitalizado', true)}
                      >
                        Sí
                      </button>
                      <button 
                        className={`px-4 py-2 rounded-md text-sm transition-colors ${formData.antecedentesQuirurgicos.hospitalizado === false ? 'bg-[#2ecc71] text-white' : 'bg-gray-100 dark:bg-gray-700'}`} 
                        onClick={() => handleBooleanChange('hospitalizado', false)}
                      >
                        No
                      </button>
                    </div>
                  </div>

                  <div className="relative">
                    <label className="block text-sm font-medium mb-1">Motivo de la hospitalización:</label>
                    <div className="flex items-center">
                      <Textarea 
                        value={formData.antecedentesQuirurgicos.motivoHospitalizacion || ''} 
                        onChange={e => handleTextChange('motivoHospitalizacion', e.target.value)} 
                        placeholder="Describa el motivo de la hospitalización" 
                        className="min-h-[80px] flex-1" 
                      />
                      <div className="ml-2">
                        <VoiceInput onTranscriptionComplete={handleVoiceInput('motivoHospitalizacion')} />
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-md font-medium mb-2">¿Está tomando actualmente algún medicamento?</h3>
                    <div className="flex gap-4">
                      <button 
                        className={`px-4 py-2 rounded-md text-sm transition-colors ${formData.antecedentesQuirurgicos.tomaMedicamento ? 'bg-[#2ecc71] text-white' : 'bg-gray-100 dark:bg-gray-700'}`} 
                        onClick={() => handleBooleanChange('tomaMedicamento', true)}
                      >
                        Sí
                      </button>
                      <button 
                        className={`px-4 py-2 rounded-md text-sm transition-colors ${formData.antecedentesQuirurgicos.tomaMedicamento === false ? 'bg-[#2ecc71] text-white' : 'bg-gray-100 dark:bg-gray-700'}`} 
                        onClick={() => handleBooleanChange('tomaMedicamento', false)}
                      >
                        No
                      </button>
                    </div>
                  </div>

                  <div className="relative">
                    <label className="block text-sm font-medium mb-1">¿Cuál o cuáles?:</label>
                    <div className="flex items-center">
                      <Textarea 
                        value={formData.antecedentesQuirurgicos.medicamentos || ''} 
                        onChange={e => handleTextChange('medicamentos', e.target.value)} 
                        placeholder="Liste los medicamentos" 
                        className="min-h-[80px] flex-1" 
                      />
                      <div className="ml-2">
                        <VoiceInput onTranscriptionComplete={handleVoiceInput('medicamentos')} />
                      </div>
                    </div>
                  </div>

                  <div className="relative">
                    <label className="block text-sm font-medium mb-1">Motivo por el cual toma estos medicamentos:</label>
                    <div className="flex items-center">
                      <Textarea 
                        value={formData.antecedentesQuirurgicos.motivoMedicamentos || ''} 
                        onChange={e => handleTextChange('motivoMedicamentos', e.target.value)} 
                        placeholder="Indique razón de la medicación" 
                        className="min-h-[80px] flex-1" 
                      />
                      <div className="ml-2">
                        <VoiceInput onTranscriptionComplete={handleVoiceInput('motivoMedicamentos')} />
                      </div>
                    </div>
                  </div>

                  <div className="relative">
                    <label className="block text-sm font-medium mb-1">Detalles adicionales:</label>
                    <div className="flex items-center">
                      <Textarea 
                        value={formData.antecedentesQuirurgicos.detallesAdicionales || ''} 
                        onChange={e => handleTextChange('detallesAdicionales', e.target.value)} 
                        placeholder="Información adicional relevante" 
                        className="min-h-[80px] flex-1" 
                      />
                      <div className="ml-2">
                        <VoiceInput onTranscriptionComplete={handleVoiceInput('detallesAdicionales')} />
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-center mt-6">
                    <Button 
                      onClick={handleNoAntecedentes}
                      className="bg-blue-500 hover:bg-blue-600 text-white"
                    >
                      No presenta antecedentes médicos y quirúrgicos
                    </Button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-6">
                <div 
                  className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4 min-h-[200px] whitespace-pre-wrap" 
                  style={{ whiteSpace: 'pre-wrap' }} 
                  data-redaction-content
                >
                  {redaccionContent || "No se ha generado redacción aún. Complete el formulario y genere la redacción."}
                </div>
              </div>
            )}
          </>
        )}
      </Card>
    </div>
  );
};

export default AntecedentesQuirurgicos;
