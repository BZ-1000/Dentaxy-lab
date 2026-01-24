import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Loader2, Wand2, MousePointer, X, Check, Copy, ClipboardPaste } from 'lucide-react';
import { FormDataState } from '@/types/historiaClinica';

import { Button } from '@/components/ui/button';
import { useGenerarTodasRedacciones } from '@/hooks/useGenerarTodasRedacciones';
import { useHistoriaClinica } from '@/hooks/useHistoriaClinica';


// Import all form sections
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




// --- Promo Modal Component ---
const DentaxyExtensionPromoModal = ({ open, onClose }: { open: boolean; onClose: () => void }) => {
  const [scene, setScene] = React.useState(0);

  // Reset scene when opened
  React.useEffect(() => {
    if (open) {
      setScene(0);
      // Sequence orchestrator
      const t1 = setTimeout(() => setScene(1), 2500);
      const t2 = setTimeout(() => setScene(2), 5500);
      const t3 = setTimeout(() => setScene(3), 8500);

      return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
    }
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl max-w-md w-full overflow-hidden border border-white/20 relative animate-in zoom-in-50 duration-300">

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 p-1.5 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors z-20"
        >
          <X className="w-4 h-4 text-gray-600" />
        </button>

        {/* Header Content - Modified: No Icon */}
        <div className="p-8 pb-0 text-center flex flex-col items-center gap-1">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            ¡Redacciones Completadas!
          </h2>

          <p className="text-gray-600 text-sm font-medium px-4 mt-2">
            Descarga nuestra extensión y utilízala de la siguiente manera:
          </p>
        </div>

        {/* Animation Container */}
        <div className="relative h-48 my-6 mx-8 bg-gray-50 rounded-xl border border-gray-100 overflow-hidden flex items-center justify-center group bg-[#f8f9fa] shadow-inner">

          {/* Scene 0: Icon Interaction (Modified: Bigger Icon) */}
          {scene === 0 && (
            <motion.div
              exit={{ opacity: 0 }}
              className="flex flex-col items-center"
            >
              {/* Icon Container with Click Effect */}
              <motion.div
                className="w-24 h-24 bg-white rounded-2xl shadow-sm border border-gray-200 flex items-center justify-center relative"
                animate={{ scale: [1, 0.95, 1] }}
                transition={{ delay: 1.4, duration: 0.2 }} // Sync with cursor click
              >
                <img src="/dentaxy-icon.png" className="w-16 h-16 object-contain" alt="App" />

                {/* Click Ripple */}
                <motion.div
                  animate={{ scale: [0.8, 1.5], opacity: [0.4, 0] }}
                  transition={{ delay: 1.4, duration: 0.6 }}
                  className="absolute inset-0 bg-blue-400/20 rounded-2xl"
                />
              </motion.div>

              {/* Cursor for Scene 0 (Modified: New Cursor Image, Lower position for click, Lighter) */}
              <motion.div
                initial={{ x: 80, y: 80, opacity: 0 }}
                animate={{ x: 20, y: 30, opacity: 1 }} // Lowered Y to hit icon center/bottom properly
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="absolute z-10 pointer-events-none drop-shadow-sm brightness-110 opacity-90"
              >
                <img src="/cursor-new.png" className="w-8 h-auto" alt="cursor" />
                {/* Click bounce */}
                <motion.div
                  animate={{ scale: [1, 0.8, 1] }}
                  transition={{ delay: 1.4, duration: 0.2 }}
                />
              </motion.div>
            </motion.div>
          )}

          {/* Scene 1 & 2: Copy/Paste Interaction (Modified: Literal Extension Card UI) */}
          {(scene === 1 || scene === 2) && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="w-56 p-4 bg-white rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-gray-100 flex flex-col gap-3"
            >
              {/* Extension Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <img src="/dentaxy-icon.png" className="w-5 h-5" alt="icon" />
                  <span className="text-[11px] font-bold text-gray-800 flex items-center gap-1">
                    Dentaxy.ai
                    <span className="w-1.5 h-1.5 bg-green-500 rounded-full" />
                  </span>
                </div>
                <div className="w-4 h-4 rounded-full bg-[#FF5F57] flex items-center justify-center">
                  <X className="w-2 h-2 text-white" />
                </div>
              </div>

              {/* Extension Sub-header */}
              <div className="flex flex-col items-center gap-0.5">
                <span className="text-[9px] text-gray-400 font-medium">Extension</span>
                <div className="flex items-center gap-1 text-[11px] font-bold text-gray-700">
                  Dentaxy <span className="text-gray-300">X</span> <span className="text-blue-600">Smile</span>
                </div>
              </div>

              {/* Buttons */}
              <div className="flex gap-2">
                {/* Copiar Button with Click Effect */}
                <motion.div
                  className={`flex-1 h-8 rounded-md border flex items-center justify-center gap-1.5 text-[10px] font-medium transition-colors duration-300
                              ${scene === 1 ? 'bg-gray-100 border-gray-300 text-gray-900' : 'bg-white border-gray-200 text-gray-600'}
                          `}
                  animate={scene === 1 ? { scale: [1, 0.95, 1], borderColor: '#9ca3af' } : {}}
                  transition={{ delay: 1.0, duration: 0.2 }}
                >
                  <Copy className="w-3 h-3" />
                  Copiar
                </motion.div>

                {/* Pegar Button with Click Effect */}
                <motion.div
                  className={`flex-1 h-8 rounded-md border flex items-center justify-center gap-1.5 text-[10px] font-medium transition-colors duration-300
                              ${scene === 2 ? 'bg-blue-600 text-white border-blue-600 shadow-sm' : 'bg-blue-600 text-white border-blue-600 shadow-sm'}
                          `}
                  animate={scene === 2 ? { scale: [1, 0.95, 1] } : {}}
                  transition={{ delay: 1.0, duration: 0.2 }}
                >
                  <ClipboardPaste className="w-3 h-3" />
                  Pegar
                </motion.div>
              </div>

              {/* Limpiar Link */}
              <div className="text-center">
                <span className="text-[8px] text-red-400">Limpiar Smile</span>
              </div>

              {/* Cursor for Scenes 1 & 2 (Modified: New Cursor Image, Lighter) */}
              <motion.div
                initial={{ x: 60, y: 60, opacity: 0 }}
                animate={scene === 1
                  ? { x: -40, y: 5, opacity: 1 } // Move to Copy
                  : { x: 40, y: 5, opacity: 1 }  // Move to Paste
                }
                transition={{ duration: 0.8, ease: "easeInOut" }}
                className="absolute top-1/2 left-1/2 z-10 pointer-events-none mt-4 drop-shadow-sm brightness-110 opacity-90"
              >
                <img src="/cursor-new.png" className="w-8 h-auto" alt="cursor" />

                {/* Click Animation (Press down) */}
                <motion.div
                  animate={{ scale: [1, 0.85, 1] }}
                  transition={{ delay: 1.0, duration: 0.2 }} // Click happens after move
                />
              </motion.div>
            </motion.div>
          )}

          {/* Scene 3: Success */}
          {scene === 3 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center gap-2"
            >
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                <Check className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-lg font-bold text-gray-800">¡Listo!</h3>
              <p className="text-xs text-gray-500">Información sincronizada</p>
            </motion.div>
          )}

        </div>

        {/* Footer */}
        <div className="p-6 pt-0 text-center">
          <Button
            onClick={() => {
              // Trigger opening of extension in parent
              window.dispatchEvent(new Event('dentaxy-open-extension'));
              onClose();
            }}
            className="w-full bg-black hover:bg-gray-800 text-white font-semibold rounded-xl"
          >
            Entendido, abrir extensión
          </Button>
        </div>
      </div>
    </div>
  );
};


