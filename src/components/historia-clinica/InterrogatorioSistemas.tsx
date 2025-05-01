
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { InterrogatorioSistema } from '@/types/historiaClinica';

const sistemasOptions = {
  cardiovascular: [
    'Asintomático',
    'Disnea',
    'Dolor precordial',
    'Palpitaciones',
    'Síncope',
    'Taquicardia',
    'Bradicardia',
    'Edema',
    'Cianosis',
  ],
  respiratorio: [
    'Asintomático',
    'Disnea',
    'Tos',
    'Hemoptisis',
    'Dolor torácico',
    'Sibilancias',
    'Expectoración',
  ],
  digestivo: [
    'Asintomático',
    'Nausea',
    'Vómito',
    'Diarrea',
    'Estreñimiento',
    'Dolor abdominal',
    'Ictericia',
    'Hematemesis',
  ],
  urinario: [
    'Asintomático',
    'Disuria',
    'Poliuria',
    'Oliguria',
    'Nicturia',
    'Hematuria',
    'Incontinencia',
    'Urgencia urinaria',
  ],
  musculoEsqueletico: [
    'Asintomático',
    'Dolor articular',
    'Limitación de movimiento',
    'Rigidez',
    'Inflamación',
    'Deformidades',
    'Debilidad muscular',
  ],
  nervioso: [
    'Asintomático',
    'Cefalea',
    'Vértigo',
    'Mareo',
    'Convulsiones',
    'Parestesias',
    'Parálisis',
    'Alteraciones de la sensibilidad',
  ],
  endocrino: [
    'Asintomático',
    'Polidipsia',
    'Polifagia',
    'Pérdida de peso',
    'Aumento de peso',
    'Intolerancia al frío',
    'Intolerancia al calor',
  ],
  tegumentario: [
    'Asintomático',
    'Prurito',
    'Erupciones',
    'Resequedad',
    'Cambios de coloración',
    'Lesiones',
    'Descamación',
  ],
};

// Component for individual system tab
const SistemaTab = ({ 
  sistema, 
  options, 
  value, 
  selected = [], 
  onChange 
}: {
  sistema: string;
  options: string[];
  value: InterrogatorioSistema;
  selected?: string[];
  onChange: (sistema: string, type: 'valor' | 'seleccionados', value: string | string[]) => void;
}) => {
  const [selectedOptions, setSelectedOptions] = useState<string[]>(selected || []);
  const [textValue, setTextValue] = useState(value?.valor || '');

  const handleCheckboxChange = (option: string, checked: boolean) => {
    let newSelected: string[];
    
    if (checked) {
      // If selecting "Asintomático", clear all other selections
      if (option === 'Asintomático') {
        newSelected = ['Asintomático'];
      } else {
        // If selecting something else, remove "Asintomático" if present
        newSelected = [...selectedOptions.filter(item => item !== 'Asintomático'), option];
      }
    } else {
      newSelected = selectedOptions.filter(item => item !== option);
    }
    
    setSelectedOptions(newSelected);
    onChange(sistema, 'seleccionados', newSelected);
    
    // Update text area with comma-separated list of selected options
    const newText = newSelected.join(', ');
    setTextValue(newText);
    onChange(sistema, 'valor', newText);
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setTextValue(e.target.value);
    onChange(sistema, 'valor', e.target.value);
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {options.map((option) => (
          <div key={option} className="flex items-center space-x-2">
            <Checkbox
              id={`${sistema}-${option}`}
              checked={selectedOptions.includes(option)}
              onCheckedChange={(checked) => handleCheckboxChange(option, checked === true)}
            />
            <Label htmlFor={`${sistema}-${option}`} className="text-sm">
              {option}
            </Label>
          </div>
        ))}
      </div>
      
      <div className="mt-4">
        <Label htmlFor={`${sistema}-notes`} className="text-sm">
          Notas adicionales:
        </Label>
        <Textarea
          id={`${sistema}-notes`}
          placeholder="Ingrese notas adicionales sobre este sistema"
          value={textValue}
          onChange={handleTextChange}
          className="mt-1"
        />
      </div>
    </div>
  );
};

// Main component
const InterrogatorioSistemas = ({ 
  formData, 
  handleInterrogatorioChange 
}) => {
  // Function to prepare initial state for each system
  const getInitialSystemState = (sistema: string) => {
    const systemData = formData.interrogatorioSistemas[sistema] || {};
    const valor = systemData.valor || '';
    const seleccionados = systemData.seleccionados || (valor ? valor.split(', ').filter(Boolean) : []);
    
    return { valor, seleccionados };
  };

  // Handle changes from child components
  const handleSystemChange = (sistema: string, type: 'valor' | 'seleccionados', value: string | string[]) => {
    // Update the form data based on the type of change
    if (type === 'valor') {
      handleInterrogatorioChange(sistema, value as string);
    } else if (type === 'seleccionados') {
      // We already update the text value in the SistemaTab component,
      // but we'll store the selected options for future reference
      const currentSystem = formData.interrogatorioSistemas[sistema] || {};
      const updatedSystem = {
        ...currentSystem,
        seleccionados: value as string[]
      };
      
      // Since our hook doesn't have a direct method for complex updates,
      // we'll use the existing method to update the text value
      handleInterrogatorioChange(sistema, updatedSystem.seleccionados.join(', '));
    }
  };

  return (
    <div className="p-4 bg-white rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-4">Interrogatorio por Sistemas</h2>
      
      <Tabs defaultValue="cardiovascular" className="w-full">
        <TabsList className="grid grid-cols-4 mb-4">
          <TabsTrigger value="cardiovascular">Cardiovascular</TabsTrigger>
          <TabsTrigger value="respiratorio">Respiratorio</TabsTrigger>
          <TabsTrigger value="digestivo">Digestivo</TabsTrigger>
          <TabsTrigger value="urinario">Urinario</TabsTrigger>
          <TabsTrigger value="musculoEsqueletico">Muscul. Esquel.</TabsTrigger>
          <TabsTrigger value="nervioso">Nervioso</TabsTrigger>
          <TabsTrigger value="endocrino">Endocrino</TabsTrigger>
          <TabsTrigger value="tegumentario">Tegumentario</TabsTrigger>
        </TabsList>

        {Object.entries(sistemasOptions).map(([sistema, options]) => {
          const { valor, seleccionados } = getInitialSystemState(sistema);
          
          return (
            <TabsContent key={sistema} value={sistema}>
              <Card>
                <CardContent className="pt-6">
                  <SistemaTab
                    sistema={sistema}
                    options={options}
                    value={{ valor }}
                    selected={seleccionados}
                    onChange={handleSystemChange}
                  />
                </CardContent>
              </Card>
            </TabsContent>
          );
        })}
      </Tabs>
    </div>
  );
};

export default InterrogatorioSistemas;
