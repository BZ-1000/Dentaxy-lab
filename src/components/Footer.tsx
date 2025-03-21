
import React from 'react';
import { Link } from 'react-router-dom';
import { Instagram } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-slate-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 pt-10 pb-4">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Column 1: Logo and Copyright */}
          <div className="space-y-4">
            <div>
              <h3 className="font-bold text-lg mb-2">Dentaxy</h3>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Dental Basics Academy</p>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              © 2025 Dentaxy.ai & Dentaxy.com Todos los derechos reservados.
            </p>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h3 className="font-bold text-md mb-4">Enlaces Rápidos</h3>
            <ul className="space-y-2">
              <li><Link to="/nosotros" className="text-sm text-gray-600 hover:text-primary dark:text-gray-400 dark:hover:text-primary">Nosotros</Link></li>
              <li><Link to="/funciones" className="text-sm text-gray-600 hover:text-primary dark:text-gray-400 dark:hover:text-primary">Funciones</Link></li>
              <li><Link to="/beneficios" className="text-sm text-gray-600 hover:text-primary dark:text-gray-400 dark:hover:text-primary">Beneficios</Link></li>
              <li><Link to="/planes" className="text-sm text-gray-600 hover:text-primary dark:text-gray-400 dark:hover:text-primary">Planes</Link></li>
              <li><Link to="/contacto" className="text-sm text-gray-600 hover:text-primary dark:text-gray-400 dark:hover:text-primary">Contacto</Link></li>
            </ul>
          </div>

          {/* Column 3: Policies and Social */}
          <div className="space-y-6">
            <div>
              <h3 className="font-bold text-md mb-4">Políticas y Legalidad</h3>
              <ul className="space-y-2">
                <li><Link to="/terminos" className="text-sm text-gray-600 hover:text-primary dark:text-gray-400 dark:hover:text-primary">Términos y Condiciones</Link></li>
                <li><Link to="/privacidad" className="text-sm text-gray-600 hover:text-primary dark:text-gray-400 dark:hover:text-primary">Política de Privacidad</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold text-md mb-2">Síguenos</h3>
              <a 
                href="https://instagram.com/dentaxy" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="inline-flex items-center text-gray-600 hover:text-pink-600 dark:text-gray-400 dark:hover:text-pink-400 transition-colors"
              >
                <Instagram className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
