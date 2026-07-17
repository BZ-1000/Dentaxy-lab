import React, { useState, useMemo, useEffect } from 'react';
import { 
  X, ChevronLeft, ChevronRight, Calendar, 
  Phone, ShieldAlert, ArrowRight
} from 'lucide-react';
import { motion } from 'framer-motion';

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
    for (let i = 0; i < 35; i++) {
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
    if (est.includes('urgencia')) return { name: 'CRÍTICO', hex: '#ef4444', text: 'text-red-650' };
    if (est.includes('alta')) return { name: 'ESTABLE', hex: '#10b981', text: 'text-emerald-600' };
    if (est.includes('primera')) return { name: 'CALIBRANDO', hex: '#d97706', text: 'text-amber-700' };
    return { name: 'OPERATIVO', hex: '#0284c7', text: 'text-sky-600' };
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

  // Escuchar teclas de flechas para navegar
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowUp') handlePrev();
      if (e.key === 'ArrowDown') handleNext();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeIndex, patientsList.length]);

  return (
    <div className="w-full h-full bg-gradient-to-br from-[#f0f2f5] to-[#cbd1d9] text-slate-800 flex flex-col font-sans select-none overflow-hidden relative">
      
      {/* ── Brillos de fondo platino ciberóptico ── */}
      <div className="absolute top-[-10%] left-[20%] w-[60%] h-[60%] bg-white rounded-full blur-[120px] pointer-events-none z-0" />
      <div className="absolute bottom-[-10%] right-[10%] w-[50%] h-[50%] bg-sky-200/40 rounded-full blur-[100px] pointer-events-none z-0" />
      
      {/* ── Grid/Rejilla cibernética sutil de fondo ── */}
      <div 
        className="absolute inset-0 opacity-[0.05] pointer-events-none z-0 mix-blend-overlay"
        style={{
          backgroundImage: `
            linear-gradient(to right, #475569 1px, transparent 1px),
            linear-gradient(to bottom, #475569 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px'
        }}
      />

      {/* ────────────────────────────────────────────────────────────────────────
          ENCABEZADO ESTILO DETROIT (PLATINO CLARO CON MENÚ ALINEADO Y FUSIONADO)
          ──────────────────────────────────────────────────────────────────────── */}
      <header className="w-full h-16 bg-white/40 backdrop-blur-md flex items-center justify-between z-10 shrink-0 select-none px-0">
        
        {/* Título de Marca (Alineado al ancho del Sidebar de 320px, con fondo unificado #759bb0 y relieve neomórfico) */}
        <div className="w-[320px] shrink-0 h-full px-6 bg-[#759bb0] border-r border-white/20 flex items-center justify-start gap-3 text-white shadow-[6px_0_24px_-8px_rgba(15,23,42,0.18)] z-20">
          <div className="w-2.5 h-2.5 bg-white rotate-45" />
          <span 
            className="text-[13px] font-black tracking-[0.35em] uppercase"
            style={{ fontFamily: "'Bruno Ace SC', sans-serif" }}
          >
            DENTAXY SYSTEM
          </span>
        </div>

        {/* TABS DE SECCIÓN FUTURISTAS (Alineados con el contenido central a partir de px-12) */}
        <nav className="hidden md:flex flex-1 h-full items-center px-12 gap-10">
          {(['DETROIT', 'CHARACTER', 'WEAPON', 'STORY', 'CONCEPT'] as const).map((tab, idx) => {
            const isTabActive = idx === 1; // "CHARACTER" activo en la referencia
            return (
              <div key={tab} className="relative py-5 cursor-pointer group">
                <span className={`text-[10px] font-black tracking-[0.25em] transition-colors uppercase ${
                  isTabActive ? 'text-slate-900 font-extrabold' : 'text-slate-400 group-hover:text-slate-600'
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

      {/* ────────────────────────────────────────────────────────────────────────
          CUERPO PRINCIPAL (Layout de 3 columnas estilo Detroit)
          ──────────────────────────────────────────────────────────────────────── */}
      <div className="flex-1 flex overflow-hidden z-10 relative">

        {/* ── COLUMNA 1: SIDEBAR IZQUIERDA (Gris-Azul Metálico #759bb0 con división neomórfica) ── */}
        <aside className="w-[320px] bg-[#759bb0] border-r border-white/20 flex flex-col shrink-0 overflow-hidden shadow-[6px_0_24px_-8px_rgba(15,23,42,0.18)] relative z-20">
          
          {/* Título de Lista (Simplificado en un solo párrafo) */}
          <div className="p-6 pb-3 border-b border-white/10 flex items-center justify-between shrink-0 text-white">
            <div>
              <h3 className="text-xs font-black tracking-[0.15em] uppercase">CHARACTER SELECTION</h3>
            </div>
            <div className="px-2 py-0.5 bg-white/10 border border-white/20 rounded text-[9px] font-mono text-white">
              N° {patientsList.length}
            </div>
          </div>

          {/* Lista Vertical de Pacientes (Cuadros más grandes estilo Detroit) */}
          <div className="flex-1 overflow-y-auto px-5 py-4 space-y-7 scrollbar-thin scrollbar-thumb-white/10">
            {patientsList.map((p, idx) => {
              const isSelected = idx === activeIndex;
              const code = `PX-${String(idx + 1).padStart(3, '0')}`;
              
              // Color de LED en miniatura
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
                  {/* Recuadro de selección gigante */}
                  <div className={`w-full h-36 bg-[#59849c]/40 border rounded relative overflow-hidden transition-all duration-350 ${
                    isSelected 
                      ? 'border-cyan-400 shadow-[0_0_15px_rgba(34,211,238,0.25)]' 
                      : 'border-white/10 group-hover:border-white/20'
                  }`}>
                    
                    {/* Busto de Androide en Miniatura */}
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      <svg viewBox="0 0 24 24" className={`w-20 h-20 transition-all duration-350 ${isSelected ? 'text-cyan-200/60 scale-105' : 'text-white/25'}`}>
                        <path 
                          d="M12 2C8.69 2 6 4.69 6 8C6 11.31 8.69 14 12 14C15.31 14 18 11.31 18 8C18 4.69 15.31 2 12 2ZM12 12C9.79 12 8 10.21 8 8C8 5.79 9.79 4 12 4C14.21 4 16 5.79 16 8C16 10.21 14.21 12 12 12ZM12 15C7.33 15 3 17.33 3 20V22H21V20C21 17.33 16.67 15 12 15ZM5 20C5.55 18.79 9.07 17 12 17C14.93 17 18.45 18.79 19 20H5Z" 
                          fill="currentColor"
                        />
                      </svg>
                    </div>

                    {/* CORCHETES AMARILLOS NEÓN DE DETROIT CUANDO SE SELECCIONA */}
                    {isSelected && (
                      <>
                        {/* Esquina superior izquierda */}
                        <div className="absolute top-2 left-2 w-3.5 h-3.5 border-t-2 border-l-2 border-amber-400" />
                        {/* Esquina superior derecha */}
                        <div className="absolute top-2 right-2 w-3.5 h-3.5 border-t-2 border-r-2 border-amber-400" />
                        {/* Esquina inferior izquierda */}
                        <div className="absolute bottom-2 left-2 w-3.5 h-3.5 border-b-2 border-l-2 border-amber-400" />
                        {/* Esquina inferior derecha */}
                        <div className="absolute bottom-2 right-2 w-3.5 h-3.5 border-b-2 border-r-2 border-amber-400" />

                        {/* Línea de escaneo/brillo superior */}
                        <div className="absolute top-0 left-0 right-0 h-[2px] bg-cyan-300 shadow-[0_0_8px_rgba(34,211,238,0.8)]" />
                      </>
                    )}

                    {/* Pequeño LED (Estático, sin parpadeos) */}
                    <div 
                      className="absolute top-2.5 right-2.5 w-1.5 h-1.5 rounded-full" 
                      style={{ 
                        backgroundColor: ledHex 
                      }} 
                    />
                  </div>

                  {/* Texto de Identidad POR FUERA y ABAJO de la Tarjeta */}
                  <div className={`text-[9px] font-mono tracking-[0.25em] mt-2.5 transition-colors uppercase text-left ${
                    isSelected ? 'text-white font-extrabold' : 'text-white/60 group-hover:text-white/90'
                  }`}>
                    {`| ${code} ${p.name}`}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Navegador Inferior con barra blanca al centro */}
          <div className="p-4 border-t border-white/10 bg-[#759bb0] shrink-0 flex items-center justify-between">
            <button
              onClick={handlePrev}
              className="w-10 h-10 rounded-lg hover:bg-white/10 text-white/70 hover:text-white flex items-center justify-center transition border-none cursor-pointer"
            >
              <ChevronLeft size={18} />
            </button>
            
            {/* Caja de selección blanca */}
            <div className="bg-white px-5 py-1.5 rounded flex items-center justify-center font-mono text-[9px] text-[#475b66] font-black tracking-[0.2em] shadow-sm select-none">
              CHARACTER
            </div>

            <button
              onClick={handleNext}
              className="w-10 h-10 rounded-lg hover:bg-white/10 text-white/70 hover:text-white flex items-center justify-center transition border-none cursor-pointer"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </aside>

        {/* ── COLUMNA 2: DETALLES CENTRALES DEL PACIENTE (Fondo Platino Claro de Seed) ── */}
        <main className="flex-1 p-12 flex flex-col justify-between overflow-y-auto text-left relative z-10">
          
          {/* Bloque Superior del Nombre */}
          <div className="space-y-4">
            
            {/* Tag Androide / Categoría (Estático, sin parpadeos) */}
            <div className="flex items-center gap-3">
              <span className="text-[10px] font-mono tracking-[0.3em] text-[#334b57]/50 uppercase font-black">▲ {estatusColor.name}</span>
            </div>

            {/* Nombre Gigante Estilo Detroit */}
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

            {/* Subtítulo o Síntesis médica rápida */}
            <p className="text-sm leading-relaxed text-slate-650 max-w-xl font-semibold">
              Expediente digital seguro encriptado localmente en Dentaxy Lab. Motivo del tratamiento clínico iniciado: <strong>{currentPatient.appProperties?.motivo || 'Ninguno'}</strong>.
            </p>
          </div>

          {/* Grid de Características Clínicas */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 my-6 max-w-xl">
            
            {/* Caja 1: Registro */}
            <div className="bg-white/35 border border-slate-350/60 rounded-xl p-4 flex flex-col justify-between shadow-sm">
              <span className="text-[8px] font-mono text-slate-400 tracking-[0.15em] uppercase font-bold">REGISTRATION DATE</span>
              <div className="flex items-center gap-2 mt-2">
                <Calendar size={14} className="text-sky-650" />
                <span className="text-xs font-black text-slate-800">{formattedDate}</span>
              </div>
            </div>

            {/* Caja 2: Teléfono */}
            <div className="bg-white/35 border border-slate-350/60 rounded-xl p-4 flex flex-col justify-between shadow-sm">
              <span className="text-[8px] font-mono text-slate-400 tracking-[0.15em] uppercase font-bold">COMMUNICATION UNIT</span>
              <div className="flex items-center gap-2 mt-2">
                <Phone size={14} className="text-sky-650" />
                <span className="text-xs font-black text-slate-800">
                  {currentPatient.appProperties?.telefono || 'NO REGISTRADO'}
                </span>
              </div>
            </div>

            {/* Caja 3: Alergias */}
            <div className="bg-white/35 border border-slate-350/60 rounded-xl p-4 flex flex-col justify-between shadow-sm">
              <span className="text-[8px] font-mono text-slate-400 tracking-[0.15em] uppercase font-bold">BIOMETRIC ALERT</span>
              <div className="flex items-center gap-2 mt-2">
                <ShieldAlert size={14} className="text-red-500" />
                <span className="text-xs font-black text-red-500 truncate max-w-xs uppercase">
                  {currentPatient.appProperties?.alergias || 'NINGUNA ALERGIA'}
                </span>
              </div>
            </div>

            {/* Caja 4: Código de Barras (Detroit style, negro sobre fondo transparente) */}
            <div className="bg-white/35 border border-slate-355/60 rounded-xl p-4 flex flex-col justify-between gap-3 shadow-sm">
              <span className="text-[8px] font-mono text-slate-400 tracking-[0.15em] uppercase font-bold">BARCODE INDEX</span>
              <div className="flex flex-col gap-1.5">
                {/* Código de barras CSS */}
                <div className="flex items-end h-7 bg-transparent rounded px-1 py-0.5 gap-[1.5px] w-full">
                  {barcodeLines.map((line, i) => (
                    <div 
                      key={i} 
                      className="bg-[#2c3e50] opacity-85 h-full" 
                      style={{ 
                        width: `${line.width}px`, 
                        marginRight: `${line.gap}px` 
                      }} 
                    />
                  ))}
                </div>
                <div className="text-[7.5px] font-mono text-slate-450 tracking-widest text-center uppercase">
                  ID: {currentPatient.id}
                </div>
              </div>
            </div>
          </div>

          {/* Botón de Entrada Inmersiva al Expediente */}
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

        {/* ── COLUMNA 3: AVATAR 3D DERECHO (Iluminado, Estilo Detroit Platino) ── */}
        <section className="w-[420px] lg:w-[480px] border-l border-slate-300/40 bg-white/20 relative flex overflow-hidden shrink-0">
          
          {/* Fondo iluminado curvado estilo laboratorio Detroit */}
          <div className="absolute right-[-100px] top-[10%] bottom-[10%] w-[380px] bg-sky-200/10 border-l border-white/60 rounded-l-[100%] pointer-events-none" />
          
          {/* Avatar SVG 3D Minimalista y Cibernético en Plata/Gris/Blanco */}
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
                {/* Gradiente de busto plateado metálico */}
                <linearGradient id="bodyGradPlat" x1="150" y1="80" x2="150" y2="350" gradientUnits="userSpaceOnUse">
                  <stop offset="0%" stopColor="#f1f5f9" stopOpacity="0.95" />
                  <stop offset="50%" stopColor="#cbd5e1" stopOpacity="0.9" />
                  <stop offset="100%" stopColor="#94a3b8" stopOpacity="0.95" />
                </linearGradient>
                {/* Brillo de escaneo */}
                <linearGradient id="scanGradPlat" x1="0" y1="0" x2="0" y2="100" gradientUnits="userSpaceOnUse">
                  <stop offset="0%" stopColor="#0ea5e9" stopOpacity="0" />
                  <stop offset="50%" stopColor="#0ea5e9" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#0ea5e9" stopOpacity="0" />
                </linearGradient>
              </defs>

              {/* Busto / Cuerpo de Androide Platino */}
              <motion.path
                d="M 60,330 C 60,260 90,240 105,230 C 110,225 110,210 110,200 L 110,185 C 105,180 98,170 98,155 L 98,135 C 98,135 90,130 90,105 C 90,80 100,60 150,60 C 200,60 210,80 210,105 C 210,130 202,135 202,135 L 202,155 C 202,170 195,180 190,185 L 190,200 C 190,210 190,225 195,230 C 210,240 240,260 240,330 C 240,350 245,380 245,390 L 55,390 C 55,380 60,350 60,330 Z"
                fill="url(#bodyGradPlat)"
                stroke="#94a3b8"
                strokeWidth="1.5"
                animate={{
                  scale: [1, 1.01, 1],
                  y: [0, -3, 0]
                }}
                transition={{
                  duration: 6,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />

              {/* MODO MALLA 3D / BIOMÉTRICO */}
              {(viewMode === 'MESH' || viewMode === 'BIOMETRIC') && (
                <g opacity="0.45">
                  {/* Líneas horizontales de escaneo contour */}
                  <path d="M 98,90 Q 150,110 202,90" stroke="#0ea5e9" strokeWidth="1" />
                  <path d="M 90,110 Q 150,135 210,110" stroke="#0ea5e9" strokeWidth="1" />
                  <path d="M 98,140 Q 150,165 202,140" stroke="#0ea5e9" strokeWidth="1" />
                  <path d="M 110,195 Q 150,210 190,195" stroke="#0ea5e9" strokeWidth="1" />
                  <path d="M 95,245 Q 150,270 205,245" stroke="#0ea5e9" strokeWidth="1" />
                  <path d="M 75,285 Q 150,320 225,285" stroke="#0ea5e9" strokeWidth="1" />
                  <path d="M 62,325 Q 150,370 238,325" stroke="#0ea5e9" strokeWidth="1" />

                  {/* Eje central vertical */}
                  <line x1="150" y1="60" x2="150" y2="390" stroke="#0ea5e9" strokeWidth="0.5" strokeDasharray="3 3" />
                </g>
              )}

              {/* MODO BIOMÉTRICO (Nodos estáticos, sin parpadeos) */}
              {viewMode === 'BIOMETRIC' && (
                <g>
                  {/* Puntos de referencia facial */}
                  <circle cx="150" cy="115" r="2.5" fill="#0284c7" />
                  
                  <circle cx="125" cy="100" r="1.5" fill="#0284c7" />
                  <circle cx="175" cy="100" r="1.5" fill="#0284c7" />
                  
                  <circle cx="120" cy="125" r="1.5" fill="#0284c7" />
                  <circle cx="180" cy="125" r="1.5" fill="#0284c7" />

                  <circle cx="150" cy="145" r="1.5" fill="#0284c7" />
                  
                  {/* Vectores / Conexiones */}
                  <line x1="125" y1="100" x2="150" y2="115" stroke="#0ea5e9" strokeWidth="0.5" opacity="0.4" />
                  <line x1="175" y1="100" x2="150" y2="115" stroke="#0ea5e9" strokeWidth="0.5" opacity="0.4" />
                  <line x1="120" y1="125" x2="150" y2="115" stroke="#0ea5e9" strokeWidth="0.5" opacity="0.4" />
                  <line x1="180" y1="125" x2="150" y2="115" stroke="#0ea5e9" strokeWidth="0.5" opacity="0.4" />
                  <line x1="150" y1="145" x2="150" y2="115" stroke="#0ea5e9" strokeWidth="0.5" opacity="0.4" />
                </g>
              )}

              {/* MODO DIAGNÓSTICO */}
              {viewMode === 'DIAGNOSIS' && (
                <g>
                  {/* Línea horizontal de escáner */}
                  <motion.rect
                    x="50"
                    y="50"
                    width="200"
                    height="10"
                    fill="url(#scanGradPlat)"
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
                  <circle cx="150" cy="180" r="60" stroke="#0ea5e9" strokeWidth="0.5" strokeDasharray="5 5" opacity="0.3" />
                  <circle cx="150" cy="180" r="90" stroke="#0ea5e9" strokeWidth="0.5" strokeDasharray="3 7" opacity="0.15" />
                </g>
              )}

              {/* MODO HISTORY */}
              {viewMode === 'HISTORY' && (
                <g opacity="0.8">
                  {/* Nodos de timeline a la izquierda */}
                  <line x1="60" y1="120" x2="30" y2="120" stroke="#0ea5e9" strokeWidth="1" />
                  <circle cx="30" cy="120" r="2" fill="#0284c7" />
                  <text x="20" y="115" fill="#0284c7" fontSize="7.5" fontFamily="monospace" textAnchor="end" fontWeight="bold">INGRESADO</text>

                  <line x1="65" y1="220" x2="25" y2="220" stroke="#0ea5e9" strokeWidth="1" />
                  <circle cx="25" cy="220" r="2" fill="#0284c7" />
                  <text x="15" y="215" fill="#0284c7" fontSize="7.5" fontFamily="monospace" textAnchor="end" fontWeight="bold">DIAGNÓSTICO</text>

                  <line x1="80" y1="310" x2="40" y2="310" stroke="#0ea5e9" strokeWidth="1" />
                  <circle cx="40" cy="310" r="2" fill="#0284c7" />
                  <text x="30" y="305" fill="#0284c7" fontSize="7.5" fontFamily="monospace" textAnchor="end" fontWeight="bold">TRATAMIENTO</text>
                </g>
              )}

              {/* ANILLO LED ANDROIDE DETROIT EN LA SIEN DERECHA (Estático, sin parpadeos) */}
              <g>
                <circle 
                  cx="194" 
                  cy="98" 
                  r="6" 
                  stroke={estatusColor.hex} 
                  strokeWidth="2.5" 
                  opacity="0.35" 
                />
                <circle 
                  cx="194" 
                  cy="98" 
                  r="6" 
                  stroke={estatusColor.hex} 
                  strokeWidth="1.5" 
                  opacity="0.8"
                />
              </g>
            </svg>
          </div>

          {/* MENÚ DE MODOS LATERAL DERECHO (Pestañas verticales 01-04 con relieve neomórfico) */}
          <div className="absolute right-6 top-1/2 -translate-y-1/2 flex flex-col gap-5 z-20">
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
                  <span className={`text-[8.5px] font-black tracking-widest transition-all duration-300 opacity-0 group-hover:opacity-100 ${
                    isModeActive ? 'text-slate-900 translate-x-0' : 'text-[#334b57]/40 -translate-x-2'
                  }`}>
                    {label}
                  </span>
                  
                  {/* Selector Numérico Neomórfico */}
                  <div className={`w-9 h-9 rounded-xl font-mono text-[11px] font-extrabold transition-all duration-300 flex items-center justify-center ${
                    isModeActive 
                      ? 'bg-[#0ea5e9] text-white shadow-[inset_2px_2px_5px_rgba(0,0,0,0.25),inset_-2px_-2px_5px_rgba(255,255,255,0.35),0_0_12px_rgba(14,165,233,0.35)]' 
                      : 'bg-[#e0e7ec] text-slate-500 shadow-[3px_3px_7px_rgba(165,180,190,0.7),-3px_-3px_7px_rgba(255,255,255,0.9)] hover:text-slate-800'
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
