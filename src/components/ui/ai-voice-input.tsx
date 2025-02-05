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

  const stopRecording = useCallback(() => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
        recognitionRef.current.onresult = null;
        recognitionRef.current.onerror = null;
        recognitionRef.current.onend = null;
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
  }, [onStop, time]);

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
        const transcript = Array.from(event.results)
          .map(result => result[0].transcript)
          .join('');

        if (onTranscriptionComplete && isRecording) {
          console.log('Transcripción:', transcript);
          onTranscriptionComplete(transcript);
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
  }, [isRecording, onTranscriptionComplete, stopRecording, toast]);

  useEffect(() => {
    setIsClient(true);
    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
          recognitionRef.current.onresult = null;
          recognitionRef.current.onerror = null;
          recognitionRef.current.onend = null;
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
            "group w-16 h-16 rounded-xl flex items-center justify-center transition-colors",
            isRecording
              ? "bg-none"
              : "bg-none hover:bg-black/10 dark:hover:bg-white/10"
          )}
          type="button"
          onClick={handleClick}
        >
          {isRecording ? (
            <div
              className="w-6 h-6 rounded-sm animate-spin bg-black dark:bg-white cursor-pointer pointer-events-auto"
              style={{ animationDuration: "3s" }}
            />
          ) : (
            <Mic className="w-6 h-6 text-black/70 dark:text-white/70" />
          )}
        </button>

        <span
          className={cn(
            "font-mono text-sm transition-opacity duration-300",
            isRecording
              ? "text-black/70 dark:text-white/70"
              : "text-black/30 dark:text-white/30"
          )}
        >
          {formatTime(time)}
        </span>

        <div className="h-4 w-64 flex items-center justify-center gap-0.5">
          {[...Array(visualizerBars)].map((_, i) => (
            <div
              key={i}
              className={cn(
                "w-0.5 rounded-full transition-all duration-300",
                isRecording
                  ? "bg-black/50 dark:bg-white/50 animate-pulse"
                  : "bg-black/10 dark:bg-white/10 h-1"
              )}
              style={
                isRecording && isClient
                  ? {
                      height: `${20 + Math.random() * 80}%`,
                      animationDelay: `${i * 0.05}s`,
                    }
                  : undefined
              }
            />
          ))}
        </div>

        <p className="h-4 text-xs text-black/70 dark:text-white/70">
          {isRecording ? "Escuchando..." : "Audio a Texto"}
        </p>
      </div>
    </div>
  );
}