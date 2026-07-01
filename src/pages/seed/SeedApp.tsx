import React, { useState, useEffect } from 'react';
import './SeedDashboard.css';

import SeedTopNav from './components/SeedTopNav';
import SeedCarousel from './components/SeedCarousel';
import SeedDashboardLayout from './components/SeedDashboardLayout';
import SeedFolderModal from './components/SeedFolderModal';
import SeedPatientsListView from './components/SeedPatientsListView';
import SeedAddPatientModal from './components/SeedAddPatientModal';
import SeedAddPatientView from './components/SeedAddPatientView';
import SeedFolderDashboard from './components/SeedFolderDashboard';
import SeedOnboardingDrive from './components/SeedOnboardingDrive';
import { ChevronLeft, ChevronRight, X, Bell, Printer, Download, Link2, Check } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Seed2Phase } from '../../core/packages/seed2/Seed2Phase';
import { useAuthStore } from '@/store/useAuthStore';
import { toast } from 'sonner';
import { QRCodeSVG } from 'qrcode.react';

export default function SeedApp() {
  // Integración de AuthStore y derivación de ID de clínica único
  const { doctor } = useAuthStore();
  const doctorName = doctor?.name || 'Alejandro Zavala';
  const clinicId = doctorName.toLowerCase().includes('zavala') 
    ? 'GZ-2026' 
    : `${doctorName.split(' ').map(n => n[0]).join('')}-2026`.toUpperCase();

  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [currentView, setCurrentView] = useState<'CAROUSEL' | 'PATIENTS_LIST'>('CAROUSEL');
  const [openedFolder, setOpenedFolder] = useState<{folder: any, rect?: DOMRect} | null>(null);
  const [isAddPatientOpen, setIsAddPatientOpen] = useState(false);
  const [activePatient, setActivePatient] = useState<any>(null);
  const [isFolderHovered, setIsFolderHovered] = useState(false);

  // Estados de Modo Pregunta en Dex
  const [isQuestionMode, setIsQuestionMode] = useState(false);
  const [questionType, setQuestionType] = useState<'NEW_PATIENT' | 'INIT_EXPEDIENTE' | null>(null);

  const [showQR, setShowQR] = useState(false);
  const [patientsList, setPatientsList] = useState<any[]>([]);
  const [selectedPatientIndex, setSelectedPatientIndex] = useState(0);
  
  // Paciente en sala de espera pendiente
  const [pendingIntake, setPendingIntake] = useState<any>(null);

  // Datos recibidos desde el celular del paciente
  const [patientIntakeData, setPatientIntakeData] = useState<{name?: string, reason?: string}>({});

  const [isOpenQR, setIsOpenQR] = useState(false);
  const [activeClinicQR, setActiveClinicQR] = useState('');
  const [isCopied, setIsCopied] = useState(false);

  useEffect(() => {
    if (clinicId) {
      setActiveClinicQR(clinicId);
    }
  }, [clinicId]);

  const handleConfirmQuestion = (type: 'NEW_PATIENT' | 'INIT_EXPEDIENTE') => {
    if (type === 'NEW_PATIENT') {
      setIsAddPatientOpen(true);
    } else if (type === 'INIT_EXPEDIENTE') {
      setSeed2PatientData(activePatient);
      setIsSeed2Open(true);
    }
  };

  // Seed 2 Popup State
  const [isSeed2Open, setIsSeed2Open] = useState(false);
  const [seed2PatientData, setSeed2PatientData] = useState<any>(null);

  // Estados para Google Drive Onboarding
  const [isCheckingDrive, setIsCheckingDrive] = useState(true);
  const [hasDriveConnected, setHasDriveConnected] = useState(false);

  useEffect(() => {
    checkDriveStatus();
  }, []);

  useEffect(() => {
    const handlePatientLinked = (e: Event) => {
      const customEvent = e as CustomEvent;
      const { name } = customEvent.detail;
      
      const newLinkedPatient = {
        id: `LOBBY-${Date.now().toString().substring(7)}`,
        name: name,
        appProperties: {
          motivo: 'Odontalgia severa en órgano 46',
          alergias: 'Ninguna reportada',
          telefono: '55 9876 5432',
          correo: 'paciente.lobby@dentaxy.com'
        }
      };

      setPatientsList(prev => {
        const exists = prev.some(p => p.name === name);
        if (exists) return prev;
        return [newLinkedPatient, ...prev];
      });

      setActivePatient(newLinkedPatient);
      setSelectedPatientIndex(0);

      setTimeout(() => {
        setIsSeed2Open(true);
      }, 1000);
    };

    const handleCreatePatientLocal = (e: Event) => {
      const customEvent = e as CustomEvent;
      const patientData = customEvent.detail;
      
      const newPatient = {
        id: `MANUAL-${Date.now().toString().substring(7)}`,
        name: patientData.name,
        appProperties: {
          motivo: patientData.motivo || 'Valoración inicial',
          alergias: patientData.alergias || 'Ninguna',
          telefono: patientData.telefono || 'Sin teléfono',
          edad: `${patientData.edad} años`,
          genero: patientData.genero || 'Masculino',
          estatus: patientData.estatus || 'Primera Cita',
          fase: 'Fase 1 (Diagnóstico)',
          odontograma: '0/32 Órganos Marcados'
        }
      };

      setPatientsList(prev => {
        const exists = prev.some(p => p.name === patientData.name);
        if (exists) return prev;
        return [newPatient, ...prev];
      });

      setActivePatient(newPatient);
      setSelectedPatientIndex(0);
      setIsQuestionMode(false);
      setQuestionType(null);
      
      toast.success(`Paciente ${patientData.name} creado exitosamente.`);
    };

    window.addEventListener('patientLinked', handlePatientLinked);
    window.addEventListener('createNewPatientLocal', handleCreatePatientLocal);
    return () => {
      window.removeEventListener('patientLinked', handlePatientLinked);
      window.removeEventListener('createNewPatientLocal', handleCreatePatientLocal);
    };
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

  // --------------------------------------------------------------------------
  // Supabase Broadcast Listener para el Lobby de la Clínica
  // --------------------------------------------------------------------------
  useEffect(() => {
    if (!clinicId) return;

    const channel = supabase.channel(`clinic-lobby-${clinicId}`, {
      config: { broadcast: { self: false } }
    });

    channel.on(
      'broadcast',
      { event: 'patient_submitted' },
      ({ payload }) => {
        console.log('Paciente enviado desde sala de espera:', payload);
        if (payload?.fullName) {
          setPendingIntake(payload);
          toast.info(`🔔 Nuevo ingreso: ${payload.nickname || payload.fullName} está en sala de espera.`);
        }
      }
    ).subscribe();

    return () => {
      channel.unsubscribe();
    };
  }, [clinicId]);

  const handleAcceptPatient = () => {
    if (!pendingIntake) return;

    // 1. Enviar handshake de aceptación en el canal del paciente
    const patientCh = supabase.channel(`patient-session-${pendingIntake.patientSessionId}`);
    patientCh.subscribe((status) => {
      if (status === 'SUBSCRIBED') {
        patientCh.send({
          type: 'broadcast',
          event: 'patient_accepted',
          payload: {}
        });
        
        // Timeout para desconectarse limpiamente
        setTimeout(() => {
          patientCh.unsubscribe();
        }, 1000);
      }
    });

    // 2. Cargar los datos del paciente para abrir el expediente
    const simulatedPatient = {
      id: pendingIntake.patientSessionId,
      name: pendingIntake.fullName,
      nickname: pendingIntake.nickname,
      whatsapp: pendingIntake.whatsapp,
      email: pendingIntake.email,
      reason: pendingIntake.reason,
      date: new Date().toLocaleDateString()
    };

    setActivePatient(simulatedPatient);
    setPatientIntakeData({
      name: pendingIntake.fullName,
      reason: pendingIntake.reason
    });
    
    // Abrir expediente Seed 2.0
    setIsSeed2Open(true);
    setPendingIntake(null);
    setShowQR(false);
  };

  const handleRejectPatient = () => {
    setPendingIntake(null);
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

  const handleOpenFolder = (folder: any) => {
    // No hacer nada al presionar la carpeta
  };

  const handleOpenAddPatient = () => {
    setQuestionType('NEW_PATIENT');
    setIsQuestionMode(true);
  };

  const lobbyUrl = `${window.location.origin}/x/${activeClinicQR}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(lobbyUrl);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    printWindow.document.write(`
      <html>
        <head>
          <title>Lobby Digital - Dentaxy Technologies</title>
          <style>
            body {
              font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
              display: flex;
              flex-direction: column;
              align-items: center;
              justify-content: center;
              height: 100vh;
              margin: 0;
              background-color: #ffffff;
              color: #0f172a;
              text-align: center;
            }
            .container {
              border: 1px solid #e2e8f0;
              padding: 40px;
              border-radius: 24px;
              box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.05);
              max-width: 400px;
            }
            .logo {
              font-size: 24px;
              font-weight: 800;
              letter-spacing: -0.03em;
              margin-bottom: 24px;
              color: #7c3aed;
            }
            .qr-placeholder {
              margin: 20px 0;
              padding: 20px;
              background: #f8fafc;
              border-radius: 16px;
              display: inline-block;
            }
            .instructions {
              font-size: 14px;
              color: #475569;
              margin-top: 16px;
              line-height: 1.5;
            }
            .url {
              font-family: monospace;
              font-size: 12px;
              background: #f1f5f9;
              padding: 6px 12px;
              border-radius: 6px;
              margin-top: 12px;
              display: inline-block;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="logo">DENTAXY TECHNOLOGIES</div>
            <div class="qr-placeholder">
              <img src="https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(lobbyUrl)}&color=0f172a&bgcolor=ffffff" width="220" height="220"/>
            </div>
            <div class="instructions">
              <strong>Escanea para iniciar tu experiencia digital con Dex.</strong><br>
              Tu expediente y consentimiento clínico se generarán de manera segura.
            </div>
            <div class="url">${window.location.host}/x/${activeClinicQR}</div>
          </div>
          <script>
            window.onload = function() {
              window.print();
            }
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  const handleDownload = () => {
    handlePrint();
  };

  return (
    <div className={`seed-dashboard flex flex-col h-screen overflow-hidden relative ${theme === 'dark' ? 'dark' : 'light-theme'}`}>
      
      {/* Overlay de Desenfoque Global */}
      {isQuestionMode && (
        <div 
          className="fixed inset-0 z-40 bg-black/10 dark:bg-black/20 backdrop-blur-sm transition-all duration-500 animate-in fade-in"
          onClick={() => setIsQuestionMode(false)}
        />
      )}

      {/* Navegación Superior */}
      <div className={`transition-all duration-500 ${(isQuestionMode || isSeed2Open) ? 'blur-[3px] opacity-85 pointer-events-none' : isFolderHovered ? 'blur-[2px] opacity-60 pointer-events-none' : ''}`}>
        <SeedTopNav theme={theme} toggleTheme={toggleTheme} />
      </div>
      

      {/* Contenido Principal sin Scroll */}
      <div className="flex-1 overflow-hidden relative flex flex-col justify-center pb-48">
         
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
          <div className={`flex items-center justify-center min-h-[320px] max-h-[380px] relative w-full px-16 transition-all duration-500 ${(isQuestionMode || isSeed2Open) ? 'blur-[3px] opacity-85 pointer-events-none' : isFolderHovered ? 'blur-[2px] opacity-60 pointer-events-none' : ''}`}>
            
            {/* Contenido Dinámico */}
            <SeedCarousel 
              onOpenFolder={(folder, rect) => handleOpenFolder(folder)} 
              onOpenAddPatient={handleOpenAddPatient}
              onActivePatientChange={setActivePatient}
              onPatientsLoad={setPatientsList}
            />

         </div>
         
          {/* Grid Inferior (Key Dates, Compliance, Event) */}
          <div className="fixed bottom-0 left-0 right-0 z-50">
            <SeedDashboardLayout 
              activePatient={activePatient} 
              isFolderHovered={false}
              onFolderHoverChange={() => {}}
              onOpenFolder={(folder, rect) => handleOpenFolder(folder)}
              onOpenAddPatient={handleOpenAddPatient}
              isQuestionMode={isQuestionMode || isSeed2Open}
              setIsQuestionMode={setIsQuestionMode}
              questionType={questionType}
              onConfirmQuestion={handleConfirmQuestion}
              theme={theme}
              onOpenQR={(code) => {
                setActiveClinicQR(code);
                setIsOpenQR(true);
              }}
              isOpenQR={isOpenQR}
            />
          </div>
         
      </div>



      {/* Popup de Registro de Pacientes */}
      <SeedAddPatientModal 
        isOpen={isAddPatientOpen}
        onClose={() => setIsAddPatientOpen(false)}
      />

      {/* Dashboard del Expediente (Metamorfosis) */}
      {showQR && (
        <SeedFolderDashboard 
          patientsList={patientsList}
          initialActiveIndex={selectedPatientIndex}
          clinicId={clinicId}
          theme={theme}
          onClose={() => setShowQR(false)}
        />
      )}

      {/* Seed 2.0 Popup Overlay */}
      <AnimatePresence>
        {isSeed2Open && (
          <motion.div 
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.95 }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/40 backdrop-blur-md"
          >
            <div className="w-full max-w-5xl h-[85vh] bg-[var(--seed-bg)] rounded-[24px] shadow-2xl overflow-hidden border border-white/10 flex flex-col relative">
              <Seed2Phase 
                patientData={activePatient} 
                isPopup={true} 
                onClose={() => setIsSeed2Open(false)} 
                intakeData={patientIntakeData}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── EXPANSIÓN CINEMÁTICA (Modal Flotante Centro de Pantalla, nivel superior) ── */}
      {isOpenQR && (
        <div className="fixed inset-0 z-[300] flex items-center justify-center p-4 outline-none">
          
          {/* Fondo desenfocado cinematográfico (Click para cerrar) */}
          <div 
            onClick={() => setIsOpenQR(false)}
            className="absolute inset-0 bg-black/50 dark:bg-black/75 backdrop-blur-[16px] transition-all duration-500 animate-in fade-in outline-none"
          />

          {/* Contenedor Central Liquid Glass */}
          <div className={`relative w-full max-w-sm rounded-[32px] p-6 shadow-2xl z-10 border transition-all duration-500 scale-in outline-none focus:outline-none ${
            theme === 'dark' 
              ? 'bg-zinc-950/80 border-white/20 text-white shadow-black/80 shadow-md' 
              : 'bg-white/90 border-white/60 text-slate-800 shadow-slate-300 shadow-lg'
          }`}
          style={{
            backdropFilter: 'blur(20px) saturate(180%)',
            boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)'
          }}>
            
            {/* Brillo reflectivo interior (Toque Liquid Glass) */}
            <div className="absolute inset-0 rounded-[32px] bg-gradient-to-b from-white/10 to-transparent pointer-events-none z-0 border border-t-white/30 border-x-white/20 border-b-transparent"></div>

            {/* Barra Superior Liquid Glass */}
            <div className="relative z-10 flex items-center justify-between mb-6 outline-none">
              <span className="text-[10px] font-black text-amber-500 uppercase tracking-widest">
                QR Quirúrgico
              </span>
              
              <div className="flex items-center gap-2">
                {/* Botón Imprimir (Liquid Glass) */}
                <button 
                  onClick={handlePrint}
                  className="w-8 h-8 rounded-full bg-gradient-to-b from-white/10 to-white/5 border border-white/25 flex items-center justify-center text-zinc-400 hover:text-white dark:hover:text-slate-800 shadow-[inset_0_1px_2px_rgba(255,255,255,0.3)] hover:bg-white/20 transition-all cursor-pointer outline-none focus:outline-none"
                  title="Imprimir cartel"
                >
                  <Printer size={13} />
                </button>
                
                {/* Botón Descargar (Liquid Glass) */}
                <button 
                  onClick={handleDownload}
                  className="w-8 h-8 rounded-full bg-gradient-to-b from-white/10 to-white/5 border border-white/25 flex items-center justify-center text-zinc-400 hover:text-white dark:hover:text-slate-800 shadow-[inset_0_1px_2px_rgba(255,255,255,0.3)] hover:bg-white/20 transition-all cursor-pointer outline-none focus:outline-none"
                  title="Descargar cartel"
                >
                  <Download size={13} />
                </button>

                {/* Botón Cerrar */}
                <button 
                  onClick={() => setIsOpenQR(false)}
                  className="w-8 h-8 rounded-full bg-red-500/10 hover:bg-red-500/20 border border-red-500/25 flex items-center justify-center text-red-500 transition-all cursor-pointer ml-2 outline-none focus:outline-none"
                >
                  <X size={13} />
                </button>
              </div>
            </div>

            {/* QR Quirúrgico Monocromático */}
            <div className="relative z-10 flex flex-col items-center gap-5 my-6 outline-none">
              <div className="p-4 bg-white rounded-2xl shadow-xl flex items-center justify-center border border-slate-100 outline-none">
                <QRCodeSVG
                  value={lobbyUrl}
                  size={200}
                  level="H"
                  bgColor="#ffffff"
                  fgColor="#0c0b0e"
                  className="outline-none"
                />
              </div>

              <div className="text-center outline-none">
                <h4 className="text-md font-bold">{activeClinicQR}</h4>
                <p className="text-[10px] text-zinc-500 mt-1 max-w-[220px]">
                  Escanea para sincronizar y comenzar la historia clínica con Dex.
                </p>
              </div>
            </div>

            {/* Base: URL Súper Corta */}
            <div className="relative z-10 pt-4 border-t border-white/10 flex flex-col items-center outline-none">
              <span className="text-[8px] font-bold text-zinc-500 uppercase tracking-widest mb-1.5">
                Acceso Alternativo
              </span>
              
              <button 
                onClick={handleCopyLink}
                className={`px-3 py-1.5 rounded-xl border flex items-center gap-2 max-w-full truncate hover:scale-[1.02] active:scale-98 transition outline-none focus:outline-none ${
                  theme === 'dark' ? 'bg-white/5 border-white/5 hover:bg-white/10 text-white' : 'bg-slate-50 border-slate-200 hover:bg-slate-100 text-slate-700'
                }`}
              >
                <Link2 size={11} className="text-zinc-500" />
                <span className="text-[10.5px] font-mono tracking-wider truncate">
                  {window.location.host}/x/{activeClinicQR}
                </span>
                {isCopied ? (
                  <Check size={11} className="text-emerald-500 ml-1" />
                ) : (
                  <span className="text-[8px] font-bold text-zinc-500 bg-white/5 px-1.5 py-0.5 rounded border border-white/5 ml-1">Copiar</span>
                )}
              </button>
            </div>

          </div>

        </div>
      )}

    </div>
  );
}
