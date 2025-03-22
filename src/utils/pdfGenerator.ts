
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { FormDataState } from '@/types/historiaClinica';

export const generatePDF = (formData: FormDataState, nombrePaciente: string) => {
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
  
  // Add Padecimiento Actual section
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.text('I. PADECIMIENTO ACTUAL', 14, yPos);
  yPos += 10;
  
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(12);
  
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
  
  // Add Antecedentes Heredo Familiares section
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.text('II. ANTECEDENTES HEREDO FAMILIARES', 14, yPos);
  yPos += 10;
  
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(12);
  
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
  
  // Check if we need a new page for Antecedentes Personales
  if (yPos > 250) {
    doc.addPage();
    yPos = 20;
  }
  
  // Add Antecedentes Personales No Patológicos section
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.text('III. ANTECEDENTES PERSONALES NO PATOLÓGICOS', 14, yPos);
  yPos += 10;
  
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(12);
  
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
  
  // Check if we need a new page for Antecedentes Patológicos
  if (yPos > 250) {
    doc.addPage();
    yPos = 20;
  }
  
  // Add Antecedentes Personales Patológicos section
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.text('IV. ANTECEDENTES PERSONALES PATOLÓGICOS', 14, yPos);
  yPos += 10;
  
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(12);
  
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
      
      if (category.data.otra && category.data.otraDescripcion) {
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
      if (yPos > 270) {
        doc.addPage();
        yPos = 20;
      }
    });
  }
  
  // Add more sections as needed...
  
  // Save the PDF
  const filename = `Historia_Clinica_${nombrePaciente.replace(/\s+/g, '_')}_${new Date().toISOString().slice(0, 10)}.pdf`;
  doc.save(filename);
};

