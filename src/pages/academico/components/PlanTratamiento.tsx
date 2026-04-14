/**
 * PlanTratamiento.tsx — Fase 2F
 * Plan de tratamiento en 5 fases con canvas de firma digital
 */

import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Check, Circle, Clock, Pen, Trash2, DollarSign, FileCheck } from 'lucide-react';
import { cn } from '@/lib/utils';

// ─────────────────────────────────────────────────────────────────────────────
// TIPOS
// ─────────────────────────────────────────────────────────────────────────────

type EstadoProc = 'pendiente' | 'en_proceso' | 'completado';
type Fase = 'I' | 'II' | 'III' | 'IV' | 'V';

interface Procedimiento {
  id: string;
  fase: Fase;
  descripcion: string;
  dientes: string;
  diagnostico: string;
  costo: number;
  estado: EstadoProc;
  alumno: string;
  sesiones: number;
}

const FASES_CONFIG: Record<Fase, { nombre: string; color: string; colorBg: string }> = {
  I:   { nombre: 'Fase I — Sistémica',       color: '#2563EB', colorBg: 'bg-blue-50 dark:bg-blue-950/20' },
  II:  { nombre: 'Fase II — Higiénica',       color: '#059669', colorBg: 'bg-emerald-50 dark:bg-emerald-950/20' },
  III: { nombre: 'Fase III — Operatoria',     color: '#7C3AED', colorBg: 'bg-violet-50 dark:bg-violet-950/20' },
  IV:  { nombre: 'Fase IV — Rehabilitatoria', color: '#D97706', colorBg: 'bg-amber-50 dark:bg-amber-950/20' },
  V:   { nombre: 'Fase V — Mantenimiento',    color: '#DB2777', colorBg: 'bg-rose-50 dark:bg-rose-950/20' },
};

const PLAN_DEMO: Procedimiento[] = [
  { id: 'p1', fase: 'I',   descripcion: 'Interconsulta a Medicina Interna', dientes: '—', diagnostico: 'Control sistémico previo', costo: 0,   estado: 'completado',  alumno: 'R. Martínez', sesiones: 1 },
  { id: 'p2', fase: 'II',  descripcion: 'Profilaxis dental completa', dientes: 'Todos', diagnostico: 'Gingivitis generalizada', costo: 150,  estado: 'completado',  alumno: 'R. Martínez', sesiones: 1 },
  { id: 'p3', fase: 'II',  descripcion: 'Raspado y alisado radicular — Cuadrante I', dientes: '11–18', diagnostico: 'Periodontitis Estadio III', costo: 250,  estado: 'en_proceso',  alumno: 'R. Martínez', sesiones: 2 },
  { id: 'p4', fase: 'II',  descripcion: 'Raspado y alisado radicular — Cuadrante II', dientes: '21–28', diagnostico: 'Periodontitis Estadio III', costo: 250,  estado: 'pendiente',   alumno: 'R. Martínez', sesiones: 2 },
  { id: 'p5', fase: 'III', descripcion: 'Restauración Clase II amalgama OD 36', dientes: '36', diagnostico: 'Caries dental K02', costo: 200,  estado: 'en_proceso',  alumno: 'R. Martínez', sesiones: 1 },
  { id: 'p6', fase: 'III', descripcion: 'Restauración Clase I comp. OD 46', dientes: '46', diagnostico: 'Caries dental K02', costo: 180,  estado: 'pendiente',   alumno: 'R. Martínez', sesiones: 1 },
  { id: 'p7', fase: 'III', descripcion: 'Endodoncia OD 16', dientes: '16', diagnostico: 'Pulpitis irreversible', costo: 800,  estado: 'pendiente',   alumno: 'R. Martínez', sesiones: 3 },
  { id: 'p8', fase: 'IV',  descripcion: 'Corona metal-porcelana OD 16', dientes: '16', diagnostico: 'Post-endodoncia', costo: 1200, estado: 'pendiente',   alumno: 'R. Martínez', sesiones: 2 },
  { id: 'p9', fase: 'V',   descripcion: 'Mantenimiento periodontal trimestral', dientes: 'Todos', diagnostico: 'Mantenimiento', costo: 150,  estado: 'pendiente',   alumno: 'R. Martínez', sesiones: 4 },
];

