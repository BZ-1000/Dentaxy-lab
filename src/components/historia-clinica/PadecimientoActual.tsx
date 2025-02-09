"use client";

import React, { useState, useRef } from "react";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { VoiceInput } from "@/components/ui/voice-input";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Minus, Maximize2, X } from "lucide-react";
import { HfInference } from "@huggingface/inference";
import CaracteristicasDolor from "./padecimiento/CaracteristicasDolor";
import SintomasToggle from "./padecimiento/SintomasToggle";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface PadecimientoActualProps {
  formData: {
    padecimientoActual: {
      sinSintomas: boolean;
      motivoConsulta: string;
      historiaPadecimiento: string;
      dolor: {
        fechaInicio: string;
        condicionAparicion: string;
        frecuencia: string;
        caracter: string;
        intensidad: string;
        localizacion: {
          tipo: string;
          descripcion: string;
        };
        atenuacion: string;
      };
    };
  };
  handlePadecimientoChange: (field: string, value: string) => void;
  handleDolorChange: (field: string, value: string) => void;
  handleSinSintomasChange: (checked: boolean) => void;
}

const PadecimientoActual = ({
  formData,
  handlePadecimientoChange,
  handleDolorChange,
  handleSinSintomasChange,
}: PadecimientoActualProps) => {
  const [isMinimized, setIsMinimized] = useState(false);
  const [isMaximized, setIsMaximized] = useState(false);
  const [showRedaccion, setShowRedaccion] = useState(false);
  const [redaccionIA, setRedaccionIA] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const redaccionRef = useRef(null);
  const { toast } = useToast();

  const handleMinimize = () => {
    setIsMinimized(!isMinimized);
    setIsMaximized(false);
  };

  const handleMaximize = () => {
    setIsMaximized(!isMaximized);
    setIsMinimized(false);
  };

  const handleClose = () => {
    setIsMinimized(false);
    setIsMaximized(false);
  };

  const generarRedaccionIA = async () => {
    try {
      setIsGenerating(true);

      // Get the HuggingFace API key from Supabase secrets
      const { data: secretData, error: secretError } = await supabase
        .from('secrets')
        .select('value')
        .eq('name', 'HUGGINGFACE_API_KEY')
        .maybeSingle();

      if (secretError) {
        throw new Error('Error al obtener la clave API de HuggingFace');
      }

      if (!secretData) {
        toast({
          title: "Error de configuración",
          description: "No se ha configurado la clave API de HuggingFace. Por favor, configure la clave en la configuración del proyecto.",
          variant: "destructive",
        });
        return;
      }

      const hf = new HfInference(secretData.value);

      // Prepare the prompt with form data
      const prompt = `Actúa como un profesional médico y genera una historia clínica detallada basada en la siguiente información:

      ${formData.padecimientoActual.sinSintomas 
        ? "El paciente no refiere sintomatología actual."
        : `Motivo de consulta: ${formData.padecimientoActual.motivoConsulta}

        Características del dolor:
        - Fecha de inicio: ${formData.padecimientoActual.dolor.fechaInicio}
        - Condición de aparición: ${formData.padecimientoActual.dolor.condicionAparicion}
        - Frecuencia: ${formData.padecimientoActual.dolor.frecuencia}
        - Carácter: ${formData.padecimientoActual.dolor.caracter}
        - Intensidad: ${formData.padecimientoActual.dolor.intensidad}
        - Localización: ${formData.padecimientoActual.dolor.localizacion.tipo} - ${formData.padecimientoActual.dolor.localizacion.descripcion}
        - Factores de atenuación: ${formData.padecimientoActual.dolor.atenuacion}`
      }

      Por favor, genera una redacción profesional y detallada de la historia clínica.`;

      // Generate text using HuggingFace
      const response = await hf.textGeneration({
        model: "google/flan-t5-xxl",
        inputs: prompt,
        parameters: {
          max_new_tokens: 500,
          temperature: 0.7
        }
      });

      setRedaccionIA(response.generated_text);
      setShowRedaccion(true);

      // Scroll to the generated text
      setTimeout(() => {
        redaccionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        setTimeout(() => {
          window.scrollBy(0, -200);
        }, 300);
      }, 100);

      toast({
        title: "Redacción generada",
        description: "La historia clínica ha sido generada exitosamente con IA.",
      });
    } catch (error) {
      console.error("Error al generar la redacción:", error);
      toast({
        title: "Error",
        description: "No se pudo generar la redacción. Por favor, intente nuevamente.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className={`max-w-4xl mx-auto transition-all duration-300 ${isMaximized ? "fixed inset-4 z-50" : ""}`}>
      <Card className={`bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-lg rounded-xl border-0 ${isMaximized ? "h-[calc(100vh-2rem)] overflow-y-auto" : ""}`}>
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex justify-center w-full">
            <div className="flex bg-gray-200 dark:bg-gray-700 rounded-full p-1">
              <button
                onClick={() => setShowRedaccion(false)}
                className={`px-5 py-1.5 rounded-full transition-all duration-300 text-sm ${!showRedaccion ? "bg-blue-500 text-white shadow-md" : "text-gray-700 dark:text-gray-300"}`}
              >
                Formulario
              </button>
              <button
                onClick={() => setShowRedaccion(true)}
                className={`px-5 py-1.5 rounded-full transition-all duration-300 text-sm ${showRedaccion ? "bg-blue-500 text-white shadow-md" : "text-gray-700 dark:text-gray-300"}`}
              >
                Redacción IA
              </button>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button onClick={handleMinimize} className="p-1 rounded-full bg-green-100 text-green-600 hover:bg-green-200 transition-colors" aria-label={isMinimized ? "Expandir" : "Minimizar"}>
              <Minus className="w-4 h-4" />
            </button>
            <button onClick={handleMaximize} className="p-1 rounded-full bg-yellow-100 text-yellow-600 hover:bg-yellow-200 transition-colors" aria-label={isMaximized ? "Restaurar" : "Maximizar"}>
              <Maximize2 className="w-4 h-4" />
            </button>
            <button onClick={handleClose} className="p-1 rounded-full bg-red-100 text-red-600 hover:bg-red-200 transition-colors" aria-label="Cerrar">
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="flex justify-start px-6 py-2">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <span className="text-gray-400">I.</span> PADECIMIENTO ACTUAL
          </h2>
        </div>

        {showRedaccion ? (
          <div ref={redaccionRef} className="p-6">
            <Label className="text-gray-700 dark:text-gray-300">Redacción IA:</Label>
            <Textarea
              value={redaccionIA}
              readOnly
              className="min-h-[150px] max-h-[250px] w-full bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700 resize-y"
            />
          </div>
        ) : (
          <div className="p-6">
            <Label className="text-gray-700 dark:text-gray-300">1. Motivo de consulta:</Label>
            <div className="flex items-start gap-4">
              <Textarea 
                value={formData.padecimientoActual.motivoConsulta} 
                onChange={(e) => handlePadecimientoChange("motivoConsulta", e.target.value)} 
                placeholder="Describa el motivo fundamental por el que acude el paciente" 
                className="min-h-[100px] max-h-[200px] w-full bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700 resize-y" 
              />
              <div className="mt-2">
                <VoiceInput onTranscriptionComplete={(text) => handlePadecimientoChange("motivoConsulta", text)} />
              </div>
            </div>
          </div>
        )}

        {!isMinimized && !showRedaccion && (
          <div className="p-6 space-y-8">
            <SintomasToggle checked={formData.padecimientoActual.sinSintomas} onChange={handleSinSintomasChange} />
            {!formData.padecimientoActual.sinSintomas && (
              <div className="space-y-6">
                <div className="bg-gray-50 dark:bg-gray-900 p-6 rounded-lg">
                  <h3 className="text-lg font-medium mb-6">En caso de dolor</h3>
                  <CaracteristicasDolor dolor={formData.padecimientoActual.dolor} onDolorChange={handleDolorChange} />
                </div>
              </div>
            )}
          </div>
        )}

        {!showRedaccion && (
          <div className="p-6 flex justify-center">
            <Button 
              onClick={generarRedaccionIA} 
              className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
              disabled={isGenerating}
            >
              {isGenerating ? "Generando..." : "Generar Redacción IA"}
            </Button>
          </div>
        )}
      </Card>
    </div>
  );
};

export default PadecimientoActual;
