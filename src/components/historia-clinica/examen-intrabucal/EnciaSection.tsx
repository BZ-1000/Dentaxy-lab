import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

interface EnciaSectionProps {
  selectedOptions: {[key: string]: string};
  onToggleOption: (option: string, category: string) => void;
  colorOptions: Array<{color: string, label: string}>;
}

const EnciaSection: React.FC<EnciaSectionProps> = ({
  selectedOptions,
  onToggleOption,
  colorOptions
}) => {
  const [currentSubSection, setCurrentSubSection] = useState(0);
  const sections = ['Encías generalidades', 'Encía libre', 'Encía adherida', 'Encía interproximal'];

  const renderSubSection = () => {
    switch (currentSubSection) {
      case 0: return renderGeneralidades();
      case 1: return renderEnciaLibre();
      case 2: return renderEnciaAdherida();
      case 3: return renderEnciaInterproximal();
      default: return null;
    }
  };

  const renderGeneralidades = () => (
    <div className="space-y-2">
      {/* Información de subtipos de encía */}
      <div className="bg-blue-50 p-2 rounded-lg border border-blue-200 mb-2">
        <h4 className="font-medium text-blue-800 mb-1 text-sm">📚 Subtipos de Encía:</h4>
        <div className="space-y-1 text-xs">
          <div className="flex items-start gap-1">
            <span className="text-blue-600 font-medium">🔹 Encía libre:</span>
            <span className="text-blue-700">rodea el cuello del diente sin estar adherida al hueso alveolar.</span>
          </div>
          <div className="flex items-start gap-1">
            <span className="text-blue-600 font-medium">🔹 Encía adherida:</span>
            <span className="text-blue-700">firmemente unida al hueso subyacente, resistente.</span>
          </div>
          <div className="flex items-start gap-1">
            <span className="text-blue-600 font-medium">🔹 Encía interproximal:</span>
            <span className="text-blue-700">encía papilar entre dos dientes, susceptible a inflamación o pérdida por enfermedad periodontal.</span>
          </div>
        </div>
      </div>
      
      {/* 1. Color observado */}
      <div className="mb-2">
        <h4 className="font-medium mb-1 text-sm">1. Color observado:</h4>
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
                variant={selectedOptions['color-generalidades'] === option.label ? "default" : "outline"}
                size="xs"
                onClick={() => onToggleOption(option.label, 'color-generalidades')}
                className="px-2 py-1 text-xs rounded-lg"
              >
                {option.label}
              </Button>
            </div>
          ))}
          <div className="flex flex-col">
            <Button
              variant={selectedOptions['color-generalidades'] === "Otro color" ? "default" : "outline"}
              size="xs"
              onClick={() => onToggleOption("Otro color", 'color-generalidades')}
              className="px-2 py-1 text-xs rounded-lg"
            >
              Otro (especificar)
            </Button>
            {selectedOptions['color-generalidades'] === "Otro color" && (
              <Textarea placeholder="Especifica el color..." className="mt-1 w-full text-xs h-6" />
            )}
          </div>
        </div>
      </div>

      {/* 2. Textura de la superficie */}
      <div className="mb-2">
        <h4 className="font-medium mb-1 text-sm">2. Textura de la superficie:</h4>
        <div className="flex flex-wrap gap-1">
          {['Lisa', 'Punteada (piel de naranja)', 'Rugosa', 'Granular', 'Ulcerada', 'Fibrosa', 'Otro'].map((option) => (
            <div key={option} className="flex flex-col">
              <Button
                variant={selectedOptions['textura-generalidades'] === option ? "default" : "outline"}
                size="xs"
                onClick={() => onToggleOption(option, 'textura-generalidades')}
                className="px-2 py-1 text-xs rounded-lg"
              >
                {option}
              </Button>
              {option === 'Otro' && selectedOptions['textura-generalidades'] === option && (
                <Textarea placeholder="Especifica..." className="mt-1 w-full text-xs h-6" />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* 3. Contorno o forma observada */}
      <div className="mb-2">
        <h4 className="font-medium mb-1 text-sm">3. Contorno o forma observada:</h4>
        <div className="flex flex-wrap gap-1">
          {['Festoneado (normal)', 'Aumentado de volumen', 'Recesión gingival', 'Engrosamiento marginal', 'Pseudobolsas', 'Otro'].map((option) => (
            <div key={option} className="flex flex-col">
              <Button
                variant={selectedOptions['contorno-generalidades'] === option ? "default" : "outline"}
                size="xs"
                onClick={() => onToggleOption(option, 'contorno-generalidades')}
                className="px-2 py-1 text-xs rounded-lg"
              >
                {option}
              </Button>
              {option === 'Otro' && selectedOptions['contorno-generalidades'] === option && (
                <Textarea placeholder="Especifica..." className="mt-1 w-full text-xs h-6" />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* 4. Consistencia al tacto */}
      <div className="mb-2">
        <h4 className="font-medium mb-1 text-sm">4. Consistencia al tacto:</h4>
        <div className="flex flex-wrap gap-1">
          {['Firme (normal)', 'Blanda', 'Edematosa', 'Hiperplásica', 'Fibrótica', 'Otro'].map((option) => (
            <div key={option} className="flex flex-col">
              <Button
                variant={selectedOptions['consistencia-generalidades'] === option ? "default" : "outline"}
                size="xs"
                onClick={() => onToggleOption(option, 'consistencia-generalidades')}
                className="px-2 py-1 text-xs rounded-lg"
              >
                {option}
              </Button>
              {option === 'Otro' && selectedOptions['consistencia-generalidades'] === option && (
                <Textarea placeholder="Especifica..." className="mt-1 w-full text-xs h-6" />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* 5. Presencia de sangrado */}
      <div className="mb-2">
        <h4 className="font-medium mb-1 text-sm">5. Presencia de sangrado:</h4>
        <div className="space-y-1">
          <div className="flex gap-1">
            <Button
              variant={selectedOptions['sangrado-generalidades'] === "Sí" ? "default" : "outline"}
              size="xs"
              onClick={() => onToggleOption("Sí", 'sangrado-generalidades')}
              className="px-2 py-1 text-xs rounded-lg"
            >
              Sí
            </Button>
            <Button
              variant={selectedOptions['sangrado-generalidades'] === "No" ? "default" : "outline"}
              size="xs"
              onClick={() => onToggleOption("No", 'sangrado-generalidades')}
              className="px-2 py-1 text-xs rounded-lg"
            >
              No
            </Button>
          </div>
          {selectedOptions['sangrado-generalidades'] === "Sí" && (
            <div className="ml-1 space-y-1">
              <p className="text-xs font-medium">Tipo de sangrado:</p>
              <div className="flex gap-1">
                <Button
                  variant={selectedOptions['tipo-sangrado'] === "Generalizada" ? "default" : "outline"}
                  size="xs"
                  onClick={() => onToggleOption("Generalizada", 'tipo-sangrado')}
                  className="px-2 py-1 text-xs rounded-lg"
                >
                  Generalizada
                </Button>
                <Button
                  variant={selectedOptions['tipo-sangrado'] === "Si localizado" ? "default" : "outline"}
                  size="xs"
                  onClick={() => onToggleOption("Si localizado", 'tipo-sangrado')}
                  className="px-2 py-1 text-xs rounded-lg"
                >
                  Si localizado
                </Button>
              </div>
              {selectedOptions['tipo-sangrado'] === "Si localizado" && (
                <Textarea 
                  placeholder="Especificar ubicación (ej: dientes 12-14, zona anterior superior)" 
                  className="mt-1 w-full text-xs h-6" 
                />
              )}
            </div>
          )}
        </div>
      </div>

      {/* 6. Dolor o sensibilidad */}
      <div className="mb-2">
        <h4 className="font-medium mb-1 text-sm">6. Dolor o sensibilidad:</h4>
        <div className="space-y-1">
          <div className="flex gap-1">
            <Button
              variant={selectedOptions['dolor-generalidades'] === "Sí" ? "default" : "outline"}
              size="xs"
              onClick={() => onToggleOption("Sí", 'dolor-generalidades')}
              className="px-2 py-1 text-xs rounded-lg"
            >
              Sí
            </Button>
            <Button
              variant={selectedOptions['dolor-generalidades'] === "No" ? "default" : "outline"}
              size="xs"
              onClick={() => onToggleOption("No", 'dolor-generalidades')}
              className="px-2 py-1 text-xs rounded-lg"
            >
              No
            </Button>
          </div>
          {selectedOptions['dolor-generalidades'] === "Sí" && (
            <div className="ml-1 space-y-1">
              <p className="text-xs font-medium">Tipo de dolor:</p>
              <div className="flex gap-1">
                <Button
                  variant={selectedOptions['tipo-dolor'] === "Generalizada" ? "default" : "outline"}
                  size="xs"
                  onClick={() => onToggleOption("Generalizada", 'tipo-dolor')}
                  className="px-2 py-1 text-xs rounded-lg"
                >
                  Generalizada
                </Button>
                <Button
                  variant={selectedOptions['tipo-dolor'] === "Si localizado" ? "default" : "outline"}
                  size="xs"
                  onClick={() => onToggleOption("Si localizado", 'tipo-dolor')}
                  className="px-2 py-1 text-xs rounded-lg"
                >
                  Si localizado
                </Button>
              </div>
              {selectedOptions['tipo-dolor'] === "Si localizado" && (
                <Textarea 
                  placeholder="Especificar ubicación (ej: dientes 12-14, zona anterior superior)" 
                  className="mt-1 w-full text-xs h-6" 
                />
              )}
            </div>
          )}
        </div>
      </div>

      {/* 7. Presencia de lesiones */}
      <div className="mb-3">
        <h4 className="font-medium mb-2 text-sm">7. Presencia de lesiones:</h4>
        <div className="space-y-1">
          <div className="flex gap-1">
            <Button
              variant={selectedOptions['lesiones-generalidades'] === "Sí" ? "default" : "outline"}
              size="xs"
              onClick={() => onToggleOption("Sí", 'lesiones-generalidades')}
              className="px-2 py-1 text-xs rounded-lg"
            >
              Sí
            </Button>
            <Button
              variant={selectedOptions['lesiones-generalidades'] === "No" ? "default" : "outline"}
              size="xs"
              onClick={() => onToggleOption("No", 'lesiones-generalidades')}
              className="px-2 py-1 text-xs rounded-lg"
            >
              No
            </Button>
          </div>
          {selectedOptions['lesiones-generalidades'] === "Sí" && (
            <div className="ml-1 space-y-1">
              <p className="text-xs font-medium">Tipo de lesión:</p>
              <div className="flex flex-wrap gap-1">
                {['Aftas/úlceras', 'Hiperplasia', 'Recesión', 'Abscesos', 'Si localizado', 'Otro'].map((option) => (
                  <div key={option} className="flex flex-col">
                    <Button
                      variant={selectedOptions['tipo-lesion-generalidades'] === option ? "default" : "outline"}
                      size="xs"
                      onClick={() => onToggleOption(option, 'tipo-lesion-generalidades')}
                      className="px-2 py-1 text-xs rounded-lg"
                    >
                      {option}
                    </Button>
                    {(option === 'Si localizado' || option === 'Otro') && selectedOptions['tipo-lesion-generalidades'] === option && (
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

  const renderEnciaLibre = () => (
    <div className="space-y-2">
      <h4 className="font-medium mb-1 text-sm">Encía Libre - Características específicas:</h4>
      {/* Implementar campos específicos para encía libre */}
    </div>
  );

  const renderEnciaAdherida = () => (
    <div className="space-y-2">
      <h4 className="font-medium mb-1 text-sm">Encía Adherida - Características específicas:</h4>
      {/* Implementar campos específicos para encía adherida */}
    </div>
  );

  const renderEnciaInterproximal = () => (
    <div className="space-y-2">
      <h4 className="font-medium mb-1 text-sm">Encía Interproximal - Características específicas:</h4>
      {/* Implementar campos específicos para encía interproximal */}
    </div>
  );

  return (
    <div className="space-y-4">
      {/* Navegación entre subsecciones */}
      <div className="flex flex-wrap gap-1 mb-4">
        {sections.map((section, index) => (
          <Button
            key={section}
            variant={currentSubSection === index ? "default" : "outline"}
            size="xs"
            onClick={() => setCurrentSubSection(index)}
            className="px-2 py-1 text-xs rounded-lg"
          >
            {section}
          </Button>
        ))}
      </div>

      {renderSubSection()}
    </div>
  );
};

export default EnciaSection;