// ─────────────────────────────────────────────────────────────────────────────
// CANVAS DE FIRMA DIGITAL
// ─────────────────────────────────────────────────────────────────────────────

interface FirmaCanvasProps {
  label: string;
  onFirmar: (dataUrl: string) => void;
}

const FirmaCanvas: React.FC<FirmaCanvasProps> = ({ label, onFirmar }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [dibujando, setDibujando] = useState(false);
  const [firmado, setFirmado] = useState(false);
  const [firmaData, setFirmaData] = useState<string | null>(null);

  const getPos = (e: MouseEvent | TouchEvent, canvas: HTMLCanvasElement) => {
    const rect = canvas.getBoundingClientRect();
    if (e instanceof TouchEvent) {
      return { x: e.touches[0].clientX - rect.left, y: e.touches[0].clientY - rect.top };
    }
    return { x: (e as MouseEvent).clientX - rect.left, y: (e as MouseEvent).clientY - rect.top };
  };

  const iniciar = (e: React.MouseEvent | React.TouchEvent) => {
    if (firmado) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    setDibujando(true);
    const pos = getPos(e.nativeEvent, canvas);
    ctx.beginPath();
    ctx.moveTo(pos.x, pos.y);
  };

  const dibujar = (e: React.MouseEvent | React.TouchEvent) => {
    if (!dibujando || firmado) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const pos = getPos(e.nativeEvent, canvas);
    ctx.lineTo(pos.x, pos.y);
    ctx.strokeStyle = '#18181B';
    ctx.lineWidth = 2.5;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.stroke();
  };

  const terminar = () => {
    if (!dibujando) return;
    setDibujando(false);
  };

  const limpiar = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    ctx?.clearRect(0, 0, canvas.width, canvas.height);
    setFirmado(false);
    setFirmaData(null);
  };

  const confirmarFirma = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const data = canvas.toDataURL('image/png');
    setFirmaData(data);
    setFirmado(true);
    onFirmar(data);
  };

  return (
    <div className="space-y-2">
      <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-wide">{label}</p>
      {firmado && firmaData ? (
        <div className="relative bg-white dark:bg-zinc-900 border-2 border-emerald-400 rounded-xl p-3">
          <img src={firmaData} alt="Firma digital" className="h-16 w-full object-contain" />
          <div className="absolute top-2 right-2 flex items-center gap-1 bg-emerald-500 text-white text-[9px] px-1.5 py-0.5 rounded-full">
            <Check className="h-2.5 w-2.5" /> Firmado
          </div>
          <button onClick={limpiar} className="absolute bottom-1 right-2 text-[10px] text-zinc-400 hover:text-red-500">
            Borrar
          </button>
        </div>
      ) : (
        <div className="relative">
          <canvas
            ref={canvasRef}
            width={280}
            height={72}
            onMouseDown={iniciar}
            onMouseMove={dibujar}
            onMouseUp={terminar}
            onMouseLeave={terminar}
            onTouchStart={iniciar}
            onTouchMove={dibujar}
            onTouchEnd={terminar}
            className="w-full h-18 bg-zinc-50 dark:bg-zinc-800 border-2 border-dashed border-zinc-300 dark:border-zinc-600 rounded-xl cursor-crosshair touch-none"
            style={{ height: 72 }}
          />
          <p className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[10px] text-zinc-300 pointer-events-none">
            ✍️ Firmar aquí
          </p>
          <div className="flex gap-2 mt-1.5">
            <button onClick={limpiar} className="flex items-center gap-1 text-[10px] text-zinc-400 hover:text-red-500 px-2 py-1 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors">
              <Trash2 className="h-3 w-3" /> Limpiar
            </button>
            <button onClick={confirmarFirma} className="flex items-center gap-1 text-[10px] font-medium text-white bg-zinc-900 dark:bg-white dark:text-zinc-900 px-2.5 py-1 rounded-lg hover:bg-zinc-800 dark:hover:bg-zinc-100 transition-colors">
              <FileCheck className="h-3 w-3" /> Confirmar firma
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// FILA DE PROCEDIMIENTO
// ─────────────────────────────────────────────────────────────────────────────

const estadoChip = (est: EstadoProc) => {
  if (est === 'completado') return 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400';
  if (est === 'en_proceso') return 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400';
  return 'bg-zinc-100 dark:bg-zinc-800 text-zinc-500';
};

const estadoLabel: Record<EstadoProc, string> = {
  pendiente: '⬜ Pendiente',
  en_proceso: '🟡 En proceso',
  completado: '✅ Completado',
};

// ─────────────────────────────────────────────────────────────────────────────
// PLAN TRATAMIENTO COMPLETO
// ─────────────────────────────────────────────────────────────────────────────

const PlanTratamiento: React.FC = () => {
  const [plan, setPlan] = useState<Procedimiento[]>(PLAN_DEMO);
  const [consentimiento, setConsentimiento] = useState(false);

  const fases = Object.keys(FASES_CONFIG) as Fase[];

  const toggleEstado = (id: string) => {
    setPlan(prev => prev.map(p => {
      if (p.id !== id) return p;
      const next: EstadoProc = p.estado === 'pendiente' ? 'en_proceso' : p.estado === 'en_proceso' ? 'completado' : 'pendiente';
      return { ...p, estado: next };
    }));
  };

  const totalPlan = plan.reduce((s, p) => s + p.costo, 0);
  const totalCompletado = plan.filter(p => p.estado === 'completado').reduce((s, p) => s + p.costo, 0);
  const totalPendiente = totalPlan - totalCompletado;
  const pctAvance = Math.round((plan.filter(p => p.estado === 'completado').length / plan.length) * 100);

  return (
    <div className="p-4 space-y-5">
      {/* Resumen financiero */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid grid-cols-3 gap-3"
      >
        {[
          { label: 'Costo total del plan', value: `$${totalPlan.toLocaleString('es-MX')}`, color: 'text-zinc-900 dark:text-white' },
          { label: 'Cobrado / completado', value: `$${totalCompletado.toLocaleString('es-MX')}`, color: 'text-emerald-600 dark:text-emerald-400' },
          { label: 'Saldo pendiente', value: `$${totalPendiente.toLocaleString('es-MX')}`, color: 'text-amber-600 dark:text-amber-400' },
        ].map(item => (
          <div key={item.label} className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 p-3">
            <DollarSign className="h-4 w-4 text-zinc-400 mb-1" />
            <p className={`text-lg font-bold ${item.color}`}>{item.value}</p>
            <p className="text-[10px] text-zinc-400">{item.label}</p>
          </div>
        ))}
      </motion.div>

      {/* Barra de avance */}
      <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 p-4">
        <div className="flex justify-between items-center mb-2">
          <span className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">Avance del plan</span>
          <span className="text-xs font-bold text-zinc-900 dark:text-white">{pctAvance}%</span>
        </div>
        <div className="h-2 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${pctAvance}%` }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-500"
          />
        </div>
      </div>

      {/* Tabla por fases */}
      {fases.map((fase, fi) => {
        const procs = plan.filter(p => p.fase === fase);
        if (procs.length === 0) return null;
        const cfg = FASES_CONFIG[fase];
        return (
          <motion.div
            key={fase}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: fi * 0.06 }}
            className={cn('rounded-2xl border overflow-hidden', cfg.colorBg, 'border-transparent')}
          >
            <div className="px-4 py-2.5 flex items-center gap-2" style={{ borderLeft: `3px solid ${cfg.color}` }}>
              <span className="text-xs font-bold" style={{ color: cfg.color }}>{cfg.nombre}</span>
              <span className="text-[10px] text-zinc-400">({procs.length} procedimientos)</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[480px]">
                <thead>
                  <tr className="bg-white/60 dark:bg-zinc-900/60">
                    <th className="text-[10px] text-zinc-400 font-medium text-left px-4 py-2">Procedimiento</th>
                    <th className="text-[10px] text-zinc-400 font-medium text-center px-2 py-2">Dientes</th>
                    <th className="text-[10px] text-zinc-400 font-medium text-right px-2 py-2">Costo</th>
                    <th className="text-[10px] text-zinc-400 font-medium text-center px-2 py-2">Sesiones</th>
                    <th className="text-[10px] text-zinc-400 font-medium text-center px-4 py-2">Estado</th>
                  </tr>
                </thead>
                <tbody>
                  {procs.map(proc => (
                    <tr key={proc.id} className="border-t border-white/40 dark:border-zinc-800/40">
                      <td className="px-4 py-2.5">
                        <p className="text-xs font-medium text-zinc-900 dark:text-white">{proc.descripcion}</p>
                        <p className="text-[10px] text-zinc-400">{proc.diagnostico}</p>
                      </td>
                      <td className="px-2 py-2.5 text-center">
                        <span className="text-xs text-zinc-600 dark:text-zinc-400">{proc.dientes}</span>
                      </td>
                      <td className="px-2 py-2.5 text-right">
                        <span className="text-xs font-semibold text-zinc-900 dark:text-white">
                          {proc.costo > 0 ? `$${proc.costo.toLocaleString('es-MX')}` : '—'}
                        </span>
                      </td>
                      <td className="px-2 py-2.5 text-center">
                        <span className="text-xs text-zinc-500">{proc.sesiones}</span>
                      </td>
                      <td className="px-4 py-2.5 text-center">
                        <button
                          onClick={() => toggleEstado(proc.id)}
                          className={cn('text-[10px] font-semibold px-2.5 py-1 rounded-full transition-all', estadoChip(proc.estado))}
                        >
                          {estadoLabel[proc.estado]}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        );
      })}

      {/* Consentimiento + Firma */}
      <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 p-5">
        <h3 className="text-sm font-bold text-zinc-900 dark:text-white mb-3 flex items-center gap-2">
          <FileCheck className="h-4 w-4 text-zinc-500" />
          Consentimiento Informado
        </h3>

        <div className="bg-zinc-50 dark:bg-zinc-800 rounded-xl p-3 mb-4 text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
          He sido informado(a) detalladamente del plan de tratamiento propuesto, los procedimientos a realizar,
          sus riesgos, beneficios y alternativas. Autorizo al alumno{' '}
          <strong>Rodrigo Martínez Ávalos</strong> bajo la supervisión del docente correspondiente
          a llevar a cabo los procedimientos indicados en el presente plan de tratamiento,
          en la Unidad Académica de Odontología de la UAZ.
        </div>

        <label className="flex items-start gap-3 mb-4 cursor-pointer">
          <input
            type="checkbox"
            checked={consentimiento}
            onChange={e => setConsentimiento(e.target.checked)}
            className="w-4 h-4 mt-0.5 rounded accent-zinc-900"
          />
          <span className="text-xs text-zinc-700 dark:text-zinc-300">
            He leído y acepto el consentimiento informado. Autorizo los procedimientos indicados.
          </span>
        </label>

        {consentimiento && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="grid grid-cols-1 sm:grid-cols-2 gap-4"
          >
            <FirmaCanvas
              label="Firma del paciente / tutor legal"
              onFirmar={data => console.log('Firma paciente registrada')}
            />
            <FirmaCanvas
              label="Firma y sello docente supervisor"
              onFirmar={data => console.log('Firma docente registrada')}
            />
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default PlanTratamiento;
