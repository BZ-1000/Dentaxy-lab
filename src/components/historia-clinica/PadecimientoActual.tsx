import React, { useState } from 'react';
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { VoiceInput } from "@/components/ui/voice-input";
import { Card } from "@/components/ui/card";
import { Minus, Maximize2, X } from "lucide-react";
import CaracteristicasDolor from './padecimiento/CaracteristicasDolor';
import SintomasToggle from './padecimiento/SintomasToggle';

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
  handleSinSintomasChange
}: PadecimientoActualProps) => {
  const [isMinimized, setIsMinimized] = useState(false);
  const [isMaximized, setIsMaximized] = useState(false);

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
    <div className={`max-w-4xl mx-auto transition-all duration-300 ${isMaximized ? 'fixed inset-4 z-50' : ''}`}>
      <Card className={`bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-lg rounded-xl border-0
        ${isMaximized ? 'h-[calc(100vh-2rem)] overflow-y-auto' : ''}`}>
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-4">
            <span className="text-gray-500">Formulario</span>
            <span className="text-gray-500">Redacción IA</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleMinimize}
              className="p-1 rounded-full bg-green-100 text-green-600 hover:bg-green-200 transition-colors"
              aria-label={isMinimized ? "Expandir" : "Minimizar"}
            >
              <Minus className="w-4 h-4" />
            </button>
            <button
              onClick={handleMaximize}
              className="p-1 rounded-full bg-yellow-100 text-yellow-600 hover:bg-yellow-200 transition-colors"
              aria-label={isMaximized ? "Restaurar" : "Maximizar"}
            >
              <Maximize2 className="w-4 h-4" />
            </button>
            <button
              onClick={handleClose}
              className="p-1 rounded-full bg-red-100 text-red-600 hover:bg-red-200 transition-colors"
              aria-label="Cerrar"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {!isMinimized && (
          <div className="p-6 space-y-8">
            <div className="space-y-1">
              <h2 className="text-xl font-semibold flex items-center gap-2">
                <span className="text-gray-400">I.</span>
                PADECIMIENTO ACTUAL
              </h2>
            </div>

            <SintomasToggle
              checked={formData.padecimientoActual.sinSintomas}
              onChange={handleSinSintomasChange}
            />

            {!formData.padecimientoActual.sinSintomas && (
              <div className="space-y-6">
                <div>
                  <Label className="text-gray-700 dark:text-gray-300">1. Motivo de consulta:</Label>
                  <div className="flex items-start gap-4">
                    <Textarea
                      value={formData.padecimientoActual.motivoConsulta}
                      onChange={(e) => handlePadecimientoChange('motivoConsulta', e.target.value)}
                      placeholder="Describa el motivo fundamental por el que acude el paciente"
                      className="min-h-[100px] max-h-[200px] w-full bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700 resize-y"
                    />
                    <div className="mt-2">
                      <VoiceInput
                        onTranscriptionComplete={(text) => handlePadecimientoChange('motivoConsulta', text)}
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <Label className="text-gray-700 dark:text-gray-300">2. Historia del padecimiento:</Label>
                  <div className="flex items-start gap-4">
                    <Textarea
                      value={formData.padecimientoActual.historiaPadecimiento}
                      onChange={(e) => handlePadecimientoChange('historiaPadecimiento', e.target.value)}
                      placeholder="Anotar el principio, evolución y estado actual de la enfermedad y/o síntoma principal"
                      className="min-h-[100px] max-h-[200px] w-full bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700 resize-y"
                    />
                    <div className="mt-2">
                      <VoiceInput
                        onTranscriptionComplete={(text) => handlePadecimientoChange('historiaPadecimiento', text)}
                      />
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 dark:bg-gray-900 p-6 rounded-lg">
                  <h3 className="text-lg font-medium mb-6">En caso de dolor</h3>
                  <CaracteristicasDolor
                    dolor={formData.padecimientoActual.dolor}
                    onDolorChange={handleDolorChange}
                  />
                </div>
              </div>
            )}
          </div>
        )}
      </Card>
    </div>
  );
};

export default PadecimientoActual;
