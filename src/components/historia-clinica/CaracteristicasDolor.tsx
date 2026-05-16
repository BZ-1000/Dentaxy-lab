import React, { useState, useRef, useEffect } from "react";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { BookOpen, Lightbulb } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Typewriter } from "@/components/ui/typewriter-text";

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
    causaProvocado?: string;
    ubicacion?: string; // Add ubicacion to the dolor object
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

const defaultLocalizacion = "Localizado en ";
const localizacionesEjemplo = [
  "la región molar inferior izquierda...",
  "la articulación temporomandibular izquierda...",
  "el piso de boca, irradiado hacia la lengua...",
  "la papila interdentaria entre los incisivos inferiores..."
];
const defaultCausaProvocado = "Provocado con ";
const causasProvocadoEjemplo = [
  "alimentos fríos o helados en contacto con el diente...",
  "la presión durante la masticación de alimentos duros...",
  "bebidas calientes que generan dolor inmediato...",
  "el cepillado en la zona vestibular de los premolares...",
  "dulces y alimentos azucarados que desencadenan molestias..."
];

const CaracteristicasDolor = ({ dolor, onDolorChange }: CaracteristicasDolorProps) => {
  const [showIcon, setShowIcon] = useState(false);
  const [localizacionText, setLocalizacionText] = useState(dolor.localizacion?.descripcion || defaultLocalizacion);
  const [causaProvocadoText, setCausaProvocadoText] = useState(dolor.causaProvocado || defaultCausaProvocado);

  useEffect(() => {
    const interval = setInterval(() => {
      setShowIcon(true);
      setTimeout(() => setShowIcon(false), 2000);
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  const handleLocalizacionChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    let newValue = event.target.value;

    // Ensure the default text is preserved
    if (!newValue.startsWith(defaultLocalizacion)) {
      newValue = defaultLocalizacion + newValue.substring(newValue.indexOf(defaultLocalizacion) + defaultLocalizacion.length);
    }
    setLocalizacionText(newValue);

    // Only update the description part in the dolor object
    const descripcion = newValue;
    onDolorChange("localizacion", JSON.stringify({
      tipo: dolor.localizacion?.tipo || "",
      descripcion
    }));
  };

  const handleCausaProvocadoChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    let newValue = event.target.value;

    // Ensure the default text is preserved
    if (!newValue.startsWith(defaultCausaProvocado)) {
      newValue = defaultCausaProvocado + newValue.substring(newValue.indexOf(defaultCausaProvocado) + defaultCausaProvocado.length);
    }
    setCausaProvocadoText(newValue);
    onDolorChange('causaProvocado', newValue);
  };

  // Prevent deleting the prefix by handling keydown events
  const handleKeyDown = (prefix: string, event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    const target = event.currentTarget;
    const selectionStart = target.selectionStart;
    const selectionEnd = target.selectionEnd;

    // Prevent backspace at the beginning or when trying to delete the prefix
    if (event.key === 'Backspace' && (selectionStart <= prefix.length || selectionStart === selectionEnd && selectionStart <= prefix.length)) {
      event.preventDefault();
    }

    // Prevent delete key when selection includes the prefix
    if (event.key === 'Delete' && selectionStart < prefix.length) {
      event.preventDefault();
    }

    // Prevent cut when selection includes the prefix
    if ((event.ctrlKey || event.metaKey) && event.key === 'x' && selectionStart < prefix.length) {
      event.preventDefault();
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 flex-row-reverse justify-end">
        <h4 className="text-lg font-normal">Características del Dolor</h4>
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" size="icon" className="relative h-10 w-10 rounded-full border-2 border-primary/20 transition-all duration-100 shadow-md hover:shadow-lg font-normal text-neutral-50 bg-sky-500 hover:bg-sky-400">
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
            onChange={e => onDolorChange('fechaInicio', e.target.value)}
            className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all duration-200 bg-white/50 backdrop-blur-sm shadow-sm hover:shadow-md"
          />
        </div>

        <div>
          <Label>Condición de aparición</Label>
          <Select value={dolor.condicionAparicion} onValueChange={value => onDolorChange('condicionAparicion', value)}>
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
          <Select value={dolor.frecuencia} onValueChange={value => onDolorChange('frecuencia', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Seleccione frecuencia" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="intermitente">Intermitente</SelectItem>
              <SelectItem value="continua">Continua</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label>Carácter</Label>
          <Select value={dolor.caracter} onValueChange={value => onDolorChange('caracter', value)}>
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
          <Select value={dolor.intensidad} onValueChange={value => onDolorChange('intensidad', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Seleccione intensidad" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="leve">Leve</SelectItem>
              <SelectItem value="moderada">Moderada</SelectItem>
              <SelectItem value="severa">Severa</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label>Ubicación</Label>
          <Select value={dolor.ubicacion} onValueChange={value => onDolorChange('ubicacion', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Seleccione ubicación" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="localizado">Localizado</SelectItem>
              <SelectItem value="irradiado">Irradiado</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {dolor.ubicacion === 'localizado' && (
        <div>
          <Label className="text-gray-700 dark:text-gray-300">Localización</Label>
          <div className="flex items-start gap-4">
            <div className="relative w-full">
              <Textarea
                value={localizacionText}
                onChange={handleLocalizacionChange}
                onKeyDown={e => handleKeyDown(defaultLocalizacion, e)}
                placeholder={defaultLocalizacion}
                className="min-h-[100px] max-h-[200px] w-full resize-y bg-transparent dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-md text-justify"
              />
              {localizacionText === defaultLocalizacion && (
                <div className="absolute top-2 left-[115px] pointer-events-none">
                  <Typewriter
                    text={localizacionesEjemplo}
                    speed={50}
                    deleteSpeed={30}
                    delay={2000}
                    loop={true}
                    className="text-gray-500 italic text-base"
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <div>
        <Label>Atenuación</Label>
        <div className="flex items-start gap-4">
          <Textarea
            value={dolor.atenuacion}
            onChange={e => onDolorChange('atenuacion', e.target.value)}
            placeholder="Describe que empeora el dolor (frío, caliente,) o que lo disminuye (analgésicos)"
            className="min-h-[100px] max-h-[200px] w-full resize-y text-justify"
          />
        </div>
      </div>

      {dolor.condicionAparicion === 'provocado' && (
        <div className="mt-4">
          <Label className="text-gray-700 dark:text-gray-300">Causa del dolor provocado:</Label>
          <div className="flex items-start gap-4">
            <div className="relative w-full">
              <Textarea
                value={causaProvocadoText}
                onChange={handleCausaProvocadoChange}
                onKeyDown={e => handleKeyDown(defaultCausaProvocado, e)}
                placeholder={defaultCausaProvocado}
                className="min-h-[100px] max-h-[200px] w-full resize-y bg-transparent dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-md text-justify"
              />
              {causaProvocadoText === defaultCausaProvocado && (
                <div className="absolute top-2 left-[115px] pointer-events-none">
                  <Typewriter
                    text={causasProvocadoEjemplo}
                    speed={50}
                    deleteSpeed={30}
                    delay={2000}
                    loop={true}
                    className="text-gray-500 italic text-base"
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CaracteristicasDolor;
