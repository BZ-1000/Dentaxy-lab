import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { FormDataState } from '@/types/historiaClinica';

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

  const renderEnciasForm = () => (
    <div className="space-y-4">
      <div>
        <h4 className="font-medium mb-2">Tipos:</h4>
        <div className="space-y-2">
          {['Encía libre', 'Encía adherida', 'Encía interproximal (papilar)'].map((tipo) => (
            <div key={tipo} className="flex items-center space-x-2">
              <Checkbox id={`encias-${tipo}`} />
              <Label htmlFor={`encias-${tipo}`}>{tipo}</Label>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h4 className="font-medium mb-2">Color:</h4>
        <RadioGroup>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="rosa-palido" id="rosa-palido" />
            <Label htmlFor="rosa-palido">🔴 Rosa pálido - Normal</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="rojo-intenso" id="rojo-intenso" />
            <Label htmlFor="rojo-intenso">🔴 Rojo intenso - Inflamación</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="palido" id="palido" />
            <Label htmlFor="palido">⚪ Pálido - Anemia</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="azulado" id="azulado" />
            <Label htmlFor="azulado">🔵 Azulado - Cianosis</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="pigmentado" id="pigmentado" />
            <Label htmlFor="pigmentado">⚫ Pigmentado - Melanosis, racial o tabaco</Label>
          </div>
        </RadioGroup>
      </div>

      <div>
        <h4 className="font-medium mb-2">Textura:</h4>
        <div className="space-y-2">
          {['Lisa', 'Punteada', 'Ulcerada', 'Fibrótica', 'Edematosa'].map((textura) => (
            <div key={textura} className="flex items-center space-x-2">
              <Checkbox id={`textura-${textura}`} />
              <Label htmlFor={`textura-${textura}`}>{textura}</Label>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h4 className="font-medium mb-2">Contorno / forma:</h4>
        <div className="space-y-2">
          {['Regular', 'Irregular', 'Aumentado de volumen', 'Recesión gingival', 'Presencia de pseudobolsas'].map((contorno) => (
            <div key={contorno} className="flex items-center space-x-2">
              <Checkbox id={`contorno-${contorno}`} />
              <Label htmlFor={`contorno-${contorno}`}>{contorno}</Label>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h4 className="font-medium mb-2">Consistencia:</h4>
        <RadioGroup>
          {['Firme', 'Blanda', 'Hiperplásica'].map((consistencia) => (
            <div key={consistencia} className="flex items-center space-x-2">
              <RadioGroupItem value={consistencia} id={`consistencia-${consistencia}`} />
              <Label htmlFor={`consistencia-${consistencia}`}>{consistencia}</Label>
            </div>
          ))}
        </RadioGroup>
      </div>

      <div>
        <h4 className="font-medium mb-2">Sangrado al sondaje o palpación:</h4>
        <RadioGroup>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="si" id="sangrado-si" />
            <Label htmlFor="sangrado-si">Sí</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="no" id="sangrado-no" />
            <Label htmlFor="sangrado-no">No</Label>
          </div>
        </RadioGroup>
      </div>

      <div>
        <h4 className="font-medium mb-2">Dolor o sensibilidad:</h4>
        <RadioGroup>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="si" id="dolor-si" />
            <Label htmlFor="dolor-si">Sí</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="no" id="dolor-no" />
            <Label htmlFor="dolor-no">No</Label>
          </div>
        </RadioGroup>
      </div>

      <div>
        <Label htmlFor="encias-otros">Otros hallazgos:</Label>
        <Textarea id="encias-otros" placeholder="Describe otros hallazgos..." />
      </div>
    </div>
  );

  const renderPaladarForm = () => (
    <div className="space-y-4">
      <div>
        <h4 className="font-medium mb-2">Divisiones:</h4>
        <div className="space-y-2">
          {['Paladar duro', 'Paladar blando'].map((division) => (
            <div key={division} className="flex items-center space-x-2">
              <Checkbox id={`paladar-${division}`} />
              <Label htmlFor={`paladar-${division}`}>{division}</Label>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h4 className="font-medium mb-2">Color:</h4>
        <RadioGroup>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="rosado" id="paladar-rosado" />
            <Label htmlFor="paladar-rosado">🔴 Rosado - Normal</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="eritematoso" id="paladar-eritematoso" />
            <Label htmlFor="paladar-eritematoso">🔴 Eritematoso - Irritación</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="palido" id="paladar-palido" />
            <Label htmlFor="paladar-palido">⚪ Pálido - Isquemia</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="pigmentado" id="paladar-pigmentado" />
            <Label htmlFor="paladar-pigmentado">⚫ Pigmentado - Fumadores / racial</Label>
          </div>
        </RadioGroup>
      </div>

      <div>
        <h4 className="font-medium mb-2">Superficie:</h4>
        <div className="space-y-2">
          {['Lisa', 'Rugosa (normal)', 'Ulcerada', 'Nodular', 'Placa blanca o roja'].map((superficie) => (
            <div key={superficie} className="flex items-center space-x-2">
              <Checkbox id={`superficie-${superficie}`} />
              <Label htmlFor={`superficie-${superficie}`}>{superficie}</Label>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h4 className="font-medium mb-2">Elevación del paladar blando al decir "ah":</h4>
        <RadioGroup>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="simetrica" id="elevacion-simetrica" />
            <Label htmlFor="elevacion-simetrica">Simétrica</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="asimetrica" id="elevacion-asimetrica" />
            <Label htmlFor="elevacion-asimetrica">Asimétrica</Label>
          </div>
        </RadioGroup>
      </div>

      <div>
        <h4 className="font-medium mb-2">Presencia de masas, exostosis o torus palatino:</h4>
        <RadioGroup>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="si" id="masas-si" />
            <Label htmlFor="masas-si">Sí</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="no" id="masas-no" />
            <Label htmlFor="masas-no">No</Label>
          </div>
        </RadioGroup>
      </div>

      <div>
        <Label htmlFor="paladar-otros">Otros hallazgos:</Label>
        <Textarea id="paladar-otros" placeholder="Describe otros hallazgos..." />
      </div>
    </div>
  );

  const renderOrofaringeForm = () => (
    <div className="space-y-4">
      <div>
        <h4 className="font-medium mb-2">Estructuras a evaluar:</h4>
        <div className="space-y-2">
          {['Amígdalas', 'Úvula', 'Pared posterior faríngea', 'Pilar anterior y posterior'].map((estructura) => (
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
            <RadioGroup>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="si" id="amigdalas-presencia-si" />
                <Label htmlFor="amigdalas-presencia-si">Sí</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="no" id="amigdalas-presencia-no" />
                <Label htmlFor="amigdalas-presencia-no">No</Label>
              </div>
            </RadioGroup>
          </div>

          <div>
            <Label className="text-sm font-medium">Tamaño:</Label>
            <RadioGroup>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="0" id="tamano-0" />
                <Label htmlFor="tamano-0">0: Ausentes</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="I" id="tamano-I" />
                <Label htmlFor="tamano-I">I: Dentro de pilares</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="II" id="tamano-II" />
                <Label htmlFor="tamano-II">II: Hasta pilares</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="III" id="tamano-III" />
                <Label htmlFor="tamano-III">III: Más allá de pilares</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="IV" id="tamano-IV" />
                <Label htmlFor="tamano-IV">IV: Se tocan (kissing tonsils)</Label>
              </div>
            </RadioGroup>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox id="secrecion-purulenta" />
            <Label htmlFor="secrecion-purulenta">Secreción purulenta</Label>
          </div>
          
          <div className="flex items-center space-x-2">
            <Checkbox id="criptas-visibles" />
            <Label htmlFor="criptas-visibles">Criptas visibles</Label>
          </div>
        </div>
      </div>

      <div>
        <h4 className="font-medium mb-2">Úvula:</h4>
        <div className="space-y-3">
          <div>
            <Label className="text-sm font-medium">Forma:</Label>
            <RadioGroup>
              {['Normal', 'Edematosa', 'Desviada'].map((forma) => (
                <div key={forma} className="flex items-center space-x-2">
                  <RadioGroupItem value={forma} id={`forma-${forma}`} />
                  <Label htmlFor={`forma-${forma}`}>{forma}</Label>
                </div>
              ))}
            </RadioGroup>
          </div>

          <div>
            <Label className="text-sm font-medium">Movimiento:</Label>
            <RadioGroup>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="simetrico" id="movimiento-simetrico" />
                <Label htmlFor="movimiento-simetrico">Simétrico</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="asimetrico" id="movimiento-asimetrico" />
                <Label htmlFor="movimiento-asimetrico">Asimétrico</Label>
              </div>
            </RadioGroup>
          </div>
        </div>
      </div>

      <div>
        <h4 className="font-medium mb-2">Pared posterior:</h4>
        <div className="space-y-2">
          {['Eritematoso', 'Granular', 'Presencia de exudado o pus'].map((pared) => (
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
          {['Inflamación', 'Dolor a la palpación'].map((pilar) => (
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
      <div>
        <h4 className="font-medium mb-2">Coloración:</h4>
        <div className="space-y-2">
          {['Rosado', 'Erosiones', 'Petequias', 'Manchas blancas o rojas'].map((color) => (
            <div key={color} className="flex items-center space-x-2">
              <Checkbox id={`mejillas-color-${color}`} />
              <Label htmlFor={`mejillas-color-${color}`}>{color}</Label>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h4 className="font-medium mb-2">Textura interna:</h4>
        <RadioGroup>
          {['Lisa', 'Rugosa', 'Lesiones: úlceras, leucoplasia, liquen plano'].map((textura) => (
            <div key={textura} className="flex items-center space-x-2">
              <RadioGroupItem value={textura} id={`mejillas-textura-${textura}`} />
              <Label htmlFor={`mejillas-textura-${textura}`}>{textura}</Label>
            </div>
          ))}
        </RadioGroup>
      </div>

      <div>
        <h4 className="font-medium mb-2">Línea alba o mordedura habitual:</h4>
        <RadioGroup>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="presente" id="linea-alba-presente" />
            <Label htmlFor="linea-alba-presente">Presente</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="ausente" id="linea-alba-ausente" />
            <Label htmlFor="linea-alba-ausente">Ausente</Label>
          </div>
        </RadioGroup>
      </div>

      <div>
        <h4 className="font-medium mb-2">Conducto de Stenon (parótida):</h4>
        <RadioGroup>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="visible" id="stenon-visible" />
            <Label htmlFor="stenon-visible">Visible y permeable</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="anormal" id="stenon-anormal" />
            <Label htmlFor="stenon-anormal">Con secreción anormal</Label>
          </div>
        </RadioGroup>
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
          {['Ulcerativas', 'Nodulares', 'Fibromas o hiperplasias'].map((lesion) => (
            <div key={lesion} className="flex items-center space-x-2">
              <Checkbox id={`retromolar-lesion-${lesion}`} />
              <Label htmlFor={`retromolar-lesion-${lesion}`}>{lesion}</Label>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h4 className="font-medium mb-2">Coloración:</h4>
        <RadioGroup>
          {['Normal', 'Eritematosa', 'Blanca', 'Mixta'].map((color) => (
            <div key={color} className="flex items-center space-x-2">
              <RadioGroupItem value={color} id={`retromolar-color-${color}`} />
              <Label htmlFor={`retromolar-color-${color}`}>{color}</Label>
            </div>
          ))}
        </RadioGroup>
      </div>

      <div>
        <h4 className="font-medium mb-2">Dolor o sensibilidad:</h4>
        <RadioGroup>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="si" id="retromolar-dolor-si" />
            <Label htmlFor="retromolar-dolor-si">Sí</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="no" id="retromolar-dolor-no" />
            <Label htmlFor="retromolar-dolor-no">No</Label>
          </div>
        </RadioGroup>
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
        <h4 className="font-medium mb-2">Divisiones:</h4>
        <div className="space-y-2">
          {['Dorso', 'Bordes laterales', 'Ventrículo (cara inferior)', 'Punta'].map((division) => (
            <div key={division} className="flex items-center space-x-2">
              <Checkbox id={`lengua-division-${division}`} />
              <Label htmlFor={`lengua-division-${division}`}>{division}</Label>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h4 className="font-medium mb-2">Tamaño:</h4>
        <RadioGroup>
          {['Normal', 'Macroglosia', 'Atrófica'].map((tamano) => (
            <div key={tamano} className="flex items-center space-x-2">
              <RadioGroupItem value={tamano} id={`lengua-tamano-${tamano}`} />
              <Label htmlFor={`lengua-tamano-${tamano}`}>{tamano}</Label>
            </div>
          ))}
        </RadioGroup>
      </div>

      <div>
        <h4 className="font-medium mb-2">Movilidad:</h4>
        <RadioGroup>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="conservada" id="movilidad-conservada" />
            <Label htmlFor="movilidad-conservada">Conservada</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="limitada" id="movilidad-limitada" />
            <Label htmlFor="movilidad-limitada">Limitada</Label>
          </div>
        </RadioGroup>
      </div>

      <div>
        <h4 className="font-medium mb-2">Superficie dorsal:</h4>
        <div className="space-y-2">
          {['Filiformes normales', 'Lengua saburral', 'Lengua geográfica', 'Lengua fisurada', 'Leucoplasia / candidiasis'].map((superficie) => (
            <div key={superficie} className="flex items-center space-x-2">
              <Checkbox id={`superficie-dorsal-${superficie}`} />
              <Label htmlFor={`superficie-dorsal-${superficie}`}>{superficie}</Label>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h4 className="font-medium mb-2">Bordes laterales:</h4>
        <div className="space-y-2">
          {['Ulceraciones', 'Mordisqueo', 'Indentaciones dentales', 'Lesiones blancas / rojas'].map((borde) => (
            <div key={borde} className="flex items-center space-x-2">
              <Checkbox id={`borde-lateral-${borde}`} />
              <Label htmlFor={`borde-lateral-${borde}`}>{borde}</Label>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h4 className="font-medium mb-2">Cara inferior y frenillo:</h4>
        <div className="space-y-2">
          {['Varices', 'Lesiones', 'Limitación (anquiloglosia)'].map((cara) => (
            <div key={cara} className="flex items-center space-x-2">
              <Checkbox id={`cara-inferior-${cara}`} />
              <Label htmlFor={`cara-inferior-${cara}`}>{cara}</Label>
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
        <h4 className="font-medium mb-2">Coloración:</h4>
        <div className="space-y-2">
          {['Normal', 'Erosiones', 'Lesiones pigmentadas'].map((color) => (
            <div key={color} className="flex items-center space-x-2">
              <Checkbox id={`piso-color-${color}`} />
              <Label htmlFor={`piso-color-${color}`}>{color}</Label>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h4 className="font-medium mb-2">Glándulas sublinguales / conducto de Wharton:</h4>
        <RadioGroup>
          {['Normal', 'Inflamado', 'Cálculo visible', 'Secreción purulenta'].map((glandula) => (
            <div key={glandula} className="flex items-center space-x-2">
              <RadioGroupItem value={glandula} id={`glandula-${glandula}`} />
              <Label htmlFor={`glandula-${glandula}`}>{glandula}</Label>
            </div>
          ))}
        </RadioGroup>
      </div>

      <div>
        <h4 className="font-medium mb-2">Movilidad de la mucosa:</h4>
        <RadioGroup>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="conservada" id="mucosa-conservada" />
            <Label htmlFor="mucosa-conservada">Conservada</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="dolorosa" id="mucosa-dolorosa" />
            <Label htmlFor="mucosa-dolorosa">Dolorosa</Label>
          </div>
        </RadioGroup>
      </div>

      <div>
        <Label htmlFor="piso-otros">Otros hallazgos:</Label>
        <Textarea id="piso-otros" placeholder="Describe otros hallazgos..." />
      </div>
    </div>
  );

  const renderFormContent = () => {
    switch (area) {
      case 'encias': return renderEnciasForm();
      case 'paladar': return renderPaladarForm();
      case 'orofaringe': return renderOrofaringeForm();
      case 'mejillas': return renderMejillasForm();
      case 'retromolar': return renderRetromolarForm();
      case 'lengua': return renderLenguaForm();
      case 'pisoBoca': return renderPisoBocaForm();
      default: return <div>Selecciona un área para examinar</div>;
    }
  };

  return (
    <Dialog open={!!area} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{getAreaTitle()}</DialogTitle>
        </DialogHeader>
        
        <div className="py-4">
          {renderFormContent()}
        </div>

        <div className="flex justify-end gap-2 pt-4 border-t">
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button onClick={onClose}>
            Guardar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ExamenIntrabucalForm;