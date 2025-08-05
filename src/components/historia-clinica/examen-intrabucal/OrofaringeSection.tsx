import React from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

interface OrofaringeSectionProps {
  selectedOptions: {[key: string]: string};
  onToggleOption: (option: string, category: string) => void;
  colorOptions: Array<{color: string, label: string}>;
}

const OrofaringeSection: React.FC<OrofaringeSectionProps> = ({
  selectedOptions,
  onToggleOption,
  colorOptions
}) => {
  return (
    <div className="space-y-4">
      <h3 className="text-base font-semibold">🦷 3. OROFARINGE / ISTMO DE LAS FAUCES</h3>
      
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
                variant={selectedOptions['color-orofaringe'] === option.label ? "default" : "outline"}
                size="xs"
                onClick={() => onToggleOption(option.label, 'color-orofaringe')}
                className="px-2 py-1 text-xs rounded-lg"
              >
                {option.label}
              </Button>
            </div>
          ))}
        </div>
      </div>

      {/* 2. Amígdalas */}
      <div className="mb-2">
        <h4 className="font-medium mb-1 text-sm">2. Estado de las amígdalas:</h4>
        <div className="flex flex-wrap gap-1">
          {['Normales', 'Inflamadas', 'Hipertróficas', 'Con exudado', 'Ausentes', 'Si localizado', 'Otro'].map((option) => (
            <div key={option} className="flex flex-col">
              <Button
                variant={selectedOptions['amigdalas'] === option ? "default" : "outline"}
                size="xs"
                onClick={() => onToggleOption(option, 'amigdalas')}
                className="px-2 py-1 text-xs rounded-lg"
              >
                {option}
              </Button>
              {(option === 'Si localizado' || option === 'Otro') && selectedOptions['amigdalas'] === option && (
                <Textarea 
                  placeholder={option === 'Si localizado' ? "Especificar ubicación..." : "Especifica..."} 
                  className="mt-1 w-full text-xs h-6" 
                />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* 3. Pilares */}
      <div className="mb-2">
        <h4 className="font-medium mb-1 text-sm">3. Pilares palatinos:</h4>
        <div className="flex flex-wrap gap-1">
          {['Normales', 'Inflamados', 'Asimétricos', 'Con lesiones', 'Si localizado', 'Otro'].map((option) => (
            <div key={option} className="flex flex-col">
              <Button
                variant={selectedOptions['pilares'] === option ? "default" : "outline"}
                size="xs"
                onClick={() => onToggleOption(option, 'pilares')}
                className="px-2 py-1 text-xs rounded-lg"
              >
                {option}
              </Button>
              {(option === 'Si localizado' || option === 'Otro') && selectedOptions['pilares'] === option && (
                <Textarea 
                  placeholder={option === 'Si localizado' ? "Especificar ubicación..." : "Especifica..."} 
                  className="mt-1 w-full text-xs h-6" 
                />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* 4. Úvula */}
      <div className="mb-2">
        <h4 className="font-medium mb-1 text-sm">4. Úvula:</h4>
        <div className="flex flex-wrap gap-1">
          {['Normal', 'Elongada', 'Bífida', 'Inflamada', 'Ausente', 'Si localizado', 'Otro'].map((option) => (
            <div key={option} className="flex flex-col">
              <Button
                variant={selectedOptions['uvula'] === option ? "default" : "outline"}
                size="xs"
                onClick={() => onToggleOption(option, 'uvula')}
                className="px-2 py-1 text-xs rounded-lg"
              >
                {option}
              </Button>
              {(option === 'Si localizado' || option === 'Otro') && selectedOptions['uvula'] === option && (
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

export default OrofaringeSection;