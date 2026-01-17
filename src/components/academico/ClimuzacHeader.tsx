import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Zap, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useDemoSession } from '@/hooks/useDemoSession';

export const ClimuzacHeader: React.FC = () => {
  const navigate = useNavigate();
  const { fullName, expiresAt, isValid } = useDemoSession();
  const [tiempoRestante, setTiempoRestante] = useState<string>('--:--');

  useEffect(() => {
    if (!expiresAt) return;

    const calcularTiempo = () => {
      const ahora = new Date();
      const expira = new Date(expiresAt);
      const diff = expira.getTime() - ahora.getTime();

      if (diff <= 0) {
        setTiempoRestante('00:00');
        return;
      }

      const minutos = Math.floor(diff / 60000);
      const segundos = Math.floor((diff % 60000) / 1000);
      setTiempoRestante(`${minutos}:${segundos.toString().padStart(2, '0')}`);
    };

    calcularTiempo();
    const interval = setInterval(calcularTiempo, 1000);
    return () => clearInterval(interval);
  }, [expiresAt]);

  const isLowTime = tiempoRestante !== '--:--' && 
    tiempoRestante !== '00:00' &&
    parseInt(tiempoRestante.split(':')[0]) < 5;

  return (
    <header className="sticky top-0 z-50 bg-background border-b border-border/50">
      <div className="flex items-center justify-between h-14 px-4 lg:px-6">
        {/* Left: Back button */}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate('/academico')}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground -ml-2"
        >
          <ArrowLeft className="h-4 w-4" />
          <span className="hidden sm:inline text-sm">Volver</span>
        </Button>

        {/* Center: Dentaxy Logo */}
        <div className="flex items-center gap-2">
          <img 
            src="/lovable-uploads/7898fc25-0e62-40e1-a139-6582324afb27.png" 
            alt="Dentaxy" 
            className="h-6 w-6 rounded-full bg-black p-0.5" 
          />
          <span className="text-sm font-semibold tracking-tight">DENTAXY</span>
        </div>

        {/* Right: Session info */}
        <div className="flex items-center gap-3">
          {/* Timer */}
          <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-mono ${
            isLowTime 
              ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' 
              : 'bg-muted text-muted-foreground'
          }`}>
            <Clock className={`h-3 w-3 ${isLowTime ? 'animate-pulse' : ''}`} />
            <span className="font-medium">{tiempoRestante}</span>
          </div>

          {/* User name */}
          {fullName && (
            <span className="hidden sm:block text-xs text-muted-foreground truncate max-w-[120px]">
              {fullName}
            </span>
          )}

          {/* Integration badge */}
          <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20">
            <Zap className="h-3 w-3 text-emerald-500" />
            <span className="hidden lg:inline text-[10px] font-medium text-emerald-600 dark:text-emerald-400">
              Integración
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default ClimuzacHeader;
