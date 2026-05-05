import React, { useState, useCallback } from 'react';
import { useAdminSecurity } from '@/contexts/AdminSecurityContext';
import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Power, AlertTriangle, Loader2, ShieldOff, ShieldCheck } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

export const KillSwitch: React.FC = () => {
  const { isSuperAdmin, systemState, activateKillSwitch, deactivateKillSwitch } = useAdminSecurity();
  const [isExecuting, setIsExecuting] = useState(false);
  const [countdown, setCountdown] = useState<number | null>(null);

  const handleActivate = useCallback(async () => {
    setCountdown(3);
    
    const countdownInterval = setInterval(() => {
      setCountdown((prev) => {
        if (prev === null || prev <= 1) {
          clearInterval(countdownInterval);
          return null;
        }
        return prev - 1;
      });
    }, 1000);

    await new Promise((resolve) => setTimeout(resolve, 3000));
    
    setIsExecuting(true);
    try {
      await activateKillSwitch();
      toast.error('Kill Switch Activado', {
        description: 'Todos los demos han sido revocados y el sistema está en modo lockdown.',
      });
    } catch (error) {
      toast.error('Error al activar Kill Switch');
    } finally {
      setIsExecuting(false);
    }
  }, [activateKillSwitch]);

  const handleDeactivate = useCallback(async () => {
    setIsExecuting(true);
    try {
      await deactivateKillSwitch();
      toast.success('Sistema Restaurado', {
        description: 'El modo lockdown ha sido desactivado.',
      });
    } catch (error) {
      toast.error('Error al desactivar Kill Switch');
    } finally {
      setIsExecuting(false);
    }
  }, [deactivateKillSwitch]);

  if (!isSuperAdmin) return null;

  const isLockdown = systemState.lockdown_mode;

  return (
    <div
      className={cn(
        'rounded-xl border p-6 transition-all',
        isLockdown
          ? 'border-red-500/30 bg-red-500/5'
          : 'border-zinc-800/50 bg-zinc-900/50'
      )}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-4">
          <div
            className={cn(
              'flex h-12 w-12 items-center justify-center rounded-xl',
              isLockdown ? 'bg-red-500/10' : 'bg-zinc-800/50'
            )}
          >
            {isLockdown ? (
              <ShieldOff className="h-6 w-6 text-red-500" />
            ) : (
              <Power className="h-6 w-6 text-zinc-400" />
            )}
          </div>
          <div>
            <h3 className="text-lg font-semibold text-zinc-100">
              Kill Switch {isLockdown && '- ACTIVO'}
            </h3>
            <p className="mt-1 text-sm text-zinc-500">
              {isLockdown
                ? 'El sistema está en modo lockdown. Todos los demos están revocados.'
                : 'Desactiva inmediatamente todos los demos y bloquea el acceso externo.'}
            </p>
          </div>
        </div>

        {isLockdown ? (
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="outline"
                className="gap-2 border-emerald-500/30 bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20"
                disabled={isExecuting}
              >
                {isExecuting ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <ShieldCheck className="h-4 w-4" />
                )}
                Restaurar Sistema
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent className="border-zinc-800 bg-zinc-950">
              <AlertDialogHeader>
                <AlertDialogTitle className="text-zinc-100">
                  ¿Desactivar modo Lockdown?
                </AlertDialogTitle>
                <AlertDialogDescription className="text-zinc-400">
                  Esto restaurará el funcionamiento normal del sistema. Los demos revocados
                  permanecerán revocados pero se podrán crear nuevos.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel className="border-zinc-800 bg-zinc-900 text-zinc-300 hover:bg-zinc-800">
                  Cancelar
                </AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleDeactivate}
                  className="bg-emerald-600 text-white hover:bg-emerald-700"
                >
                  Confirmar Restauración
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        ) : (
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="destructive"
                className="relative gap-2 overflow-hidden"
                disabled={isExecuting}
              >
                {countdown !== null ? (
                  <span className="font-mono text-lg">{countdown}</span>
                ) : isExecuting ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <>
                    <Power className="h-4 w-4" />
                    Activar Kill Switch
                  </>
                )}
                {/* Pulsing border effect */}
                <span className="absolute inset-0 animate-pulse rounded-md border-2 border-red-400 opacity-50" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent className="border-red-900/50 bg-zinc-950">
              <AlertDialogHeader>
                <div className="mb-4 flex justify-center">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-500/10">
                    <AlertTriangle className="h-8 w-8 text-red-500" />
                  </div>
                </div>
                <AlertDialogTitle className="text-center text-xl text-zinc-100">
                  ⚠️ Activar Kill Switch
                </AlertDialogTitle>
                <AlertDialogDescription className="text-center text-zinc-400">
                  <span className="block font-semibold text-red-400">
                    Esta acción es INMEDIATA e IRREVERSIBLE.
                  </span>
                  <span className="mt-2 block">
                    Se revocarán TODOS los demos activos, se cerrarán las sesiones de otros
                    administradores y se desactivará el chat estudiantil.
                  </span>
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter className="mt-4">
                <AlertDialogCancel className="border-zinc-800 bg-zinc-900 text-zinc-300 hover:bg-zinc-800">
                  Cancelar
                </AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleActivate}
                  className="bg-red-600 text-white hover:bg-red-700"
                >
                  Confirmar Activación
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )}
      </div>
    </div>
  );
};
