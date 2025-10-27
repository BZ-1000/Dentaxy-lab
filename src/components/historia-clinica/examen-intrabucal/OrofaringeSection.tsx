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
                <SelectItem value="rosado">Rosado</SelectItem>
                <SelectItem value="hipermico">Hiperémico</SelectItem>
                <SelectItem value="eritematoso">Eritematoso</SelectItem>
                <SelectItem value="violaceo">Violáceo</SelectItem>
                <SelectItem value="blanquecino">Blanquecino</SelectItem>
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
                <SelectItem value="lisa">Lisa</SelectItem>
                <SelectItem value="granular">Granular</SelectItem>
                <SelectItem value="exudado">Con exudado</SelectItem>
                <SelectItem value="pustulas">Con pústulas</SelectItem>
                <SelectItem value="vesiculas">Con vesículas</SelectItem>
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
                <SelectItem value="sin-aumento">Sin aumento</SelectItem>
                <SelectItem value="hipertrofiadas">Hipertrofiadas</SelectItem>
                <SelectItem value="congestivas">Congestivas</SelectItem>
                <SelectItem value="exudado">Con exudado</SelectItem>
                <SelectItem value="criptas">Con criptas</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label className="text-sm">Arcos palatoglosos/palatofaríngeos</Label>
            <Select value={data?.arcos || ""} onValueChange={(value) => handleChange('arcos', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="integros">Íntegros</SelectItem>
                <SelectItem value="enrojecidos">Enrojecidos</SelectItem>
                <SelectItem value="edematosos">Edematosos</SelectItem>
                <SelectItem value="ulcerados">Ulcerados</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-2">
            <Checkbox
              id="orofaringe-dolor"
              checked={data?.dolor || false}
              onCheckedChange={(checked) => handleChange('dolor', checked)}
            />
            <Label htmlFor="orofaringe-dolor" className="text-sm cursor-pointer">
              Dolor o molestia
            </Label>
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
                <SelectItem value="placa">Placa</SelectItem>
                <SelectItem value="absceso">Absceso</SelectItem>
                <SelectItem value="eritema">Eritema</SelectItem>
                <SelectItem value="papula">Pápula</SelectItem>
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
