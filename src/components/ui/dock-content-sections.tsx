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

// Minimalist AI Activity Feed
const AIActivityFeed = () => {
  const [currentActivity, setCurrentActivity] = useState(0);
  
  const activities = [
    "Redacción IA generada: 'Padecimiento Actual'",
    "Completado automáticamente: 'Antecedentes Patológicos'",
    "Nueva redacción: 'Examen Físico Intrabucal'",
    "IA redactó: 'Antecedentes Heredofamiliares' en 2.1s",
    "Generación automática: 'Interrogatorio por Sistemas'",
    "Finalizada redacción: 'Exploración Física'",
    "Historia clínica optimizada: 'Diagnóstico y Pronóstico'",
    "IA completó: 'Antecedentes Quirúrgicos'"
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentActivity((prev) => (prev + 1) % activities.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="py-6">
      <div className="flex items-center gap-2 mb-4">
        <motion.div 
          className="w-2 h-2 bg-emerald-500 rounded-full"
          animate={{ opacity: [1, 0.3, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
        <span className="text-sm font-medium text-emerald-600">IA en Acción</span>
      </div>
      
      <AnimatePresence mode="wait">
        <motion.div
          key={currentActivity}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
          className="text-sm text-muted-foreground"
        >
          {activities[currentActivity]}
        </motion.div>
      </AnimatePresence>
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

// Minimalist Main Stats Content Component
export const StatsContent = () => {
  const [activeUsers, setActiveUsers] = useState(27);
  const [dashboardKey, setDashboardKey] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveUsers(prev => {
        const change = Math.floor(Math.random() * 7) - 3;
        const newValue = prev + change;
        return Math.max(15, Math.min(45, newValue));
      });
    }, Math.random() * 3000 + 2000);

    return () => clearInterval(interval);
  }, []);

  const reloadDashboard = () => {
    setDashboardKey(prev => prev + 1);
  };

  return (
    <div className="space-y-12 p-4">
      {/* Minimalist Active Users Counter */}
      <div className="text-center py-4">
        <p className="text-lg text-muted-foreground">
          En este momento hay{' '}
          <motion.span 
            className="font-bold text-2xl text-primary mx-1"
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 0.3 }}
            key={activeUsers}
          >
            {activeUsers}
          </motion.span>{' '}
          odontólogos optimizando su consulta dentro de Dentaxy.
        </p>
      </div>

      {/* AI Activity Feed */}
      <AIActivityFeed />

      {/* Success Dashboard */}
      <div className="py-8">
        <div className="flex items-center justify-between mb-8">
          <h3 className="text-2xl font-semibold">Dashboard de Éxito</h3>
          <Button
            variant="outline"
            size="sm"
            onClick={reloadDashboard}
            className="flex items-center gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            Recargar
          </Button>
        </div>
        
        <div key={dashboardKey} className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8">
          <AnimatedCounter target={1000} label="Redacciones de IA Automáticas Generadas" prefix="+" />
          <AnimatedCounter target={5900} label="Historias Clínicas Optimizadas" prefix="+" />
          <AnimatedCounter target={1950} label="Horas de Trabajo Recuperadas" prefix="+" />
          <AnimatedCounter target={280} label="Odontólogos en la Comunidad" prefix="+" />
        </div>
      </div>

      {/* Temporal Line Chart */}
      <TemporalLineChart />
    </div>
  );
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

// Demo Content Component
export const DemoContent = () => {
  const [selectedConditions, setSelectedConditions] = useState<string[]>([]);
  const [generatedText, setGeneratedText] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const conditions = [
    'Diabetes mellitus tipo 2',
    'Hipertensión arterial',
    'Asma bronquial',
    'Artritis reumatoide',
    'Hipotiroidismo'
  ];

  const handleConditionToggle = (condition: string) => {
    setSelectedConditions(prev => 
      prev.includes(condition) 
        ? prev.filter(c => c !== condition)
        : [...prev, condition]
    );
  };

  const generateText = () => {
    if (selectedConditions.length === 0) return;
    
    setIsGenerating(true);
    setGeneratedText('');
    
    setTimeout(() => {
      let text = 'El paciente presenta antecedentes de ';
      
      if (selectedConditions.length === 1) {
        text += `${selectedConditions[0].toLowerCase()} bajo control médico.`;
      } else if (selectedConditions.length === 2) {
        text += `${selectedConditions[0].toLowerCase()} y ${selectedConditions[1].toLowerCase()}, ambas bajo control médico.`;
      } else {
        const lastCondition = selectedConditions[selectedConditions.length - 1];
        const otherConditions = selectedConditions.slice(0, -1);
        text += `${otherConditions.map(c => c.toLowerCase()).join(', ')}, y ${lastCondition.toLowerCase()}, todas bajo control médico.`;
      }
      
      text += ' Se recomienda seguimiento periódico y adherencia al tratamiento farmacológico indicado.';
      
      setGeneratedText(text);
      setIsGenerating(false);
    }, 2000);
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center gap-3 mb-6 justify-center">
        <Brain className="h-6 w-6 text-purple-600" />
        <h3 className="text-2xl font-bold text-gray-900">
          Demo de IA - Antecedentes Patológicos
        </h3>
      </div>

      <div className="space-y-4">
        <div className="p-4 bg-gray-50 rounded-lg">
          <h4 className="font-medium text-gray-900 mb-3">Selecciona las condiciones del paciente:</h4>
          
          <div className="space-y-2">
            {conditions.map((condition) => (
              <label key={condition} className="flex items-center space-x-3 cursor-pointer">
                <input 
                  type="checkbox" 
                  className="rounded text-blue-600"
                  checked={selectedConditions.includes(condition)}
                  onChange={() => handleConditionToggle(condition)}
                />
                <span className="text-sm">{condition}</span>
              </label>
            ))}
          </div>
        </div>

        <Button 
          onClick={generateText}
          disabled={selectedConditions.length === 0 || isGenerating}
          className="w-full bg-purple-600 hover:bg-purple-700 text-white"
        >
          <Brain className="h-4 w-4 mr-2" />
          {isGenerating ? 'Generando...' : 'Generar redacción con IA'}
        </Button>

        {(generatedText || isGenerating) && (
          <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
            <div className="text-sm text-purple-900">
              <strong>Resultado generado:</strong><br />
              {isGenerating ? (
                <div className="animate-pulse">Analizando condiciones y generando redacción médica profesional...</div>
              ) : (
                generatedText
              )}
            </div>
          </div>
        )}

        {generatedText && !isGenerating && (
          <div className="text-center text-xs text-gray-500">
            ⚡ Generado en 2.0 segundos
          </div>
        )}
      </div>
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