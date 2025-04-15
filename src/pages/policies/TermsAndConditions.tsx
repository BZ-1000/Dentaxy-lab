import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../../components/ui/button';

const TermsAndConditions = () => {
  return (
    <div className="min-h-screen bg-white">
      <main className="container mx-auto px-4 py-16 max-w-4xl">
        <h1 className="text-4xl font-bold text-center mb-8 text-gray-900">Términos y Condiciones</h1>
        
        <div className="prose prose-lg mx-auto">
          <p className="text-gray-700">
            Última actualización: 14 de abril de 2025
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4 text-gray-900">1. Introducción</h2>
          <p className="text-gray-700">
            Bienvenido a Dentaxy. Estos términos y condiciones rigen el uso de nuestra plataforma y servicios 
            ofrecidos por Dental Basics Academy. Al acceder o utilizar nuestro servicio, usted acepta estar 
            sujeto a estos términos. Si no está de acuerdo con alguna parte de los términos, no podrá 
            acceder al servicio.
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4 text-gray-900">2. Definiciones</h2>
          <p className="text-gray-700">
            <strong>Plataforma:</strong> Se refiere a la aplicación web Dentaxy y todos sus componentes.<br />
            <strong>Usuario:</strong> Cualquier persona que acceda o utilice la Plataforma.<br />
            <strong>Contenido:</strong> Incluye texto, imágenes, datos, información y otros materiales generados por el usuario.
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4 text-gray-900">3. Uso del Servicio</h2>
          <p className="text-gray-700">
            3.1. La Plataforma está diseñada para uso profesional en el ámbito odontológico.<br />
            3.2. Usted es responsable de mantener la confidencialidad de su cuenta.<br />
            3.3. Usted acepta no utilizar la Plataforma para fines ilegales o prohibidos por estos términos.
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4 text-gray-900">4. Privacidad y Datos</h2>
          <p className="text-gray-700">
            4.1. Dentaxy no almacena ningún dato ingresado en los formularios por los usuarios, 
            incluyendo información de historias clínicas o de pacientes. Toda la información se procesa localmente 
            en el navegador del usuario y no se guarda en nuestros servidores.<br />
            4.2. La funcionalidad para guardar formularios depende del almacenamiento local del navegador, 
            lo cual significa que los datos se almacenan únicamente en el dispositivo del usuario. 
            Si cambia de dispositivo, esta información no se transfiere.<br />
            4.3. La generación de archivos PDF y su almacenamiento es responsabilidad exclusiva del usuario.<br />
            4.4. La información personal mínima que se pudiera requerir se procesa de acuerdo con nuestra 
            <Link to="/privacy" className="text-blue-600 hover:underline"> Política de Privacidad</Link>.<br />
            4.5. Usted es responsable de obtener el consentimiento adecuado de los pacientes para 
            el procesamiento de cualquier dato en la Plataforma.
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4 text-gray-900">5. Limitación de Responsabilidad</h2>
          <p className="text-gray-700">
            5.1. La Plataforma se proporciona "tal cual" y "según disponibilidad" sin garantías de ningún tipo.<br />
            5.2. No seremos responsables por cualquier daño indirecto, incidental, especial, consecuente o punitivo.<br />
            5.3. Usted es responsable del uso adecuado de la información generada por la Plataforma, 
            así como de su resguardo y cumplimiento con la legislación aplicable.
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4 text-gray-900">6. Cambios en los Términos</h2>
          <p className="text-gray-700">
            Nos reservamos el derecho de modificar o reemplazar estos términos en cualquier momento. Es su 
            responsabilidad revisar periódicamente los cambios. El uso continuado de la Plataforma después 
            de los cambios constituye la aceptación de los nuevos términos.
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4 text-gray-900">7. Contacto</h2>
          <p className="text-gray-700">
            Si tiene alguna pregunta sobre estos términos, por favor contáctenos en:<br />
            <a href="mailto:dentalbasicsacademy@dentaxy.com" className="text-blue-600 hover:underline">
              dentalbasicsacademy@dentaxy.com
            </a>
          </p>

          <div className="text-center mt-12">
            <Link to="/">
              <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                Volver al Inicio
              </Button>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
};

export default TermsAndConditions;
