export interface FormDataState {
  informacionPaciente: {
    nombre: string;
    edad: string;
    genero: string;
    fechaNacimiento: string;
    direccion: string;
    telefono: string;
    email: string;
    ocupacion: string;
    estadoCivil: string;
  };
  padecimientoActual: {
    motivoConsulta: string;
    historiaPadecimiento: string;
    sinSintomas: boolean;
    dolor: {
      presente: boolean;
      tipo: string;
      escala: string;
      localizacion: {
        tipo: string;
        descripcion: string;
      };
      irradiacion: string;
      frecuencia: string;
      duracion: string;
      fechaInicio: string;
      factoresAgravantes: string;
      factoresAliviantes: string;
    };
  };
  antecedentesHeredoFamiliares: {
    padre: {
      vivo: boolean;
      edad: string;
      condiciones: {
        diabetes: boolean | string;
        hipertension: boolean | string;
        cancer: boolean | string;
        enfermedadesCardiacas: boolean | string;
        otros: string;
      };
    };
    madre: {
      vivo: boolean;
      edad: string;
      condiciones: {
        diabetes: boolean | string;
        hipertension: boolean | string;
        cancer: boolean | string;
        enfermedadesCardiacas: boolean | string;
        otros: string;
      };
    };
    hermanos: {
      vivo: boolean;
      edad: string;
      condiciones: {
        diabetes: boolean | string;
        hipertension: boolean | string;
        cancer: boolean | string;
        enfermedadesCardiacas: boolean | string;
        otros: string;
      };
    };
    abuelosPaternos: {
      vivo: boolean;
      edad: string;
      condiciones: {
        diabetes: boolean | string;
        hipertension: boolean | string;
        cancer: boolean | string;
        enfermedadesCardiacas: boolean | string;
        otros: string;
      };
    };
    abuelosMaternos: {
      vivo: boolean;
      edad: string;
      condiciones: {
        diabetes: boolean | string;
        hipertension: boolean | string;
        cancer: boolean | string;
        enfermedadesCardiacas: boolean | string;
        otros: string;
      };
    };
  };
  antecedentesPersonalesNoPatologicos: {
    alimentacion: {
      tipoDieta: string;
      frecuenciaComidas: string;
      consumoAguaDia: string;
    };
    habitacion: {
      tipoVivienda: string;
      numeroHabitantes: string;
      mascotas: string;
    };
    higienePersonal: {
      frecuenciaBano: string;
      cambioRopa: string;
      aseoBucal: string;
    };
    actividadFisica: {
      tipoEjercicio: string;
      frecuenciaEjercicio: string;
      duracionEjercicio: string;
    };
    sueno: {
      horasSueno: string;
      calidadSueno: string;
    };
    tabaquismo: {
      consumeTabaco: boolean | string;
      edadInicioTabaquismo: string;
      cantidadTabacoDia: string;
      tiempoAbstinenciaTabaquismo: string;
    };
    alcoholismo: {
      consumeAlcohol: boolean | string;
      edadInicioAlcoholismo: string;
      frecuenciaAlcoholismo: string;
      cantidadAlcoholismo: string;
      tiempoAbstinenciaAlcoholismo: string;
    };
    toxicomanias: {
      consumeDrogas: boolean | string;
      tipoDroga: string;
      frecuenciaDrogas: string;
      tiempoAbstinenciaDrogas: string;
    };
    servicios: string[];
  };
  antecedentesPersonalesPatologicos: {
    enfermedadesInfancia: {
      varicela: boolean | string;
      sarampion: boolean | string;
      rubeola: boolean | string;
      parotiditis: boolean | string;
      tosferina: boolean | string;
      otras: string;
    };
    enfermedadesCronicas: {
      diabetes: boolean | string;
      hipertension: boolean | string;
      cardiacas: boolean | string;
      respiratorias: boolean | string;
      alergias: boolean | string;
      otras: string;
    };
    hospitalizaciones: {
      haSidoHospitalizado: boolean | string;
      motivoHospitalizacion: string;
      fechaHospitalizacion: string;
    };
    transfusiones: {
      haRecibidoTransfusiones: boolean | string;
      motivoTransfusion: string;
      fechaTransfusion: string;
    };
    vacunas: {
      esquemaCompleto: boolean | string;
      cualesVacunas: string;
    };
  };
  antecedentesAlergicos: {
    alergiaMedicamentos: {
      esAlergico: boolean | string;
      medicamentos: string;
      reaccion: string;
    };
    alergiaAlimentos: {
      esAlergico: boolean | string;
      alimentos: string;
      reaccion: string;
    };
    alergiaAmbiental: {
      esAlergico: boolean | string;
      alergenos: string;
      reaccion: string;
    };
    alergiaLatex: {
      esAlergico: boolean | string;
      reaccion: string;
    };
  };
  antecedentesQuirurgicos: {
    cirugiasPrevias: boolean | string;
    tipoCirugia: string;
    fechaCirugia: string;
    complicaciones: string;
  };
  antecedentesHemorragicos: {
    sangradoProlongado: string;
    hematomas: string;
    hemorragiasEspontaneas: string;
    transfusiones: string;
    detallesAdicionales: string;
    sinHemorragicos: boolean;
  };
  interrogatorioSistemas: {
    general: string;
    piel: string;
    cabeza: string;
    ojos: string;
    oidos: string;
    nariz: string;
    boca: string;
    garganta: string;
    cuello: string;
    torax: string;
    cardiovascular: string;
    respiratorio: string;
    gastrointestinal: string;
    genitourinario: string;
    endocrino: string;
    hematologico: string;
    nervioso: string;
    musculoEsqueletico: string;
    psiquiatrico: string;
  };
  exploracionFisica?: {
    signosVitales?: {
      temperatura?: string;
      frecuenciaCardiaca?: string;
      frecuenciaRespiratoria?: string;
      presionArterial?: string;
      peso?: string;
      talla?: string;
      imc?: string;
    };
    aparienciaGeneral?: string;
    piel?: string;
    cabeza?: string;
    ojos?: string;
    oidos?: string;
    nariz?: string;
    boca?: string;
    cuello?: string;
    torax?: string;
    corazon?: string;
    pulmones?: string;
    abdomen?: string;
    extremidades?: string;
    neurologico?: string;
    mental?: string;
  };
  examenCabeza: {
    palpacionATM: string;
    movimientosMandibulares: string;
    gangliosLinfaticos: string;
    musculosMasticadores: string;
    observaciones: string;
  };
}

// Definición del tipo FormSection
export type FormSection = 
  | 'informacionPrincipal'
  | 'padecimientoActual'
  | 'antecedentesHeredoFamiliares'
  | 'antecedentesPersonalesPatologicos'
  | 'antecedentesPersonalesNoPatologicos'
  | 'antecedentesAlergicos'
  | 'antecedentesQuirurgicos'
  | 'antecedentesHemorragicos'
  | 'interrogatorioSistemas'
  | 'exploracionFisica'
  | 'examenCabeza'
  | 'sidebarOnly';

// Asegurarnos de que ExamenCabeza incluya todos los campos necesarios
export interface ExamenCabezaData {
  palpacionATM: string;
  movimientosMandibulares: string;
  gangliosLinfaticos: string;
  musculosMasticadores: string;
  observaciones: string;
}
