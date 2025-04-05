
import jsPDF from 'jspdf';
import { FormDataState } from '@/types/historiaClinica';

// Mapping of section keys to their titles
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

// Subtitles for specific sections
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

// Logo path - this would be the path to your logo
const LOGO_PATH = '/lovable-uploads/7898fc25-0e62-40e1-a139-6582324afb27.png';

export const generatePDF = (
  formData: FormDataState, 
  nombrePaciente: string,
  sectionRedactions: { [key: string]: string } = {}
) => {
  console.log("Generating PDF with redactions:", Object.keys(sectionRedactions));
  
  const doc = new jsPDF();
  
  // Set page margins - increased for better readability
  const margin = 20; // Increased from 10 to 20
  const pageWidth = doc.internal.pageSize.width;
  const contentWidth = pageWidth - (2 * margin);
  
  // Add logo
  try {
    doc.addImage(LOGO_PATH, 'PNG', pageWidth / 2 - 15, 10, 30, 30);
  } catch (error) {
    console.error('Error adding logo:', error);
    // Continue without logo if there's an error
  }
  
  // Add title with more spacing after logo
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.text('HISTORIA CLÍNICA', pageWidth / 2, 50, { align: 'center' });
  
  // Add "Dental Basics Academy" text
  doc.setFontSize(12);
  doc.text('Dental Basics Academy', pageWidth / 2, 58, { align: 'center' });
  
  // Add patient name if available
  if (nombrePaciente) {
    doc.setFontSize(12);
    doc.text(`Paciente: ${nombrePaciente}`, pageWidth / 2, 66, { align: 'center' });
  }
  
  // Add date
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text(`Fecha: ${new Date().toLocaleDateString()}`, pageWidth / 2, 74, { align: 'center' });
  
  let yPos = 85; // Start content lower to make room for the header
  
  // Function to clean the text content
  const cleanContent = (content: string): string => {
    // Remove unwanted text and patterns
    let cleanedText = content
      .replace(/FormularioRedacción IA|Formulario|Redacción IA|Copiar|Volver al formulario|Generar Redacción IA|Generar Informe IA/gi, '')
      .replace(/\n\s*\n/g, '\n') // Remove multiple empty lines
      .replace(/III\.\s*ANTECEDENTES\s*PERSONALES\s*NO\s*PATOLÓGICOS/gi, '') // Remove repeated section title
      .replace(/IV\.\s*ANTECEDENTES\s*PERSONALES\s*PATOLÓGICOS/gi, '') // Remove repeated section title
      .trim();
    
    return cleanedText;
  };
  
  // Function to check if we need a new page
  const checkNewPage = (neededSpace: number) => {
    if (yPos + neededSpace > doc.internal.pageSize.height - margin) {
      doc.addPage();
      yPos = margin + 10;
      return true;
    }
    return false;
  };
  
  // Function to add a section with title and content
  const addSection = (title: string, content: string, sectionKey?: string) => {
    if (!content) {
      console.warn(`No content for section: ${title}`);
      return;
    }
    
    // Clean up content
    const cleanText = cleanContent(content);
    
    // Check if we need a new page for the section title
    checkNewPage(10);
    
    // Add section title
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.text(title, margin, yPos);
    yPos += 8;
    
    // If this section has specific subtitle handling
    if (sectionKey && SUBTITLES[sectionKey as keyof typeof SUBTITLES]) {
      // Process with subtitles
      addContentWithSubtitles(cleanText, sectionKey);
    } else {
      // Regular content
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(10); // Increased from 9 to 10
      
      // Apply proper word spacing for justified text
      const textLines = doc.splitTextToSize(cleanText, contentWidth - 10); // Reduced width slightly to prevent word cutting
      
      // Add each line with proper justification
      doc.text(textLines, margin, yPos);
      yPos += textLines.length * 6 + 10; // Increased line spacing from 5 to 6
    }
  };
  
  // Function to handle sections with subtitles
  const addContentWithSubtitles = (content: string, sectionKey: string) => {
    const subtitles = SUBTITLES[sectionKey as keyof typeof SUBTITLES];
    
    // Special handling for Padecimiento Actual section
    if (sectionKey === 'padecimientoActual') {
      // Split content by "Motivo de consulta:" and "Historia del padecimiento:"
      const motivoMatch = content.match(/Motivo de consulta:([\s\S]*?)(?=Historia del padecimiento:|$)/i);
      const historiaMatch = content.match(/Historia del padecimiento:([\s\S]*?)$/i);
      
      if (motivoMatch && motivoMatch[1]) {
        // Add "Motivo de consulta" subtitle
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(11);
        doc.text('Motivo de consulta', margin, yPos);
        yPos += 6;
        
        // Add the motivo content
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(10);
        const motivoContent = motivoMatch[1].trim();
        const motivoLines = doc.splitTextToSize(motivoContent, contentWidth - 10);
        doc.text(motivoLines, margin, yPos);
        yPos += motivoLines.length * 6 + 8;
      }
      
      if (historiaMatch && historiaMatch[1]) {
        // Add "Historia del padecimiento" subtitle
        checkNewPage(15);
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(11);
        doc.text('Historia del padecimiento', margin, yPos);
        yPos += 6;
        
        // Add the historia content
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(10);
        const historiaContent = historiaMatch[1].trim();
        const historiaLines = doc.splitTextToSize(historiaContent, contentWidth - 10);
        doc.text(historiaLines, margin, yPos);
        yPos += historiaLines.length * 6 + 10;
      }
      
      return;
    }
    
    // For other sections with subtitles (like antecedentes)
    const subtitleKeys = Object.keys(subtitles);
    
    // Try to extract subsections based on subtitles
    for (const key of subtitleKeys) {
      const subtitleText = subtitles[key as keyof typeof subtitles];
      
      // Find the subtitle in the content and its corresponding text
      let subtitleRegex = new RegExp(`${subtitleText}[:\\s]+(.*?)(?=(?:${Object.values(subtitles).join('|')})[:\\s]+|$)`, 'si');
      let match = content.match(subtitleRegex);
      
      if (!match) {
        // Try an alternate regex pattern if first one fails
        subtitleRegex = new RegExp(`${subtitleText}[:\\s]+(.*?)(?=\\n\\s*\\n|$)`, 'si');
        match = content.match(subtitleRegex);
      }
      
      if (match && match[1]) {
        // Check if we need a new page
        checkNewPage(15);
        
        // Add subtitle
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(11);
        doc.text(subtitleText, margin, yPos);
        yPos += 6;
        
        // Add content
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(10);
        const subcontent = match[1].trim();
        const textLines = doc.splitTextToSize(subcontent, contentWidth - 10);
        doc.text(textLines, margin, yPos);
        yPos += textLines.length * 6 + 8; // Space between subtitle sections
      }
    }
    
    // If we couldn't find any matching subtitles, add the entire content
    if (yPos === 8) { // If y position hasn't changed, we didn't add any content
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(10);
      const textLines = doc.splitTextToSize(content, contentWidth - 10);
      doc.text(textLines, margin, yPos);
      yPos += textLines.length * 6 + 10;
    }
  };
  
  // Add each section to the PDF if it has content
  Object.entries(sectionRedactions).forEach(([key, content]) => {
    if (content && SECTION_TITLES[key]) {
      console.log(`Adding section ${SECTION_TITLES[key]} to PDF`);
      addSection(SECTION_TITLES[key], content, key);
    }
  });
  
  // Save the PDF
  const filename = `Historia_Clinica_${nombrePaciente.replace(/\s+/g, '_')}_${new Date().toISOString().slice(0, 10)}.pdf`;
  doc.save(filename);
};
