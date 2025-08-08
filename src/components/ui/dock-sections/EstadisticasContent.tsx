import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { AreaChart, Area, XAxis, YAxis, ResponsiveContainer, LineChart, Line, Tooltip } from 'recharts';
import { Calendar, Star, TrendingUp, ShoppingBag, Smartphone, User, Plus, ChevronRight, X, Plane, Mountain, Gamepad2, Activity, ArrowRight } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useIsMobile } from '@/hooks/use-mobile';
import { supabase } from '@/integrations/supabase/client';
const productivityData = [] as any[];

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
  const [hoveredDataPoint, setHoveredDataPoint] = useState<any>(null);

  // Estado para la gráfica de productividad real
  const [range, setRange] = useState<'7d' | '30d' | 'custom'>('7d');
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [chartData, setChartData] = useState<Array<{ date: string; label: string; minutes: number; firstSession?: string; aboveAvg?: boolean }>>([]);
  const [avgMinutes, setAvgMinutes] = useState<number>(0);


  // Helpers de fecha
  const toISO = (d: Date) => {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
  };
  const addDays = (d: Date, days: number) => {
    const nd = new Date(d);
    nd.setDate(nd.getDate() + days);
    return nd;
  };
  const eachDay = (from: Date, to: Date) => {
    const arr: string[] = [];
    let cur = new Date(from);
    while (cur <= to) {
      arr.push(toISO(cur));
      cur = addDays(cur, 1);
    }
    return arr;
  };

  useEffect(() => {
    if (!user) return;

    // Calcular rango
    const today = new Date();
    let fromISO = '';
    let toISODate = '';

    if (range === '7d') {
      const from = addDays(today, -6);
      fromISO = toISO(from);
      toISODate = toISO(today);
    } else if (range === '30d') {
      const from = addDays(today, -29);
      fromISO = toISO(from);
      toISODate = toISO(today);
    } else {
      if (!startDate || !endDate) return; // esperar selección completa
      fromISO = startDate;
      toISODate = endDate;
    }

    const load = async () => {
      const { data, error } = await supabase
        .from('user_activity_sessions')
        .select('date, session_start, duration_minutes')
        .gte('date', fromISO)
        .lte('date', toISODate)
        .order('date', { ascending: true });

      if (error) {
        console.error('Error cargando sesiones', error);
        setChartData([]);
        setAvgMinutes(0);
        return;
      }

      const byDate = new Map<string, { minutes: number; firstSession?: string }>();
      data?.forEach((row: any) => {
        const key = row.date;
        const current = byDate.get(key) || { minutes: 0 };
        current.minutes += row.duration_minutes || 0;
        if (!current.firstSession || new Date(row.session_start) < new Date(current.firstSession)) {
          current.firstSession = row.session_start;
        }
        byDate.set(key, current);
      });

      const days = eachDay(new Date(fromISO), new Date(toISODate));
      const result = days.map((iso) => {
        const d = new Date(iso + 'T00:00:00');
        const label = d.toLocaleDateString('es-ES', { weekday: 'short' }).replace('.', '');
        const info = byDate.get(iso);
        return { date: iso, label, minutes: info?.minutes || 0, firstSession: info?.firstSession };
      });

      const avg = result.length ? result.reduce((s, r) => s + r.minutes, 0) / result.length : 0;
      const withAvg = result.map((r) => ({ ...r, aboveAvg: r.minutes > avg }));
      setAvgMinutes(avg);
      setChartData(withAvg);
    };

    void load();
  }, [user, range, startDate, endDate]);

  const handleStarClick = (starNumber: number) => setRating(starNumber);
  const handleStarHover = (starNumber: number) => setHoveredStar(starNumber);

  return (
    <div className={`bg-white h-full ${isMobile ? 'flex flex-col' : 'flex'}`}>
      {/* Barra Lateral Izquierda - Eventos */}
      {!isMobile && (
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
      )}

      {/* Contenido Principal */}
      <div className={`flex-1 ${isMobile ? 'p-2 space-y-3' : 'p-3 space-y-3'}`}>
        {/* Header */}
        <div className="text-center mb-3">
          {/* Espacio reservado sin título */}
          <div className="h-4" />
        </div>

        {/* Grid Principal - Cards Compactos */}
        <div className={isMobile ? "space-y-3" : "grid grid-cols-1 lg:grid-cols-4 gap-3"}>
          {/* Mi Productividad */}
          <div className={isMobile ? "w-full" : "lg:col-span-2"}>
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
                  <>
                    {/* Controles de rango */}
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-1">
                        <Button size="sm" variant={range === '7d' ? 'default' : 'outline'} onClick={() => setRange('7d')}>7 días</Button>
                        <Button size="sm" variant={range === '30d' ? 'default' : 'outline'} onClick={() => setRange('30d')}>30 días</Button>
                        <Button size="sm" variant={range === 'custom' ? 'default' : 'outline'} onClick={() => setRange('custom')}>Personalizado</Button>
                      </div>
                      {avgMinutes > 0 && (
                        <div className="text-xs text-muted-foreground">
                          Promedio: <span className="font-semibold text-foreground">{Math.round(avgMinutes)} min</span>
                        </div>
                      )}
                    </div>

                    {range === 'custom' && (
                      <div className="flex items-center gap-2 mb-3">
                        <input type="date" className="border rounded px-2 py-1 text-xs" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
                        <span className="text-xs text-muted-foreground">a</span>
                        <input type="date" className="border rounded px-2 py-1 text-xs" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
                      </div>
                    )}

                    {/* Resumen y gráfica */}
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <div className="text-xl font-bold bg-clip-text text-transparent" style={{ backgroundImage: 'linear-gradient(90deg, hsl(var(--chart-4)), hsl(var(--chart-1)))' }}>
                          {chartData[chartData.length - 1]?.minutes ?? 0} min
                        </div>
                        <p className="text-xs text-muted-foreground">Hoy</p>
                      </div>
                    </div>

                    <div className="h-32 md:h-40 relative">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={chartData}>
                          <defs>
                            <linearGradient id="prodLine" x1="0" y1="0" x2="1" y2="0">
                              <stop offset="0%" stopColor={`hsl(var(--chart-1))`} />
                              <stop offset="100%" stopColor={`hsl(var(--chart-4))`} />
                            </linearGradient>
                          </defs>
                          <XAxis dataKey="label" axisLine={false} tickLine={false} className="text-xs" />
                          <YAxis axisLine={false} tickLine={false} className="text-xs" tickFormatter={(v) => `${v}`} />
                          <Tooltip 
                            content={({ active, payload }) => {
                              if (active && payload && payload[0]) {
                                const d = payload[0].payload as any
                                const fullDate = new Date(d.date)
                                const fecha = fullDate.toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })
                                const hora = d.firstSession ? new Date(d.firstSession).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }) : '—'
                                return (
                                  <div className="bg-white/95 border rounded p-2 text-xs shadow">
                                    <div className="font-semibold capitalize">{fecha}</div>
                                    <div>{d.minutes} minutos</div>
                                    <div>Inicio: {hora}</div>
                                  </div>
                                )
                              }
                              return null
                            }}
                          />
                          <Line type="monotone" dataKey="minutes" stroke="url(#prodLine)" strokeWidth={3}
                            dot={({ cx, cy, payload }) => (
                              <circle cx={cx} cy={cy} r={3} fill={payload.aboveAvg ? `hsl(var(--chart-2))` : `hsl(var(--chart-1))`} stroke="#fff" strokeWidth={2} />
                            )}
                            activeDot={{ r: 5 }}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </>
                ) : (
                  <div className="flex flex-col items-center justify-center text-center py-6">
                    <div className="mb-3 text-sm text-muted-foreground max-w-xs">
                      Regístrate para llevar un seguimiento de tu progreso y ver tu tiempo en la app.
                    </div>
                    <div className="flex gap-2">
                      <Button onClick={() => (window.location.href = '/auth/register')}>Crear cuenta</Button>
                      <Button variant="outline" onClick={() => (window.location.href = '/auth/login')}>Iniciar sesión</Button>
                    </div>
                  </div>
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
        <div className={isMobile ? "space-y-3" : "grid grid-cols-1 lg:grid-cols-2 gap-3"}>
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

        {/* Barra Lateral en Móvil - Al final */}
        {isMobile && (
          <div className="space-y-3 mt-6">
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
        )}
      </div>

      {/* Rating Modal - Fixed Bottom */}
      <div className={`fixed ${isMobile ? 'bottom-2 left-2 right-2' : 'bottom-4 left-4'} z-40`}>
        <Card className={`bg-white shadow-lg border ${isMobile ? 'w-full' : 'w-64'}`}>
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