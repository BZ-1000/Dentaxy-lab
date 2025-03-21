
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import FormulariosSidebar from './historia-clinica/FormulariosSidebar';
import InformacionPrincipal from './historia-clinica/InformacionPrincipal';
import PadecimientoActual from './historia-clinica/PadecimientoActual';
import AntecedentesHeredoFamiliares from './historia-clinica/AntecedentesHeredoFamiliares';
import AntecedentesPersonalesPatologicos from './historia-clinica/AntecedentesPersonalesPatologicos';
import AntecedentesPersonalesNoPatologicos from './historia-clinica/AntecedentesPersonalesNoPatologicos';
import AntecedentesAlergicos from './historia-clinica/AntecedentesAlergicos';
import AntecedentesQuirurgicos from './historia-clinica/AntecedentesQuirurgicos';
import AntecedentesHemorragicos from './historia-clinica/AntecedentesHemorragicos';
import InterrogatorioSistemas from './historia-clinica/InterrogatorioSistemas';
import ExploracionFisica from './historia-clinica/ExploracionFisica';
import ResumenHistoriaClinica from './historia-clinica/ResumenHistoriaClinica';
import ExamenCabeza from './ExamenCabeza';
import { useHistoriaClinica } from '@/hooks/useHistoriaClinica';
import { useToast } from '@/components/ui/use-toast';
import { useGeminiContext } from '@/contexts/GeminiContext';
import { FormDataState, FormSection } from '@/types/historiaClinica';
import { useAuth } from '@/hooks/useAuth';

