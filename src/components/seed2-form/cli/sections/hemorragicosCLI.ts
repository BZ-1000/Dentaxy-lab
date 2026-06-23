import { CLIQuestion } from '../useFormCLI';

export const hemorragicosCLIQuestions: CLIQuestion[] = [
  {
    id: 'sinHemorragicos',
    text: '¿Ha presentado problemas de sangrado prolongado o hemorragias difíciles de controlar?',
    type: 'options',
    options: [
      { id: 'true', label: 'No, coagulación normal' },
      { id: 'false', label: 'Sí, he tenido problemas de sangrado' }
    ]
  },
  {
    id: 'sangradoProlongado',
    text: '¿Tiene tendencia a presentar moretones (hematomas) con facilidad o sangrado espontáneo?',
    type: 'options',
    options: [
      { id: 'no', label: 'No, normal' },
      { id: 'si', label: 'Sí, hematomas frecuentes o sangrado de encías/nariz espontáneo' }
    ],
    condition: (answers) => answers.sinHemorragicos === 'false'
  },
  {
    id: 'transfusionPrevia',
    text: '¿Ha recibido alguna transfusión de sangre o componentes sanguíneos?',
    type: 'options',
    options: [
      { id: 'false', label: 'No' },
      { id: 'true', label: 'Sí' }
    ]
  },
  {
    id: 'motivoTransfusion',
    text: 'Describa el motivo y fecha aproximada de la transfusión:',
    type: 'text',
    placeholder: 'Ej. Por anemia severa tras cirugía en 2021...',
    condition: (answers) => answers.transfusionPrevia === 'true'
  }
];
