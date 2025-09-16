import { useState, useEffect, useRef } from 'react';
import { Clock, Users, FileText, Brain, Calculator, TrendingUp, Award, Zap, Activity, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Area, Tooltip } from 'recharts';

// Minimalist Animated Counter Component
const AnimatedCounter = ({ target, label, prefix = "", onReload }: { 
  target: number; 
  label: string; 
  prefix?: string;
  onReload?: () => void;
}) => {
  const [count, setCount] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [shouldAnimate, setShouldAnimate] = useState(false);

  const animateCounter = () => {
    setCount(0);
    setShouldAnimate(true);
    let current = 0;
    const duration = 2000;
    const increment = target / (duration / 30);
    
    const counter = setInterval(() => {
      current += increment;
      if (current >= target) {
        setCount(target);
        clearInterval(counter);
        setShouldAnimate(false);
      } else {
        setCount(Math.floor(current));
      }
    }, 30);
  };

  useEffect(() => {
    if (isHovered && !shouldAnimate) {
      animateCounter();
    }
  }, [isHovered]);

  return (
    <motion.div 
      className="group cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      whileHover={{ y: -5 }}
      transition={{ duration: 0.2 }}
    >
      <div className="text-center py-4">
        <motion.div 
          className="text-5xl font-bold text-primary mb-2"
          animate={shouldAnimate ? { scale: [1, 1.1, 1] } : {}}
          transition={{ duration: 0.4 }}
        >
          {prefix}{new Intl.NumberFormat('es-ES').format(count)}
        </motion.div>
        <div className="text-sm text-muted-foreground leading-relaxed">{label}</div>
      </div>
    </motion.div>
  );
};

