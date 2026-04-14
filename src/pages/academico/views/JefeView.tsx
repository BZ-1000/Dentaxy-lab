/**
 * JefeView.tsx — Fase 3A
 * Dashboard operativo del Jefe de Clínica
 * Visión completa de su nodo: sillones, alumnos, pacientes y alertas
 */

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Stethoscope, Users, Activity, AlertTriangle,
  CheckCircle2, Clock, Package, ChevronRight,
  BedDouble, TrendingUp, ArrowUpRight, MoreHorizontal,
  XCircle, Circle
} from 'lucide-react';
import { NODOS, PACIENTES_DEMO } from '@/data/uaoMockData';
import { useDemo } from '../context/DemoContext';
import UAOLayout from '../components/UAOLayout';
import { cn } from '@/lib/utils';

// ─────────────────────────────────────────────────────────────────────────────
// DATOS DEMO DEL NODO
// ─────────────────────────────────────────────────────────────────────────────

const nodoActivo = NODOS[0]; // CLIMUZAC — nodo del Jefe en demo

const ALUMNOS_NODO = [
  { id: 'a1', nombre: 'Rodrigo Martínez Ávalos', semestre: 8, pacientes: 4, procedimientosHoy: 2, pctMeta: 65, estado: 'activo' as const },
  { id: 'a2', nombre: 'Daniela Quiñones López',  semestre: 8, pacientes: 3, procedimientosHoy: 1, pctMeta: 82, estado: 'activo' as const },
  { id: 'a3', nombre: 'Kevin Torres Espinoza',   semestre: 7, pacientes: 4, procedimientosHoy: 3, pctMeta: 91, estado: 'activo' as const },
  { id: 'a4', nombre: 'Brenda López Soria',      semestre: 8, pacientes: 2, procedimientosHoy: 0, pctMeta: 45, estado: 'retraso' as const },
  { id: 'a5', nombre: 'Iván Delgado Peña',       semestre: 7, pacientes: 5, procedimientosHoy: 2, pctMeta: 73, estado: 'activo' as const },
  { id: 'a6', nombre: 'Alejandra Soto Reyes',    semestre: 8, pacientes: 3, procedimientosHoy: 1, pctMeta: 58, estado: 'activo' as const },
];

const SILLONES = [
  { num: 1, estado: 'ocupado', alumno: 'R. Martínez', paciente: 'M. G. Flores' },
  { num: 2, estado: 'ocupado', alumno: 'D. Quiñones', paciente: 'J. A. Hernández' },
  { num: 3, estado: 'libre',   alumno: null, paciente: null },
  { num: 4, estado: 'ocupado', alumno: 'K. Torres',   paciente: 'R. C. Leal' },
  { num: 5, estado: 'libre',   alumno: null, paciente: null },
  { num: 6, estado: 'ocupado', alumno: 'B. López',    paciente: 'E. Ramírez' },
  { num: 7, estado: 'ocupado', alumno: 'I. Delgado',  paciente: 'C. Mora' },
  { num: 8, estado: 'mantenimiento', alumno: null, paciente: null },
  { num: 9, estado: 'ocupado', alumno: 'A. Soto',     paciente: 'L. Vega' },
  { num: 10, estado: 'libre',  alumno: null, paciente: null },
  { num: 11, estado: 'ocupado', alumno: 'R. Martínez', paciente: 'S. Núñez' },
  { num: 12, estado: 'libre',  alumno: null, paciente: null },
];

const INVENTARIO_CRITICO = [
  { producto: 'Anestesia Lidocaína 2% c/epinefrina', stock: 8, minimo: 20, unidad: 'carpules', urgente: true },
  { producto: 'Guantes nitrilo talla M', stock: 42, minimo: 100, unidad: 'piezas', urgente: true },
  { producto: 'Papel de articular 40µ', stock: 3, minimo: 5, unidad: 'libretas', urgente: false },
  { producto: 'Seda dental 3-0', stock: 12, minimo: 24, unidad: 'rollos', urgente: false },
];

