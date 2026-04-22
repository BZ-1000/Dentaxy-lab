import React, { useState, useRef, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Eraser, Mic, ChevronRight, Sparkles, Activity, HeartPulse, Copy, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import CaracteristicasDolor from "./padecimiento/CaracteristicasDolor";
import { useIsMobile } from "../hooks/use-mobile";
import { AIInputWithLoading } from "@/components/ui/ai-input-with-loading";
import { AppleTypewriter } from "@/components/ui/AppleTypewriter";

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
}

// --- Micro-Components ---

const ChatBubbleLabel = ({ children, icon: Icon }: { children: React.ReactNode, icon?: any }) => (
  <div className="flex items-start gap-3 mb-3 animate-in fade-in slide-in-from-left-4 duration-500">
    <div className="w-7 h-7 flex-shrink-0 flex items-center justify-center -ml-1 -mt-1">
      {Icon ? (
        <div className="w-full h-full flex items-center justify-center text-blue-500 dark:text-blue-400">
          <Icon className="w-5 h-5" />
        </div>
      ) : (
        <img src="/dentaxy-ai-avatar.png" alt="Dentaxy AI" className="w-full h-full object-contain" />
      )}
    </div>
    <div className="bg-gray-100 dark:bg-zinc-800 px-4 py-2 rounded-2xl rounded-tl-sm text-sm font-medium text-gray-700 dark:text-gray-200 shadow-sm border border-gray-200/50 dark:border-white/5">
      {children}
    </div>
  </div>
);

