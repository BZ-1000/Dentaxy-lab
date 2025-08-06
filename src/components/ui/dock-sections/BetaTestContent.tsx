import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { TestTube, Users, CheckCircle, Clock, Mail, Phone, Star, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'

export const BetaTestContent: React.FC = () => {
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    telefono: '',
    clinica: '',
    experiencia: '',
    expectativas: ''
  })

  const [isSubmitted, setIsSubmitted] = useState(false)

  const betaFeatures = [
    { name: 'IA Conversacional', status: 'available', description: 'Interacción natural con la IA' },
    { name: 'Análisis por Voz', status: 'available', description: 'Dictado médico inteligente' },
    { name: 'Templates Personalizados', status: 'testing', description: 'Formularios adaptables' },
    { name: 'Integración DICOM', status: 'coming', description: 'Conexión con equipos de imagen' },
    { name: 'API para Clinicas', status: 'coming', description: 'Integración con sistemas existentes' }
  ]

  const testimonials = [
    {
      name: "Dr. María González",
      clinic: "Clínica Dental Sonrisa",
      comment: "Redujo mis tiempos de documentación en un 70%. Increíble tecnología.",
      rating: 5
    },
    {
      name: "Dr. Carlos Mendoza",
      clinic: "Centro Odontológico Integral",
      comment: "La IA realmente entiende terminología dental. Muy impresionado.",
      rating: 5
    }
  ]

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitted(true)
  }

  if (isSubmitted) {
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex items-center justify-center h-[500px]"
      >
        <div className="text-center bg-green-50 rounded-xl p-8 border border-green-200">
          <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
          <h3 className="text-2xl font-bold text-green-800 mb-2">¡Solicitud Enviada!</h3>
          <p className="text-green-600 mb-4">Te contactaremos en las próximas 24 horas para configurar tu acceso beta.</p>
          <Badge variant="secondary" className="bg-green-100 text-green-700">
            Posición en lista: #47
          </Badge>
        </div>
      </motion.div>
    )
  }

  return (
    <div className="grid grid-cols-3 gap-6">
      {/* Información del Programa Beta */}
      <motion.div 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="col-span-1 space-y-6"
      >
        {/* Estado del Programa */}
        <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <TestTube className="w-5 h-5 text-primary" />
            <h3 className="font-semibold text-gray-800">Programa Beta</h3>
          </div>
          
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Cupos Ocupados</span>
                <span>78/100</span>
              </div>
              <Progress value={78} className="h-2" />
            </div>
            
            <div className="grid grid-cols-2 gap-3 text-center">
              <div className="bg-blue-50 rounded-lg p-3">
                <p className="text-xl font-bold text-blue-600">78</p>
                <p className="text-xs text-blue-500">Beta Testers</p>
              </div>
              <div className="bg-green-50 rounded-lg p-3">
                <p className="text-xl font-bold text-green-600">22</p>
                <p className="text-xs text-green-500">Cupos Libres</p>
              </div>
            </div>
          </div>
        </div>

        {/* Características Beta */}
        <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
          <h3 className="font-semibold text-gray-800 mb-4">Funciones en Beta</h3>
          
          <div className="space-y-3">
            {betaFeatures.map((feature, index) => (
              <div key={index} className="flex items-center justify-between p-2 rounded-lg bg-gray-50">
                <div className="flex-1">
                  <p className="font-medium text-sm">{feature.name}</p>
                  <p className="text-xs text-muted-foreground">{feature.description}</p>
                </div>
                <Badge 
                  variant={feature.status === 'available' ? 'default' : 
                          feature.status === 'testing' ? 'secondary' : 'outline'}
                  className="text-xs"
                >
                  {feature.status === 'available' ? 'Disponible' :
                   feature.status === 'testing' ? 'Probando' : 'Próximamente'}
                </Badge>
              </div>
            ))}
          </div>
        </div>

        {/* Testimonios */}
        <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
          <h3 className="font-semibold text-gray-800 mb-4">Beta Testers</h3>
          
          <div className="space-y-4">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-gray-50 rounded-lg p-3">
                <div className="flex items-center gap-2 mb-1">
                  <div className="flex">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                </div>
                <p className="text-xs text-gray-600 mb-2">"{testimonial.comment}"</p>
                <div>
                  <p className="font-medium text-xs">{testimonial.name}</p>
                  <p className="text-xs text-muted-foreground">{testimonial.clinic}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Formulario de Solicitud */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="col-span-2 bg-white rounded-xl p-6 border border-gray-200 shadow-sm"
      >
        <div className="flex items-center gap-2 mb-6">
          <Users className="w-5 h-5 text-primary" />
          <h3 className="font-semibold text-gray-800">Solicitar Acceso Beta</h3>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="nombre">Nombre Completo *</Label>
              <Input
                id="nombre"
                value={formData.nombre}
                onChange={(e) => setFormData({...formData, nombre: e.target.value})}
                placeholder="Dr. Juan Pérez"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email">Email Profesional *</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                placeholder="doctor@clinica.com"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="telefono">Teléfono</Label>
              <Input
                id="telefono"
                value={formData.telefono}
                onChange={(e) => setFormData({...formData, telefono: e.target.value})}
                placeholder="+1 234 567 8900"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="clinica">Nombre de la Clínica *</Label>
              <Input
                id="clinica"
                value={formData.clinica}
                onChange={(e) => setFormData({...formData, clinica: e.target.value})}
                placeholder="Clínica Dental Ejemplo"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="experiencia">Años de Experiencia *</Label>
            <Input
              id="experiencia"
              value={formData.experiencia}
              onChange={(e) => setFormData({...formData, experiencia: e.target.value})}
              placeholder="5 años"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="expectativas">¿Qué esperas del programa beta?</Label>
            <Textarea
              id="expectativas"
              value={formData.expectativas}
              onChange={(e) => setFormData({...formData, expectativas: e.target.value})}
              placeholder="Describenos qué te interesa probar y cómo planeas usar Dentaxy..."
              className="min-h-[80px]"
            />
          </div>

          {/* Beneficios del Beta */}
          <div className="bg-primary/5 rounded-lg p-4 border border-primary/20">
            <h4 className="font-medium text-primary mb-2">Beneficios del Programa Beta:</h4>
            <ul className="text-sm text-primary/80 space-y-1">
              <li>✓ Acceso gratuito por 3 meses</li>
              <li>✓ Soporte prioritario 24/7</li>
              <li>✓ Influencia directa en el desarrollo</li>
              <li>✓ Descuento del 50% al lanzamiento oficial</li>
              <li>✓ Capacitación personalizada</li>
            </ul>
          </div>

          <div className="flex gap-3">
            <Button type="submit" className="flex-1">
              <ArrowRight className="w-4 h-4 mr-2" />
              Solicitar Acceso Beta
            </Button>
            <Button variant="outline" type="button">
              <Mail className="w-4 h-4 mr-2" />
              Contactar
            </Button>
          </div>
        </form>

        <div className="mt-6 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-yellow-600" />
            <p className="text-sm text-yellow-800">
              <strong>Tiempo de respuesta:</strong> Te contactaremos en 24-48 horas para confirmar tu acceso.
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  )
}