
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowRight, Check } from 'lucide-react';
import { AuthDialog } from '../components/auth/AuthDialog';
import { Button } from '@/components/ui/button';
import { initialFormState } from '@/utils/initialFormState';
import { Checkbox } from '@/components/ui/checkbox';

const Landing = () => {
  const [showAuthDialog, setShowAuthDialog] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    termsAccepted: false,
    privacyAccepted: false
  });
  const [errors, setErrors] = useState({
    nombre: '',
    email: '',
    terms: ''
  });
  
  const navigate = useNavigate();

  const handleAuthSuccess = () => {
    navigate('/app');
  };

  const handleShowLogin = () => {
    setAuthMode('login');
    setShowAuthDialog(true);
  };

  const handleShowRegister = () => {
    setAuthMode('register');
    setShowAuthDialog(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    let valid = true;
    const newErrors = {
      nombre: '',
      email: '',
      terms: ''
    };
    
    if (!formData.nombre.trim()) {
      newErrors.nombre = 'El nombre es requerido';
      valid = false;
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'El email es requerido';
      valid = false;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email inválido';
      valid = false;
    }
    
    if (!formData.termsAccepted || !formData.privacyAccepted) {
      newErrors.terms = 'Debes aceptar los términos y la política de privacidad';
      valid = false;
    }

    setErrors(newErrors);
    
    if (valid) {
      handleShowRegister();
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCheckboxChange = (name: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      [name]: checked
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <img src="/diente.png" alt="Dentaxy Logo" className="h-8 w-8" />
            <div className="flex flex-col">
              <span className="text-xl font-bold text-blue-600">Dentaxy</span>
              <span className="text-xs font-bold text-gray-500">Dental Basics Academy</span>
            </div>
          </div>
          
          <nav className="hidden md:flex items-center space-x-6">
            <Link to="/about" className="text-gray-700 hover:text-blue-600 font-medium">Nosotros</Link>
            <Link to="/how-it-works" className="text-gray-700 hover:text-blue-600 font-medium">Cómo Funciona</Link>
            <Link to="/benefits" className="text-gray-700 hover:text-blue-600 font-medium">Beneficios</Link>
            <Link to="/plans" className="text-gray-700 hover:text-blue-600 font-medium">Planes</Link>
            <Link to="/contact" className="text-gray-700 hover:text-blue-600 font-medium">Contacto</Link>
          </nav>
          
          <div className="flex items-center space-x-4">
            <button 
              onClick={handleShowLogin}
              className="text-blue-600 hover:text-blue-800 font-medium"
            >
              Ingresar
            </button>
            <button 
              onClick={handleShowRegister}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
            >
              Registrarse
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 flex flex-col lg:flex-row items-center">
        <div className="lg:w-1/2 mb-10 lg:mb-0">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-6">
            Historias Clínicas Impulsadas por IA
          </h1>
          <p className="text-xl text-gray-700 mb-8">
            Optimiza tu consulta dental con inteligencia artificial. Documenta, analiza y obtén insights 
            de tus historias clínicas más rápido que nunca.
          </p>
          <div className="space-y-4">
            <div className="flex items-start">
              <div className="flex-shrink-0 mt-1">
                <div className="bg-green-100 p-1 rounded-full">
                  <Check className="h-4 w-4 text-green-600" />
                </div>
              </div>
              <p className="ml-3 text-gray-700">Reduce un 80% el tiempo de documentación</p>
            </div>
            <div className="flex items-start">
              <div className="flex-shrink-0 mt-1">
                <div className="bg-green-100 p-1 rounded-full">
                  <Check className="h-4 w-4 text-green-600" />
                </div>
              </div>
              <p className="ml-3 text-gray-700">Minimiza errores clínicos con IA avanzada</p>
            </div>
            <div className="flex items-start">
              <div className="flex-shrink-0 mt-1">
                <div className="bg-green-100 p-1 rounded-full">
                  <Check className="h-4 w-4 text-green-600" />
                </div>
              </div>
              <p className="ml-3 text-gray-700">Compatible con tu software dental actual</p>
            </div>
          </div>
        </div>
        
        <div className="lg:w-1/2 lg:pl-16">
          <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md">
            <h2 className="text-2xl font-bold text-center text-gray-900 mb-6">
              ¡Comienza hoy mismo!
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="nombre" className="block text-sm font-medium text-gray-700 mb-1">
                  Nombre completo
                </label>
                <input
                  id="nombre"
                  name="nombre"
                  type="text"
                  value={formData.nombre}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Dr. Juan Pérez"
                />
                {errors.nombre && <p className="mt-1 text-sm text-red-600">{errors.nombre}</p>}
              </div>
              
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email profesional
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                  placeholder="juan@consultorio.com"
                />
                {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
              </div>

              <div className="space-y-3">
                <div className="flex items-start">
                  <Checkbox 
                    id="terms" 
                    checked={formData.termsAccepted}
                    onCheckedChange={(checked) => 
                      handleCheckboxChange('termsAccepted', checked === true)}
                    className="mt-1"
                  />
                  <label htmlFor="terms" className="ml-2 text-sm text-gray-600">
                    Acepto los <Link to="/terms" className="text-blue-600 hover:underline">Términos y Condiciones</Link>
                  </label>
                </div>
                
                <div className="flex items-start">
                  <Checkbox 
                    id="privacy" 
                    checked={formData.privacyAccepted}
                    onCheckedChange={(checked) => 
                      handleCheckboxChange('privacyAccepted', checked === true)}
                    className="mt-1"
                  />
                  <label htmlFor="privacy" className="ml-2 text-sm text-gray-600">
                    Acepto la <Link to="/privacy" className="text-blue-600 hover:underline">Política de Privacidad</Link>
                  </label>
                </div>
                
                {errors.terms && <p className="mt-1 text-sm text-red-600">{errors.terms}</p>}
              </div>
              
              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-lg font-medium transition-colors flex items-center justify-center"
              >
                Empezar ahora
                <ArrowRight className="ml-2 h-5 w-5" />
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* Feature Section */}
      <section className="bg-gray-50 py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Características que transforman tu consulta
          </h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-xl shadow-md">
              <div className="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Reconocimiento por voz</h3>
              <p className="text-gray-700">Documenta mientras hablas con tu paciente, sin necesidad de escribir.</p>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-md">
              <div className="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Análisis inteligente</h3>
              <p className="text-gray-700">Detección automática de patologías y sugerencias de tratamiento basadas en evidencia.</p>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-md">
              <div className="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Integración completa</h3>
              <p className="text-gray-700">Compatible con los principales software de gestión dental del mercado.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Lo que dicen nuestros usuarios
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-xl shadow-md">
              <div className="flex items-center mb-4">
                <div className="h-12 w-12 rounded-full bg-gray-200 flex items-center justify-center text-gray-700 font-bold text-xl">
                  DP
                </div>
                <div className="ml-4">
                  <h4 className="font-semibold">Dra. Patricia López</h4>
                  <p className="text-sm text-gray-600">Odontóloga General</p>
                </div>
              </div>
              <p className="text-gray-700">
                "Desde que uso Dentaxy, puedo atender 3 pacientes más al día. La documentación ya no es un dolor de cabeza."
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-md">
              <div className="flex items-center mb-4">
                <div className="h-12 w-12 rounded-full bg-gray-200 flex items-center justify-center text-gray-700 font-bold text-xl">
                  MR
                </div>
                <div className="ml-4">
                  <h4 className="font-semibold">Dr. Miguel Ramírez</h4>
                  <p className="text-sm text-gray-600">Ortodoncista</p>
                </div>
              </div>
              <p className="text-gray-700">
                "La precisión del reconocimiento de voz es impresionante. Mis historias clínicas nunca habían sido tan completas."
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-md">
              <div className="flex items-center mb-4">
                <div className="h-12 w-12 rounded-full bg-gray-200 flex items-center justify-center text-gray-700 font-bold text-xl">
                  LC
                </div>
                <div className="ml-4">
                  <h4 className="font-semibold">Dra. Laura Castro</h4>
                  <p className="text-sm text-gray-600">Endodoncista</p>
                </div>
              </div>
              <p className="text-gray-700">
                "Las sugerencias de diagnóstico me han ayudado a detectar problemas que podría haber pasado por alto. Es como tener un asistente experto."
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-blue-600 py-16 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">¿Listo para transformar tu consulta dental?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Únete a miles de profesionales que ya están ahorrando tiempo y mejorando su documentación clínica.
          </p>
          <button 
            onClick={handleShowRegister}
            className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-3 rounded-lg font-medium text-lg transition-colors"
          >
            Comenzar prueba gratuita
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">Dentaxy</h3>
              <p className="text-gray-400 text-sm">Dental Basics Academy</p>
              <p className="text-gray-400 text-sm mt-4">© 2025 Dentaxy.ai & Dentaxy.com. Todos los derechos reservados.</p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Enlaces Rápidos</h4>
              <ul className="space-y-2">
                <li><Link to="/about" className="text-gray-400 hover:text-white">Nosotros</Link></li>
                <li><Link to="/how-it-works" className="text-gray-400 hover:text-white">Cómo Funciona</Link></li>
                <li><Link to="/benefits" className="text-gray-400 hover:text-white">Beneficios</Link></li>
                <li><Link to="/plans" className="text-gray-400 hover:text-white">Planes</Link></li>
                <li><Link to="/contact" className="text-gray-400 hover:text-white">Contacto</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Políticas y Legalidad</h4>
              <ul className="space-y-2">
                <li><Link to="/terms" className="text-gray-400 hover:text-white">Términos y Condiciones</Link></li>
                <li><Link to="/privacy" className="text-gray-400 hover:text-white">Política de Privacidad</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Síguenos</h4>
              <a 
                href="https://www.instagram.com/dentalbasicsacademy" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center text-gray-400 hover:text-white"
              >
                <svg className="h-6 w-6 mr-2" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
                @dentalbasicsacademy
              </a>
            </div>
          </div>
        </div>
      </footer>
      
      {/* Auth Dialog */}
      <AuthDialog 
        isOpen={showAuthDialog} 
        onClose={() => setShowAuthDialog(false)}
        defaultMode={authMode}
        onSuccess={handleAuthSuccess}
      />
    </div>
  );
};

export default Landing;
