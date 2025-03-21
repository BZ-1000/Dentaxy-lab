
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { CheckCircle } from 'lucide-react';
import BottomMenu from '@/components/BottomMenu';

const Funciones = () => {
  const steps = [
    {
      title: "Inicia sesión en tu cuenta",
      description: "Accede a la plataforma con tus credenciales personales para comenzar a utilizar todas las funcionalidades disponibles."
    },
    {
      title: "Crea un nuevo historial clínico",
      description: "Selecciona la opción para crear un nuevo registro de paciente e introduce la información básica inicial."
    },
    {
      title: "Completa los formularios interactivos",
      description: "Navega por los distintos apartados del historial clínico, completando la información requerida de manera intuitiva."
    },
    {
      title: "Genera documentación automáticamente",
      description: "La IA procesará la información introducida para generar documentos clínicos completos y profesionales con un solo clic."
    },
    {
      title: "Guarda y accede cuando lo necesites",
      description: "Todos los historiales quedan almacenados de forma segura en la nube, permitiéndote acceder a ellos desde cualquier dispositivo y en cualquier momento."
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
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <h1 className="text-4xl font-bold text-center mb-8 text-gray-900">Funciones</h1>
        
        <div className="bg-white shadow-sm rounded-lg p-8 mb-8">
          <h2 className="text-2xl font-semibold mb-6 text-gray-800 text-center">
            Guía paso a paso para utilizar DENTAXY.ai
          </h2>
          
          <div className="space-y-8 mt-8">
            {steps.map((step, index) => (
              <div key={index} className="flex items-start gap-4">
                <div className="flex-shrink-0 bg-blue-100 text-blue-800 font-bold rounded-full w-8 h-8 flex items-center justify-center">
                  {index + 1}
                </div>
                <div>
                  <h3 className="text-xl font-medium mb-2 text-gray-800">{step.title}</h3>
                  <p className="text-gray-600">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-10 bg-green-50 p-6 rounded-lg border border-green-100">
            <h3 className="text-xl font-medium mb-3 text-green-800 flex items-center">
              <CheckCircle className="mr-2 h-5 w-5" />
              Compatibilidad total
            </h3>
            <p className="text-gray-700">
              DENTAXY.ai funciona en cualquier dispositivo con conexión a internet: ordenadores, 
              tablets y smartphones, permitiéndote trabajar desde donde prefieras.
            </p>
          </div>
        </div>
        
        <div className="text-center flex justify-center gap-4">
          <Link to="/beneficios">
            <Button className="bg-blue-600 hover:bg-blue-700 text-white">
              Ver beneficios
            </Button>
          </Link>
          <Link to="/planes">
            <Button variant="outline" className="border-blue-600 text-blue-600 hover:bg-blue-50">
              Explorar planes
            </Button>
          </Link>
        </div>
      </div>
      
      <BottomMenu />
    </div>
  );
};

export default Funciones;
