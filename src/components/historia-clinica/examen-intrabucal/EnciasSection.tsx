import React from 'react';
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Smile } from "lucide-react";

interface EnciasSectionProps {
  data: any;
  onChange: (field: string, value: any) => void;
}

const EnciasSection: React.FC<EnciasSectionProps> = ({ data, onChange }) => {
  const handleChange = (field: string, value: any) => {
    onChange(`encias.${field}`, value);
  };

  return (
    <div className="space-y-4 p-4 bg-red-50/30 dark:bg-red-950/20 rounded-lg border border-red-200 dark:border-red-800">
      <div className="flex items-center gap-2 mb-4">
        <Smile className="w-5 h-5 text-red-600 dark:text-red-400" />
        <h3 className="text-lg font-semibold text-red-900 dark:text-red-100">Encías</h3>
      </div>

      <div className="flex items-center gap-2 mb-4">
        <Checkbox
          id="encias-sinHallazgos"
          checked={data?.sinHallazgos || false}
          onCheckedChange={(checked) => handleChange('sinHallazgos', checked)}
        />
        <Label htmlFor="encias-sinHallazgos" className="text-sm font-medium cursor-pointer">
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
                <SelectItem value="rosa-coral">Rosa coral</SelectItem>
                <SelectItem value="eritematosa">Eritematosa</SelectItem>
                <SelectItem value="palida">Pálida</SelectItem>
                <SelectItem value="cianotica">Cianótica</SelectItem>
                <SelectItem value="pigmentada">Pigmentada</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label className="text-sm">Contorno</Label>
            <Select value={data?.contorno || ""} onValueChange={(value) => handleChange('contorno', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar contorno" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="festoneado">Festoneado</SelectItem>
                <SelectItem value="irregular">Irregular</SelectItem>
                <SelectItem value="aumentado">Aumentado</SelectItem>
                <SelectItem value="retraido">Retraído</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label className="text-sm">Consistencia</Label>
            <Select value={data?.consistencia || ""} onValueChange={(value) => handleChange('consistencia', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar consistencia" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="firme">Firme</SelectItem>
                <SelectItem value="blanda">Blanda</SelectItem>
                <SelectItem value="esponjosa">Esponjosa</SelectItem>
                <SelectItem value="fibrosa">Fibrosa</SelectItem>
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
                <SelectItem value="punteada">Punteada</SelectItem>
                <SelectItem value="lisa">Lisa</SelectItem>
                <SelectItem value="brillante">Brillante</SelectItem>
                <SelectItem value="edematosa">Edematosa</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label className="text-sm">Margen gingival</Label>
            <Select value={data?.margenGingival || ""} onValueChange={(value) => handleChange('margenGingival', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar margen" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="definido">Definido</SelectItem>
                <SelectItem value="engrosado">Engrosado</SelectItem>
                <SelectItem value="retraido">Retraído</SelectItem>
                <SelectItem value="ulcerado">Ulcerado</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-2">
            <Checkbox
              id="encias-sangrado"
              checked={data?.sangrado || false}
              onCheckedChange={(checked) => handleChange('sangrado', checked)}
            />
            <Label htmlFor="encias-sangrado" className="text-sm cursor-pointer">
              Sangrado al contacto
            </Label>
          </div>

          <div>
            <Label className="text-sm">Presencia de placa o cálculo</Label>
            <Select value={data?.placaCalculo || ""} onValueChange={(value) => handleChange('placaCalculo', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar presencia" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ausente">Ausente</SelectItem>
                <SelectItem value="leve">Leve</SelectItem>
                <SelectItem value="moderado">Moderado</SelectItem>
                <SelectItem value="severo">Severo</SelectItem>
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
                <SelectItem value="absceso">Absceso</SelectItem>
                <SelectItem value="pigmentacion">Pigmentación</SelectItem>
                <SelectItem value="agrandamiento">Agrandamiento</SelectItem>
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

          {(data?.color || data?.contorno || data?.consistencia) && (
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

export default EnciasSection;
