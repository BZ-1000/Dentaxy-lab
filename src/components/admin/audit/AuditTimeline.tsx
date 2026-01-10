import React, { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import {
  LogIn,
  LogOut,
  Link2,
  AlertTriangle,
  Shield,
  User,
  Eye,
  Trash2,
  Settings,
} from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

interface AuditLog {
  id: string;
  action: string;
  resource_type: string;
  resource_id: string | null;
  user_id: string | null;
  details: Record<string, unknown> | null;
  created_at: string;
  ip_address: string | null;
}

const actionIcons: Record<string, React.ReactNode> = {
  LOGIN: <LogIn className="h-4 w-4" />,
  LOGOUT: <LogOut className="h-4 w-4" />,
  DEMO_CREATED: <Link2 className="h-4 w-4" />,
  DEMO_REVOKED: <Trash2 className="h-4 w-4" />,
  DEMO_ACCESSED: <Eye className="h-4 w-4" />,
  KILL_SWITCH_ACTIVATED: <AlertTriangle className="h-4 w-4" />,
  KILL_SWITCH_DEACTIVATED: <Shield className="h-4 w-4" />,
  MODULE_TOGGLED: <Settings className="h-4 w-4" />,
  USER_BLOCKED: <User className="h-4 w-4" />,
};

const actionColors: Record<string, string> = {
  LOGIN: 'text-emerald-500 bg-emerald-500/10',
  LOGOUT: 'text-zinc-400 bg-zinc-500/10',
  DEMO_CREATED: 'text-blue-500 bg-blue-500/10',
  DEMO_REVOKED: 'text-amber-500 bg-amber-500/10',
  DEMO_ACCESSED: 'text-cyan-500 bg-cyan-500/10',
  KILL_SWITCH_ACTIVATED: 'text-red-500 bg-red-500/10',
  KILL_SWITCH_DEACTIVATED: 'text-emerald-500 bg-emerald-500/10',
  MODULE_TOGGLED: 'text-purple-500 bg-purple-500/10',
  USER_BLOCKED: 'text-amber-500 bg-amber-500/10',
};

const getSeverityColor = (details: Record<string, unknown> | null) => {
  const severity = details?.severity as string;
  if (severity === 'critical') return 'border-l-red-500';
  if (severity === 'warning') return 'border-l-amber-500';
  if (severity === 'info') return 'border-l-blue-500';
  return 'border-l-zinc-700';
};

export const AuditTimeline: React.FC = () => {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const { data, error } = await supabase
          .from('audit_logs')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(50);

        if (error) throw error;
        setLogs((data as AuditLog[]) || []);
      } catch (error) {
        console.error('Error fetching audit logs:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLogs();

    // Real-time subscription
    const channel = supabase
      .channel('audit-logs-changes')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'audit_logs' }, (payload) => {
        setLogs((prev) => [payload.new as AuditLog, ...prev].slice(0, 50));
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="h-20 animate-pulse rounded-lg bg-zinc-800/30" />
        ))}
      </div>
    );
  }

  if (logs.length === 0) {
    return (
      <div className="flex h-40 items-center justify-center rounded-xl border border-zinc-800/50 bg-zinc-900/50">
        <p className="text-sm text-zinc-500">No hay eventos de auditoría registrados</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {logs.map((log, index) => (
        <motion.div
          key={log.id}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.05 }}
          className={cn(
            'rounded-lg border border-zinc-800/50 bg-zinc-900/50 p-4 border-l-2',
            getSeverityColor(log.details)
          )}
        >
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-3">
              <div
                className={cn(
                  'flex h-8 w-8 items-center justify-center rounded-lg',
                  actionColors[log.action] || 'text-zinc-400 bg-zinc-500/10'
                )}
              >
                {actionIcons[log.action] || <Eye className="h-4 w-4" />}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-medium text-zinc-200">{log.action.replace(/_/g, ' ')}</span>
                  <span className="rounded bg-zinc-800 px-1.5 py-0.5 text-xs text-zinc-400">
                    {log.resource_type}
                  </span>
                </div>
                {log.resource_id && (
                  <p className="mt-0.5 text-xs text-zinc-500">ID: {log.resource_id}</p>
                )}
                {log.details && Object.keys(log.details).length > 0 && (
                  <pre className="mt-2 max-w-md overflow-auto rounded bg-zinc-800/50 p-2 text-xs text-zinc-400">
                    {JSON.stringify(log.details, null, 2)}
                  </pre>
                )}
              </div>
            </div>
            <div className="text-right">
              <p className="text-xs text-zinc-500">
                {format(new Date(log.created_at), "d MMM, HH:mm:ss", { locale: es })}
              </p>
              {log.ip_address && (
                <p className="mt-0.5 font-mono text-xs text-zinc-600">{log.ip_address}</p>
              )}
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
};
