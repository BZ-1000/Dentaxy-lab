
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { VoiceInput } from "@/components/ui/voice-input";
import { Book } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";

interface CaracteristicasDolorProps {
  dolor: {
    fechaInicio: string;
    condicionAparicion: string;
    frecuencia: string;
    caracter: string;
    intensidad: string;
    localizacion: {
      tipo: string;
      descripcion: string;
    };
    atenuacion: string;
  };
  onDolorChange: (field: string, value: string) => void;
}

const definicionesDolor = [
  {
    titulo: "Dolor Pulsátil",
    descripcion: "Sensación de latido o pulsación rítmica, similar al pulso. Común en migrañas."
  },
  {
    titulo: "Dolor Sordo",
    descripcion: "Dolor constante y profundo, sin punzadas agudas. Típico en dolores musculares crónicos."
  },
  {
    titulo: "Dolor Quemante",
    descripcion: "Sensación de ardor o quemazón. Frecuente en neuropatías o problemas nerviosos."
  },
  {
    titulo: "Dolor Opresivo",
    descripcion: "Sensación de presión o peso. Característico en dolores torácicos o tensionales."
  }
];

const CaracteristicasDolor = ({ dolor, onDolorChange }: CaracteristicasDolorProps) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <h4 className="font-medium text-lg">Características del Dolor</h4>
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <Book className="h-4 w-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80">
            <div className="space-y-4">
              {definicionesDolor.map((def, index) => (
                <div key={index} className="space-y-1">
                  <h5 className="font-medium text-sm">{def.titulo}</h5>
                  <p className="text-xs text-muted-foreground">{def.descripcion}</p>
                </div>
              ))}
            </div>
          </PopoverContent>
        </Popover>
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
          <Label>Intensidad</Label>
          <Select
            value={dolor.intensidad}
            onValueChange={(value) => onDolorChange('intensidad', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Seleccione intensidad" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="leve">Leve</SelectItem>
              <SelectItem value="moderado">Moderado</SelectItem>
              <SelectItem value="severo">Severo</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div>
        <Label>Localización</Label>
        <div className="flex items-center gap-4">
          <Textarea
            value={dolor.localizacion.descripcion}
            onChange={(e) => onDolorChange('localizacion', JSON.stringify({ ...dolor.localizacion, descripcion: e.target.value }))}
            placeholder="Describa la localización del dolor"
            className="min-h-[135px] max-h-[135px] w-[75%]"
          />
          <div className="h-[40px]">
            <VoiceInput 
              onTranscriptionComplete={(text) => 
                onDolorChange('localizacion', JSON.stringify({ 
                  ...dolor.localizacion, 
                  descripcion: text 
                }))
              } 
            />
          </div>
        </div>
      </div>

      <div>
        <Label>Atenuación</Label>
        <div className="flex items-center gap-4">
          <Textarea
            value={dolor.atenuacion}
            onChange={(e) => onDolorChange('atenuacion', e.target.value)}
            placeholder="¿Qué atenúa el dolor?"
            className="min-h-[135px] max-h-[135px] w-[75%]"
          />
          <div className="h-[40px]">
            <VoiceInput 
              onTranscriptionComplete={(text) => onDolorChange('atenuacion', text)} 
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CaracteristicasDolor;
