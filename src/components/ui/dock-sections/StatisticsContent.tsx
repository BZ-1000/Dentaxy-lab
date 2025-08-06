import { useState, useEffect, useRef, FC } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { AreaChart, Area, XAxis, YAxis, ResponsiveContainer, LineChart, Line, Tooltip, Legend, CartesianGrid, PieChart, Pie, Cell } from 'recharts';
import { Users, Zap, Clock, Target, CheckCircle2, XCircle, DollarSign, BrainCircuit } from 'lucide-react';
import { cn } from "@/lib/utils";

// --- MEJORA 1: Animación de número más fluida ---
const AnimatedNumber = ({ value }: { value: number }) => {
  const [displayValue, setDisplayValue] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!ref.current) return;

    let startTime: number;
    let requestId: number;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / 1500, 1);
      
      // Easing function
      const easedProgress = 1 - Math.pow(1 - progress, 3);
      const currentValue = Math.floor(easedProgress * value);
      
      setDisplayValue(currentValue);
      
      if (progress < 1) {
        requestId = requestAnimationFrame(animate);
      }
    };

    requestId = requestAnimationFrame(animate);

    return () => {
      if (requestId) {
        cancelAnimationFrame(requestId);
      }
    };
  }, [value]);

  return <motion.span ref={ref}>{displayValue.toLocaleString()}</motion.span>;
};

// --- MEJORA 2: Componente reutilizable para las tarjetas de KPI ---
interface KpiCardProps {
  title: string;
  value: number;
  label: string;
  Icon: React.ElementType;
  unit?: string;
}

const KpiCard: FC<KpiCardProps> = ({ title, value, label, Icon, unit = '' }) => (
  <Card>
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium">{title}</CardTitle>
      <Icon className="h-5 w-5 text-muted-foreground" />
    </CardHeader>
    <CardContent>
      <div className="text-4xl font-bold">
        <AnimatedNumber value={value} />{unit}
      </div>
      <p className="text-xs text-muted-foreground">{label}</p>
    </CardContent>
  </Card>
);

