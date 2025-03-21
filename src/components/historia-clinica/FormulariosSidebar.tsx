import React from 'react';
import { Card } from "@/components/ui/card";
import { FormDataState, FormSection } from '@/types/historiaClinica';

interface FormulariosSidebarProps {
  currentSection: FormSection;
  onSectionChange: (section: FormSection) => void;
  formData: FormDataState;
  showPreviews: boolean;
  setShowPreviews: React.Dispatch<React.SetStateAction<boolean>>;
}

const FormulariosSidebar: React.FC<FormulariosSidebarProps> = ({
  currentSection,
  onSectionChange,
  formData,
  showPreviews,
  setShowPreviews
}) => {
  const sections = [
    { id: 'informacionPrincipal', label: 'Información Principal' },
    { id: 'padecimientoActual', label: 'Padecimiento Actual' },
    { id: 'antecedentesHeredoFamiliares', label: 'Antecedentes Heredo-Familiares' },
    { id: 'antecedentesPersonalesPatologicos', label: 'Antecedentes Personales Patológicos' },
    { id: 'antecedentesPersonalesNoPatologicos', label: 'Antecedentes Personales No Patológicos' },
    { id: 'antecedentesAlergicos', label: 'Antecedentes Alérgicos' },
    { id: 'antecedentesQuirurgicos', label: 'Antecedentes Quirúrgicos' },
    { id: 'antecedentesHemorragicos', label: 'Antecedentes Hemorrágicos' },
    { id: 'interrogatorioSistemas', label: 'Interrogatorio por Sistemas' },
    { id: 'exploracionFisica', label: 'Exploración Física' },
    { id: 'examenCabeza', label: 'Examen de Cabeza y Cuello' },
  ];

  return (
    <Card className="space-y-4 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-lg rounded-xl border-0">
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
          Secciones del Formulario
        </h3>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Navega a través de las diferentes secciones del formulario.
        </p>
      </div>
      <div className="space-y-2">
        {sections.map((section) => (
          <button
            key={section.id}
            className={`w-full text-left px-4 py-2 rounded-md text-sm font-medium
              ${currentSection === section.id
                ? 'bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-800 dark:hover:bg-blue-900'
                : 'bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600 dark:hover:text-gray-200'}
              transition-colors duration-200`}
            onClick={() => onSectionChange(section.id as FormSection)}
          >
            {section.label}
          </button>
        ))}
      </div>
    </Card>
  );
};

export default FormulariosSidebar;
