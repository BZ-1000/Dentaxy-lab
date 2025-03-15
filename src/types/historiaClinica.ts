export interface Option {
  label: string;
  value: string;
}

export interface DefaultValues {
  [key: string]: string | boolean | number | undefined;
}

export interface Field {
  name: string;
  label: string;
  type: string;
  options?: Option[];
  defaultValues?: DefaultValues;
}

export interface Group {
  title: string;
  fields: Field[];
}

export interface FormDataState {
  datosPersonales: {
    nombre: string;
    apellidoPaterno: string;
    apellidoMaterno: string;
    fechaNacimiento: string;
    edad: string;
    genero: string;
    direccion: string;
    telefono: string;
    email: string;
    ocupacion: string;
    estadoCivil: string;
    escolaridad: string;
  };
  motivoConsulta: string;
  historiaEnfermedadActual: string;
  antecedentesPersonalesNoPatologicos: {
    alimentacion: string;
    habitacion: string;
    higiene: string;
    deportes: string;
    inmunizaciones: string;
    grupoSanguineo: string;
    alergias: string;
    transfusiones: string;
  };
  antecedentesPersonalesPatologicos: {
    enfermedadesInfancia: string;
    enfermedadesCronicas: string;
    enfermedadesMentales: string;
  };
  antecedentesHeredofamiliares: {
    diabetes: string;
    hipertension: string;
    cancer: string;
    cardiopatias: string;
    enfermedadesMentales: string;
    otros: string;
  };
  antecedentesGinecoObstetricos: {
    menarca: string;
    ciclosMenstruales: string;
    fechaUltimaMenstruacion: string;
    gestas: string;
    partos: string;
    abortos: string;
    cesareas: string;
    planificacionFamiliar: string;
  };
  antecedentesAndrologicos: {
    inicioVidaSexualActiva: string;
    numeroParejasSexuales: string;
    metodoAnticonceptivo: string;
    enfermedadesTransmisionSexual: string;
  };
  antecedentesHemorragicos: {
    tendenciaHemorragica: string;
    causaHemorragia: string;
  };
  antecedentesQuirurgicos: {
    cirugiasPrevias: string;
    fechaCirugia: string;
    motivoCirugia: string;
  };
  examenCabeza: {
    craneo: string;
    cueroCabelludo: string;
    cara: string;
    ojos: string;
    nariz: string;
    boca: string;
    garganta: string;
    oidos: string;
  };
  exploracionFisica: {
    ta: string;
    fc: string;
    fr: string;
    temperatura: string;
    peso: string;
    talla: string;
    imc: string;
    complexion: string;
    facies: string;
    actitud: string;
    estadoConciencia: string;
    marcha: string;
  };
  interrogatorioSistemas: {
    general: string;
    pielFaneras: string;
    sistemaHemolinfopoyetico: string;
    cabeza: string;
    organosSentidos: string;
    cuello: string;
    cardioVascular: string;
    respiratorio: string;
    gastroIntestinal: string;
    genitoUrinario: string;
    endocrino: string;
    osteoMuscular: string;
    nervioso: string;
    mental: string;
  };
  habitusExterior: string;
  diagnostico: string;
  pronostico: string;
  planTratamiento: string;
}
