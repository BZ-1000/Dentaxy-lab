import { useState, useEffect, useCallback } from 'react';
import { Appointment } from '@/types/sidebar';
import { useToast } from '@/hooks/use-toast';

const STORAGE_KEY = 'dentaxy_appointments';

export const useAppointments = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  // Load appointments from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setAppointments(JSON.parse(stored));
      }
    } catch (error) {
      console.error('Error loading appointments:', error);
      toast({
        title: 'Error',
        description: 'No se pudieron cargar las citas',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  // Save to localStorage whenever appointments change
  const saveAppointments = useCallback((newAppointments: Appointment[]) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newAppointments));
      setAppointments(newAppointments);
    } catch (error) {
      console.error('Error saving appointments:', error);
      toast({
        title: 'Error',
        description: 'No se pudieron guardar las citas',
        variant: 'destructive',
      });
    }
  }, [toast]);

  const addAppointment = useCallback((appointment: Omit<Appointment, 'id' | 'created_at'>) => {
    const newAppointment: Appointment = {
      ...appointment,
      id: crypto.randomUUID(),
      created_at: new Date().toISOString(),
    };
    saveAppointments([...appointments, newAppointment]);
    toast({
      title: 'Cita creada',
      description: `Cita programada para ${appointment.patient_name}`,
    });
  }, [appointments, saveAppointments, toast]);

  const updateAppointment = useCallback((id: string, updates: Partial<Appointment>) => {
    const updated = appointments.map(apt =>
      apt.id === id ? { ...apt, ...updates } : apt
    );
    saveAppointments(updated);
    toast({
      title: 'Cita actualizada',
      description: 'Los cambios se guardaron correctamente',
    });
  }, [appointments, saveAppointments, toast]);

  const deleteAppointment = useCallback((id: string) => {
    const filtered = appointments.filter(apt => apt.id !== id);
    saveAppointments(filtered);
    toast({
      title: 'Cita eliminada',
      description: 'La cita se eliminó correctamente',
    });
  }, [appointments, saveAppointments, toast]);

  const getAppointmentsByDate = useCallback((date: string) => {
    return appointments.filter(apt => apt.date === date);
  }, [appointments]);

  const getTodayAppointments = useCallback(() => {
    const today = new Date().toISOString().split('T')[0];
    return getAppointmentsByDate(today);
  }, [getAppointmentsByDate]);

  return {
    appointments,
    loading,
    addAppointment,
    updateAppointment,
    deleteAppointment,
    getAppointmentsByDate,
    getTodayAppointments,
  };
};
