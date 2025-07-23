import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
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
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
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

  const toggleOption = (option: string) => {
    setSelectedOptions(prev => 
      prev.includes(option) 
        ? prev.filter(item => item !== option)
        : [...prev, option]
    );
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
              variant={selectedOptions.includes(option.label) ? "default" : "outline"}
              size="sm"
              onClick={() => toggleOption(option.label)}
              className="text-left justify-start h-auto p-2"
            >
              {option.label}
            </Button>
          </div>
        ))}
        <Button
          variant={selectedOptions.includes("Otro color") ? "default" : "outline"}
          size="sm"
          onClick={() => toggleOption("Otro color")}
          className="mt-2"
        >
          Otro
        </Button>
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
              {['Lisa', 'Punteada', 'Ulcerada', 'Fibrótica', 'Edematosa', 'Otro'].map((textura) => (
                <Button
                  key={textura}
                  variant={selectedOptions.includes(`textura-${textura}`) ? "default" : "outline"}
                  size="sm"
                  onClick={() => toggleOption(`textura-${textura}`)}
                >
                  {textura}
                </Button>
              ))}
            </div>
          </div>

          <div className="mt-4">
            <h4 className="font-medium mb-2">Contorno / forma:</h4>
            <div className="flex flex-wrap gap-2">
              {['Regular', 'Irregular', 'Aumentado de volumen', 'Recesión gingival', 'Presencia de pseudobolsas', 'Otro'].map((contorno) => (
                <Button
                  key={contorno}
                  variant={selectedOptions.includes(`contorno-${contorno}`) ? "default" : "outline"}
                  size="sm"
                  onClick={() => toggleOption(`contorno-${contorno}`)}
                >
                  {contorno}
                </Button>
              ))}
            </div>
          </div>

          <div className="mt-4">
            <h4 className="font-medium mb-2">Consistencia:</h4>
            <div className="flex flex-wrap gap-2">
              {['Firme', 'Blanda', 'Hiperplásica', 'Otro'].map((consistencia) => (
                <Button
                  key={consistencia}
                  variant={selectedOptions.includes(`consistencia-${consistencia}`) ? "default" : "outline"}
                  size="sm"
                  onClick={() => toggleOption(`consistencia-${consistencia}`)}
                >
                  {consistencia}
                </Button>
              ))}
            </div>
          </div>

          <div className="mt-4">
            <h4 className="font-medium mb-2">Sangrado al sondaje o palpación:</h4>
            <div className="flex flex-wrap gap-2">
              {['Sí', 'No', 'Otro'].map((sangrado) => (
                <Button
                  key={sangrado}
                  variant={selectedOptions.includes(`sangrado-${sangrado}`) ? "default" : "outline"}
                  size="sm"
                  onClick={() => toggleOption(`sangrado-${sangrado}`)}
                >
                  {sangrado}
                </Button>
              ))}
            </div>
          </div>

          <div className="mt-4">
            <h4 className="font-medium mb-2">Dolor o sensibilidad:</h4>
            <div className="flex flex-wrap gap-2">
              {['Sí', 'No', 'Otro'].map((dolor) => (
                <Button
                  key={dolor}
                  variant={selectedOptions.includes(`dolor-${dolor}`) ? "default" : "outline"}
                  size="sm"
                  onClick={() => toggleOption(`dolor-${dolor}`)}
                >
                  {dolor}
                </Button>
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
          <div className="flex flex-wrap gap-2">
            {['Paladar duro', 'Paladar blando'].map((division) => (
              <Button
                key={division}
                variant={selectedOptions.includes(`paladar-${division}`) ? "default" : "outline"}
                size="sm"
                onClick={() => toggleOption(`paladar-${division}`)}
              >
                {division}
              </Button>
            ))}
          </div>
        </div>

        <div className="border-t pt-4">
          <h3 className="text-lg font-semibold mb-4">{currentSection}</h3>
          
          <ColorSelector />

          <div className="mt-4">
            <h4 className="font-medium mb-2">Superficie:</h4>
            <div className="flex flex-wrap gap-2">
              {['Lisa', 'Rugosa (normal)', 'Ulcerada', 'Nodular', 'Placa blanca o roja', 'Otro'].map((superficie) => (
                <Button
                  key={superficie}
                  variant={selectedOptions.includes(`superficie-${superficie}`) ? "default" : "outline"}
                  size="sm"
                  onClick={() => toggleOption(`superficie-${superficie}`)}
                >
                  {superficie}
                </Button>
              ))}
            </div>
          </div>

          <div className="mt-4">
            <h4 className="font-medium mb-2">Elevación del paladar al decir "ah":</h4>
            <div className="flex flex-wrap gap-2">
              {['Simétrica', 'Asimétrica', 'Otro'].map((elevacion) => (
                <Button
                  key={elevacion}
                  variant={selectedOptions.includes(`elevacion-${elevacion}`) ? "default" : "outline"}
                  size="sm"
                  onClick={() => toggleOption(`elevacion-${elevacion}`)}
                >
                  {elevacion}
                </Button>
              ))}
            </div>
          </div>

          <div className="mt-4">
            <h4 className="font-medium mb-2">Presencia de masas, exostosis o torus palatino:</h4>
            <div className="flex flex-wrap gap-2">
              {['Sí', 'No', 'Otro'].map((masas) => (
                <Button
                  key={masas}
                  variant={selectedOptions.includes(`masas-${masas}`) ? "default" : "outline"}
                  size="sm"
                  onClick={() => toggleOption(`masas-${masas}`)}
                >
                  {masas}
                </Button>
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
        <div className="flex flex-wrap gap-2">
          {['Amígdalas', 'Úvula', 'Pared posterior faríngea', 'Pilar anterior y posterior', 'Otro'].map((estructura) => (
            <Button
              key={estructura}
              variant={selectedOptions.includes(`estructura-${estructura}`) ? "default" : "outline"}
              size="sm"
              onClick={() => toggleOption(`estructura-${estructura}`)}
            >
              {estructura}
            </Button>
          ))}
        </div>
      </div>

      <div>
        <h4 className="font-medium mb-2">Amígdalas:</h4>
        <div className="space-y-3">
          <div>
            <Label className="text-sm font-medium">Presencia:</Label>
            <div className="flex flex-wrap gap-2 mt-2">
              {['Sí', 'No', 'Otro'].map((presencia) => (
                <Button
                  key={presencia}
                  variant={selectedOptions.includes(`amigdalas-presencia-${presencia}`) ? "default" : "outline"}
                  size="sm"
                  onClick={() => toggleOption(`amigdalas-presencia-${presencia}`)}
                >
                  {presencia}
                </Button>
              ))}
            </div>
          </div>

          <div>
            <Label className="text-sm font-medium">Tamaño:</Label>
            <div className="flex flex-wrap gap-2 mt-2">
              {['0: Ausentes', 'I: Dentro de pilares', 'II: Hasta pilares', 'III: Más allá de pilares', 'IV: Se tocan (kissing tonsils)', 'Otro'].map((tamano) => (
                <Button
                  key={tamano}
                  variant={selectedOptions.includes(`tamano-${tamano}`) ? "default" : "outline"}
                  size="sm"
                  onClick={() => toggleOption(`tamano-${tamano}`)}
                >
                  {tamano}
                </Button>
              ))}
            </div>
          </div>

          <div>
            <Label className="text-sm font-medium">Secreción purulenta:</Label>
            <div className="flex flex-wrap gap-2 mt-2">
              {['Sí', 'No', 'Otro'].map((secrecion) => (
                <Button
                  key={secrecion}
                  variant={selectedOptions.includes(`secrecion-${secrecion}`) ? "default" : "outline"}
                  size="sm"
                  onClick={() => toggleOption(`secrecion-${secrecion}`)}
                >
                  {secrecion}
                </Button>
              ))}
            </div>
          </div>

          <div>
            <Label className="text-sm font-medium">Criptas visibles:</Label>
            <div className="flex flex-wrap gap-2 mt-2">
              {['Sí', 'No', 'Otro'].map((criptas) => (
                <Button
                  key={criptas}
                  variant={selectedOptions.includes(`criptas-${criptas}`) ? "default" : "outline"}
                  size="sm"
                  onClick={() => toggleOption(`criptas-${criptas}`)}
                >
                  {criptas}
                </Button>
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
            <div className="flex flex-wrap gap-2 mt-2">
              {['Normal', 'Edematosa', 'Desviada', 'Otro'].map((forma) => (
                <Button
                  key={forma}
                  variant={selectedOptions.includes(`forma-${forma}`) ? "default" : "outline"}
                  size="sm"
                  onClick={() => toggleOption(`forma-${forma}`)}
                >
                  {forma}
                </Button>
              ))}
            </div>
          </div>

          <div>
            <Label className="text-sm font-medium">Movimiento:</Label>
            <div className="flex flex-wrap gap-2 mt-2">
              {['Simétrico', 'Asimétrico', 'Otro'].map((movimiento) => (
                <Button
                  key={movimiento}
                  variant={selectedOptions.includes(`movimiento-${movimiento}`) ? "default" : "outline"}
                  size="sm"
                  onClick={() => toggleOption(`movimiento-${movimiento}`)}
                >
                  {movimiento}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div>
        <h4 className="font-medium mb-2">Pared posterior:</h4>
        <div className="flex flex-wrap gap-2">
          {['Eritematoso', 'Granular', 'Presencia de exudado o pus', 'Otro'].map((pared) => (
            <Button
              key={pared}
              variant={selectedOptions.includes(`pared-${pared}`) ? "default" : "outline"}
              size="sm"
              onClick={() => toggleOption(`pared-${pared}`)}
            >
              {pared}
            </Button>
          ))}
        </div>
      </div>

      <div>
        <h4 className="font-medium mb-2">Pilares:</h4>
        <div className="flex flex-wrap gap-2">
          {['Inflamación', 'Dolor a la palpación', 'Otro'].map((pilar) => (
            <Button
              key={pilar}
              variant={selectedOptions.includes(`pilar-${pilar}`) ? "default" : "outline"}
              size="sm"
              onClick={() => toggleOption(`pilar-${pilar}`)}
            >
              {pilar}
            </Button>
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
        <div className="flex flex-wrap gap-2">
          <Button
            variant={selectedOptions.includes("manchas-presentes") ? "default" : "outline"}
            size="sm"
            onClick={() => {
              toggleOption("manchas-presentes");
              setShowManchasTextarea(!selectedOptions.includes("manchas-presentes"));
            }}
          >
            Presente
          </Button>
          <Button
            variant={selectedOptions.includes("manchas-ausentes") ? "default" : "outline"}
            size="sm"
            onClick={() => toggleOption("manchas-ausentes")}
          >
            Ausente
          </Button>
          <Button
            variant={selectedOptions.includes("manchas-otro") ? "default" : "outline"}
            size="sm"
            onClick={() => toggleOption("manchas-otro")}
          >
            Otro
          </Button>
        </div>
        {showManchasTextarea && (
          <Textarea placeholder="Describe las manchas..." className="mt-2" />
        )}
      </div>

      <div>
        <h4 className="font-medium mb-2">Textura interna:</h4>
        <div className="flex flex-wrap gap-2">
          {['Lisa', 'Rugosa', 'Otro'].map((textura) => (
            <Button
              key={textura}
              variant={selectedOptions.includes(`mejillas-textura-${textura}`) ? "default" : "outline"}
              size="sm"
              onClick={() => toggleOption(`mejillas-textura-${textura}`)}
            >
              {textura}
            </Button>
          ))}
          <Button
            variant={selectedOptions.includes("lesiones") ? "default" : "outline"}
            size="sm"
            onClick={() => {
              toggleOption("lesiones");
              setShowLesionTextarea(!selectedOptions.includes("lesiones"));
            }}
          >
            Lesiones: úlceras, leucoplasia, liquen plano
          </Button>
        </div>
        {showLesionTextarea && (
          <Textarea placeholder="Describe la lesión..." className="mt-2" />
        )}
      </div>

      <div>
        <h4 className="font-medium mb-2">Línea alba o mordedura habitual:</h4>
        <div className="flex flex-wrap gap-2">
          {['Presente', 'Ausente', 'Otro'].map((linea) => (
            <Button
              key={linea}
              variant={selectedOptions.includes(`linea-alba-${linea}`) ? "default" : "outline"}
              size="sm"
              onClick={() => toggleOption(`linea-alba-${linea}`)}
            >
              {linea}
            </Button>
          ))}
        </div>
      </div>

      <div>
        <h4 className="font-medium mb-2">Conducto de Stenon (parótida):</h4>
        <div className="flex flex-wrap gap-2">
          {['Visible y permeable', 'Con secreción anormal', 'Otro'].map((stenon) => (
            <Button
              key={stenon}
              variant={selectedOptions.includes(`stenon-${stenon}`) ? "default" : "outline"}
              size="sm"
              onClick={() => toggleOption(`stenon-${stenon}`)}
            >
              {stenon}
            </Button>
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
        <div className="flex flex-wrap gap-2">
          {['Ulcerativas', 'Nodulares', 'Fibromas o hiperplasias', 'Otro'].map((lesion) => (
            <Button
              key={lesion}
              variant={selectedOptions.includes(`retromolar-lesion-${lesion}`) ? "default" : "outline"}
              size="sm"
              onClick={() => toggleOption(`retromolar-lesion-${lesion}`)}
            >
              {lesion}
            </Button>
          ))}
        </div>
      </div>

      <ColorSelector />

      <div className="mt-4">
        <h4 className="font-medium mb-2">Dolor o sensibilidad:</h4>
        <div className="flex flex-wrap gap-2">
          {['Sí', 'No', 'Otro'].map((dolor) => (
            <Button
              key={dolor}
              variant={selectedOptions.includes(`retromolar-dolor-${dolor}`) ? "default" : "outline"}
              size="sm"
              onClick={() => toggleOption(`retromolar-dolor-${dolor}`)}
            >
              {dolor}
            </Button>
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
        <div className="flex flex-wrap gap-2">
          {['Normal', 'Macroglosia', 'Atrófica', 'Otro'].map((tamano) => (
            <Button
              key={tamano}
              variant={selectedOptions.includes(`lengua-tamano-${tamano}`) ? "default" : "outline"}
              size="sm"
              onClick={() => toggleOption(`lengua-tamano-${tamano}`)}
            >
              {tamano}
            </Button>
          ))}
        </div>
      </div>

      <div>
        <h4 className="font-medium mb-2">Movilidad:</h4>
        <div className="flex flex-wrap gap-2">
          {['Conservada', 'Limitada', 'Otro'].map((movilidad) => (
            <Button
              key={movilidad}
              variant={selectedOptions.includes(`lengua-movilidad-${movilidad}`) ? "default" : "outline"}
              size="sm"
              onClick={() => toggleOption(`lengua-movilidad-${movilidad}`)}
            >
              {movilidad}
            </Button>
          ))}
        </div>
      </div>

      <div>
        <h4 className="font-medium mb-2">Superficie dorsal:</h4>
        <div className="flex flex-wrap gap-2">
          {['Filiformes normales', 'Lengua saburral', 'Lengua geográfica', 'Lengua fisurada', 'Leucoplasia / candidiasis', 'Otro'].map((superficie) => (
            <Button
              key={superficie}
              variant={selectedOptions.includes(`lengua-superficie-${superficie}`) ? "default" : "outline"}
              size="sm"
              onClick={() => toggleOption(`lengua-superficie-${superficie}`)}
            >
              {superficie}
            </Button>
          ))}
        </div>
      </div>

      <div>
        <h4 className="font-medium mb-2">Bordes laterales:</h4>
        <div className="flex flex-wrap gap-2">
          {['Ulceraciones', 'Mordisqueo', 'Indentaciones dentales', 'Lesiones blancas / rojas', 'Otro'].map((borde) => (
            <Button
              key={borde}
              variant={selectedOptions.includes(`lengua-borde-${borde}`) ? "default" : "outline"}
              size="sm"
              onClick={() => toggleOption(`lengua-borde-${borde}`)}
            >
              {borde}
            </Button>
          ))}
        </div>
      </div>

      <div>
        <h4 className="font-medium mb-2">Cara inferior y frenillo:</h4>
        <div className="flex flex-wrap gap-2">
          {['Varices', 'Lesiones', 'Limitación (anquiloglosia)', 'Otro'].map((cara) => (
            <Button
              key={cara}
              variant={selectedOptions.includes(`lengua-cara-${cara}`) ? "default" : "outline"}
              size="sm"
              onClick={() => toggleOption(`lengua-cara-${cara}`)}
            >
              {cara}
            </Button>
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
        <div className="flex flex-wrap gap-2">
          {['Glándulas sublinguales', 'Vasos sublinguales', 'Frenillo', 'Conducto de Wharton', 'Otro'].map((estructura) => (
            <Button
              key={estructura}
              variant={selectedOptions.includes(`piso-estructura-${estructura}`) ? "default" : "outline"}
              size="sm"
              onClick={() => toggleOption(`piso-estructura-${estructura}`)}
            >
              {estructura}
            </Button>
          ))}
        </div>
      </div>

      <ColorSelector />

      <div className="mt-4">
        <h4 className="font-medium mb-2">Secreción salival:</h4>
        <div className="flex flex-wrap gap-2">
          {['Normal', 'Aumentada', 'Disminuida', 'Purulenta', 'Otro'].map((secrecion) => (
            <Button
              key={secrecion}
              variant={selectedOptions.includes(`piso-secrecion-${secrecion}`) ? "default" : "outline"}
              size="sm"
              onClick={() => toggleOption(`piso-secrecion-${secrecion}`)}
            >
              {secrecion}
            </Button>
          ))}
        </div>
      </div>

      <div>
        <h4 className="font-medium mb-2">Vasos sublinguales:</h4>
        <div className="flex flex-wrap gap-2">
          {['Visibles finos (normal)', 'Engrosados', 'Con varicosidades', 'Otro'].map((vaso) => (
            <Button
              key={vaso}
              variant={selectedOptions.includes(`piso-vaso-${vaso}`) ? "default" : "outline"}
              size="sm"
              onClick={() => toggleOption(`piso-vaso-${vaso}`)}
            >
              {vaso}
            </Button>
          ))}
        </div>
      </div>

      <div>
        <h4 className="font-medium mb-2">Presencia de masas, ranulas, elevaciones:</h4>
        <div className="flex flex-wrap gap-2">
          <Button
            variant={selectedOptions.includes("piso-masa-no") ? "default" : "outline"}
            size="sm"
            onClick={() => toggleOption("piso-masa-no")}
          >
            No
          </Button>
          <Button
            variant={selectedOptions.includes("piso-masa-si") ? "default" : "outline"}
            size="sm"
            onClick={() => toggleOption("piso-masa-si")}
          >
            Sí (describir tamaño, localización)
          </Button>
          <Button
            variant={selectedOptions.includes("piso-masa-otro") ? "default" : "outline"}
            size="sm"
            onClick={() => toggleOption("piso-masa-otro")}
          >
            Otro
          </Button>
        </div>
      </div>

      <div>
        <h4 className="font-medium mb-2">Frenillo lingual:</h4>
        <div className="flex flex-wrap gap-2">
          {['Normal', 'Corto', 'Ulcerado', 'Otro'].map((frenillo) => (
            <Button
              key={frenillo}
              variant={selectedOptions.includes(`piso-frenillo-${frenillo}`) ? "default" : "outline"}
              size="sm"
              onClick={() => toggleOption(`piso-frenillo-${frenillo}`)}
            >
              {frenillo}
            </Button>
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