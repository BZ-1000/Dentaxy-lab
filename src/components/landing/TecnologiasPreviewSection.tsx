import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { useNavigate } from "react-router-dom";
import { 
  FileText, Shield, Box, Hand, ArrowRight, Scan, 
  FileOutput, MapPin, Fingerprint, Server 
} from "lucide-react";
import { Button } from "@/components/ui/button";

const technologies = [
  {
    icon: FileText,
    title: "Formularios IA",
    description: "Formularios clínicos con autocompletado inteligente",
    gradient: "from-blue-500 to-cyan-500",
    anchor: "#formularios",
  },
  {
    icon: Fingerprint,
    title: "Cifrado YubiKey",
    description: "Autenticación multifactor biométrica empresarial",
    gradient: "from-purple-500 to-pink-500",
    anchor: "#seguridad",
  },
  {
    icon: Box,
    title: "Visualización 3D",
    description: "Lectura de archivos STL, PLY y OBJ",
    gradient: "from-orange-500 to-amber-500",
    anchor: "#visualizacion-3d",
  },
  {
    icon: Hand,
    title: "Control Gestos",
    description: "Manipulación 3D sin tocar teclado",
    gradient: "from-red-500 to-rose-500",
    anchor: "#gestos",
  },
  {
    icon: Scan,
    title: "CBCT/DICOM",
    description: "Renderizado de tomografías con cortes",
    gradient: "from-teal-500 to-cyan-500",
    anchor: "#dicom",
  },
  {
    icon: FileOutput,
    title: "Reportes PDF",
    description: "Documentos profesionales automáticos",
    gradient: "from-emerald-500 to-green-500",
    anchor: "#reportes",
  },
  {
    icon: MapPin,
    title: "Geolocalización",
    description: "Acceso solo en zonas autorizadas",
    gradient: "from-indigo-500 to-violet-500",
    anchor: "#geolocalizacion",
  },
  {
    icon: Server,
    title: "Enterprise",
    description: "Infraestructura escalable y redundante",
    gradient: "from-slate-500 to-zinc-500",
    anchor: "#enterprise",
  },
];

export const TecnologiasPreviewSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: false, margin: "-10%" });
  const navigate = useNavigate();

  return (
    <section 
      ref={ref} 
      className="min-h-screen w-full max-w-full flex flex-col items-center justify-center bg-muted/30 px-4 sm:px-6 py-12 sm:py-16 snap-start overflow-hidden"
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-8 sm:mb-10 w-full max-w-3xl px-4"
      >
        <motion.span
          initial={{ opacity: 0, scale: 0.9 }}
          animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
          className="inline-block px-3 sm:px-4 py-1 sm:py-1.5 rounded-full bg-primary/10 text-primary text-xs sm:text-sm font-medium mb-3 sm:mb-4"
        >
          Tecnología de Vanguardia
        </motion.span>
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-3 sm:mb-4">
          ¿Qué hace única a Dentaxy?
        </h2>
        <p className="text-muted-foreground text-sm sm:text-lg">
          Tecnologías diseñadas para instituciones odontológicas modernas.
        </p>
      </motion.div>

      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-4 w-full max-w-6xl mx-auto mb-8 sm:mb-10">
        {technologies.map((tech, i) => (
          <motion.div
            key={tech.title}
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.5, delay: i * 0.08 }}
            whileHover={{ scale: 1.03, y: -5 }}
            onClick={() => navigate(`/about${tech.anchor}`)}
            className="group relative rounded-xl sm:rounded-2xl p-[1px] overflow-hidden cursor-pointer"
            style={{
              background: `linear-gradient(135deg, hsl(var(--border)), transparent)`,
            }}
          >
            <div className="relative rounded-xl sm:rounded-2xl p-3 sm:p-5 h-full min-h-[120px] sm:min-h-[160px] backdrop-blur-xl bg-white/5 dark:bg-black/10 border border-white/20 dark:border-white/10 flex flex-col transition-all">
              {/* Background gradient on hover */}
              <div className={`absolute inset-0 opacity-0 group-hover:opacity-15 transition-opacity bg-gradient-to-br ${tech.gradient} rounded-xl sm:rounded-2xl`} />

              {/* Icon */}
              <div className={`relative z-10 w-8 h-8 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl flex items-center justify-center mb-2 sm:mb-4 bg-gradient-to-br ${tech.gradient} shadow-lg`}>
                <tech.icon className="w-4 h-4 sm:w-6 sm:h-6 text-white" />
              </div>

              {/* Title & Description */}
              <div className="relative z-10 flex-1">
                <h3 className="text-xs sm:text-sm font-semibold text-foreground mb-1 sm:mb-2">{tech.title}</h3>
                <p className="text-[10px] sm:text-xs text-muted-foreground leading-relaxed line-clamp-2">{tech.description}</p>
              </div>

              {/* Arrow indicator */}
              <div className="relative z-10 mt-2 sm:mt-3 flex justify-end">
                <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
        transition={{ duration: 0.6, delay: 0.5 }}
        className="flex flex-col sm:flex-row gap-3 sm:gap-4 items-center px-4"
      >
        <Button
          onClick={() => navigate("/about")}
          className="rounded-full px-6 sm:px-8 py-5 sm:py-6 text-sm sm:text-base bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-primary-foreground shadow-lg w-full sm:w-auto"
        >
          Conocer más
          <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 ml-2" />
        </Button>
        <p className="text-xs sm:text-sm text-muted-foreground text-center">
          Descubre las tecnologías que nos hacen únicos
        </p>
      </motion.div>
    </section>
  );
};
