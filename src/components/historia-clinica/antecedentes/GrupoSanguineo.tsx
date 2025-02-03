import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

interface GrupoSanguineoProps {
  grupo: string;
  factorRh: string;
  onGrupoChange: (value: string) => void;
  onFactorRhChange: (value: string) => void;
}

const GrupoSanguineo = ({
  grupo,
  factorRh,
  onGrupoChange,
  onFactorRhChange
}: GrupoSanguineoProps) => {
  return (
    <div className="space-y-4 mb-6">
      <h4 className="text-lg font-mplus font-normal">Grupo Sanguíneo y Factor RH</h4>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>Grupo Sanguíneo</Label>
          <Select value={grupo} onValueChange={onGrupoChange}>
            <SelectTrigger>
              <SelectValue placeholder="Seleccione grupo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="O">O</SelectItem>
              <SelectItem value="A">A</SelectItem>
              <SelectItem value="B">B</SelectItem>
              <SelectItem value="AB">AB</SelectItem>
              <SelectItem value="desconoce">Desconoce</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label>Factor RH</Label>
          <RadioGroup value={factorRh} onValueChange={onFactorRhChange} className="flex gap-4">
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="positivo" id="rh-positivo" />
              <Label htmlFor="rh-positivo">Positivo</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="negativo" id="rh-negativo" />
              <Label htmlFor="rh-negativo">Negativo</Label>
            </div>
          </RadioGroup>
        </div>
      </div>
    </div>
  );
};

export default GrupoSanguineo;