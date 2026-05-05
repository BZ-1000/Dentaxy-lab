/**
 * useGeoZones.ts
 * Fetch y suscripción realtime de zonas geográficas desde Supabase.
 * Usado por GeoMap admin y DemoLinkCreator.
 */
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface GeoZone {
  id: string;
  name: string;
  lat: number;
  lng: number;
  radius_km: number;
  color: string;
  description?: string;
  is_active: boolean;
  created_at: string;
}

export function useGeoZones() {
  const [zones, setZones] = useState<GeoZone[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchZones = async () => {
    try {
      const { data, error } = await supabase
        .from('geo_zones')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: true });

      if (error) throw error;
      setZones(data || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const createZone = async (zone: Omit<GeoZone, 'id' | 'created_at'>) => {
    const { data, error } = await supabase
      .from('geo_zones')
      .insert(zone)
      .select()
      .single();
    if (error) throw error;
    return data;
  };

  const deleteZone = async (id: string) => {
    const { error } = await supabase
      .from('geo_zones')
      .update({ is_active: false })
      .eq('id', id);
    if (error) throw error;
  };

  const updateZone = async (id: string, updates: Partial<GeoZone>) => {
    const { error } = await supabase
      .from('geo_zones')
      .update(updates)
      .eq('id', id);
    if (error) throw error;
  };

  useEffect(() => {
    fetchZones();

    // Suscripción realtime — sincroniza entre admin/demos y admin/geomap
    const channel = supabase
      .channel('geo-zones-realtime')
      .on('postgres_changes',
        { event: '*', schema: 'public', table: 'geo_zones' },
        () => fetchZones()
      )
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, []);

  return { zones, isLoading, error, createZone, deleteZone, updateZone, refetch: fetchZones };
}
