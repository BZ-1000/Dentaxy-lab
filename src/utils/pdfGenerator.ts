
import jsPDF from 'jspdf';
import { FormDataState } from '@/types/historiaClinica';

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
  
  // Define all sections with their titles and content keys
  const sections = [
    { title: 'I. PADECIMIENTO ACTUAL', key: 'padecimientoActual' },
    { title: 'II. ANTECEDENTES HEREDO FAMILIARES', key: 'antecedentesHeredoFamiliares' },
    { title: 'III. ANTECEDENTES PERSONALES NO PATOLÓGICOS', key: 'antecedentesPersonalesNoPatologicos' },
    { title: 'IV. ANTECEDENTES PERSONALES PATOLÓGICOS', key: 'antecedentesPersonalesPatologicos' },
    { title: 'V. ANTECEDENTES ALÉRGICOS', key: 'antecedentesAlergicos' },
    { title: 'VI. ANTECEDENTES QUIRÚRGICOS', key: 'antecedentesQuirurgicos' },
    { title: 'VII. ANTECEDENTES HEMORRAGICOS', key: 'antecedentesHemorragicos' },
    { title: 'VIII. INTERROGATORIO POR SISTEMAS', key: 'interrogatorioSistemas' },
    { title: 'IX. EXPLORACIÓN FÍSICA', key: 'exploracionFisica' },
    { title: 'X. EXAMEN DE CABEZA', key: 'examenCabeza' },
    { title: 'XI. ARTICULACIÓN CRANEOMANDIBULAR', key: 'articulacionCraneomandibular' },
    { title: 'XII. EXAMEN DE CUELLO', key: 'examenCuello' },
    { title: 'XIII. EXAMEN INTRABUCAL', key: 'examenIntrabucal' },
    { title: 'XIV. GLÁNDULAS SALIVALES', key: 'glandulasSalivales' },
    { title: 'XV. OCLUSIÓN', key: 'oclusion' },
    { title: 'XVI. RELACIÓN DE DIENTES', key: 'relacionDientes' },
    { title: 'XVII. LÍNEA MEDIA', key: 'lineaMedia' },
    { title: 'XVIII. FRENILLOS', key: 'frenillos' },
    { title: 'XIX. DIAGNÓSTICO', key: 'diagnostico' },
    { title: 'XX. PRONÓSTICO', key: 'pronostico' }
  ];
  
  // Add each section to the PDF if it has content
  let sectionsAdded = 0;
  sections.forEach(section => {
    const content = sectionRedactions[section.key];
    if (content) {
      console.log(`Adding section ${section.title} to PDF`);
      addSection(section.title, content);
      sectionsAdded++;
    }
  });
  
  if (sectionsAdded === 0) {
    // If no sections added, add a message about missing content
    doc.setFont('helvetica', 'italic');
    doc.setFontSize(12);
    doc.text("No se encontró contenido redactado para incluir en el PDF. Por favor, asegúrese de generar las redacciones de las secciones del formulario.", 14, yPos, { maxWidth: 180 });
  }
  
  // Save the PDF
  const filename = `Historia_Clinica_${nombrePaciente.replace(/\s+/g, '_')}_${new Date().toISOString().slice(0, 10)}.pdf`;
  doc.save(filename);
};