// ─────────────────────────────────────────────────────────────────────────────
// MAPA DE SILLONES
// ─────────────────────────────────────────────────────────────────────────────

const MapaSillones: React.FC = () => {
  const [sillonSel, setSillonSel] = useState<number | null>(null);

  const colorSillon = (estado: string) => ({
    ocupado: 'bg-blue-100 dark:bg-blue-950/40 border-blue-300 dark:border-blue-700 text-blue-700 dark:text-blue-400',
    libre: 'bg-emerald-50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-800 text-emerald-600',
    mantenimiento: 'bg-amber-50 dark:bg-amber-950/20 border-amber-300 dark:border-amber-700 text-amber-600',
  })[estado] ?? '';

  const iconoSillon = (estado: string) => ({
    ocupado: <Activity className="h-3.5 w-3.5" />,
    libre: <CheckCircle2 className="h-3.5 w-3.5" />,
    mantenimiento: <AlertTriangle className="h-3.5 w-3.5" />,
  })[estado];

  return (
    <div className="bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200/80 dark:border-zinc-800/80 overflow-hidden">
      <div className="flex items-center justify-between px-5 py-4 border-b border-zinc-100 dark:border-zinc-800">
        <div>
          <h2 className="text-sm font-bold text-zinc-900 dark:text-white">Mapa de Sillones</h2>
          <p className="text-xs text-zinc-400 mt-0.5">
            {SILLONES.filter(s => s.estado === 'ocupado').length} ocupados ·{' '}
            {SILLONES.filter(s => s.estado === 'libre').length} libres ·{' '}
            {SILLONES.filter(s => s.estado === 'mantenimiento').length} en mantenimiento
          </p>
        </div>
        <BedDouble className="h-5 w-5 text-zinc-400" />
      </div>
      <div className="p-4 grid grid-cols-4 sm:grid-cols-6 gap-2">
        {SILLONES.map((s, i) => (
          <motion.button
            key={s.num}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.03 }}
            onClick={() => setSillonSel(prev => prev === s.num ? null : s.num)}
            className={cn(
              'flex flex-col items-center gap-1 p-2.5 rounded-2xl border-2 transition-all text-center',
              colorSillon(s.estado),
              sillonSel === s.num && 'ring-2 ring-zinc-900 dark:ring-white ring-offset-1'
            )}
          >
            {iconoSillon(s.estado)}
            <span className="text-[11px] font-bold">S{s.num}</span>
            {s.alumno && <span className="text-[9px] leading-none opacity-75 truncate w-full">{s.alumno.split(' ')[0]}</span>}
          </motion.button>
        ))}
      </div>

      {/* Tooltip sillón seleccionado */}
      {sillonSel && (() => {
        const s = SILLONES.find(x => x.num === sillonSel)!;
        return (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="border-t border-zinc-100 dark:border-zinc-800 px-5 py-3 bg-zinc-50 dark:bg-zinc-800/40"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-zinc-900 dark:text-white">Sillón {sillonSel}</p>
                {s.alumno ? (
                  <p className="text-xs text-zinc-500 mt-0.5">
                    Alumno: <strong>{s.alumno}</strong> · Paciente: {s.paciente}
                  </p>
                ) : (
                  <p className="text-xs text-zinc-500 mt-0.5">
                    {s.estado === 'mantenimiento' ? 'En mantenimiento preventivo' : 'Sillón disponible'}
                  </p>
                )}
              </div>
              <button onClick={() => setSillonSel(null)}>
                <XCircle className="h-4 w-4 text-zinc-400" />
              </button>
            </div>
          </motion.div>
        );
      })()}
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// TABLA DE ALUMNOS
// ─────────────────────────────────────────────────────────────────────────────

