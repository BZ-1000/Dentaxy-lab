import { CLIQuestion } from '../useFormCLI';

export const noPatologicosCLIQuestions: CLIQuestion[] = [
  {
    id: 'frecuenciaCepillado',
    text: '¿Con qué frecuencia al día se cepilla los dientes el paciente?',
    type: 'options',
    options: [
      { id: '1 vez al día', label: '1 vez al día' },
      { id: '2 veces al día', label: '2 veces al día' },
      { id: '3 o más veces al día', label: '3 o más veces al día' },
      { id: 'No se cepilla', label: 'No realiza cepillado' }
    ]
  },
  {
    id: 'auxiliaresBucales',
    text: '¿Utiliza algún auxiliar bucal de forma regular?',
    type: 'options',
    options: [
      { id: 'ninguno', label: 'Ninguno' },
      { id: 'hilo', label: 'Hilo dental' },
      { id: 'enjuague', label: 'Enjuague bucal' },
      { id: 'ambos', label: 'Hilo dental y Enjuague bucal' }
    ]
  },
  {
    id: 'mascotas',
    text: '¿Tiene mascotas en su hogar?',
    type: 'options',
    options: [
      { id: 'no', label: 'No' },
      { id: 'si', label: 'Sí' }
    ]
  },
  {
    id: 'mascotasDetalle',
    text: '¿Qué tipo de mascotas tiene y cuántas?',
    type: 'text',
    placeholder: 'Ej. Dos perros en patio, un gato adentro...',
    condition: (answers) => answers.mascotas === 'si'
  },
  {
    id: 'serviciosVivienda',
    text: '¿La vivienda cuenta con todos los servicios básicos (agua, luz, drenaje)?',
    type: 'options',
    options: [
      { id: 'completos', label: 'Sí, cuenta con todos los servicios' },
      { id: 'incompletos', label: 'No, tiene servicios deficientes o incompletos' }
    ]
  },
  {
    id: 'alimentacion',
    text: '¿Cómo describe la alimentación del paciente?',
    type: 'options',
    options: [
      { id: 'balanceada', label: 'Balanceada / Adecuada' },
      { id: 'cariogenica', label: 'Alta en carbohidratos, harinas o azúcares (Cariogénica)' },
      { id: 'deficiente', label: 'Irregular o deficiente' }
    ]
  }
];
