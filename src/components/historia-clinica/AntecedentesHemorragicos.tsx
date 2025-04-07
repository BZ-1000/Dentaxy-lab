
import React, { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Minus, Maximize2, X, Mic } from "lucide-react";
import { FormDataState } from '@/types/historiaClinica';
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { FancyRadio, FancyRadioGroup } from "@/components/ui/fancy-radio"
import { AIVoiceInput } from "@/components/ui/ai-voice-input";

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
    handleAntecedenteHemorragicoChange(field, value);
  };

  const handleRadioChange = (field: string, value: string) => {
    handleAntecedenteHemorragicoChange(field, value === 'si');
  };

  const handleVoiceInput = (field: string, text: string) => {
    handleAntecedenteHemorragicoChange(field, text);
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
            <span className="text-gray-400">VII.</span> ANTECEDENTES HEMORRÁGICOS
          </h2>
        </div>

        {!isMinimized && activeTab === 'form' && (
          <div className="p-6">
            <div className="space-y-6">
              <div className="space-y-4">
                <h3 className="font-medium">1. ¿Le han transfundido sangre o algún derivado de la misma?</h3>
                <FancyRadioGroup 
                  defaultValue={formData?.antecedentesHemorragicos?.transfusion_sanguinea ? 'si' : 'no'}
                  onValueChange={(value) => handleRadioChange('transfusion_sanguinea', value)}
                >
                  <FancyRadio value="si" label="Sí" id="transfusion-si" />
                  <FancyRadio value="no" label="No" id="transfusion-no" />
                </FancyRadioGroup>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-medium">2. Motivo de la transfusión:</h3>
                </div>
                <div className="flex items-center gap-4">
                  <div className="relative flex-1">
                    <Textarea 
                      placeholder="Detallar el motivo de la transfusión sanguínea..." 
                      className="min-h-[80px] resize-y text-justify pr-3" 
                      value={formData?.antecedentesHemorragicos?.motivo_transfusion || ''}
                      onChange={(e) => handleInputChange('motivo_transfusion', e.target.value)}
                    />
                  </div>
                  <div className="flex-shrink-0">
                    <button
                      onClick={() => handleRecording('motivo_transfusion')}
                      className={`rounded-full w-12 h-12 flex items-center justify-center bg-blue-500 hover:bg-blue-600 transition-colors ${recordingField === 'motivo_transfusion' && isRecording ? 'bg-red-500 hover:bg-red-600 animate-pulse' : ''}`}
                    >
                      <Mic className="h-6 w-6 text-white" />
                    </button>
                  </div>
                </div>
                {recordingField === 'motivo_transfusion' && (
                  <AIVoiceInput
                    onTranscriptionComplete={(text) => handleVoiceInput('motivo_transfusion', text)}
                    className="p-0"
                  />
                )}
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-medium">3. Fecha de la transfusión:</h3>
                </div>
                <div className="flex items-center gap-4">
                  <div className="relative flex-1">
                    <Textarea 
                      placeholder="Indicar fecha o fechas de transfusión..." 
                      className="min-h-[80px] resize-y text-justify pr-3" 
                      value={formData?.antecedentesHemorragicos?.fecha_transfusion || ''}
                      onChange={(e) => handleInputChange('fecha_transfusion', e.target.value)}
                    />
                  </div>
                  <div className="flex-shrink-0">
                    <button
                      onClick={() => handleRecording('fecha_transfusion')}
                      className={`rounded-full w-12 h-12 flex items-center justify-center bg-blue-500 hover:bg-blue-600 transition-colors ${recordingField === 'fecha_transfusion' && isRecording ? 'bg-red-500 hover:bg-red-600 animate-pulse' : ''}`}
                    >
                      <Mic className="h-6 w-6 text-white" />
                    </button>
                  </div>
                </div>
                {recordingField === 'fecha_transfusion' && (
                  <AIVoiceInput
                    onTranscriptionComplete={(text) => handleVoiceInput('fecha_transfusion', text)}
                    className="p-0"
                  />
                )}
              </div>

              <div>
                <h3 className="font-medium mb-3">Otros datos relevantes</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-sm font-medium mb-2">Sangrado prolongado</h4>
                    <FancyRadioGroup 
                      defaultValue={formData?.antecedentesHemorragicos?.sangradoProlongado || 'no'}
                      onValueChange={(value) => handleInputChange('sangradoProlongado', value)}
                    >
                      <FancyRadio value="si" label="Sí" id="sangrado-si" />
                      <FancyRadio value="no" label="No" id="sangrado-no" />
                    </FancyRadioGroup>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium mb-2">Hematomas frecuentes</h4>
                    <FancyRadioGroup 
                      defaultValue={formData?.antecedentesHemorragicos?.hematomas || 'no'}
                      onValueChange={(value) => handleInputChange('hematomas', value)}
                    >
                      <FancyRadio value="si" label="Sí" id="hematomas-si" />
                      <FancyRadio value="no" label="No" id="hematomas-no" />
                    </FancyRadioGroup>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium mb-2">Hemorragias espontáneas</h4>
                    <FancyRadioGroup 
                      defaultValue={formData?.antecedentesHemorragicos?.hemorragiasEspontaneas || 'no'}
                      onValueChange={(value) => handleInputChange('hemorragiasEspontaneas', value)}
                    >
                      <FancyRadio value="si" label="Sí" id="hemorragias-si" />
                      <FancyRadio value="no" label="No" id="hemorragias-no" />
                    </FancyRadioGroup>
                  </div>
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-medium">Detalles adicionales sobre antecedentes hemorrágicos:</h3>
                </div>
                <div className="flex items-center gap-4">
                  <div className="relative flex-1">
                    <Textarea 
                      placeholder="Incluir cualquier otra información relevante sobre antecedentes hemorrágicos..." 
                      className="min-h-[100px] resize-y text-justify pr-3" 
                      value={formData?.antecedentesHemorragicos?.detallesAdicionales || ''}
                      onChange={(e) => handleInputChange('detallesAdicionales', e.target.value)}
                    />
                  </div>
                  <div className="flex-shrink-0">
                    <button
                      onClick={() => handleRecording('detallesAdicionales')}
                      className={`rounded-full w-12 h-12 flex items-center justify-center bg-blue-500 hover:bg-blue-600 transition-colors ${recordingField === 'detallesAdicionales' && isRecording ? 'bg-red-500 hover:bg-red-600 animate-pulse' : ''}`}
                    >
                      <Mic className="h-6 w-6 text-white" />
                    </button>
                  </div>
                </div>
                {recordingField === 'detallesAdicionales' && (
                  <AIVoiceInput
                    onTranscriptionComplete={(text) => handleVoiceInput('detallesAdicionales', text)}
                    className="p-0"
                  />
                )}
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

export default AntecedentesHemorragicos;
