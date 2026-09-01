import React, { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { ChevronRight, ChevronLeft, Calendar } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { AIInputWithLoading } from "@/components/ui/ai-input-with-loading";

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
        causaProvocado?: string;
        ubicacion?: string;
      };
    };
  };
  handlePadecimientoChange: (field: string, value: string) => void;
  handleDolorChange: (field: string, value: any) => void;
  handleSinSintomasChange: (checked: boolean) => void;
  onRedaccionGenerada?: (text: string | React.ReactNode, plainText?: string) => void;
  onToggleViewMode?: () => void;
  onSectionComplete?: () => void;
}

const slideVariants = {
  enter: (dir: number) => ({
    x: dir > 0 ? 40 : -40,
    opacity: 0,
    scale: 0.98
  }),
  center: {
    x: 0,
    opacity: 1,
    scale: 1,
    transition: { type: "spring", stiffness: 350, damping: 30 }
  },
  exit: (dir: number) => ({
    x: dir < 0 ? 40 : -40,
    opacity: 0,
    scale: 0.98,
    transition: { duration: 0.2 }
  })
};

// --- Glassmorphic UI Micro-Components ---

const glassBtnBase = "rounded-3xl border-2 transition-all duration-300 relative overflow-hidden backdrop-blur-md";
const glassBtnInactive = "bg-white dark:bg-zinc-800/90 border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 shadow-[5px_5px_15px_rgba(0,0,0,0.08),-4px_-4px_12px_rgba(255,255,255,1)] dark:shadow-[5px_5px_15px_rgba(0,0,0,0.5)] hover:border-zinc-400 hover:shadow-[7px_7px_18px_rgba(0,0,0,0.13),-5px_-5px_14px_rgba(255,255,255,1)] hover:scale-[1.01] active:scale-[0.99] active:shadow-[inset_3px_3px_6px_rgba(0,0,0,0.1)]";
const glassBtnActive = "bg-zinc-900 text-white border-zinc-900 shadow-[inset_4px_4px_10px_rgba(0,0,0,0.5),0_6px_20px_rgba(0,0,0,0.2)] scale-[1.01] dark:bg-white dark:text-zinc-900 dark:border-white";

const ChipSelector = ({
  options,
  value,
  onChange,
  className
}: {
  options: { label: string, value: string, subtitle?: string }[],
  value: string,
  onChange: (val: string) => void,
  className?: string
}) => (
  <div className={cn("grid gap-3", className)}>
    {options.map((opt) => {
      const active = value === opt.value;
      return (
        <button
          key={opt.value}
          onClick={() => onChange(opt.value)}
          className={cn(
            glassBtnBase, "p-5 text-left w-full flex flex-col justify-center",
            active ? glassBtnActive : glassBtnInactive
          )}
        >
          <span className="text-lg font-bold">{opt.label}</span>
          {opt.subtitle && (
            <span className={cn("text-sm mt-1", active ? "text-zinc-300 dark:text-zinc-600" : "text-zinc-600 dark:text-zinc-400")}>
              {opt.subtitle}
            </span>
          )}
        </button>
      );
    })}
  </div>
);

const Heading = ({ children }: { children: React.ReactNode }) => (
  <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight text-zinc-900 dark:text-white leading-tight mb-8 drop-shadow-sm">
    {children}
  </h2>
);

const SubLabel = ({ children }: { children: React.ReactNode }) => (
  <label className="text-xs font-bold text-zinc-900 dark:text-zinc-200 uppercase tracking-widest block mb-3 ml-1">
    {children}
  </label>
);

interface PadecimientoActualProps {
  formData: any;
  handlePadecimientoChange: (field: string, value: string) => void;
  handleDolorChange: (field: string, value: any) => void;
  handleSinSintomasChange: (checked: boolean) => void;
  onRedaccionGenerada: (html: string) => void;
  onToggleViewMode?: () => void;
  onSectionComplete?: () => void;
  microStep?: number;
  onMicroStepChange?: (step: number) => void;
  onTotalMicroStepsChange?: (total: number, names: string[]) => void;
}

const stepsDefinitions = [
  { id: 0, nombre: "Motivo de Consulta" },
  { id: 1, nombre: "Inicio del Padecimiento" },
  { id: 2, nombre: "Condición de Aparición" },
  { id: 3, nombre: "Causa Específica" },
  { id: 4, nombre: "Frecuencia" },
  { id: 5, nombre: "Naturaleza del Dolor" },
  { id: 6, nombre: "Tipo de Localización" },
  { id: 7, nombre: "Atenuación" }
];

