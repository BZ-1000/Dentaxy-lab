import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { GraduationCap, Building2, Brain, Box, Hand, MapPin, Shield, Lock, ArrowLeft } from "lucide-react";
import { ShaderSplash } from "@/components/ShaderSplash";
import { ModuleCard } from "@/components/modules/ModuleCard";
import { toast } from "sonner";

const modules = [
  {
    id: "academico",
    title: "Dentaxy Académico",
    subtitle: "UAZ Sync",
    description: "Complemento estratégico para la educación clínica. Estandariza la recolección de datos para alumnos, módulo CLIJANIS para brigadas y extensión CLIMUZAC.",
    icon: GraduationCap,
    badge: "UAZ SYNC",
    gradient: "from-blue-500/20 via-cyan-500/10 to-transparent",
    accentColor: "#0066CC",
    glowColor: "bg-blue-500/30",
    borderGradient: "linear-gradient(135deg, rgba(0,102,204,0.5), rgba(0,102,204,0.1), transparent)",
    isActive: false,
    isSecret: false,
    route: "/academico",
  },
  {
    id: "enterprise",
    title: "Soluciones Enterprise",
    subtitle: "Clínicas Premium",
    description: "Unificación total de flujos clínicos, administrativos y de laboratorio. Gestión de especialidades con formularios inteligentes y seguridad Zero-Trust.",
    icon: Building2,
    badge: "ENTERPRISE",
    gradient: "from-amber-500/20 via-orange-500/10 to-transparent",
    accentColor: "#D4AF37",
    glowColor: "bg-amber-500/30",
    borderGradient: "linear-gradient(135deg, rgba(212,175,55,0.5), rgba(212,175,55,0.1), transparent)",
    isActive: false,
    isSecret: false,
    route: "/enterprise",
  },
  {
    id: "motor-neuronal",
    title: "Motor Neuronal",
    subtitle: "Prosa Clínica AI",
    description: "Transformación de datos crudos en narrativa clínica profesional y legalmente sólida. Generación instantánea de historias clínicas con IA.",
    icon: Brain,
    badge: "AI ACTIVO",
    gradient: "from-emerald-500/20 via-teal-500/10 to-transparent",
    accentColor: "#10B981",
    glowColor: "bg-emerald-500/30",
    borderGradient: "linear-gradient(135deg, rgba(16,185,129,0.5), rgba(16,185,129,0.1), transparent)",
    isActive: true,
    isSecret: false,
    route: "/app",
  },
  {
    id: "visor-3d",
    title: "Visualización 3D",
    subtitle: "DICOM Viewer",
    description: "Sustitución del envío ineficiente de radiografías. Visores nativos WebGL para archivos STL y DICOM con manipulación total en cualquier dispositivo.",
    icon: Box,
    badge: "DICOM",
    gradient: "from-purple-500/20 via-violet-500/10 to-transparent",
    accentColor: "#8B5CF6",
    glowColor: "bg-purple-500/30",
    borderGradient: "linear-gradient(135deg, rgba(139,92,246,0.5), rgba(139,92,246,0.1), transparent)",
    isActive: false,
    isSecret: false,
    route: "/visor-3d",
  },
  {
    id: "stark",
    title: "Proyecto Stark",
    subtitle: "TOP SECRET",
    description: "Computación espacial y control gestual. Interacción quirúrgica del futuro con algoritmos de Hand Tracking para explorar escaneos sin tocar la pantalla.",
    icon: Hand,
    badge: "TOP SECRET",
    gradient: "from-red-500/20 via-rose-500/10 to-transparent",
    accentColor: "#EF4444",
    glowColor: "bg-red-500/30",
    borderGradient: "linear-gradient(135deg, rgba(239,68,68,0.5), rgba(239,68,68,0.1), transparent)",
    isActive: false,
    isSecret: true,
    route: "/stark",
  },
];

