import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AreaChart, Area, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts';
import { 
    BarChart3, Calendar, CreditCard, TrendingUp, Briefcase, Plus, ChevronRight, Star, Settings2, ShieldQuestion
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useIsMobile } from '@/hooks/use-mobile';
import { supabase } from '@/integrations/supabase/client';

// --- DATOS DE EJEMPLO (Se usarán para poblar el nuevo diseño) ---
const transactionData = [
  { id: 1, type: 'Tesco Market', category: 'Shopping', date: '13 Dec 2020', amount: '$75.67' },
  { id: 2, type: 'ElectroMan Market', category: 'Shopping', date: '14 Dec 2020', amount: '$250.00' },
  { id: 3, type: 'Fiergio Restaurant', category: 'Food', date: '15 Dec 2020', amount: '$19.50' },
  { id: 4, type: 'John Mathew Kayne', category: 'Sports', date: '16 Dec 2020', amount: '$350' },
  { id: 5, type: 'Ann Martin', category: 'Shopping', date: '17 Nov 2020', amount: '$430' },
];
const outcomeStats = [
  { label: 'Shopping', percentage: 52, color: 'bg-orange-400' },
  { label: 'Electronics', percentage: 21, color: 'bg-green-400' },
  { label: 'Travels', percentage: 74, color: 'bg-blue-400' },
];
const goals = [
  { title: 'Holidays', amount: '$550', date: '12/20/20', icon: '🌴' },
  { title: 'Renovation', amount: '$200', date: '12/20/20', icon: '🏠' },
  { title: 'Xbox', amount: '$820', date: '12/20/20', icon: '🎮' },
];
const events = [ { date: '20 September', day: 'Sunday' } ];
const members = [ '👨‍⚕️', '👩‍⚕️', '👨‍💼', '👩‍🔬' ];
// --- FIN DE DATOS DE EJEMPLO ---

// --- COMPONENTES DE UI PEQUEÑOS ---
const TopNav = () => {
    const navItems = [
        { icon: BarChart3, active: true },
        { icon: Calendar, active: false },
        { icon: CreditCard, active: false },
        { icon: TrendingUp, active: false },
    ];
    return (
        <div className="flex justify-center mb-8">
            <div className="bg-white rounded-full shadow-md p-2 flex items-center gap-2">
                {navItems.map((item, index) => (
                    <Button key={index} variant={item.active ? 'secondary' : 'ghost'} size="icon" className="rounded-full">
                        <item.icon className={`h-5 w-5 ${item.active ? 'text-indigo-600' : 'text-gray-500'}`} />
                    </Button>
                ))}
            </div>
        </div>
    );
};

const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-slate-900 text-white px-3 py-1 rounded-md shadow-lg">
                <p className="font-bold">{`${payload[0].value} min`}</p>
            </div>
        );
    }
    return null;
};

