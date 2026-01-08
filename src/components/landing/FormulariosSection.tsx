import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";

// Demo fragment of hereditary background toggles (visual only)
interface FamiliarState {
  status: string;
  condicion?: string;
}

const DemoTogglesFragment = () => {
  const [states] = useState<Record<string, FamiliarState>>({
    padre: { status: "vivoSano" },
    madre: { status: "condicion", condicion: "Diabetes" },
    abuelo: { status: "finado" },
  });

  const familiares = [
    { key: "padre", label: "Padre" },
    { key: "madre", label: "Madre" },
    { key: "abuelo", label: "Abuelo Paterno" },
  ];

  return (
    <div className="bg-card border border-border rounded-xl p-6 shadow-lg">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-3 h-3 rounded-full bg-red-500" />
        <div className="w-3 h-3 rounded-full bg-yellow-500" />
        <div className="w-3 h-3 rounded-full bg-green-500" />
        <span className="ml-2 text-xs text-muted-foreground">Antecedentes Heredo-Familiares</span>
      </div>
      
      <div className="space-y-4">
        {familiares.map((fam, i) => {
          const state = states[fam.key as keyof typeof states];
          return (
            <motion.div
              key={fam.key}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.15 + 0.3 }}
              className="flex items-center gap-3 flex-wrap"
            >
              <span className="text-sm font-medium text-foreground w-28">{fam.label}</span>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
                  state.status === "vivoSano"
                    ? "bg-emerald-500 text-white border-emerald-500"
                    : "bg-background text-muted-foreground border-border hover:border-emerald-300"
                }`}
              >
                Vivo y Sano
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
                  state.status === "finado"
                    ? "bg-red-500 text-white border-red-500"
                    : "bg-background text-muted-foreground border-border hover:border-red-300"
                }`}
              >
                Finado
              </motion.button>

              {state.status === "condicion" && (
                <motion.span
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="px-3 py-1.5 rounded-full text-xs font-medium bg-blue-500 text-white"
                >
                  {state.condicion}
                </motion.span>
              )}
            </motion.div>
          );
        })}
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="mt-4 p-3 bg-primary/5 rounded-lg border border-primary/20"
      >
        <p className="text-xs text-muted-foreground italic">
          "El Padre está vivo y aparentemente sano. La Madre está viva con diagnóstico de Diabetes mellitus..."
        </p>
      </motion.div>
    </div>
  );
};

export const FormulariosSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} className="min-h-screen flex items-center bg-background px-6 py-20">
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
            y la convierte en conocimiento clínico.
          </p>
        </motion.div>

        {/* Visual Right */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={isInView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="lg:col-span-3"
        >
          <DemoTogglesFragment />
        </motion.div>
      </div>
    </section>
  );
};