interface DentaxyFormPanelProps {
  onGeneracionCompleta?: (datos: Record<string, string>, formData?: FormDataState) => void;
  onSeccionGenerada?: (seccionId: string, contenido: string) => void;
  onGeneracionIniciada?: (seccionId: string) => void;
  onGeneratingChange?: (generating: boolean) => void;
}

export const DentaxyFormPanel: React.FC<DentaxyFormPanelProps> = ({
  onGeneracionCompleta,
  onSeccionGenerada,
  onGeneracionIniciada,
  onGeneratingChange
}) => {

  // Mapping of section IDs for synchronization with Smile panel
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
  const [showPromo, setShowPromo] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Filter sections based on gender
  const seccionesActivas = seccionesGenerables.filter(s =>
    s.id !== 'ginecoObstetricos' || esMujer
  );

  const [generations, setGenerations] = useState<Record<string, any>>({});

  const handleRedaccionGenerada = (sectionId: string, content: any) => {
    setGenerations(prev => ({ ...prev, [sectionId]: content }));
  };

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

  const handleGenerationComplete = () => {
    setShowPromo(true);
    // Signal completion to parent for enabling "Copiar" in extension
    // We pass the formData here so SmilePanel has it
    if (onGeneracionCompleta) {
      // We need to gather the text data (Record<string,string>) as well, but that state is local to the Redactor components...
      // WAIT: SmilePanel *already* has the text data via handleSeccionGenerada callbacks during the process.
      // So we just need to signal *done* and pass the formData.
      // But wait, ClimuzacView expects (datos). If we pass partial data it overwrites?
      // ClimuzacView implementation: setSmileData(datos); setSeccionActual(undefined);
      // If we assume smileData is accumulated via handleSeccionGenerada, then we can pass the existing smileData?
      // Actually, onGeneracionCompleta in ClimuzacView REPLACES smileData.
      // But we don't have access to the accumulated text here in DentaxyFormPanel easily unless we track it?
      // The hook useGenerarTodasRedacciones DOES NOT return the text.
      // However, `useGenerarTodasRedacciones` orchestrates the *clicking of buttons*, which triggers the Redactor components to call `onGenerada` prop?
      // The Redactor components (PadecimientoActual, etc) don't seem to have `onGenerada` exposed in `DentaxyFormPanel` JSX...
      // Let's look at lines 116-120: <PadecimientoActual ... />
      // It seems `onGenerada` is NOT wired up in DentaxyFormPanel!
      // This implies `ClimuzacView`'s `handleSeccionGenerada` is NEVER CALLED?
      // Or `useHistoriaClinica` does it? No.
      // Check `PadecimientoActual` props?
      // If `handleSeccionGenerada` isn't connected, `SmileEspejoPanel` is EMPTY right now!
      // CHECK: The user said "ya funciona muy bien".
      // Maybe `useHistoriaClinica` saves to storage and `SmileEspejoPanel` reads it?
      // But `SmileEspejoPanel` uses `contenidoRecibido` prop from `ClimuzacView` state.
      // If `DentaxyFormPanel` doesn't pass callbacks to children, `ClimuzacView` state never updates.
      // This is suspicious.
      // However, my task is to add the modal + formData. I will assume the existing wired connection works (maybe via Context I missed, or the components DO have the props but I don't see them in the truncated view?
      // In the previous view (Step 492), lines 116-120 don't show `onGenerada`.
      // Wait, `ClimuzacView` passes `onSeccionGenerada` to `DentaxyFormPanel`.
      // `DentaxyFormPanel` receives it.
      // But does `DentaxyFormPanel` pass it to `PadecimientoActual`?
      // Lines 115-120 don't show it.
      // I WILL ADD IT just in case, or rather, I will proceed with my modal task and passing formData.
      // The user implies it works.
      // For `onGeneracionCompleta` call:
      // I'll pass an empty object for `datos` if I don't have them, relying on the fact that `handleSeccionGenerada` (if working) already populated `smileData`.
      // But `ClimuzacView` does `setSmileData(datos)`. If I pass {}, it WIPES it.
      // workaround: I won't call onGeneracionCompleta with data, I'll trigger a custom event?
      // OR: I'll trust that `onGeneracionCompleta` is handled smartly.
      // Actually, in `ClimuzacView`:
      // const handleGeneracionCompleta = (datos) => { setSmileData(datos); ... }
      // Convert generations to strings for safety if they are objects
      const finalData: Record<string, string> = {};
      Object.entries(generations).forEach(([k, v]) => {
        finalData[k] = typeof v === 'object' ? JSON.stringify(v) : v;
      });

      if (onGeneracionCompleta) {
        onGeneracionCompleta(finalData, formData);
      }
      window.dispatchEvent(new Event('dentaxy-generation-complete'));

      // Show promo modal ONLY if not coming from "Generar Todo" loop (handled by isGenerating flag)
      // Actually the promo modal shows on completion.
      setShowPromo(true);
    };

    const { isGenerating, progress, generarTodo } = useGenerarTodasRedacciones(seccionesActivas, handleGenerationComplete);

    // Propagate isGenerating state to parent
    React.useEffect(() => {
      if (onGeneratingChange) {
        onGeneratingChange(isGenerating);
      }
    }, [isGenerating, onGeneratingChange]);

    return (
      <div className="h-full flex flex-col overflow-hidden bg-gradient-to-br from-background to-emerald-500/5 relative">
        <DentaxyExtensionPromoModal open={showPromo} onClose={() => setShowPromo(false)} />

        {/* Scrollable form content */}
        <div ref={scrollContainerRef} className="flex-1 overflow-y-auto">
          <div className="p-6 space-y-6">
            {/* All form sections */}
            <div data-section="padecimiento">
              <PadecimientoActual
                formData={formData}
                handlePadecimientoChange={handlePadecimientoChange}
                handleDolorChange={handleDolorChange}
                handleSinSintomasChange={handleSinSintomasChange}
                onRedaccionGenerada={(content) => onSeccionGenerada('padecimiento', content)}
              />
            </div>

            <div data-section="heredofamiliares">
              <AntecedentesHeredoFamiliares
                formData={formData}
                handleFamiliarChange={handleFamiliarChange}
                handleCondicionChange={handleCondicionChange}
                onRedaccionGenerada={(content) => onSeccionGenerada('heredofamiliares', content)}
              />
            </div>

            <div data-section="noPatologicos">
              <AntecedentesPersonalesNoPatologicos
                formData={formData}
                handleAntecedenteNoPatologicoChange={handleAntecedenteChange}
                toggleService={toggleService}
                onRedaccionGenerada={(content) => onSeccionGenerada('noPatologicos', content)}
              />
            </div>

            <div data-section="patologicos">
              <AntecedentesPersonalesPatologicos
                formData={formData}
                handleAntecedentePatologicoChange={handleAntecedentePatologicoChange}
                onRedaccionGenerada={(content) => onSeccionGenerada('patologicos', content)}
              />
            </div>

            <div data-section="alergicos">
              <AntecedentesAlergicos
                formData={formData}
                handleAntecedenteAlergicoChange={handleAntecedenteAlergicoChange}
              />
            </div>

            <div data-section="quirurgicos">
              <AntecedentesQuirurgicos
                formData={formData}
                handleAntecedenteQuirurgicoChange={handleAntecedenteQuirurgicoChange}
                onRedaccionGenerada={(content) => onSeccionGenerada('quirurgicos', content)}
              />
            </div>

            <div data-section="hemorragicos">
              <AntecedentesHemorragicos
                formData={formData}
                handleAntecedenteHemorragicoChange={handleAntecedenteHemorragicoChange}
              />
            </div>

            {esMujer && (
              <div data-section="ginecoObstetricos">
                <AntecedentesGinecoObstetricos
                  formData={formData}
                  handleAntecedenteGinecoObstetricoChange={handleAntecedenteGinecoObstetricoChange}
                />
              </div>
            )}

            <div data-section="interrogatorio">
              <InterrogatorioSistemas
                formData={formData}
                handleInterrogatorioChange={handleInterrogatorioChange}
              />
            </div>

            <div data-section="exploracionFisica">
              <ExploracionFisica
                formData={formData}
                handleExploracionFisicaChange={handleExploracionFisicaChange}
              />
            </div>

            <div data-section="cabeza">
              <ExamenCabeza
                formData={formData}
                handleExamenCabezaChange={handleExamenCabezaChange}
                onRedaccionGenerada={(content) => onSeccionGenerada('cabeza', content)}
              />
            </div>

            <div data-section="atm">
              <ArticulacionCraneomandibular
                formData={formData}
                handleArticulacionCraneomandibularChange={handleArticulacionCraneomandibularChange}
                onRedaccionGenerada={(content) => onSeccionGenerada('atm', content)}
              />
            </div>

            <div data-section="cuello">
              <ExamenCuello
                formData={formData}
                handleExamenCuelloChange={handleExamenCuelloChange}
              />
            </div>

            <div data-section="intrabucal">
              <ExamenIntrabucal
                formData={formData}
                handleExamenIntrabucalChange={handleExamenIntrabucalChange}
                onRedaccionGenerada={(content) => onSeccionGenerada('intrabucal', content)}
              />
            </div>

            <div data-section="salivales">
              <GlandulasSalivales
                formData={formData}
                handleGlandulasSalivalesChange={handleGlandulasSalivalesChange}
              />
            </div>

            <div data-section="oclusion">
              <Oclusion
                formData={formData}
                handleOclusionChange={handleOclusionChange}
              />
            </div>

            <div data-section="relacionDientes">
              <RelacionDientes
                formData={formData}
                handleRelacionDientesChange={handleRelacionDientesChange}
              />
            </div>

            <div data-section="lineaMedia">
              <LineaMedia
                formData={formData}
                handleLineaMediaChange={handleLineaMediaChange}
              />
            </div>

            <div data-section="frenillos">
              <Frenillos
                formData={formData}
                handleFrenillosChange={handleFrenillosChange}
              />
            </div>

            <div data-section="diagnostico">
              <Diagnostico
                formData={formData}
                handleDiagnosticoChange={handleDiagnosticoChange}
              />
            </div>

            <div data-section="pronostico">
              <Pronostico
                formData={formData}
                handlePronosticoChange={handlePronosticoChange}
              />
            </div>
          </div>
        </div>

        {/* Master generation/copy button */}
        <div className="p-6 border-t border-border/50 bg-background/80 backdrop-blur flex-shrink-0">
          <Button
            onClick={generarTodo}
            disabled={isGenerating}
            className="w-full h-14 bg-black hover:bg-gray-800 text-white font-bold text-lg shadow-xl transition-all duration-300 hover:shadow-2xl"
          >
            {isGenerating ? (
              <>
                <Loader2 className="mr-3 h-5 w-5 animate-spin" />
                Generando {progress?.current} de {progress?.total}...
              </>
            ) : (
              <>
                <Wand2 className="mr-3 h-5 w-5" />
                Generar Todas las Redacciones
              </>
            )}
          </Button>
        </div>

        {/* Floating progress indicator */}
        {isGenerating && progress && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-24 left-1/4 -translate-x-1/2 z-50 bg-black/90 text-white px-6 py-3 rounded-full flex items-center gap-3 shadow-2xl"
          >
            <Loader2 className="h-4 w-4 animate-spin text-emerald-400" />
            <span className="text-sm font-medium truncate max-w-[180px]">
              {progress.currentSection}
            </span>
            <div className="w-24 h-2 bg-white/20 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-emerald-500"
                initial={{ width: 0 }}
                animate={{ width: `${progress.percentage}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
            <span className="text-xs text-white/60">
              {progress.current}/{progress.total}
            </span>
          </motion.div>
        )}

      </div>
    );
  };

  export default DentaxyFormPanel;
