
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Check } from 'lucide-react';

const Plans = () => {
  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto py-12 px-4">
        <div className="max-w-5xl mx-auto">
          <Link to="/">
            <Button variant="outline" className="mb-8">
              ← Volver al inicio
            </Button>
          </Link>
          
          <h1 className="text-3xl font-bold mb-8 text-center">Planes y Precios</h1>
          
          <p className="text-gray-700 mb-12 text-center max-w-3xl mx-auto">
            Encuentra el plan perfecto para tu práctica. Desde profesionales independientes hasta grandes clínicas, tenemos opciones que se adaptan a tus necesidades.
          </p>
          
          <div className="grid gap-8 md:grid-cols-3">
            {/* Plan Beta */}
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm relative">
              <div className="bg-blue-600 text-white text-center py-2 font-medium">
                Disponible Ahora
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold mb-4">Plan Beta</h3>
                <div className="text-3xl font-bold mb-6">Gratuito</div>
                <p className="text-gray-600 mb-6">Acceso completo durante la fase beta del desarrollo.</p>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">Acceso a todas las funciones</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">Límite de documentos: 30/mes</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">Soporte por correo electrónico</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">Influye en el desarrollo del producto</span>
                  </li>
                </ul>
                <Button className="w-full bg-blue-600 hover:bg-blue-700">
                  Seleccionar Plan
                </Button>
              </div>
            </div>
            
            {/* Plan Básico */}
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm relative">
              <div className="bg-gray-200 text-gray-800 text-center py-2 font-medium">
                Próximamente
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold mb-4">Plan Básico</h3>
                <div className="text-3xl font-bold mb-6">$29/mes</div>
                <p className="text-gray-600 mb-6">Ideal para profesionales independientes.</p>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">Todas las funcionalidades principales</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">Límite de documentos: 80/mes</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">Soporte en horario laboral</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">1 usuario</span>
                  </li>
                </ul>
                <Button className="w-full" disabled>
                  Próximamente
                </Button>
              </div>
            </div>
            
            {/* Plan Premium */}
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm relative">
              <div className="bg-gray-200 text-gray-800 text-center py-2 font-medium">
                Próximamente
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold mb-4">Plan Premium</h3>
                <div className="text-3xl font-bold mb-6">$79/mes</div>
                <p className="text-gray-600 mb-6">Perfecto para clínicas y equipos.</p>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">Funcionalidades avanzadas</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">Documentos ilimitados</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">Soporte prioritario 24/7</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">Hasta 5 usuarios</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">Integración con software clínico</span>
                  </li>
                </ul>
                <Button className="w-full" disabled>
                  Próximamente
                </Button>
              </div>
            </div>
          </div>
          
          <div className="mt-12 bg-gray-50 p-6 rounded-lg text-center">
            <h3 className="text-lg font-semibold mb-2">¿Necesitas un plan personalizado?</h3>
            <p className="text-gray-700 mb-4">Contáctanos para discutir opciones a medida para grandes clínicas o instituciones educativas.</p>
            <Link to="/contact">
              <Button variant="outline">Contactar al equipo</Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Plans;
