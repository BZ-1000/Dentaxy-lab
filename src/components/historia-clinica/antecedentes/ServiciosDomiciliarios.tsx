import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { CustomCheckbox } from "@/components/ui/custom-checkbox";

interface ServiciosDomiciliariosProps {
  tipoVivienda: string;
  onTipoViviendaChange: (value: string) => void;
  servicios: {
    agua: boolean;
    luz: boolean;
    drenaje: boolean;
    transporte: boolean;
  };
  onServicioChange: (servicio: string, checked: boolean) => void;
}

const ServiciosDomiciliarios = ({
  tipoVivienda,
  onTipoViviendaChange,
  servicios,
  onServicioChange
}: ServiciosDomiciliariosProps) => {
  return (
    <div className="space-y-4 mb-6">
      <h4 className="text-lg font-mplus font-normal">Servicios Domiciliarios</h4>
      <div className="grid gap-4">
        <div>
          <Label>Tipo de Vivienda</Label>
          <RadioGroup value={tipoVivienda} onValueChange={onTipoViviendaChange} className="flex gap-4">
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="urbana" id="urbana" />
              <Label htmlFor="urbana">Urbana</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="rural" id="rural" />
              <Label htmlFor="rural">Rural</Label>
            </div>
          </RadioGroup>
        </div>
        <div>
          <Label>Servicios</Label>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center space-x-2">
              <CustomCheckbox 
                id="agua" 
                checked={servicios.agua}
                onChange={(e) => onServicioChange('agua', e.target.checked)}
              />
              <Label htmlFor="agua">Agua</Label>
            </div>
            <div className="flex items-center space-x-2">
              <CustomCheckbox 
                id="luz"
                checked={servicios.luz}
                onChange={(e) => onServicioChange('luz', e.target.checked)}
              />
              <Label htmlFor="luz">Luz</Label>
            </div>
            <div className="flex items-center space-x-2">
              <CustomCheckbox 
                id="drenaje"
                checked={servicios.drenaje}
                onChange={(e) => onServicioChange('drenaje', e.target.checked)}
              />
              <Label htmlFor="drenaje">Drenaje</Label>
            </div>
            <div className="flex items-center space-x-2">
              <CustomCheckbox 
                id="transporte"
                checked={servicios.transporte}
                onChange={(e) => onServicioChange('transporte', e.target.checked)}
              />
              <Label htmlFor="transporte">Transporte</Label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiciosDomiciliarios;