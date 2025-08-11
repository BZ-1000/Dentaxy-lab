import { useState, useEffect } from 'react';
import { Users, Copy, Heart, Activity } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { useLiveMetrics } from '@/hooks/useLiveMetrics';

// Componente de animación simple
const MotionDiv = ({ children, className, delay = 0, ...props }) => {
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), delay * 100);
    return () => clearTimeout(timer);
  }, [delay]);

  return (
    <div 
      className={`transition-all duration-500 ease-out ${
        isVisible 
          ? 'opacity-100 transform translate-y-0' 
          : 'opacity-0 transform translate-y-4'
      } ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

// Componente de número animado compacto
const AnimatedNumber = ({ value, isLoading }) => {
  if (isLoading) {
    return (
      <div className="h-5 w-8 sm:h-6 sm:w-10 bg-gradient-to-r from-muted via-background to-muted rounded animate-pulse" />
    );
  }

  return (
    <span className="text-lg sm:text-xl font-black bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
      {value.toLocaleString()}
    </span>
  );
};

// Componente de indicador de pulso compacto
const PulseIndicator = () => (
  <div className="relative">
    <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
    <div className="absolute inset-0 w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping opacity-75" />
  </div>
);

export const LiveMetricsSection = () => {
  const { metrics, loading } = useLiveMetrics();

  const metricsData = [
    {
      title: metrics.activeUsers,
      subtitle: 'Usuarios activos',
      description: 'Conectados ahora',
      icon: Users,
      iconBg: 'bg-emerald-500',
      isLoading: loading
    },
    {
      title: metrics.copyClicks,
      subtitle: 'Copias realizadas',
      description: 'Total de redacciones utilizadas',
      icon: Copy,
      iconBg: 'bg-blue-500',
      isLoading: loading
    },
    {
      title: metrics.donations,
      subtitle: 'Donaciones recibidas',
      description: metrics.latestDonor ? `Última: ${metrics.latestDonor.name}` : 'Apoya el proyecto',
      icon: Heart,
      iconBg: 'bg-red-500',
      isLoading: loading
    }
  ];

  return (
    <Card className="relative overflow-hidden bg-gradient-to-br from-background via-muted/20 to-accent/5 border-0 shadow-lg shadow-primary/5">
      <div className="absolute inset-0 bg-gradient-to-br from-background/80 via-background/60 to-transparent backdrop-blur-xl" />
      
      <div className="relative p-3 sm:p-4">
        {/* Header compacto */}
        <div className="flex items-center gap-2 mb-3 sm:mb-4">
          <span className="bg-gradient-to-br from-primary via-primary to-primary/80 rounded-xl w-6 h-6 sm:w-8 sm:h-8 flex items-center justify-center text-xs font-bold text-primary-foreground shadow-lg shadow-primary/25">
            <Activity className="w-3 h-3 sm:w-4 sm:h-4" />
          </span>
          <div>
            <h3 className="text-sm sm:text-base font-black bg-gradient-to-r from-foreground via-muted-foreground to-foreground bg-clip-text text-transparent">
              Métricas en Vivo
            </h3>
            <p className="text-xs text-muted-foreground font-medium">
              Datos en tiempo real
            </p>
          </div>
        </div>

        {/* Grid de métricas compacto */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-3">
          {metricsData.map((metric, index) => (
            <MotionDiv
              key={index}
              delay={index}
              className="bg-gradient-to-br from-background to-muted/30 p-3 rounded-xl border border-border/50 shadow-sm hover:shadow-md transition-all duration-300"
            >
              <div className="flex items-center gap-2 mb-2">
                <div className={`w-6 h-6 sm:w-8 sm:h-8 ${metric.iconBg} rounded-lg flex items-center justify-center shadow-sm`}>
                  <metric.icon className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                </div>
                <PulseIndicator />
              </div>
              
              <div className="space-y-1">
                <AnimatedNumber value={metric.title} isLoading={metric.isLoading} />
                <p className="text-xs font-semibold text-muted-foreground">
                  {metric.subtitle}
                </p>
                <p className="text-xs text-muted-foreground/80 truncate">
                  {metric.description}
                </p>
              </div>
            </MotionDiv>
          ))}
        </div>

        {/* Status bar compacto */}
        <div className="mt-3 sm:mt-4 pt-3 border-t border-border/50">
          <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
            <PulseIndicator />
            <span>En vivo • Actualizado ahora</span>
          </div>
        </div>
      </div>
    </Card>
  );
};