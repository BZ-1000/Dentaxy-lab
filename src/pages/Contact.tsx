
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Mail, MessageSquare, Phone, MapPin, Instagram } from 'lucide-react';

const Contact = () => {
  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto py-12 px-4">
        <div className="max-w-5xl mx-auto">
          <Link to="/">
            <Button variant="outline" className="mb-8">
              ← Volver al inicio
            </Button>
          </Link>
          
          <h1 className="text-3xl font-bold mb-8">Contacto / Soporte</h1>
          
          <div className="grid gap-12 md:grid-cols-2">
            <div>
              <p className="text-gray-700 mb-8">
                Estamos aquí para ayudarte. Si tienes alguna pregunta sobre nuestros servicios, necesitas asistencia técnica o quieres conocer más sobre Dentaxy, no dudes en contactarnos.
              </p>
              
              <div className="space-y-6">
                <div className="flex items-start">
                  <div className="bg-blue-100 p-3 rounded-full mr-4">
                    <Mail className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-medium">Correo Electrónico</h3>
                    <p className="text-gray-700">contact@dentaxy.ai</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="bg-blue-100 p-3 rounded-full mr-4">
                    <Phone className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-medium">Teléfono</h3>
                    <p className="text-gray-700">+52 (55) 1234-5678</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="bg-blue-100 p-3 rounded-full mr-4">
                    <MapPin className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-medium">Ubicación</h3>
                    <p className="text-gray-700">Ciudad de México, México</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="bg-blue-100 p-3 rounded-full mr-4">
                    <Instagram className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-medium">Instagram</h3>
                    <a 
                      href="https://instagram.com/dentalbasicsacademy" 
                      target="_blank" 
                      rel="noreferrer"
                      className="text-blue-600 hover:text-blue-800"
                    >
                      @dentalbasicsacademy
                    </a>
                  </div>
                </div>
              </div>
              
              <div className="mt-8 p-6 bg-blue-50 rounded-lg">
                <h3 className="font-semibold mb-3 flex items-center">
                  <MessageSquare className="h-5 w-5 mr-2" />
                  Soporte Técnico
                </h3>
                <p className="text-gray-700">
                  Para asistencia técnica, por favor incluye detalles sobre el problema que estás experimentando, incluyendo capturas de pantalla si es posible.
                </p>
              </div>
            </div>
            
            <div>
              <form className="space-y-6 bg-gray-50 p-6 rounded-lg">
                <div className="space-y-2">
                  <label htmlFor="name" className="block text-sm font-medium">
                    Nombre
                  </label>
                  <Input id="name" placeholder="Tu nombre completo" />
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="email" className="block text-sm font-medium">
                    Correo Electrónico
                  </label>
                  <Input id="email" type="email" placeholder="tu@email.com" />
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="subject" className="block text-sm font-medium">
                    Asunto
                  </label>
                  <Input id="subject" placeholder="¿Sobre qué quieres hablar?" />
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="message" className="block text-sm font-medium">
                    Mensaje
                  </label>
                  <Textarea 
                    id="message" 
                    placeholder="Escribe tu mensaje aquí..." 
                    rows={5}
                  />
                </div>
                
                <Button type="submit" className="w-full">
                  Enviar Mensaje
                </Button>
              </form>
              
              <p className="text-sm text-gray-600 mt-4">
                Nos comprometemos a responder a todas las consultas dentro de 24 horas hábiles.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
