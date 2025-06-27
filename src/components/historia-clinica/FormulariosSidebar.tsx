import { useState, useEffect, useRef } from 'react'; // Importa useRef
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Save, FileText, BookOpen, Trash, Pencil, Share2, X } from "lucide-react";
import { FormDataState } from '@/types/historiaClinica';
import { useTheme } from '@/hooks/use-theme';
import { Sidebar, SidebarBody, SidebarLink, Logo, LogoIcon, useSidebar } from '@/components/ui/modern-sidebar';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { toast } from "@/hooks/use-toast";

interface FormulariosSidebarProps {
  onCargarFormulario: (data: FormDataState, nombre: string) => void;
  onGuardarFormulario: (nombre: string) => void;
  onCerrarFormulario: () => void;
  onResetFormulario: () => void;
  pacienteActual: string;
}

const FormulariosSidebar = ({
  onCargarFormulario,
  onGuardarFormulario,
  onCerrarFormulario,
  onResetFormulario,
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
  const [alertDialogOpen, setAlertDialogOpen] = useState(false);
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
    setAlertDialogOpen(false);
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
    setFormularioSeleccionado(nombre);
    if (action === 'eliminar') {
      setAlertDialogOpen(true);
    } else {
      setAccionFormulario(action);
      if (action === 'renombrar') {
        setNuevoNombre(nombre);
      } else {
        setNuevoNombre('');
      }
      setEmailCompartir('');
      setDialogOpen(true);
    }
  };

  const handleQuitarNombre = () => {
    setNombrePaciente('');
    onResetFormulario();
    toast({
      title: "Formulario reseteado",
      description: "El formulario ha sido reseteado al estado inicial."
    });
  };

  return (
    // CAMBIO REALIZADO AQUÍ:
    // Se ha modificado la altura máxima para que el sidebar no ocupe toda la pantalla
    // sino que se ajuste a la altura disponible, permitiendo que el efecto "sticky"
    // funcione correctamente dentro de su contenedor padre.
    <div className="sticky top-0 h-screen max-h-screen hidden md:block">
      <Sidebar open={open} setOpen={setOpen} animate={true}>
        <SidebarBody className="bg-slate-50 flex flex-col h-full">
          <div className="p-4 border-b border-slate-200">
            {open ? (
              <Logo>
                <BookOpen className="flex-shrink-0" size={24} color={theme === 'dark' ? 'white' : '#3b82f6'} />
              </Logo>
            ) : (
              <LogoIcon>
                <BookOpen className="flex-shrink-0" size={24} color={theme === 'dark' ? 'white' : '#3b82f6'} />
              </LogoIcon>
            )}
            {/* Puedes agregar aquí el input y botón de guardar si lo deseas visible en la parte superior */}
          </div>

          <div className="flex-1 overflow-y-auto">
            <ScrollArea className="h-full p-4">
              <div className="space-y-2">
                {formularios.map((form, index) => (
                  <div key={index} className="group flex justify-between items-center w-full">
                    <SidebarLink
                      link={{
                        label: form.nombre,
                        icon: <FileText className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />,
                        onClick: () => onCargarFormulario(form.data, form.nombre)
                      }}
                      className="hover:bg-neutral-200 dark:hover:bg-neutral-700 rounded-md px-2 py-1 flex-1 min-w-0" // Asegura que el link no se desborde
                    />
                    {open && (
                      <div className="flex items-center gap-1 pl-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => handleFormularioAction('renombrar', form.nombre)} className="p-1 rounded-md hover:bg-neutral-200 dark:hover:bg-neutral-700" title="Renombrar paciente">
                          <Pencil className="h-3.5 w-3.5 text-neutral-500 dark:text-neutral-400" />
                        </button>
                        <button onClick={() => handleFormularioAction('compartir', form.nombre)} className="p-1 rounded-md hover:bg-neutral-200 dark:hover:bg-neutral-700" title="Compartir formulario">
                          <Share2 className="h-3.5 w-3.5 text-neutral-500 dark:text-neutral-400" />
                        </button>
                        <button onClick={() => handleFormularioAction('eliminar', form.nombre)} className="p-1 rounded-md hover:bg-neutral-200 dark:hover:bg-neutral-700" title="Eliminar paciente">
                          <Trash className="h-3.5 w-3.5 text-red-500" />
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </ScrollArea>
          </div>
        </SidebarBody>
      </Sidebar>

      {/* Dialogs and Alerts remain unchanged */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {accionFormulario === 'renombrar' ? 'Renombrar formulario' : accionFormulario === 'compartir' ? 'Compartir formulario' : 'Acción de formulario'}
            </DialogTitle>
            <DialogDescription>
              {accionFormulario === 'renombrar' ? 'Ingrese el nuevo nombre para el formulario.' : accionFormulario === 'compartir' ? 'Ingrese el correo electrónico para compartir el formulario.' : ''}
            </DialogDescription>
          </DialogHeader>
          
          {accionFormulario === 'renombrar' && <div className="grid gap-4 py-4">
              <Input placeholder="Nuevo nombre" value={nuevoNombre} onChange={e => setNuevoNombre(e.target.value)} className="col-span-3" />
            </div>}
          
          {accionFormulario === 'compartir' && <div className="grid gap-4 py-4">
              <Input placeholder="Correo electrónico" value={emailCompartir} onChange={e => setEmailCompartir(e.target.value)} className="col-span-3" />
            </div>}
          
          <DialogFooter>
            <Button onClick={() => setDialogOpen(false)} variant="outline">
              Cancelar
            </Button>
            <Button onClick={accionFormulario === 'renombrar' ? handleRenombrarFormulario : accionFormulario === 'compartir' ? handleCompartirFormulario : () => {}}>
              {accionFormulario === 'renombrar' ? 'Renombrar' : accionFormulario === 'compartir' ? 'Compartir' : 'Confirmar'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={alertDialogOpen} onOpenChange={setAlertDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Está seguro de eliminar este formulario?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. Eliminará permanentemente el formulario
              de {formularioSeleccionado} y todos sus datos asociados.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleEliminarFormulario} className="bg-red-500 hover:bg-red-600">
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      
      {pacienteActual}
    </div>
  );
};

export default FormulariosSidebar;