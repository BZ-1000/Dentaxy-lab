
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
import { Loader2, X, Save, User } from "lucide-react";
import { useHistoriaClinica } from '@/hooks/useHistoriaClinica';
import FormulariosSidebar from './historia-clinica/FormulariosSidebar';
import { useState, useEffect } from 'react';
import { toast } from "@/hooks/use-toast";

const HistoriaClinica = () => {
  const { theme } = useTheme();
  const [pacienteActual, setPacienteActual] = useState<string>('');
  const [nombrePaciente, setNombrePaciente] = useState<string>('');
  
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
    cargarFormulario
  } = useHistoriaClinica();

  // Efecto para guardar automáticamente cuando cambia el formulario y hay un paciente seleccionado
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

  return (
    <div className={`${theme} min-h-screen w-full flex`}>
      <FormulariosSidebar 
        onCargarFormulario={(data, nombre) => {
          cargarFormulario(data);
          setPacienteActual(nombre);
          setNombrePaciente(nombre);
        }}
        onGuardarFormulario={(nombre) => {
          guardarFormulario(formData, nombre);
          setPacienteActual(nombre);
        }}
        onCerrarFormulario={handleLimpiarFormulario}
        pacienteActual={pacienteActual}
      />
      
      <div className={`${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'} flex-1 py-12 px-4 sm:px-6 lg:px-8 transition-colors duration-200`}>
        <div className="max-w-5xl mx-auto space-y-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-2">Formulario IA</h1>
            <p className="text-sm text-gray-500 mb-6">
              (llena el formulario y deja que nuestra inteligencia artificial se encargue de hacer la redacción)
            </p>
            
            {/* Nuevo componente de nombre de paciente con estilo Apple minimalista */}
            <div className="max-w-lg mx-auto mb-8">
              <div className="backdrop-blur-sm bg-white/90 dark:bg-gray-800/90 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4">
                <div className="flex items-center gap-3">
                  <div className="relative flex-1">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                      <User className="h-4 w-4 text-gray-400" />
                    </div>
                    <Input
                      value={nombrePaciente}
                      onChange={(e) => setNombrePaciente(e.target.value)}
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
                  
                  {pacienteActual && (
                    <button 
                      onClick={handleLimpiarFormulario} 
                      className="text-red-500 hover:text-red-700 transition-colors p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
                      aria-label="Limpiar formulario"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
                
                {pacienteActual && (
                  <div className="mt-2 text-xs text-blue-500 dark:text-blue-400 font-medium">
                    Formulario actual: {pacienteActual}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <PadecimientoActual 
              formData={formData}
              handlePadecimientoChange={handlePadecimientoChange}
              handleDolorChange={handleDolorChange}
              handleSinSintomasChange={handleSinSintomasChange}
            />
            
            <AntecedentesHeredoFamiliares 
              formData={formData}
              handleFamiliarChange={handleFamiliarChange}
              handleCondicionChange={handleCondicionChange}
            />

            <AntecedentesPersonalesNoPatologicos 
              formData={formData}
              handleAntecedenteChange={handleAntecedenteChange}
              toggleService={toggleService}
            />
            
            <AntecedentesPersonalesPatologicos
              formData={formData}
              handleAntecedentePatologicoChange={handleAntecedentePatologicoChange}
            />
            
            <AntecedentesAlergicos
              formData={formData}
              handleAntecedenteAlergicoChange={handleAntecedenteAlergicoChange}
            />

            <AntecedentesQuirurgicos
              formData={formData}
              handleAntecedenteQuirurgicoChange={handleAntecedenteQuirurgicoChange}
            />

            <AntecedentesHemorragicos
              formData={formData}
              handleAntecedenteHemorragicoChange={handleAntecedenteHemorragicoChange}
            />

            <InterrogatorioSistemas
              formData={formData}
              handleInterrogatorioChange={handleInterrogatorioChange}
            />

            <ExploracionFisica
              formData={formData}
              handleExploracionFisicaChange={handleExploracionFisicaChange}
            />

            <ExamenCabeza
              formData={formData}
              handleExamenCabezaChange={handleExamenCabezaChange}
            />
            
            <ArticulacionCraneomandibular
              formData={formData}
              handleArticulacionCraneomandibularChange={handleArticulacionCraneomandibularChange}
            />
            
            <ExamenCuello
              formData={formData}
              handleExamenCuelloChange={handleExamenCuelloChange}
            />
            
            <ExamenIntrabucal
              formData={formData}
              handleExamenIntrabucalChange={handleExamenIntrabucalChange}
            />
            
            <GlandulasSalivales
              formData={formData}
              handleGlandulasSalivalesChange={handleGlandulasSalivalesChange}
            />
            
            <Oclusion
              formData={formData}
              handleOclusionChange={handleOclusionChange}
            />
            
            <RelacionDientes
              formData={formData}
              handleRelacionDientesChange={handleRelacionDientesChange}
            />
            
            <LineaMedia
              formData={formData}
              handleLineaMediaChange={handleLineaMediaChange}
            />
            
            <Frenillos
              formData={formData}
              handleFrenillosChange={handleFrenillosChange}
            />
            
            <Diagnostico
              formData={formData}
              handleDiagnosticoChange={handleDiagnosticoChange}
            />
            
            <Pronostico
              formData={formData}
              handlePronosticoChange={handlePronosticoChange}
            />

            <div className="flex justify-center pt-6">
              <Button 
                onClick={generarResumen}
                disabled={isGenerating}
                className="bg-gradient-to-r from-primary to-secondary hover:opacity-90 transition-all duration-200 text-white font-semibold px-8 py-3 rounded-lg shadow-lg hover:shadow-xl"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generando Historia Clínica...
                  </>
                ) : (
                  'Generar Historia Clínica con IA'
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>
      <Toaster />
    </div>
  );
};

export default HistoriaClinica;
