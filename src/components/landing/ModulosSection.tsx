import { motion, useInView, AnimatePresence } from "framer-motion";
import { useRef, useState } from "react";
import { Brain, GraduationCap, Building2, Box, Shield, X, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

const modules = [
  {
    title: "Motor Neuronal",
    subtitle: "IA Clínica",
    icon: Brain,
    badge: "Activo",
    gradient: "from-emerald-500 to-teal-500",
    color: "emerald",
    isActive: true,
    route: "/app",
    description: `Nuestro motor de inteligencia artificial clínica transforma datos crudos en narrativa profesional. Analiza padecimientos, antecedentes y exploraciones físicas para generar historias clínicas completas en segundos.

Características principales:
• Redacción automatizada con lenguaje médico estandarizado
• Generación instantánea de resúmenes clínicos
• Exportación a PDF profesional
• Compatible con expedientes universitarios y clínicos`,
  },
  {
    title: "Académico",
    subtitle: "Educación",
    icon: GraduationCap,
    badge: "Próximamente",
    gradient: "from-blue-500 to-cyan-500",
    color: "blue",
    isActive: false,
    description: `Módulo diseñado específicamente para instituciones educativas y estudiantes de odontología.

Funcionalidades planificadas:
• Integración con sistemas académicos universitarios
• Seguimiento de casos clínicos estudiantiles
• Evaluación automática de historias clínicas
• Biblioteca de casos de estudio`,
  },
  {
    title: "Enterprise",
    subtitle: "Clínicas",
    icon: Building2,
    badge: "Próximamente",
    gradient: "from-purple-500 to-pink-500",
    color: "purple",
    isActive: false,
    description: `Solución empresarial para clínicas y consultorios dentales con múltiples profesionales.

Funcionalidades planificadas:
• Gestión multi-usuario y roles
• Dashboard administrativo centralizado
• Reportes y analíticas avanzadas
• Integración con sistemas de gestión clínica`,
  },
  {
    title: "Visualización 3D",
    subtitle: "Modelos",
    icon: Box,
    badge: "Próximamente",
    gradient: "from-orange-500 to-amber-500",
    color: "orange",
    isActive: false,
    description: `Visualización interactiva de modelos dentales en 3D para diagnóstico y presentación.

Funcionalidades planificadas:
• Modelos 3D interactivos de piezas dentales
• Visualización de tratamientos propuestos
• Herramientas de anotación y marcado
• Exportación para presentaciones`,
  },
  {
    title: "Proyecto Stark",
    subtitle: "Clasificado",
    icon: Shield,
    badge: "Bloqueado",
    gradient: "from-red-500 to-rose-500",
    color: "red",
    isActive: false,
    isSecret: true,
    description: "Este proyecto requiere autorización especial para acceder a su información.",
  },
];

export const ModulosSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const navigate = useNavigate();
  const [expandedModule, setExpandedModule] = useState<string | null>(null);

  const handleModuleClick = (mod: typeof modules[0]) => {
    if (mod.isSecret) {
      toast.error("🔒 Acceso Denegado", {
        description: "Este módulo requiere autorización especial.",
      });
      return;
    }
    setExpandedModule(expandedModule === mod.title ? null : mod.title);
  };

  const handleCTAClick = (mod: typeof modules[0]) => {
    if (mod.isActive && mod.route) {
      navigate(mod.route);
    } else {
      toast.info("🚧 En Desarrollo", {
        description: `${mod.title} estará disponible próximamente.`,
      });
    }
  };

  const getButtonColorClass = (color: string) => {
    const colorMap: Record<string, string> = {
      emerald: "bg-emerald-500 hover:bg-emerald-600",
      blue: "bg-blue-500 hover:bg-blue-600",
      purple: "bg-purple-500 hover:bg-purple-600",
      orange: "bg-orange-500 hover:bg-orange-600",
      red: "bg-red-500 hover:bg-red-600",
    };
    return colorMap[color] || "bg-primary hover:bg-primary/90";
  };

  return (
    <section ref={ref} className="min-h-screen flex flex-col items-center justify-center bg-background px-6 py-20">
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6 }}
        className="text-3xl md:text-4xl font-bold text-foreground text-center mb-12"
      >
        Explora nuestros módulos
      </motion.h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 max-w-7xl mx-auto w-full">
        {modules.map((mod, i) => (
          <motion.div
            key={mod.title}
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: i * 0.1 }}
            layout
            className="relative"
          >
            <AnimatePresence mode="wait">
              {expandedModule === mod.title ? (
                <motion.div
                  key="expanded"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3 }}
                  className="absolute inset-0 z-20 sm:fixed sm:inset-4 sm:top-20 sm:bottom-20 sm:left-1/2 sm:-translate-x-1/2 sm:max-w-2xl sm:w-full"
                >
                  <div className="relative rounded-2xl p-6 h-full backdrop-blur-xl bg-background border border-border shadow-2xl overflow-y-auto">
                    {/* Close button */}
                    <button
                      onClick={() => setExpandedModule(null)}
                      className="absolute top-4 right-4 p-2 rounded-full bg-muted hover:bg-muted/80 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>

                    {/* Header */}
                    <div className="flex items-start gap-4 mb-6">
                      <div className={`w-14 h-14 rounded-xl flex items-center justify-center bg-gradient-to-br ${mod.gradient}`}>
                        <mod.icon className="w-7 h-7 text-white" />
                      </div>
                      <div>
                        <span
                          className={`text-[10px] font-bold tracking-wider px-2 py-0.5 rounded-full border uppercase mb-2 inline-block ${
                            mod.isActive
                              ? "bg-emerald-500/20 border-emerald-500/50 text-emerald-600"
                              : "bg-muted border-border text-muted-foreground"
                          }`}
                        >
                          {mod.badge}
                        </span>
                        <h3 className="text-2xl font-bold text-foreground">{mod.title}</h3>
                        <p className="text-sm text-muted-foreground">{mod.subtitle}</p>
                      </div>
                    </div>

                    {/* Description */}
                    <div className="prose prose-sm max-w-none mb-6">
                      <p className="text-muted-foreground whitespace-pre-line leading-relaxed">
                        {mod.description}
                      </p>
                    </div>

                    {/* CTA Button */}
                    <Button
                      onClick={() => handleCTAClick(mod)}
                      className={`w-full ${getButtonColorClass(mod.color)} text-white`}
                    >
                      {mod.isActive ? "Probar Demo" : "Notificarme cuando esté disponible"}
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="collapsed"
                  whileHover={{ scale: 1.03, y: -5 }}
                  onClick={() => handleModuleClick(mod)}
                  className="group cursor-pointer relative rounded-xl p-[1px] overflow-hidden"
                  style={{
                    background: `linear-gradient(135deg, ${mod.isActive ? "#10b981" : "hsl(var(--border))"}, transparent)`,
                  }}
                >
                  <div className="relative rounded-xl p-5 h-full min-h-[160px] backdrop-blur-xl bg-background border border-border flex flex-col">
                    {/* Background gradient */}
                    <div className={`absolute inset-0 opacity-10 group-hover:opacity-20 transition-opacity bg-gradient-to-br ${mod.gradient}`} />

                    {/* Badge */}
                    <div className="relative z-10 mb-3">
                      <span
                        className={`text-[9px] font-bold tracking-wider px-2 py-0.5 rounded-full border uppercase ${
                          mod.isActive
                            ? "bg-emerald-500/20 border-emerald-500/50 text-emerald-600"
                            : mod.isSecret
                            ? "bg-red-500/20 border-red-500/50 text-red-500 animate-pulse"
                            : "bg-muted border-border text-muted-foreground"
                        }`}
                      >
                        {mod.badge}
                      </span>
                    </div>

                    {/* Icon */}
                    <div className={`relative z-10 w-10 h-10 rounded-lg flex items-center justify-center mb-3 bg-gradient-to-br ${mod.gradient}`}>
                      <mod.icon className="w-5 h-5 text-white" />
                    </div>

                    {/* Title & Subtitle */}
                    <div className="relative z-10 mt-auto">
                      <h3 className="text-base font-semibold text-foreground">{mod.title}</h3>
                      <p className="text-xs text-muted-foreground">{mod.subtitle}</p>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>

      {/* Overlay backdrop when expanded */}
      <AnimatePresence>
        {expandedModule && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setExpandedModule(null)}
            className="fixed inset-0 bg-black/50 z-10 hidden sm:block"
          />
        )}
      </AnimatePresence>
    </section>
  );
};
