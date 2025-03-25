
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { VoiceInput } from "@/components/ui/voice-input";
import { useState, useEffect } from "react";
import { Typewriter } from "@/components/ui/typewriter-text";

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
  const [showEvolucionPlaceholder, setShowEvolucionPlaceholder] = useState(true);
  const [showEstadoPlaceholder, setShowEstadoPlaceholder] = useState(true);
  
  useEffect(() => {
    if (evolucion) {
      setShowEvolucionPlaceholder(false);
    } else {
      setShowEvolucionPlaceholder(true);
    }
    
    if (estadoActual) {
      setShowEstadoPlaceholder(false);
    } else {
      setShowEstadoPlaceholder(true);
    }
  }, [evolucion, estadoActual]);

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
          <div className="relative w-[75%]">
            <Textarea
              value={evolucion}
              onChange={(e) => {
                onEvolucionChange(e.target.value);
                if (e.target.value) {
                  setShowEvolucionPlaceholder(false);
                } else {
                  setShowEvolucionPlaceholder(true);
                }
              }}
              placeholder="Describa el estado actual de los síntomas"
              className="min-h-[135px] max-h-[135px] w-full"
            />
            {showEvolucionPlaceholder && evolucion === "" && (
              <div className="absolute top-3 left-3 pointer-events-none text-gray-500">
                <Typewriter 
                  text={[
                    "El paciente presenta dolor agudo al masticar...",
                    "Actualmente hay sensibilidad al contacto con frío...",
                    "Se observa irritación gingival con sangrado leve..."
                  ]} 
                  speed={50} 
                  deleteSpeed={30} 
                  delay={2000} 
                  loop={true} 
                  className="text-gray-500 italic"
                />
              </div>
            )}
          </div>
          <div className="h-[40px]">
            <VoiceInput onTranscriptionComplete={onVoiceTranscription} />
          </div>
        </div>
      </div>

      <div>
        <Label>Evolución</Label>
        <div className="flex items-center gap-4">
          <div className="relative w-[75%]">
            <Textarea
              value={estadoActual}
              onChange={(e) => {
                onEstadoChange(e.target.value);
                if (e.target.value) {
                  setShowEstadoPlaceholder(false);
                } else {
                  setShowEstadoPlaceholder(true);
                }
              }}
              placeholder="Describa la evolución de los síntomas"
              className="min-h-[135px] max-h-[135px] w-full"
            />
            {showEstadoPlaceholder && estadoActual === "" && (
              <div className="absolute top-3 left-3 pointer-events-none text-gray-500">
                <Typewriter 
                  text={[
                    "El dolor comenzó hace tres días y ha ido aumentando...",
                    "Los síntomas empeoran durante la noche...",
                    "La hinchazón ha disminuido con los analgésicos pero el dolor persiste..."
                  ]} 
                  speed={50} 
                  deleteSpeed={30} 
                  delay={2000} 
                  loop={true} 
                  className="text-gray-500 italic"
                />
              </div>
            )}
          </div>
          <div className="h-[40px]">
            <VoiceInput onTranscriptionComplete={(text) => onEstadoChange(text)} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default InformacionPrincipal;
