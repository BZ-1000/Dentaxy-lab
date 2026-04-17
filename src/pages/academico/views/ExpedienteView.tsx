/**
 * ExpedienteView.tsx — Fase 2B
 * Expediente clínico completo con 6 tabs
 * Historia | Odontograma | Periodontograma | Tratamiento | Notas | Estudios
 */

import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft, User, Calendar, FileText,
  Stethoscope, Activity, BarChart3, BookOpen, Paperclip,
  ChevronRight, AlertCircle, Clock, Hash
} from 'lucide-react';
import { useDemo } from '../context/DemoContext';
import { useUaoSandbox } from '../context/SandboxContext';
import UAOLayout from '../components/UAOLayout';
import HistoriaClinica21 from '../components/HistoriaClinica21';
import OdontogramaFDI from '../components/OdontogramaFDI';
import PeriodontogramaGrid from '../components/PeriodontogramaGrid';
import PlanTratamiento from '../components/PlanTratamiento';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

// ─────────────────────────────────────────────────────────────────────────────
// TABS CONFIG
// ─────────────────────────────────────────────────────────────────────────────

type TabId = 'historia' | 'odontograma' | 'periodontograma' | 'tratamiento' | 'notas' | 'estudios';

const TABS: { id: TabId; label: string; icon: React.ElementType; badge?: string }[] = [
  { id: 'historia',       label: 'Historia',       icon: FileText },
  { id: 'odontograma',    label: 'Odontograma',    icon: Hash,      badge: 'FDI' },
  { id: 'periodontograma',label: 'Periodontograma',icon: BarChart3 },
  { id: 'tratamiento',    label: 'Tratamiento',    icon: Activity },
  { id: 'notas',          label: 'Notas',          icon: BookOpen,  badge: 'Real-Time' },
  { id: 'estudios',       label: 'Estudios',       icon: Paperclip },
];

// ─────────────────────────────────────────────────────────────────────────────
// SIDEBAR DEL PACIENTE
// ─────────────────────────────────────────────────────────────────────────────

