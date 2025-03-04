import { useState, useEffect } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Save, FileText, BookOpen, Trash, Pencil, Share2, X } from "lucide-react";
import { FormDataState } from '@/types/historiaClinica';
import { useTheme } from '@/hooks/use-theme';
import {
  Sidebar,
  SidebarBody,
  SidebarLink,
  Logo,
  LogoIcon
} from '@/components/ui/modern-sidebar';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose
} from "@/components/ui/dialog";
import { toast } from "@/hooks/use-toast";

interface FormulariosSidebarProps {
  onCargarFormulario: (data: FormDataState, nombre: string) => void;
  onGuardarFormulario: (nombre: string) => void;
  onCerrarFormulario: () => void;
  pacienteActual: string;
}

const FormulariosSidebar = ({
  onCargarFormulario,
  onGuardarFormulario,
  onCerrarFormulario,
  pacienteActual
}: FormulariosSidebarProps) => {
  const [nombrePaciente, setNombrePaciente] = useState('');
  const [formularios, setFormularios] = useState<{ nombre: string; data: FormDataState; }[]>([]);
  const { theme } = useTheme();
  const [open, setOpen] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [accionFormulario, setAccionFormulario] = useState<'eliminar' | 'renombrar' | 'compartir' | null>(null);
  const [formularioSeleccionado, setFormularioSeleccionado] = useState<string | null>(null);
  const [nuevoNombre, setNuevoNombre] = useState('');
  const [emailCompartir, setEmailCompartir] = useState('');

  useEffect(() => {
    const savedForms: { nombre: string; data: FormDataState; }[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith('formulario_')) {
        const nombre = key.replace('formulario_', '');
        const data = JSON.parse(localStorage.getItem(key) || '{}');
        savedForms.push({ nombre, data });
      }
    }
    setFormularios(savedForms);
  }, []);

  const handleGuardarFormulario = () => {
    if (!nombrePaciente.trim()) return;
    onGuardarFormulario(nombrePaciente);
    setNombrePaciente('');
    toast({ title: "Formulario guardado", description: `El formulario de ${nombrePaciente} ha sido guardado exitosamente.` });
  };

  return (
    <div className="flex h-screen">
      <Sidebar open={open} setOpen={setOpen} animate={true} className="h-screen fixed top-0 left-0 w-64 bg-slate-50 flex flex-col shadow-lg">
        <SidebarBody className="flex flex-col h-full">
          <div className="p-4 border-b">
            {open ? <Logo><BookOpen size={24} color={theme === 'dark' ? 'white' : '#3b82f6'} /></Logo> : <LogoIcon><BookOpen size={24} color={theme === 'dark' ? 'white' : '#3b82f6'} /></LogoIcon>}
          </div>
          <div className="p-4">
            <Input placeholder="Nombre del paciente" value={nombrePaciente} onChange={e => setNombrePaciente(e.target.value)} className="bg-white dark:bg-neutral-700" />
            <Button onClick={handleGuardarFormulario} disabled={!nombrePaciente.trim()} className="w-full bg-violet-600 hover:bg-violet-500 mt-2">
              <Save className="w-4 h-4 mr-2" /> Guardar Formulario
            </Button>
          </div>
          <div className="flex-1 overflow-hidden p-4">
            <div className="space-y-1">
              {formularios.map((form, index) => (
                <div key={index} className="group flex justify-between items-center mb-2">
                  <SidebarLink link={{ label: form.nombre, icon: <FileText className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />, onClick: () => onCargarFormulario(form.data, form.nombre) }} className="hover:bg-neutral-200 dark:hover:bg-neutral-700 rounded-md px-2 flex-1" />
                </div>
              ))}
            </div>
          </div>
        </SidebarBody>
      </Sidebar>
    </div>
  );
};

export default FormulariosSidebar;
