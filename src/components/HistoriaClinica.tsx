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
import { FormSection } from '@/types/historiaClinica';
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
    formState,
    updateInformacionPrincipal,
    updatePadecimientoActual,
    updateAntecedentesHeredoFamiliares,
    updateAntecedentesPersonalesPatologicos,
    updateAntecedentesPersonalesNoPatologicos,
    updateAntecedentesAlergicos,
    updateAntecedentesQuirurgicos,
    updateAntecedentesHemorragicos,
    updateInterrogatorioSistemas,
    updateExploracionFisica,
    updateExamenCabeza
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

    if (!formState.informacionPrincipal.nombrePaciente) {
      toast({
        title: "Información incompleta",
        description: "Por favor, ingresa al menos el nombre del paciente.",
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
        return <InformacionPrincipal data={formState.informacionPrincipal} onChange={updateInformacionPrincipal} />;
      case 'padecimientoActual':
        return <PadecimientoActual data={formState.padecimientoActual} onChange={updatePadecimientoActual} />;
      case 'antecedentesHeredoFamiliares':
        return <AntecedentesHeredoFamiliares data={formState.antecedentesHeredoFamiliares} onChange={updateAntecedentesHeredoFamiliares} />;
      case 'antecedentesPersonalesPatologicos':
        return <AntecedentesPersonalesPatologicos data={formState.antecedentesPersonalesPatologicos} onChange={updateAntecedentesPersonalesPatologicos} />;
      case 'antecedentesPersonalesNoPatologicos':
        return <AntecedentesPersonalesNoPatologicos data={formState.antecedentesPersonalesNoPatologicos} onChange={updateAntecedentesPersonalesNoPatologicos} />;
      case 'antecedentesAlergicos':
        return <AntecedentesAlergicos data={formState.antecedentesAlergicos} onChange={updateAntecedentesAlergicos} />;
      case 'antecedentesQuirurgicos':
        return <AntecedentesQuirurgicos data={formState.antecedentesQuirurgicos} onChange={updateAntecedentesQuirurgicos} />;
      case 'antecedentesHemorragicos':
        return <AntecedentesHemorragicos data={formState.antecedentesHemorragicos} onChange={updateAntecedentesHemorragicos} />;
      case 'interrogatorioSistemas':
        return <InterrogatorioSistemas data={formState.interrogatorioSistemas} onChange={updateInterrogatorioSistemas} />;
      case 'exploracionFisica':
        return <ExploracionFisica data={formState.exploracionFisica} onChange={updateExploracionFisica} />;
      case 'examenCabeza':
        return <ExamenCabeza data={formState.examenCabeza} onChange={updateExamenCabeza} />;
      default:
        return <InformacionPrincipal data={formState.informacionPrincipal} onChange={updateInformacionPrincipal} />;
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
              activeSection={activeSection} 
              onSectionChange={handleSectionChange}
              formState={formState}
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
        isOpen={resumenOpen}
        onClose={() => setResumenOpen(false)}
        formState={formState}
      />
    </div>
  );
};

export default HistoriaClinica;
