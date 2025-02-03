import React, { useState } from 'react';
import { Mic, MicOff, Loader2 } from 'lucide-react';
import { Button } from './button';
import { toast } from './use-toast';

interface VoiceInputProps {
  onTranscriptionComplete: (text: string) => void;
}

export const VoiceInput = ({ onTranscriptionComplete }: VoiceInputProps) => {
  const [isRecording, setIsRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      const audioChunks: Blob[] = [];

      recorder.ondataavailable = (event) => {
        audioChunks.push(event.data);
      };

      recorder.onstop = async () => {
        const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
        const formData = new FormData();
        formData.append('audio', audioBlob);

        try {
          // Aquí normalmente iría la llamada a un servicio de transcripción
          // Por ahora, simularemos la transcripción después de 2 segundos
          setTimeout(() => {
            toast({
              title: "Transcripción completada",
              description: "El audio ha sido convertido a texto exitosamente.",
            });
            onTranscriptionComplete("Texto transcrito del audio"); // Aquí iría el texto real transcrito
          }, 2000);
        } catch (error) {
          toast({
            title: "Error en la transcripción",
            description: "No se pudo convertir el audio a texto.",
            variant: "destructive",
          });
        }
      };

      setMediaRecorder(recorder);
      recorder.start();
      setIsRecording(true);
      toast({
        title: "Grabación iniciada",
        description: "El micrófono está activo.",
      });
    } catch (error) {
      toast({
        title: "Error de acceso",
        description: "No se pudo acceder al micrófono.",
        variant: "destructive",
      });
    }
  };

  const stopRecording = () => {
    if (mediaRecorder && isRecording) {
      mediaRecorder.stop();
      mediaRecorder.stream.getTracks().forEach(track => track.stop());
      setIsRecording(false);
    }
  };

  return (
    <Button
      type="button"
      variant="outline"
      size="icon"
      onClick={isRecording ? stopRecording : startRecording}
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