
import React from 'react';
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CustomCheckbox } from "@/components/ui/custom-checkbox";
import { FormDataState } from '@/types/historiaClinica';

interface AlimentacionFormProps {
  formData: FormDataState;
  handleInputChange: (section: string, field: string, value: any) => void;
}

const AlimentacionForm = ({ formData, handleInputChange }: AlimentacionFormProps) => {
  return (
    <div className="bg-gray-50 dark:bg-gray-900 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
      <h4 className="text-lg font-semibold mb-4">Alimentación</h4>
      <div className="grid gap-4">
        <div>
          <Label>Tipo de Alimentos Consumidos Frecuentemente</Label>
          <div className="grid gap-2 mt-2">
            <div className="flex items-center space-x-2">
              <CustomCheckbox
                id="frutas-verduras"
                checked={formData.alimentacion.tiposAlimentos.frutasVerduras}
                onCheckedChange={(checked) => 
                  handleInputChange('alimentacion', 'tiposAlimentos.frutasVerduras', checked)
                }
              />
              <Label htmlFor="frutas-verduras">Frutas y verduras</Label>
            </div>
            <div className="flex items-center space-x-2">
              <CustomCheckbox
                id="carnes-proteinas"
                checked={formData.alimentacion.tiposAlimentos.carnesProteinas}
                onCheckedChange={(checked) => 
                  handleInputChange('alimentacion', 'tiposAlimentos.carnesProteinas', checked)
                }
              />
              <Label htmlFor="carnes-proteinas">Carnes y proteínas</Label>
            </div>
            <div className="flex items-center space-x-2">
              <CustomCheckbox
                id="procesados-fritos"
                checked={formData.alimentacion.tiposAlimentos.procesadosFritos}
                onCheckedChange={(checked) => 
                  handleInputChange('alimentacion', 'tiposAlimentos.procesadosFritos', checked)
                }
              />
              <Label htmlFor="procesados-fritos">Alimentos procesados y fritos</Label>
            </div>
            <div className="flex items-center space-x-2">
              <CustomCheckbox
                id="dulces-azucares"
                checked={formData.alimentacion.tiposAlimentos.dulcesAzucares}
                onCheckedChange={(checked) => 
                  handleInputChange('alimentacion', 'tiposAlimentos.dulcesAzucares', checked)
                }
              />
              <Label htmlFor="dulces-azucares">Dulces y azúcares</Label>
            </div>
            <div className="flex items-center space-x-2">
              <CustomCheckbox
                id="lacteos"
                checked={formData.alimentacion.tiposAlimentos.lacteos}
                onCheckedChange={(checked) => 
                  handleInputChange('alimentacion', 'tiposAlimentos.lacteos', checked)
                }
              />
              <Label htmlFor="lacteos">Lácteos</Label>
            </div>
          </div>
        </div>

        <div>
          <Label>Frecuencia de Consumo de Frutas y Verduras</Label>
          <Select
            value={formData.alimentacion.frecuenciaFrutasVerduras}
            onValueChange={(value) => handleInputChange('alimentacion', 'frecuenciaFrutasVerduras', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Seleccione frecuencia" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="diario">Diario</SelectItem>
              <SelectItem value="3-4-semana">3-4 veces por semana</SelectItem>
              <SelectItem value="ocasional">Ocasionalmente</SelectItem>
              <SelectItem value="no-consume">No las consume</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label>Frecuencia de Consumo de Bebidas Azucaradas</Label>
          <Select
            value={formData.alimentacion.frecuenciaBebidasAzucaradas}
            onValueChange={(value) => handleInputChange('alimentacion', 'frecuenciaBebidasAzucaradas', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Seleccione frecuencia" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="diario">Diario</SelectItem>
              <SelectItem value="3-4-semana">3-4 veces por semana</SelectItem>
              <SelectItem value="ocasional">Ocasionalmente</SelectItem>
              <SelectItem value="no-consume">No las consume</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label>Consumo de Agua al Día</Label>
          <Select
            value={formData.alimentacion.consumoAgua}
            onValueChange={(value) => handleInputChange('alimentacion', 'consumoAgua', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Seleccione cantidad" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="mas-2-litros">Más de 2 litros</SelectItem>
              <SelectItem value="1-2-litros">1-2 litros</SelectItem>
              <SelectItem value="menos-1-litro">Menos de 1 litro</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
};

export default AlimentacionForm;