const TablaAlumnos: React.FC = () => (
  <div className="bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200/80 dark:border-zinc-800/80 overflow-hidden">
    <div className="flex items-center justify-between px-5 py-4 border-b border-zinc-100 dark:border-zinc-800">
      <div>
        <h2 className="text-sm font-bold text-zinc-900 dark:text-white">Alumnos del Nodo</h2>
        <p className="text-xs text-zinc-400 mt-0.5">{ALUMNOS_NODO.length} activos hoy</p>
      </div>
      <Users className="h-5 w-5 text-zinc-400" />
    </div>
    <div className="overflow-x-auto">
      <table className="w-full min-w-[520px]">
        <thead>
          <tr className="bg-zinc-50/80 dark:bg-zinc-800/40">
            <th className="text-[10px] text-zinc-400 font-semibold text-left px-5 py-2.5">Alumno</th>
            <th className="text-[10px] text-zinc-400 font-semibold text-center px-3 py-2.5">Sem.</th>
            <th className="text-[10px] text-zinc-400 font-semibold text-center px-3 py-2.5">Pacientes</th>
            <th className="text-[10px] text-zinc-400 font-semibold text-center px-3 py-2.5">Proc. hoy</th>
            <th className="text-[10px] text-zinc-400 font-semibold text-left px-5 py-2.5">Meta</th>
          </tr>
        </thead>
        <tbody>
          {ALUMNOS_NODO.map((a, i) => (
            <motion.tr
              key={a.id}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.04 }}
              className="border-t border-zinc-100 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800/30 transition-colors"
            >
              <td className="px-5 py-3">
                <div className="flex items-center gap-2.5">
                  <div className={cn(
                    'w-2 h-2 rounded-full shrink-0',
                    a.estado === 'retraso' ? 'bg-red-500' : 'bg-emerald-500'
                  )} />
                  <span className="text-xs font-semibold text-zinc-900 dark:text-white">{a.nombre}</span>
                </div>
              </td>
              <td className="px-3 py-3 text-center">
                <span className="text-xs text-zinc-500">{a.semestre}°</span>
              </td>
              <td className="px-3 py-3 text-center">
                <span className="text-xs font-medium text-zinc-700 dark:text-zinc-300">{a.pacientes}</span>
              </td>
              <td className="px-3 py-3 text-center">
                <span className={cn(
                  'text-xs font-semibold',
                  a.procedimientosHoy > 0 ? 'text-blue-600 dark:text-blue-400' : 'text-zinc-400'
                )}>{a.procedimientosHoy}</span>
              </td>
              <td className="px-5 py-3">
                <div className="flex items-center gap-2">
                  <div className="w-20 h-1.5 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${a.pctMeta}%` }}
                      transition={{ delay: i * 0.04 + 0.2, duration: 0.5 }}
                      className={cn(
                        'h-full rounded-full',
                        a.pctMeta >= 70 ? 'bg-emerald-500' : a.pctMeta >= 50 ? 'bg-amber-500' : 'bg-red-500'
                      )}
                    />
                  </div>
                  <span className={cn(
                    'text-[11px] font-bold w-8',
                    a.pctMeta >= 70 ? 'text-emerald-600' : a.pctMeta >= 50 ? 'text-amber-600' : 'text-red-500'
                  )}>{a.pctMeta}%</span>
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
// INVENTARIO CRÍTICO
// ─────────────────────────────────────────────────────────────────────────────

const InventarioCritico: React.FC = () => (
  <div className="bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200/80 dark:border-zinc-800/80 overflow-hidden">
    <div className="flex items-center justify-between px-5 py-4 border-b border-zinc-100 dark:border-zinc-800">
      <div>
        <h2 className="text-sm font-bold text-zinc-900 dark:text-white">Inventario Crítico</h2>
        <p className="text-xs text-zinc-400 mt-0.5">{INVENTARIO_CRITICO.filter(i => i.urgente).length} insumos por debajo del mínimo</p>
      </div>
      <Package className="h-5 w-5 text-zinc-400" />
    </div>
    <div className="p-4 space-y-2.5">
      {INVENTARIO_CRITICO.map((item, i) => {
        const pct = Math.round((item.stock / item.minimo) * 100);
        return (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.06 }}
            className={cn(
              'p-3 rounded-2xl border',
              item.urgente
                ? 'bg-red-50 dark:bg-red-950/20 border-red-200/60 dark:border-red-800/40'
                : 'bg-amber-50 dark:bg-amber-950/20 border-amber-200/60 dark:border-amber-800/40'
            )}
          >
            <div className="flex items-start justify-between gap-2 mb-2">
              <p className={cn(
                'text-xs font-semibold leading-snug',
                item.urgente ? 'text-red-700 dark:text-red-400' : 'text-amber-700 dark:text-amber-400'
              )}>{item.producto}</p>
              {item.urgente && (
                <span className="shrink-0 text-[9px] font-bold px-1.5 py-0.5 bg-red-500 text-white rounded-full">URGENTE</span>
              )}
            </div>
            <div className="flex items-center gap-3">
              <div className="flex-1 h-1.5 bg-white/60 dark:bg-zinc-800/60 rounded-full overflow-hidden">
                <div
                  className={cn('h-full rounded-full', item.urgente ? 'bg-red-500' : 'bg-amber-500')}
                  style={{ width: `${Math.min(pct, 100)}%` }}
                />
              </div>
              <span className={cn(
                'text-[11px] font-bold shrink-0',
                item.urgente ? 'text-red-600 dark:text-red-400' : 'text-amber-600 dark:text-amber-400'
              )}>
                {item.stock}/{item.minimo} {item.unidad}
              </span>
            </div>
          </motion.div>
        );
      })}
    </div>
  </div>
);

