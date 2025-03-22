
import React, { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Minus, Maximize2, X, Eraser, Copy, CheckCircle } from "lucide-react";
import { FormDataState } from '@/types/historiaClinica';
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Typewriter } from "@/components/ui/typewriter-text";

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
  const [showForm, setShowForm] = useState(true);
  const [sinHemorragicos, setSinHemorragicos] = useState(formData.antecedentesHemorragicos?.sinHemorragicos || false);
  const [redaccion, setRedaccion] = useState("");
  const [copied, setCopied] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isTypingComplete, setIsTypingComplete] = useState(false);

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

  const handleSinHemorragicosChange = () => {
    const newValue = !sinHemorragicos;
    setSinHemorragicos(newValue);
    handleAntecedenteHemorragicoChange("sinHemorragicos", newValue);
    
    if (newValue) {
      // Clear other fields when "sin hemorragicos" is selected
      handleAntecedenteHemorragicoChange("sangradoProlongado", "no");
      handleAntecedenteHemorragicoChange("hematomas", "no");
      handleAntecedenteHemorragicoChange("hemorragiasEspontaneas", "no");
      handleAntecedenteHemorragicoChange("transfusiones", "no");
      handleAntecedenteHemorragicoChange("detallesAdicionales", "");
    }
  };

  const generarRedaccionIA = () => {
    if (sinHemorragicos) {
      setRedaccion("El paciente niega antecedentes hemorrágicos. No reporta episodios de sangrado prolongado tras procedimientos quirúrgicos o dentales, ausencia de hematomas fáciles, sin aparición de hemorragias espontáneas y sin historia de transfusiones sanguíneas.");
    } else {
      let texto = "Antecedentes hemorrágicos: ";
      
      if (formData.antecedentesHemorragicos?.sangradoProlongado === "si") {
        texto += "El paciente refiere episodios de sangrado prolongado después de procedimientos quirúrgicos o dentales. ";
      } else {
        texto += "El paciente niega sangrado prolongado después de procedimientos quirúrgicos o dentales. ";
      }
      
      if (formData.antecedentesHemorragicos?.hematomas === "si") {
        texto += "Presenta tendencia a la formación de hematomas con facilidad. ";
      } else {
        texto += "No presenta tendencia a la formación de hematomas con facilidad. ";
      }
      
      if (formData.antecedentesHemorragicos?.hemorragiasEspontaneas === "si") {
        texto += "Refiere episodios de hemorragias espontáneas. ";
      } else {
        texto += "Niega episodios de hemorragias espontáneas. ";
      }
      
      if (formData.antecedentesHemorragicos?.transfusiones === "si") {
        texto += "Tiene antecedentes de transfusiones sanguíneas. ";
      } else {
        texto += "Sin antecedentes de transfusiones sanguíneas. ";
      }

      if (formData.antecedentesHemorragicos?.detallesAdicionales) {
        texto += `Información adicional: ${formData.antecedentesHemorragicos.detallesAdicionales}`;
      }

      setRedaccion(texto);
    }
    
    setShowForm(false);
    setProgress(0);
    setIsTypingComplete(false);
  };

  const limpiarFormulario = () => {
    setSinHemorragicos(false);
    handleAntecedenteHemorragicoChange("sinHemorragicos", false);
    handleAntecedenteHemorragicoChange("sangradoProlongado", "no");
    handleAntecedenteHemorragicoChange("hematomas", "no");
    handleAntecedenteHemorragicoChange("hemorragiasEspontaneas", "no");
    handleAntecedenteHemorragicoChange("transfusiones", "no");
    handleAntecedenteHemorragicoChange("detallesAdicionales", "");
    setRedaccion("");
    setShowForm(true);
    setProgress(0);
    setIsTypingComplete(false);
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(redaccion);
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };

  const handleTypingComplete = () => {
    setProgress(100);
    setIsTypingComplete(true);
  };

  const HemorragiaItem = ({ label, value, field }: { label: string, value: string, field: string }) => (
    <div className="bg-gray-50 dark:bg-gray-900/50 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
      <Label className="text-gray-700 dark:text-gray-300 font-medium mb-2">{label}</Label>
      <RadioGroup 
        value={value} 
        onValueChange={(newValue) => handleAntecedenteHemorragicoChange(field, newValue)}
        className="flex gap-4 mt-2"
      >
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="si" id={`${field}-si`} />
          <Label htmlFor={`${field}-si`}>Sí</Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="no" id={`${field}-no`} />
          <Label htmlFor={`${field}-no`}>No</Label>
        </div>
      </RadioGroup>
    </div>
  );

  return (
    <div className={`max-w-4xl mx-auto transition-all duration-300 ${isMaximized ? "fixed inset-4 z-50" : ""}`}>
      <Card className={`bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-lg rounded-xl border-0 ${isMaximized ? "h-[calc(100vh-2rem)] overflow-y-auto" : ""}`}>
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex justify-center w-full">
            <div className="flex bg-gray-200 dark:bg-gray-700 rounded-full p-1">
              <button
                onClick={() => setShowForm(true)}
                className={`px-5 py-1.5 rounded-full transition-all duration-300 text-sm ${showForm ? "bg-blue-500 text-white shadow-md" : "text-gray-700 dark:text-gray-300"}`}
              >
                Formulario
              </button>
              <button
                onClick={() => setShowForm(false)}
                className={`px-5 py-1.5 rounded-full transition-all duration-300 text-sm ${!showForm ? "bg-blue-500 text-white shadow-md" : "text-gray-700 dark:text-gray-300"}`}
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

        {!isMinimized && <div className="p-6">
          {showForm ? (
            <div className="space-y-6">
              <div
                className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-100 dark:border-blue-800 w-full text-left cursor-pointer"
                onClick={handleSinHemorragicosChange}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Label className="text-sm font-medium text-blue-700 dark:text-blue-300">
                      Paciente sin antecedentes hemorrágicos
                    </Label>
                  </div>
                  <Switch
                    id="sin-hemorragicos"
                    checked={sinHemorragicos}
                    onCheckedChange={handleSinHemorragicosChange}
                    className="data-[state=checked]:bg-blue-500"
                    onClick={(e) => e.stopPropagation()}
                  />
                </div>
              </div>

              {!sinHemorragicos && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <HemorragiaItem 
                    label="¿Sangrado prolongado después de procedimientos quirúrgicos o dentales?" 
                    value={formData.antecedentesHemorragicos?.sangradoProlongado || "no"} 
                    field="sangradoProlongado" 
                  />
                  
                  <HemorragiaItem 
                    label="¿Hematomas con facilidad?" 
                    value={formData.antecedentesHemorragicos?.hematomas || "no"} 
                    field="hematomas" 
                  />
                  
                  <HemorragiaItem 
                    label="¿Hemorragias espontáneas?" 
                    value={formData.antecedentesHemorragicos?.hemorragiasEspontaneas || "no"} 
                    field="hemorragiasEspontaneas" 
                  />
                  
                  <HemorragiaItem 
                    label="¿Antecedentes de transfusiones sanguíneas?" 
                    value={formData.antecedentesHemorragicos?.transfusiones || "no"} 
                    field="transfusiones" 
                  />

                  <div className="col-span-1 md:col-span-2">
                    <Label htmlFor="detalles-adicionales" className="text-gray-700 dark:text-gray-300">
                      Detalles adicionales
                    </Label>
                    <Textarea
                      id="detalles-adicionales"
                      value={formData.antecedentesHemorragicos?.detallesAdicionales || ''}
                      onChange={(e) => handleAntecedenteHemorragicoChange("detallesAdicionales", e.target.value)}
                      placeholder="Ingrese cualquier detalle adicional relacionado con antecedentes hemorrágicos"
                      className="mt-1"
                    />
                  </div>
                </div>
              )}

              <div className="flex justify-center gap-4 mt-6">
                <Button
                  onClick={generarRedaccionIA}
                  className="bg-blue-500 hover:bg-blue-600 text-white"
                >
                  Generar Redacción IA
                </Button>
                <Button
                  onClick={limpiarFormulario}
                  variant="outline"
                  className="border-gray-300 text-gray-700 dark:text-gray-300"
                >
                  Limpiar Formulario
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="bg-gray-50/50 dark:bg-gray-900/50 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                <div className="flex justify-between items-center mb-2">
                  <h4 className="text-lg font-semibold">Redacción</h4>
                  <button
                    onClick={handleCopy}
                    className="flex items-center gap-1 text-sm text-blue-500 hover:text-blue-700"
                  >
                    {copied ? (
                      <>
                        <CheckCircle className="w-4 h-4" />
                        <span>Copiado</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4" />
                        <span>Copiar</span>
                      </>
                    )}
                  </button>
                </div>
                
                {/* Barra de progreso para la animación */}
                <div className="progress-bar-container" style={{
                  width: '100%', 
                  backgroundColor: '#d3d3d3', 
                  borderRadius: '12px',
                  overflow: 'hidden',
                  marginBottom: '1rem',
                  boxShadow: 'inset 0 1px 2px rgba(0, 0, 0, 0.1)'
                }}>
                  <div className="progress-bar" style={{
                    height: '8px', 
                    backgroundColor: '#34c759',
                    transition: 'width 0.5s ease-in-out',
                    width: `${progress}%`,
                    borderRadius: '12px'
                  }}></div>
                </div>
                
                <div className="min-h-[100px] p-3 text-sm bg-white/50 dark:bg-gray-800/50 whitespace-pre-wrap rounded border border-gray-200 dark:border-gray-700">
                  <Typewriter 
                    text={redaccion}
                    speed={5}
                    cursor={null}
                    onComplete={handleTypingComplete}
                    className="whitespace-pre-wrap"
                  />
                </div>
              </div>

              <div className="flex justify-center">
                <Button
                  onClick={() => setShowForm(true)}
                  variant="outline"
                  className="border-gray-300 text-gray-700 dark:text-gray-300"
                >
                  Volver al Formulario
                </Button>
              </div>
            </div>
          )}
        </div>}
      </Card>
    </div>
  );
};

export default AntecedentesHemorragicos;
