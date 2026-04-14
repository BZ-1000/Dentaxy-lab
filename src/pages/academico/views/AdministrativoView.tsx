/**
 * AdministrativoView.tsx — Fase 4A
 * Panel de Recepción — registro de pacientes, cola de espera, cobros del día
 * Diseño tipo "command center" de recepción clínica de alto volumen
 */

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  UserPlus, ClipboardList, DollarSign, Clock,
  Search, CheckCircle2, AlertCircle, Phone,
  Hash, ArrowRight, X, Calendar, Printer,
  Coffee, Activity, FileText
} from 'lucide-react';
import { useDemo } from '../context/DemoContext';
import UAOLayout from '../components/UAOLayout';
import { cn } from '@/lib/utils';

// ─────────────────────────────────────────────────────────────────────────────
// MOCK DATA RECEPCIÓN
// ─────────────────────────────────────────────────────────────────────────────

type EstadoEspera = 'espera' | 'en_consulta' | 'listo' | 'no_show';

interface PacienteEspera {
  id: string;
  nombre: string;
  edad: number;
  hora: string;
  alumno: string;
  procedimiento: string;
  estado: EstadoEspera;
  sillon: number | null;
  llegada: string;
  primeraVez: boolean;
}

const COLA_ESPERA_INICIAL: PacienteEspera[] = [
  { id: 'w1', nombre: 'María G. Flores Reyes',     edad: 34, hora: '10:00', alumno: 'R. Martínez', procedimiento: 'Restauración clase II', estado: 'en_consulta', sillon: 1, llegada: '09:52', primeraVez: false },
  { id: 'w2', nombre: 'José A. Hernández Cruz',     edad: 52, hora: '10:00', alumno: 'R. Martínez', procedimiento: 'Raspado y alisado — Q2',  estado: 'espera',      sillon: null, llegada: '09:58', primeraVez: false },
  { id: 'w3', nombre: 'Ana Sofía Ruiz Medina',       edad: 8,  hora: '10:30', alumno: 'D. Quiñones',  procedimiento: 'Selladores 36, 46',        estado: 'espera',      sillon: null, llegada: '10:20', primeraVez: false },
  { id: 'w4', nombre: 'Roberto C. Leal Sandoval',   edad: 67, hora: '11:00', alumno: 'K. Torres',   procedimiento: 'Impresiones prótesis',     estado: 'en_consulta', sillon: 4, llegada: '10:48', primeraVez: false },
  { id: 'w5', nombre: 'Elena M. Castro Rivas',       edad: 29, hora: '11:30', alumno: 'B. López',    procedimiento: 'Profilaxis + detartraje',  estado: 'espera',      sillon: null, llegada: '11:10', primeraVez: true },
  { id: 'w6', nombre: 'Luis A. Mora Delgado',        edad: 44, hora: '12:00', alumno: 'I. Delgado',  procedimiento: 'Endodoncia OD 26 (2da cita)', estado: 'listo',     sillon: 7, llegada: '11:50', primeraVez: false },
  { id: 'w7', nombre: 'Carmen S. Flores Vega',       edad: 58, hora: '12:30', alumno: 'A. Soto',     procedimiento: 'Corona metal-porcelana',   estado: 'espera',      sillon: null, llegada: null, primeraVez: false },
  { id: 'w8', nombre: 'Pablo M. Rivas Ortega',       edad: 22, hora: '13:00', alumno: 'K. Torres',   procedimiento: 'Historia clínica inicial',  estado: 'espera',     sillon: null, llegada: null, primeraVez: true },
];

interface CobrosItem {
  id: string;
  paciente: string;
  procedimiento: string;
  monto: number;
  pagado: boolean;
  metodo: 'efectivo' | 'tarjeta' | 'transferencia';
  hora: string;
}

const COBROS_DIA: CobrosItem[] = [
  { id: 'c1', paciente: 'María G. Flores',     procedimiento: 'Restauración clase II', monto: 200,  pagado: true,  metodo: 'efectivo',      hora: '10:05' },
  { id: 'c2', paciente: 'Roberto C. Leal',     procedimiento: 'Profilaxis previa',     monto: 150,  pagado: true,  metodo: 'tarjeta',       hora: '10:50' },
  { id: 'c3', paciente: 'José A. Hernández',   procedimiento: 'Raspado Q1 (abono)',    monto: 125,  pagado: true,  metodo: 'transferencia', hora: '09:30' },
  { id: 'c4', paciente: 'Elena M. Castro',     procedimiento: 'Primera consulta',      monto: 0,    pagado: true,  metodo: 'efectivo',      hora: '—' },
  { id: 'c5', paciente: 'Luis A. Mora',        procedimiento: 'Endodoncia 2da cita',   monto: 400,  pagado: false, metodo: 'efectivo',      hora: '—' },
];

