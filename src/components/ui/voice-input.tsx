import React, { useState } from 'react';
import { Mic, MicOff, Loader2 } from 'lucide-react';
import { Button } from './button';
import { toast } from './use-toast';
import { speechRecognitionService } from '@/services/speechRecognition';

interface VoiceInputProps {
  onTranscriptionComplete: (text: string) => void;
}

export const VoiceInput = ({ onTranscriptionComplete }: VoiceInputProps) => {
  const [isRecording, setIsRecording] = useState(false);

  const handleRecording = () => {
    if (isRecording) {
      speechRecognitionService.stopRecording();
      setIsRecording(false);
    } else {
      setIsRecording(true);
      speechRecognitionService.startRecording(
        (text) => {
          onTranscriptionComplete(text);
          setIsRecording(false);
          toast({
            title: "Transcripción completada",
            description: "El audio ha sido convertido a texto exitosamente.",
          });
        },
        (error) => {
          setIsRecording(false);
          toast({
            title: "Error en la transcripción",
            description: error,
            variant: "destructive",
          });
        }
      );
    }
  };

  return (
    <Button
      type="button"
      variant="outline"
      size="icon"
      onClick={handleRecording}
      className="ml-2"
    >
      {isRecording ? (
        <MicOff className="h-4 w-4 text-red-500" />
      ) : (
        <Mic className="h-4 w-4" />
      )}
    </Button>
  );
};