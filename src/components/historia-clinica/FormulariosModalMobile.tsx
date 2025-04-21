
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { FileText, Trash, Pencil, Share2 } from "lucide-react";
import { FormDataState } from '@/types/historiaClinica';
import { Button } from '@/components/ui/button';

interface FormulariosModalMobileProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  formularios: {
    nombre: string;
    data: FormDataState;
  }[];
  onCargarFormulario: (data: FormDataState, nombre: string) => void;
  onEliminarFormulario: (nombre: string) => void;
  onRenombrarFormulario: (nombreViejo: string, nombreNuevo: string) => void;
  onCompartirFormulario: (nombre: string, email: string) => void;
  pacienteActual: string;
}

const FormulariosModalMobile = ({
  open,
  onOpenChange,
  formularios,
  onCargarFormulario,
  onEliminarFormulario,
  onRenombrarFormulario,
  onCompartirFormulario,
  pacienteActual
}: FormulariosModalMobileProps) => {
  const [accion, setAccion] = React.useState<'eliminar' | 'renombrar' | 'compartir' | null>(null);
  const [formularioSeleccionado, setFormularioSeleccionado] = React.useState<string | null>(null);
  const [nuevoNombre, setNuevoNombre] = React.useState('');
  const [emailCompartir, setEmailCompartir] = React.useState('');

  const clearEstados = () => {
    setAccion(null);
    setFormularioSeleccionado(null);
    setNuevoNombre('');
    setEmailCompartir('');
  };

  const handleCloseDialog = () => {
    clearEstados();
    onOpenChange(false);
  };

  const handleConfirmAccion = () => {
    if (accion === 'eliminar' && formularioSeleccionado) {
      onEliminarFormulario(formularioSeleccionado);
      handleCloseDialog();
    } else if (accion === 'renombrar' && formularioSeleccionado && nuevoNombre.trim()) {
      onRenombrarFormulario(formularioSeleccionado, nuevoNombre.trim());
      handleCloseDialog();
    } else if (accion === 'compartir' && formularioSeleccionado && emailCompartir.trim()) {
      onCompartirFormulario(formularioSeleccionado, emailCompartir.trim());
      handleCloseDialog();
    }
  };

  return (
    <Dialog open={open} onOpenChange={(val) => {
      if (!val) clearEstados();
      onOpenChange(val);
    }}>
      <DialogContent className="max-w-md w-full h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Formularios guardados</DialogTitle>
          <DialogDescription>
            Selecciona un formulario para cargar o usa las acciones para renombrar, compartir o eliminar.
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="max-h-[60vh] py-2">
          {formularios.length === 0 ? (
            <div className="text-center py-8 text-gray-500">No hay formularios guardados.</div>
          ) : (
            <ul className="space-y-3 px-2">
              {formularios.map((form) => (
                <li key={form.nombre} className="flex items-center justify-between rounded-md px-3 py-2 bg-gray-100 dark:bg-gray-800 cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-700">
                  <div
                    className="flex items-center gap-2 flex-1 truncate"
                    onClick={() => {
                      onCargarFormulario(form.data, form.nombre);
                      onOpenChange(false);
                    }}
                    onKeyDown={e => { if (e.key === 'Enter') { onCargarFormulario(form.data, form.nombre); onOpenChange(false); } }}
                    role="button"
                    tabIndex={0}
                    title={`Cargar formulario ${form.nombre}`}
                  >
                    <FileText className="w-5 h-5 flex-shrink-0 text-blue-600 dark:text-blue-400" />
                    <span className="truncate text-sm font-medium">{form.nombre}</span>
                  </div>
                  <div className="flex gap-2 ml-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setFormularioSeleccionado(form.nombre);
                        setNuevoNombre(form.nombre);
                        setAccion('renombrar');
                      }}
                      title={`Renombrar formulario ${form.nombre}`}
                      className="p-1 rounded hover:bg-gray-300 dark:hover:bg-gray-700"
                      aria-label={`Renombrar formulario ${form.nombre}`}
                    >
                      <Pencil className="w-4 h-4 text-gray-600 dark:text-gray-300" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setFormularioSeleccionado(form.nombre);
                        setAccion('compartir');
                        setEmailCompartir('');
                      }}
                      title={`Compartir formulario ${form.nombre}`}
                      className="p-1 rounded hover:bg-gray-300 dark:hover:bg-gray-700"
                      aria-label={`Compartir formulario ${form.nombre}`}
                    >
                      <Share2 className="w-4 h-4 text-gray-600 dark:text-gray-300" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setFormularioSeleccionado(form.nombre);
                        setAccion('eliminar');
                      }}
                      title={`Eliminar formulario ${form.nombre}`}
                      className="p-1 rounded hover:bg-gray-300 dark:hover:bg-gray-700 text-red-600 dark:text-red-400"
                      aria-label={`Eliminar formulario ${form.nombre}`}
                    >
                      <Trash className="w-4 h-4" />
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </ScrollArea>

        {(accion === 'renombrar' || accion === 'compartir') && (
          <div className="mt-4 px-2">
            {accion === 'renombrar' && (
              <input
                type="text"
                className="w-full px-3 py-2 border rounded"
                value={nuevoNombre}
                onChange={e => setNuevoNombre(e.target.value)}
                placeholder="Nuevo nombre"
                aria-label="Nuevo nombre"
              />
            )}
            {accion === 'compartir' && (
              <input
                type="email"
                className="w-full px-3 py-2 border rounded"
                value={emailCompartir}
                onChange={e => setEmailCompartir(e.target.value)}
                placeholder="Correo electrónico"
                aria-label="Correo electrónico"
              />
            )}
          </div>
        )}

        <DialogFooter className="space-x-2 justify-end">
          <Button variant="outline" onClick={handleCloseDialog}>Cancelar</Button>
          <Button
            variant="ghost"
            onClick={handleConfirmAccion}
            disabled={
              accion === 'renombrar' ? nuevoNombre.trim() === '' :
              accion === 'compartir' ? emailCompartir.trim() === '' :
              accion === 'eliminar' ? formularioSeleccionado === null :
              true
            }
          >
            {accion === 'eliminar' ? 'Eliminar' : accion === 'renombrar' ? 'Renombrar' : 'Compartir'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default FormulariosModalMobile;
