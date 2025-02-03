import { AIVoiceInput } from "./ai-voice-input";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";

interface VoiceInputProps {
  onTranscriptionComplete?: (text: string) => void;
}

export const VoiceInput = ({ onTranscriptionComplete }: VoiceInputProps) => {
  const { toast } = useToast();
  const [isRecording, setIsRecording] = useState(false);

  const handleStart = () => {
    if (!isRecording) {
      setIsRecording(true);
      toast({
        title: "Grabación iniciada",
        description: "Comienza a hablar...",
      });
    }
  };

  const handleStop = () => {
    if (isRecording) {
      setIsRecording(false);
      toast({
        title: "Grabación finalizada",
        description: "Procesando el audio...",
      });
    }
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