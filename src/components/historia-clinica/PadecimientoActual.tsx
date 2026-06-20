import React, { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Eraser, ChevronRight, ChevronLeft, Calendar } from "lucide-react";
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

const glassBtnBase = "rounded-3xl border transition-all duration-300 relative overflow-hidden backdrop-blur-md shadow-sm";
const glassBtnInactive = "bg-white/80 border-white/80 text-zinc-800 hover:bg-white/90 dark:bg-zinc-800/60 dark:border-white/10 dark:text-zinc-200 dark:hover:bg-zinc-800/80";
const glassBtnActive = "bg-zinc-900 text-white border-transparent shadow-[0_8px_30px_rgb(0,0,0,0.12)] scale-[1.02] dark:bg-white dark:text-zinc-900";

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

const PadecimientoActual = ({
  formData,
  handlePadecimientoChange,
  handleDolorChange,
  handleSinSintomasChange,
  onRedaccionGenerada,
  onSectionComplete,
}: PadecimientoActualProps) => {
  const { toast } = useToast();
  const defaultMotivoConsulta = "El paciente acude a consulta por ";
  const defaultLocalizacion = "Localizado en ";
  const defaultCausaProvocado = "Provocado con ";

  const [currentMicroStep, setCurrentMicroStep] = useState(0);
  const [dir, setDir] = useState(1);
  const [tieneAlivio, setTieneAlivio] = useState<boolean | null>(null);

  const motivoValue = formData.padecimientoActual.motivoConsulta;

  // Sync tieneAlivio with d.atenuacion when entering step 7
  useEffect(() => {
    if (currentMicroStep === 7) {
      if (formData.padecimientoActual.dolor.atenuacion) {
        setTieneAlivio(true);
      } else {
        setTieneAlivio(null);
      }
    }
  }, [currentMicroStep]);

  // Initialize default value if empty
  useEffect(() => {
    if (!motivoValue) {
      handlePadecimientoChange("motivoConsulta", defaultMotivoConsulta);
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
  const isLastStep = seq.indexOf(currentMicroStep) === seq.length - 1;

  // Limpieza y generación determinista del texto de redacción
  const generarTextoRedaccion = () => {
    const motivo = formData.padecimientoActual.motivoConsulta || "No especificado";
    const d = formData.padecimientoActual.dolor;

    let historyText = "";

    if (formData.padecimientoActual.sinSintomas) {
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

      sentences.push(`El dolor se manifiesta con una frecuencia ${freq} de carácter ${carac} e intensidad ${intens}.`);

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
    formData.padecimientoActual.dolor.atenuacion
  ]);

  const generarRedaccionYCompletar = () => {
    const textoHTML = generarTextoRedaccion();
    if (onRedaccionGenerada) {
      onRedaccionGenerada(textoHTML);
    }
    toast({
      title: "Sección Completada",
      description: "La redacción de Padecimiento Actual se ha guardado correctamente.",
      duration: 1500,
    });
    if (onSectionComplete) {
      onSectionComplete();
    }
  };

  const handleNext = () => {
    if (currentMicroStep === 0) {
      const limpio = motivoValue.replace(defaultMotivoConsulta, "").trim();
      if (limpio.length < 3) {
        toast({
          title: "Motivo Requerido",
          description: "Por favor escribe un motivo de consulta válido antes de continuar.",
          variant: "destructive"
        });
        return;
      }
    }

    const currentIndex = seq.indexOf(currentMicroStep);
    if (currentIndex < seq.length - 1) {
      setDir(1);
      setCurrentMicroStep(seq[currentIndex + 1]);
    } else {
      generarRedaccionYCompletar();
    }
  };

  const handlePrev = () => {
    const currentIndex = seq.indexOf(currentMicroStep);
    if (currentIndex > 0) {
      setDir(-1);
      setCurrentMicroStep(seq[currentIndex - 1]);
    }
  };

  const clearForm = () => {
    handlePadecimientoChange("motivoConsulta", defaultMotivoConsulta);
    handleSinSintomasChange(false);
    handleDolorChange("fechaInicio", "");
    handleDolorChange("condicionAparicion", "");
    handleDolorChange("frecuencia", "");
    handleDolorChange("caracter", "");
    handleDolorChange("intensidad", "moderada");
    handleDolorChange("causaProvocado", "");
    handleDolorChange("ubicacion", "");
    handleDolorChange("localizacion", { tipo: "", descripcion: "" });
    handleDolorChange("atenuacion", "");
    setCurrentMicroStep(0);
    setDir(-1);
    setTieneAlivio(null);
    toast({
      title: "Sección Reiniciada",
      description: "Se han limpiado todas las respuestas de padecimiento actual."
    });
  };

  const renderStepContent = () => {
    const d = formData.padecimientoActual.dolor;
    switch (currentMicroStep) {
      case 0:
        return (
          <div key="step-0">
            <Heading>¿Cuál es el motivo de la consulta hoy?</Heading>
            <div className="relative mb-4">
              <AIInputWithLoading
                value={motivoValue}
                onChange={(val) => {
                  if (!val.startsWith(defaultMotivoConsulta)) {
                    handlePadecimientoChange("motivoConsulta", defaultMotivoConsulta + val.replace(defaultMotivoConsulta, ''));
                  } else {
                    handlePadecimientoChange("motivoConsulta", val);
                  }
                }}
                placeholder="Ej. dolor intenso en la muela..."
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
                  setTimeout(() => {
                    setDir(1);
                    setCurrentMicroStep(2);
                  }, 250);
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
                  setTimeout(() => {
                    generarRedaccionYCompletar();
                  }, 250);
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

      case 2:
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
                    onChange={(e) => handleDolorChange("fechaInicio", e.target.value)}
                    className="w-full pl-16 pr-6 py-6 rounded-3xl bg-white/80 border border-white/80 dark:bg-zinc-800/60 dark:border-white/10 backdrop-blur-md font-medium text-xl text-zinc-900 dark:text-zinc-100 outline-none focus:ring-2 focus:ring-zinc-900/10 shadow-sm cursor-pointer appearance-none"
                  />
                </div>
              </div>

              <div>
                <SubLabel>Modo de Aparición</SubLabel>
                <ChipSelector
                  value={d.condicionAparicion}
                  onChange={(val) => handleDolorChange("condicionAparicion", val)}
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
              />
            </div>
          </div>
        );

      case 4:
        return (
          <div key="step-4">
            <Heading>Cualidades del dolor</Heading>
            <div className="space-y-6 pb-4">
              <div>
                <SubLabel>Frecuencia</SubLabel>
                <ChipSelector
                  value={d.frecuencia}
                  onChange={(val) => handleDolorChange("frecuencia", val)}
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
                  onChange={(val) => handleDolorChange("caracter", val)}
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
                        onClick={() => handleDolorChange("intensidad", level)}
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
                setTimeout(() => {
                  setDir(1);
                  setCurrentMicroStep(val === 'localizado' ? 6 : 7);
                }, 200);
              }}
              options={[
                { label: "Localizado", value: "localizado", subtitle: "En un punto exacto" },
                { label: "Irradiado", value: "irradiado", subtitle: "Se expande a otras zonas" }
              ]}
            />
          </div>
        );

      case 6:
        return (
          <div key="step-6">
            <Heading>Localización exacta</Heading>
            <div className="relative mb-4">
              <AIInputWithLoading
                value={d.localizacion?.descripcion || defaultLocalizacion}
                onChange={(val) => {
                  const finalVal = val.startsWith(defaultLocalizacion) ? val : defaultLocalizacion + val;
                  handleDolorChange("localizacion", { ...d.localizacion, descripcion: finalVal });
                }}
              />
            </div>
          </div>
        );

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
                    setTimeout(() => {
                      generarRedaccionYCompletar();
                    }, 250);
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
              />
            </div>
            <button
              onClick={() => {
                setTieneAlivio(null);
                handleDolorChange("atenuacion", "");
              }}
              className="text-xs font-semibold text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 mt-4 flex items-center gap-1 transition-colors ml-1"
            >
              ← Cambiar respuesta
            </button>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="relative w-full max-w-2xl mx-auto pb-8 pt-4">
      {/* Main Glassmorphic Container */}
      <div className="relative bg-white/80 dark:bg-zinc-900/40 backdrop-blur-xl border border-white/60 dark:border-white/10 shadow-[0_8px_32px_0_rgba(0,0,0,0.04)] dark:shadow-[0_8px_32px_0_rgba(0,0,0,0.2)] rounded-[2.5rem] p-6 sm:p-10 flex flex-col justify-between">
        
        {/* Micro Step Indicator */}
        <div className="flex justify-center gap-2 mb-10">
          {seq.map((step) => {
            const isActive = step === currentMicroStep;
            const isPast = seq.indexOf(step) < seq.indexOf(currentMicroStep);
            return (
              <div 
                key={step} 
                className={cn(
                  "h-1.5 rounded-full transition-all duration-500", 
                  isActive ? "w-8 bg-zinc-900 dark:bg-white" : 
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
              key={currentMicroStep}
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

        {/* Bottom Navigation */}
        <div className="flex justify-between items-center pt-10 mt-10 z-10">
          <div>
            {seq.indexOf(currentMicroStep) > 0 && (
              <button
                onClick={handlePrev}
                className="w-14 h-14 rounded-full bg-white/60 dark:bg-zinc-800/60 backdrop-blur-md border border-white/80 dark:border-white/10 text-zinc-600 dark:text-zinc-300 flex items-center justify-center shadow-sm hover:scale-105 hover:bg-white/90 dark:hover:bg-zinc-700/80 transition-all"
              >
                <ChevronLeft className="w-6 h-6 -ml-0.5" />
              </button>
            )}
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={clearForm}
              className="text-sm font-bold text-zinc-500 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-2xl px-5 py-3 transition-colors flex items-center"
            >
              <Eraser className="w-4 h-4 mr-2" />
              Reiniciar
            </button>

            {(!isLastStep || (currentMicroStep === 7 && tieneAlivio === true)) && (
              <button
                onClick={handleNext}
                className={cn(
                  "rounded-3xl px-8 py-4 text-lg font-bold shadow-md transition-all flex items-center gap-3",
                  isLastStep
                    ? "bg-emerald-500 text-white hover:bg-emerald-400 hover:shadow-lg scale-[1.02]"
                    : "bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 hover:scale-105"
                )}
              >
                {isLastStep ? "Finalizar" : "Siguiente"}
                <ChevronRight className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default PadecimientoActual;
