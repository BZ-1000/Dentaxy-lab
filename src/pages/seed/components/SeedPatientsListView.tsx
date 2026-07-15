import React, { useState, useEffect, useMemo } from 'react';
import {
  Users, Search, Filter, ChevronRight, Activity, Calendar,
  X, SortAsc, SortDesc, Clock, AlertCircle, CheckCircle, Stethoscope
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Patient {
  id: string | number;
  name: string;
  createdTime?: string;
  appProperties?: {
    motivo?: string;
    alergias?: string;
    telefono?: string;
    edad?: string;
    genero?: string;
    estatus?: string;
    fase?: string;
  };
}

interface SeedPatientsListViewProps {
  /** Lista de pacientes ya cargados (desde SeedApp / Drive) */
  patients?: Patient[];
  onSelectPatient?: (patient: Patient) => void;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const ESTATUS_CONFIG: Record<string, { label: string; color: string; icon: React.ReactNode }> = {
  urgencia:       { label: 'Urgencia',       color: 'text-red-500 bg-red-500/10 border-red-400/30',      icon: <AlertCircle size={12} /> },
  tratamiento:    { label: 'En Tratamiento', color: 'text-emerald-500 bg-emerald-500/10 border-emerald-400/30', icon: <Activity size={12} /> },
  alta:           { label: 'Alta Médica',    color: 'text-blue-500 bg-blue-500/10 border-blue-400/30',   icon: <CheckCircle size={12} /> },
  primera:        { label: 'Primera Cita',   color: 'text-amber-500 bg-amber-500/10 border-amber-400/30', icon: <Stethoscope size={12} /> },
  default:        { label: 'Activo',         color: 'text-slate-500 bg-slate-500/10 border-slate-400/30', icon: <Activity size={12} /> },
};

function getEstatusConfig(estatus?: string) {
  if (!estatus) return ESTATUS_CONFIG.default;
  const key = estatus.toLowerCase();
  for (const k of Object.keys(ESTATUS_CONFIG)) {
    if (key.includes(k)) return ESTATUS_CONFIG[k];
  }
  return ESTATUS_CONFIG.default;
}

function formatDate(iso?: string): string {
  if (!iso) return '—';
  try {
    const d = new Date(iso);
    const now = new Date();
    const diff = now.getTime() - d.getTime();
    const days = Math.floor(diff / 86400000);
    if (days === 0) return 'Hoy';
    if (days === 1) return 'Ayer';
    if (days < 7) return `Hace ${days} días`;
    return d.toLocaleDateString('es-MX', { day: 'numeric', month: 'short', year: 'numeric' });
  } catch {
    return '—';
  }
}

/** Búsqueda fuzzy simple: retorna true si el patrón está aproximadamente en el texto */
function fuzzyMatch(text: string, pattern: string): boolean {
  const t = text.toLowerCase();
  const p = pattern.toLowerCase().trim();
  if (!p) return true;
  // Primero: coincidencia exacta de subcadena
  if (t.includes(p)) return true;
  // Segundo: todos los tokens del patrón deben estar en el texto
  const tokens = p.split(/\s+/);
  return tokens.every(tok => t.includes(tok));
}

type SortMode = 'recent' | 'az' | 'za';
type FilterEstatus = 'todos' | 'urgencia' | 'tratamiento' | 'alta' | 'primera';

export default function SeedPatientsListView({ patients = [], onSelectPatient }: SeedPatientsListViewProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortMode, setSortMode] = useState<SortMode>('recent');
  const [filterEstatus, setFilterEstatus] = useState<FilterEstatus>('todos');
  const [showFilters, setShowFilters] = useState(false);

  // ── Escuchar evento de búsqueda de DEX ──────────────────────────────────
  useEffect(() => {
    const handleDexSearch = (e: Event) => {
      const ev = e as CustomEvent;
      const { query } = ev.detail || {};
      if (query) setSearchQuery(query);
    };
    window.addEventListener('dex:searchPatient', handleDexSearch);
    return () => window.removeEventListener('dex:searchPatient', handleDexSearch);
  }, []);

  // ── Lista filtrada y ordenada ─────────────────────────────────────────────
  const filteredPatients = useMemo(() => {
    let result = [...patients];

    // 1. Filtrar por estatus
    if (filterEstatus !== 'todos') {
      result = result.filter(p => {
        const est = (p.appProperties?.estatus || p.appProperties?.motivo || '').toLowerCase();
        return est.includes(filterEstatus);
      });
    }

    // 2. Filtrar por búsqueda (nombre + teléfono)
    if (searchQuery.trim()) {
      result = result.filter(p => {
        const searchable = [
          p.name,
          p.appProperties?.telefono,
          p.appProperties?.motivo,
        ].filter(Boolean).join(' ');
        return fuzzyMatch(searchable, searchQuery);
      });
    }

    // 3. Ordenar
    result.sort((a, b) => {
      if (sortMode === 'az') return a.name.localeCompare(b.name, 'es');
      if (sortMode === 'za') return b.name.localeCompare(a.name, 'es');
      // 'recent': por fecha de creación, más reciente primero
      const da = new Date(a.createdTime || 0).getTime();
      const db = new Date(b.createdTime || 0).getTime();
      return db - da;
    });

    return result;
  }, [patients, searchQuery, filterEstatus, sortMode]);

  return (
    <div className="w-full max-w-5xl px-8 z-30 flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-6 duration-500">
      
      {/* ── CONTROLES SUPERIORES ───────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        
        {/* Título */}
        <div className="flex items-center gap-3 bg-white dark:bg-[#0c0c0f] border border-slate-100 dark:border-white/5 px-5 py-3 rounded-[20px] shadow-lg shrink-0">
          <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-white/5 flex items-center justify-center border border-slate-200 dark:border-white/10">
            <Users size={16} className="text-slate-600 dark:text-white/60" />
          </div>
          <div>
            <h3 className="text-slate-800 dark:text-white/90 font-semibold text-xs leading-none">Pacientes</h3>
            <span className="text-[9px] text-slate-400 dark:text-white/30 tracking-wider uppercase">
              {filteredPatients.length} de {patients.length} expedientes
            </span>
          </div>
        </div>

        {/* Búsqueda + Filtros */}
        <div className="flex items-center gap-3 w-full sm:w-auto">
          {/* Barra de búsqueda */}
          <div className="relative flex-1 sm:flex-initial">
            <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-white/30" />
            <input 
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar expediente..."
              className="w-full sm:w-64 h-10 bg-white dark:bg-[#0c0c0f] border border-slate-100 dark:border-white/5 rounded-full pl-10 pr-9 text-slate-800 dark:text-white text-xs focus:outline-none focus:border-emerald-500/40 dark:focus:border-emerald-400/40 shadow-lg placeholder:text-slate-400 dark:placeholder:text-white/20"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-white transition-colors"
              >
                <X size={12} />
              </button>
            )}
          </div>

          {/* Botón Filtros */}
          <button
            onClick={() => setShowFilters(prev => !prev)}
            className={`h-10 px-4 border rounded-full flex items-center gap-2 transition shadow-lg cursor-pointer text-xs font-semibold ${
              showFilters || filterEstatus !== 'todos'
                ? 'bg-emerald-500/10 border-emerald-400/30 text-emerald-500 dark:text-emerald-400'
                : 'bg-white dark:bg-[#0c0c0f] border-slate-100 dark:border-white/5 text-slate-600 dark:text-white/70 hover:bg-slate-50 dark:hover:bg-white/5'
            }`}
          >
            <Filter size={14} />
            <span>Filtros</span>
            {filterEstatus !== 'todos' && (
              <span className="w-4 h-4 rounded-full bg-emerald-500 text-white text-[8px] flex items-center justify-center font-bold">1</span>
            )}
          </button>

          {/* Ordenar */}
          <button
            onClick={() => setSortMode(prev => prev === 'recent' ? 'az' : prev === 'az' ? 'za' : 'recent')}
            className="h-10 w-10 bg-white dark:bg-[#0c0c0f] border border-slate-100 dark:border-white/5 rounded-full flex items-center justify-center text-slate-600 dark:text-white/70 hover:bg-slate-50 dark:hover:bg-white/5 transition shadow-lg cursor-pointer"
            title={sortMode === 'recent' ? 'Ordenar A→Z' : sortMode === 'az' ? 'Ordenar Z→A' : 'Ordenar por reciente'}
          >
            {sortMode === 'recent' ? <Clock size={14} /> : sortMode === 'az' ? <SortAsc size={14} /> : <SortDesc size={14} />}
          </button>
        </div>
      </div>

      {/* ── PANEL DE FILTROS EXPANDIBLE ────────────────────────────────────── */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="flex flex-wrap gap-2 overflow-hidden"
          >
            {(['todos', 'urgencia', 'primera', 'tratamiento', 'alta'] as FilterEstatus[]).map(f => (
              <button
                key={f}
                onClick={() => setFilterEstatus(f)}
                className={`px-4 py-2 rounded-full text-[11px] font-semibold border transition-all cursor-pointer capitalize ${
                  filterEstatus === f
                    ? 'bg-emerald-500 text-white border-emerald-500 shadow-md'
                    : 'bg-white dark:bg-[#0c0c0f] border-slate-200 dark:border-white/10 text-slate-600 dark:text-white/60 hover:border-emerald-400/40'
                }`}
              >
                {f === 'todos' ? 'Todos' : ESTATUS_CONFIG[f]?.label || f}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── LISTA DE PACIENTES ─────────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col gap-3">
        <AnimatePresence mode="popLayout">
          {filteredPatients.length === 0 ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center py-16 gap-3"
            >
              <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-white/5 flex items-center justify-center">
                <Users size={22} className="text-slate-400 dark:text-white/30" />
              </div>
              <p className="text-xs text-slate-400 dark:text-white/30 font-medium text-center max-w-[200px]">
                {searchQuery ? `No se encontraron pacientes para "${searchQuery}"` : 'No hay expedientes registrados'}
              </p>
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="text-[11px] text-emerald-500 font-semibold hover:underline"
                >
                  Limpiar búsqueda
                </button>
              )}
            </motion.div>
          ) : (
            filteredPatients.map((patient, idx) => {
              const estatusCfg = getEstatusConfig(patient.appProperties?.estatus || patient.appProperties?.motivo);
              return (
                <motion.div
                  key={patient.id}
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.97 }}
                  transition={{ delay: idx * 0.04 }}
                  onClick={() => onSelectPatient?.(patient)}
                  className="w-full bg-white dark:bg-[#0c0c0f] border border-slate-100 dark:border-white/5 rounded-[22px] p-4 shadow-md hover:shadow-xl dark:hover:border-white/10 hover:scale-[1.01] transition-all duration-300 flex items-center justify-between cursor-pointer group"
                >
                  <div className="flex items-center gap-4">
                    {/* Indicador de estatus */}
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center border ${estatusCfg.color}`}>
                      {estatusCfg.icon}
                    </div>
                    <div>
                      <h4 className="text-slate-800 dark:text-white/90 font-bold text-sm leading-tight">
                        {patient.name}
                      </h4>
                      <div className="flex items-center gap-3 mt-1.5">
                        <span className="text-[10px] text-slate-400 dark:text-white/40 font-medium flex items-center gap-1">
                          <Calendar size={10} />
                          {formatDate(patient.createdTime)}
                        </span>
                        {patient.appProperties?.telefono && (
                          <span className="text-[10px] text-slate-400 dark:text-white/40 font-medium">
                            📱 {patient.appProperties.telefono}
                          </span>
                        )}
                        <span className={`text-[9px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider border ${estatusCfg.color}`}>
                          {estatusCfg.label}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {patient.appProperties?.edad && (
                      <span className="text-[10px] text-slate-400 dark:text-white/30 font-medium">
                        {patient.appProperties.edad}
                      </span>
                    )}
                    <ChevronRight
                      size={16}
                      className="text-slate-300 dark:text-white/20 group-hover:text-emerald-400 transition-colors"
                    />
                  </div>
                </motion.div>
              );
            })
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
