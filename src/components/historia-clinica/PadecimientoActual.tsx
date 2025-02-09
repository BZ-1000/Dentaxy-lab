"use client";

import React, { useState } from "react";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { VoiceInput } from "@/components/ui/voice-input";
import { Card } from "@/components/ui/card";
import { Minus, Maximize2, X } from "lucide-react";
import CaracteristicasDolor from "./padecimiento/CaracteristicasDolor";
import SintomasToggle from "./padecimiento/SintomasToggle";
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
  handleSinSintomasChange,
}: PadecimientoActualProps) => {
  const [selectedTab, setSelectedTab] = useState("Formulario");

  return (
    <div className="max-w-4xl mx-auto p-6">
      <Card className="bg-white dark:bg-gray-800 shadow-md rounded-lg">
        {/* Tabs */}
        <div className="flex justify-center border-b border-gray-300 dark:border-gray-700 p-3">
          <Tab text="Formulario" selected={selectedTab === "Formulario"} setSelected={setSelectedTab} />
          <Tab text="Redacción IA" selected={selectedTab === "Redacción IA"} setSelected={setSelectedTab} />
        </div>

        {/* Contenido */}
        <div className="p-6">
          {selectedTab === "Formulario" ? (
            <div className="space-y-6">
              <SintomasToggle checked={formData.padecimientoActual.sinSintomas} onChange={handleSinSintomasChange} />

              {!formData.padecimientoActual.sinSintomas && (
                <>
                  {/* Motivo de consulta */}
                  <div>
                    <Label className="block text-gray-700 dark:text-gray-300 mb-2">1. Motivo de consulta:</Label>
                    <Textarea
                      value={formData.padecimientoActual.motivoConsulta}
                      onChange={(e) => handlePadecimientoChange("motivoConsulta", e.target.value)}
                      placeholder="Describa el motivo fundamental por el que acude el paciente"
                      className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-md p-2"
                    />
                    <div className="mt-2">
                      <VoiceInput onTranscriptionComplete={(text) => handlePadecimientoChange("motivoConsulta", text)} />
                    </div>
                  </div>

                  {/* Dolor */}
                  <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg border border-gray-300 dark:border-gray-700">
                    <h3 className="text-lg font-medium mb-4">En caso de dolor</h3>
                    <CaracteristicasDolor dolor={formData.padecimientoActual.dolor} onDolorChange={handleDolorChange} />
                  </div>
                </>
              )}
            </div>
          ) : (
            <div>
              <Label className="block text-gray-700 dark:text-gray-300 mb-2">Redacción IA:</Label>
              <Textarea
                placeholder="Aquí aparecerá la redacción generada por IA"
                className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-md p-2"
              />
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};

export default PadecimientoActual;
