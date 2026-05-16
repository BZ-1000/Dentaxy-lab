import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../../components/ui/button';

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-white">
      <main className="container mx-auto px-4 py-16 max-w-4xl">
        <div className="text-center mb-10">
          <span className="inline-block bg-emerald-50 text-emerald-700 text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full mb-4">Documento Legal</span>
          <h1 className="text-4xl font-bold text-gray-900">Política de Privacidad</h1>
          <p className="text-gray-400 mt-2 text-sm">Fecha de última actualización: 15 de mayo de 2025</p>
        </div>

        <div className="prose prose-lg mx-auto space-y-2">

          {/* INTRODUCCIÓN */}
          <h2 className="text-2xl font-semibold mt-10 mb-3 text-gray-900">1. Quiénes Somos</h2>
          <p className="text-gray-700">
            <strong>Dentaxy Technologies</strong> opera la plataforma <strong>Dentaxy.com</strong> y sus productos (Dentaxy Seed, Dentaxy Shop), con domicilio en la República Mexicana. Esta Política de Privacidad describe cómo recopilamos, usamos, almacenamos y protegemos la información personal del Usuario, en cumplimiento de la Ley Federal de Protección de Datos Personales en Posesión de los Particulares (LFPDPPP) de México, el Reglamento General de Protección de Datos de la Unión Europea (GDPR) y la normativa aplicable en otras jurisdicciones.
          </p>

          {/* DATOS QUE RECOPILAMOS */}
          <h2 className="text-2xl font-semibold mt-10 mb-3 text-gray-900">2. Información que Recopilamos</h2>

          <h3 className="text-lg font-semibold mt-6 mb-2 text-gray-800">2.1. Información de Autenticación (Google OAuth 2.0)</h3>
          <p className="text-gray-700">
            Cuando el Usuario inicia sesión con su cuenta de Google, obtenemos la siguiente información mínima necesaria:
          </p>
          <ul className="list-disc ml-6 text-gray-700 space-y-1">
            <li>Nombre completo y foto de perfil (para personalizar la interfaz)</li>
            <li>Correo electrónico (para identificación única y comunicaciones de servicio)</li>
            <li>Token de acceso temporal para las APIs de Google autorizadas por el Usuario</li>
          </ul>
          <p className="text-gray-700 mt-2">
            Esta información se obtiene exclusivamente mediante el protocolo OAuth 2.0 de Google. Dentaxy <strong>nunca</strong> tiene acceso a la contraseña de Google del Usuario.
          </p>

          <h3 className="text-lg font-semibold mt-6 mb-2 text-gray-800">2.2. Datos Clínicos</h3>
          <p className="text-gray-700">
            Dentaxy ha sido diseñado bajo un principio de <strong>privacidad por arquitectura</strong>. El motor de redacción de historias clínicas opera íntegramente en el navegador del Usuario mediante lógica determinista local (JavaScript). <strong>Ningún dato clínico, formulario completado, ni información de pacientes es transmitido a los servidores de Dentaxy Technologies ni a APIs de terceros para su procesamiento.</strong>
          </p>
          <p className="text-gray-700 mt-2">
            Cuando el Usuario guarda un expediente en Google Drive, el archivo se transfiere directamente desde el navegador del Usuario a su propia cuenta de Google Drive, sin pasar por ni ser almacenado en los servidores de Dentaxy.
          </p>

          <h3 className="text-lg font-semibold mt-6 mb-2 text-gray-800">2.3. Datos de Uso Anónimos</h3>
          <p className="text-gray-700">
            Utilizamos servicios de analítica (Vercel Analytics) para recopilar información técnica anónima y agregada sobre el uso de la plataforma, tales como: tipo de dispositivo, navegador, duración de sesión, páginas visitadas. Esta información no está vinculada a la identidad del Usuario ni a datos clínicos.
          </p>

          <h3 className="text-lg font-semibold mt-6 mb-2 text-gray-800">2.4. Datos de Agenda (Google Calendar)</h3>
          <p className="text-gray-700">
            Si el Usuario autoriza el acceso a Google Calendar, Dentaxy podrá crear eventos de citas en el calendario del Usuario. Esta funcionalidad es opcional y el Usuario puede revocarla en cualquier momento. Dentaxy no almacena en sus servidores los eventos creados en Google Calendar.
          </p>

          {/* USO DE LA INFORMACIÓN */}
          <h2 className="text-2xl font-semibold mt-10 mb-3 text-gray-900">3. Uso de la Información</h2>
          <p className="text-gray-700">Utilizamos la información recopilada exclusivamente para:</p>
          <ul className="list-disc ml-6 text-gray-700 space-y-1">
            <li>Autenticar al Usuario y personalizar su experiencia en la plataforma</li>
            <li>Proveer las funcionalidades de sincronización con Google Drive y Google Calendar (solo si el Usuario lo autoriza)</li>
            <li>Enviar comunicaciones de servicio esenciales (actualizaciones de términos, seguridad)</li>
            <li>Mejorar la estabilidad, rendimiento y funcionalidades de la plataforma</li>
            <li>Cumplir con obligaciones legales aplicables</li>
          </ul>
          <p className="text-gray-700 mt-2">
            <strong>Dentaxy NO utiliza los datos del Usuario para:</strong> publicidad de terceros, perfilamiento comercial, venta de datos, entrenamiento de modelos de inteligencia artificial, ni ningún otro propósito no descrito en esta Política.
          </p>

          {/* USO DE APIs DE GOOGLE */}
          <h2 className="text-2xl font-semibold mt-10 mb-3 text-gray-900">4. Uso de las APIs de Google — Política de Uso Limitado</h2>
          <p className="text-gray-700">
            El uso por parte de Dentaxy de la información recibida de las APIs de Google cumple con la <a href="https://developers.google.com/terms/api-services-user-data-policy" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">Política de Datos de Usuario de Google API Services</a>, incluyendo los requisitos de Uso Limitado (<em>Limited Use</em>). Específicamente:
          </p>
          <ul className="list-disc ml-6 text-gray-700 space-y-2">
            <li>El acceso a los datos de Google del Usuario se limita a los <strong>permisos (scopes) que el Usuario otorga explícitamente</strong> durante el proceso de autenticación.</li>
            <li>Los datos de Google no se utilizan para desarrollar, mejorar o entrenar aplicaciones de IA generativa.</li>
            <li>Los datos de Google no se transfieren a terceros, salvo cuando sea estrictamente necesario para proveer el servicio solicitado por el Usuario.</li>
            <li>Los tokens de acceso a las APIs de Google se almacenan de forma segura y temporal en el dispositivo del Usuario (localStorage cifrado), y nunca en los servidores de Dentaxy.</li>
          </ul>

          {/* COMPARTICIÓN */}
          <h2 className="text-2xl font-semibold mt-10 mb-3 text-gray-900">5. Compartición de Datos con Terceros</h2>
          <p className="text-gray-700">
            5.1. <strong>No vendemos, alquilamos ni compartimos</strong> información personal del Usuario con terceros con fines comerciales.<br /><br />
            5.2. Trabajamos con los siguientes proveedores de servicios bajo estrictos acuerdos de confidencialidad y únicamente en la medida necesaria para operar la plataforma:
          </p>
          <ul className="list-disc ml-6 text-gray-700 space-y-1">
            <li><strong>Supabase</strong> (base de datos y autenticación) — <a href="https://supabase.com/privacy" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">Política de privacidad</a></li>
            <li><strong>Vercel</strong> (alojamiento y analítica) — <a href="https://vercel.com/legal/privacy-policy" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">Política de privacidad</a></li>
            <li><strong>Google LLC</strong> (autenticación, Drive y Calendar) — <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">Política de privacidad</a></li>
          </ul>
          <p className="text-gray-700 mt-2">
            5.3. Podremos divulgar información si así lo exige la ley, una orden judicial firme o un proceso legal válido, notificando al Usuario cuando sea legalmente posible.
          </p>

          {/* SEGURIDAD */}
          <h2 className="text-2xl font-semibold mt-10 mb-3 text-gray-900">6. Seguridad de la Información</h2>
          <p className="text-gray-700">
            Dentaxy implementa medidas técnicas y organizativas adecuadas para proteger la información del Usuario, incluyendo:
          </p>
          <ul className="list-disc ml-6 text-gray-700 space-y-1">
            <li>Transmisión de datos cifrada mediante HTTPS/TLS en todo momento</li>
            <li>Autenticación delegada a Google OAuth 2.0 (sin almacenamiento de contraseñas)</li>
            <li>Tokens de acceso con tiempo de expiración limitado y permisos de alcance mínimo (<em>least-privilege scopes</em>)</li>
            <li>Arquitectura de privacidad por diseño: los datos clínicos no salen del navegador del Usuario</li>
            <li>Monitoreo de accesos y políticas de seguridad de base de datos mediante Row Level Security (RLS) en Supabase</li>
          </ul>
          <p className="text-gray-700 mt-2">
            A pesar de estas medidas, ningún sistema de transmisión o almacenamiento de datos puede garantizar seguridad absoluta. El Usuario acepta que Dentaxy no puede garantizar la seguridad total de su información.
          </p>

          {/* RETENCIÓN */}
          <h2 className="text-2xl font-semibold mt-10 mb-3 text-gray-900">7. Retención de Datos</h2>
          <p className="text-gray-700">
            Los datos personales mínimos del Usuario (nombre, correo) se conservan mientras la cuenta esté activa o hasta que el Usuario solicite su eliminación. Los tokens de acceso a las APIs de Google tienen vigencia limitada y se actualizan automáticamente. Los expedientes clínicos guardados en Google Drive son propiedad del Usuario y permanecen bajo su control exclusivo; Dentaxy no conserva copias de estos archivos.
          </p>

          {/* DERECHOS */}
          <h2 className="text-2xl font-semibold mt-10 mb-3 text-gray-900">8. Derechos del Usuario (ARCO)</h2>
          <p className="text-gray-700">
            De conformidad con la LFPDPPP y el GDPR, el Usuario tiene derecho a:
          </p>
          <ul className="list-disc ml-6 text-gray-700 space-y-1">
            <li><strong>Acceso:</strong> conocer qué datos personales tenemos sobre usted</li>
            <li><strong>Rectificación:</strong> corregir datos inexactos o incompletos</li>
            <li><strong>Cancelación / Supresión:</strong> solicitar la eliminación de sus datos personales</li>
            <li><strong>Oposición:</strong> oponerse al tratamiento de sus datos en casos específicos</li>
            <li><strong>Portabilidad:</strong> recibir sus datos en formato estructurado (cuando aplique)</li>
            <li><strong>Revocar el consentimiento:</strong> retirar en cualquier momento el acceso a sus cuentas de Google</li>
          </ul>
          <p className="text-gray-700 mt-2">
            Para ejercer cualquiera de estos derechos, envíe su solicitud a <a href="mailto:legal@dentaxy.com" className="text-blue-600 underline font-medium">legal@dentaxy.com</a>. Responderemos en un plazo máximo de 20 días hábiles.
          </p>

          {/* MENORES */}
          <h2 className="text-2xl font-semibold mt-10 mb-3 text-gray-900">9. Menores de Edad</h2>
          <p className="text-gray-700">
            Dentaxy no está dirigido a menores de 18 años. No recopilamos intencionalmente información personal de menores. Si identificamos que un menor ha creado una cuenta sin autorización, eliminaremos su información de forma inmediata.
          </p>

          {/* CAMBIOS */}
          <h2 className="text-2xl font-semibold mt-10 mb-3 text-gray-900">10. Cambios a esta Política</h2>
          <p className="text-gray-700">
            Podemos actualizar esta Política de Privacidad ocasionalmente. Notificaremos los cambios importantes mediante un aviso en la plataforma y/o correo electrónico con al menos 15 días de anticipación. La fecha de actualización al inicio del documento siempre reflejará la versión vigente.
          </p>

          {/* CONTACTO */}
          <h2 className="text-2xl font-semibold mt-10 mb-3 text-gray-900">11. Contacto del Responsable de Datos</h2>
          <p className="text-gray-700">
            Para consultas, solicitudes legales, ejercicio de derechos ARCO o reporte de incidencias de privacidad:<br /><br />
            📧 <a href="mailto:legal@dentaxy.com" className="text-blue-600 underline font-medium">legal@dentaxy.com</a><br />
            🌐 <a href="https://dentaxy.com/privacy" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">dentaxy.com/privacy</a><br /><br />
            <strong>Dentaxy Technologies</strong><br />
            República Mexicana
          </p>

          <div className="text-center mt-14 pb-4">
            <Link to="/">
              <Button className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-3 rounded-xl">
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
