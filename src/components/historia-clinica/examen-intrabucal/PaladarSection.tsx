import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { AlertCircle, Eye, EyeOff } from "lucide-react";

interface PaladarSectionProps {
  selectedOptions: {[key: string]: string};
  onToggleOption: (option: string, category: string, isMulti?: boolean) => void;
  colorOptions: Array<{color: string, label: string}>;
}

const PaladarSection: React.FC<PaladarSectionProps> = ({
  selectedOptions,
  onToggleOption,
  colorOptions
}) => {
  const [paladarNormal, setPaladarNormal] = useState(false);

  const handlePaladarNormalChange = () => {
    setPaladarNormal(prevState => !prevState);
  };

  // Helper reutilizable para renderizar botones de opción
  const renderOptionButtons = (options: string[], category: string) => (
    <div className="flex flex-wrap gap-1">
      {options.map((option) => (
        <div key={option} className="flex flex-col">
          <Button
            variant={selectedOptions[category] === option ? "default" : "outline"}
            size="xs"
            onClick={() => onToggleOption(option, category)}
            className="px-2 py-1 text-xs rounded-lg"
          >
            {option}
          </Button>
          {(option.toLowerCase().includes('otro') || option.toLowerCase().includes('especificar') || option.toLowerCase().includes('localizado')) && selectedOptions[category] === option && (
            <Textarea
              placeholder={option.toLowerCase().includes('localizado') ? "Especificar ubicación..." : "Especificar..."}
              className="mt-1 w-full text-xs h-6"
            />
          )}
        </div>
      ))}
    </div>
  );

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-bold border-b pb-2">🦷 2. Exploración del Paladar</h3>

      <div
        className="bg-blue-50 dark:bg-blue-900/20 p-2 sm:p-4 rounded-lg border border-blue-100 dark:border-blue-800 w-full text-left cursor-pointer"
        onClick={handlePaladarNormalChange}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1 sm:gap-2">
            <AlertCircle className="h-4 w-4 sm:h-5 sm:w-5 text-blue-500" />
            <Label className="text-xs sm:text-sm font-medium text-blue-700 dark:text-blue-300">
              Paladar sin hallazgos patológicos
            </Label>
          </div>
          <Switch
            checked={paladarNormal}
            onCheckedChange={handlePaladarNormalChange}
            className="data-[state=checked]:bg-blue-500 scale-75 sm:scale-100"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      </div>

      {!paladarNormal && (
        <div className="space-y-6 pt-4">
          
          {/* --- SECCIÓN I: ARQUITECTURA Y CARACTERÍSTICAS GENERALES --- */}
          <div>
            <h4 className="font-semibold text-base mb-2">I. Arquitectura y Características Generales</h4>
            <div className="space-y-4 pl-2 border-l-2">
              {/* 1. Forma / Bóveda palatina */}
              <div>
                <h5 className="font-medium text-sm">1. Forma / Bóveda palatina:</h5>
                {renderOptionButtons(['Normal (semicircular)', 'Ojival (alta y estrecha)', 'Plana', 'Asimétrica', 'Otro (especificar)'], 'forma-paladar')}
              </div>
              {/* 2. Color de la Mucosa */}
              <div>
                <h5 className="font-medium text-sm">2. Color de la Mucosa:</h5>
                <div className="flex flex-wrap gap-2 items-center">
                  {colorOptions.map((option) => (
                    <Button key={option.label} variant={selectedOptions['color-paladar'] === option.label ? "default" : "outline"} size="xs" onClick={() => onToggleOption(option.label, 'color-paladar')} className="px-2 py-1 text-xs rounded-lg flex items-center gap-1.5">
                      <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: option.color, border: '1px solid #555' }} />
                      {option.label}
                    </Button>
                  ))}
                  {renderOptionButtons(['Otro color (especificar)'], 'color-paladar')}
                </div>
              </div>
              {/* 3. Textura de la superficie */}
              <div>
                <h5 className="font-medium text-sm">3. Textura de la superficie:</h5>
                {renderOptionButtons(['Lisa y uniforme', 'Rugosa', 'Granular', 'Fisurada', 'Otro (especificar)'], 'textura-paladar')}
              </div>
              {/* 4. Humedad */}
              <div>
                <h5 className="font-medium text-sm">4. Humedad:</h5>
                {renderOptionButtons(['Normal (húmeda y brillante)', 'Seca (xerostomía)', 'Saliva viscosa/espumosa'], 'humedad-paladar')}
              </div>
            </div>
          </div>
          
          {/* --- SECCIÓN II: ESTRUCTURAS ANATÓMICAS ESPECÍFICAS --- */}
          <div>
            <h4 className="font-semibold text-base mb-2">II. Estructuras Anatómicas Específicas</h4>
            <div className="space-y-4 pl-2 border-l-2">
              {/* 5. Rugosidades Palatinas */}
              <div>
                <h5 className="font-medium text-sm">5. Rugosidades Palatinas:</h5>
                {renderOptionButtons(['Normales y simétricas', 'Prominentes', 'Poco definidas/lisas', 'Asimétricas', 'Irritadas/inflamadas'], 'rugosidades-paladar')}
              </div>
              {/* 6. Rafe Palatino Medio */}
              <div>
                <h5 className="font-medium text-sm">6. Rafe Palatino Medio:</h5>
                {renderOptionButtons(['Normal', 'Prominente', 'Fisurado', 'No visible'], 'rafe-paladar')}
              </div>
              {/* 7. Úvula */}
              <div>
                <h5 className="font-medium text-sm">7. Úvula:</h5>
                {renderOptionButtons(['Normal (única y centrada)', 'Bífida', 'Alargada', 'Corta', 'Desviada (Izq./Der.)', 'Edematosa/Inflamada'], 'uvula-paladar')}
              </div>
            </div>
          </div>

          {/* --- SECCIÓN III: HALLAZGOS ADICIONALES OBSERVADOS --- */}
          <div>
            <h4 className="font-semibold text-base mb-2">III. Hallazgos Adicionales Observados</h4>
            <div className="space-y-4 pl-2 border-l-2">
              {/* 8. Presencia de Hallazgos */}
              <div>
                <h5 className="font-medium text-sm">8. ¿Se observan hallazgos adicionales?</h5>
                {renderOptionButtons(['Sin hallazgos aparentes', 'Sí, se observan hallazgos'], 'hallazgos-paladar')}
              </div>
              
              {/* Sub-sección condicional */}
              {selectedOptions['hallazgos-paladar'] === 'Sí, se observan hallazgos' && (
                <div className="space-y-4 p-3 bg-gray-50 dark:bg-gray-800/30 rounded-md">
                  <h6 className="font-semibold text-sm text-gray-700 dark:text-gray-300">Describir el Hallazgo:</h6>
                  <div>
                    <h5 className="font-medium text-xs mb-1">A. Tipo de Hallazgo:</h5>
                    {renderOptionButtons(['Torus Palatino', 'Manchas Rojas (eritema)', 'Manchas Blancas (no desprendibles)', 'Manchas Pigmentadas (oscuras)', 'Placas Blanquecinas (removibles)', 'Aumento de volumen (nódulo/masa)', 'Vesículas/Ampollas', 'Úlceras/Erosiones', 'Petequias (puntos rojos)', 'Fisuras', 'Otro (especificar)'], 'tipo-hallazgo-paladar')}
                  </div>
                  <div>
                    <h5 className="font-medium text-xs mb-1">B. Localización:</h5>
                    {renderOptionButtons(['Paladar Duro', 'Paladar Blando', 'Unión paladar duro/blando', 'Línea Media', 'Lateralizado Derecho', 'Lateralizado Izquierdo'], 'localizacion-hallazgo-paladar')}
                  </div>
                  <div>
                    <h5 className="font-medium text-xs mb-1">C. Distribución:</h5>
                    {renderOptionButtons(['Único y localizado', 'Múltiple y localizado', 'Generalizado/Difuso'], 'distribucion-hallazgo-paladar')}
                  </div>
                  <div>
                    <h5 className="font-medium text-xs mb-1">D. Consistencia a la Palpación:</h5>
                    {renderOptionButtons(['No aplica', 'Blanda', 'Firme', 'Dura (ósea)', 'Fluctuante'], 'consistencia-hallazgo-paladar')}
                  </div>
                  <div>
                    <Label htmlFor="tamano-hallazgo" className="font-medium text-xs mb-1 block">E. Tamaño Aproximado (mm):</Label>
                    <Input id="tamano-hallazgo" placeholder="Ej: 5x3 mm" className="h-8 text-xs"/>
                  </div>
                </div>
              )}
            </div>
          </div>
          
        </div>
      )}
    </div>
  );
};

export default PaladarSection;