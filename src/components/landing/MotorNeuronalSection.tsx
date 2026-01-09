import { motion, useInView } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import { Check, Sparkles } from "lucide-react";

// Demo fragment with auto-click animation
const DemoFormFragment = ({ isInView }: { isInView: boolean }) => {
  const [animationStep, setAnimationStep] = useState(0);
  const [values, setValues] = useState<Record<string, string>>({});
  const [isTyping, setIsTyping] = useState(false);
  const [typedText, setTypedText] = useState("");
  const [animationKey, setAnimationKey] = useState(0);

  const selects = [
    { key: "caracter", label: "Carácter", value: "Pulsátil" },
    { key: "intensidad", label: "Intensidad", value: "Moderada" },
    { key: "frecuencia", label: "Frecuencia", value: "Intermitente" },
    { key: "ubicacion", label: "Ubicación", value: "Localizado" },
  ];

  const finalText = "Dolor pulsátil de intensidad moderada, de presentación intermitente, localizado en región molar inferior derecha...";

  // Reset animation when out of view
  useEffect(() => {
    if (!isInView) {
      setAnimationStep(0);
      setValues({});
      setIsTyping(false);
      setTypedText("");
      setAnimationKey(prev => prev + 1);
    }
  }, [isInView]);

  useEffect(() => {
    if (!isInView) return;

    let isCancelled = false;

    const runAnimation = async () => {
      // Click each select one by one
      for (let i = 0; i < selects.length; i++) {
        if (isCancelled) return;
        await new Promise(r => setTimeout(r, 800));
        if (isCancelled) return;
        setAnimationStep(i + 1);
        await new Promise(r => setTimeout(r, 400));
        if (isCancelled) return;
        setValues(prev => ({ ...prev, [selects[i].key]: selects[i].value }));
      }

      if (isCancelled) return;
      // Click "Generate" button
      await new Promise(r => setTimeout(r, 600));
      if (isCancelled) return;
      setAnimationStep(5);

      // Start typing animation
      await new Promise(r => setTimeout(r, 400));
      if (isCancelled) return;
      setIsTyping(true);

      // Type text letter by letter
      for (let i = 0; i <= finalText.length; i++) {
        if (isCancelled) return;
        await new Promise(r => setTimeout(r, 30));
        if (isCancelled) return;
        setTypedText(finalText.slice(0, i));
      }
    };

    const timeout = setTimeout(runAnimation, 1000);
    return () => {
      isCancelled = true;
      clearTimeout(timeout);
    };
  }, [isInView, animationKey]);

  return (
    <div className="bg-card border border-border rounded-xl p-4 sm:p-6 shadow-lg w-full max-w-md">
      {/* Window controls */}
      <div className="flex items-center gap-2 mb-4">
        <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-red-500" />
        <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-yellow-500" />
        <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-green-500" />
        <span className="ml-2 text-[10px] sm:text-xs text-muted-foreground">Características del Dolor</span>
      </div>

      {/* Selects grid */}
      <div className="grid grid-cols-2 gap-2 sm:gap-3 mb-4">
        {selects.map((select, i) => (
          <div key={select.key} className="space-y-1">
            <label className="text-[10px] sm:text-xs text-muted-foreground">{select.label}</label>
            <motion.div
              animate={
                animationStep === i + 1
                  ? { scale: [1, 0.97, 1], boxShadow: "0 0 0 3px hsl(var(--primary) / 0.3)" }
                  : {}
              }
              transition={{ duration: 0.3 }}
              className={`relative bg-background border rounded-md px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm flex items-center justify-between transition-all ${
                values[select.key]
                  ? "border-emerald-500 text-foreground"
                  : "border-border text-muted-foreground"
              }`}
            >
              <span className={`truncate ${values[select.key] ? "text-foreground" : "text-muted-foreground/50"}`}>
                {values[select.key] || "Seleccionar..."}
              </span>
              <svg className="w-3 h-3 sm:w-4 sm:h-4 text-muted-foreground flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
              {values[select.key] && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-1 -right-1 w-3 h-3 sm:w-4 sm:h-4 bg-emerald-500 rounded-full flex items-center justify-center"
                >
                  <Check className="w-2 h-2 sm:w-2.5 sm:h-2.5 text-white" />
                </motion.div>
              )}
            </motion.div>
          </div>
        ))}
      </div>

      {/* Generate button */}
      <motion.button
        animate={
          animationStep === 5
            ? { scale: [1, 0.95, 1], backgroundColor: "hsl(var(--primary))" }
            : {}
        }
        transition={{ duration: 0.2 }}
        className={`w-full py-2 sm:py-2.5 rounded-lg text-xs sm:text-sm font-medium flex items-center justify-center gap-2 transition-all ${
          animationStep >= 5
            ? "bg-primary text-primary-foreground"
            : "bg-muted text-muted-foreground"
        }`}
      >
        <Sparkles className="w-3 h-3 sm:w-4 sm:h-4" />
        Generar Redacción IA
      </motion.button>

      {/* Generated text with typing effect */}
      <motion.div
        initial={{ opacity: 0, height: 0 }}
        animate={isTyping ? { opacity: 1, height: "auto" } : { opacity: 0, height: 0 }}
        transition={{ duration: 0.3 }}
        className="mt-3 sm:mt-4 p-2 sm:p-3 bg-primary/5 rounded-lg border border-primary/20 overflow-hidden"
      >
        <p className="text-[10px] sm:text-xs text-muted-foreground italic min-h-[40px]">
          "{typedText}
          {isTyping && typedText.length < finalText.length && (
            <motion.span
              animate={{ opacity: [1, 0] }}
              transition={{ repeat: Infinity, duration: 0.5 }}
              className="inline-block w-0.5 h-3 bg-primary ml-0.5 align-middle"
            />
          )}
          "
        </p>
      </motion.div>
    </div>
  );
};

