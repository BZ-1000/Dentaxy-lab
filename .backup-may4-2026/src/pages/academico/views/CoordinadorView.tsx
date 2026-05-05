/**
 * CoordinadorView.tsx — Fase 3C
 * Panel Coordinador Académico — SEM, carga docente, KPIs institucionales CONAEDO/CIEES
 */

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BookOpen, Users, BarChart3, Calendar, Award,
  TrendingUp, Check, X, ChevronDown, ChevronUp,
  GraduationCap, ClipboardList
} from 'lucide-react';
import { MODULOS_SEM, NODOS } from '@/data/uaoMockData';
import { useDemo } from '../context/DemoContext';
import UAOLayout from '../components/UAOLayout';
import { cn } from '@/lib/utils';

// ─────────────────────────────────────────────────────────────────────────────
// MOCK DATA COORDINADOR
// ─────────────────────────────────────────────────────────────────────────────

const DOCENTES = [
  { id: 'd1', nombre: 'Dr. Carlos Soto Ramírez',     nodo: 'CLIMUZAC', alumnos: 6,  horas: 20, materias: 2, pctAsistencia: 98 },
  { id: 'd2', nombre: 'Dra. Patricia Vega Núñez',    nodo: 'CLIJANI',  alumnos: 4,  horas: 16, materias: 1, pctAsistencia: 95 },
  { id: 'd3', nombre: 'Dr. Manuel Ortega Leal',      nodo: 'CLIZAC',   alumnos: 8,  horas: 24, materias: 3, pctAsistencia: 100 },
  { id: 'd4', nombre: 'Dra. Silvia Ramírez Torres',  nodo: 'CLICAMP',  alumnos: 7,  horas: 20, materias: 2, pctAsistencia: 92 },
  { id: 'd5', nombre: 'Dr. Javier Morales Díaz',     nodo: 'CLITACO',  alumnos: 5,  horas: 16, materias: 2, pctAsistencia: 88 },
];

const ALUMNOS_TOTALES = { activos: 164, enRiesgo: 9, becados: 42, extranjeros: 3, bajas: 2 };

const INDICADORES_CONAEDO = [
  { nombre: 'Eficiencia terminal', valor: 82, meta: 80, unidad: '%', ok: true },
  { nombre: 'Tasa de titulación', valor: 91, meta: 85, unidad: '%', ok: true },
  { nombre: 'Procedimientos por alumno/semestre', valor: 156, meta: 200, unidad: 'proc.', ok: false },
  { nombre: 'Pacientes nuevos / mes', valor: 1247, meta: 1000, unidad: 'pacientes', ok: true },
  { nombre: 'Docentes con posgrado', valor: 78, meta: 75, unidad: '%', ok: true },
  { nombre: 'Alumnos en riesgo académico', valor: 9, meta: 'max 10', unidad: '', ok: true },
];

const SEMESTRE_ACTUAL = {
  nombre: '2026-A (Primavera)',
  inicio: '2026-01-20',
  fin: '2026-06-12',
  semanas: 20,
  semanaActual: 11,
};

// ─────────────────────────────────────────────────────────────────────────────
// PLAN SEM TABLA
// ─────────────────────────────────────────────────────────────────────────────

