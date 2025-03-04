import { useState, useEffect } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Save, FileText, BookOpen, Trash, Pencil, Share2, X } from "lucide-react";
import { FormDataState } from '@/types/historiaClinica';
import { useTheme } from '@/hooks/use-theme';
import {
  Sidebar,
  SidebarBody,
  SidebarLink,
  Logo,
  LogoIcon,
  useSidebar
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
  const [formularios, setFormularios] = useState<{
    nombre: string;
    data: FormDataState;
  }[]>([]);
  const { theme } = useTheme();
  const [open, setOpen] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [accionFormulario, setAccionFormulario] = useState<'eliminar' | 'renombrar' | 'compartir' | null>(null);
  const [formularioSeleccionado, setFormularioSeleccionado] = useState<string | null>(null);
  const [nuevoNombre, setNuevoNombre] = useState('');
  const [emailCompartir, setEmailCompartir] = useState('');

  // Load saved forms from localStorage on component mount
  useEffect(() => {
    loadSavedForms();
  }, []);

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

  const handleGuardarFormulario = () => {
    if (!nombrePaciente.trim()) {
      return;
    }
    onGuardarFormulario(nombrePaciente);

    // Update the local state with the new form
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

    // If we're deleting the currently loaded form, close it
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

    // Get the data from the old key
    const oldData = localStorage.getItem(`formulario_${formularioSeleccionado}`);
    if (oldData) {
      // Save under the new key
      localStorage.setItem(`formulario_${nuevoNombre}`, oldData);
      // Remove the old key
      localStorage.removeItem(`formulario_${formularioSeleccionado}`);

      // If this is the current form, update its name
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

    // This would typically connect to a backend service
    // For now, we'll just show a toast message
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

  // Custom dental icon that changes color based on theme
  const DentalIcon = () => (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="flex-shrink-0"
    >
      <path
        d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"
        fill={theme === 'dark' ? 'white' : '#3b82f6'}
      />
      <path
        d="M9 10.5l3 3 3-3L12 7.5z"
        fill={theme === 'dark' ? 'white' : '#3b82f6'}
      />
    </svg>
  );

  return (
    <>
      <Sidebar open={open} setOpen={setOpen} animate={true}>
        <SidebarBody className="border-r bg-slate-50 dark:bg-neutral-800 flex flex-col h-full">
          <div className="flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
            {open ? <Logo>
                <DentalIcon />
              </Logo> : <LogoIcon>
                <DentalIcon />
              </LogoIcon>}

            <div className="mt-8 flex flex-col gap-4 sticky top-0">
              {open && (
                <div className="space-y-2 px-2">
                  <h2 className="font-semibold text-sm text-neutral-700 dark:text-neutral-300">Guardar Formulario</h2>
                  <div className="space-y-2">
                    <Input
                      placeholder="Nombre del paciente"
                      value={nombrePaciente}
                      onChange={e => setNombrePaciente(e.target.value)}
                      className="bg-white dark:bg-neutral-700 h-8 text-sm focus:ring-primary"
                    />
                    <Button
                      onClick={handleGuardarFormulario}
                      className="w-full bg-primary hover:bg-primary/90 h-8 text-sm"
                      disabled={!nombrePaciente.trim()}
                    >
                      <Save className="w-3.5 h-3.5 mr-2" />
                      Guardar
                    </Button>
                    <Button
                      onClick={handleQuitarNombre}
                      className="w-full bg-red-500 hover:bg-red-400 h-8 text-sm mt-2"
                      disabled={!nombrePaciente.trim()}
                    >
                      <X className="w-3.5 h-3.5 mr-2" />
                      Quitar Nombre
                    </Button>
                  </div>
                </div>
              )}

              <div className="px-2">
                <h2 className="font-semibold text-sm mb-2 text-neutral-700 dark:text-neutral-300">Formularios Guardados</h2>
                <ScrollArea className="h-[calc(100vh-200px)]">
                  <div className="space-y-1 pr-2">
                    {formularios.map((form, index) => (
                      <div key={index} className="group">
                        <SidebarLink
                          key={index}
                          link={{
                            label: form.nombre,
                            icon: <FileText className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />,
                            onClick: () => onCargarFormulario(form.data, form.nombre)
                          }}
                          className="hover:bg-neutral-200 dark:hover:bg-neutral-700 rounded-md px-2 flex justify-between"
                        />
                        {open && (
                          <div className="flex justify-end gap-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                              onClick={() => handleFormularioAction('renombrar', form.nombre)}
                              className="p-1 rounded-md hover:bg-neutral-200 dark:hover:bg-neutral-700"
                            >
                              <Pencil className="h-3.5 w-3.5 text-neutral-500 dark:text-neutral-400" />
                            </button>
                            <button
                              onClick={() => handleFormularioAction('compartir', form.nombre)}
                              className="p-1 rounded-md hover:bg-neutral-200 dark:hover:bg-neutral-700"
                            >
                              <Share2 className="h-3.5 w-3.5 text-neutral-500 dark:text-neutral-400" />
                            </button>
                            <button
                              onClick={() => handleFormularioAction('eliminar', form.nombre)}
                              className="p-1 rounded-md hover:bg-neutral-200 dark:hover:bg-neutral-700"
                            >
                              <Trash className="h-3.5 w-3.5 text-red-500" />
                            </button>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </div>
            </div>
          </div>
        </SidebarBody>
      </Sidebar>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>
              {accionFormulario === 'eliminar' ? 'Eliminar formulario' :
               accionFormulario === 'renombrar' ? 'Renombrar formulario' :
               'Compartir formulario'}
            </DialogTitle>
            <DialogDescription>
              {accionFormulario === 'eliminar' ?
                `¿Estás seguro de que deseas eliminar el formulario de ${formularioSeleccionado}?` :
               accionFormulario === 'renombrar' ?
                'Introduce el nuevo nombre para este formulario.' :
                'Introduce el correo electrónico con quien deseas compartir este formulario.'}
            </DialogDescription>
          </DialogHeader>

          {accionFormulario === 'renombrar' && (
            <div className="py-4">
              <Input
                value={nuevoNombre}
                onChange={(e) => setNuevoNombre(e.target.value)}
                placeholder="Nuevo nombre"
                className="w-full"
              />
            </div>
          )}

          {accionFormulario === 'compartir' && (
            <div className="py-4">
              <Input
                value={emailCompartir}
                onChange={(e) => setEmailCompartir(e.target.value)}
                placeholder="Correo electrónico"
                type="email"
                className="w-full"
              />
            </div>
          )}

          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancelar</Button>
            </DialogClose>
            <Button
              variant={accionFormulario === 'eliminar' ? 'destructive' : 'default'}
              onClick={
                accionFormulario === 'eliminar' ? handleEliminarFormulario :
                accionFormulario === 'renombrar' ? handleRenombrarFormulario :
                handleCompartirFormulario
              }
              disabled={
                (accionFormulario === 'renombrar' && !nuevoNombre.trim()) ||
                (accionFormulario === 'compartir' && !emailCompartir.trim())
              }
            >
              {accionFormulario === 'eliminar' ? 'Eliminar' :
               accionFormulario === 'renombrar' ? 'Renombrar' :
               'Compartir'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default FormulariosSidebar;
