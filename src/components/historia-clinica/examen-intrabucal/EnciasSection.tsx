import React from 'react';
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Smile } from "lucide-react";

interface EnciasSectionProps {
  data: any;
  onChange: (field: string, value: any) => void;
}

const EnciasSection: React.FC<EnciasSectionProps> = ({ data, onChange }) => {
  const handleChange = (field: string, value: any) => {
    onChange(`encias.${field}`, value);
  };

  return (
    <div className="space-y-4 p-4 bg-white dark:bg-gray-900 rounded-lg border border-gray-100 dark:border-gray-800">
      <div className="flex items-center gap-2 mb-4">
        <Smile className="w-5 h-5 text-gray-600 dark:text-gray-400" />
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Encías</h3>
      </div>

      <div className="flex items-center gap-2 mb-4">
        <Checkbox
          id="encias-sinHallazgos"
          checked={data?.sinHallazgos || false}
          onCheckedChange={(checked) => {
            if (checked) {
              onChange('encias', { sinHallazgos: true });
            } else {
              handleChange('sinHallazgos', false);
            }
          }}
        />
        <Label htmlFor="encias-sinHallazgos" className="text-sm font-medium cursor-pointer">
          Sin anomalías (aparentemente sano)
        </Label>
      </div>

      {!data?.sinHallazgos && (
        <div className="space-y-3">
          <div>
            <Label className="text-sm">Color</Label>
            <Select value={data?.color || ""} onValueChange={(value) => handleChange('color', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar color" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="rosa-coral-puntilleo">Rosa coral pálido con puntilleo (aspecto fisiológico)</SelectItem>
                <SelectItem value="eritematoso-marginal">Eritematoso marginal (inflamación inicial)</SelectItem>
                <SelectItem value="cianotico-violaceo">Cianótico o violáceo (congestión venosa)</SelectItem>
                <SelectItem value="palido-blanquecino">Pálido blanquecino (fibrosis o isquemia)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label className="text-sm">Textura</Label>
            <Select value={data?.textura || ""} onValueChange={(value) => handleChange('textura', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar textura" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="firme-puntilleo">Firme con puntilleo superficial</SelectItem>
                <SelectItem value="lisa-edematosa">Lisa y edematosa</SelectItem>
                <SelectItem value="fibrotica-densa">Fibrótica o densa</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label className="text-sm">Margen gingival</Label>
            <Select value={data?.margenGingival || ""} onValueChange={(value) => handleChange('margenGingival', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar margen" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="delimitado-adherido">Delimitado y adherido al cuello dentario</SelectItem>
                <SelectItem value="engrosado-hiperplasico">Engrosado o hiperplásico</SelectItem>
                <SelectItem value="recesion-perdida">Con recesión o pérdida de inserción</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label className="text-sm">Superficie</Label>
            <Select value={data?.superficie || ""} onValueChange={(value) => handleChange('superficie', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar superficie" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="integra">Íntegra</SelectItem>
                <SelectItem value="ulcerada-pseudomembrana">Ulcerada o cubierta por pseudomembrana</SelectItem>
                <SelectItem value="sangrado-sondaje">Con sangrado espontáneo o al sondaje</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label className="text-sm">Placa o cálculo</Label>
            <Select value={data?.placaCalculo || ""} onValueChange={(value) => handleChange('placaCalculo', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar presencia" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ausente">Ausente visualmente</SelectItem>
                <SelectItem value="leve-moderada-abundante">Presencia leve, moderada o abundante</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label className="text-sm">Dolor/Sensibilidad</Label>
            <Select value={data?.dolor || ""} onValueChange={(value) => handleChange('dolor', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar dolor" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="sin-molestia">Sin molestia</SelectItem>
                <SelectItem value="dolorosa-sangrante">Dolorosa o sangrante al tacto</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {(data?.color || data?.contorno || data?.consistencia) && (
            <div>
              <Label className="text-sm">Observaciones</Label>
              <Textarea
                value={data?.observaciones || ""}
                onChange={(e) => handleChange('observaciones', e.target.value)}
                placeholder="Observaciones adicionales..."
                className="min-h-[80px]"
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default EnciasSection;
