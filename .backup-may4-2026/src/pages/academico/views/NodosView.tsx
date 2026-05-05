/**
 * NodosView.tsx
 * Vista del mapa de nodos clínicos UAO
 * 6 nodos maestros — con sub-unidades y jardines de niños
 */

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MapPin, Clock, Users, Stethoscope, AlertTriangle,
  ChevronRight, X, Building2, CheckCircle, Circle
} from 'lucide-react';
import { NODOS, NodoClinico, NodoId, JardinNinos } from '@/data/uaoMockData';
import { useDemo } from '../context/DemoContext';
import UAOLayout from '../components/UAOLayout';
import { cn } from '@/lib/utils';

// ─────────────────────────────────────────────────────────────────────────────
// MODAL DE SUB-UNIDADES
// ─────────────────────────────────────────────────────────────────────────────

interface SubUnidadModalProps {
  nodo: NodoClinico;
  onClose: () => void;
  onSelect: (subId: string) => void;
}

const SubUnidadModal: React.FC<SubUnidadModalProps> = ({ nodo, onClose, onSelect }) => {
  const esJardines = !!nodo.jardines;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-end sm:items-center justify-center p-4"
      >
        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.97 }}
          transition={{ type: 'spring', damping: 30, stiffness: 400 }}
          onClick={e => e.stopPropagation()}
          className="w-full max-w-md bg-white dark:bg-zinc-900 rounded-3xl shadow-2xl overflow-hidden"
        >
          {/* Header del modal */}
          <div
            className={`px-6 pt-6 pb-4 bg-gradient-to-r ${nodo.colorBg} text-white`}
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-medium opacity-80 uppercase tracking-wider mb-1">
                  {esJardines ? 'Selecciona el jardín' : 'Selecciona la unidad'}
                </p>
                <h2 className="text-xl font-bold">{nodo.nombre}</h2>
                <p className="text-sm opacity-80 mt-0.5">{nodo.nombreCompleto}</p>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-xl bg-white/20 hover:bg-white/30 transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Lista de opciones */}
          <div className="p-4 max-h-[60vh] overflow-y-auto">
            {/* Sub-unidades tipo clínica */}
            {nodo.subUnidades && (
              <div className="space-y-2">
                {nodo.subUnidades.map((sub, i) => (
                  <motion.button
                    key={sub.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    onClick={() => onSelect(sub.id)}
                    className="w-full text-left p-4 rounded-2xl border border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-all group"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-semibold text-zinc-900 dark:text-white text-sm">{sub.nombre}</p>
                        <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">{sub.descripcion}</p>
                        <div className="flex items-center gap-3 mt-2">
                          <span className="text-xs text-zinc-500">
                            <span className="font-medium text-zinc-700 dark:text-zinc-300">{sub.silloneActivos}</span>/{sub.sillones} sillones activos
                          </span>
                          <span
                            className={cn(
                              'inline-flex items-center gap-1 text-[10px] font-medium px-2 py-0.5 rounded-full',
                              sub.silloneActivos === sub.sillones
                                ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
                                : 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
                            )}
                          >
                            <span className={cn('w-1.5 h-1.5 rounded-full', sub.silloneActivos === sub.sillones ? 'bg-emerald-500' : 'bg-amber-500')} />
                            {sub.silloneActivos === sub.sillones ? 'Operativa' : 'Incidencia'}
                          </span>
                        </div>
                      </div>
                      <ChevronRight className="h-4 w-4 text-zinc-400 group-hover:translate-x-0.5 transition-transform shrink-0" />
                    </div>
                  </motion.button>
                ))}
              </div>
            )}

            {/* Jardines de niños */}
            {nodo.jardines && (
              <div className="space-y-2">
                <p className="text-xs text-zinc-400 font-medium px-1 mb-3">
                  {nodo.jardines.length} jardines con convenio institucional SEP
                </p>
                {nodo.jardines.map((jn, i) => (
                  <motion.button
                    key={jn.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.04 }}
                    onClick={() => onSelect(jn.id)}
                    className="w-full text-left p-3.5 rounded-2xl border border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-all group"
                  >
                    <div className="flex items-center gap-3">
                      <div className={cn(
                        'w-2 h-2 rounded-full shrink-0',
                        jn.estado === 'activo' ? 'bg-emerald-500' : jn.estado === 'pendiente' ? 'bg-amber-500' : 'bg-zinc-300'
                      )} />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-zinc-900 dark:text-white truncate">{jn.nombre}</p>
                        <p className="text-xs text-zinc-400 mt-0.5">
                          {jn.alumnos} niños · Próx. visita: {new Date(jn.proximaVisita).toLocaleDateString('es-MX', { day: 'numeric', month: 'short' })}
                        </p>
                      </div>
                      <ChevronRight className="h-3.5 w-3.5 text-zinc-400 group-hover:translate-x-0.5 transition-transform shrink-0" />
                    </div>
                  </motion.button>
                ))}
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// CARD DE NODO
// ─────────────────────────────────────────────────────────────────────────────

interface NodoCardProps {
  nodo: NodoClinico;
  index: number;
  onSelect: (nodo: NodoClinico) => void;
}

const NodoCard: React.FC<NodoCardProps> = ({ nodo, index, onSelect }) => {
  const ocupacion = nodo.sillones > 0
    ? Math.round((nodo.silloneActivos / nodo.sillones) * 100)
    : null;

  return (
    <motion.button
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -4, scale: 1.01 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => onSelect(nodo)}
      className="group w-full text-left bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200/80 dark:border-zinc-800/80 hover:border-zinc-300 dark:hover:border-zinc-700 hover:shadow-xl hover:shadow-zinc-200/60 dark:hover:shadow-zinc-950/60 transition-all duration-250 overflow-hidden focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-white focus:ring-offset-2"
    >
      {/* Banda de color top */}
      <div className={`h-1.5 w-full bg-gradient-to-r ${nodo.colorBg}`} />

      <div className="p-5">
        {/* Header de la card */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            {/* Icono del nodo */}
            <div
              className={`w-10 h-10 rounded-2xl bg-gradient-to-br ${nodo.colorBg} flex items-center justify-center shadow-sm`}
            >
              <Building2 className="h-5 w-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-zinc-900 dark:text-white leading-tight">
                  {nodo.nombre}
                </h3>
                {/* Estado dot */}
                <span className={cn(
                  'w-2 h-2 rounded-full shrink-0',
                  nodo.estado === 'activo' ? 'bg-emerald-500' : nodo.estado === 'incidencia' ? 'bg-amber-500 animate-pulse' : 'bg-zinc-400'
                )} />
              </div>
              {nodo.badge && (
                <span
                  className="inline-block text-[10px] font-semibold px-2 py-0.5 rounded-full mt-0.5"
                  style={{ backgroundColor: nodo.color + '15', color: nodo.color }}
                >
                  {nodo.badge}
                </span>
              )}
            </div>
          </div>
          <ChevronRight className="h-4 w-4 text-zinc-300 dark:text-zinc-600 group-hover:text-zinc-500 group-hover:translate-x-0.5 transition-all shrink-0 mt-1" />
        </div>

        {/* Descripción */}
        <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed line-clamp-2 mb-4">
          {nodo.descripcion}
        </p>

        {/* Métricas */}
        <div className="grid grid-cols-3 gap-2 mb-4">
          <div className="text-center">
            <p className="text-lg font-bold text-zinc-900 dark:text-white">{nodo.alumnosActivos}</p>
            <p className="text-[10px] text-zinc-400">Alumnos</p>
          </div>
          <div className="text-center border-x border-zinc-100 dark:border-zinc-800">
            <p className="text-lg font-bold text-zinc-900 dark:text-white">{nodo.pacientesHoy}</p>
            <p className="text-[10px] text-zinc-400">Hoy</p>
          </div>
          <div className="text-center">
            {nodo.sillones > 0 ? (
              <>
                <p className="text-lg font-bold text-zinc-900 dark:text-white">{nodo.silloneActivos}/{nodo.sillones}</p>
                <p className="text-[10px] text-zinc-400">Sillones</p>
              </>
            ) : (
              <>
                <p className="text-lg font-bold text-zinc-900 dark:text-white">{nodo.jardines?.length ?? '—'}</p>
                <p className="text-[10px] text-zinc-400">Jardines</p>
              </>
            )}
          </div>
        </div>

        {/* Barra de ocupación de sillones */}
        {ocupacion !== null && (
          <div className="mb-3">
            <div className="flex justify-between items-center mb-1">
              <span className="text-[10px] text-zinc-400">Ocupación</span>
              <span className="text-[10px] font-medium text-zinc-600 dark:text-zinc-400">{ocupacion}%</span>
            </div>
            <div className="h-1.5 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${ocupacion}%` }}
                transition={{ delay: index * 0.08 + 0.3, duration: 0.6, ease: 'easeOut' }}
                className={`h-full rounded-full bg-gradient-to-r ${nodo.colorBg}`}
              />
            </div>
          </div>
        )}

        {/* Alerta de incidencia */}
        {nodo.incidencia && (
          <div className="flex items-center gap-2 p-2 bg-amber-50 dark:bg-amber-950/20 rounded-xl border border-amber-200/60 dark:border-amber-800/40">
            <AlertTriangle className="h-3 w-3 text-amber-500 shrink-0" />
            <p className="text-[10px] text-amber-700 dark:text-amber-400 leading-snug">{nodo.incidencia}</p>
          </div>
        )}

        {/* Sub-unidades indicator */}
        {nodo.tieneSubUnidades && (
          <div className="flex items-center gap-1.5 mt-3 text-[10px] text-zinc-400 font-medium">
            <span>{nodo.subUnidades ? `${nodo.subUnidades.length} unidades` : `${nodo.jardines?.length} jardines`}</span>
            <span>· Toca para seleccionar</span>
          </div>
        )}

        {/* Info footer */}
        <div className="flex items-start gap-1.5 mt-3 pt-3 border-t border-zinc-100 dark:border-zinc-800">
          <MapPin className="h-3 w-3 text-zinc-400 shrink-0 mt-px" />
          <p className="text-[10px] text-zinc-400 leading-snug line-clamp-1">{nodo.direccion}</p>
        </div>
        <div className="flex items-center gap-1.5 mt-1">
          <Clock className="h-3 w-3 text-zinc-400 shrink-0" />
          <p className="text-[10px] text-zinc-400 leading-snug">{nodo.horario}</p>
        </div>
      </div>
    </motion.button>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// KPI SUMMARY BAR (para el header de la vista)
// ─────────────────────────────────────────────────────────────────────────────

const KpiBar: React.FC = () => {
  const items = [
    { label: 'Nodos activos', value: '5/6', color: 'text-emerald-600' },
    { label: 'Alumnos hoy', value: '164', color: 'text-blue-600' },
    { label: 'Pacientes hoy', value: '112', color: 'text-violet-600' },
    { label: 'Alertas', value: '3', color: 'text-amber-600' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6"
    >
      {items.map((item, i) => (
        <div key={item.label} className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200/80 dark:border-zinc-800/80 px-4 py-3">
          <p className={`text-xl font-bold ${item.color}`}>{item.value}</p>
          <p className="text-xs text-zinc-400 mt-0.5">{item.label}</p>
        </div>
      ))}
    </motion.div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// VISTA PRINCIPAL
// ─────────────────────────────────────────────────────────────────────────────

const NodosViewContent: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated, rolActivo, selectNodo } = useDemo();
  const [modalNodo, setModalNodo] = useState<NodoClinico | null>(null);

  // Verificar autenticación
  React.useEffect(() => {
    if (!isAuthenticated) navigate('/academico');
  }, [isAuthenticated, navigate]);

  const handleNodoSelect = (nodo: NodoClinico) => {
    if (nodo.tieneSubUnidades || nodo.jardines) {
      setModalNodo(nodo);
    } else {
      selectNodo(nodo.id as NodoId);
      navigate(`/academico/nodos/${nodo.id}`);
    }
  };

  const handleSubUnidadSelect = (subId: string) => {
    if (!modalNodo) return;
    selectNodo(modalNodo.id as NodoId, subId);
    setModalNodo(null);
    navigate(`/academico/nodos/${modalNodo.id}/${subId}`);
  };

  return (
    <>
      <div className="p-4 sm:p-6">
        {/* Encabezado */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-white tracking-tight">
            Nodos Clínicos
          </h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
            Red de clínicas activas — Universidad Autónoma de Zacatecas
          </p>
        </motion.div>

        {/* KPI summary */}
        <KpiBar />

        {/* Grid de nodos */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {NODOS.map((nodo, i) => (
            <NodoCard
              key={nodo.id}
              nodo={nodo}
              index={i}
              onSelect={handleNodoSelect}
            />
          ))}
        </div>

        {/* Leyenda de estado */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="flex items-center gap-6 mt-8 px-1"
        >
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span className="text-xs text-zinc-400">Activo</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
            <span className="text-xs text-zinc-400">Incidencia</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-zinc-400" />
            <span className="text-xs text-zinc-400">Cerrado</span>
          </div>
        </motion.div>
      </div>

      {/* Modal de sub-unidades */}
      {modalNodo && (
        <SubUnidadModal
          nodo={modalNodo}
          onClose={() => setModalNodo(null)}
          onSelect={handleSubUnidadSelect}
        />
      )}
    </>
  );
};

const NodosView: React.FC = () => (
  <UAOLayout>
    <NodosViewContent />
  </UAOLayout>
);

export default NodosView;
