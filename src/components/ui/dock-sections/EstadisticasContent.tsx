import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip, ReferenceDot } from 'recharts';
import { Calendar, Star, TrendingUp, ShoppingBag, Smartphone, User, Plus, ChevronRight, X, Plane, Mountain, Gamepad2, UserPlus } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useIsMobile } from '@/hooks/use-mobile';

const productivityData = [
  { name: 'Ene', value: 12 },
  { name: 'Feb', value: 19 },
  { name: 'Mar', value: 25 },
  { name: 'Abr', value: 22 },
  { name: 'May', value: 30 },
  { name: 'Jun', value: 28 },
  { name: 'Jul', value: 35 },
];

const transactionData = [
  { id: 1, type: 'Tesco Market', category: 'Shopping', date: '13 Dec 2020', amount: '$75.67', icon: ShoppingBag },
  { id: 2, type: 'ElectroMan Market', category: 'Shopping', date: '14 Dec 2020', amount: '$250.00', icon: ShoppingBag },
  { id: 3, type: 'Fiergio Restaurant', category: 'Food', date: '15 Dec 2020', amount: '$19.50', icon: User },
  { id: 4, type: 'John Mathew Kayne', category: 'Sports', date: '16 Dec 2020', amount: '$350', icon: TrendingUp },
  { id: 5, type: 'Ann Martin', category: 'Shopping', date: '17 Nov 2020', amount: '$430', icon: ShoppingBag },
];

const outcomeStats = [
  { label: 'Shopping', percentage: 52, color: 'bg-blue-500' },
  { label: 'Electronics', percentage: 21, color: 'bg-green-500' },
  { label: 'Travels', percentage: 74, color: 'bg-purple-500' },
];

const goals = [
  { title: '$550', subtitle: 'Holidays', current: 450, target: 550, icon: Plane, color: 'text-blue-500', bgColor: 'bg-blue-50' },
  { title: '$200', subtitle: 'Renovation', current: 120, target: 200, icon: Mountain, color: 'text-orange-500', bgColor: 'bg-orange-50' },
  { title: '$820', subtitle: 'Xbox', current: 680, target: 820, icon: Gamepad2, color: 'text-green-500', bgColor: 'bg-green-50' },
];

const events = [
  { date: '15', title: 'Team Meeting', time: '10:00 AM' },
  { date: '18', title: 'Project Review', time: '2:00 PM' },
  { date: '22', title: 'Client Call', time: '4:00 PM' },
];

const members = [
  { name: 'John D.', avatar: '👨‍💼', status: 'online' },
  { name: 'Sarah M.', avatar: '👩‍💻', status: 'away' },
  { name: 'Mike R.', avatar: '👨‍🎨', status: 'online' },
  { name: 'Anna K.', avatar: '👩‍🔬', status: 'offline' },
];

