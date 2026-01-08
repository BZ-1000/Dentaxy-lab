import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Brain, GraduationCap, Building2, Box, Shield } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const modules = [
  {
    title: "Motor Neuronal",
    subtitle: "IA Clínica",
    icon: Brain,
    badge: "Activo",
    gradient: "from-emerald-500 to-teal-500",
    isActive: true,
    route: "/app",
  },
  {
    title: "Académico",
    subtitle: "Educación",
    icon: GraduationCap,
    badge: "Próximamente",
    gradient: "from-blue-500 to-cyan-500",
    isActive: false,
  },
  {
    title: "Enterprise",
    subtitle: "Clínicas",
    icon: Building2,
    badge: "Próximamente",
    gradient: "from-purple-500 to-pink-500",
    isActive: false,
  },
  {
    title: "Visualización 3D",
    subtitle: "Modelos",
    icon: Box,
    badge: "Próximamente",
    gradient: "from-orange-500 to-amber-500",
    isActive: false,
  },
  {
    title: "Proyecto Stark",
    subtitle: "Clasificado",
    icon: Shield,
    badge: "Bloqueado",
    gradient: "from-red-500 to-rose-500",
    isActive: false,
    isSecret: true,
  },
];

export const ModulosSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const navigate = useNavigate();

  const handleModuleClick = (mod: typeof modules[0]) => {
    if (mod.isActive && mod.route) {
      navigate(mod.route);
    } else if (mod.isSecret) {
      toast.error("🔒 Acceso Denegado", {
        description: "Este módulo requiere autorización especial.",
      });
    } else {
      toast.info("🚧 En Desarrollo", {
        description: `${mod.title} estará disponible próximamente.`,
      });
    }
  };

  return (
    <section ref={ref} className="min-h-screen flex flex-col items-center justify-center bg-black px-6 py-20">
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6 }}
        className="text-3xl md:text-4xl font-bold text-white text-center mb-12"
      >
        Explora nuestros módulos
      </motion.h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 max-w-7xl mx-auto">
        {modules.map((mod, i) => (
          <motion.div
            key={mod.title}
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: i * 0.1 }}
            whileHover={{ scale: 1.03, y: -5 }}
            onClick={() => handleModuleClick(mod)}
            className="group cursor-pointer relative rounded-xl p-[1px] overflow-hidden"
            style={{
              background: `linear-gradient(135deg, ${mod.isActive ? "#10b981" : "#ffffff20"}, transparent)`,
            }}
          >
            <div className="relative rounded-xl p-5 h-full min-h-[160px] backdrop-blur-xl bg-black/80 border border-white/10 flex flex-col">
              {/* Background gradient */}
              <div className={`absolute inset-0 opacity-20 group-hover:opacity-40 transition-opacity bg-gradient-to-br ${mod.gradient}`} />

              {/* Badge */}
              <div className="relative z-10 mb-3">
                <span
                  className={`text-[9px] font-bold tracking-wider px-2 py-0.5 rounded-full border uppercase ${
                    mod.isActive
                      ? "bg-emerald-500/20 border-emerald-500/50 text-emerald-400"
                      : mod.isSecret
                      ? "bg-red-500/20 border-red-500/50 text-red-400 animate-pulse"
                      : "bg-white/10 border-white/20 text-white/60"
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
                <h3 className="text-base font-semibold text-white">{mod.title}</h3>
                <p className="text-xs text-white/50">{mod.subtitle}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};
