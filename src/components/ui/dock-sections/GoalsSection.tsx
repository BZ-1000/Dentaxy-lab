import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Copy, Heart } from 'lucide-react';
import { useLiveMetrics } from '@/hooks/useLiveMetrics';
import { useActiveUsers } from '@/hooks/useActiveUsers';

export const LiveMetricsSection = () => {
  const { metrics, loading } = useLiveMetrics();
  useActiveUsers();

  const metricsData = [
    {
      title: metrics.activeUsers.toString(),
      subtitle: 'Usuarios dentro de la app',
      icon: Users,
      color: 'text-green-500',
      bgColor: 'bg-green-50',
      isLoading: loading
    },
    {
      title: metrics.copyClicks.toString(),
      subtitle: 'Copias de redacciones utilizadas',
      icon: Copy,
      color: 'text-blue-500',
      bgColor: 'bg-blue-50',
      isLoading: loading
    },
    {
      title: metrics.donations.toString(),
      subtitle: 'Donaciones',
      icon: Heart,
      color: 'text-red-500',
      bgColor: 'bg-red-50',
      isLoading: loading,
      extraInfo: metrics.latestDonor ? `Último: ${metrics.latestDonor.name}` : undefined
    }
  ];

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2 px-2 mb-3">
        <span className="bg-primary/10 text-primary rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">
          📊
        </span>
        <h3 className="text-sm font-semibold text-foreground">Métricas en Vivo</h3>
      </div>
      
      <div className="space-y-2">
        {metricsData.map((metric, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="shadow-sm">
              <CardContent className="p-3">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${metric.bgColor}`}>
                    <metric.icon size={16} className={metric.color} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      {metric.isLoading ? (
                        <div className="h-5 w-8 bg-muted rounded animate-pulse" />
                      ) : (
                        <motion.span
                          key={metric.title}
                          initial={{ scale: 1.2 }}
                          animate={{ scale: 1 }}
                          className="text-lg font-bold text-foreground"
                        >
                          {metric.title}
                        </motion.span>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground font-medium truncate">
                      {metric.subtitle}
                    </p>
                    {metric.extraInfo && (
                      <p className="text-xs text-primary/70 mt-1 truncate">
                        {metric.extraInfo}
                      </p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
};