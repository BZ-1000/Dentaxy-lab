import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Calendar, Users, Zap } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useDashboardMetrics } from '@/hooks/useDashboardMetrics';

interface PlatformUpdate {
  id: string;
  version: string;
  title: string;
  description: string;
  release_date: string;
}

interface TopUser {
  userId: string;
  totalMinutes: number;
}

const EventosActualizaciones = () => {
  const { fetchTopUsers } = useDashboardMetrics();
  const [updates, setUpdates] = useState<PlatformUpdate[]>([]);
  const [topUsers, setTopUsers] = useState<TopUser[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      // Load platform updates
      const { data: updatesData } = await supabase
        .from('platform_updates')
        .select('*')
        .order('release_date', { ascending: false })
        .limit(5);

      if (updatesData) {
        setUpdates(updatesData);
      }

      // Load top users
      const topUsersData = await fetchTopUsers();
      setTopUsers(topUsersData.slice(0, 5));
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const formatUserId = (userId: string) => {
    return userId.substring(0, 8);
  };

  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  if (loading) {
    return (
      <Card className="h-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            Eventos y Actualizaciones
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="space-y-2">
              <div className="h-4 bg-muted rounded animate-pulse"></div>
              <div className="h-3 bg-muted rounded animate-pulse w-2/3"></div>
              <div className="h-3 bg-muted rounded animate-pulse w-1/2"></div>
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
          <Calendar className="h-4 w-4" />
          Updates & Events
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Recent Updates */}
        <div className="space-y-2">
          {updates.slice(0, 3).map((update, index) => (
            <div 
              key={update.id}
              className="p-2 rounded-lg border bg-card/30 hover:bg-card/50 transition-colors"
            >
              <div className="flex items-center justify-between mb-1">
                <Badge variant="outline" className="text-xs">
                  v{update.version}
                </Badge>
                <span className="text-xs text-muted-foreground">
                  {formatDate(update.release_date)}
                </span>
              </div>
              <h5 className="text-xs font-medium text-foreground mb-1">
                {update.title}
              </h5>
              <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
                {update.description}
              </p>
            </div>
          ))}
          
          {updates.length === 0 && (
            <div className="text-center py-4">
              <p className="text-xs text-muted-foreground">
                No hay actualizaciones
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default EventosActualizaciones;