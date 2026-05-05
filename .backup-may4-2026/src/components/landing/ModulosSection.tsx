import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Brain, GraduationCap, Building2, Box, Hand, Check, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

const modules = [
  {
    title: "DENTAXY AI",
    subtitle: "Asistencia Cognitiva",
    icon: Brain,
    badge: "Activo",
    // emerald-500 → #10B981
    gradient: "from-emerald-500 to-teal-400",
    accentColor: "#10B981",
    isActive: true,
    hubModule: "motor_neuronal",  // Nombre en Supabase / Hub
    route: "/demo/ai",
    features: [
      "Narrativa clínica profesional",
      "Coherencia documental",
      "Menos escritura, más criterio",
      "Documentación con peso legal",
    ],
    description: "El clínico piensa. El sistema redacta. La narrativa se vuelve consistente, clara y reutilizable. No es automatización. Es asistencia cognitiva.",
  },
  {
    title: "DICOM",
    subtitle: "Visualización Médica",
    icon: Box,
    badge: "Interactivo",
    // Violet → #8B5CF6
    gradient: "from-violet-500 to-purple-400",
    accentColor: "#8B5CF6",
    isActive: false,
    hubModule: "dicom",
    features: [
      "Visualizador DICOM nativo en navegador",
      "Herramientas de precisión diagnóstica",
      "Acceso universal: Desktop y Mobile",
      "Seguridad de datos por diseño",
    ],
    description: "La imagen clínica deja de ser un archivo. Se convierte en un espacio manipulable. Directo. Seguro. Sin fricción. Aquí la imagen no se envía. Se explora.",
  },
  {
    title: "DENTAXY UNIVERSIDADES",
    subtitle: "Plataforma Académica",
    icon: GraduationCap,
    badge: "Infraestructura",
    // Neon Tech Blue → #00A3FF
    gradient: "from-sky-500 to-cyan-400",
    accentColor: "#00A3FF",
    isActive: false,
    hubModule: "academico",
    features: [
      "Clínicas universitarias conectadas",
      "Operación geolocalizada",
      "Datos clínicos estandarizados",
      "Supervisión institucional silenciosa",
    ],
    description: "Donde la formación clínica deja de ser teoría. Cada dato capturado tiene un propósito. Cada práctica deja rastro. Cada alumno opera dentro de un sistema mayor.",
  },
  {
    title: "DENTAXY ENTERPRISE",
    subtitle: "Arquitectura Clínica",
    icon: Building2,
    badge: "Arquitectura",
    // White-toned premium
    gradient: "from-slate-400 to-slate-200",
    accentColor: "#FFFFFF",
    isActive: false,
    hubModule: "enterprise",
    features: [
      "Arquitectura multi-entorno",
      "Flujos clínicos continuos",
      "Control administrativo central",
      "Seguridad por diseño",
    ],
    description: "La operación clínica como sistema. No importa cuántas unidades ni cuántos doctores. La información fluye. El control permanece. Esto no escala clínicas. Estandariza decisiones.",
  },
  {
    title: "PROYECTO STARK",
    subtitle: "CLASIFICADO",
    icon: Hand,
    badge: "Clasificado",
    // Neon Red → #FF2A2A
    gradient: "from-red-600 to-rose-500",
    accentColor: "#FF2A2A",
    isActive: false,
    isSecret: true,
    hubModule: "proyecto_stark",
    features: [],
    description: "",
  },
];

