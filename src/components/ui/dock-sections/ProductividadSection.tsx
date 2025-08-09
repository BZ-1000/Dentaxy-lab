import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip } from 'recharts';
import { TrendingUp, Activity, ArrowRight } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

export const ProductividadSection = () => {
  const { user } = useAuth();
  const [hoveredDataPoint, setHoveredDataPoint] = useState<any>(null);

  // Generar datos del mes actual para usuarios autenticados
  const currentMonthData = useMemo(() => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    
    return Array.from({ length: daysInMonth }, (_, i) => {
      const day = i + 1;
      const minutes = Math.floor(Math.random() * 45) + 5; // 5-50 minutos aleatorios
      return {
        day,
        date: `${day}`,
        minutes,
        formattedDate: `${day} ${new Date(currentYear, currentMonth, day).toLocaleDateString('es-ES', { month: 'short' })}`
      };
    });
  }, []);

  const totalMinutesToday = currentMonthData[currentMonthData.length - 1]?.minutes || 0;
  const currentMonthName = new Date().toLocaleDateString('es-ES', { month: 'long' });

  return (
    <Card className="shadow-sm h-full">
      <CardHeader className="pb-1">
        <CardTitle className="text-sm font-semibold flex items-center gap-2">
          <span className="bg-gray-100 rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold">1</span>
          Mi Productividad
        </CardTitle>
        <p className="text-xs text-gray-500">Si aún no inicias sesión no podras ver tu progreso</p>
      </CardHeader>
      <CardContent className="pt-0 p-3">
        {user ? (
          // Usuario autenticado - Mostrar gráfica funcional
          <>
            <div className="flex items-center justify-between mb-3">
              <div>
                <div className="text-xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                  {totalMinutesToday} min
                </div>
                <p className="text-xs text-gray-500 capitalize">{currentMonthName}</p>
              </div>
              <div className="text-right">
                <div className="flex items-center gap-1 text-xs text-green-600 font-medium">
                  <TrendingUp size={12} />
                  +12% vs mes anterior
                </div>
              </div>
            </div>
            <div className="h-20 relative">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart 
                  data={currentMonthData}
                  onMouseMove={(data) => {
                    if (data && data.activePayload) {
                      setHoveredDataPoint(data.activePayload[0]?.payload);
                    }
                  }}
                  onMouseLeave={() => setHoveredDataPoint(null)}
                >
                  <defs>
                    <linearGradient id="lineGradient" x1="0" y1="0" x2="1" y2="0">
                      <stop offset="0%" stopColor="#8b5cf6" />
                      <stop offset="50%" stopColor="#3b82f6" />
                      <stop offset="100%" stopColor="#06b6d4" />
                    </linearGradient>
                  </defs>
                  <XAxis 
                    dataKey="date" 
                    axisLine={false} 
                    tickLine={false} 
                    className="text-xs" 
                    interval="preserveStartEnd"
                  />
                  <YAxis hide />
                  <Tooltip 
                    content={({ active, payload }) => {
                      if (active && payload && payload[0]) {
                        const data = payload[0].payload;
                        return (
                          <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="bg-white/95 backdrop-blur-sm border border-gray-200 rounded-lg p-2 shadow-lg"
                          >
                            <p className="text-xs font-semibold text-gray-900">{data.formattedDate}</p>
                            <p className="text-xs text-purple-600 flex items-center gap-1">
                              <Activity size={10} />
                              {data.minutes} minutos
                            </p>
                          </motion.div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="minutes"
                    stroke="url(#lineGradient)"
                    strokeWidth={3}
                    dot={(props) => {
                      const { cx, cy, payload } = props;
                      return (
                        <motion.circle
                          cx={cx}
                          cy={cy}
                          r={hoveredDataPoint?.day === payload?.day ? 5 : 3}
                          fill="#8b5cf6"
                          stroke="#fff"
                          strokeWidth={2}
                          className="drop-shadow-sm"
                          animate={{
                            r: hoveredDataPoint?.day === payload?.day ? 5 : 3,
                            scale: hoveredDataPoint?.day === payload?.day ? 1.2 : 1,
                          }}
                          transition={{ duration: 0.2 }}
                        />
                      );
                    }}
                    activeDot={{
                      r: 6,
                      fill: '#8b5cf6',
                      stroke: '#fff',
                      strokeWidth: 3,
                    }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </>
        ) : (
          // Usuario no autenticado - Call to action
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center h-20 text-center"
          >
            <div className="mb-3">
              <div className="w-10 h-10 mx-auto mb-2 bg-gradient-to-br from-purple-500 to-blue-600 rounded-full flex items-center justify-center">
                <Activity className="w-5 h-5 text-white" />
              </div>
              <h4 className="text-sm font-bold text-gray-900 mb-1">
                Descubre tu verdadera eficiencia
              </h4>
              <p className="text-xs text-gray-600 leading-relaxed">
                Visualiza en tiempo real los minutos que dedicas a crear historias clínicas
              </p>
            </div>
            <Button 
              size="sm" 
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white text-xs px-4 py-1.5 h-auto shadow-lg hover:shadow-xl transition-all duration-300 group"
              onClick={() => window.location.href = '/auth/register'}
            >
              Regístrate Gratis
              <ArrowRight className="w-3 h-3 ml-1 group-hover:translate-x-0.5 transition-transform" />
            </Button>
          </motion.div>
        )}
      </CardContent>
    </Card>
  );
};