import { CLIQuestion } from '../useFormCLI';

export const heredofamiliaresCLIQuestions: CLIQuestion[] = [
  {
    id: 'padre_estado',
    text: '¿Tu padre vive y está sano o presenta alguna condición?',
    type: 'options',
    options: [
      { id: 'sano', label: 'Está vivo y aparentemente sano' },
      { id: 'finado', label: 'Finado (Fallecido)' },
      { id: 'enfermo', label: 'Presenta alguna condición o enfermedad' }
    ]
  },
  {
    id: 'padre_causa',
    text: '¿Cuál fue la causa de su fallecimiento?',
    type: 'text',
    placeholder: 'Ej. Infarto agudo al miocardio, complicaciones de diabetes...',
    condition: (answers) => answers.padre_estado === 'finado'
  },
  {
    id: 'padre_condiciones',
    text: '¿Qué diagnóstico o enfermedad padece tu padre?',
    type: 'options',
    options: [
      { id: 'diabetes', label: 'Diabetes Mellitus' },
      { id: 'hipertension', label: 'Hipertensión Arterial' },
      { id: 'cancer', label: 'Cáncer' },
      { id: 'otras', label: 'Otras condiciones' }
    ],
    condition: (answers) => answers.padre_estado === 'enfermo'
  },
  {
    id: 'padre_otras_desc',
    text: 'Especifique la enfermedad o condición de su padre:',
    type: 'text',
    placeholder: 'Ej. Insuficiencia renal, artritis...',
    condition: (answers) => answers.padre_estado === 'enfermo' && answers.padre_condiciones === 'otras'
  },
  {
    id: 'madre_estado',
    text: '¿Tu madre vive y está sana o presenta alguna condición?',
    type: 'options',
    options: [
      { id: 'sano', label: 'Está viva y aparentemente sana' },
      { id: 'finado', label: 'Finada (Fallecida)' },
      { id: 'enfermo', label: 'Presenta alguna condición o enfermedad' }
    ]
  },
  {
    id: 'madre_causa',
    text: '¿Cuál fue la causa de su fallecimiento?',
    type: 'text',
    placeholder: 'Ej. Cáncer de mama, vejez...',
    condition: (answers) => answers.madre_estado === 'finado'
  },
  {
    id: 'madre_condiciones',
    text: '¿Qué diagnóstico o enfermedad padece tu madre?',
    type: 'options',
    options: [
      { id: 'diabetes', label: 'Diabetes Mellitus' },
      { id: 'hipertension', label: 'Hipertensión Arterial' },
      { id: 'cancer', label: 'Cáncer' },
      { id: 'otras', label: 'Otras condiciones' }
    ],
    condition: (answers) => answers.madre_estado === 'enfermo'
  },
  {
    id: 'madre_otras_desc',
    text: 'Especifique la enfermedad o condición de su madre:',
    type: 'text',
    placeholder: 'Ej. Hipotiroidismo, asma...',
    condition: (answers) => answers.madre_estado === 'enfermo' && answers.madre_condiciones === 'otras'
  },
  {
    id: 'otros_familiares',
    text: '¿Algún otro familiar directo (abuelos, hermanos) con diabetes, hipertensión o cáncer?',
    type: 'options',
    options: [
      { id: 'no', label: 'No, ninguno' },
      { id: 'si', label: 'Sí, otros familiares presentan condiciones' }
    ]
  },
  {
    id: 'otros_familiares_desc',
    text: 'Mencione qué familiar y qué condición presenta:',
    type: 'text',
    placeholder: 'Ej. Abuelo paterno con hipertensión, hermano con asma...',
    condition: (answers) => answers.otros_familiares === 'si'
  }
];
