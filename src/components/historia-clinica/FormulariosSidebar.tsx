import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  User, FileText, Heart, Activity, Stethoscope, Eye, Brain, 
  Zap, Shield, Baby, Calendar, MapPin, Phone, Mail, Home,
  ChevronLeft, ChevronRight, Menu
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface FormSection {
  id: string;
  title: string;
  icon: React.ReactNode;
}

interface FormulariosSidebarProps {
  activeForm: string;
  onFormSelect: (formId: string) => void;
}

const formSections: FormSection[] = [
  { id: 'datos-personales', title: 'Datos Personales', icon: <User /> },
  { id: 'antecedentes-personales', title: 'Antecedentes Personales', icon: <FileText /> },
  { id: 'antecedentes-familiares', title: 'Antecedentes Familiares', icon: <Heart /> },
  { id: 'habitos', title: 'Hábitos', icon: <Activity /> },
  { id: 'revision-sistemas', title: 'Revisión por Sistemas', icon: <Stethoscope /> },
  { id: 'examen-fisico', title: 'Examen Físico', icon: <Eye /> },
  { id: 'examen-mental', title: 'Examen Mental', icon: <Brain /> },
  { id: 'historia-dental', title: 'Historia Dental', icon: <Zap /> },
  { id: 'vacunacion', title: 'Vacunación', icon: <Shield /> },
  { id: 'embarazo', title: 'Embarazo', icon: <Baby /> },
];

const contactSections: FormSection[] = [
  { id: 'datos-contacto', title: 'Datos de Contacto', icon: <Phone /> },
  { id: 'direccion', title: 'Dirección', icon: <MapPin /> },
];

const FormulariosSidebar = ({ activeForm, onFormSelect }: FormulariosSidebarProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const handleFormSelect = (formId: string) => {
    onFormSelect(formId);
    if (window.innerWidth < 768) {
      setIsOpen(false); // Close sidebar on mobile after selecting a form
    }
  };

  return (
    <>
      {/* Mobile Sidebar */}
      <div className="md:hidden">
        <button
          onClick={toggleSidebar}
          className="fixed top-4 left-4 bg-white dark:bg-gray-800 rounded-full shadow-md p-2 hover:bg-gray-100 dark:hover:bg-gray-700 z-50"
        >
          {isOpen ? <ChevronLeft className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>

        <motion.div
          className={cn(
            "fixed top-0 left-0 h-full w-64 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 shadow-xl z-40 transform transition-transform duration-300 ease-in-out",
            isOpen ? "translate-x-0" : "-translate-x-full"
          )}
        >
          <div className="p-4">
            <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100">
              Formularios
            </h2>
            <nav className="flex flex-col space-y-2">
              {formSections.map((section) => (
                <button
                  key={section.id}
                  onClick={() => handleFormSelect(section.id)}
                  className={cn(
                    "flex items-center space-x-2 p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800",
                    activeForm === section.id
                      ? "bg-blue-500 text-white dark:bg-blue-700 dark:text-gray-50"
                      : "text-gray-700 dark:text-gray-300"
                  )}
                >
                  {section.icon}
                  <span>{section.title}</span>
                </button>
              ))}
              <h3 className="text-sm font-semibold mt-4 mb-2 text-gray-900 dark:text-gray-100">
                Contacto
              </h3>
              {contactSections.map((section) => (
                <button
                  key={section.id}
                  onClick={() => handleFormSelect(section.id)}
                  className={cn(
                    "flex items-center space-x-2 p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800",
                    activeForm === section.id
                      ? "bg-blue-500 text-white dark:bg-blue-700 dark:text-gray-50"
                      : "text-gray-700 dark:text-gray-300"
                  )}
                >
                  {section.icon}
                  <span>{section.title}</span>
                </button>
              ))}
            </nav>
          </div>
        </motion.div>

        {isOpen && (
          <div
            className="fixed top-0 left-0 w-full h-full bg-black opacity-50 z-30"
            onClick={toggleSidebar}
          />
        )}
      </div>

      {/* Desktop Sidebar */}
      <motion.div
        className="hidden md:flex flex-col w-64 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 shadow-xl h-full"
      >
        <div className="p-4">
          <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100">
            Formularios
          </h2>
          <nav className="flex flex-col space-y-2">
            {formSections.map((section) => (
              <button
                key={section.id}
                onClick={() => handleFormSelect(section.id)}
                className={cn(
                  "flex items-center space-x-2 p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800",
                  activeForm === section.id
                    ? "bg-blue-500 text-white dark:bg-blue-700 dark:text-gray-50"
                    : "text-gray-700 dark:text-gray-300"
                )}
              >
                {section.icon}
                <span>{section.title}</span>
              </button>
            ))}
            <h3 className="text-sm font-semibold mt-4 mb-2 text-gray-900 dark:text-gray-100">
              Contacto
            </h3>
            {contactSections.map((section) => (
              <button
                key={section.id}
                onClick={() => handleFormSelect(section.id)}
                className={cn(
                  "flex items-center space-x-2 p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800",
                  activeForm === section.id
                    ? "bg-blue-500 text-white dark:bg-blue-700 dark:text-gray-50"
                    : "text-gray-700 dark:text-gray-300"
                )}
              >
                {section.icon}
                <span>{section.title}</span>
              </button>
            ))}
          </nav>
        </div>
      </motion.div>
    </>
  );
};

export default FormulariosSidebar;
