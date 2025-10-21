import { Appointment } from '@/types/sidebar';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface AppointmentsListProps {
  appointments: Appointment[];
  selectedDate: Date;
}

export const AppointmentsList = ({ appointments, selectedDate }: AppointmentsListProps) => {
  if (appointments.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <p>No hay citas programadas para este día</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {appointments.map((apt) => (
        <Card key={apt.id}>
          <CardContent className="pt-4">
            <div className="flex items-start justify-between">
              <div>
                <h4 className="font-medium">{apt.patient_name}</h4>
                <p className="text-sm text-muted-foreground">{apt.type}</p>
                {apt.notes && (
                  <p className="text-xs text-muted-foreground mt-1">{apt.notes}</p>
                )}
              </div>
              <Badge>{apt.time}</Badge>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
