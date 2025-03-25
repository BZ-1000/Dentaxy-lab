
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

export const generatePDF = (
  formData: FormDataState, 
  nombrePaciente: string,
  sectionRedactions: { [key: string]: string } = {}
) => {
  console.log("Generating PDF with redactions:", Object.keys(sectionRedactions));
  
  const doc = new jsPDF();
  
  // Add title
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(18);
  doc.text('HISTORIA CLÍNICA', doc.internal.pageSize.width / 2, 20, { align: 'center' });
  
  // Add patient name if available
  if (nombrePaciente) {
    doc.setFontSize(14);
    doc.text(`Paciente: ${nombrePaciente}`, doc.internal.pageSize.width / 2, 30, { align: 'center' });
  }
  
  // Add date
  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');
  doc.text(`Fecha: ${new Date().toLocaleDateString()}`, doc.internal.pageSize.width / 2, 38, { align: 'center' });
  
  let yPos = 50;
  
  // Function to check if we need a new page
  const checkNewPage = (neededSpace: number) => {
    if (yPos + neededSpace > doc.internal.pageSize.height - 20) {
      doc.addPage();
      yPos = 20;
      return true;
    }
    return false;
  };
  
  // Function to add a section with title
  const addSection = (title: string, content: string) => {
    if (!content) {
      console.warn(`No content for section: ${title}`);
      return;
    }
    
    // Clean up HTML tags from content if present
    const cleanText = content.replace(/<\/?[^>]+(>|$)/g, "");
    const lines = doc.splitTextToSize(cleanText, 180);
    
    // Check if we need a new page (title + content + spacing)
    checkNewPage(10 + lines.length * 7 + 10);
    
    // Add section title
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.text(title, 14, yPos);
    yPos += 10;
    
    // Add section content
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.text(lines, 14, yPos);
    yPos += lines.length * 6 + 10;
  };
  
  // Add each section to the PDF if it has content
  Object.entries(sectionRedactions).forEach(([key, content]) => {
    if (content && SECTION_TITLES[key]) {
      console.log(`Adding section ${SECTION_TITLES[key]} to PDF`);
      addSection(SECTION_TITLES[key], content);
    }
  });
  
  // Save the PDF
  const filename = `Historia_Clinica_${nombrePaciente.replace(/\s+/g, '_')}_${new Date().toISOString().slice(0, 10)}.pdf`;
  doc.save(filename);
};
