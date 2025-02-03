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
        <div className="relative">
          <Textarea
            value={evolucion}
            onChange={(e) => onEvolucionChange(e.target.value)}
            placeholder="Describa la evolución de los síntomas"
            className="min-h-[100px] max-h-[100px] pr-16"
          />
          <div className="absolute right-2 top-1/2 -translate-y-1/2 h-[40px]">
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