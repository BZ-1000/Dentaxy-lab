import { FormDataState } from '@/types/historiaClinica';

export const getInitialFormState = (): FormDataState => {
  return {
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
        atenuacion: '',
        ubicacion: ''
      }
    },
    antecedentesHeredoFamiliares: {
      padre: {
        finado: false,
        causaMuerte: '',
        condiciones: {
          diabetesMellitus: false,
          hipertensionArterial: false,
          osteoporosis: false,
          artritisReumatoide: false,
          parkinson: false,
          alzheimer: false,
          asma: false,
          cancer: false,
          anemia: false,
          otras: ''
        }
      },
      madre: {
        finado: false,
        causaMuerte: '',
        condiciones: {
          diabetesMellitus: false,
          hipertensionArterial: false,
          osteoporosis: false,
          artritisReumatoide: false,
          parkinson: false,
          alzheimer: false,
          asma: false,
          cancer: false,
          anemia: false,
          otras: ''
        }
      },
      abueloPaterno: {
        finado: false,
        causaMuerte: '',
        condiciones: {
          diabetesMellitus: false,
          hipertensionArterial: false,
          osteoporosis: false,
          artritisReumatoide: false,
          parkinson: false,
          alzheimer: false,
          asma: false,
          cancer: false,
          anemia: false,
          otras: ''
        }
      },
      abuelaPaterna: {
        finado: false,
        causaMuerte: '',
        condiciones: {
          diabetesMellitus: false,
          hipertensionArterial: false,
          osteoporosis: false,
          artritisReumatoide: false,
          parkinson: false,
          alzheimer: false,
          asma: false,
          cancer: false,
          anemia: false,
          otras: ''
        }
      },
      abueloMaterno: {
        finado: false,
        causaMuerte: '',
        condiciones: {
          diabetesMellitus: false,
          hipertensionArterial: false,
          osteoporosis: false,
          artritisReumatoide: false,
          parkinson: false,
          alzheimer: false,
          asma: false,
          cancer: false,
          anemia: false,
          otras: ''
        }
      },
      abuelaMaterna: {
        finado: false,
        causaMuerte: '',
        condiciones: {
          diabetesMellitus: false,
          hipertensionArterial: false,
          osteoporosis: false,
          artritisReumatoide: false,
          parkinson: false,
          alzheimer: false,
          asma: false,
          cancer: false,
          anemia: false,
          otras: ''
        }
      }
    },
    antecedentesPersonalesNoPatologicos: {
      tipoVivienda: '',
      materialVivienda: '',
      servicios: [],
      condicionCalle: '',
      iluminacionCalle: '',
      frecuenciaLimpieza: '',
      cambioRopaCama: '',
      hacinamiento: '',
      promiscuidad: '',
      mascotas: '',
      manejoResiduos: '',
      frecuenciaBano: '',
      lavadoManos: [],
      cambioRopa: '',
      frecuenciaCepillado: '',
      tecnicaCepillado: '',
      auxiliaresBucales: [],
      ultimaVisitaOdontologo: '',
      problemasBucales: [],
      alimentosConsumidos: [],
      frecuenciaFrutasVerduras: '',
      frecuenciaBebidasAzucaradas: '',
      frecuenciaComidaChatarra: '',
      consumoAgua: '',
      numeroComidas: '',
      horarioComidas: {
        desayuno: '',
        almuerzo: '',
        cena: ''
      },
      ayunoProlongado: ''
    },
    antecedentesPersonalesPatologicos: {
      ninguna: false,
      otra: false,
      otraDescripcion: '',
      nutricionales: {
        ninguna: false,
        otra: false,
        otraDescripcion: ''
      },
      cardiacos: {
        ninguna: false,
        otra: false,
        otraDescripcion: ''
      },
      hepaticos: {
        ninguna: false,
        otra: false,
        otraDescripcion: ''
      },
      enfermedadesTransmisionSexual: {
        ninguna: false,
        otra: false,
        otraDescripcion: ''
      },
      enfermedadesEruptivas: {
        ninguna: false,
        otra: false,
        otraDescripcion: ''
      },
      pulmonares: {
        ninguna: false,
        otra: false,
        otraDescripcion: ''
      },
      infecciosasParasitarias: {
        ninguna: false,
        otra: false,
        otraDescripcion: ''
      },
      otrosPadecimientos: {
        ninguna: false,
        otra: false,
        otraDescripcion: ''
      }
    },
    antecedentesAlergicos: {
      medicamentos: {
        es_alergico: false,
        cuales: '',
        tipo_reaccion: '',
        severidad: ''
      },
      alimentos: {
        es_alergico: false,
        cuales: ''
      },
      latex: {
        es_alergico: false,
        descripcion_reaccion: ''
      },
      adicciones: {},
    },
    antecedentesQuirurgicos: {
      sinQuirurgicos: false,
      cirugiasRealizadas: [],
      hospitalizacionesPrevias: '',
      complicacionesAnestesicas: ''
    },
    antecedentesHemorragicos: {
      sinHemorragicos: false,
      sangradoProlongado: '',
      hematomas: '',
      hemorragiasEspontaneas: '',
      transfusiones: '',
      detallesAdicionales: ''
    },
    interrogatorioSistemas: {
      cardiovascular: { valor: '', seleccionados: [] },
      respiratorio: { valor: '', seleccionados: [] },
      digestivo: { valor: '', seleccionados: [] },
      urinario: { valor: '', seleccionados: [] },
      musculoEsqueletico: { valor: '', seleccionados: [] },
      nervioso: { valor: '', seleccionados: [] },
      endocrino: { valor: '', seleccionados: [] },
      tegumentario: { valor: '', seleccionados: [] }
    },
    exploracionFisica: {
      signosVitales: {
        ta: '',
        fc: '',
        fr: '',
        temperatura: '',
        peso: '',
        talla: '',
        imc: ''
      },
      exploracion: {
        cabeza: '',
        cuello: '',
        torax: '',
        abdomen: '',
        extremidades: ''
      }
    },
    examenCabeza: {
      sinHallazgos: false,
      craneo: '',
      cara: '',
      ojos: '',
      oidos: '',
      nariz: '',
      boca: '',
      atm: ''
    },
    articulacionCraneomandibular: {},
    examenCuello: {},
    examenIntrabucal: {},
    glandulasSalivales: {},
    oclusion: {},
    relacionDientes: {},
    lineaMedia: {},
    frenillos: {},
    diagnostico: {},
    pronostico: {},
    serviciosDomiciliarios: '',
    pisosVivienda: '',
    materialVivienda: '',
    materialPiso: '',
    ventilacion: '',
    frecuenciaLimpieza: '',
    hacinamiento: '',
    frecuenciaBano: '',
    higieneBucal: {
      frecuenciaCepillado: '',
      usoHiloDental: '',
      tipoCerdas: '',
      cantidadPasta: '',
      marcaPasta: ''
    },
    alimentacion: {
      tipoDieta: '',
      frecuenciaComidas: '',
      tiposAlimentos: '',
      saltaComidas: '',
      consumoNutritivo: ''
    },
    grupoSanguineo: '',
    factorRh: '',
    inmunizaciones: '',
    peso: '',
    imc: '',
    talla: '',
    presionArterial: '',
    pulso: '',
    frecuenciaCardiaca: '',
    frecuenciaRespiratoria: '',
    temperatura: '',
    diagnosticos: '',
    pronosticos: ''
  };
};
