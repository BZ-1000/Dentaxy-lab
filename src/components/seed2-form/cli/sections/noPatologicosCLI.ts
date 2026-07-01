import { CLIQuestion } from '../useFormCLI';

export const noPatologicosCLIQuestions: CLIQuestion[] = [
  // Vivienda y Zoonosis
  {
    id: 'nopat_vivienda',
    text: '¿La vivienda cuenta con todos los servicios básicos y buenas condiciones de higiene?',
    type: 'options',
    options: [
      { id: 'completos', label: 'Sí, servicios completos e higiénica' },
      { id: 'incompletos', label: 'No, servicios deficientes o riesgos' }
    ]
  },
  {
    id: 'nopat_mascotas',
    text: '¿Convive con mascotas en el domicilio (zoonosis)?',
    type: 'options',
    options: [
      { id: 'no', label: 'No' },
      { id: 'si', label: 'Sí' }
    ]
  },
  {
    id: 'nopat_mascotas_detalle',
    text: 'Especifique el tipo de mascota y convivencia (dentro/fuera):',
    type: 'text',
    placeholder: 'Ej. 2 perros en el patio...',
    condition: (answers) => answers.nopat_mascotas === 'si'
  },
  // Alimentación
  {
    id: 'nopat_alimentacion',
    text: '¿Cómo describe su alimentación diaria?',
    type: 'options',
    options: [
      { id: 'adecuada', label: 'Adecuada/Balanceada' },
      { id: 'cariogenica', label: 'Cariogénica (alta en azúcar)' },
      { id: 'deficiente', label: 'Deficiente' }
    ]
  },
  // Higiene Bucal
  {
    id: 'nopat_cepillado',
    text: '¿Frecuencia de cepillado dental al día?',
    type: 'options',
    options: [
      { id: '3', label: '3 o más veces' },
      { id: '2', label: '2 veces' },
      { id: '1', label: '1 vez' },
      { id: '0', label: 'Ocasional o no cepilla' }
    ]
  },
  {
    id: 'nopat_auxiliares',
    text: '¿Utiliza auxiliares (hilo dental, enjuague)?',
    type: 'options',
    options: [
      { id: 'no', label: 'Ninguno' },
      { id: 'ambos', label: 'Hilo y enjuague' },
      { id: 'hilo', label: 'Solo hilo dental' },
      { id: 'enjuague', label: 'Solo enjuague' }
    ]
  }
];
