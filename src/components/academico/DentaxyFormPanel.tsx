import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Loader2, Wand2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useHistoriaClinica } from '@/hooks/useHistoriaClinica';
import { toast } from '@/hooks/use-toast';

// Import all form sections
import PadecimientoActual from '@/components/historia-clinica/PadecimientoActual';
import AntecedentesHeredoFamiliares from '@/components/historia-clinica/AntecedentesHeredoFamiliares';
import AntecedentesPersonalesNoPatologicos from '@/components/historia-clinica/AntecedentesPersonalesNoPatologicos';
import AntecedentesPersonalesPatologicos from '@/components/historia-clinica/AntecedentesPersonalesPatologicos';
import AntecedentesAlergicos from '@/components/historia-clinica/AntecedentesAlergicos';
import AntecedentesQuirurgicos from '@/components/historia-clinica/AntecedentesQuirurgicos';
import AntecedentesHemorragicos from '@/components/historia-clinica/AntecedentesHemorragicos';
import AntecedentesGinecoObstetricos from '@/components/historia-clinica/AntecedentesGinecoObstetricos';
import InterrogatorioSistemas from '@/components/historia-clinica/InterrogatorioSistemas';
import ExploracionFisica from '@/components/historia-clinica/ExploracionFisica';
import ExamenCabeza from '@/components/historia-clinica/ExamenCabeza';
import ArticulacionCraneomandibular from '@/components/historia-clinica/ArticulacionCraneomandibular';
import ExamenCuello from '@/components/historia-clinica/ExamenCuello';
import ExamenIntrabucal from '@/components/historia-clinica/ExamenIntrabucal';
import GlandulasSalivales from '@/components/historia-clinica/GlandulasSalivales';
import Oclusion from '@/components/historia-clinica/Oclusion';
import RelacionDientes from '@/components/historia-clinica/RelacionDientes';
import LineaMedia from '@/components/historia-clinica/LineaMedia';
import Frenillos from '@/components/historia-clinica/Frenillos';
import Diagnostico from '@/components/historia-clinica/Diagnostico';
import Pronostico from '@/components/historia-clinica/Pronostico';

interface GenerationProgress {
  current: number;
  total: number;
  currentSection: string;
}

interface DentaxyFormPanelProps {
  onGeneracionCompleta: (datos: Record<string, string>) => void;
  onSeccionGenerada: (seccionId: string, contenido: string) => void;
  onGeneracionIniciada: (seccionId: string) => void;
}

// Mapping of section IDs for synchronization with Smile panel
const seccionesGenerables = [
  { id: 'padecimiento', nombre: 'Padecimiento Actual' },
  { id: 'heredofamiliares', nombre: 'Antecedentes Heredofamiliares' },
  { id: 'noPatologicos', nombre: 'Antecedentes No Patológicos' },
  { id: 'patologicos', nombre: 'Antecedentes Patológicos' },
  { id: 'alergicos', nombre: 'Antecedentes Alérgicos' },
  { id: 'quirurgicos', nombre: 'Antecedentes Quirúrgicos' },
  { id: 'hemorragicos', nombre: 'Antecedentes Hemorrágicos' },
  { id: 'ginecoObstetricos', nombre: 'Antecedentes Gineco-obstétricos' },
  { id: 'interrogatorio', nombre: 'Interrogatorio por Sistemas' },
  { id: 'exploracionFisica', nombre: 'Exploración Física' },
  { id: 'cabeza', nombre: 'Examen de Cabeza' },
  { id: 'atm', nombre: 'Articulación Craneomandibular' },
  { id: 'cuello', nombre: 'Examen de Cuello' },
  { id: 'intrabucal', nombre: 'Examen Intrabucal' },
  { id: 'salivales', nombre: 'Glándulas Salivales' },
  { id: 'oclusion', nombre: 'Oclusión' },
  { id: 'relacionDientes', nombre: 'Relación de Dientes' },
  { id: 'lineaMedia', nombre: 'Línea Media' },
  { id: 'frenillos', nombre: 'Frenillos' },
  { id: 'diagnostico', nombre: 'Diagnóstico' },
  { id: 'pronostico', nombre: 'Pronóstico' },
];

