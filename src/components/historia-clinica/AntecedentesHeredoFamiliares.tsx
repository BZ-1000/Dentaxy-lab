"use client";

import React, { useState, useRef } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Minus, Maximize2, X, Eraser, Copy } from "lucide-react";
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

  const handleFinado = () => {
    const newFinado = !familiarData.finado;
    handleFamiliarChange(familiarKey, 'finado', newFinado);
    if (newFinado) {
      handleFamiliarChange(familiarKey, 'vivoSano', false);
      condiciones.forEach((cond) => {
        const condKey = getCondicionKey(cond);
        handleCondicionChange(familiarKey, condKey, false);
      });
    }
  };

  return (
    <div className="flex flex-col gap-4 border-b pb-6">
      <div className="grid grid-cols-7 gap-4 items-center">
        <span className="font-semibold text-base text-center col-span-1 text-gray-700">{familiar}</span>
        {!familiarData.vivoSano && (
          <button
            className={`px-4 py-2 rounded-full border shadow-sm transition-colors text-sm font-medium col-span-1 ${
              familiarData.finado ? "bg-red-600 text-white" : "bg-white text-gray-700 border-gray-300"
            }`}
            onClick={handleFinado}
          >
            Finado
          </button>
        )}
        {!familiarData.finado && (
          <button
            className={`px-4 py-2 rounded-full border shadow-sm transition-colors text-sm font-medium ${
              familiarData.vivoSano ? "bg-green-600 text-white col-span-7" : "bg-white text-gray-700 border-gray-300 col-span-1"
            }`}
            onClick={handleVivoSano}
          >
            Vivo y Sano
          </button>
        )}
        {!familiarData.finado && !familiarData.vivoSano &&
          condiciones.map((cond) => {
            const condKey = getCondicionKey(cond);
            return (
              <button
                key={cond}
                className={`px-4 py-2 rounded-full border shadow-sm transition-colors text-sm font-medium col-span-1 ${
                  familiarData.condiciones[condKey] ? "bg-blue-600 text-white" : "bg-white text-gray-700 border-gray-300"
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
          className="w-full border rounded-md px-3 py-2 text-sm mt-2 shadow-inner"
        />
      )}
      {familiarData.condiciones.otras && !familiarData.finado && !familiarData.vivoSano && (
        <Input
          value={familiarData.condiciones.otras as string}
          onChange={(e) => handleCondicionChange(familiarKey, 'otras', e.target.value)}
          placeholder="Especifique otras condiciones"
          className="w-full border rounded-md px-3 py-2 text-sm mt-2 shadow-inner"
        />
      )}
    </div>
  );
};

const AntecedentesHeredoFamiliares = ({ formData, handleFamiliarChange, handleCondicionChange }: AntecedentesHeredoFamiliaresProps) => {
  const [isMinimized, setIsMinimized] = useState(false);
  const [isMaximized, setIsMaximized] = useState(false);
  const [showRedaccion, setShowRedaccion] = useState(false);
  const [redaccionIA, setRedaccionIA] = useState("");
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
    const textoGenerado = familiares.map(familiar => {
      const familiarKey = getFamiliarKey(familiar);
      const familiarData = formData.antecedentesHeredoFamiliares[familiarKey] as Familiar;

      // Obtener las condiciones en un formato legible
      const condicionesText = Object.entries(familiarData.condiciones)
        .filter(([key, value]) => value)
        .map(([key, value]) => {
          switch (key) {
            case "diabetesMellitus":
              return "diabetes mellitus";
            case "hipertensionArterial":
              return "hipertensión arterial";
            case "cancer":
              return "cáncer";
            case "otras":
              return value; // Asume que 'otras' contiene texto específico
            default:
              return "";
          }
        })
        .join(", ");

      // Construir la redacción para cada familiar
      if (familiarData.vivoSano) {
        return `${familiar} está vivo y sano.`;
      } else if (familiarData.finado) {
        return `${familiar} finado por ${familiarData.causaMuerte}.`;
      } else {
        return `${familiar} está vivo con diagnóstico de ${condicionesText}.`;
      }
    }).join(" ");

    // Determinar las enfermedades más repetidas en la familia
    const enfermedadesRepetidas = new Set();
    familiares.forEach(familiar => {
      const familiarKey = getFamiliarKey(familiar);
      const familiarData = formData.antecedentesHeredoFamiliares[familiarKey] as Familiar;
      Object.entries(familiarData.condiciones).forEach(([key, value]) => {
        if (value) {
          enfermedadesRepetidas.add(key);
        }
      });
    });

    const alertaEnfermedades = Array.from(enfermedadesRepetidas)
      .map(key => {
        switch (key) {
          case "diabetesMellitus":
            return "diabetes mellitus";
          case "hipertensionArterial":
            return "hipertensión arterial";
          case "cancer":
            return "cáncer";
          default:
            return "";
        }
      })
      .filter(Boolean)
      .join(", ");

    const redaccionFinal = `
      ${textoGenerado}
      \n\nAlerta: En la familia predominan los antecedentes de: ${alertaEnfermedades}.
    `;

    setRedaccionIA(redaccionFinal);
    setShowRedaccion(true);

    setTimeout(() => {
      redaccionRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setTimeout(() => {
        window.scrollBy(0, -200);
      }, 300);
    }, 100);
  };

  const limpiarFormulario = () => {
    familiares.forEach(familiar => {
      const familiarKey = getFamiliarKey(familiar);
      handleFamiliarChange(familiarKey, 'finado', false);
      handleFamiliarChange(familiarKey, 'vivoSano', false);
      handleFamiliarChange(familiarKey, 'causaMuerte', '');
      condiciones.forEach(cond => {
        const condKey = getCondicionKey(cond);
        handleCondicionChange(familiarKey, condKey, false);
      });
    });
    setRedaccionIA("");
    setShowRedaccion(false);
  };

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

  const getCondicionKey = (condicion: string) => {
    const mapping: { [key: string]: string } = {
      "Diabetes Mellitus": "diabetesMellitus",
      "Hipertensión Arterial": "hipertensionArterial",
      "Cáncer": "cancer",
      "Otras": "otras"
    };
    return mapping[condicion];
  };

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
            <span className="text-gray-400">II.</span> Antecedentes Heredo Familiares
          </h2>
        </div>

        {showRedaccion ? (
          <div ref={redaccionRef} className="p-6">
            <Label className="text-gray-700 dark:text-gray-300">Redacción IA:</Label>
            <Textarea
              value={redaccionIA}
              readOnly
              className="min-h-[150px] max-h-[250px] w-full bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700 resize-y"
            />
            <Button
              onClick={() => navigator.clipboard.writeText(redaccionIA)}
              className="mt-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 flex items-center gap-2"
            >
              <Copy className="w-4 h-4" />
              <span>Copiar Redacción</span>
            </Button>
          </div>
        ) : (
          <div className="p-6 space-y-6">
            {familiares.map((familiar) => (
              <FamiliaRow
                key={familiar}
                familiar={familiar}
                formData={formData}
                handleFamiliarChange={handleFamiliarChange}
                handleCondicionChange={handleCondicionChange}
              />
            ))}
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

export default AntecedentesHeredoFamiliares;
