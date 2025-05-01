import { FormDataState, RedaccionesInterrogatorio } from '@/types/historiaClinica'; // Asegúrate que RedaccionesInterrogatorio esté importado si no lo está ya

// Define el estado inicial para las redacciones (coincide con lo que está abajo, pero es bueno tenerlo explícito)
const initialRedacciones: RedaccionesInterrogatorio = {
    digestivo: "",
    respiratorio: "",
    cardiovascular: "",
    genitoUrinario: "", // Clave correcta
    endocrino: "",
    tegumentario: "",
    musculoEsqueletico: "",
    nervioso: ""
};


// Función auxiliar para el estado inicial de un familiar (sin cambios aquí)
const getInitialFamiliarState = () => ({
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
});


export const getInitialFormState = (): FormDataState => ({
    padecimientoActual: {
        sinSintomas: false,
        motivoConsulta: '', // Podrías inicializarlo con "El paciente acude a consulta por " si prefieres
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
    antecedentesHeredoFamiliares: {
        padre: getInitialFamiliarState(),
        madre: getInitialFamiliarState(),
        abueloPaterno: getInitialFamiliarState(),
        abuelaPaterna: getInitialFamiliarState(),
        abueloMaterno: getInitialFamiliarState(),
        abuelaMaterna: getInitialFamiliarState()
    },
    antecedentesPersonalesNoPatologicos: {
        // Asegúrate que todos los campos requeridos por tu validación tengan un valor inicial
        tipoVivienda: "",
        materialVivienda: "", // Añadido si falta
        servicios: [],
        condicionCalle: "",
        // ...otros campos APNP...
        hacinamiento: "", // Asegurar valor inicial
        promiscuidad: "", // Asegurar valor inicial
        mascotas: "", // Asegurar valor inicial
        manejoResiduos: "", // Asegurar valor inicial
        frecuenciaBano: "", // Asegurar valor inicial
        lavadoManos: [], // Asegurar valor inicial
        // --- Higiene Bucal ---
        frecuenciaCepillado: "", // Asegurar valor inicial
        tecnicaCepillado: "", // Asegurar valor inicial
        auxiliaresBucales: [], // Asegurar valor inicial
        ultimaVisitaOdontologo: "", // Asegurar valor inicial
        // --- Alimentación ---
        alimentosConsumidos: [], // Asegurar valor inicial
        frecuenciaFrutasVerduras: "", // Asegurar valor inicial
        frecuenciaBebidasAzucaradas: "", // Asegurar valor inicial
        frecuenciaComidaChatarra: "", // Asegurar valor inicial
        consumoAgua: "", // Asegurar valor inicial
        numeroComidas: "", // Asegurar valor inicial
        horarioComidas: { // Asegurar valor inicial
           desayuno: "",
           almuerzo: "",
           cena: ""
        },
        ayunoProlongado: "", // Asegurar valor inicial
        // --- Adicciones --- (Mover desde antecedentesAlergicos si corresponde aquí)
        tabaquismo: { activo: undefined, pasivo: undefined, cantidad: '', desdeCuando: '', exFumador: undefined }, // Ejemplo estructura detallada
        alcoholismo: { consume: undefined, frecuencia: '', tipo: '', cantidad: '', desdeCuando: '', exAlcoholico: undefined }, // Ejemplo estructura detallada
        toxicomanias: { consume: undefined, tipo: '', frecuencia: '', via: '', desdeCuando: '', exAdicto: undefined }, // Ejemplo estructura detallada
         // --- Sueño ---
         horasSueno: "", // Asegurar valor inicial si está en APNP
    },
    antecedentesPersonalesPatologicos: {
        // Cambiar sinPatologia por ninguno para consistencia con validación
        ninguno: false, // Usar 'ninguno' en lugar de 'sinPatologia'
        nutricionales: {
            anorexia: false, bulimia: false, sobrepeso: false, obesidad: false,
            ninguna: false, otra: false, otraDescripcion: ""
        },
        cardiacos: {
            enfermedadCoronaria: false, arritmias: false, defectosCardiacosCongenitos: false,
            ninguna: false, otra: false, otraDescripcion: ""
        },
        hepaticos: {
            hepatitisA: false, hepatitisB: false, hepatitisC: false, higadoGraso: false, cirrosis: false,
            ninguna: false, otra: false, otraDescripcion: ""
        },
        enfermedadesTransmisionSexual: {
            vih: false, sifilis: false, gonorrea: false, herpesGenital: false, vph: false,
            ninguna: false, otra: false, otraDescripcion: ""
        },
        enfermedadesEruptivas: {
            sarampion: false, rubeola: false, escarlatina: false, varicela: false, paperas: false,
            ninguna: false, otra: false, otraDescripcion: ""
        },
        pulmonares: {
            neumonia: false, bronquitis: false, asma: false, epoc: false,
            ninguna: false, otra: false, otraDescripcion: ""
        },
        infecciosasParasitarias: {
            fiebreTifoidea: false, tuberculosis: false, amibiasis: false, giardiasis: false, ascariasis: false,
            ninguna: false, otra: false, otraDescripcion: ""
        },
        otrosPadecimientos: {
            // especificar ya no es necesario si usas otraDescripcion
            ninguna: false, otra: false, otraDescripcion: ""
        },
         // --- Otros APP --- (Asegurar valores iniciales)
         transfusiones: { realizado: false, fecha: '', motivo: ''},
         alergias: { presenta: false, descripcion: ''},
         cirugias: { realizado: false, descripcion: ''},
         hospitalizaciones: { realizado: false, descripcion: ''},
         medicamentosActuales: { toma: false, descripcion: ''},
    },
    // Considera si 'antecedentesAlergicos', 'Quirurgicos', 'Hemorragicos' deberían estar dentro de APP
    antecedentesAlergicos: { // Quizá mover a APP.alergias?
         tiposAlergias: { // Simplificado
             medicamentos: false,
             alimentos: false,
             ambiente: false,
             latex: false, // Añadido
             ninguna: false,
             otras: false
         },
         especificacionAlergias: "", // Descripción general
         administradoAnestesia: false, // ¿Pregunta relevante aquí o en Quirúrgicos?
         tipoAnestesia: "",
         reaccionAnestesia: false,
         descripcionReaccion: "",
    },
    antecedentesQuirurgicos: { // Quizá mover a APP.cirugias y APP.hospitalizaciones?
        realizado: false, // Reemplaza sinQuirurgicos
        descripcion: "", // Reemplaza cirugiasRealizadas y hospitalizacionesPrevias
        // Los demás campos parecen más relacionados con tratamiento actual que con antecedentes
    },
    antecedentesHemorragicos: { // Quizá mover a APP?
         presenta: false, // Reemplaza sinHemorragicos
         // Detalles si presenta = true
         sangradoProlongado: false, // Cambiar a boolean
         hematomasFrecuentes: false, // Cambiar a boolean y nombre
         hemorragiasEspontaneas: false, // Cambiar a boolean
         detallesAdicionales: "",
         // Transfusiones quizá van en APP.transfusiones
    },
    antecedentesGinecoObstetricos: { // Solo relevante si aplica
        aplica: false, // Añadir indicador
        menarca: '', // Edad primera menstruación
        ritmoMenstrual: '', // Regularidad y duración
        fum: '', // Fecha última menstruación (tipo date o string 'yyyy-mm-dd')
        ivsa: '', // Inicio vida sexual activa
        numeroParejas: 0,
        metodoAnticonceptivo: '',
        // Fórmula obstétrica
        gestas: 0, // Embarazos
        paras: 0, // Partos
        cesareas: 0,
        abortos: 0,
        // Otros
        fechaUltimoParto: '', // (tipo date o string 'yyyy-mm-dd')
        fechaUltimoAborto: '', // (tipo date o string 'yyyy-mm-dd')
        complicacionesEmbarazoParto: "",
        etsPrevias: '', // Enfermedades transmisión sexual
        fechaUltimaCitologia: '', // (tipo date o string 'yyyy-mm-dd')
        resultadoCitologia: '',
        autoexploracionMamaria: false,
        fechaUltimaMastografia: '', //(tipo date o string 'yyyy-mm-dd')
        resultadoMastografia: '',
    },
    // --- Interrogatorio por Aparatos y Sistemas ---
    interrogatorioSistemas: initialRedacciones, // Usa el objeto inicial definido arriba
    // --- Exploración Física ---
    exploracionFisica: {
        // ... (sin cambios aquí a menos que sea necesario) ...
        signosVitales: { ta: "", fc: "", fr: "", temperatura: "", peso: "", talla: "", imc: "" },
        exploracionGeneral: "", // Un campo general puede ser más útil
        // Si necesitas detallado:
        // cabeza: "", cuello: "", torax: "", abdomen: "", extremidades: "", pielAnexos: ""
    },
    // --- Exámenes Específicos (Odontología) ---
    // Considera agrupar estos bajo un objeto 'examenOdontologico'
    examenCabeza: { // Podría ser parte de exploracionFisica.cabeza
        sinHallazgos: false, craneo: "", cara: "", ojos: "", oidos: "", nariz: "", boca: "", atm: ""
    },
    articulacionCraneomandibular: {
        sinHallazgos: false, aperturaBucal: "", movimientoLateral: "", chasquidos: false,
        crepitacion: false, dolor: false, observaciones: ""
    },
    examenCuello: { // Podría ser parte de exploracionFisica.cuello
        sinHallazgos: false, gangliosLinfaticos: "", musculatura: "", tiroides: "",
        movilidad: "", observaciones: ""
    },
    examenIntrabucal: {
        sinHallazgos: false, lengua: "", paladarDuro: "", paladarBlando: "", mucosaYugal: "",
        pisoBoca: "", encias: "", dientes: "", observaciones: ""
    },
    glandulasSalivales: {
        sinHallazgos: false, parotida: "", submaxilar: "", sublingual: "", secrecion: "",
        observaciones: ""
    },
    oclusion: {
        sinHallazgos: false, clasificacionAngle: "", overjet: "", overbite: "",
        mordidaCruzada: false, mordidaAbierta: false, observaciones: ""
    },
    relacionDientes: { // Podría ir dentro de oclusion o examenIntrabucal.dientes
        sinHallazgos: false, relacionMolar: "", relacionCanina: "", apiñamiento: false,
        diastemas: false, observaciones: ""
    },
    lineaMedia: { // Podría ir dentro de oclusion
        sinHallazgos: false, coincidente: false, desviacion: "", observaciones: ""
    },
    frenillos: { // Podría ir dentro de examenIntrabucal
        sinHallazgos: false, labialSuperior: "", labialInferior: "", lingual: "",
        observaciones: ""
    },
    // --- Diagnóstico y Pronóstico ---
    diagnostico: {
        principal: "", // Podría ser un array si hay varios principales
        secundarios: "", // Podría ser un array
        observaciones: ""
    },
    pronostico: {
        general: "", // Bueno, Reservado, Malo
        particular: "", // Para condiciones específicas
        observaciones: ""
    },
     // Campos sueltos al final, ¿deberían agruparse?
     // Vivienda (ya está en APNP)
    // serviciosDomiciliarios: '',
    // pisosVivienda: '',
    // materialVivienda: '', // Duplicado
    // materialPiso: '',
    // ventilacion: '',
    // frecuenciaLimpieza: '', // Duplicado
    // hacinamiento: '', // Duplicado
     // Higiene (ya está en APNP)
    // frecuenciaBano: '', // Duplicado
    // higieneBucal: { // Duplicado
    //     frecuenciaCepillado: '', usoHiloDental: '', tipoCerdas: '',
    //     cantidadPasta: '', marcaPasta: '',
    // },
    // Alimentación (ya está en APNP)
    // alimentacion: { // Duplicado
    //     tipoDieta: '', frecuenciaComidas: '', tiposAlimentos: '',
    //     saltaComidas: '', consumoNutritivo: '',
    // },
     // Otros datos (¿dónde van?)
    grupoSanguineo: '', // Podría ir en APP o Datos Personales
    factorRh: '', // Podría ir en APP o Datos Personales
    inmunizaciones: '', // Podría ir en APP
     // Signos vitales (ya están en exploracionFisica)
    // peso: '', // Duplicado
    // imc: '', // Duplicado
    // talla: '', // Duplicado
    // presionArterial: '', // Duplicado
    // pulso: '', // Duplicado
    // frecuenciaCardiaca: '', // Duplicado
    // frecuenciaRespiratoria: '', // Duplicado
    // temperatura: '', // Duplicado
     // Diagnóstico/Pronóstico (ya están definidos)
    // diagnosticos: '', // Duplicado
    // pronosticos: '', // Duplicado
});