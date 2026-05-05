/**
 * RolSelectorView.tsx
 * Pantalla de selección de rol — 7 jerarquías del sistema UAO
 * Aparece después del login exitoso
 */

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronRight, LogOut } from 'lucide-react';
import { ROLES } from '@/data/uaoMockData';
import { useDemo } from '../context/DemoContext';

// Rutas de destino por rol
const DESTINO_ROL: Record<string, string> = {
  director:       '/academico/director',
  coordinador:    '/academico/coordinador',
  jefe:           '/academico/jefe',
  docente:        '/academico/docente',
  alumno:         '/academico/alumno',
  administrativo: '/academico/administrativo',
  paciente:       '/academico/paciente',
};

// ─────────────────────────────────────────────────────────────────────────────
// CARD DE ROL (PREMIUM REDESIGN)
// ─────────────────────────────────────────────────────────────────────────────
interface RolCardProps {
  rol: typeof ROLES[0];
  index: number;
  onSelect: () => void;
}

const RolCard: React.FC<RolCardProps> = ({ rol, index, onSelect }) => (
  <motion.button
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: index * 0.08, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
    whileHover={{ y: -6, scale: 1.01 }}
    whileTap={{ scale: 0.98 }}
    onClick={onSelect}
    className="group relative w-full text-left bg-white/70 dark:bg-zinc-900/60 backdrop-blur-md border border-zinc-200/80 dark:border-zinc-800/80 rounded-[28px] p-6 hover:shadow-2xl transition-all duration-300 focus:outline-none overflow-hidden"
    style={{
      // Añadimos una variable CSS local para usar el color dinámico en el hover
      '--hover-shadow': `0 20px 40px -10px ${rol.color}30`,
      '--hover-border': `${rol.color}50`
    } as React.CSSProperties}
  >
    {/* Efecto de borde en Hover inyectado via in-line style para aprovechar el color nativo */}
    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none rounded-[28px] border-2" style={{ borderColor: 'var(--hover-border)', boxShadow: 'var(--hover-shadow)' }} />

    <div className="flex items-start gap-5 relative z-10">
      {/* Avatar Container */}
      <div className="relative shrink-0">
        <div
          className="w-16 h-16 rounded-[20px] flex items-center justify-center text-3xl shadow-sm transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3"
          style={{ backgroundColor: rol.color, color: '#fff' }}
        >
          {rol.icono}
        </div>
        {/* Glow subyacente */}
        <div 
          className="absolute inset-0 rounded-[20px] blur-xl opacity-40 group-hover:opacity-80 transition-opacity duration-500 -z-10"
          style={{ backgroundColor: rol.color }}
        />
      </div>

      {/* Contenido */}
      <div className="flex-1 min-w-0 pt-1">
        <div className="flex items-center gap-2 mb-1.5">
          <h3 className="text-[17px] font-bold text-zinc-900 dark:text-white leading-tight font-['Inter']">
            {rol.nombre}
          </h3>
          {/* Dot Animado */}
          <span className="relative flex h-2.5 w-2.5 mt-px shrink-0">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-40 group-hover:opacity-75 transition-opacity" style={{ backgroundColor: rol.color }}></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5" style={{ backgroundColor: rol.color }}></span>
          </span>
        </div>
        <p className="text-[13px] text-zinc-500 dark:text-zinc-400 leading-relaxed max-w-[280px]">
          {rol.descripcion}
        </p>

        {/* Permisos (Tags Píldora) */}
        <div className="flex flex-wrap gap-1.5 mt-4">
          {rol.permisos.slice(0, 3).map(p => (
            <span
              key={p}
              className="inline-flex items-center text-[10px] font-bold px-2.5 py-1 rounded-full transition-colors"
              style={{ backgroundColor: rol.color, color: '#fff' }}
            >
              {p}
            </span>
          ))}
          {rol.permisos.length > 3 && (
            <span className="inline-flex items-center text-[10px] font-bold px-2.5 py-1 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400">
              +{rol.permisos.length - 3} más
            </span>
          )}
        </div>
      </div>
    </div>
  </motion.button>
);

// ─────────────────────────────────────────────────────────────────────────────
// VISTA PRINCIPAL
// ─────────────────────────────────────────────────────────────────────────────
const RolSelectorView: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated, selectRol, logout } = useDemo();

  // Si no está autenticado, regresa al login
  React.useEffect(() => {
    if (!isAuthenticated) navigate('/academico');
  }, [isAuthenticated, navigate]);

  const handleSelectRol = (rolId: string) => {
    selectRol(rolId as any);
    navigate(DESTINO_ROL[rolId] ?? '/academico/nodos');
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#09090B] font-['Inter'] flex flex-col relative overflow-hidden">
      
      {/* Background Orbs */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-blue-500/10 dark:bg-blue-500/5 blur-[120px] rounded-full pointer-events-none -z-10" />

      {/* Header Corporativo */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="w-full h-20 px-8 flex items-center justify-between border-b border-zinc-200/50 dark:border-zinc-800/50 bg-white/50 dark:bg-zinc-950/50 backdrop-blur-xl z-20"
      >
        <div className="flex items-center gap-4">
          <div className="h-10 w-10 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-600/20">
            <img src="/logos/uao-uaz-logo.svg" alt="UAO Icon" className="h-6 w-6 brightness-0 invert" />
          </div>
          <div>
            <h2 className="text-[15px] font-bold text-zinc-900 dark:text-white leading-none">UAO Sync</h2>
            <p className="text-[12px] font-medium text-zinc-500 dark:text-zinc-400 mt-1">DentaXy Académico - UAZ</p>
          </div>
        </div>
        
        <button
          onClick={() => { logout(); navigate('/academico'); }}
          className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-full border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-sm font-semibold text-zinc-600 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-50 dark:hover:bg-zinc-800 hover:shadow-sm transition-all"
        >
          Salir <LogOut className="h-4 w-4" />
        </button>
      </motion.header>

      {/* Main Content Area */}
      <main className="flex-1 w-full max-w-5xl mx-auto px-6 py-16 flex flex-col items-center justify-center z-10">
        
        {/* Títulos Centrados */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl md:text-[44px] font-extrabold text-zinc-900 dark:text-white tracking-tight mb-4">
            ¿Cuál es tu rol hoy?
          </h1>
          <p className="text-base text-zinc-600 dark:text-zinc-400 font-medium">
            Selecciona tu jerarquía para acceder a los módulos y permisos correspondientes.
          </p>
        </motion.div>

        {/* Grid de Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-[960px]">
          {ROLES.map((rol, i) => (
            <RolCard
              key={rol.id}
              rol={rol}
              index={i}
              onSelect={() => handleSelectRol(rol.id)}
            />
          ))}
        </div>

      </main>
    </div>
  );
};

export default RolSelectorView;
