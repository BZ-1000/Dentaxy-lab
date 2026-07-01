import { CLIQuestion } from '../useFormCLI';

export const dentalCLIQuestions: CLIQuestion[] = [
  // --- Master Skip ---
  {
    id: 'sinHallazgosDentales',
    text: '¿El examen intrabucal revela caries, lesiones de mucosa, mala oclusión o frenillos anormales?',
    type: 'options',
    options: [
      { id: 'true', label: 'No, cavidad bucal sana y oclusión normal (Chequeo de rutina)' },
      { id: 'false', label: 'Sí, presenta caries, lesiones, alteración salival u oclusión' }
    ]
  },
  // --- Intrabucal / Mucosas ---
  {
    id: 'intrabucal_normal',
    text: '¿Se observa alguna lesión o alteración en tejidos blandos (mejillas, lengua, paladar)?',
    type: 'options',
    options: [
      { id: 'normal', label: 'Mucosa oral sana y sin lesiones' },
      { id: 'alterado', label: 'Sí, presenta lesiones (aftas, úlceras, inflamación)' }
    ],
    condition: (answers) => answers.sinHallazgosDentales === 'false'
  },
  {
    id: 'intrabucal_detalles',
    text: 'Especifique el tipo de lesión, tamaño y localización:',
    type: 'text',
    placeholder: 'Ej. Úlcera aftosa de 3mm en mucosa yugal derecha...',
    condition: (answers) => answers.sinHallazgosDentales === 'false' && answers.intrabucal_normal === 'alterado'
  },
  // --- Odontograma ---
  {
    id: 'odontograma_sano',
    text: '¿El odontograma del paciente tiene alguna pieza con caries o ausente?',
    type: 'options',
    options: [
      { id: 'sano', label: 'Todas las piezas dentales sanas' },
      { id: 'hallazgos', label: 'Sí, deseo registrar caries, ausencias o restauraciones' }
    ],
    condition: (answers) => answers.sinHallazgosDentales === 'false'
  },
  {
    id: 'odontograma_detalles',
    text: 'Mencione las piezas dentales afectadas y sus hallazgos correspondientes:',
    type: 'text',
    placeholder: 'Ej. Caries en oclusal del 16, 46. Pieza 36 ausente...',
    condition: (answers) => answers.sinHallazgosDentales === 'false' && answers.odontograma_sano === 'hallazgos'
  },
  // --- Glándulas Salivales ---
  {
    id: 'salivales_normal',
    text: '¿Las glándulas salivales y el flujo salival presentan alguna alteración?',
    type: 'options',
    options: [
      { id: 'normal', label: 'Glándulas permeables y salivación adecuada' },
      { id: 'alterado', label: 'Sí, presenta alteración (hiposalivación / inflamación)' }
    ],
    condition: (answers) => answers.sinHallazgosDentales === 'false'
  },
  {
    id: 'salivales_detalles',
    text: 'Describa la alteración de las glándulas o flujo salival:',
    type: 'text',
    placeholder: 'Ej. Xerostomía moderada por consumo de medicamentos...',
    condition: (answers) => answers.sinHallazgosDentales === 'false' && answers.salivales_normal === 'alterado'
  },
  // --- Alteraciones Oclusales y Estructurales (Consolidado) ---
  {
    id: 'alteraciones_oclusales',
    text: '¿Existen alteraciones en la oclusión, relación de dientes, línea media o frenillos?',
    type: 'options',
    options: [
      { id: 'normal', label: 'No, oclusión Angle I, línea media coincidente, sin apiñamiento ni alteraciones' },
      { id: 'alterado', label: 'Sí, existen alteraciones (ej. mordida cruzada, diastemas, frenillo corto)' }
    ],
    condition: (answers) => answers.sinHallazgosDentales === 'false'
  },
  {
    id: 'alteraciones_oclusales_detalles',
    text: 'Dicte todas las alteraciones oclusales o estructurales encontradas:',
    type: 'text',
    placeholder: 'Ej. Mordida cruzada anterior, línea media desviada 2mm, y frenillo labial bajo...',
    condition: (answers) => answers.sinHallazgosDentales === 'false' && answers.alteraciones_oclusales === 'alterado'
  }
];
