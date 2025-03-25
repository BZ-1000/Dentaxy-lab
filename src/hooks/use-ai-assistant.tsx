
import { useState } from 'react';

export const useAIAssistant = () => {
  const [isGenerating, setIsGenerating] = useState(false);

  const generateRedaction = async (sectionTitle: string, sectionData: any) => {
    try {
      setIsGenerating(true);
      
      // Aquí iría la llamada real a un servicio de IA
      // Por ahora, simplemente formateamos los datos como texto estructurado
      let redactionText = '';
      
      if (Object.keys(sectionData).length === 0) {
        return null;
      }
      
      // Formateamos el texto dependiendo de la sección
      switch (sectionTitle) {
        case 'Padecimiento Actual':
          if (sectionData.sinSintomas) {
            redactionText = `El paciente no presenta sintomatología relacionada con el padecimiento actual.`;
          } else if (sectionData.dolor) {
            let { dolor, motivoConsulta } = sectionData;
            redactionText = `${motivoConsulta}. El dolor se caracteriza por ser ${dolor.caracter || 'no especificado'}, con intensidad ${dolor.intensidad || 'no especificada'}, localizado en ${dolor.localizacion?.descripcion || 'región no especificada'}.`;
            if (dolor.fechaInicio) redactionText += ` Inició el ${dolor.fechaInicio}.`;
            if (dolor.frecuencia) redactionText += ` Se presenta de manera ${dolor.frecuencia}.`;
            if (dolor.condicionAparicion) redactionText += ` El dolor aparece ${dolor.condicionAparicion}.`;
            if (dolor.atenuacion) redactionText += ` ${dolor.atenuacion}.`;
          }
          break;
          
        case 'Antecedentes Heredo Familiares':
          const familiares = ['padre', 'madre', 'abueloPaterno', 'abuelaPaterna', 'abueloMaterno', 'abuelaMaterna'];
          const condicionesNombres: {[key: string]: string} = {
            diabetesMellitus: 'Diabetes Mellitus',
            hipertensionArterial: 'Hipertensión Arterial',
            osteoporosis: 'Osteoporosis',
            artritisReumatoide: 'Artritis Reumatoide',
            parkinson: 'Parkinson',
            alzheimer: 'Alzheimer',
            asma: 'Asma',
            cancer: 'Cáncer',
            anemia: 'Anemia'
          };
          
          for (const familiar of familiares) {
            const familiarData = sectionData[familiar];
            if (!familiarData) continue;
            
            redactionText += `${familiar.charAt(0).toUpperCase() + familiar.slice(1)}: `;
            if (familiarData.finado) {
              redactionText += `Finado. Causa de muerte: ${familiarData.causaMuerte || 'No especificada'}. `;
            } else {
              redactionText += `Vivo. `;
            }
            
            const condiciones = [];
            for (const [condicion, valor] of Object.entries(familiarData.condiciones || {})) {
              if (valor === true && condicion !== 'otras') {
                condiciones.push(condicionesNombres[condicion] || condicion);
              }
            }
            
            if (condiciones.length > 0) {
              redactionText += `Condiciones: ${condiciones.join(', ')}. `;
            }
            
            if (familiarData.condiciones?.otras) {
              redactionText += `Otras condiciones: ${familiarData.condiciones.otras}. `;
            }
            
            redactionText += '\n';
          }
          break;
          
        case 'Antecedentes Personales No Patológicos':
          if (sectionData.tipoVivienda) redactionText += `Tipo de vivienda: ${sectionData.tipoVivienda}. `;
          if (sectionData.materialVivienda) redactionText += `Material de vivienda: ${sectionData.materialVivienda}. `;
          if (sectionData.servicios && sectionData.servicios.length > 0) redactionText += `Servicios: ${sectionData.servicios.join(', ')}. `;
          if (sectionData.frecuenciaBano) redactionText += `Frecuencia de baño: ${sectionData.frecuenciaBano}. `;
          if (sectionData.frecuenciaCepillado) redactionText += `Frecuencia de cepillado: ${sectionData.frecuenciaCepillado}. `;
          break;
          
        case 'Antecedentes Personales Patológicos':
          const categorias = ['nutricionales', 'cardiacos', 'hepaticos', 'enfermedadesTransmisionSexual', 'enfermedadesEruptivas', 'pulmonares', 'infecciosasParasitarias', 'otrosPadecimientos'];
          
          for (const categoria of categorias) {
            const categoriaData = sectionData[categoria];
            if (!categoriaData) continue;
            
            if (categoriaData.ninguna) {
              redactionText += `${categoria.charAt(0).toUpperCase() + categoria.slice(1)}: Sin patologías. `;
            } else {
              const condiciones = [];
              for (const [condicion, valor] of Object.entries(categoriaData)) {
                if (valor === true && condicion !== 'ninguna' && condicion !== 'otra' && condicion !== 'otraDescripcion') {
                  condiciones.push(condicion);
                }
              }
              
              if (condiciones.length > 0) {
                redactionText += `${categoria.charAt(0).toUpperCase() + categoria.slice(1)}: ${condiciones.join(', ')}. `;
              }
              
              if (categoriaData.otra && categoriaData.otraDescripcion) {
                redactionText += `Otras: ${categoriaData.otraDescripcion}. `;
              }
            }
            
            redactionText += '\n';
          }
          break;
          
        case 'Diagnóstico':
          if (sectionData.principal) redactionText += `Diagnóstico principal: ${sectionData.principal}. `;
          if (sectionData.secundarios) redactionText += `Diagnósticos secundarios: ${sectionData.secundarios}. `;
          if (sectionData.observaciones) redactionText += `Observaciones: ${sectionData.observaciones}. `;
          break;
          
        case 'Pronóstico':
          if (sectionData.general) redactionText += `Pronóstico general: ${sectionData.general}. `;
          if (sectionData.particular) redactionText += `Pronóstico particular: ${sectionData.particular}. `;
          if (sectionData.observaciones) redactionText += `Observaciones: ${sectionData.observaciones}. `;
          break;
          
        default:
          // Para el resto de secciones, simplemente formateamos los datos
          redactionText = Object.entries(sectionData)
            .filter(([_, value]) => value !== null && value !== undefined && value !== '')
            .map(([key, value]) => {
              if (typeof value === 'object') {
                return `${key}: ${JSON.stringify(value)}`;
              }
              return `${key}: ${value}`;
            })
            .join('\n');
      }
      
      return redactionText || null;
    } catch (error) {
      console.error('Error generating redaction:', error);
      return null;
    } finally {
      setIsGenerating(false);
    }
  };

  return {
    generateRedaction,
    isGenerating
  };
};
