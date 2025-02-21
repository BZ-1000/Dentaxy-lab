
export interface FormDataState {
  padecimientoActual: {
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
  };
  antecedentesHeredoFamiliares: {
    [key: string]: {
      finado: boolean;
      causaMuerte: string;
      condiciones: {
        [key: string]: boolean | string;
      };
    };
  };
  serviciosDomiciliarios: {
    tipoVivienda: string;
    materialVivienda: string;
    condicionesCalle: string;
    iluminacionCalle: string;
    servicios: {
      [key: string]: boolean;
    };
  };
}
