
import { useEffect, useMemo, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export type DailyActivityPoint = {
  activity_date: string; // YYYY-MM-DD (UTC)
  dayLabel: string;      // Lun 5
  seconds: number;       // total_seconds
  minutes: number;       // seconds / 60
};

type UseDailyActivityDataResult = {
  data7d: DailyActivityPoint[];
  todaySecondsFromDB: number;
  loading: boolean;
};

function toYYYYMMDDUTC(d: Date) {
  // Normaliza a fecha UTC YYYY-MM-DD
  const iso = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate())).toISOString();
  return iso.slice(0, 10);
}

function esDayLabel(d: Date) {
  const day = d.toLocaleDateString('es-ES', { weekday: 'short' });
  const num = d.getDate();
  return `${day.charAt(0).toUpperCase() + day.slice(1)} ${num}`;
}

export function useDailyActivityData(): UseDailyActivityDataResult {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [rows, setRows] = useState<{ activity_date: string; total_seconds: number }[]>([]);

  // Construir los últimos 7 días (hoy incluido) - siempre se ejecuta
  const last7Days = useMemo(() => {
    const arr: Date[] = [];
    const now = new Date();
    for (let i = 6; i >= 0; i--) {
      const d = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
      d.setUTCDate(d.getUTCDate() - i);
      arr.push(d);
    }
    return arr;
  }, []);

  // Fetch inicial - siempre se ejecuta
  useEffect(() => {
    if (!user?.id) {
      setRows([]);
      setLoading(false);
      return;
    }

    const startDate = toYYYYMMDDUTC(new Date(Date.now() - 6 * 24 * 60 * 60 * 1000));
    const fetchData = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('user_daily_activity')
        .select('activity_date,total_seconds')
        .eq('user_id', user.id)
        .gte('activity_date', startDate)
        .order('activity_date', { ascending: true });

      if (error) {
        console.error('fetch user_daily_activity error:', error);
        setRows([]);
        setLoading(false);
        return;
      }
      setRows(data || []);
      setLoading(false);
    };

    fetchData();
  }, [user?.id]);

  // Realtime: escuchar inserts/updates - siempre se ejecuta
  useEffect(() => {
    if (!user?.id) return;

    const channel = supabase
      .channel('user_daily_activity_changes')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'user_daily_activity',
        filter: `user_id=eq.${user.id}`,
      }, (payload) => {
        const newRow = (payload as any).new as { activity_date: string; total_seconds: number } | undefined;
        if (!newRow) return;

        setRows((prev) => {
          const idx = prev.findIndex((r) => r.activity_date === newRow.activity_date);
          if (idx >= 0) {
            const next = prev.slice();
            next[idx] = { activity_date: newRow.activity_date, total_seconds: newRow.total_seconds };
            return next;
          }
          return [...prev, { activity_date: newRow.activity_date, total_seconds: newRow.total_seconds }]
            .sort((a, b) => (a.activity_date < b.activity_date ? -1 : 1));
        });
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user?.id]);

  // Proyectar datos a la última semana completa
  const data7d: DailyActivityPoint[] = useMemo(() => {
    const map = new Map(rows.map(r => [r.activity_date, r.total_seconds]));
    return last7Days.map((d) => {
      const key = toYYYYMMDDUTC(d);
      const seconds = map.get(key) ?? 0;
      return {
        activity_date: key,
        dayLabel: esDayLabel(d),
        seconds,
        minutes: seconds / 60,
      };
    });
  }, [rows, last7Days]);

  const todayKey = toYYYYMMDDUTC(new Date());
  const todaySecondsFromDB = data7d.find(d => d.activity_date === todayKey)?.seconds ?? 0;

  return { data7d, todaySecondsFromDB, loading };
}
