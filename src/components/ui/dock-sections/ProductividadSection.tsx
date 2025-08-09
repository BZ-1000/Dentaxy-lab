import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell } from 'recharts';
import { TrendingUp, Activity, ArrowRight, Clock, Zap } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useTimeTracker } from '@/hooks/useTimeTracker';

export const ProductividadSection = () => {
  const { user } = useAuth();
  const { weeklyData, currentSessionMinutes, totalTodayMinutes, isTracking } = useTimeTracker();
  const [hoveredBar, setHoveredBar] = useState<number | null>(null);

  // Colores estilo Apple para las barras
  const getBarColor = (index: number, minutes: number) => {
    if (index === 6) { // Día actual
      return minutes > 0 ? '#007AFF' : '#E5E5EA';
    }
    if (minutes === 0) return '#E5E5EA';
    if (minutes < 30) return '#FF9500';
    if (minutes < 60) return '#34C759';
    return '#007AFF';
  };

  const maxMinutes = Math.max(...weeklyData.map(d => d.minutes), 120);
  const weekAverage = weeklyData.reduce((sum, d) => sum + d.minutes, 0) / 7;

  return (
    <Card className="shadow-sm h-full overflow-hidden bg-white">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-semibold flex items-center gap-2">
          <motion.span 
            className="bg-gradient-to-br from-primary to-primary/70 rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold text-primary-foreground shadow-sm"
            animate={{ scale: isTracking ? [1, 1.1, 1] : 1 }}
            transition={{ duration: 2, repeat: isTracking ? Infinity : 0 }}
          >
            1
          </motion.span>
          Mi Productividad
          {user && isTracking && (
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex items-center gap-1"
            >
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span className="text-xs text-muted-foreground">En vivo</span>
            </motion.div>
          )}
        </CardTitle>
        <p className="text-xs text-muted-foreground">
          {user ? "Últimos 7 días de actividad" : "Inicia sesión para ver tu progreso"}
        </p>
      </CardHeader>
      <CardContent className="pt-0 p-3">
        {user ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {/* Stats Header */}
            <div className="flex items-center justify-between mb-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <motion.div 
                    className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent"
                    key={totalTodayMinutes + currentSessionMinutes}
                    initial={{ scale: 1 }}
                    animate={{ scale: [1, 1.05, 1] }}
                    transition={{ duration: 0.3 }}
                  >
                    {totalTodayMinutes + currentSessionMinutes}
                  </motion.div>
                  <span className="text-sm text-muted-foreground font-medium">min hoy</span>
                  {isTracking && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="flex items-center gap-1 text-xs text-green-600 bg-green-50 px-2 py-1 rounded-full"
                    >
                      <Clock size={10} />
                      +{currentSessionMinutes}m
                    </motion.div>
                  )}
                </div>
                <p className="text-xs text-muted-foreground">
                  Promedio: {Math.round(weekAverage)}m/día
                </p>
              </div>
              <div className="text-right">
                <motion.div 
                  className="flex items-center gap-1 text-xs font-medium"
                  animate={{ 
                    color: weekAverage > 30 ? '#22c55e' : '#f59e0b'
                  }}
                >
                  <TrendingUp size={12} />
                  {weekAverage > 30 ? 'Excelente' : 'En progreso'}
                </motion.div>
                {isTracking && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex items-center gap-1 text-xs text-primary font-medium mt-1"
                  >
                    <Zap size={10} />
                    Activo
                  </motion.div>
                )}
              </div>
            </div>

            {/* Chart */}
            <div className="h-24 relative">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart 
                  data={weeklyData}
                  onMouseMove={(data) => {
                    if (data && data.activeTooltipIndex !== undefined) {
                      setHoveredBar(data.activeTooltipIndex);
                    }
                  }}
                  onMouseLeave={() => setHoveredBar(null)}
                  barCategoryGap="20%"
                >
                  <XAxis 
                    dataKey="dayName" 
                    axisLine={false} 
                    tickLine={false} 
                    className="text-xs" 
                    tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }}
                  />
                  <YAxis hide />
                  <Tooltip 
                    content={({ active, payload, label }) => {
                      if (active && payload && payload[0]) {
                        const data = payload[0].payload;
                        const isToday = label === weeklyData[6]?.dayName;
                        return (
                          <AnimatePresence>
                            <motion.div
                              initial={{ opacity: 0, scale: 0.8, y: 10 }}
                              animate={{ opacity: 1, scale: 1, y: 0 }}
                              exit={{ opacity: 0, scale: 0.8, y: 10 }}
                              className="bg-background/95 backdrop-blur-sm border border-border rounded-xl p-3 shadow-xl"
                            >
                              <div className="flex items-center gap-2 mb-1">
                                <div 
                                  className="w-3 h-3 rounded-full"
                                  style={{ backgroundColor: getBarColor(weeklyData.indexOf(data), data.minutes) }}
                                />
                                <p className="text-sm font-semibold text-foreground">
                                  {data.formattedDate}
                                  {isToday && ' (Hoy)'}
                                </p>
                              </div>
                              <p className="text-sm text-muted-foreground flex items-center gap-1">
                                <Activity size={12} />
                                {data.minutes} minutos
                                {isToday && currentSessionMinutes > 0 && (
                                  <span className="text-primary">
                                    (+{currentSessionMinutes}m activos)
                                  </span>
                                )}
                              </p>
                              {data.minutes > 0 && (
                                <div className="mt-1 text-xs text-muted-foreground">
                                  {data.minutes < 30 ? 'Buen inicio' : 
                                   data.minutes < 60 ? 'Muy productivo' : 
                                   'Excelente sesión'}
                                </div>
                              )}
                            </motion.div>
                          </AnimatePresence>
                        );
                      }
                      return null;
                    }}
                  />
                  <Bar 
                    dataKey="minutes" 
                    radius={[3, 3, 0, 0]}
                    maxBarSize={28}
                  >
                    {weeklyData.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={getBarColor(index, entry.minutes)}
                        style={{
                          filter: hoveredBar === index ? 'brightness(1.1)' : 'brightness(1)',
                          transition: 'all 0.2s ease-in-out'
                        }}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center py-6 text-center space-y-4"
          >
            <div className="space-y-3">
              <motion.div 
                className="w-12 h-12 mx-auto bg-gradient-to-br from-primary to-primary/70 rounded-2xl flex items-center justify-center shadow-lg"
                whileHover={{ scale: 1.05, rotate: 5 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <Activity className="w-6 h-6 text-primary-foreground" />
              </motion.div>
              <div>
                <h4 className="text-sm font-bold text-foreground mb-2">
                  Rastrea tu productividad en tiempo real
                </h4>
                <p className="text-xs text-muted-foreground leading-relaxed max-w-[200px] mx-auto">
                  Visualiza los minutos que dedicas a crear historias clínicas con gráficas estilo Apple
                </p>
              </div>
            </div>
            <Button 
              size="sm" 
              className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary text-primary-foreground text-xs px-6 py-2 h-auto shadow-lg hover:shadow-xl transition-all duration-300 group rounded-full"
              onClick={() => window.location.href = '/auth/register'}
            >
              <Clock className="w-3 h-3 mr-2" />
              Comenzar a Rastrear
              <ArrowRight className="w-3 h-3 ml-2 group-hover:translate-x-0.5 transition-transform" />
            </Button>
          </motion.div>
        )}
      </CardContent>
    </Card>
  );
};