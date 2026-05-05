import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import { FormDataState } from '@/types/historiaClinica';

import { useGenerarTodasRedacciones } from '@/hooks/useGenerarTodasRedacciones';
import { useHistoriaClinica } from '@/hooks/useHistoriaClinica';

// UI Components
import { ProgressLine } from './ui/ProgressLine';
import { CommandDock } from './ui/CommandDock';
import { DocumentWriterPanel } from './ui/DocumentWriterPanel';
import { SectionCard, ViewMode } from './ui/SectionCard';
import { useIsMobile } from '@/hooks/use-mobile';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

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
import { DiagnosticoCard } from './sections/DiagnosticoCard';
import { PronosticoCard } from './sections/PronosticoCard';
import { DatosGeneralesCard } from './sections/DatosGeneralesCard';
import { Odontograma } from '../historia-clinica/Odontograma';

interface DentaxyFormPanelProps {
  onGeneracionCompleta?: (datos: Record<string, string>, formData?: FormDataState) => void;
  onSeccionGenerada?: (seccionId: string, contenido: any) => void;
  onGeneracionIniciada?: (seccionId: string) => void;
  onGeneratingChange?: (generating: boolean) => void;
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
  onGeneratingChange
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
    { id: 'diagnostico', nombre: '22. Diagnóstico' },
    { id: 'pronostico', nombre: '23. Pronóstico' },
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

  // Resize state
  const [leftWidth, setLeftWidth] = useState<number>(55); // 55%
  const [isResizing, setIsResizing] = useState(false);

