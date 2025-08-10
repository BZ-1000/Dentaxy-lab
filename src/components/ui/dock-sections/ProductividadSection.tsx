import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell, Area, AreaChart } from 'recharts';
import { TrendingUp, Activity, ArrowRight, Clock, Zap, Target, Award, ChevronUp } from 'lucide-react';

// Mock data since we don't have the actual hooks
const mockWeeklyData = [
  { dayName: 'L', minutes: 45, formattedDate: 'Lunes 5 Ago' },
  { dayName: 'M', minutes: 32, formattedDate: 'Martes 6 Ago' },
  { dayName: 'X', minutes: 67, formattedDate: 'Miércoles 7 Ago' },
  { dayName: 'J', minutes: 23, formattedDate: 'Jueves 8 Ago' },
  { dayName: 'V', minutes: 89, formattedDate: 'Viernes 9 Ago' },
  { dayName: 'S', minutes: 15, formattedDate: 'Sábado 10 Ago' },
  { dayName: 'D', minutes: 42, formattedDate: 'Domingo 11 Ago' }
];

export const ProductividadSection = () => {
  const [hoveredBar, setHoveredBar] = useState<number | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  
  // Mock values
  const user = true; // Set to false to see login state
  const weeklyData = mockWeeklyData;
  const currentSessionMinutes = 12;
  const totalTodayMinutes = 42;
  const isTracking = true;

  // Enhanced color system with gradients and depth
  const getBarGradient = (index: number, minutes: number) => {
    const isToday = index === 6;
    if (isToday) {
      return minutes > 0 
        ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' 
        : 'linear-gradient(135deg, #f0f2f5 0%, #e1e5e9 100%)';
    }
    if (minutes === 0) return 'linear-gradient(135deg, #f0f2f5 0%, #e1e5e9 100%)';
    if (minutes < 30) return 'linear-gradient(135deg, #ff9a56 0%, #ff6b95 100%)';
    if (minutes < 60) return 'linear-gradient(135deg, #00d2ff 0%, #3a7bd5 100%)';
    return 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
  };

  const getBarColor = (index: number, minutes: number) => {
    const isToday = index === 6;
    if (isToday) return minutes > 0 ? '#667eea' : '#e1e5e9';
    if (minutes === 0) return '#e1e5e9';
    if (minutes < 30) return '#ff9a56';
    if (minutes < 60) return '#00d2ff';
    return '#667eea';
  };

  const maxMinutes = Math.max(...weeklyData.map(d => d.minutes), 120);
  const weekAverage = weeklyData.reduce((sum, d) => sum + d.minutes, 0) / 7;
  const todayTotal = totalTodayMinutes + currentSessionMinutes;
  const weekTotal = weeklyData.reduce((sum, d) => sum + d.minutes, 0);
  const streak = weeklyData.filter(d => d.minutes > 0).length;

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="relative"
    >
      <Card className="relative overflow-hidden bg-gradient-to-br from-white via-slate-50/50 to-blue-50/30 border-0 shadow-2xl shadow-blue-500/10">
        {/* Glassmorphism overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/80 via-white/60 to-transparent backdrop-blur-xl" />
        
        {/* Animated background particles */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-32 h-32 rounded-full bg-gradient-to-r from-blue-400/5 to-purple-400/5"
              animate={{
                x: [0, 100, 0],
                y: [0, -50, 0],
                scale: [1, 1.2, 1],
              }}
              transition={{
                duration: 8 + i * 2,
                repeat: Infinity,
                ease: "easeInOut",
                delay: i * 0.5
              }}
              style={{
                left: `${20 + i * 15}%`,
                top: `${10 + i * 10}%`
              }}
            />
          ))}
        </div>

        <CardHeader className="relative pb-3 pt-6">
          <motion.div variants={itemVariants}>
            <CardTitle className="text-sm font-bold flex items-center gap-3">
              <motion.span 
                className="relative bg-gradient-to-br from-blue-500 via-purple-500 to-indigo-600 rounded-xl w-8 h-8 flex items-center justify-center text-xs font-bold text-white shadow-lg shadow-blue-500/25"
                animate={{ 
                  scale: isTracking ? [1, 1.05, 1] : 1,
                  boxShadow: isTracking 
                    ? ["0 4px 20px rgba(59, 130, 246, 0.25)", "0 8px 30px rgba(59, 130, 246, 0.4)", "0 4px 20px rgba(59, 130, 246, 0.25)"]
                    : "0 4px 20px rgba(59, 130, 246, 0.25)"
                }}
                transition={{ duration: 2, repeat: isTracking ? Infinity : 0 }}
                whileHover={{ scale: 1.1, rotate: 5 }}
              >
                <Activity className="w-4 h-4" />
              </motion.span>
              <div className="flex flex-col">
                <span className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 bg-clip-text text-transparent font-black">
                  Mi Productividad
                </span>
                {user && isTracking && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex items-center gap-2 mt-1"
                  >
                    <motion.div 
                      className="flex items-center gap-2 bg-gradient-to-r from-emerald-50 to-green-50 px-3 py-1 rounded-full border border-emerald-200/50"
                      animate={{ scale: [1, 1.02, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      <div className="w-2 h-2 bg-gradient-to-r from-emerald-400 to-green-500 rounded-full">
                        <motion.div 
                          className="w-full h-full rounded-full bg-emerald-400"
                          animate={{ opacity: [1, 0.5, 1] }}
                          transition={{ duration: 1.5, repeat: Infinity }}
                        />
                      </div>
                      <span className="text-xs font-semibold text-emerald-700">En vivo</span>
                    </motion.div>
                  </motion.div>
                )}
              </div>
            </CardTitle>
            <p className="text-xs text-slate-600 font-medium mt-2">
              {user ? "Análisis de productividad • Últimos 7 días" : "Inicia sesión para desbloquear tu panel de productividad"}
            </p>
          </motion.div>
        </CardHeader>

        <CardContent className="relative pt-0 p-6">
          {user ? (
            <motion.div variants={itemVariants}>
              {/* Enhanced Stats Grid */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <motion.div 
                  className="bg-gradient-to-br from-white to-blue-50/50 p-4 rounded-2xl border border-blue-100/50 shadow-lg shadow-blue-500/5"
                  whileHover={{ scale: 1.02, y: -2 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                      <Clock className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <motion.div 
                        className="text-2xl font-black bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent"
                        key={todayTotal}
                        animate={{ scale: [1, 1.05, 1] }}
                        transition={{ duration: 0.3 }}
                      >
                        {todayTotal}
                      </motion.div>
                      <p className="text-xs text-slate-600 font-semibold">min hoy</p>
                    </div>
                  </div>
                  {isTracking && (
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="flex items-center gap-2 text-xs bg-gradient-to-r from-emerald-500 to-green-500 text-white px-3 py-2 rounded-lg font-semibold shadow-lg"
                    >
                      <Zap className="w-3 h-3" />
                      Activo +{currentSessionMinutes}m
                    </motion.div>
                  )}
                </motion.div>

                <motion.div 
                  className="bg-gradient-to-br from-white to-purple-50/50 p-4 rounded-2xl border border-purple-100/50 shadow-lg shadow-purple-500/5"
                  whileHover={{ scale: 1.02, y: -2 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg">
                      <TrendingUp className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <div className="text-2xl font-black bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                        {Math.round(weekAverage)}
                      </div>
                      <p className="text-xs text-slate-600 font-semibold">promedio</p>
                    </div>
                  </div>
                  <motion.div 
                    className={`flex items-center gap-2 text-xs px-3 py-2 rounded-lg font-semibold shadow-lg ${
                      weekAverage > 30 
                        ? 'bg-gradient-to-r from-emerald-500 to-green-500 text-white' 
                        : 'bg-gradient-to-r from-orange-500 to-yellow-500 text-white'
                    }`}
                  >
                    <Target className="w-3 h-3" />
                    {weekAverage > 60 ? 'Extraordinario' : weekAverage > 30 ? 'Excelente' : 'En progreso'}
                  </motion.div>
                </motion.div>
              </div>

              {/* Additional Stats Row */}
              <div className="flex gap-3 mb-6">
                <motion.div 
                  className="flex-1 bg-gradient-to-r from-indigo-50 to-blue-50 p-3 rounded-xl border border-indigo-100"
                  whileHover={{ scale: 1.01 }}
                >
                  <div className="flex items-center gap-2">
                    <Award className="w-4 h-4 text-indigo-600" />
                    <span className="text-sm font-bold text-indigo-700">{weekTotal}m</span>
                    <span className="text-xs text-indigo-600">esta semana</span>
                  </div>
                </motion.div>
                <motion.div 
                  className="flex-1 bg-gradient-to-r from-emerald-50 to-green-50 p-3 rounded-xl border border-emerald-100"
                  whileHover={{ scale: 1.01 }}
                >
                  <div className="flex items-center gap-2">
                    <ChevronUp className="w-4 h-4 text-emerald-600" />
                    <span className="text-sm font-bold text-emerald-700">{streak}</span>
                    <span className="text-xs text-emerald-600">días activos</span>
                  </div>
                </motion.div>
              </div>

              {/* Enhanced Chart */}
              <div className="relative">
                <motion.button
                  className="absolute -top-2 right-0 text-xs text-slate-500 hover:text-slate-700 transition-colors z-10"
                  onClick={() => setShowDetails(!showDetails)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {showDetails ? 'Ocultar detalles' : 'Ver detalles'}
                </motion.button>
                
                <div className="h-32 bg-gradient-to-b from-slate-50/50 to-transparent rounded-2xl p-4 border border-slate-100/50">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart 
                      data={weeklyData}
                      onMouseMove={(data) => {
                        if (data && data.activeTooltipIndex !== undefined) {
                          setHoveredBar(data.activeTooltipIndex);
                        }
                      }}
                      onMouseLeave={() => setHoveredBar(null)}
                      barCategoryGap="15%"
                    >
                      <XAxis 
                        dataKey="dayName" 
                        axisLine={false} 
                        tickLine={false} 
                        className="text-xs font-semibold" 
                        tick={{ fontSize: 11, fill: '#64748b', fontWeight: 600 }}
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
                                  className="bg-white/95 backdrop-blur-xl border border-slate-200/50 rounded-2xl p-4 shadow-2xl shadow-slate-500/20"
                                >
                                  <div className="flex items-center gap-3 mb-3">
                                    <div 
                                      className="w-4 h-4 rounded-full shadow-lg"
                                      style={{ background: getBarGradient(weeklyData.indexOf(data), data.minutes) }}
                                    />
                                    <div>
                                      <p className="text-sm font-bold text-slate-800">
                                        {data.formattedDate}
                                        {isToday && ' (Hoy)'}
                                      </p>
                                      <div className="flex items-center gap-2 mt-1">
                                        <Activity className="w-3 h-3 text-slate-600" />
                                        <span className="text-sm font-semibold text-slate-700">
                                          {data.minutes} minutos
                                        </span>
                                        {isToday && currentSessionMinutes > 0 && (
                                          <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-1 rounded-full font-semibold">
                                            +{currentSessionMinutes}m activos
                                          </span>
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                  {data.minutes > 0 && (
                                    <div className="text-xs bg-gradient-to-r from-slate-100 to-slate-50 p-2 rounded-lg border border-slate-100">
                                      <span className="font-semibold text-slate-700">
                                        {data.minutes < 30 ? '🌱 Buen inicio' : 
                                         data.minutes < 60 ? '⚡ Muy productivo' : 
                                         '🏆 Excelente sesión'}
                                      </span>
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
                        radius={[6, 6, 0, 0]}
                        maxBarSize={32}
                      >
                        {weeklyData.map((entry, index) => (
                          <Cell 
                            key={`cell-${index}`} 
                            fill={getBarColor(index, entry.minutes)}
                            style={{
                              filter: hoveredBar === index 
                                ? 'brightness(1.1) drop-shadow(0 4px 12px rgba(0,0,0,0.15))' 
                                : 'brightness(1)',
                              transition: 'all 0.3s ease-out'
                            }}
                          />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                <AnimatePresence>
                  {showDetails && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mt-4 grid grid-cols-7 gap-2"
                    >
                      {weeklyData.map((day, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.05 }}
                          className="text-center p-2 bg-gradient-to-b from-white to-slate-50 rounded-lg border border-slate-100/50"
                        >
                          <div className="text-xs font-bold text-slate-700">{day.dayName}</div>
                          <div className="text-lg font-black bg-gradient-to-r from-slate-700 to-slate-900 bg-clip-text text-transparent">
                            {day.minutes}
                          </div>
                          <div className="text-xs text-slate-500">min</div>
                        </motion.div>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          ) : (
            <motion.div
              variants={itemVariants}
              className="flex flex-col items-center justify-center py-8 text-center space-y-6"
            >
              <motion.div 
                className="relative w-20 h-20 mx-auto bg-gradient-to-br from-blue-500 via-purple-500 to-indigo-600 rounded-3xl flex items-center justify-center shadow-2xl shadow-blue-500/25"
                whileHover={{ scale: 1.1, rotate: 10 }}
                animate={{ 
                  boxShadow: [
                    "0 20px 40px rgba(59, 130, 246, 0.25)",
                    "0 25px 50px rgba(99, 102, 241, 0.3)",
                    "0 20px 40px rgba(59, 130, 246, 0.25)"
                  ]
                }}
                transition={{ 
                  boxShadow: { duration: 3, repeat: Infinity },
                  hover: { type: "spring", stiffness: 300 }
                }}
              >
                <Activity className="w-10 h-10 text-white" />
                <motion.div
                  className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent rounded-3xl"
                  animate={{ opacity: [0.2, 0.4, 0.2] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              </motion.div>
              
              <div className="space-y-4 max-w-xs">
                <motion.h4 
                  className="text-lg font-black bg-gradient-to-r from-slate-800 via-slate-700 to-slate-900 bg-clip-text text-transparent"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  Rastrea tu productividad en tiempo real
                </motion.h4>
                <motion.p 
                  className="text-sm text-slate-600 leading-relaxed font-medium"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  Visualiza los minutos que dedicas a crear historias clínicas con análisis avanzados y métricas en tiempo real
                </motion.p>
              </div>
              
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button 
                  className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 hover:from-blue-700 hover:via-purple-700 hover:to-indigo-700 text-white text-sm px-8 py-3 h-auto shadow-2xl shadow-blue-500/25 hover:shadow-blue-500/40 transition-all duration-500 group rounded-2xl font-bold border-0"
                  onClick={() => console.log('Navigate to register')}
                >
                  <Clock className="w-4 h-4 mr-3" />
                  Comenzar a Rastrear
                  <ArrowRight className="w-4 h-4 ml-3 group-hover:translate-x-1 transition-transform duration-300" />
                </Button>
              </motion.div>
            </motion.div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};