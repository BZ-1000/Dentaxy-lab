import { motion, useInView, AnimatePresence } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import { Brain, GraduationCap, Building2, Box, Shield, ArrowRight, Check } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

const modules = [
  {
    title: "AI ACTIVO",
    subtitle: "Motor Neuronal",
    icon: Brain,
    badge: "Activo",
    gradient: "from-emerald-500 to-teal-500",
    glowColor: "emerald",
    isActive: true,
    route: "/app",
    features: [
      "Narrativa clínica profesional",
      "Coherencia documental",
      "Documentación con peso legal",
    ],
    description: "El clínico piensa. El sistema redacta. La historia clínica ya no se escribe. Se construye.",
  },
  {
    title: "UAZ SYNC",
    subtitle: "Académico",
    icon: GraduationCap,
    badge: "Infraestructura",
    gradient: "from-blue-500 to-cyan-500",
    glowColor: "blue",
    isActive: false,
    features: [
      "Clínicas universitarias conectadas",
      "Operación geolocalizada",
      "Supervisión institucional silenciosa",
    ],
    description: "Donde la formación clínica deja de ser teoría. Cada dato capturado tiene un propósito.",
  },
  {
    title: "ENTERPRISE",
    subtitle: "Clínicas Premium",
    icon: Building2,
    badge: "Arquitectura",
    gradient: "from-purple-500 to-pink-500",
    glowColor: "purple",
    isActive: false,
    features: [
      "Arquitectura multi-entorno",
      "Control administrativo central",
      "Seguridad por diseño",
    ],
    description: "La operación clínica como sistema. Aquí no se improvisa. Se gobierna.",
  },
  {
    title: "DICOM",
    subtitle: "Visualización 3D",
    icon: Box,
    badge: "Interactivo",
    gradient: "from-orange-500 to-amber-500",
    glowColor: "orange",
    isActive: false,
    features: [
      "Modelos 3D interactivos",
      "Comunicación visual precisa",
      "Contexto clínico real",
    ],
    description: "Ver no es suficiente. Hay que interactuar. La imagen también decide.",
  },
  {
    title: "PROYECTO STARK",
    subtitle: "Clasificado",
    icon: Shield,
    badge: "Clasificado",
    gradient: "from-red-500 to-rose-500",
    glowColor: "red",
    isActive: false,
    isSecret: true,
    features: [],
    description: "",
  },
];

