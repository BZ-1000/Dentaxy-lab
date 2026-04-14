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
import { PACIENTES_DEMO } from '@/data/uaoMockData';
import { useDemo } from '../context/DemoContext';
import UAOLayout from '../components/UAOLayout';
import HistoriaClinica21 from '../components/HistoriaClinica21';
import OdontogramaFDI from '../components/OdontogramaFDI';
import PeriodontogramaGrid from '../components/PeriodontogramaGrid';
import PlanTratamiento from '../components/PlanTratamiento';
import { cn } from '@/lib/utils';

// ─────────────────────────────────────────────────────────────────────────────
// TABS CONFIG
// ─────────────────────────────────────────────────────────────────────────────

type TabId = 'historia' | 'odontograma' | 'periodontograma' | 'tratamiento' | 'notas' | 'estudios';

const TABS: { id: TabId; label: string; icon: React.ElementType; badge?: string }[] = [
  { id: 'historia',       label: 'Historia',       icon: FileText },
  { id: 'odontograma',    label: 'Odontograma',    icon: Hash,      badge: 'FDI' },
  { id: 'periodontograma',label: 'Periodontograma',icon: BarChart3 },
  { id: 'tratamiento',    label: 'Tratamiento',    icon: Activity },
  { id: 'notas',          label: 'Notas',          icon: BookOpen },
  { id: 'estudios',       label: 'Estudios',       icon: Paperclip },
];

// ─────────────────────────────────────────────────────────────────────────────
// SIDEBAR DEL PACIENTE
// ─────────────────────────────────────────────────────────────────────────────

interface SidebarPacienteProps {
  paciente: typeof PACIENTES_DEMO[0];
  index: number;
}

