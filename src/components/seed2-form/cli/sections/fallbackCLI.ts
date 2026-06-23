import { CLIQuestion } from '../useFormCLI';

export const getFallbackCLIQuestions = (sectionName: string): CLIQuestion[] => [
  {
    id: 'placeholder',
    text: `(En construcción) Estás en la sección: ${sectionName}. Presiona 1 para continuar.`,
    type: 'options',
    options: [
      { id: 'next', label: 'Continuar a la siguiente sección' }
    ]
  }
];
