
import React, { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Minus, Maximize2, X, Eraser, Copy, CheckCircle } from "lucide-react";
import { FormDataState } from '@/types/historiaClinica';
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";

interface ExamenCabezaProps {
  formData: FormDataState;
  handleExamenCabezaChange: (part: string, value: string | boolean) => void;
}

const ExamenCabeza: React.FC<ExamenCabezaProps> = ({
  formData,
  handleExamenCabezaChange
}) => {
  const [isMinimized, setIsMinimized] = useState(false);
  const [isMaximized, setIsMaximized] = useState(false);
  const [showForm, setShowForm] = useState(true);
  const [sinHallazgos, setSinHallazgos] = useState(formData.examenCabeza?.sinHallazgos || false);
  const [redaccion, setRedaccion] = useState("");
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

  const handleSinHallazgosChange = () => {
    const newValue = !sinHallazgos;
    setSinHallazgos(newValue);
    // Fix the type error by converting the boolean to a string
    handleExamenCabezaChange("sinHallazgos", newValue);
    
    if (newValue) {
      // Clear all sections if no findings
      partesCabeza.forEach(parte => {
        handleExamenCabezaChange(parte.id, "");
      });
    }
  };

  const partesCabeza = [
    { id: "craneo", name: "Cráneo" },
    { id: "cara", name: "Cara" },
    { id: "ojos", name: "Ojos" },
    { id: "oidos", name: "Oídos" },
    { id: "nariz", name: "Nariz" },
    { id: "boca", name: "Boca" },
    { id: "atm", name: "ATM" }
  ];

  const generarRedaccionIA = () => {
    if (sinHallazgos) {
      setRedaccion("Examen de cabeza: A la inspección y palpación, no se observan hallazgos patológicos en cráneo, cara, ojos, oídos, nariz, boca o articulación temporomandibular. Estructuras normales en forma, tamaño y función.");
    } else {
      let texto = "Examen de cabeza:\n\n";
      
      partesCabeza.forEach(parte => {
        const valor = formData.examenCabeza?.[parte.id] || "";
        if (valor) {
          texto += `${parte.name}: ${valor}\n`;
        } else {
          texto += `${parte.name}: Sin hallazgos patológicos. Normocéfalo.\n`;
        }
      });

      setRedaccion(texto);
    }
    
    setShowForm(false);
    setProgress(100);
  };

  const limpiarFormulario = () => {
    setSinHallazgos(false);
    handleExamenCabezaChange("sinHemorragicos", false);
    
    partesCabeza.forEach(parte => {
      handleExamenCabezaChange(parte.id, "");
    });
    
    setRedaccion("");
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
            <span className="text-gray-400">X.</span> EXAMEN DE CABEZA
          </h2>
        </div>

        {!isMinimized && <div className="p-6">
          {showForm ? (
            <div className="space-y-6">
              <div
                className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-100 dark:border-blue-800 w-full text-left cursor-pointer"
                onClick={handleSinHallazgosChange}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Label className="text-sm font-medium text-blue-700 dark:text-blue-300">
                      Sin hallazgos patológicos en cabeza
                    </Label>
                  </div>
                  <Switch
                    id="sin-hallazgos"
                    checked={sinHallazgos}
                    onCheckedChange={handleSinHallazgosChange}
                    className="data-[state=checked]:bg-blue-500"
                    onClick={(e) => e.stopPropagation()}
                  />
                </div>
                {sinHallazgos && (
                  <p className="text-xs text-blue-600 dark:text-blue-400 mt-2 ml-7">
                    No es necesario rellenar las secciones individuales del examen de cabeza.
                  </p>
                )}
              </div>

              {!sinHallazgos && (
                <Tabs defaultValue={partesCabeza[0].id} className="w-full">
                  <TabsList className="grid grid-cols-3 md:grid-cols-7">
                    {partesCabeza.map(parte => (
                      <TabsTrigger key={parte.id} value={parte.id}>
                        {parte.name}
                      </TabsTrigger>
                    ))}
                  </TabsList>
                  
                  {partesCabeza.map(parte => (
                    <TabsContent key={parte.id} value={parte.id} className="p-4 border rounded-md mt-4">
                      <Label htmlFor={`cabeza-${parte.id}`} className="text-gray-700 dark:text-gray-300 font-medium">
                        {parte.name}
                      </Label>
                      <Textarea
                        id={`cabeza-${parte.id}`}
                        value={formData.examenCabeza?.[parte.id] || ''}
                        onChange={(e) => handleExamenCabezaChange(parte.id, e.target.value)}
                        placeholder={`Describa los hallazgos en ${parte.name.toLowerCase()}`}
                        className="mt-2 min-h-[120px]"
                      />
                    </TabsContent>
                  ))}
                </Tabs>
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
                <Textarea
                  value={redaccion}
                  readOnly
                  className="min-h-[200px] text-sm bg-white/50 dark:bg-gray-800/50 whitespace-pre-wrap"
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

export default ExamenCabeza;
