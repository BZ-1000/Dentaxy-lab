import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { 
  TrendingUp, 
  Target, 
  Clock, 
  Zap, 
  Calendar,
  ChevronRight,
  Play,
  Pause,
  RotateCcw,
  CheckCircle2,
  Circle,
  Star,
  Award,
  BarChart3,
  Activity
} from 'lucide-react';

interface Task {
  id: number;
  title: string;
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
  timeSpent: number;
  estimatedTime: number;
  category: string;
}

export const ProductividadSection = () => {
  const [isTimerActive, setIsTimerActive] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [selectedTask, setSelectedTask] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'tasks' | 'time'>('overview');

  const [tasks, setTasks] = useState<Task[]>([
    {
      id: 1,
      title: 'Completar reporte mensual',
      completed: true,
      priority: 'high',
      timeSpent: 120,
      estimatedTime: 150,
      category: 'Trabajo'
    },
    {
      id: 2,
      title: 'Revisar propuesta de cliente',
      completed: false,
      priority: 'medium',
      timeSpent: 45,
      estimatedTime: 90,
      category: 'Ventas'
    },
    {
      id: 3,
      title: 'Actualizar documentación',
      completed: false,
      priority: 'low',
      timeSpent: 30,
      estimatedTime: 60,
      category: 'Desarrollo'
    },
    {
      id: 4,
      title: 'Llamada con equipo',
      completed: true,
      priority: 'medium',
      timeSpent: 60,
      estimatedTime: 60,
      category: 'Reuniones'
    }
  ]);

  const stats = {
    completedToday: tasks.filter(t => t.completed).length,
    totalTasks: tasks.length,
    timeWorked: tasks.reduce((acc, task) => acc + task.timeSpent, 0),
    productivity: 87,
    streak: 5
  };

  const priorityColors = {
    high: 'from-red-400 to-red-500',
    medium: 'from-yellow-400 to-orange-400',
    low: 'from-green-400 to-emerald-500'
  };

  const categoryColors = {
    'Trabajo': 'bg-blue-100 text-blue-700',
    'Ventas': 'bg-purple-100 text-purple-700',
    'Desarrollo': 'bg-emerald-100 text-emerald-700',
    'Reuniones': 'bg-orange-100 text-orange-700'
  };

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isTimerActive) {
      interval = setInterval(() => {
        setCurrentTime(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTimerActive]);

  const toggleTask = (taskId: number) => {
    setTasks(prev => prev.map(task => 
      task.id === taskId ? { ...task, completed: !task.completed } : task
    ));
  };

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const formatMinutes = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15
      }
    }
  };

  const tabVariants = {
    inactive: { scale: 0.95, opacity: 0.7 },
    active: { 
      scale: 1, 
      opacity: 1,
      transition: { 
        type: "spring",
        stiffness: 300,
        damping: 20 
      }
    }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <Card className="h-full bg-gradient-to-br from-white via-blue-50/30 to-purple-50/30 border-gray-200/50 shadow-lg rounded-3xl overflow-hidden backdrop-blur-sm">
        <CardHeader className="pb-4 bg-gradient-to-r from-blue-500/5 to-purple-500/5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg">
                <Activity className="w-6 h-6 text-white" />
              </div>
              <div>
                <CardTitle className="text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                  Mi Productividad
                </CardTitle>
                <p className="text-sm text-gray-500">Seguimiento diario de actividades</p>
              </div>
            </div>
            <Badge className="bg-gradient-to-r from-emerald-400 to-emerald-500 text-white border-0 shadow-sm">
              {stats.productivity}% hoy
            </Badge>
          </div>

          {/* Tabs de navegación */}
          <div className="flex gap-1 mt-4 p-1 bg-gray-100/80 rounded-2xl">
            {[
              { id: 'overview', label: 'Resumen', icon: BarChart3 },
              { id: 'tasks', label: 'Tareas', icon: CheckCircle2 },
              { id: 'time', label: 'Tiempo', icon: Clock }
            ].map((tab) => (
              <motion.button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-xl text-sm font-medium transition-all ${
                  activeTab === tab.id 
                    ? 'bg-white text-blue-600 shadow-sm' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
                variants={tabVariants}
                animate={activeTab === tab.id ? 'active' : 'inactive'}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </motion.button>
            ))}
          </div>
        </CardHeader>

        <CardContent className="p-6">
          <AnimatePresence mode="wait">
            {activeTab === 'overview' && (
              <motion.div
                key="overview"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                {/* Stats Grid */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  <motion.div 
                    className="bg-gradient-to-br from-blue-500 to-blue-600 p-4 rounded-2xl text-white shadow-lg"
                    whileHover={{ scale: 1.05, y: -5 }}
                  >
                    <Target className="w-6 h-6 mb-2 opacity-80" />
                    <p className="text-2xl font-bold">{stats.completedToday}/{stats.totalTasks}</p>
                    <p className="text-xs opacity-90">Tareas completadas</p>
                  </motion.div>

                  <motion.div 
                    className="bg-gradient-to-br from-emerald-500 to-emerald-600 p-4 rounded-2xl text-white shadow-lg"
                    whileHover={{ scale: 1.05, y: -5 }}
                  >
                    <Clock className="w-6 h-6 mb-2 opacity-80" />
                    <p className="text-2xl font-bold">{formatMinutes(stats.timeWorked)}</p>
                    <p className="text-xs opacity-90">Tiempo trabajado</p>
                  </motion.div>

                  <motion.div 
                    className="bg-gradient-to-br from-purple-500 to-purple-600 p-4 rounded-2xl text-white shadow-lg"
                    whileHover={{ scale: 1.05, y: -5 }}
                  >
                    <TrendingUp className="w-6 h-6 mb-2 opacity-80" />
                    <p className="text-2xl font-bold">{stats.productivity}%</p>
                    <p className="text-xs opacity-90">Productividad</p>
                  </motion.div>

                  <motion.div 
                    className="bg-gradient-to-br from-orange-500 to-red-500 p-4 rounded-2xl text-white shadow-lg"
                    whileHover={{ scale: 1.05, y: -5 }}
                  >
                    <Award className="w-6 h-6 mb-2 opacity-80" />
                    <p className="text-2xl font-bold">{stats.streak}</p>
                    <p className="text-xs opacity-90">Días consecutivos</p>
                  </motion.div>
                </div>

                {/* Progress Ring */}
                <div className="flex justify-center">
                  <div className="relative w-32 h-32">
                    <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                      <circle
                        cx="50"
                        cy="50"
                        r="40"
                        stroke="rgb(229 231 235)"
                        strokeWidth="8"
                        fill="none"
                      />
                      <motion.circle
                        cx="50"
                        cy="50"
                        r="40"
                        stroke="url(#gradient)"
                        strokeWidth="8"
                        fill="none"
                        strokeLinecap="round"
                        strokeDasharray={`${2 * Math.PI * 40}`}
                        initial={{ strokeDashoffset: `${2 * Math.PI * 40}` }}
                        animate={{ strokeDashoffset: `${2 * Math.PI * 40 * (1 - (stats.completedToday / stats.totalTasks))}` }}
                        transition={{ duration: 1, ease: "easeOut" }}
                      />
                      <defs>
                        <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor="#3B82F6" />
                          <stop offset="100%" stopColor="#8B5CF6" />
                        </linearGradient>
                      </defs>
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center">
                        <p className="text-2xl font-bold text-gray-900">
                          {Math.round((stats.completedToday / stats.totalTasks) * 100)}%
                        </p>
                        <p className="text-xs text-gray-500">Completado</p>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'tasks' && (
              <motion.div
                key="tasks"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-3"
              >
                {tasks.map((task, index) => (
                  <motion.div
                    key={task.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className={`p-4 rounded-2xl border transition-all cursor-pointer group ${
                      task.completed 
                        ? 'bg-emerald-50/50 border-emerald-200 opacity-75' 
                        : 'bg-white border-gray-200 hover:border-gray-300 hover:shadow-md'
                    }`}
                    onClick={() => toggleTask(task.id)}
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="flex items-center gap-3">
                      <motion.div
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        {task.completed ? (
                          <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                        ) : (
                          <Circle className="w-5 h-5 text-gray-400 group-hover:text-blue-500" />
                        )}
                      </motion.div>
                      
                      <div className="flex-1">
                        <h4 className={`font-medium ${task.completed ? 'line-through text-gray-500' : 'text-gray-900'}`}>
                          {task.title}
                        </h4>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge size="sm" className={categoryColors[task.category as keyof typeof categoryColors]}>
                            {task.category}
                          </Badge>
                          <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${priorityColors[task.priority]}`} />
                          <span className="text-xs text-gray-500">
                            {formatMinutes(task.timeSpent)} / {formatMinutes(task.estimatedTime)}
                          </span>
                        </div>
                      </div>

                      <div className="text-right">
                        <Progress 
                          value={(task.timeSpent / task.estimatedTime) * 100} 
                          className="w-16 h-2"
                        />
                        <p className="text-xs text-gray-500 mt-1">
                          {Math.round((task.timeSpent / task.estimatedTime) * 100)}%
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            )}

            {activeTab === 'time' && (
              <motion.div
                key="time"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                {/* Timer principal */}
                <div className="text-center">
                  <motion.div
                    className="inline-flex items-center justify-center w-48 h-48 rounded-full bg-gradient-to-br from-blue-500/10 to-purple-500/10 border-4 border-blue-200/50 mb-6"
                    animate={{ 
                      scale: isTimerActive ? [1, 1.02, 1] : 1,
                    }}
                    transition={{ 
                      repeat: isTimerActive ? Infinity : 0,
                      duration: 2,
                      ease: "easeInOut"
                    }}
                  >
                    <div className="text-center">
                      <p className="text-4xl font-bold text-gray-900 mb-2">
                        {formatTime(currentTime)}
                      </p>
                      <p className="text-sm text-gray-500">Tiempo activo</p>
                    </div>
                  </motion.div>

                  <div className="flex justify-center gap-3">
                    <Button
                      onClick={() => setIsTimerActive(!isTimerActive)}
                      className={`rounded-2xl px-6 ${
                        isTimerActive 
                          ? 'bg-red-500 hover:bg-red-600' 
                          : 'bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600'
                      } text-white border-0 shadow-lg`}
                      size="lg"
                    >
                      {isTimerActive ? <Pause className="w-4 h-4 mr-2" /> : <Play className="w-4 h-4 mr-2" />}
                      {isTimerActive ? 'Pausar' : 'Iniciar'}
                    </Button>
                    
                    <Button
                      onClick={() => { setCurrentTime(0); setIsTimerActive(false); }}
                      variant="outline"
                      className="rounded-2xl px-6 border-gray-300 hover:bg-gray-50"
                      size="lg"
                    >
                      <RotateCcw className="w-4 h-4 mr-2" />
                      Reset
                    </Button>
                  </div>
                </div>

                {/* Sesiones recientes */}
                <div className="space-y-3">
                  <h4 className="font-semibold text-gray-900 flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    Sesiones de Hoy
                  </h4>
                  
                  {[
                    { time: '09:00 - 10:30', duration: '1h 30m', task: 'Reporte mensual', efficiency: 95 },
                    { time: '11:00 - 11:45', duration: '45m', task: 'Revisar propuesta', efficiency: 88 },
                    { time: '14:00 - 15:00', duration: '1h', task: 'Llamada de equipo', efficiency: 92 }
                  ].map((session, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="p-4 bg-white rounded-2xl border border-gray-200 hover:shadow-md transition-all"
                      whileHover={{ scale: 1.02 }}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-gray-900">{session.task}</p>
                          <p className="text-sm text-gray-500">{session.time} • {session.duration}</p>
                        </div>
                        <div className="text-right">
                          <div className="flex items-center gap-1">
                            <Star className="w-4 h-4 text-yellow-400 fill-current" />
                            <span className="text-sm font-medium">{session.efficiency}%</span>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </CardContent>
      </Card>
    </motion.div>
  );
};