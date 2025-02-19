
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
          <Label>Tipo de Vivienda</Label>
          <RadioGroup 
            value={formData?.serviciosDomiciliarios?.tipoVivienda || 'urbana'} 
            onValueChange={(value) => handleInputChange('serviciosDomiciliarios', 'tipoVivienda', value)}
            className="flex gap-4 mt-2"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="rural" id="rural" />
              <Label htmlFor="rural">Rural</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="urbana" id="urbana" />
              <Label htmlFor="urbana">Urbana</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="semiurbana" id="semiurbana" />
              <Label htmlFor="semiurbana">Semiurbana</Label>
            </div>
          </RadioGroup>
        </div>

        <div>
          <Label>Material Predominante de la Vivienda</Label>
          <Select 
            value={formData?.serviciosDomiciliarios?.materialVivienda || 'concreto'}
            onValueChange={(value) => handleInputChange('serviciosDomiciliarios', 'materialVivienda', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Seleccione material" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="concreto">Concreto</SelectItem>
              <SelectItem value="madera">Madera</SelectItem>
              <SelectItem value="lamina">Lámina</SelectItem>
              <SelectItem value="ladrillo">Ladrillo</SelectItem>
            </SelectContent>
          </Select>
        </div>

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

        <div>
          <Label>Condiciones de la Calle</Label>
          <RadioGroup 
            value={formData?.serviciosDomiciliarios?.condicionesCalle || 'pavimentada'}
            onValueChange={(value) => handleInputChange('serviciosDomiciliarios', 'condicionesCalle', value)}
            className="flex gap-4 mt-2"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="pavimentada" id="pavimentada" />
              <Label htmlFor="pavimentada">Pavimentada</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="sin-pavimentar" id="sin-pavimentar" />
              <Label htmlFor="sin-pavimentar">Sin pavimentar</Label>
            </div>
          </RadioGroup>
        </div>

        <div>
          <Label>Iluminación en la Calle</Label>
          <RadioGroup 
            value={formData?.serviciosDomiciliarios?.iluminacionCalle || 'bien-iluminada'}
            onValueChange={(value) => handleInputChange('serviciosDomiciliarios', 'iluminacionCalle', value)}
            className="flex gap-4 mt-2"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="bien-iluminada" id="bien-iluminada" />
              <Label htmlFor="bien-iluminada">Bien iluminada</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="poca-iluminacion" id="poca-iluminacion" />
              <Label htmlFor="poca-iluminacion">Poca iluminación</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="sin-iluminacion" id="sin-iluminacion" />
              <Label htmlFor="sin-iluminacion">Sin iluminación</Label>
            </div>
          </RadioGroup>
        </div>
      </div>
    </div>
  );
};

export default ServiciosDomiciliariosForm;
