
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
  // Helper to safely cast value to string and trim, or empty string
  const safeTrim = (val: unknown) => typeof val === 'string' ? val.trim() : '';

  // Helper functions for checking if all symptoms are 'ninguno'
  const isAllNone = (symptoms: any) =>
    symptoms && Object.values(symptoms).every((val) => val === 'ninguno');

  const redactarAparatoDigestivo = () => {
    const d = systemsData.digestivo || {};
    const sintomas = d.sintomasDigestivos || {};
    const sintomasValues = Object.values(sintomas);
    const allNone = sintomasValues.length > 0 && sintomasValues.every(val => val === 'ninguno');

    const sintomasReportados = sintomasValues.filter(val => val !== 'ninguno' && safeTrim(val) !== '');
    const sintomasTexto = sintomasReportados.length > 0 ? sintomasReportados.join(', ') + '.' : '';

    return allNone ||
      sintomasValues.length === 0
      ? `El paciente niega alteraciones relacionadas al sistema digestivo. Se interrogó específicamente sobre distensión abdominal, estreñimiento, plenitud posprandial, pirosis, dolor abdominal, náuseas, vómito y reflujo.`
      : `El paciente refiere alimentación ${d.tipoAlimentacion || '[sin especificar]'}. Su patrón de masticación es ${d.patronMasticacion || '[sin especificar]'}. Manifiesta ${d.percepcionGusto || '[sin especificar]'}. La salivación es ${d.salivacion || '[sin especificar]'}. Respecto a la deglución, ${d.dificultadDeglucion || '[sin especificar]'}. ${d.halitosis === 'no' ? 'No presenta halitosis.' : 'Presenta halitosis.'} Ha experimentado los siguientes síntomas digestivos: ${sintomasTexto} La frecuencia de evacuación es de ${d.frecuenciaEvacuacion || '[sin especificar]'} veces por día.`;
  };

  const redactarAparatoRespiratorio = () => {
    const r = systemsData.respiratorio || {};
    const sintomas = r.sintomasRespiratorios || {};
    const sintomasValues = Object.values(sintomas);
    const allNone = sintomasValues.length > 0 && sintomasValues.every(val => val === 'ninguno');

    const sintomasReportados = sintomasValues.filter(val => val !== 'ninguno' && safeTrim(val) !== '');
    const sintomasTexto = sintomasReportados.length > 0 ? sintomasReportados.join(', ') + '.' : '';

    return allNone || sintomasValues.length === 0
      ? `El paciente niega alteraciones relacionadas al sistema respiratorio. Se interrogó específicamente sobre obstrucción nasal, rinorrea, congestión nasal, epistaxis, disnea, tos, dolor torácico, hernias, expectoraciones, secreciones y cianosis.`
      : `El tipo de respiración habitual es ${r.tipoRespiracion || '[sin especificar]'}. Presenta síntomas respiratorios como: ${sintomasTexto} No presenta apnea del sueño. No usa oxígeno suplementario.`;
  };

  const redactarAparatoCardiovascular = () => {
    const c = systemsData.cardiovascular || {};
    const sintomas = c.sintomasCardiovasculares || {};
    const sintomasValues = Object.values(sintomas);
    const allNone = sintomasValues.length > 0 && sintomasValues.every(val => val === 'ninguno');

    return allNone || sintomasValues.length === 0
      ? `Refiere dolor precordial. No ha presentado episodios de lipotimia. El ritmo cardíaco es ${c.ritmoCardiaco || '[sin especificar]'}. Sintomatología cardiovascular reportada: ninguna.  No tiene antecedentes de infarto o enfermedad coronaria. No presenta fatiga fácil con esfuerzo leve.`
      : `El paciente refiere dolor precordial. ${c.lipotimia === 'no' ? 'No ha presentado episodios de lipotimia.' : 'Ha presentado episodios de lipotimia.'} El ritmo cardíaco es ${c.ritmoCardiaco || '[sin especificar]'}. Sintomatología cardiovascular reportada: ${sintomasValues.filter(val => val !== 'ninguno').join(', ')}.  ${c.antecedentesInfarto === 'no' ? 'No tiene antecedentes de infarto o enfermedad coronaria.' : 'Tiene antecedentes de infarto o enfermedad coronaria.'} ${c.fatigaFacil === 'no' ? 'No presenta fatiga fácil con esfuerzo leve.' : 'Presenta fatiga fácil con esfuerzo leve.'}`;
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
      : `El paciente refiere una frecuencia urinaria de ${g.frecuenciaUrinaria || '[sin especificar]'} veces al día. Síntomas urinarios presentes: ${sintomasValues.filter((val) => val !== 'ninguno').join(', ')}. No presenta urgencia urinaria. No presenta chorro urinario débil. No presenta chorro urinario intermitente. No presenta flujo vaginal/uretral anormal. No presenta infecciones urinarias frecuentes. Antecedentes obstétricos: ${antecedentesObstetricos}.${menstruacion ? ` Última menstruación hace ${menstruacion}.` : ''}${dismenorrea ? ` Refieres ${dismenorrea}.` : ''}${ultimoParto ? ` Último parto hace ${ultimoParto}.` : ''}`;
  };

  const redactarSistemaEndocrino = () => {
    const e = systemsData.endocrino || {};
    const sintomas = e.sintomasEndocrinos || {};
    const sintomasValues = Object.values(sintomas);
    const allNone = sintomasValues.length > 0 && sintomasValues.every(val => val === 'ninguno');

    return allNone || sintomasValues.length === 0
      ? `El paciente refiere los siguientes síntomas endocrinos: ninguno. No presenta sudoración excesiva nocturna. No presenta hirsutismo. No presenta galactorrea.  Reporta ${e.cambiosPeso || '[sin especificar]'}. ${e.intoleranciaFrioCalor || '[sin especificar]'}. Antecedentes patológicos conocidos: ninguno.`
      : `El paciente refiere los siguientes síntomas endocrinos: ${sintomasValues.filter(val => val !== 'ninguno' && safeTrim(val) !== '').join(', ')}. Reporta ${e.cambiosPeso || '[sin especificar]'}. ${e.intoleranciaFrioCalor || '[sin especificar]'}. Antecedentes patológicos conocidos: ${e.condicionesConocidas || 'ninguno'}.`;
  };

  const redactarSistemaTegumentario = () => {
    const t = systemsData.tegumentario || {};
    const sintomas = t.sintomasTegumentarios || {};
    const sintomasValues = Object.values(sintomas);
    const allNone = sintomasValues.length > 0 && sintomasValues.every(val => val === 'ninguno');

    return allNone || sintomasValues.length === 0
      ? `No ha notado cambios en la coloración de la piel.  Otros síntomas presentes: ninguno.  No presenta cambios en lunares. No presenta lesiones pigmentadas.`
      : `El paciente refiere cambios en la coloración de la piel, así como ${sintomasValues.filter(val => val !== 'ninguno').join(', ')}. Niega erupciones.`;
  };

  const redactarSistemaMusculoEsqueletico = () => {
    const m = systemsData.musculoEsqueletico || {};
    const sintomas = m.sintomasMusculoEsqueleticos || {};
    const sintomasValues = Object.values(sintomas);
    const allNone = sintomasValues.length > 0 && sintomasValues.every(val => val === 'ninguno');

    return allNone || sintomasValues.length === 0
      ? `Ha presentado fracturas o esguinces.  Sintomatología musculoesquelética actual: ninguna.   .`
      : `El paciente refiere haber tenido una fractura o esguince. Presenta ${sintomasValues.filter(val => val !== 'ninguno').join(', ')}.`;
  };

  const redactarSistemaNervioso = () => {
    const n = systemsData.nervioso || {};
    const sintomas = n.sintomasNeurologicos || {};
    const sintomasValues = Object.values(sintomas);
    const allNone = sintomasValues.length > 0 && sintomasValues.every(val => val === 'ninguno');

    return allNone || sintomasValues.length === 0
      ? `No percibe adecuadamente a través de los órganos de los sentidos. El patrón de sueño habitual es de ${n.horasSueno || '[sin especificar]'} horas por noche. No presenta trastornos del sueño.  Su carácter habitual se describe como ${n.estadoAnimo || '[sin especificar]'}. No presenta parestesias (hormigueos, adormecimiento o pérdida de sensibilidad). Otros síntomas neurológicos: ninguno.`
      : `El paciente refiere ${n.percepcionSentidos || 'percepción conservada de los sentidos'}, duerme de ${n.horasSueno || '[sin especificar]'} horas diarias y presenta ${n.trastornosSueno || 'trastornos del sueño ausentes'}. Reporta estado de ánimo ${n.estadoAnimo || '[sin especificar]'} y parestesias en ${n.parestesias || '[sin especificar]'}.`;
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

