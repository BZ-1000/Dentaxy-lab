import { useState, useEffect } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { AreaChart, Area, XAxis, YAxis, ResponsiveContainer, LineChart, Line, Tooltip } from 'recharts';
import { useRef } from 'react';

// Animated Number Component
const AnimatedNumber = ({ value, label }: { value: number; label: string }) => {
  const [displayValue, setDisplayValue] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (isInView) {
      const timer = setInterval(() => {
        setDisplayValue(prev => {
          if (prev < value) {
            return Math.min(prev + Math.ceil((value - prev) / 10), value);
          }
          return value;
        });
      }, 100);

      return () => clearInterval(timer);
    }
  }, [isInView, value]);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6 }}
      className="text-center"
    >
      <div className="text-4xl font-bold text-primary mb-2">
        {displayValue.toLocaleString()}
      </div>
      <div className="text-sm text-muted-foreground">{label}</div>
    </motion.div>
  );
};

// Custom Tooltip
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-card border border-border rounded-lg p-3 shadow-lg">
        <p className="text-sm font-medium">{`Mes ${label}`}</p>
        {payload.map((entry: any, index: number) => (
          <p key={index} className="text-sm" style={{ color: entry.color }}>
            {`${entry.dataKey}: ${entry.value}${entry.dataKey === 'tiempo' ? ' min' : '%'}`}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

// Main Statistics Content Component
export const StatisticsContent = () => {
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        delay: 0.2, 
        duration: 0.6, 
        ease: "easeOut"
      }
    }
  };

  // Sample data for area chart
  const timeComparisonData = [
    { month: 'Ene', tradicional: 120, dentaxy: 36 },
    { month: 'Feb', tradicional: 115, dentaxy: 34 },
    { month: 'Mar', tradicional: 118, dentaxy: 35 },
    { month: 'Abr', tradicional: 122, dentaxy: 37 },
    { month: 'May', tradicional: 119, dentaxy: 36 },
    { month: 'Jun', tradicional: 116, dentaxy: 35 },
  ];

  // Sample data for performance chart
  const performanceData = [
    { month: 'Ene', precision: 92, velocidad: 75 },
    { month: 'Feb', precision: 94, velocidad: 78 },
    { month: 'Mar', precision: 95, velocidad: 82 },
    { month: 'Abr', precision: 96, velocidad: 85 },
    { month: 'May', precision: 97, velocidad: 88 },
    { month: 'Jun', precision: 98, velocidad: 92 },
  ];

  return (
    <div className="p-6 space-y-8">
      {/* KPI Cards */}
      <motion.div 
        variants={cardVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        <Card className="p-6">
          <CardContent className="p-0">
            <AnimatedNumber value={1247} label="Usuarios Activos" />
          </CardContent>
        </Card>
        
        <Card className="p-6">
          <CardContent className="p-0">
            <AnimatedNumber value={5890} label="Generaciones Hoy" />
          </CardContent>
        </Card>
        
        <Card className="p-6">
          <CardContent className="p-0">
            <AnimatedNumber value={1950} label="Horas Ahorradas" />
          </CardContent>
        </Card>
        
        <Card className="p-6">
          <CardContent className="p-0">
            <AnimatedNumber value={97} label="Precisión IA %" />
          </CardContent>
        </Card>
      </motion.div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Time Comparison Chart */}
        <motion.div
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.4 }}
        >
          <Card className="p-6">
            <CardContent className="p-0">
              <h3 className="text-lg font-semibold mb-4">Tiempo por Historia Clínica</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={timeComparisonData}>
                    <defs>
                      <linearGradient id="colorTradicional" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="colorDentaxy" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip content={<CustomTooltip />} />
                    <Area 
                      type="monotone" 
                      dataKey="tradicional" 
                      stackId="1"
                      stroke="#ef4444" 
                      fillOpacity={1} 
                      fill="url(#colorTradicional)" 
                    />
                    <Area 
                      type="monotone" 
                      dataKey="dentaxy" 
                      stackId="2"
                      stroke="#10b981" 
                      fillOpacity={1} 
                      fill="url(#colorDentaxy)" 
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Performance Chart */}
        <motion.div
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.6 }}
        >
          <Card className="p-6">
            <CardContent className="p-0">
              <h3 className="text-lg font-semibold mb-4">Rendimiento del Sistema</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={performanceData}>
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip content={<CustomTooltip />} />
                    <Line 
                      type="monotone" 
                      dataKey="precision" 
                      stroke="#8b5cf6" 
                      strokeWidth={2}
                      dot={{ fill: '#8b5cf6', strokeWidth: 2, r: 4 }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="velocidad" 
                      stroke="#06b6d4" 
                      strokeWidth={2}
                      dot={{ fill: '#06b6d4', strokeWidth: 2, r: 4 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Comparison Section */}
      <motion.div
        variants={cardVariants}
        initial="hidden"
        animate="visible"
        transition={{ delay: 0.8 }}
      >
        <Card className="p-6">
          <CardContent className="p-0">
            <h3 className="text-lg font-semibold mb-6">Comparación de Costos</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="border border-border rounded-lg p-4">
                <h4 className="font-medium text-center mb-3">Dentaxy AI</h4>
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">$29</div>
                  <div className="text-sm text-muted-foreground">por mes</div>
                </div>
                <div className="mt-4 space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span>Historias clínicas ilimitadas</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span>IA especializada en odontología</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span>Soporte técnico prioritario</span>
                  </div>
                </div>
              </div>

              <div className="border border-border rounded-lg p-4 opacity-60">
                <h4 className="font-medium text-center mb-3">IA Genérica</h4>
                <div className="text-center">
                  <div className="text-2xl font-bold">$20</div>
                  <div className="text-sm text-muted-foreground">por mes</div>
                </div>
                <div className="mt-4 space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                    <span>Uso limitado</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                    <span>No especializada</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                    <span>Sin soporte específico</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};