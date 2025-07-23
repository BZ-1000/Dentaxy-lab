import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { FormDataState } from '@/types/historiaClinica';
import { ChevronLeft, ChevronRight } from 'lucide-react';

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
  const [selectedColor, setSelectedColor] = useState('');
  const [showLesionTextarea, setShowLesionTextarea] = useState(false);
  const [showManchasTextarea, setShowManchasTextarea] = useState(false);

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
            <input 
              type="radio" 
              id={`color-${index}`} 
              name="color" 
              value={option.label}
              onChange={(e) => setSelectedColor(e.target.value)}
            />
            <Label htmlFor={`color-${index}`} className="text-sm">{option.label}</Label>
          </div>
        ))}
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
            <div className="space-y-2">
              {['Lisa', 'Punteada', 'Ulcerada', 'Fibrótica', 'Edematosa', 'Otro'].map((textura) => (
                <div key={textura} className="flex items-center space-x-2">
                  <Checkbox id={`textura-${textura}`} />
                  <Label htmlFor={`textura-${textura}`}>{textura}</Label>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4">
            <h4 className="font-medium mb-2">Contorno / forma:</h4>
            <div className="space-y-2">
              {['Regular', 'Irregular', 'Aumentado de volumen', 'Recesión gingival', 'Presencia de pseudobolsas', 'Otro'].map((contorno) => (
                <div key={contorno} className="flex items-center space-x-2">
                  <Checkbox id={`contorno-${contorno}`} />
                  <Label htmlFor={`contorno-${contorno}`}>{contorno}</Label>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4">
            <h4 className="font-medium mb-2">Consistencia:</h4>
            <div className="space-y-2">
              {['Firme', 'Blanda', 'Hiperplásica', 'Otro'].map((consistencia) => (
                <div key={consistencia} className="flex items-center space-x-2">
                  <Checkbox id={`consistencia-${consistencia}`} />
                  <Label htmlFor={`consistencia-${consistencia}`}>{consistencia}</Label>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4">
            <h4 className="font-medium mb-2">Sangrado al sondaje o palpación:</h4>
            <div className="space-y-2">
              {['Sí', 'No', 'Otro'].map((sangrado) => (
                <div key={sangrado} className="flex items-center space-x-2">
                  <Checkbox id={`sangrado-${sangrado}`} />
                  <Label htmlFor={`sangrado-${sangrado}`}>{sangrado}</Label>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4">
            <h4 className="font-medium mb-2">Dolor o sensibilidad:</h4>
            <div className="space-y-2">
              {['Sí', 'No', 'Otro'].map((dolor) => (
                <div key={dolor} className="flex items-center space-x-2">
                  <Checkbox id={`dolor-${dolor}`} />
                  <Label htmlFor={`dolor-${dolor}`}>{dolor}</Label>
                </div>
              ))}
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
              onClick={() => setCurrentSubSection(Math.min(sections.length - 1, currentSubSection + 1))}
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
  };

  const renderPaladarForm = () => {
    const sections = ['Paladar duro', 'Paladar blando'];
    const currentSection = sections[currentSubSection];

    return (
      <div className="space-y-4">
        <div>
          <p className="text-sm text-gray-600 mb-3">Divisiones:</p>
          <div className="space-y-2">
            {['Paladar duro', 'Paladar blando'].map((division) => (
              <div key={division} className="flex items-center space-x-2">
                <Checkbox id={`paladar-${division}`} />
                <Label htmlFor={`paladar-${division}`}>{division}</Label>
              </div>
            ))}
          </div>
        </div>

        <div className="border-t pt-4">
          <h3 className="text-lg font-semibold mb-4">{currentSection}</h3>
          
          <ColorSelector />

          <div className="mt-4">
            <h4 className="font-medium mb-2">Superficie:</h4>
            <div className="space-y-2">
              {['Lisa', 'Rugosa (normal)', 'Ulcerada', 'Nodular', 'Placa blanca o roja', 'Otro'].map((superficie) => (
                <div key={superficie} className="flex items-center space-x-2">
                  <Checkbox id={`superficie-${superficie}`} />
                  <Label htmlFor={`superficie-${superficie}`}>{superficie}</Label>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4">
            <h4 className="font-medium mb-2">Elevación del paladar al decir "ah":</h4>
            <div className="space-y-2">
              {['Simétrica', 'Asimétrica', 'Otro'].map((elevacion) => (
                <div key={elevacion} className="flex items-center space-x-2">
                  <Checkbox id={`elevacion-${elevacion}`} />
                  <Label htmlFor={`elevacion-${elevacion}`}>{elevacion}</Label>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4">
            <h4 className="font-medium mb-2">Presencia de masas, exostosis o torus palatino:</h4>
            <div className="space-y-2">
              {['Sí', 'No', 'Otro'].map((masas) => (
                <div key={masas} className="flex items-center space-x-2">
                  <Checkbox id={`masas-${masas}`} />
                  <Label htmlFor={`masas-${masas}`}>{masas}</Label>
                </div>
              ))}
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
              onClick={() => setCurrentSubSection(Math.min(sections.length - 1, currentSubSection + 1))}
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
  };

  const renderOrofaringeForm = () => (
    <div className="space-y-4">
      <div>
        <h4 className="font-medium mb-2">Estructuras a evaluar:</h4>
        <div className="space-y-2">
          {['Amígdalas', 'Úvula', 'Pared posterior faríngea', 'Pilar anterior y posterior', 'Otro'].map((estructura) => (
            <div key={estructura} className="flex items-center space-x-2">
              <Checkbox id={`estructura-${estructura}`} />
              <Label htmlFor={`estructura-${estructura}`}>{estructura}</Label>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h4 className="font-medium mb-2">Amígdalas:</h4>
        <div className="space-y-3">
          <div>
            <Label className="text-sm font-medium">Presencia:</Label>
            <div className="space-y-2">
              {['Sí', 'No', 'Otro'].map((presencia) => (
                <div key={presencia} className="flex items-center space-x-2">
                  <Checkbox id={`amigdalas-presencia-${presencia}`} />
                  <Label htmlFor={`amigdalas-presencia-${presencia}`}>{presencia}</Label>
                </div>
              ))}
            </div>
          </div>

          <div>
            <Label className="text-sm font-medium">Tamaño:</Label>
            <div className="space-y-2">
              {['0: Ausentes', 'I: Dentro de pilares', 'II: Hasta pilares', 'III: Más allá de pilares', 'IV: Se tocan (kissing tonsils)', 'Otro'].map((tamano) => (
                <div key={tamano} className="flex items-center space-x-2">
                  <Checkbox id={`tamano-${tamano}`} />
                  <Label htmlFor={`tamano-${tamano}`}>{tamano}</Label>
                </div>
              ))}
            </div>
          </div>

          <div>
            <Label className="text-sm font-medium">Secreción purulenta:</Label>
            <div className="space-y-2">
              {['Sí', 'No', 'Otro'].map((secrecion) => (
                <div key={secrecion} className="flex items-center space-x-2">
                  <Checkbox id={`secrecion-${secrecion}`} />
                  <Label htmlFor={`secrecion-${secrecion}`}>{secrecion}</Label>
                </div>
              ))}
            </div>
          </div>

          <div>
            <Label className="text-sm font-medium">Criptas visibles:</Label>
            <div className="space-y-2">
              {['Sí', 'No', 'Otro'].map((criptas) => (
                <div key={criptas} className="flex items-center space-x-2">
                  <Checkbox id={`criptas-${criptas}`} />
                  <Label htmlFor={`criptas-${criptas}`}>{criptas}</Label>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div>
        <h4 className="font-medium mb-2">Úvula:</h4>
        <div className="space-y-3">
          <div>
            <Label className="text-sm font-medium">Forma:</Label>
            <div className="space-y-2">
              {['Normal', 'Edematosa', 'Desviada', 'Otro'].map((forma) => (
                <div key={forma} className="flex items-center space-x-2">
                  <Checkbox id={`forma-${forma}`} />
                  <Label htmlFor={`forma-${forma}`}>{forma}</Label>
                </div>
              ))}
            </div>
          </div>

          <div>
            <Label className="text-sm font-medium">Movimiento:</Label>
            <div className="space-y-2">
              {['Simétrico', 'Asimétrico', 'Otro'].map((movimiento) => (
                <div key={movimiento} className="flex items-center space-x-2">
                  <Checkbox id={`movimiento-${movimiento}`} />
                  <Label htmlFor={`movimiento-${movimiento}`}>{movimiento}</Label>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div>
        <h4 className="font-medium mb-2">Pared posterior:</h4>
        <div className="space-y-2">
          {['Eritematoso', 'Granular', 'Presencia de exudado o pus', 'Otro'].map((pared) => (
            <div key={pared} className="flex items-center space-x-2">
              <Checkbox id={`pared-${pared}`} />
              <Label htmlFor={`pared-${pared}`}>{pared}</Label>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h4 className="font-medium mb-2">Pilares:</h4>
        <div className="space-y-2">
          {['Inflamación', 'Dolor a la palpación', 'Otro'].map((pilar) => (
            <div key={pilar} className="flex items-center space-x-2">
              <Checkbox id={`pilar-${pilar}`} />
              <Label htmlFor={`pilar-${pilar}`}>{pilar}</Label>
            </div>
          ))}
        </div>
      </div>

      <div>
        <Label htmlFor="orofaringe-otros">Otros hallazgos:</Label>
        <Textarea id="orofaringe-otros" placeholder="Describe otros hallazgos..." />
      </div>
    </div>
  );

  const renderMejillasForm = () => (
    <div className="space-y-4">
      <ColorSelector />

      <div className="mt-4">
        <h4 className="font-medium mb-2">Manchas blancas o rojas:</h4>
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="manchas-presentes" 
              onCheckedChange={(checked) => setShowManchasTextarea(!!checked)}
            />
            <Label htmlFor="manchas-presentes">Presente</Label>
          </div>
          {showManchasTextarea && (
            <Textarea placeholder="Describe las manchas..." />
          )}
        </div>
      </div>

      <div>
        <h4 className="font-medium mb-2">Textura interna:</h4>
        <div className="space-y-2">
          {['Lisa', 'Rugosa', 'Otro'].map((textura) => (
            <div key={textura} className="flex items-center space-x-2">
              <Checkbox id={`mejillas-textura-${textura}`} />
              <Label htmlFor={`mejillas-textura-${textura}`}>{textura}</Label>
            </div>
          ))}
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="lesiones"
              onCheckedChange={(checked) => setShowLesionTextarea(!!checked)}
            />
            <Label htmlFor="lesiones">Lesiones: úlceras, leucoplasia, liquen plano</Label>
          </div>
          {showLesionTextarea && (
            <Textarea placeholder="Describe la lesión..." />
          )}
        </div>
      </div>

      <div>
        <h4 className="font-medium mb-2">Línea alba o mordedura habitual:</h4>
        <div className="space-y-2">
          {['Presente', 'Ausente', 'Otro'].map((linea) => (
            <div key={linea} className="flex items-center space-x-2">
              <Checkbox id={`linea-alba-${linea}`} />
              <Label htmlFor={`linea-alba-${linea}`}>{linea}</Label>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h4 className="font-medium mb-2">Conducto de Stenon (parótida):</h4>
        <div className="space-y-2">
          {['Visible y permeable', 'Con secreción anormal', 'Otro'].map((stenon) => (
            <div key={stenon} className="flex items-center space-x-2">
              <Checkbox id={`stenon-${stenon}`} />
              <Label htmlFor={`stenon-${stenon}`}>{stenon}</Label>
            </div>
          ))}
        </div>
      </div>

      <div>
        <Label htmlFor="mejillas-otros">Otros hallazgos:</Label>
        <Textarea id="mejillas-otros" placeholder="Describe otros hallazgos..." />
      </div>
    </div>
  );

  const renderRetromolarForm = () => (
    <div className="space-y-4">
      <div>
        <h4 className="font-medium mb-2">Presencia de lesiones:</h4>
        <div className="space-y-2">
          {['Ulcerativas', 'Nodulares', 'Fibromas o hiperplasias', 'Otro'].map((lesion) => (
            <div key={lesion} className="flex items-center space-x-2">
              <Checkbox id={`retromolar-lesion-${lesion}`} />
              <Label htmlFor={`retromolar-lesion-${lesion}`}>{lesion}</Label>
            </div>
          ))}
        </div>
      </div>

      <ColorSelector />

      <div className="mt-4">
        <h4 className="font-medium mb-2">Dolor o sensibilidad:</h4>
        <div className="space-y-2">
          {['Sí', 'No', 'Otro'].map((dolor) => (
            <div key={dolor} className="flex items-center space-x-2">
              <Checkbox id={`retromolar-dolor-${dolor}`} />
              <Label htmlFor={`retromolar-dolor-${dolor}`}>{dolor}</Label>
            </div>
          ))}
        </div>
      </div>

      <div>
        <Label htmlFor="retromolar-otros">Otros hallazgos:</Label>
        <Textarea id="retromolar-otros" placeholder="Describe otros hallazgos..." />
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
        <div className="space-y-2">
          {['Normal', 'Macroglosia', 'Atrófica', 'Otro'].map((tamano) => (
            <div key={tamano} className="flex items-center space-x-2">
              <Checkbox id={`lengua-tamano-${tamano}`} />
              <Label htmlFor={`lengua-tamano-${tamano}`}>{tamano}</Label>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h4 className="font-medium mb-2">Movilidad:</h4>
        <div className="space-y-2">
          {['Conservada', 'Limitada', 'Otro'].map((movilidad) => (
            <div key={movilidad} className="flex items-center space-x-2">
              <Checkbox id={`lengua-movilidad-${movilidad}`} />
              <Label htmlFor={`lengua-movilidad-${movilidad}`}>{movilidad}</Label>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h4 className="font-medium mb-2">Superficie dorsal:</h4>
        <div className="space-y-2">
          {['Filiformes normales', 'Lengua saburral', 'Lengua geográfica', 'Lengua fisurada', 'Leucoplasia / candidiasis', 'Otro'].map((superficie) => (
            <div key={superficie} className="flex items-center space-x-2">
              <Checkbox id={`lengua-superficie-${superficie}`} />
              <Label htmlFor={`lengua-superficie-${superficie}`}>{superficie}</Label>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h4 className="font-medium mb-2">Bordes laterales:</h4>
        <div className="space-y-2">
          {['Ulceraciones', 'Mordisqueo', 'Indentaciones dentales', 'Lesiones blancas / rojas', 'Otro'].map((borde) => (
            <div key={borde} className="flex items-center space-x-2">
              <Checkbox id={`lengua-borde-${borde}`} />
              <Label htmlFor={`lengua-borde-${borde}`}>{borde}</Label>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h4 className="font-medium mb-2">Cara inferior y frenillo:</h4>
        <div className="space-y-2">
          {['Varices', 'Lesiones', 'Limitación (anquiloglosia)', 'Otro'].map((cara) => (
            <div key={cara} className="flex items-center space-x-2">
              <Checkbox id={`lengua-cara-${cara}`} />
              <Label htmlFor={`lengua-cara-${cara}`}>{cara}</Label>
            </div>
          ))}
        </div>
      </div>

      <div>
        <Label htmlFor="lengua-otros">Otros hallazgos:</Label>
        <Textarea id="lengua-otros" placeholder="Describe otros hallazgos..." />
      </div>
    </div>
  );

  const renderPisoBocaForm = () => (
    <div className="space-y-4">
      <div>
        <h4 className="font-medium mb-2">Estructuras:</h4>
        <div className="space-y-2">
          {['Glándulas sublinguales', 'Vasos sublinguales', 'Frenillo', 'Conducto de Wharton', 'Otro'].map((estructura) => (
            <div key={estructura} className="flex items-center space-x-2">
              <Checkbox id={`piso-estructura-${estructura}`} />
              <Label htmlFor={`piso-estructura-${estructura}`}>{estructura}</Label>
            </div>
          ))}
        </div>
      </div>

      <ColorSelector />

      <div className="mt-4">
        <h4 className="font-medium mb-2">Secreción salival:</h4>
        <div className="space-y-2">
          {['Normal', 'Aumentada', 'Disminuida', 'Purulenta', 'Otro'].map((secrecion) => (
            <div key={secrecion} className="flex items-center space-x-2">
              <Checkbox id={`piso-secrecion-${secrecion}`} />
              <Label htmlFor={`piso-secrecion-${secrecion}`}>{secrecion}</Label>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h4 className="font-medium mb-2">Vasos sublinguales:</h4>
        <div className="space-y-2">
          {['Visibles finos (normal)', 'Engrosados', 'Con varicosidades', 'Otro'].map((vaso) => (
            <div key={vaso} className="flex items-center space-x-2">
              <Checkbox id={`piso-vaso-${vaso}`} />
              <Label htmlFor={`piso-vaso-${vaso}`}>{vaso}</Label>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h4 className="font-medium mb-2">Presencia de masas, ranulas, elevaciones:</h4>
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <Checkbox id="piso-masa-no" />
            <Label htmlFor="piso-masa-no">No</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox id="piso-masa-si" />
            <Label htmlFor="piso-masa-si">Sí (describir tamaño, localización)</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox id="piso-masa-otro" />
            <Label htmlFor="piso-masa-otro">Otro</Label>
          </div>
        </div>
      </div>

      <div>
        <h4 className="font-medium mb-2">Frenillo lingual:</h4>
        <div className="space-y-2">
          {['Normal', 'Corto', 'Ulcerado', 'Otro'].map((frenillo) => (
            <div key={frenillo} className="flex items-center space-x-2">
              <Checkbox id={`piso-frenillo-${frenillo}`} />
              <Label htmlFor={`piso-frenillo-${frenillo}`}>{frenillo}</Label>
            </div>
          ))}
        </div>
      </div>

      <div>
        <Label htmlFor="piso-otros">Otros hallazgos:</Label>
        <Textarea id="piso-otros" placeholder="Describe otros hallazgos..." />
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
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{getAreaTitle()}</DialogTitle>
        </DialogHeader>
        <div className="mt-4">
          {renderForm()}
        </div>
        <div className="flex justify-end mt-4">
          <Button onClick={onClose}>Cerrar</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ExamenIntrabucalForm;