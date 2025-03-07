
import React, { useState, useRef, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { VoiceInput } from "@/components/ui/voice-input";
import { Minus, Maximize2, X, Eraser, Copy, CheckCircle } from "lucide-react";
import { FormDataState } from "@/types/historiaClinica";

interface AntecedentesHemorragicosProps {
  formData: FormDataState;
  handleInputChange: (field: string, value: string) => void;
}

const AntecedentesHemorragicos = ({ formData, handleInputChange }: AntecedentesHemorragicosProps) => {
  const [isMinimized, setIsMinimized] = useState(false);
  const [isMaximized, setIsMaximized] = useState(false);
  const [showRedaccion, setShowRedaccion] = useState(false);
  const [redaccionIA, setRedaccionIA] = useState("");
  const [displayedText, setDisplayedText] = useState("");
  const [progress, setProgress] = useState(0);
  const [copied, setCopied] = useState(false);
  const redaccionRef = useRef(null);

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
    const antecedentesHemorragicos = formData.antecedentesHemorragicos || "";
    
    let textoGenerado = "";
    if (!antecedentesHemorragicos || antecedentesHemorragicos.trim() === "") {
      textoGenerado = "El paciente niega antecedentes de trastornos hemorrágicos o problemas de coagulación.";
    } else {
      textoGenerado = `El paciente refiere los siguientes antecedentes hemorrágicos: ${antecedentesHemorragicos}`;
    }

    setRedaccionIA(textoGenerado);
    setShowRedaccion(true);
    
    setTimeout(() => {
      redaccionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setTimeout(() => {
        window.scrollBy(0, -200);
      }, 300);
    }, 100);
  };

  const limpiarFormulario = () => {
    handleInputChange("antecedentesHemorragicos", "");
    setRedaccionIA("");
    setShowRedaccion(false);
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(redaccionIA);
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };

  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      if (index < redaccionIA.length) {
        setDisplayedText(redaccionIA.substring(0, index + 1));
        setProgress((index / redaccionIA.length) * 100);
        index++;
      } else {
        clearInterval(interval);
      }
    }, 15);

    return () => clearInterval(interval);
  }, [redaccionIA]);

  return (
    <div className={`max-w-4xl mx-auto transition-all duration-300 ${isMaximized ? "fixed inset-4 z-50" : ""}`}>
      <Card className={`bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-lg rounded-xl border-0 ${isMaximized ? "h-[calc(100vh-2rem)] overflow-y-auto" : ""}`}>
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex justify-center w-full">
            <div className="flex bg-gray-200 dark:bg-gray-700 rounded-full p-1">
              <button
                onClick={() => setShowRedaccion(false)}
                className={`px-5 py-1.5 rounded-full transition-all duration-300 text-sm ${!showRedaccion ? "bg-blue-500 text-white shadow-md" : "text-gray-700 dark:text-gray-300"}`}
              >
                Formulario
              </button>
              <button
                onClick={() => setShowRedaccion(true)}
                className={`px-5 py-1.5 rounded-full transition-all duration-300 text-sm ${showRedaccion ? "bg-blue-500 text-white shadow-md" : "text-gray-700 dark:text-gray-300"}`}
              >
                Redacción IA
              </button>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button onClick={handleMinimize} className="p-1 rounded-full bg-green-100 text-green-600 hover:bg-green-200 transition-colors" aria-label={isMinimized ? "Expandir" : "Minimizar"}>
              <Minus className="w-4 h-4" />
            </button>
            <button onClick={handleMaximize} className="p-1 rounded-full bg-yellow-100 text-yellow-600 hover:bg-yellow-200 transition-colors" aria-label={isMaximized ? "Restaurar" : "Maximizar"}>
              <Maximize2 className="w-4 h-4" />
            </button>
            <button onClick={handleClose} className="p-1 rounded-full bg-red-100 text-red-600 hover:bg-red-200 transition-colors" aria-label="Cerrar">
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="flex justify-start px-6 py-2">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <span className="text-gray-400">VII.</span> Antecedentes Hemorrágicos
          </h2>
        </div>

        {!isMinimized && (
          <>
            {showRedaccion ? (
              <div ref={redaccionRef} className="p-6">
                <Label className="font-mono text-sm font-medium text-gray-800">
                  Redacción IA...
                </Label>
                <div
                  className="progress-bar-container"
                  style={{
                    width: '100%',
                    backgroundColor: '#d3d3d3',
                    borderRadius: '12px',
                    overflow: 'hidden',
                    marginBottom: '1rem',
                    boxShadow: 'inset 0 1px 2px rgba(0, 0, 0, 0.1)',
                  }}
                >
                  <div
                    className="progress-bar"
                    style={{
                      height: '8px',
                      backgroundColor: '#34c759',
                      transition: 'width 0.015s ease-in-out',
                      width: `${progress}%`,
                      borderRadius: '12px',
                    }}
                  ></div>
                </div>
                <div
                  className="min-h-[200px] w-full bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700 p-3 rounded-md"
                  style={{ whiteSpace: 'pre-wrap', wordWrap: 'break-word' }}
                >
                  {displayedText}
                </div>

                <Button
                  onClick={handleCopy}
                  className="mt-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 flex items-center gap-2 relative"
                >
                  <Copy className="w-4 h-4" />
                  <span>Copiar Redacción</span>
                  {copied && (
                    <div className="absolute -top-8 left-0 bg-green-500 text-white text-sm rounded-lg px-3 py-1 flex items-center gap-1">
                      <CheckCircle className="w-4 h-4" />
                      <span>Copiado</span>
                    </div>
                  )}
                </Button>
              </div>
            ) : (
              <div className="p-6 space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="antecedentesHemorragicos">Describa los antecedentes hemorrágicos del paciente:</Label>
                  <Textarea
                    id="antecedentesHemorragicos"
                    placeholder="Trastornos de coagulación, sangrado excesivo durante procedimientos previos, etc..."
                    value={formData.antecedentesHemorragicos || ""}
                    onChange={(e) => handleInputChange("antecedentesHemorragicos", e.target.value)}
                    className="min-h-[150px] max-h-[300px] w-full resize-y bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-md"
                  />
                  <div className="mt-2">
                    <VoiceInput
                      onTranscriptionComplete={(text) => {
                        const currentText = formData.antecedentesHemorragicos || "";
                        handleInputChange("antecedentesHemorragicos", currentText ? `${currentText} ${text}` : text);
                      }}
                    />
                  </div>
                </div>
              </div>
            )}

            {!showRedaccion && (
              <div className="p-6 flex justify-center gap-4">
                <Button onClick={generarRedaccionIA} className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 flex items-center gap-2">
                  <span>Generar Redacción IA</span>
                </Button>
                <Button onClick={limpiarFormulario} className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 flex items-center gap-2">
                  <Eraser className="w-4 h-4" />
                  <span>Limpiar Formulario</span>
                </Button>
              </div>
            )}
          </>
        )}
      </Card>
    </div>
  );
};

export default AntecedentesHemorragicos;
