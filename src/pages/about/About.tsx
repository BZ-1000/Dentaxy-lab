import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import BottomMenu from '@/components/BottomMenu';
import { FileText, Shield, Server, Key, MapPin, Box, Hand, ScanLine, FileOutput, Layers, GraduationCap, Building2, Stethoscope, Users, BookOpen, Target, Eye, Sparkles, User } from 'lucide-react';
const FeatureCard = ({
  icon: Icon,
  title,
  features
}: {
  icon: any;
  title: string;
  features: string[];
}) => <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
    <div className="flex items-center gap-3 mb-4">
      <div className="bg-blue-100 p-3 rounded-lg">
        <Icon className="h-6 w-6 text-blue-600" />
      </div>
      <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
    </div>
    <ul className="space-y-2">
      {features.map((feature, idx) => <li key={idx} className="text-gray-600 text-sm flex items-start gap-2">
          <span className="text-blue-500 mt-1">•</span>
          {feature}
        </li>)}
    </ul>
  </div>;
const AudienceCard = ({
  icon: Icon,
  title
}: {
  icon: any;
  title: string;
}) => <div className="flex items-center gap-3 bg-white p-4 rounded-lg shadow-sm border border-gray-100">
    <Icon className="h-5 w-5 text-blue-600" />
    <span className="text-gray-700 font-medium">{title}</span>
  </div>;
