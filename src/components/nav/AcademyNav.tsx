import React, { useState, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useGoogleLogin } from "@react-oauth/google";
import { useAuthStore, DoctorProfile } from "@/store/useAuthStore";
import { toast } from "sonner";
import { AcademyFutureButton } from "@/components/academy/AcademyFutureButton";
import {
  Sprout,
  ShoppingBag,
  FlaskConical,
  GraduationCap,
  Users,
  Newspaper,
  Award,
  Globe,
  Banknote,
  Menu,
  X,
  ChevronDown,
  Sparkles,
  ArrowRight,
} from "lucide-react";

// ─── Tipos ───────────────────────────────────────────────────────────────────
interface NavSubItem {
  title: string;
  badge: string;
  badgeColor: string;
  description: string;
  icon: React.ReactNode;
  iconBg: string;
  href: string;
  isNew?: boolean;
}

interface NavGroup {
  label: string;
  items: NavSubItem[];
}

// ─── Datos del menú (1:1 idéntico a DentaxyNav) ──────────────────────────────
const navGroups: NavGroup[] = [
  {
    label: "Operación Clínica",
    items: [
      {
        title: "Seed",
        badge: "Software Inicial",
        badgeColor: "bg-blue-100 text-blue-700",
        description:
          "Tu generador de historias clínicas con el motor de dentaxy.com, expandible si deseas integrar más funciones.",
        icon: <Sprout className="w-5 h-5" />,
        iconBg: "bg-blue-100 text-blue-600",
        href: "/seed",
      },
      {
        title: "Academy",
        badge: "Lanzamiento",
        badgeColor: "bg-purple-600 text-white font-bold shadow-sm",
        description:
          "Tu clínica universitaria sin burocracia. Redacta tu NOM-004 en segundos. Sin guardar datos, 100% privado.",
        icon: <GraduationCap className="w-5 h-5" />,
        iconBg: "bg-purple-600 text-white shadow-sm",
        href: "/academy",
        isNew: true,
      },
      {
        title: "Shop",
        badge: "Tienda Online",
        badgeColor: "bg-emerald-100 text-emerald-700",
        description:
          "Marketplace de insumos dentales online. Suministros inteligentes con logística integrada y precios preferenciales.",
        icon: <ShoppingBag className="w-5 h-5" />,
        iconBg: "bg-emerald-100 text-emerald-600",
        href: "/shop",
      },
      {
        title: "Lab",
        badge: "Laboratorios",
        badgeColor: "bg-purple-100 text-purple-700",
        description:
          "El puente digital con laboratorios. Gestión de trabajos protésicos, envío de archivos 3D y comunicación directa.",
        icon: <FlaskConical className="w-5 h-5" />,
        iconBg: "bg-purple-100 text-purple-600",
        href: "/lab",
      },
    ],
  },
  {
    label: "Gremio y Noticias",
    items: [
      {
        title: "Club",
        badge: "Comunidad",
        badgeColor: "bg-orange-100 text-orange-700",
        description:
          "Red social y comunidad odontológica. Debate casos clínicos, haz networking y crece con el gremio en tiempo real.",
        icon: <Users className="w-5 h-5" />,
        iconBg: "bg-orange-100 text-orange-600",
        href: "/club",
      },
      {
        title: "News",
        badge: "Noticias",
        badgeColor: "bg-sky-100 text-sky-700",
        description:
          "El pulso de la odontología. Noticias, tendencias globales y actualizaciones científicas filtradas para el profesional moderno.",
        icon: <Newspaper className="w-5 h-5" />,
        iconBg: "bg-sky-100 text-sky-600",
        href: "/news",
      },
      {
        title: "Aura",
        badge: "Prestigio",
        badgeColor: "bg-amber-100 text-amber-700",
        description:
          "Tu portafolio de prestigio. El altar digital para presumir tus títulos, certificaciones y casos de éxito ante el mundo.",
        icon: <Award className="w-5 h-5" />,
        iconBg: "bg-amber-100 text-amber-600",
        href: "/aura",
      },
    ],
  },
  {
    label: "Expansión y Riqueza",
    items: [
      {
        title: "Space",
        badge: "Web Builder",
        badgeColor: "bg-pink-100 text-pink-700",
        description:
          "Tu consultorio en la nube. Generador de páginas web profesionales para clínicas, totalmente integradas con tu agenda Seed.",
        icon: <Globe className="w-5 h-5" />,
        iconBg: "bg-pink-100 text-pink-600",
        href: "/space",
      },
      {
        title: "MyLana",
        badge: "Finanzas",
        badgeColor: "bg-lime-100 text-lime-700",
        description:
          "Tu control financiero con flow. Gestiona ingresos, egresos y visualiza el crecimiento de tu patrimonio clínico.",
        icon: <Banknote className="w-5 h-5" />,
        iconBg: "bg-lime-100 text-lime-600",
        href: "/mylana",
      },
    ],
  },
];

