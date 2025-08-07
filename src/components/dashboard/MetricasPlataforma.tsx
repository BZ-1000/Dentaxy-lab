import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useDashboardMetrics } from '@/hooks/useDashboardMetrics';
import { Users, UserCheck, Copy } from 'lucide-react';

const MetricasPlataforma = () => {
  const { metrics, loading } = useDashboardMetrics();

  const metricsData = [
    {
      title: "Usuarios Activos",
      value: metrics.activeUsers,
      icon: UserCheck,
      description: "En este momento",
      color: "text-green-600"
    },
    {
      title: "Total Usuarios",
      value: metrics.totalUsers,
      icon: Users,
      description: "Registrados",
      color: "text-blue-600"
    },
    {
      title: "Redacciones IA",
      value: metrics.aiGenerationsCount,
      icon: Copy,
      description: "Generaciones totales",
      color: "text-purple-600"
    }
  ];

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[1, 2, 3].map((i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                <div className="h-4 bg-muted rounded animate-pulse"></div>
              </CardTitle>
              <div className="h-4 w-4 bg-muted rounded animate-pulse"></div>
            </CardHeader>
            <CardContent>
              <div className="h-8 bg-muted rounded animate-pulse mb-1"></div>
              <div className="h-3 bg-muted rounded animate-pulse w-2/3"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {metricsData.map((metric, index) => {
        const IconComponent = metric.icon;
        return (
          <Card key={index} className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {metric.title}
              </CardTitle>
              <IconComponent className={`h-4 w-4 ${metric.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">
                {metric.value.toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground">
                {metric.description}
              </p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default MetricasPlataforma;