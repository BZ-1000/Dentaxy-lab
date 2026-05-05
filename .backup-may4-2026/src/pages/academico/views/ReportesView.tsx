/**
 * ReportesView.tsx — Fase 5A
 * Panel de Reportes Institucionales — Director UAO
 * Gráficas SVG nativas (sin recharts), KPIs históricos, descarga PDF mock
 */

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BarChart3, Download, TrendingUp, TrendingDown,
  Users, Activity, DollarSign, FileText,
  Calendar, Filter, ChevronDown, Award
} from 'lucide-react';
import { useDemo } from '../context/DemoContext';
import UAOLayout from '../components/UAOLayout';
import { cn } from '@/lib/utils';

// ─────────────────────────────────────────────────────────────────────────────
// DATOS HISTÓRICOS
// ─────────────────────────────────────────────────────────────────────────────

const MESES = ['Oct', 'Nov', 'Dic', 'Ene', 'Feb', 'Mar', 'Abr'];

const DATA_PROCEDIMIENTOS = [1842, 1976, 1521, 2104, 2287, 2341, 2156];
const DATA_PACIENTES =       [312,  348,  265,  389,  412,  438,  391];
const DATA_INGRESOS =        [48200, 51800, 39400, 55600, 61200, 63800, 58900];
const DATA_ALUMNOS =         [158,  160,  155,  162,  164,  164,  164];

const DISTRIBUCION_NODOS = [
  { nombre: 'CLIMUZAC I',     procedimientos: 624, pct: 29, color: '#2563EB' },
  { nombre: 'CLIMUZAC II',    procedimientos: 511, pct: 24, color: '#7C3AED' },
  { nombre: 'CLIZAC',         procedimientos: 398, pct: 18, color: '#059669' },
  { nombre: 'CLICAMP',        procedimientos: 301, pct: 14, color: '#D97706' },
  { nombre: 'CLITACO/CLIBOR', procedimientos: 215, pct: 10, color: '#DB2777' },
  { nombre: 'Especialidades', procedimientos: 107, pct: 5,  color: '#DC2626' },
];

const TOP_PROCEDIMIENTOS = [
  { nombre: 'Restauraciones (amalgama/resina)',  cantidad: 487, color: '#2563EB' },
  { nombre: 'Profilaxis y detartraje',           cantidad: 312, color: '#059669' },
  { nombre: 'Exodoncias simples',                cantidad: 201, color: '#7C3AED' },
  { nombre: 'Endodoncias',                       cantidad: 156, color: '#D97706' },
  { nombre: 'Selladores de fosetas',             cantidad: 134, color: '#DB2777' },
  { nombre: 'Rehabilitación protésica',          cantidad: 98,  color: '#DC2626' },
  { nombre: 'Ortodoncia (brackets)',             cantidad: 87,  color: '#0891B2' },
];

// ─────────────────────────────────────────────────────────────────────────────
// GRÁFICA DE BARRAS SVG NATIVA
// ─────────────────────────────────────────────────────────────────────────────

interface BarChartProps {
  data: number[];
  labels: string[];
  color?: string;
  height?: number;
  formatValue?: (v: number) => string;
  activeIndex?: number;
  onHover?: (i: number | null) => void;
}

