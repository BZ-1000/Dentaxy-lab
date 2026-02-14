import React from 'react';
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Waves } from "lucide-react";

interface LenguaSectionProps {
  data: any;
  onChange: (field: string, value: any) => void;
}

const LenguaSection: React.FC<LenguaSectionProps> = ({ data, onChange }) => {
  const handleChange = (field: string, value: any) => {
    onChange(`lengua.${field}`, value);
  };

  return (
    <div className="space-y-4 p-4 bg-pink-50/30 dark:bg-pink-950/20 rounded-lg border border-pink-200 dark:border-pink-800">
      <div className="flex items-center gap-2 mb-4">
        <Waves className="w-5 h-5 text-pink-600 dark:text-pink-400" />
        <h3 className="text-lg font-semibold text-pink-900 dark:text-pink-100">Lengua</h3>
      </div>

      <div className="flex items-center gap-2 mb-4">
        <Checkbox
          id="lengua-sinHallazgos"
          checked={data?.sinHallazgos || false}
          onCheckedChange={(checked) => {
            if (checked) {
              onChange('lengua', { sinHallazgos: true });
            } else {
              handleChange('sinHallazgos', false);
            }
          }}
        />
        <Label htmlFor="lengua-sinHallazgos" className="text-sm font-medium cursor-pointer">
          Sin anomalías (aparentemente sano)
        </Label>
      </div>

      {!data?.sinHallazgos && (
        <div className="space-y-3">
          <div>
            <Label className="text-sm">Textura</Label>
            <Select value={data?.textura || ""} onValueChange={(value) => handleChange('textura', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar textura" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="humeda-blanda">Superficie húmeda y blanda</SelectItem>
                <SelectItem value="fisurada">Fisurada con surcos lineales</SelectItem>
                <SelectItem value="lisa-brillante">Lisa y brillante (glositis atrófica)</SelectItem>
                <SelectItem value="rugosa-saburra">Rugosa con saburra adherente</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label className="text-sm">Color</Label>
            <Select value={data?.color || ""} onValueChange={(value) => handleChange('color', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar color" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="rosa-palido-papilas">Rosa pálido con papilas filiformes visibles (color fisiológico)</SelectItem>
                <SelectItem value="blanco-amarillento">Blanco amarillento por saburra ligera</SelectItem>
                <SelectItem value="eritematoso-brillante">Eritematoso brillante (inflamación o atrofia papilar)</SelectItem>
                <SelectItem value="marron-negruzco">Marrón oscuro o negruzco (lengua pilosa)</SelectItem>
                <SelectItem value="rosado-depapilado">Rosado con áreas depapiladas en forma de mapa (glositis migratoria)</SelectItem>
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
                <SelectItem value="ulcerada-erosionada">Con lesiones ulceradas o erosiones superficiales</SelectItem>
                <SelectItem value="placas-delimitadas">Con placas blanquecinas o eritematosas delimitadas</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label className="text-sm">Forma y tamaño</Label>
            <Select value={data?.forma || ""} onValueChange={(value) => handleChange('forma', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar forma y tamaño" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="simetrica-proporcionada">Simétrica y proporcionada</SelectItem>
                <SelectItem value="macroglosia">Aumentada de volumen (macroglosia)</SelectItem>
                <SelectItem value="improntas-laterales">Con improntas dentales laterales</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label className="text-sm">Movilidad</Label>
            <Select value={data?.movilidad || ""} onValueChange={(value) => handleChange('movilidad', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar movilidad" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="libre-completa">Libre y completa</SelectItem>
                <SelectItem value="limitada-anquiloglosia">Limitada por anquiloglosia o dolor</SelectItem>
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
                <SelectItem value="sin-sensibilidad">Sin sensibilidad alterada</SelectItem>
                <SelectItem value="dolor-ardor">Dolor o ardor lingual (glosodinia)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {(data?.textura || data?.color || data?.superficie) && (
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

export default LenguaSection;
