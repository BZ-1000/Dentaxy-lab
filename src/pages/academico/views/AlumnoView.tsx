/**
 * AlumnoView.tsx — Fase 2A
 * Vista principal del Alumno Clínico: lista de pacientes asignados
 */

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Stethoscope, Calendar, ChevronRight, TrendingUp,
  Clock, User, Award, FileText
} from 'lucide-react';
import { PACIENTES_DEMO } from '@/data/uaoMockData';
import { useDemo } from '../context/DemoContext';
import UAOLayout from '../components/UAOLayout';
import { cn } from '@/lib/utils';

// ─────────────────────────────────────────────────────────────────────────────
// SEMÁFORO DE AVANCE
// ─────────────────────────────────────────────────────────────────────────────
const Semaforo: React.FC<{ pct: number }> = ({ pct }) => {
  const color = pct >= 70 ? 'bg-emerald-500' : pct >= 40 ? 'bg-amber-500' : 'bg-red-500';
  const label = pct >= 70 ? 'Al corriente' : pct >= 40 ? 'En proceso' : 'Atención';
  return (
    <div className="flex items-center gap-2">
      <div className="w-24 h-1.5 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
          className={`h-full rounded-full ${color}`}
        />
      </div>
      <span className="text-xs font-semibold" style={{
        color: pct >= 70 ? '#059669' : pct >= 40 ? '#D97706' : '#DC2626'
      }}>{pct}%</span>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// CARD PACIENTE
// ─────────────────────────────────────────────────────────────────────────────
interface PacienteCardProps {
  paciente: typeof PACIENTES_DEMO[0];
  index: number;
}

const PacienteCard: React.FC<PacienteCardProps> = ({ paciente, index }) => {
  const navigate = useNavigate();
  const initials = paciente.nombre.split(' ').slice(0, 2).map(n => n[0]).join('');
  const colorMap = ['bg-blue-500', 'bg-violet-500', 'bg-emerald-500', 'bg-rose-500'];
  const avatarColor = colorMap[index % colorMap.length];

  const proxCita = new Date(paciente.proximaCita);
  const esHoy = proxCita.toDateString() === new Date().toDateString();

  return (
    <motion.button
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.07, duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -3, scale: 1.01 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => navigate(`/academico/alumno/expediente/${paciente.id}`)}
      className="w-full text-left bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200/80 dark:border-zinc-800/80 p-5 hover:border-zinc-300 dark:hover:border-zinc-700 hover:shadow-xl hover:shadow-zinc-200/50 dark:hover:shadow-zinc-950/50 transition-all duration-200 group focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-white focus:ring-offset-2"
    >
      <div className="flex items-start gap-4">
        {/* Avatar */}
        <div className={`w-12 h-12 rounded-2xl ${avatarColor} flex items-center justify-center text-white font-bold text-sm shrink-0`}>
          {initials}
        </div>

        <div className="flex-1 min-w-0">
          {/* Nombre + arrow */}
          <div className="flex items-center justify-between mb-1">
            <h3 className="text-sm font-bold text-zinc-900 dark:text-white truncate pr-2">
              {paciente.nombre}
            </h3>
            <ChevronRight className="h-4 w-4 text-zinc-300 dark:text-zinc-600 group-hover:text-zinc-500 group-hover:translate-x-0.5 transition-all shrink-0" />
          </div>

          {/* Diagnóstico */}
          <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-snug mb-3 line-clamp-1">
            {paciente.diagnosticoPrincipal}
          </p>

          {/* Avance */}
          <div className="mb-3">
            <div className="flex justify-between mb-1">
              <span className="text-[10px] text-zinc-400 font-medium">Avance del plan</span>
            </div>
            <Semaforo pct={paciente.avanceTratamiento} />
          </div>

          {/* Info row */}
          <div className="flex flex-wrap gap-x-4 gap-y-1">
            <div className="flex items-center gap-1.5">
              <Calendar className="h-3 w-3 text-zinc-400" />
              <span className={`text-[11px] font-medium ${esHoy ? 'text-blue-600 dark:text-blue-400' : 'text-zinc-500'}`}>
                {esHoy ? 'Hoy' : proxCita.toLocaleDateString('es-MX', { day: 'numeric', month: 'short' })}
                {' · '}{proxCita.toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <Stethoscope className="h-3 w-3 text-zinc-400" />
              <span className="text-[11px] text-zinc-500 truncate max-w-[160px]">{paciente.procedimientoNext}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Footer — docente */}
      <div className="mt-3 pt-3 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <User className="h-3 w-3 text-zinc-400" />
          <span className="text-[11px] text-zinc-400">Supervisor: {paciente.docenteSupervisor}</span>
        </div>
        {paciente.saldo > 0 && (
          <span className="text-[10px] font-semibold px-2 py-0.5 bg-amber-50 dark:bg-amber-950/30 text-amber-700 dark:text-amber-400 rounded-full">
            ${paciente.saldo.toLocaleString('es-MX')} pendiente
          </span>
        )}
      </div>
    </motion.button>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// STATS BAR
// ─────────────────────────────────────────────────────────────────────────────
const StatsBar: React.FC = () => {
  const procedimientosMeta = 48;
  const procedimientosHechos = 31;
  const pct = Math.round(procedimientosHechos / procedimientosMeta * 100);

  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.05 }}
      className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6"
    >
      {[
        { label: 'Pacientes asignados', value: PACIENTES_DEMO.length, icon: User, color: 'text-blue-600' },
        { label: 'Cita hoy', value: '1', icon: Calendar, color: 'text-emerald-600' },
        { label: 'Procedimientos sem.', value: `${procedimientosHechos}/${procedimientosMeta}`, icon: TrendingUp, color: 'text-violet-600' },
        { label: 'Avance semestral', value: `${pct}%`, icon: Award, color: pct >= 70 ? 'text-emerald-600' : 'text-amber-600' },
      ].map((item, i) => (
        <div key={item.label} className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200/80 dark:border-zinc-800/80 p-4">
          <div className="flex items-center justify-between mb-2">
            <item.icon className={`h-4 w-4 ${item.color}`} />
          </div>
          <p className={`text-2xl font-bold ${item.color}`}>{item.value}</p>
          <p className="text-[11px] text-zinc-400 mt-0.5">{item.label}</p>
        </div>
      ))}
    </motion.div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// VISTA PRINCIPAL
// ─────────────────────────────────────────────────────────────────────────────
const AlumnoViewContent: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useDemo();

  React.useEffect(() => {
    if (!isAuthenticated) navigate('/academico');
  }, [isAuthenticated, navigate]);

  return (
    <div className="p-4 sm:p-6">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-white tracking-tight">Mis Pacientes</h1>
        <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
          Semestre 8 · Módulo IV — Adolescente, Adulto y Senecto
        </p>
      </motion.div>

      <StatsBar />

      {/* Lista de pacientes */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {PACIENTES_DEMO.map((p, i) => (
          <PacienteCard key={p.id} paciente={p} index={i} />
        ))}
      </div>

      {/* Historial rápido */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mt-6 bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200/80 dark:border-zinc-800/80 p-5"
      >
        <div className="flex items-center gap-2 mb-4">
          <FileText className="h-4 w-4 text-zinc-500" />
          <h2 className="text-sm font-bold text-zinc-900 dark:text-white">Última actividad clínica</h2>
        </div>
        <div className="space-y-2.5">
          {[
            { texto: 'Historia clínica actualizada — M. G. Flores Reyes', tiempo: 'hace 2 horas', tipo: 'historia' },
            { texto: 'Odontograma completado — J. A. Hernández Cruz', tiempo: 'ayer 11:30', tipo: 'odontograma' },
            { texto: 'Plan de tratamiento firmado — R. C. Leal Sandoval', tiempo: 'ayer 09:15', tipo: 'plan' },
          ].map((item, i) => (
            <div key={i} className="flex items-start gap-3">
              <div className="w-1.5 h-1.5 rounded-full bg-zinc-300 dark:bg-zinc-600 mt-1.5 shrink-0" />
              <div>
                <p className="text-xs text-zinc-700 dark:text-zinc-300">{item.texto}</p>
                <div className="flex items-center gap-1 mt-0.5">
                  <Clock className="h-3 w-3 text-zinc-400" />
                  <p className="text-[10px] text-zinc-400">{item.tiempo}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

const AlumnoView: React.FC = () => (
  <UAOLayout>
    <AlumnoViewContent />
  </UAOLayout>
);

export default AlumnoView;
