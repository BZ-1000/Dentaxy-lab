/**
 * DocenteView.tsx — Fase 3B
 * Vista del Docente Clínico — alumnos, historias pendientes de firma, calificaciones
 */

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Users, FileText, CheckCircle2, Clock, Pen,
  Star, AlertCircle, ChevronRight, Award, BookOpen
} from 'lucide-react';
import { useDemo } from '../context/DemoContext';
import UAOLayout from '../components/UAOLayout';
import { cn } from '@/lib/utils';

// ─────────────────────────────────────────────────────────────────────────────
// MOCK DATA DEL DOCENTE
// ─────────────────────────────────────────────────────────────────────────────

const GRUPO_DOCENTE = [
  {
    id: 'a1', nombre: 'Rodrigo Martínez Ávalos', semestre: 8, nodo: 'CLIMUZAC I',
    pacientes: 4, procedimientosMes: 31, metaMes: 48, pctMeta: 65,
    historiasPendientes: 2, calificacionActual: 8.5,
  },
  {
    id: 'a2', nombre: 'Daniela Quiñones López', semestre: 8, nodo: 'CLIMUZAC I',
    pacientes: 3, procedimientosMes: 39, metaMes: 48, pctMeta: 81,
    historiasPendientes: 0, calificacionActual: 9.2,
  },
  {
    id: 'a3', nombre: 'Kevin Torres Espinoza', semestre: 7, nodo: 'CLIMUZAC II',
    pacientes: 4, procedimientosMes: 44, metaMes: 48, pctMeta: 92,
    historiasPendientes: 1, calificacionActual: 9.7,
  },
  {
    id: 'a4', nombre: 'Brenda López Soria', semestre: 8, nodo: 'CLIMUZAC I',
    pacientes: 2, procedimientosMes: 22, metaMes: 48, pctMeta: 46,
    historiasPendientes: 3, calificacionActual: 7.1,
  },
];

const HISTORIAS_PENDIENTES = [
  { id: 'h1', paciente: 'María G. Flores Reyes', alumno: 'Rodrigo Martínez Ávalos', tipo: 'Historia completa', fecha: '2026-04-08', urgente: false },
  { id: 'h2', paciente: 'J. Antonio Hernández Cruz', alumno: 'Rodrigo Martínez Ávalos', tipo: 'Nota de evolución', fecha: '2026-04-08', urgente: true },
  { id: 'h3', paciente: 'Roberto C. Leal Sandoval', alumno: 'Kevin Torres Espinoza', tipo: 'Plan de tratamiento', fecha: '2026-04-07', urgente: false },
  { id: 'h4', paciente: 'Ana S. Ruiz Medina', alumno: 'Brenda López Soria', tipo: 'Historia completa', fecha: '2026-04-07', urgente: false },
  { id: 'h5', paciente: 'Elena M. Castro Rivas', alumno: 'Brenda López Soria', tipo: 'Nota de evolución', fecha: '2026-04-06', urgente: true },
  { id: 'h6', paciente: 'Luis A. Mora Delgado', alumno: 'Brenda López Soria', tipo: 'Consentimiento', fecha: '2026-04-05', urgente: false },
];

const PROCEDIMIENTOS_CALIFICAR = [
  { id: 'pc1', alumno: 'Rodrigo M.', paciente: 'M. G. Flores', procedimiento: 'Restauración clase II amalgama', fecha: '2026-04-08', calificado: false },
  { id: 'pc2', alumno: 'Kevin T.', paciente: 'R. C. Leal', procedimiento: 'Impresiones definitivas prótesis', fecha: '2026-04-07', calificado: false },
  { id: 'pc3', alumno: 'Daniela Q.', paciente: 'E. Ramírez', procedimiento: 'Profilaxis completa', fecha: '2026-04-08', calificado: true },
];

// ─────────────────────────────────────────────────────────────────────────────
// CALIFICADOR RÁPIDO (Stars)
// ─────────────────────────────────────────────────────────────────────────────

