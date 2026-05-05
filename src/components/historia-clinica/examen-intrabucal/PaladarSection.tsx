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
    <div className="space-y-4 p-4 bg-white dark:bg-gray-900 rounded-lg border border-gray-100 dark:border-gray-800">
      <div className="flex items-center gap-2 mb-4">
        <Umbrella className="w-5 h-5 text-gray-600 dark:text-gray-400" />
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Paladar Duro y Blando</h3>
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
                <SelectItem value="rosa-palido-rugas">Rosa pálido en el paladar duro con rugas definidas (fisiológico)</SelectItem>
                <SelectItem value="rosa-salmon">Rosa salmón uniforme (paladar blando)</SelectItem>
                <SelectItem value="eritematoso-difuso">Eritematoso difuso</SelectItem>
                <SelectItem value="blanquecino-amarillento">Blanquecino o amarillento (queratosis o candidiasis)</SelectItem>
                <SelectItem value="pigmentado-marron">Pigmentado marrón claro</SelectItem>
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
                <SelectItem value="lisa-blando-rugosa-duro">Lisa en paladar blando, rugosa en paladar duro</SelectItem>
                <SelectItem value="engrosada-queratosica">Engrosada o queratósica</SelectItem>
                <SelectItem value="flacida-edematosa">Flácida o edematosa</SelectItem>
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
                <SelectItem value="petequias-hemorragicos">Con petequias o puntos hemorrágicos</SelectItem>
                <SelectItem value="placas-pseudomembranas">Con placas o pseudomembranas adherentes</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label className="text-sm">Forma/volumen</Label>
            <Select value={data?.forma || ""} onValueChange={(value) => handleChange('forma', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar forma" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="abovedado-regular">Abovedado regular</SelectItem>
                <SelectItem value="aplanado-deformidad">Aplanado o con deformidad leve</SelectItem>
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
                <SelectItem value="movilidad-conservada">Movilidad conservada del paladar blando</SelectItem>
                <SelectItem value="limitada-dolorosa">Limitada o dolorosa</SelectItem>
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
                <SelectItem value="sin-dolor">Sin dolor</SelectItem>
                <SelectItem value="dolor-palpacion-deglucion">Dolor a la palpación o deglución</SelectItem>
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
