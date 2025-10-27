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
            <Label className="text-sm">Tamaño</Label>
            <Select value={data?.tamanio || ""} onValueChange={(value) => handleChange('tamanio', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar tamaño" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="normal">Normal</SelectItem>
                <SelectItem value="aumentada">Aumentada</SelectItem>
                <SelectItem value="disminuida">Disminuida</SelectItem>
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
                <SelectItem value="rosada">Rosada</SelectItem>
                <SelectItem value="roja-brillante">Roja brillante</SelectItem>
                <SelectItem value="palida">Pálida</SelectItem>
                <SelectItem value="blanquecina">Blanquecina</SelectItem>
                <SelectItem value="violacea">Violácea</SelectItem>
                <SelectItem value="pigmentada">Pigmentada</SelectItem>
                <SelectItem value="amarillenta">Amarillenta</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label className="text-sm">Superficie dorsal</Label>
            <Select value={data?.superficieDorsal || ""} onValueChange={(value) => handleChange('superficieDorsal', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar superficie" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="lisa">Lisa</SelectItem>
                <SelectItem value="rugosa">Rugosa</SelectItem>
                <SelectItem value="fisurada">Fisurada</SelectItem>
                <SelectItem value="depapilada">Depapilada</SelectItem>
                <SelectItem value="geografica">Geográfica</SelectItem>
                <SelectItem value="saburral">Saburral</SelectItem>
                <SelectItem value="vellosa">Vellosa</SelectItem>
                <SelectItem value="areas-eritematosas">Con áreas eritematosas</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label className="text-sm">Bordes laterales</Label>
            <Select value={data?.bordesLaterales || ""} onValueChange={(value) => handleChange('bordesLaterales', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar bordes" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="integros">Íntegros</SelectItem>
                <SelectItem value="dentellados">Dentellados</SelectItem>
                <SelectItem value="ulcerados">Ulcerados</SelectItem>
                <SelectItem value="improntas-dentarias">Con improntas dentarias</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label className="text-sm">Cara ventral</Label>
            <Select value={data?.caraVentral || ""} onValueChange={(value) => handleChange('caraVentral', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar cara ventral" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="integra">Íntegra</SelectItem>
                <SelectItem value="varicosidades">Con varicosidades</SelectItem>
                <SelectItem value="telangiectasias">Con telangiectasias</SelectItem>
                <SelectItem value="ulcerada">Ulcerada</SelectItem>
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
                <SelectItem value="libre">Libre</SelectItem>
                <SelectItem value="limitada">Limitada</SelectItem>
                <SelectItem value="dolorosa">Dolorosa</SelectItem>
                <SelectItem value="desviada">Desviada</SelectItem>
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
                <SelectItem value="placa">Placa</SelectItem>
                <SelectItem value="macula">Mácula</SelectItem>
                <SelectItem value="papula">Pápula</SelectItem>
                <SelectItem value="fisura">Fisura</SelectItem>
                <SelectItem value="tumoracion">Tumoración</SelectItem>
                <SelectItem value="nodulo">Nódulo</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label className="text-sm">Sensación referida</Label>
            <Select value={data?.sensacionReferida || ""} onValueChange={(value) => handleChange('sensacionReferida', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar sensación" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="sin-alteracion">Sin alteración</SelectItem>
                <SelectItem value="ardor">Ardor</SelectItem>
                <SelectItem value="parestesia">Parestesia</SelectItem>
                <SelectItem value="dolor">Dolor</SelectItem>
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

          {(data?.tamanio || data?.color || data?.superficieDorsal) && (
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
