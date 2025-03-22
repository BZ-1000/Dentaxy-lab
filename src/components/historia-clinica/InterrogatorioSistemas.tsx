
import React, { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Minus, Maximize2, X, Eraser, Copy, CheckCircle } from "lucide-react";
import { FormDataState } from '@/types/historiaClinica';
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Typewriter } from "@/components/ui/typewriter-text";

interface InterrogatorioSistemasProps {
  formData: FormDataState;
  handleInterrogatorioChange: (system: string, value: string) => void;
}

const InterrogatorioSistemas: React.FC<InterrogatorioSistemasProps> = ({
  formData,
  handleInterrogatorioChange
}) => {
  const [isMinimized, setIsMinimized] = useState(false);
  const [isMaximized, setIsMaximized] = useState(false);
  const [showForm, setShowForm] = useState(true);
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

  const sistemas = [
    { id: "cardiovascular", name: "Cardiovascular" },
    { id: "respiratorio", name: "Respiratorio" },
    { id: "digestivo", name: "Digestivo" },
    { id: "urinario", name: "Urinario" },
    { id: "musculoEsqueletico", name: "Músculo-Esquelético" },
    { id: "nervioso", name: "Nervioso" },
    { id: "endocrino", name: "Endocrino" },
    { id: "tegumentario", name: "Tegumentario" }
  ];

  const generarRedaccionIA = () => {
    let texto = "Interrogatorio por aparatos y sistemas:\n\n";
    
    sistemas.forEach(sistema => {
      const valor = formData.interrogatorioSistemas?.[sistema.id] || "";
      if (valor) {
        texto += `${sistema.name}: ${valor}\n`;
      } else {
        texto += `${sistema.name}: Sin alteraciones aparentes. `;
      }
    });

    setRedaccion(texto);
    setShowForm(false);
    setProgress(0);
    setIsTypingComplete(false);
  };

  const limpiarFormulario = () => {
    sistemas.forEach(sistema => {
      handleInterrogatorioChange(sistema.id, "");
    });
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
            <span className="text-gray-400">VIII.</span> INTERROGATORIO POR APARATOS Y SISTEMAS
          </h2>
        </div>

        {!isMinimized && <div className="p-6">
          {showForm ? (
            <div className="space-y-6">
              <Tabs defaultValue={sistemas[0].id} className="w-full">
                <TabsList className="grid grid-cols-4 md:grid-cols-8">
                  {sistemas.map(sistema => (
                    <TabsTrigger key={sistema.id} value={sistema.id}>
                      {sistema.name}
                    </TabsTrigger>
                  ))}
                </TabsList>
                
                {sistemas.map(sistema => (
                  <TabsContent key={sistema.id} value={sistema.id} className="p-4 border rounded-md mt-4">
                    <Label htmlFor={`sistema-${sistema.id}`} className="text-gray-700 dark:text-gray-300 font-medium">
                      Sistema {sistema.name}
                    </Label>
                    <Textarea
                      id={`sistema-${sistema.id}`}
                      value={formData.interrogatorioSistemas?.[sistema.id] || ''}
                      onChange={(e) => handleInterrogatorioChange(sistema.id, e.target.value)}
                      placeholder={`Describa los hallazgos del sistema ${sistema.name.toLowerCase()}`}
                      className="mt-2 min-h-[120px]"
                    />
                  </TabsContent>
                ))}
              </Tabs>

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
                
                <div className="min-h-[300px] p-3 text-sm bg-white/50 dark:bg-gray-800/50 whitespace-pre-wrap rounded border border-gray-200 dark:border-gray-700">
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

export default InterrogatorioSistemas;
