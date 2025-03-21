
import React from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const TermsAndConditions = () => {
  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <Link to="/">
            <Button variant="outline" className="mb-8">
              ← Volver al inicio
            </Button>
          </Link>
          
          <h1 className="text-3xl font-bold mb-8">Términos y Condiciones</h1>
          
          <div className="prose max-w-none">
            <h2 className="text-xl font-semibold mt-6 mb-4">1. Aceptación de los Términos</h2>
            <p className="text-gray-700 mb-4">
              Al acceder y utilizar los servicios de Dentaxy.ai, usted acepta estar legalmente vinculado por estos Términos y Condiciones. Si no está de acuerdo con alguno de estos términos, no utilice nuestros servicios.
            </p>
            
            <h2 className="text-xl font-semibold mt-6 mb-4">2. Descripción del Servicio</h2>
            <p className="text-gray-700 mb-4">
              Dentaxy.ai proporciona herramientas de inteligencia artificial para la gestión y creación de documentación clínica dental. Nuestros servicios están diseñados para profesionales de la odontología y estudiantes.
            </p>
            
            <h2 className="text-xl font-semibold mt-6 mb-4">3. Cuentas de Usuario</h2>
            <p className="text-gray-700 mb-4">
              Al registrarse en Dentaxy.ai, usted es responsable de mantener la confidencialidad de su información de cuenta y contraseña. Usted acepta notificarnos inmediatamente sobre cualquier uso no autorizado de su cuenta.
            </p>
            
            <h2 className="text-xl font-semibold mt-6 mb-4">4. Limitaciones de Responsabilidad</h2>
            <p className="text-gray-700 mb-4">
              Dentaxy.ai proporciona herramientas de asistencia, pero la responsabilidad final sobre el diagnóstico, tratamiento y documentación clínica recae exclusivamente en el profesional de la salud. Nuestro servicio no sustituye el juicio profesional.
            </p>
            
            <h2 className="text-xl font-semibold mt-6 mb-4">5. Propiedad Intelectual</h2>
            <p className="text-gray-700 mb-4">
              Todo el contenido proporcionado en Dentaxy.ai, incluyendo texto, gráficos, logos, y software, está protegido por derechos de autor y otras leyes de propiedad intelectual.
            </p>
            
            <h2 className="text-xl font-semibold mt-6 mb-4">6. Cambios en los Términos</h2>
            <p className="text-gray-700 mb-4">
              Nos reservamos el derecho de modificar estos términos en cualquier momento. Los cambios entrarán en vigor inmediatamente después de su publicación en nuestro sitio web.
            </p>
            
            <h2 className="text-xl font-semibold mt-6 mb-4">7. Ley Aplicable</h2>
            <p className="text-gray-700 mb-4">
              Estos términos se regirán e interpretarán de acuerdo con las leyes vigentes, sin tener en cuenta sus conflictos de disposiciones legales.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsAndConditions;
