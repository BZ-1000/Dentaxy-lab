import React, { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { cn } from '@/lib/utils';
import { Users, Link2, Activity, Shield } from 'lucide-react';
import { motion } from 'framer-motion';

interface MetricCardProps {
  title: string;
  value: number | string;
  subtitle?: string;
  icon: React.ReactNode;
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: string;
  isLive?: boolean;
  variant?: 'default' | 'success' | 'warning' | 'danger';
}

const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  subtitle,
  icon,
  isLive,
  variant = 'default',
}) => {
  const variantStyles = {
    default: 'border-zinc-800/50 bg-zinc-900/50',
    success: 'border-emerald-500/20 bg-emerald-500/5',
    warning: 'border-amber-500/20 bg-amber-500/5',
    danger: 'border-red-500/20 bg-red-500/5',
  };

  const iconStyles = {
    default: 'bg-zinc-800/50 text-zinc-400',
    success: 'bg-emerald-500/10 text-emerald-500',
    warning: 'bg-amber-500/10 text-amber-500',
    danger: 'bg-red-500/10 text-red-500',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        'relative rounded-xl border p-5 transition-all',
        variantStyles[variant]
      )}
    >
      {isLive && (
        <span className="absolute right-3 top-3 flex h-2 w-2">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-cyan-400 opacity-75" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-cyan-500" />
        </span>
      )}

      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-zinc-500">{title}</p>
          <p className="mt-2 text-3xl font-bold text-zinc-100">{value}</p>
          {subtitle && <p className="mt-1 text-xs text-zinc-500">{subtitle}</p>}
        </div>
        <div className={cn('flex h-10 w-10 items-center justify-center rounded-lg', iconStyles[variant])}>
          {icon}
        </div>
      </div>
    </motion.div>
  );
};

export const RealtimeMetrics: React.FC = () => {
  const [metrics, setMetrics] = useState({
    activeUsers: 0,
    activeDemos: 0,
    securityEvents: 0,
    systemHealth: 'OK',
  });

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        // Active users from platform_metrics
        const { data: usersData } = await supabase
          .from('platform_metrics')
          .select('metric_value')
          .eq('metric_name', 'active_users')
          .single();

        // Active demos count
        const { count: demosCount } = await supabase
          .from('demo_links')
          .select('*', { count: 'exact', head: true })
          .eq('is_revoked', false)
          .gt('expires_at', new Date().toISOString());

        // Recent security events (last 24h)
        const { count: securityCount } = await supabase
          .from('audit_logs')
          .select('*', { count: 'exact', head: true })
          .gte('created_at', new Date(Date.now() - 86400000).toISOString())
          .in('action', ['KILL_SWITCH_ACTIVATED', 'LOGIN_FAILED', 'UNAUTHORIZED_ACCESS']);

        // System state
        const { data: systemData } = await supabase
          .from('system_state')
          .select('value')
          .eq('key', 'lockdown_mode')
          .single();

        setMetrics({
          activeUsers: usersData?.metric_value || 0,
          activeDemos: demosCount || 0,
          securityEvents: securityCount || 0,
          systemHealth: systemData?.value?.active ? 'LOCKDOWN' : 'OK',
        });
      } catch (error) {
        console.error('Error fetching metrics:', error);
      }
    };

    fetchMetrics();

    // Real-time subscription for demo_links
    const demosChannel = supabase
      .channel('demos-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'demo_links' }, fetchMetrics)
      .subscribe();

    // Refresh every 30 seconds
    const interval = setInterval(fetchMetrics, 30000);

    return () => {
      supabase.removeChannel(demosChannel);
      clearInterval(interval);
    };
  }, []);

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <MetricCard
        title="Usuarios Activos"
        value={metrics.activeUsers}
        subtitle="En la plataforma ahora"
        icon={<Users className="h-5 w-5" />}
        isLive
        variant="success"
      />
      <MetricCard
        title="Demos Activos"
        value={metrics.activeDemos}
        subtitle="Links sin expirar"
        icon={<Link2 className="h-5 w-5" />}
        isLive
        variant="default"
      />
      <MetricCard
        title="Eventos de Seguridad"
        value={metrics.securityEvents}
        subtitle="Últimas 24 horas"
        icon={<Activity className="h-5 w-5" />}
        variant={metrics.securityEvents > 0 ? 'warning' : 'default'}
      />
      <MetricCard
        title="Estado del Sistema"
        value={metrics.systemHealth}
        subtitle="Verificado"
        icon={<Shield className="h-5 w-5" />}
        variant={metrics.systemHealth === 'LOCKDOWN' ? 'danger' : 'success'}
      />
    </div>
  );
};
