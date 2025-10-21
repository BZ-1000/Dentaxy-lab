import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAppointments } from '@/hooks/useAppointments';

interface AppointmentFormProps {
  selectedDate: Date;
  onClose: () => void;
}

export const AppointmentForm = ({ selectedDate, onClose }: AppointmentFormProps) => {
  const { addAppointment } = useAppointments();
  const [patientName, setPatientName] = useState('');
  const [time, setTime] = useState('09:00');
  const [type, setType] = useState<'consulta' | 'revision' | 'limpieza' | 'cirugia' | 'urgencia'>('consulta');
  const [notes, setNotes] = useState('');

  const handleSubmit = () => {
    if (!patientName.trim()) return;

    const colors = {
      consulta: '#3B82F6',
      revision: '#10B981',
      limpieza: '#F59E0B',
      cirugia: '#EF4444',
      urgencia: '#F97316',
    };

    addAppointment({
      patient_name: patientName,
      date: selectedDate.toISOString().split('T')[0],
      time,
      type,
      notes,
      status: 'pendiente',
      color: colors[type],
    });

    onClose();
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Nueva Cita</h3>
      <Input
        placeholder="Nombre del paciente"
        value={patientName}
        onChange={(e) => setPatientName(e.target.value)}
      />
      <Input
        type="time"
        value={time}
        onChange={(e) => setTime(e.target.value)}
      />
      <Select value={type} onValueChange={(v: any) => setType(v)}>
        <SelectTrigger>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="consulta">🔵 Consulta</SelectItem>
          <SelectItem value="revision">🟢 Revisión</SelectItem>
          <SelectItem value="limpieza">🟡 Limpieza</SelectItem>
          <SelectItem value="cirugia">🔴 Cirugía</SelectItem>
          <SelectItem value="urgencia">🟠 Urgencia</SelectItem>
        </SelectContent>
      </Select>
      <Textarea
        placeholder="Notas adicionales (opcional)"
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
      />
      <div className="flex gap-2">
        <Button onClick={handleSubmit} className="flex-1">Guardar</Button>
        <Button variant="outline" onClick={onClose}>Cancelar</Button>
      </div>
    </div>
  );
};
