import React from 'react';
import { FormDataState } from '@/types/historiaClinica';

interface ExploracionFisicaProps {
  formData: FormDataState;
  handleExploracionFisicaChange: (part: string, value: string | boolean) => void;
}

const ExploracionFisica: React.FC<ExploracionFisicaProps> = ({
  formData,
  handleExploracionFisicaChange
}) => {
  // Fix spread argument errors by converting the spread to a proper array
  const handleChange = (category: string, field: string, value: string) => {
    // Use proper type-safe approach instead of spreads
    if (category === 'signosVitales') {
      const updatedSignosVitales = {
        ...formData.exploracionFisica.signosVitales,
        [field]: value
      };
      
      handleExploracionFisicaChange('signosVitales', updatedSignosVitales);
    } else if (category === 'exploracion') {
      const updatedExploracion = {
        ...formData.exploracionFisica.exploracion,
        [field]: value
      };
      
      handleExploracionFisicaChange('exploracion', updatedExploracion);
    }
  };
  
  return (
    <div className="p-4 border rounded-md">
      <h2 className="text-xl font-bold mb-4">Exploración Física</h2>
      
      <div className="mb-4">
        <h3 className="text-lg font-semibold mb-2">Signos Vitales</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium">Temperatura</label>
            <input
              type="text"
              value={formData.exploracionFisica.signosVitales.temperatura || ''}
              onChange={(e) => handleChange('signosVitales', 'temperatura', e.target.value)}
              className="mt-1 block w-full border rounded-md p-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Presión Arterial</label>
            <input
              type="text"
              value={formData.exploracionFisica.signosVitales.ta || ''}
              onChange={(e) => handleChange('signosVitales', 'ta', e.target.value)}
              className="mt-1 block w-full border rounded-md p-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Frecuencia Cardíaca</label>
            <input
              type="text"
              value={formData.exploracionFisica.signosVitales.fc || ''}
              onChange={(e) => handleChange('signosVitales', 'fc', e.target.value)}
              className="mt-1 block w-full border rounded-md p-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Frecuencia Respiratoria</label>
            <input
              type="text"
              value={formData.exploracionFisica.signosVitales.fr || ''}
              onChange={(e) => handleChange('signosVitales', 'fr', e.target.value)}
              className="mt-1 block w-full border rounded-md p-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Peso</label>
            <input
              type="text"
              value={formData.exploracionFisica.signosVitales.peso || ''}
              onChange={(e) => handleChange('signosVitales', 'peso', e.target.value)}
              className="mt-1 block w-full border rounded-md p-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Talla</label>
            <input
              type="text"
              value={formData.exploracionFisica.signosVitales.talla || ''}
              onChange={(e) => handleChange('signosVitales', 'talla', e.target.value)}
              className="mt-1 block w-full border rounded-md p-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">IMC</label>
            <input
              type="text"
              value={formData.exploracionFisica.signosVitales.imc || ''}
              onChange={(e) => handleChange('signosVitales', 'imc', e.target.value)}
              className="mt-1 block w-full border rounded-md p-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Pulso</label>
            <input
              type="text"
              value={formData.exploracionFisica.signosVitales.pulso || ''}
              onChange={(e) => handleChange('signosVitales', 'pulso', e.target.value)}
              className="mt-1 block w-full border rounded-md p-2"
            />
          </div>
        </div>
      </div>
      
      {/* Rest of your component */}
    </div>
  );
};

export default ExploracionFisica;
