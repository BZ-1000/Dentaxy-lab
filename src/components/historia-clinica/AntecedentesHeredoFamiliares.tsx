
import React, { useState, useRef, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Minus, Maximize2, X, Eraser, Copy, CheckCircle, Plus } from "lucide-react";
import { FormDataState, Familiar as OriginalFamiliar } from "@/types/historiaClinica";
import './AntecedentesHeredoFamiliares.css';

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
        <div className="flex items-center gap-2">
          <span className="font-semibold text-sm md:text-base text-center col-span-1 text-gray-700">{familiar}</span>
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
        {!familiarData.vivoSano && (
          <button
            className={`px-2 md:px-4 py-1 md:py-2 rounded-full border shadow-sm transition-colors text-xs md:text-sm font-medium col-span-1 ${
              familiarData.finado ? "bg-red-600 text-white" : "bg-white text-gray-700 border-gray-300"
            }`}
            onClick={handleFinado}
          >
            Finado
          </button>
        )}
        {!familiarData.finado && (
          <button
            className={`px-2 md:px-4 py-1 md:py-2 rounded-full border shadow-sm transition-colors text-xs md:text-sm font-medium ${
              familiarData.vivoSano 
                ? "bg-green-600 text-white col-span-4 md:col-span-7" 
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
                className={`px-2 md:px-4 py-1 md:py-2 rounded-full border shadow-sm transition-colors text-xs md:text-sm font-medium col-span-1 ${
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
        <input
          value={familiarData.causaMuerte}
          onChange={(e) => handleFamiliarChange(familiarKey, 'causaMuerte', e.target.value)}
          placeholder="Causa de fallecimiento"
          className="w-full border rounded-md px-2 md:px-3 py-1 md:py-2 text-xs md:text-sm mt-1 md:mt-2 shadow-inner"
        />
      )}
      {familiarData.condiciones.otras && !familiarData.finado && !familiarData.vivoSano && (
        <input
          value={typeof familiarData.condiciones.otras === 'string' ? familiarData.condiciones.otras : ''}
          onChange={(e) => handleCondicionChange(familiarKey, 'otras', e.target.value)}
          placeholder="Especifique otras condiciones"
          className="w-full border rounded-md px-2 md:px-3 py-1 md:py-2 text-xs md:text-sm mt-1 md:mt-2 shadow-inner"
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
  const [copied, setCopied] = useState(false);
  const [displayedText, setDisplayedText] = useState("");
  const [progress, setProgress] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [missingFamiliares, setMissingFamiliares] = useState<string[]>([]);
  const [familiaresAdicionalsList, setFamiliaresAdicionalsList] = useState<string[]>([]);
  const [selectedFamiliar, setSelectedFamiliar] = useState<string>("");
  const redaccionRef = useRef(null);

  const todosLosFamiliares = [...familiares, ...familiaresAdicionalsList];

  useEffect(() => {
    const missing = todosLosFamiliares.filter(familiar => {
      const familiarKey = getFamiliarKey(familiar);
      const familiarData = formData.antecedentesHeredoFamiliares[familiarKey] as Familiar;
      return !(familiarData?.vivoSano || familiarData?.finado || Object.values(familiarData?.condiciones || {}).some(value => value));
    });
    setMissingFamiliares(missing);
  }, [formData, familiaresAdicionalsList]);

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

  const agregarFamiliar = () => {
    if (selectedFamiliar && !familiaresAdicionalsList.includes(selectedFamiliar)) {
      // Inicializar los datos del familiar en el formData
      const familiarKey = getFamiliarKey(selectedFamiliar);
      handleFamiliarChange(familiarKey, 'finado', false);
      handleFamiliarChange(familiarKey, 'vivoSano', false);
      handleFamiliarChange(familiarKey, 'causaMuerte', '');
      
      // Inicializar todas las condiciones
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
      const familiarData = formData.antecedentesHeredoFamiliares[familiarKey] as Familiar;

      if (!familiarData) return '';

      // Obtener las condiciones en un formato legible
      const condicionesText = Object.entries(familiarData.condiciones || {})
        .filter(([key, value]) => value)
        .map(([key, value]) => {
          switch (key) {
            case "diabetesMellitus":
              return "Diabetes mellitus";
            case "hipertensionArterial":
              return "Hipertensión arterial";
            case "cancer":
              return "Cáncer";
            case "otras":
              return typeof value === 'string' ? value : '';
            default:
              return "";
          }
        });

      // Construir la redacción para cada familiar
      const esFemenino = familiar.includes("Madre") || familiar.includes("Abuela") || familiar.includes("Tía") || familiar.includes("Prima") || familiar.includes("Hermana") || familiar.includes("Hija");
      const articuloFemenino = esFemenino ? "La " : "El ";
      const verboSerFemenino = esFemenino ? "está viva" : "está vivo";
      const verboEstarFemenino = esFemenino ? "finada" : "finado";
      const ySanoFemenino = esFemenino ? "y aparentemente sana" : "y aparentemente sano";

      let condicionesConectadas = "";
      if (condicionesText.length === 1) {
        condicionesConectadas = condicionesText[0];
      } else if (condicionesText.length === 2) {
        const [primera, segunda] = condicionesText;
        if ((primera === "Diabetes mellitus" && segunda === "Hipertensión arterial") ||
            (segunda === "Diabetes mellitus" && primera === "Hipertensión arterial")) {
          condicionesConectadas = `${primera} e ${segunda}`;
        } else {
          condicionesConectadas = `${primera} y ${segunda}`;
        }
      } else if (condicionesText.length > 2) {
        const ultimaCondicion = condicionesText.pop();
        condicionesConectadas = `${condicionesText.join(", ")} y ${ultimaCondicion}`;
      }

      if (familiarData.vivoSano) {
        return `${articuloFemenino}${familiar} ${verboSerFemenino} ${ySanoFemenino}.`;
      } else if (familiarData.finado) {
        return `${articuloFemenino}${familiar} ${verboEstarFemenino} por ${familiarData.causaMuerte}.`;
      } else if (condicionesConectadas) {
        return `${articuloFemenino}${familiar} ${verboSerFemenino} con diagnóstico de ${condicionesConectadas}.`;
      }
      return '';
    }).filter(Boolean).join(" ");

    // Determinar las enfermedades más repetidas en la familia
    const enfermedadesContador: { [key: string]: number } = {};
    todosLosFamiliares.forEach(familiar => {
      const familiarKey = getFamiliarKey(familiar);
      const familiarData = formData.antecedentesHeredoFamiliares[familiarKey] as Familiar;
      if (familiarData?.condiciones) {
        Object.entries(familiarData.condiciones).forEach(([key, value]) => {
          if (value && key !== 'otras') {
            enfermedadesContador[key] = (enfermedadesContador[key] || 0) + 1;
          }
        });
      }
    });

    const enfermedadesRepetidas = Object.entries(enfermedadesContador)
      .filter(([key, value]) => value >= 2)
      .map(([key]) => {
        switch (key) {
          case "diabetesMellitus":
            return "Diabetes mellitus";
          case "hipertensionArterial":
            return "Hipertensión arterial";
          case "cancer":
            return "Cáncer";
          default:
            return "";
        }
      })
      .filter(Boolean);

    let redaccionFinal = textoGenerado.trim();

    // Solo agregar la nota si hay enfermedades repetidas
    if (enfermedadesRepetidas.length > 0) {
      let enfermedadesConectadas = "";
      if (enfermedadesRepetidas.length === 1) {
        enfermedadesConectadas = enfermedadesRepetidas[0];
      } else if (enfermedadesRepetidas.length === 2) {
        const [primera, segunda] = enfermedadesRepetidas;
        if ((primera === "Diabetes mellitus" && segunda === "Hipertensión arterial") ||
            (segunda === "Diabetes mellitus" && primera === "Hipertensión arterial")) {
          enfermedadesConectadas = `${primera} e ${segunda}`;
        } else {
          enfermedadesConectadas = `${primera} y ${segunda}`;
        }
      } else if (enfermedadesRepetidas.length > 2) {
        const ultimaEnfermedad = enfermedadesRepetidas.pop();
        enfermedadesConectadas = `${enfermedadesRepetidas.join(", ")} y ${ultimaEnfermedad}`;
      }

      redaccionFinal += `\n\nNota: En la familia predominan los antecedentes de: ${enfermedadesConectadas}.`;
    }

    setRedaccionIA(redaccionFinal);
    setDisplayedText("");
    setShowRedaccion(true);

    setTimeout(() => {
      redaccionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setTimeout(() => {
        window.scrollBy(0, -200);
      }, 300);
    }, 100);
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
    setRedaccionIA("");
    setShowRedaccion(false);
  };

  const handleCopy = async () => {
    // Track copy click
    try {
      const { trackCopyClick } = await import('@/utils/trackCopyClick');
      trackCopyClick();
    } catch (error) {
      console.error('Error tracking copy:', error);
    }
    await navigator.clipboard.writeText(redaccionIA);
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };

  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      if (index < redaccionIA.length) {
        setDisplayedText(redaccionIA.substring(0, index + 1));
        setProgress((index / redaccionIA.length) * 100);
        index++;
      } else {
        clearInterval(interval);
      }
    }, 15);

    return () => clearInterval(interval);
  }, [redaccionIA]);

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
        <div className="flex items-center justify-between p-2 md:p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex justify-center w-full">
            <div className="flex bg-gray-200 dark:bg-gray-700 rounded-full p-0.5 md:p-1">
              <button
                onClick={() => setShowRedaccion(false)}
                className={`px-2 md:px-5 py-1 md:py-1.5 rounded-full transition-all duration-300 text-xs md:text-sm ${!showRedaccion ? "bg-blue-500 text-white shadow-md" : "text-gray-700 dark:text-gray-300"}`}
              >
                Formulario
              </button>
              <button
                onClick={() => setShowRedaccion(true)}
                className={`px-2 md:px-5 py-1 md:py-1.5 rounded-full transition-all duration-300 text-xs md:text-sm ${showRedaccion ? "bg-blue-500 text-white shadow-md" : "text-gray-700 dark:text-gray-300"}`}
              >
                Redacción IA
              </button>
            </div>
          </div>
  
          <div className="flex items-center gap-1 md:gap-2">
            <button onClick={handleMinimize} className="p-0.5 md:p-1 rounded-full bg-green-100 text-green-600 hover:bg-green-200 transition-colors" aria-label={isMinimized ? "Expandir" : "Minimizar"}>
              <Minus className="w-3 h-3 md:w-4 md:h-4" />
            </button>
            <button onClick={handleMaximize} className="p-0.5 md:p-1 rounded-full bg-yellow-100 text-yellow-600 hover:bg-yellow-200 transition-colors" aria-label={isMaximized ? "Restaurar" : "Maximizar"}>
              <Maximize2 className="w-3 h-3 md:w-4 md:h-4" />
            </button>
            <button onClick={handleClose} className="p-0.5 md:p-1 rounded-full bg-red-100 text-red-600 hover:bg-red-200 transition-colors" aria-label="Cerrar">
              <X className="w-3 h-3 md:w-4 md:h-4" />
            </button>
          </div>
        </div>
  
        <div className="flex justify-start px-3 md:px-6 py-1 md:py-2">
          <h2 className="text-base md:text-xl font-semibold flex items-center gap-2">
            <span className="text-gray-400">II.</span> Antecedentes Heredo Familiares
          </h2>
        </div>
  
        {!isMinimized && (
          <>
            {showRedaccion ? (
              <div ref={redaccionRef} className="p-3 md:p-6">
                <label className="font-mono text-xs md:text-sm font-medium text-gray-800">
                  Redacción IA...
                </label>
                <div
                  className="progress-bar-container"
                  style={{
                    width: '100%',
                    backgroundColor: '#d3d3d3',
                    borderRadius: '12px',
                    overflow: 'hidden',
                    marginBottom: '1rem',
                    boxShadow: 'inset 0 1px 2px rgba(0, 0, 0, 0.1)',
                  }}
                >
                  <div
                    className="progress-bar"
                    style={{
                      height: '6px',
                      backgroundColor: '#34c759',
                      transition: 'width 0.015s ease-in-out',
                      width: `${progress}%`,
                      borderRadius: '12px',
                    }}
                  ></div>
                </div>
                <div
                  className="min-h-[200px] w-full bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700 p-2 rounded-md justify-text"
                  style={{ whiteSpace: 'pre-wrap', wordWrap: 'break-word' }}
                >
                  {displayedText}
                </div>
  
                <Button
                  onClick={handleCopy}
                  className="mt-2 bg-blue-500 text-white px-2 md:px-4 py-1 md:py-2 rounded-lg hover:bg-blue-600 flex items-center gap-1 md:gap-2 relative text-xs md:text-sm"
                >
                  <Copy className="w-3 h-3 md:w-4 md:h-4" />
                  <span>Copiar Redacción</span>
                  {copied && (
                    <div className="absolute -top-6 md:-top-8 left-0 bg-green-500 text-white text-xs md:text-sm rounded-lg px-2 md:px-3 py-0.5 md:py-1 flex items-center gap-0.5 md:gap-1">
                      <CheckCircle className="w-3 h-3 md:w-4 md:h-4" />
                      <span>Copiado</span>
                    </div>
                  )}
                </Button>
              </div>
            ) : (
              <div className="p-3 md:p-6 space-y-3 md:space-y-6">
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
                <div className="flex items-center gap-2 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border-2 border-dashed border-gray-300">
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
            )}
  
            {!showRedaccion && (
              <div className="p-3 md:p-6 flex justify-center gap-2 md:gap-4">
                <Button onClick={generarRedaccionIA} className="bg-blue-500 text-white px-2 md:px-4 py-1 md:py-2 rounded-lg hover:bg-blue-600 flex items-center gap-1 md:gap-2 text-xs md:text-sm">
                  <span>Generar Redacción IA</span>
                </Button>
                <Button onClick={limpiarFormulario} className="bg-red-500 text-white px-2 md:px-4 py-1 md:py-2 rounded-lg hover:bg-red-600 flex items-center gap-1 md:gap-2 text-xs md:text-sm">
                  <Eraser className="w-3 h-3 md:w-4 md:h-4" />
                  <span>Limpiar Formulario</span>
                </Button>
              </div>
            )}
          </>
        )}
      </Card>
  
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
            <Button onClick={() => setShowModal(false)} className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 w-full">
              Cerrar
            </Button>
          </div>
        </div>
      )}
    </div>
  );  
};

export default AntecedentesHeredoFamiliares;
