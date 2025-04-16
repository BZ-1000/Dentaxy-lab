
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../../components/ui/button';
import { Textarea } from '../../components/ui/textarea';

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-white">
      <main className="container mx-auto px-4 py-16 max-w-4xl">
        <h1 className="text-4xl font-bold text-center mb-8 text-gray-900">Política de Privacidad</h1>
        
        <div className="prose prose-lg mx-auto">
          <p className="text-gray-700">
            Fecha de última actualización: 14 de abril de 2025
          </p>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4 text-gray-900">1. Introducción</h2>
          <p className="text-gray-700">
            En Dentaxy, respetamos su privacidad y nos comprometemos a proteger su información. Esta Política de Privacidad explica cómo manejamos sus datos al utilizar nuestra plataforma. Nuestra prioridad es garantizar la transparencia y la seguridad de la información generada por los usuarios.
          </p>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4 text-gray-900">2. Qué Información Recopilamos</h2>
          <p className="text-gray-700">
            <strong>2.1. Información personal mínima</strong><br />
            Al crear una cuenta en Dentaxy, podemos recopilar únicamente su correo electrónico y, si lo proporciona, su nombre. No solicitamos información adicional.
          </p>
          <p className="text-gray-700">
            <strong>2.2. Información clínica o de pacientes</strong><br />
            Dentaxy no almacena información de formularios, redacciones clínicas ni datos de pacientes. Todo contenido generado vive únicamente en su navegador y dispositivo, y no es enviado ni guardado en nuestros servidores.
          </p>
          <p className="text-gray-700">
            <strong>2.3. Almacenamiento local</strong><br />
            Los formularios o configuraciones que el usuario guarda se almacenan localmente en el dispositivo mediante tecnologías como el almacenamiento local del navegador. Esto significa que los datos no se sincronizan entre dispositivos, incluso si el usuario inicia sesión con la misma cuenta.
          </p>
          <p className="text-gray-700">
            <strong>2.4. Datos de uso anónimos</strong><br />
            Podemos recopilar información técnica de uso general (como tipo de navegador, sistema operativo o duración de la sesión) de forma anónima y agregada, con el fin de mejorar la experiencia de la plataforma. Esta información no se vincula a datos personales ni clínicos.
          </p>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4 text-gray-900">3. Uso de la Información</h2>
          <p className="text-gray-700">
            Utilizamos la información recopilada exclusivamente para:
          </p>
          <ul className="list-disc ml-6 text-gray-700">
            <li>Proporcionar acceso y funcionalidad básica de la plataforma</li>
            <li>Mejorar la estabilidad y rendimiento del sistema</li>
            <li>Comunicarnos con usted en relación con cambios importantes en el servicio</li>
          </ul>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4 text-gray-900">4. Seguridad de los Datos</h2>
          <p className="text-gray-700">
            Aunque Dentaxy no almacena contenido clínico o formularios, tomamos medidas para proteger la seguridad de su cuenta de acceso. Contamos con cifrado y protocolos seguros para la autenticación y la navegación en nuestra plataforma.
          </p>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4 text-gray-900">5. Compartición de Datos</h2>
          <p className="text-gray-700">
            5.1. Nunca vendemos, alquilamos ni compartimos información personal con terceros con fines comerciales.<br />
            5.2. Podemos trabajar con proveedores de servicios tecnológicos que nos ayuden a operar la plataforma, siempre bajo estrictos acuerdos de confidencialidad y solo cuando sea técnicamente necesario.<br />
            5.3. Podremos divulgar información si así lo exige la ley, una orden judicial o un proceso legal válido.
          </p>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4 text-gray-900">6. Responsabilidad del Usuario</h2>
          <p className="text-gray-700">
            Usted es el único responsable del contenido que genere, guarde o descargue desde la Plataforma, incluyendo archivos PDF de historias clínicas. Debe asegurar su almacenamiento, resguardo y uso conforme a las leyes de protección de datos personales de su país.
          </p>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4 text-gray-900">7. Derechos del Usuario</h2>
          <p className="text-gray-700">
            Según su ubicación, puede tener derecho a:
          </p>
          <ul className="list-disc ml-6 text-gray-700">
            <li>Acceder a sus datos personales mínimos (correo y nombre, si fue ingresado)</li>
            <li>Solicitar la eliminación de su cuenta</li>
            <li>Solicitar la eliminación de sus datos personales de contacto</li>
          </ul>
          <p className="text-gray-700 mt-2">
            Para ejercer estos derechos, contáctenos en dentalbasicsacademy@dentaxy.com.
          </p>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4 text-gray-900">8. Cambios a esta Política</h2>
          <p className="text-gray-700">
            Podemos actualizar esta política de privacidad ocasionalmente. Notificaremos cualquier cambio importante publicando una nueva versión en esta página y, cuando sea pertinente, a través de un aviso en la plataforma o por correo electrónico.
          </p>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4 text-gray-900">9. Contacto</h2>
          <p className="text-gray-700">
            Si tiene preguntas o inquietudes sobre esta política de privacidad, puede comunicarse con nosotros en:<br />
            📧 dentalbasicsacademy@dentaxy.com
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
