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
// CARD DE ROL
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
    transition={{ delay: index * 0.06, duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
    whileHover={{ y: -3, scale: 1.01 }}
    whileTap={{ scale: 0.98 }}
    onClick={onSelect}
    className="group w-full text-left bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800/80 rounded-2xl p-5 hover:border-zinc-300 dark:hover:border-zinc-700 hover:shadow-lg hover:shadow-zinc-200/60 dark:hover:shadow-zinc-950/60 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-white focus:ring-offset-2"
  >
    <div className="flex items-start gap-4">
      {/* Avatar */}
      <div
        className="w-11 h-11 rounded-2xl flex items-center justify-center text-xl shrink-0 transition-transform group-hover:scale-105"
        style={{ backgroundColor: rol.color + '18' }}
      >
        {rol.icono}
      </div>

      {/* Contenido */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <h3 className="text-sm font-semibold text-zinc-900 dark:text-white leading-tight">
            {rol.nombre}
          </h3>
          {/* Dot de color */}
          <span
            className="inline-block w-1.5 h-1.5 rounded-full shrink-0 mt-px"
            style={{ backgroundColor: rol.color }}
          />
        </div>
        <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed line-clamp-2">
          {rol.descripcion}
        </p>

        {/* Permisos rápidos */}
        <div className="flex flex-wrap gap-1 mt-2.5">
          {rol.permisos.slice(0, 3).map(p => (
            <span
              key={p}
              className="inline-block text-[10px] font-medium px-2 py-0.5 rounded-full"
              style={{ backgroundColor: rol.color + '12', color: rol.color }}
            >
              {p}
            </span>
          ))}
          {rol.permisos.length > 3 && (
            <span className="inline-block text-[10px] text-zinc-400 px-2 py-0.5">
              +{rol.permisos.length - 3} más
            </span>
          )}
        </div>
      </div>

      {/* Arrow */}
      <ChevronRight className="h-4 w-4 text-zinc-300 dark:text-zinc-600 group-hover:text-zinc-500 dark:group-hover:text-zinc-400 group-hover:translate-x-0.5 transition-all mt-1 shrink-0" />
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
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="sticky top-0 z-10 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl border-b border-zinc-200/60 dark:border-zinc-800/60"
      >
        <div className="max-w-3xl mx-auto px-4 h-14 flex items-center gap-3">
          <img src="/logos/uao-uaz-logo.svg" alt="UAO" className="h-7 w-7" />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-zinc-900 dark:text-white leading-none">UAO Sync</p>
            <p className="text-[11px] text-zinc-400 leading-none mt-0.5">DentaXy Académico · UAZ</p>
          </div>
          <button
            onClick={() => { logout(); navigate('/academico'); }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs text-zinc-500 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
          >
            <LogOut className="h-3.5 w-3.5" />
            Salir
          </button>
        </div>
      </motion.header>

      {/* Contenido */}
      <div className="max-w-3xl mx-auto px-4 py-8">
        {/* Hero text */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="mb-8"
        >
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-white tracking-tight">
            ¿Cuál es tu rol hoy?
          </h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
            Selecciona tu jerarquía para acceder a los módulos y permisos correspondientes.
          </p>
        </motion.div>

        {/* Grid de roles */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {ROLES.map((rol, i) => (
            <RolCard
              key={rol.id}
              rol={rol}
              index={i}
              onSelect={() => handleSelectRol(rol.id)}
            />
          ))}
        </div>

        {/* Footer info */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-8 p-4 bg-blue-50 dark:bg-blue-950/20 rounded-2xl border border-blue-200/60 dark:border-blue-800/40"
        >
          <p className="text-xs font-medium text-blue-700 dark:text-blue-400 mb-1">
            🔒 Acceso basado en roles
          </p>
          <p className="text-xs text-blue-600/70 dark:text-blue-400/70 leading-relaxed">
            Cada jerarquía accede únicamente a los módulos y datos que le corresponden.
            La información clínica nunca sale del servidor UAZ.
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default RolSelectorView;
