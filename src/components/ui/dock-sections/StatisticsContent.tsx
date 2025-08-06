import React, { useEffect, useState, useRef } from 'react';
import { motion, useInView, useAnimation } from 'framer-motion';
import { Users, Zap, FileText, Clock, Brain, Activity, TrendingUp, DollarSign, Sparkles, Target } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, AreaChart, Area, Tooltip, CartesianGrid } from 'recharts';

// --- DATOS DE EJEMPLO ---
const timeData = [
  { time: 'Mañana', 'Método Tradicional': 45, Dentaxy: 8 },
  { time: 'Mediodía', 'Método Tradicional': 50, Dentaxy: 9 },
  { time: 'Tarde', 'Método Tradicional': 48, Dentaxy: 7 },
  { time: 'Noche', 'Método Tradicional': 52, Dentaxy: 10 },
];

const performanceData = [
  { month: 'Ene', Precisión: 95.2, Velocidad: 88 },
  { month: 'Feb', Precisión: 97.1, Velocidad: 92 },
  { month: 'Mar', Precisión: 98.5, Velocidad: 95 },
  { month: 'Abr', Precisión: 99.1, Velocidad: 97 },
];

// --- COMPONENTE AUXILIAR PARA NÚMEROS ANIMADOS ---
const AnimatedNumber = ({ value, isInt = true }: { value: number; isInt?: boolean }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    if (isInView) {
      let start = 0;
      const end = value;
      const duration = 1500;
      const frameDuration = 1000 / 60;
      const totalFrames = Math.round(duration / frameDuration);
      const increment = (end - start) / totalFrames;

      let currentFrame = 0;
      const timer = setInterval(() => {
        currentFrame++;
        const newValue = start + increment * currentFrame;
        if (currentFrame >= totalFrames) {
          setDisplayValue(end);
          clearInterval(timer);
        } else {
          setDisplayValue(newValue);
        }
      }, frameDuration);
      return () => clearInterval(timer);
    }
  }, [isInView, value]);

  return <>{isInt ? Math.round(displayValue).toLocaleString('es-MX') : displayValue.toFixed(1)}</>;
};

