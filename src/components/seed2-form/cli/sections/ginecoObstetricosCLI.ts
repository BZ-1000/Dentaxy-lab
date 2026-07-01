import { CLIQuestion } from '../useFormCLI';

export const ginecoObstetricosCLIQuestions: CLIQuestion[] = [
  {
    id: 'go_embarazo',
    text: '¿La paciente se encuentra embarazada o en período de lactancia?',
    type: 'options',
    options: [
      { id: 'false', label: 'No' },
      { id: 'true', label: 'Sí' }
    ]
  },
  {
    id: 'go_meses',
    text: 'Especifique si es embarazo (meses) o lactancia:',
    type: 'text',
    placeholder: 'Ej. Embarazo de 3 meses, o Lactancia activa...',
    condition: (answers) => answers.go_embarazo === 'true'
  },
  {
    id: 'go_complicaciones',
    text: '¿Ha tenido complicaciones obstétricas previas?',
    type: 'options',
    options: [
      { id: 'false', label: 'No, ninguna' },
      { id: 'true', label: 'Sí, refiere complicaciones' }
    ]
  },
  {
    id: 'go_complicaciones_detalle',
    text: 'Especifique las complicaciones obstétricas previas:',
    type: 'text',
    placeholder: 'Ej. Preeclampsia, parto prematuro...',
    condition: (answers) => answers.go_complicaciones === 'true'
  }
];
