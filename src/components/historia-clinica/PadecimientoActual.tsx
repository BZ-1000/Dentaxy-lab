import React from 'react';
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

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
  return (
    <Card className="p-6">
      <h3 className="text-xl font-semibold mb-4">Padecimiento Actual</h3>
      
      <div className="mb-4">
        <div className="flex items-center space-x-2">
          <Checkbox 
            id="sinSintomas"
            checked={formData.padecimientoActual.sinSintomas}
            onCheckedChange={handleSinSintomasChange}
          />
          <Label htmlFor="sinSintomas">Actualmente no refiere sintomatología</Label>
        </div>
      </div>

      {!formData.padecimientoActual.sinSintomas && (
        <div className="space-y-4">
          <div>
            <Label>Fecha de aparición del síntoma principal</Label>
            <Input
              type="date"
              value={formData.padecimientoActual.fechaAparicion}
              onChange={(e) => handlePadecimientoChange('fechaAparicion', e.target.value)}
            />
          </div>

          <div>
            <Label>Evolución</Label>
            <Textarea
              value={formData.padecimientoActual.evolucion}
              onChange={(e) => handlePadecimientoChange('evolucion', e.target.value)}
              placeholder="Describa la evolución de los síntomas"
            />
          </div>

          <div>
            <Label>Estado Actual</Label>
            <Textarea
              value={formData.padecimientoActual.estadoActual}
              onChange={(e) => handlePadecimientoChange('estadoActual', e.target.value)}
              placeholder="Describa el estado actual de los síntomas"
            />
          </div>

          <div className="space-y-4 border-t pt-4">
            <h4 className="text-lg font-semibold">Características del Dolor</h4>
            
            <div>
              <Label>Fecha de inicio del dolor</Label>
              <Input
                type="date"
                value={formData.padecimientoActual.dolor.fechaInicio}
                onChange={(e) => handleDolorChange('fechaInicio', e.target.value)}
              />
            </div>

            <div>
              <Label>Condición de aparición</Label>
              <RadioGroup
                value={formData.padecimientoActual.dolor.condicionAparicion}
                onValueChange={(value) => handleDolorChange('condicionAparicion', value)}
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="provocado" id="provocado" />
                  <Label htmlFor="provocado">Provocado</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="espontaneo" id="espontaneo" />
                  <Label htmlFor="espontaneo">Espontáneo</Label>
                </div>
              </RadioGroup>
            </div>

            <div>
              <Label>Frecuencia</Label>
              <RadioGroup
                value={formData.padecimientoActual.dolor.frecuencia}
                onValueChange={(value) => handleDolorChange('frecuencia', value)}
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="intermitente" id="intermitente" />
                  <Label htmlFor="intermitente">Intermitente</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="continuo" id="continuo" />
                  <Label htmlFor="continuo">Continuo</Label>
                </div>
              </RadioGroup>
            </div>

            <div>
              <Label>Carácter del dolor</Label>
              <RadioGroup
                value={formData.padecimientoActual.dolor.caracter}
                onValueChange={(value) => handleDolorChange('caracter', value)}
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="pulsatil" id="pulsatil" />
                  <Label htmlFor="pulsatil">Pulsátil</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="sordo" id="sordo" />
                  <Label htmlFor="sordo">Sordo</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="quemante" id="quemante" />
                  <Label htmlFor="quemante">Quemante</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="opresivo" id="opresivo" />
                  <Label htmlFor="opresivo">Opresivo</Label>
                </div>
              </RadioGroup>
            </div>

            <div>
              <Label>Localización del dolor</Label>
              <RadioGroup
                value={formData.padecimientoActual.dolor.localizacion.tipo}
                onValueChange={(value) => {
                  handleDolorChange('localizacion', JSON.stringify({
                    ...formData.padecimientoActual.dolor.localizacion,
                    tipo: value
                  }))
                }}
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="localizado" id="localizado" />
                  <Label htmlFor="localizado">Localizado</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="irradiado" id="irradiado" />
                  <Label htmlFor="irradiado">Irradiado</Label>
                </div>
              </RadioGroup>
              <Input
                className="mt-2"
                placeholder="Descripción de la localización"
                value={formData.padecimientoActual.dolor.localizacion.descripcion}
                onChange={(e) => {
                  handleDolorChange('localizacion', JSON.stringify({
                    ...formData.padecimientoActual.dolor.localizacion,
                    descripcion: e.target.value
                  }))
                }}
              />
            </div>

            <div>
              <Label>Atenuación</Label>
              <Textarea
                value={formData.padecimientoActual.dolor.atenuacion}
                onChange={(e) => handleDolorChange('atenuacion', e.target.value)}
                placeholder="Condiciones que exacerban o disminuyen el dolor"
              />
            </div>
          </div>
        </div>
      )}
    </Card>
  );
};

export default PadecimientoActual;