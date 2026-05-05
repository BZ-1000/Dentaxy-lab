/**
 * AgendaView.tsx — Fase 4B
 * Agenda institucional — calendario semanal con citas por nodo/alumno
 * Vista tipo Google Calendar con estados de cita completos
 */

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronLeft, ChevronRight, Plus, Calendar,
  Clock, User, Activity, CheckCircle2, X,
  AlertCircle, Hash, Filter
} from 'lucide-react';
import { useDemo } from '../context/DemoContext';
import UAOLayout from '../components/UAOLayout';
import { cn } from '@/lib/utils';

// ─────────────────────────────────────────────────────────────────────────────
// TIPOS Y DATOS
// ─────────────────────────────────────────────────────────────────────────────

type EstadoCita = 'programada' | 'confirmada' | 'en_consulta' | 'completada' | 'cancelada' | 'no_show';

interface Cita {
  id: string;
  paciente: string;
  alumno: string;
  procedimiento: string;
  hora: number; // 8-18 (hora de inicio)
  duracion: number; // en horas (0.5, 1, 1.5, 2)
  dia: number; // 0=lun, 1=mar... 4=vie
  estado: EstadoCita;
  nodo: string;
  color: string;
}

const CITAS_DEMO: Cita[] = [
  { id: 'c1', paciente: 'María G. Flores',   alumno: 'R. Martínez', procedimiento: 'Restauración cl. II',   hora: 10, duracion: 1,   dia: 0, estado: 'en_consulta',  nodo: 'CLIMUZAC I',  color: '#2563EB' },
  { id: 'c2', paciente: 'J.A. Hernández',    alumno: 'R. Martínez', procedimiento: 'Raspado Q2',            hora: 11.5, duracion: 1.5, dia: 0, estado: 'programada', nodo: 'CLIMUZAC I',  color: '#2563EB' },
  { id: 'c3', paciente: 'Roberto C. Leal',   alumno: 'K. Torres',   procedimiento: 'Impresiones prótesis',  hora: 10, duracion: 1.5, dia: 0, estado: 'en_consulta',  nodo: 'CLIMUZAC II', color: '#7C3AED' },
  { id: 'c4', paciente: 'Ana S. Ruiz',       alumno: 'D. Quiñones', procedimiento: 'Selladores 36, 46',     hora: 10.5, duracion: 0.5, dia: 0, estado: 'programada', nodo: 'CLIMUZAC I',  color: '#059669' },
  { id: 'c5', paciente: 'Elena M. Castro',   alumno: 'B. López',    procedimiento: 'Profilaxis completa',   hora: 11.5, duracion: 1, dia: 0, estado: 'programada',   nodo: 'CLIMUZAC I',  color: '#DB2777' },
  { id: 'c6', paciente: 'Luis A. Mora',      alumno: 'I. Delgado',  procedimiento: 'Endodoncia OD 26',      hora: 12, duracion: 2,   dia: 0, estado: 'programada',   nodo: 'CLIMUZAC II', color: '#D97706' },
  // Martes
  { id: 'c7',  paciente: 'P. González',      alumno: 'R. Martínez', procedimiento: 'Cx. extracción OD 38', hora: 9, duracion: 1,   dia: 1, estado: 'confirmada',    nodo: 'CLIMUZAC I',  color: '#2563EB' },
  { id: 'c8',  paciente: 'T. Gutiérrez',     alumno: 'K. Torres',   procedimiento: 'Endodoncia OD 36',      hora: 10, duracion: 2,  dia: 1, estado: 'confirmada',    nodo: 'CLIMUZAC II', color: '#7C3AED' },
  { id: 'c9',  paciente: 'M. Castillo',      alumno: 'D. Quiñones', procedimiento: 'Brackets ajuste',      hora: 11, duracion: 0.5, dia: 1, estado: 'programada',   nodo: 'CLIMUZAC I',  color: '#059669' },
  // Miércoles
  { id: 'c10', paciente: 'H. Vidal',         alumno: 'I. Delgado',  procedimiento: 'Raspado Q3',            hora: 9, duracion: 1.5, dia: 2, estado: 'completada',   nodo: 'CLIMUZAC II', color: '#D97706' },
  { id: 'c11', paciente: 'S. Herrera',       alumno: 'A. Soto',     procedimiento: 'Rehabilitación oral',   hora: 11, duracion: 1,  dia: 2, estado: 'programada',   nodo: 'CLIMUZAC II', color: '#DC2626' },
  { id: 'c12', paciente: 'N. Robles',        alumno: 'B. López',    procedimiento: 'Historia clínica',      hora: 13, duracion: 1,  dia: 2, estado: 'cancelada',    nodo: 'CLIMUZAC I',  color: '#DB2777' },
  // Jueves
  { id: 'c13', paciente: 'F. Mendez',        alumno: 'R. Martínez', procedimiento: 'Corona c° post.',       hora: 10, duracion: 2,  dia: 3, estado: 'programada',   nodo: 'CLIMUZAC I',  color: '#2563EB' },
  { id: 'c14', paciente: 'G. Santos',        alumno: 'K. Torres',   procedimiento: 'Profilaxis + sellad.',  hora: 9, duracion: 1,   dia: 3, estado: 'confirmada',   nodo: 'CLIMUZAC II', color: '#7C3AED' },
  // Viernes
  { id: 'c15', paciente: 'C. Flores',        alumno: 'D. Quiñones', procedimiento: 'Extracción OD 18',      hora: 9.5, duracion: 1, dia: 4, estado: 'confirmada',   nodo: 'CLIMUZAC I',  color: '#059669' },
  { id: 'c16', paciente: 'A. Morales',       alumno: 'I. Delgado',  procedimiento: 'Raspado Q4 (final)',    hora: 11, duracion: 1.5, dia: 4, estado: 'programada',  nodo: 'CLIMUZAC II', color: '#D97706' },
];

