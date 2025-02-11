"use client";

import React, { useState, useRef } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Minus, Maximize2, X, Eraser } from "lucide-react";
import { FormDataState, Familiar as OriginalFamiliar } from "@/types/historiaClinica";

interface AntecedentesHeredoFamiliaresProps {
  formData: FormDataState;
  handleFamiliarChange: (familiar: string, field: string, value: string | boolean) => void;
  handleCondicionChange: (familiar: string, condicion: string, value: string | boolean) => void;
}

const familiares = ["Padre", "Madre", "Abuelo Paterno", "Abuela Paterna", "Abuelo Materno", "Abuela Materna"];
const condiciones = ["Diabetes Mellitus", "Hipertensión Arterial", "Cáncer", "Otras"];

interface Familiar extends OriginalFamiliar {
  vivoSano: boolean;
}

const AntecedentesHeredoFamiliares = ({ formData, handleFamiliarChange, handleCondicionChange }: AntecedentesHeredoFamiliaresProps) => {
  const [isMinimized, setIsMinimized] = useState(false);
  const [isMaximized, setIsMaximized] = useState(false);
  const [redaccionIA, setRedaccionIA] = useState("");
  const redaccionRef = useRef(null);

  const handleMinimize = () => setIsMinimized(!isMinimized);
  const handleMaximize = () => setIsMaximized(!isMaximized);
  const handleClose = () => setIsMinimized(false);

  const generarRedaccionIA = () => {
    let textoGenerado = "Antecedentes Heredo Familiares: ";
    familiares.forEach((familiar) => {
      const familiarKey = familiar.replace(" ", "").toLowerCase();
      const familiarData = formData.antecedentesHeredoFamiliares[familiarKey] as Familiar;
      textoGenerado += `${familiar}: ${familiarData.finado ? "Finado" : familiarData.vivoSano ? "Vivo y sano" : "Con condiciones"}. `;
    });
    setRedaccionIA(textoGenerado);
  };

  const limpiarFormulario = () => {
    familiares.forEach((familiar) => {
      const familiarKey = familiar.replace(" ", "").toLowerCase();
      handleFamiliarChange(familiarKey, "finado", false);
      handleFamiliarChange(familiarKey, "vivoSano", false);
      handleFamiliarChange(familiarKey, "causaMuerte", "");
      condiciones.forEach((condicion) => handleCondicionChange(familiarKey, condicion.replace(" ", "").toLowerCase(), false));
    });
    setRedaccionIA("");
  };

  return (
    <div className={`max-w-4xl mx-auto transition-all duration-300 ${isMaximized ? "fixed inset-4 z-50" : ""}`}>
      <Card className="p-6 space-y-6 shadow-lg rounded-lg">
        <div className="flex items-center justify-between pb-4 border-b">
          <h3 className="text-2xl font-bold text-gray-800">II. Antecedentes Heredo Familiares</h3>
          <div className="flex items-center gap-2">
            <Button onClick={handleMinimize} variant="ghost"><Minus className="w-4 h-4" /></Button>
            <Button onClick={handleMaximize} variant="ghost"><Maximize2 className="w-4 h-4" /></Button>
            <Button onClick={handleClose} variant="ghost"><X className="w-4 h-4" /></Button>
          </div>
        </div>
        {!isMinimized && (
          <>
            {familiares.map((familiar) => {
              const familiarKey = familiar.replace(" ", "").toLowerCase();
              const familiarData = formData.antecedentesHeredoFamiliares[familiarKey] as Familiar;
              return (
                <div key={familiar} className="flex flex-col gap-4 border-b pb-6">
                  <span className="font-semibold text-gray-700">{familiar}</span>
                  <div className="flex gap-4">
                    <Button onClick={() => handleFamiliarChange(familiarKey, 'finado', !familiarData.finado)}>{familiarData.finado ? "Finado" : "Marcar como Finado"}</Button>
                    <Button onClick={() => handleFamiliarChange(familiarKey, 'vivoSano', !familiarData.vivoSano)}>{familiarData.vivoSano ? "Vivo y sano" : "Marcar como Vivo y Sano"}</Button>
                  </div>
                  {familiarData.finado && (
                    <Input value={familiarData.causaMuerte} onChange={(e) => handleFamiliarChange(familiarKey, 'causaMuerte', e.target.value)} placeholder="Causa de fallecimiento" />
                  )}
                </div>
              );
            })}
            <div className="flex justify-center gap-4 pt-4">
              <Button onClick={generarRedaccionIA} className="bg-blue-500 text-white">Generar Redacción IA</Button>
              <Button onClick={limpiarFormulario} className="bg-red-500 text-white"><Eraser className="w-4 h-4" /> Limpiar</Button>
            </div>
            {redaccionIA && (
              <div ref={redaccionRef} className="p-4 mt-4 bg-gray-50 border rounded-md">
                <h4 className="text-lg font-medium">Redacción IA:</h4>
                <p>{redaccionIA}</p>
              </div>
            )}
          </>
        )}
      </Card>
    </div>
  );
};

export default AntecedentesHeredoFamiliares;
