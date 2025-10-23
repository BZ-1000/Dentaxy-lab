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
          onCheckedChange={(checked) => handleChange('sinHallazgos', checked)}
        />
        <Label htmlFor="pisoBoca-sinHallazgos" className="text-sm font-medium cursor-pointer">
          Sin hallazgos
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
                <SelectItem value="rosado">Rosado</SelectItem>
                <SelectItem value="rojizo">Rojizo</SelectItem>
                <SelectItem value="palido">Pálido</SelectItem>
                <SelectItem value="cianotico">Cianótico</SelectItem>
                <SelectItem value="pigmentado">Pigmentado</SelectItem>
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
                <SelectItem value="lisa">Lisa</SelectItem>
                <SelectItem value="edematosa">Edematosa</SelectItem>
                <SelectItem value="brillante">Brillante</SelectItem>
                <SelectItem value="tensa">Tensa</SelectItem>
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
                <SelectItem value="ulcerada">Ulcerada</SelectItem>
                <SelectItem value="elevada">Elevada</SelectItem>
                <SelectItem value="tumoracion">Con tumoración</SelectItem>
                <SelectItem value="vesiculas">Con vesículas</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label className="text-sm">Secreción salival (conducto de Wharton)</Label>
            <Select value={data?.secrecionSalival || ""} onValueChange={(value) => handleChange('secrecionSalival', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar secreción" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="abundante">Abundante</SelectItem>
                <SelectItem value="escasa">Escasa</SelectItem>
                <SelectItem value="ausente">Ausente</SelectItem>
                <SelectItem value="purulenta">Purulenta</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label className="text-sm">Movilidad de frenillo</Label>
            <Select value={data?.movilidadFrenillo || ""} onValueChange={(value) => handleChange('movilidadFrenillo', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar movilidad" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="libre">Libre</SelectItem>
                <SelectItem value="corta">Corta</SelectItem>
                <SelectItem value="fibrosa">Fibrosa</SelectItem>
                <SelectItem value="adherida">Adherida</SelectItem>
                <SelectItem value="tensa">Tensa</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label className="text-sm">Lesiones</Label>
            <Select value={data?.lesiones || ""} onValueChange={(value) => handleChange('lesiones', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar lesiones" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ninguna">Ninguna</SelectItem>
                <SelectItem value="ranula">Ránula</SelectItem>
                <SelectItem value="ulcera">Úlcera</SelectItem>
                <SelectItem value="papula">Pápula</SelectItem>
                <SelectItem value="nodulo">Nódulo</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label className="text-sm">Simetría</Label>
            <Select value={data?.simetria || ""} onValueChange={(value) => handleChange('simetria', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar simetría" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="simetrica">Simétrica</SelectItem>
                <SelectItem value="asimetrica">Asimétrica</SelectItem>
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
