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
import { ginecoObstetricosCLIQuestions } from './cli/sections/ginecoObstetricosCLI';
import { interrogatorioCLIQuestions } from './cli/sections/interrogatorioCLI';
import { exploracionFisicaCLIQuestions } from './cli/sections/exploracionFisicaCLI';
import { dentalCLIQuestions } from './cli/sections/dentalCLI';
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
  intakeData?: { name?: string; reason?: string };
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
  onClose,
  intakeData
}) => {

  const seccionesGenerables = [
    { id: 'padecimiento', nombre: '1. Padecimiento Actual' },
    { id: 'heredofamiliares', nombre: '2. Antecedentes Heredofamiliares' },
    { id: 'patologicos', nombre: '3. Antecedentes Personales Patológicos' },
    { id: 'noPatologicos', nombre: '4. Antecedentes No Patológicos' },
    { id: 'exploracionFisica', nombre: '5. Exploración Física y Regional' },
    { id: 'odontograma', nombre: '6. Exploración Intrabucal y Odontograma' }
  ];

  const esMujer = patientData?.genero?.toLowerCase() === 'femenino' || 
                   patientData?.genero?.toLowerCase() === 'mujer' || 
                   patientData?.genero?.toLowerCase() === 'f';
  const [currentStep, setCurrentStep] = useState(0);
  const [direction, setDirection] = useState(0);
  const [viewMode, setViewMode] = useState<ViewMode>('form');
  const [isSectionExpanded, setIsSectionExpanded] = useState(true);
  const [sistemaAfectadoActivo, setSistemaAfectadoActivo] = useState<string>('digestivo');

  // Split-screen state
  const isMobile = useIsMobile();
  const [isDocumentOpen, setIsDocumentOpen] = useState(false);
  const [isDocumentExpanded, setIsDocumentExpanded] = useState(false);
  const [docWidth, setDocWidth] = useState(50); // New state for dynamic resizing
  const [isDraggingSplit, setIsDraggingSplit] = useState(false); // State to disable animations while dragging

  // Filter sections based on gender
  const seccionesActivas = seccionesGenerables;
  const currentSectionInfo = seccionesActivas[currentStep];

  /* Generaciones de contenido */
  const [subGenerations, setSubGenerations] = useState<Record<string, string>>({});
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

  // Escuchar datos que llegan en tiempo real desde el celular (Supabase)
  React.useEffect(() => {
    if (intakeData?.reason && intakeData.reason !== formData.padecimientoActual.motivoConsulta) {
      handlePadecimientoChange('motivoConsulta', intakeData.reason);
      toast.success('Motivo de consulta recibido del paciente');
      
      // Intentar forzar la generación de esta sección después de un retraso corto
      setTimeout(() => {
        handleGenerateCurrent();
      }, 500);
    }
  }, [intakeData?.reason]);

  const handleContentGenerated = (seccionId: string, contenido: any, textoPlano?: string) => {
    const textValue = typeof contenido === 'string' ? contenido : (textoPlano || '');

    setSubGenerations(prev => {
      const updated = { ...prev, [seccionId]: textValue };

      // Calcular las generations consolidadas a partir de updated
      const consolidated: Record<string, string> = {};

      // 1. Padecimiento Actual
      consolidated.padecimiento = updated.padecimiento || '';

      // 2. Antecedentes Heredofamiliares
      consolidated.heredofamiliares = updated.heredofamiliares || '';

      // 3. Antecedentes Personales Patológicos (consolida patologicos, alergicos, quirurgicos, hemorragicos, ginecoObstetricos)
      const partPatologicos = [
        updated.patologicos,
        updated.alergicos,
        updated.quirurgicos,
        updated.hemorragicos,
        esMujer ? updated.ginecoObstetricos : null
      ].filter(Boolean).join('<br/><br/>');
      consolidated.patologicos = partPatologicos;

      // 4. Antecedentes Personales No Patológicos
      consolidated.noPatologicos = updated.noPatologicos || '';

      // 5. Exploración Física y Regional (consolida exploracionFisica, cabeza, atm, cuello)
      const partFisica = [
        updated.exploracionFisica,
        updated.cabeza,
        updated.atm,
        updated.cuello
      ].filter(Boolean).join('<br/><br/>');
      consolidated.exploracionFisica = partFisica;

      // 6. Exploración Intrabucal y Odontograma (consolida odontograma, intrabucal, salivales, oclusion, relacionDientes, lineaMedia, frenillos)
      const partDental = [
        updated.odontograma,
        updated.intrabucal,
        updated.salivales,
        updated.oclusion,
        updated.relacionDientes,
        updated.lineaMedia,
        updated.frenillos
      ].filter(Boolean).join('<br/><br/>');
      consolidated.odontograma = partDental;

      setGenerations(consolidated);
      return updated;
    });

    // Open split panel on Desktop
    if (!isMobile) {
      setIsDocumentOpen(true);
    }

    // Notify parent if listener exists
    if (onSeccionGenerada) {
      onSeccionGenerada(seccionId, textValue);
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
      case 'patologicos': {
        const questions = [...patologicosCLIQuestions];
        if (esMujer) {
          questions.push(...ginecoObstetricosCLIQuestions);
        }
        return questions;
      }
      case 'noPatologicos': return noPatologicosCLIQuestions;
      case 'exploracionFisica': return exploracionFisicaCLIQuestions;
      case 'odontograma': return dentalCLIQuestions;
      default: return getFallbackCLIQuestions(seccionesActivas[currentStep]?.nombre);
    }
  };

  const cliQuestions = React.useMemo(() => {
    return getQuestionsForSection(currentSectionId);
  }, [currentSectionId, esMujer]);

  const handleCLISectionComplete = async (answers: Record<string, any>) => {
    // Generar redacción automáticamente al terminar la sección
    await handleGenerateCurrent();
    
    // Pequeño timeout para permitir que se guarde la redacción antes de avanzar
    setTimeout(() => {
      handleNext();
    }, 150);
  };

  const { currentQuestion, submitAnswer, goBack: cliGoBack, canGoBack: cliCanGoBack, currentIndex, totalQuestions } = useFormCLI(cliQuestions, handleCLISectionComplete);

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
        const text = answer.toString().toLowerCase();
        const familiarKeys: string[] = [];

        if (text.includes('abuelo paterno')) familiarKeys.push('abueloPaterno');
        if (text.includes('abuela paterna')) familiarKeys.push('abuelaPaterna');
        if (text.includes('abuelo materno')) familiarKeys.push('abueloMaterno');
        if (text.includes('abuela materna')) familiarKeys.push('abuelaMaterna');

        // Búsqueda por palabras clave generales si no fue específico
        if (familiarKeys.length === 0) {
          if (text.includes('abuelo')) {
            familiarKeys.push('abueloPaterno');
            familiarKeys.push('abueloMaterno');
          }
          if (text.includes('abuela')) {
            familiarKeys.push('abuelaPaterna');
            familiarKeys.push('abuelaMaterna');
          }
        }

        // Valor por defecto por si no se especifica el abuelo/abuela
        if (familiarKeys.length === 0) {
          familiarKeys.push('abueloPaterno');
        }

        const hasDiabetes = text.includes('diabet') || text.includes('azucar') || text.includes('azúcar');
        const hasHipertension = text.includes('hiperten') || text.includes('presion') || text.includes('presión');
        const hasCancer = text.includes('cancer') || text.includes('cáncer') || text.includes('tumor') || text.includes('oncolog') || text.includes('oncológ');

        familiarKeys.forEach(familiarKey => {
          handleFamiliarChange(familiarKey, 'vivoSano', false);
          handleFamiliarChange(familiarKey, 'finado', false);
          
          if (hasDiabetes) handleCondicionChange(familiarKey, 'diabetesMellitus', true);
          if (hasHipertension) handleCondicionChange(familiarKey, 'hipertensionArterial', true);
          if (hasCancer) handleCondicionChange(familiarKey, 'cancer', true);
          
          handleCondicionChange(familiarKey, 'otras', answer.toString());
        });
      }
    }
    else if (currentSectionId === 'noPatologicos') {
      if (qId === 'nopat_vivienda') {
        const servs = answer === 'completos' ? ['agua', 'luz', 'drenaje', 'transporte', 'internet', 'gas'] : ['agua'];
        handleAntecedenteNoPatologicoChange('servicios', servs);
      }
      if (qId === 'nopat_mascotas') {
        handleAntecedenteNoPatologicoChange('mascotas', answer === 'si' ? 'dentro' : 'no');
      }
      if (qId === 'nopat_mascotas_detalle') {
        // Guardaremos temporalmente el detalle sobreescribiendo si es "patio" o "dentro"
        if (answer.toString().toLowerCase().includes('patio') || answer.toString().toLowerCase().includes('fuera')) {
          handleAntecedenteNoPatologicoChange('mascotas', 'patio');
        } else {
          handleAntecedenteNoPatologicoChange('mascotas', 'dentro');
        }
      }
      if (qId === 'nopat_alimentacion') {
        let dietaVal = [];
        if (answer === 'adecuada') dietaVal = ['frutas y verduras', 'carnes y proteínas'];
        else if (answer === 'cariogenica') dietaVal = ['alimentos procesados', 'dulces y azúcares'];
        else dietaVal = ['alimentos procesados'];
        handleAntecedenteNoPatologicoChange('alimentosConsumidos', dietaVal);
      }
      if (qId === 'nopat_cepillado') {
        let text = answer === '3' ? 'después de cada comida' : answer === '2' ? 'dos veces al día' : answer === '1' ? 'una vez al día' : 'ocasional';
        handleAntecedenteNoPatologicoChange('frecuenciaCepillado', text);
      }
      if (qId === 'nopat_auxiliares') {
        let aux = [];
        if (answer === 'hilo' || answer === 'ambos') aux.push('hilo dental');
        if (answer === 'enjuague' || answer === 'ambos') aux.push('enjuague bucal');
        if (answer === 'no') aux.push('no auxiliares');
        handleAntecedenteNoPatologicoChange('auxiliaresBucales', aux);
      }
    }
    else if (currentSectionId === 'patologicos') {
      // --- Sistémicas ---
      if (qId === 'enfermedades_sistemicas') {
        if (answer === 'false') {
           handleAntecedentePatologicoChange('sinPatologia', true);
        } else {
           handleAntecedentePatologicoChange('sinPatologia', false);
        }
      }
      if (qId === 'enfermedades_cuales') {
         handleAntecedentePatologicoChange('otrosPadecimientos', { ninguna: false, otra: true, otraDescripcion: answer.toString() });
      }
      // --- Alergias ---
      if (qId === 'alergias_general') {
         if (answer === 'false') {
             handleAntecedenteAlergicoChange('tiposAlergias.medicamentos', false);
             handleAntecedenteAlergicoChange('tiposAlergias.alimentos', false);
             handleAntecedenteAlergicoChange('tiposAlergias.ambiente', false);
             handleAntecedenteAlergicoChange('cualesAlergias', '');
             handleAntecedenteAlergicoChange('especificacionAlergias', '');
         }
      }
      if (qId === 'alergias_cuales') {
         handleAntecedenteAlergicoChange('tiposAlergias.medicamentos', true); // Se asume medicamento por defecto si escribe algo genérico, la redacción se ajustará
         handleAntecedenteAlergicoChange('cualesAlergias', answer.toString());
         handleAntecedenteAlergicoChange('especificacionAlergias', 'Reacción alérgica documentada por el paciente');
      }
      // --- Quirúrgicos / Hospitalizaciones ---
      if (qId === 'quirurgicos_general') {
         handleAntecedenteQuirurgicoChange('sinQuirurgicos', answer === 'false');
      }
      if (qId === 'quirurgicos_cuales') {
         handleAntecedenteQuirurgicoChange('cirugiasRealizadas', [{
           tipo: answer.toString(),
           fecha: 'Referida en interrogatorio',
           motivo: 'Procedimiento quirúrgico/hospitalización'
         }]);
      }
      // --- Hemorrágicos ---
      if (qId === 'hemorragicos_general') {
         if (answer === 'false') {
             handleAntecedenteHemorragicoChange('sangradoProlongado', false);
             handleAntecedenteHemorragicoChange('transfusionPrevia', false);
         } else {
             handleAntecedenteHemorragicoChange('sangradoProlongado', true);
         }
      }
      if (qId === 'hemorragicos_cuales') {
         handleAntecedenteHemorragicoChange('transfusionPrevia', true);
         handleAntecedenteHemorragicoChange('motivoTransfusion', answer.toString());
         handleAntecedenteHemorragicoChange('fechaTransfusion', new Date().toISOString());
      }
      // --- Adicciones ---
      if (qId === 'adicciones_general') {
        if (answer === 'false') {
           handleAntecedenteAlergicoChange('adicciones.tabaco', false);
           handleAntecedenteAlergicoChange('adicciones.alcohol', false);
           handleAntecedenteAlergicoChange('adicciones.drogas', false);
           handleAntecedenteAlergicoChange('detallesAdicciones', '');
        }
      }
      if (qId === 'adicciones_cuales') {
        const text = answer.toString().toLowerCase();
        handleAntecedenteAlergicoChange('adicciones.tabaco', text.includes('tabac') || text.includes('cigarr') || text.includes('fuma'));
        handleAntecedenteAlergicoChange('adicciones.alcohol', text.includes('alcohol') || text.includes('toma') || text.includes('social') || text.includes('cerveza'));
        handleAntecedenteAlergicoChange('detallesAdicciones', answer.toString());
      }

      // --- Gineco-Obstétricos (Mapeo de respuestas de la CLI) ---
      if (qId === 'go_embarazo') {
        const isEmbarazada = answer === 'true';
        if (isEmbarazada) {
          handleAntecedenteGinecoObstetricoChange('complicaciones', 'Embarazo activo');
        }
      }
      if (qId === 'go_meses') {
        handleAntecedenteGinecoObstetricoChange('complicaciones', `Embarazo activo de ${answer.toString()}`);
      }
      if (qId === 'go_lactancia') {
        if (answer === 'true') {
          handleAntecedenteGinecoObstetricoChange('complicaciones', 'Lactancia activa');
        }
      }
      if (qId === 'go_anticonceptivos') {
        if (answer === 'true') {
          handleAntecedenteGinecoObstetricoChange('complicaciones', 'Uso de anticonceptivos hormonales');
        }
      }
      if (qId === 'go_complicaciones_detalle') {
        handleAntecedenteGinecoObstetricoChange('complicaciones', answer.toString());
      }
      if (qId === 'go_formula') {
        // Parsear fórmula obstétrica si es ingresada en formato G1 P0 C0 A0
        const str = answer.toString().toUpperCase();
        const gMatch = str.match(/G\s*(\d+)/);
        const pMatch = str.match(/P\s*(\d+)/);
        const cMatch = str.match(/C\s*(\d+)/);
        const aMatch = str.match(/A\s*(\d+)/);
        if (gMatch) handleAntecedenteGinecoObstetricoChange('embarazos', parseInt(gMatch[1], 10));
        if (pMatch) handleAntecedenteGinecoObstetricoChange('partos', parseInt(pMatch[1], 10));
        if (cMatch) handleAntecedenteGinecoObstetricoChange('cesareas', parseInt(cMatch[1], 10));
        if (aMatch) handleAntecedenteGinecoObstetricoChange('abortos', parseInt(aMatch[1], 10));
      }

      // --- Interrogatorio por Sistemas ---
      if (qId === 'sistemas_alteracion') {
        const isSano = answer === 'no';
        if (isSano) {
          handleInterrogatorioChange('digestivo', 'Sin sintomatología digestiva reportada. Masticación y deglución normales.');
          handleInterrogatorioChange('respiratorio', 'Sin sintomatología respiratoria. Respiración de tipo costal/abdominal normal.');
          handleInterrogatorioChange('cardiovascular', 'Sin sintomatología cardiovascular. Niega disnea, dolor torácico o palpitaciones.');
          handleInterrogatorioChange('genitoUrinario', 'Sin sintomatología genitourinaria.');
          handleInterrogatorioChange('endocrino', 'Sin sintomatología endocrina o alteraciones hormonales.');
          handleInterrogatorioChange('tegumentario', 'Piel y anexos normales, hidratados y sin lesiones evidentes.');
          handleInterrogatorioChange('musculoEsqueletico', 'Sistema musculoesquelético íntegro y funcional, sin limitaciones de movilidad.');
          handleInterrogatorioChange('nervioso', 'Sistema nervioso íntegro, alerta y orientado en tres esferas.');
        }
      }
      if (qId === 'sistema_afectado') {
        const sys = answer.toString();
        setSistemaAfectadoActivo(sys);
        // Inicializamos los demás como negativos para que no queden vacíos
        const depts = ['cardiovascular', 'digestivo', 'respiratorio', 'nervioso', 'genitoUrinario', 'endocrino', 'tegumentario', 'musculoEsqueletico'];
        depts.forEach(s => {
          if (s !== sys) {
            handleInterrogatorioChange(s, 'Sin sintomatología patológica activa.');
          }
        });
      }
      if (qId === 'sistemas_detalles') {
        handleInterrogatorioChange(sistemaAfectadoActivo, answer.toString());
      }
    }
    else if (currentSectionId === 'exploracionFisica') {
      if (qId === 'signos_vitales_normales') {
        if (answer === 'si') {
          handleExploracionFisicaChange('signosVitales', { 
            ...formData.exploracionFisica.signosVitales, 
            ta: '120/80', fc: '80', temperatura: '36.5', fr: '16' 
          });
        }
      }
      if (qId === 'signos_vitales_variaciones') {
        // En caso de variaciones dictadas, las alojamos en 'ta' como texto crudo para que el doctor no pierda la info 
        // y pueda acomodar los valores exactos en los inputs de la UI.
        handleExploracionFisicaChange('signosVitales', { 
          ...formData.exploracionFisica.signosVitales, 
          ta: answer.toString() 
        });
      }
      if (qId === 'sinHallazgosFisicos') {
        const isSano = answer === 'true';
        handleExamenCabezaChange('sinHallazgos', isSano);
        handleArticulacionCraneomandibularChange('ruidoArticular', 'Ninguno');
        handleArticulacionCraneomandibularChange('dolor', false);
        handleExamenCuelloChange('sinHallazgos', isSano);
      }
      if (qId === 'cabeza_hallazgos') handleExamenCabezaChange('sinHallazgos', answer === 'normal');
      if (qId === 'cabeza_detalles') handleExamenCabezaChange('otrosHallazgos', answer.toString());
      if (qId === 'atm_ruidos') handleArticulacionCraneomandibularChange('ruidoArticular', answer === 'true' ? 'Chasquidos' : 'Ninguno');
      if (qId === 'atm_dolor') handleArticulacionCraneomandibularChange('dolor', answer === 'true');
      if (qId === 'atm_observaciones') handleArticulacionCraneomandibularChange('otrasObservaciones', answer.toString());
      if (qId === 'cuello_normal') handleExamenCuelloChange('sinHallazgos', answer === 'normal');
      if (qId === 'cuello_detalles') {
        handleExamenCuelloChange('cervicales', { palpacion: 'se_palpan', observaciones: answer.toString() });
      }
    }
    else if (currentSectionId === 'odontograma') {
      if (qId === 'sinHallazgosDentales') {
        const isSano = answer === 'true';
        handleExamenIntrabucalChange('sinHallazgos', isSano);
        handleGlandulasSalivalesChange('sinHallazgos', isSano);
        handleOclusionChange('clasificacionAngle', 'Clase I');
        handleOclusionChange('mordidaCruzada', false);
        handleOclusionChange('mordidaAbierta', false);
        handleRelacionDientesChange('apiñamiento', false);
        handleRelacionDientesChange('diastemas', false);
        handleLineaMediaChange('coincidente', true);
        handleFrenillosChange('sinHallazgos', isSano);
      }
      if (qId === 'intrabucal_normal') handleExamenIntrabucalChange('sinHallazgos', answer === 'normal');
      if (qId === 'intrabucal_detalles') {
        handleExamenIntrabucalChange('mejillas', { sinHallazgos: false, observaciones: answer.toString() });
      }
      if (qId === 'odontograma_sano') {
        if (answer === 'sano') {
          handleOdontogramaChange(999, 'sano');
        }
      }
      if (qId === 'odontograma_detalles') {
        handleOdontogramaChange(999, 'caries');
      }
      if (qId === 'salivales_normal') handleGlandulasSalivalesChange('sinHallazgos', answer === 'normal');
      if (qId === 'salivales_detalles') handleGlandulasSalivalesChange('observaciones', answer.toString());
      if (qId === 'alteraciones_oclusales') {
        const isSano = answer === 'normal';
        // Si dice que es normal, reseteamos todos a sus valores ideales
        if (isSano) {
          handleOclusionChange('clasificacionAngle', 'Clase I');
          handleOclusionChange('mordidaCruzada', false);
          handleOclusionChange('mordidaAbierta', false);
          handleRelacionDientesChange('apiñamiento', false);
          handleRelacionDientesChange('diastemas', false);
          handleLineaMediaChange('coincidente', true);
          handleFrenillosChange('sinHallazgos', true);
        } else {
          // Si hay hallazgos, quitamos el status de 'sinHallazgos' general
          handleExamenIntrabucalChange('sinHallazgos', false);
        }
      }
      if (qId === 'alteraciones_oclusales_detalles') {
        // Volcamos todo el texto crudo en observaciones de la oclusión
        handleOclusionChange('observaciones', answer.toString());
      }
    }

    submitAnswer(answer);
  };

  React.useEffect(() => {
    const store = useCliStore.getState();
    store.setExpedienteMode(true);
    store.setSecciones(seccionesActivas);
    store.setOnCambiarSeccion((seccionId: string) => {
      onSectionActive(seccionId);
    });
    return () => {
      store.setExpedienteMode(false);
      store.setSecciones([]);
      store.setOnCambiarSeccion(() => {});
    };
  }, [seccionesActivas]);

  React.useEffect(() => {
    const store = useCliStore.getState();
    store.setSeccionActiva(currentSectionId);
  }, [currentSectionId]);

  React.useEffect(() => {
    const store = useCliStore.getState();
    store.setCurrentQuestion(currentQuestion, handleCLISubmit, cliGoBack);
    store.setProgreso(currentIndex, totalQuestions);
  }, [currentQuestion, currentIndex, totalQuestions, cliGoBack]);

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
      case 'patologicos':
        return (
          <div className="space-y-6 max-h-[85vh] overflow-y-auto pr-2 pb-12 scrollbar-none">
            <PatologicosCard
              formData={formData}
              handleAntecedentePatologicoChange={handleAntecedentePatologicoChange}
              {...commonProps}
            />
            <AlergicosCard
              formData={formData}
              handleAntecedenteAlergicoChange={handleAntecedenteAlergicoChange}
              {...commonProps}
            />
            <QuirurgicosCard
              formData={formData}
              handleAntecedenteQuirurgicoChange={handleAntecedenteQuirurgicoChange}
              {...commonProps}
            />
            <HemorragicosCard
              formData={formData}
              handleAntecedenteHemorragicoChange={handleAntecedenteHemorragicoChange}
              {...commonProps}
            />
            {esMujer && (
              <GinecoObstetricosCard
                formData={formData}
                handleAntecedenteGinecoObstetricoChange={handleAntecedenteGinecoObstetricoChange}
                {...commonProps}
              />
            )}
          </div>
        );
      case 'noPatologicos':
        return <NoPatologicosCard
          formData={formData}
          handleAntecedenteNoPatologicoChange={handleAntecedenteChange}
          toggleService={toggleService}
          {...commonProps}
        />;
      case 'exploracionFisica':
        return (
          <div className="space-y-6 max-h-[85vh] overflow-y-auto pr-2 pb-12 scrollbar-none">
            <ExploracionFisicaCard
              formData={formData}
              handleExploracionFisicaChange={handleExploracionFisicaChange}
              {...commonProps}
            />
            <CabezaCard
              formData={formData}
              handleExamenCabezaChange={handleExamenCabezaChange}
              {...commonProps}
            />
            <ATMCard
              formData={formData}
              handleArticulacionCraneomandibularChange={handleArticulacionCraneomandibularChange}
              {...commonProps}
            />
            <CuelloCard
              formData={formData}
              handleExamenCuelloChange={handleExamenCuelloChange}
              {...commonProps}
            />
          </div>
        );
      case 'odontograma':
        return (
          <div className="space-y-6 max-h-[85vh] overflow-y-auto pr-2 pb-12 scrollbar-none">
            <Odontograma
              formData={formData}
              handleOdontogramaChange={handleOdontogramaChange}
              onRedaccionGenerada={(content: string) => handleContentGenerated('odontograma', content)}
            />
            <IntrabucalCard
              formData={formData}
              handleExamenIntrabucalChange={handleExamenIntrabucalChange}
              {...commonProps}
            />
            <SalivalesCard
              formData={formData}
              handleGlandulasSalivalesChange={handleGlandulasSalivalesChange}
              {...commonProps}
            />
            <OclusionCard
              formData={formData}
              handleOclusionChange={handleOclusionChange}
              {...commonProps}
            />
            <RelacionDientesCard
              formData={formData}
              handleRelacionDientesChange={handleRelacionDientesChange}
              {...commonProps}
            />
            <LineaMediaCard
              formData={formData}
              handleLineaMediaChange={handleLineaMediaChange}
              {...commonProps}
            />
            <FrenillosCard
              formData={formData}
              handleFrenillosChange={handleFrenillosChange}
              {...commonProps}
            />
          </div>
        );
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
    const sectionContainer = document.querySelector(`div[data-section="${currentSectionId}"]`);

    if (sectionContainer) {
      const buttons = Array.from(sectionContainer.querySelectorAll('button'));
      const generateButtons = buttons.filter(btn => {
        const text = btn.textContent?.toLowerCase() || '';
        return btn.classList.contains('data-trigger-generation') || 
               text.includes('generar redacción') || 
               text.includes('redactar') || 
               text.includes('generar') || 
               text.includes('ver redacción');
      });

      if (generateButtons.length > 0) {
        generateButtons.forEach(btn => {
          (btn as HTMLButtonElement).click();
        });
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
