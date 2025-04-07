
import React, { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Minus, Maximize2, X, Mic } from "lucide-react";
import { FormDataState } from '@/types/historiaClinica';
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Button } from "@/components/ui/button"

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

  const handleRadioChange = (field: string, value: string) => {
    handleAntecedenteQuirurgicoChange(field, value === 'si');
  };

  const handleInputChange = (field: string, value: any) => {
    handleAntecedenteQuirurgicoChange(field, value);
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
                <RadioGroup 
                  defaultValue={formData?.antecedentesQuirurgicos?.tratamiento_reciente ? 'si' : 'no'}
                  onValueChange={(value) => handleRadioChange('tratamiento_reciente', value)}
                  className="flex space-x-4"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="si" id="tratamiento-si" />
                    <Label htmlFor="tratamiento-si">Sí</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="no" id="tratamiento-no" />
                    <Label htmlFor="tratamiento-no">No</Label>
                  </div>
                </RadioGroup>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-medium">2. Motivo del tratamiento:</h3>
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={() => handleRecording('motivo_tratamiento')}
                    className={`h-8 w-8 rounded-full ${recordingField === 'motivo_tratamiento' && isRecording ? 'bg-red-100 text-red-500 animate-pulse' : ''}`}
                  >
                    <Mic className="h-4 w-4" />
                  </Button>
                </div>
                <Textarea 
                  placeholder="Motivo por el que recibió tratamiento médico..." 
                  className="min-h-[80px]" 
                  value={formData?.antecedentesQuirurgicos?.motivo_tratamiento || ''}
                  onChange={(e) => handleInputChange('motivo_tratamiento', e.target.value)}
                />
              </div>

              <div className="space-y-4">
                <h3 className="font-medium">3. ¿Ha sido hospitalizado(a) en los últimos dos meses?</h3>
                <RadioGroup 
                  defaultValue={formData?.antecedentesQuirurgicos?.hospitalizacion_reciente ? 'si' : 'no'}
                  onValueChange={(value) => handleRadioChange('hospitalizacion_reciente', value)}
                  className="flex space-x-4"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="si" id="hospitalizacion-si" />
                    <Label htmlFor="hospitalizacion-si">Sí</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="no" id="hospitalizacion-no" />
                    <Label htmlFor="hospitalizacion-no">No</Label>
                  </div>
                </RadioGroup>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-medium">4. Motivo de la hospitalización:</h3>
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={() => handleRecording('motivo_hospitalizacion')}
                    className={`h-8 w-8 rounded-full ${recordingField === 'motivo_hospitalizacion' && isRecording ? 'bg-red-100 text-red-500 animate-pulse' : ''}`}
                  >
                    <Mic className="h-4 w-4" />
                  </Button>
                </div>
                <Textarea 
                  placeholder="Detallar motivo de hospitalización..." 
                  className="min-h-[80px]" 
                  value={formData?.antecedentesQuirurgicos?.motivo_hospitalizacion || ''}
                  onChange={(e) => handleInputChange('motivo_hospitalizacion', e.target.value)}
                />
              </div>

              <div className="space-y-4">
                <h3 className="font-medium">5. ¿Está tomando actualmente algún medicamento?</h3>
                <RadioGroup 
                  defaultValue={formData?.antecedentesQuirurgicos?.medicacion_actual ? 'si' : 'no'}
                  onValueChange={(value) => handleRadioChange('medicacion_actual', value)}
                  className="flex space-x-4"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="si" id="medicacion-si" />
                    <Label htmlFor="medicacion-si">Sí</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="no" id="medicacion-no" />
                    <Label htmlFor="medicacion-no">No</Label>
                  </div>
                </RadioGroup>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-medium">6. ¿Cuál o cuáles?</h3>
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={() => handleRecording('medicamentos_actuales')}
                    className={`h-8 w-8 rounded-full ${recordingField === 'medicamentos_actuales' && isRecording ? 'bg-red-100 text-red-500 animate-pulse' : ''}`}
                  >
                    <Mic className="h-4 w-4" />
                  </Button>
                </div>
                <Textarea 
                  placeholder="Listar los medicamentos que toma actualmente..." 
                  className="min-h-[80px]" 
                  value={formData?.antecedentesQuirurgicos?.medicamentos_actuales || ''}
                  onChange={(e) => handleInputChange('medicamentos_actuales', e.target.value)}
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-medium">7. Motivo por el cual toma estos medicamentos:</h3>
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={() => handleRecording('motivo_medicacion')}
                    className={`h-8 w-8 rounded-full ${recordingField === 'motivo_medicacion' && isRecording ? 'bg-red-100 text-red-500 animate-pulse' : ''}`}
                  >
                    <Mic className="h-4 w-4" />
                  </Button>
                </div>
                <Textarea 
                  placeholder="Detallar motivo por el que toma medicamentos..." 
                  className="min-h-[80px]" 
                  value={formData?.antecedentesQuirurgicos?.motivo_medicacion || ''}
                  onChange={(e) => handleInputChange('motivo_medicacion', e.target.value)}
                />
              </div>

              <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                <h3 className="font-medium mb-4">Antecedentes Gineco-Obstétricos (solo para pacientes mujeres)</h3>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="font-medium text-sm">1. Número de embarazos:</h4>
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => handleRecording('num_embarazos')}
                        className={`h-8 w-8 rounded-full ${recordingField === 'num_embarazos' && isRecording ? 'bg-red-100 text-red-500 animate-pulse' : ''}`}
                      >
                        <Mic className="h-4 w-4" />
                      </Button>
                    </div>
                    <Textarea 
                      placeholder="Indicar número de embarazos..." 
                      className="min-h-[60px]" 
                      value={formData?.antecedentesQuirurgicos?.num_embarazos || ''}
                      onChange={(e) => handleInputChange('num_embarazos', e.target.value)}
                    />
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="font-medium text-sm">2. Número de partos:</h4>
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => handleRecording('num_partos')}
                        className={`h-8 w-8 rounded-full ${recordingField === 'num_partos' && isRecording ? 'bg-red-100 text-red-500 animate-pulse' : ''}`}
                      >
                        <Mic className="h-4 w-4" />
                      </Button>
                    </div>
                    <Textarea 
                      placeholder="Indicar número de partos..." 
                      className="min-h-[60px]" 
                      value={formData?.antecedentesQuirurgicos?.num_partos || ''}
                      onChange={(e) => handleInputChange('num_partos', e.target.value)}
                    />
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="font-medium text-sm">3. Número de cesáreas:</h4>
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => handleRecording('num_cesareas')}
                        className={`h-8 w-8 rounded-full ${recordingField === 'num_cesareas' && isRecording ? 'bg-red-100 text-red-500 animate-pulse' : ''}`}
                      >
                        <Mic className="h-4 w-4" />
                      </Button>
                    </div>
                    <Textarea 
                      placeholder="Indicar número de cesáreas..." 
                      className="min-h-[60px]" 
                      value={formData?.antecedentesQuirurgicos?.num_cesareas || ''}
                      onChange={(e) => handleInputChange('num_cesareas', e.target.value)}
                    />
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="font-medium text-sm">4. Número de abortos:</h4>
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => handleRecording('num_abortos')}
                        className={`h-8 w-8 rounded-full ${recordingField === 'num_abortos' && isRecording ? 'bg-red-100 text-red-500 animate-pulse' : ''}`}
                      >
                        <Mic className="h-4 w-4" />
                      </Button>
                    </div>
                    <Textarea 
                      placeholder="Indicar número de abortos..." 
                      className="min-h-[60px]" 
                      value={formData?.antecedentesQuirurgicos?.num_abortos || ''}
                      onChange={(e) => handleInputChange('num_abortos', e.target.value)}
                    />
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="font-medium text-sm">5. Complicaciones:</h4>
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => handleRecording('complicaciones_gineco')}
                        className={`h-8 w-8 rounded-full ${recordingField === 'complicaciones_gineco' && isRecording ? 'bg-red-100 text-red-500 animate-pulse' : ''}`}
                      >
                        <Mic className="h-4 w-4" />
                      </Button>
                    </div>
                    <Textarea 
                      placeholder="Detallar complicaciones durante embarazos, partos o cesáreas..." 
                      className="min-h-[80px]" 
                      value={formData?.antecedentesQuirurgicos?.complicaciones_gineco || ''}
                      onChange={(e) => handleInputChange('complicaciones_gineco', e.target.value)}
                    />
                  </div>
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
