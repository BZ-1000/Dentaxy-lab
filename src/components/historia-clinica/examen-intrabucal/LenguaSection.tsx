import React from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

interface LenguaSectionProps {
  selectedOptions: {[key: string]: string};
  onToggleOption: (option: string, category: string) => void;
  colorOptions: Array<{color: string, label: string}>;
}

const LenguaSection: React.FC<LenguaSectionProps> = ({
  selectedOptions,
  onToggleOption,
  colorOptions
}) => {
  return (
    <div className="space-y-4">
      <h3 className="text-base font-semibold">🦷 6. LENGUA</h3>
      
      {/* 1. Color */}
      <div className="mb-2">
        <h4 className="font-medium mb-1 text-sm">1. Color:</h4>
        <div className="space-y-1">
          {colorOptions.map((option, index) => (
            <div key={index} className="flex items-center space-x-1">
              <div
                style={{
                  width: '12px',
                  height: '12px',
                  borderRadius: '50%',
                  backgroundColor: option.color,
                  border: '1px solid #000'
                }}
              />
              <Button
                variant={selectedOptions['color-lengua'] === option.label ? "default" : "outline"}
                size="xs"
                onClick={() => onToggleOption(option.label, 'color-lengua')}
                className="px-2 py-1 text-xs rounded-lg"
              >
                {option.label}
              </Button>
            </div>
          ))}
        </div>
      </div>

      {/* 2. Tamaño */}
      <div className="mb-2">
        <h4 className="font-medium mb-1 text-sm">2. Tamaño:</h4>
        <div className="flex flex-wrap gap-1">
          {['Normal', 'Macroglosia', 'Microglosia', 'Otro'].map((option) => (
            <div key={option} className="flex flex-col">
              <Button
                variant={selectedOptions['tamaño-lengua'] === option ? "default" : "outline"}
                size="xs"
                onClick={() => onToggleOption(option, 'tamaño-lengua')}
                className="px-2 py-1 text-xs rounded-lg"
              >
                {option}
              </Button>
              {option === 'Otro' && selectedOptions['tamaño-lengua'] === option && (
                <Textarea placeholder="Especifica..." className="mt-1 w-full text-xs h-6" />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* 3. Superficie */}
      <div className="mb-2">
        <h4 className="font-medium mb-1 text-sm">3. Superficie:</h4>
        <div className="flex flex-wrap gap-1">
          {['Normal', 'Saburral', 'Fisurada', 'Geográfica', 'Lisa', 'Vellosa', 'Si localizado', 'Otro'].map((option) => (
            <div key={option} className="flex flex-col">
              <Button
                variant={selectedOptions['superficie-lengua'] === option ? "default" : "outline"}
                size="xs"
                onClick={() => onToggleOption(option, 'superficie-lengua')}
                className="px-2 py-1 text-xs rounded-lg"
              >
                {option}
              </Button>
              {(option === 'Si localizado' || option === 'Otro') && selectedOptions['superficie-lengua'] === option && (
                <Textarea 
                  placeholder={option === 'Si localizado' ? "Especificar ubicación..." : "Especifica..."} 
                  className="mt-1 w-full text-xs h-6" 
                />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* 4. Movilidad */}
      <div className="mb-2">
        <h4 className="font-medium mb-1 text-sm">4. Movilidad:</h4>
        <div className="flex flex-wrap gap-1">
          {['Normal', 'Limitada', 'Anquiloglosia', 'Protrusión excesiva', 'Si localizado', 'Otro'].map((option) => (
            <div key={option} className="flex flex-col">
              <Button
                variant={selectedOptions['movilidad-lengua'] === option ? "default" : "outline"}
                size="xs"
                onClick={() => onToggleOption(option, 'movilidad-lengua')}
                className="px-2 py-1 text-xs rounded-lg"
              >
                {option}
              </Button>
              {(option === 'Si localizado' || option === 'Otro') && selectedOptions['movilidad-lengua'] === option && (
                <Textarea 
                  placeholder={option === 'Si localizado' ? "Especificar ubicación..." : "Especifica..."} 
                  className="mt-1 w-full text-xs h-6" 
                />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* 5. Bordes */}
      <div className="mb-2">
        <h4 className="font-medium mb-1 text-sm">5. Bordes laterales:</h4>
        <div className="flex flex-wrap gap-1">
          {['Normales', 'Mordedura habitual', 'Úlceras', 'Leucoplasia', 'Si localizado', 'Otro'].map((option) => (
            <div key={option} className="flex flex-col">
              <Button
                variant={selectedOptions['bordes-lengua'] === option ? "default" : "outline"}
                size="xs"
                onClick={() => onToggleOption(option, 'bordes-lengua')}
                className="px-2 py-1 text-xs rounded-lg"
              >
                {option}
              </Button>
              {(option === 'Si localizado' || option === 'Otro') && selectedOptions['bordes-lengua'] === option && (
                <Textarea 
                  placeholder={option === 'Si localizado' ? "Especificar ubicación..." : "Especifica..."} 
                  className="mt-1 w-full text-xs h-6" 
                />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LenguaSection;