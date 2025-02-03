import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface HigienePersonalProps {
  frecuenciaBano: string;
  onFrecuenciaChange: (value: string) => void;
}

const HigienePersonal = ({
  frecuenciaBano,
  onFrecuenciaChange
}: HigienePersonalProps) => {
  return (
    <div className="space-y-4 mb-6">
      <h4 className="text-lg font-mplus font-normal">Higiene Personal</h4>
      <div className="grid gap-4">
        <div>
          <Label>Frecuencia de Baño</Label>
          <Select value={frecuenciaBano} onValueChange={onFrecuenciaChange}>
            <SelectTrigger>
              <SelectValue placeholder="Seleccione frecuencia" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="diario">Diario</SelectItem>
              <SelectItem value="cada-tercer-dia">Cada tercer día</SelectItem>
              <SelectItem value="semanal">Semanal</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
};

export default HigienePersonal;