// Demo responses for each section (simulated AI generation)
const respuestasDemo: Record<string, string> = {
  padecimiento: 'Paciente masculino de 28 años que acude a consulta por presentar dolor dental en región posterior mandibular derecha de 5 días de evolución, de intensidad moderada a severa (EVA 7/10), de tipo pulsátil, exacerbado con alimentos fríos, calientes y dulces. El paciente refiere que el dolor se intensifica por las noches, impidiendo el descanso adecuado.',
  heredofamiliares: 'Madre de 54 años con diagnóstico de diabetes mellitus tipo 2 en tratamiento con metformina. Padre de 58 años con hipertensión arterial sistémica controlada. Hermano mayor con antecedente de enfermedad periodontal. Abuelo paterno finado por infarto agudo al miocardio. Se niegan antecedentes de neoplasias, enfermedades autoinmunes o coagulopatías en la familia.',
  noPatologicos: 'Paciente con hábitos de higiene bucal regulares, refiere cepillado dental 2 veces al día sin uso de hilo dental ni enjuague bucal. Alimentación rica en carbohidratos y azúcares refinados, con consumo frecuente de bebidas carbonatadas. Niega tabaquismo activo. Refiere consumo social de alcohol los fines de semana. Última visita dental hace aproximadamente 18 meses.',
  patologicos: 'Paciente sin antecedentes patológicos relevantes. Niega diabetes mellitus, hipertensión arterial, cardiopatías, nefropatías o hepatopatías. Sin antecedentes de hospitalizaciones previas. No refiere enfermedades crónico-degenerativas ni infecciosas. Estado actual de salud general aparentemente bueno.',
  alergicos: 'Paciente niega alergia conocida a medicamentos, incluyendo penicilinas, sulfas y analgésicos. Sin antecedentes de reacciones adversas a anestésicos locales. Niega alergias alimentarias o a materiales dentales (látex, metales, acrílicos). No reporta antecedentes de asma o rinitis alérgica.',
  quirurgicos: 'Paciente con antecedente de apendicectomía laparoscópica a los 22 años sin complicaciones. Niega otras intervenciones quirúrgicas. Sin antecedentes de cirugías bucales o maxilofaciales previas. No ha requerido exodoncias ni procedimientos de cirugía menor oral.',
  hemorragicos: 'Paciente niega antecedentes de hemorragias prolongadas o espontáneas. Sin historia de epistaxis frecuentes, gingivorragia espontánea o hematomas. Refiere cicatrización adecuada en heridas previas. No utiliza anticoagulantes ni antiagregantes plaquetarios. Niega diagnóstico de coagulopatías o trastornos de la hemostasia.',
  ginecoObstetricos: 'No aplica - Paciente masculino.',
  interrogatorio: 'Aparato cardiovascular: Sin alteraciones, niega palpitaciones o disnea. Aparato respiratorio: Sin síntomas respiratorios, niega tos o dificultad respiratoria. Aparato digestivo: Función gastrointestinal normal, sin alteraciones del hábito intestinal. Aparato urinario: Sin síntomas urinarios. Sistema nervioso: Cefalea ocasional relacionada con el dolor dental actual. Sin alteraciones en la sensibilidad.',
  exploracionFisica: 'Signos vitales: TA 120/80 mmHg, FC 72 lpm, FR 16 rpm, Temp 36.5°C. Paciente consciente, orientado, en buen estado general. Facies de dolor leve. Constitución normolínea. Marcha y movimientos sin alteraciones. Piel y tegumentos hidratados, sin lesiones aparentes.',
  cabeza: 'Normocéfalo, sin exostosis ni deformidades palpables. Cabello de implantación normal. Sin adenopatías cervicales palpables. Ojos simétricos, pupilas normorreactivas. Oídos sin alteraciones aparentes. Nariz sin desviación septal evidente.',
  atm: 'Articulación temporomandibular bilateral sin dolor a la palpación. Apertura bucal de 45mm sin desviación. Sin chasquidos ni crepitaciones durante los movimientos mandibulares. Movimientos de lateralidad y protrusión sin limitación ni dolor.',
  cuello: 'Cuello cilíndrico, móvil, sin adenopatías cervicales palpables. Tiroides de tamaño y consistencia normal. Pulsos carotídeos presentes, simétricos. Sin ingurgitación yugular. Tráquea central.',
  intrabucal: 'Mucosa oral rosada, hidratada, sin lesiones aparentes. Lengua móvil, de tamaño normal, sin alteraciones de la superficie. Piso de boca blando, depresible. Paladar duro y blando sin alteraciones. Orofaringe sin datos de inflamación. Encías con ligero sangrado en zona de molar afectado.',
  salivales: 'Glándulas salivales mayores (parótida, submandibular y sublingual) sin aumento de volumen ni dolor a la palpación. Conductos de Stenon y Wharton permeables. Flujo salival aparentemente normal.',
  oclusion: 'Clase I de Angle bilateral. Overjet de 2mm, overbite de 2mm. Línea media dental coincidente con línea media facial. Curva de Spee conservada. Sin interferencias oclusales evidentes en movimientos excéntricos.',
  relacionDientes: 'Relación molar y canina clase I bilateral. Guía canina funcional en movimientos de lateralidad. Guía incisiva presente en movimientos de protrusión. Sin contactos prematuros identificables.',
  lineaMedia: 'Línea media dentaria superior e inferior coincidentes entre sí y con la línea media facial. Sin desviaciones detectables en reposo ni en apertura bucal.',
  frenillos: 'Frenillo labial superior de inserción normal, sin tracción gingival. Frenillo labial inferior sin alteraciones. Frenillo lingual de longitud y movilidad adecuadas, sin anquiloglosia.',
  diagnostico: 'Diagnóstico presuntivo: Pulpitis irreversible sintomática en órgano dentario 46. Diagnóstico diferencial: Periodontitis apical aguda, fractura dental vertical. Se sugiere toma de radiografía periapical para confirmar diagnóstico y determinar plan de tratamiento.',
  pronostico: 'Pronóstico favorable con tratamiento endodóntico oportuno y restauración definitiva posterior. El éxito del tratamiento dependerá de la adherencia del paciente al plan propuesto y la modificación de hábitos de higiene oral. Se recomienda seguimiento a los 6 y 12 meses post-tratamiento.',
};