const PlanSEM: React.FC = () => {
  const [moduloAbierto, setModuloAbierto] = useState<string | null>(null);

  const colorMap: Record<string, string> = {
    emerald: 'text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-800',
    blue:    'text-blue-700 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800',
    violet:  'text-violet-700 dark:text-violet-400 bg-violet-50 dark:bg-violet-950/20 border-violet-200 dark:border-violet-800',
    amber:   'text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-800',
    rose:    'text-rose-700 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/20 border-rose-200 dark:border-rose-800',
  };

  return (
    <div className="bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200/80 dark:border-zinc-800/80 overflow-hidden">
      <div className="px-5 py-4 border-b border-zinc-100 dark:border-zinc-800">
        <h2 className="text-sm font-bold text-zinc-900 dark:text-white">Plan SEM — Estructura Curricular UAO</h2>
        <p className="text-xs text-zinc-400 mt-0.5">Sistema de Educación Modular · 5 módulos · 10 semestres</p>
      </div>
      <div className="p-4 space-y-2">
        {MODULOS_SEM.map((mod, i) => {
          const esActivo = mod.num === 'IV'; // Módulo actual del semestre
          const colorCls = colorMap[mod.color] ?? colorMap.blue;
          const abierto = moduloAbierto === mod.num;

          return (
            <motion.div
              key={mod.num}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}
              className={cn('rounded-2xl border overflow-hidden', esActivo ? colorCls : 'border-zinc-200 dark:border-zinc-800')}
            >
              <button
                onClick={() => setModuloAbierto(abierto ? null : mod.num)}
                className="w-full flex items-center gap-3 px-4 py-3 text-left"
              >
                <div className={cn(
                  'w-8 h-8 rounded-xl flex items-center justify-center text-sm font-bold shrink-0',
                  esActivo ? 'bg-white/60 dark:bg-zinc-900/60' : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-500'
                )}>
                  {mod.num}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-xs font-bold truncate">{mod.nombre}</p>
                    {esActivo && <span className="shrink-0 text-[9px] font-bold px-1.5 py-0.5 bg-amber-500 text-white rounded-full">ACTIVO</span>}
                  </div>
                  <p className="text-[10px] opacity-70 truncate">{mod.eje}</p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-[10px] opacity-60">Sem. {mod.semestres}</span>
                  {abierto ? <ChevronUp className="h-3.5 w-3.5 opacity-50" /> : <ChevronDown className="h-3.5 w-3.5 opacity-50" />}
                </div>
              </button>

              <AnimatePresence>
                {abierto && (
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: 'auto' }}
                    exit={{ height: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="px-4 pb-3 pt-0">
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-[11px]">
                        {[
                          { k: 'Semestres', v: mod.semestres },
                          { k: 'Eje temático', v: mod.eje },
                          { k: 'Alumnos', v: esActivo ? '82 alumnos' : '—' },
                          { k: 'Docentes', v: esActivo ? '5 docentes' : '—' },
                          { k: 'Clínicas', v: esActivo ? 'CLIMUZAC, CLIZAC' : '—' },
                        ].map(item => (
                          <div key={item.k}>
                            <p className="text-[9px] font-bold uppercase tracking-wide opacity-60">{item.k}</p>
                            <p className="font-medium">{item.v}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// CARGA DOCENTE TABLE
// ─────────────────────────────────────────────────────────────────────────────

const CargaDocente: React.FC = () => (
  <div className="bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200/80 dark:border-zinc-800/80 overflow-hidden">
    <div className="px-5 py-4 border-b border-zinc-100 dark:border-zinc-800">
      <h2 className="text-sm font-bold text-zinc-900 dark:text-white">Carga Académica Docente</h2>
      <p className="text-xs text-zinc-400 mt-0.5">{DOCENTES.length} docentes clínicos activos</p>
    </div>
    <div className="overflow-x-auto">
      <table className="w-full min-w-[480px]">
        <thead>
          <tr className="bg-zinc-50 dark:bg-zinc-800/40">
            {['Docente', 'Nodo', 'Alumnos', 'Hrs/sem', 'Materias', 'Asistencia'].map(h => (
              <th key={h} className="text-[10px] text-zinc-400 font-semibold text-left px-4 py-2.5">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {DOCENTES.map((d, i) => (
            <motion.tr
              key={d.id}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              className="border-t border-zinc-100 dark:border-zinc-800"
            >
              <td className="px-4 py-3">
                <p className="text-xs font-semibold text-zinc-900 dark:text-white">{d.nombre}</p>
              </td>
              <td className="px-4 py-3">
                <span className="text-[10px] px-2 py-0.5 bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 rounded-full font-medium">{d.nodo}</span>
              </td>
              <td className="px-4 py-3 text-center">
                <span className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">{d.alumnos}</span>
              </td>
              <td className="px-4 py-3 text-center">
                <span className="text-xs text-zinc-600 dark:text-zinc-400">{d.horas}h</span>
              </td>
              <td className="px-4 py-3 text-center">
                <span className="text-xs text-zinc-600 dark:text-zinc-400">{d.materias}</span>
              </td>
              <td className="px-4 py-3">
                <div className="flex items-center gap-2">
                  <div className="w-14 h-1.5 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                    <div
                      className={cn('h-full rounded-full', d.pctAsistencia >= 95 ? 'bg-emerald-500' : d.pctAsistencia >= 85 ? 'bg-amber-500' : 'bg-red-500')}
                      style={{ width: `${d.pctAsistencia}%` }}
                    />
                  </div>
                  <span className={cn(
                    'text-[11px] font-bold',
                    d.pctAsistencia >= 95 ? 'text-emerald-600' : d.pctAsistencia >= 85 ? 'text-amber-600' : 'text-red-500'
                  )}>{d.pctAsistencia}%</span>
                </div>
              </td>
            </motion.tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

// ─────────────────────────────────────────────────────────────────────────────
// INDICADORES CONAEDO/CIEES
// ─────────────────────────────────────────────────────────────────────────────

const IndicadoresAcreditacion: React.FC = () => (
  <div className="bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200/80 dark:border-zinc-800/80 overflow-hidden">
    <div className="px-5 py-4 border-b border-zinc-100 dark:border-zinc-800">
      <h2 className="text-sm font-bold text-zinc-900 dark:text-white flex items-center gap-2">
        <Award className="h-4 w-4 text-amber-500" />
        Indicadores CONAEDO / CIEES
      </h2>
      <p className="text-xs text-zinc-400 mt-0.5">Autoevaluación institucional — ciclo 2026</p>
    </div>
    <div className="p-4 space-y-3">
      {INDICADORES_CONAEDO.map((ind, i) => (
        <motion.div
          key={ind.nombre}
          initial={{ opacity: 0, x: -6 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: i * 0.05 }}
          className="flex items-center gap-3"
        >
          <div className={cn(
            'w-6 h-6 rounded-full flex items-center justify-center shrink-0',
            ind.ok ? 'bg-emerald-100 dark:bg-emerald-950/30' : 'bg-red-100 dark:bg-red-950/30'
          )}>
            {ind.ok
              ? <Check className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
              : <X className="h-3.5 w-3.5 text-red-500" />}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs text-zinc-700 dark:text-zinc-300 leading-snug">{ind.nombre}</p>
          </div>
          <div className="text-right shrink-0">
            <p className={cn(
              'text-xs font-bold',
              ind.ok ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-500'
            )}>{ind.valor} {ind.unidad}</p>
            <p className="text-[9px] text-zinc-400">meta: {ind.meta} {ind.unidad}</p>
          </div>
        </motion.div>
      ))}
    </div>
  </div>
);

// ─────────────────────────────────────────────────────────────────────────────
// COORDINADOR VIEW CONTENT
// ─────────────────────────────────────────────────────────────────────────────

const CoordinadorViewContent: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useDemo();
  const [tab, setTab] = useState<'sem' | 'docentes' | 'indicadores'>('sem');

  React.useEffect(() => {
    if (!isAuthenticated) navigate('/academico');
  }, [isAuthenticated, navigate]);

  const semPct = Math.round((SEMESTRE_ACTUAL.semanaActual / SEMESTRE_ACTUAL.semanas) * 100);

  const tabs = [
    { id: 'sem' as const,         label: 'Plan SEM',     icon: BookOpen },
    { id: 'docentes' as const,    label: 'Carga Docente', icon: Users },
    { id: 'indicadores' as const, label: 'CONAEDO/CIEES', icon: Award },
  ];

  return (
    <div className="p-4 sm:p-6">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mb-5">
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-white tracking-tight">
          Panel Coordinador Académico
        </h1>
        <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
          {SEMESTRE_ACTUAL.nombre} · Semana {SEMESTRE_ACTUAL.semanaActual} de {SEMESTRE_ACTUAL.semanas}
        </p>
      </motion.div>

      {/* KPIs rápidos */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
        {[
          { label: 'Alumnos activos',    value: ALUMNOS_TOTALES.activos,   icon: GraduationCap, color: '#2563EB' },
          { label: 'Alumnos en riesgo',  value: ALUMNOS_TOTALES.enRiesgo,  icon: ClipboardList,  color: '#DC2626' },
          { label: 'Docentes activos',   value: DOCENTES.length,            icon: Users,          color: '#059669' },
          { label: 'Avance semestral',   value: `${semPct}%`,               icon: BarChart3,      color: '#7C3AED' },
        ].map((kpi, i) => (
          <motion.div
            key={kpi.label}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06 }}
            className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200/80 dark:border-zinc-800/80 p-4"
          >
            <div className="w-8 h-8 rounded-xl flex items-center justify-center mb-2" style={{ backgroundColor: kpi.color + '15' }}>
              <kpi.icon className="h-4 w-4" style={{ color: kpi.color }} />
            </div>
            <p className="text-xl font-bold text-zinc-900 dark:text-white">{kpi.value}</p>
            <p className="text-[11px] text-zinc-400 mt-0.5">{kpi.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Barra semestral */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200/80 dark:border-zinc-800/80 p-4 mb-5"
      >
        <div className="flex justify-between mb-1.5">
          <span className="text-xs font-medium text-zinc-700 dark:text-zinc-300">Avance del semestre</span>
          <div className="text-right">
            <span className="text-xs font-bold text-zinc-900 dark:text-white">Sem. {SEMESTRE_ACTUAL.semanaActual}/{SEMESTRE_ACTUAL.semanas}</span>
            <span className="text-[10px] text-zinc-400 ml-2">{SEMESTRE_ACTUAL.inicio} → {SEMESTRE_ACTUAL.fin}</span>
          </div>
        </div>
        <div className="h-3 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${semPct}%` }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="h-full rounded-full bg-gradient-to-r from-violet-500 to-blue-500"
          />
        </div>
        <div className="flex justify-between mt-1.5">
          <span className="text-[10px] text-zinc-400">Inicio</span>
          <span className="text-[10px] font-bold text-violet-600 dark:text-violet-400">▲ Hoy ({semPct}%)</span>
          <span className="text-[10px] text-zinc-400">Fin exámenes</span>
        </div>
      </motion.div>

      {/* Tabs */}
      <div className="flex gap-2 mb-5 overflow-x-auto">
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
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {tab === 'sem' && (
          <motion.div key="sem" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            <PlanSEM />
          </motion.div>
        )}
        {tab === 'docentes' && (
          <motion.div key="docentes" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            <CargaDocente />
          </motion.div>
        )}
        {tab === 'indicadores' && (
          <motion.div key="indicadores" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            <IndicadoresAcreditacion />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const CoordinadorView: React.FC = () => (
  <UAOLayout>
    <CoordinadorViewContent />
  </UAOLayout>
);

export default CoordinadorView;
