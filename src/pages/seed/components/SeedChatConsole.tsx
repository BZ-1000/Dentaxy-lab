import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Plus, Mic, ChevronDown, Sparkles, Send, Check, X, ArrowUpRight, User, Phone, Scan, RefreshCw } from 'lucide-react';
import { useCliStore } from '@/stores/useCliStore';
import { motion, AnimatePresence } from 'framer-motion';
import { generatePatientCode, code128ToSVG } from '@/utils/barcode128';
import { getOrCreateSubfolder, listFiles, fetchDriveFileBlobUrl } from '@/utils/driveHelper';

const COUNTRIES = [
  { code: 'MX', lada: '+52', flag: '🇲🇽', name: 'México' },
  { code: 'US', lada: '+1', flag: '🇺🇸', name: 'EE.UU.' },
  { code: 'ES', lada: '+34', flag: '🇪🇸', name: 'España' },
  { code: 'CO', lada: '+57', flag: '🇨🇴', name: 'Colombia' },
  { code: 'AR', lada: '+54', flag: '🇦🇷', name: 'Argentina' },
  { code: 'CL', lada: '+56', flag: '🇨🇱', name: 'Chile' },
  { code: 'PE', lada: '+51', flag: '🇵🇪', name: 'Perú' },
  { code: 'EC', lada: '+593', flag: '🇪🇨', name: 'Ecuador' },
  { code: 'VE', lada: '+58', flag: '🇻🇪', name: 'Venezuela' },
  { code: 'GT', lada: '+502', flag: '🇬🇹', name: 'Guatemala' }
];

interface SeedChatConsoleProps {
  activePatient: any;
  onHoverChange?: (hover: boolean) => void;
  isHovered?: boolean;
  onOpenAddPatient?: () => void;
  isQuestionMode?: boolean;
  setIsQuestionMode?: (val: boolean) => void;
  questionType?: 'NEW_PATIENT' | 'INIT_EXPEDIENTE' | null;
  onConfirmQuestion?: (type: 'NEW_PATIENT' | 'INIT_EXPEDIENTE') => void;
  theme?: 'dark' | 'light';
  forceWhiteBg?: boolean;
}

