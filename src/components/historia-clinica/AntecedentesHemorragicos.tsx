
import React, { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Minus, Maximize2, X, Mic } from "lucide-react";
import { FormDataState } from '@/types/historiaClinica';
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"

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
                <RadioGroup 
                  defaultValue={formData?.antecedentesHemorragicos?.transfusion_sanguinea ? 'si' : 'no'}
                  onValueChange={(value) => handleRadioChange('transfusion_sanguinea', value)}
                  className="flex space-x-4"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="si" id="transfusion-si" />
                    <Label htmlFor="transfusion-si">Sí</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="no" id="transfusion-no" />
                    <Label htmlFor="transfusion-no">No</Label>
                  </div>
                </RadioGroup>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-medium">2. Motivo de la transfusión:</h3>
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={() => handleRecording('motivo_transfusion')}
                    className={`h-8 w-8 rounded-full ${recordingField === 'motivo_transfusion' && isRecording ? 'bg-red-100 text-red-500 animate-pulse' : ''}`}
                  >
                    <Mic className="h-4 w-4" />
                  </Button>
                </div>
                <Textarea 
                  placeholder="Detallar el motivo de la transfusión sanguínea..." 
                  className="min-h-[80px]" 
                  value={formData?.antecedentesHemorragicos?.motivo_transfusion || ''}
                  onChange={(e) => handleInputChange('motivo_transfusion', e.target.value)}
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-medium">3. Fecha de la transfusión:</h3>
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={() => handleRecording('fecha_transfusion')}
                    className={`h-8 w-8 rounded-full ${recordingField === 'fecha_transfusion' && isRecording ? 'bg-red-100 text-red-500 animate-pulse' : ''}`}
                  >
                    <Mic className="h-4 w-4" />
                  </Button>
                </div>
                <Textarea 
                  placeholder="Indicar fecha o fechas de transfusión..." 
                  className="min-h-[80px]" 
                  value={formData?.antecedentesHemorragicos?.fecha_transfusion || ''}
                  onChange={(e) => handleInputChange('fecha_transfusion', e.target.value)}
                />
              </div>

              <div>
                <h3 className="font-medium mb-3">Otros datos relevantes</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-sm font-medium mb-2">Sangrado prolongado</h4>
                    <RadioGroup 
                      defaultValue={formData?.antecedentesHemorragicos?.sangradoProlongado || 'no'}
                      onValueChange={(value) => handleInputChange('sangradoProlongado', value)}
                      className="flex space-x-4"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="si" id="sangrado-si" />
                        <Label htmlFor="sangrado-si">Sí</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="no" id="sangrado-no" />
                        <Label htmlFor="sangrado-no">No</Label>
                      </div>
                    </RadioGroup>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium mb-2">Hematomas frecuentes</h4>
                    <RadioGroup 
                      defaultValue={formData?.antecedentesHemorragicos?.hematomas || 'no'}
                      onValueChange={(value) => handleInputChange('hematomas', value)}
                      className="flex space-x-4"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="si" id="hematomas-si" />
                        <Label htmlFor="hematomas-si">Sí</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="no" id="hematomas-no" />
                        <Label htmlFor="hematomas-no">No</Label>
                      </div>
                    </RadioGroup>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium mb-2">Hemorragias espontáneas</h4>
                    <RadioGroup 
                      defaultValue={formData?.antecedentesHemorragicos?.hemorragiasEspontaneas || 'no'}
                      onValueChange={(value) => handleInputChange('hemorragiasEspontaneas', value)}
                      className="flex space-x-4"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="si" id="hemorragias-si" />
                        <Label htmlFor="hemorragias-si">Sí</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="no" id="hemorragias-no" />
                        <Label htmlFor="hemorragias-no">No</Label>
                      </div>
                    </RadioGroup>
                  </div>
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-medium">Detalles adicionales sobre antecedentes hemorrágicos:</h3>
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={() => handleRecording('detallesAdicionales')}
                    className={`h-8 w-8 rounded-full ${recordingField === 'detallesAdicionales' && isRecording ? 'bg-red-100 text-red-500 animate-pulse' : ''}`}
                  >
                    <Mic className="h-4 w-4" />
                  </Button>
                </div>
                <Textarea 
                  placeholder="Incluir cualquier otra información relevante sobre antecedentes hemorrágicos..." 
                  className="min-h-[100px]" 
                  value={formData?.antecedentesHemorragicos?.detallesAdicionales || ''}
                  onChange={(e) => handleInputChange('detallesAdicionales', e.target.value)}
                />
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
