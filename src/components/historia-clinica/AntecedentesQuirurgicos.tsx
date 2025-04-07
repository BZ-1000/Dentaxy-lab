
import React, { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Minus, Maximize2, X, Mic, PlusCircle, Trash2 } from "lucide-react";
import { FormDataState } from '@/types/historiaClinica';
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { FancyRadio, FancyRadioGroup } from "@/components/ui/fancy-radio"
import { AIVoiceInput } from "@/components/ui/ai-voice-input";

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
  const [activeTab, setActiveTab] = useState<'form' | 'ai'>('form');
  const [isRecording, setIsRecording] = useState(false);
  const [recordingField, setRecordingField] = useState<string | null>(null);

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

  const handleRecording = (field: string) => {
    if (recordingField === field) {
      setIsRecording(false);
      setRecordingField(null);
    } else {
      setIsRecording(true);
      setRecordingField(field);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    handleAntecedenteQuirurgicoChange(field, value);
  };

  const handleRadioChange = (field: string, value: string) => {
    handleAntecedenteQuirurgicoChange(field, value === 'si');
  };

  const handleVoiceInput = (field: string, text: string) => {
    handleAntecedenteQuirurgicoChange(field, text);
  };

  const addCirugia = () => {
    const cirugias = [...(formData?.antecedentesQuirurgicos?.cirugiasRealizadas || [])];
    cirugias.push({ tipo: '', fecha: '', motivo: '' });
    handleAntecedenteQuirurgicoChange('cirugiasRealizadas', cirugias);
  };

  const removeCirugia = (index: number) => {
    const cirugias = [...(formData?.antecedentesQuirurgicos?.cirugiasRealizadas || [])];
    cirugias.splice(index, 1);
    handleAntecedenteQuirurgicoChange('cirugiasRealizadas', cirugias);
  };

  const updateCirugia = (index: number, field: 'tipo' | 'fecha' | 'motivo', value: string) => {
    const cirugias = [...(formData?.antecedentesQuirurgicos?.cirugiasRealizadas || [])];
    cirugias[index] = { ...cirugias[index], [field]: value };
    handleAntecedenteQuirurgicoChange('cirugiasRealizadas', cirugias);
  };

  return (
    <div className={`max-w-4xl mx-auto transition-all duration-300 ${isMaximized ? "fixed inset-4 z-50" : ""}`}>
      <Card className={`bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-lg rounded-xl border-0 ${isMaximized ? "h-[calc(100vh-2rem)] overflow-y-auto" : ""}`}>
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex justify-center w-full">
            <div className="flex bg-gray-200 dark:bg-gray-700 rounded-full p-1">
              <button 
                className={`px-5 py-1.5 rounded-full transition-all duration-300 text-sm ${activeTab === 'form' ? 'bg-blue-500 text-white shadow-md' : 'text-gray-700 dark:text-gray-300'}`}
                onClick={() => setActiveTab('form')}
              >
                Formulario
              </button>
              <button 
                className={`px-5 py-1.5 rounded-full transition-all duration-300 text-sm ${activeTab === 'ai' ? 'bg-blue-500 text-white shadow-md' : 'text-gray-700 dark:text-gray-300'}`}
                onClick={() => setActiveTab('ai')}
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

        {!isMinimized && activeTab === 'form' && (
          <div className="p-6">
            <div className="space-y-6">
              <div className="space-y-4">
                <h3 className="font-medium">1. ¿Ha estado sometido(a) a algún tratamiento médico en los últimos dos meses?</h3>
                <FancyRadioGroup 
                  defaultValue={formData?.antecedentesQuirurgicos?.tratamiento_reciente ? 'si' : 'no'}
                  onValueChange={(value) => handleRadioChange('tratamiento_reciente', value)}
                >
                  <FancyRadio value="si" label="Sí" id="tratamiento-si" />
                  <FancyRadio value="no" label="No" id="tratamiento-no" />
                </FancyRadioGroup>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-medium">2. Motivo del tratamiento:</h3>
                </div>
                <div className="relative">
                  <Textarea 
                    placeholder="Detallar el motivo del tratamiento..." 
                    className="min-h-[80px] pr-12" 
                    value={formData?.antecedentesQuirurgicos?.motivo_tratamiento || ''}
                    onChange={(e) => handleInputChange('motivo_tratamiento', e.target.value)}
                  />
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={() => handleRecording('motivo_tratamiento')}
                    className={`absolute right-2 top-2 h-8 w-8 rounded-full ${recordingField === 'motivo_tratamiento' && isRecording ? 'bg-red-100 text-red-500 animate-pulse' : ''}`}
                  >
                    <Mic className="h-4 w-4" />
                  </Button>
                </div>
                {recordingField === 'motivo_tratamiento' && (
                  <AIVoiceInput
                    onTranscriptionComplete={(text) => handleVoiceInput('motivo_tratamiento', text)}
                  />
                )}
              </div>

              <div className="space-y-4">
                <h3 className="font-medium">3. ¿Ha sido hospitalizado(a) en los últimos dos meses?</h3>
                <FancyRadioGroup 
                  defaultValue={formData?.antecedentesQuirurgicos?.hospitalizacion_reciente ? 'si' : 'no'}
                  onValueChange={(value) => handleRadioChange('hospitalizacion_reciente', value)}
                >
                  <FancyRadio value="si" label="Sí" id="hospitalizacion-si" />
                  <FancyRadio value="no" label="No" id="hospitalizacion-no" />
                </FancyRadioGroup>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-medium">4. Motivo de la hospitalización:</h3>
                </div>
                <div className="relative">
                  <Textarea 
                    placeholder="Detallar el motivo de la hospitalización..." 
                    className="min-h-[80px] pr-12" 
                    value={formData?.antecedentesQuirurgicos?.motivo_hospitalizacion || ''}
                    onChange={(e) => handleInputChange('motivo_hospitalizacion', e.target.value)}
                  />
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={() => handleRecording('motivo_hospitalizacion')}
                    className={`absolute right-2 top-2 h-8 w-8 rounded-full ${recordingField === 'motivo_hospitalizacion' && isRecording ? 'bg-red-100 text-red-500 animate-pulse' : ''}`}
                  >
                    <Mic className="h-4 w-4" />
                  </Button>
                </div>
                {recordingField === 'motivo_hospitalizacion' && (
                  <AIVoiceInput
                    onTranscriptionComplete={(text) => handleVoiceInput('motivo_hospitalizacion', text)}
                  />
                )}
              </div>

              <div className="space-y-4">
                <h3 className="font-medium">5. ¿Está tomando actualmente algún medicamento?</h3>
                <FancyRadioGroup 
                  defaultValue={formData?.antecedentesQuirurgicos?.medicacion_actual ? 'si' : 'no'}
                  onValueChange={(value) => handleRadioChange('medicacion_actual', value)}
                >
                  <FancyRadio value="si" label="Sí" id="medicacion-si" />
                  <FancyRadio value="no" label="No" id="medicacion-no" />
                </FancyRadioGroup>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-medium">6. ¿Cuál o cuáles?</h3>
                </div>
                <div className="relative">
                  <Textarea 
                    placeholder="Detallar los medicamentos que toma actualmente..." 
                    className="min-h-[80px] pr-12" 
                    value={formData?.antecedentesQuirurgicos?.medicamentos_actuales || ''}
                    onChange={(e) => handleInputChange('medicamentos_actuales', e.target.value)}
                  />
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={() => handleRecording('medicamentos_actuales')}
                    className={`absolute right-2 top-2 h-8 w-8 rounded-full ${recordingField === 'medicamentos_actuales' && isRecording ? 'bg-red-100 text-red-500 animate-pulse' : ''}`}
                  >
                    <Mic className="h-4 w-4" />
                  </Button>
                </div>
                {recordingField === 'medicamentos_actuales' && (
                  <AIVoiceInput
                    onTranscriptionComplete={(text) => handleVoiceInput('medicamentos_actuales', text)}
                  />
                )}
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-medium">7. Motivo por el cual toma estos medicamentos:</h3>
                </div>
                <div className="relative">
                  <Textarea 
                    placeholder="Detallar el motivo de la medicación..." 
                    className="min-h-[80px] pr-12" 
                    value={formData?.antecedentesQuirurgicos?.motivo_medicacion || ''}
                    onChange={(e) => handleInputChange('motivo_medicacion', e.target.value)}
                  />
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={() => handleRecording('motivo_medicacion')}
                    className={`absolute right-2 top-2 h-8 w-8 rounded-full ${recordingField === 'motivo_medicacion' && isRecording ? 'bg-red-100 text-red-500 animate-pulse' : ''}`}
                  >
                    <Mic className="h-4 w-4" />
                  </Button>
                </div>
                {recordingField === 'motivo_medicacion' && (
                  <AIVoiceInput
                    onTranscriptionComplete={(text) => handleVoiceInput('motivo_medicacion', text)}
                  />
                )}
              </div>

              <div className="pt-4 border-t">
                <h2 className="text-lg font-semibold mb-4">Cirugías</h2>

                <div className="space-y-4">
                  {formData?.antecedentesQuirurgicos?.cirugiasRealizadas && 
                   formData?.antecedentesQuirurgicos?.cirugiasRealizadas.map((cirugia, index) => (
                    <div key={index} className="p-4 border border-gray-200 rounded-lg relative">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="absolute top-2 right-2 text-red-500 hover:text-red-700 hover:bg-red-50"
                        onClick={() => removeCirugia(index)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                          <Label htmlFor={`cirugia-tipo-${index}`}>Tipo de cirugía</Label>
                          <Input
                            id={`cirugia-tipo-${index}`}
                            value={cirugia.tipo || ''}
                            onChange={(e) => updateCirugia(index, 'tipo', e.target.value)}
                            placeholder="Tipo de cirugía"
                            className="mt-1"
                          />
                        </div>
                        <div>
                          <Label htmlFor={`cirugia-fecha-${index}`}>Fecha</Label>
                          <Input
                            id={`cirugia-fecha-${index}`}
                            value={cirugia.fecha || ''}
                            onChange={(e) => updateCirugia(index, 'fecha', e.target.value)}
                            placeholder="Fecha de la cirugía"
                            className="mt-1"
                          />
                        </div>
                      </div>

                      <div>
                        <Label htmlFor={`cirugia-motivo-${index}`}>Motivo</Label>
                        <Textarea
                          id={`cirugia-motivo-${index}`}
                          value={cirugia.motivo || ''}
                          onChange={(e) => updateCirugia(index, 'motivo', e.target.value)}
                          placeholder="Motivo de la cirugía"
                          className="mt-1"
                        />
                      </div>
                    </div>
                  ))}

                  <Button
                    variant="outline"
                    onClick={addCirugia}
                    className="w-full flex items-center justify-center gap-2 border-dashed"
                  >
                    <PlusCircle className="h-4 w-4" />
                    <span>Agregar cirugía</span>
                  </Button>
                </div>
              </div>

              <div className="pt-4 border-t">
                <h2 className="text-lg font-semibold mb-4">Antecedentes Gineco-Obstétricos (solo para pacientes mujeres)</h2>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                  <div>
                    <Label htmlFor="num-embarazos">Número de embarazos</Label>
                    <Input
                      id="num-embarazos"
                      type="text"
                      placeholder="0"
                      value={formData?.antecedentesQuirurgicos?.num_embarazos || ''}
                      onChange={(e) => handleInputChange('num_embarazos', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="num-partos">Número de partos</Label>
                    <Input
                      id="num-partos"
                      type="text"
                      placeholder="0"
                      value={formData?.antecedentesQuirurgicos?.num_partos || ''}
                      onChange={(e) => handleInputChange('num_partos', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="num-cesareas">Número de cesáreas</Label>
                    <Input
                      id="num-cesareas"
                      type="text"
                      placeholder="0"
                      value={formData?.antecedentesQuirurgicos?.num_cesareas || ''}
                      onChange={(e) => handleInputChange('num_cesareas', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="num-abortos">Número de abortos</Label>
                    <Input
                      id="num-abortos"
                      type="text"
                      placeholder="0"
                      value={formData?.antecedentesQuirurgicos?.num_abortos || ''}
                      onChange={(e) => handleInputChange('num_abortos', e.target.value)}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <Label htmlFor="complicaciones-gineco">Complicaciones</Label>
                  </div>
                  <div className="relative">
                    <Textarea 
                      id="complicaciones-gineco"
                      placeholder="Describa complicaciones durante embarazos, partos, etc..." 
                      className="min-h-[80px] pr-12" 
                      value={formData?.antecedentesQuirurgicos?.complicaciones_gineco || ''}
                      onChange={(e) => handleInputChange('complicaciones_gineco', e.target.value)}
                    />
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={() => handleRecording('complicaciones_gineco')}
                      className={`absolute right-2 top-2 h-8 w-8 rounded-full ${recordingField === 'complicaciones_gineco' && isRecording ? 'bg-red-100 text-red-500 animate-pulse' : ''}`}
                    >
                      <Mic className="h-4 w-4" />
                    </Button>
                  </div>
                  {recordingField === 'complicaciones_gineco' && (
                    <AIVoiceInput
                      onTranscriptionComplete={(text) => handleVoiceInput('complicaciones_gineco', text)}
                    />
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {!isMinimized && activeTab === 'ai' && (
          <div className="p-6">
            <div className="flex justify-between mb-4">
              <Button variant="outline" size="sm">Copiar</Button>
              <Button 
                variant="default" 
                size="sm" 
                className="bg-blue-500 hover:bg-blue-600"
              >
                Generar Redacción IA
              </Button>
            </div>
            <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg min-h-[150px] whitespace-pre-wrap">
              {/* Aquí se mostrará la redacción generada por IA */}
              <p className="text-gray-500 dark:text-gray-400 italic">La redacción generada por IA aparecerá aquí después de hacer clic en el botón "Generar Redacción IA".</p>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
};

export default AntecedentesQuirurgicos;
