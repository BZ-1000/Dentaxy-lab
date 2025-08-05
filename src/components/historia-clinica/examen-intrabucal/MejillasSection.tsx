import React from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

interface MejillasSectionProps {
  selectedOptions: {[key: string]: string};
  onToggleOption: (option: string, category: string) => void;
  colorOptions: Array<{color: string, label: string}>;
}

const MejillasSection: React.FC<MejillasSectionProps> = ({
  selectedOptions,
  onToggleOption,
  colorOptions
}) => {
  return (
    <div className="space-y-4">
      <h3 className="text-base font-semibold">🦷 4. MEJILLAS</h3>
      
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
                variant={selectedOptions['color-mejillas'] === option.label ? "default" : "outline"}
                size="xs"
                onClick={() => onToggleOption(option.label, 'color-mejillas')}
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
          {['Normal', 'Rugosa', 'Lisa', 'Irregular', 'Queratósica', 'Otro'].map((option) => (
            <div key={option} className="flex flex-col">
              <Button
                variant={selectedOptions['textura-mejillas'] === option ? "default" : "outline"}
                size="xs"
                onClick={() => onToggleOption(option, 'textura-mejillas')}
                className="px-2 py-1 text-xs rounded-lg"
              >
                {option}
              </Button>
              {option === 'Otro' && selectedOptions['textura-mejillas'] === option && (
                <Textarea placeholder="Especifica..." className="mt-1 w-full text-xs h-6" />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* 3. Línea alba */}
      <div className="mb-2">
        <h4 className="font-medium mb-1 text-sm">3. Línea alba:</h4>
        <div className="flex flex-wrap gap-1">
          {['Ausente', 'Presente leve', 'Presente moderada', 'Presente severa', 'Si localizado', 'Otro'].map((option) => (
            <div key={option} className="flex flex-col">
              <Button
                variant={selectedOptions['linea-alba'] === option ? "default" : "outline"}
                size="xs"
                onClick={() => onToggleOption(option, 'linea-alba')}
                className="px-2 py-1 text-xs rounded-lg"
              >
                {option}
              </Button>
              {(option === 'Si localizado' || option === 'Otro') && selectedOptions['linea-alba'] === option && (
                <Textarea 
                  placeholder={option === 'Si localizado' ? "Especificar ubicación..." : "Especifica..."} 
                  className="mt-1 w-full text-xs h-6" 
                />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* 4. Conducto de Stenon */}
      <div className="mb-2">
        <h4 className="font-medium mb-1 text-sm">4. Conducto de Stenon (parótida):</h4>
        <div className="flex flex-wrap gap-1">
          {['Normal', 'Inflamado', 'Obstruido', 'Con sialolitiasis', 'Si localizado', 'Otro'].map((option) => (
            <div key={option} className="flex flex-col">
              <Button
                variant={selectedOptions['conducto-stenon'] === option ? "default" : "outline"}
                size="xs"
                onClick={() => onToggleOption(option, 'conducto-stenon')}
                className="px-2 py-1 text-xs rounded-lg"
              >
                {option}
              </Button>
              {(option === 'Si localizado' || option === 'Otro') && selectedOptions['conducto-stenon'] === option && (
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
              variant={selectedOptions['lesiones-mejillas'] === "Sí" ? "default" : "outline"}
              size="xs"
              onClick={() => onToggleOption("Sí", 'lesiones-mejillas')}
              className="px-2 py-1 text-xs rounded-lg"
            >
              Sí
            </Button>
            <Button
              variant={selectedOptions['lesiones-mejillas'] === "No" ? "default" : "outline"}
              size="xs"
              onClick={() => onToggleOption("No", 'lesiones-mejillas')}
              className="px-2 py-1 text-xs rounded-lg"
            >
              No
            </Button>
          </div>
          {selectedOptions['lesiones-mejillas'] === "Sí" && (
            <div className="ml-1 space-y-1">
              <p className="text-xs font-medium">Tipo de lesión:</p>
              <div className="flex flex-wrap gap-1">
                {['Úlceras por mordedura', 'Leucoplasia', 'Mucocele', 'Fibromas', 'Si localizado', 'Otro'].map((option) => (
                  <div key={option} className="flex flex-col">
                    <Button
                      variant={selectedOptions['tipo-lesion-mejillas'] === option ? "default" : "outline"}
                      size="xs"
                      onClick={() => onToggleOption(option, 'tipo-lesion-mejillas')}
                      className="px-2 py-1 text-xs rounded-lg"
                    >
                      {option}
                    </Button>
                    {(option === 'Si localizado' || option === 'Otro') && selectedOptions['tipo-lesion-mejillas'] === option && (
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

export default MejillasSection;