
import { FormDataState } from '@/types/historiaClinica';

export const getInitialFormState = (): FormDataState => ({
  padecimientoActual: {
    sinSintomas: false,
    motivoConsulta: '',
    historiaPadecimiento: '',
    dolor: {
      fechaInicio: '',
      condicionAparicion: '',
      frecuencia: '',
      caracter: '',
      intensidad: '',
      localizacion: {
        tipo: '',
        descripcion: ''
      },
      atenuacion: ''
    }
  },
  antecedentesHeredoFamiliares: {},
  serviciosDomiciliarios: {
    tipoVivienda: '',
    materialVivienda: '',
    condicionesCalle: '',
    iluminacionCalle: '',
    servicios: {}
  }
});