// ─── Sub-componente: Item del mega-menú ───────────────────────────────────────
const MegaMenuItem: React.FC<{ item: NavSubItem; onClose: () => void }> = ({ item, onClose }) => (
  <Link
    to={item.href}
    onClick={onClose}
    className={`group flex items-start gap-3.5 p-3.5 rounded-2xl transition-all duration-150 relative ${
      item.isNew
        ? "bg-purple-50/70 hover:bg-purple-100/70"
        : "hover:bg-gray-50"
    }`}
  >
    {item.isNew && (
      <span className="absolute -top-1 -right-1 flex h-3 w-3">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
        <span className="relative inline-flex rounded-full h-3 w-3 bg-purple-600 border-2 border-white shadow-sm"></span>
      </span>
    )}

    <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${item.iconBg} group-hover:scale-110 transition-transform duration-150`}>
      {item.icon}
    </div>

    <div className="flex-1 min-w-0">
      <div className="flex items-center gap-2 mb-0.5">
        <span className={`font-bold text-sm ${item.isNew ? "text-purple-950" : "text-gray-900"}`}>{item.title}</span>
        <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${item.badgeColor} flex items-center gap-1`}>
          {item.isNew && <Sparkles className="w-2.5 h-2.5 animate-spin" />}
          {item.badge}
        </span>
      </div>
      <p className="text-xs text-gray-500 leading-relaxed line-clamp-2">{item.description}</p>
    </div>

    <ArrowRight className={`w-4 h-4 transition-all duration-150 mt-auto mb-1 shrink-0 ${
      item.isNew ? "text-purple-600 group-hover:translate-x-1" : "text-gray-300 group-hover:text-gray-500 group-hover:translate-x-1"
    }`} />
  </Link>
);

// ─── Sub-componente: Mega-menú desplegable ────────────────────────────────────
const MegaMenu: React.FC<{ onClose: () => void }> = ({ onClose }) => (
  <motion.div
    initial={{ opacity: 0, y: 4, scale: 0.99 }}
    animate={{ opacity: 1, y: 0, scale: 1 }}
    exit={{ opacity: 0, y: 4, scale: 0.99 }}
    transition={{ duration: 0.1, ease: "easeOut" }}
    className="absolute top-full left-1/2 -translate-x-1/2 mt-3 w-[780px] max-w-[calc(100vw-2rem)] bg-white/95 backdrop-blur-xl border border-gray-100 rounded-3xl shadow-2xl shadow-black/10 overflow-hidden z-50"
  >
    <div className="px-6 pt-5 pb-3 border-b border-gray-50">
      <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-widest">
        Ecosistema Dentaxy Technologies
      </p>
    </div>

    <div className="grid grid-cols-3 divide-x divide-gray-50 p-3">
      {navGroups.map((group) => (
        <div key={group.label} className="px-2">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-4 py-2">
            {group.label}
          </p>
          <div className="space-y-0.5">
            {group.items.map((item) => (
              <MegaMenuItem key={item.title} item={item} onClose={onClose} />
            ))}
          </div>
        </div>
      ))}
    </div>

    <div className="px-6 py-4 bg-gray-50/80 border-t border-gray-100 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
        <span className="text-xs text-gray-500">Sistema activo · dentaxy.com</span>
      </div>
      <Link
        to="/hub"
        onClick={onClose}
        className="text-xs font-semibold text-emerald-600 hover:text-emerald-700 flex items-center gap-1 transition-colors"
      >
        Ver todos los demos <ArrowRight className="w-3 h-3" />
      </Link>
    </div>
  </motion.div>
);

