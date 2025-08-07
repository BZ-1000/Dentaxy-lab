import { useState, FC } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { AreaChart, Area, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts';
import { 
    Calendar, 
    Star, 
    ShoppingBag, 
    User, 
    Plus, 
    ChevronRight, 
    Utensils,
    Lightbulb,
    Gamepad2,
    Wrench,
    Tv,
    Settings,
    Zap,
    Cloud,
    BarChart,
} from 'lucide-react';

// ============================================================================
// 1. DATOS Y TIPOS (Actualizados para coincidir con el diseño)
// ============================================================================

interface ProductivityDataPoint {
  name: string;
  value: number;
}

interface Goal {
  icon: FC<{ className?: string }>;
  title: string;
  date: string;
  amount: number;
  bgColor: string;
}

interface Transaction {
  icon: FC<{ className?: string }>;
  receiver: string;
  type: string;
  date: string;
  amount: number;
}

interface OutcomeStat {
  icon: FC<{ className?: string }>;
  label: string;
  percentage: number;
  color: string;
}

const productivityData: ProductivityDataPoint[] = [
  { name: '1', value: 180 }, { name: '5', value: 200 },
  { name: '10', value: 240 }, { name: '15', value: 220 },
  { name: '20', value: 260 }, { name: '25', value: 230 },
  { name: '30', value: 210 },
];

const goals: Goal[] = [
  { icon: Lightbulb, title: 'Holidays', date: '12/20/20', amount: 550, bgColor: 'bg-blue-100 text-blue-500' },
  { icon: Wrench, title: 'Renovation', date: '12/20/20', amount: 200, bgColor: 'bg-orange-100 text-orange-500' },
  { icon: Gamepad2, title: 'Xbox', date: '12/20/20', amount: 820, bgColor: 'bg-green-100 text-green-500' },
  { icon: Tv, title: 'New TV', date: '12/25/20', amount: 1250, bgColor: 'bg-purple-100 text-purple-500' },
];

const transactions: Transaction[] = [
  { icon: ShoppingBag, receiver: 'Tesco Market', type: 'Shopping', date: '13 Dec 2020', amount: 75.67 },
  { icon: Tv, receiver: 'ElectroMen Market', type: 'Shopping', date: '14 Dec 2020', amount: 250.00 },
  { icon: Utensils, receiver: 'Frongi Restaurant', type: 'Food', date: '07 Dec 2020', amount: 19.50 },
  { icon: User, receiver: 'John-Mathew Kayne', type: 'Sport', date: '06 Dec 2020', amount: 350 },
  { icon: User, receiver: 'Ann Marlin', type: 'Shopping', date: '31 Nov 2020', amount: 430 },
];

const outcomeStats: OutcomeStat[] = [
  { icon: ShoppingBag, label: 'Shopping', percentage: 52, color: 'bg-orange-400' },
  { icon: Tv, label: 'Electronics', percentage: 21, color: 'bg-green-400' },
  { icon: Wrench, label: 'Towels', percentage: 74, color: 'bg-blue-400' }, // "Travels" en el código original, "Towels" en el diseño
];

const sidebarEventData = {
    date: "20 September",
    day: "Sunday",
    members: [
        { avatar: 'https://i.pravatar.cc/40?img=1' }, { avatar: 'https://i.pravatar.cc/40?img=2' },
        { avatar: 'https://i.pravatar.cc/40?img=3' }, { avatar: 'https://i.pravatar.cc/40?img=4' },
    ]
};


// ============================================================================
// 2. SUB-COMPONENTES (Lógica separada para cada tarjeta/sección)
// ============================================================================

const DashboardHeader = ({ userName }: { userName: string }) => (
    <header className="flex flex-wrap justify-between items-center gap-4">
        <div>
            <h1 className="text-3xl font-bold text-gray-900">Estadísticas</h1>
            <p className="text-sm text-blue-500 font-medium">Hello {userName}, welcome back!</p>
        </div>
        <div className="flex items-center gap-2 p-1 bg-white rounded-lg shadow-sm border">
            <Button variant="ghost" size="icon"><BarChart className="w-5 h-5 text-gray-600" /></Button>
            <Button variant="secondary" size="icon" className="bg-indigo-600 text-white hover:bg-indigo-700 rounded-md"><Calendar className="w-5 h-5" /></Button>
            <Button variant="ghost" size="icon"><Settings className="w-5 h-5 text-gray-600" /></Button>
            <Button variant="ghost" size="icon"><Zap className="w-5 h-5 text-gray-600" /></Button>
        </div>
    </header>
);

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-slate-800 text-white py-1 px-3 rounded-md shadow-lg">
        <p className="font-bold text-lg">{`${payload[0].value} min`}</p>
      </div>
    );
  }
  return null;
};

