
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../../components/ui/button';

const About = () => {
  return (
    <div className="min-h-screen bg-white">
      <main className="container mx-auto px-4 py-16 max-w-5xl">
        <h1 className="text-4xl md:text-5xl font-bold text-center mb-8 text-gray-900">Nosotros</h1>
        
        <div className="prose prose-lg mx-auto">
          <p className="text-xl text-center text-gray-700 mb-12">
            Dentaxy es una plataforma revolucionaria que combina tecnología avanzada 
            y experiencia odontológica para transformar la gestión de historias clínicas.
          </p>
          
          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <div className="bg-blue-50 rounded-xl p-8">
              <h2 className="text-2xl font-semibold mb-4 text-blue-800">Nuestra Misión</h2>
              <p className="text-gray-700">
                Facilitar y optimizar el trabajo clínico de los profesionales dentales, 
                ofreciendo herramientas tecnológicas que automatizan procesos administrativos 
                y mejoran la atención al paciente.
              </p>
            </div>
            
            <div className="bg-emerald-50 rounded-xl p-8">
              <h2 className="text-2xl font-semibold mb-4 text-emerald-800">Nuestra Visión</h2>
              <p className="text-gray-700">
                Convertirnos en el aliado tecnológico de referencia en el sector dental, 
                impulsando la transformación digital y la excelencia en la atención clínica 
                a nivel global.
              </p>
            </div>
          </div>
          
          <h2 className="text-3xl font-bold text-center mb-8 text-gray-900">Nuestro Equipo</h2>
          
          <p className="text-gray-700 mb-8">
            Dental Basics Academy es una organización fundada por profesionales 
            con amplia experiencia en odontología clínica y tecnología. Nuestro 
            equipo multidisciplinario trabaja para crear soluciones innovadoras 
            que respondan a las necesidades reales de la práctica dental moderna.
          </p>
          
          <div className="text-center mt-12">
            <Link to="/">
              <Button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-6 rounded-lg text-lg">
                Descubre Dentaxy
              </Button>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
};

export default About;
