"use client";

import React, { useState } from 'react';
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { VoiceInput } from "@/components/ui/voice-input";
import { Card } from "@/components/ui/card";
import { Minus, Maximize2, X } from "lucide-react";
import CaracteristicasDolor from './padecimiento/CaracteristicasDolor';
import SintomasToggle from './padecimiento/SintomasToggle';
import { Tab } from "@/components/ui/pricing-tab";

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
  const [selectedTab, setSelectedTab] = useState("Formulario");

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
    <div className={`max-w-5xl mx-auto transition-all duration-300 ${isMaximized ? 'fixed inset-4 z-50' : ''}`}>
      <Card className={`bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-lg rounded-xl border-0
        ${isMaximized ? 'h-[calc(100vh-2rem)] overflow-y-auto' : ''}`}>
        <div className="flex flex-col items-center p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex space-x-2 bg-muted p-1 rounded-full justify-center w-full max-w-md mx-auto">
            <Tab text="Formulario" selected={selectedTab === "Formulario"} setSelected={setSelectedTab} />
            <Tab text="Redacción IA" selected={selectedTab === "Redacción IA"} setSelected={setSelectedTab} />
          </div>
        </div>

        <div className="flex justify-center px-6 py-1">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <span className="text-gray-400">I.</span>
            PADECIMIENTO ACTUAL
          </h2>
        </div>

        {!isMinimized && (
          <div className="p-6 space-y-8 text-center">
            {selectedTab === "Formulario" ? (
              <>
                <SintomasToggle
                  checked={formData.padecimientoActual.sinSintomas}
                  onChange={handleSinSintomasChange}
                />
                {!formData.padecimientoActual.sinSintomas && (
                  <div className="space-y-6">
                    <div className="text-center">
                      <Label className="text-gray-700 dark:text-gray-300">1. Motivo de consulta:</Label>
                      <div className="flex flex-col items-center gap-4 w-full max-w-lg mx-auto">
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
                    <div className="bg-gray-50 dark:bg-gray-900 p-6 rounded-lg text-center w-full max-w-lg mx-auto">
                      <h3 className="text-lg font-medium mb-6">En caso de dolor</h3>
                      <CaracteristicasDolor
                        dolor={formData.padecimientoActual.dolor}
                        onDolorChange={handleDolorChange}
                      />
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center w-full max-w-lg mx-auto">
                <Label className="text-gray-700 dark:text-gray-300">Redacción IA:</Label>
                <Textarea
                  placeholder="Aquí aparecerá la redacción generada por IA"
                  className="min-h-[150px] max-h-[300px] w-full bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700 resize-y"
                />
              </div>
            )}
          </div>
        )}
      </Card>
    </div>
  );
};

export default PadecimientoActual;
