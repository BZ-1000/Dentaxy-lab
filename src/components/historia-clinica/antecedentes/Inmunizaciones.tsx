import { Label } from "@/components/ui/label";
import { CustomCheckbox } from "@/components/ui/custom-checkbox";

interface InmunizacionesProps {
  esquemaCompleto: boolean;
  tieneCartilla: boolean;
  onEsquemaChange: (checked: boolean) => void;
  onCartillaChange: (checked: boolean) => void;
}

const Inmunizaciones = ({
  esquemaCompleto,
  tieneCartilla,
  onEsquemaChange,
  onCartillaChange
}: InmunizacionesProps) => {
  return (
    <div className="space-y-4">
      <h4 className="text-lg font-mplus font-normal">Inmunizaciones</h4>
      <div className="space-y-2">
        <div className="flex items-center space-x-2">
          <CustomCheckbox 
            id="esquema-completo"
            checked={esquemaCompleto}
            onCheckedChange={(checked) => onEsquemaChange(checked as boolean)}
          />
          <Label htmlFor="esquema-completo">Esquema de vacunación completo</Label>
        </div>
        <div className="flex items-center space-x-2">
          <CustomCheckbox 
            id="cartilla"
            checked={tieneCartilla}
            onCheckedChange={(checked) => onCartillaChange(checked as boolean)}
          />
          <Label htmlFor="cartilla">Cuenta con cartilla nacional de vacunación</Label>
        </div>
      </div>
    </div>
  );
};

export default Inmunizaciones;