
import React, { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Minus, Maximize2, X, Mic } from "lucide-react";
import { FormDataState } from '@/types/historiaClinica';
import { Textarea } from "@/components/ui/textarea";
import { VoiceInput } from "@/components/ui/voice-input";

interface AntecedentesAlergicosProps {
  formData: FormDataState;
  handleAntecedenteAlergicoChange?: (field: string, value: any) => void;
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

  const handleToggleButton = (field: string) => {
    if (handleAntecedenteAlergicoChange) {
      handleAntecedenteAlergicoChange(field, !formData.antecedentesAlergicos[field]);
    }
  };

  const handleToggleAllergyType = (type: 'medicamentos' | 'alimentos' | 'ambiente') => {
    if (handleAntecedenteAlergicoChange) {
      const currentValue = formData.antecedentesAlergicos.tiposAlergias?.[type] || false;
      handleAntecedenteAlergicoChange(`tiposAlergias.${type}`, !currentValue);
    }
  };

  const handleToggleAddiction = (type: 'tabaco' | 'alcohol' | 'drogas') => {
    if (handleAntecedenteAlergicoChange) {
      const currentValue = formData.antecedentesAlergicos.adicciones?.[type] || false;
      handleAntecedenteAlergicoChange(`adicciones.${type}`, !currentValue);
    }
  };

  const handleTextChange = (field: string, value: string) => {
    if (handleAntecedenteAlergicoChange) {
      handleAntecedenteAlergicoChange(field, value);
    }
  };

  const handleVoiceInput = (field: string) => (text: string) => {
    if (handleAntecedenteAlergicoChange) {
      const currentValue = formData.antecedentesAlergicos[field] || "";
      handleAntecedenteAlergicoChange(field, currentValue ? `${currentValue} ${text}` : text);
    }
  };

  const generateRedaccion = () => {
    setIsGeneratingRedaccion(true);
    setTimeout(() => {
      let content = "ANTECEDENTES ALÉRGICOS:\n\n";
      
      // Tipos de alergias
      const alergias = [];
      if (formData.antecedentesAlergicos.tiposAlergias?.medicamentos) alergias.push("medicamentos");
      if (formData.antecedentesAlergicos.tiposAlergias?.alimentos) alergias.push("alimentos");
      if (formData.antecedentesAlergicos.tiposAlergias?.ambiente) alergias.push("ambiente");
      
      if (alergias.length > 0) {
        content += `El paciente presenta antecedentes de alergia a ${alergias.join(", ")}. `;
        
        if (formData.antecedentesAlergicos.cualesAlergias) {
          content += `Específicamente a: ${formData.antecedentesAlergicos.cualesAlergias}. `;
        }
        
        if (formData.antecedentesAlergicos.especificacionAlergias) {
          content += `Se manifiesta como: ${formData.antecedentesAlergicos.especificacionAlergias}. `;
        }
      } else {
        content += "El paciente no refiere antecedentes de alergias. ";
      }
      
      // Anestesia
      content += "\n\nANTECEDENTES DE ANESTESIA:\n";
      if (formData.antecedentesAlergicos.administradoAnestesia) {
        content += "Se le ha administrado anestesia previamente";
        if (formData.antecedentesAlergicos.tipoAnestesia) {
          content += `: ${formData.antecedentesAlergicos.tipoAnestesia}. `;
        } else {
          content += ". ";
        }
        
        if (formData.antecedentesAlergicos.reaccionAnestesia) {
          content += "Presentó reacción adversa a la anestesia";
          if (formData.antecedentesAlergicos.descripcionReaccion) {
            content += `: ${formData.antecedentesAlergicos.descripcionReaccion}. `;
          } else {
            content += ". ";
          }
        } else {
          content += "No presentó reacciones adversas a la anestesia. ";
        }
      } else {
        content += "No se le ha administrado anestesia previamente. ";
      }
      
      // Adicciones
      const adicciones = [];
      if (formData.antecedentesAlergicos.adicciones?.tabaco) adicciones.push("tabaco");
      if (formData.antecedentesAlergicos.adicciones?.alcohol) adicciones.push("alcohol");
      if (formData.antecedentesAlergicos.adicciones?.drogas) adicciones.push("drogas");
      
      content += "\n\nADICCIONES:\n";
      if (adicciones.length > 0) {
        content += `El paciente refiere adicción a: ${adicciones.join(", ")}. `;
        if (formData.antecedentesAlergicos.detallesAdicciones) {
          content += `Detalles: ${formData.antecedentesAlergicos.detallesAdicciones}`;
        }
      } else {
        content += "El paciente no refiere adicciones.";
      }
      
      setRedaccionContent(content);
      setIsGeneratingRedaccion(false);
      setActiveTab('redaccion');
    }, 1000);
  };

