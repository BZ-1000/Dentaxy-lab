import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, X, ChevronLeft } from 'lucide-react';
import { FormDataState } from '@/types/historiaClinica';

import { useGenerarTodasRedacciones } from '@/hooks/useGenerarTodasRedacciones';
import { useHistoriaClinica } from '@/hooks/useHistoriaClinica';

// UI Components
import { ProgressLine } from './ui/ProgressLine';
import { DocumentWriterPanel } from './ui/DocumentWriterPanel';
import { SectionCard, ViewMode } from './ui/SectionCard';
import { DexShellCard } from './ui/DexShellCard';
import { useFormCLI } from './cli/useFormCLI';
import { padecimientoCLIQuestions } from './cli/sections/padecimientoCLI';
import { heredofamiliaresCLIQuestions } from './cli/sections/heredofamiliaresCLI';
import { noPatologicosCLIQuestions } from './cli/sections/noPatologicosCLI';
import { patologicosCLIQuestions } from './cli/sections/patologicosCLI';
import { alergicosCLIQuestions } from './cli/sections/alergicosCLI';
import { quirurgicosCLIQuestions } from './cli/sections/quirurgicosCLI';
import { hemorragicosCLIQuestions } from './cli/sections/hemorragicosCLI';
import { ginecoObstetricosCLIQuestions } from './cli/sections/ginecoObstetricosCLI';
import { interrogatorioCLIQuestions } from './cli/sections/interrogatorioCLI';
import { exploracionFisicaCLIQuestions } from './cli/sections/exploracionFisicaCLI';
import { 
  cabezaCLIQuestions, 
  atmCLIQuestions, 
  cuelloCLIQuestions, 
  intrabucalCLIQuestions, 
  odontogramaCLIQuestions, 
  salivalesCLIQuestions, 
  oclusionCLIQuestions, 
  relacionDientesCLIQuestions, 
  lineaMediaCLIQuestions, 
  frenillosCLIQuestions 
} from './cli/sections/dentalCLI';
import { getFallbackCLIQuestions } from './cli/sections/fallbackCLI';
import { useCliStore } from '@/stores/useCliStore';
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

import { Odontograma } from '../historia-clinica/Odontograma';

