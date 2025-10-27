import React from 'react';
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Umbrella } from "lucide-react";

interface PaladarSectionProps {
  data: any;
  onChange: (field: string, value: any) => void;
}

const PaladarSection: React.FC<PaladarSectionProps> = ({ data, onChange }) => {
  const handleChange = (field: string, value: any) => {
    onChange(`paladar.${field}`, value);
  };

  return (
    <div className="space-y-4 p-4 bg-green-50/30 dark:bg-green-950/20 rounded-lg border border-green-200 dark:border-green-800">
      <div className="flex items-center gap-2 mb-4">
        <Umbrella className="w-5 h-5 text-green-600 dark:text-green-400" />
        <h3 className="text-lg font-semibold text-green-900 dark:text-green-100">Paladar Duro y Blando</h3>
      </div>

      <div className="flex items-center gap-2 mb-4">
        <Checkbox
          id="paladar-sinHallazgos"
          checked={data?.sinHallazgos || false}
          onCheckedChange={(checked) => {
            if (checked) {
              onChange('paladar', { sinHallazgos: true });
            } else {
              handleChange('sinHallazgos', false);
            }
          }}
        />
        <Label htmlFor="paladar-sinHallazgos" className="text-sm font-medium cursor-pointer">
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
                <SelectItem value="rosado">Rosado</SelectItem>
                <SelectItem value="eritematoso">Eritematoso</SelectItem>
                <SelectItem value="palido">Pálido</SelectItem>
                <SelectItem value="blanquecino">Blanquecino</SelectItem>
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
                <SelectItem value="rugosa">Rugosa (paladar duro)</SelectItem>
                <SelectItem value="lisa">Lisa</SelectItem>
                <SelectItem value="edematosa">Edematosa</SelectItem>
                <SelectItem value="atrofica">Atrófica</SelectItem>
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
                <SelectItem value="fisurada">Fisurada</SelectItem>
                <SelectItem value="ulcerada">Ulcerada</SelectItem>
                <SelectItem value="petequias">Con petequias</SelectItem>
                <SelectItem value="placas">Con placas</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label className="text-sm">Movilidad (paladar blando)</Label>
            <Select value={data?.movilidad || ""} onValueChange={(value) => handleChange('movilidad', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar movilidad" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="libre">Libre</SelectItem>
                <SelectItem value="limitada">Limitada</SelectItem>
                <SelectItem value="dolorosa">Dolorosa</SelectItem>
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
                <SelectItem value="ulcera">Úlcera</SelectItem>
                <SelectItem value="papula">Pápula</SelectItem>
                <SelectItem value="nodulo">Nódulo</SelectItem>
                <SelectItem value="vesicula">Vesícula</SelectItem>
                <SelectItem value="placa">Placa</SelectItem>
                <SelectItem value="eritema">Eritema</SelectItem>
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

export default PaladarSection;
