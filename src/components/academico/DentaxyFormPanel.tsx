import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Loader2, Wand2, Copy, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useHistoriaClinica } from '@/hooks/useHistoriaClinica';
import { toast } from '@/hooks/use-toast';
import { demoRedacciones } from '@/data/demoRedacciones';

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
  onGeneratingChange?: (isGenerating: boolean) => void;
}

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

export const DentaxyFormPanel: React.FC<DentaxyFormPanelProps> = ({
  onGeneracionCompleta,
  onSeccionGenerada,
  onGeneracionIniciada,
  onGeneratingChange,
}) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationComplete, setGenerationComplete] = useState(false);
  const [progress, setProgress] = useState<GenerationProgress | null>(null);
  const [copiedAll, setCopiedAll] = useState(false);
  const [generatedData, setGeneratedData] = useState<Record<string, string>>({});
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

  const handleGenerarTodasRedacciones = async () => {
    setIsGenerating(true);
    setGenerationComplete(false);
    setCopiedAll(false);
    onGeneratingChange?.(true);
    
    const resultados: Record<string, string> = {};
    
    // Filter sections based on gender
    const seccionesActivas = seccionesGenerables.filter(s => 
      s.id !== 'ginecoObstetricos' || esMujer
    );
    
    const totalSecciones = seccionesActivas.length;

    toast({
      title: "Iniciando generación",
      description: "Dentaxy procesará todas las secciones automáticamente",
    });

    for (let i = 0; i < totalSecciones; i++) {
      const seccion = seccionesActivas[i];

      setProgress({
        current: i + 1,
        total: totalSecciones,
        currentSection: seccion.nombre,
      });

      // Notify that we're starting this section
      onGeneracionIniciada(seccion.id);

      // Simulate processing time with typewriter effect delay
      await delay(150 + Math.random() * 100);

      // Get demo content for this section
      const contenido = demoRedacciones[seccion.id] || `Redacción para ${seccion.nombre} generada exitosamente.`;
      
      resultados[seccion.id] = contenido;
      setGeneratedData(prev => ({ ...prev, [seccion.id]: contenido }));
      onSeccionGenerada(seccion.id, contenido);

      // Small delay between sections for visual feedback
      await delay(80);
    }

    setIsGenerating(false);
    setGenerationComplete(true);
    setProgress(null);
    onGeneratingChange?.(false);

    toast({
      title: "✓ Historia Clínica Generada",
      description: "Todas las secciones están listas. Puede copiar y pegar en SMILE.",
    });

    onGeneracionCompleta(resultados);
  };

  const handleCopiarTodasRedacciones = async () => {
    // Build formatted text with all sections
    const textoPorCopiar = seccionesGenerables
      .filter(s => s.id !== 'ginecoObstetricos' || esMujer)
      .map(seccion => {
        const contenido = generatedData[seccion.id] || '';
        return `═══════════════════════════════════════\n${seccion.nombre}\n═══════════════════════════════════════\n\n${contenido}\n`;
      })
      .join('\n\n');

    try {
      await navigator.clipboard.writeText(textoPorCopiar);
      setCopiedAll(true);
      
      toast({
        title: "✓ Redacciones Copiadas",
        description: "Todas las secciones han sido copiadas al portapapeles",
      });

      setTimeout(() => setCopiedAll(false), 3000);
    } catch (err) {
      toast({
        title: "Error al copiar",
        description: "No se pudo copiar al portapapeles",
        variant: "destructive",
      });
    }
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

      {/* Master generation/copy button */}
      <div className="p-6 border-t border-border/50 bg-background/80 backdrop-blur flex-shrink-0">
        {!generationComplete ? (
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
        ) : (
          <Button
            onClick={handleCopiarTodasRedacciones}
            className={`w-full h-14 font-bold text-lg shadow-xl transition-all duration-300 hover:shadow-2xl ${
              copiedAll 
                ? 'bg-emerald-600 hover:bg-emerald-700' 
                : 'bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700'
            } text-white`}
          >
            {copiedAll ? (
              <>
                <Check className="mr-3 h-5 w-5" />
                ✓ Copiadas al Portapapeles
              </>
            ) : (
              <>
                <Copy className="mr-3 h-5 w-5" />
                Copiar Todas las Redacciones
              </>
            )}
          </Button>
        )}
        <p className="text-xs text-center text-muted-foreground mt-3">
          {generationComplete 
            ? "Use el botón 'Pegar Redacciones' en SMILE para transferir el contenido"
            : "Dentaxy procesará automáticamente todas las secciones"
          }
        </p>
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
