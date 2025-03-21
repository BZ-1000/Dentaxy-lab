
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Check, FileText, RefreshCw, Cpu, Save } from 'lucide-react';

const HowItWorks = () => {
  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <Link to="/">
            <Button variant="outline" className="mb-8">
              ← Volver al inicio
            </Button>
          </Link>
          
          <h1 className="text-3xl font-bold mb-8">Cómo Funciona</h1>
          
          <div className="prose max-w-none">
            <p className="text-gray-700 mb-8">
              Dentaxy simplifica la creación de documentación clínica dental utilizando inteligencia artificial. A continuación, explicamos el proceso paso a paso:
            </p>
            
            <div className="grid gap-8 md:grid-cols-2">
              <div className="bg-gray-50 p-6 rounded-lg border border-gray-100">
                <div className="flex items-center mb-4">
                  <div className="bg-blue-100 p-3 rounded-full mr-4">
                    <FileText className="h-6 w-6 text-blue-600" />
                  </div>
                  <h3 className="text-lg font-semibold">1. Selecciona el tipo de documento</h3>
                </div>
                <p className="text-gray-700">
                  Elige entre historias clínicas, consentimientos informados, planes de tratamiento y más. Todos los documentos están diseñados siguiendo estándares profesionales.
                </p>
              </div>
              
              <div className="bg-gray-50 p-6 rounded-lg border border-gray-100">
                <div className="flex items-center mb-4">
                  <div className="bg-blue-100 p-3 rounded-full mr-4">
                    <Check className="h-6 w-6 text-blue-600" />
                  </div>
                  <h3 className="text-lg font-semibold">2. Completa los datos requeridos</h3>
                </div>
                <p className="text-gray-700">
                  Introduce la información básica necesaria a través de formularios intuitivos. Nuestro sistema está diseñado para recopilar solo lo esencial.
                </p>
              </div>
              
              <div className="bg-gray-50 p-6 rounded-lg border border-gray-100">
                <div className="flex items-center mb-4">
                  <div className="bg-blue-100 p-3 rounded-full mr-4">
                    <Cpu className="h-6 w-6 text-blue-600" />
                  </div>
                  <h3 className="text-lg font-semibold">3. La IA genera el documento</h3>
                </div>
                <p className="text-gray-700">
                  Nuestra inteligencia artificial procesa la información y redacta un documento profesional completo en segundos, adaptándose a tus preferencias de estilo.
                </p>
              </div>
              
              <div className="bg-gray-50 p-6 rounded-lg border border-gray-100">
                <div className="flex items-center mb-4">
                  <div className="bg-blue-100 p-3 rounded-full mr-4">
                    <RefreshCw className="h-6 w-6 text-blue-600" />
                  </div>
                  <h3 className="text-lg font-semibold">4. Revisa y ajusta</h3>
                </div>
                <p className="text-gray-700">
                  Revisa el documento generado y realiza ajustes si es necesario. Puedes editar directamente el texto o solicitar a la IA que lo modifique según tus indicaciones.
                </p>
              </div>
              
              <div className="bg-gray-50 p-6 rounded-lg border border-gray-100 md:col-span-2">
                <div className="flex items-center mb-4">
                  <div className="bg-blue-100 p-3 rounded-full mr-4">
                    <Save className="h-6 w-6 text-blue-600" />
                  </div>
                  <h3 className="text-lg font-semibold">5. Guarda y exporta</h3>
                </div>
                <p className="text-gray-700">
                  Una vez satisfecho, guarda el documento en tu cuenta y expórtalo en diferentes formatos (PDF, DOCX). También puedes integrarlo con tu sistema de gestión clínica existente.
                </p>
              </div>
            </div>
            
            <div className="mt-12 bg-blue-50 p-6 rounded-lg">
              <h2 className="text-xl font-semibold mb-4">Tecnología segura y confiable</h2>
              <p className="text-gray-700">
                Dentaxy utiliza tecnologías de encriptación avanzadas para garantizar la seguridad de todos los datos. Nuestra plataforma cumple con las normativas de protección de datos del sector sanitario, asegurando la confidencialidad de la información de tus pacientes.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HowItWorks;