// --- TOOLTIPS PERSONALIZADOS PARA GRÁFICAS ---
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-background/80 backdrop-blur-sm p-3 border border-border rounded-lg shadow-xl">
        <p className="font-bold text-foreground mb-2">{label}</p>
        {payload.map((pld: any) => (
          <div key={pld.dataKey} style={{ color: pld.color }} className="flex justify-between items-center gap-4 text-sm">
            <span>{pld.dataKey}:</span>
            <span className="font-bold">{pld.value}{pld.unit || ''}</span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

// --- COMPONENTE PRINCIPAL DE ESTADÍSTICAS ---
export const StatisticsContent: React.FC = () => {
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.5,
        ease: "easeOut"
      },
    }),
  };

  return (
    <div className="p-4 sm:p-6 bg-gray-50/50">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 auto-rows-auto">

        {/* --- TARJETAS DE KPIs SUPERIORES --- */}
        <motion.div custom={0} variants={cardVariants} initial="hidden" animate="visible" className="bg-white rounded-2xl p-4 border border-gray-200/80 shadow-sm hover:shadow-lg transition-shadow duration-300">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-primary/10 rounded-full"><Users className="w-6 h-6 text-primary" /></div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Usuarios Activos</p>
              <p className="text-3xl font-bold text-primary"><AnimatedNumber value={2847} /></p>
            </div>
          </div>
        </motion.div>

        <motion.div custom={1} variants={cardVariants} initial="hidden" animate="visible" className="bg-white rounded-2xl p-4 border border-gray-200/80 shadow-sm hover:shadow-lg transition-shadow duration-300">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-emerald-500/10 rounded-full"><Zap className="w-6 h-6 text-emerald-500" /></div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Generaciones Hoy</p>
              <p className="text-3xl font-bold text-emerald-600"><AnimatedNumber value={1247} /></p>
            </div>
          </div>
        </motion.div>

        <motion.div custom={2} variants={cardVariants} initial="hidden" animate="visible" className="bg-white rounded-2xl p-4 border border-gray-200/80 shadow-sm hover:shadow-lg transition-shadow duration-300">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-purple-600/10 rounded-full"><Clock className="w-6 h-6 text-purple-600" /></div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Horas Ahorradas</p>
              <p className="text-3xl font-bold text-purple-600"><AnimatedNumber value={37} />h</p>
            </div>
          </div>
        </motion.div>

        <motion.div custom={3} variants={cardVariants} initial="hidden" animate="visible" className="bg-white rounded-2xl p-4 border border-gray-200/80 shadow-sm hover:shadow-lg transition-shadow duration-300">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-orange-500/10 rounded-full"><Brain className="w-6 h-6 text-orange-500" /></div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Precisión IA</p>
              <p className="text-3xl font-bold text-orange-600"><AnimatedNumber value={99.1} isInt={false} />%</p>
            </div>
          </div>
        </motion.div>
        
        {/* --- GRÁFICA PRINCIPAL DE TIEMPO --- */}
        <motion.div custom={2} variants={cardVariants} initial="hidden" animate="visible" className="sm:col-span-2 md:col-span-2 row-span-2 bg-white rounded-2xl p-4 sm:p-6 border border-gray-200/80 shadow-lg">
          <div className="flex items-center gap-3 mb-4">
            <Target className="w-6 h-6 text-gray-700" />
            <div>
              <h3 className="font-semibold text-lg text-gray-800">Comparativa de Tiempo por Historia</h3>
              <p className="text-xs text-muted-foreground">Tiempo promedio en minutos: Dentaxy vs. Método Tradicional</p>
            </div>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={timeData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                <defs>
                  <linearGradient id="colorTraditional" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#ef4444" stopOpacity={0.7}/><stop offset="95%" stopColor="#ef4444" stopOpacity={0}/></linearGradient>
                  <linearGradient id="colorDentaxy" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#22c55e" stopOpacity={0.7}/><stop offset="95%" stopColor="#22c55e" stopOpacity={0}/></linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="black" strokeOpacity={0.05} />
                <XAxis dataKey="time" fontSize={12} tickLine={false} axisLine={false} stroke="#6b7280" />
                <YAxis unit="m" fontSize={12} tickLine={false} axisLine={false} stroke="#6b7280" />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(0,0,0,0.03)'}}/>
                <Area type="monotone" dataKey="Método Tradicional" stroke="#ef4444" fill="url(#colorTraditional)" strokeWidth={2.5} />
                <Area type="monotone" dataKey="Dentaxy" stroke="#22c55e" fill="url(#colorDentaxy)" strokeWidth={2.5} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
        
        {/* --- NUEVO: COMPARATIVA DE PRECIOS --- */}
        <motion.div custom={3} variants={cardVariants} initial="hidden" animate="visible" className="sm:col-span-2 md:col-span-2 bg-gradient-to-br from-gray-900 to-gray-800 text-white rounded-2xl p-4 sm:p-6 border border-gray-700 shadow-lg">
          <div className="flex items-center gap-3 mb-4">
            <DollarSign className="w-6 h-6 text-primary" />
            <div>
              <h3 className="font-semibold text-lg text-white">Inversión Inteligente</h3>
              <p className="text-xs text-gray-400">Tu plan especializado vs. IAs genéricas</p>
            </div>
          </div>
          <div className="space-y-3">
             <div className="bg-primary/10 p-3 rounded-lg border-2 border-primary shadow-inner-lg">
                <div className="flex justify-between items-center">
                    <div>
                        <div className="flex items-center gap-2">
                            <h4 className="font-bold text-white">Dentaxy AI</h4>
                            <span className="text-xs bg-primary text-primary-foreground font-semibold px-2 py-0.5 rounded-full">Tu Plan</span>
                        </div>
                        <p className="text-xs text-gray-300">Especializado en Odontología</p>
                    </div>
                    <p className="text-2xl font-bold text-primary">$99 <span className="text-sm font-medium text-gray-400">MXN/mes</span></p>
                </div>
            </div>
            <div className="bg-gray-700/50 p-3 rounded-lg border border-gray-600">
                <div className="flex justify-between items-center">
                    <div>
                        <h4 className="font-semibold text-gray-300">IA Genérica</h4>
                        <p className="text-xs text-gray-400">Para uso general, sin contexto dental</p>
                    </div>
                    <p className="text-xl font-semibold text-gray-400">$400+ <span className="text-sm font-medium">MXN/mes</span></p>
                </div>
            </div>
          </div>
        </motion.div>

        {/* --- GRÁFICA DE RENDIMIENTO --- */}
        <motion.div custom={4} variants={cardVariants} initial="hidden" animate="visible" className="sm:col-span-2 md:col-span-4 bg-white rounded-2xl p-4 sm:p-6 border border-gray-200/80 shadow-lg">
          <div className="flex items-center gap-3 mb-4">
            <TrendingUp className="w-6 h-6 text-gray-700" />
            <div>
              <h3 className="font-semibold text-lg text-gray-800">Evolución del Rendimiento del Modelo</h3>
              <p className="text-xs text-muted-foreground">Mejora continua en precisión y velocidad de respuesta</p>
            </div>
          </div>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={performanceData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="black" strokeOpacity={0.05} />
                <XAxis dataKey="month" fontSize={12} tickLine={false} axisLine={false} stroke="#6b7280" />
                <YAxis unit="%" domain={[80, 100]} fontSize={12} tickLine={false} axisLine={false} stroke="#6b7280" />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(0,0,0,0.03)'}} />
                <Line type="monotone" dataKey="Precisión" stroke="#3b82f6" strokeWidth={2.5} dot={{ r: 4, fill: '#3b82f6', strokeWidth: 2, stroke: '#fff' }} activeDot={{ r: 6 }} unit="%"/>
                <Line type="monotone" dataKey="Velocidad" stroke="#8b5cf6" strokeWidth={2.5} dot={{ r: 4, fill: '#8b5cf6', strokeWidth: 2, stroke: '#fff' }} activeDot={{ r: 6 }} unit="%"/>
              </LineChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>
    </div>
  )
}