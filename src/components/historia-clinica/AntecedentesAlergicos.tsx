
import React, { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Minus, Maximize2, X, Mic } from "lucide-react";
import { FormDataState } from '@/types/historiaClinica';
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"

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

  const handleCheckboxChange = (field: string, checked: boolean) => {
    if (!handleAntecedenteAlergicoChange) return;
    
    handleAntecedenteAlergicoChange(field, checked);
  };

  const handleInputChange = (field: string, value: string) => {
    if (!handleAntecedenteAlergicoChange) return;
    
    handleAntecedenteAlergicoChange(field, value);
  };

  const handleRadioChange = (field: string, value: string) => {
    if (!handleAntecedenteAlergicoChange) return;
    
    handleAntecedenteAlergicoChange(field, value === 'si');
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
            <span className="text-gray-400">V.</span> ANTECEDENTES ALÉRGICOS
          </h2>
        </div>

        {!isMinimized && activeTab === 'form' && (
          <div className="p-6">
            <div className="space-y-6">
              <div>
                <h3 className="font-medium mb-3">1. ¿Ha presentado alguna reacción alérgica a alguno de los siguientes?</h3>
                <div className="flex flex-wrap gap-6">
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="alergias-medicamentos" 
                      checked={formData?.antecedentesAlergicos?.medicamentos?.es_alergico || false}
                      onCheckedChange={(checked) => handleCheckboxChange('medicamentos.es_alergico', checked === true)}
                    />
                    <Label htmlFor="alergias-medicamentos">Medicamentos</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="alergias-alimentos" 
                      checked={formData?.antecedentesAlergicos?.alimentos?.es_alergico || false}
                      onCheckedChange={(checked) => handleCheckboxChange('alimentos.es_alergico', checked === true)}
                    />
                    <Label htmlFor="alergias-alimentos">Alimentos</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="alergias-ambiental" 
                      checked={formData?.antecedentesAlergicos?.ambiental?.es_alergico || false}
                      onCheckedChange={(checked) => handleCheckboxChange('ambiental.es_alergico', checked === true)}
                    />
                    <Label htmlFor="alergias-ambiental">Entorno ambiental</Label>
                  </div>
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-medium">2. ¿Cuáles?</h3>
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={() => handleRecording('cuales_alergias')}
                    className={`h-8 w-8 rounded-full ${recordingField === 'cuales_alergias' && isRecording ? 'bg-red-100 text-red-500 animate-pulse' : ''}`}
                  >
                    <Mic className="h-4 w-4" />
                  </Button>
                </div>
                <Textarea 
                  placeholder="Detallar las alergias identificadas..." 
                  className="min-h-[80px]" 
                  value={formData?.antecedentesAlergicos?.cuales_alergias || ''}
                  onChange={(e) => handleInputChange('cuales_alergias', e.target.value)}
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-medium">3. ¿A qué específicamente?</h3>
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={() => handleRecording('especificacion_alergias')}
                    className={`h-8 w-8 rounded-full ${recordingField === 'especificacion_alergias' && isRecording ? 'bg-red-100 text-red-500 animate-pulse' : ''}`}
                  >
                    <Mic className="h-4 w-4" />
                  </Button>
                </div>
                <Textarea 
                  placeholder="Especificar detalles sobre las alergias..." 
                  className="min-h-[80px]" 
                  value={formData?.antecedentesAlergicos?.especificacion_alergias || ''}
                  onChange={(e) => handleInputChange('especificacion_alergias', e.target.value)}
                />
              </div>

              <div className="space-y-4">
                <h3 className="font-medium">4. ¿Le han administrado anestesia general y/o local?</h3>
                <RadioGroup 
                  defaultValue={formData?.antecedentesAlergicos?.anestesia_previa ? 'si' : 'no'}
                  onValueChange={(value) => handleRadioChange('anestesia_previa', value)}
                  className="flex space-x-4"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="si" id="anestesia-si" />
                    <Label htmlFor="anestesia-si">Sí</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="no" id="anestesia-no" />
                    <Label htmlFor="anestesia-no">No</Label>
                  </div>
                </RadioGroup>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-medium">5. Especifique el tipo de anestesia y procedimiento:</h3>
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={() => handleRecording('tipo_anestesia')}
                    className={`h-8 w-8 rounded-full ${recordingField === 'tipo_anestesia' && isRecording ? 'bg-red-100 text-red-500 animate-pulse' : ''}`}
                  >
                    <Mic className="h-4 w-4" />
                  </Button>
                </div>
                <Textarea 
                  placeholder="Detallar tipo de anestesia y procedimiento..." 
                  className="min-h-[80px]" 
                  value={formData?.antecedentesAlergicos?.tipo_anestesia || ''}
                  onChange={(e) => handleInputChange('tipo_anestesia', e.target.value)}
                />
              </div>

              <div className="space-y-4">
                <h3 className="font-medium">6. ¿Tuvo alguna reacción adversa a la anestesia?</h3>
                <RadioGroup 
                  defaultValue={formData?.antecedentesAlergicos?.reaccion_anestesia ? 'si' : 'no'}
                  onValueChange={(value) => handleRadioChange('reaccion_anestesia', value)}
                  className="flex space-x-4"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="si" id="reaccion-si" />
                    <Label htmlFor="reaccion-si">Sí</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="no" id="reaccion-no" />
                    <Label htmlFor="reaccion-no">No</Label>
                  </div>
                </RadioGroup>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-medium">7. Si respondió que sí, especifique la reacción:</h3>
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={() => handleRecording('especificacion_reaccion')}
                    className={`h-8 w-8 rounded-full ${recordingField === 'especificacion_reaccion' && isRecording ? 'bg-red-100 text-red-500 animate-pulse' : ''}`}
                  >
                    <Mic className="h-4 w-4" />
                  </Button>
                </div>
                <Textarea 
                  placeholder="Detallar la reacción adversa..." 
                  className="min-h-[80px]" 
                  value={formData?.antecedentesAlergicos?.especificacion_reaccion || ''}
                  onChange={(e) => handleInputChange('especificacion_reaccion', e.target.value)}
                />
              </div>

              <div>
                <h3 className="font-medium mb-3">8. ¿Tiene alguna adicción actual o pasada?</h3>
                <div className="flex flex-wrap gap-6">
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="adiccion-tabaco" 
                      checked={formData?.antecedentesAlergicos?.adiccion_tabaco || false}
                      onCheckedChange={(checked) => handleCheckboxChange('adiccion_tabaco', checked === true)}
                    />
                    <Label htmlFor="adiccion-tabaco">Tabaco</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="adiccion-alcohol" 
                      checked={formData?.antecedentesAlergicos?.adiccion_alcohol || false}
                      onCheckedChange={(checked) => handleCheckboxChange('adiccion_alcohol', checked === true)}
                    />
                    <Label htmlFor="adiccion-alcohol">Alcohol</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="adiccion-drogas" 
                      checked={formData?.antecedentesAlergicos?.adiccion_drogas || false}
                      onCheckedChange={(checked) => handleCheckboxChange('adiccion_drogas', checked === true)}
                    />
                    <Label htmlFor="adiccion-drogas">Drogas</Label>
                  </div>
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-medium">9. Especifique tipo, frecuencia y duración:</h3>
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={() => handleRecording('detalles_adiccion')}
                    className={`h-8 w-8 rounded-full ${recordingField === 'detalles_adiccion' && isRecording ? 'bg-red-100 text-red-500 animate-pulse' : ''}`}
                  >
                    <Mic className="h-4 w-4" />
                  </Button>
                </div>
                <Textarea 
                  placeholder="Detallar tipo, frecuencia y duración de las adicciones..." 
                  className="min-h-[80px]" 
                  value={formData?.antecedentesAlergicos?.detalles_adiccion || ''}
                  onChange={(e) => handleInputChange('detalles_adiccion', e.target.value)}
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

export default AntecedentesAlergicos;
