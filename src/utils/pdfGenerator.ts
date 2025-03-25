
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
  antecedentesPersonalesNoPatologicos: {
    serviciosDomiciliarios: 'Servicios Domiciliarios',
    higieneVivienda: 'Higiene de la Vivienda',
    higienePersonal: 'Higiene Personal',
    higieneBucal: 'Higiene Bucal',
    alimentacion: 'Alimentación'
  },
  antecedentesPersonalesPatologicos: {
    enfermedadesCronicas: 'Enfermedades Crónicas',
    enfermedadesRecientes: 'Enfermedades Recientes',
    hospitalizaciones: 'Hospitalizaciones',
    transfusiones: 'Transfusiones'
  }
};

export const generatePDF = (
  formData: FormDataState, 
  nombrePaciente: string,
  sectionRedactions: { [key: string]: string } = {}
) => {
  console.log("Generating PDF with redactions:", Object.keys(sectionRedactions));
  
  const doc = new jsPDF();
  
  // Set page margins
  const margin = 10; // Adjust as needed
  const pageWidth = doc.internal.pageSize.width;
  const contentWidth = pageWidth - (2 * margin);
  
  // Add title
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.text('HISTORIA CLÍNICA', pageWidth / 2, 20, { align: 'center' });
  
  // Add patient name if available
  if (nombrePaciente) {
    doc.setFontSize(12);
    doc.text(`Paciente: ${nombrePaciente}`, pageWidth / 2, 30, { align: 'center' });
  }
  
  // Add date
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text(`Fecha: ${new Date().toLocaleDateString()}`, pageWidth / 2, 38, { align: 'center' });
  
  let yPos = 50;
  
  // Function to clean the text content
  const cleanContent = (content: string): string => {
    // Remove unwanted text
    let cleanedText = content
      .replace(/FormularioRedacción IA|Formulario|Redacción IA|Copiar|Volver al formulario|Generar Redacción IA|Generar Informe IA/gi, '')
      .replace(/\n\s*\n/g, '\n') // Remove multiple empty lines
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
    
    // If this section requires subtitles, process it differently
    if (sectionKey && (sectionKey === 'antecedentesPersonalesNoPatologicos' || sectionKey === 'antecedentesPersonalesPatologicos')) {
      // Process with subtitles
      addContentWithSubtitles(cleanText, sectionKey);
    } else {
      // Regular content
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9);
      
      // Text alignment - justified
      const textLines = doc.splitTextToSize(cleanText, contentWidth);
      doc.text(textLines, margin, yPos, { align: 'justify' });
      yPos += textLines.length * 5 + 10; // Spacing between sections
    }
  };
  
  // Function to handle sections with subtitles
  const addContentWithSubtitles = (content: string, sectionKey: string) => {
    const subtitles = SUBTITLES[sectionKey as keyof typeof SUBTITLES];
    let remainingContent = content;
    
    // For each subtitle, try to find and extract the content
    Object.entries(subtitles).forEach(([_, subtitleText]) => {
      // Find the subtitle in the content
      const subtitlePattern = new RegExp(`${subtitleText}\\s*[:\\n]?\\s*([\\s\\S]*?)(?=\\s*(?:${Object.values(subtitles).join('|')})|$)`, 'i');
      const match = remainingContent.match(subtitlePattern);
      
      if (match && match[1]) {
        // Check if we need a new page
        checkNewPage(15);
        
        // Add subtitle
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(10);
        doc.text(subtitleText, margin, yPos);
        yPos += 7;
        
        // Add content for this subtitle
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(9);
        const subcontent = match[1].trim();
        const textLines = doc.splitTextToSize(subcontent, contentWidth);
        doc.text(textLines, margin, yPos, { align: 'justify' });
        yPos += textLines.length * 5 + 7; // Space after subtitle content
        
        // Remove processed content
        remainingContent = remainingContent.replace(match[0], '');
      }
    });
    
    // If there's any remaining content not matched by subtitles, add it
    if (remainingContent.trim()) {
      checkNewPage(10);
      const textLines = doc.splitTextToSize(remainingContent.trim(), contentWidth);
      doc.text(textLines, margin, yPos, { align: 'justify' });
      yPos += textLines.length * 5 + 10;
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
