
"use client";

import { Mic } from "lucide-react";
import { useState, useEffect, useCallback, useRef } from "react";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

interface AIVoiceInputProps {
  onStart?: () => void;
  onStop?: (duration?: number) => void;
  visualizerBars?: number;
  demoMode?: boolean;
  demoInterval?: number;
  className?: string;
  onTranscriptionComplete?: (text: string) => void;
  isActive?: boolean;
}

export function AIVoiceInput({
  onStart,
  onStop,
  visualizerBars = 48,
  demoMode = false,
  demoInterval = 3000,
  className,
  onTranscriptionComplete,
  isActive = false
}: AIVoiceInputProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [time, setTime] = useState(0);
  const [isClient, setIsClient] = useState(false);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const { toast } = useToast();
  const transcriptRef = useRef<string>('');
  const [micPermissionGranted, setMicPermissionGranted] = useState<boolean | null>(null);

  const stopRecording = useCallback(() => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
        if (onTranscriptionComplete && transcriptRef.current) {
          console.log('Transcripción final:', transcriptRef.current);
          onTranscriptionComplete(transcriptRef.current);
        }
        transcriptRef.current = '';
        recognitionRef.current = null;
      } catch (error) {
        console.error('Error al detener el reconocimiento:', error);
      }
    }
    
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    
    setIsRecording(false);
    onStop?.(time);
    setTime(0);
  }, [onStop, time, onTranscriptionComplete]);

  const initializeRecognition = useCallback(() => {
    if (typeof window === 'undefined') return null;

    try {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (!SpeechRecognition) {
        toast({
          title: "Navegador no compatible",
          description: "Tu navegador no soporta el reconocimiento de voz. Por favor, usa un navegador más reciente.",
          variant: "destructive",
        });
        return null;
      }

      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.lang = 'es-ES';
      recognition.interimResults = true;

      recognition.onresult = (event) => {
        const lastResult = event.results[event.results.length - 1];
        if (lastResult.isFinal) {
          const transcript = lastResult[0].transcript;
          console.log('Transcripción parcial:', transcript);
          transcriptRef.current += transcript + ' ';
          
          if (onTranscriptionComplete) {
            onTranscriptionComplete(transcriptRef.current.trim());
          }
        }
      };

      recognition.onerror = (event) => {
        console.error('Error en reconocimiento de voz:', event.error);
        if (event.error === 'not-allowed') {
          toast({
            title: "Error de permisos",
            description: "No se ha permitido el acceso al micrófono. Por favor, habilita los permisos en tu navegador.",
            variant: "destructive",
          });
          setMicPermissionGranted(false);
          stopRecording();
        } else if (event.error === 'no-speech') {
          toast({
            title: "No se detectó audio",
            description: "No se detectó ninguna voz. Por favor, intenta hablar más fuerte o verifica tu micrófono.",
            variant: "destructive",
          });
          stopRecording();
        }
      };

      recognition.onend = () => {
        if (isRecording) {
          try {
            recognition.start();
          } catch (error) {
            console.error('Error al reiniciar el reconocimiento:', error);
            stopRecording();
          }
        }
      };

      return recognition;
    } catch (error) {
      console.error('Error al inicializar el reconocimiento de voz:', error);
      toast({
        title: "Error de inicialización",
        description: "No se pudo inicializar el reconocimiento de voz. Por favor, recarga la página.",
        variant: "destructive",
      });
      return null;
    }
  }, [isRecording, stopRecording, toast]);

  useEffect(() => {
    setIsClient(true);
    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch (error) {
          console.error('Error al limpiar el reconocimiento:', error);
        }
      }
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  // Effect to handle external activation
  useEffect(() => {
    if (isActive && !isRecording) {
      startRecording();
    } else if (!isActive && isRecording) {
      stopRecording();
    }
  }, [isActive, isRecording, stopRecording]);

  const checkMicrophonePermission = async () => {
    try {
      // First check if permission is already granted by attempting to access
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      // If we get here, permission was granted
      setMicPermissionGranted(true);
      
      // Release the stream immediately, we only needed it to check permission
      stream.getTracks().forEach(track => track.stop());
      return true;
    } catch (error) {
      console.error('Error al verificar permisos del micrófono:', error);
      setMicPermissionGranted(false);
      
      // Show detailed toast based on error type
      if (error instanceof DOMException) {
        if (error.name === 'NotAllowedError' || error.name === 'PermissionDeniedError') {
          toast({
            title: "Acceso al micrófono denegado",
            description: "Has bloqueado el acceso al micrófono. Por favor, cambia los permisos en la configuración de tu navegador.",
            variant: "destructive",
          });
        } else if (error.name === 'NotFoundError' || error.name === 'DevicesNotFoundError') {
          toast({
            title: "Micrófono no encontrado",
            description: "No se detectó ningún micrófono en tu dispositivo.",
            variant: "destructive",
          });
        } else {
          toast({
            title: "Error de acceso al micrófono",
            description: `${error.name}: ${error.message}`,
            variant: "destructive",
          });
        }
      }
      return false;
    }
  };

  const startRecording = async () => {
    // First check if the browser supports speech recognition
    if (!isClient) return;

    // Check microphone permission
    const permissionGranted = await checkMicrophonePermission();
    if (!permissionGranted) {
      onStop?.();
      return;
    }
    
    try {
      transcriptRef.current = '';
      recognitionRef.current = initializeRecognition();
      
      if (recognitionRef.current) {
        recognitionRef.current.start();
        setIsRecording(true);
        onStart?.();
        
        timerRef.current = setInterval(() => {
          setTime(prev => prev + 1);
        }, 1000);
      } else {
        onStop?.();
      }
    } catch (error) {
      console.error('Error al iniciar el reconocimiento:', error);
      toast({
        title: "Error de grabación",
        description: "No se pudo iniciar la grabación. Por favor, verifica los permisos del micrófono.",
        variant: "destructive",
      });
      onStop?.();
    }
  };

  const handleClick = () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className={cn("w-full py-4", className)}>
      <div className="relative max-w-xl w-full mx-auto flex items-center flex-col gap-2">
        {!isActive && (
          <button
            className={cn(
              "group relative w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200",
              isRecording
                ? "bg-red-500 hover:bg-red-600"
                : "bg-blue-500 hover:bg-blue-600"
            )}
            type="button"
            onClick={handleClick}
          >
            <Mic className="w-6 h-6 text-white" />
            {isRecording && (
              <span className="absolute -top-2 -right-2 w-3 h-3 bg-red-500 rounded-full animate-pulse" />
            )}
          </button>
        )}

        {isRecording && (
          <span className="text-sm text-gray-500 dark:text-gray-400">
            {formatTime(time)}
          </span>
        )}
      </div>
    </div>
  );
}
