import React, { useState, useRef, useCallback, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2 } from 'lucide-react';

// Types
import { FormDataState } from '@/types/historiaClinica';

// Hooks
import { useGenerarTodasRedacciones } from '@/hooks/useGenerarTodasRedacciones';
import { useHistoriaClinica } from '@/hooks/useHistoriaClinica';

// UI Components
import { ProgressLine, StepStatus } from '@/components/academico/ui/ProgressLine';
import { CommandDock } from '@/components/academico/ui/CommandDock';
import { SectionCard, ViewMode } from '@/components/academico/ui/SectionCard';

// Section Components
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

/**
 * AIDemoFormPanel
 * 
 * A clean, robust, and optimized version of the clinical form panel specifically for the AI Demo.
 * Removed all external dependencies related to "Smile" or legacy callbacks.
 * Focused on instant rendering and smooth scrolling.
 */
export const AIDemoFormPanel: React.FC = () => {

    // --- 1. Static Data (Memoized) ---
    const seccionesGenerables = useMemo(() => [
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
    ], []);

    // --- 2. State ---
    const [currentStep, setCurrentStep] = useState(0);
    const [direction, setDirection] = useState(0);
    const [viewMode, setViewMode] = useState<ViewMode>('form');
    const [isSectionExpanded, setIsSectionExpanded] = useState(true);
    const [generations, setGenerations] = useState<Record<string, any>>({});

    // Scroll Detection with throttling/debounce is optional but CSS sticky is usually fine.
    // We use this for visual changes in the ProgressLine.
    const [isScrolled, setIsScrolled] = useState(false);
    const scrollContainerRef = useRef<HTMLDivElement>(null);

    // --- 3. Hooks ---
    // Core Form Logic Hook
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

    // Derived State: Active Sections (currently static, but ready for gender logic)
    const seccionesActivas = useMemo(() =>
        seccionesGenerables.filter(s => s.id !== 'ginecoObstetricos' || false /* TODO: Gender Logic if needed */),
        [seccionesGenerables]
    );

    const currentSectionInfo = seccionesActivas[currentStep];

    // --- 4. Callbacks ---

    const handleContentGenerated = useCallback((seccionId: string, contenido: any) => {
        setGenerations(prev => ({ ...prev, [seccionId]: contenido }));
    }, []);

    const handleGenerationComplete = useCallback(() => {
        // Optional: Global notification if needed
    }, []);

    const onSectionActive = useCallback((sectionId: string) => {
        const index = seccionesActivas.findIndex(s => s.id === sectionId);
        if (index !== -1 && index !== currentStep) {
            setDirection(index > currentStep ? 1 : -1);
            setCurrentStep(index);
            setViewMode('form');
        }
    }, [seccionesActivas, currentStep]);

    // AI Generation Hook
    const { isGenerating, progress } = useGenerarTodasRedacciones(
        seccionesActivas,
        handleGenerationComplete,
        onSectionActive
    );

    // --- 5. Navigation Handlers (Stable) ---

    const handleStepClick = useCallback((index: number) => {
        setDirection(index > currentStep ? 1 : -1);
        setCurrentStep(index);
        setViewMode('form');
    }, [currentStep]);

    const handleNext = useCallback(() => {
        if (currentStep < seccionesActivas.length - 1) {
            setDirection(1);
            setCurrentStep(prev => prev + 1);
            setViewMode('form');
            scrollContainerRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
        }
    }, [currentStep, seccionesActivas.length]);

    const handlePrev = useCallback(() => {
        if (currentStep > 0) {
            setDirection(-1);
            setCurrentStep(prev => prev - 1);
            setViewMode('form');
            scrollContainerRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
        }
    }, [currentStep]);

    // Trigger Local Generation Logic
    const handleGenerateCurrent = useCallback(async () => {
        const currentSectionId = seccionesActivas[currentStep].id;
        // Query the DOM for the local button to ensure consistent behavior with the inner component
        const sectionContainer = document.querySelector(`div[data-section="${currentSectionId}"]`);
        if (sectionContainer) {
            const buttons = Array.from(sectionContainer.querySelectorAll('button'));
            const generateButton = buttons.find(btn => {
                const text = btn.textContent?.toLowerCase() || '';
                return text.includes('generar redacción') || text.includes('redactar') || text.includes('generar') || text.includes('ver redacción');
            });
            if (generateButton) {
                (generateButton as HTMLButtonElement).click();
            }
        }
    }, [currentStep, seccionesActivas]);

    // --- 6. Step Status Logic (Optimized) ---
    // We use a ref to prevent re-calculating the array reference on every render unless content changes
    const lastStepStatusesRef = useRef<StepStatus[]>([]);

    const getStepStatuses = useCallback(() => {
        return seccionesActivas.map((seccion, index) => {
            if (index === currentStep) return 'active';
            if (generations[seccion.id]) return 'completed';
            // Simple Heuristic for 'completed' based on form data could go here
            // For now, rely on explicit generation or 'skipped'
            if (index < currentStep) return 'skipped';
            return 'pending';
        });
    }, [seccionesActivas, currentStep, generations]);

    const stepStatuses = useMemo(() => {
        const newStatuses = getStepStatuses();
        // Simple deep compare to avoid ref churn
        if (JSON.stringify(newStatuses) !== JSON.stringify(lastStepStatusesRef.current)) {
            lastStepStatusesRef.current = newStatuses;
            return newStatuses;
        }
        return lastStepStatusesRef.current;
    }, [getStepStatuses]);

    // --- 7. Scroll Handling (Instant & Fluid) ---
    const handleScroll = useCallback(() => {
        if (!scrollContainerRef.current) return;

        // Direct state update for instant response - no RAF delay
        const scrolled = scrollContainerRef.current.scrollTop > 20;
        setIsScrolled(scrolled);
    }, []); // No dependencies - always get fresh scrollTop value


    // --- 8. Content Renderer (Memoized Result) ---
    // We wrap the *call* in useMemo so the Component Element itself is stable across re-renders
    // of the parent (AIDemoFormPanel) unless dependencies change.
    const activeSectionContent = useMemo(() => {
        const section = seccionesActivas[currentStep];
        const commonProps = {
            onRedaccionGenerada: (text: string) => handleContentGenerated(section.id, text)
        };

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
                    onToggleViewMode={() => setViewMode(prev => prev === 'form' ? 'redaction' : 'form')}
                    {...commonProps}
                />;
            case 'quirurgicos':
                return <AntecedentesQuirurgicos
                    formData={formData}
                    handleAntecedenteQuirurgicoChange={handleAntecedenteQuirurgicoChange}
                    onToggleViewMode={() => setViewMode(prev => prev === 'form' ? 'redaction' : 'form')}
                    {...commonProps}
                />;
            case 'hemorragicos':
                return <AntecedentesHemorragicos
                    formData={formData}
                    handleAntecedenteHemorragicoChange={handleAntecedenteHemorragicoChange}
                    onToggleViewMode={() => setViewMode(prev => prev === 'form' ? 'redaction' : 'form')}
                    {...commonProps}
                />;
            case 'ginecoObstetricos':
                return <AntecedentesGinecoObstetricos
                    formData={formData}
                    handleAntecedenteGinecoObstetricoChange={handleAntecedenteGinecoObstetricoChange}
                    onToggleViewMode={() => setViewMode(prev => prev === 'form' ? 'redaction' : 'form')}
                    {...commonProps}
                />;
            case 'interrogatorio':
                return <InterrogatorioSistemas
                    formData={formData}
                    handleInterrogatorioChange={handleInterrogatorioChange}
                    onToggleViewMode={() => setViewMode(prev => prev === 'form' ? 'redaction' : 'form')}
                    {...commonProps}
                />;
            case 'exploracionFisica':
                return <ExploracionFisica
                    formData={formData}
                    handleExploracionFisicaChange={handleExploracionFisicaChange}
                    onToggleViewMode={() => setViewMode(prev => prev === 'form' ? 'redaction' : 'form')}
                    {...commonProps}
                />;
            case 'cabeza':
                return <ExamenCabeza
                    formData={formData}
                    handleExamenCabezaChange={handleExamenCabezaChange}
                    onToggleViewMode={() => setViewMode(prev => prev === 'form' ? 'redaction' : 'form')}
                    {...commonProps}
                />;
            case 'atm':
                return <ArticulacionCraneomandibular
                    formData={formData}
                    handleArticulacionCraneomandibularChange={handleArticulacionCraneomandibularChange}
                    onToggleViewMode={() => setViewMode(prev => prev === 'form' ? 'redaction' : 'form')}
                    {...commonProps}
                />;
            case 'cuello':
                return <ExamenCuello
                    formData={formData}
                    handleExamenCuelloChange={handleExamenCuelloChange}
                    onToggleViewMode={() => setViewMode(prev => prev === 'form' ? 'redaction' : 'form')}
                    {...commonProps}
                />;
            case 'intrabucal':
                return <ExamenIntrabucal
                    formData={formData}
                    handleExamenIntrabucalChange={handleExamenIntrabucalChange}
                    onToggleViewMode={() => setViewMode(prev => prev === 'form' ? 'redaction' : 'form')}
                    {...commonProps}
                />;
            case 'salivales':
                return <GlandulasSalivales
                    formData={formData}
                    handleGlandulasSalivalesChange={handleGlandulasSalivalesChange}
                    onToggleViewMode={() => setViewMode(prev => prev === 'form' ? 'redaction' : 'form')}
                    {...commonProps}
                />;
            case 'oclusion':
                return <Oclusion
                    formData={formData}
                    handleOclusionChange={handleOclusionChange}
                    onToggleViewMode={() => setViewMode(prev => prev === 'form' ? 'redaction' : 'form')}
                    {...commonProps}
                />;
            case 'relacionDientes':
                return <RelacionDientes
                    formData={formData}
                    handleRelacionDientesChange={handleRelacionDientesChange}
                    onToggleViewMode={() => setViewMode(prev => prev === 'form' ? 'redaction' : 'form')}
                    {...commonProps}
                />;
            case 'lineaMedia':
                return <LineaMedia
                    formData={formData}
                    handleLineaMediaChange={handleLineaMediaChange}
                    onToggleViewMode={() => setViewMode(prev => prev === 'form' ? 'redaction' : 'form')}
                    {...commonProps}
                />;
            case 'frenillos':
                return <Frenillos
                    formData={formData}
                    handleFrenillosChange={handleFrenillosChange}
                    onToggleViewMode={() => setViewMode(prev => prev === 'form' ? 'redaction' : 'form')}
                    {...commonProps}
                />;
            case 'diagnostico':
                return <Diagnostico
                    formData={formData}
                    handleDiagnosticoChange={handleDiagnosticoChange}
                    onToggleViewMode={() => setViewMode(prev => prev === 'form' ? 'redaction' : 'form')}
                    {...commonProps}
                />;
            case 'pronostico':
                return <Pronostico
                    formData={formData}
                    handlePronosticoChange={handlePronosticoChange}
                    onToggleViewMode={() => setViewMode(prev => prev === 'form' ? 'redaction' : 'form')}
                    {...commonProps}
                />;
            default:
                return null;
        }
    }, [
        currentStep, seccionesActivas, formData, viewMode, toggleService,
        handlePadecimientoChange, handleDolorChange, handleSinSintomasChange,
        handleFamiliarChange, handleCondicionChange, handleAntecedenteChange,
        handleAntecedentePatologicoChange, handleAntecedenteAlergicoChange,
        handleAntecedenteQuirurgicoChange, handleAntecedenteHemorragicoChange,
        handleAntecedenteGinecoObstetricoChange, handleInterrogatorioChange,
        handleExploracionFisicaChange, handleExamenCabezaChange,
        handleArticulacionCraneomandibularChange, handleExamenCuelloChange,
        handleExamenIntrabucalChange, handleGlandulasSalivalesChange,
        handleOclusionChange, handleRelacionDientesChange,
        handleLineaMediaChange, handleFrenillosChange,
        handleDiagnosticoChange, handlePronosticoChange,
        handleContentGenerated // Stable callback
    ]);

    // Animation Variants
    const variants = {
        enter: (direction: number) => ({ x: direction > 0 ? 50 : -50, opacity: 0 }),
        center: { zIndex: 1, x: 0, opacity: 1 },
        exit: (direction: number) => ({ zIndex: 0, x: direction < 0 ? 50 : -50, opacity: 0 })
    };

    return (
        <div className="h-full w-full flex-1 bg-white dark:bg-zinc-950 flex flex-col relative overflow-hidden">

            {/* 1. Global Navigation: Progress Line (Sticky Top) */}
            <div className="w-full sticky top-0 z-[90] bg-white dark:bg-zinc-950 transition-all will-change-[height]">
                <ProgressLine
                    totalSteps={seccionesActivas.length}
                    currentStep={currentStep}
                    isGenerating={isGenerating}
                    stepNames={seccionesActivas.map(s => s.nombre)}
                    onStepClick={handleStepClick}
                    stepStatuses={stepStatuses}
                    isScrolled={isScrolled}
                />
            </div>

            {/* 2. Main Scrollable Area */}
            <div
                ref={scrollContainerRef}
                onScroll={handleScroll}
                className="flex-1 overflow-y-auto overflow-x-hidden pb-40 scroll-smooth custom-scrollbar will-change-[scroll-position]"
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
                                    {activeSectionContent}
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

            {/* 4. Automation Status Overlay */}
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
};

export default AIDemoFormPanel;
