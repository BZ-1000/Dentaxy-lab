
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const AboutUs = () => {
  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <Link to="/">
            <Button variant="outline" className="mb-8">
              ← Volver al inicio
            </Button>
          </Link>
          
          <h1 className="text-3xl font-bold mb-8">Nosotros</h1>
          
          <div className="prose max-w-none">
            <h2 className="text-xl font-semibold mt-6 mb-4">¿Qué es Dentaxy?</h2>
            <p className="text-gray-700 mb-4">
              Dentaxy es una plataforma innovadora que utiliza inteligencia artificial para ayudar a profesionales dentales a crear y gestionar documentación clínica de manera rápida y eficiente. Nuestra misión es simplificar los procesos administrativos para que los profesionales puedan dedicar más tiempo a lo que realmente importa: el cuidado de sus pacientes.
            </p>
            
            <h2 className="text-xl font-semibold mt-6 mb-4">Nuestra Historia</h2>
            <p className="text-gray-700 mb-4">
              Dentaxy nació de la colaboración entre expertos en odontología y desarrolladores de software, identificando una clara necesidad en el sector: reducir la carga administrativa sin comprometer la calidad y precisión de la documentación clínica. Dental Basics Academy, nuestra institución matriz, lleva años dedicada a la formación y mejora continua en el campo odontológico.
            </p>
            
            <h2 className="text-xl font-semibold mt-6 mb-4">Equipo</h2>
            <p className="text-gray-700 mb-4">
              Nuestro equipo está formado por odontólogos con experiencia clínica, ingenieros de software especializados en IA, y expertos en experiencia de usuario. Esta combinación única nos permite desarrollar soluciones que realmente entienden las necesidades del sector dental.
            </p>
            
            <h2 className="text-xl font-semibold mt-6 mb-4">Valores</h2>
            <ul className="list-disc pl-6 mb-4 text-gray-700">
              <li className="mb-2"><strong>Precisión:</strong> Nos comprometemos a proporcionar herramientas que generen documentación clínica precisa y confiable.</li>
              <li className="mb-2"><strong>Innovación:</strong> Constantemente buscamos nuevas formas de mejorar nuestros servicios utilizando tecnologías avanzadas.</li>
              <li className="mb-2"><strong>Seguridad:</strong> La protección de datos de pacientes es nuestra prioridad absoluta.</li>
              <li className="mb-2"><strong>Accesibilidad:</strong> Trabajamos para hacer que nuestras herramientas sean accesibles para profesionales dentales de todos los niveles.</li>
            </ul>
            
            <h2 className="text-xl font-semibold mt-6 mb-4">Nuestra Visión</h2>
            <p className="text-gray-700 mb-4">
              Aspiramos a transformar la manera en que se gestiona la documentación clínica en el sector dental, estableciendo un nuevo estándar que combine eficiencia y excelencia profesional.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;
