import { CLIQuestion } from '../useFormCLI';

export const alergicosCLIQuestions: CLIQuestion[] = [
  {
    id: 'medicamentos_alergico',
    text: '¿Es alérgico a algún medicamento (ej. penicilina, analgésicos, etc.)?',
    type: 'options',
    options: [
      { id: 'false', label: 'No, niega alergias a medicamentos' },
      { id: 'true', label: 'Sí, refiere alergia farmacológica' }
    ]
  },
  {
    id: 'medicamentos_cuales',
    text: '¿A qué medicamentos es alérgico y qué reacción presenta?',
    type: 'text',
    placeholder: 'Ej. Penicilina (urticaria y disnea)...',
    condition: (answers) => answers.medicamentos_alergico === 'true'
  },
  {
    id: 'alimentos_alergico',
    text: '¿Tiene alergias a alimentos?',
    type: 'options',
    options: [
      { id: 'false', label: 'No' },
      { id: 'true', label: 'Sí' }
    ]
  },
  {
    id: 'alimentos_cuales',
    text: '¿A qué alimentos es alérgico?',
    type: 'text',
    placeholder: 'Ej. Nueces, mariscos, fresas...',
    condition: (answers) => answers.alimentos_alergico === 'true'
  },
  {
    id: 'latex_alergico',
    text: '¿Es alérgico al látex?',
    type: 'options',
    options: [
      { id: 'false', label: 'No' },
      { id: 'true', label: 'Sí' }
    ]
  },
  {
    id: 'reaccionAnestesia',
    text: '¿Ha tenido alguna mala reacción a la anestesia dental previa?',
    type: 'options',
    options: [
      { id: 'false', label: 'No, ninguna mala reacción' },
      { id: 'true', label: 'Sí, he tenido reacciones' }
    ]
  },
  {
    id: 'descripcionReaccionAnestesia',
    text: 'Describa la reacción que tuvo (taquicardia, mareo, alergia):',
    type: 'text',
    placeholder: 'Ej. Taquicardia severa y nerviosismo...',
    condition: (answers) => answers.reaccionAnestesia === 'true'
  }
];
