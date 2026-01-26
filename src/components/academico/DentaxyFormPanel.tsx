import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HTMLTypewriterEffect } from '@/components/ui/HTMLTypewriterEffect';
import { Loader2 } from 'lucide-react';
import { FormDataState } from '@/types/historiaClinica';

import { useGenerarTodasRedacciones } from '@/hooks/useGenerarTodasRedacciones';
import { useHistoriaClinica } from '@/hooks/useHistoriaClinica';

// Master Plan Components
import { ProgressLine } from '@/components/academico/ui/ProgressLine';
import { CommandDock } from '@/components/academico/ui/CommandDock';
import { SectionCard, ViewMode } from '@/components/academico/ui/SectionCard';

// Real Component Imports
import PadecimientoActual from '@/components/historia-clinica/PadecimientoActual';
import AntecedentesHeredoFamiliares from '@/components/historia-clinica/AntecedentesHeredoFamiliares';
import AntecedentesPersonalesNoPatologicos from '@/components/historia-clinica/AntecedentesPersonalesNoPatologicos';
import AntecedentesPersonalesPatologicos from '@/components/historia-clinica/AntecedentesPersonalesPatologicos';
import AntecedentesAlergicos from '@/components/historia-clinica/AntecedentesAlergicos';
import AntecedentesQuirurgicos from '@/components/historia-clinica/AntecedentesQuirurgicos';
import AntecedentesHemorragicos from '@/components/historia-clinica/AntecedentesHemorragicos';
import AntecedentesGinecoObstetricos from '@/components/historia-clinica/AntecedentesGinecoObstetricos';
import InterrogatorioSistemas from '@/components/historia-clinica/InterrogatorioSistemas';
import ExploracionFisica from '@/components/historia-clinica/ExploracionFisica';
import ExamenCabeza from '@/components/historia-clinica/ExamenCabeza';
import ArticulacionCraneomandibular from '@/components/historia-clinica/ArticulacionCraneomandibular';
import ExamenCuello from '@/components/historia-clinica/ExamenCuello';
import ExamenIntrabucal from '@/components/historia-clinica/ExamenIntrabucal';
import GlandulasSalivales from '@/components/historia-clinica/GlandulasSalivales';
import Oclusion from '@/components/historia-clinica/Oclusion';
import RelacionDientes from '@/components/historia-clinica/RelacionDientes';
import LineaMedia from '@/components/historia-clinica/LineaMedia';
import Frenillos from '@/components/historia-clinica/Frenillos';
import Diagnostico from '@/components/historia-clinica/Diagnostico';
import Pronostico from '@/components/historia-clinica/Pronostico';

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
    { id: 'padecimiento', nombre: 'I. Padecimiento Actual' },
    { id: 'heredofamiliares', nombre: 'II. Antecedentes Heredofamiliares' },
    { id: 'noPatologicos', nombre: 'III. Antecedentes No Patológicos' },
    { id: 'patologicos', nombre: 'IV. Antecedentes Patológicos' },
    { id: 'alergicos', nombre: 'V. Antecedentes Alérgicos' },
    { id: 'quirurgicos', nombre: 'VI. Antecedentes Quirúrgicos' },
    { id: 'hemorragicos', nombre: 'VII. Antecedentes Hemorrágicos' },
    { id: 'ginecoObstetricos', nombre: 'VIII. Antecedentes Gineco-obstétricos' },
    { id: 'interrogatorio', nombre: 'IX. Interrogatorio por Sistemas' },
    { id: 'exploracionFisica', nombre: 'X. Exploración Física' },
    { id: 'cabeza', nombre: 'XI. Examen de Cabeza' },
    { id: 'atm', nombre: 'XII. Articulación Craneomandibular' },
    { id: 'cuello', nombre: 'XIII. Examen de Cuello' },
    { id: 'intrabucal', nombre: 'XIV. Examen Intrabucal' },
    { id: 'salivales', nombre: 'XV. Glándulas Salivales' },
    { id: 'oclusion', nombre: 'XVI. Oclusión' },
    { id: 'relacionDientes', nombre: 'XVII. Relación de Dientes' },
    { id: 'lineaMedia', nombre: 'XVIII. Línea Media' },
    { id: 'frenillos', nombre: 'XIX. Frenillos' },
    { id: 'diagnostico', nombre: 'XX. Diagnóstico' },
    { id: 'pronostico', nombre: 'XXI. Pronóstico' },
  ];

  const [esMujer] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [direction, setDirection] = useState(0);
  const [viewMode, setViewMode] = useState<ViewMode>('form');
  const [isSectionExpanded, setIsSectionExpanded] = useState(true);

  // Filter sections based on gender
  const seccionesActivas = seccionesGenerables.filter(s => s.id !== 'ginecoObstetricos' || esMujer);
  const currentSectionInfo = seccionesActivas[currentStep];

  const [generations, setGenerations] = useState<Record<string, any>>({});
  /* Text State for Smile Panel */
  const [textGenerations, setTextGenerations] = useState<Record<string, string>>({});

  const {
    formData,
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
    handleDiagnosticoChange,
    handlePronosticoChange,
    toggleService,
  } = useHistoriaClinica();

  const handleContentGenerated = (seccionId: string, contenido: any, textoPlano?: string) => {
    setGenerations(prev => ({ ...prev, [seccionId]: contenido }));
    // If explicit text is provided, use it. Otherwise, if content is string, use that.
    const cleanText = textoPlano || (typeof contenido === 'string' ? contenido : '');
    if (cleanText) {
      setTextGenerations(prev => ({ ...prev, [seccionId]: cleanText }));
    }

    // Notify parent with the clean text version for "Smile Panel" mirroring
    if (onSeccionGenerada && cleanText) {
      onSeccionGenerada(seccionId, cleanText);
    } else if (onSeccionGenerada && typeof contenido === 'string') {
      onSeccionGenerada(seccionId, contenido);
    }
  };

  const handleGenerationComplete = () => {
    window.dispatchEvent(new Event('dentaxy-generation-complete'));
  };

  /* Logic needed for ProgressLine status */
  const getStepStatuses = () => {
    return seccionesActivas.map((seccion, index) => {
      // 1. If currently active -> 'active' (handled by component but good for logic)
      if (index === currentStep) return 'active';

      // 2. Check if generated content exists
      if (generations[seccion.id]) return 'completed';

      // 3. Fallback: Check heuristics for specific complex forms (Example)
      // Note: This is a simplified heuristic. Ideally we check deep formData.
      if (seccion.id === 'padecimiento') {
        if (formData.padecimientoActual.motivoConsulta &&
          formData.padecimientoActual.motivoConsulta.length > 30) return 'completed';
      }

      // 4. If index is less than current but not completed -> 'skipped'
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
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setDirection(-1);
      setCurrentStep(prev => prev - 1);
      setViewMode('form');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const renderCurrentStepContent = () => {
    const section = seccionesActivas[currentStep];
    const commonProps = { onRedaccionGenerada: (text: string) => handleContentGenerated(section.id, text) };
    // NOTE: Some legacy components might not accept onRedaccionGenerada or might name it differently.
    // PadecimientoActual does. Others might need adaptation. 
    // To avoid further TS errors, I'm passing what I can.

    switch (section.id) {
      case 'padecimiento':
        return <PadecimientoActual
          formData={formData}
          handlePadecimientoChange={handlePadecimientoChange}
          handleDolorChange={handleDolorChange}
          handleSinSintomasChange={handleSinSintomasChange}
          onToggleViewMode={() => setViewMode(prev => prev === 'form' ? 'redaction' : 'form')}
          {...commonProps}
        />;
      case 'heredofamiliares':
        return <AntecedentesHeredoFamiliares
          formData={formData}
          handleFamiliarChange={handleFamiliarChange}
          handleCondicionChange={handleCondicionChange}
          onToggleViewMode={() => setViewMode(prev => prev === 'form' ? 'redaction' : 'form')}
          {...commonProps}
        />;
      case 'noPatologicos':
        return <AntecedentesPersonalesNoPatologicos
          formData={formData}
          handleAntecedenteNoPatologicoChange={handleAntecedenteChange}
          toggleService={toggleService}
          onToggleViewMode={() => {
            setViewMode(prev => prev === 'form' ? 'redaction' : 'form');
            scrollContainerRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          {...commonProps}
        />;
      case 'patologicos':
        return <AntecedentesPersonalesPatologicos
          formData={formData}
          handleAntecedentePatologicoChange={handleAntecedentePatologicoChange}
          onToggleViewMode={() => setViewMode(prev => prev === 'form' ? 'redaction' : 'form')}
          {...commonProps}
        />;
      case 'alergicos':
        return <AntecedentesAlergicos
          formData={formData}
          handleAntecedenteAlergicoChange={handleAntecedenteAlergicoChange}
        />;
      case 'quirurgicos':
        return <AntecedentesQuirurgicos
          formData={formData}
          handleAntecedenteQuirurgicoChange={handleAntecedenteQuirurgicoChange}
        />;
      case 'hemorragicos':
        return <AntecedentesHemorragicos
          formData={formData}
          handleAntecedenteHemorragicoChange={handleAntecedenteHemorragicoChange}
        />;
      case 'ginecoObstetricos':
        return <AntecedentesGinecoObstetricos
          formData={formData}
          handleAntecedenteGinecoObstetricoChange={handleAntecedenteGinecoObstetricoChange}
        />;
      case 'interrogatorio':
        return <InterrogatorioSistemas
          formData={formData}
          handleInterrogatorioChange={handleInterrogatorioChange}
        />;
      case 'exploracionFisica':
        return <ExploracionFisica
          formData={formData}
          handleExploracionFisicaChange={handleExploracionFisicaChange}
        />;
      case 'cabeza':
        return <ExamenCabeza
          formData={formData}
          handleExamenCabezaChange={handleExamenCabezaChange}
        />;
      case 'atm':
        return <ArticulacionCraneomandibular
          formData={formData}
          handleArticulacionCraneomandibularChange={handleArticulacionCraneomandibularChange}
        />;
      case 'cuello':
        return <ExamenCuello
          formData={formData}
          handleExamenCuelloChange={handleExamenCuelloChange}
        />;
      case 'intrabucal':
        return <ExamenIntrabucal
          formData={formData}
          handleExamenIntrabucalChange={handleExamenIntrabucalChange}
        />;
      case 'salivales':
        return <GlandulasSalivales
          formData={formData}
          handleGlandulasSalivalesChange={handleGlandulasSalivalesChange}
        />;
      case 'oclusion':
        return <Oclusion
          formData={formData}
          handleOclusionChange={handleOclusionChange}
        />;
      case 'relacionDientes':
        return <RelacionDientes
          formData={formData}
          handleRelacionDientesChange={handleRelacionDientesChange}
        />;
      case 'lineaMedia':
        return <LineaMedia
          formData={formData}
          handleLineaMediaChange={handleLineaMediaChange}
        />;
      case 'frenillos':
        return <Frenillos
          formData={formData}
          handleFrenillosChange={handleFrenillosChange}
        />;
      case 'diagnostico':
        return <Diagnostico
          formData={formData}
          handleDiagnosticoChange={handleDiagnosticoChange}
        />;
      case 'pronostico':
        return <Pronostico
          formData={formData}
          handlePronosticoChange={handlePronosticoChange}
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

    // 1. SPECIAL HANDLE: Padecimiento Actual (Direct Generation)
    // We bypass the DOM button to ensure reliability as requested by the user ("sigue sin verse").
    // 1. SPECIAL HANDLE: Removed. Padecimiento now uses the generic DOM button click 
    // to ensure consistency with the local button's logic (Animation + Clean Text).
    // if (currentSectionId === 'padecimiento') { ... }

    // 2. GENERIC HANDLE: DOM Clicker for other sections (e.g. Heredofamiliares)
    const sectionContainer = document.querySelector(`div[data-section="${currentSectionId}"]`);

    if (sectionContainer) {
      // Search for the local generate button by text content
      const buttons = Array.from(sectionContainer.querySelectorAll('button'));
      const generateButton = buttons.find(btn => {
        const text = btn.textContent?.toLowerCase() || '';
        return text.includes('generar redacción') || text.includes('redactar') || text.includes('generar') || text.includes('ver redacción');
      });

      if (generateButton) {
        (generateButton as HTMLButtonElement).click();
      } else {
        console.warn('Dock: No local generate button found for ' + currentSectionId);
      }
    }
  };

  return (
    <div className="h-full w-full bg-white dark:bg-zinc-950 flex flex-col relative overflow-hidden">

      {/* 1. Global Navigation: Progress Line (Sticky Top) */}
      <div className="w-full sticky top-0 z-50 bg-white dark:bg-zinc-950 transition-all">
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
        className="flex-1 overflow-y-auto overflow-x-hidden pb-40 scroll-smooth custom-scrollbar"
      >
        <div className="container mx-auto px-4 py-4">
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
        nextLabel={seccionesActivas[currentStep + 1]?.nombre.split('. ')[1] || 'Finalizar'}
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
            className="bg-white/90 dark:bg-zinc-900/90 backdrop-blur border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 px-4 py-2 rounded-xl flex items-center gap-3 shadow-lg"
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
  );
}

export default DentaxyFormPanel;
