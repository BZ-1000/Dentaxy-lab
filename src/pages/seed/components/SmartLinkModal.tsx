import React, { useState, useEffect } from 'react';
import { 
  X, Sparkles, Copy, Check, QrCode, Share2, Power, 
  Stethoscope, Zap, ShieldCheck, Smartphone, RefreshCw, ExternalLink 
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface SmartLinkModalProps {
  isOpen: boolean;
  onClose: () => void;
  patientFolderId: string;
  patientName: string;
}

export function SmartLinkModal({ isOpen, onClose, patientFolderId, patientName }: SmartLinkModalProps) {
  const [specialtyType, setSpecialtyType] = useState<'URGENCIAS' | 'GENERAL'>('GENERAL');
  const [isActive, setIsActive] = useState(true);
  const [sessionToken, setSessionToken] = useState<string | null>(null);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showQR, setShowQR] = useState(false);

  // Cargar o crear sesión de paciente al abrir el modal
  useEffect(() => {
    if (!isOpen || !patientFolderId) return;

    async function loadOrCreateSession() {
      try {
        setIsLoading(true);
        const { data: userData } = await supabase.auth.getUser();
        const doctorId = userData?.user?.id;

        // Buscar si ya existe una sesión previa para este paciente y doctor
        const { data: existingSessions, error: fetchErr } = await supabase
          .from('patient_sessions')
          .select('*')
          .eq('patient_folder_id', patientFolderId)
          .order('created_at', { ascending: false })
          .limit(1);

        if (fetchErr) console.warn('[Dentaxy SmartLink] Warning al consultar sesiones:', fetchErr);

        if (existingSessions && existingSessions.length > 0) {
          const sess = existingSessions[0];
          setSessionToken(sess.token);
          setSessionId(sess.id);
          setIsActive(sess.is_active ?? true);
          setSpecialtyType((sess.specialty_type as any) || 'GENERAL');
        } else {
          // Crear una nueva sesión activable
          const { data: newSess, error: createErr } = await supabase
            .from('patient_sessions')
            .insert({
              patient_folder_id: patientFolderId,
              patient_name: patientName,
              specialty_type: specialtyType,
              doctor_id: doctorId || null,
              is_active: true,
              status: 'ACTIVE'
            })
            .select()
            .single();

          if (createErr) {
            console.error('[Dentaxy SmartLink] Error creando sesión:', createErr);
            // Fallback token local si no hay conexión Supabase
            const fallbackToken = `p_${patientFolderId}_${Date.now()}`;
            setSessionToken(fallbackToken);
          } else if (newSess) {
            setSessionToken(newSess.token);
            setSessionId(newSess.id);
            setIsActive(true);
          }
        }
      } catch (err) {
        console.error('[Dentaxy SmartLink] Excepción:', err);
      } finally {
        setIsLoading(false);
      }
    }

    loadOrCreateSession();
  }, [isOpen, patientFolderId, patientName]);

  // Cambiar estado Activo / Inactivo con 1 clic (RPC Supabase)
  const handleToggleActive = async () => {
    const nextState = !isActive;
    setIsActive(nextState);

    if (sessionId) {
      try {
        const { data, error } = await supabase.rpc('toggle_patient_session_active', {
          p_session_id: sessionId,
          p_is_active: nextState
        });

        if (error) console.error('[Dentaxy SmartLink] Error toggle RPC:', error);
      } catch (e) {
        console.error('[Dentaxy SmartLink] Excepción toggle:', e);
      }
    }

    toast.success(nextState ? '🟢 Enlace Activado para el paciente' : '🔴 Enlace Pausado por el doctor');
  };

  // Cambiar tipo de especialidad (Urgencias vs General)
  const handleSpecialtyChange = async (type: 'URGENCIAS' | 'GENERAL') => {
    setSpecialtyType(type);
    if (sessionId) {
      await supabase.from('patient_sessions').update({ specialty_type: type }).eq('id', sessionId);
    }
    toast.info(`Especialidad cambiada a ${type}`);
  };

  const getFullLinkUrl = () => {
    const origin = typeof window !== 'undefined' ? window.location.origin : 'https://dentaxy.com';
    return `${origin}/paciente/evaluacion?token=${sessionToken || 'demo'}`;
  };

  const handleCopy = () => {
    const url = getFullLinkUrl();
    navigator.clipboard.writeText(url);
    setCopied(true);
    toast.success('¡Enlace copiado al portapapeles!');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShareWhatsApp = () => {
    const url = getFullLinkUrl();
    const message = encodeURIComponent(
      `Hola ${patientName || ''}, tu odontólogo te ha compartido tu enlace de evaluación clínica en Dentaxy. Por favor responde el breve cuestionario aquí: ${url}`
    );
    window.open(`https://wa.me/?text=${message}`, '_blank');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[400] bg-black/40 backdrop-blur-md flex items-center justify-center p-4 select-none animate-in fade-in duration-200">
      
      {/* TARJETA GLASSMORPHISM CON ILUMINACIÓN 3D */}
      <div className="w-full max-w-md bg-white/85 backdrop-blur-[32px] border border-white/90 rounded-[36px] p-6 sm:p-7 shadow-[0_25px_70px_rgba(0,0,0,0.15)] relative overflow-hidden flex flex-col justify-between">
        
        {/* Luz 3D neón brillante en la esquina */}
        <div className={`absolute -top-16 -right-16 w-48 h-48 ${isActive ? 'bg-emerald-400/30' : 'bg-rose-400/25'} rounded-full blur-[60px] pointer-events-none transition-all duration-500`} />

        <div>
          {/* HEADER DEL MODAL */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2.5">
              <div className={`w-10 h-10 rounded-2xl ${isActive ? 'bg-gradient-to-br from-emerald-500 to-teal-600 text-white' : 'bg-slate-200 text-slate-500'} flex items-center justify-center shadow-md transition-all`}>
                <Sparkles size={20} className={isActive ? 'animate-pulse' : ''} />
              </div>
              <div className="flex flex-col">
                <span className="text-[9px] font-black text-emerald-600 tracking-[0.18em] uppercase font-mono">
                  ENLACE INTELIGENTE NOM-004
                </span>
                <h3 className="text-sm font-bold text-slate-900 tracking-tight font-[Bruno_Ace_SC]">
                  {patientName || 'Expediente Paciente'}
                </h3>
              </div>
            </div>

            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-slate-100/80 hover:bg-slate-200 text-slate-500 hover:text-slate-800 transition flex items-center justify-center"
            >
              <X size={16} />
            </button>
          </div>

          {/* CONTROL PRINCIPAL: SWITCH DE ACTIVACIÓN DEL DOCTOR */}
          <div className="w-full bg-white/60 border border-white/80 rounded-2xl p-3.5 mb-4 shadow-sm flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className={`w-3 h-3 rounded-full ${isActive ? 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.8)]' : 'bg-rose-500'}`} />
              <div className="flex flex-col">
                <span className="text-xs font-extrabold text-slate-800">
                  {isActive ? 'Enlace Activo' : 'Enlace En Pausa'}
                </span>
                <span className="text-[9.5px] text-slate-400 font-medium">
                  {isActive ? 'El paciente puede responder desde su celular' : 'Respuestas bloqueadas por el doctor'}
                </span>
              </div>
            </div>

            <button
              onClick={handleToggleActive}
              className={`px-3.5 py-1.5 rounded-xl font-bold text-xs transition-all flex items-center gap-1.5 shadow-sm active:scale-95 ${
                isActive 
                  ? 'bg-rose-50 text-rose-600 border border-rose-200/80 hover:bg-rose-100' 
                  : 'bg-emerald-500 text-white border border-emerald-400 hover:bg-emerald-600'
              }`}
            >
              <Power size={13} />
              <span>{isActive ? 'Pausar' : 'Activar'}</span>
            </button>
          </div>

          {/* SELECTOR DE ESPECIALIDAD (URGENCIAS VS GENERAL) */}
          <div className="mb-5">
            <label className="text-[9.5px] font-extrabold text-slate-400 uppercase tracking-wider block mb-2 font-mono">
              Especialidad del Cuestionario
            </label>
            <div className="grid grid-cols-2 gap-2.5">
              <button
                onClick={() => handleSpecialtyChange('GENERAL')}
                className={`p-3 rounded-2xl font-bold text-xs transition-all flex items-center justify-center gap-2 border active:scale-95 ${
                  specialtyType === 'GENERAL'
                    ? 'bg-slate-900 text-white border-slate-900 shadow-md'
                    : 'bg-white/70 text-slate-700 border-slate-200/80 hover:bg-white'
                }`}
              >
                <Stethoscope size={16} className={specialtyType === 'GENERAL' ? 'text-emerald-400' : 'text-slate-400'} />
                <span>🩺 General</span>
              </button>

              <button
                onClick={() => handleSpecialtyChange('URGENCIAS')}
                className={`p-3 rounded-2xl font-bold text-xs transition-all flex items-center justify-center gap-2 border active:scale-95 ${
                  specialtyType === 'URGENCIAS'
                    ? 'bg-rose-600 text-white border-rose-500 shadow-md'
                    : 'bg-white/70 text-slate-700 border-slate-200/80 hover:bg-white'
                }`}
              >
                <Zap size={16} className={specialtyType === 'URGENCIAS' ? 'text-amber-300' : 'text-rose-400'} />
                <span>🚨 Urgencias</span>
              </button>
            </div>
          </div>

          {/* CÓDIGO QR O LINK COPIABLE */}
          {showQR ? (
            <div className="w-full bg-white p-5 rounded-2xl border border-slate-200/80 shadow-inner flex flex-col items-center mb-4 animate-in zoom-in-95 duration-200">
              <div className="p-3 bg-white border border-slate-200 rounded-xl shadow-sm mb-3">
                <img 
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(getFullLinkUrl())}`} 
                  alt="QR Código Paciente" 
                  className="w-40 h-40 object-contain"
                />
              </div>
              <span className="text-[10px] font-mono font-bold text-slate-500">Escanea desde la cámara de tu móvil</span>
              <button 
                onClick={() => setShowQR(false)} 
                className="mt-3 text-xs font-bold text-slate-700 hover:text-slate-900 underline"
              >
                Volver al enlace
              </button>
            </div>
          ) : (
            <div className="w-full bg-slate-900/5 border border-slate-900/10 rounded-2xl p-3.5 mb-5">
              <span className="text-[9px] font-mono font-extrabold text-slate-400 uppercase tracking-widest block mb-1.5">
                Enlace Clínico Privado
              </span>
              <div className="flex items-center justify-between gap-2 bg-white px-3 py-2 rounded-xl border border-slate-200 shadow-inner">
                <span className="text-xs font-mono text-slate-700 truncate flex-1">
                  {getFullLinkUrl()}
                </span>
                <button
                  onClick={handleCopy}
                  className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition active:scale-90 shrink-0"
                  title="Copiar"
                >
                  {copied ? <Check size={14} className="text-emerald-600" /> : <Copy size={14} />}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* ACCIONES DE COMPARTIR (BOTONES PRINCIPALES) */}
        <div className="grid grid-cols-2 gap-2.5">
          <button
            onClick={handleShareWhatsApp}
            className="py-3.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl font-bold text-xs shadow-md transition active:scale-95 flex items-center justify-center gap-2"
          >
            <Share2 size={16} />
            <span>WhatsApp</span>
          </button>

          <button
            onClick={() => setShowQR(prev => !prev)}
            className="py-3.5 px-4 bg-slate-900 hover:bg-slate-800 text-white rounded-2xl font-bold text-xs shadow-md transition active:scale-95 flex items-center justify-center gap-2"
          >
            <QrCode size={16} />
            <span>{showQR ? 'Ocultar QR' : 'Mostrar QR'}</span>
          </button>
        </div>

      </div>

    </div>
  );
}
