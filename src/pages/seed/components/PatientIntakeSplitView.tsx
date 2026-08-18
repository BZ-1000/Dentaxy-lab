import React from 'react';
import { 
  X, Check, FileText, Sparkles, User, Camera, Smartphone, 
  ShieldCheck, AlertTriangle, ArrowRight, Zap, Stethoscope, Copy
} from 'lucide-react';
import { compileClinicalIntakeRedaction, RawPatientResponsePayload } from '../../../lib/engine/compileClinicalIntakeRedaction';
import { toast } from 'sonner';

interface PatientIntakeSplitViewProps {
  isOpen: boolean;
  onClose: () => void;
  patientName: string;
  rawPayload: RawPatientResponsePayload;
  onApplyToHistory: (redacted: { motivo: string; antecedentes: string; alergias: string }) => void;
}

export function PatientIntakeSplitView({ 
  isOpen, 
  onClose, 
  patientName, 
  rawPayload, 
  onApplyToHistory 
}: PatientIntakeSplitViewProps) {
  if (!isOpen) return null;

  const redacted = compileClinicalIntakeRedaction(rawPayload);

  const handleApply = () => {
    onApplyToHistory({
      motivo: redacted.motivoConsultaRedactado,
      antecedentes: redacted.antecedentesRedactados,
      alergias: redacted.alergiasRedactadas
    });
    toast.success('¡Anamnesis redactada e integrada a la Historia Clínica!');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[450] bg-black/50 backdrop-blur-md flex items-center justify-center p-4 lg:p-8 select-none animate-in fade-in duration-300">
      
      {/* CONTENEDOR PANTALLA DIVIDIDA WHITE GLASSMORPHISM */}
      <div className="w-full max-w-6xl h-[88vh] bg-white/85 backdrop-blur-[32px] border border-white/90 rounded-[40px] shadow-[0_30px_90px_rgba(0,0,0,0.18)] flex flex-col overflow-hidden relative">
        
        {/* CABECERA DEL PANEL */}
        <header className="px-6 py-4 border-b border-slate-200/60 flex items-center justify-between bg-white/60 backdrop-blur-md shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-slate-900 to-slate-800 text-white flex items-center justify-center shadow-md">
              <Sparkles size={20} className="text-emerald-400 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[9px] font-black text-emerald-600 tracking-[0.2em] font-mono uppercase bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200/60">
                  MODO PANTALLA DIVIDIDA
                </span>
                {redacted.alertaSistemica && (
                  <span className="text-[9px] font-black text-rose-600 tracking-[0.18em] font-mono uppercase bg-rose-50 px-2.5 py-0.5 rounded-full border border-rose-200/60 flex items-center gap-1">
                    <AlertTriangle size={10} />
                    ALERTA MÉDICA
                  </span>
                )}
              </div>
              <h2 className="text-sm font-extrabold text-slate-900 font-[Bruno_Ace_SC] tracking-wide mt-0.5">
                Evaluación Digital: {patientName}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleApply}
              className="px-5 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white rounded-2xl font-bold text-xs shadow-md transition active:scale-95 flex items-center gap-2"
            >
              <Check size={16} />
              <span>Integrar a Historia Clínica</span>
            </button>
            <button
              onClick={onClose}
              className="w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 transition flex items-center justify-center"
            >
              <X size={18} />
            </button>
          </div>
        </header>

        {/* CUERPO EN PANTALLA DIVIDIDA (50% RESPUESTAS EN BRUTO VS 50% EXPEDIENTE REDACTADO) */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-0 overflow-hidden divide-y lg:divide-y-0 lg:divide-x divide-slate-200/70">
          
          {/* 👈 LADO IZQUIERDO: RESPUESTAS EN BRUTO DEL PACIENTE + FOTO CLÍNICA */}
          <div className="p-6 overflow-y-auto custom-scrollbar flex flex-col gap-5 bg-slate-50/40">
            <div className="flex items-center justify-between border-b border-slate-200/60 pb-3">
              <span className="text-xs font-extrabold text-slate-700 uppercase tracking-wider flex items-center gap-2">
                <Smartphone size={16} className="text-slate-500" />
                <span>Respuestas en Bruto del Paciente</span>
              </span>
              <span className="text-[10px] font-mono text-slate-400 font-bold">
                {rawPayload.specialtyType} • 1-Clic
              </span>
            </div>

            {/* FOTO CLÍNICA CAPTURADA */}
            {rawPayload.clinicalPhotoUrl ? (
              <div className="w-full bg-white p-4 rounded-3xl border border-slate-200/80 shadow-sm flex items-center gap-4">
                <img 
                  src={rawPayload.clinicalPhotoUrl} 
                  alt="Foto Clínica Paciente" 
                  className="w-24 h-24 rounded-2xl object-cover border-2 border-emerald-500/40 shadow-md"
                />
                <div className="flex flex-col text-left">
                  <span className="text-[10px] font-black text-emerald-600 uppercase font-mono tracking-wider">
                    Foto Clínica Verificada ✓
                  </span>
                  <h4 className="text-xs font-bold text-slate-800 mt-0.5">{patientName}</h4>
                  <span className="text-[10px] text-slate-400 mt-1 font-mono">
                    Adjunta a Ficha de Identificación NOM-004
                  </span>
                </div>
              </div>
            ) : (
              <div className="w-full p-4 rounded-3xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold flex items-center gap-2">
                <AlertTriangle size={16} />
                <span>Foto clínica pendiente de captura</span>
              </div>
            )}

            {/* DESGLOSE DE RESPUESTAS INDIVIDUALES */}
            <div className="space-y-3">
              {Object.entries(rawPayload.responses || {}).map(([key, val]) => {
                if (key === 'customInputs') return null;
                const formattedVal = Array.isArray(val) 
                  ? val.join(', ') 
                  : typeof val === 'boolean' 
                    ? (val ? 'Sí' : 'No') 
                    : String(val);

                return (
                  <div key={key} className="bg-white p-3.5 rounded-2xl border border-slate-200/70 shadow-sm flex flex-col text-left">
                    <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider">
                      {key}
                    </span>
                    <span className="text-xs font-bold text-slate-800 mt-1">
                      {formattedVal}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 👉 LADO DERECHO: DOCUMENTO CLINICO REDACTADO (NOM-004-SSA3-2012) */}
          <div className="p-6 overflow-y-auto custom-scrollbar flex flex-col gap-5 bg-white/60">
            <div className="flex items-center justify-between border-b border-slate-200/60 pb-3">
              <span className="text-xs font-extrabold text-slate-700 uppercase tracking-wider flex items-center gap-2">
                <FileText size={16} className="text-emerald-600" />
                <span>Expediente Redactado (Motor Determinista NOM-004)</span>
              </span>
              <span className="text-[10px] font-mono text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                Respuesta Instantánea (0 API Delay)
              </span>
            </div>

            {/* BLOQUE MOTIVO DE CONSULTA REDACTADO */}
            <div className="bg-slate-50 p-4 rounded-3xl border border-slate-200/80 shadow-sm text-left">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono block mb-1">
                Motivo de Consulta Formatted
              </span>
              <p className="text-xs text-slate-800 font-semibold leading-relaxed">
                {redacted.motivoConsultaRedactado}
              </p>
            </div>

            {/* BLOQUE ANTECEDENTES Y ALERGIAS REDACTADOS */}
            <div className="bg-slate-50 p-4 rounded-3xl border border-slate-200/80 shadow-sm text-left">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono block mb-1">
                Antecedentes Patológicos & Alergias Formatted
              </span>
              <p className="text-xs text-slate-800 font-semibold leading-relaxed whitespace-pre-line mb-3">
                {redacted.antecedentesRedactados}
              </p>
              <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-[11px] font-bold">
                {redacted.alergiasRedactadas}
              </div>
            </div>

            {/* TEXTO COMPLETO PREVIEW NOM-004 */}
            <div className="bg-slate-900 text-slate-100 p-4 rounded-3xl shadow-lg text-left font-mono text-[11px] leading-relaxed relative group">
              <button
                onClick={() => {
                  navigator.clipboard.writeText(redacted.resumenCompletoNOM004);
                  toast.success('Copiado al portapapeles');
                }}
                className="absolute top-3 right-3 p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition"
                title="Copiar resumen"
              >
                <Copy size={14} />
              </button>
              <pre className="whitespace-pre-wrap font-mono">
                {redacted.resumenCompletoNOM004}
              </pre>
            </div>

          </div>

        </div>

        {/* FOOTER ACCIÓN RÁPIDA */}
        <footer className="px-6 py-3.5 border-t border-slate-200/60 bg-white/80 backdrop-blur-md flex items-center justify-between shrink-0">
          <span className="text-[10px] font-mono text-slate-400 font-bold uppercase tracking-widest">
            DENTAXY DETERMINISTIC CLINICAL ENGINE • NOM-004-SSA3-2012
          </span>
          <button
            onClick={handleApply}
            className="px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-2xl font-bold text-xs shadow-md transition active:scale-95 flex items-center gap-2"
          >
            <span>Aplicar Cambios a Historia Clínica</span>
            <ArrowRight size={16} />
          </button>
        </footer>

      </div>

    </div>
  );
}
