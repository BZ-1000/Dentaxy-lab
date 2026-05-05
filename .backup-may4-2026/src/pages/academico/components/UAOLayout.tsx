/**
 * UAOLayout.tsx
 * Layout base para todo el módulo /academico
 * Sidebar colapsable (desktop) + Bottom Navigation (móvil)
 * Se adapta dinámicamente al rol activo
 */

import React, { useState, ReactNode } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, Users, Calendar, Package, BarChart3,
  DollarSign, FileText, Settings, LogOut, Menu, X, ChevronLeft,
  Building2, GraduationCap, Stethoscope, User, ShieldCheck
} from 'lucide-react';
import { useDemo } from '../context/DemoContext';
import { cn } from '@/lib/utils';

// ─────────────────────────────────────────────────────────────────────────────
// Configuración de módulos por rol
// ─────────────────────────────────────────────────────────────────────────────

const MODULE_CONFIG = {
  director: [
    { label: 'Dashboard',     icon: LayoutDashboard, path: '/academico/director',        badge: undefined },
    { label: 'Nodos',         icon: Building2,        path: '/academico/nodos',           badge: undefined },
    { label: 'Agenda',        icon: Calendar,         path: '/academico/agenda',          badge: undefined },
    { label: 'Reportes',      icon: BarChart3,        path: '/academico/reportes',        badge: 'Pronto' },
    { label: 'Finanzas',      icon: DollarSign,       path: '/academico/finanzas',        badge: 'Pronto' },
    { label: 'Personal',      icon: Users,            path: '/academico/personal',        badge: 'Pronto' },
  ],
  coordinador: [
    { label: 'Panel Académico', icon: GraduationCap, path: '/academico/coordinador',     badge: undefined },
    { label: 'Nodos',           icon: Building2,     path: '/academico/nodos',           badge: undefined },
    { label: 'Agenda',          icon: Calendar,      path: '/academico/agenda',          badge: undefined },
    { label: 'Reportes',        icon: BarChart3,     path: '/academico/reportes',        badge: 'Pronto' },
  ],
  jefe: [
    { label: 'Mi Clínica',    icon: Building2,        path: '/academico/jefe',            badge: undefined },
    { label: 'Agenda',        icon: Calendar,         path: '/academico/agenda',          badge: undefined },
    { label: 'Nodos',         icon: LayoutDashboard,  path: '/academico/nodos',           badge: undefined },
    { label: 'Inventario',    icon: Package,          path: '/academico/inventario',      badge: 'Pronto' },
  ],
  docente: [
    { label: 'Mi Grupo',      icon: GraduationCap,    path: '/academico/docente',         badge: undefined },
    { label: 'Agenda',        icon: Calendar,         path: '/academico/agenda',          badge: undefined },
  ],
  alumno: [
    { label: 'Mis Pacientes', icon: Stethoscope,      path: '/academico/alumno',          badge: undefined },
    { label: 'Agenda',        icon: Calendar,         path: '/academico/agenda',          badge: undefined },
  ],
  administrativo: [
    { label: 'Recepción',     icon: Users,            path: '/academico/administrativo',  badge: undefined },
    { label: 'Agenda',        icon: Calendar,         path: '/academico/agenda',          badge: undefined },
  ],
  paciente: [
    { label: 'Mi Portal',     icon: FileText,         path: '/academico/paciente',        badge: undefined },
    { label: 'Mis Citas',     icon: Calendar,         path: '/academico/agenda',          badge: undefined },
  ],
};

