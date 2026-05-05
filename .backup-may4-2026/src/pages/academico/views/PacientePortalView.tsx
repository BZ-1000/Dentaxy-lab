/**
 * PacientePortalView.tsx — Fase 4C
 * Portal del Paciente — su expediente en lectura, citas, estado de cuenta y plan
 * Diseño friendly, accesible, lenguaje directo al paciente (no técnico)
 */

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Calendar, DollarSign, FileText, Activity,
  CheckCircle2, Clock, AlertCircle, ChevronRight,
  Phone, MapPin, User, Heart, Star, Bell
} from 'lucide-react';
import { PACIENTES_DEMO } from '@/data/uaoMockData';
import { useDemo } from '../context/DemoContext';
import UAOLayout from '../components/UAOLayout';
import { cn } from '@/lib/utils';

// ─────────────────────────────────────────────────────────────────────────────
// DATOS DEL PACIENTE DEMO
// ─────────────────────────────────────────────────────────────────────────────

const pacienteDemo = PACIENTES_DEMO[0]; // María Guadalupe Flores Reyes

const HISTORIAL_CITAS = [
  { fecha: '2026-04-08', hora: '10:00', procedimiento: 'Restauración clase II amalgama', alumno: 'Rodrigo Martínez', estado: 'completada', nodo: 'CLIMUZAC I' },
  { fecha: '2026-03-22', hora: '11:00', procedimiento: 'Profilaxis dental y detartraje', alumno: 'Rodrigo Martínez', estado: 'completada', nodo: 'CLIMUZAC I' },
  { fecha: '2026-03-08', hora: '10:30', procedimiento: 'Historia clínica y diagnóstico', alumno: 'Rodrigo Martínez', estado: 'completada', nodo: 'CLIMUZAC I' },
];

const CITAS_PROXIMAS = [
  { fecha: '2026-04-10', hora: '10:00', procedimiento: 'Raspado y alisado radicular', alumno: 'Rodrigo Martínez', nodo: 'CLIMUZAC I – Sillón 1' },
  { fecha: '2026-04-24', hora: '11:30', procedimiento: 'Endodoncia 1ª cita (OD 16)',    alumno: 'Rodrigo Martínez', nodo: 'CLIMUZAC I – Sillón 1' },
];

const HISTORIAL_PAGOS = [
  { fecha: '2026-04-08', concepto: 'Restauración clase II',  monto: 200, tipo: 'pago' as const, metodo: 'Efectivo' },
  { fecha: '2026-03-22', concepto: 'Profilaxis completa',    monto: 150, tipo: 'pago' as const, metodo: 'Tarjeta' },
  { fecha: '2026-03-08', concepto: 'Consulta inicial',       monto: 0,   tipo: 'gratuito' as const, metodo: '—' },
];

const PLAN_RESUMEN = [
  { nombre: 'Profilaxis y detartraje',       fase: 'II-Higiénica',    estado: 'completada' as const, monto: 150 },
  { nombre: 'Restauración cl. II OD 36',     fase: 'III-Operatoria',  estado: 'completada' as const, monto: 200 },
  { nombre: 'Raspado Q1',                    fase: 'II-Higiénica',    estado: 'en_proceso' as const, monto: 250 },
  { nombre: 'Raspado Q2',                    fase: 'II-Higiénica',    estado: 'pendiente' as const,  monto: 250 },
  { nombre: 'Restauración cl. I OD 46',      fase: 'III-Operatoria',  estado: 'pendiente' as const,  monto: 180 },
  { nombre: 'Endodoncia OD 16',              fase: 'III-Operatoria',  estado: 'pendiente' as const,  monto: 800 },
  { nombre: 'Corona metal-porcelana OD 16',  fase: 'IV-Rehabilitación',estado: 'pendiente' as const, monto: 1200 },
];

// ─────────────────────────────────────────────────────────────────────────────
// CARD DE PRÓXIMA CITA
// ─────────────────────────────────────────────────────────────────────────────

