import React, { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { cn } from '@/lib/utils';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Brain,
  GraduationCap,
  Building2,
  Box,
  Shield,
  Lock,
  AlertTriangle,
  Loader2,
  Hand,
  Eye,
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
  Hand: <Hand className="h-6 w-6" />,
};

const statusConfig: Record<string, { label: string; color: string }> = {
  active: { label: 'Activo', color: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' },
  beta: { label: 'Beta', color: 'bg-amber-500/10 text-amber-500 border-amber-500/20' },
  blocked: { label: 'Bloqueado', color: 'bg-red-500/10 text-red-500 border-red-500/20' },
  classified: { label: 'Clasificado', color: 'bg-purple-500/10 text-purple-500 border-purple-500/20' },
};

const classificationConfig: Record<string, { icon: React.ReactNode; color: string }> = {
  public: { icon: <Eye className="h-3 w-3" />, color: 'text-zinc-500' },
  internal: { icon: <Lock className="h-3 w-3" />, color: 'text-amber-500' },
  classified: { icon: <AlertTriangle className="h-3 w-3" />, color: 'text-purple-500' },
};

export const ModuleCard: React.FC<ModuleCardProps> = ({ module, onUpdate }) => {
  const { isSuperAdmin, requestReauth } = useAdminSecurity();
  const [isUpdating, setIsUpdating] = useState(false);

  const handleToggle = async (enabled: boolean) => {
    // Classified modules require reauth
    if (module.classification_level === 'classified' && !isSuperAdmin) {
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

      toast.success(`Módulo ${enabled ? 'habilitado' : 'deshabilitado'}`, {
        description: `${module.display_name} ahora está ${enabled ? 'visible' : 'oculto'} para usuarios.`,
      });
      onUpdate();
    } catch (error) {
      console.error('Error updating module:', error);
      toast.error('Error al actualizar el módulo');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleStatusChange = async (newStatus: string) => {
    // Classified modules require reauth
    if (module.classification_level === 'classified' && !isSuperAdmin) {
      requestReauth();
      return;
    }

    setIsUpdating(true);
    try {
      const { error } = await supabase
        .from('dentaxy_modules')
        .update({ status: newStatus, updated_at: new Date().toISOString() })
        .eq('id', module.id);

      if (error) throw error;

      toast.success('Estado actualizado', {
        description: `${module.display_name} → ${statusConfig[newStatus]?.label || newStatus}`,
      });
      onUpdate();
    } catch (error) {
      console.error('Error updating status:', error);
      toast.error('Error al cambiar el estado');
    } finally {
      setIsUpdating(false);
    }
  };

  const statusInfo = statusConfig[module.status] || statusConfig.active;
  const classificationInfo = classificationConfig[module.classification_level] || classificationConfig.public;
  const isClassified = module.classification_level === 'classified';

  // Determine what users see
  const getPublicPreview = () => {
    if (module.status === 'classified') return '🔐 Clasificado';
    if (module.status === 'blocked') return '🚫 Bloqueado';
    if (!module.is_enabled) return '⏸️ Deshabilitado';
    if (module.status === 'beta') return '⚠️ Beta';
    if (module.status === 'active' && module.is_enabled) return '✅ Acceder';
    return '🕐 Próximamente';
  };

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
          : 'border-zinc-800/50 bg-zinc-950/50 opacity-75'
      )}
    >
      {/* Classification Badge */}
      <div className={cn('absolute right-3 top-3 flex items-center gap-1', classificationInfo.color)}>
        {classificationInfo.icon}
        <span className="text-[10px] uppercase tracking-wider">
          {module.classification_level}
        </span>
      </div>

      <div className="flex items-start gap-4">
        {/* Icon */}
        <div
          className={cn(
            'flex h-12 w-12 items-center justify-center rounded-xl shrink-0',
            module.is_enabled ? 'bg-blue-500/10 text-blue-500' : 'bg-zinc-800/50 text-zinc-500'
          )}
        >
          {iconMap[module.icon || ''] || <Box className="h-6 w-6" />}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="font-semibold text-zinc-100 truncate">{module.display_name}</h3>
          </div>
          <p className="mt-1 text-sm text-zinc-500 line-clamp-2">
            {module.description || 'Sin descripción'}
          </p>

          {/* Controls row */}
          <div className="mt-4 flex items-center gap-4 flex-wrap">
            {/* Status selector */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-zinc-500">Estado:</span>
              <Select
                value={module.status}
                onValueChange={handleStatusChange}
                disabled={isUpdating || (isClassified && !isSuperAdmin)}
              >
                <SelectTrigger className="h-8 w-[130px] bg-zinc-800/50 border-zinc-700 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">
                    <span className="flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full bg-emerald-500" />
                      Activo
                    </span>
                  </SelectItem>
                  <SelectItem value="beta">
                    <span className="flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full bg-amber-500" />
                      Beta
                    </span>
                  </SelectItem>
                  <SelectItem value="blocked">
                    <span className="flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full bg-red-500" />
                      Bloqueado
                    </span>
                  </SelectItem>
                  <SelectItem value="classified">
                    <span className="flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full bg-purple-500" />
                      Clasificado
                    </span>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Enable toggle */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-zinc-500">Habilitado:</span>
              {isUpdating && <Loader2 className="h-3 w-3 animate-spin text-zinc-400" />}
              <Switch
                checked={module.is_enabled}
                onCheckedChange={handleToggle}
                disabled={isUpdating || (isClassified && !isSuperAdmin)}
              />
            </div>
          </div>

          {/* Public preview */}
          <div className="mt-3 pt-3 border-t border-zinc-800/50">
            <div className="flex items-center gap-2">
              <Eye className="h-3 w-3 text-zinc-600" />
              <span className="text-[11px] text-zinc-600">Vista pública:</span>
              <Badge 
                variant="outline" 
                className={cn('text-[10px] border', statusInfo.color)}
              >
                {getPublicPreview()}
              </Badge>
            </div>
          </div>
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