const HistoriaClinica: React.FC = () => {
  const { toast } = useToast();
  const { geminiAvailable, geminiLoading, generateContent } = useGeminiContext();
  const [activeSection, setActiveSection] = useState<FormSection>('informacionPrincipal');
  const [resumenOpen, setResumenOpen] = useState(false);
  const [showPreviews, setShowPreviews] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const { isAuthenticated, openAuthDialog } = useAuth();

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 1024);
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  const {
    formData,
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
    handleExamenCabezaChange
  } = useHistoriaClinica();

  const handleSectionChange = (section: FormSection) => {
    setActiveSection(section);
  };

  const generateHistoriaClinica = async () => {
    if (!isAuthenticated) {
      toast({
        title: "Inicia sesión para continuar",
        description: "Necesitas iniciar sesión para generar una historia clínica.",
        variant: "destructive"
      });
      openAuthDialog("login");
      return;
    }

    // For simplicity, added a basic validation check on formData
    if (!formData.padecimientoActual.motivoConsulta) {
      toast({
        title: "Información incompleta",
        description: "Por favor, ingresa al menos el motivo de consulta.",
        variant: "destructive"
      });
      return;
    }

    try {
      setResumenOpen(true);
      
      if (geminiAvailable) {
        toast({
          title: "Generando historia clínica",
          description: "Espera un momento mientras procesamos la información...",
        });
      }
    } catch (error) {
      console.error("Error al generar la historia clínica:", error);
      toast({
        title: "Error al generar",
        description: "Hubo un problema al generar la historia clínica. Intenta nuevamente.",
        variant: "destructive"
      });
    }
  };

  const renderActiveSection = () => {
    switch (activeSection) {
      case 'informacionPrincipal':
        return (
          <InformacionPrincipal
            fechaAparicion={formData.padecimientoActual.dolor.fechaInicio}
            evolucion={formData.padecimientoActual.historiaPadecimiento || ""}
            estadoActual={formData.padecimientoActual.motivoConsulta || ""}
            onFechaChange={(value) => handleDolorChange('fechaInicio', value)}
            onEvolucionChange={(value) => handlePadecimientoChange('historiaPadecimiento', value)}
            onEstadoChange={(value) => handlePadecimientoChange('motivoConsulta', value)}
            onVoiceTranscription={(text) => handlePadecimientoChange('motivoConsulta', text)}
          />
        );
      case 'padecimientoActual':
        return (
          <PadecimientoActual 
            padecimiento={formData.padecimientoActual}
            onPadecimientoChange={handlePadecimientoChange}
            onDolorChange={handleDolorChange}
            onSinSintomasChange={handleSinSintomasChange}
          />
        );
      case 'antecedentesHeredoFamiliares':
        return (
          <AntecedentesHeredoFamiliares 
            antecedentes={formData.antecedentesHeredoFamiliares}
            onFamiliarChange={handleFamiliarChange}
            onCondicionChange={handleCondicionChange}
          />
        );
      case 'antecedentesPersonalesPatologicos':
        return (
          <AntecedentesPersonalesPatologicos 
            antecedentes={formData.antecedentesPersonalesPatologicos}
            onChange={handleAntecedentePatologicoChange}
          />
        );
      case 'antecedentesPersonalesNoPatologicos':
        return (
          <AntecedentesPersonalesNoPatologicos 
            antecedentes={formData.antecedentesPersonalesNoPatologicos}
            onChange={handleAntecedenteChange}
          />
        );
      case 'antecedentesAlergicos':
        return (
          <AntecedentesAlergicos 
            antecedentes={formData.antecedentesAlergicos}
            onChange={handleAntecedenteAlergicoChange}
          />
        );
      case 'antecedentesQuirurgicos':
        return (
          <AntecedentesQuirurgicos 
            antecedentes={formData.antecedentesQuirurgicos}
            onChange={handleAntecedenteQuirurgicoChange}
          />
        );
      case 'antecedentesHemorragicos':
        return (
          <AntecedentesHemorragicos 
            antecedentes={formData.antecedentesHemorragicos}
            onChange={handleAntecedenteHemorragicoChange}
          />
        );
      case 'interrogatorioSistemas':
        return (
          <InterrogatorioSistemas 
            formData={formData}
            handleInterrogatorioChange={handleInterrogatorioChange}
          />
        );
      case 'exploracionFisica':
        return (
          <ExploracionFisica 
            exploracion={formData.exploracionFisica}
            onChange={handleExploracionFisicaChange}
          />
        );
      case 'examenCabeza':
        return (
          <ExamenCabeza 
            data={{
              palpacionATM: formData.examenCabeza.palpacionATM || "",
              movimientosMandibulares: formData.examenCabeza.movimientosMandibulares || "",
              gangliosLinfaticos: formData.examenCabeza.gangliosLinfaticos || "",
              musculosMasticadores: formData.examenCabeza.musculosMasticadores || "",
              observaciones: formData.examenCabeza.observaciones || ""
            }}
            onChange={handleExamenCabezaChange}
          />
        );
      default:
        return (
          <InformacionPrincipal
            fechaAparicion={formData.padecimientoActual.dolor.fechaInicio}
            evolucion={formData.padecimientoActual.historiaPadecimiento || ""}
            estadoActual={formData.padecimientoActual.motivoConsulta || ""}
            onFechaChange={(value) => handleDolorChange('fechaInicio', value)}
            onEvolucionChange={(value) => handlePadecimientoChange('historiaPadecimiento', value)}
            onEstadoChange={(value) => handlePadecimientoChange('motivoConsulta', value)}
            onVoiceTranscription={(text) => handlePadecimientoChange('motivoConsulta', text)}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="pt-6 pb-8">
          <h1 className="text-3xl font-bold text-gray-900">Historia Clínica</h1>
          <p className="mt-2 text-sm text-gray-600">
            Completa la información para generar una historia clínica profesional.
          </p>
        </div>
        
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar Navigation */}
          <div className={`w-full lg:w-64 flex-shrink-0 ${isMobile && activeSection !== 'sidebarOnly' ? 'hidden' : ''}`}>
            <FormulariosSidebar 
              currentSection={activeSection} 
              onSectionChange={handleSectionChange}
              formData={formData}
              showPreviews={showPreviews}
              setShowPreviews={setShowPreviews}
            />
          </div>
          
          {/* Main Content Area */}
          <div className={`flex-1 bg-white shadow rounded-lg p-6 ${isMobile && activeSection === 'sidebarOnly' ? 'hidden' : ''}`}>
            {renderActiveSection()}
            
            <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-between items-center">
              <Button
                type="button" 
                variant="outline"
                onClick={() => isMobile && setActiveSection('sidebarOnly')}
                className="w-full sm:w-auto lg:hidden"
              >
                Ver todas las secciones
              </Button>
              
              <Button
                className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white"
                onClick={generateHistoriaClinica}
                disabled={geminiLoading}
              >
                {geminiLoading ? 'Generando...' : 'Generar Historia Clínica'}
              </Button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Resumen Modal */}
      <ResumenHistoriaClinica 
        open={resumenOpen}
        onClose={() => setResumenOpen(false)}
        formData={formData}
      />
    </div>
  );
};

export default HistoriaClinica;
