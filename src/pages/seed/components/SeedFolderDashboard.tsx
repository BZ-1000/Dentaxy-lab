import React, { useState, useEffect } from 'react';
import { 
  X, 
  ChevronLeft, 
  ChevronRight, 
  Settings, 
  Bell, 
  Search, 
  Mail, 
  FolderOpen,
  Smartphone,
  Copy,
  Check,
  HardDrive,
  Maximize2,
  Minimize2,
  FileText,
  Sparkles,
  Eye,
  Camera,
  Activity,
  ClipboardList
} from 'lucide-react';
import Odontograma from '@/components/historia-clinica/Odontograma';
import { AppleTypewriter } from '@/components/ui/AppleTypewriter';
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
    status?: string;
  };
}

interface SeedFolderDashboardProps {
  patientsList: PatientData[];
  initialActiveIndex: number;
  clinicId: string;
  theme?: 'dark' | 'light';
  onClose: () => void;
}

export default function SeedFolderDashboard({ 
  patientsList = [], 
  initialActiveIndex = 0,
  clinicId,
  theme = 'dark',
  onClose 
}: SeedFolderDashboardProps) {
  const [activeIndex, setActiveIndex] = useState(initialActiveIndex);
  const [copied, setCopied] = useState(false);
  const [notes, setNotes] = useState<string>('');
  
  // Estado para la tarjeta expandida (Modo Foco)
  const [expandedCard, setExpandedCard] = useState<string | null>(null);

  const isDark = theme === 'dark';

  // Estilos reactivos al tema (Claro / Oscuro)
  const containerClass = isDark ? "bg-[#0c0b0e] text-white" : "bg-[#f8f9fa] text-slate-800";
  const sidebarClass = isDark ? "bg-[#131215]/50 border-white/5" : "bg-white/60 border-slate-200/50";
  const cardClass = isDark ? "bg-[#121115]/80 border-white/5" : "bg-white/80 border-slate-200/50 shadow-md backdrop-blur-xl";
  const textTitleClass = isDark ? "text-white" : "text-slate-800";
  const textMutedClass = isDark ? "text-zinc-400" : "text-slate-500";
  const bgBadgeClass = isDark ? "bg-white/5 border-white/10 text-zinc-300" : "bg-slate-100 border-slate-200 text-slate-600";
  const borderClass = isDark ? "border-white/5" : "border-slate-200/60";
  const widgetBgClass = isDark ? "bg-zinc-950/20" : "bg-slate-50/50";
  const pillClass = isDark ? "bg-white/5 border-white/10" : "bg-white border-slate-200 shadow-sm";

  // Asegurar que el índice esté dentro del rango
  const currentPatient = patientsList[activeIndex] || {
    id: 'DEMO-100',
    name: 'Paciente Demo',
    appProperties: {
      motivo: 'Valoración inicial',
      alergias: 'Ninguna conocida',
      telefono: '55 1234 5678',
      correo: 'paciente.demo@dentaxy.com'
    }
  };

  const hasIntakeCompleted = !!currentPatient.appProperties?.motivo;

  // Cargar notas desde localStorage según el paciente actual
  useEffect(() => {
    const savedNotes = localStorage.getItem(`seed-notes-${currentPatient.id}`);
    setNotes(savedNotes || '');
  }, [currentPatient.id]);

  const handleSaveNotes = (val: string) => {
    setNotes(val);
    localStorage.setItem(`seed-notes-${currentPatient.id}`, val);
  };

  const handleNextPatient = () => {
    if (patientsList.length > 0) {
      setActiveIndex((prev) => (prev + 1) % patientsList.length);
    }
  };

  const handlePrevPatient = () => {
    if (patientsList.length > 0) {
      setActiveIndex((prev) => (prev - 1 + patientsList.length) % patientsList.length);
    }
  };

  const linkUrl = `${window.location.origin}/x/${clinicId}`;
  
  // Colores del QR según el tema
  const qrColor = isDark ? 'ffffff' : '0f172a';
  const qrBgColor = isDark ? '0e0d0f' : 'ffffff';
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(linkUrl)}&color=${qrColor}&bgcolor=${qrBgColor}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(linkUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Mapeo de tarjetas disponibles para el dashboard
  const cardsInfo = [
    { id: 'portrait', label: 'Expediente Físico', icon: <FolderOpen size={16} /> },
    { id: 'odontograma', label: 'Odontograma FDI', icon: <Activity size={16} /> },
    { id: 'radiografias', label: 'Galería Lumínica', icon: <Camera size={16} /> },
    { id: 'lobby', label: 'Lobby Digital (QR)', icon: <Smartphone size={16} /> },
    { id: 'documento', label: 'Historial Clínico IA', icon: <FileText size={16} /> },
    { id: 'notas', label: 'Notas SOAP', icon: <ClipboardList size={16} /> }
  ];

  // Renderizados individuales de los componentes (reutilizados en vista normal y expandida)
  
  const renderPatientPortrait = (isExpanded: boolean) => (
    <div className={`w-full border rounded-[28px] p-5 relative overflow-hidden flex flex-col justify-between shadow-lg transition-all duration-500 h-full ${
      isDark ? 'bg-gradient-to-br from-[#1b1a1f] to-[#121115] border-white/5' : 'bg-gradient-to-br from-white to-slate-100 border-slate-200'
    }`}>
      <div className="absolute inset-0 z-0">
        <img 
          src={`https://images.unsplash.com/photo-${activeIndex % 2 === 0 ? '1534528741775-53994a69daeb' : '1506794778202-cad84cf45f1d'}?auto=format&fit=crop&w=800&q=80`}
          alt={currentPatient.name}
          className="w-full h-full object-cover opacity-35 mix-blend-luminosity scale-105"
        />
        <div className={`absolute inset-0 transition-all duration-500 ${
          isDark ? 'bg-gradient-to-t from-[#0e0d0f] via-transparent to-black/40' : 'bg-gradient-to-t from-white/95 via-transparent to-slate-100/10'
        }`}></div>
      </div>

      <div className="relative z-10 flex items-start justify-between">
        <div>
          <span className="text-[9px] font-bold text-amber-500 uppercase tracking-widest">
            Consultorio Activo
          </span>
          <h2 className={`text-xl font-black mt-1 leading-none tracking-tight ${textTitleClass}`}>
            Expediente Clínico
          </h2>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={(e) => {
              e.stopPropagation();
              setExpandedCard(isExpanded ? null : 'portrait');
            }}
            className="p-1 rounded-md hover:bg-white/10 text-zinc-400 hover:text-white transition-colors"
          >
            {isExpanded ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
          </button>
          <div className={`px-2.5 py-1 rounded-lg border text-[9px] font-bold ${bgBadgeClass}`}>
            ID: {currentPatient.id}
          </div>
        </div>
      </div>

      <div className={`relative z-10 w-full mt-auto border rounded-xl p-3 backdrop-blur-md shadow-md transition-all duration-500 ${
        isDark ? 'bg-white/5 border-white/10' : 'bg-white/80 border-slate-200/80'
      }`}>
        <div className="flex-1 grid grid-cols-2 sm:grid-cols-4 gap-3 divide-x divide-neutral-200/10 dark:divide-white/5 text-left">
          <div className="pl-0">
            <span className={`text-[8px] font-bold uppercase tracking-wider block mb-0.5 ${textMutedClass}`}>Motivo</span>
            <span className={`text-[11px] font-bold truncate block ${textTitleClass}`}>
              {currentPatient.appProperties?.motivo || 'Ninguno'}
            </span>
          </div>
          <div className="pl-3">
            <span className={`text-[8px] font-bold uppercase tracking-wider block mb-0.5 ${textMutedClass}`}>Alergias</span>
            <span className="text-[11px] font-bold text-red-500 truncate block">
              {currentPatient.appProperties?.alergias || 'Ninguna'}
            </span>
          </div>
          <div className="pl-3">
            <span className={`text-[8px] font-bold uppercase tracking-wider block mb-0.5 ${textMutedClass}`}>Teléfono</span>
            <span className={`text-[11px] font-bold truncate block ${textTitleClass}`}>
              {currentPatient.appProperties?.telefono || 'No registrado'}
            </span>
          </div>
          <div className="pl-3">
            <span className={`text-[8px] font-bold uppercase tracking-wider block mb-0.5 ${textMutedClass}`}>Estatus</span>
            <span className="text-[9px] font-bold text-emerald-500 bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20 inline-block w-fit">
              ACTIVO
            </span>
          </div>
        </div>
      </div>
    </div>
  );

  const renderOdontograma = (isExpanded: boolean) => (
    <div className={`rounded-[24px] p-4 shadow-md flex flex-col gap-2 border overflow-hidden transition-all duration-500 h-full ${cardClass}`}>
      <div className="flex items-center justify-between shrink-0">
        <h3 className={`text-xs font-bold tracking-wide ${textTitleClass}`}>
          Odontograma FDI
        </h3>
        <div className="flex items-center gap-2">
          <button 
            onClick={(e) => {
              e.stopPropagation();
              setExpandedCard(isExpanded ? null : 'odontograma');
            }}
            className="p-1 rounded-md hover:bg-white/10 text-zinc-400 hover:text-white transition-colors"
          >
            {isExpanded ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
          </button>
          <span className={`text-[8px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${bgBadgeClass}`}>
            Voz e Interactivo
          </span>
        </div>
      </div>
      <div className={`flex-1 flex items-center justify-center rounded-xl border p-1 overflow-hidden ${widgetBgClass} ${borderClass}`}>
        <div className={`${isExpanded ? 'scale-[0.95]' : 'scale-[0.70]'} origin-center w-full transition-transform duration-300`}>
          <Odontograma handleOdontogramaChange={() => {}} />
        </div>
      </div>
    </div>
  );

  const renderRadiografias = (isExpanded: boolean) => (
    <div className={`rounded-[24px] p-4 shadow-md flex flex-col gap-3 border overflow-hidden transition-all duration-500 h-full ${cardClass}`}>
      <div className="flex items-center justify-between shrink-0">
        <h3 className={`text-xs font-bold tracking-wide ${textTitleClass}`}>
          Galería Lumínica (Radiografías SOAP)
        </h3>
        <button 
          onClick={(e) => {
            e.stopPropagation();
            setExpandedCard(isExpanded ? null : 'radiografias');
          }}
          className="p-1 rounded-md hover:bg-white/10 text-zinc-400 hover:text-white transition-colors"
        >
          {isExpanded ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
        </button>
      </div>
      
      <div className={`grid gap-2 flex-1 items-center ${isExpanded ? 'grid-cols-3' : 'grid-cols-3'}`}>
        {[
          { img: 'https://images.unsplash.com/photo-1579684389782-64d84b5e901a?auto=format&fit=crop&w=200&q=80', tag: 'Periapical' },
          { img: 'https://images.unsplash.com/photo-1581594693702-fbdc51b2763b?auto=format&fit=crop&w=200&q=80', tag: 'Oclusión' },
          { img: 'https://images.unsplash.com/photo-1579684469777-628d325785f0?auto=format&fit=crop&w=200&q=80', tag: 'Panorámica' }
        ].map((item, index) => (
          <div key={index} className={`relative group rounded-lg overflow-hidden border aspect-video cursor-zoom-in ${borderClass}`}>
            <img 
              src={item.img} 
              alt={item.tag} 
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-125"
            />
            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center p-1">
              <span className="text-[8px] font-bold text-white tracking-wider uppercase">{item.tag}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderLobby = (isExpanded: boolean) => (
    <div className={`rounded-[24px] p-4 shadow-md flex flex-col gap-3 border overflow-hidden transition-all duration-500 h-full ${cardClass}`}>
      <div className="flex items-center justify-between shrink-0">
        <h3 className={`text-xs font-bold tracking-wide ${textTitleClass}`}>
          Lobby Digital
        </h3>
        <div className="flex items-center gap-2">
          <button 
            onClick={(e) => {
              e.stopPropagation();
              setExpandedCard(isExpanded ? null : 'lobby');
            }}
            className="p-1 rounded-md hover:bg-white/10 text-zinc-400 hover:text-white transition-colors"
          >
            {isExpanded ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
          </button>
          <div className="flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="text-[8px] font-bold text-emerald-500 uppercase tracking-widest">Activo</span>
          </div>
        </div>
      </div>

      <div className="flex-1 flex flex-col justify-center gap-2 overflow-hidden">
        {!hasIntakeCompleted ? (
          <div className={`flex items-center gap-3 p-2 rounded-xl border ${widgetBgClass} ${borderClass} h-full`}>
            <div className="bg-white p-1 rounded-lg shrink-0">
              <img src={qrUrl} alt="Pendiente" className="w-14 h-14" />
            </div>
            <div className="text-left">
              <p className="text-[9px] font-bold text-amber-500 uppercase tracking-wider leading-none">Apertura Pendiente</p>
              <p className={`text-[8px] mt-0.5 leading-tight ${textMutedClass}`}>Escanee el QR para abrir expediente</p>
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-1.5">
            <div className={`w-full flex items-center justify-between border rounded-lg p-1 pl-2 text-[9px] ${
              isDark ? 'bg-white/5 border-white/5' : 'bg-slate-50 border-slate-200/80 shadow-inner'
            }`}>
              <span className={`font-mono truncate mr-2 ${textMutedClass}`}>
                {linkUrl}
              </span>
              <button
                onClick={handleCopy}
                className={`flex items-center gap-1 px-2 py-0.5 rounded border text-[8px] font-bold transition-all duration-200 cursor-pointer shrink-0 ${
                  isDark ? 'bg-white/5 border-white/10 text-white hover:bg-white/10' : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100 shadow-sm'
                }`}
              >
                {copied ? <Check size={9} className="text-emerald-500" /> : <Copy size={9} />}
                <span>{copied ? 'Copiado' : 'Copiar'}</span>
              </button>
            </div>
            
            <div className="p-1.5 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex items-center justify-between gap-2">
              <span className={`text-[9px] font-semibold truncate ${isDark ? 'text-white' : 'text-slate-700'}`}>Alejandro en Lobby.</span>
              <button className="px-2 py-1 bg-emerald-500 hover:bg-emerald-400 text-white font-bold text-[8px] rounded-lg transition-all shadow-md cursor-pointer">
                Acceso
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  const renderDocumento = (isExpanded: boolean) => (
    <div className={`rounded-[24px] p-4 shadow-md flex flex-col gap-2 border overflow-hidden transition-all duration-500 h-full ${cardClass}`}>
      <div className="flex items-center justify-between shrink-0">
        <h3 className={`text-xs font-bold tracking-wide ${textTitleClass}`}>
          Historial Clínico (IA Dex)
        </h3>
        <div className="flex items-center gap-2">
          <button 
            onClick={(e) => {
              e.stopPropagation();
              setExpandedCard(isExpanded ? null : 'documento');
            }}
            className="p-1 rounded-md hover:bg-white/10 text-zinc-400 hover:text-white transition-colors"
          >
            {isExpanded ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
          </button>
          <span className="text-[8px] font-bold text-emerald-500 uppercase tracking-widest bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20">
            Redactando...
          </span>
        </div>
      </div>

      <div className={`flex-1 rounded-xl border p-3 overflow-y-auto text-left relative z-10 scrollbar-thin ${
        isDark ? 'bg-zinc-950/40 border-white/5 text-zinc-300' : 'bg-slate-50 border-slate-200 text-slate-700'
      }`}>
        <div className="font-mono text-[10px] space-y-1 leading-relaxed">
          <AppleTypewriter 
            text={`HISTORIAL CLÍNICO - DENTAXY INC.\nFECHA: ${new Date().toLocaleDateString()}\nPACIENTE: ${currentPatient.name}\n\n[PADECIMIENTO ACTUAL]: El paciente acude a consulta por dolor dental localizado en órgano 46. Reporta sensibilidad incrementada al frío y calor.\n\n[EXPLORACIÓN CLÍNICA]: Se detecta lesión de caries profunda en cara oclusal del 46. Requiere tratamiento restaurativo inmediato.`}
            speed={25}
          />
        </div>
      </div>
    </div>
  );

  const renderNotas = (isExpanded: boolean) => (
    <div className={`rounded-[24px] p-4 shadow-md flex flex-col gap-2 border overflow-hidden transition-all duration-500 h-full ${cardClass}`}>
      <div className="flex items-center justify-between shrink-0">
        <h3 className={`text-xs font-bold tracking-wide ${textTitleClass}`}>
          Notas de Evolución (SOAP)
        </h3>
        <button 
          onClick={(e) => {
            e.stopPropagation();
            setExpandedCard(isExpanded ? null : 'notas');
          }}
          className="p-1 rounded-md hover:bg-white/10 text-zinc-400 hover:text-white transition-colors"
        >
          {isExpanded ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
        </button>
      </div>
      <textarea
        value={notes}
        onChange={(e) => handleSaveNotes(e.target.value)}
        placeholder="Escribe la evolución clínica de hoy..."
        className={`w-full flex-1 rounded-xl p-2.5 text-[11px] outline-none transition-all font-sans resize-none border ${
          isDark ? 'bg-zinc-950/30 border-white/5 text-zinc-300 placeholder-zinc-500 focus:border-white/10' : 'bg-slate-50 border-slate-200 text-slate-700 placeholder-slate-400 focus:border-slate-300'
        }`}
      />
    </div>
  );

  const renderActiveCard = () => {
    switch (expandedCard) {
      case 'portrait': return renderPatientPortrait(true);
      case 'odontograma': return renderOdontograma(true);
      case 'radiografias': return renderRadiografias(true);
      case 'lobby': return renderLobby(true);
      case 'documento': return renderDocumento(true);
      case 'notas': return renderNotas(true);
      default: return null;
    }
  };

  return (
    <div className={`fixed inset-0 z-[250] flex overflow-hidden font-sans transition-colors duration-500 ${containerClass}`}>
      
      {/* ── Orbes de luz ambientales en el fondo ── */}
      <div className={`absolute top-[-10%] left-[-10%] w-[600px] h-[600px] rounded-full blur-[140px] pointer-events-none z-0 transition-opacity duration-500 ${
        isDark ? 'opacity-40 bg-gradient-to-tr from-amber-500/20 to-purple-600/20' : 'opacity-25 bg-gradient-to-tr from-amber-400/10 to-purple-500/10'
      }`}></div>
      <div className={`absolute bottom-[-10%] right-[-10%] w-[650px] h-[650px] rounded-full blur-[150px] pointer-events-none z-0 transition-opacity duration-500 ${
        isDark ? 'opacity-35 bg-gradient-to-br from-purple-500/20 to-emerald-600/20' : 'opacity-25 bg-gradient-to-br from-purple-400/10 to-emerald-500/10'
      }`}></div>

      {/* ── Barra Lateral Izquierda (Aesthetics de la Imagen) ── */}
      <div className={`w-20 flex flex-col items-center justify-between py-6 relative z-10 backdrop-blur-md shrink-0 border-r transition-colors duration-500 ${sidebarClass}`}>
        <div className="flex flex-col items-center gap-6">
          {/* Logo Premium */}
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-purple-600 to-amber-500 flex items-center justify-center shadow-lg shadow-purple-600/20 cursor-pointer">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-white">
              <path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
              <path d="M3 3v5h5" />
              <path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16" />
              <path d="M16 16h5v5" />
            </svg>
          </div>

          <div className={`w-8 h-[1px] my-2 ${isDark ? 'bg-white/10' : 'bg-slate-200'}`}></div>

          {/* Iconos de Navegación del Panel */}
          {[
            { icon: <FolderOpen size={18} />, active: true },
            { icon: <Settings size={18} />, active: false },
            { icon: <Bell size={18} />, active: false },
          ].map((item, idx) => (
            <button
              key={idx}
              className={`w-11 h-11 rounded-xl flex items-center justify-center transition-all ${
                item.active 
                  ? (isDark ? 'bg-white/10 text-white border border-white/10' : 'bg-slate-100 text-slate-800 border border-slate-200/80 shadow-sm') 
                  : (isDark ? 'text-zinc-500 hover:text-zinc-300 hover:bg-white/5' : 'text-slate-400 hover:text-slate-600 hover:bg-slate-100/50')
              }`}
            >
              {item.icon}
            </button>
          ))}
        </div>

        {/* Botón de Salida */}
        <button 
          onClick={onClose}
          className="w-11 h-11 rounded-xl bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-500 hover:text-red-300 flex items-center justify-center transition-all cursor-pointer"
          title="Regresar a carpetas"
        >
          <X size={18} />
        </button>
      </div>

      {/* ── Contenedor de la derecha (Header + Layout de Módulos) ── */}
      <div className="flex-1 flex flex-col overflow-hidden relative z-10 px-6 py-4">
        
        {/* ── Top Header ── */}
        <header className="w-full flex items-center justify-between mb-4 shrink-0">
          <div className="flex items-center gap-4">
            <h1 className={`text-2xl font-bold tracking-tight flex items-center gap-3 ${textTitleClass}`}>
              <span>{currentPatient.name}</span>
            </h1>

            {/* Burbuja Glassmorphic de Navegación Rápida */}
            <div className={`flex items-center gap-1.5 px-2.5 py-0.5 rounded-full backdrop-blur-xl border transition-colors duration-500 ${pillClass}`}>
              <button 
                onClick={handlePrevPatient}
                className={`p-1 rounded-full active:scale-90 transition-all cursor-pointer ${
                  isDark ? 'text-zinc-400 hover:text-white hover:bg-white/5' : 'text-slate-500 hover:text-slate-850 hover:bg-slate-100'
                }`}
                title="Paciente anterior"
              >
                <ChevronLeft size={14} />
              </button>
              <span className="text-[9px] font-bold text-emerald-500 uppercase tracking-widest px-1">
                Expediente {activeIndex + 1}/{patientsList.length || 1}
              </span>
              <button 
                onClick={handleNextPatient}
                className={`p-1 rounded-full active:scale-90 transition-all cursor-pointer ${
                  isDark ? 'text-zinc-400 hover:text-white hover:bg-white/5' : 'text-slate-500 hover:text-slate-850 hover:bg-slate-100'
                }`}
                title="Siguiente paciente"
              >
                <ChevronRight size={14} />
              </button>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Buscador Rápido de Expedientes */}
            <div className={`w-9 h-9 rounded-full flex items-center justify-center cursor-pointer transition ${
              isDark ? 'bg-white/5 border border-white/5 text-zinc-400 hover:text-white hover:bg-white/10' : 'bg-white border border-slate-200 text-slate-500 hover:text-slate-850 hover:bg-slate-50 shadow-sm'
            }`}>
              <Search size={14} />
            </div>
            {/* Correo */}
            <div className={`w-9 h-9 rounded-full flex items-center justify-center cursor-pointer transition ${
              isDark ? 'bg-white/5 border border-white/5 text-zinc-400 hover:text-white hover:bg-white/10' : 'bg-white border border-slate-200 text-slate-500 hover:text-slate-850 hover:bg-slate-50 shadow-sm'
            }`}>
              <Mail size={14} />
            </div>
          </div>
        </header>

        {/* ── Grid Principal de Módulos (Adaptativo a Modo Foco / Expansión) ── */}
        <AnimatePresence mode="wait">
          {expandedCard ? (
            /* ──── Vista de Foco / Expansión (Framer Motion) ──── */
            <motion.div 
              key="focused-layout"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.25 }}
              className="flex-1 grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-6 select-none h-[calc(100vh-100px)] max-h-[calc(100vh-100px)] overflow-hidden pb-2"
            >
              {/* Tarjeta Enfoque Principal (A la izquierda) */}
              <div className="h-full relative overflow-hidden flex flex-col justify-center pb-2">
                {renderActiveCard()}
              </div>

              {/* Barra Derecha con las demás tarjetas en formato miniatura interactivas */}
              <div className="h-full overflow-y-auto pr-1 flex flex-col gap-3 pb-4">
                <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block mb-1">
                  Módulos Rápidos
                </span>
                
                {cardsInfo
                  .filter(c => c.id !== expandedCard)
                  .map(card => (
                    <button
                      key={card.id}
                      onClick={() => setExpandedCard(card.id)}
                      className={`w-full p-3 rounded-2xl border text-left flex items-center justify-between transition-all hover:scale-[1.02] cursor-pointer shadow-sm group ${
                        isDark 
                          ? 'bg-[#121115]/50 border-white/5 hover:bg-[#1c1b1f] text-zinc-300 hover:text-white' 
                          : 'bg-white border-slate-200 hover:bg-slate-50 text-slate-650 hover:text-slate-850'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                          isDark ? 'bg-white/5' : 'bg-slate-100'
                        }`}>
                          {card.icon}
                        </div>
                        <div>
                          <h4 className="text-xs font-bold">{card.label}</h4>
                          <p className="text-[9px] text-zinc-500">Hacer clic para expandir</p>
                        </div>
                      </div>
                      <Eye size={12} className="text-zinc-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </button>
                  ))}

                {/* Acceso a Google Drive siempre visible como utilidad */}
                <a 
                  href="https://drive.google.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`w-full p-3 rounded-2xl border text-left flex items-center justify-between transition-all hover:scale-[1.02] cursor-pointer shadow-sm group ${
                    isDark 
                      ? 'bg-[#121115]/50 border-white/5 hover:bg-[#1c1b1f] text-zinc-300' 
                      : 'bg-white border-slate-200 hover:bg-slate-50 text-slate-650'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                      isDark ? 'bg-white/5' : 'bg-slate-100'
                    }`}>
                      <HardDrive size={15} />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold">Búnker Drive</h4>
                      <p className="text-[9px] text-zinc-500">Google Drive Zero-Storage</p>
                    </div>
                  </div>
                </a>
              </div>
            </motion.div>
          ) : (
            /* ──── Vista de Rejilla Normal (Compacta) ──── */
            <motion.div 
              key="grid-layout"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.25 }}
              className="flex-1 grid grid-cols-1 lg:grid-cols-[1.2fr_1.1fr_0.9fr] gap-4 select-none h-[calc(100vh-100px)] max-h-[calc(100vh-100px)] overflow-hidden pb-2"
            >
              {/* ════ Columna 1: Tarjeta Central del Paciente ════ */}
              <div className="flex flex-col h-full overflow-hidden pb-1 cursor-pointer" onClick={() => setExpandedCard('portrait')}>
                {renderPatientPortrait(false)}
              </div>

              {/* ════ Columna 2: Odontograma & Radiografías ════ */}
              <div className="flex flex-col gap-4 h-full overflow-hidden pb-1">
                {/* Tarjeta del Odontograma (Alto: 58%) */}
                <div className="h-[58%] cursor-pointer" onClick={() => setExpandedCard('odontograma')}>
                  {renderOdontograma(false)}
                </div>

                {/* Tarjeta de Galería Lumínica (Alto: 38%) */}
                <div className="h-[38%] cursor-pointer" onClick={() => setExpandedCard('radiografias')}>
                  {renderRadiografias(false)}
                </div>
              </div>

              {/* ════ Columna 3: Documento vivo, Lobby y Google Drive ════ */}
              <div className="flex flex-col gap-4 h-full overflow-hidden pb-1 animate-in fade-in">
                {/* Lobby Digital (Alto: 28%) */}
                <div className="h-[28%] cursor-pointer" onClick={() => setExpandedCard('lobby')}>
                  {renderLobby(false)}
                </div>

                {/* Documento Vivo (Alto: 34%) */}
                <div className="h-[34%] cursor-pointer" onClick={() => setExpandedCard('documento')}>
                  {renderDocumento(false)}
                </div>

                {/* Notas de Evolución + Búnker Drive (Alto: 34%) */}
                <div className="h-[34%] flex flex-col gap-3 overflow-hidden">
                  {/* Bloque de Notas SOAP */}
                  <div className="flex-1 cursor-pointer" onClick={() => setExpandedCard('notas')}>
                    {renderNotas(false)}
                  </div>

                  {/* Acceso a Drive */}
                  <a 
                    href="https://drive.google.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`rounded-2xl p-3 flex items-center justify-between border transition-all duration-300 cursor-pointer group shadow-sm shrink-0 ${
                      isDark ? 'bg-[#121115]/80 hover:bg-[#1c1b1f]/90 border-white/5' : 'bg-white hover:bg-slate-50 border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${
                        isDark ? 'bg-white/5 text-zinc-400 group-hover:text-white' : 'bg-slate-50 text-slate-500 group-hover:text-slate-800'
                      }`}>
                        <HardDrive size={15} />
                      </div>
                      <div className="text-left">
                        <h4 className={`text-[11px] font-bold ${isDark ? 'text-white' : 'text-slate-700'}`}>Búnker Soberano</h4>
                        <p className="text-[9px] text-zinc-500">Google Drive Zero-Storage</p>
                      </div>
                    </div>
                    <ChevronRight size={12} className="text-zinc-500 group-hover:text-zinc-850 transition-colors" />
                  </a>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>

    </div>
  );
}
