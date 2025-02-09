"use client";

import React, { useState } from "react";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { VoiceInput } from "@/components/ui/voice-input";
import { Card } from "@/components/ui/card";
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

  return (
    <div className={`max-w-5xl mx-auto transition-all duration-300 ${isMaximized ? "fixed inset-4 z-50" : ""}`}>
      <Card className={`bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-lg rounded-xl border-0 
        w-[900px] min-h-[300px] p-4 ${isMaximized ? "h-[calc(100vh-2rem)] overflow-y-auto" : ""}`}>
        
        {/* 🔹 Barra de selección Formulario / Redacción IA */}
        <div className="flex items-center justify-between pb-2 border-b border-gray-200 dark:border-gray-700">
          
          <div className="flex justify-center w-full">
            <div className="flex bg-gray-200 dark:bg-gray-700 rounded-full p-1">
              <button
                onClick={() => setShowRedaccion(false)}
                className={`px-5 py-1.5 rounded-full transition-all duration-300 text-sm ${
                  !showRedaccion ? "bg-blue-500 text-white shadow-md" : "text-gray-700 dark:text-gray-300"
                }`}
              >
                Formulario
              </button>
              <button
                onClick={() => setShowRedaccion(true)}
                className={`px-5 py-1.5 rounded-full transition-all duration-300 text-sm ${
                  showRedaccion ? "bg-blue-500 text-white shadow-md" : "text-gray-700 dark:text-gray-300"
                }`}
              >
                Redacción IA
              </button>
            </div>
          </div>

          {/* 🔹 Botones de minimizar / maximizar / cerrar */}
          <div className="flex items-center gap-1">
            <button
              onClick={handleMinimize}
              className="p-1 rounded-full bg-green-100 text-green-600 hover:bg-green-200 transition-colors"
              aria-label={isMinimized ? "Expandir" : "Minimizar"}
            >
              <Minus className="w-3 h-3" />
            </button>
            <button
              onClick={handleMaximize}
              className="p-1 rounded-full bg-yellow-100 text-yellow-600 hover:bg-yellow-200 transition-colors"
              aria-label={isMaximized ? "Restaurar" : "Maximizar"}
            >
              <Maximize2 className="w-3 h-3" />
            </button>
            <button
              onClick={handleClose}
              className="p-1 rounded-full bg-red-100 text-red-600 hover:bg-red-200 transition-colors"
              aria-label="Cerrar"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* Sección de contenido */}
        <div className="flex justify-start px-6 py-2">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <span className="text-gray-400">I.</span> PADECIMIENTO ACTUAL
          </h2>
        </div>

        {!isMinimized && (
          <div className="px-6 pb-4 space-y-6">
            {showRedaccion ? (
              // 🔹 Sección de Redacción IA
              <div className="p-4 bg-gray-100 dark:bg-gray-900 rounded-lg">
                <h3 className="text-md font-medium mb-2">Redacción IA</h3>
                <Textarea
                  placeholder="Escribe aquí la redacción generada..."
                  className="min-h-[150px] w-full bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 resize-y"
                />
              </div>
            ) : (
              // 🔹 Formulario principal
              <>
                <SintomasToggle
                  checked={formData.padecimientoActual.sinSintomas}
                  onChange={handleSinSintomasChange}
                />
                {!formData.padecimientoActual.sinSintomas && (
                  <div className="space-y-4">
                    <div>
                      <Label className="text-gray-700 dark:text-gray-300 text-sm">
                        1. Motivo de consulta:
                      </Label>
                      <div className="flex items-start gap-3">
                        <Textarea
                          value={formData.padecimientoActual.motivoConsulta}
                          onChange={(e) =>
                            handlePadecimientoChange(
                              "motivoConsulta",
                              e.target.value
                            )
                          }
                          placeholder="Describa el motivo fundamental por el que acude el paciente"
                          className="min-h-[80px] w-full bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700 resize-y text-sm"
                        />
                        <div className="mt-1">
                          <VoiceInput
                            onTranscriptionComplete={(text) =>
                              handlePadecimientoChange("motivoConsulta", text)
                            }
                          />
                        </div>
                      </div>
                    </div>
                    <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg">
                      <h3 className="text-md font-medium mb-2">
                        En caso de dolor
                      </h3>
                      <CaracteristicasDolor
                        dolor={formData.padecimientoActual.dolor}
                        onDolorChange={handleDolorChange}
                      />
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        )}
      </Card>
    </div>
  );
};

export default PadecimientoActual;
