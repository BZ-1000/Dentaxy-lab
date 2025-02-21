
export interface Familiar {
  finado: boolean;
  causaMuerte: string;
  condiciones: {
    diabetesMellitus: boolean;
    hipertensionArterial: boolean;
    osteoporosis: boolean;
    artritisReumatoide: boolean;
    parkinson: boolean;
    alzheimer: boolean;
    asma: boolean;
    cancer: boolean;
    anemia: boolean;
    otras: string;
  };
}

export interface PadecimientoActual {
  sinSintomas: boolean;
  motivoConsulta: string;
  historiaPadecimiento: string;
  dolor: {
    fechaInicio: string;
    condicionAparicion: string;
    frecuencia: string;
    caracter: string;
    intensidad: string;
    localizacion: {
      tipo: string;
      descripcion: string;
    };
    atenuacion: string;
  };
}

export interface HigienePersonal {
  frecuenciaBano: string;
  aseoManos: string;
  cambioRopa: string;
}

export interface HigieneBucal {
  frecuenciaCepillado: string;
  usoHiloDental: string;
  tipoCerdas: string;
  cantidadPasta: string;
  marcaPasta: string;
}

export interface Alimentacion {
  tiposAlimentos: string;
  frecuenciaComidas: string;
  consumoNutritivo: string;
}

export interface Vivienda {
  serviciosBasicos: string[];
  material: string;
  ventilacion: string;
}

export interface FormDataState {
  padecimientoActual: PadecimientoActual;
  antecedentesHeredoFamiliares: {
    [key: string]: Familiar;
  };
  higienePersonal: HigienePersonal;
  higieneBucal: HigieneBucal;
  alimentacion: Alimentacion;
  vivienda: Vivienda;
  actividadFisica?: string;
  sueno?: string;
  tabaquismo?: {
    fumador: boolean;
    frecuencia?: string;
    cantidad?: string;
  };
  alcoholismo?: {
    bebedor: boolean;
    frecuencia?: string;
    cantidad?: string;
  };
  toxicomanias?: {
    consumidor: boolean;
    tipo?: string;
    frecuencia?: string;
  };
}
