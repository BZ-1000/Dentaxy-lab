import React from 'react';
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Circle } from "lucide-react";

interface OrofaringeSectionProps {
  data: any;
  onChange: (field: string, value: any) => void;
}

const OrofaringeSection: React.FC<OrofaringeSectionProps> = ({ data, onChange }) => {
  const handleChange = (field: string, value: any) => {
    onChange(`orofaringe.${field}`, value);
  };

  return (
    <div className="space-y-4 p-4 bg-yellow-50/30 dark:bg-yellow-950/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
      <div className="flex items-center gap-2 mb-4">
        <Circle className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
        <h3 className="text-lg font-semibold text-yellow-900 dark:text-yellow-100">Orofaringe</h3>
      </div>

      <div className="flex items-center gap-2 mb-4">
        <Checkbox
          id="orofaringe-sinHallazgos"
          checked={data?.sinHallazgos || false}
          onCheckedChange={(checked) => {
            if (checked) {
              onChange('orofaringe', { sinHallazgos: true });
            } else {
              handleChange('sinHallazgos', false);
            }
          }}
        />
        <Label htmlFor="orofaringe-sinHallazgos" className="text-sm font-medium cursor-pointer">
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
                <SelectItem value="rosa-tenue-homogeneo">Rosa tenue y homogéneo (fisiológico)</SelectItem>
                <SelectItem value="eritematoso-brillante">Eritematoso brillante (faringitis o irritación)</SelectItem>
                <SelectItem value="congestivo-violaceo">Congestivo o violáceo</SelectItem>
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
                <SelectItem value="exudado-blanquecino">Con exudado blanquecino o amarillento</SelectItem>
                <SelectItem value="lesiones-vesiculosas">Con lesiones vesiculosas o ulceradas</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label className="text-sm">Amígdalas</Label>
            <Select value={data?.amigdalas || ""} onValueChange={(value) => handleChange('amigdalas', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="rosa-palido-sin-exudado">Rosa pálido, sin exudado</SelectItem>
                <SelectItem value="hipertroficas-congestivas">Hipertróficas o congestivas</SelectItem>
                <SelectItem value="puntos-purulentos">Con puntos purulentos en criptas</SelectItem>
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
                <SelectItem value="dolor-faringeo">Dolor faríngeo o disfagia leve</SelectItem>
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
                <SelectItem value="reflejo-presente">Reflejo nauseoso presente y simétrico</SelectItem>
                <SelectItem value="reflejo-disminuido">Reflejo disminuido o ausente</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {(data?.color || data?.superficie || data?.amigdalas) && (
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

export default OrofaringeSection;
