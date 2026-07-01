import React, { useState, useEffect } from 'react';
import { Plus, Mic, ChevronDown, Sparkles, Send, Check, X, ArrowUpRight, User, Phone, Scan, RefreshCw } from 'lucide-react';
import { useCliStore } from '@/stores/useCliStore';
import { motion } from 'framer-motion';

interface FutureButtonConsoleProps {
  onClick?: () => void;
  className?: string;
  label?: string;
}

const FutureButtonConsole = ({ onClick, className = "", label = "CREAR EXPEDIENTE" }: FutureButtonConsoleProps) => {
  // Dimensiones del contenedor y botón
  const buttonDimensions = "h-10 w-full";

  // Variantes del círculo negro (del mismo alto del botón: 40px)
  const bgVariants = {
    rest: { width: 40, height: 40, left: 0, top: 0 },
    hover: { width: "100%", height: "100%", left: 0, top: 0 }
  };

  // Variantes de la flecha (desplazamiento exacto en hover)
  const arrowVariants = {
    rest: { x: 0, rotate: 0 },
    hover: { x: "calc(100% - 40px)", rotate: 45 }
  };

  // Variantes del texto (desplazamiento para dejar espacio a la flecha en hover)
  const textVariants = {
    rest: { x: 10 },
    hover: { x: -22 }
  };

  return (
    <div className={`relative group shrink-0 ${buttonDimensions} ${className}`}>
      {/* ── LUZ DE NEÓN PROYECTADA EXCLUSIVAMENTE HACIA ABAJO ── */}
      <div 
        className="absolute bottom-[-5px] left-1/2 -translate-x-1/2 w-[82%] h-2.5 bg-[#00f5a0] rounded-full blur-[10px] opacity-65 group-hover:opacity-90 transition-all duration-300 -z-10 group-hover:scale-x-105"
        style={{
          boxShadow: "0 8px 20px rgba(0, 245, 160, 0.45), 0 12px 30px rgba(0, 245, 160, 0.25)"
        }}
      />

      {/* Botón interactivo principal */}
      <motion.button 
        type="button"
        onClick={onClick}
        initial="rest"
        whileHover="hover"
        animate="rest"
        className="relative w-full h-full flex items-center bg-[#00f5a0] rounded-full overflow-hidden select-none cursor-pointer border-none outline-none p-0 transition-shadow duration-300"
        style={{
          boxShadow: "0 4px 14px rgba(0, 245, 160, 0.35)"
        }}
      >
        {/* Fondo negro expandible que en hover cubre todo el botón verde */}
        <motion.div 
          variants={bgVariants}
          transition={{ type: "spring", stiffness: 220, damping: 24 }}
          className="absolute bg-black rounded-full z-0 flex items-center justify-start p-0"
        >
          {/* Flecha dentro del contenedor negro */}
          <motion.div
            variants={arrowVariants}
            transition={{ type: "spring", stiffness: 220, damping: 24 }}
            className="flex items-center justify-center text-white shrink-0 w-10 h-10"
          >
            <ArrowUpRight className="w-[24px] h-[24px]" strokeWidth={2} />
          </motion.div>
        </motion.div>

        {/* Texto (z-10 para quedar sobre el fondo negro cuando se expande) */}
        <div className="relative z-10 flex items-center justify-center w-full h-full pointer-events-none pr-1">
          <motion.span 
            variants={textVariants}
            transition={{ type: "spring", stiffness: 220, damping: 24 }}
            className="text-black group-hover:text-white transition-colors duration-300 font-black tracking-[0.18em] uppercase text-[9.5px]"
            style={{ fontFamily: "'Bruno Ace SC', sans-serif" }}
          >
            {label}
          </motion.span>
        </div>
      </motion.button>
    </div>
  );
};

interface SeedChatConsoleProps {
  activePatient: any;
  onHoverChange?: (hover: boolean) => void;
  isHovered?: boolean;
  onOpenAddPatient?: () => void;
  isQuestionMode?: boolean;
  setIsQuestionMode?: (val: boolean) => void;
  questionType?: 'NEW_PATIENT' | 'INIT_EXPEDIENTE' | null;
  onConfirmQuestion?: (type: 'NEW_PATIENT' | 'INIT_EXPEDIENTE') => void;
}