const PadecimientoActual = ({
  formData,
  handlePadecimientoChange,
  handleDolorChange,
  handleSinSintomasChange,
  onRedaccionGenerada,
  onSectionComplete,
  microStep = 0,
  onMicroStepChange,
  onTotalMicroStepsChange,
}: PadecimientoActualProps) => {
  const { toast } = useToast();
  const defaultMotivoConsulta = "El paciente acude a consulta por ";
  const defaultLocalizacion = "Localizado en ";
  const defaultCausaProvocado = "Provocado con ";

  const [dir, setDir] = useState(1);
  const [tieneAlivio, setTieneAlivio] = useState<boolean | null>(null);
  const [showToothPicker, setShowToothPicker] = useState(false);

  const motivoValue = formData.padecimientoActual.motivoConsulta;

  const autoAdvance = (delay = 250) => {
    setTimeout(() => {
      onMicroStepChange?.(microStep + 1);
    }, delay);
  };

  // Al entrar al step 7 (Atenuación), resetear tieneAlivio SOLO si no hay valor de atenuación guardado.
  // NUNCA auto-establecer tieneAlivio=true desde un useEffect — solo el clic del usuario debe hacerlo.
  useEffect(() => {
    if (seq[microStep] === 7) {
      // Si llegamos al step 7 y tieneAlivio está en null (estado inicial), lo dejamos en null
      // para que el usuario vea la pregunta. Solo si el usuario ya eligió antes y hay texto, lo mantenemos.
      const hayAtenuacionGuardada = !!(formData.padecimientoActual.dolor.atenuacion?.trim());
      if (!hayAtenuacionGuardada) {
        setTieneAlivio(null);
      }
      // Si hay texto guardado y tieneAlivio aún no está confirmado, lo inferimos
      if (hayAtenuacionGuardada && tieneAlivio === null) {
        setTieneAlivio(true);
      }
    }
  }, [microStep]);

  // Initialize default value if empty
  useEffect(() => {
    if (motivoValue === undefined || motivoValue === null) {
      handlePadecimientoChange("motivoConsulta", "");
    }
  }, []);

  const getStepsSequence = () => {
    const seq = [0, 1];
    if (formData.padecimientoActual.sinSintomas) {
      return seq;
    }
    seq.push(2);
    if (formData.padecimientoActual.dolor.condicionAparicion === "provocado") {
      seq.push(3);
    }
    seq.push(4);
    seq.push(5);
    if (formData.padecimientoActual.dolor.ubicacion === "localizado") {
      seq.push(6);
    }
    seq.push(7);
    return seq;
  };

  const seq = getStepsSequence();
  // currentMicroStep is now controlled by the parent, but it points to the raw step ID.
  // We need to map the raw IDs to a linear sequence 0 to N-1 for the parent.
  // Wait, no. If parent just passes activeMicroStep from 0 to N-1, we map it to seq[activeMicroStep]
  const currentMicroStepId = seq[microStep] ?? seq[0];
  const isLastStep = microStep === seq.length - 1;

  useEffect(() => {
    if (onTotalMicroStepsChange) {
      const names = seq.map(id => stepsDefinitions.find(s => s.id === id)?.nombre || `Paso ${id}`);
      onTotalMicroStepsChange(seq.length, names);
    }
  }, [seq.length]);

  // Limpieza y generación determinista del texto de redacción
  const generarTextoRedaccion = (overrideSinSintomas?: boolean) => {
    const isSinSintomas = overrideSinSintomas !== undefined ? overrideSinSintomas : formData.padecimientoActual.sinSintomas;
    const motivo = formData.padecimientoActual.motivoConsulta || "No especificado";
    const d = formData.padecimientoActual.dolor;

    let historyText = "";

    if (isSinSintomas) {
      historyText = "El paciente refiere encontrarse asintomático al momento de la consulta, negando dolor o molestia alguna.";
    } else {
      let sentences = [];

      const motivoRaw = formData.padecimientoActual.motivoConsulta || "No especificado";
      const motivoClean = motivoRaw.replace(/^(el paciente (acude|viene|se presenta) (a|a la) consulta (por|manifestando)|acude a consulta por|motivo de consulta:)\s*/gi, "").trim();
      const motivoFinal = motivoClean.charAt(0).toUpperCase() + motivoClean.slice(1);

      sentences.push(`El paciente acude a consulta manifestando: "${motivoFinal}".`);

      const cond = d.condicionAparicion?.toLowerCase() || "";
      if (cond.includes("espont")) {
        let feat = "Refiere un cuadro de dolor de aparición espontánea";
        if (d.fechaInicio) feat += ` con una evolución constante desde el ${d.fechaInicio}`;
        sentences.push(feat + ".");
      } else if (cond.includes("provoc")) {
        const causaRaw = d.causaProvocado || "";
        const causaClean = causaRaw.replace(/^(provocado con|provocado por|se provoca con|al|con|por) /gi, "").trim();
        sentences.push(`Presenta sintomatología de manera provocada, exacerbada específicamente ante ${causaClean}.`);
      }

      const freq = d.frecuencia?.toLowerCase() || "no especificada";
      const carac = d.caracter?.toLowerCase() || "no especificado";
      const intens = d.intensidad?.toLowerCase() || "moderada";

      sentences.push(`El dolor se manifests con una frecuencia ${freq} de carácter ${carac} e intensidad ${intens}.`);

      if (d.localizacion?.descripcion) {
        const tipo = d.localizacion.tipo;
        const descRaw = d.localizacion.descripcion;
        const descClean = descRaw.replace(/^(localizado en|localizado|en la zona de|en) /gi, "").trim();

        if (tipo === "Irradiado") {
          sentences.push(`La sintomatología es de naturaleza difusa y se irradia hacia zonas adyacentes, sin presentar un punto de origen localizado.`);
        } else if (tipo === "Localizado") {
          sentences.push(`El foco doloroso se percibe estrictamente localizado en un punto clínico específico (${descClean}).`);
        }
      }

      if (d.atenuacion) {
        const aten = d.atenuacion.replace(/^(cede con|disminuye con|con|por|al) /gi, "").trim();
        sentences.push(`El paciente reporta mejoría ante ${aten}.`);
      } else if (tieneAlivio === false) {
        sentences.push(`El paciente refiere que el dolor es persistente y no remite con ninguna maniobra ni tratamiento previo.`);
      }

      historyText = sentences.join(" ");
    }

    const formatTitle = (title: string) => `<span class="block text-xs font-semibold uppercase tracking-widest text-zinc-600 dark:text-zinc-400 mt-4 mb-1">${title}</span>`;
    return `${formatTitle("Motivo de consulta")}${motivo}<br/>${formatTitle("Historia del padecimiento")}${historyText}`.trim();
  };

  useEffect(() => {
    const textoHTML = generarTextoRedaccion();
    if (onRedaccionGenerada) {
      onRedaccionGenerada(textoHTML);
    }
  }, [
    formData.padecimientoActual.motivoConsulta,
    formData.padecimientoActual.sinSintomas,
    formData.padecimientoActual.dolor.fechaInicio,
    formData.padecimientoActual.dolor.condicionAparicion,
    formData.padecimientoActual.dolor.causaProvocado,
    formData.padecimientoActual.dolor.frecuencia,
    formData.padecimientoActual.dolor.caracter,
    formData.padecimientoActual.dolor.intensidad,
    formData.padecimientoActual.dolor.ubicacion,
    formData.padecimientoActual.dolor.localizacion.tipo,
    formData.padecimientoActual.dolor.localizacion.descripcion,
    formData.padecimientoActual.dolor.atenuacion,
    tieneAlivio
  ]);

  const generarRedaccionYCompletar = (overrideSinSintomas?: boolean) => {
    const textoHTML = generarTextoRedaccion(overrideSinSintomas);
    if (onRedaccionGenerada) {
      onRedaccionGenerada(textoHTML);
    }
    toast({
      title: "Sección Completada",
      description: "La redacción de Padecimiento Actual se ha guardado correctamente.",
      duration: 1500,
    });
    setTimeout(() => {
      if (onSectionComplete) {
        onSectionComplete();
      }
    }, 150);
  };

  const renderStepContent = () => {
    const d = formData.padecimientoActual.dolor;
    switch (currentMicroStepId) {
      case 0:
        return (
          <div key="step-0">
            <Heading>¿Cuál es el motivo de la consulta hoy?</Heading>
            <div className="relative mb-4">
              <AIInputWithLoading
                value={motivoValue}
                onChange={(val) => {
                  handlePadecimientoChange("motivoConsulta", val);
                }}
                placeholder="Ej. dolor de muela, limpieza, revisión..."
                starterPhrases={[
                  "El paciente acude a consulta por ",
                  "Acude a consulta por ",
                  "Se presenta a consulta por ",
                  "Refiere "
                ]}
                contextSuggestions={[
                  "revisión general de rutina",
                  "dolor intenso en una muela",
                  "limpieza dental profesional (profilaxis)",
                  "sangrado e inflamación de encías",
                  "sensibilidad al frío y al calor",
                  "caries en dientes frontales",
                  "caída o fractura de una resina/restauración",
                  "caída de una corona dental",
                  "valoración para tratamiento de ortodoncia (brackets)",
                  "molestia o dolor al masticar",
                  "extracción de muela del juicio (tercer molar)",
                  "diseño de sonrisa / blanqueamiento dental",
                  "mal aliento (halitosis) constante"
                ]}
              />
            </div>
          </div>
        );

      case 1:
        return (
          <div key="step-1" className="flex flex-col h-full">
            <Heading>¿El paciente refiere dolor o sintomatología activa?</Heading>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
              <button
                onClick={() => {
                  handleSinSintomasChange(false);
                  onMicroStepChange?.(microStep + 1);
                }}
                className={cn(
                  glassBtnBase, "p-8 flex flex-col items-center justify-center gap-4 text-center",
                  !formData.padecimientoActual.sinSintomas
                    ? "bg-red-500/10 border-red-500 text-red-700 dark:bg-red-500/20 dark:border-red-400 dark:text-red-300 scale-[1.02]"
                    : glassBtnInactive
                )}
              >
                <span className="text-5xl mb-2 drop-shadow-sm">😫</span>
                <span className="text-xl font-bold">Sí, hay dolor</span>
              </button>

              <button
                onClick={() => {
                  handleSinSintomasChange(true);
                  generarRedaccionYCompletar(true);
                }}
                className={cn(
                  glassBtnBase, "p-8 flex flex-col items-center justify-center gap-4 text-center",
                  formData.padecimientoActual.sinSintomas
                    ? "bg-emerald-500/10 border-emerald-500 text-emerald-700 dark:bg-emerald-500/20 dark:border-emerald-400 dark:text-emerald-300 scale-[1.02]"
                    : glassBtnInactive
                )}
              >
                <span className="text-5xl mb-2 drop-shadow-sm">😌</span>
                <span className="text-xl font-bold">Sin síntomas</span>
              </button>
            </div>
          </div>
        );

      case 2: {
        const checkStep2Complete = (newFecha?: string, newCond?: string) => {
          const fecha = newFecha !== undefined ? newFecha : d.fechaInicio;
          const cond = newCond !== undefined ? newCond : d.condicionAparicion;
          if (fecha && cond) {
            autoAdvance(250);
          }
        };

        return (
          <div key="step-2">
            <Heading>¿Desde cuándo y cómo aparece?</Heading>
            <div className="space-y-8">
              <div>
                <SubLabel>Fecha de Inicio</SubLabel>
                <div className="relative">
                  <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none text-zinc-500 dark:text-zinc-400">
                    <Calendar className="w-6 h-6" strokeWidth={1.5} />
                  </div>
                  <input
                    type="date"
                    value={d.fechaInicio}
                    onChange={(e) => {
                      const val = e.target.value;
                      handleDolorChange("fechaInicio", val);
                      checkStep2Complete(val, undefined);
                    }}
                    className="w-full pl-16 pr-6 py-6 rounded-3xl bg-white dark:bg-zinc-900 border-2 border-zinc-200 dark:border-zinc-700 font-medium text-xl text-zinc-900 dark:text-zinc-100 outline-none focus:outline-none focus:border-zinc-900 dark:focus:border-white focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0 transition-all shadow-sm cursor-pointer appearance-none"
                  />
                </div>
              </div>

              <div>
                <SubLabel>Modo de Aparición</SubLabel>
                <ChipSelector
                  value={d.condicionAparicion}
                  onChange={(val) => {
                    handleDolorChange("condicionAparicion", val);
                    checkStep2Complete(undefined, val);
                  }}
                  className="grid-cols-2"
                  options={[
                    { label: "Espontáneo", value: "espontaneo", subtitle: "Aparece solo" },
                    { label: "Provocado", value: "provocado", subtitle: "Requiere estímulo" }
                  ]}
                />
              </div>
            </div>
          </div>
        );
      }

      case 3:
        return (
          <div key="step-3">
            <Heading>¿Qué estímulo provoca el dolor?</Heading>
            <div className="relative mb-4">
              <AIInputWithLoading
                value={d.causaProvocado || defaultCausaProvocado}
                onChange={(val) => {
                  handleDolorChange("causaProvocado", val.startsWith(defaultCausaProvocado) ? val : defaultCausaProvocado + val);
                }}
                protectedPrefix={defaultCausaProvocado}
                contextSuggestions={[
                  "frío",
                  "calor",
                  "dulce",
                  "ácido",
                  "masticar",
                  "presión",
                  "aire frío",
                  "líquidos fríos",
                  "alimentos calientes",
                  "cambios de temperatura",
                  "cepillado dental",
                  "estímulos térmicos"
                ]}
              />
            </div>
          </div>
        );

      case 4: {
        const checkStep4Complete = (newFreq?: string, newCarac?: string, newIntens?: string) => {
          const f = newFreq !== undefined ? newFreq : d.frecuencia;
          const c = newCarac !== undefined ? newCarac : d.caracter;
          const i = newIntens !== undefined ? newIntens : d.intensidad;
          if (f && c && i) {
            autoAdvance(250);
          }
        };

        return (
          <div key="step-4">
            <Heading>Cualidades del dolor</Heading>
            <div className="space-y-6 pb-4">
              <div>
                <SubLabel>Frecuencia</SubLabel>
                <ChipSelector
                  value={d.frecuencia}
                  onChange={(val) => {
                    handleDolorChange("frecuencia", val);
                    checkStep4Complete(val, undefined, undefined);
                  }}
                  className="grid-cols-1 sm:grid-cols-2"
                  options={[
                    { label: "Intermitente", value: "intermitente", subtitle: "Va y viene" },
                    { label: "Continua", value: "continua", subtitle: "Todo el tiempo" }
                  ]}
                />
              </div>

              <div>
                <SubLabel>Carácter</SubLabel>
                <ChipSelector
                  value={d.caracter}
                  onChange={(val) => {
                    handleDolorChange("caracter", val);
                    checkStep4Complete(undefined, val, undefined);
                  }}
                  className="grid-cols-2"
                  options={[
                    { label: "Pulsátil", value: "pulsatil", subtitle: "Latido" },
                    { label: "Sordo", value: "sordo", subtitle: "Molestia constante" },
                    { label: "Quemante", value: "quemante", subtitle: "Ardor" },
                    { label: "Opresivo", value: "opresivo", subtitle: "Presión" }
                  ]}
                />
              </div>

              <div>
                <SubLabel>Intensidad</SubLabel>
                <div className="grid grid-cols-3 gap-3">
                  {['leve', 'moderada', 'severa'].map((level) => {
                    const active = d.intensidad === level;
                    let activeClass = "";
                    if (active) {
                       if (level === 'leve') activeClass = "bg-emerald-500/10 border-emerald-500 text-emerald-700 dark:bg-emerald-500/20 dark:border-emerald-400 dark:text-emerald-300 shadow-md scale-[1.02]";
                       if (level === 'moderada') activeClass = "bg-amber-500/10 border-amber-500 text-amber-700 dark:bg-amber-500/20 dark:border-amber-400 dark:text-amber-300 shadow-md scale-[1.02]";
                       if (level === 'severa') activeClass = "bg-red-500/10 border-red-500 text-red-700 dark:bg-red-500/20 dark:border-red-400 dark:text-red-300 shadow-md scale-[1.02]";
                    }
                    return (
                      <button
                        key={level}
                        onClick={() => {
                          handleDolorChange("intensidad", level);
                          checkStep4Complete(undefined, undefined, level);
                        }}
                        className={cn(
                          glassBtnBase, "py-5 text-center font-bold capitalize text-base",
                          active ? activeClass : glassBtnInactive
                        )}
                      >
                        {level}
                      </button>
                    )
                  })}
                </div>
              </div>
            </div>
          </div>
        );
      }

      case 5:
        return (
          <div key="step-5">
            <Heading>¿Dónde se localiza?</Heading>
            <ChipSelector
              value={d.ubicacion || ''}
              onChange={(val) => {
                handleDolorChange("ubicacion", val);
                handleDolorChange("localizacion", {
                  ...d.localizacion,
                  tipo: val === 'localizado' ? 'Localizado' : val === 'irradiado' ? 'Irradiado' : ''
                });
                autoAdvance(250);
              }}
              options={[
                { label: "Localizado", value: "localizado", subtitle: "En un punto exacto" },
                { label: "Irradiado", value: "irradiado", subtitle: "Se expande a otras zonas" }
              ]}
            />
          </div>
        );

      case 6: {
        const descActual = d.localizacion?.descripcion || defaultLocalizacion;
        return (
          <div key="step-6">
            <Heading>Localización exacta</Heading>
            <div className="relative mb-4">
              <AIInputWithLoading
                value={descActual}
                onChange={(val) => {
                  const finalVal = val.startsWith(defaultLocalizacion) ? val : defaultLocalizacion + val;
                  handleDolorChange("localizacion", { ...d.localizacion, descripcion: finalVal });
                }}
                protectedPrefix={defaultLocalizacion}
                renderCustomFirstSuggestion={
                  <button
                    type="button"
                    onMouseDown={(e) => {
                      e.preventDefault();
                      setShowToothPicker(prev => !prev);
                    }}
                    className={cn(
                      "text-sm font-semibold px-5 py-2.5 rounded-full border transition-all duration-300 hover:scale-105 shadow-sm",
                      showToothPicker
                        ? "bg-zinc-900 text-white border-transparent dark:bg-white dark:text-zinc-900"
                        : "bg-emerald-500 text-white border-emerald-600 hover:bg-emerald-600 dark:bg-emerald-600 dark:hover:bg-emerald-500"
                    )}
                  >
                    🦷 {showToothPicker ? "Ocultar números de diente" : "Seleccionar por número de diente"}
                  </button>
                }
                contextSuggestions={showToothPicker ? [] : [
                  "la región premolar superior derecha",
                  "el sector anterior inferior",
                  "el primer molar inferior izquierdo",
                  "la zona mandibular posterior",
                  "los dientes posteriores superiores",
                  "la región del tercer molar",
                  "el hemicuadrante maxilar derecho",
                  "la arcada inferior",
                  "la mucosa gingival vestibular"
                ]}
              />
            </div>

            {/* Panel selector de órgano dental por número FDI (Multiselección) */}
            {showToothPicker && (
              <div className="mt-2 p-4 rounded-3xl bg-white/80 dark:bg-zinc-900/80 border border-zinc-200 dark:border-zinc-800 backdrop-blur-md shadow-sm animate-in fade-in duration-300">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-widest">
                    Notación FDI — selecciona uno o varios dientes:
                  </p>
                  <span className="text-xs text-zinc-400">Selección múltiple activa</span>
                </div>

                {[{label: "Superior Der.", teeth: [11,12,13,14,15,16,17,18]}, {label: "Superior Izq.", teeth: [21,22,23,24,25,26,27,28]}, {label: "Inferior Izq.", teeth: [31,32,33,34,35,36,37,38]}, {label: "Inferior Der.", teeth: [41,42,43,44,45,46,47,48]}].map(quad => (
                  <div key={quad.label} className="mb-3">
                    <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-1.5 ml-1">{quad.label}</p>
                    <div className="flex flex-wrap gap-1.5">
                      {quad.teeth.map(num => {
                        const toothStr = `${num}`;
                        // Verificar si ya está presente en el texto
                        const isSelected = descActual.includes(toothStr);
                        return (
                          <button
                            key={num}
                            type="button"
                            onClick={() => {
                              let newDesc = descActual;
                              if (isSelected) {
                                // Remover el diente si se hace clic de nuevo
                                newDesc = newDesc
                                  .replace(new RegExp(`órg(?:ano)?s?\\.? dentales?\\s*`, 'gi'), '')
                                  .split(',')
                                  .map(s => s.trim())
                                  .filter(s => s !== toothStr && s !== defaultLocalizacion.trim() && s !== "")
                                  .join(', ');
                                
                                if (newDesc.length > 0) {
                                  newDesc = defaultLocalizacion + (newDesc.includes("órganos dentales") || newDesc.includes("órgano dental") ? newDesc : `los órganos dentales ${newDesc}`);
                                } else {
                                  newDesc = defaultLocalizacion;
                                }
                              } else {
                                // Agregar nuevo diente a la selección
                                const extra = descActual.replace(defaultLocalizacion, '').trim();
                                // Extraer los números ya seleccionados si los hay
                                const teethMatch = extra.match(/\d+/g);
                                const currentTeeth = teethMatch ? Array.from(new Set([...teethMatch, toothStr])) : [toothStr];
                                const label = currentTeeth.length > 1 ? "los órganos dentales" : "el órgano dental";
                                newDesc = defaultLocalizacion + `${label} ${currentTeeth.join(', ')}`;
                              }
                              handleDolorChange("localizacion", { ...d.localizacion, descripcion: newDesc });
                            }}
                            className={cn(
                              "w-10 h-10 rounded-xl border text-sm font-bold transition-all duration-200 hover:scale-110 shadow-sm flex items-center justify-center",
                              isSelected
                                ? "bg-emerald-600 border-emerald-600 text-white dark:bg-emerald-500 dark:border-emerald-500 scale-105 shadow-emerald-500/20"
                                : "bg-white/80 border-zinc-200 text-zinc-800 hover:bg-emerald-50 hover:border-emerald-400 hover:text-emerald-700 dark:bg-zinc-800/60 dark:border-white/10 dark:text-zinc-200"
                            )}
                          >
                            {num}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      }

      case 7:
        if (tieneAlivio === null) {
          return (
            <div key="step-7" className="flex flex-col h-full animate-in fade-in duration-300">
              <Heading>¿Hay algo que lo alivie?</Heading>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
                <button
                  onClick={() => {
                    setTieneAlivio(true);
                  }}
                  className={cn(
                    glassBtnBase, "p-8 flex flex-col items-center justify-center gap-4 text-center hover:scale-[1.02]",
                    glassBtnInactive
                  )}
                >
                  <span className="text-5xl mb-2 drop-shadow-sm">💊</span>
                  <span className="text-xl font-bold">Sí, algo lo alivia</span>
                </button>

                <button
                  onClick={() => {
                    setTieneAlivio(false);
                    handleDolorChange("atenuacion", "");
                    generarRedaccionYCompletar();
                  }}
                  className={cn(
                    glassBtnBase, "p-8 flex flex-col items-center justify-center gap-4 text-center hover:scale-[1.02]",
                    glassBtnInactive
                  )}
                >
                  <span className="text-5xl mb-2 drop-shadow-sm">❌</span>
                  <span className="text-xl font-bold">No, nada lo alivia</span>
                </button>
              </div>
            </div>
          );
        }
        return (
          <div key="step-7-input" className="animate-in fade-in duration-300">
            <Heading>¿Qué alivia el dolor?</Heading>
            <div className="relative mb-4">
              <AIInputWithLoading
                value={d.atenuacion}
                onChange={(val) => handleDolorChange("atenuacion", val)}
                placeholder="Ej. analgésicos, compresas frías..."
                contextSuggestions={[
                  "ibuprofeno 400 mg",
                  "paracetamol 500 mg",
                  "naproxeno",
                  "ketorolaco",
                  "compresas frías",
                  "compresas calientes",
                  "el reposo",
                  "no masticar de ese lado",
                  "enjuagues con agua sal",
                  "clonixinato de lisina",
                  "dexametasona",
                  "evitar alimentos fríos o calientes"
                ]}
              />
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="relative w-full max-w-2xl mx-auto pb-4 pt-0">
      {/* Container Transparente (Sin doble fondo) */}
      <div className="relative bg-transparent p-1 sm:p-2 flex flex-col justify-between">
        
        {/* Micro Step Indicator Centrado Minimalista */}
        <div className="flex items-center justify-center w-full mb-6 gap-1.5 mx-auto">
          {seq.map((step) => {
            const isActive = step === currentMicroStepId;
            const isPast = seq.indexOf(step) < seq.indexOf(currentMicroStepId);
            return (
              <div 
                key={step} 
                className={cn(
                  "h-1.5 rounded-full transition-all duration-300", 
                  isActive ? "w-7 bg-zinc-900 dark:bg-white shadow-sm" : 
                  isPast ? "w-2 bg-zinc-400 dark:bg-zinc-500" : "w-1.5 bg-zinc-200 dark:bg-zinc-800"
                )} 
              />
            )
          })}
        </div>

        {/* Dynamic Content Area */}
        <div className="w-full">
          <AnimatePresence mode="wait" custom={dir}>
            <motion.div
              key={currentMicroStepId}
              custom={dir}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              className="w-full"
            >
              {renderStepContent()}
            </motion.div>
          </AnimatePresence>
        </div>



      </div>
    </div>
  );
};

export default PadecimientoActual;
