
import React from "react";
import { FileText, Pencil, Share2, Trash, X } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
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
import { useState, useEffect } from "react";
import { FormDataState } from "@/types/historiaClinica";

interface MobileFormulariosSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  onCargarFormulario: (data: FormDataState, nombre: string) => void;
  pacienteActual: string;
}

const MobileFormulariosSidebar: React.FC<MobileFormulariosSidebarProps> = ({
  isOpen,
  onClose,
  onCargarFormulario,
  pacienteActual,
}) => {
  const [formularios, setFormularios] = useState<
    {
      nombre: string;
      data: FormDataState;
    }[]
  >([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [alertDialogOpen, setAlertDialogOpen] = useState(false);
  const [accionFormulario, setAccionFormulario] = useState<
    "eliminar" | "renombrar" | "compartir" | null
  >(null);
  const [formularioSeleccionado, setFormularioSeleccionado] = useState<string | null>(null);
  const [nuevoNombre, setNuevoNombre] = useState("");
  const [emailCompartir, setEmailCompartir] = useState("");

  useEffect(() => {
    const savedForms: {
      nombre: string;
      data: FormDataState;
    }[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith("formulario_")) {
        const nombre = key.replace("formulario_", "");
        const data = JSON.parse(localStorage.getItem(key) || "{}");
        savedForms.push({
          nombre,
          data,
        });
      }
    }
    setFormularios(savedForms);
  }, [isOpen]);

  const loadSavedForms = () => {
    const savedForms: {
      nombre: string;
      data: FormDataState;
    }[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith("formulario_")) {
        const nombre = key.replace("formulario_", "");
        const data = JSON.parse(localStorage.getItem(key) || "{}");
        savedForms.push({
          nombre,
          data,
        });
      }
    }
    setFormularios(savedForms);
  };

  const handleEliminarFormulario = () => {
    if (!formularioSeleccionado) return;
    localStorage.removeItem(`formulario_${formularioSeleccionado}`);
    loadSavedForms();
    setAlertDialogOpen(false);
    if (formularioSeleccionado === pacienteActual) {
      onClose();
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
      loadSavedForms();
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

  return (
    <>
      {/* Overlay background */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm md:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      <aside
        className={`fixed top-0 left-0 z-50 h-full w-72 bg-white dark:bg-neutral-900 shadow-lg transform transition-transform duration-300 ease-in-out md:hidden
          ${isOpen ? "translate-x-0" : "-translate-x-full"}`}
        aria-label="Formularios guardados"
      >
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-neutral-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            Formularios guardados
          </h2>
          <button
            aria-label="Cerrar sidebar"
            onClick={onClose}
            className="rounded-md p-2 hover:bg-gray-100 dark:hover:bg-neutral-800"
          >
            <X className="h-6 w-6 text-gray-900 dark:text-gray-100" />
          </button>
        </div>
        <ScrollArea className="flex-1 px-2 py-4">
          <div className="space-y-1">
            {formularios.map((form, index) => (
              <div
                key={index}
                className="group flex justify-between items-center mb-2"
              >
                <button
                  onClick={() => {
                    onCargarFormulario(form.data, form.nombre);
                    onClose();
                  }}
                  className="flex items-center gap-2 px-3 py-2 w-full rounded-md hover:bg-gray-200 dark:hover:bg-neutral-700 text-left text-gray-700 dark:text-gray-200"
                  title={`Cargar formulario ${form.nombre}`}
                >
                  <FileText className="h-5 w-5 flex-shrink-0" />
                  <span className="truncate">{form.nombre}</span>
                </button>
                <div className="flex gap-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => handleFormularioAction("renombrar", form.nombre)}
                    className="p-1 rounded-md hover:bg-gray-200 dark:hover:bg-neutral-700"
                    title="Renombrar paciente"
                  >
                    <Pencil className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                  </button>
                  <button
                    onClick={() => handleFormularioAction("compartir", form.nombre)}
                    className="p-1 rounded-md hover:bg-gray-200 dark:hover:bg-neutral-700"
                    title="Compartir formulario"
                  >
                    <Share2 className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                  </button>
                  <button
                    onClick={() => handleFormularioAction("eliminar", form.nombre)}
                    className="p-1 rounded-md hover:bg-gray-200 dark:hover:bg-neutral-700"
                    title="Eliminar paciente"
                  >
                    <Trash className="h-4 w-4 text-red-500" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>

        {/* Dialog for renaming or sharing */}
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {accionFormulario === "renombrar"
                  ? "Renombrar formulario"
                  : accionFormulario === "compartir"
                  ? "Compartir formulario"
                  : "Acción de formulario"}
              </DialogTitle>
              <DialogDescription>
                {accionFormulario === "renombrar"
                  ? "Ingrese el nuevo nombre para el formulario."
                  : accionFormulario === "compartir"
                  ? "Ingrese el correo electrónico para compartir el formulario."
                  : ""}
              </DialogDescription>
            </DialogHeader>

            {accionFormulario === "renombrar" && (
              <div className="grid gap-4 py-4">
                <input
                  placeholder="Nuevo nombre"
                  value={nuevoNombre}
                  onChange={(e) => setNuevoNombre(e.target.value)}
                  className="col-span-3 border rounded px-3 py-2 w-full"
                />
              </div>
            )}

            {accionFormulario === "compartir" && (
              <div className="grid gap-4 py-4">
                <input
                  placeholder="Correo electrónico"
                  value={emailCompartir}
                  onChange={(e) => setEmailCompartir(e.target.value)}
                  className="col-span-3 border rounded px-3 py-2 w-full"
                  type="email"
                />
              </div>
            )}

            <DialogFooter>
              <Button onClick={() => setDialogOpen(false)} variant="outline">
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
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Alert Dialog for confirming deletion */}
        <AlertDialog open={alertDialogOpen} onOpenChange={setAlertDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>
                ¿Está seguro de eliminar este formulario?
              </AlertDialogTitle>
              <AlertDialogDescription>
                Esta acción no se puede deshacer. Eliminará permanentemente el
                formulario de {formularioSeleccionado} y todos sus datos
                asociados.
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
      </aside>
    </>
  );
};

export default MobileFormulariosSidebar;
