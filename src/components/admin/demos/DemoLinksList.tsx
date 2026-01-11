import React, { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAdminAuthContext } from '@/contexts/AdminAuthContext';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import {
  Link2,
  Clock,
  Users,
  Trash2,
  Copy,
  Check,
  Loader2,
} from 'lucide-react';
import { format, formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';

interface DemoLink {
  id: string;
  token: string;
  expires_at: string;
  max_uses: number;
  current_uses: number;
  allowed_modules: string[] | null;
  is_revoked: boolean;
  created_at: string;
}

const MODULE_LABELS: Record<string, string> = {
  motor_neuronal: 'Motor Neuronal',
  proyecto_stark: 'Proyecto Stark',
  academico: 'Académico',
  enterprise: 'Enterprise',
  visualizacion_3d: '3D',
};

export const DemoLinksList: React.FC<{ refreshTrigger: number }> = ({ refreshTrigger }) => {
  const { adminId } = useAdminAuthContext();
  const [demos, setDemos] = useState<DemoLink[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [revokingId, setRevokingId] = useState<string | null>(null);

  useEffect(() => {
    const fetchDemos = async () => {
      try {
        const { data, error } = await supabase
          .from('demo_links')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) throw error;
        setDemos((data as DemoLink[]) || []);
      } catch (error) {
        console.error('Error fetching demos:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDemos();
  }, [refreshTrigger]);

  const handleCopy = async (token: string, id: string) => {
    const link = `${window.location.origin}/modules?demo=${token}`;
    await navigator.clipboard.writeText(link);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
    toast.success('Link copiado');
  };

  const handleRevoke = async (demo: DemoLink) => {
    if (!adminId) return;

    setRevokingId(demo.id);
    try {
      // Use the revoke function to also revoke sessions
      const { data, error } = await supabase.rpc('revoke_all_sessions_for_link', {
        p_link_id: demo.id,
        p_admin_id: adminId,
      });

      if (error) throw error;

      setDemos((prev) =>
        prev.map((d) => (d.id === demo.id ? { ...d, is_revoked: true } : d))
      );
      toast.success(`Demo revocado (${data || 0} sesiones terminadas)`);
    } catch (error) {
      console.error('Error revoking demo:', error);
      toast.error('Error al revocar el demo');
    } finally {
      setRevokingId(null);
    }
  };

  const getStatus = (demo: DemoLink) => {
    if (demo.is_revoked) return { label: 'Revocado', color: 'bg-red-500/10 text-red-500 border-red-500/20' };
    if (new Date(demo.expires_at) < new Date()) return { label: 'Expirado', color: 'bg-zinc-500/10 text-zinc-500 border-zinc-500/20' };
    if (demo.current_uses >= demo.max_uses) return { label: 'Agotado', color: 'bg-amber-500/10 text-amber-500 border-amber-500/20' };
    return { label: 'Activo', color: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' };
  };

  if (isLoading) {
    return (
      <div className="space-y-3">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="h-24 animate-pulse rounded-xl bg-zinc-800/30" />
        ))}
      </div>
    );
  }

  if (demos.length === 0) {
    return (
      <div className="flex h-40 flex-col items-center justify-center rounded-xl border border-dashed border-zinc-800 bg-zinc-900/30">
        <Link2 className="mb-2 h-8 w-8 text-zinc-600" />
        <p className="text-sm text-zinc-500">No hay demos creados</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <AnimatePresence>
        {demos.map((demo, index) => {
          const status = getStatus(demo);
          const isActive = status.label === 'Activo';

          return (
            <motion.div
              key={demo.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ delay: index * 0.05 }}
              className={cn(
                'rounded-xl border p-4 transition-all',
                isActive
                  ? 'border-zinc-800/50 bg-zinc-900/50'
                  : 'border-zinc-800/30 bg-zinc-950/50 opacity-60'
              )}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <code className="rounded bg-zinc-800 px-2 py-0.5 font-mono text-sm text-zinc-300">
                      {demo.token}
                    </code>
                    <Badge variant="outline" className={cn('border', status.color)}>
                      {status.label}
                    </Badge>
                  </div>

                  <div className="mt-2 flex flex-wrap items-center gap-4 text-xs text-zinc-500">
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      Expira {formatDistanceToNow(new Date(demo.expires_at), { locale: es, addSuffix: true })}
                    </span>
                    <span className="flex items-center gap-1">
                      <Users className="h-3 w-3" />
                      {demo.current_uses}/{demo.max_uses} usos
                    </span>
                    <span>
                      Creado {format(new Date(demo.created_at), 'd MMM, HH:mm', { locale: es })}
                    </span>
                  </div>

                  {demo.allowed_modules && demo.allowed_modules.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-1">
                      {demo.allowed_modules.map((module) => (
                        <span
                          key={module}
                          className="rounded bg-zinc-800/50 px-1.5 py-0.5 text-xs text-zinc-400"
                        >
                          {MODULE_LABELS[module] || module}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => handleCopy(demo.token, demo.id)}
                    className="h-8 w-8 text-zinc-400 hover:text-zinc-100"
                    disabled={!isActive}
                  >
                    {copiedId === demo.id ? (
                      <Check className="h-4 w-4 text-emerald-500" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => handleRevoke(demo)}
                    className="h-8 w-8 text-zinc-400 hover:text-red-500"
                    disabled={!isActive || revokingId === demo.id}
                  >
                    {revokingId === demo.id ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Trash2 className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
};
