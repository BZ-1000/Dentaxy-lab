import { motion, useInView } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import { Check, Sparkles } from "lucide-react";

// Demo fragment with auto-click animation
const DemoFormFragment = ({ isInView }: { isInView: boolean }) => {
  const [animationStep, setAnimationStep] = useState(0);
  const [values, setValues] = useState<Record<string, string>>({});
  const [isTyping, setIsTyping] = useState(false);
  const [typedText, setTypedText] = useState("");

  const selects = [
    { key: "caracter", label: "Carácter", value: "Pulsátil" },
    { key: "intensidad", label: "Intensidad", value: "Moderada" },
    { key: "frecuencia", label: "Frecuencia", value: "Intermitente" },
    { key: "ubicacion", label: "Ubicación", value: "Localizado" },
  ];

  const finalText = "Dolor pulsátil de intensidad moderada, de presentación intermitente, localizado en región molar inferior derecha...";

  useEffect(() => {
    if (!isInView) return;

    const runAnimation = async () => {
      // Click each select one by one
      for (let i = 0; i < selects.length; i++) {
        await new Promise(r => setTimeout(r, 800));
        setAnimationStep(i + 1);
        await new Promise(r => setTimeout(r, 400));
        setValues(prev => ({ ...prev, [selects[i].key]: selects[i].value }));
      }

      // Click "Generate" button
      await new Promise(r => setTimeout(r, 600));
      setAnimationStep(5); // button click state

      // Start typing animation
      await new Promise(r => setTimeout(r, 400));
      setIsTyping(true);

      // Type text letter by letter
      for (let i = 0; i <= finalText.length; i++) {
        await new Promise(r => setTimeout(r, 30));
        setTypedText(finalText.slice(0, i));
      }
    };

    const timeout = setTimeout(runAnimation, 1000);
    return () => clearTimeout(timeout);
  }, [isInView]);

  return (
    <div className="bg-card border border-border rounded-xl p-6 shadow-lg max-w-md">
      {/* Window controls */}
      <div className="flex items-center gap-2 mb-4">
        <div className="w-3 h-3 rounded-full bg-red-500" />
        <div className="w-3 h-3 rounded-full bg-yellow-500" />
        <div className="w-3 h-3 rounded-full bg-green-500" />
        <span className="ml-2 text-xs text-muted-foreground">Características del Dolor</span>
      </div>

      {/* Selects grid */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        {selects.map((select, i) => (
          <div key={select.key} className="space-y-1">
            <label className="text-xs text-muted-foreground">{select.label}</label>
            <motion.div
              animate={
                animationStep === i + 1
                  ? { scale: [1, 0.97, 1], boxShadow: "0 0 0 3px hsl(var(--primary) / 0.3)" }
                  : {}
              }
              transition={{ duration: 0.3 }}
              className={`relative bg-background border rounded-md px-3 py-2 text-sm flex items-center justify-between transition-all ${
                values[select.key]
                  ? "border-emerald-500 text-foreground"
                  : "border-border text-muted-foreground"
              }`}
            >
              <span className={values[select.key] ? "text-foreground" : "text-muted-foreground/50"}>
                {values[select.key] || "Seleccionar..."}
              </span>
              <svg className="w-4 h-4 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
              {values[select.key] && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full flex items-center justify-center"
                >
                  <Check className="w-2.5 h-2.5 text-white" />
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
        className={`w-full py-2.5 rounded-lg text-sm font-medium flex items-center justify-center gap-2 transition-all ${
          animationStep >= 5
            ? "bg-primary text-primary-foreground"
            : "bg-muted text-muted-foreground"
        }`}
      >
        <Sparkles className="w-4 h-4" />
        Generar Redacción IA
      </motion.button>

      {/* Generated text with typing effect */}
      <motion.div
        initial={{ opacity: 0, height: 0 }}
        animate={isTyping ? { opacity: 1, height: "auto" } : {}}
        transition={{ duration: 0.3 }}
        className="mt-4 p-3 bg-primary/5 rounded-lg border border-primary/20 overflow-hidden"
      >
        <p className="text-xs text-muted-foreground italic min-h-[40px]">
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
  const isInView = useInView(ref, { once: true, margin: "-20%" });

  const bullets = [
    "Redacción clínica automatizada",
    "Lenguaje profesional y consistente",
    "Generación instantánea",
  ];

  return (
    <section ref={ref} className="h-screen flex items-center bg-muted/30 px-6 snap-start">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-5 gap-12 items-center">
        {/* Visual Left */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={isInView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="lg:col-span-3 flex justify-center"
        >
          <DemoFormFragment isInView={isInView} />
        </motion.div>

        {/* Text Right */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={isInView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="lg:col-span-2 space-y-6"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-foreground leading-tight">
            Motor Neuronal Clínico
          </h2>
          <p className="text-muted-foreground leading-relaxed">
            Transformamos datos clínicos crudos en narrativa profesional, 
            estandarizada y lista para uso clínico, académico o legal.
          </p>
          <ul className="space-y-3">
            {bullets.map((bullet, i) => (
              <motion.li
                key={i}
                initial={{ opacity: 0, x: 20 }}
                animate={isInView ? { opacity: 1, x: 0 } : {}}
                transition={{ delay: 0.5 + i * 0.1 }}
                className="flex items-center gap-3 text-muted-foreground"
              >
                <div className="w-5 h-5 rounded-full bg-emerald-500/20 flex items-center justify-center">
                  <Check className="w-3 h-3 text-emerald-500" />
                </div>
                {bullet}
              </motion.li>
            ))}
          </ul>
        </motion.div>
      </div>
    </section>
  );
};
