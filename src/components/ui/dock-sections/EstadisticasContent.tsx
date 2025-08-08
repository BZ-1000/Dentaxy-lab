import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AreaChart, Area, XAxis, YAxis, ResponsiveContainer, LineChart, Line, Tooltip, PieChart, Pie, Cell } from 'recharts';
import { Calendar, Star, TrendingUp, Users, Copy, Clock, Trophy, Bell, ChevronUp, X, Code, Zap, Crown, Award, Activity, ChevronRight, Plus, Plane, Mountain, Gamepad2 } from 'lucide-react';

const LiveMetricsDashboard = () => {
  const [activeUsers, setActiveUsers] = useState(24);
  const [copiedActions, setCopiedActions] = useState(156);
  const [avgMinutes, setAvgMinutes] = useState(42);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [sessionTime, setSessionTime] = useState(17);
  const [rating, setRating] = useState(0);
  const [hoveredStar, setHoveredStar] = useState(0);
  
  // Datos de gráfico de productividad con tiempo real
  const [chartData, setChartData] = useState([
    { label: 'L', minutes: 45, time: '09:00' },
    { label: 'M', minutes: 38, time: '10:15' },
    { label: 'X', minutes: 52, time: '08:30' },
    { label: 'J', minutes: 41, time: '11:00' },
    { label: 'V', minutes: 58, time: '09:45' },
    { label: 'S', minutes: 35, time: '14:20' },
    { label: 'D', minutes: sessionTime, time: currentTime.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }) }
  ]);

  // Top users dinámico
  const [topUsers, setTopUsers] = useState([
    { name: 'Alex R.', minutes: 180, avatar: '🚀', rank: 1, change: 'up' },
    { name: 'Maria S.', minutes: 165, avatar: '⚡', rank: 2, change: 'down' },
    { name: 'Carlos M.', minutes: 142, avatar: '🔥', rank: 3, change: 'up' }
  ]);

  // Lenguajes de programación
  const languageData = [
    { name: 'JavaScript', value: 35, color: '#F7DF1E' },
    { name: 'Python', value: 28, color: '#3776AB' },
    { name: 'React', value: 20, color: '#61DAFB' },
    { name: 'TypeScript', value: 17, color: '#3178C6' }
  ];

  // Notificaciones dentro del card
  const [notifications, setNotifications] = useState([
    { id: 1, type: 'update', message: 'Nueva funcionalidad: Autocompletado inteligente', time: '2 min', isNew: true },
    { id: 2, type: 'user', message: 'Sofia J. se unió a la plataforma', time: '5 min', isNew: true },
    { id: 3, type: 'achievement', message: 'Miguel alcanzó 500 horas de uso', time: '8 min', isNew: false }
  ]);

  // Actualizar tiempo y métricas en tiempo real
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      setCurrentTime(now);
      
      // Actualizar tiempo de sesión basado en tiempo real
      const startOfDay = new Date();
      startOfDay.setHours(8, 0, 0, 0);
      const minutesSinceStart = Math.floor((now - startOfDay) / (1000 * 60));
      const sessionMinutes = Math.max(1, Math.min(180, minutesSinceStart));
      setSessionTime(sessionMinutes);

      // Actualizar métricas en vivo
      setActiveUsers(prev => {
        const hourFactor = now.getHours() >= 9 && now.getHours() <= 17 ? 1.2 : 0.8;
        const base = Math.floor(20 * hourFactor + Math.random() * 10);
        return Math.max(15, Math.min(35, base));
      });

      setCopiedActions(prev => prev + Math.floor(Math.random() * 2));
      
      setAvgMinutes(prev => {
        const hourlyAvg = now.getHours() >= 14 ? 50 : 35;
        return hourlyAvg + (Math.random() - 0.5) * 10;
      });

      // Actualizar datos del gráfico
      setChartData(prev => {
        const newData = [...prev];
        newData[6] = {
          ...newData[6],
          minutes: sessionMinutes,
          time: now.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })
        };
        return newData;
      });
    }, 30000); // Actualizar cada 30 segundos

    return () => clearInterval(interval);
  }, []);

  // Rotar ranking
  useEffect(() => {
    const rankingInterval = setInterval(() => {
      setTopUsers(prev => {
        const shuffled = [...prev];
        if (Math.random() > 0.7) {
          [shuffled[0], shuffled[1]] = [shuffled[1], shuffled[0]];
          return shuffled.map((user, i) => ({
            ...user,
            rank: i + 1,
            change: i === 0 ? 'up' : i === 1 ? 'down' : 'same'
          }));
        }
        return prev;
      });
    }, 8000);

    return () => clearInterval(rankingInterval);
  }, []);

  // Nuevas notificaciones
  useEffect(() => {
    const notifInterval = setInterval(() => {
      const newNotifications = [
        'Nuevo usuario registrado: Ana P.',
        'Actualización aplicada: Mejoras de rendimiento',
        'Récord alcanzado: 1000 líneas de código compiladas',
        'Nueva función disponible: Export to PDF'
      ];

      if (Math.random() > 0.6) {
        const message = newNotifications[Math.floor(Math.random() * newNotifications.length)];
        setNotifications(prev => [
          { id: Date.now(), type: 'update', message, time: 'ahora', isNew: true },
          ...prev.slice(0, 2)
        ]);
      }
    }, 15000);

    return () => clearInterval(notifInterval);
  }, []);

  return (
    <div className="bg-gray-50 min-h-screen p-3">
      <div className="text-center mb-4">
        <h1 className="text-2xl font-bold text-gray-800">Estadísticas</h1>
        <p className="text-sm text-blue-500">Hello (colocar nombre de usuario), welcome back!</p>
      </div>

      {/* Sidebar izquierdo */}
      <div className="flex gap-3">
        <div className="w-48 space-y-3">
          {/* Eventos y actualizaciones */}
          <Card className="shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-xs font-semibold flex items-center gap-1">
                <Calendar size={12} />
                Eventos y actualizaciones
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0 p-2 space-y-2">
              <div className="text-xs">
                <div className="font-semibold">{currentTime.toLocaleDateString('es-ES', { day: 'numeric', month: 'long' })}</div>
                <div className="text-gray-500">{currentTime.toLocaleDateString('es-ES', { weekday: 'long' })} - {currentTime.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}</div>
              </div>
              
              <div className="max-h-24 overflow-y-auto space-y-1">
                {notifications.map((notif, index) => (
                  <div
                    key={notif.id}
                    className={`text-xs p-2 rounded transition-all duration-500 ${
                      notif.isNew ? 'bg-blue-50 border border-blue-200' : 'bg-gray-50'
                    }`}
                    style={{ animation: notif.isNew ? 'fadeInUp 0.5s ease-out' : 'none' }}
                  >
                    <div className="font-medium text-gray-900 leading-tight">{notif.message}</div>
                    <div className="text-gray-500 mt-1">{notif.time}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Activity Feed */}
          <Card className="shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-xs font-semibold">Activity Feed</CardTitle>
            </CardHeader>
            <CardContent className="pt-0 p-2">
              <div className="flex -space-x-1 mb-2">
                {['👨‍💼', '👩‍💻', '👨‍🎨', '👩‍🔬'].map((avatar, i) => (
                  <div key={i} className="w-5 h-5 bg-white rounded-full border flex items-center justify-center text-xs">
                    {avatar}
                  </div>
                ))}
                <div className="w-5 h-5 bg-gray-200 rounded-full border flex items-center justify-center">
                  <Plus size={8} className="text-gray-600" />
                </div>
              </div>
              <div className="flex gap-1">
                <Button variant="ghost" size="sm" className="text-xs h-5 px-2">Cancel</Button>
                <Button size="sm" className="text-xs h-5 px-2 bg-purple-600">More</Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Contenido principal */}
        <div className="flex-1 grid grid-cols-2 gap-3">
          {/* Mi Productividad */}
          <Card className="col-span-2 shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold">Mi Productividad</CardTitle>
              <p className="text-xs text-gray-500">Si aún no inicias sesión no podrás ver tu progreso</p>
            </CardHeader>
            <CardContent className="pt-0 p-3">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <div className="text-xl font-bold text-blue-600">{sessionTime} min</div>
                  <p className="text-xs text-gray-500">Hoy</p>
                </div>
                <div className="text-right text-xs">
                  <div className="font-medium">Promedio Hoy</div>
                  <div className="text-gray-500">{currentTime.toLocaleDateString('es-ES', { month: 'short', year: 'numeric' })}</div>
                </div>
              </div>

              <div className="h-24 mb-3">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData}>
                    <defs>
                      <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#8B5CF6" stopOpacity={0.4} />
                        <stop offset="100%" stopColor="#8B5CF6" stopOpacity={0.1} />
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="label" axisLine={false} tickLine={false} tick={{ fontSize: 10 }} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10 }} />
                    <Tooltip
                      content={({ active, payload }) => {
                        if (active && payload && payload[0]) {
                          const data = payload[0].payload;
                          return (
                            <div className="bg-white border rounded p-2 shadow-lg text-xs">
                              <div className="font-semibold">{data.label}</div>
                              <div className="text-purple-600">{data.minutes} minutos</div>
                              <div className="text-gray-500">Inicio: {data.time}</div>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="minutes"
                      stroke="#8B5CF6"
                      strokeWidth={2}
                      fill="url(#areaGradient)"
                      animationDuration={2000}
                      animationEasing="ease-in-out"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              <div className="text-xs text-center text-gray-600">
                Hoy llevas un 18% más que ayer ↗️
              </div>
            </CardContent>
          </Card>

          {/* Métricas en Vivo */}
          <Card className="shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                Métricas en Vivo
                <Plus size={12} className="text-gray-400" />
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0 p-2 space-y-2">
              <div className="flex items-center gap-2 p-2 bg-blue-50 rounded">
                <div className="p-1 bg-blue-500 rounded">
                  <Plane size={10} className="text-white" />
                </div>
                <div className="flex-1">
                  <div className="text-sm font-bold">${activeUsers * 10}</div>
                  <div className="text-xs text-gray-600">Usuarios Activos</div>
                  <div className="text-xs text-gray-500">12/12/20</div>
                </div>
                <ChevronRight size={8} className="text-gray-400" />
              </div>

              <div className="flex items-center gap-2 p-2 bg-orange-50 rounded">
                <div className="p-1 bg-orange-500 rounded">
                  <Mountain size={10} className="text-white" />
                </div>
                <div className="flex-1">
                  <div className="text-sm font-bold">${Math.floor(copiedActions / 10)}</div>
                  <div className="text-xs text-gray-600">Copias Realizadas</div>
                  <div className="text-xs text-gray-500">12/12/20</div>
                </div>
                <ChevronRight size={8} className="text-gray-400" />
              </div>

              <div className="flex items-center gap-2 p-2 bg-green-50 rounded">
                <div className="p-1 bg-green-500 rounded">
                  <Gamepad2 size={10} className="text-white" />
                </div>
                <div className="flex-1">
                  <div className="text-sm font-bold">${Math.floor(avgMinutes * 10)}</div>
                  <div className="text-xs text-gray-600">Min. Promedio</div>
                  <div className="text-xs text-gray-500">12/12/20</div>
                </div>
                <ChevronRight size={8} className="text-gray-400" />
              </div>
            </CardContent>
          </Card>

          {/* Get Great Loan */}
          <Card className="bg-gradient-to-br from-orange-500 to-red-500 text-white shadow-sm">
            <CardContent className="p-3">
              <h3 className="text-sm font-bold mb-1">Get great loan!</h3>
              <ChevronRight size={12} className="text-white/80" />
            </CardContent>
          </Card>

          {/* Ranking de Usuarios */}
          <Card className="shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold">Top Users</CardTitle>
            </CardHeader>
            <CardContent className="pt-0 p-2">
              <div className="space-y-1">
                {topUsers.map((user) => (
                  <div
                    key={user.name}
                    className="flex items-center gap-2 p-1 rounded text-xs transition-all duration-700"
                    style={{
                      transform: user.change === 'up' ? 'translateY(-2px)' : 
                                 user.change === 'down' ? 'translateY(2px)' : 'translateY(0)',
                      backgroundColor: user.rank === 1 ? '#FEF3C7' : 
                                     user.rank === 2 ? '#F3F4F6' : 
                                     user.rank === 3 ? '#FED7AA' : 'transparent'
                    }}
                  >
                    <div className="text-lg">{user.avatar}</div>
                    <div className="flex-1">
                      <div className="font-medium">{user.type || user.name}</div>
                      <div className="text-gray-500">{user.category || 'Usuario'}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold">{user.date || `${user.minutes}m`}</div>
                      <div className="text-gray-500">${user.amount || (user.minutes * 2)}</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Outcome Statistics */}
          <Card className="shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold">Outcome Statistics</CardTitle>
            </CardHeader>
            <CardContent className="pt-0 p-2 space-y-2">
              {languageData.map((lang, index) => (
                <div key={lang.name} className="flex items-center gap-2">
                  <div className="p-1 rounded bg-gray-100">
                    <Code size={10} style={{ color: lang.color }} />
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-xs font-medium">{lang.name}</span>
                      <span className="text-xs font-bold">{lang.value}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-1">
                      <div
                        className="h-1 rounded-full transition-all duration-2000 ease-out"
                        style={{
                          width: `${lang.value}%`,
                          backgroundColor: lang.color,
                          animation: `expandWidth 2s ease-out ${index * 0.3}s both`
                        }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Rating Card */}
          <Card className="shadow-sm">
            <CardContent className="p-3">
              <div className="text-center">
                <h3 className="text-sm font-bold mb-1">¿Cómo calificarías tu experiencia?</h3>
                <p className="text-xs text-gray-600 mb-2">¿Te parece fácil usar la app?</p>
                
                <div className="flex justify-center gap-1 mb-3">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onClick={() => setRating(star)}
                      onMouseEnter={() => setHoveredStar(star)}
                      onMouseLeave={() => setHoveredStar(0)}
                      className="transition-transform hover:scale-110"
                    >
                      <Star
                        size={14}
                        className={`${
                          star <= (hoveredStar || rating)
                            ? 'fill-yellow-400 text-yellow-400'
                            : 'text-gray-300'
                        } transition-colors duration-200`}
                      />
                    </button>
                  ))}
                </div>
                
                <div className="flex gap-1">
                  <Button variant="outline" size="sm" className="text-xs h-6 flex-1">
                    Cancel
                  </Button>
                  <Button 
                    size="sm" 
                    className="text-xs h-6 flex-1 bg-purple-600"
                    disabled={rating === 0}
                  >
                    Submit
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <style jsx global>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes expandWidth {
          from {
            width: 0;
          }
        }
      `}</style>
    </div>
  );
};

export default LiveMetricsDashboard;