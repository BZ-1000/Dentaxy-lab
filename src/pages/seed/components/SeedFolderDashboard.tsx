import React, { useState, useEffect, useRef, useCallback } from 'react';
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
  ClipboardList,
  Upload,
  ScanLine,
  User,
  ImagePlus
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
    { id: 'radiografias', label: 'Gabinete Clínico', icon: <Camera size={16} /> },
    { id: 'lobby', label: 'Lobby Digital (QR)', icon: <Smartphone size={16} /> },
    { id: 'documento', label: 'Historial Clínico IA', icon: <FileText size={16} /> },
    { id: 'notas', label: 'Evolución / Hitos', icon: <ClipboardList size={16} /> },
    { id: 'cobros', label: 'Cobros & Firmas', icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><rect x="2" y="4" width="20" height="16" rx="2" ry="2" /><line x1="12" y1="10" x2="12" y2="10.01" /><line x1="2" y1="10" x2="22" y2="10" /></svg> }
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

      {/* Información del paciente */}
      <div className={`relative z-10 w-full mt-auto mb-3 border rounded-xl p-3 backdrop-blur-md shadow-md transition-all duration-500 ${
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

      {/* Alerta neumórfica estilo Imagen 3 */}
      <div className="relative z-10 w-full mb-3 animate-in fade-in slide-in-from-bottom-2 duration-300">
        <div className={`rounded-2xl p-3 border flex items-center justify-between shadow-sm transition-all duration-300 ${
          isDark ? 'bg-white/5 border-white/10' : 'bg-white border-slate-200 shadow-[2px_2px_8px_rgba(0,0,0,0.03)]'
        }`}>
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-500 shadow-inner">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <circle cx="12" cy="12" r="10" />
                <path d="M12 8v4l3 3" />
              </svg>
            </div>
            <div className="text-left">
              <p className={`text-[10px] font-bold ${textTitleClass}`}>Último cobro recibido de {currentPatient.name}</p>
              <p className={`text-[8.5px] font-medium leading-none mt-1 ${textMutedClass}`}>$1,250.00 MXN — Tratamiento Preventivo</p>
            </div>
          </div>
          <span className="text-[8px] font-mono font-bold text-emerald-500 uppercase tracking-widest">Estable</span>
        </div>
      </div>

      {/* Menú de Navegación Neumórfico estilo Imagen 3 */}
      <div className="relative z-10 w-full mb-2">
        <div className={`h-14 rounded-full flex items-center justify-between px-6 relative overflow-visible border shadow-lg ${
          isDark ? 'bg-neutral-900/95 border-white/5 shadow-black/40' : 'bg-white/95 border-slate-200/85 shadow-[0_10px_25px_rgba(0,0,0,0.05)]'
        }`}>
          {/* Resplandor azul detrás de la barra para el botón activo */}
          <div className="w-14 h-14 bg-blue-500/20 blur-lg rounded-full absolute left-1/2 -translate-x-1/2 -top-4 pointer-events-none" />

          {/* Botón 1: Home (Perfil) */}
          <button 
            onClick={() => setExpandedCard(null)}
            className={`w-9 h-9 rounded-full flex items-center justify-center transition active:scale-90 cursor-pointer ${
              !expandedCard ? 'text-blue-500' : 'text-zinc-400 hover:text-zinc-200'
            }`}
            title="Ver Expediente"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className={!expandedCard ? 'fill-blue-500/10' : ''}>
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
              <polyline points="9 22 9 12 15 12 15 22" />
            </svg>
          </button>

          {/* Botón 2: Notas (Timeline) */}
          <button 
            onClick={() => setExpandedCard('notas')}
            className={`w-9 h-9 rounded-full flex items-center justify-center transition active:scale-90 cursor-pointer ${
              expandedCard === 'notas' ? 'text-blue-500' : 'text-zinc-400 hover:text-zinc-250'
            }`}
            title="Notas Clínicas"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className={expandedCard === 'notas' ? 'fill-blue-500/10' : ''}>
              <path d="M12 20h9" />
              <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
            </svg>
          </button>

          {/* Botón 3 Central Azul: Odontograma */}
          <button 
            onClick={() => setExpandedCard('odontograma')}
            className="w-12 h-12 rounded-full bg-gradient-to-tr from-blue-600 to-blue-450 text-white flex items-center justify-center shadow-[0_4px_16px_rgba(37,99,235,0.45)] hover:scale-105 active:scale-95 transition absolute left-1/2 -translate-x-1/2 -top-4 border border-white/25 z-20 cursor-pointer"
            title="Odontograma FDI"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            </svg>
          </button>

          <div className="w-10 h-10 shrink-0 pointer-events-none" /> {/* Espaciador central */}

          {/* Botón 4: Cobros (Wallet) */}
          <button 
            onClick={() => setExpandedCard('cobros')}
            className={`w-9 h-9 rounded-full flex items-center justify-center transition active:scale-90 cursor-pointer ${
              expandedCard === 'cobros' ? 'text-blue-500' : 'text-zinc-400 hover:text-zinc-250'
            }`}
            title="Presupuestos & Cobros"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className={expandedCard === 'cobros' ? 'fill-blue-500/10' : ''}>
              <rect x="2" y="4" width="20" height="16" rx="2" ry="2" />
              <line x1="12" y1="10" x2="12" y2="10.01" />
              <line x1="2" y1="10" x2="22" y2="10" />
            </svg>
          </button>

          {/* Botón 5: Radiografías (Gabinete) */}
          <button 
            onClick={() => setExpandedCard('radiografias')}
            className={`w-9 h-9 rounded-full flex items-center justify-center transition active:scale-90 cursor-pointer ${
              expandedCard === 'radiografias' ? 'text-blue-500' : 'text-zinc-400 hover:text-zinc-250'
            }`}
            title="Gabinete Clínico"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className={expandedCard === 'radiografias' ? 'fill-blue-500/10' : ''}>
              <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
              <circle cx="12" cy="13" r="4" />
            </svg>
          </button>
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

  // ── Estado local del Gabinete Clínico ──
  const [gabinetTab, setGabinetTab] = useState<'radiografias' | 'intraorales' | 'paciente'>('radiografias');
  const [gabinetDragging, setGabinetDragging] = useState(false);
  const [gabinetFiles, setGabinetFiles] = useState<{
    id: string;
    name: string;
    size: string;
    progress: number;
    done: boolean;
    category: 'radiografias' | 'intraorales' | 'paciente';
    url?: string;
  }[]>([]);
  const gabinetInputRef = useRef<HTMLInputElement>(null);

  const gabinetTabConfig = [
    { id: 'radiografias' as const, label: 'Radiografías', icon: <ScanLine size={13} /> },
    { id: 'intraorales' as const, label: 'Intraorales', icon: <Camera size={13} /> },
    { id: 'paciente' as const, label: 'Foto Paciente', icon: <User size={13} /> },
  ];

  const handleGabinetFiles = useCallback((files: FileList | null) => {
    if (!files || files.length === 0) return;
    Array.from(files).forEach(file => {
      const id = `${Date.now()}-${Math.random().toString(36).slice(2)}`;
      const sizeMB = (file.size / 1048576).toFixed(1);
      const url = URL.createObjectURL(file);
      const newFile = { id, name: file.name, size: `${sizeMB} MB`, progress: 0, done: false, category: gabinetTab, url };
      setGabinetFiles(prev => [newFile, ...prev]);
      // Simular progreso
      let prog = 0;
      const interval = setInterval(() => {
        prog += Math.random() * 25 + 10;
        if (prog >= 100) {
          prog = 100;
          clearInterval(interval);
          setGabinetFiles(prev => prev.map(f => f.id === id ? { ...f, progress: 100, done: true } : f));
        } else {
          setGabinetFiles(prev => prev.map(f => f.id === id ? { ...f, progress: Math.round(prog) } : f));
        }
      }, 300);
    });
  }, [gabinetTab]);

  const gabinetFilesFiltered = gabinetFiles.filter(f => f.category === gabinetTab);

  const renderRadiografias = (isExpanded: boolean) => (
    <div className={`rounded-[24px] flex flex-col border overflow-hidden transition-all duration-500 h-full shadow-xl relative ${
      isDark
        ? 'bg-gradient-to-b from-[#0f0e13] to-[#09080d] border-white/[0.06]'
        : 'bg-gradient-to-b from-white to-slate-50 border-slate-200/80 shadow-md'
    }`}>
      {/* Fondo glassmorphism ambiental */}
      <div className="absolute inset-0 pointer-events-none">
        <div className={`absolute top-0 left-1/2 -translate-x-1/2 w-[200px] h-[200px] rounded-full blur-[70px] ${
          isDark ? 'bg-blue-500/8' : 'bg-blue-400/6'
        }`} />
      </div>

      {/* ── Header ── */}
      <div className="relative z-10 flex items-center justify-between px-4 pt-4 pb-2 shrink-0">
        <div className="flex items-center gap-2">
          <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${
            isDark ? 'bg-blue-500/15 text-blue-400' : 'bg-blue-50 text-blue-500'
          }`}>
            <ImagePlus size={13} />
          </div>
          <h3 className={`text-[11px] font-bold tracking-wide ${textTitleClass}`}>
            Gabinete Clínico
          </h3>
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation();
            setExpandedCard(isExpanded ? null : 'radiografias');
          }}
          className="p-1 rounded-md hover:bg-white/10 text-zinc-400 hover:text-white transition-colors"
        >
          {isExpanded ? <Minimize2 size={13} /> : <Maximize2 size={13} />}
        </button>
      </div>

      {/* ── Zona de Drop Principal ── */}
      <div className="relative z-10 px-3 pb-2 shrink-0">
        <div
          onDragOver={(e) => { e.preventDefault(); setGabinetDragging(true); }}
          onDragLeave={() => setGabinetDragging(false)}
          onDrop={(e) => {
            e.preventDefault();
            setGabinetDragging(false);
            handleGabinetFiles(e.dataTransfer.files);
          }}
          onClick={() => gabinetInputRef.current?.click()}
          className={`relative border-2 border-dashed rounded-2xl py-5 flex flex-col items-center justify-center gap-2 cursor-pointer transition-all duration-300 ${
            gabinetDragging
              ? (isDark ? 'border-blue-500/60 bg-blue-500/8 scale-[1.01]' : 'border-blue-400/60 bg-blue-50/60 scale-[1.01]')
              : (isDark ? 'border-white/8 bg-white/[0.018] hover:border-white/15 hover:bg-white/[0.035]' : 'border-slate-200 bg-slate-50/40 hover:border-blue-300/60 hover:bg-blue-50/30')
          }`}
        >
          {/* Botón circular glassmorphic/neumorphic central */}
          <div className={`relative w-14 h-14 rounded-full flex items-center justify-center transition-all duration-300 ${
            gabinetDragging
              ? 'scale-110 shadow-[0_0_24px_rgba(59,130,246,0.45)]'
              : 'scale-100'
          }`}
            style={{
              background: isDark
                ? 'radial-gradient(circle at 35% 35%, rgba(147,197,253,0.18) 0%, rgba(59,130,246,0.08) 50%, transparent 100%)'
                : 'radial-gradient(circle at 35% 35%, rgba(219,234,254,0.9) 0%, rgba(191,219,254,0.6) 50%, transparent 100%)',
              boxShadow: isDark
                ? 'inset 0 1px 0 rgba(255,255,255,0.1), 0 4px 20px rgba(59,130,246,0.15), 0 0 0 1px rgba(59,130,246,0.12)'
                : 'inset 0 2px 4px rgba(255,255,255,0.9), 0 4px 12px rgba(59,130,246,0.12), 0 0 0 1px rgba(59,130,246,0.15)'
            }}
          >
            <Upload size={20} className={isDark ? 'text-blue-400' : 'text-blue-500'} strokeWidth={2} />
            {/* Halo de brillo exterior */}
            <div className="absolute inset-0 rounded-full blur-[12px] opacity-40"
              style={{ background: 'radial-gradient(circle, rgba(59,130,246,0.35) 0%, transparent 70%)' }}
            />
          </div>

          <div className="text-center px-2">
            <p className={`text-[10px] font-bold ${textTitleClass}`}>
              {gabinetDragging ? '¡Suelta aquí!' : 'Arrastra o haz clic para subir'}
            </p>
            <p className={`text-[8px] mt-0.5 leading-tight ${textMutedClass}`}>
              PNG, JPG, DICOM · max 50 MB por archivo
            </p>
          </div>

          <input
            ref={gabinetInputRef}
            type="file"
            multiple
            accept="image/*,.dcm"
            className="hidden"
            onChange={(e) => handleGabinetFiles(e.target.files)}
          />
        </div>
      </div>

      {/* ── Lista de archivos en cola / completados ── */}
      <div className="relative z-10 flex-1 flex flex-col overflow-hidden px-3">
        {gabinetFilesFiltered.length > 0 ? (
          <div className="flex flex-col gap-1.5 overflow-y-auto scrollbar-none flex-1 pb-1">
            {gabinetFilesFiltered.slice(0, isExpanded ? 20 : 2).map(file => (
              <div
                key={file.id}
                className={`rounded-xl border p-2.5 flex flex-col gap-1.5 relative overflow-hidden ${
                  isDark ? 'bg-white/[0.035] border-white/[0.07]' : 'bg-white border-slate-200 shadow-sm'
                }`}
              >
                {/* Shimmer cuando está cargando */}
                {!file.done && (
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.03] to-transparent animate-shimmer pointer-events-none" />
                )}
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                      file.done
                        ? (isDark ? 'bg-emerald-500/15 text-emerald-400' : 'bg-emerald-50 text-emerald-500')
                        : (isDark ? 'bg-blue-500/12 text-blue-400' : 'bg-blue-50 text-blue-500')
                    }`}>
                      {file.done
                        ? <Check size={13} strokeWidth={3} />
                        : <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="8.5" cy="8.5" r="1.5" /><polyline points="21 15 16 10 5 21" /></svg>
                      }
                    </div>
                    <div className="min-w-0">
                      <p className={`text-[9.5px] font-bold truncate ${textTitleClass}`}>{file.name}</p>
                      <p className={`text-[8px] leading-none mt-0.5 ${textMutedClass}`}>
                        {file.size} · {file.done ? 'Completado' : `${file.progress}% restante`}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setGabinetFiles(prev => prev.filter(f => f.id !== file.id))}
                    className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 transition-all ${
                      isDark ? 'bg-white/5 hover:bg-white/10 text-zinc-400' : 'bg-slate-100 hover:bg-slate-200 text-slate-400'
                    }`}
                  >
                    <X size={9} />
                  </button>
                </div>
                {/* Barra de progreso */}
                {!file.done && (
                  <div className={`w-full h-1 rounded-full overflow-hidden ${
                    isDark ? 'bg-white/5' : 'bg-slate-100'
                  }`}>
                    <div
                      className="h-full rounded-full bg-blue-500 transition-all duration-300"
                      style={{ width: `${file.progress}%` }}
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className={`flex-1 flex flex-col items-center justify-center gap-1 py-3 ${
            isDark ? 'text-zinc-600' : 'text-slate-350'
          }`}>
            <Camera size={16} className="opacity-40" />
            <p className="text-[8.5px] font-medium opacity-60">
              Sin archivos en esta categoría
            </p>
          </div>
        )}
      </div>

      {/* ── Botones Cancelar / Subir ── */}
      {gabinetFilesFiltered.some(f => !f.done) && (
        <div className="relative z-10 flex items-center gap-2.5 px-3 py-2 shrink-0">
          <button
            onClick={() => setGabinetFiles(prev => prev.filter(f => f.done || f.category !== gabinetTab))}
            className={`flex-1 h-8 rounded-full border text-[9px] font-bold transition-all cursor-pointer active:scale-95 ${
              isDark ? 'bg-white/[0.04] border-white/8 text-zinc-300 hover:bg-white/8' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50 shadow-sm'
            }`}
          >
            Cancelar
          </button>
          <button className="flex-1 h-8 rounded-full bg-blue-500 hover:bg-blue-400 text-white font-bold text-[9px] transition-all cursor-pointer active:scale-95 shadow-[0_3px_10px_rgba(59,130,246,0.35)]">
            Subir Archivos
          </button>
        </div>
      )}

      {/* ── Micromenu Inferior ── */}
      <div className="relative z-10 shrink-0 px-3 pb-3 pt-1">
        <div className={`h-12 rounded-2xl flex items-center justify-around px-2 relative border ${
          isDark
            ? 'bg-[#0a090d]/80 border-white/[0.06] shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]'
            : 'bg-white/90 border-slate-200/80 shadow-[0_2px_10px_rgba(0,0,0,0.05)]'
        }`}
          style={{
            backdropFilter: 'blur(12px)',
          }}
        >
          {/* Glow del tab activo */}
          <div className="absolute inset-0 rounded-2xl overflow-hidden pointer-events-none">
            <div
              className="absolute h-[2px] bottom-0 rounded-full bg-blue-500 transition-all duration-300"
              style={{
                width: '33%',
                left: gabinetTab === 'radiografias' ? '0%' : gabinetTab === 'intraorales' ? '33%' : '67%',
                opacity: 0.7,
                boxShadow: '0 0 8px rgba(59,130,246,0.6)'
              }}
            />
          </div>

          {gabinetTabConfig.map(tab => {
            const isActive = gabinetTab === tab.id;
            const count = gabinetFiles.filter(f => f.category === tab.id).length;
            return (
              <button
                key={tab.id}
                onClick={(e) => { e.stopPropagation(); setGabinetTab(tab.id); }}
                className={`flex-1 flex flex-col items-center justify-center gap-0.5 h-full rounded-xl transition-all duration-200 cursor-pointer relative ${
                  isActive
                    ? (isDark ? 'text-blue-400' : 'text-blue-500')
                    : (isDark ? 'text-zinc-500 hover:text-zinc-350' : 'text-slate-400 hover:text-slate-550')
                }`}
              >
                {/* Neumorphic background para el tab activo */}
                {isActive && (
                  <div
                    className="absolute inset-[3px] rounded-xl transition-all duration-300"
                    style={{
                      background: isDark
                        ? 'linear-gradient(135deg, rgba(59,130,246,0.12) 0%, rgba(59,130,246,0.04) 100%)'
                        : 'linear-gradient(135deg, rgba(59,130,246,0.1) 0%, rgba(59,130,246,0.04) 100%)',
                      boxShadow: isDark
                        ? 'inset 0 1px 0 rgba(59,130,246,0.15), 0 1px 4px rgba(0,0,0,0.3)'
                        : 'inset 0 1px 0 rgba(255,255,255,0.8), 0 1px 4px rgba(0,0,0,0.06)'
                    }}
                  />
                )}
                <span className="relative z-10">{tab.icon}</span>
                <span className="relative z-10 text-[7.5px] font-bold tracking-tight">{tab.label}</span>
                {count > 0 && (
                  <span className={`absolute top-1 right-2 text-[7px] font-black px-1 rounded-full min-w-[14px] text-center ${
                    isDark ? 'bg-blue-500/25 text-blue-300' : 'bg-blue-100 text-blue-600'
                  }`}>
                    {count}
                  </span>
                )}
              </button>
            );
          })}
        </div>
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
    <div className={`rounded-[24px] p-5 shadow-md flex flex-col gap-3.5 border overflow-hidden transition-all duration-500 h-full ${cardClass}`}>
      <div className="flex items-center justify-between shrink-0">
        <h3 className={`text-xs font-bold tracking-wide ${textTitleClass}`}>
          Evolución del Plan de Tratamiento
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

      <div className="flex-1 flex flex-col gap-3.5 overflow-y-auto pr-0.5 scrollbar-none">
        {/* Encabezado y Tooltip de evolución (Imagen 2) */}
        <div className="text-left select-none shrink-0">
          <span className="font-bruno text-[10.5px] font-bold text-[#00C980] block mb-1">
            ¡YA CASI ESTAMOS AHÍ!
          </span>
          
          {/* Tooltip flotante */}
          <div className="relative mt-2 mb-1.5 pl-0.5">
            <div className={`inline-block px-3 py-1 rounded-xl border text-[9.5px] font-bold relative z-10 shadow-sm ${
              isDark ? 'bg-white text-zinc-950 border-white' : 'bg-white text-slate-800 border-slate-200'
            }`}>
              <div className="flex items-center gap-1.5 font-extrabold">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Fase 3: Tratamiento Activo (Endodoncia)
              </div>
              {/* Flecha del tooltip */}
              <div className={`absolute bottom-[-4px] left-6 w-2 h-2 rotate-45 border-r border-b ${
                isDark ? 'bg-white border-white' : 'bg-white border-slate-200'
              }`} />
            </div>
          </div>
        </div>

        {/* Timeline continuo en degradado verde (Imagen 2) */}
        <div className="w-full py-1 shrink-0">
          <div className="relative flex items-center justify-between w-full px-2">
            {/* Barra de progreso de fondo con degradado de verdes */}
            <div className="absolute inset-x-0 h-3.5 rounded-full z-0 opacity-90 shadow-inner"
              style={{
                background: 'linear-gradient(90deg, #01281a 0%, #009c63 35%, #00d688 65%, #3f3f46 72%, #27272a 100%)'
              }}
            />

            {/* Los 5 hitos con check ✓ */}
            {[
              { label: 'Diagnóstico', num: 1, active: true },
              { label: 'Saneamiento', num: 2, active: true },
              { label: 'Fase Activa', num: 3, active: true },
              { label: 'Reconstruir', num: 4, active: false },
              { label: 'Alta Médica', num: 5, active: false, last: true },
            ].map((step, idx) => (
              <div key={idx} className="flex flex-col items-center z-10 select-none">
                {step.active ? (
                  <div className="w-5.5 h-5.5 rounded-full bg-white text-emerald-500 flex items-center justify-center shadow-md border-2 border-emerald-500 hover:scale-110 transition duration-300">
                    <Check size={11} className="stroke-[3.5]" />
                  </div>
                ) : (
                  <button className={`w-5.5 h-5.5 rounded-full border-2 flex items-center justify-center text-[9px] font-bold transition duration-300 ${
                    step.last 
                      ? 'bg-zinc-800 border-zinc-700 text-zinc-500 hover:bg-zinc-700' 
                      : 'bg-zinc-900 border-zinc-800 text-zinc-650 hover:bg-zinc-800'
                  }`}>
                    {step.last ? '+' : step.num}
                  </button>
                )}
                <span className={`text-[8px] mt-1.5 font-bold tracking-tight text-center max-w-[54px] truncate ${
                  step.active ? 'text-[var(--seed-text-main)] font-extrabold' : 'text-zinc-500'
                }`}>
                  {step.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Consejo destacado (Imagen 2) */}
        <div className={`p-2.5 rounded-xl border flex items-center gap-2 text-left shrink-0 ${
          isDark ? 'bg-emerald-500/5 border-emerald-500/10 text-emerald-450' : 'bg-emerald-50 border-emerald-100 text-emerald-700'
        }`}>
          <span className="text-[10px] font-bold shrink-0 bg-emerald-500 text-white w-4 h-4 rounded-full flex items-center justify-center font-mono">+</span>
          <p className="text-[9px] font-semibold leading-snug">
            Tip: Mantener higiene estricta y uso de enjuague antiséptico durante esta fase activa.
          </p>
        </div>

        {/* Campo SOAP tradicional */}
        <div className="flex-1 flex flex-col gap-1 text-left min-h-[100px]">
          <span className={`text-[9px] font-bold uppercase tracking-wider ${textMutedClass}`}>Nota de Evolución SOAP</span>
          <textarea
            value={notes}
            onChange={(e) => handleSaveNotes(e.target.value)}
            placeholder="Escribe la evolución clínica del tratamiento hoy..."
            className={`w-full flex-1 rounded-xl p-3 text-[11px] outline-none transition-all font-sans resize-none border ${
              isDark ? 'bg-zinc-950/30 border-white/5 text-zinc-300 placeholder-zinc-500 focus:border-white/10' : 'bg-slate-50 border-slate-200 text-slate-750 placeholder-slate-400 focus:border-slate-350 shadow-inner'
            }`}
          />
        </div>
      </div>
    </div>
  );

  const renderCobros = (isExpanded: boolean) => (
    <div className="rounded-[24px] p-5 shadow-2xl flex flex-col gap-4 border overflow-hidden transition-all duration-500 h-full bg-[#08070b] border-white/5 text-white">
      <div className="flex items-center justify-between shrink-0">
        <h3 className="text-xs font-bold tracking-wide text-zinc-150 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
          Presupuesto, Cobros & Consentimientos
        </h3>
        <button 
          onClick={(e) => {
            e.stopPropagation();
            setExpandedCard(isExpanded ? null : 'cobros');
          }}
          className="p-1 rounded-md hover:bg-white/10 text-zinc-400 hover:text-white transition-colors"
        >
          {isExpanded ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
        </button>
      </div>

      <div className="flex-1 flex flex-col gap-4 overflow-y-auto pr-0.5 scrollbar-none">
        {/* Tarjeta superior azul eléctrico brillante (Imagen 4) */}
        <div className="rounded-2xl p-5 bg-gradient-to-br from-blue-600 to-blue-800 text-white relative overflow-hidden shadow-[0_8px_32px_rgba(37,99,235,0.4)] shrink-0">
          <span className="text-[8px] font-bold uppercase tracking-[0.25em] text-blue-200 block mb-1">
            SALDO TOTAL DE TRATAMIENTO
          </span>
          <h2 className="text-3xl font-black font-bruno tracking-wide text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.2)]">
            $12,450.00 <span className="text-sm font-semibold tracking-normal text-blue-100 font-sans">MXN</span>
          </h2>

          {/* Avatares circulares superpuestos (Imagen 4) */}
          <div className="flex items-center gap-1.5 mt-5">
            <div className="flex -space-x-1.5 overflow-hidden">
              <img src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=40&q=80" className="inline-block h-6 w-6 rounded-full ring-2 ring-blue-500 object-cover" alt="dr" />
              <img src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=40&q=80" className="inline-block h-6 w-6 rounded-full ring-2 ring-blue-500 object-cover" alt="paciente" />
              <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=40&q=80" className="inline-block h-6 w-6 rounded-full ring-2 ring-blue-500 object-cover" alt="dra" />
            </div>
            <span className="text-[8.5px] font-bold text-blue-200 tracking-wider uppercase ml-1">
              Firmas autorizadas por Doctores
            </span>
          </div>
        </div>

        {/* Sección Last Transaction en card de vidrio oscuro (Imagen 4) */}
        <div className="flex flex-col gap-2 text-left shrink-0">
          <span className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest block mb-0.5">ÚLTIMO MOVIMIENTO CLÍNICO</span>
          <div className="rounded-2xl p-3 bg-white/[0.03] border border-white/5 flex items-center justify-between shadow-sm">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-8 h-8 rounded-full bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 shadow-inner shrink-0">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
                  <path d="M12 6v6l4 2" />
                </svg>
              </div>
              <div className="truncate">
                <p className="text-[10px] font-bold text-zinc-200 truncate">Consentimiento de Endodoncia</p>
                <p className="text-[8.5px] text-zinc-500 truncate">Firmado digitalmente el 17 Jul · 20:12</p>
              </div>
            </div>
            <span className="text-[11px] font-black font-mono text-zinc-100 shrink-0">$3,200.00</span>
          </div>
        </div>

        {/* Botones de acción 3D en la base (Imagen 4) */}
        <div className="flex items-center justify-between gap-3 mt-2 shrink-0">
          {/* Botones redondos pequeños */}
          <div className="flex items-center gap-2">
            <button className="w-9 h-9 rounded-full bg-white/[0.04] border border-white/5 text-zinc-400 hover:text-white flex items-center justify-center transition-all cursor-pointer active:scale-90" title="Ajustes de Cobros">
              <Settings size={14} />
            </button>
            <button className="w-9 h-9 rounded-full bg-white/[0.04] border border-white/5 text-zinc-400 hover:text-white flex items-center justify-center transition-all cursor-pointer active:scale-90" title="Historial Completo">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12" /></svg>
            </button>
          </div>

          {/* Botones horizontales de píldora */}
          <div className="flex-1 flex items-center gap-2.5">
            <button className="flex-1 h-9 rounded-full bg-white/[0.05] hover:bg-white/[0.1] border border-white/5 text-zinc-200 font-bold text-[10px] transition-all cursor-pointer flex items-center justify-center active:scale-95">
              Presupuesto ⬇
            </button>
            <button className="flex-1 h-9 rounded-full bg-gradient-to-t from-blue-600 to-blue-550 hover:from-blue-550 hover:to-blue-450 text-white font-bold text-[10px] tracking-wide transition-all cursor-pointer flex items-center justify-center active:scale-95 shadow-[0_4px_16px_rgba(59,130,246,0.4)] border border-white/10 font-bruno">
              Firmar ⬆
            </button>
          </div>
        </div>
      </div>
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
      case 'cobros': return renderCobros(true);
      default: return null;
    }
  };

  return (
    <div className={`fixed inset-0 z-[250] flex overflow-hidden font-sans transition-colors duration-500 ${containerClass}`}>
      {/* ── Orbes de luz ambientales en el fondo ── */}
      <div className="seed-blue-glow-bottom-left" />
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
            <h1 className={`text-3xl sm:text-4xl font-extrabold tracking-[0.12em] font-bruno uppercase flex items-center gap-3 ${textTitleClass}`}>
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

              {/* ════ Columna 2: Odontograma + Gabinete Clínico (mismo nivel top) ════ */}
              <div className="flex flex-col gap-3 h-full overflow-hidden pb-1">
                {/* Tarjeta del Odontograma (Alto: 52%) */}
                <div className="h-[52%] cursor-pointer" onClick={() => setExpandedCard('odontograma')}>
                  {renderOdontograma(false)}
                </div>

                {/* Gabinete Clínico premium — mismo nivel que los elementos superiores (Alto: 44%) */}
                <div className="h-[44%]" onClick={(e) => { if ((e.target as HTMLElement).closest('button,input') === null) setExpandedCard('radiografias'); }}>
                  {renderRadiografias(false)}
                </div>
              </div>

              {/* ════ Columna 3: Lobby, Documento, Notas y Cobros ════ */}
              <div className="flex flex-col gap-3 h-full overflow-hidden pb-1 animate-in fade-in">
                {/* Lobby Digital (Alto: 22%) */}
                <div className="h-[22%] cursor-pointer" onClick={() => setExpandedCard('lobby')}>
                  {renderLobby(false)}
                </div>

                {/* Documento Vivo (Alto: 30%) */}
                <div className="h-[30%] cursor-pointer" onClick={() => setExpandedCard('documento')}>
                  {renderDocumento(false)}
                </div>

                {/* Notas de Evolución (Alto: 31%) */}
                <div className="h-[31%] cursor-pointer" onClick={() => setExpandedCard('notas')}>
                  {renderNotas(false)}
                </div>

                {/* Presupuestos y Cobros — banner compacto (Alto: 13%) */}
                <div
                  onClick={() => setExpandedCard('cobros')}
                  className={`h-[13%] rounded-2xl px-3 flex items-center justify-between border transition-all duration-300 cursor-pointer group shadow-sm shrink-0 ${
                    isDark
                      ? 'bg-gradient-to-r from-[#12111a]/90 to-[#0d0c14]/90 hover:from-[#1a192a]/90 border-white/[0.06]'
                      : 'bg-gradient-to-r from-white to-slate-50 hover:from-blue-50/30 border-slate-200 hover:border-blue-200/60'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <div className={`w-7 h-7 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
                      isDark ? 'bg-blue-500/12 text-blue-400' : 'bg-blue-50 text-blue-500'
                    }`}
                      style={{
                        boxShadow: isDark
                          ? 'inset 0 1px 0 rgba(255,255,255,0.06), 0 1px 4px rgba(0,0,0,0.3)'
                          : 'inset 0 1px 0 rgba(255,255,255,1), 0 1px 3px rgba(0,0,0,0.06)'
                      }}
                    >
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <rect x="2" y="4" width="20" height="16" rx="2" ry="2" />
                        <line x1="12" y1="10" x2="12" y2="10.01" />
                        <line x1="2" y1="10" x2="22" y2="10" />
                      </svg>
                    </div>
                    <div className="text-left">
                      <h4 className={`text-[10px] font-bold leading-none ${
                        isDark ? 'text-white' : 'text-slate-700'
                      }`}>Cobros & Firmas</h4>
                      <p className={`text-[8px] mt-0.5 ${
                        isDark ? 'text-zinc-500' : 'text-slate-400'
                      }`}>Saldo, presupuestos · ver todo</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className={`text-[9px] font-black font-mono ${
                      isDark ? 'text-emerald-400' : 'text-emerald-600'
                    }`}>$12,450</span>
                    <ChevronRight size={11} className={`transition-colors ${
                      isDark ? 'text-zinc-600 group-hover:text-zinc-300' : 'text-slate-350 group-hover:text-slate-600'
                    }`} />
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>

    </div>
  );
}
