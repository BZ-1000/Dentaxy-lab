/**
 * AlumnoView.tsx — Fase 2 (Multijugador)
 * Vista principal del Alumno Clínico con conexión Real-Time al Sandbox
 */

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Stethoscope, Calendar, ChevronRight, TrendingUp,
  Clock, User, Award, FileText, UserPlus, Plus, X, Loader2
} from 'lucide-react';
import { useDemo } from '../context/DemoContext';
import { useUaoSandbox, SandboxPatient } from '../context/SandboxContext';
import UAOLayout from '../components/UAOLayout';
import { Button } from '@/components/ui/button';

// ─────────────────────────────────────────────────────────────────────────────
// SEMÁFORO DE AVANCE (Aleatorio simulado para los pacientes)
// ─────────────────────────────────────────────────────────────────────────────
const Semaforo: React.FC<{ pct: number }> = ({ pct }) => {
  const color = pct >= 70 ? 'bg-emerald-500' : pct >= 40 ? 'bg-amber-500' : 'bg-red-500';
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
// CARD PACIENTE SANDBOX
// ─────────────────────────────────────────────────────────────────────────────
interface PacienteCardProps {
  paciente: SandboxPatient;
  index: number;
}

const PacienteCard: React.FC<PacienteCardProps> = ({ paciente, index }) => {
  const navigate = useNavigate();
  const initials = paciente.nombre.split(' ').slice(0, 2).map(n => n[0]).join('');
  const colorMap = ['bg-blue-500', 'bg-violet-500', 'bg-emerald-500', 'bg-rose-500'];
  const avatarColor = colorMap[index % colorMap.length];

  const proxCita = new Date();
  proxCita.setDate(proxCita.getDate() + (index % 3)); // Fechas demo

  // Simulamos un % de avance aleatorio pero determinista por ID
  const avance = Math.abs(paciente.id.charCodeAt(0) % 100); 

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
          <div className="flex items-center justify-between mb-1">
            <h3 className="text-sm font-bold text-zinc-900 dark:text-white truncate pr-2">
              {paciente.nombre}
            </h3>
            <ChevronRight className="h-4 w-4 text-zinc-300 dark:text-zinc-600 group-hover:text-zinc-500 group-hover:translate-x-0.5 transition-all shrink-0" />
          </div>

          {/* Diagnóstico */}
          <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-snug mb-3 line-clamp-1">
            {paciente.diagnostico || 'Diagnóstico inicial pendiente'}
          </p>

          <div className="mb-3">
            <div className="flex justify-between mb-1">
              <span className="text-[10px] text-zinc-400 font-medium">Avance del tratamiento</span>
            </div>
            <Semaforo pct={avance} />
          </div>

          <div className="flex flex-wrap gap-x-4 gap-y-1">
            <div className="flex items-center gap-1.5">
              <Calendar className="h-3 w-3 text-zinc-400" />
              <span className="text-[11px] font-medium text-zinc-500">
                {proxCita.toLocaleDateString('es-MX', { day: 'numeric', month: 'short' })}
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <Stethoscope className="h-3 w-3 text-zinc-400" />
              <span className="text-[11px] text-zinc-500 truncate max-w-[160px]">Revisión Clínica</span>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-3 pt-3 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <User className="h-3 w-3 text-zinc-400" />
          <span className="text-[11px] text-zinc-400">Docente: {paciente.creador_rol === 'docente' ? paciente.creador_nombre : 'Dr. Asignado'}</span>
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
const StatsBar: React.FC<{ pacientesCount: number }> = ({ pacientesCount }) => {
  const meta = 48;
  const asignados = pacientesCount;
  
  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.05 }}
      className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6"
    >
      {[
        { label: 'Pacientes en Sandbox', value: asignados, icon: User, color: 'text-blue-600' },
        { label: 'Cita hoy', value: asignados > 0 ? '1' : '0', icon: Calendar, color: 'text-emerald-600' },
        { label: 'Firmas Sem.', value: `${asignados}/${meta}`, icon: TrendingUp, color: 'text-violet-600' },
        { label: 'Aprobación', value: asignados > 0 ? 'En curso' : '0%', icon: Award, color: asignados > 0 ? 'text-amber-600' : 'text-emerald-600' },
      ].map((item) => (
        <div key={item.label} className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200/80 dark:border-zinc-800/80 p-4 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <item.icon className={`h-4 w-4 ${item.color}`} />
          </div>
          <p className={`text-xl md:text-2xl font-bold ${item.color}`}>{item.value}</p>
          <p className="text-[11px] text-zinc-400 mt-0.5 font-medium">{item.label}</p>
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
  const { isAuthenticated, isZeroState, toggleZeroState } = useDemo();
  const { patients, isLoading, addPatient } = useUaoSandbox();

  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ nombre: '', edad: '', diagnostico: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  React.useEffect(() => {
    if (!isAuthenticated) navigate('/academico');
  }, [isAuthenticated, navigate]);

  // Si hay pacientes en el sandbox, forzamos apagar el flag "ZeroState" 
  // que antes usábamos manualmente
  React.useEffect(() => {
    if (patients.length > 0 && isZeroState) toggleZeroState();
  }, [patients.length, isZeroState, toggleZeroState]);

  const handleCreatePatient = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.nombre) return;
    setIsSubmitting(true);
    await addPatient({
      nombre: formData.nombre,
      edad: formData.edad ? parseInt(formData.edad) : 25,
      diagnostico: formData.diagnostico || 'Caries de primer grado',
      creador_rol: 'alumno',
      creador_nombre: 'Dra. Demo Alumno'
    });
    setShowModal(false);
    setIsSubmitting(false);
    setFormData({ nombre: '', edad: '', diagnostico: '' });
  };

  return (
    <div className="p-4 sm:p-6 pb-24">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
      >
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-zinc-900 dark:text-white tracking-tight">Mis Pacientes</h1>
          <p className="text-sm font-medium text-blue-600 dark:text-blue-400 mt-1">
            Workspace Sandbox (Multi-usuario Activo)
          </p>
        </div>
        <Button 
          onClick={() => setShowModal(true)}
          className="rounded-full shadow-lg shadow-blue-500/20 gap-2 bg-blue-600 hover:bg-blue-700"
        >
          <Plus className="h-4 w-4" /> Registrar Paciente Libre
        </Button>
      </motion.div>

      <StatsBar pacientesCount={patients.length} />

      {/* Loading o Grid */}
      {isLoading ? (
        <div className="w-full py-20 flex flex-col items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-blue-500 mb-4" />
          <p className="text-sm font-medium text-zinc-500">Sincronizando con Sandbox Realtime...</p>
        </div>
      ) : patients.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full bg-white dark:bg-zinc-900/50 border border-dashed border-zinc-300 dark:border-zinc-700 rounded-3xl p-12 flex flex-col items-center justify-center text-center mt-6 shadow-sm"
        >
          <div className="w-16 h-16 bg-blue-50 dark:bg-blue-900/20 rounded-full flex items-center justify-center mb-5 ring-8 ring-blue-50/50 dark:ring-blue-900/10">
            <UserPlus className="h-7 w-7 text-blue-600 dark:text-blue-500" />
          </div>
          <h3 className="text-xl font-bold text-zinc-900 dark:text-white mb-2">Base de datos en blanco (Estado Cero)</h3>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 max-w-md mb-8 leading-relaxed">
            Estás usando un token temporal de demostración. Crea un paciente (o haz que Administración cree uno) y velo aparecer mágicamente en tiempo real en esta pantalla.
          </p>
          <Button onClick={() => setShowModal(true)} className="rounded-full px-8">
            <Plus className="h-4 w-4 mr-2" />
            Crear mi primer expediente clínico
          </Button>
        </motion.div>
      ) : (
        <motion.div 
          initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
        >
          {patients.map((p, i) => (
            <PacienteCard key={p.id} paciente={p} index={i} />
          ))}
        </motion.div>
      )}

      {/* Modal Realtime para Alta Ficticia */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setShowModal(false)}
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-md bg-white dark:bg-zinc-900 rounded-[28px] border border-zinc-200 dark:border-zinc-800 shadow-2xl p-7"
            >
              <button 
                onClick={() => setShowModal(false)}
                className="absolute top-5 right-5 p-2 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-400 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
              
              <h2 className="text-xl font-bold text-zinc-900 dark:text-white mb-1">Registrar Paciente Sandbox</h2>
              <p className="text-xs font-medium text-zinc-500 mb-6">Todos los en sala lo verán instantly. Desaparecerá finalizando sesión.</p>
              
              <form onSubmit={handleCreatePatient} className="space-y-4">
                <div>
                  <label className="block text-[11px] font-bold tracking-wide text-zinc-600 dark:text-zinc-400 uppercase mb-1.5 ml-1">Nombre Completo</label>
                  <input required type="text" value={formData.nombre} onChange={e => setFormData({...formData, nombre: e.target.value})}
                    className="w-full bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none transition-shadow" placeholder="E.g. Juan Pérez Gómez" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-bold tracking-wide text-zinc-600 dark:text-zinc-400 uppercase mb-1.5 ml-1">Edad</label>
                    <input type="number" value={formData.edad} onChange={e => setFormData({...formData, edad: e.target.value})}
                      className="w-full bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none transition-shadow" placeholder="35" />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold tracking-wide text-zinc-600 dark:text-zinc-400 uppercase mb-1.5 ml-1">Rol Creador</label>
                    <input disabled value="Alumno (Tú)"
                      className="w-full bg-zinc-100 dark:bg-zinc-800/80 border border-zinc-200 dark:border-zinc-700/50 rounded-xl px-4 py-3 text-sm text-zinc-500 cursor-not-allowed" />
                  </div>
                </div>
                <div>
                  <label className="block text-[11px] font-bold tracking-wide text-zinc-600 dark:text-zinc-400 uppercase mb-1.5 ml-1">Asunto / Diagnóstico Inicial</label>
                  <input type="text" value={formData.diagnostico} onChange={e => setFormData({...formData, diagnostico: e.target.value})}
                    className="w-full bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none transition-shadow" placeholder="Evaluación general de rutina..." />
                </div>
                
                <div className="pt-4">
                  <Button type="submit" disabled={isSubmitting} className="w-full rounded-xl py-6 text-[15px] font-bold shadow-lg shadow-blue-500/20 bg-blue-600 hover:bg-blue-700">
                    {isSubmitting ? <Loader2 className="h-5 w-5 animate-spin" /> : 'Sincronizar Paciente Universal'}
                  </Button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

const AlumnoView: React.FC = () => (
  <UAOLayout>
    <AlumnoViewContent />
  </UAOLayout>
);

export default AlumnoView;
