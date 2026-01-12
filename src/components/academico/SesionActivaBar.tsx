import React from 'react';
import { motion } from 'framer-motion';
import { Clock, MapPin, User, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAcademico } from '@/contexts/AcademicoContext';

export const SesionActivaBar: React.FC = () => {
  const { sesionUsuario, tiempoRestante, clinicaActual, salirDemo } = useAcademico();

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (!sesionUsuario) return null;

  const isLowTime = tiempoRestante < 300; // menos de 5 minutos

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="fixed bottom-0 left-0 right-0 z-50 border-t border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
    >
      <div className="container flex h-12 items-center justify-between px-4">
        <div className="flex items-center gap-6">
          {/* Usuario */}
          <div className="flex items-center gap-2 text-sm">
            <User className="h-4 w-4 text-muted-foreground" />
            <span className="font-medium">{sesionUsuario.nombre}</span>
          </div>

          {/* Clínica actual */}
          {clinicaActual && (
            <div className="hidden sm:flex items-center gap-2 text-sm text-muted-foreground">
              <MapPin className="h-4 w-4" />
              <span>{clinicaActual.nombreCorto}</span>
            </div>
          )}
        </div>

        <div className="flex items-center gap-4">
          {/* Tiempo restante */}
          <div className={`flex items-center gap-2 text-sm ${isLowTime ? 'text-destructive' : 'text-muted-foreground'}`}>
            <Clock className={`h-4 w-4 ${isLowTime ? 'animate-pulse' : ''}`} />
            <span className="font-mono">{formatTime(tiempoRestante)}</span>
          </div>

          {/* Botón salir */}
          <Button
            variant="ghost"
            size="sm"
            onClick={salirDemo}
            className="text-muted-foreground hover:text-destructive"
          >
            <LogOut className="h-4 w-4 mr-2" />
            <span className="hidden sm:inline">Salir</span>
          </Button>
        </div>
      </div>
    </motion.div>
  );
};
