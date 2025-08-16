import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { AlertCircle, Eye, EyeOff, X } from "lucide-react";

// --- Diccionario de Lesiones (Datos) ---
const lesionDescriptions = {
  'Aftas/úlceras': 'Se observan como lesiones redondas u ovaladas, de tamaño variable, con un centro blanquecino o amarillento y un borde o halo rojo bien definido. Son dolorosas al tacto y pueden aparecer en la encía no adherida (mucosa).',
  'Gingivitis ulceronecrotizante': 'Presenta un aspecto de "encía en sacabocados", con necrosis y ulceración de las papilas interdentales. Se cubre con una pseudomembrana grisácea o amarillenta que al retirarse deja una superficie sangrante y muy dolorosa. Se acompaña de un fuerte mal aliento (halitosis).',
  'Hiperplasia gingival': 'Es un agrandamiento o sobrecrecimiento del tejido gingival. La encía se ve más abultada de lo normal, pudiendo cubrir parcial o totalmente las coronas de los dientes. Puede ser de consistencia firme y color pálido (fibrótica) o blanda, roja y con tendencia al sangrado (inflamatoria).',
  'Quistes gingivales': 'Aparecen como pequeñas protuberancias o vesículas en la encía, generalmente en la zona de la encía adherida. Suelen ser del mismo color de la encía o ligeramente azulados, de consistencia blanda y generalmente no son dolorosos.',
  'Épulis/granuloma piógeno': 'Se manifiesta como una masa de tejido de color rojo intenso o violáceo, de superficie lisa o lobulada que sangra con extrema facilidad al mínimo contacto. Suele tener una base de implantación (pediculada o sésil) y crece rápidamente.',
  'Leucoplasia': 'Es una placa o mancha blanca que no se desprende al rasparla. Puede tener una superficie lisa, arrugada o fisurada. Se adhiere firmemente a la encía y es fundamental diferenciarla de otras lesiones blancas que sí se desprenden.',
};

// --- Componente Pop-up para el Diccionario ---
const LesionPopup = ({ lesion, onClose }) => (
  <div 
    className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4"
    onClick={onClose}
  >
    <div 
      className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl max-w-md w-full relative transform transition-all"
      onClick={(e) => e.stopPropagation()}
    >
      <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">{lesion.title}</h3>
      <p className="text-sm text-gray-600 dark:text-gray-300">{lesion.description}</p>
      <button 
        onClick={onClose}
        className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
      >
        <X size={20} />
      </button>
    </div>
  </div>
);