export default function SeedChatConsole({ 
  activePatient, 
  onHoverChange, 
  isHovered, 
  onOpenAddPatient,
  isQuestionMode = false,
  setIsQuestionMode,
  questionType = null,
  onConfirmQuestion,
  theme = 'dark',
  forceWhiteBg = false
}: SeedChatConsoleProps) {
  const isPatientEmpty = !activePatient || activePatient.id === 999;
  const name = isPatientEmpty ? 'Paciente no seleccionado' : activePatient.name;
  
  // CLI Store Integration
  const { isExpedienteMode, currentQuestion, submitAnswer } = useCliStore();
  const effectiveIsQuestionMode = isExpedienteMode ? !!currentQuestion : isQuestionMode;
  
  // Estados de la consola de comando
  const [model, setModel] = useState<'Pro' | 'Flash' | 'Local'>('Pro');
  const [showModelDropdown, setShowModelDropdown] = useState(false);
  const [inputText, setInputText] = useState('');
  const [currentResponse, setCurrentResponse] = useState<string>('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisStep, setAnalysisStep] = useState<string>('');
  const [isFocused, setIsFocused] = useState(false);
  const [isConsoleHovered, setIsConsoleHovered] = useState(false);

  const [selectedOption, setSelectedOption] = useState<1 | 2>(1);

  // Estados locales para el registro de paciente en consola
  const [newPatientName, setNewPatientName] = useState('');
  const [selectedCountry, setSelectedCountry] = useState({ code: 'MX', lada: '+52', flag: '🇲🇽', name: 'México' });
  const [showCountryDropdown, setShowCountryDropdown] = useState(false);
  const [localPhone, setLocalPhone] = useState('');
  const [isSubmittingLocal, setIsSubmittingLocal] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const countryBtnRef = useRef<HTMLButtonElement>(null);
  const [dropdownPos, setDropdownPos] = useState({ top: 0, left: 0, width: 220 });

  // Código único de barras por paciente
  const [patientCode, setPatientCode] = useState<string>('');
  const barcodeSvg = useMemo(() => {
    if (!patientCode) return '';
    return code128ToSVG(patientCode, 1.05, 38);
  }, [patientCode]);

  // Obtener información real de Google Drive para la telemetría HUD
  const seedUserStr = sessionStorage.getItem('seed_user');
  const seedUser = seedUserStr ? JSON.parse(seedUserStr) : null;
  const hasGoogleDrive = !!seedUser?.googleAccessToken;
  const driveEmail = seedUser?.email || "doctor@dentaxy.com";

  // Estados de control de la terminal interactiva
  const [isTerminalOn, setIsTerminalOn] = useState(true);
  const [isTerminalMinimized, setIsTerminalMinimized] = useState(false);
  const [isTerminalExpanded, setIsTerminalExpanded] = useState(false);
  const [expandOrigin, setExpandOrigin] = useState({ x: 0, y: 0 });

  // Estados para el monitor de duplicados de pacientes
  const [duplicateStatus, setDuplicateStatus] = useState<'idle' | 'scanning' | 'clean' | 'conflict'>('idle');
  const [matchedNames, setMatchedNames] = useState<string[]>([]);

  // Estados del Visor a Pantalla Completa (Full Screen Viewer)
  const [fullScreenImage, setFullScreenImage] = useState<string | null>(null);
  const [isLoadingImage, setIsLoadingImage] = useState<boolean>(false);

  useEffect(() => {
    if (!newPatientName.trim()) {
      setDuplicateStatus('idle');
      setMatchedNames([]);
      return;
    }

    setDuplicateStatus('scanning');
    const timer = setTimeout(() => {
      const nameUpper = newPatientName.trim().toUpperCase();
      if (nameUpper.includes('BRANDON') || nameUpper.includes('JUAN') || nameUpper.includes('MARIA') || nameUpper.includes('RAMIREZ') || nameUpper.includes('PEREZ') || nameUpper.includes('DELGADO') || nameUpper.includes('HERNANDEZ')) {
        setDuplicateStatus('conflict');
        setMatchedNames(["BRANDON RAMIREZ", "JUAN PEREZ", "MARIA DELGADO"]);
      } else {
        setDuplicateStatus('clean');
        setMatchedNames([]);
      }
    }, 1200);

    return () => clearTimeout(timer);
  }, [newPatientName]);

  useEffect(() => {
    if (!isQuestionMode || questionType !== 'NEW_PATIENT') return;
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    // Generar código único al abrir el formulario
    setPatientCode(generatePatientCode());
    return () => clearInterval(timer);
  }, [isQuestionMode, questionType]);

  // Cerrar dropdown al hacer clic afuera
  useEffect(() => {
    if (!showCountryDropdown) return;
    const handler = (e: MouseEvent) => {
      if (countryBtnRef.current && !countryBtnRef.current.contains(e.target as Node)) {
        setShowCountryDropdown(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [showCountryDropdown]);

  const handleCreatePatientLocal = async () => {
    if (!newPatientName.trim()) return;
    setIsSubmittingLocal(true);

    try {
      const accessToken = seedUser?.googleAccessToken;
      if (!accessToken) throw new Error("No hay conexión de Google Drive");

      // 1. Buscar la carpeta raíz 'Dentaxy'
      const query = encodeURIComponent("name = 'Dentaxy' and mimeType = 'application/vnd.google-apps.folder' and trashed = false");
      const searchRes = await fetch(`https://www.googleapis.com/drive/v3/files?q=${query}&fields=files(id)`, {
        headers: { Authorization: `Bearer ${accessToken}` }
      });
      const searchData = await searchRes.json();
      
      let parentId = null;
      if (searchData.files && searchData.files.length > 0) {
        parentId = searchData.files[0].id;
      } else {
        // Crear carpeta Dentaxy
        const createRootRes = await fetch('https://www.googleapis.com/drive/v3/files', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            name: 'Dentaxy',
            mimeType: 'application/vnd.google-apps.folder'
          })
        });
        const rootData = await createRootRes.json();
        parentId = rootData.id;
      }

      // 2. Crear subcarpeta del paciente con formato en Mayúsculas
      const folderName = newPatientName.trim().toUpperCase();
      const phoneToSave = `${selectedCountry.lada} ${localPhone.trim()}`;
      const createFolderRes = await fetch('https://www.googleapis.com/drive/v3/files', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: folderName,
          mimeType: 'application/vnd.google-apps.folder',
          parents: [parentId],
          properties: {
            phone: phoneToSave || 'Sin teléfono',
            patientCode: patientCode,  // ← Código único grabado en metadata
            createdAt: new Date().toISOString()
          }
        })
      });

      if (!createFolderRes.ok) throw new Error("Error al crear carpeta de paciente en Drive");
      const folderData = await createFolderRes.json();
      const patientFolderId = folderData.id;

      // 3. Guardar barcode.svg dentro de la carpeta del paciente
      if (patientCode && barcodeSvg) {
        const fullBarcodeSvg = `<?xml version="1.0" encoding="UTF-8"?>
<!-- Dentaxy — Código de barras Code 128 del Paciente -->
<!-- ID: ${patientCode} | Paciente: ${folderName} | Fecha: ${new Date().toISOString()} -->
${barcodeSvg.replace('<svg ', `<svg xmlns="http://www.w3.org/2000/svg" data-patient="${folderName}" data-id="${patientCode}" `)}`;

        const barcodeBlob = new Blob([fullBarcodeSvg], { type: 'image/svg+xml' });
        const form = new FormData();
        form.append('metadata', new Blob([JSON.stringify({
          name: `barcode_${patientCode}.svg`,
          mimeType: 'image/svg+xml',
          parents: [patientFolderId],
          description: `Código de barras Code 128 — Paciente: ${folderName} | ID: ${patientCode}`
        })], { type: 'application/json' }));
        form.append('file', barcodeBlob);

        await fetch('https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart', {
          method: 'POST',
          headers: { Authorization: `Bearer ${accessToken}` },
          body: form
        });
      }

      // Notificar éxito al carrusel y sistema local
      window.dispatchEvent(new Event('patientCreated'));
      window.dispatchEvent(new CustomEvent('createNewPatientLocal', {
        detail: {
          name: folderName,
          edad: '30',
          genero: 'Masculino',
          telefono: phoneToSave || 'Sin teléfono',
          motivo: 'Valoración inicial',
          alergias: 'Ninguna',
          estatus: 'Primera Cita',
          patientCode: patientCode  // ← Propagar el código al sistema local
        }
      }));

      setIsQuestionMode?.(false);
      setNewPatientName('');
      setLocalPhone('');
      setPatientCode('');
      setSelectedCountry({ code: 'MX', lada: '+52', flag: '🇲🇽', name: 'México' });
    } catch (err: any) {
      console.error(err);
      alert("Error al sincronizar con Google Drive: " + err.message);
    } finally {
      setIsSubmittingLocal(false);
    }
  };

  // Resetear la opción seleccionada al entrar en modo pregunta
  useEffect(() => {
    if (isQuestionMode) {
      setSelectedOption(1);
    }
  }, [isQuestionMode]);

  // Rellenar con defaultValue si la pregunta es de texto
  useEffect(() => {
    if (isExpedienteMode && currentQuestion) {
      if (currentQuestion.type === 'text') {
        setInputText((currentQuestion.defaultValue as string) || '');
      } else {
        setInputText('');
      }
      setSelectedOption(1);
    }
  }, [currentQuestion, isExpedienteMode]);

  // Soporte de atajos de teclado para responder preguntas estilo Antigravity
  useEffect(() => {
    if (!effectiveIsQuestionMode) return;

    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      // If we are in a text question, don't hijack number keys unless focus is not on input
      if (isExpedienteMode && currentQuestion?.type === 'text') {
        return;
      }

      const key = parseInt(e.key);
      const numOptions = isExpedienteMode && currentQuestion?.options ? currentQuestion.options.length : 2;

      if (!isNaN(key) && key >= 1 && key <= numOptions) {
        setSelectedOption(key);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedOption(prev => prev > 1 ? prev - 1 : prev);
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedOption(prev => prev < numOptions ? prev + 1 : prev);
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (isExpedienteMode && currentQuestion?.type === 'options') {
          if (currentQuestion.options && selectedOption > 0 && selectedOption <= currentQuestion.options.length) {
            submitAnswer?.(currentQuestion.options[selectedOption - 1].id);
            setSelectedOption(1);
          }
        } else if (!isExpedienteMode) {
          setIsQuestionMode?.(false);
          if (selectedOption === 1 && questionType) {
            onConfirmQuestion?.(questionType);
          }
        }
      } else if (e.key === 'Escape') {
        if (!isExpedienteMode) {
          setIsQuestionMode?.(false);
        }
      }
    };

    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => {
      window.removeEventListener('keydown', handleGlobalKeyDown);
    };
  }, [effectiveIsQuestionMode, isExpedienteMode, currentQuestion, selectedOption, questionType, onConfirmQuestion, setIsQuestionMode, submitAnswer]);
  // Mapeos clínicos del paciente activo
  const motiveMap: { [key: string]: string } = {
    primera: 'Valoración inicial',
    urgencia: 'Urgencia dental',
    limpieza: 'Limpieza / Profilaxis',
    ortodoncia: 'Ortodoncia',
    cirugia: 'Cirugía dental'
  };

  const getPatientDetails = () => {
    if (isPatientEmpty) return null;
    const motivoRaw = activePatient?.appProperties?.motivo || 'primera';
    const translatedMotivo = motiveMap[motivoRaw] || motivoRaw;
    const idNum = parseInt(activePatient.id.slice(0, 3), 36) || 0;
    const estatusOptions = ['Esperando Notas', 'En Tratamiento', 'Alta Clínica'];
    
    return {
      motivo: translatedMotivo,
      fase: `Fase ${(idNum % 3) + 1} (${(idNum % 3) === 0 ? 'Diagnóstico' : (idNum % 3) === 1 ? 'Tratamiento' : 'Mantenimiento'})`,
      estatus: estatusOptions[idNum % 3],
      alergias: activePatient?.appProperties?.alergias || 'Ninguna',
      odontograma: `${idNum % 5}/32 Órganos Marcados`
    };
  };

  // Carga del mensaje de bienvenida o análisis inicial
  useEffect(() => {
    if (isPatientEmpty) {
      setCurrentResponse(
        '🩺 **Asistente Dentaxy IA** listo.\nPor favor, selecciona un expediente médico en el carrusel superior para analizar el caso clínico, generar recetas o redactar notas de evolución de forma local e instantánea.'
      );
    } else {
      const details = getPatientDetails();
      const messageText = `📊 **Análisis Clínico Inicial** de **${name}**:\n` +
          `• **Estatus**: ${details?.estatus}\n` +
          `• **Tratamiento**: ${details?.fase}\n` +
          `• **Alergias**: ${details?.alergias}\n` +
          `• **Motivo**: ${details?.motivo}\n` +
          `💡 *Sugerencia*: El expediente del paciente requiere completar su odontograma (${details?.odontograma}). Escribe una instrucción abajo para redactar su historia clínica o prescribir medicamentos.`;
      
      setCurrentResponse(messageText);
    }
  }, [activePatient]);

  const handleSendMessage = async () => {
    if (!inputText.trim()) return;

    if (isExpedienteMode && currentQuestion?.type === 'text') {
      submitAnswer?.(inputText.trim());
      setInputText('');
      return;
    }

    // Simular el inicio de análisis ("task running")
    setIsAnalyzing(true);
    const q = inputText.toLowerCase();
    const savedInput = inputText;
    setInputText('');

    // --- NUEVOS COMANDOS VISUALES (DEX) ---
    // 1. Ilustraciones Anatómicas — Partes del Diente
    const esDienteCmd =
      q.includes('partes del diente') ||
      q.includes('partes de un diente') ||
      q.includes('anatomia dental') ||
      q.includes('anatomía del diente') ||
      q.includes('imagen del diente') ||
      q.includes('estructura del diente') ||
      (q.includes('diente') && (q.includes('muestra') || q.includes('ver') || q.includes('abre') || q.includes('ilustra')));

    if (esDienteCmd) {
      setAnalysisStep('Abriendo ilustración de anatomía dental...');
      setTimeout(() => {
        setIsAnalyzing(false);
        setCurrentResponse('🦷 Aquí tienes la ilustración de las **Partes del Diente**. Puedes hacer zoom en pantalla completa.');
        setFullScreenImage('/Ilustraciones DEX/Partes del diente .png');
      }, 600);
      return;
    }

    // 1b. Ilustraciones Anatómicas — Fases de la Caries
    const esCariesCmd =
      q.includes('fases de la caries') ||
      q.includes('caries dental') ||
      q.includes('estadios de la caries') ||
      q.includes('etapas de la caries') ||
      q.includes('ilustración de caries') ||
      q.includes('imagen de caries') ||
      (q.includes('caries') && (q.includes('muestra') || q.includes('ver') || q.includes('abre') || q.includes('ilustra')));

    if (esCariesCmd) {
      setAnalysisStep('Abriendo ilustración de fases de caries...');
      setTimeout(() => {
        setIsAnalyzing(false);
        setCurrentResponse('🧫 Aquí tienes la ilustración de las **Fases de la Caries Dental**. Ideal para explicarle al paciente.');
        setFullScreenImage('/Ilustraciones DEX/Fases de la caries dental.png');
      }, 600);
      return;
    }

    // 2. Extracción de Radiografías de Drive
    const radioMatch = q.match(/radiograf[ií]a[s]?\s+(\d+)|radiograf[ií]a[s]?\s+n[uú]mero\s+(\d+)|(\d+)[°\.\-]?\s*radiograf[ií]a/);
    const esRadioCmd = radioMatch && (q.includes('muestra') || q.includes('muestrame') || q.includes('abre') || q.includes('ver') || q.includes('desplegar'));
    if (esRadioCmd) {
      const idxStr = radioMatch[1] || radioMatch[2] || radioMatch[3];
      const idx = parseInt(idxStr, 10) - 1; // Convertir a índice base 0
      
      if (isPatientEmpty) {
        setIsAnalyzing(false);
        setCurrentResponse('⚠️ *Dentaxy IA*: No hay ningún paciente seleccionado para buscar radiografías.');
        return;
      }
      
      setAnalysisStep(`Buscando radiografía ${idx + 1} en Google Drive...`);
      
      try {
        const token = seedUser?.googleAccessToken;
        if (!token) throw new Error('No hay sesión de Google activa');
        
        // Navegar arquitectura Zero-Storage
        const gabineteId = await getOrCreateSubfolder(activePatient.id, 'Gabinete', token);
        const radioFolderId = await getOrCreateSubfolder(gabineteId, 'radiografias', token);
        const files = await listFiles(radioFolderId, token);
        
        // Ordenar del más antiguo al más nuevo
        const sortedFiles = files.sort((a, b) => new Date(a.createdTime).getTime() - new Date(b.createdTime).getTime());
        
        if (sortedFiles.length === 0) {
          setIsAnalyzing(false);
          setCurrentResponse(`⚠️ *Dentaxy IA*: Este paciente no tiene ninguna radiografía guardada.`);
          return;
        }
        
        if (idx < 0 || idx >= sortedFiles.length) {
          setIsAnalyzing(false);
          setCurrentResponse(`⚠️ *Dentaxy IA*: Este paciente solo cuenta con ${sortedFiles.length} radiografía(s).`);
          return;
        }
        
        const fileToView = sortedFiles[idx];
        setAnalysisStep('Descargando imagen segura desde Drive...');
        const blobUrl = await fetchDriveFileBlobUrl(fileToView.id, token);
        
        setIsAnalyzing(false);
        setCurrentResponse(`Mostrando la radiografía ${idx + 1} del paciente en pantalla completa.`);
        setFullScreenImage(blobUrl);
      } catch (e: any) {
        console.error(e);
        setIsAnalyzing(false);
        setCurrentResponse(`❌ *Error*: No se pudo extraer la radiografía. ${e.message}`);
      }
      return;
    }

    // Determinar paso de análisis en base al input local original
    if (q.includes('receta') || q.includes('medicamento') || q.includes('prescribir') || q.includes('dolor')) {
      setAnalysisStep('Redactando receta y cruzando dosificación local...');
    } else if (q.includes('nota') || q.includes('evolucion') || q.includes('historia') || q.includes('expediente')) {
      setAnalysisStep('Generando nota de evolución estructurada...');
    } else if (q.includes('alergia') || q.includes('alergias') || q.includes('peligro') || q.includes('riesgo')) {
      setAnalysisStep('Comprobando riesgos y alergias del paciente...');
    } else {
      setAnalysisStep('Procesando solicitud de redacción local...');
    }

    setTimeout(() => {
      setIsAnalyzing(false);
      const aiResponse = generateLocalResponse(savedInput);
      setCurrentResponse(aiResponse);
    }, 1200);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Generador de respuestas clínicas locales y deterministas (Simulación de Redacción)
  const generateLocalResponse = (query: string): string => {
    const q = query.toLowerCase();
    const details = getPatientDetails();

    if (isPatientEmpty) {
      return '⚠️ *Dentaxy IA*: No hay ningún paciente seleccionado actualmente. Selecciona un paciente arriba para generar notas de evolución o recetas.';
    }

    if (q.includes('receta') || q.includes('medicamento') || q.includes('prescribir') || q.includes('dolor')) {
      return `💊 **Prescripción Sugerida** para **${name}**:\n` +
        `Considerando el motivo de consulta (${details?.motivo}) y que no presenta alergias conocidas:\n` +
        `1. **Ibuprofeno 400 mg** - 1 tableta cada 8 horas por 3 días (después de alimentos).\n` +
        `2. **Clorhexidina al 0.12% (Colutorio)** - Enjuagues cada 12 horas por 7 días posterior al cepillado.\n` +
        `*Nota*: Simulación de redacción local de Dentaxy. Confirme dosis antes de firmar.`;
    }

    if (q.includes('nota') || q.includes('evolucion') || q.includes('historia') || q.includes('expediente')) {
      return `📝 **Nota de Evolución** para **${name}**:\n` +
        `• **Subjetivo**: Paciente acude por motivo de ${details?.motivo}.\n` +
        `• **Objetivo**: Estatus clínico en ${details?.estatus}. Odontograma reporta ${details?.odontograma}.\n` +
        `• **Plan**: Continuar con tratamiento en ${details?.fase}. Cita de seguimiento en una semana.\n` +
        `*Redacción local completada con éxito.*`;
    }

    if (q.includes('alergia') || q.includes('alergias') || q.includes('peligro') || q.includes('riesgo')) {
      return `🛡️ **Reporte de Riesgos** - **${name}**:\n` +
        `• **Alergias**: ${details?.alergias}\n` +
        `• **Estatus**: ${details?.estatus}\n` +
        `• **Recomendaciones**: Evitar el uso de anestésicos locales con vasoconstrictores en caso de hipertensión no controlada si se reporta en la historia médica.`;
    }

    return `🤖 **Asistente Dentaxy (Modo ${model})**:\n` +
      `He procesado tu consulta sobre **${name}**: *"${query}"*.\n` +
      `Dentaxy opera de forma local. Puedes preguntarme sobre:\n` +
      `• Generar una **receta** o prescribir medicamentos.\n` +
      `• Redactar la **nota de evolución** para el expediente.\n` +
      `• Consultar **alergias** o riesgos del paciente.`;
  };

  // Cerrar visor a pantalla completa con tecla Escape
  useEffect(() => {
    if (!fullScreenImage) return;
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setFullScreenImage(null);
      }
    };
    document.addEventListener('keydown', handleEsc);
    return () => document.removeEventListener('keydown', handleEsc);
  }, [fullScreenImage]);

  // La consola se expande si tiene hover o si el input tiene el foco o si está en modo pregunta
  const showExpanded = isConsoleHovered || isFocused || isQuestionMode;

  // Variables de diseño dinámicas del contenedor único
  const containerHeight = (isQuestionMode && questionType === 'NEW_PATIENT') 
    ? '335px' 
    : isQuestionMode 
      ? '230px' 
      : showExpanded 
        ? '280px' 
        : '112px';

  const containerRadius = '20px';
  const containerShadow = showExpanded ? 'var(--seed-card-shadow), inset 0 1px 0 var(--seed-card-border)' : '0 8px 24px -4px rgba(0, 0, 0, 0.4)';

  // Renderizado del cabezal estilo Antigravity (1 task running / Resumen)
  const renderHeader = () => {
    if (isQuestionMode) {
      return (
        <div className="flex items-center justify-between w-full h-8 px-[18px] pb-1 border-b border-[var(--seed-row-border)]/20 mb-0.5" style={{ animation: 'seedFadeSlideIn 0.2s ease-out both' }}>
          <div className="flex items-center gap-2 text-[12px] font-black text-slate-700/90 dark:text-zinc-300 tracking-[0.18em] uppercase font-['Bruno_Ace_SC',_sans-serif]">
            <span>{questionType === 'NEW_PATIENT' ? 'Registrar Nuevo Paciente' : 'Confirmación'}</span>
          </div>
          <ChevronDown 
            size={13} 
            className="text-[var(--seed-text-muted)] opacity-60 rotate-180 transition-transform duration-300" 
          />
        </div>
      );
    }

    if (isAnalyzing) {
      return (
        <div className="flex items-center justify-between w-full h-6 px-[18px]">
          <div className="flex items-center gap-2 text-[9.5px] font-bold text-[var(--seed-text-muted)] tracking-wider uppercase">
            <div className="w-2.5 h-2.5 border-2 border-slate-600/20 border-t-slate-500 rounded-full animate-spin"></div>
            <span>1 análisis en curso</span>
          </div>
        </div>
      );
    }

    return (
      <div className="flex items-center justify-between w-full h-6 px-[18px] pb-1 border-b border-[var(--seed-row-border)]/20 mb-0.5">
        <div className="flex items-center gap-2 text-[9.5px] font-bold text-[var(--seed-text-muted)] tracking-wider uppercase">
          {!showExpanded && (
            <div className="w-2 h-2 border border-slate-500/40 border-t-slate-500 rounded-full animate-spin"></div>
          )}
          <span className="text-[var(--seed-text-muted)]">Resumen de{' '}</span>
          {/* Nombre con animación keyframe al cambiar de paciente */}
          <span
            key={name}
            className="font-bold text-[10px] tracking-[0.08em] text-slate-600"
            style={{ animation: 'seedNameSlideIn 0.32s cubic-bezier(0.22,1,0.36,1) both' }}
          >
            {name}
          </span>
        </div>
        <ChevronDown 
          size={13} 
          className={`text-[var(--seed-text-muted)] opacity-60 transition-transform duration-280 ${
            showExpanded ? 'rotate-180' : ''
          }`} 
        />
      </div>
    );
  };

  // Alerta de estado del expediente
  const getExpedienteAlert = () => {
    if (isPatientEmpty) {
      return (
        <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-lg border border-amber-500/10 bg-amber-500/5 text-amber-500 text-[9.5px] font-bold">
          <span>⚠️ Expediente no iniciado</span>
        </div>
      );
    }

    const details = getPatientDetails();
    const isEsperandoNotas = details?.estatus === 'Esperando Notas';

    if (isEsperandoNotas) {
      return (
        <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-lg border border-amber-500/15 bg-amber-500/5 text-amber-500 text-[9.5px] font-bold animate-pulse">
          <span>⚠️ Nota de evolución pendiente</span>
        </div>
      );
    }

    return (
      <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-lg border border-slate-800 bg-slate-800/40 text-[var(--seed-text-muted)] text-[9.5px] font-bold">
        <span>✓ Expediente al día</span>
      </div>
    );
  };

  // Sugerencias contextuales dinámicas (Smart Chips)
  const renderSmartChips = () => {
    if (isPatientEmpty) {
      return (
        <button
          onClick={() => onOpenAddPatient?.()}
          className="px-2.5 py-0.5 rounded-lg border border-amber-500/20 bg-amber-500/5 hover:bg-amber-500/15 text-amber-400 text-[9.5px] font-bold transition cursor-pointer"
        >
          + Iniciar Expediente
        </button>
      );
    }

    const details = getPatientDetails();
    const isEsperandoNotas = details?.estatus === 'Esperando Notas';

    const chips = isEsperandoNotas
      ? [
          { label: '+ Nota Evolución', text: 'Redactar nota de evolución de hoy' },
          { label: '💊 Receta Médica', text: 'Prescribir receta médica para molestias' }
        ]
      : [
          { label: '+ Nota Evolución', text: 'Redactar nota de evolución de hoy' },
          { label: '🛡️ Ver Alergias', text: 'Consultar alergias de este paciente' }
        ];

    return (
      <div className="flex items-center gap-1.5">
        {chips.map((chip, i) => (
          <button
            key={i}
            onClick={() => {
              // Simular el envío e iniciar el análisis de forma directa
              setIsAnalyzing(true);
              const q = chip.text.toLowerCase();
              if (q.includes('receta') || q.includes('medicamento')) {
                setAnalysisStep('Redactando receta y cruzando dosificación local...');
              } else if (q.includes('alergias') || q.includes('riesgo')) {
                setAnalysisStep('Comprobando riesgos y alergias del paciente...');
              } else {
                setAnalysisStep('Generando nota de evolución estructurada...');
              }

              const savedInput = chip.text;
              setInputText(''); // Limpiamos para que los chips desaparezcan al ejecutar

              setTimeout(() => {
                setIsAnalyzing(false);
                const aiResponse = generateLocalResponse(savedInput);
                setCurrentResponse(aiResponse);
              }, 1200);
            }}
            className="px-2.5 py-0.5 rounded-lg border border-slate-800 bg-slate-800/40 hover:bg-slate-700/60 text-[9.5px] font-bold text-[var(--seed-text-muted)] hover:text-[var(--seed-text-main)] transition cursor-pointer"
          >
            {chip.label}
          </button>
        ))}
      </div>
    );
  };

  const isWhiteBg = forceWhiteBg || theme === 'light';

  return (
    <div 
      className="w-full flex flex-col justify-between overflow-hidden relative border mb-1.5"
      style={{
        height: containerHeight,
        borderRadius: containerRadius,
        background: isWhiteBg ? 'rgba(255, 255, 255, 0.92)' : 'var(--seed-card-bg)',
        borderColor: isWhiteBg ? 'rgba(226, 232, 240, 0.9)' : 'var(--seed-card-border)',
        boxShadow: isWhiteBg ? '0 8px 32px rgba(0, 0, 0, 0.08)' : containerShadow,
        backdropFilter: 'blur(24px)',
        WebkitBackdropFilter: 'blur(24px)',
        paddingTop: '8px',
        transition: 'height 0.28s cubic-bezier(0.25,1,0.5,1), box-shadow 0.28s ease',
      }}
      onMouseEnter={() => {
        setIsConsoleHovered(true);
        onHoverChange?.(true);
      }}
      onMouseLeave={() => {
        setIsConsoleHovered(false);
        onHoverChange?.(false);
      }}
    >
      {/* Cabecera compacta tipo Antigravity */}
      {renderHeader()}
      
      {/* Panel Superior: Reporte o Carga */}
      <div 
        className={`flex-1 flex flex-col px-[18px] ${
          showExpanded
            ? `pointer-events-auto ${effectiveIsQuestionMode ? 'mt-0 mb-1 overflow-visible' : 'mt-1 mb-1.5 overflow-hidden'}`
            : 'opacity-0 h-0 pointer-events-none overflow-hidden'
        }`}
        style={{
          transition: showExpanded ? 'opacity 0.2s ease 0.06s' : 'opacity 0.12s ease',
          opacity: showExpanded ? 1 : 0,
        }}
      >
        {effectiveIsQuestionMode ? (
          questionType === 'NEW_PATIENT' ? (
            <div className="flex-1 flex flex-col md:flex-row gap-6 px-1 py-1 w-full animate-in fade-in duration-300 relative select-none text-left">
              
              {/* Columna Izquierda: Telemetría HUD (Reloj) y Terminal Interactiva de Conflictos */}
              <div className="w-full md:w-[42%] flex flex-col border-b md:border-b-0 md:border-r border-slate-350/30 dark:border-zinc-800/50 pb-4 md:pb-0 md:pr-5 gap-3 justify-between">
                
                {/* Reloj HUD y Fecha */}
                <div className="flex flex-col gap-0.5 shrink-0">
                  <span className="text-[7px] tracking-[0.25em] font-bold text-slate-500 dark:text-zinc-500 uppercase font-mono">DENTX_SYS TIME</span>
                  <div className="text-[24px] font-black tracking-[0.15em] text-slate-800 dark:text-zinc-100 font-['JetBrains_Mono',_monospace] leading-none">
                    {currentTime.toLocaleTimeString('es-MX', { hour12: false })}
                  </div>
                  <span className="text-[8px] tracking-[0.1em] font-semibold text-slate-600 dark:text-zinc-400 font-mono mt-0.5">
                    {currentTime.toLocaleDateString('es-MX', { weekday: 'short', day: 'numeric', month: 'short' }).toUpperCase()}
                  </span>
                </div>

                {/* Terminal Simulada de Conflictos */}
                <div 
                  className="flex-grow flex flex-col bg-slate-950 dark:bg-black border border-slate-850 dark:border-zinc-850 rounded-xl relative overflow-hidden shadow-md min-h-[145px] hover:scale-[1.025] transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]"
                >
                  {/* Barra Superior de la Terminal */}
                  <div className="flex items-center justify-between px-3 py-2 bg-slate-900/90 dark:bg-zinc-950/80 border-b border-slate-800/60 dark:border-zinc-900 select-none shrink-0">
                    <div className="flex items-center gap-1.5">
                      {/* Botones de ventana interactivos */}
                      <button 
                        type="button"
                        onClick={() => setIsTerminalOn(!isTerminalOn)}
                        className="w-2.5 h-2.5 rounded-full bg-zinc-600 hover:scale-130 transition-transform active:scale-90 cursor-pointer"
                        title="Apagar pantalla"
                      />
                      <button 
                        type="button"
                        onClick={() => {
                          if (isTerminalOn) {
                            setIsTerminalMinimized(!isTerminalMinimized);
                          }
                        }}
                        className="w-2.5 h-2.5 rounded-full bg-zinc-505 dark:bg-zinc-500 hover:scale-130 transition-transform active:scale-90 cursor-pointer"
                        title="Minimizar logs"
                      />
                      <button 
                        type="button"
                        onClick={(e) => {
                          if (isTerminalOn) {
                            const rect = e.currentTarget.getBoundingClientRect();
                            setExpandOrigin({
                              x: rect.left + rect.width / 2,
                              y: rect.top + rect.height / 2
                            });
                            setIsTerminalExpanded(true);
                          }
                        }}
                        className="w-2.5 h-2.5 rounded-full bg-zinc-400 hover:scale-130 transition-transform active:scale-90 cursor-pointer"
                        title="Expandir terminal"
                      />
                    </div>
                    {/* Prompt de doctor de Gmail dinámico */}
                    <span className="text-[7.5px] font-mono text-zinc-400 dark:text-zinc-500 tracking-wider">
                      {driveEmail}:~
                    </span>
                  </div>

                  {/* Cuerpo de la Terminal */}
                  <div className="flex-1 p-3 flex flex-col justify-between font-['JetBrains_Mono',_monospace] relative text-left">
                    {!isTerminalOn ? (
                      <div className="flex-1 flex items-center justify-center text-zinc-600 text-[9px] font-bold tracking-widest font-mono">
                        [MONITOR APAGADO]
                      </div>
                    ) : isTerminalMinimized ? (
                      <div className="flex-grow flex items-center justify-center text-zinc-300 text-[8.5px] font-bold tracking-wider animate-pulse">
                        [MONITOR MINIMIZADO - LOGS OCULTOS]
                      </div>
                    ) : (
                      <div className="flex-1 flex flex-col justify-between h-full">
                        {/* Cabecera del Log */}
                        <div className="flex items-center justify-between text-[7px] tracking-[0.18em] text-zinc-300 font-extrabold uppercase leading-none pb-1 border-b border-zinc-900">
                          <span>CONFLICTS_MONITOR</span>
                          <span className="animate-pulse">
                            {duplicateStatus === 'scanning' ? 'SCANNING' : matchedNames.length > 0 ? 'CONFLICT' : 'IDLE'}
                          </span>
                        </div>

                        {/* Fila del Radar y Estado */}
                        <div className="flex items-center gap-3 my-2">
                          {/* Radar Animado */}
                          <div className="relative w-8 h-8 rounded-full border border-zinc-800 flex items-center justify-center shrink-0 overflow-hidden">
                            <div className="absolute inset-0 border border-zinc-900 rounded-full" />
                            <div className="absolute inset-1 border border-zinc-900 rounded-full" />
                            {/* Barrido del Radar */}
                            <div 
                              className={`absolute inset-0 rounded-full border-t border-r border-zinc-400 ${duplicateStatus === 'scanning' ? 'animate-spin' : ''}`}
                              style={{ animationDuration: '1.2s' }}
                            />
                            <span className="text-[7px] font-bold text-zinc-400 font-mono shrink-0 select-none">Rx</span>
                          </div>

                          {/* Info del Escaneo */}
                          <div className="flex-1 text-[8.5px] font-mono leading-relaxed space-y-0.5">
                            <div className="text-zinc-200">
                              <span className="text-zinc-500">$ query:</span>{' '}
                              <span className="font-bold text-white uppercase">{newPatientName ? newPatientName.toUpperCase() : 'STANDBY'}</span>
                            </div>
                            <div className="text-zinc-200">
                              <span className="text-zinc-550">$ status:</span>{' '}
                              {duplicateStatus === 'scanning' ? (
                                <span className="text-zinc-300 font-bold animate-pulse">SCANNING...</span>
                              ) : matchedNames.length > 0 ? (
                                <span className="text-white font-black bg-zinc-850 px-1 rounded">CONFLICT DETECTED</span>
                              ) : (
                                <span className="text-zinc-300 font-bold">SHIELD_READY</span>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Listado de Logs */}
                        <div className="text-[8px] border-t border-zinc-900 pt-1 text-zinc-150 leading-relaxed font-mono">
                          <div className="text-zinc-500 font-black tracking-wider uppercase">// ULTIMOS REGISTROS DETECTADOS:</div>
                          {duplicateStatus === 'scanning' ? (
                            <div className="text-zinc-350 animate-pulse pl-2">• Escaneando coincidencias en Drive...</div>
                          ) : matchedNames.length > 0 ? (
                            <div className="max-h-[36px] overflow-y-auto space-y-0.5 pr-1 scrollbar-none font-bold text-white">
                              {matchedNames.map((name, i) => (
                                <div key={i} className="pl-2 animate-fade-in">• {name}</div>
                              ))}
                            </div>
                          ) : (
                            <div className="text-zinc-400 pl-2">
                              {newPatientName ? '✓ No se detectaron duplicados en local ni Drive.' : '- Ninguno (Standby)'}
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

              </div>

              {/* Columna Derecha: Inputs del Paciente y el Código de Identidad (Barcode) */}
              <div className="flex-grow flex-1 flex flex-col justify-between gap-3.5">
                
                {/* Inputs agrupados en contenedor */}
                <div className="flex flex-col gap-3.5">
                  {/* Input 1: Nombre Completo */}
                  <div className="flex flex-col gap-1 text-left">
                    <div className="flex items-center gap-1.5 font-['Bruno_Ace_SC',_sans-serif] text-[9.5px] tracking-widest text-slate-900 dark:text-zinc-50 select-none font-extrabold">
                      <User size={12} className="text-slate-700 dark:text-zinc-350" />
                      <span>NOMBRE COMPLETO</span>
                    </div>
                    <div className="relative group">
                      <input 
                        type="text" 
                        value={newPatientName}
                        onChange={(e) => {
                          const val = e.target.value;
                          const capitalized = val.split(' ').map(word => {
                            return word.charAt(0).toUpperCase() + word.slice(1);
                          }).join(' ');
                          setNewPatientName(capitalized);
                        }}
                        className="w-full h-10 px-4 bg-slate-100/50 dark:bg-zinc-950/40 border border-slate-300/60 dark:border-zinc-800/80 rounded-full text-slate-900 dark:text-white text-xs focus:outline-none focus:border-slate-500 dark:focus:border-zinc-600 focus:bg-white dark:focus:bg-zinc-900/40 transition-all font-medium placeholder-slate-400 dark:placeholder-zinc-500 shadow-[inset_2px_2px_4px_rgba(0,0,0,0.06),_1px_1px_0px_rgba(255,255,255,0.9)] dark:shadow-[inset_2px_2px_5px_rgba(0,0,0,0.7)]" 
                        placeholder="Nombre del paciente"
                        autoFocus 
                      />
                    </div>
                  </div>

                  {/* Input 2: Teléfono con selector de país */}
                  <div className="flex flex-col gap-1 text-left">
                    <div className="flex items-center gap-1.5 font-['Bruno_Ace_SC',_sans-serif] text-[9.5px] tracking-widest text-slate-900 dark:text-zinc-50 select-none font-extrabold">
                      <Phone size={12} className="text-slate-700 dark:text-zinc-350" />
                      <span>TELÉFONO CELULAR</span>
                    </div>
                    
                    <div className="relative flex h-10 rounded-full bg-slate-100/50 dark:bg-zinc-950/40 border border-slate-300/60 dark:border-zinc-800/80 shadow-[inset_2px_2px_4px_rgba(0,0,0,0.06),_1px_1px_0px_rgba(255,255,255,0.9)] dark:shadow-[inset_2px_2px_5px_rgba(0,0,0,0.7)] focus-within:border-slate-500 dark:focus-within:border-zinc-600 transition-all overflow-visible">
                      <button
                        ref={countryBtnRef}
                        type="button"
                        onClick={() => {
                          if (countryBtnRef.current) {
                            const rect = countryBtnRef.current.getBoundingClientRect();
                            setDropdownPos({ top: rect.bottom + 6, left: rect.left, width: 220 });
                          }
                          setShowCountryDropdown(v => !v);
                        }}
                        className="flex items-center gap-1 px-4 text-sm border-r border-slate-300/60 dark:border-zinc-800/80 shrink-0 cursor-pointer hover:bg-slate-200/40 dark:hover:bg-zinc-800/30 rounded-l-full transition-colors"
                      >
                        <span className="text-base leading-none">{selectedCountry.flag}</span>
                        <span className="text-[10px] font-bold text-slate-600 dark:text-zinc-400 font-mono">{selectedCountry.lada}</span>
                        <ChevronDown size={9} className={`text-slate-400 dark:text-zinc-500 transition-transform duration-200 ${showCountryDropdown ? 'rotate-180' : ''}`} />
                      </button>

                      <input
                        type="tel"
                        value={localPhone}
                        onChange={(e) => {
                          const digits = e.target.value.replace(/\D/g, '').slice(0, 10);
                          let formatted = digits;
                          if (digits.length > 6) {
                            formatted = `${digits.slice(0, 3)}-${digits.slice(3, 6)}-${digits.slice(6)}`;
                          } else if (digits.length > 3) {
                            formatted = `${digits.slice(0, 3)}-${digits.slice(3)}`;
                          }
                          setLocalPhone(formatted);
                        }}
                        placeholder="000-000-0000"
                        className="flex-1 h-full px-4 bg-transparent text-slate-900 dark:text-white text-xs focus:outline-none font-medium placeholder-slate-400 dark:placeholder-zinc-500"
                      />

                      {/* Dropdown de países — renderizado en posición fixed para escapar overflow:hidden */}
                      {showCountryDropdown && (
                        <div
                          style={{ position: 'fixed', top: dropdownPos.top, left: dropdownPos.left, width: dropdownPos.width, zIndex: 9999 }}
                          className="rounded-2xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 shadow-xl overflow-y-auto max-h-64"
                        >
                          {COUNTRIES.map(country => (
                            <button
                              key={country.code}
                              type="button"
                              onClick={() => {
                                setSelectedCountry(country);
                                setShowCountryDropdown(false);
                              }}
                              className={`w-full flex items-center gap-2.5 px-3 py-2 text-left hover:bg-slate-50 dark:hover:bg-zinc-900 transition-colors cursor-pointer ${
                                selectedCountry.code === country.code ? 'bg-slate-100 dark:bg-zinc-900' : ''
                              }`}
                            >
                              <span className="text-base">{country.flag}</span>
                              <span className="text-[11px] font-semibold text-slate-700 dark:text-zinc-300 flex-1">{country.name}</span>
                              <span className="text-[10px] font-mono text-slate-500 dark:text-zinc-500">{country.lada}</span>
                              {selectedCountry.code === country.code && (
                                <span className="text-[#00c980] text-xs font-bold">✓</span>
                              )}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Código de barras (ID PACIENTE) con fondo blanco y efecto botón plástico salido acentuado 3D */}
                <div className="flex items-center gap-4 pt-1 w-full">
                  {barcodeSvg && (
                    <div 
                      style={{ 
                        background: '#ffffff', 
                        backgroundColor: '#ffffff', 
                        opacity: 1, 
                        backdropFilter: 'none', 
                        WebkitBackdropFilter: 'none'
                      }}
                      className="w-full flex items-center justify-start gap-8 py-2.5 px-4.5 border border-slate-250 dark:border-zinc-800/80 rounded-xl relative overflow-hidden shadow-[5px_5px_12px_rgba(0,0,0,0.07)] dark:shadow-[5px_5px_14px_rgba(0,0,0,0.5)] hover:scale-[1.025] hover:shadow-[7px_7px_16px_rgba(0,0,0,0.12)] transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]"
                    >
                      <div className="flex flex-col text-left shrink-0 select-none pl-3.5">
                        <span className="text-[8.5px] tracking-[0.2em] font-mono text-slate-900 uppercase leading-none font-black">ID PACIENTE</span>
                        <span className="text-[11.5px] tracking-[0.05em] font-mono text-slate-700 leading-none select-all font-black mt-2">{patientCode}</span>
                      </div>
                      
                      <div
                        className="flex-grow max-w-[210px] h-[42px] flex items-center opacity-95 transition-opacity duration-300 pr-2"
                        dangerouslySetInnerHTML={{ __html: barcodeSvg.replace('<svg ', '<svg fill="currentColor" class="text-black w-full h-full" ') }}
                      />
                    </div>
                  )}
                </div>

              </div>
            </div>
          ) : (
            <div className="flex-1 flex flex-col justify-start items-start animate-in fade-in duration-300 px-1 pt-1 pb-0 w-full overflow-hidden">
{/* Título de la pregunta */}
              <div className="text-[19px] sm:text-[20px] font-medium text-slate-700 dark:text-[var(--seed-text-main)] mb-1.5 w-full leading-snug tracking-tight animate-in fade-in duration-300">
                {isExpedienteMode && currentQuestion ? currentQuestion.text :
                  `¿Deseas iniciar el expediente clínico de ${name}?`
                }
              </div>

              {/* Lista de Opciones */}
              <div className="flex flex-col gap-1.5 w-full">
              {isExpedienteMode && currentQuestion?.type === 'options' ? (
                currentQuestion.options?.map((opt, idx) => (
                  <div 
                    key={opt.id}
                    onClick={() => submitAnswer?.(opt.id)}
                    className={`w-full flex items-center gap-3 p-2.5 rounded-lg border text-left cursor-pointer transition-all duration-150 ${
                      selectedOption === (idx + 1) 
                        ? 'bg-[var(--seed-row-hover)] border-[var(--seed-row-border)] text-[var(--seed-text-main)] shadow-sm' 
                        : 'border-transparent text-[var(--seed-text-muted)] hover:text-[var(--seed-text-main)] hover:bg-[var(--seed-row-hover)]/40'
                    }`}
                  >
                    <div className={`w-5 h-5 rounded text-[11px] font-semibold border flex items-center justify-center transition-all ${
                      selectedOption === (idx + 1) 
                        ? 'bg-zinc-200 dark:bg-zinc-700 text-zinc-800 dark:text-zinc-200 border-zinc-300 dark:border-zinc-500 font-extrabold shadow-sm' 
                        : 'bg-zinc-100 dark:bg-zinc-800/30 text-zinc-500 dark:text-zinc-500 border-zinc-200 dark:border-zinc-700/40 font-normal'
                    }`}>
                      {idx + 1}
                    </div>
                    <span className="text-[12.5px] font-medium">{opt.label}</span>
                  </div>
                ))
              ) : isExpedienteMode && currentQuestion?.type === 'text' ? (
                <div className="text-[12.5px] text-[var(--seed-text-muted)] italic">
                  Escribe tu respuesta abajo en el chat y presiona Enter.
                </div>
              ) : (
                <>
                  <div 
                    onClick={() => {
                      setSelectedOption(1);
                      setIsQuestionMode?.(false);
                      if (questionType) {
                        onConfirmQuestion?.(questionType);
                      }
                    }}
                    className={`w-full flex items-center gap-3 p-2.5 rounded-lg border text-left cursor-pointer transition-all duration-150 ${
                      selectedOption === 1 
                        ? 'bg-[var(--seed-row-hover)] border-[var(--seed-row-border)] text-[var(--seed-text-main)] shadow-sm' 
                        : 'border-transparent text-[var(--seed-text-muted)] hover:text-[var(--seed-text-main)] hover:bg-[var(--seed-row-hover)]/40'
                    }`}
                  >
                    <div className={`w-5 h-5 rounded text-[11px] font-semibold border flex items-center justify-center transition-all ${
                      selectedOption === 1 
                        ? 'bg-zinc-200 dark:bg-zinc-700 text-zinc-800 dark:text-zinc-200 border-zinc-300 dark:border-zinc-500 font-extrabold shadow-sm' 
                        : 'bg-zinc-100 dark:bg-zinc-800/30 text-zinc-500 dark:text-zinc-500 border-zinc-200 dark:border-zinc-700/40 font-normal'
                    }`}>
                      1
                    </div>
                    <span className="text-[12.5px] font-medium">
                      {questionType === 'NEW_PATIENT' ? 'Sí, registrar nuevo paciente' : 'Sí, iniciar expediente clínico'}
                    </span>
                  </div>

                  <div 
                    onClick={() => {
                      setSelectedOption(2);
                      setIsQuestionMode?.(false);
                    }}
                    className={`w-full flex items-center gap-3 p-2.5 rounded-lg border text-left cursor-pointer transition-all duration-150 ${
                      selectedOption === 2 
                        ? 'bg-[var(--seed-row-hover)] border-[var(--seed-row-border)] text-[var(--seed-text-main)] shadow-sm' 
                        : 'border-transparent text-[var(--seed-text-muted)] hover:text-[var(--seed-text-main)] hover:bg-[var(--seed-row-hover)]/40'
                    }`}
                  >
                    <div className={`w-5 h-5 rounded text-[11px] font-semibold border flex items-center justify-center transition-all ${
                      selectedOption === 2 
                        ? 'bg-zinc-200 dark:bg-zinc-700 text-zinc-800 dark:text-zinc-200 border-zinc-300 dark:border-zinc-500 font-extrabold shadow-sm' 
                        : 'bg-zinc-100 dark:bg-zinc-800/30 text-zinc-500 dark:text-zinc-500 border-zinc-200 dark:border-zinc-700/40 font-normal'
                    }`}>
                      2
                    </div>
                    <span className="text-[12.5px] font-medium">No, cancelar acción</span>
                  </div>
                </>
              )}
            </div>
          </div>
          )
        ) : isAnalyzing ? (
          <div className="flex-1 px-1 py-3 flex flex-col gap-2 animate-pulse">
            <div className="flex items-center gap-2 text-[12px] text-[var(--seed-text-light)] pl-0.5 mt-0.5">
              <span>{analysisStep}</span>
            </div>
          </div>
        ) : (
          <div 
            className="flex-1 overflow-y-auto pr-1 flex flex-col justify-start scrollbar-none"
            style={{ scrollbarWidth: 'none', maxHeight: '100%' }}
          >
            <div className="text-[12.5px] leading-relaxed text-[var(--seed-text-main)] whitespace-pre-line pl-0.5 mt-0.5 mb-0.5">
              {currentResponse.split('\n').map((line, idx) => (
                <div key={idx} className="min-h-[1.2em]">
                  {line.startsWith('• ') ? (
                    <span className="pl-1 block text-[var(--seed-text-light)]">
                      • {line.slice(2).split('**').map((chunk, i) => i % 2 === 1 ? <strong key={i} className="font-bold text-[var(--seed-text-main)]">{chunk}</strong> : chunk)}
                    </span>
                  ) : (
                    line.split('**').map((chunk, i) => {
                      if (i % 2 === 1) {
                        return <strong key={i} className="font-bold text-[var(--seed-text-main)]">{chunk}</strong>;
                      }
                      return chunk.split('*').map((subchunk, j) => j % 2 === 1 ? <em key={j} className="italic opacity-80">{subchunk}</em> : subchunk);
                    })
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Caja del Prompt de Antigravity (Consola de Entrada) - Fiel al ancho de la card */}
      <div 
        className="w-full border-t p-2.5 flex flex-col gap-2 bg-[var(--seed-input-bg)] border-[var(--seed-row-border)]/40 shadow-md focus-within:ring-2 focus-within:ring-white/5 focus-within:border-[var(--seed-text-muted)]/30"
        style={{
          borderRadius: '0 0 20px 20px',
          paddingLeft: '18px',
          paddingRight: '18px'
        }}
      >
        {effectiveIsQuestionMode ? (
          questionType === 'NEW_PATIENT' ? (
            <div className="flex items-center justify-between py-1.5 px-1 w-full animate-in fade-in duration-300 gap-4">
              <button 
                type="button"
                onClick={() => {
                  setIsQuestionMode?.(false);
                  setNewPatientName('');
                  setNewPatientPhone('+52 ');
                }}
                className="flex-1 h-[40px] rounded-full border border-slate-300 dark:border-zinc-800 bg-slate-100/80 dark:bg-zinc-900/80 text-slate-700 dark:text-zinc-300 text-[10px] font-black tracking-[0.18em] uppercase hover:bg-slate-200/80 dark:hover:bg-zinc-800/80 hover:text-slate-900 dark:hover:text-white transition-all cursor-pointer flex items-center justify-center font-['Bruno_Ace_SC',_sans-serif] shadow-[1px_1px_2px_rgba(0,0,0,0.05),_inset_0_1px_1px_rgba(255,255,255,0.9)] dark:shadow-[1px_1px_2px_rgba(255,255,255,0.05),_inset_0_1px_1px_rgba(255,255,255,0.1)] active:scale-98"
                style={{ fontFamily: "'Bruno Ace SC', sans-serif" }}
              >
                Cancelar
              </button>

              {/* Barra central de Micro-acciones Clínicas */}
              <div className="flex items-center gap-2 select-none shrink-0">
                {/* Acción 1: Dictado de Voz Clínico */}
                <button
                  type="button"
                  onClick={() => {
                    alert("Iniciando dictado de voz clínico para expediente... Hable ahora.");
                  }}
                  title="Dictar expediente por voz"
                  className="w-[34px] h-[34px] rounded-full flex items-center justify-center bg-white/40 dark:bg-zinc-950/20 backdrop-blur-md border border-slate-300/50 dark:border-zinc-850/60 text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white hover:border-[#00c980] dark:hover:border-[#00f5a0] hover:ring-1 hover:ring-[#00c980]/20 dark:hover:ring-[#00f5a0]/20 hover:shadow-[0_0_8px_rgba(0,245,160,0.2)] dark:hover:shadow-[0_0_10px_rgba(0,245,160,0.25)] transition-all cursor-pointer active:scale-90"
                >
                  <Mic size={14} className="stroke-[2.2]" />
                </button>

                {/* Acción 2: Autocompletar con Datos Demo */}
                <button
                  type="button"
                  onClick={() => {
                    setNewPatientName("CARLOS EDUARDO HERNÁNDEZ");
                    setNewPatientPhone("4921234567");
                  }}
                  title="Autocompletar con datos demo"
                  className="w-[34px] h-[34px] rounded-full flex items-center justify-center bg-white/40 dark:bg-zinc-950/20 backdrop-blur-md border border-slate-300/50 dark:border-zinc-850/60 text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white hover:border-[#00c980] dark:hover:border-[#00f5a0] hover:ring-1 hover:ring-[#00c980]/20 dark:hover:ring-[#00f5a0]/20 hover:shadow-[0_0_8px_rgba(0,245,160,0.2)] dark:hover:shadow-[0_0_10px_rgba(0,245,160,0.25)] transition-all cursor-pointer active:scale-90"
                >
                  <Sparkles size={14} className="stroke-[2.2]" />
                </button>

                {/* Acción 3: Escanear INE / Identificación con Cámara */}
                <button
                  type="button"
                  onClick={() => {
                    alert("Activando cámara para escaneo de identificación del paciente...");
                  }}
                  title="Escanear identificación física"
                  className="w-[34px] h-[34px] rounded-full flex items-center justify-center bg-white/40 dark:bg-zinc-950/20 backdrop-blur-md border border-slate-300/50 dark:border-zinc-850/60 text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white hover:border-[#00c980] dark:hover:border-[#00f5a0] hover:ring-1 hover:ring-[#00c980]/20 dark:hover:ring-[#00f5a0]/20 hover:shadow-[0_0_8px_rgba(0,245,160,0.2)] dark:hover:shadow-[0_0_10px_rgba(0,245,160,0.25)] transition-all cursor-pointer active:scale-90"
                >
                  <Scan size={14} className="stroke-[2.2]" />
                </button>

                {/* Acción 4: Limpiar campos del formulario */}
                <button
                  type="button"
                  onClick={() => {
                    setNewPatientName("");
                    setNewPatientPhone("+52 ");
                  }}
                  title="Restablecer formulario"
                  className="w-[34px] h-[34px] rounded-full flex items-center justify-center bg-white/40 dark:bg-zinc-950/20 backdrop-blur-md border border-slate-300/50 dark:border-zinc-850/60 text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white hover:border-[#00c980] dark:hover:border-[#00f5a0] hover:ring-1 hover:ring-[#00c980]/20 dark:hover:ring-[#00f5a0]/20 hover:shadow-[0_0_8px_rgba(0,245,160,0.2)] dark:hover:shadow-[0_0_10px_rgba(0,245,160,0.25)] transition-all cursor-pointer active:scale-90"
                >
                  <RefreshCw size={14} className="stroke-[2.2]" />
                </button>
              </div>

              {/* Botón CREAR EXPEDIENTE idéntico al de cancelar */}
              <button 
                type="button"
                onClick={handleCreatePatientLocal}
                disabled={isSubmittingLocal}
                className="flex-1 h-[40px] rounded-full border border-slate-300 dark:border-zinc-800 bg-slate-100/80 dark:bg-zinc-900/80 text-slate-700 dark:text-zinc-300 text-[10px] font-black tracking-[0.18em] uppercase hover:bg-slate-200/80 dark:hover:bg-zinc-800/80 hover:text-slate-900 dark:hover:text-white transition-all cursor-pointer flex items-center justify-center font-['Bruno_Ace_SC',_sans-serif] shadow-[1px_1px_2px_rgba(0,0,0,0.05),_inset_0_1px_1px_rgba(255,255,255,0.9)] dark:shadow-[1px_1px_2px_rgba(255,255,255,0.05),_inset_0_1px_1px_rgba(255,255,255,0.1)] active:scale-98 disabled:opacity-60 disabled:cursor-not-allowed"
                style={{ fontFamily: "'Bruno Ace SC', sans-serif" }}
              >
                {isSubmittingLocal ? 'Creando...' : 'Crear'}
              </button>
            </div>
          ) : (
            <>
              {isExpedienteMode && currentQuestion?.type === 'text' && (
                <input 
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      submitAnswer?.(inputText.trim());
                      setInputText('');
                    }
                  }}
                  placeholder={currentQuestion.placeholder || "Escribe tu respuesta..."}
                  className="w-full !bg-transparent !border-none !outline-none !shadow-none !backdrop-blur-none !rounded-none focus:!scale-100 focus:!ring-0 text-[12.5px] px-1.5 py-0.5 text-[var(--seed-text-main)] placeholder-[var(--seed-text-muted)]/50"
                  autoFocus
                />
              )}

              {/* Fila de controles inferior estilo Antigravity dialog */}
              <div className={"flex items-center justify-between py-1 px-1 w-full animate-in fade-in duration-300 " + (isExpedienteMode && currentQuestion?.type === 'text' ? "border-t border-[var(--seed-row-border)]/40 pt-2" : "")}>
                <div className="flex items-center gap-2">
                  {/* dex-confirmar eliminado */}
                </div>

                <div className="flex items-center gap-3">
                  {/* Botón Skip */}
                  <button 
                    type="button"
                    onClick={() => {
                      if (isExpedienteMode) {
                        submitAnswer?.('');
                        setInputText('');
                      } else {
                        setIsQuestionMode?.(false);
                      }
                    }}
                    className="text-[var(--seed-text-muted)] hover:text-[var(--seed-text-main)] text-[11px] font-semibold px-2 py-1 cursor-pointer transition-all"
                  >
                    Omitir
                  </button>

                  {/* Botón Submit ↵ */}
                  <button 
                    type="button"
                    onClick={() => {
                      if (isExpedienteMode) {
                        if (currentQuestion?.type === 'options') {
                          if (currentQuestion.options && selectedOption > 0 && selectedOption <= currentQuestion.options.length) {
                            submitAnswer?.(currentQuestion.options[selectedOption - 1].id);
                            setSelectedOption(1); // reset selection
                          }
                        } else if (currentQuestion?.type === 'text') {
                          submitAnswer?.(inputText.trim());
                          setInputText('');
                        }
                      } else if (!isExpedienteMode) {
                        setIsQuestionMode?.(false);
                        if (selectedOption === 1 && questionType) {
                          onConfirmQuestion?.(questionType);
                        }
                      }
                    }}
                    className="px-3 py-1.5 rounded-lg bg-[#0ecf8e] hover:bg-[#25dba0] text-white text-[11px] font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-md shadow-[#0ecf8e]/30"
                  >
                    <span>Confirmar</span>
                    <span className="text-[9px] opacity-70">↵</span>
                  </button>
                </div>
              </div>
            </>
          )
        ) : (
          <>
            {/* Input de texto principal */}
            <input 
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={handleKeyDown}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              placeholder={isPatientEmpty ? "Selecciona un paciente..." : "Ask anything, @ to mention, / for actions"}
              disabled={isPatientEmpty}
              className="w-full !bg-transparent !border-none !outline-none !shadow-none !backdrop-blur-none !rounded-none focus:!scale-100 focus:!ring-0 text-[12.5px] px-1.5 py-0.5 text-[var(--seed-text-main)] placeholder-[var(--seed-text-muted)]/50 disabled:cursor-not-allowed"
            />

            {/* Fila de controles inferior */}
            <div className="flex items-center justify-between border-t border-[var(--seed-row-border)]/40 pt-2 px-1">
              <div className="flex items-center gap-2.5">
                {/* Botón "+" */}
                <button 
                  type="button"
                  className="w-6 h-6 rounded-full flex items-center justify-center transition-all bg-[var(--seed-icon-bg)] text-[var(--seed-text-muted)] hover:text-[var(--seed-text-main)] hover:bg-[var(--seed-row-hover)] cursor-pointer"
                  title="Subir archivos o agregar información"
                >
                  <Plus size={14} />
                </button>

                {/* Selector de Modelo (Pro / Flash / Local) */}
                <div className="relative">
                  <button 
                    onClick={() => !isPatientEmpty && setShowModelDropdown(!showModelDropdown)}
                    disabled={isPatientEmpty}
                    className="px-2 py-0.5 rounded-lg border border-[var(--seed-row-border)] bg-[var(--seed-icon-bg)] text-[9.5px] font-semibold flex items-center gap-1 text-[var(--seed-text-muted)] hover:text-[var(--seed-text-main)] hover:bg-[var(--seed-row-hover)] transition cursor-pointer disabled:cursor-not-allowed"
                  >
                    <span>{model}</span>
                    <ChevronDown size={10} className={`transition-transform duration-200 ${showModelDropdown ? 'rotate-180' : ''}`} />
                  </button>

                  {showModelDropdown && (
                    <div 
                      className="absolute bottom-full mb-2 left-0 w-24 rounded-xl border p-1 shadow-xl flex flex-col gap-0.5 z-[999] backdrop-blur-xl"
                      style={{
                        background: 'var(--seed-card-bg)',
                        borderColor: 'var(--seed-card-border)'
                      }}
                    >
                      {(['Pro', 'Flash', 'Local'] as const).map((m) => (
                        <button
                          key={m}
                          onClick={() => {
                            setModel(m);
                            setShowModelDropdown(false);
                          }}
                          className={`text-left px-2.5 py-1.5 rounded-lg text-[10.5px] font-medium transition cursor-pointer ${
                            model === m 
                              ? 'bg-white/5 text-[var(--seed-text-main)] font-semibold' 
                              : 'text-[var(--seed-text-muted)] hover:text-[var(--seed-text-main)] hover:bg-[var(--seed-row-hover)]'
                          }`}
                        >
                          {m}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Siri Suggestions (Smart Chips) si está vacío e interactivo, o Alerta de Expediente */}
                {(!inputText.trim() && showExpanded) ? (
                  renderSmartChips()
                ) : (
                  getExpedienteAlert()
                )}
              </div>

              <div className="flex items-center gap-1.5">
                {/* Dictado por Voz */}
                <button 
                  type="button"
                  disabled={isPatientEmpty}
                  className="w-6 h-6 rounded-full flex items-center justify-center bg-[var(--seed-icon-bg)] text-[var(--seed-text-muted)] hover:text-[var(--seed-text-main)] hover:bg-[var(--seed-row-hover)] transition-all cursor-pointer disabled:cursor-not-allowed"
                  title="Dictar por voz"
                >
                  <Mic size={12} />
                </button>

                {/* Botón de Enviar */}
                {inputText.trim() && (
                  <button 
                    onClick={handleSendMessage}
                    className="w-6 h-6 rounded-full flex items-center justify-center bg-white text-[#09090b] hover:bg-slate-200 transition-all cursor-pointer shadow-sm"
                  >
                    <Send size={11} fill="currentColor" />
                  </button>
                )}
              </div>
            </div>
          </>
        )}
      </div>

      {/* --- FULL SCREEN VIEWER (Ilustraciones y Radiografías) --- */}
      <AnimatePresence>
        {fullScreenImage && (
          <motion.div
            key="fullscreen-viewer"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-[9999] bg-black/90 flex items-center justify-center"
            onClick={() => setFullScreenImage(null)}
          >
            {/* Botón de cierre */}
            <button
              onClick={() => setFullScreenImage(null)}
              className="absolute top-5 right-5 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm flex items-center justify-center text-white transition-all z-10 border border-white/20"
            >
              <X size={20} />
            </button>

            {/* Etiqueta de instrucción */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-white/40 text-xs font-medium">
              Presiona Esc o haz clic fuera para cerrar
            </div>

            {/* Imagen principal */}
            <motion.img
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              src={fullScreenImage}
              alt="Vista clínica"
              className="max-w-[92vw] max-h-[90vh] object-contain rounded-2xl shadow-2xl select-none"
              onClick={(e) => e.stopPropagation()} // Evitar cierre al hacer clic en la imagen
            />
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
