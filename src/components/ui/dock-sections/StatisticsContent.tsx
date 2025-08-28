import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Users, Zap, FileText, Clock, Code, Brain, Activity, TrendingUp, Star, BarChart3 } from 'lucide-react'
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, LineChart, Line } from 'recharts'
import { supabase } from '@/integrations/supabase/client'
import { useAuth } from '@/contexts/AuthContext'
import { toast } from '@/hooks/use-toast'

const programmingLanguagesData = [
  { name: 'TypeScript', percentage: 35, color: '#3178c6' },
  { name: 'React/JSX', percentage: 28, color: '#61dafb' },
  { name: 'JavaScript', percentage: 15, color: '#f7df1e' },
  { name: 'CSS/Tailwind', percentage: 12, color: '#06b6d4' },
  { name: 'Dentaxy GPT', percentage: 8, color: '#8b5cf6' },
  { name: 'SQL', percentage: 2, color: '#336791' }
]

const performanceData = [
  { month: 'Ene', accuracy: 95, speed: 88 },
  { month: 'Feb', accuracy: 97, speed: 92 },
  { month: 'Mar', accuracy: 98, speed: 95 },
  { month: 'Abr', accuracy: 99, speed: 97 }
]

export const StatisticsContent: React.FC = () => {
  const { user } = useAuth()
  const [userRating, setUserRating] = useState(0)
  const [hoveredStar, setHoveredStar] = useState(0)
  const [ratingStats, setRatingStats] = useState<any[]>([])
  const [averageRating, setAverageRating] = useState(0)
  const [totalRatings, setTotalRatings] = useState(0)

  // Fetch rating statistics
  useEffect(() => {
    const fetchRatingStats = async () => {
      try {
        const { data: ratings } = await supabase
          .from('user_ratings')
          .select('rating')

        if (ratings) {
          const stats = [1, 2, 3, 4, 5].map(star => ({
            star,
            count: ratings.filter(r => r.rating === star).length
          }))
          
          setRatingStats(stats)
          setTotalRatings(ratings.length)
          
          if (ratings.length > 0) {
            const avg = ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length
            setAverageRating(avg)
          }
        }
      } catch (error) {
        console.error('Error fetching rating stats:', error)
      }
    }

    fetchRatingStats()
  }, [])

  // Fetch user's existing rating
  useEffect(() => {
    const fetchUserRating = async () => {
      if (!user) return

      try {
        const { data } = await supabase
          .from('user_ratings')
          .select('rating')
          .eq('user_id', user.id)
          .single()

        if (data) {
          setUserRating(data.rating)
        }
      } catch (error) {
        // User hasn't rated yet
      }
    }

    fetchUserRating()
  }, [user])

  const handleRating = async (rating: number) => {
    if (!user) {
      toast({
        title: "Inicia sesión",
        description: "Debes iniciar sesión para calificar la app",
        variant: "destructive"
      })
      return
    }

    try {
      const { error } = await supabase
        .from('user_ratings')
        .upsert({
          user_id: user.id,
          rating
        })

      if (error) throw error

      setUserRating(rating)
      toast({
        title: "¡Gracias por tu calificación!",
        description: `Has calificado Dentaxy con ${rating} estrella${rating > 1 ? 's' : ''}`,
      })

      // Refresh stats
      setTimeout(() => window.location.reload(), 1000)
    } catch (error) {
      console.error('Error saving rating:', error)
      toast({
        title: "Error",
        description: "No se pudo guardar tu calificación",
        variant: "destructive"
      })
    }
  }

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

      {/* Lenguajes de Programación - Large Card */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="col-span-2 bg-gradient-to-br from-blue-50 to-indigo-100 rounded-xl p-4 border border-blue-200"
      >
        <div className="flex items-center gap-2 mb-3">
          <Code className="w-5 h-5 text-blue-600" />
          <h3 className="font-semibold text-blue-800">Lenguajes de programación utilizados en dentaxy</h3>
        </div>
        <div className="h-20">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={programmingLanguagesData}
                cx="50%"
                cy="50%"
                outerRadius={30}
                dataKey="percentage"
                label={({ name, percentage }) => `${name}: ${percentage}%`}
              >
                {programmingLanguagesData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      {/* Calificación de la App - Large Card */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="col-span-2 row-span-2 bg-white rounded-xl p-4 border border-gray-200 shadow-sm"
      >
        <div className="flex items-center gap-2 mb-4">
          <Star className="w-5 h-5 text-yellow-500" />
          <h3 className="font-semibold text-gray-800">Califica Dentaxy</h3>
        </div>
        
        <div className="grid grid-cols-2 gap-4 h-full">
          {/* Rating Section */}
          <div className="flex flex-col justify-center">
            <div className="text-center mb-4">
              <p className="text-2xl font-bold text-gray-800">{averageRating.toFixed(1)}</p>
              <p className="text-xs text-gray-600">{totalRatings} calificaciones</p>
            </div>
            
            <div className="flex justify-center gap-1 mb-4">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => handleRating(star)}
                  onMouseEnter={() => setHoveredStar(star)}
                  onMouseLeave={() => setHoveredStar(0)}
                  className="transition-transform hover:scale-110"
                >
                  <Star 
                    size={20} 
                    className={`${
                      star <= (hoveredStar || userRating) 
                        ? 'fill-yellow-400 text-yellow-400' 
                        : 'text-gray-300'
                    } transition-colors`} 
                  />
                </button>
              ))}
            </div>
            
            {userRating > 0 && (
              <p className="text-xs text-green-600 text-center">
                ¡Gracias por calificar con {userRating} estrella{userRating > 1 ? 's' : ''}!
              </p>
            )}
          </div>

          {/* Statistics Chart */}
          <div className="flex flex-col justify-center">
            <div className="h-24">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={ratingStats} layout="horizontal">
                  <XAxis type="number" fontSize={8} />
                  <YAxis type="category" dataKey="star" fontSize={8} />
                  <Bar dataKey="count" fill="#fbbf24" />
                </BarChart>
              </ResponsiveContainer>
            </div>
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