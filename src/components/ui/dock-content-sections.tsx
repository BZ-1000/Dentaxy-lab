import { useState, useEffect, useRef } from 'react';
import { Clock, Users, FileText, Brain, Calculator, TrendingUp, Award, Zap, Activity } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Area, Tooltip } from 'recharts';

// Animated Counter Component with Enhanced Apple-style Design
const AnimatedCounter = ({ target, label, prefix = "", delay = 0 }: { 
  target: number; 
  label: string; 
  prefix?: string;
  delay?: number;
}) => {
  const [count, setCount] = useState(0);
  const [hasAnimated, setHasAnimated] = useState(false);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (isInView && !hasAnimated) {
      const timer = setTimeout(() => {
        setHasAnimated(true);
        let current = 0;
        const duration = 2500; // Slower animation
        const increment = target / (duration / 30);
        
        const counter = setInterval(() => {
          current += increment;
          if (current >= target) {
            setCount(target);
            clearInterval(counter);
          } else {
            setCount(Math.floor(current));
          }
        }, 30);
        
        return () => clearInterval(counter);
      }, delay);
      
      return () => clearTimeout(timer);
    }
  }, [isInView, target, hasAnimated, delay]);

  return (
    <motion.div 
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ 
        duration: 0.6, 
        delay: delay / 1000,
        ease: [0.16, 1, 0.3, 1] // Apple's ease curve
      }}
      className="group"
    >
      <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-6 hover:bg-white/15 transition-all duration-300 hover:scale-105 hover:shadow-xl">
        <motion.div 
          className="text-5xl font-bold bg-gradient-to-br from-primary to-primary/70 bg-clip-text text-transparent mb-3"
          animate={hasAnimated ? { scale: [1, 1.1, 1] } : {}}
          transition={{ duration: 0.4, delay: (delay + 1500) / 1000 }}
        >
          {prefix}{new Intl.NumberFormat('es-ES').format(count)}
        </motion.div>
        <div className="text-sm font-medium text-foreground/70 leading-relaxed">{label}</div>
      </div>
    </motion.div>
  );
};

