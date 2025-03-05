import { useState, useEffect } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Save, FileText, BookOpen, Trash, Pencil, Share2, X } from "lucide-react";
import { FormDataState } from '@/types/historiaClinica';
import { useTheme } from '@/hooks/use-theme';
import { Sidebar, SidebarBody, SidebarLink, Logo, LogoIcon, useSidebar } from '@/components/ui/modern-sidebar';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from "@/components/ui/dialog";
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
  const [formularios, setFormularios] = useState<{
    nombre: string;
    data: FormDataState;
  }[]>([]);
  const {
    theme
  } = useTheme();
  const [open, setOpen] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [accionFormulario, setAccionFormulario] = useState<'eliminar' | 'renombrar' | 'compartir' | null>(null);
  const [formularioSeleccionado, setFormularioSeleccionado] = useState<string | null>(null);
  const [nuevoNombre, setNuevoNombre] = useState('');
  const [emailCompartir, setEmailCompartir] = useState('');
  const loadSavedForms = () => {
    const savedForms: {
      nombre: string;
      data: FormDataState;
    }[] = [];
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
  useEffect(() => {
    loadSavedForms();
  }, []);
  const handleGuardarFormulario = () => {
    if (!nombrePaciente.trim()) {
      return;
    }
    onGuardarFormulario(nombrePaciente);
    loadSavedForms();
    setNombrePaciente('');
    toast({
      title: "Formulario guardado",
      description: `El formulario de ${nombrePaciente} ha sido guardado exitosamente.`
    });
  };
  const handleEliminarFormulario = () => {
    if (!formularioSeleccionado) return;
    localStorage.removeItem(`formulario_${formularioSeleccionado}`);
    loadSavedForms();
    setDialogOpen(false);
    if (formularioSeleccionado === pacienteActual) {
      onCerrarFormulario();
    }
    toast({
      title: "Formulario eliminado",
      description: `El formulario de ${formularioSeleccionado} ha sido eliminado.`
    });
  };
  const handleRenombrarFormulario = () => {
    if (!formularioSeleccionado || !nuevoNombre.trim()) return;
    const oldData = localStorage.getItem(`formulario_${formularioSeleccionado}`);
    if (oldData) {
      localStorage.setItem(`formulario_${nuevoNombre}`, oldData);
      localStorage.removeItem(`formulario_${formularioSeleccionado}`);
      if (formularioSeleccionado === pacienteActual) {
        const data = JSON.parse(oldData);
        onCargarFormulario(data, nuevoNombre);
      }
      loadSavedForms();
      setDialogOpen(false);
      toast({
        title: "Formulario renombrado",
        description: `El formulario ha sido renombrado a ${nuevoNombre}.`
      });
    }
  };
  const handleCompartirFormulario = () => {
    if (!formularioSeleccionado || !emailCompartir.trim()) return;
    toast({
      title: "Formulario compartido",
      description: `Se ha compartido el formulario de ${formularioSeleccionado} con ${emailCompartir}.`
    });
    setDialogOpen(false);
  };
  const handleFormularioAction = (action: 'eliminar' | 'renombrar' | 'compartir', nombre: string) => {
    setAccionFormulario(action);
    setFormularioSeleccionado(nombre);
    if (action === 'renombrar') {
      setNuevoNombre(nombre);
    } else {
      setNuevoNombre('');
    }
    setEmailCompartir('');
    setDialogOpen(true);
  };
  const handleQuitarNombre = () => {
    setNombrePaciente('');
    onCerrarFormulario();
    toast({
      title: "Formulario reseteado",
      description: "El formulario ha sido reseteado y el nombre del paciente eliminado."
    });
  };
  return <>
      <div className="">
        <div className="sticky top-0 h-screen">
          <Sidebar open={open} setOpen={setOpen} animate={true}>
            <SidebarBody className="border-r bg-slate-50 h-full flex flex-col">
              <div className="sticky top-0 bg-slate-50 z-10">
                <div className="flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
                  {open ? <Logo>
                      <BookOpen className="flex-shrink-0" size={24} color={theme === 'dark' ? 'white' : '#3b82f6'} />
                    </Logo> : <LogoIcon>
                      <BookOpen className="flex-shrink-0" size={24} color={theme === 'dark' ? 'white' : '#3b82f6'} />
                    </LogoIcon>}

                  <div className="mt-8 flex flex-col gap-4">
                    {open && <div className="space-y-2">
                        <div className="space-y-2">
                          <Input placeholder="Nombre del paciente" value={nombrePaciente} onChange={e => setNombrePaciente(e.target.value)} className="bg-white dark:bg-neutral-700" />
                          <Button onClick={handleGuardarFormulario} disabled={!nombrePaciente.trim()} className="w-full bg-violet-600 hover:bg-violet-500">
                            <Save className="w-4 h-4 mr-2" />
                            Guardar Formulario
                          </Button>
                        </div>
                      </div>}
                  </div>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto">
                <ScrollArea className="flex-1">
                  <div className="space-y-1 pr-2">
                    {formularios.map((form, index) => <div key={index} className="group flex justify-between items-center mb-2">
                        <SidebarLink link={{
                      label: form.nombre,
                      icon: <FileText className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />,
                      onClick: () => onCargarFormulario(form.data, form.nombre)
                    }} className="hover:bg-neutral-200 dark:hover:bg-neutral-700 rounded-md px-2 flex-1" />
                        {open && <div className="flex gap-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button onClick={() => handleFormularioAction('renombrar', form.nombre)} className="p-1 rounded-md hover:bg-neutral-200 dark:hover:bg-neutral-700">
                              <Pencil className="h-3.5 w-3.5 text-neutral-500 dark:text-neutral-400" />
                            </button>
                            <button onClick={() => handleFormularioAction('compartir', form.nombre)} className="p-1 rounded-md hover:bg-neutral-200 dark:hover:bg-neutral-700">
                              <Share2 className="h-3.5 w-3.5 text-neutral-500 dark:text-neutral-400" />
                            </button>
                            <button onClick={() => handleFormularioAction('eliminar', form.nombre)} className="p-1 rounded-md hover:bg-neutral-200 dark:hover:bg-neutral-700">
                              <Trash className="h-3.5 w-3.5 text-red-500" />
                            </button>
                          </div>}
                      </div>)}
                  </div>
                </ScrollArea>
              </div>
            </SidebarBody>
          </Sidebar>
        </div>

        {pacienteActual}
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>
              {accionFormulario === 'eliminar' ? 'Eliminar formulario' : accionFormulario === 'renombrar' ? 'Renombrar formulario' : 'Compartir formulario'}
            </DialogTitle>
            <DialogDescription>
              {accionFormulario === 'eliminar' ? `¿Estás seguro de que deseas eliminar el formulario de ${formularioSeleccionado}?` : accionFormulario === 'renombrar' ? 'Introduce el nuevo nombre para este formulario.' : 'Introduce el correo electrónico con quien deseas compartir este formulario.'}
            </DialogDescription>
          </DialogHeader>

          {accionFormulario === 'renombrar' && <div className="py-4">
              <Input value={nuevoNombre} onChange={e => setNuevoNombre(e.target.value)} placeholder="Nuevo nombre" className="w-full" />
            </div>}

          {accionFormulario === 'compartir' && <div className="py-4">
              <Input value={emailCompartir} onChange={e => setEmailCompartir(e.target.value)} placeholder="Correo electrónico" type="email" className="w-full" />
            </div>}

          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancelar</Button>
            </DialogClose>
            <Button variant={accionFormulario === 'eliminar' ? 'destructive' : 'default'} onClick={accionFormulario === 'eliminar' ? handleEliminarFormulario : accionFormulario === 'renombrar' ? handleRenombrarFormulario : handleCompartirFormulario} disabled={accionFormulario === 'renombrar' && !nuevoNombre.trim() || accionFormulario === 'compartir' && !emailCompartir.trim()}>
              {accionFormulario === 'eliminar' ? 'Eliminar' : accionFormulario === 'renombrar' ? 'Renombrar' : 'Compartir'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>;
};
export default FormulariosSidebar;