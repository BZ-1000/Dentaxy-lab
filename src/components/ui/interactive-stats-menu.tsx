import { useState, useEffect } from 'react';
import { Clock, Users, FileText, Brain, Calculator, Zap, TrendingUp, Award } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';

export const InteractiveStatsMenu = () => {
  const [timesSaved, setTimesSaved] = useState(12450);
  const [dentistsCount, setDentistsCount] = useState(1542);
  const [historiesCount, setHistoriesCount] = useState(8234);
  const [aiSuggestions, setAiSuggestions] = useState(1247832);
  
  // ROI Calculator state
  const [weeklyHistories, setWeeklyHistories] = useState('');
  const [minutesPerHistory, setMinutesPerHistory] = useState('');
  const [showResults, setShowResults] = useState(false);
  const [calculatedSavings, setCalculatedSavings] = useState({ weekly: 0, monthly: 0 });

  // Animate counters on load
  useEffect(() => {
    const interval = setInterval(() => {
      setTimesSaved(prev => prev + Math.floor(Math.random() * 3));
      setHistoriesCount(prev => prev + Math.floor(Math.random() * 2));
      setAiSuggestions(prev => prev + Math.floor(Math.random() * 5));
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const calculateSavings = () => {
    if (!weeklyHistories || !minutesPerHistory) return;
    
    const currentWeeklyTime = parseInt(weeklyHistories) * parseInt(minutesPerHistory);
    const savedWeeklyTime = currentWeeklyTime * 0.7; // 70% time saved
    const savedWeeklyHours = savedWeeklyTime / 60;
    const savedMonthlyHours = savedWeeklyHours * 4;
    
    setCalculatedSavings({
      weekly: savedWeeklyHours,
      monthly: savedMonthlyHours
    });
    setShowResults(true);
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('es-ES').format(num);
  };

  return (
    <div className="w-full max-w-6xl mx-auto py-16 px-4" data-stats-menu>
      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-16">
        {/* Time Saved Counter */}
        <Card className="relative overflow-hidden bg-gradient-to-br from-blue-50 to-indigo-100 border-0 shadow-lg">
          <CardContent className="p-6 text-center">
            <div className="flex justify-center mb-3">
              <Clock className="h-8 w-8 text-blue-600" />
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-1">
              {formatNumber(timesSaved)}
            </div>
            <div className="text-sm text-gray-600">
              Horas ahorradas
            </div>
          </CardContent>
        </Card>

        {/* Dentists Count */}
        <Card className="relative overflow-hidden bg-gradient-to-br from-emerald-50 to-green-100 border-0 shadow-lg">
          <CardContent className="p-6 text-center">
            <div className="flex justify-center mb-3">
              <Users className="h-8 w-8 text-emerald-600" />
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-1">
              +{formatNumber(dentistsCount)}
            </div>
            <div className="text-sm text-gray-600">
              Odontólogos registrados
            </div>
          </CardContent>
        </Card>

        {/* Histories Generated */}
        <Card className="relative overflow-hidden bg-gradient-to-br from-purple-50 to-violet-100 border-0 shadow-lg">
          <CardContent className="p-6 text-center">
            <div className="flex justify-center mb-3">
              <FileText className="h-8 w-8 text-purple-600" />
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-1">
              +{formatNumber(historiesCount)}
            </div>
            <div className="text-sm text-gray-600">
              Historias generadas
            </div>
          </CardContent>
        </Card>

        {/* AI Suggestions */}
        <Card className="relative overflow-hidden bg-gradient-to-br from-orange-50 to-amber-100 border-0 shadow-lg">
          <CardContent className="p-6 text-center">
            <div className="flex justify-center mb-3">
              <Brain className="h-8 w-8 text-orange-600" />
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-1">
              +{formatNumber(aiSuggestions)}
            </div>
            <div className="text-sm text-gray-600">
              Sugerencias de IA
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Interactive Tools Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* ROI Calculator */}
        <Card className="bg-white border border-gray-200 shadow-xl" data-calculator>
          <CardContent className="p-8">
            <div className="flex items-center gap-3 mb-6">
              <Calculator className="h-6 w-6 text-blue-600" />
              <h3 className="text-xl font-semibold text-gray-900">
                Calcula tu ahorro personalizado
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
          </CardContent>
        </Card>

        {/* Mini Demo */}
        <Card className="bg-white border border-gray-200 shadow-xl" data-demo>
          <CardContent className="p-8">
            <div className="flex items-center gap-3 mb-6">
              <Zap className="h-6 w-6 text-purple-600" />
              <h3 className="text-xl font-semibold text-gray-900">
                Prueba la IA en acción
              </h3>
            </div>

            <div className="space-y-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-3">Ejemplo: Antecedentes Patológicos</h4>
                
                <div className="space-y-2">
                  <label className="flex items-center space-x-2">
                    <input type="checkbox" className="rounded text-blue-600" />
                    <span className="text-sm">Diabetes</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input type="checkbox" className="rounded text-blue-600" />
                    <span className="text-sm">Hipertensión</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input type="checkbox" className="rounded text-blue-600" />
                    <span className="text-sm">Asma</span>
                  </label>
                </div>
              </div>

              <Button className="w-full bg-purple-600 hover:bg-purple-700 text-white">
                <Brain className="h-4 w-4 mr-2" />
                Generar redacción con IA
              </Button>

              <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                <div className="text-sm text-purple-900">
                  <strong>Resultado generado:</strong><br />
                  "El paciente presenta antecedentes de diabetes mellitus tipo 2 bajo control médico, hipertensión arterial manejada con medicación antihipertensiva, y asma bronquial ocasional..."
                </div>
              </div>

              <div className="text-center text-xs text-gray-500">
                ⚡ Generado en 2.3 segundos
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};