import React from 'react';
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { SmilePlus } from "lucide-react";

interface MejillasSectionProps {
  data: any;
  onChange: (field: string, value: any) => void;
}

const MejillasSection: React.FC<MejillasSectionProps> = ({ data, onChange }) => {
  const handleChange = (field: string, value: any) => {
    onChange(`mejillas.${field}`, value);
  };

  return (
    <div className="space-y-4 p-4 bg-blue-50/30 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-800">
      <div className="flex items-center gap-2 mb-4">
        <SmilePlus className="w-5 h-5 text-blue-600 dark:text-blue-400" />
        <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100">Mejillas</h3>
      </div>

      <div className="flex items-center gap-2 mb-4">
        <Checkbox
          id="mejillas-sinHallazgos"
          checked={data?.sinHallazgos || false}
          onCheckedChange={(checked) => handleChange('sinHallazgos', checked)}
        />
        <Label htmlFor="mejillas-sinHallazgos" className="text-sm font-medium cursor-pointer">
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
                <SelectItem value="rosada">Rosada</SelectItem>
                <SelectItem value="palida">Pálida</SelectItem>
                <SelectItem value="eritematosa">Eritematosa</SelectItem>
                <SelectItem value="blanquecina">Blanquecina</SelectItem>
                <SelectItem value="grisacea">Grisácea</SelectItem>
                <SelectItem value="pigmentada">Pigmentada</SelectItem>
                <SelectItem value="amarillenta">Amarillenta</SelectItem>
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
                <SelectItem value="aterciopelada">Aterciopelada</SelectItem>
                <SelectItem value="rugosa">Rugosa</SelectItem>
                <SelectItem value="engrosada">Engrosada</SelectItem>
                <SelectItem value="fibrosa">Fibrosa</SelectItem>
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
                <SelectItem value="lineas-friccion">Con líneas de fricción</SelectItem>
                <SelectItem value="lesiones-blanquecinas">Con lesiones blanquecinas</SelectItem>
                <SelectItem value="lesiones-rojizas">Con lesiones rojizas</SelectItem>
                <SelectItem value="puntos-hemorragicos">Con puntos hemorrágicos</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label className="text-sm">Lesiones presentes</Label>
            <Select value={data?.lesionesPresentes || ""} onValueChange={(value) => handleChange('lesionesPresentes', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar lesiones" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ninguna">Ninguna</SelectItem>
                <SelectItem value="mordisqueo">Mordisqueo</SelectItem>
                <SelectItem value="leucoplasia">Leucoplasia</SelectItem>
                <SelectItem value="afta">Afta</SelectItem>
                <SelectItem value="vesiculas">Vesículas</SelectItem>
                <SelectItem value="petequias">Petequias</SelectItem>
                <SelectItem value="papulas">Pápulas</SelectItem>
                <SelectItem value="maculas">Máculas</SelectItem>
                <SelectItem value="placa-blanquecina">Placa blanquecina</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label className="text-sm">Ubicación</Label>
            <Select value={data?.ubicacion || ""} onValueChange={(value) => handleChange('ubicacion', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar ubicación" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="tercio-anterior">Tercio anterior</SelectItem>
                <SelectItem value="tercio-medio">Tercio medio</SelectItem>
                <SelectItem value="tercio-posterior">Tercio posterior</SelectItem>
                <SelectItem value="bilateral">Bilateral</SelectItem>
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

          <div>
            <Label className="text-sm">Secreción salival en zona de Stenon</Label>
            <Select value={data?.secrecionSalival || ""} onValueChange={(value) => handleChange('secrecionSalival', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar secreción" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="presente">Presente</SelectItem>
                <SelectItem value="ausente">Ausente</SelectItem>
                <SelectItem value="disminuida">Disminuida</SelectItem>
                <SelectItem value="purulenta">Purulenta</SelectItem>
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

export default MejillasSection;
