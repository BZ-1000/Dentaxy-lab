import React, { useState } from 'react';
import './SeedDashboard.css';

import SeedTopNav from './components/SeedTopNav';
import SeedActionBar from './components/SeedActionBar';
import SeedCarousel from './components/SeedCarousel';
import SeedDashboardLayout from './components/SeedDashboardLayout';
import SeedFolderModal from './components/SeedFolderModal';
import SeedPatientsListView from './components/SeedPatientsListView';
import SeedAddPatientModal from './components/SeedAddPatientModal';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function SeedApp() {
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [currentView, setCurrentView] = useState<'CAROUSEL' | 'PATIENTS_LIST'>('CAROUSEL');
  const [openedFolder, setOpenedFolder] = useState<{folder: any, rect?: DOMRect} | null>(null);
  const [isAddPatientOpen, setIsAddPatientOpen] = useState(false);

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  const handleNextView = () => {
    if (currentView === 'CAROUSEL') setCurrentView('PATIENTS_LIST');
    else setCurrentView('CAROUSEL');
  };

  const handlePrevView = () => {
    if (currentView === 'CAROUSEL') setCurrentView('PATIENTS_LIST');
    else setCurrentView('CAROUSEL');
  };

  const handleNavigation = (view: 'CAROUSEL' | 'ADD_PATIENT' | 'PATIENTS_LIST') => {
    if (view === 'ADD_PATIENT') {
      setIsAddPatientOpen(true);
    } else {
      setCurrentView(view);
    }
  };

  return (
    <div className={`seed-dashboard flex flex-col h-screen overflow-hidden ${theme === 'dark' ? 'dark' : 'light-theme'}`}>
      
      {/* Navegación Superior */}
      <SeedTopNav theme={theme} toggleTheme={toggleTheme} />
      
      {/* Barra de Filtros */}
      <SeedActionBar 
        onNavigate={handleNavigation} 
        currentView={currentView === 'CAROUSEL' ? 'CAROUSEL' : 'PATIENTS_LIST'} 
      />
      
      {/* Contenido Principal sin Scroll */}
      <div className="flex-1 overflow-hidden relative flex flex-col justify-between">
         
         {/* Brillo de fondo central superior */}
         <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[300px] seed-glow-orb-top blur-[120px] rounded-[100%] pointer-events-none z-0"></div>
         
         {/* Orbes de luz ambientales en esquinas inferiores */}
         <div 
           className="absolute bottom-[-150px] left-[-150px] w-[500px] h-[500px] rounded-[100%] blur-[130px] pointer-events-none z-0 opacity-70 transition-all duration-500"
           style={{ backgroundColor: 'var(--seed-glow-orb-1)' }}
         ></div>
         <div 
           className="absolute bottom-[-150px] right-[-150px] w-[550px] h-[550px] rounded-[100%] blur-[140px] pointer-events-none z-0 opacity-70 transition-all duration-500"
           style={{ backgroundColor: 'var(--seed-glow-orb-2)' }}
         ></div>
         
         {/* Área Central (Carrusel / Directorio) */}
         <div className="flex-1 flex items-center justify-center min-h-[320px] max-h-[380px] mt-2 relative w-full px-16">
            
            {/* Flechas de Navegación Globales */}
            <button 
              onClick={handlePrevView}
              className="absolute left-6 z-40 w-12 h-12 rounded-full bg-white dark:bg-[#0c0c0f] border border-slate-200 dark:border-white/5 flex items-center justify-center hover:bg-slate-50 dark:hover:bg-white/5 hover:scale-105 active:scale-95 transition-all cursor-pointer text-slate-400 dark:text-white/40 hover:text-slate-600 dark:hover:text-white shadow-lg"
            >
              <ChevronLeft size={20} />
            </button>
            <button 
              onClick={handleNextView}
              className="absolute right-6 z-40 w-12 h-12 rounded-full bg-white dark:bg-[#0c0c0f] border border-slate-200 dark:border-white/5 flex items-center justify-center hover:bg-slate-50 dark:hover:bg-white/5 hover:scale-105 active:scale-95 transition-all cursor-pointer text-slate-400 dark:text-white/40 hover:text-slate-600 dark:hover:text-white shadow-lg"
            >
              <ChevronRight size={20} />
            </button>

            {/* Contenido Dinámico */}
            {currentView === 'CAROUSEL' ? (
              <SeedCarousel 
                onOpenFolder={(folder, rect) => setOpenedFolder({ folder, rect })} 
                onOpenAddPatient={() => setIsAddPatientOpen(true)}
              />
            ) : (
              <SeedPatientsListView />
            )}

         </div>
         
         {/* Grid Inferior (Key Dates, Compliance, Event) */}
         <div className="pb-6">
           <SeedDashboardLayout />
         </div>
         
      </div>

      {/* Modal de Vista Detallada de Carpeta */}
      {openedFolder && (
        <SeedFolderModal 
          folder={openedFolder.folder} 
          originRect={openedFolder.rect}
          onClose={() => setOpenedFolder(null)} 
        />
      )}

      {/* Popup de Registro de Pacientes */}
      <SeedAddPatientModal 
        isOpen={isAddPatientOpen}
        onClose={() => setIsAddPatientOpen(false)}
      />

    </div>
  );
}
