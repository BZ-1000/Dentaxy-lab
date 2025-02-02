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
    osteoporosis: boolean;
    artritisReumatoide: boolean;
    parkinson: boolean;
    alzheimer: boolean;
    asma: boolean;
    cancer: boolean;
    anemia: boolean;
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
    { id: 'osteoporosis', label: 'Osteoporosis' },
    { id: 'artritisReumatoide', label: 'Artritis Reumatoide' },
    { id: 'parkinson', label: 'Parkinson' },
    { id: 'alzheimer', label: 'Alzheimer' },
    { id: 'asma', label: 'Asma' },
    { id: 'cancer', label: 'Cáncer' },
    { id: 'anemia', label: 'Anemia' }
  ];

  return (
    <Card className="p-6">
      <h3 className="text-xl font-semibold mb-4">Antecedentes Heredo Familiares</h3>
      
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-100">
              <th className="border p-2 text-left">Familiar</th>
              <th className="border p-2 text-center">Finado</th>
              <th className="border p-2">Causa de Muerte</th>
              {!Object.values(formData.antecedentesHeredoFamiliares).some(f => f.finado) && (
                <>
                  {condiciones.map(condicion => (
                    <th key={condicion.id} className="border p-2">{condicion.label}</th>
                  ))}
                  <th className="border p-2">Otras</th>
                </>
              )}
            </tr>
          </thead>
          <tbody>
            {Object.entries(familiares).map(([key, label]) => (
              <tr key={key} className="border-b">
                <td className="border p-2 font-medium">{label}</td>
                <td className="border p-2 text-center">
                  <Checkbox
                    checked={formData.antecedentesHeredoFamiliares[key].finado}
                    onCheckedChange={(checked) => handleFamiliarChange(key, 'finado', checked)}
                  />
                </td>
                <td className="border p-2">
                  {formData.antecedentesHeredoFamiliares[key].finado && (
                    <Input
                      value={formData.antecedentesHeredoFamiliares[key].causaMuerte}
                      onChange={(e) => handleFamiliarChange(key, 'causaMuerte', e.target.value)}
                      placeholder="Causa de muerte"
                    />
                  )}
                </td>
                {!formData.antecedentesHeredoFamiliares[key].finado && (
                  <>
                    {condiciones.map(condicion => (
                      <td key={condicion.id} className="border p-2 text-center">
                        <Checkbox
                          checked={formData.antecedentesHeredoFamiliares[key].condiciones[condicion.id]}
                          onCheckedChange={(checked) => handleCondicionChange(key, condicion.id, checked)}
                        />
                      </td>
                    ))}
                    <td className="border p-2">
                      <Input
                        value={formData.antecedentesHeredoFamiliares[key].condiciones.otras}
                        onChange={(e) => handleCondicionChange(key, 'otras', e.target.value)}
                        placeholder="Especifique otras condiciones"
                      />
                    </td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
};

export default AntecedentesHeredoFamiliares;