const SidebarPaciente: React.FC<SidebarPacienteProps> = ({ paciente, index }) => {
  const colorMap = ['bg-blue-500', 'bg-violet-500', 'bg-emerald-500', 'bg-rose-500'];
  const avatarColor = colorMap[index % colorMap.length];
  const initials = paciente.nombre.split(' ').slice(0, 2).map(n => n[0]).join('');
  const pct = paciente.avanceTratamiento;
  const colorPct = pct >= 70 ? 'text-emerald-600' : pct >= 40 ? 'text-amber-600' : 'text-red-600';

  return (
    <div className="w-72 shrink-0 border-r border-zinc-200 dark:border-zinc-800 p-5 space-y-5 overflow-y-auto bg-white dark:bg-zinc-900">
      {/* Avatar + nombre */}
      <div className="text-center">
        <div className={`w-16 h-16 rounded-3xl ${avatarColor} flex items-center justify-center text-white font-bold text-xl mx-auto mb-3`}>
          {initials}
        </div>
        <h2 className="text-sm font-bold text-zinc-900 dark:text-white leading-tight">{paciente.nombre}</h2>
        <p className="text-xs text-zinc-400 mt-1">{paciente.edad} años · CURP: {paciente.curp.slice(0, 10)}…</p>
      </div>

      {/* Semáforo de salud */}
      <div className="space-y-2">
        <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-wide">Avance del tratamiento</p>
        <div className="flex items-center gap-2">
          <div className="flex-1 h-2 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${pct}%` }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
              className={`h-full rounded-full ${pct >= 70 ? 'bg-emerald-500' : pct >= 40 ? 'bg-amber-500' : 'bg-red-500'}`}
            />
          </div>
          <span className={`text-xs font-bold ${colorPct}`}>{pct}%</span>
        </div>
      </div>

      {/* Info cards */}
      {[
        { label: 'Diagnóstico principal', value: paciente.diagnosticoPrincipal, icon: Stethoscope },
        { label: 'Alumno asignado', value: paciente.alumnoAsignado, icon: User },
        { label: 'Docente supervisor', value: paciente.docenteSupervisor, icon: User },
        { label: 'Próxima cita', value: new Date(paciente.proximaCita).toLocaleString('es-MX', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }), icon: Calendar },
        { label: 'Próximo procedimiento', value: paciente.procedimientoNext, icon: Activity },
      ].map(item => (
        <div key={item.label}>
          <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-1">{item.label}</p>
          <div className="flex items-start gap-2">
            <item.icon className="h-3.5 w-3.5 text-zinc-400 shrink-0 mt-px" />
            <p className="text-xs text-zinc-700 dark:text-zinc-300 leading-snug">{item.value}</p>
          </div>
        </div>
      ))}

      {/* Saldo pendiente */}
      {paciente.saldo > 0 && (
        <div className="p-3 bg-amber-50 dark:bg-amber-950/20 rounded-xl border border-amber-200/60 dark:border-amber-800/40">
          <div className="flex items-center gap-1.5 mb-1">
            <AlertCircle className="h-3.5 w-3.5 text-amber-500" />
            <span className="text-[10px] font-bold text-amber-700 dark:text-amber-400">Saldo pendiente</span>
          </div>
          <p className="text-base font-bold text-amber-700 dark:text-amber-400">
            ${paciente.saldo.toLocaleString('es-MX')} MXN
          </p>
        </div>
      )}

      {/* Clínica */}
      <div>
        <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-1">Clínica / Nodo</p>
        <span className="inline-block text-xs font-semibold px-2.5 py-1 bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 rounded-xl">
          {paciente.nodo.toUpperCase()}
        </span>
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// TAB DE NOTAS CLÍNICAS
// ─────────────────────────────────────────────────────────────────────────────

const NotasTab: React.FC = () => {
  const [notas] = useState([
    { fecha: '2026-04-08', alumno: 'R. Martínez', texto: 'Se realiza primera cita de control. Se explica plan de tratamiento. Paciente acepta y firma consentimiento. Se toman radiografías periapicales de sector posterior. Prescripción de colutorio de clorhexidina 0.12% por 15 días.', procedimiento: 'Diagnóstico y plan' },
    { fecha: '2026-03-22', alumno: 'R. Martínez', texto: 'Se realiza profilaxis dental completa. Se retira cálculo supragingival en todos los sectores. Se motiva al paciente para técnica de cepillado. Se programa siguiente cita para inicio de raspado.', procedimiento: 'Profilaxis' },
    { fecha: '2026-03-08', alumno: 'R. Martínez', texto: 'Primera consulta. Paciente acude con dolor en zona posterior superior derecha. Se toman radiografías. Se detectan caries múltiples y enfermedad periodontal severa en sectores posteriores. Se elabora historia clínica completa.', procedimiento: 'Historia clínica' },
  ]);

  return (
    <div className="p-4 space-y-4">
      {notas.map((nota, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.06 }}
          className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 p-4"
        >
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Calendar className="h-3.5 w-3.5 text-zinc-400" />
              <span className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                {new Date(nota.fecha).toLocaleDateString('es-MX', { day: 'numeric', month: 'long', year: 'numeric' })}
              </span>
              <span className="text-[10px] px-2 py-0.5 bg-zinc-100 dark:bg-zinc-800 text-zinc-500 rounded-full">
                {nota.procedimiento}
              </span>
            </div>
            <div className="flex items-center gap-1">
              <User className="h-3 w-3 text-zinc-400" />
              <span className="text-[10px] text-zinc-400">{nota.alumno}</span>
            </div>
          </div>
          <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">{nota.texto}</p>
        </motion.div>
      ))}
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// TAB DE ESTUDIOS (placeholder elegante)
// ─────────────────────────────────────────────────────────────────────────────

const EstudiosTab: React.FC = () => (
  <div className="p-4">
    <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 p-6 text-center">
      <Paperclip className="h-10 w-10 text-zinc-300 dark:text-zinc-600 mx-auto mb-3" />
      <h3 className="text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-1">Estudios y Radiografías</h3>
      <p className="text-xs text-zinc-400 mb-4">Radiografías periapicales y panorámicas en módulo DICOM</p>
      <div className="grid grid-cols-3 gap-2 max-w-xs mx-auto">
        {['Periapical 36', 'Periapical 16-17', 'Panorámica'].map(e => (
          <div key={e} className="aspect-square bg-zinc-100 dark:bg-zinc-800 rounded-xl flex items-center justify-center">
            <span className="text-[9px] text-zinc-400 text-center px-1">{e}</span>
          </div>
        ))}
      </div>
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
  const [tabActivo, setTabActivo] = useState<TabId>('historia');

  React.useEffect(() => {
    if (!isAuthenticated) navigate('/academico');
  }, [isAuthenticated, navigate]);

  const paciente = PACIENTES_DEMO.find(p => p.id === id) ?? PACIENTES_DEMO[0];
  const pacienteIndex = PACIENTES_DEMO.findIndex(p => p.id === id);

  const renderTab = () => {
    switch (tabActivo) {
      case 'historia':       return <HistoriaClinica21 pacienteId={paciente.id} />;
      case 'odontograma':    return <OdontogramaFDI />;
      case 'periodontograma':return <PeriodontogramaGrid />;
      case 'tratamiento':    return <PlanTratamiento />;
      case 'notas':          return <NotasTab />;
      case 'estudios':       return <EstudiosTab />;
    }
  };

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Breadcrumb header */}
      <div className="flex items-center gap-3 px-4 py-3 border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">
        <button
          onClick={() => navigate('/academico/alumno')}
          className="flex items-center gap-1.5 text-xs text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300 transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Mis Pacientes
        </button>
        <ChevronRight className="h-3 w-3 text-zinc-300 dark:text-zinc-600" />
        <span className="text-xs font-medium text-zinc-700 dark:text-zinc-300 truncate">{paciente.nombre}</span>
        <span className="ml-auto text-[10px] text-zinc-400 shrink-0">Folio: {paciente.id.toUpperCase()}</span>
      </div>

      {/* Layout principal */}
      <div className="flex flex-1 min-h-0 overflow-hidden">
        {/* Sidebar — oculto en móvil */}
        <div className="hidden lg:block">
          <SidebarPaciente paciente={paciente} index={pacienteIndex} />
        </div>

        {/* Área de contenido con tabs */}
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
          {/* Tabs horizontales */}
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
                  <span className="bg-zinc-100 dark:bg-zinc-800 text-zinc-500 text-[9px] font-bold px-1 rounded">
                    {tab.badge}
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Contenido del tab */}
          <div className="flex-1 overflow-y-auto overflow-x-hidden">
            <AnimatePresence mode="wait">
              <motion.div
                key={tabActivo}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.18 }}
                className="h-full"
              >
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
