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
      bgColor: "bg-blue-500/10",
      iconColor: "text-blue-500",
      textColor: "text-blue-600"
    },
    {
      title: "Total Usuarios",
      value: metrics.totalUsers,
      icon: Users,
      description: "Registrados",
      bgColor: "bg-orange-500/10",
      iconColor: "text-orange-500",
      textColor: "text-orange-600"
    },
    {
      title: "Redacciones IA",
      value: metrics.aiGenerationsCount,
      icon: Copy,
      description: "Generaciones totales",
      bgColor: "bg-green-500/10",
      iconColor: "text-green-500",
      textColor: "text-green-600"
    }
  ];

  if (loading) {
    return (
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium text-muted-foreground">Goals</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between space-x-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center space-x-3 flex-1">
                <div className="w-12 h-12 bg-muted rounded-lg animate-pulse"></div>
                <div className="space-y-1 flex-1">
                  <div className="h-6 bg-muted rounded animate-pulse"></div>
                  <div className="h-3 bg-muted rounded animate-pulse w-2/3"></div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium text-muted-foreground">Goals</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between space-x-4">
          {metricsData.map((metric, index) => {
            const IconComponent = metric.icon;
            return (
              <div key={index} className="flex items-center space-x-3 flex-1">
                <div className={`w-12 h-12 ${metric.bgColor} rounded-lg flex items-center justify-center`}>
                  <IconComponent className={`h-6 w-6 ${metric.iconColor}`} />
                </div>
                <div className="space-y-1">
                  <div className={`text-2xl font-bold ${metric.textColor}`}>
                    {metric.value.toLocaleString()}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {metric.title}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default MetricasPlataforma;