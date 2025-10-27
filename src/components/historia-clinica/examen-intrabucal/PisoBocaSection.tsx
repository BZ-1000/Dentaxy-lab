import React from 'react';
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Mountain } from "lucide-react";

interface PisoBocaSectionProps {
  data: any;
  onChange: (field: string, value: any) => void;
}

const PisoBocaSection: React.FC<PisoBocaSectionProps> = ({ data, onChange }) => {
  const handleChange = (field: string, value: any) => {
    onChange(`pisoBoca.${field}`, value);
  };

  return (
    <div className="space-y-4 p-4 bg-purple-50/30 dark:bg-purple-950/20 rounded-lg border border-purple-200 dark:border-purple-800">
      <div className="flex items-center gap-2 mb-4">
        <Mountain className="w-5 h-5 text-purple-600 dark:text-purple-400" />
        <h3 className="text-lg font-semibold text-purple-900 dark:text-purple-100">Piso de Boca</h3>
      </div>

      <div className="flex items-center gap-2 mb-4">
        <Checkbox
          id="pisoBoca-sinHallazgos"
          checked={data?.sinHallazgos || false}
          onCheckedChange={(checked) => {
            if (checked) {
              onChange('pisoBoca', { sinHallazgos: true });
            } else {
              handleChange('sinHallazgos', false);
            }
          }}
        />
        <Label htmlFor="pisoBoca-sinHallazgos" className="text-sm font-medium cursor-pointer">
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
                <SelectItem value="rosa-brillante-vascular">Rosa brillante con leve transparencia vascular (fisiológico)</SelectItem>
                <SelectItem value="eritematoso-congestivo">Eritematoso con congestión capilar</SelectItem>
                <SelectItem value="palido-blanquecino">Pálido o blanquecino local</SelectItem>
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
                <SelectItem value="lisa-humeda">Lisa y húmeda</SelectItem>
                <SelectItem value="edematosa-fluctuante">Edematosa o fluctuante</SelectItem>
                <SelectItem value="indurada-tensa">Indurada o tensa</SelectItem>
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
                <SelectItem value="elevacion-nodular">Con elevación nodular (quiste, ránula)</SelectItem>
                <SelectItem value="ulcerada-erosionada">Ulcerada o erosionada</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label className="text-sm">Lesiones o alteraciones</Label>
            <Select value={data?.lesiones || ""} onValueChange={(value) => handleChange('lesiones', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar lesiones" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ninguna">Ninguna</SelectItem>
                <SelectItem value="varices-sublinguales">Varices sublinguales</SelectItem>
                <SelectItem value="masa-palpable">Masa palpable o induración localizada</SelectItem>
                <SelectItem value="calculo-wharton">Cálculo o secreción por conducto de Wharton</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label className="text-sm">Funcionalidad</Label>
            <Select value={data?.funcionalidad || ""} onValueChange={(value) => handleChange('funcionalidad', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar funcionalidad" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="wharton-permeable">Conducto de Wharton permeable y con salida salival clara</SelectItem>
                <SelectItem value="obstruccion-turbia">Obstrucción o secreción turbia</SelectItem>
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
                <SelectItem value="sin-dolor">Sin respuesta dolorosa</SelectItem>
                <SelectItem value="dolor-tension">Dolor o tensión a la palpación</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {(data?.color || data?.textura || data?.superficie) && (
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

export default PisoBocaSection;
