
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import BottomMenu from '@/components/BottomMenu';
import Footer from '@/components/Footer';

const Privacidad = () => {
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
        <h1 className="text-4xl font-bold text-center mb-8 text-gray-900">Política de Privacidad</h1>
        
        <div className="bg-white shadow-sm rounded-lg p-8 mb-8">
          <div className="prose max-w-none">
            <h2>1. Información que Recopilamos</h2>
            <p>DENTAXY.ai recopila información personal y datos de pacientes proporcionados voluntariamente por los profesionales de la odontología durante el uso de la plataforma para la creación de historias clínicas.</p>
            
            <h2>2. Uso de la Información</h2>
            <p>La información recopilada se utiliza exclusivamente para proporcionar, mantener y mejorar nuestros servicios, así como para cumplir con obligaciones legales.</p>
            
            <h2>3. Almacenamiento y Seguridad</h2>
            <p>Implementamos medidas de seguridad técnicas, administrativas y físicas diseñadas para proteger la información personal contra acceso no autorizado, destrucción o alteración.</p>
            
            <h2>4. Compartir Información</h2>
            <p>No compartimos, vendemos ni alquilamos información personal a terceros, excepto cuando sea necesario para proporcionar nuestros servicios o cuando sea requerido por ley.</p>
            
            <h2>5. Derechos del Usuario</h2>
            <p>Los usuarios tienen derecho a acceder, corregir, actualizar o solicitar la eliminación de su información personal de nuestra plataforma.</p>
            
            <h2>6. Cookies y Tecnologías Similares</h2>
            <p>Utilizamos cookies y tecnologías similares para mejorar la experiencia del usuario, analizar tendencias y administrar la plataforma.</p>
            
            <h2>7. Cambios a esta Política</h2>
            <p>Podemos actualizar esta Política de Privacidad periódicamente. Notificaremos cualquier cambio material publicando la nueva Política de Privacidad en esta página.</p>
            
            <h2>8. Contacto</h2>
            <p>Si tiene preguntas o inquietudes sobre esta Política de Privacidad, contáctenos a través de nuestro formulario de contacto o en la dirección de correo electrónico proporcionada en la plataforma.</p>
          </div>
        </div>
      </div>
      
      <Footer />
      <BottomMenu />
    </div>
  );
};

export default Privacidad;
