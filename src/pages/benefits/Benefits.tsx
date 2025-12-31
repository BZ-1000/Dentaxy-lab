import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { 
  Zap, 
  Shield, 
  Globe, 
  Layers, 
  Sparkles, 
  Building2,
  GraduationCap,
  TrendingUp,
  Lock,
  Eye
} from 'lucide-react';
import BottomMenu from '@/components/BottomMenu';

const BenefitCard = ({
  icon: Icon,
  title,
  description
}: {
  icon: any;
  title: string;
  description: string;
}) => (
  <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all hover:border-blue-200">
    <div className="flex items-center mb-4">
      <div className="bg-gradient-to-br from-blue-500 to-purple-600 p-3 rounded-xl mr-4">
        <Icon className="h-6 w-6 text-white" />
      </div>
      <h3 className="text-xl font-semibold text-gray-800">{title}</h3>
    </div>
    <p className="text-gray-600 leading-relaxed">{description}</p>
  </div>
);

const Benefits = () => {
  const benefits = [
    {
      icon: Zap,
      title: "Productividad maximizada",
      description: "Reduce hasta un 70% el tiempo en documentación clínica con formularios inteligentes que se adaptan a cada paciente y autocompletado con IA."
    },
    {
      icon: Shield,
      title: "Seguridad de nivel empresarial",
      description: "Cifrado con YubiKey, autenticación biométrica y acceso geolocalizado para proteger información sensible de pacientes VIP."
    },
    {
      icon: Globe,
      title: "Acceso desde cualquier lugar",
      description: "Plataforma 100% en la nube con servidores redundantes que garantizan disponibilidad y acceso seguro desde cualquier dispositivo autorizado."
    },
    {
      icon: Layers,
      title: "Ecosistema completo",
      description: "Integración con apps móviles, APIs para sistemas universitarios, panel administrativo y visualizadores 3D de última generación."
    },
    {
      icon: Sparkles,
      title: "IA clínicamente útil",
      description: "Inteligencia artificial entrenada específicamente para odontología que genera redacciones profesionales y analiza riesgos automáticamente."
    },
    {
      icon: Building2,
      title: "Escalabilidad institucional",
      description: "Arquitectura diseñada para universidades, clínicas y corporativos de salud con alto tráfico y múltiples usuarios simultáneos."
    },
    {
      icon: GraduationCap,
      title: "Optimizado para educación",
      description: "Roles multiusuario para estudiantes, docentes y especialistas. Perfecto para investigación académica y seguimiento longitudinal."
    },
    {
      icon: Lock,
      title: "Control granular de acceso",
      description: "Permisos diferenciados por rol, registro de auditoría digital y acceso basado en necesidad y nivel de responsabilidad."
    },
    {
      icon: Eye,
      title: "Visualización avanzada",
      description: "Visualizadores de escaneos 3D, tomografías DICOM y control por gestos para presentaciones y procedimientos quirúrgicos."
    },
    {
      icon: TrendingUp,
      title: "Tecnología del futuro",
      description: "Soluciones diseñadas para anticipar las necesidades del sector dental en los próximos 10 a 15 años."
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
            Beneficios de DENTAXY Technologies
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Descubre cómo nuestras soluciones transforman la gestión odontológica en universidades, clínicas y centros de especialidades.
          </p>
        </section>
        
        <section className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {benefits.map((benefit, index) => (
            <BenefitCard 
              key={index} 
              icon={benefit.icon} 
              title={benefit.title} 
              description={benefit.description} 
            />
          ))}
        </section>
        
        <section className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white mb-12">
          <h2 className="text-2xl font-bold mb-4 text-center">
            Comprometidos con la excelencia odontológica
          </h2>
          <p className="text-center text-white/90 mb-6 max-w-2xl mx-auto">
            Dentaxy Technologies ha sido desarrollada con la visión de elevar los estándares tecnológicos de las instituciones odontológicas en Latinoamérica.
          </p>
          <div className="flex justify-center">
            <Link to="/contact">
              <Button className="bg-white text-blue-600 hover:bg-gray-100">
                Solicita una demostración
              </Button>
            </Link>
          </div>
        </section>
        
        <div className="text-center">
          <Link to="/how-it-works">
            <Button className="bg-blue-600 hover:bg-blue-700 text-white mr-4">
              Ver tecnologías
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

export default Benefits;
