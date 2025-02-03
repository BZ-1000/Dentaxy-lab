import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CustomCheckbox } from "@/components/ui/custom-checkbox";

interface HigieneBucalProps {
  frecuenciaCepillado: string;
  auxiliares: {
    hiloDental: boolean;
    enjuague: boolean;
  };
  onFrecuenciaChange: (value: string) => void;
  onAuxiliarChange: (auxiliar: string, checked: boolean) => void;
}

const HigieneBucal = ({
  frecuenciaCepillado,
  auxiliares,
  onFrecuenciaChange,
  onAuxiliarChange
}: HigieneBucalProps) => {
  return (
    <div className="space-y-4 mb-6">
      <h4 className="text-lg font-mplus font-normal">Higiene Bucal</h4>
      <div className="grid gap-4">
        <div>
          <Label>Frecuencia de Cepillado</Label>
          <Select value={frecuenciaCepillado} onValueChange={onFrecuenciaChange}>
            <SelectTrigger>
              <SelectValue placeholder="Seleccione frecuencia" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1">1 vez al día</SelectItem>
              <SelectItem value="2">2 veces al día</SelectItem>
              <SelectItem value="3">3 veces al día</SelectItem>
              <SelectItem value="mas">Más de 3 veces al día</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label>Auxiliares de Higiene</Label>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center space-x-2">
              <CustomCheckbox 
                id="hilo-dental"
                checked={auxiliares.hiloDental}
                onChange={(e) => onAuxiliarChange('hiloDental', e.target.checked)}
              />
              <Label htmlFor="hilo-dental">Hilo Dental</Label>
            </div>
            <div className="flex items-center space-x-2">
              <CustomCheckbox 
                id="enjuague"
                checked={auxiliares.enjuague}
                onChange={(e) => onAuxiliarChange('enjuague', e.target.checked)}
              />
              <Label htmlFor="enjuague">Enjuague Bucal</Label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HigieneBucal;