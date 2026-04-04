import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import {
  LayoutGrid,
  Network,
  Share2,
  ShieldCheck,
  Globe,
  BarChart3,
  Megaphone,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Zap,
  Lock,
  Layers,
  Users,
  Tv2,
  ListChecks,
} from 'lucide-react';
import { useAdminSecurity } from '@/contexts/AdminSecurityContext';
import { useAdminAuthContext } from '@/contexts/AdminAuthContext';

interface AdminSidebarProps {
  isCollapsed: boolean;
  onToggle: () => void;
}

const navItems = [
  { path: '/admin/dashboard', icon: LayoutGrid, label: 'Dashboard' },
  { path: '/admin/nexus-intel', icon: Users, label: 'DENTAXY Nexus' },
  { path: '/admin/ecosystem', icon: Network, label: 'Ecosystem' },
  { path: '/admin/waitlist', icon: ListChecks, label: 'Lista de Espera' },
  { path: '/admin/demos', icon: Share2, label: 'Demo Engine' },
  { path: '/admin/security', icon: ShieldCheck, label: 'Security' },
  { path: '/admin/geomap', icon: Globe, label: 'GeoMap' },
  { path: '/admin/analytics', icon: BarChart3, label: 'Analytics' },
  { path: '/admin/communication', icon: Megaphone, label: 'Communication' },
  { path: '/admin/presentation-remote', icon: Tv2, label: 'Control Remoto P' },
];

export const AdminSidebar: React.FC<AdminSidebarProps> = ({ isCollapsed, onToggle }) => {
  const { systemState } = useAdminSecurity();
  const { logout } = useAdminAuthContext();
  const location = useLocation();

  return (
    <aside
      className={cn(
        'fixed left-4 top-4 bottom-4 z-50 flex flex-col transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]',
        'rounded-3xl border border-white/60 bg-white/80 shadow-[0_0_20px_rgba(0,0,0,0.03)] backdrop-blur-xl supports-[backdrop-filter]:bg-white/60',
        isCollapsed ? 'w-[72px]' : 'w-[260px]'
      )}
    >
      {/* Header / Brand */}
      <div className={cn("h-20 flex items-center px-5 mb-2", isCollapsed ? "justify-center" : "justify-between")}>
        <div className="flex items-center gap-3">
          <div className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-zinc-900 shadow-lg shadow-zinc-900/20">
            <Zap className="h-5 w-5 text-white" fill="currentColor" />
            <div className="absolute -right-1 -top-1 h-2.5 w-2.5 rounded-full border-2 border-white bg-emerald-500" />
          </div>
          {!isCollapsed && (
            <div className="flex flex-col">
              <span className="text-base font-bold tracking-tight text-zinc-900">Dentaxy</span>
              <span className="text-[9px] font-bold uppercase tracking-widest text-zinc-400">Admin OS</span>
            </div>
          )}
        </div>
      </div>

      {/* Lockdown Alert */}
      {systemState.lockdown_mode && (
        <div className="mx-4 mb-4">
          <div className={cn(
            "rounded-xl border border-red-100 bg-red-50 p-3 transition-all",
            isCollapsed ? "flex items-center justify-center" : "flex items-center gap-3"
          )}>
            <Lock className="h-4 w-4 shrink-0 animate-pulse text-red-500" />
            {!isCollapsed && (
              <span className="text-[10px] font-bold uppercase tracking-wide text-red-600">System Locked</span>
            )}
          </div>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 space-y-1 px-3 overflow-y-auto custom-scrollbar">
        {navItems.map((item) => {
          const isActive = location.pathname.startsWith(item.path);

          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={cn(
                'group relative flex items-center gap-3 rounded-xl px-3 py-3 transition-all duration-200',
                isActive
                  ? 'bg-zinc-900 text-white shadow-md shadow-zinc-900/10'
                  : 'text-zinc-500 hover:bg-zinc-50 hover:text-zinc-900'
              )}
            >
              <item.icon
                className={cn(
                  "h-5 w-5 shrink-0 transition-colors",
                  isActive ? "text-white" : "text-zinc-400 group-hover:text-zinc-600"
                )}
              />
              {!isCollapsed && (
                <span className="text-sm font-medium tracking-tight">
                  {item.label}
                </span>
              )}

              {isActive && !isCollapsed && (
                <ChevronRight className="ml-auto h-3 w-3 text-zinc-500 opacity-50" />
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* Toggle Button */}
      <button
        onClick={onToggle}
        className="absolute -right-3 top-24 z-50 flex h-6 w-6 items-center justify-center rounded-full border border-gray-100 bg-white shadow-sm transition-transform hover:scale-110 active:scale-95 text-zinc-400 hover:text-zinc-900"
      >
        {isCollapsed ? <ChevronRight className="h-3 w-3" /> : <ChevronLeft className="h-3 w-3" />}
      </button>

      {/* Footer / Profile */}
      <div className="mt-auto px-3 pb-4 pt-2">
        <div className={cn(
          "flex items-center gap-3 rounded-2xl border border-zinc-100 bg-zinc-50/50 p-2 transition-all",
          isCollapsed ? "justify-center" : ""
        )}>
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white shadow-sm ring-1 ring-zinc-100">
            <span className="text-xs font-bold text-zinc-900">BZ</span>
          </div>

          {!isCollapsed && (
            <div className="min-w-0 flex-1">
              <p className="truncate text-xs font-bold text-zinc-900">Administrator</p>
              <p className="truncate text-[10px] text-zinc-400">bz1000@dentaxy.com</p>
            </div>
          )}

          {!isCollapsed && (
            <button
              onClick={logout}
              className="flex h-7 w-7 items-center justify-center rounded-lg text-zinc-400 transition-colors hover:bg-red-50 hover:text-red-500"
            >
              <LogOut className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>
    </aside>
  );
};