// ─────────────────────────────────────────────────────────────────────────────
// SIDEBAR DESKTOP
// ─────────────────────────────────────────────────────────────────────────────

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ collapsed, onToggle }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { rolActivo, rolData, logout } = useDemo();

  const modules = MODULE_CONFIG[rolActivo ?? 'alumno'] ?? [];

  return (
    <motion.aside
      animate={{ width: collapsed ? 64 : 240 }}
      transition={{ duration: 0.2, ease: 'easeInOut' }}
      className="hidden md:flex flex-col h-screen bg-white dark:bg-zinc-900 border-r border-zinc-200 dark:border-zinc-800 shrink-0 overflow-hidden"
    >
      {/* Logo + Toggle */}
      <div className="flex items-center h-16 px-3 border-b border-zinc-200 dark:border-zinc-800 gap-3">
        <motion.div animate={{ opacity: 1 }} className="flex items-center gap-2 min-w-0">
          <img
            src="/logos/uao-uaz-logo.svg"
            alt="UAO UAZ"
            className="h-7 w-7 shrink-0"
          />
          <AnimatePresence>
            {!collapsed && (
              <motion.div
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -8 }}
                transition={{ duration: 0.15 }}
                className="min-w-0"
              >
                <p className="text-xs font-bold leading-none truncate text-zinc-900 dark:text-white">UAO Sync</p>
                <p className="text-[10px] text-zinc-400 leading-none mt-0.5 truncate">DentaXy Académico</p>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
        <button
          onClick={onToggle}
          className="ml-auto text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 shrink-0 p-1 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
        >
          {collapsed ? <Menu className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </button>
      </div>

      {/* Rol Badge */}
      {!collapsed && rolData && (
        <div className="px-3 pt-4 pb-2">
          <div
            className="flex items-center gap-2 px-3 py-2 rounded-xl"
            style={{ backgroundColor: rolData.color + '15' }}
          >
            <span className="text-base">{rolData.icono}</span>
            <div className="min-w-0">
              <p className="text-xs font-semibold truncate" style={{ color: rolData.color }}>
                {rolData.nombre}
              </p>
              <p className="text-[10px] text-zinc-400 truncate">Sesión activa</p>
            </div>
          </div>
        </div>
      )}

      {/* Nav items */}
      <nav className="flex-1 px-2 py-3 space-y-0.5 overflow-y-auto">
        {modules.map((mod) => {
          const isActive = location.pathname === mod.path || location.pathname.startsWith(mod.path + '/');
          const isPronto = (mod as any).badge === 'Pronto';
          return (
            <button
              key={mod.path}
              onClick={() => !isPronto && navigate(mod.path)}
              className={cn(
                'w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150',
                isActive
                  ? 'bg-zinc-900 text-white dark:bg-white dark:text-zinc-900'
                  : isPronto
                  ? 'text-zinc-400 dark:text-zinc-600 cursor-not-allowed'
                  : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800'
              )}
              title={collapsed ? mod.label : undefined}
            >
              <mod.icon className="h-4 w-4 shrink-0" />
              <AnimatePresence>
                {!collapsed && (
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex-1 truncate flex items-center justify-between"
                  >
                    {mod.label}
                    {isPronto && (
                      <span className="text-[9px] font-bold px-1.5 py-0.5 bg-zinc-100 dark:bg-zinc-800 text-zinc-400 rounded-full ml-1 shrink-0">
                        Pronto
                      </span>
                    )}
                  </motion.span>
                )}
              </AnimatePresence>
            </button>
          );
        })}
      </nav>

      {/* Badge DEMO + acciones inferiores */}
      <div className="px-2 pb-4 space-y-1 border-t border-zinc-200 dark:border-zinc-800 pt-3">
        {!collapsed && (
          <div className="mx-1 mb-2 px-2 py-1 bg-gradient-to-r from-blue-50 to-violet-50 dark:from-blue-950/30 dark:to-violet-950/30 rounded-lg flex items-center gap-1.5">
            <ShieldCheck className="h-3 w-3 text-violet-500 shrink-0" />
            <span className="text-[10px] font-bold text-violet-600 dark:text-violet-400">UAO Sync — Fases 1–4</span>
          </div>
        )}
        <button
          onClick={() => { navigate('/academico/roles'); }}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
          title={collapsed ? 'Cambiar rol' : undefined}
        >
          <User className="h-4 w-4 shrink-0" />
          {!collapsed && <span className="truncate">Cambiar rol</span>}
        </button>
        <button
          onClick={logout}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
          title={collapsed ? 'Cerrar sesión' : undefined}
        >
          <LogOut className="h-4 w-4 shrink-0" />
          {!collapsed && <span className="truncate">Cerrar sesión</span>}
        </button>
      </div>
    </motion.aside>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// BOTTOM NAV MÓVIL
// ─────────────────────────────────────────────────────────────────────────────

const BottomNav: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { rolActivo } = useDemo();

  const modules = (MODULE_CONFIG[rolActivo ?? 'alumno'] ?? []).slice(0, 4);

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white dark:bg-zinc-900 border-t border-zinc-200 dark:border-zinc-800 pb-safe">
      <div className="flex items-center justify-around h-16 px-4">
        {modules.map((mod) => {
          const isActive = location.pathname === mod.path || location.pathname.startsWith(mod.path + '/');
          return (
            <button
              key={mod.path}
              onClick={() => navigate(mod.path)}
              className={cn(
                'flex flex-col items-center gap-1 px-3 py-1 rounded-xl transition-all',
                isActive ? 'text-zinc-900 dark:text-white' : 'text-zinc-400'
              )}
            >
              <mod.icon className={cn('h-5 w-5', isActive && 'stroke-[2.5]')} />
              <span className="text-[10px] font-medium truncate max-w-[56px]">{mod.label}</span>
              {isActive && (
                <motion.div
                  layoutId="bottom-nav-indicator"
                  className="absolute -top-0.5 w-8 h-0.5 bg-zinc-900 dark:bg-white rounded-full"
                />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// HEADER TOP
// ─────────────────────────────────────────────────────────────────────────────

interface HeaderProps {
  onMobileMenuToggle: () => void;
}

const Header: React.FC<HeaderProps> = ({ onMobileMenuToggle }) => {
  const { rolData, nodoData, logout } = useDemo();
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-30 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl border-b border-zinc-200/60 dark:border-zinc-800/60 h-14">
      <div className="flex items-center h-full px-4 gap-3">
        {/* Mobile menu button */}
        <button
          onClick={onMobileMenuToggle}
          className="md:hidden p-2 rounded-xl text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800"
        >
          <Menu className="h-5 w-5" />
        </button>

        {/* Breadcrumb */}
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <span className="text-xs text-zinc-400 font-medium truncate">
            UAO Sync
          </span>
          {rolData && (
            <>
              <span className="text-zinc-300 dark:text-zinc-600 text-xs">/</span>
              <span className="text-xs font-medium truncate" style={{ color: rolData.color }}>
                {rolData.icono} {rolData.nombre}
              </span>
            </>
          )}
          {nodoData && (
            <>
              <span className="text-zinc-300 dark:text-zinc-600 text-xs">/</span>
              <span className="text-xs text-zinc-600 dark:text-zinc-400 font-medium truncate">
                {nodoData.nombre}
              </span>
            </>
          )}
        </div>

        {/* Right: cambiar rol + logout */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate('/academico/roles')}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
          >
            <User className="h-3.5 w-3.5" />
            Cambiar rol
          </button>
          <button
            onClick={logout}
            className="p-2 rounded-xl text-zinc-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
            title="Cerrar sesión"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </div>
    </header>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// LAYOUT PRINCIPAL
// ─────────────────────────────────────────────────────────────────────────────

interface UAOLayoutProps {
  children: ReactNode;
}

const UAOLayout: React.FC<UAOLayoutProps> = ({ children }) => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden bg-zinc-50 dark:bg-zinc-950">
      {/* Sidebar desktop */}
      <Sidebar
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed(prev => !prev)}
      />

      {/* Mobile drawer overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
              className="md:hidden fixed inset-0 z-40 bg-black/50"
            />
            <motion.div
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="md:hidden fixed left-0 top-0 bottom-0 z-50 w-64"
            >
              <Sidebar collapsed={false} onToggle={() => setMobileMenuOpen(false)} />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Main area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Header onMobileMenuToggle={() => setMobileMenuOpen(prev => !prev)} />

        <main className="flex-1 overflow-y-auto pb-20 md:pb-6">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
          >
            {children}
          </motion.div>
        </main>
      </div>

      {/* Bottom nav móvil */}
      <BottomNav />
    </div>
  );
};

export default UAOLayout;
