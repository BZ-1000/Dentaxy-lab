import React from 'react';
import { NavLink } from 'react-router-dom';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  Link2,
  GraduationCap,
  Boxes,
  ScrollText,
  Settings,
  Shield,
  LogOut,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { useAdminSecurity } from '@/contexts/AdminSecurityContext';
import { Button } from '@/components/ui/button';

interface AdminSidebarProps {
  isCollapsed: boolean;
  onToggle: () => void;
}

const navItems = [
  { path: '/admin/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { path: '/admin/demos', icon: Link2, label: 'Control de Demos' },
  { path: '/admin/students', icon: GraduationCap, label: 'Módulo Alumnos' },
  { path: '/admin/modules', icon: Boxes, label: 'Gestión Módulos' },
  { path: '/admin/audit', icon: ScrollText, label: 'Auditoría' },
  { path: '/admin/settings', icon: Settings, label: 'Configuración', superAdminOnly: true },
];

export const AdminSidebar: React.FC<AdminSidebarProps> = ({ isCollapsed, onToggle }) => {
  const { isSuperAdmin, systemState } = useAdminSecurity();

  return (
    <aside
      className={cn(
        'fixed left-0 top-0 z-40 h-screen border-r border-zinc-800/50 bg-zinc-950 transition-all duration-300',
        isCollapsed ? 'w-[72px]' : 'w-[240px]'
      )}
    >
      {/* Header */}
      <div className="flex h-16 items-center justify-between border-b border-zinc-800/50 px-4">
        {!isCollapsed && (
          <div className="flex items-center gap-2">
            <Shield className="h-6 w-6 text-blue-500" />
            <span className="font-semibold text-zinc-100">Admin Panel</span>
          </div>
        )}
        {isCollapsed && <Shield className="mx-auto h-6 w-6 text-blue-500" />}
        <Button
          variant="ghost"
          size="icon"
          onClick={onToggle}
          className="h-8 w-8 text-zinc-400 hover:text-zinc-100"
        >
          {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </Button>
      </div>

      {/* Lockdown Indicator */}
      {systemState.lockdown_mode && (
        <div className="mx-3 mt-3 rounded-md bg-red-500/10 p-2 text-center">
          <span className="text-xs font-medium text-red-500">
            {isCollapsed ? '🔒' : '🔒 LOCKDOWN ACTIVO'}
          </span>
        </div>
      )}

      {/* Navigation */}
      <nav className="mt-4 flex flex-col gap-1 px-3">
        {navItems.map((item) => {
          if (item.superAdminOnly && !isSuperAdmin) return null;

          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all',
                  isActive
                    ? 'bg-blue-500/10 text-blue-500'
                    : 'text-zinc-400 hover:bg-zinc-800/50 hover:text-zinc-100'
                )
              }
            >
              <item.icon className="h-5 w-5 shrink-0" />
              {!isCollapsed && <span>{item.label}</span>}
            </NavLink>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="absolute bottom-0 left-0 right-0 border-t border-zinc-800/50 p-3">
        <NavLink
          to="/"
          className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-zinc-400 hover:bg-zinc-800/50 hover:text-zinc-100"
        >
          <LogOut className="h-5 w-5 shrink-0" />
          {!isCollapsed && <span>Salir del Panel</span>}
        </NavLink>
      </div>
    </aside>
  );
};
