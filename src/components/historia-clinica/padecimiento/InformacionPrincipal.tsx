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
    <div className="space-y-6">
      <div>
        <Label>Fecha de aparición del síntoma principal</Label>
        <Input
          type="date"
          value={fechaAparicion}
          onChange={(e) => onFechaChange(e.target.value)}
          className="w-48"
        />
      </div>

      <div>
        <Label>Estado Actual</Label>
        <div className="flex items-center gap-4">
          <Textarea
            value={estadoActual}
            onChange={(e) => onEstadoChange(e.target.value)}
            placeholder="Describa el estado actual de los síntomas"
            className="min-h-[135px] max-h-[135px] w-[75%]"
          />
          <div className="h-[40px]">
            <VoiceInput onTranscriptionComplete={(text) => onEstadoChange(text)} />
          </div>
        </div>
      </div>

      <div>
        <Label>Evolución</Label>
        <div className="flex items-center gap-4">
          <Textarea
            value={evolucion}
            onChange={(e) => onEvolucionChange(e.target.value)}
            placeholder="Describa la evolución de los síntomas"
            className="min-h-[135px] max-h-[135px] w-[75%]"
          />
          <div className="h-[40px]">
            <VoiceInput onTranscriptionComplete={(text) => onEvolucionChange(text)} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default InformacionPrincipal;