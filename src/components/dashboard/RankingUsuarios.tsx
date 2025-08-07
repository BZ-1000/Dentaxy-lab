import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Trophy, TrendingUp, Award, Users } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useDashboardMetrics } from '@/hooks/useDashboardMetrics';

interface TopUser {
  userId: string;
  totalMinutes: number;
}

const RankingUsuarios = () => {
  const { user } = useAuth();
  const { fetchTopUsers, fetchUserActivityData } = useDashboardMetrics();
  const [topUsers, setTopUsers] = useState<TopUser[]>([]);
  const [userPosition, setUserPosition] = useState<number | null>(null);
  const [userMinutes, setUserMinutes] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadRankingData();
  }, [user]);

  const loadRankingData = async () => {
    try {
      const topUsersData = await fetchTopUsers();
      setTopUsers(topUsersData);

      if (user) {
        const userData = await fetchUserActivityData(user.id);
        const totalMinutes = userData.reduce((sum, item) => sum + item.minutes, 0);
        setUserMinutes(totalMinutes);

        // Find user position
        const position = topUsersData.findIndex(u => u.userId === user.id) + 1;
        setUserPosition(position > 0 ? position : null);
      }
    } catch (error) {
      console.error('Error loading ranking data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getPositionMessage = () => {
    if (!user || !userPosition) {
      return "Comienza a usar la aplicación para aparecer en el ranking";
    }

    if (userPosition <= 3) {
      return `¡Felicidades! Te encuentras en el Top ${userPosition} de los usuarios más activos`;
    } else if (userPosition <= 10) {
      return `¡Excelente! Estás en el Top 10 de usuarios más activos`;
    } else {
      const percentage = Math.round((userPosition / topUsers.length) * 100);
      return `Sigue así, estás entre el ${100 - percentage}% de los usuarios más eficientes`;
    }
  };

  const getPositionIcon = () => {
    if (!userPosition) return TrendingUp;
    if (userPosition <= 3) return Trophy;
    return Award;
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
            <Trophy className="h-4 w-4" />
            Ranking de Top Users
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-4 bg-muted/50 rounded-lg">
            <div className="h-4 bg-muted rounded animate-pulse mb-2"></div>
            <div className="h-6 bg-muted rounded animate-pulse"></div>
          </div>
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-center gap-3 p-2 rounded">
              <div className="w-6 h-6 bg-muted rounded animate-pulse"></div>
              <div className="flex-1 h-4 bg-muted rounded animate-pulse"></div>
              <div className="h-4 w-12 bg-muted rounded animate-pulse"></div>
            </div>
          ))}
        </CardContent>
      </Card>
    );
  }

  const PositionIcon = getPositionIcon();

  return (
    <Card className="h-full">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-sm font-medium">
          <Users className="h-4 w-4" />
          Members
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {/* Current Date */}
        <div className="text-center p-3 bg-muted/30 rounded-lg">
          <div className="text-lg font-bold text-foreground">
            {new Date().getDate()}
          </div>
          <div className="text-xs text-muted-foreground">
            {new Date().toLocaleDateString('es-ES', { month: 'short', year: 'numeric' })}
          </div>
        </div>

        {/* Top Users List */}
        <div className="space-y-2">
          {topUsers.slice(0, 4).map((user, index) => (
            <div 
              key={user.userId}
              className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50 transition-colors"
            >
              <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                  <span className="text-xs font-bold text-primary-foreground">
                    {formatUserId(user.userId).charAt(0).toUpperCase()}
                  </span>
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground">
                  User {formatUserId(user.userId)}
                </p>
                <p className="text-xs text-muted-foreground">
                  {formatTime(user.totalMinutes)} this month
                </p>
              </div>
              {index === 0 && <Trophy className="w-4 h-4 text-yellow-500" />}
            </div>
          ))}
          
          {topUsers.length === 0 && (
            <div className="text-center py-6">
              <p className="text-xs text-muted-foreground">
                No hay miembros aún
              </p>
            </div>
          )}
          
          {topUsers.length > 0 && (
            <button className="w-full text-xs text-primary hover:text-primary/80 transition-colors pt-2">
              More
            </button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default RankingUsuarios;