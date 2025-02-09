"use client";

import React, { useState, useRef, useEffect } from "react";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { VoiceInput } from "@/components/ui/voice-input";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Minus, Maximize2, X } from "lucide-react";
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
  handleDolorChange: (field: string, value: string) => void;
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
  const redaccionRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (showRedaccion && redaccionRef.current) {
      redaccionRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [showRedaccion]);

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
    const textoGenerado = `Paciente acude a consulta por: ${formData.padecimientoActual.motivoConsulta}. \nHistoria del padecimiento: ${formData.padecimientoActual.historiaPadecimiento}. \nDolor: ${formData.padecimientoActual.dolor.caracter}, intensidad ${formData.padecimientoActual.dolor.intensidad}.`;
    setRedaccionIA(textoGenerado);
    setShowRedaccion(true);
  };

  return (
    <div className={`max-w-4xl mx-auto transition-all duration-300 ${isMaximized ? "fixed inset-4 z-50" : ""}`}>
      <Card className={`bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-lg rounded-xl border-0 ${isMaximized ? "h-[calc(100vh-2rem)] overflow-y-auto" : ""}`}>
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex justify-center w-full">
            <div className="flex bg-gray-200 dark:bg-gray-700 rounded-full p-1">
              <button onClick={() => setShowRedaccion(false)} className={`px-5 py-1.5 rounded-full transition-all duration-300 text-sm ${!showRedaccion ? "bg-blue-500 text-white shadow-md" : "text-gray-700 dark:text-gray-300"}`}>Formulario</button>
              <button onClick={() => setShowRedaccion(true)} className={`px-5 py-1.5 rounded-full transition-all duration-300 text-sm ${showRedaccion ? "bg-blue-500 text-white shadow-md" : "text-gray-700 dark:text-gray-300"}`}>Redacción IA</button>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button onClick={handleMinimize} className="p-1 rounded-full bg-green-100 text-green-600 hover:bg-green-200 transition-colors"><Minus className="w-4 h-4" /></button>
            <button onClick={handleMaximize} className="p-1 rounded-full bg-yellow-100 text-yellow-600 hover:bg-yellow-200 transition-colors"><Maximize2 className="w-4 h-4" /></button>
            <button onClick={handleClose} className="p-1 rounded-full bg-red-100 text-red-600 hover:bg-red-200 transition-colors"><X className="w-4 h-4" /></button>
          </div>
        </div>

        <div className="p-6" ref={redaccionRef}>
          {showRedaccion ? (
            <>
              <Label className="text-gray-700 dark:text-gray-300">Redacción IA:</Label>
              <Textarea value={redaccionIA} readOnly className="min-h-[150px] max-h-[250px] w-full bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700 resize-y" />
            </>
          ) : (
            <>
              <Label className="text-gray-700 dark:text-gray-300">1. Motivo de consulta:</Label>
              <div className="flex items-start gap-4">
                <Textarea value={formData.padecimientoActual.motivoConsulta} onChange={(e) => handlePadecimientoChange("motivoConsulta", e.target.value)} className="min-h-[100px] max-h-[200px] w-full bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700 resize-y" />
                <VoiceInput onTranscriptionComplete={(text) => handlePadecimientoChange("motivoConsulta", text)} />
              </div>
            </>
          )}
        </div>

        {!showRedaccion && (
          <div className="p-6 flex justify-center">
            <Button onClick={() => { generarRedaccionIA(); redaccionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }); }} className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600">Generar Redacción IA</Button>
          </div>
        )}
      </Card>
    </div>
  );
};

export default PadecimientoActual;
