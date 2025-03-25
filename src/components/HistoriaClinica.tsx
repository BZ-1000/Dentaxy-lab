import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { toast } from 'sonner';
import { generatePDF } from '@/utils/pdfGenerator';
import { useTheme } from '@/hooks/use-theme';
import { FormDataState } from '@/types/historiaClinica';
import ResumenHistoriaClinica from './historia-clinica/ResumenHistoriaClinica';
import { useHistoriaClinica } from '@/hooks/useHistoriaClinica';

// Import all form sections
import PadecimientoActual from './historia-clinica/PadecimientoActual';
import AntecedentesHeredoFamiliares from './historia-clinica/AntecedentesHeredoFamiliares';
import AntecedentesPersonalesNoPatologicos from './historia-clinica/AntecedentesPersonalesNoPatologicos';
import AntecedentesPersonalesPatologicos from './historia-clinica/AntecedentesPersonalesPatologicos';
import AntecedentesAlergicos from './historia-clinica/AntecedentesAlergicos';
import AntecedentesQuirurgicos from './historia-clinica/AntecedentesQuirurgicos';
import AntecedentesHemorragicos from './historia-clinica/AntecedentesHemorragicos';
import InterrogatorioSistemas from './historia-clinica/InterrogatorioSistemas';
import ExploracionFisica from './historia-clinica/ExploracionFisica';
import ExamenCabeza from './historia-clinica/ExamenCabeza';
import ArticulacionCraneomandibular from './historia-clinica/ArticulacionCraneomandibular';
import ExamenCuello from './historia-clinica/ExamenCuello';
import ExamenIntrabucal from './historia-clinica/ExamenIntrabucal';
import GlandulasSalivales from './historia-clinica/GlandulasSalivales';
import Oclusion from './historia-clinica/Oclusion';
import RelacionDientes from './historia-clinica/RelacionDientes';
import LineaMedia from './historia-clinica/LineaMedia';
import Frenillos from './historia-clinica/Frenillos';
import Diagnostico from './historia-clinica/Diagnostico';
import Pronostico from './historia-clinica/Pronostico';