export const ModulosSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: false, margin: "-10%" });
  const navigate = useNavigate();
  const [expandedModule, setExpandedModule] = useState<string | null>(null);

  // Reset expanded state when out of view
  useEffect(() => {
    if (!isInView) {
      setExpandedModule(null);
    }
  }, [isInView]);

  const handleModuleClick = (mod: typeof modules[0]) => {
    if (mod.isSecret) {
      toast.error("🔒 Acceso Denegado", {
        description: "Este módulo requiere autorización especial.",
      });
      return;
    }
    setExpandedModule(expandedModule === mod.title ? null : mod.title);
  };

  const handleCTAClick = (mod: typeof modules[0], e: React.MouseEvent) => {
    e.stopPropagation();
    if (mod.isActive && mod.route) {
      navigate(mod.route);
    } else {
      toast.info("🚧 En Desarrollo", {
        description: `${mod.title} estará disponible próximamente.`,
      });
    }
  };

  const getGlowStyle = (color: string, isExpanded: boolean) => {
    if (!isExpanded) return {};
    const glowColors: Record<string, string> = {
      emerald: "0 0 60px rgba(16, 185, 129, 0.3)",
      blue: "0 0 60px rgba(59, 130, 246, 0.3)",
      purple: "0 0 60px rgba(168, 85, 247, 0.3)",
      orange: "0 0 60px rgba(249, 115, 22, 0.3)",
      red: "0 0 60px rgba(239, 68, 68, 0.3)",
    };
    return { boxShadow: glowColors[color] || "" };
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

      <motion.div
        layout
        className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3 sm:gap-4 w-full max-w-7xl mx-auto"
      >
        {modules.map((mod, i) => {
          const isExpanded = expandedModule === mod.title;

          return (
            <motion.div
              key={mod.title}
              layout
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
              transition={{
                duration: 0.5,
                delay: i * 0.08,
                layout: { type: "spring", stiffness: 300, damping: 30 }
              }}
              onClick={() => handleModuleClick(mod)}
              className={`cursor-pointer ${isExpanded ? "col-span-2 sm:col-span-2 lg:col-span-3 xl:col-span-5" : ""}`}
            >
              <motion.div
                layout
                whileHover={!isExpanded ? { scale: 1.02, y: -4 } : {}}
                className={`relative rounded-xl sm:rounded-2xl overflow-hidden transition-all duration-300 ${mod.isSecret ? "animate-pulse" : ""
                  }`}
                style={getGlowStyle(mod.glowColor, isExpanded)}
              >
                {/* Glassmorphism Card */}
                <div className={`relative backdrop-blur-xl bg-white/5 dark:bg-black/10 border border-white/20 dark:border-white/10 rounded-xl sm:rounded-2xl ${isExpanded ? "p-4 sm:p-6" : "p-3 sm:p-5"
                  }`}>
                  {/* Background gradient */}
                  <div className={`absolute inset-0 opacity-10 bg-gradient-to-br ${mod.gradient} rounded-xl sm:rounded-2xl`} />

                  {/* Scanlines for secret */}
                  {mod.isSecret && (
                    <div className="absolute inset-0 bg-[repeating-linear-gradient(0deg,transparent,transparent_2px,rgba(255,0,0,0.03)_2px,rgba(255,0,0,0.03)_4px)] pointer-events-none rounded-xl sm:rounded-2xl" />
                  )}

                  <motion.div layout="position" className="relative z-10">
                    {/* Header row */}
                    <div className={`flex items-start gap-2 sm:gap-4 ${isExpanded ? "mb-4 sm:mb-6" : ""}`}>
                      {/* Icon */}
                      <motion.div
                        layout="position"
                        className={`rounded-lg sm:rounded-xl flex items-center justify-center bg-gradient-to-br ${mod.gradient} ${isExpanded ? "w-10 h-10 sm:w-14 sm:h-14" : "w-8 h-8 sm:w-10 sm:h-10"
                          }`}
                      >
                        <mod.icon className={`text-white ${isExpanded ? "w-5 h-5 sm:w-7 sm:h-7" : "w-4 h-4 sm:w-5 sm:h-5"}`} />
                      </motion.div>

                      <div className="flex-1 min-w-0">
                        {/* Badge */}
                        <motion.span
                          layout="position"
                          className={`inline-block text-[8px] sm:text-[9px] font-bold tracking-wider px-1.5 sm:px-2 py-0.5 rounded-full border uppercase mb-1 sm:mb-2 ${mod.isActive
                              ? "bg-emerald-500/20 border-emerald-500/50 text-emerald-500"
                              : mod.isSecret
                                ? "bg-red-500/20 border-red-500/50 text-red-400"
                                : "bg-muted/50 border-border text-muted-foreground"
                            }`}
                        >
                          {mod.badge}
                        </motion.span>

                        {/* Title */}
                        <motion.h3
                          layout="position"
                          className={`font-semibold text-foreground truncate ${isExpanded ? "text-base sm:text-xl" : "text-xs sm:text-base"}`}
                        >
                          {mod.title}
                        </motion.h3>
                        <motion.p
                          layout="position"
                          className="text-[10px] sm:text-xs text-muted-foreground truncate"
                        >
                          {mod.subtitle}
                        </motion.p>
                      </div>
                    </div>

                    {/* Expanded Content - Not for secret modules */}
                    <AnimatePresence>
                      {isExpanded && !mod.isSecret && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.3 }}
                          className="overflow-hidden"
                        >
                          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                            {/* Description */}
                            <div>
                              <p className="text-muted-foreground leading-relaxed mb-3 sm:mb-4 text-xs sm:text-base">
                                {mod.description}
                              </p>

                              {/* Features */}
                              {mod.features.length > 0 && (
                                <ul className="space-y-2">
                                  {mod.features.map((feature, idx) => (
                                    <motion.li
                                      key={idx}
                                      initial={{ opacity: 0, x: -20 }}
                                      animate={{ opacity: 1, x: 0 }}
                                      transition={{ delay: idx * 0.1 }}
                                      className="flex items-center gap-2 text-xs sm:text-sm text-muted-foreground"
                                    >
                                      <div className={`w-4 h-4 sm:w-5 sm:h-5 rounded-full flex items-center justify-center bg-gradient-to-br ${mod.gradient} flex-shrink-0`}>
                                        <Check className="w-2 h-2 sm:w-3 sm:h-3 text-white" />
                                      </div>
                                      {feature}
                                    </motion.li>
                                  ))}
                                </ul>
                              )}
                            </div>

                            {/* CTA */}
                            <div className="flex flex-col justify-end">
                              <Button
                                onClick={(e) => handleCTAClick(mod, e)}
                                className={`w-full bg-gradient-to-r ${mod.gradient} hover:opacity-90 text-white rounded-lg sm:rounded-xl py-4 sm:py-6 text-sm sm:text-base font-medium shadow-lg`}
                              >
                                {mod.isActive ? "Probar Demo" : "Notificarme"}
                                <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 ml-2" />
                              </Button>
                              <p className="text-[10px] sm:text-xs text-muted-foreground text-center mt-2">
                                {mod.isActive ? "Acceso inmediato" : "Te avisaremos cuando esté listo"}
                              </p>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                </div>
              </motion.div>
            </motion.div>
          );
        })}
      </motion.div>
    </section>
  );
};
