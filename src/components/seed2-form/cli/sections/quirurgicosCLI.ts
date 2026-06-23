import { CLIQuestion } from '../useFormCLI';

export const quirurgicosCLIQuestions: CLIQuestion[] = [
  {
    id: 'sinQuirurgicos',
    text: '¿Tiene antecedentes de cirugías u hospitalizaciones previas?',
    type: 'options',
    options: [
      { id: 'true', label: 'No, ninguna cirugía o internamiento' },
      { id: 'false', label: 'Sí, he tenido cirugías u hospitalizaciones' }
    ]
  },
  {
    id: 'cirugiasDetalles',
    text: 'Mencione las cirugías realizadas, fechas y motivos:',
    type: 'text',
    placeholder: 'Ej. Apendicectomía hace 5 años, extracción de terceros molares...',
    condition: (answers) => answers.sinQuirurgicos === 'false'
  },
  {
    id: 'tomaMedicamentos',
    text: '¿Está tomando algún medicamento actualmente de forma regular?',
    type: 'options',
    options: [
      { id: 'false', label: 'No' },
      { id: 'true', label: 'Sí' }
    ]
  },
  {
    id: 'cualesMedicamentos',
    text: '¿Qué medicamentos toma, dosis y motivo?',
    type: 'text',
    placeholder: 'Ej. Metformina 850mg diario para diabetes...',
    condition: (answers) => answers.tomaMedicamentos === 'true'
  }
];
