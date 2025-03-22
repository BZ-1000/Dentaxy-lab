
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { FormDataState } from '@/types/historiaClinica';

export const generatePDF = (formData: FormDataState, patientName: string) => {
  // Create a new PDF document
  const doc = new jsPDF();
  
  // Set document properties
  doc.setProperties({
    title: `Historia Clínica - ${patientName}`,
    subject: 'Historia Clínica Odontológica',
    author: 'Dentaxy.ai',
    keywords: 'historia clínica, odontología, dental'
  });
  
  // Add header with patient name
  doc.setFontSize(20);
  doc.setTextColor(0, 0, 0);
  doc.text(`Historia Clínica: ${patientName}`, 105, 15, { align: 'center' });
  
  let yPosition = 30;
  
  // Add current date
  const currentDate = new Date().toLocaleDateString('es-MX', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  doc.setFontSize(10);
  doc.text(`Fecha: ${currentDate}`, 15, yPosition);
  
  yPosition += 10;
  
  // Add sections
  if (formData.padecimientoActual) {
    // Ensure padecimientoActual exists and add section
    addSection(doc, 'PADECIMIENTO ACTUAL', yPosition);
    yPosition += 10;
    
    // Handle potential undefined values with nullish coalescing
    const padecimiento = formData.padecimientoActual || {};
    const descripcion = padecimiento.descripcion || '';
    const tiempoEvolucion = padecimiento.tiempoEvolucion || '';
    
    doc.setFontSize(10);
    doc.text(`Descripción: ${descripcion}`, 15, yPosition);
    yPosition += 6;
    doc.text(`Tiempo de evolución: ${tiempoEvolucion}`, 15, yPosition);
    yPosition += 10;
    
    // Check if caracteristicasDolor exists
    if (padecimiento.caracteristicasDolor) {
      doc.text('Características del dolor:', 15, yPosition);
      yPosition += 6;
      
      const dolor = padecimiento.caracteristicasDolor || {};
      const intensidad = dolor.intensidad || '';
      doc.text(`- Intensidad: ${intensidad}`, 20, yPosition);
      yPosition += 6;
      
      const tipo = dolor.tipo || '';
      doc.text(`- Tipo: ${tipo}`, 20, yPosition);
      yPosition += 6;
      
      const localizacion = dolor.localizacion || '';
      doc.text(`- Localización: ${localizacion}`, 20, yPosition);
      yPosition += 6;
      
      const irradiacion = dolor.irradiacion || '';
      doc.text(`- Irradiación: ${irradiacion}`, 20, yPosition);
      yPosition += 6;
      
      const factoresAgravantes = dolor.factoresAgravantes || '';
      doc.text(`- Factores agravantes: ${factoresAgravantes}`, 20, yPosition);
      yPosition += 6;
      
      const factoresAtenuantes = dolor.factoresAtenuantes || '';
      doc.text(`- Factores atenuantes: ${factoresAtenuantes}`, 20, yPosition);
      yPosition += 10;
    }
    
    // Check if sintomas exists
    if (padecimiento.sintomas) {
      doc.text('Síntomas presentados:', 15, yPosition);
      yPosition += 6;
      
      const sintomas = padecimiento.sintomas || {};
      
      const sintomasList = [
        sintomas.dolorDental ? 'Dolor dental' : '',
        sintomas.dolorEncias ? 'Dolor en encías' : '',
        sintomas.sensibilidadDental ? 'Sensibilidad dental' : '',
        sintomas.sangradoEncias ? 'Sangrado de encías' : '',
        sintomas.halitosis ? 'Halitosis (mal aliento)' : '',
        sintomas.movilidadDental ? 'Movilidad dental' : '',
        sintomas.dificultadMasticar ? 'Dificultad para masticar' : '',
        sintomas.sequedadBucal ? 'Sequedad bucal' : '',
        sintomas.inflamacionFacial ? 'Inflamación facial' : '',
        sintomas.ulcerasBucales ? 'Úlceras bucales' : '',
        sintomas.cambiosColorDientes ? 'Cambios de color en dientes' : '',
        sintomas.chasquidoMandibular ? 'Chasquido mandibular' : '',
        sintomas.bruxismo ? 'Bruxismo' : '',
        sintomas.malOclusion ? 'Mal oclusión' : '',
        sintomas.traumatismoDental ? 'Traumatismo dental' : ''
      ].filter(Boolean);
      
      if (sintomas.otra && sintomas.otraDescripcion) {
        sintomasList.push(sintomas.otraDescripcion);
      }
      
      if (sintomasList.length > 0) {
        for (let i = 0; i < sintomasList.length; i++) {
          doc.text(`- ${sintomasList[i]}`, 20, yPosition);
          yPosition += 6;
          
          // Add page if needed
          if (yPosition > 280) {
            doc.addPage();
            yPosition = 15;
          }
        }
      } else if (sintomas.ninguna) {
        doc.text('- No se presentan síntomas', 20, yPosition);
        yPosition += 6;
      }
      
      yPosition += 4;
    }
  }
  
  // Add Antecedentes Heredo Familiares
  if (formData.antecedentesHeredoFamiliares) {
    addSection(doc, 'ANTECEDENTES HEREDO-FAMILIARES', yPosition);
    yPosition += 10;
    
    const antecedentes = formData.antecedentesHeredoFamiliares || {};
    
    // Add table of family conditions
    const familiaresList = [];
    
    // Check if datos exists and has condiciones for each member
    if (antecedentes.padre && antecedentes.padre.condiciones) {
      familiaresList.push(['Padre', antecedentes.padre.condiciones]);
    }
    
    if (antecedentes.madre && antecedentes.madre.condiciones) {
      familiaresList.push(['Madre', antecedentes.madre.condiciones]);
    }
    
    if (antecedentes.abuelos && antecedentes.abuelos.condiciones) {
      familiaresList.push(['Abuelos', antecedentes.abuelos.condiciones]);
    }
    
    if (antecedentes.hermanos && antecedentes.hermanos.condiciones) {
      familiaresList.push(['Hermanos', antecedentes.hermanos.condiciones]);
    }
    
    if (antecedentes.tios && antecedentes.tios.condiciones) {
      familiaresList.push(['Tíos', antecedentes.tios.condiciones]);
    }
    
    if (familiaresList.length > 0) {
      autoTable(doc, {
        startY: yPosition,
        head: [['Familiar', 'Condiciones']],
        body: familiaresList,
        theme: 'striped',
        headStyles: { fillColor: [66, 135, 245] }
      });
      
      yPosition = doc.lastAutoTable?.finalY || yPosition + 30;
      yPosition += 10;
    } else {
      doc.text('No se reportan antecedentes heredo-familiares significativos.', 15, yPosition);
      yPosition += 10;
    }
  }
  
  // Continue adding other sections...
  // The rest of the sections would follow a similar pattern
  
  // Save PDF with patient name
  doc.save(`Historia_Clinica_${patientName.replace(/\s+/g, '_')}.pdf`);
};

// Helper function to add section titles
const addSection = (doc: jsPDF, title: string, y: number) => {
  // Check if we need a new page
  if (y > 270) {
    doc.addPage();
    y = 15;
  }
  
  doc.setFillColor(66, 135, 245);
  doc.rect(15, y - 5, 180, 8, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(12);
  doc.text(title, 105, y, { align: 'center' });
  doc.setTextColor(0, 0, 0);
  
  return y;
};