// ─────────────────────────────────────────────────────────────────────────────
// JEFE VIEW CONTENT
// ─────────────────────────────────────────────────────────────────────────────

const JefeViewContent: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useDemo();

  React.useEffect(() => {
    if (!isAuthenticated) navigate('/academico');
  }, [isAuthenticated, navigate]);

  const sOcupados = SILLONES.filter(s => s.estado === 'ocupado').length;
  const sTotal = SILLONES.length;

  return (
    <div className="p-4 sm:p-6">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-white tracking-tight">
          Panel del Jefe de Clínica
        </h1>
        <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
          {nodoActivo.nombre} — {nodoActivo.nombreCompleto}
        </p>
      </motion.div>

      {/* KPIs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        {[
          { label: 'Sillones en uso', value: `${sOcupados}/${sTotal}`, icon: BedDouble,     color: '#2563EB', sub: `${Math.round(sOcupados/sTotal*100)}% ocupación` },
          { label: 'Alumnos hoy',    value: ALUMNOS_NODO.length,        icon: Users,          color: '#059669', sub: `${ALUMNOS_NODO.filter(a=>a.estado==='retraso').length} en retraso` },
          { label: 'Pacientes hoy',  value: nodoActivo.pacientesHoy,    icon: Stethoscope,    color: '#7C3AED', sub: 'Atendidos en turno' },
          { label: 'Insumos críticos', value: INVENTARIO_CRITICO.filter(i=>i.urgente).length, icon: AlertTriangle, color: '#DC2626', sub: 'Por reponer urgente' },
        ].map((kpi, i) => (
          <motion.div
            key={kpi.label}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.07 }}
            className="bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200/80 dark:border-zinc-800/80 p-5"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="w-9 h-9 rounded-2xl flex items-center justify-center"
                style={{ backgroundColor: kpi.color + '15' }}>
                <kpi.icon className="h-4.5 w-4.5" style={{ color: kpi.color }} />
              </div>
            </div>
            <p className="text-2xl font-bold text-zinc-900 dark:text-white">{kpi.value}</p>
            <p className="text-xs font-medium text-zinc-600 dark:text-zinc-400 mt-0.5">{kpi.label}</p>
            <p className="text-[10px] text-zinc-400 mt-0.5">{kpi.sub}</p>
          </motion.div>
        ))}
      </div>

      {/* Mapa de sillones full width */}
      <div className="mb-5">
        <MapaSillones />
      </div>

      {/* Grid inferior */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <TablaAlumnos />
        <InventarioCritico />
      </div>
    </div>
  );
};

const JefeView: React.FC = () => (
  <UAOLayout>
    <JefeViewContent />
  </UAOLayout>
);

export default JefeView;
