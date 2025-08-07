import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { AreaChart, Area, XAxis, YAxis, ResponsiveContainer, LineChart, Line, Tooltip } from 'recharts';
import { Calendar, Star, TrendingUp, ShoppingBag, Smartphone, User, Plus, ChevronRight, X, Plane, Mountain, Gamepad2, Activity, ArrowRight } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

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
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [rating, setRating] = useState(0);
  const [hoveredStar, setHoveredStar] = useState(0);
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

  return (
    <div className="bg-white h-full flex">
      {/* Barra Lateral Izquierda - Eventos */}
      <div className="w-48 p-2 border-r border-gray-200 space-y-2">
        {/* Eventos y actualizaciones */}
        <Card className="shadow-sm">
          <CardHeader className="pb-1">
            <CardTitle className="text-xs font-semibold flex items-center gap-1">
              <Calendar size={12} />
              Eventos y actualizaciones
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0 p-2">
            <div className="space-y-1">
              <div className="text-xs font-semibold">20 September</div>
              <div className="text-xs text-gray-500">Sunday - All day</div>
              {events.map((event, index) => (
                <div key={index} className="text-xs p-1 rounded hover:bg-gray-50">
                  <div className="font-medium">{event.title}</div>
                  <div className="text-gray-500">{event.time}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Members */}
        <Card className="shadow-sm">
          <CardHeader className="pb-1">
            <CardTitle className="text-xs font-semibold">Members</CardTitle>
          </CardHeader>
          <CardContent className="pt-0 p-2">
            <div className="flex -space-x-1 mb-2">
              {members.slice(0, 4).map((member, index) => (
                <div key={index} className="w-5 h-5 bg-gray-100 rounded-full border border-white flex items-center justify-center">
                  <span className="text-xs">{member.avatar}</span>
                </div>
              ))}
              <div className="w-5 h-5 bg-gray-200 rounded-full border border-white flex items-center justify-center">
                <span className="text-xs text-gray-600">+</span>
              </div>
            </div>
            <div className="flex gap-1">
              <Button variant="ghost" size="sm" className="text-xs h-5 px-2">Cancel</Button>
              <Button size="sm" className="text-xs h-5 px-2 bg-purple-600 hover:bg-purple-700">More</Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Contenido Principal */}
      <div className="flex-1 p-3 space-y-3">
        {/* Header */}
        <div className="text-center mb-3">
          <h1 className="text-xl font-bold text-gray-900 mb-1">Estadísticas</h1>
          <p className="text-blue-500 text-xs">Hello <span className="text-blue-600 font-medium">(colocar nombre de usuario)</span>, welcome back!</p>
        </div>

        {/* Grid Principal - Cards Compactos */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-3">
          {/* Mi Productividad */}
          <div className="lg:col-span-2">
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
          </div>

          {/* Goals */}
          <div>
            <Card className="shadow-sm h-full">
              <CardHeader className="pb-1">
                <CardTitle className="text-sm font-semibold flex items-center gap-2">
                  <span className="bg-gray-100 rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold">2</span>
                  Goals
                  <Plus size={12} className="ml-auto text-gray-400" />
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0 p-2 space-y-2">
                {goals.map((goal, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center gap-2 p-1 rounded-lg hover:bg-gray-50"
                  >
                    <div className={`p-1 rounded-lg ${goal.bgColor}`}>
                      <goal.icon size={12} className={goal.color} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-bold text-gray-900">{goal.title}</span>
                        <span className="text-xs text-gray-500">12/12/20</span>
                      </div>
                      <p className="text-xs text-gray-600 font-medium">{goal.subtitle}</p>
                    </div>
                    <ChevronRight size={10} className="text-gray-400" />
                  </motion.div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Get Great Loan Card */}
          <div>
            <Card className="bg-gradient-to-br from-orange-500 to-red-500 text-white shadow-lg h-full">
              <CardContent className="p-3">
                <div className="flex items-center gap-2 mb-2">
                  <span className="bg-white/20 rounded-full w-4 h-4 flex items-center justify-center text-xs font-bold">6</span>
                </div>
                <h3 className="text-sm font-bold mb-1">Get great loan!</h3>
                <div className="flex items-center justify-between">
                  <ChevronRight size={14} className="text-white/80" />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Segunda Fila - Transaction History y Outcome Statistics */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
          {/* Transaction History */}
          <Card className="shadow-sm">
            <CardHeader className="pb-1">
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <span className="bg-gray-100 rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold">3</span>
                Transaction history
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0 p-2">
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="text-gray-500 border-b">
                      <th className="text-left pb-1 font-medium">Receiver</th>
                      <th className="text-left pb-1 font-medium">Type</th>
                      <th className="text-left pb-1 font-medium">Date</th>
                      <th className="text-right pb-1 font-medium">Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {transactionData.slice(0, 3).map((transaction) => (
                      <tr key={transaction.id} className="border-b last:border-b-0">
                        <td className="py-1">
                          <div className="flex items-center gap-1">
                            <div className="p-1 rounded bg-gray-100">
                              <transaction.icon size={10} className="text-gray-600" />
                            </div>
                            <span className="font-medium text-gray-900 text-xs">{transaction.type}</span>
                          </div>
                        </td>
                        <td className="py-1 text-gray-600 text-xs">{transaction.category}</td>
                        <td className="py-1 text-gray-500 text-xs">{transaction.date}</td>
                        <td className="py-1 text-right font-semibold text-gray-900 text-xs">{transaction.amount}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* Outcome Statistics */}
          <Card className="shadow-sm">
            <CardHeader className="pb-1">
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <span className="bg-gray-100 rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold">4</span>
                Outcome Statistics
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0 p-2 space-y-2">
              {outcomeStats.map((stat, index) => (
                <div key={index} className="flex items-center gap-2">
                  <div className={`p-1 rounded-lg ${
                    stat.label === 'Shopping' ? 'bg-orange-50' : 
                    stat.label === 'Electronics' ? 'bg-green-50' : 'bg-blue-50'
                  }`}>
                    {stat.label === 'Shopping' && <ShoppingBag size={12} className="text-orange-500" />}
                    {stat.label === 'Electronics' && <Smartphone size={12} className="text-green-500" />}
                    {stat.label === 'Travels' && <Plane size={12} className="text-blue-500" />}
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-xs font-medium text-gray-700">{stat.label}</span>
                      <span className="text-xs font-bold text-gray-900">{stat.percentage}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-1.5">
                      <motion.div
                        className={`h-1.5 rounded-full ${
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

      {/* Rating Modal - Fixed Bottom Left */}
      <div className="fixed bottom-4 left-4 z-40">
        <Card className="bg-white shadow-lg border w-64">
          <CardContent className="p-3">
            <div className="flex items-center gap-2 mb-2">
              <span className="bg-gray-100 rounded-full w-4 h-4 flex items-center justify-center text-xs font-bold">5</span>
              <h3 className="text-xs font-bold text-gray-900">Rate your experience</h3>
              <button
                onClick={() => setShowRatingModal(false)}
                className="ml-auto text-gray-400 hover:text-gray-600"
              >
                <X size={12} />
              </button>
            </div>
            
            <p className="text-xs text-gray-600 mb-2">Do you find the app easy to use?</p>
            
            <div className="flex justify-center gap-1 mb-3">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => handleStarClick(star)}
                  onMouseEnter={() => handleStarHover(star)}
                  onMouseLeave={() => setHoveredStar(0)}
                  className="transition-transform hover:scale-110"
                >
                  <Star
                    size={16}
                    className={`${
                      star <= (hoveredStar || rating)
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'text-gray-300'
                    } transition-colors`}
                  />
                </button>
              ))}
            </div>
            
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => setShowRatingModal(false)}
                className="flex-1 text-xs h-6"
              >
                Cancel
              </Button>
              <Button
                onClick={() => {
                  setShowRatingModal(false);
                  // Handle rating submission here
                }}
                className="flex-1 text-xs h-6 bg-purple-600 hover:bg-purple-700"
                disabled={rating === 0}
              >
                Submit
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};