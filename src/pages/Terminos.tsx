
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import BottomMenu from '@/components/BottomMenu';
import Footer from '@/components/Footer';

const Terminos = () => {
  return (
    <div className="min-h-screen bg-white flex flex-col">
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
      <div className="container mx-auto px-4 py-12 max-w-4xl flex-grow">
        <h1 className="text-4xl font-bold text-center mb-8 text-gray-900">Términos y Condiciones</h1>
        
        <div className="bg-white shadow-sm rounded-lg p-8 mb-8">
          <div className="prose max-w-none">
            <h2>1. Aceptación de los Términos</h2>
            <p>Al acceder y utilizar DENTAXY.ai, usted acepta estar sujeto a estos Términos y Condiciones de uso. Si no está de acuerdo con alguno de estos términos, le rogamos que no utilice esta plataforma.</p>
            
            <h2>2. Descripción del Servicio</h2>
            <p>DENTAXY.ai es una plataforma digital diseñada para asistir a profesionales de la odontología en la creación y gestión de historias clínicas. La plataforma utiliza inteligencia artificial para facilitar el proceso de documentación clínica.</p>
            
            <h2>3. Uso del Servicio</h2>
            <p>Usted se compromete a utilizar DENTAXY.ai únicamente para fines profesionales relacionados con la práctica odontológica y de conformidad con todas las leyes y regulaciones aplicables.</p>
            
            <h2>4. Propiedad Intelectual</h2>
            <p>Todos los derechos de propiedad intelectual relativos a DENTAXY.ai, incluyendo pero no limitado a software, diseño, logotipos, contenido y funcionalidades, son propiedad de Dental Basics Academy o han sido debidamente licenciados.</p>
            
            <h2>5. Privacidad y Datos Personales</h2>
            <p>El tratamiento de datos personales se rige por nuestra Política de Privacidad, que forma parte integral de estos Términos y Condiciones.</p>
            
            <h2>6. Limitación de Responsabilidad</h2>
            <p>DENTAXY.ai se ofrece "tal cual" y "según disponibilidad". No garantizamos que el servicio sea ininterrumpido, oportuno, seguro o libre de errores.</p>
            
            <h2>7. Modificaciones</h2>
            <p>Nos reservamos el derecho de modificar estos Términos y Condiciones en cualquier momento. Los cambios entrarán en vigor inmediatamente después de su publicación en la plataforma.</p>
            
            <h2>8. Ley Aplicable</h2>
            <p>Estos Términos y Condiciones se regirán e interpretarán de acuerdo con las leyes de [país], sin tener en cuenta sus disposiciones sobre conflicto de leyes.</p>
          </div>
        </div>
      </div>
      
      <Footer />
      <BottomMenu />
    </div>
  );
};

export default Terminos;
