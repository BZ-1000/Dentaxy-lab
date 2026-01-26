
import { AIVoiceInput } from "./ai-voice-input";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";

interface VoiceInputProps {
  onTranscriptionComplete?: (text: string) => void;
  className?: string;
}

export const VoiceInput = ({ onTranscriptionComplete, className }: VoiceInputProps) => {
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

  const handleTranscriptionComplete = (text: string) => {
    if (text && onTranscriptionComplete) {
      onTranscriptionComplete(text);
    }
  };

  return (
    <div className={`h-full flex items-center justify-center ${className ? 'inline-flex' : ''}`}>
      <AIVoiceInput
        onStart={handleStart}
        onStop={handleStop}
        onTranscriptionComplete={handleTranscriptionComplete}
        className={className || "p-0"}
      />
    </div>
  );
};
