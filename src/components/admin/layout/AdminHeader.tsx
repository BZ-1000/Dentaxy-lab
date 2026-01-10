import React from 'react';
import { useAdminSecurity } from '@/contexts/AdminSecurityContext';
import { Badge } from '@/components/ui/badge';
import { Shield, Clock, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AdminHeaderProps {
  title: string;
  description?: string;
}

export const AdminHeader: React.FC<AdminHeaderProps> = ({ title, description }) => {
  const { adminRole, sessionTimeRemaining, systemState } = useAdminSecurity();

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getSecurityStatusColor = () => {
    if (systemState.lockdown_mode) return 'text-red-500';
    if (systemState.security_level === 'critical') return 'text-red-500';
    if (systemState.security_level === 'elevated') return 'text-amber-500';
    return 'text-emerald-500';
  };

  const getSecurityStatusIcon = () => {
    if (systemState.lockdown_mode) return <AlertTriangle className="h-4 w-4" />;
    if (systemState.security_level === 'critical') return <AlertTriangle className="h-4 w-4" />;
    if (systemState.security_level === 'elevated') return <AlertTriangle className="h-4 w-4" />;
    return <CheckCircle2 className="h-4 w-4" />;
  };

  return (
    <header className="sticky top-0 z-30 border-b border-zinc-800/50 bg-zinc-950/95 backdrop-blur-sm">
      <div className="flex h-16 items-center justify-between px-6">
        <div>
          <h1 className="text-xl font-semibold text-zinc-100">{title}</h1>
          {description && <p className="text-sm text-zinc-500">{description}</p>}
        </div>

        <div className="flex items-center gap-4">
          {/* Security Status */}
          <div
            className={cn(
              'flex items-center gap-2 rounded-full px-3 py-1.5',
              systemState.lockdown_mode ? 'bg-red-500/10' : 'bg-zinc-800/50'
            )}
          >
            <span className={getSecurityStatusColor()}>{getSecurityStatusIcon()}</span>
            <span className={cn('text-xs font-medium', getSecurityStatusColor())}>
              {systemState.lockdown_mode
                ? 'LOCKDOWN'
                : systemState.security_level.toUpperCase()}
            </span>
          </div>

          {/* Session Timer */}
          <div
            className={cn(
              'flex items-center gap-2 rounded-full px-3 py-1.5',
              sessionTimeRemaining < 300 ? 'bg-amber-500/10' : 'bg-zinc-800/50'
            )}
          >
            <Clock
              className={cn(
                'h-4 w-4',
                sessionTimeRemaining < 300 ? 'text-amber-500' : 'text-zinc-400'
              )}
            />
            <span
              className={cn(
                'text-xs font-mono font-medium',
                sessionTimeRemaining < 300 ? 'text-amber-500' : 'text-zinc-400'
              )}
            >
              {formatTime(sessionTimeRemaining)}
            </span>
          </div>

          {/* Role Badge */}
          <Badge
            variant="outline"
            className={cn(
              'gap-1.5 border-0',
              adminRole === 'super_admin'
                ? 'bg-purple-500/10 text-purple-400'
                : 'bg-blue-500/10 text-blue-400'
            )}
          >
            <Shield className="h-3 w-3" />
            {adminRole === 'super_admin' ? 'Super Admin' : 'Admin'}
          </Badge>
        </div>
      </div>
    </header>
  );
};