export default function ModulesHub() {
  const navigate = useNavigate();
  const [showSplash, setShowSplash] = useState(true);
  const [showHub, setShowHub] = useState(false);

  // Check if we should skip splash (coming back from a module)
  useEffect(() => {
    const skipSplash = sessionStorage.getItem("skipHubSplash");
    if (skipSplash) {
      setShowSplash(false);
      setShowHub(true);
      sessionStorage.removeItem("skipHubSplash");
    }
  }, []);

  const handleSplashComplete = () => {
    setShowSplash(false);
    setTimeout(() => setShowHub(true), 100);
  };

  const handleModuleClick = (module: typeof modules[0]) => {
    if (module.isActive) {
      sessionStorage.setItem("skipHubSplash", "true");
      navigate(module.route);
    } else if (module.isSecret) {
      toast.error("🔒 Acceso Denegado", {
        description: "Nivel de autorización insuficiente. Proyecto clasificado.",
      });
    } else {
      toast.info("🚧 En Desarrollo", {
        description: `${module.title} estará disponible próximamente.`,
      });
    }
  };

  return (
    <div className="min-h-screen bg-black">
      {/* Splash Screen */}
      <AnimatePresence>
        {showSplash && <ShaderSplash onComplete={handleSplashComplete} />}
      </AnimatePresence>

      {/* Modules Hub */}
      <AnimatePresence>
        {showHub && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="min-h-screen bg-black"
          >
            {/* Background subtle gradient */}
            <div className="fixed inset-0 bg-gradient-to-br from-black via-gray-950 to-black" />
            
            {/* Grid pattern overlay */}
            <div
              className="fixed inset-0 opacity-[0.02]"
              style={{
                backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                                  linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
                backgroundSize: "50px 50px",
              }}
            />

            {/* Content */}
            <div className="relative z-10 container mx-auto px-6 py-12 min-h-screen flex flex-col">
              {/* Back Button */}
              <motion.button
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                onClick={() => navigate("/")}
                className="absolute top-6 left-6 flex items-center gap-2 px-4 py-2 rounded-lg border border-white/10 bg-white/5 backdrop-blur-sm text-white/60 hover:text-white hover:border-white/20 hover:bg-white/10 transition-all duration-300 group"
              >
                <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
                <span className="text-sm font-medium">Regresar</span>
              </motion.button>

              {/* Header */}
              <motion.header
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-center mb-12 mt-8"
              >
                <div className="flex items-center justify-center gap-3 mb-4">
                  <img
                    src="/lovable-uploads/3236de6d-a3e4-4b81-9c83-b32690d4212d.png"
                    alt="DENTAXY"
                    className="h-10 w-10"
                  />
                  <h1 className="text-2xl font-bold text-white tracking-tight">
                    DENTAXY <span className="text-white/50 font-normal">Technologies</span>
                  </h1>
                </div>
                <p className="text-white/40 text-sm max-w-md mx-auto">
                  Selecciona un módulo para comenzar
                </p>
              </motion.header>

              {/* Modules Grid */}
              <div className="flex-1 flex items-center justify-center">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl w-full">
                  {modules.map((module, index) => (
                    <ModuleCard
                      key={module.id}
                      title={module.title}
                      subtitle={module.subtitle}
                      description={module.description}
                      icon={module.icon}
                      badge={module.badge}
                      gradient={module.gradient}
                      accentColor={module.accentColor}
                      glowColor={module.glowColor}
                      borderGradient={module.borderGradient}
                      isActive={module.isActive}
                      isSecret={module.isSecret}
                      onClick={() => handleModuleClick(module)}
                      delay={0.4 + index * 0.1}
                    />
                  ))}
                </div>
              </div>

              {/* Security Footer */}
              <motion.footer
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
                className="mt-12"
              >
                <div className="max-w-2xl mx-auto">
                  <div className="rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm p-4">
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] font-mono">
                      {/* Location */}
                      <div className="flex items-center gap-2 text-white/50">
                        <MapPin className="h-3.5 w-3.5 text-emerald-500" />
                        <span>FRESNILLO / ZACATECAS / MX</span>
                      </div>

                      {/* Security Status */}
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2 text-white/50">
                          <Lock className="h-3.5 w-3.5 text-amber-500" />
                          <span>AES-256 ACTIVE</span>
                        </div>
                        <div className="h-3 w-px bg-white/20" />
                        <div className="flex items-center gap-2 text-white/50">
                          <Shield className="h-3.5 w-3.5 text-blue-500" />
                          <span>ZERO-TRUST ARCHITECTURE</span>
                        </div>
                      </div>
                    </div>

                    {/* Progress bar */}
                    <div className="mt-3 flex items-center gap-3">
                      <div className="flex-1 h-1 bg-white/10 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: "100%" }}
                          transition={{ duration: 2, delay: 1.2 }}
                          className="h-full bg-gradient-to-r from-emerald-500 via-blue-500 to-purple-500"
                        />
                      </div>
                      <span className="text-[10px] text-emerald-500 font-mono">
                        SECURE CONNECTION
                      </span>
                    </div>
                  </div>
                </div>
              </motion.footer>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
