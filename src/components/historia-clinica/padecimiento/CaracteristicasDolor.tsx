import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";

interface CaracteristicasDolorProps {
  dolor: {
    fechaInicio: string;
    condicionAparicion: string;
    frecuencia: string;
    caracter: string;
    localizacion: {
      tipo: string;
      descripcion: string;
    };
    atenuacion: string;
  };
  onDolorChange: (field: string, value: string) => void;
}

const CaracteristicasDolor = ({ dolor, onDolorChange }: CaracteristicasDolorProps) => {
  return (
    <div className="space-y-4 border-t pt-4">
      <h4 className="text-lg font-semibold">Características del Dolor</h4>
      
      <div>
        <Label>Fecha de inicio del dolor</Label>
        <Input
          type="date"
          value={dolor.fechaInicio}
          onChange={(e) => onDolorChange('fechaInicio', e.target.value)}
        />
      </div>

      <div>
        <Label>Condición de aparición</Label>
        <RadioGroup
          value={dolor.condicionAparicion}
          onValueChange={(value) => onDolorChange('condicionAparicion', value)}
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="provocado" id="provocado" />
            <Label htmlFor="provocado">Provocado</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="espontaneo" id="espontaneo" />
            <Label htmlFor="espontaneo">Espontáneo</Label>
          </div>
        </RadioGroup>
      </div>

      <div>
        <Label>Frecuencia</Label>
        <RadioGroup
          value={dolor.frecuencia}
          onValueChange={(value) => onDolorChange('frecuencia', value)}
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="intermitente" id="intermitente" />
            <Label htmlFor="intermitente">Intermitente</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="continuo" id="continuo" />
            <Label htmlFor="continuo">Continuo</Label>
          </div>
        </RadioGroup>
      </div>

      <div>
        <Label>Carácter del dolor</Label>
        <RadioGroup
          value={dolor.caracter}
          onValueChange={(value) => onDolorChange('caracter', value)}
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="pulsatil" id="pulsatil" />
            <Label htmlFor="pulsatil">Pulsátil</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="sordo" id="sordo" />
            <Label htmlFor="sordo">Sordo</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="quemante" id="quemante" />
            <Label htmlFor="quemante">Quemante</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="opresivo" id="opresivo" />
            <Label htmlFor="opresivo">Opresivo</Label>
          </div>
        </RadioGroup>
      </div>

      <div>
        <Label>Localización del dolor</Label>
        <RadioGroup
          value={dolor.localizacion.tipo}
          onValueChange={(value) => {
            onDolorChange('localizacion', JSON.stringify({
              ...dolor.localizacion,
              tipo: value
            }))
          }}
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="localizado" id="localizado" />
            <Label htmlFor="localizado">Localizado</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="irradiado" id="irradiado" />
            <Label htmlFor="irradiado">Irradiado</Label>
          </div>
        </RadioGroup>
        <Input
          className="mt-2"
          placeholder="Descripción de la localización"
          value={dolor.localizacion.descripcion}
          onChange={(e) => {
            onDolorChange('localizacion', JSON.stringify({
              ...dolor.localizacion,
              descripcion: e.target.value
            }))
          }}
        />
      </div>

      <div>
        <Label>Atenuación</Label>
        <Textarea
          value={dolor.atenuacion}
          onChange={(e) => onDolorChange('atenuacion', e.target.value)}
          placeholder="Condiciones que exacerban o disminuyen el dolor"
        />
      </div>
    </div>
  );
};

export default CaracteristicasDolor;