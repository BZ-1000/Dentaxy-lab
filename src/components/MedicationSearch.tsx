
import React, { useState } from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface Medication {
  id: string;
  name: string;
  description: string;
}

interface MedicationSearchProps {
  onSelect?: (medication: Medication) => void;
}

const MedicationSearch: React.FC<MedicationSearchProps> = ({ onSelect }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [medications] = useState<Medication[]>([
    { id: '1', name: 'Paracetamol', description: 'Analgésico y antipirético' },
    { id: '2', name: 'Ibuprofeno', description: 'Antiinflamatorio no esteroideo' },
    { id: '3', name: 'Amoxicilina', description: 'Antibiótico de amplio espectro' },
  ]);

  const filteredMedications = medications.filter(med =>
    med.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <Input
          type="text"
          placeholder="Buscar medicamento..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1"
        />
        <Button variant="outline" size="icon">
          <Search className="h-4 w-4" />
        </Button>
      </div>
      
      <div className="space-y-2">
        {filteredMedications.map((medication) => (
          <div
            key={medication.id}
            className="p-3 border rounded-lg hover:bg-gray-50 cursor-pointer"
            onClick={() => onSelect?.(medication)}
          >
            <h4 className="font-medium">{medication.name}</h4>
            <p className="text-sm text-gray-600">{medication.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MedicationSearch;
