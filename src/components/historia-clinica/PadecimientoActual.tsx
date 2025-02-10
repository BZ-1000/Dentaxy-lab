"use client";

import React, { useState, useRef } from "react";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { VoiceInput } from "@/components/ui/voice-input";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Minus, Maximize2, X, Eraser } from "lucide-react";
import CaracteristicasDolor from "./padecimiento/CaracteristicasDolor";
import SintomasToggle from "./padecimiento/SintomasToggle";
import { HfInference } from "@huggingface/inference";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

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
  const [showRedaccion, setShowRedaccion] = useState(false);
  const [redaccionIA, setRedaccionIA] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const redaccionRef = useRef(null);
  const { toast } = useToast();

  const generarRedaccionIA = async () => {
    try {
      setIsGenerating(true);
      
      const { data: secretData, error: secretError } = await supabase
        .from('secrets')
        .select('value')
        .eq('name', 'HUGGINGFACE_API_KEY')
        .maybeSingle();

      if (secretError || !secretData) {
        throw new Error('Error al obtener la clave API');
      }

      const hf = new HfInference(secretData.value);
      const prompt = `Redacta un informe médico profesional basado en estos datos:
      Motivo de consulta: ${formData.padecimientoActual.motivoConsulta}
      ${formData.padecimientoActual.sinSintomas ? 'El paciente no presenta síntomas.' : `
      Dolor:
      - Inicio: ${formData.padecimientoActual.dolor.fechaInicio}
      - Aparición: ${formData.padecimientoActual.dolor.condicionAparicion}
      - Frecuencia: ${formData.padecimientoActual.dolor.frecuencia}
      - Características: ${formData.padecimientoActual.dolor.caracter}
      - Intensidad: ${formData.padecimientoActual.dolor.intensidad}
      - Localización: ${formData.padecimientoActual.dolor.localizacion.tipo} - ${formData.padecimientoActual.dolor.localizacion.descripcion}
      - Factores de atenuación: ${formData.padecimientoActual.dolor.atenuacion}`}`;

      const response = await hf.textGeneration({
        model: 'mistralai/Mistral-7B-Instruct-v0.2',
        inputs: prompt,
        parameters: {
          max_new_tokens: 250,
          temperature: 0.7,
        },
      });

      setRedaccionIA(response.generated_text);
      setShowRedaccion(true);
      
      toast({ title: "Redacción generada", description: "Se ha generado la redacción con IA exitosamente." });
    } catch (error) {
      console.error('Error:', error);
      toast({ title: "Error", description: "Hubo un error al generar la redacción.", variant: "destructive" });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <Card className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
        <h2 className="text-xl font-semibold">Padecimiento Actual</h2>

        {showRedaccion ? (
          <div ref={redaccionRef} className="mt-4">
            <Label>Redacción IA:</Label>
            <Textarea value={redaccionIA} readOnly className="w-full h-40 bg-gray-100" />
          </div>
        ) : (
          <div className="mt-4">
            <Label>Motivo de consulta:</Label>
            <Textarea value={formData.padecimientoActual.motivoConsulta} onChange={(e) => handlePadecimientoChange("motivoConsulta", e.target.value)} className="w-full" />
          </div>
        )}

        <div className="mt-4 flex gap-4">
          <Button onClick={generarRedaccionIA} disabled={isGenerating} className="bg-blue-500 text-white">
            {isGenerating ? "Generando..." : "Generar Redacción IA"}
          </Button>
          <Button onClick={() => setShowRedaccion(false)} variant="outline">
            Editar formulario
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default PadecimientoActual;
