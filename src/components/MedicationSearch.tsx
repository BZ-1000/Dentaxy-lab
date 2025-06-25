
import React, { useState, useEffect } from 'react';
import { Search, AlertTriangle, Info, CheckCircle, Clock, Pill } from 'lucide-react';
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface Medication {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  category: string;
  contraindications?: string[];
  interactions?: string[];
  sideEffects?: string[];
  description: string;
}

interface MedicationSearchProps {
  onMedicationSelect?: (medication: Medication) => void;
  placeholder?: string;
  className?: string;
}

const medicationsDatabase: Medication[] = [
  {
    id: '1',
    name: 'Ibuprofeno',
    dosage: '400-600 mg',
    frequency: 'Cada 8 horas',
    category: 'Antiinflamatorio',
    contraindications: ['Úlcera péptica activa', 'Insuficiencia renal severa', 'Alergia a AINEs'],
    interactions: ['Anticoagulantes', 'ACE inhibidores', 'Diuréticos'],
    sideEffects: ['Molestias gastrointestinales', 'Dolor de cabeza', 'Mareos'],
    description: 'Antiinflamatorio no esteroideo utilizado para el control del dolor e inflamación postoperatoria.'
  },
  {
    id: '2',
    name: 'Amoxicilina',
    dosage: '500 mg',
    frequency: 'Cada 8 horas por 7 días',
    category: 'Antibiótico',
    contraindications: ['Alergia a penicilinas', 'Mononucleosis infecciosa'],
    interactions: ['Anticoagulantes orales', 'Anticonceptivos orales'],
    sideEffects: ['Diarrea', 'Náuseas', 'Erupciones cutáneas'],
    description: 'Antibiótico de amplio espectro para infecciones odontogénicas.'
  },
  {
    id: '3',
    name: 'Lidocaína 2%',
    dosage: '1.8 ml por cartucho',
    frequency: 'Según necesidad quirúrgica',
    category: 'Anestésico local',
    contraindications: ['Alergia a anestésicos tipo amida', 'Bloqueo cardíaco'],
    interactions: ['Antiarrítmicos', 'Beta-bloqueadores'],
    sideEffects: ['Entumecimiento temporal', 'Hematoma en sitio de inyección'],
    description: 'Anestésico local para procedimientos odontológicos.'
  },
  {
    id: '4',
    name: 'Paracetamol',
    dosage: '500-1000 mg',
    frequency: 'Cada 6-8 horas',
    category: 'Analgésico',
    contraindications: ['Insuficiencia hepática severa', 'Alergia al paracetamol'],
    interactions: ['Warfarina', 'Alcohol'],
    sideEffects: ['Raros en dosis terapéuticas', 'Hepatotoxicidad en sobredosis'],
    description: 'Analgésico y antipirético para dolor leve a moderado.'
  }
];

const MedicationSearch: React.FC<MedicationSearchProps> = ({
  onMedicationSelect,
  placeholder = "Buscar medicamento...",
  className = ""
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredMedications, setFilteredMedications] = useState<Medication[]>([]);
  const [selectedMedication, setSelectedMedication] = useState<Medication | null>(null);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    if (searchTerm.trim()) {
      setIsSearching(true);
      const timer = setTimeout(() => {
        const filtered = medicationsDatabase.filter(med =>
          med.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          med.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
          med.description.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredMedications(filtered);
        setIsSearching(false);
      }, 300);

      return () => clearTimeout(timer);
    } else {
      setFilteredMedications([]);
      setIsSearching(false);
    }
  }, [searchTerm]);

  const handleMedicationSelect = (medication: Medication) => {
    setSelectedMedication(medication);
    onMedicationSelect?.(medication);
    setSearchTerm(medication.name);
    setFilteredMedications([]);
  };

  const getCategoryColor = (category: string) => {
    switch (category.toLowerCase()) {
      case 'antibiótico':
        return 'bg-red-100 text-red-800';
      case 'antiinflamatorio':
        return 'bg-blue-100 text-blue-800';
      case 'analgésico':
        return 'bg-green-100 text-green-800';
      case 'anestésico local':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className={`w-full max-w-2xl mx-auto ${className}`}>
      <div className="relative">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={placeholder}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          {isSearching && (
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
            </div>
          )}
        </div>

        {/* Results dropdown */}
        {filteredMedications.length > 0 && (
          <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-96 overflow-y-auto">
            {filteredMedications.map((medication) => (
              <div
                key={medication.id}
                onClick={() => handleMedicationSelect(medication)}
                className="p-4 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <Pill className="w-4 h-4 text-blue-500" />
                      <h3 className="font-medium text-gray-900">{medication.name}</h3>
                      <Badge className={getCategoryColor(medication.category)}>
                        {medication.category}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{medication.description}</p>
                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      <span>📊 {medication.dosage}</span>
                      <span>⏰ {medication.frequency}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Selected medication details */}
      {selectedMedication && (
        <Card className="mt-4 p-4">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Pill className="w-5 h-5 text-blue-500" />
              <h2 className="text-lg font-semibold text-gray-900">{selectedMedication.name}</h2>
              <Badge className={getCategoryColor(selectedMedication.category)}>
                {selectedMedication.category}
              </Badge>
            </div>

            <p className="text-gray-700">{selectedMedication.description}</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Info className="w-4 h-4 text-blue-500" />
                  <span className="font-medium text-gray-700">Dosis</span>
                </div>
                <p className="text-sm text-gray-600 ml-6">{selectedMedication.dosage}</p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-green-500" />
                  <span className="font-medium text-gray-700">Frecuencia</span>
                </div>
                <p className="text-sm text-gray-600 ml-6">{selectedMedication.frequency}</p>
              </div>
            </div>

            {selectedMedication.contraindications && selectedMedication.contraindications.length > 0 && (
              <Alert>
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  <strong>Contraindicaciones:</strong>
                  <ul className="mt-1 ml-4 list-disc">
                    {selectedMedication.contraindications.map((contraindication, index) => (
                      <li key={index} className="text-sm">{contraindication}</li>
                    ))}
                  </ul>
                </AlertDescription>
              </Alert>
            )}

            {selectedMedication.interactions && selectedMedication.interactions.length > 0 && (
              <div className="space-y-2">
                <h4 className="font-medium text-gray-700 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-yellow-500" />
                  Interacciones
                </h4>
                <div className="flex flex-wrap gap-2">
                  {selectedMedication.interactions.map((interaction, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {interaction}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {selectedMedication.sideEffects && selectedMedication.sideEffects.length > 0 && (
              <div className="space-y-2">
                <h4 className="font-medium text-gray-700 flex items-center gap-2">
                  <Info className="w-4 h-4 text-blue-500" />
                  Efectos secundarios
                </h4>
                <div className="flex flex-wrap gap-2">
                  {selectedMedication.sideEffects.map((effect, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {effect}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
        </Card>
      )}

      {searchTerm && filteredMedications.length === 0 && !isSearching && (
        <div className="mt-4 p-4 text-center text-gray-500 bg-gray-50 rounded-lg">
          No se encontraron medicamentos que coincidan con "{searchTerm}"
        </div>
      )}
    </div>
  );
};

export default MedicationSearch;
