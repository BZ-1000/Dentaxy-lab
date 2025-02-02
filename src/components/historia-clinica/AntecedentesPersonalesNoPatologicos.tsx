import React from 'react';
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

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

const AntecedentesPersonalesNoPatologicos: React.FC<AntecedentesPersonalesNoPatologicosProps> = ({
  formData,
  handleInputChange,
}) => {
  return (
    <Card className="p-6">
      <h3 className="text-xl font-semibold mb-6">III. Antecedentes Personales No Patológicos</h3>
      
      <div className="space-y-6">
        {/* Servicios Domiciliarios */}
        <div>
          <h4 className="text-lg font-medium mb-3">Servicios Domiciliarios</h4>
          <div className="grid gap-4">
            <div>
              <Label htmlFor="serviciosDomiciliarios">Servicios (agua, luz, drenaje, transporte)</Label>
              <Input
                id="serviciosDomiciliarios"
                name="serviciosDomiciliarios"
                value={formData.serviciosDomiciliarios}
                onChange={handleInputChange}
                placeholder="Especifique los servicios disponibles"
              />
            </div>
          </div>
        </div>

        {/* Higiene de la Vivienda */}
        <div>
          <h4 className="text-lg font-medium mb-3">Higiene de la Vivienda</h4>
          <div className="grid gap-4">
            <div>
              <Label htmlFor="frecuenciaLimpieza">Frecuencia de Limpieza</Label>
              <Input
                id="frecuenciaLimpieza"
                name="frecuenciaLimpieza"
                value={formData.frecuenciaLimpieza}
                onChange={handleInputChange}
                placeholder="¿Cada cuánto se realiza la limpieza?"
              />
            </div>
            <div>
              <Label htmlFor="hacinamiento">Hacinamiento</Label>
              <Input
                id="hacinamiento"
                name="hacinamiento"
                value={formData.hacinamiento}
                onChange={handleInputChange}
                placeholder="¿Existe hacinamiento?"
              />
            </div>
          </div>
        </div>

        {/* Higiene Personal */}
        <div>
          <h4 className="text-lg font-medium mb-3">Higiene Personal</h4>
          <div>
            <Label htmlFor="frecuenciaBano">Frecuencia de Baño</Label>
            <Input
              id="frecuenciaBano"
              name="frecuenciaBano"
              value={formData.frecuenciaBano}
              onChange={handleInputChange}
              placeholder="¿Con qué frecuencia se baña?"
            />
          </div>
        </div>

        {/* Higiene Bucal */}
        <div>
          <h4 className="text-lg font-medium mb-3">Higiene Bucal</h4>
          <div className="grid gap-4">
            <div>
              <Label htmlFor="higieneBucal.frecuenciaCepillado">Frecuencia de Cepillado</Label>
              <Input
                id="higieneBucal.frecuenciaCepillado"
                name="higieneBucal.frecuenciaCepillado"
                value={formData.higieneBucal.frecuenciaCepillado}
                onChange={handleInputChange}
                placeholder="¿Cuántas veces al día?"
              />
            </div>
            <div>
              <Label htmlFor="higieneBucal.usoHiloDental">Uso de Hilo Dental</Label>
              <Input
                id="higieneBucal.usoHiloDental"
                name="higieneBucal.usoHiloDental"
                value={formData.higieneBucal.usoHiloDental}
                onChange={handleInputChange}
                placeholder="¿Usa hilo dental?"
              />
            </div>
          </div>
        </div>

        {/* Alimentación */}
        <div>
          <h4 className="text-lg font-medium mb-3">Alimentación</h4>
          <div className="grid gap-4">
            <div>
              <Label htmlFor="alimentacion.tipoDieta">Tipo de Dieta</Label>
              <Input
                id="alimentacion.tipoDieta"
                name="alimentacion.tipoDieta"
                value={formData.alimentacion.tipoDieta}
                onChange={handleInputChange}
                placeholder="Describa el tipo de dieta"
              />
            </div>
            <div>
              <Label htmlFor="alimentacion.frecuenciaComidas">Frecuencia de Comidas</Label>
              <Input
                id="alimentacion.frecuenciaComidas"
                name="alimentacion.frecuenciaComidas"
                value={formData.alimentacion.frecuenciaComidas}
                onChange={handleInputChange}
                placeholder="Número de comidas al día"
              />
            </div>
          </div>
        </div>

        {/* Grupo Sanguíneo y Factor RH */}
        <div>
          <h4 className="text-lg font-medium mb-3">Grupo Sanguíneo y Factor RH</h4>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="grupoSanguineo">Grupo Sanguíneo</Label>
              <Input
                id="grupoSanguineo"
                name="grupoSanguineo"
                value={formData.grupoSanguineo}
                onChange={handleInputChange}
                placeholder="O, A, B, AB"
              />
            </div>
            <div>
              <Label htmlFor="factorRh">Factor RH</Label>
              <Input
                id="factorRh"
                name="factorRh"
                value={formData.factorRh}
                onChange={handleInputChange}
                placeholder="Positivo/Negativo"
              />
            </div>
          </div>
        </div>

        {/* Inmunizaciones */}
        <div>
          <h4 className="text-lg font-medium mb-3">Inmunizaciones</h4>
          <div>
            <Label htmlFor="inmunizaciones">Esquema de Vacunación</Label>
            <Textarea
              id="inmunizaciones"
              name="inmunizaciones"
              value={formData.inmunizaciones}
              onChange={handleInputChange}
              placeholder="Detalle el esquema de vacunación"
              className="min-h-[100px]"
            />
          </div>
        </div>
      </div>
    </Card>
  );
};

export default AntecedentesPersonalesNoPatologicos;