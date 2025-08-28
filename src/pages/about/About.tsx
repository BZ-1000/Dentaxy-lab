
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import BottomMenu from '@/components/BottomMenu';

const About = () => {
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
        <h1 className="text-4xl font-bold text-center mb-8 text-gray-900">Nosotros</h1>
        
        <div className="bg-white shadow-sm rounded-lg p-8 mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">¿Qué es DENTAXY.ai?</h2>
          <p className="text-gray-700 mb-6 leading-relaxed">
            DENTAXY.ai es una plataforma innovadora diseñada específicamente para profesionales del sector odontológico, 
            que integra inteligencia artificial para revolucionar la forma en que se redactan y gestionan los historiales clínicos dentales.
          </p>
          
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">Nuestra Misión</h2>
          <p className="text-gray-700 mb-6 leading-relaxed">
            Nuestra misión es transformar la documentación clínica dental, haciendo que sea más eficiente, 
            precisa y valiosa para los profesionales de la salud bucal. Buscamos liberar el tiempo de los odontólogos 
            para que puedan enfocarse en lo más importante: la atención al paciente.
          </p>
          
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">Nuestro Equipo</h2>
          <p className="text-gray-700 mb-6 leading-relaxed">
            DENTAXY.ai ha sido desarrollado por un equipo multidisciplinario de odontólogos clínicos, 
            desarrolladores de software e investigadores en inteligencia artificial, todos comprometidos 
            con mejorar la práctica odontológica mediante tecnología de vanguardia.
          </p>
          
          <div className="bg-blue-50 p-6 rounded-lg border border-blue-100">
            <h3 className="text-xl font-medium mb-3 text-blue-800">Respaldado por expertos</h3>
            <p className="text-gray-700">
              Nuestra plataforma ha sido revisada y aprobada por líderes en odontología clínica, 
              garantizando que cumple con los más altos estándares de precisión y utilidad en el entorno clínico real.
            </p>
          </div>
        </div>
        
        <div className="text-center">
          <Link to="/como-funciona">
            <Button className="bg-blue-600 hover:bg-blue-700 text-white">
              Descubre cómo funciona
            </Button>
          </Link>
        </div>
      </div>
      
      <BottomMenu />
    </div>
  );
};

export default About;
