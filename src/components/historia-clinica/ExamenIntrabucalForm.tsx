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
    
    // Show textarea if "Otro" is selected
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
        >
          {option}
        </Button>
        {option === 'Otro' && otroTextareas[`${prefix}${option}`] && (
          <Textarea placeholder="Especifica..." className="mt-2" />
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
              className="text-left justify-start h-auto p-2"
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
            className="mt-2"
          >
            Otro
          </Button>
          {otroTextareas["Otro color"] && (
            <Textarea placeholder="Especifica el color..." className="mt-2" />
          )}
        </div>
      </div>
    </div>
  );

  const renderEnciasForm = () => {
    const sections = ['Encía libre', 'Encía adherida', 'Encía interproximal'];
    const currentSection = sections[currentSubSection];

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
          
          <ColorSelector />

          <div className="mt-4">
            <h4 className="font-medium mb-2">Textura:</h4>
            <div className="flex flex-wrap gap-2">
              {createOptionWithTextarea(['Lisa', 'Punteada', 'Ulcerada', 'Fibrótica', 'Edematosa', 'Otro'], 'textura-')}
            </div>
          </div>

          <div className="mt-4">
            <h4 className="font-medium mb-2">Contorno / forma:</h4>
            <div className="flex flex-wrap gap-2">
              {createOptionWithTextarea(['Regular', 'Irregular', 'Aumentado de volumen', 'Recesión gingival', 'Presencia de pseudobolsas', 'Otro'], 'contorno-')}
            </div>
          </div>

          <div className="mt-4">
            <h4 className="font-medium mb-2">Consistencia:</h4>
            <div className="flex flex-wrap gap-2">
              {createOptionWithTextarea(['Firme', 'Blanda', 'Hiperplásica', 'Otro'], 'consistencia-')}
            </div>
          </div>

          <div className="mt-4">
            <h4 className="font-medium mb-2">Sangrado al sondaje o palpación:</h4>
            <div className="flex flex-wrap gap-2">
              {createOptionWithTextarea(['Sí', 'No', 'Otro'], 'sangrado-')}
            </div>
          </div>

          <div className="mt-4">
            <h4 className="font-medium mb-2">Dolor o sensibilidad:</h4>
            <div className="flex flex-wrap gap-2">
              {createOptionWithTextarea(['Sí', 'No', 'Otro'], 'dolor-')}
            </div>
          </div>

          <div className="mt-4">
            <Label htmlFor="encias-otros">Otros hallazgos:</Label>
            <Textarea id="encias-otros" placeholder="Describe otros hallazgos..." />
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
                className="bg-emerald-500 hover:bg-emerald-600 text-white"
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
            <Textarea id="paladar-otros" placeholder="Describe otros hallazgos..." />
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
                className="bg-emerald-500 hover:bg-emerald-600 text-white"
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
        <Textarea id="orofaringe-otros" placeholder="Describe otros hallazgos..." />
      </div>

      <div className="flex justify-center mt-4">
        <Button 
          onClick={() => {
            handleExamenIntrabucalChange(area, 'completed');
            onClose();
          }}
          className="bg-emerald-500 hover:bg-emerald-600 text-white"
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
          <div className="flex flex-col">
            <Button
              variant={selectedOptions['manchas'] === "manchas-presentes" ? "default" : "outline"}
              size="sm"
              onClick={() => {
                toggleOption("manchas-presentes", 'manchas');
                setShowManchasTextarea(selectedOptions['manchas'] !== "manchas-presentes");
              }}
            >
              Presente
            </Button>
          </div>
          <Button
            variant={selectedOptions['manchas'] === "manchas-ausentes" ? "default" : "outline"}
            size="sm"
            onClick={() => toggleOption("manchas-ausentes", 'manchas')}
          >
            Ausente
          </Button>
          <div className="flex flex-col">
            <Button
              variant={selectedOptions['manchas'] === "manchas-otro" ? "default" : "outline"}
              size="sm"
              onClick={() => toggleOption("manchas-otro", 'manchas')}
            >
              Otro
            </Button>
            {otroTextareas["manchas-otro"] && (
              <Textarea placeholder="Especifica..." className="mt-2" />
            )}
          </div>
        </div>
        {showManchasTextarea && (
          <Textarea placeholder="Describe las manchas..." className="mt-2" />
        )}
      </div>

      <div>
        <h4 className="font-medium mb-2">Textura interna:</h4>
        <div className="flex flex-wrap gap-2">
          {createOptionWithTextarea(['Lisa', 'Rugosa', 'Otro'], 'mejillas-textura-')}
          <div className="flex flex-col">
            <Button
              variant={selectedOptions['lesiones'] === "lesiones" ? "default" : "outline"}
              size="sm"
              onClick={() => {
                toggleOption("lesiones", 'lesiones');
                setShowLesionTextarea(selectedOptions['lesiones'] !== "lesiones");
              }}
            >
              Lesiones: úlceras, leucoplasia, liquen plano
            </Button>
          </div>
        </div>
        {showLesionTextarea && (
          <Textarea placeholder="Describe la lesión..." className="mt-2" />
        )}
      </div>

      <div>
        <h4 className="font-medium mb-2">Línea alba o mordedura habitual:</h4>
        <div className="flex flex-wrap gap-2">
          {createOptionWithTextarea(['Presente', 'Ausente', 'Otro'], 'linea-alba-')}
        </div>
      </div>

      <div>
        <h4 className="font-medium mb-2">Conducto de Stenon (parótida):</h4>
        <div className="flex flex-wrap gap-2">
          {createOptionWithTextarea(['Visible y permeable', 'Con secreción anormal', 'Otro'], 'stenon-')}
        </div>
      </div>

      <div>
        <Label htmlFor="mejillas-otros">Otros hallazgos:</Label>
        <Textarea id="mejillas-otros" placeholder="Describe otros hallazgos..." />
      </div>

      <div className="flex justify-center mt-4">
        <Button 
          onClick={() => {
            handleExamenIntrabucalChange(area, 'completed');
            onClose();
          }}
          className="bg-emerald-500 hover:bg-emerald-600 text-white"
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

      <div>
        <Label htmlFor="retromolar-otros">Otros hallazgos:</Label>
        <Textarea id="retromolar-otros" placeholder="Describe otros hallazgos..." />
      </div>

      <div className="flex justify-center mt-4">
        <Button 
          onClick={() => {
            handleExamenIntrabucalChange(area, 'completed');
            onClose();
          }}
          className="bg-emerald-500 hover:bg-emerald-600 text-white"
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

      <div>
        <h4 className="font-medium mb-2">Movilidad:</h4>
        <div className="flex flex-wrap gap-2">
          {createOptionWithTextarea(['Conservada', 'Limitada', 'Otro'], 'lengua-movilidad-')}
        </div>
      </div>

      <div>
        <h4 className="font-medium mb-2">Superficie dorsal:</h4>
        <div className="flex flex-wrap gap-2">
          {createOptionWithTextarea(['Filiformes normales', 'Lengua saburral', 'Lengua geográfica', 'Lengua fisurada', 'Leucoplasia / candidiasis', 'Otro'], 'lengua-superficie-')}
        </div>
      </div>

      <div>
        <h4 className="font-medium mb-2">Bordes laterales:</h4>
        <div className="flex flex-wrap gap-2">
          {createOptionWithTextarea(['Ulceraciones', 'Mordisqueo', 'Indentaciones dentales', 'Lesiones blancas / rojas', 'Otro'], 'lengua-borde-')}
        </div>
      </div>

      <div>
        <h4 className="font-medium mb-2">Cara inferior y frenillo:</h4>
        <div className="flex flex-wrap gap-2">
          {createOptionWithTextarea(['Varices', 'Lesiones', 'Limitación (anquiloglosia)', 'Otro'], 'lengua-cara-')}
        </div>
      </div>

      <div>
        <Label htmlFor="lengua-otros">Otros hallazgos:</Label>
        <Textarea id="lengua-otros" placeholder="Describe otros hallazgos..." />
      </div>

      <div className="flex justify-center mt-4">
        <Button 
          onClick={() => {
            handleExamenIntrabucalChange(area, 'completed');
            onClose();
          }}
          className="bg-emerald-500 hover:bg-emerald-600 text-white"
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

      <div>
        <h4 className="font-medium mb-2">Vasos sublinguales:</h4>
        <div className="flex flex-wrap gap-2">
          {createOptionWithTextarea(['Visibles finos (normal)', 'Engrosados', 'Con varicosidades', 'Otro'], 'piso-vaso-')}
        </div>
      </div>

      <div>
        <h4 className="font-medium mb-2">Presencia de masas, ranulas, elevaciones:</h4>
        <div className="flex flex-wrap gap-2">
          <Button
            variant={selectedOptions['piso-masa'] === "piso-masa-no" ? "default" : "outline"}
            size="sm"
            onClick={() => toggleOption("piso-masa-no", 'piso-masa')}
          >
            No
          </Button>
          <Button
            variant={selectedOptions['piso-masa'] === "piso-masa-si" ? "default" : "outline"}
            size="sm"
            onClick={() => toggleOption("piso-masa-si", 'piso-masa')}
          >
            Sí (describir tamaño, localización)
          </Button>
          <div className="flex flex-col">
            <Button
              variant={selectedOptions['piso-masa'] === "piso-masa-otro" ? "default" : "outline"}
              size="sm"
              onClick={() => toggleOption("piso-masa-otro", 'piso-masa')}
            >
              Otro
            </Button>
            {otroTextareas["piso-masa-otro"] && (
              <Textarea placeholder="Especifica..." className="mt-2" />
            )}
          </div>
        </div>
      </div>

      <div>
        <h4 className="font-medium mb-2">Frenillo lingual:</h4>
        <div className="flex flex-wrap gap-2">
          {createOptionWithTextarea(['Normal', 'Corto', 'Ulcerado', 'Otro'], 'piso-frenillo-')}
        </div>
      </div>

      <div>
        <Label htmlFor="piso-otros">Otros hallazgos:</Label>
        <Textarea id="piso-otros" placeholder="Describe otros hallazgos..." />
      </div>

      <div className="flex justify-center mt-4">
        <Button 
          onClick={() => {
            handleExamenIntrabucalChange(area, 'completed');
            onClose();
          }}
          className="bg-emerald-500 hover:bg-emerald-600 text-white"
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
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="sticky top-0 bg-white dark:bg-gray-800 z-10 pb-4 border-b">
          <div className="flex items-center justify-between">
            <DialogTitle>{getAreaTitle()}</DialogTitle>
            <button
              onClick={onClose}
              className="p-2 rounded-full bg-red-100 text-red-600 hover:bg-red-200 transition-colors sticky top-2 right-2"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </DialogHeader>
        <div className="mt-4">
          {renderForm()}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ExamenIntrabucalForm;