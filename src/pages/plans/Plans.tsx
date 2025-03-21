
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../../components/ui/button';
import { Check } from 'lucide-react';

const Plans = () => {
  const plans = [
    {
      name: "Plan Básico",
      price: "19.99",
      features: [
        "10 historias clínicas mensuales",
        "Acceso a formularios estándar",
        "Generación de narrativas clínicas",
        "Soporte por email"
      ],
      isPopular: false,
      color: "bg-gray-50 border-gray-200"
    },
    {
      name: "Plan Profesional",
      price: "39.99",
      features: [
        "50 historias clínicas mensuales",
        "Acceso a todos los formularios",
        "Generación avanzada de narrativas",
        "Exportación en múltiples formatos",
        "Soporte prioritario"
      ],
      isPopular: true,
      color: "bg-blue-50 border-blue-200"
    },
    {
      name: "Plan Clínica",
      price: "99.99",
      features: [
        "Historias clínicas ilimitadas",
        "Múltiples usuarios (hasta 5)",
        "Acceso a formularios personalizados",
        "Integración con sistemas externos",
        "Soporte 24/7",
        "Capacitación personalizada"
      ],
      isPopular: false,
      color: "bg-gray-50 border-gray-200"
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      <main className="container mx-auto px-4 py-16 max-w-6xl">
        <h1 className="text-4xl md:text-5xl font-bold text-center mb-8 text-gray-900">Planes y Precios</h1>
        
        <p className="text-xl text-center text-gray-700 mb-16 max-w-3xl mx-auto">
          Ofrecemos planes flexibles que se adaptan a las necesidades de cada profesional 
          y clínica dental, desde prácticas individuales hasta grandes centros.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {plans.map((plan, index) => (
            <div 
              key={index} 
              className={`rounded-xl p-8 shadow-lg border-2 ${plan.color} relative ${plan.isPopular ? 'transform md:-translate-y-4' : ''}`}
            >
              {plan.isPopular && (
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                  <span className="bg-blue-600 text-white px-4 py-1 rounded-full text-sm font-medium">Más Popular</span>
                </div>
              )}
              
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold mb-2 text-gray-900">{plan.name}</h3>
                <div className="flex items-center justify-center">
                  <span className="text-4xl font-bold text-gray-900">${plan.price}</span>
                  <span className="text-gray-600 ml-2">/mes</span>
                </div>
              </div>
              
              <ul className="space-y-3 mb-8">
                {plan.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start">
                    <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>
              
              <Button 
                className={`w-full py-6 ${plan.isPopular ? 'bg-blue-600 hover:bg-blue-700 text-white' : 'bg-white border-2 border-gray-300 text-gray-800 hover:bg-gray-50'}`}
              >
                Comenzar Ahora
              </Button>
            </div>
          ))}
        </div>
        
        <div className="bg-gray-50 rounded-xl p-8 md:p-12">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4 text-gray-900">¿Necesitas un plan personalizado?</h2>
            <p className="text-gray-700 mb-8">
              Contáctanos para diseñar una solución que se adapte exactamente a las necesidades de tu práctica.
            </p>
            <Link to="/contact">
              <Button className="bg-gray-800 hover:bg-gray-900 text-white">
                Solicitar Información
              </Button>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Plans;
