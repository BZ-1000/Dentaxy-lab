import { motion, useInView } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import { Sparkles } from "lucide-react";

// Demo fragment with auto-click animation for hereditary toggles
interface FamiliarState {
  status: string;
  condicion?: string;
}

const DemoTogglesFragment = ({ isInView }: { isInView: boolean }) => {
  const [animationStep, setAnimationStep] = useState(0);
  const [states, setStates] = useState<Record<string, FamiliarState>>({
    padre: { status: "" },
    madre: { status: "" },
    abuelo: { status: "" },
  });
  const [isTyping, setIsTyping] = useState(false);
  const [typedText, setTypedText] = useState("");
  const [showCondicionInput, setShowCondicionInput] = useState(false);
  const [condicionText, setCondicionText] = useState("");
  const [animationKey, setAnimationKey] = useState(0);

  const finalText = "El Padre está vivo y aparentemente sano. La Madre está viva con diagnóstico de Diabetes mellitus tipo 2 bajo tratamiento médico. El Abuelo Paterno finado, causa desconocida.";

  const familiares = [
    { key: "padre", label: "Padre" },
    { key: "madre", label: "Madre" },
    { key: "abuelo", label: "Abuelo Paterno" },
  ];

  // Reset animation when out of view
  useEffect(() => {
    if (!isInView) {
      setAnimationStep(0);
      setStates({
        padre: { status: "" },
        madre: { status: "" },
        abuelo: { status: "" },
      });
      setIsTyping(false);
      setTypedText("");
      setShowCondicionInput(false);
      setCondicionText("");
      setAnimationKey(prev => prev + 1);
    }
  }, [isInView]);

  useEffect(() => {
    if (!isInView) return;

    let isCancelled = false;

    const runAnimation = async () => {
      // Step 1: Click "Vivo y Sano" for Padre
      await new Promise(r => setTimeout(r, 1000));
      if (isCancelled) return;
      setAnimationStep(1);
      await new Promise(r => setTimeout(r, 300));
      if (isCancelled) return;
      setStates(prev => ({ ...prev, padre: { status: "vivoSano" } }));

      // Step 2: Click "Condición" for Madre
      await new Promise(r => setTimeout(r, 800));
      if (isCancelled) return;
      setAnimationStep(2);
      await new Promise(r => setTimeout(r, 300));
      if (isCancelled) return;
      setStates(prev => ({ ...prev, madre: { status: "condicion" } }));
      
      // Show condition input and type "Diabetes"
      await new Promise(r => setTimeout(r, 400));
      if (isCancelled) return;
      setShowCondicionInput(true);
      const condition = "Diabetes mellitus tipo 2";
      for (let i = 0; i <= condition.length; i++) {
        if (isCancelled) return;
        await new Promise(r => setTimeout(r, 50));
        if (isCancelled) return;
        setCondicionText(condition.slice(0, i));
      }
      if (isCancelled) return;
      setStates(prev => ({ ...prev, madre: { status: "condicion", condicion: condition } }));

      // Step 3: Click "Finado" for Abuelo
      await new Promise(r => setTimeout(r, 800));
      if (isCancelled) return;
      setAnimationStep(3);
      await new Promise(r => setTimeout(r, 300));
      if (isCancelled) return;
      setStates(prev => ({ ...prev, abuelo: { status: "finado" } }));

      // Step 4: Click Generate button
      await new Promise(r => setTimeout(r, 600));
      if (isCancelled) return;
      setAnimationStep(4);

      // Start typing final text
      await new Promise(r => setTimeout(r, 400));
      if (isCancelled) return;
      setIsTyping(true);
      for (let i = 0; i <= finalText.length; i++) {
        if (isCancelled) return;
        await new Promise(r => setTimeout(r, 25));
        if (isCancelled) return;
        setTypedText(finalText.slice(0, i));
      }
    };

    const timeout = setTimeout(runAnimation, 800);
    return () => {
      isCancelled = true;
      clearTimeout(timeout);
    };
  }, [isInView, animationKey]);

  return (
    <div className="bg-card border border-border rounded-xl p-4 sm:p-6 shadow-lg w-full max-w-md">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-red-500" />
        <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-yellow-500" />
        <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-green-500" />
        <span className="ml-2 text-[10px] sm:text-xs text-muted-foreground truncate">Antecedentes Heredo-Familiares</span>
      </div>
      
      <div className="space-y-3 sm:space-y-4">
        {familiares.map((fam, i) => {
          const state = states[fam.key as keyof typeof states];
          const isCurrentStep = animationStep === i + 1;
          
          return (
            <motion.div
              key={fam.key}
              className="flex flex-wrap items-center gap-2"
            >
              <span className="text-xs sm:text-sm font-medium text-foreground w-full sm:w-24">{fam.label}</span>
              
              <div className="flex flex-wrap gap-1.5 sm:gap-2">
                <motion.button
                  animate={
                    isCurrentStep && fam.key === "padre"
                      ? { scale: [1, 0.95, 1], boxShadow: "0 0 0 3px rgba(16, 185, 129, 0.3)" }
                      : {}
                  }
                  className={`px-2 sm:px-3 py-1 sm:py-1.5 rounded-full text-[10px] sm:text-xs font-medium border transition-all ${
                    state.status === "vivoSano"
                      ? "bg-emerald-500 text-white border-emerald-500"
                      : "bg-background text-muted-foreground border-border hover:border-emerald-300"
                  }`}
                >
                  Vivo y Sano
                </motion.button>
                
                <motion.button
                  animate={
                    isCurrentStep && fam.key === "madre"
                      ? { scale: [1, 0.95, 1], boxShadow: "0 0 0 3px rgba(59, 130, 246, 0.3)" }
                      : {}
                  }
                  className={`px-2 sm:px-3 py-1 sm:py-1.5 rounded-full text-[10px] sm:text-xs font-medium border transition-all ${
                    state.status === "condicion"
                      ? "bg-blue-500 text-white border-blue-500"
                      : "bg-background text-muted-foreground border-border hover:border-blue-300"
                  }`}
                >
                  Condición
                </motion.button>
                
                <motion.button
                  animate={
                    isCurrentStep && fam.key === "abuelo"
                      ? { scale: [1, 0.95, 1], boxShadow: "0 0 0 3px rgba(239, 68, 68, 0.3)" }
                      : {}
                  }
                  className={`px-2 sm:px-3 py-1 sm:py-1.5 rounded-full text-[10px] sm:text-xs font-medium border transition-all ${
                    state.status === "finado"
                      ? "bg-red-500 text-white border-red-500"
                      : "bg-background text-muted-foreground border-border hover:border-red-300"
                  }`}
                >
                  Finado
                </motion.button>
              </div>

              {/* Condition input for Madre */}
              {fam.key === "madre" && showCondicionInput && (
                <motion.div
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: "auto" }}
                  className="w-full sm:flex-1 sm:min-w-[120px] mt-1 sm:mt-0"
                >
                  <div className="px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 text-[10px] sm:text-xs text-blue-700 dark:text-blue-300">
                    {condicionText}
                    {condicionText.length < "Diabetes mellitus tipo 2".length && (
                      <motion.span
                        animate={{ opacity: [1, 0] }}
                        transition={{ repeat: Infinity, duration: 0.5 }}
                        className="inline-block w-0.5 h-3 bg-blue-500 ml-0.5 align-middle"
                      />
                    )}
                  </div>
                </motion.div>
              )}
            </motion.div>
          );
        })}
      </div>

      {/* Generate button */}
      <motion.button
        animate={
          animationStep === 4
            ? { scale: [1, 0.95, 1], backgroundColor: "hsl(var(--primary))" }
            : {}
        }
        transition={{ duration: 0.2 }}
        className={`w-full mt-4 py-2 sm:py-2.5 rounded-lg text-xs sm:text-sm font-medium flex items-center justify-center gap-2 transition-all ${
          animationStep >= 4
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
        <p className="text-[10px] sm:text-xs text-muted-foreground italic min-h-[50px]">
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

export const FormulariosSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: false, margin: "-20%" });

  return (
    <section 
      ref={ref} 
      className="min-h-screen w-full max-w-full flex items-center justify-center bg-background px-4 sm:px-6 py-12 sm:py-16 snap-start overflow-hidden"
    >
      <div className="w-full max-w-7xl mx-auto flex flex-col lg:flex-row gap-8 lg:gap-12 items-center">
        {/* Text - On top for mobile */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -50 }}
          transition={{ duration: 0.8 }}
          className="w-full lg:w-2/5 space-y-4 sm:space-y-6 text-center lg:text-left order-1"
        >
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground leading-tight">
            Formularios que piensan contigo
          </h2>
          <p className="text-muted-foreground leading-relaxed text-sm sm:text-base">
            Dentaxy no solo recopila información. La interpreta, la estructura 
            y la convierte en conocimiento clínico profesional.
          </p>
          <p className="text-xs sm:text-sm text-muted-foreground/70">
            Observa cómo los campos se seleccionan y la IA genera automáticamente 
            la redacción clínica apropiada.
          </p>
        </motion.div>

        {/* Visual - Below for mobile */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 50 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="w-full lg:w-3/5 flex justify-center order-2"
        >
          <DemoTogglesFragment isInView={isInView} />
        </motion.div>
      </div>
    </section>
  );
};
