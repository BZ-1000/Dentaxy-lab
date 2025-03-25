
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { toast } from 'sonner';
import { generatePDF } from '@/utils/pdfGenerator';
import { useTheme } from '@/hooks/use-theme';
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
import { useHistoriaClinica } from '@/hooks/useHistoriaClinica';

const HistoriaClinica = () => {
  const { theme } = useTheme();
  const [activeTab, setActiveTab] = useState('padecimiento-actual');
  const [nombrePaciente, setNombrePaciente] = useState('');
  const [sectionRedactions, setSectionRedactions] = useState<{ [key: string]: string }>({});
  const [formData, setFormData] = useState<FormDataState>({
    padecimientoActual: {
      sinSintomas: false,
      motivoConsulta: '',
      historiaPadecimiento: '',
      dolor: {
        fechaInicio: '',
        condicionAparicion: '',
        frecuencia: '',
        caracter: '',
        intensidad: '',
        localizacion: {
          tipo: '',
          descripcion: ''
        },
        atenuacion: ''
      }
    },
    antecedentesHeredoFamiliares: {
      padre: {
        finado: false,
        causaMuerte: '',
        condiciones: {
          diabetesMellitus: false,
          hipertensionArterial: false,
          osteoporosis: false,
          artritisReumatoide: false,
          parkinson: false,
          alzheimer: false,
          asma: false,
          cancer: false,
          anemia: false,
          otras: ''
        }
      },
      madre: {
        finado: false,
        causaMuerte: '',
        condiciones: {
          diabetesMellitus: false,
          hipertensionArterial: false,
          osteoporosis: false,
          artritisReumatoide: false,
          parkinson: false,
          alzheimer: false,
          asma: false,
          cancer: false,
          anemia: false,
          otras: ''
        }
      },
      abueloPaterno: {
        finado: false,
        causaMuerte: '',
        condiciones: {
          diabetesMellitus: false,
          hipertensionArterial: false,
          osteoporosis: false,
          artritisReumatoide: false,
          parkinson: false,
          alzheimer: false,
          asma: false,
          cancer: false,
          anemia: false,
          otras: ''
        }
      },
      abuelaPaterna: {
        finado: false,
        causaMuerte: '',
        condiciones: {
          diabetesMellitus: false,
          hipertensionArterial: false,
          osteoporosis: false,
          artritisReumatoide: false,
          parkinson: false,
          alzheimer: false,
          asma: false,
          cancer: false,
          anemia: false,
          otras: ''
        }
      },
      abueloMaterno: {
        finado: false,
        causaMuerte: '',
        condiciones: {
          diabetesMellitus: false,
          hipertensionArterial: false,
          osteoporosis: false,
          artritisReumatoide: false,
          parkinson: false,
          alzheimer: false,
          asma: false,
          cancer: false,
          anemia: false,
          otras: ''
        }
      },
      abuelaMaterna: {
        finado: false,
        causaMuerte: '',
        condiciones: {
          diabetesMellitus: false,
          hipertensionArterial: false,
          osteoporosis: false,
          artritisReumatoide: false,
          parkinson: false,
          alzheimer: false,
          asma: false,
          cancer: false,
          anemia: false,
          otras: ''
        }
      }
    },
    antecedentesPersonalesNoPatologicos: {
      tipoVivienda: '',
      materialVivienda: '',
      servicios: [],
      condicionCalle: '',
      iluminacionCalle: '',
      frecuenciaLimpieza: '',
      cambioRopaCama: '',
      hacinamiento: '',
      promiscuidad: '',
      mascotas: '',
      manejoResiduos: '',
      frecuenciaBano: '',
      lavadoManos: [],
      cambioRopa: '',
      frecuenciaCepillado: '',
      tecnicaCepillado: '',
      auxiliaresBucales: [],
      ultimaVisitaOdontologo: '',
      problemasBucales: [],
      alimentosConsumidos: [],
      frecuenciaFrutasVerduras: '',
      frecuenciaBebidasAzucaradas: '',
      frecuenciaComidaChatarra: '',
      consumoAgua: '',
      numeroComidas: '',
      horarioComidas: {
        desayuno: '',
        almuerzo: '',
        cena: ''
      },
      ayunoProlongado: ''
    },
    antecedentesPersonalesPatologicos: {
      nutricionales: {
        ninguna: true,
        otra: false,
        otraDescripcion: '',
        anorexia: false,
        bulimia: false,
        sobrepeso: false,
        obesidad: false
      },
      cardiacos: {
        ninguna: true,
        otra: false,
        otraDescripcion: '',
        enfermedadCoronaria: false,
        arritmias: false,
        defectosCardiacosCongenitos: false
      },
      hepaticos: {
        ninguna: true,
        otra: false,
        otraDescripcion: '',
        hepatitisA: false,
        hepatitisB: false,
        hepatitisC: false,
        higadoGraso: false,
        cirrosis: false
      },
      enfermedadesTransmisionSexual: {
        ninguna: true,
        otra: false,
        otraDescripcion: '',
        vih: false,
        sifilis: false,
        gonorrea: false,
        herpesGenital: false,
        vph: false
      },
      enfermedadesEruptivas: {
        ninguna: true,
        otra: false,
        otraDescripcion: '',
        sarampion: false,
        rubeola: false,
        escarlatina: false,
        varicela: false,
        paperas: false
      },
      pulmonares: {
        ninguna: true,
        otra: false,
        otraDescripcion: '',
        neumonia: false,
        bronquitis: false,
        asma: false,
        epoc: false
      },
      infecciosasParasitarias: {
        ninguna: true,
        otra: false,
        otraDescripcion: '',
        fiebreTifoidea: false,
        tuberculosis: false,
        amibiasis: false,
        giardiasis: false,
        ascariasis: false
      },
      otrosPadecimientos: {
        ninguna: true,
        otra: false,
        otraDescripcion: '',
        especificar: false
      }
    },
    antecedentesAlergicos: {
      medicamentos: {
        es_alergico: false,
        cuales: '',
        tipo_reaccion: '',
        severidad: ''
      },
      alimentos: {
        es_alergico: false,
        cuales: ''
      },
      latex: {
        es_alergico: false,
        descripcion_reaccion: ''
      }
    },
    antecedentesQuirurgicos: {
      sinQuirurgicos: true,
      cirugiasRealizadas: [],
      hospitalizacionesPrevias: '',
      complicacionesAnestesicas: ''
    },
    antecedentesHemorragicos: {
      sinHemorragicos: true,
      sangradoProlongado: '',
      hematomas: '',
      hemorragiasEspontaneas: '',
      transfusiones: '',
      detallesAdicionales: ''
    },
    interrogatorioSistemas: {},
    exploracionFisica: {
      signosVitales: {
        ta: '',
        fc: '',
        fr: '',
        temperatura: '',
        peso: '',
        talla: '',
        imc: ''
      },
      exploracion: {}
    },
    examenCabeza: {
      sinHallazgos: true,
      craneo: '',
      cara: '',
      ojos: '',
      oidos: '',
      nariz: '',
      boca: '',
      atm: ''
    },
    articulacionCraneomandibular: {
      sinHallazgos: true,
      aperturaBucal: '',
      movimientoLateral: '',
      chasquidos: false,
      crepitacion: false,
      dolor: false,
      observaciones: ''
    },
    examenCuello: {
      sinHallazgos: true,
      gangliosLinfaticos: '',
      musculatura: '',
      tiroides: '',
      movilidad: '',
      observaciones: ''
    },
    examenIntrabucal: {
      sinHallazgos: true,
      lengua: '',
      paladarDuro: '',
      paladarBlando: '',
      mucosaYugal: '',
      pisoBoca: '',
      encias: '',
      dientes: '',
      observaciones: ''
    },
    glandulasSalivales: {
      sinHallazgos: true,
      parotida: '',
      submaxilar: '',
      sublingual: '',
      secrecion: '',
      observaciones: ''
    },
    oclusion: {
      sinHallazgos: true,
      clasificacionAngle: '',
      overjet: '',
      overbite: '',
      mordidaCruzada: false,
      mordidaAbierta: false,
      observaciones: ''
    },
    relacionDientes: {
      sinHallazgos: true,
      relacionMolar: '',
      relacionCanina: '',
      apiñamiento: false,
      diastemas: false,
      observaciones: ''
    },
    lineaMedia: {
      sinHallazgos: true,
      coincidente: false,
      desviacion: '',
      observaciones: ''
    },
    frenillos: {
      sinHallazgos: true,
      labialSuperior: '',
      labialInferior: '',
      lingual: '',
      observaciones: ''
    },
    diagnostico: {
      principal: '',
      secundarios: '',
      observaciones: ''
    },
    pronostico: {
      general: '',
      particular: '',
      observaciones: ''
    }
  });

  const handleFormChange = (section: keyof FormDataState, data: any) => {
    setFormData(prev => ({
      ...prev,
      [section]: data
    }));
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
                  onChange={(data) => handleFormChange('antecedentesHeredoFamiliares', data)}
                />
                <AntecedentesPersonalesNoPatologicos
                  formData={formData}
                />
                <AntecedentesPersonalesPatologicos
                  formData={formData}
                />
                <AntecedentesAlergicos
                  formData={formData}
                />
                <AntecedentesQuirurgicos
                  formData={formData}
                  handleAntecedenteQuirurgicoChange={(field, value) => {
                    const updatedData = {
                      ...formData.antecedentesQuirurgicos,
                      [field]: value
                    };
                    handleFormChange('antecedentesQuirurgicos', updatedData);
                  }}
                />
                <AntecedentesHemorragicos
                  formData={formData}
                  handleAntecedenteHemorragicoChange={(field, value) => {
                    const updatedData = {
                      ...formData.antecedentesHemorragicos,
                      [field]: value
                    };
                    handleFormChange('antecedentesHemorragicos', updatedData);
                  }}
                />
              </div>
            </TabsContent>

            <TabsContent value="exploracion">
              <div className="space-y-8">
                <InterrogatorioSistemas
                  formData={formData}
                  onChange={(data) => handleFormChange('interrogatorioSistemas', data)}
                />
                <ExploracionFisica
                  formData={formData}
                  onChange={(data) => handleFormChange('exploracionFisica', data)}
                />
              </div>
            </TabsContent>

            <TabsContent value="examenes">
              <div className="space-y-8">
                <ExamenCabeza
                  formData={formData}
                  onChange={(data) => handleFormChange('examenCabeza', data)}
                />
                <ArticulacionCraneomandibular
                  formData={formData}
                  onChange={(data) => handleFormChange('articulacionCraneomandibular', data)}
                />
                <ExamenCuello
                  formData={formData}
                  onChange={(data) => handleFormChange('examenCuello', data)}
                />
                <ExamenIntrabucal
                  formData={formData}
                  onChange={(data) => handleFormChange('examenIntrabucal', data)}
                />
                <GlandulasSalivales
                  formData={formData}
                  onChange={(data) => handleFormChange('glandulasSalivales', data)}
                />
                <Oclusion
                  formData={formData}
                  onChange={(data) => handleFormChange('oclusion', data)}
                />
                <RelacionDientes
                  formData={formData}
                  onChange={(data) => handleFormChange('relacionDientes', data)}
                />
                <LineaMedia
                  formData={formData}
                  onChange={(data) => handleFormChange('lineaMedia', data)}
                />
                <Frenillos
                  formData={formData}
                  onChange={(data) => handleFormChange('frenillos', data)}
                />
              </div>
            </TabsContent>

            <TabsContent value="diagnostico">
              <Diagnostico
                formData={formData}
                onChange={(data) => handleFormChange('diagnostico', data)}
              />
            </TabsContent>

            <TabsContent value="pronostico">
              <Pronostico
                formData={formData}
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
