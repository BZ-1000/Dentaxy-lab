import React from 'react';
import { Card } from "@/components/ui/card";
import SintomasToggle from './padecimiento/SintomasToggle';
import InformacionPrincipal from './padecimiento/InformacionPrincipal';
import CaracteristicasDolor from './padecimiento/CaracteristicasDolor';

interface PadecimientoActualProps {
  formData: {
    padecimientoActual: {
      sinSintomas: boolean;
      fechaAparicion: string;
      evolucion: string;
      estadoActual: string;
      dolor: {
        fechaInicio: string;
        condicionAparicion: string;
        frecuencia: string;
        caracter: string;
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
  const handleVoiceTranscription = (transcribedText: string) => {
    handlePadecimientoChange('evolucion', transcribedText);
  };

  return (
    <Card className="p-6">
      <h3 className="text-xl font-mplus font-normal mb-4">Padecimiento Actual</h3>
      
      <SintomasToggle 
        checked={formData.padecimientoActual.sinSintomas}
        onChange={handleSinSintomasChange}
      />

      {!formData.padecimientoActual.sinSintomas && (
        <div className="space-y-4">
          <InformacionPrincipal 
            fechaAparicion={formData.padecimientoActual.fechaAparicion}
            evolucion={formData.padecimientoActual.evolucion}
            estadoActual={formData.padecimientoActual.estadoActual}
            onFechaChange={(value) => handlePadecimientoChange('fechaAparicion', value)}
            onEvolucionChange={(value) => handlePadecimientoChange('evolucion', value)}
            onEstadoChange={(value) => handlePadecimientoChange('estadoActual', value)}
            onVoiceTranscription={handleVoiceTranscription}
          />

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