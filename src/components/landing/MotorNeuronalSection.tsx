import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Check } from "lucide-react";

// Demo fragment of pain characteristics selects (visual only)
const DemoFormFragment = () => {
  const selects = [
    { label: "Carácter", value: "Pulsátil" },
    { label: "Intensidad", value: "Moderada" },
    { label: "Frecuencia", value: "Intermitente" },
    { label: "Ubicación", value: "Localizado" },
  ];

  return (
    <div className="bg-card border border-border rounded-xl p-6 shadow-lg">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-3 h-3 rounded-full bg-red-500" />
        <div className="w-3 h-3 rounded-full bg-yellow-500" />
        <div className="w-3 h-3 rounded-full bg-green-500" />
        <span className="ml-2 text-xs text-muted-foreground">Características del Dolor</span>
      </div>
      <div className="grid grid-cols-2 gap-3">
        {selects.map((select, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 + 0.5 }}
            className="space-y-1"
          >
            <label className="text-xs text-muted-foreground">{select.label}</label>
            <div className="bg-background border border-border rounded-md px-3 py-2 text-sm text-foreground flex items-center justify-between">
              {select.value}
              <svg className="w-4 h-4 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </motion.div>
        ))}
      </div>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="mt-4 p-3 bg-primary/5 rounded-lg border border-primary/20"
      >
        <p className="text-xs text-muted-foreground italic">
          "Dolor pulsátil de intensidad moderada, de presentación intermitente, localizado en..."
        </p>
      </motion.div>
    </div>
  );
};

export const MotorNeuronalSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const bullets = [
    "Redacción clínica automatizada",
    "Lenguaje profesional y consistente",
    "Generación instantánea",
  ];

  return (
    <section ref={ref} className="min-h-screen flex items-center bg-muted/30 px-6 py-20">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-5 gap-12 items-center">
        {/* Visual Left */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={isInView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="lg:col-span-3"
        >
          <DemoFormFragment />
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
