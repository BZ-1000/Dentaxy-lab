import { CLIQuestion } from '../useFormCLI';

export const cabezaCLIQuestions: CLIQuestion[] = [
  {
    id: 'cabeza_hallazgos',
    text: '¿Existen hallazgos clínicos o asimetrías en el examen de Cabeza y cara?',
    type: 'options',
    options: [
      { id: 'normal', label: 'Sin hallazgos patológicos (Sano)' },
      { id: 'alterado', label: 'Sí, presenta alteraciones o cicatrices' }
    ]
  },
  {
    id: 'cabeza_detalles',
    text: 'Escriba los hallazgos o cicatrices observados:',
    type: 'text',
    placeholder: 'Ej. Cicatriz quirúrgica en mentón de 2cm...',
    condition: (answers) => answers.cabeza_hallazgos === 'alterado'
  }
];

export const atmCLIQuestions: CLIQuestion[] = [
  {
    id: 'atm_ruidos',
    text: '¿El paciente presenta ruidos o chasquidos en la articulación (ATM)?',
    type: 'options',
    options: [
      { id: 'false', label: 'No, ATM asintomática sin ruidos' },
      { id: 'true', label: 'Sí, chasquido o crepitación audible' }
    ]
  },
  {
    id: 'atm_dolor',
    text: '¿El paciente refiere dolor a la palpación o al abrir la boca?',
    type: 'options',
    options: [
      { id: 'false', label: 'No refiere dolor' },
      { id: 'true', label: 'Sí, refiere dolor' }
    ]
  },
  {
    id: 'atm_observaciones',
    text: 'Observaciones adicionales de la ATM:',
    type: 'text',
    placeholder: 'Ej. Desviación de la línea media en apertura hacia la izquierda...'
  }
];

export const cuelloCLIQuestions: CLIQuestion[] = [
  {
    id: 'cuello_normal',
    text: '¿El cuello presenta alguna alteración o ganglios inflamados (adenopatías)?',
    type: 'options',
    options: [
      { id: 'normal', label: 'Cuello normal sin ganglios palpables' },
      { id: 'alterado', label: 'Sí, se palpan ganglios o adenopatías' }
    ]
  },
  {
    id: 'cuello_detalles',
    text: 'Especifique la localización y características de los ganglios palpados:',
    type: 'text',
    placeholder: 'Ej. Ganglios submandibulares derechos inflamados y móviles...',
    condition: (answers) => answers.cuello_normal === 'alterado'
  }
];

export const intrabucalCLIQuestions: CLIQuestion[] = [
  {
    id: 'intrabucal_normal',
    text: '¿Se observa alguna lesión o alteración en tejidos blandos (mejillas, lengua, paladar)?',
    type: 'options',
    options: [
      { id: 'normal', label: 'Mucosa oral sana y sin lesiones' },
      { id: 'alterado', label: 'Sí, presenta lesiones (aftas, úlceras, inflamación)' }
    ]
  },
  {
    id: 'intrabucal_detalles',
    text: 'Especifique el tipo de lesión, tamaño y localización:',
    type: 'text',
    placeholder: 'Ej. Úlcera aftosa de 3mm en mucosa yugal derecha...',
    condition: (answers) => answers.intrabucal_normal === 'alterado'
  }
];

export const odontogramaCLIQuestions: CLIQuestion[] = [
  {
    id: 'odontograma_sano',
    text: '¿El odontograma del paciente tiene alguna pieza con caries o ausente?',
    type: 'options',
    options: [
      { id: 'sano', label: 'Todas las piezas dentales sanas' },
      { id: 'hallazgos', label: 'Sí, deseo registrar caries, ausencias o restauraciones' }
    ]
  },
  {
    id: 'odontograma_detalles',
    text: 'Mencione las piezas dentales afectadas y sus hallazgos correspondientes:',
    type: 'text',
    placeholder: 'Ej. Caries en oclusal del 16, 46. Pieza 36 ausente...',
    condition: (answers) => answers.odontograma_sano === 'hallazgos'
  }
];

export const salivalesCLIQuestions: CLIQuestion[] = [
  {
    id: 'salivales_normal',
    text: '¿Las glándulas salivales y el flujo salival presentan alguna alteración?',
    type: 'options',
    options: [
      { id: 'normal', label: 'Glándulas permeables y salivación adecuada' },
      { id: 'alterado', label: 'Sí, presenta alteración (hiposalivación / inflamación)' }
    ]
  },
  {
    id: 'salivales_detalles',
    text: 'Describa la alteración de las glándulas o flujo salival:',
    type: 'text',
    placeholder: 'Ej. Xerostomía moderada por consumo de medicamentos...',
    condition: (answers) => answers.salivales_normal === 'alterado'
  }
];

export const oclusionCLIQuestions: CLIQuestion[] = [
  {
    id: 'clasificacionAngle',
    text: '¿Cuál es la clasificación de Angle u oclusión del paciente?',
    type: 'options',
    options: [
      { id: 'Clase I', label: 'Clase I (Normal)' },
      { id: 'Clase II', label: 'Clase II' },
      { id: 'Clase III', label: 'Clase III' }
    ]
  },
  {
    id: 'mordidaAnormal',
    text: '¿Presenta alguna mordida cruzada o mordida abierta?',
    type: 'options',
    options: [
      { id: 'no', label: 'No' },
      { id: 'cruzada', label: 'Mordida Cruzada' },
      { id: 'abierta', label: 'Mordida Abierta' },
      { id: 'ambas', label: 'Ambas mordidas' }
    ]
  }
];

export const relacionDientesCLIQuestions: CLIQuestion[] = [
  {
    id: 'relacion_normal',
    text: '¿La relación interdental presenta apiñamiento o diastemas?',
    type: 'options',
    options: [
      { id: 'normal', label: 'Alineación y relación interdental normal' },
      { id: 'apiniamiento', label: 'Apiñamiento dental' },
      { id: 'diastemas', label: 'Diastemas' },
      { id: 'ambos', label: 'Apiñamiento y diastemas' }
    ]
  },
  {
    id: 'relacion_observaciones',
    text: 'Observaciones de la relación de dientes:',
    type: 'text',
    placeholder: 'Ej. Apiñamiento leve en sector anteroinferior...'
  }
];

export const lineaMediaCLIQuestions: CLIQuestion[] = [
  {
    id: 'coincidente',
    text: '¿La línea media dental es coincidente?',
    type: 'options',
    options: [
      { id: 'true', label: 'Sí, coincidente' },
      { id: 'false', label: 'No, desviada' }
    ]
  },
  {
    id: 'desviacion',
    text: 'Describa la desviación de la línea media (ej. Desviada 2mm a la derecha):',
    type: 'text',
    placeholder: 'Ej. Desviada 2mm a la derecha en maxilar superior...',
    condition: (answers) => answers.coincidente === 'false'
  }
];

export const frenillosCLIQuestions: CLIQuestion[] = [
  {
    id: 'frenillos_normal',
    text: '¿Los frenillos labiales o lingual presentan inserción baja o anormal?',
    type: 'options',
    options: [
      { id: 'normal', label: 'Frenillos normales y funcionales' },
      { id: 'anormal', label: 'Sí, inserción anormal' }
    ]
  },
  {
    id: 'frenillos_detalles',
    text: 'Especifique cuál frenillo y sus características:',
    type: 'text',
    placeholder: 'Ej. Frenillo labial superior con inserción baja y tracción...',
    condition: (answers) => answers.frenillos_normal === 'anormal'
  }
];
