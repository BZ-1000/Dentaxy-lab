import React from 'react';
import { FormDataState } from '@/types/historiaClinica';
import { Textarea } from "@/components/ui/textarea";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Calendar as CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface AntecedentesHemorragicosProps {
  formData: FormDataState;
  handleAntecedenteHemorragicoChange: (field: string, value: any) => void;
  onRedaccionGenerada?: (text: string) => void;
  onToggleViewMode?: () => void;
}

// ── Botón Sí/No reutilizable ──────────────────────────────────────────────────
const BoolBtn = ({ active, label, onClick }: { active: boolean; label: string; onClick: () => void }) => (
  <button
    type="button"
    onClick={onClick}
    className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${
      active
        ? 'bg-zinc-800 text-white shadow-sm'
        : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-700 hover:border-gray-400'
    }`}
  >
    {label}
  </button>
);

// ── Fila de pregunta ──────────────────────────────────────────────────────────
const PreguntaYN = ({
  label,
  value,
  onChange,
}: {
  label: string;
  value: boolean | undefined;
  onChange: (v: boolean) => void;
}) => (
  <div>
    <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{label}</h3>
    <div className="flex gap-3">
      <BoolBtn active={value === true}  label="Sí" onClick={() => onChange(true)}  />
      <BoolBtn active={value === false} label="No" onClick={() => onChange(false)} />
    </div>
  </div>
);

const AntecedentesHemorragicos: React.FC<AntecedentesHemorragicosProps> = ({
  formData,
  handleAntecedenteHemorragicoChange,
  onRedaccionGenerada,
  onToggleViewMode,
}) => {
  const h = formData.antecedentesHemorragicos;

  const set = (field: string, value: any) =>
    handleAntecedenteHemorragicoChange(field, value);

  // ── Motor de redacción determinista ──────────────────────────────────────
  const generateRedaccion = () => {
    let parts: string[] = [];

    // Transfusiones
    if (h.transfusionPrevia === true) {
      let t = 'El paciente refiere haber recibido transfusiones sanguíneas o hemoderivados.';
      if (h.motivoTransfusion)  t += ` Motivo: ${h.motivoTransfusion}.`;
      if (h.fechaTransfusion) {
        try {
          const dateObj = new Date(h.fechaTransfusion);
          // Si es una fecha válida, formatearla. Si no, dejar el texto original (ej. si vino de voz)
          if (!isNaN(dateObj.getTime())) {
            const formattedDate = format(dateObj, "PPP", { locale: es });
            t += ` Fecha aproximada: ${formattedDate}.`;
          } else {
            t += ` Fecha aproximada: ${h.fechaTransfusion}.`;
          }
        } catch (e) {
          t += ` Fecha aproximada: ${h.fechaTransfusion}.`;
        }
      }
      parts.push(t);
    } else {
      parts.push('El paciente niega antecedentes de transfusiones sanguíneas o hemoderivados.');
    }

    // Sangrado prolongado
    if (h.sangradoProlongado === true) {
      parts.push('Refiere episodios de sangrado prolongado ante heridas o procedimientos, lo que puede ser indicativo de alteración en la hemostasia primaria o secundaria.');
    } else {
      parts.push('Niega episodios de sangrado prolongado ante heridas o procedimientos.');
    }

    // Hematomas
    if (h.hematomas === true) {
      parts.push('Presenta tendencia a desarrollar hematomas sin causa aparente o ante traumatismos menores, hallazgo clínicamente relevante previo a cualquier procedimiento invasivo.');
    } else {
      parts.push('Niega tendencia a desarrollar hematomas espontáneos o ante traumatismos menores.');
    }

    // Hemorragias espontáneas
    if (h.hemorragiasEspontaneas === true) {
      parts.push('Ha experimentado hemorragias espontáneas (epistaxis, sangrado gingival, etc.) sin causa aparente.');
    } else {
      parts.push('Niega hemorragias espontáneas de mucosas u otras localizaciones.');
    }

    // Coagulopatía
    if ((h as any).coagulopatia === true) {
      parts.push('Cuenta con diagnóstico de trastorno de la coagulación (hemofilia, enfermedad de Von Willebrand u otro). Se requiere protocolo especial de hemostasia previo al procedimiento dental.');
    } else {
      parts.push('Niega diagnóstico de coagulopatía o trastorno de la coagulación.');
    }

    // Detalles adicionales
    if (h.detallesAdicionales) {
      parts.push(`Información adicional relevante: ${h.detallesAdicionales}`);
    }

    const content = parts.join(' ');
    onRedaccionGenerada?.(content);
  };

  return (
    <div
      className="max-w-4xl mx-auto"
      data-section-name="antecedentesHemorragicos"
      data-formulario-section="antecedentes-hemorragicos"
    >
      <div className="p-6 space-y-6">

        {/* 1. Transfusiones */}
        <PreguntaYN
          label="Transfusiones — ¿Le han transfundido sangre o algún derivado de la misma?"
          value={h.transfusionPrevia}
          onChange={(v) => set('transfusionPrevia', v)}
        />

        {h.transfusionPrevia === true && (
          <div className="pl-4 border-l-2 border-gray-100 space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Motivo de la transfusión</label>
              <div className="flex items-center gap-2">
                <Textarea
                  value={h.motivoTransfusion || ''}
                  onChange={e => set('motivoTransfusion', e.target.value)}
                  placeholder="Especifique el motivo"
                  className="min-h-[60px] flex-1"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Fecha aproximada</label>
              <div className="flex items-center gap-2">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full justify-start text-left font-normal h-12 bg-white dark:bg-zinc-900 border-gray-200 dark:border-zinc-800",
                        !h.fechaTransfusion && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {h.fechaTransfusion ? (
                        format(new Date(h.fechaTransfusion), "PPP", { locale: es })
                      ) : (
                        <span>Seleccione una fecha</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={h.fechaTransfusion ? new Date(h.fechaTransfusion) : undefined}
                      onSelect={(date) => set('fechaTransfusion', date ? date.toISOString() : '')}
                      initialFocus
                      locale={es}
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
          </div>
        )}

        {/* 2. Sangrado prolongado */}
        <PreguntaYN
          label="Sangrado prolongado — ¿Presenta episodios de sangrado prolongado ante heridas o procedimientos?"
          value={h.sangradoProlongado as unknown as boolean}
          onChange={(v) => set('sangradoProlongado', v)}
        />

        {/* 3. Hematomas */}
        <PreguntaYN
          label="Hematomas espontáneos — ¿Tiene tendencia a desarrollar hematomas sin causa aparente o ante traumatismos menores?"
          value={h.hematomas as unknown as boolean}
          onChange={(v) => set('hematomas', v)}
        />

        {/* 4. Hemorragias espontáneas */}
        <PreguntaYN
          label="Hemorragias espontáneas — ¿Ha experimentado sangrados sin causa aparente (nariz, encías, etc.)?"
          value={h.hemorragiasEspontaneas as unknown as boolean}
          onChange={(v) => set('hemorragiasEspontaneas', v)}
        />

        {/* 5. Coagulopatía */}
        <PreguntaYN
          label="Coagulopatía diagnosticada — ¿Tiene diagnóstico de algún trastorno de la coagulación (hemofilia, Von Willebrand, etc.)?"
          value={(h as any).coagulopatia}
          onChange={(v) => set('coagulopatia', v)}
        />

        {/* Información adicional */}
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">
            Información adicional sobre antecedentes hemorrágicos
          </label>
          <div className="flex items-center gap-2">
            <Textarea
              value={h.detallesAdicionales || ''}
              onChange={e => set('detallesAdicionales', e.target.value)}
              placeholder="Proporcione cualquier otra información relevante"
              className="min-h-[70px] flex-1"
            />
          </div>
        </div>

        <button type="button" className="hidden" onClick={generateRedaccion}>
          Generar redacción
        </button>
      </div>
    </div>
  );
};

export default AntecedentesHemorragicos;
