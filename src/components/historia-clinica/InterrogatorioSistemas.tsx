
import React from 'react';

interface InterrogatorioSistemasProps {
  systemsData: {
    digestivo: any;
    respiratorio: any;
    cardiovascular: any;
    genitoUrinaio: any;
    endocrino: any;
    tegumentario: any;
    musculoEsqueletico: any;
    nervioso: any;
  };
}

const InterrogatorioSistemas = ({ systemsData }: InterrogatorioSistemasProps) => {

  // Función para generar redacción aparato digestivo
  const generarRedaccionDigestivo = (data: any) => {
    const {
      alimentacion,
      patronMasticacion,
      percepcionGusto,
      estadoSalivacion,
      dificultadTragar,
      dolorTragar,
      halitosis,
      sintomas,
      frecuenciaEvacuacion,
    } = data;

    // Construir lista de síntomas diferentes a "ninguno"
    const sintomasPresentes = Object.entries(sintomas || {})
      .filter(([key, value]) => value !== 'ninguno' && value !== undefined && value !== null)
      .map(([key, value]) => `${value}`);

    const sintomasTexto = sintomasPresentes.length > 0 ? sintomasPresentes.join(', ') : '';

    let texto = `El paciente refiere alimentación ${alimentacion} y patrón de masticación ${patronMasticacion}. `;
    texto += `Reporta ${percepcionGusto} en la percepción del gusto y ${estadoSalivacion} en la salivación. `;
    texto += `No presenta ${dificultadTragar ? 'dificultad' : 'dificultad'} ni ${dolorTragar ? 'dolor' : 'dolor'} al tragar. `;
    texto += `${halitosis ? '' : 'Niega '}halitosis. `;

    if (sintomasTexto) {
      texto += `Refirió ${sintomasTexto}. `;
    }

    if (
      sintomasPresentes.length === 0 ||
      (sintomasPresentes.length === 1 && sintomasPresentes[0].toLowerCase() === 'ninguno')
    ) {
      texto += "El paciente niega alteraciones relacionadas al sistema digestivo. Se interrogó específicamente sobre distensión abdominal, estreñimiento, plenitud posprandial, pirosis, dolor abdominal, náuseas, vómito y reflujo.";
    }

    texto += ` La frecuencia de evacuación es de ${frecuenciaEvacuacion}.`;

    return texto;
  };

  // Función para generar redacción aparato respiratorio
  const generarRedaccionRespiratorio = (data: any) => {
    const {
      tipoRespiracion,
      sintomas,
    } = data;

    const sintomasPresentes = Object.entries(sintomas || {})
      .filter(([key, value]) => value !== 'ninguno' && value !== undefined && value !== null)
      .map(([key, value]) => `${value}`);

    const sintomasTexto = sintomasPresentes.length > 0 ? sintomasPresentes.join(' y ') : '';

    let texto = `El paciente refiere respiración ${tipoRespiracion}. `;

    if (sintomasTexto) {
      texto += `Presenta ${sintomasTexto}. `;
    }

    if (
      sintomasPresentes.length === 0 ||
      (sintomasPresentes.length === 1 && sintomasPresentes[0].toLowerCase() === 'ninguno')
    ) {
      texto += "El paciente niega alteraciones relacionadas al sistema respiratorio. Se interrogó específicamente sobre obstrucción nasal, rinorrea, congestión nasal, epistaxis, disnea, tos, dolor torácico, hernias, expectoraciones, secreciones y cianosis.";
    }

    return texto;
  };

  // Función para generar redacción aparato cardiovascular
  const generarRedaccionCardiovascular = (data: any) => {
    const {
      dolorPecho,
      lipotimia,
      ritmoCardiaco,
      sintomas,
      presionArterialConocida,
      presionArterialRango,
      antecedentesInfarto,
      fatigaFacil,
    } = data;

    const sintomasPresentes = Object.entries(sintomas || {})
      .filter(([key, value]) => value !== 'ninguno' && value !== undefined && value !== null)
      .map(([key, value]) => `${value}`);

    const sintomasTexto = sintomasPresentes.length > 0 ? sintomasPresentes.join(' y ') : '';

    let texto = `El paciente refiere ${dolorPecho ? '' : 'no '}presentar dolor en el pecho `;
    texto += `ni ${lipotimia ? '' : 'no '}lipotimia. `;
    texto += `Reporta ritmo cardíaco ${ritmoCardiaco}. `;

    if (sintomasTexto) {
      texto += `Indica presencia de ${sintomasTexto}. `;
    }

    if (presionArterialConocida) {
      texto += `Su presión arterial es conocida como ${presionArterialRango}. `;
    } else {
      texto += `No se tiene conocimiento de su presión arterial. `;
    }

    texto += antecedentesInfarto ? `Tiene antecedentes de infarto o enfermedad coronaria. ` : 'Niega antecedentes de infarto y no presenta fatiga fácil con esfuerzo leve. ';

    texto += fatigaFacil ? 'Presenta fatiga fácil con esfuerzo leve.' : 'No presenta fatiga fácil con esfuerzo leve.';

    return texto;
  };

  // Función para generar redacción aparato genito-urinario
  const generarRedaccionGenitoUrinario = (data: any) => {
    const {
      frecuenciaUrinaria,
      sintomas,
      ultimaMenstruacion,
      dismenorrea,
      ultimoParto,
      antecedentesObstetricos,
    } = data;

    const sintomasPresentes = Object.entries(sintomas || {})
      .filter(([key, value]) => value !== 'ninguno' && value !== undefined && value !== null)
      .map(([key, value]) => `${value}`);

    const sintomasTexto = sintomasPresentes.length > 0 ? sintomasPresentes.join(', ') : '';

    let texto = `El paciente refiere frecuencia urinaria de ${frecuenciaUrinaria}`;

    if (sintomasTexto) {
      texto += `, ${sintomasTexto}`;
    }

    texto += '. ';

    if (ultimaMenstruacion) {
      texto += `Última menstruación hace ${ultimaMenstruacion}. `;
    }

    texto += dismenorrea ? 'Refiere dismenorrea. ' : 'Niega dismenorrea. ';

    if (ultimoParto) {
      texto += `Último parto hace ${ultimoParto}. `;
    }

    if (antecedentesObstetricos) {
      texto += `Antecedentes obstétricos: ${antecedentesObstetricos}. `;
    }

    if (
      sintomasPresentes.length === 0 ||
      (sintomasPresentes.length === 1 && sintomasPresentes[0].toLowerCase() === 'ninguno')
    ) {
      texto += "El paciente niega alteraciones relacionadas al aparato genito-urinario. Se exploró la frecuencia urinaria, síntomas urinarios, urgencia urinaria, fuerza del chorro, infecciones recurrentes y flujo anormal.";
    }

    return texto;
  };

  // Función para generar redacción sistema endocrino
  const generarRedaccionEndocrino = (data: any) => {
    const {
      sintomas,
      cambiosPeso,
      intoleranciaFrioCalor,
      condiccionConocida,
    } = data;

    const sintomasPresentes = Object.entries(sintomas || {})
      .filter(([key, value]) => value !== 'ninguno' && value !== undefined && value !== null)
      .map(([key, value]) => `${value}`);

    const sintomasTexto = sintomasPresentes.length > 0 ? sintomasPresentes.join(', ') : '';

    let texto = '';

    if (sintomasTexto) {
      texto += `El paciente refiere ${sintomasTexto}. `;
    }

    texto += `Reporta ${cambiosPeso} en los últimos meses `;

    texto += intoleranciaFrioCalor ? `y refiere intolerancia al ${intoleranciaFrioCalor}. ` : '. ';

    if (condiccionConocida) {
      texto += `Tiene diagnóstico conocido de ${condiccionConocida}.`;
    }

    if (
      sintomasPresentes.length === 0 ||
      (sintomasPresentes.length === 1 && sintomasPresentes[0].toLowerCase() === 'ninguno')
    ) {
      texto = "El paciente niega alteraciones relacionadas al sistema endocrino. Se indagó sobre poliuria, polidipsia, polifagia, exoftalmos, nerviosismo, temblores, insomnio, cambios de peso e intolerancia al frío o calor.";
    }

    return texto;
  };

  // Función para generar redacción sistema tegumentario
  const generarRedaccionTegumentario = (data: any) => {
    const {
      cambiosColoracion,
      sintomas,
    } = data;

    const sintomasPresentes = Object.entries(sintomas || {})
      .filter(([key, value]) => value !== 'ninguno' && value !== undefined && value !== null)
      .map(([key, value]) => `${value}`);

    const sintomasTexto = sintomasPresentes.length > 0 ? sintomasPresentes.join(', ') : '';

    let texto = '';

    if (cambiosColoracion) {
      texto += `El paciente refiere cambios en la coloración de la piel. `;
    } else {
      texto += `El paciente no refiere cambios en la coloración de la piel. `;
    }

    if (sintomasTexto) {
      texto += `Además presenta ${sintomasTexto}. `;
    }

    if (
      sintomasPresentes.length === 0 ||
      (sintomasPresentes.length === 1 && sintomasPresentes[0].toLowerCase() === 'ninguno')
    ) {
      texto = "El paciente niega alteraciones relacionadas al sistema tegumentario. Se investigó presencia de erupciones, prurito, hiperhidrosis, pérdida de cabello y piel seca.";
    }

    return texto;
  };

  // Función para generar redacción sistema músculo-esquelético
  const generarRedaccionMusculoEsqueletico = (data: any) => {
    const {
      antecedentesFracturas,
      detallesFracturas,
      sintomas,
    } = data;

    const sintomasPresentes = Object.entries(sintomas || {})
      .filter(([key, value]) => value !== 'ninguno' && value !== undefined && value !== null)
      .map(([key, value]) => `${value}`);

    const sintomasTexto = sintomasPresentes.length > 0 ? sintomasPresentes.join(', ') : '';

    let texto = '';

    if (antecedentesFracturas) {
      texto += `El paciente refiere haber tenido una fractura en ${detallesFracturas}. `;
    }

    if (sintomasTexto) {
      texto += `Presenta ${sintomasTexto}. `;
    }

    if (
      sintomasPresentes.length === 0 ||
      (sintomasPresentes.length === 1 && sintomasPresentes[0].toLowerCase() === 'ninguno')
    ) {
      texto += "El paciente niega alteraciones relacionadas al sistema músculo-esquelético. Se interrogó sobre fracturas, esguinces, deformidad o dolor articular, rigidez matutina, calambres musculares y limitaciones de movimiento.";
    }

    return texto;
  };

  // Función para generar redacción sistema nervioso
  const generarRedaccionNervioso = (data: any) => {
    const {
      alteracionPercepcionSentidos,
      horasDormidas,
      trastornosSueno,
      estadoAnimo,
      parestesias,
      sintomas,
    } = data;

    const sintomasPresentes = Object.entries(sintomas || {})
      .filter(([key, value]) => value !== 'ninguno' && value !== undefined && value !== null)
      .map(([key]) => key);

    let texto = `El paciente refiere ${alteracionPercepcionSentidos ? '' : 'no '}alteración en la percepción de los sentidos. `;
    texto += `Duerme de ${horasDormidas} horas diarias y `;

    texto += trastornosSueno ? `presenta trastornos del sueño. ` : `no presenta trastornos del sueño. `;

    texto += `Reporta estado de ánimo ${estadoAnimo}. `;

    texto += parestesias ? `Refiere parestesias.` : `No refiere parestesias. `;

    if (
      !sintomas || Object.values(sintomas).every(val => val === 'ninguno' || val === undefined || val === null)
    ) {
      texto += "El paciente niega alteraciones relacionadas al sistema nervioso. Se preguntó sobre trastornos del sueño, estado de ánimo, parestesias, convulsiones, temblores, problemas de memoria, personalidad y coordinación.";
    }

    return texto;
  };

  return (
    <div className="space-y-6">
      {/* Renderizamos la redacción generada para cada sistema */}
      <section>
        <h3 className="font-bold">Aparato Digestivo</h3>
        <p>{generarRedaccionDigestivo(systemsData.digestivo)}</p>
      </section>
      <section>
        <h3 className="font-bold">Aparato Respiratorio</h3>
        <p>{generarRedaccionRespiratorio(systemsData.respiratorio)}</p>
      </section>
      <section>
        <h3 className="font-bold">Aparato Cardiovascular</h3>
        <p>{generarRedaccionCardiovascular(systemsData.cardiovascular)}</p>
      </section>
      <section>
        <h3 className="font-bold">Aparato Genito-Urinario</h3>
        <p>{generarRedaccionGenitoUrinario(systemsData.genitoUrinaio)}</p>
      </section>
      <section>
        <h3 className="font-bold">Sistema Endocrino</h3>
        <p>{generarRedaccionEndocrino(systemsData.endocrino)}</p>
      </section>
      <section>
        <h3 className="font-bold">Sistema Tegumentario</h3>
        <p>{generarRedaccionTegumentario(systemsData.tegumentario)}</p>
      </section>
      <section>
        <h3 className="font-bold">Sistema Músculo-Esquelético</h3>
        <p>{generarRedaccionMusculoEsqueletico(systemsData.musculoEsqueletico)}</p>
      </section>
      <section>
        <h3 className="font-bold">Sistema Nervioso</h3>
        <p>{generarRedaccionNervioso(systemsData.nervioso)}</p>
      </section>
    </div>
  );
};

export default InterrogatorioSistemas;

