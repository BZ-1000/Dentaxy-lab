
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Clock, FileText, Shield, Brain, Users } from 'lucide-react';
import BottomMenu from '@/components/BottomMenu';

const BenefitCard = ({ icon: Icon, title, description }: { icon: any, title: string, description: string }) => (
  <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
    <div className="flex items-center mb-4">
      <div className="bg-blue-100 p-3 rounded-full mr-4">
        <Icon className="h-6 w-6 text-blue-600" />
      </div>
      <h3 className="text-xl font-semibold text-gray-800">{title}</h3>
    </div>
    <p className="text-gray-600">{description}</p>
  </div>
);

const Benefits = () => {
  const benefits = [
    {
      icon: Clock,
      title: "Ahorro de tiempo",
      description: "Reduce hasta un 70% el tiempo dedicado a la documentación clínica, permitiéndote atender a más pacientes o mejorar tu calidad de vida."
    },
    {
      icon: FileText,
      title: "Documentación profesional",
      description: "Genera historiales clínicos completos y bien estructurados que cumplen con todos los estándares profesionales y legales."
    },
    {
      icon: Shield,
      title: "Seguridad y cumplimiento",
      description: "Plataforma diseñada con los más altos estándares de seguridad, garantizando la protección de los datos sensibles de tus pacientes."
    },
    {
      icon: Brain,
      title: "IA especializada",
      description: "Nuestra inteligencia artificial está entrenada específicamente para odontología, comprendiendo terminología y procedimientos específicos."
    },
    {
      icon: Users,
      title: "Mejora la experiencia del paciente",
      description: "Dedica más tiempo a la atención personal y menos a la documentación, mejorando la satisfacción y fidelización de tus pacientes."
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-slate-50">
        <Link to="/" className="flex items-center gap-2">
          <img alt="Logo" src="/lovable-uploads/3236de6d-a3e4-4b81-9c83-b32690d4212d.png" className="h-8 w-8" />
          <div className="text-black text-[10px] sm:text-xs font-bold tracking-tight">
            <div className="leading-none">DENTAL BASICS</div>
            <div className="leading-none">ACADEMY</div>
          </div>
        </Link>
        
        <Link to="/">
          <Button variant="ghost" className="text-sm">Volver al inicio</Button>
        </Link>
      </div>
      
      {/* Main Content */}
      <div className="container mx-auto px-4 py-12 max-w-5xl">
        <h1 className="text-4xl font-bold text-center mb-8 text-gray-900">Beneficios</h1>
        
        <p className="text-center text-lg text-gray-600 mb-10 max-w-3xl mx-auto">
          DENTAXY.ai transforma la manera en que gestionas tus historiales clínicos, ofreciéndote 
          ventajas que impactan positivamente en tu práctica diaria y en la calidad de atención.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {benefits.map((benefit, index) => (
            <BenefitCard 
              key={index}
              icon={benefit.icon}
              title={benefit.title}
              description={benefit.description}
            />
          ))}
        </div>
        
        <div className="bg-blue-50 p-8 rounded-lg border border-blue-100 mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-blue-800 text-center">
            Respaldado por odontólogos para odontólogos
          </h2>
          <p className="text-center text-gray-700">
            DENTAXY.ai ha sido desarrollado en colaboración estrecha con profesionales clínicos, 
            asegurando que cada funcionalidad responda a necesidades reales de la práctica odontológica moderna.
          </p>
          <div className="mt-6 text-center">
            <p className="italic text-blue-700">
              "DENTAXY.ai ha transformado mi consulta, permitiéndome dedicar más tiempo a mis pacientes y menos a papeleo."
            </p>
            <p className="mt-2 font-medium text-gray-800">Dr. Carlos Mendoza, Odontólogo</p>
          </div>
        </div>
        
        <div className="text-center">
          <Link to="/planes">
            <Button className="bg-blue-600 hover:bg-blue-700 text-white">
              Explorar planes disponibles
            </Button>
          </Link>
        </div>
      </div>
      
      <BottomMenu />
    </div>
  );
};

export default Benefits;