  React.useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isResizing) return;
      const newWidthPercentage = (e.clientX / window.innerWidth) * 100;
      // Limits between 30% and 70%
      if (newWidthPercentage > 30 && newWidthPercentage < 70) {
        setLeftWidth(newWidthPercentage);
      }
    };
    const handleMouseUp = () => {
      setIsResizing(false);
    };
    
    if (isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      // Change body cursor
      document.body.style.cursor = 'col-resize';
      document.body.style.userSelect = 'none';
    } else {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    }
    
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    };
  }, [isResizing]);

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

    // Show toast solo en desktop (en mobile estorba)
    if (!isMobile) {
      toast.success('Se redactó correctamente el apartado');
    }

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
      case 'diagnostico':
        return <DiagnosticoCard
          formData={formData}
          handleDiagnosticoChange={handleDiagnosticoChange}
          {...commonProps}
        />;
      case 'pronostico':
        return <PronosticoCard
          formData={formData}
          handlePronosticoChange={handlePronosticoChange}
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
    <div className="flex w-full h-full bg-white dark:bg-zinc-950 overflow-hidden relative">

      {/* Left Panel: Form View */}
      <div 
        className={cn(
          "flex flex-col relative h-full will-change-[width]",
          (!isDocumentOpen || isDocumentExpanded || isMobile) ? "transition-[width] duration-500 ease-out-back" : ""
        )}
        style={{ width: (isDocumentOpen && !isMobile && !isDocumentExpanded) ? `${leftWidth}%` : '100%' }}
      >
        {/* 1. Global Navigation: Progress Line (Sticky Top) — z-10 para no sobreponerse al panel derecho */}
        <div className="w-full sticky top-0 z-10 bg-white dark:bg-zinc-950 transition-all">
          <ProgressLine
            totalSteps={seccionesActivas.length}
            currentStep={currentStep}
            isGenerating={isGenerating}
            stepNames={seccionesActivas.map(s => s.nombre)}
            onStepClick={handleStepClick}
            stepStatuses={getStepStatuses() as any}
            isScrolled={isScrolled}
          />
        </div>

        {/* Main Content Area */}
        <div
          ref={scrollContainerRef}
          onScroll={handleScroll}
          className="flex-1 overflow-y-auto overflow-x-hidden pb-40 scroll-smooth dentaxy-scrollbar"
        >
          <div className="container mx-auto px-4 py-4 max-w-4xl">
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
                {/* 2. Focus Card: Section Container with Progressive Disclosure */}
                <div className="w-full" data-section={currentSectionInfo.id}>
                  <SectionCard
                    title={currentSectionInfo.nombre}
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

        {/* 3. Command Dock: Bottom Control Center */}
        <CommandDock
          onNext={handleNext}
          onPrev={handlePrev}
          onGenerate={handleGenerateCurrent}
          currentStep={currentStep}
          totalSteps={seccionesActivas.length}
          nextLabel={seccionesActivas[currentStep + 1]?.nombre?.split('. ')[1] || 'Finalizar'}
          isGenerating={isGenerating}
          canGoNext={currentStep < seccionesActivas.length - 1}
          canGoPrev={currentStep > 0}
        />

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
      </div>

      {/* Burbuja Flotante Dentaxy — aparece cuando el doc está cerrado o en móvil */}
      <AnimatePresence>
        {(!isDocumentOpen || isMobile) && Object.keys(generations).length > 0 && !isDocumentExpanded && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.94 }}
            onClick={() => {
              setIsDocumentOpen(true);
              if (isMobile) setIsDocumentExpanded(true);
            }}
            className="fixed bottom-24 right-5 z-[60] w-14 h-14 rounded-full flex items-center justify-center"
            style={{
              background: '#0f0f0f',
              boxShadow: isGenerating
                ? '0 0 0 0 rgba(52,211,153,0.7)'
                : '0 4px 24px rgba(0,0,0,0.35)',
            }}
          >
            {/* Anillo exterior pulsante cuando está redactando */}
            {isGenerating && (
              <>
                <motion.span
                  className="absolute inset-0 rounded-full border-2 border-emerald-400"
                  animate={{ scale: [1, 1.6], opacity: [0.7, 0] }}
                  transition={{ repeat: Infinity, duration: 1.2, ease: 'easeOut' }}
                />
                <motion.span
                  className="absolute inset-0 rounded-full border border-emerald-300"
                  animate={{ scale: [1, 1.35], opacity: [0.5, 0] }}
                  transition={{ repeat: Infinity, duration: 1.2, ease: 'easeOut', delay: 0.3 }}
                />
              </>
            )}
            <img
              src="/brand/dentaxy-icon-solid.png"
              alt="Ver documento"
              className="w-7 h-7 object-contain"
              style={{ filter: 'invert(1) brightness(2)' }}
            />
            {/* Punto verde vivo en esquina superior derecha */}
            <span
              className={cn(
                "absolute top-1 right-1 w-2.5 h-2.5 rounded-full border-2 border-[#0f0f0f]",
                isGenerating ? "bg-emerald-400 animate-pulse" : "bg-emerald-500"
              )}
            />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Resize Handle */}
      {isDocumentOpen && !isMobile && !isDocumentExpanded && (
        <div
          onMouseDown={() => setIsResizing(true)}
          className="w-1.5 h-full cursor-col-resize hover:bg-emerald-400/50 active:bg-emerald-500 transition-colors z-50 flex items-center justify-center shrink-0"
        >
          <div className="h-10 w-0.5 bg-zinc-300 rounded-full" />
        </div>
      )}

      {/* Right Panel: Split Document View or Maximized Modal */}
      <AnimatePresence>
        {(isDocumentOpen && (!isMobile || isDocumentExpanded)) && (
          <DocumentWriterPanel
            formData={formData}
            generations={generations}
            seccionesActivas={seccionesActivas}
            onClose={() => {
              if (isMobile || isDocumentExpanded) {
                setIsDocumentExpanded(false);
                if (isMobile) setIsDocumentOpen(false);
              } else {
                setIsDocumentOpen(false);
              }
            }}
            isExpanded={isDocumentExpanded}
            isMaximized={isDocumentExpanded}
            onToggleExpand={() => setIsDocumentExpanded(!isDocumentExpanded)}
          />
        )}
      </AnimatePresence>

    </div>
  );
}

export default DentaxyFormPanel;
