
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
import { RefreshCw } from "lucide-react";

interface ResetConfirmationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const ResetConfirmationDialog = ({
  isOpen,
  onClose,
  onConfirm,
}: ResetConfirmationDialogProps) => {
  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2">
            <RefreshCw className="h-5 w-5 text-amber-500" />
            Reiniciar Formulario Completo
          </AlertDialogTitle>
          <AlertDialogDescription className="space-y-2">
            <p>¿Estás seguro de que deseas reiniciar <strong>todos</strong> los campos del formulario?</p>
            <p>Esta acción:</p>
            <ul className="list-disc pl-5 space-y-1 text-sm">
              <li>Eliminará todo el texto ingresado</li>
              <li>Desmarcará todas las casillas seleccionadas</li>
              <li>Reiniciará todos los menús desplegables</li>
              <li>Restablecerá todas las secciones a su estado original</li>
              <li>Eliminará el autoguardado</li>
            </ul>
            <p className="text-amber-500 font-medium">Esta acción no se puede deshacer.</p>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction 
            onClick={onConfirm} 
            className="bg-amber-500 hover:bg-amber-600"
          >
            Sí, reiniciar formulario completo
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default ResetConfirmationDialog;
