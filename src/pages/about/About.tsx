
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
      <div className="container mx-auto px-4 py-12 max-w-6xl">
        <h1 className="text-4xl font-bold text-center mb-8 text-gray-900">Sobre Dentaxy.com</h1>
        
        {/* Qué es Dentaxy */}
        <div className="bg-white shadow-sm rounded-lg p-8 mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">¿Qué es Dentaxy.com?</h2>
          <p className="text-gray-700 mb-6 leading-relaxed">
            Dentaxy.com es una plataforma revolucionaria de inteligencia artificial especializada en odontología, 
            diseñada específicamente para acelerar y optimizar la documentación clínica dental. Nuestra aplicación 
            web combina tecnología de vanguardia con conocimiento odontológico especializado para ofrecer una 
            experiencia única en la creación de historias clínicas dentales.
          </p>
          
          <p className="text-gray-700 mb-6 leading-relaxed">
            La plataforma está pensada para la rapidez y el mayor aprendizaje al tener toda la información 
            odontológica disponible de manera instantánea, permitiendo a los profesionales crear documentación 
            clínica precisa en minutos en lugar de horas.
          </p>
        </div>

        {/* Como Funciona la Aplicación */}
        <div className="bg-blue-50 shadow-sm rounded-lg p-8 mb-8 border border-blue-100">
          <h2 className="text-2xl font-semibold mb-4 text-blue-800">¿Cómo Funciona la Aplicación?</h2>
          
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-medium mb-3 text-blue-700">🏗️ Arquitectura de la Aplicación</h3>
              <p className="text-gray-700 mb-4 leading-relaxed">
                Dentaxy.com está construida con tecnologías modernas de desarrollo web:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                <li><strong>Frontend:</strong> React 18 con TypeScript para una interfaz robusta y tipada</li>
                <li><strong>Estilizado:</strong> Tailwind CSS para un diseño responsivo y moderno</li>
                <li><strong>Componentes:</strong> Shadcn/UI para elementos de interfaz consistentes</li>
                <li><strong>Enrutamiento:</strong> React Router DOM para navegación fluida</li>
                <li><strong>Backend:</strong> Supabase para autenticación, base de datos y funciones serverless</li>
                <li><strong>IA:</strong> Google Gemini API para procesamiento de lenguaje natural</li>
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-medium mb-3 text-blue-700">📝 Sistema de Formularios Inteligentes</h3>
              <p className="text-gray-700 mb-4 leading-relaxed">
                La aplicación cuenta con más de 15 secciones especializadas de historia clínica dental:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                <li>Información principal del paciente con validación automática</li>
                <li>Padecimiento actual con asistente de síntomas</li>
                <li>Antecedentes heredofamiliares, personales patológicos y no patológicos</li>
                <li>Examen físico completo (cabeza, cuello, intrabucal)</li>
                <li>Evaluación de articulación craneomandibular</li>
                <li>Análisis de oclusión y relación dental</li>
                <li>Diagnóstico y pronóstico automatizado</li>
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-medium mb-3 text-blue-700">🤖 Inteligencia Artificial Integrada</h3>
              <p className="text-gray-700 mb-4 leading-relaxed">
                Cada campo del formulario cuenta con asistencia de IA que:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                <li>Genera descripciones clínicas precisas basadas en selecciones</li>
                <li>Sugiere diagnósticos diferenciales</li>
                <li>Proporciona contexto médico relevante</li>
                <li>Valida consistencia entre diferentes secciones</li>
                <li>Ofrece recomendaciones de tratamiento</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Como funciona el guardado */}
        <div className="bg-green-50 shadow-sm rounded-lg p-8 mb-8 border border-green-100">
          <h2 className="text-2xl font-semibold mb-4 text-green-800">💾 Sistema de Guardado Automático</h2>
          
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-medium mb-2 text-green-700">Guardado Local Inteligente</h3>
              <p className="text-gray-700 leading-relaxed">
                La información se guarda automáticamente en el navegador del usuario usando localStorage, 
                asegurando que ningún dato se pierda incluso si se cierra accidentalmente la aplicación. 
                El sistema crea respaldos automáticos cada vez que se modifica un campo.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-medium mb-2 text-green-700">Sincronización en Tiempo Real</h3>
              <p className="text-gray-700 leading-relaxed">
                Todos los cambios se sincronizan instantáneamente entre las diferentes secciones del formulario, 
                manteniendo la coherencia de los datos y actualizando automáticamente los resúmenes y 
                diagnósticos generados por IA.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-medium mb-2 text-green-700">Exportación Profesional</h3>
              <p className="text-gray-700 leading-relaxed">
                Una vez completada la historia clínica, el sistema genera automáticamente un documento PDF 
                profesional con formato médico estándar, listo para imprimir o compartir digitalmente.
              </p>
            </div>
          </div>
        </div>

        {/* DentaxyGPT */}
        <div className="bg-purple-50 shadow-sm rounded-lg p-8 mb-8 border border-purple-100">
          <h2 className="text-2xl font-semibold mb-4 text-purple-800">🧠 DentaxyGPT - Base de Datos Inteligente</h2>
          
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-medium mb-2 text-purple-700">Base de Datos Especializada</h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                DentaxyGPT cuenta con una base de datos propia de términos odontológicos que incluye:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-1 ml-4">
                <li>Más de 1,000 términos odontológicos especializados</li>
                <li>Definiciones precisas y contextualizadas</li>
                <li>Sinónimos y variaciones terminológicas</li>
                <li>Contextos de uso clínico específicos</li>
                <li>Clasificación por categorías y subcategorías</li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-medium mb-2 text-purple-700">Búsqueda Inteligente</h3>
              <p className="text-gray-700 leading-relaxed">
                El sistema de búsqueda utiliza algoritmos avanzados que permiten encontrar información 
                relevante mediante búsqueda por término exacto, sinónimos o búsqueda en definiciones. 
                Los resultados se presentan con animación de escritura rápida para una experiencia 
                fluida y profesional.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-medium mb-2 text-purple-700">Integración en Tiempo Real</h3>
              <p className="text-gray-700 leading-relaxed">
                DentaxyGPT está integrado directamente en cada sección del formulario, proporcionando 
                asistencia contextual instantánea sin necesidad de cambiar de pantalla o interrumpir 
                el flujo de trabajo del profesional.
              </p>
            </div>
          </div>
        </div>

        {/* Tecnología Backend */}
        <div className="bg-orange-50 shadow-sm rounded-lg p-8 mb-8 border border-orange-100">
          <h2 className="text-2xl font-semibold mb-4 text-orange-800">⚙️ Infraestructura Tecnológica</h2>
          
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-medium mb-2 text-orange-700">Base de Datos PostgreSQL</h3>
              <p className="text-gray-700 leading-relaxed">
                Utilizamos PostgreSQL como base de datos principal, aprovechando sus capacidades de 
                búsqueda de texto completo y indexación avanzada para búsquedas rápidas y precisas 
                en la terminología dental.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-medium mb-2 text-orange-700">Funciones Serverless</h3>
              <p className="text-gray-700 leading-relaxed">
                Las funciones de Edge Computing procesan las consultas de DentaxyGPT, ejecutando 
                búsquedas complejas y proporcionando respuestas optimizadas en tiempo real sin 
                comprometer la velocidad de la aplicación.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-medium mb-2 text-orange-700">Seguridad y Privacidad</h3>
              <p className="text-gray-700 leading-relaxed">
                Implementamos autenticación segura, encriptación de datos y cumplimiento con 
                estándares de privacidad médica para garantizar la confidencialidad de la 
                información del paciente.
              </p>
            </div>
          </div>
        </div>

        {/* Nuestro Equipo */}
        <div className="bg-gray-50 shadow-sm rounded-lg p-8 mb-8 border border-gray-200">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">👨‍💻 Creador</h2>
          <p className="text-gray-700 mb-6 leading-relaxed">
            Dentaxy.com ha sido creado y desarrollado por una sola persona apasionada por la 
            tecnología y la odontología, combinando años de experiencia en desarrollo de software 
            con un profundo entendimiento de las necesidades del sector dental.
          </p>
          
          <p className="text-gray-700 mb-4 leading-relaxed">
            El proyecto nació de la necesidad de optimizar los procesos de documentación clínica 
            dental, aplicando inteligencia artificial de manera práctica y efectiva para resolver 
            problemas reales en la práctica odontológica cotidiana.
          </p>

          <div className="bg-gray-100 p-4 rounded-lg">
            <p className="text-sm text-gray-600 font-medium">
              © 2025 Dentaxy.com - Todos los derechos reservados<br/>
              © 2025 Dentaxy.ai - Todos los derechos reservados<br/>
              Creado por Dental Basics Academy
            </p>
          </div>
        </div>

        {/* Nuestra Misión */}
        <div className="bg-blue-50 shadow-sm rounded-lg p-8 mb-8 border border-blue-100">
          <h2 className="text-2xl font-semibold mb-4 text-blue-800">🎯 Nuestra Misión</h2>
          <p className="text-gray-700 mb-6 leading-relaxed">
            Revolucionar la documentación clínica dental mediante inteligencia artificial, 
            proporcionando herramientas que no solo ahorren tiempo, sino que también mejoren 
            la calidad y precisión de los registros médicos.
          </p>
          
          <p className="text-gray-700 mb-4 leading-relaxed">
            Buscamos democratizar el acceso a tecnología de vanguardia para profesionales 
            dentales de todos los niveles, desde estudiantes hasta especialistas experimentados, 
            facilitando un aprendizaje continuo y una práctica más eficiente.
          </p>
        </div>

        <div className="text-center">
          <Link to="/como-funciona">
            <Button className="bg-blue-600 hover:bg-blue-700 text-white mr-4">
              Descubre cómo funciona
            </Button>
          </Link>
          <Link to="/plans">
            <Button variant="outline" className="border-blue-600 text-blue-600 hover:bg-blue-50">
              Ver planes disponibles
            </Button>
          </Link>
        </div>
      </div>
      
      <BottomMenu />
    </div>
  );
};

export default About;
