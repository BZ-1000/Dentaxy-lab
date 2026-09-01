import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useToast } from "@/components/ui/use-toast";
import { Plus, X, ChevronRight, HeartPulse, UserCheck, Skull } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FormDataState, Familiar as OriginalFamiliar } from "../types/historiaClinica";
import { cn } from "@/lib/utils";

interface Familiar extends OriginalFamiliar {
  vivoSano: boolean;
}

interface AntecedentesHeredoFamiliaresProps {
  formData: FormDataState;
  handleFamiliarChange: (familiar: string, field: string, value: string | boolean) => void;
  handleCondicionChange: (familiar: string, condicion: string, value: string | boolean) => void;
  onRedaccionGenerada?: (texto: string | React.ReactNode, textoPlano?: string) => void;
  onToggleViewMode?: () => void;
  onSectionComplete?: () => void;
  microStep?: number;
  onMicroStepChange?: (step: number) => void;
  onTotalMicroStepsChange?: (total: number, names: string[]) => void;
}

const familiaresPrincipales = [
  { nombre: "Padre", key: "padre", esFemenino: false },
  { nombre: "Madre", key: "madre", esFemenino: true },
  { nombre: "Abuelo Paterno", key: "abueloPaterno", esFemenino: false },
  { nombre: "Abuela Paterna", key: "abuelaPaterna", esFemenino: true },
  { nombre: "Abuelo Materno", key: "abueloMaterno", esFemenino: false },
  { nombre: "Abuela Materna", key: "abuelaMaterna", esFemenino: true },
];

const familiaresAdicionalesOpciones = [
  { nombre: "Hermano", key: "hermano", esFemenino: false },
  { nombre: "Hermana", key: "hermana", esFemenino: true },
  { nombre: "Tío Paterno", key: "tioPaterno", esFemenino: false },
  { nombre: "Tía Paterna", key: "tiaPaterna", esFemenino: true },
  { nombre: "Tío Materno", key: "tioMaterno", esFemenino: false },
  { nombre: "Tía Materna", key: "tiaMaterna", esFemenino: true },
  { nombre: "Primo Paterno", key: "primoPaterno", esFemenino: false },
  { nombre: "Prima Paterna", key: "primaPaterna", esFemenino: true },
  { nombre: "Primo Materno", key: "primoMaterno", esFemenino: false },
  { nombre: "Prima Materna", key: "primaMaterna", esFemenino: true },
  { nombre: "Hijo", key: "hijo", esFemenino: false },
  { nombre: "Hija", key: "hija", esFemenino: true },
];

const causasMuerteFrecuentes = [
  "Infarto agudo al miocardio",
  "Complicaciones de diabetes",
  "Cáncer",
  "Paro cardiorrespiratorio",
  "Causa natural / Vejez",
  "Accidente cerebrovascular"
];

const enfermedadesPrincipales = [
  { id: "diabetesMellitus", label: "Diabetes Mellitus" },
  { id: "hipertensionArterial", label: "Hipertensión Arterial" },
  { id: "cancer", label: "Cáncer" },
];

const sugerenciasOtrasPatologias = [
  "Insuficiencia renal crónica",
  "Asma / EPOC",
  "Artritis reumatoide",
  "Parkinson / Alzheimer",
  "Enfermedad cardíaca",
  "Osteoporosis"
];

// UI Tokens
const Heading = ({ children }: { children: React.ReactNode }) => (
  <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight text-zinc-900 dark:text-white leading-tight mb-2 drop-shadow-sm">
    {children}
  </h2>
);

