
import React, { useState, useRef } from 'react';
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Minus, Maximize2, X, Eraser, Copy, CheckCircle } from "lucide-react";
import { FormDataState } from '@/types/historiaClinica';
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";

interface AntecedentesPersonalesPatologicosProps {
  formData: FormDataState;
  handleAntecedentePatologicoChange: (field: string, value: any) => void;
}

const AntecedentesPersonalesPatologicos: React.FC<AntecedentesPersonalesPatologicosProps> = ({
  formData,
  handleAntecedentePatologicoChange
}) => {
  const [isMinimized, setIsMinimized] = useState(false);
  const [isMaximized, setIsMaximized] = useState(false);
  const [showForm, setShowForm] = useState(true);
  const [redacciones, setRedacciones] = useState({
    enfermedadesCronicas: "",
    hospitalizaciones: "",
    intervencionesMedicas: "",
    traumatismos: ""
  });
  const [copied, setCopied] = useState<Record<string, boolean>>({});
  const formRef = useRef<HTMLDivElement>(null);
  const redaccionesRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);

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

  const generarRedaccionIA = () => {
    // Implement AI text generation logic for each section
    const enfermedadesCronicasText = generateEnfermedadesCronicasText();
    const hospitalizacionesText = generateHospitalizacionesText();
    const intervencionesMedicasText = generateIntervencionesMedicasText();
    const traumatismosText = generateTraumatismosText();

    setRedacciones({
      enfermedadesCronicas: enfermedadesCronicasText,
      hospitalizaciones: hospitalizacionesText,
      intervencionesMedicas: intervencionesMedicasText,
      traumatismos: traumatismosText
    });

    setShowForm(false);
    setProgress(100);
  };

  const generateEnfermedadesCronicasText = () => {
    return "El paciente presenta antecedentes de enfermedades crónicas como [lista de enfermedades]. Estas condiciones han sido controladas mediante [tipo de tratamiento] con un apego al tratamiento [bueno/regular/malo]. Es importante considerar estas condiciones en el plan de tratamiento dental debido a su potencial impacto en la salud bucal y las consideraciones farmacológicas.";
  };

  const generateHospitalizacionesText = () => {
    return "Respecto a hospitalizaciones previas, el paciente reporta [número] ingresos hospitalarios, el más reciente hace [tiempo], debido a [causa]. Durante estas hospitalizaciones, [recibió/no recibió] tratamiento de emergencia que podría tener relevancia en su condición oral actual.";
  };

  const generateIntervencionesMedicasText = () => {
    return "El paciente ha sido sometido a procedimientos médicos que incluyen [lista de procedimientos], los cuales [tienen/no tienen] repercusión directa en su condición bucal actual. [Descripción de cualquier complicación relevante].";
  };

  const generateTraumatismosText = () => {
    return "Respecto a traumatismos, el paciente refiere [descripción del trauma], ocurrido hace [tiempo], que resultó en [consecuencias]. Este antecedente [influye/no influye] en su condición oral actual, específicamente en [áreas afectadas si aplica].";
  };

  const adjustTextareaHeight = (element: HTMLTextAreaElement) => {
    element.style.height = "auto";
    element.style.height = element.scrollHeight + "px";
  };

  const handleCopy = (section: string) => {
    navigator.clipboard.writeText(redacciones[section]);
    setCopied(prev => ({
      ...prev,
      [section]: true
    }));
    setTimeout(() => setCopied(prev => ({
      ...prev,
      [section]: false
    })), 2000);
  };

  const limpiarFormulario = () => {
    // Implement logic to clear the form
    setShowForm(true);
    setRedacciones({
      enfermedadesCronicas: "",
      hospitalizaciones: "",
      intervencionesMedicas: "",
      traumatismos: ""
    });
    setProgress(0);
  };

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

        <div ref={redaccionesRef} className="flex justify-start px-6 py-2">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <span className="text-gray-400">IV.</span> ANTECEDENTES PERSONALES PATOLÓGICOS
          </h2>
        </div>

        {!isMinimized && <div className="p-6" ref={formRef}>
          {showForm ? (
            <div className="space-y-6">
              <div className="bg-gray-50/50 dark:bg-gray-900/50 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                <h4 className="text-lg font-semibold mb-2 text-justify">Enfermedades Crónicas</h4>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>¿Padece alguna enfermedad crónica?</Label>
                    <div className="flex items-center space-x-2 mt-2">
                      <Switch id="has-chronic-disease" />
                      <Label htmlFor="has-chronic-disease">Sí, padezco enfermedad(es) crónica(s)</Label>
                    </div>
                  </div>
                  <div>
                    <Label>Enfermedades crónicas que padece</Label>
                    <Textarea 
                      placeholder="Describa las enfermedades crónicas que padece..." 
                      className="mt-1 h-24"
                    />
                  </div>
                  <div>
                    <Label>Control de la enfermedad</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccione una opción" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="bueno">Bueno</SelectItem>
                        <SelectItem value="regular">Regular</SelectItem>
                        <SelectItem value="malo">Malo</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Apego al tratamiento</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccione una opción" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="estricto">Estricto</SelectItem>
                        <SelectItem value="regular">Regular</SelectItem>
                        <SelectItem value="malo">Malo</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50/50 dark:bg-gray-900/50 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                <h4 className="text-lg font-semibold mb-2 text-justify">Hospitalizaciones Previas</h4>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>¿Ha sido hospitalizado previamente?</Label>
                    <div className="flex items-center space-x-2 mt-2">
                      <Switch id="has-hospitalizations" />
                      <Label htmlFor="has-hospitalizations">Sí, he sido hospitalizado</Label>
                    </div>
                  </div>
                  <div>
                    <Label>Número de hospitalizaciones</Label>
                    <Input type="number" min="0" className="mt-1" />
                  </div>
                  <div>
                    <Label>Motivo de la última hospitalización</Label>
                    <Textarea 
                      placeholder="Describa el motivo de su última hospitalización..." 
                      className="mt-1 h-24"
                    />
                  </div>
                  <div>
                    <Label>Fecha de la última hospitalización</Label>
                    <Input type="date" className="mt-1" />
                  </div>
                </div>
              </div>

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
                  className="border-gray-300 text-slate-100 font-semibold bg-[#ff0000]"
                >
                  Limpiar Formulario
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {progress === 100 && (
                <>
                  <div className="bg-gray-50/50 dark:bg-gray-900/50 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="text-lg font-semibold">Enfermedades Crónicas</h4>
                      <button 
                        onClick={() => handleCopy('enfermedadesCronicas')} 
                        className="flex items-center gap-1 text-sm text-blue-500 hover:text-blue-700"
                      >
                        {copied.enfermedadesCronicas ? (
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
                    <Textarea 
                      value={redacciones.enfermedadesCronicas} 
                      readOnly 
                      className="min-h-[100px] text-sm bg-white/50 dark:bg-gray-800/50" 
                      onFocus={e => adjustTextareaHeight(e.currentTarget)} 
                    />
                  </div>

                  <div className="bg-gray-50/50 dark:bg-gray-900/50 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="text-lg font-semibold">Hospitalizaciones</h4>
                      <button 
                        onClick={() => handleCopy('hospitalizaciones')} 
                        className="flex items-center gap-1 text-sm text-blue-500 hover:text-blue-700"
                      >
                        {copied.hospitalizaciones ? (
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
                    <Textarea 
                      value={redacciones.hospitalizaciones} 
                      readOnly 
                      className="min-h-[100px] text-sm bg-white/50 dark:bg-gray-800/50" 
                      onFocus={e => adjustTextareaHeight(e.currentTarget)} 
                    />
                  </div>

                  <div className="bg-gray-50/50 dark:bg-gray-900/50 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="text-lg font-semibold">Intervenciones Médicas</h4>
                      <button 
                        onClick={() => handleCopy('intervencionesMedicas')} 
                        className="flex items-center gap-1 text-sm text-blue-500 hover:text-blue-700"
                      >
                        {copied.intervencionesMedicas ? (
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
                    <Textarea 
                      value={redacciones.intervencionesMedicas} 
                      readOnly 
                      className="min-h-[100px] text-sm bg-white/50 dark:bg-gray-800/50" 
                      onFocus={e => adjustTextareaHeight(e.currentTarget)} 
                    />
                  </div>

                  <div className="bg-gray-50/50 dark:bg-gray-900/50 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="text-lg font-semibold">Traumatismos</h4>
                      <button 
                        onClick={() => handleCopy('traumatismos')} 
                        className="flex items-center gap-1 text-sm text-blue-500 hover:text-blue-700"
                      >
                        {copied.traumatismos ? (
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
                    <Textarea 
                      value={redacciones.traumatismos} 
                      readOnly 
                      className="min-h-[100px] text-sm bg-white/50 dark:bg-gray-800/50" 
                      onFocus={e => adjustTextareaHeight(e.currentTarget)} 
                    />
                  </div>

                  <div className="flex justify-center gap-4 mt-6">
                    <Button 
                      onClick={() => setShowForm(true)} 
                      variant="outline" 
                      className="border-gray-300 text-gray-700"
                    >
                      Volver al Formulario
                    </Button>
                  </div>
                </>
              )}
            </div>
          )}
        </div>}
      </Card>
    </div>
  );
};

export default AntecedentesPersonalesPatologicos;