// Compact Dentaxy Activity Feed
const AIActivityFeed = () => {
  const [currentActivity, setCurrentActivity] = useState(0);
  const [dailyCount, setDailyCount] = useState(247);
  const [avgSpeed, setAvgSpeed] = useState(2.1);
  
  const activities = [
    "✨ Completado: Antecedentes • Padecimiento • Examen (2.1s)",
    "🔍 Generando: Diagnóstico • Plan de tratamiento (1.8s)", 
    "📝 Optimizado: Historia clínica • Resumen médico (2.3s)",
    "⚡ Procesado: Examen físico • Antecedentes quirúrgicos (1.5s)",
    "🎯 Finalizado: Padecimiento actual • Pronóstico (2.0s)",
    "💡 Creado: Diagnóstico diferencial • Recomendaciones (1.9s)"
  ];

  const techBadges = ["GPT-4", "ML Médico", "OCR Dental", "IA Contextual"];
  const [currentBadge, setCurrentBadge] = useState(0);

  useEffect(() => {
    const activityInterval = setInterval(() => {
      setCurrentActivity((prev) => (prev + 1) % activities.length);
      // Simulate changing stats
      setDailyCount(prev => prev + Math.floor(Math.random() * 3));
      setAvgSpeed(prev => Number((1.5 + Math.random() * 1.5).toFixed(1)));
    }, 2500);

    const badgeInterval = setInterval(() => {
      setCurrentBadge((prev) => (prev + 1) % techBadges.length);
    }, 1500);

    return () => {
      clearInterval(activityInterval);
      clearInterval(badgeInterval);
    };
  }, [activities.length, techBadges.length]);

  return (
    <div className="py-6">
      <div className="flex items-center gap-2 mb-6">
        <motion.div 
          className="w-2 h-2 bg-emerald-500 rounded-full"
          animate={{ opacity: [1, 0.3, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
        <span className="text-sm font-medium text-emerald-600">Dentaxy en Acción</span>
      </div>
      
      <div className="flex items-start gap-8">
        {/* Left side - Compact stats and badges */}
        <div className="flex flex-col gap-4 min-w-0 flex-1">
          <div className="flex items-center gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">{dailyCount}</div>
              <div className="text-xs text-muted-foreground">redacciones hoy</div>
            </div>
            
            <div className="text-center">
              <div className="text-lg font-semibold text-foreground">{avgSpeed}s</div>
              <div className="text-xs text-muted-foreground">promedio</div>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">Powered by:</span>
            <AnimatePresence mode="wait">
              <motion.span
                key={currentBadge}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.2 }}
                className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-primary/10 text-primary"
              >
                {techBadges[currentBadge]}
              </motion.span>
            </AnimatePresence>
          </div>
        </div>

        {/* Right side - Activity feed */}
        <div className="min-w-0 flex-1">
          <div className="text-xs font-medium text-muted-foreground mb-2">Estado actual:</div>
          <div className="min-h-[2.5rem]">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentActivity}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="text-sm text-foreground leading-relaxed"
              >
                {activities[currentActivity]}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
};

// Minimalist Temporal Line Chart
const TemporalLineChart = ({ onReload }: { onReload?: () => void }) => {
  const [currentMinute, setCurrentMinute] = useState(0);
  const [phase, setPhase] = useState<'without' | 'transition' | 'with'>('without');
  const [data, setData] = useState<Array<{minute: number, tiempo: number}>>([]);
  const [isHovered, setIsHovered] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  const startAnimation = () => {
    if (isAnimating) return;
    
    setIsAnimating(true);
    setPhase('without');
    setData([]);
    setCurrentMinute(0);

    // Phase 1: Build line from 1 to 120 minutes
    let minute = 0;
    const interval = setInterval(() => {
      minute += 3;
      setCurrentMinute(minute);
      setData(prev => [...prev, { minute, tiempo: 120 }]);
      
      if (minute >= 120) {
        clearInterval(interval);
        setTimeout(() => {
          setPhase('transition');
          setTimeout(() => {
            setPhase('with');
            setData([]);
            setCurrentMinute(0);
            
            // Phase 3: Build new line with reduction
            let minute2 = 0;
            const interval2 = setInterval(() => {
              minute2 += 3;
              setCurrentMinute(minute2);
              setData(prev => [...prev, { minute: minute2, tiempo: 36 }]);
              
              if (minute2 >= 120) {
                clearInterval(interval2);
                setIsAnimating(false);
              }
            }, 20);
          }, 1500);
        }, 1000);
      }
    }, 20);
  };

  useEffect(() => {
    if (isHovered && !isAnimating) {
      startAnimation();
    }
  }, [isHovered]);

  return (
    <div className="py-8">
      <div className="flex items-center justify-between mb-6">
        <h4 className="text-xl font-semibold">
          Tiempo para crear historia clínica
        </h4>
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            setIsAnimating(false);
            startAnimation();
          }}
          className="flex items-center gap-2"
        >
          <RotateCcw className="w-4 h-4" />
          Recargar
        </Button>
      </div>

      <div 
        className="cursor-pointer"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <AnimatePresence mode="wait">
          {phase === 'without' && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-sm text-red-500 mb-4"
            >
              Sin Dentaxy: Proceso manual tradicional
            </motion.p>
          )}
          {phase === 'transition' && (
            <motion.p
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="text-sm font-medium text-primary mb-4"
            >
              ¡Ahora con Dentaxy! ✨
            </motion.p>
          )}
          {phase === 'with' && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-sm text-emerald-500 mb-4"
            >
              Con Dentaxy: Optimización con IA
            </motion.p>
          )}
        </AnimatePresence>

        <div className="h-64 border border-border rounded-lg p-4">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <XAxis 
                dataKey="minute"
                tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis 
                tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }}
                axisLine={false}
                tickLine={false}
                domain={[0, 140]}
              />
              <Line 
                type="monotone"
                dataKey="tiempo"
                stroke={phase === 'without' ? '#ef4444' : '#10b981'}
                strokeWidth={2}
                dot={false}
                animationDuration={100}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {phase === 'with' && (
          <motion.div className="text-center mt-4">
            <span className="text-sm font-medium text-emerald-600">
              70% de ahorro de tiempo
            </span>
          </motion.div>
        )}
      </div>
    </div>
  );
};

// Dashboard with small varied-sized cards
export const StatsContent = () => {
  const [activeUsers, setActiveUsers] = useState(27);
  const [dailyCompleted, setDailyCompleted] = useState(142);
  const [timeSaved, setTimeSaved] = useState(8.4);
  const [avgSpeed, setAvgSpeed] = useState(2.3);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveUsers(prev => {
        const change = Math.floor(Math.random() * 7) - 3;
        return Math.max(15, Math.min(45, prev + change));
      });
      setDailyCompleted(prev => prev + Math.floor(Math.random() * 3));
      setTimeSaved(prev => Number((prev + Math.random() * 0.5).toFixed(1)));
      setAvgSpeed(prev => Number((1.5 + Math.random() * 1.5).toFixed(1)));
    }, Math.random() * 3000 + 2000);

    return () => clearInterval(interval);
  }, []);

  const technologies = [
    { name: "React", color: "bg-blue-500" },
    { name: "TypeScript", color: "bg-blue-600" },
    { name: "Tailwind", color: "bg-cyan-500" },
    { name: "Supabase", color: "bg-green-500" },
    { name: "Vite", color: "bg-purple-500" },
    { name: "Framer Motion", color: "bg-pink-500" }
  ];

  const languages = [
    { name: "TypeScript", percent: 78 },
    { name: "JavaScript", percent: 15 },
    { name: "CSS", percent: 7 }
  ];

  const aiModels = ["GPT-4", "Gemini Pro", "Claude-3", "ML Médico"];
  const [currentModel, setCurrentModel] = useState(0);

  useEffect(() => {
    const modelInterval = setInterval(() => {
      setCurrentModel(prev => (prev + 1) % aiModels.length);
    }, 2000);
    return () => clearInterval(modelInterval);
  }, []);

  return null;
};

