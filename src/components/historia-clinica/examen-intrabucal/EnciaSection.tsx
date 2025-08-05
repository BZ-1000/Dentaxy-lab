import React, { useState, useRef, useEffect } from 'react';
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
  const formRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (formRef.current) {
      formRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [currentSubSection]);

  const handleNextSection = () => {
    if (currentSubSection < sections.length - 1) {
      setCurrentSubSection(currentSubSection + 1);
    } else {
      // Logic for saving the form goes here
      console.log("Formulario de encías guardado", selectedOptions);
      alert("Formulario de encías guardado exitosamente.");
    }
  };

  const handleToggleOption = (option: string, category: string) => {
    const isSelected = selectedOptions[category] === option;
    onToggleOption(isSelected ? '' : option, category);
  };
  
  const renderOptionButtons = (options: string[], category: string, subCategory?: string) => (
    <div className="flex flex-wrap gap-1">
      {options.map((option) => (
        <div key={option} className="flex flex-col">
          <Button
            variant={selectedOptions[category] === option ? "default" : "outline"}
            size="xs"
            onClick={() => handleToggleOption(option, category)}
            className="px-2 py-1 text-xs rounded-lg"
          >
            {option}
          </Button>
          {(option.includes('Otro') || option.includes('especificar') || option.includes('localizado')) && selectedOptions[category] === option && (
            <Textarea
              placeholder={option.includes('especificar') ? "Especifica..." : "Especificar ubicación..."}
              className="mt-1 w-full text-xs h-6"
            />
          )}
        </div>
      ))}
    </div>
  );

  const renderGeneralidades = () => (
    <div className="space-y-4">
      {/* 1. Color observado */}
      <div>
        <h4 className="font-semibold text-sm">1. Color observado:</h4>
        <div className="space-y-1 mt-2">
          {colorOptions.map((option, index) => (
            <div key={index} className="flex items-center space-x-2">
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
                onClick={() => handleToggleOption(option.label, 'color-generalidades')}
                className="px-2 py-1 text-xs rounded-lg"
              >
                {option.label}
              </Button>
            </div>
          ))}
          <div className="flex flex-col mt-1">
            <Button
              variant={selectedOptions['color-generalidades'] === "Otro color (especificar)" ? "default" : "outline"}
              size="xs"
              onClick={() => handleToggleOption("Otro color (especificar)", 'color-generalidades')}
              className="px-2 py-1 text-xs rounded-lg"
            >
              Otro color (especificar)
            </Button>
            {selectedOptions['color-generalidades'] === "Otro color (especificar)" && (
              <Textarea placeholder="Especifica el color..." className="mt-1 w-full text-xs h-6" />
            )}
          </div>
        </div>
      </div>

      {/* 2. Textura de la superficie */}
      <div>
        <h4 className="font-semibold text-sm">2. Textura de la superficie:</h4>
        {renderOptionButtons(['Lisa', 'Punteada (piel de naranja)', 'Rugosa', 'Granular', 'Ulcerada', 'Fibrosa', 'Otro'], 'textura-generalidades')}
      </div>

      {/* 3. Contorno o forma observada */}
      <div>
        <h4 className="font-semibold text-sm">3. Contorno o forma observada:</h4>
        {renderOptionButtons(['Festoneado (normal)', 'Aumentado de volumen', 'Recesión gingival', 'Engrosamiento marginal', 'Pseudobolsas', 'Otro'], 'contorno-generalidades')}
      </div>

      {/* 4. Consistencia al tacto */}
      <div>
        <h4 className="font-semibold text-sm">4. Consistencia al tacto:</h4>
        {renderOptionButtons(['Firme (normal)', 'Blanda', 'Edematosa', 'Hiperplásica', 'Fibrótica', 'Otro'], 'consistencia-generalidades')}
      </div>

      {/* 5. Presencia de sangrado */}
      <div>
        <h4 className="font-semibold text-sm">5. Presencia de sangrado:</h4>
        {renderOptionButtons(['Sí', 'No'], 'sangrado-generalidades')}
      </div>
      
      {/* 6. Dolor o sensibilidad */}
      <div>
        <h4 className="font-semibold text-sm">6. Dolor o sensibilidad:</h4>
        {renderOptionButtons(['Sí', 'No'], 'dolor-generalidades')}
      </div>
      
      {/* 7. Presencia de lesiones */}
      <div>
        <h4 className="font-semibold text-sm">7. Presencia de lesiones:</h4>
        {renderOptionButtons(['Aftas/úlceras', 'Gingivitis ulceronecrotizante', 'Hiperplasia gingival', 'Quistes gingivales', 'Épulis/granuloma piógeno', 'Leucoplasia', 'Otras lesiones'], 'lesiones-generalidades')}
      </div>

      {/* 8. Condición visual alrededor de restauraciones */}
      <div>
        <h4 className="font-semibold text-sm">8. Condición visual alrededor de restauraciones:</h4>
        {renderOptionButtons(['Normal', 'Inflamación marginal', 'Recesión gingival', 'Sangrado al sondeo', 'Hiperplasia'], 'restauraciones-generalidades')}
      </div>

      {/* 9. Otros hallazgos clínicos */}
      <div>
        <h4 className="font-semibold text-sm">9. Otros hallazgos clínicos:</h4>
        <Textarea placeholder="Describe cualquier otro hallazgo relevante..." className="mt-1 w-full text-xs" />
      </div>
    </div>
  );

  const renderEnciaLibre = () => (
    <div className="space-y-4">
      {/* 1. ¿Se observa sangrado espontáneo al cepillado o masticación? */}
      <div>
        <h4 className="font-semibold text-sm">1. ¿Se observa sangrado espontáneo al cepillado o masticación?</h4>
        {renderOptionButtons(['Sí', 'No', 'Solo al cepillado', 'Solo al masticar'], 'sangrado-libre')}
      </div>
      {/* 2. ¿Hay inflamación del margen gingival? */}
      <div>
        <h4 className="font-semibold text-sm">2. ¿Hay inflamación del margen gingival?</h4>
        {renderOptionButtons(['Leve', 'Moderada', 'Severa', 'Ausente'], 'inflamacion-libre')}
      </div>
      {/* 3. ¿Se observa edema o engrosamiento? */}
      <div>
        <h4 className="font-semibold text-sm">3. ¿Se observa edema o engrosamiento?</h4>
        {renderOptionButtons(['Presente generalizado', 'Presente localizado', 'Ausente'], 'edema-libre')}
      </div>
      {/* 4. ¿Hay presencia de placa dental en el margen gingival? */}
      <div>
        <h4 className="font-semibold text-sm">4. ¿Hay presencia de placa dental en el margen gingival?</h4>
        {renderOptionButtons(['Abundante', 'Moderada', 'Escasa', 'Ausente'], 'placa-libre')}
      </div>
      {/* 5. ¿Se observa retracción o recesión del margen gingival? */}
      <div>
        <h4 className="font-semibold text-sm">5. ¿Se observa retracción o recesión del margen gingival?</h4>
        {renderOptionButtons(['Sí, generalizada', 'Sí, localizada', 'No'], 'recesion-libre')}
      </div>
    </div>
  );

  const renderEnciaAdherida = () => (
    <div className="space-y-4">
      {/* 1. ¿Cuál es el ancho de la banda de encía adherida? */}
      <div>
        <h4 className="font-semibold text-sm">1. ¿Cuál es el ancho de la banda de encía adherida?</h4>
        {renderOptionButtons(['Adecuado (>2mm)', 'Reducido (1-2mm)', 'Muy reducido (<1mm)', 'Ausente'], 'ancho-adherida')}
      </div>
      {/* 2. ¿Se observa punteado en cáscara de naranja? */}
      <div>
        <h4 className="font-semibold text-sm">2. ¿Se observa punteado en cáscara de naranja?</h4>
        {renderOptionButtons(['Presente y normal', 'Ausente', 'Alterado'], 'punteado-adherida')}
      </div>
      {/* 3. ¿Hay firme adherencia al hueso subyacente? */}
      <div>
        <h4 className="font-semibold text-sm">3. ¿Hay firme adherencia al hueso subyacente?</h4>
        {renderOptionButtons(['Sí, firme', 'Parcialmente adherida', 'Poco adherida'], 'adherencia-adherida')}
      </div>
      {/* 4. ¿Se observa la línea mucogingival claramente definida? */}
      <div>
        <h4 className="font-semibold text-sm">4. ¿Se observa la línea mucogingival claramente definida?</h4>
        {renderOptionButtons(['Sí, bien definida', 'Parcialmente definida', 'No definida'], 'linea-adherida')}
      </div>
      {/* 5. ¿Hay presencia de frenillos que comprometan la encía adherida? */}
      <div>
        <h4 className="font-semibold text-sm">5. ¿Hay presencia de frenillos que comprometan la encía adherida?</h4>
        {renderOptionButtons(['Sí, compromete', 'Presente pero no compromete', 'Ausente'], 'frenillos-adherida')}
      </div>
    </div>
  );

  const renderEnciaInterproximal = () => (
    <div className="space-y-4">
      {/* 1. ¿Las papilas gingivales llenan completamente los espacios interproximales? */}
      <div>
        <h4 className="font-semibold text-sm">1. ¿Las papilas gingivales llenan completamente los espacios interproximales?</h4>
        {renderOptionButtons(['Sí, completamente', 'Parcialmente', 'No, hay espacios vacíos'], 'papilas-interproximal')}
      </div>
      {/* 2. ¿Hay sangrado al sondeo en áreas interproximales? */}
      <div>
        <h4 className="font-semibold text-sm">2. ¿Hay sangrado al sondeo en áreas interproximales?</h4>
        {renderOptionButtons(['Sí, generalizado', 'Sí, localizado', 'No'], 'sangrado-interproximal')}
      </div>
      {/* 3. ¿Se observa acumulación de placa en espacios interproximales? */}
      <div>
        <h4 className="font-semibold text-sm">3. ¿Se observa acumulación de placa en espacios interproximales?</h4>
        {renderOptionButtons(['Abundante', 'Moderada', 'Escasa', 'Ausente'], 'placa-interproximal')}
      </div>
      {/* 4. ¿Hay presencia de cálculo dental interproximal? */}
      <div>
        <h4 className="font-semibold text-sm">4. ¿Hay presencia de cálculo dental interproximal?</h4>
        {renderOptionButtons(['Abundante', 'Moderado', 'Escaso', 'Ausente'], 'calculo-interproximal')}
      </div>
      {/* 5. ¿Se observa pérdida de inserción en áreas interproximales? */}
      <div>
        <h4 className="font-semibold text-sm">5. ¿Se observa pérdida de inserción en áreas interproximales?</h4>
        {renderOptionButtons(['Sí, severa', 'Sí, moderada', 'Sí, leve', 'No'], 'insercion-interproximal')}
      </div>
    </div>
  );

  const renderSubSection = () => {
    switch (currentSubSection) {
      case 0: return renderGeneralidades();
      case 1: return renderEnciaLibre();
      case 2: return renderEnciaAdherida();
      case 3: return renderEnciaInterproximal();
      default: return null;
    }
  };

  return (
    <div className="space-y-4" ref={formRef}>
      <h2 className="text-xl font-bold">{sections[currentSubSection]}</h2>
      <div className="border-b-2 border-gray-200 mb-4 pb-4">
        {renderSubSection()}
      </div>
      <div className="flex justify-end">
        <Button
          onClick={handleNextSection}
          className="w-full sm:w-auto"
        >
          {currentSubSection < sections.length - 1 ? 'Siguiente' : 'Guardar'}
        </Button>
      </div>
    </div>
  );
};

export default EnciaSection;