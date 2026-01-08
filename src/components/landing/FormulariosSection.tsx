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

  const finalText = "El Padre está vivo y aparentemente sano. La Madre está viva con diagnóstico de Diabetes mellitus tipo 2 bajo tratamiento médico. El Abuelo Paterno finado, causa desconocida.";

  const familiares = [
    { key: "padre", label: "Padre" },
    { key: "madre", label: "Madre" },
    { key: "abuelo", label: "Abuelo Paterno" },
  ];

  useEffect(() => {
    if (!isInView) return;

    const runAnimation = async () => {
      // Step 1: Click "Vivo y Sano" for Padre
      await new Promise(r => setTimeout(r, 1000));
      setAnimationStep(1);
      await new Promise(r => setTimeout(r, 300));
      setStates(prev => ({ ...prev, padre: { status: "vivoSano" } }));

      // Step 2: Click "Condición" for Madre
      await new Promise(r => setTimeout(r, 800));
      setAnimationStep(2);
      await new Promise(r => setTimeout(r, 300));
      setStates(prev => ({ ...prev, madre: { status: "condicion" } }));
      
      // Show condition input and type "Diabetes"
      await new Promise(r => setTimeout(r, 400));
      setShowCondicionInput(true);
      const condition = "Diabetes mellitus tipo 2";
      for (let i = 0; i <= condition.length; i++) {
        await new Promise(r => setTimeout(r, 50));
        setCondicionText(condition.slice(0, i));
      }
      setStates(prev => ({ ...prev, madre: { status: "condicion", condicion: condition } }));

      // Step 3: Click "Finado" for Abuelo
      await new Promise(r => setTimeout(r, 800));
      setAnimationStep(3);
      await new Promise(r => setTimeout(r, 300));
      setStates(prev => ({ ...prev, abuelo: { status: "finado" } }));

      // Step 4: Click Generate button
      await new Promise(r => setTimeout(r, 600));
      setAnimationStep(4);

      // Start typing final text
      await new Promise(r => setTimeout(r, 400));
      setIsTyping(true);
      for (let i = 0; i <= finalText.length; i++) {
        await new Promise(r => setTimeout(r, 25));
        setTypedText(finalText.slice(0, i));
      }
    };

    const timeout = setTimeout(runAnimation, 800);
    return () => clearTimeout(timeout);
  }, [isInView]);

  return (
    <div className="bg-card border border-border rounded-xl p-6 shadow-lg max-w-md">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-3 h-3 rounded-full bg-red-500" />
        <div className="w-3 h-3 rounded-full bg-yellow-500" />
        <div className="w-3 h-3 rounded-full bg-green-500" />
        <span className="ml-2 text-xs text-muted-foreground">Antecedentes Heredo-Familiares</span>
      </div>
      
      <div className="space-y-4">
        {familiares.map((fam, i) => {
          const state = states[fam.key as keyof typeof states];
          const isCurrentStep = animationStep === i + 1;
          
          return (
            <motion.div
              key={fam.key}
              className="flex items-center gap-3 flex-wrap"
            >
              <span className="text-sm font-medium text-foreground w-28">{fam.label}</span>
              
              <motion.button
                animate={
                  isCurrentStep && fam.key === "padre"
                    ? { scale: [1, 0.95, 1], boxShadow: "0 0 0 3px rgba(16, 185, 129, 0.3)" }
                    : {}
                }
                className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
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
                className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
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
                className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
                  state.status === "finado"
                    ? "bg-red-500 text-white border-red-500"
                    : "bg-background text-muted-foreground border-border hover:border-red-300"
                }`}
              >
                Finado
              </motion.button>

              {/* Condition input for Madre */}
              {fam.key === "madre" && showCondicionInput && (
                <motion.div
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: "auto" }}
                  className="flex-1 min-w-[120px]"
                >
                  <div className="px-3 py-1.5 rounded-lg bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 text-xs text-blue-700 dark:text-blue-300">
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
        className={`w-full mt-4 py-2.5 rounded-lg text-sm font-medium flex items-center justify-center gap-2 transition-all ${
          animationStep >= 4
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
        <p className="text-xs text-muted-foreground italic min-h-[50px]">
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
  const isInView = useInView(ref, { once: true, margin: "-20%" });

  return (
    <section ref={ref} className="h-screen flex items-center bg-background px-6 snap-start">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-5 gap-12 items-center">
        {/* Text Left */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={isInView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="lg:col-span-2 space-y-6"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-foreground leading-tight">
            Formularios que piensan contigo
          </h2>
          <p className="text-muted-foreground leading-relaxed">
            Dentaxy no solo recopila información. La interpreta, la estructura 
            y la convierte en conocimiento clínico profesional.
          </p>
          <p className="text-sm text-muted-foreground/70">
            Observa cómo los campos se seleccionan y la IA genera automáticamente 
            la redacción clínica apropiada.
          </p>
        </motion.div>

        {/* Visual Right */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={isInView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="lg:col-span-3 flex justify-center"
        >
          <DemoTogglesFragment isInView={isInView} />
        </motion.div>
      </div>
    </section>
  );
};
