import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, FileText, Building2, Activity } from 'lucide-react';

interface Metrica {
  label: string;
  valor: number | string;
  icon: React.ReactNode;
  incremento?: boolean;
}

export const AdminPanelSimulado: React.FC = () => {
  const [metricas, setMetricas] = useState<Metrica[]>([
    { label: 'Alumnos activos', valor: 127, icon: <Users className="h-4 w-4" /> },
    { label: 'Historias generadas', valor: 2341, icon: <FileText className="h-4 w-4" /> },
    { label: 'Clínicas activas', valor: '4/4', icon: <Building2 className="h-4 w-4" /> },
    { label: 'Última actividad', valor: 'Hace 3 min', icon: <Activity className="h-4 w-4" />, incremento: true }
  ]);

  // Simular actividad en tiempo real
  useEffect(() => {
    const interval = setInterval(() => {
      setMetricas(prev => prev.map(m => {
        if (m.label === 'Historias generadas' && typeof m.valor === 'number') {
          return { ...m, valor: m.valor + Math.floor(Math.random() * 2) };
        }
        if (m.label === 'Última actividad') {
          const tiempos = ['Hace 1 min', 'Hace 2 min', 'Hace 3 min', 'Ahora mismo'];
          return { ...m, valor: tiempos[Math.floor(Math.random() * tiempos.length)] };
        }
        return m;
      }));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full bg-muted/30 border-b border-border/40"
    >
      <div className="container px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Panel de Supervisión
            </span>
          </div>
          
          <div className="flex items-center gap-6">
            {metricas.map((metrica, index) => (
              <motion.div
                key={metrica.label}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center gap-2"
              >
                <span className="text-muted-foreground">{metrica.icon}</span>
                <div className="flex flex-col">
                  <span className="text-xs text-muted-foreground hidden lg:block">
                    {metrica.label}
                  </span>
                  <span className="text-sm font-semibold">
                    {typeof metrica.valor === 'number' 
                      ? metrica.valor.toLocaleString() 
                      : metrica.valor
                    }
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
};
