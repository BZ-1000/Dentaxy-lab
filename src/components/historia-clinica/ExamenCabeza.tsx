
import React, { useState, useEffect } from 'react';

interface ExamenCabezaProps {
  formValues: any;
  onFormChange: (property: string, value: string | boolean) => void;
}

const ExamenCabeza: React.FC<ExamenCabezaProps> = ({ formValues, onFormChange }) => {
  const [tieneLesiones, setTieneLesiones] = useState(formValues.tieneLesiones === 'true' || formValues.tieneLesiones === true);
  const [descripcionLesiones, setDescripcionLesiones] = useState(formValues.descripcionLesiones || '');

  useEffect(() => {
    setTieneLesiones(formValues.tieneLesiones === 'true' || formValues.tieneLesiones === true);
    setDescripcionLesiones(formValues.descripcionLesiones || '');
  }, [formValues]);

  const handleExamenCabezaChange = (property: string, value: string | boolean) => {
    const stringValue = typeof value === 'boolean' ? String(value) : value;
    onFormChange(`examenCabeza.${property}`, stringValue);
  };

  const handleTieneLesionesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.checked;
    setTieneLesiones(newValue);
    handleExamenCabezaChange('tieneLesiones', String(newValue));
  };

  const handleDescripcionLesionesChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    setDescripcionLesiones(newValue);
    handleExamenCabezaChange('descripcionLesiones', newValue);
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">
          ¿Tiene lesiones en la cabeza?
        </label>
        <div className="mt-2">
          <label className="inline-flex items-center">
            <input
              type="checkbox"
              className="form-checkbox h-5 w-5 text-blue-600"
              checked={tieneLesiones}
              onChange={handleTieneLesionesChange}
            />
            <span className="ml-2 text-gray-900">Sí</span>
          </label>
        </div>
      </div>

      {tieneLesiones && (
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Descripción de las lesiones
          </label>
          <div className="mt-2">
            <textarea
              rows={3}
              className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
              value={descripcionLesiones}
              onChange={handleDescripcionLesionesChange}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ExamenCabeza;
