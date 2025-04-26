
import React, { useState } from "react";
import { Accordion, AccordionItem, AccordionContent, AccordionTrigger } from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { ModernSidebar, SidebarHeader, SidebarFooter } from "@/components/ui/modern-sidebar";
import { FormDataState } from '@/types/historiaClinica';

// Define the props for the FormulariosSidebar component
interface FormulariosSidebarProps {
  onTabChange: (tabName: string) => void;
  onCargarFormulario?: (data: FormDataState, nombre: string) => void;
  onGuardarFormulario?: (nombre: string) => void;
  onCerrarFormulario?: () => void;
  onResetFormulario?: () => void;
  pacienteActual?: string;
}

export const FormulariosSidebar = ({ 
  onTabChange,
  onCargarFormulario,
  onGuardarFormulario,
  onCerrarFormulario,
  onResetFormulario,
  pacienteActual
}: FormulariosSidebarProps) => {
  const [currentTab, setCurrentTab] = useState<string | null>("InformacionPrincipal");
  // Initialize completedSections with a default empty object to avoid null/undefined errors
  const [completedSections, setCompletedSections] = useState<Record<string, { completed: boolean }>>({});
  
  const handleTabClick = (tabName: string) => {
    setCurrentTab(tabName);
    onTabChange(tabName);
    
    // Scroll al inicio de la página para mostrar el formulario seleccionado
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };
  
  // Función para verificar si una pestaña está completa
  const isTabComplete = (tabName: string) => {
    return completedSections[tabName]?.completed || false;
  };
  
  // Obtener el progreso general
  const calculateProgress = () => {
    if (!completedSections || Object.keys(completedSections).length === 0) {
      return 0;
    }
    const totalSections = Object.keys(completedSections).length;
    const completedCount = Object.values(completedSections).filter(section => section.completed).length;
    return totalSections > 0 ? Math.round((completedCount / totalSections) * 100) : 0;
  };

  const progress = calculateProgress();
  const gender = "female"; // Default value to ensure the component renders without errors
  
  return (
    <ModernSidebar className="w-72 bg-background" position="left">
      <SidebarHeader 
        title="Historia Clínica Dental"
        description={`Progreso: ${progress}%`}
        logo={<div className="h-8 w-8">
          <img src="/lovable-uploads/5636450b-9d56-40a0-b095-dd830e161077.png" alt="Logo" 
               className="h-full w-full object-contain" />
        </div>}
      />
      
      <div className="flex-1 overflow-auto py-2">
        <Accordion type="multiple" defaultValue={["antecedentes", "exploracion", "diagnostico"]}>
          {/* Información Básica */}
          <Button 
            variant={currentTab === "InformacionPrincipal" ? "default" : "ghost"} 
            className={cn(
              "w-full justify-start px-4 py-2 mb-1",
              isTabComplete("InformacionPrincipal") && "border-l-4 border-green-500"
            )}
            onClick={() => handleTabClick("InformacionPrincipal")}
          >
            Información Principal
          </Button>
          
          {/* Antecedentes */}
          <AccordionItem value="antecedentes">
            <AccordionTrigger className="px-4">Antecedentes</AccordionTrigger>
            <AccordionContent className="pl-2">
              <div className="flex flex-col gap-1">
                <Button 
                  variant={currentTab === "AntecedentesHeredoFamiliares" ? "default" : "ghost"} 
                  className={cn(
                    "w-full justify-start text-sm",
                    isTabComplete("AntecedentesHeredoFamiliares") && "border-l-4 border-green-500"
                  )}
                  onClick={() => handleTabClick("AntecedentesHeredoFamiliares")}
                >
                  Heredo-Familiares
                </Button>
                
                <Button 
                  variant={currentTab === "AntecedentesPersonalesPatologicos" ? "default" : "ghost"} 
                  className={cn(
                    "w-full justify-start text-sm",
                    isTabComplete("AntecedentesPersonalesPatologicos") && "border-l-4 border-green-500"
                  )}
                  onClick={() => handleTabClick("AntecedentesPersonalesPatologicos")}
                >
                  Personales Patológicos
                </Button>
                
                <Button 
                  variant={currentTab === "AntecedentesPersonalesNoPatologicos" ? "default" : "ghost"} 
                  className={cn(
                    "w-full justify-start text-sm",
                    isTabComplete("AntecedentesPersonalesNoPatologicos") && "border-l-4 border-green-500"
                  )}
                  onClick={() => handleTabClick("AntecedentesPersonalesNoPatologicos")}
                >
                  Personales No Patológicos
                </Button>
                
                <Button 
                  variant={currentTab === "AntecedentesAlergicos" ? "default" : "ghost"} 
                  className={cn(
                    "w-full justify-start text-sm",
                    isTabComplete("AntecedentesAlergicos") && "border-l-4 border-green-500"
                  )}
                  onClick={() => handleTabClick("AntecedentesAlergicos")}
                >
                  Alérgicos
                </Button>
                
                <Button 
                  variant={currentTab === "AntecedentesHemorragicos" ? "default" : "ghost"} 
                  className={cn(
                    "w-full justify-start text-sm",
                    isTabComplete("AntecedentesHemorragicos") && "border-l-4 border-green-500"
                  )}
                  onClick={() => handleTabClick("AntecedentesHemorragicos")}
                >
                  Hemorrágicos
                </Button>
                
                <Button 
                  variant={currentTab === "AntecedentesQuirurgicos" ? "default" : "ghost"} 
                  className={cn(
                    "w-full justify-start text-sm",
                    isTabComplete("AntecedentesQuirurgicos") && "border-l-4 border-green-500"
                  )}
                  onClick={() => handleTabClick("AntecedentesQuirurgicos")}
                >
                  Quirúrgicos
                </Button>
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* Secciones específicas para mujeres */}
          {gender === 'female' && (
            <Button 
              variant={currentTab === "AntecedentesGinecoObstetricos" ? "default" : "ghost"} 
              className={cn(
                "w-full justify-start px-4 py-2 mb-1",
                isTabComplete("AntecedentesGinecoObstetricos") && "border-l-4 border-green-500"
              )}
              onClick={() => handleTabClick("AntecedentesGinecoObstetricos")}
            >
              Gineco-Obstétricos
            </Button>
          )}

          {/* Padecimiento Actual */}
          <Button 
            variant={currentTab === "PadecimientoActual" ? "default" : "ghost"} 
            className={cn(
              "w-full justify-start px-4 py-2 mb-1",
              isTabComplete("PadecimientoActual") && "border-l-4 border-green-500"
            )}
            onClick={() => handleTabClick("PadecimientoActual")}
          >
            Padecimiento Actual
          </Button>
          
          {/* Exploración Física */}
          <AccordionItem value="exploracion">
            <AccordionTrigger className="px-4">Exploración Física</AccordionTrigger>
            <AccordionContent className="pl-2">
              <div className="flex flex-col gap-1">
                <Button 
                  variant={currentTab === "ExamenCabeza" ? "default" : "ghost"} 
                  className={cn(
                    "w-full justify-start text-sm",
                    isTabComplete("ExamenCabeza") && "border-l-4 border-green-500"
                  )}
                  onClick={() => handleTabClick("ExamenCabeza")}
                >
                  Cabeza
                </Button>
                
                <Button 
                  variant={currentTab === "ExamenCuello" ? "default" : "ghost"} 
                  className={cn(
                    "w-full justify-start text-sm",
                    isTabComplete("ExamenCuello") && "border-l-4 border-green-500"
                  )}
                  onClick={() => handleTabClick("ExamenCuello")}
                >
                  Cuello
                </Button>
                
                <Button 
                  variant={currentTab === "GlandulasSalivales" ? "default" : "ghost"} 
                  className={cn(
                    "w-full justify-start text-sm",
                    isTabComplete("GlandulasSalivales") && "border-l-4 border-green-500"
                  )}
                  onClick={() => handleTabClick("GlandulasSalivales")}
                >
                  Glándulas Salivales
                </Button>
                
                <Button 
                  variant={currentTab === "ExamenIntrabucal" ? "default" : "ghost"} 
                  className={cn(
                    "w-full justify-start text-sm",
                    isTabComplete("ExamenIntrabucal") && "border-l-4 border-green-500"
                  )}
                  onClick={() => handleTabClick("ExamenIntrabucal")}
                >
                  Examen Intrabucal
                </Button>
                
                <Button 
                  variant={currentTab === "LineaMedia" ? "default" : "ghost"} 
                  className={cn(
                    "w-full justify-start text-sm",
                    isTabComplete("LineaMedia") && "border-l-4 border-green-500"
                  )}
                  onClick={() => handleTabClick("LineaMedia")}
                >
                  Línea Media
                </Button>
                
                <Button 
                  variant={currentTab === "Frenillos" ? "default" : "ghost"} 
                  className={cn(
                    "w-full justify-start text-sm",
                    isTabComplete("Frenillos") && "border-l-4 border-green-500"
                  )}
                  onClick={() => handleTabClick("Frenillos")}
                >
                  Frenillos
                </Button>
                
                <Button 
                  variant={currentTab === "Oclusion" ? "default" : "ghost"} 
                  className={cn(
                    "w-full justify-start text-sm",
                    isTabComplete("Oclusion") && "border-l-4 border-green-500"
                  )}
                  onClick={() => handleTabClick("Oclusion")}
                >
                  Oclusión
                </Button>
                
                <Button 
                  variant={currentTab === "RelacionDientes" ? "default" : "ghost"} 
                  className={cn(
                    "w-full justify-start text-sm",
                    isTabComplete("RelacionDientes") && "border-l-4 border-green-500"
                  )}
                  onClick={() => handleTabClick("RelacionDientes")}
                >
                  Relación de Dientes
                </Button>
                
                <Button 
                  variant={currentTab === "ArticulacionCraneomandibular" ? "default" : "ghost"} 
                  className={cn(
                    "w-full justify-start text-sm",
                    isTabComplete("ArticulacionCraneomandibular") && "border-l-4 border-green-500"
                  )}
                  onClick={() => handleTabClick("ArticulacionCraneomandibular")}
                >
                  Art. Craneomandibular
                </Button>
              </div>
            </AccordionContent>
          </AccordionItem>
          
          {/* Diagnóstico y Plan */}
          <AccordionItem value="diagnostico">
            <AccordionTrigger className="px-4">Diagnóstico y Plan</AccordionTrigger>
            <AccordionContent className="pl-2">
              <div className="flex flex-col gap-1">
                <Button 
                  variant={currentTab === "InterrogatorioSistemas" ? "default" : "ghost"} 
                  className={cn(
                    "w-full justify-start text-sm",
                    isTabComplete("InterrogatorioSistemas") && "border-l-4 border-green-500"
                  )}
                  onClick={() => handleTabClick("InterrogatorioSistemas")}
                >
                  Interrogatorio por Sistemas
                </Button>
                
                <Button 
                  variant={currentTab === "Diagnostico" ? "default" : "ghost"} 
                  className={cn(
                    "w-full justify-start text-sm",
                    isTabComplete("Diagnostico") && "border-l-4 border-green-500"
                  )}
                  onClick={() => handleTabClick("Diagnostico")}
                >
                  Diagnóstico
                </Button>
                
                <Button 
                  variant={currentTab === "Pronostico" ? "default" : "ghost"} 
                  className={cn(
                    "w-full justify-start text-sm",
                    isTabComplete("Pronostico") && "border-l-4 border-green-500"
                  )}
                  onClick={() => handleTabClick("Pronostico")}
                >
                  Pronóstico
                </Button>
              </div>
            </AccordionContent>
          </AccordionItem>
          
          {/* Resumen */}
          <Button 
            variant={currentTab === "ResumenHistoriaClinica" ? "default" : "ghost"} 
            className={cn(
              "w-full justify-start px-4 py-2 mt-1",
              isTabComplete("ResumenHistoriaClinica") && "border-l-4 border-green-500"
            )}
            onClick={() => handleTabClick("ResumenHistoriaClinica")}
          >
            Resumen y Exportar
          </Button>
        </Accordion>
      </div>
      
      <SidebarFooter>
        <div className="text-xs text-muted-foreground">
          <p>© 2025 Dental Basics Academy</p>
          <p>Versión Beta</p>
        </div>
      </SidebarFooter>
    </ModernSidebar>
  );
};

export default FormulariosSidebar;
