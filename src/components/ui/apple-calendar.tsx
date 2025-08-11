import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Calendar, Activity, Zap } from 'lucide-react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isToday, isYesterday, parseISO, addMonths, subMonths, isSameDay } from 'date-fns';
import { es } from 'date-fns/locale';
import { useTimeTracker } from '@/hooks/useTimeTracker';

interface CalendarDay {
  date: Date;
  minutes: number;
  isCurrentMonth: boolean;
  isToday: boolean;
  isSelected: boolean;
}

interface AppleCalendarProps {
  onDateSelect?: (date: Date, minutes: number) => void;
  showProductivityData?: boolean;
}

export const AppleCalendar: React.FC<AppleCalendarProps> = ({ 
  onDateSelect, 
  showProductivityData = true 
}) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const { weeklyData, totalTodayMinutes, currentSessionMinutes } = useTimeTracker();

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  
  // Generar datos mock de productividad para el mes completo
  const generateMonthlyData = useMemo(() => {
    const days = eachDayOfInterval({ start: monthStart, end: monthEnd });
    const monthlyData = new Map();
    
    // Usar datos reales de la semana cuando estén disponibles
    weeklyData.forEach((day, index) => {
      const dayDate = new Date();
      dayDate.setDate(dayDate.getDate() - (6 - index));
      const key = format(dayDate, 'yyyy-MM-dd');
      monthlyData.set(key, day.minutes);
    });
    
    // Generar datos mock para el resto del mes
    days.forEach(day => {
      const key = format(day, 'yyyy-MM-dd');
      if (!monthlyData.has(key)) {
        const isWeekend = day.getDay() === 0 || day.getDay() === 6;
        const baseMinutes = isWeekend ? 15 : 45;
        const randomVariation = Math.random() * 60;
        monthlyData.set(key, Math.round(baseMinutes + randomVariation));
      }
    });
    
    return monthlyData;
  }, [currentDate, weeklyData]);

  const calendarDays = useMemo(() => {
    const start = new Date(monthStart);
    start.setDate(start.getDate() - start.getDay());
    
    const end = new Date(monthEnd);
    end.setDate(end.getDate() + (6 - end.getDay()));
    
    return eachDayOfInterval({ start, end }).map(date => {
      const key = format(date, 'yyyy-MM-dd');
      const minutes = generateMonthlyData.get(key) || 0;
      
      return {
        date,
        minutes: isToday(date) ? totalTodayMinutes + currentSessionMinutes : minutes,
        isCurrentMonth: isSameMonth(date, currentDate),
        isToday: isToday(date),
        isSelected: selectedDate ? isSameDay(date, selectedDate) : false,
      };
    });
  }, [currentDate, selectedDate, generateMonthlyData, totalTodayMinutes, currentSessionMinutes]);

  const getIntensityColor = (minutes: number) => {
    if (minutes === 0) return 'bg-slate-100';
    if (minutes < 30) return 'bg-blue-200';
    if (minutes < 60) return 'bg-blue-400';
    if (minutes < 90) return 'bg-blue-600';
    return 'bg-blue-800';
  };

  const getIntensityGradient = (minutes: number) => {
    if (minutes === 0) return 'linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%)';
    if (minutes < 30) return 'linear-gradient(135deg, #dbeafe 0%, #93c5fd 100%)';
    if (minutes < 60) return 'linear-gradient(135deg, #60a5fa 0%, #3b82f6 100%)';
    if (minutes < 90) return 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)';
    return 'linear-gradient(135deg, #1e40af 0%, #1e3a8a 100%)';
  };

  const handleDateClick = (day: CalendarDay) => {
    setSelectedDate(day.date);
    onDateSelect?.(day.date, day.minutes);
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => direction === 'next' ? addMonths(prev, 1) : subMonths(prev, 1));
  };

  const weekDays = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];

  const selectedDayData = selectedDate ? calendarDays.find(day => isSameDay(day.date, selectedDate)) : null;

  return (
    <Card className="h-full flex flex-col bg-gradient-to-br from-white via-slate-50/50 to-blue-50/30 border-0 shadow-2xl shadow-blue-500/10 overflow-hidden">
      {/* Header */}
      <CardHeader className="pb-3 px-4 pt-4 flex-shrink-0">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-semibold flex items-center gap-2 text-foreground">
            <motion.div
              className="w-4 h-4 bg-gradient-to-br from-primary to-primary/70 rounded-full flex items-center justify-center"
              whileHover={{ rotate: 180 }}
              transition={{ duration: 0.3 }}
            >
              <Calendar className="w-2 h-2 text-primary-foreground" />
            </motion.div>
            Calendario de Productividad
          </CardTitle>
        </div>
        
        {/* Month Navigation */}
        <div className="flex items-center justify-between mt-3">
          <motion.h3 
            className="text-lg font-bold text-slate-800"
            key={format(currentDate, 'yyyy-MM')}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
          >
            {format(currentDate, 'MMMM yyyy', { locale: es })}
          </motion.h3>
          
          <div className="flex gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigateMonth('prev')}
              className="w-8 h-8 p-0 hover:bg-blue-100"
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigateMonth('next')}
              className="w-8 h-8 p-0 hover:bg-blue-100"
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="flex-1 px-4 pb-4 pt-0 flex flex-col">
        {/* Weekday Headers */}
        <div className="grid grid-cols-7 gap-1 mb-2">
          {weekDays.map(day => (
            <div key={day} className="text-center text-xs font-semibold text-slate-600 py-2">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-1 flex-1">
          <AnimatePresence mode="wait">
            {calendarDays.map((day, index) => (
              <motion.button
                key={`${format(day.date, 'yyyy-MM-dd')}`}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ delay: index * 0.01, duration: 0.2 }}
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleDateClick(day)}
                className={`
                  aspect-square relative rounded-lg text-xs font-medium transition-all duration-200
                  ${day.isCurrentMonth ? 'text-slate-800' : 'text-slate-400'}
                  ${day.isSelected ? 'ring-2 ring-blue-500 ring-offset-1' : ''}
                  ${day.isToday ? 'ring-2 ring-emerald-500 ring-offset-1' : ''}
                  hover:shadow-md
                `}
                style={{
                  background: day.isCurrentMonth ? getIntensityGradient(day.minutes) : 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)'
                }}
              >
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className={`text-xs font-bold ${day.minutes > 60 ? 'text-white' : ''}`}>
                    {format(day.date, 'd')}
                  </span>
                  {showProductivityData && day.isCurrentMonth && day.minutes > 0 && (
                    <div className={`text-xs font-medium mt-0.5 ${day.minutes > 60 ? 'text-white/90' : 'text-slate-600'}`}>
                      {day.minutes}m
                    </div>
                  )}
                  {day.isToday && (
                    <motion.div
                      className="absolute -top-1 -right-1 w-2 h-2 bg-emerald-500 rounded-full"
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    />
                  )}
                </div>
              </motion.button>
            ))}
          </AnimatePresence>
        </div>

        {/* Selected Day Info */}
        <AnimatePresence>
          {selectedDayData && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="mt-3 p-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-100"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-slate-800">
                    {format(selectedDayData.date, 'dd MMMM yyyy', { locale: es })}
                    {selectedDayData.isToday && ' (Hoy)'}
                  </h4>
                  <div className="flex items-center gap-2 mt-1">
                    <Activity className="w-3 h-3 text-blue-600" />
                    <span className="text-sm font-semibold text-blue-700">
                      {selectedDayData.minutes} minutos
                    </span>
                    {selectedDayData.isToday && currentSessionMinutes > 0 && (
                      <div className="flex items-center gap-1 bg-emerald-100 text-emerald-700 px-2 py-1 rounded-full text-xs font-semibold">
                        <Zap className="w-3 h-3" />
                        +{currentSessionMinutes}m activo
                      </div>
                    )}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold text-blue-600">
                    {selectedDayData.minutes === 0 ? '💤' :
                     selectedDayData.minutes < 30 ? '🌱' :
                     selectedDayData.minutes < 60 ? '⚡' : '🏆'}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Productivity Legend */}
        {showProductivityData && (
          <div className="mt-3 flex items-center gap-2 text-xs">
            <span className="text-slate-600 font-medium">Productividad:</span>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded bg-slate-100"></div>
              <span className="text-slate-500">0m</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded bg-blue-200"></div>
              <span className="text-slate-500">30m</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded bg-blue-600"></div>
              <span className="text-slate-500">60m+</span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};