import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { VoiceInput } from "@/components/ui/voice-input";

interface InformacionPrincipalProps {
  fechaAparicion: string;
  evolucion: string;
  estadoActual: string;
  onFechaChange: (value: string) => void;
  onEvolucionChange: (value: string) => void;
  onEstadoChange: (value: string) => void;
  onVoiceTranscription: (text: string) => void;
}

const InformacionPrincipal = ({
  fechaAparicion,
  evolucion,
  estadoActual,
  onFechaChange,
  onEvolucionChange,
  onEstadoChange,
  onVoiceTranscription
}: InformacionPrincipalProps) => {
  return (
    <div className="space-y-4">
      <div>
        <Label>Fecha de aparición del síntoma principal</Label>
        <Input
          type="date"
          value={fechaAparicion}
          onChange={(e) => onFechaChange(e.target.value)}
        />
      </div>

      <div>
        <Label>Evolución</Label>
        <div className="flex gap-2">
          <div className="flex-1">
            <Textarea
              value={evolucion}
              onChange={(e) => onEvolucionChange(e.target.value)}
              placeholder="Describa la evolución de los síntomas"
              className="min-h-[40px] max-h-[40px]"
            />
          </div>
          <div className="flex-shrink-0 w-20">
            <VoiceInput onTranscriptionComplete={onVoiceTranscription} />
          </div>
        </div>
      </div>

      <div>
        <Label>Estado Actual</Label>
        <Textarea
          value={estadoActual}
          onChange={(e) => onEstadoChange(e.target.value)}
          placeholder="Describa el estado actual de los síntomas"
        />
      </div>
    </div>
  );
};

export default InformacionPrincipal;