export const ModulosSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: false, margin: "-10%" });
  const navigate = useNavigate();

  const handleCTAClick = (mod: typeof modules[0], e: React.MouseEvent) => {
    e.stopPropagation();
    // Siempre navegar al Hub en la card correspondiente
    if (mod.hubModule) {
      navigate(`/modules?module=${mod.hubModule}`);
    } else {
      toast.info("🚧 En Desarrollo", {
        description: `${mod.title} estará disponible próximamente.`,
      });
    }
  };

  return (
    <section
      ref={ref}
      className="min-h-screen w-full max-w-full flex flex-col items-center justify-center bg-background px-4 sm:px-6 py-12 sm:py-16 overflow-hidden"
    >
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
        transition={{ duration: 0.6 }}
        className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground text-center mb-3 sm:mb-4"
      >
        Infraestructura modular
      </motion.h2>
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="text-muted-foreground text-center mb-8 sm:mb-10 max-w-lg text-sm sm:text-base px-4"
      >
        No ofrecemos herramientas. Construimos dependencias estratégicas.
      </motion.p>

      <div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 w-full max-w-7xl mx-auto px-4"
      >
        {modules.map((mod, i) => {
          return (
            <motion.div
              key={mod.title}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
              transition={{
                duration: 0.5,
                delay: i * 0.08,
              }}
              className="flex"
            >
              <div
                className={`flex-1 relative rounded-2xl overflow-hidden border border-white/20 dark:border-white/10 backdrop-blur-xl bg-white/5 dark:bg-black/10 p-6 flex flex-col hover:border-white/40 transition-colors ${mod.isSecret ? "border-red-500/30" : ""
                  }`}
              >
                {/* Background gradient hint */}
                <div className={`absolute inset-0 opacity-5 bg-gradient-to-br ${mod.gradient}`} />

                {/* Scanlines for secret */}
                {mod.isSecret && (
                  <div className="absolute inset-0 bg-[repeating-linear-gradient(0deg,transparent,transparent_2px,rgba(255,0,0,0.03)_2px,rgba(255,0,0,0.03)_4px)] pointer-events-none" />
                )}

                <div className="relative z-10 flex flex-col h-full">
                  {/* Header */}
                  <div className="flex items-center gap-4 mb-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center bg-gradient-to-br ${mod.gradient} shadow-lg shadow-black/20 flex-shrink-0`}>
                      <mod.icon className="text-white w-6 h-6" />
                    </div>
                    <div className="min-w-0">
                      <span
                        className={`inline-block text-[10px] font-bold tracking-wider px-2 py-0.5 rounded-full border uppercase mb-1 ${mod.isActive
                          ? "bg-emerald-500/20 border-emerald-500/50 text-emerald-500"
                          : mod.isSecret
                            ? "bg-red-500/20 border-red-500/50 text-red-400"
                            : "bg-muted/50 border-border text-muted-foreground"
                          }`}
                      >
                        {mod.badge}
                      </span>
                      <h3 className="font-semibold text-foreground text-lg truncate">
                        {mod.title}
                      </h3>
                    </div>
                  </div>

                  {/* Body */}
                  <div className="flex-1 flex flex-col">
                    <p className="text-xs font-medium text-muted-foreground mb-3 uppercase tracking-wide">
                      {mod.subtitle}
                    </p>
                    <p className="text-sm text-foreground/80 leading-relaxed mb-4">
                      {mod.description || "Módulo en fase de desarrollo estratégico."}
                    </p>

                    {/* Features list */}
                    {!mod.isSecret && mod.features.length > 0 && (
                      <ul className="space-y-2 mb-6">
                        {mod.features.map((feature, idx) => (
                          <li key={idx} className="flex items-start gap-2 text-xs text-muted-foreground">
                            <div className={`w-4 h-4 rounded-full flex items-center justify-center bg-gradient-to-br ${mod.gradient} flex-shrink-0 mt-0.5`}>
                              <Check className="w-2.5 h-2.5 text-white" />
                            </div>
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>

                  {/* CTA */}
                  {!mod.isSecret ? (
                    <div className="mt-auto">
                      <Button
                        onClick={(e) => handleCTAClick(mod, e)}
                        className={`w-full bg-gradient-to-r ${mod.gradient} hover:opacity-90 text-white rounded-xl py-5 text-sm font-medium shadow-md transition-all active:scale-95`}
                      >
                        {mod.isActive ? "Probar Demo" : "Notificarme"}
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                      <p className="text-[10px] text-muted-foreground text-center mt-2 font-medium opacity-60">
                        {mod.isActive ? "Acceso inmediato" : "Próximamente"}
                      </p>
                    </div>
                  ) : (
                    <div className="mt-auto pt-4 border-t border-white/5">
                      <p className="text-[10px] text-red-400 font-mono text-center uppercase tracking-widest">
                        Nivel de Acceso: Restringido
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
};
