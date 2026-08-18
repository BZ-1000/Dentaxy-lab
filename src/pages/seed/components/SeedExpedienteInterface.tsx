import React, { useState, useRef, useEffect } from 'react';
import { 
  ArrowLeft, ArrowRight, Search, Calendar, Settings, Bell, X, Check, User,
  FileText, ClipboardList, Sparkles, Pill, ShieldCheck, AlertTriangle, Mic, Scan
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import Odontograma from '../../../components/historia-clinica/Odontograma';
import SeedLobbyWidget from './SeedLobbyWidget';
import SeedChatConsole from './SeedChatConsole';
import SeedEventList from './SeedEventList';
import SeedDashboardLayout from './SeedDashboardLayout';

// ─── MENÚ ORBITAL LÍQUIDO 3D — CAPACIDADES DE DEX IA (ESTILO NEÓN CRISTALINO VIBRANTE) ──
const DEX_ORBITAL_CAPABILITIES = [
  {
    id: 'nota-evolucion',
    label: 'Nota de Evolución SOAP',
    desc: 'Redacción de evolución clínica instantánea',
    icon: FileText,
    angle: 270, // Arriba (Top)
    neonColor: '#00ff88',
    glowShadow: 'rgba(0, 255, 136, 0.9)',
    bgGradient: 'from-emerald-400/90 via-emerald-600 to-teal-950',
  },
  {
    id: 'historia-clinica',
    label: 'Historia Clínica',
    desc: 'Compilación de 21 secciones NOM-004',
    icon: ClipboardList,
    angle: 315, // Arriba-Derecha
    neonColor: '#00d2ff',
    glowShadow: 'rgba(0, 210, 255, 0.9)',
    bgGradient: 'from-cyan-400/90 via-blue-600 to-indigo-950',
  },
  {
    id: 'odontograma-ia',
    label: 'Odontograma IA',
    desc: 'Mapeo dental e historial de órganos',
    icon: Sparkles,
    angle: 0, // Derecha
    neonColor: '#b026ff',
    glowShadow: 'rgba(176, 38, 255, 0.9)',
    bgGradient: 'from-fuchsia-400/90 via-purple-600 to-slate-950',
  },
  {
    id: 'recetas-medicas',
    label: 'Recetas Médicas',
    desc: 'Prescripción y cruzamiento de dosis',
    icon: Pill,
    angle: 45, // Abajo-Derecha
    neonColor: '#ff007f',
    glowShadow: 'rgba(255, 0, 127, 0.9)',
    bgGradient: 'from-pink-400/90 via-rose-600 to-rose-950',
  },
  {
    id: 'consentimiento',
    label: 'Consentimiento Informado',
    desc: 'Generador de consentimientos legales',
    icon: ShieldCheck,
    angle: 90, // Abajo
    neonColor: '#ffaa00',
    glowShadow: 'rgba(255, 170, 0, 0.9)',
    bgGradient: 'from-amber-300/90 via-amber-500 to-amber-950',
  },
  {
    id: 'riesgos-alergias',
    label: 'Semáforo de Riesgos',
    desc: 'Control de alergias y contraindicaciones',
    icon: AlertTriangle,
    angle: 135, // Abajo-Izquierda
    neonColor: '#ff2a2a',
    glowShadow: 'rgba(255, 42, 42, 0.9)',
    bgGradient: 'from-red-400/90 via-red-600 to-stone-950',
  },
  {
    id: 'dictado-voz',
    label: 'Dictado Clínico por Voz',
    desc: 'Transcripción vocal en tiempo real',
    icon: Mic,
    angle: 180, // Izquierda
    neonColor: '#00f2fe',
    glowShadow: 'rgba(0, 242, 254, 0.9)',
    bgGradient: 'from-teal-300/90 via-cyan-500 to-sky-950',
  },
  {
    id: 'analisis-rx',
    label: 'Análisis Radiográfico',
    desc: 'Inspección radiográfica por visión IA',
    icon: Scan,
    angle: 225, // Arriba-Izquierda
    neonColor: '#7928ca',
    glowShadow: 'rgba(121, 40, 202, 0.9)',
    bgGradient: 'from-violet-400/90 via-indigo-600 to-slate-950',
  },
];

export interface SeedExpedienteInterfaceProps {
  folder?: any;
  patientsList?: any[];
  onSelectPatient?: (patient: any) => void;
  onClose: () => void;
}

export default function SeedExpedienteInterface({ 
  folder, 
  patientsList = [], 
  onSelectPatient, 
  onClose 
}: SeedExpedienteInterfaceProps) {
  const patientName = (folder?.name || "PACIENTE DENTAXY").toUpperCase();
  const [isFullOdontogramOpen, setIsFullOdontogramOpen] = useState(false);
  const [teethState, setTeethState] = useState<Record<number, any>>({});
  const [isPatientSearchOpen, setIsPatientSearchOpen] = useState(false);
  const [searchFilter, setSearchFilter] = useState('');

  // ─── Estado del Menú Circular Orbital Líquido 3D para DEX ───
  const [isOrbHovered, setIsOrbHovered] = useState(false);
  const [activeOrbitalTooltip, setActiveOrbitalTooltip] = useState<string | null>(null);
  const orbHoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleOrbMouseEnter = () => {
    if (orbHoverTimeoutRef.current) clearTimeout(orbHoverTimeoutRef.current);
    setIsOrbHovered(true);
  };

  const handleOrbMouseLeave = () => {
    orbHoverTimeoutRef.current = setTimeout(() => {
      setIsOrbHovered(false);
      setActiveOrbitalTooltip(null);
    }, 220);
  };

  // Notificar al estado global que el expediente está abierto para ocultar el orbe secundario del fondo
  useEffect(() => {
    window.dispatchEvent(new CustomEvent('dex:expedienteState', { detail: { isOpen: true } }));
    return () => {
      window.dispatchEvent(new CustomEvent('dex:expedienteState', { detail: { isOpen: false } }));
    };
  }, []);

  // Índice del paciente actual
  const currentIdx = patientsList.findIndex(p => (p.id || p.name) === (folder?.id || folder?.name));

  // Cambiar al siguiente paciente
  const handleNextPatient = () => {
    if (patientsList && patientsList.length > 0) {
      const nextIdx = (currentIdx + 1) % patientsList.length;
      onSelectPatient?.(patientsList[nextIdx]);
    }
  };

  // Filtrar lista de pacientes para la búsqueda
  const filteredPatients = patientsList.filter(p => 
    (p.name || '').toLowerCase().includes(searchFilter.toLowerCase())
  );

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2, ease: 'easeOut' }}
      className="fixed inset-0 z-[100] flex flex-col overflow-hidden select-none bg-black border-none shadow-none"
      style={{
        backgroundColor: '#000000',
        background: '#000000',
        backdropFilter: 'none',
        WebkitBackdropFilter: 'none',
        boxShadow: 'none',
      }}
    >
      {/* ── Estilos tipográficos y blanco con resplandor ── */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bruno+Ace&family=Bruno+Ace+SC&display=swap');
        .font-bruno-ace {
          font-family: 'Bruno Ace', 'Bruno Ace SC', cursive, sans-serif;
        }
        .text-glowing-white {
          display: inline-block;
          color: #FFFFFF;
          text-shadow: 
            0 0 6px rgba(255, 255, 255, 0.35),
            0 0 14px rgba(255, 255, 255, 0.15),
            0 8px 24px rgba(0, 0, 0, 0.95);
          filter: drop-shadow(0 0 5px rgba(255, 255, 255, 0.2));
        }
      `}</style>

      {/* ── BARRA NAVEGACIÓN SUPERIOR DUPLICADA (ANIMACIÓN LÍQUIDA) ── */}
      <motion.nav 
        initial={{ y: -80, scale: 0.92, filter: 'blur(10px)', opacity: 0 }}
        animate={{ y: 0, scale: 1, filter: 'blur(0px)', opacity: 1 }}
        transition={{ type: "spring", stiffness: 160, damping: 16, mass: 0.9 }}
        className="w-full h-20 px-6 flex items-center justify-between relative z-[20000] pointer-events-auto"
      >
        {/* Esquina Izquierda: Botones de Navegación del Expediente */}
        <div className="flex items-center gap-2.5">
          {/* Botón 1: Regresar a la sección principal */}
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-full bg-white hover:bg-slate-100 text-slate-900 border border-slate-200/90 flex items-center justify-center transition-all cursor-pointer shadow-md active:scale-95 outline-none focus:outline-none"
            title="Regresar a la pantalla principal"
          >
            <ArrowLeft size={18} />
          </button>

          {/* Botón 2: Buscar Pacientes (Despliega buscador rápido) */}
          <div className="relative">
            <button
              onClick={() => setIsPatientSearchOpen(!isPatientSearchOpen)}
              className={`w-10 h-10 rounded-full flex items-center justify-center transition-all cursor-pointer shadow-md active:scale-95 outline-none focus:outline-none border ${
                isPatientSearchOpen ? 'bg-slate-900 text-white border-slate-900' : 'bg-white hover:bg-slate-100 text-slate-900 border-slate-200/90'
              }`}
              title="Buscar expediente de paciente"
            >
              <Search size={17} />
            </button>

            {/* Dropdown flotante de Búsqueda de Pacientes */}
            <AnimatePresence>
              {isPatientSearchOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  transition={{ duration: 0.18 }}
                  className="absolute left-0 top-12 w-72 bg-white rounded-2xl p-3 shadow-2xl border border-slate-200 z-[30000]"
                >
                  <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-100 rounded-xl mb-2">
                    <Search size={14} className="text-slate-400" />
                    <input 
                      type="text" 
                      placeholder="Buscar paciente..."
                      value={searchFilter}
                      onChange={(e) => setSearchFilter(e.target.value)}
                      className="bg-transparent border-none outline-none text-xs text-slate-900 w-full font-medium placeholder-slate-400"
                      autoFocus
                    />
                    {searchFilter && (
                      <button onClick={() => setSearchFilter('')} className="text-slate-400 hover:text-slate-700">
                        <X size={13} />
                      </button>
                    )}
                  </div>
                  <div className="max-h-48 overflow-y-auto flex flex-col gap-1 pr-1">
                    {filteredPatients.length > 0 ? (
                      filteredPatients.map((p, idx) => (
                        <button
                          key={p.id || idx}
                          onClick={() => {
                            onSelectPatient?.(p);
                            setIsPatientSearchOpen(false);
                            setSearchFilter('');
                          }}
                          className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold flex items-center justify-between transition ${
                            (p.id || p.name) === (folder?.id || folder?.name)
                              ? 'bg-slate-900 text-white'
                              : 'hover:bg-slate-100 text-slate-800'
                          }`}
                        >
                          <span className="truncate">{p.name}</span>
                          {(p.id || p.name) === (folder?.id || folder?.name) && <Check size={13} />}
                        </button>
                      ))
                    ) : (
                      <div className="p-3 text-center text-xs text-slate-400 font-medium">No hay pacientes encontrados</div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Botón 3: Cambiar al Siguiente Paciente */}
          <button
            onClick={handleNextPatient}
            className="w-10 h-10 rounded-full bg-white hover:bg-slate-100 text-slate-900 border border-slate-200/90 flex items-center justify-center transition-all cursor-pointer shadow-md active:scale-95 outline-none focus:outline-none"
            title="Ver siguiente paciente"
          >
            <ArrowRight size={18} />
          </button>
        </div>



        {/* Esquina Derecha Duplicada */}
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-full bg-white border border-slate-200/90 shadow-md flex items-center justify-center text-slate-700 cursor-pointer hover:bg-slate-100 transition">
            <Settings size={16} />
          </div>
          <div className="w-10 h-10 rounded-full bg-white border border-slate-200/90 shadow-md flex items-center justify-center text-slate-700 cursor-pointer hover:bg-slate-100 transition relative">
            <Bell size={16} />
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white rounded-full text-[9px] font-bold flex items-center justify-center">5</span>
          </div>
          <div className="w-10 h-10 rounded-full bg-white border border-slate-200/90 shadow-md flex items-center justify-center text-slate-900 cursor-pointer hover:bg-slate-100 transition">
            <User size={16} />
          </div>
        </div>
      </motion.nav>

      {/* ── RESPLANDOR / BRILLO AMBIENTAL BLANCO INTENSO DETRÁS DE LA ESFERA DE DEX ── */}
      <div 
        className="fixed top-[43%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-[480px] h-[480px] rounded-full bg-white/55 blur-[95px] pointer-events-none z-0 animate-pulse drop-shadow-[0_0_80px_rgba(255,255,255,0.85)]"
        style={{ animationDuration: '3.5s' }}
      />

      {/* ── AMBIENTE DE ENFOQUE OSCURO / DEGRADADO AL ACTIVAR EL MENÚ (CUBRE TODOS LOS ELEMENTOS) ── */}
      <AnimatePresence>
        {isOrbHovered && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35, ease: "easeInOut" }}
            className="fixed inset-0 bg-black/80 backdrop-blur-md z-[29990] pointer-events-none"
          />
        )}
      </AnimatePresence>

      {/* ── BURBUJA CENTRAL DE DEX (GRANDE 360px CENTRADA SOBRE EL NOMBRE) CON MENÚ ORBITAL LÍQUIDO 3D ── */}
      <div 
        className="fixed top-[43%] left-1/2 -translate-x-1/2 -translate-y-1/2 z-[30000] flex items-center justify-center pointer-events-auto cursor-pointer select-none"
        onMouseEnter={handleOrbMouseEnter}
        onMouseLeave={handleOrbMouseLeave}
      >
        {/* Esfera 3D de DEX */}
        <motion.div
          initial={{ scale: 0.85, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="w-[280px] sm:w-[360px] h-[280px] sm:h-[360px] rounded-full overflow-hidden shrink-0 flex items-center justify-center border-none shadow-none bg-transparent"
        >
          <video
            src="/logos/Dentaxy AI.mp4"
            autoPlay
            muted
            playsInline
            loop
            className="w-full h-full object-cover select-none pointer-events-none mix-blend-multiply rounded-full scale-[1.25]"
          />
        </motion.div>

        {/* ── MENÚ ORBITAL LÍQUIDO 3D — CAPACIDADES DE DEX IA EN EXPEDIENTE ── */}
        <AnimatePresence>
          {isOrbHovered && (
            <div 
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[620px] h-[620px] rounded-full pointer-events-auto z-[30000]"
              onMouseEnter={handleOrbMouseEnter}
              onMouseLeave={handleOrbMouseLeave}
            >
              {DEX_ORBITAL_CAPABILITIES.map((cap, idx) => {
                const radius = 238;
                const offsetX = -34;
                const offsetY = -31;
                const rad = (cap.angle * Math.PI) / 180;
                const x = Math.round(Math.cos(rad) * radius) + offsetX;
                const y = Math.round(Math.sin(rad) * radius) + offsetY;
                const IconComp = cap.icon;

                return (
                  <motion.div
                    key={cap.id}
                    initial={{ scale: 0, opacity: 0, x: 0, y: 0 }}
                    animate={{ scale: 1, opacity: 1, x, y }}
                    exit={{ scale: 0, opacity: 0, x: 0, y: 0 }}
                    transition={{
                      type: "spring",
                      stiffness: 260,
                      damping: 20,
                      delay: idx * 0.035
                    }}
                    onMouseEnter={() => {
                      handleOrbMouseEnter();
                      setActiveOrbitalTooltip(cap.id);
                    }}
                    onMouseLeave={() => setActiveOrbitalTooltip(null)}
                    onClick={(e) => {
                      e.stopPropagation();
                      toast.success(`DEX IA: ${cap.label}`, { description: cap.desc });
                      window.dispatchEvent(new CustomEvent('dex:typingSearch', { detail: { query: cap.label } }));
                    }}
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-auto cursor-pointer group"
                  >
                    {/* Burbuja 3D Líquida Cristalina Neón Vibrante con Crecimiento Fluido en Hover */}
                    <motion.div 
                      whileHover={{ scale: 1.38 }}
                      transition={{ type: "spring", stiffness: 350, damping: 15 }}
                      className={`relative w-16 h-16 rounded-full bg-gradient-to-br ${cap.bgGradient} backdrop-blur-2xl border-2 border-white/90 flex items-center justify-center group`}
                      style={{
                        boxShadow: `0 0 22px ${cap.glowShadow}, 0 0 45px ${cap.glowShadow}, inset 0 2px 10px rgba(255,255,255,0.9)`,
                      }}
                    >
                      {/* Icono puramente BLANCO sin color individual */}
                      <IconComp size={28} className="text-white drop-shadow-[0_2px_12px_rgba(0,0,0,0.95)] group-hover:scale-110 transition-transform duration-200" />
                    </motion.div>

                    {/* Tooltip / Badge de la capacidad */}
                    <AnimatePresence>
                      {activeOrbitalTooltip === cap.id && (
                        <motion.div
                          initial={{ opacity: 0, y: 8, scale: 0.88 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 5, scale: 0.88 }}
                          transition={{ duration: 0.15 }}
                          className="absolute -top-12 left-1/2 -translate-x-1/2 whitespace-nowrap bg-slate-900/95 text-white px-3.5 py-1.5 rounded-2xl text-xs font-semibold shadow-2xl border border-white/20 backdrop-blur-md flex flex-col items-center pointer-events-none z-[35000]"
                        >
                          <span className="font-bold text-emerald-400">{cap.label}</span>
                          <span className="text-[10px] text-slate-300 font-normal">{cap.desc}</span>
                          <div className="w-2 h-2 bg-slate-900/95 rotate-45 -mb-1 mt-0.5 border-r border-b border-white/20" />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                );
              })}
            </div>
          )}
        </AnimatePresence>
      </div>

      {/* ── NOMBRE Y APELLIDO DEL PACIENTE EN BLANCO BRILLANTE (#FFFFFF DETRÁS DE DEX z-0) ── */}
      <div className="relative z-0 flex-1 w-full max-w-none mx-auto flex flex-col items-center justify-center pointer-events-none px-1 sm:px-2 pt-8 pb-6 text-center overflow-hidden -translate-y-28">
        <motion.h1
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="font-bruno-ace text-center uppercase font-black select-none w-full whitespace-normal break-words leading-[0.88]"
          style={{
            fontSize: 'clamp(2.2rem, min(12.5vw, 26vh), 15rem)',
            letterSpacing: '-0.05em',
          }}
        >
          {patientName.split(' ').map((word, idx) => (
            <span key={idx} className="inline-block text-glowing-white mx-[0.12em]">
              {word}
            </span>
          ))}
        </motion.h1>
      </div>

      {/* ── DASHBOARD INFERIOR DUPLICADO PARA EXPEDIENTE (ANIMACIÓN LÍQUIDA - IDÉNTICO AL PRINCIPAL) ── */}
      <motion.div 
        initial={{ y: 100, scale: 0.92, filter: 'blur(10px)', opacity: 0 }}
        animate={{ y: 0, scale: 1, filter: 'blur(0px)', opacity: 1 }}
        transition={{ type: "spring", stiffness: 160, damping: 16, mass: 0.9, delay: 0.08 }}
        className="fixed bottom-0 left-0 right-0 z-[20000] pointer-events-auto"
      >
        <SeedDashboardLayout activePatient={folder} theme="light" forceWhiteBg={true} />
      </motion.div>

      {/* ── MODAL ODONTOGRAMA COMPLETO INTERACTIVO ── */}
      <AnimatePresence>
        {isFullOdontogramOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="fixed inset-0 z-[40000] flex items-center justify-center p-4 sm:p-8 bg-black/70 backdrop-blur-xl"
          >
            <div className="relative w-full max-w-5xl bg-white rounded-3xl p-6 shadow-2xl overflow-y-auto max-h-[90vh]">
              <button
                onClick={() => setIsFullOdontogramOpen(false)}
                className="absolute top-4 right-4 w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center transition-all cursor-pointer z-10 shadow-sm"
                title="Cerrar Odontograma"
              >
                <X size={18} />
              </button>
              <Odontograma
                minimalMode={false}
                initialTeethState={teethState}
                handleOdontogramaChange={(newState) => setTeethState(newState)}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

