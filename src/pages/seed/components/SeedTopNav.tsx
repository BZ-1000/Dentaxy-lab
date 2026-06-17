import React from 'react';
import { Search, Calendar, FileText, ArrowUpRight, Settings, Bell, Video, Sun, Moon } from 'lucide-react';

interface SeedTopNavProps {
  theme?: 'dark' | 'light';
  toggleTheme?: () => void;
}

export default function SeedTopNav({ theme = 'dark', toggleTheme }: SeedTopNavProps) {
  return (
    <nav className="w-full h-20 px-6 flex items-center justify-between relative z-50">
      
      {/* ── Izquierda: Logo y Buscador ── */}
      <div className="flex items-center gap-4">
        {/* Logo (Icono) */}
        <div className="w-10 h-10 rounded-full seed-glass flex items-center justify-center text-[var(--seed-text-main)]">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
            <path d="M3 3v5h5" />
            <path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16" />
            <path d="M16 16h5v5" />
          </svg>
        </div>
        
        {/* Botón de Menú (Hamburguesa) - Visto en la imagen al lado del logo */}
        <div className="w-10 h-10 rounded-full seed-glass flex items-center justify-center text-[var(--seed-text-muted)] cursor-pointer hover:text-[var(--seed-text-main)] transition">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="4" y1="12" x2="20" y2="12" />
            <line x1="4" y1="6" x2="20" y2="6" />
            <line x1="4" y1="18" x2="20" y2="18" />
          </svg>
        </div>

        {/* Botón Buscar */}
        <div className="w-10 h-10 rounded-full seed-glass flex items-center justify-center text-[var(--seed-text-muted)] cursor-pointer hover:text-[var(--seed-text-main)] transition">
          <Search size={16} />
        </div>

        {/* Google Drive Link (Arquitectura Zero-Storage) */}
        <a 
          href="https://drive.google.com/drive/my-drive" 
          target="_blank" 
          rel="noopener noreferrer"
          title="Mis archivos dentaxy"
          className="w-8 h-8 flex items-center justify-center cursor-pointer hover:scale-105 transition-transform duration-200"
        >
          <img 
            src="/logos/google-drive.png" 
            alt="Mis archivos dentaxy" 
            className="w-full h-full object-contain"
          />
        </a>
      </div>

      {/* ── Centro: Píldora de Eventos e Indicadores (Degradado Verde y Cristal) ── */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center gap-2 z-50">
        
        {/* Cápsula Izquierda: Fecha */}
        <div className="flex items-center gap-2 px-4 py-2 rounded-full border border-[var(--seed-nav-capsule-border)] bg-[var(--seed-nav-capsule-bg)] backdrop-blur-md shadow-md text-[var(--seed-text-main)] select-none transition-all duration-300">
          <Calendar size={13} className="text-[var(--seed-text-light)]" />
          <span className="text-[12px] font-semibold tracking-wide">January 12</span>
        </div>

        {/* Cápsula Central: Eventos Activos (Mismo material que Expert, más alta) */}
        <div 
          className="flex items-center h-[44px] px-1.5 rounded-full shadow-md overflow-hidden seed-nav-green-capsule" 
        >
          {/* Sección 1: 36 min */}
          <div className="flex items-center gap-2.5 pl-3 pr-3.5">
            <div className="flex -space-x-1">
              <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=60&q=80" className="w-5 h-5 rounded-full border border-[var(--seed-glass-border)]" alt="avatar" />
            </div>
            <span className="text-[var(--seed-text-main)] text-[11px] font-semibold tracking-wide">36 min</span>
            <div className="w-5 h-5 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shadow-sm">
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M14.5 8V16H4.5V8H14.5Z" fill="#EA4335" />
                <path d="M14.5 10L18.5 7V17L14.5 14V10Z" fill="#4285F4" />
                <path d="M4.5 8H8.5V12H4.5V8Z" fill="#FBBC05" />
                <path d="M10.5 12H14.5V16H10.5V12Z" fill="#34A853" />
              </svg>
            </div>
          </div>

          {/* Separador */}
          <div className="w-px h-5 bg-[var(--seed-glass-border)]"></div>

          {/* Sección 2: Audit Committee Review */}
          <div className="flex items-center gap-3 px-3.5">
            <span className="text-[var(--seed-text-light)] text-[10px] font-medium tracking-wide">09:00 AM</span>
            <div className="flex -space-x-1">
              <img src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=60&q=80" className="w-5 h-5 rounded-full border border-[var(--seed-glass-border)]" alt="avatar" />
              <img src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=60&q=80" className="w-5 h-5 rounded-full border border-[var(--seed-glass-border)]" alt="avatar" />
            </div>
            <span className="text-[var(--seed-text-main)] text-[11px] font-semibold tracking-wide">Audit Committee Review</span>
            <div className="w-5 h-5 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shadow-sm">
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M14.5 8V16H4.5V8H14.5Z" fill="#EA4335" />
                <path d="M14.5 10L18.5 7V17L14.5 14V10Z" fill="#4285F4" />
                <path d="M4.5 8H8.5V12H4.5V8Z" fill="#FBBC05" />
                <path d="M10.5 12H14.5V16H10.5V12Z" fill="#34A853" />
              </svg>
            </div>
          </div>

          {/* Separador */}
          <div className="w-px h-5 bg-[var(--seed-glass-border)]"></div>

          {/* Sección 3: 10:00 AM */}
          <div className="flex items-center gap-3 pl-3.5 pr-2.5">
            <span className="text-[var(--seed-text-light)] text-[10px] font-medium tracking-wide">10:00 AM</span>
            <div className="flex -space-x-1">
              <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=60&q=80" className="w-5 h-5 rounded-full border border-[var(--seed-glass-border)]" alt="avatar" />
              <img src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=60&q=80" className="w-5 h-5 rounded-full border border-[var(--seed-glass-border)]" alt="avatar" />
            </div>
          </div>

        </div>

        {/* Botones de Acción Derecha */}
        <div className="flex items-center gap-1.5 pl-1">
          <div className="w-9 h-9 rounded-full bg-[var(--seed-nav-capsule-bg)] border border-[var(--seed-nav-capsule-border)] flex items-center justify-center text-[var(--seed-text-muted)] hover:text-[var(--seed-text-main)] cursor-pointer hover:bg-[var(--seed-row-hover)] transition shadow-md shadow-black/10">
            <FileText size={14} />
          </div>
          <div className="w-9 h-9 rounded-full bg-[var(--seed-nav-capsule-bg)] border border-[var(--seed-nav-capsule-border)] flex items-center justify-center text-[var(--seed-text-muted)] hover:text-[var(--seed-text-main)] cursor-pointer hover:bg-[var(--seed-row-hover)] transition shadow-md shadow-black/10">
            <ArrowUpRight size={14} />
          </div>
        </div>

      </div>

      {/* ── Derecha: Configuración, Notificaciones y Perfil ── */}
      <div className="flex items-center gap-3">
        {/* Botón Liquid Glass de cambio de tema */}
        <button 
          onClick={toggleTheme}
          className="liquid-glass-toggle mr-1"
          title={theme === 'dark' ? "Cambiar a Modo Claro" : "Cambiar a Modo Oscuro"}
        >
          {theme === 'dark' ? <Sun size={15} /> : <Moon size={15} />}
        </button>
        <div className="w-10 h-10 rounded-full seed-glass flex items-center justify-center text-[var(--seed-text-muted)] cursor-pointer hover:text-[var(--seed-text-main)] transition">
          <Settings size={16} />
        </div>
        <div className="relative w-10 h-10 rounded-full seed-glass flex items-center justify-center text-[var(--seed-text-muted)] cursor-pointer hover:text-[var(--seed-text-main)] transition">
          <Bell size={16} />
          {/* Badge Notificación */}
          <div className="absolute top-0 right-0 translate-x-1/4 -translate-y-1/4 w-4 h-4 bg-red-500 rounded-full text-[9px] text-white flex items-center justify-center font-bold border border-current">
            5
          </div>
        </div>
        <div className="w-10 h-10 rounded-full seed-glass flex items-center justify-center text-[var(--seed-text-main)] text-xs font-semibold cursor-pointer hover:bg-[var(--seed-row-hover)] transition">
          EV
        </div>
      </div>
      
    </nav>
  );
}
