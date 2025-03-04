
import { Toaster } from "@/components/ui/toaster";
import PadecimientoActual from './historia-clinica/PadecimientoActual';
import AntecedentesHeredoFamiliares from './historia-clinica/AntecedentesHeredoFamiliares';
import AntecedentesPersonalesNoPatologicos from './historia-clinica/AntecedentesPersonalesNoPatologicos';
import SignosVitales from './historia-clinica/SignosVitales';
import DiagnosticoPronostico from './historia-clinica/DiagnosticoPronostico';
import ResumenHistoriaClinica from './historia-clinica/ResumenHistoriaClinica';
import { Button } from "@/components/ui/button";
import { useTheme } from '@/hooks/use-theme';
import { Loader2, X } from "lucide-react";
import { useHistoriaClinica } from '@/hooks/useHistoriaClinica';
import FormulariosSidebar from './historia-clinica/FormulariosSidebar';
import { useState } from 'react';

const HistoriaClinica = () => {
  const { theme } = useTheme();
  const [pacienteActual, setPacienteActual] = useState<string>('');
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
    toggleService,
    generarResumen,
    guardarFormulario,
    cargarFormulario
  } = useHistoriaClinica();

  const cerrarFormulario = () => {
    // Reset to initial state
    const initialFormState = useHistoriaClinica().formData;
    cargarFormulario(initialFormState);
    setPacienteActual('');
  };

  return (
    <div className={`${theme} min-h-screen w-full flex`}>
      <FormulariosSidebar 
        onCargarFormulario={(data, nombre) => {
          cargarFormulario(data);
          setPacienteActual(nombre);
        }}
        onGuardarFormulario={(nombre) => guardarFormulario(formData, nombre)}
        onCerrarFormulario={cerrarFormulario}
        pacienteActual={pacienteActual}
      />
      
      <div className={`${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'} flex-1 py-12 px-4 sm:px-6 lg:px-8 transition-colors duration-200`}>
        <div className="max-w-5xl mx-auto space-y-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-2">Formulario IA</h1>
            <p className="text-sm text-gray-500 mb-8">
              (llena el formulario y deja que nuestra inteligencia artificial se encargue de hacer la redacción)
            </p>
            {pacienteActual && (
              <div className="text-sm text-primary mb-4 inline-flex items-center bg-primary/10 px-3 py-1 rounded-full">
                <span>Formulario del paciente: {pacienteActual}</span>
                <button 
                  onClick={cerrarFormulario}
                  className="ml-2 p-1 rounded-full hover:bg-primary/20 transition-colors"
                  aria-label="Cerrar formulario"
                >
                  <X className="h-4 w-4 text-primary" />
                </button>
              </div>
            )}
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
            
            <SignosVitales 
              formData={formData} 
              handleInputChange={handleInputChange} 
            />
            
            <DiagnosticoPronostico 
              formData={formData} 
              handleInputChange={handleInputChange} 
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
