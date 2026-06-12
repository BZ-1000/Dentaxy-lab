import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import WaitlistMasterModal from "@/components/waitlist/WaitlistMasterModal";
import { motion, AnimatePresence } from "framer-motion";
import { FutureButton } from "@/components/ui/FutureButton";

import {
  Sprout,
  ShoppingBag,
  FlaskConical,
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
}

interface NavGroup {
  label: string;
  items: NavSubItem[];
}

// ─── Datos del menú ───────────────────────────────────────────────────────────
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
    className="group flex items-start gap-4 p-4 rounded-2xl hover:bg-gray-50 transition-all duration-75"
  >
    {/* Ícono */}
    <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${item.iconBg} group-hover:scale-110 transition-transform duration-100`}>
      {item.icon}
    </div>

    {/* Contenido */}
    <div className="flex-1 min-w-0">
      <div className="flex items-center gap-2 mb-1">
        <span className="font-semibold text-gray-900 text-sm">{item.title}</span>
        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${item.badgeColor}`}>
          {item.badge}
        </span>
      </div>
      <p className="text-xs text-gray-500 leading-relaxed line-clamp-2">{item.description}</p>
    </div>

    {/* Arrow */}
    <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-gray-500 group-hover:translate-x-1 transition-all duration-100 mt-1 shrink-0" />
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
    {/* Cabecera del menú */}
    <div className="px-6 pt-5 pb-3 border-b border-gray-50">
      <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-widest">
        Ecosistema Dentaxy Technologies
      </p>
    </div>

    {/* Grupos */}
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

    {/* Footer del menú */}
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

// ─── Componente principal: DentaxyNav ─────────────────────────────────────────
export const DentaxyNav: React.FC = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [waitlistOpen, setWaitlistOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <>
      <WaitlistMasterModal isOpen={waitlistOpen} onClose={() => setWaitlistOpen(false)} />
      {/* ─── Navbar Desktop ─────────────────────────────────────────────────── */}
      {/* ─── Navbar Desktop ─────────────────────────────────────────────────── */}
      <header className="sticky top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-xl">
        <div className="max-w-[1440px] mx-auto px-6 lg:pl-6 lg:pr-3 h-16 flex items-center justify-between lg:grid lg:grid-cols-3">

          {/* Logo */}
          <div className="flex justify-start">
            <Link to="/" className="flex items-center gap-2 group">
              <motion.div
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 400 }}
              >
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

          {/* Desktop Nav */}
          <div className="hidden lg:flex justify-center">
            <nav className="flex items-center gap-1">
              {/* Productos — trigger del mega-menú */}
              <div className="relative">
                <button
                  onMouseEnter={() => setMenuOpen(true)}
                  onMouseLeave={() => setMenuOpen(false)}
                  onClick={() => setMenuOpen((v) => !v)}
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                    menuOpen
                      ? "bg-gray-50 text-gray-900"
                      : "text-gray-500 hover:text-gray-900 hover:bg-gray-50"
                  }`}
                >
                  Productos
                  <ChevronDown
                    className={`w-3.5 h-3.5 transition-transform duration-200 ${menuOpen ? "rotate-180" : ""}`}
                  />
                </button>

                {/* Mega-menú con hover */}
                <div
                  onMouseEnter={() => setMenuOpen(true)}
                  onMouseLeave={() => setMenuOpen(false)}
                >
                  <AnimatePresence>
                    {menuOpen && <MegaMenu onClose={() => setMenuOpen(false)} />}
                  </AnimatePresence>
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

          {/* Iniciar sesión & Guíame al futuro / Mobile Hamburger */}
          <div className="flex justify-end items-center gap-4">
            <Link
              to="/login"
              className="hidden lg:inline-flex items-center justify-center text-sm font-semibold text-gray-600 hover:text-black border border-gray-200 hover:border-black rounded-full px-4 h-10 transition-all duration-200 bg-white"
            >
              Iniciar sesión
            </Link>
            
            <FutureButton 
              onClick={() => setWaitlistOpen(true)} 
              size="sm"
              label="Crear cuenta"
              className="hidden lg:flex" 
            />

            <button
              onClick={() => setMobileOpen(true)}
              className="lg:hidden p-2 rounded-xl text-gray-500 hover:bg-gray-50 transition-colors"
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      {/* ─── Mobile Drawer ───────────────────────────────────────────────────── */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            {/* Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[60] bg-black/30 backdrop-blur-sm"
              onClick={() => setMobileOpen(false)}
            />

            {/* Drawer */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="fixed top-0 right-0 bottom-0 z-[70] w-80 bg-white shadow-2xl"
            >
              {/* Drawer header */}
              <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
                <div className="flex items-center gap-2">
                  <img
                    src="/lovable-uploads/3236de6d-a3e4-4b81-9c83-b32690d4212d.png"
                    alt="Dentaxy"
                    className="h-7 w-7"
                  />
                  <div className="flex flex-col leading-none">
                    <span className="text-[12px] font-black tracking-tight text-gray-900">DENTAXY</span>
                    <span className="text-[8px] font-medium text-gray-400 tracking-widest uppercase">Technologies</span>
                  </div>
                </div>
                <button
                  onClick={() => setMobileOpen(false)}
                  className="p-2 rounded-xl text-gray-400 hover:bg-gray-50 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Drawer body */}
              <div className="overflow-y-auto h-full pb-8">
                {navGroups.map((group) => (
                  <div key={group.label} className="px-4 pt-5">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-2 mb-2">
                      {group.label}
                    </p>
                    {group.items.map((item) => (
                      <Link
                        key={item.title}
                        to={item.href}
                        onClick={() => setMobileOpen(false)}
                        className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors"
                      >
                        <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${item.iconBg}`}>
                          {item.icon}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-sm text-gray-900">{item.title}</span>
                            <span className={`text-[9px] font-semibold px-1.5 py-0.5 rounded-full ${item.badgeColor}`}>
                              {item.badge}
                            </span>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                ))}

                <div className="px-4 pt-5 border-t border-gray-100 mt-4">
                  {[
                    { label: "Nosotros", href: "/about" },
                    { label: "Tecnologías", href: "/how-it-works" },
                    { label: "Beneficios", href: "/benefits" },
                    { label: "Contacto", href: "/contact" },
                  ].map((item) => (
                    <Link
                      key={item.label}
                      to={item.href}
                      onClick={() => setMobileOpen(false)}
                      className="block px-3 py-3 rounded-xl text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-colors"
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default DentaxyNav;
