import React from 'react';
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CustomCheckbox } from "@/components/ui/custom-checkbox";

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
      <h3 className="text-xl font-semibold mb-4">Antecedentes Heredo Familiares</h3>
      
      <div className="space-y-4">
        <table className="w-full">
          <thead>
            <tr className="text-left">
              <th className="py-2">Familiar</th>
              <th className="py-2 text-center">Finado</th>
              {condiciones.map(condicion => (
                <th key={condicion.id} className="py-2 text-center">{condicion.label}</th>
              ))}
              <th className="py-2">Otras</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(familiares).map(([key, label]) => (
              <React.Fragment key={key}>
                <tr className="border-t border-gray-100">
                  <td className="py-3 font-medium">{label}</td>
                  <td className="py-3 text-center">
                    <CustomCheckbox
                      checked={formData.antecedentesHeredoFamiliares[key].finado}
                      onCheckedChange={(checked) => handleFamiliarChange(key, 'finado', checked)}
                    />
                  </td>
                  {condiciones.map(condicion => (
                    <td key={condicion.id} className="py-3 text-center">
                      <CustomCheckbox
                        checked={formData.antecedentesHeredoFamiliares[key].condiciones[condicion.id]}
                        onCheckedChange={(checked) => handleCondicionChange(key, condicion.id, checked)}
                        disabled={formData.antecedentesHeredoFamiliares[key].finado}
                      />
                    </td>
                  ))}
                  <td className="py-3">
                    <Input
                      value={formData.antecedentesHeredoFamiliares[key].condiciones.otras}
                      onChange={(e) => handleCondicionChange(key, 'otras', e.target.value)}
                      placeholder="Especifique otras condiciones"
                      disabled={formData.antecedentesHeredoFamiliares[key].finado}
                      className="w-full"
                    />
                  </td>
                </tr>
                {formData.antecedentesHeredoFamiliares[key].finado && (
                  <tr>
                    <td colSpan={6} className="py-2">
                      <Input
                        value={formData.antecedentesHeredoFamiliares[key].causaMuerte}
                        onChange={(e) => handleFamiliarChange(key, 'causaMuerte', e.target.value)}
                        placeholder="Causa de muerte"
                        className="w-full"
                      />
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
};

export default AntecedentesHeredoFamiliares;