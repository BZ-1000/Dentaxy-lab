import React from 'react'
import { motion } from 'framer-motion'
import { Users, Zap, FileText, Clock, Code, Brain, Activity, TrendingUp } from 'lucide-react'
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, AreaChart, Area } from 'recharts'

const timeData = [
  { time: '00:00', traditional: 45, dentaxy: 8 },
  { time: '06:00', traditional: 50, dentaxy: 9 },
  { time: '12:00', traditional: 48, dentaxy: 7 },
  { time: '18:00', traditional: 52, dentaxy: 10 },
  { time: '24:00', traditional: 46, dentaxy: 8 }
]

const performanceData = [
  { month: 'Ene', accuracy: 95, speed: 88 },
  { month: 'Feb', accuracy: 97, speed: 92 },
  { month: 'Mar', accuracy: 98, speed: 95 },
  { month: 'Abr', accuracy: 99, speed: 97 }
]

export const StatisticsContent: React.FC = () => {
  return (
    <div className="grid grid-cols-4 gap-4 auto-rows-[120px]">
      {/* Usuarios Activos - Small Card */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-gradient-to-br from-primary/5 to-primary/10 rounded-xl p-4 border border-primary/20"
      >
        <div className="flex items-center justify-between h-full">
          <div>
            <p className="text-xs font-medium text-muted-foreground">Usuarios Activos</p>
            <p className="text-2xl font-bold text-primary">2,847</p>
            <p className="text-xs text-green-600">+12% hoy</p>
          </div>
          <Users className="w-8 h-8 text-primary/60" />
        </div>
      </motion.div>

      {/* Velocidad Promedio - Small Card */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl p-4 border border-orange-200"
      >
        <div className="flex items-center justify-between h-full">
          <div>
            <p className="text-xs font-medium text-muted-foreground">Velocidad Promedio</p>
            <p className="text-2xl font-bold text-orange-600">8.2<span className="text-sm">min</span></p>
            <p className="text-xs text-orange-500">vs 45min tradicional</p>
          </div>
          <Zap className="w-8 h-8 text-orange-500" />
        </div>
      </motion.div>

      {/* Tecnologías - Large Card */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="col-span-2 bg-gradient-to-br from-blue-50 to-indigo-100 rounded-xl p-4 border border-blue-200"
      >
        <div className="flex items-center gap-2 mb-3">
          <Code className="w-5 h-5 text-blue-600" />
          <h3 className="font-semibold text-blue-800">Stack Tecnológico</h3>
        </div>
        <div className="grid grid-cols-3 gap-2 text-xs">
          <div className="bg-white/60 rounded px-2 py-1 text-center font-medium">React</div>
          <div className="bg-white/60 rounded px-2 py-1 text-center font-medium">TypeScript</div>
          <div className="bg-white/60 rounded px-2 py-1 text-center font-medium">Tailwind</div>
          <div className="bg-white/60 rounded px-2 py-1 text-center font-medium">Supabase</div>
          <div className="bg-white/60 rounded px-2 py-1 text-center font-medium">Framer Motion</div>
          <div className="bg-white/60 rounded px-2 py-1 text-center font-medium">Vite</div>
        </div>
      </motion.div>

      {/* Gráfica de Tiempo - Large Card */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="col-span-2 row-span-2 bg-white rounded-xl p-4 border border-gray-200 shadow-sm"
      >
        <div className="flex items-center gap-2 mb-4">
          <Clock className="w-5 h-5 text-gray-600" />
          <h3 className="font-semibold text-gray-800">Comparativa de Tiempo</h3>
        </div>
        <div className="h-32">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={timeData}>
              <XAxis dataKey="time" fontSize={10} />
              <YAxis fontSize={10} />
              <Area type="monotone" dataKey="traditional" stroke="#ef4444" fill="#fecaca" strokeWidth={2} />
              <Area type="monotone" dataKey="dentaxy" stroke="#22c55e" fill="#bbf7d0" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <div className="flex gap-4 mt-2 text-xs">
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 bg-red-400 rounded"></div>
            <span>Método Tradicional</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 bg-green-400 rounded"></div>
            <span>Dentaxy</span>
          </div>
        </div>
      </motion.div>

      {/* Estados IA - Small Card */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-gradient-to-br from-green-50 to-emerald-100 rounded-xl p-4 border border-green-200"
      >
        <div className="flex items-center justify-between h-full">
          <div>
            <p className="text-xs font-medium text-muted-foreground">Estado IA</p>
            <p className="text-lg font-bold text-green-600">Activa</p>
            <p className="text-xs text-green-500">99.8% uptime</p>
          </div>
          <Brain className="w-8 h-8 text-green-500" />
        </div>
      </motion.div>

      {/* Ahorro de Tiempo - Small Card */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="bg-gradient-to-br from-purple-50 to-violet-100 rounded-xl p-4 border border-purple-200"
      >
        <div className="flex items-center justify-between h-full">
          <div>
            <p className="text-xs font-medium text-muted-foreground">Ahorro Hoy</p>
            <p className="text-2xl font-bold text-purple-600">37h</p>
            <p className="text-xs text-purple-500">tiempo ahorrado</p>
          </div>
          <Activity className="w-8 h-8 text-purple-500" />
        </div>
      </motion.div>

      {/* Métricas de Rendimiento - Large Card */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="col-span-2 bg-gradient-to-br from-gray-50 to-slate-100 rounded-xl p-4 border border-gray-200"
      >
        <div className="flex items-center gap-2 mb-3">
          <TrendingUp className="w-5 h-5 text-gray-600" />
          <h3 className="font-semibold text-gray-800">Rendimiento Mensual</h3>
        </div>
        <div className="h-16">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={performanceData}>
              <XAxis dataKey="month" fontSize={10} />
              <Line type="monotone" dataKey="accuracy" stroke="#3b82f6" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="speed" stroke="#8b5cf6" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="flex gap-4 mt-2 text-xs">
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 bg-blue-500 rounded"></div>
            <span>Precisión</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 bg-purple-500 rounded"></div>
            <span>Velocidad</span>
          </div>
        </div>
      </motion.div>

      {/* Historias Completadas - Small Card */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="bg-gradient-to-br from-amber-50 to-yellow-100 rounded-xl p-4 border border-amber-200"
      >
        <div className="flex items-center justify-between h-full">
          <div>
            <p className="text-xs font-medium text-muted-foreground">Historias Hoy</p>
            <p className="text-2xl font-bold text-amber-600">847</p>
            <p className="text-xs text-amber-500">completadas</p>
          </div>
          <FileText className="w-8 h-8 text-amber-500" />
        </div>
      </motion.div>

      {/* Usuarios Conectados - Small Card */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.9 }}
        className="bg-gradient-to-br from-teal-50 to-cyan-100 rounded-xl p-4 border border-teal-200"
      >
        <div className="flex items-center justify-between h-full">
          <div>
            <p className="text-xs font-medium text-muted-foreground">En Línea</p>
            <p className="text-2xl font-bold text-teal-600">127</p>
            <p className="text-xs text-teal-500">usuarios</p>
          </div>
          <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
        </div>
      </motion.div>
    </div>
  )
}