  return (
    <div className={`max-w-4xl mx-auto transition-all duration-300 ${isMaximized ? "fixed inset-4 z-50" : ""}`}
         data-section-redaction="true" 
         data-section-name="antecedentesAlergicos">
      <Card className={`bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-lg rounded-xl border-0 ${isMaximized ? "h-[calc(100vh-2rem)] overflow-y-auto" : ""}`}>
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex justify-center w-full">
            <div className="flex bg-gray-200 dark:bg-gray-700 rounded-full p-1">
              <button 
                className={`px-5 py-1.5 rounded-full transition-all duration-300 text-sm ${
                  activeTab === 'formulario' ? 'bg-blue-500 text-white shadow-md' : 'text-gray-700 dark:text-gray-300'
                }`}
                onClick={() => setActiveTab('formulario')}
              >
                Formulario
              </button>
              <button 
                className={`px-5 py-1.5 rounded-full transition-all duration-300 text-sm ${
                  activeTab === 'redaccion' ? 'bg-blue-500 text-white shadow-md' : 'text-gray-700 dark:text-gray-300'
                }`}
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
            <span className="text-gray-400">V.</span> ANTECEDENTES ALÉRGICOS
          </h2>
        </div>

        {!isMinimized && (
          <>
            {activeTab === 'formulario' ? (
              <div className="p-6">
                <div className="space-y-6">
                  <div>
                    <h3 className="text-md font-medium mb-2">¿Ha presentado alguna reacción alérgica a alguno de los siguientes?</h3>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {[
                        { label: "Medicamentos", value: "medicamentos" },
                        { label: "Alimentos", value: "alimentos" },
                        { label: "Entorno ambiental", value: "ambiente" }
                      ].map((item) => (
                        <button
                          key={item.value}
                          className={`px-3 py-1 text-sm rounded-full transition-colors ${
                            formData.antecedentesAlergicos.tiposAlergias?.[item.value] 
                              ? 'bg-[#FFF9C4] hover:bg-[#FFF9C4]/80'
                              : 'bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600'
                          }`}
                          onClick={() => handleToggleAllergyType(item.value as any)}
                        >
                          {item.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-6">
                    <div className="relative">
                      <label className="block text-sm font-medium mb-1">¿Cuáles?</label>
                      <div className="flex items-center">
                        <Textarea
                          value={formData.antecedentesAlergicos.cualesAlergias || ''}
                          onChange={(e) => handleTextChange('cualesAlergias', e.target.value)}
                          placeholder="Especifique qué medicamentos, alimentos o elementos ambientales"
                          className="min-h-[80px] flex-1"
                        />
                        <div className="ml-2">
                          <button 
                            className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center hover:bg-blue-600 transition-colors"
                            onClick={() => {}}
                          >
                            <VoiceInput onTranscriptionComplete={handleVoiceInput('cualesAlergias')} />
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="relative">
                      <label className="block text-sm font-medium mb-1">¿A qué específicamente?</label>
                      <div className="flex items-center">
                        <Textarea
                          value={formData.antecedentesAlergicos.especificacionAlergias || ''}
                          onChange={(e) => handleTextChange('especificacionAlergias', e.target.value)}
                          placeholder="Describa específicamente la alergia"
                          className="min-h-[80px] flex-1"
                        />
                        <div className="ml-2">
                          <button 
                            className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center hover:bg-blue-600 transition-colors"
                            onClick={() => {}}
                          >
                            <VoiceInput onTranscriptionComplete={handleVoiceInput('especificacionAlergias')} />
                          </button>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-md font-medium mb-2">¿Le han administrado anestesia general y/o local?</h3>
                      <div className="flex gap-4">
                        <button
                          className={`px-4 py-2 rounded-md text-sm transition-colors ${
                            formData.antecedentesAlergicos.administradoAnestesia
                              ? 'bg-[#2ecc71] text-white'
                              : 'bg-gray-100 dark:bg-gray-700'
                          }`}
                          onClick={() => handleTextChange('administradoAnestesia', true)}
                        >
                          Sí
                        </button>
                        <button
                          className={`px-4 py-2 rounded-md text-sm transition-colors ${
                            formData.antecedentesAlergicos.administradoAnestesia === false
                              ? 'bg-[#2ecc71] text-white'
                              : 'bg-gray-100 dark:bg-gray-700'
                          }`}
                          onClick={() => handleTextChange('administradoAnestesia', false)}
                        >
                          No
                        </button>
                      </div>
                    </div>

                    <div className="relative">
                      <label className="block text-sm font-medium mb-1">Especifique el tipo de anestesia y procedimiento:</label>
                      <div className="flex items-center">
                        <Textarea
                          value={formData.antecedentesAlergicos.tipoAnestesia || ''}
                          onChange={(e) => handleTextChange('tipoAnestesia', e.target.value)}
                          placeholder="Tipo de anestesia y procedimiento"
                          className="min-h-[80px] flex-1"
                        />
                        <div className="ml-2">
                          <button 
                            className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center hover:bg-blue-600 transition-colors"
                            onClick={() => {}}
                          >
                            <VoiceInput onTranscriptionComplete={handleVoiceInput('tipoAnestesia')} />
                          </button>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-md font-medium mb-2">¿Tuvo alguna reacción adversa a la anestesia?</h3>
                      <div className="flex gap-4">
                        <button
                          className={`px-4 py-2 rounded-md text-sm transition-colors ${
                            formData.antecedentesAlergicos.reaccionAnestesia
                              ? 'bg-[#2ecc71] text-white'
                              : 'bg-gray-100 dark:bg-gray-700'
                          }`}
                          onClick={() => handleTextChange('reaccionAnestesia', true)}
                        >
                          Sí
                        </button>
                        <button
                          className={`px-4 py-2 rounded-md text-sm transition-colors ${
                            formData.antecedentesAlergicos.reaccionAnestesia === false
                              ? 'bg-[#2ecc71] text-white'
                              : 'bg-gray-100 dark:bg-gray-700'
                          }`}
                          onClick={() => handleTextChange('reaccionAnestesia', false)}
                        >
                          No
                        </button>
                      </div>
                    </div>

                    <div className="relative">
                      <label className="block text-sm font-medium mb-1">Si respondió que sí, especifique la reacción:</label>
                      <div className="flex items-center">
                        <Textarea
                          value={formData.antecedentesAlergicos.descripcionReaccion || ''}
                          onChange={(e) => handleTextChange('descripcionReaccion', e.target.value)}
                          placeholder="Descripción de la reacción adversa"
                          className="min-h-[80px] flex-1"
                        />
                        <div className="ml-2">
                          <button 
                            className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center hover:bg-blue-600 transition-colors"
                            onClick={() => {}}
                          >
                            <VoiceInput onTranscriptionComplete={handleVoiceInput('descripcionReaccion')} />
                          </button>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-md font-medium mb-2">¿Tiene alguna adicción actual o pasada?</h3>
                      <div className="flex flex-wrap gap-2 mb-4">
                        {[
                          { label: "Tabaco", value: "tabaco" },
                          { label: "Alcohol", value: "alcohol" },
                          { label: "Drogas", value: "drogas" }
                        ].map((item) => (
                          <button
                            key={item.value}
                            className={`px-3 py-1 text-sm rounded-full transition-colors ${
                              formData.antecedentesAlergicos.adicciones?.[item.value] 
                                ? 'bg-[#B3E5FC] hover:bg-[#B3E5FC]/80'
                                : 'bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600'
                            }`}
                            onClick={() => handleToggleAddiction(item.value as any)}
                          >
                            {item.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="relative">
                      <label className="block text-sm font-medium mb-1">Especifique tipo, frecuencia y duración:</label>
                      <div className="flex items-center">
                        <Textarea
                          value={formData.antecedentesAlergicos.detallesAdicciones || ''}
                          onChange={(e) => handleTextChange('detallesAdicciones', e.target.value)}
                          placeholder="Detalles sobre adicciones"
                          className="min-h-[80px] flex-1"
                        />
                        <div className="ml-2">
                          <button 
                            className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center hover:bg-blue-600 transition-colors"
                            onClick={() => {}}
                          >
                            <VoiceInput onTranscriptionComplete={handleVoiceInput('detallesAdicciones')} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-center mt-6">
                    <button
                      onClick={generateRedaccion}
                      className="bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-lg px-4 py-2 transition-colors flex items-center gap-2"
                      disabled={isGeneratingRedaccion}
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
