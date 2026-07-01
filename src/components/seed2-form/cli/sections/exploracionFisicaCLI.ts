import { CLIQuestion } from '../useFormCLI';

export const exploracionFisicaCLIQuestions: CLIQuestion[] = [
  // --- Signos Vitales ---
  {
    id: 'signos_vitales_normales',
    text: '¿Los signos vitales del paciente se encuentran dentro de los parámetros normales?',
    type: 'options',
    options: [
      { id: 'si', label: 'Sí, parámetros clínicos normales (ej. 120/80, 36.5°C)' },
      { id: 'no', label: 'No, reportar los valores exactos o variaciones' }
    ]
  },
  {
    id: 'signos_vitales_variaciones',
    text: 'Dicte los valores precisos o variaciones (ej. TA 140/90, FC 95):',
    type: 'text',
    placeholder: 'Ej. Tensión arterial 140 sobre 90...',
    condition: (answers) => answers.signos_vitales_normales === 'no'
  },
  // --- Control Examen Regional ---
  {
    id: 'sinHallazgosFisicos',
    text: '¿El examen de cabeza, cuello o ATM revela alguna alteración, dolor o asimetría?',
    type: 'options',
    options: [
      { id: 'true', label: 'No, examen regional normal (Sin hallazgos patológicos)' },
      { id: 'false', label: 'Sí, se observan alteraciones, dolor o ruidos articulares' }
    ]
  },
  // --- Cabeza ---
  {
    id: 'cabeza_hallazgos',
    text: '¿Existen hallazgos clínicos o asimetrías en el examen de Cabeza y cara?',
    type: 'options',
    options: [
      { id: 'normal', label: 'Sin hallazgos patológicos (Sano)' },
      { id: 'alterado', label: 'Sí, presenta alteraciones o cicatrices' }
    ],
    condition: (answers) => answers.sinHallazgosFisicos === 'false'
  },
  {
    id: 'cabeza_detalles',
    text: 'Escriba los hallazgos o cicatrices observados:',
    type: 'text',
    placeholder: 'Ej. Cicatriz quirúrgica en mentón de 2cm...',
    condition: (answers) => answers.sinHallazgosFisicos === 'false' && answers.cabeza_hallazgos === 'alterado'
  },
  // --- ATM ---
  {
    id: 'atm_ruidos',
    text: '¿El paciente presenta ruidos o chasquidos en la articulación (ATM)?',
    type: 'options',
    options: [
      { id: 'false', label: 'No, ATM asintomática sin ruidos' },
      { id: 'true', label: 'Sí, chasquido o crepitación audible' }
    ],
    condition: (answers) => answers.sinHallazgosFisicos === 'false'
  },
  {
    id: 'atm_dolor',
    text: '¿El paciente refiere dolor a la palpación o al abrir la boca?',
    type: 'options',
    options: [
      { id: 'false', label: 'No refiere dolor' },
      { id: 'true', label: 'Sí, refiere dolor' }
    ],
    condition: (answers) => answers.sinHallazgosFisicos === 'false'
  },
  {
    id: 'atm_observaciones',
    text: 'Observaciones adicionales de la ATM:',
    type: 'text',
    placeholder: 'Ej. Desviación de la línea media en apertura hacia la izquierda...',
    condition: (answers) => answers.sinHallazgosFisicos === 'false'
  },
  // --- Cuello ---
  {
    id: 'cuello_normal',
    text: '¿El cuello presenta alguna alteración o ganglios inflamados (adenopatías)?',
    type: 'options',
    options: [
      { id: 'normal', label: 'Cuello normal sin ganglios palpables' },
      { id: 'alterado', label: 'Sí, se palpan ganglios o adenopatías' }
    ],
    condition: (answers) => answers.sinHallazgosFisicos === 'false'
  },
  {
    id: 'cuello_detalles',
    text: 'Especifique la localización y características de los ganglios palpados:',
    type: 'text',
    placeholder: 'Ej. Ganglios submandibulares derechos inflamados y móviles...',
    condition: (answers) => answers.sinHallazgosFisicos === 'false' && answers.cuello_normal === 'alterado'
  }
];