const HORAS = [8, 9, 10, 11, 12, 13, 14, 15, 16, 17];
const DIAS_LABELS = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes'];
const DIAS_CORTOS = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie'];

// ─────────────────────────────────────────────────────────────────────────────
// ESTADO CHIP
// ─────────────────────────────────────────────────────────────────────────────

const estadoConfig: Record<EstadoCita, { label: string; cls: string }> = {
  programada:   { label: '📅 Programada',   cls: 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400' },
  confirmada:   { label: '✅ Confirmada',   cls: 'bg-blue-100 dark:bg-blue-950/30 text-blue-700 dark:text-blue-400' },
  en_consulta:  { label: '🦷 En consulta',  cls: 'bg-amber-100 dark:bg-amber-950/30 text-amber-700 dark:text-amber-400' },
  completada:   { label: '✅ Completada',   cls: 'bg-emerald-100 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-400' },
  cancelada:    { label: '❌ Cancelada',    cls: 'bg-red-100 dark:bg-red-950/30 text-red-700 dark:text-red-400' },
  no_show:      { label: '👻 No show',      cls: 'bg-zinc-200 dark:bg-zinc-700 text-zinc-500' },
};

// ─────────────────────────────────────────────────────────────────────────────
// BLOQUE DE CITA EN CALENDARIO
// ─────────────────────────────────────────────────────────────────────────────

const HORA_INICIO = 8;
const HORA_FIN = 18;
const TOTAL_HORAS = HORA_FIN - HORA_INICIO;
const PX_POR_HORA = 64; // altura por hora en px

interface CitaBlockProps {
  cita: Cita;
  onClick: (c: Cita) => void;
}

const CitaBlock: React.FC<CitaBlockProps> = ({ cita, onClick }) => {
  const top = (cita.hora - HORA_INICIO) * PX_POR_HORA;
  const height = cita.duracion * PX_POR_HORA - 4;
  const isCancelada = cita.estado === 'cancelada';

  return (
    <motion.button
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.02, zIndex: 10 }}
      onClick={() => onClick(cita)}
      className={cn(
        'absolute left-1 right-1 rounded-xl px-1.5 py-1 text-left cursor-pointer overflow-hidden border shadow-sm transition-shadow hover:shadow-md',
        isCancelada && 'opacity-50'
      )}
      style={{
        top,
        height,
        backgroundColor: cita.color + '20',
        borderColor: cita.color + '60',
      }}
    >
      <p className="text-[10px] font-bold leading-tight truncate" style={{ color: cita.color }}>
        {cita.paciente}
      </p>
      {height > 30 && (
        <p className="text-[9px] opacity-70 truncate" style={{ color: cita.color }}>
          {cita.procedimiento}
        </p>
      )}
      {height > 44 && (
        <p className="text-[9px] opacity-60 truncate" style={{ color: cita.color }}>
          {cita.alumno}
        </p>
      )}
    </motion.button>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// AGENDA VIEW
// ─────────────────────────────────────────────────────────────────────────────

const AgendaViewContent: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useDemo();
  const [citaActiva, setCitaActiva] = useState<Cita | null>(null);
  const [semanaOffset, setSemanaOffset] = useState(0);
  const [filtroAlumno, setFiltroAlumno] = useState<string>('todos');

  React.useEffect(() => {
    if (!isAuthenticated) navigate('/academico');
  }, [isAuthenticated, navigate]);

  // Calcular fechas de la semana
  const hoy = new Date();
  const inicioSemana = new Date(hoy);
  const dia = hoy.getDay();
  const diff = dia === 0 ? -6 : 1 - dia;
  inicioSemana.setDate(hoy.getDate() + diff + (semanaOffset * 7));

  const fechasDia = DIAS_CORTOS.map((_, i) => {
    const d = new Date(inicioSemana);
    d.setDate(inicioSemana.getDate() + i);
    return d;
  });

  const alumnos = [...new Set(CITAS_DEMO.map(c => c.alumno))];
  const citasFiltradas = filtroAlumno === 'todos'
    ? CITAS_DEMO
    : CITAS_DEMO.filter(c => c.alumno === filtroAlumno);

  const esHoy = (fecha: Date) => {
    const ahora = new Date();
    return fecha.getDate() === ahora.getDate() && fecha.getMonth() === ahora.getMonth();
  };

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Header agenda */}
      <div className="flex items-center gap-3 px-4 py-3 border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shrink-0">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setSemanaOffset(s => s - 1)}
            className="p-1.5 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
          >
            <ChevronLeft className="h-4 w-4 text-zinc-600 dark:text-zinc-400" />
          </button>
          <button
            onClick={() => setSemanaOffset(0)}
            className="text-xs font-medium px-3 py-1.5 bg-zinc-100 dark:bg-zinc-800 rounded-xl hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors"
          >
            Hoy
          </button>
          <button
            onClick={() => setSemanaOffset(s => s + 1)}
            className="p-1.5 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
          >
            <ChevronRight className="h-4 w-4 text-zinc-600 dark:text-zinc-400" />
          </button>
        </div>

        <div>
          <p className="text-sm font-bold text-zinc-900 dark:text-white">
            {inicioSemana.toLocaleDateString('es-MX', { month: 'long', year: 'numeric' })}
          </p>
          <p className="text-[10px] text-zinc-400">{citasFiltradas.length} citas esta semana</p>
        </div>

        {/* Filtro alumno */}
        <div className="ml-auto flex items-center gap-2">
          <Filter className="h-3.5 w-3.5 text-zinc-400" />
          <select
            value={filtroAlumno}
            onChange={e => setFiltroAlumno(e.target.value)}
            className="text-xs bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border-none rounded-xl px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-white"
          >
            <option value="todos">Todos los alumnos</option>
            {alumnos.map(a => <option key={a} value={a}>{a}</option>)}
          </select>
        </div>
      </div>

      {/* Leyenda de estados */}
      <div className="flex gap-3 px-4 py-2 bg-white dark:bg-zinc-900 border-b border-zinc-100 dark:border-zinc-800 overflow-x-auto shrink-0">
        {Object.entries(estadoConfig).map(([k, v]) => (
          <div key={k} className="flex items-center gap-1.5 shrink-0">
            <span className={cn('text-[9px] font-bold px-1.5 py-0.5 rounded-full', v.cls)}>{v.label}</span>
          </div>
        ))}
      </div>

      {/* Calendario */}
      <div className="flex flex-1 overflow-hidden">
        {/* Zona scrollable */}
        <div className="flex-1 overflow-auto">
          <div className="min-w-[640px]">
            {/* Headers de días */}
            <div className="sticky top-0 z-20 grid bg-white dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800"
              style={{ gridTemplateColumns: '48px repeat(5, 1fr)' }}
            >
              <div className="h-12" />
              {fechasDia.map((fecha, i) => {
                const hoyFlag = esHoy(fecha);
                return (
                  <div key={i} className="h-12 flex flex-col items-center justify-center border-l border-zinc-200 dark:border-zinc-800">
                    <span className="text-[10px] font-medium text-zinc-400">{DIAS_CORTOS[i]}</span>
                    <span className={cn(
                      'text-sm font-bold w-7 h-7 flex items-center justify-center rounded-full',
                      hoyFlag ? 'bg-zinc-900 dark:bg-white text-white dark:text-zinc-900' : 'text-zinc-700 dark:text-zinc-300'
                    )}>
                      {fecha.getDate()}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Grid de horas */}
            <div className="relative grid" style={{ gridTemplateColumns: '48px repeat(5, 1fr)' }}>
              {/* Columna de horas */}
              <div className="relative">
                {HORAS.map(h => (
                  <div key={h} className="flex items-start justify-end pr-2 pt-0.5"
                    style={{ height: PX_POR_HORA }}
                  >
                    <span className="text-[10px] text-zinc-400 font-medium">{h}:00</span>
                  </div>
                ))}
              </div>

              {/* Columnas de días */}
              {DIAS_CORTOS.map((_, diaIdx) => (
                <div
                  key={diaIdx}
                  className="relative border-l border-zinc-200 dark:border-zinc-800"
                  style={{ height: TOTAL_HORAS * PX_POR_HORA }}
                >
                  {/* Líneas de hora */}
                  {HORAS.map(h => (
                    <div
                      key={h}
                      className="absolute w-full border-t border-zinc-100 dark:border-zinc-800/80"
                      style={{ top: (h - HORA_INICIO) * PX_POR_HORA }}
                    />
                  ))}

                  {/* Media hora — línea punteada */}
                  {HORAS.map(h => (
                    <div
                      key={`${h}-30`}
                      className="absolute w-full border-t border-dashed border-zinc-100 dark:border-zinc-800/40"
                      style={{ top: (h - HORA_INICIO) * PX_POR_HORA + PX_POR_HORA / 2 }}
                    />
                  ))}

                  {/* Citas del día */}
                  {citasFiltradas
                    .filter(c => c.dia === diaIdx)
                    .map(cita => (
                      <CitaBlock key={cita.id} cita={cita} onClick={setCitaActiva} />
                    ))
                  }
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Panel lateral de cita */}
      <AnimatePresence>
        {citaActiva && (
          <motion.div
            initial={{ opacity: 0, x: 32 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 32 }}
            className="w-72 shrink-0 border-l border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 flex flex-col overflow-y-auto"
          >
            <div className="flex items-center justify-between px-4 py-3 border-b border-zinc-100 dark:border-zinc-800">
              <p className="text-sm font-bold text-zinc-900 dark:text-white">Detalle de cita</p>
              <button
                onClick={() => setCitaActiva(null)}
                className="p-1.5 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
              >
                <X className="h-3.5 w-3.5 text-zinc-500" />
              </button>
            </div>

            <div className="p-4 space-y-4">
              {/* Estado badge */}
              <span className={cn('text-[10px] font-bold px-2.5 py-1 rounded-full', estadoConfig[citaActiva.estado].cls)}>
                {estadoConfig[citaActiva.estado].label}
              </span>

              {/* Info cards */}
              {[
                { icon: User,      label: 'Paciente',      value: citaActiva.paciente },
                { icon: Activity,  label: 'Procedimiento', value: citaActiva.procedimiento },
                { icon: User,      label: 'Alumno',        value: citaActiva.alumno },
                { icon: Clock,     label: 'Hora',          value: `${citaActiva.hora}:00 — ${citaActiva.hora + citaActiva.duracion}:00 (${citaActiva.duracion}h)` },
                { icon: Hash,      label: 'Nodo',          value: citaActiva.nodo },
              ].map(item => (
                <div key={item.label}>
                  <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-wide mb-1">{item.label}</p>
                  <div className="flex items-center gap-2">
                    <item.icon className="h-3.5 w-3.5 text-zinc-400 shrink-0" />
                    <p className="text-xs text-zinc-700 dark:text-zinc-300">{item.value}</p>
                  </div>
                </div>
              ))}

              {/* Cambiar estado */}
              <div>
                <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-wide mb-1">Cambiar estado</p>
                <div className="flex flex-col gap-1.5">
                  {(['confirmada', 'en_consulta', 'completada', 'cancelada', 'no_show'] as EstadoCita[]).map(est => (
                    <button
                      key={est}
                      onClick={() => {
                        setCitaActiva(prev => prev ? { ...prev, estado: est } : prev);
                      }}
                      className={cn(
                        'text-left text-[10px] font-semibold px-3 py-2 rounded-xl transition-all',
                        citaActiva.estado === est
                          ? estadoConfig[est].cls
                          : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-500 hover:bg-zinc-200 dark:hover:bg-zinc-700'
                      )}
                    >
                      {estadoConfig[est].label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const AgendaView: React.FC = () => (
  <UAOLayout>
    <AgendaViewContent />
  </UAOLayout>
);

export default AgendaView;
