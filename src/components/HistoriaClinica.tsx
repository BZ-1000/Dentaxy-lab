
import { Toaster } from "@/components/ui/toaster";
import PadecimientoActual from './historia-clinica/PadecimientoActual';
import AntecedentesHeredoFamiliares from './historia-clinica/AntecedentesHeredoFamiliares';
import AntecedentesPersonalesNoPatologicos from './historia-clinica/AntecedentesPersonalesNoPatologicos';
import AntecedentesPersonalesPatologicos from './historia-clinica/AntecedentesPersonalesPatologicos';
import AntecedentesAlergicos from './historia-clinica/AntecedentesAlergicos';
import AntecedentesQuirurgicos from './historia-clinica/AntecedentesQuirurgicos';
import AntecedentesHemorragicos from './historia-clinica/AntecedentesHemorragicos';
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
  const pdfSectionsRef = useRef<{[key: string]: string}>({});
  
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
  
  // Improved function to find and click a button in a section
  const clickButtonInSection = async (sectionElement: Element, buttonText: string, waitTime = 500) => {
    console.log(`Looking for button containing "${buttonText}" in section`);
    const allButtons = sectionElement.querySelectorAll('button');
    for (const button of allButtons) {
      if (button.textContent && button.textContent.includes(buttonText)) {
        console.log(`Found button: ${button.textContent}`);
        (button as HTMLElement).click();
        await new Promise(resolve => setTimeout(resolve, waitTime));
        return true;
      }
    }
    console.warn(`No button found containing "${buttonText}"`);
    return false;
  };
  
  // Improved function to generate section redaction
  const generateSectionRedaction = async (sectionName: string, sectionElement: Element) => {
    try {
      console.log(`Attempting to generate redaction for ${sectionName}`);
      
      // First make sure we're on the form tab
      await clickButtonInSection(sectionElement, 'Formulario', 300);
      
      // Click the generate button
      const generated = await clickButtonInSection(sectionElement, 'Generar Redacción IA', 4000);
      if (!generated) {
        console.warn(`Failed to click 'Generar Redacción IA' button for ${sectionName}`);
        return false;
      }
      
      // Switch to the redaction tab and wait for content to load
      await clickButtonInSection(sectionElement, 'Redacción IA', 1000);
      
      // Wait additional time for redaction to fully render
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      return true;
    } catch (error) {
      console.error(`Error generating ${sectionName} redaction:`, error);
      return false;
    }
  };
  
  // Improved function to get redaction content with multiple strategies
  const getSectionRedaction = (sectionName: string, sectionElement: Element): string | null => {
    try {
      console.log(`Extracting content for ${sectionName}`);
      
      // Array of strategies to try
      const strategies = [
        // Strategy 1: Look for data-redaction-content attribute
        () => sectionElement.querySelector('[data-redaction-content]')?.textContent,
        
        // Strategy 2: Look for min-height containers
        () => {
          const heightContainers = sectionElement.querySelectorAll('[class*="min-h-"]');
          for (const container of heightContainers) {
            if (container.textContent && container.textContent.trim().length > 10) {
              return container.textContent;
            }
          }
          return null;
        },
        
        // Strategy 3: Look for any div with whitespace-pre-wrap style
        () => {
          const preWrapDivs = sectionElement.querySelectorAll('div[style*="white-space: pre-wrap"]');
          for (const div of preWrapDivs) {
            if (div.textContent && div.textContent.trim().length > 10) {
              return div.textContent;
            }
          }
          return null;
        },
        
        // Strategy 4: Look for specific content types based on section
        () => {
          if (sectionName === "antecedentesHeredoFamiliares") {
            // Look for content that mentions "Padre", "Madre", "Abuelo", etc.
            const allDivs = sectionElement.querySelectorAll('div');
            for (const div of allDivs) {
              const text = div.textContent || '';
              if ((text.includes("Padre") || text.includes("Madre") || text.includes("Abuelo")) && 
                  text.trim().length > 20) {
                return text;
              }
            }
          } else if (sectionName === "antecedentesPersonalesNoPatologicos") {
            // Look for content that mentions "Servicios", "Higiene", etc.
            const allDivs = sectionElement.querySelectorAll('div');
            for (const div of allDivs) {
              const text = div.textContent || '';
              if ((text.includes("Servicios") || text.includes("Higiene") || text.includes("Alimentación")) && 
                  text.trim().length > 20) {
                return text;
              }
            }
          } else if (sectionName === "antecedentesPersonalesPatologicos") {
            // Look for content that mentions specific conditions
            const allDivs = sectionElement.querySelectorAll('div');
            for (const div of allDivs) {
              const text = div.textContent || '';
              if ((text.includes("Nutricionales") || text.includes("Cardíacos") || text.includes("Hepáticos")) && 
                  text.trim().length > 20) {
                return text;
              }
            }
          }
          return null;
        },
        
        // Strategy 5: Get content from the visible tab panel
        () => {
          const activeTabPanel = sectionElement.querySelector('div[role="tabpanel"]:not([hidden]), div.active-panel');
          return activeTabPanel?.textContent || null;
        },
        
        // Strategy 6: Last resort - just get any large text block
        () => {
          const allDivs = sectionElement.querySelectorAll('div');
          for (const div of allDivs) {
            const text = div.textContent || '';
            // Find longest text with meaningful content
            if (text.trim().length > 50 && !text.includes('button')) {
              return text;
            }
          }
          return null;
        }
      ];
      
      // Try each strategy until one works
      for (const strategy of strategies) {
        const content = strategy();
        if (content && content.trim().length > 0) {
          console.log(`Found content for ${sectionName} using strategy: ${strategy.toString().substring(0, 30)}...`);
          return content.trim();
        }
      }
      
      console.warn(`Could not find content for ${sectionName} with any strategy`);
      return null;
    } catch (error) {
      console.error(`Error extracting ${sectionName} content:`, error);
      return null;
    }
  };
  
  // Improved function to collect all redactions with better section identification and retry logic
  const collectAllRedactions = async () => {
    // Define all sections we want to collect redactions for
    const sectionMappings = [
      { name: 'padecimientoActual', label: 'I.', title: 'PADECIMIENTO ACTUAL' },
      { name: 'antecedentesHeredoFamiliares', label: 'II.', title: 'Antecedentes Heredo Familiares' },
      { name: 'antecedentesPersonalesNoPatologicos', label: 'III.', title: 'ANTECEDENTES PERSONALES NO PATOLÓGICOS' },
      { name: 'antecedentesPersonalesPatologicos', label: 'IV.', title: 'ANTECEDENTES PERSONALES PATOLÓGICOS' }
    ];
    
    // Find all sections with data-section-redaction attribute
    let allSectionElements = document.querySelectorAll('[data-section-redaction="true"]');
    
    // If none found with attribute, try to find sections by their headings
    if (!allSectionElements || allSectionElements.length === 0) {
      console.log("No elements found with data-section-redaction attribute, trying fallback method");
      
      // Find elements by their heading text
      const sectionElements: Element[] = [];
      
      // Look for each section by its heading
      for (const mapping of sectionMappings) {
        // Look for headers containing the section title
        const headers = Array.from(document.querySelectorAll('h2, h3, div.flex.justify-start'));
        
        for (const header of headers) {
          const text = header.textContent || '';
          if (text.includes(mapping.label) && text.includes(mapping.title)) {
            // Find the parent section container - go up until we find a Card or large container
            let parent = header.parentElement;
            while (parent && 
                  (!parent.classList.contains('rounded-xl') && 
                   !parent.classList.contains('space-y-6') &&
                   !parent.classList.contains('max-w-4xl'))) {
              parent = parent.parentElement;
              if (!parent) break;
            }
            
            if (parent) {
              console.log(`Found section ${mapping.name} by heading: ${text}`);
              sectionElements.push(parent);
              break;
            }
          }
        }
      }
      
      if (sectionElements.length > 0) {
        allSectionElements = sectionElements as NodeListOf<Element>;
      } else {
        console.error("Failed to find any sections by heading text");
        return {};
      }
    }
    
    console.log(`Found ${allSectionElements.length} section elements`);
    pdfSectionsRef.current = {};
    
    // First pass: generate redactions for each section
    for (let i = 0; i < Math.min(allSectionElements.length, sectionMappings.length); i++) {
      const sectionMapping = sectionMappings[i];
      const sectionElement = allSectionElements[i];
      
      console.log(`Generating redaction for section ${i+1}: ${sectionMapping.name}`);
      await generateSectionRedaction(sectionMapping.name, sectionElement);
      
      // Update progress
      setPdfGenerationProgress(Math.round((i / sectionMappings.length) * 50));
      
      // Give time for redaction to complete
      await new Promise(resolve => setTimeout(resolve, 3000));
    }
    
    // Extra delay to ensure all redactions are fully generated
    await new Promise(resolve => setTimeout(resolve, 5000));
    
    // Second pass: collect redactions
    for (let i = 0; i < Math.min(allSectionElements.length, sectionMappings.length); i++) {
      const sectionMapping = sectionMappings[i];
      const sectionElement = allSectionElements[i];
      
      console.log(`Collecting redaction for section ${i+1}: ${sectionMapping.name}`);
      const content = getSectionRedaction(sectionMapping.name, sectionElement);
      
      if (content) {
        pdfSectionsRef.current[sectionMapping.name] = content;
        console.log(`Successfully collected content for ${sectionMapping.name} (${content.length} chars)`);
      } else {
        console.warn(`Failed to collect content for ${sectionMapping.name}, trying again`);
        
        // Try once more with delay
        await generateSectionRedaction(sectionMapping.name, sectionElement);
        await new Promise(resolve => setTimeout(resolve, 4000));
        
        // Second attempt
        const retryContent = getSectionRedaction(sectionMapping.name, sectionElement);
        if (retryContent) {
          pdfSectionsRef.current[sectionMapping.name] = retryContent;
          console.log(`Second attempt: collected content for ${sectionMapping.name}`);
        } else {
          console.error(`Failed to collect content for ${sectionMapping.name} after retry`);
        }
      }
      
      // Update progress for second phase
      setPdfGenerationProgress(50 + Math.round((i / sectionMappings.length) * 50));
    }
    
    console.log("All redactions collected:", Object.keys(pdfSectionsRef.current));
    return pdfSectionsRef.current;
  };
  
  // Updated PDF generation function (NO form reset)
  const generatePDFDocument = async () => {
    try {
      setIsGeneratingPDF(true);
      setPdfGenerationProgress(0);
      
      // Collect all redactions
      const allRedactions = await collectAllRedactions();
      
      // Log the redactions we collected to help debug
      console.log("Collected redactions for sections:", Object.keys(allRedactions));
      Object.entries(allRedactions).forEach(([key, value]) => {
        console.log(`${key} content length: ${value.length} chars`);
      });
      
      // Generate the PDF
      const patientName = nombrePaciente || pacienteActual || 'Paciente';
      generatePDF(formData, patientName, allRedactions);
      
      toast({
        title: "PDF Generado",
        description: "La Historia Clínica ha sido generada exitosamente."
      });
      
      // IMPORTANT: We are NOT resetting the form anymore
      // Removed: resetFormulario();
      
    } catch (error) {
      console.error("Error generating PDF:", error);
      toast({
        title: "Error",
        description: "No se pudo generar el PDF. Por favor, intente nuevamente.",
        variant: "destructive"
      });
    } finally {
      setIsGeneratingPDF(false);
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
  
  return <div className={`${theme} min-h-screen w-full flex`}>
      <FormulariosSidebar onCargarFormulario={(data, nombre) => {
      cargarFormulario(data);
      setPacienteActual(nombre);
      setNombrePaciente(nombre);
    }} onGuardarFormulario={nombre => {
      guardarFormulario(formData, nombre);
      setPacienteActual(nombre);
    }} onCerrarFormulario={handleLimpiarFormulario} onResetFormulario={handleResetFormulario} pacienteActual={pacienteActual} />
      
      <div className={`${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'} flex-1 py-12 px-4 sm:px-6 lg:px-8 transition-colors duration-200`}>
        
        <div className="max-w-5xl mx-auto space-y-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-2">Formulario IA</h1>
            <p className="text-sm text-gray-500 mb-6">
              (llena el formulario y deja que nuestra inteligencia artificial se encargue de hacer la redacción)
            </p>
            
            {/* Componente de nombre de paciente con estilo Apple minimalista - ahora sticky */}
            <div className="max-w-lg mx-auto mb-2 sticky top-4 z-30">
              <div className="backdrop-blur-sm shadow-sm border border-gray-200 p-4 py-[5px] px-[20px] rounded-2xl bg-slate-50">
                <div className="flex items-center gap-3">
                  <div className="relative flex-1">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                      <User className="h-4 w-4 text-gray-400" />
                    </div>
                    <Input value={nombrePaciente} onChange={e => setNombrePaciente(e.target.value)} placeholder="Nombre del paciente" className="pl-10 border-0 bg-transparent focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0" />
                  </div>
                  <Button onClick={handleGuardarFormulario} disabled={!nombrePaciente.trim()} className="bg-blue-500 hover:bg-blue-600 text-white rounded-full px-4 py-2 flex items-center gap-2 transition-all duration-200">
                    <Save className="h-4 w-4" />
                    <span className="text-sm font-medium">Guardar</span>
                  </Button>
                </div>
              </div>
            </div>
            
            {/* Componente separado para mostrar el paciente actual */}
            {pacienteActual && <div className="flex items-center justify-center gap-2 mb-6">
                <div className="text-xs text-blue-500 dark:text-blue-400 font-medium">
                  Formulario actual: {pacienteActual}
                </div>
                <button onClick={handleResetFormulario} className="text-red-500 hover:text-red-700 transition-colors p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700" aria-label="Resetear formulario">
                  <X className="w-3 h-3" />
                </button>
              </div>}
          </div>

          <div className="space-y-6">
            
            <PadecimientoActual formData={formData} handlePadecimientoChange={handlePadecimientoChange} handleDolorChange={handleDolorChange} handleSinSintomasChange={handleSinSintomasChange} />
            
            <AntecedentesHeredoFamiliares formData={formData} handleFamiliarChange={handleFamiliarChange} handleCondicionChange={handleCondicionChange} />

            <AntecedentesPersonalesNoPatologicos formData={formData} handleAntecedenteChange={handleAntecedenteChange} toggleService={toggleService} />
            
            <AntecedentesPersonalesPatologicos formData={formData} handleAntecedentePatologicoChange={handleAntecedentePatologicoChange} />
            
            <AntecedentesAlergicos formData={formData} handleAntecedenteAlergicoChange={handleAntecedenteAlergicoChange} />

            <AntecedentesQuirurgicos formData={formData} handleAntecedenteQuirurgicoChange={handleAntecedenteQuirurgicoChange} />

            <AntecedentesHemorragicos formData={formData} handleAntecedenteHemorragicoChange={handleAntecedenteHemorragicoChange} />

            <InterrogatorioSistemas formData={formData} handleInterrogatorioChange={handleInterrogatorioChange} />

            <ExploracionFisica formData={formData} handleExploracionFisicaChange={handleExploracionFisicaChange} />

            <ExamenCabeza formData={formData} handleExamenCabezaChange={handleExamenCabezaChange} />
            
            <ArticulacionCraneomandibular formData={formData} handleArticulacionCraneomandibularChange={handleArticulacionCraneomandibularChange} />
            
            <ExamenCuello formData={formData} handleExamenCuelloChange={handleExamenCuelloChange} />
            
            <ExamenIntrabucal formData={formData} handleExamenIntrabucalChange={handleExamenIntrabucalChange} />
            
            <GlandulasSalivales formData={formData} handleGlandulasSalivalesChange={handleGlandulasSalivalesChange} />
            
            <Oclusion formData={formData} handleOclusionChange={handleOclusionChange} />
            
            <RelacionDientes formData={formData} handleRelacionDientesChange={handleRelacionDientesChange} />
            
            <LineaMedia formData={formData} handleLineaMediaChange={handleLineaMediaChange} />
            
            <Frenillos formData={formData} handleFrenillosChange={handleFrenillosChange} />
            
            <Diagnostico formData={formData} handleDiagnosticoChange={handleDiagnosticoChange} />
            
            <Pronostico formData={formData} handlePronosticoChange={handlePronosticoChange} />

            <div className="flex justify-center pt-6">
              <Button onClick={handleGeneratePDF} disabled={isGeneratingPDF} className="text-slate-50 bg-[#ff0000] hover:bg-[#cc0000] font-semibold text-lg px-6 py-3 rounded-lg shadow-lg transition-all duration-300 transform hover:scale-105">
                {isGeneratingPDF ? <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Generando PDF...
                  </> : <>
                    <FileText className="mr-2 h-5 w-5" />
                    Generar Historia Clínica en PDF
                  </>}
              </Button>
            </div>
          </div>
        </div>
      </div>
      
      <ConfirmationAlert isOpen={alertOpen} onClose={() => setAlertOpen(false)} onConfirm={() => {
      setAlertOpen(false);
      generatePDFDocument();
    }} title="Formulario incompleto" description="Hay campos sin completar en el formulario." missingFields={missingFields} />
      
      {isGeneratingPDF && <LoadingOverlay 
        message="Generando PDF... Por favor espere mientras procesamos todas las secciones del formulario." 
        progress={pdfGenerationProgress}
      />}
      
      <Toaster />
    </div>;
};

export default HistoriaClinica;
