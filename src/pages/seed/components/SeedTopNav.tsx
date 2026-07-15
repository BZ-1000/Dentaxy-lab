import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Search, Calendar, FileText, ArrowUpRight, Settings, Bell, Video, Sun, Moon, LogOut, HardDrive, ShieldCheck, Mail, Volume2, UserCheck } from 'lucide-react';
import { useAuthStore } from '@/store/useAuthStore';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useDexStore } from '@/stores/useDexStore';

interface SeedTopNavProps {
  theme?: 'dark' | 'light';
  toggleTheme?: () => void;
  onOpenProfileCredential?: () => void;
  doctorProfile?: any;
}

export default function SeedTopNav({ theme = 'dark', toggleTheme, onOpenProfileCredential, doctorProfile }: SeedTopNavProps) {
  const navigate = useNavigate();
  const doctor = useAuthStore(state => state.doctor);
  const logout = useAuthStore(state => state.logout);
  
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [imgError, setImgError] = useState(false);
  const popoverRef = useRef<HTMLDivElement>(null);
  const settingsRef = useRef<HTMLDivElement>(null);

  // Zustand Store
  const { dexVoice, setDexVoice } = useDexStore();

  // Combinar store de login con el perfil guardado
  const displayName = doctorProfile?.doctorName || doctor?.name || "Doctor Dentaxy";
  const displayPicture = doctorProfile?.doctorPhoto || doctor?.picture || "";
  const displayEmail = doctorProfile?.email || doctor?.email || "doctor@dentaxy.com";

  const handleLogout = () => {
    sessionStorage.clear();
    logout();
    navigate('/seed', { replace: true });
  };

  const getInitials = useCallback((name: string) => {
    if (!name) return "EV";
    const parts = name.trim().split(/\s+/);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  }, []);

  // Cerrar popovers al hacer clic afuera
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (popoverRef.current && !popoverRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
      if (settingsRef.current && !settingsRef.current.contains(event.target as Node)) {
        setIsSettingsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  return (
    <nav className="w-full h-20 px-6 flex items-center justify-between relative z-30">
      
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
          href={`https://drive.google.com/drive/my-drive${doctor?.email ? `?authuser=${encodeURIComponent(doctor.email)}` : ''}`}
          target="_blank" 
          rel="noopener noreferrer"
          title="Mis archivos dentaxy"
          className="flex items-center justify-center cursor-pointer hover:scale-105 transition-transform duration-200"
        >
          <img 
            src="/logos/google-drive.png" 
            alt="Mis archivos dentaxy" 
            className="w-7 h-7 object-contain drop-shadow-md"
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

      {/* ── Derecha: Controles y Perfil ── */}
      <div className="flex items-center gap-3 relative">
        {/* Botón Liquid Glass de cambio de tema */}
        <button 
          onClick={toggleTheme}
          className="liquid-glass-toggle mr-1"
          title={theme === 'dark' ? "Cambiar a Modo Claro" : "Cambiar a Modo Oscuro"}
        >
          {theme === 'dark' ? <Sun size={15} /> : <Moon size={15} />}
        </button>
        <div className="relative font-sans" ref={settingsRef}>
          <button 
            onClick={() => setIsSettingsOpen(prev => !prev)}
            className="w-10 h-10 rounded-full seed-glass flex items-center justify-center text-[var(--seed-text-muted)] cursor-pointer hover:text-[var(--seed-text-main)] transition hover:bg-[var(--seed-row-hover)] border-none focus:outline-none"
          >
            <Settings size={16} />
          </button>

          {/* Menú de Ajustes Glassmorphic */}
          <AnimatePresence>
            {isSettingsOpen && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 12 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 12 }}
                transition={{ type: "spring", stiffness: 350, damping: 26 }}
                className="absolute right-0 top-12 w-80 p-5 bg-white/95 dark:bg-zinc-950/90 backdrop-blur-2xl rounded-3xl border border-neutral-250/50 dark:border-zinc-800/80 shadow-[0_24px_48px_-15px_rgba(0,0,0,0.3)] z-[100]"
              >
                <div className="pb-3 border-b border-neutral-200/50 dark:border-zinc-800/50 text-left">
                  <span className="text-[10px] uppercase tracking-[0.25em] text-purple-600 dark:text-purple-450 font-black">Configuraciones</span>
                  <h4 className="text-sm font-bold text-neutral-800 dark:text-zinc-150 mt-0.5">Asistente Virtual DEX</h4>
                </div>

                <div className="py-4 space-y-4 text-left">
                  {/* Selector de Voz */}
                  <div className="space-y-2">
                    <span className="text-[11px] font-bold text-neutral-500 dark:text-zinc-400 flex items-center gap-1.5">
                      <Volume2 size={13} className="text-purple-500" />
                      Voz de DEX (Neuronal Edge)
                    </span>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => setDexVoice('es-MX-JorgeNeural')}
                        className={`h-11 rounded-xl font-bold text-[10.5px] border flex flex-col items-center justify-center transition-all ${
                          dexVoice === 'es-MX-JorgeNeural'
                            ? 'bg-neutral-900 text-white border-neutral-900 dark:bg-zinc-100 dark:text-black dark:border-zinc-100'
                            : 'bg-transparent text-neutral-700 border-neutral-250 dark:text-zinc-300 dark:border-zinc-800 hover:bg-neutral-50 dark:hover:bg-zinc-900/40'
                        }`}
                      >
                        <span>Dr. Jorge</span>
                        <span className="text-[8px] opacity-70 mt-0.5 font-normal">Voz Masculina</span>
                      </button>
                      <button
                        onClick={() => setDexVoice('es-MX-DaliaNeural')}
                        className={`h-11 rounded-xl font-bold text-[10.5px] border flex flex-col items-center justify-center transition-all ${
                          dexVoice === 'es-MX-DaliaNeural'
                            ? 'bg-neutral-900 text-white border-neutral-900 dark:bg-zinc-100 dark:text-black dark:border-zinc-100'
                            : 'bg-transparent text-neutral-700 border-neutral-250 dark:text-zinc-300 dark:border-zinc-800 hover:bg-neutral-50 dark:hover:bg-zinc-900/40'
                        }`}
                      >
                        <span>Dra. Dalia</span>
                        <span className="text-[8px] opacity-70 mt-0.5 font-normal">Voz Femenina</span>
                      </button>
                    </div>
                  </div>

                  {/* Telemetría / Nota */}
                  <div className="p-3.5 rounded-2xl bg-neutral-50 dark:bg-zinc-900/40 border border-neutral-200/40 dark:border-zinc-800/40">
                    <div className="flex items-center gap-2 text-[10.5px] font-bold text-neutral-700 dark:text-zinc-350">
                      <UserCheck size={13} className="text-emerald-500" />
                      <span>Alfred Mode (Elegancia)</span>
                    </div>
                    <p className="text-[9.5px] text-neutral-500 dark:text-zinc-400 mt-1 leading-relaxed">
                      DEX te responderá con suma educación y distinción. Actívalo diciendo <strong className="text-neutral-800 dark:text-zinc-200 font-black">"DEX"</strong> o <strong className="text-neutral-800 dark:text-zinc-200 font-black">"Hey DEX"</strong> en cualquier momento.
                    </p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        <div className="relative w-10 h-10 rounded-full seed-glass flex items-center justify-center text-[var(--seed-text-muted)] cursor-pointer hover:text-[var(--seed-text-main)] transition">
          <Bell size={16} />
          {/* Badge Notificación */}
          <div className="absolute top-0 right-0 translate-x-1/4 -translate-y-1/4 w-4 h-4 bg-red-500 rounded-full text-[9px] text-white flex items-center justify-center font-bold border border-current">
            5
          </div>
        </div>
        <div className="relative font-sans" ref={popoverRef}>
          {/* Avatar interactivo */}
          <button 
            onClick={() => setIsProfileOpen(prev => !prev)}
            className="w-10 h-10 rounded-full seed-glass flex items-center justify-center text-[var(--seed-text-main)] text-xs font-semibold cursor-pointer hover:bg-[var(--seed-row-hover)] transition overflow-hidden border border-neutral-200/20 dark:border-zinc-800 focus:outline-none"
          >
            {displayPicture && !imgError ? (
              <img 
                src={displayPicture} 
                alt={displayName} 
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
                onError={() => setImgError(true)}
              />
            ) : (
              getInitials(displayName)
            )}
          </button>

          {/* Menú de Perfil Glassmorphic */}
          <AnimatePresence>
            {isProfileOpen && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 12 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 12 }}
                transition={{ type: "spring", stiffness: 350, damping: 26 }}
                className="absolute right-0 top-12 w-80 p-5 bg-white/95 dark:bg-zinc-950/90 backdrop-blur-2xl rounded-3xl border border-neutral-250/50 dark:border-zinc-800/80 shadow-[0_24px_48px_-15px_rgba(0,0,0,0.3)] z-[100]"
              >
                {/* Cabecera del Perfil */}
                <div className="flex items-center gap-3.5 pb-4 border-b border-neutral-200/50 dark:border-zinc-800/50">
                  <div className="w-12 h-12 rounded-full bg-purple-600/10 dark:bg-purple-500/10 flex items-center justify-center text-purple-600 dark:text-purple-400 font-bold text-lg shrink-0 overflow-hidden border border-purple-200/40 dark:border-purple-800/30">
                    {displayPicture && !imgError ? (
                      <img 
                        src={displayPicture} 
                        alt={displayName} 
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                        onError={() => setImgError(true)}
                      />
                    ) : (
                      getInitials(displayName)
                    )}
                  </div>
                  <div className="min-w-0 flex-1 text-left">
                    <p className="text-sm font-bold text-neutral-800 dark:text-zinc-150 truncate">
                      {displayName}
                    </p>
                    <p className="text-xs text-neutral-500 dark:text-zinc-400 truncate flex items-center gap-1 mt-0.5">
                      <Mail size={11} className="shrink-0" />
                      {displayEmail}
                    </p>
                  </div>
                </div>

                {/* Sección de Estado de Google Drive */}
                <div className="py-4 space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-neutral-500 dark:text-zinc-400 font-medium">Google Drive</span>
                    <span className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-50/70 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400 font-bold text-[10px] border border-emerald-100/50 dark:border-emerald-900/30">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                      Conectado
                    </span>
                  </div>
                  
                  <div className="p-3 rounded-2xl bg-neutral-50 dark:bg-zinc-900/40 border border-neutral-200/40 dark:border-zinc-800/40 text-left">
                    <div className="flex items-center gap-2 text-xs font-bold text-neutral-700 dark:text-zinc-350">
                      <HardDrive size={13} className="text-[#34A853]" />
                      <span>Soberanía de Datos</span>
                    </div>
                    <p className="text-[10px] text-neutral-500 dark:text-zinc-400 mt-1 leading-relaxed">
                      Tus expedientes y PDFs clínicos se almacenan localmente en tu nube.
                    </p>
                  </div>
                </div>

                {/* Acciones del Menú */}
                <div className="pt-2 space-y-1">
                  <button
                    onClick={() => {
                      setIsProfileOpen(false);
                      onOpenProfileCredential?.();
                    }}
                    className="w-full h-11 px-3.5 rounded-xl text-neutral-700 dark:text-zinc-300 hover:bg-neutral-50 dark:hover:bg-zinc-900/60 font-medium text-xs flex items-center gap-2.5 transition-all duration-200 border border-transparent hover:border-neutral-200/50 dark:hover:border-zinc-800/40 text-left"
                  >
                    <ShieldCheck size={14} className="text-purple-500" />
                    <span>Mi Credencial Profesional</span>
                  </button>

                  <a 
                    href="https://drive.google.com/drive/my-drive"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full h-11 px-3.5 rounded-xl text-neutral-700 dark:text-zinc-300 hover:bg-neutral-50 dark:hover:bg-zinc-900/60 font-medium text-xs flex items-center gap-2.5 transition-all duration-200 border border-transparent hover:border-neutral-200/50 dark:hover:border-zinc-800/40"
                  >
                    <img src="/logos/google-drive.png" className="w-4.5 h-4.5 object-contain" alt="Drive" />
                    <span>Ver Carpeta en Google Drive</span>
                  </a>

                  <button
                    onClick={handleLogout}
                    className="w-full h-11 px-3.5 rounded-xl text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/20 font-medium text-xs flex items-center gap-2.5 transition-all duration-200 border border-transparent hover:border-red-100 dark:hover:border-red-950/30"
                  >
                    <LogOut size={14} />
                    <span>Cerrar Sesión</span>
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
      
    </nav>
  );
}
