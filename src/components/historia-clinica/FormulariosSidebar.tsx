
import { useState } from 'react';
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

  const handleGuardarFormulario = () => {
    if (!nombrePaciente.trim()) {
      return;
    }
    onGuardarFormulario(nombrePaciente);
    setFormularios(prev => [...prev, { 
      nombre: nombrePaciente, 
      data: JSON.parse(localStorage.getItem(`formulario_${nombrePaciente}`) || '{}')
    }]);
    setNombrePaciente('');
  };

  return (
    <Sidebar className="w-[240px] border-r">
      <SidebarTrigger className="absolute left-[240px] top-4" />
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
