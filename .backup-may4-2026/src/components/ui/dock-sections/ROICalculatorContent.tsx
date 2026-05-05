import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Calculator, Clock, TrendingUp, Users, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Slider } from '@/components/ui/slider'
import { useNavigate } from 'react-router-dom'

export const ROICalculatorContent: React.FC = () => {
  const navigate = useNavigate()
  const [dentistas, setDentistas] = useState([5])
  const [historiasPorDia, setHistoriasPorDia] = useState([10])
  const [diasTrabajo, setDiasTrabajo] = useState(22)

  // Cálculos de tiempo únicamente
  const tiempoTradicional = 45 // minutos
  const tiempoDentaxy = 8 // minutos
  const ahorroTiempo = tiempoTradicional - tiempoDentaxy // 37 minutos por historia
  
  const ahorroMinutosDia = dentistas[0] * historiasPorDia[0] * ahorroTiempo
  const ahorroHorasDia = ahorroMinutosDia / 60
  const ahorroHorasMes = ahorroHorasDia * diasTrabajo
  const ahorroHorasAnio = ahorroHorasMes * 12

  return (
    <div className="grid grid-cols-3 gap-6">
      {/* Panel de Configuración */}
      <motion.div 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="col-span-1 bg-card rounded-xl p-6 border border-border shadow-sm"
      >
        <div className="flex items-center gap-2 mb-6">
          <Calculator className="w-5 h-5 text-primary" />
          <h3 className="font-semibold text-foreground">Configuración</h3>
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

      {/* Resultados de Ahorro de Tiempo */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="col-span-2 space-y-4"
      >
        {/* Ahorro Destacado */}
        <div className="bg-gradient-to-r from-emerald-500 to-teal-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-emerald-100 text-sm">Ahorro de Tiempo Anual</p>
              <p className="text-4xl font-bold">{ahorroHorasAnio.toFixed(0)} horas</p>
              <p className="text-emerald-100 text-sm">optimizadas con Dentaxy</p>
            </div>
            <TrendingUp className="w-12 h-12 text-emerald-200" />
          </div>
        </div>

        {/* Grid de Métricas */}
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-blue-500/10 rounded-xl p-4 border border-blue-500/20">
            <div className="flex items-center gap-2 mb-2">
              <Clock className="w-4 h-4 text-blue-600" />
              <h4 className="font-medium text-blue-700 dark:text-blue-300">Ahorro/Día</h4>
            </div>
            <p className="text-2xl font-bold text-blue-600">{ahorroHorasDia.toFixed(1)}h</p>
          </div>

          <div className="bg-emerald-500/10 rounded-xl p-4 border border-emerald-500/20">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-4 h-4 text-emerald-600" />
              <h4 className="font-medium text-emerald-700 dark:text-emerald-300">Ahorro/Mes</h4>
            </div>
            <p className="text-2xl font-bold text-emerald-600">{ahorroHorasMes.toFixed(0)}h</p>
          </div>

          <div className="bg-purple-500/10 rounded-xl p-4 border border-purple-500/20">
            <div className="flex items-center gap-2 mb-2">
              <Users className="w-4 h-4 text-purple-600" />
              <h4 className="font-medium text-purple-700 dark:text-purple-300">Equipo</h4>
            </div>
            <p className="text-2xl font-bold text-purple-600">{dentistas[0]} dentistas</p>
          </div>
        </div>

        {/* Comparativa */}
        <div className="bg-card rounded-xl p-4 border border-border">
          <h4 className="font-medium text-foreground mb-3">Comparativa de Tiempo por Historia</h4>
          <div className="flex gap-4">
            <div className="flex-1 bg-red-500/10 rounded-lg p-3 border border-red-500/20">
              <p className="text-xs text-red-600 font-medium">Método Tradicional</p>
              <p className="text-xl font-bold text-red-600">{tiempoTradicional} min</p>
            </div>
            <div className="flex-1 bg-emerald-500/10 rounded-lg p-3 border border-emerald-500/20">
              <p className="text-xs text-emerald-600 font-medium">Con Dentaxy</p>
              <p className="text-xl font-bold text-emerald-600">{tiempoDentaxy} min</p>
            </div>
            <div className="flex-1 bg-blue-500/10 rounded-lg p-3 border border-blue-500/20">
              <p className="text-xs text-blue-600 font-medium">Ahorro</p>
              <p className="text-xl font-bold text-blue-600">{ahorroTiempo} min</p>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="bg-gradient-to-r from-primary to-primary/80 rounded-xl p-4 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">¿Listo para optimizar tu tiempo?</p>
              <p className="text-sm text-primary-foreground/80">Explora nuestras soluciones</p>
            </div>
            <Button 
              variant="secondary" 
              size="sm"
              onClick={() => navigate('/hub')}
            >
              Explorar Demo
            </Button>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
