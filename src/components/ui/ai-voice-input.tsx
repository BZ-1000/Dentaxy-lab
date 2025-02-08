
"use client";

import { Mic } from "lucide-react";
import { useState, useEffect, useCallback, useRef } from "react";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

interface AIVoiceInputProps {
  onStart?: () => void;
  onStop?: (duration: number) => void;
  visualizerBars?: number;
  demoMode?: boolean;
  demoInterval?: number;
  className?: string;
  onTranscriptionComplete?: (text: string) => void;
}

export function AIVoiceInput({
  onStart,
  onStop,
  visualizerBars = 48,
  demoMode = false,
  demoInterval = 3000,
  className,
  onTranscriptionComplete
}: AIVoiceInputProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [time, setTime] = useState(0);
  const [isClient, setIsClient] = useState(false);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const { toast } = useToast();
  const transcriptRef = useRef<string>('');

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

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      stream.getTracks().forEach(track => track.stop());

      transcriptRef.current = '';
      recognitionRef.current = initializeRecognition();
      
      if (recognitionRef.current) {
        recognitionRef.current.start();
        setIsRecording(true);
        onStart?.();
        
        timerRef.current = setInterval(() => {
          setTime(prev => prev + 1);
        }, 1000);

        toast({
          title: "Grabación iniciada",
          description: "Puedes comenzar a hablar...",
        });
      }
    } catch (error) {
      console.error('Error al solicitar permisos:', error);
      toast({
        title: "Error de permisos",
        description: "No se pudo acceder al micrófono. Por favor, verifica los permisos en tu navegador.",
        variant: "destructive",
      });
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
          <img 
            src="/lovable-uploads/41476c1b-5cc4-4df4-aaee-20ca4676caa4.png" 
            alt="Voice input"
            className="w-6 h-6"
          />
          {isRecording && (
            <span className="absolute -top-2 -right-2 w-3 h-3 bg-red-500 rounded-full animate-pulse" />
          )}
        </button>

        {isRecording && (
          <span className="text-sm text-gray-500 dark:text-gray-400">
            {formatTime(time)}
          </span>
        )}
      </div>
    </div>
  );
}