// ─────────────────────────────────────────────────────────────────────────────
// FORMULARIO PACIENTE NUEVO
// ─────────────────────────────────────────────────────────────────────────────

interface FormNuevoPaciente {
  nombre: string; apellidos: string; edad: string;
  telefono: string; motivo: string; alumno: string;
}

const formVacio: FormNuevoPaciente = {
  nombre: '', apellidos: '', edad: '', telefono: '', motivo: '', alumno: '',
};

const ALUMNOS_OPCIONES = [
  'Rodrigo Martínez Ávalos',
  'Daniela Quiñones López',
  'Kevin Torres Espinoza',
  'Brenda López Soria',
  'Iván Delgado Peña',
  'Alejandra Soto Reyes',
];

const inputCls = "w-full text-sm bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-xl px-3 py-2.5 text-zinc-900 dark:text-white placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-white transition-all";

const ModalNuevoPaciente: React.FC<{ onClose: () => void; onGuardar: (f: FormNuevoPaciente) => void }> = ({ onClose, onGuardar }) => {
  const [form, setForm] = useState<FormNuevoPaciente>(formVacio);
  const upd = (k: keyof FormNuevoPaciente, v: string) => setForm(p => ({ ...p, [k]: v }));
  const valido = form.nombre.length > 1 && form.apellidos.length > 1 && form.edad.length > 0 && form.telefono.length >= 10;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, y: 16 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.95, y: 16 }}
        onClick={e => e.stopPropagation()}
        className="bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-2xl w-full max-w-md"
      >
        <div className="flex items-center justify-between px-6 py-5 border-b border-zinc-100 dark:border-zinc-800">
          <div>
            <h2 className="text-base font-bold text-zinc-900 dark:text-white">Registrar Paciente Nuevo</h2>
            <p className="text-xs text-zinc-400 mt-0.5">Los datos se guardan en el expediente UAO Sync</p>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors">
            <X className="h-4 w-4 text-zinc-500" />
          </button>
        </div>

        <div className="p-6 space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wide block mb-1">Nombre(s)</label>
              <input className={inputCls} placeholder="María" value={form.nombre} onChange={e => upd('nombre', e.target.value)} />
            </div>
            <div>
              <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wide block mb-1">Apellido(s)</label>
              <input className={inputCls} placeholder="Flores Reyes" value={form.apellidos} onChange={e => upd('apellidos', e.target.value)} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wide block mb-1">Edad</label>
              <input className={inputCls} type="number" placeholder="25" value={form.edad} onChange={e => upd('edad', e.target.value)} />
            </div>
            <div>
              <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wide block mb-1">Teléfono</label>
              <input className={inputCls} type="tel" placeholder="492 123 4567" value={form.telefono} onChange={e => upd('telefono', e.target.value)} />
            </div>
          </div>
          <div>
            <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wide block mb-1">Motivo de consulta</label>
            <input className={inputCls} placeholder="Dolor / revisión general / otro..." value={form.motivo} onChange={e => upd('motivo', e.target.value)} />
          </div>
          <div>
            <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wide block mb-1">Alumno asignado</label>
            <select className={inputCls} value={form.alumno} onChange={e => upd('alumno', e.target.value)}>
              <option value="">— Seleccionar alumno —</option>
              {ALUMNOS_OPCIONES.map(a => <option key={a} value={a}>{a}</option>)}
            </select>
          </div>
        </div>

        <div className="flex gap-3 px-6 pb-6">
          <button onClick={onClose} className="flex-1 py-2.5 text-sm text-zinc-500 border border-zinc-200 dark:border-zinc-700 rounded-xl hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors">
            Cancelar
          </button>
          <button
            onClick={() => valido && onGuardar(form)}
            disabled={!valido}
            className={cn(
              'flex-1 py-2.5 text-sm font-semibold rounded-xl transition-all',
              valido
                ? 'bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 hover:bg-zinc-800 dark:hover:bg-zinc-100'
                : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-400 cursor-not-allowed'
            )}
          >
            Registrar y asignar folio
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// CHIP DE ESTADO ESPERA
// ─────────────────────────────────────────────────────────────────────────────

