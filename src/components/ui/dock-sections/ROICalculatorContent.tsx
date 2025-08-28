import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Calculator, DollarSign, Clock, TrendingUp, Users, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Slider } from '@/components/ui/slider'

export const ROICalculatorContent: React.FC = () => {
  const [dentistas, setDentistas] = useState([5])
  const [historiasPorDia, setHistoriasPorDia] = useState([10])
  const [costoHora, setCostoHora] = useState(25)
  const [diasTrabajo, setDiasTrabajo] = useState(22)

  // Cálculos
  const tiempoTradicional = 45 // minutos
  const tiempoDentaxy = 8 // minutos
  const ahorroTiempo = tiempoTradicional - tiempoDentaxy // 37 minutos por historia
  
  const ahorroMinutosDia = dentistas[0] * historiasPorDia[0] * ahorroTiempo
  const ahorroHorasDia = ahorroMinutosDia / 60
  const ahorroMensual = ahorroHorasDia * diasTrabajo * costoHora
  const ahorroAnual = ahorroMensual * 12

  const costoMensualDentaxy = 29 * dentistas[0] // $29 por dentista
  const roiMensual = ((ahorroMensual - costoMensualDentaxy) / costoMensualDentaxy) * 100

  return (
    <div className="grid grid-cols-3 gap-6">
      {/* Panel de Configuración */}
      <motion.div 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="col-span-1 bg-white rounded-xl p-6 border border-gray-200 shadow-sm"
      >
        <div className="flex items-center gap-2 mb-6">
          <Calculator className="w-5 h-5 text-primary" />
          <h3 className="font-semibold text-gray-800">Configuración</h3>
        </div>

        <div className="space-y-6">
          <div className="space-y-2">
            <Label className="text-sm font-medium">Número de Dentistas</Label>
            <Slider
              value={dentistas}
              onValueChange={setDentistas}
              max={50}
              min={1}
              step={1}
              className="w-full"
            />
            <p className="text-xs text-muted-foreground">{dentistas[0]} dentistas</p>
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium">Historias por Día</Label>
            <Slider
              value={historiasPorDia}
              onValueChange={setHistoriasPorDia}
              max={30}
              min={1}
              step={1}
              className="w-full"
            />
            <p className="text-xs text-muted-foreground">{historiasPorDia[0]} historias/día</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="costo-hora" className="text-sm font-medium">Costo por Hora (USD)</Label>
            <Input
              id="costo-hora"
              type="number"
              value={costoHora}
              onChange={(e) => setCostoHora(Number(e.target.value))}
              className="w-full"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="dias-trabajo" className="text-sm font-medium">Días de Trabajo/Mes</Label>
            <Input
              id="dias-trabajo"
              type="number"
              value={diasTrabajo}
              onChange={(e) => setDiasTrabajo(Number(e.target.value))}
              className="w-full"
            />
          </div>
        </div>
      </motion.div>

      {/* Resultados del ROI */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="col-span-2 space-y-4"
      >
        {/* ROI Destacado */}
        <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm">ROI Mensual</p>
              <p className="text-4xl font-bold">{roiMensual.toFixed(0)}%</p>
              <p className="text-green-100 text-sm">Retorno de inversión</p>
            </div>
            <TrendingUp className="w-12 h-12 text-green-200" />
          </div>
        </div>

        {/* Grid de Métricas */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
            <div className="flex items-center gap-2 mb-2">
              <Clock className="w-4 h-4 text-blue-600" />
              <h4 className="font-medium text-blue-800">Ahorro de Tiempo</h4>
            </div>
            <p className="text-2xl font-bold text-blue-600">{ahorroHorasDia.toFixed(1)}h</p>
            <p className="text-xs text-blue-500">por día</p>
          </div>

          <div className="bg-green-50 rounded-xl p-4 border border-green-200">
            <div className="flex items-center gap-2 mb-2">
              <DollarSign className="w-4 h-4 text-green-600" />
              <h4 className="font-medium text-green-800">Ahorro Mensual</h4>
            </div>
            <p className="text-2xl font-bold text-green-600">${ahorroMensual.toLocaleString()}</p>
            <p className="text-xs text-green-500">USD</p>
          </div>

          <div className="bg-purple-50 rounded-xl p-4 border border-purple-200">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-4 h-4 text-purple-600" />
              <h4 className="font-medium text-purple-800">Ahorro Anual</h4>
            </div>
            <p className="text-2xl font-bold text-purple-600">${ahorroAnual.toLocaleString()}</p>
            <p className="text-xs text-purple-500">USD</p>
          </div>

          <div className="bg-orange-50 rounded-xl p-4 border border-orange-200">
            <div className="flex items-center gap-2 mb-2">
              <Users className="w-4 h-4 text-orange-600" />
              <h4 className="font-medium text-orange-800">Costo Dentaxy</h4>
            </div>
            <p className="text-2xl font-bold text-orange-600">${costoMensualDentaxy}</p>
            <p className="text-xs text-orange-500">por mes</p>
          </div>
        </div>

        {/* Comparativa */}
        <div className="bg-white rounded-xl p-4 border border-gray-200">
          <h4 className="font-medium text-gray-800 mb-3">Comparativa de Tiempo por Historia</h4>
          <div className="flex gap-4">
            <div className="flex-1 bg-red-50 rounded-lg p-3 border border-red-200">
              <p className="text-xs text-red-600 font-medium">Método Tradicional</p>
              <p className="text-xl font-bold text-red-700">{tiempoTradicional} min</p>
            </div>
            <div className="flex-1 bg-green-50 rounded-lg p-3 border border-green-200">
              <p className="text-xs text-green-600 font-medium">Con Dentaxy</p>
              <p className="text-xl font-bold text-green-700">{tiempoDentaxy} min</p>
            </div>
            <div className="flex-1 bg-blue-50 rounded-lg p-3 border border-blue-200">
              <p className="text-xs text-blue-600 font-medium">Ahorro</p>
              <p className="text-xl font-bold text-blue-700">{ahorroTiempo} min</p>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="bg-gradient-to-r from-primary to-primary/80 rounded-xl p-4 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">¿Listo para estos ahorros?</p>
              <p className="text-sm text-primary-foreground/80">Comienza tu prueba gratuita hoy</p>
            </div>
            <Button variant="secondary" size="sm">
              Empezar Gratis
            </Button>
          </div>
        </div>
      </motion.div>
    </div>
  )
}