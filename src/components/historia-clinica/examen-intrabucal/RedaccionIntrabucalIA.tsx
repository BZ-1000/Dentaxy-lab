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
}

const RedaccionIntrabucalIA: React.FC<RedaccionIntrabucalIAProps> = ({ formData, onSwitchToForm, triggerRegenerate }) => {
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
      // Redacción común descriptiva sin la palabra "normal"
      newRedacciones.mejillas = 'Mucosa yugal de coloración rosada coral, textura lisa y aterciopelada al tacto. Superficie íntegra sin soluciones de continuidad. Secreción salival proveniente del conducto de Stenon presente y de características serosas transparentes. Ausencia de lesiones, placas o alteraciones del color. Simetría facial y mucosa preservada bilateralmente.';
      
      newRedacciones.lengua = 'Órgano lingual de dimensiones proporcionales al tamaño de la cavidad oral. Coloración rosada característica con presencia de papilas gustativas en superficie dorsal de distribución uniforme. Bordes laterales lisos sin improntas dentarias ni irregularidades. Cara ventral con venas linguales visibles de aspecto fisiológico. Movilidad libre en todos los planos del espacio sin restricciones. Ausencia de lesiones, ulceraciones o áreas de displasia.';
      
      newRedacciones.pisoBoca = 'Mucosa del piso de boca de tonalidad rosada, textura lisa y superficie íntegra sin alteraciones. Secreción salival proveniente de los conductos de Wharton abundante, clara y de características serosas. Frenillo lingual con inserción anatómica adecuada permitiendo movilidad completa del órgano lingual. Ausencia de lesiones, nódulos o áreas induradas a la palpación.';
      
      newRedacciones.encias = 'Tejido gingival de color rosa coral característico de encía sana. Contorno festoneado siguiendo la arquitectura de los cuellos dentarios. Consistencia firme y resiliente a la presión digital. Textura punteada tipo cáscara de naranja presente. Margen gingival bien definido y firmemente adherido a las superficies dentarias. Ausencia de sangrado al sondeo periodontal. Sin presencia de placa bacteriana o cálculo dental visible.';
      
      newRedacciones.paladar = 'Paladar duro de coloración rosada con rugosidades palatinas características bien definidas. Textura rugosa fisiológica. Bóveda palatina de profundidad adecuada. Paladar blando de tonalidad rosada, movilidad libre y simétrica durante la fonación. Rafe palatino central bien definido. Ausencia de petequias, torus palatino prominente o lesiones de cualquier naturaleza.';
      
      newRedacciones.orofaringe = 'Mucosa orofaríngea de coloración rosada homogénea. Superficie lisa sin irregularidades. Amígdalas palatinas de tamaño fisiológico, sin hipertrofia ni signos de inflamación aguda o crónica. Arcos palatoglosos y palatofaríngeos simétricos e íntegros. Ausencia de exudados, úlceras o lesiones aparentes. Sin dolor ni molestias referidas a la palpación.';
      
      newRedacciones.regionRetromolar = 'Región retromolar de coloración rosada uniforme. Textura lisa y homogénea. Superficie mucosa íntegra sin irregularidades, nódulos o áreas induradas. Triángulo retromolar sin alteraciones visibles. Ausencia de dolor a la palpación digital. Simetría bilateral preservada entre ambos lados.';
      
      newRedacciones.istmoFauces = 'Istmo de las fauces de amplitud adecuada permitiendo visualización completa de estructuras posteriores. Mucosa de coloración rosada homogénea. Úvula palatina íntegra, de longitud y grosor característicos, posicionada en la línea media. Pilares anteriores y posteriores del istmo simétricos e íntegros sin hipertrofia. Reflejo nauseoso presente y de intensidad fisiológica. Ausencia de signos inflamatorios o lesiones en la región.';
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
      } else {
        newRedacciones.mejillas = 'Mucosa yugal de coloración rosada coral, textura lisa y aterciopelada. Superficie íntegra sin lesiones. Secreción salival del conducto de Stenon presente y de características fisiológicas. Simetría preservada.';
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
      } else {
        newRedacciones.lengua = 'Órgano lingual de dimensiones proporcionales. Coloración rosada con papilas gustativas presentes. Bordes lisos sin improntas. Movilidad libre en todos los planos. Sin lesiones aparentes.';
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
      } else {
        newRedacciones.pisoBoca = 'Mucosa del piso de boca de tonalidad rosada, textura lisa y superficie íntegra. Secreción salival de conductos de Wharton abundante y clara. Frenillo lingual de movilidad libre.';
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
      } else {
        newRedacciones.encias = 'Tejido gingival de color rosa coral. Contorno festoneado, consistencia firme, textura punteada característica. Margen gingival bien definido y adherido. Sin sangrado al sondeo. Ausencia de placa o cálculo significativos.';
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
      } else {
        newRedacciones.paladar = 'Paladar duro de coloración rosada con rugosidades palatinas características. Paladar blando de movilidad libre y simétrica. Ausencia de lesiones o alteraciones.';
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
      } else {
        newRedacciones.orofaringe = 'Mucosa orofaríngea de coloración rosada homogénea. Amígdalas de tamaño fisiológico sin hipertrofia. Arcos palatinos simétricos e íntegros. Sin dolor ni lesiones aparentes.';
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
      } else {
        newRedacciones.regionRetromolar = 'Región retromolar de coloración rosada uniforme, textura lisa y superficie íntegra. Sin dolor a la palpación. Simetría bilateral preservada.';
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
      } else {
        newRedacciones.istmoFauces = 'Istmo de las fauces de amplitud adecuada. Mucosa de coloración rosada. Úvula palatina íntegra y centrada. Pilares simétricos. Reflejo nauseoso presente. Sin signos inflamatorios.';
      }
    }

    setRedacciones(newRedacciones);
    setIsGenerating(false);
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
