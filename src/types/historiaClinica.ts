
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

export interface ServiciosDomiciliarios {
  tipoVivienda: string;
  materialVivienda: string;
  condicionesCalle: string;
  iluminacionCalle: string;
  servicios: {
    agua: boolean;
    luz: boolean;
    drenaje: boolean;
    transporte: boolean;
    internet: boolean;
    gas: boolean;
  };
}

export interface FormDataState {
  padecimientoActual: PadecimientoActual;
  antecedentesHeredoFamiliares: AntecedentesHeredoFamiliares;
  serviciosDomiciliarios: ServiciosDomiciliarios;
  pisosVivienda: string;
  materialVivienda: string;
  materialPiso: string;
  ventilacion: string;
  frecuenciaLimpieza: string;
  hacinamiento: string;
  frecuenciaBano: string;
  higieneBucal: {
    frecuenciaCepillado: string;
    usoHiloDental: string;
    tipoCerdas: string;
    cantidadPasta: string;
    marcaPasta: string;
    auxiliares: {
      hiloDental: boolean;
      enjuagueBucal: boolean;
      irrigador: boolean;
      noUsa: boolean;
    };
    problemas: {
      sangradoEncias: boolean;
      caries: boolean;
      malAliento: boolean;
      dolor: boolean;
      sinProblemas: boolean;
    };
  };
  alimentacion: {
    tipoDieta: string;
    frecuenciaComidas: string;
    tiposAlimentos: string;
    saltaComidas: string;
    consumoNutritivo: string;
  };
  grupoSanguineo: string;
  factorRh: string;
  inmunizaciones: string;
  peso: string;
  imc: string;
  talla: string;
  presionArterial: string;
  pulso: string;
  frecuenciaCardiaca: string;
  frecuenciaRespiratoria: string;
  temperatura: string;
  diagnosticos: string;
  pronosticos: string;
}
