import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';

export interface MedicalEvent {
  id: string;
  user_id: string;
  title: string;
  description?: string;
  event_date: string;
  event_type: 'appointment' | 'reminder' | 'followup' | 'treatment' | 'consultation';
  patient_info?: any;
  notification_settings?: any;
  is_completed: boolean;
  created_at: string;
  updated_at: string;
}

export const useMedicalEvents = () => {
  const [events, setEvents] = useState<MedicalEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchEvents();
    } else {
      setEvents([]);
      setLoading(false);
    }
  }, [user]);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('medical_events')
        .select('*')
        .order('event_date', { ascending: true });

      if (error) throw error;
      setEvents(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error loading events');
      toast({
        title: "Error",
        description: "Failed to load medical events",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const createEvent = async (eventData: Omit<MedicalEvent, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please log in to create events",
        variant: "destructive",
      });
      return null;
    }

    try {
      const { data, error } = await supabase
        .from('medical_events')
        .insert([{
          ...eventData,
          user_id: user.id,
        }])
        .select()
        .single();

      if (error) throw error;

      setEvents(prev => [...prev, data]);
      toast({
        title: "Event Created",
        description: "Medical event has been successfully created",
      });
      return data;
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to create medical event",
        variant: "destructive",
      });
      return null;
    }
  };

  const updateEvent = async (id: string, updates: Partial<MedicalEvent>) => {
    try {
      const { data, error } = await supabase
        .from('medical_events')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      setEvents(prev => prev.map(event => event.id === id ? data : event));
      toast({
        title: "Event Updated",
        description: "Medical event has been successfully updated",
      });
      return data;
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to update medical event",
        variant: "destructive",
      });
      return null;
    }
  };

  const deleteEvent = async (id: string) => {
    try {
      const { error } = await supabase
        .from('medical_events')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setEvents(prev => prev.filter(event => event.id !== id));
      toast({
        title: "Event Deleted",
        description: "Medical event has been successfully deleted",
      });
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to delete medical event",
        variant: "destructive",
      });
    }
  };

  const getEventsForDate = (date: Date) => {
    const dateStr = date.toISOString().split('T')[0];
    return events.filter(event => 
      event.event_date.startsWith(dateStr)
    );
  };

  return {
    events,
    loading,
    error,
    createEvent,
    updateEvent,
    deleteEvent,
    getEventsForDate,
    refetch: fetchEvents,
  };
};