
import { useState, useEffect } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Save, FileText, BookOpen, Trash, Pencil, Share2, X } from "lucide-react";
import { FormDataState } from '@/types/historiaClinica';
import { useTheme } from '@/hooks/use-theme';
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

  const handleQuitarNombre = () => {
    setNombrePaciente('');
    onResetFormulario();
    toast({
      title: "Formulario reseteado",
      description: "El formulario ha sido reseteado al estado inicial."
    });
  };

  return (
    <div className="h-screen bg-white dark:bg-neutral-900 border-r border-gray-200 dark:border-gray-700 w-64">
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-2 mb-4">
          <BookOpen size={24} color={theme === 'dark' ? 'white' : '#3b82f6'} />
          <span className="font-semibold text-gray-800 dark:text-white">Formularios</span>
        </div>
        
        <div className="space-y-2">
          <Input
            placeholder="Nombre del paciente"
            value={nombrePaciente}
            onChange={(e) => setNombrePaciente(e.target.value)}
            className="text-sm"
          />
          <Button 
            onClick={handleGuardarFormulario} 
            disabled={!nombrePaciente.trim()}
            className="w-full text-sm"
            size="sm"
          >
            <Save className="w-4 h-4 mr-1" />
            Guardar
          </Button>
        </div>
      </div>

      <ScrollArea className="flex-1 p-2">
        <div className="space-y-1">
          {formularios.map((form, index) => (
            <div key={index} className="group flex justify-between items-center p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700">
              <button
                onClick={() => onCargarFormulario(form.data, form.nombre)}
                className="flex items-center gap-2 flex-1 text-left"
              >
                <FileText className="h-4 w-4 text-gray-500" />
                <span className="text-sm text-gray-700 dark:text-gray-300 truncate">
                  {form.nombre}
                </span>
              </button>
              
              <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => handleFormularioAction('renombrar', form.nombre)}
                  className="p-1 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600"
                  title="Renombrar paciente"
                >
                  <Pencil className="h-3 w-3 text-gray-500" />
                </button>
                <button
                  onClick={() => handleFormularioAction('compartir', form.nombre)}
                  className="p-1 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600"
                  title="Compartir formulario"
                >
                  <Share2 className="h-3 w-3 text-gray-500" />
                </button>
                <button
                  onClick={() => handleFormularioAction('eliminar', form.nombre)}
                  className="p-1 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600"
                  title="Eliminar paciente"
                >
                  <Trash className="h-3 w-3 text-red-500" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>

      {pacienteActual && (
        <div className="p-4 border-t border-gray-200 dark:border-gray-700">
          <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">
            Paciente actual: <span className="font-medium">{pacienteActual}</span>
          </div>
          <Button 
            onClick={handleQuitarNombre}
            variant="outline"
            size="sm"
            className="w-full"
          >
            <X className="w-4 h-4 mr-1" />
            Nuevo Formulario
          </Button>
        </div>
      )}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {accionFormulario === 'renombrar' ? 'Renombrar formulario' : 
               accionFormulario === 'compartir' ? 'Compartir formulario' : 'Acción de formulario'}
            </DialogTitle>
            <DialogDescription>
              {accionFormulario === 'renombrar' ? 'Ingrese el nuevo nombre para el formulario.' : 
               accionFormulario === 'compartir' ? 'Ingrese el correo electrónico para compartir el formulario.' : ''}
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
            <Button onClick={
              accionFormulario === 'renombrar' ? handleRenombrarFormulario : 
              accionFormulario === 'compartir' ? handleCompartirFormulario : 
              () => {}
            }>
              {accionFormulario === 'renombrar' ? 'Renombrar' : 
               accionFormulario === 'compartir' ? 'Compartir' : 'Confirmar'}
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
        </AlertDialogFooter>
      </AlertDialog>
    </div>
  );
};

export default FormulariosSidebar;
