
import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Minus, Maximize2, X, Eraser, Copy, CheckCircle, Plus, Sparkles } from "lucide-react";
import { FormDataState, Familiar as OriginalFamiliar } from "../types/historiaClinica";
import { AppleTypewriter } from "@/components/ui/AppleTypewriter";
import './AntecedentesHeredoFamiliares.css';

interface AntecedentesHeredoFamiliaresProps {
  formData: FormDataState;
  handleFamiliarChange: (familiar: string, field: string, value: string | boolean) => void;
  handleCondicionChange: (familiar: string, condicion: string, value: string | boolean) => void;
  onRedaccionGenerada?: (texto: string | React.ReactNode, textoPlano?: string) => void;
  onToggleViewMode?: () => void;
}

const familiares = [
  "Padre",
  "Madre",
  "Abuelo Paterno",
  "Abuela Paterna",
  "Abuelo Materno",
  "Abuela Materna",
];

const familiaresAdicionales = [
  "Hermano",
  "Hermana",
  "Tío Paterno",
  "Tía Paterna",
  "Tío Materno",
  "Tía Materna",
  "Primo Paterno",
  "Prima Paterna",
  "Primo Materno",
  "Prima Materna",
  "Hijo",
  "Hija"
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
  onRemove?: () => void;
  isAdditional?: boolean;
}

