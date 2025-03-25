import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from 'sonner';
import { generatePDF } from '@/utils/pdfGenerator';
import { useTheme } from '@/hooks/use-theme';
import { useAIAssistant } from '@/hooks/use-ai-assistant';
import { FormDataState } from '@/types/historiaClinica';
import ResumenHistoriaClinica from './historia-clinica/ResumenHistoriaClinica';

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
  const toast = useToast();
  const { generateRedaction } = useAIAssistant();
  const [activeTab, setActiveTab] = useState('padecimiento-actual');
  const [nombrePaciente, setNombrePaciente] = useState('');
  const [sectionRedactions, setSectionRedactions] = useState<{ [key: string]: string }>({});
  const [formData, setFormData] = useState<FormDataState>({
    padecimientoActual: {},
    antecedentesHeredoFamiliares: {},
    antecedentesPersonalesNoPatologicos: {},
    antecedentesPersonalesPatologicos: {},
    antecedentesAlergicos: {},
    antecedentesQuirurgicos: {},
    antecedentesHemorragicos: {},
    interrogatorioSistemas: {},
    exploracionFisica: {},
    examenCabeza: {},
    articulacionCraneomandibular: {},
    examenCuello: {},
    examenIntrabucal: {},
    glandulasSalivales: {},
    oclusion: {},
    relacionDientes: {},
    lineaMedia: {},
    frenillos: {},
    diagnostico: {},
    pronostico: {}
  });

  const handleFormChange = (section: keyof FormDataState, data: any) => {
    setFormData(prev => ({
      ...prev,
      [section]: data
    }));
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
                formData={formData.padecimientoActual}
                onChange={(data) => handleFormChange('padecimientoActual', data)}
              />
            </TabsContent>

            <TabsContent value="antecedentes">
              <div className="space-y-8">
                <AntecedentesHeredoFamiliares
                  formData={formData.antecedentesHeredoFamiliares}
                  onChange={(data) => handleFormChange('antecedentesHeredoFamiliares', data)}
                />
                <AntecedentesPersonalesNoPatologicos
                  formData={formData.antecedentesPersonalesNoPatologicos}
                  onChange={(data) => handleFormChange('antecedentesPersonalesNoPatologicos', data)}
                />
                <AntecedentesPersonalesPatologicos
                  formData={formData.antecedentesPersonalesPatologicos}
                  onChange={(data) => handleFormChange('antecedentesPersonalesPatologicos', data)}
                />
                <AntecedentesAlergicos
                  formData={formData.antecedentesAlergicos}
                  onChange={(data) => handleFormChange('antecedentesAlergicos', data)}
                />
                <AntecedentesQuirurgicos
                  formData={formData.antecedentesQuirurgicos}
                  onChange={(data) => handleFormChange('antecedentesQuirurgicos', data)}
                />
                <AntecedentesHemorragicos
                  formData={formData.antecedentesHemorragicos}
                  onChange={(data) => handleFormChange('antecedentesHemorragicos', data)}
                />
              </div>
            </TabsContent>

            <TabsContent value="exploracion">
              <div className="space-y-8">
                <InterrogatorioSistemas
                  formData={formData.interrogatorioSistemas}
                  onChange={(data) => handleFormChange('interrogatorioSistemas', data)}
                />
                <ExploracionFisica
                  formData={formData.exploracionFisica}
                  onChange={(data) => handleFormChange('exploracionFisica', data)}
                />
              </div>
            </TabsContent>

            <TabsContent value="examenes">
              <div className="space-y-8">
                <ExamenCabeza
                  formData={formData.examenCabeza}
                  onChange={(data) => handleFormChange('examenCabeza', data)}
                />
                <ArticulacionCraneomandibular
                  formData={formData.articulacionCraneomandibular}
                  onChange={(data) => handleFormChange('articulacionCraneomandibular', data)}
                />
                <ExamenCuello
                  formData={formData.examenCuello}
                  onChange={(data) => handleFormChange('examenCuello', data)}
                />
                <ExamenIntrabucal
                  formData={formData.examenIntrabucal}
                  onChange={(data) => handleFormChange('examenIntrabucal', data)}
                />
                <GlandulasSalivales
                  formData={formData.glandulasSalivales}
                  onChange={(data) => handleFormChange('glandulasSalivales', data)}
                />
                <Oclusion
                  formData={formData.oclusion}
                  onChange={(data) => handleFormChange('oclusion', data)}
                />
                <RelacionDientes
                  formData={formData.relacionDientes}
                  onChange={(data) => handleFormChange('relacionDientes', data)}
                />
                <LineaMedia
                  formData={formData.lineaMedia}
                  onChange={(data) => handleFormChange('lineaMedia', data)}
                />
                <Frenillos
                  formData={formData.frenillos}
                  onChange={(data) => handleFormChange('frenillos', data)}
                />
              </div>
            </TabsContent>

            <TabsContent value="diagnostico">
              <Diagnostico
                formData={formData.diagnostico}
                onChange={(data) => handleFormChange('diagnostico', data)}
              />
            </TabsContent>

            <TabsContent value="pronostico">
              <Pronostico
                formData={formData.pronostico}
                onChange={(data) => handleFormChange('pronostico', data)}
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
