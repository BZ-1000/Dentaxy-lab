import { CLIQuestion } from '../useFormCLI';

export const exploracionFisicaCLIQuestions: CLIQuestion[] = [
  {
    id: 'ta',
    text: 'Tensión Arterial (TA) del paciente (ej. 120/80):',
    type: 'text',
    defaultValue: '120/80',
    placeholder: 'Ej. 120/80 mmHg...'
  },
  {
    id: 'fc',
    text: 'Frecuencia Cardíaca (FC) (ej. 75):',
    type: 'text',
    defaultValue: '80',
    placeholder: 'Ej. 80 latidos por minuto...'
  },
  {
    id: 'temperatura',
    text: 'Temperatura Corporal del paciente (°C):',
    type: 'text',
    defaultValue: '36.5',
    placeholder: 'Ej. 36.5 °C...'
  },
  {
    id: 'peso',
    text: 'Peso del paciente en kilogramos (ej. 70):',
    type: 'text',
    placeholder: 'Ej. 72...'
  },
  {
    id: 'talla',
    text: 'Talla (estatura) del paciente en metros (ej. 1.70):',
    type: 'text',
    placeholder: 'Ej. 1.75...'
  }
];
