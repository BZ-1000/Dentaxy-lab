import React, { useState } from 'react';
import './SeedDashboard.css';

import SeedTopNav from './components/SeedTopNav';
import SeedActionBar from './components/SeedActionBar';
import SeedCarousel from './components/SeedCarousel';
import SeedDashboardLayout from './components/SeedDashboardLayout';
import SeedFolderModal from './components/SeedFolderModal';

export default function SeedApp() {
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [openedFolder, setOpenedFolder] = useState<{folder: any, rect?: DOMRect} | null>(null);

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  return (
    <div className={`seed-dashboard flex flex-col h-screen overflow-hidden ${theme === 'light' ? 'light-theme' : ''}`}>
      
      {/* Navegación Superior */}
      <SeedTopNav theme={theme} toggleTheme={toggleTheme} />
      
      {/* Barra de Filtros */}
      <SeedActionBar />
      
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
         
         {/* Carrusel 3D */}
         <div className="flex-1 flex items-center justify-center min-h-[320px] max-h-[380px] mt-2">
           <SeedCarousel onOpenFolder={(folder, rect) => setOpenedFolder({ folder, rect })} />
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

    </div>
  );
}
