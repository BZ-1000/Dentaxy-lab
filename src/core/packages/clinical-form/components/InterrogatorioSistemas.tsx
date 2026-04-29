import React, { useState, useEffect, useRef } from 'react';
import { Minus, Maximize2, X, Copy, CheckCircle, Eraser } from "lucide-react";
import { FormDataState } from '../types/historiaClinica';
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { AnimatedTextarea } from "@/components/ui/animated-textarea";
import SintomasToggle from './padecimiento/SintomasToggle';

interface InterrogatorioSistemasProps {
  formData: FormDataState;
  handleInterrogatorioChange: (system: string, value: string) => void;
}

const InterrogatorioSistemas: React.FC<InterrogatorioSistemasProps> = ({
  formData,
  handleInterrogatorioChange
}) => {
  const [isMinimized, setIsMinimized] = useState(false);
  const [isMaximized, setIsMaximized] = useState(false);
  const [showForm, setShowForm] = useState(true);
  const [redacciones, setRedacciones] = useState({
    digestivo: "",
    respiratorio: "",
    cardiovascular: "",
    genitoUrinario: "",
    endocrino: "",
    tegumentario: "",
    musculoEsqueletico: "",
    nervioso: ""
  });
  const [copied, setCopied] = useState<Record<string, boolean>>({});
  
  // Estados para los toggles de sintomatología
  const [sintomasToggle, setSintomasToggle] = useState({
    digestivo: false,
    respiratorio: false,
    cardiovascular: false,
    genitoUrinario: false,
    endocrino: false,
    tegumentario: false,
    musculoEsqueletico: false,
    nervioso: false
  });
  const formRef = useRef<HTMLDivElement>(null);
  const redaccionesRef = useRef<HTMLDivElement>(null);

  const [formValues, setFormValues] = useState({
    digestivo: {
      alimentacion: "",
      masticacion: "",
      percepcionGusto: "",
      percepcionGustoEspecificaciones: "",
      salivacion: "",
      deglusion: "",
      halitosis: "",
      halitosisEspecificaciones: "",
      sintomasDigestivos: [] as string[],
      cambiosApetito: "",
      habitosAlimenticios: "",
      colorEvacuaciones: "",
      hematemesis: "",
      frecuenciaEvacuacion: "",
      frecuenciaEvacuacionEspecificaciones: ""
    },
    respiratorio: {
      tipoRespiracion: "",
      sintomasRespiratorios: [] as string[],
      apneaSuenio: "",
      oxigenoSuplementario: "",
      tosExpectoracion: ""
    },
    cardiovascular: {
      dolorToracico: "",
      dolorToracicoDetalle: "",
      lipotimia: "",
      lipotimiaDetalle: "",
      ritmoCardiaco: "",
      ritmoCardiacoDetalle: "",
      sintomasCardiovasculares: [] as string[],
      sintomasCardiovascularesDetalle: "",
      presionArterial: "",
      antecedentesCardiovasculares: [] as string[],
      antecedentesCardiovascularesDetalle: "",
      capacidadFuncional: "",
      capacidadFuncionalDetalle: "",
      disnea: "",
      disneaDetalle: "",
      otrosAntecedentes: [] as string[],
      otrosAntecedentesDetalle: ""
    },
    genitoUrinario: {
      frecuenciaUrinaria: "",
      sintomasUrinarios: [] as string[],
      urgenciaUrinaria: "",
      chorroUrinarioDebil: "",
      chorroUrinarioIntermitente: "",
      flujoVaginalUretral: "",
      infeccionesUrinarias: "",
      ultimaMenstruacion: "",
      dismenorrea: "",
      duracionMenstruacion: "",
      ultimoParto: "",
      antecedentesObstetricos: ""
    },
    endocrino: {
      sintomasEndocrinos: [] as string[],
      sudoracionNocturna: "",
      hirsutismo: "",
      galactorrea: "",
      cambiosRitmoMenstrual: "",
      cambiosPeso: "",
      intolerancia: "",
      condicionesEndocrinas: ""
    },
    tegumentario: {
      cambiosColoracion: "",
      cambiosColoracionEspecificaciones: "",
      sintomasTegumentarios: [] as string[],
      cambiosUnas: "",
      cambiosLunares: "",
      lesionesPigmentadas: ""
    },
    musculoEsqueletico: {
      fracturas: "",
      detallesFracturas: "",
      sintomasMusculoEsqueleticos: [] as string[],
      rigidezMatutina: "",
      debilidadMuscular: "",
      limitacionesMovimiento: ""
    },
    nervioso: {
      percepcionSentidos: "",
      horasSueno: "",
      trastornosSueno: "",
      trastornosSuenoEspecificaciones: "",
      estadoAnimo: "",
      parestesias: "",
      otrosSintomasNeurologicos: [] as string[]
    }
  });

  // Cargar datos desde localStorage al inicializar
  useEffect(() => {
    // Primero intentar cargar desde formData (datos del formulario principal)
    const interrogatorioData = formData.interrogatorioSistemas;
    if (interrogatorioData && Object.keys(interrogatorioData).length > 0) {
      const savedLocalData = localStorage.getItem('interrogatorio-sistemas-formValues');
      if (savedLocalData) {
        try {
          const parsedData = JSON.parse(savedLocalData);
          setFormValues(parsedData);
          return;
        } catch (error) {
          console.error('Error parsing localStorage data:', error);
        }
      }
    }
    
    // Si no hay datos en formData, intentar cargar desde localStorage específico
    const savedData = localStorage.getItem('interrogatorio-sistemas-formValues');
    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData);
        setFormValues(parsedData);
      } catch (error) {
        console.error('Error loading saved data:', error);
      }
    }
  }, []);

  // Guardar en localStorage cada vez que cambien los formValues
  useEffect(() => {
    localStorage.setItem('interrogatorio-sistemas-formValues', JSON.stringify(formValues));
  }, [formValues]);

  // Cargar estados de toggle desde localStorage
  useEffect(() => {
    const savedToggleData = localStorage.getItem('interrogatorio-sistemas-toggles');
    if (savedToggleData) {
      try {
        const parsedData = JSON.parse(savedToggleData);
        setSintomasToggle(parsedData);
      } catch (error) {
        console.error('Error loading toggle data:', error);
      }
    }
  }, []);

  // Guardar estados de toggle en localStorage
  useEffect(() => {
    localStorage.setItem('interrogatorio-sistemas-toggles', JSON.stringify(sintomasToggle));
  }, [sintomasToggle]);

  useEffect(() => {
    if (showForm === false) {
      generateAndUpdateRedacciones();
    }
  }, [showForm, formValues]);

  const handleMinimize = () => {
    setIsMinimized(!isMinimized);
    setIsMaximized(false);
  };

  const handleMaximize = () => {
    setIsMaximized(!isMaximized);
    setIsMinimized(false);
  };

  const handleClose = () => {
    setIsMinimized(false);
    setIsMaximized(false);
  };

  const handleRadioChange = (system: string, field: string, value: string) => {
    setFormValues(prev => ({
      ...prev,
      [system]: {
        ...prev[system as keyof typeof prev],
        [field]: value
      }
    }));
  };

  const handleCheckboxChange = (system: string, field: string, value: string, checked: boolean) => {
    setFormValues(prev => {
      const currentValues = prev[system as keyof typeof prev][field] as string[];

      let updatedValues;
      if (checked) {
        updatedValues = [...currentValues, value];
      } else {
        updatedValues = currentValues.filter(item => item !== value);
      }

      // Si se selecciona "Ninguno", deseleccionar todas las demás opciones
      if (value === "Ninguno") {
        updatedValues = [value];
      } else if (updatedValues.includes("Ninguno")) {
        updatedValues = updatedValues.filter(item => item !== "Ninguno");
      }

      return {
        ...prev,
        [system]: {
          ...prev[system as keyof typeof prev],
          [field]: updatedValues
        }
      };
    });
  };

  const handleTextChange = (system: string, field: string, value: string) => {
    setFormValues(prev => ({
      ...prev,
      [system]: {
        ...prev[system as keyof typeof prev],
        [field]: value
      }
    }));
  };

  const handleTextareaChange = (section: string, field: string, value: string) => {
    setFormValues(prev => ({
      ...prev,
      [section]: {
        ...(prev as any)[section],
        [field]: value
      }
    }));
  };

  // Redacciones predeterminadas para cuando no hay sintomatología
  const redaccionesSinSintomas = {
    digestivo: "El paciente refiere llevar una alimentación combinada con adecuado consumo de alimentos blandos y fibrosos. Presenta un patrón de masticación bilateral, lo que permite un proceso adecuado de trituración de los alimentos. La percepción del gusto se mantiene íntegra, sin alteraciones referidas. La producción de saliva se percibe suficiente y constante, sin sensación de sequedad o exceso. No reporta dificultad ni dolor al deglutir. Niega halitosis. No presenta síntomas digestivos como distensión abdominal, estreñimiento, plenitud posprandial, pirosis, dolor abdominal, náusea, vómito ni reflujo. Mantiene un apetito estable, sin cambios referidos. En relación con los hábitos alimenticios, niega ingesta nocturna, picoteo frecuente o ayunos prolongados. Las evacuaciones se describen con color fisiológico, sin presencia de moco ni hematemesis. La frecuencia de evacuación es de 1 a 2 veces por día, lo que se considera dentro de parámetros funcionales.",
    respiratorio: "El paciente refiere una respiración habitual por vía nasal, sin predominio de respiración bucal ni combinada. Niega síntomas respiratorios como obstrucción nasal, rinorrea, congestión, epistaxis, disnea, tos, dolor torácico, hernias, expectoraciones o secreciones. No manifiesta cianosis. No refiere ronquido ni pausas respiratorias durante el sueño, descartando apnea del sueño. No utiliza oxígeno suplementario. Niega tos con expectoración en cualquiera de sus variantes.",
    cardiovascular: "El paciente no refiere dolor torácico ni en reposo ni en relación con el esfuerzo. No ha presentado episodios de lipotimia o síncope. Refiere no percibir irregularidades en el ritmo cardíaco, sin palpitaciones ni latidos acelerados o débiles. Niega síntomas cardiovasculares asociados como mareos, vértigo, edema en extremidades inferiores, várices, equimosis, cefalea relacionada a la presión arterial, acúfenos, fosfenos, visión borrosa o palpitaciones frecuentes. No cuenta con diagnóstico previo de hipertensión o hipotensión arterial. Niega antecedentes cardiovasculares como infarto, enfermedad coronaria, insuficiencia cardíaca o procedimientos relacionados. En cuanto a la capacidad funcional, no refiere fatiga con esfuerzos habituales. Niega disnea en cualquier circunstancia. No refiere uso de medicamentos cardiovasculares y niega antecedentes familiares relevantes.",
    genitoUrinario: "El paciente refiere una frecuencia urinaria entre 3 a 6 veces al día. Niega síntomas urinarios como incontinencia, disuria, hematuria, poliuria, nicturia o dolor lumbar. No presenta urgencia urinaria ni alteraciones en la fuerza o continuidad del chorro urinario. Niega flujo vaginal o uretral anormal, así como infecciones urinarias frecuentes. En el caso de pacientes masculinos, no aplica la sección de antecedentes menstruales u obstétricos. En caso de pacientes femeninos, refiere menstruaciones regulares, con última menstruación en fecha reciente, sin dismenorrea, con duración de 3 a 5 días. Niega antecedentes de abortos o cesáreas.",
    endocrino: "El paciente niega síntomas endocrinos como poliuria, polidipsia, polifagia, exoftalmos, nerviosismo, temblores o insomnio. No refiere sudoraciones nocturnas excesivas. En caso de paciente femenino, no presenta hirsutismo ni galactorrea. Los ciclos menstruales se describen regulares, sin retrasos ni alteraciones. No se reportan cambios significativos de peso ni intolerancia a frío o calor. Niega diagnóstico de hipotiroidismo o hipertiroidismo.",
    tegumentario: "El paciente no refiere cambios en la coloración de la piel ni presencia de erupciones, prurito, hiperhidrosis, pérdida de pelo o resequedad. No describe alteraciones en las uñas como fragilidad, quebraduras o deformidades. Niega cambios en lunares ni aparición de lesiones pigmentadas.",
    musculoEsqueletico: "El paciente no refiere antecedentes de fracturas o esguinces. No presenta síntomas musculoesqueléticos como deformidades articulares, dolor articular, calambres frecuentes ni rigidez matutina. No manifiesta debilidad muscular generalizada ni localizada. Tampoco refiere limitaciones de movimiento.",
    nervioso: "El paciente no presenta alteraciones en la percepción de los sentidos. Refiere dormir entre 7 y 8 horas por la noche, sin trastornos del sueño. El estado de ánimo se describe como tranquilo y estable. Niega parestesias. No reporta antecedentes de convulsiones, temblores, problemas de memoria, cambios de personalidad, alteraciones de la coordinación motora ni otros síntomas neurológicos."
  };

  const handleSintomasToggle = (system: string, checked: boolean) => {
    setSintomasToggle(prev => ({
      ...prev,
      [system]: checked
    }));

    // Si se activa el toggle, usar la redacción predeterminada
    if (checked) {
      const redaccionPredeterminada = redaccionesSinSintomas[system as keyof typeof redaccionesSinSintomas];
      handleInterrogatorioChange(system, redaccionPredeterminada);
      setRedacciones(prev => ({
        ...prev,
        [system]: redaccionPredeterminada
      }));
    } else {
      // Si se desactiva, limpiar la redacción para que se genere desde el formulario
      handleInterrogatorioChange(system, "");
      setRedacciones(prev => ({
        ...prev,
        [system]: ""
      }));
    }
  };

  const generateAndUpdateRedacciones = () => {
    // Verificar si hay toggles activos y usar redacciones predeterminadas
    const newRedacciones = { ...redacciones };
    
    // Para cada sistema, verificar si el toggle está activo
    Object.keys(sintomasToggle).forEach(system => {
      if (sintomasToggle[system as keyof typeof sintomasToggle]) {
        newRedacciones[system as keyof typeof newRedacciones] = redaccionesSinSintomas[system as keyof typeof redaccionesSinSintomas];
        handleInterrogatorioChange(system, redaccionesSinSintomas[system as keyof typeof redaccionesSinSintomas]);
        return; // Si el toggle está activo, usar la redacción predeterminada
      }
    });

    // Solo generar redacción desde formulario si el toggle NO está activo
    let digestivoText = "";
    if (!sintomasToggle.digestivo) {
      digestivoText = `El paciente refiere alimentación de tipo ${formValues.digestivo.alimentacion || "[sin especificar]"}. Su patrón de masticación es ${formValues.digestivo.masticacion || "[sin especificar]"}. Manifiesta ${getPercepcionGustoText()}. ${formValues.digestivo.percepcionGustoEspecificaciones ? `Especificaciones: ${formValues.digestivo.percepcionGustoEspecificaciones}` : ''} La salivación ${getSalivacionText()}. Respecto a la deglución, ${getDeglusiónText()}. ${formValues.digestivo.halitosis === "Sí" ? "Presenta halitosis" : "No presenta halitosis"}. ${formValues.digestivo.halitosis === "Sí" ? `Especificaciones: ${formValues.digestivo.halitosisEspecificaciones}` : ''}`;

      if (formValues.digestivo.sintomasDigestivos.includes("Ninguno")) {
        digestivoText += " El paciente niega alteraciones relacionadas al sistema digestivo. Se interrogó específicamente sobre distensión abdominal, estreñimiento, plenitud posprandial, pirosis, dolor abdominal, náuseas, vómito y reflujo.";
      } else {
        digestivoText += ` Ha experimentado los siguientes síntomas digestivos: ${formValues.digestivo.sintomasDigestivos.join(", ")}.`;
      }

      digestivoText += ` ${formValues.digestivo.cambiosApetito ? `Cambios en el apetito: ${formValues.digestivo.cambiosApetito}` : ''} ${formValues.digestivo.habitosAlimenticios ? `Hábitos alimenticios: ${formValues.digestivo.habitosAlimenticios}` : ''} El color de las evacuaciones es ${getColorEvacuacionesText()}. ${formValues.digestivo.hematemesis === "Sí" ? "Presenta hematemesis" : "No presenta hematemesis"}. Realiza ${formValues.digestivo.frecuenciaEvacuacion || "[sin especificar]"} evacuaciones diarias. ${formValues.digestivo.frecuenciaEvacuacion === "Otra" ? `Especificaciones: ${formValues.digestivo.frecuenciaEvacuacionEspecificaciones}` : ''}.`;
      
      newRedacciones.digestivo = digestivoText;
      handleInterrogatorioChange('digestivo', digestivoText);
    }

    let respiratorioText = "";
    if (!sintomasToggle.respiratorio) {
      respiratorioText = `El tipo de respiración habitual es ${formValues.respiratorio.tipoRespiracion || "[sin especificar]"}.`;
      if (formValues.respiratorio.sintomasRespiratorios.includes("Ninguno")) {
        respiratorioText += " El paciente niega alteraciones relacionadas al sistema respiratorio. Se interrogó específicamente sobre obstrucción nasal, rinorrea, congestión nasal, epistaxis, disnea, tos, dolor torácico, hernias, expectoraciones, secreciones y cianosis.";
      } else {
        respiratorioText += ` Presenta síntomas respiratorios como: ${formValues.respiratorio.sintomasRespiratorios.join(", ")}.`;
      }
      respiratorioText += ` ${formValues.respiratorio.apneaSuenio === "Sí" ? "Presenta apnea del sueño" : "No presenta apnea del sueño"}. ${formValues.respiratorio.oxigenoSuplementario === "Sí" ? "Usa oxígeno suplementario" : "No usa oxígeno suplementario"}. ${formValues.respiratorio.tosExpectoracion ? `Tos con expectoración: ${formValues.respiratorio.tosExpectoracion}` : ''}.`;
      
      newRedacciones.respiratorio = respiratorioText;
      handleInterrogatorioChange('respiratorio', respiratorioText);
    }

    // Nueva redacción cardiovascular siguiendo las especificaciones
    let cardiovascularText = "";
    if (!sintomasToggle.cardiovascular) {
      // Dolor torácico
      if (formValues.cardiovascular.dolorToracico === "No refiere dolor torácico") {
        cardiovascularText += "El paciente niega dolor torácico. ";
      } else if (formValues.cardiovascular.dolorToracico) {
        const variaciones = [
          `El paciente refiere dolor torácico de tipo ${formValues.cardiovascular.dolorToracico.replace('Dolor ', '').toLowerCase()}`,
          `Se documenta la presencia de dolor torácico caracterizado como ${formValues.cardiovascular.dolorToracico.replace('Dolor ', '').toLowerCase()}`
        ];
        cardiovascularText += variaciones[Math.floor(Math.random() * variaciones.length)];
        
        if (formValues.cardiovascular.dolorToracicoDetalle) {
          const conectores = ["especificando que", "señalado por el paciente con evolución de"];
          cardiovascularText += `, ${conectores[Math.floor(Math.random() * conectores.length)]} ${formValues.cardiovascular.dolorToracicoDetalle}. `;
        } else {
          cardiovascularText += ". ";
        }
      }

    // Lipotimia o síncope
    if (formValues.cardiovascular.lipotimia === "No ha presentado episodios") {
      cardiovascularText += "El paciente niega episodios de lipotimia o síncope. ";
    } else if (formValues.cardiovascular.lipotimia) {
      const variaciones = [
        `El paciente refiere ${formValues.cardiovascular.lipotimia.toLowerCase()}`,
        `Se reporta antecedente de ${formValues.cardiovascular.lipotimia.toLowerCase()}`
      ];
      cardiovascularText += variaciones[Math.floor(Math.random() * variaciones.length)];
      
      if (formValues.cardiovascular.lipotimiaDetalle) {
        const conectores = ["describiendo que", "con características mencionadas por el paciente como"];
        cardiovascularText += `, ${conectores[Math.floor(Math.random() * conectores.length)]} ${formValues.cardiovascular.lipotimiaDetalle}. `;
      } else {
        cardiovascularText += ". ";
      }
    }

    // Ritmo cardíaco percibido
    if (formValues.cardiovascular.ritmoCardiaco === "No percibe irregularidad en el ritmo cardíaco") {
      cardiovascularText += "El paciente no refiere alteraciones en la percepción del ritmo cardíaco. ";
    } else if (formValues.cardiovascular.ritmoCardiaco) {
      const variaciones = [
        `El paciente refiere sensación de ${formValues.cardiovascular.ritmoCardiaco.toLowerCase()}`,
        `Se identifica percepción subjetiva de ${formValues.cardiovascular.ritmoCardiaco.toLowerCase()}`
      ];
      cardiovascularText += variaciones[Math.floor(Math.random() * variaciones.length)];
      
      if (formValues.cardiovascular.ritmoCardiacoDetalle) {
        const conectores = ["detallando que", "manifestada con"];
        cardiovascularText += `, ${conectores[Math.floor(Math.random() * conectores.length)]} ${formValues.cardiovascular.ritmoCardiacoDetalle}. `;
      } else {
        cardiovascularText += ". ";
      }
    }

    // Síntomas cardiovasculares asociados
    if (formValues.cardiovascular.sintomasCardiovasculares.includes("Ninguno de los anteriores")) {
      cardiovascularText += "El paciente niega síntomas cardiovasculares asociados. ";
    } else if (formValues.cardiovascular.sintomasCardiovasculares.length > 0) {
      const variaciones = [
        `El paciente refiere ${formValues.cardiovascular.sintomasCardiovasculares.join(", ")}`,
        `Se documenta presencia de ${formValues.cardiovascular.sintomasCardiovasculares.join(", ")}`
      ];
      cardiovascularText += variaciones[Math.floor(Math.random() * variaciones.length)];
      
      if (formValues.cardiovascular.sintomasCardiovascularesDetalle) {
        const conectores = ["indicando que", "con evolución descrita como"];
        cardiovascularText += `, ${conectores[Math.floor(Math.random() * conectores.length)]} ${formValues.cardiovascular.sintomasCardiovascularesDetalle}. `;
      } else {
        cardiovascularText += ". ";
      }
    }

    // Presión arterial conocida
    if (formValues.cardiovascular.presionArterial === "Ha referido diagnóstico previo de hipertensión arterial") {
      cardiovascularText += "El paciente refiere antecedente de hipertensión arterial previamente diagnosticada. ";
    } else if (formValues.cardiovascular.presionArterial === "Ha referido diagnóstico previo de hipotensión arterial") {
      cardiovascularText += "El paciente refiere antecedente de hipotensión arterial diagnosticada. ";
    } else if (formValues.cardiovascular.presionArterial === "No cuenta con diagnóstico conocido de alteraciones en la presión arterial") {
      cardiovascularText += "El paciente no cuenta con diagnóstico conocido de alteraciones en la presión arterial. ";
    }

    // Antecedentes cardiovasculares
    if (formValues.cardiovascular.antecedentesCardiovasculares.includes("Niega antecedentes cardiovasculares")) {
      cardiovascularText += "El paciente niega antecedentes personales de enfermedad cardiovascular. ";
    } else if (formValues.cardiovascular.antecedentesCardiovasculares.length > 0) {
      const variaciones = [
        `El paciente presenta antecedente de ${formValues.cardiovascular.antecedentesCardiovasculares.join(", ")}`,
        `Se registra antecedente de ${formValues.cardiovascular.antecedentesCardiovasculares.join(", ")}`
      ];
      cardiovascularText += variaciones[Math.floor(Math.random() * variaciones.length)];
      
      if (formValues.cardiovascular.antecedentesCardiovascularesDetalle) {
        const conectores = ["indicando que", "descrito por el paciente como"];
        cardiovascularText += `, ${conectores[Math.floor(Math.random() * conectores.length)]} ${formValues.cardiovascular.antecedentesCardiovascularesDetalle}. `;
      } else {
        cardiovascularText += ". ";
      }
    }

    // Capacidad funcional
    if (formValues.cardiovascular.capacidadFuncional === "No refiere fatiga con la actividad cotidiana") {
      cardiovascularText += "El paciente no presenta limitaciones en su capacidad funcional. ";
    } else if (formValues.cardiovascular.capacidadFuncional) {
      const variaciones = [
        `El paciente refiere fatiga con esfuerzos ${formValues.cardiovascular.capacidadFuncional.includes("leves") ? "leves" : "moderados"}`,
        `Se reporta disminución de la capacidad funcional caracterizada por fatiga con ${formValues.cardiovascular.capacidadFuncional.includes("leves") ? "esfuerzos leves" : "esfuerzos moderados"}`
      ];
      cardiovascularText += variaciones[Math.floor(Math.random() * variaciones.length)];
      
      if (formValues.cardiovascular.capacidadFuncionalDetalle) {
        const conectores = ["manifestando que", "detallada como"];
        cardiovascularText += `, ${conectores[Math.floor(Math.random() * conectores.length)]} ${formValues.cardiovascular.capacidadFuncionalDetalle}. `;
      } else {
        cardiovascularText += ". ";
      }
    }

    // Disnea
    if (formValues.cardiovascular.disnea === "No refiere dificultad respiratoria") {
      cardiovascularText += "El paciente niega dificultad respiratoria. ";
    } else if (formValues.cardiovascular.disnea) {
      const variaciones = [
        `El paciente refiere disnea de tipo ${formValues.cardiovascular.disnea.replace("Disnea ", "").toLowerCase()}`,
        `Se identifica dificultad respiratoria descrita como ${formValues.cardiovascular.disnea.replace("Disnea ", "").toLowerCase()}`
      ];
      cardiovascularText += variaciones[Math.floor(Math.random() * variaciones.length)];
      
      if (formValues.cardiovascular.disneaDetalle) {
        const conectores = ["señalando que", "con características clínicas de"];
        cardiovascularText += `, ${conectores[Math.floor(Math.random() * conectores.length)]} ${formValues.cardiovascular.disneaDetalle}. `;
      } else {
        cardiovascularText += ". ";
      }
    }

    // Otros antecedentes relevantes
    if (formValues.cardiovascular.otrosAntecedentes.includes("Niega antecedentes familiares relevantes")) {
      cardiovascularText += "El paciente niega antecedentes familiares relevantes ni uso actual de fármacos cardiovasculares. ";
    } else if (formValues.cardiovascular.otrosAntecedentes.length > 0) {
      const variaciones = [
        `El paciente refiere ${formValues.cardiovascular.otrosAntecedentes.join(", ")}`,
        `Se documenta antecedente de ${formValues.cardiovascular.otrosAntecedentes.join(", ")}`
      ];
      cardiovascularText += variaciones[Math.floor(Math.random() * variaciones.length)];
      
      if (formValues.cardiovascular.otrosAntecedentesDetalle) {
        const conectores = ["especificando que", "detallado por el paciente como"];
        cardiovascularText += `, ${conectores[Math.floor(Math.random() * conectores.length)]} ${formValues.cardiovascular.otrosAntecedentesDetalle}. `;
      } else {
        cardiovascularText += ". ";
      }
    }
      
      newRedacciones.cardiovascular = cardiovascularText;
      handleInterrogatorioChange('cardiovascular', cardiovascularText);
    }

    let genitoUrinarioText = "";
    if (!sintomasToggle.genitoUrinario) {
      genitoUrinarioText = `El paciente refiere una frecuencia urinaria de ${formValues.genitoUrinario.frecuenciaUrinaria || "[sin especificar]"} veces al día.`;
      if (formValues.genitoUrinario.sintomasUrinarios.includes("Ninguno")) {
        genitoUrinarioText += " El paciente niega alteraciones relacionadas al aparato genito-urinario. Se exploró la frecuencia urinaria, síntomas urinarios, urgencia urinaria, fuerza del chorro, infecciones recurrentes y flujo anormal.";
      } else {
        genitoUrinarioText += ` Síntomas urinarios presentes: ${formValues.genitoUrinario.sintomasUrinarios.join(", ")}.`;
      }
      genitoUrinarioText += ` ${formValues.genitoUrinario.urgenciaUrinaria === "Sí" ? "Presenta urgencia urinaria" : "No presenta urgencia urinaria"}. ${formValues.genitoUrinario.chorroUrinarioDebil === "Sí" ? "Presenta chorro urinario débil" : "No presenta chorro urinario débil"}. ${formValues.genitoUrinario.chorroUrinarioIntermitente === "Sí" ? "Presenta chorro urinario intermitente" : "No presenta chorro urinario intermitente"}. ${formValues.genitoUrinario.flujoVaginalUretral === "Sí" ? "Presenta flujo vaginal/uretral anormal" : "No presenta flujo vaginal/uretral anormal"}. ${formValues.genitoUrinario.infeccionesUrinarias === "Sí" ? "Presenta infecciones urinarias frecuentes" : "No presenta infecciones urinarias frecuentes"}. ${formValues.genitoUrinario.ultimaMenstruacion ? `En pacientes mujeres: Fecha de última menstruación: ${formValues.genitoUrinario.ultimaMenstruacion}.` : ""} ${formValues.genitoUrinario.dismenorrea ? `Dismenorrea: ${formValues.genitoUrinario.dismenorrea}` : ''} ${formValues.genitoUrinario.duracionMenstruacion ? `Días de duración de menstruación: ${formValues.genitoUrinario.duracionMenstruacion}` : ''} ${formValues.genitoUrinario.ultimoParto ? `Fecha de último parto: ${formValues.genitoUrinario.ultimoParto}` : ''} Antecedentes obstétricos: ${formValues.genitoUrinario.antecedentesObstetricos || "ninguno"}.`;
      
      newRedacciones.genitoUrinario = genitoUrinarioText;
      handleInterrogatorioChange('genitoUrinario', genitoUrinarioText);
    }

    let endocrinoText = "";
    if (!sintomasToggle.endocrino) {
      endocrinoText = `El paciente refiere los siguientes síntomas endocrinos: ${formValues.endocrino.sintomasEndocrinos.join(", ")}.`;
      if (formValues.endocrino.sintomasEndocrinos.includes("Ninguno")) {
        endocrinoText += " El paciente niega alteraciones relacionadas al sistema endocrino. Se indagó sobre poliuria, polidipsia, polifagia, exoftalmos, nerviosismo, temblores, insomnio, cambios de peso e intolerancia al frío o calor.";
      }
      endocrinoText += ` ${formValues.endocrino.sudoracionNocturna === "Sí" ? "Presenta sudoración excesiva nocturna" : "No presenta sudoración excesiva nocturna"}. ${formValues.endocrino.hirsutismo === "Sí" ? "Presenta hirsutismo" : "No presenta hirsutismo"}. ${formValues.endocrino.galactorrea === "Sí" ? "Presenta galactorrea" : "No presenta galactorrea"}. ${formValues.endocrino.cambiosRitmoMenstrual ? `Cambios en el ritmo menstrual: ${formValues.endocrino.cambiosRitmoMenstrual}` : ''} Reporta ${getCambiosPesoText()}. ${getIntoleranciaText()}. Antecedentes patológicos conocidos: ${formValues.endocrino.condicionesEndocrinas || "ninguno"}.`;
      
      newRedacciones.endocrino = endocrinoText;
      handleInterrogatorioChange('endocrino', endocrinoText);
    }

    let tegumentarioText = "";
    if (!sintomasToggle.tegumentario) {
      tegumentarioText = `${formValues.tegumentario.cambiosColoracion === "Sí" ? "Ha notado cambios en la coloración de la piel" : "No ha notado cambios en la coloración de la piel"}. ${formValues.tegumentario.cambiosColoracion === "Sí" ? `Especificaciones: ${formValues.tegumentario.cambiosColoracionEspecificaciones}` : ''}`;
      if (formValues.tegumentario.sintomasTegumentarios.includes("Ninguno")) {
        tegumentarioText += " El paciente niega alteraciones relacionadas al sistema tegumentario. Se investigó presencia de erupciones, prurito, hiperhidrosis, pérdida de cabello y piel seca.";
      } else {
        tegumentarioText += ` Otros síntomas presentes: ${formValues.tegumentario.sintomasTegumentarios.join(", ")}.`;
      }
      tegumentarioText += ` ${formValues.tegumentario.cambiosUnas ? `Cambios en uñas: ${formValues.tegumentario.cambiosUnas}` : ''} ${formValues.tegumentario.cambiosLunares === "Sí" ? "Presenta cambios en lunares" : "No presenta cambios en lunares"}. ${formValues.tegumentario.lesionesPigmentadas === "Sí" ? "Presenta lesiones pigmentadas" : "No presenta lesiones pigmentadas"}.`;
      
      newRedacciones.tegumentario = tegumentarioText;
      handleInterrogatorioChange('tegumentario', tegumentarioText);
    }

    let musculoEsqueleticoText = "";
    if (!sintomasToggle.musculoEsqueletico) {
      musculoEsqueleticoText = `${formValues.musculoEsqueletico.fracturas === "No" ? "No ha presentado" : "Ha presentado"} fracturas o esguinces. ${formValues.musculoEsqueletico.fracturas === "Sí" ? `En caso afirmativo, se registran: ${formValues.musculoEsqueletico.detallesFracturas || "[sin especificar]"}.` : ""}`;
      if (formValues.musculoEsqueletico.sintomasMusculoEsqueleticos.includes("Ninguno")) {
        musculoEsqueleticoText += " El paciente niega alteraciones relacionadas al sistema músculo-esquelético. Se interrogó sobre fracturas, esguinces, deformidad o dolor articular, rigidez matutina, calambres musculares y limitaciones de movimiento.";
      } else {
        musculoEsqueleticoText += ` Sintomatología musculoesquelética actual: ${formValues.musculoEsqueletico.sintomasMusculoEsqueleticos.join(", ")}.`;
      }
      musculoEsqueleticoText += ` ${formValues.musculoEsqueletico.rigidezMatutina ? `Rigidez matutina: ${formValues.musculoEsqueletico.rigidezMatutina}` : ''} ${formValues.musculoEsqueletico.debilidadMuscular ? `Debilidad muscular: ${formValues.musculoEsqueletico.debilidadMuscular}` : ''} ${formValues.musculoEsqueletico.limitacionesMovimiento ? `Limitaciones de movimiento: ${formValues.musculoEsqueletico.limitacionesMovimiento}` : ''}.`;
      
      newRedacciones.musculoEsqueletico = musculoEsqueleticoText;
      handleInterrogatorioChange('musculoEsqueletico', musculoEsqueleticoText);
    }

    let nerviosoText = "";
    if (!sintomasToggle.nervioso) {
      nerviosoText = `${formValues.nervioso.percepcionSentidos === "Sí" ? "Percibe" : "No percibe"} adecuadamente a través de los órganos de los sentidos. El patrón de sueño habitual es de ${formValues.nervioso.horasSueno || "[sin especificar]"} horas por noche. ${formValues.nervioso.trastornosSueno === "Sí" ? "Presenta trastornos del sueño" : "No presenta trastornos del sueño"}. ${formValues.nervioso.trastornosSueno === "Sí" ? `Especificaciones: ${formValues.nervioso.trastornosSuenoEspecificaciones}` : ''} Su carácter habitual se describe como ${formValues.nervioso.estadoAnimo || "[sin especificar]"}. ${formValues.nervioso.parestesias === "Sí" ? "Presenta" : "No presenta"} parestesias (hormigueos, adormecimiento o pérdida de sensibilidad).`;
      if (formValues.nervioso.otrosSintomasNeurologicos.includes("Ninguno")) {
        nerviosoText += " El paciente niega alteraciones relacionadas al sistema nervioso. Se preguntó sobre trastornos del sueño, estado de ánimo, parestesias, convulsiones, temblores, problemas de memoria, personalidad y coordinación.";
      } else {
        nerviosoText += ` Otros síntomas neurológicos: ${formValues.nervioso.otrosSintomasNeurologicos.join(", ")}.`;
      }
      
      newRedacciones.nervioso = nerviosoText;
      handleInterrogatorioChange('nervioso', nerviosoText);
    }

    setRedacciones(newRedacciones);

    // Cambiar al apartado de redacción IA y hacer auto scroll
    setShowForm(false);
    setTimeout(() => {
      redaccionesRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const getPercepcionGustoText = () => {
    switch (formValues.digestivo.percepcionGusto) {
      case "Normal":
        return "no percibir alteraciones del gusto";
      case "Disminucion":
        return "hipogeusia";
      case "Alterados":
        return "disgeusia (sabores metálicos, amargos, etc.)";
      default:
        return "[sin especificar]";
    }
  };

  const getSalivacionText = () => {
    switch (formValues.digestivo.salivacion) {
      case "Normal":
        return "se encuentra presente en cantidad y consistencia adecuadas";
      case "Aumentada":
        return "aumentada";
      case "Disminuida":
        return "disminuida";
      default:
        return "[sin especificar]";
    }
  };

  const getDeglusiónText = () => {
    switch (formValues.digestivo.deglusion) {
      case "No":
        return "no refiere dificultad";
      case "Dificultad":
        return "presenta dificultad sin dolor";
      case "Dolor":
        return "presenta odinofagia";
      default:
        return "[sin especificar]";
    }
  };

  const getColorEvacuacionesText = () => {
    switch (formValues.digestivo.colorEvacuaciones) {
      case "Normal":
        return "marron y bien formado";
      case "Oscuras":
        return "oscuras";
      case "Claras":
        return "claras";
      case "Presencia de moco":
        return "con presencia de moco";
      default:
        return "[sin especificar]";
    }
  };

  const getCambiosPesoText = () => {
    switch (formValues.endocrino.cambiosPeso) {
      case "Perdida":
        return "pérdida de peso sin causa aparente";
      case "Aumento":
        return "aumento de peso sin causa aparente";
      case "No":
        return "sin cambios de peso";
      default:
        return "[sin especificar]";
    }
  };

  const getIntoleranciaText = () => {
    if (formValues.endocrino.intolerancia === "No") {
      return "No presenta intolerancia al frío o calor";
    } else if (formValues.endocrino.intolerancia) {
      return `Presenta intolerancia al ${formValues.endocrino.intolerancia.toLowerCase()}`;
    } else {
      return "[sin especificar]";
    }
  };

  const handleCopy = async (section: string) => {
    // Track copy click
    try {
      const { trackCopyClick } = await import('@/utils/trackCopyClick');
      trackCopyClick();
    } catch (error) {
      console.error('Error tracking copy:', error);
    }
    navigator.clipboard.writeText(redacciones[section]);
    setCopied(prev => ({
      ...prev,
      [section]: true
    }));
    setTimeout(() => setCopied(prev => ({
      ...prev,
      [section]: false
    })), 2000);
  };

  return (
    <div className={`max-w-4xl mx-auto transition-all duration-300 ${isMaximized ? "fixed inset-4 z-50" : ""}`} data-formulario-section="interrogatorio-sistemas">
      <div className="w-full bg-transparent">
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex justify-center w-full">
            

          <div className="flex items-center gap-2">
            
            
            
          </div>
        </div>{/* cierra flex justify-center */}
        </div>

        <div ref={redaccionesRef} className="flex justify-start px-6 py-2">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <span className="text-gray-400">IX.</span> INTERROGATORIO POR APARATOS Y SISTEMAS
          </h2>
        </div>

        {!isMinimized && (
          <div className="p-6" ref={formRef}>
            {showForm ? (
              <div className="space-y-6">
                {/* APARATO DIGESTIVO */}
                <div className="bg-transparent/50 dark:bg-gray-900/50 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-lg font-semibold text-justify">Aparato Digestivo</h4>
                    <SintomasToggle 
                      checked={sintomasToggle.digestivo}
                      onChange={(checked) => handleSintomasToggle('digestivo', checked)}
                    />
                  </div>
                  {!sintomasToggle.digestivo && (
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Tipo de Alimentación</Label>
                      <div className="flex flex-wrap mt-1">
                        <WordButton label="Blanda" isSelected={formValues.digestivo.alimentacion === "Blanda"} onClick={() => handleRadioChange("digestivo", "alimentacion", "Blanda")} />
                        <WordButton label="Fibrosa" isSelected={formValues.digestivo.alimentacion === "Fibrosa"} onClick={() => handleRadioChange("digestivo", "alimentacion", "Fibrosa")} />
                        <WordButton label="Combinada" isSelected={formValues.digestivo.alimentacion === "Combinada"} onClick={() => handleRadioChange("digestivo", "alimentacion", "Combinada")} />
                      </div>
                    </div>
                    <div>
                      <Label>Patrón de Masticación</Label>
                      <div className="flex flex-wrap mt-1">
                        <WordButton label="Unilateral" isSelected={formValues.digestivo.masticacion === "Unilateral"} onClick={() => handleRadioChange("digestivo", "masticacion", "Unilateral")} />
                        <WordButton label="Bilateral" isSelected={formValues.digestivo.masticacion === "Bilateral"} onClick={() => handleRadioChange("digestivo", "masticacion", "Bilateral")} />
                        <WordButton label="Anterior" isSelected={formValues.digestivo.masticacion === "Anterior"} onClick={() => handleRadioChange("digestivo", "masticacion", "Anterior")} />
                      </div>
                    </div>
                    <div>
                      <Label>Percepción del Gusto</Label>
                      <div className="flex flex-wrap mt-1">
                        <WordButton label="Normal" isSelected={formValues.digestivo.percepcionGusto === "Normal"} onClick={() => handleRadioChange("digestivo", "percepcionGusto", "Normal")} />
                        <WordButton label="Disminución" isSelected={formValues.digestivo.percepcionGusto === "Disminucion"} onClick={() => handleRadioChange("digestivo", "percepcionGusto", "Disminucion")} />
                        <WordButton label="Alterados" isSelected={formValues.digestivo.percepcionGusto === "Alterados"} onClick={() => handleRadioChange("digestivo", "percepcionGusto", "Alterados")} />
                      </div>
                      {formValues.digestivo.percepcionGusto === "Alterados" && (
                        <Textarea
                          placeholder="Escriba especificaciones relacionadas..."
                          value={formValues.digestivo.percepcionGustoEspecificaciones}
                          onChange={(e) => handleTextChange("digestivo", "percepcionGustoEspecificaciones", e.target.value)}
                          className="w-full p-2 border rounded-md mt-2"
                        />
                      )}
                    </div>
                    <div>
                      <Label>Salivación</Label>
                      <div className="flex flex-wrap mt-1">
                        <WordButton label="Normal" isSelected={formValues.digestivo.salivacion === "Normal"} onClick={() => handleRadioChange("digestivo", "salivacion", "Normal")} />
                        <WordButton label="Aumentada" isSelected={formValues.digestivo.salivacion === "Aumentada"} onClick={() => handleRadioChange("digestivo", "salivacion", "Aumentada")} />
                        <WordButton label="Disminuida" isSelected={formValues.digestivo.salivacion === "Disminuida"} onClick={() => handleRadioChange("digestivo", "salivacion", "Disminuida")} />
                      </div>
                    </div>
                    <div>
                      <Label>Dificultad o Dolor al Tragar</Label>
                      <div className="flex flex-wrap mt-1">
                        <WordButton label="No" isSelected={formValues.digestivo.deglusion === "No"} onClick={() => handleRadioChange("digestivo", "deglusion", "No")} />
                        <WordButton label="Dificultad" isSelected={formValues.digestivo.deglusion === "Dificultad"} onClick={() => handleRadioChange("digestivo", "deglusion", "Dificultad")} />
                        <WordButton label="Dolor" isSelected={formValues.digestivo.deglusion === "Dolor"} onClick={() => handleRadioChange("digestivo", "deglusion", "Dolor")} />
                      </div>
                    </div>
                    <div>
                      <Label>Halitosis (mal aliento)</Label>
                      <div className="flex flex-wrap mt-1">
                        <WordButton label="Sí" isSelected={formValues.digestivo.halitosis === "Sí"} onClick={() => handleRadioChange("digestivo", "halitosis", "Sí")} />
                        <WordButton label="No" isSelected={formValues.digestivo.halitosis === "No"} onClick={() => handleRadioChange("digestivo", "halitosis", "No")} />
                      </div>
                      {formValues.digestivo.halitosis === "Sí" && (
                        <div className="flex flex-wrap mt-1">
                          <WordButton label="Solo por las mañanas" isSelected={formValues.digestivo.halitosisEspecificaciones === "Solo por las mañanas"} onClick={() => handleRadioChange("digestivo", "halitosisEspecificaciones", "Solo por las mañanas")} />
                          <WordButton label="Todo el tiempo" isSelected={formValues.digestivo.halitosisEspecificaciones === "Todo el tiempo"} onClick={() => handleRadioChange("digestivo", "halitosisEspecificaciones", "Todo el tiempo")} />
                        </div>
                      )}
                    </div>
                    <div>
                      <Label>Síntomas Digestivos</Label>
                      <div className="flex flex-wrap mt-1">
                        <WordButton label="Distensión Abdominal" isSelected={formValues.digestivo.sintomasDigestivos.includes("Distensión abdominal")} onClick={() => handleCheckboxChange("digestivo", "sintomasDigestivos", "Distensión abdominal", !formValues.digestivo.sintomasDigestivos.includes("Distensión abdominal"))} />
                        <WordButton label="Estreñimiento" isSelected={formValues.digestivo.sintomasDigestivos.includes("Estreñimiento")} onClick={() => handleCheckboxChange("digestivo", "sintomasDigestivos", "Estreñimiento", !formValues.digestivo.sintomasDigestivos.includes("Estreñimiento"))} />
                        <WordButton label="Plenitud Posprandial" isSelected={formValues.digestivo.sintomasDigestivos.includes("Sensación de llenura después de comer")} onClick={() => handleCheckboxChange("digestivo", "sintomasDigestivos", "Sensación de llenura después de comer", !formValues.digestivo.sintomasDigestivos.includes("Sensación de llenura después de comer"))} />
                        <WordButton label="Pirosis" isSelected={formValues.digestivo.sintomasDigestivos.includes("Acidez (pirosis)")} onClick={() => handleCheckboxChange("digestivo", "sintomasDigestivos", "Acidez (pirosis)", !formValues.digestivo.sintomasDigestivos.includes("Acidez (pirosis)"))} />
                        <WordButton label="Dolor Abdominal" isSelected={formValues.digestivo.sintomasDigestivos.includes("Dolor abdominal")} onClick={() => handleCheckboxChange("digestivo", "sintomasDigestivos", "Dolor abdominal", !formValues.digestivo.sintomasDigestivos.includes("Dolor abdominal"))} />
                        <WordButton label="Náusea" isSelected={formValues.digestivo.sintomasDigestivos.includes("Náuseas")} onClick={() => handleCheckboxChange("digestivo", "sintomasDigestivos", "Náuseas", !formValues.digestivo.sintomasDigestivos.includes("Náuseas"))} />
                        <WordButton label="Vómito" isSelected={formValues.digestivo.sintomasDigestivos.includes("Vómitos")} onClick={() => handleCheckboxChange("digestivo", "sintomasDigestivos", "Vómitos", !formValues.digestivo.sintomasDigestivos.includes("Vómitos"))} />
                        <WordButton label="Reflujo" isSelected={formValues.digestivo.sintomasDigestivos.includes("Reflujo")} onClick={() => handleCheckboxChange("digestivo", "sintomasDigestivos", "Reflujo", !formValues.digestivo.sintomasDigestivos.includes("Reflujo"))} />
                        <WordButton label="Ninguno" isSelected={formValues.digestivo.sintomasDigestivos.includes("Ninguno")} onClick={() => handleCheckboxChange("digestivo", "sintomasDigestivos", "Ninguno", !formValues.digestivo.sintomasDigestivos.includes("Ninguno"))} />
                      </div>
                    </div>
                    <div>
                      <Label>Cambios en el apetito</Label>
                      <div className="flex flex-wrap mt-1">
                        <WordButton label="Aumentado" isSelected={formValues.digestivo.cambiosApetito === "Aumentado"} onClick={() => handleRadioChange("digestivo", "cambiosApetito", "Aumentado")} />
                        <WordButton label="Disminuido" isSelected={formValues.digestivo.cambiosApetito === "Disminuido"} onClick={() => handleRadioChange("digestivo", "cambiosApetito", "Disminuido")} />
                        <WordButton label="Sin cambios" isSelected={formValues.digestivo.cambiosApetito === "Sin cambios"} onClick={() => handleRadioChange("digestivo", "cambiosApetito", "Sin cambios")} />
                      </div>
                    </div>
                    <div>
                      <Label>Hábitos alimenticios</Label>
                      <div className="flex flex-wrap mt-1">
                        <WordButton label="Ingesta nocturna" isSelected={formValues.digestivo.habitosAlimenticios === "Ingesta nocturna"} onClick={() => handleRadioChange("digestivo", "habitosAlimenticios", "Ingesta nocturna")} />
                        <WordButton label="Picoteo frecuente" isSelected={formValues.digestivo.habitosAlimenticios === "Picoteo frecuente"} onClick={() => handleRadioChange("digestivo", "habitosAlimenticios", "Picoteo frecuente")} />
                        <WordButton label="Ayuno prolongado" isSelected={formValues.digestivo.habitosAlimenticios === "Ayuno prolongado"} onClick={() => handleRadioChange("digestivo", "habitosAlimenticios", "Ayuno prolongado")} />
                        <WordButton label="Ninguno" isSelected={formValues.digestivo.habitosAlimenticios === "Ninguno"} onClick={() => handleRadioChange("digestivo", "habitosAlimenticios", "Ninguno")} />
                      </div>
                    </div>
                    <div>
                      <Label>Color de las evacuaciones</Label>
                      <div className="flex flex-wrap mt-1">
                        <WordButton label="Normal" isSelected={formValues.digestivo.colorEvacuaciones === "Normal"} onClick={() => handleRadioChange("digestivo", "colorEvacuaciones", "Normal")} />
                        <WordButton label="Oscuras" isSelected={formValues.digestivo.colorEvacuaciones === "Oscuras"} onClick={() => handleRadioChange("digestivo", "colorEvacuaciones", "Oscuras")} />
                        <WordButton label="Claras" isSelected={formValues.digestivo.colorEvacuaciones === "Claras"} onClick={() => handleRadioChange("digestivo", "colorEvacuaciones", "Claras")} />
                        <WordButton label="Presencia de moco" isSelected={formValues.digestivo.colorEvacuaciones === "Presencia de moco"} onClick={() => handleRadioChange("digestivo", "colorEvacuaciones", "Presencia de moco")} />
                      </div>
                    </div>
                    <div>
                      <Label>Hematemesis (vómito con sangre)</Label>
                      <div className="flex flex-wrap mt-1">
                        <WordButton label="Sí" isSelected={formValues.digestivo.hematemesis === "Sí"} onClick={() => handleRadioChange("digestivo", "hematemesis", "Sí")} />
                        <WordButton label="No" isSelected={formValues.digestivo.hematemesis === "No"} onClick={() => handleRadioChange("digestivo", "hematemesis", "No")} />
                      </div>
                    </div>
                    <div>
                      <Label>Frecuencia de Evacuación</Label>
                      <div className="flex flex-wrap mt-1">
                        <WordButton label="Menos de 1 vez al día" isSelected={formValues.digestivo.frecuenciaEvacuacion === "Menos de una vez al día"} onClick={() => handleRadioChange("digestivo", "frecuenciaEvacuacion", "Menos de una vez al día")} />
                        <WordButton label="1 a 2 veces" isSelected={formValues.digestivo.frecuenciaEvacuacion === "1 a 2 veces"} onClick={() => handleRadioChange("digestivo", "frecuenciaEvacuacion", "1 a 2 veces")} />
                        <WordButton label="Más de 2 veces" isSelected={formValues.digestivo.frecuenciaEvacuacion === "Más de 2 veces"} onClick={() => handleRadioChange("digestivo", "frecuenciaEvacuacion", "Más de 2 veces")} />
                        <WordButton label="Otra" isSelected={formValues.digestivo.frecuenciaEvacuacion === "Otra"} onClick={() => handleRadioChange("digestivo", "frecuenciaEvacuacion", "Otra")} />
                      </div>
                      {formValues.digestivo.frecuenciaEvacuacion === "Otra" && (
                        <Textarea
                          placeholder="Escriba especificaciones relacionadas..."
                          value={formValues.digestivo.frecuenciaEvacuacionEspecificaciones}
                          onChange={(e) => handleTextChange("digestivo", "frecuenciaEvacuacionEspecificaciones", e.target.value)}
                          className="w-full p-2 border rounded-md mt-2"
                        />
                      )}
                     </div>
                   </div>
                  )}
                </div>

                {/* APARATO RESPIRATORIO */}
                <div className="bg-transparent/50 dark:bg-gray-900/50 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-lg font-semibold text-justify">Aparato Respiratorio</h4>
                    <SintomasToggle 
                      checked={sintomasToggle.respiratorio}
                      onChange={(checked) => handleSintomasToggle('respiratorio', checked)}
                    />
                  </div>
                  {!sintomasToggle.respiratorio && (
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Tipo de Respiración</Label>
                      <div className="flex flex-wrap mt-1">
                        <WordButton label="Nasal" isSelected={formValues.respiratorio.tipoRespiracion === "Nasal"} onClick={() => handleRadioChange("respiratorio", "tipoRespiracion", "Nasal")} />
                        <WordButton label="Bucal" isSelected={formValues.respiratorio.tipoRespiracion === "Bucal"} onClick={() => handleRadioChange("respiratorio", "tipoRespiracion", "Bucal")} />
                        <WordButton label="Combinada" isSelected={formValues.respiratorio.tipoRespiracion === "Combinada"} onClick={() => handleRadioChange("respiratorio", "tipoRespiracion", "Combinada")} />
                      </div>
                    </div>
                    <div>
                      <Label>Síntomas Respiratorios</Label>
                      <div className="flex flex-wrap mt-1">
                        <WordButton label="Obstrucción Nasal" isSelected={formValues.respiratorio.sintomasRespiratorios.includes("Obstrucción nasal")} onClick={() => handleCheckboxChange("respiratorio", "sintomasRespiratorios", "Obstrucción nasal", !formValues.respiratorio.sintomasRespiratorios.includes("Obstrucción nasal"))} />
                        <WordButton label="Rinorrea" isSelected={formValues.respiratorio.sintomasRespiratorios.includes("Secreción nasal (rinorrea)")} onClick={() => handleCheckboxChange("respiratorio", "sintomasRespiratorios", "Secreción nasal (rinorrea)", !formValues.respiratorio.sintomasRespiratorios.includes("Secreción nasal (rinorrea)"))} />
                        <WordButton label="Congestión Nasal" isSelected={formValues.respiratorio.sintomasRespiratorios.includes("Congestión nasal")} onClick={() => handleCheckboxChange("respiratorio", "sintomasRespiratorios", "Congestión nasal", !formValues.respiratorio.sintomasRespiratorios.includes("Congestión nasal"))} />
                        <WordButton label="Epistaxis" isSelected={formValues.respiratorio.sintomasRespiratorios.includes("Sangrado nasal (epistaxis)")} onClick={() => handleCheckboxChange("respiratorio", "sintomasRespiratorios", "Sangrado nasal (epistaxis)", !formValues.respiratorio.sintomasRespiratorios.includes("Sangrado nasal (epistaxis)"))} />
                        <WordButton label="Disnea" isSelected={formValues.respiratorio.sintomasRespiratorios.includes("Dificultad para respirar (disnea)")} onClick={() => handleCheckboxChange("respiratorio", "sintomasRespiratorios", "Dificultad para respirar (disnea)", !formValues.respiratorio.sintomasRespiratorios.includes("Dificultad para respirar (disnea)"))} />
                        <WordButton label="Tos" isSelected={formValues.respiratorio.sintomasRespiratorios.includes("Tos")} onClick={() => handleCheckboxChange("respiratorio", "sintomasRespiratorios", "Tos", !formValues.respiratorio.sintomasRespiratorios.includes("Tos"))} />
                        <WordButton label="Dolor Torácico" isSelected={formValues.respiratorio.sintomasRespiratorios.includes("Dolor en el pecho")} onClick={() => handleCheckboxChange("respiratorio", "sintomasRespiratorios", "Dolor en el pecho", !formValues.respiratorio.sintomasRespiratorios.includes("Dolor en el pecho"))} />
                        <WordButton label="Hernias" isSelected={formValues.respiratorio.sintomasRespiratorios.includes("Hernias")} onClick={() => handleCheckboxChange("respiratorio", "sintomasRespiratorios", "Hernias", !formValues.respiratorio.sintomasRespiratorios.includes("Hernias"))} />
                        <WordButton label="Expectoraciones" isSelected={formValues.respiratorio.sintomasRespiratorios.includes("Flemas (expectoración)")} onClick={() => handleCheckboxChange("respiratorio", "sintomasRespiratorios", "Flemas (expectoración)", !formValues.respiratorio.sintomasRespiratorios.includes("Flemas (expectoración)"))} />
                        <WordButton label="Secreciones" isSelected={formValues.respiratorio.sintomasRespiratorios.includes("Mucosidad")} onClick={() => handleCheckboxChange("respiratorio", "sintomasRespiratorios", "Mucosidad", !formValues.respiratorio.sintomasRespiratorios.includes("Mucosidad"))} />
                        <WordButton label="Cianosis" isSelected={formValues.respiratorio.sintomasRespiratorios.includes("Coloración azulada en labios o piel (cianosis)")} onClick={() => handleCheckboxChange("respiratorio", "sintomasRespiratorios", "Coloración azulada en labios o piel (cianosis)", !formValues.respiratorio.sintomasRespiratorios.includes("Coloración azulada en labios o piel (cianosis)"))} />
                        <WordButton label="Ninguno" isSelected={formValues.respiratorio.sintomasRespiratorios.includes("Ninguno")} onClick={() => handleCheckboxChange("respiratorio", "sintomasRespiratorios", "Ninguno", !formValues.respiratorio.sintomasRespiratorios.includes("Ninguno"))} />
                      </div>
                    </div>
                    <div>
                      <Label>Apnea del sueño (ronquido o pausas al dormir)</Label>
                      <div className="flex flex-wrap mt-1">
                        <WordButton label="Sí" isSelected={formValues.respiratorio.apneaSuenio === "Sí"} onClick={() => handleRadioChange("respiratorio", "apneaSuenio", "Sí")} />
                        <WordButton label="No" isSelected={formValues.respiratorio.apneaSuenio === "No"} onClick={() => handleRadioChange("respiratorio", "apneaSuenio", "No")} />
                      </div>
                    </div>
                    <div>
                      <Label>Uso de oxígeno suplementario</Label>
                      <div className="flex flex-wrap mt-1">
                        <WordButton label="Sí" isSelected={formValues.respiratorio.oxigenoSuplementario === "Sí"} onClick={() => handleRadioChange("respiratorio", "oxigenoSuplementario", "Sí")} />
                        <WordButton label="No" isSelected={formValues.respiratorio.oxigenoSuplementario === "No"} onClick={() => handleRadioChange("respiratorio", "oxigenoSuplementario", "No")} />
                      </div>
                    </div>
                    <div>
                      <Label>Tos con expectoración</Label>
                      <div className="flex flex-wrap mt-1">
                        <WordButton label="Transparente" isSelected={formValues.respiratorio.tosExpectoracion === "Transparente"} onClick={() => handleRadioChange("respiratorio", "tosExpectoracion", "Transparente")} />
                        <WordButton label="Amarilla" isSelected={formValues.respiratorio.tosExpectoracion === "Amarilla"} onClick={() => handleRadioChange("respiratorio", "tosExpectoracion", "Amarilla")} />
                        <WordButton label="Verdosa" isSelected={formValues.respiratorio.tosExpectoracion === "Verdosa"} onClick={() => handleRadioChange("respiratorio", "tosExpectoracion", "Verdosa")} />
                        <WordButton label="Hemoptoica" isSelected={formValues.respiratorio.tosExpectoracion === "Hemoptoica"} onClick={() => handleRadioChange("respiratorio", "tosExpectoracion", "Hemoptoica")} />
                      </div>
                     </div>
                   </div>
                  )}
                </div>

                {/* APARATO CARDIOVASCULAR */}
                <div className="bg-transparent/50 dark:bg-gray-900/50 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-lg font-semibold text-justify">Aparato Cardiovascular</h4>
                    <SintomasToggle 
                      checked={sintomasToggle.cardiovascular}
                      onChange={(checked) => handleSintomasToggle('cardiovascular', checked)}
                    />
                  </div>
                  {!sintomasToggle.cardiovascular && (
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Dolor torácico</Label>
                      <div className="flex flex-wrap mt-1">
                        <WordButton label="No refiere dolor torácico" isSelected={formValues.cardiovascular.dolorToracico === "No refiere dolor torácico"} onClick={() => handleRadioChange("cardiovascular", "dolorToracico", "No refiere dolor torácico")} />
                        <WordButton label="Dolor opresivo retroesternal" isSelected={formValues.cardiovascular.dolorToracico === "Dolor opresivo retroesternal irradiado a brazo, cuello o mandíbula"} onClick={() => handleRadioChange("cardiovascular", "dolorToracico", "Dolor opresivo retroesternal irradiado a brazo, cuello o mandíbula")} />
                        <WordButton label="Dolor punzante precordial" isSelected={formValues.cardiovascular.dolorToracico === "Dolor punzante localizado en región precordial"} onClick={() => handleRadioChange("cardiovascular", "dolorToracico", "Dolor punzante localizado en región precordial")} />
                        <WordButton label="Dolor en relación al esfuerzo" isSelected={formValues.cardiovascular.dolorToracico === "Dolor en relación al esfuerzo físico"} onClick={() => handleRadioChange("cardiovascular", "dolorToracico", "Dolor en relación al esfuerzo físico")} />
                        <WordButton label="Dolor en reposo o nocturno" isSelected={formValues.cardiovascular.dolorToracico === "Dolor en reposo o nocturno"} onClick={() => handleRadioChange("cardiovascular", "dolorToracico", "Dolor en reposo o nocturno")} />
                      </div>
                      {formValues.cardiovascular.dolorToracico && formValues.cardiovascular.dolorToracico !== "No refiere dolor torácico" && (
                        <div className="mt-2">
                          <Label>Especificar características (intensidad, duración, desencadenantes, alivio, tiempo de evolución)</Label>
                          <textarea
                            value={formValues.cardiovascular.dolorToracicoDetalle || ""}
                            onChange={(e) => handleTextareaChange("cardiovascular", "dolorToracicoDetalle", e.target.value)}
                            className="w-full p-2 mt-1 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-sm"
                            rows={2}
                            placeholder="Describa las características del dolor..."
                          />
                        </div>
                      )}
                    </div>
                    
                    <div>
                      <Label>Lipotimia o síncope</Label>
                      <div className="flex flex-wrap mt-1">
                        <WordButton label="No ha presentado episodios" isSelected={formValues.cardiovascular.lipotimia === "No ha presentado episodios"} onClick={() => handleRadioChange("cardiovascular", "lipotimia", "No ha presentado episodios")} />
                        <WordButton label="Lipotimia ocasional" isSelected={formValues.cardiovascular.lipotimia === "Lipotimia ocasional sin pérdida total de conciencia"} onClick={() => handleRadioChange("cardiovascular", "lipotimia", "Lipotimia ocasional sin pérdida total de conciencia")} />
                        <WordButton label="Síncope súbito" isSelected={formValues.cardiovascular.lipotimia === "Síncope súbito con recuperación espontánea"} onClick={() => handleRadioChange("cardiovascular", "lipotimia", "Síncope súbito con recuperación espontánea")} />
                      </div>
                      {formValues.cardiovascular.lipotimia && formValues.cardiovascular.lipotimia !== "No ha presentado episodios" && (
                        <div className="mt-2">
                          <Label>Especificar frecuencia, circunstancias, duración y síntomas asociados</Label>
                          <textarea
                            value={formValues.cardiovascular.lipotimiaDetalle || ""}
                            onChange={(e) => handleTextareaChange("cardiovascular", "lipotimiaDetalle", e.target.value)}
                            className="w-full p-2 mt-1 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-sm"
                            rows={2}
                            placeholder="Describa la frecuencia, circunstancias y síntomas..."
                          />
                        </div>
                      )}
                    </div>

                    <div>
                      <Label>Ritmo cardíaco percibido</Label>
                      <div className="flex flex-wrap mt-1">
                        <WordButton label="No percibe irregularidad" isSelected={formValues.cardiovascular.ritmoCardiaco === "No percibe irregularidad en el ritmo cardíaco"} onClick={() => handleRadioChange("cardiovascular", "ritmoCardiaco", "No percibe irregularidad en el ritmo cardíaco")} />
                        <WordButton label="Latidos acelerados persistentes" isSelected={formValues.cardiovascular.ritmoCardiaco === "Latidos acelerados persistentes"} onClick={() => handleRadioChange("cardiovascular", "ritmoCardiaco", "Latidos acelerados persistentes")} />
                        <WordButton label="Latidos lentos o débiles" isSelected={formValues.cardiovascular.ritmoCardiaco === "Latidos lentos o débiles"} onClick={() => handleRadioChange("cardiovascular", "ritmoCardiaco", "Latidos lentos o débiles")} />
                        <WordButton label="Palpitaciones intermitentes" isSelected={formValues.cardiovascular.ritmoCardiaco === "Episodios de palpitaciones intermitentes"} onClick={() => handleRadioChange("cardiovascular", "ritmoCardiaco", "Episodios de palpitaciones intermitentes")} />
                      </div>
                      {formValues.cardiovascular.ritmoCardiaco && formValues.cardiovascular.ritmoCardiaco !== "No percibe irregularidad en el ritmo cardíaco" && (
                        <div className="mt-2">
                          <Label>Especificar inicio, frecuencia, duración, factores desencadenantes</Label>
                          <textarea
                            value={formValues.cardiovascular.ritmoCardiacoDetalle || ""}
                            onChange={(e) => handleTextareaChange("cardiovascular", "ritmoCardiacoDetalle", e.target.value)}
                            className="w-full p-2 mt-1 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-sm"
                            rows={2}
                            placeholder="Describa inicio, frecuencia y desencadenantes..."
                          />
                        </div>
                      )}
                    </div>

                    <div>
                      <Label>Síntomas cardiovasculares asociados</Label>
                      <div className="flex flex-wrap mt-1">
                        <WordButton label="Mareos o vértigo recurrente" isSelected={formValues.cardiovascular.sintomasCardiovasculares.includes("Mareos o vértigo recurrente")} onClick={() => handleCheckboxChange("cardiovascular", "sintomasCardiovasculares", "Mareos o vértigo recurrente", !formValues.cardiovascular.sintomasCardiovasculares.includes("Mareos o vértigo recurrente"))} />
                        <WordButton label="Edema en extremidades inferiores" isSelected={formValues.cardiovascular.sintomasCardiovasculares.includes("Edema en extremidades inferiores")} onClick={() => handleCheckboxChange("cardiovascular", "sintomasCardiovasculares", "Edema en extremidades inferiores", !formValues.cardiovascular.sintomasCardiovasculares.includes("Edema en extremidades inferiores"))} />
                        <WordButton label="Equimosis o tendencia a hematomas" isSelected={formValues.cardiovascular.sintomasCardiovasculares.includes("Equimosis o tendencia a hematomas")} onClick={() => handleCheckboxChange("cardiovascular", "sintomasCardiovasculares", "Equimosis o tendencia a hematomas", !formValues.cardiovascular.sintomasCardiovasculares.includes("Equimosis o tendencia a hematomas"))} />
                        <WordButton label="Várices visibles o dolorosas" isSelected={formValues.cardiovascular.sintomasCardiovasculares.includes("Várices visibles o dolorosas")} onClick={() => handleCheckboxChange("cardiovascular", "sintomasCardiovasculares", "Várices visibles o dolorosas", !formValues.cardiovascular.sintomasCardiovasculares.includes("Várices visibles o dolorosas"))} />
                        <WordButton label="Cefalea relacionada a presión arterial" isSelected={formValues.cardiovascular.sintomasCardiovasculares.includes("Cefalea relacionada a presión arterial")} onClick={() => handleCheckboxChange("cardiovascular", "sintomasCardiovasculares", "Cefalea relacionada a presión arterial", !formValues.cardiovascular.sintomasCardiovasculares.includes("Cefalea relacionada a presión arterial"))} />
                        <WordButton label="Acúfenos (zumbido en los oídos)" isSelected={formValues.cardiovascular.sintomasCardiovasculares.includes("Acúfenos (zumbido en los oídos)")} onClick={() => handleCheckboxChange("cardiovascular", "sintomasCardiovasculares", "Acúfenos (zumbido en los oídos)", !formValues.cardiovascular.sintomasCardiovasculares.includes("Acúfenos (zumbido en los oídos)"))} />
                        <WordButton label="Fosfenos o visión borrosa transitoria" isSelected={formValues.cardiovascular.sintomasCardiovasculares.includes("Fosfenos o visión borrosa transitoria")} onClick={() => handleCheckboxChange("cardiovascular", "sintomasCardiovasculares", "Fosfenos o visión borrosa transitoria", !formValues.cardiovascular.sintomasCardiovasculares.includes("Fosfenos o visión borrosa transitoria"))} />
                        <WordButton label="Palpitaciones frecuentes" isSelected={formValues.cardiovascular.sintomasCardiovasculares.includes("Palpitaciones frecuentes")} onClick={() => handleCheckboxChange("cardiovascular", "sintomasCardiovasculares", "Palpitaciones frecuentes", !formValues.cardiovascular.sintomasCardiovasculares.includes("Palpitaciones frecuentes"))} />
                        <WordButton label="Ninguno de los anteriores" isSelected={formValues.cardiovascular.sintomasCardiovasculares.includes("Ninguno de los anteriores")} onClick={() => handleCheckboxChange("cardiovascular", "sintomasCardiovasculares", "Ninguno de los anteriores", !formValues.cardiovascular.sintomasCardiovasculares.includes("Ninguno de los anteriores"))} />
                      </div>
                      {formValues.cardiovascular.sintomasCardiovasculares.length > 0 && !formValues.cardiovascular.sintomasCardiovasculares.includes("Ninguno de los anteriores") && (
                        <div className="mt-2">
                          <Label>Describir evolución, intensidad y relación con actividades</Label>
                          <textarea
                            value={formValues.cardiovascular.sintomasCardiovascularesDetalle || ""}
                            onChange={(e) => handleTextareaChange("cardiovascular", "sintomasCardiovascularesDetalle", e.target.value)}
                            className="w-full p-2 mt-1 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-sm"
                            rows={2}
                            placeholder="Describa evolución y relación con actividades..."
                          />
                        </div>
                      )}
                    </div>

                    <div>
                      <Label>Presión arterial conocida</Label>
                      <div className="flex flex-wrap mt-1">
                        <WordButton label="Hipertensión arterial" isSelected={formValues.cardiovascular.presionArterial === "Ha referido diagnóstico previo de hipertensión arterial"} onClick={() => handleRadioChange("cardiovascular", "presionArterial", "Ha referido diagnóstico previo de hipertensión arterial")} />
                        <WordButton label="Hipotensión arterial" isSelected={formValues.cardiovascular.presionArterial === "Ha referido diagnóstico previo de hipotensión arterial"} onClick={() => handleRadioChange("cardiovascular", "presionArterial", "Ha referido diagnóstico previo de hipotensión arterial")} />
                        <WordButton label="Sin diagnóstico conocido" isSelected={formValues.cardiovascular.presionArterial === "No cuenta con diagnóstico conocido de alteraciones en la presión arterial"} onClick={() => handleRadioChange("cardiovascular", "presionArterial", "No cuenta con diagnóstico conocido de alteraciones en la presión arterial")} />
                      </div>
                    </div>

                    <div>
                      <Label>Antecedentes cardiovasculares</Label>
                      <div className="flex flex-wrap mt-1">
                        <WordButton label="Infarto agudo al miocardio" isSelected={formValues.cardiovascular.antecedentesCardiovasculares.includes("Infarto agudo al miocardio")} onClick={() => handleCheckboxChange("cardiovascular", "antecedentesCardiovasculares", "Infarto agudo al miocardio", !formValues.cardiovascular.antecedentesCardiovasculares.includes("Infarto agudo al miocardio"))} />
                        <WordButton label="Enfermedad coronaria" isSelected={formValues.cardiovascular.antecedentesCardiovasculares.includes("Enfermedad coronaria (ej. angina de pecho)")} onClick={() => handleCheckboxChange("cardiovascular", "antecedentesCardiovasculares", "Enfermedad coronaria (ej. angina de pecho)", !formValues.cardiovascular.antecedentesCardiovasculares.includes("Enfermedad coronaria (ej. angina de pecho)"))} />
                        <WordButton label="Insuficiencia cardíaca" isSelected={formValues.cardiovascular.antecedentesCardiovasculares.includes("Insuficiencia cardíaca")} onClick={() => handleCheckboxChange("cardiovascular", "antecedentesCardiovasculares", "Insuficiencia cardíaca", !formValues.cardiovascular.antecedentesCardiovasculares.includes("Insuficiencia cardíaca"))} />
                        <WordButton label="Procedimientos cardiovasculares" isSelected={formValues.cardiovascular.antecedentesCardiovasculares.includes("Procedimientos cardiovasculares (cateterismo, bypass, angioplastía)")} onClick={() => handleCheckboxChange("cardiovascular", "antecedentesCardiovasculares", "Procedimientos cardiovasculares (cateterismo, bypass, angioplastía)", !formValues.cardiovascular.antecedentesCardiovasculares.includes("Procedimientos cardiovasculares (cateterismo, bypass, angioplastía)"))} />
                        <WordButton label="Niega antecedentes cardiovasculares" isSelected={formValues.cardiovascular.antecedentesCardiovasculares.includes("Niega antecedentes cardiovasculares")} onClick={() => handleCheckboxChange("cardiovascular", "antecedentesCardiovasculares", "Niega antecedentes cardiovasculares", !formValues.cardiovascular.antecedentesCardiovasculares.includes("Niega antecedentes cardiovasculares"))} />
                      </div>
                      {formValues.cardiovascular.antecedentesCardiovasculares.length > 0 && !formValues.cardiovascular.antecedentesCardiovasculares.includes("Niega antecedentes cardiovasculares") && (
                        <div className="mt-2">
                          <Label>Detallar año, tratamiento recibido, secuelas, hospitalizaciones</Label>
                          <textarea
                            value={formValues.cardiovascular.antecedentesCardiovascularesDetalle || ""}
                            onChange={(e) => handleTextareaChange("cardiovascular", "antecedentesCardiovascularesDetalle", e.target.value)}
                            className="w-full p-2 mt-1 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-sm"
                            rows={2}
                            placeholder="Detallar año, tratamiento, secuelas..."
                          />
                        </div>
                      )}
                    </div>

                    <div>
                      <Label>Capacidad funcional</Label>
                      <div className="flex flex-wrap mt-1">
                        <WordButton label="Fatiga con esfuerzos leves" isSelected={formValues.cardiovascular.capacidadFuncional === "Fatiga fácil con esfuerzos leves (caminar, subir escaleras cortas)"} onClick={() => handleRadioChange("cardiovascular", "capacidadFuncional", "Fatiga fácil con esfuerzos leves (caminar, subir escaleras cortas)")} />
                        <WordButton label="Fatiga con esfuerzos moderados" isSelected={formValues.cardiovascular.capacidadFuncional === "Fatiga únicamente con esfuerzos moderados o intensos"} onClick={() => handleRadioChange("cardiovascular", "capacidadFuncional", "Fatiga únicamente con esfuerzos moderados o intensos")} />
                        <WordButton label="No refiere fatiga" isSelected={formValues.cardiovascular.capacidadFuncional === "No refiere fatiga con la actividad cotidiana"} onClick={() => handleRadioChange("cardiovascular", "capacidadFuncional", "No refiere fatiga con la actividad cotidiana")} />
                      </div>
                      {formValues.cardiovascular.capacidadFuncional && formValues.cardiovascular.capacidadFuncional !== "No refiere fatiga con la actividad cotidiana" && (
                        <div className="mt-2">
                          <Label>Especificar limitaciones, tiempo de inicio y progresión</Label>
                          <textarea
                            value={formValues.cardiovascular.capacidadFuncionalDetalle || ""}
                            onChange={(e) => handleTextareaChange("cardiovascular", "capacidadFuncionalDetalle", e.target.value)}
                            className="w-full p-2 mt-1 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-sm"
                            rows={2}
                            placeholder="Especificar limitaciones y progresión..."
                          />
                        </div>
                      )}
                    </div>

                    <div>
                      <Label>Disnea (dificultad para respirar)</Label>
                      <div className="flex flex-wrap mt-1">
                        <WordButton label="No refiere dificultad respiratoria" isSelected={formValues.cardiovascular.disnea === "No refiere dificultad respiratoria"} onClick={() => handleRadioChange("cardiovascular", "disnea", "No refiere dificultad respiratoria")} />
                        <WordButton label="Disnea de esfuerzo leve" isSelected={formValues.cardiovascular.disnea === "Disnea de esfuerzo leve"} onClick={() => handleRadioChange("cardiovascular", "disnea", "Disnea de esfuerzo leve")} />
                        <WordButton label="Disnea paroxística nocturna" isSelected={formValues.cardiovascular.disnea === "Disnea paroxística nocturna"} onClick={() => handleRadioChange("cardiovascular", "disnea", "Disnea paroxística nocturna")} />
                        <WordButton label="Ortopnea" isSelected={formValues.cardiovascular.disnea === "Ortopnea (dificultad respiratoria al estar acostado)"} onClick={() => handleRadioChange("cardiovascular", "disnea", "Ortopnea (dificultad respiratoria al estar acostado)")} />
                      </div>
                      {formValues.cardiovascular.disnea && formValues.cardiovascular.disnea !== "No refiere dificultad respiratoria" && (
                        <div className="mt-2">
                          <Label>Especificar desencadenantes, duración, intensidad y tratamiento recibido</Label>
                          <textarea
                            value={formValues.cardiovascular.disneaDetalle || ""}
                            onChange={(e) => handleTextareaChange("cardiovascular", "disneaDetalle", e.target.value)}
                            className="w-full p-2 mt-1 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-sm"
                            rows={2}
                            placeholder="Especificar desencadenantes, duración e intensidad..."
                          />
                        </div>
                      )}
                    </div>

                    <div>
                      <Label>Otros antecedentes relevantes</Label>
                      <div className="flex flex-wrap mt-1">
                        <WordButton label="Uso de medicamentos cardiovasculares" isSelected={formValues.cardiovascular.otrosAntecedentes.includes("Uso actual o previo de medicamentos cardiovasculares")} onClick={() => handleCheckboxChange("cardiovascular", "otrosAntecedentes", "Uso actual o previo de medicamentos cardiovasculares", !formValues.cardiovascular.otrosAntecedentes.includes("Uso actual o previo de medicamentos cardiovasculares"))} />
                        <WordButton label="Antecedentes familiares" isSelected={formValues.cardiovascular.otrosAntecedentes.includes("Antecedentes familiares de enfermedad cardiovascular prematura")} onClick={() => handleCheckboxChange("cardiovascular", "otrosAntecedentes", "Antecedentes familiares de enfermedad cardiovascular prematura", !formValues.cardiovascular.otrosAntecedentes.includes("Antecedentes familiares de enfermedad cardiovascular prematura"))} />
                        <WordButton label="Niega antecedentes familiares" isSelected={formValues.cardiovascular.otrosAntecedentes.includes("Niega antecedentes familiares relevantes")} onClick={() => handleCheckboxChange("cardiovascular", "otrosAntecedentes", "Niega antecedentes familiares relevantes", !formValues.cardiovascular.otrosAntecedentes.includes("Niega antecedentes familiares relevantes"))} />
                      </div>
                      {formValues.cardiovascular.otrosAntecedentes.length > 0 && !formValues.cardiovascular.otrosAntecedentes.includes("Niega antecedentes familiares relevantes") && (
                        <div className="mt-2">
                          <Label>Especificar nombres de fármacos, dosis, parentesco y edad de presentación en familiares</Label>
                          <textarea
                            value={formValues.cardiovascular.otrosAntecedentesDetalle || ""}
                            onChange={(e) => handleTextareaChange("cardiovascular", "otrosAntecedentesDetalle", e.target.value)}
                            className="w-full p-2 mt-1 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-sm"
                            rows={2}
                            placeholder="Especificar medicamentos, dosis, antecedentes familiares..."
                          />
                        </div>
                      )}
                     </div>
                   </div>
                  )}
                </div>

                 {/* APARATO GENITO-URINARIO */}
                 <div className="bg-transparent/50 dark:bg-gray-900/50 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                   <div className="flex items-center justify-between mb-4">
                     <h4 className="text-lg font-semibold text-justify">Aparato Genito-Urinario</h4>
                     <SintomasToggle 
                       checked={sintomasToggle.genitoUrinario}
                       onChange={(checked) => handleSintomasToggle('genitoUrinario', checked)}
                     />
                   </div>
                   {!sintomasToggle.genitoUrinario && (
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Frecuencia Urinaria</Label>
                      <div className="flex flex-wrap mt-1">
                        <WordButton label="Menos de 3 veces" isSelected={formValues.genitoUrinario.frecuenciaUrinaria === "Menos de 3"} onClick={() => handleRadioChange("genitoUrinario", "frecuenciaUrinaria", "Menos de 3")} />
                        <WordButton label="3 a 6 veces" isSelected={formValues.genitoUrinario.frecuenciaUrinaria === "3 a 6"} onClick={() => handleRadioChange("genitoUrinario", "frecuenciaUrinaria", "3 a 6")} />
                        <WordButton label="Más de 6 veces" isSelected={formValues.genitoUrinario.frecuenciaUrinaria === "Más de 6"} onClick={() => handleRadioChange("genitoUrinario", "frecuenciaUrinaria", "Más de 6")} />
                      </div>
                    </div>
                    <div>
                      <Label>Síntomas Urinarios</Label>
                      <div className="flex flex-wrap mt-1">
                        <WordButton label="Incontinencia" isSelected={formValues.genitoUrinario.sintomasUrinarios.includes("Incontinencia")} onClick={() => handleCheckboxChange("genitoUrinario", "sintomasUrinarios", "Incontinencia", !formValues.genitoUrinario.sintomasUrinarios.includes("Incontinencia"))} />
                        <WordButton label="Disuria" isSelected={formValues.genitoUrinario.sintomasUrinarios.includes("Dolor al orinar (disuria)")} onClick={() => handleCheckboxChange("genitoUrinario", "sintomasUrinarios", "Dolor al orinar (disuria)", !formValues.genitoUrinario.sintomasUrinarios.includes("Dolor al orinar (disuria)"))} />
                        <WordButton label="Hematuria" isSelected={formValues.genitoUrinario.sintomasUrinarios.includes("Sangre en orina (hematuria)")} onClick={() => handleCheckboxChange("genitoUrinario", "sintomasUrinarios", "Sangre en orina (hematuria)", !formValues.genitoUrinario.sintomasUrinarios.includes("Sangre en orina (hematuria)"))} />
                        <WordButton label="Poliuria" isSelected={formValues.genitoUrinario.sintomasUrinarios.includes("Orina en exceso (poliuria)")} onClick={() => handleCheckboxChange("genitoUrinario", "sintomasUrinarios", "Orina en exceso (poliuria)", !formValues.genitoUrinario.sintomasUrinarios.includes("Orina en exceso (poliuria)"))} />
                        <WordButton label="Nicturia" isSelected={formValues.genitoUrinario.sintomasUrinarios.includes("Orinar de noche (nicturia)")} onClick={() => handleCheckboxChange("genitoUrinario", "sintomasUrinarios", "Orinar de noche (nicturia)", !formValues.genitoUrinario.sintomasUrinarios.includes("Orinar de noche (nicturia)"))} />
                        <WordButton label="Dolor Lumbar" isSelected={formValues.genitoUrinario.sintomasUrinarios.includes("Dolor lumbar")} onClick={() => handleCheckboxChange("genitoUrinario", "sintomasUrinarios", "Dolor lumbar", !formValues.genitoUrinario.sintomasUrinarios.includes("Dolor lumbar"))} />
                        <WordButton label="Ninguno" isSelected={formValues.genitoUrinario.sintomasUrinarios.includes("Ninguno")} onClick={() => handleCheckboxChange("genitoUrinario", "sintomasUrinarios", "Ninguno", !formValues.genitoUrinario.sintomasUrinarios.includes("Ninguno"))} />
                      </div>
                    </div>
                    <div>
                      <Label>Urgencia urinaria</Label>
                      <div className="flex flex-wrap mt-1">
                        <WordButton label="Sí" isSelected={formValues.genitoUrinario.urgenciaUrinaria === "Sí"} onClick={() => handleRadioChange("genitoUrinario", "urgenciaUrinaria", "Sí")} />
                        <WordButton label="No" isSelected={formValues.genitoUrinario.urgenciaUrinaria === "No"} onClick={() => handleRadioChange("genitoUrinario", "urgenciaUrinaria", "No")} />
                      </div>
                    </div>
                    <div>
                      <Label>Chorro urinario débil</Label>
                      <div className="flex flex-wrap mt-1">
                        <WordButton label="Sí" isSelected={formValues.genitoUrinario.chorroUrinarioDebil === "Sí"} onClick={() => handleRadioChange("genitoUrinario", "chorroUrinarioDebil", "Sí")} />
                        <WordButton label="No" isSelected={formValues.genitoUrinario.chorroUrinarioDebil === "No"} onClick={() => handleRadioChange("genitoUrinario", "chorroUrinarioDebil", "No")} />
                      </div>
                    </div>
                    <div>
                      <Label>Chorro urinario intermitente</Label>
                      <div className="flex flex-wrap mt-1">
                        <WordButton label="Sí" isSelected={formValues.genitoUrinario.chorroUrinarioIntermitente === "Sí"} onClick={() => handleRadioChange("genitoUrinario", "chorroUrinarioIntermitente", "Sí")} />
                        <WordButton label="No" isSelected={formValues.genitoUrinario.chorroUrinarioIntermitente === "No"} onClick={() => handleRadioChange("genitoUrinario", "chorroUrinarioIntermitente", "No")} />
                      </div>
                    </div>
                    <div>
                      <Label>Flujo vaginal/uretral anormal</Label>
                      <div className="flex flex-wrap mt-1">
                        <WordButton label="Sí" isSelected={formValues.genitoUrinario.flujoVaginalUretral === "Sí"} onClick={() => handleRadioChange("genitoUrinario", "flujoVaginalUretral", "Sí")} />
                        <WordButton label="No" isSelected={formValues.genitoUrinario.flujoVaginalUretral === "No"} onClick={() => handleRadioChange("genitoUrinario", "flujoVaginalUretral", "No")} />
                      </div>
                    </div>
                    <div>
                      <Label>Infecciones urinarias frecuentes</Label>
                      <div className="flex flex-wrap mt-1">
                        <WordButton label="Sí" isSelected={formValues.genitoUrinario.infeccionesUrinarias === "Sí"} onClick={() => handleRadioChange("genitoUrinario", "infeccionesUrinarias", "Sí")} />
                        <WordButton label="No" isSelected={formValues.genitoUrinario.infeccionesUrinarias === "No"} onClick={() => handleRadioChange("genitoUrinario", "infeccionesUrinarias", "No")} />
                      </div>
                    </div>
                    <div>
                      <Label>Fecha de Última Menstruación (solo si es mujer)</Label>
                      <input
                        type="date"
                        value={formValues.genitoUrinario.ultimaMenstruacion}
                        onChange={(e) => handleTextChange("genitoUrinario", "ultimaMenstruacion", e.target.value)}
                        className="w-full p-2 border rounded-md"
                      />
                    </div>
                    <div>
                      <Label>Dismenorrea</Label>
                      <div className="flex flex-wrap mt-1">
                        <WordButton label="Sí" isSelected={formValues.genitoUrinario.dismenorrea === "Sí"} onClick={() => handleRadioChange("genitoUrinario", "dismenorrea", "Sí")} />
                        <WordButton label="No" isSelected={formValues.genitoUrinario.dismenorrea === "No"} onClick={() => handleRadioChange("genitoUrinario", "dismenorrea", "No")} />
                      </div>
                    </div>
                    <div>
                      <Label>Días de duración de menstruación</Label>
                      <div className="flex flex-wrap mt-1">
                        <WordButton label="Menos de 3 días" isSelected={formValues.genitoUrinario.duracionMenstruacion === "Menos de 3 días"} onClick={() => handleRadioChange("genitoUrinario", "duracionMenstruacion", "Menos de 3 días")} />
                        <WordButton label="3 a 5 días" isSelected={formValues.genitoUrinario.duracionMenstruacion === "3 a 5 días"} onClick={() => handleRadioChange("genitoUrinario", "duracionMenstruacion", "3 a 5 días")} />
                        <WordButton label="Más de 5 días" isSelected={formValues.genitoUrinario.duracionMenstruacion === "Más de 5 días"} onClick={() => handleRadioChange("genitoUrinario", "duracionMenstruacion", "Más de 5 días")} />
                      </div>
                    </div>
                    <div>
                      <Label>Fecha de Último Parto</Label>
                      <input
                        type="date"
                        value={formValues.genitoUrinario.ultimoParto}
                        onChange={(e) => handleTextChange("genitoUrinario", "ultimoParto", e.target.value)}
                        className="w-full p-2 border rounded-md"
                      />
                    </div>
                    <div>
                      <Label>Antecedentes Obstétricos</Label>
                      <div className="flex flex-wrap mt-1">
                        <WordButton label="Ninguno" isSelected={formValues.genitoUrinario.antecedentesObstetricos === "Ninguno"} onClick={() => handleRadioChange("genitoUrinario", "antecedentesObstetricos", "Ninguno")} />
                        <WordButton label="Abortos" isSelected={formValues.genitoUrinario.antecedentesObstetricos === "Abortos"} onClick={() => handleRadioChange("genitoUrinario", "antecedentesObstetricos", "Abortos")} />
                        <WordButton label="Cesáreas" isSelected={formValues.genitoUrinario.antecedentesObstetricos === "Cesáreas"} onClick={() => handleRadioChange("genitoUrinario", "antecedentesObstetricos", "Cesáreas")} />
                        <WordButton label="Ambos" isSelected={formValues.genitoUrinario.antecedentesObstetricos === "Ambos"} onClick={() => handleRadioChange("genitoUrinario", "antecedentesObstetricos", "Ambos")} />
                      </div>
                     </div>
                   </div>
                  )}
                </div>

                 {/* SISTEMA ENDOCRINO */}
                 <div className="bg-transparent/50 dark:bg-gray-900/50 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                   <div className="flex items-center justify-between mb-4">
                     <h4 className="text-lg font-semibold text-justify">Sistema Endocrino</h4>
                     <SintomasToggle 
                       checked={sintomasToggle.endocrino}
                       onChange={(checked) => handleSintomasToggle('endocrino', checked)}
                     />
                   </div>
                   {!sintomasToggle.endocrino && (
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Síntomas Endocrinos</Label>
                      <div className="flex flex-wrap mt-1">
                        <WordButton label="Poliuria" isSelected={formValues.endocrino.sintomasEndocrinos.includes("Poliuria")} onClick={() => handleCheckboxChange("endocrino", "sintomasEndocrinos", "Poliuria", !formValues.endocrino.sintomasEndocrinos.includes("Poliuria"))} />
                        <WordButton label="Polidipsia" isSelected={formValues.endocrino.sintomasEndocrinos.includes("Polidipsia")} onClick={() => handleCheckboxChange("endocrino", "sintomasEndocrinos", "Polidipsia", !formValues.endocrino.sintomasEndocrinos.includes("Polidipsia"))} />
                        <WordButton label="Polifagia" isSelected={formValues.endocrino.sintomasEndocrinos.includes("Polifagia")} onClick={() => handleCheckboxChange("endocrino", "sintomasEndocrinos", "Polifagia", !formValues.endocrino.sintomasEndocrinos.includes("Polifagia"))} />
                        <WordButton label="Exoftalmos" isSelected={formValues.endocrino.sintomasEndocrinos.includes("Exoftalmos (ojos saltones)")} onClick={() => handleCheckboxChange("endocrino", "sintomasEndocrinos", "Exoftalmos (ojos saltones)", !formValues.endocrino.sintomasEndocrinos.includes("Exoftalmos (ojos saltones)"))} />
                        <WordButton label="Nerviosismo" isSelected={formValues.endocrino.sintomasEndocrinos.includes("Nerviosismo")} onClick={() => handleCheckboxChange("endocrino", "sintomasEndocrinos", "Nerviosismo", !formValues.endocrino.sintomasEndocrinos.includes("Nerviosismo"))} />
                        <WordButton label="Temblores" isSelected={formValues.endocrino.sintomasEndocrinos.includes("Temblores")} onClick={() => handleCheckboxChange("endocrino", "sintomasEndocrinos", "Temblores", !formValues.endocrino.sintomasEndocrinos.includes("Temblores"))} />
                        <WordButton label="Insomnio" isSelected={formValues.endocrino.sintomasEndocrinos.includes("Insomnio")} onClick={() => handleCheckboxChange("endocrino", "sintomasEndocrinos", "Insomnio", !formValues.endocrino.sintomasEndocrinos.includes("Insomnio"))} />
                        <WordButton label="Ninguno" isSelected={formValues.endocrino.sintomasEndocrinos.includes("Ninguno")} onClick={() => handleCheckboxChange("endocrino", "sintomasEndocrinos", "Ninguno", !formValues.endocrino.sintomasEndocrinos.includes("Ninguno"))} />
                      </div>
                    </div>
                    <div>
                      <Label>Sudoración excesiva nocturna</Label>
                      <div className="flex flex-wrap mt-1">
                        <WordButton label="Sí" isSelected={formValues.endocrino.sudoracionNocturna === "Sí"} onClick={() => handleRadioChange("endocrino", "sudoracionNocturna", "Sí")} />
                        <WordButton label="No" isSelected={formValues.endocrino.sudoracionNocturna === "No"} onClick={() => handleRadioChange("endocrino", "sudoracionNocturna", "No")} />
                      </div>
                    </div>
                    <div>
                      <Label>Hirsutismo (vello excesivo en mujeres)</Label>
                      <div className="flex flex-wrap mt-1">
                        <WordButton label="Sí" isSelected={formValues.endocrino.hirsutismo === "Sí"} onClick={() => handleRadioChange("endocrino", "hirsutismo", "Sí")} />
                        <WordButton label="No" isSelected={formValues.endocrino.hirsutismo === "No"} onClick={() => handleRadioChange("endocrino", "hirsutismo", "No")} />
                      </div>
                    </div>
                    <div>
                      <Label>Galactorrea (secreción mamaria anormal)</Label>
                      <div className="flex flex-wrap mt-1">
                        <WordButton label="Sí" isSelected={formValues.endocrino.galactorrea === "Sí"} onClick={() => handleRadioChange("endocrino", "galactorrea", "Sí")} />
                        <WordButton label="No" isSelected={formValues.endocrino.galactorrea === "No"} onClick={() => handleRadioChange("endocrino", "galactorrea", "No")} />
                      </div>
                    </div>
                    <div>
                      <Label>Cambios en el ritmo menstrual</Label>
                      <div className="flex flex-wrap mt-1">
                        <WordButton label="Retrasos" isSelected={formValues.endocrino.cambiosRitmoMenstrual === "Retrasos"} onClick={() => handleRadioChange("endocrino", "cambiosRitmoMenstrual", "Retrasos")} />
                        <WordButton label="Amenorrea" isSelected={formValues.endocrino.cambiosRitmoMenstrual === "Amenorrea"} onClick={() => handleRadioChange("endocrino", "cambiosRitmoMenstrual", "Amenorrea")} />
                        <WordButton label="Ciclos cortos" isSelected={formValues.endocrino.cambiosRitmoMenstrual === "Ciclos cortos"} onClick={() => handleRadioChange("endocrino", "cambiosRitmoMenstrual", "Ciclos cortos")} />
                      </div>
                    </div>
                    <div>
                      <Label>Cambios de Peso</Label>
                      <div className="flex flex-wrap mt-1">
                        <WordButton label="Pérdida" isSelected={formValues.endocrino.cambiosPeso === "Perdida"} onClick={() => handleRadioChange("endocrino", "cambiosPeso", "Perdida")} />
                        <WordButton label="Aumento" isSelected={formValues.endocrino.cambiosPeso === "Aumento"} onClick={() => handleRadioChange("endocrino", "cambiosPeso", "Aumento")} />
                        <WordButton label="No" isSelected={formValues.endocrino.cambiosPeso === "No"} onClick={() => handleRadioChange("endocrino", "cambiosPeso", "No")} />
                      </div>
                    </div>
                    <div>
                      <Label>Intolerancia</Label>
                      <div className="flex flex-wrap mt-1">
                        <WordButton label="Frío" isSelected={formValues.endocrino.intolerancia === "Frío"} onClick={() => handleRadioChange("endocrino", "intolerancia", "Frío")} />
                        <WordButton label="Calor" isSelected={formValues.endocrino.intolerancia === "Calor"} onClick={() => handleRadioChange("endocrino", "intolerancia", "Calor")} />
                        <WordButton label="No" isSelected={formValues.endocrino.intolerancia === "No"} onClick={() => handleRadioChange("endocrino", "intolerancia", "No")} />
                      </div>
                    </div>
                    <div>
                      <Label>Condiciones Endocrinas</Label>
                      <div className="flex flex-wrap mt-1">
                        <WordButton label="Hipotiroidismo" isSelected={formValues.endocrino.condicionesEndocrinas === "Hipotiroidismo"} onClick={() => handleRadioChange("endocrino", "condicionesEndocrinas", "Hipotiroidismo")} />
                        <WordButton label="Hipertiroidismo" isSelected={formValues.endocrino.condicionesEndocrinas === "Hipertiroidismo"} onClick={() => handleRadioChange("endocrino", "condicionesEndocrinas", "Hipertiroidismo")} />
                        <WordButton label="Ninguno" isSelected={formValues.endocrino.condicionesEndocrinas === "Ninguno"} onClick={() => handleRadioChange("endocrino", "condicionesEndocrinas", "Ninguno")} />
                      </div>
                     </div>
                   </div>
                  )}
                </div>

                 {/* SISTEMA TEGUMENTARIO */}
                 <div className="bg-transparent/50 dark:bg-gray-900/50 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                   <div className="flex items-center justify-between mb-4">
                     <h4 className="text-lg font-semibold text-justify">Sistema Tegumentario</h4>
                     <SintomasToggle 
                       checked={sintomasToggle.tegumentario}
                       onChange={(checked) => handleSintomasToggle('tegumentario', checked)}
                     />
                   </div>
                   {!sintomasToggle.tegumentario && (
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Cambios en la Coloración de la Piel</Label>
                      <div className="flex flex-wrap mt-1">
                        <WordButton label="Sí" isSelected={formValues.tegumentario.cambiosColoracion === "Sí"} onClick={() => handleRadioChange("tegumentario", "cambiosColoracion", "Sí")} />
                        <WordButton label="No" isSelected={formValues.tegumentario.cambiosColoracion === "No"} onClick={() => handleRadioChange("tegumentario", "cambiosColoracion", "No")} />
                      </div>
                      {formValues.tegumentario.cambiosColoracion === "Sí" && (
                        <Textarea
                          placeholder="Escriba especificaciones relacionadas..."
                          value={formValues.tegumentario.cambiosColoracionEspecificaciones}
                          onChange={(e) => handleTextChange("tegumentario", "cambiosColoracionEspecificaciones", e.target.value)}
                          className="w-full p-2 border rounded-md mt-2"
                        />
                      )}
                    </div>
                    <div>
                      <Label>Síntomas Tegumentarios</Label>
                      <div className="flex flex-wrap mt-1">
                        <WordButton label="Erupciones" isSelected={formValues.tegumentario.sintomasTegumentarios.includes("Erupciones")} onClick={() => handleCheckboxChange("tegumentario", "sintomasTegumentarios", "Erupciones", !formValues.tegumentario.sintomasTegumentarios.includes("Erupciones"))} />
                        <WordButton label="Prurito" isSelected={formValues.tegumentario.sintomasTegumentarios.includes("Prurito (comezón)")} onClick={() => handleCheckboxChange("tegumentario", "sintomasTegumentarios", "Prurito (comezón)", !formValues.tegumentario.sintomasTegumentarios.includes("Prurito (comezón)"))} />
                        <WordButton label="Hiperhidrosis" isSelected={formValues.tegumentario.sintomasTegumentarios.includes("Hiperhidrosis (sudoración excesiva)")} onClick={() => handleCheckboxChange("tegumentario", "sintomasTegumentarios", "Hiperhidrosis (sudoración excesiva)", !formValues.tegumentario.sintomasTegumentarios.includes("Hiperhidrosis (sudoración excesiva)"))} />
                        <WordButton label="Pérdida de Pelo" isSelected={formValues.tegumentario.sintomasTegumentarios.includes("Pérdida de pelo o vello")} onClick={() => handleCheckboxChange("tegumentario", "sintomasTegumentarios", "Pérdida de pelo o vello", !formValues.tegumentario.sintomasTegumentarios.includes("Pérdida de pelo o vello"))} />
                        <WordButton label="Piel Seca" isSelected={formValues.tegumentario.sintomasTegumentarios.includes("Piel seca")} onClick={() => handleCheckboxChange("tegumentario", "sintomasTegumentarios", "Piel seca", !formValues.tegumentario.sintomasTegumentarios.includes("Piel seca"))} />
                        <WordButton label="Ninguno" isSelected={formValues.tegumentario.sintomasTegumentarios.includes("Ninguno")} onClick={() => handleCheckboxChange("tegumentario", "sintomasTegumentarios", "Ninguno", !formValues.tegumentario.sintomasTegumentarios.includes("Ninguno"))} />
                      </div>
                    </div>
                    <div>
                      <Label>Cambios en uñas</Label>
                      <div className="flex flex-wrap mt-1">
                        <WordButton label="Frágiles" isSelected={formValues.tegumentario.cambiosUnas === "Frágiles"} onClick={() => handleRadioChange("tegumentario", "cambiosUnas", "Frágiles")} />
                        <WordButton label="Quebradizas" isSelected={formValues.tegumentario.cambiosUnas === "Quebradizas"} onClick={() => handleRadioChange("tegumentario", "cambiosUnas", "Quebradizas")} />
                        <WordButton label="Deformadas" isSelected={formValues.tegumentario.cambiosUnas === "Deformadas"} onClick={() => handleRadioChange("tegumentario", "cambiosUnas", "Deformadas")} />
                      </div>
                    </div>
                    <div>
                      <Label>Cambios en lunares</Label>
                      <div className="flex flex-wrap mt-1">
                        <WordButton label="Sí" isSelected={formValues.tegumentario.cambiosLunares === "Sí"} onClick={() => handleRadioChange("tegumentario", "cambiosLunares", "Sí")} />
                        <WordButton label="No" isSelected={formValues.tegumentario.cambiosLunares === "No"} onClick={() => handleRadioChange("tegumentario", "cambiosLunares", "No")} />
                      </div>
                    </div>
                    <div>
                      <Label>Lesiones pigmentadas</Label>
                      <div className="flex flex-wrap mt-1">
                        <WordButton label="Sí" isSelected={formValues.tegumentario.lesionesPigmentadas === "Sí"} onClick={() => handleRadioChange("tegumentario", "lesionesPigmentadas", "Sí")} />
                        <WordButton label="No" isSelected={formValues.tegumentario.lesionesPigmentadas === "No"} onClick={() => handleRadioChange("tegumentario", "lesionesPigmentadas", "No")} />
                      </div>
                     </div>
                   </div>
                  )}
                </div>

                 {/* SISTEMA MÚSCULO-ESQUELÉTICO */}
                 <div className="bg-transparent/50 dark:bg-gray-900/50 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                   <div className="flex items-center justify-between mb-4">
                     <h4 className="text-lg font-semibold text-justify">Sistema Músculo-Esquelético</h4>
                     <SintomasToggle 
                       checked={sintomasToggle.musculoEsqueletico}
                       onChange={(checked) => handleSintomasToggle('musculoEsqueletico', checked)}
                     />
                   </div>
                   {!sintomasToggle.musculoEsqueletico && (
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Fracturas o Esguinces</Label>
                      <div className="flex flex-wrap mt-1">
                        <WordButton label="Sí" isSelected={formValues.musculoEsqueletico.fracturas === "Sí"} onClick={() => handleRadioChange("musculoEsqueletico", "fracturas", "Sí")} />
                        <WordButton label="No" isSelected={formValues.musculoEsqueletico.fracturas === "No"} onClick={() => handleRadioChange("musculoEsqueletico", "fracturas", "No")} />
                      </div>
                    </div>
                    <div>
                      <Label>Detalles de Fracturas</Label>
                      {formValues.musculoEsqueletico.fracturas === "Sí" && (
                        <Textarea
                          placeholder="Escriba especificaciones relacionadas..."
                          value={formValues.musculoEsqueletico.detallesFracturas}
                          onChange={(e) => handleTextChange("musculoEsqueletico", "detallesFracturas", e.target.value)}
                          className="w-full p-2 border rounded-md mt-2"
                        />
                      )}
                    </div>
                    <div>
                      <Label>Síntomas Musculoesqueléticos</Label>
                      <div className="flex flex-wrap mt-1">
                        <WordButton label="Deformidad Articular" isSelected={formValues.musculoEsqueletico.sintomasMusculoEsqueleticos.includes("Deformidad articular")} onClick={() => handleCheckboxChange("musculoEsqueletico", "sintomasMusculoEsqueleticos", "Deformidad articular", !formValues.musculoEsqueletico.sintomasMusculoEsqueleticos.includes("Deformidad articular"))} />
                        <WordButton label="Dolor Articular" isSelected={formValues.musculoEsqueletico.sintomasMusculoEsqueleticos.includes("Dolor articular")} onClick={() => handleCheckboxChange("musculoEsqueletico", "sintomasMusculoEsqueleticos", "Dolor articular", !formValues.musculoEsqueletico.sintomasMusculoEsqueleticos.includes("Dolor articular"))} />
                        <WordButton label="Calambres musculares frecuentes" isSelected={formValues.musculoEsqueletico.sintomasMusculoEsqueleticos.includes("Calambres musculares frecuentes")} onClick={() => handleCheckboxChange("musculoEsqueletico", "sintomasMusculoEsqueleticos", "Calambres musculares frecuentes", !formValues.musculoEsqueletico.sintomasMusculoEsqueleticos.includes("Calambres musculares frecuentes"))} />
                        <WordButton label="Ninguno" isSelected={formValues.musculoEsqueletico.sintomasMusculoEsqueleticos.includes("Ninguno")} onClick={() => handleCheckboxChange("musculoEsqueletico", "sintomasMusculoEsqueleticos", "Ninguno", !formValues.musculoEsqueletico.sintomasMusculoEsqueleticos.includes("Ninguno"))} />
                      </div>
                    </div>
                    <div>
                      <Label>Rigidez matutina</Label>
                      <div className="flex flex-wrap mt-1">
                        <WordButton label="Menos de 30 min" isSelected={formValues.musculoEsqueletico.rigidezMatutina === "Menos de 30 min"} onClick={() => handleRadioChange("musculoEsqueletico", "rigidezMatutina", "Menos de 30 min")} />
                        <WordButton label="Más de 30 min" isSelected={formValues.musculoEsqueletico.rigidezMatutina === "Más de 30 min"} onClick={() => handleRadioChange("musculoEsqueletico", "rigidezMatutina", "Más de 30 min")} />
                      </div>
                    </div>
                    <div>
                      <Label>Debilidad muscular</Label>
                      <div className="flex flex-wrap mt-1">
                        <WordButton label="Generalizada" isSelected={formValues.musculoEsqueletico.debilidadMuscular === "Generalizada"} onClick={() => handleRadioChange("musculoEsqueletico", "debilidadMuscular", "Generalizada")} />
                        <WordButton label="Localizada" isSelected={formValues.musculoEsqueletico.debilidadMuscular === "Localizada"} onClick={() => handleRadioChange("musculoEsqueletico", "debilidadMuscular", "Localizada")} />
                        <WordButton label="No" isSelected={formValues.musculoEsqueletico.debilidadMuscular === "No"} onClick={() => handleRadioChange("musculoEsqueletico", "debilidadMuscular", "No")} />
                      </div>
                    </div>
                    <div>
                      <Label>Limitaciones de Movimiento</Label>
                      {formValues.musculoEsqueletico.sintomasMusculoEsqueleticos.includes("Calambres musculares frecuentes") && (
                        <Textarea
                          placeholder="Escriba especificaciones relacionadas..."
                          value={formValues.musculoEsqueletico.limitacionesMovimiento}
                          onChange={(e) => handleTextChange("musculoEsqueletico", "limitacionesMovimiento", e.target.value)}
                          className="w-full p-2 border rounded-md mt-2"
                        />
                      )}
                     </div>
                   </div>
                  )}
                </div>

                 {/* SISTEMA NERVIOSO */}
                 <div className="bg-transparent/50 dark:bg-gray-900/50 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                   <div className="flex items-center justify-between mb-4">
                     <h4 className="text-lg font-semibold text-justify">Sistema Nervioso</h4>
                     <SintomasToggle 
                       checked={sintomasToggle.nervioso}
                       onChange={(checked) => handleSintomasToggle('nervioso', checked)}
                     />
                   </div>
                   {!sintomasToggle.nervioso && (
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Percepción de los Sentidos</Label>
                      <div className="flex flex-wrap mt-1">
                        <WordButton label="Sí" isSelected={formValues.nervioso.percepcionSentidos === "Sí"} onClick={() => handleRadioChange("nervioso", "percepcionSentidos", "Sí")} />
                        <WordButton label="No" isSelected={formValues.nervioso.percepcionSentidos === "No"} onClick={() => handleRadioChange("nervioso", "percepcionSentidos", "No")} />
                      </div>
                    </div>
                    <div>
                      <Label>Horas de Sueño</Label>
                      <div className="flex flex-wrap mt-1">
                        <WordButton label="Menos de 4" isSelected={formValues.nervioso.horasSueno === "Menos de 4"} onClick={() => handleRadioChange("nervioso", "horasSueno", "Menos de 4")} />
                        <WordButton label="4 a 6" isSelected={formValues.nervioso.horasSueno === "4 a 6"} onClick={() => handleRadioChange("nervioso", "horasSueno", "4 a 6")} />
                        <WordButton label="7 a 8" isSelected={formValues.nervioso.horasSueno === "7 a 8"} onClick={() => handleRadioChange("nervioso", "horasSueno", "7 a 8")} />
                        <WordButton label="Más de 8" isSelected={formValues.nervioso.horasSueno === "Más de 8"} onClick={() => handleRadioChange("nervioso", "horasSueno", "Más de 8")} />
                      </div>
                    </div>
                    <div>
                      <Label>Trastornos del Sueño</Label>
                      <div className="flex flex-wrap mt-1">
                        <WordButton label="Sí" isSelected={formValues.nervioso.trastornosSueno === "Sí"} onClick={() => handleRadioChange("nervioso", "trastornosSueno", "Sí")} />
                        <WordButton label="No" isSelected={formValues.nervioso.trastornosSueno === "No"} onClick={() => handleRadioChange("nervioso", "trastornosSueno", "No")} />
                      </div>
                      {formValues.nervioso.trastornosSueno === "Sí" && (
                        <Textarea
                          placeholder="Escriba especificaciones relacionadas..."
                          value={formValues.nervioso.trastornosSuenoEspecificaciones}
                          onChange={(e) => handleTextChange("nervioso", "trastornosSuenoEspecificaciones", e.target.value)}
                          className="w-full p-2 border rounded-md mt-2"
                        />
                      )}
                    </div>
                    <div>
                      <Label>Estado de Ánimo</Label>
                      <div className="flex flex-wrap mt-1">
                        <WordButton label="Tranquilo" isSelected={formValues.nervioso.estadoAnimo === "Tranquilo"} onClick={() => handleRadioChange("nervioso", "estadoAnimo", "Tranquilo")} />
                        <WordButton label="Irritable" isSelected={formValues.nervioso.estadoAnimo === "Irritable"} onClick={() => handleRadioChange("nervioso", "estadoAnimo", "Irritable")} />
                        <WordButton label="Aprensivo" isSelected={formValues.nervioso.estadoAnimo === "Aprensivo"} onClick={() => handleRadioChange("nervioso", "estadoAnimo", "Aprensivo")} />
                        <WordButton label="Alegre" isSelected={formValues.nervioso.estadoAnimo === "Alegre"} onClick={() => handleRadioChange("nervioso", "estadoAnimo", "Alegre")} />
                      </div>
                    </div>
                    <div>
                      <Label>Parestesias</Label>
                      <div className="flex flex-wrap mt-1">
                        <WordButton label="Sí" isSelected={formValues.nervioso.parestesias === "Sí"} onClick={() => handleRadioChange("nervioso", "parestesias", "Sí")} />
                        <WordButton label="No" isSelected={formValues.nervioso.parestesias === "No"} onClick={() => handleRadioChange("nervioso", "parestesias", "No")} />
                      </div>
                    </div>
                    <div>
                      <Label>Otros Síntomas Neurológicos</Label>
                      <div className="flex flex-wrap mt-1">
                        <WordButton label="Convulsiones" isSelected={formValues.nervioso.otrosSintomasNeurologicos.includes("Convulsiones")} onClick={() => handleCheckboxChange("nervioso", "otrosSintomasNeurologicos", "Convulsiones", !formValues.nervioso.otrosSintomasNeurologicos.includes("Convulsiones"))} />
                        <WordButton label="Temblores" isSelected={formValues.nervioso.otrosSintomasNeurologicos.includes("Temblores")} onClick={() => handleCheckboxChange("nervioso", "otrosSintomasNeurologicos", "Temblores", !formValues.nervioso.otrosSintomasNeurologicos.includes("Temblores"))} />
                        <WordButton label="Problemas de memoria o concentración" isSelected={formValues.nervioso.otrosSintomasNeurologicos.includes("Problemas de memoria o concentración")} onClick={() => handleCheckboxChange("nervioso", "otrosSintomasNeurologicos", "Problemas de memoria o concentración", !formValues.nervioso.otrosSintomasNeurologicos.includes("Problemas de memoria o concentración"))} />
                        <WordButton label="Cambios de personalidad o comportamiento" isSelected={formValues.nervioso.otrosSintomasNeurologicos.includes("Cambios de personalidad o comportamiento")} onClick={() => handleCheckboxChange("nervioso", "otrosSintomasNeurologicos", "Cambios de personalidad o comportamiento", !formValues.nervioso.otrosSintomasNeurologicos.includes("Cambios de personalidad o comportamiento"))} />
                        <WordButton label="Coordinación motora alterada" isSelected={formValues.nervioso.otrosSintomasNeurologicos.includes("Coordinación motora alterada")} onClick={() => handleCheckboxChange("nervioso", "otrosSintomasNeurologicos", "Coordinación motora alterada", !formValues.nervioso.otrosSintomasNeurologicos.includes("Coordinación motora alterada"))} />
                        <WordButton label="Ninguno" isSelected={formValues.nervioso.otrosSintomasNeurologicos.includes("Ninguno")} onClick={() => handleCheckboxChange("nervioso", "otrosSintomasNeurologicos", "Ninguno", !formValues.nervioso.otrosSintomasNeurologicos.includes("Ninguno"))} />
                      </div>
                     </div>
                   </div>
                  )}
                </div>

                 <div className="flex justify-center pt-4">
                  <Button onClick={generateAndUpdateRedacciones} className="bg-emerald-500 hover:bg-blue-600 text-white">
                    Generar Redacción IA
                  </Button>
                  <Button onClick={() => {
                    // Limpiar localStorage
                    localStorage.removeItem('interrogatorio-sistemas-formValues');
                    
                    setFormValues({
                      digestivo: {
                        alimentacion: "",
                        masticacion: "",
                        percepcionGusto: "",
                        percepcionGustoEspecificaciones: "",
                        salivacion: "",
                        deglusion: "",
                        halitosis: "",
                        halitosisEspecificaciones: "",
                        sintomasDigestivos: [],
                        cambiosApetito: "",
                        habitosAlimenticios: "",
                        colorEvacuaciones: "",
                        hematemesis: "",
                        frecuenciaEvacuacion: "",
                        frecuenciaEvacuacionEspecificaciones: ""
                      },
                      respiratorio: {
                        tipoRespiracion: "",
                        sintomasRespiratorios: [],
                        apneaSuenio: "",
                        oxigenoSuplementario: "",
                        tosExpectoracion: ""
                      },
                        cardiovascular: {
                          dolorToracico: "",
                          dolorToracicoDetalle: "",
                          lipotimia: "",
                          lipotimiaDetalle: "",
                          ritmoCardiaco: "",
                          ritmoCardiacoDetalle: "",
                          sintomasCardiovasculares: [],
                          sintomasCardiovascularesDetalle: "",
                          presionArterial: "",
                          antecedentesCardiovasculares: [],
                          antecedentesCardiovascularesDetalle: "",
                          capacidadFuncional: "",
                          capacidadFuncionalDetalle: "",
                          disnea: "",
                          disneaDetalle: "",
                          otrosAntecedentes: [],
                          otrosAntecedentesDetalle: ""
                        },
                      genitoUrinario: {
                        frecuenciaUrinaria: "",
                        sintomasUrinarios: [],
                        urgenciaUrinaria: "",
                        chorroUrinarioDebil: "",
                        chorroUrinarioIntermitente: "",
                        flujoVaginalUretral: "",
                        infeccionesUrinarias: "",
                        ultimaMenstruacion: "",
                        dismenorrea: "",
                        duracionMenstruacion: "",
                        ultimoParto: "",
                        antecedentesObstetricos: ""
                      },
                      endocrino: {
                        sintomasEndocrinos: [],
                        sudoracionNocturna: "",
                        hirsutismo: "",
                        galactorrea: "",
                        cambiosRitmoMenstrual: "",
                        cambiosPeso: "",
                        intolerancia: "",
                        condicionesEndocrinas: ""
                      },
                      tegumentario: {
                        cambiosColoracion: "",
                        cambiosColoracionEspecificaciones: "",
                        sintomasTegumentarios: [],
                        cambiosUnas: "",
                        cambiosLunares: "",
                        lesionesPigmentadas: ""
                      },
                      musculoEsqueletico: {
                        fracturas: "",
                        detallesFracturas: "",
                        sintomasMusculoEsqueleticos: [],
                        rigidezMatutina: "",
                        debilidadMuscular: "",
                        limitacionesMovimiento: ""
                      },
                      nervioso: {
                        percepcionSentidos: "",
                        horasSueno: "",
                        trastornosSueno: "",
                        trastornosSuenoEspecificaciones: "",
                        estadoAnimo: "",
                        parestesias: "",
                        otrosSintomasNeurologicos: []
                      }
                    });
                    setShowForm(true);
                  }} variant="outline" className="ml-4 flex items-center gap-2">
                    <Eraser className="w-4 h-4" />
                    Limpiar formulario
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Redacción IA */}
                <div className="bg-transparent dark:bg-gray-900 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="text-lg font-semibold">Aparato Digestivo</h4>
                    <button onClick={() => handleCopy('digestivo')} className="text-emerald-500 hover:text-blue-700 flex items-center gap-1">
                      {copied.digestivo ? (
                        <>
                          <CheckCircle className="w-4 h-4" />
                          <span className="text-xs">Copiado</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-4 h-4" />
                          <span className="text-xs">Copiar</span>
                        </>
                      )}
                    </button>
                  </div>
                  <AnimatedTextarea
                    content={redacciones.digestivo}
                    className="min-h-[150px] bg-white dark:bg-gray-800 p-3 rounded-md border border-gray-300 dark:border-gray-600 w-full resize-none text-sm"
                    readOnly
                    textAlign="justify"
                  />
                </div>

                <div className="bg-transparent dark:bg-gray-900 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="text-lg font-semibold">Aparato Respiratorio</h4>
                    <button onClick={() => handleCopy('respiratorio')} className="text-emerald-500 hover:text-blue-700 flex items-center gap-1">
                      {copied.respiratorio ? (
                        <>
                          <CheckCircle className="w-4 h-4" />
                          <span className="text-xs">Copiado</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-4 h-4" />
                          <span className="text-xs">Copiar</span>
                        </>
                      )}
                    </button>
                  </div>
                  <AnimatedTextarea
                    content={redacciones.respiratorio}
                    className="min-h-[150px] bg-white dark:bg-gray-800 p-3 rounded-md border border-gray-300 dark:border-gray-600 w-full resize-none text-sm"
                    readOnly
                    textAlign="justify"
                  />
                </div>

                <div className="bg-transparent dark:bg-gray-900 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="text-lg font-semibold">Aparato Cardiovascular</h4>
                    <button onClick={() => handleCopy('cardiovascular')} className="text-emerald-500 hover:text-blue-700 flex items-center gap-1">
                      {copied.cardiovascular ? (
                        <>
                          <CheckCircle className="w-4 h-4" />
                          <span className="text-xs">Copiado</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-4 h-4" />
                          <span className="text-xs">Copiar</span>
                        </>
                      )}
                    </button>
                  </div>
                  <AnimatedTextarea
                    content={redacciones.cardiovascular}
                    className="min-h-[150px] bg-white dark:bg-gray-800 p-3 rounded-md border border-gray-300 dark:border-gray-600 w-full resize-none text-sm"
                    readOnly
                    textAlign="justify"
                  />
                </div>

                <div className="bg-transparent dark:bg-gray-900 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="text-lg font-semibold">Aparato Genito-Urinario</h4>
                    <button onClick={() => handleCopy('genitoUrinario')} className="text-emerald-500 hover:text-blue-700 flex items-center gap-1">
                      {copied.genitoUrinario ? (
                        <>
                          <CheckCircle className="w-4 h-4" />
                          <span className="text-xs">Copiado</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-4 h-4" />
                          <span className="text-xs">Copiar</span>
                        </>
                      )}
                    </button>
                  </div>
                  <AnimatedTextarea
                    content={redacciones.genitoUrinario}
                    className="min-h-[150px] bg-white dark:bg-gray-800 p-3 rounded-md border border-gray-300 dark:border-gray-600 w-full resize-none text-sm"
                    readOnly
                    textAlign="justify"
                  />
                </div>

                <div className="bg-transparent dark:bg-gray-900 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="text-lg font-semibold">Sistema Endocrino</h4>
                    <button onClick={() => handleCopy('endocrino')} className="text-emerald-500 hover:text-blue-700 flex items-center gap-1">
                      {copied.endocrino ? (
                        <>
                          <CheckCircle className="w-4 h-4" />
                          <span className="text-xs">Copiado</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-4 h-4" />
                          <span className="text-xs">Copiar</span>
                        </>
                      )}
                    </button>
                  </div>
                  <AnimatedTextarea
                    content={redacciones.endocrino}
                    className="min-h-[150px] bg-white dark:bg-gray-800 p-3 rounded-md border border-gray-300 dark:border-gray-600 w-full resize-none text-sm"
                    readOnly
                    textAlign="justify"
                  />
                </div>

                <div className="bg-transparent dark:bg-gray-900 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="text-lg font-semibold">Sistema Tegumentario</h4>
                    <button onClick={() => handleCopy('tegumentario')} className="text-emerald-500 hover:text-blue-700 flex items-center gap-1">
                      {copied.tegumentario ? (
                        <>
                          <CheckCircle className="w-4 h-4" />
                          <span className="text-xs">Copiado</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-4 h-4" />
                          <span className="text-xs">Copiar</span>
                        </>
                      )}
                    </button>
                  </div>
                  <AnimatedTextarea
                    content={redacciones.tegumentario}
                    className="min-h-[150px] bg-white dark:bg-gray-800 p-3 rounded-md border border-gray-300 dark:border-gray-600 w-full resize-none text-sm"
                    readOnly
                    textAlign="justify"
                  />
                </div>

                <div className="bg-transparent dark:bg-gray-900 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="text-lg font-semibold">Sistema Músculo-Esquelético</h4>
                    <button onClick={() => handleCopy('musculoEsqueletico')} className="text-emerald-500 hover:text-blue-700 flex items-center gap-1">
                      {copied.musculoEsqueletico ? (
                        <>
                          <CheckCircle className="w-4 h-4" />
                          <span className="text-xs">Copiado</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-4 h-4" />
                          <span className="text-xs">Copiar</span>
                        </>
                      )}
                    </button>
                  </div>
                  <AnimatedTextarea
                    content={redacciones.musculoEsqueletico}
                    className="min-h-[150px] bg-white dark:bg-gray-800 p-3 rounded-md border border-gray-300 dark:border-gray-600 w-full resize-none text-sm"
                    readOnly
                    textAlign="justify"
                  />
                </div>

                <div className="bg-transparent dark:bg-gray-900 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="text-lg font-semibold">Sistema Nervioso</h4>
                    <button onClick={() => handleCopy('nervioso')} className="text-emerald-500 hover:text-blue-700 flex items-center gap-1">
                      {copied.nervioso ? (
                        <>
                          <CheckCircle className="w-4 h-4" />
                          <span className="text-xs">Copiado</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-4 h-4" />
                          <span className="text-xs">Copiar</span>
                        </>
                      )}
                    </button>
                  </div>
                  <AnimatedTextarea
                    content={redacciones.nervioso}
                    className="min-h-[150px] bg-white dark:bg-gray-800 p-3 rounded-md border border-gray-300 dark:border-gray-600 w-full resize-none text-sm"
                    readOnly
                    textAlign="justify"
                  />
                </div>

                <div className="flex justify-center">
                  <Button onClick={() => setShowForm(true)} variant="outline" className="text-emerald-500 border-emerald-500">
                    Volver al Formulario
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

// Componente WordButton para reemplazar los checkboxes
const WordButton = ({
  label,
  isSelected,
  onClick
}: {
  label: string;
  isSelected: boolean;
  onClick: () => void;
}) => {
  return <button onClick={onClick} className={`px-2 py-1 text-xs rounded-md transition-colors mb-1 mr-1 ${isSelected ? "bg-blue-100 text-blue-700 dark:bg-blue-800 dark:text-blue-200" : "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"}`}>
      {label}
    </button>;
};

export default InterrogatorioSistemas;
