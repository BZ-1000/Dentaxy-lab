
import React, { useEffect, useState } from 'react';
import { Dock, DockIcon, DockItem, DockLabel } from '@/components/ui/dock';
import { 
  HomeIcon, 
  MessageCircle, 
  Settings, 
  HelpCircle, 
  User,
  Brain,
  Microscope,
  Stethoscope
} from 'lucide-react';
import { useAnalysisMode } from '@/contexts/AnalysisModeContext';

export function AppleStyleDock() {
  const { isAnalysisMode, setAnalysisMode } = useAnalysisMode();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-2 sm:bottom-4 left-1/2 transform -translate-x-1/2 z-50">
      <Dock 
        magnification={50} 
        distance={100}
        panelHeight={40}
        className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg border border-gray-200/50 dark:border-gray-700/50 shadow-xl"
      >
        <DockItem onClick={() => window.location.href = '/'}>
          <DockIcon>
            <HomeIcon className="h-4 w-4 sm:h-5 sm:w-5 text-gray-700 dark:text-gray-300" />
          </DockIcon>
          <DockLabel>Inicio</DockLabel>
        </DockItem>
        
        <DockItem onClick={() => setAnalysisMode(!isAnalysisMode)}>
          <DockIcon>
            <Brain className={`h-4 w-4 sm:h-5 sm:w-5 ${isAnalysisMode ? 'text-blue-600' : 'text-gray-700 dark:text-gray-300'}`} />
          </DockIcon>
          <DockLabel>{isAnalysisMode ? 'Desactivar IA' : 'Activar IA'}</DockLabel>
        </DockItem>

        <DockItem onClick={() => alert('Función próximamente')}>
          <DockIcon>
            <Microscope className="h-4 w-4 sm:h-5 sm:w-5 text-gray-700 dark:text-gray-300" />
          </DockIcon>
          <DockLabel>Análisis</DockLabel>
        </DockItem>

        <DockItem onClick={() => alert('Función próximamente')}>
          <DockIcon>
            <Stethoscope className="h-4 w-4 sm:h-5 sm:w-5 text-gray-700 dark:text-gray-300" />
          </DockIcon>
          <DockLabel>Consulta</DockLabel>
        </DockItem>

        <DockItem onClick={() => alert('Función próximamente')}>
          <DockIcon>
            <MessageCircle className="h-4 w-4 sm:h-5 sm:w-5 text-gray-700 dark:text-gray-300" />
          </DockIcon>
          <DockLabel>Chat</DockLabel>
        </DockItem>

        <DockItem onClick={() => alert('Función próximamente')}>
          <DockIcon>
            <User className="h-4 w-4 sm:h-5 sm:w-5 text-gray-700 dark:text-gray-300" />
          </DockIcon>
          <DockLabel>Perfil</DockLabel>
        </DockItem>

        <DockItem onClick={() => alert('Función próximamente')}>
          <DockIcon>
            <Settings className="h-4 w-4 sm:h-5 sm:w-5 text-gray-700 dark:text-gray-300" />
          </DockIcon>
          <DockLabel>Ajustes</DockLabel>
        </DockItem>

        <DockItem onClick={() => alert('Función próximamente')}>
          <DockIcon>
            <HelpCircle className="h-4 w-4 sm:h-5 sm:w-5 text-gray-700 dark:text-gray-300" />
          </DockIcon>
          <DockLabel>Ayuda</DockLabel>
        </DockItem>
      </Dock>
    </div>
  );
}
