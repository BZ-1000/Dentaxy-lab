
import { Toaster } from "@/components/ui/toaster";
import PadecimientoActual from './historia-clinica/PadecimientoActual';
import AntecedentesHeredoFamiliares from './historia-clinica/AntecedentesHeredoFamiliares';
import AntecedentesPersonalesNoPatologicos from './historia-clinica/AntecedentesPersonalesNoPatologicos';
import SignosVitales from './historia-clinica/SignosVitales';
import DiagnosticoPronostico from './historia-clinica/DiagnosticoPronostico';
import ResumenHistoriaClinica from './historia-clinica/ResumenHistoriaClinica';
import { Button } from "@/components/ui/button";
import { useTheme } from '@/hooks/use-theme';
import { Loader2 } from "lucide-react";
import { useHistoriaClinica } from '@/hooks/useHistoriaClinica';

const HistoriaClinica = () => {
  const { theme } = useTheme();
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
    generarResumen
  } = useHistoriaClinica();

  return (
    <div className={`${theme} min-h-screen`}>
      <div className={`${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'} py-12 px-4 sm:px-6 lg:px-8 transition-colors duration-200`}>
        <div className="max-w-5xl mx-auto space-y-8">
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

            <AntecedentesPersonalesNoPatologicos />
            
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

          <ResumenHistoriaClinica resumen={resumen} />
        </div>
      </div>
      <Toaster />
    </div>
  );
};

export default HistoriaClinica;
