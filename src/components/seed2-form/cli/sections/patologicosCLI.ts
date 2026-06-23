import { CLIQuestion } from '../useFormCLI';

export const patologicosCLIQuestions: CLIQuestion[] = [
  {
    id: 'sinPatologia',
    text: '¿El paciente padece de alguna enfermedad sistémica activa?',
    type: 'options',
    options: [
      { id: 'true', label: 'No, niega enfermedades (Aparentemente sano)' },
      { id: 'false', label: 'Sí, refiere padecer alguna condición' }
    ]
  },
  {
    id: 'cardiacos',
    text: '¿Padece alguna alteración cardíaca o circulatoria?',
    type: 'options',
    options: [
      { id: 'no', label: 'No, ninguna' },
      { id: 'hipertension', label: 'Hipertensión arterial' },
      { id: 'arritmia', label: 'Arritmias o cardiopatías' }
    ],
    condition: (answers) => answers.sinPatologia === 'false'
  },
  {
    id: 'diabetes',
    text: '¿Padece de Diabetes Mellitus?',
    type: 'options',
    options: [
      { id: 'no', label: 'No' },
      { id: 'si', label: 'Sí (Diabetes)' }
    ],
    condition: (answers) => answers.sinPatologia === 'false'
  },
  {
    id: 'pulmonares',
    text: '¿Padece de alguna afección pulmonar o respiratoria?',
    type: 'options',
    options: [
      { id: 'no', label: 'No' },
      { id: 'asma', label: 'Asma' },
      { id: 'epoc', label: 'EPOC o bronquitis crónica' }
    ],
    condition: (answers) => answers.sinPatologia === 'false'
  },
  {
    id: 'otrosPadecimientos',
    text: '¿Tiene alguna otra enfermedad (vih, hepatitis, problemas renales, etc.)?',
    type: 'options',
    options: [
      { id: 'no', label: 'No, ninguna otra' },
      { id: 'si', label: 'Sí, deseo especificar otras' }
    ],
    condition: (answers) => answers.sinPatologia === 'false'
  },
  {
    id: 'otrosDetalles',
    text: 'Escriba las otras patologías que padece y sus medicamentos o control:',
    type: 'text',
    placeholder: 'Ej. Hipotiroidismo controlado con levotiroxina...',
    condition: (answers) => answers.sinPatologia === 'false' && answers.otrosPadecimientos === 'si'
  }
];
