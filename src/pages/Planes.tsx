
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Check, Crown } from 'lucide-react';
import BottomMenu from '@/components/BottomMenu';

const PlanCard = ({ 
  title, 
  price, 
  features, 
  isPopular = false,
  buttonText = "Seleccionar plan",
  comingSoon = false,
  onClick
}: { 
  title: string, 
  price: string, 
  features: string[], 
  isPopular?: boolean,
  buttonText?: string,
  comingSoon?: boolean,
  onClick?: () => void 
}) => (
  <div className={`bg-white p-6 rounded-lg shadow-sm border ${isPopular ? 'border-blue-400 ring-2 ring-blue-200' : 'border-gray-200'} relative ${comingSoon ? 'opacity-70' : ''}`}>
    {isPopular && (
      <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-blue-500 text-white px-4 py-1 rounded-full text-sm font-medium">
        Popular
      </div>
    )}
    {comingSoon && (
      <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-gray-500 text-white px-4 py-1 rounded-full text-sm font-medium">
        Próximamente
      </div>
    )}
    <h3 className="text-xl font-bold mb-2 text-gray-800 mt-2">{title}</h3>
    <div className="mb-4">
      <span className="text-3xl font-bold">{price}</span>
      {!comingSoon && price !== "Gratis" && <span className="text-gray-600">/mes</span>}
    </div>
    <ul className="space-y-3 mb-8">
      {features.map((feature, idx) => (
        <li key={idx} className="flex items-start">
          <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
          <span className="text-gray-600">{feature}</span>
        </li>
      ))}
    </ul>
    <Button 
      onClick={onClick} 
      disabled={comingSoon}
      className={`w-full ${isPopular ? 'bg-blue-600 hover:bg-blue-700 text-white' : 'bg-gray-100 hover:bg-gray-200 text-gray-800'}`}
    >
      {buttonText}
    </Button>
  </div>
);

const Planes = () => {
  const handleSelectPlan = (plan: string) => {
    console.log(`Plan seleccionado: ${plan}`);
    // Aquí iría la lógica para seleccionar un plan
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-slate-50">
        <Link to="/" className="flex items-center gap-2">
          <img alt="Logo" src="/lovable-uploads/3236de6d-a3e4-4b81-9c83-b32690d4212d.png" className="h-8 w-8" />
          <div className="text-black text-[10px] sm:text-xs font-bold tracking-tight">
            <div className="leading-none">DENTAL BASICS</div>
            <div className="leading-none">ACADEMY</div>
          </div>
        </Link>
        
        <Link to="/">
          <Button variant="ghost" className="text-sm">Volver al inicio</Button>
        </Link>
      </div>
      
      {/* Main Content */}
      <div className="container mx-auto px-4 py-12 max-w-6xl">
        <h1 className="text-4xl font-bold text-center mb-3 text-gray-900">Planes y Precios</h1>
        
        <p className="text-center text-lg text-gray-600 mb-10 max-w-3xl mx-auto">
          Elige el plan que mejor se adapte a tus necesidades y comienza a transformar 
          tu práctica odontológica con DENTAXY.ai
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <PlanCard 
            title="Plan Beta"
            price="Gratis"
            features={[
              "Acceso completo durante la fase beta",
              "Soporte prioritario",
              "Historial clínico completo",
              "Funciones de IA básicas",
              "Almacenamiento limitado"
            ]}
            isPopular={true}
            buttonText="Unirse a la Beta"
            onClick={() => handleSelectPlan("beta")}
          />
          
          <PlanCard 
            title="Plan Básico"
            price="$29.99"
            features={[
              "Todas las funciones del plan Beta",
              "Sin límite de historiales",
              "Plantillas personalizadas",
              "Exportación de documentos",
              "Soporte estándar"
            ]}
            comingSoon={true}
          />
          
          <PlanCard 
            title="Plan Premium"
            price="$49.99"
            features={[
              "Todas las funciones del plan Básico",
              "IA avanzada para diagnósticos",
              "Integración con sistemas de gestión",
              "Análisis y reportes avanzados",
              "Soporte premium 24/7"
            ]}
            comingSoon={true}
          />
        </div>
        
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-8 rounded-lg mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Crown className="h-6 w-6 text-yellow-500" />
            <h2 className="text-2xl font-bold text-gray-800">Plan Empresarial</h2>
          </div>
          <p className="text-center text-gray-700 mb-6">
            Para clínicas con múltiples odontólogos o cadenas de consultorios. 
            Contacta con nuestro equipo para obtener una cotización personalizada.
          </p>
          <div className="text-center">
            <Link to="/contacto">
              <Button variant="outline" className="border-blue-600 text-blue-600 hover:bg-blue-50">
                Solicitar información
              </Button>
            </Link>
          </div>
        </div>
        
        <div className="text-center">
          <p className="text-gray-500 mb-4">¿Tienes preguntas sobre nuestros planes?</p>
          <Link to="/contacto">
            <Button className="bg-blue-600 hover:bg-blue-700 text-white">
              Contactar con el equipo
            </Button>
          </Link>
        </div>
      </div>
      
      <BottomMenu />
    </div>
  );
};

export default Planes;
