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
  motor_neuronal: 'DENTAXY AI',
  dicom: 'DICOM',
  academico: 'UNIVERSIDADES',
  enterprise: 'ENTERPRISE',
  proyecto_stark: 'STARK',
  seed_preventa: 'PREVENTA SEED',
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
    if (!adminId) {
      toast.error('No se pudo obtener ID de administrador');
      console.error('adminId is missing');
      return;
    }

    setRevokingId(demo.id);
    console.log('Attempting to revoke demo:', { demoId: demo.id, adminId });

    try {
      // Use the revoke function to also revoke sessions
      const { data, error } = await supabase.rpc('revoke_all_sessions_for_link', {
        p_link_id: demo.id,
        p_admin_id: adminId,
      });

      console.log('RPC response:', { data, error });

      if (error) {
        console.error('RPC error details:', error);
        throw error;
      }

      // Update local state to reflect the change
      setDemos((prev) =>
        prev.map((d) => (d.id === demo.id ? { ...d, is_revoked: true } : d))
      );

      toast.success(`Demo revocado exitosamente (${data || 0} sesiones terminadas)`);
    } catch (error: any) {
      console.error('Error revoking demo:', error);
      toast.error(`Error al revocar: ${error?.message || 'Error desconocido'}`);
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
      <div className="flex h-40 flex-col items-center justify-center rounded-xl border border-dashed border-gray-300 bg-gray-50/50">
        <Link2 className="mb-2 h-8 w-8 text-gray-400" />
        <p className="text-sm text-gray-500">No hay demos creados</p>
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
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ delay: index * 0.05 }}
              className={cn(
                'rounded-xl border p-4 transition-all duration-300 group hover:border-gray-300',
                isActive
                  ? 'border-gray-200 bg-white shadow-sm'
                  : 'border-gray-100 bg-gray-50 opacity-60 grayscale'
              )}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-2">
                    <code className="rounded-lg bg-gray-100 px-3 py-1 font-mono text-sm text-indigo-600 border border-gray-200 tracking-wider">
                      {demo.token}
                    </code>
                    <Badge variant="outline" className={cn('border bg-opacity-10 backdrop-blur-sm', status.color)}>
                      {status.label}
                    </Badge>
                  </div>

                  <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500">
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
                    <div className="mt-3 flex flex-wrap gap-1">
                      {demo.allowed_modules.map((module) => (
                        <span
                          key={module}
                          className="rounded-md bg-gray-100 px-2 py-0.5 text-[10px] text-gray-600 border border-gray-200 uppercase tracking-wide"
                        >
                          {MODULE_LABELS[module] || module}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-1 opacity-100 group-hover:opacity-100 transition-opacity">
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => handleCopy(demo.token, demo.id)}
                    className="h-8 w-8 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-lg"
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
                    className="h-8 w-8 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg"
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
