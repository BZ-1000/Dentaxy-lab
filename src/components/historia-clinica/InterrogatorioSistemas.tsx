import React from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

interface InterrogatorioSistemasProps {
  formData: any;
  handleInterrogatorioChange: (system: string, value: string) => void;
}

const InterrogatorioSistemas: React.FC<InterrogatorioSistemasProps> = ({ formData, handleInterrogatorioChange }) => {

  let digestivoText = '';
  let respiratorioText = '';
  let cardiovascularText = '';
  let genitoUrinarioText = '';
  let endocrinoText = '';
  let tegumentarioText = '';
  let musculoEsqueleticoText = '';
  let nerviosoText = '';

  // Digestivo
  const digestivoAlimentacion = formData.interrogatorioSistemas?.digestivoAlimentacion || '';
  const digestivoMasticacion = formData.interrogatorioSistemas?.digestivoMasticacion || '';
  const digestivoGusto = formData.interrogatorioSistemas?.digestivoGusto || '';
  const digestivoSalivacion = formData.interrogatorioSistemas?.digestivoSalivacion || '';
  const digestivoDeglucion = formData.interrogatorioSistemas?.digestivoDeglucion || '';
  const digestivoHalitosis = formData.interrogatorioSistemas?.digestivoHalitosis || '';
  const digestivoDistension = formData.interrogatorioSistemas?.digestivoDistension || '';
  const digestivoEstrenimiento = formData.interrogatorioSistemas?.digestivoEstrenimiento || '';
  const digestivoPlenitud = formData.interrogatorioSistemas?.digestivoPlenitud || '';
  const digestivoPirosis = formData.interrogatorioSistemas?.digestivoPirosis || '';
  const digestivoDolor = formData.interrogatorioSistemas?.digestivoDolor || '';
  const digestivoNauseas = formData.interrogatorioSistemas?.digestivoNauseas || '';
  const digestivoVomito = formData.interrogatorioSistemas?.digestivoVomito || '';
  const digestivoReflujo = formData.interrogatorioSistemas?.digestivoReflujo || '';
  const digestivoEvacuacion = formData.interrogatorioSistemas?.digestivoEvacuacion || '';

  if (digestivoAlimentacion) {
    digestivoText += `El paciente refiere alimentación ${digestivoAlimentacion}. `;
  }
  if (digestivoMasticacion) {
    digestivoText += `Presenta patrón de masticación ${digestivoMasticacion}. `;
  }
  if (digestivoGusto) {
    digestivoText += `Reporta percepción del gusto ${digestivoGusto}. `;
  }
  if (digestivoSalivacion) {
    digestivoText += `Estado de salivación: ${digestivoSalivacion}. `;
  }
  if (digestivoDeglucion) {
    digestivoText += `Refiere ${digestivoDeglucion} al tragar. `;
  }
  if (digestivoHalitosis) {
    digestivoText += `Indica ${digestivoHalitosis} halitosis. `;
  }
  if (digestivoDistension && digestivoDistension !== 'ninguno') {
    digestivoText += `Presenta distensión abdominal. `;
  }
  if (digestivoEstrenimiento && digestivoEstrenimiento !== 'ninguno') {
    digestivoText += `Sufre de estreñimiento. `;
  }
  if (digestivoPlenitud && digestivoPlenitud !== 'ninguno') {
    digestivoText += `Experimenta plenitud posprandial. `;
  }
  if (digestivoPirosis && digestivoPirosis !== 'ninguno') {
    digestivoText += `Tiene episodios de pirosis. `;
  }
  if (digestivoDolor && digestivoDolor !== 'ninguno') {
    digestivoText += `Siente dolor abdominal. `;
  }
  if (digestivoNauseas && digestivoNauseas !== 'ninguno') {
    digestivoText += `Presenta náuseas. `;
  }
  if (digestivoVomito && digestivoVomito !== 'ninguno') {
    digestivoText += `Ha tenido vómitos. `;
  }
  if (digestivoReflujo && digestivoReflujo !== 'ninguno') {
    digestivoText += `Experimenta reflujo. `;
  }
  if (digestivoEvacuacion) {
    digestivoText += `La frecuencia de evacuación es de ${digestivoEvacuacion}. `;
  }

  if (
    digestivoDistension === 'ninguno' &&
    digestivoEstrenimiento === 'ninguno' &&
    digestivoPlenitud === 'ninguno' &&
    digestivoPirosis === 'ninguno' &&
    digestivoDolor === 'ninguno' &&
    digestivoNauseas === 'ninguno' &&
    digestivoVomito === 'ninguno' &&
    digestivoReflujo === 'ninguno'
  ) {
    digestivoText += "El paciente niega alteraciones relacionadas al sistema digestivo. Se interrogó específicamente sobre distensión abdominal, estreñimiento, plenitud posprandial, pirosis, dolor abdominal, náuseas, vómito y reflujo.";
  }

  // Respiratorio
  const respiratorioRespiracion = formData.interrogatorioSistemas?.respiratorioRespiracion || '';
  const respiratorioObstruccion = formData.interrogatorioSistemas?.respiratorioObstruccion || '';
  const respiratorioRinorrea = formData.interrogatorioSistemas?.respiratorioRinorrea || '';
  const respiratorioCongestion = formData.interrogatorioSistemas?.respiratorioCongestion || '';
  const respiratorioEpistaxis = formData.interrogatorioSistemas?.respiratorioEpistaxis || '';
  const respiratorioDisnea = formData.interrogatorioSistemas?.respiratorioDisnea || '';
  const respiratorioTos = formData.interrogatorioSistemas?.respiratorioTos || '';
  const respiratorioDolor = formData.interrogatorioSistemas?.respiratorioDolor || '';
  const respiratorioHernias = formData.interrogatorioSistemas?.respiratorioHernias || '';
  const respiratorioExpectoraciones = formData.interrogatorioSistemas?.respiratorioExpectoraciones || '';
  const respiratorioSecreciones = formData.interrogatorioSistemas?.respiratorioSecreciones || '';
  const respiratorioCianosis = formData.interrogatorioSistemas?.respiratorioCianosis || '';

  if (respiratorioRespiracion) {
    respiratorioText += `El paciente refiere respiración ${respiratorioRespiracion}. `;
  }
  if (respiratorioObstruccion && respiratorioObstruccion !== 'ninguno') {
    respiratorioText += `Presenta obstrucción nasal. `;
  }
  if (respiratorioRinorrea && respiratorioRinorrea !== 'ninguno') {
    respiratorioText += `Tiene rinorrea. `;
  }
  if (respiratorioCongestion && respiratorioCongestion !== 'ninguno') {
    respiratorioText += `Sufre de congestión nasal. `;
  }
  if (respiratorioEpistaxis && respiratorioEpistaxis !== 'ninguno') {
    respiratorioText += `Experimenta epistaxis. `;
  }
  if (respiratorioDisnea && respiratorioDisnea !== 'ninguno') {
    respiratorioText += `Presenta disnea. `;
  }
  if (respiratorioTos && respiratorioTos !== 'ninguno') {
    respiratorioText += `Tiene tos. `;
  }
  if (respiratorioDolor && respiratorioDolor !== 'ninguno') {
    respiratorioText += `Siente dolor torácico. `;
  }
  if (respiratorioHernias && respiratorioHernias !== 'ninguno') {
    respiratorioText += `Presenta hernias. `;
  }
  if (respiratorioExpectoraciones && respiratorioExpectoraciones !== 'ninguno') {
    respiratorioText += `Tiene expectoraciones. `;
  }
  if (respiratorioSecreciones && respiratorioSecreciones !== 'ninguno') {
    respiratorioText += `Presenta secreciones. `;
  }
  if (respiratorioCianosis && respiratorioCianosis !== 'ninguno') {
    respiratorioText += `Muestra cianosis. `;
  }

  if (
    respiratorioObstruccion === 'ninguno' &&
    respiratorioRinorrea === 'ninguno' &&
    respiratorioCongestion === 'ninguno' &&
    respiratorioEpistaxis === 'ninguno' &&
    respiratorioDisnea === 'ninguno' &&
    respiratorioTos === 'ninguno' &&
    respiratorioDolor === 'ninguno' &&
    respiratorioHernias === 'ninguno' &&
    respiratorioExpectoraciones === 'ninguno' &&
    respiratorioSecreciones === 'ninguno' &&
    respiratorioCianosis === 'ninguno'
  ) {
    respiratorioText += "El paciente niega alteraciones relacionadas al sistema respiratorio. Se interrogó específicamente sobre obstrucción nasal, rinorrea, congestión nasal, epistaxis, disnea, tos, dolor torácico, hernias, expectoraciones, secreciones y cianosis.";
  }

  // Cardiovascular
  const cardiovascularDolor = formData.interrogatorioSistemas?.cardiovascularDolor || '';
  const cardiovascularLipotimia = formData.interrogatorioSistemas?.cardiovascularLipotimia || '';
  const cardiovascularRitmo = formData.interrogatorioSistemas?.cardiovascularRitmo || '';
  const cardiovascularVarices = formData.interrogatorioSistemas?.cardiovascularVarices || '';
  const cardiovascularCefalea = formData.interrogatorioSistemas?.cardiovascularCefalea || '';
  const cardiovascularPresion = formData.interrogatorioSistemas?.cardiovascularPresion || '';
  const cardiovascularInfarto = formData.interrogatorioSistemas?.cardiovascularInfarto || '';
  const cardiovascularFatiga = formData.interrogatorioSistemas?.cardiovascularFatiga || '';

  if (cardiovascularDolor) {
    cardiovascularText += `El paciente refiere ${cardiovascularDolor} dolor en el pecho. `;
  }
  if (cardiovascularLipotimia) {
    cardiovascularText += `Indica ${cardiovascularLipotimia} lipotimia. `;
  }
  if (cardiovascularRitmo) {
    cardiovascularText += `Reporta ritmo cardíaco ${cardiovascularRitmo}. `;
  }
  if (cardiovascularVarices && cardiovascularVarices !== 'ninguno') {
    cardiovascularText += `Presenta várices. `;
  }
  if (cardiovascularCefalea && cardiovascularCefalea !== 'ninguno') {
    cardiovascularText += `Sufre de cefalea ocasional. `;
  }
  if (cardiovascularPresion) {
    cardiovascularText += `Su presión arterial es conocida como ${cardiovascularPresion}. `;
  }
  if (cardiovascularInfarto) {
    cardiovascularText += `Niega antecedentes de infarto. `;
  }
  if (cardiovascularFatiga) {
    cardiovascularText += `No presenta fatiga fácil con esfuerzo leve.`;
  }

  // Genito-Urinario
  const genitoUrinarioFrecuencia = formData.interrogatorioSistemas?.genitoUrinarioFrecuencia || '';
  const genitoUrinarioDisuria = formData.interrogatorioSistemas?.genitoUrinarioDisuria || '';
  const genitoUrinarioNicturia = formData.interrogatorioSistemas?.genitoUrinarioNicturia || '';
  const genitoUrinarioUrgencia = formData.interrogatorioSistemas?.genitoUrinarioUrgencia || '';
  const genitoUrinarioChorro = formData.interrogatorioSistemas?.genitoUrinarioChorro || '';
  const genitoUrinarioInfecciones = formData.interrogatorioSistemas?.genitoUrinarioInfecciones || '';
  const genitoUrinarioFlujo = formData.interrogatorioSistemas?.genitoUrinarioFlujo || '';
  const genitoUrinarioMenstruacion = formData.interrogatorioSistemas?.genitoUrinarioMenstruacion || '';
  const genitoUrinarioDismenorrea = formData.interrogatorioSistemas?.genitoUrinarioDismenorrea || '';
  const genitoUrinarioParto = formData.interrogatorioSistemas?.genitoUrinarioParto || '';
  const genitoUrinarioObstetricos = formData.interrogatorioSistemas?.genitoUrinarioObstetricos || '';

  if (genitoUrinarioFrecuencia) {
    genitoUrinarioText += `El paciente refiere frecuencia urinaria de ${genitoUrinarioFrecuencia}. `;
  }
  if (genitoUrinarioDisuria && genitoUrinarioDisuria !== 'ninguno') {
    genitoUrinarioText += `Presenta disuria. `;
  }
  if (genitoUrinarioNicturia && genitoUrinarioNicturia !== 'ninguno') {
    genitoUrinarioText += `Sufre de nicturia. `;
  }
  if (genitoUrinarioUrgencia && genitoUrinarioUrgencia !== 'ninguno') {
    genitoUrinarioText += `Experimenta urgencia urinaria. `;
  }
  if (genitoUrinarioChorro) {
    genitoUrinarioText += `La fuerza del chorro urinario es ${genitoUrinarioChorro}. `;
  }
  if (genitoUrinarioInfecciones && genitoUrinarioInfecciones !== 'ninguno') {
    genitoUrinarioText += `Ha tenido infecciones recurrentes. `;
  }
  if (genitoUrinarioFlujo && genitoUrinarioFlujo !== 'ninguno') {
    genitoUrinarioText += `Presenta flujo anormal. `;
  }
  if (genitoUrinarioMenstruacion) {
    genitoUrinarioText += `Última menstruación hace ${genitoUrinarioMenstruacion}. `;
  }
  if (genitoUrinarioDismenorrea) {
    genitoUrinarioText += `Refiere ${genitoUrinarioDismenorrea}. `;
  }
  if (genitoUrinarioParto) {
    genitoUrinarioText += `Fecha del último parto: ${genitoUrinarioParto}. `;
  }
  if (genitoUrinarioObstetricos) {
    genitoUrinarioText += `Antecedentes obstétricos: ${genitoUrinarioObstetricos}. `;
  }

  if (
    genitoUrinarioDisuria === 'ninguno' &&
    genitoUrinarioNicturia === 'ninguno' &&
    genitoUrinarioUrgencia === 'ninguno' &&
    genitoUrinarioInfecciones === 'ninguno' &&
    genitoUrinarioFlujo === 'ninguno'
  ) {
    genitoUrinarioText += "El paciente niega alteraciones relacionadas al aparato genito-urinario. Se exploró la frecuencia urinaria, síntomas urinarios, urgencia urinaria, fuerza del chorro, infecciones recurrentes y flujo anormal.";
  }

  // Endocrino
  const endocrinoPoliuria = formData.interrogatorioSistemas?.endocrinoPoliuria || '';
  const endocrinoPolidipsia = formData.interrogatorioSistemas?.endocrinoPolidipsia || '';
  const endocrinoPolifagia = formData.interrogatorioSistemas?.endocrinoPolifagia || '';
  const endocrinoExoftalmos = formData.interrogatorioSistemas?.endocrinoExoftalmos || '';
  const endocrinoNerviosismo = formData.interrogatorioSistemas?.endocrinoNerviosismo || '';
  const endocrinoTemblores = formData.interrogatorioSistemas?.endocrinoTemblores || '';
  const endocrinoInsomnio = formData.interrogatorioSistemas?.endocrinoInsomnio || '';
  const endocrinoPeso = formData.interrogatorioSistemas?.endocrinoPeso || '';
  const endocrinoFrioCalor = formData.interrogatorioSistemas?.endocrinoFrioCalor || '';
  const endocrinoCondicion = formData.interrogatorioSistemas?.endocrinoCondicion || '';

  if (endocrinoPoliuria && endocrinoPoliuria !== 'ninguno') {
    endocrinoText += `El paciente refiere poliuria. `;
  }
  if (endocrinoPolidipsia && endocrinoPolidipsia !== 'ninguno') {
    endocrinoText += `Indica polidipsia. `;
  }
  if (endocrinoPolifagia && endocrinoPolifagia !== 'ninguno') {
    endocrinoText += `Reporta polifagia. `;
  }
  if (endocrinoExoftalmos && endocrinoExoftalmos !== 'ninguno') {
    endocrinoText += `Presenta exoftalmos. `;
  }
  if (endocrinoNerviosismo && endocrinoNerviosismo !== 'ninguno') {
    endocrinoText += `Sufre de nerviosismo. `;
  }
  if (endocrinoTemblores && endocrinoTemblores !== 'ninguno') {
    endocrinoText += `Experimenta temblores. `;
  }
  if (endocrinoInsomnio && endocrinoInsomnio !== 'ninguno') {
    endocrinoText += `Tiene insomnio. `;
  }
  if (endocrinoPeso) {
    endocrinoText += `Refiere cambios de peso: ${endocrinoPeso}. `;
  }
  if (endocrinoFrioCalor) {
    endocrinoText += `Muestra intolerancia al frío o calor. `;
  }
  if (endocrinoCondicion) {
    endocrinoText += `Tiene diagnóstico conocido de ${endocrinoCondicion}. `;
  }

  if (
    endocrinoPoliuria === 'ninguno' &&
    endocrinoPolidipsia === 'ninguno' &&
    endocrinoPolifagia === 'ninguno' &&
    endocrinoExoftalmos === 'ninguno' &&
    endocrinoNerviosismo === 'ninguno' &&
    endocrinoTemblores === 'ninguno' &&
    endocrinoInsomnio === 'ninguno'
  ) {
    endocrinoText += "El paciente niega alteraciones relacionadas al sistema endocrino. Se indagó sobre poliuria, polidipsia, polifagia, exoftalmos, nerviosismo, temblores, insomnio, cambios de peso e intolerancia al frío o calor.";
  }

  // Tegumentario
  const tegumentarioColoracion = formData.interrogatorioSistemas?.tegumentarioColoracion || '';
  const tegumentarioErupciones = formData.interrogatorioSistemas?.tegumentarioErupciones || '';
  const tegumentarioPrurito = formData.interrogatorioSistemas?.tegumentarioPrurito || '';
  const tegumentarioHiperhidrosis = formData.interrogatorioSistemas?.tegumentarioHiperhidrosis || '';
  const tegumentarioCabello = formData.interrogatorioSistemas?.tegumentarioCabello || '';
  const tegumentarioPielSeca = formData.interrogatorioSistemas?.tegumentarioPielSeca || '';

  if (tegumentarioColoracion) {
    tegumentarioText += `El paciente refiere cambios en la coloración de la piel. `;
  }
  if (tegumentarioErupciones && tegumentarioErupciones !== 'ninguno') {
    tegumentarioText += `Presenta erupciones. `;
  }
  if (tegumentarioPrurito && tegumentarioPrurito !== 'ninguno') {
    tegumentarioText += `Sufre de prurito generalizado. `;
  }
  if (tegumentarioHiperhidrosis && tegumentarioHiperhidrosis !== 'ninguno') {
    tegumentarioText += `Experimenta hiperhidrosis. `;
  }
  if (tegumentarioCabello && tegumentarioCabello !== 'ninguno') {
    tegumentarioText += `Reporta pérdida de cabello. `;
  }
  if (tegumentarioPielSeca && tegumentarioPielSeca !== 'ninguno') {
    tegumentarioText += `Tiene piel seca. `;
  }

  if (
    tegumentarioErupciones === 'ninguno' &&
    tegumentarioPrurito === 'ninguno' &&
    tegumentarioHiperhidrosis === 'ninguno' &&
    tegumentarioCabello === 'ninguno' &&
    tegumentarioPielSeca === 'ninguno'
  ) {
    tegumentarioText += "El paciente niega alteraciones relacionadas al sistema tegumentario. Se investigó presencia de erupciones, prurito, hiperhidrosis, pérdida de cabello y piel seca.";
  }

  // Músculo-Esquelético
  const musculoEsqueleticoFracturas = formData.interrogatorioSistemas?.musculoEsqueleticoFracturas || '';
  const musculoEsqueleticoEsguinces = formData.interrogatorioSistemas?.musculoEsqueleticoEsguinces || '';
  const musculoEsqueleticoDeformidad = formData.interrogatorioSistemas?.musculoEsqueleticoDeformidad || '';
  const musculoEsqueleticoDolor = formData.interrogatorioSistemas?.musculoEsqueleticoDolor || '';
  const musculoEsqueleticoRigidez = formData.interrogatorioSistemas?.musculoEsqueleticoRigidez || '';
  const musculoEsqueleticoCalambres = formData.interrogatorioSistemas?.musculoEsqueleticoCalambres || '';
  const musculoEsqueleticoLimitaciones = formData.interrogatorioSistemas?.musculoEsqueleticoLimitaciones || '';

  if (musculoEsqueleticoFracturas) {
    musculoEsqueleticoText += `El paciente refiere haber tenido una fractura en ${musculoEsqueleticoFracturas}. `;
  }
  if (musculoEsqueleticoEsguinces) {
    musculoEsqueleticoText += `Indica haber sufrido esguinces en ${musculoEsqueleticoEsguinces}. `;
  }
  if (musculoEsqueleticoDeformidad && musculoEsqueleticoDeformidad !== 'ninguno') {
    musculoEsqueleticoText += `Presenta deformidad articular. `;
  }
  if (musculoEsqueleticoDolor && musculoEsqueleticoDolor !== 'ninguno') {
    musculoEsqueleticoText += `Sufre de dolor articular. `;
  }
  if (musculoEsqueleticoRigidez && musculoEsqueleticoRigidez !== 'ninguno') {
    musculoEsqueleticoText += `Experimenta rigidez matutina. `;
  }
  if (musculoEsqueleticoCalambres && musculoEsqueleticoCalambres !== 'ninguno') {
    musculoEsqueleticoText += `Tiene calambres musculares. `;
  }
  if (musculoEsqueleticoLimitaciones && musculoEsqueleticoLimitaciones !== 'ninguno') {
    musculoEsqueleticoText += `Presenta limitaciones de movimiento. `;
  }

  if (
    musculoEsqueleticoDeformidad === 'ninguno' &&
    musculoEsqueleticoDolor === 'ninguno' &&
    musculoEsqueleticoRigidez === 'ninguno' &&
    musculoEsqueleticoCalambres === 'ninguno' &&
    musculoEsqueleticoLimitaciones === 'ninguno'
  ) {
    musculoEsqueleticoText += "El paciente niega alteraciones relacionadas al sistema músculo-esquelético. Se interrogó sobre fracturas, esguinces, deformidad o dolor articular, rigidez matutina, calambres musculares y limitaciones de movimiento.";
  }

  // Nervioso
  const nerviosoSentidos = formData.interrogatorioSistemas?.nerviosoSentidos || '';
  const nerviosoHorasSueno = formData.interrogatorioSistemas?.nerviosoHorasSueno || '';
  const nerviosoTrastornosSueno = formData.interrogatorioSistemas?.nerviosoTrastornosSueno || '';
  const nerviosoAnimo = formData.interrogatorioSistemas?.nerviosoAnimo || '';
  const nerviosoParestesias = formData.interrogatorioSistemas?.nerviosoParestesias || '';
  const nerviosoConvulsiones = formData.interrogatorioSistemas?.nerviosoConvulsiones || '';
  const nerviosoTemblores = formData.interrogatorioSistemas?.nerviosoTemblores || '';
  const nerviosoMemoria = formData.interrogatorioSistemas?.nerviosoMemoria || '';
  const nerviosoPersonalidad = formData.interrogatorioSistemas?.nerviosoPersonalidad || '';
  const nerviosoCoordinacion = formData.interrogatorioSistemas?.nerviosoCoordinacion || '';

  if (nerviosoSentidos) {
    nerviosoText += `El paciente refiere percepción ${nerviosoSentidos} de los sentidos. `;
  }
  if (nerviosoHorasSueno) {
    nerviosoText += `Duerme ${nerviosoHorasSueno} horas diarias. `;
  }
  if (nerviosoTrastornosSueno && nerviosoTrastornosSueno !== 'ninguno') {
    nerviosoText += `Presenta trastornos del sueño. `;
  }
  if (nerviosoAnimo) {
    nerviosoText += `Reporta estado de ánimo ${nerviosoAnimo}. `;
  }
  if (nerviosoParestesias && nerviosoParestesias !== 'ninguno') {
    nerviosoText += `Refiere parestesias. `;
  }
  if (nerviosoConvulsiones && nerviosoConvulsiones !== 'ninguno') {
    nerviosoText += `Ha tenido convulsiones. `;
  }
  if (nerviosoTemblores && nerviosoTemblores !== 'ninguno') {
    nerviosoText += `Experimenta temblores. `;
  }
  if (nerviosoMemoria && nerviosoMemoria !== 'ninguno') {
    nerviosoText += `Tiene problemas de memoria. `;
  }
  if (nerviosoPersonalidad && nerviosoPersonalidad !== 'ninguno') {
    nerviosoText += `Muestra cambios en la personalidad. `;
  }
  if (nerviosoCoordinacion && nerviosoCoordinacion !== 'ninguno') {
    nerviosoText += `Presenta problemas de coordinación. `;
  }

  if (
    nerviosoTrastornosSueno === 'ninguno' &&
    nerviosoParestesias === 'ninguno' &&
    nerviosoConvulsiones === 'ninguno' &&
    nerviosoTemblores === 'ninguno' &&
    nerviosoMemoria === 'ninguno' &&
    nerviosoPersonalidad === 'ninguno' &&
    nerviosoCoordinacion === 'ninguno'
  ) {
    nerviosoText += "El paciente niega alteraciones relacionadas al sistema nervioso. Se preguntó sobre trastornos del sueño, estado de ánimo, parestesias, convulsiones, temblores, problemas de memoria, personalidad y coordinación.";
  }

  return (
    <Card data-section-name="interrogatorioSistemas">
      <CardHeader>
        <CardTitle>Interrogatorio por Aparatos y Sistemas</CardTitle>
        <CardDescription>Detalle los síntomas y condiciones por sistema.</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        <div className="grid gap-2">
          <Label htmlFor="digestivo">Aparato Digestivo</Label>
          <Textarea
            id="digestivo"
            placeholder="Redacción IA"
            value={digestivoText}
            onChange={(e) => handleInterrogatorioChange('digestivo', e.target.value)}
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="respiratorio">Aparato Respiratorio</Label>
          <Textarea
            id="respiratorio"
            placeholder="Redacción IA"
            value={respiratorioText}
            onChange={(e) => handleInterrogatorioChange('respiratorio', e.target.value)}
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="cardiovascular">Aparato Cardiovascular</Label>
          <Textarea
            id="cardiovascular"
            placeholder="Redacción IA"
            value={cardiovascularText}
            onChange={(e) => handleInterrogatorioChange('cardiovascular', e.target.value)}
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="genitoUrinario">Aparato Genito-Urinario</Label>
          <Textarea
            id="genitoUrinario"
            placeholder="Redacción IA"
            value={genitoUrinarioText}
            onChange={(e) => handleInterrogatorioChange('genitoUrinario', e.target.value)}
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="endocrino">Sistema Endocrino</Label>
          <Textarea
            id="endocrino"
            placeholder="Redacción IA"
            value={endocrinoText}
            onChange={(e) => handleInterrogatorioChange('endocrino', e.target.value)}
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="tegumentario">Sistema Tegumentario</Label>
          <Textarea
            id="tegumentario"
            placeholder="Redacción IA"
            value={tegumentarioText}
            onChange={(e) => handleInterrogatorioChange('tegumentario', e.target.value)}
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="musculoEsqueletico">Sistema Músculo-Esquelético</Label>
          <Textarea
            id="musculoEsqueletico"
            placeholder="Redacción IA"
            value={musculoEsqueleticoText}
            onChange={(e) => handleInterrogatorioChange('musculoEsqueletico', e.target.value)}
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="nervioso">Sistema Nervioso</Label>
          <Textarea
            id="nervioso"
            placeholder="Redacción IA"
            value={nerviosoText}
            onChange={(e) => handleInterrogatorioChange('nervioso', e.target.value)}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default InterrogatorioSistemas;
