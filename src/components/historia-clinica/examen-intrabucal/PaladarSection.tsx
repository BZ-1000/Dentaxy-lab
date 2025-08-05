import React from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

interface PaladarSectionProps {
  selectedOptions: {[key: string]: string};
  onToggleOption: (option: string, category: string) => void;
  colorOptions: Array<{color: string, label: string}>;
}

const PaladarSection: React.FC<PaladarSectionProps> = ({
  selectedOptions,
  onToggleOption,
  colorOptions
}) => {
  return (
    <div className="space-y-4">
      <h3 className="text-base font-semibold">🦷 2. PALADAR</h3>
      
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
                variant={selectedOptions['color-paladar'] === option.label ? "default" : "outline"}
                size="xs"
                onClick={() => onToggleOption(option.label, 'color-paladar')}
                className="px-2 py-1 text-xs rounded-lg"
              >
                {option.label}
              </Button>
            </div>
          ))}
        </div>
      </div>

      {/* 2. Forma */}
      <div className="mb-2">
        <h4 className="font-medium mb-1 text-sm">2. Forma:</h4>
        <div className="flex flex-wrap gap-1">
          {['Normal', 'Ojival (alto y estrecho)', 'Plano', 'Asimétrico', 'Otro'].map((option) => (
            <div key={option} className="flex flex-col">
              <Button
                variant={selectedOptions['forma-paladar'] === option ? "default" : "outline"}
                size="xs"
                onClick={() => onToggleOption(option, 'forma-paladar')}
                className="px-2 py-1 text-xs rounded-lg"
              >
                {option}
              </Button>
              {option === 'Otro' && selectedOptions['forma-paladar'] === option && (
                <Textarea placeholder="Especifica..." className="mt-1 w-full text-xs h-6" />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* 3. Lesiones */}
      <div className="mb-2">
        <h4 className="font-medium mb-1 text-sm">3. Presencia de lesiones:</h4>
        <div className="space-y-1">
          <div className="flex gap-1">
            <Button
              variant={selectedOptions['lesiones-paladar'] === "Sí" ? "default" : "outline"}
              size="xs"
              onClick={() => onToggleOption("Sí", 'lesiones-paladar')}
              className="px-2 py-1 text-xs rounded-lg"
            >
              Sí
            </Button>
            <Button
              variant={selectedOptions['lesiones-paladar'] === "No" ? "default" : "outline"}
              size="xs"
              onClick={() => onToggleOption("No", 'lesiones-paladar')}
              className="px-2 py-1 text-xs rounded-lg"
            >
              No
            </Button>
          </div>
          {selectedOptions['lesiones-paladar'] === "Sí" && (
            <div className="ml-1 space-y-1">
              <p className="text-xs font-medium">Tipo de lesión:</p>
              <div className="flex flex-wrap gap-1">
                {['Úlceras', 'Fisuras', 'Torus palatino', 'Petequias', 'Si localizado', 'Otro'].map((option) => (
                  <div key={option} className="flex flex-col">
                    <Button
                      variant={selectedOptions['tipo-lesion-paladar'] === option ? "default" : "outline"}
                      size="xs"
                      onClick={() => onToggleOption(option, 'tipo-lesion-paladar')}
                      className="px-2 py-1 text-xs rounded-lg"
                    >
                      {option}
                    </Button>
                    {(option === 'Si localizado' || option === 'Otro') && selectedOptions['tipo-lesion-paladar'] === option && (
                      <Textarea 
                        placeholder={option === 'Si localizado' ? "Especificar ubicación..." : "Especifica..."} 
                        className="mt-1 w-full text-xs h-6" 
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PaladarSection;