export default function SeedChatConsole({ 
  activePatient, 
  onHoverChange, 
  isHovered, 
  onOpenAddPatient,
  isQuestionMode = false,
  setIsQuestionMode,
  questionType = null,
  onConfirmQuestion
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
  const [newPatientPhone, setNewPatientPhone] = useState('');
  const [isSubmittingLocal, setIsSubmittingLocal] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  // Obtener información real de Google Drive para la telemetría HUD
  const seedUserStr = sessionStorage.getItem('seed_user');
  const seedUser = seedUserStr ? JSON.parse(seedUserStr) : null;
  const hasGoogleDrive = !!seedUser?.googleAccessToken;
  const driveEmail = seedUser?.email || "doctor@dentaxy.com";

  useEffect(() => {
    if (!isQuestionMode || questionType !== 'NEW_PATIENT') return;
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, [isQuestionMode, questionType]);

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
            phone: newPatientPhone.trim() || 'Sin teléfono'
          }
        })
      });

      if (!createFolderRes.ok) throw new Error("Error al crear carpeta de paciente en Drive");

      // Notificar éxito al carrusel y sistema local
      window.dispatchEvent(new Event('patientCreated'));
      window.dispatchEvent(new CustomEvent('createNewPatientLocal', {
        detail: {
          name: folderName,
          edad: '30',
          genero: 'Masculino',
          telefono: newPatientPhone.trim() || 'Sin teléfono',
          motivo: 'Valoración inicial',
          alergias: 'Ninguna',
          estatus: 'Primera Cita'
        }
      }));

      setIsQuestionMode?.(false);
      setNewPatientName('');
      setNewPatientPhone('');
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

  const handleSendMessage = () => {
    if (!inputText.trim()) return;

    if (isExpedienteMode && currentQuestion?.type === 'text') {
      submitAnswer?.(inputText.trim());
      setInputText('');
      return;
    }

    // Simular el inicio de análisis ("task running")
    setIsAnalyzing(true);
    const q = inputText.toLowerCase();
    
    // Determinar paso de análisis en base al input
    if (q.includes('receta') || q.includes('medicamento') || q.includes('prescribir') || q.includes('dolor')) {
      setAnalysisStep('Redactando receta y cruzando dosificación local...');
    } else if (q.includes('nota') || q.includes('evolucion') || q.includes('historia') || q.includes('expediente')) {
      setAnalysisStep('Generando nota de evolución estructurada...');
    } else if (q.includes('alergia') || q.includes('alergias') || q.includes('peligro') || q.includes('riesgo')) {
      setAnalysisStep('Comprobando riesgos y alergias del paciente...');
    } else {
      setAnalysisStep('Procesando solicitud de redacción local...');
    }

    const savedInput = inputText;
    setInputText('');

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

  // La consola se expande si tiene hover o si el input tiene el foco (click activo) o en modo pregunta
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
        <div className="flex items-center justify-between w-full h-8 px-[18px] pb-1 border-b border-[var(--seed-row-border)]/20 mb-0.5 animate-in fade-in duration-300">
          <div className="flex items-center gap-2 text-[12px] font-black text-slate-800 dark:text-zinc-200 tracking-[0.18em] uppercase font-['Bruno_Ace_SC',_sans-serif]">
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
        <div className="flex items-center justify-between w-full h-6 px-[18px] animate-pulse">
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
          <span>Resumen de {name}</span>
        </div>
        <ChevronDown 
          size={13} 
          className={`text-[var(--seed-text-muted)] opacity-60 transition-transform duration-300 ${
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

  return (
    <div 
      className="w-full flex flex-col justify-between overflow-hidden transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] relative border mb-1.5"
      style={{
        height: containerHeight,
        borderRadius: containerRadius,
        background: 'var(--seed-card-bg)',
        borderColor: 'var(--seed-card-border)',
        boxShadow: containerShadow,
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        paddingTop: '8px',
        paddingBottom: '0px',
        paddingLeft: '0px',
        paddingRight: '0px'
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
      
      {/* Panel Superior: Reporte o Carga (Solo visible cuando está expandido) */}
      <div 
        className={`transition-all duration-300 flex-1 flex flex-col overflow-hidden px-[18px] ${
          showExpanded ? `opacity-100 pointer-events-auto ${effectiveIsQuestionMode ? 'mt-0 mb-1' : 'mt-1 mb-1.5'}` : 'opacity-0 h-0 pointer-events-none'
        }`}
      >
        {effectiveIsQuestionMode ? (
          questionType === 'NEW_PATIENT' ? (
            <div className="flex-1 flex flex-col justify-center items-center w-full gap-5 py-2 animate-in fade-in duration-300 relative select-none">
              
              {/* Visor superior HUD de fecha/hora (Reloj de Gran Formato con Traza SVG Asimétrica) */}
              <div className="w-full flex flex-col items-center relative select-none">
                {/* Reloj de Gran Formato */}
                <div className="flex flex-col items-center justify-center gap-0.5 mt-[-6px] mb-1">
                  <span className="text-[5.5px] tracking-[0.35em] font-mono text-slate-400 dark:text-zinc-500 uppercase font-black">
                    TELEMETRY_CLOCK_RECORD
                  </span>
                  <div className="text-[24px] sm:text-[26px] font-black tracking-[0.2em] text-slate-800 dark:text-zinc-100 flex items-center justify-center font-['JetBrains_Mono',_monospace] leading-none">
                    {currentTime.toLocaleTimeString('es-MX', { hour12: false })}
                  </div>
                  <span className="text-[7.5px] tracking-[0.2em] font-bold text-slate-500 dark:text-zinc-400 font-mono mt-0.5">
                    {currentTime.toLocaleDateString('es-MX', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }).toUpperCase()}
                  </span>
                </div>

                {/* Traza SVG Asimétrica Continua Tenue Superior */}
                <svg className="w-full h-3 text-slate-300 dark:text-zinc-800 opacity-60 dark:opacity-40" viewBox="0 0 400 12" fill="none" preserveAspectRatio="none">
                  <path d="M0 6 H160 L170 1 H230 L240 6 H400" stroke="currentColor" strokeWidth="1.2" />
                  <circle cx="170" cy="1" r="1.5" className="fill-slate-400 dark:fill-zinc-650" />
                  <circle cx="230" cy="1" r="1.5" className="fill-slate-400 dark:fill-zinc-650" />
                </svg>
              </div>

              {/* Formulario de Inputs tridimensionales con relieve neumórfico */}
              <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                {/* Input 1: Nombre Completo */}
                <div className="flex flex-col gap-1 w-full text-left">
                  <div className="flex items-center gap-1.5 font-mono text-[7px] tracking-widest text-slate-500 dark:text-zinc-400 select-none font-bold">
                    <User size={9} className="text-slate-400 dark:text-zinc-500" />
                    <span>NOMBRE COMPLETO</span>
                  </div>
                  <div className="relative group">
                    <input 
                      type="text" 
                      value={newPatientName}
                      onChange={(e) => setNewPatientName(e.target.value)}
                      className="w-full h-10 px-4 bg-slate-100/50 dark:bg-zinc-950/40 border border-slate-300/60 dark:border-zinc-800/80 rounded-full text-slate-900 dark:text-white text-xs focus:outline-none focus:border-slate-500 dark:focus:border-zinc-600 focus:bg-white dark:focus:bg-zinc-900/40 focus:ring-1 focus:ring-slate-500/10 dark:focus:ring-zinc-600/10 transition-all font-medium placeholder-slate-400 dark:placeholder-zinc-500 shadow-[inset_2px_2px_4px_rgba(0,0,0,0.06),_1px_1px_0px_rgba(255,255,255,0.9)] dark:shadow-[inset_2px_2px_5px_rgba(0,0,0,0.7),_1px_1px_1px_rgba(255,255,255,0.05)]" 
                      placeholder="Nombre del paciente"
                      autoFocus 
                    />
                  </div>
                </div>

                {/* Input 2: Teléfono */}
                <div className="flex flex-col gap-1 w-full text-left">
                  <div className="flex items-center gap-1.5 font-mono text-[7px] tracking-widest text-slate-500 dark:text-zinc-400 select-none font-bold">
                    <Phone size={9} className="text-slate-400 dark:text-zinc-500" />
                    <span>TELÉFONO CELULAR</span>
                  </div>
                  <div className="relative group">
                    <input 
                      type="tel" 
                      value={newPatientPhone}
                      onChange={(e) => setNewPatientPhone(e.target.value)}
                      className="w-full h-10 px-4 bg-slate-100/50 dark:bg-zinc-950/40 border border-slate-300/60 dark:border-zinc-800/80 rounded-full text-slate-900 dark:text-white text-xs focus:outline-none focus:border-slate-500 dark:focus:border-zinc-600 focus:bg-white dark:focus:bg-zinc-900/40 focus:ring-1 focus:ring-slate-500/10 dark:focus:ring-zinc-600/10 transition-all font-medium placeholder-slate-400 dark:placeholder-zinc-500 shadow-[inset_2px_2px_4px_rgba(0,0,0,0.06),_1px_1px_0px_rgba(255,255,255,0.9)] dark:shadow-[inset_2px_2px_5px_rgba(0,0,0,0.7),_1px_1px_1px_rgba(255,255,255,0.05)]" 
                      placeholder="Número de celular" 
                    />
                  </div>
                </div>
              </div>

              {/* Base HUD de Diagnóstico del Almacenamiento (Con Traza SVG Asimétrica Inferior) */}
              <div className="w-full mt-1 flex flex-col items-center">
                {/* Traza SVG Asimétrica de base */}
                <svg className="w-full h-3 text-slate-300 dark:text-zinc-800 opacity-60 dark:opacity-40" viewBox="0 0 400 12" fill="none" preserveAspectRatio="none">
                  <path d="M0 6 H160 L170 11 H230 L240 1 H400" stroke="currentColor" strokeWidth="1.2" />
                  <circle cx="170" cy="11" r="1.5" className="fill-slate-400 dark:fill-zinc-650" />
                  <circle cx="230" cy="11" r="1.5" className="fill-slate-400 dark:fill-zinc-650" />
                </svg>
                
                {/* Metadatos funcionales discretos con opacidad y contraste reducidos para hacer juego con las trazas */}
                <div className="w-full flex items-center justify-between font-mono text-[6px] sm:text-[6.5px] tracking-[0.22em] text-slate-400/50 dark:text-zinc-500/60 select-none px-1 mt-1 font-semibold">
                  <span>ROOT_PATH: GOOGLE_DRIVE://DENTAXY</span>
                  <span className="flex items-center gap-1"><span className={`w-1 h-1 rounded-full ${hasGoogleDrive ? 'bg-[#00c980]/50 dark:bg-[#00f5a0]/60' : 'bg-red-500/50'}`} />PROVIDER: {driveEmail.toUpperCase()}</span>
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
              {/* Botón CANCELAR con textura tridimensional */}
              <button 
                type="button"
                onClick={() => {
                  setIsQuestionMode?.(false);
                  setNewPatientName('');
                  setNewPatientPhone('');
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
                    setNewPatientPhone("");
                  }}
                  title="Restablecer formulario"
                  className="w-[34px] h-[34px] rounded-full flex items-center justify-center bg-white/40 dark:bg-zinc-950/20 backdrop-blur-md border border-slate-300/50 dark:border-zinc-850/60 text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white hover:border-[#00c980] dark:hover:border-[#00f5a0] hover:ring-1 hover:ring-[#00c980]/20 dark:hover:ring-[#00f5a0]/20 hover:shadow-[0_0_8px_rgba(0,245,160,0.2)] dark:hover:shadow-[0_0_10px_rgba(0,245,160,0.25)] transition-all cursor-pointer active:scale-90"
                >
                  <RefreshCw size={14} className="stroke-[2.2]" />
                </button>
              </div>

              {/* Botón CREAR EXPEDIENTE */}
              <div className="relative group shrink-0 h-[40px] flex-1 flex items-center justify-center">
                <FutureButtonConsole 
                  onClick={handleCreatePatientLocal}
                  label={isSubmittingLocal ? 'CREANDO...' : 'CREAR EXPEDIENTE'}
                />
              </div>
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

    </div>
  );
}
