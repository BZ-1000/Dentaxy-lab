/**
 * DocenteView.tsx — Fase 2 (Multijugador)
 * Vista del Docente Clínico conectada a Supabase Real-Time.
 * Permite ver historiales creados por los alumnos y firmarlos en el Sandbox temporal.
 */

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Users, FileText, CheckCircle2, Clock, Pen,
  Star, AlertCircle, Loader2
} from 'lucide-react';
import { useDemo } from '../context/DemoContext';
import { useUaoSandbox, SandboxRecord } from '../context/SandboxContext';
import UAOLayout from '../components/UAOLayout';
import { cn } from '@/lib/utils';

// ─────────────────────────────────────────────────────────────────────────────
// MOCK DATA PARA LA PESTAÑA DE 'MI GRUPO' (Fallback híbrido)
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
];

// ─────────────────────────────────────────────────────────────────────────────
// CALIFICADOR RÁPIDO (Stars)
// ─────────────────────────────────────────────────────────────────────────────

const Calificador: React.FC<{ recordId: string; calificado: boolean; onSubmitFirma: (id: string, f: string) => Promise<boolean> }> = ({ recordId, calificado, onSubmitFirma }) => {
  const [calificacion, setCalificacion] = useState(0);
  const [hover, setHover] = useState(0);
  const [loading, setLoading] = useState(false);

  if (calificado) {
    return (
      <div className="flex items-center gap-1.5">
        <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
        <span className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">
          Aprobado por el Docente
        </span>
      </div>
    );
  }

  const handleSign = async () => {
    setLoading(true);
    await onSubmitFirma(recordId, `Firma-${calificacion}-Estrellas`);
    setLoading(false);
  };

  return (
    <div className="flex items-center gap-2">
      <div className="flex gap-0.5">
        {[2, 4, 6, 8, 10].map(val => (
          <button
            key={val}
            disabled={loading}
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
          onClick={handleSign}
          disabled={loading}
          className="text-[10px] font-bold px-2 flex items-center justify-center gap-1 py-1 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 rounded-lg hover:bg-zinc-800 transition-colors"
        >
          {loading ? <Loader2 className="h-3 w-3 animate-spin"/> : `Firmar (${calificacion}/10)`}
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
  const { records, patients, isLoading, approveRecord } = useUaoSandbox();
  const [tab, setTab] = useState<'alumnos' | 'pendientes' | 'calificar'>('pendientes');

  React.useEffect(() => {
    if (!isAuthenticated) navigate('/academico');
  }, [isAuthenticated, navigate]);

  // Cruzar expedientes con pacientes del Sandbox para mostar su nombre real
  const pendientes = records.filter(r => r.estado !== 'aprobado');
  const calificados = records.filter(r => r.estado === 'aprobado');

  const getPatientName = (patient_id: string) => {
    const p = patients.find(p => p.id === patient_id);
    return p ? p.nombre : 'Paciente Sandbox';
  };

  const tabs = [
    { id: 'alumnos' as const,    label: 'Mi Grupo (Demo)',   icon: Users,    badge: GRUPO_DOCENTE.length.toString() },
    { id: 'pendientes' as const, label: 'Pendientes', icon: Clock,    badge: pendientes.length > 0 ? pendientes.length.toString() : undefined, alert: pendientes.length > 0 },
    { id: 'calificar' as const,  label: 'Historial',  icon: Star,     badge: calificados.length.toString() },
  ];

  return (
    <div className="p-4 sm:p-6 pb-24">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mb-5 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-white tracking-tight flex items-center gap-2">
            Panel del Docente
            {isLoading && <Loader2 className="h-5 w-5 animate-spin text-blue-500" />}
          </h1>
          <p className="text-sm font-medium text-emerald-600 dark:text-emerald-400 mt-1">
            Recepción y firma de historiales clínicos (Real-Time Sandbox)
          </p>
        </div>
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
        {/* TAB — Mi Grupo (Estático híbrido para demo visual) */}
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
                        <span className="text-lg">{i === 0 ? '🦷' : i === 1 ? '⭐' : '🏆'}</span>
                      </div>
                      <div>
                        <p className="text-xs font-bold text-zinc-900 dark:text-white">{alumno.nombre}</p>
                        <p className="text-[10px] text-zinc-400">{alumno.semestre}° sem · {alumno.nodo}</p>
                      </div>
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
                        <p className={cn('text-base font-bold', stat.alert ? 'text-red-500' : 'text-zinc-900 dark:text-white')}>{stat.value}</p>
                        <p className="text-[9px] text-zinc-400">{stat.label}</p>
                      </div>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* TAB — Pendientes de firma */}
        {tab === 'pendientes' && (
          <motion.div key="pendientes" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            <div className="space-y-3">
              {pendientes.length === 0 ? (
                <div className="bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200 border-dashed dark:border-zinc-800 p-12 text-center flex flex-col items-center">
                  <div className="w-16 h-16 rounded-full bg-emerald-50 dark:bg-emerald-900/20 flex items-center justify-center mb-4">
                    <CheckCircle2 className="h-8 w-8 text-emerald-500 mx-auto" />
                  </div>
                  <p className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">Bandeja Vacía</p>
                  <p className="text-xs text-zinc-400 mt-1 max-w-sm">
                    No hay historiales sin firmar en el ecosistema. Cuando un Alumno complete un registro, aparecerá inmediatamente aquí para tu validación.
                  </p>
                </div>
              ) : pendientes.map((h, i) => (
                <motion.div
                  key={h.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className={cn(
                    'bg-white dark:bg-zinc-900 rounded-2xl border p-4 flex items-center gap-4 transition-shadow hover:shadow-md border-amber-200/50 dark:border-amber-900/40' 
                  )}
                >
                  <div className="w-9 h-9 rounded-2xl flex items-center justify-center shrink-0 bg-amber-100 dark:bg-amber-950/30">
                    <FileText className="h-4 w-4 text-amber-600" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <p className="text-xs font-semibold text-zinc-900 dark:text-white truncate">PCT: {getPatientName(h.patient_id)}</p>
                    </div>
                    <p className="text-[11px] text-zinc-500 font-medium">Doc: {h.tipo.toUpperCase()}</p>
                    <p className="text-[10px] text-zinc-400">Creado por: {h.creador_nombre || h.creador_rol} · {new Date(h.created_at).toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' })}</p>
                  </div>

                  <div className="flex gap-2 shrink-0 pr-2">
                    <button
                      onClick={async () => { await approveRecord(h.id, 'Firma-Aprobatoria-10'); }}
                      className="flex items-center gap-1.5 text-[11px] font-bold px-4 py-2 bg-emerald-500 text-white rounded-xl shadow-lg shadow-emerald-500/20 hover:bg-emerald-600 transition-colors"
                    >
                      <Pen className="h-3 w-3" /> Revisar y Firmar
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* TAB — Calificar / Historial */}
        {tab === 'calificar' && (
          <motion.div key="calificar" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            <div className="space-y-3">
              {calificados.length === 0 ? (
                <p className="text-center text-xs text-zinc-500 pt-10">No has firmado ningún procedimiento aún en esta sesión.</p>
              ) : calificados.map((proc, i) => (
                <motion.div
                  key={proc.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.06 }}
                  className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200/80 dark:border-zinc-800/80 p-4"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <p className="text-xs font-bold text-zinc-900 dark:text-white">{proc.tipo.toUpperCase()}</p>
                      <p className="text-[11px] text-zinc-500 mt-0.5">Paciente: {getPatientName(proc.patient_id)}</p>
                      <p className="text-[10px] text-zinc-400 mt-0.5 flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {new Date(proc.created_at).toLocaleTimeString('es-MX')}
                      </p>
                    </div>
                    {proc.estado === 'aprobado' && (
                      <span className="text-[10px] font-bold px-2 py-1 bg-emerald-100 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-400 rounded-xl flex items-center gap-1">
                        <CheckCircle2 className="h-3 w-3" /> Validado
                      </span>
                    )}
                  </div>
                  <Calificador recordId={proc.id} calificado={true} onSubmitFirma={approveRecord} />
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