// --- Scroll Focus Wrapper ---
// Only fades out when leaving the TOP 15% of the screen.
// Bottom margin is massively extended (2000px) so content entering from the bottom is "In View" instantly.
const ScrollFocusSection = ({
  children,
  className
}: {
  children: React.ReactNode,
  className?: string
}) => {
  return (
    <motion.div
      initial={{ opacity: 0.3, filter: "grayscale(100%)", scale: 0.98 }}
      whileInView={{ opacity: 1, filter: "grayscale(0%)", scale: 1 }}
      // Top: -100px (approx header height + padding). Start fading when it hits the visual ceiling.
      // Bottom: 200% (Everything below is visible).
      viewport={{ margin: "-100px 0px 2000px 0px", amount: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className={cn(
        "transition-all duration-300 will-change-[opacity,filter]",
        className
      )}
    >
      {children}
    </motion.div>
  );
};

// --- SELF-CONTAINED COPY BUTTON (Fixes Stale State Bug) ---
const CopyButton = ({ textToCopy }: { textToCopy: string }) => {
  const { toast } = useToast();
  const [isCopied, setIsCopied] = useState(false);

  return (
    <Button
      variant="ghost"
      size="sm"
      className={cn(
        "h-9 px-3 transition-all duration-300",
        isCopied
          ? "text-green-600 bg-green-50 hover:text-green-600 hover:bg-green-50 dark:bg-green-900/30 dark:hover:bg-green-900/30" // Success: Forced Green (including hover)
          : "text-zinc-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:text-blue-400 dark:hover:bg-blue-900/20" // Hover: Blue as requested
      )}
      onClick={() => {
        navigator.clipboard.writeText(textToCopy);
        setIsCopied(true);
        toast({
          title: "Redacción copiada",
          description: "Texto copiado al portapapeles",
          duration: 1500,
        });
        setTimeout(() => setIsCopied(false), 1000);
      }}
    >
      <AnimatePresence mode="wait">
        {isCopied ? (
          <motion.div
            key="copied"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            className="flex items-center justify-center"
          >
            <Check className="w-4 h-4" />
          </motion.div>
        ) : (
          <motion.div
            key="copy"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            className="flex items-center gap-2"
          >
            <Copy className="w-4 h-4" />
            <span className="hidden group-hover:inline">Copiar</span>
          </motion.div>
        )}
      </AnimatePresence>
    </Button>
  );
};

// --- Component ---

const PadecimientoActual = ({
  formData,
  handlePadecimientoChange,
  handleDolorChange,
  handleSinSintomasChange,
  onToggleViewMode,
  onRedaccionGenerada,
}: PadecimientoActualProps) => {
  const { toast } = useToast();
  const defaultMotivoConsulta = "El paciente acude a consulta por ";
  const motivoValue = formData.padecimientoActual.motivoConsulta;
  const hasMotivoStarted = motivoValue && motivoValue !== defaultMotivoConsulta && motivoValue.length > defaultMotivoConsulta.length + 5;

  // Initialize default value if empty
  useEffect(() => {
    if (!motivoValue) {
      handlePadecimientoChange("motivoConsulta", defaultMotivoConsulta);
    }
  }, []);

  const clearForm = () => {
    handlePadecimientoChange("motivoConsulta", defaultMotivoConsulta);
    handleSinSintomasChange(false);

    // Auto-scroll to top on reset
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    // Removed mb-40 to fix "dead space" issue. reduced to pb-8
    <div className="space-y-12 max-w-3xl mx-auto py-8">

      {/* 1. Motivo de Consulta Block */}
      <ScrollFocusSection className="relative z-20">
        <ChatBubbleLabel>Cuéntame, ¿cuál es el motivo de la consulta hoy?</ChatBubbleLabel>

        <div className="relative">
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
      </ScrollFocusSection>

      {/* 2. Dolor Presence Toggle (Progressive Disclosure) */}
      <AnimatePresence>
        {hasMotivoStarted && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <ScrollFocusSection className="space-y-6">
              <ChatBubbleLabel>
                ¿El paciente refiere <strong>dolor</strong> o sintomatología activa?
              </ChatBubbleLabel>

              <div className="flex justify-start gap-4 pl-4 flex-wrap">
                {/* BUTTON 1: SI HAY DOLOR (RED) */}
                <button
                  onClick={() => handleSinSintomasChange(false)}
                  className={cn(
                    "flex items-center gap-3 px-6 py-4 rounded-3xl border transition-all duration-300 w-full sm:w-auto",
                    !formData.padecimientoActual.sinSintomas
                      ? "border-red-500 bg-red-50/50 dark:bg-red-900/10 shadow-md ring-1 ring-red-500 scale-105"
                      : "border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:border-red-200 grayscale opacity-80 hover:opacity-100"
                  )}
                >
                  <div className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center text-lg transition-colors",
                    !formData.padecimientoActual.sinSintomas ? "bg-red-100 text-red-600" : "bg-gray-100 text-gray-400"
                  )}>
                    😫
                  </div>
                  <div className="text-left">
                    <div className="font-bold text-gray-900 dark:text-white text-sm">Sí, hay dolor</div>
                    <div className="text-xs text-gray-500">Sintomatología presente</div>
                  </div>
                </button>

                {/* BUTTON 2: SIN SINTOMAS (GREEN) */}
                <button
                  onClick={() => handleSinSintomasChange(true)}
                  className={cn(
                    "flex items-center gap-3 px-6 py-4 rounded-3xl border transition-all duration-300 w-full sm:w-auto",
                    formData.padecimientoActual.sinSintomas
                      ? "border-green-500 bg-green-50/50 dark:bg-green-900/10 shadow-md ring-1 ring-green-500 scale-105"
                      : "border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:border-green-200 grayscale opacity-80 hover:opacity-100"
                  )}
                >
                  <div className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center text-lg transition-colors",
                    formData.padecimientoActual.sinSintomas ? "bg-green-100 text-green-600" : "bg-gray-100 text-gray-400"
                  )}>
                    😌
                  </div>
                  <div className="text-left">
                    <div className="font-bold text-gray-900 dark:text-white text-sm">Sin síntomas</div>
                    <div className="text-xs text-gray-500">Asintomático</div>
                  </div>
                </button>
              </div>
            </ScrollFocusSection>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 3. Caracteristicas del Dolor (Deep Dive) */}
      <AnimatePresence>
        {hasMotivoStarted && !formData.padecimientoActual.sinSintomas && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
          >
            <ScrollFocusSection>
              {/* Deep Dive Container */}
              <div className="mt-8 animate-in fade-in slide-in-from-bottom-4 duration-700">

                {/* Subtitle Bar - Obsidian Style */}
                <div className="mb-6 inline-flex">
                  <div className="px-5 py-2 rounded-full bg-zinc-900/90 dark:bg-black/80 backdrop-blur-md border border-white/10 shadow-lg flex items-center">
                    <span className="text-sm font-medium text-zinc-100">
                      Características del dolor
                    </span>
                  </div>
                </div>

                <div className="mt-2">
                  <CaracteristicasDolor
                    dolor={formData.padecimientoActual.dolor}
                    onDolorChange={handleDolorChange}
                  />
                </div>
              </div>
            </ScrollFocusSection>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Footer Controls */}
      <div className="flex justify-end items-center gap-4 pt-10 opacity-90 transition-opacity">
        {onToggleViewMode && (
          <Button
            variant="outline"
            onClick={() => {
              // LOGIC: GENERATE REDACTION ON CLICK (HTML FORMATTED)
              const motivo = formData.padecimientoActual.motivoConsulta || "No especificado";
              const d = formData.padecimientoActual.dolor;

              // Construct HTML Output matching user's requested format
              let historyText = "";

              if (formData.padecimientoActual.sinSintomas) {
                historyText = "El paciente refiere encontrarse asintomático al momento de la consulta, negando dolor o molestia alguna.";
              } else {
                // MASTER REDACTION ENGINE (V4)
                let sentences = [];

                // 1. Dynamic Start (Regla de Inicio Dinámico: Limpieza de Motivo)
                const motivoRaw = formData.padecimientoActual.motivoConsulta || "No especificado";
                // Regex to strip redundant "El paciente acude..." prefixes
                const motivoClean = motivoRaw.replace(/^(el paciente (acude|viene|se presenta) (a|a la) consulta (por|manifestando)|acude a consulta por|motivo de consulta:)\s*/gi, "").trim();
                // Capitalize first letter
                const motivoFinal = motivoClean.charAt(0).toUpperCase() + motivoClean.slice(1);

                sentences.push(`El paciente acude a consulta manifestando: "${motivoFinal}".`);

                // 2. Origin (Regla de Origen / Modo de Aparición)
                const cond = d.condicionAparicion?.toLowerCase() || "";
                if (cond.includes("espont")) {
                  let feat = "Refiere un cuadro de dolor de aparición espontánea";
                  if (d.fechaInicio) feat += ` con una evolución constante desde el ${d.fechaInicio}`;
                  sentences.push(feat + ".");
                } else if (cond.includes("provoc")) {
                  const causaRaw = d.causaProvocado || "";
                  const causaClean = causaRaw.replace(/^(provocado con|provocado por|se provoca con|al|con|por) /gi, "").trim();
                  // V4 Correction: "de manera provocada" instead of "carácter provocado"
                  sentences.push(`Presenta sintomatología de manera provocada, exacerbada específicamente ante ${causaClean}.`);
                }

                // 3. Characterization (Regla de Caracterización: Frec + Carac + Inten)
                const freq = d.frecuencia?.toLowerCase() || "no especificada";
                const carac = d.caracter?.toLowerCase() || "no especificado";
                const intens = d.intensidad?.toLowerCase() || "moderada";

                sentences.push(`El dolor se manifiesta con una frecuencia ${freq} de carácter ${carac} e intensidad ${intens}.`);

                // 4. Location Exclusion (Regla de Exclusión por Localización)
                if (d.localizacion?.descripcion) {
                  const tipo = d.localizacion.tipo;
                  const descRaw = d.localizacion.descripcion;
                  const descClean = descRaw.replace(/^(localizado en|localizado|en la zona de|en) /gi, "").trim();

                  if (tipo === "Irradiado") {
                    sentences.push(`La sintomatología es de naturaleza difusa y se irradia hacia zonas adyacentes, sin presentar un punto de origen localizado.`);
                    // Optional: We could add the specific description if needed, currently adhering to "no localizado" rule.
                  } else if (tipo === "Localizado") {
                    // V4 Correction: Explicit template without fallback
                    sentences.push(`El foco doloroso se percibe estrictamente localizado en un punto clínico específico (${descClean}).`);
                  }
                  // V4 Correction: REMOVED FALLBACK "Refiere dolor en..." to prevent confusion with Intermitente.
                  // If type is neither Localizado nor Irradiado, no location text is output.
                }

                // 5. Closing (Alivio / Atenuación)
                if (d.atenuacion) {
                  const aten = d.atenuacion.replace(/^(cede con|disminuye con|con|por|al) /gi, "").trim();
                  sentences.push(`El paciente reporta mejoría ante ${aten}.`);
                }

                historyText = sentences.join(" ");
              }

              // 1. Visual Component (Animated Phrase by Phrase)
              const fullTextRaw = `Motivo de consulta:\n${motivo}\n\nHistoria del padecimiento:\n${historyText}`;

              const redaccionVisual = (
                <>
                  <div className="prose dark:prose-invert max-w-none text-zinc-700 dark:text-zinc-300 leading-relaxed font-mplus mb-6 relative group">
                    <div className="absolute right-0 top-0 z-10">
                      <CopyButton textToCopy={fullTextRaw} />
                    </div>
                    {/* Motivo - Starts Immediately */}
                    <strong>Motivo de consulta:</strong><br />
                    <AppleTypewriter as="span" speed={0.4} delay={0}>
                      {motivo}
                    </AppleTypewriter>
                    <br /><br />

                    {/* Historia - Sequential Sentence Reveal */}
                    <strong>Historia del padecimiento:</strong>
                    <div className="text-justify inline block">
                      <AppleTypewriter speed={0.8} delay={0.5}>
                        {historyText}
                      </AppleTypewriter>
                    </div>
                  </div>

                </>
              );

              // 2. Plain Text (For Clipboard/Smile Panel)
              const redaccionTexto = `
<strong>Motivo de consulta:</strong><br/>
${motivo}<br/><br/>
<strong>Historia del padecimiento:</strong><div style="text-align: justify;">${historyText}</div>
              `.trim();

              if (onRedaccionGenerada) {
                onRedaccionGenerada(redaccionVisual, redaccionTexto);
              }
              if (onToggleViewMode) {
                onToggleViewMode();
              }

              // New Auto-scroll Logic
              setTimeout(() => {
                const headerElement = document.getElementById('phase2-clinical-form-header');
                if (headerElement) {
                  const yOffset = -20; // Optional offset so it's not jammed at the top
                  const y = headerElement.getBoundingClientRect().top + window.pageYOffset + yOffset;
                  window.scrollTo({ top: y, behavior: 'smooth' });
                }
              }, 100); // Small delay to ensure state updates/UI shifts have started
            }}
            className="text-indigo-600 border-indigo-200 hover:bg-indigo-50 dark:border-indigo-800 dark:text-indigo-400 dark:hover:bg-indigo-900/20"
          >
            <Sparkles className="w-4 h-4 mr-2" />
            Ver Redacción IA
          </Button>
        )}

        <Button
          variant="ghost"
          onClick={clearForm}
          className="text-xs text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10"
        >
          <Eraser className="w-3 h-3 mr-2" />
          Reiniciar Sección
        </Button>
      </div>

    </div>
  );
};

export default PadecimientoActual;
