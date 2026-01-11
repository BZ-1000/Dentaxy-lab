import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';
import {
  RefreshCw,
  Clock,
  MapPin,
  User,
  XCircle,
  Ban,
  AlertTriangle,
  Loader2,
  Activity,
} from 'lucide-react';
import { useAdminAuthContext } from '@/contexts/AdminAuthContext';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';

interface DemoSession {
  id: string;
  full_name: string;
  location: {
    lat?: number;
    lng?: number;
    city?: string;
    country?: string;
  };
  module_accessed: string;
  started_at: string;
  expires_at: string;
  status: string;
  demo_link_id: string;
  session_token: string;
}

const moduleLabels: Record<string, string> = {
  motor_neuronal: 'Motor Neuronal',
  proyecto_stark: 'Proyecto Stark',
  academico: 'Dentaxy Académico',
  enterprise: 'Enterprise',
  visualizacion_3d: 'Visualización 3D',
};

export const ActiveDemoSessions: React.FC = () => {
  const { adminId } = useAdminAuthContext();
  const [sessions, setSessions] = useState<DemoSession[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const fetchSessions = async () => {
    try {
      const { data, error } = await supabase
        .from('demo_sessions')
        .select('*')
        .order('started_at', { ascending: false });

      if (error) throw error;

      setSessions(
        (data || []).map((s) => ({
          ...s,
          location: typeof s.location === 'object' ? s.location : {},
        })) as DemoSession[]
      );
    } catch (error) {
      console.error('Error fetching sessions:', error);
      toast.error('Error al cargar sesiones');
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchSessions();
  }, []);

  const handleRefresh = () => {
    setIsRefreshing(true);
    fetchSessions();
  };

  const handleExpireSession = async (sessionId: string) => {
    if (!adminId) return;
    setActionLoading(sessionId);

    try {
      const { error } = await supabase.rpc('expire_demo_session', {
        p_session_id: sessionId,
        p_admin_id: adminId,
      });

      if (error) throw error;

      toast.success('Sesión expirada');
      fetchSessions();
    } catch (error) {
      console.error('Error expiring session:', error);
      toast.error('Error al expirar la sesión');
    } finally {
      setActionLoading(null);
    }
  };

  const handleRevokeSession = async (sessionId: string) => {
    if (!adminId) return;
    setActionLoading(sessionId);

    try {
      const { error } = await supabase.rpc('revoke_demo_session', {
        p_session_id: sessionId,
        p_admin_id: adminId,
      });

      if (error) throw error;

      toast.success('Sesión revocada');
      fetchSessions();
    } catch (error) {
      console.error('Error revoking session:', error);
      toast.error('Error al revocar la sesión');
    } finally {
      setActionLoading(null);
    }
  };

  const handleRevokeLink = async (linkId: string) => {
    if (!adminId) return;
    setActionLoading(linkId);

    try {
      const { data, error } = await supabase.rpc('revoke_all_sessions_for_link', {
        p_link_id: linkId,
        p_admin_id: adminId,
      });

      if (error) throw error;

      toast.success(`Link revocado`, {
        description: `${data} sesiones fueron terminadas.`,
      });
      fetchSessions();
    } catch (error) {
      console.error('Error revoking link:', error);
      toast.error('Error al revocar el link');
    } finally {
      setActionLoading(null);
    }
  };

  const getStatusBadge = (status: string, expiresAt: string) => {
    const isExpired = new Date(expiresAt) < new Date();
    if (isExpired && status === 'active') {
      return <Badge variant="outline" className="bg-zinc-500/10 text-zinc-400 border-zinc-500/20">Expirada</Badge>;
    }

    const configs: Record<string, { color: string; label: string }> = {
      active: { color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20', label: 'Activa' },
      expired: { color: 'bg-zinc-500/10 text-zinc-400 border-zinc-500/20', label: 'Expirada' },
      revoked: { color: 'bg-red-500/10 text-red-400 border-red-500/20', label: 'Revocada' },
      completed: { color: 'bg-blue-500/10 text-blue-400 border-blue-500/20', label: 'Completada' },
    };

    const config = configs[status] || configs.expired;
    return <Badge variant="outline" className={config.color}>{config.label}</Badge>;
  };

  const activeSessions = sessions.filter(
    (s) => s.status === 'active' && new Date(s.expires_at) > new Date()
  );

  return (
    <div className="rounded-xl border border-zinc-800/50 bg-zinc-900/50 p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-cyan-500/10">
            <Activity className="h-5 w-5 text-cyan-500" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-zinc-100">Sesiones de Demo</h3>
            <p className="text-sm text-zinc-500">
              {activeSessions.length} activa{activeSessions.length !== 1 ? 's' : ''} de {sessions.length} total
            </p>
          </div>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={handleRefresh}
          disabled={isRefreshing}
          className="border-zinc-700 bg-zinc-800/50 hover:bg-zinc-800"
        >
          <RefreshCw className={cn('h-4 w-4 mr-2', isRefreshing && 'animate-spin')} />
          Actualizar
        </Button>
      </div>

      {/* Sessions list */}
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-6 w-6 animate-spin text-zinc-500" />
        </div>
      ) : sessions.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <Activity className="h-12 w-12 text-zinc-700 mb-4" />
          <p className="text-zinc-500">No hay sesiones registradas</p>
          <p className="text-sm text-zinc-600">Las sesiones aparecerán aquí cuando los usuarios accedan a demos.</p>
        </div>
      ) : (
        <div className="space-y-3">
          <AnimatePresence>
            {sessions.map((session) => {
              const isActive = session.status === 'active' && new Date(session.expires_at) > new Date();
              const timeToExpire = new Date(session.expires_at).getTime() - Date.now();
              const isExpiringSoon = isActive && timeToExpire < 300000; // < 5 min

              return (
                <motion.div
                  key={session.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className={cn(
                    'rounded-lg border p-4 transition-all',
                    isActive
                      ? isExpiringSoon
                        ? 'border-amber-500/30 bg-amber-500/5'
                        : 'border-emerald-500/30 bg-emerald-500/5'
                      : 'border-zinc-800/50 bg-zinc-950/50 opacity-60'
                  )}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      {/* User info */}
                      <div className="flex items-center gap-2 mb-2">
                        <User className="h-4 w-4 text-zinc-500" />
                        <span className="font-medium text-zinc-100 truncate">{session.full_name}</span>
                        {getStatusBadge(session.status, session.expires_at)}
                        {isExpiringSoon && (
                          <Badge variant="outline" className="bg-amber-500/10 text-amber-400 border-amber-500/20 animate-pulse">
                            <AlertTriangle className="h-3 w-3 mr-1" />
                            Expira pronto
                          </Badge>
                        )}
                      </div>

                      {/* Details */}
                      <div className="flex flex-wrap items-center gap-4 text-sm text-zinc-500">
                        <div className="flex items-center gap-1">
                          <MapPin className="h-3.5 w-3.5" />
                          <span>
                            {session.location?.city
                              ? `${session.location.city}${session.location.country ? `, ${session.location.country}` : ''}`
                              : 'Ubicación desconocida'}
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-3.5 w-3.5" />
                          <span>
                            Inició {formatDistanceToNow(new Date(session.started_at), { addSuffix: true, locale: es })}
                          </span>
                        </div>
                        <Badge variant="secondary" className="text-xs">
                          {moduleLabels[session.module_accessed] || session.module_accessed}
                        </Badge>
                      </div>
                    </div>

                    {/* Actions */}
                    {isActive && (
                      <div className="flex items-center gap-2 shrink-0">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleExpireSession(session.id)}
                          disabled={actionLoading === session.id}
                          className="border-zinc-700 bg-zinc-800/50 hover:bg-zinc-800 text-xs"
                        >
                          {actionLoading === session.id ? (
                            <Loader2 className="h-3 w-3 animate-spin" />
                          ) : (
                            <>
                              <Clock className="h-3 w-3 mr-1" />
                              Expirar
                            </>
                          )}
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleRevokeSession(session.id)}
                          disabled={actionLoading === session.id}
                          className="border-red-500/30 bg-red-500/10 hover:bg-red-500/20 text-red-400 text-xs"
                        >
                          <XCircle className="h-3 w-3 mr-1" />
                          Revocar
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleRevokeLink(session.demo_link_id)}
                          disabled={actionLoading === session.demo_link_id}
                          className="border-red-500/50 bg-red-500/20 hover:bg-red-500/30 text-red-300 text-xs"
                        >
                          <Ban className="h-3 w-3 mr-1" />
                          Bloquear Link
                        </Button>
                      </div>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
};