export const MotorNeuronalSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: false, margin: "-20%" });

  const bullets = [
    "Redacción clínica automatizada",
    "Lenguaje profesional y consistente",
    "Generación instantánea",
  ];

  return (
    <section 
      ref={ref} 
      className="min-h-screen w-full max-w-full flex items-center justify-center bg-muted/30 px-4 sm:px-6 py-12 sm:py-16 snap-start overflow-hidden"
    >
      <div className="w-full max-w-7xl mx-auto flex flex-col lg:flex-row gap-8 lg:gap-12 items-center">
        {/* Text - On top for mobile */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 50 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="w-full lg:w-2/5 space-y-4 sm:space-y-6 text-center lg:text-left order-1 lg:order-2"
        >
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground leading-tight">
            Motor Neuronal Clínico
          </h2>
          <p className="text-muted-foreground leading-relaxed text-sm sm:text-base">
            Transformamos datos clínicos crudos en narrativa profesional, 
            estandarizada y lista para uso clínico, académico o legal.
          </p>
          <ul className="space-y-3 inline-block text-left">
            {bullets.map((bullet, i) => (
              <motion.li
                key={i}
                initial={{ opacity: 0, x: 20 }}
                animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 20 }}
                transition={{ delay: 0.5 + i * 0.1 }}
                className="flex items-center gap-3 text-muted-foreground text-sm sm:text-base"
              >
                <div className="w-5 h-5 rounded-full bg-emerald-500/20 flex items-center justify-center flex-shrink-0">
                  <Check className="w-3 h-3 text-emerald-500" />
                </div>
                {bullet}
              </motion.li>
            ))}
          </ul>
        </motion.div>

        {/* Visual - Below for mobile */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -50 }}
          transition={{ duration: 0.8 }}
          className="w-full lg:w-3/5 flex justify-center order-2 lg:order-1"
        >
          <DemoFormFragment isInView={isInView} />
        </motion.div>
      </div>
    </section>
  );
};
