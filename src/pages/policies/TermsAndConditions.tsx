import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../../components/ui/button';

const TermsAndConditions = () => {
  return (
    <div className="min-h-screen bg-white">
      <main className="container mx-auto px-4 py-16 max-w-4xl">
        <div className="text-center mb-10">
          <span className="inline-block bg-blue-50 text-blue-700 text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full mb-4">Documento Legal</span>
          <h1 className="text-4xl font-bold text-gray-900">Términos y Condiciones de Uso</h1>
          <p className="text-gray-400 mt-2 text-sm">Fecha de última actualización: 15 de mayo de 2025</p>
        </div>

        <div className="prose prose-lg mx-auto space-y-2">

          {/* SECCIÓN 1 */}
          <h2 className="text-2xl font-semibold mt-10 mb-3 text-gray-900">1. Identificación del Titular</h2>
          <p className="text-gray-700">
            <strong>Dentaxy Technologies</strong> (en adelante, "Dentaxy", "la Empresa" o "nosotros") es una empresa de tecnología en salud con domicilio en la República Mexicana, operadora de la plataforma <strong>Dentaxy.com</strong> y sus productos derivados, incluyendo <strong>Dentaxy Seed</strong> y <strong>Dentaxy Shop</strong>.
          </p>
          <p className="text-gray-700">
            Al acceder, registrarse o utilizar cualquier servicio de Dentaxy, el usuario (en adelante, "el Usuario" o "el Doctor") acepta plena y vinculantemente los presentes Términos y Condiciones. Si no está de acuerdo con alguno de estos términos, debe abstenerse de utilizar la Plataforma.
          </p>

          {/* SECCIÓN 2 */}
          <h2 className="text-2xl font-semibold mt-10 mb-3 text-gray-900">2. Descripción del Servicio</h2>
          <p className="text-gray-700">
            Dentaxy es una plataforma de gestión clínica odontológica que provee, entre otros servicios:
          </p>
          <ul className="list-disc ml-6 text-gray-700 space-y-1">
            <li>Un motor de redacción de historias clínicas basado en lógica determinista local (sin inteligencia artificial generativa externa ni envío de datos a APIs de terceros para generación de texto).</li>
            <li>Sincronización voluntaria con servicios de Google (Google Drive™ y Google Calendar™) mediante autenticación OAuth 2.0, con permisos explícitos del Usuario.</li>
            <li>Gestión de agenda, expedientes digitales y módulos de apoyo a la práctica odontológica profesional.</li>
            <li>Funcionalidades educativas para estudiantes y clínicas académicas (Dentaxy Seed).</li>
          </ul>
          <p className="text-gray-700 mt-2">
            El servicio está dirigido exclusivamente a profesionales de la salud bucodental y/o instituciones educativas del área odontológica, mayores de 18 años, con cédula profesional vigente o en proceso de obtención bajo supervisión institucional.
          </p>

          {/* SECCIÓN 3 */}
          <h2 className="text-2xl font-semibold mt-10 mb-3 text-gray-900">3. Registro y Cuenta de Usuario</h2>
          <p className="text-gray-700">
            3.1. El acceso a las funciones avanzadas de Dentaxy requiere la creación de una cuenta mediante autenticación con Google (Google OAuth 2.0). Al hacerlo, el Usuario autoriza a Dentaxy a acceder a su nombre, correo electrónico y foto de perfil, exclusivamente para personalizar su espacio de trabajo.<br /><br />
            3.2. El Usuario es el único responsable de la seguridad de su cuenta de Google y de las actividades realizadas bajo su sesión en Dentaxy.<br /><br />
            3.3. Dentaxy no almacena ni tiene acceso a las contraseñas de Google del Usuario. La autenticación es gestionada íntegramente por Google Identity Services.<br /><br />
            3.4. El Usuario puede revocar el acceso de Dentaxy a su cuenta de Google en cualquier momento desde la configuración de seguridad de su cuenta de Google (<a href="https://myaccount.google.com/permissions" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">myaccount.google.com/permissions</a>).
          </p>

          {/* SECCIÓN 4 */}
          <h2 className="text-2xl font-semibold mt-10 mb-3 text-gray-900">4. Uso de Servicios de Google</h2>
          <p className="text-gray-700">
            Dentaxy utiliza las siguientes APIs de Google bajo consentimiento explícito del Usuario:
          </p>
          <ul className="list-disc ml-6 text-gray-700 space-y-2">
            <li><strong>Google Drive API</strong> (scope: <code className="bg-gray-100 px-1 rounded">drive.file</code>): Permite a Dentaxy crear, leer y modificar únicamente los archivos generados por la propia plataforma dentro de la cuenta de Drive del Usuario. Dentaxy <strong>no puede acceder</strong> a archivos preexistentes en el Drive del Usuario.</li>
            <li><strong>Google Calendar API</strong> (scope: <code className="bg-gray-100 px-1 rounded">calendar.events</code>): Permite a Dentaxy crear y gestionar eventos en el calendario del Usuario para la agenda de consultas. El Usuario puede revocar este permiso en cualquier momento.</li>
            <li><strong>Google People API</strong> (scope: <code className="bg-gray-100 px-1 rounded">userinfo.profile</code>, <code className="bg-gray-100 px-1 rounded">userinfo.email</code>): Permite obtener el nombre, correo y foto de perfil del Usuario para su identificación dentro de la plataforma.</li>
          </ul>
          <p className="text-gray-700 mt-2">
            El uso que Dentaxy hace de la información recibida de las APIs de Google se limita estrictamente a proveer las funcionalidades descritas. Dentaxy no utiliza estos datos para publicidad, perfilamiento de usuarios, ni los comparte con terceros. El uso de la información obtenida a través de las APIs de Google cumple con la <a href="https://developers.google.com/terms/api-services-user-data-policy" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">Política de Datos de Usuario de Google API Services</a>, incluyendo los requisitos de Uso Limitado.
          </p>

          {/* SECCIÓN 5 */}
          <h2 className="text-2xl font-semibold mt-10 mb-3 text-gray-900">5. Propiedad de los Datos Clínicos</h2>
          <p className="text-gray-700">
            5.1. <strong>Los expedientes clínicos pertenecen exclusivamente al Usuario.</strong> Dentaxy actúa como herramienta de organización y generación, pero nunca como propietario, custodio ni procesador de los datos de los pacientes del Usuario.<br /><br />
            5.2. Los datos de los formularios clínicos se procesan localmente en el navegador del Usuario mediante lógica determinista. No se transmiten a servidores de Dentaxy ni a APIs de inteligencia artificial externas para su generación de texto.<br /><br />
            5.3. Cuando el Usuario elige guardar un expediente en Google Drive, este archivo es almacenado directamente en la cuenta de Drive del Usuario, bajo su control y propiedad exclusiva. Dentaxy no conserva copia alguna de dicho expediente en sus servidores.<br /><br />
            5.4. El Usuario es el único responsable de cumplir con la normativa de protección de datos de sus pacientes (incluyendo, sin limitarse, la Ley Federal de Protección de Datos Personales en Posesión de los Particulares en México, el Reglamento General de Protección de Datos de la UE, o la normativa aplicable en su país), y de obtener el consentimiento informado de sus pacientes para el uso de herramientas digitales en la gestión de su expediente.
          </p>

          {/* SECCIÓN 6 */}
          <h2 className="text-2xl font-semibold mt-10 mb-3 text-gray-900">6. Limitación de Responsabilidad Médica</h2>
          <p className="text-gray-700">
            6.1. Dentaxy es una herramienta de apoyo administrativo y redactora. <strong>No es un dispositivo médico, no emite diagnósticos clínicos y no sustituye el juicio profesional del dentista.</strong><br /><br />
            6.2. Las redacciones generadas por el motor determinista de Dentaxy se basan únicamente en las selecciones realizadas por el Usuario en los formularios. La responsabilidad clínica, legal y ética del contenido del expediente recae íntegramente en el profesional de la salud que lo genera y firma.<br /><br />
            6.3. Dentaxy Technologies no asume ninguna responsabilidad por errores, omisiones o imprecisiones en los expedientes clínicos resultantes del uso de la plataforma, ni por consecuencias derivadas de decisiones clínicas basadas en dichos documentos.
          </p>

          {/* SECCIÓN 7 */}
          <h2 className="text-2xl font-semibold mt-10 mb-3 text-gray-900">7. Propiedad Intelectual</h2>
          <p className="text-gray-700">
            7.1. Todos los derechos de propiedad intelectual sobre la Plataforma, su diseño, código fuente, algoritmos, nombre comercial, logotipos, marcas y contenidos de interfaz pertenecen exclusivamente a Dentaxy Technologies.<br /><br />
            7.2. Queda prohibida la reproducción, copia, distribución, ingeniería inversa, creación de obras derivadas o cualquier otro uso de la Plataforma o sus componentes sin autorización escrita de Dentaxy Technologies.<br /><br />
            7.3. El Usuario retiene todos los derechos sobre el contenido clínico que genera mediante el uso de la Plataforma.
          </p>

          {/* SECCIÓN 8 */}
          <h2 className="text-2xl font-semibold mt-10 mb-3 text-gray-900">8. Limitación General de Responsabilidad</h2>
          <p className="text-gray-700">
            8.1. La Plataforma se proporciona "tal cual" y "según disponibilidad". Dentaxy Technologies no garantiza la disponibilidad ininterrumpida del servicio ni la ausencia de errores.<br /><br />
            8.2. En ningún caso Dentaxy Technologies será responsable por daños directos, indirectos, incidentales, especiales, consecuentes o punitivos que resulten del uso o la imposibilidad de uso de la Plataforma, incluyendo pérdida de datos o lucro cesante, aun cuando se hubiera advertido de la posibilidad de dichos daños.<br /><br />
            8.3. La responsabilidad total acumulada de Dentaxy Technologies hacia el Usuario no superará el monto pagado por el Usuario a Dentaxy en los doce (12) meses anteriores al evento que originó el reclamo.
          </p>

          {/* SECCIÓN 9 */}
          <h2 className="text-2xl font-semibold mt-10 mb-3 text-gray-900">9. Conducta Prohibida</h2>
          <p className="text-gray-700">
            El Usuario se compromete a no:
          </p>
          <ul className="list-disc ml-6 text-gray-700 space-y-1">
            <li>Usar la Plataforma para actividades ilegales, fraudulentas o que infrinjan derechos de terceros.</li>
            <li>Intentar acceder de forma no autorizada a sistemas, cuentas o datos de otros usuarios.</li>
            <li>Cargar, transmitir o difundir contenido malicioso, ofensivo o que viole derechos de privacidad.</li>
            <li>Revender, sublicenciar o explotar comercialmente la Plataforma sin autorización.</li>
            <li>Realizar ingeniería inversa o intentar extraer el código fuente de la Plataforma.</li>
          </ul>
          <p className="text-gray-700 mt-2">
            El incumplimiento de esta sección puede resultar en la suspensión o cancelación inmediata de la cuenta del Usuario, sin perjuicio de las acciones legales que procedan.
          </p>

          {/* SECCIÓN 10 */}
          <h2 className="text-2xl font-semibold mt-10 mb-3 text-gray-900">10. Modificaciones al Servicio y a los Términos</h2>
          <p className="text-gray-700">
            Dentaxy Technologies se reserva el derecho de modificar, suspender o descontinuar cualquier aspecto de la Plataforma en cualquier momento. Nos reservamos igualmente el derecho de actualizar los presentes Términos y Condiciones. Los cambios sustanciales serán notificados mediante un aviso en la Plataforma o por correo electrónico con al menos 15 días de anticipación. El uso continuado de la Plataforma tras la publicación de los cambios implica la aceptación de los nuevos términos.
          </p>

          {/* SECCIÓN 11 */}
          <h2 className="text-2xl font-semibold mt-10 mb-3 text-gray-900">11. Legislación Aplicable y Resolución de Disputas</h2>
          <p className="text-gray-700">
            Los presentes Términos y Condiciones se rigen por las leyes de los Estados Unidos Mexicanos. Cualquier controversia que surja del uso de la Plataforma o de la interpretación de estos Términos será sometida a la jurisdicción de los tribunales competentes del Estado de Zacatecas, México, renunciando el Usuario a cualquier otro fuero que pudiera corresponderle por razón de su domicilio presente o futuro.
          </p>

          {/* SECCIÓN 12 */}
          <h2 className="text-2xl font-semibold mt-10 mb-3 text-gray-900">12. Contacto Legal</h2>
          <p className="text-gray-700">
            Para consultas, solicitudes legales, ejercicio de derechos o reportes de incidencias relacionadas con estos Términos y Condiciones, comuníquese con nosotros a través de:<br /><br />
            📧 <a href="mailto:legal@dentaxy.com" className="text-blue-600 underline font-medium">legal@dentaxy.com</a><br />
            🌐 <a href="https://dentaxy.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">dentaxy.com</a>
          </p>

          <div className="text-center mt-14 pb-4">
            <Link to="/">
              <Button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl">
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
