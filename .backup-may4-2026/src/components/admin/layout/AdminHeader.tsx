import React from 'react';
import { useAdminSecurity } from '@/contexts/AdminSecurityContext';
import { Badge } from '@/components/ui/badge';
import { Shield, Clock, AlertTriangle, CheckCircle2, Search, Bell } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

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
    if (systemState.lockdown_mode) return 'text-red-500 bg-red-50 border-red-100';
    if (systemState.security_level === 'critical') return 'text-red-500 bg-red-50 border-red-100';
    if (systemState.security_level === 'elevated') return 'text-amber-500 bg-amber-50 border-amber-100';
    return 'text-emerald-600 bg-emerald-50 border-emerald-100';
  };

  const getSecurityStatusIcon = () => {
    if (systemState.lockdown_mode) return <AlertTriangle className="h-3.5 w-3.5" />;
    if (systemState.security_level === 'critical') return <AlertTriangle className="h-3.5 w-3.5" />;
    if (systemState.security_level === 'elevated') return <AlertTriangle className="h-3.5 w-3.5" />;
    return <CheckCircle2 className="h-3.5 w-3.5" />;
  };

  return (
    <header className="sticky top-0 z-30 mb-8 rounded-2xl border border-white/60 bg-white/70 shadow-sm backdrop-blur-xl transition-all">
      <div className="flex h-20 items-center justify-between px-6">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-zinc-900">{title}</h1>
          {description && <p className="text-xs font-medium text-zinc-400">{description}</p>}
        </div>

        <div className="flex items-center gap-3">
          {/* Search Trigger (Mock) */}
          <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full text-zinc-400 hover:bg-zinc-100 hover:text-zinc-600">
            <Search className="h-4 w-4" />
          </Button>

          {/* Notifications (Mock) */}
          <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full text-zinc-400 hover:bg-zinc-100 hover:text-zinc-600">
            <Bell className="h-4 w-4" />
          </Button>

          <div className="mx-2 h-4 w-px bg-zinc-200" />

          {/* Security Status */}
          <div
            className={cn(
              'flex items-center gap-2 rounded-full border px-3 py-1',
              getSecurityStatusColor()
            )}
          >
            {getSecurityStatusIcon()}
            <span className="text-[10px] font-bold uppercase tracking-wider">
              {systemState.lockdown_mode
                ? 'LOCKDOWN'
                : systemState.security_level}
            </span>
          </div>

          {/* Session Timer */}
          <div
            className={cn(
              'flex items-center gap-2 rounded-full border px-3 py-1',
              sessionTimeRemaining < 300
                ? 'bg-amber-50 border-amber-100 text-amber-600'
                : 'bg-zinc-50 border-zinc-100 text-zinc-500'
            )}
          >
            <Clock className="h-3.5 w-3.5" />
            <span className="text-[11px] font-mono font-medium">
              {formatTime(sessionTimeRemaining)}
            </span>
          </div>

          {/* Role Badge */}
          <Badge
            variant="outline"
            className={cn(
              'gap-1.5 border px-3 py-1',
              adminRole === 'super_admin'
                ? 'bg-purple-50 text-purple-600 border-purple-100'
                : 'bg-blue-50 text-blue-600 border-blue-100'
            )}
          >
            <Shield className="h-3 w-3" />
            <span className="text-[10px] uppercase tracking-wider">{adminRole === 'super_admin' ? 'Super Admin' : 'Admin'}</span>
          </Badge>
        </div>
      </div>
    </header>
  );
};
