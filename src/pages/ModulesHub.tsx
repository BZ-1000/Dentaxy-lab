import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { GraduationCap, Building2, Brain, Box, Hand, MapPin, Shield, Lock, ArrowLeft, Loader2 } from "lucide-react";
import { ShaderSplash } from "@/components/ShaderSplash";
import { ExpandableModuleCard } from "@/components/modules/ExpandableModuleCard";
import { supabase } from "@/integrations/supabase/client";

// Configuración completa de módulos con información expandida - Copy Premium
const modulesConfig = [
  {
    name: "academico",
    title: "UAZ SYNC",
    subtitle: "Infraestructura académica para atención clínica real.",
    description: "Donde la formación clínica deja de ser teoría.\n\nCada dato capturado tiene un propósito.\nCada práctica deja rastro.\nCada alumno opera dentro de un sistema mayor.\n\nEsto no es un formulario.\nEs el inicio de una red.",
    icon: GraduationCap,
    badge: "UAZ SYNC",
    gradient: "from-blue-500/20 via-cyan-500/10 to-transparent",
    accentColor: "#0066CC",
    glowColor: "bg-blue-500/30",
    borderGradient: "linear-gradient(135deg, rgba(0,102,204,0.5), rgba(0,102,204,0.1), transparent)",
    moduleInfo: {
      whatItDemonstrates: "Lo que aquí se genera, no se pierde. Se transforma.",
      problemItSolves: "Clínicas universitarias conectadas. Operación geolocalizada. Datos clínicos estandarizados.",
      contextOfUse: "Supervisión institucional silenciosa. Red académica unificada.",
      publicTarget: "Instituciones que entienden que el control empieza en la formación.",
      whatIncluded: ["Clínicas universitarias conectadas", "Operación geolocalizada", "Datos clínicos estandarizados", "Supervisión institucional silenciosa"],
      whatNotIncluded: ["Acceso sin autorización", "Datos sin propósito", "Sistemas desconectados"],
    },
  },
  {
    name: "enterprise",
    title: "ENTERPRISE",
    subtitle: "Cuando la clínica deja de depender de personas.",
    description: "La operación clínica como sistema.\n\nNo importa cuántas unidades, cuántos doctores o cuántos pacientes.\nLa información fluye.\nEl control permanece.\n\nEsto no escala clínicas.\nEstandariza decisiones.",
    icon: Building2,
    badge: "ENTERPRISE",
    gradient: "from-amber-500/20 via-orange-500/10 to-transparent",
    accentColor: "#D4AF37",
    glowColor: "bg-amber-500/30",
    borderGradient: "linear-gradient(135deg, rgba(212,175,55,0.5), rgba(212,175,55,0.1), transparent)",
    moduleInfo: {
      whatItDemonstrates: "Aquí no se improvisa. Se gobierna.",
      problemItSolves: "Arquitectura multi-entorno. Flujos clínicos continuos. Control administrativo central.",
      contextOfUse: "Seguridad por diseño. Operación que no depende de individuos.",
      publicTarget: "Clínicas que buscan trascender la dependencia del talento individual.",
      whatIncluded: ["Arquitectura multi-entorno", "Flujos clínicos continuos", "Control administrativo central", "Seguridad por diseño"],
      whatNotIncluded: ["Improvisación operativa", "Dependencia de personas", "Información fragmentada"],
    },
  },
  {
    name: "motor_neuronal",
    title: "AI ACTIVO",
    subtitle: "Cuando los datos aprenden a hablar.",
    description: "El clínico piensa.\nEl sistema redacta.\n\nLa narrativa se vuelve consistente, clara y reutilizable.\n\nNo es automatización.\nEs asistencia cognitiva.",
    icon: Brain,
    badge: "AI ACTIVO",
    gradient: "from-emerald-500/20 via-teal-500/10 to-transparent",
    accentColor: "#10B981",
    glowColor: "bg-emerald-500/30",
    borderGradient: "linear-gradient(135deg, rgba(16,185,129,0.5), rgba(16,185,129,0.1), transparent)",
    moduleInfo: {
      whatItDemonstrates: "La historia clínica ya no se escribe. Se construye.",
      problemItSolves: "Narrativa clínica profesional. Coherencia documental. Menos escritura, más criterio.",
      contextOfUse: "Documentación con peso legal. Expedientes que resisten auditorías.",
      publicTarget: "Profesionales que valoran su tiempo y la precisión de su documentación.",
      whatIncluded: ["Narrativa clínica profesional", "Coherencia documental", "Menos escritura, más criterio", "Documentación con peso legal"],
      whatNotIncluded: ["Diagnóstico automatizado", "Decisiones clínicas", "Reemplazo del criterio médico"],
    },
  },
  {
    name: "visualizacion_3d",
    title: "DICOM",
    subtitle: "Ver no es suficiente. Hay que interactuar.",
    description: "La imagen clínica deja de ser un archivo.\nSe convierte en un espacio manipulable.\n\nDirecto. Seguro. Sin fricción.\n\nAquí la imagen no se envía.\nSe explora.",
    icon: Box,
    badge: "DICOM",
    gradient: "from-purple-500/20 via-violet-500/10 to-transparent",
    accentColor: "#8B5CF6",
    glowColor: "bg-purple-500/30",
    borderGradient: "linear-gradient(135deg, rgba(139,92,246,0.5), rgba(139,92,246,0.1), transparent)",
    moduleInfo: {
      whatItDemonstrates: "La imagen también decide.",
      problemItSolves: "Modelos 3D interactivos. Estudios accesibles desde cualquier dispositivo. Comunicación visual precisa.",
      contextOfUse: "Contexto clínico real. Sin envíos inseguros por WhatsApp.",
      publicTarget: "Profesionales que entienden que la imagen es parte del diagnóstico.",
      whatIncluded: ["Modelos 3D interactivos", "Estudios accesibles desde cualquier dispositivo", "Comunicación visual precisa", "Contexto clínico real"],
      whatNotIncluded: ["Almacenamiento PACS", "Procesamiento de tomografías completas", "Envíos por canales inseguros"],
    },
  },
  {
    name: "proyecto_stark",
    title: "PROYECTO STARK",
    subtitle: "CLASIFICADO",
    description: "",
    icon: Hand,
    badge: "CLASIFICADO",
    gradient: "from-red-500/20 via-rose-500/10 to-transparent",
    accentColor: "#EF4444",
    glowColor: "bg-red-500/30",
    borderGradient: "linear-gradient(135deg, rgba(239,68,68,0.5), rgba(239,68,68,0.1), transparent)",
    isClassified: true,
    moduleInfo: {
      whatItDemonstrates: "",
      problemItSolves: "",
      contextOfUse: "",
      publicTarget: "",
      whatIncluded: [],
      whatNotIncluded: [],
    },
  },
];

