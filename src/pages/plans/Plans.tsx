
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Check, Crown, Clock, Calendar, Star } from 'lucide-react';
import BottomMenu from '@/components/BottomMenu';
import { useSubscription } from '@/hooks/useSubscription';
import { useAuth } from '@/contexts/AuthContext';
import { SubscriptionStatus } from '@/components/subscription/SubscriptionStatus';

const PlanCard = ({ 
  title, 
  price, 
  features, 
  isPopular = false,
  isBestValue = false,
  buttonText = "Suscribirse",
  comingSoon = false,
  onClick,
  originalPrice,
  priceDescription,
  planType,
  savings,
  icon: IconComponent,
  duration,
  usage,
} : { 
  title: string, 
  price: string, 
  features: string[], 
  isPopular?: boolean,
  isBestValue?: boolean,
  buttonText?: string,
  comingSoon?: boolean,
  onClick?: () => void,
  originalPrice?: string,
  priceDescription?: string,
  planType?: string,
  savings?: string,
  icon?: React.ComponentType<any>,
  duration?: string,
  usage?: string,
}) => (
  <div className={`bg-white p-6 rounded-lg shadow-sm border relative ${
    isPopular ? 'border-blue-400 ring-2 ring-blue-200 transform scale-105' : 
    isBestValue ? 'border-green-400 ring-2 ring-green-200 transform scale-105' :
    comingSoon ? 'opacity-70 border-gray-200' : 'border-gray-200'
  }`}>
    {isPopular && (
      <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-blue-500 text-white px-4 py-1 rounded-full text-sm font-medium flex items-center gap-1">
        <Star className="h-3 w-3" />
        Más Vendido
      </div>
    )}
    {isBestValue && (
      <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-green-500 text-white px-4 py-1 rounded-full text-sm font-medium flex items-center gap-1">
        <Check className="h-3 w-3" />
        Mejor Valor
      </div>
    )}
    {comingSoon && (
      <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-gray-500 text-white px-4 py-1 rounded-full text-sm font-medium">
        Próximamente
      </div>
    )}
    
    <div className="text-center mb-4">
      {IconComponent && (
        <div className={`inline-flex items-center justify-center w-12 h-12 rounded-full mb-3 ${
          isPopular ? 'bg-blue-100 text-blue-600' :
          isBestValue ? 'bg-green-100 text-green-600' :
          'bg-gray-100 text-gray-600'
        }`}>
          <IconComponent className="h-6 w-6" />
        </div>
      )}
      <h3 className="text-xl font-bold mb-2 text-gray-800">{title}</h3>
      {duration && (
        <p className="text-sm text-gray-500 mb-2">{duration}</p>
      )}
    </div>

    <div className="mb-4 text-center">
      {originalPrice && (
        <>
          <span className="text-xl font-medium line-through text-gray-400 mr-2">{originalPrice}</span>
          {priceDescription && <div className="text-xs text-gray-500 mb-1">{priceDescription}</div>}
        </>
      )}
      <div className="flex items-baseline justify-center">
        <span className="text-3xl font-bold text-gray-900">{price}</span>
        {!comingSoon && price !== "Gratis" && (
          <span className="text-gray-600 ml-1">/período</span>
        )}
      </div>
      {savings && (
        <div className="mt-2 inline-block bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">
          {savings}
        </div>
      )}
      {usage && (
        <div className="mt-2 text-sm text-gray-600 bg-gray-50 rounded-lg p-2">
          {usage}
        </div>
      )}
    </div>

    <ul className="space-y-3 mb-8">
      {features.map((feature, idx) => (
        <li key={idx} className="flex items-start">
          <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
          <span className="text-gray-600 text-sm">{feature}</span>
        </li>
      ))}
    </ul>

    <Button 
      onClick={onClick} 
      disabled={comingSoon}
      className={`w-full ${
        isPopular ? 'bg-blue-600 hover:bg-blue-700 text-white' : 
        isBestValue ? 'bg-green-600 hover:bg-green-700 text-white' :
        'bg-gray-100 hover:bg-gray-200 text-gray-800'
      }`}
    >
      {buttonText}
    </Button>
  </div>
);

