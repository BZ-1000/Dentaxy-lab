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
import ArticulacionCraneomandibular from './historia-clinica/ArticulacionCraneomandibular';
import ExamenCuello from './historia-clinica/ExamenCuello';
import ExamenIntrabucal from './historia-clinica/ExamenIntrabucal';
import GlandulasSalivales from './historia-clinica/GlandulasSalivales';
import Oclusion from './historia-clinica/Oclusion';
import RelacionDientes from './historia-clinica/RelacionDientes';
import LineaMedia from './historia-clinica/LineaMedia';
import Frenillos from './historia-clinica/Frenillos';
import Diagnostico from './historia-clinica/Diagnostico';
import Pronostico from './historia-clinica/Pronostico';
import ResumenHistoriaClinica from './historia-clinica/ResumenHistoriaClinica';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useTheme } from '@/hooks/use-theme';
import { Loader2, X, Save, User, FileText } from "lucide-react";
import { useHistoriaClinica } from '@/hooks/useHistoriaClinica';
import FormulariosSidebar from './historia-clinica/FormulariosSidebar';
import { useState, useEffect, useRef } from 'react';
import { toast } from "@/hooks/use-toast";
import { getInitialFormState } from '@/utils/initialFormState';
import ConfirmationAlert from './historia-clinica/ConfirmationAlert';
import { validatePadecimientoActual, validateAntecedentesHeredoFamiliares, validateAntecedentesPersonalesNoPatologicos, validateAntecedentesPersonalesPatologicos } from '@/utils/formValidation';
import { generatePDF } from '@/utils/pdfGenerator';
import LoadingOverlay from './historia-clinica/LoadingOverlay';


