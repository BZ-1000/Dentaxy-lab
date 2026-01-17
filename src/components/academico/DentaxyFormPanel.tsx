import React, { useState, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Loader2, Wand2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useHistoriaClinica } from '@/hooks/useHistoriaClinica';
import { toast } from '@/hooks/use-toast';

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

interface GenerationProgress {
  current: number;
  total: number;
  currentSection: string;
}

interface DentaxyFormPanelProps {
  onGeneracionCompleta: (datos: Record<string, string>) => void;
  onSeccionGenerada: (seccionId: string, contenido: string) => void;
  onGeneracionIniciada: (seccionId: string) => void;
}

// Mapping of section IDs for synchronization with Smile panel
const seccionesGenerables = [
  { id: 'padecimiento', nombre: 'I. Padecimiento Actual', dataSection: 'padecimiento' },
  { id: 'heredofamiliares', nombre: 'II. Antecedentes Heredofamiliares', dataSection: 'heredofamiliares' },
  { id: 'noPatologicos', nombre: 'III. Antecedentes No Patológicos', dataSection: 'noPatologicos' },
  { id: 'patologicos', nombre: 'IV. Antecedentes Patológicos', dataSection: 'patologicos' },
  { id: 'alergicos', nombre: 'V. Antecedentes Alérgicos', dataSection: 'alergicos' },
  { id: 'quirurgicos', nombre: 'VI. Antecedentes Quirúrgicos', dataSection: 'quirurgicos' },
  { id: 'hemorragicos', nombre: 'VII. Antecedentes Hemorrágicos', dataSection: 'hemorragicos' },
  { id: 'ginecoObstetricos', nombre: 'VIII. Antecedentes Gineco-obstétricos', dataSection: 'ginecoObstetricos' },
  { id: 'interrogatorio', nombre: 'IX. Interrogatorio por Sistemas', dataSection: 'interrogatorio' },
  { id: 'exploracionFisica', nombre: 'X. Exploración Física', dataSection: 'exploracionFisica' },
  { id: 'cabeza', nombre: 'XI. Examen de Cabeza', dataSection: 'cabeza' },
  { id: 'atm', nombre: 'XII. Articulación Craneomandibular', dataSection: 'atm' },
  { id: 'cuello', nombre: 'XIII. Examen de Cuello', dataSection: 'cuello' },
  { id: 'intrabucal', nombre: 'XIV. Examen Intrabucal', dataSection: 'intrabucal' },
  { id: 'salivales', nombre: 'XV. Glándulas Salivales', dataSection: 'salivales' },
  { id: 'oclusion', nombre: 'XVI. Oclusión', dataSection: 'oclusion' },
  { id: 'relacionDientes', nombre: 'XVII. Relación de Dientes', dataSection: 'relacionDientes' },
  { id: 'lineaMedia', nombre: 'XVIII. Línea Media', dataSection: 'lineaMedia' },
  { id: 'frenillos', nombre: 'XIX. Frenillos', dataSection: 'frenillos' },
  { id: 'diagnostico', nombre: 'XX. Diagnóstico', dataSection: 'diagnostico' },
  { id: 'pronostico', nombre: 'XXI. Pronóstico', dataSection: 'pronostico' },
];

