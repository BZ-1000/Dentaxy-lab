
import React from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-4 py-16">
        <Link to="/">
          <Button variant="outline" className="mb-8">
            Volver al inicio
          </Button>
        </Link>
        
        <h1 className="text-3xl font-bold mb-8 text-gray-900">Política de Privacidad</h1>
        
        <div className="prose max-w-none">
          <p className="text-gray-700">
            En Dentaxy.ai, valoramos y respetamos tu privacidad. Esta Política de Privacidad explica cómo 
            recopilamos, utilizamos y protegemos tu información personal cuando utilizas nuestra plataforma.
          </p>
          
          <h2 className="text-xl font-semibold mt-6 mb-4 text-gray-800">1. Información que Recopilamos</h2>
          <p className="text-gray-700">
            Podemos recopilar varios tipos de información, incluyendo:
          </p>
          <ul className="list-disc pl-6 text-gray-700">
            <li>Información de registro (nombre, correo electrónico, etc.)</li>
            <li>Información profesional</li>
            <li>Información de uso de la plataforma</li>
            <li>Información que introduces en los formularios</li>
          </ul>
          
          <h2 className="text-xl font-semibold mt-6 mb-4 text-gray-800">2. Cómo Utilizamos tu Información</h2>
          <p className="text-gray-700">
            Utilizamos la información recopilada para:
          </p>
          <ul className="list-disc pl-6 text-gray-700">
            <li>Proporcionar y mejorar nuestros servicios</li>
            <li>Personalizar tu experiencia</li>
            <li>Enviar comunicaciones importantes</li>
            <li>Garantizar la seguridad de la plataforma</li>
            <li>Cumplir con obligaciones legales</li>
          </ul>
          
          <h2 className="text-xl font-semibold mt-6 mb-4 text-gray-800">3. Confidencialidad de Datos Clínicos</h2>
          <p className="text-gray-700">
            Entendemos la sensibilidad de los datos clínicos. Implementamos estrictas medidas de seguridad 
            y confidencialidad para proteger toda la información de pacientes que pueda ser procesada a través 
            de nuestra plataforma.
          </p>
          
          <h2 className="text-xl font-semibold mt-6 mb-4 text-gray-800">4. Compartición de Información</h2>
          <p className="text-gray-700">
            No vendemos, alquilamos ni compartimos tu información personal con terceros sin tu consentimiento, 
            excepto cuando sea necesario para proporcionar nuestros servicios o cuando lo exija la ley.
          </p>
          
          <h2 className="text-xl font-semibold mt-6 mb-4 text-gray-800">5. Seguridad de Datos</h2>
          <p className="text-gray-700">
            Implementamos medidas de seguridad técnicas, administrativas y físicas para proteger tu información 
            personal contra accesos no autorizados, pérdida o alteración.
          </p>
          
          <h2 className="text-xl font-semibold mt-6 mb-4 text-gray-800">6. Tus Derechos</h2>
          <p className="text-gray-700">
            Tienes derecho a acceder, corregir, eliminar o limitar el procesamiento de tu información personal. 
            También puedes oponerte al procesamiento y solicitar la portabilidad de tus datos.
          </p>
          
          <h2 className="text-xl font-semibold mt-6 mb-4 text-gray-800">7. Cambios en esta Política</h2>
          <p className="text-gray-700">
            Podemos actualizar esta política periódicamente. Te notificaremos cualquier cambio significativo 
            a través de nuestra plataforma o por correo electrónico.
          </p>
          
          <h2 className="text-xl font-semibold mt-6 mb-4 text-gray-800">8. Contacto</h2>
          <p className="text-gray-700">
            Si tienes preguntas o inquietudes sobre nuestra Política de Privacidad, por favor contáctanos 
            a través de nuestros canales oficiales de comunicación.
          </p>
          
          <p className="mt-8 text-gray-700">
            Última actualización: Septiembre 2024
          </p>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
