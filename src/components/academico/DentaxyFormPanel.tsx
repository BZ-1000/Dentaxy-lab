import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import { FormDataState } from '@/types/historiaClinica';

import { useGenerarTodasRedacciones } from '@/hooks/useGenerarTodasRedacciones';
import { useHistoriaClinica } from '@/hooks/useHistoriaClinica';

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
    if (currentStep < seccionesActivas.length - 1) {
      setDirection(1);
      setCurrentStep(prev => prev + 1);
      setViewMode('form');
      scrollContainerRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setDirection(-1);
      setCurrentStep(prev => prev - 1);
      setViewMode('form');
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
          onNextStep={handleNext}
          {...commonProps}
        />;
      case 'padecimiento':
        return <PadecimientoCard
          formData={formData}
          handlePadecimientoChange={handlePadecimientoChange}
          handleDolorChange={handleDolorChange}
          handleSinSintomasChange={handleSinSintomasChange}
          {...commonProps}
        />;
      case 'heredofamiliares':
        return <HeredofamiliaresCard
          formData={formData}
          handleFamiliarChange={handleFamiliarChange}
          handleCondicionChange={handleCondicionChange}
          {...commonProps}
        />;
      case 'noPatologicos':
        return <NoPatologicosCard
          formData={formData}
          handleAntecedenteNoPatologicoChange={handleAntecedenteChange}
          toggleService={toggleService}
          {...commonProps}
        />;
      case 'patologicos':
        return <PatologicosCard
          formData={formData}
          handleAntecedentePatologicoChange={handleAntecedentePatologicoChange}
          {...commonProps}
        />;
      case 'alergicos':
        return <AlergicosCard
          formData={formData}
          handleAntecedenteAlergicoChange={handleAntecedenteAlergicoChange}
          {...commonProps}
        />;
      case 'quirurgicos':
        return <QuirurgicosCard
          formData={formData}
          handleAntecedenteQuirurgicoChange={handleAntecedenteQuirurgicoChange}
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
          opacity: (isDocumentOpen && !isMobile && isDocumentExpanded) ? 0 : 1 
        }}
        transition={{ type: 'spring', stiffness: 350, damping: 30 }}
        className={cn(
          "flex flex-col relative h-full shrink-0 will-change-[width]", /* CLAVE: quitamos overflow-hidden para que position:sticky del ProgressLine funcione */
          isDocumentOpen && isMobile && "hidden"
        )}
      >
        {/* 1. Global Navigation: Progress Line (Fixed Top) */}
        <div className="w-full relative z-50 bg-transparent transition-all border-b border-transparent pointer-events-auto">
          <ProgressLine
            totalSteps={seccionesActivas.length}
            currentStep={currentStep}
            isGenerating={isGenerating}
            stepNames={seccionesActivas.map(s => s.nombre)}
            onStepClick={handleStepClick}
            stepStatuses={getStepStatuses() as any}
            isScrolled={disableProgressLineAnimation ? false : isScrolled}
          />
        </div>

        {/* Main Content Area */}
        <div
          ref={scrollContainerRef}
          onScroll={handleScroll}
          className="flex-1 overflow-y-auto overflow-x-hidden pb-40 scroll-smooth dentaxy-scrollbar"
        >
          <div className="container mx-auto px-4 pt-1 pb-4 max-w-4xl">

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
