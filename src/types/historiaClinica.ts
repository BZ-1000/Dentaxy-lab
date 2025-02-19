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

export interface AntecedentesHeredoFamiliares {
  padre: Familiar;
  madre: Familiar;
  abueloPaterno: Familiar;
  abuelaPaterna: Familiar;
  abueloMaterno: Familiar;
  abuelaMaterna: Familiar;
}

export interface ServiciosDomiciliarios {
  tipoVivienda: 'rural' | 'urbana' | 'semiurbana';
  materialVivienda: 'concreto' | 'madera' | 'lamina' | 'ladrillo';
  servicios: {
    agua: boolean;
    luz: boolean;
    drenaje: boolean;
    transporte: boolean;
    internet: boolean;
    gas: boolean;
  };
  condicionesCalle: 'pavimentada' | 'sin-pavimentar';
  iluminacionCalle: 'bien-iluminada' | 'poca-iluminacion' | 'sin-iluminacion';
}

export interface HigieneVivienda {
  regularidadAseo: 'diario' | 'semanal' | 'quincenal' | 'esporadico';
  cambioRopaCama: 'diario' | 'semanal' | 'quincenal' | 'mensual' | 'irregular';
  hacinamiento: boolean;
  promiscuidad: boolean;
  animales: 'dentro' | 'patio' | 'no';
  manejoResiduos: 'recicla' | 'diario' | 'acumula';
}

export interface HigienePersonal {
  frecuenciaBano: 'diario' | 'cada-2-dias' | 'cada-3-dias' | 'esporadico';
  aseoManos: {
    antesComida: boolean;
    despuesBano: boolean;
    manipularAlimentos: boolean;
    sinHabito: boolean;
  };
  cambioRopa: 'diario' | 'cada-2-dias' | 'cada-3-dias' | 'esporadico';
}

export interface HigieneBucal {
  frecuenciaCepillado: '3-veces' | '2-veces' | '1-vez' | 'menos';
  tecnicaCepillado: 'circular' | 'horizontal' | 'vertical' | 'barrido' | 'no-sabe';
  auxiliares: {
    hiloDental: boolean;
    enjuagueBucal: boolean;
    irrigador: boolean;
    noUsa: boolean;
  };
  ultimaVisita: 'menos-6-meses' | '1-ano' | 'mas-2-anos' | 'nunca';
  problemas: {
    sangradoEncias: boolean;
    caries: boolean;
    malAliento: boolean;
    dolor: boolean;
    sinProblemas: boolean;
  };
}

export interface Alimentacion {
  tiposAlimentos: {
    frutasVerduras: boolean;
    carnesProteinas: boolean;
    procesadosFritos: boolean;
    dulcesAzucares: boolean;
    lacteos: boolean;
  };
  frecuenciaFrutasVerduras: 'diario' | '3-4-semana' | 'ocasional' | 'no-consume';
  frecuenciaBebidasAzucaradas: 'diario' | '3-4-semana' | 'ocasional' | 'no-consume';
  frecuenciaComidaChatarra: 'diario' | '3-4-semana' | 'ocasional' | 'no-consume';
  consumoAgua: 'mas-2-litros' | '1-2-litros' | 'menos-1-litro';
}

export interface HabitosAlimenticios {
  numeroComidas: '3-comidas' | '4-comidas' | '5-o-mas' | 'menos-3';
  horarioComidas: 'fijo' | 'irregular';
  saltaComidas: 'desayuno' | 'almuerzo' | 'cena' | 'no';
  ayunoProlongado: 'eleccion' | 'falta-acceso' | 'no';
}

export interface FormDataState {
  padecimientoActual: PadecimientoActual;
  antecedentesHeredoFamiliares: AntecedentesHeredoFamiliares;
  serviciosDomiciliarios: ServiciosDomiciliarios;
  higieneVivienda: HigieneVivienda;
  higienePersonal: HigienePersonal;
  higieneBucal: HigieneBucal;
  alimentacion: Alimentacion;
  habitosAlimenticios: HabitosAlimenticios;
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
