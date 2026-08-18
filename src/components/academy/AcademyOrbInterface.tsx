import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FileText,
  ClipboardList,
  Sparkles,
  Pill,
  ShieldCheck,
  AlertTriangle,
  Mic,
  Scan,
  LogOut,
  Plus,
  Smartphone,
  Monitor,
  Palette,
  ChevronDown,
  ArrowUp,
  Menu,
  X,
  Sprout,
  GraduationCap,
  ShoppingBag,
  FlaskConical,
  Users,
  ChevronRight,
  Bell,
  Instagram,
  HelpCircle,
  BookOpen,
  FolderHeart,
  MessageSquare,
  User,
  RefreshCw,
  Settings,
  CheckCircle2,
  LayoutGrid,
  Search,
  ArrowLeft,
} from "lucide-react";
import { useAuthStore } from "@/store/useAuthStore";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { DENTAXY_ACADEMY_VERSION } from "@/config/version";
import { DentaxyFormPanel } from "@/components/academico/DentaxyFormPanel";
import { AnalysisModeProvider } from "@/contexts/AnalysisModeContext";

// ─── MENÚ ORBITAL LÍQUIDO 3D — CAPACIDADES DE DEX IA ─────────────────────────
const DEX_ORBITAL_CAPABILITIES = [
  {
    id: "nota-evolucion",
    label: "Nota de Evolución SOAP",
    desc: "Redacción de evolución clínica instantánea",
    icon: FileText,
    angle: 270, // Arriba (Top)
    neonColor: "#00ff88",
    glowShadow: "rgba(0, 255, 136, 0.9)",
    bgGradient: "from-emerald-400/90 via-emerald-600 to-teal-950",
  },
  {
    id: "historia-clinica",
    label: "Historia Clínica",
    desc: "Compilación de 21 secciones NOM-004",
    icon: ClipboardList,
    angle: 315, // Arriba-Derecha
    neonColor: "#00d2ff",
    glowShadow: "rgba(0, 210, 255, 0.9)",
    bgGradient: "from-cyan-400/90 via-blue-600 to-indigo-950",
  },
  {
    id: "odontograma-ia",
    label: "Odontograma IA",
    desc: "Mapeo dental e historial de órganos",
    icon: Sparkles,
    angle: 0, // Derecha
    neonColor: "#b026ff",
    glowShadow: "rgba(176, 38, 255, 0.9)",
    bgGradient: "from-fuchsia-400/90 via-purple-600 to-slate-950",
  },
  {
    id: "recetas-medicas",
    label: "Recetas Médicas",
    desc: "Prescripción y cruzamiento de dosis",
    icon: Pill,
    angle: 45, // Abajo-Derecha
    neonColor: "#ff007f",
    glowShadow: "rgba(255, 0, 127, 0.9)",
    bgGradient: "from-pink-400/90 via-rose-600 to-rose-950",
  },
  {
    id: "consentimiento",
    label: "Consentimiento Informado",
    desc: "Generador de consentimientos legales",
    icon: ShieldCheck,
    angle: 90, // Abajo
    neonColor: "#ffaa00",
    glowShadow: "rgba(255, 170, 0, 0.9)",
    bgGradient: "from-amber-300/90 via-amber-500 to-amber-950",
  },
  {
    id: "riesgos-alergias",
    label: "Semáforo de Riesgos",
    desc: "Control de alergias y contraindicaciones",
    icon: AlertTriangle,
    angle: 135, // Abajo-Izquierda
    neonColor: "#ff2a2a",
    glowShadow: "rgba(255, 42, 42, 0.9)",
    bgGradient: "from-red-400/90 via-red-600 to-stone-950",
  },
  {
    id: "dictado-voz",
    label: "Dictado Clínico por Voz",
    desc: "Transcripción vocal en tiempo real",
    icon: Mic,
    angle: 180, // Izquierda
    neonColor: "#00f2fe",
    glowShadow: "rgba(0, 242, 254, 0.9)",
    bgGradient: "from-teal-300/90 via-cyan-500 to-sky-950",
  },
  {
    id: "analisis-rx",
    label: "Análisis Radiográfico",
    desc: "Inspección radiográfica por visión IA",
    icon: Scan,
    angle: 225, // Arriba-Izquierda
    neonColor: "#7928ca",
    glowShadow: "rgba(121, 40, 202, 0.9)",
    bgGradient: "from-violet-400/90 via-indigo-600 to-slate-950",
  },
];

// ─── HISTORIAL DE TRABAJOS CLÍNICOS REALIZADOS (DENTAXY ACADEMY UAZ) ─────────────
const CLINICAL_WORK_HISTORY = [
  {
    id: "nom004-soap-1",
    title: "Historia Clínica NOM-004 - Alex Ramos",
    type: "Nota SOAP / Evolución",
    date: "14 Jun, 2026",
    bgClass: "bg-slate-950 border border-emerald-500/30",
    previewType: "code",
    deviceIcon: "🖥️",
    shared: false,
  },
  {
    id: "endodoncia-36",
    title: "Tratamiento Endodoncia Molar 36",
    type: "Dictado por Voz Dex IA",
    date: "1 Jun, 2026",
    bgClass: "bg-slate-900 border border-purple-500/30",
    previewType: "dashboard",
    deviceIcon: "🖥️",
    shared: false,
  },
  {
    id: "odontograma-limpieza",
    title: "Odontograma Inicial & Profilaxis",
    type: "Evaluación CROID UAZ",
    date: "21 Abr, 2026",
    bgClass: "bg-slate-950 border border-cyan-500/30",
    previewType: "dashboard",
    deviceIcon: "🖥️",
    shared: false,
  },
];

