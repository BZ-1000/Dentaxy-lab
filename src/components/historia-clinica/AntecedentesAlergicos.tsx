
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
  const [showForm, setShowForm] = useState(true);
  const [redacciones, setRedacciones] = useState({
    alergiaMedicamentos: "",
    alergiaAlimentos: "",
    alergiaAmbiental: "",
    alergiaLatex: ""
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
    const alergiaMedicamentosText = generateAlergiaMedicamentosText();
    const alergiaAlimentosText = generateAlergiaAlimentosText();
    const alergiaAmbientalText = generateAlergiaAmbientalText();
    const alergiaLatexText = generateAlergiaLatexText();

    setRedacciones({
      alergiaMedicamentos: alergiaMedicamentosText,
      alergiaAlimentos: alergiaAlimentosText,
      alergiaAmbiental: alergiaAmbientalText,
      alergiaLatex: alergiaLatexText
    });

    setShowForm(false);
    setProgress(100);
  };

  const generateAlergiaMedicamentosText = () => {
    return "El paciente refiere [tener/no tener] antecedentes de alergia a medicamentos. Específicamente, menciona alergia a [nombres de medicamentos], con manifestaciones clínicas que incluyen [síntomas de reacción]. La última reacción alérgica a medicamentos ocurrió hace [tiempo], con una severidad [leve/moderada/grave] que [requirió/no requirió] atención médica de emergencia.";
  };

  const generateAlergiaAlimentosText = () => {
    return "En cuanto a alergias alimentarias, el paciente [presenta/no presenta] reacciones a [alimentos específicos]. Las manifestaciones incluyen [síntomas], con una severidad [leve/moderada/grave]. Estas alergias [han sido/no han sido] confirmadas mediante pruebas específicas.";
  };

  const generateAlergiaAmbientalText = () => {
    return "El paciente refiere [presencia/ausencia] de alergias ambientales, específicamente a [alérgenos ambientales como polen, ácaros, etc.]. Estas alergias se manifiestan principalmente en [épocas del año] y causan síntomas como [síntomas específicos], que son manejados mediante [tratamiento o medidas preventivas].";
  };

  const generateAlergiaLatexText = () => {
    return "Respecto a la alergia al látex, el paciente [presenta/no presenta] reacciones al contacto con este material. Esta información es particularmente relevante en el contexto odontológico dado el uso frecuente de guantes y otros materiales que contienen látex. [Detalles adicionales sobre reacciones anteriores si las ha habido].";
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
      alergiaMedicamentos: "",
      alergiaAlimentos: "",
      alergiaAmbiental: "",
      alergiaLatex: ""
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
            <span className="text-gray-400">V.</span> ANTECEDENTES ALÉRGICOS
          </h2>
        </div>

        {!isMinimized && <div className="p-6" ref={formRef}>
          {showForm ? (
            <div className="space-y-6">
              <div className="bg-gray-50/50 dark:bg-gray-900/50 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                <h4 className="text-lg font-semibold mb-2 text-justify">Alergia a Medicamentos</h4>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>¿Es alérgico a algún medicamento?</Label>
                    <div className="flex items-center space-x-2 mt-2">
                      <Switch id="has-med-allergy" />
                      <Label htmlFor="has-med-allergy">Sí, tengo alergia a medicamentos</Label>
                    </div>
                  </div>
                  <div>
                    <Label>Medicamentos a los que es alérgico</Label>
                    <Textarea 
                      placeholder="Liste los medicamentos a los que es alérgico..." 
                      className="mt-1 h-24"
                    />
                  </div>
                  <div>
                    <Label>Tipo de reacción</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccione una opción" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="cutanea">Cutánea (erupciones, urticaria)</SelectItem>
                        <SelectItem value="respiratoria">Respiratoria (dificultad para respirar)</SelectItem>
                        <SelectItem value="digestiva">Digestiva (náuseas, vómitos)</SelectItem>
                        <SelectItem value="anafilaxia">Anafilaxia</SelectItem>
                        <SelectItem value="otra">Otra</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Severidad de la reacción</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccione una opción" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="leve">Leve</SelectItem>
                        <SelectItem value="moderada">Moderada</SelectItem>
                        <SelectItem value="grave">Grave</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50/50 dark:bg-gray-900/50 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                <h4 className="text-lg font-semibold mb-2 text-justify">Alergia a Alimentos</h4>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>¿Es alérgico a algún alimento?</Label>
                    <div className="flex items-center space-x-2 mt-2">
                      <Switch id="has-food-allergy" />
                      <Label htmlFor="has-food-allergy">Sí, tengo alergia a alimentos</Label>
                    </div>
                  </div>
                  <div>
                    <Label>Alimentos a los que es alérgico</Label>
                    <Textarea 
                      placeholder="Liste los alimentos a los que es alérgico..." 
                      className="mt-1 h-24"
                    />
                  </div>
                </div>
              </div>

              <div className="bg-gray-50/50 dark:bg-gray-900/50 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                <h4 className="text-lg font-semibold mb-2 text-justify">Alergia al Látex</h4>
                
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <Label>¿Es alérgico al látex?</Label>
                    <div className="flex items-center space-x-2 mt-2">
                      <Switch id="has-latex-allergy" />
                      <Label htmlFor="has-latex-allergy">Sí, tengo alergia al látex</Label>
                    </div>
                  </div>
                  <div>
                    <Label>Describa su reacción al látex</Label>
                    <Textarea 
                      placeholder="Describa su reacción al látex..." 
                      className="mt-1 h-24"
                    />
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
                      <h4 className="text-lg font-semibold">Alergia a Medicamentos</h4>
                      <button 
                        onClick={() => handleCopy('alergiaMedicamentos')} 
                        className="flex items-center gap-1 text-sm text-blue-500 hover:text-blue-700"
                      >
                        {copied.alergiaMedicamentos ? (
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
                      value={redacciones.alergiaMedicamentos} 
                      readOnly 
                      className="min-h-[100px] text-sm bg-white/50 dark:bg-gray-800/50" 
                      onFocus={e => adjustTextareaHeight(e.currentTarget)} 
                    />
                  </div>

                  <div className="bg-gray-50/50 dark:bg-gray-900/50 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="text-lg font-semibold">Alergia a Alimentos</h4>
                      <button 
                        onClick={() => handleCopy('alergiaAlimentos')} 
                        className="flex items-center gap-1 text-sm text-blue-500 hover:text-blue-700"
                      >
                        {copied.alergiaAlimentos ? (
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
                      value={redacciones.alergiaAlimentos} 
                      readOnly 
                      className="min-h-[100px] text-sm bg-white/50 dark:bg-gray-800/50" 
                      onFocus={e => adjustTextareaHeight(e.currentTarget)} 
                    />
                  </div>

                  <div className="bg-gray-50/50 dark:bg-gray-900/50 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="text-lg font-semibold">Alergia Ambiental</h4>
                      <button 
                        onClick={() => handleCopy('alergiaAmbiental')} 
                        className="flex items-center gap-1 text-sm text-blue-500 hover:text-blue-700"
                      >
                        {copied.alergiaAmbiental ? (
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
                      value={redacciones.alergiaAmbiental} 
                      readOnly 
                      className="min-h-[100px] text-sm bg-white/50 dark:bg-gray-800/50" 
                      onFocus={e => adjustTextareaHeight(e.currentTarget)} 
                    />
                  </div>

                  <div className="bg-gray-50/50 dark:bg-gray-900/50 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="text-lg font-semibold">Alergia al Látex</h4>
                      <button 
                        onClick={() => handleCopy('alergiaLatex')} 
                        className="flex items-center gap-1 text-sm text-blue-500 hover:text-blue-700"
                      >
                        {copied.alergiaLatex ? (
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
                      value={redacciones.alergiaLatex} 
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

export default AntecedentesAlergicos;
