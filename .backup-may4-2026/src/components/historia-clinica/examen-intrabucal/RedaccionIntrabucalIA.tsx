import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Copy, CheckCircle, Loader2 } from "lucide-react";
import { FormDataState } from '@/types/historiaClinica';
import { toast } from "sonner";
import { AnimatedTextareaWithTyping } from "@/components/ui/AnimatedTextareaWithTyping";

interface RedaccionIntrabucalIAProps {
  formData: FormDataState;
  onSwitchToForm: () => void;
  triggerRegenerate?: number;
  onRedaccionGenerada?: (text: string) => void;
}

const RedaccionIntrabucalIA: React.FC<RedaccionIntrabucalIAProps> = ({ formData, onSwitchToForm, triggerRegenerate, onRedaccionGenerada }) => {
  const [redacciones, setRedacciones] = useState({
    mejillas: '',
    lengua: '',
    pisoBoca: '',
    encias: '',
    paladar: '',
    orofaringe: '',
    regionRetromolar: '',
    istmoFauces: ''
  });
  const [isGenerating, setIsGenerating] = useState(false);
  const [copiedSection, setCopiedSection] = useState<string | null>(null);

  useEffect(() => {
    generateRedacciones();
  }, [triggerRegenerate]);

  const generateRedacciones = async () => {
    setIsGenerating(true);
    await new Promise(resolve => setTimeout(resolve, 500));

    const newRedacciones = { ...redacciones };

    if (formData.examenIntrabucal?.sinHallazgos) {
      // Redacciones profesionales sin anomalías
      newRedacciones.mejillas = 'Mucosa yugal de color rosa coral uniforme, con superficie lisa, húmeda y brillante. No se observan áreas de eritema, ulceraciones, ni lesiones pigmentadas. La textura es blanda a la palpación, sin induraciones ni aumento de volumen. Conducto de Stenon visible, permeable y sin salida de secreción anómala. Sin evidencia de dolor o sensibilidad al tacto.';

      newRedacciones.lengua = 'Lengua de color rosa pálido con papilas filiformes y fungiformes bien definidas. Superficie húmeda, blanda y simétrica. Bordes sin improntas dentarias y movilidad conservada en todos los ejes. No se aprecian fisuras, placas, saburra adherente ni áreas de depapilación. Sin presencia de lesiones ulceradas ni dolor a la exploración.';

      newRedacciones.pisoBoca = 'Mucosa del piso de boca de color rosa brillante, con leve transparencia vascular característica. Superficie lisa, húmeda y sin evidencia de ulceraciones, masas o elevaciones. Conductos de Wharton visibles, permeables y con salida de saliva clara. Sin induración ni sensibilidad a la palpación.';

      newRedacciones.encias = 'Encía marginal, insertada e interdental de color rosa coral pálido, con puntilleo superficial bien definido. Contornos gingivales regulares, firmes y adaptados al cuello dentario. No se observa sangrado, edema ni recesión gingival. Ausencia de placa visible, cálculo o bolsas periodontales detectables. Tejido firme y sin respuesta dolorosa al tacto.';

      newRedacciones.paladar = 'Paladar duro de color rosa pálido con rugas palatinas bien delineadas y mucosa firmemente adherida. Paladar blando de color rosa salmón homogéneo, húmedo y con movilidad conservada. No se aprecian áreas de eritema, ulceraciones, petequias ni lesiones pigmentadas. Tejido sin signos de inflamación ni dolor al tacto.';

      newRedacciones.orofaringe = 'Mucosa orofaríngea de color rosa tenue y homogéneo, con superficie íntegra y húmeda. Amígdalas de tamaño proporcional, sin exudado ni hiperemia. Pilares amigdalinos simétricos, sin edema ni eritema. Reflejo nauseoso presente y simétrico. Sin evidencia de dolor, irritación o congestión faríngea.';

      newRedacciones.regionRetromolar = 'Región retromolar con mucosa de color rosa coral uniforme, superficie lisa y húmeda. No se observan ulceraciones, fibrosis ni abultamientos. Tejido blando, elástico y sin respuesta dolorosa a la palpación. Sin signos de irritación mecánica ni alteraciones inflamatorias.';

      newRedacciones.istmoFauces = 'Mucosa del istmo de las fauces de color rosa pálido y homogéneo, con superficie íntegra y brillante. Pilares anteriores y posteriores simétricos, sin aumento de volumen ni eritema. Amígdalas sin exudado, con criptas discretas y sin congestión visible. Movilidad conservada y sin dolor a la exploración ni durante la fonación o deglución.';
    } else {
      // Generar redacciones individuales basadas en selecciones
      // Mejillas
      if (formData.examenIntrabucal?.mejillas && !formData.examenIntrabucal.mejillas.sinHallazgos) {
        const m = formData.examenIntrabucal.mejillas;
        let texto = 'Mucosa yugal ';
        if (m.color) texto += `de coloración ${m.color}, `;
        if (m.textura) texto += `textura ${m.textura} `;
        if (m.superficie) texto += `con superficie ${m.superficie}. `;
        if (m.lesionesPresentes && m.lesionesPresentes !== 'ninguna') {
          texto += `Se observan lesiones compatibles con ${m.lesionesPresentes}`;
          if (m.ubicacion) texto += ` localizadas en ${m.ubicacion}`;
          texto += '. ';
        }
        if (m.secrecionSalival) texto += `Secreción salival del conducto de Stenon ${m.secrecionSalival}. `;
        if (m.simetria) texto += `Simetría ${m.simetria}.`;
        if (m.observaciones) texto += ` ${m.observaciones}`;
        newRedacciones.mejillas = texto.trim();
      } else if (formData.examenIntrabucal?.mejillas?.sinHallazgos) {
        newRedacciones.mejillas = 'Mucosa yugal de color rosa coral uniforme, con superficie lisa, húmeda y brillante. No se observan áreas de eritema, ulceraciones, ni lesiones pigmentadas. La textura es blanda a la palpación, sin induraciones ni aumento de volumen. Conducto de Stenon visible, permeable y sin salida de secreción anómala. Sin evidencia de dolor o sensibilidad al tacto.';
      } else {
        newRedacciones.mejillas = 'Mucosa yugal sin hallazgos clínicamente relevantes.';
      }

      // Lengua
      if (formData.examenIntrabucal?.lengua && !formData.examenIntrabucal.lengua.sinHallazgos) {
        const l = formData.examenIntrabucal.lengua;
        let texto = 'Órgano lingual ';
        if (l.tamanio) texto += `de tamaño ${l.tamanio}, `;
        if (l.color) texto += `coloración ${l.color}, `;
        if (l.superficieDorsal) texto += `superficie dorsal ${l.superficieDorsal}. `;
        if (l.bordesLaterales) texto += `Bordes laterales ${l.bordesLaterales}. `;
        if (l.caraVentral) texto += `Cara ventral ${l.caraVentral}. `;
        if (l.movilidad) texto += `Movilidad ${l.movilidad}. `;
        if (l.lesiones && l.lesiones !== 'ninguna') texto += `Lesiones presentes: ${l.lesiones}. `;
        if (l.sensacionReferida) texto += `Sensación referida: ${l.sensacionReferida}. `;
        if (l.simetria) texto += `Simetría ${l.simetria}.`;
        if (l.observaciones) texto += ` ${l.observaciones}`;
        newRedacciones.lengua = texto.trim();
      } else if (formData.examenIntrabucal?.lengua?.sinHallazgos) {
        newRedacciones.lengua = 'Lengua de color rosa pálido con papilas filiformes y fungiformes bien definidas. Superficie húmeda, blanda y simétrica. Bordes sin improntas dentarias y movilidad conservada en todos los ejes. No se aprecian fisuras, placas, saburra adherente ni áreas de depapilación. Sin presencia de lesiones ulceradas ni dolor a la exploración.';
      } else {
        newRedacciones.lengua = 'Órgano lingual sin hallazgos clínicamente relevantes.';
      }

      // Piso de boca
      if (formData.examenIntrabucal?.pisoBoca && !formData.examenIntrabucal.pisoBoca.sinHallazgos) {
        const p = formData.examenIntrabucal.pisoBoca;
        let texto = 'Mucosa del piso de boca ';
        if (p.color) texto += `de tonalidad ${p.color}, `;
        if (p.textura) texto += `textura ${p.textura}, `;
        if (p.superficie) texto += `superficie ${p.superficie}. `;
        if (p.secrecionSalival) texto += `Secreción salival de conductos de Wharton ${p.secrecionSalival}. `;
        if (p.movilidadFrenillo) texto += `Frenillo lingual con movilidad ${p.movilidadFrenillo}. `;
        if (p.lesiones && p.lesiones !== 'ninguna') texto += `Lesiones: ${p.lesiones}. `;
        if (p.simetria) texto += `Simetría ${p.simetria}.`;
        if (p.observaciones) texto += ` ${p.observaciones}`;
        newRedacciones.pisoBoca = texto.trim();
      } else if (formData.examenIntrabucal?.pisoBoca?.sinHallazgos) {
        newRedacciones.pisoBoca = 'Mucosa del piso de boca de color rosa brillante, con leve transparencia vascular característica. Superficie lisa, húmeda y sin evidencia de ulceraciones, masas o elevaciones. Conductos de Wharton visibles, permeables y con salida de saliva clara. Sin induración ni sensibilidad a la palpación.';
      } else {
        newRedacciones.pisoBoca = 'Piso de boca sin hallazgos clínicamente relevantes.';
      }

      // Encías
      if (formData.examenIntrabucal?.encias && !formData.examenIntrabucal.encias.sinHallazgos) {
        const e = formData.examenIntrabucal.encias;
        let texto = 'Tejido gingival ';
        if (e.color) texto += `de color ${e.color}, `;
        if (e.contorno) texto += `contorno ${e.contorno}, `;
        if (e.consistencia) texto += `consistencia ${e.consistencia}, `;
        if (e.textura) texto += `textura ${e.textura}. `;
        if (e.margenGingival) texto += `Margen gingival ${e.margenGingival}. `;
        if (e.sangrado) texto += 'Se observa sangrado al contacto. ';
        if (e.placaCalculo) texto += `Presencia de placa o cálculo: ${e.placaCalculo}. `;
        if (e.lesiones && e.lesiones !== 'ninguna') texto += `Lesiones: ${e.lesiones}. `;
        if (e.simetria) texto += `Simetría ${e.simetria}.`;
        if (e.observaciones) texto += ` ${e.observaciones}`;
        newRedacciones.encias = texto.trim();
      } else if (formData.examenIntrabucal?.encias?.sinHallazgos) {
        newRedacciones.encias = 'Encía marginal, insertada e interdental de color rosa coral pálido, con puntilleo superficial bien definido. Contornos gingivales regulares, firmes y adaptados al cuello dentario. No se observa sangrado, edema ni recesión gingival. Ausencia de placa visible, cálculo o bolsas periodontales detectables. Tejido firme y sin respuesta dolorosa al tacto.';
      } else {
        newRedacciones.encias = 'Tejido gingival sin hallazgos clínicamente relevantes.';
      }

      // Paladar
      if (formData.examenIntrabucal?.paladar && !formData.examenIntrabucal.paladar.sinHallazgos) {
        const pa = formData.examenIntrabucal.paladar;
        let texto = 'Paladar ';
        if (pa.color) texto += `de coloración ${pa.color}, `;
        if (pa.textura) texto += `textura ${pa.textura}, `;
        if (pa.superficie) texto += `superficie ${pa.superficie}. `;
        if (pa.movilidad) texto += `Movilidad del paladar blando ${pa.movilidad}. `;
        if (pa.lesiones && pa.lesiones !== 'ninguna') texto += `Lesiones: ${pa.lesiones}. `;
        if (pa.simetria) texto += `Simetría ${pa.simetria}.`;
        if (pa.observaciones) texto += ` ${pa.observaciones}`;
        newRedacciones.paladar = texto.trim();
      } else if (formData.examenIntrabucal?.paladar?.sinHallazgos) {
        newRedacciones.paladar = 'Paladar duro de color rosa pálido con rugas palatinas bien delineadas y mucosa firmemente adherida. Paladar blando de color rosa salmón homogéneo, húmedo y con movilidad conservada. No se aprecian áreas de eritema, ulceraciones, petequias ni lesiones pigmentadas. Tejido sin signos de inflamación ni dolor al tacto.';
      } else {
        newRedacciones.paladar = 'Paladar sin hallazgos clínicamente relevantes.';
      }

      // Orofaringe
      if (formData.examenIntrabucal?.orofaringe && !formData.examenIntrabucal.orofaringe.sinHallazgos) {
        const o = formData.examenIntrabucal.orofaringe;
        let texto = 'Mucosa orofaríngea ';
        if (o.color) texto += `de coloración ${o.color}, `;
        if (o.superficie) texto += `superficie ${o.superficie}. `;
        if (o.amigdalas) texto += `Amígdalas palatinas ${o.amigdalas}. `;
        if (o.arcos) texto += `Arcos palatinos ${o.arcos}. `;
        if (o.dolor) texto += 'Se refiere dolor o molestia a la palpación. ';
        if (o.lesiones && o.lesiones !== 'ninguna') texto += `Lesiones: ${o.lesiones}. `;
        if (o.simetria) texto += `Simetría ${o.simetria}.`;
        if (o.observaciones) texto += ` ${o.observaciones}`;
        newRedacciones.orofaringe = texto.trim();
      } else if (formData.examenIntrabucal?.orofaringe?.sinHallazgos) {
        newRedacciones.orofaringe = 'Mucosa orofaríngea de color rosa tenue y homogéneo, con superficie íntegra y húmeda. Amígdalas de tamaño proporcional, sin exudado ni hiperemia. Pilares amigdalinos simétricos, sin edema ni eritema. Reflejo nauseoso presente y simétrico. Sin evidencia de dolor, irritación o congestión faríngea.';
      } else {
        newRedacciones.orofaringe = 'Orofaringe sin hallazgos clínicamente relevantes.';
      }

      // Región retromolar
      if (formData.examenIntrabucal?.regionRetromolar && !formData.examenIntrabucal.regionRetromolar.sinHallazgos) {
        const r = formData.examenIntrabucal.regionRetromolar;
        let texto = 'Región retromolar ';
        if (r.color) texto += `de coloración ${r.color}, `;
        if (r.textura) texto += `textura ${r.textura}, `;
        if (r.superficie) texto += `superficie ${r.superficie}. `;
        if (r.lesiones && r.lesiones !== 'ninguna') texto += `Lesiones: ${r.lesiones}. `;
        if (r.dolorPalpacion) texto += 'Dolor presente a la palpación. ';
        if (r.simetria) texto += `Simetría ${r.simetria}.`;
        if (r.observaciones) texto += ` ${r.observaciones}`;
        newRedacciones.regionRetromolar = texto.trim();
      } else if (formData.examenIntrabucal?.regionRetromolar?.sinHallazgos) {
        newRedacciones.regionRetromolar = 'Región retromolar con mucosa de color rosa coral uniforme, superficie lisa y húmeda. No se observan ulceraciones, fibrosis ni abultamientos. Tejido blando, elástico y sin respuesta dolorosa a la palpación. Sin signos de irritación mecánica ni alteraciones inflamatorias.';
      } else {
        newRedacciones.regionRetromolar = 'Región retromolar sin hallazgos clínicamente relevantes.';
      }

      // Istmo de las fauces
      if (formData.examenIntrabucal?.istmoFauces && !formData.examenIntrabucal.istmoFauces.sinHallazgos) {
        const i = formData.examenIntrabucal.istmoFauces;
        let texto = 'Istmo de las fauces ';
        if (i.amplitud) texto += `de amplitud ${i.amplitud}, `;
        if (i.colorMucosa) texto += `mucosa de coloración ${i.colorMucosa}. `;
        if (i.uvula) texto += `Úvula palatina ${i.uvula}. `;
        if (i.pilares) texto += `Pilares del istmo ${i.pilares}. `;
        if (i.reflejoNauseoso) texto += `Reflejo nauseoso ${i.reflejoNauseoso}. `;
        if (i.inflamacion) texto += 'Se observan signos de inflamación. ';
        if (i.simetria) texto += `Simetría ${i.simetria}.`;
        if (i.observaciones) texto += ` ${i.observaciones}`;
        newRedacciones.istmoFauces = texto.trim();
      } else if (formData.examenIntrabucal?.istmoFauces?.sinHallazgos) {
        newRedacciones.istmoFauces = 'Mucosa del istmo de las fauces de color rosa pálido y homogéneo, con superficie íntegra y brillante. Pilares anteriores y posteriores simétricos, sin aumento de volumen ni eritema. Amígdalas sin exudado, con criptas discretas y sin congestión visible. Movilidad conservada y sin dolor a la exploración ni durante la fonación o deglución.';
      } else {
        newRedacciones.istmoFauces = 'Istmo de las fauces sin hallazgos clínicamente relevantes.';
      }
    }

    setRedacciones(newRedacciones);
    setIsGenerating(false);

    if (onRedaccionGenerada) {
      const fullText = `EXAMEN INTRABUCAL

Mejillas: ${newRedacciones.mejillas}

Lengua: ${newRedacciones.lengua}

Piso de boca: ${newRedacciones.pisoBoca}

Encías: ${newRedacciones.encias}

Paladar duro y blando: ${newRedacciones.paladar}

Orofaringe: ${newRedacciones.orofaringe}

Región retromolar: ${newRedacciones.regionRetromolar}

Istmo de las fauces: ${newRedacciones.istmoFauces}`;
      onRedaccionGenerada(fullText);
    }
  };

  const handleCopySection = async (section: string, text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedSection(section);
      toast.success(`${section} copiado al portapapeles`);
      setTimeout(() => setCopiedSection(null), 2000);
    } catch (error) {
      toast.error('Error al copiar');
    }
  };

  const handleCopyAll = async () => {
    const fullText = `EXAMEN INTRABUCAL

Mejillas: ${redacciones.mejillas}

Lengua: ${redacciones.lengua}

Piso de boca: ${redacciones.pisoBoca}

Encías: ${redacciones.encias}

Paladar duro y blando: ${redacciones.paladar}

Orofaringe: ${redacciones.orofaringe}

Región retromolar: ${redacciones.regionRetromolar}

Istmo de las fauces: ${redacciones.istmoFauces}`;

    try {
      await navigator.clipboard.writeText(fullText);
      toast.success('Redacción completa copiada');
    } catch (error) {
      toast.error('Error al copiar');
    }
  };

  const sections = [
    { key: 'mejillas', label: 'Mejillas', color: 'blue' },
    { key: 'lengua', label: 'Lengua', color: 'pink' },
    { key: 'pisoBoca', label: 'Piso de Boca', color: 'purple' },
    { key: 'encias', label: 'Encías', color: 'red' },
    { key: 'paladar', label: 'Paladar Duro y Blando', color: 'green' },
    { key: 'orofaringe', label: 'Orofaringe', color: 'yellow' },
    { key: 'regionRetromolar', label: 'Región Retromolar', color: 'cyan' },
    { key: 'istmoFauces', label: 'Istmo de las Fauces', color: 'teal' }
  ];

  return (
    <div className="space-y-4">
      {isGenerating && (
        <div className="flex items-center gap-2 mb-4 text-blue-600 dark:text-blue-400">
          <Loader2 className="w-4 h-4 animate-spin" />
          <span className="text-sm">Generando redacciones...</span>
        </div>
      )}

      <div className="space-y-4">
        {sections.map(({ key, label, color }) => (
          <div key={key} className={`bg-${color}-50/30 dark:bg-${color}-950/20 p-4 rounded-lg border border-${color}-200 dark:border-${color}-800`}>
            <div className="flex items-center justify-between mb-2">
              <Label className={`text-sm font-semibold text-${color}-900 dark:text-${color}-100`}>
                {label}
              </Label>
              <Button
                onClick={() => handleCopySection(label, redacciones[key as keyof typeof redacciones])}
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                disabled={isGenerating}
              >
                {copiedSection === label ? (
                  <CheckCircle className="h-4 w-4 text-green-500" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </Button>
            </div>
            <AnimatedTextareaWithTyping
              content={redacciones[key as keyof typeof redacciones]}
              className="bg-white dark:bg-gray-900"
              speed={8}
              readOnly
            />
          </div>
        ))}
      </div>

      <div className="flex gap-3 pt-4">
        <Button
          onClick={handleCopyAll}
          className="flex-1"
          disabled={isGenerating}
        >
          <Copy className="w-4 h-4 mr-2" />
          Copiar Todo
        </Button>
        <Button
          onClick={onSwitchToForm}
          variant="outline"
          className="flex-1"
        >
          Volver al formulario
        </Button>
      </div>
    </div>
  );
};

export default RedaccionIntrabucalIA;
