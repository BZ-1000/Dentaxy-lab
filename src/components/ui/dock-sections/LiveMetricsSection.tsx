// -------------------------------------------------------------------
// Componente de Métricas en Vivo - Versión Todo en Uno
// Diseño por Gemini - inspirado en la estética de Apple
// Características:
// - Diseño adaptativo (responsive grid)
// - Estilo "Frosted Glass" (vidrio esmerilado)
// - Contadores numéricos animados
// - Animaciones de entrada y efecto hover
// - Código limpio y estructurado en un solo archivo
// -------------------------------------------------------------------

import { useEffect, useRef } from 'react';
import { motion, animate } from 'framer-motion';
import { Users, Copy, Heart, BarChart2, type LucideIcon } from 'lucide-react';
import { useLiveMetrics } from '@/hooks/useLiveMetrics';
import { useActiveUsers } from '@/hooks/useActiveUsers';

// --- Sub-componente 1: Contador Animado ---
// Responsable de la animación de los números.
interface AnimatedCounterProps {
  value: number;
}

const AnimatedCounter = ({ value }: AnimatedCounterProps) => {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const previousValue = parseInt(node.textContent?.replace(/,/g, '') || '0', 10);

    if (previousValue === value) return; // Evita animar si el valor no cambia

    const controls = animate(previousValue, value, {
      duration: 0.8,
      ease: 'easeOut',
      onUpdate(latest) {
        node.textContent = Math.round(latest).toLocaleString('en-US');
      },
    });

    return () => controls.stop();
  }, [value]);

  return <span ref={ref}>{value.toLocaleString('en-US')}</span>;
};


// --- Sub-componente 2: Tarjeta de Métrica ---
// Define la apariencia y estructura de cada tarjeta individual.
const cardVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { type: 'spring', stiffness: 100 } },
};

interface MetricCardProps {
  title: number;
  subtitle: string;
  icon: LucideIcon;
  color: string;
  isLoading: boolean;
  extraInfo?: string;
}

const MetricCard = ({ title, subtitle, icon: Icon, color, isLoading, extraInfo }: MetricCardProps) => {
  return (
    <motion.div
      variants={cardVariants}
      whileHover={{ scale: 1.04, transition: { type: 'spring', stiffness: 300 } }}
      className="relative p-6 overflow-hidden text-left bg-white/60 backdrop-blur-xl border border-gray-200/50 rounded-2xl shadow-lg"
    >
      <div className="flex items-start justify-between">
        <div className="flex flex-col gap-1">
          <p className="text-sm font-medium text-gray-500">{subtitle}</p>
          <div className="flex items-baseline gap-2">
            {isLoading ? (
              <div className="w-24 h-9 mt-1 bg-gray-200 rounded-md animate-pulse" />
            ) : (
              <span className="text-4xl font-bold tracking-tighter text-gray-800">
                <AnimatedCounter value={title} />
              </span>
            )}
          </div>
          {extraInfo && (
             <p className="text-xs text-gray-400 mt-2">
               {isLoading ? (
                  <div className="w-32 h-4 bg-gray-200 rounded-md animate-pulse" />
               ) : (
                  extraInfo
               )}
            </p>
          )}
        </div>
        <div className={`flex-shrink-0 w-12 h-12 flex items-center justify-center bg-gray-100 rounded-xl`}>
          <Icon className={`${color} w-6 h-6`} strokeWidth={2} />
        </div>
      </div>
    </motion.div>
  );
};


// --- Componente Principal y Exportado ---
// Organiza el layout, obtiene los datos y renderiza las tarjetas.
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

export const LiveMetricsSection = () => {
  const { metrics, loading } = useLiveMetrics();
  useActiveUsers(); // Hook para mantener los datos de usuarios actualizados

  const metricsData = [
    {
      title: metrics.activeUsers,
      subtitle: 'Usuarios en la App',
      icon: Users,
      color: 'text-green-500',
      isLoading: loading,
    },
    {
      title: metrics.copyClicks,
      subtitle: 'Redacciones Copiadas',
      icon: Copy,
      color: 'text-blue-500',
      isLoading: loading,
    },
    {
      title: metrics.donations,
      subtitle: 'Donaciones Recibidas',
      icon: Heart,
      color: 'text-red-500',
      isLoading: loading,
      extraInfo: metrics.latestDonor ? `Último: ${metrics.latestDonor.name}` : undefined,
    },
  ];

  return (
    <section className="w-full max-w-5xl mx-auto p-4 md:p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="bg-gray-100 rounded-lg p-2">
           <BarChart2 className="text-gray-600" />
        </div>
        <h2 className="text-2xl font-bold tracking-tight text-gray-900">
          Métricas en Vivo
        </h2>
      </div>

      <motion.div
        className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {metricsData.map((metric, index) => (
          <MetricCard
            key={index}
            title={metric.title}
            subtitle={metric.subtitle}
            icon={metric.icon}
            color={metric.color}
            isLoading={metric.isLoading}
            extraInfo={metric.extraInfo}
          />
        ))}
      </motion.div>
    </section>
  );
};