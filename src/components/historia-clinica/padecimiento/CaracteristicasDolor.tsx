
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { VoiceInput } from "@/components/ui/voice-input";
import { BookOpen, Lightbulb } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";

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
    titulo: "Dolor Sordo",
    descripcion: "Constante y moderado, sin punzadas. Puede indicar inflamaciones crónicas como pulpitis o periodontitis."
  },
  {
    titulo: "Dolor Pulsátil",
    descripcion: "En forma de latidos intensos. Suele deberse a pulpitis aguda o abscesos."
  },
  {
    titulo: "Dolor Quemante",
    descripcion: "Sensación de ardor. Relacionado con neuropatías, boca ardiente o infecciones virales."
  },
  {
    titulo: "Dolor Opresivo",
    descripcion: "Sensación de presión. Se asocia con problemas de ATM, bruxismo o sinusitis."
  }
];

const CaracteristicasDolor = ({ dolor, onDolorChange }: CaracteristicasDolorProps) => {
  const [showIcon, setShowIcon] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setShowIcon(true);
      setTimeout(() => setShowIcon(false), 2000);
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 flex-row-reverse justify-end">
        <h4 className="font-medium text-lg">Características del Dolor</h4>
        <Popover>
          <PopoverTrigger asChild>
            <Button 
              variant="outline" 
              size="icon" 
              className="relative h-10 w-10 rounded-full border-2 border-primary/20 bg-background hover:bg-accent hover:text-accent-foreground transition-all duration-300 shadow-md hover:shadow-lg"
            >
              <div className="relative">
                <BookOpen className="h-5 w-5 transition-transform duration-300 hover:scale-110" />
                {showIcon && (
                  <div className="absolute -bottom-3 -right-3 animate-bounce">
                    <Lightbulb className="h-4 w-4 text-yellow-400" />
                  </div>
                )}
              </div>
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80 p-4 bg-white/95 backdrop-blur-sm shadow-xl border border-primary/10 rounded-lg">
            <div className="space-y-4">
              {definicionesDolor.map((def, index) => (
                <div key={index} className="space-y-2 p-3 rounded-lg hover:bg-accent/10 transition-colors duration-200">
                  <h5 className="font-medium text-sm text-primary">{def.titulo}</h5>
                  <p className="text-xs text-muted-foreground leading-relaxed">{def.descripcion}</p>
                </div>
              ))}
            </div>
          </PopoverContent>
        </Popover>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label>Fecha de inicio del dolor</Label>
          <input
            type="date"
            value={dolor.fechaInicio}
            onChange={(e) => onDolorChange('fechaInicio', e.target.value)}
            className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all duration-200 bg-white/50 backdrop-blur-sm shadow-sm hover:shadow-md"
          />
        </div>

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
              <SelectItem value="continuo">Continua</SelectItem>
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
              <SelectItem value="moderado">Moderada</SelectItem>
              <SelectItem value="severo">Severa</SelectItem>
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
            placeholder="Describe que empeora el dolor (frío,caliente,) o que lo disminuye (analgésicos)"
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
