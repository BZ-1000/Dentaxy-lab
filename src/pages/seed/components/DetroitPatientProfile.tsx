import React, { useState, useMemo, useEffect } from 'react';
import { 
  X, ChevronLeft, ChevronRight, Activity, Calendar, 
  Phone, ShieldAlert, FileText, ArrowRight, User
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface PatientData {
  id: string | number;
  name: string;
  createdTime?: string;
  appProperties?: {
    motivo?: string;
    alergias?: string;
    telefono?: string;
    correo?: string;
    estatus?: string;
    fase?: string;
    edad?: string;
    genero?: string;
  };
}

interface DetroitPatientProfileProps {
  patientsList: PatientData[];
  activeIndex: number;
  setActiveIndex: (index: number) => void;
  onClose: () => void;
  onOpenExpediente?: (patient: PatientData) => void;
  theme?: 'dark' | 'light';
}

type ViewMode = 'BIOMETRIC' | 'MESH' | 'DIAGNOSIS' | 'HISTORY';

export default function DetroitPatientProfile({
  patientsList = [],
  activeIndex = 0,
  setActiveIndex,
  onClose,
  onOpenExpediente,
  theme = 'dark'
}: DetroitPatientProfileProps) {
  const [viewMode, setViewMode] = useState<ViewMode>('BIOMETRIC');

  // Asegurar que el índice esté dentro del rango
  const currentPatient = useMemo(() => {
    if (patientsList.length === 0) {
      return {
        id: 'RK800-00',
        name: 'CONNOR',
        createdTime: new Date().toISOString(),
        appProperties: {
          motivo: 'Prototipo de asistencia médica digital',
          alergias: 'Ninguna',
          telefono: '+52 55 9876 5432',
          estatus: 'Activo',
          fase: 'Fase 0 (Calibración)'
        }
      } as PatientData;
    }
    return patientsList[activeIndex] || patientsList[0];
  }, [patientsList, activeIndex]);

  // Formatear Fecha
  const formattedDate = useMemo(() => {
    if (!currentPatient.createdTime) return '17 JUL 2026';
    try {
      const d = new Date(currentPatient.createdTime);
      return d.toLocaleDateString('es-MX', { day: '2-digit', month: 'short', year: 'numeric' }).toUpperCase();
    } catch {
      return '17 JUL 2026';
    }
  }, [currentPatient.createdTime]);

  // Generar código de barra único y determinista
  const barcodeLines = useMemo(() => {
    const idStr = String(currentPatient.id);
    const lines = [];
    for (let i = 0; i < 32; i++) {
      const charCode = idStr.charCodeAt(i % idStr.length) || 65;
      const width = (charCode % 3) + 1; // 1 to 3px
      const gap = (charCode % 2) + 1;  // 1 to 2px
      lines.push({ width, gap });
    }
    return lines;
  }, [currentPatient.id]);

  // Determinar color de LED según el estatus del paciente
  const estatusColor = useMemo(() => {
    const est = (currentPatient.appProperties?.estatus || currentPatient.appProperties?.motivo || '').toLowerCase();
    if (est.includes('urgencia')) return { name: 'CRÍTICO', hex: '#ef4444', glow: 'shadow-[0_0_15px_#ef4444]', text: 'text-red-500' };
    if (est.includes('alta')) return { name: 'ESTABLE', hex: '#10b981', glow: 'shadow-[0_0_15px_#10b981]', text: 'text-emerald-500' };
    if (est.includes('primera')) return { name: 'CALIBRANDO', hex: '#f59e0b', glow: 'shadow-[0_0_15px_#f59e0b]', text: 'text-amber-500' };
    return { name: 'OPERATIVO', hex: '#06b6d4', glow: 'shadow-[0_0_15px_#06b6d4]', text: 'text-cyan-400' };
  }, [currentPatient]);

  // Navegación izquierda y derecha
  const handlePrev = () => {
    if (patientsList.length === 0) return;
    setActiveIndex((activeIndex - 1 + patientsList.length) % patientsList.length);
  };

  const handleNext = () => {
    if (patientsList.length === 0) return;
    setActiveIndex((activeIndex + 1) % patientsList.length);
  };

  // Escuchar teclas de flechas para navegar de forma ultra inmersiva
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowUp') handlePrev();
      if (e.key === 'ArrowDown') handleNext();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeIndex, patientsList.length]);

  return (
    <div className="w-full h-full bg-[#080b11] text-white flex flex-col font-sans select-none overflow-hidden relative">
      
      {/* ── Brillos de fondo Cyberpunk/Detroit ── */}
      <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[70%] bg-blue-900/10 rounded-full blur-[160px] pointer-events-none z-0" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[60%] bg-cyan-900/10 rounded-full blur-[140px] pointer-events-none z-0" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_30%,rgba(8,11,17,0.85)_100%)] pointer-events-none z-0" />
      
      {/* ── Grid/Rejilla cibernética sutil de fondo ── */}
      <div 
        className="absolute inset-0 opacity-[0.03] pointer-events-none z-0 mix-blend-overlay"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(255,255,255,0.15) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255,255,255,0.15) 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px'
        }}
      />

      {/* ────────────────────────────────────────────────────────────────────────
          ENCABEZADO ESTILO DETROIT
          ──────────────────────────────────────────────────────────────────────── */}
      <header className="w-full h-16 border-b border-white/5 bg-slate-950/20 backdrop-blur-md flex items-center justify-between px-8 z-10 shrink-0 select-none">
        
        {/* Título de Marca */}
        <div className="flex items-center gap-3">
          <div className="w-2.5 h-2.5 bg-cyan-400 rotate-45 animate-pulse shadow-[0_0_8px_#06b6d4]" />
          <span 
            className="text-[14px] font-black tracking-[0.3em] text-cyan-400 uppercase animate-pulse"
            style={{ fontFamily: "'Bruno Ace SC', sans-serif" }}
          >
            DENTAXY SYSTEM
          </span>
          <span className="text-[10px] text-white/30 font-bold uppercase tracking-[0.2em] ml-2">v1.5</span>
        </div>

        {/* TABS DE SECCIÓN FUTURISTAS */}
        <nav className="hidden md:flex items-center gap-10">
          {(['BIOMÉTRICO', 'CLÍNICA', 'EXPEDIENTE', 'ESTADÍSTICA'] as const).map((tab, idx) => {
            const isTabActive = idx === 0;
            return (
              <div key={tab} className="relative py-5 cursor-pointer group">
                <span className={`text-xs font-bold tracking-[0.25em] transition-colors uppercase ${
                  isTabActive ? 'text-white' : 'text-white/40 group-hover:text-white/70'
                }`}>
                  {tab}
                </span>
                {isTabActive && (
                  <motion.div 
                    layoutId="detroitActiveTab"
                    className="absolute bottom-[-1px] left-1/2 -translate-x-1/2 w-0 h-0 border-l-[5px] border-l-transparent border-r-[5px] border-r-transparent border-b-[5px] border-b-cyan-400"
                  />
                )}
              </div>
            );
          })}
        </nav>

        {/* Botón Salir */}
        <button
          onClick={onClose}
          className="px-5 h-9 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 text-white/70 hover:text-white text-[10px] font-black tracking-[0.2em] transition-all flex items-center gap-2 group cursor-pointer focus:outline-none"
        >
          <span>SALIR DE EXPEDIENTES</span>
          <X size={12} className="group-hover:rotate-90 transition-transform duration-300" />
        </button>
      </header>

      {/* ────────────────────────────────────────────────────────────────────────
          CUERPO PRINCIPAL (Layout de 3 columnas estilo Detroit)
          ──────────────────────────────────────────────────────────────────────── */}
      <div className="flex-1 flex overflow-hidden z-10 relative">

        {/* ── COLUMNA 1: SIDEBAR IZQUIERDA (Lista de Pacientes) ── */}
        <aside className="w-[340px] border-r border-white/5 bg-slate-950/15 backdrop-blur-sm flex flex-col shrink-0 overflow-hidden">
          
          {/* Título de Lista */}
          <div className="p-6 pb-3 border-b border-white/5 flex items-center justify-between shrink-0">
            <div>
              <span className="text-[9px] font-bold text-white/40 tracking-[0.2em] uppercase">MÓDULO CIBERNÉTICO</span>
              <h3 className="text-sm font-black tracking-[0.15em] text-white uppercase mt-0.5">DIRECTORIO DE PACIENTES</h3>
            </div>
            <div className="px-2 py-0.5 bg-white/5 border border-white/10 rounded text-[9px] font-mono text-cyan-400">
              COUNT: {patientsList.length}
            </div>
          </div>

          {/* Buscador de Lista */}
          <div className="p-4 border-b border-white/5 shrink-0">
            <div className="text-[10px] text-white/30 font-bold uppercase tracking-wider mb-2">PACIENTES EN SALA / EXPEDIENTES</div>
            <div className="w-full h-[1px] bg-gradient-to-r from-cyan-500/30 to-transparent" />
          </div>

          {/* Lista Vertical de Pacientes */}
          <div className="flex-1 overflow-y-auto px-4 py-2 space-y-3 scrollbar-thin scrollbar-thumb-white/5">
            {patientsList.map((p, idx) => {
              const isSelected = idx === activeIndex;
              const code = `PX-${String(idx + 1).padStart(3, '0')}`;
              
              // Mismo color de LED para miniatura
              const pEst = (p.appProperties?.estatus || p.appProperties?.motivo || '').toLowerCase();
              let ledHex = '#06b6d4';
              if (pEst.includes('urgencia')) ledHex = '#ef4444';
              else if (pEst.includes('alta')) ledHex = '#10b981';
              else if (pEst.includes('primera')) ledHex = '#f59e0b';

              return (
                <div
                  key={p.id}
                  onClick={() => setActiveIndex(idx)}
                  className={`w-full rounded-xl p-3 border transition-all duration-300 flex items-center gap-3 cursor-pointer group relative overflow-hidden ${
                    isSelected 
                      ? 'bg-cyan-500/10 border-cyan-400/50 shadow-[0_0_15px_rgba(6,182,212,0.15)]' 
                      : 'bg-white/[0.02] border-white/5 hover:bg-white/[0.05] hover:border-white/10'
                  }`}
                >
                  {/* Marcador neón para el activo */}
                  {isSelected && (
                    <div className="absolute top-0 left-0 bottom-0 w-[3px] bg-cyan-400 shadow-[0_0_10px_#06b6d4]" />
                  )}

                  {/* Thumbnail de Avatar 3D (Busto minimalista) */}
                  <div className={`w-12 h-12 rounded-lg bg-slate-900 border flex items-center justify-center relative overflow-hidden shrink-0 ${
                    isSelected ? 'border-cyan-400/40' : 'border-white/10 group-hover:border-white/20'
                  }`}>
                    {/* Busto de maniquí en 3D */}
                    <svg viewBox="0 0 24 24" className="w-8 h-8 opacity-45 text-cyan-400">
                      <path 
                        d="M12 2C8.69 2 6 4.69 6 8C6 11.31 8.69 14 12 14C15.31 14 18 11.31 18 8C18 4.69 15.31 2 12 2ZM12 12C9.79 12 8 10.21 8 8C8 5.79 9.79 4 12 4C14.21 4 16 5.79 16 8C16 10.21 14.21 12 12 12ZM12 15C7.33 15 3 17.33 3 20V22H21V20C21 17.33 16.67 15 12 15ZM5 20C5.55 18.79 9.07 17 12 17C14.93 17 18.45 18.79 19 20H5Z" 
                        fill="currentColor"
                      />
                    </svg>
                    {/* Pequeño LED */}
                    <div 
                      className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full animate-pulse" 
                      style={{ 
                        backgroundColor: ledHex, 
                        boxShadow: `0 0 6px ${ledHex}` 
                      }} 
                    />
                  </div>

                  {/* Textos */}
                  <div className="text-left min-w-0 flex-1">
                    <div className={`text-[10px] font-mono tracking-wider ${isSelected ? 'text-cyan-400' : 'text-white/40'}`}>
                      {code}
                    </div>
                    <h4 className={`text-xs font-bold uppercase truncate tracking-wide transition-colors mt-0.5 ${
                      isSelected ? 'text-white' : 'text-white/70 group-hover:text-white'
                    }`}>
                      {p.name}
                    </h4>
                  </div>

                  <ChevronRight size={14} className={`shrink-0 transition-all ${
                    isSelected ? 'text-cyan-400 translate-x-0.5' : 'text-white/20 group-hover:text-white/50'
                  }`} />
                </div>
              );
            })}
          </div>

          {/* Navegador Inferior */}
          <div className="p-4 border-t border-white/5 bg-slate-950/25 shrink-0 flex items-center justify-between">
            <button
              onClick={handlePrev}
              className="w-10 h-10 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 text-white/60 hover:text-white flex items-center justify-center transition cursor-pointer"
            >
              <ChevronLeft size={16} />
            </button>
            <div className="text-center font-mono">
              <span className="text-xs font-black tracking-widest">
                N° {String(activeIndex + 1).padStart(2, '0')}
              </span>
              <span className="text-[10px] text-white/30"> / {String(patientsList.length).padStart(2, '0')}</span>
            </div>
            <button
              onClick={handleNext}
              className="w-10 h-10 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 text-white/60 hover:text-white flex items-center justify-center transition cursor-pointer"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </aside>

        {/* ── COLUMNA 2: DETALLES CENTRALES DEL PACIENTE ── */}
        <main className="flex-1 p-10 flex flex-col justify-between overflow-y-auto text-left relative z-10">
          
          {/* Bloque Superior del Nombre */}
          <div className="space-y-4">
            
            {/* Tag Androide / Categoría */}
            <div className="flex items-center gap-3">
              <div 
                className="w-2 h-2 rounded-full animate-ping" 
                style={{ backgroundColor: estatusColor.hex, boxShadow: `0 0 10px ${estatusColor.hex}` }} 
              />
              <span className="text-[10px] font-mono tracking-[0.3em] text-white/40 uppercase">PROTOTIPO CLÍNICO</span>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded border bg-white/5 border-white/10 ${estatusColor.text}`}>
                {estatusColor.name}
              </span>
            </div>

            {/* Nombre Gigante Estilo Detroit */}
            <div>
              <span className="text-xs font-mono text-cyan-400 tracking-[0.3em] uppercase block mb-1">
                PATIENT RECORD
              </span>
              <h1 
                className="text-4xl md:text-5xl font-black tracking-tight text-white leading-none uppercase select-text"
                style={{ letterSpacing: '-0.02em' }}
              >
                {currentPatient.name}
              </h1>
            </div>

            {/* Subtítulo o Síntesis médica rápida */}
            <p className="text-sm leading-relaxed text-white/50 max-w-xl font-medium">
              Expediente digital seguro encriptado localmente en Dentaxy Lab. Motivo del tratamiento clínico iniciado: <strong>{currentPatient.appProperties?.motivo || 'Ninguno'}</strong>.
            </p>
          </div>

          {/* Grid de Características Clínicas */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 my-8 max-w-2xl">
            
            {/* Caja 1: Registro */}
            <div className="bg-white/[0.01] border border-white/5 rounded-2xl p-4 flex flex-col justify-between">
              <span className="text-[9px] font-mono text-white/40 tracking-[0.15em] uppercase">REGISTRATION DATE</span>
              <div className="flex items-center gap-2 mt-2">
                <Calendar size={14} className="text-cyan-400" />
                <span className="text-sm font-black text-white/90">{formattedDate}</span>
              </div>
            </div>

            {/* Caja 2: Teléfono */}
            <div className="bg-white/[0.01] border border-white/5 rounded-2xl p-4 flex flex-col justify-between">
              <span className="text-[9px] font-mono text-white/40 tracking-[0.15em] uppercase">COMMUNICATION UNIT</span>
              <div className="flex items-center gap-2 mt-2">
                <Phone size={14} className="text-cyan-400" />
                <span className="text-sm font-black text-white/90">
                  {currentPatient.appProperties?.telefono || 'NO REGISTRADO'}
                </span>
              </div>
            </div>

            {/* Caja 3: Alergias */}
            <div className="bg-white/[0.01] border border-white/5 rounded-2xl p-4 flex flex-col justify-between">
              <span className="text-[9px] font-mono text-white/40 tracking-[0.15em] uppercase">BIOMETRIC ALERT</span>
              <div className="flex items-center gap-2 mt-2">
                <ShieldAlert size={14} className="text-red-400" />
                <span className="text-sm font-black text-red-400 truncate max-w-xs uppercase">
                  {currentPatient.appProperties?.alergias || 'NINGUNA ALERGIA'}
                </span>
              </div>
            </div>

            {/* Caja 4: Código de Barras */}
            <div className="bg-white/[0.01] border border-white/5 rounded-2xl p-4 flex flex-col justify-between gap-3">
              <span className="text-[9px] font-mono text-white/40 tracking-[0.15em] uppercase">BARCODE INDEX</span>
              <div className="flex flex-col gap-1.5">
                {/* Código de barras CSS */}
                <div className="flex items-end h-8 bg-white/[0.02] border border-white/5 rounded px-2 py-1 gap-[1px] w-full">
                  {barcodeLines.map((line, i) => (
                    <div 
                      key={i} 
                      className="bg-cyan-400 opacity-60 h-full" 
                      style={{ 
                        width: `${line.width}px`, 
                        marginRight: `${line.gap}px` 
                      }} 
                    />
                  ))}
                </div>
                <div className="text-[8px] font-mono text-white/30 tracking-widest text-center uppercase">
                  ID: {currentPatient.id}
                </div>
              </div>
            </div>
          </div>

          {/* Botón de Entrada Inmersiva al Expediente */}
          <div>
            <button
              onClick={() => onOpenExpediente?.(currentPatient)}
              className="h-12 px-8 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black tracking-[0.2em] rounded-xl flex items-center gap-3 transition-all duration-300 hover:scale-[1.03] active:scale-[0.98] shadow-[0_8px_20px_rgba(6,182,212,0.3)] border-none cursor-pointer focus:outline-none text-[11px]"
            >
              <span>MÁS / ABRIR EXPEDIENTE</span>
              <ArrowRight size={14} className="stroke-[3]" />
            </button>
          </div>
        </main>

        {/* ── COLUMNA 3: AVATAR 3D DERECHO ESTILO DETROIT ── */}
        <section className="w-[420px] lg:w-[480px] border-l border-white/5 bg-slate-950/[0.05] relative flex overflow-hidden shrink-0">
          
          {/* Fondo iluminado curvado estilo laboratorio Detroit */}
          <div className="absolute right-[-100px] top-[10%] bottom-[10%] w-[380px] bg-slate-800/10 border-l border-white/[0.03] rounded-l-[100%] pointer-events-none" />
          
          {/* Avatar SVG 3D Minimalista y Cibernético */}
          <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none select-none">
            <svg 
              width="100%" 
              height="80%" 
              viewBox="0 0 300 400" 
              fill="none" 
              xmlns="http://www.w3.org/2000/svg"
              className="w-full h-full max-w-[280px]"
            >
              <defs>
                {/* Gradiente de relleno metálico */}
                <linearGradient id="bodyGrad" x1="150" y1="80" x2="150" y2="350" gradientUnits="userSpaceOnUse">
                  <stop offset="0%" stopColor="#1e293b" stopOpacity="0.8" />
                  <stop offset="50%" stopColor="#0f172a" stopOpacity="0.8" />
                  <stop offset="100%" stopColor="#020617" stopOpacity="0.95" />
                </linearGradient>
                {/* Brillo de escaneo */}
                <linearGradient id="scanGrad" x1="0" y1="0" x2="0" y2="100" gradientUnits="userSpaceOnUse">
                  <stop offset="0%" stopColor="#06b6d4" stopOpacity="0" />
                  <stop offset="50%" stopColor="#06b6d4" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#06b6d4" stopOpacity="0" />
                </linearGradient>
              </defs>

              {/* Busto / Cuerpo de Androide */}
              <motion.path
                d="M 60,330 C 60,260 90,240 105,230 C 110,225 110,210 110,200 L 110,185 C 105,180 98,170 98,155 L 98,135 C 98,135 90,130 90,105 C 90,80 100,60 150,60 C 200,60 210,80 210,105 C 210,130 202,135 202,135 L 202,155 C 202,170 195,180 190,185 L 190,200 C 190,210 190,225 195,230 C 210,240 240,260 240,330 C 240,350 245,380 245,390 L 55,390 C 55,380 60,350 60,330 Z"
                fill="url(#bodyGrad)"
                stroke="#334155"
                strokeWidth="1.5"
                animate={{
                  scale: [1, 1.015, 1],
                  y: [0, -3, 0]
                }}
                transition={{
                  duration: 6,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />

              {/* MODO MALLA 3D / BIOMÉTRICO (Gridlines cibernéticos sobre el busto) */}
              {(viewMode === 'MESH' || viewMode === 'BIOMETRIC') && (
                <g opacity="0.35">
                  {/* Líneas horizontales de escaneo contour */}
                  <path d="M 98,90 Q 150,110 202,90" stroke="#06b6d4" strokeWidth="1" />
                  <path d="M 90,110 Q 150,135 210,110" stroke="#06b6d4" strokeWidth="1" />
                  <path d="M 98,140 Q 150,165 202,140" stroke="#06b6d4" strokeWidth="1" />
                  <path d="M 110,195 Q 150,210 190,195" stroke="#06b6d4" strokeWidth="1" />
                  <path d="M 95,245 Q 150,270 205,245" stroke="#06b6d4" strokeWidth="1" />
                  <path d="M 75,285 Q 150,320 225,285" stroke="#06b6d4" strokeWidth="1" />
                  <path d="M 62,325 Q 150,370 238,325" stroke="#06b6d4" strokeWidth="1" />

                  {/* Eje central vertical */}
                  <line x1="150" y1="60" x2="150" y2="390" stroke="#06b6d4" strokeWidth="0.5" strokeDasharray="3 3" />
                </g>
              )}

              {/* MODO BIOMÉTRICO (Nodos en el rostro/cuerpo) */}
              {viewMode === 'BIOMETRIC' && (
                <g>
                  {/* Puntos de referencia facial */}
                  <circle cx="150" cy="115" r="3" fill="#22d3ee" className="animate-ping" style={{ transformOrigin: '150px 115px' }} />
                  <circle cx="150" cy="115" r="2.5" fill="#22d3ee" />
                  
                  <circle cx="125" cy="100" r="1.5" fill="#22d3ee" />
                  <circle cx="175" cy="100" r="1.5" fill="#22d3ee" />
                  
                  <circle cx="120" cy="125" r="1.5" fill="#22d3ee" />
                  <circle cx="180" cy="125" r="1.5" fill="#22d3ee" />

                  <circle cx="150" cy="145" r="1.5" fill="#22d3ee" />
                  
                  {/* Vectores / Conexiones */}
                  <line x1="125" y1="100" x2="150" y2="115" stroke="#06b6d4" strokeWidth="0.5" opacity="0.5" />
                  <line x1="175" y1="100" x2="150" y2="115" stroke="#06b6d4" strokeWidth="0.5" opacity="0.5" />
                  <line x1="120" y1="125" x2="150" y2="115" stroke="#06b6d4" strokeWidth="0.5" opacity="0.5" />
                  <line x1="180" y1="125" x2="150" y2="115" stroke="#06b6d4" strokeWidth="0.5" opacity="0.5" />
                  <line x1="150" y1="145" x2="150" y2="115" stroke="#06b6d4" strokeWidth="0.5" opacity="0.5" />
                </g>
              )}

              {/* MODO DIAGNÓSTICO (Huesos / Órganos sutiles o Scanner overlay) */}
              {viewMode === 'DIAGNOSIS' && (
                <g>
                  {/* Línea horizontal de escáner que se desplaza de arriba a abajo */}
                  <motion.rect
                    x="50"
                    y="50"
                    width="200"
                    height="10"
                    fill="url(#scanGrad)"
                    animate={{
                      y: [60, 320, 60]
                    }}
                    transition={{
                      duration: 4,
                      repeat: Infinity,
                      ease: "linear"
                    }}
                  />
                  {/* Círculos concéntricos de scanner */}
                  <circle cx="150" cy="180" r="60" stroke="#06b6d4" strokeWidth="0.5" strokeDasharray="5 5" opacity="0.4" />
                  <circle cx="150" cy="180" r="90" stroke="#06b6d4" strokeWidth="0.5" strokeDasharray="3 7" opacity="0.2" />
                </g>
              )}

              {/* MODO HISTORY (Línea de tiempo flotante al lado del avatar) */}
              {viewMode === 'HISTORY' && (
                <g opacity="0.8">
                  {/* Nodos de timeline a la izquierda del avatar */}
                  <line x1="60" y1="120" x2="30" y2="120" stroke="#06b6d4" strokeWidth="1" />
                  <circle cx="30" cy="120" r="2" fill="#22d3ee" />
                  <text x="20" y="115" fill="#22d3ee" fontSize="7" fontFamily="monospace" textAnchor="end">INGRESADO</text>

                  <line x1="65" y1="220" x2="25" y2="220" stroke="#06b6d4" strokeWidth="1" />
                  <circle cx="25" cy="220" r="2" fill="#22d3ee" />
                  <text x="15" y="215" fill="#22d3ee" fontSize="7" fontFamily="monospace" textAnchor="end">DIAGNÓSTICO</text>

                  <line x1="80" y1="310" x2="40" y2="310" stroke="#06b6d4" strokeWidth="1" />
                  <circle cx="40" cy="310" r="2" fill="#22d3ee" />
                  <text x="30" y="305" fill="#22d3ee" fontSize="7" fontFamily="monospace" textAnchor="end">TRATAMIENTO</text>
                </g>
              )}

              {/* ANILLO LED ANDROIDE DETROIT EN LA SIEN DERECHA */}
              <g>
                <circle 
                  cx="194" 
                  cy="98" 
                  r="6" 
                  stroke={estatusColor.hex} 
                  strokeWidth="2.5" 
                  opacity="0.3" 
                />
                <circle 
                  cx="194" 
                  cy="98" 
                  r="6" 
                  stroke={estatusColor.hex} 
                  strokeWidth="1.5" 
                  className="animate-pulse" 
                  style={{ transformOrigin: '194px 98px' }} 
                />
              </g>
            </svg>
          </div>

          {/* MENÚ DE MODOS LATERAL DERECHO (Pestañas verticales 01-04) */}
          <div className="absolute right-6 top-1/2 -translate-y-1/2 flex flex-col gap-6 z-20">
            {(['BIOMETRIC', 'MESH', 'DIAGNOSIS', 'HISTORY'] as const).map((mode, index) => {
              const label = mode === 'BIOMETRIC' ? 'BIOMÉTRICO' : mode === 'MESH' ? 'MALLA 3D' : mode === 'DIAGNOSIS' ? 'DIAGNÓSTICO' : 'HISTORIAL';
              const isModeActive = viewMode === mode;
              return (
                <div 
                  key={mode} 
                  onClick={() => setViewMode(mode)}
                  className="flex items-center justify-end gap-3 cursor-pointer group text-right"
                >
                  {/* Nombre del Modo */}
                  <span className={`text-[9px] font-black tracking-widest transition-all duration-300 opacity-0 group-hover:opacity-100 ${
                    isModeActive ? 'text-cyan-400 translate-x-0' : 'text-white/40 -translate-x-2'
                  }`}>
                    {label}
                  </span>
                  
                  {/* Número */}
                  <div className={`w-9 h-9 rounded-lg border flex items-center justify-center font-mono text-xs font-bold transition-all duration-300 ${
                    isModeActive 
                      ? 'bg-cyan-500/10 border-cyan-400 text-cyan-400 shadow-[0_0_8px_rgba(6,182,212,0.4)]' 
                      : 'bg-white/[0.01] border-white/5 text-white/40 hover:border-white/20 hover:text-white/80'
                  }`}>
                    0{index + 1}
                  </div>
                </div>
              );
            })}
          </div>

        </section>

      </div>
    </div>
  );
}
