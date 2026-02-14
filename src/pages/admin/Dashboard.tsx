import React from 'react';
import {
  Activity,
  Users,
  Globe,
  Zap,
  Server,
  ShieldCheck,
  ShieldAlert,
  Database,
  ShoppingCart,
  Loader2
} from 'lucide-react';
import { DashboardLayout } from '@/components/admin/layout/DashboardLayout';
import { NeonStatCard } from '@/components/admin/layout/NeonStatCard';
import { GlobeVisualizer } from '@/components/admin/layout/GlobeVisualizer';
import { NetworkActivityGraph } from '@/components/admin/layout/NetworkActivityGraph';
import { SecurityMatrix } from '@/components/admin/layout/SecurityMatrix';
import { useLiveMetrics, useSubsystemStatus, useRecentAuditLogs } from '@/hooks/useDashboardMetrics';
import { motion } from 'framer-motion';
import { format } from 'date-fns';

const AdminDashboard: React.FC = () => {
  // DATOS REALES de Supabase - sin simulaciones
  const { data: metrics, isLoading: metricsLoading } = useLiveMetrics();
  const { data: subsystemStatus, isLoading: subsystemsLoading } = useSubsystemStatus();
  const { data: recentLogs, isLoading: logsLoading } = useRecentAuditLogs(5);

  // Loading state
  if (metricsLoading || subsystemsLoading) {
    return (
      <DashboardLayout>
        <div className="flex h-full items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="h-10 w-10 animate-spin text-cyan-400" />
            <p className="font-mono text-sm text-cyan-400 animate-pulse">
              CARGANDO DATOS REALES...
            </p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (!metrics) {
    return (
      <DashboardLayout>
        <div className="flex h-full items-center justify-center">
          <p className="font-mono text-sm text-zinc-400">
            No hay datos disponibles
          </p>
        </div>
      </DashboardLayout>
    );
  }

  const {
    globalReach,
    activeNodes,
    operationsPerMinute,
    threatLevel,
    systemStatus
  } = metrics;

  return (
    <DashboardLayout>
      <div className="space-y-8 pb-12">

        {/* TOP METRICS ROW - DATOS REALES */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          <NeonStatCard
            title="Global Reach"
            value={globalReach.toLocaleString()}
            subValue="USUARIOS TOTALES"
            icon={Globe}
            color="cyan"
            delay={0.1}
            trend="up"
          />
          <NeonStatCard
            title="Active Nodes"
            value={activeNodes.toLocaleString()}
            subValue="SESIONES ACTIVAS"
            icon={Activity}
            color="emerald"
            delay={0.2}
            trend="up"
          />
          <NeonStatCard
            title="Ops / Minute"
            value={`${(operationsPerMinute / 1000).toFixed(1)}k`}
            subValue="OPERACIONES/MIN"
            icon={Zap}
            color="purple"
            delay={0.3}
            trend={operationsPerMinute > 4000 ? 'up' : 'neutral'}
          />
          <NeonStatCard
            title="Threat Level"
            value={threatLevel.toUpperCase()}
            subValue="ESTADO SEGURIDAD"
            icon={threatLevel === 'low' ? ShieldCheck : ShieldAlert}
            color={threatLevel === 'low' ? 'emerald' : 'rose'}
            delay={0.4}
            trend="neutral"
          />
        </div>

        {/* MAIN VISUALIZATION GRID */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* LEFT: GLOBE + SUBSYSTEMS (Takes up 2 cols) */}
          <div className="lg:col-span-2 space-y-6">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <GlobeVisualizer activeNodes={activeNodes} />
            </motion.div>

            {/* SUBSYSTEMS STATUS - DATOS REALES */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              {['shop', 'seed', 'studio'].map((moduleKey, i) => {
                const status = subsystemStatus?.[moduleKey as keyof typeof subsystemStatus];
                const isHealthy = status?.isHealthy;
                const displayName = status?.displayName || moduleKey;
                const Icon = moduleKey === 'shop' ? ShoppingCart : moduleKey === 'seed' ? Database : Activity;
                const color = moduleKey === 'shop' ? 'text-emerald-400' : moduleKey === 'seed' ? 'text-blue-400' : 'text-purple-400';
                const bg = moduleKey === 'shop' ? 'bg-emerald-500/10' : moduleKey === 'seed' ? 'bg-blue-500/10' : 'bg-purple-500/10';

                return (
                  <motion.div
                    key={moduleKey}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 + (i * 0.1) }}
                    className="group relative overflow-hidden rounded-xl border border-white/10 bg-white/5 p-4 hover:bg-white/10 transition-colors"
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <div className={`p-1.5 rounded ${bg} ${color}`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <span className="font-mono text-sm font-bold text-white">{displayName}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono text-zinc-500 uppercase">Estado</span>
                      <span className={`text-xs font-mono font-bold ${isHealthy ? 'text-emerald-400' : 'text-rose-400'}`}>
                        {isHealthy ? 'ONLINE' : 'OFFLINE'}
                      </span>
                    </div>
                    {/* Mostrar métricas específicas si existen */}
                    {moduleKey === 'shop' && status && 'orders' in status && (
                      <div className="mt-3 pt-3 border-t border-white/5 flex items-center justify-between text-[10px]">
                        <span className="text-zinc-500">Órdenes:</span>
                        <span className="text-white font-bold">{status.orders}</span>
                      </div>
                    )}
                    {moduleKey === 'seed' && status && 'instances' in status && (
                      <div className="mt-3 pt-3 border-t border-white/5 flex items-center justify-between text-[10px]">
                        <span className="text-zinc-500">Instancias:</span>
                        <span className="text-white font-bold">{status.instances}</span>
                      </div>
                    )}
                    {moduleKey === 'studio' && status && 'components' in status && (
                      <div className="mt-3 pt-3 border-t border-white/5 flex items-center justify-between text-[10px]">
                        <span className="text-zinc-500">Componentes:</span>
                        <span className="text-white font-bold">{status.components}</span>
                      </div>
                    )}
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* RIGHT: REAL-TIME GRAPHS (Takes up 1 col) */}
          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <div className="mb-4 flex items-center justify-between">
                <h3 className="font-mono text-xs font-bold text-zinc-400 uppercase tracking-widest">
                  Tráfico de Red
                </h3>
              </div>
              <NetworkActivityGraph opsPerMinute={operationsPerMinute} />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <div className="mb-4 flex items-center justify-between">
                <h3 className="font-mono text-xs font-bold text-zinc-400 uppercase tracking-widest">
                  Capa de Seguridad
                </h3>
              </div>
              <SecurityMatrix threatLevel={threatLevel} />
            </motion.div>

            {/* AUDIT LOGS - DATOS REALES */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="rounded-xl border border-white/10 bg-black/20 p-4"
            >
              <div className="mb-3 flex items-center gap-2">
                <Server className="w-4 h-4 text-zinc-500" />
                <h3 className="font-mono text-xs font-bold text-zinc-400 uppercase">Logs del Sistema</h3>
              </div>
              <div className="space-y-2">
                {logsLoading ? (
                  <div className="flex items-center justify-center py-4">
                    <Loader2 className="w-4 h-4 animate-spin text-zinc-500" />
                  </div>
                ) : recentLogs && recentLogs.length > 0 ? (
                  recentLogs.map((log) => (
                    <div key={log.id} className="flex items-start gap-2 text-[10px] font-mono text-zinc-500 border-b border-white/5 pb-2 last:border-0 last:pb-0">
                      <span className="text-emerald-500/50 shrink-0">
                        {format(new Date(log.created_at), 'HH:mm:ss')}
                      </span>
                      <span className="truncate">
                        {log.action.replace(/_/g, ' ').toUpperCase()}
                      </span>
                    </div>
                  ))
                ) : (
                  <div className="text-center text-[10px] font-mono text-zinc-600 py-4">
                    No hay logs recientes
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        </div>

      </div>
    </DashboardLayout>
  );
};

export default AdminDashboard;
