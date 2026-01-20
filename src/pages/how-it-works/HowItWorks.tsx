import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { 
  FileText, 
  Shield, 
  Server, 
  Key, 
  MapPin, 
  Box, 
  Hand, 
  ScanLine, 
  FileOutput, 
  Layers 
} from 'lucide-react';
import BottomMenu from '@/components/BottomMenu';

const TechnologyCard = ({ icon: Icon, number, title, description }: { 
  icon: any; 
  number: string;
  title: string; 
  description: string;
}) => (
  <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all hover:border-blue-200">
    <div className="flex items-start gap-4">
      <div className="flex-shrink-0">
        <div className="bg-gradient-to-br from-blue-500 to-purple-600 text-white w-10 h-10 rounded-lg flex items-center justify-center font-bold text-lg">
          {number}
        </div>
      </div>
      <div>
        <div className="flex items-center gap-2 mb-2">
          <Icon className="h-5 w-5 text-blue-600" />
          <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
        </div>
        <p className="text-gray-600 text-sm leading-relaxed">{description}</p>
      </div>
    </div>
  </div>
);

const HowItWorks = () => {
  const technologies = [
    {
      icon: FileText,
      number: "1",
      title: "Formularios interactivos personalizados",
      description: "Formularios clínicos inteligentes que se adaptan al paciente, con integración de IA para autocompletar campos, analizar riesgos y opciones multirol para estudiantes, docentes y especialistas."
    },
    {
      icon: Shield,
      number: "2",
      title: "Plataforma con roles y control granular",
      description: "Roles diferenciados para doctores, especialistas, pasantes, docentes y administrativos. Registro de auditoría digital con acceso basado en necesidad y nivel de responsabilidad."
    },
    {
      icon: Server,
      number: "3",
      title: "Servidores privados empresariales",
      description: "Infraestructura escalable para universidades y clínicas con alto tráfico. Back-end redundante, rápido y con protocolos avanzados de seguridad."
    },
    {
      icon: Key,
      number: "4",
      title: "Cifrado empresarial con YubiKey",
      description: "Integración con llaves de hardware (YubiKey), autenticación multifactor biométrica y autorizaciones por proximidad. Perfecto para clínicas con pacientes VIP."
    },
    {
      icon: MapPin,
      number: "5",
      title: "Acceso geolocalizado (Access by Location)",
      description: "La aplicación solo se desbloquea si el usuario se encuentra dentro de una zona autorizada (universidad, clínica, consultorio). Protección máxima para historiales sensibles."
    },
    {
      icon: Box,
      number: "6",
      title: "Visualizador avanzado de escaneos 3D",
      description: "Lectura de archivos dentales STL, PLY y OBJ. Manipulación en tiempo real con compatibilidad con escáneres de distintas marcas."
    },
    {
      icon: Hand,
      number: "7",
      title: "Visualizador (Top Secret)",
      description: "????"
    },
    {
      icon: ScanLine,
      number: "8",
      title: "Visualizador de tomografías (CBCT/DICOM)",
      description: "Lectura y renderizado de archivos DICOM. Herramientas clínicas con cortes axiales, coronales, sagitales. Ajustes de densidad, zoom y mediciones precisas."
    },
    {
      icon: FileOutput,
      number: "9",
      title: "Generador automático de reportes PDF",
      description: "Redacción profesional automatizada con plantillas para clínicas, universidades y casos académicos. Integración de imágenes y tomas radiográficas."
    },
    {
      icon: Layers,
      number: "10",
      title: "Ecosistema completo y escalable",
      description: "Integración con apps móviles, panel administrativo para instituciones grandes, APIs para sistemas universitarios y auditorías de seguridad."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
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
      
      {/* Main Content */}
      <main className="container mx-auto px-4 py-12 max-w-6xl">
        <section className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Nuestras Tecnologías
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Soluciones digitales avanzadas diseñadas para cubrir todas las necesidades de una institución odontológica moderna
          </p>
        </section>
        
        <section className="grid md:grid-cols-2 gap-6 mb-12">
          {technologies.map((tech, index) => (
            <TechnologyCard 
              key={index} 
              icon={tech.icon} 
              number={tech.number}
              title={tech.title} 
              description={tech.description} 
            />
          ))}
        </section>
        
        <section className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-center text-white mb-12">
          <h2 className="text-2xl font-bold mb-4">
            Tecnología diseñada para el futuro de la odontología
          </h2>
          <p className="text-white/90 mb-6 max-w-2xl mx-auto">
            Cada una de nuestras soluciones está pensada para anticipar las necesidades del sector dental en los próximos 10 a 15 años.
          </p>
          <Link to="/contact">
            <Button className="bg-white text-blue-600 hover:bg-gray-100">
              Contáctanos para más información
            </Button>
          </Link>
        </section>
        
        <div className="text-center">
          <Link to="/benefits">
            <Button className="bg-blue-600 hover:bg-blue-700 text-white mr-4">
              Ver beneficios
            </Button>
          </Link>
          <Link to="/about">
            <Button variant="outline" className="border-blue-600 text-blue-600 hover:bg-blue-50">
              Conoce más sobre nosotros
            </Button>
          </Link>
        </div>
      </main>
      
      <BottomMenu />
    </div>
  );
};

export default HowItWorks;
