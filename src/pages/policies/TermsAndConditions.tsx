
import React from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const TermsAndConditions = () => {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-4 py-16">
        <Link to="/">
          <Button variant="outline" className="mb-8">
            Volver al inicio
          </Button>
        </Link>
        
        <h1 className="text-3xl font-bold mb-8 text-gray-900">Términos y Condiciones</h1>
        
        <div className="prose max-w-none">
          <p className="text-gray-700">
            Bienvenido a los Términos y Condiciones de Dentaxy.ai. Al acceder y utilizar nuestros servicios, 
            aceptas estar sujeto a los siguientes términos y condiciones. Te recomendamos leer detenidamente 
            este documento.
          </p>
          
          <h2 className="text-xl font-semibold mt-6 mb-4 text-gray-800">1. Aceptación de los Términos</h2>
          <p className="text-gray-700">
            Al registrarte y utilizar Dentaxy.ai, aceptas expresamente estos Términos y Condiciones en su 
            totalidad. Si no estás de acuerdo con alguna parte de estos términos, no deberás usar nuestros 
            servicios.
          </p>
          
          <h2 className="text-xl font-semibold mt-6 mb-4 text-gray-800">2. Descripción del Servicio</h2>
          <p className="text-gray-700">
            Dentaxy.ai proporciona herramientas digitales para profesionales de la odontología, incluyendo 
            asistencia en la redacción de historias clínicas mediante inteligencia artificial. Nuestros 
            servicios están diseñados para apoyar, no para reemplazar, el juicio profesional de los 
            odontólogos.
          </p>
          
          <h2 className="text-xl font-semibold mt-6 mb-4 text-gray-800">3. Registro y Cuentas de Usuario</h2>
          <p className="text-gray-700">
            Para utilizar nuestros servicios, debes registrarte proporcionando información precisa y completa. 
            Eres responsable de mantener la confidencialidad de tu contraseña y de todas las actividades que 
            ocurran bajo tu cuenta.
          </p>
          
          <h2 className="text-xl font-semibold mt-6 mb-4 text-gray-800">4. Políticas de Privacidad</h2>
          <p className="text-gray-700">
            Tu privacidad es importante para nosotros. Nuestra Política de Privacidad explica cómo recopilamos, 
            usamos y protegemos tu información personal. Al utilizar nuestros servicios, también aceptas nuestra 
            Política de Privacidad.
          </p>
          
          <h2 className="text-xl font-semibold mt-6 mb-4 text-gray-800">5. Limitaciones de Responsabilidad</h2>
          <p className="text-gray-700">
            Dentaxy.ai proporciona herramientas de asistencia, pero no garantiza la exactitud, integridad o 
            idoneidad de la información generada. Los profesionales de la salud deben usar su juicio 
            profesional al aplicar cualquier recomendación o contenido generado.
          </p>
          
          <h2 className="text-xl font-semibold mt-6 mb-4 text-gray-800">6. Cambios en los Términos</h2>
          <p className="text-gray-700">
            Nos reservamos el derecho de modificar estos términos en cualquier momento. Los cambios serán 
            efectivos inmediatamente después de su publicación. El uso continuado de nuestros servicios 
            después de dichos cambios constituirá tu aceptación de los nuevos términos.
          </p>
          
          <h2 className="text-xl font-semibold mt-6 mb-4 text-gray-800">7. Contacto</h2>
          <p className="text-gray-700">
            Si tienes preguntas sobre estos Términos y Condiciones, por favor contáctanos a través de 
            nuestros canales oficiales de comunicación.
          </p>
          
          <p className="mt-8 text-gray-700">
            Última actualización: Septiembre 2024
          </p>
        </div>
      </div>
    </div>
  );
};

export default TermsAndConditions;
