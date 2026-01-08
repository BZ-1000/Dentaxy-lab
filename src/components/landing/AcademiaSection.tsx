import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { GraduationCap, Users, FileText, Building2 } from "lucide-react";

// Abstract academic connections visual
const AcademicVisual = ({ isInView }: { isInView: boolean }) => {
  const nodes = [
    { icon: Building2, label: "Universidad", x: 50, y: 50 },
    { icon: Users, label: "Estudiantes", x: 250, y: 30 },
    { icon: GraduationCap, label: "Profesores", x: 250, y: 150 },
    { icon: FileText, label: "Expedientes", x: 150, y: 120 },
  ];

  return (
    <div className="relative h-64 md:h-80">
      <svg viewBox="0 0 300 180" className="w-full h-full">
        {/* Connection lines */}
        <motion.path
          d="M70,60 L130,120"
          stroke="hsl(var(--primary))"
          strokeWidth="2"
          fill="none"
          strokeDasharray="4,4"
          initial={{ pathLength: 0 }}
          animate={isInView ? { pathLength: 1 } : {}}
          transition={{ duration: 1, delay: 0.5 }}
        />
        <motion.path
          d="M170,120 L230,40"
          stroke="hsl(var(--primary))"
          strokeWidth="2"
          fill="none"
          strokeDasharray="4,4"
          initial={{ pathLength: 0 }}
          animate={isInView ? { pathLength: 1 } : {}}
          transition={{ duration: 1, delay: 0.7 }}
        />
        <motion.path
          d="M170,120 L230,150"
          stroke="hsl(var(--primary))"
          strokeWidth="2"
          fill="none"
          strokeDasharray="4,4"
          initial={{ pathLength: 0 }}
          animate={isInView ? { pathLength: 1 } : {}}
          transition={{ duration: 1, delay: 0.9 }}
        />
      </svg>

      {/* Floating nodes */}
      {nodes.map((node, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, scale: 0 }}
          animate={isInView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.5, delay: 0.3 + i * 0.15 }}
          className="absolute flex flex-col items-center gap-1"
          style={{ left: `${node.x}px`, top: `${node.y}px`, transform: "translate(-50%, -50%)" }}
        >
          <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/30 flex items-center justify-center">
            <node.icon className="w-6 h-6 text-primary" />
          </div>
          <span className="text-[10px] text-muted-foreground">{node.label}</span>
        </motion.div>
      ))}
    </div>
  );
};

export const AcademiaSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

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
          <AcademicVisual isInView={isInView} />
        </motion.div>

        {/* Text Right */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={isInView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="lg:col-span-2 space-y-6"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-foreground leading-tight">
            Pensado para educación odontológica moderna
          </h2>
          <p className="text-muted-foreground leading-relaxed">
            Desde clínicas universitarias hasta sistemas académicos completos, 
            Dentaxy estandariza procesos, datos y aprendizaje clínico.
          </p>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.8 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20"
          >
            <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
            <span className="text-xs text-muted-foreground">UAZ Sync | Académico</span>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};
