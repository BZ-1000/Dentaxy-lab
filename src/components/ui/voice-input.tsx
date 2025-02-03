import { AIVoiceInput } from "./ai-voice-input";
import { useToast } from "@/hooks/use-toast";

interface VoiceInputProps {
  onTranscriptionComplete?: (text: string) => void;
}

export const VoiceInput = ({ onTranscriptionComplete }: VoiceInputProps) => {
  const { toast } = useToast();

  const handleStart = () => {
    toast({
      title: "Grabación iniciada",
      description: "Comienza a hablar...",
    });
  };

  const handleStop = () => {
    toast({
      title: "Grabación finalizada",
      description: "Procesando el audio...",
    });
  };

  return (
    <div className="ml-2">
      <AIVoiceInput
        onStart={handleStart}
        onStop={handleStop}
        onTranscriptionComplete={onTranscriptionComplete}
      />
    </div>
  );
};