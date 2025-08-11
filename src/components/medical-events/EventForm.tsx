import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useMedicalEvents } from '@/hooks/useMedicalEvents';
import { format } from 'date-fns';

const eventFormSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  event_type: z.enum(['appointment', 'reminder', 'followup', 'treatment', 'consultation']),
  event_date: z.string().min(1, 'Date and time are required'),
  patient_info: z.object({
    name: z.string().optional(),
    phone: z.string().optional(),
  }).optional(),
});

type EventFormData = z.infer<typeof eventFormSchema>;

interface EventFormProps {
  selectedDate: Date;
  onSuccess: () => void;
}

export const EventForm: React.FC<EventFormProps> = ({ selectedDate, onSuccess }) => {
  const { createEvent } = useMedicalEvents();
  
  const form = useForm<EventFormData>({
    resolver: zodResolver(eventFormSchema),
    defaultValues: {
      title: '',
      description: '',
      event_type: 'appointment',
      event_date: format(selectedDate, "yyyy-MM-dd'T'HH:mm"),
      patient_info: {
        name: '',
        phone: '',
      },
    },
  });

  const onSubmit = async (data: EventFormData) => {
    const eventData = {
      title: data.title,
      description: data.description || '',
      event_type: data.event_type,
      event_date: new Date(data.event_date).toISOString(),
      patient_info: data.patient_info || {},
      notification_settings: { enabled: true, advance_minutes: [30, 1440] },
      is_completed: false,
    };

    const result = await createEvent(eventData);
    if (result) {
      onSuccess();
      form.reset();
    }
  };

  return (
    <>
      <DialogHeader>
        <DialogTitle>Create Medical Event</DialogTitle>
      </DialogHeader>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Title</FormLabel>
                <FormControl>
                  <Input placeholder="Enter event title" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="event_type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Type</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select event type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="appointment">Appointment</SelectItem>
                    <SelectItem value="reminder">Reminder</SelectItem>
                    <SelectItem value="followup">Follow-up</SelectItem>
                    <SelectItem value="treatment">Treatment</SelectItem>
                    <SelectItem value="consultation">Consultation</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="event_date"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Date & Time</FormLabel>
                <FormControl>
                  <Input type="datetime-local" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder="Enter event description (optional)"
                    rows={3}
                    {...field} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="patient_info.name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Patient Name (Optional)</FormLabel>
                <FormControl>
                  <Input placeholder="Enter patient name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="patient_info.phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Patient Phone (Optional)</FormLabel>
                <FormControl>
                  <Input placeholder="Enter patient phone" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={onSuccess}>
              Cancel
            </Button>
            <Button type="submit" disabled={form.formState.isSubmitting}>
              {form.formState.isSubmitting ? 'Creating...' : 'Create Event'}
            </Button>
          </div>
        </form>
      </Form>
    </>
  );
};