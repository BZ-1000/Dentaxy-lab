import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { AreaChart, Area, XAxis, YAxis, ResponsiveContainer } from 'recharts';
import { Calendar, Star, TrendingUp, ShoppingBag, Smartphone, User, Plus, ChevronRight, X, Plane, Mountain, Gamepad2 } from 'lucide-react';
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
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [rating, setRating] = useState(0);
  const [hoveredStar, setHoveredStar] = useState(0);
  const isMobile = useIsMobile();

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

  if (isMobile) {
    // Layout móvil: apilado verticalmente
    return (
      <div className="bg-white h-full overflow-auto">
        {/* Header fuera del contenido principal */}
        <div className="text-center p-4 border-b border-gray-100">
          <h1 className="text-lg font-bold text-gray-900 mb-1">Estadísticas</h1>
          <p className="text-blue-500 text-xs">Hello <span className="text-blue-600 font-medium">(colocar nombre de usuario)</span>, welcome back!</p>
        </div>

        <div className="p-3 space-y-4">
          {/* Mi Productividad - Ancho Completo */}
          <Card className="shadow-sm">
            <CardHeader className="pb-1">
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <span className="bg-gray-100 rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold">1</span>
                Mi Productividad
              </CardTitle>
              <p className="text-xs text-gray-500">Si aún no inicias sesión no podras ver tu progreso</p>
            </CardHeader>
            <CardContent className="pt-0 p-3">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <div className="text-xl font-bold text-purple-600">17 min</div>
                  <p className="text-xs text-gray-500">May</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-500">March 2020</p>
                </div>
              </div>
              <div className="h-20">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={productivityData}>
                    <defs>
                      <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0.1}/>
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="name" axisLine={false} tickLine={false} className="text-xs" />
                    <YAxis hide />
                    <Area
                      type="monotone"
                      dataKey="value"
                      stroke="#8b5cf6"
                      strokeWidth={2}
                      fill="url(#colorUv)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Goals - Stack Vertical */}
          <Card className="shadow-sm">
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
                  className="flex items-center gap-2 p-2 rounded-lg bg-gray-50"
                >
                  <div className={`p-2 rounded-lg ${goal.bgColor}`}>
                    <goal.icon size={16} className={goal.color} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-bold text-gray-900">{goal.title}</span>
                      <span className="text-xs text-gray-500">12/12/20</span>
                    </div>
                    <p className="text-xs text-gray-600 font-medium">{goal.subtitle}</p>
                  </div>
                  <ChevronRight size={12} className="text-gray-400" />
                </motion.div>
              ))}
            </CardContent>
          </Card>

          {/* Get Great Loan */}
          <Card className="bg-gradient-to-br from-orange-500 to-red-500 text-white shadow-lg">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="bg-white/20 rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">6</span>
              </div>
              <h3 className="text-base font-bold mb-1">Get great loan!</h3>
              <div className="flex items-center justify-between">
                <ChevronRight size={16} className="text-white/80" />
              </div>
            </CardContent>
          </Card>

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
                      <th className="text-left pb-1 font-medium whitespace-nowrap">Receiver</th>
                      <th className="text-left pb-1 font-medium whitespace-nowrap">Type</th>
                      <th className="text-left pb-1 font-medium whitespace-nowrap">Date</th>
                      <th className="text-right pb-1 font-medium whitespace-nowrap">Amount</th>
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
                            <span className="font-medium text-gray-900 text-xs whitespace-nowrap">{transaction.type}</span>
                          </div>
                        </td>
                        <td className="py-1 text-gray-600 text-xs whitespace-nowrap">{transaction.category}</td>
                        <td className="py-1 text-gray-500 text-xs whitespace-nowrap">{transaction.date}</td>
                        <td className="py-1 text-right font-semibold text-gray-900 text-xs whitespace-nowrap">{transaction.amount}</td>
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
            <CardContent className="pt-0 p-2 space-y-3">
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
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm font-medium text-gray-700">{stat.label}</span>
                      <span className="text-sm font-bold text-gray-900">{stat.percentage}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
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

          {/* Eventos y actualizaciones - Móvil */}
          <Card className="shadow-sm">
            <CardHeader className="pb-1">
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <span className="bg-gray-100 rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold">7</span>
                <Calendar size={14} />
                Eventos y actualizaciones
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0 p-3">
              <div className="space-y-2">
                <div className="text-sm font-semibold">20 September</div>
                <div className="text-xs text-gray-500">Sunday - All day</div>
                {events.map((event, index) => (
                  <div key={index} className="text-sm p-2 rounded bg-gray-50">
                    <div className="font-medium">{event.title}</div>
                    <div className="text-gray-500 text-xs">{event.time}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Members - Móvil */}
          <Card className="shadow-sm">
            <CardHeader className="pb-1">
              <CardTitle className="text-sm font-semibold">Members</CardTitle>
            </CardHeader>
            <CardContent className="pt-0 p-3">
              <div className="flex -space-x-1 mb-3">
                {members.slice(0, 4).map((member, index) => (
                  <div key={index} className="w-8 h-8 bg-gray-100 rounded-full border-2 border-white flex items-center justify-center">
                    <span className="text-sm">{member.avatar}</span>
                  </div>
                ))}
                <div className="w-8 h-8 bg-gray-200 rounded-full border-2 border-white flex items-center justify-center">
                  <span className="text-sm text-gray-600">+</span>
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="ghost" size="sm" className="text-sm flex-1">Cancel</Button>
                <Button size="sm" className="text-sm flex-1 bg-purple-600 hover:bg-purple-700">More</Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Rating Modal - Móvil */}
        {showRatingModal && (
          <div className="fixed bottom-4 left-4 right-4 z-40">
            <Card className="bg-white shadow-lg border">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="bg-gray-100 rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold">5</span>
                  <h3 className="text-sm font-bold text-gray-900">Rate your experience</h3>
                  <button
                    onClick={() => setShowRatingModal(false)}
                    className="ml-auto text-gray-400 hover:text-gray-600"
                  >
                    <X size={14} />
                  </button>
                </div>
                
                <p className="text-sm text-gray-600 mb-3">Do you find the app easy to use?</p>
                
                <div className="flex justify-center gap-2 mb-4">
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
                            : 'text-gray-300'
                        } transition-colors`}
                      />
                    </button>
                  ))}
                </div>
                
                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    onClick={() => setShowRatingModal(false)}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={() => {
                      setShowRatingModal(false);
                      // Handle rating submission here
                    }}
                    className="flex-1 bg-purple-600 hover:bg-purple-700"
                    disabled={rating === 0}
                  >
                    Submit
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    );
  }

  // Layout desktop: with title outside and enhanced sidebar
  return (
    <div className="bg-white h-full flex flex-col">
      {/* Header fuera del contenido principal - Desktop */}
      <div className="text-center p-4 border-b border-gray-100">
        <h1 className="text-xl font-bold text-gray-900 mb-1">Estadísticas</h1>
        <p className="text-blue-500 text-xs">Hello <span className="text-blue-600 font-medium">(colocar nombre de usuario)</span>, welcome back!</p>
      </div>
      
      <div className="flex flex-1">
        {/* Barra Lateral Izquierda - Eventos (Rediseñada) */}
        <div className="w-56 p-3 border-r border-gray-200 space-y-3 hidden lg:block">
          {/* Header de la barra lateral */}
          <div className="flex items-center gap-2 mb-4">
            <div className="p-2 bg-blue-50 rounded-lg">
              <span className="text-lg">🦷</span>
            </div>
            <div>
              <h3 className="text-sm font-bold text-gray-900">Dental Basics Academy</h3>
              <p className="text-xs text-gray-500">Learning platform</p>
            </div>
          </div>

          {/* Eventos y actualizaciones */}
          <Card className="shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <span className="bg-blue-100 rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold text-blue-600">7</span>
                <Calendar size={14} className="text-blue-600" />
                Eventos y actualizaciones
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0 p-3">
              <div className="space-y-3">
                <div className="bg-blue-50 p-3 rounded-lg">
                  <div className="text-sm font-semibold text-blue-900">20 September</div>
                  <div className="text-xs text-blue-600 mb-2">Sunday - All day</div>
                  <div className="space-y-2">
                    {events.map((event, index) => (
                      <div key={index} className="flex items-center gap-2 p-2 rounded bg-white">
                        <div className="w-6 h-6 bg-blue-100 rounded text-xs font-bold flex items-center justify-center text-blue-600">
                          {event.date}
                        </div>
                        <div className="flex-1">
                          <div className="text-xs font-medium text-gray-900">{event.title}</div>
                          <div className="text-xs text-gray-500">{event.time}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Members */}
          <Card className="shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold">Members</CardTitle>
            </CardHeader>
            <CardContent className="pt-0 p-3">
              <div className="space-y-3">
                <div className="flex -space-x-2 mb-3">
                  {members.slice(0, 4).map((member, index) => (
                    <div key={index} className="w-8 h-8 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full border-2 border-white flex items-center justify-center relative">
                      <span className="text-xs text-white">{member.avatar}</span>
                      <div className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border border-white ${
                        member.status === 'online' ? 'bg-green-400' : 
                        member.status === 'away' ? 'bg-yellow-400' : 'bg-gray-400'
                      }`}></div>
                    </div>
                  ))}
                  <div className="w-8 h-8 bg-gray-200 rounded-full border-2 border-white flex items-center justify-center">
                    <Plus size={12} className="text-gray-600" />
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="ghost" size="sm" className="text-xs flex-1 h-8">Cancel</Button>
                  <Button size="sm" className="text-xs flex-1 h-8 bg-blue-600 hover:bg-blue-700">More</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Contenido Principal */}
        <div className="flex-1 p-3 space-y-3">
          {/* Grid Principal - Cards Compactos */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
            {/* Mi Productividad */}
            <div className="md:col-span-2">
              <Card className="shadow-sm h-full">
                <CardHeader className="pb-1">
                  <CardTitle className="text-sm font-semibold flex items-center gap-2">
                    <span className="bg-gray-100 rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold">1</span>
                    Mi Productividad
                  </CardTitle>
                  <p className="text-xs text-gray-500">Si aún no inicias sesión no podras ver tu progreso</p>
                </CardHeader>
                <CardContent className="pt-0 p-3">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <div className="text-xl font-bold text-purple-600">17 min</div>
                      <p className="text-xs text-gray-500">May</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-gray-500">March 2020</p>
                    </div>
                  </div>
                  <div className="h-20">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={productivityData}>
                        <defs>
                          <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.8}/>
                            <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0.1}/>
                          </linearGradient>
                        </defs>
                        <XAxis dataKey="name" axisLine={false} tickLine={false} className="text-xs" />
                        <YAxis hide />
                        <Area
                          type="monotone"
                          dataKey="value"
                          stroke="#8b5cf6"
                          strokeWidth={2}
                          fill="url(#colorUv)"
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Goals */}
            <div className="md:col-span-1">
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
            <div className="md:col-span-1">
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
      </div>

      {/* Rating Modal - Fixed Bottom Left (Desktop) */}
      {showRatingModal && (
        <div className="fixed bottom-4 left-4 z-40 hidden lg:block">
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
      )}
    </div>
  );
};