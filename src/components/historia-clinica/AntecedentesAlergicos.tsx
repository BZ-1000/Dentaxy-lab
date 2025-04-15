import React, { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Minus, Maximize2, X } from "lucide-react";
import { FormDataState } from '@/types/historiaClinica';
import { Textarea } from "@/components/ui/textarea";
import { AIVoiceInput } from "@/components/ui/ai-voice-input";

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

      // Alergias a medicamentos
      if (formData.antecedentesAlergicos.medicamentos.es_alergico === 'si') {
        content += "El paciente refiere alergia a medicamentos. ";
        if (formData.antecedentesAlergicos.medicamentos.cuales) {
          content += `Medicamentos a los que es alérgico: ${formData.antecedentesAlergicos.medicamentos.cuales}. `;
        }
        if (formData.antecedentesAlergicos.medicamentos.tipo_reaccion) {
          content += `Tipo de reacción: ${formData.antecedentesAlergicos.medicamentos.tipo_reaccion}. `;
        }
        if (formData.antecedentesAlergicos.medicamentos.severidad) {
          content += `Severidad de la reacción: ${formData.antecedentesAlergicos.medicamentos.severidad}. `;
        }
      } else {
        content += "El paciente niega alergias a medicamentos. ";
      }

      // Alergias a alimentos
      if (formData.antecedentesAlergicos.alimentos.es_alergico === 'si') {
        content += "\nRefiere alergia a alimentos. ";
        if (formData.antecedentesAlergicos.alimentos.cuales) {
          content += `Alimentos a los que es alérgico: ${formData.antecedentesAlergicos.alimentos.cuales}. `;
        }
      } else {
        content += "\nNiega alergias a alimentos. ";
      }

      // Alergia al látex
      if (formData.antecedentesAlergicos.latex.es_alergico === 'si') {
        content += "\nRefiere alergia al látex. ";
        if (formData.antecedentesAlergicos.latex.descripcion_reaccion) {
          content += `Descripción de la reacción: ${formData.antecedentesAlergicos.latex.descripcion_reaccion}. `;
        }
      } else {
        content += "\nNiega alergia al látex. ";
      }

      // Detalles adicionales
      if (formData.antecedentesAlergicos.cualesAlergias) {
        content += `\n\nDetalles adicionales: ${formData.antecedentesAlergicos.cualesAlergias}`;
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

        {!isMinimized && (
          <>
            {activeTab === 'formulario' ? (
              <div className="p-6">
                <div className="space-y-6">
                  <div>
                    <h3 className="text-md font-medium mb-2">¿Es alérgico a algún medicamento?</h3>
                    <div className="flex gap-4">
                      <button 
                        className={`px-4 py-2 rounded-md text-sm transition-colors ${formData.antecedentesAlergicos.medicamentos.es_alergico === 'si' ? 'bg-[#2ecc71] text-white' : 'bg-gray-100 dark:bg-gray-700'}`} 
                        onClick={() => handleAntecedenteAlergicoChange('medicamentos.es_alergico', 'si')}
                      >
                        Sí
                      </button>
                      <button 
                        className={`px-4 py-2 rounded-md text-sm transition-colors ${formData.antecedentesAlergicos.medicamentos.es_alergico === 'no' ? 'bg-[#2ecc71] text-white' : 'bg-gray-100 dark:bg-gray-700'}`} 
                        onClick={() => handleAntecedenteAlergicoChange('medicamentos.es_alergico', 'no')}
                      >
                        No
                      </button>
                    </div>
                  </div>

                  {formData.antecedentesAlergicos.medicamentos.es_alergico === 'si' && (
                    <>
                      <div className="relative">
                        <label className="block text-sm font-medium mb-1">¿A cuáles medicamentos es alérgico?</label>
                        <div className="flex items-center">
                          <Textarea 
                            value={formData.antecedentesAlergicos.medicamentos.cuales || ''} 
                            onChange={e => handleTextChange('medicamentos.cuales', e.target.value)} 
                            placeholder="Especifique los medicamentos" 
                            className="min-h-[80px] flex-1" 
                          />
                          <div className="ml-2">
                            <button className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center hover:bg-blue-600 transition-colors">
                              <AIVoiceInput onTranscriptionComplete={handleVoiceInput('medicamentos.cuales')} />
                            </button>
                          </div>
                        </div>
                      </div>

                      <div className="relative">
                        <label className="block text-sm font-medium mb-1">Tipo de reacción alérgica:</label>
                        <div className="flex items-center">
                          <Textarea 
                            value={formData.antecedentesAlergicos.medicamentos.tipo_reaccion || ''} 
                            onChange={e => handleTextChange('medicamentos.tipo_reaccion', e.target.value)} 
                            placeholder="Especifique el tipo de reacción" 
                            className="min-h-[60px] flex-1" 
                          />
                          <div className="ml-2">
                            <button className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center hover:bg-blue-600 transition-colors">
                              <AIVoiceInput onTranscriptionComplete={handleVoiceInput('medicamentos.tipo_reaccion')} />
                            </button>
                          </div>
                        </div>
                      </div>

                      <div className="relative">
                        <label className="block text-sm font-medium mb-1">Severidad de la reacción:</label>
                        <div className="flex items-center">
                          <Textarea 
                            value={formData.antecedentesAlergicos.medicamentos.severidad || ''} 
                            onChange={e => handleTextChange('medicamentos.severidad', e.target.value)} 
                            placeholder="Especifique la severidad" 
                            className="min-h-[60px] flex-1" 
                          />
                          <div className="ml-2">
                            <button className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center hover:bg-blue-600 transition-colors">
                              <AIVoiceInput onTranscriptionComplete={handleVoiceInput('medicamentos.severidad')} />
                            </button>
                          </div>
                        </div>
                      </div>
                    </>
                  )}

                  <div>
                    <h3 className="text-md font-medium mb-2">¿Es alérgico a algún alimento?</h3>
                    <div className="flex gap-4">
                      <button 
                        className={`px-4 py-2 rounded-md text-sm transition-colors ${formData.antecedentesAlergicos.alimentos.es_alergico === 'si' ? 'bg-[#2ecc71] text-white' : 'bg-gray-100 dark:bg-gray-700'}`} 
                        onClick={() => handleAntecedenteAlergicoChange('alimentos.es_alergico', 'si')}
                      >
                        Sí
                      </button>
                      <button 
                        className={`px-4 py-2 rounded-md text-sm transition-colors ${formData.antecedentesAlergicos.alimentos.es_alergico === 'no' ? 'bg-[#2ecc71] text-white' : 'bg-gray-100 dark:bg-gray-700'}`} 
                        onClick={() => handleAntecedenteAlergicoChange('alimentos.es_alergico', 'no')}
                      >
                        No
                      </button>
                    </div>
                  </div>

                  {formData.antecedentesAlergicos.alimentos.es_alergico === 'si' && (
                    <div className="relative">
                      <label className="block text-sm font-medium mb-1">¿A cuáles alimentos es alérgico?</label>
                      <div className="flex items-center">
                        <Textarea 
                          value={formData.antecedentesAlergicos.alimentos.cuales || ''} 
                          onChange={e => handleTextChange('alimentos.cuales', e.target.value)} 
                          placeholder="Especifique los alimentos" 
                          className="min-h-[80px] flex-1" 
                        />
                        <div className="ml-2">
                          <button className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center hover:bg-blue-600 transition-colors">
                            <AIVoiceInput onTranscriptionComplete={handleVoiceInput('alimentos.cuales')} />
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  <div>
                    <h3 className="text-md font-medium mb-2">¿Es alérgico al látex?</h3>
                    <div className="flex gap-4">
                      <button 
                        className={`px-4 py-2 rounded-md text-sm transition-colors ${formData.antecedentesAlergicos.latex.es_alergico === 'si' ? 'bg-[#2ecc71] text-white' : 'bg-gray-100 dark:bg-gray-700'}`} 
                        onClick={() => handleAntecedenteAlergicoChange('latex.es_alergico', 'si')}
                      >
                        Sí
                      </button>
                      <button 
                        className={`px-4 py-2 rounded-md text-sm transition-colors ${formData.antecedentesAlergicos.latex.es_alergico === 'no' ? 'bg-[#2ecc71] text-white' : 'bg-gray-100 dark:bg-gray-700'}`} 
                        onClick={() => handleAntecedenteAlergicoChange('latex.es_alergico', 'no')}
                      >
                        No
                      </button>
                    </div>
                  </div>

                  {formData.antecedentesAlergicos.latex.es_alergico === 'si' && (
                    <div className="relative">
                      <label className="block text-sm font-medium mb-1">Descripción de la reacción alérgica al látex:</label>
                      <div className="flex items-center">
                        <Textarea 
                          value={formData.antecedentesAlergicos.latex.descripcion_reaccion || ''} 
                          onChange={e => handleTextChange('latex.descripcion_reaccion', e.target.value)} 
                          placeholder="Especifique la reacción" 
                          className="min-h-[80px] flex-1" 
                        />
                        <div className="ml-2">
                          <button className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center hover:bg-blue-600 transition-colors">
                            <AIVoiceInput onTranscriptionComplete={handleVoiceInput('latex.descripcion_reaccion')} />
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="relative">
                    <label className="block text-sm font-medium mb-1">Detalles adicionales sobre alergias:</label>
                    <div className="flex items-center">
                      <Textarea 
                        value={formData.antecedentesAlergicos.cualesAlergias || ''} 
                        onChange={e => handleTextChange('cualesAlergias', e.target.value)} 
                        placeholder="Proporcione cualquier otra información relevante" 
                        className="min-h-[80px] flex-1" 
                      />
                      <div className="ml-2">
                        <button className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center hover:bg-blue-600 transition-colors">
                          <AIVoiceInput onTranscriptionComplete={handleVoiceInput('cualesAlergias')} />
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-center mt-6">
                    <button
                      onClick={generateRedaccion}
                      disabled={isGeneratingRedaccion}
                      className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2"
                    >
                      {isGeneratingRedaccion ? 'Generando...' : 'Generar Redacción IA'}
                    </button>
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
                  {redaccionContent || "No se ha generado redacción aún. Utilice el botón 'Generar Redacción IA' en la pestaña de Formulario."}
                </div>
              </div>
            )}
          </>
        )}
      </Card>
    </div>
  );
};

export default AntecedentesAlergicos;
