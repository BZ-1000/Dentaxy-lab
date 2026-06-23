import { CLIQuestion } from '../useFormCLI';

export const interrogatorioCLIQuestions: CLIQuestion[] = [
  {
    id: 'sistemas_alteracion',
    text: '¿El paciente refiere alguna alteración o molestia en sus sistemas corporales (ej. taquicardia, gastritis, fatiga, etc.)?',
    type: 'options',
    options: [
      { id: 'no', label: 'No, todo sin alteración (Normal)' },
      { id: 'si', label: 'Sí, reporta algún síntoma o molestia' }
    ]
  },
  {
    id: 'sistema_afectado',
    text: '¿A qué sistema pertenece principalmente la molestia?',
    type: 'options',
    options: [
      { id: 'cardiovascular', label: 'Cardiovascular (palpitaciones, dolor de pecho)' },
      { id: 'digestivo', label: 'Digestivo (gastritis, colitis, reflujo)' },
      { id: 'respiratorio', label: 'Respiratorio (dificultad para respirar, tos crónica)' },
      { id: 'nervioso', label: 'Nervioso o Endocrino (insomnio, temblores, tiroides)' },
      { id: 'otros', label: 'Otros sistemas' }
    ],
    condition: (answers) => answers.sistemas_alteracion === 'si'
  },
  {
    id: 'sistemas_detalles',
    text: 'Describa con detalle los síntomas y molestias reportadas:',
    type: 'text',
    placeholder: 'Ej. Presenta reflujo ácido frecuente controlado con omeprazol...',
    condition: (answers) => answers.sistemas_alteracion === 'si'
  }
];
