import { CLIQuestion } from '../useFormCLI';

export const patologicosCLIQuestions: CLIQuestion[] = [
  // --- Sistémicas ---
  {
    id: 'enfermedades_sistemicas',
    text: '¿Padece alguna enfermedad sistémica crónica o infecciosa (ej. Diabetes, Hipertensión, Asma, Hepatitis)?',
    type: 'options',
    options: [
      { id: 'false', label: 'No, ninguna' },
      { id: 'true', label: 'Sí, refiere enfermedades' }
    ]
  },
  {
    id: 'enfermedades_cuales',
    text: 'Indique qué enfermedades padece, tiempo de evolución y si lleva tratamiento:',
    type: 'text',
    placeholder: 'Ej. Diabetes desde hace 5 años, tratada con metformina...',
    condition: (answers) => answers.enfermedades_sistemicas === 'true'
  },
  // --- Alergias ---
  {
    id: 'alergias_general',
    text: '¿Es alérgico a algún medicamento, anestésico, alimento o sustancia?',
    type: 'options',
    options: [
      { id: 'false', label: 'No, niega alergias' },
      { id: 'true', label: 'Sí, refiere alergia' }
    ]
  },
  {
    id: 'alergias_cuales',
    text: '¿A qué es alérgico y qué reacción presenta?',
    type: 'text',
    placeholder: 'Ej. Penicilina (urticaria), Látex (dermatitis)...',
    condition: (answers) => answers.alergias_general === 'true'
  },
  // --- Quirúrgicos / Hospitalizaciones ---
  {
    id: 'quirurgicos_general',
    text: '¿Tiene antecedentes de cirugías previas u hospitalizaciones recientes?',
    type: 'options',
    options: [
      { id: 'false', label: 'No refiere antecedentes' },
      { id: 'true', label: 'Sí refiere' }
    ]
  },
  {
    id: 'quirurgicos_cuales',
    text: 'Especifique la cirugía u hospitalización, motivo y fecha aproximada:',
    type: 'text',
    placeholder: 'Ej. Apendicectomía en 2018...',
    condition: (answers) => answers.quirurgicos_general === 'true'
  },
  // --- Hemorrágicos ---
  {
    id: 'hemorragicos_general',
    text: '¿Presenta problemas de sangrado prolongado, hematomas frecuentes o ha recibido transfusiones?',
    type: 'options',
    options: [
      { id: 'false', label: 'No, coagulación normal' },
      { id: 'true', label: 'Sí, refiere problemas/transfusiones' }
    ]
  },
  {
    id: 'hemorragicos_cuales',
    text: 'Especifique el problema de sangrado o motivo/fecha de transfusión:',
    type: 'text',
    placeholder: 'Ej. Transfusión en 2020 por anemia, o sangrado de encías...',
    condition: (answers) => answers.hemorragicos_general === 'true'
  },
  // --- Adicciones ---
  {
    id: 'adicciones_general',
    text: '¿Refiere consumo habitual de tabaco, alcohol u otras sustancias?',
    type: 'options',
    options: [
      { id: 'false', label: 'No, niega adicciones' },
      { id: 'true', label: 'Sí, refiere consumo' }
    ]
  },
  {
    id: 'adicciones_cuales',
    text: 'Especifique qué consume y con qué frecuencia:',
    type: 'text',
    placeholder: 'Ej. Tabaco (5 cigarros al día), Alcohol ocasional...',
    condition: (answers) => answers.adicciones_general === 'true'
  }
];
