import { useState } from 'react';
import { TestTube, Users, Star, Send, Mail } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { motion } from 'framer-motion';

export const BetaTestContent = () => {
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    telefono: '',
    clinica: '',
    experiencia: '',
    expectativas: ''
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
  };

  if (isSubmitted) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="p-6 text-center"
      >
        <div className="max-w-md mx-auto">
          <TestTube className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-4">¡Aplicación Enviada!</h2>
          <p className="text-muted-foreground mb-6">
            Gracias por tu interés en el programa beta de Dentaxy. 
            Revisaremos tu aplicación y nos pondremos en contacto contigo pronto.
          </p>
          <Button onClick={() => setIsSubmitted(false)} variant="outline">
            Enviar otra aplicación
          </Button>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="p-6 space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center"
      >
        <TestTube className="w-12 h-12 text-primary mx-auto mb-4" />
        <h2 className="text-2xl font-bold mb-2">Programa Beta</h2>
        <p className="text-muted-foreground">
          Únete a nuestro programa beta exclusivo y prueba las últimas funciones antes que nadie
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Program Info */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="space-y-6"
        >
          <Card className="p-6">
            <CardContent className="p-0">
              <h3 className="text-lg font-semibold mb-4">Detalles del Programa</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm">Estado:</span>
                  <span className="text-sm font-semibold text-green-600">Abierto</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Cupos ocupados:</span>
                  <span className="text-sm font-semibold">23/50</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Duración:</span>
                  <span className="text-sm font-semibold">3 meses</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Costo:</span>
                  <span className="text-sm font-semibold text-green-600">Gratuito</span>
                </div>
              </div>
              
              <div className="mt-4">
                <div className="flex justify-between text-xs mb-1">
                  <span>Progreso</span>
                  <span>46%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-primary h-2 rounded-full" style={{ width: '46%' }}></div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Beta Features */}
          <Card className="p-6">
            <CardContent className="p-0">
              <h3 className="text-lg font-semibold mb-4">Funciones Beta</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm">IA Avanzada v2.0</span>
                  <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">Disponible</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                  <span className="text-sm">Análisis de Imágenes</span>
                  <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">Probando</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                  <span className="text-sm">Integración DICOM</span>
                  <span className="text-xs bg-gray-100 text-gray-800 px-2 py-1 rounded">Próximamente</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Testimonials */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="space-y-6"
        >
          <Card className="p-6">
            <CardContent className="p-0">
              <h3 className="text-lg font-semibold mb-4">Testimonios Beta</h3>
              <div className="space-y-4">
                <div className="border-l-4 border-primary pl-4">
                  <div className="flex items-center gap-1 mb-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <p className="text-sm italic">
                    "La nueva IA es increíble. Ha mejorado mi flujo de trabajo en un 80%."
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    - Dr. María González, Beta Tester
                  </p>
                </div>

                <div className="border-l-4 border-primary pl-4">
                  <div className="flex items-center gap-1 mb-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <p className="text-sm italic">
                    "Las funciones beta son exactamente lo que necesitaba en mi clínica."
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    - Dr. Carlos Ruiz, Beta Tester
                  </p>
                </div>

                <div className="border-l-4 border-primary pl-4">
                  <div className="flex items-center gap-1 mb-1">
                    {[...Array(4)].map((_, i) => (
                      <Star key={i} className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                    ))}
                    <Star className="w-3 h-3 text-gray-300" />
                  </div>
                  <p className="text-sm italic">
                    "Muy prometedor, aunque aún hay detalles por pulir."
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    - Dra. Ana Martín, Beta Tester
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Application Form */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <Card className="p-6">
            <CardContent className="p-0">
              <h3 className="text-lg font-semibold mb-4">Aplicar al Beta</h3>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="text-sm font-medium block mb-1">Nombre completo *</label>
                  <Input
                    value={formData.nombre}
                    onChange={(e) => handleInputChange('nombre', e.target.value)}
                    placeholder="Dr. Juan Pérez"
                    required
                  />
                </div>

                <div>
                  <label className="text-sm font-medium block mb-1">Email *</label>
                  <Input
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    placeholder="juan@clinica.com"
                    required
                  />
                </div>

                <div>
                  <label className="text-sm font-medium block mb-1">Teléfono</label>
                  <Input
                    value={formData.telefono}
                    onChange={(e) => handleInputChange('telefono', e.target.value)}
                    placeholder="+34 600 000 000"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium block mb-1">Clínica</label>
                  <Input
                    value={formData.clinica}
                    onChange={(e) => handleInputChange('clinica', e.target.value)}
                    placeholder="Clínica Dental ABC"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium block mb-1">Años de experiencia</label>
                  <Input
                    value={formData.experiencia}
                    onChange={(e) => handleInputChange('experiencia', e.target.value)}
                    placeholder="10 años"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium block mb-1">¿Qué esperas del beta?</label>
                  <textarea
                    value={formData.expectativas}
                    onChange={(e) => handleInputChange('expectativas', e.target.value)}
                    placeholder="Describe qué funciones te interesan más..."
                    className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none"
                    rows={3}
                  />
                </div>

                <div className="space-y-3">
                  <Button type="submit" className="w-full">
                    <Send className="w-4 h-4 mr-2" />
                    Enviar Aplicación
                  </Button>

                  <Button type="button" variant="outline" className="w-full">
                    <Mail className="w-4 h-4 mr-2" />
                    Contactar Equipo
                  </Button>
                </div>
              </form>

              <div className="mt-4 p-3 bg-muted rounded-lg">
                <h4 className="font-semibold text-sm mb-2">Beneficios del Beta:</h4>
                <ul className="text-xs space-y-1">
                  <li>• Acceso gratuito por 3 meses</li>
                  <li>• Funciones exclusivas antes del lanzamiento</li>
                  <li>• Soporte directo del equipo de desarrollo</li>
                  <li>• Descuento especial en la versión final</li>
                </ul>
              </div>

              <p className="text-xs text-muted-foreground mt-4 text-center">
                Te responderemos en un plazo de 24-48 horas
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};