interface ModuleState {
  is_enabled: boolean;
  status: string;
}

export default function ModulesHub() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const demoToken = searchParams.get('demo');
  
  const [showSplash, setShowSplash] = useState(true);
  const [showHub, setShowHub] = useState(false);
  const [modulesState, setModulesState] = useState<Record<string, ModuleState>>({});
  const [isLoading, setIsLoading] = useState(true);

  // Fetch module states from database
  useEffect(() => {
    const fetchModuleStates = async () => {
      try {
        const { data, error } = await supabase
          .from('dentaxy_modules')
          .select('name, is_enabled, status');

        if (error) throw error;

        const stateMap: Record<string, ModuleState> = {};
        data?.forEach((m) => {
          stateMap[m.name] = {
            is_enabled: m.is_enabled ?? false,
            status: m.status ?? 'blocked',
          };
        });
        setModulesState(stateMap);
      } catch (error) {
        console.error('Error fetching module states:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchModuleStates();

    // Real-time subscription for instant updates
    const channel = supabase
      .channel('modules-realtime')
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'dentaxy_modules' },
        (payload) => {
          const updated = payload.new as { name: string; is_enabled: boolean; status: string };
          setModulesState((prev) => ({
            ...prev,
            [updated.name]: {
              is_enabled: updated.is_enabled,
              status: updated.status,
            },
          }));
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

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

  // No longer needed - access is controlled via demo links only

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

              {/* Loading state */}
              {isLoading ? (
                <div className="flex-1 flex items-center justify-center">
                  <Loader2 className="h-8 w-8 animate-spin text-white/40" />
                </div>
              ) : (
                /* Modules Grid - Expandable Cards */
                <div className="flex-1 flex items-start justify-center py-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl w-full items-start">
                    {modulesConfig.map((module, index) => (
                      <ExpandableModuleCard
                        key={module.name}
                        name={module.name}
                        title={module.title}
                        subtitle={module.subtitle}
                        description={module.description}
                        icon={module.icon}
                        badge={module.badge}
                        gradient={module.gradient}
                        accentColor={module.accentColor}
                        glowColor={module.glowColor}
                        borderGradient={module.borderGradient}
                        moduleInfo={module.moduleInfo}
                        delay={0.4 + index * 0.1}
                        prefilledToken={demoToken || undefined}
                        isClassified={'isClassified' in module ? module.isClassified : false}
                      />
                    ))}
                  </div>
                </div>
              )}

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
