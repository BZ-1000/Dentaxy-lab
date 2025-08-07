import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useAuth } from '@/contexts/AuthContext';
import { useDashboardMetrics } from '@/hooks/useDashboardMetrics';
import { Clock, TrendingUp } from 'lucide-react';

interface ActivityData {
  date: string;
  minutes: number;
  day: string;
}

const TiempoActividad = () => {
  const { user } = useAuth();
  const { fetchUserActivityData } = useDashboardMetrics();
  const [activityData, setActivityData] = useState<ActivityData[]>([]);
  const [totalMinutes, setTotalMinutes] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadActivityData();
    } else {
      setLoading(false);
    }
  }, [user]);

  const loadActivityData = async () => {
    if (!user) return;
    
    try {
      const data = await fetchUserActivityData(user.id);
      const formattedData = data.map(item => ({
        ...item,
        day: new Date(item.date).getDate().toString()
      }));
      
      setActivityData(formattedData);
      setTotalMinutes(data.reduce((sum, item) => sum + item.minutes, 0));
    } catch (error) {
      console.error('Error loading activity data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <Card className="h-full">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Mi Productividad</CardTitle>
          <Clock className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center h-48 text-center">
          <div className="space-y-4">
            <div className="w-16 h-16 mx-auto bg-primary/10 rounded-full flex items-center justify-center">
              <TrendingUp className="w-8 h-8 text-primary" />
            </div>
            <div className="space-y-2">
              <h3 className="font-semibold text-foreground">Registra tu Progreso</h3>
              <p className="text-sm text-muted-foreground max-w-xs">
                Regístrate o inicia sesión para visualizar tu historial de actividad y descubrir cuánto tiempo ahorras con Dentaxy.ai
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (loading) {
    return (
      <Card className="h-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            Mi Productividad
          </CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center h-48">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-full">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Mi Productividad</CardTitle>
        <Clock className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Total este mes</span>
            <span className="text-lg font-semibold text-foreground">
              {Math.round(totalMinutes / 60)}h {totalMinutes % 60}m
            </span>
          </div>
          
          {activityData.length > 0 ? (
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={activityData}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis 
                    dataKey="day" 
                    className="text-xs fill-muted-foreground"
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis 
                    className="text-xs fill-muted-foreground"
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip 
                    content={({ active, payload, label }) => {
                      if (active && payload && payload.length) {
                        return (
                          <div className="bg-background border border-border rounded-lg p-2 shadow-md">
                            <p className="text-sm">{`Día ${label}`}</p>
                            <p className="text-sm font-semibold text-primary">
                              {`${payload[0].value} minutos`}
                            </p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="minutes" 
                    stroke="hsl(var(--primary))" 
                    strokeWidth={2}
                    dot={{ fill: "hsl(var(--primary))", strokeWidth: 2, r: 3 }}
                    activeDot={{ r: 5, stroke: "hsl(var(--primary))", strokeWidth: 2 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="h-48 flex items-center justify-center text-center">
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">
                  No hay datos de actividad aún
                </p>
                <p className="text-xs text-muted-foreground">
                  Comienza a usar la aplicación para ver tu progreso
                </p>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default TiempoActividad;