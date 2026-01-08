import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Clock, Brain, FileText } from "lucide-react";

const benefits = [
  {
    icon: Clock,
    title: "Ahorro de Tiempo",
    description: "Reduce hasta 70% el tiempo de redacción de historias clínicas con nuestra IA especializada.",
    color: "text-blue-600",
    bg: "bg-blue-50 dark:bg-blue-950/30",
  },
  {
    icon: Brain,
    title: "Precisión Clínica",
    description: "Lenguaje médico estandarizado y consistente en todas tus redacciones profesionales.",
    color: "text-emerald-600",
    bg: "bg-emerald-50 dark:bg-emerald-950/30",
  },
  {
    icon: FileText,
    title: "Estandarización",
    description: "Formatos uniformes compatibles con expedientes universitarios y sistemas de salud.",
    color: "text-purple-600",
    bg: "bg-purple-50 dark:bg-purple-950/30",
  },
];

export const BenefitsSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} className="min-h-[60vh] flex flex-col items-center justify-center bg-background px-6 py-20">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6 }}
        className="text-center mb-12"
      >
        <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
          Beneficios de Dentaxy
        </h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Diseñado para profesionales que valoran su tiempo y la calidad de su trabajo.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto w-full"
      >
        {benefits.map((benefit, i) => (
          <motion.div
            key={benefit.title}
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.3 + i * 0.1 }}
            className={`${benefit.bg} rounded-2xl p-6 text-center border border-border`}
          >
            <benefit.icon className={`h-12 w-12 ${benefit.color} mx-auto mb-4`} />
            <h3 className="font-semibold text-foreground text-lg mb-2">{benefit.title}</h3>
            <p className="text-sm text-muted-foreground">{benefit.description}</p>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
};
