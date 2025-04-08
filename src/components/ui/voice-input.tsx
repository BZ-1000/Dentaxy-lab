
import { AIVoiceInput } from "./ai-voice-input";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { Mic } from "lucide-react";

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

  const handleTranscriptionComplete = (text: string) => {
    if (text && onTranscriptionComplete) {
      onTranscriptionComplete(text);
    }
  };

  const handleClick = () => {
    if (isRecording) {
      handleStop();
    } else {
      handleStart();
    }
    
    // This will be handled by the AIVoiceInput component
    const audioInput = document.createElement('audio-input');
    document.body.appendChild(audioInput);
    
    setTimeout(() => {
      document.body.removeChild(audioInput);
    }, 100);
  };

  return (
    <div className="h-full flex items-center justify-center">
      <div
        className={`group relative w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 cursor-pointer ${
          isRecording ? "bg-red-500 hover:bg-red-600" : "bg-blue-500 hover:bg-blue-600"
        }`}
        onClick={handleClick}
      >
        <Mic className="w-5 h-5 text-white" />
        {isRecording && (
          <span className="absolute -top-2 -right-2 w-3 h-3 bg-red-500 rounded-full animate-pulse" />
        )}
        
        <div style={{ display: 'none' }}>
          <AIVoiceInput
            onStart={handleStart}
            onStop={handleStop}
            onTranscriptionComplete={handleTranscriptionComplete}
            className="p-0"
          />
        </div>
      </div>
    </div>
  );
};
