import React, { useState, useEffect } from 'react';
import './SeedDashboard.css';

import SeedTopNav from './components/SeedTopNav';
import SeedActionBar from './components/SeedActionBar';
import SeedCarousel from './components/SeedCarousel';
import SeedDashboardLayout from './components/SeedDashboardLayout';
import SeedFolderModal from './components/SeedFolderModal';
import SeedPatientsListView from './components/SeedPatientsListView';
import SeedAddPatientModal from './components/SeedAddPatientModal';
import SeedOnboardingDrive from './components/SeedOnboardingDrive';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Seed2Phase } from '../../core/packages/seed2/Seed2Phase';

export default function SeedApp() {
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [currentView, setCurrentView] = useState<'CAROUSEL' | 'PATIENTS_LIST'>('CAROUSEL');
  const [openedFolder, setOpenedFolder] = useState<{folder: any, rect?: DOMRect} | null>(null);
  const [isAddPatientOpen, setIsAddPatientOpen] = useState(false);
  const [activePatient, setActivePatient] = useState<any>(null);
  const [isFolderHovered, setIsFolderHovered] = useState(false);

  // Seed 2 Popup State
  const [isSeed2Open, setIsSeed2Open] = useState(false);
  const [seed2PatientData, setSeed2PatientData] = useState<any>(null);

  // Estados para Google Drive Onboarding
  const [isCheckingDrive, setIsCheckingDrive] = useState(true);
  const [hasDriveConnected, setHasDriveConnected] = useState(false);

  useEffect(() => {
    checkDriveStatus();
  }, []);

  const checkDriveStatus = async () => {
    try {
      // 0. Comprobación rápida para Google Login frontend
      const seedUserStr = sessionStorage.getItem('seed_user');
      if (seedUserStr) {
        try {
          const seedUser = JSON.parse(seedUserStr);
          if (seedUser && seedUser.googleAccessToken) {
            
            // INTENTAR CREAR O VERIFICAR CARPETA EN GOOGLE DRIVE
            try {
              const query = encodeURIComponent("name = 'Dentaxy' and mimeType = 'application/vnd.google-apps.folder' and trashed = false");
              const searchRes = await fetch(`https://www.googleapis.com/drive/v3/files?q=${query}&fields=files(id, name)`, {
                headers: { Authorization: `Bearer ${seedUser.googleAccessToken}` }
              });
              const searchData = await searchRes.json();
              
              if (!searchData.files || searchData.files.length === 0) {
                // No existe, crearla
                await fetch('https://www.googleapis.com/drive/v3/files', {
                  method: 'POST',
                  headers: {
                    'Authorization': `Bearer ${seedUser.googleAccessToken}`,
                    'Content-Type': 'application/json'
                  },
                  body: JSON.stringify({
                    name: 'Dentaxy',
                    mimeType: 'application/vnd.google-apps.folder'
                  })
                });
                console.log("Carpeta 'Dentaxy' creada exitosamente en Google Drive.");
              } else {
                console.log("La carpeta 'Dentaxy' ya existe en Google Drive.");
              }
            } catch (driveErr) {
              console.error("Error al verificar/crear la carpeta de Google Drive:", driveErr);
            }

            setHasDriveConnected(true);
            setIsCheckingDrive(false);
            return;
          }
        } catch (e) {
          console.error("Error parsing seed_user:", e);
        }
      }

      const isLocalHost = 
        window.location.hostname === 'localhost' || 
        window.location.hostname === '127.0.0.1' || 
        window.location.hostname.startsWith('192.168.') || 
        window.location.hostname.startsWith('10.') || 
        window.location.hostname.startsWith('172.') || 
        window.location.hostname.endsWith('.local');

      // 0.5 Comprobación rápida para simulación local (Desarrollo)
      const isSimulated = sessionStorage.getItem('drive_connected_simulated') === 'true';
      if (isSimulated || isLocalHost) {
        setHasDriveConnected(true);
        setIsCheckingDrive(false);
        return;
      }

      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) {
        setIsCheckingDrive(false);
        return;
      }

      // 1. Verificamos si regresamos del flujo OAuth con un token en el hash
      const hash = window.location.hash;
      if (hash.includes('oauth_token=')) {
        const token = new URLSearchParams(hash.replace('#', '?')).get('oauth_token');
        if (token) {
          // Guardamos permanentemente el token en Supabase
          await supabase.from('doctor_integrations').upsert({
            doctor_id: session.user.id,
            provider: 'google_drive',
            refresh_token: token
          }, { onConflict: 'doctor_id, provider' });
          
          // Limpiamos la URL por seguridad
          window.history.replaceState(null, '', window.location.pathname);
          setHasDriveConnected(true);
          setIsCheckingDrive(false);
          return;
        }
      }

      // 2. Si no venimos del OAuth, verificamos si ya existe el token en BD
      const { data, error } = await supabase
        .from('doctor_integrations')
        .select('id')
        .eq('doctor_id', session.user.id)
        .eq('provider', 'google_drive')
        .maybeSingle();

      if (data) {
        setHasDriveConnected(true);
      } else {
        // 3. Si no hay integración pero el usuario solicitó vincular en el login, redirigimos automáticamente
        const driveRequested = sessionStorage.getItem('drive_connect_requested') === 'true';
        if (driveRequested) {
          sessionStorage.removeItem('drive_connect_requested');
          window.location.href = `/api/auth/google/login?user_id=${session.user.id}`;
          return;
        }
      }
    } catch (err) {
      console.error("Error validando la integración de Google Drive:", err);
    } finally {
      setIsCheckingDrive(false);
    }
  };

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

  if (isCheckingDrive) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-[#0c0c0f] text-white">
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 rounded-full border-2 border-emerald-500 border-t-transparent animate-spin"></div>
          <span className="text-sm font-medium text-slate-400 tracking-wider">VERIFICANDO SEGURIDAD...</span>
        </div>
      </div>
    );
  }

  if (!hasDriveConnected) {
    // Bloqueamos el acceso al Dashboard y forzamos el Onboarding
    return (
      <div className={`seed-dashboard flex flex-col h-screen overflow-hidden ${theme === 'dark' ? 'dark' : 'light-theme'}`}>
        <SeedOnboardingDrive />
      </div>
    );
  }

  return (
    <div className={`seed-dashboard flex flex-col h-screen overflow-hidden ${theme === 'dark' ? 'dark' : 'light-theme'}`}>
      
      {/* Navegación Superior */}
      <div className={`transition-all duration-500 ${isFolderHovered ? 'blur-[2px] opacity-60 pointer-events-none' : ''}`}>
        <SeedTopNav theme={theme} toggleTheme={toggleTheme} />
      </div>
      
      {/* Barra de Filtros */}
      <div className={`transition-all duration-500 ${isFolderHovered ? 'blur-[2px] opacity-60 pointer-events-none' : ''}`}>
        <SeedActionBar 
          onNavigate={handleNavigation} 
          currentView={currentView === 'CAROUSEL' ? 'CAROUSEL' : 'PATIENTS_LIST'} 
        />
      </div>
      
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
         <div className={`flex-1 flex items-center justify-center min-h-[320px] max-h-[380px] mt-2 relative w-full px-16 transition-all duration-500 ${isFolderHovered ? 'blur-[2px] opacity-60 pointer-events-none' : ''}`}>
            
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
                onActivePatientChange={setActivePatient}
              />
            ) : (
              <SeedPatientsListView />
            )}

         </div>
         
         {/* Grid Inferior (Key Dates, Compliance, Event) */}
         <div className="pb-6 relative z-50">
           <SeedDashboardLayout 
             activePatient={activePatient} 
             isFolderHovered={isFolderHovered}
             onFolderHoverChange={setIsFolderHovered}
             onOpenFolder={(folder, rect) => setOpenedFolder({ folder, rect })}
           />
         </div>
         
      </div>

      {/* Modal de Vista Detallada de Carpeta */}
      {openedFolder && (
        <SeedFolderModal 
          folder={openedFolder.folder} 
          originRect={openedFolder.rect}
          onClose={() => setOpenedFolder(null)} 
          activePatient={activePatient}
          onOpenSeed2={(patient) => {
            setSeed2PatientData(patient);
            setIsSeed2Open(true);
            setOpenedFolder(null);
          }}
        />
      )}

      {/* Popup de Registro de Pacientes */}
      <SeedAddPatientModal 
        isOpen={isAddPatientOpen}
        onClose={() => setIsAddPatientOpen(false)}
      />

      {/* Seed 2.0 Popup Overlay */}
      <AnimatePresence>
        {isSeed2Open && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40 backdrop-blur-md p-4 sm:p-8"
          >
            <div className="w-full h-full max-w-[1500px] rounded-[2.5rem] overflow-hidden relative">
               <Seed2Phase 
                 patientData={seed2PatientData} 
                 onClose={() => setIsSeed2Open(false)} 
                 isPopup={true} 
               />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
