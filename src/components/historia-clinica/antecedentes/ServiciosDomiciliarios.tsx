
import React from 'react';
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CustomCheckbox } from "@/components/ui/custom-checkbox";
import { FormDataState } from '@/types/historiaClinica';

interface ServiciosDomiciliariosFormProps {
  formData: FormDataState;
  handleInputChange: (section: string, field: string, value: any) => void;
}

const ServiciosDomiciliariosForm = ({ formData, handleInputChange }: ServiciosDomiciliariosFormProps) => {
  const servicios = formData?.serviciosDomiciliarios?.servicios || {};

  return (
    <div className="bg-gray-50 dark:bg-gray-900 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
      <h4 className="text-lg font-semibold mb-4">Servicios Domiciliarios</h4>
      <div className="grid gap-4">
        <div>
          <Label>Servicios Disponibles</Label>
          <div className="grid grid-cols-2 gap-4 mt-2">
            {['agua', 'luz', 'drenaje', 'transporte', 'internet', 'gas'].map((servicio) => (
              <div key={servicio} className="flex items-center space-x-2">
                <CustomCheckbox 
                  id={servicio}
                  checked={servicios[servicio] || false}
                  onCheckedChange={(checked) => 
                    handleInputChange('serviciosDomiciliarios', `servicios.${servicio}`, checked)
                  }
                />
                <Label htmlFor={servicio}>{servicio.charAt(0).toUpperCase() + servicio.slice(1)}</Label>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiciosDomiciliariosForm;
