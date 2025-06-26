
import { Toaster } from "@/components/ui/toaster";
import PadecimientoActual from './historia-clinica/PadecimientoActual';
import AntecedentesHeredoFamiliares from './historia-clinica/AntecedentesHeredoFamiliares';
import AntecedentesPersonalesNoPatologicos from './historia-clinica/AntecedentesPersonalesNoPatologicos';
import AntecedentesPersonalesPatologicos from './historia-clinica/AntecedentesPersonalesPatologicos';
import AntecedentesAlergicos from './historia-clinica/AntecedentesAlergicos';
import AntecedentesQuirurgicos from './historia-clinica/AntecedentesQuirurgicos';
import AntecedentesHemorragicos from './historia-clinica/AntecedentesHemorragicos';
import AntecedentesGinecoObstetricos from './historia-clinica/AntecedentesGinecoObstetricos';
import InterrogatorioSistemas from './historia-clinica/InterrogatorioSistemas';
import ExploracionFisica from './historia-clinica/ExploracionFisica';
import ExamenCabeza from './historia-clinica/ExamenCabeza';
import ExamenCuello from './historia-clinica/ExamenCuello';
import ExamenIntrabucal from './historia-clinica/ExamenIntrabucal';
import GlandulasSalivales from './historia-clinica/GlandulasSalivales';
import Oclusion from './historia-clinica/Oclusion';
import RelacionDientes from './historia-clinica/RelacionDientes';
import LineaMedia from './historia-clinica/LineaMedia';
import Frenillos from './historia-clinica/Frenillos';
import Diagnostico from './historia-clinica/Diagnostico';
import Pronostico from './historia-clinica/Pronostico';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useTheme } from '@/hooks/use-theme';
import { Loader2, X, Save, User, FileText, Search } from "lucide-react";
import { useHistoriaClinica } from '@/hooks/useHistoriaClinica';
import FormulariosSidebar from './historia-clinica/FormulariosSidebar';
import { useState, useEffect, useRef } from 'react';
import { toast } from "@/hooks/use-toast";
import ConfirmationAlert from './historia-clinica/ConfirmationAlert';
import { validatePadecimientoActual, validateAntecedentesHeredoFamiliares, validateAntecedentesPersonalesNoPatologicos, validateAntecedentesPersonalesPatologicos } from '@/utils/formValidation';
import { generatePDF } from '@/utils/pdfGenerator';
import LoadingOverlay from './historia-clinica/LoadingOverlay';
import { useAnalysisMode } from '@/contexts/AnalysisModeContext';
import { motion, AnimatePresence } from 'framer-motion';
import { TypewriterEffect } from './ui/TypewriterEffect';
import { supabase } from '@/integrations/supabase/client';

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  isTyping?: boolean;
}

interface ResponsePopupProps {
  message: ChatMessage;
  onClose: () => void;
}

function ResponsePopup({
  message,
  onClose
}: ResponsePopupProps) {
  return <>
      <motion.div initial={{
      opacity: 0,
      y: 20,
      scale: 0.95
    }} animate={{
      opacity: 1,
      y: 0,
      scale: 1
    }} exit={{
      opacity: 0,
      y: 20,
      scale: 0.95
    }} className="fixed top-20 right-4 z-[9999] max-w-md">
        <div className="backdrop-blur-md border border-gray-600 rounded-2xl p-4 shadow-2xl bg-gray-800/90">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <img src="/lovable-uploads/8d0bcc46-2c73-4647-8420-9aa25c312389.png" alt="DentaxyGPT" className="h-6 w-6" />
              <span className="text-white text-sm font-medium">DentaxyGPT</span>
            </div>
            <button onClick={onClose} className="text-gray-300 hover:text-white transition-colors">
              <X className="w-4 h-4" />
            </button>
          </div>
          
          <div className="text-white text-sm">
            {message.isTyping ? <TypewriterEffect text={message.content} speed={25} /> : <p>{message.content}</p>}
          </div>
          
          <div className="text-gray-300 text-xs mt-2">
            {message.timestamp.toLocaleTimeString()}
          </div>
        </div>
      </motion.div>
    </>;
}

