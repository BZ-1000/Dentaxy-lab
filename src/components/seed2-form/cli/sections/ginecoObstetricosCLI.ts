import { CLIQuestion } from '../useFormCLI';

export const ginecoObstetricosCLIQuestions: CLIQuestion[] = [
  {
    id: 'embarazo',
    text: '¿La paciente se encuentra embarazada actualmente?',
    type: 'options',
    options: [
      { id: 'false', label: 'No' },
      { id: 'true', label: 'Sí' }
    ]
  },
  {
    id: 'meses_embarazo',
    text: '¿Cuántos meses de gestación tiene?',
    type: 'text',
    placeholder: 'Ej. 3 meses, segundo trimestre...',
    condition: (answers) => answers.embarazo === 'true'
  }
];
