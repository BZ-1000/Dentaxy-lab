import { motion } from 'framer-motion';
import { BookOpen, Bell, Settings, HelpCircle, BotMessageSquare } from 'lucide-react';

// --- Variantes de Animación para Framer Motion ---

// Variante para el contenedor principal del sidebar
const sidebarVariants = {
  hidden: { x: '-100%', opacity: 0 },
  visible: {
    x: 0,
    opacity: 1,
    transition: {
      duration: 0.4,
      ease: [0.4, 0, 0.2, 1], // Curva de easing suave
      staggerChildren: 0.08, // Anima los hijos con un pequeño retraso entre ellos
    },
  },
};

// Variante para cada elemento hijo dentro del sidebar
const itemVariants = {
  hidden: { y: 15, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.3,
      ease: 'easeOut',
    },
  },
};


// --- Componentes Hijos (Recreados con estilo Apple) ---

// Un componente reutilizable para cada enlace del sidebar
const SidebarLink = ({ icon, label }) => (
  <motion.a
    href="#"
    variants={itemVariants}
    whileHover={{ scale: 1.03 }} // Sutil efecto de escala al pasar el cursor
    className="flex items-center gap-3 px-3 py-2 rounded-lg text-slate-700 hover:bg-gray-500/10 transition-colors duration-200"
  >
    {icon}
    <span className="font-medium text-sm">{label}</span>
  </motion.a>
);

// Encabezado del Sidebar
const SidebarHeader = () => (
  <motion.div variants={itemVariants} className="px-4 pt-4 pb-2">
    <div className="flex items-center gap-2">
      {/* Reemplaza esto con tu logo */}
      <BotMessageSquare size={28} className="text-indigo-500" /> 
      <div>
        <h1 className="text-base font-bold text-slate-800">Dentaxy</h1>
        <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 bg-green-400 rounded-full"></div>
            <span className="text-xs text-slate-500">En línea</span>
        </div>
      </div>
    </div>
  </motion.div>
);

// Sección de Actualizaciones
const UpdatesSection = () => (
  <div className="flex flex-col">
    <motion.h2 variants={itemVariants} className="px-4 pt-4 pb-1 text-xs font-semibold tracking-wider text-slate-500 uppercase">
      Actualizaciones
    </motion.h2>
    <div className="flex flex-col p-1">
      <SidebarLink icon={<Bell size={18} />} label="Novedades" />
      <SidebarLink icon={<Settings size={18} />} label="Ajustes" />
    </div>
  </div>
);

// Sección de Recursos
const ResourcesSection = () => (
  <div className="flex flex-col">
    <motion.h2 variants={itemVariants} className="px-4 pt-4 pb-1 text-xs font-semibold tracking-wider text-slate-500 uppercase">
      Recursos
    </motion.h2>
    <div className="flex flex-col p-1">
      <SidebarLink icon={<BookOpen size={18} />} label="Documentación" />
      <SidebarLink icon={<HelpCircle size={18} />} label="Centro de Ayuda" />
    </div>
  </div>
);


// --- Componente Principal del Sidebar ---

export const SidebarSection = () => {
  return (
    <motion.aside
      variants={sidebarVariants}
      initial="hidden"
      animate="visible"
      // El estilo de "vidrio esmerilado" es la clave
      className="w-64 flex flex-col h-full bg-gray-100/60 backdrop-blur-lg border-r border-slate-900/10"
    >
      <SidebarHeader />
      
      <div className="flex-1 flex flex-col pt-2 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-transparent">
        <UpdatesSection />
        <ResourcesSection />
      </div>

      {/* Footer sutil, opcional */}
      <motion.div variants={itemVariants} className="p-4 mt-auto">
          <p className="text-xs text-center text-slate-400">© 2025 Dentaxy AI</p>
      </motion.div>
    </motion.aside>
  );
};