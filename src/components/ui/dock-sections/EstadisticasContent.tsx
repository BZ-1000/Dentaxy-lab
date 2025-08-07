import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { AreaChart, Area, XAxis, YAxis, ResponsiveContainer } from 'recharts';
import { Calendar, Star, TrendingUp, ShoppingBag, Smartphone, User, Plus, ChevronRight, X, Plane, Mountain, Gamepad2 } from 'lucide-react';

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
    <div className="bg-white p-4 space-y-4 overflow-y-auto max-h-screen">
      {/* Header */}
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-1">Estadísticas</h1>
        <p className="text-blue-500 text-sm">Hello <span className="text-blue-600 font-medium">(colocar nombre de usuario)</span>, welcome back!</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Mi Productividad */}
        <div className="lg:col-span-2">
          <Card className="shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-semibold flex items-center gap-2">
                <span className="bg-gray-100 rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">1</span>
                Mi Productividad
              </CardTitle>
              <p className="text-xs text-gray-500">Si aún no inicias sesión no podras ver tu progreso</p>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <div className="text-2xl font-bold text-purple-600">17 min</div>
                  <p className="text-xs text-gray-500">May</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-500">March 2020</p>
                </div>
              </div>
              <div className="h-32">
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
        <div>
          <Card className="shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-semibold flex items-center gap-2">
                <span className="bg-gray-100 rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">2</span>
                Goals
                <Plus size={16} className="ml-auto text-gray-400" />
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0 space-y-3">
              {goals.map((goal, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50"
                >
                  <div className={`p-2 rounded-lg ${goal.bgColor}`}>
                    <goal.icon size={16} className={goal.color} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-lg font-bold text-gray-900">{goal.title}</span>
                      <span className="text-xs text-gray-500">12/12/20</span>
                    </div>
                    <p className="text-xs text-gray-600 font-medium">{goal.subtitle}</p>
                  </div>
                  <ChevronRight size={14} className="text-gray-400" />
                </motion.div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Transaction History */}
        <Card className="shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              <span className="bg-gray-100 rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">3</span>
              Transaction history
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="text-gray-500 border-b">
                    <th className="text-left pb-2 font-medium">Receiver</th>
                    <th className="text-left pb-2 font-medium">Type</th>
                    <th className="text-left pb-2 font-medium">Date</th>
                    <th className="text-right pb-2 font-medium">Amount</th>
                  </tr>
                </thead>
                <tbody className="space-y-1">
                  {transactionData.map((transaction) => (
                    <tr key={transaction.id} className="border-b last:border-b-0">
                      <td className="py-2">
                        <div className="flex items-center gap-2">
                          <div className="p-1 rounded bg-gray-100">
                            <transaction.icon size={12} className="text-gray-600" />
                          </div>
                          <span className="font-medium text-gray-900">{transaction.type}</span>
                        </div>
                      </td>
                      <td className="py-2 text-gray-600">{transaction.category}</td>
                      <td className="py-2 text-gray-500">{transaction.date}</td>
                      <td className="py-2 text-right font-semibold text-gray-900">{transaction.amount}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Outcome Statistics */}
        <Card className="shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              <span className="bg-gray-100 rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">4</span>
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
      </div>

      {/* Bottom Section */}
      <div className="flex gap-4">
        {/* Left Sidebar */}
        <div className="w-64 space-y-3">
          {/* Eventos y actualizaciones */}
          <Card className="shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <span className="bg-gray-100 rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold">7</span>
                <Calendar size={14} />
                Eventos y actualizaciones
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-2">
                <div className="flex items-center gap-2 p-2 rounded hover:bg-gray-50">
                  <span className="text-xs font-semibold">20 September</span>
                </div>
                <div className="text-xs text-gray-500">Sunday</div>
                <div className="flex items-center gap-2 text-xs">
                  <span>All day</span>
                  <ChevronRight size={12} />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Members */}
          <Card className="shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold">Members</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="flex -space-x-2 mb-2">
                {members.slice(0, 6).map((member, index) => (
                  <div key={index} className="relative">
                    <div className="w-6 h-6 bg-gray-100 rounded-full border-2 border-white flex items-center justify-center">
                      <span className="text-xs">{member.avatar}</span>
                    </div>
                  </div>
                ))}
                <div className="w-6 h-6 bg-gray-200 rounded-full border-2 border-white flex items-center justify-center">
                  <span className="text-xs text-gray-600">+</span>
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="ghost" size="sm" className="text-xs h-6">Cancel</Button>
                <Button size="sm" className="text-xs h-6 bg-purple-600 hover:bg-purple-700">More</Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Area */}
        <div className="flex-1"></div>

        {/* Get Great Loan Card - Bottom Right */}
        <div className="w-48">
          <Card className="bg-gradient-to-br from-orange-500 to-red-500 text-white shadow-lg">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="bg-white/20 rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold">6</span>
              </div>
              <h3 className="text-lg font-bold mb-1">Get great loan!</h3>
              <div className="flex items-center justify-between">
                <ChevronRight size={16} className="text-white/80" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Rating Modal - Fixed Bottom Left */}
      <AnimatePresence>
        {showRatingModal && (
          <motion.div
            initial={{ scale: 0.8, opacity: 0, x: -50 }}
            animate={{ scale: 1, opacity: 1, x: 0 }}
            exit={{ scale: 0.8, opacity: 0, x: -50 }}
            className="fixed bottom-4 left-4 bg-white rounded-xl p-4 shadow-lg border z-40 w-80"
          >
            <div className="flex items-center gap-2 mb-2">
              <span className="bg-gray-100 rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold">5</span>
              <h3 className="text-sm font-bold text-gray-900">How would you rate the overall user experience of our App?</h3>
              <button
                onClick={() => setShowRatingModal(false)}
                className="ml-auto text-gray-400 hover:text-gray-600"
              >
                <X size={16} />
              </button>
            </div>
            
            <p className="text-xs text-gray-600 mb-3">Do you find the app easy to use?</p>
            
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
                className="flex-1 text-xs h-8"
              >
                Cancel
              </Button>
              <Button
                onClick={() => {
                  setShowRatingModal(false);
                  // Handle rating submission here
                }}
                className="flex-1 text-xs h-8 bg-purple-600 hover:bg-purple-700"
                disabled={rating === 0}
              >
                Submit
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};