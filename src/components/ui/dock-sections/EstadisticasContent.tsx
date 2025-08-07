import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { AreaChart, Area, XAxis, YAxis, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Calendar, Star, TrendingUp, ShoppingBag, Smartphone, Plane, User, Plus, ChevronRight, X } from 'lucide-react';

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
  { id: 1, type: 'Shopping', amount: '$120', date: 'Today', icon: ShoppingBag, color: 'text-blue-500' },
  { id: 2, type: 'Food & Dining', amount: '$45', date: 'Yesterday', icon: User, color: 'text-green-500' },
  { id: 3, type: 'Transportation', amount: '$30', date: '2 days ago', icon: TrendingUp, color: 'text-purple-500' },
  { id: 4, type: 'Entertainment', amount: '$85', date: '3 days ago', icon: Smartphone, color: 'text-orange-500' },
];

const outcomeStats = [
  { label: 'Shopping', percentage: 52, color: 'bg-blue-500' },
  { label: 'Electronics', percentage: 21, color: 'bg-green-500' },
  { label: 'Travels', percentage: 74, color: 'bg-purple-500' },
];

const goals = [
  { title: '$550 Holidays', current: 450, target: 550, color: 'bg-blue-500' },
  { title: '$200 Renovation', current: 120, target: 200, color: 'bg-orange-500' },
  { title: '$820 Xbox', current: 680, target: 820, color: 'bg-green-500' },
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Estadísticas</h1>
          <p className="text-gray-600">Bienvenido de vuelta, aquí tienes tu resumen</p>
        </div>

        <div className="grid grid-cols-12 gap-6">
          {/* Main Content Area */}
          <div className="col-span-12 lg:col-span-8 space-y-6">
            {/* Mi Productividad */}
            <Card className="bg-white shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg font-semibold">Mi Productividad</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <div className="text-4xl font-bold text-purple-600">17 min</div>
                    <p className="text-sm text-gray-500">Tiempo promedio hoy</p>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-semibold text-green-600">+12%</div>
                    <p className="text-sm text-gray-500">vs. ayer</p>
                  </div>
                </div>
                <div className="h-48">
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
                        strokeWidth={3}
                        fill="url(#colorUv)"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Goals */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {goals.map((goal, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="bg-white shadow-sm">
                    <CardContent className="p-4">
                      <h3 className="font-semibold text-gray-900 mb-2">{goal.title}</h3>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-2xl font-bold">${goal.current}</span>
                        <span className="text-sm text-gray-500">/ ${goal.target}</span>
                      </div>
                      <Progress 
                        value={(goal.current / goal.target) * 100} 
                        className="h-2"
                      />
                      <p className="text-xs text-gray-500 mt-2">
                        {Math.round((goal.current / goal.target) * 100)}% completado
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>

            {/* Transaction History */}
            <Card className="bg-white shadow-sm">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-lg font-semibold">Transaction History</CardTitle>
                <Button variant="ghost" size="sm">
                  Ver todo
                </Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {transactionData.map((transaction) => (
                    <div key={transaction.id} className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-full bg-gray-100 ${transaction.color}`}>
                          <transaction.icon size={16} />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{transaction.type}</p>
                          <p className="text-sm text-gray-500">{transaction.date}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-gray-900">{transaction.amount}</p>
                        <ChevronRight size={16} className="text-gray-400 ml-auto" />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Outcome Statistics */}
            <Card className="bg-white shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg font-semibold">Outcome Statistics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {outcomeStats.map((stat, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium text-gray-700">{stat.label}</span>
                        <span className="text-sm font-semibold text-gray-900">{stat.percentage}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <motion.div
                          className={`h-2 rounded-full ${stat.color}`}
                          initial={{ width: 0 }}
                          animate={{ width: `${stat.percentage}%` }}
                          transition={{ duration: 1, delay: index * 0.2 }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="col-span-12 lg:col-span-4 space-y-6">
            {/* Eventos y actualizaciones */}
            <Card className="bg-white shadow-sm">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-lg font-semibold flex items-center gap-2">
                  <Calendar size={20} />
                  Eventos
                </CardTitle>
                <Button variant="ghost" size="sm">
                  <Plus size={16} />
                </Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {events.map((event, index) => (
                    <div key={index} className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 transition-colors">
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                        <span className="text-sm font-semibold text-blue-600">{event.date}</span>
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-gray-900 text-sm">{event.title}</p>
                        <p className="text-xs text-gray-500">{event.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Members */}
            <Card className="bg-white shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg font-semibold">Members</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {members.map((member, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <div className="relative">
                        <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                          <span className="text-sm">{member.avatar}</span>
                        </div>
                        <div className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-white ${
                          member.status === 'online' ? 'bg-green-500' : 
                          member.status === 'away' ? 'bg-yellow-500' : 'bg-gray-400'
                        }`} />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-gray-900 text-sm">{member.name}</p>
                        <p className="text-xs text-gray-500 capitalize">{member.status}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Get Great Loan Card */}
            <Card className="bg-gradient-to-br from-purple-600 to-blue-600 text-white shadow-lg">
              <CardContent className="p-6">
                <h3 className="text-xl font-bold mb-2">Get great loan!</h3>
                <p className="text-purple-100 text-sm mb-4">
                  Apply for a loan and get approved in minutes. Get the money you need today.
                </p>
                <Button className="bg-white text-purple-600 hover:bg-gray-100 font-semibold">
                  Apply Now
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Rating Modal */}
      <AnimatePresence>
        {showRatingModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="bg-white rounded-2xl p-8 max-w-md w-full mx-4 relative"
            >
              <button
                onClick={() => setShowRatingModal(false)}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
              >
                <X size={20} />
              </button>
              
              <div className="text-center">
                <h3 className="text-xl font-bold text-gray-900 mb-2">Rate your experience</h3>
                <p className="text-gray-600 mb-6">How would you rate your experience with our platform?</p>
                
                <div className="flex justify-center gap-2 mb-6">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onClick={() => handleStarClick(star)}
                      onMouseEnter={() => handleStarHover(star)}
                      onMouseLeave={() => setHoveredStar(0)}
                      className="p-1 transition-transform hover:scale-110"
                    >
                      <Star
                        size={32}
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
                    Skip
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
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};