const ProductivityCard = () => (
  <Card className="bg-white shadow-md border-none rounded-2xl">
    <CardHeader>
      <CardTitle className="text-xl font-bold text-gray-800">Mi Productividad</CardTitle>
      <p className="text-sm text-gray-400">Si aún no inicias sesión no podrás ver tu progreso.</p>
    </CardHeader>
    <CardContent>
      <div className="flex justify-end items-center mb-4 px-4">
         <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" className="text-gray-500 text-xs">Previous Month</Button>
            <Button variant="default" size="sm" className="bg-gray-100 text-gray-800 hover:bg-gray-200 rounded-lg text-xs">March 2020</Button>
        </div>
      </div>
      <div className="h-60 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={productivityData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
            <defs>
              <linearGradient id="productivityGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#A855F7" stopOpacity={0.4}/>
                <stop offset="95%" stopColor="#A855F7" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#9CA3AF', fontSize: 12 }} />
            <YAxis domain={[140, 280]} hide />
            <Tooltip content={<CustomTooltip />} cursor={{ stroke: 'rgba(168, 85, 247, 0.5)', strokeWidth: 2, strokeDasharray: '3 3' }} />
            <Area type="monotone" dataKey="value" stroke="#7C3AED" strokeWidth={3} fillOpacity={1} fill="url(#productivityGradient)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </CardContent>
  </Card>
);

const GoalsComponent = () => (
    <div>
        <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-800">Goals</h2>
            <Button variant="ghost" size="icon" className="text-gray-400 hover:text-gray-800">
                <Plus size={20} />
            </Button>
        </div>
        <div className="relative">
            <div className="flex gap-4 overflow-x-auto pb-4 -mb-4 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                {goals.map((goal, index) => (
                    <Card key={index} className="flex-shrink-0 w-40 bg-white shadow-md border-none rounded-2xl">
                        <CardContent className="p-4 flex flex-col items-center text-center">
                            <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-3 ${goal.bgColor}`}>
                                <goal.icon className="w-6 h-6" />
                            </div>
                            <p className="text-sm font-semibold text-gray-800">${goal.amount.toLocaleString()}</p>
                            <p className="text-xs text-gray-500 mt-1">{goal.title}</p>
                        </CardContent>
                    </Card>
                ))}
            </div>
            <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 bg-white p-1 rounded-full shadow-md border cursor-pointer hover:bg-gray-100">
                <ChevronRight className="w-5 h-5 text-gray-600" />
            </div>
        </div>
    </div>
);

const TransactionHistory = () => (
  <Card className="bg-white shadow-md border-none rounded-2xl">
    <CardHeader>
      <CardTitle className="text-xl font-bold text-gray-800">Transaction history</CardTitle>
    </CardHeader>
    <CardContent>
        <div className="grid grid-cols-4 gap-4 text-xs text-gray-400 font-medium mb-4 px-4">
            <span>Receiver</span>
            <span>Type</span>
            <span>Date</span>
            <span className="text-right">Amount</span>
        </div>
        <div className="space-y-2">
            {transactions.map((tx) => (
                <div key={tx.receiver} className="grid grid-cols-4 gap-4 items-center p-3 rounded-lg hover:bg-gray-50/70 transition-colors duration-200">
                    <div className="flex items-center gap-3">
                        <div className="bg-gray-100 p-2 rounded-full">
                            <tx.icon className="w-4 h-4 text-gray-600" />
                        </div>
                        <span className="font-semibold text-gray-800 text-sm whitespace-nowrap">{tx.receiver}</span>
                    </div>
                    <span className="text-sm text-gray-500">{tx.type}</span>
                    <span className="text-sm text-gray-500 whitespace-nowrap">{tx.date}</span>
                    <span className="font-semibold text-gray-800 text-sm text-right">${tx.amount.toFixed(2)}</span>
                </div>
            ))}
        </div>
    </CardContent>
  </Card>
);

const OutcomeStatistics = () => (
    <Card className="bg-white shadow-md border-none rounded-2xl">
        <CardHeader>
            <CardTitle className="text-xl font-bold text-gray-800">Outcome Statistics</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
            {outcomeStats.map((stat, index) => (
                <div key={index}>
                    <div className="flex items-center justify-between mb-2">
                       <div className="flex items-center gap-3">
                            <div className="bg-gray-100 p-2 rounded-full">
                                <stat.icon className="w-4 h-4 text-gray-600" />
                            </div>
                            <span className="text-sm font-medium text-gray-700">{stat.label}</span>
                       </div>
                        <span className="text-sm font-semibold text-gray-800">{stat.percentage}%</span>
                    </div>
                    <Progress value={stat.percentage} className={`h-2 [&>div]:${stat.color}`} />
                </div>
            ))}
        </CardContent>
    </Card>
);

const RatingCard = () => {
    const [rating, setRating] = useState(0);
    const [hoverRating, setHoverRating] = useState(0);

    return (
        <Card className="bg-white shadow-md border-none rounded-2xl">
            <CardContent className="p-6 text-center">
                <h3 className="text-md font-bold text-gray-800 mb-1">How would you rate the overall user experience of our App?</h3>
                <p className="text-sm text-gray-500 mb-4">Do you find the app easy to use?</p>
                <div className="flex justify-center gap-2 mb-6">
                    {[1, 2, 3, 4, 5].map((star) => (
                        <button key={star} onClick={() => setRating(star)} onMouseEnter={() => setHoverRating(star)} onMouseLeave={() => setHoverRating(0)}>
                            <Star className={`w-7 h-7 cursor-pointer transition-all duration-200 ${star <= (hoverRating || rating) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} />
                        </button>
                    ))}
                </div>
                <div className="flex gap-4">
                    <Button variant="ghost" className="w-full text-gray-500 hover:bg-gray-100 rounded-lg">Cancel</Button>
                    <Button className="w-full bg-indigo-600 hover:bg-indigo-700 rounded-lg">Submit</Button>
                </div>
            </CardContent>
        </Card>
    );
};

