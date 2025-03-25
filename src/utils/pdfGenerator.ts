
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
    { title: 'II. ANTECEDENTES HEREDO FAMILIARES', key: 'AntecedentesHeredoFamiliares' },
    { title: 'III. ANTECEDENTES PERSONALES NO PATOLÓGICOS', key: 'AntecedentesPersonalesNoPatologicos' },
    { title: 'IV. ANTECEDENTES PERSONALES PATOLÓGICOS', key: 'AntecedentesPersonalesPatologicos' },
    { title: 'V. ANTECEDENTES ALÉRGICOS', key: 'AntecedentesAlergicos' },
    { title: 'VI. ANTECEDENTES QUIRÚRGICOS', key: 'AntecedentesQuirurgicos' },
    { title: 'VII. ANTECEDENTES HEMORRAGICOS', key: 'AntecedentesHemorragicos' },
    { title: 'VIII. INTERROGATORIO POR SISTEMAS', key: 'InterrogatorioSistemas' },
    { title: 'IX. EXPLORACIÓN FÍSICA', key: 'ExploracionFisica' },
    { title: 'X. EXAMEN DE CABEZA', key: 'ExamenCabeza' },
    { title: 'XI. ARTICULACIÓN CRANEOMANDIBULAR', key: 'ArticulacionCraneomandibular' },
    { title: 'XII. EXAMEN DE CUELLO', key: 'ExamenCuello' },
    { title: 'XIII. EXAMEN INTRABUCAL', key: 'ExamenIntrabucal' },
    { title: 'XIV. GLÁNDULAS SALIVALES', key: 'GlandulasSalivales' },
    { title: 'XV. OCLUSIÓN', key: 'oclusion' },
    { title: 'XVI. RELACIÓN DE DIENTES', key: 'RelacionDientes' },
    { title: 'XVII. LÍNEA MEDIA', key: 'LineaMedia' },
    { title: 'XVIII. FRENILLOS', key: 'Frenillos' },
    { title: 'XIX. DIAGNÓSTICO', key: 'Diagnostico' },
    { title: 'XX. PRONÓSTICO', key: 'Pronostico' }
  ];
  
  // Add each section to the PDF if it has content
  sections.forEach(section => {
    const content = sectionRedactions[section.key];
    if (content) {
      console.log(`Adding section ${section.title} to PDF`);
      addSection(section.title, content);
    }
  });
  
  // Save the PDF
  const filename = `Historia_Clinica_${nombrePaciente.replace(/\s+/g, '_')}_${new Date().toISOString().slice(0, 10)}.pdf`;
  doc.save(filename);
};
