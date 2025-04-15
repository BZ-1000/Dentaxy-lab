import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../../components/ui/button';

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-white">
      <main className="container mx-auto px-4 py-16 max-w-4xl">
        <h1 className="text-4xl font-bold text-center mb-8 text-gray-900">Política de Privacidad</h1>
        
        <div className="prose prose-lg mx-auto">
          <p className="text-gray-700">
            Última actualización: 14 de abril de 2025
          </p>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4 text-gray-900">1. Introducción</h2>
          <p className="text-gray-700">
            En Dentaxy, respetamos su privacidad y nos comprometemos a proteger sus datos personales. 
            Esta política de privacidad describe cómo se maneja la información cuando usted utiliza nuestra plataforma.
          </p>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4 text-gray-900">2. Información que Recopilamos</h2>
          <p className="text-gray-700">
            2.1. <strong>Información personal:</strong> Podemos recopilar su nombre, dirección de correo electrónico y otra información de contacto si decide comunicarse con nosotros.<br />
            2.2. <strong>Datos de pacientes:</strong> <u>No almacenamos datos clínicos</u>. Toda la información ingresada en los formularios (como historias clínicas) se procesa localmente en el navegador del usuario y no se guarda en nuestros servidores.<br />
            2.3. <strong>Datos de uso:</strong> Podemos recopilar información técnica anónima sobre el uso general de la plataforma para fines estadísticos y de mejora continua.
          </p>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4 text-gray-900">3. Cómo Utilizamos su Información</h2>
          <p className="text-gray-700">
            3.1. Para proporcionar y mantener nuestro servicio.<br />
            3.2. Para responder a sus consultas o solicitudes.<br />
            3.3. Para mejorar la experiencia del usuario.<br />
            3.4. Para fines legales si es requerido por la ley.
          </p>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4 text-gray-900">4. Seguridad de los Datos</h2>
          <p className="text-gray-700">
            Aunque no almacenamos datos clínicos, nos comprometemos a mantener la seguridad de cualquier comunicación 
            con nosotros mediante el uso de protocolos cifrados (HTTPS). Toda la información clínica permanece en 
            el dispositivo del usuario.
          </p>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4 text-gray-900">5. Compartir Datos</h2>
          <p className="text-gray-700">
            5.1. No vendemos ni alquilamos su información personal a terceros.<br />
            5.2. No compartimos datos clínicos ya que estos no se almacenan.<br />
            5.3. Podemos compartir datos anónimos de uso con proveedores tecnológicos para mejorar el servicio.<br />
            5.4. Podemos divulgar su información si es requerido por ley.
          </p>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4 text-gray-900">6. Sus Derechos</h2>
          <p className="text-gray-700">
            Dependiendo de su ubicación, puede tener derechos específicos con respecto a sus datos, incluyendo:<br />
            • Acceso a sus datos personales<br />
            • Corrección de datos inexactos<br />
            • Eliminación de sus datos<br />
            • Oposición al procesamiento<br />
            • Portabilidad de datos
          </p>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4 text-gray-900">7. Cambios a esta Política</h2>
          <p className="text-gray-700">
            Podemos actualizar nuestra política de privacidad periódicamente. Le notificaremos cualquier 
            cambio publicando la nueva política de privacidad en esta página.
          </p>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4 text-gray-900">8. Contacto</h2>
          <p className="text-gray-700">
            Si tiene preguntas sobre esta política de privacidad, por favor contáctenos en:<br />
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

export default PrivacyPolicy;
