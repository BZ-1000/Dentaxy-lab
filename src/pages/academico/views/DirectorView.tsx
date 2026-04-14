/**
 * DirectorView.tsx
 * Dashboard del Director General — Vista macro de toda la UAO
 */

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  TrendingUp, Users, FileText, AlertTriangle,
  Building2, Activity, DollarSign, ChevronRight,
  ArrowUpRight, CheckCircle, XCircle, Clock
} from 'lucide-react';
import { KPI_DIRECTOR, ALERTAS_DEMO, NODOS } from '@/data/uaoMockData';
import { useDemo } from '../context/DemoContext';
import UAOLayout from '../components/UAOLayout';

// ─────────────────────────────────────────────────────────────────────────────
// KPI CARD
// ─────────────────────────────────────────────────────────────────────────────

interface KpiCardProps {
  title: string;
  value: string | number;
  sub?: string;
  icon: React.ElementType;
  color: string;
  delay?: number;
  trend?: string;
}

const KpiCard: React.FC<KpiCardProps> = ({ title, value, sub, icon: Icon, color, delay = 0, trend }) => (
  <motion.div
    initial={{ opacity: 0, y: 16 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay, duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
    className="bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200/80 dark:border-zinc-800/80 p-5"
  >
    <div className="flex items-start justify-between mb-4">
      <div
        className="w-10 h-10 rounded-2xl flex items-center justify-center"
        style={{ backgroundColor: color + '18' }}
      >
        <Icon className="h-5 w-5" style={{ color }} />
      </div>
      {trend && (
        <span className="flex items-center gap-1 text-xs font-medium text-emerald-600 dark:text-emerald-400">
          <ArrowUpRight className="h-3.5 w-3.5" />
          {trend}
        </span>
      )}
    </div>
    <p className="text-2xl font-bold text-zinc-900 dark:text-white">{value}</p>
    <p className="text-xs font-medium text-zinc-600 dark:text-zinc-400 mt-0.5">{title}</p>
    {sub && <p className="text-[10px] text-zinc-400 mt-1">{sub}</p>}
  </motion.div>
);

// ─────────────────────────────────────────────────────────────────────────────
// NODO MINI ROW
// ─────────────────────────────────────────────────────────────────────────────

const NodoMiniRow: React.FC<{ nodo: typeof NODOS[0]; index: number }> = ({ nodo, index }) => {
  const navigate = useNavigate();
  const ocupacion = nodo.sillones > 0
    ? Math.round((nodo.silloneActivos / nodo.sillones) * 100)
    : null;

  return (
    <motion.button
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.3 + index * 0.05 }}
      onClick={() => navigate('/academico/nodos')}
      className="w-full flex items-center gap-4 p-3 rounded-2xl hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors group text-left"
    >
      {/* Dot estado */}
      <span className={`w-2.5 h-2.5 rounded-full shrink-0 ${
        nodo.estado === 'activo' ? 'bg-emerald-500' :
        nodo.estado === 'incidencia' ? 'bg-amber-500' : 'bg-zinc-400'
      }`} />

      {/* Nombre + métricas */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <p className="text-sm font-semibold text-zinc-900 dark:text-white truncate">{nodo.nombre}</p>
          {nodo.esEspecialidad && (
            <span className="text-[9px] font-bold px-1.5 py-0.5 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-full">Posgrado</span>
          )}
        </div>
        <div className="flex items-center gap-3 mt-0.5">
          <span className="text-[11px] text-zinc-400">{nodo.alumnosActivos} alumnos</span>
          <span className="text-[11px] text-zinc-400">{nodo.pacientesHoy} pacientes hoy</span>
        </div>
      </div>

      {/* Barra de ocupación */}
      {ocupacion !== null && (
        <div className="flex items-center gap-2 shrink-0">
          <div className="w-16 h-1.5 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${ocupacion}%` }}
              transition={{ delay: 0.3 + index * 0.05 + 0.2, duration: 0.5 }}
              className={`h-full rounded-full bg-gradient-to-r ${nodo.colorBg}`}
            />
          </div>
          <span className="text-[11px] font-medium text-zinc-500 w-7 text-right">{ocupacion}%</span>
        </div>
      )}

      <ChevronRight className="h-3.5 w-3.5 text-zinc-300 group-hover:text-zinc-500 transition-colors shrink-0" />
    </motion.button>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// DIRECTROR VIEW CONTENT
// ─────────────────────────────────────────────────────────────────────────────

const DirectorViewContent: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useDemo();
  const kpi = KPI_DIRECTOR;

  React.useEffect(() => {
    if (!isAuthenticated) navigate('/academico');
  }, [isAuthenticated, navigate]);

  const formatMoney = (n: number) =>
    new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN', maximumFractionDigits: 0 }).format(n);

  return (
    <div className="p-4 sm:p-6">
      {/* Saludo */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-white tracking-tight">
          Buenos días, Director 👋
        </h1>
        <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
          {new Date().toLocaleDateString('es-MX', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
        </p>
      </motion.div>

      {/* KPIs principales */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        <KpiCard title="Alumnos activos" value={kpi.alumnosActivos} icon={Users} color="#2563EB" delay={0.05} trend="+4 este mes" />
        <KpiCard title="Pacientes este mes" value={kpi.pacientesAtendidosMes.toLocaleString('es-MX')} icon={Activity} color="#059669" delay={0.1} trend="+12%" />
        <KpiCard title="Ingresos del mes" value={formatMoney(kpi.ingresosDelMes)} icon={DollarSign} color="#7C3AED" delay={0.15} trend="+8%" sub="Todas las clínicas" />
        <KpiCard
          title="Alertas activas"
          value={kpi.alertasCriticas}
          icon={AlertTriangle}
          color="#D97706"
          delay={0.2}
          sub="Ver detalles →"
        />
      </div>

      {/* Segunda fila de KPI */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6">
        <KpiCard title="Historias generadas hoy" value={kpi.historiasGeneradasHoy} icon={FileText} color="#DB2777" delay={0.25} />
        <KpiCard
          title="Sillones en uso"
          value={`${kpi.sillonesOcupados}/${kpi.sillonesTotal}`}
          icon={Building2}
          color="#0891B2"
          delay={0.3}
          sub={`${Math.round(kpi.sillonesOcupados / kpi.sillonesTotal * 100)}% ocupación`}
        />
        <KpiCard
          title="Procedimientos vs meta"
          value={`${((kpi.procedimientosMes / kpi.metaProcedimientosMes) * 100).toFixed(0)}%`}
          icon={TrendingUp}
          color="#16A34A"
          delay={0.35}
          sub={`${kpi.procedimientosMes.toLocaleString()} de ${kpi.metaProcedimientosMes.toLocaleString()} meta mensual`}
        />
      </div>

      {/* Layout 2 columnas */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

        {/* Estado de nodos — ocupa 2 columnas */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="lg:col-span-2 bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200/80 dark:border-zinc-800/80 overflow-hidden"
        >
          <div className="flex items-center justify-between px-5 py-4 border-b border-zinc-100 dark:border-zinc-800">
            <div>
              <h2 className="text-sm font-bold text-zinc-900 dark:text-white">Estado de Nodos</h2>
              <p className="text-xs text-zinc-400 mt-0.5">Red clínica UAO en tiempo real</p>
            </div>
            <button
              onClick={() => navigate('/academico/nodos')}
              className="flex items-center gap-1 text-xs font-medium text-blue-600 dark:text-blue-400 hover:underline"
            >
              Ver todos <ChevronRight className="h-3.5 w-3.5" />
            </button>
          </div>
          <div className="px-3 py-2">
            {NODOS.map((nodo, i) => (
              <NodoMiniRow key={nodo.id} nodo={nodo} index={i} />
            ))}
          </div>
        </motion.div>

        {/* Alertas */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45 }}
          className="bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200/80 dark:border-zinc-800/80 overflow-hidden"
        >
          <div className="px-5 py-4 border-b border-zinc-100 dark:border-zinc-800">
            <h2 className="text-sm font-bold text-zinc-900 dark:text-white">Alertas del Sistema</h2>
            <p className="text-xs text-zinc-400 mt-0.5">{ALERTAS_DEMO.length} activas ahora</p>
          </div>
          <div className="p-3 space-y-2">
            {ALERTAS_DEMO.map((alerta, i) => (
              <motion.div
                key={alerta.id}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.45 + i * 0.06 }}
                className={`p-3 rounded-2xl border ${
                  alerta.urgencia === 'alta'
                    ? 'bg-red-50 dark:bg-red-950/20 border-red-200/60 dark:border-red-800/40'
                    : alerta.urgencia === 'media'
                    ? 'bg-amber-50 dark:bg-amber-950/20 border-amber-200/60 dark:border-amber-800/40'
                    : 'bg-blue-50 dark:bg-blue-950/20 border-blue-200/60 dark:border-blue-800/40'
                }`}
              >
                <div className="flex items-start gap-2">
                  <AlertTriangle className={`h-3.5 w-3.5 shrink-0 mt-px ${
                    alerta.urgencia === 'alta' ? 'text-red-500' :
                    alerta.urgencia === 'media' ? 'text-amber-500' : 'text-blue-500'
                  }`} />
                  <div>
                    <p className={`text-xs font-medium leading-snug ${
                      alerta.urgencia === 'alta' ? 'text-red-700 dark:text-red-400' :
                      alerta.urgencia === 'media' ? 'text-amber-700 dark:text-amber-400' : 'text-blue-700 dark:text-blue-400'
                    }`}>{alerta.mensaje}</p>
                    <p className="text-[10px] text-zinc-400 mt-1">🏥 {alerta.nodo}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Actividad reciente simple */}
          <div className="px-5 pb-4 pt-2 border-t border-zinc-100 dark:border-zinc-800">
            <p className="text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-2">Actividad reciente</p>
            {[
              { texto: 'Historia clínica generada — CLIMUZAC I', tiempo: 'hace 3 min', ok: true },
              { texto: 'Nuevo paciente registrado — CLIZAC', tiempo: 'hace 8 min', ok: true },
              { texto: 'Alerta stock mínimo — CLIBOR', tiempo: 'hace 15 min', ok: false },
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-2 py-1.5">
                {item.ok
                  ? <CheckCircle className="h-3.5 w-3.5 text-emerald-500 shrink-0 mt-px" />
                  : <AlertTriangle className="h-3.5 w-3.5 text-amber-500 shrink-0 mt-px" />}
                <div>
                  <p className="text-[11px] text-zinc-600 dark:text-zinc-400 leading-snug">{item.texto}</p>
                  <p className="text-[10px] text-zinc-400">{item.tiempo}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

const DirectorView: React.FC = () => (
  <UAOLayout>
    <DirectorViewContent />
  </UAOLayout>
);

export default DirectorView;
