
// Nuevo componente móvil para mostrar formularios guardados como lista estilo ChatGPT mobile

import React, { useState } from 'react';
import { FileText, Pencil, Trash, Share2, X } from "lucide-react";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { toast } from '@/hooks/use-toast';
import type { FormDataState } from '@/types/historiaClinica';

interface FormulariosSidebarMobileProps {
  formularios: {
    nombre: string;
    data: FormDataState;
  }[];
  onCargarFormulario: (data: FormDataState, nombre: string) => void;
  onCerrarFormulario: () => void;
  onResetFormulario: () => void;
  onGuardarFormulario: (nombre: string) => void;
  pacienteActual: string;
}

const FormulariosSidebarMobile = ({
  formularios,
  onCargarFormulario,
  onCerrarFormulario,
  onResetFormulario,
  onGuardarFormulario,
  pacienteActual
}: FormulariosSidebarMobileProps) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [alertDialogOpen, setAlertDialogOpen] = useState(false);
  const [accionFormulario, setAccionFormulario] = useState<'eliminar' | 'renombrar' | 'compartir' | null>(null);
  const [formularioSeleccionado, setFormularioSeleccionado] = useState<string | null>(null);
  const [nuevoNombre, setNuevoNombre] = useState('');
  const [emailCompartir, setEmailCompartir] = useState('');
  const [panelOpen, setPanelOpen] = useState(false);

  const handleFormularioAction = (action: 'eliminar' | 'renombrar' | 'compartir', nombre: string) => {
    setFormularioSeleccionado(nombre);
    setPanelOpen(true);
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

  const handleEliminarFormulario = () => {
    if (!formularioSeleccionado) return;
    localStorage.removeItem(`formulario_${formularioSeleccionado}`);
    setAlertDialogOpen(false);
    onCerrarFormulario();
    toast({
      title: "Formulario eliminado",
      description: `El formulario de ${formularioSeleccionado} ha sido eliminado.`,
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
      setDialogOpen(false);
      toast({
        title: "Formulario renombrado",
        description: `El formulario ha sido renombrado a ${nuevoNombre}.`,
      });
    }
  };

  const handleCompartirFormulario = () => {
    if (!formularioSeleccionado || !emailCompartir.trim()) return;
    toast({
      title: "Formulario compartido",
      description: `Se ha compartido el formulario de ${formularioSeleccionado} con ${emailCompartir}.`,
    });
    setDialogOpen(false);
  };

  return (
    <>
      <div className="md:hidden fixed bottom-0 inset-x-0 bg-white dark:bg-neutral-900 border-t border-gray-300 dark:border-gray-700 z-40 max-h-[70vh] overflow-auto">
        <div className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Formularios Guardados</h2>
          <button
            onClick={() => setPanelOpen(false)}
            className="p-1 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700"
            aria-label="Cerrar panel de formularios guardados"
          >
            <X size={20} />
          </button>
        </div>

        {formularios.length === 0 ? (
          <div className="p-4 text-center text-gray-500 dark:text-gray-400">No hay formularios guardados.</div>
        ) : (
          <ul className="divide-y divide-gray-200 dark:divide-gray-700">
            {formularios.map(({ nombre, data }) => (
              <li key={nombre} className="flex justify-between items-center p-4 hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer"
                onClick={() => {
                  onCargarFormulario(data, nombre);
                  setPanelOpen(false);
                }}
              >
                <div className="flex items-center gap-3">
                  <FileText className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                  <span className="text-sm font-medium truncate max-w-[150px]">{nombre}</span>
                </div>

                <div className="flex gap-2 items-center">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleFormularioAction('renombrar', nombre);
                    }}
                    title="Renombrar formulario"
                    aria-label={`Renombrar formulario ${nombre}`}
                    className="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700"
                  >
                    <Pencil className="w-4 h-4 text-gray-600 dark:text-gray-300" />
                  </button>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleFormularioAction('compartir', nombre);
                    }}
                    title="Compartir formulario"
                    aria-label={`Compartir formulario ${nombre}`}
                    className="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700"
                  >
                    <Share2 className="w-4 h-4 text-gray-600 dark:text-gray-300" />
                  </button>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleFormularioAction('eliminar', nombre);
                    }}
                    title="Eliminar formulario"
                    aria-label={`Eliminar formulario ${nombre}`}
                    className="p-1 rounded hover:bg-red-600 hover:bg-opacity-20"
                  >
                    <Trash className="w-4 h-4 text-red-600" />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Dialog for renaming or sharing */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {accionFormulario === 'renombrar'
                ? 'Renombrar formulario'
                : accionFormulario === 'compartir'
                  ? 'Compartir formulario'
                  : 'Acción de formulario'}
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
              <Input placeholder="Nuevo nombre" value={nuevoNombre} onChange={e => setNuevoNombre(e.target.value)} className="col-span-3 text-sm" />
            </div>
          )}

          {accionFormulario === 'compartir' && (
            <div className="grid gap-4 py-4">
              <Input placeholder="Correo electrónico" value={emailCompartir} onChange={e => setEmailCompartir(e.target.value)} className="col-span-3 text-sm" />
            </div>
          )}

          <DialogFooter>
            <Button onClick={() => setDialogOpen(false)} variant="outline" size="sm">
              Cancelar
            </Button>
            <Button
              onClick={
                accionFormulario === 'renombrar'
                  ? handleRenombrarFormulario
                  : accionFormulario === 'compartir'
                    ? handleCompartirFormulario
                    : () => { }
              }
              size="sm"
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
            <AlertDialogCancel size="sm">Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleEliminarFormulario} className="bg-red-500 hover:bg-red-600" size="sm">
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default FormulariosSidebarMobile;
