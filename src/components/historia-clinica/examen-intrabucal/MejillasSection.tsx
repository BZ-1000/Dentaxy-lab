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
    <div className="space-y-4 p-4 bg-white dark:bg-gray-900 rounded-lg border border-gray-100 dark:border-gray-800">
      <div className="flex items-center gap-2 mb-4">
        <SmilePlus className="w-5 h-5 text-gray-600 dark:text-gray-400" />
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Mejillas</h3>
      </div>

      <div className="flex items-center gap-2 mb-4">
        <Checkbox
          id="mejillas-sinHallazgos"
          checked={data?.sinHallazgos || false}
          onCheckedChange={(checked) => {
            if (checked) {
              onChange('mejillas', { sinHallazgos: true });
            } else {
              handleChange('sinHallazgos', false);
            }
          }}
        />
        <Label htmlFor="mejillas-sinHallazgos" className="text-sm font-medium cursor-pointer">
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
                <SelectItem value="rosa-coral-uniforme">Rosa coral uniforme (mucosa sana)</SelectItem>
                <SelectItem value="rosa-palido">Rosa pálido (hipovascularización leve)</SelectItem>
                <SelectItem value="eritematoso-difuso">Eritematoso difuso (hiperemia o inflamación leve)</SelectItem>
                <SelectItem value="pigmentado-marron-grisaceo">Pigmentado marrón claro a grisáceo (melanosis fisiológica o tatuaje por amalgama)</SelectItem>
                <SelectItem value="cianotico">Cianótico (congestión venosa o hipoxia local)</SelectItem>
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
                <SelectItem value="lisa-humeda-brillante">Lisa, húmeda y brillante</SelectItem>
                <SelectItem value="seca-descamada">Seca o descamada</SelectItem>
                <SelectItem value="engrosada-firme">Engrosada o firme al tacto</SelectItem>
                <SelectItem value="rugosa-queratosica">Rugosa o queratósica</SelectItem>
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
                <SelectItem value="integra">Íntegra sin interrupciones epiteliales</SelectItem>
                <SelectItem value="erosiones-ulceraciones">Con erosiones o ulceraciones</SelectItem>
                <SelectItem value="placas-blanquecinas">Con placas blanquecinas adherentes (queratosis, leucoplasia, candidiasis)</SelectItem>
                <SelectItem value="vesiculas-ampollas">Con vesículas, ampollas o costras</SelectItem>
                <SelectItem value="mordisqueo">Con zonas de mordisqueo o fibrillas (morsicatio buccarum)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label className="text-sm">Lesiones o alteraciones</Label>
            <Select value={data?.lesionesPresentes || ""} onValueChange={(value) => handleChange('lesionesPresentes', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar lesiones" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ninguna">Ninguna</SelectItem>
                <SelectItem value="afta-ulcera">Afta o úlcera traumática</SelectItem>
                <SelectItem value="hematoma-equimosis">Hematoma o equimosis submucosa</SelectItem>
                <SelectItem value="nodulo-abultamiento">Nódulo o abultamiento palpable</SelectItem>
                <SelectItem value="secrecion-purulenta">Secreción purulenta o absceso localizado</SelectItem>
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
                <SelectItem value="stenon-permeable">Salida del conducto de Stenon visible, permeable y sin secreción anormal</SelectItem>
                <SelectItem value="obstruccion-stenon">Obstrucción o secreción anormal del conducto de Stenon</SelectItem>
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
                <SelectItem value="sin-dolor">Sin respuesta dolorosa al tacto</SelectItem>
                <SelectItem value="dolor-localizado">Dolor localizado o ardor al contacto</SelectItem>
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
