import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Copy, CheckCircle, Loader2 } from "lucide-react";
import { FormDataState } from '@/types/historiaClinica';
import { toast } from "sonner";

interface RedaccionIntrabucalIAProps {
  formData: FormDataState;
  onSwitchToForm: () => void;
}

const RedaccionIntrabucalIA: React.FC<RedaccionIntrabucalIAProps> = ({ formData, onSwitchToForm }) => {
  const [redaccion, setRedaccion] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    generateRedaccion();
  }, []);

  const generateRedaccion = async () => {
    setIsGenerating(true);
    
    // Simulate typing effect
    await new Promise(resolve => setTimeout(resolve, 500));
    
    let text = '';
    
    if (formData.examenIntrabucal?.sinHallazgos) {
      // Redacción común sin anomalías
      text = `EXAMEN INTRABUCAL\n\nA la exploración intrabucal se observan las siguientes características:\n\nMejillas: mucosa de color rosada, textura lisa y aterciopelada, superficie íntegra sin lesiones evidentes. Secreción salival en zona del conducto de Stenon presente y de características normales. Simetría facial preservada.\n\nLengua: de tamaño normal, color rosado, superficie dorsal con papilas presentes de aspecto normal. Bordes laterales íntegros sin improntas dentarias. Cara ventral sin alteraciones. Movilidad libre en todos los planos. Sin lesiones aparentes.\n\nPiso de boca: mucosa de color rosado, textura lisa, superficie íntegra. Secreción salival del conducto de Wharton abundante y clara. Frenillo lingual de movilidad libre.\n\nEncías: color rosa coral, contorno festoneado, consistencia firme, textura punteada característica de tejido sano. Margen gingival definido y adherido. No se observa sangrado al sondeo. Ausencia de placa o cálculo dental significativos.\n\nPaladar duro y blando: color rosado, textura rugosa característica del paladar duro, superficie íntegra. Movilidad del paladar blando libre y simétrica.\n\nOrofaringe: color rosado, superficie lisa. Amígdalas sin aumento de volumen, arcos palatoglosos y palatofaríngeos íntegros. Sin dolor a la palpación.\n\nRegión retromolar: color rosado, textura lisa, superficie íntegra. Sin dolor a la palpación. Simetría bilateral preservada.`;
    } else {
      // Generar redacción basada en los datos del formulario
      text = 'EXAMEN INTRABUCAL\n\nA la exploración intrabucal se observan las siguientes características:\n\n';
      
      // Mejillas
      if (formData.examenIntrabucal?.mejillas && !formData.examenIntrabucal.mejillas.sinHallazgos) {
        const m = formData.examenIntrabucal.mejillas;
        text += 'Mejillas: ';
        if (m.color) text += `mucosa de color ${m.color}, `;
        if (m.textura) text += `textura ${m.textura}, `;
        if (m.superficie) text += `superficie ${m.superficie}, `;
        if (m.lesionesPresentes && m.lesionesPresentes !== 'ninguna') text += `lesiones presentes: ${m.lesionesPresentes}, `;
        if (m.ubicacion) text += `ubicación: ${m.ubicacion}, `;
        if (m.simetria) text += `simetría ${m.simetria}, `;
        if (m.secrecionSalival) text += `secreción salival en zona de Stenon ${m.secrecionSalival}`;
        if (m.observaciones) text += `. ${m.observaciones}`;
        text += '.\n\n';
      } else {
        text += 'Mejillas: sin hallazgos patológicos.\n\n';
      }
      
      // Lengua
      if (formData.examenIntrabucal?.lengua && !formData.examenIntrabucal.lengua.sinHallazgos) {
        const l = formData.examenIntrabucal.lengua;
        text += 'Lengua: ';
        if (l.tamanio) text += `tamaño ${l.tamanio}, `;
        if (l.color) text += `color ${l.color}, `;
        if (l.superficieDorsal) text += `superficie dorsal ${l.superficieDorsal}, `;
        if (l.bordesLaterales) text += `bordes laterales ${l.bordesLaterales}, `;
        if (l.caraVentral) text += `cara ventral ${l.caraVentral}, `;
        if (l.movilidad) text += `movilidad ${l.movilidad}, `;
        if (l.lesiones && l.lesiones !== 'ninguna') text += `lesiones: ${l.lesiones}, `;
        if (l.sensacionReferida) text += `sensación referida: ${l.sensacionReferida}, `;
        if (l.simetria) text += `simetría ${l.simetria}`;
        if (l.observaciones) text += `. ${l.observaciones}`;
        text += '.\n\n';
      } else {
        text += 'Lengua: sin hallazgos patológicos.\n\n';
      }
      
      // Piso de boca
      if (formData.examenIntrabucal?.pisoBoca && !formData.examenIntrabucal.pisoBoca.sinHallazgos) {
        const p = formData.examenIntrabucal.pisoBoca;
        text += 'Piso de boca: ';
        if (p.color) text += `mucosa de color ${p.color}, `;
        if (p.textura) text += `textura ${p.textura}, `;
        if (p.superficie) text += `superficie ${p.superficie}, `;
        if (p.secrecionSalival) text += `secreción salival del conducto de Wharton ${p.secrecionSalival}, `;
        if (p.movilidadFrenillo) text += `frenillo lingual de movilidad ${p.movilidadFrenillo}, `;
        if (p.lesiones && p.lesiones !== 'ninguna') text += `lesiones: ${p.lesiones}, `;
        if (p.simetria) text += `simetría ${p.simetria}`;
        if (p.observaciones) text += `. ${p.observaciones}`;
        text += '.\n\n';
      } else {
        text += 'Piso de boca: sin hallazgos patológicos.\n\n';
      }
      
      // Encías
      if (formData.examenIntrabucal?.encias && !formData.examenIntrabucal.encias.sinHallazgos) {
        const e = formData.examenIntrabucal.encias;
        text += 'Encías: ';
        if (e.color) text += `color ${e.color}, `;
        if (e.contorno) text += `contorno ${e.contorno}, `;
        if (e.consistencia) text += `consistencia ${e.consistencia}, `;
        if (e.textura) text += `textura ${e.textura}, `;
        if (e.margenGingival) text += `margen gingival ${e.margenGingival}, `;
        if (e.sangrado) text += 'se observa sangrado al contacto, ';
        if (e.placaCalculo) text += `presencia de placa o cálculo: ${e.placaCalculo}, `;
        if (e.lesiones && e.lesiones !== 'ninguna') text += `lesiones: ${e.lesiones}, `;
        if (e.simetria) text += `simetría ${e.simetria}`;
        if (e.observaciones) text += `. ${e.observaciones}`;
        text += '.\n\n';
      } else {
        text += 'Encías: sin hallazgos patológicos.\n\n';
      }
      
      // Paladar
      if (formData.examenIntrabucal?.paladar && !formData.examenIntrabucal.paladar.sinHallazgos) {
        const pa = formData.examenIntrabucal.paladar;
        text += 'Paladar duro y blando: ';
        if (pa.color) text += `color ${pa.color}, `;
        if (pa.textura) text += `textura ${pa.textura}, `;
        if (pa.superficie) text += `superficie ${pa.superficie}, `;
        if (pa.movilidad) text += `movilidad del paladar blando ${pa.movilidad}, `;
        if (pa.lesiones && pa.lesiones !== 'ninguna') text += `lesiones: ${pa.lesiones}, `;
        if (pa.simetria) text += `simetría ${pa.simetria}`;
        if (pa.observaciones) text += `. ${pa.observaciones}`;
        text += '.\n\n';
      } else {
        text += 'Paladar duro y blando: sin hallazgos patológicos.\n\n';
      }
      
      // Orofaringe
      if (formData.examenIntrabucal?.orofaringe && !formData.examenIntrabucal.orofaringe.sinHallazgos) {
        const o = formData.examenIntrabucal.orofaringe;
        text += 'Orofaringe: ';
        if (o.color) text += `color ${o.color}, `;
        if (o.superficie) text += `superficie ${o.superficie}, `;
        if (o.amigdalas) text += `amígdalas ${o.amigdalas}, `;
        if (o.arcos) text += `arcos palatoglosos/palatofaríngeos ${o.arcos}, `;
        if (o.dolor) text += 'dolor o molestia presente, ';
        if (o.lesiones && o.lesiones !== 'ninguna') text += `lesiones: ${o.lesiones}, `;
        if (o.simetria) text += `simetría ${o.simetria}`;
        if (o.observaciones) text += `. ${o.observaciones}`;
        text += '.\n\n';
      } else {
        text += 'Orofaringe: sin hallazgos patológicos.\n\n';
      }
      
      // Región retromolar
      if (formData.examenIntrabucal?.regionRetromolar && !formData.examenIntrabucal.regionRetromolar.sinHallazgos) {
        const r = formData.examenIntrabucal.regionRetromolar;
        text += 'Región retromolar: ';
        if (r.color) text += `color ${r.color}, `;
        if (r.textura) text += `textura ${r.textura}, `;
        if (r.superficie) text += `superficie ${r.superficie}, `;
        if (r.lesiones && r.lesiones !== 'ninguna') text += `lesiones: ${r.lesiones}, `;
        if (r.simetria) text += `simetría ${r.simetria}, `;
        if (r.dolorPalpacion) text += 'dolor a la palpación presente';
        if (r.observaciones) text += `. ${r.observaciones}`;
        text += '.';
      } else {
        text += 'Región retromolar: sin hallazgos patológicos.';
      }
    }
    
    // Simulate typewriter effect
    for (let i = 0; i <= text.length; i++) {
      setRedaccion(text.slice(0, i));
      await new Promise(resolve => setTimeout(resolve, 5));
    }
    
    setIsGenerating(false);
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(redaccion);
      setCopied(true);
      toast.success('Redacción copiada al portapapeles');
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast.error('Error al copiar la redacción');
    }
  };

  return (
    <div className="space-y-4">
      <div className="relative">
        <div className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-950/30 dark:to-purple-950/30 p-6 rounded-lg border border-blue-200 dark:border-blue-800 min-h-[400px]">
          {isGenerating && (
            <div className="flex items-center gap-2 mb-4 text-blue-600 dark:text-blue-400">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span className="text-sm">Generando redacción...</span>
            </div>
          )}
          <pre className="whitespace-pre-wrap font-sans text-gray-800 dark:text-gray-200 leading-relaxed">
            {redaccion}
          </pre>
        </div>
        <Button
          onClick={handleCopy}
          variant="outline"
          size="icon"
          className="absolute top-4 right-4 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm hover:bg-white dark:hover:bg-gray-800"
          disabled={isGenerating}
        >
          {copied ? (
            <CheckCircle className="h-4 w-4 text-green-500 animate-scale-in" />
          ) : (
            <Copy className="h-4 w-4" />
          )}
        </Button>
      </div>

      <Button
        onClick={onSwitchToForm}
        variant="outline"
        className="w-full"
      >
        Volver al formulario
      </Button>
    </div>
  );
};

export default RedaccionIntrabucalIA;
