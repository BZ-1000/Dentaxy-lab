import { useState, useEffect } from 'react';
import { Clock, Users, FileText, Brain, Calculator, TrendingUp, Award, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';

// Stats Content Component
export const StatsContent = () => {
  const [timesSaved, setTimesSaved] = useState(12450);
  const [dentistsCount, setDentistsCount] = useState(1542);
  const [historiesCount, setHistoriesCount] = useState(8234);
  const [aiSuggestions, setAiSuggestions] = useState(1247832);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimesSaved(prev => prev + Math.floor(Math.random() * 3));
      setHistoriesCount(prev => prev + Math.floor(Math.random() * 2));
      setAiSuggestions(prev => prev + Math.floor(Math.random() * 5));
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('es-ES').format(num);
  };

  return (
    <div>
      <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
        Estadísticas en Tiempo Real
      </h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-blue-50 to-indigo-100 border-0 shadow-lg">
          <CardContent className="p-4 text-center">
            <Clock className="h-6 w-6 text-blue-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900 mb-1">
              {formatNumber(timesSaved)}
            </div>
            <div className="text-xs text-gray-600">Horas ahorradas</div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-emerald-50 to-green-100 border-0 shadow-lg">
          <CardContent className="p-4 text-center">
            <Users className="h-6 w-6 text-emerald-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900 mb-1">
              +{formatNumber(dentistsCount)}
            </div>
            <div className="text-xs text-gray-600">Odontólogos</div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-violet-100 border-0 shadow-lg">
          <CardContent className="p-4 text-center">
            <FileText className="h-6 w-6 text-purple-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900 mb-1">
              +{formatNumber(historiesCount)}
            </div>
            <div className="text-xs text-gray-600">Historias</div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-50 to-amber-100 border-0 shadow-lg">
          <CardContent className="p-4 text-center">
            <Brain className="h-6 w-6 text-orange-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900 mb-1">
              +{formatNumber(aiSuggestions)}
            </div>
            <div className="text-xs text-gray-600">IA Sugerencias</div>
          </CardContent>
        </Card>
      </div>
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