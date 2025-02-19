
import React from 'react';
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CustomCheckbox } from "@/components/ui/custom-checkbox";
import { FormDataState } from '@/types/historiaClinica';

interface HigieneBucalProps {
  formData: FormDataState;
  handleInputChange: (section: string, field: string, value: any) => void;
}

const HigieneBucal = ({ formData, handleInputChange }: HigieneBucalProps) => {
  const auxiliares = formData?.higieneBucal?.auxiliares || {};
  const problemas = formData?.higieneBucal?.problemas || {};

  return (
    <div className="bg-gray-50 dark:bg-gray-900 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
      <h4 className="text-lg font-semibold mb-4">Higiene Bucal</h4>
      <div className="grid gap-4">
        <div>
          <Label>Frecuencia de Cepillado Dental</Label>
          <Select 
            value={formData?.higieneBucal?.frecuenciaCepillado || '2-veces'}
            onValueChange={(value) => handleInputChange('higieneBucal', 'frecuenciaCepillado', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Seleccione frecuencia" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="3-veces">3 veces al día</SelectItem>
              <SelectItem value="2-veces">2 veces al día</SelectItem>
              <SelectItem value="1-vez">1 vez al día</SelectItem>
              <SelectItem value="menos">Menos de una vez al día</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label>Uso de Auxiliares</Label>
          <div className="grid gap-2 mt-2">
            {['hiloDental', 'enjuagueBucal', 'irrigador', 'noUsa'].map((auxItem) => (
              <div key={auxItem} className="flex items-center space-x-2">
                <CustomCheckbox
                  id={auxItem}
                  checked={auxiliares[auxItem] || false}
                  onCheckedChange={(checked) => 
                    handleInputChange('higieneBucal', `auxiliares.${auxItem}`, checked)
                  }
                />
                <Label htmlFor={auxItem}>
                  {auxItem === 'hiloDental' ? 'Hilo dental' :
                   auxItem === 'enjuagueBucal' ? 'Enjuague bucal' :
                   auxItem === 'irrigador' ? 'Irrigador dental' :
                   'No usa auxiliares'}
                </Label>
              </div>
            ))}
          </div>
        </div>

        <div>
          <Label>Problemas Bucales Presentes</Label>
          <div className="grid gap-2 mt-2">
            {['sangradoEncias', 'caries', 'malAliento', 'dolor', 'sinProblemas'].map((prob) => (
              <div key={prob} className="flex items-center space-x-2">
                <CustomCheckbox
                  id={prob}
                  checked={problemas[prob] || false}
                  onCheckedChange={(checked) => 
                    handleInputChange('higieneBucal', `problemas.${prob}`, checked)
                  }
                />
                <Label htmlFor={prob}>
                  {prob === 'sangradoEncias' ? 'Encías que sangran al cepillarse' :
                   prob === 'caries' ? 'Dientes con agujeros o zonas oscuras' :
                   prob === 'malAliento' ? 'Mal aliento frecuente' :
                   prob === 'dolor' ? 'Dolor en dientes o encías' :
                   'No tengo problemas bucales'}
                </Label>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HigieneBucal;
