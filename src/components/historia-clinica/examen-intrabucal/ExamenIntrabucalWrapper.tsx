import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { FormDataState } from '@/types/historiaClinica';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { toast } from "sonner";

// Importar componentes de secciones
import EnciaSection from './EnciaSection';
import PaladarSection from './PaladarSection';
import OrofaringeSection from './OrofaringeSection';
import MejillasSection from './MejillasSection';
import RetromolarSection from './RetromolarSection';
import LenguaSection from './LenguaSection';
import PisoBocaSection from './PisoBocaSection';

interface ExamenIntrabucalWrapperProps {
  area: string;
  onClose: () => void;
  formData: FormDataState;
  handleExamenIntrabucalChange: (part: string, value: string | boolean) => void;
}

const ExamenIntrabucalWrapper: React.FC<ExamenIntrabucalWrapperProps> = ({
  area,
  onClose,
  formData,
  handleExamenIntrabucalChange
}) => {
  const [selectedOptions, setSelectedOptions] = useState<{[key: string]: string}>({});

  // Cargar datos guardados al inicializar
  useEffect(() => {
    // Primero intentar cargar desde formData (datos del formulario principal)
    const formDataValue = formData.examenIntrabucal?.[area];
    if (formDataValue && typeof formDataValue === 'string') {
      try {
        const parsedFormData = JSON.parse(formDataValue);
        setSelectedOptions(parsedFormData);
        return;
      } catch (error) {
        console.error('Error parsing form data:', error);
      }
    }
    
    // Si no hay datos en formData, intentar cargar desde localStorage específico
    const savedData = localStorage.getItem(`examen-intrabucal-${area}`);
    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData);
        setSelectedOptions(parsedData);
      } catch (error) {
        console.error('Error loading saved data:', error);
      }
    }
  }, [area, formData.examenIntrabucal]);

  const colorOptions = [
    { color: '#FF7F7F', label: 'Rosa coral: mucosa sana, normal' },
    { color: '#FF6666', label: 'Eritematoso / rojo: inflamación, infección, trauma' },
    { color: '#FFF0F5', label: 'Pálido: anemia, deficiencia de hierro' },
    { color: '#A9A9A9', label: 'Blanquecino: leucoplasia, cándida, línea alba' },
    { color: '#8B0000', label: 'Rojizo oscuro / purpúreo: trauma, petequias, lesiones vasculares' },
    { color: '#FFCC00', label: 'Amarillento: saburra lingual, secreción purulenta' },
    { color: '#000000', label: 'Negruzco: pigmentación por tabaco, lengua negra vellosa' },
    { color: '#964B00', label: 'Café / marrón: melanosis, tabaquismo, pigmentación' },
    { color: '#00008B', label: 'Cianótico (azulado): hipoxia, venas varicosas' }
  ];

  const getAreaTitle = () => {
    switch (area) {
      case 'encias': return '🦷 1. ENCÍAS';
      case 'paladar': return '🦷 2. PALADAR';
      case 'orofaringe': return '🦷 3. OROFARINGE / ISTMO DE LAS FAUCES';
      case 'mejillas': return '🦷 4. MEJILLAS';
      case 'retromolar': return '🦷 5. REGIÓN RETROMOLAR';
      case 'lengua': return '🦷 6. LENGUA';
      case 'pisoBoca': return '🦷 7. PISO DE BOCA';
      default: return 'Examen';
    }
  };

  const toggleOption = (option: string, category: string) => {
    setSelectedOptions(prev => {
      if (prev[category] === option) {
        const newState = { ...prev };
        delete newState[category];
        return newState;
      }
      return {
        ...prev,
        [category]: option
      };
    });
  };

  const handleSave = () => {
    try {
      // Solo guardar en el estado global del formulario
      // NO guardar en localStorage individual para prevenir formularios duplicados
      handleExamenIntrabucalChange(area, JSON.stringify(selectedOptions));
      
      toast.success("Datos guardados correctamente");
      onClose();
    } catch (error) {
      console.error('Error saving data:', error);
      toast.error("Error al guardar los datos");
    }
  };

  const renderSectionContent = () => {
    const props = {
      selectedOptions,
      onToggleOption: toggleOption,
      colorOptions
    };

    switch (area) {
      case 'encias':
        return <EnciaSection {...props} />;
      case 'paladar':
        return <PaladarSection {...props} />;
      case 'orofaringe':
        return <OrofaringeSection {...props} />;
      case 'mejillas':
        return <MejillasSection {...props} />;
      case 'retromolar':
        return <RetromolarSection {...props} />;
      case 'lengua':
        return <LenguaSection {...props} />;
      case 'pisoBoca':
        return <PisoBocaSection {...props} />;
      default:
        return <div>Sección no encontrada</div>;
    }
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-hidden flex flex-col">
        <DialogHeader className="flex-shrink-0">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-lg font-bold text-blue-600">
              {getAreaTitle()}
            </DialogTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="h-6 w-6 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto p-4">
          {renderSectionContent()}
        </div>

        <div className="flex-shrink-0 flex justify-between items-center p-4 border-t">
          <Button
            variant="outline"
            onClick={onClose}
            className="px-4 py-2"
          >
            Cancelar
          </Button>
          
          <Button
            onClick={handleSave}
            className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white"
          >
            Guardar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ExamenIntrabucalWrapper;