// --- MEJORA 3: Tooltip para gráficas más robusto e inteligente ---
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    // Mapeo de claves de datos a sus unidades correspondientes
    const units: { [key: string]: string } = {
      tradicional: ' min',
      dentaxy: ' min',
      precision: '%',
      velocidad: '%'
    };

    return (
      <div className="bg-background/80 backdrop-blur-sm border border-border rounded-lg p-3 shadow-lg">
        <p className="text-sm font-bold text-foreground mb-2">{`Mes: ${label}`}</p>
        {payload.map((entry: any, index: number) => (
          <p key={index} className="text-sm flex items-center" style={{ color: entry.color }}>
            <span className="block w-2 h-2 rounded-full mr-2" style={{ backgroundColor: entry.color }}></span>
            {`${entry.name}: ${entry.value.toLocaleString()}${units[entry.dataKey] || ''}`}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

// --- Componente principal de Estadísticas (Versión 2.0) ---
export const StatisticsContent = () => {

  // --- MEJORA 4: Animaciones escalonadas para una entrada más elegante ---
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  // --- Datos de ejemplo (podrían venir de una API) ---
  const kpiData: KpiCardProps[] = [
    { title: "Usuarios Activos", value: 1247, label: "Clientes utilizando la plataforma", Icon: Users },
    { title: "Generaciones Hoy", value: 5890, label: "Historias clínicas creadas hoy", Icon: Zap },
    { title: "Horas Ahorradas (Mes)", value: 1950, label: "Tiempo total ahorrado a profesionales", Icon: Clock },
    { title: "Precisión Media IA", value: 97, label: "Efectividad del modelo actual", Icon: Target, unit: '%' },
  ];

  const timeComparisonData = [
    { month: 'Ene', tradicional: 120, dentaxy: 36 },
    { month: 'Feb', tradicional: 115, dentaxy: 34 },
    { month: 'Mar', tradicional: 118, dentaxy: 35 },
    { month: 'Abr', tradicional: 122, dentaxy: 37 },
    { month: 'May', tradicional: 119, dentaxy: 36 },
    { month: 'Jun', tradicional: 125, dentaxy: 32 },
  ];

  const performanceData = [
    { month: 'Ene', precision: 92, velocidad: 75 },
    { month: 'Feb', precision: 94, velocidad: 78 },
    { month: 'Mar', precision: 95, velocidad: 82 },
    { month: 'Abr', precision: 96, velocidad: 85 },
    { month: 'May', precision: 97, velocidad: 88 },
    { month: 'Jun', precision: 98, velocidad: 92 },
  ];
  
  // --- MEJORA 5: Datos para la nueva gráfica de Ahorro ---
  const costSavingsData = [
    { name: 'Costo Manual (Estimado)', value: 15600 }, // 1950 horas * $8/hr (ejemplo)
    { name: 'Costo Dentaxy AI', value: 99 },
  ];
  const COLORS = ['hsl(var(--destructive))', 'hsl(var(--chart-2))'];

  return (
    <div className="p-4 md:p-8 space-y-8 bg-background text-foreground">
      
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <h1 className="text-3xl font-bold tracking-tight">Panel de Estadísticas y Rendimiento</h1>
        <p className="text-muted-foreground">Métricas clave sobre el impacto y uso de Dentaxy AI.</p>
      </motion.div>

      {/* --- KPI Cards con animación escalonada --- */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        {kpiData.map((kpi, index) => (
          <motion.div key={index} variants={itemVariants}>
            <KpiCard {...kpi} />
          </motion.div>
        ))}
      </motion.div>

      {/* --- Gráficas con animación escalonada --- */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 lg:grid-cols-5 gap-6"
      >
        {/* --- MEJORA 6: Gráfica de tiempo rediseñada --- */}
        <motion.div variants={itemVariants} className="lg:col-span-3">
          <Card className="h-full">
            <CardHeader>
              <CardTitle>Reducción de Tiempo por Historia Clínica</CardTitle>
              <CardDescription>Comparativa del tiempo en minutos: Método Tradicional vs. Dentaxy AI.</CardDescription>
            </CardHeader>
            <CardContent className="h-[300px] p-2">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={timeComparisonData} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
                  <defs>
                    <linearGradient id="colorTradicional" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--destructive))" stopOpacity={0.4}/>
                      <stop offset="95%" stopColor="hsl(var(--destructive))" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorDentaxy" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--chart-2))" stopOpacity={0.4}/>
                      <stop offset="95%" stopColor="hsl(var(--chart-2))" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                  <Area type="monotone" name="Tradicional" dataKey="tradicional" stroke="hsl(var(--destructive))" fillOpacity={1} fill="url(#colorTradicional)" />
                  <Area type="monotone" name="Dentaxy AI" dataKey="dentaxy" stroke="hsl(var(--chart-2))" fillOpacity={1} fill="url(#colorDentaxy)" />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>
        
        {/* --- MEJORA 7: Nueva gráfica de Ahorro de Costos --- */}
        <motion.div variants={itemVariants} className="lg:col-span-2">
          <Card className="h-full">
            <CardHeader>
              <CardTitle>Ahorro Estimado Mensual</CardTitle>
              <CardDescription>Comparativa de costo operativo manual vs. la suscripción a Dentaxy AI.</CardDescription>
            </CardHeader>
            <CardContent className="h-[300px] flex items-center justify-center">
               <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={costSavingsData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                    nameKey="name"
                    label={({ name, value }) => `$${value.toLocaleString()} MXN`}
                  >
                    {costSavingsData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value: number) => `$${value.toLocaleString()} MXN`} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
      
      {/* --- MEJORA 8: Comparativa de Precios rediseñada y más vendedora --- */}
      <motion.div variants={itemVariants} initial="hidden" animate="visible">
          <Card>
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">Una Inversión Inteligente en Eficiencia</CardTitle>
              <CardDescription>Ve por qué Dentaxy AI es la herramienta preferida por profesionales sobre IAs genéricas.</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center p-6">
                
                {/* Columna IA Genérica 1 */}
                <div className="border rounded-lg p-6 space-y-4 opacity-70">
                    <h3 className="text-xl font-semibold">MediBot Genérico</h3>
                    <p className="text-3xl font-bold">$120 <span className="text-sm font-normal text-muted-foreground">MXN/mes</span></p>
                    <ul className="space-y-3 text-left">
                        <li className="flex items-center"><XCircle className="h-5 w-5 text-red-500 mr-2"/>No especializada en Odontología</li>
                        <li className="flex items-center"><XCircle className="h-5 w-5 text-red-500 mr-2"/>Resultados inconsistentes</li>
                        <li className="flex items-center"><CheckCircle2 className="h-5 w-5 text-yellow-500 mr-2"/>Soporte por email (lento)</li>
                    </ul>
                </div>

                {/* Columna Dentaxy AI (Destacada) */}
                <div className="border-2 border-primary rounded-lg p-6 space-y-4 relative ring-4 ring-primary/20">
                    <div className="absolute top-0 -translate-y-1/2 left-1/2 -translate-x-1/2">
                        <div className="bg-primary text-primary-foreground text-xs font-bold uppercase tracking-wider rounded-full px-4 py-1">Recomendado</div>
                    </div>
                    <h3 className="text-xl font-semibold flex items-center justify-center gap-2">Dentaxy AI <BrainCircuit className="h-6 w-6 text-primary" /></h3>
                    <p className="text-3xl font-bold text-primary">$99 <span className="text-sm font-normal text-muted-foreground">MXN/mes</span></p>
                     <ul className="space-y-3 text-left">
                        <li className="flex items-center"><CheckCircle2 className="h-5 w-5 text-green-500 mr-2"/>IA especializada en Odontología</li>
                        <li className="flex items-center"><CheckCircle2 className="h-5 w-5 text-green-500 mr-2"/>97% de precisión garantizada</li>
                        <li className="flex items-center"><CheckCircle2 className="h-5 w-5 text-green-500 mr-2"/>Soporte prioritario 24/7</li>
                    </ul>
                </div>

                {/* Columna IA Genérica 2 */}
                <div className="border rounded-lg p-6 space-y-4 opacity-70">
                    <h3 className="text-xl font-semibold">HealthScribe Básico</h3>
                    <p className="text-3xl font-bold">$150 <span className="text-sm font-normal text-muted-foreground">MXN/mes</span></p>
                     <ul className="space-y-3 text-left">
                        <li className="flex items-center"><XCircle className="h-5 w-5 text-red-500 mr-2"/>Terminología médica limitada</li>
                        <li className="flex items-center"><CheckCircle2 className="h-5 w-5 text-yellow-500 mr-2"/>Precisión variable</li>
                        <li className="flex items-center"><XCircle className="h-5 w-5 text-red-500 mr-2"/>Sin integración a sistemas</li>
                    </ul>
                </div>
            </CardContent>
          </Card>
      </motion.div>
    </div>
  );
};