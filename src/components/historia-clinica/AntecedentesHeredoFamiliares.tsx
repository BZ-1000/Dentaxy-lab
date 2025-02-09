
import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { FormDataState } from "@/types/historiaClinica";

interface AntecedentesHeredoFamiliaresProps {
  formData: FormDataState;
  handleFamiliarChange: (familiar: string, field: string, value: string | boolean) => void;
  handleCondicionChange: (familiar: string, condicion: string, value: string | boolean) => void;
}

const familiares = [
  "Padre",
  "Madre",
  "Abuelo Paterno",
  "Abuela Paterna",
  "Abuelo Materno",
  "Abuela Materna",
];

const condiciones = ["Diabetes Mellitus", "Hipertensión Arterial", "Cáncer", "Otras"];

interface FamiliaRowProps {
  familiar: string;
  formData: FormDataState;
  handleFamiliarChange: (familiar: string, field: string, value: string | boolean) => void;
  handleCondicionChange: (familiar: string, condicion: string, value: string | boolean) => void;
}

const FamiliaRow = ({ familiar, formData, handleFamiliarChange, handleCondicionChange }: FamiliaRowProps) => {
  const familiarKey = familiar.toLowerCase().replace(/ /g, '') as keyof typeof formData.antecedentesHeredoFamiliares;
  const familiarData = formData.antecedentesHeredoFamiliares[familiarKey];

  return (
    <div className="flex flex-col gap-2 border-b pb-4">
      <div className="grid grid-cols-6 gap-2">
        <span className="font-medium">{familiar}</span>
        <button
          className={`px-2 py-1.5 rounded-md border transition-colors ${
            familiarData.finado ? "bg-red-500 text-white" : "bg-white"
          }`}
          onClick={() => handleFamiliarChange(familiarKey, 'finado', !familiarData.finado)}
        >
          Finado
        </button>
        {!familiarData.finado &&
          condiciones.map((cond) => {
            const condKey = cond.toLowerCase().replace(/ /g, '').replace(/[áéíóú]/g, (match) => {
              return {á: 'a', é: 'e', í: 'i', ó: 'o', ú: 'u'}[match] || match;
            }) as keyof typeof familiarData.condiciones;
            
            return (
              <button
                key={cond}
                className={`px-2 py-1.5 rounded-md border transition-colors ${
                  familiarData.condiciones[condKey] ? "bg-blue-500 text-white" : "bg-white"
                }`}
                onClick={() => handleCondicionChange(familiarKey, condKey, !familiarData.condiciones[condKey])}
              >
                {cond}
              </button>
            );
          })}
      </div>
      {familiarData.finado && (
        <Input
          value={familiarData.causaMuerte}
          onChange={(e) => handleFamiliarChange(familiarKey, 'causaMuerte', e.target.value)}
          placeholder="Causa de fallecimiento"
          className="w-full border rounded-md px-2 py-1.5"
        />
      )}
      {familiarData.condiciones.otras && !familiarData.finado && (
        <Input
          value={familiarData.condiciones.otras as string}
          onChange={(e) => handleCondicionChange(familiarKey, 'otras', e.target.value)}
          placeholder="Especifique otras condiciones"
          className="w-full border rounded-md px-2 py-1.5"
        />
      )}
    </div>
  );
};

const AntecedentesHeredoFamiliares = ({ formData, handleFamiliarChange, handleCondicionChange }: AntecedentesHeredoFamiliaresProps) => {
  return (
    <Card className="p-6 space-y-4">
      <h3 className="text-xl font-mplus font-normal mb-4">II.Antecedentes Heredo Familiares</h3>
      {familiares.map((familiar) => (
        <FamiliaRow 
          key={familiar} 
          familiar={familiar} 
          formData={formData}
          handleFamiliarChange={handleFamiliarChange}
          handleCondicionChange={handleCondicionChange}
        />
      ))}
    </Card>
  );
};

export default AntecedentesHeredoFamiliares;
