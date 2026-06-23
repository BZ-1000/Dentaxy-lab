import React, { useState, useEffect } from 'react';
import { Plus, Mic, ChevronDown, Sparkles, Send, Check, X } from 'lucide-react';
import { useCliStore } from '@/stores/useCliStore';

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
  const containerHeight = isQuestionMode ? '230px' : showExpanded ? '280px' : '112px';
  const containerRadius = '20px';
  const containerShadow = showExpanded ? 'var(--seed-card-shadow), inset 0 1px 0 var(--seed-card-border)' : '0 8px 24px -4px rgba(0, 0, 0, 0.4)';

  // Renderizado del cabezal estilo Antigravity (1 task running / Resumen)
  const renderHeader = () => {
    if (isQuestionMode) {
      return (
        <div className="flex items-center justify-between w-full h-6 px-[18px] pb-1 border-b border-[var(--seed-row-border)]/20 mb-0.5 animate-in fade-in duration-300">
          <div className="flex items-center gap-2 text-[9.5px] font-bold text-[var(--seed-text-muted)] tracking-wider uppercase">
            <span>Confirmación</span>
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
          <div className="flex-1 flex flex-col justify-start items-start animate-in fade-in duration-300 px-1 pt-1 pb-0 w-full overflow-hidden">
            {/* Título de la pregunta */}
            <div className="text-[19px] sm:text-[20px] font-medium text-slate-700 dark:text-[var(--seed-text-main)] mb-1.5 w-full leading-snug tracking-tight animate-in fade-in duration-300">
              {isExpedienteMode && currentQuestion ? currentQuestion.text :
                questionType === 'NEW_PATIENT' 
                  ? '¿Deseas registrar un nuevo paciente?' 
                  : `¿Deseas iniciar el expediente clínico de ${name}?`
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
