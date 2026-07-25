import React, { useState, useMemo, useEffect } from 'react';
import { 
  X, ChevronLeft, ChevronRight, Calendar, 
  Phone, ShieldAlert, ArrowRight
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

// Configuración de los modos: número, nombre, colores del selector tipo videojuego
const MODE_CONFIG: { mode: ViewMode; label: string; colorFrom: string; colorTo: string; glow: string }[] = [
  { mode: 'BIOMETRIC',  label: 'BIOMÉTRICO',  colorFrom: '#22d3ee', colorTo: '#06b6d4', glow: 'rgba(34,211,238,0.6)' },
  { mode: 'MESH',       label: 'MALLA 3D',    colorFrom: '#60a5fa', colorTo: '#3b82f6', glow: 'rgba(96,165,250,0.6)' },
  { mode: 'DIAGNOSIS',  label: 'DIAGNÓSTICO', colorFrom: '#a78bfa', colorTo: '#8b5cf6', glow: 'rgba(167,139,250,0.6)' },
  { mode: 'HISTORY',    label: 'HISTORIAL',   colorFrom: '#c084fc', colorTo: '#a855f7', glow: 'rgba(192,132,252,0.6)' },
];

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
          fase: 'Fase 0 (Calibración)',
          genero: 'masculino'
        }
      } as PatientData;
    }
    return patientsList[activeIndex] || patientsList[0];
  }, [patientsList, activeIndex]);

  // Detectar género para elegir avatar
  const isFemale = useMemo(() => {
    const g = (currentPatient.appProperties?.genero || '').toLowerCase();
    return g.includes('mujer') || g.includes('fem') || g.includes('f');
  }, [currentPatient]);

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
    for (let i = 0; i < 35; i++) {
      const charCode = idStr.charCodeAt(i % idStr.length) || 65;
      const width = (charCode % 3) + 1;
      const gap = (charCode % 2) + 1;
      lines.push({ width, gap });
    }
    return lines;
  }, [currentPatient.id]);

  // Determinar color de LED según el estatus del paciente
  const estatusColor = useMemo(() => {
    const est = (currentPatient.appProperties?.estatus || currentPatient.appProperties?.motivo || '').toLowerCase();
    if (est.includes('urgencia')) return { name: 'CRÍTICO', hex: '#ef4444' };
    if (est.includes('alta')) return { name: 'ESTABLE', hex: '#10b981' };
    if (est.includes('primera')) return { name: 'CALIBRANDO', hex: '#d97706' };
    return { name: 'OPERATIVO', hex: '#0284c7' };
  }, [currentPatient]);

  // Navegación
  const handlePrev = () => {
    if (patientsList.length === 0) return;
    setActiveIndex((activeIndex - 1 + patientsList.length) % patientsList.length);
  };
  const handleNext = () => {
    if (patientsList.length === 0) return;
    setActiveIndex((activeIndex + 1) % patientsList.length);
  };

  // Teclas de flecha
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowUp') handlePrev();
      if (e.key === 'ArrowDown') handleNext();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeIndex, patientsList.length]);

  const totalPatients = patientsList.length || 1;
  const currentNum = String(activeIndex + 1).padStart(2, '0');
  const totalNum = String(totalPatients).padStart(2, '0');

  return (
    <div className="w-full h-full text-slate-800 flex flex-col font-sans select-none overflow-hidden relative"
      style={{ background: '#d1d5de' }}
    >
      
      {/* ── Blob rosa pastel (esquina sup-izq) ── */}
      <div className="absolute top-[-5%] left-[-5%] w-[55%] h-[55%] rounded-full pointer-events-none z-0"
        style={{ background: 'radial-gradient(circle, rgba(249,168,212,0.55) 0%, rgba(249,168,212,0.15) 55%, transparent 75%)', filter: 'blur(60px)' }} />

      {/* ── Blob lavanda (centro-derecha) ── */}
      <div className="absolute top-[20%] right-[-10%] w-[50%] h-[60%] rounded-full pointer-events-none z-0"
        style={{ background: 'radial-gradient(circle, rgba(196,181,253,0.5) 0%, rgba(196,181,253,0.12) 55%, transparent 75%)', filter: 'blur(70px)' }} />

      {/* ── Blob azul-claro (inferior-izq) ── */}
      <div className="absolute bottom-[-10%] left-[10%] w-[45%] h-[45%] rounded-full pointer-events-none z-0"
        style={{ background: 'radial-gradient(circle, rgba(191,219,254,0.5) 0%, rgba(191,219,254,0.1) 55%, transparent 75%)', filter: 'blur(65px)' }} />

      {/* ── Capa de glassmorfismo blanco sobre todo ── */}
      <div className="absolute inset-0 pointer-events-none z-0"
        style={{ background: 'rgba(255,255,255,0.28)', backdropFilter: 'blur(2px)' }} />

      {/* ════════════════════════════════════════════
          HEADER ESTILO DETROIT
          ════════════════════════════════════════════ */}
      <header className="w-full h-16 flex items-center justify-between z-10 shrink-0 select-none px-0" style={{ background: 'rgba(255,255,255,0.35)', backdropFilter: 'blur(20px)', borderBottom: '1px solid rgba(255,255,255,0.5)' }}>
        
        {/* Logo DENTAXY */}
        <div className="w-[320px] shrink-0 h-full px-4 flex flex-col justify-center items-center text-slate-700 z-20" style={{ background: 'rgba(255,255,255,0.45)', backdropFilter: 'blur(20px)', borderRight: '1px solid rgba(255,255,255,0.6)' }}>
          <span 
            className="text-[28px] font-black tracking-[0.15em] uppercase leading-none text-slate-800"
            style={{ fontFamily: "'Bruno Ace SC', sans-serif" }}
          >
            DENTAXY
          </span>
          <span className="text-[8.5px] font-bold tracking-[0.42em] uppercase mt-2 opacity-60 leading-none mr-[-0.42em] text-slate-600">
            technologies
          </span>
        </div>

        {/* Tabs de sección */}
        <nav className="hidden md:flex flex-1 h-full items-center px-12 gap-10">
          {(['DETROIT', 'CHARACTER', 'WEAPON', 'STORY', 'CONCEPT'] as const).map((tab, idx) => {
            const isTabActive = idx === 1;
            return (
              <div key={tab} className="relative py-5 cursor-pointer group">
                <span className={`text-[10px] font-black tracking-[0.25em] transition-colors uppercase ${
                  isTabActive ? 'text-slate-900 font-extrabold' : 'text-slate-500 group-hover:text-slate-700'
                }`}>
                  {tab}
                </span>
                {isTabActive && (
                  <motion.div 
                    layoutId="detroitActiveTab"
                    className="absolute bottom-[-1px] left-1/2 -translate-x-1/2 w-0 h-0 border-l-[5px] border-l-transparent border-r-[5px] border-r-transparent border-b-[5px] border-b-slate-900"
                  />
                )}
              </div>
            );
          })}
        </nav>

        {/* Botón Salir */}
        <div className="px-6 h-full flex items-center justify-end shrink-0">
          <button
            onClick={onClose}
            className="px-5 h-9 bg-white/40 border border-slate-350 hover:bg-white/80 text-slate-700 hover:text-slate-900 text-[10px] font-black tracking-[0.2em] transition-all flex items-center gap-2 group cursor-pointer focus:outline-none rounded-md"
          >
            <span>SALIR</span>
            <X size={12} className="group-hover:rotate-90 transition-transform duration-300" />
          </button>
        </div>
      </header>

      {/* ════════════════════════════════════════════
          CUERPO PRINCIPAL: 3 COLUMNAS
          ════════════════════════════════════════════ */}
      <div className="flex-1 flex overflow-hidden z-10 relative">

        {/* ══════════════════════════════════════════
            COLUMNA 1: SIDEBAR IZQUIERDA
            ══════════════════════════════════════════ */}
        <aside className="w-[320px] flex flex-col shrink-0 overflow-hidden relative z-20" style={{ background: 'rgba(255,255,255,0.30)', backdropFilter: 'blur(24px)', borderRight: '1px solid rgba(255,255,255,0.55)' }}>
          
          {/* Lista de Pacientes */}
          <div className="flex-1 overflow-y-auto px-5 py-6 space-y-5 scrollbar-thin scrollbar-thumb-white/10">
            {patientsList.map((p, idx) => {
              const isSelected = idx === activeIndex;
              const code = `PX-${String(idx + 1).padStart(3, '0')}`;
              
              const pEst = (p.appProperties?.estatus || p.appProperties?.motivo || '').toLowerCase();
              let ledHex = '#0ea5e9';
              if (pEst.includes('urgencia')) ledHex = '#ef4444';
              else if (pEst.includes('alta')) ledHex = '#10b981';
              else if (pEst.includes('primera')) ledHex = '#f59e0b';

              return (
                <div 
                  key={p.id}
                  onClick={() => setActiveIndex(idx)}
                  className="w-full flex flex-col cursor-pointer group"
                >
                  {/* Tarjeta de selección */}
                  <div
                    className="w-full h-32 relative overflow-hidden transition-all duration-400 rounded-sm"
                    style={{
                      background: isSelected
                        ? 'linear-gradient(135deg, rgba(56,189,248,0.18) 0%, rgba(255,255,255,0.08) 100%)'
                        : 'rgba(89,132,156,0.35)',
                      border: isSelected
                        ? '1.5px solid rgba(255,255,255,0.85)'
                        : '1.5px solid rgba(255,255,255,0.12)',
                      boxShadow: isSelected
                        ? '0 0 20px rgba(255,255,255,0.45), 0 0 8px rgba(34,211,238,0.3), inset 0 0 16px rgba(255,255,255,0.08)'
                        : 'none'
                    }}
                  >
                    {/* Ícono de busto */}
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      <svg viewBox="0 0 24 24" className={`w-16 h-16 transition-all duration-300 ${isSelected ? 'scale-105' : 'scale-100'}`}
                        style={{ color: isSelected ? 'rgba(255,255,255,0.75)' : 'rgba(255,255,255,0.22)' }}>
                        <path 
                          d="M12 2C8.69 2 6 4.69 6 8C6 11.31 8.69 14 12 14C15.31 14 18 11.31 18 8C18 4.69 15.31 2 12 2ZM12 12C9.79 12 8 10.21 8 8C8 5.79 9.79 4 12 4C14.21 4 16 5.79 16 8C16 10.21 14.21 12 12 12ZM12 15C7.33 15 3 17.33 3 20V22H21V20C21 17.33 16.67 15 12 15Z" 
                          fill="currentColor"
                        />
                      </svg>
                    </div>

                    {/* Corchetes de selección estilo Detroit */}
                    {isSelected && (
                      <>
                        {/* Esquina sup-izq */}
                        <div className="absolute top-2 left-2 w-4 h-4 border-t-[2px] border-l-[2px] border-amber-300" 
                          style={{ boxShadow: '0 0 6px rgba(252,211,77,0.5)' }} />
                        {/* Esquina sup-der */}
                        <div className="absolute top-2 right-2 w-4 h-4 border-t-[2px] border-r-[2px] border-amber-300"
                          style={{ boxShadow: '0 0 6px rgba(252,211,77,0.5)' }} />
                        {/* Esquina inf-izq */}
                        <div className="absolute bottom-2 left-2 w-4 h-4 border-b-[2px] border-l-[2px] border-amber-300"
                          style={{ boxShadow: '0 0 6px rgba(252,211,77,0.5)' }} />
                        {/* Esquina inf-der */}
                        <div className="absolute bottom-2 right-2 w-4 h-4 border-b-[2px] border-r-[2px] border-amber-300"
                          style={{ boxShadow: '0 0 6px rgba(252,211,77,0.5)' }} />

                        {/* Línea de escaneo LED arriba */}
                        <div className="absolute top-0 left-0 right-0 h-[2px]"
                          style={{ background: 'linear-gradient(90deg, transparent, rgba(34,211,238,0.9) 50%, transparent)', boxShadow: '0 0 8px rgba(34,211,238,0.8)' }} />
                      </>
                    )}

                    {/* LED de estatus */}
                    <div 
                      className="absolute top-2.5 right-2.5 w-1.5 h-1.5 rounded-full" 
                      style={{ backgroundColor: ledHex }}
                    />
                  </div>

                  {/* Texto de identidad fuera del card */}
                  <div className={`text-[9px] font-mono tracking-[0.25em] mt-2 transition-colors uppercase text-left ${
                    isSelected ? 'text-slate-800 font-extrabold' : 'text-slate-500 group-hover:text-slate-700'
                  }`}>
                    {`| ${code} ${p.name}`}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Navegador inferior */}
          <div className="p-4 shrink-0 flex items-center justify-between" style={{ borderTop: '1px solid rgba(255,255,255,0.45)', background: 'rgba(255,255,255,0.20)' }}>
            <button
              onClick={handlePrev}
              className="w-10 h-10 rounded-lg hover:bg-black/5 text-slate-500 hover:text-slate-800 flex items-center justify-center transition border-none cursor-pointer"
            >
              <ChevronLeft size={18} />
            </button>
            
            <div className="px-5 py-1.5 rounded flex items-center justify-center font-mono text-[9px] text-slate-600 font-black tracking-[0.2em] select-none" style={{ background: 'rgba(255,255,255,0.7)', border: '1px solid rgba(255,255,255,0.8)' }}>
              CHARACTER
            </div>

            <button
              onClick={handleNext}
              className="w-10 h-10 rounded-lg hover:bg-black/5 text-slate-500 hover:text-slate-800 flex items-center justify-center transition border-none cursor-pointer"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </aside>

        {/* ══════════════════════════════════════════
            COLUMNA 2: DETALLES CENTRALES
            ══════════════════════════════════════════ */}
        <main className="flex-1 p-12 flex flex-col justify-between overflow-y-auto text-left relative z-10">
          
          <div className="space-y-4">
            {/* Estatus tag */}
            <div className="flex items-center gap-3">
              <span className="text-[10px] font-mono tracking-[0.3em] text-[#334b57]/50 uppercase font-black">▲ {estatusColor.name}</span>
            </div>

            {/* Nombre gigante */}
            <div>
              <span className="text-[10px] font-mono text-[#475f6d] tracking-[0.35em] uppercase block mb-1">
                SYSTEM MODEL ID
              </span>
              <h1 
                className="text-5xl font-black tracking-tight text-slate-900 leading-none uppercase select-text"
                style={{ letterSpacing: '-0.025em', fontFamily: 'system-ui, sans-serif' }}
              >
                {currentPatient.name}
              </h1>
            </div>

            {/* Descripción */}
            <p className="text-sm leading-relaxed text-slate-650 max-w-xl font-semibold">
              Expediente digital seguro encriptado localmente en Dentaxy Lab. Motivo del tratamiento clínico iniciado: <strong>{currentPatient.appProperties?.motivo || 'Ninguno'}</strong>.
            </p>
          </div>

          {/* Grid de características clínicas */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 my-6 max-w-xl">
            
            <div className="bg-white/35 border border-slate-350/60 rounded-xl p-4 flex flex-col justify-between shadow-sm">
              <span className="text-[8px] font-mono text-slate-400 tracking-[0.15em] uppercase font-bold">REGISTRATION DATE</span>
              <div className="flex items-center gap-2 mt-2">
                <Calendar size={14} className="text-sky-650" />
                <span className="text-xs font-black text-slate-800">{formattedDate}</span>
              </div>
            </div>

            <div className="bg-white/35 border border-slate-350/60 rounded-xl p-4 flex flex-col justify-between shadow-sm">
              <span className="text-[8px] font-mono text-slate-400 tracking-[0.15em] uppercase font-bold">COMMUNICATION UNIT</span>
              <div className="flex items-center gap-2 mt-2">
                <Phone size={14} className="text-sky-650" />
                <span className="text-xs font-black text-slate-800">
                  {currentPatient.appProperties?.telefono || 'NO REGISTRADO'}
                </span>
              </div>
            </div>

            <div className="bg-white/35 border border-slate-350/60 rounded-xl p-4 flex flex-col justify-between shadow-sm">
              <span className="text-[8px] font-mono text-slate-400 tracking-[0.15em] uppercase font-bold">BIOMETRIC ALERT</span>
              <div className="flex items-center gap-2 mt-2">
                <ShieldAlert size={14} className="text-red-500" />
                <span className="text-xs font-black text-red-500 truncate max-w-xs uppercase">
                  {currentPatient.appProperties?.alergias || 'NINGUNA ALERGIA'}
                </span>
              </div>
            </div>

            <div className="bg-white/35 border border-slate-355/60 rounded-xl p-4 flex flex-col justify-between gap-3 shadow-sm">
              <span className="text-[8px] font-mono text-slate-400 tracking-[0.15em] uppercase font-bold">BARCODE INDEX</span>
              <div className="flex flex-col gap-1.5">
                <div className="flex items-end h-7 bg-transparent rounded px-1 py-0.5 gap-[1.5px] w-full">
                  {barcodeLines.map((line, i) => (
                    <div 
                      key={i} 
                      className="bg-[#2c3e50] opacity-85 h-full" 
                      style={{ width: `${line.width}px`, marginRight: `${line.gap}px` }} 
                    />
                  ))}
                </div>
                <div className="text-[7.5px] font-mono text-slate-450 tracking-widest text-center uppercase">
                  ID: {currentPatient.id}
                </div>
              </div>
            </div>
          </div>

          {/* Botón MORE */}
          <div>
            <button
              onClick={() => onOpenExpediente?.(currentPatient)}
              className="h-11 px-8 bg-[#3d6575] hover:bg-[#2c4e5c] text-white font-black tracking-[0.25em] rounded flex items-center gap-3 transition-all duration-300 hover:scale-[1.025] active:scale-[0.98] shadow-sm border-none cursor-pointer focus:outline-none text-[10px]"
            >
              <span>MORE</span>
              <ArrowRight size={13} className="stroke-[3]" />
            </button>
          </div>
        </main>

        {/* ══════════════════════════════════════════
            COLUMNA 3: PANEL DERECHO — AVATAR + SELECTOR
            ══════════════════════════════════════════ */}
        <section className="w-[440px] lg:w-[500px] relative flex overflow-hidden shrink-0" style={{ background: 'rgba(255,255,255,0.22)', backdropFilter: 'blur(30px)', borderLeft: '1px solid rgba(255,255,255,0.6)' }}>
          
          {/* ── DIVISIÓN TRIANGULAR SVG (ocupa toda la sección) ── */}
          <svg
            className="absolute inset-0 w-full h-full"
            viewBox="0 0 500 700"
            preserveAspectRatio="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              {/* Gradiente del triángulo claro (lado del avatar) */}
              <linearGradient id="triGradLight" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#ffffff" stopOpacity="0.95" />
                <stop offset="100%" stopColor="#e8eef3" stopOpacity="0.9" />
              </linearGradient>
              {/* Gradiente del fondo oscuro (lado metálico) */}
              <linearGradient id="triGradDark" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#adbbc6" stopOpacity="1" />
                <stop offset="100%" stopColor="#c5cfd8" stopOpacity="1" />
              </linearGradient>
              {/* Luz central blanca LED del avatar */}
              <radialGradient id="avatarGlow" cx="50%" cy="75%" r="55%">
                <stop offset="0%" stopColor="#ffffff" stopOpacity="0.85" />
                <stop offset="50%" stopColor="#e8f4ff" stopOpacity="0.35" />
                <stop offset="100%" stopColor="#c5cfd8" stopOpacity="0" />
              </radialGradient>
              {/* Borde luminoso del triángulo */}
              <filter id="glowEdge" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur in="SourceGraphic" stdDeviation="3" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>

            {/* Fondo base metálico gris */}
            <rect width="500" height="700" fill="url(#triGradDark)" />

            {/* Triángulo claro luminoso — del ángulo superior-derecho al inferior-izquierdo */}
            {/* Ocupa el lado derecho completo, como en la imagen de Detroit */}
            <polygon
              points="180,0 500,0 500,700 500,700"
              fill="url(#triGradLight)"
            />

            {/* Línea de borde del triángulo (separación luminosa) */}
            <line
              x1="180" y1="0"
              x2="500" y2="700"
              stroke="rgba(255,255,255,0.9)"
              strokeWidth="1.5"
              filter="url(#glowEdge)"
            />
            <line
              x1="180" y1="0"
              x2="500" y2="700"
              stroke="rgba(255,255,255,0.4)"
              strokeWidth="3"
            />

            {/* Halo de luz LED detrás del avatar */}
            <ellipse cx="320" cy="580" rx="180" ry="220" fill="url(#avatarGlow)" />
          </svg>

          {/* ── AVATAR 3D DE PERFIL — pegado al bottom ── */}
          <AnimatePresence mode="wait">
            <motion.div
              key={isFemale ? 'fem' : 'masc'}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
              className="absolute bottom-0 left-0 right-0 flex items-end justify-center pointer-events-none z-10"
              style={{ height: '88%' }}
            >
              <img
                src={isFemale ? '/avatars/avatar-fem.png' : '/avatars/avatar-masc.png'}
                alt={isFemale ? 'Avatar Femenino' : 'Avatar Masculino'}
                className="h-full w-auto object-contain object-bottom select-none"
                style={{
                  filter: 'drop-shadow(0 0 35px rgba(255,255,255,0.85)) drop-shadow(0 0 80px rgba(200,220,240,0.5))',
                  maskImage: 'linear-gradient(to top, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 60%, rgba(0,0,0,0.7) 80%, transparent 100%)',
                  WebkitMaskImage: 'linear-gradient(to top, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 60%, rgba(0,0,0,0.7) 80%, transparent 100%)',
                }}
                draggable={false}
              />
            </motion.div>
          </AnimatePresence>

          {/* ── SELECTOR NUMÉRICO TIPO VIDEOJUEGO (lado derecho) ── */}
          <div className="absolute right-0 top-1/2 -translate-y-1/2 flex flex-col gap-3 z-20 pr-4">
            {MODE_CONFIG.map((cfg, index) => {
              const isModeActive = viewMode === cfg.mode;
              return (
                <div
                  key={cfg.mode}
                  onClick={() => setViewMode(cfg.mode)}
                  className="flex items-center justify-end gap-0 cursor-pointer group"
                  style={{ minWidth: '120px' }}
                >
                  {/* Label del modo (aparece al hover) */}
                  <span
                    className={`text-[8px] font-black tracking-widest uppercase mr-2 transition-all duration-300 whitespace-nowrap ${
                      isModeActive
                        ? 'opacity-100 text-slate-800'
                        : 'opacity-0 group-hover:opacity-70 text-slate-600'
                    }`}
                  >
                    {cfg.label}
                  </span>

                  {/* Franja desvanecida estilo gaming */}
                  <div className="flex items-center relative">
                    {/* Franja de color con desvanecido */}
                    <div
                      className="h-[28px] rounded-l transition-all duration-500 relative overflow-hidden"
                      style={{
                        width: isModeActive ? '64px' : '28px',
                        background: `linear-gradient(to right, ${cfg.colorFrom}${isModeActive ? 'dd' : '55'}, transparent)`,
                        boxShadow: isModeActive ? `0 0 12px ${cfg.glow}, 0 0 4px ${cfg.glow}` : 'none',
                      }}
                    >
                      {/* Textura de líneas dentro de la franja */}
                      {isModeActive && (
                        <div
                          className="absolute inset-0 opacity-25"
                          style={{
                            backgroundImage: 'repeating-linear-gradient(90deg, rgba(255,255,255,0.5) 0px, rgba(255,255,255,0.5) 1px, transparent 1px, transparent 4px)',
                          }}
                        />
                      )}
                    </div>

                    {/* Caja del número */}
                    <div
                      className="w-[36px] h-[36px] flex items-center justify-center font-mono font-black text-[13px] transition-all duration-300 relative overflow-hidden"
                      style={{
                        background: isModeActive
                          ? `linear-gradient(135deg, ${cfg.colorFrom}, ${cfg.colorTo})`
                          : 'rgba(255,255,255,0.15)',
                        color: isModeActive ? '#ffffff' : 'rgba(80,100,120,0.6)',
                        boxShadow: isModeActive
                          ? `0 0 16px ${cfg.glow}, inset 0 1px 0 rgba(255,255,255,0.4)`
                          : 'none',
                        borderLeft: isModeActive ? `2px solid rgba(255,255,255,0.5)` : '1px solid rgba(255,255,255,0.2)',
                      }}
                    >
                      {/* Número grande detrás (estilo videojuego Detroit) */}
                      {!isModeActive && (
                        <span
                          className="absolute text-[32px] font-black opacity-[0.08] pointer-events-none select-none"
                          style={{ color: cfg.colorFrom, transform: 'scale(1.2)' }}
                        >
                          {index + 1}
                        </span>
                      )}
                      <span className="relative z-10">0{index + 1}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* ── NÚMERO DE REFERENCIA ESTILO DETROIT (inferior izquierdo) ── */}
          <div className="absolute bottom-6 left-6 z-20 flex flex-col gap-0.5">
            <span className="text-[8px] font-mono text-slate-500 tracking-[0.2em] uppercase">N°</span>
            <span className="text-[22px] font-black font-mono text-slate-700 leading-none tracking-tight">
              {currentNum}
              <span className="text-[12px] text-slate-400 font-bold">/{totalNum}</span>
            </span>
          </div>

          {/* ── LED de estatus en esquina superior ── */}
          <div className="absolute top-4 left-6 z-20 flex items-center gap-2">
            <div
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: estatusColor.hex, boxShadow: `0 0 8px ${estatusColor.hex}` }}
            />
            <span className="text-[8px] font-mono font-black tracking-[0.2em] text-slate-600 uppercase">
              {estatusColor.name}
            </span>
          </div>

        </section>

      </div>
    </div>
  );
}
