import React from 'react'
import { motion } from 'framer-motion'
import { Clock, Brain, Shield, TrendingUp, Users, Zap, Award, Globe, HeartHandshake, Lightbulb } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'

const primaryBenefits = [
  {
    icon: Clock,
    title: "Ahorro de Tiempo Masivo",
    description: "Reduce el tiempo de documentación de 45 minutos a solo 8 minutos por historia clínica",
    stat: "82% menos tiempo",
    color: "blue"
  },
  {
    icon: Brain,
    title: "IA Especializada en Odontología",
    description: "Algoritmos entrenados específicamente con terminología y protocolos dentales",
    stat: "97.8% precisión",
    color: "purple"
  },
  {
    icon: Shield,
    title: "Cumplimiento Normativo",
    description: "Totalmente compatible con HIPAA, GDPR y regulaciones locales de salud",
    stat: "100% seguro",
    color: "green"
  },
  {
    icon: TrendingUp,
    title: "ROI Comprobado",
    description: "Retorno de inversión promedio del 340% en los primeros 6 meses",
    stat: "340% ROI",
    color: "orange"
  }
]

const secondaryBenefits = [
  {
    icon: Users,
    title: "Mejor Experiencia del Paciente",
    description: "Más tiempo para atención directa, menos tiempo en papelleo"
  },
  {
    icon: Zap,
    title: "Implementación Instantánea",
    description: "Sin instalaciones complejas, funciona desde el primer día"
  },
  {
    icon: Award,
    title: "Calidad Profesional",
    description: "Historias clínicas más completas y profesionales automáticamente"
  },
  {
    icon: Globe,
    title: "Acceso desde Cualquier Lugar",
    description: "Plataforma web accesible desde cualquier dispositivo"
  },
  {
    icon: HeartHandshake,
    title: "Soporte Especializado",
    description: "Equipo de soporte con conocimiento médico-dental"
  },
  {
    icon: Lightbulb,
    title: "Actualizaciones Continuas",
    description: "Mejoras constantes basadas en feedback de profesionales"
  }
]

const impactMetrics = [
  { label: "Tiempo ahorrado por consulta", value: "37 min", progress: 82 },
  { label: "Reducción de errores", value: "94%", progress: 94 },
  { label: "Mejora en satisfacción", value: "89%", progress: 89 },
  { label: "Aumento en productividad", value: "156%", progress: 75 }
]

const getColorClasses = (color: string) => {
  const colorMap = {
    blue: "from-blue-50 to-blue-100 border-blue-200 text-blue-800",
    purple: "from-purple-50 to-purple-100 border-purple-200 text-purple-800",
    green: "from-green-50 to-green-100 border-green-200 text-green-800",
    orange: "from-orange-50 to-orange-100 border-orange-200 text-orange-800"
  }
  return colorMap[color as keyof typeof colorMap] || colorMap.blue
}

const getIconColor = (color: string) => {
  const colorMap = {
    blue: "text-blue-600",
    purple: "text-purple-600", 
    green: "text-green-600",
    orange: "text-orange-600"
  }
  return colorMap[color as keyof typeof colorMap] || colorMap.blue
}

export const BenefitsContent: React.FC = () => {
  return (
    <div className="space-y-8">
      {/* Beneficios Principales */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid grid-cols-2 gap-6"
      >
        {primaryBenefits.map((benefit, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`bg-gradient-to-br ${getColorClasses(benefit.color)} rounded-xl p-6 border`}
          >
            <div className="flex items-start gap-4">
              <div className="p-3 bg-white/60 rounded-lg">
                <benefit.icon className={`w-6 h-6 ${getIconColor(benefit.color)}`} />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold mb-2">{benefit.title}</h3>
                <p className="text-sm opacity-80 mb-3">{benefit.description}</p>
                <Badge variant="secondary" className="bg-white/80">
                  {benefit.stat}
                </Badge>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Métricas de Impacto */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm"
      >
        <h3 className="font-semibold text-gray-800 mb-6">Impacto Medible en tu Práctica</h3>
        <div className="grid grid-cols-2 gap-6">
          {impactMetrics.map((metric, index) => (
            <div key={index} className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-700">{metric.label}</span>
                <span className="text-lg font-bold text-primary">{metric.value}</span>
              </div>
              <Progress value={metric.progress} className="h-2" />
            </div>
          ))}
        </div>
      </motion.div>

      {/* Beneficios Secundarios */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="grid grid-cols-3 gap-4"
      >
        {secondaryBenefits.map((benefit, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 + index * 0.05 }}
            className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex items-center gap-3 mb-3">
              <benefit.icon className="w-5 h-5 text-primary" />
              <h4 className="font-medium text-gray-800 text-sm">{benefit.title}</h4>
            </div>
            <p className="text-xs text-muted-foreground">{benefit.description}</p>
          </motion.div>
        ))}
      </motion.div>

      {/* Comparativa Antes vs Después */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="bg-gradient-to-r from-red-50 via-yellow-50 to-green-50 rounded-xl p-6 border"
      >
        <h3 className="font-semibold text-gray-800 mb-6 text-center">Transformación de tu Práctica</h3>
        
        <div className="grid grid-cols-3 gap-6">
          {/* Antes */}
          <div className="text-center">
            <div className="bg-red-100 rounded-lg p-4 mb-3">
              <h4 className="font-medium text-red-800 mb-2">Antes de Dentaxy</h4>
              <ul className="text-xs text-red-700 space-y-1">
                <li>• 45 min por historia</li>
                <li>• Documentación manual</li>
                <li>• Errores frecuentes</li>
                <li>• Menos tiempo con pacientes</li>
                <li>• Estrés administrativo</li>
              </ul>
            </div>
          </div>

          {/* Transición */}
          <div className="text-center">
            <div className="bg-yellow-100 rounded-lg p-4 mb-3">
              <h4 className="font-medium text-yellow-800 mb-2">Durante la Transición</h4>
              <ul className="text-xs text-yellow-700 space-y-1">
                <li>• Capacitación rápida</li>
                <li>• Soporte dedicado</li>
                <li>• Migración asistida</li>
                <li>• Primeros resultados</li>
                <li>• Adaptación gradual</li>
              </ul>
            </div>
          </div>

          {/* Después */}
          <div className="text-center">
            <div className="bg-green-100 rounded-lg p-4 mb-3">
              <h4 className="font-medium text-green-800 mb-2">Con Dentaxy</h4>
              <ul className="text-xs text-green-700 space-y-1">
                <li>• 8 min por historia</li>
                <li>• IA automatizada</li>
                <li>• Precisión del 97.8%</li>
                <li>• Más tiempo para pacientes</li>
                <li>• Enfoque en tratamiento</li>
              </ul>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Call to Action Final */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1 }}
        className="bg-gradient-to-r from-primary to-primary/80 rounded-xl p-6 text-white text-center"
      >
        <h3 className="text-xl font-bold mb-2">¿Listo para Transformar tu Práctica?</h3>
        <p className="text-primary-foreground/80 mb-4">
          Únete a más de 2,847 profesionales que ya están ahorrando tiempo y mejorando su práctica
        </p>
        <div className="flex justify-center gap-4">
          <Badge variant="secondary" className="bg-white/20 text-white">
            Sin compromiso inicial
          </Badge>
          <Badge variant="secondary" className="bg-white/20 text-white">
            Configuración en 24h
          </Badge>
          <Badge variant="secondary" className="bg-white/20 text-white">
            Soporte incluido
          </Badge>
        </div>
      </motion.div>
    </div>
  )
}