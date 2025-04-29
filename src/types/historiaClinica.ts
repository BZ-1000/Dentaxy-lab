
export interface FormDataState {
  // Basic patient information sections
  informacionGeneralPaciente?: {
    [key: string]: any;
  };
  // Exam sections
  examenCabeza?: {
    tez?: string;
    estadoPiel?: string;
    tipoCraneo?: string;
    tipoPerfil?: string;
    otrosHallazgos?: string;
    [key: string]: any;
  };
  articulacionCraneomandibular?: {
    labios?: any;
    dolorMasticarHablar?: boolean;
    tipoDolor?: string;
    duracionDolor?: string;
    dolorEspecifico?: boolean;
    motivoDolor?: string;
    ruidoArticular?: string;
    patronAbertura?: string;
    otroPatronAbertura?: string;
    otrasObservaciones?: string;
    [key: string]: any;
  };
  exploracionFisica?: {
    signosVitales?: {
      [key: string]: string;
    };
    examenGeneral?: {
      [key: string]: string;
    };
    cabezaYCuello?: {
      [key: string]: string;
    };
    toraxYPulmones?: {
      [key: string]: string;
    };
    cardiovascular?: {
      [key: string]: string;
    };
    abdomen?: {
      [key: string]: string;
    };
    genitourinario?: {
      [key: string]: string;
    };
    musculoesqueletico?: {
      [key: string]: string;
    };
    neurologico?: {
      [key: string]: string;
    };
    pielYFaneras?: {
      [key: string]: string;
    };
    mental?: {
      [key: string]: string;
    };
    exploracion?: {
      [key: string]: string;
    };
    observaciones?: string;
    [key: string]: any;
  };
  // Add other form sections as needed
  [key: string]: any;
}