const CLINICAL_TEMPLATES_EXAMPLES = [
  {
    id: "plantilla-uaz-004",
    title: "Expediente Clínico Oficial UAZ NOM-004",
    type: "Protocolo Estudiantil",
    date: "7 Jul, 2026",
    bgClass: "bg-slate-900 border border-purple-500/20",
    previewType: "dashboard",
    shared: true,
  },
  {
    id: "consentimiento-cirugia",
    title: "Consentimiento Informado Cirugía Bucal",
    type: "Formulario Legal NOM-004",
    date: "13 Ago, 2026",
    bgClass: "bg-amber-950/80 border border-amber-500/20",
    previewType: "sparkles",
    shared: true,
  },
  {
    id: "receta-interrogatorio",
    title: "Guía de Diagnóstico & Farmacología IA",
    type: "Motor Dex Local",
    date: "1 Jul, 2026",
    bgClass: "bg-indigo-950 border border-indigo-500/20",
    previewType: "code",
    shared: true,
  },
  {
    id: "nota-evolucion-rx",
    title: "Nota de Evolución & Radiografía Panorámica",
    type: "Revisión Docente UAZ",
    date: "9 Jul, 2026",
    bgClass: "bg-slate-900 border border-blue-500/20",
    previewType: "dashboard",
    shared: true,
  },
];

