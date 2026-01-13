import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { User, Clock, Shield } from 'lucide-react';
import { useDemoSession } from '@/hooks/useDemoSession';

export const SesionActivaBar: React.FC = () => {
  const { fullName, expiresAt, isValid } = useDemoSession();
  const [tiempoRestante, setTiempoRestante] = useState<string>('');

  useEffect(() => {
    if (!expiresAt) return;

    const calcularTiempo = () => {
      const ahora = new Date();
      const expira = new Date(expiresAt);
      const diff = expira.getTime() - ahora.getTime();

      if (diff <= 0) {
        setTiempoRestante('Expirada');
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

  if (!isValid || !fullName) return null;

  const isLowTime = tiempoRestante !== 'Expirada' && 
    parseInt(tiempoRestante.split(':')[0]) < 5;

  return (
    <motion.div
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.5 }}
      className="fixed bottom-0 left-0 right-0 z-40"
    >
      <div className="bg-gradient-to-r from-emerald-600 to-emerald-500 text-white">
        <div className="container flex items-center justify-between h-14 px-4">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              <span className="text-xs font-medium opacity-80">Sesión Verificada</span>
            </div>
            <div className="h-4 w-px bg-white/30" />
            <div className="flex items-center gap-2">
              <User className="h-4 w-4" />
              <span className="text-sm font-semibold">{fullName}</span>
            </div>
          </div>

          <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full ${isLowTime ? 'bg-red-500/30' : 'bg-white/20'}`}>
            <Clock className={`h-4 w-4 ${isLowTime ? 'animate-pulse' : ''}`} />
            <span className="text-sm font-mono font-bold">{tiempoRestante}</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
