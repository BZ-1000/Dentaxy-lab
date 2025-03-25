
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
  
  const collectAllRedactions = async () => {
    // Get all sections that have a "Generar Redacción IA" button
    const sectionsWithGenerateButtons = [
      { 
        selector: '[data-section-redaction="true"][data-section-name="padecimientoActual"]',
        sectionName: 'padecimientoActual' 
      },
      { 
        selector: '[data-section-name="antecedentesHeredoFamiliares"]',
        sectionName: 'antecedentesHeredoFamiliares'
      },
      { 
        selector: '[data-section-name="antecedentesPersonalesNoPatologicos"]',
        sectionName: 'antecedentesPersonalesNoPatologicos'
      },
      { 
        selector: '[data-section-name="antecedentesPersonalesPatologicos"]',
        sectionName: 'antecedentesPersonalesPatologicos'
      }
    ];
    
    const totalSections = sectionsWithGenerateButtons.length;
    let processedSections = 0;
    
    pdfSectionsRef.current = {};
    
    // Process each section
    for (const section of sectionsWithGenerateButtons) {
      // Find the section in the DOM
      const sectionElement = document.querySelector(section.selector);
      
      if (sectionElement) {
        // Look for a button to generate redaction
        const generateButtons = sectionElement.querySelectorAll('button');
        
        // Find the button with "Generar Redacción IA" text
        let generateButton = null;
        for (const button of generateButtons) {
          if (button.textContent && button.textContent.includes('Generar Redacción IA')) {
            generateButton = button;
            break;
          }
        }
        
        if (generateButton) {
          // Get current tab buttons
          const tabButtons = sectionElement.querySelectorAll('button');
          let formTab = null;
          let redactionTab = null;
          
          // Find the form and redaction tabs
          for (const button of tabButtons) {
            if (button.textContent && button.textContent.includes('Formulario')) {
              formTab = button;
            }
            if (button.textContent && button.textContent.includes('Redacción IA')) {
              redactionTab = button;
            }
          }
          
          // Remember which tab was active (assuming if formTab doesn't have bg-blue-500 class, it's active)
          const wasOnFormTab = formTab && !formTab.classList.contains('bg-blue-500');
          
          // Click to generate redaction
          (generateButton as HTMLElement).click();
          
          // Wait for the redaction to be generated
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          // Make sure redaction tab is active to see content
          if (redactionTab && !redactionTab.classList.contains('bg-blue-500')) {
            (redactionTab as HTMLElement).click();
            // Wait for UI to update
            await new Promise(resolve => setTimeout(resolve, 300));
          }
          
          // Locate the generated content
          const contentContainer = sectionElement.querySelector('[data-redaction-content]') || 
                                  sectionElement.querySelector('.min-h-\\[150px\\]') ||
                                  sectionElement.querySelector('div[style*="white-space: pre-wrap"]') ||
                                  sectionElement.querySelector('div[dangerouslySetInnerHTML]');
          
          if (contentContainer) {
            // Extract the content - either from textContent or innerHTML
            let text = contentContainer.textContent || '';
            
            // If container uses dangerouslySetInnerHTML, we need to get that
            if (!text && contentContainer.getAttribute('dangerouslySetInnerHTML')) {
              const htmlContent = contentContainer.innerHTML;
              text = htmlContent || '';
            }
            
            if (text && text.trim()) {
              pdfSectionsRef.current[section.sectionName] = text;
            }
          }
          
          // If we were on the form tab before, switch back
          if (wasOnFormTab && formTab) {
            (formTab as HTMLElement).click();
          }
        }
        
        // Update progress
        processedSections++;
        setPdfGenerationProgress(Math.round((processedSections / totalSections) * 100));
      }
    }
    
    return pdfSectionsRef.current;
  };
  
  // Update the button style to make it more prominent
  const handleGeneratePDF = () => {
    const missing = validateForm();
    if (missing.length > 0) {
      setMissingFields(missing);
      setAlertOpen(true);
    } else {
      generatePDFDocument();
    }
  };
  
  
  // Update generatePDFDocument to collect all section redactions
  const generatePDFDocument = async () => {
    try {
      setIsGeneratingPDF(true);
      setPdfGenerationProgress(0);
      
      // Click the "Generar Redacción IA" button in each section first
      // This will ensure all redactions are generated before collecting them
      const sectionsToTrigger = [
        '[data-section-redaction="true"][data-section-name="padecimientoActual"]',
        '[data-section-name="antecedentesHeredoFamiliares"]',
        '[data-section-name="antecedentesPersonalesNoPatologicos"]',
        '[data-section-name="antecedentesPersonalesPatologicos"]'
      ];
      
      for (const selector of sectionsToTrigger) {
        const section = document.querySelector(selector);
        if (section) {
          // Find all buttons in the section
          const buttons = section.querySelectorAll('button');
          
          // Find the "Generar Redacción IA" button
          for (const button of buttons) {
            if (button.textContent && button.textContent.includes('Generar Redacción IA')) {
              // Click the button to generate redaction
              (button as HTMLElement).click();
              // Wait for redaction to be generated
              await new Promise(resolve => setTimeout(resolve, 1000));
              break;
            }
          }
        }
      }
      
      // Extract all AI-generated content from all sections
      const allRedactions = await collectAllRedactions();
      
      // Generate the PDF with the collected redactions
      const patientName = nombrePaciente || pacienteActual || 'Paciente';
      generatePDF(formData, patientName, allRedactions);
      
      toast({
        title: "PDF Generado",
        description: "La Historia Clínica ha sido generada exitosamente."
      });
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
  
  // Main component render
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
