
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { FormDataState } from '@/types/historiaClinica';

export const generatePDF = (
  formData: FormDataState, 
  nombrePaciente: string,
  sectionRedactions: { [key: string]: string } = {}
) => {
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
  const addSectionFromRedaction = (title: string, sectionKey: string) => {
    if (!sectionRedactions[sectionKey]) return;
    
    checkNewPage(30);
    
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(14);
    doc.text(title, 14, yPos);
    yPos += 10;
    
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(12);
    
    // Clean up HTML tags from redaction content
    const cleanText = sectionRedactions[sectionKey].replace(/<\/?[^>]+(>|$)/g, "");
    const lines = doc.splitTextToSize(cleanText, 180);
    doc.text(lines, 14, yPos);
    yPos += lines.length * 7 + 10;
  };
  
  // Define all section titles and their keys
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
  
  // Add all sections from redactions
  sections.forEach(section => {
    addSectionFromRedaction(section.title, section.key);
  });
  
  // Save the PDF
  const filename = `Historia_Clinica_${nombrePaciente.replace(/\s+/g, '_')}_${new Date().toISOString().slice(0, 10)}.pdf`;
  doc.save(filename);
};
