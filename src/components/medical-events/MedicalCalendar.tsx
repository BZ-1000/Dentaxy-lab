import React, { useState } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, Calendar as CalendarIcon, Clock, User, Stethoscope } from 'lucide-react';
import { useMedicalEvents } from '@/hooks/useMedicalEvents';
import { useAuth } from '@/contexts/AuthContext';
import { EventForm } from './EventForm';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { motion, AnimatePresence } from 'framer-motion';
import { format } from 'date-fns';

const eventTypeIcons = {
  appointment: CalendarIcon,
  reminder: Clock,
  followup: User,
  treatment: Stethoscope,
  consultation: CalendarIcon,
};

const eventTypeColors = {
  appointment: 'bg-blue-500',
  reminder: 'bg-yellow-500', 
  followup: 'bg-green-500',
  treatment: 'bg-purple-500',
  consultation: 'bg-indigo-500',
};

export const MedicalCalendar = () => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [showEventForm, setShowEventForm] = useState(false);
  const { events, loading, getEventsForDate } = useMedicalEvents();
  const { user, subscription } = useAuth();

  const selectedDateEvents = getEventsForDate(selectedDate);
  const hasSubscription = subscription?.subscribed;

  // Get dates that have events for calendar indicators
  const eventDates = events.reduce((acc, event) => {
    const eventDate = new Date(event.event_date);
    const dateKey = format(eventDate, 'yyyy-MM-dd');
    if (!acc[dateKey]) acc[dateKey] = [];
    acc[dateKey].push(event);
    return acc;
  }, {} as Record<string, typeof events>);

  if (!user) {
    return (
      <Card className="h-full">
        <CardContent className="flex items-center justify-center h-full">
          <div className="text-center space-y-4">
            <CalendarIcon className="h-12 w-12 text-muted-foreground mx-auto" />
            <div>
              <h3 className="font-semibold">Medical Calendar</h3>
              <p className="text-sm text-muted-foreground">Please log in to access your medical calendar</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <CalendarIcon className="h-5 w-5" />
            Medical Calendar
          </CardTitle>
          {hasSubscription && (
            <Dialog open={showEventForm} onOpenChange={setShowEventForm}>
              <DialogTrigger asChild>
                <Button size="sm" className="gap-2">
                  <Plus className="h-4 w-4" />
                  Add Event
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <EventForm 
                  selectedDate={selectedDate}
                  onSuccess={() => setShowEventForm(false)}
                />
              </DialogContent>
            </Dialog>
          )}
        </div>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col space-y-4">
        {/* Calendar */}
        <div className="flex-shrink-0">
          <Calendar
            selected={selectedDate}
            onSelect={(date) => date && setSelectedDate(date)}
            className="w-full"
            size="sm"
          />
        </div>

        {/* Events for selected date */}
        <div className="flex-1 min-h-0">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <h4 className="font-medium text-sm">
                {format(selectedDate, 'MMMM d, yyyy')}
              </h4>
              {selectedDateEvents.length > 0 && (
                <Badge variant="secondary" className="text-xs">
                  {selectedDateEvents.length} event{selectedDateEvents.length > 1 ? 's' : ''}
                </Badge>
              )}
            </div>

            <div className="space-y-2 max-h-48 overflow-y-auto">
              <AnimatePresence>
                {selectedDateEvents.length > 0 ? (
                  selectedDateEvents.map((event, index) => {
                    const Icon = eventTypeIcons[event.event_type];
                    const colorClass = eventTypeColors[event.event_type];
                    
                    return (
                      <motion.div
                        key={event.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex items-start gap-3 p-3 rounded-lg border border-border/50 bg-card/50 hover:bg-accent/50 transition-colors"
                      >
                        <div className={`p-1.5 rounded-full ${colorClass} text-white flex-shrink-0`}>
                          <Icon className="h-3 w-3" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h5 className="font-medium text-sm line-clamp-1">{event.title}</h5>
                          {event.description && (
                            <p className="text-xs text-muted-foreground line-clamp-2 mt-1">
                              {event.description}
                            </p>
                          )}
                          <div className="flex items-center gap-2 mt-2">
                            <Badge variant="outline" className="text-xs capitalize">
                              {event.event_type}
                            </Badge>
                            <span className="text-xs text-muted-foreground">
                              {format(new Date(event.event_date), 'h:mm a')}
                            </span>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })
                ) : (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center py-8"
                  >
                    <CalendarIcon className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">No events scheduled</p>
                    {hasSubscription && (
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="mt-2"
                        onClick={() => setShowEventForm(true)}
                      >
                        <Plus className="h-4 w-4 mr-1" />
                        Add Event
                      </Button>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {!hasSubscription && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center p-4 rounded-lg border border-primary/20 bg-primary/5"
              >
                <div className="space-y-2">
                  <h5 className="font-medium text-sm">Upgrade to Premium</h5>
                  <p className="text-xs text-muted-foreground">
                    Create events, set reminders, and receive notifications with a premium subscription
                  </p>
                  <Button size="sm" variant="outline" className="mt-2">
                    Upgrade Now
                  </Button>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};