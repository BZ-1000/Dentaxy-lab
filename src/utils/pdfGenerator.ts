
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
  const addSection = (title: string, content: string | Function, stripHtml: boolean = true) => {
    checkNewPage(30);
    
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(14);
    doc.text(title, 14, yPos);
    yPos += 10;
    
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(12);
    
    if (typeof content === 'function') {
      content();
    } else if (content) {
      // Parse HTML content if needed
      let textContent = content;
      if (stripHtml) {
        textContent = content.replace(/<\/?[^>]+(>|$)/g, "");
      }
      
      const lines = doc.splitTextToSize(textContent, 180);
      doc.text(lines, 14, yPos);
      yPos += lines.length * 7 + 5;
    }
  };
  
  // Add Padecimiento Actual section if available from redactions
  if (sectionRedactions.padecimientoActual) {
    addSection('I. PADECIMIENTO ACTUAL', sectionRedactions.padecimientoActual);
  } else {
    // Original fallback for Padecimiento Actual section
    addSection('I. PADECIMIENTO ACTUAL', () => {
      if (formData.padecimientoActual.sinSintomas) {
        doc.text('El paciente no refiere sintomatología actual.', 14, yPos);
        yPos += 10;
      } else {
        const motivoConsulta = formData.padecimientoActual.motivoConsulta || '';
        const lines = doc.splitTextToSize(motivoConsulta, 180);
        doc.text(lines, 14, yPos);
        yPos += lines.length * 7;
        
        // Add dolor characteristics in a table
        if (formData.padecimientoActual.dolor) {
          const { dolor } = formData.padecimientoActual;
          
          const dolorData = [
            ['Inicio', dolor.fechaInicio || ''],
            ['Condición de aparición', dolor.condicionAparicion || ''],
            ['Frecuencia', dolor.frecuencia || ''],
            ['Carácter', dolor.caracter || ''],
            ['Intensidad', dolor.intensidad || ''],
            ['Localización', dolor.localizacion?.descripcion || ''],
            ['Factores de atenuación', dolor.atenuacion || '']
          ];
          
          autoTable(doc, {
            startY: yPos,
            head: [['Característica', 'Descripción']],
            body: dolorData,
            theme: 'grid',
            headStyles: { fillColor: [66, 133, 244], textColor: 255 },
            margin: { left: 14, right: 14 }
          });
          
          yPos = (doc as any).lastAutoTable.finalY + 10;
        }
      }
    });
  }
  
  // Add Antecedentes Heredo Familiares section
  if (sectionRedactions.antecedentesHeredoFamiliares) {
    addSection('II. ANTECEDENTES HEREDO FAMILIARES', sectionRedactions.antecedentesHeredoFamiliares);
  } else {
    addSection('II. ANTECEDENTES HEREDO FAMILIARES', () => {
      // Safely check and iterate through familiares
      const familiares = ['padre', 'madre', 'abuelos', 'hermanos', 'tios'];
      const antecedentesHeredoFamiliares = formData.antecedentesHeredoFamiliares || {};
      
      for (const familiar of familiares) {
        const data = antecedentesHeredoFamiliares[familiar] || { condiciones: {}, finado: false };
        
        // Safely check if condiciones exists
        if (!data.condiciones) {
          data.condiciones = {};
        }
        
        const condiciones = Object.entries(data.condiciones)
          .filter(([key, value]) => value && key !== 'otras')
          .map(([key]) => key);
        
        if (data.condiciones.otras) {
          condiciones.push(`Otras: ${data.condiciones.otras}`);
        }
        
        if (condiciones.length > 0 || data.finado) {
          doc.setFont('helvetica', 'bold');
          doc.text(`${familiar.charAt(0).toUpperCase() + familiar.slice(1)}:`, 14, yPos);
          yPos += 7;
          
          doc.setFont('helvetica', 'normal');
          if (data.finado) {
            doc.text(`Finado: Sí (Causa: ${data.causaMuerte || 'No especificada'})`, 20, yPos);
          } else {
            doc.text('Finado: No', 20, yPos);
          }
          yPos += 7;
          
          if (condiciones.length > 0) {
            doc.text('Condiciones:', 20, yPos);
            yPos += 7;
            
            condiciones.forEach(condicion => {
              doc.text(`- ${condicion}`, 25, yPos);
              yPos += 7;
            });
          }
          
          yPos += 3;
        }
      }
    });
  }
  
  // Check if we need a new page for Antecedentes Personales
  checkNewPage(20);
  
  // Add Antecedentes Personales No Patológicos section
  if (sectionRedactions.antecedentesPersonalesNoPatologicos) {
    addSection('III. ANTECEDENTES PERSONALES NO PATOLÓGICOS', sectionRedactions.antecedentesPersonalesNoPatologicos);
  } else {
    addSection('III. ANTECEDENTES PERSONALES NO PATOLÓGICOS', () => {
      const { antecedentesPersonalesNoPatologicos } = formData;
      
      // Vivienda
      doc.text(`Vivienda: ${antecedentesPersonalesNoPatologicos.tipoVivienda || 'No especificada'}`, 14, yPos);
      yPos += 7;
      
      // Servicios
      const servicios = antecedentesPersonalesNoPatologicos.servicios?.join(', ') || 'Ninguno especificado';
      doc.text(`Servicios: ${servicios}`, 14, yPos);
      yPos += 7;
      
      // Condición Calle
      const condicionCalle = antecedentesPersonalesNoPatologicos.condicionCalle;
      if (condicionCalle) {
        doc.text(`Condición de calle: ${condicionCalle}`, 14, yPos);
        yPos += 7;
      }
      
      // Frecuencia Baño
      const frecuenciaBano = antecedentesPersonalesNoPatologicos.frecuenciaBano;
      if (frecuenciaBano) {
        doc.text(`Frecuencia de baño: ${frecuenciaBano}`, 14, yPos);
        yPos += 7;
      }
    });
  }
  
  // Check if we need a new page for Antecedentes Patológicos
  checkNewPage(20);
  
  // Add Antecedentes Personales Patológicos section
  if (sectionRedactions.antecedentesPersonalesPatologicos) {
    addSection('IV. ANTECEDENTES PERSONALES PATOLÓGICOS', sectionRedactions.antecedentesPersonalesPatologicos);
  } else {
    addSection('IV. ANTECEDENTES PERSONALES PATOLÓGICOS', () => {
      const { antecedentesPersonalesPatologicos } = formData;
      if (antecedentesPersonalesPatologicos) {
        const categories = [
          { name: 'Nutricionales', data: antecedentesPersonalesPatologicos.nutricionales || {} },
          { name: 'Cardíacos', data: antecedentesPersonalesPatologicos.cardiacos || {} },
          { name: 'Hepáticos', data: antecedentesPersonalesPatologicos.hepaticos || {} },
          { name: 'Enfermedades de Transmisión Sexual', data: antecedentesPersonalesPatologicos.enfermedadesTransmisionSexual || {} },
          { name: 'Enfermedades Eruptivas', data: antecedentesPersonalesPatologicos.enfermedadesEruptivas || {} },
          { name: 'Pulmonares', data: antecedentesPersonalesPatologicos.pulmonares || {} },
          { name: 'Infecciosas y Parasitarias', data: antecedentesPersonalesPatologicos.infecciosasParasitarias || {} },
          { name: 'Otros padecimientos', data: antecedentesPersonalesPatologicos.otrosPadecimientos || {} }
        ];
        
        categories.forEach(category => {
          // Safe check for data
          if (!category.data) {
            category.data = {};
          }
          
          const conditions = Object.entries(category.data)
            .filter(([key, value]) => value === true && key !== 'otra')
            .map(([key]) => key);
          
          if (category.data.otra && typeof category.data.otraDescripcion === 'string') {
            conditions.push(`Otra: ${category.data.otraDescripcion}`);
          }
          
          if (conditions.length > 0) {
            doc.setFont('helvetica', 'bold');
            doc.text(category.name + ':', 14, yPos);
            yPos += 7;
            
            doc.setFont('helvetica', 'normal');
            conditions.forEach(condition => {
              doc.text(`- ${condition}`, 20, yPos);
              yPos += 7;
            });
            
            yPos += 3;
          }
          
          // Check if we need a new page
          checkNewPage(20);
        });
      }
    });
  }
  
  // Additional sections from redactions
  const additionalSections = {
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
  
  // Add additional sections if available in redactions
  Object.entries(additionalSections).forEach(([key, title]) => {
    if (sectionRedactions[key]) {
      checkNewPage(20);
      addSection(title, sectionRedactions[key]);
    }
  });
  
  // Save the PDF
  const filename = `Historia_Clinica_${nombrePaciente.replace(/\s+/g, '_')}_${new Date().toISOString().slice(0, 10)}.pdf`;
  doc.save(filename);
};