const chipEspera = (estado: EstadoEspera) => ({
  espera:      { cls: 'bg-amber-100 dark:bg-amber-950/30 text-amber-700 dark:text-amber-400',  label: '⏳ Espera',      icon: Clock },
  en_consulta: { cls: 'bg-blue-100 dark:bg-blue-950/30 text-blue-700 dark:text-blue-400',      label: '🦷 En consulta', icon: Activity },
  listo:       { cls: 'bg-emerald-100 dark:bg-emerald-950/30 text-emerald-700',                 label: '✅ Listo',        icon: CheckCircle2 },
  no_show:     { cls: 'bg-red-100 dark:bg-red-950/30 text-red-700',                            label: '❌ No show',      icon: X },
})[estado];

// ─────────────────────────────────────────────────────────────────────────────
// ADMINISTRATIVO VIEW
// ─────────────────────────────────────────────────────────────────────────────

const AdministrativoViewContent: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useDemo();
  const [tab, setTab] = useState<'cola' | 'cobros' | 'registro'>('cola');
  const [cola, setCola] = useState<PacienteEspera[]>(COLA_ESPERA_INICIAL);
  const [cobros, setCobros] = useState<CobrosItem[]>(COBROS_DIA);
  const [showModal, setShowModal] = useState(false);
  const [busqueda, setBusqueda] = useState('');
  const [successPaciente, setSuccessPaciente] = useState<string | null>(null);

  React.useEffect(() => {
    if (!isAuthenticated) navigate('/academico');
  }, [isAuthenticated, navigate]);

  const colaFiltrada = cola.filter(p =>
    p.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
    p.alumno.toLowerCase().includes(busqueda.toLowerCase())
  );

  const enEspera = cola.filter(p => p.estado === 'espera').length;
  const enConsulta = cola.filter(p => p.estado === 'en_consulta').length;
  const totalCobradoHoy = cobros.filter(c => c.pagado).reduce((s, c) => s + c.monto, 0);
  const pendientesCobro = cobros.filter(c => !c.pagado).reduce((s, c) => s + c.monto, 0);

  const actualizarEstado = (id: string, estado: EstadoEspera) => {
    setCola(prev => prev.map(p => p.id === id ? { ...p, estado } : p));
  };

  const registrarPaciente = (form: FormNuevoPaciente) => {
    const folio = `PAC-${Math.floor(Math.random() * 9000) + 1000}`;
    const nuevo: PacienteEspera = {
      id: folio,
      nombre: `${form.nombre} ${form.apellidos}`,
      edad: parseInt(form.edad),
      hora: 'Sin cita',
      alumno: form.alumno.split(' ')[0] + '.',
      procedimiento: form.motivo || 'Consulta general',
      estado: 'espera',
      sillon: null,
      llegada: new Date().toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' }),
      primeraVez: true,
    };
    setCola(prev => [...prev, nuevo]);
    setShowModal(false);
    setSuccessPaciente(`${form.nombre} — Folio: ${folio}`);
    setTimeout(() => setSuccessPaciente(null), 4000);
    setTab('cola');
  };

  const marcarPagado = (id: string) => {
    setCobros(prev => prev.map(c => c.id === id ? { ...c, pagado: true } : c));
  };

  return (
    <div className="p-4 sm:p-6">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mb-5">
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-white tracking-tight">Recepción Clínica</h1>
        <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
          CLIMUZAC — {new Date().toLocaleDateString('es-MX', { weekday: 'long', day: 'numeric', month: 'long' })}
        </p>
      </motion.div>

      {/* Notificación de éxito */}
      <AnimatePresence>
        {successPaciente && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mb-4 p-3 bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 rounded-2xl flex items-center gap-2.5"
          >
            <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
            <span className="text-xs font-medium text-emerald-700 dark:text-emerald-400">
              Paciente registrado: <strong>{successPaciente}</strong>
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* KPIs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
        {[
          { label: 'En espera',     value: enEspera,            icon: Clock,      color: '#F59E0B', sub: 'Pacientes aguardando' },
          { label: 'En consulta',   value: enConsulta,          icon: Activity,   color: '#2563EB', sub: 'Sillones activos hoy' },
          { label: 'Cobrado hoy',   value: `$${totalCobradoHoy.toLocaleString('es-MX')}`, icon: DollarSign, color: '#059669', sub: 'Efectivo + tarjeta' },
          { label: 'Por cobrar',    value: `$${pendientesCobro.toLocaleString('es-MX')}`, icon: AlertCircle, color: '#DC2626', sub: 'Pendiente de pago' },
        ].map((k, i) => (
          <motion.div
            key={k.label}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.07 }}
            className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200/80 dark:border-zinc-800/80 p-4"
          >
            <div className="w-8 h-8 rounded-xl flex items-center justify-center mb-2" style={{ backgroundColor: k.color + '18' }}>
              <k.icon className="h-4 w-4" style={{ color: k.color }} />
            </div>
            <p className="text-xl font-bold text-zinc-900 dark:text-white">{k.value}</p>
            <p className="text-xs font-medium text-zinc-600 dark:text-zinc-400">{k.label}</p>
            <p className="text-[10px] text-zinc-400">{k.sub}</p>
          </motion.div>
        ))}
      </div>

      {/* Tabs + botón registrar */}
      <div className="flex items-center gap-3 mb-4 flex-wrap">
        <div className="flex gap-2">
          {[
            { id: 'cola' as const,    label: 'Cola de espera', icon: ClipboardList, badge: cola.length },
            { id: 'cobros' as const,  label: 'Cobros del día', icon: DollarSign },
          ].map(t => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={cn(
                'flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-medium transition-all shrink-0',
                tab === t.id
                  ? 'bg-zinc-900 dark:bg-white text-white dark:text-zinc-900'
                  : 'bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300'
              )}
            >
              <t.icon className="h-3.5 w-3.5" />
              {t.label}
              {t.badge !== undefined && (
                <span className={cn('text-[9px] font-bold px-1.5 py-0.5 rounded-full', tab === t.id ? 'bg-white/20' : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600')}>
                  {t.badge}
                </span>
              )}
            </button>
          ))}
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="ml-auto flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold transition-all shadow-lg shadow-emerald-200 dark:shadow-emerald-950/40"
        >
          <UserPlus className="h-3.5 w-3.5" />
          Nuevo paciente
        </button>
      </div>

      {/* Buscador */}
      {tab === 'cola' && (
        <div className="relative mb-4">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
          <input
            value={busqueda}
            onChange={e => setBusqueda(e.target.value)}
            placeholder="Buscar paciente o alumno..."
            className="w-full pl-10 pr-4 py-2.5 text-sm bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-white transition-all"
          />
        </div>
      )}

      {/* COLA DE ESPERA */}
      <AnimatePresence mode="wait">
        {tab === 'cola' && (
          <motion.div key="cola" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            <div className="bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200/80 dark:border-zinc-800/80 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[640px]">
                  <thead>
                    <tr className="bg-zinc-50 dark:bg-zinc-800/40">
                      {['#', 'Paciente', 'Cita', 'Alumno', 'Procedimiento', 'Estado', ''].map(h => (
                        <th key={h} className="text-[10px] text-zinc-400 font-semibold text-left px-4 py-3">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {colaFiltrada.map((p, i) => {
                      const chip = chipEspera(p.estado);
                      return (
                        <motion.tr
                          key={p.id}
                          initial={{ opacity: 0, x: -6 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.03 }}
                          className="border-t border-zinc-100 dark:border-zinc-800 hover:bg-zinc-50/50 dark:hover:bg-zinc-800/20 transition-colors"
                        >
                          <td className="px-4 py-3 text-[10px] text-zinc-400 font-mono">{i + 1}</td>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-2">
                              <div>
                                <p className="text-xs font-semibold text-zinc-900 dark:text-white">{p.nombre}</p>
                                <div className="flex items-center gap-2 mt-0.5">
                                  <span className="text-[10px] text-zinc-400">{p.edad} años</span>
                                  {p.primeraVez && (
                                    <span className="text-[9px] font-bold px-1.5 py-0.5 bg-violet-100 dark:bg-violet-950/30 text-violet-600 dark:text-violet-400 rounded-full">1ª vez</span>
                                  )}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <p className="text-xs font-medium text-zinc-700 dark:text-zinc-300">{p.hora}</p>
                            {p.llegada && <p className="text-[10px] text-zinc-400">Llegó: {p.llegada}</p>}
                          </td>
                          <td className="px-4 py-3">
                            <p className="text-xs text-zinc-600 dark:text-zinc-400">{p.alumno}</p>
                            {p.sillon && <p className="text-[10px] text-zinc-400">Sillón {p.sillon}</p>}
                          </td>
                          <td className="px-4 py-3">
                            <p className="text-xs text-zinc-600 dark:text-zinc-400 max-w-[140px] truncate">{p.procedimiento}</p>
                          </td>
                          <td className="px-4 py-3">
                            <select
                              value={p.estado}
                              onChange={e => actualizarEstado(p.id, e.target.value as EstadoEspera)}
                              className={cn('text-[10px] font-semibold px-2.5 py-1 rounded-full border-none focus:outline-none cursor-pointer', chip.cls)}
                            >
                              <option value="espera">⏳ Espera</option>
                              <option value="en_consulta">🦷 En consulta</option>
                              <option value="listo">✅ Listo</option>
                              <option value="no_show">❌ No show</option>
                            </select>
                          </td>
                          <td className="px-4 py-3">
                            <button className="p-1.5 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors">
                              <FileText className="h-3.5 w-3.5 text-zinc-400 hover:text-zinc-600" />
                            </button>
                          </td>
                        </motion.tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>
        )}

        {/* COBROS */}
        {tab === 'cobros' && (
          <motion.div key="cobros" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            <div className="bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200/80 dark:border-zinc-800/80 overflow-hidden">
              <div className="flex items-center justify-between px-5 py-4 border-b border-zinc-100 dark:border-zinc-800">
                <div>
                  <h3 className="text-sm font-bold text-zinc-900 dark:text-white">Cobros del día</h3>
                  <p className="text-xs text-zinc-400 mt-0.5">Total cobrado: <strong className="text-emerald-600">${totalCobradoHoy.toLocaleString('es-MX')}</strong> MXN</p>
                </div>
                <button className="flex items-center gap-1.5 text-xs text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300 px-3 py-1.5 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors">
                  <Printer className="h-3.5 w-3.5" />
                  Imprimir corte
                </button>
              </div>
              <div className="p-4 space-y-2.5">
                {cobros.map((c, i) => (
                  <motion.div
                    key={c.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className={cn(
                      'flex items-center gap-4 p-4 rounded-2xl border transition-all',
                      c.pagado
                        ? 'bg-zinc-50 dark:bg-zinc-800/30 border-zinc-200/60 dark:border-zinc-800'
                        : 'bg-amber-50 dark:bg-amber-950/20 border-amber-200/60 dark:border-amber-800/40'
                    )}
                  >
                    <div className={cn(
                      'w-9 h-9 rounded-2xl flex items-center justify-center shrink-0',
                      c.pagado ? 'bg-emerald-100 dark:bg-emerald-950/30' : 'bg-amber-100 dark:bg-amber-950/30'
                    )}>
                      {c.pagado
                        ? <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                        : <Clock className="h-4 w-4 text-amber-500" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-zinc-900 dark:text-white">{c.paciente}</p>
                      <p className="text-[11px] text-zinc-500 mt-0.5">{c.procedimiento}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className={cn(
                          'text-[9px] font-bold px-1.5 py-0.5 rounded-full',
                          c.metodo === 'efectivo' ? 'bg-emerald-100 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-400'
                          : c.metodo === 'tarjeta' ? 'bg-blue-100 dark:bg-blue-950/30 text-blue-700 dark:text-blue-400'
                          : 'bg-violet-100 dark:bg-violet-950/30 text-violet-700 dark:text-violet-400'
                        )}>
                          {c.metodo}
                        </span>
                        {c.hora !== '—' && <span className="text-[10px] text-zinc-400">{c.hora}</span>}
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-base font-bold text-zinc-900 dark:text-white">
                        {c.monto > 0 ? `$${c.monto.toLocaleString('es-MX')}` : 'Gratuito'}
                      </p>
                      {!c.pagado && c.monto > 0 && (
                        <button
                          onClick={() => marcarPagado(c.id)}
                          className="mt-1 text-[10px] font-bold px-2.5 py-1 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 rounded-lg hover:bg-zinc-800 dark:hover:bg-zinc-100 transition-colors"
                        >
                          Registrar pago
                        </button>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modal registro */}
      <AnimatePresence>
        {showModal && (
          <ModalNuevoPaciente
            onClose={() => setShowModal(false)}
            onGuardar={registrarPaciente}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

const AdministrativoView: React.FC = () => (
  <UAOLayout>
    <AdministrativoViewContent />
  </UAOLayout>
);

export default AdministrativoView;