const LoanAd = () => (
    <Card className="bg-red-500 text-white shadow-lg border-none rounded-2xl p-6 relative overflow-hidden">
        <div className="absolute -top-8 -right-8">
            <Cloud className="w-32 h-32 text-white/10" strokeWidth={1.5}/>
        </div>
        <CardContent className="p-0 relative z-10 flex flex-col items-center text-center">
            <h3 className="text-2xl font-bold mb-4">Get great loan!</h3>
            <Button className="bg-white text-red-500 hover:bg-gray-100 font-semibold rounded-lg px-8">
                Get great loan!
            </Button>
        </CardContent>
    </Card>
);

const DentalBasicsLogo = () => (
    <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M20 0C8.9543 0 0 8.9543 0 20C0 31.0457 8.9543 40 20 40C31.0457 40 40 31.0457 40 20C40 8.9543 31.0457 0 20 0ZM25.8571 28.5714H14.1429C13.2457 28.5714 12.5 27.8257 12.5 26.9286V20C12.5 16.68 15.0229 14.1571 18.3429 14.1571H21.6571C24.9771 14.1571 27.5 16.68 27.5 20V26.9286C27.5 27.8257 26.7543 28.5714 25.8571 28.5714Z" fill="#6366F1"/>
    </svg>
);

const Sidebar = () => (
    <Card className="bg-white shadow-md border-none rounded-2xl h-full">
        <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-6">
                <DentalBasicsLogo />
                <div>
                    <h3 className="font-bold text-gray-800">Dental Basics Academy</h3>
                </div>
            </div>
            <h4 className="font-bold text-lg text-gray-800 mb-4">Eventos y actualizaciones</h4>
            <div className="bg-gray-50 p-4 rounded-xl mb-6">
                 <div className="flex justify-between items-center mb-1">
                    <p className="font-semibold text-gray-700">{sidebarEventData.date}</p>
                    <p className="text-sm text-gray-500 font-medium">All day</p>
                 </div>
                 <p className="text-gray-500 font-medium">{sidebarEventData.day}</p>
            </div>
            <div className="mb-6">
                <p className="font-semibold text-gray-600 mb-3">Members</p>
                <div className="flex items-center">
                    {sidebarEventData.members.map((member, index) => (
                         <img key={index} src={member.avatar} alt="member" className={`w-9 h-9 rounded-full border-2 border-white ${index > 0 ? '-ml-3' : ''}`} />
                    ))}
                    <div className="w-9 h-9 rounded-full bg-gray-200 flex items-center justify-center text-xs font-semibold text-gray-500 -ml-3 border-2 border-white">
                        +5
                    </div>
                </div>
            </div>
            <div className="flex gap-4">
                <Button variant="outline" className="w-full border-gray-300 text-gray-600 rounded-lg">Cancel</Button>
                <Button className="w-full bg-indigo-600 hover:bg-indigo-700 rounded-lg">More</Button>
            </div>
        </CardContent>
    </Card>
);


// ============================================================================
// 3. COMPONENTE PRINCIPAL (Ensambla todo el layout)
// ============================================================================

export const EstadisticasContent = () => {
    // El modal de calificación ha sido removido y reemplazado por RatingCard
    // según el diseño. Si aún necesitas un modal, la lógica original con
    // AnimatePresence puede ser re-introducida.

    return (
        <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8 font-sans">
            <div className="max-w-screen-2xl mx-auto">
                <DashboardHeader userName="Usuario" />
                <div className="grid grid-cols-12 gap-6 mt-6">
                    {/* Columna Izquierda (Principal) */}
                    <main className="col-span-12 lg:col-span-8 space-y-6">
                        <ProductivityCard />
                        <GoalsComponent />
                        <TransactionHistory />
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <OutcomeStatistics />
                            <RatingCard />
                        </div>
                    </main>

                    {/* Columna Derecha (Sidebar) */}
                    <aside className="col-span-12 lg:col-span-4 space-y-6">
                        <Sidebar />
                        <LoanAd />
                    </aside>
                </div>
            </div>
        </div>
    );
};