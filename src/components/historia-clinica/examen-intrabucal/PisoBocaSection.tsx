import React from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

interface PisoBocaSectionProps {
  selectedOptions: {[key: string]: string};
  onToggleOption: (option: string, category: string) => void;
  colorOptions: Array<{color: string, label: string}>;
}

const PisoBocaSection: React.FC<PisoBocaSectionProps> = ({
  selectedOptions,
  onToggleOption,
  colorOptions
}) => {
  return (
    <div className="space-y-4">
      <h3 className="text-base font-semibold">🦷 7. PISO DE BOCA</h3>
      
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
                variant={selectedOptions['color-piso-boca'] === option.label ? "default" : "outline"}
                size="xs"
                onClick={() => onToggleOption(option.label, 'color-piso-boca')}
                className="px-2 py-1 text-xs rounded-lg"
              >
                {option.label}
              </Button>
            </div>
          ))}
        </div>
      </div>

      {/* 2. Textura */}
      <div className="mb-2">
        <h4 className="font-medium mb-1 text-sm">2. Textura:</h4>
        <div className="flex flex-wrap gap-1">
          {['Normal', 'Rugosa', 'Lisa', 'Irregular', 'Otro'].map((option) => (
            <div key={option} className="flex flex-col">
              <Button
                variant={selectedOptions['textura-piso-boca'] === option ? "default" : "outline"}
                size="xs"
                onClick={() => onToggleOption(option, 'textura-piso-boca')}
                className="px-2 py-1 text-xs rounded-lg"
              >
                {option}
              </Button>
              {option === 'Otro' && selectedOptions['textura-piso-boca'] === option && (
                <Textarea placeholder="Especifica..." className="mt-1 w-full text-xs h-6" />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* 3. Frenillo lingual */}
      <div className="mb-2">
        <h4 className="font-medium mb-1 text-sm">3. Frenillo lingual:</h4>
        <div className="flex flex-wrap gap-1">
          {['Normal', 'Corto (anquiloglosia)', 'Hipertrófico', 'Con desgarros', 'Si localizado', 'Otro'].map((option) => (
            <div key={option} className="flex flex-col">
              <Button
                variant={selectedOptions['frenillo-lingual'] === option ? "default" : "outline"}
                size="xs"
                onClick={() => onToggleOption(option, 'frenillo-lingual')}
                className="px-2 py-1 text-xs rounded-lg"
              >
                {option}
              </Button>
              {(option === 'Si localizado' || option === 'Otro') && selectedOptions['frenillo-lingual'] === option && (
                <Textarea 
                  placeholder={option === 'Si localizado' ? "Especificar ubicación..." : "Especifica..."} 
                  className="mt-1 w-full text-xs h-6" 
                />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* 4. Conductos salivales */}
      <div className="mb-2">
        <h4 className="font-medium mb-1 text-sm">4. Conductos salivales (Wharton):</h4>
        <div className="flex flex-wrap gap-1">
          {['Normales', 'Inflamados', 'Obstruidos', 'Con sialolitiasis', 'Si localizado', 'Otro'].map((option) => (
            <div key={option} className="flex flex-col">
              <Button
                variant={selectedOptions['conductos-salivales'] === option ? "default" : "outline"}
                size="xs"
                onClick={() => onToggleOption(option, 'conductos-salivales')}
                className="px-2 py-1 text-xs rounded-lg"
              >
                {option}
              </Button>
              {(option === 'Si localizado' || option === 'Otro') && selectedOptions['conductos-salivales'] === option && (
                <Textarea 
                  placeholder={option === 'Si localizado' ? "Especificar ubicación..." : "Especifica..."} 
                  className="mt-1 w-full text-xs h-6" 
                />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* 5. Presencia de lesiones */}
      <div className="mb-2">
        <h4 className="font-medium mb-1 text-sm">5. Presencia de lesiones:</h4>
        <div className="space-y-1">
          <div className="flex gap-1">
            <Button
              variant={selectedOptions['lesiones-piso-boca'] === "Sí" ? "default" : "outline"}
              size="xs"
              onClick={() => onToggleOption("Sí", 'lesiones-piso-boca')}
              className="px-2 py-1 text-xs rounded-lg"
            >
              Sí
            </Button>
            <Button
              variant={selectedOptions['lesiones-piso-boca'] === "No" ? "default" : "outline"}
              size="xs"
              onClick={() => onToggleOption("No", 'lesiones-piso-boca')}
              className="px-2 py-1 text-xs rounded-lg"
            >
              No
            </Button>
          </div>
          {selectedOptions['lesiones-piso-boca'] === "Sí" && (
            <div className="ml-1 space-y-1">
              <p className="text-xs font-medium">Tipo de lesión:</p>
              <div className="flex flex-wrap gap-1">
                {['Ránula', 'Úlceras', 'Varices linguales', 'Mucocele', 'Si localizado', 'Otro'].map((option) => (
                  <div key={option} className="flex flex-col">
                    <Button
                      variant={selectedOptions['tipo-lesion-piso-boca'] === option ? "default" : "outline"}
                      size="xs"
                      onClick={() => onToggleOption(option, 'tipo-lesion-piso-boca')}
                      className="px-2 py-1 text-xs rounded-lg"
                    >
                      {option}
                    </Button>
                    {(option === 'Si localizado' || option === 'Otro') && selectedOptions['tipo-lesion-piso-boca'] === option && (
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

export default PisoBocaSection;