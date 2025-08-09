
import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { TrendingUp, Activity, ArrowRight } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useDailyActivityData } from '@/hooks/useDailyActivityData';

export const ProductividadSection = () => {
  const { user } = useAuth();
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  
  // Llamar hook antes del early return para cumplir las reglas de React
  const { data7d, todaySecondsFromDB, loading } = useDailyActivityData();

  if (!user) {
    return (
      <Card className="shadow-sm h-full">
        <CardHeader className="pb-1">
          <CardTitle className="text-sm font-semibold flex items-center gap-2">
            <span className="bg-muted rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold">1</span>
            Mi Productividad
          </CardTitle>
          <p className="text-xs text-muted-foreground">Inicia sesión para ver tu progreso en tiempo real</p>
        </CardHeader>
        <CardContent className="pt-0 p-3">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center h-24 text-center"
          >
            <div className="mb-3">
              <div className="w-10 h-10 mx-auto mb-2 bg-gradient-to-br from-primary to-blue-500 rounded-full flex items-center justify-center shadow-sm">
                <Activity className="w-5 h-5 text-white" />
              </div>
              <h4 className="text-sm font-bold text-foreground mb-1">
                Descubre tu eficiencia real
              </h4>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Mira cuántos minutos acumulas creando historias clínicas
              </p>
            </div>
            <Button 
              size="sm" 
              className="bg-gradient-to-r from-primary to-blue-500 hover:from-primary/90 hover:to-blue-600 text-primary-foreground text-xs px-4 py-1.5 h-auto shadow-md hover:shadow-lg transition-all duration-300 group"
              onClick={() => (window.location.href = '/auth/register')}
            >
              Regístrate Gratis
              <ArrowRight className="w-3 h-3 ml-1 group-hover:translate-x-0.5 transition-transform" />
            </Button>
          </motion.div>
        </CardContent>
      </Card>
    );
  }

  // Usuario autenticado: usar los datos ya obtenidos
  
  // Obtenemos el buffer desde el componente global ActivityTracker
  const bufferSeconds = 0; // El tracking se maneja globalmente, aquí solo mostramos datos

  // Sumamos el buffer local (en vivo) para el día de hoy
  const todaySecondsLive = todaySecondsFromDB + bufferSeconds;
  const todayMinutesLive = todaySecondsLive / 60;

  const chartData = useMemo(() => {
    // Proyectamos la data, añadiendo el buffer al último punto (hoy)
    if (data7d.length === 0) return [];
    const lastIndex = data7d.length - 1;
    return data7d.map((d, idx) => {
      const seconds = idx === lastIndex ? d.seconds + bufferSeconds : d.seconds;
      return {
        ...d,
        minutes: seconds / 60,
      };
    });
  }, [data7d, bufferSeconds]);

  const currentMonthName = new Date().toLocaleDateString('es-ES', { month: 'long' });
  const totalMinutesTodayDisplay =
    todayMinutesLive < 10 ? todayMinutesLive.toFixed(1) : Math.floor(todayMinutesLive).toString();

  return (
    <Card className="shadow-sm h-full">
      <CardHeader className="pb-1">
        <CardTitle className="text-sm font-semibold flex items-center gap-2">
          <span className="bg-muted rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold">1</span>
          Mi Productividad
        </CardTitle>
        <p className="text-xs text-muted-foreground">Se actualiza automáticamente mientras usas la app</p>
      </CardHeader>
      <CardContent className="pt-0 p-3">
        {/* Encabezado con total de hoy */}
        <div className="flex items-center justify-between mb-3">
          <div>
            <div className="text-2xl font-bold bg-gradient-to-r from-primary to-blue-500 bg-clip-text text-transparent">
              {loading ? '—' : totalMinutesTodayDisplay} min
            </div>
            <p className="text-xs text-muted-foreground capitalize">{currentMonthName}</p>
          </div>
          <div className="text-right">
            <div className="flex items-center gap-1 text-xs text-emerald-600 font-medium">
              <TrendingUp size={12} />
              en vivo
            </div>
          </div>
        </div>

        {/* Gráfica 7 días - estilo Apple con barras */}
        <div className="h-28 relative">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart 
              data={chartData}
              onMouseMove={(state: any) => {
                if (state && state.activeTooltipIndex != null) {
                  setHoveredIndex(state.activeTooltipIndex);
                }
              }}
              onMouseLeave={() => setHoveredIndex(null)}
              barCategoryGap="20%"
            >
              <defs>
                <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="hsl(var(--primary))" />
                  <stop offset="50%" stopColor="hsl(var(--primary)/0.8)" />
                  <stop offset="100%" stopColor="hsl(var(--primary)/0.6)" />
                </linearGradient>
                <linearGradient id="barGradientHover" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="hsl(var(--primary)/0.9)" />
                  <stop offset="50%" stopColor="hsl(var(--primary)/0.7)" />
                  <stop offset="100%" stopColor="hsl(var(--primary)/0.5)" />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--muted-foreground)/0.15)" vertical={false} />
              <XAxis 
                dataKey="dayLabel" 
                axisLine={false} 
                tickLine={false} 
                className="text-[10px] md:text-xs fill-muted-foreground"
                interval="preserveStartEnd"
              />
              <YAxis 
                hide 
                domain={[0, (dataMax: number) => Math.max(5, Math.ceil(dataMax * 1.1))]}
              />
              <Tooltip 
                content={({ active, payload }) => {
                  if (active && payload && payload[0]) {
                    const d: any = payload[0].payload;
                    return (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        transition={{ duration: 0.15 }}
                        className="bg-background/95 backdrop-blur-sm border border-border rounded-lg px-3 py-2 shadow-lg"
                      >
                        <p className="text-xs font-semibold text-foreground">{d.dayLabel}</p>
                        <p className="text-xs text-primary flex items-center gap-1.5 mt-1">
                          <Activity size={12} />
                          {d.minutes < 10 ? d.minutes.toFixed(1) : Math.floor(d.minutes)} min
                        </p>
                      </motion.div>
                    );
                  }
                  return null;
                }}
                cursor={{ fill: 'transparent' }}
              />
              <Bar
                dataKey="minutes"
                fill="url(#barGradient)"
                radius={[3, 3, 0, 0]}
                isAnimationActive
                animationDuration={800}
                animationEasing="ease-out"
                shape={(props: any) => {
                  const { payload, x, y, width, height, index } = props;
                  const isHovered = hoveredIndex === index;
                  const isToday = index === chartData.length - 1;
                  
                  return (
                    <motion.rect
                      x={x}
                      y={y}
                      width={width}
                      height={height}
                      fill={isHovered ? "url(#barGradientHover)" : "url(#barGradient)"}
                      rx={3}
                      ry={3}
                      className={`drop-shadow-sm ${isToday ? 'opacity-100' : 'opacity-90'}`}
                      animate={{
                        scale: isHovered ? 1.05 : 1,
                        y: isHovered ? y - 2 : y,
                      }}
                      transition={{ duration: 0.2, ease: "easeOut" }}
                      style={{
                        filter: isToday ? 'drop-shadow(0 2px 4px hsl(var(--primary)/0.3))' : 'none',
                      }}
                    />
                  );
                }}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Lista compacta día — minutos */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-x-3 gap-y-1.5 mt-3">
          {chartData.map((d, idx) => (
            <motion.div
              key={d.activity_date}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.03 }}
              className="flex items-center justify-between text-[11px] md:text-xs"
            >
              <span className="text-muted-foreground">{d.dayLabel}</span>
              <span className="font-semibold text-foreground">
                {d.minutes < 10 ? d.minutes.toFixed(1) : Math.floor(d.minutes)} min
              </span>
            </motion.div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
