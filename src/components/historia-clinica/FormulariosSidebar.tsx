
import { useState, useEffect } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Save, FileText, BookOpen, Trash, Pencil, Share2, X } from "lucide-react";
import { FormDataState } from '@/types/historiaClinica';
import { useTheme } from '@/hooks/use-theme';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { toast } from "@/hooks/use-toast";
import { useIsMobile } from '@/hooks/use-mobile';

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
  const isMobile = useIsMobile();

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

  // Función para cerrar el panel en móvil
  const handleCloseDialog = () => setDialogOpen(false);

  // Renderizamos diferente dependiendo de si es móvil o escritorio
  if (isMobile) {
    // Solo un botón minimalista con icono libro que abre el panel
    return (
      <>
        <div className="fixed bottom-6 left-6 z-50">
          <Button 
            variant="outline"
            onClick={() => setDialogOpen(true)}
            className="rounded-full p-3 shadow-md bg-white dark:bg-neutral-900"
            aria-label="Mostrar formularios guardados"
          >
            <BookOpen className="w-6 h-6 text-blue-600 dark:text-blue-400" />
          </Button>
        </div>

        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent className="max-w-xs w-full p-0 fixed left-0 top-0 h-full bg-white dark:bg-neutral-900 shadow-lg overflow-hidden">
            <DialogHeader className="flex items-center justify-between px-4 py-3 border-b border-gray-300 dark:border-gray-700">
              <DialogTitle className="text-lg font-semibold">Formularios Guardados</DialogTitle>
              <Button 
                variant="ghost"
                onClick={handleCloseDialog}
                aria-label="Cerrar formularios"
                className="p-1"
              >
                <X className="w-5 h-5" />
              </Button>
            </DialogHeader>

            <ScrollArea className="flex-1 overflow-y-auto h-[calc(100vh-56px)] px-2 pb-4">
              <div className="space-y-1">
                {formularios.map((form, index) => (
                  <div
                    key={index}
                    className="group flex justify-between items-center rounded-md px-3 py-2 cursor-pointer hover:bg-neutral-100 dark:hover:bg-neutral-800"
                    role="button"
                    tabIndex={0}
                    onClick={() => {
                      onCargarFormulario(form.data, form.nombre);
                      handleCloseDialog();
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        onCargarFormulario(form.data, form.nombre);
                        handleCloseDialog();
                      }
                    }}
                  >
                    <div className="flex items-center gap-2">
                      <FileText className="text-neutral-700 dark:text-neutral-200 w-5 h-5 flex-shrink-0" />
                      <span className="text-neutral-700 dark:text-neutral-200">{form.nombre}</span>
                    </div>
                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleFormularioAction('renombrar', form.nombre);
                        }}
                        className="p-1 rounded-md hover:bg-neutral-200 dark:hover:bg-neutral-700"
                        title="Renombrar paciente"
                        aria-label={`Renombrar formulario ${form.nombre}`}
                      >
                        <Pencil className="w-4 h-4 text-neutral-500 dark:text-neutral-400" />
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
                        <Share2 className="w-4 h-4 text-neutral-500 dark:text-neutral-400" />
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
                        <Trash className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </DialogContent>
        </Dialog>

        {/* Dialog for renaming or sharing */}
        <Dialog open={dialogOpen && accionFormulario !== null} onOpenChange={(open) => {
          if (!open) setAccionFormulario(null);
        }}>
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
                <Input placeholder="Nuevo nombre" value={nuevoNombre} onChange={e => setNuevoNombre(e.target.value)} className="col-span-3" />
              </div>
            )}

            {accionFormulario === 'compartir' && (
              <div className="grid gap-4 py-4">
                <Input placeholder="Correo electrónico" value={emailCompartir} onChange={e => setEmailCompartir(e.target.value)} className="col-span-3" />
              </div>
            )}

            <DialogFooter>
              <Button onClick={() => setDialogOpen(false)} variant="outline">
                Cancelar
              </Button>
              <Button
                onClick={
                  accionFormulario === 'renombrar'
                    ? handleRenombrarFormulario
                    : accionFormulario === 'compartir'
                    ? handleCompartirFormulario
                    : () => {}
                }
              >
                {accionFormulario === 'renombrar'
                  ? 'Renombrar'
                  : accionFormulario === 'compartir'
                  ? 'Compartir'
                  : 'Confirmar'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Alert Dialog for confirming deletion */}
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
      </>
    );
  }

  // En escritorio, mostrar la lista completa fija a la izquierda
  return (
    <div className="sticky top-0 h-screen w-72 bg-white dark:bg-neutral-900 border-r border-gray-300 dark:border-gray-700 p-4">
      <div className="flex items-center space-x-2 mb-4">
        <BookOpen size={24} color={theme === 'dark' ? 'white' : '#3b82f6'} />
        <h2 className="text-lg font-semibold text-neutral-700 dark:text-neutral-200">
          Formularios guardados
        </h2>
      </div>

      <ScrollArea className="h-[calc(100vh-96px)] flex flex-col">
        <div className="space-y-2">
          {formularios.map((form, index) => (
            <div
              key={index}
              className="group flex justify-between items-center rounded-md px-3 py-2 cursor-pointer hover:bg-neutral-100 dark:hover:bg-neutral-800"
              role="button"
              tabIndex={0}
              onClick={() => onCargarFormulario(form.data, form.nombre)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  onCargarFormulario(form.data, form.nombre);
                }
              }}
            >
              <div className="flex items-center gap-2">
                <FileText className="text-neutral-700 dark:text-neutral-200 w-5 h-5 flex-shrink-0" />
                <span className="text-neutral-700 dark:text-neutral-200">{form.nombre}</span>
              </div>

              <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleFormularioAction('renombrar', form.nombre);
                  }}
                  className="p-1 rounded-md hover:bg-neutral-200 dark:hover:bg-neutral-700"
                  title="Renombrar paciente"
                  aria-label={`Renombrar formulario ${form.nombre}`}
                >
                  <Pencil className="w-4 h-4 text-neutral-500 dark:text-neutral-400" />
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
                  <Share2 className="w-4 h-4 text-neutral-500 dark:text-neutral-400" />
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
                  <Trash className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>

      <div className="mt-4 flex justify-between items-center gap-2">
        <Input 
          placeholder="Nombre nuevo paciente" 
          value={nombrePaciente} 
          onChange={e => setNombrePaciente(e.target.value)} 
          className="flex-1" 
        />

        <Button onClick={handleGuardarFormulario} disabled={!nombrePaciente.trim()}>
          <Save className="w-4 h-4" />
          Guardar
        </Button>
      </div>
    </div>
  );
};

export default FormulariosSidebar;
