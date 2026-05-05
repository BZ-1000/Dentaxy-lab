import React, { useState } from 'react';
import { ClipboardPaste, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';

export const seccionesSmile = [
  { id: 'padecimiento', titulo: 'I. Padecimiento Actual' },
  { id: 'heredofamiliares', titulo: 'II. Antecedentes Heredofamiliares' },
  { id: 'noPatologicos', titulo: 'III. Antecedentes Personales No Patológicos' },
  { id: 'patologicos', titulo: 'IV. Antecedentes Personales Patológicos' },
  { id: 'alergicos', titulo: 'V. Antecedentes Alérgicos' },
  { id: 'quirurgicos', titulo: 'VI. Antecedentes Quirúrgicos' },
  { id: 'hemorragicos', titulo: 'VII. Antecedentes Hemorrágicos' },
  { id: 'ginecoObstetricos', titulo: 'VIII. Antecedentes Gineco-obstétricos' },
  { id: 'interrogatorio', titulo: 'IX. Interrogatorio por Aparatos y Sistemas' },
  { id: 'exploracionFisica', titulo: 'X. Exploración Física' },
  { id: 'cabeza', titulo: 'XI. Examen de Cabeza' },
  { id: 'atm', titulo: 'XII. Articulación Craneomandibular' },
  { id: 'cuello', titulo: 'XIII. Examen de Cuello' },
  { id: 'intrabucal', titulo: 'XIV. Examen Intrabucal' },
  { id: 'salivales', titulo: 'XV. Glándulas Salivales' },
  { id: 'oclusion', titulo: 'XVI. Oclusión' },
  { id: 'relacionDientes', titulo: 'XVII. Relación de Dientes' },
  { id: 'lineaMedia', titulo: 'XVIII. Línea Media' },
  { id: 'frenillos', titulo: 'XIX. Frenillos' },
  { id: 'diagnostico', titulo: 'XX. Diagnóstico' },
  { id: 'pronostico', titulo: 'XXI. Pronóstico' },
];

interface SmileEspejoPanelProps {
  contenidoRecibido: Record<string, string | React.ReactNode>;
  formData?: any;
  seccionActual?: string;
  todasCompletas?: boolean;
  isGenerating?: boolean;
  copiedContent?: Record<string, string>;
}

export const SmileEspejoPanel: React.FC<SmileEspejoPanelProps> = ({
  contenidoRecibido,
  formData,
  seccionActual,
  copiedContent,
}) => {
  const [pastedData, setPastedData] = useState<any>(null);

  React.useEffect(() => {
    const handleCopyTrigger = async () => {
      try {
        // Formatear el contenido para copiar
        // Mapeamos los titulos de secciones a su contenido
        const sectionTitles: Record<string, string> = seccionesSmile.reduce((acc, curr) => ({ ...acc, [curr.id]: curr.titulo }), {});

        const textToCopy = Object.entries(contenidoRecibido)
          .sort((a, b) => {
            // Ordenar segun el orden original de seccionesSmile si es posible
            const idxA = seccionesSmile.findIndex(s => s.id === a[0]);
            const idxB = seccionesSmile.findIndex(s => s.id === b[0]);
            return (idxA >= 0 && idxB >= 0) ? idxA - idxB : 0;
          })
          .map(([key, value]) => {
            const title = sectionTitles[key] || key.toUpperCase();
            // Handle React Node content (Animation) gracefully
            const textContent = typeof value === 'string' ? value : "[Contenido Animado - Visualización Solamente]";
            return `${title}\n${textContent}`;
          })
          .join('\n\n');

        if (!textToCopy) {
          toast({ title: "Sin contenido", description: "No hay información para copiar.", variant: "destructive", duration: 2000 });
          return;
        }

        await navigator.clipboard.writeText(textToCopy);
        toast({
          title: "Copiado al portapapeles",
          description: "La historia clínica ha sido copiada con éxito.",
          duration: 3000,
          className: "bg-green-50 border-green-200 text-green-800"
        });
      } catch (err) {
        console.error('Error al copiar:', err);
        toast({ title: "Error", description: "No se pudo copiar el contenido.", variant: "destructive" });
      }
    };

    const handlePasteTrigger = () => {
      if (formData) {
        setPastedData(formData);
        toast({
          title: "Información Pegada",
          description: "Los datos han sido distribuidos en los campos correspondientes.",
          className: "bg-blue-50 border-blue-200 text-blue-800"
        });
      } else {
        toast({ title: "Sin datos", description: "No hay datos estructurados para pegar.", variant: "destructive" });
      }
    };

    const handleClearTrigger = () => {
      setPastedData(null);
      toast({ title: "Panel Limpiado", description: "Se ha limpiado la vista previa." });
    };

    window.addEventListener('dentaxy-copy-trigger', handleCopyTrigger);
    window.addEventListener('dentaxy-paste-trigger', handlePasteTrigger);
    window.addEventListener('dentaxy-clear-trigger', handleClearTrigger);

    return () => {
      window.removeEventListener('dentaxy-copy-trigger', handleCopyTrigger);
      window.removeEventListener('dentaxy-paste-trigger', handlePasteTrigger);
      window.removeEventListener('dentaxy-clear-trigger', handleClearTrigger);
    };
  }, [contenidoRecibido, formData]);

  // Derived variables for render
  const displayData = pastedData || formData;
  const atm = displayData?.articulacionCraneomandibular;


  return (
    <div className="h-full flex flex-col font-sans relative" style={{ backgroundColor: '#eef2f5' }}>

      {/* Header */}
      <div className="px-4 py-3 flex items-center shadow-sm border-b border-blue-300"
        style={{ backgroundColor: '#4766ac' }}>
        <div className="flex flex-col">
          <span className="text-white font-bold text-sm tracking-wide uppercase">Smile - Expediente</span>
          <span className="text-blue-100 text-[10px]">Vista Previa de Redacción</span>
        </div>
      </div>

      {/* Content List */}
      <div className="flex-1 overflow-y-auto p-5 space-y-6">
        {seccionesSmile.map((seccion) => {
          const isActive = seccionActual === seccion.id;
          const content = copiedContent?.[seccion.id] || contenidoRecibido[seccion.id] || '';

          if (seccion.id === 'noPatologicos') {
            let parsedNoPatologicos: any = {};
            if (content) {
              try {
                parsedNoPatologicos = JSON.parse(content);
              } catch (e) {
                parsedNoPatologicos = {};
              }
            }

            const getNoPatologicoText = (key: string) => {
              if (parsedNoPatologicos[key]) return parsedNoPatologicos[key];
              return '';
            }

            return (
              <div key={seccion.id} className="flex flex-col gap-3 pb-2 border-b border-gray-200/50 last:border-0">
                {/* Main Section Title */}
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-[#2c3e50] uppercase tracking-tight">
                    {seccion.titulo}
                  </span>
                  {content && !copiedContent?.[seccion.id] && (
                    <span className="text-[9px] text-blue-600 font-bold bg-blue-50 px-1 rounded animate-pulse">
                      RECIBIENDO...
                    </span>
                  )}
                </div>

                {/* Sub-sections Grid */}
                <div className="grid grid-cols-1 gap-3 pl-2">
                  {[
                    { label: 'Servicios Domiciliarios', key: 'servicios' },
                    { label: 'Higiene de la Vivienda', key: 'higieneVivienda' },
                    { label: 'Higiene Personal', key: 'higienePersonal' },
                    { label: 'Higiene Bucal', key: 'higieneBucal' },
                    { label: 'Alimentación', key: 'alimentacion' }
                  ].map((sub) => (
                    <div key={sub.label} className="flex flex-col gap-1">
                      <span className="text-[11px] font-semibold text-gray-600 uppercase tracking-wide">
                        {sub.label}
                      </span>
                      <textarea
                        readOnly
                        value={getNoPatologicoText(sub.key)}
                        rows={2}
                        className={`
                          w-full resize-none text-[12px] p-2 leading-tight
                          border rounded-sm
                          focus:outline-none focus:border-blue-400
                          bg-white text-gray-600
                        `}
                        style={{
                          border: '1px solid #d1d5db',
                          boxShadow: 'inset 1px 1px 2px rgba(0,0,0,0.03)',
                        }}
                      />
                    </div>
                  ))}
                </div>
              </div>
            );
          }

          if (seccion.id === 'patologicos') {
            // Parses content (which might be JSON string) or uses pasted data logic
            // NOTE: pastedData logic relies on formData, but we want the TEXT.
            // content contains the text (as stringified JSON).

            let parsedPatologicos: any = {};
            if (content) {
              try {
                parsedPatologicos = JSON.parse(content);
              } catch (e) {
                // Fallback if not JSON
                parsedPatologicos = {};
              }
            }

            // Helper to get text for a sub-section
            const getPatologicoText = (key: string) => {
              // Return generated text if available
              if (parsedPatologicos[key]) return parsedPatologicos[key];
              return '';
            }

            return (
              <div key={seccion.id} className="flex flex-col gap-3 pb-2 border-b border-gray-200/50 last:border-0">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-[#2c3e50] uppercase tracking-tight">
                    {seccion.titulo}
                  </span>
                  {content && !copiedContent?.[seccion.id] && (
                    <span className="text-[9px] text-blue-600 font-bold bg-blue-50 px-1 rounded animate-pulse">
                      RECIBIENDO...
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-1 gap-3 pl-2">
                  {[
                    { label: 'Nutricionales', key: 'nutricionales' },
                    { label: 'Cardiacos', key: 'cardiacos' },
                    { label: 'Hepáticos', key: 'hepaticos' },
                    { label: 'Enfermedades de Transmisión Sexual', key: 'enfermedadesTransmisionSexual' },
                    { label: 'Enfermedades Eruptivas', key: 'enfermedadesEruptivas' },
                    { label: 'Pulmonares', key: 'pulmonares' },
                    { label: 'Infecciones Parasitarias', key: 'infecciosasParasitarias' },
                    { label: 'Otros Padecimientos', key: 'otrosPadecimientos' }
                  ].map((sub) => (
                    <div key={sub.label} className="flex flex-col gap-1">
                      <span className="text-[11px] font-semibold text-gray-600 uppercase tracking-wide">
                        {sub.label}
                      </span>
                      <textarea
                        readOnly
                        value={getPatologicoText(sub.key)}
                        rows={2}
                        className={`
                          w-full resize-none text-[12px] p-2 leading-tight
                          border rounded-sm
                          focus:outline-none focus:border-blue-400
                          bg-white text-gray-600
                        `}
                        style={{
                          border: '1px solid #d1d5db',
                          boxShadow: 'inset 1px 1px 2px rgba(0,0,0,0.03)',
                        }}
                      />
                    </div>
                  ))}
                </div>
              </div>
            );
          }

          if (seccion.id === 'alergicos') {
            return (
              <div key={seccion.id} className="flex flex-col gap-3 pb-2 border-b border-gray-200/50 last:border-0">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-[#2c3e50] uppercase tracking-tight">
                    {seccion.titulo}
                  </span>
                  {content && !copiedContent?.[seccion.id] && (
                    <span className="text-[9px] text-blue-600 font-bold bg-blue-50 px-1 rounded animate-pulse">
                      RECIBIENDO...
                    </span>
                  )}
                </div>

                <div className="pl-2 flex flex-col gap-4">
                  {/* Alergias Generales */}
                  <div className="flex flex-col gap-2">
                    <span className="text-[11px] font-semibold text-gray-700">¿Ha presentado alguna reacción alérgica a alguno de los siguientes?</span>
                    <div className="flex gap-2">
                      {['Medicamentos', 'Alimentos', 'Entorno ambiental'].map(label => (
                        <button key={label} className="px-3 py-1 border border-gray-300 bg-gray-50 text-[11px] text-gray-600 rounded-sm hover:bg-gray-100 uppercase transition-colors">
                          {label}
                        </button>
                      ))}
                    </div>

                    <div className="mt-1 flex flex-col gap-1">
                      <span className="text-[10px] font-bold text-gray-500 uppercase">¿Cuáles?</span>
                      <textarea
                        readOnly
                        rows={2}
                        placeholder="Especifique qué medicamentos, alimentos o elementos ambientales"
                        className="w-full resize-none text-[12px] p-2 border border-gray-300 rounded-sm bg-white text-gray-600 focus:outline-none focus:border-blue-400"
                        style={{ boxShadow: 'inset 1px 1px 2px rgba(0,0,0,0.03)' }}
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <span className="text-[10px] font-bold text-gray-500 uppercase">¿A qué específicamente?</span>
                      <textarea
                        readOnly
                        rows={2}
                        placeholder="Describa específicamente la alergia"
                        className="w-full resize-none text-[12px] p-2 border border-gray-300 rounded-sm bg-white text-gray-600 focus:outline-none focus:border-blue-400"
                        style={{ boxShadow: 'inset 1px 1px 2px rgba(0,0,0,0.03)' }}
                      />
                    </div>
                  </div>

                  {/* Anestesia */}
                  <div className="flex flex-col gap-2 border-t border-gray-100 pt-3">
                    <span className="text-[11px] font-semibold text-gray-700">¿Le han administrado anestesia general y/o local?</span>
                    <div className="flex gap-2">
                      {['Sí', 'No'].map(label => (
                        <button key={label} className="px-4 py-1 border border-gray-300 bg-gray-50 text-[11px] text-gray-600 rounded-sm hover:bg-gray-100 uppercase min-w-[50px] transition-colors">
                          {label}
                        </button>
                      ))}
                    </div>
                    <div className="mt-1 flex flex-col gap-1">
                      <span className="text-[10px] font-bold text-gray-500 uppercase">Especifique el tipo de anestesia y procedimiento:</span>
                      <textarea
                        readOnly
                        rows={2}
                        placeholder="Tipo de anestesia y procedimiento"
                        className="w-full resize-none text-[12px] p-2 border border-gray-300 rounded-sm bg-white text-gray-600 focus:outline-none focus:border-blue-400"
                        style={{ boxShadow: 'inset 1px 1px 2px rgba(0,0,0,0.03)' }}
                      />
                    </div>
                  </div>

                  {/* Reacción Adversa */}
                  <div className="flex flex-col gap-2 border-t border-gray-100 pt-3">
                    <span className="text-[11px] font-semibold text-gray-700">¿Tuvo alguna reacción adversa a la anestesia?</span>
                    <div className="flex gap-2">
                      {['Sí', 'No'].map(label => (
                        <button key={label} className="px-4 py-1 border border-gray-300 bg-gray-50 text-[11px] text-gray-600 rounded-sm hover:bg-gray-100 uppercase min-w-[50px] transition-colors">
                          {label}
                        </button>
                      ))}
                    </div>
                    <div className="mt-1 flex flex-col gap-1">
                      <span className="text-[10px] font-bold text-gray-500 uppercase">Si respondió que sí, especifique la reacción:</span>
                      <textarea
                        readOnly
                        rows={2}
                        placeholder="Descripción de la reacción adversa"
                        className="w-full resize-none text-[12px] p-2 border border-gray-300 rounded-sm bg-white text-gray-600 focus:outline-none focus:border-blue-400"
                        style={{ boxShadow: 'inset 1px 1px 2px rgba(0,0,0,0.03)' }}
                      />
                    </div>
                  </div>

                  {/* Adicciones */}
                  <div className="flex flex-col gap-2 border-t border-gray-100 pt-3">
                    <span className="text-[11px] font-semibold text-gray-700">¿Tiene alguna adicción actual o pasada?</span>
                    <div className="flex gap-2">
                      {['Tabaco', 'Alcohol', 'Drogas'].map(label => (
                        <button key={label} className="px-3 py-1 border border-gray-300 bg-gray-50 text-[11px] text-gray-600 rounded-sm hover:bg-gray-100 uppercase transition-colors">
                          {label}
                        </button>
                      ))}
                    </div>
                    <div className="mt-1 flex flex-col gap-1">
                      <span className="text-[10px] font-bold text-gray-500 uppercase">Especifique tipo, frecuencia y duración:</span>
                      <textarea
                        readOnly
                        rows={2}
                        placeholder="Especifique..."
                        className="w-full resize-none text-[12px] p-2 border border-gray-300 rounded-sm bg-white text-gray-600 focus:outline-none focus:border-blue-400"
                        style={{ boxShadow: 'inset 1px 1px 2px rgba(0,0,0,0.03)' }}
                      />
                    </div>
                  </div>

                </div>
              </div>
            );
          }



          if (seccion.id === 'interrogatorio') {
            return (
              <div key={seccion.id} className="flex flex-col gap-3 pb-2 border-b border-gray-200/50 last:border-0">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-[#2c3e50] uppercase tracking-tight">
                    {seccion.titulo}
                  </span>
                  {content && !copiedContent?.[seccion.id] && (
                    <span className="text-[9px] text-blue-600 font-bold bg-blue-50 px-1 rounded animate-pulse">
                      RECIBIENDO...
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-1 gap-3 pl-2">
                  {[
                    { label: 'Aparato Digestivo', key: 'digestivo' },
                    { label: 'Aparato Respiratorio', key: 'respiratorio' },
                    { label: 'Aparato Cardiovascular', key: 'cardiovascular' },
                    { label: 'Aparato Genito-urinario', key: 'genitourinario' },
                    { label: 'Sistema Endocrino', key: 'endocrino' },
                    { label: 'Sistema Tegumentario', key: 'tegumentario' },
                    { label: 'Sistema Musculo-esquelético', key: 'musculoesqueletico' },
                    { label: 'Sistema Nervioso', key: 'nervioso' }
                  ].map((sub) => (
                    <div key={sub.label} className="flex flex-col gap-1">
                      <span className="text-[11px] font-semibold text-gray-600 uppercase tracking-wide">
                        {sub.label}
                      </span>
                      <textarea
                        readOnly
                        rows={2}
                        className={`
                          w-full resize-none text-[12px] p-2 leading-tight
                          border rounded-sm
                          focus:outline-none focus:border-blue-400
                          bg-white text-gray-600
                        `}
                        style={{
                          border: '1px solid #d1d5db',
                          boxShadow: 'inset 1px 1px 2px rgba(0,0,0,0.03)',
                        }}
                      />
                    </div>
                  ))}
                </div>
              </div>
            );
          }

          if (seccion.id === 'quirurgicos') {
            return (
              <div key={seccion.id} className="flex flex-col gap-3 pb-2 border-b border-gray-200/50 last:border-0">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-[#2c3e50] uppercase tracking-tight">
                    {seccion.titulo}
                  </span>
                  {content && !copiedContent?.[seccion.id] && (
                    <span className="text-[9px] text-blue-600 font-bold bg-blue-50 px-1 rounded animate-pulse">
                      RECIBIENDO...
                    </span>
                  )}
                </div>

                <div className="pl-2 flex flex-col gap-4">

                  {/* Tratamiento Médico */}
                  <div className="flex flex-col gap-2">
                    <span className="text-[11px] font-semibold text-gray-700">¿Ha estado sometido(a) a algún tratamiento médico en los últimos dos meses?</span>
                    <div className="flex gap-2">
                      {['Sí', 'No'].map(label => (
                        <button key={label} className="px-4 py-1 border border-gray-300 bg-gray-50 text-[11px] text-gray-600 rounded-sm hover:bg-gray-100 uppercase min-w-[50px] transition-colors">
                          {label}
                        </button>
                      ))}
                    </div>
                    <div className="mt-1 flex flex-col gap-1">
                      <span className="text-[10px] font-bold text-gray-500 uppercase">Motivo del tratamiento:</span>
                      <textarea
                        readOnly
                        rows={2}
                        placeholder="Especifique el motivo"
                        className="w-full resize-none text-[12px] p-2 border border-gray-300 rounded-sm bg-white text-gray-600 focus:outline-none focus:border-blue-400"
                        style={{ boxShadow: 'inset 1px 1px 2px rgba(0,0,0,0.03)' }}
                      />
                    </div>
                  </div>

                  {/* Hospitalización */}
                  <div className="flex flex-col gap-2 border-t border-gray-100 pt-3">
                    <span className="text-[11px] font-semibold text-gray-700">¿Ha sido hospitalizado(a) en los últimos dos meses?</span>
                    <div className="flex gap-2">
                      {['Sí', 'No'].map(label => (
                        <button key={label} className="px-4 py-1 border border-gray-300 bg-gray-50 text-[11px] text-gray-600 rounded-sm hover:bg-gray-100 uppercase min-w-[50px] transition-colors">
                          {label}
                        </button>
                      ))}
                    </div>
                    <div className="mt-1 flex flex-col gap-1">
                      <span className="text-[10px] font-bold text-gray-500 uppercase">Motivo de la hospitalización:</span>
                      <textarea
                        readOnly
                        rows={2}
                        placeholder="Especifique el motivo"
                        className="w-full resize-none text-[12px] p-2 border border-gray-300 rounded-sm bg-white text-gray-600 focus:outline-none focus:border-blue-400"
                        style={{ boxShadow: 'inset 1px 1px 2px rgba(0,0,0,0.03)' }}
                      />
                    </div>
                  </div>

                  {/* Medicamentos */}
                  <div className="flex flex-col gap-2 border-t border-gray-100 pt-3">
                    <span className="text-[11px] font-semibold text-gray-700">¿Está tomando actualmente algún medicamento?</span>
                    <div className="flex gap-2">
                      {['Sí', 'No'].map(label => (
                        <button key={label} className="px-4 py-1 border border-gray-300 bg-gray-50 text-[11px] text-gray-600 rounded-sm hover:bg-gray-100 uppercase min-w-[50px] transition-colors">
                          {label}
                        </button>
                      ))}
                    </div>
                    <div className="mt-1 flex flex-col gap-1">
                      <span className="text-[10px] font-bold text-gray-500 uppercase">¿Cuál o cuáles?</span>
                      <textarea
                        readOnly
                        rows={2}
                        placeholder="Liste los medicamentos"
                        className="w-full resize-none text-[12px] p-2 border border-gray-300 rounded-sm bg-white text-gray-600 focus:outline-none focus:border-blue-400"
                        style={{ boxShadow: 'inset 1px 1px 2px rgba(0,0,0,0.03)' }}
                      />
                    </div>
                    <div className="mt-1 flex flex-col gap-1">
                      <span className="text-[10px] font-bold text-gray-500 uppercase">Motivo por el cual toma estos medicamentos:</span>
                      <textarea
                        readOnly
                        rows={2}
                        placeholder="Explique por qué toma estos medicamentos"
                        className="w-full resize-none text-[12px] p-2 border border-gray-300 rounded-sm bg-white text-gray-600 focus:outline-none focus:border-blue-400"
                        style={{ boxShadow: 'inset 1px 1px 2px rgba(0,0,0,0.03)' }}
                      />
                    </div>
                  </div>

                </div>
              </div>
            );
          }

          if (seccion.id === 'hemorragicos') {
            return (
              <div key={seccion.id} className="flex flex-col gap-3 pb-2 border-b border-gray-200/50 last:border-0">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-[#2c3e50] uppercase tracking-tight">
                    {seccion.titulo}
                  </span>
                  {content && !copiedContent?.[seccion.id] && (
                    <span className="text-[9px] text-blue-600 font-bold bg-blue-50 px-1 rounded animate-pulse">
                      RECIBIENDO...
                    </span>
                  )}
                </div>

                <div className="pl-2 flex flex-col gap-4">
                  {/* Transfusión */}
                  <div className="flex flex-col gap-2">
                    <span className="text-[11px] font-semibold text-gray-700">¿Le han transfundido sangre o algún derivado de la misma?</span>
                    <div className="flex gap-2">
                      {['Sí', 'No'].map(label => (
                        <button key={label} className="px-4 py-1 border border-gray-300 bg-gray-50 text-[11px] text-gray-600 rounded-sm hover:bg-gray-100 uppercase min-w-[50px] transition-colors">
                          {label}
                        </button>
                      ))}
                    </div>
                    <div className="mt-1 flex flex-col gap-1">
                      <span className="text-[10px] font-bold text-gray-500 uppercase">Motivo de la transfusión:</span>
                      <textarea
                        readOnly
                        rows={2}
                        placeholder="Especifique el motivo"
                        className="w-full resize-none text-[12px] p-2 border border-gray-300 rounded-sm bg-white text-gray-600 focus:outline-none focus:border-blue-400"
                        style={{ boxShadow: 'inset 1px 1px 2px rgba(0,0,0,0.03)' }}
                      />
                    </div>
                    <div className="mt-1 flex flex-col gap-1">
                      <span className="text-[10px] font-bold text-gray-500 uppercase">Fecha de la transfusión:</span>
                      <textarea
                        readOnly
                        rows={1}
                        placeholder="DD/MM/AAAA o especifique aproximadamente"
                        className="w-full resize-none text-[12px] p-2 border border-gray-300 rounded-sm bg-white text-gray-600 focus:outline-none focus:border-blue-400"
                        style={{ boxShadow: 'inset 1px 1px 2px rgba(0,0,0,0.03)' }}
                      />
                    </div>
                    <div className="mt-1 flex flex-col gap-1">
                      <span className="text-[10px] font-bold text-gray-500 uppercase">Detalles adicionales sobre antecedentes hemorrágicos:</span>
                      <textarea
                        readOnly
                        rows={2}
                        placeholder="Proporcione cualquier otra información relevante"
                        className="w-full resize-none text-[12px] p-2 border border-gray-300 rounded-sm bg-white text-gray-600 focus:outline-none focus:border-blue-400"
                        style={{ boxShadow: 'inset 1px 1px 2px rgba(0,0,0,0.03)' }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            );
          }

          if (seccion.id === 'atm') {
            return (
              <div key={seccion.id} className="flex flex-col gap-3 pb-2 border-b border-gray-200/50 last:border-0">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-[#2c3e50] uppercase tracking-tight">
                    {seccion.titulo}
                  </span>
                  {content && !copiedContent?.[seccion.id] && (
                    <span className="text-[9px] text-blue-600 font-bold bg-blue-50 px-1 rounded animate-pulse">
                      RECIBIENDO...
                    </span>
                  )}
                </div>

                <div className="pl-2 flex flex-col gap-4">

                  {/* Dolor */}
                  <div className="flex flex-col gap-2">
                    <span className="text-[11px] font-semibold text-gray-700">Dolor al masticar o hablar</span>
                    <div className="flex gap-2">
                      {['Sí', 'No'].map(label => (
                        <button key={label} className="px-4 py-1 border border-gray-300 bg-gray-50 text-[11px] text-gray-600 rounded-sm hover:bg-gray-100 uppercase min-w-[50px] transition-colors">
                          {label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Tipo de Dolor */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="flex flex-col gap-1">
                      <span className="text-[10px] font-bold text-gray-500 uppercase">Tipo de dolor:</span>
                      <textarea
                        readOnly
                        rows={2}
                        placeholder="Ej. punzante, sordo..."
                        className="w-full resize-none text-[12px] p-2 border border-gray-300 rounded-sm bg-white text-gray-600 focus:outline-none focus:border-blue-400"
                        style={{ boxShadow: 'inset 1px 1px 2px rgba(0,0,0,0.03)' }}
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <span className="text-[10px] font-bold text-gray-500 uppercase">Duración:</span>
                      <textarea
                        readOnly
                        rows={2}
                        placeholder="Ej. constante, intermitente..."
                        className="w-full resize-none text-[12px] p-2 border border-gray-300 rounded-sm bg-white text-gray-600 focus:outline-none focus:border-blue-400"
                        style={{ boxShadow: 'inset 1px 1px 2px rgba(0,0,0,0.03)' }}
                      />
                    </div>
                  </div>

                  {/* Dificultad Hablar/Masticar */}
                  <div className="flex flex-col gap-2 border-t border-gray-100 pt-3">
                    <span className="text-[11px] font-semibold text-gray-700">Dificultad al hablar o masticar</span>
                    <div className="flex gap-2">
                      {['Sí', 'No'].map(label => (
                        <button key={label} className="px-4 py-1 border border-gray-300 bg-gray-50 text-[11px] text-gray-600 rounded-sm hover:bg-gray-100 uppercase min-w-[50px] transition-colors">
                          {label}
                        </button>
                      ))}
                    </div>
                    <div className="mt-1 flex flex-col gap-1">
                      <span className="text-[10px] font-bold text-gray-500 uppercase">Motivo:</span>
                      <textarea
                        readOnly
                        rows={1}
                        placeholder="Ej. preauricular, masetero..."
                        className="w-full resize-none text-[12px] p-2 border border-gray-300 rounded-sm bg-white text-gray-600 focus:outline-none focus:border-blue-400"
                        style={{ boxShadow: 'inset 1px 1px 2px rgba(0,0,0,0.03)' }}
                      />
                    </div>
                  </div>

                  {/* Ruido Articular */}
                  <div className="flex flex-col gap-2 border-t border-gray-100 pt-3">
                    <span className="text-[11px] font-semibold text-gray-700">Ruido articular:</span>
                    <div className="flex flex-wrap gap-2">
                      {['A la Apertura', 'Al Cierre', 'No Presenta'].map(label => (
                        <button key={label} className="px-3 py-1 border border-gray-300 bg-gray-50 text-[11px] text-gray-600 rounded-sm hover:bg-gray-100 uppercase transition-colors">
                          {label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Patrón Apertura */}
                  <div className="flex flex-col gap-2 border-t border-gray-100 pt-3">
                    <span className="text-[11px] font-semibold text-gray-700">Patrón de apertura mandibular:</span>
                    <div className="flex flex-wrap gap-2">
                      {['Recto', 'Desviación Derecha', 'Desviación Izquierda', "Forma de 'S'", 'Otro'].map(label => (
                        <button
                          key={label}
                          className={`px-3 py-1 border rounded-sm text-[11px] ${atm?.patronAperturaMandibular === label
                            ? 'bg-blue-600 text-white'
                            : 'bg-white text-gray-700'
                            }`}
                        >
                          {label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Otras Observaciones & Labios */}
                  <div className="flex flex-col gap-3 border-t border-gray-100 pt-3">
                    <div className="flex flex-col gap-1">
                      <span className="text-[11px] font-bold text-gray-500 uppercase">Otras observaciones (ATM):</span>
                      <textarea
                        readOnly
                        rows={2}
                        placeholder="Cualquier otro hallazgo relevante..."
                        value={atm?.otrasObservaciones || ''}
                        className="w-full resize-none text-[12px] p-2 border border-gray-300 rounded-sm bg-white text-gray-600 focus:outline-none focus:border-blue-400"
                        style={{ boxShadow: 'inset 1px 1px 2px rgba(0,0,0,0.03)' }}
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <span className="text-[11px] font-bold text-gray-500 uppercase">Labios:</span>
                      <textarea
                        readOnly
                        rows={2}
                        placeholder=""
                        value={displayData?.examenIntrabucal?.labios || ''}
                        className="w-full resize-none text-[12px] p-2 border border-gray-300 rounded-sm bg-white text-gray-600 focus:outline-none focus:border-blue-400"
                        style={{ boxShadow: 'inset 1px 1px 2px rgba(0,0,0,0.03)' }}
                      />
                    </div>
                  </div>

                </div>
              </div>
            );
          }

          if (seccion.id === 'cuello') {
            const cuello = displayData?.examenCuello;
            return (
              <div key={seccion.id} className="flex flex-col gap-3 pb-2 border-b border-gray-200/50 last:border-0">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-[#2c3e50] uppercase tracking-tight">
                    {seccion.titulo}
                  </span>
                  {content && !copiedContent?.[seccion.id] && (
                    <span className="text-[9px] text-blue-600 font-bold bg-blue-50 px-1 rounded animate-pulse">
                      RECIBIENDO...
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-1 gap-3 pl-2">
                  {[
                    { label: '1. Cervicales', key: 'cervicales' },
                    { label: '2. Submaxilares', key: 'submaxilares' },
                    { label: '3. Submentonianos', key: 'submentonianos' },
                    { label: '4. Parotídeos', key: 'parotideos' },
                    { label: '5. Preauriculares', key: 'preauriculares' },
                    { label: '6. Auriculares Posteriores', key: 'auricularesPosteriores' }
                  ].map((sub) => (
                    <div key={sub.label} className="flex flex-col gap-1">
                      <span className="text-[11px] font-semibold text-gray-600 uppercase tracking-wide">
                        {sub.label}
                      </span>
                      <textarea
                        readOnly
                        rows={2}
                        value={cuello?.[sub.key] || ''}
                        className={`
                          w-full resize-none text-[12px] p-2 leading-tight
                          border rounded-sm
                          focus:outline-none focus:border-blue-400
                          bg-white text-gray-600
                        `}
                        style={{
                          border: '1px solid #d1d5db',
                          boxShadow: 'inset 1px 1px 2px rgba(0,0,0,0.03)',
                        }}
                      />
                    </div>
                  ))}
                </div>
              </div>
            );
          }

          if (seccion.id === 'intrabucal') {
            const intrabucal = displayData?.examenIntrabucal;
            return (
              <div key={seccion.id} className="flex flex-col gap-3 pb-2 border-b border-gray-200/50 last:border-0">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-[#2c3e50] uppercase tracking-tight">
                    {seccion.titulo}
                  </span>
                  {content && !copiedContent?.[seccion.id] && (
                    <span className="text-[9px] text-blue-600 font-bold bg-blue-50 px-1 rounded animate-pulse">
                      RECIBIENDO...
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-1 gap-3 pl-2">
                  {[
                    { label: '1. Mejillas', key: 'mejillas' },
                    { label: '2. Lengua', key: 'lengua' },
                    { label: '3. Piso de Boca', key: 'pisoBoca' },
                    { label: '4. Encías', key: 'encias' },
                    { label: '5. Paladar Duro y Blando', key: 'paladarDuroBlando' },
                    { label: '6. Orofaringe', key: 'orofaringe' },
                    { label: '7. Región Retromolar', key: 'regionRetromolar' },
                    { label: '8. Istmo de las Fauces', key: 'istmoFauces' }
                  ].map((sub) => (
                    <div key={sub.label} className="flex flex-col gap-1">
                      <span className="text-[11px] font-semibold text-gray-600 uppercase tracking-wide">
                        {sub.label}
                      </span>
                      <textarea
                        readOnly
                        rows={2}
                        value={intrabucal?.[sub.key] || ''}
                        className={`
                          w-full resize-none text-[12px] p-2 leading-tight
                          border rounded-sm
                          focus:outline-none focus:border-blue-400
                          bg-white text-gray-600
                        `}
                        style={{
                          border: '1px solid #d1d5db',
                          boxShadow: 'inset 1px 1px 2px rgba(0,0,0,0.03)',
                        }}
                      />
                    </div>
                  ))}
                </div>
              </div>
            );
          }

          if (seccion.id === 'noPatologicos') {
            return (
              <div key={seccion.id} className="flex flex-col gap-3 pb-2 border-b border-gray-200/50 last:border-0">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-[#2c3e50] uppercase tracking-tight">
                    {seccion.titulo}
                  </span>
                  {content && !copiedContent?.[seccion.id] && (
                    <span className="text-[9px] text-blue-600 font-bold bg-blue-50 px-1 rounded animate-pulse">
                      RECIBIENDO...
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-1 gap-3 pl-2">
                  {[
                    { label: 'Servicios Domiciliarios', key: 'servicios' },
                    { label: 'Higiene de la Vivienda', key: 'higieneVivienda' },
                    { label: 'Higiene Personal', key: 'higienePersonal' },
                    { label: 'Higiene Bucal', key: 'higieneBucal' },
                    { label: 'Alimentación', key: 'alimentacion' }
                  ].map((sub) => (
                    <div key={sub.label} className="flex flex-col gap-1">
                      <span className="text-[11px] font-semibold text-gray-600 uppercase tracking-wide">
                        {sub.label}
                      </span>
                      <textarea
                        readOnly
                        value={pastedData?.antecedentesPersonalesNoPatologicos?.[sub.key] || ''}
                        rows={2}
                        className={`
                          w-full resize-none text-[12px] p-2 leading-tight
                          border rounded-sm
                          focus:outline-none focus:border-blue-400
                          bg-white text-gray-600
                        `}
                        style={{
                          border: '1px solid #d1d5db',
                          boxShadow: 'inset 1px 1px 2px rgba(0,0,0,0.03)',
                        }}
                      />
                    </div>
                  ))}
                </div>
              </div>
            );
          }

          if (seccion.id === 'patologicos') {
            return (
              <div key={seccion.id} className="flex flex-col gap-3 pb-2 border-b border-gray-200/50 last:border-0">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-[#2c3e50] uppercase tracking-tight">
                    {seccion.titulo}
                  </span>
                </div>
                <div className="grid grid-cols-1 gap-3 pl-2">
                  {[
                    { label: 'Nutricionales', key: 'nutricionales' },
                    { label: 'Cardiacos', key: 'cardiacos' },
                    { label: 'Hepáticos', key: 'hepaticos' },
                    { label: 'Enfermedades de Transmisión Sexual', key: 'ets' },
                    { label: 'Enfermedades Eruptivas', key: 'eruptivas' },
                    { label: 'Pulmonares', key: 'pulmonares' },
                    { label: 'Infecciones Parasitarias', key: 'parasitarias' },
                    { label: 'Otros Padecimientos', key: 'otros' }
                  ].map(sub => (
                    <div key={sub.label} className="flex flex-col gap-1">
                      <span className="text-[11px] font-semibold text-gray-600 uppercase tracking-wide">{sub.label}</span>
                      <textarea
                        readOnly
                        value={pastedData?.antecedentesPersonalesPatologicos?.[sub.key] || ''}
                        rows={1}
                        className="w-full resize-none text-[12px] p-2 border border-gray-300 rounded-sm bg-white"
                      />
                    </div>
                  ))}
                </div>
              </div>
            );
          }

          if (seccion.id === 'heredofamiliares') {
            const hasPastedContent = pastedData && pastedData.antecedentesHeredoFamiliares;
            const displayContent = hasPastedContent
              ? JSON.stringify(pastedData.antecedentesHeredoFamiliares, null, 2)
              : content;

            // Simple view for heredofamiliares as requested
            return (
              <div key={seccion.id} className="flex flex-col gap-3 pb-2 border-b border-gray-200/50 last:border-0">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-[#2c3e50] uppercase tracking-tight">
                    {seccion.titulo}
                  </span>
                  {content && !copiedContent?.[seccion.id] && (
                    <span className="text-[9px] text-blue-600 font-bold bg-blue-50 px-1 rounded animate-pulse">
                      RECIBIENDO...
                    </span>
                  )}
                </div>

                <textarea
                  readOnly
                  rows={4}
                  value={content}
                  className={`
                    w-full resize-none text-[12px] p-3 leading-relaxed
                    border rounded-sm
                    focus:outline-none focus:border-blue-400
                    bg-white text-gray-600
                  `}
                  style={{
                    border: '1px solid #d1d5db',
                    boxShadow: 'inset 1px 1px 2px rgba(0,0,0,0.03)',
                  }}
                />
              </div>
            );
          }

          if (seccion.id === 'ginecoObstetricos') {
            return (
              <div key={seccion.id} className="flex flex-col gap-3 pb-2 border-b border-gray-200/50 last:border-0">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-[#2c3e50] uppercase tracking-tight">
                    {seccion.titulo}
                  </span>
                  {content && !copiedContent?.[seccion.id] && (
                    <span className="text-[9px] text-blue-600 font-bold bg-blue-50 px-1 rounded animate-pulse">
                      RECIBIENDO...
                    </span>
                  )}
                </div>

                <div className="pl-2 flex flex-col gap-4">
                  {/* Embarazo */}
                  <div className="flex flex-col gap-2">
                    <span className="text-[11px] font-semibold text-gray-700">¿Se encuentra embarazada actualmente?</span>
                    <div className="flex gap-2">
                      <button className={`px-3 py-1 border rounded-sm text-[11px] ${pastedData?.antecedentesGinecoObstetricos?.embarazoActual === true ? 'bg-blue-600 text-white' : 'bg-white text-gray-700'}`}>Sí</button>
                      <button className={`px-3 py-1 border rounded-sm text-[11px] ${pastedData?.antecedentesGinecoObstetricos?.embarazoActual === false ? 'bg-blue-600 text-white' : 'bg-white text-gray-700'}`}>No</button>
                    </div>
                    <textarea
                      placeholder="Semanas de gestación..."
                      readOnly
                      value={pastedData?.antecedentesGinecoObstetricos?.semanasGestacion || ''}
                      className="w-full text-[11px] p-2 border border-gray-300 rounded-sm resize-none bg-white"
                      rows={1}
                    />
                  </div>

                  {/* Lactancia */}
                  <div className="flex flex-col gap-2">
                    <span className="text-[11px] font-semibold text-gray-700">¿Se encuentra en periodo de lactancia?</span>
                    <div className="flex gap-2">
                      <button className={`px - 3 py - 1 border rounded - sm text - [11px] ${pastedData?.antecedentesGinecoObstetricos?.lactanciaActual === true ? 'bg-blue-600 text-white' : 'bg-white text-gray-700'} `}>Sí</button>
                      <button className={`px - 3 py - 1 border rounded - sm text - [11px] ${pastedData?.antecedentesGinecoObstetricos?.lactanciaActual === false ? 'bg-blue-600 text-white' : 'bg-white text-gray-700'} `}>No</button>
                    </div>
                  </div>
                </div>
              </div>
            );
          }

          if (seccion.id === 'exploracionFisica') {
            const sv = pastedData?.exploracionFisica?.signosVitales;
            return (
              <div key={seccion.id} className="flex flex-col gap-3 pb-2 border-b border-gray-200/50 last:border-0">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-[#2c3e50] uppercase tracking-tight">
                    {seccion.titulo}
                  </span>
                  {content && !copiedContent?.[seccion.id] && (
                    <span className="text-[9px] text-blue-600 font-bold bg-blue-50 px-1 rounded animate-pulse">
                      RECIBIENDO...
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-3 pl-2">
                  {[
                    { label: 'Peso', val: sv?.peso ? `${sv.peso} kg` : '' },
                    { label: 'Talla', val: sv?.talla ? `${sv.talla} m` : '' },
                    { label: 'IMC', val: sv?.imc || '' },
                    { label: 'Presión Arterial', val: sv?.ta || '' },
                    { label: 'Pulso', val: sv?.pulso || '' },
                    { label: 'Frecuencia Cardíaca', val: sv?.fc || '' },
                    { label: 'Temperatura', val: sv?.temperatura || '' }
                  ].map((sub) => (
                    <div key={sub.label} className="flex flex-col gap-1">
                      <span className="text-[11px] font-semibold text-gray-600 uppercase tracking-wide">
                        {sub.label}
                      </span>
                      <textarea
                        readOnly
                        value={sub.val}
                        rows={1}
                        className={`
            w - full resize - none text - [12px] p - 2 leading - tight
                          border rounded - sm
            focus: outline - none focus: border - blue - 400
            bg - white text - gray - 600
              `}
                        style={{
                          border: '1px solid #d1d5db',
                          boxShadow: 'inset 1px 1px 2px rgba(0,0,0,0.03)',
                        }}
                      />
                    </div>
                  ))}
                </div>
              </div>
            );
          }

          if (seccion.id === 'cabeza') {
            const cab = pastedData?.examenCabeza;
            return (
              <div key={seccion.id} className="flex flex-col gap-3 pb-2 border-b border-gray-200/50 last:border-0">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-[#2c3e50] uppercase tracking-tight">
                    {seccion.titulo}
                  </span>
                  {content && !copiedContent?.[seccion.id] && (
                    <span className="text-[9px] text-blue-600 font-bold bg-blue-50 px-1 rounded animate-pulse">
                      RECIBIENDO...
                    </span>
                  )}
                </div>

                <div className="pl-2 flex flex-col gap-4">

                  {/* Tipo de Cráneo */}
                  <div className="flex flex-col gap-1">
                    <span className="text-[11px] font-semibold text-gray-700">Tipo de Cráneo</span>
                    <details className="w-full">
                      <summary className="cursor-pointer list-none px-3 py-2 border border-blue-200 bg-blue-50 text-[11px] text-blue-800 rounded-sm hover:bg-blue-100 flex items-center justify-between group">
                        <span>{cab?.craneo || 'Seleccionar opción...'}</span>
                        <span className="text-[10px] opacity-50 transition-transform group-open:rotate-180">▼</span>
                      </summary>
                      <div className="mt-1 flex flex-col gap-1 p-1 border border-gray-200 rounded-sm bg-white shadow-sm">
                        {['Mesocéfalo', 'Dolicocéfalo', 'Braquicéfalo'].map(opt => (
                          <button key={opt} className="text-left px-2 py-1.5 text-[11px] text-gray-600 hover:bg-gray-50 rounded-sm">
                            {opt}
                          </button>
                        ))}
                      </div>
                    </details>
                  </div>

                  {/* Tipo de Perfil */}
                  <div className="flex flex-col gap-1">
                    <span className="text-[11px] font-semibold text-gray-700">Tipo de Perfil</span>
                    <details className="w-full">
                      <summary className="cursor-pointer list-none px-3 py-2 border border-blue-200 bg-blue-50 text-[11px] text-blue-800 rounded-sm hover:bg-blue-100 flex items-center justify-between group">
                        <span>{cab?.perfil || 'Seleccionar opción...'}</span>
                        <span className="text-[10px] opacity-50 transition-transform group-open:rotate-180">▼</span>
                      </summary>
                      <div className="mt-1 flex flex-col gap-1 p-1 border border-gray-200 rounded-sm bg-white shadow-sm">
                        {['Recto', 'Convexo', 'Cóncavo'].map(opt => (
                          <button key={opt} className="text-left px-2 py-1.5 text-[11px] text-gray-600 hover:bg-gray-50 rounded-sm">
                            {opt}
                          </button>
                        ))}
                      </div>
                    </details>
                  </div>

                  {/* Rasgos Faciales */}
                  <div className="flex flex-col gap-1">
                    <span className="text-[11px] font-semibold text-gray-700">Rasgos Faciales Característicos</span>
                    <textarea
                      readOnly
                      value={cab?.rasgosFaciales || ''}
                      className="w-full text-[11px] p-2 border border-gray-300 rounded-sm resize-none bg-white"
                      rows={1}
                    />
                  </div>

                </div>
              </div>
            );
          }



          return (
            <div key={seccion.id} className="flex flex-col gap-1 pb-2 border-b border-gray-200/50 last:border-0">
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-[#2c3e50] uppercase tracking-tight">
                  {seccion.titulo}
                </span>
                {content && !copiedContent?.[seccion.id] && (
                  <span className="text-[9px] text-blue-600 font-bold bg-blue-50 px-1 rounded animate-pulse">
                    RECIBIENDO...
                  </span>
                )}
              </div>

              <textarea
                value={content}
                readOnly
                rows={isActive ? 6 : 3}
                className={`
                  w-full resize-none text-[12px] p-2 leading-tight
                  border rounded-sm
                  focus:outline-none focus:border-blue-400
                  ${content ? 'bg-white text-black' : 'bg-white text-gray-500'}
                `}
                style={{
                  border: '1px solid #d1d5db',
                  boxShadow: 'inset 1px 1px 2px rgba(0,0,0,0.03)',
                }}
              />
            </div>
          );
        })}

        <div className="py-6 text-center text-[10px] text-gray-400">
          Sistema Académico Dentaxy
        </div>
      </div>
    </div>
  );
};

export default SmileEspejoPanel;
