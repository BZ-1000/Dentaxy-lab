import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, ChevronLeft, ChevronRight, RotateCcw } from 'lucide-react';
import { FormDataState } from '@/types/historiaClinica';

import { useGenerarTodasRedacciones } from '@/hooks/useGenerarTodasRedacciones';
import { useHistoriaClinica } from '@/hooks/useHistoriaClinica';
import { getInitialFormState } from '@/utils/initialFormState';

// UI Components
import { ProgressLine } from './ui/ProgressLine';
import { AppleStyleDock } from '@/components/AppleStyleDock';
import { DocumentWriterPanel } from './ui/DocumentWriterPanel';
import { SectionCard, ViewMode } from './ui/SectionCard';
import { useIsMobile } from '@/hooks/use-mobile';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
} from '@/components/ui/resizable';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

// Section Card Imports (Wrappers with Visual Styling)
import { PadecimientoCard } from './sections/PadecimientoCard';
import { HeredofamiliaresCard } from './sections/HeredofamiliaresCard';
import { NoPatologicosCard } from './sections/NoPatologicosCard';
import { PatologicosCard } from './sections/PatologicosCard';
import { AlergicosCard } from './sections/AlergicosCard';
import { QuirurgicosCard } from './sections/QuirurgicosCard';
import { HemorragicosCard } from './sections/HemorragicosCard';
import { GinecoObstetricosCard } from './sections/GinecoObstetricosCard';
import { InterrogatorioCard } from './sections/InterrogatorioCard';
import { ExploracionFisicaCard } from './sections/ExploracionFisicaCard';
import { CabezaCard } from './sections/CabezaCard';
import { ATMCard } from './sections/ATMCard';
import { CuelloCard } from './sections/CuelloCard';
import { IntrabucalCard } from './sections/IntrabucalCard';
import { SalivalesCard } from './sections/SalivalesCard';
import { OclusionCard } from './sections/OclusionCard';
import { RelacionDientesCard } from './sections/RelacionDientesCard';
import { LineaMediaCard } from './sections/LineaMediaCard';
import { FrenillosCard } from './sections/FrenillosCard';
import { DatosGeneralesCard } from './sections/DatosGeneralesCard';
import { Odontograma } from '../historia-clinica/Odontograma';

interface DentaxyFormPanelProps {
  onGeneracionCompleta?: (datos: Record<string, string>, formData?: FormDataState) => void;
  onSeccionGenerada?: (seccionId: string, contenido: any) => void;
  onGeneracionIniciada?: (seccionId: string) => void;
  onGeneratingChange?: (generating: boolean) => void;
  disableProgressLineAnimation?: boolean;
  transparentBg?: boolean;
  onSectionTitleChange?: (title: string, step: number, total: number) => void;
}

const variants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 50 : -50,
    opacity: 0
  }),
  center: {
    zIndex: 1,
    x: 0,
    opacity: 1
  },
  exit: (direction: number) => ({
    zIndex: 0,
    x: direction < 0 ? 50 : -50,
    opacity: 0
  })
};