// --- COMPONENTE PRINCIPAL ---
export const EstadisticasContent = () => {
    const { user } = useAuth();
    const isMobile = useIsMobile();

    // --- LÓGICA DE DATOS (SIN MODIFICAR) ---
    const [chartData, setChartData] = useState([]);
    useEffect(() => {
        // Simulación de carga de datos para la gráfica
        const data = [
            { name: '1', m: 180 }, { name: '5', m: 200 }, { name: '10', m: 190 }, 
            { name: '15', m: 220 }, { name: '20', m: 250 }, { name: '25', m: 210 },
            { name: '30', m: 180 },
        ];
        setChartData(data);
    }, []);

    const MotionCard = motion(Card);

    return (
        <div className="bg-slate-50 min-h-screen p-4 sm:p-6 lg:p-8 font-sans">
            <div className="max-w-screen-xl mx-auto">
                <TopNav />
                
                <header className="text-center mb-10">
                    <h1 className="text-4xl font-bold text-slate-800">Estadísticas</h1>
                    <p className="text-indigo-500 mt-2">
                        Hello {user?.email || 'usuario'}, welcome back!
                    </p>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* --- COLUMNA IZQUIERDA --- */}
                    <aside className="lg:col-span-3">
                        <MotionCard 
                            className="p-6 shadow-lg border-none"
                            initial={{ opacity: 0, x: -50 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.5 }}
                        >
                            <div className="flex items-center gap-3 mb-6">
                                <div className="bg-gray-100 p-2 rounded-lg">
                                    <Briefcase className="h-6 w-6 text-indigo-600"/>
                                </div>
                                <h2 className="font-bold text-lg text-slate-800">Dental Basics Academy</h2>
                            </div>
                            
                            <h3 className="font-semibold text-slate-700 mb-3 flex items-center gap-2">
                                <Calendar className="w-5 h-5 text-gray-400"/>
                                Eventos y actualizaciones
                            </h3>
                            <div className="bg-gray-50 p-3 rounded-lg mb-6">
                                <div className="flex justify-between items-center">
                                    <p className="font-semibold text-sm text-slate-800">{events[0].date}</p>
                                    <p className="text-xs text-gray-500">{events[0].day}</p>
                                </div>
                                <p className="text-xs text-indigo-500">All day</p>
                            </div>

                            <div className="flex justify-between items-center mb-3">
                                <h3 className="font-semibold text-slate-700">Members</h3>
                                <div className="flex -space-x-2">
                                    {members.map((avatar, index) => (
                                        <div key={index} className="w-8 h-8 bg-slate-200 rounded-full flex items-center justify-center text-sm border-2 border-white">
                                            {avatar}
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <Button variant="outline" className="w-full">Cancel</Button>
                                <Button className="w-full bg-indigo-600 hover:bg-indigo-700">More</Button>
                            </div>
                        </MotionCard>
                    </aside>

                    {/* --- COLUMNA DERECHA (PRINCIPAL) --- */}
                    <main className="lg:col-span-9">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            
                            {/* --- CARD DE PRODUCTIVIDAD (OCUPA 2/3) --- */}
                            <MotionCard 
                                className="md:col-span-3 p-6 shadow-lg border-none"
                                initial={{ opacity: 0, y: 50 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: 0.1 }}
                            >
                                <CardTitle className="text-xl font-bold mb-1 text-slate-800">Mi Productividad</CardTitle>
                                <p className="text-sm text-gray-500 mb-4">Si aún no inicias sesión no podras ver tu progreso</p>
                                
                                <div className="flex items-center gap-4 mb-4 text-sm">
                                    <h4 className="font-semibold text-indigo-600 border-b-2 border-indigo-600 pb-1">Tiempo de actividad</h4>
                                    <h4 className="font-semibold text-gray-400">Previous Month</h4>
                                    <h4 className="font-semibold text-gray-400">March 2020</h4>
                                </div>

                                <div className="h-64 w-full">
                                    <ResponsiveContainer>
                                        <AreaChart data={chartData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                                            <defs>
                                                <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                                                    <stop offset="5%" stopColor="#818CF8" stopOpacity={0.4}/>
                                                    <stop offset="95%" stopColor="#C7D2FE" stopOpacity={0.1}/>
                                                </linearGradient>
                                            </defs>
                                            <XAxis dataKey="name" stroke="#9CA3AF" fontSize={12} tickLine={false} axisLine={false} />
                                            <YAxis dataKey="m" stroke="#9CA3AF" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${value} M`} />
                                            <Tooltip content={<CustomTooltip />} cursor={{ stroke: 'rgba(139, 92, 246, 0.5)', strokeWidth: 1, strokeDasharray: '3 3' }} />
                                            <Area type="monotone" dataKey="m" stroke="#6366F1" strokeWidth={3} fill="url(#chartGradient)" />
                                        </AreaChart>
                                    </div>
                            </MotionCard>
                            
                            {/* --- CARD DE GOALS --- */}
                            <MotionCard 
                                className="md:col-span-3 p-6 shadow-lg border-none"
                                initial={{ opacity: 0, y: 50 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: 0.2 }}
                            >
                                <div className="flex justify-between items-center mb-4">
                                    <CardTitle className="text-xl font-bold text-slate-800">Goals</CardTitle>
                                    <Button variant="ghost" size="icon"><Plus className="w-5 h-5 text-gray-500"/></Button>
                                </div>
                                <div className="relative">
                                    <div className="flex gap-4 overflow-x-auto pb-2 -mb-2">
                                        {goals.map((goal, index) => (
                                            <div key={index} className="bg-gray-50 p-4 rounded-xl min-w-[150px] flex-shrink-0">
                                                <p className="font-bold text-slate-800">{goal.amount}</p>
                                                <p className="text-xs text-gray-400 mb-2">{goal.date}</p>
                                                <div className="flex items-center gap-2">
                                                    <span className="text-xl">{goal.icon}</span>
                                                    <p className="font-semibold text-sm">{goal.title}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="absolute top-1/2 -right-4 -translate-y-1/2 bg-white rounded-full shadow-md h-8 w-8 flex items-center justify-center cursor-pointer">
                                        <ChevronRight className="w-5 h-5 text-gray-600"/>
                                    </div>
                                </div>
                            </MotionCard>
                            
                            {/* --- TRANSACTION HISTORY --- */}
                            <MotionCard 
                                className="md:col-span-3 xl:col-span-2 p-6 shadow-lg border-none"
                                initial={{ opacity: 0, y: 50 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: 0.3 }}
                            >
                                <CardTitle className="text-xl font-bold mb-4 text-slate-800">Transaction history</CardTitle>
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr className="text-left text-gray-400">
                                            <th className="font-medium pb-2">Receiver</th>
                                            <th className="font-medium pb-2">Type</th>
                                            <th className="font-medium pb-2">Date</th>
                                            <th className="font-medium pb-2 text-right">Amount</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {transactionData.slice(0, 4).map(tx => (
                                            <tr key={tx.id} className="border-b border-gray-100 last:border-none">
                                                <td className="py-3 font-semibold text-slate-700">{tx.type}</td>
                                                <td className="py-3 text-gray-500">{tx.category}</td>
                                                <td className="py-3 text-gray-500">{tx.date}</td>
                                                <td className="py-3 font-semibold text-slate-700 text-right">{tx.amount}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </MotionCard>
                            
                            {/* --- COLUMNA DE WIDGETS (OUTCOME, RATING, LOAN) --- */}
                            <div className="md:col-span-3 xl:col-span-1 space-y-8">
                                <MotionCard 
                                    className="p-6 shadow-lg border-none"
                                    initial={{ opacity: 0, y: 50 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.5, delay: 0.4 }}
                                >
                                    <CardTitle className="text-xl font-bold mb-4 text-slate-800">Outcome Statistics</CardTitle>
                                    {outcomeStats.map((stat, index) => (
                                        <div key={index} className="mb-4 last:mb-0">
                                            <div className="flex justify-between items-center mb-1 text-sm">
                                                <span className="font-semibold text-slate-700">{stat.label}</span>
                                                <span className="text-gray-500">{stat.percentage}%</span>
                                            </div>
                                            <div className="w-full bg-gray-200 rounded-full h-2">
                                                <div className={`h-2 rounded-full ${stat.color}`} style={{ width: `${stat.percentage}%` }}/>
                                            </div>
                                        </div>
                                    ))}
                                </MotionCard>

                                <MotionCard 
                                    className="p-6 shadow-lg border-none"
                                    initial={{ opacity: 0, y: 50 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.5, delay: 0.5 }}
                                >
                                    <CardTitle className="text-xl font-bold mb-1 text-slate-800">How would you rate us?</CardTitle>
                                    <p className="text-sm text-gray-500 mb-4">Do you find the app easy to use?</p>
                                    <div className="flex justify-center gap-4 mb-5">
                                        {[1, 2, 3, 4, 5].map(i => (
                                            <Star key={i} className="w-7 h-7 text-gray-300 cursor-pointer hover:text-amber-400"/>
                                        ))}
                                    </div>
                                    <div className="flex gap-2">
                                        <Button variant="outline" className="w-full">Cancel</Button>
                                        <Button className="w-full bg-indigo-600 hover:bg-indigo-700">Submit</Button>
                                    </div>
                                </MotionCard>

                                <MotionCard 
                                    className="p-6 shadow-lg border-none bg-gradient-to-br from-red-400 to-orange-400 text-white"
                                    initial={{ opacity: 0, y: 50 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.5, delay: 0.6 }}
                                >
                                    <CardTitle className="text-xl font-bold mb-2">Get great loan!</CardTitle>
                                    <p className="text-sm opacity-80 mb-4">You can get a loan for your business needs.</p>
                                    <Button variant="secondary" className="w-full bg-white/30 hover:bg-white/40 text-white">Learn More</Button>
                                </MotionCard>
                            </div>
                        </div>
                    </main>
                </div>
            </div>
        </div>
    );
};