import React from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { FormDataState, Familiar as OriginalFamiliar } from "@/types/historiaClinica";

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

interface Familiar extends OriginalFamiliar {
  vivoSano: boolean;
}

interface FamiliaRowProps {
  familiar: string;
  formData: FormDataState;
  handleFamiliarChange: (familiar: string, field: string, value: string | boolean) => void;
  handleCondicionChange: (familiar: string, condicion: string, value: string | boolean) => void;
}

const FamiliaRow = ({ familiar, formData, handleFamiliarChange, handleCondicionChange }: FamiliaRowProps) => {
  const getFamiliarKey = (familiar: string): keyof typeof formData.antecedentesHeredoFamiliares => {
    const mapping: { [key: string]: keyof typeof formData.antecedentesHeredoFamiliares } = {
      "Padre": "padre",
      "Madre": "madre",
      "Abuelo Paterno": "abueloPaterno",
      "Abuela Paterna": "abuelaPaterna",
      "Abuelo Materno": "abueloMaterno",
      "Abuela Materna": "abuelaMaterna"
    };
    return mapping[familiar];
  };

  const familiarKey = getFamiliarKey(familiar);
  const familiarData = formData.antecedentesHeredoFamiliares[familiarKey] as Familiar;

  const getCondicionKey = (condicion: string) => {
    const mapping: { [key: string]: string } = {
      "Diabetes Mellitus": "diabetesMellitus",
      "Hipertensión Arterial": "hipertensionArterial",
      "Cáncer": "cancer",
      "Otras": "otras"
    };
    return mapping[condicion];
  };

  const handleVivoSano = () => {
    const newVivoSano = !familiarData.vivoSano;
    handleFamiliarChange(familiarKey, 'finado', false);
    handleFamiliarChange(familiarKey, 'vivoSano', newVivoSano);
    if (newVivoSano) {
      condiciones.forEach((cond) => {
        const condKey = getCondicionKey(cond);
        handleCondicionChange(familiarKey, condKey, false);
      });
    }
  };

  return (
    <div className="flex flex-col gap-2 border-b pb-4">
      <div className="grid grid-cols-7 gap-2 items-center">
        <span className="font-medium text-sm col-span-1">{familiar}</span>
        <button
          className={`px-3 py-2 rounded-full border transition-colors text-xs ${
            familiarData.finado ? "bg-red-500 text-white" : "bg-gray-200"
          }`}
          onClick={() => handleFamiliarChange(familiarKey, 'finado', !familiarData.finado)}
        >
          Finado
        </button>
        <button
          className={`px-3 py-2 rounded-full border transition-colors text-xs col-span-1 ${
            familiarData.vivoSano ? "bg-green-500 text-white" : "bg-gray-200"
          }`}
          onClick={handleVivoSano}
        >
          Vivo y Sano
        </button>
        {!familiarData.finado && !familiarData.vivoSano &&
          condiciones.map((cond) => {
            const condKey = getCondicionKey(cond);
            return (
              <button
                key={cond}
                className={`px-3 py-2 rounded-full border transition-colors text-xs col-span-1 ${
                  familiarData.condiciones[condKey] ? "bg-blue-500 text-white" : "bg-gray-200"
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
          className="w-full border rounded-md px-2 py-1.5 text-sm mt-2"
        />
      )}
      {familiarData.condiciones.otras && !familiarData.finado && !familiarData.vivoSano && (
        <Input
          value={familiarData.condiciones.otras as string}
          onChange={(e) => handleCondicionChange(familiarKey, 'otras', e.target.value)}
          placeholder="Especifique otras condiciones"
          className="w-full border rounded-md px-2 py-1.5 text-sm mt-2"
        />
      )}
    </div>
  );
};

const AntecedentesHeredoFamiliares = ({ formData, handleFamiliarChange, handleCondicionChange }: AntecedentesHeredoFamiliaresProps) => {
  return (
    <Card className="p-6 space-y-4">
      <h3 className="text-xl font-mplus font-normal mb-4">II. Antecedentes Heredo Familiares</h3>
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
