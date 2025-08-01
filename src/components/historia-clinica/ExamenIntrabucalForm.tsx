import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { FormDataState } from '@/types/historiaClinica';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';

interface ExamenIntrabucalFormProps {
  area: string;
  onClose: () => void;
  formData: FormDataState;
  handleExamenIntrabucalChange: (part: string, value: string | boolean) => void;
}

const ExamenIntrabucalForm: React.FC<ExamenIntrabucalFormProps> = ({
  area,
  onClose,
  formData,
  handleExamenIntrabucalChange
}) => {
  const [currentSubSection, setCurrentSubSection] = useState(0);
  const [selectedOptions, setSelectedOptions] = useState<{[key: string]: string}>({});
  const [showLesionTextarea, setShowLesionTextarea] = useState(false);
  const [showManchasTextarea, setShowManchasTextarea] = useState(false);
  const [otroTextareas, setOtroTextareas] = useState<{[key: string]: boolean}>({});

  const getAreaTitle = () => {
    switch (area) {
      case 'encias': return '🦷 1. ENCÍAS';
      case 'paladar': return '🦷 2. PALADAR';
      case 'orofaringe': return '🦷 3. OROFARINGE / ISTMO DE LAS FAUCES';
      case 'mejillas': return '🦷 4. MEJILLAS';
      case 'retromolar': return '🦷 5. REGIÓN RETROMOLAR';
      case 'lengua': return '🦷 6. LENGUA';
      case 'pisoBoca': return '🦷 7. PISO DE BOCA';
      default: return 'Examen';
    }
  };

  const colorOptions = [
    { color: '#FFC0CB', label: 'Rosa pálido: mucosa sana, normal' },
    { color: '#FF6666', label: 'Eritematoso / rojo: inflamación, infección, trauma' },
    { color: '#FFF0F5', label: 'Pálido: anemia, deficiencia de hierro' },
    { color: '#A9A9A9', label: 'Blanquecino: leucoplasia, cándida, línea alba' },
    { color: '#8B0000', label: 'Rojizo oscuro / purpúreo: trauma, petequias, lesiones vasculares' },
    { color: '#FFCC00', label: 'Amarillento: saburra lingual, secreción purulenta' },
    { color: '#000000', label: 'Negruzco: pigmentación por tabaco, lengua negra vellosa' },
    { color: '#964B00', label: 'Café / marrón: melanosis, tabaquismo, pigmentación' },
    { color: '#00008B', label: 'Cianótico (azulado): hipoxia, venas varicosas' }
  ];

  const toggleOption = (option: string, category: string) => {
    setSelectedOptions(prev => ({
      ...prev,
      [category]: option
    }));

    if (option.toLowerCase().includes('otro')) {
      setOtroTextareas(prev => ({
        ...prev,
        [option]: !prev[option]
      }));
    }
  };

  const createOptionWithTextarea = (options: string[], prefix: string = '') => {
    return options.map((option) => (
      <div key={option} className="flex flex-col">
        <Button
          variant={selectedOptions[prefix] === option ? "default" : "outline"}
          size="sm"
          onClick={() => toggleOption(option, prefix)}
          className="w-full"
        >
          {option}
        </Button>
        {option === 'Otro' && otroTextareas[`${prefix}${option}`] && (
          <Textarea placeholder="Especifica..." className="mt-2 w-full" />
        )}
      </div>
    ));
  };

  const ColorSelector = () => (
    <div>
      <h4 className="font-medium mb-2">Color:</h4>
      <p className="text-sm text-gray-600 mb-3">Descripción clínica común</p>
      <div className="space-y-2">
        {colorOptions.map((option, index) => (
          <div key={index} className="flex items-center space-x-2">
            <div
              style={{
                width: '25px',
                height: '25px',
                borderRadius: '50%',
                backgroundColor: option.color,
                border: '1px solid #000'
              }}
            />
            <Button
              variant={selectedOptions['color'] === option.label ? "default" : "outline"}
              size="sm"
              onClick={() => toggleOption(option.label, 'color')}
              className="text-left justify-start h-auto p-2 w-full"
            >
              {option.label}
            </Button>
          </div>
        ))}
        <div className="flex flex-col">
          <Button
            variant={selectedOptions['color'] === "Otro color" ? "default" : "outline"}
            size="sm"
            onClick={() => toggleOption("Otro color", 'color')}
            className="mt-2 w-full"
          >
            Otro
          </Button>
          {otroTextareas["Otro color"] && (
            <Textarea placeholder="Especifica el color..." className="mt-2 w-full" />
          )}
        </div>
      </div>
    </div>
  );

  const renderEnciasForm = () => {
    const sections = ['Encías generalidades', 'Encía libre', 'Encía adherida', 'Encía interproximal'];
    const currentSection = sections[currentSubSection];

    // Render Encías generalidades section
    if (currentSubSection === 0) {
      return (
        <div className="space-y-4">
          <div>
            <p className="text-sm text-gray-600 mb-3">Evaluación general de las encías:</p>
          </div>
          <div className="border-t pt-4">
            <h3 className="text-lg font-semibold mb-4">{currentSection}</h3>
            
            {/* 1. Color observado */}
            <div className="mb-6">
              <h4 className="font-medium mb-2">1. Color observado:</h4>
              <div className="space-y-2">
                {colorOptions.map((option, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <div
                      style={{
                        width: '25px',
                        height: '25px',
                        borderRadius: '50%',
                        backgroundColor: option.color,
                        border: '1px solid #000'
                      }}
                    />
                    <Button
                      variant={selectedOptions['color-generalidades'] === option.label ? "default" : "outline"}
                      size="sm"
                      onClick={() => toggleOption(option.label, 'color-generalidades')}
                      className="text-left justify-start h-auto p-2 w-full"
                    >
                      {option.label}
                    </Button>
                  </div>
                ))}
                <div className="flex flex-col">
                  <Button
                    variant={selectedOptions['color-generalidades'] === "Otro color" ? "default" : "outline"}
                    size="sm"
                    onClick={() => toggleOption("Otro color", 'color-generalidades')}
                    className="mt-2 w-full"
                  >
                    Otro (especificar)
                  </Button>
                  {selectedOptions['color-generalidades'] === "Otro color" && (
                    <Textarea placeholder="Especifica el color..." className="mt-2 w-full" />
                  )}
                </div>
              </div>
            </div>

            {/* 2. Textura de la superficie */}
            <div className="mb-6">
              <h4 className="font-medium mb-2">2. Textura de la superficie:</h4>
              <div className="flex flex-wrap gap-2">
                {['Lisa', 'Punteada (piel de naranja)', 'Rugosa', 'Granular', 'Ulcerada', 'Fibrosa', 'Otro'].map((option) => (
                  <div key={option} className="flex flex-col">
                    <Button
                      variant={selectedOptions['textura-generalidades'] === option ? "default" : "outline"}
                      size="sm"
                      onClick={() => toggleOption(option, 'textura-generalidades')}
                      className="w-full"
                    >
                      {option}
                    </Button>
                    {option === 'Otro' && selectedOptions['textura-generalidades'] === option && (
                      <Textarea placeholder="Especifica..." className="mt-2 w-full" />
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* 3. Contorno o forma observada */}
            <div className="mb-6">
              <h4 className="font-medium mb-2">3. Contorno o forma observada:</h4>
              <div className="flex flex-wrap gap-2">
                {['Festoneado (normal)', 'Aumentado de volumen', 'Recesión gingival', 'Engrosamiento marginal', 'Pseudobolsas', 'Otro'].map((option) => (
                  <div key={option} className="flex flex-col">
                    <Button
                      variant={selectedOptions['contorno-generalidades'] === option ? "default" : "outline"}
                      size="sm"
                      onClick={() => toggleOption(option, 'contorno-generalidades')}
                      className="w-full"
                    >
                      {option}
                    </Button>
                    {option === 'Otro' && selectedOptions['contorno-generalidades'] === option && (
                      <Textarea placeholder="Especifica..." className="mt-2 w-full" />
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* 4. Consistencia al tacto */}
            <div className="mb-6">
              <h4 className="font-medium mb-2">4. Consistencia al tacto:</h4>
              <div className="flex flex-wrap gap-2">
                {['Firme (normal)', 'Blanda', 'Edematosa', 'Hiperplásica', 'Fibrótica', 'Otro'].map((option) => (
                  <div key={option} className="flex flex-col">
                    <Button
                      variant={selectedOptions['consistencia-generalidades'] === option ? "default" : "outline"}
                      size="sm"
                      onClick={() => toggleOption(option, 'consistencia-generalidades')}
                      className="w-full"
                    >
                      {option}
                    </Button>
                    {option === 'Otro' && selectedOptions['consistencia-generalidades'] === option && (
                      <Textarea placeholder="Especifica..." className="mt-2 w-full" />
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* 5. Presencia de sangrado */}
            <div className="mb-6">
              <h4 className="font-medium mb-2">5. Presencia de sangrado:</h4>
              <div className="space-y-2">
                <div className="flex flex-wrap gap-2">
                  <Button
                    variant={selectedOptions['sangrado-generalidades'] === "Sí" ? "default" : "outline"}
                    size="sm"
                    onClick={() => toggleOption("Sí", 'sangrado-generalidades')}
                    className="w-full"
                  >
                    Sí
                  </Button>
                  <Button
                    variant={selectedOptions['sangrado-generalidades'] === "No" ? "default" : "outline"}
                    size="sm"
                    onClick={() => toggleOption("No", 'sangrado-generalidades')}
                    className="w-full"
                  >
                    No
                  </Button>
                </div>
                {selectedOptions['sangrado-generalidades'] === "Sí" && (
                  <div className="ml-4 space-y-2">
                    <p className="text-sm font-medium">Tipo de sangrado:</p>
                    <div className="flex flex-wrap gap-2">
                      <Button
                        variant={selectedOptions['tipo-sangrado'] === "Generalizada" ? "default" : "outline"}
                        size="sm"
                        onClick={() => toggleOption("Generalizada", 'tipo-sangrado')}
                        className="w-full"
                      >
                        Generalizada
                      </Button>
                      <Button
                        variant={selectedOptions['tipo-sangrado'] === "Localizada" ? "default" : "outline"}
                        size="sm"
                        onClick={() => toggleOption("Localizada", 'tipo-sangrado')}
                        className="w-full"
                      >
                        Localizada
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* 6. Dolor o sensibilidad */}
            <div className="mb-6">
              <h4 className="font-medium mb-2">6. Dolor o sensibilidad:</h4>
              <div className="space-y-2">
                <div className="flex flex-wrap gap-2">
                  <Button
                    variant={selectedOptions['dolor-generalidades'] === "Sí" ? "default" : "outline"}
                    size="sm"
                    onClick={() => toggleOption("Sí", 'dolor-generalidades')}
                    className="w-full"
                  >
                    Sí
                  </Button>
                  <Button
                    variant={selectedOptions['dolor-generalidades'] === "No" ? "default" : "outline"}
                    size="sm"
                    onClick={() => toggleOption("No", 'dolor-generalidades')}
                    className="w-full"
                  >
                    No
                  </Button>
                </div>
                {selectedOptions['dolor-generalidades'] === "Sí" && (
                  <div className="ml-4 space-y-2">
                    <p className="text-sm font-medium">Tipo de dolor:</p>
                    <div className="flex flex-wrap gap-2">
                      <Button
                        variant={selectedOptions['tipo-dolor'] === "Generalizada" ? "default" : "outline"}
                        size="sm"
                        onClick={() => toggleOption("Generalizada", 'tipo-dolor')}
                        className="w-full"
                      >
                        Generalizada
                      </Button>
                      <Button
                        variant={selectedOptions['tipo-dolor'] === "Localizada" ? "default" : "outline"}
                        size="sm"
                        onClick={() => toggleOption("Localizada", 'tipo-dolor')}
                        className="w-full"
                      >
                        Localizada
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* 7. Presencia de lesiones */}
            <div className="mb-6">
              <h4 className="font-medium mb-2">7. Presencia de lesiones:</h4>
              <div className="space-y-3">
                {[
                  { option: 'Aftas/úlceras', placeholder: 'Describe ubicación, tamaño y características...' },
                  { option: 'Gingivitis ulceronecrotizante', placeholder: 'Describe severidad y ubicación...' },
                  { option: 'Hiperplasia gingival', placeholder: 'Describe tamaño y ubicación...' },
                  { option: 'Quistes gingivales', placeholder: 'Describe ubicación y características...' },
                  { option: 'Épulis/granuloma piógeno', placeholder: 'Describe ubicación y tamaño...' },
                  { option: 'Leucoplasia', placeholder: 'Describe ubicación y extensión...' },
                  { option: 'Otras lesiones', placeholder: 'Especifica tipo y características...' }
                ].map(({ option, placeholder }) => (
                  <div key={option} className="space-y-2">
                    <Button
                      variant={selectedOptions[`lesion-${option}`] === option ? "default" : "outline"}
                      size="sm"
                      onClick={() => toggleOption(option, `lesion-${option}`)}
                      className="w-full"
                    >
                      {option}
                    </Button>
                    {selectedOptions[`lesion-${option}`] === option && (
                      <Textarea placeholder={placeholder} className="w-full" />
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* 8. Condición visual alrededor de restauraciones */}
            <div className="mb-6">
              <h4 className="font-medium mb-2">8. Condición visual alrededor de restauraciones:</h4>
              <div className="flex flex-wrap gap-2">
                {['Normal', 'Inflamación marginal', 'Recesión gingival', 'Sangrado al sondeo', 'Hiperplasia'].map((option) => (
                  <Button
                    key={option}
                    variant={selectedOptions['restauraciones-generalidades'] === option ? "default" : "outline"}
                    size="sm"
                    onClick={() => toggleOption(option, 'restauraciones-generalidades')}
                    className="w-full"
                  >
                    {option}
                  </Button>
                ))}
              </div>
            </div>

            {/* 9. Otros hallazgos */}
            <div className="mb-6">
              <Label htmlFor="otros-generalidades">9. Otros hallazgos clínicos:</Label>
              <Textarea id="otros-generalidades" placeholder="Describe cualquier otro hallazgo relevante..." className="w-full" />
            </div>

            <div className="flex justify-between mt-4">
              <Button
                onClick={() => setCurrentSubSection(Math.max(0, currentSubSection - 1))}
                disabled={currentSubSection === 0}
                variant="outline"
              >
                <ChevronLeft className="w-4 h-4 mr-2" />
                Anterior
              </Button>
              <Button
                onClick={() => {
                  setCurrentSubSection(Math.min(sections.length - 1, currentSubSection + 1));
                  setTimeout(() => {
                    const dialogContent = document.querySelector('.max-w-4xl');
                    if (dialogContent) {
                      dialogContent.scrollTop = 0;
                    }
                  }, 100);
                }}
                disabled={currentSubSection === sections.length - 1}
                variant="outline"
              >
                Siguiente
                <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>
        </div>
      );
    }

    // Render other sections (Encía libre, adherida, interproximal)
    return (
      <div className="space-y-4">
        <div>
          <p className="text-sm text-gray-600 mb-3">Subtipos de encía:</p>
          <div className="space-y-2 text-sm">
            <p><strong>Encía libre:</strong> rodea el cuello del diente sin estar adherida al hueso alveolar.</p>
            <p><strong>Encía adherida:</strong> firmemente unida al hueso subyacente, resistente.</p>
            <p><strong>Encía interproximal:</strong> encía papilar entre dos dientes, susceptible a inflamación o pérdida por enfermedad periodontal.</p>
          </div>
        </div>
        <div className="border-t pt-4">
          <h3 className="text-lg font-semibold mb-4">{currentSection}</h3>
          
          {/* Specific questions based on current section */}
          {currentSubSection === 1 && ( // Encía libre
            <>
              <div className="mb-4">
                <h4 className="font-medium mb-2">1. ¿Se observa sangrado espontáneo al cepillado o masticación?</h4>
                <div className="flex flex-wrap gap-2">
                  {['Sí', 'No', 'Solo al cepillado', 'Solo al masticar'].map((option) => (
                    <Button
                      key={option}
                      variant={selectedOptions['libre-sangrado'] === option ? "default" : "outline"}
                      size="sm"
                      onClick={() => toggleOption(option, 'libre-sangrado')}
                      className="w-full"
                    >
                      {option}
                    </Button>
                  ))}
                </div>
              </div>

              <div className="mb-4">
                <h4 className="font-medium mb-2">2. ¿Hay inflamación del margen gingival?</h4>
                <div className="flex flex-wrap gap-2">
                  {['Leve', 'Moderada', 'Severa', 'Ausente'].map((option) => (
                    <Button
                      key={option}
                      variant={selectedOptions['libre-inflamacion'] === option ? "default" : "outline"}
                      size="sm"
                      onClick={() => toggleOption(option, 'libre-inflamacion')}
                      className="w-full"
                    >
                      {option}
                    </Button>
                  ))}
                </div>
              </div>

              <div className="mb-4">
                <h4 className="font-medium mb-2">3. ¿Se observa edema o engrosamiento?</h4>
                <div className="flex flex-wrap gap-2">
                  {['Presente generalizado', 'Presente localizado', 'Ausente'].map((option) => (
                    <Button
                      key={option}
                      variant={selectedOptions['libre-edema'] === option ? "default" : "outline"}
                      size="sm"
                      onClick={() => toggleOption(option, 'libre-edema')}
                      className="w-full"
                    >
                      {option}
                    </Button>
                  ))}
                </div>
              </div>

              <div className="mb-4">
                <h4 className="font-medium mb-2">4. ¿Hay presencia de placa dental en el margen gingival?</h4>
                <div className="flex flex-wrap gap-2">
                  {['Abundante', 'Moderada', 'Escasa', 'Ausente'].map((option) => (
                    <Button
                      key={option}
                      variant={selectedOptions['libre-placa'] === option ? "default" : "outline"}
                      size="sm"
                      onClick={() => toggleOption(option, 'libre-placa')}
                      className="w-full"
                    >
                      {option}
                    </Button>
                  ))}
                </div>
              </div>

              <div className="mb-4">
                <h4 className="font-medium mb-2">5. ¿Se observa retracción o recesión del margen gingival?</h4>
                <div className="flex flex-wrap gap-2">
                  {['Sí, generalizada', 'Sí, localizada', 'No'].map((option) => (
                    <Button
                      key={option}
                      variant={selectedOptions['libre-recesion'] === option ? "default" : "outline"}
                      size="sm"
                      onClick={() => toggleOption(option, 'libre-recesion')}
                      className="w-full"
                    >
                      {option}
                    </Button>
                  ))}
                </div>
              </div>
            </>
          )}

          {currentSubSection === 2 && ( // Encía adherida
            <>
              <div className="mb-4">
                <h4 className="font-medium mb-2">1. ¿Cuál es el ancho de la banda de encía adherida?</h4>
                <div className="flex flex-wrap gap-2">
                  {['Adecuado (>2mm)', 'Reducido (1-2mm)', 'Muy reducido (<1mm)', 'Ausente'].map((option) => (
                    <Button
                      key={option}
                      variant={selectedOptions['adherida-ancho'] === option ? "default" : "outline"}
                      size="sm"
                      onClick={() => toggleOption(option, 'adherida-ancho')}
                      className="w-full"
                    >
                      {option}
                    </Button>
                  ))}
                </div>
              </div>

              <div className="mb-4">
                <h4 className="font-medium mb-2">2. ¿Se observa punteado en cáscara de naranja?</h4>
                <div className="flex flex-wrap gap-2">
                  {['Presente y normal', 'Ausente', 'Alterado'].map((option) => (
                    <Button
                      key={option}
                      variant={selectedOptions['adherida-punteado'] === option ? "default" : "outline"}
                      size="sm"
                      onClick={() => toggleOption(option, 'adherida-punteado')}
                      className="w-full"
                    >
                      {option}
                    </Button>
                  ))}
                </div>
              </div>

              <div className="mb-4">
                <h4 className="font-medium mb-2">3. ¿Hay firme adherencia al hueso subyacente?</h4>
                <div className="flex flex-wrap gap-2">
                  {['Sí, firme', 'Parcialmente adherida', 'Poco adherida'].map((option) => (
                    <Button
                      key={option}
                      variant={selectedOptions['adherida-firmeza'] === option ? "default" : "outline"}
                      size="sm"
                      onClick={() => toggleOption(option, 'adherida-firmeza')}
                      className="w-full"
                    >
                      {option}
                    </Button>
                  ))}
                </div>
              </div>

              <div className="mb-4">
                <h4 className="font-medium mb-2">4. ¿Se observa la línea mucogingival claramente definida?</h4>
                <div className="flex flex-wrap gap-2">
                  {['Sí, bien definida', 'Parcialmente definida', 'No definida'].map((option) => (
                    <Button
                      key={option}
                      variant={selectedOptions['adherida-linea'] === option ? "default" : "outline"}
                      size="sm"
                      onClick={() => toggleOption(option, 'adherida-linea')}
                      className="w-full"
                    >
                      {option}
                    </Button>
                  ))}
                </div>
              </div>

              <div className="mb-4">
                <h4 className="font-medium mb-2">5. ¿Hay presencia de frenillos que comprometan la encía adherida?</h4>
                <div className="flex flex-wrap gap-2">
                  {['Sí, compromete', 'Presente pero no compromete', 'Ausente'].map((option) => (
                    <Button
                      key={option}
                      variant={selectedOptions['adherida-frenillos'] === option ? "default" : "outline"}
                      size="sm"
                      onClick={() => toggleOption(option, 'adherida-frenillos')}
                      className="w-full"
                    >
                      {option}
                    </Button>
                  ))}
                </div>
              </div>
            </>
          )}

          {currentSubSection === 3 && ( // Encía interproximal
            <>
              <div className="mb-4">
                <h4 className="font-medium mb-2">1. ¿Las papilas gingivales llenan completamente los espacios interproximales?</h4>
                <div className="flex flex-wrap gap-2">
                  {['Sí, completamente', 'Parcialmente', 'No, hay espacios vacíos'].map((option) => (
                    <Button
                      key={option}
                      variant={selectedOptions['interproximal-papilas'] === option ? "default" : "outline"}
                      size="sm"
                      onClick={() => toggleOption(option, 'interproximal-papilas')}
                      className="w-full"
                    >
                      {option}
                    </Button>
                  ))}
                </div>
              </div>

              <div className="mb-4">
                <h4 className="font-medium mb-2">2. ¿Hay sangrado al sondeo en áreas interproximales?</h4>
                <div className="flex flex-wrap gap-2">
                  {['Sí, generalizado', 'Sí, localizado', 'No'].map((option) => (
                    <Button
                      key={option}
                      variant={selectedOptions['interproximal-sangrado'] === option ? "default" : "outline"}
                      size="sm"
                      onClick={() => toggleOption(option, 'interproximal-sangrado')}
                      className="w-full"
                    >
                      {option}
                    </Button>
                  ))}
                </div>
              </div>

              <div className="mb-4">
                <h4 className="font-medium mb-2">3. ¿Se observa acumulación de placa en espacios interproximales?</h4>
                <div className="flex flex-wrap gap-2">
                  {['Abundante', 'Moderada', 'Escasa', 'Ausente'].map((option) => (
                    <Button
                      key={option}
                      variant={selectedOptions['interproximal-placa'] === option ? "default" : "outline"}
                      size="sm"
                      onClick={() => toggleOption(option, 'interproximal-placa')}
                      className="w-full"
                    >
                      {option}
                    </Button>
                  ))}
                </div>
              </div>

              <div className="mb-4">
                <h4 className="font-medium mb-2">4. ¿Hay presencia de cálculo dental interproximal?</h4>
                <div className="flex flex-wrap gap-2">
                  {['Abundante', 'Moderado', 'Escaso', 'Ausente'].map((option) => (
                    <Button
                      key={option}
                      variant={selectedOptions['interproximal-calculo'] === option ? "default" : "outline"}
                      size="sm"
                      onClick={() => toggleOption(option, 'interproximal-calculo')}
                      className="w-full"
                    >
                      {option}
                    </Button>
                  ))}
                </div>
              </div>

              <div className="mb-4">
                <h4 className="font-medium mb-2">5. ¿Se observa pérdida de inserción en áreas interproximales?</h4>
                <div className="flex flex-wrap gap-2">
                  {['Sí, severa', 'Sí, moderada', 'Sí, leve', 'No'].map((option) => (
                    <Button
                      key={option}
                      variant={selectedOptions['interproximal-insercion'] === option ? "default" : "outline"}
                      size="sm"
                      onClick={() => toggleOption(option, 'interproximal-insercion')}
                      className="w-full"
                    >
                      {option}
                    </Button>
                  ))}
                </div>
              </div>
            </>
          )}

          <div className="flex justify-between mt-4">
            <Button
              onClick={() => setCurrentSubSection(Math.max(0, currentSubSection - 1))}
              disabled={currentSubSection === 0}
              variant="outline"
            >
              <ChevronLeft className="w-4 h-4 mr-2" />
              Anterior
            </Button>
            <Button
              onClick={() => {
                setCurrentSubSection(Math.min(sections.length - 1, currentSubSection + 1));
                setTimeout(() => {
                  const dialogContent = document.querySelector('.max-w-4xl');
                  if (dialogContent) {
                    dialogContent.scrollTop = 0;
                  }
                }, 100);
              }}
              disabled={currentSubSection === sections.length - 1}
              variant="outline"
            >
              Siguiente
              <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
          {currentSubSection === sections.length - 1 && (
            <div className="flex justify-center mt-4">
              <Button
                onClick={() => {
                  handleExamenIntrabucalChange(area, 'completed');
                  onClose();
                }}
                className="bg-emerald-500 hover:bg-emerald-600 text-white w-full"
              >
                Guardar
              </Button>
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderPaladarForm = () => {
    const sections = ['Paladar duro', 'Paladar blando'];
    const currentSection = sections[currentSubSection];
    return (
      <div className="space-y-4">
        <div>
          <p className="text-sm text-gray-600 mb-3">Divisiones:</p>
          <div className="space-y-2 text-sm">
            <p>Paladar duro</p>
            <p>Paladar blando</p>
          </div>
        </div>
        <div className="border-t pt-4">
          <h3 className="text-lg font-semibold mb-4">{currentSection}</h3>
          <ColorSelector />
          <div className="mt-4">
            <h4 className="font-medium mb-2">Superficie:</h4>
            <div className="flex flex-wrap gap-2">
              {createOptionWithTextarea(['Lisa', 'Rugosa (normal)', 'Ulcerada', 'Nodular', 'Placa blanca o roja', 'Otro'], 'superficie-')}
            </div>
          </div>
          <div className="mt-4">
            <h4 className="font-medium mb-2">Elevación del paladar al decir "ah":</h4>
            <div className="flex flex-wrap gap-2">
              {createOptionWithTextarea(['Simétrica', 'Asimétrica', 'Otro'], 'elevacion-')}
            </div>
          </div>
          <div className="mt-4">
            <h4 className="font-medium mb-2">Presencia de masas, exostosis o torus palatino:</h4>
            <div className="flex flex-wrap gap-2">
              {createOptionWithTextarea(['Sí', 'No', 'Otro'], 'masas-')}
            </div>
          </div>
          <div className="mt-4">
            <Label htmlFor="paladar-otros">Otros hallazgos:</Label>
            <Textarea id="paladar-otros" placeholder="Describe otros hallazgos..." className="w-full" />
          </div>
          <div className="flex justify-between mt-4">
            <Button
              onClick={() => setCurrentSubSection(Math.max(0, currentSubSection - 1))}
              disabled={currentSubSection === 0}
              variant="outline"
            >
              <ChevronLeft className="w-4 h-4 mr-2" />
              Anterior
            </Button>
            <Button
              onClick={() => {
                setCurrentSubSection(Math.min(sections.length - 1, currentSubSection + 1));
                setTimeout(() => {
                  const dialogContent = document.querySelector('.max-w-4xl');
                  if (dialogContent) {
                    dialogContent.scrollTop = 0;
                  }
                }, 100);
              }}
              disabled={currentSubSection === sections.length - 1}
              variant="outline"
            >
              Siguiente
              <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
          {currentSubSection === sections.length - 1 && (
            <div className="flex justify-center mt-4">
              <Button
                onClick={() => {
                  handleExamenIntrabucalChange(area, 'completed');
                  onClose();
                }}
                className="bg-emerald-500 hover:bg-emerald-600 text-white w-full"
              >
                Guardar
              </Button>
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderOrofaringeForm = () => (
    <div className="space-y-4">
      <div>
        <h4 className="font-medium mb-2">Estructuras a evaluar:</h4>
        <div className="flex flex-wrap gap-2">
          {createOptionWithTextarea(['Amígdalas', 'Úvula', 'Pared posterior faríngea', 'Pilar anterior y posterior', 'Otro'], 'estructura-')}
        </div>
      </div>
      <div>
        <h4 className="font-medium mb-2">Amígdalas:</h4>
        <div className="space-y-3">
          <div>
            <Label className="text-sm font-medium">Presencia:</Label>
            <div className="flex flex-wrap gap-2 mt-2">
              {createOptionWithTextarea(['Sí', 'No', 'Otro'], 'amigdalas-presencia-')}
            </div>
          </div>
          <div>
            <Label className="text-sm font-medium">Tamaño:</Label>
            <div className="flex flex-wrap gap-2 mt-2">
              {createOptionWithTextarea(['0: Ausentes', 'I: Dentro de pilares', 'II: Hasta pilares', 'III: Más allá de pilares', 'IV: Se tocan (kissing tonsils)', 'Otro'], 'tamano-')}
            </div>
          </div>
          <div>
            <Label className="text-sm font-medium">Secreción purulenta:</Label>
            <div className="flex flex-wrap gap-2 mt-2">
              {createOptionWithTextarea(['Sí', 'No', 'Otro'], 'secrecion-')}
            </div>
          </div>
          <div>
            <Label className="text-sm font-medium">Criptas visibles:</Label>
            <div className="flex flex-wrap gap-2 mt-2">
              {createOptionWithTextarea(['Sí', 'No', 'Otro'], 'criptas-')}
            </div>
          </div>
        </div>
      </div>
      <div>
        <h4 className="font-medium mb-2">Úvula:</h4>
        <div className="space-y-3">
          <div>
            <Label className="text-sm font-medium">Forma:</Label>
            <div className="flex flex-wrap gap-2 mt-2">
              {createOptionWithTextarea(['Normal', 'Edematosa', 'Desviada', 'Otro'], 'forma-')}
            </div>
          </div>
          <div>
            <Label className="text-sm font-medium">Movimiento:</Label>
            <div className="flex flex-wrap gap-2 mt-2">
              {createOptionWithTextarea(['Simétrico', 'Asimétrico', 'Otro'], 'movimiento-')}
            </div>
          </div>
        </div>
      </div>
      <div>
        <h4 className="font-medium mb-2">Pared posterior:</h4>
        <div className="flex flex-wrap gap-2">
          {createOptionWithTextarea(['Eritematoso', 'Granular', 'Presencia de exudado o pus', 'Otro'], 'pared-')}
        </div>
      </div>
      <div>
        <h4 className="font-medium mb-2">Pilares:</h4>
        <div className="flex flex-wrap gap-2">
          {createOptionWithTextarea(['Inflamación', 'Dolor a la palpación', 'Otro'], 'pilar-')}
        </div>
      </div>
      <div>
        <Label htmlFor="orofaringe-otros">Otros hallazgos:</Label>
        <Textarea id="orofaringe-otros" placeholder="Describe otros hallazgos..." className="w-full" />
      </div>
      <div className="flex justify-center mt-4">
        <Button
          onClick={() => {
            handleExamenIntrabucalChange(area, 'completed');
            onClose();
          }}
          className="bg-emerald-500 hover:bg-emerald-600 text-white w-full"
        >
          Guardar
        </Button>
      </div>
    </div>
  );

  const renderMejillasForm = () => (
    <div className="space-y-4">
      <ColorSelector />
      <div className="mt-4">
        <h4 className="font-medium mb-2">Manchas blancas o rojas:</h4>
        <div className="flex flex-wrap gap-2">
          <div className="flex flex-col w-full">
            <Button
              variant={selectedOptions['manchas'] === "manchas-presentes" ? "default" : "outline"}
              size="sm"
              onClick={() => {
                toggleOption("manchas-presentes", 'manchas');
                setShowManchasTextarea(selectedOptions['manchas'] !== "manchas-presentes");
              }}
              className="w-full"
            >
              Presente
            </Button>
          </div>
          <Button
            variant={selectedOptions['manchas'] === "manchas-ausentes" ? "default" : "outline"}
            size="sm"
            onClick={() => toggleOption("manchas-ausentes", 'manchas')}
            className="w-full"
          >
            Ausente
          </Button>
          <div className="flex flex-col w-full">
            <Button
              variant={selectedOptions['manchas'] === "manchas-otro" ? "default" : "outline"}
              size="sm"
              onClick={() => toggleOption("manchas-otro", 'manchas')}
              className="w-full"
            >
              Otro
            </Button>
            {otroTextareas["manchas-otro"] && (
              <Textarea placeholder="Especifica..." className="mt-2 w-full" />
            )}
          </div>
        </div>
        {showManchasTextarea && (
          <Textarea placeholder="Describe las manchas..." className="mt-2 w-full" />
        )}
      </div>
      <div className="mt-4">
        <h4 className="font-medium mb-2">Textura interna:</h4>
        <div className="flex flex-wrap gap-2">
          {createOptionWithTextarea(['Lisa', 'Rugosa', 'Otro'], 'mejillas-textura-')}
          <div className="flex flex-col w-full">
            <Button
              variant={selectedOptions['lesiones'] === "lesiones" ? "default" : "outline"}
              size="sm"
              onClick={() => {
                toggleOption("lesiones", 'lesiones');
                setShowLesionTextarea(selectedOptions['lesiones'] !== "lesiones");
              }}
              className="w-full"
            >
              Lesiones: úlceras, leucoplasia, liquen plano
            </Button>
          </div>
        </div>
        {showLesionTextarea && (
          <Textarea placeholder="Describe la lesión..." className="mt-2 w-full" />
        )}
      </div>
      <div className="mt-4">
        <h4 className="font-medium mb-2">Línea alba o mordedura habitual:</h4>
        <div className="flex flex-wrap gap-2">
          {createOptionWithTextarea(['Presente', 'Ausente', 'Otro'], 'linea-alba-')}
        </div>
      </div>
      <div className="mt-4">
        <h4 className="font-medium mb-2">Conducto de Stenon (parótida):</h4>
        <div className="flex flex-wrap gap-2">
          {createOptionWithTextarea(['Visible y permeable', 'Con secreción anormal', 'Otro'], 'stenon-')}
        </div>
      </div>
      <div className="mt-4">
        <Label htmlFor="mejillas-otros">Otros hallazgos:</Label>
        <Textarea id="mejillas-otros" placeholder="Describe otros hallazgos..." className="w-full" />
      </div>
      <div className="flex justify-center mt-4">
        <Button
          onClick={() => {
            handleExamenIntrabucalChange(area, 'completed');
            onClose();
          }}
          className="bg-emerald-500 hover:bg-emerald-600 text-white w-full"
        >
          Guardar
        </Button>
      </div>
    </div>
  );

  const renderRetromolarForm = () => (
    <div className="space-y-4">
      <div>
        <h4 className="font-medium mb-2">Presencia de lesiones:</h4>
        <div className="flex flex-wrap gap-2">
          {createOptionWithTextarea(['Ulcerativas', 'Nodulares', 'Fibromas o hiperplasias', 'Otro'], 'retromolar-lesion-')}
        </div>
      </div>
      <ColorSelector />
      <div className="mt-4">
        <h4 className="font-medium mb-2">Dolor o sensibilidad:</h4>
        <div className="flex flex-wrap gap-2">
          {createOptionWithTextarea(['Sí', 'No', 'Otro'], 'retromolar-dolor-')}
        </div>
      </div>
      <div className="mt-4">
        <Label htmlFor="retromolar-otros">Otros hallazgos:</Label>
        <Textarea id="retromolar-otros" placeholder="Describe otros hallazgos..." className="w-full" />
      </div>
      <div className="flex justify-center mt-4">
        <Button
          onClick={() => {
            handleExamenIntrabucalChange(area, 'completed');
            onClose();
          }}
          className="bg-emerald-500 hover:bg-emerald-600 text-white w-full"
        >
          Guardar
        </Button>
      </div>
    </div>
  );

  const renderLenguaForm = () => (
    <div className="space-y-4">
      <div>
        <p className="text-sm text-gray-600 mb-3">Divisiones:</p>
        <div className="space-y-2 text-sm">
          <p><strong>Dorso</strong></p>
          <p><strong>Bordes laterales</strong></p>
          <p><strong>Ventrículo (cara inferior)</strong></p>
          <p><strong>Punta</strong></p>
        </div>
      </div>
      <ColorSelector />
      <div className="mt-4">
        <h4 className="font-medium mb-2">Tamaño:</h4>
        <div className="flex flex-wrap gap-2">
          {createOptionWithTextarea(['Normal', 'Macroglosia', 'Atrófica', 'Otro'], 'lengua-tamano-')}
        </div>
      </div>
      <div className="mt-4">
        <h4 className="font-medium mb-2">Movilidad:</h4>
        <div className="flex flex-wrap gap-2">
          {createOptionWithTextarea(['Conservada', 'Limitada', 'Otro'], 'lengua-movilidad-')}
        </div>
      </div>
      <div className="mt-4">
        <h4 className="font-medium mb-2">Superficie dorsal:</h4>
        <div className="flex flex-wrap gap-2">
          {createOptionWithTextarea(['Filiformes normales', 'Lengua saburral', 'Lengua geográfica', 'Lengua fisurada', 'Leucoplasia / candidiasis', 'Otro'], 'lengua-superficie-')}
        </div>
      </div>
      <div className="mt-4">
        <h4 className="font-medium mb-2">Bordes laterales:</h4>
        <div className="flex flex-wrap gap-2">
          {createOptionWithTextarea(['Ulceraciones', 'Mordisqueo', 'Indentaciones dentales', 'Lesiones blancas / rojas', 'Otro'], 'lengua-borde-')}
        </div>
      </div>
      <div className="mt-4">
        <h4 className="font-medium mb-2">Cara inferior y frenillo:</h4>
        <div className="flex flex-wrap gap-2">
          {createOptionWithTextarea(['Varices', 'Lesiones', 'Limitación (anquiloglosia)', 'Otro'], 'lengua-cara-')}
        </div>
      </div>
      <div className="mt-4">
        <Label htmlFor="lengua-otros">Otros hallazgos:</Label>
        <Textarea id="lengua-otros" placeholder="Describe otros hallazgos..." className="w-full" />
      </div>
      <div className="flex justify-center mt-4">
        <Button
          onClick={() => {
            handleExamenIntrabucalChange(area, 'completed');
            onClose();
          }}
          className="bg-emerald-500 hover:bg-emerald-600 text-white w-full"
        >
          Guardar
        </Button>
      </div>
    </div>
  );

  const renderPisoBocaForm = () => (
    <div className="space-y-4">
      <div>
        <h4 className="font-medium mb-2">Estructuras:</h4>
        <div className="flex flex-wrap gap-2">
          {createOptionWithTextarea(['Glándulas sublinguales', 'Vasos sublinguales', 'Frenillo', 'Conducto de Wharton', 'Otro'], 'piso-estructura-')}
        </div>
      </div>
      <ColorSelector />
      <div className="mt-4">
        <h4 className="font-medium mb-2">Secreción salival:</h4>
        <div className="flex flex-wrap gap-2">
          {createOptionWithTextarea(['Normal', 'Aumentada', 'Disminuida', 'Purulenta', 'Otro'], 'piso-secrecion-')}
        </div>
      </div>
      <div className="mt-4">
        <h4 className="font-medium mb-2">Vasos sublinguales:</h4>
        <div className="flex flex-wrap gap-2">
          {createOptionWithTextarea(['Visibles finos (normal)', 'Engrosados', 'Con varicosidades', 'Otro'], 'piso-vaso-')}
        </div>
      </div>
      <div className="mt-4">
        <h4 className="font-medium mb-2">Presencia de masas, ranulas, elevaciones:</h4>
        <div className="flex flex-wrap gap-2">
          <Button
            variant={selectedOptions['piso-masa'] === "piso-masa-no" ? "default" : "outline"}
            size="sm"
            onClick={() => toggleOption("piso-masa-no", 'piso-masa')}
            className="w-full"
          >
            No
          </Button>
          <Button
            variant={selectedOptions['piso-masa'] === "piso-masa-si" ? "default" : "outline"}
            size="sm"
            onClick={() => toggleOption("piso-masa-si", 'piso-masa')}
            className="w-full"
          >
            Sí (describir tamaño, localización)
          </Button>
          <div className="flex flex-col w-full">
            <Button
              variant={selectedOptions['piso-masa'] === "piso-masa-otro" ? "default" : "outline"}
              size="sm"
              onClick={() => toggleOption("piso-masa-otro", 'piso-masa')}
              className="w-full"
            >
              Otro
            </Button>
            {otroTextareas["piso-masa-otro"] && (
              <Textarea placeholder="Especifica..." className="mt-2 w-full" />
            )}
          </div>
        </div>
      </div>
      <div className="mt-4">
        <h4 className="font-medium mb-2">Frenillo lingual:</h4>
        <div className="flex flex-wrap gap-2">
          {createOptionWithTextarea(['Normal', 'Corto', 'Ulcerado', 'Otro'], 'piso-frenillo-')}
        </div>
      </div>
      <div className="mt-4">
        <Label htmlFor="piso-otros">Otros hallazgos:</Label>
        <Textarea id="piso-otros" placeholder="Describe otros hallazgos..." className="w-full" />
      </div>
      <div className="flex justify-center mt-4">
        <Button
          onClick={() => {
            handleExamenIntrabucalChange(area, 'completed');
            onClose();
          }}
          className="bg-emerald-500 hover:bg-emerald-600 text-white w-full"
        >
          Guardar
        </Button>
      </div>
    </div>
  );

  const renderForm = () => {
    switch (area) {
      case 'encias': return renderEnciasForm();
      case 'paladar': return renderPaladarForm();
      case 'orofaringe': return renderOrofaringeForm();
      case 'mejillas': return renderMejillasForm();
      case 'retromolar': return renderRetromolarForm();
      case 'lengua': return renderLenguaForm();
      case 'pisoBoca': return renderPisoBocaForm();
      default: return <div>Seleccione un área</div>;
    }
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto w-full">
        <DialogHeader className="pb-4 border-b">
          <div className="flex justify-end">
            <button
              onClick={onClose}
              className="fixed top-4 right-4 z-[9999] p-2 rounded-full bg-red-100 text-red-600 hover:bg-red-200 transition-colors shadow-lg"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          <DialogTitle className="text-center">{getAreaTitle()}</DialogTitle>
        </DialogHeader>
        <div className="mt-4 p-4">
          {renderForm()}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ExamenIntrabucalForm;