export const EstadisticasContent = () => {
  const { user } = useAuth();
  const isMobile = useIsMobile();
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [rating, setRating] = useState(0);
  const [hoveredStar, setHoveredStar] = useState(0);
  const [hoveredDay, setHoveredDay] = useState<number | null>(null);

  useEffect(() => {
    // Show rating modal after 3 seconds
    const timer = setTimeout(() => {
      setShowRatingModal(true);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  const handleStarClick = (starNumber: number) => {
    setRating(starNumber);
  };

  const handleStarHover = (starNumber: number) => {
    setHoveredStar(starNumber);
  };

  // Generate productivity data for current month
  const productivityData = useMemo(() => {
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    
    return Array.from({ length: daysInMonth }, (_, i) => {
      const day = i + 1;
      const randomActivity = user ? Math.floor(Math.random() * 60) + 5 : 0; // 5-65 minutes random
      return {
        day,
        minutes: randomActivity,
        date: `${day}/${currentMonth + 1}`
      };
    });
  }, [user]);

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-2 rounded-lg shadow-lg border text-xs">
          <p className="font-semibold">{`Día ${label}`}</p>
          <p className="text-primary">{`${payload[0].value} min`}</p>
        </div>
      );
    }
    return null;
  };

  // Mobile layout
  if (isMobile) {
    return (
      <div className="bg-background min-h-full p-4 space-y-6">
        {/* Header centrado */}
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-foreground mb-2">Estadísticas</h1>
          <p className="text-primary text-sm">
            {user ? (
              <>Hola <span className="font-semibold">{user.user_metadata?.display_name || user.email?.split('@')[0] || 'Usuario'}</span> ¡bienvenido de vuelta!</>
            ) : (
              'Inicia sesión para ver tus estadísticas'
            )}
          </p>
        </div>

        {/* Mi Productividad */}
        <Card className="shadow-lg">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg font-bold flex items-center gap-3">
              <span className="bg-primary/10 text-primary rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">1</span>
              Mi Productividad
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            {user ? (
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <div className="text-2xl font-bold text-primary">
                      {hoveredDay ? productivityData[hoveredDay - 1]?.minutes : 
                       productivityData.reduce((acc, day) => acc + day.minutes, 0) / productivityData.length}
                      <span className="text-sm text-muted-foreground ml-1">min</span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {hoveredDay ? `Día ${hoveredDay}` : 'Promedio diario'}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground">
                      {new Date().toLocaleDateString('es-ES', { month: 'long', year: 'numeric' })}
                    </p>
                  </div>
                </div>
                <div className="h-32">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={productivityData}>
                      <XAxis 
                        dataKey="day" 
                        axisLine={false} 
                        tickLine={false} 
                        className="text-xs"
                        interval="preserveStartEnd"
                      />
                      <YAxis hide />
                      <Tooltip content={<CustomTooltip />} />
                      <Line
                        type="monotone"
                        dataKey="minutes"
                        stroke="hsl(var(--primary))"
                        strokeWidth={3}
                        dot={{ fill: 'hsl(var(--primary))', strokeWidth: 2, r: 4 }}
                        activeDot={{ r: 6, stroke: 'hsl(var(--primary))', strokeWidth: 2 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="mb-4">
                  <TrendingUp size={48} className="mx-auto text-primary/60" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  Descubre tu verdadera eficiencia
                </h3>
                <p className="text-muted-foreground mb-6 text-sm leading-relaxed">
                  Registra tu actividad y visualiza en minutos el tiempo que dedicas a perfeccionar tus historias clínicas. Empieza a medir tu productividad ahora.
                </p>
                <Button className="w-full">
                  <UserPlus size={16} className="mr-2" />
                  Regístrate Gratis
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Goals */}
        <Card className="shadow-lg">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg font-bold flex items-center gap-3">
              <span className="bg-primary/10 text-primary rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">2</span>
              Goals
              <Plus size={16} className="ml-auto text-muted-foreground" />
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0 space-y-3">
            {goals.map((goal, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted/50"
              >
                <div className={`p-2 rounded-lg ${goal.bgColor}`}>
                  <goal.icon size={16} className={goal.color} />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-foreground">{goal.title}</span>
                    <span className="text-xs text-muted-foreground">12/12/20</span>
                  </div>
                  <p className="text-sm text-muted-foreground font-medium">{goal.subtitle}</p>
                </div>
                <ChevronRight size={16} className="text-muted-foreground" />
              </motion.div>
            ))}
          </CardContent>
        </Card>

        {/* Transaction History */}
        <Card className="shadow-lg">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg font-bold flex items-center gap-3">
              <span className="bg-primary/10 text-primary rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">3</span>
              Transaction history
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="space-y-3">
              {transactionData.slice(0, 4).map((transaction) => (
                <div key={transaction.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50">
                  <div className="p-2 rounded bg-muted">
                    <transaction.icon size={16} className="text-muted-foreground" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-foreground text-sm">{transaction.type}</span>
                      <span className="font-semibold text-foreground text-sm">{transaction.amount}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">{transaction.category}</span>
                      <span className="text-xs text-muted-foreground">{transaction.date}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Outcome Statistics */}
        <Card className="shadow-lg">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg font-bold flex items-center gap-3">
              <span className="bg-primary/10 text-primary rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">4</span>
              Outcome Statistics
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0 space-y-4">
            {outcomeStats.map((stat, index) => (
              <div key={index} className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${
                  stat.label === 'Shopping' ? 'bg-orange-50' : 
                  stat.label === 'Electronics' ? 'bg-green-50' : 'bg-blue-50'
                }`}>
                  {stat.label === 'Shopping' && <ShoppingBag size={16} className="text-orange-500" />}
                  {stat.label === 'Electronics' && <Smartphone size={16} className="text-green-500" />}
                  {stat.label === 'Travels' && <Plane size={16} className="text-blue-500" />}
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-foreground">{stat.label}</span>
                    <span className="text-sm font-bold text-foreground">{stat.percentage}%</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <motion.div
                      className={`h-2 rounded-full ${
                        stat.label === 'Shopping' ? 'bg-orange-500' : 
                        stat.label === 'Electronics' ? 'bg-green-500' : 'bg-blue-500'
                      }`}
                      initial={{ width: 0 }}
                      animate={{ width: `${stat.percentage}%` }}
                      transition={{ duration: 1, delay: index * 0.2 }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Eventos */}
        <Card className="shadow-lg border-l-4 border-l-blue-500">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg font-bold flex items-center gap-3 text-blue-600">
              <Calendar size={20} />
              Eventos y actualizaciones
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="space-y-3">
              <div>
                <div className="text-sm font-semibold text-foreground">20 September</div>
                <div className="text-xs text-muted-foreground">Sunday - All day</div>
              </div>
              {events.map((event, index) => (
                <div key={index} className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50">
                  <div className="bg-blue-100 text-blue-600 rounded-full w-8 h-8 flex items-center justify-center font-bold text-sm">
                    {event.date}
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-foreground text-sm">{event.title}</div>
                    <div className="text-xs text-muted-foreground">{event.time}</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Members */}
        <Card className="shadow-lg">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg font-bold flex items-center gap-3">
              <span className="bg-primary/10 text-primary rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">M</span>
              Members
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="grid grid-cols-2 gap-3 mb-4">
              {members.map((member, index) => (
                <div key={index} className="flex items-center gap-2 p-2 rounded-lg hover:bg-muted/50">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${
                    member.status === 'online' ? 'bg-gradient-to-br from-green-400 to-blue-500' :
                    member.status === 'away' ? 'bg-gradient-to-br from-yellow-400 to-orange-500' :
                    'bg-gradient-to-br from-gray-400 to-gray-600'
                  }`}>
                    <span className="text-white">{member.avatar}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-foreground truncate">{member.name}</div>
                    <div className={`text-xs ${
                      member.status === 'online' ? 'text-green-600' :
                      member.status === 'away' ? 'text-yellow-600' :
                      'text-gray-500'
                    }`}>
                      {member.status}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <Button variant="outline" className="flex-1 text-sm">Cancel</Button>
              <Button className="flex-1 text-sm">More</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Desktop layout
  return (
    <div className="bg-background h-full">
      {/* Header centrado fuera del layout principal */}
      <div className="text-center py-6 px-4">
        <h1 className="text-3xl font-bold text-foreground mb-2">Estadísticas</h1>
        <p className="text-primary text-base">
          {user ? (
            <>Hola <span className="font-semibold">{user.user_metadata?.display_name || user.email?.split('@')[0] || 'Usuario'}</span> ¡bienvenido de vuelta!</>
          ) : (
            'Inicia sesión para ver tus estadísticas'
          )}
        </p>
      </div>

      <div className="flex h-full">
        {/* Barra Lateral Izquierda */}
        <div className="w-72 p-4 border-r border-border space-y-4">
          {/* Dental Basics Academy Header */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-xl border border-blue-200">
            <h2 className="text-lg font-bold text-blue-800 mb-1">Dental Basics Academy</h2>
            <p className="text-xs text-blue-600">Tu centro de conocimiento dental</p>
          </div>

          {/* Eventos y actualizaciones */}
          <Card className="shadow-lg border-l-4 border-l-blue-500">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-bold flex items-center gap-2 text-blue-600">
                <Calendar size={16} />
                Eventos y actualizaciones
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0 p-3">
              <div className="space-y-3">
                <div>
                  <div className="text-sm font-semibold text-foreground">20 September</div>
                  <div className="text-xs text-muted-foreground">Sunday - All day</div>
                </div>
                {events.map((event, index) => (
                  <div key={index} className="flex items-center gap-2 p-2 rounded-lg hover:bg-blue-50 transition-colors">
                    <div className="bg-blue-100 text-blue-600 rounded-full w-6 h-6 flex items-center justify-center font-bold text-xs">
                      {event.date}
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-foreground text-sm">{event.title}</div>
                      <div className="text-xs text-muted-foreground">{event.time}</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Members */}
          <Card className="shadow-lg">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-bold text-foreground">Members</CardTitle>
            </CardHeader>
            <CardContent className="pt-0 p-3">
              <div className="space-y-2 mb-3">
                {members.map((member, index) => (
                  <div key={index} className="flex items-center gap-2 p-2 rounded-lg hover:bg-muted/50 transition-colors">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs relative ${
                      member.status === 'online' ? 'bg-gradient-to-br from-green-400 to-blue-500' :
                      member.status === 'away' ? 'bg-gradient-to-br from-yellow-400 to-orange-500' :
                      'bg-gradient-to-br from-gray-400 to-gray-600'
                    }`}>
                      <span className="text-white">{member.avatar}</span>
                      <div className={`absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full border border-white ${
                        member.status === 'online' ? 'bg-green-500' :
                        member.status === 'away' ? 'bg-yellow-500' :
                        'bg-gray-500'
                      }`} />
                    </div>
                    <div className="flex-1">
                      <div className="text-sm font-medium text-foreground">{member.name}</div>
                      <div className={`text-xs ${
                        member.status === 'online' ? 'text-green-600' :
                        member.status === 'away' ? 'text-yellow-600' :
                        'text-gray-500'
                      }`}>
                        {member.status}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="flex-1 text-xs">Cancel</Button>
                <Button size="sm" className="flex-1 text-xs">More</Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Contenido Principal */}
        <div className="flex-1 p-6 space-y-6">
          {/* Grid Principal */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Mi Productividad */}
            <div className="lg:col-span-2">
              <Card className="shadow-lg h-full">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg font-bold flex items-center gap-3">
                    <span className="bg-primary/10 text-primary rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">1</span>
                    Mi Productividad
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  {user ? (
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <div className="text-3xl font-bold text-primary">
                            {hoveredDay ? productivityData[hoveredDay - 1]?.minutes : 
                             Math.round(productivityData.reduce((acc, day) => acc + day.minutes, 0) / productivityData.length)}
                            <span className="text-lg text-muted-foreground ml-1">min</span>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {hoveredDay ? `Día ${hoveredDay}` : 'Promedio diario'}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-muted-foreground">
                            {new Date().toLocaleDateString('es-ES', { month: 'long', year: 'numeric' })}
                          </p>
                        </div>
                      </div>
                      <div className="h-32">
                        <ResponsiveContainer width="100%" height="100%">
                          <LineChart data={productivityData}>
                            <XAxis 
                              dataKey="day" 
                              axisLine={false} 
                              tickLine={false} 
                              className="text-xs"
                              interval="preserveStartEnd"
                            />
                            <YAxis hide />
                            <Tooltip content={<CustomTooltip />} />
                            <Line
                              type="monotone"
                              dataKey="minutes"
                              stroke="hsl(var(--primary))"
                              strokeWidth={3}
                              dot={{ fill: 'hsl(var(--primary))', strokeWidth: 2, r: 4 }}
                              activeDot={{ r: 6, stroke: 'hsl(var(--primary))', strokeWidth: 2 }}
                            />
                          </LineChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <div className="mb-4">
                        <TrendingUp size={64} className="mx-auto text-primary/60" />
                      </div>
                      <h3 className="text-xl font-semibold text-foreground mb-3">
                        Descubre tu verdadera eficiencia
                      </h3>
                      <p className="text-muted-foreground mb-6 leading-relaxed max-w-md mx-auto">
                        Registra tu actividad y visualiza en minutos el tiempo que dedicas a perfeccionar tus historias clínicas. Empieza a medir tu productividad ahora.
                      </p>
                      <Button size="lg" className="px-8">
                        <UserPlus size={20} className="mr-2" />
                        Regístrate Gratis
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Goals */}
            <div>
              <Card className="shadow-lg h-full">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg font-bold flex items-center gap-3">
                    <span className="bg-primary/10 text-primary rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">2</span>
                    Goals
                    <Plus size={16} className="ml-auto text-muted-foreground" />
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0 space-y-3">
                  {goals.map((goal, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50 transition-colors"
                    >
                      <div className={`p-2 rounded-lg ${goal.bgColor}`}>
                        <goal.icon size={16} className={goal.color} />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-foreground">{goal.title}</span>
                          <span className="text-xs text-muted-foreground">12/12/20</span>
                        </div>
                        <p className="text-sm text-muted-foreground font-medium">{goal.subtitle}</p>
                      </div>
                      <ChevronRight size={14} className="text-muted-foreground" />
                    </motion.div>
                  ))}
                </CardContent>
              </Card>
            </div>

            {/* Get Great Loan Card */}
            <div>
              <Card className="bg-gradient-to-br from-orange-500 to-red-500 text-white shadow-lg h-full">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="bg-white/20 rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">6</span>
                  </div>
                  <h3 className="text-lg font-bold mb-2">Get great loan!</h3>
                  <div className="flex items-center justify-between">
                    <ChevronRight size={18} className="text-white/80" />
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Segunda Fila */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Transaction History */}
            <Card className="shadow-lg">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg font-bold flex items-center gap-3">
                  <span className="bg-primary/10 text-primary rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">3</span>
                  Transaction history
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="text-muted-foreground border-b">
                        <th className="text-left pb-2 font-semibold">Receiver</th>
                        <th className="text-left pb-2 font-semibold">Type</th>
                        <th className="text-left pb-2 font-semibold">Date</th>
                        <th className="text-right pb-2 font-semibold">Amount</th>
                      </tr>
                    </thead>
                    <tbody>
                      {transactionData.slice(0, 4).map((transaction) => (
                        <tr key={transaction.id} className="border-b last:border-b-0 hover:bg-muted/50">
                          <td className="py-2">
                            <div className="flex items-center gap-2">
                              <div className="p-1.5 rounded bg-muted">
                                <transaction.icon size={14} className="text-muted-foreground" />
                              </div>
                              <span className="font-medium text-foreground">{transaction.type}</span>
                            </div>
                          </td>
                          <td className="py-2 text-muted-foreground">{transaction.category}</td>
                          <td className="py-2 text-muted-foreground">{transaction.date}</td>
                          <td className="py-2 text-right font-semibold text-foreground">{transaction.amount}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>

            {/* Outcome Statistics */}
            <Card className="shadow-lg">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg font-bold flex items-center gap-3">
                  <span className="bg-primary/10 text-primary rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">4</span>
                  Outcome Statistics
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0 space-y-4">
                {outcomeStats.map((stat, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${
                      stat.label === 'Shopping' ? 'bg-orange-50' : 
                      stat.label === 'Electronics' ? 'bg-green-50' : 'bg-blue-50'
                    }`}>
                      {stat.label === 'Shopping' && <ShoppingBag size={16} className="text-orange-500" />}
                      {stat.label === 'Electronics' && <Smartphone size={16} className="text-green-500" />}
                      {stat.label === 'Travels' && <Plane size={16} className="text-blue-500" />}
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-medium text-foreground">{stat.label}</span>
                        <span className="font-bold text-foreground">{stat.percentage}%</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <motion.div
                          className={`h-2 rounded-full ${
                            stat.label === 'Shopping' ? 'bg-orange-500' : 
                            stat.label === 'Electronics' ? 'bg-green-500' : 'bg-blue-500'
                          }`}
                          initial={{ width: 0 }}
                          animate={{ width: `${stat.percentage}%` }}
                          transition={{ duration: 1, delay: index * 0.2 }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Rating Modal - Fixed Bottom Left */}
      <AnimatePresence>
        {showRatingModal && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className={`fixed ${isMobile ? 'bottom-4 left-4 right-4' : 'bottom-6 left-6'} z-50`}
          >
            <Card className="bg-background shadow-xl border border-border">
              <CardContent className={`${isMobile ? 'p-4' : 'p-3'}`}>
                <div className="flex items-center gap-2 mb-3">
                  <span className="bg-primary/10 text-primary rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">5</span>
                  <h3 className="text-sm font-bold text-foreground">Rate your experience</h3>
                  <button
                    onClick={() => setShowRatingModal(false)}
                    className="ml-auto text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <X size={16} />
                  </button>
                </div>
                
                <p className="text-sm text-muted-foreground mb-4">Do you find the app easy to use?</p>
                
                <div className="flex justify-center gap-1 mb-4">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onClick={() => handleStarClick(star)}
                      onMouseEnter={() => handleStarHover(star)}
                      onMouseLeave={() => setHoveredStar(0)}
                      className="transition-transform hover:scale-110"
                    >
                      <Star
                        size={20}
                        className={`${
                          star <= (hoveredStar || rating)
                            ? 'fill-yellow-400 text-yellow-400'
                            : 'text-muted-foreground'
                        } transition-colors`}
                      />
                    </button>
                  ))}
                </div>
                
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={() => setShowRatingModal(false)}
                    className="flex-1 text-sm"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={() => {
                      setShowRatingModal(false);
                      // Handle rating submission here
                    }}
                    className="flex-1 text-sm"
                    disabled={rating === 0}
                  >
                    Submit
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};