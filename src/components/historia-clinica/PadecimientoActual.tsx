"use client";

import React, { useState, useRef, useEffect } from "react";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { VoiceInput } from "@/components/ui/voice-input";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Minus, Maximize2, X, Eraser, Copy, CheckCircle } from "lucide-react";
import CaracteristicasDolor from "./padecimiento/CaracteristicasDolor";
import SintomasToggle from "./padecimiento/SintomasToggle";

interface PadecimientoActualProps {
  formData: {
    padecimientoActual: {
      sinSintomas: boolean;
      motivoConsulta: string;
      historiaPadecimiento: string;
      dolor: {
        fechaInicio: string;
        condicionAparicion: string;
        frecuencia: string;
        caracter: string;
        intensidad: string;
        localizacion: {
          tipo: string;
          descripcion: string;
        };
        atenuacion: string;
      };
    };
  };
  handlePadecimientoChange: (field: string, value: string) => void;
  handleDolorChange: (field: string, value: any) => void; // Cambio aquí para aceptar cualquier tipo
  handleSinSintomasChange: (checked: boolean) => void;
}

const PadecimientoActual = ({
  formData,
  handlePadecimientoChange,
  handleDolorChange,
  handleSinSintomasChange,
}: PadecimientoActualProps) => {
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
    const motivoConsulta = formData.padecimientoActual.motivoConsulta.trim();
    const sinSintomas = formData.padecimientoActual.sinSintomas;

    let textoGenerado = "";

    if (sinSintomas) {
      textoGenerado = `Motivo de consulta:\n
      El paciente acude a consulta por ${motivoConsulta}.\n\n
      Actualmente no refiere sintomatología.`;
    } else {
      const historiaPadecimiento = formData.padecimientoActual.historiaPadecimiento.trim();
      const { fechaInicio, condicionAparicion, frecuencia, caracter, intensidad, localizacion, atenuacion } = formData.padecimientoActual.dolor;

      textoGenerado = `Motivo de consulta:\n
      El paciente acude a consulta por ${motivoConsulta}.\n\n
      Historia del padecimiento:\n
      El paciente refiere la presencia de dolor localizado en ${localizacion.descripcion || 'una localización no especificada'}. El síntoma inició el ${fechaInicio || 'una fecha no especificada'} y se presenta de manera ${frecuencia || 'no especificada'}. Se describe como un dolor ${caracter || 'no especificado'} con una intensidad ${intensidad || 'no especificada'}. Se ha identificado que el dolor aparece ${condicionAparicion || 'una condición no especificada'} y se ha observado que ${atenuacion || 'factores no especificados'}.`;
    }

    // Revisar la redacción y corregir errores comunes
    const textoCorregido = revisarRedaccion(textoGenerado);

    setRedaccionIA(textoCorregido);
    setShowRedaccion(true);

    setTimeout(() => {
      redaccionRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setTimeout(() => {
        window.scrollBy(0, -200);
      }, 300);
    }, 100);
  };

  const limpiarFormulario = () => {
    handlePadecimientoChange("motivoConsulta", "");
    handlePadecimientoChange("historiaPadecimiento", "");
    handleDolorChange("fechaInicio", "");
    handleDolorChange("condicionAparicion", "");
    handleDolorChange("frecuencia", "");
    handleDolorChange("caracter", "");
    handleDolorChange("intensidad", "");
    handleDolorChange("localizacion", { tipo: "", descripcion: "" });
    handleDolorChange("atenuacion", "");
    handleSinSintomasChange(false);
    setRedaccionIA("");
    setShowRedaccion(false);
  };

  const removeDuplicates = (text) => {
    // Eliminar palabras consecutivas repetidas
    return text.replace(/(\b\w+\b)(?:\s+\1\b)+/gi, '$1');
  };

  const revisarRedaccion = (text) => {
    let textoCorregido = removeDuplicates(text);

    // Eliminar frases redundantes relacionadas al motivo de la consulta
    textoCorregido = textoCorregido.replace(/Motivo de consulta: El paciente acude a consulta por Motivo de consulta/gi, 'Motivo de consulta: El paciente acude a consulta por');
    textoCorregido = textoCorregido.replace(/El paciente acude a consulta por El paciente acude a consulta por/gi, 'El paciente acude a consulta por');
    textoCorregido = textoCorregido.replace(/El paciente acude a consulta por por/gi, 'El paciente acude a consulta por');
    textoCorregido = textoCorregido.replace(/El paciente acude a consulta por debido a/gi, 'El paciente acude a consulta por');
    textoCorregido = textoCorregido.replace(/El paciente acude a consulta por a causa de/gi, 'El paciente acude a consulta por');
    textoCorregido = textoCorregido.replace(/El paciente acude a consulta por debido a que/gi, 'El paciente acude a consulta por');
    textoCorregido = textoCorregido.replace(/El paciente acude a consulta por porque/gi, 'El paciente acude a consulta por');
    textoCorregido = textoCorregido.replace(/El paciente acude a consulta por ya que/gi, 'El paciente acude a consulta por');
    textoCorregido = textoCorregido.replace(/El paciente acude a consulta por dado que/gi, 'El paciente acude a consulta por');
    textoCorregido = textoCorregido.replace(/Motivo de la consulta del paciente es por/gi, 'El paciente acude a consulta por');
    textoCorregido = textoCorregido.replace(/El motivo de la consulta es/gi, 'El paciente acude a consulta por');
    textoCorregido = textoCorregido.replace(/El paciente ingresa a consulta por/gi, 'El paciente acude a consulta por');

    // Eliminar frases redundantes relacionadas a la localización
    textoCorregido = textoCorregido.replace(/El paciente refiere la presencia de dolor localizado en localizado en/gi, 'El paciente refiere la presencia de dolor localizado en');
    textoCorregido = textoCorregido.replace(/El paciente refiere la presencia de dolor localizado en en/gi, 'El paciente refiere la presencia de dolor localizado en');
    textoCorregido = textoCorregido.replace(/El paciente refiere la presencia de dolor localizado en la zona de/gi, 'El paciente refiere la presencia de dolor localizado en');
    textoCorregido = textoCorregido.replace(/El paciente refiere la presencia de dolor localizado en el área de/gi, 'El paciente refiere la presencia de dolor localizado en');
    textoCorregido = textoCorregido.replace(/El paciente refiere la presencia de dolor localizado en la región de/gi, 'El paciente refiere la presencia de dolor localizado en');
    textoCorregido = textoCorregido.replace(/El paciente refiere la presencia de dolor localizado en el sitio de/gi, 'El paciente refiere la presencia de dolor localizado en');
    textoCorregido = textoCorregido.replace(/El paciente refiere la presencia de dolor localizado en el lugar de/gi, 'El paciente refiere la presencia de dolor localizado en');
    textoCorregido = textoCorregido.replace(/El paciente refiere la presencia de dolor localizado en el punto de/gi, 'El paciente refiere la presencia de dolor localizado en');
    textoCorregido = textoCorregido.replace(/El paciente refiere la presencia de dolor localizado en la parte de/gi, 'El paciente refiere la presencia de dolor localizado en');
    textoCorregido = textoCorregido.replace(/El paciente refiere la presencia de dolor localizado en la ubicación de/gi, 'El paciente refiere la presencia de dolor localizado en');
    textoCorregido = textoCorregido.replace(/El paciente refiere la presencia de dolor localizado en el sector de/gi, 'El paciente refiere la presencia de dolor localizado en');

    // Eliminar frases redundantes relacionadas a la atenuación
    textoCorregido = textoCorregido.replace(/Se ha observado que Se ha observado que/gi, 'Se ha observado que');
    textoCorregido = textoCorregido.replace(/Se atenua con ibuprofeno influyen en su intensidad/gi, 'Se atenúa con ibuprofeno, lo cual influye en su intensidad');

    // Corregir mayúsculas al inicio de cada oración
    textoCorregido = textoCorregido.replace(/(^\s*\w|[.!?]\s*\w)/g, (match) => match.toUpperCase());

    // Eliminar espacios extra entre palabras y después de signos de puntuación
    textoCorregido = textoCorregido.replace(/\s+/g, ' ').replace(/([.!?,])(\S)/g, '$1 $2');

    // Asegurar un espacio después de los signos de puntuación
    textoCorregido = textoCorregido.replace(/([.!?,])(\S)/g, '$1 $2');

    // Corregir términos específicos
    textoCorregido = textoCorregido.replace(/frecuencia continuo/gi, 'frecuencia continua');
    textoCorregido = textoCorregido.replace(/intensidad moderado/gi, 'intensidad moderada');
    textoCorregido = textoCorregido.replace(/espontaneo/gi, 'espontáneo');
    textoCorregido = textoCorregido.replace(/Se atenua con ibuprofeno influyen en su intensidad/gi, 'Se atenúa con ibuprofeno, lo cual influye en su intensidad');

    return textoCorregido;
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
    }, 15); // Ajustar la velocidad de la animación aquí (15ms es 3 veces más rápido que 50ms)

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
            <span className="text-gray-400">I.</span> PADECIMIENTO ACTUAL
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
            <Textarea
              value={displayedText}
              readOnly
              className="min-h-[150px] max-h-[250px] w-full bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700 resize-y"
              style={{ whiteSpace: 'pre-wrap' }} // Asegura que se respete el formato de salto de línea
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
          <div className="p-6">
            <Label className="text-gray-700 dark:text-gray-300">1. Motivo de consulta:</Label>
            <div className="flex items-start gap-4">
              <Textarea
                value={formData.padecimientoActual.motivoConsulta}
                onChange={(e) => handlePadecimientoChange("motivoConsulta", revisarRedaccion(e.target.value))}
                placeholder="El paciente acude a consulta por..."
                className="min-h-[100px] max-h-[200px] w-full bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700 resize-y"
              />
              <div className="mt-2">
                <VoiceInput onTranscriptionComplete={(text) => handlePadecimientoChange("motivoConsulta", revisarRedaccion(text))} />
              </div>
            </div>
          </div>
        )}

        {!isMinimized && !showRedaccion && (
          <div className="p-6 space-y-8">
            <SintomasToggle checked={formData.padecimientoActual.sinSintomas} onChange={handleSinSintomasChange} />
            {!formData.padecimientoActual.sinSintomas && (
              <div className="space-y-6">
                <div className="bg-gray-50 dark:bg-gray-900 p-6 rounded-lg">
                  <h3 className="text-lg font-medium mb-6">En caso de dolor</h3>
                  <CaracteristicasDolor dolor={formData.padecimientoActual.dolor} onDolorChange={handleDolorChange} />
                </div>
              </div>
            )}
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

export default PadecimientoActual;