export const DentaxyFormPanel: React.FC<DentaxyFormPanelProps> = ({
  onSeccionGenerada,
  onGeneratingChange,
  disableProgressLineAnimation = false,
  transparentBg = false,
  onSectionTitleChange,
}) => {

  const seccionesGenerables = [
    { id: 'datosGenerales', nombre: '1. Datos Generales' },
    { id: 'padecimiento', nombre: '2. Padecimiento Actual' },
    { id: 'heredofamiliares', nombre: '3. Antecedentes Heredofamiliares' },
    { id: 'noPatologicos', nombre: '4. Antecedentes No Patológicos' },
    { id: 'patologicos', nombre: '5. Antecedentes Patológicos' },
    { id: 'alergicos', nombre: '6. Antecedentes Alérgicos' },
    { id: 'quirurgicos', nombre: '7. Antecedentes Quirúrgicos' },
    { id: 'hemorragicos', nombre: '8. Antecedentes Hemorrágicos' },
    { id: 'ginecoObstetricos', nombre: '9. Antecedentes Gineco-obstétricos' },
    { id: 'interrogatorio', nombre: '10. Interrogatorio por Sistemas' },
    { id: 'exploracionFisica', nombre: '11. Exploración Física' },
    { id: 'cabeza', nombre: '12. Examen de Cabeza' },
    { id: 'atm', nombre: '13. Articulación Craneomandibular' },
    { id: 'cuello', nombre: '14. Examen de Cuello' },
    { id: 'intrabucal', nombre: '15. Examen Intrabucal' },
    { id: 'odontograma', nombre: '16. Odontograma' },
    { id: 'salivales', nombre: '17. Glándulas Salivales' },
    { id: 'oclusion', nombre: '18. Oclusión' },
    { id: 'relacionDientes', nombre: '19. Relación de Dientes' },
    { id: 'lineaMedia', nombre: '20. Línea Media' },
    { id: 'frenillos', nombre: '21. Frenillos' },
  ];

  const [esMujer] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [direction, setDirection] = useState(0);
  const [viewMode, setViewMode] = useState<ViewMode>('form');
  const [isSectionExpanded, setIsSectionExpanded] = useState(true);

  // Micro-navigation state (para secciones como Padecimiento Actual)
  const [activeMicroStep, setActiveMicroStep] = useState(0);
  const [totalMicroSteps, setTotalMicroSteps] = useState(0);
  const [microStepNames, setMicroStepNames] = useState<string[]>([]);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Split-screen state
  const isMobile = useIsMobile();
  const [isDocumentOpen, setIsDocumentOpen] = useState(false);
  const [isDocumentExpanded, setIsDocumentExpanded] = useState(false);
  const [docWidth, setDocWidth] = useState(50); // New state for dynamic resizing
  const [isDraggingSplit, setIsDraggingSplit] = useState(false); // State to disable animations while dragging

  // Filter sections based on gender
  const seccionesActivas = seccionesGenerables.filter(s => s.id !== 'ginecoObstetricos' || esMujer);
  const currentSectionInfo = seccionesActivas[currentStep];

  /* Generaciones de contenido */
  const [generations, setGenerations] = useState<Record<string, any>>({});

  const {
    formData,
    handleDatosGeneralesChange,
    handlePadecimientoChange,
    handleDolorChange,
    handleSinSintomasChange,
    handleFamiliarChange,
    handleCondicionChange,
    handleAntecedenteChange,
    handleAntecedentePatologicoChange,
    handleAntecedenteAlergicoChange,
    handleAntecedenteQuirurgicoChange,
    handleAntecedenteHemorragicoChange,
    handleAntecedenteGinecoObstetricoChange,
    handleInterrogatorioChange,
    handleExploracionFisicaChange,
    handleExamenCabezaChange,
    handleArticulacionCraneomandibularChange,
    handleExamenCuelloChange,
    handleExamenIntrabucalChange,
    handleGlandulasSalivalesChange,
    handleOclusionChange,
    handleRelacionDientesChange,
    handleLineaMediaChange,
    handleFrenillosChange,
    handleOdontogramaChange,
    handleDiagnosticoChange,
    handlePronosticoChange,
    toggleService,
    cargarFormulario,
  } = useHistoriaClinica();

  const handleContentGenerated = (seccionId: string, contenido: any, textoPlano?: string) => {
    setGenerations(prev => ({ ...prev, [seccionId]: contenido }));

    // Open split panel on Desktop
    if (!isMobile) {
      setIsDocumentOpen(true);
    }

    // Notify parent if listener exists
    if (onSeccionGenerada && typeof contenido === 'string') {
      onSeccionGenerada(seccionId, contenido);
    } else if (onSeccionGenerada && textoPlano) {
      onSeccionGenerada(seccionId, textoPlano);
    }
  };

  const handleGenerationComplete = () => {
    window.dispatchEvent(new Event('dentaxy-generation-complete'));
  };

  /* Logic needed for ProgressLine status */
  const getStepStatuses = () => {
    return seccionesActivas.map((seccion, index) => {
      if (index === currentStep) return 'active';
      if (generations[seccion.id]) return 'completed';
      if (seccion.id === 'padecimiento') {
        if (formData.padecimientoActual.motivoConsulta &&
          formData.padecimientoActual.motivoConsulta.length > 30) return 'completed';
      }
      if (index < currentStep) return 'skipped';
      return 'pending';
    });
  };

  const handleStepClick = (index: number) => {
    setDirection(index > currentStep ? 1 : -1);
    setCurrentStep(index);
    setViewMode('form');
  };

  const onSectionActive = (sectionId: string) => {
    const index = seccionesActivas.findIndex(s => s.id === sectionId);
    if (index !== -1 && index !== currentStep) {
      setDirection(index > currentStep ? 1 : -1);
      setCurrentStep(index);
      setViewMode('form');
    }
  };

  const { isGenerating, progress, generarTodo } = useGenerarTodasRedacciones(
    seccionesActivas,
    handleGenerationComplete,
    onSectionActive
  );

  React.useEffect(() => {
    if (onGeneratingChange) onGeneratingChange(isGenerating);
  }, [isGenerating, onGeneratingChange]);

  // Notificar al padre el título de la sección activa cada vez que cambia
  React.useEffect(() => {
    if (onSectionTitleChange && currentSectionInfo) {
      const cleanTitle = currentSectionInfo.nombre.replace(/^\d+\.\s*/, '');
      onSectionTitleChange(cleanTitle, currentStep + 1, seccionesActivas.length);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentStep]);

  const handleNext = () => {
    if (totalMicroSteps > 0 && activeMicroStep < totalMicroSteps - 1) {
      setActiveMicroStep(prev => prev + 1);
      scrollContainerRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    if (currentStep < seccionesActivas.length - 1) {
      setDirection(1);
      setCurrentStep(prev => prev + 1);
      setActiveMicroStep(0);
      setTotalMicroSteps(0);
      setViewMode('form');
      scrollContainerRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handlePrev = () => {
    if (totalMicroSteps > 0 && activeMicroStep > 0) {
      setActiveMicroStep(prev => prev - 1);
      scrollContainerRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    if (currentStep > 0) {
      setDirection(-1);
      setCurrentStep(prev => prev - 1);
      setActiveMicroStep(0);
      setTotalMicroSteps(0);
      setViewMode('form');
      scrollContainerRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Función para saltar directamente a una sección (y opcionalmente a un micro-paso)
  const jumpToSection = (sectionIndex: number, microStepIndex: number = 0) => {
    if (sectionIndex !== currentStep) {
      setDirection(sectionIndex > currentStep ? 1 : -1);
      setCurrentStep(sectionIndex);
      setActiveMicroStep(microStepIndex);
      if (sectionIndex !== currentStep) {
        setTotalMicroSteps(0); // Se reiniciará cuando se monte la nueva sección
      }
      setViewMode('form');
      scrollContainerRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (totalMicroSteps > 0 && microStepIndex !== activeMicroStep) {
      setActiveMicroStep(microStepIndex);
      scrollContainerRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  /* View Mode Toggling */
  const handleToggleViewMode = () => {
    setViewMode(prev => prev === 'form' ? 'redaction' : 'form');
  };

  const renderCurrentStepContent = () => {
    const section = seccionesActivas[currentStep];
    const onSeccionGeneradaProp = (seccionId: string, text: string) => handleContentGenerated(seccionId, text);
    const commonProps = {
      onToggleViewMode: handleToggleViewMode,
      onSeccionGenerada: onSeccionGeneradaProp
    };

    switch (section.id) {
      case 'datosGenerales':
        return <DatosGeneralesCard
          formData={formData}
          handleDatosGeneralesChange={handleDatosGeneralesChange}
          {...commonProps}
        />;
      case 'padecimiento':
        return <PadecimientoCard
          formData={formData}
          handlePadecimientoChange={handlePadecimientoChange}
          handleDolorChange={handleDolorChange}
          handleSinSintomasChange={handleSinSintomasChange}
          onSectionComplete={handleNext}
          microStep={activeMicroStep}
          onMicroStepChange={setActiveMicroStep}
          onTotalMicroStepsChange={(total, names) => {
            setTotalMicroSteps(total);
            setMicroStepNames(names);
          }}
          {...commonProps}
        />;
      case 'heredofamiliares':
        return <HeredofamiliaresCard
          formData={formData}
          handleFamiliarChange={handleFamiliarChange}
          handleCondicionChange={handleCondicionChange}
          onSectionComplete={handleNext}
          microStep={activeMicroStep}
          onMicroStepChange={setActiveMicroStep}
          onTotalMicroStepsChange={(total, names) => {
            setTotalMicroSteps(total);
            setMicroStepNames(names);
          }}
          {...commonProps}
        />;
      case 'noPatologicos':
        return <NoPatologicosCard
          formData={formData}
          handleAntecedenteNoPatologicoChange={handleAntecedenteChange}
          toggleService={toggleService}
          onSectionComplete={handleNext}
          microStep={activeMicroStep}
          onMicroStepChange={setActiveMicroStep}
          onTotalMicroStepsChange={(total, names) => {
            setTotalMicroSteps(total);
            setMicroStepNames(names);
          }}
          {...commonProps}
        />;
      case 'patologicos':
        return <PatologicosCard
          formData={formData}
          handleAntecedentePatologicoChange={handleAntecedentePatologicoChange}
          onSectionComplete={handleNext}
          microStep={activeMicroStep}
          onMicroStepChange={setActiveMicroStep}
          onTotalMicroStepsChange={(total, names) => {
            setTotalMicroSteps(total);
            setMicroStepNames(names);
          }}
          {...commonProps}
        />;
      case 'alergicos':
        return <AlergicosCard
          formData={formData}
          handleAntecedenteAlergicoChange={handleAntecedenteAlergicoChange}
          onSectionComplete={handleNext}
          microStep={activeMicroStep}
          onMicroStepChange={setActiveMicroStep}
          onTotalMicroStepsChange={(total, names) => {
            setTotalMicroSteps(total);
            setMicroStepNames(names);
          }}
          {...commonProps}
        />;
      case 'quirurgicos':
        return <QuirurgicosCard
          formData={formData}
          handleAntecedenteQuirurgicoChange={handleAntecedenteQuirurgicoChange}
          onSectionComplete={handleNext}
          microStep={activeMicroStep}
          onMicroStepChange={setActiveMicroStep}
          onTotalMicroStepsChange={(total, names) => {
            setTotalMicroSteps(total);
            setMicroStepNames(names);
          }}
          {...commonProps}
        />;
      case 'hemorragicos':
        return <HemorragicosCard
          formData={formData}
          handleAntecedenteHemorragicoChange={handleAntecedenteHemorragicoChange}
          {...commonProps}
        />;
      case 'ginecoObstetricos':
        return <GinecoObstetricosCard
          formData={formData}
          handleAntecedenteGinecoObstetricoChange={handleAntecedenteGinecoObstetricoChange}
          {...commonProps}
        />;
      case 'interrogatorio':
        return <InterrogatorioCard
          formData={formData}
          handleInterrogatorioChange={handleInterrogatorioChange}
          {...commonProps}
        />;
      case 'exploracionFisica':
        return <ExploracionFisicaCard
          formData={formData}
          handleExploracionFisicaChange={handleExploracionFisicaChange}
          {...commonProps}
        />;
      case 'cabeza':
        return <CabezaCard
          formData={formData}
          handleExamenCabezaChange={handleExamenCabezaChange}
          {...commonProps}
        />;
      case 'atm':
        return <ATMCard
          formData={formData}
          handleArticulacionCraneomandibularChange={handleArticulacionCraneomandibularChange}
          {...commonProps}
        />;
      case 'cuello':
        return <CuelloCard
          formData={formData}
          handleExamenCuelloChange={handleExamenCuelloChange}
          {...commonProps}
        />;
      case 'intrabucal':
        return <IntrabucalCard
          formData={formData}
          handleExamenIntrabucalChange={handleExamenIntrabucalChange}
          {...commonProps}
        />;
      case 'odontograma': {
        return <Odontograma
          formData={formData}
          handleOdontogramaChange={handleOdontogramaChange}
          onRedaccionGenerada={(content: string) => handleContentGenerated('odontograma', content)}
        />;
      }
      case 'salivales':
        return <SalivalesCard
          formData={formData}
          handleGlandulasSalivalesChange={handleGlandulasSalivalesChange}
          {...commonProps}
        />;
      case 'oclusion':
        return <OclusionCard
          formData={formData}
          handleOclusionChange={handleOclusionChange}
          {...commonProps}
        />;
      case 'relacionDientes':
        return <RelacionDientesCard
          formData={formData}
          handleRelacionDientesChange={handleRelacionDientesChange}
          {...commonProps}
        />;
      case 'lineaMedia':
        return <LineaMediaCard
          formData={formData}
          handleLineaMediaChange={handleLineaMediaChange}
          {...commonProps}
        />;
      case 'frenillos':
        return <FrenillosCard
          formData={formData}
          handleFrenillosChange={handleFrenillosChange}
          {...commonProps}
        />;
      default:
        return null;
    }
  };

  /* Scroll Detection for Sticky Progress Bar */
  const [isScrolled, setIsScrolled] = useState(false);
  const scrollContainerRef = React.useRef<HTMLDivElement>(null);

  const handleScroll = () => {
    if (scrollContainerRef.current) {
      setIsScrolled(scrollContainerRef.current.scrollTop > 20);
    }
  };

  /* 
     New Handler for the Dock "Ver Redacción IA" button.
     It mimics clicking the local "Generar" button inside the active section.
  */
  const handleGenerateCurrent = async () => {
    const currentSectionId = seccionesActivas[currentStep].id;
    // ... logic remains same ...
    const sectionContainer = document.querySelector(`div[data-section="${currentSectionId}"]`);

    if (sectionContainer) {
      const buttons = Array.from(sectionContainer.querySelectorAll('button'));
      const generateButton = buttons.find(btn => {
        const text = btn.textContent?.toLowerCase() || '';
        return btn.classList.contains('data-trigger-generation') || text.includes('generar redacción') || text.includes('redactar') || text.includes('generar') || text.includes('ver redacción');
      });

      if (generateButton) {
        (generateButton as HTMLButtonElement).click();
      } else {
        console.warn('Dock: No local generate button found for ' + currentSectionId);
      }
    }
  };

  // Handler para reiniciar SOLO la sección actual (sin alert, sin recarga)
  const handleReset = () => {
    const sectionId = currentSectionInfo.id;
    const initialState = getInitialFormState();

    // Mapa de sectionId → clave en formData
    const sectionKeyMap: Record<string, keyof typeof initialState> = {
      datosGenerales:              'datosGenerales',
      padecimiento:                'padecimientoActual',
      heredofamiliares:            'antecedentesHeredoFamiliares',
      noPatologicos:               'antecedentesPersonalesNoPatologicos',
      patologicos:                 'antecedentesPersonalesPatologicos',
      alergicos:                   'antecedentesAlergicos',
      quirurgicos:                 'antecedentesQuirurgicos',
      hemorragicos:                'antecedentesHemorragicos',
      ginecoObstetricos:           'antecedentesGinecoObstetricos',
      interrogatorio:              'interrogatorioSistemas',
      exploracionFisica:           'exploracionFisica',
      cabeza:                      'examenCabeza',
      atm:                         'articulacionCraneomandibular',
      cuello:                      'examenCuello',
      intrabucal:                  'examenIntrabucal',
      odontograma:                 'odontograma',
      salivales:                   'glandulasSalivales',
      oclusion:                    'oclusion',
      relacionDientes:             'relacionDientes',
      lineaMedia:                  'lineaMedia',
      frenillos:                   'frenillos',
    };

    const formKey = sectionKeyMap[sectionId];
    if (!formKey) return;

    // Merge: mantener todo el formData pero resetear solo la sección
    const nuevoFormData = {
      ...formData,
      [formKey]: initialState[formKey],
    } as typeof initialState;

    cargarFormulario(nuevoFormData);

    // Limpiar también la redacción generada de esta sección
    setGenerations(prev => {
      const next = { ...prev };
      delete next[sectionId];
      return next;
    });

    // Regresar a vista de formulario
    setViewMode('form');
    scrollContainerRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className={cn(
      "flex w-full h-full overflow-hidden relative pt-3 md:pt-4 pl-3 md:pl-4 pr-3 md:pr-4 pb-0 md:pb-0 gap-3 md:gap-4",
      transparentBg ? "bg-transparent" : "bg-zinc-50/50 dark:bg-zinc-950/50"
    )}>

      {/* Left Panel: Form View */}
      <motion.div 
        initial={false}
        animate={{ 
          width: (isDocumentOpen && !isMobile) ? (isDocumentExpanded ? "0%" : `${100 - docWidth}%`) : "100%",
          maxWidth: (!isDocumentOpen && !isMobile) ? "54rem" : "100%",
          opacity: (isDocumentOpen && !isMobile && isDocumentExpanded) ? 0 : 1 
        }}
        transition={{ type: 'spring', stiffness: 350, damping: 30 }}
        className={cn(
          "flex flex-col relative h-full shrink-0 will-change-[width,max-width]",
          "bg-white rounded-2xl md:rounded-3xl border border-zinc-200/80 shadow-2xl overflow-hidden mx-auto transition-all duration-300",
          isDocumentOpen && isMobile && "hidden"
        )}
      >


        {/* Main Content Area */}
        <div
          ref={scrollContainerRef}
          onScroll={handleScroll}
          className="flex-1 overflow-y-auto overflow-x-hidden pb-28 pt-6 md:pt-10 scroll-smooth dentaxy-scrollbar flex flex-col items-center"
        >
          <div className="container mx-auto px-4 md:px-6 max-w-3xl w-full my-auto">

            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={currentStep}
                custom={direction}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{
                  x: { type: "spring", stiffness: 300, damping: 30 },
                  opacity: { duration: 0.2 }
                }}
                className="w-full flex justify-center"
              >
                {/* 2. Focus Card: Section Container */}
                <div className="w-full" data-section={currentSectionInfo.id}>
                  <SectionCard
                    title={""}
                    viewMode={viewMode}
                    onViewModeChange={setViewMode}
                    redactionPreview={generations[currentSectionInfo.id]}
                    isExpanded={isSectionExpanded}
                    onToggleExpand={() => setIsSectionExpanded(!isSectionExpanded)}
                    hideGlobalToggle={currentSectionInfo.id === 'padecimiento'}
                  >
                    {renderCurrentStepContent()}
                  </SectionCard>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* ── DOCK PREMIUM DE NAVEGACIÓN (Bottom) ─────────────────────────────── */}
        <div className="absolute bottom-0 left-0 right-0 z-50 flex items-center justify-center px-4 pb-4 pt-3 pointer-events-none">
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ type: 'spring', damping: 26, stiffness: 260, delay: 0.12 }}
            className="pointer-events-auto relative flex items-center gap-1 p-1.5 rounded-[22px]"
            style={{
              background: 'linear-gradient(145deg, rgba(18,18,22,0.94) 0%, rgba(10,10,14,0.97) 100%)',
              backdropFilter: 'blur(28px) saturate(180%)',
              WebkitBackdropFilter: 'blur(28px) saturate(180%)',
              border: '1px solid rgba(255,255,255,0.10)',
              boxShadow: '0 0 0 1px rgba(255,255,255,0.04) inset, 0 20px 60px rgba(0,0,0,0.55), 0 8px 20px rgba(0,0,0,0.35), 0 2px 6px rgba(0,0,0,0.25)',
            }}
          >
            {/* Reflejo superior tipo liquid glass */}
            <div
              className="absolute top-0 left-4 right-4 h-px rounded-full pointer-events-none"
              style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.18), transparent)' }}
            />

            {/* ── Botón ANTERIOR ── */}
            <motion.button
              onClick={handlePrev}
              disabled={currentStep === 0}
              whileHover={currentStep > 0 ? { scale: 1.04 } : {}}
              whileTap={currentStep > 0 ? { scale: 0.93 } : {}}
              className={cn(
                "relative flex items-center gap-1.5 px-4 py-2.5 rounded-[16px] text-[13px] font-semibold transition-colors duration-200 select-none",
                currentStep === 0
                  ? "text-white/20 cursor-not-allowed"
                  : "text-white/70 hover:text-white hover:bg-white/[0.08] cursor-pointer"
              )}
              title="Sección anterior"
            >
              <ChevronLeft size={15} strokeWidth={2.5} />
              <span className="hidden sm:inline tracking-tight">Anterior</span>
            </motion.button>

            {/* Separador */}
            <div className="w-px h-7 mx-0.5 rounded-full" style={{ background: 'rgba(255,255,255,0.10)' }} />

            {/* ── Centro: Popover de navegación macro/micro ── */}
            <Popover open={isMenuOpen} onOpenChange={setIsMenuOpen}>
              <PopoverTrigger asChild>
                <button
                  type="button"
                  className="flex flex-col items-center min-w-[140px] px-3 py-1 cursor-pointer hover:bg-white/[0.08] active:scale-95 rounded-xl transition-all border border-transparent hover:border-white/10"
                >
                  <AnimatePresence mode="wait">
                    <motion.span
                      key={currentStep + '-' + activeMicroStep}
                      initial={{ opacity: 0, y: -5, filter: 'blur(4px)' }}
                      animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                      exit={{ opacity: 0, y: 5, filter: 'blur(4px)' }}
                      transition={{ duration: 0.2, ease: 'easeOut' }}
                      className="text-[11.5px] font-bold text-white/90 text-center leading-tight line-clamp-1 max-w-[150px] tracking-tight"
                    >
                      {currentSectionInfo.nombre.replace(/^\d+\.\s*/, '')}
                      {totalMicroSteps > 0 && microStepNames[activeMicroStep] && (
                        <span className="block text-[9.5px] text-white/60 font-medium">
                          {microStepNames[activeMicroStep]}
                        </span>
                      )}
                    </motion.span>
                  </AnimatePresence>
                  <div className="flex items-center gap-2 mt-1.5">
                    {/* Indicador Numérico */}
                    <span className="text-[10px] font-bold tabular-nums" style={{ color: 'rgba(255,255,255,0.35)' }}>
                      <span style={{ color: 'rgba(255,255,255,0.7)' }}>
                        {totalMicroSteps > 0 ? activeMicroStep + 1 : currentStep + 1}
                      </span>
                      <span style={{ color: 'rgba(255,255,255,0.25)' }}>/</span>
                      {totalMicroSteps > 0 ? totalMicroSteps : seccionesActivas.length}
                    </span>
                  </div>
                </button>
              </PopoverTrigger>
              <PopoverContent 
                side="top"
                align="center"
                sideOffset={16}
                className="z-[999999] w-[300px] p-2.5 bg-zinc-950/95 border-white/15 backdrop-blur-2xl rounded-2xl shadow-[0_25px_60px_rgba(0,0,0,0.85)] text-white dentaxy-scrollbar max-h-[60vh] overflow-y-auto"
              >
                <div className="flex flex-col gap-1">
                  <span className="text-[11px] font-bold text-white/40 px-2 py-1 uppercase tracking-wider">Saltar a sección</span>
                  {seccionesActivas.map((sec, secIdx) => (
                    <React.Fragment key={sec.id}>
                      <button
                        type="button"
                        onClick={() => {
                          jumpToSection(secIdx, 0);
                          setIsMenuOpen(false);
                        }}
                        className={cn(
                          "w-full text-left px-3 py-2 rounded-xl text-[13px] font-medium transition-all duration-200 flex items-center justify-between",
                          secIdx === currentStep 
                            ? "bg-indigo-600/30 border border-indigo-500/40 text-indigo-200 font-semibold" 
                            : "text-white/70 hover:text-white hover:bg-white/10"
                        )}
                      >
                        <span>{sec.nombre}</span>
                        {secIdx === currentStep && (
                          <span className="w-2 h-2 rounded-full bg-indigo-400 shadow-[0_0_8px_#818cf8]" />
                        )}
                      </button>
                      {/* Mostrar sub-pasos si estamos en esta sección y tiene microSteps */}
                      {secIdx === currentStep && totalMicroSteps > 0 && (
                        <div className="flex flex-col gap-1 pl-3 pr-1 my-1 border-l-2 border-indigo-500/40 ml-3">
                          {microStepNames.map((name, microIdx) => (
                            <button
                              key={microIdx}
                              type="button"
                              onClick={() => {
                                jumpToSection(secIdx, microIdx);
                                setIsMenuOpen(false);
                              }}
                              className={cn(
                                "w-full text-left px-3 py-1.5 rounded-lg text-[11.5px] transition-all duration-200 line-clamp-1",
                                microIdx === activeMicroStep 
                                  ? "bg-indigo-500/30 text-indigo-200 font-bold" 
                                  : "text-white/50 hover:text-white/90 hover:bg-white/5"
                              )}
                            >
                              {microIdx + 1}. {name}
                            </button>
                          ))}
                        </div>
                      )}
                    </React.Fragment>
                  ))}
                </div>
              </PopoverContent>
            </Popover>

            {/* Separador */}
            <div className="w-px h-7 mx-0.5 rounded-full" style={{ background: 'rgba(255,255,255,0.10)' }} />

            {/* ── Botón REINICIAR ── */}
            <motion.button
              onClick={handleReset}
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.91 }}
              className="w-9 h-9 rounded-[14px] flex items-center justify-center transition-colors duration-200 cursor-pointer"
              style={{ color: 'rgba(255,255,255,0.30)' }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLButtonElement).style.color = '#f87171';
                (e.currentTarget as HTMLButtonElement).style.background = 'rgba(239,68,68,0.12)';
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.color = 'rgba(255,255,255,0.30)';
                (e.currentTarget as HTMLButtonElement).style.background = 'transparent';
              }}
              title="Reiniciar sección"
            >
              <RotateCcw size={14} strokeWidth={2.5} />
            </motion.button>

            {/* Separador */}
            <div className="w-px h-7 mx-0.5 rounded-full" style={{ background: 'rgba(255,255,255,0.10)' }} />

            {/* ── Botón SIGUIENTE ── */}
            <motion.button
              onClick={handleNext}
              disabled={currentStep === seccionesActivas.length - 1}
              whileHover={currentStep < seccionesActivas.length - 1 ? { scale: 1.04 } : {}}
              whileTap={currentStep < seccionesActivas.length - 1 ? { scale: 0.94 } : {}}
              className={cn(
                "relative flex items-center gap-2 px-5 py-2.5 rounded-[16px] text-[13px] font-bold tracking-tight overflow-hidden select-none transition-all duration-200",
                currentStep === seccionesActivas.length - 1
                  ? "cursor-not-allowed"
                  : "cursor-pointer"
              )}
              style={currentStep === seccionesActivas.length - 1 ? {
                background: 'rgba(255,255,255,0.06)',
                color: 'rgba(255,255,255,0.20)',
              } : {
                background: 'linear-gradient(145deg, #ffffff 0%, #e8e8e8 100%)',
                color: '#0a0a0a',
                boxShadow: '0 0 0 1px rgba(255,255,255,0.9) inset, 0 4px 20px rgba(255,255,255,0.25), 0 2px 8px rgba(0,0,0,0.4)',
              }}
              title="Siguiente sección"
            >
              {/* Glow sweep top */}
              {currentStep < seccionesActivas.length - 1 && (
                <div
                  className="absolute inset-x-0 top-0 h-[40%] pointer-events-none rounded-t-[16px]"
                  style={{ background: 'linear-gradient(180deg, rgba(255,255,255,0.55) 0%, transparent 100%)' }}
                />
              )}
              <span className="hidden sm:inline relative z-10">Siguiente</span>
              <ChevronRight size={15} strokeWidth={3} className="relative z-10" />
            </motion.button>
          </motion.div>
        </div>

        {/* Floating Automation Status Overlay */}
        {isGenerating && progress && (
          <div className="fixed top-24 right-6 z-50 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-gradient-to-br from-emerald-400 to-emerald-600 text-white px-4 py-2 rounded-xl flex items-center gap-3 shadow-[0_0_18px_rgba(52,211,153,0.55)] border-0 hover:shadow-[0_0_24px_rgba(52,211,153,0.7)] transition-all"
            >
              <Loader2 className="h-4 w-4 animate-spin" />
              <div className="flex flex-col">
                <span className="text-[10px] font-bold uppercase">Dentaxy AI Running</span>
                <span className="text-xs text-zinc-600 dark:text-zinc-400">{progress.percentage}% Completado</span>
              </div>
            </motion.div>
          </div>
        )}
      </motion.div>

      {/* Right Panel: Split Document View */}
      <AnimatePresence>
        {isDocumentOpen && (
          <DocumentWriterPanel
            formData={formData}
            generations={generations}
            seccionesActivas={seccionesActivas}
            onClose={() => setIsDocumentOpen(false)}
            isExpanded={isDocumentExpanded}
            onToggleExpand={() => setIsDocumentExpanded(!isDocumentExpanded)}
            onNext={handleNext}
            canGoNext={currentStep < seccionesActivas.length - 1}
            width={isMobile ? 100 : docWidth}
          />
        )}
      </AnimatePresence>

    </div>
  );
}

export default DentaxyFormPanel;
