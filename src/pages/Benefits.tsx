
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Clock, FileCheck, Brain, Shield, LineChart, Users } from 'lucide-react';

const Benefits = () => {
  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <Link to="/">
            <Button variant="outline" className="mb-8">
              ← Volver al inicio
            </Button>
          </Link>
          
          <h1 className="text-3xl font-bold mb-8">Beneficios</h1>
          
          <div className="prose max-w-none">
            <p className="text-gray-700 mb-8">
              Dentaxy transforma la manera en que los profesionales dentales manejan su documentación clínica, ofreciendo ventajas significativas para tu práctica:
            </p>
            
            <div className="grid gap-6 md:grid-cols-2">
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                <div className="flex items-center mb-4 text-blue-600">
                  <Clock className="h-6 w-6 mr-3" />
                  <h3 className="text-lg font-semibold">Ahorro de tiempo</h3>
                </div>
                <p className="text-gray-700">
                  Reduce hasta un 70% el tiempo dedicado a la documentación clínica. Lo que solía tomar horas, ahora puede completarse en minutos.
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                <div className="flex items-center mb-4 text-blue-600">
                  <FileCheck className="h-6 w-6 mr-3" />
                  <h3 className="text-lg font-semibold">Documentación completa</h3>
                </div>
                <p className="text-gray-700">
                  Genera documentos clínicos exhaustivos que cumplen con todos los requisitos legales y profesionales, minimizando el riesgo de omisiones.
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                <div className="flex items-center mb-4 text-blue-600">
                  <Brain className="h-6 w-6 mr-3" />
                  <h3 className="text-lg font-semibold">IA especializada</h3>
                </div>
                <p className="text-gray-700">
                  Nuestra inteligencia artificial está entrenada específicamente en terminología y procedimientos dentales, asegurando precisión técnica.
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                <div className="flex items-center mb-4 text-blue-600">
                  <Shield className="h-6 w-6 mr-3" />
                  <h3 className="text-lg font-semibold">Seguridad garantizada</h3>
                </div>
                <p className="text-gray-700">
                  Protección de datos de nivel médico con encriptación avanzada y cumplimiento de normativas de privacidad sanitaria.
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                <div className="flex items-center mb-4 text-blue-600">
                  <LineChart className="h-6 w-6 mr-3" />
                  <h3 className="text-lg font-semibold">Eficiencia operativa</h3>
                </div>
                <p className="text-gray-700">
                  Optimiza los flujos de trabajo de tu clínica, permitiéndote atender a más pacientes o dedicar más tiempo a cada uno de ellos.
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                <div className="flex items-center mb-4 text-blue-600">
                  <Users className="h-6 w-6 mr-3" />
                  <h3 className="text-lg font-semibold">Experiencia mejorada</h3>
                </div>
                <p className="text-gray-700">
                  Impresiona a tus pacientes con documentación profesional y detallada, mejorando la percepción de calidad de tu práctica.
                </p>
              </div>
            </div>
            
            <div className="mt-12 bg-blue-50 p-6 rounded-lg">
              <h2 className="text-xl font-semibold mb-4">Testimonios de profesionales</h2>
              <div className="space-y-6">
                <blockquote className="italic text-gray-700 border-l-4 border-blue-200 pl-4">
                  "Dentaxy ha revolucionado mi consulta. La documentación que antes me tomaba horas ahora la completo en minutos, permitiéndome enfocarme más en mis pacientes."
                  <footer className="text-gray-600 mt-2 not-italic">— Dra. Laura Méndez, Odontóloga</footer>
                </blockquote>
                
                <blockquote className="italic text-gray-700 border-l-4 border-blue-200 pl-4">
                  "Como director de una clínica con varios especialistas, Dentaxy ha estandarizado nuestra documentación y mejorado nuestra eficiencia operativa significativamente."
                  <footer className="text-gray-600 mt-2 not-italic">— Dr. Carlos Ruiz, Director Clínico</footer>
                </blockquote>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Benefits;
