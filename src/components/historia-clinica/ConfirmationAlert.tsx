
import { useState } from 'react';
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
import { ExclamationTriangleIcon } from '@radix-ui/react-icons';

interface ConfirmationAlertProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description?: string;
  missingFields?: string[];
}

const ConfirmationAlert = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  missingFields = []
}: ConfirmationAlertProps) => {
  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent className="max-w-md">
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2">
            <ExclamationTriangleIcon className="h-5 w-5 text-amber-500" />
            {title}
          </AlertDialogTitle>
          {description && <AlertDialogDescription>{description}</AlertDialogDescription>}
          
          {missingFields.length > 0 && (
            <div className="mt-2 text-sm">
              <p className="font-medium mb-1">Campos pendientes:</p>
              <ul className="list-disc pl-5 space-y-1 text-gray-600 dark:text-gray-400">
                {missingFields.map((field, index) => (
                  <li key={index}>{field}</li>
                ))}
              </ul>
            </div>
          )}
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Volver al formulario</AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm} className="bg-blue-500 hover:bg-blue-600">
            Deseo continuar
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default ConfirmationAlert;
