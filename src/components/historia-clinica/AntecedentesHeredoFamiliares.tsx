import React from 'react';
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

interface Familiar {
  finado: boolean;
  causaMuerte: string;
  condiciones: {
    diabetesMellitus: boolean;
    hipertensionArterial: boolean;
    cancer: boolean;
    otras: string;
  };
}

interface AntecedentesHeredoFamiliaresProps {
  formData: {
    antecedentesHeredoFamiliares: {
      padre: Familiar;
      madre: Familiar;
      abueloPaterno: Familiar;
      abuelaPaterna: Familiar;
      abueloMaterno: Familiar;
      abuelaMaterna: Familiar;
    };
  };
  handleFamiliarChange: (familiar: string, field: string, value: boolean | string) => void;
  handleCondicionChange: (familiar: string, condicion: string, value: boolean | string) => void;
}

const AntecedentesHeredoFamiliares = ({
  formData,
  handleFamiliarChange,
  handleCondicionChange
}: AntecedentesHeredoFamiliaresProps) => {
  const familiares = {
    padre: 'Padre',
    madre: 'Madre',
    abueloPaterno: 'Abuelo Paterno',
    abuelaPaterna: 'Abuela Paterna',
    abueloMaterno: 'Abuelo Materno',
    abuelaMaterna: 'Abuela Materna'
  };

  const condiciones = [
    { id: 'diabetesMellitus', label: 'Diabetes Mellitus' },
    { id: 'hipertensionArterial', label: 'Hipertensión Arterial' },
    { id: 'cancer', label: 'Cáncer' }
  ];

  return (
    <Card className="p-6">
      <h3 className="text-xl font-semibold mb-6">Antecedentes Heredo Familiares</h3>
      
      <div className="grid gap-6">
        {Object.entries(familiares).map(([key, label]) => (
          <div key={key} className="space-y-4 p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center justify-between">
              <h4 className="text-lg font-medium">{label}</h4>
              <div className="flex items-center gap-2">
                <Checkbox
                  checked={formData.antecedentesHeredoFamiliares[key].finado}
                  onCheckedChange={(checked) => handleFamiliarChange(key, 'finado', checked)}
                  id={`finado-${key}`}
                />
                <Label htmlFor={`finado-${key}`}>Finado</Label>
              </div>
            </div>

            {formData.antecedentesHeredoFamiliares[key].finado ? (
              <div className="mt-2">
                <Label htmlFor={`causa-${key}`}>Causa de muerte</Label>
                <Input
                  id={`causa-${key}`}
                  value={formData.antecedentesHeredoFamiliares[key].causaMuerte}
                  onChange={(e) => handleFamiliarChange(key, 'causaMuerte', e.target.value)}
                  placeholder="Especifique la causa"
                  className="mt-1"
                />
              </div>
            ) : (
              <div className="space-y-3">
                {condiciones.map((condicion) => (
                  <div key={condicion.id} className="flex items-center gap-2">
                    <Checkbox
                      id={`${key}-${condicion.id}`}
                      checked={formData.antecedentesHeredoFamiliares[key].condiciones[condicion.id]}
                      onCheckedChange={(checked) => handleCondicionChange(key, condicion.id, checked)}
                    />
                    <Label htmlFor={`${key}-${condicion.id}`}>{condicion.label}</Label>
                  </div>
                ))}
                <div className="mt-2">
                  <Label htmlFor={`otras-${key}`}>Otras condiciones</Label>
                  <Input
                    id={`otras-${key}`}
                    value={formData.antecedentesHeredoFamiliares[key].condiciones.otras}
                    onChange={(e) => handleCondicionChange(key, 'otras', e.target.value)}
                    placeholder="Especifique otras condiciones"
                    className="mt-1"
                  />
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </Card>
  );
};

export default AntecedentesHeredoFamiliares;