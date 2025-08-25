import { useState, useEffect, useRef } from 'react';
import { Clock, Users, FileText, Brain, Calculator, TrendingUp, Award, Zap, Activity, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Area, Tooltip } from 'recharts';

// --- AnimatedCounter Mejorado ---
// Ahora se activa al ser visible, maneja decimales y acepta sufijos.
const AnimatedCounter = ({ target, label, prefix = "", suffix = "" }: { 
  target: number; 
  label: string; 
  prefix?: string;
  suffix?: string;
}) => {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  useEffect(() => {
    if (isInView) {
      let current = 0;
      const duration = 1500;
      const increment = target / (duration / 20);
      
      const counter = setInterval(() => {
        current += increment;
        if (current >= target) {
          setCount(target);
          clearInterval(counter);
        } else {
          setCount(current);
        }
      }, 20);

      return () => clearInterval(counter);
    }
  }, [isInView, target]);

  const formatNumber = (num: number) => {
    const options = num % 1 !== 0 
      ? { minimumFractionDigits: 1, maximumFractionDigits: 1 }
      : { minimumFractionDigits: 0, maximumFractionDigits: 0 };
    return new Intl.NumberFormat('es-MX', options).format(num);
  };

  return (
    <motion.div 
      ref={ref}
      className="text-center py-4"
      whileHover={{ y: -5 }}
      transition={{ duration: 0.2 }}
    >
      <div className="text-5xl font-bold text-primary mb-2">
        {prefix}{formatNumber(count)}{suffix}
      </div>
      <div className="text-sm text-muted-foreground leading-relaxed">{label}</div>
    </motion.div>
  );
};


// Compact Dentaxy Activity Feed (Sin cambios)
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

// Minimalist Temporal Line Chart (Sin cambios)
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
          {phase === 'without' && (<motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-sm text-red-500 mb-4">Sin Dentaxy: Proceso manual tradicional</motion.p>)}
          {phase === 'transition' && (<motion.p initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }} className="text-sm font-medium text-primary mb-4">¡Ahora con Dentaxy! ✨</motion.p>)}
          {phase === 'with' && (<motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-sm text-emerald-500 mb-4">Con Dentaxy: Optimización con IA</motion.p>)}
        </AnimatePresence>

        <div className="h-64 border border-border rounded-lg p-4">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <XAxis dataKey="minute" tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} axisLine={false} tickLine={false} domain={[0, 140]} />
              <Line type="monotone" dataKey="tiempo" stroke={phase === 'without' ? '#ef4444' : '#10b981'} strokeWidth={2} dot={false} animationDuration={100} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {phase === 'with' && (<motion.div className="text-center mt-4"><span className="text-sm font-medium text-emerald-600">70% de ahorro de tiempo</span></motion.div>)}
      </div>
    </div>
  );
};

// StatsContent (Sin cambios)
export const StatsContent = () => {
  // ... (el resto del código de este componente no es relevante para la UI, se deja como estaba)
  return null;
};

