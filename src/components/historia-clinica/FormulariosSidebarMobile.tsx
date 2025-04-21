
import React, { useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { FileText, Pencil, Share2, Trash } from "lucide-react";
import {
  Button,
} from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "@/hooks/use-toast";

interface FormDataState {};

interface FormulariosSidebarMobileProps {
  formularios: { nombre: string; data: FormDataState }[];
  onCargarFormulario: (data: FormDataState, nombre: string) => void;
  onGuardarFormulario: (nombre: string) => void;
  onCerrarFormulario: () => void;
  onResetFormulario: () => void;
  pacienteActual: string;
  isOpen: boolean;
  onClose: () => void;
}

const FormulariosSidebarMobile = ({
  formularios,
  onCargarFormulario,
  onGuardarFormulario,
  onCerrarFormulario,
  onResetFormulario,
  pacienteActual,
  isOpen,
  onClose,
}: FormulariosSidebarMobileProps) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [alertDialogOpen, setAlertDialogOpen] = useState(false);
  const [accionFormulario, setAccionFormulario] = useState<
    "eliminar" | "renombrar" | "compartir" | null
  >(null);
  const [formularioSeleccionado, setFormularioSeleccionado] = useState<
    string | null
  >(null);
  const [nuevoNombre, setNuevoNombre] = useState("");
  const [emailCompartir, setEmailCompartir] = useState("");

  const handleFormularioAction = (
    action: "eliminar" | "renombrar" | "compartir",
    nombre: string
  ) => {
    setFormularioSeleccionado(nombre);
    if (action === "eliminar") {
      setAlertDialogOpen(true);
    } else {
      setAccionFormulario(action);
      if (action === "renombrar") {
        setNuevoNombre(nombre);
      } else {
        setNuevoNombre("");
      }
      setEmailCompartir("");
      setDialogOpen(true);
    }
  };

  const handleEliminarFormulario = () => {
    if (!formularioSeleccionado) return;
    localStorage.removeItem(`formulario_${formularioSeleccionado}`);
    setAlertDialogOpen(false);
    onClose();
    if (formularioSeleccionado === pacienteActual) {
      onCerrarFormulario();
    }
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
      onClose();
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
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-xs p-0 h-full bg-white dark:bg-neutral-900">
        <div className="flex h-full flex-col">
          <header className="flex items-center justify-between px-4 py-3 border-b border-neutral-200 dark:border-neutral-700">
            <h2 className="text-lg font-semibold text-neutral-900 dark:text-neutral-50">Formularios guardados</h2>
            <Button variant="ghost" size="icon" onClick={onClose} aria-label="Cerrar">
              X
            </Button>
          </header>
          <ScrollArea className="flex-1 p-4">
            {formularios.map((form) => (
              <div
                key={form.nombre}
                className="mb-4 group flex justify-between items-center"
              >
                <button
                  onClick={() => {
                    onCargarFormulario(form.data, form.nombre);
                    onClose();
                  }}
                  className="flex items-center gap-2 flex-1 truncate text-left text-neutral-800 dark:text-neutral-200"
                  title={form.nombre}
                >
                  <FileText className="h-5 w-5 flex-shrink-0" />
                  <span className="truncate">{form.nombre}</span>
                </button>
                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => handleFormularioAction("renombrar", form.nombre)}
                    title="Renombrar paciente"
                    className="p-1 rounded-md hover:bg-neutral-200 dark:hover:bg-neutral-800"
                  >
                    <Pencil className="h-4 w-4 text-neutral-500 dark:text-neutral-400" />
                  </button>
                  <button
                    onClick={() => handleFormularioAction("compartir", form.nombre)}
                    title="Compartir formulario"
                    className="p-1 rounded-md hover:bg-neutral-200 dark:hover:bg-neutral-800"
                  >
                    <Share2 className="h-4 w-4 text-neutral-500 dark:text-neutral-400" />
                  </button>
                  <button
                    onClick={() => handleFormularioAction("eliminar", form.nombre)}
                    title="Eliminar paciente"
                    className="p-1 rounded-md hover:bg-neutral-200 dark:hover:bg-neutral-800"
                  >
                    <Trash className="h-4 w-4 text-red-500" />
                  </button>
                </div>
              </div>
            ))}
          </ScrollArea>
        </div>

        {/* Dialog for renaming or sharing */}
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent>
            <div className="grid gap-4 py-4">
              {accionFormulario === "renombrar" && (
                <input
                  placeholder="Nuevo nombre"
                  value={nuevoNombre}
                  onChange={(e) => setNuevoNombre(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              )}
              {accionFormulario === "compartir" && (
                <input
                  placeholder="Correo electrónico"
                  value={emailCompartir}
                  onChange={(e) => setEmailCompartir(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              )}
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setDialogOpen(false)}>
                Cancelar
              </Button>
              <Button
                onClick={
                  accionFormulario === "renombrar"
                    ? handleRenombrarFormulario
                    : accionFormulario === "compartir"
                    ? handleCompartirFormulario
                    : () => {}
                }
              >
                {accionFormulario === "renombrar"
                  ? "Renombrar"
                  : accionFormulario === "compartir"
                  ? "Compartir"
                  : "Confirmar"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Alert Dialog for confirming deletion */}
        <AlertDialog
          open={alertDialogOpen}
          onOpenChange={setAlertDialogOpen}
        >
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>
                ¿Está seguro de eliminar este formulario?
              </AlertDialogTitle>
              <AlertDialogDescription>
                Esta acción no se puede deshacer. Eliminará permanentemente el
                formulario de {formularioSeleccionado} y todos sus datos asociados.
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
      </DialogContent>
    </Dialog>
  );
};

export default FormulariosSidebarMobile;

