import React, { useState, useEffect } from 'react';
import { Users, Copy, Heart, TrendingUp } from 'lucide-react';

// Simulación de hooks personalizados
const useLiveMetrics = () => {
  const [metrics, setMetrics] = useState({
    activeUsers: 42,
    copyClicks: 1247,
    donations: 8,
    latestDonor: { name: "María García" }
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1000);
    
    // Simulación de actualizaciones en tiempo real
    const interval = setInterval(() => {
      setMetrics(prev => ({
        ...prev,
        activeUsers: prev.activeUsers + Math.floor(Math.random() * 3) - 1,
        copyClicks: prev.copyClicks + Math.floor(Math.random() * 2),
      }));
    }, 3000);

    return () => {
      clearTimeout(timer);
      clearInterval(interval);
    };
  }, []);

  return { metrics, loading };
};

const useActiveUsers = () => {
  // Simulación del hook
  return null;
};

// Componente de tarjeta personalizada
const Card = ({ children, className = "" }) => (
  <div className={`bg-white/80 backdrop-blur-xl rounded-2xl shadow-sm border border-gray-100/50 ${className}`}>
    {children}
  </div>
);

const CardContent = ({ children, className = "" }) => (
  <div className={className}>
    {children}
  </div>
);

// Componente de animación
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

// Componente de número animado
const AnimatedNumber = ({ value, isLoading }) => {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    if (!isLoading && value !== displayValue) {
      const timer = setTimeout(() => {
        setDisplayValue(value);
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [value, isLoading, displayValue]);

  if (isLoading) {
    return (
      <div className="h-8 w-12 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded-lg animate-pulse bg-size-200 animate-shimmer" />
    );
  }

  return (
    <span className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent transition-all duration-300">
      {displayValue.toLocaleString()}
    </span>
  );
};

// Componente de indicador de pulso
const PulseIndicator = ({ color }) => (
  <div className="relative">
    <div className={`w-2 h-2 ${color} rounded-full`} />
    <div className={`absolute inset-0 w-2 h-2 ${color} rounded-full animate-ping opacity-75`} />
  </div>
);

export const LiveMetricsSection = () => {
  const { metrics, loading } = useLiveMetrics();
  useActiveUsers();

  const metricsData = [
    {
      title: metrics.activeUsers,
      subtitle: 'Usuarios activos',
      description: 'Conectados ahora',
      icon: Users,
      color: 'bg-green-500',
      bgGradient: 'from-green-50 to-emerald-50',
      iconColor: 'text-green-600',
      pulseColor: 'bg-green-500',
      isLoading: loading
    },
    {
      title: metrics.copyClicks,
      subtitle: 'Copias realizadas',
      description: 'Total de redacciones utilizadas',
      icon: Copy,
      color: 'bg-blue-500',
      bgGradient: 'from-blue-50 to-indigo-50',
      iconColor: 'text-blue-600',
      pulseColor: 'bg-blue-500',
      isLoading: loading
    },
    {
      title: metrics.donations,
      subtitle: 'Donaciones recibidas',
      description: metrics.latestDonor ? `Última: ${metrics.latestDonor.name}` : 'Apoya el proyecto',
      icon: Heart,
      color: 'bg-red-500',
      bgGradient: 'from-red-50 to-pink-50',
      iconColor: 'text-red-600',
      pulseColor: 'bg-red-500',
      isLoading: loading
    }
  ];

  return (
    <div className="w-full max-w-7xl mx-auto p-4 md:p-6">
      {/* Header Section */}
      <MotionDiv className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="relative">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
              <TrendingUp size={20} className="text-white" />
            </div>
            <PulseIndicator color="bg-green-500" />
          </div>
          <div>
            <h2 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
              Métricas en Vivo
            </h2>
            <p className="text-gray-500 text-sm md:text-base">
              Estadísticas actualizadas en tiempo real
            </p>
          </div>
        </div>
      </MotionDiv>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6">
        {metricsData.map((metric, index) => (
          <MotionDiv
            key={index}
            delay={index}
            className="group hover:scale-[1.02] transition-transform duration-300"
          >
            <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 border-0 shadow-sm hover:shadow-2xl/10">
              <CardContent className="p-6 md:p-8">
                {/* Icon and Pulse Container */}
                <div className="flex items-start justify-between mb-6">
                  <div className={`relative p-3 md:p-4 rounded-2xl bg-gradient-to-br ${metric.bgGradient} group-hover:scale-110 transition-transform duration-300`}>
                    <metric.icon 
                      size={24} 
                      className={`${metric.iconColor} group-hover:scale-110 transition-transform duration-300`} 
                    />
                  </div>
                  <PulseIndicator color={metric.pulseColor} />
                </div>

                {/* Main Content */}
                <div className="space-y-3">
                  {/* Title Number */}
                  <div className="flex items-baseline gap-2">
                    <AnimatedNumber value={metric.title} isLoading={metric.isLoading} />
                    {!metric.isLoading && (
                      <TrendingUp size={16} className="text-green-500 animate-bounce" />
                    )}
                  </div>

                  {/* Subtitle */}
                  <h3 className="text-lg font-semibold text-gray-700 leading-tight">
                    {metric.subtitle}
                  </h3>

                  {/* Description */}
                  <p className="text-sm text-gray-500 leading-relaxed">
                    {metric.description}
                  </p>
                </div>

                {/* Bottom Progress Line */}
                <div className="mt-6 pt-4 border-t border-gray-100">
                  <div className="flex items-center justify-between text-xs text-gray-400">
                    <span>Actualizado ahora</span>
                    <div className="flex items-center gap-1">
                      <div className="w-1 h-1 bg-green-500 rounded-full animate-pulse" />
                      <span>En vivo</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </MotionDiv>
        ))}
      </div>

      {/* Bottom Status Bar */}
      <MotionDiv delay={4} className="mt-8 p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-2xl border border-gray-100">
        <div className="flex items-center justify-center gap-4 text-sm text-gray-600">
          <div className="flex items-center gap-2">
            <PulseIndicator color="bg-green-500" />
            <span>Sistema operativo</span>
          </div>
          <div className="w-px h-4 bg-gray-300" />
          <span>Última actualización: hace unos segundos</span>
        </div>
      </MotionDiv>

      <style jsx>{`
        .bg-size-200 {
          background-size: 200% 100%;
        }
        
        @keyframes shimmer {
          0% {
            background-position: -200% 0;
          }
          100% {
            background-position: 200% 0;
          }
        }
        
        .animate-shimmer {
          animation: shimmer 1.5s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};