const FamiliaRow = ({ familiar, formData, handleFamiliarChange, handleCondicionChange, onRemove, isAdditional = false }: FamiliaRowProps) => {
  const getFamiliarKey = (familiar: string): string => {
    const mapping: { [key: string]: string } = {
      "Padre": "padre",
      "Madre": "madre",
      "Abuelo Paterno": "abueloPaterno",
      "Abuela Paterna": "abuelaPaterna",
      "Abuelo Materno": "abueloMaterno",
      "Abuela Materna": "abuelaMaterna"
    };
    return mapping[familiar] || familiar.toLowerCase().replace(/\s+/g, '');
  };

  const familiarKey = getFamiliarKey(familiar);

  // Inicializar familiarData si no existe
  const defaultFamiliarData: Familiar = {
    finado: false,
    vivoSano: false,
    causaMuerte: '',
    condiciones: {
      diabetesMellitus: false,
      hipertensionArterial: false,
      osteoporosis: false,
      artritisReumatoide: false,
      parkinson: false,
      alzheimer: false,
      asma: false,
      cancer: false,
      anemia: false,
      otras: ''
    }
  };

  const familiarData = (formData.antecedentesHeredoFamiliares[familiarKey] as Familiar) || defaultFamiliarData;

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
    <div className="flex flex-col gap-2 md:gap-4 border-b pb-4 md:pb-6">
      <div className="grid grid-cols-4 md:grid-cols-7 gap-1 md:gap-4 items-center">
        <div className="flex items-center gap-2 col-span-1">
          <span className="font-semibold text-sm md:text-base text-gray-700 truncate" title={familiar}>{familiar}</span>
          {isAdditional && onRemove && (
            <button
              onClick={onRemove}
              className="text-red-500 hover:text-red-700 transition-colors p-1 rounded-full hover:bg-gray-100"
              aria-label="Eliminar familiar"
            >
              <X className="w-3 h-3" />
            </button>
          )}
        </div>

        <button
          onClick={handleFinado}
          className={`px-2 md:px-4 py-1 md:py-2 rounded-full border shadow-sm transition-colors text-xs md:text-sm font-medium col-span-1 ${familiarData.finado
            ? "bg-gray-800 text-white border-gray-800"
            : "bg-white text-gray-700 border-gray-300 hover:bg-transparent"
            }`}
        >
          Finado
        </button>
        {!familiarData.finado && (
          <button
            className={`px-2 md:px-4 py-1 md:py-2 rounded-full border shadow-sm transition-colors text-xs md:text-sm font-medium ${familiarData.vivoSano
              ? "bg-emerald-500 text-white col-span-4 md:col-span-7"
              : "bg-white text-gray-700 border-gray-300 col-span-1"
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
                className={`px-2 md:px-4 py-1 md:py-2 rounded-full border shadow-sm transition-all text-xs md:text-sm col-span-1 ${familiarData.condiciones[condKey] 
                  ? "bg-white text-black border-black ring-1 ring-black" 
                  : "bg-white text-gray-700 border-gray-300 font-medium hover:border-gray-400"
                }`}
                onClick={() => handleCondicionChange(familiarKey, condKey, !familiarData.condiciones[condKey])}
              >
                {cond}
              </button>
            );
          })}
      </div>
      {
        familiarData.finado && (
          <input
            value={familiarData.causaMuerte}
            onChange={(e) => handleFamiliarChange(familiarKey, 'causaMuerte', e.target.value)}
            placeholder="Causa de fallecimiento"
            className="w-full border border-gray-300 bg-white rounded-md px-2 md:px-3 py-1 md:py-2 text-xs md:text-sm mt-1 md:mt-2 shadow-sm focus:border-black outline-none transition-all"
          />
        )
      }
      {
        familiarData.condiciones.otras && !familiarData.finado && !familiarData.vivoSano && (
          <input
            value={typeof familiarData.condiciones.otras === 'string' ? familiarData.condiciones.otras : ''}
            onChange={(e) => handleCondicionChange(familiarKey, 'otras', e.target.value)}
            placeholder="Especifique otras condiciones"
            className="w-full border border-gray-300 bg-white rounded-md px-2 md:px-3 py-1 md:py-2 text-xs md:text-sm mt-1 md:mt-2 shadow-sm focus:border-black outline-none transition-all"
          />
        )
      }
    </div>
  );
};

const AntecedentesHeredoFamiliares = ({ formData, handleFamiliarChange, handleCondicionChange, onRedaccionGenerada, onToggleViewMode }: AntecedentesHeredoFamiliaresProps) => {
  const [missingFamiliares, setMissingFamiliares] = useState<string[]>([]);
  const [familiaresAdicionalsList, setFamiliaresAdicionalsList] = useState<string[]>([]);
  const [selectedFamiliar, setSelectedFamiliar] = useState<string>("");
  const [showModal, setShowModal] = useState(false);

  const todosLosFamiliares = [...familiares, ...familiaresAdicionalsList];

  useEffect(() => {
    const missing = todosLosFamiliares.filter(familiar => {
      const familiarKey = getFamiliarKey(familiar);
      const familiarData = formData.antecedentesHeredoFamiliares[familiarKey] as Familiar;
      return !(familiarData?.vivoSano || familiarData?.finado || Object.values(familiarData?.condiciones || {}).some(value => value));
    });
    setMissingFamiliares(missing);
  }, [formData, familiaresAdicionalsList]);

  const agregarFamiliar = () => {
    if (selectedFamiliar && !familiaresAdicionalsList.includes(selectedFamiliar)) {
      const familiarKey = getFamiliarKey(selectedFamiliar);
      handleFamiliarChange(familiarKey, 'finado', false);
      handleFamiliarChange(familiarKey, 'vivoSano', false);
      handleFamiliarChange(familiarKey, 'causaMuerte', '');
      condiciones.forEach(cond => {
        const condKey = getCondicionKey(cond);
        handleCondicionChange(familiarKey, condKey, false);
      });
      setFamiliaresAdicionalsList([...familiaresAdicionalsList, selectedFamiliar]);
      setSelectedFamiliar("");
    }
  };

  const eliminarFamiliar = (familiar: string) => {
    setFamiliaresAdicionalsList(familiaresAdicionalsList.filter(f => f !== familiar));
  };

  const generarRedaccionIA = () => {
    if (missingFamiliares.length > 0) {
      setShowModal(true);
      return;
    }

    const textoGenerado = todosLosFamiliares.map(familiar => {
      const familiarKey = getFamiliarKey(familiar);

      const defaultFamiliarData: Familiar = {
        finado: false,
        vivoSano: false,
        causaMuerte: '',
        condiciones: {
          diabetesMellitus: false,
          hipertensionArterial: false,
          osteoporosis: false,
          artritisReumatoide: false,
          parkinson: false,
          alzheimer: false,
          asma: false,
          cancer: false,
          anemia: false,
          otras: ''
        }
      };

      const familiarData = (formData.antecedentesHeredoFamiliares[familiarKey] as Familiar) || defaultFamiliarData;

      if (!familiarData) return '';

      const condicionesText = Object.entries(familiarData.condiciones || {})
        .filter(([key, value]) => value)
        .map(([key, value]) => {
          switch (key) {
            case "diabetesMellitus": return "Diabetes mellitus";
            case "hipertensionArterial": return "Hipertensión arterial";
            case "cancer": return "Cáncer";
            case "otras": return typeof value === 'string' ? value : '';
            default: return "";
          }
        });

      const esFemenino = ["Madre", "Abuela", "Tía", "Prima", "Hermana", "Hija"].some(f => familiar.includes(f));
      const articuloFemenino = esFemenino ? "La " : "El ";
      const verboSerFemenino = esFemenino ? "está viva" : "está vivo";
      const verboEstarFemenino = esFemenino ? "finada" : "finado";
      const ySanoFemenino = esFemenino ? "y aparentemente sana" : "y aparentemente sano";

      let condicionesConectadas = "";
      if (condicionesText.length === 1) {
        condicionesConectadas = condicionesText[0];
      } else if (condicionesText.length === 2) {
        condicionesConectadas = `${condicionesText[0]} y ${condicionesText[1]}`;
      } else if (condicionesText.length > 2) {
        const ultima = condicionesText.pop();
        condicionesConectadas = `${condicionesText.join(", ")} y ${ultima}`;
      }

      if (familiarData.vivoSano) return `${articuloFemenino}${familiar} ${verboSerFemenino} ${ySanoFemenino}.`;
      if (familiarData.finado) return `${articuloFemenino}${familiar} ${verboEstarFemenino} por ${familiarData.causaMuerte}.`;
      if (condicionesConectadas) return `${articuloFemenino}${familiar} ${verboSerFemenino} con diagnóstico de ${condicionesConectadas}.`;
      return '';
    }).filter(Boolean).join(" ");

    // Redundancy check (simplified for now)

    const contenido = (
      <>
        <strong>Antecedentes Heredofamiliares:</strong>
        <div style={{ textAlign: "justify" }}>
          <AppleTypewriter speed={0.8} delay={0}>
            {textoGenerado.trim() || "Niega antecedentes heredofamiliares de importancia."}
          </AppleTypewriter>
        </div>
      </>
    );

    const redaccionTexto = `
<strong>Antecedentes Heredofamiliares:</strong><div style="text-align: justify;">${textoGenerado.trim() || "Niega antecedentes heredofamiliares de importancia."}</div>
    `.trim();

    if (onRedaccionGenerada) {
      onRedaccionGenerada(contenido, redaccionTexto);
    }
    if (onToggleViewMode) {
      onToggleViewMode();
    }
  };

  const limpiarFormulario = () => {
    todosLosFamiliares.forEach(familiar => {
      const familiarKey = getFamiliarKey(familiar);
      handleFamiliarChange(familiarKey, 'finado', false);
      handleFamiliarChange(familiarKey, 'vivoSano', false);
      handleFamiliarChange(familiarKey, 'causaMuerte', '');
      condiciones.forEach(cond => {
        const condKey = getCondicionKey(cond);
        handleCondicionChange(familiarKey, condKey, false);
      });
    });
    setFamiliaresAdicionalsList([]);
  };

  const getFamiliarKey = (familiar: string): string => {
    const mapping: { [key: string]: string } = {
      "Padre": "padre", "Madre": "madre", "Abuelo Paterno": "abueloPaterno",
      "Abuela Paterna": "abuelaPaterna", "Abuelo Materno": "abueloMaterno", "Abuela Materna": "abuelaMaterna"
    };
    return mapping[familiar] || familiar.toLowerCase().replace(/\s+/g, '');
  };

  const getCondicionKey = (condicion: string) => {
    const mapping: { [key: string]: string } = {
      "Diabetes Mellitus": "diabetesMellitus", "Hipertensión Arterial": "hipertensionArterial",
      "Cáncer": "cancer", "Otras": "otras"
    };
    return mapping[condicion];
  };

  return (
    <div className="space-y-12 max-w-3xl mx-auto py-8" data-formulario-section="antecedentes-heredofamiliares">
      <div className="space-y-6">
        {/* Familiares principales */}
        {familiares.map((familiar) => (
          <FamiliaRow
            key={familiar}
            familiar={familiar}
            formData={formData}
            handleFamiliarChange={handleFamiliarChange}
            handleCondicionChange={handleCondicionChange}
          />
        ))}

        {/* Familiares adicionales */}
        {familiaresAdicionalsList.map((familiar) => (
          <FamiliaRow
            key={familiar}
            familiar={familiar}
            formData={formData}
            handleFamiliarChange={handleFamiliarChange}
            handleCondicionChange={handleCondicionChange}
            onRemove={() => eliminarFamiliar(familiar)}
            isAdditional={true}
          />
        ))}

        {/* Selector para agregar familiares */}
        <div className="flex items-center gap-2 p-4 bg-transparent dark:bg-gray-800 rounded-lg border-2 border-dashed border-gray-300">
          <Select value={selectedFamiliar} onValueChange={setSelectedFamiliar}>
            <SelectTrigger className="flex-1">
              <SelectValue placeholder="Seleccionar familiar adicional..." />
            </SelectTrigger>
            <SelectContent>
              {familiaresAdicionales
                .filter(f => !familiaresAdicionalsList.includes(f))
                .map((familiar) => (
                  <SelectItem key={familiar} value={familiar}>
                    {familiar}
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>
          <Button
            onClick={agregarFamiliar}
            disabled={!selectedFamiliar}
            className="bg-green-500 hover:bg-green-600 text-white"
            size="sm"
          >
            <Plus className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Footer Controls */}
      <div className="flex justify-end items-center gap-4 pt-10 opacity-90 transition-opacity">
        {onToggleViewMode && (
          <Button
            variant="outline"
            onClick={generarRedaccionIA}
            className="hidden data-trigger-generation text-indigo-600 border-indigo-200 hover:bg-indigo-50 dark:border-indigo-800 dark:text-indigo-400 dark:hover:bg-indigo-900/20"
          >
            <Sparkles className="w-4 h-4 mr-2" />
            Ver Redacción IA
          </Button>
        )}

        <Button
          variant="ghost"
          onClick={limpiarFormulario}
          className="text-xs text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10"
        >
          <Eraser className="w-3 h-3 mr-2" />
          Reiniciar Sección
        </Button>
      </div>

      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full shadow-lg">
            <h2 className="text-lg font-semibold mb-4">Faltan datos</h2>
            <p className="mb-4">Por favor, selecciona al menos una opción para los siguientes familiares:</p>
            <ul className="list-disc list-inside mb-4">
              {missingFamiliares.map((familiar, index) => (
                <li key={index}>{familiar}</li>
              ))}
            </ul>
            <Button onClick={() => setShowModal(false)} className="bg-emerald-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 w-full">
              Cerrar
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AntecedentesHeredoFamiliares;
