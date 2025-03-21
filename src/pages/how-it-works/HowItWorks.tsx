
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../../components/ui/button';
import { Check } from 'lucide-react';

const HowItWorks = () => {
  return (
    <div className="min-h-screen bg-white">
      <main className="container mx-auto px-4 py-16 max-w-5xl">
        <h1 className="text-4xl md:text-5xl font-bold text-center mb-8 text-gray-900">Cómo Funciona</h1>
        
        <p className="text-xl text-center text-gray-700 mb-12">
          Dentaxy simplifica la gestión de historias clínicas mediante inteligencia artificial, 
          proporcionando una experiencia intuitiva y eficiente.
        </p>
        
        <div className="space-y-16 mb-16">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="md:w-1/2 bg-gray-100 rounded-xl p-6 aspect-video flex items-center justify-center">
              <span className="text-5xl font-bold text-blue-600">1</span>
            </div>
            <div className="md:w-1/2">
              <h2 className="text-2xl font-bold mb-4 text-blue-800">Regístrate y Configura tu Cuenta</h2>
              <p className="text-gray-700 mb-4">
                Crea tu cuenta en minutos y configura tu perfil profesional. Nuestro proceso de 
                registro es rápido y seguro, diseñado para que puedas empezar a utilizar la 
                plataforma inmediatamente.
              </p>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                  <span>Registro simple con correo o Google</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                  <span>Configuración personalizada de tu perfil</span>
                </li>
              </ul>
            </div>
          </div>
          
          <div className="flex flex-col md:flex-row-reverse items-center gap-8">
            <div className="md:w-1/2 bg-gray-100 rounded-xl p-6 aspect-video flex items-center justify-center">
              <span className="text-5xl font-bold text-blue-600">2</span>
            </div>
            <div className="md:w-1/2">
              <h2 className="text-2xl font-bold mb-4 text-blue-800">Crea tus Primeras Historias Clínicas</h2>
              <p className="text-gray-700 mb-4">
                Utiliza nuestros formularios inteligentes para registrar información completa 
                de tus pacientes. La plataforma te guía a través del proceso asegurando que 
                recopiles todos los datos necesarios.
              </p>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                  <span>Formularios adaptados a especialidades dentales</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                  <span>Generación automática de narrativas clínicas</span>
                </li>
              </ul>
            </div>
          </div>
          
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="md:w-1/2 bg-gray-100 rounded-xl p-6 aspect-video flex items-center justify-center">
              <span className="text-5xl font-bold text-blue-600">3</span>
            </div>
            <div className="md:w-1/2">
              <h2 className="text-2xl font-bold mb-4 text-blue-800">Gestiona y Accede a tus Datos</h2>
              <p className="text-gray-700 mb-4">
                Consulta, edita y comparte historias clínicas desde cualquier dispositivo. 
                Todos tus datos se almacenan de forma segura y están disponibles cuando 
                los necesites.
              </p>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                  <span>Acceso multidispositivo</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                  <span>Búsqueda avanzada de pacientes y registros</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
        
        <div className="text-center mt-12">
          <Link to="/auth/register">
            <Button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-6 rounded-lg text-lg">
              Comenzar Ahora
            </Button>
          </Link>
        </div>
      </main>
    </div>
  );
};

export default HowItWorks;
