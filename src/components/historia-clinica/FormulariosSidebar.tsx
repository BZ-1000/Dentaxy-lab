import { useState, useEffect } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Save, FileText, BookOpen } from "lucide-react";
import { FormDataState } from '@/types/historiaClinica';
import { useTheme } from '@/hooks/use-theme';
import { Sidebar, SidebarBody, SidebarLink, Logo, LogoIcon, useSidebar } from '@/components/ui/modern-sidebar';
interface FormulariosSidebarProps {
  onCargarFormulario: (data: FormDataState, nombre: string) => void;
  onGuardarFormulario: (nombre: string) => void;
}
const FormulariosSidebar = ({
  onCargarFormulario,
  onGuardarFormulario
}: FormulariosSidebarProps) => {
  const [nombrePaciente, setNombrePaciente] = useState('');
  const [formularios, setFormularios] = useState<{
    nombre: string;
    data: FormDataState;
  }[]>([]);
  const {
    theme
  } = useTheme();
  const [open, setOpen] = useState(false);

  // Load saved forms from localStorage on component mount
  useEffect(() => {
    const loadSavedForms = () => {
      const savedForms: {
        nombre: string;
        data: FormDataState;
      }[] = [];

      // Check localStorage for saved forms by looking for keys that match our pattern
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith('formulario_')) {
          const nombre = key.replace('formulario_', '');
          const data = JSON.parse(localStorage.getItem(key) || '{}');
          savedForms.push({
            nombre,
            data
          });
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
        return prev.map(f => f.nombre === nombrePaciente ? {
          nombre: nombrePaciente,
          data: newData
        } : f);
      } else {
        // Add new form
        return [...prev, {
          nombre: nombrePaciente,
          data: newData
        }];
      }
    });
    setNombrePaciente('');
  };

  // Custom dental icon that changes color based on theme
  const DentalIcon = () => <BookOpen className="flex-shrink-0" size={24} color={theme === 'dark' ? 'white' : '#3b82f6'} />;
  return <Sidebar open={open} setOpen={setOpen} animate={true}>
      <SidebarBody className="border-r bg-slate-50 rounded-none">
        <div className="flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
          {open ? <Logo>
              <DentalIcon />
            </Logo> : <LogoIcon>
              <DentalIcon />
            </LogoIcon>}
          
          <div className="mt-8 flex flex-col gap-4">
            {open && <div className="space-y-2">
                
                <div className="space-y-2">
                  <Input placeholder="Nombre del paciente" value={nombrePaciente} onChange={e => setNombrePaciente(e.target.value)} className="bg-white dark:bg-neutral-700" />
                  <Button onClick={handleGuardarFormulario} className="w-full bg-primary hover:bg-primary/90" disabled={!nombrePaciente.trim()}>
                    <Save className="w-4 h-4 mr-2" />
                    Guardar Formulario
                  </Button>
                </div>
              </div>}
            
            <ScrollArea className={open ? "h-[calc(100vh-200px)]" : "h-[calc(100vh-100px)]"}>
              <div className="space-y-1 pr-2">
                {formularios.map((form, index) => <SidebarLink key={index} link={{
                label: form.nombre,
                icon: <FileText className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />,
                onClick: () => onCargarFormulario(form.data, form.nombre)
              }} className="hover:bg-neutral-200 dark:hover:bg-neutral-700 rounded-md px-2" />)}
              </div>
            </ScrollArea>
          </div>
        </div>
      </SidebarBody>
    </Sidebar>;
};
export default FormulariosSidebar;