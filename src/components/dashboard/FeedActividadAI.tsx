import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useDashboardMetrics } from '@/hooks/useDashboardMetrics';
import { Bot, Sparkles, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface AIActivity {
  section_name: string;
  user_id: string;
  clicked_at: string;
}

const FeedActividadAI = () => {
  const { fetchRecentAIActivity } = useDashboardMetrics();
  const [activities, setActivities] = useState<AIActivity[]>([]);
  const [loading, setLoading] = useState(true);

  const sectionNames = [
    'Padecimiento Actual',
    'Antecedentes Heredo-Familiares',
    'Antecedentes Personales No Patológicos',
    'Antecedentes Personales Patológicos',
    'Antecedentes Alérgicos',
    'Antecedentes Quirúrgicos',
    'Antecedentes Hemorrágicos',
    'Antecedentes Gineco-Obstétricos',
    'Interrogatorio por Sistemas',
    'Exploración Física',
    'Examen de Cabeza',
    'Articulación Craneomandibular',
    'Examen de Cuello',
    'Examen Intrabucal',
    'Glándulas Salivales',
    'Oclusión',
    'Relación de Dientes',
    'Línea Media',
    'Frenillos',
    'Diagnóstico',
    'Pronóstico'
  ];

  useEffect(() => {
    loadActivities();

    // Set up real-time subscription
    const channel = supabase
      .channel('ai-activity-feed')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'ai_button_usage'
        },
        () => {
          loadActivities();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const loadActivities = async () => {
    try {
      const data = await fetchRecentAIActivity();
      setActivities(data);
    } catch (error) {
      console.error('Error loading AI activities:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatUserId = (userId: string) => {
    return userId.substring(0, 8);
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMinutes = Math.floor(diffMs / 60000);
    
    if (diffMinutes < 1) return 'Ahora mismo';
    if (diffMinutes < 60) return `Hace ${diffMinutes}m`;
    if (diffMinutes < 1440) return `Hace ${Math.floor(diffMinutes / 60)}h`;
    return `Hace ${Math.floor(diffMinutes / 1440)}d`;
  };

  if (loading) {
    return (
      <Card className="h-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bot className="h-4 w-4" />
            Actividad de la IA
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="flex items-start gap-3 p-3 rounded-lg border">
              <div className="w-8 h-8 bg-muted rounded-full animate-pulse"></div>
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-muted rounded animate-pulse"></div>
                <div className="h-3 bg-muted rounded animate-pulse w-2/3"></div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-full">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-sm font-medium">
          <Bot className="h-4 w-4" />
          Transaction History
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2 max-h-80 overflow-y-auto">
        {activities.length > 0 ? (
          activities.map((activity, index) => (
            <div 
              key={index}
              className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50 transition-colors"
            >
              <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                <div className="w-4 h-4 bg-primary rounded-full flex items-center justify-center">
                  <span className="text-[8px] font-bold text-primary-foreground">D</span>
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-foreground truncate">
                    {activity.section_name}
                  </p>
                  <div className="flex items-center gap-1">
                    {index % 2 === 0 ? (
                      <ArrowUpRight className="w-3 h-3 text-green-500" />
                    ) : (
                      <ArrowDownRight className="w-3 h-3 text-red-500" />
                    )}
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-xs text-muted-foreground font-mono">
                    {formatUserId(activity.user_id)}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {formatTime(activity.clicked_at)}
                  </p>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center py-6 text-center">
            <div className="w-10 h-10 bg-muted rounded-full flex items-center justify-center mb-2">
              <Bot className="w-5 h-5 text-muted-foreground" />
            </div>
            <p className="text-xs text-muted-foreground">
              No hay transacciones recientes
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default FeedActividadAI;