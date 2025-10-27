import React from 'react';
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Shapes } from "lucide-react";

interface IstmoFaucesSectionProps {
  data: any;
  onChange: (field: string, value: any) => void;
}

const IstmoFaucesSection: React.FC<IstmoFaucesSectionProps> = ({ data, onChange }) => {
  const handleChange = (field: string, value: any) => {
    onChange(`istmoFauces.${field}`, value);
  };

  return (
    <div className="space-y-4 p-4 bg-teal-50/30 dark:bg-teal-950/20 rounded-lg border border-teal-200 dark:border-teal-800">
      <div className="flex items-center gap-2 mb-4">
        <Shapes className="w-5 h-5 text-teal-600 dark:text-teal-400" />
        <h3 className="text-lg font-semibold text-teal-900 dark:text-teal-100">Istmo de las Fauces</h3>
      </div>

      <div className="flex items-center gap-2 mb-4">
        <Checkbox
          id="istmoFauces-sinHallazgos"
          checked={data?.sinHallazgos || false}
          onCheckedChange={(checked) => {
            if (checked) {
              onChange('istmoFauces', { sinHallazgos: true });
            } else {
              handleChange('sinHallazgos', false);
            }
          }}
        />
        <Label htmlFor="istmoFauces-sinHallazgos" className="text-sm font-medium cursor-pointer">
          Sin anomalías (aparentemente sano)
        </Label>
      </div>

      {!data?.sinHallazgos && (
        <div className="space-y-3">
          <div>
            <Label className="text-sm">Amplitud</Label>
            <Select value={data?.amplitud || ""} onValueChange={(value) => handleChange('amplitud', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar amplitud" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="adecuada">Adecuada</SelectItem>
                <SelectItem value="amplia">Amplia</SelectItem>
                <SelectItem value="estrecha">Estrecha</SelectItem>
                <SelectItem value="reducida">Reducida</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label className="text-sm">Color de la mucosa</Label>
            <Select value={data?.colorMucosa || ""} onValueChange={(value) => handleChange('colorMucosa', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar color" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="rosa-palido-homogeneo">Rosa pálido y homogéneo (fisiológico)</SelectItem>
                <SelectItem value="eritematoso-difuso">Eritematoso difuso (irritación faríngea)</SelectItem>
                <SelectItem value="congestivo-vasos">Congestivo con vasos dilatados</SelectItem>
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
                <SelectItem value="exudado-placa">Con exudado o placa blanca</SelectItem>
                <SelectItem value="ulcerada-erosionada">Ulcerada o erosionada</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label className="text-sm">Amígdalas y pilares</Label>
            <Select value={data?.amigdalas || ""} onValueChange={(value) => handleChange('amigdalas', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="rosa-coral-simetricos">Rosa coral pálido, simétricos</SelectItem>
                <SelectItem value="aumentados-volumen">Aumentados de volumen</SelectItem>
                <SelectItem value="exudado-purulento">Con exudado purulento</SelectItem>
                <SelectItem value="asimetricos-hipertroficos">Asimétricos o hipertróficos</SelectItem>
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
                <SelectItem value="movilidad-reflejo">Movilidad y reflejo conservados</SelectItem>
                <SelectItem value="dolor-limitacion">Dolor o limitación al hablar o deglutir</SelectItem>
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
                <SelectItem value="dolor-irradiado">Dolor leve o irradiado a oído</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {(data?.amplitud || data?.colorMucosa || data?.uvula) && (
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

export default IstmoFaucesSection;
