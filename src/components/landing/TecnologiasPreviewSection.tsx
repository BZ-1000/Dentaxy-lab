import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { useNavigate } from "react-router-dom";
import { FileText, Shield, Box, Hand, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const technologies = [
  {
    icon: FileText,
    title: "Formularios Interactivos",
    description: "Formularios clínicos inteligentes que se adaptan al paciente",
    gradient: "from-blue-500 to-cyan-500",
  },
  {
    icon: Shield,
    title: "Cifrado YubiKey",
    description: "Autenticación multifactor biométrica con llaves de hardware",
    gradient: "from-purple-500 to-pink-500",
  },
  {
    icon: Box,
    title: "Visualización 3D",
    description: "Lectura de archivos dentales STL, PLY y OBJ en tiempo real",
    gradient: "from-orange-500 to-amber-500",
  },
  {
    icon: Hand,
    title: "Control por Gestos",
    description: "Manipulación del modelo 3D sin tocar teclado o mouse",
    gradient: "from-emerald-500 to-teal-500",
  },
];

export const TecnologiasPreviewSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-20%" });
  const navigate = useNavigate();

  return (
    <section ref={ref} className="h-screen flex flex-col items-center justify-center bg-muted/30 px-6 snap-start">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6 }}
        className="text-center mb-10 max-w-2xl"
      >
        <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
          ¿Qué hace única a Dentaxy?
        </h2>
        <p className="text-muted-foreground">
          Integramos tecnologías diseñadas para cubrir todas las necesidades 
          digitales de una institución odontológica moderna.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-5xl mx-auto w-full mb-10">
        {technologies.map((tech, i) => (
          <motion.div
            key={tech.title}
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: i * 0.1 }}
            whileHover={{ scale: 1.03, y: -5 }}
            className="group relative rounded-xl p-[1px] overflow-hidden cursor-pointer"
            style={{
              background: `linear-gradient(135deg, hsl(var(--border)), transparent)`,
            }}
          >
            <div className="relative rounded-xl p-5 h-full min-h-[140px] backdrop-blur-xl bg-background border border-border flex flex-col">
              {/* Background gradient on hover */}
              <div className={`absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity bg-gradient-to-br ${tech.gradient}`} />

              {/* Icon */}
              <div className={`relative z-10 w-10 h-10 rounded-lg flex items-center justify-center mb-3 bg-gradient-to-br ${tech.gradient}`}>
                <tech.icon className="w-5 h-5 text-white" />
              </div>

              {/* Title & Description */}
              <div className="relative z-10">
                <h3 className="text-sm font-semibold text-foreground mb-1">{tech.title}</h3>
                <p className="text-xs text-muted-foreground line-clamp-2">{tech.description}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6, delay: 0.5 }}
      >
        <Button
          onClick={() => navigate("/about")}
          variant="outline"
          className="rounded-full px-6 group"
        >
          Ver todas las tecnologías
          <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
        </Button>
      </motion.div>
    </section>
  );
};
