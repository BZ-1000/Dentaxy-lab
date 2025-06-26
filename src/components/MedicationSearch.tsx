
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, X } from "lucide-react";

interface MedicationSearchProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const MedicationSearch: React.FC<MedicationSearchProps> = ({
  open,
  onOpenChange
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState<string[]>([]);

  const handleSearch = () => {
    // Simulación de búsqueda de medicamentos
    const mockMedications = [
      'Paracetamol',
      'Ibuprofeno',
      'Amoxicilina',
      'Omeprazol',
      'Aspirina'
    ];
    
    const filtered = mockMedications.filter(med => 
      med.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setResults(filtered);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-full max-w-md mx-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>Búsqueda de Medicamentos</span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onOpenChange(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 p-4">
          <div className="flex gap-2">
            <Input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar medicamento..."
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            />
            <Button onClick={handleSearch} size="sm">
              <Search className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="space-y-2 max-h-60 overflow-y-auto">
            {results.map((medication, index) => (
              <div
                key={index}
                className="p-2 border rounded hover:bg-gray-50 cursor-pointer"
                onClick={() => {
                  // Aquí se podría agregar la lógica para seleccionar el medicamento
                  console.log('Medicamento seleccionado:', medication);
                }}
              >
                {medication}
              </div>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