export const DentaxyFormPanel: React.FC<DentaxyFormPanelProps> = ({
  onGeneracionCompleta,
  onSeccionGenerada,
  onGeneracionIniciada,
}) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState<GenerationProgress | null>(null);
  const [esMujer] = useState(false);

  const {
    formData,
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
    handleAntecedenteGinecoObstetricoChange,
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
  } = useHistoriaClinica();

  const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  const handleGenerarTodasRedacciones = async () => {
    setIsGenerating(true);
    const resultados: Record<string, string> = {};
    const totalSecciones = seccionesGenerables.length;

    toast({
      title: "Iniciando generación",
      description: "Dentaxy IA procesará todas las secciones automáticamente",
    });

    for (let i = 0; i < totalSecciones; i++) {
      const seccion = seccionesGenerables[i];
      
      // Skip gineco if not female
      if (seccion.id === 'ginecoObstetricos' && !esMujer) {
        continue;
      }

      setProgress({
        current: i + 1,
        total: totalSecciones,
        currentSection: seccion.nombre,
      });

      // Notify that we're starting this section
      onGeneracionIniciada(seccion.id);

      // Simulate AI generation time
      await delay(400 + Math.random() * 300);

      // Get demo content
      const contenido = respuestasDemo[seccion.id] || `Redacción generada para ${seccion.nombre}`;
      resultados[seccion.id] = contenido;

      // Notify section completed
      onSeccionGenerada(seccion.id, contenido);
    }

    setIsGenerating(false);
    setProgress(null);

    toast({
      title: "Historia Clínica Generada",
      description: "Todas las secciones han sido redactadas y transferidas a Smile",
    });

    onGeneracionCompleta(resultados);
  };

  return (
    <div className="h-full flex flex-col overflow-hidden bg-gradient-to-br from-background to-emerald-500/5">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-500 to-emerald-600 px-6 py-4 flex-shrink-0">
        <div className="flex items-center gap-3">
          <Sparkles className="h-6 w-6 text-white" />
          <div>
            <h2 className="text-lg font-black text-white">DENTAXY IA</h2>
            <p className="text-xs text-white/80">Motor de Redacción Clínica</p>
          </div>
        </div>
      </div>

      {/* Scrollable form content */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-6 space-y-6">
          {/* All form sections */}
          <div data-section="padecimiento">
            <PadecimientoActual
              formData={formData}
              handlePadecimientoChange={handlePadecimientoChange}
              handleDolorChange={handleDolorChange}
              handleSinSintomasChange={handleSinSintomasChange}
            />
          </div>

          <div data-section="heredofamiliares">
            <AntecedentesHeredoFamiliares
              formData={formData}
              handleFamiliarChange={handleFamiliarChange}
              handleCondicionChange={handleCondicionChange}
            />
          </div>

          <div data-section="noPatologicos">
            <AntecedentesPersonalesNoPatologicos
              formData={formData}
              handleAntecedenteChange={handleAntecedenteChange}
              toggleService={toggleService}
            />
          </div>

          <div data-section="patologicos">
            <AntecedentesPersonalesPatologicos
              formData={formData}
              handleAntecedentePatologicoChange={handleAntecedentePatologicoChange}
            />
          </div>

          <div data-section="alergicos">
            <AntecedentesAlergicos
              formData={formData}
              handleAntecedenteAlergicoChange={handleAntecedenteAlergicoChange}
            />
          </div>

          <div data-section="quirurgicos">
            <AntecedentesQuirurgicos
              formData={formData}
              handleAntecedenteQuirurgicoChange={handleAntecedenteQuirurgicoChange}
            />
          </div>

          <div data-section="hemorragicos">
            <AntecedentesHemorragicos
              formData={formData}
              handleAntecedenteHemorragicoChange={handleAntecedenteHemorragicoChange}
            />
          </div>

          {esMujer && (
            <div data-section="ginecoObstetricos">
              <AntecedentesGinecoObstetricos
                formData={formData}
                handleAntecedenteGinecoObstetricoChange={handleAntecedenteGinecoObstetricoChange}
              />
            </div>
          )}

          <div data-section="interrogatorio">
            <InterrogatorioSistemas
              formData={formData}
              handleInterrogatorioChange={handleInterrogatorioChange}
            />
          </div>

          <div data-section="exploracionFisica">
            <ExploracionFisica
              formData={formData}
              handleExploracionFisicaChange={handleExploracionFisicaChange}
            />
          </div>

          <div data-section="cabeza">
            <ExamenCabeza
              formData={formData}
              handleExamenCabezaChange={handleExamenCabezaChange}
            />
          </div>

          <div data-section="atm">
            <ArticulacionCraneomandibular
              formData={formData}
              handleArticulacionCraneomandibularChange={handleArticulacionCraneomandibularChange}
            />
          </div>

          <div data-section="cuello">
            <ExamenCuello
              formData={formData}
              handleExamenCuelloChange={handleExamenCuelloChange}
            />
          </div>

          <div data-section="intrabucal">
            <ExamenIntrabucal
              formData={formData}
              handleExamenIntrabucalChange={handleExamenIntrabucalChange}
            />
          </div>

          <div data-section="salivales">
            <GlandulasSalivales
              formData={formData}
              handleGlandulasSalivalesChange={handleGlandulasSalivalesChange}
            />
          </div>

          <div data-section="oclusion">
            <Oclusion
              formData={formData}
              handleOclusionChange={handleOclusionChange}
            />
          </div>

          <div data-section="relacionDientes">
            <RelacionDientes
              formData={formData}
              handleRelacionDientesChange={handleRelacionDientesChange}
            />
          </div>

          <div data-section="lineaMedia">
            <LineaMedia
              formData={formData}
              handleLineaMediaChange={handleLineaMediaChange}
            />
          </div>

          <div data-section="frenillos">
            <Frenillos
              formData={formData}
              handleFrenillosChange={handleFrenillosChange}
            />
          </div>

          <div data-section="diagnostico">
            <Diagnostico
              formData={formData}
              handleDiagnosticoChange={handleDiagnosticoChange}
            />
          </div>

          <div data-section="pronostico">
            <Pronostico
              formData={formData}
              handlePronosticoChange={handlePronosticoChange}
            />
          </div>
        </div>
      </div>

      {/* Master generation button */}
      <div className="p-6 border-t border-border/50 bg-background/80 backdrop-blur flex-shrink-0">
        <Button
          onClick={handleGenerarTodasRedacciones}
          disabled={isGenerating}
          className="w-full h-14 bg-gradient-to-r from-emerald-500 to-blue-600 hover:from-emerald-600 hover:to-blue-700 text-white font-bold text-lg shadow-xl transition-all duration-300 hover:shadow-2xl"
        >
          {isGenerating ? (
            <>
              <Loader2 className="mr-3 h-5 w-5 animate-spin" />
              Generando {progress?.current} de {progress?.total}...
            </>
          ) : (
            <>
              <Wand2 className="mr-3 h-5 w-5" />
              Generar Todas las Redacciones
            </>
          )}
        </Button>
        <p className="text-xs text-center text-muted-foreground mt-3">
          Dentaxy procesará automáticamente todas las secciones y las transferirá a Smile
        </p>
      </div>

      {/* Floating progress indicator */}
      {isGenerating && progress && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="fixed bottom-24 left-1/2 -translate-x-1/2 z-50 bg-black/90 text-white px-6 py-3 rounded-full flex items-center gap-3 shadow-2xl"
        >
          <Loader2 className="h-4 w-4 animate-spin text-emerald-400" />
          <span className="text-sm font-medium">
            {progress.currentSection}
          </span>
          <div className="w-32 h-2 bg-white/20 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-emerald-500"
              initial={{ width: 0 }}
              animate={{ width: `${(progress.current / progress.total) * 100}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
          <span className="text-xs text-white/60">
            {progress.current}/{progress.total}
          </span>
        </motion.div>
      )}
    </div>
  );
};

export default DentaxyFormPanel;
