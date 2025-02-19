
import React from 'react';
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FormDataState } from '@/types/historiaClinica';

interface HabitosAlimenticiosFormProps {
  formData: FormDataState;
  handleInputChange: (section: string, field: string, value: any) => void;
}

const HabitosAlimenticiosForm = ({ formData, handleInputChange }: HabitosAlimenticiosFormProps) => {
  return (
    <div className="bg-gray-50 dark:bg-gray-900 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
      <h4 className="text-lg font-semibold mb-4">Hábitos Alimenticios</h4>
      <div className="grid gap-4">
        <div>
          <Label>Número de Comidas al Día</Label>
          <Select
            value={formData.habitosAlimenticios.numeroComidas}
            onValueChange={(value) => handleInputChange('habitosAlimenticios', 'numeroComidas', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Seleccione número" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="3-comidas">3 comidas</SelectItem>
              <SelectItem value="4-comidas">4 comidas</SelectItem>
              <SelectItem value="5-o-mas">5 o más comidas</SelectItem>
              <SelectItem value="menos-3">Menos de 3 comidas</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label>Horario de Comidas</Label>
          <Select
            value={formData.habitosAlimenticios.horarioComidas}
            onValueChange={(value) => handleInputChange('habitosAlimenticios', 'horarioComidas', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Seleccione horario" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="fijo">Fijo (desayuno, almuerzo, cena)</SelectItem>
              <SelectItem value="irregular">Irregular</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label>¿Saltas Alguna Comida Frecuentemente?</Label>
          <Select
            value={formData.habitosAlimenticios.saltaComidas}
            onValueChange={(value) => handleInputChange('habitosAlimenticios', 'saltaComidas', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Seleccione opción" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="desayuno">Sí, el desayuno</SelectItem>
              <SelectItem value="almuerzo">Sí, el almuerzo</SelectItem>
              <SelectItem value="cena">Sí, la cena</SelectItem>
              <SelectItem value="no">No</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label>¿Realizas Ayuno Prolongado?</Label>
          <Select
            value={formData.habitosAlimenticios.ayunoProlongado}
            onValueChange={(value) => handleInputChange('habitosAlimenticios', 'ayunoProlongado', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Seleccione opción" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="eleccion">Sí, por elección</SelectItem>
              <SelectItem value="falta-acceso">Sí, por falta de acceso a alimentos</SelectItem>
              <SelectItem value="no">No</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
};

export default HabitosAlimenticiosForm;