interface Seed2FormPanelProps {
  onGeneracionCompleta?: (datos: Record<string, string>, formData?: FormDataState) => void;
  onSeccionGenerada?: (seccionId: string, contenido: any) => void;
  onGeneracionIniciada?: (seccionId: string) => void;
  onGeneratingChange?: (generating: boolean) => void;
  disableProgressLineAnimation?: boolean;
  isPopup?: boolean;
  patientData?: {
    nombreCompleto: string;
    edad: string;
    genero: string;
    fechaNacimiento: string;
    ocupacion: string;
    telefono: string;
    motivoConsulta: string;
  };
  onClose?: () => void;
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

export const Seed2FormPanel: React.FC<Seed2FormPanelProps> = ({
  onSeccionGenerada,
  onGeneratingChange,
  disableProgressLineAnimation = false,
  isPopup = false,
  patientData,
  onClose
}) => {

  const seccionesGenerables = [
    { id: 'padecimiento', nombre: '1. Padecimiento Actual' },
    { id: 'heredofamiliares', nombre: '2. Antecedentes Heredofamiliares' },
    { id: 'noPatologicos', nombre: '3. Antecedentes No Patológicos' },
    { id: 'patologicos', nombre: '4. Antecedentes Patológicos' },
    { id: 'alergicos', nombre: '5. Antecedentes Alérgicos' },
    { id: 'quirurgicos', nombre: '6. Antecedentes Quirúrgicos' },
    { id: 'hemorragicos', nombre: '7. Antecedentes Hemorrágicos' },
    { id: 'ginecoObstetricos', nombre: '8. Antecedentes Gineco-obstétricos' },
    { id: 'interrogatorio', nombre: '9. Interrogatorio por Sistemas' },
    { id: 'exploracionFisica', nombre: '10. Exploración Física' },
    { id: 'cabeza', nombre: '11. Examen de Cabeza' },
    { id: 'atm', nombre: '12. Articulación Craneomandibular' },
    { id: 'cuello', nombre: '13. Examen de Cuello' },
    { id: 'intrabucal', nombre: '14. Examen Intrabucal' },
    { id: 'odontograma', nombre: '15. Odontograma' },
    { id: 'salivales', nombre: '16. Glándulas Salivales' },
    { id: 'oclusion', nombre: '17. Oclusión' },
    { id: 'relacionDientes', nombre: '18. Relación de Dientes' },
    { id: 'lineaMedia', nombre: '19. Línea Media' },
    { id: 'frenillos', nombre: '20. Frenillos' },
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

  /* --- CLI ENGINE INTEGRATION --- */
  const currentSectionId = seccionesActivas[currentStep]?.id;
  
  const getQuestionsForSection = (sectionId: string) => {
    switch (sectionId) {
      case 'padecimiento': return padecimientoCLIQuestions;
      case 'heredofamiliares': return heredofamiliaresCLIQuestions;
      case 'noPatologicos': return noPatologicosCLIQuestions;
      case 'patologicos': return patologicosCLIQuestions;
      case 'alergicos': return alergicosCLIQuestions;
      case 'quirurgicos': return quirurgicosCLIQuestions;
      case 'hemorragicos': return hemorragicosCLIQuestions;
      case 'ginecoObstetricos': return ginecoObstetricosCLIQuestions;
      case 'interrogatorio': return interrogatorioCLIQuestions;
      case 'exploracionFisica': return exploracionFisicaCLIQuestions;
      case 'cabeza': return cabezaCLIQuestions;
      case 'atm': return atmCLIQuestions;
      case 'cuello': return cuelloCLIQuestions;
      case 'intrabucal': return intrabucalCLIQuestions;
      case 'odontograma': return odontogramaCLIQuestions;
      case 'salivales': return salivalesCLIQuestions;
      case 'oclusion': return oclusionCLIQuestions;
      case 'relacionDientes': return relacionDientesCLIQuestions;
      case 'lineaMedia': return lineaMediaCLIQuestions;
      case 'frenillos': return frenillosCLIQuestions;
      default: return getFallbackCLIQuestions(seccionesActivas[currentStep]?.nombre);
    }
  };

  const cliQuestions = getQuestionsForSection(currentSectionId);

  const handleCLISectionComplete = async (answers: Record<string, any>) => {
    // Generar redacción automáticamente al terminar la sección
    await handleGenerateCurrent();
    
    // Pequeño timeout para permitir que se guarde la redacción antes de avanzar
    setTimeout(() => {
      handleNext();
    }, 150);
  };

  const { currentQuestion, submitAnswer, goBack: cliGoBack, canGoBack: cliCanGoBack } = useFormCLI(cliQuestions, handleCLISectionComplete);

  const handleCLISubmit = (answer: string | number) => {
    const qId = currentQuestion?.id;
    if (!qId) return;

    // Map responses to useHistoriaClinica handlers
    if (currentSectionId === 'padecimiento') {
      if (qId === 'motivoConsulta') handlePadecimientoChange('motivoConsulta', answer.toString());
      if (qId === 'sinSintomas') handleSinSintomasChange(answer === 'true');
      if (qId === 'fechaInicio') handleDolorChange('fechaInicio', answer);
      if (qId === 'condicionAparicion') handleDolorChange('condicionAparicion', answer);
      if (qId === 'causaProvocado') handleDolorChange('causaProvocado', answer);
      if (qId === 'frecuencia') handleDolorChange('frecuencia', answer);
      if (qId === 'caracter') handleDolorChange('caracter', answer);
      if (qId === 'intensidad') handleDolorChange('intensidad', answer);
      if (qId === 'ubicacion') handleDolorChange('ubicacion', answer);
      if (qId === 'localizacionDescripcion') handleDolorChange('localizacion', { tipo: 'Localizado', descripcion: answer });
      if (qId === 'atenuacion') handleDolorChange('atenuacion', answer);
    }
    else if (currentSectionId === 'heredofamiliares') {
      if (qId === 'padre_estado') {
        if (answer === 'sano') {
          handleFamiliarChange('padre', 'vivoSano', true);
          handleFamiliarChange('padre', 'finado', false);
        } else if (answer === 'finado') {
          handleFamiliarChange('padre', 'vivoSano', false);
          handleFamiliarChange('padre', 'finado', true);
        } else {
          handleFamiliarChange('padre', 'vivoSano', false);
          handleFamiliarChange('padre', 'finado', false);
        }
      }
      if (qId === 'padre_causa') handleFamiliarChange('padre', 'causaMuerte', answer.toString());
      if (qId === 'padre_condiciones') {
        handleCondicionChange('padre', 'diabetesMellitus', answer === 'diabetes');
        handleCondicionChange('padre', 'hipertensionArterial', answer === 'hipertension');
        handleCondicionChange('padre', 'cancer', answer === 'cancer');
        if (answer !== 'otras') handleCondicionChange('padre', 'otras', '');
      }
      if (qId === 'padre_otras_desc') handleCondicionChange('padre', 'otras', answer.toString());

      if (qId === 'madre_estado') {
        if (answer === 'sano') {
          handleFamiliarChange('madre', 'vivoSano', true);
          handleFamiliarChange('madre', 'finado', false);
        } else if (answer === 'finado') {
          handleFamiliarChange('madre', 'vivoSano', false);
          handleFamiliarChange('madre', 'finado', true);
        } else {
          handleFamiliarChange('madre', 'vivoSano', false);
          handleFamiliarChange('madre', 'finado', false);
        }
      }
      if (qId === 'madre_causa') handleFamiliarChange('madre', 'causaMuerte', answer.toString());
      if (qId === 'madre_condiciones') {
        handleCondicionChange('madre', 'diabetesMellitus', answer === 'diabetes');
        handleCondicionChange('madre', 'hipertensionArterial', answer === 'hipertension');
        handleCondicionChange('madre', 'cancer', answer === 'cancer');
        if (answer !== 'otras') handleCondicionChange('madre', 'otras', '');
      }
      if (qId === 'madre_otras_desc') handleCondicionChange('madre', 'otras', answer.toString());
      
      if (qId === 'otros_familiares_desc') {
        handleCondicionChange('abueloPaterno', 'otras', answer.toString());
      }
    }
    else if (currentSectionId === 'noPatologicos') {
      if (qId === 'frecuenciaCepillado') handleAntecedenteChange('frecuenciaCepillado', answer.toString());
      if (qId === 'auxiliaresBucales') {
        let aux = [];
        if (answer === 'hilo' || answer === 'ambos') aux.push('Hilo dental');
        if (answer === 'enjuague' || answer === 'ambos') aux.push('Enjuague bucal');
        handleAntecedenteChange('auxiliaresBucales', aux);
      }
      if (qId === 'mascotasDetalle') handleAntecedenteChange('mascotas', answer.toString());
      if (qId === 'serviciosVivienda') {
        const servs = answer === 'completos' ? ['Agua potable', 'Luz eléctrica', 'Drenaje'] : ['Agua potable'];
        handleAntecedenteChange('servicios', servs);
      }
      if (qId === 'alimentacion') {
        const dietaVal = answer === 'balanceada' ? 'Balanceada' : answer === 'cariogenica' ? 'Cariogénica' : 'Deficiente';
        handleAntecedenteChange('tipoDieta', dietaVal);
      }
    }
    else if (currentSectionId === 'patologicos') {
      if (qId === 'sinPatologia') {
        handleAntecedentePatologicoChange('sinPatologia', answer === 'true');
        if (answer === 'true') {
          handleAntecedentePatologicoChange('cardiacos', { ninguna: true });
          handleAntecedentePatologicoChange('nutricionales', { ninguna: true });
          handleAntecedentePatologicoChange('hepaticos', { ninguna: true });
        }
      }
      if (qId === 'cardiacos') {
        handleAntecedentePatologicoChange('cardiacos', {
          enfermedadCoronaria: answer === 'arritmia',
          arritmias: answer === 'arritmia',
          defectosCardiacosCongenitos: false,
          ninguna: answer === 'no',
          otra: answer === 'hipertension',
          otraDescripcion: answer === 'hipertension' ? 'Hipertensión arterial' : ''
        });
      }
      if (qId === 'diabetes') {
        handleAntecedentePatologicoChange('nutricionales', {
          sobrepeso: false,
          obesidad: false,
          ninguna: answer === 'no',
          otra: answer === 'si',
          otraDescripcion: answer === 'si' ? 'Diabetes Mellitus' : ''
        });
      }
      if (qId === 'otrosDetalles') {
        handleAntecedentePatologicoChange('otrosPadecimientos', {
          especificar: true,
          ninguna: false,
          otra: true,
          otraDescripcion: answer.toString()
        });
      }
    }
    else if (currentSectionId === 'alergicos') {
      if (qId === 'medicamentos_alergico') {
        handleAntecedenteAlergicoChange('medicamentos', {
          es_alergico: answer === 'true',
          cuales: '',
          tipo_reaccion: '',
          severidad: ''
        });
      }
      if (qId === 'medicamentos_cuales') {
        handleAntecedenteAlergicoChange('medicamentos', {
          es_alergico: true,
          cuales: answer.toString(),
          tipo_reaccion: 'Reacción adversa',
          severidad: 'Moderada'
        });
      }
      if (qId === 'alimentos_alergico') {
        handleAntecedenteAlergicoChange('alimentos', {
          es_alergico: answer === 'true',
          cuales: ''
        });
      }
      if (qId === 'alimentos_cuales') {
        handleAntecedenteAlergicoChange('alimentos', {
          es_alergico: true,
          cuales: answer.toString()
        });
      }
      if (qId === 'latex_alergico') {
        handleAntecedenteAlergicoChange('latex', {
          es_alergico: answer === 'true',
          descripcion_reaccion: answer === 'true' ? 'Contacto cutáneo' : ''
        });
      }
      if (qId === 'reaccionAnestesia') handleAntecedenteAlergicoChange('reaccionAnestesia', answer === 'true');
      if (qId === 'descripcionReaccionAnestesia') handleAntecedenteAlergicoChange('descripcionReaccion', answer.toString());
    }
    else if (currentSectionId === 'quirurgicos') {
      if (qId === 'sinQuirurgicos') handleAntecedenteQuirurgicoChange('sinQuirurgicos', answer === 'true');
      if (qId === 'cirugiasDetalles') handleAntecedenteQuirurgicoChange('hospitalizacionesPrevias', answer.toString());
      if (qId === 'tomaMedicamentos') handleAntecedenteQuirurgicoChange('tomaMedicamentos', answer === 'true');
      if (qId === 'cualesMedicamentos') {
        handleAntecedenteQuirurgicoChange('cualesMedicamentos', answer.toString());
        handleAntecedenteQuirurgicoChange('motivoMedicamentos', 'Control sistémico');
      }
    }
    else if (currentSectionId === 'hemorragicos') {
      if (qId === 'sinHemorragicos') {
        handleAntecedenteHemorragicoChange('sinHemorragicos', answer === 'true');
        handleAntecedenteHemorragicoChange('sangradoProlongado', 'No');
        handleAntecedenteHemorragicoChange('hematomas', 'No');
        handleAntecedenteHemorragicoChange('transfusiones', 'No');
      }
      if (qId === 'sangradoProlongado') {
        const val = answer === 'si' ? 'Sí' : 'No';
        handleAntecedenteHemorragicoChange('sangradoProlongado', val);
        handleAntecedenteHemorragicoChange('hematomas', val);
      }
      if (qId === 'transfusionPrevia') handleAntecedenteHemorragicoChange('transfusionPrevia', answer === 'true');
      if (qId === 'motivoTransfusion') {
        handleAntecedenteHemorragicoChange('transfusiones', 'Sí');
        handleAntecedenteHemorragicoChange('detallesAdicionales', answer.toString());
      }
    }
    else if (currentSectionId === 'interrogatorio') {
      if (qId === 'sistemas_detalles') {
        const sist = currentQuestion?.placeholder || 'General';
        handleInterrogatorioChange(sist, answer.toString());
      }
    }
    else if (currentSectionId === 'exploracionFisica') {
      if (qId === 'ta') handleExploracionFisicaChange('signosVitales', { ...formData.exploracionFisica.signosVitales, ta: answer.toString() });
      if (qId === 'fc') handleExploracionFisicaChange('signosVitales', { ...formData.exploracionFisica.signosVitales, fc: answer.toString() });
      if (qId === 'temperatura') handleExploracionFisicaChange('signosVitales', { ...formData.exploracionFisica.signosVitales, temperatura: answer.toString() });
      if (qId === 'peso') handleExploracionFisicaChange('signosVitales', { ...formData.exploracionFisica.signosVitales, peso: answer.toString() });
      if (qId === 'talla') handleExploracionFisicaChange('signosVitales', { ...formData.exploracionFisica.signosVitales, talla: answer.toString() });
    }
    else if (currentSectionId === 'cabeza') {
      if (qId === 'cabeza_hallazgos') handleExamenCabezaChange('sinHallazgos', answer === 'normal');
      if (qId === 'cabeza_detalles') handleExamenCabezaChange('otrosHallazgos', answer.toString());
    }
    else if (currentSectionId === 'atm') {
      if (qId === 'atm_ruidos') handleArticulacionCraneomandibularChange('ruidoArticular', answer === 'true' ? 'Chasquidos' : 'Ninguno');
      if (qId === 'atm_dolor') handleArticulacionCraneomandibularChange('dolor', answer === 'true');
      if (qId === 'atm_observaciones') handleArticulacionCraneomandibularChange('otrasObservaciones', answer.toString());
    }
    else if (currentSectionId === 'cuello') {
      if (qId === 'cuello_normal') handleExamenCuelloChange('sinHallazgos', answer === 'normal');
      if (qId === 'cuello_detalles') {
        handleExamenCuelloChange('cervicales', { palpacion: 'se_palpan', observaciones: answer.toString() });
      }
    }
    else if (currentSectionId === 'intrabucal') {
      if (qId === 'intrabucal_normal') handleExamenIntrabucalChange('sinHallazgos', answer === 'normal');
      if (qId === 'intrabucal_detalles') {
        handleExamenIntrabucalChange('mejillas', { sinHallazgos: false, observaciones: answer.toString() });
      }
    }
    else if (currentSectionId === 'odontograma') {
      if (qId === 'odontograma_detalles') {
        handleOdontogramaChange(999, 'caries');
      }
    }
    else if (currentSectionId === 'salivales') {
      if (qId === 'salivales_normal') handleGlandulasSalivalesChange('sinHallazgos', answer === 'normal');
      if (qId === 'salivales_detalles') handleGlandulasSalivalesChange('observaciones', answer.toString());
    }
    else if (currentSectionId === 'oclusion') {
      if (qId === 'clasificacionAngle') handleOclusionChange('clasificacionAngle', answer.toString());
      if (qId === 'mordidaAnormal') {
        handleOclusionChange('mordidaCruzada', answer === 'cruzada' || answer === 'ambas');
        handleOclusionChange('mordidaAbierta', answer === 'abierta' || answer === 'ambas');
      }
    }
    else if (currentSectionId === 'relacionDientes') {
      if (qId === 'relacion_normal') {
        handleRelacionDientesChange('apiñamiento', answer === 'apiniamiento' || answer === 'ambos');
        handleRelacionDientesChange('diastemas', answer === 'diastemas' || answer === 'ambos');
      }
      if (qId === 'relacion_observaciones') handleRelacionDientesChange('observaciones', answer.toString());
    }
    else if (currentSectionId === 'lineaMedia') {
      if (qId === 'coincidente') handleLineaMediaChange('coincidente', answer === 'true');
      if (qId === 'desviacion') handleLineaMediaChange('desviacion', answer.toString());
    }
    else if (currentSectionId === 'frenillos') {
      if (qId === 'frenillos_normal') handleFrenillosChange('sinHallazgos', answer === 'normal');
      if (qId === 'frenillos_detalles') handleFrenillosChange('observaciones', answer.toString());
    }

    submitAnswer(answer);
  };

  React.useEffect(() => {
    const store = useCliStore.getState();
    store.setExpedienteMode(true);
    return () => store.setExpedienteMode(false);
  }, []);

  React.useEffect(() => {
    const store = useCliStore.getState();
    store.setCurrentQuestion(currentQuestion, handleCLISubmit);
  }, [currentQuestion, currentSectionId]);

  const renderCurrentStepContent = () => {
    const section = seccionesActivas[currentStep];
    const onSeccionGeneradaProp = (seccionId: string, text: string) => handleContentGenerated(seccionId, text);
    const commonProps = {
      onToggleViewMode: handleToggleViewMode,
      onSeccionGenerada: onSeccionGeneradaProp
    };

    switch (section.id) {
      case 'padecimiento':
        return <PadecimientoCard
          formData={formData}
          handlePadecimientoChange={handlePadecimientoChange}
          handleDolorChange={handleDolorChange}
          handleSinSintomasChange={handleSinSintomasChange}
          onSectionComplete={handleNext}
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
      "relative w-full h-full overflow-hidden",
      isPopup ? "bg-transparent" : "bg-white dark:bg-zinc-950"
    )}>

      {/* CAPA 1 (fondo): Documento blanco — ocupa toda la pantalla por detrás */}
      <div className="absolute inset-0 z-0 overflow-y-auto">
        <DocumentWriterPanel
          formData={formData}
          patientData={patientData}
          generations={generations}
          seccionesActivas={seccionesActivas}
          onClose={() => setIsDocumentOpen(false)}
          isExpanded={isDocumentExpanded}
          onToggleExpand={() => setIsDocumentExpanded(!isDocumentExpanded)}
          onNext={handleNext}
          canGoNext={currentStep < seccionesActivas.length - 1}
          width={100}
        />
      </div>

      {/* CAPA 2 (frente): Tarjeta de pregunta centrada encima del documento */}
      <div
        ref={scrollContainerRef}
        onScroll={handleScroll}
        className="absolute inset-0 z-10 flex items-center justify-center p-6 pointer-events-none"
      >
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
            className="w-full max-w-[580px] pointer-events-auto"
          >
            {/* 
              Renderizamos los formularios originales pero INVISIBLES.
              Esto permite que sus hooks internos (useEffect) sigan reaccionando
              a los cambios de estado (formData) y generen las redacciones automáticamente
              sin tener que duplicar toda la lógica determinista aquí.
            */}
            <div data-section={currentSectionInfo.id} style={{ display: 'none' }}>
              {renderCurrentStepContent()}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
      {/* Botón de Cerrar — siempre encima de todo */}
      {onClose && (
        <button
          onClick={onClose}
          className="absolute top-6 right-6 z-[9999] w-12 h-12 bg-white/20 hover:bg-white/30 dark:bg-black/20 dark:hover:bg-black/40 backdrop-blur-md rounded-full flex items-center justify-center text-slate-800 dark:text-white transition-all shadow-lg border border-white/30 dark:border-white/10"
          title="Cerrar Expediente"
        >
          <X size={24} />
        </button>
      )}

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
  );
}


export default Seed2FormPanel;
