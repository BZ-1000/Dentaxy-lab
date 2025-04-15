import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../../components/ui/button';

const TermsAndConditions = () => {
  return (
    <div className="min-h-screen bg-white">
      <main className="container mx-auto px-4 py-16 max-w-4xl">
        <h1 className="text-4xl font-bold text-center mb-8 text-gray-900">Términos y Condiciones de Uso</h1>

        <div className="prose prose-lg mx-auto">
          <p className="text-gray-700">
            Fecha de última actualización: 14 de abril de 2025
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4 text-gray-900">1. Introducción</h2>
          <p className="text-gray-700">
            Bienvenido a Dentaxy, una plataforma desarrollada por Dental Basics Academy diseñada para generar redacciones de historias clínicas odontológicas a partir de formularios seleccionables. Al acceder o utilizar Dentaxy, usted acepta regirse por los presentes Términos y Condiciones. Si no está de acuerdo con alguna parte de estos términos, le solicitamos no utilizar la Plataforma.
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4 text-gray-900">2. Definiciones</h2>
          <p className="text-gray-700">
            <strong>Plataforma:</strong> Se refiere a la aplicación web Dentaxy y todos sus componentes funcionales.<br />
            <strong>Usuario:</strong> Cualquier persona que acceda, cree una cuenta o utilice los servicios ofrecidos por Dentaxy.<br />
            <strong>Contenido:</strong> Texto, imágenes, datos, información, redacciones clínicas generadas, archivos PDF y cualquier otro material mostrado o generado por la Plataforma.
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4 text-gray-900">3. Uso del Servicio</h2>
          <p className="text-gray-700">
            3.1. La Plataforma está destinada exclusivamente a profesionales del área odontológica con fines educativos o clínicos.<br />
            3.2. Usted es responsable de mantener la confidencialidad de las credenciales de su cuenta.<br />
            3.3. Usted se compromete a no utilizar la Plataforma para actividades ilícitas, fraudulentas o que infrinjan derechos de terceros.<br />
            3.4. Usted entiende que el contenido generado por Dentaxy es una asistencia redactora basada en sus propias selecciones y no sustituye el juicio profesional clínico.
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4 text-gray-900">4. Privacidad y Manejo de Datos</h2>
          <p className="text-gray-700">
            4.1. No almacenamos ninguna información ingresada en los formularios. Dentaxy no guarda datos clínicos, personales ni formularios completados en nuestros servidores. Todo el contenido generado vive únicamente en el navegador del usuario.<br />
            4.2. Almacenamiento local: La función para "guardar formularios" se basa en el almacenamiento local del navegador (cookies o almacenamiento local). Esto significa que los datos solo están disponibles en el mismo dispositivo y navegador desde el cual fueron guardados. Si el usuario accede desde otro dispositivo, incluso con la misma cuenta, dichos datos no estarán disponibles.<br />
            4.3. Responsabilidad sobre los archivos generados: Los archivos PDF generados mediante la Plataforma son responsabilidad exclusiva del Usuario. Dentaxy no almacena ni respalda estos archivos. Le corresponde al Usuario descargar, almacenar y proteger dichos documentos según las normativas legales de su país o región, especialmente en lo relativo al manejo de datos sensibles y confidenciales.<br />
            4.4. El Usuario debe asegurarse de contar con el consentimiento adecuado de los pacientes antes de utilizar la Plataforma para redactar historias clínicas.
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4 text-gray-900">5. Propiedad Intelectual</h2>
          <p className="text-gray-700">
            5.1. Todos los derechos de propiedad intelectual sobre la Plataforma, su diseño, código, nombre y logotipos pertenecen a Dental Basics Academy.<br />
            5.2. El Usuario no podrá copiar, modificar, distribuir o crear trabajos derivados de la Plataforma sin autorización expresa.
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4 text-gray-900">6. Limitación de Responsabilidad</h2>
          <p className="text-gray-700">
            6.1. La Plataforma se proporciona “tal cual” y “según disponibilidad”, sin ninguna garantía expresa o implícita sobre su funcionamiento ininterrumpido o libre de errores.<br />
            6.2. Dentaxy y Dental Basics Academy no serán responsables por pérdidas de datos, interrupciones en el servicio, ni daños indirectos derivados del uso o imposibilidad de uso de la Plataforma.<br />
            6.3. La generación automática de redacciones no implica validación clínica. La revisión final del contenido corresponde exclusivamente al Usuario.
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4 text-gray-900">7. Cambios en los Términos</h2>
          <p className="text-gray-700">
            Nos reservamos el derecho de modificar estos Términos en cualquier momento. Le notificaremos sobre cambios sustanciales mediante un aviso en la Plataforma o por correo electrónico. Su uso continuado tras dichas modificaciones implica la aceptación de los nuevos términos.
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4 text-gray-900">8. Contacto</h2>
          <p className="text-gray-700">
            Si tiene dudas o consultas sobre estos Términos y Condiciones, puede escribirnos a:<br />
            <a href="mailto:dentalbasicsacademy@dentaxy.com" className="text-blue-600 hover:underline">dentalbasicsacademy@dentaxy.com</a>
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
