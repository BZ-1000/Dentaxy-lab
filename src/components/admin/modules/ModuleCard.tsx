import React, { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { cn } from '@/lib/utils';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import {
  Brain,
  GraduationCap,
  Building2,
  Box,
  Shield,
  Lock,
  AlertTriangle,
  Loader2,
} from 'lucide-react';
import { toast } from 'sonner';
import { useAdminSecurity } from '@/contexts/AdminSecurityContext';
import { motion } from 'framer-motion';

interface Module {
  id: string;
  name: string;
  display_name: string;
  description: string | null;
  status: string;
  is_enabled: boolean;
  classification_level: string;
  icon: string | null;
}

interface ModuleCardProps {
  module: Module;
  onUpdate: () => void;
}

const iconMap: Record<string, React.ReactNode> = {
  Brain: <Brain className="h-6 w-6" />,
  GraduationCap: <GraduationCap className="h-6 w-6" />,
  Building2: <Building2 className="h-6 w-6" />,
  Box: <Box className="h-6 w-6" />,
  Shield: <Shield className="h-6 w-6" />,
};

const statusConfig: Record<string, { label: string; color: string }> = {
  active: { label: 'Activo', color: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' },
  beta: { label: 'Beta', color: 'bg-amber-500/10 text-amber-500 border-amber-500/20' },
  blocked: { label: 'Bloqueado', color: 'bg-red-500/10 text-red-500 border-red-500/20' },
  classified: { label: 'Clasificado', color: 'bg-purple-500/10 text-purple-500 border-purple-500/20' },
};

const classificationConfig: Record<string, { icon: React.ReactNode; color: string }> = {
  public: { icon: null, color: '' },
  internal: { icon: <Lock className="h-3 w-3" />, color: 'text-amber-500' },
  classified: { icon: <AlertTriangle className="h-3 w-3" />, color: 'text-purple-500' },
};

export const ModuleCard: React.FC<ModuleCardProps> = ({ module, onUpdate }) => {
  const { isSuperAdmin, requestReauth } = useAdminSecurity();
  const [isUpdating, setIsUpdating] = useState(false);

  const handleToggle = async (enabled: boolean) => {
    // Classified modules require reauth
    if (module.classification_level === 'classified') {
      requestReauth();
      return;
    }

    setIsUpdating(true);
    try {
      const { error } = await supabase
        .from('dentaxy_modules')
        .update({ is_enabled: enabled, updated_at: new Date().toISOString() })
        .eq('id', module.id);

      if (error) throw error;

      toast.success(`Módulo ${enabled ? 'activado' : 'desactivado'}`, {
        description: module.display_name,
      });
      onUpdate();
    } catch (error) {
      console.error('Error updating module:', error);
      toast.error('Error al actualizar el módulo');
    } finally {
      setIsUpdating(false);
    }
  };

  const statusInfo = statusConfig[module.status] || statusConfig.active;
  const classificationInfo = classificationConfig[module.classification_level];
  const isClassified = module.classification_level === 'classified';

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className={cn(
        'relative rounded-xl border p-5 transition-all',
        isClassified
          ? 'border-purple-500/30 bg-purple-500/5'
          : module.is_enabled
          ? 'border-zinc-700/50 bg-zinc-900/50'
          : 'border-zinc-800/50 bg-zinc-950/50 opacity-60'
      )}
    >
      {/* Classification Badge */}
      {classificationInfo.icon && (
        <div className={cn('absolute right-3 top-3', classificationInfo.color)}>
          {classificationInfo.icon}
        </div>
      )}

      <div className="flex items-start gap-4">
        {/* Icon */}
        <div
          className={cn(
            'flex h-12 w-12 items-center justify-center rounded-xl',
            module.is_enabled ? 'bg-blue-500/10 text-blue-500' : 'bg-zinc-800/50 text-zinc-500'
          )}
        >
          {iconMap[module.icon || ''] || <Box className="h-6 w-6" />}
        </div>

        {/* Content */}
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h3 className="font-semibold text-zinc-100">{module.display_name}</h3>
            <Badge variant="outline" className={cn('border', statusInfo.color)}>
              {statusInfo.label}
            </Badge>
          </div>
          <p className="mt-1 text-sm text-zinc-500 line-clamp-2">
            {module.description || 'Sin descripción'}
          </p>
        </div>

        {/* Toggle */}
        <div className="flex items-center gap-2">
          {isUpdating && <Loader2 className="h-4 w-4 animate-spin text-zinc-400" />}
          <Switch
            checked={module.is_enabled}
            onCheckedChange={handleToggle}
            disabled={isUpdating || (isClassified && !isSuperAdmin)}
          />
        </div>
      </div>

      {/* Classified overlay */}
      {isClassified && !isSuperAdmin && (
        <div className="absolute inset-0 flex items-center justify-center rounded-xl bg-zinc-950/80 backdrop-blur-sm">
          <div className="text-center">
            <Lock className="mx-auto h-8 w-8 text-purple-500" />
            <p className="mt-2 text-sm font-medium text-purple-400">Requiere Super Admin</p>
          </div>
        </div>
      )}
    </motion.div>
  );
};
