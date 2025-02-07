
import React from 'react';
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { VoiceInput } from "@/components/ui/voice-input";
import SintomasToggle from './padecimiento/SintomasToggle';
import CaracteristicasDolor from './padecimiento/CaracteristicasDolor';

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
  handleSinSintomasChange
}: PadecimientoActualProps) => {
  return (
    <Card className="p-6 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-lg rounded-xl border-0">
      <h3 className="text-2xl font-mplus font-normal mb-6 text-gray-800 dark:text-gray-100">Padecimiento Actual</h3>
      
      <SintomasToggle 
        checked={formData.padecimientoActual.sinSintomas}
        onChange={handleSinSintomasChange}
      />

      {!formData.padecimientoActual.sinSintomas && (
        <div className="space-y-6">
          <div>
            <Label>Motivo de Consulta</Label>
            <div className="flex items-center gap-4">
              <Textarea
                value={formData.padecimientoActual.motivoConsulta}
                onChange={(e) => handlePadecimientoChange('motivoConsulta', e.target.value)}
                placeholder="Describa el motivo de la consulta"
                className="min-h-[135px] max-h-[135px] w-[75%]"
              />
              <div className="h-[40px]">
                <VoiceInput 
                  onTranscriptionComplete={(text) => handlePadecimientoChange('motivoConsulta', text)} 
                />
              </div>
            </div>
          </div>

          <div>
            <Label>Historia del Padecimiento</Label>
            <div className="flex items-center gap-4">
              <Textarea
                value={formData.padecimientoActual.historiaPadecimiento}
                onChange={(e) => handlePadecimientoChange('historiaPadecimiento', e.target.value)}
                placeholder="Describa la historia del padecimiento"
                className="min-h-[135px] max-h-[135px] w-[75%]"
              />
              <div className="h-[40px]">
                <VoiceInput 
                  onTranscriptionComplete={(text) => handlePadecimientoChange('historiaPadecimiento', text)} 
                />
              </div>
            </div>
          </div>

          <CaracteristicasDolor 
            dolor={formData.padecimientoActual.dolor}
            onDolorChange={handleDolorChange}
          />
        </div>
      )}
    </Card>
  );
};

export default PadecimientoActual;
