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
    title: "Formularios Interactivos IA",
    description: "Formularios clínicos que se adaptan al paciente con autocompletado inteligente",
    gradient: "from-blue-500 to-cyan-500",
    anchor: "#formularios",
  },
  {
    icon: Fingerprint,
    title: "Cifrado YubiKey",
    description: "Autenticación multifactor biométrica con llaves de hardware empresarial",
    gradient: "from-purple-500 to-pink-500",
    anchor: "#seguridad",
  },
  {
    icon: Box,
    title: "Visualización 3D",
    description: "Lectura de archivos STL, PLY y OBJ con manipulación en tiempo real",
    gradient: "from-orange-500 to-amber-500",
    anchor: "#visualizacion-3d",
  },
  {
    icon: Hand,
    title: "Control por Gestos",
    description: "Manipulación del modelo 3D sin tocar teclado o mouse (Top Secret)",
    gradient: "from-red-500 to-rose-500",
    anchor: "#gestos",
  },
  {
    icon: Scan,
    title: "Visualizador CBCT/DICOM",
    description: "Renderizado de tomografías con cortes axiales, coronales y sagitales",
    gradient: "from-teal-500 to-cyan-500",
    anchor: "#dicom",
  },
  {
    icon: FileOutput,
    title: "Reportes PDF Automáticos",
    description: "Generación de documentos profesionales con plantillas personalizables",
    gradient: "from-emerald-500 to-green-500",
    anchor: "#reportes",
  },
  {
    icon: MapPin,
    title: "Acceso Geolocalizado",
    description: "La app solo se desbloquea en zonas autorizadas para máxima seguridad",
    gradient: "from-indigo-500 to-violet-500",
    anchor: "#geolocalizacion",
  },
  {
    icon: Server,
    title: "Arquitectura Enterprise",
    description: "Infraestructura escalable con servidores privados y redundancia",
    gradient: "from-slate-500 to-zinc-500",
    anchor: "#enterprise",
  },
];

export const TecnologiasPreviewSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: false, margin: "-10%" });
  const navigate = useNavigate();

  return (
    <section ref={ref} className="min-h-screen flex flex-col items-center justify-center bg-muted/30 px-6 py-12 snap-start">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-10 max-w-3xl"
      >
        <motion.span
          initial={{ opacity: 0, scale: 0.9 }}
          animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
          className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4"
        >
          Tecnología de Vanguardia
        </motion.span>
        <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
          ¿Qué hace única a Dentaxy Technologies?
        </h2>
        <p className="text-muted-foreground text-lg">
          Integramos un conjunto de tecnologías diseñadas para cubrir todas las necesidades 
          digitales de una institución odontológica moderna.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-6xl mx-auto w-full mb-10">
        {technologies.map((tech, i) => (
          <motion.div
            key={tech.title}
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.5, delay: i * 0.08 }}
            whileHover={{ scale: 1.03, y: -5 }}
            onClick={() => navigate(`/about${tech.anchor}`)}
            className="group relative rounded-2xl p-[1px] overflow-hidden cursor-pointer"
            style={{
              background: `linear-gradient(135deg, hsl(var(--border)), transparent)`,
            }}
          >
            <div className="relative rounded-2xl p-5 h-full min-h-[160px] backdrop-blur-xl bg-white/5 dark:bg-black/10 border border-white/20 dark:border-white/10 flex flex-col transition-all">
              {/* Background gradient on hover */}
              <div className={`absolute inset-0 opacity-0 group-hover:opacity-15 transition-opacity bg-gradient-to-br ${tech.gradient} rounded-2xl`} />

              {/* Icon */}
              <div className={`relative z-10 w-12 h-12 rounded-xl flex items-center justify-center mb-4 bg-gradient-to-br ${tech.gradient} shadow-lg`}>
                <tech.icon className="w-6 h-6 text-white" />
              </div>

              {/* Title & Description */}
              <div className="relative z-10 flex-1">
                <h3 className="text-sm font-semibold text-foreground mb-2">{tech.title}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">{tech.description}</p>
              </div>

              {/* Arrow indicator */}
              <div className="relative z-10 mt-3 flex justify-end">
                <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
        transition={{ duration: 0.6, delay: 0.5 }}
        className="flex flex-col sm:flex-row gap-4 items-center"
      >
        <Button
          onClick={() => navigate("/about")}
          className="rounded-full px-8 py-6 text-base bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-primary-foreground shadow-lg"
        >
          Conocer más sobre nosotros
          <ArrowRight className="w-5 h-5 ml-2" />
        </Button>
        <p className="text-sm text-muted-foreground">
          Descubre todas las tecnologías que nos hacen únicos
        </p>
      </motion.div>
    </section>
  );
};
