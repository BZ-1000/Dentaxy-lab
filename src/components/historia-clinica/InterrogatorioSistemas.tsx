
import React from 'react';

interface InterrogatorioSistemasProps {
  systemsData: {
    digestivo?: any;
    respiratorio?: any;
    cardiovascular?: any;
    genitoUrinaio?: any;
    endocrino?: any;
    tegumentario?: any;
    musculoEsqueletico?: any;
    nervioso?: any;
  };
  onChange: (system: string, value: string) => void;
}

const InterrogatorioSistemas: React.FC<InterrogatorioSistemasProps> = ({ systemsData, onChange }) => {

  // Helper functions for checking if all symptoms are 'ninguno'
  const isAllNone = (symptoms: any) =>
    symptoms && Object.values(symptoms).every((val) => val === 'ninguno');

  // Redactar función para cada sistema que genere texto según el prompt indicado

  const redactarAparatoDigestivo = () => {
    const d = systemsData.digestivo || {};
    const sintomas = d.sintomasDigestivos || {};
    const sintomasValues = Object.values(sintomas);
    const allNone = sintomasValues.length > 0 && sintomasValues.every(val => val === 'ninguno');

    const sintomasReportados = sintomasValues.filter(val => val !== 'ninguno' && val.trim() !== '');
    const sintomasTexto = sintomasReportados.length > 0 ? sintomasReportados.join(', ') + '.' : '';

    return allNone ||
      sintomasValues.length === 0
      ? `El paciente niega alteraciones relacionadas al sistema digestivo. Se interrogó específicamente sobre distensión abdominal, estreñimiento, plenitud posprandial, pirosis, dolor abdominal, náuseas, vómito y reflujo.`
      : `El paciente refiere alimentación ${d.tipoAlimentacion || '[sin especificar]'} y patrón de masticación ${d.patronMasticacion || '[sin especificar]'}. Reporta ${d.percepcionGusto || '[sin especificar]'} en la percepción del gusto y salivación ${d.salivacion || '[sin especificar]'}. ${d.dificultadDeglucion === 'no' ? 'No presenta dificultad ni dolor al tragar.' : 'Presenta dificultad o dolor al tragar.'} ${d.halitosis === 'no' ? 'Niega halitosis.' : 'Presenta halitosis.'} ${sintomasTexto} La frecuencia de evacuación es de ${d.frecuenciaEvacuacion || '[sin especificar]'} veces por día.`;
  };

  const redactarAparatoRespiratorio = () => {
    const r = systemsData.respiratorio || {};
    const sintomas = r.sintomasRespiratorios || {};
    const sintomasValues = Object.values(sintomas);
    const allNone = sintomasValues.length > 0 && sintomasValues.every(val => val === 'ninguno');

    const sintomasReportados = sintomasValues.filter(val => val !== 'ninguno' && val.trim() !== '');
    const sintomasTexto = sintomasReportados.length > 0 ? sintomasReportados.join(' y ') + '.' : '';

    return allNone ||
      sintomasValues.length === 0
      ? `El paciente niega alteraciones relacionadas al sistema respiratorio. Se interrogó específicamente sobre obstrucción nasal, rinorrea, congestión nasal, epistaxis, disnea, tos, dolor torácico, hernias, expectoraciones, secreciones y cianosis.`
      : `El paciente refiere respiración ${r.tipoRespiracion || '[sin especificar]'}. Presenta ${sintomasTexto} Niega disnea, dolor torácico u obstrucción nasal.`;
  };

  const redactarAparatoCardiovascular = () => {
    const c = systemsData.cardiovascular || {};
    const sintomas = c.sintomasCardiovasculares || {};
    const sintomasValues = Object.values(sintomas);
    const allNone = sintomasValues.length > 0 && sintomasValues.every(val => val === 'ninguno');

    return allNone ||
      sintomasValues.length === 0
      ? `El paciente niega alteraciones relacionadas al sistema cardiovascular.`
      : `El paciente ${
          c.dolorPectoral === 'no'
            ? 'refiere no presentar dolor en el pecho'
            : 'refiere dolor precordial'
        } y ${
          c.lipotimia === 'no'
            ? 'no ha presentado episodios de lipotimia'
            : 'ha tenido episodios de lipotimia'
        }. Reporta ritmo cardíaco ${
          c.ritmoCardiaco || '[sin especificar]'
        }. Sintomatología cardiovascular reportada: ${
          sintomasValues.filter(val => val !== 'ninguno').join(', ') || 'ninguna'
        }. Su presión arterial es ${
          c.presionArterialConocida
            ? `conocida como ${c.presionArterialConocida}`
            : '[sin especificar]'
        }. ${
          c.antecedentesInfarto === 'no'
            ? 'Niega antecedentes de infarto o enfermedad coronaria.'
            : 'Tiene antecedentes de infarto o enfermedad coronaria.'
        } ${
          c.fatigaFacil === 'no'
            ? 'No presenta fatiga fácil con esfuerzo leve.'
            : 'Presenta fatiga fácil con esfuerzo leve.'
        }`;
  };

  const redactarAparatoGenitoUrinario = () => {
    const g = systemsData.genitoUrinaio || {};
    const sintomas = g.sintomasUrinarios || {};
    const sintomasValues = Object.values(sintomas);
    const allNone = sintomasValues.length > 0 && sintomasValues.every(val => val === 'ninguno');

    const menstruacion = g.ultimaMenstruacion || '';
    const dismenorrea = g.dismenorrea || '';
    const ultimoParto = g.ultimoParto || '';
    const antecedentesObstetricos = g.antecedentesObstetricos || 'ninguno';

    return allNone ||
      sintomasValues.length === 0
      ? `El paciente niega alteraciones relacionadas al aparato genito-urinario. Se exploró la frecuencia urinaria, síntomas urinarios, urgencia urinaria, fuerza del chorro, infecciones recurrentes y flujo anormal.`
      : `El paciente refiere frecuencia urinaria de ${g.frecuenciaUrinaria || '[sin especificar]'} veces al día, ${sintomasValues.filter((val) => val !== 'ninguno').join(' y ')}. ${
          menstruacion ? `Última menstruación hace ${menstruacion}, ` : ''
        }${dismenorrea ? `refiere ${dismenorrea} y ` : ''}${ultimoParto ? `antecedentes obstétricos de ${ultimoParto}.` : `Antecedentes obstétricos: ${antecedentesObstetricos}.`}`;
  };

  const redactarSistemaEndocrino = () => {
    const e = systemsData.endocrino || {};
    const sintomas = e.sintomasEndocrinos || {};
    const sintomasValues = Object.values(sintomas);
    const allNone = sintomasValues.length > 0 && sintomasValues.every(val => val === 'ninguno');

    return allNone ||
      sintomasValues.length === 0
      ? `El paciente niega alteraciones relacionadas al sistema endocrino. Se indagó sobre poliuria, polidipsia, polifagia, exoftalmos, nerviosismo, temblores, insomnio, cambios de peso e intolerancia al frío o calor.`
      : `El paciente refiere ${sintomasValues.filter(val => val !== 'ninguno' && val.trim() !== '').join(', ')}. Reporta ${
          e.cambiosPeso || '[sin especificar]'
        } y refiere intolerancia al ${e.intoleranciaFrioCalor || '[sin especificar]'}.
        ${e.condicionesConocidas || 'No refiere condiciones endocrinas conocidas.'}`;
  };

  const redactarSistemaTegumentario = () => {
    const t = systemsData.tegumentario || {};
    const sintomas = t.sintomasTegumentarios || {};
    const sintomasValues = Object.values(sintomas);
    const allNone = sintomasValues.length > 0 && sintomasValues.every(val => val === 'ninguno');

    return allNone ||
      sintomasValues.length === 0
      ? `El paciente niega alteraciones relacionadas al sistema tegumentario. Se investigó presencia de erupciones, prurito, hiperhidrosis, pérdida de cabello y piel seca.`
      : `El paciente refiere cambios en la coloración de la piel, así como ${sintomasValues.filter(val => val !== 'ninguno').join(', ')}. Niega erupciones.`;
  };

  const redactarSistemaMusculoEsqueletico = () => {
    const m = systemsData.musculoEsqueletico || {};
    const sintomas = m.sintomasMusculoEsqueleticos || {};
    const sintomasValues = Object.values(sintomas);
    const allNone = sintomasValues.length > 0 && sintomasValues.every(val => val === 'ninguno');

    return allNone ||
      sintomasValues.length === 0
      ? `El paciente niega alteraciones relacionadas al sistema músculo-esquelético. Se interrogó sobre fracturas, esguinces, deformidad o dolor articular, rigidez matutina, calambres musculares y limitaciones de movimiento.`
      : `El paciente refiere haber tenido una fractura o esguince. Presenta ${sintomasValues.filter(val => val !== 'ninguno').join(', ')}.`;
  };

  const redactarSistemaNervioso = () => {
    const n = systemsData.nervioso || {};
    const sintomas = n.sintomasNeurologicos || {};
    const sintomasValues = Object.values(sintomas);
    const allNone = sintomasValues.length > 0 && sintomasValues.every(val => val === 'ninguno');

    return allNone ||
      sintomasValues.length === 0
      ? `El paciente niega alteraciones relacionadas al sistema nervioso. Se preguntó sobre trastornos del sueño, estado de ánimo, parestesias, convulsiones, temblores, problemas de memoria, personalidad y coordinación.`
      : `El paciente refiere ${n.percepcionSentidos || 'percepción conservada de los sentidos'}, duerme de ${n.horasSueno || '[sin especificar]'} horas diarias y presenta ${
          n.trastornosSueno || 'trastornos del sueño ausentes'
        }. Reporta estado de ánimo ${n.estadoAnimo || '[sin especificar]'} y parestesias en ${n.parestesias || '[sin especificar]'}.`;
  };

  return (
    <div className="space-y-4 p-2 text-justify">
      <p><strong>Aparato Digestivo:</strong> {redactarAparatoDigestivo()}</p>
      <p><strong>Aparato Respiratorio:</strong> {redactarAparatoRespiratorio()}</p>
      <p><strong>Aparato Cardiovascular:</strong> {redactarAparatoCardiovascular()}</p>
      <p><strong>Aparato Genito-Urinario:</strong> {redactarAparatoGenitoUrinario()}</p>
      <p><strong>Sistema Endocrino:</strong> {redactarSistemaEndocrino()}</p>
      <p><strong>Sistema Tegumentario:</strong> {redactarSistemaTegumentario()}</p>
      <p><strong>Sistema Músculo-Esquelético:</strong> {redactarSistemaMusculoEsqueletico()}</p>
      <p><strong>Sistema Nervioso:</strong> {redactarSistemaNervioso()}</p>
    </div>
  );
};

export default InterrogatorioSistemas;

