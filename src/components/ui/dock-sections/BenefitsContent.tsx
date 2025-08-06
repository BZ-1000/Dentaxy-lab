import { Clock, Brain, TrendingUp, Zap, Shield, Award, Users, Lightbulb } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

const primaryBenefits = [
  {
    icon: Clock,
    title: 'Ahorro de Tiempo',
    description: 'Reduce el tiempo de redacción de historias clínicas de 120 minutos a solo 36 minutos.',
    stat: '70% menos tiempo',
    color: 'blue'
  },
  {
    icon: Brain,
    title: 'IA Especializada',
    description: 'Inteligencia artificial entrenada específicamente para terminología odontológica.',
    stat: '97% precisión',
    color: 'purple'
  },
  {
    icon: TrendingUp,
    title: 'Mayor Productividad',
    description: 'Atiende más pacientes al día optimizando los procesos administrativos.',
    stat: '+40% pacientes',
    color: 'green'
  }
];

const secondaryBenefits = [
  { icon: Zap, title: 'Velocidad', description: 'Respuestas instantáneas' },
  { icon: Shield, title: 'Seguridad', description: 'Datos protegidos y encriptados' },
  { icon: Award, title: 'Calidad', description: 'Estándares médicos profesionales' },
  { icon: Users, title: 'Colaboración', description: 'Trabajo en equipo optimizado' },
  { icon: Lightbulb, title: 'Innovación', description: 'Tecnología de vanguardia' }
];

const impactMetrics = [
  { label: 'Tiempo ahorrado por historia', value: '84 min', progress: 70 },
  { label: 'Precisión diagnóstica', value: '97%', progress: 97 },
  { label: 'Satisfacción del paciente', value: '95%', progress: 95 },
  { label: 'ROI mensual promedio', value: '340%', progress: 85 }
];

const getColorClasses = (color: string) => {
  const colors = {
    blue: 'from-blue-500/20 to-blue-600/20 border-blue-500/30',
    purple: 'from-purple-500/20 to-purple-600/20 border-purple-500/30',
    green: 'from-green-500/20 to-green-600/20 border-green-500/30'
  };
  return colors[color as keyof typeof colors] || colors.blue;
};

const getIconColor = (color: string) => {
  const colors = {
    blue: 'text-blue-600',
    purple: 'text-purple-600',
    green: 'text-green-600'
  };
  return colors[color as keyof typeof colors] || colors.blue;
};

export const BenefitsContent = () => {
  return (
    <div className="p-6 space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center"
      >
        <Award className="w-12 h-12 text-primary mx-auto mb-4" />
        <h2 className="text-2xl font-bold mb-2">Beneficios de Dentaxy</h2>
        <p className="text-muted-foreground">
          Descubre cómo Dentaxy puede transformar tu práctica odontológica
        </p>
      </motion.div>

      {/* Primary Benefits */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
      >
        {primaryBenefits.map((benefit, index) => (
          <Card key={index} className={`p-6 bg-gradient-to-br ${getColorClasses(benefit.color)}`}>
            <CardContent className="p-0">
              <benefit.icon className={`w-8 h-8 ${getIconColor(benefit.color)} mb-4`} />
              <h3 className="text-lg font-semibold mb-2">{benefit.title}</h3>
              <p className="text-sm text-muted-foreground mb-4">{benefit.description}</p>
              <div className="text-2xl font-bold text-primary">{benefit.stat}</div>
            </CardContent>
          </Card>
        ))}
      </motion.div>

      {/* Impact Metrics */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
      >
        <Card className="p-6">
          <CardContent className="p-0">
            <h3 className="text-lg font-semibold mb-6">Impacto Medible</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {impactMetrics.map((metric, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">{metric.label}</span>
                    <span className="text-sm font-bold text-primary">{metric.value}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <motion.div
                      className="bg-primary h-2 rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${metric.progress}%` }}
                      transition={{ duration: 1, delay: index * 0.2 }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Secondary Benefits */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.6 }}
      >
        <Card className="p-6">
          <CardContent className="p-0">
            <h3 className="text-lg font-semibold mb-6">Ventajas Adicionales</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {secondaryBenefits.map((benefit, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className="flex items-center gap-3 p-3 rounded-lg border border-border hover:bg-muted/50 transition-colors"
                >
                  <benefit.icon className="w-5 h-5 text-primary" />
                  <div>
                    <div className="font-medium text-sm">{benefit.title}</div>
                    <div className="text-xs text-muted-foreground">{benefit.description}</div>
                  </div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Before vs After */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.8 }}
      >
        <Card className="p-6">
          <CardContent className="p-0">
            <h3 className="text-lg font-semibold mb-6">Antes vs. Después</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h4 className="font-medium text-red-600">Sin Dentaxy</h4>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                    <span className="text-sm">120 minutos por historia clínica</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                    <span className="text-sm">Errores de transcripción</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                    <span className="text-sm">Menos tiempo con pacientes</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                    <span className="text-sm">Documentación inconsistente</span>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-medium text-green-600">Con Dentaxy</h4>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-sm">36 minutos por historia clínica</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-sm">Precisión del 97%</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-sm">Más tiempo para el cuidado</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-sm">Documentación estandarizada</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Call to Action */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 1 }}
        className="text-center"
      >
        <Card className="p-8 bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
          <CardContent className="p-0">
            <h3 className="text-xl font-bold mb-4">¿Listo para transformar tu práctica?</h3>
            <p className="text-muted-foreground mb-6">
              Únete a más de 1,200 odontólogos que ya están usando Dentaxy
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="px-8">
                Comenzar prueba gratuita
              </Button>
              <Button size="lg" variant="outline" className="px-8">
                Ver demo en vivo
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};