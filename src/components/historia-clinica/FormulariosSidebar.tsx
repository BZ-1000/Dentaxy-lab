
import { useState, useEffect } from 'react';
import {
  Sidebar,
  SidebarContent,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Save, FileText } from "lucide-react";
import { FormDataState } from '@/types/historiaClinica';
import { useTheme } from '@/hooks/use-theme';

interface FormulariosSidebarProps {
  onCargarFormulario: (data: FormDataState, nombre: string) => void;
  onGuardarFormulario: (nombre: string) => void;
}

const FormulariosSidebar = ({
  onCargarFormulario,
  onGuardarFormulario
}: FormulariosSidebarProps) => {
  const [nombrePaciente, setNombrePaciente] = useState('');
  const [formularios, setFormularios] = useState<{ nombre: string; data: FormDataState }[]>([]);
  const { theme } = useTheme();

  // Load saved forms from localStorage on component mount
  useEffect(() => {
    const loadSavedForms = () => {
      const savedForms: { nombre: string; data: FormDataState }[] = [];
      
      // Check localStorage for saved forms by looking for keys that match our pattern
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith('formulario_')) {
          const nombre = key.replace('formulario_', '');
          const data = JSON.parse(localStorage.getItem(key) || '{}');
          savedForms.push({ nombre, data });
        }
      }
      
      setFormularios(savedForms);
    };
    
    loadSavedForms();
  }, []);

  const handleGuardarFormulario = () => {
    if (!nombrePaciente.trim()) {
      return;
    }
    onGuardarFormulario(nombrePaciente);
    
    // Update the local state with the new form
    const newData = JSON.parse(localStorage.getItem(`formulario_${nombrePaciente}`) || '{}');
    setFormularios(prev => {
      // Check if form with this name already exists
      const exists = prev.findIndex(f => f.nombre === nombrePaciente) >= 0;
      
      if (exists) {
        // Replace the existing form
        return prev.map(f => f.nombre === nombrePaciente ? { nombre: nombrePaciente, data: newData } : f);
      } else {
        // Add new form
        return [...prev, { nombre: nombrePaciente, data: newData }];
      }
    });
    
    setNombrePaciente('');
  };

  // Custom tooth icon that changes color based on theme
  const ToothIcon = () => (
    <svg 
      width="24" 
      height="24" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke={theme === 'dark' ? 'white' : '#3b82f6'} 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    >
      <path d="M12 5.5c-1.5-1-2.5-2-2.5-3.5 0-.8.2-1.5.6-2" />
      <path d="M17.9 5.5c1.5-1 2.6-2 2.6-3.5 0-.8-.2-1.5-.6-2" />
      <path d="M13 8c0-2 1-3.5 3-3.5s3 1.5 3 3.5c0 1.5-1 2.5-3 2.5-1 0-2-1-2-2Z" />
      <path d="M9.7 17c-.4.4-.7.9-.7 1.5V21h6v-3c0-1.5-1.5-2-2.5-2h-2.3c-.2 0-.5 0-.7.1-.1 0-.2.1-.3.2-.1.1-.2.1-.3.2l-.2.2c-.1.1-.1.2-.1.3" />
      <path d="M8 8c0-2-1-3.5-3-3.5S2 6 2 8c0 1.5 1 2.5 3 2.5 1 0 2-1 2-2Z" />
      <path d="M7 13c-1 1-1 2.3-1 4 0 .9.2 1.7.7 2.5" />
      <path d="M17 13c1 1 1 2.3 1 4 0 .9-.2 1.7-.7 2.5" />
      <path d="M12 10c-1.1 0-2 .9-2 2v2" />
      <path d="M14 10c1.1 0 2 .9 2 2v2" />
    </svg>
  );

  return (
    <Sidebar className="w-[240px] border-r">
      <SidebarTrigger className="absolute left-[240px] top-4">
        <ToothIcon />
      </SidebarTrigger>
      <SidebarContent>
        <div className="p-4 space-y-4">
          <h2 className="font-semibold">Formularios Guardados</h2>
          
          <div className="space-y-2">
            <Input
              placeholder="Nombre del paciente"
              value={nombrePaciente}
              onChange={(e) => setNombrePaciente(e.target.value)}
            />
            <Button 
              onClick={handleGuardarFormulario}
              className="w-full"
              disabled={!nombrePaciente.trim()}
            >
              <Save className="w-4 h-4 mr-2" />
              Guardar Formulario
            </Button>
          </div>

          <ScrollArea className="h-[calc(100vh-200px)]">
            <div className="space-y-2">
              {formularios.map((form, index) => (
                <Button
                  key={index}
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => onCargarFormulario(form.data, form.nombre)}
                >
                  <FileText className="w-4 h-4 mr-2" />
                  {form.nombre}
                </Button>
              ))}
            </div>
          </ScrollArea>
        </div>
      </SidebarContent>
    </Sidebar>
  );
};

export default FormulariosSidebar;
