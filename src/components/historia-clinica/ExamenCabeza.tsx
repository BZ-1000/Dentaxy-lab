
import React from "react";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { VoiceInput } from "@/components/ui/voice-input";
import { Card } from "@/components/ui/card";
import { FormDataState } from '@/types/historiaClinica';

interface ExamenCabezaProps {
  formData: FormDataState;
  handleExamenCabezaChange: (part: string, value: any) => void;
}

const ExamenCabeza = ({ formData, handleExamenCabezaChange }: ExamenCabezaProps) => {
  const handleCaracteristicaFacialChange = (caracteristica: string, field: string, value: string | boolean) => {
    const currentCaracteristicas = formData.examenCabeza.caracteristicasFaciales || {};
    const currentData = (typeof currentCaracteristicas === 'object' && currentCaracteristicas[caracteristica]) || {};
    const updatedData = { ...currentData, [field]: value };
    
    const updatedCaracteristicas = {
      ...(typeof currentCaracteristicas === 'object' ? currentCaracteristicas : {}),
      [caracteristica]: updatedData
    };
    
    handleExamenCabezaChange('caracteristicasFaciales', updatedCaracteristicas);
  };

  const getCaracteristicaValue = (caracteristica: string, field: string): string => {
    const caracteristicas = formData.examenCabeza.caracteristicasFaciales;
    if (typeof caracteristicas === 'object' && caracteristicas && caracteristicas[caracteristica]) {
      const caracteristicaData = caracteristicas[caracteristica];
      if (typeof caracteristicaData === 'object' && caracteristicaData && caracteristicaData[field]) {
        return typeof caracteristicaData[field] === 'string' ? caracteristicaData[field] : "";
      }
    }
    return "";
  };

  return (
    <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-lg rounded-xl border-0">
      <div className="flex justify-start px-6 py-4 border-b border-gray-200 dark:border-gray-700">
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <span className="text-gray-400">VIII.</span> EXAMEN DE CABEZA
        </h2>
      </div>

      <div className="p-6 space-y-6">
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Características Faciales</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Forma de la cara</Label>
              <Select
                value={getCaracteristicaValue('formaCara', 'tipo')}
                onValueChange={value => handleCaracteristicaFacialChange('formaCara', 'tipo', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccione forma" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="redonda">Redonda</SelectItem>
                  <SelectItem value="ovalada">Ovalada</SelectItem>
                  <SelectItem value="cuadrada">Cuadrada</SelectItem>
                  <SelectItem value="triangular">Triangular</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Simetría facial</Label>
              <Select
                value={getCaracteristicaValue('simetriaFacial', 'tipo')}
                onValueChange={value => handleCaracteristicaFacialChange('simetriaFacial', 'tipo', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccione simetría" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="simetrica">Simétrica</SelectItem>
                  <SelectItem value="asimetrica">Asimétrica</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Perfil facial</Label>
              <Select
                value={getCaracteristicaValue('perfilFacial', 'tipo')}
                onValueChange={value => handleCaracteristicaFacialChange('perfilFacial', 'tipo', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccione perfil" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="recto">Recto</SelectItem>
                  <SelectItem value="convexo">Convexo</SelectItem>
                  <SelectItem value="concavo">Cóncavo</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Color de la piel</Label>
              <Select
                value={getCaracteristicaValue('colorPiel', 'tipo')}
                onValueChange={value => handleCaracteristicaFacialChange('colorPiel', 'tipo', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccione color" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="normal">Normal</SelectItem>
                  <SelectItem value="palido">Pálido</SelectItem>
                  <SelectItem value="enrojecido">Enrojecido</SelectItem>
                  <SelectItem value="cianotico">Cianótico</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <Label>Observaciones adicionales</Label>
          <div className="flex items-start gap-4">
            <Textarea
              value={typeof formData.examenCabeza.observaciones === 'string' ? formData.examenCabeza.observaciones : ""}
              onChange={e => handleExamenCabezaChange('observaciones', e.target.value)}
              placeholder="Describir cualquier anomalía o hallazgo relevante en el examen de cabeza"
              className="min-h-[100px] max-h-[200px] w-full resize-y text-justify"
            />
            <div className="mt-2">
              <VoiceInput
                onTranscriptionComplete={text => handleExamenCabezaChange('observaciones', text)}
              />
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default ExamenCabeza;