const Calificador: React.FC<{ procedimientoId: string }> = ({ procedimientoId }) => {
  const [calificacion, setCalificacion] = useState(0);
  const [hover, setHover] = useState(0);
  const [firmado, setFirmado] = useState(false);

  if (firmado) {
    return (
      <div className="flex items-center gap-1.5">
        <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
        <span className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">
          Calificado: {calificacion}/10
        </span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <div className="flex gap-0.5">
        {[2, 4, 6, 8, 10].map(val => (
          <button
            key={val}
            onMouseEnter={() => setHover(val)}
            onMouseLeave={() => setHover(0)}
            onClick={() => setCalificacion(val)}
            className="p-0.5"
          >
            <Star
              className={cn(
                'h-4 w-4 transition-colors',
                (hover || calificacion) >= val
                  ? 'fill-amber-400 text-amber-400'
                  : 'text-zinc-300 dark:text-zinc-700'
              )}
            />
          </button>
        ))}
      </div>
      {calificacion > 0 && (
        <motion.button
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          onClick={() => setFirmado(true)}
          className="text-[10px] font-bold px-2 py-1 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 rounded-lg"
        >
          Firmar ({calificacion}/10)
        </motion.button>
      )}
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// DOCENTE VIEW CONTENT
// ─────────────────────────────────────────────────────────────────────────────

const DocenteViewContent: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useDemo();
  const [tab, setTab] = useState<'alumnos' | 'pendientes' | 'calificar'>('alumnos');
  const [historiasAprobadas, setHistoriasAprobadas] = useState<Set<string>>(new Set());

  React.useEffect(() => {
    if (!isAuthenticated) navigate('/academico');
  }, [isAuthenticated, navigate]);

  const pendientesRestantes = HISTORIAS_PENDIENTES.filter(h => !historiasAprobadas.has(h.id));

  const tabs = [
    { id: 'alumnos' as const,    label: 'Mi Grupo',   icon: Users,    badge: GRUPO_DOCENTE.length.toString() },
    { id: 'pendientes' as const, label: 'Pendientes', icon: Clock,    badge: pendientesRestantes.length > 0 ? pendientesRestantes.length.toString() : undefined, alert: pendientesRestantes.some(h => h.urgente) },
    { id: 'calificar' as const,  label: 'Calificar',  icon: Star,     badge: PROCEDIMIENTOS_CALIFICAR.filter(p => !p.calificado).length.toString() },
  ];

  return (
    <div className="p-4 sm:p-6">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mb-5">
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-white tracking-tight">
          Panel del Docente
        </h1>
        <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
          Dr. Carlos Soto Ramírez · Grupo CLIMUZAC — Semestre 7/8
        </p>
      </motion.div>

      {/* Tabs */}
      <div className="flex gap-2 mb-5 overflow-x-auto pb-1">
        {tabs.map(t => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={cn(
              'flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-medium transition-all whitespace-nowrap shrink-0',
              tab === t.id
                ? 'bg-zinc-900 dark:bg-white text-white dark:text-zinc-900'
                : 'bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300'
            )}
          >
            <t.icon className="h-3.5 w-3.5" />
            {t.label}
            {t.badge && (
              <span className={cn(
                'text-[9px] font-bold px-1.5 py-0.5 rounded-full',
                tab === t.id
                  ? 'bg-white/20'
                  : t.alert ? 'bg-red-500 text-white' : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400'
              )}>{t.badge}</span>
            )}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {/* TAB — Mi Grupo */}
        {tab === 'alumnos' && (
          <motion.div key="alumnos" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {GRUPO_DOCENTE.map((alumno, i) => (
                <motion.div
                  key={alumno.id}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.07 }}
                  className="bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200/80 dark:border-zinc-800/80 p-5"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-2xl bg-violet-100 dark:bg-violet-950/30 flex items-center justify-center">
                        <span className="text-lg">{i === 0 ? '🦷' : i === 1 ? '⭐' : i === 2 ? '🏆' : '⚠️'}</span>
                      </div>
                      <div>
                        <p className="text-xs font-bold text-zinc-900 dark:text-white">{alumno.nombre}</p>
                        <p className="text-[10px] text-zinc-400">{alumno.semestre}° sem · {alumno.nodo}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={cn(
                        'text-lg font-bold',
                        alumno.calificacionActual >= 9 ? 'text-emerald-600' : alumno.calificacionActual >= 7 ? 'text-blue-600' : 'text-red-500'
                      )}>{alumno.calificacionActual}</p>
                      <p className="text-[9px] text-zinc-400">Calif. actual</p>
                    </div>
                  </div>

                  {/* Stats grid */}
                  <div className="grid grid-cols-3 gap-2 mb-3">
                    {[
                      { label: 'Pacientes', value: alumno.pacientes },
                      { label: 'Proc. mes', value: alumno.procedimientosMes },
                      { label: 'Pendientes', value: alumno.historiasPendientes, alert: alumno.historiasPendientes > 1 },
                    ].map(stat => (
                      <div key={stat.label} className="text-center">
                        <p className={cn(
                          'text-base font-bold',
                          stat.alert ? 'text-red-500' : 'text-zinc-900 dark:text-white'
                        )}>{stat.value}</p>
                        <p className="text-[9px] text-zinc-400">{stat.label}</p>
                      </div>
                    ))}
                  </div>

                  {/* Barra meta */}
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-[10px] text-zinc-400">Avance meta semestral</span>
                      <span className={cn(
                        'text-[10px] font-bold',
                        alumno.pctMeta >= 70 ? 'text-emerald-600' : alumno.pctMeta >= 50 ? 'text-amber-600' : 'text-red-500'
                      )}>{alumno.pctMeta}%</span>
                    </div>
                    <div className="h-2 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${alumno.pctMeta}%` }}
                        transition={{ delay: i * 0.07 + 0.3, duration: 0.6 }}
                        className={cn(
                          'h-full rounded-full',
                          alumno.pctMeta >= 70 ? 'bg-emerald-500' : alumno.pctMeta >= 50 ? 'bg-amber-500' : 'bg-red-500'
                        )}
                      />
                    </div>
                  </div>

                  {alumno.historiasPendientes > 0 && (
                    <div className="mt-3 flex items-center gap-1.5 text-[10px] text-amber-600 dark:text-amber-400">
                      <AlertCircle className="h-3 w-3" />
                      {alumno.historiasPendientes} historia(s) pendiente(s) de firma
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* TAB — Pendientes de firma */}
        {tab === 'pendientes' && (
          <motion.div key="pendientes" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            <div className="space-y-3">
              {pendientesRestantes.length === 0 ? (
                <div className="bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200 dark:border-zinc-800 p-8 text-center">
                  <CheckCircle2 className="h-10 w-10 text-emerald-500 mx-auto mb-2" />
                  <p className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">Todo al día</p>
                  <p className="text-xs text-zinc-400 mt-1">No hay historias pendientes de firma</p>
                </div>
              ) : pendientesRestantes.map((h, i) => (
                <motion.div
                  key={h.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className={cn(
                    'bg-white dark:bg-zinc-900 rounded-2xl border p-4 flex items-center gap-4',
                    h.urgente ? 'border-red-200 dark:border-red-800/40' : 'border-zinc-200/80 dark:border-zinc-800/80'
                  )}
                >
                  <div className={cn(
                    'w-9 h-9 rounded-2xl flex items-center justify-center shrink-0',
                    h.urgente ? 'bg-red-100 dark:bg-red-950/30' : 'bg-zinc-100 dark:bg-zinc-800'
                  )}>
                    <FileText className={cn('h-4 w-4', h.urgente ? 'text-red-500' : 'text-zinc-500')} />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <p className="text-xs font-semibold text-zinc-900 dark:text-white truncate">{h.paciente}</p>
                      {h.urgente && <span className="shrink-0 text-[9px] font-bold px-1.5 py-0.5 bg-red-500 text-white rounded-full">URGENTE</span>}
                    </div>
                    <p className="text-[11px] text-zinc-500">{h.tipo} · {h.alumno.split(' ')[0]}</p>
                    <p className="text-[10px] text-zinc-400">{new Date(h.fecha).toLocaleDateString('es-MX', { day: 'numeric', month: 'short' })}</p>
                  </div>

                  <div className="flex gap-2 shrink-0">
                    <button
                      onClick={() => setHistoriasAprobadas(prev => new Set([...prev, h.id]))}
                      className="flex items-center gap-1 text-[10px] font-bold px-3 py-1.5 bg-emerald-500 text-white rounded-xl hover:bg-emerald-600 transition-colors"
                    >
                      <Pen className="h-3 w-3" /> Firmar
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* TAB — Calificar */}
        {tab === 'calificar' && (
          <motion.div key="calificar" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            <div className="space-y-3">
              {PROCEDIMIENTOS_CALIFICAR.map((proc, i) => (
                <motion.div
                  key={proc.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.06 }}
                  className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200/80 dark:border-zinc-800/80 p-4"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <p className="text-xs font-bold text-zinc-900 dark:text-white">{proc.procedimiento}</p>
                      <p className="text-[11px] text-zinc-500 mt-0.5">{proc.alumno} · {proc.paciente}</p>
                      <p className="text-[10px] text-zinc-400 mt-0.5 flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {new Date(proc.fecha).toLocaleDateString('es-MX', { day: 'numeric', month: 'short' })}
                      </p>
                    </div>
                    {proc.calificado && (
                      <span className="text-[10px] font-bold px-2 py-1 bg-emerald-100 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-400 rounded-xl flex items-center gap-1">
                        <CheckCircle2 className="h-3 w-3" /> Calificado
                      </span>
                    )}
                  </div>
                  {!proc.calificado && <Calificador procedimientoId={proc.id} />}
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const DocenteView: React.FC = () => (
  <UAOLayout>
    <DocenteViewContent />
  </UAOLayout>
);

export default DocenteView;