const HistoriaClinica = () => {
  const { theme } = useTheme();
  const [activeTab, setActiveTab] = useState('padecimiento-actual');
  const [nombrePaciente, setNombrePaciente] = useState('');
  const [sectionRedactions, setSectionRedactions] = useState<{ [key: string]: string }>({});
  
  // Get all functions and state from the useHistoriaClinica hook
  const {
    formData,
    resumen,
    isGenerating,
    handleInputChange,
    handlePadecimientoChange,
    handleDolorChange,
    handleSinSintomasChange,
    handleFamiliarChange,
    handleCondicionChange,
    handleAntecedenteChange,
    handleAntecedentePatologicoChange,
    handleAntecedenteAlergicoChange,
    handleAntecedenteQuirurgicoChange,
    handleAntecedenteHemorragicoChange,
    handleInterrogatorioChange,
    handleExploracionFisicaChange,
    handleExamenCabezaChange,
    handleArticulacionCraneomandibularChange,
    handleExamenCuelloChange,
    handleExamenIntrabucalChange,
    handleGlandulasSalivalesChange,
    handleOclusionChange,
    handleRelacionDientesChange,
    handleLineaMediaChange,
    handleFrenillosChange,
    handleDiagnosticoChange,
    handlePronosticoChange,
    toggleService,
    generarResumen,
    guardarFormulario,
    cargarFormulario,
    resetFormulario
  } = useHistoriaClinica();

  const handleFormChange = (section: keyof FormDataState, data: any) => {
    if (section === 'padecimientoActual') {
      const { padecimientoActual } = data;
      handlePadecimientoChange('motivoConsulta', padecimientoActual.motivoConsulta || '');
      handlePadecimientoChange('historiaPadecimiento', padecimientoActual.historiaPadecimiento || '');
      handleSinSintomasChange(padecimientoActual.sinSintomas || false);
      
      // Handle dolor data separately
      if (padecimientoActual.dolor) {
        const { dolor } = padecimientoActual;
        Object.entries(dolor).forEach(([key, value]) => {
          handleDolorChange(key, value);
        });
      }
    } else if (section === 'antecedentesHeredoFamiliares') {
      // Update based on the structure returned from the component
      Object.entries(data).forEach(([familiar, values]: [string, any]) => {
        if (familiar === 'padre' || familiar === 'madre' || familiar === 'abueloPaterno' || 
            familiar === 'abuelaPaterna' || familiar === 'abueloMaterno' || familiar === 'abuelaMaterna') {
          handleFamiliarChange(familiar, 'finado', values.finado);
          handleFamiliarChange(familiar, 'causaMuerte', values.causaMuerte);
          
          // Update conditions
          if (values.condiciones) {
            Object.entries(values.condiciones).forEach(([condition, value]: [string, any]) => {
              handleCondicionChange(familiar, condition, value);
            });
          }
        }
      });
    } else if (section === 'antecedentesPersonalesPatologicos') {
      // Update using the existing handleAntecedentePatologicoChange
      Object.entries(data).forEach(([key, value]: [string, any]) => {
        handleAntecedentePatologicoChange(key, value);
      });
    }
    
    // Add more section handling as needed for other components
  };

  // Función para generar redacción para cada sección del formulario
  const generateRedaction = async (sectionTitle: string, sectionData: any) => {
    // Simular la generación de redacción basada en los datos de la sección
    try {
      // Aquí se generaría la redacción real utilizando un servicio de IA
      // Por ahora, simplemente formateamos los datos como texto
      let redactionText = `${sectionTitle}:\n`;
      
      Object.entries(sectionData).forEach(([key, value]: [string, any]) => {
        if (typeof value === 'object' && value !== null) {
          redactionText += `${key}: ${JSON.stringify(value)}\n`;
        } else if (value !== undefined && value !== null && value !== '') {
          redactionText += `${key}: ${value}\n`;
        }
      });
      
      return redactionText;
    } catch (error) {
      console.error(`Error generando redacción para ${sectionTitle}:`, error);
      return null;
    }
  };

  const collectAllRedactions = async () => {
    const sections = [
      { key: 'padecimientoActual', title: 'Padecimiento Actual' },
      { key: 'antecedentesHeredoFamiliares', title: 'Antecedentes Heredo Familiares' },
      { key: 'antecedentesPersonalesNoPatologicos', title: 'Antecedentes Personales No Patológicos' },
      { key: 'antecedentesPersonalesPatologicos', title: 'Antecedentes Personales Patológicos' },
      { key: 'antecedentesAlergicos', title: 'Antecedentes Alérgicos' },
      { key: 'antecedentesQuirurgicos', title: 'Antecedentes Quirúrgicos' },
      { key: 'antecedentesHemorragicos', title: 'Antecedentes Hemorrágicos' },
      { key: 'interrogatorioSistemas', title: 'Interrogatorio por Sistemas' },
      { key: 'exploracionFisica', title: 'Exploración Física' },
      { key: 'examenCabeza', title: 'Examen de Cabeza' },
      { key: 'articulacionCraneomandibular', title: 'Articulación Craneomandibular' },
      { key: 'examenCuello', title: 'Examen de Cuello' },
      { key: 'examenIntrabucal', title: 'Examen Intrabucal' },
      { key: 'glandulasSalivales', title: 'Glándulas Salivales' },
      { key: 'oclusion', title: 'Oclusión' },
      { key: 'relacionDientes', title: 'Relación de Dientes' },
      { key: 'lineaMedia', title: 'Línea Media' },
      { key: 'frenillos', title: 'Frenillos' },
      { key: 'diagnostico', title: 'Diagnóstico' },
      { key: 'pronostico', title: 'Pronóstico' }
    ];

    const newRedactions: { [key: string]: string } = {};
    
    for (const section of sections) {
      const sectionData = formData[section.key as keyof FormDataState];
      if (Object.keys(sectionData).length > 0) {
        try {
          const redaction = await generateRedaction(section.title, sectionData);
          if (redaction) {
            newRedactions[section.key] = redaction;
          }
        } catch (error) {
          console.error(`Error generating redaction for ${section.title}:`, error);
          toast.error(`Error al generar la redacción para ${section.title}`);
        }
      }
    }

    return newRedactions;
  };

  const handleGeneratePDF = async () => {
    if (!nombrePaciente.trim()) {
      toast.error('Por favor ingrese el nombre del paciente');
      return;
    }

    try {
      const allRedactions = await collectAllRedactions();
      setSectionRedactions(allRedactions);
      generatePDF(formData, nombrePaciente, allRedactions);
      toast.success('PDF generado exitosamente');
    } catch (error) {
      console.error('Error generating PDF:', error);
      toast.error('Error al generar el PDF');
    }
  };

  return (
    <div className="container mx-auto p-4">
      <div className="mb-6">
        <input
          type="text"
          placeholder="Nombre del paciente"
          value={nombrePaciente}
          onChange={(e) => setNombrePaciente(e.target.value)}
          className="w-full p-2 border rounded"
        />
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-2">
          <TabsTrigger value="padecimiento-actual">Padecimiento Actual</TabsTrigger>
          <TabsTrigger value="antecedentes">Antecedentes</TabsTrigger>
          <TabsTrigger value="exploracion">Exploración</TabsTrigger>
          <TabsTrigger value="examenes">Exámenes</TabsTrigger>
          <TabsTrigger value="diagnostico">Diagnóstico</TabsTrigger>
          <TabsTrigger value="pronostico">Pronóstico</TabsTrigger>
        </TabsList>

        <Card className="mt-4">
          <CardContent className="p-4">
            <TabsContent value="padecimiento-actual">
              <PadecimientoActual
                formData={{padecimientoActual: formData.padecimientoActual}}
                onChange={(data) => handleFormChange('padecimientoActual', data)}
              />
            </TabsContent>

            <TabsContent value="antecedentes">
              <div className="space-y-8">
                <AntecedentesHeredoFamiliares
                  formData={formData}
                  handleFamiliarChange={handleFamiliarChange}
                  handleCondicionChange={handleCondicionChange}
                />
                <AntecedentesPersonalesNoPatologicos
                  formData={formData}
                  handleAntecedenteChange={handleAntecedenteChange}
                  toggleService={toggleService}
                />
                <AntecedentesPersonalesPatologicos
                  formData={formData}
                  handleAntecedentePatologicoChange={handleAntecedentePatologicoChange}
                />
                <AntecedentesAlergicos
                  formData={formData}
                  onChange={handleAntecedenteAlergicoChange}
                />
                <AntecedentesQuirurgicos
                  formData={formData}
                  handleAntecedenteQuirurgicoChange={handleAntecedenteQuirurgicoChange}
                />
                <AntecedentesHemorragicos
                  formData={formData}
                  handleAntecedenteHemorragicoChange={handleAntecedenteHemorragicoChange}
                />
              </div>
            </TabsContent>

            <TabsContent value="exploracion">
              <div className="space-y-8">
                <InterrogatorioSistemas
                  formData={formData}
                  handleInterrogatorioChange={handleInterrogatorioChange}
                />
                <ExploracionFisica
                  formData={formData}
                  handleExploracionFisicaChange={handleExploracionFisicaChange}
                />
              </div>
            </TabsContent>

            <TabsContent value="examenes">
              <div className="space-y-8">
                <ExamenCabeza
                  formData={formData}
                  handleExamenCabezaChange={handleExamenCabezaChange}
                />
                <ArticulacionCraneomandibular
                  formData={formData}
                  handleArticulacionCraneomandibularChange={handleArticulacionCraneomandibularChange}
                />
                <ExamenCuello
                  formData={formData}
                  handleExamenCuelloChange={handleExamenCuelloChange}
                />
                <ExamenIntrabucal
                  formData={formData}
                  handleExamenIntrabucalChange={handleExamenIntrabucalChange}
                />
                <GlandulasSalivales
                  formData={formData}
                  handleGlandulasSalivalesChange={handleGlandulasSalivalesChange}
                />
                <Oclusion
                  formData={formData}
                  handleOclusionChange={handleOclusionChange}
                />
                <RelacionDientes
                  formData={formData}
                  handleRelacionDientesChange={handleRelacionDientesChange}
                />
                <LineaMedia
                  formData={formData}
                  handleLineaMediaChange={handleLineaMediaChange}
                />
                <Frenillos
                  formData={formData}
                  handleFrenillosChange={handleFrenillosChange}
                />
              </div>
            </TabsContent>

            <TabsContent value="diagnostico">
              <Diagnostico
                formData={formData}
                handleDiagnosticoChange={handleDiagnosticoChange}
              />
            </TabsContent>

            <TabsContent value="pronostico">
              <Pronostico
                formData={formData}
                handlePronosticoChange={handlePronosticoChange}
              />
            </TabsContent>
          </CardContent>
        </Card>
      </Tabs>

      <div className="mt-6 flex justify-end">
        <Button onClick={handleGeneratePDF}>
          Generar PDF
        </Button>
      </div>

      {Object.keys(sectionRedactions).length > 0 && (
        <ResumenHistoriaClinica
          resumen={Object.values(sectionRedactions).join('\n\n')}
        />
      )}
    </div>
  );
};

export default HistoriaClinica;
