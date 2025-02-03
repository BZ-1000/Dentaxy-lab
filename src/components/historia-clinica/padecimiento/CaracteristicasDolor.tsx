import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

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
    <div className="space-y-4">
      <h4 className="font-medium text-lg">Características del Dolor</h4>
      
      <div>
        <Label>Fecha de inicio</Label>
        <Input
          type="date"
          value={dolor.fechaInicio}
          onChange={(e) => onDolorChange('fechaInicio', e.target.value)}
          className="w-48"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label>Condición de aparición</Label>
          <Select
            value={dolor.condicionAparicion}
            onValueChange={(value) => onDolorChange('condicionAparicion', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Seleccione condición" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="provocado">Provocado</SelectItem>
              <SelectItem value="espontaneo">Espontáneo</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label>Frecuencia</Label>
          <Select
            value={dolor.frecuencia}
            onValueChange={(value) => onDolorChange('frecuencia', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Seleccione frecuencia" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="intermitente">Intermitente</SelectItem>
              <SelectItem value="continuo">Continuo</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label>Carácter</Label>
          <Select
            value={dolor.caracter}
            onValueChange={(value) => onDolorChange('caracter', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Seleccione carácter" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="pulsatil">Pulsátil</SelectItem>
              <SelectItem value="sordo">Sordo</SelectItem>
              <SelectItem value="quemante">Quemante</SelectItem>
              <SelectItem value="opresivo">Opresivo</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label>Tipo de localización</Label>
          <Select
            value={dolor.localizacion.tipo}
            onValueChange={(value) => onDolorChange('localizacion', JSON.stringify({ ...dolor.localizacion, tipo: value }))}
          >
            <SelectTrigger>
              <SelectValue placeholder="Seleccione tipo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="localizado">Localizado</SelectItem>
              <SelectItem value="irradiado">Irradiado</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div>
        <Label>Descripción de la localización</Label>
        <Input
          value={dolor.localizacion.descripcion}
          onChange={(e) => onDolorChange('localizacion', JSON.stringify({ ...dolor.localizacion, descripcion: e.target.value }))}
          placeholder="Describa la localización del dolor"
        />
      </div>

      <div>
        <Label>Atenuación</Label>
        <Input
          value={dolor.atenuacion}
          onChange={(e) => onDolorChange('atenuacion', e.target.value)}
          placeholder="¿Qué atenúa el dolor?"
        />
      </div>
    </div>
  );
};

export default CaracteristicasDolor;