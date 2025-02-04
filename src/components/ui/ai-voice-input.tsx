"use client";

import { Mic } from "lucide-react";
import { useState, useEffect } from "react";
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
  const [submitted, setSubmitted] = useState(false);
  const [time, setTime] = useState(0);
  const [isClient, setIsClient] = useState(false);
  const [isDemo, setIsDemo] = useState(demoMode);
  const [recognition, setRecognition] = useState<SpeechRecognition | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    setIsClient(true);
    if (typeof window !== 'undefined') {
      try {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (SpeechRecognition) {
          const recognitionInstance = new SpeechRecognition();
          recognitionInstance.continuous = true;
          recognitionInstance.lang = 'es-ES';
          recognitionInstance.interimResults = false;
          
          recognitionInstance.onresult = (event) => {
            const transcript = event.results[event.results.length - 1][0].transcript;
            if (onTranscriptionComplete) {
              onTranscriptionComplete(transcript);
            }
          };

          recognitionInstance.onerror = (event) => {
            console.error('Error en reconocimiento de voz:', event.error);
            setSubmitted(false);
            
            if (event.error === 'not-allowed') {
              toast({
                title: "Error de permisos",
                description: "No se ha permitido el acceso al micrófono. Por favor, habilita los permisos en tu navegador.",
                variant: "destructive",
              });
            } else {
              toast({
                title: "Error",
                description: "Hubo un error al iniciar el reconocimiento de voz. Por favor, intenta de nuevo.",
                variant: "destructive",
              });
            }
          };

          recognitionInstance.onend = () => {
            if (submitted) {
              try {
                recognitionInstance.start();
              } catch (error) {
                console.error('Error al reiniciar el reconocimiento:', error);
                setSubmitted(false);
              }
            }
          };

          setRecognition(recognitionInstance);
        } else {
          toast({
            title: "Navegador no compatible",
            description: "Tu navegador no soporta el reconocimiento de voz. Por favor, usa un navegador más reciente.",
            variant: "destructive",
          });
        }
      } catch (error) {
        console.error('Error al inicializar el reconocimiento de voz:', error);
        toast({
          title: "Error de inicialización",
          description: "No se pudo inicializar el reconocimiento de voz. Por favor, recarga la página.",
          variant: "destructive",
        });
      }
    }
  }, [onTranscriptionComplete, toast]);

  useEffect(() => {
    let intervalId: NodeJS.Timeout;

    if (submitted) {
      try {
        onStart?.();
        if (recognition) {
          recognition.start();
          intervalId = setInterval(() => {
            setTime((t) => t + 1);
          }, 1000);
        }
      } catch (error) {
        console.error('Error al iniciar reconocimiento:', error);
        setSubmitted(false);
        toast({
          title: "Error",
          description: "No se pudo iniciar el reconocimiento de voz. Por favor, intenta de nuevo.",
          variant: "destructive",
        });
      }
    } else {
      if (recognition) {
        try {
          recognition.stop();
        } catch (error) {
          console.error('Error al detener reconocimiento:', error);
        }
      }
      onStop?.(time);
      setTime(0);
    }

    return () => {
      clearInterval(intervalId);
      if (recognition) {
        try {
          recognition.stop();
        } catch (error) {
          console.error('Error al limpiar reconocimiento:', error);
        }
      }
    };
  }, [submitted, time, onStart, onStop, recognition, toast]);

  useEffect(() => {
    if (!isDemo) return;

    let timeoutId: NodeJS.Timeout;
    const runAnimation = () => {
      setSubmitted(true);
      timeoutId = setTimeout(() => {
        setSubmitted(false);
        timeoutId = setTimeout(runAnimation, 1000);
      }, demoInterval);
    };

    const initialTimeout = setTimeout(runAnimation, 100);
    return () => {
      clearTimeout(timeoutId);
      clearTimeout(initialTimeout);
    };
  }, [isDemo, demoInterval]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const handleClick = async () => {
    if (isDemo) {
      setIsDemo(false);
      setSubmitted(false);
    } else {
      try {
        if (!recognition) {
          toast({
            title: "Error",
            description: "El reconocimiento de voz no está disponible en este navegador.",
            variant: "destructive",
          });
          return;
        }

        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        stream.getTracks().forEach(track => track.stop());
        
        setSubmitted((prev) => !prev);
      } catch (error) {
        console.error('Error al solicitar permisos:', error);
        toast({
          title: "Error de permisos",
          description: "No se pudo acceder al micrófono. Por favor, verifica los permisos en tu navegador.",
          variant: "destructive",
        });
      }
    }
  };

  return (
    <div className={cn("w-full py-4", className)}>
      <div className="relative max-w-xl w-full mx-auto flex items-center flex-col gap-2">
        <button
          className={cn(
            "group w-16 h-16 rounded-xl flex items-center justify-center transition-colors",
            submitted
              ? "bg-none"
              : "bg-none hover:bg-black/10 dark:hover:bg-white/10"
          )}
          type="button"
          onClick={handleClick}
        >
          {submitted ? (
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
            submitted
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
                submitted
                  ? "bg-black/50 dark:bg-white/50 animate-pulse"
                  : "bg-black/10 dark:bg-white/10 h-1"
              )}
              style={
                submitted && isClient
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
          {submitted ? "Escuchando..." : "Audio a Texto"}
        </p>
      </div>
    </div>
  );
}