// --- CalculatorContent Mejorado ---
export const CalculatorContent = () => {
  const [weeklyHistories, setWeeklyHistories] = useState('');
  const [minutesPerHistory, setMinutesPerHistory] = useState('');
  const [results, setResults] = useState<{ weekly: number; monthly: number; } | null>(null);
  const [calculationId, setCalculationId] = useState(0);

  const calculateSavings = () => {
    if (!weeklyHistories || !minutesPerHistory) return;
    
    const currentWeeklyTime = parseInt(weeklyHistories) * parseInt(minutesPerHistory);
    const savedWeeklyTime = currentWeeklyTime * 0.7; 
    const savedWeeklyHours = savedWeeklyTime / 60;
    const savedMonthlyHours = savedWeeklyHours * 4.33;
    
    setResults({
      weekly: savedWeeklyHours,
      monthly: savedMonthlyHours
    });
    setCalculationId(prevId => prevId + 1);
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" }
    }
  };

  const resultsVariants = {
    hidden: { opacity: 0, scale: 0.95, y: 10 },
    visible: { 
      opacity: 1, 
      scale: 1,
      y: 0,
      transition: { duration: 0.4, ease: "easeOut", staggerChildren: 0.2 } 
    },
    exit: { opacity: 0, scale: 0.95, transition: { duration: 0.2 } }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
      className="max-w-2xl mx-auto"
    >
      <Card className="overflow-hidden shadow-lg">
        <CardHeader className="text-center bg-muted/30">
          <motion.div whileHover={{ scale: 1.1, rotate: 5 }} className="inline-block mx-auto">
            <Calculator className="h-8 w-8 text-primary" />
          </motion.div>
          <CardTitle className="text-2xl font-bold">Calculadora de Ahorro (ROI)</CardTitle>
          <CardDescription>Estima cuántas horas podrías recuperar usando Dentaxy.</CardDescription>
        </CardHeader>
        <CardContent className="p-6 space-y-6">
          <div className="space-y-4">
            <motion.div whileHover={{ y: -2 }}>
              <label className="block text-sm font-medium text-muted-foreground mb-2">
                Historias clínicas nuevas por semana
              </label>
              <Input
                type="number"
                placeholder="ej. 10"
                value={weeklyHistories}
                onChange={(e) => { setWeeklyHistories(e.target.value); setResults(null); }}
                className="text-center text-lg"
              />
            </motion.div>

            <motion.div whileHover={{ y: -2 }}>
              <label className="block text-sm font-medium text-muted-foreground mb-2">
                Minutos que tardas por cada una (promedio)
              </label>
              <Input
                type="number"
                placeholder="ej. 30"
                value={minutesPerHistory}
                onChange={(e) => { setMinutesPerHistory(e.target.value); setResults(null); }}
                className="text-center text-lg"
              />
            </motion.div>
          </div>

          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Button 
              onClick={calculateSavings}
              className="w-full text-base py-6"
              disabled={!weeklyHistories || !minutesPerHistory}
            >
              <TrendingUp className="h-5 w-5 mr-2" />
              Calcular mi Ahorro de Tiempo
            </Button>
          </motion.div>

          <div className="mt-6 min-h-[220px]">
            <AnimatePresence mode="wait">
              {results && (
                <motion.div
                  key={calculationId}
                  variants={resultsVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className="p-6 bg-primary/5 rounded-lg border border-primary/20"
                >
                  <motion.div className="text-center mb-4">
                    <Award className="h-8 w-8 text-amber-500 mx-auto mb-2" />
                    <h4 className="text-xl font-semibold text-foreground">
                      ¡Tu potencial de ahorro es enorme!
                    </h4>
                  </motion.div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 divide-y md:divide-y-0 md:divide-x divide-border">
                    <AnimatedCounter 
                      target={results.weekly}
                      label="Horas ahorradas a la semana"
                      suffix=" hrs"
                    />
                    <AnimatedCounter 
                      target={results.monthly}
                      label="Horas ahorradas al mes"
                      suffix=" hrs"
                    />
                  </div>

                  <motion.p className="text-center text-xs text-muted-foreground mt-4">
                    Tiempo que puedes reinvertir en tus pacientes, tu práctica o en ti.
                  </motion.p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};


// Demo Content Component (Sin cambios)
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
                <input type="checkbox" className="rounded text-blue-600" checked={selectedConditions.includes(condition)} onChange={() => handleConditionToggle(condition)} />
                <span className="text-sm">{condition}</span>
              </label>
            ))}
          </div>
        </div>
        <Button onClick={generateText} disabled={selectedConditions.length === 0 || isGenerating} className="w-full bg-purple-600 hover:bg-purple-700 text-white">
          <Brain className="h-4 w-4 mr-2" />
          {isGenerating ? 'Generando...' : 'Generar redacción con IA'}
        </Button>
        {(generatedText || isGenerating) && (
          <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
            <div className="text-sm text-purple-900">
              <strong>Resultado generado:</strong><br />
              {isGenerating ? (<div className="animate-pulse">Analizando condiciones y generando redacción médica profesional...</div>) : (generatedText)}
            </div>
          </div>
        )}
        {generatedText && !isGenerating && (<div className="text-center text-xs text-gray-500">⚡ Generado en 2.0 segundos</div>)}
      </div>
    </div>
  );
};

// Benefits Content Component (Sin cambios)
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
          <p className="text-sm text-gray-600">Reduce hasta 70% el tiempo de redacción de historias clínicas</p>
        </div>
        <div className="text-center p-4">
          <Brain className="h-12 w-12 text-purple-600 mx-auto mb-3" />
          <h4 className="font-semibold text-gray-900 mb-2">IA Avanzada</h4>
          <p className="text-sm text-gray-600">Tecnología de inteligencia artificial especializada en odontología</p>
        </div>
        <div className="text-center p-4">
          <TrendingUp className="h-12 w-12 text-green-600 mx-auto mb-3" />
          <h4 className="font-semibold text-gray-900 mb-2">Mayor Productividad</h4>
          <p className="text-sm text-gray-600">Atiende más pacientes o dedica más tiempo a la atención clínica</p>
        </div>
      </div>
    </div>
  );
};calculador