const HistoriaClinica = () => {
  const {
    theme
  } = useTheme();
  const [pacienteActual, setPacienteActual] = useState<string>('');
  const [nombrePaciente, setNombrePaciente] = useState<string>('');
  const [alertOpen, setAlertOpen] = useState(false);
  const [missingFields, setMissingFields] = useState<string[]>([]);
  const [esMujer, setEsMujer] = useState<boolean>(false);
  const {
    formData,
    resumen,
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
    generarResumen,
    guardarFormulario,
    cargarFormulario,
    resetFormulario
  } = useHistoriaClinica();
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const [pdfGenerationProgress, setPdfGenerationProgress] = useState(0);
  const pdfSectionsRef = useRef<{
    [key: string]: string;
  }>({});

  useEffect(() => {
    if (pacienteActual) {
      guardarFormulario(formData, pacienteActual);
    }
  }, [formData, pacienteActual, guardarFormulario]);

  const handleLimpiarFormulario = () => {
    setPacienteActual('');
    setNombrePaciente('');
    cargarFormulario(null); // Cargar formulario vacío
  };

  const handleResetFormulario = () => {
    setPacienteActual('');
    resetFormulario();
  };

  const handleGuardarFormulario = () => {
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
  };

  const validateForm = () => {
    const padecimientoFields = validatePadecimientoActual(formData);
    const heredoFamiliaresFields = validateAntecedentesHeredoFamiliares(formData);
    const noPatologicosFields = validateAntecedentesPersonalesNoPatologicos(formData);
    const patologicosFields = validateAntecedentesPersonalesPatologicos(formData);
    const allMissingFields = [...padecimientoFields, ...heredoFamiliaresFields, ...noPatologicosFields, ...patologicosFields];
    return allMissingFields;
  };

  // Improved function to click the "Generate IA" button for a section
  const generateSectionRedaction = async (sectionElement: Element) => {
    try {
      if (!sectionElement) return false;

      // First make sure we're on the form tab
      const formTabs = sectionElement.querySelectorAll('button');
      let formTab = null;
      for (const tab of formTabs) {
        if (tab.textContent && tab.textContent.includes('Formulario')) {
          formTab = tab;
          break;
        }
      }
      if (formTab) {
        (formTab as HTMLElement).click();
        await new Promise(resolve => setTimeout(resolve, 300));
      }

      // Find and click the "Generar Redacción IA" button
      const allButtons = Array.from(sectionElement.querySelectorAll('button'));
      const generateButton = allButtons.find(button => button.textContent && (button.textContent.includes('Generar Redacción IA') || button.textContent.includes('Generar Redacción') || button.textContent.includes('Generar Informe')));
      if (!generateButton) {
        console.warn('No generate button found in section');
        return false;
      }
      console.log('Clicking generate button', generateButton.textContent);
      (generateButton as HTMLElement).click();

      // Wait for redaction to generate (4 seconds should be enough)
      await new Promise(resolve => setTimeout(resolve, 4000));

      // Switch to the redaction tab
      const redactionTabs = sectionElement.querySelectorAll('button');
      let redactionTab = null;
      for (const tab of redactionTabs) {
        if (tab.textContent && (tab.textContent.includes('Redacción IA') || tab.textContent.includes('Informe IA'))) {
          redactionTab = tab;
          break;
        }
      }
      if (redactionTab) {
        (redactionTab as HTMLElement).click();
        await new Promise(resolve => setTimeout(resolve, 300));
      }
      return true;
    } catch (error) {
      console.error('Error generating redaction:', error);
      return false;
    }
  };

  // Function to extract redaction content from a section
  const getSectionRedaction = (sectionElement: Element): string | null => {
    try {
      if (!sectionElement) return null;

      // Try to find redaction content div (with various selectors to be robust)
      const possibleContentSelectors = ['div[data-redaction-content]', '.min-h-\\[150px\\], .min-h-\\[200px\\]', 'div.bg-gray-50, div.bg-gray-900', 'div[style*="white-space: pre-wrap"]', 'div.whitespace-pre-wrap'];
      let contentElement = null;
      for (const selector of possibleContentSelectors) {
        const elements = sectionElement.querySelectorAll(selector);
        for (const el of elements) {
          if (el.textContent && el.textContent.trim().length > 10) {
            contentElement = el;
            break;
          }
        }
        if (contentElement) break;
      }

      // If still not found, try a more generic approach
      if (!contentElement) {
        const allDivs = sectionElement.querySelectorAll('div');
        for (const div of allDivs) {
          if (div.textContent && div.textContent.trim().length > 30 && (div.className.includes('bg-gray') || div.hasAttribute('data-redaction-content') || div.style.whiteSpace === 'pre-wrap')) {
            contentElement = div;
            break;
          }
        }
      }
      if (!contentElement) {
        console.warn('Could not find redaction content');
        return null;
      }

      // Get and clean up the content
      const text = contentElement.textContent || '';
      return text.trim();
    } catch (error) {
      console.error('Error extracting redaction:', error);
      return null;
    }
  };

  // Function to collect redactions from all sections
  const collectAllRedactions = async () => {
    pdfSectionsRef.current = {};

    // Define all sections we want to process
    const sectionSelectors = [{
      name: 'padecimientoActual',
      selector: '[data-section-name="padecimientoActual"]'
    }, {
      name: 'antecedentesHeredoFamiliares',
      selector: '[data-section-name="antecedentesHeredoFamiliares"]'
    }, {
      name: 'antecedentesPersonalesNoPatologicos',
      selector: '[data-section-name="antecedentesPersonalesNoPatologicos"]'
    }, {
      name: 'antecedentesPersonalesPatologicos',
      selector: '[data-section-name="antecedentesPersonalesPatologicos"]'
    }, {
      name: 'antecedentesAlergicos',
      selector: '[data-section-name="antecedentesAlergicos"]'
    }, {
      name: 'antecedentesQuirurgicos',
      selector: '[data-section-name="antecedentesQuirurgicos"]'
    }, {
      name: 'antecedentesHemorragicos',
      selector: '[data-section-name="antecedentesHemorragicos"]'
    }, {
      name: 'antecedentesGinecoObstetricos',
      selector: '[data-section-name="antecedentesGinecoObstetricos"]'
    }, {
      name: 'interrogatorioSistemas',
      selector: '[data-section-name="interrogatorioSistemas"]'
    }, {
      name: 'exploracionFisica',
      selector: '[data-section-name="exploracionFisica"]'
    }, {
      name: 'examenCabeza',
      selector: '[data-section-name="examenCabeza"]'
    }, {
      name: 'articulacionCraneomandibular',
      selector: '[data-section-name="articulacionCraneomandibular"]'
    }, {
      name: 'examenCuello',
      selector: '[data-section-name="examenCuello"]'
    }, {
      name: 'examenIntrabucal',
      selector: '[data-section-name="examenIntrabucal"]'
    }, {
      name: 'glandulasSalivales',
      selector: '[data-section-name="glandulasSalivales"]'
    }, {
      name: 'oclusion',
      selector: '[data-section-name="oclusion"]'
    }, {
      name: 'relacionDientes',
      selector: '[data-section-name="relacionDientes"]'
    }, {
      name: 'lineaMedia',
      selector: '[data-section-name="lineaMedia"]'
    }, {
      name: 'frenillos',
      selector: '[data-section-name="frenillos"]'
    }, {
      name: 'diagnostico',
      selector: '[data-section-name="diagnostico"]'
    }, {
      name: 'pronostico',
      selector: '[data-section-name="pronostico"]'
    }];

    // Total steps for progress calculation
    const totalSteps = sectionSelectors.length * 2; // *2 because we have generate and extract for each section
    let completedSteps = 0;
    for (const sectionConfig of sectionSelectors) {
      console.log(`Processing section: ${sectionConfig.name}`);

      // Find section element
      const sectionElements = document.querySelectorAll(sectionConfig.selector);
      if (sectionElements.length === 0) {
        console.warn(`Section not found: ${sectionConfig.name}`);
        completedSteps += 2; // Skip both steps for this section
        setPdfGenerationProgress(completedSteps / totalSteps * 100);
        continue;
      }
      const sectionElement = sectionElements[0];

      // Generate redaction for this section
      await generateSectionRedaction(sectionElement);

      // Update progress
      completedSteps++;
      setPdfGenerationProgress(completedSteps / totalSteps * 100);

      // Wait a moment to ensure the redaction has fully rendered
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Extract redaction content
      const content = getSectionRedaction(sectionElement);
      if (content) {
        pdfSectionsRef.current[sectionConfig.name] = content;
        console.log(`Added ${sectionConfig.name} redaction to PDF`);
      }

      // Update progress again
      completedSteps++;
      setPdfGenerationProgress(completedSteps / totalSteps * 100);
    }
    console.log("All redactions collected:", Object.keys(pdfSectionsRef.current));
    return pdfSectionsRef.current;
  };

  // Function to generate the PDF
  const generatePDFDocument = async () => {
    try {
      setIsGeneratingPDF(true);
      setPdfGenerationProgress(0);

      // Collect all redactions
      const allRedactions = await collectAllRedactions();

      // Check if we have any redactions
      if (Object.keys(allRedactions).length === 0) {
        toast({
          title: "Advertencia",
          description: "No se encontraron redacciones para incluir en el PDF. Por favor, genere al menos una redacción.",
          variant: "destructive"
        });
        setIsGeneratingPDF(false);
        return;
      }

      // Generate the PDF
      const patientName = nombrePaciente || pacienteActual || 'Paciente';
      generatePDF(formData, patientName, allRedactions);
      toast({
        title: "PDF Generado",
        description: "La Historia Clínica ha sido generada exitosamente."
      });

      // Important: We're NOT resetting the form as requested by the user
    } catch (error) {
      console.error("Error generating PDF:", error);
      toast({
        title: "Error",
        description: "No se pudo generar el PDF. Por favor, intente nuevamente.",
        variant: "destructive"
      });
    } finally {
      setIsGeneratingPDF(false);
      setPdfGenerationProgress(100);
    }
  };

  const handleGeneratePDF = () => {
    const missing = validateForm();
    if (missing.length > 0) {
      setMissingFields(missing);
      setAlertOpen(true);
    } else {
      generatePDFDocument();
    }
  };

  return (
    <div className={`${theme} min-h-screen w-full flex`}>
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
        onCerrarFormulario={handleLimpiarFormulario} 
        onResetFormulario={handleResetFormulario} 
        pacienteActual={pacienteActual} 
      />
      
      <div className={`${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'} flex-1 py-12 px-4 sm:px-6 lg:px-8 transition-colors duration-200`}>
        <div className="max-w-5xl mx-auto space-y-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-2">Formulario IA</h1>
            <p className="text-sm text-gray-500 mb-6">
              (llena el formulario y deja que nuestra inteligencia artificial se encargue de hacer la redacción)
            </p>
            
            {/* Componente de nombre de paciente */}
            <div id="patient-name-input" className="max-w-lg mx-auto mb-2 sticky top-4 z-30 backdrop-blur-sm shadow-sm border border-gray-200 p-4 py-[5px] px-[20px] rounded-2xl bg-slate-50">
              <div className="flex items-center gap-3">
                <div className="relative flex-1">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <User className="h-4 w-4 text-gray-400" />
                  </div>
                  <Input 
                    value={nombrePaciente} 
                    onChange={e => setNombrePaciente(e.target.value)} 
                    placeholder="Nombre del paciente" 
                    className="pl-10 border-0 bg-transparent focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0" 
                  />
                </div>
                <Button 
                  onClick={handleGuardarFormulario} 
                  disabled={!nombrePaciente.trim()} 
                  className="bg-blue-500 hover:bg-blue-600 text-white rounded-full px-4 py-2 flex items-center gap-2 transition-all duration-200"
                >
                  <Save className="h-4 w-4" />
                  <span className="text-sm font-medium">Guardar</span>
                </Button>
              </div>
            </div>

            
            {/* Componente para mostrar el paciente actual */}
            {pacienteActual && (
              <div className="flex items-center justify-center gap-2 mb-6">
                <div className="text-xs text-blue-500 dark:text-blue-400 font-medium">
                  Formulario actual: {pacienteActual}
                </div>
                <button 
                  onClick={handleResetFormulario} 
                  className="text-red-500 hover:text-red-700 transition-colors p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700" 
                  aria-label="Resetear formulario"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            )}
            
            {/* Selector de género para mostrar/ocultar sección gineco-obstétrica */}
            <div className="flex items-center justify-center mb-6 gap-4">
              <span className="text-sm text-gray-600 dark:text-gray-400">Género del paciente:</span>
              <div className="flex gap-2">
                <button
                  className={`px-4 py-2 rounded-md text-sm transition-colors ${
                    !esMujer
                      ? 'bg-[#2ecc71] text-white'
                      : 'bg-gray-100 dark:bg-gray-700'
                  }`}
                  onClick={() => setEsMujer(false)}
                >
                  Hombre
                </button>
                <button
                  className={`px-4 py-2 rounded-md text-sm transition-colors ${
                    esMujer
                      ? 'bg-[#9370DB] text-white' // Cambiado a un tono rosa-púrpura usando código hexadecimal
                     : 'bg-gray-100 dark:bg-gray-700'
                 }`}
                 onClick={() => setEsMujer(true)}
                >
                  Mujer
                </button>


              </div>
            </div>
          </div>

          <div className="space-y-6">
            {/* Add data attributes to all sections for redaction collection */}
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

            {/* Mostrar antecedentes gineco-obstétricos solo si es mujer */}
            {esMujer && (
              <div data-section-redaction="true" data-section-name="antecedentesGinecoObstetricos">
                <AntecedentesGinecoObstetricos 
                  formData={formData} 
                  handleAntecedenteGinecoObstetricoChange={handleAntecedenteGinecoObstetricoChange} 
                />
              </div>
            )}

            <div data-section-redaction="true" data-section-name="interrogatorioSistemas">
              <InterrogatorioSistemas
          systemsData={formData.interrogatorioSistemas}
          onChange={handleInterrogatorioChange}
        />
            </div>

            <div data-section-redaction="true" data-section-name="exploracionFisica">
              <ExploracionFisica formData={formData} handleExploracionFisicaChange={handleExploracionFisicaChange} />
            </div>

            <div data-section-redaction="true" data-section-name="examenCabeza">
              <ExamenCabeza formData={formData} handleExamenCabezaChange={handleExamenCabezaChange} />
            </div>
            
            <div data-section-redaction="true" data-section-name="articulacionCraneomandibular">
              <ArticulacionCraneomandibular formData={formData} handleArticulacionCraneomandibularChange={handleArticulacionCraneomandibularChange} />
            </div>
            
            <div data-section-redaction="true" data-section-name="examenCuello">
              <ExamenCuello formData={formData} handleExamenCuelloChange={handleExamenCuelloChange} />
            </div>
            
            <div data-section-redaction="true" data-section-name="examenIntrabucal">
              <ExamenIntrabucal formData={formData} handleExamenIntrabucalChange={handleExamenIntrabucalChange} />
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

            <div className="flex justify-center pt-6">
              <Button 
                onClick={handleGeneratePDF} 
                disabled={isGeneratingPDF} 
                className="text-slate-50 bg-[#ff0000] hover:bg-[#cc0000] px-6 py-3 rounded-lg shadow-lg transition-all duration-300 transform hover:scale-105 text-base font-normal"
              >
                {isGeneratingPDF ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Generando PDF...
                  </>
                ) : (
                  <>
                    <FileText className="mr-2 h-5 w-5" />
                    Generar Historia Clínica en PDF
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>
      
      <ConfirmationAlert 
        isOpen={alertOpen} 
        onClose={() => setAlertOpen(false)} 
        onConfirm={() => {
          setAlertOpen(false);
          generatePDFDocument();
        }} 
        title="Formulario incompleto" 
        description="Hay campos sin completar en el formulario." 
        missingFields={missingFields} 
      />
      
      {isGeneratingPDF && (
        <LoadingOverlay 
          message="Generando PDF... Por favor espere mientras procesamos todas las secciones del formulario." 
          progress={pdfGenerationProgress} 
        />
      )}
      
      <Toaster />
    </div>
  );
};

export default HistoriaClinica;