export const AcademyOrbInterface = () => {
  const navigate = useNavigate();

  // ─── Estado del Menú Circular Orbital Líquido 3D para DEX ───
  const [isOrbHovered, setIsOrbHovered] = useState(false);
  const [activeOrbitalTooltip, setActiveOrbitalTooltip] = useState<string | null>(null);
  const orbHoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // ─── Estado del Menú Hamburguesa Lateral Estilo Stitch ───
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [drawerTab, setDrawerTab] = useState<"mis-historias" | "compartidas">("mis-historias");
  const [searchQuery, setSearchQuery] = useState("");

  // ─── Estados de la Toolbar Superior Derecha (Estudiantes Academy) ───
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  // Obtener usuario o mock de estudiante UAZ
  const currentUser = useAuthStore((state) => state.user) || {
    name: "Dr. Alex Ramos",
    email: "alex.ramos.uaz@gmail.com",
    role: "Estudiante Odontología UAZ",
    clinic: "Clínica CROID / UAZ",
    avatar: "https://lh3.googleusercontent.com/a/ACg8ocKz-avatar-default=s96-c",
  };

  // ─── Estado de Enfoque/Selección del Input ───
  const [isInputFocused, setIsInputFocused] = useState(false);

  // ─── Estados de la Consola Stitch ───
  const [promptText, setPromptText] = useState("");
  const [mode, setMode] = useState<"app" | "web">("web");
  const [model, setModel] = useState("3 Flash");
  const [showModelMenu, setShowModelMenu] = useState(false);

  // ─── Estado Modo Activo: Al hacer clic en una píldora orbital, Dex se minimiza ───
  const [activeCap, setActiveCap] = useState<typeof DEX_ORBITAL_CAPABILITIES[0] | null>(null);

  // ─── Título de la sección activa del panel de Historia Clínica (para el navbar) ───
  const [activeSectionTitle, setActiveSectionTitle] = useState('');
  const [activeSectionStep, setActiveSectionStep] = useState({ current: 1, total: 21 });

  const handleOrbMouseEnter = () => {
    if (orbHoverTimeoutRef.current) clearTimeout(orbHoverTimeoutRef.current);
    setIsOrbHovered(true);
  };

  const handleOrbMouseLeave = () => {
    orbHoverTimeoutRef.current = setTimeout(() => {
      setIsOrbHovered(false);
      setActiveOrbitalTooltip(null);
    }, 300);
  };

  const handleLogout = () => {
    sessionStorage.removeItem("academy_user");
    useAuthStore.getState().logout();
    toast.info("Sesión cerrada correctamente.");
    navigate("/academy");
  };

  const handleSendPrompt = () => {
    if (!promptText.trim()) return;
    toast.success("Consulta enviada a Dex AI", {
      description: promptText,
    });
    setPromptText("");
  };

  // ─── Activar modo capacidad orbital: anima salida del orbe central + consola ───
  const handleCapClick = (cap: typeof DEX_ORBITAL_CAPABILITIES[0]) => {
    setIsOrbHovered(false);
    setActiveOrbitalTooltip(null);
    setActiveCap(cap);
  };

  // ─── Restaurar modo normal al presionar el mini-orbe ───
  const handleMiniOrbClick = () => {
    setActiveCap(null);
    setPromptText("");
  };

  return (
    <div className="min-h-screen w-screen text-slate-900 flex flex-col justify-between relative overflow-hidden select-none font-sans bg-slate-50">
      {/* ── MALLA DE FONDO TÉCNICA BASE ── */}
      <div
        className="absolute inset-0 pointer-events-none z-0"
        style={{
          backgroundImage: "radial-gradient(circle, rgba(15, 23, 42, 0.07) 1.5px, transparent 1.5px)",
          backgroundSize: "24px 24px",
        }}
      />

      {/* ── HEADER SUPERIOR: Izquierda + Título Central + Suite Botones Derecha ── */}
      <header className="w-full max-w-[1536px] mx-auto px-3 sm:px-5 py-6 flex items-center justify-between z-30 relative">

        {/* Título de sección activa — centrado absoluto perfecto en el navbar */}
        <AnimatePresence mode="wait">
          {activeCap && activeSectionTitle && (
            <motion.div
              key={activeSectionTitle}
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
              className="absolute inset-0 flex items-center justify-center pointer-events-none z-40"
            >
              <h2
                className="text-sm sm:text-base md:text-lg font-extrabold text-slate-700 dark:text-slate-200 tracking-wider uppercase leading-tight text-center drop-shadow-xs"
                style={{ fontFamily: "'Bruno Ace SC', sans-serif" }}
              >
                {activeSectionTitle}
              </h2>
            </motion.div>
          )}
        </AnimatePresence>
        {/* Lado Izquierdo: Botón Hamburguesa / Flecha Atrás + Logo DENTAXY Technologies */}
        <div className="flex items-center gap-3 pointer-events-auto">
          {/* Botón de Menú Hamburguesa que se transforma en Flecha Atrás al abrir */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 sm:p-2.5 rounded-xl text-slate-900 hover:text-black hover:bg-slate-100 border border-slate-200/80 bg-white/80 backdrop-blur-md shadow-sm transition-all cursor-pointer flex items-center justify-center group"
            title={mobileMenuOpen ? "Volver / Cerrar Menú" : "Abrir Historial Clínico"}
          >
            {mobileMenuOpen ? (
              <ArrowLeft className="w-5 h-5 group-hover:-translate-x-0.5 transition-transform text-slate-900 stroke-[2.25]" />
            ) : (
              <Menu className="w-5 h-5 group-hover:scale-105 transition-transform text-slate-800" />
            )}
          </button>

          {/* Logo DENTAXY Technologies */}
          <Link to="/" className="flex items-center gap-2.5 group cursor-pointer">
            <motion.div
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 400 }}
            >
              <img
                src="/lovable-uploads/3236de6d-a3e4-4b81-9c83-b32690d4212d.png"
                alt="Dentaxy"
                className="h-9 w-9 sm:h-9.5 sm:w-9.5 object-contain"
              />
            </motion.div>
            <div className="flex flex-col leading-none">
              <span className="text-sm sm:text-base font-black tracking-tight text-gray-900 group-hover:text-emerald-600 transition-colors">
                DENTAXY
              </span>
              <span className="text-[9.5px] sm:text-[10px] font-medium text-gray-400 tracking-[0.2em] uppercase">
                Technologies
              </span>
            </div>
          </Link>

          {/* Insignia / Badge de Versión Premium Negro Puro (#000000) Dentaxy Academy */}
          <div
            onClick={() => toast.info(`Dentaxy Academy v${DENTAXY_ACADEMY_VERSION}`, { description: "Sistema de Salud Digital actualizado y sincronizado en tiempo real" })}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#000000] text-white border border-zinc-800 shadow-md hover:border-purple-500/80 transition-all cursor-pointer group/ver ml-2 shrink-0"
            title="Versión de Dentaxy Academy"
          >
            <span className="px-1.5 py-0.5 rounded-md bg-purple-600 text-white font-black text-[9.5px] uppercase tracking-wider leading-none shadow-xs">
              v2.5
            </span>
            <span className="text-xs font-bold text-white font-sans tracking-tight group-hover/ver:text-purple-300 transition-colors">
              Academy {DENTAXY_ACADEMY_VERSION}
            </span>
          </div>
        </div>

        {/* Lado Derecho: Suite de Botones de Acción para Estudiantes de Odontología (Equilibrada) */}
        <div className="flex items-center gap-1.5 sm:gap-2 pointer-events-auto relative">
          
          {/* 1. Botón: Expedientes NOM-004 */}
          <button
            onClick={() => toast.info("Accediendo a Historias Clínicas NOM-004 de Estudiante")}
            className="p-2 sm:p-2.5 rounded-xl text-slate-700 hover:text-purple-700 hover:bg-purple-50/80 border border-slate-200/80 bg-white/80 backdrop-blur-md shadow-sm transition-all cursor-pointer flex items-center justify-center group"
            title="Historias Clínicas NOM-004"
          >
            <FolderHeart className="w-[18px] h-[18px] sm:w-5 sm:h-5 group-hover:scale-110 transition-transform" />
          </button>

          {/* 2. Botón: Club Gremial Odontológico */}
          <Link
            to="/club"
            className="p-2 sm:p-2.5 rounded-xl text-slate-700 hover:text-amber-700 hover:bg-amber-50/80 border border-slate-200/80 bg-white/80 backdrop-blur-md shadow-sm transition-all cursor-pointer flex items-center justify-center group"
            title="Club & Foro Odontológico"
          >
            <MessageSquare className="w-[18px] h-[18px] sm:w-5 sm:h-5 group-hover:scale-110 transition-transform" />
          </Link>

          {/* 3. Botón: Cursos & Aprendizaje */}
          <Link
            to="/academy"
            className="p-2 sm:p-2.5 rounded-xl text-slate-700 hover:text-indigo-700 hover:bg-indigo-50/80 border border-slate-200/80 bg-white/80 backdrop-blur-md shadow-sm transition-all cursor-pointer flex items-center justify-center group"
            title="Cursos & Guías Dentales"
          >
            <BookOpen className="w-[18px] h-[18px] sm:w-5 sm:h-5 group-hover:scale-110 transition-transform" />
          </Link>

          {/* 4. Botón: Tienda de Insumos Dentales */}
          <Link
            to="/shop"
            className="p-2 sm:p-2.5 rounded-xl text-slate-700 hover:text-emerald-700 hover:bg-emerald-50/80 border border-slate-200/80 bg-white/80 backdrop-blur-md shadow-sm transition-all cursor-pointer flex items-center justify-center group"
            title="Dentaxy Shop - Insumos Dentales"
          >
            <ShoppingBag className="w-[18px] h-[18px] sm:w-5 sm:h-5 group-hover:scale-110 transition-transform" />
          </Link>

          {/* 5. Botón: Notificaciones con badge */}
          <div className="relative">
            <button
              onClick={() => {
                setNotificationsOpen(!notificationsOpen);
                setProfileMenuOpen(false);
              }}
              className="p-2 sm:p-2.5 rounded-xl text-slate-700 hover:text-blue-700 hover:bg-blue-50/80 border border-slate-200/80 bg-white/80 backdrop-blur-md shadow-sm transition-all cursor-pointer flex items-center justify-center relative group"
              title="Notificaciones"
            >
              <Bell className="w-[18px] h-[18px] sm:w-5 sm:h-5 group-hover:scale-110 transition-transform" />
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white font-bold text-[9px] rounded-full flex items-center justify-center shadow-sm">
                3
              </span>
            </button>

            {/* Dropdown Notificaciones */}
            <AnimatePresence>
              {notificationsOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 top-full mt-2 w-80 bg-white/95 backdrop-blur-xl border border-slate-200/90 rounded-2xl shadow-2xl p-4 z-[60000]"
                >
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
                    <span className="text-xs font-bold text-slate-800">Notificaciones Académicas</span>
                    <span className="text-[10px] font-semibold text-purple-600 bg-purple-50 px-2 py-0.5 rounded-full">3 Nuevas</span>
                  </div>
                  <div className="space-y-2 max-h-60 overflow-y-auto">
                    {[
                      { title: "Nueva norma NOM-004", desc: "Plantillas de historia clínica actualizadas UAZ", time: "Hace 10 min", icon: FileText, color: "text-purple-600 bg-purple-50" },
                      { title: "Descuento en Insumos", desc: "Kit de dique de goma con 25% desc en Shop", time: "Hace 1 hora", icon: ShoppingBag, color: "text-emerald-600 bg-emerald-50" },
                      { title: "Dictado por Voz listo", desc: "Dictado clínico determinista sin costo de API", time: "Hace 3 horas", icon: Mic, color: "text-blue-600 bg-blue-50" },
                    ].map((n, i) => {
                      const NIcon = n.icon;
                      return (
                        <div key={i} className="flex gap-2.5 p-2 rounded-xl hover:bg-slate-50 transition-colors">
                          <div className={`p-2 rounded-lg shrink-0 ${n.color}`}>
                            <NIcon className="w-3.5 h-3.5" />
                          </div>
                          <div>
                            <p className="text-xs font-bold text-slate-800">{n.title}</p>
                            <p className="text-[11px] text-slate-500 font-normal leading-tight mt-0.5">{n.desc}</p>
                            <span className="text-[9px] text-slate-400 font-medium mt-1 block">{n.time}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* 6. Botón: Instagram */}
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 sm:p-2.5 rounded-xl text-slate-700 hover:text-pink-600 hover:bg-pink-50/80 border border-slate-200/80 bg-white/80 backdrop-blur-md shadow-sm transition-all cursor-pointer flex items-center justify-center group"
            title="Instagram Dentaxy"
          >
            <Instagram className="w-[18px] h-[18px] sm:w-5 sm:h-5 group-hover:scale-110 transition-transform" />
          </a>

          {/* 7. Botón: Ayuda & Soporte */}
          <button
            onClick={() => toast.info("Centro de Ayuda Clínico Dentaxy - Soporte 24/7 activo")}
            className="p-2 sm:p-2.5 rounded-xl text-slate-700 hover:text-cyan-700 hover:bg-cyan-50/80 border border-slate-200/80 bg-white/80 backdrop-blur-md shadow-sm transition-all cursor-pointer flex items-center justify-center group"
            title="Ayuda & Soporte Técnico"
          >
            <HelpCircle className="w-[18px] h-[18px] sm:w-5 sm:h-5 group-hover:scale-110 transition-transform" />
          </button>

          {/* Separador */}
          <div className="h-6 w-px bg-slate-200 mx-1 hidden sm:block" />

          {/* 8. Botón: Perfil de Usuario Google/Gmail (Avatar + Menú Desplegable Completo) */}
          <div className="relative">
            <button
              onClick={() => {
                setProfileMenuOpen(!profileMenuOpen);
                setNotificationsOpen(false);
              }}
              className="flex items-center gap-2 p-1 pl-1.5 pr-2.5 rounded-full border border-slate-200/90 bg-white/90 backdrop-blur-md shadow-sm hover:border-purple-300 transition-all cursor-pointer group"
              title="Perfil de Usuario Gmail"
            >
              <div className="relative">
                <div className="w-8 h-8 sm:w-8.5 sm:h-8.5 rounded-full bg-gradient-to-tr from-purple-600 via-indigo-600 to-emerald-500 p-0.5 shadow-sm">
                  <div className="w-full h-full rounded-full bg-slate-900 flex items-center justify-center text-white text-xs font-bold uppercase overflow-hidden">
                    {currentUser.name.charAt(0)}
                  </div>
                </div>
                <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-white" />
              </div>
              <span className="text-xs font-bold text-slate-800 hidden md:block max-w-[100px] truncate">
                {currentUser.name.split(" ")[0]}
              </span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-700 transition-colors" />
            </button>

            {/* Dropdown Completo de Cuenta Gmail / Perfil Estudiante */}
            <AnimatePresence>
              {profileMenuOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 top-full mt-2 w-80 bg-white/95 backdrop-blur-xl border border-slate-200/90 rounded-2xl shadow-2xl p-4 z-[60000]"
                >
                  {/* Encabezado del Perfil Gmail */}
                  <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-purple-600 to-indigo-600 p-0.5 shadow-sm shrink-0">
                      <div className="w-full h-full rounded-full bg-slate-900 flex items-center justify-center text-white text-sm font-bold uppercase">
                        {currentUser.name.charAt(0)}
                      </div>
                    </div>
                    <div className="overflow-hidden">
                      <p className="text-sm font-bold text-slate-900 truncate">{currentUser.name}</p>
                      <p className="text-xs text-slate-500 font-normal truncate">{currentUser.email}</p>
                      <span className="inline-block text-[9.5px] font-bold text-purple-700 bg-purple-50 border border-purple-100 px-2 py-0.5 rounded-full mt-1">
                        Estudiante Odontología UAZ
                      </span>
                    </div>
                  </div>

                  {/* Acciones de Cuenta */}
                  <div className="py-2 space-y-1">
                    <button
                      onClick={() => {
                        setProfileMenuOpen(false);
                        toast.success("Cambiando cuenta de Google/Gmail...");
                      }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
                    >
                      <RefreshCw className="w-4 h-4 text-purple-600" />
                      <span>Cambiar Cuenta de Gmail</span>
                    </button>

                    <button
                      onClick={() => {
                        setProfileMenuOpen(false);
                        toast.info("Configuración de Perfil Estudiante");
                      }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
                    >
                      <Settings className="w-4 h-4 text-slate-500" />
                      <span>Configuración de Cuenta</span>
                    </button>

                    <button
                      onClick={() => {
                        setProfileMenuOpen(false);
                        toast.info("Privacidad de Datos NOM-004: Todo se procesa de forma local y 100% privada.");
                      }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
                    >
                      <ShieldCheck className="w-4 h-4 text-emerald-600" />
                      <span>Soberanía de Datos NOM-004</span>
                    </button>
                  </div>

                  {/* Footer - Botón Cerrar Sesión */}
                  <div className="pt-3 border-t border-slate-100 mt-1">
                    <button
                      onClick={() => {
                        setProfileMenuOpen(false);
                        handleLogout();
                      }}
                      className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-xs font-bold text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Cerrar Sesión</span>
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

        </div>
      </header>

      {/* ── DRAWER LATERAL FLOTANTE SOBRE EL LOGO: HISTORIAL CLÍNICO Y TRABAJOS DENTAXY ACADEMY ── */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <div className="fixed inset-x-0 top-16 sm:top-20 bottom-0 z-[90000] flex pointer-events-none">
            {/* Backdrop clickeable 100% transparente para cerrar sin desenfoque ni velos */}
            <div
              className="absolute inset-0 bg-transparent pointer-events-auto"
              onClick={() => setMobileMenuOpen(false)}
            />

            {/* Panel Desplegable Lateral Flotante Redondeado (Sólido sin desenfoques de fondo) */}
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 220 }}
              className="relative w-84 sm:w-96 bg-[#f1f3f5] h-[calc(100vh-5.5rem)] max-h-[calc(100vh-5.5rem)] shadow-2xl border border-slate-300/80 rounded-[28px] p-5 sm:p-6 flex flex-col justify-between overflow-y-auto z-20 font-sans my-3 ml-3 sm:ml-5 pointer-events-auto"
            >
              <div>
                {/* Control Segmentado de Píldoras Más Grandes y Redondeadas (Pill Tabs - Inicio Directo) */}
                <div className="bg-slate-200/90 p-1.5 rounded-full flex items-center justify-between text-xs sm:text-sm font-bold text-slate-600 mb-4 border border-slate-300/70 shadow-inner">
                  <button
                    onClick={() => setDrawerTab("mis-historias")}
                    className={`flex-1 py-2.5 px-4 rounded-full flex items-center justify-center gap-2 transition-all cursor-pointer font-bold text-xs sm:text-sm ${
                      drawerTab === "mis-historias"
                        ? "bg-white text-slate-900 shadow-md font-black"
                        : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    <LayoutGrid className="w-4 h-4" />
                    <span>Mis historias</span>
                  </button>

                  <button
                    onClick={() => setDrawerTab("compartidas")}
                    className={`flex-1 py-2.5 px-4 rounded-full flex items-center justify-center gap-2 transition-all cursor-pointer font-bold text-xs sm:text-sm ${
                      drawerTab === "compartidas"
                        ? "bg-white text-slate-900 shadow-md font-black"
                        : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    <Users className="w-4 h-4" />
                    <span>Compartidos</span>
                  </button>
                </div>

                {/* Buscador de Historias Clínicas (Input estilo Pill) */}
                <div className="relative mb-5">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Buscar historias clínicas o expedientes..."
                    className="w-full bg-slate-200/70 border border-slate-300/70 rounded-full pl-9 pr-4 py-2.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-purple-400/50 transition-all shadow-2xs"
                  />
                </div>

                {/* Lista de Trabajos Clínicos Realizados (Dentaxy Real Data) */}
                <div className="space-y-4">
                  <div>
                    <h4 className="text-xs font-bold text-slate-600 uppercase tracking-wider mb-2.5 px-1">
                      {drawerTab === "mis-historias" ? "Trabajos Clínicos Realizados" : "Expedientes Compartidos (UAZ/CROID)"}
                    </h4>

                    <div className="space-y-2">
                      {CLINICAL_WORK_HISTORY.filter(h => 
                        drawerTab === "mis-historias" ? !h.shared : h.shared
                      ).map((item) => (
                        <div
                          key={item.id}
                          onClick={() => {
                            setMobileMenuOpen(false);
                            toast.success(`Abriendo expediente: ${item.title}`);
                          }}
                          className="flex items-center gap-3 p-2.5 rounded-2xl bg-white/80 hover:bg-white border border-slate-200/80 hover:border-slate-300 shadow-2xs transition-all cursor-pointer group"
                        >
                          {/* Miniatura Cuadrada de Vista Previa */}
                          <div className={`w-10 h-10 rounded-xl ${item.bgClass} flex items-center justify-center shrink-0 shadow-xs group-hover:scale-105 transition-transform`}>
                            {item.previewType === "code" ? (
                              <FileText className="w-5 h-5 text-emerald-400" />
                            ) : item.previewType === "dashboard" ? (
                              <ClipboardList className="w-5 h-5 text-indigo-400" />
                            ) : (
                              <Sparkles className="w-5 h-5 text-amber-400" />
                            )}
                          </div>

                          {/* Info del Trabajo / Historia */}
                          <div className="overflow-hidden flex-1">
                            <p className="text-xs font-bold text-slate-900 truncate leading-tight group-hover:text-purple-700 transition-colors">
                              {item.title}
                            </p>
                            <div className="flex items-center gap-2 mt-1">
                              <span className="text-[10px] text-slate-500 font-medium flex items-center gap-1">
                                {item.deviceIcon} {item.date}
                              </span>
                              <span className="text-[9.5px] text-purple-600 font-semibold bg-purple-50 px-1.5 py-0.5 rounded-md">
                                {item.type}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Sección Ejemplos & Plantillas Oficiales NOM-004 */}
                  <div className="pt-2">
                    <h4 className="text-xs font-bold text-slate-600 uppercase tracking-wider mb-2.5 px-1">
                      Plantillas & Guías Oficiales NOM-004
                    </h4>

                    <div className="space-y-2">
                      {CLINICAL_TEMPLATES_EXAMPLES.map((item) => (
                        <div
                          key={item.id}
                          onClick={() => {
                            setMobileMenuOpen(false);
                            toast.info(`Cargando Plantilla: ${item.title}`);
                          }}
                          className="flex items-center gap-3 p-2.5 rounded-2xl bg-white/80 hover:bg-white border border-slate-200/80 hover:border-slate-300 shadow-2xs transition-all cursor-pointer group"
                        >
                          {/* Miniatura Cuadrada de Ejemplo */}
                          <div className={`w-10 h-10 rounded-xl ${item.bgClass} flex items-center justify-center shrink-0 shadow-xs group-hover:scale-105 transition-transform`}>
                            <GraduationCap className="w-5 h-5 text-purple-400" />
                          </div>

                          {/* Info del Ejemplo */}
                          <div className="overflow-hidden flex-1">
                            <p className="text-xs font-bold text-slate-900 truncate leading-tight group-hover:text-purple-700 transition-colors">
                              {item.title}
                            </p>
                            <div className="flex items-center gap-2 mt-1">
                              <span className="text-[10px] text-slate-500 font-medium flex items-center gap-1">
                                🖥️ {item.date}
                              </span>
                              <span className="text-[9.5px] text-slate-500 font-medium flex items-center gap-0.5">
                                <Users className="w-2.5 h-2.5" /> UAZ / CROID
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Botón Inferior: Crear Nueva Historia Clínica */}
              <div className="pt-4 border-t border-slate-200/80 mt-4">
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    toast.success("Nueva Historia Clínica NOM-004 iniciada");
                  }}
                  className="w-full py-3 px-4 rounded-full bg-slate-900 hover:bg-purple-900 text-white text-xs font-bold shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>+ Nueva Historia NOM-004</span>
                </button>
              </div>
            </motion.aside>
          </div>
        )}
      </AnimatePresence>

      {/* ── Overlay de Enfoque al hacer Hover sobre el Orbe ── */}
      <AnimatePresence>
        {isOrbHovered && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35, ease: "easeInOut" }}
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-md z-20 pointer-events-none"
          />
        )}
      </AnimatePresence>

      {/* ── BURBUJA CENTRAL DE DEX CON MENÚ ORBITAL LÍQUIDO 3D — DESPLAZABLE A LA DERECHA ── */}
      <main className="flex-1 flex flex-col items-center justify-center relative w-full z-[70000] my-auto pb-12">
        <motion.div
          animate={{
            x: mobileMenuOpen ? 160 : 0,
            y: activeCap ? 180 : 0,
            opacity: activeCap ? 0 : 1,
          }}
          transition={{ type: "spring", damping: 28, stiffness: 200 }}
          className="w-full flex flex-col items-center justify-center"
          style={{ pointerEvents: activeCap ? "none" : "auto" }}
        >
        <div
          className="relative z-[80000] flex items-center justify-center pointer-events-auto cursor-pointer select-none mb-6 translate-y-4 sm:translate-y-6"
          onMouseEnter={handleOrbMouseEnter}
          onMouseLeave={handleOrbMouseLeave}
        >
          {/* Esfera 3D de DEX (Transparente sin fondos ni cajas) */}
          <motion.div
            initial={{ scale: 0.85, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="w-[240px] sm:w-[320px] h-[240px] sm:h-[320px] rounded-full overflow-hidden shrink-0 flex items-center justify-center border-none shadow-none bg-transparent"
          >
            <video
              src="/logos/Dentaxy AI.mp4"
              autoPlay
              muted
              playsInline
              loop
              className="w-full h-full object-cover select-none pointer-events-none mix-blend-multiply rounded-full scale-[1.25]"
            />
          </motion.div>

          {/* ── MENÚ ORBITAL LÍQUIDO 3D — CAPACIDADES DE DEX IA ── */}
          <AnimatePresence>
            {isOrbHovered && (
              <div
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[620px] h-[620px] rounded-full pointer-events-auto z-[80000]"
                onMouseEnter={handleOrbMouseEnter}
                onMouseLeave={handleOrbMouseLeave}
              >
                {DEX_ORBITAL_CAPABILITIES.map((cap, idx) => {
                  const radius = 220;
                  const offsetX = -34;
                  const offsetY = -31;
                  const rad = (cap.angle * Math.PI) / 180;
                  const x = Math.round(Math.cos(rad) * radius) + offsetX;
                  const y = Math.round(Math.sin(rad) * radius) + offsetY;
                  const IconComp = cap.icon;

                  return (
                    <motion.div
                      key={cap.id}
                      initial={{ scale: 0, opacity: 0, x: 0, y: 0 }}
                      animate={{ scale: 1, opacity: 1, x, y }}
                      exit={{ scale: 0, opacity: 0, x: 0, y: 0 }}
                      transition={{
                        type: "spring",
                        stiffness: 260,
                        damping: 20,
                        delay: idx * 0.035,
                      }}
                      onMouseEnter={() => {
                        handleOrbMouseEnter();
                        setActiveOrbitalTooltip(cap.id);
                      }}
                      onMouseLeave={() => setActiveOrbitalTooltip(null)}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCapClick(cap);
                      }}
                      className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-auto cursor-pointer group"
                    >
                      {/* Burbuja 3D Líquida Cristalina Neón Vibrante con Crecimiento Fluido en Hover */}
                      <motion.div
                        whileHover={{ scale: 1.38 }}
                        transition={{ type: "spring", stiffness: 350, damping: 15 }}
                        className={`relative w-16 h-16 rounded-full bg-gradient-to-br ${cap.bgGradient} backdrop-blur-2xl border-2 border-white/90 flex items-center justify-center group`}
                        style={{
                          boxShadow: `0 0 22px ${cap.glowShadow}, 0 0 45px ${cap.glowShadow}, inset 0 2px 10px rgba(255,255,255,0.9)`,
                        }}
                      >
                        {/* Icono Blanco */}
                        <IconComp size={28} className="text-white drop-shadow-[0_2px_12px_rgba(0,0,0,0.95)] group-hover:scale-110 transition-transform duration-200" />
                      </motion.div>

                      {/* Tooltip / Badge de la capacidad */}
                      <AnimatePresence>
                        {activeOrbitalTooltip === cap.id && (
                          <motion.div
                            initial={{ opacity: 0, y: 8, scale: 0.88 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 5, scale: 0.88 }}
                            transition={{ duration: 0.15 }}
                            className="absolute -top-12 left-1/2 -translate-x-1/2 whitespace-nowrap bg-slate-900/95 text-white px-3.5 py-1.5 rounded-2xl text-xs font-semibold shadow-2xl border border-white/20 backdrop-blur-md flex flex-col items-center pointer-events-none z-[35000]"
                          >
                            <span className="font-bold text-emerald-400">{cap.label}</span>
                            <span className="text-[10px] text-slate-300 font-normal">{cap.desc}</span>
                            <div className="w-2 h-2 bg-slate-900/95 rotate-45 -mb-1 mt-0.5 border-r border-b border-white/20" />
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </AnimatePresence>
        </div>

        {/* ── CONSOLA DE ENTRADA DE TEXTO TIPO STITCH (POSICIÓN BAJADA DEBAJO DE DEX) ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={activeCap ? { opacity: 0, y: 120 } : { opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
          className="w-full max-w-3xl px-4 flex flex-col gap-3 relative z-30 mt-14 sm:mt-20 md:mt-24 translate-y-6 sm:translate-y-10"
          style={{ pointerEvents: activeCap ? "none" : "auto" }}
        >


          {/* Tarjeta Consola Principal Estilo Stitch - Negro Puro 100% (#000000) con Iluminación Estática */}
          <div
            className="w-full rounded-[28px] p-4 sm:p-5 border border-zinc-800/80 flex flex-col justify-between min-h-[145px] gap-4 transition-all duration-300 relative cursor-text"
            style={{
              backgroundColor: "#000000",
              boxShadow: "0 25px 60px rgba(0, 0, 0, 0.95), 0 10px 30px rgba(0, 0, 0, 0.85), inset 0 1px 1.5px rgba(255, 255, 255, 0.15)",
            }}
          >
            {/* Input de Texto (Cursor / Slash Alineado y Diseñado con Caret Neón Púrpura) */}
            <input
              type="text"
              value={promptText}
              onChange={(e) => setPromptText(e.target.value)}
              onFocus={() => setIsInputFocused(true)}
              onBlur={() => setIsInputFocused(false)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSendPrompt();
              }}
              placeholder="Pregunta a Dex o escribe una acción clínica..."
              className="w-full h-9 leading-[36px] !bg-transparent !border-none !outline-none !shadow-none !ring-0 focus:!outline-none focus:!ring-0 focus:!border-none focus:!bg-transparent focus:!shadow-none text-white text-base font-normal placeholder-zinc-400/80 px-0 py-0 cursor-text"
              style={{
                background: "transparent",
                border: "none",
                outline: "none",
                boxShadow: "none",
                caretColor: "#c084fc",
                height: "36px",
                lineHeight: "36px",
              }}
            />

            {/* Toolbar Inferior */}
            <div className="flex items-center justify-between pt-1">
              {/* Controles Izquierda */}
              <div className="flex items-center gap-2.5">
                <button
                  onClick={() => toast.info("Adjuntar archivo o imagen")}
                  className="w-8 h-8 rounded-full flex items-center justify-center text-zinc-400 hover:text-white hover:bg-zinc-800/60 transition-colors"
                  title="Agregar"
                >
                  <Plus className="w-5 h-5" />
                </button>

                {/* Selector de Modo App / Web */}
                <div className="flex items-center bg-zinc-900 border border-zinc-800/80 p-1 rounded-full text-xs font-medium text-zinc-400">
                  <button
                    onClick={() => setMode("app")}
                    className={`flex items-center gap-1 px-3 py-1 rounded-full transition-all ${
                      mode === "app" ? "bg-zinc-800 text-white shadow-sm font-semibold" : "hover:text-white"
                    }`}
                  >
                    <Smartphone className="w-3.5 h-3.5" />
                    <span>App</span>
                  </button>
                  <button
                    onClick={() => setMode("web")}
                    className={`flex items-center gap-1 px-3 py-1 rounded-full transition-all ${
                      mode === "web" ? "bg-zinc-800 text-white shadow-sm font-semibold" : "hover:text-white"
                    }`}
                  >
                    <Monitor className="w-3.5 h-3.5" />
                    <span>Web</span>
                  </button>
                </div>
              </div>

              {/* Controles Derecha */}
              <div className="flex items-center gap-2.5 relative">
                <button
                  onClick={() => toast.info("Cambiar paleta o tema")}
                  className="p-1.5 text-zinc-400 hover:text-white transition-colors"
                  title="Personalización de tema"
                >
                  <Palette className="w-4 h-4" />
                </button>

                {/* Selector de Modelo AI (Estilo Oscuro Glossy) */}
                <div className="relative">
                  <button
                    onClick={() => setShowModelMenu(!showModelMenu)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 text-xs font-bold text-zinc-200 transition-all cursor-pointer"
                  >
                    <Sparkles className="w-3.5 h-3.5 fill-purple-400 text-purple-400" />
                    <span>{model}</span>
                    <ChevronDown className="w-3 h-3 text-zinc-400" />
                  </button>

                  {showModelMenu && (
                    <div className="absolute bottom-full mb-2 right-0 bg-zinc-950 border border-zinc-800 rounded-2xl p-1.5 shadow-2xl flex flex-col gap-1 z-50 w-32">
                      {["3 Flash", "3.5 Pro", "Local IA"].map((m) => (
                        <button
                          key={m}
                          onClick={() => {
                            setModel(m);
                            setShowModelMenu(false);
                          }}
                          className={`text-left text-xs font-semibold px-3 py-1.5 rounded-xl transition-colors ${
                            model === m ? "bg-zinc-800 text-purple-400" : "text-zinc-400 hover:bg-zinc-900 hover:text-white"
                          }`}
                        >
                          {m}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Botón Micrófono Dictado por Voz */}
                <button
                  onClick={() => toast.info("Dictado por voz activado")}
                  className="p-1.5 text-zinc-400 hover:text-white transition-colors"
                  title="Dictar por voz"
                >
                  <Mic className="w-4.5 h-4.5" />
                </button>

                {/* Botón Enviar (Círculo Blanco Ocupado) */}
                <button
                  onClick={handleSendPrompt}
                  disabled={!promptText.trim()}
                  className="w-9 h-9 rounded-full bg-white hover:bg-slate-200 text-black flex items-center justify-center transition-all active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed shadow-md cursor-pointer ml-1"
                  title="Enviar"
                >
                  <ArrowUp className="w-4.5 h-4.5 stroke-[2.5]" />
                </button>
              </div>
            </div>
          </div>
        </motion.div>
        </motion.div>
      </main>
      {/* ── MINI-BURBUJA FLOTANTE DE DEX (Esquina Inferior Derecha) al activar una capacidad ── */}
      <AnimatePresence>
        {activeCap && (
          <motion.div
            key="mini-orb"
            initial={{ scale: 0, opacity: 0, x: 80, y: 80 }}
            animate={{ scale: 1, opacity: 1, x: 0, y: 0 }}
            exit={{ scale: 0, opacity: 0, x: 80, y: 80 }}
            transition={{ type: "spring", damping: 22, stiffness: 260 }}
            className="fixed bottom-8 right-8 z-[99999] flex flex-col items-center gap-2"
          >
            {/* Etiqueta de capacidad activa */}
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-slate-900/95 text-white text-[10px] font-bold px-3 py-1 rounded-full border border-white/10 shadow-xl whitespace-nowrap"
              style={{ boxShadow: `0 0 16px ${activeCap.glowShadow}` }}
            >
              {activeCap.label}
            </motion.div>

            {/* Mini-orbe de Dex clickeable */}
            <motion.button
              onClick={handleMiniOrbClick}
              whileHover={{ scale: 1.12 }}
              whileTap={{ scale: 0.93 }}
              title="Volver a Dex"
              className="w-[72px] h-[72px] rounded-full overflow-hidden border-2 border-white/20 shadow-2xl cursor-pointer"
              style={{
                boxShadow: `0 0 28px ${activeCap.glowShadow}, 0 0 60px ${activeCap.glowShadow}`,
              }}
            >
              <video
                src="/logos/Dentaxy AI.mp4"
                autoPlay
                muted
                playsInline
                loop
                className="w-full h-full object-cover mix-blend-multiply scale-[1.3]"
              />
            </motion.button>

            {/* Indicador de pulsar para volver */}
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-[9px] font-semibold text-slate-500 tracking-wide"
            >
              Toca para volver
            </motion.span>
          </motion.div>
        )}
      </AnimatePresence>
      {/* ── PANEL EMBEBIDO DE HISTORIA CLÍNICA (aparece al activar la cápsula orbital) ── */}
      <AnimatePresence>
        {activeCap && (
          <motion.div
            key="embedded-panel"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 40 }}
            transition={{ type: "spring", damping: 28, stiffness: 220, delay: 0.15 }}
            className="fixed inset-0 z-[75000] flex flex-col"
            style={{ top: "72px" }}
          >
            <AnalysisModeProvider>
              <DentaxyFormPanel
                transparentBg
                onSectionTitleChange={(title, step, total) => {
                  setActiveSectionTitle(title);
                  setActiveSectionStep({ current: step, total });
                }}
              />
            </AnalysisModeProvider>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AcademyOrbInterface;
