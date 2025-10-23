import React from 'react';
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Triangle } from "lucide-react";

interface RegionRetromolarSectionProps {
  data: any;
  onChange: (field: string, value: any) => void;
}

const RegionRetromolarSection: React.FC<RegionRetromolarSectionProps> = ({ data, onChange }) => {
  const handleChange = (field: string, value: any) => {
    onChange(`regionRetromolar.${field}`, value);
  };

  return (
    <div className="space-y-4 p-4 bg-cyan-50/30 dark:bg-cyan-950/20 rounded-lg border border-cyan-200 dark:border-cyan-800">
      <div className="flex items-center gap-2 mb-4">
        <Triangle className="w-5 h-5 text-cyan-600 dark:text-cyan-400" />
        <h3 className="text-lg font-semibold text-cyan-900 dark:text-cyan-100">Región Retromolar / Fauces / Istmo de las Fauces</h3>
      </div>

      <div className="flex items-center gap-2 mb-4">
        <Checkbox
          id="regionRetromolar-sinHallazgos"
          checked={data?.sinHallazgos || false}
          onCheckedChange={(checked) => handleChange('sinHallazgos', checked)}
        />
        <Label htmlFor="regionRetromolar-sinHallazgos" className="text-sm font-medium cursor-pointer">
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
                <SelectItem value="eritematoso">Eritematoso</SelectItem>
                <SelectItem value="blanquecino">Blanquecino</SelectItem>
                <SelectItem value="violaceo">Violáceo</SelectItem>
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
                <SelectItem value="rugosa">Rugosa</SelectItem>
                <SelectItem value="edematosa">Edematosa</SelectItem>
                <SelectItem value="fibrotica">Fibrótica</SelectItem>
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
                <SelectItem value="placas">Con placas</SelectItem>
                <SelectItem value="nodulos">Con nódulos</SelectItem>
                <SelectItem value="exudado">Con exudado</SelectItem>
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
                <SelectItem value="vesicula">Vesícula</SelectItem>
                <SelectItem value="placa">Placa</SelectItem>
                <SelectItem value="tumoracion">Tumoración</SelectItem>
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

          <div className="flex items-center gap-2">
            <Checkbox
              id="regionRetromolar-dolorPalpacion"
              checked={data?.dolorPalpacion || false}
              onCheckedChange={(checked) => handleChange('dolorPalpacion', checked)}
            />
            <Label htmlFor="regionRetromolar-dolorPalpacion" className="text-sm cursor-pointer">
              Dolor a la palpación
            </Label>
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

export default RegionRetromolarSection;
