import { useState } from 'react';
import { Calculator } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

export const ROICalculatorContent = () => {
  const [dentistas, setDentistas] = useState(3);
  const [historiasPerDay, setHistoriasPerDay] = useState(8);
  const [costoHora, setCostoHora] = useState(50);
  const [diasTrabajo, setDiasTrabajo] = useState(22);

  // Calculations
  const tiempoAhorroPerHistoria = 84; // minutes saved per story
  const tiempoAhorroPerDay = (historiasPerDay * tiempoAhorroPerHistoria) / 60; // hours per day
  const ahorroMensual = tiempoAhorroPerDay * diasTrabajo * costoHora * dentistas;
  const ahorroAnual = ahorroMensual * 12;
  const costoDentaxy = dentistas * 29; // $29 per dentist per month
  const roiMensual = ((ahorroMensual - costoDentaxy) / costoDentaxy) * 100;

  return (
    <div className="p-6 space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center"
      >
        <Calculator className="w-12 h-12 text-primary mx-auto mb-4" />
        <h2 className="text-2xl font-bold mb-2">Calculadora de ROI</h2>
        <p className="text-muted-foreground">
          Descubre cuánto puedes ahorrar con Dentaxy en tu clínica
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Configuration Panel */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Card className="p-6">
            <CardContent className="p-0 space-y-6">
              <h3 className="text-lg font-semibold">Configuración de tu clínica</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Número de dentistas: {dentistas}
                  </label>
                  <Slider
                    value={[dentistas]}
                    onValueChange={(value) => setDentistas(value[0])}
                    max={20}
                    min={1}
                    step={1}
                    className="w-full"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Historias por día por dentista: {historiasPerDay}
                  </label>
                  <Slider
                    value={[historiasPerDay]}
                    onValueChange={(value) => setHistoriasPerDay(value[0])}
                    max={15}
                    min={1}
                    step={1}
                    className="w-full"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Costo por hora (USD)
                  </label>
                  <Input
                    type="number"
                    value={costoHora}
                    onChange={(e) => setCostoHora(Number(e.target.value))}
                    className="w-full"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Días de trabajo por mes: {diasTrabajo}
                  </label>
                  <Slider
                    value={[diasTrabajo]}
                    onValueChange={(value) => setDiasTrabajo(value[0])}
                    max={30}
                    min={15}
                    step={1}
                    className="w-full"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Results Panel */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="space-y-6"
        >
          {/* ROI Highlight */}
          <Card className="p-6 bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
            <CardContent className="p-0 text-center">
              <div className="text-4xl font-bold text-primary mb-2">
                {roiMensual.toFixed(0)}%
              </div>
              <div className="text-lg font-semibold">ROI Mensual</div>
              <div className="text-sm text-muted-foreground mt-2">
                Retorno de inversión mensual
              </div>
            </CardContent>
          </Card>

          {/* Detailed Results */}
          <Card className="p-6">
            <CardContent className="p-0 space-y-4">
              <h3 className="text-lg font-semibold">Ahorros detallados</h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {tiempoAhorroPerDay.toFixed(1)}h
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Tiempo ahorrado por día
                  </div>
                </div>

                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">
                    ${ahorroMensual.toFixed(0)}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Ahorro mensual
                  </div>
                </div>

                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">
                    ${ahorroAnual.toFixed(0)}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Ahorro anual
                  </div>
                </div>

                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">
                    ${costoDentaxy}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Costo Dentaxy/mes
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Time Comparison */}
          <Card className="p-6">
            <CardContent className="p-0">
              <h3 className="text-lg font-semibold mb-4">Comparación de tiempo</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Sin Dentaxy:</span>
                  <span className="font-semibold text-red-600">120 min/historia</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Con Dentaxy:</span>
                  <span className="font-semibold text-green-600">36 min/historia</span>
                </div>
                <div className="flex justify-between items-center pt-2 border-t">
                  <span className="text-sm font-semibold">Ahorro:</span>
                  <span className="font-bold text-primary">84 min (70%)</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* CTA */}
          <Button className="w-full" size="lg">
            Comenzar prueba gratuita
          </Button>
        </motion.div>
      </div>
    </div>
  );
};