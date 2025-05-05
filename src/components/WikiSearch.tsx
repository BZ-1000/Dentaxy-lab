
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

// Add props interface
interface WikiSearchProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

// Export as named export
export function WikiSearch({ open, onOpenChange }: WikiSearchProps) {
  const handleExpandText = (text: string) => {
    // Use a local function instead of window.expandText
    console.log("Text to expand:", text);
    // Implementation of text expansion logic here
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Búsqueda Wiki</DialogTitle>
        </DialogHeader>
        <div className="p-4">
          <p>Componente para búsqueda wiki (en desarrollo)</p>
          <button 
            onClick={() => handleExpandText("Example text")}
            className="mt-2 px-4 py-2 bg-blue-500 text-white rounded"
          >
            Expandir Texto
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
