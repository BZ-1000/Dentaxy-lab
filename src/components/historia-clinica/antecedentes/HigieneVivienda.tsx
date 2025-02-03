import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CustomCheckbox } from "@/components/ui/custom-checkbox";

interface HigieneViviendaProps {
  frecuenciaLimpieza: string;
  hacinamiento: boolean;
  onFrecuenciaChange: (value: string) => void;
  onHacinamientoChange: (checked: boolean) => void;
}

const HigieneVivienda = ({
  frecuenciaLimpieza,
  hacinamiento,
  onFrecuenciaChange,
  onHacinamientoChange
}: HigieneViviendaProps) => {
  return (
    <div className="space-y-4 mb-6">
      <h4 className="text-lg font-mplus font-normal">Higiene de la Vivienda</h4>
      <div className="grid gap-4">
        <div>
          <Label>Frecuencia de Limpieza</Label>
          <Select value={frecuenciaLimpieza} onValueChange={onFrecuenciaChange}>
            <SelectTrigger>
              <SelectValue placeholder="Seleccione frecuencia" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="diaria">Diaria</SelectItem>
              <SelectItem value="semanal">Semanal</SelectItem>
              <SelectItem value="quincenal">Quincenal</SelectItem>
              <SelectItem value="mensual">Mensual</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label>Hacinamiento</Label>
          <div className="flex items-center space-x-2">
            <CustomCheckbox 
              id="hacinamiento"
              checked={hacinamiento}
              onChange={(e) => onHacinamientoChange(e.target.checked)}
            />
            <Label htmlFor="hacinamiento">Presente</Label>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HigieneVivienda;