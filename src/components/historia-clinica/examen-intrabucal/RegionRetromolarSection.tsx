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
    <div className="space-y-4 p-4 bg-white dark:bg-gray-900 rounded-lg border border-gray-100 dark:border-gray-800">
      <div className="flex items-center gap-2 mb-4">
        <Triangle className="w-5 h-5 text-gray-600 dark:text-gray-400" />
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Región Retromolar</h3>
      </div>

      <div className="flex items-center gap-2 mb-4">
        <Checkbox
          id="regionRetromolar-sinHallazgos"
          checked={data?.sinHallazgos || false}
          onCheckedChange={(checked) => {
            if (checked) {
              onChange('regionRetromolar', { sinHallazgos: true });
            } else {
              handleChange('sinHallazgos', false);
            }
          }}
        />
        <Label htmlFor="regionRetromolar-sinHallazgos" className="text-sm font-medium cursor-pointer">
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
                <SelectItem value="rosa-coral-uniforme">Rosa coral uniforme (fisiológico)</SelectItem>
                <SelectItem value="eritematoso-localizado">Eritematoso localizado</SelectItem>
                <SelectItem value="blanquecino-palido">Blanquecino o pálido</SelectItem>
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
                <SelectItem value="ulcerada-erosionada">Ulcerada o erosionada</SelectItem>
                <SelectItem value="fibrosis-cicatriz">Con fibrosis o cicatriz</SelectItem>
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
                <SelectItem value="lisa-blanda">Lisa y blanda</SelectItem>
                <SelectItem value="firme-indurada">Firme o indurada</SelectItem>
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
                <SelectItem value="ulcera-traumatica">Úlcera traumática</SelectItem>
                <SelectItem value="nodulo-fibroso">Nódulo fibroso</SelectItem>
                <SelectItem value="dolor-palpacion">Dolor a la palpación</SelectItem>
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
                <SelectItem value="dolorosa-masticar">Dolorosa al masticar o al tacto</SelectItem>
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

export default RegionRetromolarSection;
