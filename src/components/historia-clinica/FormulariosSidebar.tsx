import { useState, useEffect } from 'react';
import { ScrollArea } from "@/components/ui/scroll-area";
import { BookOpen, FileText, Trash, Pencil, Share2 } from "lucide-react";
import { FormDataState } from '@/types/historiaClinica';
import { useTheme } from '@/hooks/use-theme';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { toast } from "@/hooks/use-toast";
import { Button } from '@/components/ui/button';

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

  return (
    <div>
      {/* Sidebar solamente visible para md+ */}
      <div className="sticky top-0 h-screen w-72 flex-col bg-white dark:bg-neutral-900 border-r border-gray-300 dark:border-gray-700 z-20">
        <div className="sticky top-0 bg-slate-50 z-30 border-b border-gray-300 dark:border-gray-700 flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
          <div className="flex items-center gap-2 p-4">
            <BookOpen
              className="flex-shrink-0"
              size={24}
              color={theme === 'dark' ? 'white' : '#3b82f6'}
              aria-hidden="true"
            />
            <span className="font-medium text-gray-700 dark:text-gray-200 text-lg select-none">Formularios Guardados</span>
          </div>
          <ScrollArea className="flex-1 px-2 pb-4">
            <div className="space-y-1">
              {formularios.map((form) => (
                <div
                  key={form.nombre}
                  className="group flex justify-between items-center rounded-md px-3 py-2 cursor-pointer hover:bg-neutral-200 dark:hover:bg-neutral-700"
                  role="button"
                  tabIndex={0}
                  onClick={() => onCargarFormulario(form.data, form.nombre)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      onCargarFormulario(form.data, form.nombre);
                    }
                  }}
                >
                  <div className="flex items-center gap-3">
                    <FileText className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
                    <span className="text-sm font-medium truncate max-w-[150px]">{form.nombre}</span>
                  </div>

                  <div className="flex gap-2 opacity-0 group-hover:opacity-100 ml-1">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleFormularioAction('renombrar', form.nombre);
                      }}
                      className="p-1 rounded-md hover:bg-neutral-200 dark:hover:bg-neutral-700"
                      title="Renombrar paciente"
                      aria-label={`Renombrar formulario ${form.nombre}`}
                    >
                      <Pencil className="h-4 w-4 text-neutral-500 dark:text-neutral-400" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleFormularioAction('compartir', form.nombre);
                      }}
                      className="p-1 rounded-md hover:bg-neutral-200 dark:hover:bg-neutral-700"
                      title="Compartir formulario"
                      aria-label={`Compartir formulario ${form.nombre}`}
                    >
                      <Share2 className="h-4 w-4 text-neutral-500 dark:text-neutral-400" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleFormularioAction('eliminar', form.nombre);
                      }}
                      className="p-1 rounded-md hover:bg-neutral-200 dark:hover:bg-neutral-700 text-red-500"
                      title="Eliminar paciente"
                      aria-label={`Eliminar formulario ${form.nombre}`}
                    >
                      <Trash className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>
      </div>

      {/* Dialog para renombrar o compartir */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {accionFormulario === 'renombrar' ? 'Renombrar formulario' : accionFormulario === 'compartir' ? 'Compartir formulario' : 'Acción de formulario'}
            </DialogTitle>
            <DialogDescription>
              {accionFormulario === 'renombrar'
                ? 'Ingrese el nuevo nombre para el formulario.'
                : accionFormulario === 'compartir'
                  ? 'Ingrese el correo electrónico para compartir el formulario.'
                  : ''}
            </DialogDescription>
          </DialogHeader>

          {accionFormulario === 'renombrar' && (
            <div className="grid gap-4 py-4">
              <input placeholder="Nuevo nombre" value={nuevoNombre} onChange={e => setNuevoNombre(e.target.value)} className="col-span-3 border rounded px-2 py-1 text-sm" />
            </div>
          )}

          {accionFormulario === 'compartir' && (
            <div className="grid gap-4 py-4">
              <input placeholder="Correo electrónico" value={emailCompartir} onChange={e => setEmailCompartir(e.target.value)} className="col-span-3 border rounded px-2 py-1 text-sm" />
            </div>
          )}

          <DialogFooter>
            <button onClick={() => setDialogOpen(false)} className="btn btn-outline mr-2 px-5 py-2 rounded">
              Cancelar
            </button>
            <button
              onClick={
                accionFormulario === 'renombrar'
                  ? handleRenombrarFormulario
                  : accionFormulario === 'compartir'
                    ? handleCompartirFormulario
                    : () => {}
              }
              className="btn btn-primary px-5 py-2 rounded"
            >
              {accionFormulario === 'renombrar'
                ? 'Renombrar'
                : accionFormulario === 'compartir'
                  ? 'Compartir'
                  : 'Confirmar'}
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Alert Dialog para confirmar eliminación */}
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
    </div>
  );
};

export default FormulariosSidebar;