const TarjetaProximaCita: React.FC<{ cita: typeof CITAS_PROXIMAS[0]; primera: boolean }> = ({ cita, primera }) => {
  const fecha = new Date(cita.fecha);
  const diffMs = fecha.getTime() - Date.now();
  const diffDias = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      className={cn(
        'rounded-3xl p-5 border',
        primera
          ? 'bg-gradient-to-br from-zinc-900 to-zinc-800 dark:from-zinc-800 dark:to-zinc-900 text-white border-transparent shadow-xl'
          : 'bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800'
      )}
    >
      <div className="flex items-start justify-between mb-3">
        <div>
          <p className={cn('text-[10px] font-bold uppercase tracking-wider', primera ? 'text-zinc-400' : 'text-zinc-400')}>
            {primera ? '📅 Próxima cita' : 'Cita programada'}
          </p>
          <p className={cn('text-lg font-bold mt-0.5', primera ? 'text-white' : 'text-zinc-900 dark:text-white')}>
            {fecha.toLocaleDateString('es-MX', { weekday: 'long', day: 'numeric', month: 'long' })}
          </p>
          <p className={cn('text-sm', primera ? 'text-zinc-400' : 'text-zinc-500')}>{cita.hora}</p>
        </div>
        {primera && (
          <div className="text-right">
            <p className="text-2xl font-bold">{diffDias}</p>
            <p className="text-[10px] text-zinc-400">días</p>
          </div>
        )}
      </div>

      <div className={cn('space-y-1', primera ? 'text-zinc-300' : 'text-zinc-500')}>
        <p className="text-xs font-medium">{cita.procedimiento}</p>
        <p className="text-xs flex items-center gap-1.5">
          <MapPin className="h-3 w-3 shrink-0" />
          {cita.nodo}
        </p>
        <p className="text-xs flex items-center gap-1.5">
          <User className="h-3 w-3 shrink-0" />
          Estudiante: {cita.alumno}
        </p>
      </div>

      {primera && (
        <div className="mt-4 grid grid-cols-2 gap-2">
          <button className="py-2 text-xs font-semibold bg-white text-zinc-900 rounded-xl hover:bg-zinc-100 transition-colors">
            ✅ Confirmar
          </button>
          <button className="py-2 text-xs font-semibold bg-zinc-800 text-zinc-300 rounded-xl hover:bg-zinc-700 transition-colors border border-zinc-700">
            ❌ Cancelar
          </button>
        </div>
      )}
    </motion.div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// PORTAL PACIENTE CONTENT
// ─────────────────────────────────────────────────────────────────────────────

const PacientePortalContent: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useDemo();
  const [tab, setTab] = useState<'inicio' | 'citas' | 'tratamiento' | 'pagos'>('inicio');

  React.useEffect(() => {
    if (!isAuthenticated) navigate('/academico');
  }, [isAuthenticated, navigate]);

  const totalPagado = HISTORIAL_PAGOS.reduce((s, p) => s + p.monto, 0);
  const totalPlan = PLAN_RESUMEN.reduce((s, p) => s + p.monto, 0);
  const saldoPendiente = totalPlan - totalPagado;
  const pctAvance = pacienteDemo.avanceTratamiento;

  const tabs = [
    { id: 'inicio' as const,     label: 'Inicio',      icon: Heart },
    { id: 'citas' as const,      label: 'Mis citas',   icon: Calendar },
    { id: 'tratamiento' as const, label: 'Mi plan',    icon: Activity },
    { id: 'pagos' as const,      label: 'Mi cuenta',   icon: DollarSign },
  ];

  return (
    <div className="p-4 sm:p-6 max-w-2xl mx-auto">
      {/* Saludo del paciente */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-3xl bg-rose-100 dark:bg-rose-950/30 flex items-center justify-center text-2xl shrink-0">
            😊
          </div>
          <div>
            <p className="text-xs text-zinc-400 font-medium">Bienvenida de vuelta,</p>
            <h1 className="text-xl font-bold text-zinc-900 dark:text-white leading-tight">
              {pacienteDemo.nombre.split(' ').slice(0, 2).join(' ')}
            </h1>
            <p className="text-xs text-zinc-400 mt-0.5">
              Clínica: {pacienteDemo.nodo.toUpperCase()} · Estudiante: {pacienteDemo.alumnoAsignado.split(' ')[0]}
            </p>
          </div>
        </div>
      </motion.div>

      {/* Tabs */}
      <div className="flex gap-1.5 mb-5 overflow-x-auto pb-0.5">
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
        {/* INICIO */}
        {tab === 'inicio' && (
          <motion.div key="inicio" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-4">
            {/* Próxima cita */}
            {CITAS_PROXIMAS.length > 0 && <TarjetaProximaCita cita={CITAS_PROXIMAS[0]} primera />}

            {/* Avance del tratamiento */}
            <div className="bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200/80 dark:border-zinc-800/80 p-5">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <p className="text-xs text-zinc-400">Tu tratamiento va al...</p>
                  <p className="text-2xl font-bold text-zinc-900 dark:text-white">{pctAvance}%</p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] text-zinc-400">Diagnóstico principal</p>
                  <p className="text-xs font-semibold text-zinc-700 dark:text-zinc-300 max-w-[140px] text-right">
                    {pacienteDemo.diagnosticoPrincipal}
                  </p>
                </div>
              </div>
              <div className="h-3 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${pctAvance}%` }}
                  transition={{ duration: 1, ease: 'easeOut' }}
                  className="h-full rounded-full bg-gradient-to-r from-rose-500 to-pink-400"
                />
              </div>
              <p className="text-[10px] text-zinc-400 mt-2">
                {PLAN_RESUMEN.filter(p => p.estado === 'completada').length} de {PLAN_RESUMEN.length} procedimientos completados
              </p>
            </div>

            {/* Saldo rápido */}
            <div className={cn(
              'rounded-3xl p-5 border',
              saldoPendiente > 0
                ? 'bg-amber-50 dark:bg-amber-950/20 border-amber-200/60 dark:border-amber-800/40'
                : 'bg-emerald-50 dark:bg-emerald-950/20 border-emerald-200/60 dark:border-emerald-800/40'
            )}>
              <div className="flex items-center justify-between">
                <div>
                  <p className={cn('text-[10px] font-bold uppercase tracking-wide', saldoPendiente > 0 ? 'text-amber-600 dark:text-amber-400' : 'text-emerald-600')}>
                    {saldoPendiente > 0 ? '💳 Saldo pendiente' : '✅ Sin adeudos'}
                  </p>
                  <p className={cn('text-2xl font-bold mt-0.5', saldoPendiente > 0 ? 'text-amber-700 dark:text-amber-400' : 'text-emerald-700 dark:text-emerald-400')}>
                    ${pacienteDemo.saldo.toLocaleString('es-MX')} MXN
                  </p>
                </div>
                <button onClick={() => setTab('pagos')} className={cn(
                  'text-xs font-medium px-3 py-1.5 rounded-xl transition-colors flex items-center gap-1',
                  saldoPendiente > 0
                    ? 'bg-amber-600 text-white hover:bg-amber-700'
                    : 'bg-emerald-600 text-white hover:bg-emerald-700'
                )}>
                  Ver cuenta <ChevronRight className="h-3 w-3" />
                </button>
              </div>
            </div>

            {/* Info de contacto */}
            <div className="bg-blue-50 dark:bg-blue-950/20 rounded-3xl border border-blue-200/60 dark:border-blue-800/40 p-4">
              <p className="text-[10px] font-bold text-blue-700 dark:text-blue-400 mb-2 uppercase tracking-wide">📍 Tu clínica</p>
              <p className="text-xs font-semibold text-blue-800 dark:text-blue-300">CLIMUZAC — Clínica Multidisciplinaria Zacatecas</p>
              <p className="text-xs text-blue-600/80 dark:text-blue-400/80 mt-0.5 flex items-center gap-1.5">
                <MapPin className="h-3 w-3" /> Calle Begonias s/n, Guadalupe, Zac.
              </p>
              <p className="text-xs text-blue-600/80 dark:text-blue-400/80 mt-0.5 flex items-center gap-1.5">
                <Phone className="h-3 w-3" /> 492 923 1580
              </p>
            </div>
          </motion.div>
        )}

        {/* CITAS */}
        {tab === 'citas' && (
          <motion.div key="citas" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-4">
            <p className="text-sm font-bold text-zinc-900 dark:text-white">Próximas citas</p>
            {CITAS_PROXIMAS.map((c, i) => <TarjetaProximaCita key={i} cita={c} primera={i === 0} />)}

            <p className="text-sm font-bold text-zinc-900 dark:text-white mt-4">Historial de visitas</p>
            <div className="space-y-2.5">
              {HISTORIAL_CITAS.map((c, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.06 }}
                  className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200/80 dark:border-zinc-800/80 p-4 flex items-center gap-3"
                >
                  <div className="w-9 h-9 rounded-2xl bg-emerald-100 dark:bg-emerald-950/30 flex items-center justify-center shrink-0">
                    <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-zinc-900 dark:text-white">{c.procedimiento}</p>
                    <p className="text-[10px] text-zinc-400 mt-0.5">
                      {new Date(c.fecha).toLocaleDateString('es-MX', { day: 'numeric', month: 'long' })} · {c.hora} · {c.nodo}
                    </p>
                  </div>
                  <span className="text-[9px] font-bold px-2 py-0.5 bg-emerald-100 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-400 rounded-full shrink-0">
                    ✅ Completada
                  </span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* MI PLAN */}
        {tab === 'tratamiento' && (
          <motion.div key="tratamiento" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-3">
            <div className="bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200/80 dark:border-zinc-800/80 p-4 mb-2">
              <p className="text-xs text-zinc-400 mb-1">Tu plan de tratamiento tiene {PLAN_RESUMEN.length} pasos</p>
              <div className="h-2 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                <div className="h-full rounded-full bg-gradient-to-r from-rose-500 to-pink-400"
                  style={{ width: `${(PLAN_RESUMEN.filter(p => p.estado === 'completada').length / PLAN_RESUMEN.length) * 100}%` }}
                />
              </div>
            </div>

            {PLAN_RESUMEN.map((proc, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200/80 dark:border-zinc-800/80 p-4 flex items-center gap-3"
              >
                <div className={cn(
                  'w-8 h-8 rounded-xl flex items-center justify-center shrink-0 text-sm',
                  proc.estado === 'completada' ? 'bg-emerald-100 dark:bg-emerald-950/30'
                  : proc.estado === 'en_proceso' ? 'bg-amber-100 dark:bg-amber-950/30'
                  : 'bg-zinc-100 dark:bg-zinc-800'
                )}>
                  {proc.estado === 'completada' ? '✅' : proc.estado === 'en_proceso' ? '🔄' : '⬜'}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-zinc-900 dark:text-white">{proc.nombre}</p>
                  <p className="text-[10px] text-zinc-400 mt-0.5">Fase {proc.fase}</p>
                </div>
                <p className={cn(
                  'text-xs font-bold shrink-0',
                  proc.estado === 'completada' ? 'text-emerald-600 dark:text-emerald-400'
                  : proc.estado === 'en_proceso' ? 'text-amber-600 dark:text-amber-400'
                  : 'text-zinc-400'
                )}>
                  {proc.monto > 0 ? `$${proc.monto.toLocaleString('es-MX')}` : 'Sin costo'}
                </p>
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* CUENTA */}
        {tab === 'pagos' && (
          <motion.div key="pagos" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-4">
            {/* Resumen */}
            <div className="grid grid-cols-3 gap-3">
              {[
                { label: 'Costo total', value: `$${totalPlan.toLocaleString('es-MX')}`, color: 'text-zinc-900 dark:text-white' },
                { label: 'Ya pagué', value: `$${totalPagado.toLocaleString('es-MX')}`,  color: 'text-emerald-600 dark:text-emerald-400' },
                { label: 'Me falta', value: `$${pacienteDemo.saldo.toLocaleString('es-MX')}`, color: 'text-amber-600 dark:text-amber-400' },
              ].map(item => (
                <div key={item.label} className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200/80 dark:border-zinc-800/80 p-3 text-center">
                  <p className={`text-lg font-bold ${item.color}`}>{item.value}</p>
                  <p className="text-[10px] text-zinc-400 mt-0.5">{item.label}</p>
                </div>
              ))}
            </div>

            {/* Historial */}
            <p className="text-sm font-bold text-zinc-900 dark:text-white">Historial de pagos</p>
            <div className="space-y-2.5">
              {HISTORIAL_PAGOS.map((p, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.06 }}
                  className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200/80 dark:border-zinc-800/80 p-4 flex items-center gap-3"
                >
                  <div className={cn(
                    'w-9 h-9 rounded-2xl flex items-center justify-center shrink-0',
                    p.tipo === 'gratuito' ? 'bg-blue-100 dark:bg-blue-950/30' : 'bg-emerald-100 dark:bg-emerald-950/30'
                  )}>
                    {p.tipo === 'gratuito' ? <Star className="h-4 w-4 text-blue-500" /> : <DollarSign className="h-4 w-4 text-emerald-500" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-zinc-900 dark:text-white">{p.concepto}</p>
                    <p className="text-[10px] text-zinc-400 mt-0.5">
                      {new Date(p.fecha).toLocaleDateString('es-MX', { day: 'numeric', month: 'long' })} · {p.metodo}
                    </p>
                  </div>
                  <p className="text-sm font-bold text-emerald-600 dark:text-emerald-400 shrink-0">
                    {p.tipo === 'gratuito' ? 'Sin costo' : `$${p.monto.toLocaleString('es-MX')}`}
                  </p>
                </motion.div>
              ))}
            </div>

            {/* Nota */}
            <div className="bg-blue-50 dark:bg-blue-950/20 rounded-2xl border border-blue-200/60 dark:border-blue-800/40 p-4">
              <p className="text-xs text-blue-700 dark:text-blue-400 leading-relaxed">
                💙 En la UAO ofrecemos servicios de calidad a costos accesibles para toda la comunidad.
                Tu tratamiento es supervisado por docentes especializados.
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const PacientePortalView: React.FC = () => (
  <UAOLayout>
    <PacientePortalContent />
  </UAOLayout>
);

export default PacientePortalView;
