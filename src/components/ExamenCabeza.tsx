
import React from 'react';
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Textarea } from "@/components/ui/textarea";

export interface ExamenCabezaData {
  palpacionATM: string;
  movimientosMandibulares: string;
  gangliosLinfaticos: string;
  musculosMasticadores: string;
  observaciones: string;
}

interface ExamenCabezaProps {
  data: ExamenCabezaData;
  onChange: (part: string, value: any) => void;
}

const ExamenCabeza: React.FC<ExamenCabezaProps> = ({ data, onChange }) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold mb-2">Examen de Cabeza</h3>
      
      <div className="space-y-3">
        <div>
          <Label className="text-sm font-medium mb-1 block">Palpación de ATM</Label>
          <RadioGroup 
            value={data.palpacionATM}
            onValueChange={(value) => onChange('palpacionATM', value)}
            className="flex flex-col space-y-1"
          >
            <div className="flex items-center">
              <RadioGroupItem value="normal" id="atm-normal" />
              <Label htmlFor="atm-normal" className="ml-2">Normal</Label>
            </div>
            <div className="flex items-center">
              <RadioGroupItem value="alterada" id="atm-alterada" />
              <Label htmlFor="atm-alterada" className="ml-2">Alterada</Label>
            </div>
          </RadioGroup>
        </div>
        
        <div>
          <Label className="text-sm font-medium mb-1 block">Movimientos Mandibulares</Label>
          <RadioGroup 
            value={data.movimientosMandibulares}
            onValueChange={(value) => onChange('movimientosMandibulares', value)}
            className="flex flex-col space-y-1"
          >
            <div className="flex items-center">
              <RadioGroupItem value="normales" id="movimiento-normales" />
              <Label htmlFor="movimiento-normales" className="ml-2">Normales</Label>
            </div>
            <div className="flex items-center">
              <RadioGroupItem value="alterados" id="movimiento-alterados" />
              <Label htmlFor="movimiento-alterados" className="ml-2">Alterados</Label>
            </div>
          </RadioGroup>
        </div>
        
        <div>
          <Label className="text-sm font-medium mb-1 block">Ganglios Linfáticos</Label>
          <RadioGroup 
            value={data.gangliosLinfaticos}
            onValueChange={(value) => onChange('gangliosLinfaticos', value)}
            className="flex flex-col space-y-1"
          >
            <div className="flex items-center">
              <RadioGroupItem value="normales" id="ganglios-normales" />
              <Label htmlFor="ganglios-normales" className="ml-2">Normales</Label>
            </div>
            <div className="flex items-center">
              <RadioGroupItem value="inflamados" id="ganglios-inflamados" />
              <Label htmlFor="ganglios-inflamados" className="ml-2">Inflamados</Label>
            </div>
          </RadioGroup>
        </div>
        
        <div>
          <Label className="text-sm font-medium mb-1 block">Músculos Masticadores</Label>
          <RadioGroup 
            value={data.musculosMasticadores}
            onValueChange={(value) => onChange('musculosMasticadores', value)}
            className="flex flex-col space-y-1"
          >
            <div className="flex items-center">
              <RadioGroupItem value="normales" id="musculos-normales" />
              <Label htmlFor="musculos-normales" className="ml-2">Normales</Label>
            </div>
            <div className="flex items-center">
              <RadioGroupItem value="dolorosos" id="musculos-dolorosos" />
              <Label htmlFor="musculos-dolorosos" className="ml-2">Dolorosos a la palpación</Label>
            </div>
          </RadioGroup>
        </div>
        
        <div>
          <Label htmlFor="observaciones-cabeza" className="text-sm font-medium mb-1 block">Observaciones</Label>
          <Textarea 
            id="observaciones-cabeza" 
            placeholder="Ingrese observaciones adicionales aquí..."
            value={data.observaciones}
            onChange={(e) => onChange('observaciones', e.target.value)}
            className="resize-none"
          />
        </div>
      </div>
    </div>
  );
};

export default ExamenCabeza;