// AI Activity Feed Component with Enhanced Apple Design
const AIActivityFeed = () => {
  const [currentActivity, setCurrentActivity] = useState(0);
  
  const activities = [
    "Dentaxy acaba de generar una redacción IA del apartado 'Padecimiento Actual'",
    "Dentaxy completó automáticamente 'Antecedentes Patológicos' para un nuevo paciente",
    "Nueva redacción IA generada para 'Examen Físico Intrabucal'",
    "IA de Dentaxy redactó 'Antecedentes Heredofamiliares' en 2.1 segundos",
    "Generación automática completada para 'Interrogatorio por Sistemas'",
    "Dentaxy IA finalizó redacción de 'Exploración Física' con precisión médica",
    "Nueva historia clínica optimizada con IA en 'Diagnóstico y Pronóstico'",
    "IA especializada completó 'Antecedentes Quirúrgicos' exitosamente"
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentActivity((prev) => (prev + 1) % activities.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="backdrop-blur-xl bg-gradient-to-br from-emerald-500/10 to-green-500/10 border border-emerald-500/20 rounded-3xl p-6 shadow-lg">
      <div className="flex items-center gap-3 mb-4">
        <motion.div 
          className="w-3 h-3 bg-emerald-500 rounded-full"
          animate={{ scale: [1, 1.3, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
        <span className="text-sm font-semibold text-emerald-600">IA en Acción • En Vivo</span>
      </div>
      
      <AnimatePresence mode="wait">
        <motion.div
          key={currentActivity}
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.95 }}
          transition={{ 
            duration: 0.5,
            ease: [0.16, 1, 0.3, 1]
          }}
          className="flex items-start gap-4"
        >
          <motion.div 
            className="w-8 h-8 bg-gradient-to-br from-gray-900 to-gray-700 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg"
            whileHover={{ scale: 1.1 }}
            transition={{ duration: 0.2 }}
          >
            <motion.div 
              className="w-4 h-4 bg-white rounded-sm"
              animate={{ rotate: [0, 5, -5, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </motion.div>
          <p className="text-sm font-medium text-foreground/80 leading-relaxed">
            {activities[currentActivity]}
          </p>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

// Temporal Line Chart Component with Apple Design
const TemporalLineChart = () => {
  const [currentMinute, setCurrentMinute] = useState(0);
  const [phase, setPhase] = useState<'without' | 'transition' | 'with'>('without');
  const [data, setData] = useState<Array<{minute: number, tiempo: number}>>([]);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (!isInView) return;

    // Phase 1: Build line from 1 to 120 minutes (without Dentaxy)
    const buildInitialLine = () => {
      let minute = 0;
      const interval = setInterval(() => {
        minute += 2;
        setCurrentMinute(minute);
        setData(prev => [...prev, { minute, tiempo: 120 }]);
        
        if (minute >= 120) {
          clearInterval(interval);
          setTimeout(() => setPhase('transition'), 1000);
        }
      }, 30);
    };

    // Phase 2: Transition message
    const showTransition = () => {
      setTimeout(() => {
        setPhase('with');
        setData([]);
        setCurrentMinute(0);
        
        // Phase 3: Build new line with 70% reduction
        let minute = 0;
        const interval = setInterval(() => {
          minute += 2;
          setCurrentMinute(minute);
          setData(prev => [...prev, { minute, tiempo: 36 }]);
          
          if (minute >= 120) {
            clearInterval(interval);
          }
        }, 30);
      }, 2000);
    };

    buildInitialLine();
    const transitionTimer = setTimeout(showTransition, 4000);
    
    return () => clearTimeout(transitionTimer);
  }, [isInView]);

  return (
    <motion.div 
      ref={ref}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={isInView ? { opacity: 1, scale: 1 } : {}}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className="backdrop-blur-xl bg-gradient-to-br from-white/10 to-white/5 border border-white/20 rounded-3xl p-8 shadow-xl"
    >
      <div className="text-center mb-6">
        <h4 className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent mb-2">
          Tiempo promedio para crear una historia clínica
        </h4>
        
        <AnimatePresence mode="wait">
          {phase === 'without' && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-lg font-medium text-red-500"
            >
              Sin Dentaxy: Proceso manual tradicional
            </motion.p>
          )}
          {phase === 'transition' && (
            <motion.p
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="text-xl font-bold text-primary"
            >
              ¡Ahora con Dentaxy! ✨
            </motion.p>
          )}
          {phase === 'with' && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-lg font-medium text-emerald-500"
            >
              Con Dentaxy: Optimización con IA
            </motion.p>
          )}
        </AnimatePresence>
      </div>

      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
            <XAxis 
              dataKey="minute"
              tick={{ fontSize: 12, fill: 'hsl(var(--foreground))' }}
              axisLine={false}
              tickLine={false}
              label={{ value: 'Progreso del trabajo (minutos)', position: 'insideBottom', offset: -10 }}
            />
            <YAxis 
              tick={{ fontSize: 12, fill: 'hsl(var(--foreground))' }}
              axisLine={false}
              tickLine={false}
              domain={[0, 140]}
              label={{ value: 'Tiempo total requerido', angle: -90, position: 'insideLeft' }}
            />
            <Tooltip 
              contentStyle={{
                backgroundColor: 'hsl(var(--background))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '12px',
                boxShadow: '0 10px 25px rgba(0,0,0,0.1)'
              }}
            />
            <Line 
              type="monotone"
              dataKey="tiempo"
              stroke={phase === 'without' ? '#ef4444' : '#10b981'}
              strokeWidth={4}
              dot={false}
              animationDuration={100}
              strokeDasharray={phase === 'transition' ? "5,5" : "0,0"}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <motion.div 
        className="text-center mt-6"
        animate={phase === 'with' ? { scale: [1, 1.05, 1] } : {}}
        transition={{ duration: 0.5, delay: 2 }}
      >
        <motion.span 
          className="inline-flex items-center px-6 py-3 rounded-2xl text-sm font-semibold bg-gradient-to-r from-emerald-500 to-green-500 text-white shadow-lg"
          whileHover={{ scale: 1.05 }}
        >
          <TrendingUp className="w-5 h-5 mr-2" />
          {phase === 'with' ? '70% de ahorro de tiempo' : 'Analizando eficiencia...'}
        </motion.span>
      </motion.div>
    </motion.div>
  );
};

// Main Stats Content Component with Apple 2025 Design
export const StatsContent = () => {
  const [activeUsers, setActiveUsers] = useState(27);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveUsers(prev => {
        const change = Math.floor(Math.random() * 7) - 3; // -3 to +3
        const newValue = prev + change;
        return Math.max(15, Math.min(45, newValue)); // Keep between 15-45
      });
    }, Math.random() * 3000 + 2000); // Random interval 2-5 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-10 p-2">
      {/* Active Users Counter with Glassmorphism */}
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="text-center"
      >
        <div className="backdrop-blur-xl bg-gradient-to-r from-primary/10 to-primary/5 border border-primary/20 rounded-3xl p-8 shadow-lg">
          <p className="text-xl font-medium text-foreground/80 leading-relaxed">
            En este momento hay{' '}
            <motion.span 
              className="font-bold text-4xl bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent mx-2"
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 0.3 }}
              key={activeUsers}
            >
              {activeUsers}
            </motion.span>{' '}
            odontólogos optimizando su consulta dentro de Dentaxy.
          </p>
        </div>
      </motion.div>

      {/* AI Activity Feed */}
      <AIActivityFeed />

      {/* Success Dashboard with Staggered Animations */}
      <motion.div 
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
        className="backdrop-blur-xl bg-gradient-to-br from-background/50 to-background/30 border border-white/10 rounded-3xl p-8 shadow-xl"
      >
        <h3 className="text-3xl font-bold text-center mb-8 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
          Dashboard de Éxito
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          <AnimatedCounter target={1000} label="Redacciones de IA Automáticas Generadas" prefix="+" delay={0} />
          <AnimatedCounter target={5900} label="Historias Clínicas Optimizadas" prefix="+" delay={200} />
          <AnimatedCounter target={1950} label="Horas de Trabajo Recuperadas" prefix="+" delay={400} />
          <AnimatedCounter target={280} label="Odontólogos en la Comunidad" prefix="+" delay={600} />
        </div>
      </motion.div>

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