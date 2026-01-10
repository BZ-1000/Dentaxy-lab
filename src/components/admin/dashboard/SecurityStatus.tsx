import React from 'react';
import { useAdminSecurity } from '@/contexts/AdminSecurityContext';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import {
  Shield,
  ShieldCheck,
  ShieldAlert,
  Lock,
  Unlock,
  MessageSquare,
  Link2,
} from 'lucide-react';

interface StatusItemProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  status: 'active' | 'inactive' | 'warning';
}

const StatusItem: React.FC<StatusItemProps> = ({ icon, label, value, status }) => {
  const statusColors = {
    active: 'text-emerald-500',
    inactive: 'text-zinc-500',
    warning: 'text-amber-500',
  };

  const dotColors = {
    active: 'bg-emerald-500',
    inactive: 'bg-zinc-600',
    warning: 'bg-amber-500',
  };

  return (
    <div className="flex items-center justify-between py-3">
      <div className="flex items-center gap-3">
        <span className="text-zinc-400">{icon}</span>
        <span className="text-sm text-zinc-300">{label}</span>
      </div>
      <div className="flex items-center gap-2">
        <span className={cn('h-2 w-2 rounded-full', dotColors[status])} />
        <span className={cn('text-sm font-medium', statusColors[status])}>{value}</span>
      </div>
    </div>
  );
};

export const SecurityStatus: React.FC = () => {
  const { systemState, isSuperAdmin } = useAdminSecurity();

  const getSecurityLevel = () => {
    if (systemState.lockdown_mode) return { level: 'critical', icon: ShieldAlert, color: 'text-red-500' };
    if (systemState.security_level === 'critical') return { level: 'critical', icon: ShieldAlert, color: 'text-red-500' };
    if (systemState.security_level === 'elevated') return { level: 'elevated', icon: Shield, color: 'text-amber-500' };
    return { level: 'normal', icon: ShieldCheck, color: 'text-emerald-500' };
  };

  const securityInfo = getSecurityLevel();
  const SecurityIcon = securityInfo.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-xl border border-zinc-800/50 bg-zinc-900/50 p-6"
    >
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-zinc-100">Estado de Seguridad</h3>
        <div className={cn('flex items-center gap-2 rounded-full px-3 py-1', 
          systemState.lockdown_mode ? 'bg-red-500/10' : 'bg-emerald-500/10'
        )}>
          <SecurityIcon className={cn('h-4 w-4', securityInfo.color)} />
          <span className={cn('text-xs font-medium uppercase', securityInfo.color)}>
            {securityInfo.level}
          </span>
        </div>
      </div>

      <div className="divide-y divide-zinc-800/50">
        <StatusItem
          icon={systemState.lockdown_mode ? <Lock className="h-4 w-4" /> : <Unlock className="h-4 w-4" />}
          label="Modo Lockdown"
          value={systemState.lockdown_mode ? 'ACTIVO' : 'Desactivado'}
          status={systemState.lockdown_mode ? 'warning' : 'active'}
        />
        <StatusItem
          icon={<MessageSquare className="h-4 w-4" />}
          label="Chat Estudiantil"
          value={systemState.chat_enabled ? 'Activo' : 'Desactivado'}
          status={systemState.chat_enabled ? 'active' : 'inactive'}
        />
        <StatusItem
          icon={<Link2 className="h-4 w-4" />}
          label="Creación de Demos"
          value={systemState.demo_creation_enabled ? 'Permitido' : 'Bloqueado'}
          status={systemState.demo_creation_enabled ? 'active' : 'inactive'}
        />
      </div>

      {isSuperAdmin && (
        <div className="mt-4 rounded-lg bg-zinc-800/30 p-3">
          <p className="text-xs text-zinc-500">
            Nivel de acceso: <span className="font-medium text-purple-400">Super Admin</span>
            <br />
            Tienes control total sobre el sistema.
          </p>
        </div>
      )}
    </motion.div>
  );
};
