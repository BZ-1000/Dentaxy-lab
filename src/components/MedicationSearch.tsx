
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

// Add props interface to accept open state and change handler
interface MedicationSearchProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

// Export as named export to match the import in AppleStyleDock.tsx
export function MedicationSearch({ open, onOpenChange }: MedicationSearchProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Búsqueda de Medicamentos</DialogTitle>
        </DialogHeader>
        <div className="p-4">
          <p>Componente para búsqueda de medicamentos (en desarrollo)</p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