const SidebarPaciente: React.FC<{ paciente: any, index: number }> = ({ paciente, index }) => {
  const colorMap = ['bg-blue-500', 'bg-violet-500', 'bg-emerald-500', 'bg-rose-500'];
  const avatarColor = colorMap[index % colorMap.length];
  const initials = paciente.nombre.split(' ').slice(0, 2).map((n: string) => n[0]).join('');
  const pct = Math.abs(paciente.id.charCodeAt(0) % 100);
  const colorPct = pct >= 70 ? 'text-emerald-600' : pct >= 40 ? 'text-amber-600' : 'text-red-600';

  return (
    <div className="w-72 shrink-0 border-r border-zinc-200 dark:border-zinc-800 p-5 space-y-5 overflow-y-auto bg-white dark:bg-zinc-900">
      <div className="text-center">
        <div className={`w-16 h-16 rounded-3xl ${avatarColor} flex items-center justify-center text-white font-bold text-xl mx-auto mb-3`}>
          {initials}
        </div>
        <h2 className="text-sm font-bold text-zinc-900 dark:text-white leading-tight">{paciente.nombre}</h2>
        <p className="text-xs text-zinc-400 mt-1">{paciente.edad || 25} años</p>
      </div>

      <div className="space-y-2">
        <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-wide">Avance del tratamiento</p>
        <div className="flex items-center gap-2">
          <div className="flex-1 h-2 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ duration: 0.8 }}
              className={`h-full rounded-full ${pct >= 70 ? 'bg-emerald-500' : pct >= 40 ? 'bg-amber-500' : 'bg-red-500'}`}
            />
          </div>
          <span className={`text-xs font-bold ${colorPct}`}>{pct}%</span>
        </div>
      </div>

      {[
        { label: 'Diagnóstico', value: paciente.diagnostico || 'Evaluación inicial', icon: Stethoscope },
        { label: 'Rol Creador', value: paciente.creador_rol.toUpperCase(), icon: User },
        { label: 'Registrado por', value: paciente.creador_nombre || 'Sistema', icon: User },
        { label: 'Registro de Fecha', value: new Date(paciente.created_at).toLocaleString('es-MX', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }), icon: Calendar },
      ].map(item => (
        <div key={item.label}>
          <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-1">{item.label}</p>
          <div className="flex items-start gap-2">
            <item.icon className="h-3.5 w-3.5 text-zinc-400 shrink-0 mt-px" />
            <p className="text-xs text-zinc-700 dark:text-zinc-300 leading-snug">{item.value}</p>
          </div>
        </div>
      ))}
      <div>
        <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-1">Entorno de Datos</p>
        <span className="inline-block text-xs font-semibold px-2.5 py-1 bg-amber-100 dark:bg-amber-950/30 text-amber-700 dark:text-amber-400 rounded-xl">
          Sandbox Multijugador
        </span>
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// TAB DE NOTAS CLÍNICAS (REALTIME)
// ─────────────────────────────────────────────────────────────────────────────

const NotasTab: React.FC<{ patientId: string }> = ({ patientId }) => {
  const { records, addRecord } = useUaoSandbox();
  const [texto, setTexto] = useState('');
  const [enviando, setEnviando] = useState(false);

  // Filtrar récords de este paciente (orden descendente)
  const misNotas = records.filter(r => r.patient_id === patientId && r.tipo === 'nota_evolucion');

  const handleEnviar = async () => {
    if (!texto.trim()) return;
    setEnviando(true);
    await addRecord({
      patient_id: patientId,
      tipo: 'nota_evolucion',
      contenido: { texto },
      creador_rol: 'alumno',
      creador_nombre: 'Alumno Demo',
      estado: 'pendiente'
    });
    setTexto('');
    setEnviando(false);
  };

  return (
    <div className="p-4 flex flex-col h-full space-y-4">
      {/* Editor de nota */}
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-4 shadow-sm shrink-0">
        <h3 className="text-sm font-bold text-zinc-900 dark:text-white mb-3">Redactar Evolución Clínica</h3>
        <textarea
          value={texto}
          onChange={e => setTexto(e.target.value)}
          placeholder="Escribe la evolución del paciente aquí. Al enviarla, el Docente recibirá una notificación en tiempo real para autorizarla..."
          className="w-full min-h-[100px] text-sm bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-800 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 mb-3 transition-all"
        />
        <div className="flex justify-end">
          <Button onClick={handleEnviar} disabled={enviando || !texto.trim()} className="bg-blue-600 hover:bg-blue-700 shadow-md">
            {enviando ? 'Enviando a Supervisor...' : 'Guardar y Solicitar Firma'}
          </Button>
        </div>
      </div>

      {/* Historial Sandbox Realtime */}
      <div className="flex-1 overflow-y-auto space-y-3 pb-20">
        <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-widest pl-1 mt-2">Historial de Evolución</h3>
        {misNotas.length === 0 ? (
          <p className="text-sm text-zinc-400 pl-1 mt-4 italic">No hay notas clínicas en este expediente dentro del Sandbox actual.</p>
        ) : misNotas.map(nota => (
          <motion.div
            key={nota.id}
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            className={cn(
              "p-4 rounded-2xl border transition-all",
              nota.estado === 'aprobado' ? "bg-emerald-50/50 dark:bg-emerald-950/10 border-emerald-100 dark:border-emerald-900/40" 
                                         : "bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800"
            )}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Calendar className="h-3.5 w-3.5 text-zinc-400" />
                <span className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                  {new Date(nota.created_at).toLocaleString('es-MX', { day: 'numeric', month: 'short', hour: '2-digit', minute:'2-digit' })}
                </span>
                {nota.estado === 'aprobado' ? (
                  <span className="text-[10px] px-2 py-0.5 bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400 rounded-full font-bold flex items-center gap-1">
                    <CheckCircle2 className="h-3 w-3" /> Firmado
                  </span>
                ) : (
                  <span className="text-[10px] px-2 py-0.5 bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400 rounded-full font-bold flex items-center gap-1">
                    <Clock className="h-3 w-3" /> Pendiente de Firma
                  </span>
                )}
              </div>
            </div>
            <p className="text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed whitespace-pre-wrap">{nota.contenido?.texto}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// TAB DE ESTUDIOS (placeholder elegante)
// ─────────────────────────────────────────────────────────────────────────────

const EstudiosTab: React.FC = () => (
  <div className="p-4">
    <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-dashed border-zinc-200 dark:border-zinc-800 p-12 text-center">
      <Paperclip className="h-10 w-10 text-zinc-300 dark:text-zinc-600 mx-auto mb-3" />
      <h3 className="text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-1">Estudios y Radiografías</h3>
      <p className="text-xs text-zinc-400 mb-4">Integración DICOM temporalmente fuera del alcance de este sandbox.</p>
    </div>
  </div>
);

// ─────────────────────────────────────────────────────────────────────────────
// EXPEDIENTE VIEW CONTENT
// ─────────────────────────────────────────────────────────────────────────────

const ExpedienteViewContent: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isAuthenticated } = useDemo();
  const { patients } = useUaoSandbox();
  const [tabActivo, setTabActivo] = useState<TabId>('notas'); // Default to Notas for Demo purposes

  React.useEffect(() => {
    if (!isAuthenticated) navigate('/academico');
  }, [isAuthenticated, navigate]);

  const paciente = patients.find(p => p.id === id);
  const pacienteIndex = patients.findIndex(p => p.id === id);

  if (!paciente) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p className="text-zinc-500">Paciente no encontrado en el Sandbox.</p>
      </div>
    );
  }

  const renderTab = () => {
    switch (tabActivo) {
      case 'historia':       return <HistoriaClinica21 pacienteId={paciente.id} />;
      case 'odontograma':    return <OdontogramaFDI />;
      case 'periodontograma':return <PeriodontogramaGrid />;
      case 'tratamiento':    return <PlanTratamiento />;
      case 'notas':          return <NotasTab patientId={paciente.id} />;
      case 'estudios':       return <EstudiosTab />;
    }
  };

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <div className="flex items-center gap-3 px-4 py-3 border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">
        <button onClick={() => navigate('/academico/alumno')} className="flex items-center gap-1.5 text-xs text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300 transition-colors">
          <ArrowLeft className="h-3.5 w-3.5" />
          Mis Pacientes
        </button>
        <ChevronRight className="h-3 w-3 text-zinc-300 dark:text-zinc-600" />
        <span className="text-xs font-medium text-zinc-700 dark:text-zinc-300 truncate">{paciente.nombre}</span>
      </div>

      <div className="flex flex-1 min-h-0 overflow-hidden">
        <div className="hidden lg:block">
          <SidebarPaciente paciente={paciente} index={pacienteIndex} />
        </div>

        <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
          <div className="flex items-center gap-0 border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 overflow-x-auto shrink-0">
            {TABS.map(tab => (
              <button
                key={tab.id}
                onClick={() => setTabActivo(tab.id)}
                className={cn(
                  'flex items-center gap-1.5 px-4 py-3 text-xs font-medium transition-all whitespace-nowrap border-b-2 -mb-px',
                  tabActivo === tab.id
                    ? 'border-zinc-900 dark:border-white text-zinc-900 dark:text-white'
                    : 'border-transparent text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300'
                )}
              >
                <tab.icon className="h-3.5 w-3.5 shrink-0" />
                {tab.label}
                {tab.badge && (
                  <span className={cn(
                    "text-[9px] font-bold px-1.5 rounded-full ml-1",
                    tab.badge === 'Real-Time' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 shrink-0' : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-500'
                  )}>
                    {tab.badge}
                  </span>
                )}
              </button>
            ))}
          </div>

          <div className="flex-1 overflow-y-auto overflow-x-hidden bg-zinc-50/50 dark:bg-zinc-950/50">
            <AnimatePresence mode="wait">
              <motion.div key={tabActivo} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.18 }} className="h-full">
                {renderTab()}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
};

const ExpedienteView: React.FC = () => (
  <UAOLayout>
    <ExpedienteViewContent />
  </UAOLayout>
);

export default ExpedienteView;