const Plans = () => {
  const { user } = useAuth();
  const { loading, createCheckoutSession } = useSubscription();

  const handleSelectPlan = async (planType: string) => {
    if (planType === "beta") {
      console.log("Plan Beta seleccionado");
      return;
    }

    const url = await createCheckoutSession(planType);
    if (url) {
      window.open(url, '_blank');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-white shadow-sm">
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
      <div className="container mx-auto px-4 py-12 max-w-7xl">
        <h1 className="text-4xl font-bold text-center mb-3 text-gray-900">Planes y Precios</h1>
        
        <p className="text-center text-lg text-gray-600 mb-10 max-w-3xl mx-auto">
          Elige el plan que mejor se adapte a tus necesidades y comienza a transformar 
          tu práctica odontológica con DENTAXY.ai
        </p>

        {/* Show subscription status if user is logged in */}
        {user && (
          <div className="mb-8 max-w-md mx-auto">
            <SubscriptionStatus />
          </div>
        )}
        
        {/* Plans Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 mb-12 max-w-6xl mx-auto">
          {/* Plan Beta */}
          <PlanCard 
            title="Plan Beta"
            price="Gratis"
            duration="Acceso completo durante la fase beta"
            features={[
              "Acceso completo durante la fase beta",
              "Soporte prioritario",
              "Historial clínico completo",
              "Funciones de IA básicas",
              "Sin límites durante beta"
            ]}
            buttonText="Unirse a la Beta"
            onClick={() => handleSelectPlan("beta")}
            icon={Star}
          />
          
          {/* Plan Express */}
          <PlanCard 
            title="Acceso Exprés"
            price="$20 MXN"
            duration="Suscripción diaria (renovación automática)"
            usage="3 historias clínicas + 15 generaciones IA por día"
            features={[
              "Acceso por 24 horas",
              "3 historias clínicas por período",
              "15 usos de 'Generar Redacción'",
              "Renovación automática diaria",
              "Contadores se resetean cada día"
            ]}
            onClick={() => handleSelectPlan("express")}
            icon={Clock}
          />
          
          {/* Plan Professional */}
          <PlanCard 
            title="Acceso Profesional"
            price="$59 MXN"
            duration="Suscripción semanal (renovación automática)"
            features={[
              "Acceso por 7 días",
              "Historias clínicas ilimitadas",
              "Generación de redacciones ilimitada",
              "Renovación automática semanal",
              "Ideal para semanas activas"
            ]}
            onClick={() => handleSelectPlan("professional")}
            icon={Calendar}
          />
          
          {/* Plan Pro Monthly - Most Sold */}
          <PlanCard 
            title="Acceso Total - Plan Pro"
            price="$99 MXN"
            duration="Suscripción mensual (renovación automática)"
            features={[
              "Acceso completo ilimitado",
              "Historias clínicas sin límites",
              "Generación automática de redacciones",
              "Soporte prioritario",
              "Actualizaciones incluidas"
            ]}
            isPopular={true}
            onClick={() => handleSelectPlan("pro_monthly")}
            icon={Crown}
          />
          
          {/* Plan Student Semester - Best Value */}
          <div className="md:col-span-2 xl:col-span-2 flex justify-center">
            <div className="w-full max-w-md">
              <PlanCard 
                title="Plan Estudiante Semestral"
                price="$499 MXN"
                originalPrice="$594 MXN"
                priceDescription="Equivale a $83.16/mes vs $99/mes del plan mensual"
                duration="Suscripción semestral (6 meses)"
                savings="¡Ahorra $95!"
                features={[
                  "Acceso completo por 6 meses",
                  "Todas las funciones del Plan Pro",
                  "Especial para estudiantes de odontología",
                  "Renovación automática cada 6 meses",
                  "El mejor valor por tu dinero"
                ]}
                isBestValue={true}
                onClick={() => handleSelectPlan("student_semester")}
                icon={Star}
              />
            </div>
          </div>
        </div>
        
        {/* Enterprise Section */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-8 rounded-lg mb-8 max-w-4xl mx-auto">
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
        
        {/* Footer CTA */}
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

export default Plans;
