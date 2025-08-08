import { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AreaChart, Area, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts';
import { 
    Calendar, Star, TrendingUp, ShoppingBag, Smartphone, User, Plus, ChevronRight, X, 
    Plane, Mountain, Gamepad2, Activity, PieChart, History, Target, AlertTriangle, Briefcase 
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useIsMobile } from '@/hooks/use-mobile';
import { supabase } from '@/integrations/supabase/client';

// --- DATOS DE EJEMPLO (MANTENIDOS COMO EN EL ORIGINAL) ---
const transactionData = [
  { id: 1, type: 'Insumos Médicos', category: 'Compras', date: '05 Ago 2025', amount: '$75.67', icon: ShoppingBag },
  { id: 2, type: 'Equipo de Rayos X', category: 'Equipamiento', date: '04 Ago 2025', amount: '$2500.00', icon: Smartphone },
  { id: 3, type: 'Cena de equipo', category: 'Alimentos', date: '03 Ago 2025', amount: '$190.50', icon: User },
];
const outcomeStats = [
  { label: 'Insumos', percentage: 52, icon: ShoppingBag },
  { label: 'Equipamiento', percentage: 21, icon: Smartphone },
  { label: 'Viajes de Negocios', percentage: 74, icon: Plane },
];
const goals = [
  { title: 'Congreso Anual', subtitle: 'Viáticos', current: 450, target: 550, icon: Plane },
  { title: 'Renovación de Oficina', subtitle: 'Mobiliario', current: 120, target: 200, icon: Mountain },
  { title: 'Nuevo Software', subtitle: 'Licencia', current: 680, target: 820, icon: Gamepad2 },
];
const events = [
  { date: '15', title: 'Junta de Equipo', time: '10:00 AM' },
  { date: '18', title: 'Revisión de Proyecto', time: '2:00 PM' },
];
const members = [
  { name: 'Dr. John', avatar: '👨‍⚕️' },
  { name: 'Dra. Sarah', avatar: '👩‍⚕️' },
  { name: 'Asist. Mike', avatar: '👨‍💼' },
];
// --- FIN DE DATOS DE EJEMPLO ---


export const EstadisticasContent = () => {
  const { user } = useAuth();
  const isMobile = useIsMobile();
  const [showRatingModal, setShowRatingModal] = useState(true); // Se inicia visible para demostración
  const [rating, setRating] = useState(0);
  const [hoveredStar, setHoveredStar] = useState(0);
  
  // --- LÓGICA DE DATOS (SIN MODIFICAR) ---
  const [range, setRange] = useState<'7d' | '30d' | 'custom'>('7d');
  const [startDate, setStartDate] =useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [chartData, setChartData] = useState<Array<{ date: string; label: string; minutes: number; firstSession?: string; aboveAvg?: boolean }>>([]);
  const [avgMinutes, setAvgMinutes] = useState<number>(0);

  const toISO = (d: Date) => d.toISOString().split('T')[0];
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
    const today = new Date();
    let fromISO = '';
    let toISODate = '';

    if (range === '7d') {
      fromISO = toISO(addDays(today, -6));
      toISODate = toISO(today);
    } else if (range === '30d') {
      fromISO = toISO(addDays(today, -29));
      toISODate = toISO(today);
    } else {
      if (!startDate || !endDate) return;
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
      
      const days = eachDay(new Date(`${fromISO}T00:00:00`), new Date(`${toISODate}T00:00:00`));
      const result = days.map((iso) => {
        const d = new Date(`${iso}T00:00:00`);
        const label = d.toLocaleDateString('es-ES', { weekday: 'short' }).replace('.', '');
        const info = byDate.get(iso);
        return { date: iso, label, minutes: info?.minutes || 0, firstSession: info?.firstSession };
      });

      const totalMinutes = result.reduce((s, r) => s + r.minutes, 0);
      const activeDays = result.filter(r => r.minutes > 0).length;
      const avg = activeDays > 0 ? totalMinutes / activeDays : 0;
      
      const withAvg = result.map((r) => ({ ...r, aboveAvg: r.minutes > avg }));
      
      setAvgMinutes(avg);
      setChartData(withAvg);
    };

    void load();
  }, [user, range, startDate, endDate]);
  // --- FIN DE LÓGICA DE DATOS ---

  const handleStarClick = (starNumber: number) => setRating(starNumber);
  const handleStarHover = (starNumber: number) => setHoveredStar(starNumber);

  const todayFormatted = new Date().toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' });
  
  const MainContent = () => (
    <div className="flex-1 p-4 md:p-6 space-y-6">
      <header>
        <h1 className="text-3xl font-bold text-slate-800">Panel de Estadísticas</h1>
        <p className="text-slate-500 mt-1 capitalize">{todayFormatted}</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        
        {/* Columna Principal (Gráfica y Transacciones) */}
        <div className="lg:col-span-2 xl:col-span-3 space-y-6">
          {/* Mi Productividad */}
          <Card className="shadow-md border-slate-200/80">
            <CardHeader>
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div className="flex items-center gap-3">
                    <Activity className="w-6 h-6 text-violet-600"/>
                    <div>
                        <CardTitle className="text-lg font-semibold text-slate-800">Mi Productividad</CardTitle>
                        <p className="text-sm text-slate-500">Tiempo de uso de la aplicación por día.</p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button size="sm" variant={range === '7d' ? 'default' : 'outline'} onClick={() => setRange('7d')}>7d</Button>
                  <Button size="sm" variant={range === '30d' ? 'default' : 'outline'} onClick={() => setRange('30d')}>30d</Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {user ? (
                <div className="h-72 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                      <defs>
                        <linearGradient id="colorArea" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.4}/>
                          <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <XAxis dataKey="label" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false}/>
                      <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${value}m`}/>
                      <Tooltip
                        content={({ active, payload }) => {
                          if (active && payload && payload.length) {
                            const data = payload[0].payload;
                            return (
                              <div className="bg-white/80 backdrop-blur-sm border border-slate-200 p-3 rounded-lg shadow-xl">
                                <p className="font-bold text-slate-800">{new Date(data.date + 'T00:00:00').toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric' })}</p>
                                <p className="text-violet-600 text-lg font-semibold">{`${data.minutes} minutos`}</p>
                              </div>
                            );
                          }
                          return null;
                        }}
                      />
                      <Area type="monotone" dataKey="minutes" stroke="#8B5CF6" strokeWidth={3} fillOpacity={1} fill="url(#colorArea)" activeDot={{ r: 8, stroke: 'white', strokeWidth: 2 }} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center text-center py-10">
                    <AlertTriangle className="w-10 h-10 text-amber-500 mb-3" />
                    <p className="text-slate-600 font-medium mb-4">Regístrate para ver tu progreso.</p>
                    <div className="flex gap-3">
                        <Button onClick={() => (window.location.href = '/auth/register')}>Crear cuenta</Button>
                        <Button variant="outline" onClick={() => (window.location.href = '/auth/login')}>Iniciar sesión</Button>
                    </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Transaction History */}
          <Card className="shadow-md border-slate-200/80">
              <CardHeader>
                  <div className="flex items-center gap-3">
                      <History className="w-6 h-6 text-violet-600"/>
                      <CardTitle className="text-lg font-semibold text-slate-800">Historial de Gastos</CardTitle>
                  </div>
              </CardHeader>
              <CardContent>
                  <table className="w-full text-sm">
                      <thead>
                          <tr className="text-slate-500 border-b border-slate-200">
                              <th className="text-left pb-2 font-medium">Concepto</th>
                              <th className="text-left pb-2 font-medium">Tipo</th>
                              <th className="text-left pb-2 font-medium">Fecha</th>
                              <th className="text-right pb-2 font-medium">Monto</th>
                          </tr>
                      </thead>
                      <tbody>
                          {transactionData.map((transaction) => (
                              <tr key={transaction.id} className="border-b border-slate-200 last:border-b-0">
                                  <td className="py-3">
                                      <div className="flex items-center gap-3">
                                          <div className="p-2 rounded-full bg-slate-100">
                                              <transaction.icon size={16} className="text-slate-600" />
                                          </div>
                                          <span className="font-medium text-slate-800">{transaction.type}</span>
                                      </div>
                                  </td>
                                  <td className="py-3 text-slate-600">{transaction.category}</td>
                                  <td className="py-3 text-slate-500">{transaction.date}</td>
                                  <td className="py-3 text-right font-semibold text-slate-800">{transaction.amount}</td>
                              </tr>
                          ))}
                      </tbody>
                  </table>
              </CardContent>
          </Card>
        </div>

        {/* Columna Lateral (Goals, Stats, etc.) */}
        <div className="lg:col-span-1 xl:col-span-1 space-y-6">
          {/* Goals */}
          <Card className="shadow-md border-slate-200/80">
            <CardHeader className="flex flex-row items-center justify-between">
              <div className="flex items-center gap-3">
                  <Target className="w-6 h-6 text-violet-600"/>
                  <CardTitle className="text-lg font-semibold text-slate-800">Metas</CardTitle>
              </div>
              <Button variant="ghost" size="icon" className="w-8 h-8">
                  <Plus size={18} className="text-slate-500" />
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              {goals.map((goal, index) => (
                <motion.div key={index} className="flex items-center gap-3"
                  initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: index * 0.1 }}>
                  <div className="p-2 rounded-lg bg-violet-100">
                    <goal.icon size={20} className="text-violet-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-slate-800">{goal.title}</p>
                    <p className="text-xs text-slate-500">{goal.subtitle}</p>
                  </div>
                  <ChevronRight size={16} className="text-slate-400" />
                </motion.div>
              ))}
            </CardContent>
          </Card>

          {/* Outcome Statistics */}
          <Card className="shadow-md border-slate-200/80">
            <CardHeader>
                <div className="flex items-center gap-3">
                  <PieChart className="w-6 h-6 text-violet-600"/>
                  <CardTitle className="text-lg font-semibold text-slate-800">Estadísticas de Gastos</CardTitle>
                </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {outcomeStats.map((stat, index) => (
                <div key={index}>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm font-medium text-slate-700">{stat.label}</span>
                    <span className="text-sm font-bold text-slate-800">{stat.percentage}%</span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-2">
                    <motion.div
                      className="h-2 rounded-full bg-violet-500"
                      initial={{ width: 0 }}
                      animate={{ width: `${stat.percentage}%` }}
                      transition={{ duration: 1, delay: index * 0.2, ease: "easeOut" }}
                    />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );

  const SideBar = () => (
      <div className="w-64 p-4 border-l border-slate-200 space-y-6 bg-white">
          <Card className="shadow-none border-0">
              <CardHeader>
                  <CardTitle className="text-base font-semibold flex items-center gap-2 text-slate-700">
                      <Calendar size={18} />
                      Próximos Eventos
                  </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                  <div className="text-sm font-semibold text-violet-600">Viernes, 8 de Agosto</div>
                  {events.map((event, index) => (
                      <div key={index} className="text-sm p-2 rounded-lg hover:bg-slate-50 transition-colors">
                          <div className="font-medium text-slate-800">{event.title}</div>
                          <div className="text-slate-500">{event.time}</div>
                      </div>
                  ))}
              </CardContent>
          </Card>

          <Card className="shadow-none border-0">
              <CardHeader>
                  <CardTitle className="text-base font-semibold flex items-center gap-2 text-slate-700">
                    <User size={18} />
                    Miembros del Equipo
                  </CardTitle>
              </CardHeader>
              <CardContent>
                  <div className="flex -space-x-2 mb-4">
                      {members.map((member, index) => (
                          <div key={index} title={member.name} className="w-10 h-10 bg-slate-200 rounded-full border-2 border-white flex items-center justify-center text-lg shadow-sm">
                              {member.avatar}
                          </div>
                      ))}
                      <div className="w-10 h-10 bg-slate-100 rounded-full border-2 border-white flex items-center justify-center text-slate-500 cursor-pointer hover:bg-slate-200">
                          <Plus size={20} />
                      </div>
                  </div>
                  <Button className="w-full">Administrar Equipo</Button>
              </CardContent>
          </Card>

           {showRatingModal && <RatingModal />}
      </div>
  );

  const RatingModal = () => (
    <Card className="shadow-lg border-violet-200 bg-violet-50/50">
        <CardHeader>
            <div className="flex items-start justify-between">
                <CardTitle className="text-base font-semibold text-slate-800">Valora tu experiencia</CardTitle>
                <button onClick={() => setShowRatingModal(false)} className="text-slate-400 hover:text-slate-600">
                    <X size={18} />
                </button>
            </div>
             <p className="text-sm text-slate-600 pt-1">¿La app te resulta fácil de usar?</p>
        </CardHeader>
        <CardContent>
            <div className="flex justify-center gap-2 mb-4">
                {[1, 2, 3, 4, 5].map((star) => (
                    <button key={star} onClick={() => handleStarClick(star)} onMouseEnter={() => handleStarHover(star)} onMouseLeave={() => setHoveredStar(0)}
                        className="transition-transform hover:scale-125">
                        <Star size={24} className={`${star <= (hoveredStar || rating) ? 'fill-amber-400 text-amber-400' : 'text-slate-300'} transition-colors`} />
                    </button>
                ))}
            </div>
            <Button className="w-full" onClick={() => setShowRatingModal(false)} disabled={rating === 0}>
                Enviar valoración
            </Button>
        </CardContent>
    </Card>
  );

  return (
    <div className="bg-slate-50 min-h-screen font-sans">
      <div className="flex">
        <MainContent />
        {!isMobile && <SideBar />}
      </div>
      {/* En móvil, la barra lateral podría ser un modal o no mostrarse, según el diseño deseado */}
    </div>
  );
};