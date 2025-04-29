
import React from 'react';
import { Card } from "@/components/ui/card";
import { Minus, Maximize2, X } from "lucide-react";
import { FormDataState } from '@/types/historiaClinica';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Chart as ChartJS, 
  CategoryScale, 
  LinearScale, 
  PointElement, 
  LineElement, 
  Title as ChartTitle,  
  Tooltip as ChartTooltip, 
  Legend as ChartLegend
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ChartTitle,
  ChartTooltip,
  ChartLegend
);

interface ExploracionFisicaProps {
  formData: FormDataState;
  handleExploracionFisicaChange: (part: string, value: string) => void;
}

const ExploracionFisica: React.FC<ExploracionFisicaProps> = ({
  formData,
  handleExploracionFisicaChange
}) => {
  const [isMinimized, setIsMinimized] = React.useState(false);
  const [isMaximized, setIsMaximized] = React.useState(false);

  const handleMinimize = () => {
    setIsMinimized(!isMinimized);
    setIsMaximized(false);
  };

  const handleMaximize = () => {
    setIsMaximized(!isMaximized);
    setIsMinimized(false);
  };

  const handleClose = () => {
    setIsMinimized(false);
    setIsMaximized(false);
  };

  const calculateBMI = () => {
    const weight = parseFloat(formData.exploracionFisica.signosVitales.peso);
    const height = parseFloat(formData.exploracionFisica.signosVitales.talla) / 100; // Convert cm to meters

    if (!isNaN(weight) && !isNaN(height) && height > 0) {
      const bmi = weight / (height * height);
      handleExploracionFisicaChange('signosVitales.imc', bmi.toFixed(2));
      return {
        labels: ['IMC'],
        datasets: [
          {
            label: 'Índice de Masa Corporal',
            data: [bmi.toFixed(2)],
            fill: false,
            backgroundColor: 'rgb(75, 192, 192)',
            borderColor: 'rgba(75, 192, 192, 0.2)',
          },
        ],
      };
    } else {
      handleExploracionFisicaChange('signosVitales.imc', 'N/A');
      return {
        labels: ['IMC'],
        datasets: [
          {
            label: 'Índice de Masa Corporal',
            data: [],
            fill: false,
            backgroundColor: 'rgb(75, 192, 192)',
            borderColor: 'rgba(75, 192, 192, 0.2)',
          },
        ],
      };
    }
  };

  const bmiData = calculateBMI();

  const chart = {
    type: 'line',
    data: bmiData,
    options: {
      scales: {
        y: {
          beginAtZero: true
        }
      }
    },
    update: (labels: string[], datasets: any[], options: any) => {
      chart.data.labels = labels;
      chart.data.datasets = datasets;
      chart.options = options;
    }
  };

  const updateVitalSigns = (vitalSign: string, value: string) => {
    const updatedSignosVitales = {
      ...formData.exploracionFisica.signosVitales,
      pulso: formData.exploracionFisica.signosVitales.pulso || "", // Add the missing property
      [vitalSign]: value
    };
    handleExploracionFisicaChange('signosVitales', JSON.stringify(updatedSignosVitales));
  };

  return (
    <div className={`max-w-4xl mx-auto transition-all duration-300 ${isMaximized ? "fixed inset-4 z-50" : ""}`}>
      <Card className={`bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-lg rounded-xl border-0 ${isMaximized ? "h-[calc(100vh-2rem)] overflow-y-auto" : ""}`}>
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex justify-center w-full">
            <div className="flex bg-gray-200 dark:bg-gray-700 rounded-full p-1">
              <button className="px-5 py-1.5 rounded-full transition-all duration-300 text-sm bg-blue-500 text-white shadow-md">
                Formulario
              </button>
              <button className="px-5 py-1.5 rounded-full transition-all duration-300 text-sm text-gray-700 dark:text-gray-300">
                Redacción IA
              </button>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button onClick={handleMinimize} className="p-1 rounded-full bg-green-100 text-green-600 hover:bg-green-200 transition-colors">
              <Minus className="w-4 h-4" />
            </button>
            <button onClick={handleMaximize} className="p-1 rounded-full bg-yellow-100 text-yellow-600 hover:bg-yellow-200 transition-colors">
              <Maximize2 className="w-4 h-4" />
            </button>
            <button onClick={handleClose} className="p-1 rounded-full bg-red-100 text-red-600 hover:bg-red-200 transition-colors">
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="flex justify-start px-6 py-2">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <span className="text-gray-400">IX.</span> EXPLORACIÓN FÍSICA
          </h2>
        </div>

        {!isMinimized && (
          <div className="p-6 space-y-8">
            {/* Signos Vitales */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Signos Vitales</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* TA */}
                <div>
                  <Label htmlFor="ta">Tensión Arterial</Label>
                  <Input
                    type="text"
                    id="ta"
                    value={formData.exploracionFisica.signosVitales.ta || ''}
                    onChange={(e) => updateVitalSigns('ta', e.target.value)}
                    placeholder="Ej: 120/80"
                  />
                </div>
                {/* FC */}
                <div>
                  <Label htmlFor="fc">Frecuencia Cardíaca</Label>
                  <Input
                    type="text"
                    id="fc"
                    value={formData.exploracionFisica.signosVitales.fc || ''}
                    onChange={(e) => updateVitalSigns('fc', e.target.value)}
                    placeholder="Ej: 72 lpm"
                  />
                </div>
                {/* FR */}
                <div>
                  <Label htmlFor="fr">Frecuencia Respiratoria</Label>
                  <Input
                    type="text"
                    id="fr"
                    value={formData.exploracionFisica.signosVitales.fr || ''}
                    onChange={(e) => updateVitalSigns('fr', e.target.value)}
                    placeholder="Ej: 16 rpm"
                  />
                </div>
                {/* Temperatura */}
                <div>
                  <Label htmlFor="temperatura">Temperatura</Label>
                  <Input
                    type="text"
                    id="temperatura"
                    value={formData.exploracionFisica.signosVitales.temperatura || ''}
                    onChange={(e) => updateVitalSigns('temperatura', e.target.value)}
                    placeholder="Ej: 36.5 °C"
                  />
                </div>
                {/* Peso */}
                <div>
                  <Label htmlFor="peso">Peso</Label>
                  <Input
                    type="text"
                    id="peso"
                    value={formData.exploracionFisica.signosVitales.peso || ''}
                    onChange={(e) => {
                      updateVitalSigns('peso', e.target.value);
                      const weight = parseFloat(e.target.value);
                      const height = parseFloat(formData.exploracionFisica.signosVitales.talla) / 100;
                      if (!isNaN(weight) && !isNaN(height) && height > 0) {
                        const bmi = weight / (height * height);
                        handleExploracionFisicaChange('signosVitales.imc', bmi.toFixed(2));
                      } else {
                        handleExploracionFisicaChange('signosVitales.imc', 'N/A');
                      }
                    }}
                    placeholder="Ej: 70 kg"
                  />
                </div>
                {/* Talla */}
                <div>
                  <Label htmlFor="talla">Talla</Label>
                  <Input
                    type="text"
                    id="talla"
                    value={formData.exploracionFisica.signosVitales.talla || ''}
                    onChange={(e) => {
                      updateVitalSigns('talla', e.target.value);
                      const height = parseFloat(e.target.value) / 100;
                      const weight = parseFloat(formData.exploracionFisica.signosVitales.peso);
                      if (!isNaN(weight) && !isNaN(height) && height > 0) {
                        const bmi = weight / (height * height);
                        handleExploracionFisicaChange('signosVitales.imc', bmi.toFixed(2));
                      } else {
                        handleExploracionFisicaChange('signosVitales.imc', 'N/A');
                      }
                    }}
                    placeholder="Ej: 175 cm"
                  />
                </div>
                {/* Pulso */}
                <div>
                  <Label htmlFor="pulso">Pulso</Label>
                  <Input
                    type="text"
                    id="pulso"
                    value={formData.exploracionFisica.signosVitales.pulso || ''}
                    onChange={(e) => updateVitalSigns('pulso', e.target.value)}
                    placeholder="Ej: 70 bpm"
                  />
                </div>
                {/* IMC */}
                <div>
                  <Label htmlFor="imc">IMC</Label>
                  <Input
                    type="text"
                    id="imc"
                    value={formData.exploracionFisica.signosVitales.imc || 'N/A'}
                    placeholder="Índice de Masa Corporal"
                    readOnly
                  />
                </div>
              </div>
            </div>

            {/* Gráfico de IMC */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Gráfico de IMC</h3>
              <ScrollArea className="rounded-md border p-4">
                {bmiData.datasets[0].data.length > 0 ? (
                  <Line data={chart.data} options={chart.options} />
                ) : (
                  <p className="text-center text-gray-500">
                    Ingrese peso y talla para calcular el IMC y mostrar el gráfico.
                  </p>
                )}
              </ScrollArea>
            </div>

            {/* Exploración General */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Exploración General</h3>
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <Label htmlFor="cabeza">Cabeza</Label>
                  <Textarea
                    id="cabeza"
                    value={formData.exploracionFisica.exploracion?.cabeza || ''}
                    onChange={(e) => handleExploracionFisicaChange('exploracion.cabeza', e.target.value)}
                    placeholder="Descripción de la exploración de la cabeza"
                  />
                </div>
                <div>
                  <Label htmlFor="cuello">Cuello</Label>
                  <Textarea
                    id="cuello"
                    value={formData.exploracionFisica.exploracion?.cuello || ''}
                    onChange={(e) => handleExploracionFisicaChange('exploracion.cuello', e.target.value)}
                    placeholder="Descripción de la exploración del cuello"
                  />
                </div>
                <div>
                  <Label htmlFor="torax">Tórax</Label>
                  <Textarea
                    id="torax"
                    value={formData.exploracionFisica.exploracion?.torax || ''}
                    onChange={(e) => handleExploracionFisicaChange('exploracion.torax', e.target.value)}
                    placeholder="Descripción de la exploración del tórax"
                  />
                </div>
                <div>
                  <Label htmlFor="abdomen">Abdomen</Label>
                  <Textarea
                    id="abdomen"
                    value={formData.exploracionFisica.exploracion?.abdomen || ''}
                    onChange={(e) => handleExploracionFisicaChange('exploracion.abdomen', e.target.value)}
                    placeholder="Descripción de la exploración del abdomen"
                  />
                </div>
                <div>
                  <Label htmlFor="extremidades">Extremidades</Label>
                  <Textarea
                    id="extremidades"
                    value={formData.exploracionFisica.exploracion?.extremidades || ''}
                    onChange={(e) => handleExploracionFisicaChange('exploracion.extremidades', e.target.value)}
                    placeholder="Descripción de la exploración de las extremidades"
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
};

export default ExploracionFisica;