const AntecedentesHeredoFamiliares = ({
  formData,
  handleFamiliarChange,
  handleCondicionChange,
  onRedaccionGenerada,
  onSectionComplete,
  onTotalMicroStepsChange,
}: AntecedentesHeredoFamiliaresProps) => {
  const { toast } = useToast();
  const [familiaresAdicionalesList, setFamiliaresAdicionalesList] = useState<typeof familiaresAdicionalesOpciones>([]);
  const [selectKey, setSelectKey] = useState<string>("");
  const [openOtrasMap, setOpenOtrasMap] = useState<Record<string, boolean>>({});

  const todosFamiliares = [...familiaresPrincipales, ...familiaresAdicionalesList];

  const defaultFamiliarData: Familiar = {
    finado: false,
    vivoSano: true,
    causaMuerte: "",
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
      otras: ""
    }
  };

  const getFamiliarData = (key: string): Familiar => {
    const raw = formData.antecedentesHeredoFamiliares[key] as Familiar | undefined;
    if (!raw) {
      return defaultFamiliarData;
    }
    const isFinado = !!raw.finado;
    const vivoSanoVal = raw.vivoSano !== undefined ? !!raw.vivoSano : (!isFinado);

    return {
      ...defaultFamiliarData,
      ...raw,
      vivoSano: vivoSanoVal,
      finado: isFinado
    };
  };

  useEffect(() => {
    if (onTotalMicroStepsChange) {
      onTotalMicroStepsChange(1, ["Antecedentes Heredofamiliares"]);
    }
  }, []);

  // Generación determinista completa de la redacción médica
  const generarTextoRedaccion = () => {
    const oraciones: string[] = [];

    todosFamiliares.forEach(({ nombre, key, esFemenino }) => {
      const data = getFamiliarData(key);
      const articulo = esFemenino ? "La " : "El ";
      const nombreMin = nombre.toLowerCase();
      const vivoTexto = esFemenino ? "está viva" : "está vivo";
      const sanoTexto = esFemenino ? "y aparentemente sana" : "y aparentemente sano";
      const finadoTexto = esFemenino ? "finada" : "finado";

      const condicionesMarcadas: string[] = [];
      if (data.condiciones?.diabetesMellitus) condicionesMarcadas.push("diabetes mellitus");
      if (data.condiciones?.hipertensionArterial) condicionesMarcadas.push("hipertensión arterial");
      if (data.condiciones?.cancer) condicionesMarcadas.push("cáncer");
      if (typeof data.condiciones?.otras === "string" && data.condiciones.otras.trim() !== "") {
        condicionesMarcadas.push(data.condiciones.otras.trim());
      }

      let conectadas = "";
      if (condicionesMarcadas.length === 1) {
        conectadas = condicionesMarcadas[0];
      } else if (condicionesMarcadas.length === 2) {
        conectadas = `${condicionesMarcadas[0]} y ${condicionesMarcadas[1]}`;
      } else if (condicionesMarcadas.length > 2) {
        const ultima = condicionesMarcadas.pop();
        conectadas = `${condicionesMarcadas.join(", ")} y ${ultima}`;
      }

      if (data.vivoSano) {
        oraciones.push(`${articulo}${nombreMin} ${vivoTexto} ${sanoTexto}.`);
      } else if (data.finado) {
        const causa = data.causaMuerte ? ` a causa de ${data.causaMuerte.trim()}` : "";
        oraciones.push(`${articulo}${nombreMin} se reporta ${finadoTexto}${causa}.`);
      } else if (conectadas) {
        oraciones.push(`${articulo}${nombreMin} ${vivoTexto} con diagnóstico de ${conectadas.toLowerCase()}.`);
      } else {
        oraciones.push(`${articulo}${nombreMin} ${vivoTexto} con afección sistémica en tratamiento.`);
      }
    });

    let textoResultante = oraciones.join(" ").trim();

    const tienePatologias = todosFamiliares.some(({ key }) => {
      const data = getFamiliarData(key);
      return !data.vivoSano && !data.finado && Object.values(data.condiciones || {}).some(v => !!v);
    });

    if (!tienePatologias) {
      if (textoResultante) {
        textoResultante += " Niega otros antecedentes heredofamiliares patológicos de relevancia clínica (incluyendo diabetes mellitus, hipertensión arterial y procesos oncológicos en familiares de primer y segundo grado).";
      } else {
        textoResultante = "El paciente niega antecedentes heredofamiliares patológicos de importancia clínica, declarando no tener familiares directos (padres, abuelos, hermanos) con diabetes mellitus, hipertensión arterial, cáncer u otras afecciones sistémicas relevantes.";
      }
    }

    return textoResultante;
  };

  const triggerLiveRedaccion = () => {
    setTimeout(() => {
      const textoHTML = generarTextoRedaccion();
      if (onRedaccionGenerada) {
        onRedaccionGenerada(textoHTML);
      }
    }, 0);
  };

  useEffect(() => {
    triggerLiveRedaccion();
  }, [formData.antecedentesHeredoFamiliares, familiaresAdicionalesList, openOtrasMap]);

  const handleEstadoVitalChange = (key: string, estado: "vivoSano" | "finado" | "enfermo") => {
    if (estado === "vivoSano") {
      handleFamiliarChange(key, "vivoSano", true);
      handleFamiliarChange(key, "finado", false);
      handleFamiliarChange(key, "causaMuerte", "");
      enfermedadesPrincipales.forEach(c => handleCondicionChange(key, c.id, false));
      handleCondicionChange(key, "otras", "");
    } else if (estado === "finado") {
      handleFamiliarChange(key, "vivoSano", false);
      handleFamiliarChange(key, "finado", true);
      enfermedadesPrincipales.forEach(c => handleCondicionChange(key, c.id, false));
      handleCondicionChange(key, "otras", "");
    } else {
      handleFamiliarChange(key, "vivoSano", false);
      handleFamiliarChange(key, "finado", false);
      handleFamiliarChange(key, "causaMuerte", "");
    }
    triggerLiveRedaccion();
  };

  const toggleOpenOtra = (key: string) => {
    const currentOtras = getFamiliarData(key).condiciones?.otras;
    const isCurrentlyActive = !!openOtrasMap[key] || (typeof currentOtras === "string" && currentOtras.trim() !== "");

    if (isCurrentlyActive) {
      handleCondicionChange(key, "otras", "");
      setOpenOtrasMap(prev => ({ ...prev, [key]: false }));
    } else {
      setOpenOtrasMap(prev => ({ ...prev, [key]: true }));
    }
    triggerLiveRedaccion();
  };

  const handleAgregarFamiliarAdicional = (valKey: string) => {
    if (!valKey) return;
    const item = familiaresAdicionalesOpciones.find(f => f.key === valKey);
    if (item && !familiaresAdicionalesList.some(f => f.key === item.key)) {
      setFamiliaresAdicionalesList(prev => [...prev, item]);
      handleEstadoVitalChange(item.key, "vivoSano");
      setSelectKey("");
      triggerLiveRedaccion();
    }
  };

  const eliminarFamiliarAdicional = (key: string) => {
    setFamiliaresAdicionalesList(prev => prev.filter(f => f.key !== key));
    triggerLiveRedaccion();
  };

  return (
    <div className="relative w-full max-w-3xl mx-auto pb-4 pt-0">
      <div className="space-y-6">
        <div>
          <Heading>Antecedentes Heredofamiliares</Heading>
          <p className="text-base text-zinc-500 dark:text-zinc-400 font-medium">
            Selecciona el estado de salud de cada familiar. Si padece o falleció, despliega opciones rápidas.
          </p>
        </div>

        {/* Lista Única de Familiares */}
        <div className="space-y-4">
          {todosFamiliares.map(({ nombre, key }) => {
            const data = getFamiliarData(key);
            const isVivoSano = data.vivoSano;
            const isFinado = data.finado;
            const isEnfermo = !isVivoSano && !isFinado;
            const currentOtras = typeof data.condiciones?.otras === "string" ? data.condiciones.otras : "";
            const isOtraActive = !!openOtrasMap[key] || currentOtras.trim() !== "";

            return (
              <div
                key={key}
                className="bg-white dark:bg-zinc-900 border-2 border-zinc-200 dark:border-zinc-800 rounded-3xl p-5 shadow-sm space-y-4 transition-all"
              >
                {/* Cabecera del Familiar y Botones Grandes */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex items-center justify-between md:justify-start gap-2 min-w-[170px]">
                    <span className="font-extrabold text-xl text-zinc-900 dark:text-zinc-100">
                      {nombre}
                    </span>
                    {familiaresAdicionalesList.some(f => f.key === key) && (
                      <button
                        type="button"
                        onClick={() => eliminarFamiliarAdicional(key)}
                        className="text-red-500 hover:text-red-700 transition-colors p-1.5 rounded-full hover:bg-red-50 dark:hover:bg-red-950/30"
                        title="Eliminar familiar"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}
                  </div>

                  {/* Botones Grandes de Estado Vital */}
                  <div className="flex-1 grid grid-cols-3 gap-2 sm:gap-3">
                    <button
                      type="button"
                      onClick={() => handleEstadoVitalChange(key, "vivoSano")}
                      className={cn(
                        "py-3.5 px-3 rounded-2xl text-sm font-bold transition-all duration-200 border-2 flex items-center justify-center gap-2 shadow-sm",
                        isVivoSano
                          ? "bg-emerald-500/10 border-emerald-500 text-emerald-700 dark:bg-emerald-500/20 dark:border-emerald-400 dark:text-emerald-300 scale-[1.02] shadow-md"
                          : "bg-zinc-50 border-zinc-200 text-zinc-600 hover:border-zinc-300 dark:bg-zinc-800/80 dark:border-zinc-700 dark:text-zinc-300"
                      )}
                    >
                      <UserCheck className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                      <span className="truncate">Sano</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleEstadoVitalChange(key, "finado")}
                      className={cn(
                        "py-3.5 px-3 rounded-2xl text-sm font-bold transition-all duration-200 border-2 flex items-center justify-center gap-2 shadow-sm",
                        isFinado
                          ? "bg-zinc-900 border-zinc-900 text-white dark:bg-white dark:border-white dark:text-zinc-900 scale-[1.02] shadow-md"
                          : "bg-zinc-50 border-zinc-200 text-zinc-600 hover:border-zinc-300 dark:bg-zinc-800/80 dark:border-zinc-700 dark:text-zinc-300"
                      )}
                    >
                      <Skull className="w-5 h-5 shrink-0" />
                      <span className="truncate">Finado</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleEstadoVitalChange(key, "enfermo")}
                      className={cn(
                        "py-3.5 px-3 rounded-2xl text-sm font-bold transition-all duration-200 border-2 flex items-center justify-center gap-2 shadow-sm",
                        isEnfermo
                          ? "bg-blue-500/10 border-blue-500 text-blue-700 dark:bg-blue-500/20 dark:border-blue-400 dark:text-blue-300 scale-[1.02] shadow-md"
                          : "bg-zinc-50 border-zinc-200 text-zinc-600 hover:border-zinc-300 dark:bg-zinc-800/80 dark:border-zinc-700 dark:text-zinc-300"
                      )}
                    >
                      <HeartPulse className="w-5 h-5 text-blue-600 dark:text-blue-400 shrink-0" />
                      <span className="truncate">Padece</span>
                    </button>
                  </div>
                </div>

                {/* --- Desplegable para FINADO --- */}
                {isFinado && (
                  <div className="pt-3 border-t border-zinc-100 dark:border-zinc-800/60 space-y-3 animate-in fade-in duration-250">
                    <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider block">
                      Causa de fallecimiento:
                    </label>
                    <input
                      type="text"
                      value={data.causaMuerte}
                      onChange={(e) => {
                        handleFamiliarChange(key, "causaMuerte", e.target.value);
                        triggerLiveRedaccion();
                      }}
                      placeholder="Escribe la causa de fallecimiento..."
                      className="w-full px-4 py-3.5 rounded-2xl bg-zinc-50 dark:bg-zinc-800 border-2 border-zinc-200 dark:border-zinc-700 font-semibold text-base text-zinc-900 dark:text-zinc-100 outline-none focus:border-zinc-900 dark:focus:border-white transition-all"
                    />

                    {/* Píldoras Rápidas para Causa de Fallecimiento */}
                    <div className="flex flex-wrap gap-2 pt-1">
                      {causasMuerteFrecuentes.map((causa) => {
                        const isSelected = data.causaMuerte.toLowerCase().includes(causa.toLowerCase());
                        return (
                          <button
                            key={causa}
                            type="button"
                            onClick={() => {
                              handleFamiliarChange(key, "causaMuerte", causa);
                              triggerLiveRedaccion();
                            }}
                            className={cn(
                              "px-3.5 py-2 rounded-xl text-xs font-bold transition-all border",
                              isSelected
                                ? "bg-zinc-900 text-white border-zinc-900 dark:bg-white dark:text-zinc-900 dark:border-white shadow-sm"
                                : "bg-white dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border-zinc-200 dark:border-zinc-700 hover:border-zinc-400 shadow-sm"
                            )}
                          >
                            + {causa}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* --- Desplegable para PADECE --- */}
                {isEnfermo && (
                  <div className="pt-3 border-t border-zinc-100 dark:border-zinc-800/60 space-y-4 animate-in fade-in duration-250">
                    {/* Título en color neutro sobrio */}
                    <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider block">
                      ¿Qué patologías padece?
                    </label>

                    {/* Botones de Enfermedades Principales + Botón Comprimido "Otra patología" */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                      {enfermedadesPrincipales.map((cond) => {
                        const isChecked = !!data.condiciones?.[cond.id as keyof typeof data.condiciones];
                        return (
                          <button
                            key={cond.id}
                            type="button"
                            onClick={() => {
                              handleCondicionChange(key, cond.id, !isChecked);
                              triggerLiveRedaccion();
                            }}
                            className={cn(
                              "py-3 px-3.5 rounded-2xl text-xs font-bold border-2 transition-all flex items-center justify-between shadow-sm",
                              isChecked
                                ? "bg-blue-500/10 border-blue-500 text-blue-900 dark:text-blue-200 shadow-md scale-[1.01]"
                                : "bg-zinc-50 border-zinc-200 dark:bg-zinc-800 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 hover:border-zinc-400"
                            )}
                          >
                            <span className="truncate">{cond.label}</span>
                            <span className="text-sm font-extrabold ml-1">{isChecked ? "✓" : "+"}</span>
                          </button>
                        );
                      })}

                      {/* Botón Otra patología */}
                      <button
                        type="button"
                        onClick={() => toggleOpenOtra(key)}
                        className={cn(
                          "py-3 px-3.5 rounded-2xl text-xs font-bold border-2 transition-all flex items-center justify-between shadow-sm",
                          isOtraActive
                            ? "bg-blue-500/10 border-blue-500 text-blue-900 dark:text-blue-200 shadow-md scale-[1.01]"
                            : "bg-zinc-50 border-zinc-200 dark:bg-zinc-800 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 hover:border-zinc-400"
                        )}
                      >
                        <span className="truncate">Otra patología</span>
                        <span className="text-sm font-extrabold ml-1">{isOtraActive ? "✓" : "+"}</span>
                      </button>
                    </div>

                    {/* Despliegue de Input y Píldoras SOLO al presionar "Otra patología" */}
                    {isOtraActive && (
                      <div className="space-y-2 pt-2 animate-in fade-in duration-200">
                        <label className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 block">
                          Especifica la otra enfermedad o selecciona una opción rápida:
                        </label>
                        <input
                          type="text"
                          value={currentOtras}
                          onChange={(e) => {
                            handleCondicionChange(key, "otras", e.target.value);
                            triggerLiveRedaccion();
                          }}
                          placeholder="Escribe otra enfermedad o selecciona una píldora..."
                          className="w-full px-4 py-3.5 rounded-2xl bg-zinc-50 dark:bg-zinc-800 border-2 border-zinc-200 dark:border-zinc-700 font-semibold text-base text-zinc-900 dark:text-zinc-100 outline-none focus:border-zinc-900 dark:focus:border-white transition-all"
                        />

                        {/* Píldoras sugeridas para Otras Patologías */}
                        <div className="flex flex-wrap gap-2 pt-1">
                          {sugerenciasOtrasPatologias.map((sug) => {
                            const isSelected = currentOtras.toLowerCase().includes(sug.toLowerCase());
                            return (
                              <button
                                key={sug}
                                type="button"
                                onClick={() => {
                                  const newText = currentOtras ? `${currentOtras}, ${sug}` : sug;
                                  handleCondicionChange(key, "otras", newText);
                                  triggerLiveRedaccion();
                                }}
                                className={cn(
                                  "px-3.5 py-2 rounded-xl text-xs font-bold transition-all border",
                                  isSelected
                                    ? "bg-blue-600 text-white border-blue-600 shadow-sm"
                                    : "bg-white dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border-zinc-200 dark:border-zinc-700 hover:border-zinc-400 shadow-sm"
                                )}
                              >
                                + {sug}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* --- Dropdown Limpio para Agregar Familiar Adicional --- */}
        <div className="pt-2 flex items-center gap-3">
          <Select
            value={selectKey}
            onValueChange={(val) => {
              setSelectKey(val);
              handleAgregarFamiliarAdicional(val);
            }}
          >
            <SelectTrigger className="w-full rounded-2xl border-2 border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-sm font-bold py-6 px-4">
              <SelectValue placeholder="+ Agregar familiar adicional (Hermanos, Tíos, Primos, Hijos...)" />
            </SelectTrigger>
            <SelectContent>
              {familiaresAdicionalesOpciones
                .filter(f => !familiaresAdicionalesList.some(item => item.key === f.key))
                .map((f) => (
                  <SelectItem key={f.key} value={f.key} className="font-medium text-sm py-2">
                    {f.nombre}
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
};

export default AntecedentesHeredoFamiliares;
