import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Calendar, 
  Clock, 
  TrendingUp, 
  Users, 
  Bell, 
  Star,
  ChevronRight,
  Activity,
  Target,
  Zap,
  Award,
  BarChart3,
  Plus,
  ArrowRight
} from 'lucide-react';

export const SidebarSection = () => {
  const [activeEvent, setActiveEvent] = useState<number | null>(null);

  const events = [
    {
      id: 1,
      title: 'Reunión de Equipo',
      time: '10:00 AM',
      type: 'meeting',
      participants: 5,
      priority: 'high',
      color: 'from-blue-500 to-blue-600'
    },
    {
      id: 2,
      title: 'Revisión de Proyecto',
      time: '2:30 PM',
      type: 'review',
      participants: 3,
      priority: 'medium',
      color: 'from-purple-500 to-purple-600'
    },
    {
      id: 3,
      title: 'Presentación Q4',
      time: '4:00 PM',
      type: 'presentation',
      participants: 8,
      priority: 'high',
      color: 'from-emerald-500 to-emerald-600'
    }
  ];

  const quickStats = [
    {
      icon: Target,
      label: 'Objetivos',
      value: '8/10',
      progress: 80,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      icon: TrendingUp,
      label: 'Productividad',
      value: '94%',
      progress: 94,
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-50'
    },
    {
      icon: Activity,
      label: 'Actividad',
      value: '156',
      progress: 75,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
    }
  ];

  const achievements = [
    {
      icon: Award,
      title: 'Meta Alcanzada',
      description: 'Completaste todos los objetivos del mes',
      time: 'Hace 2 horas',
      color: 'from-yellow-400 to-orange-400'
    },
    {
      icon: Zap,
      title: 'Racha de Productividad',
      description: '7 días consecutivos de alta productividad',
      time: 'Hace 1 día',
      color: 'from-blue-400 to-purple-400'
    },
    {
      icon: Star,
      title: 'Feedback Excelente',
      description: 'Recibiste una calificación de 5 estrellas',
      time: 'Hace 3 días',
      color: 'from-pink-400 to-rose-400'
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
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

  return (
    <motion.div
      className="h-screen bg-gradient-to-b from-gray-50 to-white border-r border-gray-200/50 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="p-6 space-y-6">
        
        {/* Header de la sidebar */}
        <motion.div variants={itemVariants} className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg">
            <BarChart3 className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-xl font-bold text-gray-900">Panel de Control</h2>
          <p className="text-sm text-gray-500">Tu resumen diario</p>
        </motion.div>

        {/* Stats Rápidas */}
        <motion.div variants={itemVariants}>
          <Card className="bg-white/80 backdrop-blur-sm border-gray-200/50 shadow-sm rounded-2xl">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <Activity className="w-5 h-5 text-blue-600" />
                Resumen Rápido
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {quickStats.map((stat, index) => (
                <motion.div
                  key={index}
                  className="flex items-center justify-between p-3 rounded-xl bg-gray-50/80 hover:bg-gray-100/80 transition-colors cursor-pointer"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                      <stat.icon className={`w-4 h-4 ${stat.color}`} />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{stat.label}</p>
                      <p className="text-sm text-gray-500">{stat.value}</p>
                    </div>
                  </div>
                  <div className="w-12 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <motion.div
                      className={`h-full bg-gradient-to-r ${stat.color.replace('text-', 'from-')} to-opacity-80`}
                      initial={{ width: 0 }}
                      animate={{ width: `${stat.progress}%` }}
                      transition={{ delay: 0.5, duration: 1, ease: "easeOut" }}
                    />
                  </div>
                </motion.div>
              ))}
            </CardContent>
          </Card>
        </motion.div>

        {/* Próximos Eventos */}
        <motion.div variants={itemVariants}>
          <Card className="bg-white/80 backdrop-blur-sm border-gray-200/50 shadow-sm rounded-2xl">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-purple-600" />
                  Próximos Eventos
                </div>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0 rounded-full">
                  <Plus className="w-4 h-4" />
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {events.map((event, index) => (
                <motion.div
                  key={event.id}
                  className="group relative overflow-hidden rounded-xl bg-gradient-to-r p-4 cursor-pointer"
                  style={{
                    background: `linear-gradient(135deg, ${event.color.split(' ')[1]} 0%, ${event.color.split(' ')[3]} 100%)`
                  }}
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setActiveEvent(activeEvent === event.id ? null : event.id)}
                  layout
                >
                  <div className="relative z-10">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold text-white text-sm">{event.title}</h4>
                      <Badge variant="secondary" className="bg-white/20 text-white text-xs">
                        {event.priority}
                      </Badge>
                    </div>
                    
                    <div className="flex items-center gap-4 text-white/90 text-xs">
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {event.time}
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="w-3 h-3" />
                        {event.participants}
                      </div>
                    </div>

                    <AnimatePresence>
                      {activeEvent === event.id && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          className="mt-3 pt-3 border-t border-white/20"
                        >
                          <Button 
                            size="sm" 
                            className="bg-white/20 hover:bg-white/30 text-white text-xs h-7"
                          >
                            Unirse
                            <ArrowRight className="w-3 h-3 ml-1" />
                          </Button>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                  
                  <div className="absolute inset-0 bg-gradient-to-r from-white/0 to-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                </motion.div>
              ))}
            </CardContent>
          </Card>
        </motion.div>

        {/* Logros Recientes */}
        <motion.div variants={itemVariants}>
          <Card className="bg-white/80 backdrop-blur-sm border-gray-200/50 shadow-sm rounded-2xl">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <Award className="w-5 h-5 text-yellow-600" />
                Logros Recientes
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {achievements.map((achievement, index) => (
                <motion.div
                  key={index}
                  className="group p-3 rounded-xl bg-gradient-to-r from-gray-50 to-gray-100 hover:from-gray-100 hover:to-gray-200 transition-all cursor-pointer border border-gray-200/50"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="flex gap-3">
                    <div className={`w-10 h-10 rounded-xl bg-gradient-to-r ${achievement.color} flex items-center justify-center flex-shrink-0 shadow-lg`}>
                      <achievement.icon className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-gray-900 text-sm mb-1">
                        {achievement.title}
                      </h4>
                      <p className="text-xs text-gray-600 mb-2 line-clamp-2">
                        {achievement.description}
                      </p>
                      <p className="text-xs text-gray-500">{achievement.time}</p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-gray-600 transition-colors" />
                  </div>
                </motion.div>
              ))}
            </CardContent>
          </Card>
        </motion.div>

        {/* Acción Rápida */}
        <motion.div variants={itemVariants}>
          <Card className="bg-gradient-to-br from-blue-500 to-purple-600 text-white shadow-lg rounded-2xl border-0 overflow-hidden">
            <CardContent className="p-6 relative">
              <div className="absolute inset-0 bg-gradient-to-r from-white/0 to-white/10" />
              <div className="relative z-10">
                <Bell className="w-8 h-8 mb-3 text-white/90" />
                <h3 className="font-bold text-lg mb-2">¿Necesitas ayuda?</h3>
                <p className="text-white/90 text-sm mb-4">
                  Nuestro equipo está disponible 24/7 para asistirte
                </p>
                <Button 
                  variant="secondary" 
                  className="w-full bg-white/20 hover:bg-white/30 text-white border-0 rounded-xl"
                >
                  Contactar Soporte
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>

      </div>
    </motion.div>
  );
};