
import React, { useState, useRef, useEffect } from 'react';
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Minus, Maximize2, X, Eraser, Copy, CheckCircle } from "lucide-react";
import { FormDataState } from '@/types/historiaClinica';
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";

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
  const [showForm, setShowForm] = useState(true);
  const [sinQuirurgicos, setSinQuirurgicos] = useState(formData.antecedentesQuirurgicos?.sinQuirurgicos || false);
  const [redaccion, setRedaccion] = useState("");
  const [displayedText, setDisplayedText] = useState("");
  const [copied, setCopied] = useState(false);
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

  const handleSinQuirurgicosChange = () => {
    const newValue = !sinQuirurgicos;
    setSinQuirurgicos(newValue);
    handleAntecedenteQuirurgicoChange("sinQuirurgicos", newValue);
    
    if (newValue) {
      // Clear other fields when "sin quirurgicos" is selected
      handleAntecedenteQuirurgicoChange("cirugiasRealizadas", []);
      handleAntecedenteQuirurgicoChange("hospitalizacionesPrevias", "");
      handleAntecedenteQuirurgicoChange("complicacionesAnestesicas", "");
    }
  };

  const agregarCirugia = () => {
    const cirugiasActuales = formData.antecedentesQuirurgicos?.cirugiasRealizadas || [];
    const nuevaCirugia = { 
      tipo: "", 
      fecha: "", 
      motivo: "" 
    };
    handleAntecedenteQuirurgicoChange("cirugiasRealizadas", [...cirugiasActuales, nuevaCirugia]);
  };

  const eliminarCirugia = (index: number) => {
    const cirugiasActuales = formData.antecedentesQuirurgicos?.cirugiasRealizadas || [];
    const nuevasCirugias = cirugiasActuales.filter((_, i) => i !== index);
    handleAntecedenteQuirurgicoChange("cirugiasRealizadas", nuevasCirugias);
  };

  const actualizarCirugia = (index: number, campo: string, valor: string) => {
    const cirugiasActuales = formData.antecedentesQuirurgicos?.cirugiasRealizadas || [];
    const nuevasCirugias = [...cirugiasActuales];
    nuevasCirugias[index] = { ...nuevasCirugias[index], [campo]: valor };
    handleAntecedenteQuirurgicoChange("cirugiasRealizadas", nuevasCirugias);
  };

  const generarRedaccionIA = () => {
    if (sinQuirurgicos) {
      setRedaccion("El paciente niega antecedentes quirúrgicos, no ha sido sometido a cirugías y no refiere hospitalizaciones previas. No presenta historial de complicaciones anestésicas.");
    } else {
      let texto = "Antecedentes quirúrgicos: ";
      
      const cirugias = formData.antecedentesQuirurgicos?.cirugiasRealizadas || [];
      if (cirugias.length > 0) {
        texto += "Paciente con historial quirúrgico que incluye ";
        cirugias.forEach((cirugia, index) => {
          texto += `${cirugia.tipo} (${cirugia.fecha}) por ${cirugia.motivo}`;
          if (index < cirugias.length - 1) texto += ", ";
        });
        texto += ". ";
      } else {
        texto += "Paciente sin cirugías previas. ";
      }
      
      const hospitalizaciones = formData.antecedentesQuirurgicos?.hospitalizacionesPrevias;
      if (hospitalizaciones) {
        texto += `Presenta hospitalizaciones previas: ${hospitalizaciones}. `;
      } else {
        texto += "No registra hospitalizaciones previas. ";
      }
      
      const complicaciones = formData.antecedentesQuirurgicos?.complicacionesAnestesicas;
      if (complicaciones) {
        texto += `Ha presentado las siguientes complicaciones anestésicas: ${complicaciones}.`;
      } else {
        texto += "No refiere complicaciones anestésicas.";
      }

      setRedaccion(texto);
    }
    
    setShowForm(false);
    setProgress(0);
    setDisplayedText("");
  };

  const limpiarFormulario = () => {
    setSinQuirurgicos(false);
    handleAntecedenteQuirurgicoChange("sinQuirurgicos", false);
    handleAntecedenteQuirurgicoChange("cirugiasRealizadas", []);
    handleAntecedenteQuirurgicoChange("hospitalizacionesPrevias", "");
    handleAntecedenteQuirurgicoChange("complicacionesAnestesicas", "");
    setRedaccion("");
    setDisplayedText("");
    setShowForm(true);
    setProgress(0);
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(redaccion);
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };

  // Efecto para la animación de escritura
  useEffect(() => {
    if (!showForm && redaccion) {
      let index = 0;
      const speed = 5; // Velocidad de escritura (más bajo = más rápido)
      
      const interval = setInterval(() => {
        if (index < redaccion.length) {
          setDisplayedText(redaccion.substring(0, index + 1));
          setProgress(Math.round((index / redaccion.length) * 100));
          index++;
        } else {
          clearInterval(interval);
          setProgress(100);
        }
      }, speed);
      
      return () => clearInterval(interval);
    }
  }, [redaccion, showForm]);

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
            <span className="text-gray-400">VI.</span> ANTECEDENTES MÉDICOS Y QUIRÚRGICOS
          </h2>
        </div>

        {!isMinimized && <div className="p-6">
          {showForm ? (
            <div className="space-y-6">
              <div
                className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-100 dark:border-blue-800 w-full text-left cursor-pointer"
                onClick={handleSinQuirurgicosChange}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Label className="text-sm font-medium text-blue-700 dark:text-blue-300">
                      Paciente sin antecedentes quirúrgicos
                    </Label>
                  </div>
                  <Switch
                    id="sin-quirurgicos"
                    checked={sinQuirurgicos}
                    onCheckedChange={handleSinQuirurgicosChange}
                    className="data-[state=checked]:bg-blue-500"
                    onClick={(e) => e.stopPropagation()}
                  />
                </div>
              </div>

              {!sinQuirurgicos && (
                <>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <Label className="text-gray-700 dark:text-gray-300 font-medium">Cirugías realizadas</Label>
                      <Button 
                        type="button" 
                        onClick={agregarCirugia} 
                        variant="outline" 
                        size="sm"
                        className="ml-2"
                      >
                        Agregar cirugía
                      </Button>
                    </div>
                    
                    {(formData.antecedentesQuirurgicos?.cirugiasRealizadas || []).length === 0 && (
                      <p className="text-sm text-gray-500 italic">No se han registrado cirugías</p>
                    )}

                    {(formData.antecedentesQuirurgicos?.cirugiasRealizadas || []).map((cirugia, index) => (
                      <div key={index} className="bg-gray-50 dark:bg-gray-900/50 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                        <div className="flex justify-between items-center mb-2">
                          <h4 className="font-medium">Cirugía #{index + 1}</h4>
                          <Button 
                            type="button" 
                            onClick={() => eliminarCirugia(index)} 
                            variant="destructive" 
                            size="sm"
                          >
                            Eliminar
                          </Button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div>
                            <Label htmlFor={`cirugia-tipo-${index}`}>Tipo de cirugía</Label>
                            <Input
                              id={`cirugia-tipo-${index}`}
                              value={cirugia.tipo || ''}
                              onChange={(e) => actualizarCirugia(index, 'tipo', e.target.value)}
                              placeholder="Ej. Apendicectomía"
                            />
                          </div>
                          <div>
                            <Label htmlFor={`cirugia-fecha-${index}`}>Fecha</Label>
                            <Input
                              id={`cirugia-fecha-${index}`}
                              value={cirugia.fecha || ''}
                              onChange={(e) => actualizarCirugia(index, 'fecha', e.target.value)}
                              placeholder="Ej. Enero 2020"
                            />
                          </div>
                          <div>
                            <Label htmlFor={`cirugia-motivo-${index}`}>Motivo</Label>
                            <Input
                              id={`cirugia-motivo-${index}`}
                              value={cirugia.motivo || ''}
                              onChange={(e) => actualizarCirugia(index, 'motivo', e.target.value)}
                              placeholder="Ej. Apendicitis aguda"
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div>
                    <Label htmlFor="hospitalizaciones" className="text-gray-700 dark:text-gray-300">
                      Hospitalizaciones previas
                    </Label>
                    <Textarea
                      id="hospitalizaciones"
                      value={formData.antecedentesQuirurgicos?.hospitalizacionesPrevias || ''}
                      onChange={(e) => handleAntecedenteQuirurgicoChange("hospitalizacionesPrevias", e.target.value)}
                      placeholder="Describa las hospitalizaciones previas del paciente"
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="complicaciones-anestesicas" className="text-gray-700 dark:text-gray-300">
                      Complicaciones anestésicas
                    </Label>
                    <Textarea
                      id="complicaciones-anestesicas"
                      value={formData.antecedentesQuirurgicos?.complicacionesAnestesicas || ''}
                      onChange={(e) => handleAntecedenteQuirurgicoChange("complicacionesAnestesicas", e.target.value)}
                      placeholder="Describa cualquier complicación anestésica previa"
                      className="mt-1"
                    />
                  </div>
                </>
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
                    transition: 'width 0.005s ease-in-out',
                    width: `${progress}%`,
                    borderRadius: '12px'
                  }}></div>
                </div>
                
                <Textarea
                  value={displayedText}
                  readOnly
                  className="min-h-[100px] text-sm bg-white/50 dark:bg-gray-800/50"
                />
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

export default AntecedentesQuirurgicos;