const About = () => {
  const capabilities = [{
    icon: FileText,
    title: "1. Formularios interactivos personalizados",
    features: ["Formularios clínicos inteligentes que se adaptan al paciente", "Integración de IA para autocompletar campos y analizar riesgos", "Opciones multirol para estudiantes, docentes y especialistas", "Optimización para investigación académica y seguimiento longitudinal"]
  }, {
    icon: Users,
    title: "2. Plataforma con roles y control granular",
    features: ["Roles diferenciados para doctores, especialistas, pasantes, docentes y administrativos", "Registro de auditoría digital", "Acceso basado en necesidad y nivel de responsabilidad"]
  }, {
    icon: Server,
    title: "3. Servidores privados y arquitectura empresarial",
    features: ["Infraestructura escalable para universidades y clínicas con alto tráfico", "Back-end redundante, rápido y con protocolos avanzados de seguridad"]
  }, {
    icon: Key,
    title: "4. Cifrado empresarial con YubiKey",
    features: ["Integración con llaves de hardware (YubiKey)", "Autenticación multifactor biométrica", "Autorizaciones por proximidad o presencia física", "Perfecto para clínicas con información sensible o pacientes VIP"]
  }, {
    icon: MapPin,
    title: "5. Acceso geolocalizado (Access by Location)",
    features: ["La aplicación solo se desbloquea dentro de zonas autorizadas", "Ideal para proteger historiales, estudios radiográficos y documentos oficiales"]
  }, {
    icon: Box,
    title: "6. Visualizador avanzado de escaneos 3D",
    features: ["Lectura de archivos dentales STL, PLY y OBJ", "Manipulación en tiempo real", "Compatibilidad con escáneres de distintas marcas"]
  }, {
    icon: Hand,
    title: "7. Visualizador por gestos (Top Secret)",
    features: ["Control del modelo 3D sin tocar teclado o mouse", "Reconocimiento de gestos de la mano para rotar, acercar, cortar", "Ideal para docentes, cirujanos y exposiciones académicas"]
  }, {
    icon: ScanLine,
    title: "8. Visualizador de tomografías (CBCT/DICOM)",
    features: ["Lectura y renderizado de archivos DICOM", "Herramientas clínicas: cortes axiales, coronales y sagitales", "Ajustes de densidad (HU), zoom, contraste y mediciones precisas"]
  }, {
    icon: FileOutput,
    title: "9. Generador automático de reportes PDF",
    features: ["Redacción profesional automatizada", "Plantillas para clínicas, universidades y casos académicos", "Integración de imágenes, tomas radiográficas y datos clínicos"]
  }, {
    icon: Layers,
    title: "10. Ecosistema completo y escalable",
    features: ["Integración con apps móviles", "Panel administrativo para instituciones grandes", "APIs para conectar con sistemas universitarios existentes", "Seguridad y auditorías para información clasificada"]
  }];
  const audience = [{
    icon: GraduationCap,
    title: "Universidades y facultades de odontología"
  }, {
    icon: Building2,
    title: "Clínicas privadas y corporativos de salud"
  }, {
    icon: Stethoscope,
    title: "Centros de especialidades"
  }, {
    icon: BookOpen,
    title: "Docentes, investigadores y especialistas"
  }, {
    icon: Shield,
    title: "Instituciones que requieren seguridad avanzada"
  }];
  return <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white" itemScope itemType="https://schema.org/Organization">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <Link to="/" className="flex items-center gap-2">
          <img alt="Logo DENTAXY" src="/lovable-uploads/3236de6d-a3e4-4b81-9c83-b32690d4212d.png" className="h-8 w-8" />
          <span className="text-sm font-bold text-gray-800">DENTAXY Technologies</span>
        </Link>
        
        <Link to="/">
          <Button variant="ghost" className="text-sm">Volver al inicio</Button>
        </Link>
      </header>
      
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 max-w-6xl">
        <meta itemProp="name" content="Dentaxy Technologies" />
        <meta itemProp="url" content="https://dentaxy.com" />
        <meta itemProp="logo" content="https://dentaxy.com/lovable-uploads/3236de6d-a3e4-4b81-9c83-b32690d4212d.png" />
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6" itemProp="legalName">
            DENTAXY Technologies
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto" itemProp="slogan">
            Innovación odontológica mexicana especializada en soluciones digitales avanzadas
          </p>
        </div>

        {/* ¿Quiénes somos? */}
        <article className="bg-white rounded-2xl shadow-sm p-8 mb-8 border border-gray-100">
          <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-blue-600" />
            ¿Quiénes somos?
          </h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            Dentaxy Technologies es una empresa mexicana de innovación odontológica especializada en el desarrollo de soluciones digitales avanzadas, diseñadas para transformar la forma en que universidades, clínicas y profesionales gestionan, analizan y operan dentro del campo de la salud dental.
          </p>
          <p className="text-gray-700 leading-relaxed mb-4">
            Nacimos con la visión de integrar en un solo ecosistema herramientas inteligentes que aumenten la calidad clínica, potencien la productividad y modernicen la experiencia del paciente y del profesional.
          </p>
          <p className="text-gray-600 italic">
            Nuestro enfoque combina ingeniería de software, ciberseguridad, IA aplicada a la odontología, sistemas de visualización médica y tecnologías biométricas de acceso.
          </p>
        </article>

        {/* Misión y Visión */}
        <div className="grid md:grid-cols-2 gap-6 mb-12">
          <article className="bg-blue-50 rounded-2xl p-8 border border-blue-100">
            <div className="flex items-center gap-3 mb-4">
              <Target className="h-8 w-8 text-blue-600" />
              <h2 className="text-2xl font-bold text-blue-800">Nuestra Misión</h2>
            </div>
            <p className="text-gray-700 leading-relaxed">
              Crear una plataforma centralizada, segura y tecnológicamente superior que permita a los profesionales y estudiantes de odontología trabajar con herramientas modernas, eficientes y alineadas a los estándares clínicos más altos.
            </p>
          </article>

          <article className="bg-purple-50 rounded-2xl p-8 border border-purple-100">
            <div className="flex items-center gap-3 mb-4">
              <Eye className="h-8 w-8 text-purple-600" />
              <h2 className="text-2xl font-bold text-purple-800">Nuestra Visión</h2>
            </div>
            <p className="text-gray-700 leading-relaxed">
              Convertirnos en el principal referente tecnológico odontológico de Latinoamérica, colaborando con universidades, clínicas y centros de investigación para impulsar una nueva generación de servicios digitales especializados.
            </p>
          </article>
        </div>

        {/* ¿Qué hace única a Dentaxy? */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">
            ¿Qué hace única a Dentaxy Technologies?
          </h2>
          <p className="text-center text-gray-600 mb-10 max-w-3xl mx-auto">
            Integramos un conjunto de tecnologías diseñadas para cubrir todas las necesidades digitales de una institución odontológica moderna.
          </p>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {capabilities.map((cap, idx) => <FeatureCard key={idx} icon={cap.icon} title={cap.title} features={cap.features} />)}
          </div>
        </section>

        {/* ¿Para quién? */}
        <section className="bg-gray-50 rounded-2xl p-8 mb-12">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
            ¿Para quién está hecha nuestra tecnología?
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {audience.map((item, idx) => <AudienceCard key={idx} icon={item.icon} title={item.title} />)}
          </div>
        </section>

        {/* Nuestro compromiso */}
        <article className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 mb-12 text-white">
          <h2 className="text-2xl font-bold mb-4">Nuestro Compromiso</h2>
          <p className="text-white/90 leading-relaxed text-lg">
            Aumentar la calidad de la educación odontológica, optimizar los procesos clínicos y elevar los estándares tecnológicos de las instituciones que confían en nosotros.
          </p>
        </article>

        {/* Dirección y liderazgo */}
        <article className="bg-white rounded-2xl shadow-sm p-8 border border-gray-100 mb-12" itemScope itemType="https://schema.org/Person">
          <div className="flex items-center gap-3 mb-4">
            <User className="h-8 w-8 text-blue-600" />
            <h2 className="text-2xl font-bold text-gray-800">Dirección y Liderazgo</h2>
          </div>
          <p className="text-gray-700 leading-relaxed mb-4">
            Dentaxy Technologies es dirigida por <strong itemProp="name">Braulio Zavala Uribe</strong>, <span itemProp="jobTitle">Founder</span> de la empresa. Es un desarrollador autodidacta y estudiante de MCD con una visión futurista sobre la odontología digital. Su enfoque está en diseñar tecnologías que anticipen las necesidades del sector dental en los próximos 10 a 15 años: sistemas de visualización tridimensional avanzada, infraestructura biométrica de seguridad, accesos basados en ubicación, interacción por gestos y herramientas de IA clínicamente útiles.
          </p>
          <p className="text-gray-600 italic" itemProp="description">
            Su liderazgo combina creatividad, pensamiento sistémico y profundo entendimiento de la evolución tecnológica, lo que impulsa a Dentaxy Technologies hacia la vanguardia del desarrollo en salud digital.
          </p>
          <a href="https://www.linkedin.com/in/braulio-zavala-6332393a7" target="_blank" rel="noopener noreferrer" itemProp="sameAs" className="inline-flex items-center gap-2 mt-4 text-blue-600 hover:text-blue-800 text-sm font-medium">
            Ver perfil en LinkedIn →
          </a>
          <meta itemProp="worksFor" content="Dentaxy Technologies" />
        </article>

        {/* Footer info */}
        <div className="text-center bg-gray-100 rounded-xl p-6">
          <p className="text-sm text-gray-600 font-medium">© 2025 Dentaxy.com - Todos los derechos reservados

DENTAXY Technologies<br />
            © 2025 Dentaxy.ai - Todos los derechos reservados<br />
            <span className="font-semibold">DENTAXY Technologies</span>
          </p>
        </div>
      </section>
      
      <BottomMenu />
    </div>;
};
export default About;