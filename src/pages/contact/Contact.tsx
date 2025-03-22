
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { Mail, Phone, MapPin, Send, Instagram } from 'lucide-react';
import BottomMenu from '@/components/BottomMenu';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulamos el envío del formulario
    setTimeout(() => {
      setLoading(false);
      toast.success('Mensaje enviado correctamente. Nos pondremos en contacto contigo pronto.');
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: ''
      });
    }, 1500);
  };

  const contactInfo = [
    {
      icon: Mail,
      title: "Email",
      details: "dentalbasicsacademy@dentaxy.com",
      link: "mailto:dentalbasicsacademy@dentaxy.com"
    },
    {
      icon: Instagram,
      title: "Instagram",
      details: "@dentaxy.ai",
      link: "https://instagram.com/dentaxy.ai"
    },
    {
      icon: MapPin,
      title: "Oficinas",
      details: "Guadalupe, Zacatecas",
      link: "https://maps.google.com"
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
      <div className="container mx-auto px-4 py-12 max-w-6xl">
        <h1 className="text-4xl font-bold text-center mb-3 text-gray-900">Contacto</h1>
        
        <p className="text-center text-lg text-gray-600 mb-10 max-w-3xl mx-auto">
          Estamos aquí para ayudarte. Contacta con nuestro equipo para resolver tus dudas 
          o solicitar información sobre DENTAXY.ai
        </p>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          <div className="lg:col-span-2">
            <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-200">
              <h2 className="text-2xl font-semibold mb-6 text-gray-800">Envíanos un mensaje</h2>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block mb-2 text-sm font-medium text-gray-700">
                      Nombre completo
                    </label>
                    <Input 
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      placeholder="Tu nombre"
                      className="bg-gray-50 border-gray-300"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-700">
                      Correo electrónico
                    </label>
                    <Input 
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      placeholder="correo@ejemplo.com"
                      className="bg-gray-50 border-gray-300"
                    />
                  </div>
                </div>
                
                <div>
                  <label htmlFor="subject" className="block mb-2 text-sm font-medium text-gray-700">
                    Asunto
                  </label>
                  <Input 
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    placeholder="¿Sobre qué quieres hablar?"
                    className="bg-gray-50 border-gray-300"
                  />
                </div>
                
                <div>
                  <label htmlFor="message" className="block mb-2 text-sm font-medium text-gray-700">
                    Mensaje
                  </label>
                  <Textarea 
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    placeholder="Escribe tu mensaje aquí..."
                    rows={6}
                    className="bg-gray-50 border-gray-300"
                  />
                </div>
                
                <Button 
                  type="submit" 
                  disabled={loading}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  {loading ? (
                    <span className="flex items-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Enviando...
                    </span>
                  ) : (
                    <span className="flex items-center">
                      <Send className="mr-2 h-4 w-4" />
                      Enviar mensaje
                    </span>
                  )}
                </Button>
              </form>
            </div>
          </div>
          
          <div>
            <div className="bg-blue-50 p-8 rounded-lg border border-blue-100 h-full">
              <h2 className="text-2xl font-semibold mb-8 text-gray-800">Información de contacto</h2>
              
              <div className="space-y-8">
                {contactInfo.map((item, index) => (
                  <div key={index} className="flex items-start">
                    <div className="bg-white p-3 rounded-full mr-4 shadow-sm">
                      <item.icon className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-800">{item.title}</h3>
                      <a href={item.link} className="text-blue-600 hover:underline">
                        {item.details}
                      </a>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-10 pt-8 border-t border-blue-200">
                <h3 className="font-medium text-gray-800 mb-4">Horario de atención</h3>
                <p className="text-gray-600">
                  Lunes a Viernes: 9:00 AM - 6:00 PM<br />
                  Sábados: 9:00 AM - 2:00 PM<br />
                  Domingos: Cerrado
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <BottomMenu />
    </div>
  );
};

export default Contact;
