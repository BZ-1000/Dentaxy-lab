import React from 'react';
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { CustomCheckbox } from "@/components/ui/custom-checkbox";

interface AntecedentesPersonalesNoPatologicosProps {
  formData: {
    serviciosDomiciliarios: string;
    pisosVivienda: string;
    materialVivienda: string;
    materialPiso: string;
    ventilacion: string;
    frecuenciaLimpieza: string;
    hacinamiento: string;
    frecuenciaBano: string;
    higieneBucal: {
      frecuenciaCepillado: string;
      usoHiloDental: string;
      tipoCerdas: string;
      cantidadPasta: string;
      marcaPasta: string;
    };
    alimentacion: {
      tipoDieta: string;
      frecuenciaComidas: string;
      tiposAlimentos: string;
      saltaComidas: string;
      consumoNutritivo: string;
    };
    grupoSanguineo: string;
    factorRh: string;
    inmunizaciones: string;
  };
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

const AntecedentesPersonalesNoPatologicos = ({
  formData,
  handleInputChange,
}: AntecedentesPersonalesNoPatologicosProps) => {
  return (
    <Card className="p-6">
      <h3 className="text-xl font-semibold mb-4">III. Antecedentes Personales No Patológicos</h3>
      
      {/* Servicios Domiciliarios */}
      <div className="space-y-4 mb-6">
        <h4 className="text-lg font-medium">Servicios Domiciliarios</h4>
        <div className="grid gap-4">
          <div>
            <Label>Tipo de Vivienda</Label>
            <RadioGroup defaultValue="urbana" className="flex gap-4">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="urbana" id="urbana" />
                <Label htmlFor="urbana">Urbana</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="rural" id="rural" />
                <Label htmlFor="rural">Rural</Label>
              </div>
            </RadioGroup>
          </div>
          <div>
            <Label>Servicios</Label>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center space-x-2">
                <CustomCheckbox id="agua" />
                <Label htmlFor="agua">Agua</Label>
              </div>
              <div className="flex items-center space-x-2">
                <CustomCheckbox id="luz" />
                <Label htmlFor="luz">Luz</Label>
              </div>
              <div className="flex items-center space-x-2">
                <CustomCheckbox id="drenaje" />
                <Label htmlFor="drenaje">Drenaje</Label>
              </div>
              <div className="flex items-center space-x-2">
                <CustomCheckbox id="transporte" />
                <Label htmlFor="transporte">Transporte</Label>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Higiene de la Vivienda */}
      <div className="space-y-4 mb-6">
        <h4 className="text-lg font-medium">Higiene de la Vivienda</h4>
        <div className="grid gap-4">
          <div>
            <Label>Frecuencia de Limpieza</Label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Seleccione frecuencia" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="diaria">Diaria</SelectItem>
                <SelectItem value="semanal">Semanal</SelectItem>
                <SelectItem value="quincenal">Quincenal</SelectItem>
                <SelectItem value="mensual">Mensual</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Hacinamiento</Label>
            <div className="flex items-center space-x-2">
              <CustomCheckbox id="hacinamiento" />
              <Label htmlFor="hacinamiento">Presente</Label>
            </div>
          </div>
        </div>
      </div>

      {/* Higiene Personal */}
      <div className="space-y-4 mb-6">
        <h4 className="text-lg font-medium">Higiene Personal</h4>
        <div className="grid gap-4">
          <div>
            <Label>Frecuencia de Baño</Label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Seleccione frecuencia" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="diario">Diario</SelectItem>
                <SelectItem value="cada-tercer-dia">Cada tercer día</SelectItem>
                <SelectItem value="semanal">Semanal</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Higiene Bucal */}
      <div className="space-y-4 mb-6">
        <h4 className="text-lg font-medium">Higiene Bucal</h4>
        <div className="grid gap-4">
          <div>
            <Label>Frecuencia de Cepillado</Label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Seleccione frecuencia" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">1 vez al día</SelectItem>
                <SelectItem value="2">2 veces al día</SelectItem>
                <SelectItem value="3">3 veces al día</SelectItem>
                <SelectItem value="mas">Más de 3 veces al día</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Auxiliares de Higiene</Label>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center space-x-2">
                <CustomCheckbox id="hilo-dental" />
                <Label htmlFor="hilo-dental">Hilo Dental</Label>
              </div>
              <div className="flex items-center space-x-2">
                <CustomCheckbox id="enjuague" />
                <Label htmlFor="enjuague">Enjuague Bucal</Label>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Grupo Sanguíneo y Factor RH */}
      <div className="space-y-4 mb-6">
        <h4 className="text-lg font-medium">Grupo Sanguíneo y Factor RH</h4>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label>Grupo Sanguíneo</Label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Seleccione grupo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="O">O</SelectItem>
                <SelectItem value="A">A</SelectItem>
                <SelectItem value="B">B</SelectItem>
                <SelectItem value="AB">AB</SelectItem>
                <SelectItem value="desconoce">Desconoce</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Factor RH</Label>
            <RadioGroup defaultValue="positivo" className="flex gap-4">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="positivo" id="rh-positivo" />
                <Label htmlFor="rh-positivo">Positivo</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="negativo" id="rh-negativo" />
                <Label htmlFor="rh-negativo">Negativo</Label>
              </div>
            </RadioGroup>
          </div>
        </div>
      </div>

      {/* Inmunizaciones */}
      <div className="space-y-4">
        <h4 className="text-lg font-medium">Inmunizaciones</h4>
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <CustomCheckbox id="esquema-completo" />
            <Label htmlFor="esquema-completo">Esquema de vacunación completo</Label>
          </div>
          <div className="flex items-center space-x-2">
            <CustomCheckbox id="cartilla" />
            <Label htmlFor="cartilla">Cuenta con cartilla nacional de vacunación</Label>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default AntecedentesPersonalesNoPatologicos;