const BarChart: React.FC<BarChartProps> = ({
  data, labels, color = '#2563EB', height = 120,
  formatValue = (v) => v.toLocaleString('es-MX'),
  activeIndex, onHover
}) => {
  const max = Math.max(...data);
  const [hovered, setHovered] = useState<number | null>(null);
  const idx = hovered ?? activeIndex ?? null;

  return (
    <div className="relative select-none">
      {/* Tooltip */}
      <AnimatePresence>
        {idx !== null && (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="absolute -top-8 left-0 right-0 flex justify-center pointer-events-none z-10"
          >
            <div className="bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 text-[11px] font-bold px-2.5 py-1 rounded-lg shadow-lg">
              {labels[idx]}: {formatValue(data[idx])}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <svg width="100%" height={height} viewBox={`0 0 ${data.length * 40} ${height}`} preserveAspectRatio="none">
        {data.map((v, i) => {
          const barH = max > 0 ? (v / max) * (height - 24) : 0;
          const x = i * 40 + 6;
          const y = height - 20 - barH;
          const isHov = idx === i;

          return (
            <g key={i}>
              {/* Barra de fondo */}
              <rect
                x={x} y={20} width={28} height={height - 40}
                rx={4} fill={color + '18'}
              />
              {/* Barra de valor */}
              <motion.rect
                x={x} y={y} width={28} height={barH}
                rx={4}
                fill={isHov ? color : color + 'CC'}
                initial={{ height: 0, y: height - 20 }}
                animate={{ height: barH, y }}
                transition={{ delay: i * 0.04, duration: 0.5, ease: 'easeOut' }}
                style={{ cursor: 'pointer' }}
                onMouseEnter={() => { setHovered(i); onHover?.(i); }}
                onMouseLeave={() => { setHovered(null); onHover?.(null); }}
              />
              {/* Etiqueta mes */}
              <text
                x={x + 14} y={height - 4}
                textAnchor="middle"
                fontSize={9}
                fill="currentColor"
                className="fill-zinc-400"
              >
                {labels[i]}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// GRÁFICA DE DONA SVG
// ─────────────────────────────────────────────────────────────────────────────

const DonaChart: React.FC<{ data: typeof DISTRIBUCION_NODOS }> = ({ data }) => {
  const [activo, setActivo] = useState<number | null>(null);
  const total = data.reduce((s, d) => s + d.pct, 0);
  const cx = 60; const cy = 60; const r = 48; const ri = 32;

  let startAngle = -90;
  const segmentos = data.map((d) => {
    const angle = (d.pct / total) * 360;
    const deg2rad = (a: number) => (a * Math.PI) / 180;
    const x1 = cx + r * Math.cos(deg2rad(startAngle));
    const y1 = cy + r * Math.sin(deg2rad(startAngle));
    const x2 = cx + r * Math.cos(deg2rad(startAngle + angle));
    const y2 = cy + r * Math.sin(deg2rad(startAngle + angle));
    const xi1 = cx + ri * Math.cos(deg2rad(startAngle));
    const yi1 = cy + ri * Math.sin(deg2rad(startAngle));
    const xi2 = cx + ri * Math.cos(deg2rad(startAngle + angle));
    const yi2 = cy + ri * Math.sin(deg2rad(startAngle + angle));
    const large = angle > 180 ? 1 : 0;
    const path = `M${x1} ${y1} A${r} ${r} 0 ${large} 1 ${x2} ${y2} L${xi2} ${yi2} A${ri} ${ri} 0 ${large} 0 ${xi1} ${yi1} Z`;
    startAngle += angle;
    return { ...d, path };
  });

  const actLabel = activo !== null ? data[activo] : null;

  return (
    <div className="flex items-center gap-4">
      <svg width={120} height={120} className="shrink-0">
        {segmentos.map((seg, i) => (
          <motion.path
            key={i}
            d={seg.path}
            fill={seg.color}
            opacity={activo === null || activo === i ? 1 : 0.4}
            initial={{ opacity: 0 }}
            animate={{ opacity: activo === null || activo === i ? 1 : 0.4 }}
            style={{ cursor: 'pointer' }}
            onMouseEnter={() => setActivo(i)}
            onMouseLeave={() => setActivo(null)}
          />
        ))}
        <text x={cx} y={cy - 6} textAnchor="middle" fontSize={11} fontWeight="bold" className="fill-zinc-900 dark:fill-white" fill="currentColor">
          {actLabel ? actLabel.pct + '%' : '100%'}
        </text>
        <text x={cx} y={cy + 8} textAnchor="middle" fontSize={7} fill="#9ca3af">
          {actLabel ? actLabel.nombre.split(' ')[0] : 'Total'}
        </text>
      </svg>

      <div className="flex-1 space-y-1.5">
        {data.map((d, i) => (
          <div
            key={i}
            className={cn('flex items-center gap-2 cursor-pointer transition-opacity', activo !== null && activo !== i ? 'opacity-30' : '')}
            onMouseEnter={() => setActivo(i)}
            onMouseLeave={() => setActivo(null)}
          >
            <div className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: d.color }} />
            <p className="text-[10px] text-zinc-600 dark:text-zinc-400 flex-1 truncate">{d.nombre}</p>
            <p className="text-[10px] font-bold text-zinc-700 dark:text-zinc-300">{d.procedimientos.toLocaleString()}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// TENDENCIA SPARKLINE SVG
// ─────────────────────────────────────────────────────────────────────────────

const Sparkline: React.FC<{ data: number[]; color: string; width?: number; height?: number }> = ({
  data, color, width = 80, height = 28
}) => {
  const min = Math.min(...data);
  const max = Math.max(...data);
  const rang = max - min || 1;
  const pts = data.map((v, i) => ({
    x: (i / (data.length - 1)) * width,
    y: height - ((v - min) / rang) * height,
  }));
  const d = pts.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join(' ');

  const subing = `${d} L${width} ${height} L0 ${height} Z`;
  const trend = data[data.length - 1] >= data[data.length - 2];

  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} style={{ overflow: 'visible' }}>
      <defs>
        <linearGradient id={`g-${color.replace('#', '')}`} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={color} stopOpacity="0.3" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={subing} fill={`url(#g-${color.replace('#', '')})`} />
      <path d={d} stroke={color} strokeWidth={1.5} fill="none" strokeLinejoin="round" strokeLinecap="round" />
      <circle cx={pts[pts.length - 1].x} cy={pts[pts.length - 1].y} r={2.5} fill={color} />
    </svg>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// REPORTES VIEW
// ─────────────────────────────────────────────────────────────────────────────

const ReportesViewContent: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useDemo();
  const [tab, setTab] = useState<'actividad' | 'academico' | 'financiero'>('actividad');
  const [periodoLabel, setPeriodoLabel] = useState('Últimos 7 meses');
  const [showPeriodos, setShowPeriodos] = useState(false);
  const [downloading, setDownloading] = useState(false);

  React.useEffect(() => {
    if (!isAuthenticated) navigate('/academico');
  }, [isAuthenticated, navigate]);

  const handleDescargar = () => {
    setDownloading(true);
    setTimeout(() => setDownloading(false), 2000);
  };

  const mesActual = DATA_PROCEDIMIENTOS[DATA_PROCEDIMIENTOS.length - 1];
  const mesAnterior = DATA_PROCEDIMIENTOS[DATA_PROCEDIMIENTOS.length - 2];
  const pctCambio = (((mesActual - mesAnterior) / mesAnterior) * 100).toFixed(1);
  const enAlza = mesActual >= mesAnterior;

  const tabs = [
    { id: 'actividad' as const,   label: 'Actividad Clínica', icon: Activity },
    { id: 'academico' as const,   label: 'Indicadores Acad.', icon: Award },
    { id: 'financiero' as const,  label: 'Financiero',        icon: DollarSign },
  ];

  const periodosDisponibles = ['Este mes', 'Últimos 3 meses', 'Últimos 7 meses', 'Año completo'];

  return (
    <div className="p-4 sm:p-6">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex items-start justify-between mb-5 gap-3 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-white tracking-tight">
            Reportes Institucionales
          </h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
            UAO UAZ — Análisis histórico y tendencias
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Selector de período */}
          <div className="relative">
            <button
              onClick={() => setShowPeriodos(p => !p)}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors"
            >
              <Calendar className="h-3.5 w-3.5 text-zinc-400" />
              {periodoLabel}
              <ChevronDown className="h-3 w-3 text-zinc-400" />
            </button>
            <AnimatePresence>
              {showPeriodos && (
                <motion.div
                  initial={{ opacity: 0, y: 4, scale: 0.97 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 4, scale: 0.97 }}
                  className="absolute right-0 top-full mt-1 w-44 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-xl overflow-hidden z-20"
                >
                  {periodosDisponibles.map(p => (
                    <button
                      key={p}
                      onClick={() => { setPeriodoLabel(p); setShowPeriodos(false); }}
                      className={cn(
                        'w-full text-left text-xs px-4 py-2.5 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors',
                        p === periodoLabel ? 'font-bold text-zinc-900 dark:text-white' : 'text-zinc-600 dark:text-zinc-400'
                      )}
                    >
                      {p}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Descargar */}
          <button
            onClick={handleDescargar}
            className={cn(
              'flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-xl transition-all',
              downloading
                ? 'bg-emerald-600 text-white'
                : 'bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 hover:bg-zinc-800 dark:hover:bg-zinc-100'
            )}
          >
            <Download className="h-3.5 w-3.5" />
            {downloading ? '✓ Descargando...' : 'Exportar PDF'}
          </button>
        </div>
      </motion.div>

      {/* Resumen rápido — 4 KPIs con sparklines */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
        {[
          { label: 'Procedimientos',  data: DATA_PROCEDIMIENTOS, color: '#2563EB', format: (v: number) => v.toLocaleString() },
          { label: 'Pacientes',       data: DATA_PACIENTES,      color: '#059669', format: (v: number) => v.toLocaleString() },
          { label: 'Ingresos MXN',    data: DATA_INGRESOS,       color: '#7C3AED', format: (v: number) => `$${(v/1000).toFixed(0)}k` },
          { label: 'Alumnos activos', data: DATA_ALUMNOS,        color: '#D97706', format: (v: number) => v.toLocaleString() },
        ].map((item, i) => {
          const curr = item.data[item.data.length - 1];
          const prev = item.data[item.data.length - 2];
          const up = curr >= prev;
          const diff = (((curr - prev) / prev) * 100).toFixed(1);
          return (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.07 }}
              className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200/80 dark:border-zinc-800/80 p-4"
            >
              <div className="flex items-start justify-between mb-2">
                <p className="text-[10px] text-zinc-400 font-medium">{item.label}</p>
                <span className={cn('text-[10px] font-bold flex items-center gap-0.5', up ? 'text-emerald-600' : 'text-red-500')}>
                  {up ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                  {up ? '+' : ''}{diff}%
                </span>
              </div>
              <p className="text-lg font-bold text-zinc-900 dark:text-white">{item.format(curr)}</p>
              <div className="mt-2">
                <Sparkline data={item.data} color={item.color} width={80} height={24} />
              </div>
            </motion.div>
          );
        })}
      </div>

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
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {/* ACTIVIDAD CLÍNICA */}
        {tab === 'actividad' && (
          <motion.div key="actividad" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-4">

            {/* Procedimientos por mes — barra grande */}
            <div className="bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200/80 dark:border-zinc-800/80 p-5">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-sm font-bold text-zinc-900 dark:text-white">Procedimientos por mes</h2>
                  <p className="text-xs text-zinc-400 mt-0.5">Todas las clínicas UAO</p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-zinc-900 dark:text-white">
                    {mesActual.toLocaleString('es-MX')}
                  </p>
                  <p className={cn('text-[10px] font-bold flex items-center justify-end gap-0.5',
                    enAlza ? 'text-emerald-600' : 'text-red-500')}>
                    {enAlza ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                    {enAlza ? '+' : ''}{pctCambio}% vs mes anterior
                  </p>
                </div>
              </div>
              <BarChart
                data={DATA_PROCEDIMIENTOS}
                labels={MESES}
                color="#2563EB"
                height={140}
              />
            </div>

            {/* Grid: distribución nodos + Top procedimientos */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {/* Dona distribución */}
              <div className="bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200/80 dark:border-zinc-800/80 p-5">
                <h2 className="text-sm font-bold text-zinc-900 dark:text-white mb-4">
                  Distribución por nodo clínico
                </h2>
                <DonaChart data={DISTRIBUCION_NODOS} />
              </div>

              {/* Top procedimientos */}
              <div className="bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200/80 dark:border-zinc-800/80 p-5">
                <h2 className="text-sm font-bold text-zinc-900 dark:text-white mb-4">
                  Top procedimientos este mes
                </h2>
                <div className="space-y-3">
                  {TOP_PROCEDIMIENTOS.map((p, i) => {
                    const pct = Math.round((p.cantidad / TOP_PROCEDIMIENTOS[0].cantidad) * 100);
                    return (
                      <motion.div
                        key={p.nombre}
                        initial={{ opacity: 0, x: -8 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.05 }}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <p className="text-[11px] text-zinc-600 dark:text-zinc-400 truncate flex-1 pr-2">{p.nombre}</p>
                          <p className="text-[11px] font-bold text-zinc-800 dark:text-zinc-200 shrink-0">{p.cantidad}</p>
                        </div>
                        <div className="h-1.5 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${pct}%` }}
                            transition={{ delay: i * 0.05 + 0.2, duration: 0.5 }}
                            className="h-full rounded-full"
                            style={{ backgroundColor: p.color }}
                          />
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Pacientes por mes */}
            <div className="bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200/80 dark:border-zinc-800/80 p-5">
              <h2 className="text-sm font-bold text-zinc-900 dark:text-white mb-4">
                Pacientes atendidos por mes
              </h2>
              <BarChart
                data={DATA_PACIENTES}
                labels={MESES}
                color="#059669"
                height={100}
              />
            </div>
          </motion.div>
        )}

        {/* INDICADORES ACADÉMICOS */}
        {tab === 'academico' && (
          <motion.div key="academico" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-4">
            {/* Alumnos por semestre */}
            <div className="bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200/80 dark:border-zinc-800/80 p-5">
              <h2 className="text-sm font-bold text-zinc-900 dark:text-white mb-4">Distribución de alumnos por semestre</h2>
              <div className="space-y-2.5">
                {[
                  { sem: '5° Semestre', alumnos: 28, color: '#2563EB' },
                  { sem: '6° Semestre', alumnos: 31, color: '#7C3AED' },
                  { sem: '7° Semestre', alumnos: 42, color: '#059669' },
                  { sem: '8° Semestre', alumnos: 38, color: '#D97706' },
                  { sem: '9° Semestre', alumnos: 25, color: '#DB2777' },
                ].map((s, i) => (
                  <motion.div key={s.sem} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.07 }}>
                    <div className="flex justify-between mb-1">
                      <span className="text-[11px] text-zinc-600 dark:text-zinc-400">{s.sem}</span>
                      <span className="text-[11px] font-bold text-zinc-800 dark:text-zinc-200">{s.alumnos} alumnos</span>
                    </div>
                    <div className="h-3 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${(s.alumnos / 42) * 100}%` }}
                        transition={{ delay: i * 0.07 + 0.2, duration: 0.5 }}
                        className="h-full rounded-full"
                        style={{ backgroundColor: s.color }}
                      />
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Indicadores CONAEDO resumidos */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                { nombre: 'Eficiencia terminal',           valor: 82, meta: 80, unidad: '%', ok: true,  desc: 'Alumnos que completan el programa en tiempo' },
                { nombre: 'Tasa de titulación',            valor: 91, meta: 85, unidad: '%', ok: true,  desc: 'Egresados titulados en el ciclo actual' },
                { nombre: 'Docentes con posgrado',         valor: 78, meta: 75, unidad: '%', ok: true,  desc: 'Planta académica con maestría o doctorado' },
                { nombre: 'Procedimientos/alumno/sem.',    valor: 156, meta: 200, unidad: '', ok: false, desc: 'Meta de 200 por semestre establece CONAEDO' },
              ].map((ind, i) => (
                <motion.div
                  key={ind.nombre}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.07 }}
                  className={cn(
                    'bg-white dark:bg-zinc-900 rounded-2xl border p-4',
                    ind.ok ? 'border-emerald-200/60 dark:border-emerald-800/40' : 'border-amber-200/60 dark:border-amber-800/40'
                  )}
                >
                  <div className="flex items-start justify-between mb-2">
                    <p className="text-xs font-semibold text-zinc-800 dark:text-zinc-200 leading-snug pr-2">{ind.nombre}</p>
                    <span className={cn(
                      'text-sm font-bold shrink-0',
                      ind.ok ? 'text-emerald-600 dark:text-emerald-400' : 'text-amber-600 dark:text-amber-400'
                    )}>
                      {ind.valor}{ind.unidad}
                    </span>
                  </div>
                  <p className="text-[10px] text-zinc-400 mb-2">{ind.desc}</p>
                  <div className="h-1.5 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                    <div
                      className={cn('h-full rounded-full', ind.ok ? 'bg-emerald-500' : 'bg-amber-500')}
                      style={{ width: `${Math.min(100, (ind.valor / (typeof ind.meta === 'number' ? ind.meta : 100)) * 100)}%` }}
                    />
                  </div>
                  <p className="text-[9px] text-zinc-400 mt-1">Meta: {ind.meta}{ind.unidad}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* FINANCIERO */}
        {tab === 'financiero' && (
          <motion.div key="financiero" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-4">
            <div className="bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200/80 dark:border-zinc-800/80 p-5">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-sm font-bold text-zinc-900 dark:text-white">Ingresos mensuales</h2>
                  <p className="text-xs text-zinc-400 mt-0.5">Cobros a pacientes · todas las clínicas</p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-zinc-900 dark:text-white">
                    ${(DATA_INGRESOS[DATA_INGRESOS.length - 1] / 1000).toFixed(1)}k MXN
                  </p>
                  <p className="text-[10px] text-emerald-600">Este mes (Abr)</p>
                </div>
              </div>
              <BarChart
                data={DATA_INGRESOS}
                labels={MESES}
                color="#7C3AED"
                height={140}
                formatValue={v => `$${(v / 1000).toFixed(0)}k`}
              />
            </div>

            {/* Tabla ingresos por nodo */}
            <div className="bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200/80 dark:border-zinc-800/80 overflow-hidden">
              <div className="px-5 py-4 border-b border-zinc-100 dark:border-zinc-800">
                <h2 className="text-sm font-bold text-zinc-900 dark:text-white">Ingresos por nodo — mes actual</h2>
              </div>
              <table className="w-full">
                <thead>
                  <tr className="bg-zinc-50 dark:bg-zinc-800/40">
                    {['Nodo', 'Pacientes', 'Ingreso', '% Total'].map(h => (
                      <th key={h} className="text-[10px] text-zinc-400 font-semibold text-left px-5 py-2.5">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {[
                    { nodo: 'CLIMUZAC I',     pacientes: 118, ingreso: 17200, pct: 29 },
                    { nodo: 'CLIMUZAC II',    pacientes: 96,  ingreso: 14100, pct: 24 },
                    { nodo: 'CLIZAC',         pacientes: 74,  ingreso: 10600, pct: 18 },
                    { nodo: 'CLICAMP',        pacientes: 57,  ingreso: 8200,  pct: 14 },
                    { nodo: 'CLITACO/CLIBOR', pacientes: 41,  ingreso: 5900,  pct: 10 },
                    { nodo: 'Especialidades', pacientes: 25,  ingreso: 2900,  pct: 5  },
                  ].map((row, i) => (
                    <tr key={row.nodo} className="border-t border-zinc-100 dark:border-zinc-800">
                      <td className="px-5 py-3 text-xs font-semibold text-zinc-800 dark:text-zinc-200">{row.nodo}</td>
                      <td className="px-5 py-3 text-xs text-zinc-500">{row.pacientes}</td>
                      <td className="px-5 py-3 text-xs font-bold text-zinc-800 dark:text-zinc-200">
                        ${row.ingreso.toLocaleString('es-MX')}
                      </td>
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-2">
                          <div className="w-12 h-1.5 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                            <div className="h-full rounded-full bg-violet-500" style={{ width: `${row.pct}%` }} />
                          </div>
                          <span className="text-[10px] font-bold text-violet-600 dark:text-violet-400">{row.pct}%</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const ReportesView: React.FC = () => (
  <UAOLayout>
    <ReportesViewContent />
  </UAOLayout>
);

export default ReportesView;
