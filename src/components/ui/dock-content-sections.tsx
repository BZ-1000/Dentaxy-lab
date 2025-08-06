import { useState, useEffect, useRef } from 'react';
import { Clock, Users, FileText, Brain, Calculator, TrendingUp, Award, Zap, Activity } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { motion, useInView } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Cell } from 'recharts';

// Animated Counter Component
const AnimatedCounter = ({ target, label, prefix = "" }: { target: number; label: string; prefix?: string }) => {
  const [count, setCount] = useState(0);
  const [hasAnimated, setHasAnimated] = useState(false);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (isInView && !hasAnimated) {
      setHasAnimated(true);
      let current = 0;
      const increment = target / 60;
      const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
          setCount(target);
          clearInterval(timer);
        } else {
          setCount(Math.floor(current));
        }
      }, 30);
      return () => clearInterval(timer);
    }
  }, [isInView, target, hasAnimated]);

  return (
    <div ref={ref} className="text-center">
      <div className="text-4xl font-bold text-primary mb-2">
        {prefix}{new Intl.NumberFormat('es-ES').format(count)}
      </div>
      <div className="text-sm text-muted-foreground">{label}</div>
    </div>
  );
};

// AI Activity Feed Component
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
    }, 3500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-gradient-to-r from-emerald-50 to-green-50 border border-emerald-200 rounded-lg p-4">
      <div className="flex items-center gap-2 mb-3">
        <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
        <span className="text-sm font-medium text-emerald-800">Actividad Reciente de la IA</span>
      </div>
      <motion.div
        key={currentActivity}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="flex items-start gap-3"
      >
        <div className="w-6 h-6 bg-gray-900 rounded-full flex items-center justify-center flex-shrink-0">
          <div className="w-3 h-3 bg-white rounded-sm"></div>
        </div>
        <p className="text-sm text-gray-700 leading-relaxed">
          {activities[currentActivity]}
        </p>
      </motion.div>
    </div>
  );
};

// Before vs After Chart Component
const BeforeAfterChart = () => {
  const [showAnimation, setShowAnimation] = useState(false);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  const data = [
    {
      name: 'Sin Dentaxy',
      tiempo: showAnimation ? 120 : 120,
      color: '#ef4444'
    },
    {
      name: 'Con Dentaxy',
      tiempo: showAnimation ? 36 : 120,
      color: '#10b981'
    }
  ];

  useEffect(() => {
    if (isInView) {
      setTimeout(() => setShowAnimation(true), 500);
    }
  }, [isInView]);

  return (
    <div ref={ref} className="bg-white border border-gray-200 rounded-lg p-6">
      <h4 className="text-lg font-semibold text-center mb-4">
        Tiempo promedio para crear una historia clínica
      </h4>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <XAxis 
              dataKey="name" 
              tick={{ fontSize: 12 }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis 
              tick={{ fontSize: 12 }}
              axisLine={false}
              tickLine={false}
              domain={[0, 140]}
              label={{ value: 'Minutos', angle: -90, position: 'insideLeft' }}
            />
            <Bar 
              dataKey="tiempo" 
              radius={[8, 8, 0, 0]}
              animationDuration={1500}
              animationBegin={0}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="text-center mt-4">
        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
          <TrendingUp className="w-4 h-4 mr-1" />
          70% de ahorro de tiempo
        </span>
      </div>
    </div>
  );
};

// Main Stats Content Component
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
    <div className="space-y-8">
      {/* Active Users Counter */}
      <div className="text-center">
        <p className="text-lg text-gray-700">
          En este momento hay <span className="font-bold text-2xl text-primary mx-1">{activeUsers}</span> odontólogos optimizando su consulta dentro de Dentaxy.
        </p>
      </div>

      {/* AI Activity Feed */}
      <AIActivityFeed />

      {/* Success Dashboard */}
      <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg p-6">
        <h3 className="text-xl font-bold text-center mb-6 text-gray-900">
          Dashboard de Éxito
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <AnimatedCounter target={1000} label="Redacciones de IA Automáticas Generadas" prefix="+" />
          <AnimatedCounter target={5900} label="Historias Clínicas Optimizadas" prefix="+" />
          <AnimatedCounter target={1950} label="Horas de Trabajo Recuperadas" prefix="+" />
          <AnimatedCounter target={280} label="Odontólogos en la Comunidad" prefix="+" />
        </div>
      </div>

      {/* Before vs After Chart */}
      <BeforeAfterChart />
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