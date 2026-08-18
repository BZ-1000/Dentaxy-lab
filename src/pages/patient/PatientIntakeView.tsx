import React, { useState, useEffect, useRef } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { 
  Camera, Check, AlertTriangle, Stethoscope, HeartPulse, 
  Sparkles, ShieldCheck, ChevronRight, ChevronLeft, RefreshCw, 
  Lock, User, Smartphone, X, Zap, Activity, Info
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface VerificationResult {
  valid: boolean;
  reason?: string;
  session_id?: string;
  patient_name?: string;
  specialty_type?: 'URGENCIAS' | 'GENERAL';
  message?: string;
  template?: {
    questions: Array<{
      id: string;
      type: 'choice' | 'multi_choice' | 'range' | 'boolean' | 'boolean_text';
      label: string;
      options?: string[];
      min?: number;
      max?: number;
      placeholder?: string;
      required?: boolean;
    }>;
  };
}

export default function PatientIntakeView() {
  const { sessionId: paramSessionId } = useParams();
  const [searchParams] = useSearchParams();
  
  // El token se puede recibir por parámetro de ruta o por URL query ?token=...
  const token = searchParams.get('token') || paramSessionId || '';

  // Estados de Verificación y Carga
  const [isVerifying, setIsVerifying] = useState(true);
  const [verifyData, setVerifyData] = useState<VerificationResult | null>(null);

  // Estados del Cuestionario y Respuestas
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [customTextInputs, setCustomTextInputs] = useState<Record<string, string>>({});

  // Estados de la Cámara y Foto Clínica Obligatoria
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [capturedPhotoUrl, setCapturedPhotoUrl] = useState<string | null>(null);
  const [cameraFacing, setCameraFacing] = useState<'user' | 'environment'>('user');
  const videoRef = useRef<HTMLVideoElement>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);

  // Estado de Envío Final
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);

  // 1. Verificar el token con Supabase PostgreSQL RPC (Fase 1 Engine)
  useEffect(() => {
    async function verifyToken() {
      if (!token) {
        setVerifyData({ valid: false, reason: 'TOKEN_MISSING', message: 'No se especificó un código de enlace válido.' });
        setIsVerifying(false);
        return;
      }

      try {
        setIsVerifying(true);
        const { data, error } = await supabase.rpc('verify_patient_token', { p_token: token });

        if (error) {
          console.error('[Dentaxy] Error al verificar token:', error);
          setVerifyData({ valid: false, reason: 'ERROR', message: 'Error de conexión con el servidor.' });
        } else {
          setVerifyData(data as VerificationResult);
        }
      } catch (err) {
        console.error('[Dentaxy] Excepción de verificación:', err);
        setVerifyData({ valid: false, reason: 'ERROR', message: 'No se pudo validar el enlace.' });
      } finally {
        setIsVerifying(false);
      }
    }

    verifyToken();
  }, [token]);

  // Manejo del Stream de Cámara
  const startCamera = async (facing: 'user' | 'environment' = 'user') => {
    try {
      if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach(track => track.stop());
      }
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: facing, width: { ideal: 1080 }, height: { ideal: 1080 } },
        audio: false
      });
      mediaStreamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
      setIsCameraActive(true);
    } catch (err) {
      console.error('[Dentaxy Camera] Error al iniciar la cámara:', err);
      toast.error('No se pudo acceder a la cámara. Revisa los permisos de tu navegador.');
    }
  };

  const stopCamera = () => {
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach(track => track.stop());
      mediaStreamRef.current = null;
    }
    setIsCameraActive(false);
  };

  const capturePhoto = () => {
    if (!videoRef.current) return;
    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth || 720;
    canvas.height = videoRef.current.videoHeight || 720;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      // Efecto espejo si la cámara es frontal
      if (cameraFacing === 'user') {
        ctx.translate(canvas.width, 0);
        ctx.scale(-1, 1);
      }
      ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL('image/jpeg', 0.88);
      setCapturedPhotoUrl(dataUrl);
      stopCamera();
      toast.success('Foto clínica capturada exitosamente');
    }
  };

  const toggleCameraFacing = () => {
    const nextFacing = cameraFacing === 'user' ? 'environment' : 'user';
    setCameraFacing(nextFacing);
    startCamera(nextFacing);
  };

  // Cuestionario dinámico: preguntas obtenidas del template o fallbacks NOM-004
  const questions = verifyData?.template?.questions || (
    verifyData?.specialty_type === 'URGENCIAS' ? [
      { id: "urg_motivo", type: "choice" as const, label: "¿Cuál es el dolor o problema principal en este momento?", options: ["Dolor intenso espontáneo", "Dolor al masticar/frío/caliente", "Diente roto o zafado por golpe", "Inflamación/Hinchazón en cara o encía", "Sangrado constante"] },
      { id: "urg_escala_dolor", type: "range" as const, label: "Escala del dolor (1 al 10)", min: 1, max: 10 },
      { id: "urg_tiempo", type: "choice" as const, label: "¿Hace cuánto comenzó el malestar?", options: ["Hace pocas horas", "1 a 2 días", "3 a 7 días", "Más de una semana"] },
      { id: "urg_traumatismo", type: "boolean" as const, label: "¿Sufrió algún golpe o accidente en la boca/rostro?" },
      { id: "urg_hemorragia", type: "boolean" as const, label: "¿Tiene sangrado activo en este momento?" },
      { id: "urg_alergia_med", type: "boolean" as const, label: "¿Es alérgico a la penicilina o algún medicamento?" },
      { id: "urg_sistemica_critica", type: "boolean" as const, label: "¿Padece del corazón, diabetes descontrolada o presión alta?" }
    ] : [
      { id: "gen_antecedentes", type: "multi_choice" as const, label: "¿Padece o ha padecido alguna de estas enfermedades?", options: ["Diabetes", "Hipertensión", "Problemas Cardíacos", "Problemas Hepáticos", "Enfermedad Renal", "Ninguna"] },
      { id: "gen_alergias", type: "multi_choice" as const, label: "¿Tiene alguna alergia conocida?", options: ["Medicamentos (Penicilina/Ibuprofeno)", "Alimentos", "Látex", "Ninguna"] },
      { id: "gen_medicamentos_actuales", type: "boolean_text" as const, label: "¿Está tomando algún medicamento recetado actualmente?", placeholder: "Especifique el medicamento" },
      { id: "gen_cirugias_anestesia", type: "boolean" as const, label: "¿Ha tenido cirugías o problemas con la anestesia dental en el pasado?" },
      { id: "gen_habitos", type: "boolean" as const, label: "¿Fuma, consume alcohol frecuentemente o mastica tabaco?" },
      { id: "gen_embarazo_lactancia", type: "choice" as const, label: "¿Se encuentra actualmente embarazada o en periodo de lactancia?", options: ["Sí (Embarazada)", "Sí (Lactando)", "No", "No aplica"] }
    ]
  );

  const totalSteps = questions.length + 1; // Preguntas + Foto Clínica Obligatoria
  const isCameraStep = currentStepIndex === questions.length;
  const currentQuestion = questions[currentStepIndex];

  // Manejo de selecciones de 1 solo clic
  const handleSelectOption = (questionId: string, value: any) => {
    setAnswers(prev => ({ ...prev, [questionId]: value }));
    // Avance automático suave de 1 solo clic
    if (currentStepIndex < questions.length - 1) {
      setTimeout(() => setCurrentStepIndex(prev => prev + 1), 220);
    } else {
      setTimeout(() => setCurrentStepIndex(questions.length), 220);
    }
  };

  const handleToggleMultiChoice = (questionId: string, option: string) => {
    const currentList: string[] = answers[questionId] || [];
    let updated: string[];
    if (option === 'Ninguna') {
      updated = ['Ninguna'];
    } else {
      const filtered = currentList.filter(o => o !== 'Ninguna');
      if (filtered.includes(option)) {
        updated = filtered.filter(o => o !== option);
      } else {
        updated = [...filtered, option];
      }
    }
    setAnswers(prev => ({ ...prev, [questionId]: updated }));
  };

  // Envío Final del Cuestionario + Foto Clínica
  const handleSubmitAll = async () => {
    if (!capturedPhotoUrl) {
      toast.error('La foto clínica es obligatoria para tu expediente médico.');
      return;
    }

    try {
      setIsSubmitting(true);
      const deviceInfo = {
        userAgent: navigator.userAgent,
        screen: `${window.innerWidth}x${window.innerHeight}`,
        language: navigator.language
      };

      const { data, error } = await supabase.rpc('submit_patient_response', {
        p_token: token,
        p_responses_json: { ...answers, customInputs: customTextInputs },
        p_clinical_photo_url: capturedPhotoUrl,
        p_device_info: deviceInfo
      });

      if (error || !data?.success) {
        console.error('[Dentaxy] Error en envío:', error || data?.error);
        toast.error(data?.error || 'Error al guardar tus respuestas. Intenta de nuevo.');
      } else {
        setIsCompleted(true);
        toast.success('¡Expediente guardado y enviado a tu doctor!');
      }
    } catch (err) {
      console.error('[Dentaxy] Excepción en envío:', err);
      toast.error('No se pudo enviar la información.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // ── PANTALLAS DE ESTADO (Carga, Token Inválido/Inactivo, Completado) ──

  if (isVerifying) {
    return (
      <div className="min-h-screen bg-[#f5f7fa] flex flex-col items-center justify-center p-6 text-slate-700">
        <div className="w-16 h-16 rounded-3xl bg-white/70 backdrop-blur-xl border border-white/80 shadow-[0_20px_50px_rgba(0,0,0,0.06)] flex items-center justify-center mb-4">
          <RefreshCw className="animate-spin text-emerald-500" size={28} />
        </div>
        <p className="text-xs font-extrabold uppercase tracking-widest text-slate-500 font-mono">Verificando enlace clínico...</p>
      </div>
    );
  }

  if (!verifyData?.valid) {
    const isInactive = verifyData?.reason === 'TOKEN_INACTIVE';
    return (
      <div className="min-h-screen bg-[#f5f7fa] flex flex-col items-center justify-center p-6 select-none font-sans">
        <div className="w-full max-w-md bg-white/70 backdrop-blur-[24px] border border-white/80 rounded-[32px] p-8 shadow-[0_20px_60px_rgba(0,0,0,0.06)] flex flex-col items-center text-center">
          <div className={`w-16 h-16 rounded-full ${isInactive ? 'bg-amber-50 border border-amber-200 text-amber-500' : 'bg-rose-50 border border-rose-200 text-rose-500'} flex items-center justify-center mb-5`}>
            {isInactive ? <Lock size={28} /> : <AlertTriangle size={28} />}
          </div>
          <h2 className="text-lg font-black text-slate-800 tracking-wide font-[Bruno_Ace_SC] mb-2 uppercase">
            {isInactive ? 'Enlace en Pausa' : 'Enlace No Disponible'}
          </h2>
          <p className="text-xs text-slate-500 font-medium leading-relaxed mb-6">
            {verifyData?.message || (isInactive 
              ? 'Tu odontólogo ha pausado temporalmente este enlace para tu expediente.' 
              : 'El código de consulta no existe o ya fue completado previo a esta sesión.')}
          </p>
          <div className="flex items-center gap-2 text-[10px] text-slate-400 font-mono uppercase bg-slate-100/60 px-4 py-2 rounded-full border border-slate-200/50">
            <ShieldCheck size={12} className="text-emerald-500" />
            <span>NOM-004-SSA3-2012 • Dentaxy Zero-Trust</span>
          </div>
        </div>
      </div>
    );
  }

  if (isCompleted) {
    return (
      <div className="min-h-screen bg-[#f5f7fa] flex flex-col items-center justify-center p-6 select-none font-sans">
        <div className="w-full max-w-md bg-white/80 backdrop-blur-[24px] border border-white/90 rounded-[36px] p-8 shadow-[0_24px_70px_rgba(0,0,0,0.08)] flex flex-col items-center text-center">
          <div className="w-20 h-20 bg-emerald-500/10 rounded-full flex items-center justify-center mb-6 relative">
            <div className="absolute inset-0 bg-emerald-500/10 rounded-full animate-ping opacity-70" />
            <div className="w-14 h-14 bg-gradient-to-tr from-emerald-500 to-teal-400 rounded-full flex items-center justify-center text-white shadow-[0_10px_25px_rgba(16,185,129,0.35)]">
              <Check size={32} />
            </div>
          </div>
          <span className="text-[9.5px] font-black text-emerald-600 tracking-[0.2em] uppercase font-mono bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200/60 mb-2">
            EXPEDIENTE TRANSMITIDO
          </span>
          <h2 className="text-xl font-bold text-slate-900 mb-3 tracking-tight">
            ¡Información Guardada, {verifyData.patient_name || 'Paciente'}!
          </h2>
          <p className="text-xs text-slate-500 leading-relaxed mb-6 font-medium">
            Tus respuestas y tu foto clínica se han integrado directamente en tu expediente electrónico privado.
          </p>
          <div className="w-full bg-slate-900 text-white rounded-2xl p-4 text-xs font-semibold flex items-center justify-center gap-2 shadow-lg mb-4">
            <Smartphone size={16} />
            <span>Puedes cerrar esta pantalla de forma segura</span>
          </div>
        </div>
      </div>
    );
  }

  // ── RENDERIZADO PRINCIPAL DE LA INTERFAZ WHITE GLASSMORPHISM (100% MÓVIL) ──

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#f8fafc] via-[#f1f5f9] to-[#e2e8f0] text-slate-900 flex flex-col items-center justify-between p-4 sm:p-6 relative overflow-x-hidden font-sans select-none">
      
      {/* Luces 3D translúcidas de fondo (Aesthetic VanGox / Dentaxy Glass) */}
      <div className="fixed -top-24 -left-20 w-80 h-80 bg-emerald-400/20 rounded-full blur-[100px] pointer-events-none" />
      <div className="fixed -bottom-24 -right-20 w-80 h-80 bg-teal-400/20 rounded-full blur-[100px] pointer-events-none" />

      {/* CABECERA SUPERIOR WHITE GLASS */}
      <header className="w-full max-w-md bg-white/60 backdrop-blur-[20px] border border-white/80 rounded-[24px] px-5 py-3.5 flex items-center justify-between shadow-[0_8px_30px_rgba(0,0,0,0.04)] z-20 mb-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white shadow-md">
            {verifyData.specialty_type === 'URGENCIAS' ? <Zap size={18} /> : <Stethoscope size={18} />}
          </div>
          <div className="flex flex-col">
            <span className="text-[9px] font-black text-emerald-600 tracking-[0.18em] uppercase font-mono">
              DENTAXY • {verifyData.specialty_type}
            </span>
            <h1 className="text-xs font-extrabold text-slate-800 tracking-wide font-[Bruno_Ace_SC] truncate max-w-[200px]">
              {verifyData.patient_name || 'Expediente Clínico'}
            </h1>
          </div>
        </div>

        {/* Contador de pasos */}
        <div className="flex items-center gap-1.5 bg-slate-900/5 px-3 py-1 rounded-full border border-slate-900/10">
          <span className="text-[11px] font-bold text-slate-800 font-mono">
            {currentStepIndex + 1}/{totalSteps}
          </span>
        </div>
      </header>

      {/* BARRA DE PROGRESO DINÁMICA */}
      <div className="w-full max-w-md h-1.5 bg-slate-200/60 rounded-full overflow-hidden mb-5 z-20">
        <div 
          className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 transition-all duration-300 ease-out rounded-full"
          style={{ width: `${((currentStepIndex + 1) / totalSteps) * 100}%` }}
        />
      </div>

      {/* CONTENEDOR CENTRAL: PREGUNTAS EN TARJETAS GLASSMORPHISM */}
      <main className="w-full max-w-md flex-1 flex flex-col justify-center z-20 mb-6">
        
        {!isCameraStep ? (
          /* ── PASO DE CUESTIONARIO (1 CLIC DIRECTO) ── */
          <div 
            key={currentQuestion.id}
            className="w-full bg-white/75 backdrop-blur-[28px] border border-white/90 rounded-[36px] p-6 sm:p-7 shadow-[0_20px_50px_rgba(0,0,0,0.06)] flex flex-col justify-between animate-in fade-in slide-in-from-bottom-4 duration-300"
          >
            <div>
              {/* Etiqueta de la pregunta */}
              <div className="flex items-center gap-2 mb-3">
                <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.6)]" />
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono">
                  Pregunta {currentStepIndex + 1}
                </span>
              </div>

              <h2 className="text-base sm:text-lg font-bold text-slate-800 leading-snug tracking-tight mb-6">
                {currentQuestion.label}
              </h2>

              {/* OPCIONES TIPO CHOICE (1 SOLO CLIC) */}
              {currentQuestion.type === 'choice' && currentQuestion.options && (
                <div className="flex flex-col gap-3">
                  {currentQuestion.options.map((option) => {
                    const isSelected = answers[currentQuestion.id] === option;
                    return (
                      <button
                        key={option}
                        onClick={() => handleSelectOption(currentQuestion.id, option)}
                        className={`w-full p-4 rounded-2xl text-left text-xs sm:text-sm font-semibold transition-all flex items-center justify-between active:scale-[0.98] ${
                          isSelected
                            ? 'bg-slate-900 text-white shadow-lg border border-slate-800'
                            : 'bg-white/80 border border-slate-200/80 text-slate-700 hover:bg-white hover:border-slate-300 shadow-sm'
                        }`}
                      >
                        <span>{option}</span>
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center border transition-all ${
                          isSelected ? 'bg-emerald-500 border-emerald-400 text-white' : 'border-slate-300 bg-slate-50'
                        }`}>
                          {isSelected ? <Check size={14} /> : <ChevronRight size={14} className="text-slate-400" />}
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}

              {/* OPCIONES BOOLEAN (SÍ / NO DE 1 CLIC) */}
              {currentQuestion.type === 'boolean' && (
                <div className="grid grid-cols-2 gap-4">
                  {['Sí', 'No'].map((opt) => {
                    const val = opt === 'Sí';
                    const isSelected = answers[currentQuestion.id] === val;
                    return (
                      <button
                        key={opt}
                        onClick={() => handleSelectOption(currentQuestion.id, val)}
                        className={`h-20 rounded-2xl text-base sm:text-lg font-extrabold flex flex-col items-center justify-center gap-1 transition-all active:scale-[0.97] ${
                          isSelected
                            ? opt === 'Sí' ? 'bg-rose-600 text-white shadow-lg' : 'bg-slate-900 text-white shadow-lg'
                            : 'bg-white/80 border border-slate-200/80 text-slate-700 hover:bg-white shadow-sm'
                        }`}
                      >
                        <span>{opt}</span>
                      </button>
                    );
                  })}
                </div>
              )}

              {/* BOOLEAN CON INPUT OPCIONAL DE TEXTO */}
              {currentQuestion.type === 'boolean_text' && (
                <div className="flex flex-col gap-4">
                  <div className="grid grid-cols-2 gap-3">
                    {['Sí', 'No'].map((opt) => {
                      const val = opt === 'Sí';
                      const isSelected = answers[currentQuestion.id] === val;
                      return (
                        <button
                          key={opt}
                          onClick={() => {
                            setAnswers(prev => ({ ...prev, [currentQuestion.id]: val }));
                            if (!val) {
                              // Si elige No, avanza directo
                              if (currentStepIndex < questions.length - 1) setCurrentStepIndex(prev => prev + 1);
                              else setCurrentStepIndex(questions.length);
                            }
                          }}
                          className={`h-16 rounded-2xl text-sm font-bold flex items-center justify-center transition-all ${
                            isSelected
                              ? 'bg-slate-900 text-white shadow-md'
                              : 'bg-white/80 border border-slate-200/80 text-slate-700'
                          }`}
                        >
                          {opt}
                        </button>
                      );
                    })}
                  </div>

                  {answers[currentQuestion.id] === true && (
                    <div className="animate-in fade-in duration-200">
                      <input
                        type="text"
                        value={customTextInputs[currentQuestion.id] || ''}
                        onChange={(e) => setCustomTextInputs(prev => ({ ...prev, [currentQuestion.id]: e.target.value }))}
                        placeholder={currentQuestion.placeholder || "Especifique aquí..."}
                        className="w-full bg-white border border-slate-300 text-slate-800 text-xs px-4 py-3.5 rounded-xl outline-none focus:border-slate-500 shadow-inner font-medium"
                      />
                      <button
                        onClick={() => {
                          if (currentStepIndex < questions.length - 1) setCurrentStepIndex(prev => prev + 1);
                          else setCurrentStepIndex(questions.length);
                        }}
                        className="w-full mt-3 bg-emerald-600 hover:bg-emerald-700 text-white py-3 rounded-xl font-bold text-xs shadow-sm"
                      >
                        Continuar
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* OPCIONES SELECCIÓN MÚLTIPLE (CHIPS) */}
              {currentQuestion.type === 'multi_choice' && currentQuestion.options && (
                <div className="flex flex-col gap-4">
                  <div className="flex flex-wrap gap-2.5">
                    {currentQuestion.options.map((option) => {
                      const selectedList: string[] = answers[currentQuestion.id] || [];
                      const isSelected = selectedList.includes(option);
                      return (
                        <button
                          key={option}
                          onClick={() => handleToggleMultiChoice(currentQuestion.id, option)}
                          className={`px-4 py-3 rounded-2xl text-xs font-bold transition-all border active:scale-95 flex items-center gap-2 ${
                            isSelected
                              ? 'bg-slate-900 text-white border-slate-900 shadow-md'
                              : 'bg-white/80 text-slate-700 border-slate-200/80 hover:bg-white shadow-sm'
                          }`}
                        >
                          <div className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] ${isSelected ? 'bg-emerald-400 text-slate-900' : 'border border-slate-300'}`}>
                            {isSelected && <Check size={10} />}
                          </div>
                          <span>{option}</span>
                        </button>
                      );
                    })}
                  </div>

                  <button
                    onClick={() => {
                      if (currentStepIndex < questions.length - 1) setCurrentStepIndex(prev => prev + 1);
                      else setCurrentStepIndex(questions.length);
                    }}
                    disabled={!answers[currentQuestion.id] || answers[currentQuestion.id].length === 0}
                    className="w-full mt-3 bg-slate-900 hover:bg-slate-800 text-white py-3.5 rounded-2xl font-bold text-xs shadow-md disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    <span>Siguiente</span>
                    <ChevronRight size={16} />
                  </button>
                </div>
              )}

              {/* ESCALA DEL DOLOR (RANGO 1 A 10 CON PILLS) */}
              {currentQuestion.type === 'range' && (
                <div className="flex flex-col gap-4">
                  <div className="grid grid-cols-5 gap-2.5">
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => {
                      const isSelected = answers[currentQuestion.id] === num;
                      const isHigh = num >= 7;
                      return (
                        <button
                          key={num}
                          onClick={() => handleSelectOption(currentQuestion.id, num)}
                          className={`h-12 rounded-xl text-sm font-extrabold transition-all border active:scale-95 ${
                            isSelected
                              ? isHigh ? 'bg-rose-600 text-white border-rose-500 shadow-lg scale-105' : 'bg-slate-900 text-white border-slate-900 shadow-lg scale-105'
                              : 'bg-white/80 text-slate-700 border-slate-200 hover:bg-white'
                          }`}
                        >
                          {num}
                        </button>
                      );
                    })}
                  </div>
                  <div className="flex justify-between text-[9px] font-bold uppercase tracking-wider text-slate-400 px-1 font-mono">
                    <span>1 • Leve</span>
                    <span>5 • Moderado</span>
                    <span>10 • Intenso</span>
                  </div>
                </div>
              )}

            </div>

            {/* BOTONES NAVEGACIÓN INFERIOR */}
            <div className="flex items-center justify-between pt-6 mt-6 border-t border-slate-200/50">
              <button
                onClick={() => setCurrentStepIndex(prev => Math.max(0, prev - 1))}
                disabled={currentStepIndex === 0}
                className="text-xs font-bold text-slate-400 hover:text-slate-600 transition disabled:opacity-0 flex items-center gap-1"
              >
                <ChevronLeft size={16} />
                <span>Anterior</span>
              </button>
              
              <span className="text-[9.5px] font-mono font-bold text-slate-400 uppercase tracking-widest">
                Dentaxy NOM-004
              </span>
            </div>
          </div>
        ) : (
          /* ── PASO OBLIGATORIO DE FOTO CLÍNICA DEL PACIENTE ── */
          <div className="w-full bg-white/80 backdrop-blur-[28px] border border-white/90 rounded-[36px] p-6 shadow-[0_20px_50px_rgba(0,0,0,0.08)] flex flex-col items-center text-center animate-in fade-in duration-300">
            
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white shadow-md mb-3">
              <Camera size={22} />
            </div>

            <span className="text-[9px] font-black text-rose-600 tracking-[0.2em] uppercase font-mono bg-rose-50 px-3 py-1 rounded-full border border-rose-200/60 mb-2">
              REQUISITO OBLIGATORIO
            </span>

            <h2 className="text-base sm:text-lg font-extrabold text-slate-900 tracking-tight mb-2">
              Fotografía Clínica de Identificación
            </h2>
            <p className="text-xs text-slate-500 font-medium leading-relaxed mb-5 max-w-xs">
              Toma una captura clara de tu rostro para vincularla de forma privada a tu expediente legal.
            </p>

            {/* VISTA PREVIA O CÁMARA EN VIVO */}
            <div className="w-full aspect-square max-w-[280px] bg-slate-900 rounded-[28px] overflow-hidden relative shadow-inner mb-5 flex items-center justify-center border-4 border-white shadow-xl">
              
              {capturedPhotoUrl ? (
                <img src={capturedPhotoUrl} alt="Foto Clínica" className="w-full h-full object-cover" />
              ) : isCameraActive ? (
                <>
                  <video 
                    ref={videoRef} 
                    playsInline 
                    muted 
                    className={`w-full h-full object-cover ${cameraFacing === 'user' ? 'scale-x-[-1]' : ''}`} 
                  />
                  {/* Encuadre ovalado 3D de guía facial */}
                  <div className="absolute inset-0 border-[3px] border-dashed border-emerald-400/70 rounded-full scale-[0.82] pointer-events-none shadow-[0_0_20px_rgba(16,185,129,0.3)] flex items-center justify-center">
                    <span className="text-[9px] font-bold text-white/90 bg-black/50 px-2.5 py-0.5 rounded-full backdrop-blur-sm uppercase tracking-wider font-mono">
                      Alinea tu rostro
                    </span>
                  </div>
                </>
              ) : (
                <div className="flex flex-col items-center text-slate-400 gap-3 px-4">
                  <User size={48} className="opacity-40" />
                  <span className="text-xs font-semibold text-slate-300">Cámara apagada</span>
                </div>
              )}

              {/* Botón alternar cámara frontal/trasera si está activa */}
              {isCameraActive && (
                <button
                  onClick={toggleCameraFacing}
                  className="absolute top-3 right-3 p-2.5 rounded-full bg-black/60 text-white backdrop-blur-md hover:bg-black/80 transition active:scale-95"
                >
                  <RefreshCw size={16} />
                </button>
              )}
            </div>

            {/* CONTROLES DE LA FOTO */}
            <div className="w-full flex flex-col gap-3">
              {capturedPhotoUrl ? (
                <>
                  <button
                    onClick={handleSubmitAll}
                    disabled={isSubmitting}
                    className="w-full py-4 bg-slate-900 hover:bg-slate-800 text-white rounded-2xl font-bold text-xs shadow-lg transition active:scale-95 flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? <RefreshCw size={16} className="animate-spin" /> : <ShieldCheck size={18} className="text-emerald-400" />}
                    <span>{isSubmitting ? 'Enviando...' : 'Confirmar y Enviar Expediente'}</span>
                  </button>

                  <button
                    onClick={() => { setCapturedPhotoUrl(null); startCamera(); }}
                    disabled={isSubmitting}
                    className="w-full py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-2xl font-bold text-xs transition"
                  >
                    Repetir Foto
                  </button>
                </>
              ) : isCameraActive ? (
                <button
                  onClick={capturePhoto}
                  className="w-full py-4 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white rounded-2xl font-extrabold text-xs shadow-lg transition active:scale-95 flex items-center justify-center gap-2"
                >
                  <Camera size={18} />
                  <span>Capturar Foto Ahora</span>
                </button>
              ) : (
                <button
                  onClick={() => startCamera(cameraFacing)}
                  className="w-full py-4 bg-slate-900 hover:bg-slate-800 text-white rounded-2xl font-bold text-xs shadow-lg transition active:scale-95 flex items-center justify-center gap-2"
                >
                  <Camera size={18} className="text-emerald-400" />
                  <span>Activar Cámara del Dispositivo</span>
                </button>
              )}
            </div>

            <button
              onClick={() => setCurrentStepIndex(questions.length - 1)}
              className="mt-4 text-xs font-bold text-slate-400 hover:text-slate-600 transition flex items-center gap-1"
            >
              <ChevronLeft size={16} />
              <span>Volver a las preguntas</span>
            </button>
          </div>
        )}

      </main>

      {/* PIE DE PÁGINA CONFIDENCIALIDAD */}
      <footer className="w-full max-w-md bg-white/40 backdrop-blur-md border border-white/60 rounded-2xl px-4 py-2.5 text-center z-20 flex items-center justify-between text-[9px] font-mono text-slate-500 font-bold uppercase tracking-wider">
        <div className="flex items-center gap-1.5 text-slate-600">
          <Lock size={11} className="text-emerald-600" />
          <span>Encriptado Zero-Trust</span>
        </div>
        <span>NOM-004-SSA3-2012</span>
      </footer>

    </div>
  );
}
