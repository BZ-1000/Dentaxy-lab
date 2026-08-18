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
import SeedExpedienteInterface from './components/SeedExpedienteInterface';
import SeedOnboarding from './components/onboarding/SeedOnboarding';
import LivePrescriptionPreview from './components/onboarding/LivePrescriptionPreview';
import { ChevronLeft, ChevronRight, X, Bell, Printer, Download, Link2, Check } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Seed2Phase } from '../../core/packages/seed2/Seed2Phase';
import { useAuthStore } from '@/store/useAuthStore';
import { toast } from 'sonner';
import { QRCodeSVG } from 'qrcode.react';
import { loadDriveSnapshot, isSnapshotFresh } from '../../utils/driveSnapshot';

export default function SeedApp() {
  // Integración de AuthStore y derivación de ID de clínica único
  const { doctor } = useAuthStore();
  const doctorName = doctor?.name || 'Alejandro Zavala';
  const clinicId = doctorName.toLowerCase().includes('zavala') 
    ? 'GZ-2026' 
    : `${doctorName.split(' ').map(n => n[0]).join('')}-2026`.toUpperCase();

  const [theme, setTheme] = useState<'dark' | 'light'>('light');
  const [currentView, setCurrentView] = useState<'CAROUSEL' | 'PATIENTS_LIST' | 'DETROIT'>('CAROUSEL');
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

  // Estados para la interfaz del expediente (glasmorfismo blanco opaco)
  const [isExpedienteOpen, setIsExpedienteOpen] = useState(false);
  const [selectedExpedienteFolder, setSelectedExpedienteFolder] = useState<any>(null);
  
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

  // ── Bridge DEX: sincronizar el paciente activo para comandos de voz ────────
  useEffect(() => {
    if (!activePatient) return;
    window.dispatchEvent(new CustomEvent('dex:activePatient', {
      detail: {
        folderId: activePatient.id,
        name: activePatient.name
      }
    }));
  }, [activePatient]);

  useEffect(() => {
    window.dispatchEvent(new CustomEvent('dex:expedienteState', { detail: { isOpen: isExpedienteOpen } }));
  }, [isExpedienteOpen]);

  // ── Escuchar eventos de DEX para abrir vistas ──────────────────────────
  useEffect(() => {
    const handleDexOpenAddPatient = () => {
      setIsAddPatientOpen(true);
    };
    const handleDexOpenPatientsList = () => {
      setCurrentView('PATIENTS_LIST');
    };
    window.addEventListener('dex:openAddPatient', handleDexOpenAddPatient);
    window.addEventListener('dex:openPatientsList', handleDexOpenPatientsList);
    return () => {
      window.removeEventListener('dex:openAddPatient', handleDexOpenAddPatient);
      window.removeEventListener('dex:openPatientsList', handleDexOpenPatientsList);
    };
  }, []);

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
  
  // Estado para Onboarding de Identidad Clínica (Setup)
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState(false);
  const [doctorProfile, setDoctorProfile] = useState<any>(null);
  const [isProfileCredentialOpen, setIsProfileCredentialOpen] = useState(false);

  useEffect(() => {
    checkDriveStatus();

    // Cargar perfil del doctor si está en localStorage
    const cachedProfile = localStorage.getItem('dentaxy_doctor_profile');
    if (cachedProfile) {
      try {
        const parsed = JSON.parse(cachedProfile);
        setDoctorProfile(parsed);
        setHasCompletedOnboarding(true);
      } catch (e) {
        console.error('Error al cargar perfil local:', e);
      }
    }
  }, []);

  /**
   * Precarga del snapshot de Drive al iniciar la app.
   * Se dispara en background en cuanto Drive está conectado.
   * No bloquea la UI — los datos quedan listos en localStorage
   * para que el carrusel y las fichas abran instantáneamente.
   */
  useEffect(() => {
    if (!hasDriveConnected) return;
    if (isSnapshotFresh()) return; // El snapshot ya está fresco, no recargar

    const preloadSnapshot = async () => {
      try {
        const seedUserStr = sessionStorage.getItem('seed_user');
        if (!seedUserStr) return;
        const seedUser = JSON.parse(seedUserStr);
        const token = seedUser?.googleAccessToken;
        if (!token) return;
        console.log('[DentaxyApp] Precargando snapshot de Drive en background...');
        await loadDriveSnapshot(token);
        console.log('[DentaxyApp] Snapshot listo en localStorage.');
      } catch (err) {
        console.warn('[DentaxyApp] No se pudo precargar el snapshot:', err);
      }
    };

    preloadSnapshot();
  }, [hasDriveConnected]);

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
            
            // Cargar perfil desde Google Drive si no está en caché local
            if (!localStorage.getItem('dentaxy_doctor_profile')) {
              loadProfileFromGoogleDrive(seedUser.googleAccessToken);
            }
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

  const generateProfileHtml = (data: any) => {
    const lines = [
      '<!DOCTYPE html>',
      '<html lang="es">',
      '<head>',
      '  <meta charset="UTF-8">',
      '  <meta name="viewport" content="width=device-width, initial-scale=1.0">',
      '  <title>Perfil Clínico - Dr. ' + (data.doctorName || 'Dentista') + '</title>',
      '  <style>',
      '    body {',
      '      background-color: #f3f4f6;',
      '      font-family: ui-sans-serif, system-ui, sans-serif;',
      '      display: flex;',
      '      justify-content: center;',
      '      align-items: center;',
      '      min-height: 100vh;',
      '      margin: 0;',
      '      padding: 20px;',
      '    }',
      '    .card {',
      '      width: 480px;',
      '      padding: 32px 32px 20px 32px;',
      '      border-radius: 28px;',
      '      background: linear-gradient(135deg, #ffffff, #f3f4f6);',
      '      box-shadow: 12px 12px 28px #b2c1ce, -12px -12px 28px #ffffff;',
      '      border: 1px solid rgba(255,255,255,0.7);',
      '      font-family: monospace;',
      '      color: #262626;',
      '      position: relative;',
      '    }',
      '    .flex-row {',
      '      display: flex;',
      '      gap: 32px;',
      '      width: 100%;',
      '    }',
      '    .col-left {',
      '      display: flex;',
      '      flex-direction: column;',
      '      gap: 12px;',
      '      flex-shrink: 0;',
      '      width: 155px;',
      '    }',
      '    .photo-frame {',
      '      width: 155px;',
      '      height: 195px;',
      '      border: 1px solid #a3a3a3;',
      '      border-radius: 12px;',
      '      overflow: hidden;',
      '      display: flex;',
      '      align-items: center;',
      '      justify-content: center;',
      '      background: #f0f0ed;',
      '      box-shadow: inset 1.5px 1.5px 3px rgba(0,0,0,0.06), 1.5px 1.5px 3px #ffffff;',
      '    }',
      '    .photo-frame img {',
      '      width: 100%;',
      '      height: 100%;',
      '      object-fit: cover;',
      '    }',
      '    .col-right {',
      '      flex: 1;',
      '      display: flex;',
      '      flex-direction: column;',
      '      text-align: left;',
      '      min-width: 0;',
      '    }',
      '    .meta-line {',
      '      font-size: 8px;',
      '      font-weight: 900;',
      '      letter-spacing: 0.15em;',
      '      color: #737373;',
      '      margin-bottom: 2px;',
      '      text-transform: uppercase;',
      '    }',
      '    .doctor-name {',
      '      font-family: "Bruno Ace SC", monospace;',
      '      font-size: 15px;',
      '      font-weight: 900;',
      '      color: #171717;',
      '      letter-spacing: 0.05em;',
      '      text-transform: uppercase;',
      '      line-height: 1.15;',
      '      margin: 0 0 10px 0;',
      '    }',
      '    .detail-grid {',
      '      display: grid;',
      '      grid-template-columns: repeat(2, 1fr);',
      '      gap: 10px;',
      '      margin-top: 6px;',
      '    }',
      '    .detail-box {',
      '      border: 1px solid rgba(229, 229, 229, 0.8);',
      '      border-radius: 10px;',
      '      padding: 6px 8px;',
      '      background: rgba(255,255,255,0.4);',
      '    }',
      '    .detail-label {',
      '      font-size: 7.5px;',
      '      font-weight: 900;',
      '      letter-spacing: 0.1em;',
      '      color: #737373;',
      '      text-transform: uppercase;',
      '    }',
      '    .detail-val {',
      '      font-size: 9px;',
      '      font-weight: 900;',
      '      color: #171717;',
      '      margin-top: 2px;',
      '      text-transform: uppercase;',
      '    }',
      '    .footer-row {',
      '      display: grid;',
      '      grid-template-columns: repeat(12, 1fr);',
      '      gap: 16px;',
      '      margin-top: 14px;',
      '      align-items: end;',
      '      border-top: 1px solid rgba(229, 229, 229, 0.6);',
      '      padding-top: 10px;',
      '    }',
      '    .signature-area {',
      '      max-height: 42px;',
      '      max-width: 100%;',
      '      object-fit: contain;',
      '    }',
      '    .brand-block {',
      '      display: flex;',
      '      align-items: center;',
      '      gap: 4px;',
      '      margin-top: 8px;',
      '      justify-content: flex-end;',
      '    }',
      '    .brand-text {',
      '      font-family: "Bruno Ace SC", monospace;',
      '      font-size: 12px;',
      '      font-weight: 900;',
      '      letter-spacing: 0.25em;',
      '      color: #525252;',
      '    }',
      '    .brand-logo {',
      '      height: 46px;',
      '      width: auto;',
      '    }',
      '  </style>',
      '</head>',
      '<body>',
      '  <div class="card">',
      '    <div class="flex-row">',
      '      <div class="col-left">',
      '        <div class="photo-frame">',
      data.doctorPhoto ? `          <img src="${data.doctorPhoto}" alt="Foto Doctor" />` : '          <div style="color:#a3a3a3;font-size:8px;">FOTO</div>',
      '        </div>',
      '      </div>',
      '      <div class="col-right">',
      '        <div class="meta-line">Identificación Profesional</div>',
      '        <h2 class="doctor-name">' + (data.doctorName || 'Sin Nombre') + '</h2>',
      '        ',
      '        <div class="detail-box">',
      '          <div class="detail-label">Cédula General</div>',
      '          <div class="detail-val">' + (data.cedulaGeneral || 'XXXXXX') + '</div>',
      '        </div>',
      '        <div class="detail-box" style="margin-top:8px;">',
      '          <div class="detail-label">Institución Emisora</div>',
      '          <div class="detail-val">' + (data.institucion || 'SEP') + '</div>',
      '        </div>',
      '        <div class="detail-grid">',
      '          <div class="detail-box">',
      '          <div class="detail-label">Vigencia</div>',
      '          <div class="detail-val" style="color:#10b981;">' + (data.vigencia || 'ACTIVA') + '</div>',
      '        </div>',
      '        <div class="detail-box">',
      '          <div class="detail-label">RFC del Doctor</div>',
      '          <div class="detail-val">' + (data.rfc || 'SIN RFC') + '</div>',
      '        </div>',
      '      </div>',
      '    </div>',
      '  </div>',
      '  <div class="footer-row">',
      '    <div style="grid-column: span 3;">',
      '      <div class="detail-label">QR Acceso</div>',
      '      <div style="font-size:8px;color:#737373;margin-top:4px;">[QR EMBEDDED]</div>',
      '    </div>',
      '    <div style="grid-column: span 4; text-align: center;">',
      '      <div style="min-height: 40px; display: flex; align-items: center; justify-content: center;">',
      data.signature ? `        <img class="signature-area" src="${data.signature}" alt="Firma" />` : '        <span style="font-size:7px;color:#a3a3a3;font-style:italic;">PENDIENTE</span>',
      '      </div>',
      '      <div style="border-top: 1px dashed rgba(0,0,0,0.15); margin-top:4px; font-size:6.5px; font-weight:900; color:#737373;">FIRMA DIGITAL</div>',
      '    </div>',
      '    <div style="grid-column: span 5; text-align: right;">',
      '      <div class="detail-val" style="font-size:11px;">' + (data.telefono || 'Sin teléfono') + '</div>',
      '      <div class="detail-label" style="font-size:8px; margin-top:2px;">' + (data.email || 'doctor@dentaxy.com') + '</div>',
      '      <div class="brand-block">',
      '        <span class="brand-text">COFILD</span>',
      '        <img class="brand-logo" src="https://dentaxy.com/brand/dentistry-logo.png" onerror="this.style.display=\'none\'" />',
      '      </div>',
      '    </div>',
      '  </div>',
      '</div>',
      '  <script id="dentaxy-profile-data" type="application/json">',
      JSON.stringify(data, null, 2),
      '  </script>',
      '</body>',
      '</html>'
    ];
    return lines.join('\n');
  };

  const loadProfileFromGoogleDrive = async (accessToken: string) => {
    try {
      const folderQuery = encodeURIComponent("name = 'Dentaxy' and mimeType = 'application/vnd.google-apps.folder' and trashed = false");
      const folderRes = await fetch(`https://www.googleapis.com/drive/v3/files?q=${folderQuery}&fields=files(id, name)`, {
        headers: { Authorization: `Bearer ${accessToken}` }
      });
      const folderData = await folderRes.json();
      if (!folderData.files || folderData.files.length === 0) return;
      const folderId = folderData.files[0].id;

      const fileQuery = encodeURIComponent(`name = 'dentaxy_perfil.html' and '${folderId}' in parents and trashed = false`);
      const fileRes = await fetch(`https://www.googleapis.com/drive/v3/files?q=${fileQuery}&fields=files(id, name)`, {
        headers: { Authorization: `Bearer ${accessToken}` }
      });
      const fileData = await fileRes.json();
      if (!fileData.files || fileData.files.length === 0) return;
      const fileId = fileData.files[0].id;

      const mediaRes = await fetch(`https://www.googleapis.com/drive/v3/files/${fileId}?alt=media`, {
        headers: { Authorization: `Bearer ${accessToken}` }
      });
      const htmlText = await mediaRes.text();

      const startTag = '<script id="dentaxy-profile-data" type="application/json">';
      const endTag = '</script>';
      const startIndex = htmlText.indexOf(startTag);
      if (startIndex !== -1) {
        const jsonStart = startIndex + startTag.length;
        const jsonEnd = htmlText.indexOf(endTag, jsonStart);
        if (jsonEnd !== -1) {
          const jsonText = htmlText.substring(jsonStart, jsonEnd).trim();
          const profile = JSON.parse(jsonText);
          
          localStorage.setItem('dentaxy_doctor_profile', JSON.stringify(profile));
          setDoctorProfile(profile);
          setHasCompletedOnboarding(true);
          console.log("Perfil del doctor cargado exitosamente desde Google Drive.");
        }
      }
    } catch (err) {
      console.error("Error al cargar perfil desde Google Drive:", err);
    }
  };

  const saveProfileToGoogleDrive = async (profileData: any) => {
    try {
      const seedUserStr = sessionStorage.getItem('seed_user');
      if (!seedUserStr) return;
      const seedUser = JSON.parse(seedUserStr);
      const accessToken = seedUser?.googleAccessToken;
      if (!accessToken) return;

      const folderQuery = encodeURIComponent("name = 'Dentaxy' and mimeType = 'application/vnd.google-apps.folder' and trashed = false");
      const folderRes = await fetch(`https://www.googleapis.com/drive/v3/files?q=${folderQuery}&fields=files(id, name)`, {
        headers: { Authorization: `Bearer ${accessToken}` }
      });
      const folderData = await folderRes.json();
      let folderId = '';
      if (!folderData.files || folderData.files.length === 0) {
        const createFolderRes = await fetch('https://www.googleapis.com/drive/v3/files', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            name: 'Dentaxy',
            mimeType: 'application/vnd.google-apps.folder'
          })
        });
        const createdFolder = await createFolderRes.json();
        folderId = createdFolder.id;
      } else {
        folderId = folderData.files[0].id;
      }

      const htmlContent = generateProfileHtml({
        ...profileData,
        email: doctor?.email || 'doctor@dentaxy.com'
      });
      const htmlBlob = new Blob([htmlContent], { type: 'text/html' });

      const fileQuery = encodeURIComponent(`name = 'dentaxy_perfil.html' and '${folderId}' in parents and trashed = false`);
      const fileRes = await fetch(`https://www.googleapis.com/drive/v3/files?q=${fileQuery}&fields=files(id, name)`, {
        headers: { Authorization: `Bearer ${accessToken}` }
      });
      const fileData = await fileRes.json();
      
      const form = new FormData();
      
      if (fileData.files && fileData.files.length > 0) {
        const fileId = fileData.files[0].id;
        form.append('metadata', new Blob([JSON.stringify({
          name: 'dentaxy_perfil.html',
          mimeType: 'text/html'
        })], { type: 'application/json' }));
        form.append('file', htmlBlob);

        await fetch(`https://www.googleapis.com/upload/drive/v3/files/${fileId}?uploadType=multipart`, {
          method: 'PATCH',
          headers: { Authorization: `Bearer ${accessToken}` },
          body: form
        });
        console.log("Perfil del doctor actualizado en Google Drive.");
      } else {
        form.append('metadata', new Blob([JSON.stringify({
          name: 'dentaxy_perfil.html',
          mimeType: 'text/html',
          parents: [folderId],
          description: `Perfil Clínico de Dentaxy — Dr. ${profileData.doctorName}`
        })], { type: 'application/json' }));
        form.append('file', htmlBlob);

        await fetch('https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart', {
          method: 'POST',
          headers: { Authorization: `Bearer ${accessToken}` },
          body: form
        });
        console.log("Perfil del doctor guardado por primera vez en Google Drive.");
      }
    } catch (err) {
      console.error("Error al guardar perfil en Google Drive:", err);
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
    setSelectedExpedienteFolder(folder);
    setIsExpedienteOpen(true);
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
      <AnimatePresence>
        {currentView !== 'DETROIT' && (
          <motion.div 
            key="seed-topnav"
            initial={{ y: 0, opacity: 1 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -80, opacity: 0 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className={`transition-all duration-500 ${(isQuestionMode || isSeed2Open || isOpenQR) ? 'blur-[3px] opacity-85 pointer-events-none' : isFolderHovered ? 'blur-[2px] opacity-60 pointer-events-none' : ''}`}
          >
            <SeedTopNav 
              theme={theme} 
              toggleTheme={toggleTheme} 
              doctorProfile={doctorProfile}
              onOpenProfileCredential={() => setIsProfileCredentialOpen(true)}
            />
          </motion.div>
        )}
      </AnimatePresence>
      

      {/* Contenido Principal sin Scroll (Ajustado pb-72 para dar espacio a DEX abierta) */}
      <div className="flex-1 overflow-hidden relative flex flex-col justify-center pb-72">
         
         {/* Brillo de fondo central superior */}
         {currentView !== 'DETROIT' && (
           <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[300px] seed-glow-orb-top blur-[120px] rounded-[100%] pointer-events-none z-0"></div>
         )}
          {/* Orbes de luz ambientales en esquinas inferiores */}
          {currentView !== 'DETROIT' && (
            <>
              <div 
                className="absolute bottom-[-150px] left-[-150px] w-[500px] h-[500px] rounded-[100%] blur-[130px] pointer-events-none z-0 opacity-70 transition-all duration-500"
                style={{ backgroundColor: 'var(--seed-glow-orb-1)' }}
              ></div>
              <div 
                className="absolute bottom-[-150px] right-[-150px] w-[550px] h-[550px] rounded-[100%] blur-[140px] pointer-events-none z-0 opacity-70 transition-all duration-500"
                style={{ backgroundColor: 'var(--seed-glow-orb-2)' }}
              ></div>
            </>
          )}
         
         {/* Área Central (Carrusel / Directorio - Subido con -translate-y-10) */}
         <AnimatePresence>
           {currentView !== 'DETROIT' && (
             <motion.div 
               key="seed-carousel"
               initial={{ scale: 1, opacity: 1, y: -10 }}
               animate={{ scale: 1, opacity: 1, y: -10 }}
               exit={{ scale: 0.9, opacity: 0, y: 120 }}
               transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
               className={`flex items-center justify-center min-h-[320px] max-h-[380px] relative w-full px-16 transition-all duration-500 ${(isQuestionMode || isSeed2Open || isOpenQR) ? 'blur-[3px] opacity-85 pointer-events-none' : isFolderHovered ? 'blur-[2px] opacity-60 pointer-events-none' : ''}`}
             >
               {/* Contenido Dinámico */}
               <SeedCarousel 
                 onOpenFolder={(folder, rect) => handleOpenFolder(folder)} 
                 onOpenAddPatient={handleOpenAddPatient}
                 onActivePatientChange={setActivePatient}
                 onPatientsLoad={setPatientsList}
                 isExpedienteOpen={isExpedienteOpen}
               />
             </motion.div>
           )}
         </AnimatePresence>
         
         {/* Grid Inferior (Key Dates, Compliance, Event) */}
         <AnimatePresence>
           {currentView !== 'DETROIT' && (
             <motion.div 
               key="seed-dashboard-layout"
               initial={{ y: 0, opacity: 1 }}
               animate={{ y: 0, opacity: 1 }}
               exit={{ y: 250, opacity: 0 }}
               transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
               className="fixed bottom-0 left-0 right-0 z-50"
             >
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
                   if (code) {
                     setActiveClinicQR(code);
                     setIsOpenQR(true);
                   } else {
                     setIsOpenQR(false);
                   }
                 }}
                 isOpenQR={isOpenQR}
               />
             </motion.div>
           )}
         </AnimatePresence>

         {/* VISTA DETROIT BECOME HUMAN */}
         <AnimatePresence>
           {/* VISTA DETROIT ELIMINADA POR COMPLETO */}
         </AnimatePresence>
         
      </div>


      {/* Popup de Registro de Pacientes */}
      <SeedAddPatientModal 
        isOpen={isAddPatientOpen}
        onClose={() => setIsAddPatientOpen(false)}
        patientsList={patientsList}
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

      {/* Modal interactivo de Credencial Profesional de Identidad */}
      <AnimatePresence>
        {isProfileCredentialOpen && doctorProfile && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[150] flex items-center justify-center p-6 bg-black/60 backdrop-blur-xl"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 30 }}
              transition={{ type: "spring", damping: 26, stiffness: 220 }}
              className="w-full max-w-lg bg-neutral-900/90 dark:bg-zinc-950/95 rounded-[32px] p-8 border border-white/10 shadow-[0_32px_64px_rgba(0,0,0,0.5)] flex flex-col relative"
            >
              {/* Botón de Cierre */}
              <button 
                onClick={() => setIsProfileCredentialOpen(false)}
                className="absolute top-6 right-6 w-9 h-9 rounded-full bg-white/5 hover:bg-white/15 text-white/70 hover:text-white flex items-center justify-center transition border border-white/5 cursor-pointer focus:outline-none"
              >
                <X size={16} />
              </button>

              <div className="text-center mb-6">
                <span className="text-[10px] uppercase tracking-[0.25em] text-purple-400 font-bold">Seguridad Médica Oficial</span>
                <h3 className="text-lg font-black text-white mt-1" style={{ fontFamily: '"Bruno Ace SC", sans-serif' }}>Credencial COFILD</h3>
                <p className="text-xs text-neutral-400 mt-1">Identidad profesional del odontólogo prescriptor</p>
              </div>

              {/* Contenedor Credencial */}
              <div className="flex justify-center py-2">
                <LivePrescriptionPreview
                  doctorName={doctorProfile.doctorName}
                  cedulaGeneral={doctorProfile.cedulaGeneral}
                  institucion={doctorProfile.institucion}
                  clinicName={doctorProfile.clinicName}
                  calle={doctorProfile.calle}
                  noExt={doctorProfile.noExt}
                  noInt={doctorProfile.noInt}
                  colonia={doctorProfile.colonia}
                  cp={doctorProfile.cp}
                  municipio={doctorProfile.municipio}
                  estado={doctorProfile.estado}
                  telefono={doctorProfile.telefono}
                  doctorPhoto={doctorProfile.doctorPhoto}
                  signature={doctorProfile.signature}
                  rfc={doctorProfile.rfc}
                  fechaNacimiento={doctorProfile.fechaNacimiento}
                  vigencia={doctorProfile.vigencia}
                />
              </div>

              {/* Botones de acción */}
              <div className="flex items-center gap-3 mt-8">
                <button
                  onClick={() => {
                    setIsProfileCredentialOpen(false);
                    setHasCompletedOnboarding(false);
                  }}
                  className="flex-1 h-12 rounded-2xl bg-white text-black font-bold text-xs hover:bg-neutral-100 transition shadow-[0_8px_16px_rgba(255,255,255,0.15)] flex items-center justify-center gap-2 cursor-pointer border-none"
                >
                  <span>Editar Identidad</span>
                </button>
                <button
                  onClick={() => setIsProfileCredentialOpen(false)}
                  className="flex-1 h-12 rounded-2xl bg-white/5 text-white/80 hover:text-white font-bold text-xs hover:bg-white/10 transition border border-white/10 flex items-center justify-center cursor-pointer"
                >
                  <span>Cerrar</span>
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Interfaz de Expediente Superpuesta (Glasmorfismo Blanco Opaco) */}
      <AnimatePresence>
        {isExpedienteOpen && selectedExpedienteFolder && (
          <SeedExpedienteInterface 
            folder={selectedExpedienteFolder}
            patientsList={patientsList}
            onSelectPatient={(patient) => setSelectedExpedienteFolder(patient)}
            onClose={() => setIsExpedienteOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Setup / Onboarding Inicial (si no ha sido completado) */}
      {!hasCompletedOnboarding && (
        <SeedOnboarding 
          theme={theme} 
          initialData={doctorProfile}
          onComplete={async (doctorData) => {
            // Guardar localmente
            localStorage.setItem('dentaxy_doctor_profile', JSON.stringify(doctorData));
            setDoctorProfile(doctorData);
            
            // Intentar guardar en Google Drive como archivo .html
            await saveProfileToGoogleDrive(doctorData);
            
            setHasCompletedOnboarding(true);
            toast.success("Credencial e Identidad del médico actualizadas en Google Drive.");
          }} 
        />
      )}

    </div>
  );
}
