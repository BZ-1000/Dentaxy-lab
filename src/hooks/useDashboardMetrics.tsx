import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface PlatformMetrics {
  activeUsers: number;
  totalUsers: number;
  aiGenerationsCount: number;
}

interface ActivityData {
  date: string;
  minutes: number;
}

export const useDashboardMetrics = () => {
  const [metrics, setMetrics] = useState<PlatformMetrics>({
    activeUsers: 0,
    totalUsers: 0,
    aiGenerationsCount: 0
  });
  const [loading, setLoading] = useState(true);

  const fetchMetrics = async () => {
    try {
      // Get platform metrics
      const { data: platformMetrics } = await supabase
        .from('platform_metrics')
        .select('metric_name, metric_value');

      if (platformMetrics) {
        const metricsMap = platformMetrics.reduce((acc, metric) => {
          acc[metric.metric_name] = metric.metric_value;
          return acc;
        }, {} as Record<string, number>);

        setMetrics({
          activeUsers: metricsMap.active_users || 0,
          totalUsers: metricsMap.total_users || 0,
          aiGenerationsCount: metricsMap.ai_generations_count || 0
        });
      }
    } catch (error) {
      console.error('Error fetching metrics:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserActivityData = async (userId: string): Promise<ActivityData[]> => {
    try {
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      const { data } = await supabase
        .from('user_activity_sessions')
        .select('date, duration_minutes')
        .eq('user_id', userId)
        .gte('date', thirtyDaysAgo.toISOString().split('T')[0])
        .order('date', { ascending: true });

      if (!data) return [];

      // Group by date and sum minutes
      const groupedData = data.reduce((acc, session) => {
        const date = session.date;
        if (!acc[date]) {
          acc[date] = 0;
        }
        acc[date] += session.duration_minutes || 0;
        return acc;
      }, {} as Record<string, number>);

      // Convert to array format
      return Object.entries(groupedData).map(([date, minutes]) => ({
        date,
        minutes
      }));
    } catch (error) {
      console.error('Error fetching user activity data:', error);
      return [];
    }
  };

  const fetchRecentAIActivity = async () => {
    try {
      const { data } = await supabase
        .from('ai_button_usage')
        .select('section_name, user_id, clicked_at')
        .order('clicked_at', { ascending: false })
        .limit(10);

      return data || [];
    } catch (error) {
      console.error('Error fetching AI activity:', error);
      return [];
    }
  };

  const fetchTopUsers = async () => {
    try {
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      const { data } = await supabase
        .from('user_activity_sessions')
        .select('user_id, duration_minutes')
        .gte('date', thirtyDaysAgo.toISOString().split('T')[0]);

      if (!data) return [];

      // Group by user and sum minutes
      const userTotals = data.reduce((acc, session) => {
        const userId = session.user_id;
        if (!acc[userId]) {
          acc[userId] = 0;
        }
        acc[userId] += session.duration_minutes || 0;
        return acc;
      }, {} as Record<string, number>);

      // Convert to array and sort
      return Object.entries(userTotals)
        .map(([userId, totalMinutes]) => ({ userId, totalMinutes }))
        .sort((a, b) => b.totalMinutes - a.totalMinutes)
        .slice(0, 10);
    } catch (error) {
      console.error('Error fetching top users:', error);
      return [];
    }
  };

  useEffect(() => {
    fetchMetrics();

    // Set up real-time subscription for metrics
    const channel = supabase
      .channel('platform-metrics-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'platform_metrics'
        },
        () => {
          fetchMetrics();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return {
    metrics,
    loading,
    fetchUserActivityData,
    fetchRecentAIActivity,
    fetchTopUsers,
    refetchMetrics: fetchMetrics
  };
};