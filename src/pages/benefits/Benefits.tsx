
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../../components/ui/button';
import { Clock, Shield, Zap, Award, FileText, Users } from 'lucide-react';

const Benefits = () => {
  const benefits = [
    {
      title: "Ahorro de Tiempo",
      description: "Reduce hasta un 70% el tiempo dedicado a documentación clínica con nuestro sistema de IA.",
      icon: <Clock className="h-12 w-12 text-blue-600 mb-4" />
    },
    {
      title: "Seguridad Garantizada",
      description: "Tus datos están protegidos con encriptación de nivel hospitalario y cumplimiento HIPAA.",
      icon: <Shield className="h-12 w-12 text-blue-600 mb-4" />
    },
    {
      title: "Mayor Eficiencia",
      description: "Automatiza procesos repetitivos y enfócate en lo que realmente importa: tus pacientes.",
      icon: <Zap className="h-12 w-12 text-blue-600 mb-4" />
    },
    {
      title: "Calidad Profesional",
      description: "Genera documentación clínica de alta calidad que cumple con todos los estándares regulatorios.",
      icon: <Award className="h-12 w-12 text-blue-600 mb-4" />
    },
    {
      title: "Integración Completa",
      description: "Compatible con los principales sistemas de gestión dental y fácil exportación de datos.",
      icon: <FileText className="h-12 w-12 text-blue-600 mb-4" />
    },
    {
      title: "Experiencia Mejorada",
      description: "Ofrece a tus pacientes una experiencia más fluida y profesional en cada visita.",
      icon: <Users className="h-12 w-12 text-blue-600 mb-4" />
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      <main className="container mx-auto px-4 py-16 max-w-6xl">
        <h1 className="text-4xl md:text-5xl font-bold text-center mb-8 text-gray-900">Beneficios</h1>
        
        <p className="text-xl text-center text-gray-700 mb-16 max-w-3xl mx-auto">
          Descubre cómo Dentaxy transforma la práctica dental con beneficios 
          diseñados para profesionales que buscan eficiencia, precisión y calidad.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {benefits.map((benefit, index) => (
            <div key={index} className="bg-white shadow-lg rounded-xl p-8 border border-gray-100 hover:shadow-xl transition-shadow">
              <div className="text-center">
                {benefit.icon}
                <h3 className="text-xl font-bold mb-3 text-gray-900">{benefit.title}</h3>
                <p className="text-gray-700">{benefit.description}</p>
              </div>
            </div>
          ))}
        </div>
        
        <div className="bg-blue-50 rounded-xl p-8 md:p-12 mb-16">
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-6 text-blue-800">Lo que dicen nuestros usuarios</h2>
            <blockquote className="text-xl italic text-gray-700 mb-6">
              "Dentaxy ha revolucionado mi consulta. Lo que antes me tomaba horas ahora lo hago en minutos, 
              y la calidad de la documentación es excepcional."
            </blockquote>
            <p className="font-medium text-gray-900">Dra. María González, Odontóloga</p>
          </div>
        </div>
        
        <div className="text-center">
          <Link to="/plans">
            <Button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-6 rounded-lg text-lg">
              Ver Planes y Precios
            </Button>
          </Link>
        </div>
      </main>
    </div>
  );
};

export default Benefits;