// --- NUEVO COMPONENTE: Odontograma Gingival ---
const GingivalOdontogram = ({ category, selectedTeeth, onSelectionChange }) => {
    const handleToothClick = (toothNumber) => {
        const newSelection = selectedTeeth.includes(toothNumber)
            ? selectedTeeth.filter(t => t !== toothNumber)
            : [...selectedTeeth, toothNumber];
        onSelectionChange(category, newSelection.sort((a, b) => a - b));
    };

    const renderQuadrant = (numbers) => numbers.map(tooth => (
        <Button
            key={tooth}
            variant={selectedTeeth.includes(tooth) ? 'default' : 'outline'}
            size="xs"
            className="h-6 w-6 p-0 text-xs rounded-md"
            onClick={() => handleToothClick(tooth)}
        >
            {tooth}
        </Button>
    ));

    return (
        <div className="p-2 border rounded-lg bg-gray-50 dark:bg-gray-900/50 w-full max-w-sm mx-auto">
            <div className="flex justify-between mb-1 text-center font-mono">
                {/* Maxilar */}
                <div className="flex gap-0.5">{renderQuadrant([16, 15, 14, 13, 12, 11, 10, 9])}</div>
                <div className="flex gap-0.5">{renderQuadrant([8, 7, 6, 5, 4, 3, 2, 1])}</div>
            </div>
            <div className="flex justify-between mt-1 text-center font-mono">
                {/* Mandíbula */}
                <div className="flex gap-0.5">{renderQuadrant([17, 18, 19, 20, 21, 22, 23, 24])}</div>
                <div className="flex gap-0.5">{renderQuadrant([32, 31, 30, 29, 28, 27, 26, 25])}</div>
            </div>
        </div>
    );
};


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
  const [enciasNormales, setEnciasNormales] = useState(false);
  const [activeLesion, setActiveLesion] = useState(null);
  // --- NUEVO ESTADO para el odontograma ---
  const [localizedTeeth, setLocalizedTeeth] = useState<{ [key: string]: number[] }>({});


  const handleEnciasNormalesChange = () => {
    setEnciasNormales(prevState => !prevState);
  };

  // --- NUEVA FUNCIÓN para manejar la selección de dientes ---
  const handleTeethSelectionChange = (category: string, teeth: number[]) => {
      setLocalizedTeeth(prev => ({ ...prev, [category]: teeth }));
  };

  const handleToggleOption = (option: string, category: string) => {
    const isSelected = selectedOptions[category] === option;
    onToggleOption(isSelected ? '' : option, category);
     // Limpiar selección de dientes si se deselecciona la opción que activa el odontograma
    if (isSelected) {
      handleTeethSelectionChange(category, []);
    }
  };
  
  const renderOptionButtons = (options: string[], category: string) => (
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
          {(option.toLowerCase().includes('otro') || option.toLowerCase().includes('patológica (especificar)')) && selectedOptions[category] === option && (
            <Textarea
              placeholder="Especifica..."
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
          {renderOptionButtons(['Otro color (especificar)'], 'color-generalidades')}
        </div>
      </div>

      {/* 2 a 4. Sin cambios */}
      <div>
        <h4 className="font-semibold text-sm">2. Textura de la superficie:</h4>
        {renderOptionButtons(['Lisa', 'Punteada (piel de naranja)', 'Rugosa', 'Granular', 'Ulcerada', 'Fibrosa', 'Otro'], 'textura-generalidades')}
      </div>
      <div>
        <h4 className="font-semibold text-sm">3. Contorno o forma observada:</h4>
        {renderOptionButtons(['Festoneado (normal)', 'Aumentado de volumen', 'Recesión gingival', 'Engrosamiento marginal', 'Pseudobolsas', 'Otro'], 'contorno-generalidades')}
      </div>
      <div>
        <h4 className="font-semibold text-sm">4. Consistencia al tacto:</h4>
        {renderOptionButtons(['Firme (normal)', 'Blanda', 'Edematosa', 'Hiperplásica', 'Fibrótica', 'Otro'], 'consistencia-generalidades')}
      </div>

      {/* 5. Distribución de los hallazgos con Odontograma */}
      <div>
        <h4 className="font-semibold text-sm">5. Distribución de los hallazgos:</h4>
        <div className="flex flex-wrap gap-1">
            {['Generalizada', 'Localizada'].map(option => (
                <Button key={option} variant={selectedOptions['distribucion-generalidades'] === option ? 'default' : 'outline'} size="xs" onClick={() => handleToggleOption(option, 'distribucion-generalidades')} className="px-2 py-1 text-xs rounded-lg">
                    {option}
                </Button>
            ))}
        </div>
        {selectedOptions['distribucion-generalidades'] === 'Localizada' && (
            <div className="mt-2">
                <h5 className="text-xs font-semibold mb-1 text-gray-600 dark:text-gray-400">Seleccionar dientes afectados:</h5>
                <GingivalOdontogram category="distribucion-generalidades" selectedTeeth={localizedTeeth['distribucion-generalidades'] || []} onSelectionChange={handleTeethSelectionChange} />
            </div>
        )}
      </div>
      
      {/* 6. Humedad */}
      <div>
          <h4 className="font-semibold text-sm">6. Humedad:</h4>
          {renderOptionButtons(['Normal/bien humectada', 'Disminuida', 'Seca/Xerostómica'], 'humedad-generalidades')}
      </div>

      {/* 7. Presencia de Exudado con Odontograma */}
      <div>
          <h4 className="font-semibold text-sm">7. Presencia de Exudado:</h4>
          {renderOptionButtons(['Ausente', 'Purulento', 'Seroso', 'Otro'], 'exudado-generalidades')}
          {(selectedOptions['exudado-generalidades'] === 'Purulento' || selectedOptions['exudado-generalidades'] === 'Seroso') && (
              <div className="mt-2">
                  <h5 className="text-xs font-semibold mb-1 text-gray-600 dark:text-gray-400">Localización del exudado:</h5>
                  <GingivalOdontogram category="exudado-generalidades" selectedTeeth={localizedTeeth['exudado-generalidades'] || []} onSelectionChange={handleTeethSelectionChange} />
              </div>
          )}
      </div>

      {/* 8. Sangrado al Sondaje (BOP) con Odontograma */}
      <div>
          <h4 className="font-semibold text-sm">8. Sangrado al Sondaje (BOP):</h4>
          <div className="flex flex-wrap gap-1">
              {['Positivo Generalizado', 'Positivo Localizado', 'Negativo'].map(option => (
                  <Button key={option} variant={selectedOptions['sondaje-generalidades'] === option ? 'default' : 'outline'} size="xs" onClick={() => handleToggleOption(option, 'sondaje-generalidades')} className="px-2 py-1 text-xs rounded-lg">
                      {option}
                  </Button>
              ))}
          </div>
          {selectedOptions['sondaje-generalidades'] === 'Positivo Localizado' && (
              <div className="mt-2">
                  <h5 className="text-xs font-semibold mb-1 text-gray-600 dark:text-gray-400">Seleccionar dientes con sangrado al sondaje:</h5>
                  <GingivalOdontogram category="sondaje-generalidades" selectedTeeth={localizedTeeth['sondaje-generalidades'] || []} onSelectionChange={handleTeethSelectionChange} />
              </div>
          )}
      </div>
      
      {/* 9 a 14. Sin cambios */}
      <div>
        <h4 className="font-semibold text-sm">9. Pigmentación Adicional:</h4>
        {renderOptionButtons(['Ausente', 'Fisiológica (melánica)', 'Patológica (especificar)'], 'pigmentacion-generalidades')}
      </div>
      <div>
        <h4 className="font-semibold text-sm">10. ¿Se observa sangrado espontáneo, al cepillado o masticación?</h4>
        {renderOptionButtons(['Sí, espontáneo', 'Sí, al cepillado', 'Sí, al masticar', 'No'], 'sangrado-generalidades')}
      </div>
      <div>
        <h4 className="font-semibold text-sm">11. Dolor o sensibilidad:</h4>
        {renderOptionButtons(['Sí', 'No'], 'dolor-generalidades')}
      </div>
      <div>
        <h4 className="font-semibold text-sm">12. Presencia de lesiones:</h4>
        <div className="flex flex-wrap gap-1">
          {Object.keys(lesionDescriptions).map((lesionName) => (
             <Button
                key={lesionName}
                variant={selectedOptions['lesiones-generalidades'] === lesionName ? "default" : "outline"}
                size="xs"
                onClick={() => {
                  handleToggleOption(lesionName, 'lesiones-generalidades');
                  setActiveLesion({ title: lesionName, description: lesionDescriptions[lesionName] });
                }}
                className="px-2 py-1 text-xs rounded-lg"
              >
                {lesionName}
              </Button>
          ))}
          {renderOptionButtons(['Otras lesiones (especificar)'], 'lesiones-generalidades')}
        </div>
      </div>
      <div>
        <h4 className="font-semibold text-sm">13. Condición visual alrededor de restauraciones:</h4>
        {renderOptionButtons(['Normal', 'Inflamación marginal', 'Recesión gingival', 'Sangrado al sondeo', 'Hiperplasia'], 'restauraciones-generalidades')}
      </div>
      <div>
        <h4 className="font-semibold text-sm">14. Otros hallazgos clínicos:</h4>
        <Textarea placeholder="Describe cualquier otro hallazgo relevante..." className="mt-1 w-full text-xs" />
      </div>
    </div>
  );

  const renderEnciaLibre = () => (
    <div className="space-y-4">
      <div>
        <h4 className="font-semibold text-sm">1. ¿Hay inflamación del margen gingival?</h4>
        {renderOptionButtons(['Leve', 'Moderada', 'Severa', 'Ausente'], 'inflamacion-libre')}
      </div>
      
      {/* 2. Edema con Odontograma */}
      <div>
          <h4 className="font-semibold text-sm">2. ¿Se observa edema o engrosamiento?</h4>
          <div className="flex flex-wrap gap-1">
              {['Presente generalizado', 'Presente localizado', 'Ausente'].map(option => (
                  <Button key={option} variant={selectedOptions['edema-libre'] === option ? 'default' : 'outline'} size="xs" onClick={() => handleToggleOption(option, 'edema-libre')} className="px-2 py-1 text-xs rounded-lg">
                      {option}
                  </Button>
              ))}
          </div>
          {selectedOptions['edema-libre'] === 'Presente localizado' && (
              <div className="mt-2">
                  <h5 className="text-xs font-semibold mb-1 text-gray-600 dark:text-gray-400">Localización del edema:</h5>
                  <GingivalOdontogram category="edema-libre" selectedTeeth={localizedTeeth['edema-libre'] || []} onSelectionChange={handleTeethSelectionChange} />
              </div>
          )}
      </div>

      <div>
          <h4 className="font-semibold text-sm">3. ¿Hay presencia de placa dental en el margen gingival?</h4>
          {renderOptionButtons(['Abundante', 'Moderada', 'Escasa', 'Ausente'], 'placa-libre')}
      </div>
      
      {/* 4. Recesión con Odontograma */}
      <div>
          <h4 className="font-semibold text-sm">4. ¿Se observa retracción o recesión del margen gingival?</h4>
          <div className="flex flex-wrap gap-1">
              {['Sí, generalizada', 'Sí, localizada', 'No'].map(option => (
                  <Button key={option} variant={selectedOptions['recesion-libre'] === option ? 'default' : 'outline'} size="xs" onClick={() => handleToggleOption(option, 'recesion-libre')} className="px-2 py-1 text-xs rounded-lg">
                      {option}
                  </Button>
              ))}
          </div>
          {selectedOptions['recesion-libre'] === 'Sí, localizada' && (
              <div className="mt-2">
                  <h5 className="text-xs font-semibold mb-1 text-gray-600 dark:text-gray-400">Localización de la recesión:</h5>
                  <GingivalOdontogram category="recesion-libre" selectedTeeth={localizedTeeth['recesion-libre'] || []} onSelectionChange={handleTeethSelectionChange} />
              </div>
          )}
      </div>

      <div>
          <h4 className="font-semibold text-sm">5. Otros hallazgos clínicos:</h4>
          <Textarea placeholder="Describe cualquier otro hallazgo relevante..." className="mt-1 w-full text-xs" />
      </div>
    </div>
  );

  const renderEnciaAdherida = () => (
    <div className="space-y-4">
      <div>
        <h4 className="font-semibold text-sm">1. ¿Cuál es el ancho de la banda de encía adherida?</h4>
        {renderOptionButtons(['Adecuado (>2mm)', 'Reducido (1-2mm)', 'Muy reducido (<1mm)', 'Ausente'], 'ancho-adherida')}
      </div>
      <div>
        <h4 className="font-semibold text-sm">2. ¿Se observa punteado en cáscara de naranja?</h4>
        {renderOptionButtons(['Presente y normal', 'Ausente', 'Alterado'], 'punteado-adherida')}
      </div>
      <div>
        <h4 className="font-semibold text-sm">3. ¿Hay firme adherencia al hueso subyacente?</h4>
        {renderOptionButtons(['Sí, firme', 'Parcialmente adherida', 'Poco adherida'], 'adherencia-adherida')}
      </div>
      <div>
        <h4 className="font-semibold text-sm">4. ¿Se observa la línea mucogingival claramente definida?</h4>
        {renderOptionButtons(['Sí, bien definida', 'Parcialmente definida', 'No definida'], 'linea-adherida')}
      </div>
      <div>
        <h4 className="font-semibold text-sm">5. ¿Hay presencia de frenillos que comprometan la encía adherida?</h4>
        {renderOptionButtons(['Sí, compromete', 'Presente pero no compromete', 'Ausente'], 'frenillos-adherida')}
      </div>
      <div>
        <h4 className="font-semibold text-sm">6. Otros hallazgos clínicos:</h4>
        <Textarea placeholder="Describe cualquier otro hallazgo relevante..." className="mt-1 w-full text-xs" />
      </div>
    </div>
  );

  const renderEnciaInterproximal = () => (
    <div className="space-y-4">
      <div>
          <h4 className="font-semibold text-sm">1. ¿Las papilas gingivales llenan completamente los espacios interproximales?</h4>
          {renderOptionButtons(['Sí, completamente', 'Parcialmente', 'No, hay espacios vacíos'], 'papilas-interproximal')}
      </div>
      
      {/* 2. Sangrado Interproximal con Odontograma */}
      <div>
          <h4 className="font-semibold text-sm">2. ¿Hay sangrado al sondeo en áreas interproximales?</h4>
          <div className="flex flex-wrap gap-1">
              {['Sí, generalizado', 'Sí, localizado', 'No'].map(option => (
                  <Button key={option} variant={selectedOptions['sangrado-interproximal'] === option ? 'default' : 'outline'} size="xs" onClick={() => handleToggleOption(option, 'sangrado-interproximal')} className="px-2 py-1 text-xs rounded-lg">
                      {option}
                  </Button>
              ))}
          </div>
          {selectedOptions['sangrado-interproximal'] === 'Sí, localizado' && (
              <div className="mt-2">
                  <h5 className="text-xs font-semibold mb-1 text-gray-600 dark:text-gray-400">Localización del sangrado interproximal:</h5>
                  <GingivalOdontogram category="sangrado-interproximal" selectedTeeth={localizedTeeth['sangrado-interproximal'] || []} onSelectionChange={handleTeethSelectionChange} />
              </div>
          )}
      </div>

      <div>
          <h4 className="font-semibold text-sm">3. ¿Se observa acumulación de placa en espacios interproximales?</h4>
          {renderOptionButtons(['Abundante', 'Moderada', 'Escasa', 'Ausente'], 'placa-interproximal')}
      </div>
      <div>
          <h4 className="font-semibold text-sm">4. ¿Hay presencia de cálculo dental interproximal?</h4>
          {renderOptionButtons(['Abundante', 'Moderado', 'Escaso', 'Ausente'], 'calculo-interproximal')}
      </div>
      <div>
          <h4 className="font-semibold text-sm">5. ¿Se observa pérdida de inserción en áreas interproximales?</h4>
          {renderOptionButtons(['Sí, severa', 'Sí, moderada', 'Sí, leve', 'No'], 'insercion-interproximal')}
      </div>
      <div>
          <h4 className="font-semibold text-sm">6. Otros hallazgos clínicos:</h4>
          <Textarea placeholder="Describe cualquier otro hallazgo relevante..." className="mt-1 w-full text-xs" />
      </div>
    </div>
  );

  return (
    <div className="space-y-4">
      <div
        className="bg-blue-50 dark:bg-blue-900/20 p-2 sm:p-4 rounded-lg border border-blue-100 dark:border-blue-800 w-full text-left cursor-pointer"
        onClick={handleEnciasNormalesChange}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1 sm:gap-2">
            <AlertCircle className="h-4 w-4 sm:h-5 sm:w-5 text-blue-500" />
            <Label className="text-xs sm:text-sm font-medium text-blue-700 dark:text-blue-300 flex items-center gap-1">
              Redacción de encías normal
              {enciasNormales ? (
                <span className="ml-1 sm:ml-2 text-xs text-green-500 bg-green-50 dark:bg-green-900/20 px-1 sm:px-2 py-0.5 rounded-full flex items-center gap-1">
                  <EyeOff className="h-3 w-3" />
                  <span className="hidden sm:inline">Secciones ocultas</span>
                  <span className="sm:hidden">Ocultas</span>
                </span>
              ) : (
                <span className="ml-1 sm:ml-2 text-xs text-blue-500 bg-blue-50 dark:bg-blue-900/20 px-1 sm:px-2 py-0.5 rounded-full flex items-center gap-1">
                  <Eye className="h-3 w-3" />
                  <span className="hidden sm:inline">Secciones visibles</span>
                  <span className="sm:hidden">Visibles</span>
                </span>
              )}
            </Label>
          </div>
          <Switch
            id="sin-patologia"
            checked={enciasNormales}
            onCheckedChange={handleEnciasNormalesChange}
            className="data-[state=checked]:bg-blue-500 scale-75 sm:scale-100"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      </div>

      {!enciasNormales && (
        <div className="space-y-6 pt-4">
          {/* --- Sección 1: Encías generalidades --- */}
          <div>
            <h3 className="text-lg font-bold border-b pb-2 mb-4">Encías generalidades</h3>
            {renderGeneralidades()}
          </div>

          {/* --- Sección 2: Encía libre --- */}
          <div>
            <h3 className="text-lg font-bold border-b pb-2 mb-4">Encía libre</h3>
            {renderEnciaLibre()}
          </div>

          {/* --- Sección 3: Encía adherida --- */}
          <div>
            <h3 className="text-lg font-bold border-b pb-2 mb-4">Encía adherida</h3>
            {renderEnciaAdherida()}
          </div>

          {/* --- Sección 4: Encía interproximal --- */}
          <div>
            <h3 className="text-lg font-bold border-b pb-2 mb-4">Encía interproximal</h3>
            {renderEnciaInterproximal()}
          </div>
        </div>
      )}
      
      {/* El componente Pop-up se renderiza aquí cuando está activo */}
      {activeLesion && <LesionPopup lesion={activeLesion} onClose={() => setActiveLesion(null)} />}
    </div>
  );
};

export default EnciaSection;