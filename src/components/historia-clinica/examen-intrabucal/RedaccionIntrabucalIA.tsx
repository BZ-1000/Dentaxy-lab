import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Copy, CheckCircle, Loader2 } from "lucide-react";
import { FormDataState } from '@/types/historiaClinica';
import { toast } from "sonner";
import { AnimatedTextareaWithTyping } from "@/components/ui/AnimatedTextareaWithTyping";
import { generarRedaccionIntrabucal } from './redaccionLogic';

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

      const { newRedacciones: computedRedacciones, fullText } = generarRedaccionIntrabucal(formData);
      Object.assign(newRedacciones, computedRedacciones);

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