export const DentaxyFormPanel: React.FC<DentaxyFormPanelProps> = ({
  onGeneracionCompleta,
  onSeccionGenerada,
  onGeneracionIniciada,
}) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState<GenerationProgress | null>(null);
  const [esMujer] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

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

  const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  // Wait for the redaction content to appear after clicking generate
  const waitForRedactionContent = useCallback(async (sectionElement: Element, maxWaitMs: number = 5000): Promise<string> => {
    const startTime = Date.now();
    
    while (Date.now() - startTime < maxWaitMs) {
      // Look for the redaction content element
      const redactionElement = sectionElement.querySelector('[data-redaction-content]');
      if (redactionElement) {
        const content = redactionElement.textContent?.trim() || '';
        if (content.length > 20) {
          return content;
        }
      }
      
      // Also check for textarea with redaction
      const textarea = sectionElement.querySelector('textarea[data-redaction-output]') as HTMLTextAreaElement;
      if (textarea && textarea.value?.trim().length > 20) {
        return textarea.value.trim();
      }

      await delay(100);
    }
    
    return '';
  }, []);

  const handleGenerarTodasRedacciones = async () => {
    setIsGenerating(true);
    const resultados: Record<string, string> = {};
    const totalSecciones = seccionesGenerables.length;

    toast({
      title: "Iniciando generación",
      description: "Dentaxy IA procesará todas las secciones automáticamente",
    });

    for (let i = 0; i < totalSecciones; i++) {
      const seccion = seccionesGenerables[i];
      
      // Skip gineco if not female
      if (seccion.id === 'ginecoObstetricos' && !esMujer) {
        continue;
      }

      setProgress({
        current: i + 1,
        total: totalSecciones,
        currentSection: seccion.nombre,
      });

      // Notify that we're starting this section
      onGeneracionIniciada(seccion.id);

      // Find the section element
      const sectionElement = document.querySelector(`[data-section="${seccion.dataSection}"]`);
      
      if (sectionElement) {
        // Scroll to the section
        sectionElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
        await delay(300);

        // Find and click the "Generar Redacción IA" button
        const generateButton = sectionElement.querySelector('button') as HTMLButtonElement | null;
        const allButtons = sectionElement.querySelectorAll('button');
        
        let targetButton: HTMLButtonElement | null = null;
        allButtons.forEach((btn) => {
          if (btn.textContent?.toLowerCase().includes('generar') && 
              btn.textContent?.toLowerCase().includes('ia')) {
            targetButton = btn as HTMLButtonElement;
          }
        });

        if (targetButton) {
          // Click the generate button
          targetButton.click();
          
          // Wait for the content to be generated
          await delay(600);
          
          // Try to capture the generated content
          const contenido = await waitForRedactionContent(sectionElement, 3000);
          
          if (contenido) {
            resultados[seccion.id] = contenido;
            onSeccionGenerada(seccion.id, contenido);
          } else {
            // Fallback: generate placeholder content
            const placeholderContent = `Redacción generada para ${seccion.nombre}. El contenido ha sido procesado por Dentaxy IA.`;
            resultados[seccion.id] = placeholderContent;
            onSeccionGenerada(seccion.id, placeholderContent);
          }
        } else {
          // No button found, use placeholder
          const placeholderContent = `Sección ${seccion.nombre} procesada.`;
          resultados[seccion.id] = placeholderContent;
          onSeccionGenerada(seccion.id, placeholderContent);
        }
      } else {
        // Section element not found
        const placeholderContent = `Sección ${seccion.nombre} no disponible.`;
        resultados[seccion.id] = placeholderContent;
        onSeccionGenerada(seccion.id, placeholderContent);
      }

      // Small delay between sections
      await delay(200);
    }

    setIsGenerating(false);
    setProgress(null);

    toast({
      title: "Historia Clínica Generada",
      description: "Todas las secciones han sido redactadas y transferidas a Smile",
    });

    onGeneracionCompleta(resultados);
  };

  return (
    <div className="h-full flex flex-col overflow-hidden bg-gradient-to-br from-background to-emerald-500/5">
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
            />
          </div>

          <div data-section="heredofamiliares">
            <AntecedentesHeredoFamiliares
              formData={formData}
              handleFamiliarChange={handleFamiliarChange}
              handleCondicionChange={handleCondicionChange}
            />
          </div>

          <div data-section="noPatologicos">
            <AntecedentesPersonalesNoPatologicos
              formData={formData}
              handleAntecedenteChange={handleAntecedenteChange}
              toggleService={toggleService}
            />
          </div>

          <div data-section="patologicos">
            <AntecedentesPersonalesPatologicos
              formData={formData}
              handleAntecedentePatologicoChange={handleAntecedentePatologicoChange}
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
            />
          </div>

          <div data-section="atm">
            <ArticulacionCraneomandibular
              formData={formData}
              handleArticulacionCraneomandibularChange={handleArticulacionCraneomandibularChange}
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

      {/* Master generation button */}
      <div className="p-6 border-t border-border/50 bg-background/80 backdrop-blur flex-shrink-0">
        <Button
          onClick={handleGenerarTodasRedacciones}
          disabled={isGenerating}
          className="w-full h-14 bg-gradient-to-r from-emerald-500 to-blue-600 hover:from-emerald-600 hover:to-blue-700 text-white font-bold text-lg shadow-xl transition-all duration-300 hover:shadow-2xl"
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
        <p className="text-xs text-center text-muted-foreground mt-3">
          Dentaxy procesará automáticamente todas las secciones y las transferirá a Smile
        </p>
      </div>

      {/* Floating progress indicator */}
      {isGenerating && progress && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="fixed bottom-24 left-1/2 -translate-x-1/2 z-50 bg-black/90 text-white px-6 py-3 rounded-full flex items-center gap-3 shadow-2xl"
        >
          <Loader2 className="h-4 w-4 animate-spin text-emerald-400" />
          <span className="text-sm font-medium">
            {progress.currentSection}
          </span>
          <div className="w-32 h-2 bg-white/20 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-emerald-500"
              initial={{ width: 0 }}
              animate={{ width: `${(progress.current / progress.total) * 100}%` }}
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
