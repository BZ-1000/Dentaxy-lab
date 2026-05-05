import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface LiveMetrics {
  activeUsers: number;
  copyClicks: number;
  donations: number;
  latestDonor?: { name: string; timestamp: string };
}

export const useLiveMetrics = () => {
  const [metrics, setMetrics] = useState<LiveMetrics>({
    activeUsers: 0,
    copyClicks: 0,
    donations: 0
  });
  const [loading, setLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState(Date.now());

  // Fetch initial metrics
  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        // Get platform metrics
        const { data: platformMetrics } = await supabase
          .from('platform_metrics')
          .select('metric_name, metric_value')
          .in('metric_name', ['active_users', 'copy_clicks']);

        // Get donations count and latest donor
        const { data: donationsData, count: donationsCount } = await supabase
          .from('donations')
          .select('donor_name, created_at', { count: 'exact' })
          .order('created_at', { ascending: false })
          .limit(1);

        // Process metrics
        const metricsMap = platformMetrics?.reduce((acc, metric) => {
          acc[metric.metric_name] = metric.metric_value;
          return acc;
        }, {} as Record<string, number>) || {};

        const latestDonor = donationsData?.[0] ? {
          name: donationsData[0].donor_name,
          timestamp: donationsData[0].created_at
        } : undefined;

        setMetrics({
          activeUsers: metricsMap.active_users || 0,
          copyClicks: metricsMap.copy_clicks || 0,
          donations: donationsCount || 0,
          latestDonor
        });
      } catch (error) {
        console.error('Error fetching metrics:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMetrics();

    // Refresh metrics every 30 seconds to ensure real-time data
    const interval = setInterval(fetchMetrics, 30000);

    // Set up real-time subscriptions for immediate updates
    const metricsChannel = supabase
      .channel('live-metrics-updates')
      .on('postgres_changes', {
        event: '*', // Listen to all events (INSERT, UPDATE, DELETE)
        schema: 'public',
        table: 'platform_metrics'
      }, (payload) => {
        console.log('Real-time metrics update:', payload);
        const { metric_name, metric_value } = payload.new as { metric_name: string; metric_value: number };
        
        setMetrics(prev => ({
          ...prev,
          [metric_name === 'active_users' ? 'activeUsers' : 'copyClicks']: metric_value
        }));
        setLastUpdate(Date.now());
      })
      .subscribe();

    const donationsChannel = supabase
      .channel('live-donations-updates')
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'donations'
      }, (payload) => {
        console.log('Real-time donation update:', payload);
        const newDonation = payload.new as { donor_name: string; created_at: string };
        setMetrics(prev => ({
          ...prev,
          donations: prev.donations + 1,
          latestDonor: {
            name: newDonation.donor_name,
            timestamp: newDonation.created_at
          }
        }));
        setLastUpdate(Date.now());
      })
      .subscribe();

    return () => {
      clearInterval(interval);
      supabase.removeChannel(metricsChannel);
      supabase.removeChannel(donationsChannel);
    };
  }, []);

  return { metrics, loading, lastUpdate };
};