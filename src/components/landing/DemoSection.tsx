import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Users } from "lucide-react";
import AntecedentesHeredoFamiliares from "@/components/historia-clinica/AntecedentesHeredoFamiliares";
import { useHistoriaClinica } from "@/hooks/useHistoriaClinica";

export const DemoSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const { formData, handleFamiliarChange, handleCondicionChange } = useHistoriaClinica();

  return (
    <section ref={ref} className="min-h-screen flex flex-col items-center justify-center bg-background px-6 py-20">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6 }}
        className="text-center mb-12"
      >
        <div className="flex items-center gap-3 justify-center mb-4">
          <Users className="h-8 w-8 text-blue-600" />
          <h2 className="text-3xl md:text-4xl font-bold text-foreground">
            Prueba el Motor Neuronal
          </h2>
        </div>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Interactúa con los antecedentes heredo familiares y observa cómo Dentaxy 
          genera redacciones clínicas profesionales en tiempo real.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="w-full max-w-5xl mx-auto"
      >
        <div className="bg-card border border-border rounded-2xl p-6 shadow-lg">
          <AntecedentesHeredoFamiliares 
            formData={formData}
            handleFamiliarChange={handleFamiliarChange}
            handleCondicionChange={handleCondicionChange}
          />
        </div>
      </motion.div>
    </section>
  );
};