const DENTAXY_SYSTEM_PROMPT = `Eres DentaxyGPT, un asistente especializado en odontología que ayuda a explicar términos médicos dentales de manera clara y concisa. Tu objetivo es proporcionar definiciones precisas y útiles para estudiantes y profesionales de la odontología.

Cuando recibas un término médico dental:
1. Proporciona una definición clara y concisa
2. Explica su relevancia en el contexto odontológico
3. Si es apropiado, menciona sinónimos o términos relacionados
4. Mantén un tono profesional pero accesible
5. Limita tu respuesta a máximo 150 palabras

Si el término no está relacionado con odontología, indica que te especializas en términos dentales y sugiere reformular la consulta.`;

const HistoriaClinica = () => {
  const { theme } = useTheme();
  const [pacienteActual, setPacienteActual] = useState<string>('');
  const [nombrePaciente, setNombrePaciente] = useState<string>('');
  const [alertOpen, setAlertOpen] = useState(false);
  const [missingFields, setMissingFields] = useState<string[]>([]);
  const [esMujer, setEsMujer] = useState<boolean>(false);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const [pdfGenerationProgress, setPdfGenerationProgress] = useState(0);
  const [activeResponse, setActiveResponse] = useState<ChatMessage | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const pdfSectionsRef = useRef<{ [key: string]: string; }>({});
  const {
    isAnalysisMode,
    setAnalysisMode,
    selectedText,
    setSelectedText,
    selectedPosition,
    setSelectedPosition
  } = useAnalysisMode();
  const {
    formData,
    isGenerating,
    handleInputChange,
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
    generarResumen,
    guardarFormulario,
    cargarFormulario,
    resetFormulario
  } = useHistoriaClinica();

  const handleSearch = async (searchText: string) => {
    setIsSearching(true);
    try {
      console.log('Iniciando búsqueda:', searchText);
      
      const { data, error } = await supabase.functions.invoke('chat', {
        body: {
          message: searchText,
          systemPrompt: DENTAXY_SYSTEM_PROMPT
        }
      });

      if (error) {
        console.error('Supabase function error:', error);
        throw new Error('Error en la comunicación con el servidor');
      }

      console.log('Respuesta recibida:', data);

      const newMessage: ChatMessage = {
        role: 'assistant',
        content: data.response || 'Lo siento, no pude procesar tu consulta.',
        timestamp: new Date(),
        isTyping: true
      };
      setActiveResponse(newMessage);
    } catch (error) {
      console.error('Error:', error);
      const errorMessage: ChatMessage = {
        role: 'assistant',
        content: 'Lo siento, ocurrió un error al procesar tu consulta. Por favor, intenta nuevamente.',
        timestamp: new Date(),
        isTyping: false
      };
      setActiveResponse(errorMessage);
    } finally {
      setIsSearching(false);
      setSelectedText('');
      setSelectedPosition(null);
    }
  };

  useEffect(() => {
    const handleTextSelection = (event: MouseEvent) => {
      if (!isAnalysisMode) return;
      const selection = window.getSelection();
      const selectedTextContent = selection?.toString().trim();
      if (selectedTextContent && selectedTextContent.length > 2) {
        setSelectedText(selectedTextContent);
        setSelectedPosition({
          x: event.clientX,
          y: event.clientY
        });
      }
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isAnalysisMode) {
        setAnalysisMode(false);
        setSelectedText('');
        setSelectedPosition(null);
      }
    };
    if (isAnalysisMode) {
      document.addEventListener('mouseup', handleTextSelection);
      document.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.removeEventListener('mouseup', handleTextSelection);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isAnalysisMode, setAnalysisMode, setSelectedText, setSelectedPosition]);

  useEffect(() => {
    if (pacienteActual) {
      guardarFormulario(formData, pacienteActual);
    }
  }, [formData, pacienteActual, guardarFormulario]);

  const closeResponse = () => {
    setActiveResponse(null);
  };

  return (
    <div className={`${theme} min-h-screen w-full flex relative`}>
      <FormulariosSidebar 
        onCargarFormulario={(data, nombre) => {
          cargarFormulario(data);
          setPacienteActual(nombre);
          setNombrePaciente(nombre);
        }} 
        onGuardarFormulario={nombre => {
          guardarFormulario(formData, nombre);
          setPacienteActual(nombre);
        }} 
        onCerrarFormulario={() => {
          setPacienteActual('');
          setNombrePaciente('');
          cargarFormulario(null);
        }} 
        onResetFormulario={() => {
          setPacienteActual('');
          resetFormulario();
        }} 
        pacienteActual={pacienteActual} 
      />
      
      <div className={`${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'} flex-1 py-3 sm:py-12 px-1 sm:px-4 lg:px-8 transition-colors duration-200`}>
        <div className="max-w-5xl mx-auto space-y-3 sm:space-y-8">
          <div className="text-center">
            {/* Mobile optimized title */}
            <h1 className="text-lg sm:text-3xl md:text-4xl font-bold mb-1 sm:mb-2">Formulario IA</h1>
            <p className="text-[10px] sm:text-sm text-gray-500 mb-2 sm:mb-6 px-1">
              (llena el formulario y deja que nuestra inteligencia artificial se encargue de hacer la redacción)
            </p>
            
            {/* Mobile optimized patient input */}
            <div id="patient-name-input" className="max-w-lg mx-auto mb-1 sm:mb-2 sticky top-2 sm:top-4 z-30 backdrop-blur-sm shadow-sm border border-gray-200 p-1 sm:p-4 py-1 sm:py-[5px] px-2 sm:px-[20px] rounded-xl sm:rounded-2xl bg-slate-50">
              <div className="flex items-center gap-1 sm:gap-3">
                <div className="relative flex-1">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-1 sm:pl-3 pointer-events-none">
                    <User className="h-3 w-3 sm:h-4 sm:w-4 text-gray-400" />
                  </div>
                  <Input 
                    value={nombrePaciente} 
                    onChange={e => setNombrePaciente(e.target.value)} 
                    placeholder="Nombre del paciente" 
                    className="pl-5 sm:pl-10 border-0 bg-transparent focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0 text-xs sm:text-base h-6 sm:h-auto" 
                  />
                </div>
                <Button 
                  onClick={() => {
                    if (!nombrePaciente.trim()) {
                      toast({
                        title: "Error",
                        description: "Por favor ingrese el nombre del paciente",
                        variant: "destructive"
                      });
                      return;
                    }
                    guardarFormulario(formData, nombrePaciente);
                    setPacienteActual(nombrePaciente);
                    toast({
                      title: "Formulario guardado",
                      description: `El formulario de ${nombrePaciente} ha sido guardado exitosamente.`
                    });
                  }} 
                  disabled={!nombrePaciente.trim()} 
                  className="bg-blue-500 hover:bg-blue-600 text-white rounded-lg sm:rounded-full px-2 sm:px-4 py-1 sm:py-2 flex items-center gap-1 transition-all duration-200 h-6 sm:h-auto"
                >
                  <Save className="h-2 w-2 sm:h-4 sm:w-4" />
                  <span className="text-[10px] sm:text-sm font-medium">Guardar</span>
                </Button>
              </div>
            </div>

            {pacienteActual && <div className="flex items-center justify-center gap-1 sm:gap-2 mb-2 sm:mb-6">
                <div className="text-[10px] sm:text-xs text-blue-500 dark:text-blue-400 font-medium">
                  Formulario actual: {pacienteActual}
                </div>
                <button onClick={() => {
                  setPacienteActual('');
                  resetFormulario();
                }} className="text-red-500 hover:text-red-700 transition-colors p-0.5 sm:p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700" aria-label="Resetear formulario">
                  <X className="w-2 h-2 sm:w-3 sm:h-3" />
                </button>
              </div>}
            
            {/* Mobile optimized gender selection */}
            <div className="flex items-center justify-center mb-2 sm:mb-6 gap-1 sm:gap-4">
              <span className="text-[10px] sm:text-sm text-gray-600 dark:text-gray-400">Género del paciente:</span>
              <div className="flex gap-1 sm:gap-2">
                <button 
                  className={`px-2 sm:px-4 py-0.5 sm:py-2 rounded-md text-[10px] sm:text-sm transition-colors ${!esMujer ? 'bg-[#2ecc71] text-white' : 'bg-gray-100 dark:bg-gray-700'}`} 
                  onClick={() => setEsMujer(false)}
                >
                  Hombre
                </button>
                <button 
                  className={`px-2 sm:px-4 py-0.5 sm:py-2 rounded-md text-[10px] sm:text-sm transition-colors ${esMujer ? 'bg-[#9370DB] text-white' : 'bg-gray-100 dark:bg-gray-700'}`} 
                  onClick={() => setEsMujer(true)}
                >
                  Mujer
                </button>
              </div>
            </div>
          </div>

          <div className="space-y-2 sm:space-y-6">
            <div data-section-redaction="true" data-section-name="padecimientoActual">
              <PadecimientoActual formData={formData} handlePadecimientoChange={handlePadecimientoChange} handleDolorChange={handleDolorChange} handleSinSintomasChange={handleSinSintomasChange} />
            </div>
            
            <div data-section-redaction="true" data-section-name="antecedentesHeredoFamiliares">
              <AntecedentesHeredoFamiliares formData={formData} handleFamiliarChange={handleFamiliarChange} handleCondicionChange={handleCondicionChange} />
            </div>

            <div data-section-redaction="true" data-section-name="antecedentesPersonalesNoPatologicos">
              <AntecedentesPersonalesNoPatologicos formData={formData} handleAntecedenteChange={handleAntecedenteChange} toggleService={toggleService} />
            </div>
            
            <div data-section-redaction="true" data-section-name="antecedentesPersonalesPatologicos">
              <AntecedentesPersonalesPatologicos formData={formData} handleAntecedentePatologicoChange={handleAntecedentePatologicoChange} />
            </div>
            
            <div data-section-redaction="true" data-section-name="antecedentesAlergicos">
              <AntecedentesAlergicos formData={formData} handleAntecedenteAlergicoChange={handleAntecedenteAlergicoChange} />
            </div>

            <div data-section-redaction="true" data-section-name="antecedentesQuirurgicos">
              <AntecedentesQuirurgicos formData={formData} handleAntecedenteQuirurgicoChange={handleAntecedenteQuirurgicoChange} />
            </div>

            <div data-section-redaction="true" data-section-name="antecedentesHemorragicos">
              <AntecedentesHemorragicos formData={formData} handleAntecedenteHemorragicoChange={handleAntecedenteHemorragicoChange} />
            </div>

            {esMujer && <div data-section-redaction="true" data-section-name="antecedentesGinecoObstetricos">
                <AntecedentesGinecoObstetricos formData={formData} handleAntecedenteGinecoObstetricoChange={handleAntecedenteGinecoObstetricoChange} />
              </div>}

            <div data-section-redaction="true" data-section-name="interrogatorioSistemas">
              <InterrogatorioSistemas formData={formData} handleInterrogatorioChange={handleInterrogatorioChange} />
            </div>

            <div data-section-redaction="true" data-section-name="exploracionFisica">
              <ExploracionFisica formData={formData} handleExploracionFisicaChange={handleExploracionFisicaChange} />
            </div>

            <div data-section-redaction="true" data-section-name="examenCabeza">
              <ExamenCabeza formData={formData} handleExamenCabezaChange={handleExamenCabezaChange} />
            </div>
            
            <div data-section-redaction="true" data-section-name="examenCuello">
              <ExamenCuello formData={formData} handleExamenCuelloChange={handleExamenCuelloChange} />
            </div>
            
            <div data-section-redaction="true" data-section-name="examenIntrabucal">
              <ExamenIntrabucal 
                formData={formData} 
                handleExamenIntrabucalChange={handleExamenIntrabucalChange} 
              />
            </div>
            
            <div data-section-redaction="true" data-section-name="glandulasSalivales">
              <GlandulasSalivales formData={formData} handleGlandulasSalivalesChange={handleGlandulasSalivalesChange} />
            </div>
            
            <div data-section-redaction="true" data-section-name="oclusion">
              <Oclusion formData={formData} handleOclusionChange={handleOclusionChange} />
            </div>
            
            <div data-section-redaction="true" data-section-name="relacionDientes">
              <RelacionDientes formData={formData} handleRelacionDientesChange={handleRelacionDientesChange} />
            </div>
            
            <div data-section-redaction="true" data-section-name="lineaMedia">
              <LineaMedia formData={formData} handleLineaMediaChange={handleLineaMediaChange} />
            </div>
            
            <div data-section-redaction="true" data-section-name="frenillos">
              <Frenillos formData={formData} handleFrenillosChange={handleFrenillosChange} />
            </div>
            
            <div data-section-redaction="true" data-section-name="diagnostico">
              <Diagnostico formData={formData} handleDiagnosticoChange={handleDiagnosticoChange} />
            </div>
            
            <div data-section-redaction="true" data-section-name="pronostico">
              <Pronostico formData={formData} handlePronosticoChange={handlePronosticoChange} />
            </div>

            {/* Mobile optimized PDF button */}
            <div className="flex justify-center pt-2 sm:pt-6">
              <Button onClick={() => {
                const missing = validatePadecimientoActual(formData).concat(
                  validateAntecedentesHeredoFamiliares(formData),
                  validateAntecedentesPersonalesNoPatologicos(formData),
                  validateAntecedentesPersonalesPatologicos(formData)
                );
                
                if (missing.length > 0) {
                  setMissingFields(missing);
                  setAlertOpen(true);
                } else {
                  // generatePDFDocument();
                }
              }} disabled={isGeneratingPDF} className="text-slate-50 bg-[#ff0000] hover:bg-[#cc0000] px-3 sm:px-6 py-2 sm:py-3 rounded-lg shadow-lg transition-all duration-300 transform hover:scale-105 text-xs sm:text-base font-normal">
                {isGeneratingPDF ? <>
                    <Loader2 className="mr-1 sm:mr-2 h-3 w-3 sm:h-5 sm:w-5 animate-spin" />
                    Generando PDF...
                  </> : <>
                    <FileText className="mr-1 sm:mr-2 h-3 w-3 sm:h-5 sm:w-5" />
                    Generar Historia Clínica en PDF
                  </>}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Indicador de modo análisis */}
      {isAnalysisMode && <motion.div initial={{
      opacity: 0,
      y: -20
    }} animate={{
      opacity: 1,
      y: 0
    }} exit={{
      opacity: 0,
      y: -20
    }} className="fixed top-4 left-1/2 transform -translate-x-1/2 z-[9999] bg-blue-600 text-white px-4 py-2 rounded-lg shadow-lg flex items-center gap-2">
          <span className="text-sm font-medium">🔍 Modo Análisis Activo - Selecciona cualquier término</span>
          <button onClick={() => setAnalysisMode(false)} className="text-white hover:text-gray-200 transition-colors">
            <X className="w-4 h-4" />
          </button>
        </motion.div>}

      {/* Text Selection Search Icon */}
      {selectedText && selectedPosition && isAnalysisMode && <motion.div initial={{
      opacity: 0,
      scale: 0.95
    }} animate={{
      opacity: 1,
      scale: 1
    }} className="fixed z-[10000] pointer-events-auto" style={{
      left: Math.min(selectedPosition.x, window.innerWidth - 60),
      top: Math.max(selectedPosition.y - 60, 60)
    }}>
          <button onClick={() => handleSearch(selectedText)} disabled={isSearching} className="w-8 h-8 bg-black hover:bg-gray-800 text-white rounded-full flex items-center justify-center shadow-xl transition-colors disabled:opacity-50">
            {isSearching ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
          </button>
        </motion.div>}
      
      <ConfirmationAlert isOpen={alertOpen} onClose={() => setAlertOpen(false)} onConfirm={() => {
      setAlertOpen(false);
      // generatePDFDocument();
    }} title="Formulario incompleto" description="Hay campos sin completar en el formulario." missingFields={missingFields} />
      
      {isGeneratingPDF && <LoadingOverlay message="Generando PDF... Por favor espere mientras procesamos todas las secciones del formulario." progress={pdfGenerationProgress} />}

      <AnimatePresence>
        {activeResponse && <ResponsePopup message={activeResponse} onClose={closeResponse} />}
      </AnimatePresence>
      
      <Toaster />
    </div>
  );
};

export default HistoriaClinica;
