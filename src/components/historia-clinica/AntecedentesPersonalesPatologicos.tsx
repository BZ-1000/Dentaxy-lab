import React, { useState, useRef, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Minus, Maximize2, X, Eraser, Copy, CheckCircle } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface AntecedentesPersonalesPatologicosProps {
  formData: any;
  handleAntecedentePatologicoChange: (field: string, value: any) => void;
}

const AntecedentesPersonalesPatologicos = ({ formData, handleAntecedentePatologicoChange }: AntecedentesPersonalesPatologicosProps) => {
  const [isMinimized, setIsMinimized] = useState(false);
  const [isMaximized, setIsMaximized] = useState(false);
  const [showRedaccion, setShowRedaccion] = useState(false);
  const [redaccionIA, setRedaccionIA] = useState("");
  const [copied, setCopied] = useState(false);
  const [displayedText, setDisplayedText] = useState("");
  const [progress, setProgress] = useState(0);
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
    let textoGenerado = "";

    // Nutricionales
    textoGenerado += `Nutricionales: ${formData.antecedentesPersonalesPatologicos.nutricionales.descripcion || 'Sin información'}. `;

    // Cardíacos
    textoGenerado += `Cardíacos: ${formData.antecedentesPersonalesPatologicos.cardiacos.descripcion || 'Sin información'}. `;

    // Hepáticos
    textoGenerado += `Hepáticos: ${formData.antecedentesPersonalesPatologicos.hepaticos.descripcion || 'Sin información'}. `;

    // Renales
    textoGenerado += `Renales: ${formData.antecedentesPersonalesPatologicos.renales.descripcion || 'Sin información'}. `;

    // Respiratorios
    textoGenerado += `Respiratorios: ${formData.antecedentesPersonalesPatologicos.respiratorios.descripcion || 'Sin información'}. `;

    // Neurológicos
    textoGenerado += `Neurológicos: ${formData.antecedentesPersonalesPatologicos.neurologicos.descripcion || 'Sin información'}. `;

    // Infecciosos
    textoGenerado += `Infecciosos: ${formData.antecedentesPersonalesPatologicos.infecciosos.descripcion || 'Sin información'}. `;

    // Quirúrgicos
    textoGenerado += `Quirúrgicos: ${formData.antecedentesPersonalesPatologicos.quirurgicos.descripcion || 'Sin información'}. `;

    // Traumáticos
    textoGenerado += `Traumáticos: ${formData.antecedentesPersonalesPatologicos.traumaticos.descripcion || 'Sin información'}. `;

    // Alérgicos
    textoGenerado += `Alérgicos: ${formData.antecedentesPersonalesPatologicos.alergicos.descripcion || 'Sin información'}. `;

    // Otros
    textoGenerado += `Otros: ${formData.antecedentesPersonalesPatologicos.otros.descripcion || 'Sin información'}. `;

    setRedaccionIA(textoGenerado);
    setShowRedaccion(true);

    setTimeout(() => {
      redaccionRef.current?.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
      setTimeout(() => {
        window.scrollBy(0, -200);
      }, 300);
    }, 100);
  };

  const limpiarFormulario = () => {
    handleAntecedentePatologicoChange("nutricionales.descripcion", "");
    handleAntecedentePatologicoChange("cardiacos.descripcion", "");
    handleAntecedentePatologicoChange("hepaticos.descripcion", "");
    handleAntecedentePatologicoChange("renales.descripcion", "");
    handleAntecedentePatologicoChange("respiratorios.descripcion", "");
    handleAntecedentePatologicoChange("neurologicos.descripcion", "");
    handleAntecedentePatologicoChange("infecciosos.descripcion", "");
    handleAntecedentePatologicoChange("quirurgicos.descripcion", "");
    handleAntecedentePatologicoChange("traumaticos.descripcion", "");
    handleAntecedentePatologicoChange("alergicos.descripcion", "");
    handleAntecedentePatologicoChange("otros.descripcion", "");
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
        setProgress(index / redaccionIA.length * 100);
        index++;
      } else {
        clearInterval(interval);
      }
    }, 15);
    return () => clearInterval(interval);
  }, [redaccionIA]);

  return (
    <div
      className={`max-w-4xl mx-auto transition-all duration-300 ${isMaximized ? "fixed inset-4 z-50" : ""}`}
      data-section-redaction="true"
      data-section-name="antecedentesPersonalesPatologicos"
    >
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
            <span className="text-gray-400">IV.</span> Antecedentes Personales Patológicos
          </h2>
        </div>

        {showRedaccion ? (
          <div ref={redaccionRef} className="p-6">
            <Label className="text-gray-700 dark:text-gray-300">Redacción IA:</Label>
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
              className="min-h-[150px] max-h-[250px] w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-md p-3 overflow-y-auto whitespace-pre-wrap"
              style={{
                whiteSpace: 'pre-wrap',
              }}
              dangerouslySetInnerHTML={{
                __html: displayedText,
              }}
              data-redaction-content
            />
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
          <div className="p-6 space-y-4">
            <div>
              <Label className="text-gray-700 dark:text-gray-300">Nutricionales:</Label>
              <Textarea
                value={formData.antecedentesPersonalesPatologicos.nutricionales.descripcion}
                onChange={(e) => handleAntecedentePatologicoChange("nutricionales.descripcion", e.target.value)}
                placeholder="Descripción de antecedentes nutricionales"
                className="w-full resize-y bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-md"
              />
            </div>

            <div>
              <Label className="text-gray-700 dark:text-gray-300">Cardíacos:</Label>
              <Textarea
                value={formData.antecedentesPersonalesPatologicos.cardiacos.descripcion}
                onChange={(e) => handleAntecedentePatologicoChange("cardiacos.descripcion", e.target.value)}
                placeholder="Descripción de antecedentes cardíacos"
                className="w-full resize-y bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-md"
              />
            </div>

            <div>
              <Label className="text-gray-700 dark:text-gray-300">Hepáticos:</Label>
              <Textarea
                value={formData.antecedentesPersonalesPatologicos.hepaticos.descripcion}
                onChange={(e) => handleAntecedentePatologicoChange("hepaticos.descripcion", e.target.value)}
                placeholder="Descripción de antecedentes hepáticos"
                className="w-full resize-y bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-md"
              />
            </div>

            <div>
              <Label className="text-gray-700 dark:text-gray-300">Renales:</Label>
              <Textarea
                value={formData.antecedentesPersonalesPatologicos.renales.descripcion}
                onChange={(e) => handleAntecedentePatologicoChange("renales.descripcion", e.target.value)}
                placeholder="Descripción de antecedentes renales"
                className="w-full resize-y bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-md"
              />
            </div>

            <div>
              <Label className="text-gray-700 dark:text-gray-300">Respiratorios:</Label>
              <Textarea
                value={formData.antecedentesPersonalesPatologicos.respiratorios.descripcion}
                onChange={(e) => handleAntecedentePatologicoChange("respiratorios.descripcion", e.target.value)}
                placeholder="Descripción de antecedentes respiratorios"
                className="w-full resize-y bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-md"
              />
            </div>

            <div>
              <Label className="text-gray-700 dark:text-gray-300">Neurológicos:</Label>
              <Textarea
                value={formData.antecedentesPersonalesPatologicos.neurologicos.descripcion}
                onChange={(e) => handleAntecedentePatologicoChange("neurologicos.descripcion", e.target.value)}
                placeholder="Descripción de antecedentes neurológicos"
                className="w-full resize-y bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-md"
              />
            </div>

            <div>
              <Label className="text-gray-700 dark:text-gray-300">Infecciosos:</Label>
              <Textarea
                value={formData.antecedentesPersonalesPatologicos.infecciosos.descripcion}
                onChange={(e) => handleAntecedentePatologicoChange("infecciosos.descripcion", e.target.value)}
                placeholder="Descripción de antecedentes infecciosos"
                className="w-full resize-y bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-md"
              />
            </div>

            <div>
              <Label className="text-gray-700 dark:text-gray-300">Quirúrgicos:</Label>
              <Textarea
                value={formData.antecedentesPersonalesPatologicos.quirurgicos.descripcion}
                onChange={(e) => handleAntecedentePatologicoChange("quirurgicos.descripcion", e.target.value)}
                placeholder="Descripción de antecedentes quirúrgicos"
                className="w-full resize-y bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-md"
              />
            </div>

            <div>
              <Label className="text-gray-700 dark:text-gray-300">Traumáticos:</Label>
              <Textarea
                value={formData.antecedentesPersonalesPatologicos.traumaticos.descripcion}
                onChange={(e) => handleAntecedentePatologicoChange("traumaticos.descripcion", e.target.value)}
                placeholder="Descripción de antecedentes traumáticos"
                className="w-full resize-y bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-md"
              />
            </div>

            <div>
              <Label className="text-gray-700 dark:text-gray-300">Alérgicos:</Label>
              <Textarea
                value={formData.antecedentesPersonalesPatologicos.alergicos.descripcion}
                onChange={(e) => handleAntecedentePatologicoChange("alergicos.descripcion", e.target.value)}
                placeholder="Descripción de antecedentes alérgicos"
                className="w-full resize-y bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-md"
              />
            </div>

            <div>
              <Label className="text-gray-700 dark:text-gray-300">Otros:</Label>
              <Textarea
                value={formData.antecedentesPersonalesPatologicos.otros.descripcion}
                onChange={(e) => handleAntecedentePatologicoChange("otros.descripcion", e.target.value)}
                placeholder="Descripción de otros antecedentes"
                className="w-full resize-y bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-md"
              />
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
      </Card>
    </div>
  );
};

export default AntecedentesPersonalesPatologicos;
