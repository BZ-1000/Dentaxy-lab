import { useState, useEffect } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { FileText, BookOpen, Trash, Pencil, Share2 } from "lucide-react";
import { FormDataState } from '@/types/historiaClinica';
import { useTheme } from '@/hooks/use-theme';
import { Sidebar, SidebarBody, SidebarLink, Logo, LogoIcon } from '@/components/ui/modern-sidebar';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
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
  const { theme } = useTheme();
  const [open, setOpen] = useState(true); // Mantener abierto por defecto en desktop
  const [dialogOpen, setDialogOpen] = useState(false);
  const [alertDialogOpen, setAlertDialogOpen] = useState(false);
  const [accionFormulario, setAccionFormulario] = useState<'eliminar' | 'renombrar' | 'compartir' | null>(null);
  const [formularioSeleccionado, setFormularioSeleccionado] = useState<string | null>(null);
  const [nuevoNombre, setNuevoNombre] = useState('');
  const [emailCompartir, setEmailCompartir] = useState('');

  // --- Toda tu lógica de funciones (loadSavedForms, handleGuardar, etc.) permanece sin cambios ---
  // ... (se omite por brevedad, pero debe estar aquí en tu archivo)
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
        savedForms.push({ nombre, data });
      }
    }
    setFormularios(savedForms);
  };

  useEffect(() => {
    loadSavedForms();
  }, []);

  const handleGuardarFormulario = () => {
    if (!nombrePaciente.trim()) return;
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
      setNuevoNombre(action === 'renombrar' ? nombre : '');
      setEmailCompartir('');
      setDialogOpen(true);
    }
  };

  return (
    // CAMBIO 1: El contenedor principal ahora usa max-h-screen.
    // Se "pegará" al borde superior (top-0) cuando hagas scroll,
    // y su altura máxima será la de la pantalla, evitando desbordamientos.
    <div className="sticky top-0 max-h-screen hidden md:block">
      <Sidebar open={open} setOpen={setOpen} animate={true}>
        {/* CAMBIO 2: SidebarBody es ahora un contenedor flex vertical (flex-col)
            que ocupa toda la altura disponible (h-full). */}
        <SidebarBody className="bg-slate-50 flex flex-col h-full">
          {/* SECCIÓN SUPERIOR (CABECERA): No es sticky, es parte del flujo flex. */}
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
          </div>

          {/* CAMBIO 3: SECCIÓN DE CONTENIDO (LISTA).
              - flex-1: Hace que esta sección ocupe todo el espacio vertical restante.
              - overflow-y-auto: Muestra una barra de scroll solo si la lista es muy larga. */}
          <div className="flex-1 overflow-y-auto">
            <ScrollArea className="h-full p-4">
              <div className="space-y-2">
                {formularios.map((form) => (
                  <div key={form.nombre} className="group flex justify-between items-center w-full">
                    <SidebarLink
                      link={{
                        label: form.nombre,
                        icon: <FileText className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />,
                        onClick: () => onCargarFormulario(form.data, form.nombre)
                      }}
                      className="hover:bg-neutral-200 dark:hover:bg-neutral-700 rounded-md px-2 py-1 flex-1 min-w-0"
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

      {/* Los diálogos y alertas permanecen sin cambios */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        {/* ... Contenido del Dialog ... */}
        <DialogContent>
            <DialogHeader>
                <DialogTitle>
                    {accionFormulario === 'renombrar' ? 'Renombrar formulario' : 'Compartir formulario'}
                </DialogTitle>
                <DialogDescription>
                    {accionFormulario === 'renombrar'
                    ? 'Ingrese el nuevo nombre para el formulario.'
                    : 'Ingrese el correo electrónico para compartir el formulario.'}
                </DialogDescription>
            </DialogHeader>
            {accionFormulario === 'renombrar' && (
                <div className="grid gap-4 py-4">
                    <Input
                    placeholder="Nuevo nombre"
                    value={nuevoNombre}
                    onChange={(e) => setNuevoNombre(e.target.value)}
                    className="col-span-3"
                    />
                </div>
            )}
            {accionFormulario === 'compartir' && (
                <div className="grid gap-4 py-4">
                    <Input
                    placeholder="Correo electrónico"
                    value={emailCompartir}
                    onChange={(e) => setEmailCompartir(e.target.value)}
                    className="col-span-3"
                    />
                </div>
            )}
            <DialogFooter>
                <Button onClick={() => setDialogOpen(false)} variant="outline">
                    Cancelar
                </Button>
                <Button
                    onClick={accionFormulario === 'renombrar' ? handleRenombrarFormulario : handleCompartirFormulario}
                >
                    {accionFormulario === 'renombrar' ? 'Renombrar' : 'Compartir'}
                </Button>
            </DialogFooter>
        </DialogContent>
      </Dialog>
      <AlertDialog open={alertDialogOpen} onOpenChange={setAlertDialogOpen}>
        {/* ... Contenido del AlertDialog ... */}
        <AlertDialogContent>
            <AlertDialogHeader>
                <AlertDialogTitle>¿Está seguro de eliminar este formulario?</AlertDialogTitle>
                <AlertDialogDescription>
                Esta acción no se puede deshacer. Eliminará permanentemente el formulario de {formularioSeleccionado} y todos sus datos asociados.
                </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                <AlertDialogAction
                onClick={handleEliminarFormulario}
                className="bg-red-500 hover:bg-red-600"
                >
                Eliminar
                </AlertDialogAction>
            </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default FormulariosSidebar;