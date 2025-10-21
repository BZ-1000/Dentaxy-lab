import { useState } from 'react';
import { Calendar as CalendarIcon, Plus } from 'lucide-react';
import { BaseOverlay } from './BaseOverlay';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar } from '@/components/ui/calendar';
import { useAppointments } from '@/hooks/useAppointments';
import { AppointmentsList } from '../calendar/AppointmentsList';
import { AppointmentForm } from '../calendar/AppointmentForm';

interface AgendaOverlayProps {
  open: boolean;
  onClose: () => void;
}

export const AgendaOverlay = ({ open, onClose }: AgendaOverlayProps) => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [showForm, setShowForm] = useState(false);
  const { appointments, getAppointmentsByDate } = useAppointments();

  const selectedDateStr = selectedDate.toISOString().split('T')[0];
  const dayAppointments = getAppointmentsByDate(selectedDateStr);

  return (
    <BaseOverlay open={open} onClose={onClose} title="Agenda / Citas" icon={CalendarIcon}>
      {showForm ? (
        <AppointmentForm 
          selectedDate={selectedDate}
          onClose={() => setShowForm(false)}
        />
      ) : (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-lg font-semibold">
                {selectedDate.toLocaleDateString('es-MX', { 
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </h3>
              <p className="text-sm text-muted-foreground">
                {dayAppointments.length} {dayAppointments.length === 1 ? 'cita' : 'citas'} programadas
              </p>
            </div>
            <Button onClick={() => setShowForm(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Nueva Cita
            </Button>
          </div>

          <Tabs defaultValue="day" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="day">Día</TabsTrigger>
              <TabsTrigger value="week">Semana</TabsTrigger>
              <TabsTrigger value="month">Mes</TabsTrigger>
            </TabsList>
            
            <TabsContent value="day" className="space-y-4">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="flex justify-center">
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={(date) => date && setSelectedDate(date)}
                    className="rounded-md border"
                  />
                </div>
                <AppointmentsList 
                  appointments={dayAppointments}
                  selectedDate={selectedDate}
                />
              </div>
            </TabsContent>
            
            <TabsContent value="week">
              <p className="text-center text-muted-foreground py-8">
                Vista semanal - Próximamente
              </p>
            </TabsContent>
            
            <TabsContent value="month">
              <div className="flex justify-center">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={(date) => date && setSelectedDate(date)}
                  className="rounded-md border"
                />
              </div>
            </TabsContent>
          </Tabs>
        </div>
      )}
    </BaseOverlay>
  );
};
