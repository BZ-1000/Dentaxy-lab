
import React from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <Link to="/">
            <Button variant="outline" className="mb-8">
              ← Volver al inicio
            </Button>
          </Link>
          
          <h1 className="text-3xl font-bold mb-8">Política de Privacidad</h1>
          
          <div className="prose max-w-none">
            <h2 className="text-xl font-semibold mt-6 mb-4">1. Información que Recopilamos</h2>
            <p className="text-gray-700 mb-4">
              En Dentaxy.ai, recopilamos información personal que usted nos proporciona voluntariamente al registrarse, como su nombre, dirección de correo electrónico, y credenciales profesionales. También podemos recopilar información sobre su uso de nuestros servicios.
            </p>
            
            <h2 className="text-xl font-semibold mt-6 mb-4">2. Uso de la Información</h2>
            <p className="text-gray-700 mb-4">
              Utilizamos la información recopilada para proporcionar, mantener y mejorar nuestros servicios, procesar transacciones, enviar notificaciones técnicas, y comunicarnos con usted sobre actualizaciones o nuevas ofertas.
            </p>
            
            <h2 className="text-xl font-semibold mt-6 mb-4">3. Protección de Datos de Pacientes</h2>
            <p className="text-gray-700 mb-4">
              Dentaxy.ai está diseñado con estrictas medidas de seguridad para proteger la información de salud personalmente identificable. Cumplimos con todas las regulaciones aplicables sobre privacidad de datos de salud.
            </p>
            
            <h2 className="text-xl font-semibold mt-6 mb-4">4. Compartir Información</h2>
            <p className="text-gray-700 mb-4">
              No vendemos ni alquilamos su información personal a terceros. Solo compartimos información cuando es necesario para proporcionar nuestros servicios, cumplir con la ley, o proteger nuestros derechos.
            </p>
            
            <h2 className="text-xl font-semibold mt-6 mb-4">5. Seguridad de los Datos</h2>
            <p className="text-gray-700 mb-4">
              Implementamos medidas de seguridad técnicas y organizativas para proteger su información contra acceso no autorizado, alteración, divulgación o destrucción.
            </p>
            
            <h2 className="text-xl font-semibold mt-6 mb-4">6. Sus Derechos</h2>
            <p className="text-gray-700 mb-4">
              Usted tiene derecho a acceder, corregir o eliminar su información personal. También puede solicitar la limitación del procesamiento de sus datos u objetar a dicho procesamiento.
            </p>
            
            <h2 className="text-xl font-semibold mt-6 mb-4">7. Cambios en esta Política</h2>
            <p className="text-gray-700 mb-4">
              Podemos actualizar nuestra Política de Privacidad periódicamente. Le notificaremos cualquier cambio publicando la nueva política en nuestro sitio web y actualizando la fecha de "última actualización".
            </p>
            
            <h2 className="text-xl font-semibold mt-6 mb-4">8. Contáctenos</h2>
            <p className="text-gray-700 mb-4">
              Si tiene preguntas sobre esta Política de Privacidad, contacte con nosotros en: contact@dentaxy.ai
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
