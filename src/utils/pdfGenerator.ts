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
      addContentWithSubtitles(cleanText, sectionKey);
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
  const addContentWithSubtitles = (content: string, sectionKey: string) => {
    const subtitles = SUBTITLES[sectionKey as keyof typeof SUBTITLES];

    // Manejo especial para la sección "Padecimiento Actual"
    if (sectionKey === 'padecimientoActual') {
      const motivoMatch = content.match(/Motivo de consulta:([\s\S]*?)(?=Historia del padecimiento:|$)/i);
      const historiaMatch = content.match(/Historia del padecimiento:([\s\S]*?)$/i);

      if (motivoMatch && motivoMatch[1]) {
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(11);
        doc.text('Motivo de consulta', margin, yPos);
        yPos += 6;

        doc.setFont('helvetica', 'normal');
        doc.setFontSize(10);
        const motivoContent = motivoMatch[1].trim();
        const motivoLines = doc.splitTextToSize(motivoContent, contentWidth - 10);
        doc.text(motivoLines, margin, yPos);
        yPos += motivoLines.length * 6 + 8;
      }

      if (historiaMatch && historiaMatch[1]) {
        checkNewPage(15);
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(11);
        doc.text('Historia del padecimiento', margin, yPos);
        yPos += 6;

        doc.setFont('helvetica', 'normal');
        doc.setFontSize(10);
        const historiaContent = historiaMatch[1].trim();
        const historiaLines = doc.splitTextToSize(historiaContent, contentWidth - 10);
        doc.text(historiaLines, margin, yPos);
        yPos += historiaLines.length * 6 + 10;
      }

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
