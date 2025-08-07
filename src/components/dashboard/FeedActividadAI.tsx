import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useDashboardMetrics } from '@/hooks/useDashboardMetrics';
import { Bot, Sparkles } from 'lucide-react';
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
          Actividad de la IA
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 max-h-96 overflow-y-auto">
        {activities.length > 0 ? (
          activities.map((activity, index) => (
            <div 
              key={index}
              className="flex items-start gap-3 p-3 rounded-lg border bg-card/50 hover:bg-card transition-colors animate-fade-in"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                <Sparkles className="w-4 h-4 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-foreground leading-relaxed">
                  Dentaxy generó y redactó el apartado{' '}
                  <span className="font-medium text-primary">
                    '{activity.section_name}'
                  </span>{' '}
                  para el usuario{' '}
                  <span className="font-mono text-xs bg-muted px-1 py-0.5 rounded">
                    {formatUserId(activity.user_id)}
                  </span>
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  {formatTime(activity.clicked_at)}
                </p>
              </div>
            </div>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center mb-3">
              <Bot className="w-6 h-6 text-muted-foreground" />
            </div>
            <p className="text-sm text-muted-foreground">
              No hay actividad reciente
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Las generaciones de IA aparecerán aquí
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default FeedActividadAI;