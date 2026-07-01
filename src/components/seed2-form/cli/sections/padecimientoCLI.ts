import { CLIQuestion } from '../useFormCLI';

export const padecimientoCLIQuestions: CLIQuestion[] = [
  {
    id: 'motivoConsulta',
    text: '¿Cuál es el motivo de la consulta hoy?',
    type: 'text',
    placeholder: 'Ej. Dolor en muela, limpieza, revisión...',
    defaultValue: ''
  },
  {
    id: 'sinSintomas',
    text: '¿El paciente refiere dolor o sintomatología activa?',
    type: 'options',
    options: [
      { id: 'false', label: 'Sí, refiere dolor' },
      { id: 'true', label: 'No, está sin síntomas' }
    ]
  },
  {
    id: 'fechaInicio',
    text: '¿Desde cuándo inició el dolor?',
    type: 'text',
    placeholder: 'Ej. Hace 3 días, ayer en la noche...',
    condition: (answers) => answers.sinSintomas === 'false'
  },
  {
    id: 'condicionAparicion',
    text: '¿Cómo aparece el dolor?',
    type: 'options',
    options: [
      { id: 'espontaneo', label: 'Espontáneo (sin estímulo)' },
      { id: 'provocado', label: 'Provocado (al comer, frío, calor)' }
    ],
    condition: (answers) => answers.sinSintomas === 'false'
  },
  {
    id: 'causaProvocado',
    text: '¿Qué estímulo provoca el dolor?',
    type: 'text',
    placeholder: 'Ej. Al masticar, con el frío...',
    defaultValue: 'Provocado con ',
    condition: (answers) => answers.sinSintomas === 'false' && answers.condicionAparicion === 'provocado'
  },
  {
    id: 'frecuencia',
    text: '¿Con qué frecuencia se presenta el dolor?',
    type: 'options',
    options: [
      { id: 'intermitente', label: 'Intermitente (va y viene)' },
      { id: 'continua', label: 'Continuo (no se quita)' }
    ],
    condition: (answers) => answers.sinSintomas === 'false'
  },
  {
    id: 'caracter',
    text: '¿Cómo describe el tipo de dolor?',
    type: 'options',
    options: [
      { id: 'pulsatil', label: 'Pulsátil (como latido)' },
      { id: 'sordo', label: 'Sordo (constante y molesto)' },
      { id: 'quemante', label: 'Quemante (ardor)' },
      { id: 'opresivo', label: 'Opresivo (como presión)' }
    ],
    condition: (answers) => answers.sinSintomas === 'false'
  },
  {
    id: 'intensidad',
    text: 'Del 1 al 10, ¿Qué tan intenso es el dolor?',
    type: 'options',
    options: [
      { id: 'leve', label: 'Leve (Soportable, 1-3)' },
      { id: 'moderada', label: 'Moderado (Molesto, 4-6)' },
      { id: 'severa', label: 'Severo (Incapacitante, 7-10)' }
    ],
    condition: (answers) => answers.sinSintomas === 'false'
  },
  {
    id: 'ubicacion',
    text: '¿Dónde se localiza el dolor?',
    type: 'options',
    options: [
      { id: 'localizado', label: 'Localizado (en un diente específico)' },
      { id: 'irradiado', label: 'Irradiado (se corre a otra zona)' }
    ],
    condition: (answers) => answers.sinSintomas === 'false'
  },
  {
    id: 'localizacionDescripcion',
    text: '¿En qué parte exactamente?',
    type: 'text',
    placeholder: 'Ej. Molar superior derecho...',
    defaultValue: 'Localizado en ',
    condition: (answers) => answers.sinSintomas === 'false' && answers.ubicacion === 'localizado'
  },
  {
    id: 'atenuacion_booleana',
    text: '¿Hay algo que alivie el dolor?',
    type: 'options',
    options: [
      { id: 'si', label: 'Sí' },
      { id: 'no', label: 'No' }
    ],
    condition: (answers) => answers.sinSintomas === 'false'
  },
  {
    id: 'atenuacion',
    text: '¿Qué es lo que alivia el dolor?',
    type: 'text',
    placeholder: 'Ej. Ibuprofeno, frío, reposo...',
    condition: (answers) => answers.sinSintomas === 'false' && answers.atenuacion_booleana === 'si'
  }
];
