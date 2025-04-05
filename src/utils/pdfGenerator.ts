import jsPDF from 'jspdf';
import { FormDataState } from '@/types/historiaClinica';

// Mapeo de claves de sección a sus títulos
const SECTION_TITLES = {
  padecimientoActual: 'I. PADECIMIENTO ACTUAL',
  antecedentesHeredoFamiliares: 'II. ANTECEDENTES HEREDO FAMILIARES',
  antecedentesPersonalesNoPatologicos: 'III. ANTECEDENTES PERSONALES NO PATOLÓGICOS',
  antecedentesPersonalesPatologicos: 'IV. ANTECEDENTES PERSONALES PATOLÓGICOS',
  antecedentesAlergicos: 'V. ANTECEDENTES ALÉRGICOS',
  antecedentesQuirurgicos: 'VI. ANTECEDENTES QUIRÚRGICOS',
  antecedentesHemorragicos: 'VII. ANTECEDENTES HEMORRAGICOS',
  interrogatorioSistemas: 'VIII. INTERROGATORIO POR SISTEMAS',
  exploracionFisica: 'IX. EXPLORACIÓN FÍSICA',
  examenCabeza: 'X. EXAMEN DE CABEZA',
  articulacionCraneomandibular: 'XI. ARTICULACIÓN CRANEOMANDIBULAR',
  examenCuello: 'XII. EXAMEN DE CUELLO',
  examenIntrabucal: 'XIII. EXAMEN INTRABUCAL',
  glandulasSalivales: 'XIV. GLÁNDULAS SALIVALES',
  oclusion: 'XV. OCLUSIÓN',
  relacionDientes: 'XVI. RELACIÓN DE DIENTES',
  lineaMedia: 'XVII. LÍNEA MEDIA',
  frenillos: 'XVIII. FRENILLOS',
  diagnostico: 'XIX. DIAGNÓSTICO',
  pronostico: 'XX. PRONÓSTICO'
};

// Subtítulos para secciones específicas
const SUBTITLES = {
  padecimientoActual: {
    motivoConsulta: 'Motivo de consulta',
    historiaPadecimiento: 'Historia del padecimiento'
  },
  antecedentesPersonalesNoPatologicos: {
    serviciosDomiciliarios: 'Servicios Domiciliarios',
    higieneVivienda: 'Higiene de la Vivienda',
    higienePersonal: 'Higiene Personal',
    higieneBucal: 'Higiene Bucal',
    alimentacion: 'Alimentación'
  },
  antecedentesPersonalesPatologicos: {
    nutricionales: 'Nutricionales',
    cardiacos: 'Cardíacos',
    hepaticos: 'Hepáticos',
    enfermedadesTransmisionSexual: 'Enfermedades de Transmisión Sexual',
    enfermedadesEruptivas: 'Enfermedades Eruptivas de la Infancia',
    pulmonares: 'Pulmonares',
    infecciosasParasitarias: 'Enfermedades Infecciosas y Parasitarias',
    otrosPadecimientos: 'Otros Padecimientos Sistémicos'
  }
};

// Ruta del logo
const LOGO_PATH = '/lovable-uploads/7898fc25-0e62-40e1-a139-6582324afb27.png';