// Calculator Content Component
export const CalculatorContent = () => {
  const [weeklyHistories, setWeeklyHistories] = useState('');
  const [minutesPerHistory, setMinutesPerHistory] = useState('');
  const [showResults, setShowResults] = useState(false);
  const [calculatedSavings, setCalculatedSavings] = useState({ weekly: 0, monthly: 0 });

  const calculateSavings = () => {
    if (!weeklyHistories || !minutesPerHistory) return;
    
    const currentWeeklyTime = parseInt(weeklyHistories) * parseInt(minutesPerHistory);
    const savedWeeklyTime = currentWeeklyTime * 0.7;
    const savedWeeklyHours = savedWeeklyTime / 60;
    const savedMonthlyHours = savedWeeklyHours * 4;
    
    setCalculatedSavings({
      weekly: savedWeeklyHours,
      monthly: savedMonthlyHours
    });
    setShowResults(true);
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center gap-3 mb-6 justify-center">
        <Calculator className="h-6 w-6 text-blue-600" />
        <h3 className="text-2xl font-bold text-gray-900">
          Calculadora de Ahorro ROI
        </h3>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            ¿Cuántas historias clínicas nuevas haces a la semana?
          </label>
          <Input
            type="number"
            placeholder="ej. 10"
            value={weeklyHistories}
            onChange={(e) => setWeeklyHistories(e.target.value)}
            className="text-center"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            ¿Cuántos minutos tardas por cada una?
          </label>
          <Input
            type="number"
            placeholder="ej. 30"
            value={minutesPerHistory}
            onChange={(e) => setMinutesPerHistory(e.target.value)}
            className="text-center"
          />
        </div>

        <Button 
          onClick={calculateSavings}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white"
          disabled={!weeklyHistories || !minutesPerHistory}
        >
          <TrendingUp className="h-4 w-4 mr-2" />
          Calcular mi ahorro
        </Button>

        {showResults && (
          <div className="mt-6 p-4 bg-green-50 rounded-lg border border-green-200">
            <div className="text-center">
              <Award className="h-8 w-8 text-green-600 mx-auto mb-2" />
              <div className="text-lg font-semibold text-green-900 mb-1">
                ¡Podrías ahorrar {calculatedSavings.weekly.toFixed(1)} horas a la semana!
              </div>
              <div className="text-sm text-green-700">
                Eso son {calculatedSavings.monthly.toFixed(1)} horas al mes para atender más pacientes
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Import for family history component
import AntecedentesHeredoFamiliares from '@/components/historia-clinica/AntecedentesHeredoFamiliares';
import { useHistoriaClinica } from '@/hooks/useHistoriaClinica';

// Demo Content Component - Family History
export const DemoContent = () => {
  // Use the existing hook for managing form data
  const { formData, handleFamiliarChange, handleCondicionChange } = useHistoriaClinica();

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center gap-3 mb-6 justify-center">
        <Users className="h-6 w-6 text-blue-600" />
        <h3 className="text-2xl font-bold text-gray-900">
          Demo Interactivo - Antecedentes Heredo Familiares
        </h3>
      </div>

      <AntecedentesHeredoFamiliares 
        formData={formData}
        handleFamiliarChange={handleFamiliarChange}
        handleCondicionChange={handleCondicionChange}
      />
    </div>
  );
};

// Benefits Content Component
export const BenefitsContent = () => {
  return (
    <div>
      <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
        Beneficios de Dentaxy
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="text-center p-4">
          <Clock className="h-12 w-12 text-blue-600 mx-auto mb-3" />
          <h4 className="font-semibold text-gray-900 mb-2">Ahorro de Tiempo</h4>
          <p className="text-sm text-gray-600">
            Reduce hasta 70% el tiempo de redacción de historias clínicas
          </p>
        </div>
        
        <div className="text-center p-4">
          <Brain className="h-12 w-12 text-purple-600 mx-auto mb-3" />
          <h4 className="font-semibold text-gray-900 mb-2">IA Avanzada</h4>
          <p className="text-sm text-gray-600">
            Tecnología de inteligencia artificial especializada en odontología
          </p>
        </div>
        
        <div className="text-center p-4">
          <TrendingUp className="h-12 w-12 text-green-600 mx-auto mb-3" />
          <h4 className="font-semibold text-gray-900 mb-2">Mayor Productividad</h4>
          <p className="text-sm text-gray-600">
            Atiende más pacientes o dedica más tiempo a la atención clínica
          </p>
        </div>
      </div>
    </div>
  );
};