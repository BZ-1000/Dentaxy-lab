/**
 * ConsentimientosModule.tsx
 * Módulo dinámico de Consentimientos Informados y Firma Digital para DentaXy.
 * Genera automáticamente los consentimientos según los tratamientos del odontograma.
 */

import React, { useState, useRef } from 'react';
import { 
  FileText, CheckCircle2, AlertCircle, PenTool, Share2, 
  Download, Send, ChevronDown, ChevronUp, RefreshCw
} from 'lucide-react';
import { ToothData } from '@/types/odontograma';

export interface ConsentItem {
  id: string;
  title: string;
  category: string;
  content: string;
  required: boolean;
}

interface ConsentimientosModuleProps {
  teethState?: Record<number, ToothData> | null;
  patientName?: string;
  doctorName?: string;
  onSignedAndReady?: (signatureDataUrl: string, consents: ConsentItem[]) => void;
  onShareWhatsApp?: (signatureDataUrl: string) => void;
  onShareNative?: (signatureDataUrl: string) => void;
  onDownloadPDF?: () => void;
}

export const ConsentimientosModule: React.FC<ConsentimientosModuleProps> = ({
  teethState,
  patientName = 'Paciente',
  doctorName = 'Dr. Odontólogo Responsable',
  onSignedAndReady,
  onShareWhatsApp,
  onShareNative,
  onDownloadPDF,
}) => {
  // Determine required consents based on active teeth states
  const getRequiredConsents = (): ConsentItem[] => {
    const items: ConsentItem[] = [
      {
        id: 'general',
        title: 'Consentimiento Informado General de Atención Odontológica',
        category: 'Atención General',
        required: true,
        content: `Yo, ${patientName}, declaro en pleno uso de mis facultades mentales haber recibido información clara, completa y oportuna respecto a los procedimientos odontológicos diagnósticos y preventivos a realizarse en esta clínica por parte del profesional tratante (${doctorName}). Entiendo la naturaleza de las revisiones clínicas, toma de impresiones y limpiezas profilácticas.`
      }
    ];

    if (!teethState) return items;
    const teeth = Object.values(teethState);

    const hasCaries = teeth.some(t => t.state === 'C' || t.state === 'O' || t.state === 'OF');
    const hasEndo = teeth.some(t => t.state === 'E' || t.state === 'PC' || t.state === 'PP');
    const hasExo = teeth.some(t => t.state === 'EI' || t.state === 'RR' || (t.state === 'MOV' && t.mobility === 3));
    const hasProtesis = teeth.some(t => t.state === 'CR' || t.state === 'PU' || t.state === 'IM');
    const hasOrto = teeth.some(t => t.state === 'AOF' || t.state === 'AOR' || t.state === 'DIA' || t.state === 'GV');

    if (hasCaries) {
      items.push({
        id: 'operatoria',
        title: 'Consentimiento para Odontología Restauradora (Resinas y Obturaciones)',
        category: 'Operatoria Dental',
        required: true,
        content: `Comprendo que la remoción de tejido cariado o recambio de obturaciones filtradas implica el uso de anestesia local y la preparación mecánica del diente. Acepto los posibles riesgos temporales como sensibilidad a cambios térmicos postoperatoria, molestia masticatoria leve o necesidad de ajustes de oclusión.`
      });
    }

    if (hasEndo) {
      items.push({
        id: 'endodoncia',
        title: 'Consentimiento para Tratamiento de Conductos Radiculares (Endodoncia)',
        category: 'Endodoncia',
        required: true,
        content: `Autorizo la realización del tratamiento de conductos radiculares para salvar el órgano dentario afectado. Entiendo que consiste en la extirpación de la pulpa dental infectada, desinfección y sellado tridimensional de los conductos. Comprendo que el diente tratado requerirá posteriormente una restauración o corona protectora.`
      });
    }

    if (hasExo) {
      items.push({
        id: 'exodoncia',
        title: 'Consentimiento para Cirugía Oral y Exodoncia Dental',
        category: 'Cirugía Oral',
        required: true,
        content: `Acepto la realización de la exodoncia (extracción) de las piezas indicadas por diagnóstico de no conservabilidad o movilidad irreversible. Se me han explicado las indicaciones postoperatorias, posibles riesgos como inflamación local, sangrado controlado o alveolitis, y la importancia de seguir los cuidados indicados.`
      });
    }

    if (hasProtesis) {
      items.push({
        id: 'protesis',
        title: 'Consentimiento para Rehabilitación Protésica (Coronas / Puentes / Implantes)',
        category: 'Rehabilitación Oral',
        required: true,
        content: `Doy mi conformidad para la confección y colocación de estructuras protésicas definitivas o provisionales. Entiendo el compromiso de mantener una excelente higiene bucal diaria y acudir a revisiones periódicas para garantizar la longevidad de las restauraciones y tejidos de soporte.`
      });
    }

    if (hasOrto) {
      items.push({
        id: 'ortodoncia',
        title: 'Consentimiento para Tratamiento de Ortodoncia',
        category: 'Ortodoncia',
        required: true,
        content: `Entiendo las implicaciones del uso de aparatología fija o removible para la corrección de maloclusiones y alineación dental. Me comprometo a cuidar los aparatos, seguir las pautas de higiene especializada y asistir puntualmente a los controles mensuales indicados.`
      });
    }

    return items;
  };

  const consents = getRequiredConsents();
  const [readStates, setReadStates] = useState<Record<string, boolean>>({});
  const [openItems, setOpenItems] = useState<Record<string, boolean>>({ general: true });
  const [signatureDataUrl, setSignatureDataUrl] = useState<string | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);

  const toggleItem = (id: string) => {
    setOpenItems(prev => ({ ...prev, [id]: !prev[id] }));
    // Mark as read when opened
    setReadStates(prev => ({ ...prev, [id]: true }));
  };

  const allConsentsRead = consents.every(c => readStates[c.id]);

  // Canvas drawing handlers
  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    setIsDrawing(true);
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const rect = canvas.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    ctx.beginPath();
    ctx.moveTo(clientX - rect.left, clientY - rect.top);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const rect = canvas.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    ctx.lineTo(clientX - rect.left, clientY - rect.top);
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 2.5;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setSignatureDataUrl(null);
  };

  const saveSignature = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dataUrl = canvas.toDataURL('image/png');
    setSignatureDataUrl(dataUrl);
    if (onSignedAndReady) {
      onSignedAndReady(dataUrl, consents);
    }
  };

  return (
    <div className="w-full mt-6 bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-gray-100 mb-4">
        <div>
          <div className="text-[10px] font-extrabold uppercase tracking-widest text-indigo-600 mb-0.5 flex items-center gap-1.5">
            <FileText className="w-3.5 h-3.5" />
            Norma Oficial NOM-004-SSA3-2012
          </div>
          <h3 className="text-base font-bold text-gray-900">
            Consentimientos Informados Requeridos
          </h3>
        </div>
        <div className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5 ${
          allConsentsRead ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-amber-50 text-amber-700 border border-amber-200'
        }`}>
          {allConsentsRead ? (
            <><CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Todos Leídos</>
          ) : (
            <><AlertCircle className="w-3.5 h-3.5 text-amber-600" /> {Object.keys(readStates).length} de {consents.length} Leídos</>
          )}
        </div>
      </div>

      {/* Indicaciones para el paciente */}
      <div className="bg-blue-50/70 border border-blue-100 rounded-xl p-3.5 mb-4 text-xs text-blue-900 leading-relaxed flex items-start gap-2.5">
        <PenTool className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
        <div>
          <strong className="font-semibold">Indicaciones para el Paciente:</strong> Despliegue y lea detenidamente cada uno de los siguientes consentimientos informados. Una vez revisados todos, podrá realizar su firma digital en la parte inferior para habilitar el envío del expediente firmado.
        </div>
      </div>

      {/* Acordeones / Toggles de consentimientos */}
      <div className="space-y-3 mb-6">
        {consents.map((consent, idx) => {
          const isOpen = !!openItems[consent.id];
          const isRead = !!readStates[consent.id];

          return (
            <div 
              key={consent.id}
              className={`border rounded-xl transition-all overflow-hidden ${
                isRead ? 'border-gray-200 bg-white' : 'border-amber-200 bg-amber-50/30'
              }`}
            >
              <button
                type="button"
                onClick={() => toggleItem(consent.id)}
                className="w-full px-4 py-3 text-left flex items-center justify-between hover:bg-gray-50/80 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <span className={`w-5 h-5 rounded-full text-[10px] font-bold flex items-center justify-center ${
                    isRead ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                  }`}>
                    {idx + 1}
                  </span>
                  <div>
                    <div className="text-xs font-bold text-gray-800 leading-snug">
                      {consent.title}
                    </div>
                    <div className="text-[10px] text-gray-400 font-medium">
                      Categoría: {consent.category}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {isRead ? (
                    <span className="text-[10px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
                      ✓ Leído
                    </span>
                  ) : (
                    <span className="text-[10px] font-semibold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-100 animate-pulse">
                      Por leer
                    </span>
                  )}
                  {isOpen ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
                </div>
              </button>

              {isOpen && (
                <div className="px-4 pb-4 pt-1 text-xs text-gray-600 leading-relaxed border-t border-gray-100 bg-gray-50/40">
                  <p className="whitespace-pre-line">{consent.content}</p>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Sección de Firma Digital */}
      <div className="border-t border-gray-100 pt-5">
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-gray-700 flex items-center gap-2">
            <PenTool className="w-3.5 h-3.5 text-indigo-600" />
            Firma Autógrafa Digital del Paciente
          </h4>
          {signatureDataUrl && (
            <button 
              type="button"
              onClick={() => { setSignatureDataUrl(null); }}
              className="text-[11px] text-indigo-600 font-semibold flex items-center gap-1 hover:underline"
            >
              <RefreshCw className="w-3 h-3" /> Cambiar firma
            </button>
          )}
        </div>

        {!allConsentsRead ? (
          <div className="p-4 rounded-xl bg-gray-50 border border-dashed border-gray-200 text-center text-xs text-gray-400">
            Revise y despliegue todos los consentimientos anteriores para activar el panel de firma.
          </div>
        ) : signatureDataUrl ? (
          <div className="p-4 rounded-xl bg-emerald-50/50 border border-emerald-200 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs font-bold text-gray-800">Firma Registrada Correctamente</div>
                <div className="text-[10px] text-gray-500">Documento listo para envío y exportación</div>
              </div>
            </div>
            <img 
              src={signatureDataUrl} 
              alt="Firma del Paciente" 
              className="h-12 max-w-[140px] object-contain border border-gray-200 bg-white rounded-lg p-1 shadow-sm"
            />
          </div>
        ) : (
          <div className="space-y-3">
            <div className="relative border-2 border-dashed border-indigo-200 rounded-2xl bg-slate-50/70 p-2 text-center">
              <canvas
                ref={canvasRef}
                width={480}
                height={150}
                className="w-full h-36 bg-white rounded-xl touch-none cursor-crosshair border border-gray-200 shadow-inner"
                onMouseDown={startDrawing}
                onMouseMove={draw}
                onMouseUp={stopDrawing}
                onMouseLeave={stopDrawing}
                onTouchStart={startDrawing}
                onTouchMove={draw}
                onTouchEnd={stopDrawing}
              />
              <div className="text-[10px] text-gray-400 mt-1">
                Dibuje su firma con el dedo o puntero dentro del recuadro blanco
              </div>
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={clearCanvas}
                className="flex-1 py-2 px-3 rounded-xl border border-gray-200 bg-white text-gray-600 text-xs font-semibold hover:bg-gray-50 transition-colors"
              >
                Limpiar Trazo
              </button>
              <button
                type="button"
                onClick={saveSignature}
                className="flex-1 py-2 px-3 rounded-xl bg-zinc-900 text-white text-xs font-bold hover:bg-zinc-800 transition-colors shadow-sm"
              >
                Confirmar Firma
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Botones de Envío y Compartir */}
      {allConsentsRead && signatureDataUrl && (
        <div className="mt-6 pt-5 border-t border-gray-100 flex flex-wrap gap-2.5">
          <button
            type="button"
            onClick={() => onShareWhatsApp?.(signatureDataUrl)}
            className="flex-1 min-w-[150px] py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-sm transition-all"
          >
            <Send className="w-3.5 h-3.5" />
            Enviar por WhatsApp
          </button>

          <button
            type="button"
            onClick={() => onShareNative?.(signatureDataUrl)}
            className="flex-1 min-w-[140px] py-2.5 px-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-sm transition-all"
          >
            <Share2 className="w-3.5 h-3.5" />
            Compartir (Redes/Apps)
          </button>

          <button
            type="button"
            onClick={onDownloadPDF}
            className="py-2.5 px-4 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all"
          >
            <Download className="w-3.5 h-3.5" />
            Descargar PDF
          </button>
        </div>
      )}
    </div>
  );
};