export const generatePDF = (
  formData: FormDataState,
  nombrePaciente: string,
  sectionRedactions: { [key: string]: string } = {}
) => {
  console.log("Generando PDF con redacciones:", Object.keys(sectionRedactions));

  const doc = new jsPDF();

  // Establecer márgenes de página
  const margin = 20;
  const pageWidth = doc.internal.pageSize.width;
  const contentWidth = pageWidth - (2 * margin);

  // Agregar logo
  try {
    doc.addImage(LOGO_PATH, 'PNG', pageWidth / 2 - 15, 10, 30, 30);
  } catch (error) {
    console.error('Error al agregar el logo:', error);
  }

  // Agregar título
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.text('HISTORIA CLÍNICA', pageWidth / 2, 50, { align: 'center' });

  // Agregar texto "Dental Basics Academy"
  doc.setFontSize(12);
  doc.text('Dental Basics Academy', pageWidth / 2, 58, { align: 'center' });

  // Agregar nombre del paciente si está disponible
  if (nombrePaciente) {
    doc.setFontSize(12);
    doc.text(`Paciente: ${nombrePaciente}`, pageWidth / 2, 66, { align: 'center' });
  }

  // Agregar fecha
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text(`Fecha: ${new Date().toLocaleDateString()}`, pageWidth / 2, 74, { align: 'center' });

  let yPos = 85; // Comenzar el contenido más abajo para dar espacio al encabezado

  // Función para limpiar el contenido del texto
  const cleanContent = (content: string): string => {
    let cleanedText = content
      .replace(/FormularioRedacción IA|Formulario|Redacción IA|Copiar|Volver al formulario|Generar Redacción IA|Generar Informe IA/gi, '')
      .replace(/\n\s*\n/g, '\n') // Eliminar múltiples líneas vacías
      .trim();

    return cleanedText;
  };

  // Función para verificar si se necesita una nueva página
  const checkNewPage = (neededSpace: number) => {
    if (yPos + neededSpace > doc.internal.pageSize.height - margin) {
      doc.addPage();
      yPos = margin + 10;
      return true;
    }
    return false;
  };

  // Función para agregar una sección con título y contenido
  const addSection = (title: string, content: string, sectionKey?: string) => {
    if (!content) {
      console.warn(`No hay contenido para la sección: ${title}`);
      return;
    }

    // Limpiar contenido
    const cleanText = cleanContent(content);

    // Verificar si se necesita una nueva página para el título de la sección
    checkNewPage(10);

    // Agregar título de la sección
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.text(title, margin, yPos);
    yPos += 8;

    // Si esta sección tiene manejo específico de subtítulos
    if (sectionKey && SUBTITLES[sectionKey as keyof typeof SUBTITLES]) {
      // Procesar con subtítulos
      addContentWithSubtitles(cleanText, sectionKey, formData);
    } else {
      // Contenido regular
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(10);

      // Aplicar espaciado adecuado para el texto justificado
      const textLines = doc.splitTextToSize(cleanText, contentWidth - 10);

      // Agregar cada línea con la justificación adecuada
      doc.text(textLines, margin, yPos);
      yPos += textLines.length * 6 + 10;
    }
  };

  // Función para manejar secciones con subtítulos
  const addContentWithSubtitles = (content: string, sectionKey: string, formData: FormDataState) => {
    const subtitles = SUBTITLES[sectionKey as keyof typeof SUBTITLES];

    if (sectionKey === 'antecedentesPersonalesNoPatologicos') {
      const antecedentes = formData.antecedentesPersonalesNoPatologicos;

      // Mapeo de subtítulos a campos de datos
      const subtitleMapping = {
        serviciosDomiciliarios: `El paciente habita en una vivienda de tipo ${antecedentes.tipoVivienda}, construida principalmente con ${antecedentes.materialVivienda}. Cuenta con los siguientes servicios básicos: ${antecedentes.servicios.join(', ')}. La condición de la calle en la que se encuentra la vivienda es ${antecedentes.condicionCalle}, y la iluminación en la vía pública es ${antecedentes.iluminacionCalle}, lo que puede influir en la seguridad y accesibilidad del entorno.`,
        higieneVivienda: `El mantenimiento del hogar se realiza con una frecuencia ${antecedentes.frecuenciaLimpieza}, lo que impacta directamente en la salubridad del entorno. La ropa de cama se cambia ${antecedentes.cambioRopaCama}, contribuyendo a la higiene y confort del paciente. Se observa ${antecedentes.hacinamiento} de hacinamiento, lo que puede influir en la calidad de vida y bienestar de los habitantes. Asimismo, ${antecedentes.promiscuidad} hay evidencia de promiscuidad, lo cual puede ser relevante en la evaluación de riesgos sanitarios y epidemiológicos. En el domicilio ${antecedentes.mascotas} se observan animales en el domicilio, lo que puede representar un factor de exposición a zoonosis u otras afecciones. En cuanto al manejo de residuos, ${antecedentes.manejoResiduos}, lo que influye en la prevención de enfermedades y el control ambiental.`,
        higienePersonal: `El paciente refiere una frecuencia de baño ${antecedentes.frecuenciaBano}, lo que contribuye a la higiene general y prevención de infecciones cutáneas. Presenta hábitos de higiene de manos ${antecedentes.lavadoManos.join(', ')}, lo que es un factor clave en la prevención de enfermedades de transmisión feco-oral. El cambio de ropa se realiza ${antecedentes.cambioRopa}, aspecto importante en el mantenimiento de la higiene personal.`,
        higieneBucal: `El paciente refiere un cepillado dental con una frecuencia ${antecedentes.frecuenciaCepillado}, utilizando técnica ${antecedentes.tecnicaCepillado}, lo que influye directamente en la salud periodontal y la prevención de caries. Además, complementa su higiene bucal con ${antecedentes.auxiliaresBucales.join(', ')}. La última visita al odontólogo fue hace ${antecedentes.ultimaVisitaOdontologo}, lo que permite evaluar su acceso a la atención odontológica y el seguimiento de su salud bucal. Actualmente, refiere ${antecedentes.problemasBucales.join(', ')}.`,
        alimentacion: `El paciente tiene una alimentación basada en ${antecedentes.alimentosConsumidos.join(', ')}. El consumo de frutas y verduras es ${antecedentes.frecuenciaFrutasVerduras}, mientras que la ingesta de bebidas azucaradas ocurre ${antecedentes.frecuenciaBebidasAzucaradas} y el consumo de comida chatarra ${antecedentes.frecuenciaComidaChatarra}, factores determinantes en el riesgo de enfermedades metabólicas y caries dental. La cantidad de agua ingerida diariamente es de aproximadamente ${antecedentes.consumoAgua}, contribuyendo a la hidratación y función renal. Realiza ${antecedentes.numeroComidas} comidas al día, con los siguientes horarios reportados:

Desayuno: ${antecedentes.horarioComidas.desayuno}
Almuerzo: ${antecedentes.horarioComidas.almuerzo}
Cena: ${antecedentes.horarioComidas.cena}`
      };

      // Agregar cada subtítulo y su contenido
      Object.entries(subtitleMapping).forEach(([subtitleKey, subtitleContent]) => {
        checkNewPage(15);

        doc.setFont('helvetica', 'bold');
        doc.setFontSize(11);
        doc.text(subtitles[subtitleKey as keyof typeof subtitles], margin, yPos);
        yPos += 6;

        doc.setFont('helvetica', 'normal');
        doc.setFontSize(10);
        const textLines = doc.splitTextToSize(subtitleContent, contentWidth - 10);
        doc.text(textLines, margin, yPos);
        yPos += textLines.length * 6 + 8;
      });

      return;
    }

    // Para otras secciones con subtítulos (como antecedentes)
    const subtitleKeys = Object.keys(subtitles);

    for (const key of subtitleKeys) {
      const subtitleText = subtitles[key as keyof typeof subtitles];

      let subtitleRegex = new RegExp(`${subtitleText}[:\\s]+(.*?)(?=(?:${Object.values(subtitles).join('|')})[:\\s]+|$)`, 'si');
      let match = content.match(subtitleRegex);

      if (!match) {
        subtitleRegex = new RegExp(`${subtitleText}[:\\s]+(.*?)(?=\\n\\s*\\n|$)`, 'si');
        match = content.match(subtitleRegex);
      }

      if (match && match[1]) {
        checkNewPage(15);

        doc.setFont('helvetica', 'bold');
        doc.setFontSize(11);
        doc.text(subtitleText, margin, yPos);
        yPos += 6;

        doc.setFont('helvetica', 'normal');
        doc.setFontSize(10);
        const subcontent = match[1].trim();
        const textLines = doc.splitTextToSize(subcontent, contentWidth - 10);
        doc.text(textLines, margin, yPos);
        yPos += textLines.length * 6 + 8;
      }
    }

    if (yPos === 8) {
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(10);
      const textLines = doc.splitTextToSize(content, contentWidth - 10);
      doc.text(textLines, margin, yPos);
      yPos += textLines.length * 6 + 10;
    }
  };

  // Agregar cada sección al PDF si tiene contenido
  Object.entries(sectionRedactions).forEach(([key, content]) => {
    if (content && SECTION_TITLES[key]) {
      console.log(`Agregando sección ${SECTION_TITLES[key]} al PDF`);
      addSection(SECTION_TITLES[key], content, key);
    }
  });

  // Guardar el PDF
  const filename = `Historia_Clinica_${nombrePaciente.replace(/\s+/g, '_')}_${new Date().toISOString().slice(0, 10)}.pdf`;
  doc.save(filename);
};
