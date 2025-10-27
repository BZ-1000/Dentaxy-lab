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
          onCheckedChange={(checked) => handleChange('sinHallazgos', checked)}
        />
        <Label htmlFor="istmoFauces-sinHallazgos" className="text-sm font-medium cursor-pointer">
          Sin hallazgos
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
                <SelectItem value="rosado">Rosado</SelectItem>
                <SelectItem value="palido">Pálido</SelectItem>
                <SelectItem value="eritematoso">Eritematoso</SelectItem>
                <SelectItem value="congestivo">Congestivo</SelectItem>
                <SelectItem value="cianotico">Cianótico</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label className="text-sm">Úvula palatina</Label>
            <Select value={data?.uvula || ""} onValueChange={(value) => handleChange('uvula', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar estado de la úvula" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="integra-centrada">Íntegra y centrada</SelectItem>
                <SelectItem value="elongada">Elongada</SelectItem>
                <SelectItem value="bifida">Bífida</SelectItem>
                <SelectItem value="desviada">Desviada</SelectItem>
                <SelectItem value="edematosa">Edematosa</SelectItem>
                <SelectItem value="ausente">Ausente</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label className="text-sm">Pilares del istmo</Label>
            <Select value={data?.pilares || ""} onValueChange={(value) => handleChange('pilares', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar estado de pilares" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="simetricos-integros">Simétricos e íntegros</SelectItem>
                <SelectItem value="hipertroficos">Hipertróficos</SelectItem>
                <SelectItem value="eritematosos">Eritematosos</SelectItem>
                <SelectItem value="asimetricos">Asimétricos</SelectItem>
                <SelectItem value="edematosos">Edematosos</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label className="text-sm">Reflejo nauseoso</Label>
            <Select value={data?.reflejoNauseoso || ""} onValueChange={(value) => handleChange('reflejoNauseoso', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar reflejo nauseoso" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="presente">Presente</SelectItem>
                <SelectItem value="ausente">Ausente</SelectItem>
                <SelectItem value="disminuido">Disminuido</SelectItem>
                <SelectItem value="exagerado">Exagerado</SelectItem>
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
                <SelectItem value="simetrico">Simétrico</SelectItem>
                <SelectItem value="asimetrico">Asimétrico</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-2">
            <Checkbox
              id="istmoFauces-inflamacion"
              checked={data?.inflamacion || false}
              onCheckedChange={(checked) => handleChange('inflamacion', checked)}
            />
            <Label htmlFor="istmoFauces-inflamacion" className="text-sm font-medium cursor-pointer">
              Signos de inflamación
            </Label>
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