// ─── Header exclusivo de Academy (Logo y Menú 1:1 idénticos a DentaxyNav) ───
export const AcademyNav = () => {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [loadingAuth, setLoadingAuth] = useState(false);
  const authLogin = useAuthStore((s) => s.login);

  const handleGoogleSuccess = useCallback(
    (profile: DoctorProfile) => {
      sessionStorage.setItem("academy_user", JSON.stringify(profile));
      authLogin(profile);
      toast.success(`Bienvenido, ${profile.name?.split(" ")[0] || "Doctor"} 🎓`, {
        description: "Autenticación correcta. Redirigiendo a /academy/app...",
      });
      setLoadingAuth(false);
      navigate("/academy/app");
    },
    [authLogin, navigate]
  );

  const googleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        const userInfoResponse = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
          headers: { Authorization: `Bearer ${tokenResponse.access_token}` },
        });
        const userInfo = await userInfoResponse.json();

        const profile: DoctorProfile = {
          name: userInfo.name || userInfo.given_name,
          email: userInfo.email,
          picture: userInfo.picture,
          googleAccessToken: tokenResponse.access_token,
        };

        handleGoogleSuccess(profile);
      } catch (err) {
        console.error("Error al obtener perfil de Google:", err);
        toast.error("Error al obtener perfil de Google.");
        setLoadingAuth(false);
      }
    },
    onError: (error) => {
      console.error("Google Sign-In Error:", error);
      toast.error("Error al conectar con Google", { description: "Revisa tu conexión o intenta nuevamente." });
      setLoadingAuth(false);
    },
    onNonOAuthError: (error) => {
      console.error("Google Non-OAuth Error:", error);
      toast.error("Autenticación cancelada", { description: "El panel de Google fue cerrado." });
      setLoadingAuth(false);
    },
    scope: "openid email profile https://www.googleapis.com/auth/drive.file",
    prompt: "select_account",
  });

  const handleGoogleAuth = () => {
    setLoadingAuth(true);
    const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
    if (!clientId) {
      setTimeout(() => {
        const mockProfile: DoctorProfile = {
          name: "Dr. Alejandro Silva (UAZ)",
          email: "alejandro.silva@uaz.edu.mx",
          picture: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=256&h=256&q=80",
          googleAccessToken: "mock-google-token-uaz-12345",
        };
        handleGoogleSuccess(mockProfile);
      }, 800);
      return;
    }

    try {
      googleLogin();
    } catch (e) {
      console.error("Error al iniciar login con Google:", e);
      setTimeout(() => {
        const mockProfile: DoctorProfile = {
          name: "Dr. Alejandro Silva (UAZ)",
          email: "alejandro.silva@uaz.edu.mx",
          picture: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=256&h=256&q=80",
          googleAccessToken: "mock-google-token-uaz-12345",
        };
        handleGoogleSuccess(mockProfile);
      }, 800);
    }
  };

  return (
    <header className="sticky top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-xl">
      <div className="max-w-[1440px] mx-auto px-6 lg:pl-6 lg:pr-3 h-16 flex items-center justify-between lg:grid lg:grid-cols-3">
        {/* Logo 1:1 Idéntico a DentaxyNav (DENTAXY Technologies) */}
        <div className="flex justify-start">
          <Link to="/" className="flex items-center gap-2 group">
            <motion.div whileHover={{ scale: 1.05 }} transition={{ type: "spring", stiffness: 400 }}>
              <img
                src="/lovable-uploads/3236de6d-a3e4-4b81-9c83-b32690d4212d.png"
                alt="Dentaxy"
                className="h-8 w-8"
              />
            </motion.div>
            <div className="flex flex-col leading-none">
              <span className="text-[13px] font-black tracking-tight text-gray-900 group-hover:text-emerald-600 transition-colors">
                DENTAXY
              </span>
              <span className="text-[9px] font-medium text-gray-400 tracking-widest uppercase">
                Technologies
              </span>
            </div>
          </Link>
        </div>

        {/* Desktop Navigation 1:1 Idéntico a DentaxyNav */}
        <div className="hidden lg:flex justify-center">
          <nav className="flex items-center gap-1">
            <div className="relative">
              <button
                onMouseEnter={() => setMenuOpen(true)}
                onMouseLeave={() => setMenuOpen(false)}
                onClick={() => setMenuOpen((v) => !v)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                  menuOpen ? "bg-gray-50 text-gray-900" : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                }`}
              >
                <span>Productos</span>
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-purple-600"></span>
                </span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${menuOpen ? "rotate-180" : ""}`} />
              </button>

              <div onMouseEnter={() => setMenuOpen(true)} onMouseLeave={() => setMenuOpen(false)}>
                <AnimatePresence>{menuOpen && <MegaMenu onClose={() => setMenuOpen(false)} />}</AnimatePresence>
              </div>
            </div>

            {[
              { label: "Nosotros", href: "/about" },
              { label: "Tecnologías", href: "/how-it-works" },
              { label: "Beneficios", href: "/benefits" },
              { label: "Contacto", href: "/contact" },
            ].map((item) => (
              <Link
                key={item.label}
                to={item.href}
                className="px-4 py-2 rounded-xl text-sm font-medium text-gray-500 hover:text-gray-900 hover:bg-gray-50 transition-colors"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>

        {/* Botones de Autenticación de Google Exclusivos de Academy */}
        <div className="flex justify-end items-center gap-3">
          {/* Botón Iniciar Sesión (Google OAuth) */}
          <button
            onClick={handleGoogleAuth}
            disabled={loadingAuth}
            className="hidden lg:inline-flex items-center justify-center text-sm font-semibold text-gray-600 hover:text-black border border-gray-200 hover:border-black rounded-full px-4 h-10 transition-all duration-200 bg-white shadow-none cursor-pointer disabled:opacity-50"
          >
            {loadingAuth ? "Cargando..." : "Iniciar sesión"}
          </button>

          {/* Botón Crear Cuenta (Mismo color morado #7c3aed de Academy, conectado a Google OAuth) */}
          <AcademyFutureButton
            onClick={handleGoogleAuth}
            size="sm"
            label="Crear cuenta"
            className="hidden lg:flex"
          />

          {/* Botón Hamburguesa Mobile */}
          <button
            onClick={() => setMobileMenuOpen((v) => !v)}
            className="lg:hidden p-2 rounded-xl text-gray-600 hover:bg-gray-100"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Menú Mobile Desplegable */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-white border-b border-gray-200 px-6 py-4 space-y-4 overflow-hidden"
          >
            <div className="space-y-2">
              <Link to="/about" className="block py-2 text-sm font-medium text-gray-700">Nosotros</Link>
              <Link to="/how-it-works" className="block py-2 text-sm font-medium text-gray-700">Tecnologías</Link>
              <Link to="/benefits" className="block py-2 text-sm font-medium text-gray-700">Beneficios</Link>
              <Link to="/contact" className="block py-2 text-sm font-medium text-gray-700">Contacto</Link>
            </div>
            <div className="pt-2 border-t border-gray-100 flex flex-col gap-2">
              <button
                onClick={handleGoogleAuth}
                disabled={loadingAuth}
                className="w-full py-2.5 text-center text-sm font-semibold text-gray-700 border border-gray-200 rounded-full"
              >
                Iniciar sesión
              </button>
              <button
                onClick={handleGoogleAuth}
                disabled={loadingAuth}
                className="w-full py-2.5 text-center text-sm font-semibold text-white bg-[#7c3aed] rounded-full shadow-md"
              >
                Crear cuenta con Google
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default AcademyNav;
