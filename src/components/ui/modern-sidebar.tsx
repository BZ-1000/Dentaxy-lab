import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Home, User, Settings, Calendar, FileText, LayoutDashboard } from 'lucide-react';

interface ModernSidebarProps {
  isOpen: boolean;
  onToggle: () => void;
  onSectionChange: (sectionId: string) => void;
  activeSection: string;
  children: React.ReactNode;
}

interface Section {
  id: string;
  title: string;
  subtitle: string;
  icon: React.ReactNode;
}

const sections: Section[] = [
  {
    id: 'anamnesis',
    title: 'Anamnesis',
    subtitle: 'Entrevista al paciente',
    icon: <User size={20} />
  },
  {
    id: 'exploracion',
    title: 'Exploración',
    subtitle: 'Examen físico detallado',
    icon: <Calendar size={20} />
  },
  {
    id: 'diagnostico',
    title: 'Diagnóstico',
    subtitle: 'Identificación del problema',
    icon: <FileText size={20} />
  },
  {
    id: 'plan',
    title: 'Plan de Tratamiento',
    subtitle: 'Estrategia a seguir',
    icon: <LayoutDashboard size={20} />
  },
  {
    id: 'configuracion',
    title: 'Configuración',
    subtitle: 'Ajustes y preferencias',
    icon: <Settings size={20} />
  }
];

const ModernSidebar = ({ isOpen, onToggle, onSectionChange, activeSection, children }: ModernSidebarProps) => {
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <>
      {/* Backdrop */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/20 z-40 lg:hidden"
            onClick={onToggle}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.div
        initial={false}
        animate={{
          x: isOpen ? 0 : -320,
          transition: { type: "spring", damping: 30, stiffness: 300 }
        }}
        className="fixed left-0 top-0 h-full w-80 bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl border-r border-gray-200/50 dark:border-gray-700/50 z-50 shadow-2xl"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200/50 dark:border-gray-700/50">
          <motion.h2 
            className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            Historia Clínica
          </motion.h2>
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggle}
            className="hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-2 max-h-[calc(100vh-200px)] overflow-y-auto">
          {sections.map((section, index) => (
            <motion.div
              key={section.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <button
                onClick={() => onSectionChange(section.id)}
                className={`w-full text-left p-3 rounded-xl transition-all duration-200 group hover:bg-gray-100 dark:hover:bg-gray-800 ${
                  activeSection === section.id
                    ? 'bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 shadow-sm'
                    : ''
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className={`text-lg ${
                    activeSection === section.id 
                      ? 'text-blue-600 dark:text-blue-400' 
                      : 'text-gray-500 dark:text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-300'
                  }`}>
                    {section.icon}
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className={`font-medium text-sm truncate ${
                      activeSection === section.id 
                        ? 'text-blue-700 dark:text-blue-300' 
                        : 'text-gray-700 dark:text-gray-300'
                    }`}>
                      {section.title}
                    </div>
                    <div className={`text-xs truncate mt-1 ${
                      activeSection === section.id 
                        ? 'text-blue-600 dark:text-blue-400' 
                        : 'text-gray-500 dark:text-gray-400'
                    }`}>
                      {section.subtitle}
                    </div>
                  </div>
                  {activeSection === section.id && (
                    <motion.div
                      layoutId="activeIndicator"
                      className="w-2 h-2 bg-blue-500 rounded-full"
                    />
                  )}
                </div>
              </button>
            </motion.div>
          ))}
        </nav>

        {/* Footer */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200/50 dark:border-gray-700/50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
          <div className="text-xs text-gray-500 dark:text-gray-400 text-center">
            © 2024 Dentaxy. Todos los derechos reservados.
          </div>
        </div>
      </motion.div>

      {/* Main content area with overlay */}
      <motion.div
        animate={{
          marginLeft: isOpen ? 320 : 0,
          transition: { type: "spring", damping: 30, stiffness: 300 }
        }}
        className="min-h-screen transition-all duration-300 lg:block hidden"
      >
        {children}
      </motion.div>

      {/* Mobile content */}
      <div className="lg:hidden">
        {children}
      </div>
    </>
  );
};

export default ModernSidebar;
